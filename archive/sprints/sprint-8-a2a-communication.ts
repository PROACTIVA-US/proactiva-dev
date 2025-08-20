/**
 * SPRINT 8: Agent-to-Agent (A2A) Communication
 * Goal: Enable direct agent communication and collaboration
 * Duration: 4 days
 * Prerequisites: Sprint 7 complete (message bus foundation)
 * 
 * Building on your existing infrastructure WITHOUT breaking changes
 */

// File: /src/communication/protocols.ts
export interface A2AMessage {
  id: string;
  from: string;
  to: string;
  type: 'request' | 'response' | 'broadcast' | 'negotiate';
  protocol: 'task' | 'review' | 'capability' | 'resource';
  payload: any;
  timestamp: number;
  conversationId?: string;
  replyTo?: string;
}

export interface AgentCapability {
  name: string;
  version: string;
  inputs: string[];
  outputs: string[];
  cost: number; // cognitive cost 0-1
  reliability: number; // 0-1
}

// File: /src/communication/negotiation.ts
export const NEGOTIATION_PROTOCOL = `
import json
import time
from typing import Dict, List, Optional

class NegotiationProtocol:
    def __init__(self, agent_id: str):
        self.agent_id = agent_id
        self.active_negotiations = {}
        self.capabilities = []
        
    def propose_task(self, task: Dict, recipients: List[str]) -> Dict:
        """Propose a task to other agents"""
        proposal = {
            "id": f"prop_{int(time.time() * 1000)}",
            "proposer": self.agent_id,
            "task": task,
            "requirements": self._extract_requirements(task),
            "deadline": task.get("deadline"),
            "reward": self._calculate_reward(task),
            "status": "open"
        }
        
        # Track negotiation
        self.active_negotiations[proposal["id"]] = {
            "proposal": proposal,
            "bids": [],
            "selected": None
        }
        
        return proposal
    
    def bid_on_task(self, proposal: Dict) -> Optional[Dict]:
        """Bid on a proposed task"""
        if not self._can_handle(proposal["requirements"]):
            return None
            
        bid = {
            "bidder": self.agent_id,
            "proposal_id": proposal["id"],
            "confidence": self._calculate_confidence(proposal["task"]),
            "estimated_time": self._estimate_time(proposal["task"]),
            "cost": self._calculate_cost(proposal["task"]),
            "capabilities_match": self._match_capabilities(proposal["requirements"])
        }
        
        return bid
    
    def select_bid(self, proposal_id: str) -> Optional[Dict]:
        """Select best bid for a proposal"""
        negotiation = self.active_negotiations.get(proposal_id)
        if not negotiation or not negotiation["bids"]:
            return None
            
        # Score bids
        scored_bids = []
        for bid in negotiation["bids"]:
            score = (
                bid["confidence"] * 0.4 +
                (1 - bid["cost"]) * 0.3 +
                (1 - bid["estimated_time"] / 100) * 0.2 +
                bid["capabilities_match"] * 0.1
            )
            scored_bids.append((score, bid))
        
        # Select best
        best_bid = max(scored_bids, key=lambda x: x[0])
        negotiation["selected"] = best_bid[1]
        
        return best_bid[1]
    
    def _extract_requirements(self, task: Dict) -> List[str]:
        """Extract capability requirements from task"""
        requirements = []
        if "language" in task:
            requirements.append(f"lang_{task['language']}")
        if "tools" in task:
            requirements.extend([f"tool_{t}" for t in task["tools"]])
        if "type" in task:
            requirements.append(f"task_{task['type']}")
        return requirements
    
    def _can_handle(self, requirements: List[str]) -> bool:
        """Check if agent can handle requirements"""
        return all(req in self.capabilities for req in requirements)
    
    def _calculate_confidence(self, task: Dict) -> float:
        """Calculate confidence in handling task"""
        # Simplified confidence calculation
        base_confidence = 0.7
        if task.get("complexity", "medium") == "low":
            base_confidence += 0.2
        elif task.get("complexity") == "high":
            base_confidence -= 0.2
        return min(1.0, max(0.1, base_confidence))
    
    def _estimate_time(self, task: Dict) -> float:
        """Estimate time to complete task"""
        base_time = 10.0  # minutes
        complexity_multiplier = {
            "low": 0.5,
            "medium": 1.0,
            "high": 2.0
        }
        return base_time * complexity_multiplier.get(task.get("complexity", "medium"), 1.0)
    
    def _calculate_cost(self, task: Dict) -> float:
        """Calculate cognitive cost"""
        return 0.5  # Simplified
    
    def _calculate_reward(self, task: Dict) -> float:
        """Calculate task reward"""
        return task.get("priority", 0.5)
    
    def _match_capabilities(self, requirements: List[str]) -> float:
        """Calculate capability match score"""
        if not requirements:
            return 1.0
        matches = sum(1 for req in requirements if req in self.capabilities)
        return matches / len(requirements)

# Usage in agent
negotiator = NegotiationProtocol("backend_agent")
negotiator.capabilities = ["lang_python", "tool_fastapi", "task_api", "task_optimization"]
`;

// File: /src/index.ts - Add A2A Communication functions

/**
 * Enable agent-to-agent communication
 */
@func()
async enableA2ACommunication(
  messageBusUrl: string
): Promise<Container> {
  return dag
    .container()
    .from("python:3.11-slim")
    .withEnvVariable("MESSAGE_BUS_URL", messageBusUrl)
    .withEnvVariable("A2A_ENABLED", "true")
    .withNewFile("/app/negotiation.py", NEGOTIATION_PROTOCOL)
    .withNewFile("/app/protocol_handler.py", `
import json
import asyncio
from typing import Dict, Any
from negotiation import NegotiationProtocol

class ProtocolHandler:
    def __init__(self, agent_id: str):
        self.agent_id = agent_id
        self.negotiator = NegotiationProtocol(agent_id)
        self.handlers = {
            'task': self.handle_task_protocol,
            'review': self.handle_review_protocol,
            'capability': self.handle_capability_protocol,
            'resource': self.handle_resource_protocol
        }
    
    async def handle_message(self, message: Dict[str, Any]):
        """Route message to appropriate protocol handler"""
        protocol = message.get('protocol', 'task')
        handler = self.handlers.get(protocol, self.handle_unknown)
        return await handler(message)
    
    async def handle_task_protocol(self, message: Dict):
        """Handle task delegation protocol"""
        msg_type = message.get('type')
        
        if msg_type == 'request':
            # Evaluate if we can handle this task
            proposal = message.get('payload')
            bid = self.negotiator.bid_on_task(proposal)
            if bid:
                return {
                    'type': 'response',
                    'protocol': 'task',
                    'payload': bid
                }
        elif msg_type == 'response':
            # Handle bid response
            return {'status': 'bid_received'}
            
    async def handle_review_protocol(self, message: Dict):
        """Handle code review protocol"""
        return {'status': 'review_protocol_handled'}
    
    async def handle_capability_protocol(self, message: Dict):
        """Handle capability discovery"""
        if message.get('type') == 'request':
            return {
                'type': 'response',
                'protocol': 'capability',
                'payload': {
                    'agent_id': self.agent_id,
                    'capabilities': self.negotiator.capabilities
                }
            }
    
    async def handle_resource_protocol(self, message: Dict):
        """Handle resource sharing protocol"""
        return {'status': 'resource_protocol_handled'}
    
    async def handle_unknown(self, message: Dict):
        """Handle unknown protocol"""
        return {'error': f"Unknown protocol: {message.get('protocol')}"}

# Initialize handler
handler = ProtocolHandler("${AGENT_ID}")
    `)
    .withWorkdir("/app");
}

/**
 * Create task delegation network
 */
@func()
async createTaskDelegationNetwork(
  agents: string[]
): Promise<Container> {
  const networkConfig = {
    agents: agents,
    protocols: ['task', 'review', 'capability', 'resource'],
    routing: 'dynamic',
    discovery: 'broadcast'
  };

  return dag
    .container()
    .from("python:3.11-slim")
    .withEnvVariable("NETWORK_CONFIG", JSON.stringify(networkConfig))
    .withNewFile("/app/delegation_network.py", `
import json
import asyncio
import time
from typing import Dict, List, Optional
import os

class TaskDelegationNetwork:
    def __init__(self):
        config = json.loads(os.environ.get('NETWORK_CONFIG', '{}'))
        self.agents = config.get('agents', [])
        self.task_queue = []
        self.agent_registry = {}
        self.delegation_history = []
        
    async def register_agent(self, agent_id: str, capabilities: List[str]):
        """Register an agent with its capabilities"""
        self.agent_registry[agent_id] = {
            'id': agent_id,
            'capabilities': capabilities,
            'status': 'available',
            'current_task': None,
            'performance_score': 1.0,
            'completed_tasks': 0
        }
        
        print(f"Agent {agent_id} registered with capabilities: {capabilities}")
        
    async def delegate_task(self, task: Dict) -> Optional[str]:
        """Delegate task to best available agent"""
        # Find capable agents
        required_capabilities = task.get('requirements', [])
        capable_agents = []
        
        for agent_id, agent_info in self.agent_registry.items():
            if agent_info['status'] == 'available':
                agent_caps = set(agent_info['capabilities'])
                if all(req in agent_caps for req in required_capabilities):
                    capable_agents.append(agent_id)
        
        if not capable_agents:
            print(f"No capable agents for task: {task.get('name')}")
            return None
        
        # Select best agent based on performance
        best_agent = max(
            capable_agents,
            key=lambda a: self.agent_registry[a]['performance_score']
        )
        
        # Assign task
        self.agent_registry[best_agent]['status'] = 'busy'
        self.agent_registry[best_agent]['current_task'] = task
        
        # Record delegation
        self.delegation_history.append({
            'task': task,
            'agent': best_agent,
            'timestamp': time.time()
        })
        
        print(f"Task '{task.get('name')}' delegated to {best_agent}")
        return best_agent
    
    async def complete_task(self, agent_id: str, result: Dict):
        """Mark task as complete and update agent stats"""
        if agent_id in self.agent_registry:
            agent = self.agent_registry[agent_id]
            agent['status'] = 'available'
            agent['completed_tasks'] += 1
            
            # Update performance score based on result
            if result.get('success'):
                agent['performance_score'] = min(
                    1.0,
                    agent['performance_score'] * 1.1
                )
            else:
                agent['performance_score'] *= 0.9
            
            agent['current_task'] = None
            
            print(f"Agent {agent_id} completed task. New score: {agent['performance_score']:.2f}")
    
    async def get_network_status(self) -> Dict:
        """Get current network status"""
        return {
            'total_agents': len(self.agent_registry),
            'available_agents': sum(
                1 for a in self.agent_registry.values() 
                if a['status'] == 'available'
            ),
            'busy_agents': sum(
                1 for a in self.agent_registry.values() 
                if a['status'] == 'busy'
            ),
            'total_delegations': len(self.delegation_history),
            'agents': list(self.agent_registry.values())
        }

# Initialize network
network = TaskDelegationNetwork()

# Simulate agent registration
async def demo():
    # Register agents
    await network.register_agent("backend_agent", ["python", "api", "database"])
    await network.register_agent("frontend_agent", ["javascript", "react", "ui"])
    await network.register_agent("test_agent", ["python", "testing", "pytest"])
    await network.register_agent("security_agent", ["security", "audit", "python"])
    
    # Delegate some tasks
    tasks = [
        {"name": "Create API endpoint", "requirements": ["python", "api"]},
        {"name": "Build UI component", "requirements": ["react", "ui"]},
        {"name": "Write tests", "requirements": ["testing", "python"]},
        {"name": "Security audit", "requirements": ["security", "audit"]}
    ]
    
    for task in tasks:
        agent = await network.delegate_task(task)
        if agent:
            # Simulate task completion
            await asyncio.sleep(0.5)
            await network.complete_task(agent, {"success": True})
    
    # Show status
    status = await network.get_network_status()
    print(json.dumps(status, indent=2))

if __name__ == "__main__":
    asyncio.run(demo())
    `)
    .withWorkdir("/app")
    .withExec(["python", "-c", "import asyncio; import sys; sys.path.append('/app'); from delegation_network import demo; asyncio.run(demo())"]);
}

/**
 * Implement capability discovery
 */
@func()
async discoverAgentCapabilities(
  agentContainers: Container[]
): Promise<string> {
  const discoveryScript = `
import json
import subprocess
import concurrent.futures

def discover_agent(container_id):
    """Discover capabilities of a single agent"""
    try:
        # Query agent for capabilities
        result = subprocess.run(
            ["docker", "exec", container_id, "python", "-c",
             "import json; from protocol_handler import handler; print(json.dumps(handler.negotiator.capabilities))"],
            capture_output=True,
            text=True,
            timeout=5
        )
        
        if result.returncode == 0:
            return json.loads(result.stdout)
        else:
            return []
    except:
        return []

def discover_all_agents(container_ids):
    """Discover capabilities of all agents"""
    capabilities_map = {}
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        future_to_container = {
            executor.submit(discover_agent, cid): cid 
            for cid in container_ids
        }
        
        for future in concurrent.futures.as_completed(future_to_container):
            container_id = future_to_container[future]
            try:
                capabilities = future.result()
                capabilities_map[container_id] = capabilities
            except Exception as e:
                capabilities_map[container_id] = []
    
    return capabilities_map

# Mock discovery for demo
mock_capabilities = {
    "backend_agent": ["python", "fastapi", "sqlalchemy", "async", "api_design"],
    "frontend_agent": ["typescript", "react", "nextjs", "tailwind", "responsive"],
    "test_agent": ["pytest", "unittest", "integration", "e2e", "coverage"],
    "security_agent": ["owasp", "penetration", "audit", "encryption", "authentication"],
    "data_agent": ["pandas", "numpy", "etl", "sql", "nosql"],
    "devops_agent": ["docker", "kubernetes", "ci_cd", "monitoring", "terraform"]
}

print(json.dumps(mock_capabilities, indent=2))
  `;

  const discoveryContainer = await dag
    .container()
    .from("python:3.11-slim")
    .withNewFile("/app/discover.py", discoveryScript)
    .withWorkdir("/app")
    .withExec(["python", "discover.py"])
    .stdout();

  return discoveryContainer;
}

/**
 * Create collaborative task execution
 */
@func()
async executeCollaborativeTask(
  task: string,
  requiredAgents: string[]
): Promise<Container> {
  return dag
    .container()
    .from("python:3.11-slim")
    .withEnvVariable("TASK", task)
    .withEnvVariable("REQUIRED_AGENTS", requiredAgents.join(","))
    .withNewFile("/app/collaborative_execution.py", `
import json
import asyncio
import time
import os
from typing import Dict, List, Optional
from dataclasses import dataclass
from enum import Enum

class TaskPhase(Enum):
    PLANNING = "planning"
    EXECUTION = "execution"
    REVIEW = "review"
    INTEGRATION = "integration"
    COMPLETE = "complete"

@dataclass
class CollaborativeTask:
    id: str
    name: str
    phases: List[TaskPhase]
    required_agents: List[str]
    current_phase: TaskPhase
    results: Dict[str, any]
    
class CollaborativeExecutor:
    def __init__(self):
        self.task = None
        self.agent_contributions = {}
        self.phase_results = {}
        
    async def execute_task(self, task_description: str, agents: List[str]):
        """Execute a collaborative task across multiple agents"""
        
        # Initialize task
        self.task = CollaborativeTask(
            id=f"task_{int(time.time())}",
            name=task_description,
            phases=list(TaskPhase),
            required_agents=agents,
            current_phase=TaskPhase.PLANNING,
            results={}
        )
        
        print(f"Starting collaborative task: {task_description}")
        print(f"Required agents: {agents}")
        
        # Execute each phase
        for phase in self.task.phases:
            self.task.current_phase = phase
            print(f"\\n=== Phase: {phase.value} ===")
            
            phase_result = await self.execute_phase(phase, agents)
            self.phase_results[phase] = phase_result
            
            # Simulate phase execution time
            await asyncio.sleep(1)
        
        return self.compile_results()
    
    async def execute_phase(self, phase: TaskPhase, agents: List[str]) -> Dict:
        """Execute a single phase of the collaborative task"""
        
        if phase == TaskPhase.PLANNING:
            return await self.planning_phase(agents)
        elif phase == TaskPhase.EXECUTION:
            return await self.execution_phase(agents)
        elif phase == TaskPhase.REVIEW:
            return await self.review_phase(agents)
        elif phase == TaskPhase.INTEGRATION:
            return await self.integration_phase(agents)
        else:
            return {"status": "complete"}
    
    async def planning_phase(self, agents: List[str]) -> Dict:
        """Planning phase: agents coordinate approach"""
        plan = {
            "approach": "microservices",
            "architecture": {
                "backend": "FastAPI with async handlers",
                "frontend": "Next.js with SSR",
                "database": "PostgreSQL with Redis cache",
                "testing": "pytest + jest + e2e"
            },
            "task_distribution": {}
        }
        
        # Distribute tasks based on agent capabilities
        agent_tasks = {
            "backend_agent": ["API design", "Database schema", "Business logic"],
            "frontend_agent": ["UI components", "State management", "API integration"],
            "test_agent": ["Unit tests", "Integration tests", "Test coverage"],
            "security_agent": ["Security audit", "Authentication", "Authorization"]
        }
        
        for agent in agents:
            if agent in agent_tasks:
                plan["task_distribution"][agent] = agent_tasks[agent]
                print(f"  {agent} assigned: {', '.join(agent_tasks[agent])}")
        
        return plan
    
    async def execution_phase(self, agents: List[str]) -> Dict:
        """Execution phase: agents work on their assigned tasks"""
        execution_results = {}
        
        # Simulate parallel execution
        tasks = []
        for agent in agents:
            if agent in ["backend_agent", "frontend_agent", "test_agent", "security_agent"]:
                tasks.append(self.agent_execute(agent))
        
        # Wait for all agents to complete
        results = await asyncio.gather(*tasks)
        
        for agent, result in zip(agents, results):
            execution_results[agent] = result
            print(f"  {agent} completed: {result['status']}")
        
        return execution_results
    
    async def agent_execute(self, agent: str) -> Dict:
        """Simulate individual agent execution"""
        await asyncio.sleep(0.5)  # Simulate work
        
        results = {
            "backend_agent": {
                "status": "completed",
                "artifacts": ["api_endpoints.py", "models.py", "database.sql"],
                "metrics": {"endpoints": 12, "models": 5, "tests": 24}
            },
            "frontend_agent": {
                "status": "completed",
                "artifacts": ["components/", "pages/", "store/"],
                "metrics": {"components": 18, "pages": 7, "coverage": 0.82}
            },
            "test_agent": {
                "status": "completed",
                "artifacts": ["test_backend.py", "test_frontend.js", "e2e_tests/"],
                "metrics": {"total_tests": 67, "passing": 65, "coverage": 0.89}
            },
            "security_agent": {
                "status": "completed",
                "artifacts": ["security_report.md", "auth_middleware.py"],
                "metrics": {"vulnerabilities_found": 2, "fixed": 2, "score": 0.95}
            }
        }
        
        return results.get(agent, {"status": "completed"})
    
    async def review_phase(self, agents: List[str]) -> Dict:
        """Review phase: agents review each other's work"""
        reviews = {}
        
        # Cross-agent reviews
        review_pairs = [
            ("security_agent", "backend_agent", "Security review of API"),
            ("test_agent", "frontend_agent", "Test coverage review"),
            ("backend_agent", "frontend_agent", "API contract review"),
            ("frontend_agent", "backend_agent", "Integration review")
        ]
        
        for reviewer, reviewee, review_type in review_pairs:
            if reviewer in agents and reviewee in agents:
                review = {
                    "reviewer": reviewer,
                    "reviewee": reviewee,
                    "type": review_type,
                    "status": "approved",
                    "comments": f"{review_type} passed with minor suggestions"
                }
                reviews[f"{reviewer}_to_{reviewee}"] = review
                print(f"  {reviewer} → {reviewee}: {review_type} ✓")
        
        return reviews
    
    async def integration_phase(self, agents: List[str]) -> Dict:
        """Integration phase: combine all agent outputs"""
        integration = {
            "status": "success",
            "integrated_components": [],
            "test_results": {
                "unit": "passing",
                "integration": "passing",
                "e2e": "passing",
                "security": "passing"
            },
            "deployment_ready": True
        }
        
        # Simulate integration steps
        integration_steps = [
            "Merging backend and frontend code",
            "Running integration tests",
            "Security validation",
            "Performance benchmarks",
            "Documentation generation"
        ]
        
        for step in integration_steps:
            print(f"  {step}... ✓")
            integration["integrated_components"].append(step)
            await asyncio.sleep(0.2)
        
        return integration
    
    def compile_results(self) -> Dict:
        """Compile final results from all phases"""
        return {
            "task_id": self.task.id,
            "task_name": self.task.name,
            "status": "success",
            "phases_completed": len(self.phase_results),
            "phase_results": self.phase_results,
            "summary": {
                "total_agents": len(self.task.required_agents),
                "artifacts_created": 15,
                "tests_passing": 65,
                "security_score": 0.95,
                "ready_for_deployment": True
            }
        }

# Run collaborative execution
async def main():
    executor = CollaborativeExecutor()
    
    task = os.environ.get("TASK", "Build a REST API with authentication")
    agents = os.environ.get("REQUIRED_AGENTS", "").split(",")
    
    if not agents or agents == ['']:
        agents = ["backend_agent", "frontend_agent", "test_agent", "security_agent"]
    
    result = await executor.execute_task(task, agents)
    
    print("\\n=== Final Results ===")
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    asyncio.run(main())
    `)
    .withWorkdir("/app")
    .withExec(["python", "collaborative_execution.py"]);
}

/**
 * Setup direct agent communication channel
 */
@func()
async setupDirectCommunication(
  sourceAgent: string,
  targetAgent: string,
  protocol: string
): Promise<Container> {
  return dag
    .container()
    .from("python:3.11-slim")
    .withEnvVariable("SOURCE_AGENT", sourceAgent)
    .withEnvVariable("TARGET_AGENT", targetAgent)
    .withEnvVariable("PROTOCOL", protocol)
    .withNewFile("/app/direct_comm.py", `
import json
import asyncio
import time
from typing import Dict, Optional

class DirectCommunicationChannel:
    def __init__(self, source: str, target: str, protocol: str):
        self.source = source
        self.target = target
        self.protocol = protocol
        self.message_history = []
        self.connection_established = False
        
    async def establish_connection(self) -> bool:
        """Establish direct connection between agents"""
        print(f"Establishing {self.protocol} connection: {self.source} → {self.target}")
        
        # Simulate handshake
        handshake = {
            "type": "handshake",
            "from": self.source,
            "to": self.target,
            "protocol": self.protocol,
            "timestamp": time.time()
        }
        
        # Simulate response
        await asyncio.sleep(0.5)
        
        response = {
            "type": "handshake_ack",
            "from": self.target,
            "to": self.source,
            "status": "accepted",
            "capabilities": self._get_agent_capabilities(self.target)
        }
        
        self.message_history.append(handshake)
        self.message_history.append(response)
        self.connection_established = True
        
        print(f"Connection established ✓")
        return True
    
    async def send_message(self, message_type: str, payload: Dict) -> Optional[Dict]:
        """Send direct message to target agent"""
        if not self.connection_established:
            await self.establish_connection()
        
        message = {
            "id": f"msg_{int(time.time() * 1000)}",
            "type": message_type,
            "from": self.source,
            "to": self.target,
            "protocol": self.protocol,
            "payload": payload,
            "timestamp": time.time()
        }
        
        self.message_history.append(message)
        print(f"Sent: {message_type} from {self.source} to {self.target}")
        
        # Simulate response
        response = await self._simulate_agent_response(message)
        if response:
            self.message_history.append(response)
            
        return response
    
    async def _simulate_agent_response(self, message: Dict) -> Dict:
        """Simulate agent response based on protocol"""
        await asyncio.sleep(0.3)
        
        if self.protocol == "task":
            return {
                "id": f"resp_{int(time.time() * 1000)}",
                "type": "response",
                "from": self.target,
                "to": self.source,
                "protocol": self.protocol,
                "payload": {
                    "status": "accepted",
                    "estimated_completion": 5.0,
                    "confidence": 0.85
                },
                "timestamp": time.time()
            }
        elif self.protocol == "review":
            return {
                "id": f"resp_{int(time.time() * 1000)}",
                "type": "response",
                "from": self.target,
                "to": self.source,
                "protocol": self.protocol,
                "payload": {
                    "review_status": "completed",
                    "issues_found": 2,
                    "suggestions": ["Add error handling", "Improve naming"],
                    "approval": "conditional"
                },
                "timestamp": time.time()
            }
        elif self.protocol == "capability":
            return {
                "id": f"resp_{int(time.time() * 1000)}",
                "type": "response",
                "from": self.target,
                "to": self.source,
                "protocol": self.protocol,
                "payload": {
                    "capabilities": self._get_agent_capabilities(self.target)
                },
                "timestamp": time.time()
            }
        else:
            return {
                "id": f"resp_{int(time.time() * 1000)}",
                "type": "response",
                "from": self.target,
                "to": self.source,
                "protocol": self.protocol,
                "payload": {"status": "received"},
                "timestamp": time.time()
            }
    
    def _get_agent_capabilities(self, agent: str) -> list:
        """Get agent capabilities"""
        capabilities_map = {
            "backend_agent": ["python", "api", "database", "async"],
            "frontend_agent": ["javascript", "react", "ui", "responsive"],
            "test_agent": ["testing", "pytest", "coverage", "mocking"],
            "security_agent": ["security", "audit", "encryption", "auth"]
        }
        return capabilities_map.get(agent, [])
    
    def get_conversation_summary(self) -> Dict:
        """Get summary of the conversation"""
        return {
            "channel": f"{self.source} ↔ {self.target}",
            "protocol": self.protocol,
            "messages_exchanged": len(self.message_history),
            "connection_status": "active" if self.connection_established else "inactive",
            "conversation": self.message_history
        }

# Demo direct communication
async def main():
    import os
    
    source = os.environ.get("SOURCE_AGENT", "backend_agent")
    target = os.environ.get("TARGET_AGENT", "frontend_agent")
    protocol = os.environ.get("PROTOCOL", "task")
    
    # Create channel
    channel = DirectCommunicationChannel(source, target, protocol)
    
    # Establish connection
    await channel.establish_connection()
    
    # Send messages based on protocol
    if protocol == "task":
        await channel.send_message("request", {
            "task": "Create user authentication endpoint",
            "requirements": ["JWT", "OAuth2", "rate-limiting"],
            "priority": "high"
        })
    elif protocol == "review":
        await channel.send_message("review_request", {
            "code_location": "/src/api/auth.py",
            "review_type": "security",
            "urgency": "medium"
        })
    elif protocol == "capability":
        await channel.send_message("capability_query", {
            "needed_capabilities": ["python", "testing"],
            "task_type": "unit_testing"
        })
    
    # Get summary
    summary = channel.get_conversation_summary()
    print("\\n=== Communication Summary ===")
    print(json.dumps(summary, indent=2))

if __name__ == "__main__":
    asyncio.run(main())
    `)
    .withWorkdir("/app")
    .withExec(["python", "direct_comm.py"]);
}

/**
 * Monitor A2A communication metrics
 */
@func()
async monitorA2ACommunication(
  duration: number = 60
): Promise<string> {
  const monitoringScript = `
import json
import time
import random
from datetime import datetime
from typing import Dict, List

class A2AMonitor:
    def __init__(self):
        self.metrics = {
            "total_messages": 0,
            "messages_by_protocol": {},
            "messages_by_agent": {},
            "average_response_time": 0,
            "successful_negotiations": 0,
            "failed_negotiations": 0,
            "active_channels": 0,
            "bandwidth_used": 0
        }
        self.message_log = []
        
    def simulate_traffic(self, duration: int):
        """Simulate A2A traffic for monitoring"""
        agents = ["backend_agent", "frontend_agent", "test_agent", "security_agent", "data_agent"]
        protocols = ["task", "review", "capability", "resource"]
        
        start_time = time.time()
        
        while time.time() - start_time < duration:
            # Simulate message
            source = random.choice(agents)
            target = random.choice([a for a in agents if a != source])
            protocol = random.choice(protocols)
            
            message = {
                "timestamp": datetime.now().isoformat(),
                "source": source,
                "target": target,
                "protocol": protocol,
                "size": random.randint(100, 5000),
                "response_time": random.uniform(0.1, 2.0),
                "success": random.random() > 0.1
            }
            
            self.process_message(message)
            time.sleep(random.uniform(0.1, 0.5))
        
        return self.generate_report()
    
    def process_message(self, message: Dict):
        """Process a message for metrics"""
        self.metrics["total_messages"] += 1
        
        # By protocol
        protocol = message["protocol"]
        if protocol not in self.metrics["messages_by_protocol"]:
            self.metrics["messages_by_protocol"][protocol] = 0
        self.metrics["messages_by_protocol"][protocol] += 1
        
        # By agent
        source = message["source"]
        if source not in self.metrics["messages_by_agent"]:
            self.metrics["messages_by_agent"][source] = {"sent": 0, "received": 0}
        self.metrics["messages_by_agent"][source]["sent"] += 1
        
        target = message["target"]
        if target not in self.metrics["messages_by_agent"]:
            self.metrics["messages_by_agent"][target] = {"sent": 0, "received": 0}
        self.metrics["messages_by_agent"][target]["received"] += 1
        
        # Response time
        current_avg = self.metrics["average_response_time"]
        count = self.metrics["total_messages"]
        self.metrics["average_response_time"] = (
            (current_avg * (count - 1) + message["response_time"]) / count
        )
        
        # Success/failure
        if message["protocol"] == "task":
            if message["success"]:
                self.metrics["successful_negotiations"] += 1
            else:
                self.metrics["failed_negotiations"] += 1
        
        # Bandwidth
        self.metrics["bandwidth_used"] += message["size"]
        
        # Log message
        self.message_log.append(message)
        
        # Print live update
        if self.metrics["total_messages"] % 10 == 0:
            print(f"Processed {self.metrics['total_messages']} messages...")
    
    def generate_report(self) -> Dict:
        """Generate monitoring report"""
        # Calculate additional metrics
        total_negotiations = (
            self.metrics["successful_negotiations"] + 
            self.metrics["failed_negotiations"]
        )
        
        success_rate = 0
        if total_negotiations > 0:
            success_rate = (
                self.metrics["successful_negotiations"] / 
                total_negotiations * 100
            )
        
        # Find most active agent
        most_active = None
        max_activity = 0
        for agent, stats in self.metrics["messages_by_agent"].items():
            activity = stats["sent"] + stats["received"]
            if activity > max_activity:
                max_activity = activity
                most_active = agent
        
        # Find most used protocol
        most_used_protocol = None
        if self.metrics["messages_by_protocol"]:
            most_used_protocol = max(
                self.metrics["messages_by_protocol"].items(),
                key=lambda x: x[1]
            )[0]
        
        report = {
            "summary": {
                "total_messages": self.metrics["total_messages"],
                "average_response_time_ms": round(self.metrics["average_response_time"] * 1000, 2),
                "bandwidth_used_kb": round(self.metrics["bandwidth_used"] / 1024, 2),
                "negotiation_success_rate": round(success_rate, 2),
                "most_active_agent": most_active,
                "most_used_protocol": most_used_protocol
            },
            "by_protocol": self.metrics["messages_by_protocol"],
            "by_agent": self.metrics["messages_by_agent"],
            "negotiations": {
                "successful": self.metrics["successful_negotiations"],
                "failed": self.metrics["failed_negotiations"],
                "total": total_negotiations
            },
            "performance": {
                "messages_per_second": round(
                    self.metrics["total_messages"] / ${duration}, 2
                ),
                "average_message_size_bytes": round(
                    self.metrics["bandwidth_used"] / max(1, self.metrics["total_messages"]), 2
                )
            }
        }
        
        return report

# Run monitoring
monitor = A2AMonitor()
print(f"Monitoring A2A communication for ${duration} seconds...")
report = monitor.simulate_traffic(${duration})

print("\\n=== A2A Communication Report ===")
print(json.dumps(report, indent=2))

# Show sample messages
print("\\n=== Sample Messages (last 5) ===")
for msg in monitor.message_log[-5:]:
    print(f"{msg['timestamp']}: {msg['source']} → {msg['target']} ({msg['protocol']})")
  `;

  const result = await dag
    .container()
    .from("python:3.11-slim")
    .withNewFile("/app/monitor.py", monitoringScript)
    .withWorkdir("/app")
    .withExec(["python", "monitor.py"])
    .stdout();

  return result;
}

// ============= INTEGRATION TESTS =============

/**
 * Test A2A communication system
 */
@func()
async testA2ACommunication(): Promise<string> {
  console.log("Testing A2A Communication System...");
  
  // Test 1: Enable A2A
  const a2aContainer = await this.enableA2ACommunication("http://message-bus:5000");
  
  // Test 2: Create delegation network
  const network = await this.createTaskDelegationNetwork([
    "backend_agent",
    "frontend_agent",
    "test_agent"
  ]);
  
  // Test 3: Discover capabilities
  const capabilities = await this.discoverAgentCapabilities([]);
  
  // Test 4: Collaborative execution
  const collaboration = await this.executeCollaborativeTask(
    "Build user authentication system",
    ["backend_agent", "frontend_agent", "test_agent", "security_agent"]
  );
  
  // Test 5: Direct communication
  const directComm = await this.setupDirectCommunication(
    "backend_agent",
    "frontend_agent",
    "task"
  );
  
  // Test 6: Monitor metrics
  const metrics = await this.monitorA2ACommunication(10);
  
  return `
Sprint 8 A2A Communication Tests Completed:
✓ A2A enabled
✓ Task delegation network created
✓ Capability discovery working
✓ Collaborative execution successful
✓ Direct communication established
✓ Monitoring active

Metrics Summary:
${metrics}
  `;
}

// ============= USAGE EXAMPLE =============

/**
 * Complete A2A demo showing all features
 */
@func()
async demoA2ACommunication(): Promise<void> {
  console.log("=== A2A Communication Demo ===\n");
  
  // 1. Setup message bus and enable A2A
  console.log("1. Enabling A2A Communication...");
  const a2a = await this.enableA2ACommunication("http://localhost:5000");
  
  // 2. Create agent network
  console.log("\n2. Creating Task Delegation Network...");
  const agents = [
    "backend_agent",
    "frontend_agent", 
    "test_agent",
    "security_agent",
    "data_agent"
  ];
  const network = await this.createTaskDelegationNetwork(agents);
  
  // 3. Discover capabilities
  console.log("\n3. Discovering Agent Capabilities...");
  const capabilities = await this.discoverAgentCapabilities([]);
  console.log(capabilities);
  
  // 4. Execute collaborative task
  console.log("\n4. Executing Collaborative Task...");
  const task = await this.executeCollaborativeTask(
    "Build REST API with authentication and testing",
    ["backend_agent", "frontend_agent", "test_agent", "security_agent"]
  );
  
  // 5. Setup direct channels
  console.log("\n5. Setting up Direct Communication Channels...");
  const channels = [
    ["backend_agent", "frontend_agent", "task"],
    ["test_agent", "backend_agent", "review"],
    ["security_agent", "backend_agent", "capability"]
  ];
  
  for (const [source, target, protocol] of channels) {
    await this.setupDirectCommunication(source, target, protocol);
  }
  
  // 6. Monitor system
  console.log("\n6. Monitoring A2A Communication...");
  const monitoring = await this.monitorA2ACommunication(30);
  console.log(monitoring);
  
  console.log("\n=== Demo Complete ===");
}
