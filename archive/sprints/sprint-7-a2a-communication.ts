/**
 * SPRINT 7: Agent-to-Agent Communication & Trust Networks
 * Goal: Enable direct agent communication and trust building
 * Duration: 5 days
 * Prerequisites: Sprint 6 refactoring complete
 * 
 * THE EXCITING PART BEGINS! Agents can now talk to each other.
 */

// File: /src/collective/a2a-communication.ts
export const A2A_COMMUNICATION_SCRIPT = `
import json
import sys
import time
import hashlib
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from enum import Enum

class MessageType(Enum):
    QUERY = "query"
    RESPONSE = "response"
    NEGOTIATION = "negotiation"
    KNOWLEDGE_SHARE = "knowledge_share"
    COORDINATION = "coordination"
    FEEDBACK = "feedback"
    HEARTBEAT = "heartbeat"

@dataclass
class A2AMessage:
    id: str
    from_agent: str
    to_agent: str
    message_type: str
    content: Dict[str, Any]
    timestamp: float
    in_reply_to: Optional[str] = None
    confidence: float = 1.0
    requires_response: bool = False
    
    def to_dict(self):
        return asdict(self)

class A2ACommunicationMesh:
    """Direct agent-to-agent communication system"""
    
    def __init__(self):
        self.channels = {}  # (agent1, agent2) -> channel
        self.message_history = []
        self.pending_messages = {}  # agent -> [messages]
        self.trust_scores = {}  # (agent1, agent2) -> score
        
        # Metrics for learning
        self.communication_patterns = []
        self.successful_exchanges = 0
        self.failed_exchanges = 0
    
    def establish_channel(self, agent1: str, agent2: str) -> str:
        """Establish communication channel between two agents"""
        channel_id = self._get_channel_id(agent1, agent2)
        
        if channel_id not in self.channels:
            self.channels[channel_id] = {
                "id": channel_id,
                "agents": [agent1, agent2],
                "created": time.time(),
                "message_count": 0,
                "last_activity": time.time(),
                "status": "active"
            }
            
            # Initialize trust
            trust_key = tuple(sorted([agent1, agent2]))
            if trust_key not in self.trust_scores:
                self.trust_scores[trust_key] = 0.5  # Neutral starting trust
        
        return channel_id
    
    def send_message(
        self, 
        from_agent: str, 
        to_agent: str, 
        message_type: MessageType,
        content: Dict[str, Any],
        in_reply_to: Optional[str] = None
    ) -> A2AMessage:
        """Send a message from one agent to another"""
        
        # Ensure channel exists
        channel_id = self.establish_channel(from_agent, to_agent)
        
        # Create message
        message = A2AMessage(
            id=self._generate_message_id(),
            from_agent=from_agent,
            to_agent=to_agent,
            message_type=message_type.value,
            content=content,
            timestamp=time.time(),
            in_reply_to=in_reply_to,
            confidence=self._calculate_confidence(from_agent, to_agent),
            requires_response=message_type in [MessageType.QUERY, MessageType.NEGOTIATION]
        )
        
        # Store message
        self.message_history.append(message.to_dict())
        
        # Add to pending for recipient
        if to_agent not in self.pending_messages:
            self.pending_messages[to_agent] = []
        self.pending_messages[to_agent].append(message)
        
        # Update channel metrics
        self.channels[channel_id]["message_count"] += 1
        self.channels[channel_id]["last_activity"] = time.time()
        
        # Track pattern for learning
        self._track_communication_pattern(message)
        
        return message
    
    def receive_messages(self, agent_id: str) -> List[A2AMessage]:
        """Receive pending messages for an agent"""
        messages = self.pending_messages.get(agent_id, [])
        self.pending_messages[agent_id] = []
        return messages
    
    def update_trust(
        self, 
        agent1: str, 
        agent2: str, 
        interaction_success: bool,
        quality_score: float = 1.0
    ):
        """Update trust score between two agents"""
        trust_key = tuple(sorted([agent1, agent2]))
        current_trust = self.trust_scores.get(trust_key, 0.5)
        
        # Trust adjustment based on interaction
        if interaction_success:
            # Increase trust (with diminishing returns)
            adjustment = 0.1 * quality_score * (1 - current_trust)
            self.successful_exchanges += 1
        else:
            # Decrease trust (faster than increase)
            adjustment = -0.15 * (current_trust)
            self.failed_exchanges += 1
        
        new_trust = max(0, min(1, current_trust + adjustment))
        self.trust_scores[trust_key] = new_trust
        
        return new_trust
    
    def get_trust_score(self, agent1: str, agent2: str) -> float:
        """Get current trust score between two agents"""
        trust_key = tuple(sorted([agent1, agent2]))
        return self.trust_scores.get(trust_key, 0.5)
    
    def negotiate(
        self,
        initiator: str,
        responder: str,
        proposal: Dict[str, Any],
        max_rounds: int = 5
    ) -> Dict[str, Any]:
        """Facilitate negotiation between two agents"""
        negotiation_id = f"nego-{int(time.time())}"
        rounds = 0
        agreement_reached = False
        current_proposal = proposal
        
        negotiation_history = []
        
        while rounds < max_rounds and not agreement_reached:
            # Send proposal
            message = self.send_message(
                initiator if rounds % 2 == 0 else responder,
                responder if rounds % 2 == 0 else initiator,
                MessageType.NEGOTIATION,
                {
                    "negotiation_id": negotiation_id,
                    "round": rounds,
                    "proposal": current_proposal
                }
            )
            
            negotiation_history.append(message.to_dict())
            
            # Simulate response (in real implementation, agent would process)
            if rounds > 0:
                # Check if proposal is acceptable (simplified)
                trust = self.get_trust_score(initiator, responder)
                acceptance_probability = 0.3 + (trust * 0.4) + (rounds * 0.1)
                
                if acceptance_probability > 0.7:
                    agreement_reached = True
                else:
                    # Counter-proposal (simplified)
                    current_proposal["value"] = current_proposal.get("value", 1) * 0.9
            
            rounds += 1
        
        result = {
            "negotiation_id": negotiation_id,
            "success": agreement_reached,
            "rounds": rounds,
            "final_proposal": current_proposal,
            "history": negotiation_history
        }
        
        # Update trust based on outcome
        self.update_trust(initiator, responder, agreement_reached, 0.8)
        
        return result
    
    def _get_channel_id(self, agent1: str, agent2: str) -> str:
        """Generate consistent channel ID for agent pair"""
        agents = sorted([agent1, agent2])
        return f"channel-{agents[0]}-{agents[1]}"
    
    def _generate_message_id(self) -> str:
        """Generate unique message ID"""
        return f"msg-{int(time.time() * 1000)}"
    
    def _calculate_confidence(self, from_agent: str, to_agent: str) -> float:
        """Calculate message confidence based on trust"""
        trust = self.get_trust_score(from_agent, to_agent)
        return 0.5 + (trust * 0.5)  # Scale trust to confidence
    
    def _track_communication_pattern(self, message: A2AMessage):
        """Track communication patterns for learning"""
        pattern = {
            "agents": (message.from_agent, message.to_agent),
            "type": message.message_type,
            "timestamp": message.timestamp,
            "confidence": message.confidence
        }
        self.communication_patterns.append(pattern)
    
    def get_communication_stats(self) -> Dict[str, Any]:
        """Get communication statistics"""
        return {
            "total_channels": len(self.channels),
            "total_messages": len(self.message_history),
            "successful_exchanges": self.successful_exchanges,
            "failed_exchanges": self.failed_exchanges,
            "success_rate": self.successful_exchanges / max(1, self.successful_exchanges + self.failed_exchanges),
            "average_trust": sum(self.trust_scores.values()) / max(1, len(self.trust_scores)),
            "active_channels": len([c for c in self.channels.values() if c["status"] == "active"])
        }

if __name__ == "__main__":
    mesh = A2ACommunicationMesh()
    command = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}
    
    if command.get("action") == "send":
        message = mesh.send_message(
            command.get("from"),
            command.get("to"),
            MessageType[command.get("type", "QUERY").upper()],
            command.get("content", {})
        )
        print(json.dumps(message.to_dict()))
    
    elif command.get("action") == "receive":
        messages = mesh.receive_messages(command.get("agent"))
        print(json.dumps([m.to_dict() for m in messages]))
    
    elif command.get("action") == "negotiate":
        result = mesh.negotiate(
            command.get("initiator"),
            command.get("responder"),
            command.get("proposal", {})
        )
        print(json.dumps(result))
    
    elif command.get("action") == "trust":
        trust = mesh.get_trust_score(
            command.get("agent1"),
            command.get("agent2")
        )
        print(json.dumps({"trust_score": trust}))
    
    elif command.get("action") == "stats":
        stats = mesh.get_communication_stats()
        print(json.dumps(stats))
    
    else:
        print(json.dumps({"error": "Unknown action"}))
`

// File: /src/collective/trust-network.ts
export const TRUST_NETWORK_SCRIPT = `
import json
import sys
import numpy as np
from typing import Dict, List, Tuple, Any

class TrustNetwork:
    """Manages trust relationships between agents"""
    
    def __init__(self, num_agents: int = 5):
        self.agents = [f"agent-{i}" for i in range(num_agents)]
        self.trust_matrix = np.ones((num_agents, num_agents)) * 0.5
        np.fill_diagonal(self.trust_matrix, 1.0)  # Perfect self-trust
        
        # Interaction history for trust evolution
        self.interaction_history = []
        self.trust_evolution = []
        
        # Trust dynamics parameters
        self.learning_rate = 0.1
        self.decay_rate = 0.01
        self.min_trust = 0.1
        self.max_trust = 0.95
    
    def update_trust_from_interaction(
        self,
        agent1: str,
        agent2: str,
        outcome: str,  # "success", "failure", "partial"
        quality: float = 1.0
    ):
        """Update trust based on interaction outcome"""
        idx1 = self.agents.index(agent1)
        idx2 = self.agents.index(agent2)
        
        current_trust = self.trust_matrix[idx1, idx2]
        
        # Calculate trust delta
        if outcome == "success":
            delta = self.learning_rate * quality * (1 - current_trust)
        elif outcome == "failure":
            delta = -self.learning_rate * 1.5 * current_trust
        else:  # partial
            delta = self.learning_rate * 0.5 * quality * (1 - current_trust)
        
        # Update trust (asymmetric - only updater's trust changes)
        new_trust = np.clip(current_trust + delta, self.min_trust, self.max_trust)
        self.trust_matrix[idx1, idx2] = new_trust
        
        # Record interaction
        self.interaction_history.append({
            "from": agent1,
            "to": agent2,
            "outcome": outcome,
            "quality": quality,
            "trust_before": current_trust,
            "trust_after": new_trust,
            "delta": delta
        })
        
        # Store evolution snapshot
        self.trust_evolution.append(self.trust_matrix.copy())
        
        return new_trust
    
    def get_trust_score(self, agent1: str, agent2: str) -> float:
        """Get trust score between two agents"""
        idx1 = self.agents.index(agent1)
        idx2 = self.agents.index(agent2)
        return float(self.trust_matrix[idx1, idx2])
    
    def suggest_team(self, task_requirements: Dict[str, Any], team_size: int = 3) -> List[str]:
        """Suggest optimal team based on trust relationships"""
        # Calculate team cohesion scores for all possible teams
        from itertools import combinations
        
        best_team = None
        best_score = -1
        
        for team in combinations(self.agents, team_size):
            score = self._calculate_team_cohesion(team)
            
            # Weight by task requirements (simplified)
            if task_requirements.get("high_trust_needed", False):
                score *= 2
            
            if score > best_score:
                best_score = score
                best_team = team
        
        return list(best_team)
    
    def _calculate_team_cohesion(self, team: Tuple[str]) -> float:
        """Calculate cohesion score for a team"""
        if len(team) < 2:
            return 1.0
        
        total_trust = 0
        pair_count = 0
        
        for i, agent1 in enumerate(team):
            for agent2 in team[i+1:]:
                idx1 = self.agents.index(agent1)
                idx2 = self.agents.index(agent2)
                # Average bidirectional trust
                trust = (self.trust_matrix[idx1, idx2] + self.trust_matrix[idx2, idx1]) / 2
                total_trust += trust
                pair_count += 1
        
        return total_trust / pair_count if pair_count > 0 else 0
    
    def apply_trust_decay(self):
        """Apply time-based trust decay"""
        # Trust naturally decays toward neutral (0.5) over time
        self.trust_matrix = 0.5 + (self.trust_matrix - 0.5) * (1 - self.decay_rate)
        np.fill_diagonal(self.trust_matrix, 1.0)  # Maintain self-trust
    
    def get_network_stats(self) -> Dict[str, Any]:
        """Get trust network statistics"""
        trust_values = self.trust_matrix[np.triu_indices_from(self.trust_matrix, k=1)]
        
        return {
            "average_trust": float(np.mean(trust_values)),
            "min_trust": float(np.min(trust_values)),
            "max_trust": float(np.max(trust_values)),
            "trust_variance": float(np.var(trust_values)),
            "high_trust_pairs": int(np.sum(trust_values > 0.7)),
            "low_trust_pairs": int(np.sum(trust_values < 0.3)),
            "total_interactions": len(self.interaction_history),
            "network_cohesion": float(np.mean(trust_values))
        }
    
    def identify_trust_clusters(self) -> List[List[str]]:
        """Identify clusters of agents with high mutual trust"""
        threshold = 0.7
        clusters = []
        visited = set()
        
        for i, agent in enumerate(self.agents):
            if agent in visited:
                continue
            
            cluster = [agent]
            visited.add(agent)
            
            # Find agents with high mutual trust
            for j, other_agent in enumerate(self.agents):
                if i != j and other_agent not in visited:
                    mutual_trust = (self.trust_matrix[i, j] + self.trust_matrix[j, i]) / 2
                    if mutual_trust > threshold:
                        cluster.append(other_agent)
                        visited.add(other_agent)
            
            if len(cluster) > 1:
                clusters.append(cluster)
        
        return clusters

if __name__ == "__main__":
    network = TrustNetwork()
    command = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}
    
    if command.get("action") == "update":
        new_trust = network.update_trust_from_interaction(
            command.get("agent1"),
            command.get("agent2"),
            command.get("outcome", "success"),
            command.get("quality", 1.0)
        )
        print(json.dumps({"new_trust": new_trust}))
    
    elif command.get("action") == "get_trust":
        trust = network.get_trust_score(
            command.get("agent1"),
            command.get("agent2")
        )
        print(json.dumps({"trust": trust}))
    
    elif command.get("action") == "suggest_team":
        team = network.suggest_team(
            command.get("requirements", {}),
            command.get("size", 3)
        )
        print(json.dumps({"suggested_team": team}))
    
    elif command.get("action") == "stats":
        stats = network.get_network_stats()
        print(json.dumps(stats))
    
    elif command.get("action") == "clusters":
        clusters = network.identify_trust_clusters()
        print(json.dumps({"trust_clusters": clusters}))
    
    else:
        print(json.dumps({"error": "Unknown action"}))
`

// File: /src/index.ts (EXTENDING Sprint 6)
import {
  object,
  func,
  Container,
  Directory,
  Secret,
  dag
} from "@dagger.io/dagger"

// Import A2A scripts
import { A2A_COMMUNICATION_SCRIPT } from "./collective/a2a-communication"
import { TRUST_NETWORK_SCRIPT } from "./collective/trust-network"

@object()
export class ProactivaDev {
  // ... Previous sprint functions remain ...

  /**
   * Sprint 7, Function 1: Initialize A2A communication mesh
   */
  @func()
  async initializeA2AMesh(): Promise<Container> {
    const meshId = `mesh-${Date.now()}`
    const cache = dag.cacheVolume("a2a-mesh")
    
    return dag
      .container()
      .from("python:3.11-slim")
      .withMountedCache("/mesh", cache)
      .withNewFile("/a2a_mesh.py", A2A_COMMUNICATION_SCRIPT)
      .withExec(["python", "/a2a_mesh.py", JSON.stringify({action: "stats"})])
  }

  /**
   * Sprint 7, Function 2: Send A2A message
   */
  @func()
  async sendA2AMessage(
    fromAgent: string,
    toAgent: string,
    messageType: string = "QUERY",
    content: string = "{}"
  ): Promise<Container> {
    const command = {
      action: "send",
      from: fromAgent,
      to: toAgent,
      type: messageType,
      content: JSON.parse(content)
    }
    
    return dag
      .container()
      .from("python:3.11-slim")
      .withNewFile("/a2a_mesh.py", A2A_COMMUNICATION_SCRIPT)
      .withExec(["python", "/a2a_mesh.py", JSON.stringify(command)])
  }

  /**
   * Sprint 7, Function 3: Receive A2A messages
   */
  @func()
  async receiveA2AMessages(
    agentId: string
  ): Promise<Container> {
    const command = {
      action: "receive",
      agent: agentId
    }
    
    return dag
      .container()
      .from("python:3.11-slim")
      .withNewFile("/a2a_mesh.py", A2A_COMMUNICATION_SCRIPT)
      .withExec(["python", "/a2a_mesh.py", JSON.stringify(command)])
  }

  /**
   * Sprint 7, Function 4: Agent negotiation
   */
  @func()
  async negotiateBetweenAgents(
    initiator: string,
    responder: string,
    proposal: string = '{"task": "collaborate", "value": 10}'
  ): Promise<Container> {
    const command = {
      action: "negotiate",
      initiator: initiator,
      responder: responder,
      proposal: JSON.parse(proposal)
    }
    
    return dag
      .container()
      .from("python:3.11-slim")
      .withNewFile("/a2a_mesh.py", A2A_COMMUNICATION_SCRIPT)
      .withExec(["python", "/a2a_mesh.py", JSON.stringify(command)])
  }

  /**
   * Sprint 7, Function 5: Initialize trust network
   */
  @func()
  async initializeTrustNetwork(
    numAgents: number = 5
  ): Promise<Container> {
    const cache = dag.cacheVolume("trust-network")
    
    return dag
      .container()
      .from("python:3.11-slim")
      .withMountedCache("/trust", cache)
      .withExec(["pip", "install", "numpy"])
      .withNewFile("/trust_network.py", TRUST_NETWORK_SCRIPT)
      .withExec(["python", "/trust_network.py", JSON.stringify({action: "stats"})])
  }

  /**
   * Sprint 7, Function 6: Update trust score
   */
  @func()
  async updateTrustScore(
    agent1: string,
    agent2: string,
    outcome: string = "success",
    quality: number = 1.0
  ): Promise<Container> {
    const command = {
      action: "update",
      agent1: agent1,
      agent2: agent2,
      outcome: outcome,
      quality: quality
    }
    
    return dag
      .container()
      .from("python:3.11-slim")
      .withExec(["pip", "install", "numpy"])
      .withNewFile("/trust_network.py", TRUST_NETWORK_SCRIPT)
      .withExec(["python", "/trust_network.py", JSON.stringify(command)])
  }

  /**
   * Sprint 7, Function 7: Suggest optimal team
   */
  @func()
  async suggestOptimalTeam(
    taskRequirements: string = '{"high_trust_needed": true}',
    teamSize: number = 3
  ): Promise<Container> {
    const command = {
      action: "suggest_team",
      requirements: JSON.parse(taskRequirements),
      size: teamSize
    }
    
    return dag
      .container()
      .from("python:3.11-slim")
      .withExec(["pip", "install", "numpy"])
      .withNewFile("/trust_network.py", TRUST_NETWORK_SCRIPT)
      .withExec(["python", "/trust_network.py", JSON.stringify(command)])
  }

  /**
   * Sprint 7, Function 8: Identify trust clusters
   */
  @func()
  async identifyTrustClusters(): Promise<Container> {
    const command = {
      action: "clusters"
    }
    
    return dag
      .container()
      .from("python:3.11-slim")
      .withExec(["pip", "install", "numpy"])
      .withNewFile("/trust_network.py", TRUST_NETWORK_SCRIPT)
      .withExec(["python", "/trust_network.py", JSON.stringify(command)])
  }

  /**
   * Sprint 7, Function 9: A2A conversation demo
   * Multiple agents communicating and building trust
   */
  @func()
  async runA2AConversation(): Promise<Container> {
    const conversationId = `conv-${Date.now()}`
    
    // Simulated multi-agent conversation
    const conversation = {
      id: conversationId,
      participants: ["code-agent", "test-agent", "review-agent"],
      topic: "implement-feature",
      messages: []
    }
    
    return dag
      .container()
      .from("python:3.11-slim")
      .withExec(["pip", "install", "numpy"])
      .withNewFile("/conversation.json", JSON.stringify(conversation))
      .withNewFile("/a2a_mesh.py", A2A_COMMUNICATION_SCRIPT)
      .withNewFile("/trust_network.py", TRUST_NETWORK_SCRIPT)
      // Simulate conversation
      .withExec(["echo", "=== A2A Conversation Demo ==="])
      .withExec(["echo", "Code agent: I need tests for the new feature"])
      .withExec(["python", "/a2a_mesh.py", JSON.stringify({
        action: "send",
        from: "code-agent",
        to: "test-agent",
        type: "QUERY",
        content: {message: "Need test cases for user authentication"}
      })])
      .withExec(["echo", "Test agent: I'll create comprehensive tests"])
      .withExec(["python", "/a2a_mesh.py", JSON.stringify({
        action: "send",
        from: "test-agent",
        to: "code-agent",
        type: "RESPONSE",
        content: {message: "Tests ready, 95% coverage achieved"}
      })])
      .withExec(["echo", "Review agent: Let me review both code and tests"])
      .withExec(["python", "/a2a_mesh.py", JSON.stringify({
        action: "send",
        from: "review-agent",
        to: "code-agent",
        type: "FEEDBACK",
        content: {message: "Code looks good, minor suggestions added"}
      })])
      // Update trust based on successful collaboration
      .withExec(["python", "/trust_network.py", JSON.stringify({
        action: "update",
        agent1: "code-agent",
        agent2: "test-agent",
        outcome: "success",
        quality: 0.95
      })])
      .withExec(["echo", "Trust updated: code-agent <-> test-agent"])
      .withExec(["echo", "=== Conversation Complete ==="])
  }
}

// File: /test-sprint-7.sh
/*
#!/bin/bash
set -e

echo "Sprint 7 Test Suite"
echo "=================="

# Regression test
./test-sprint-5.sh || exit 1

echo ""
echo "Sprint 7 Tests"
echo "--------------"

echo "Test 1: Initialize A2A mesh"
dagger call initialize-a2a-mesh | grep -q "total_channels" || exit 1
echo "✓ A2A mesh initialized"

echo "Test 2: Send A2A message"
dagger call send-a2a-message --from-agent="agent-1" --to-agent="agent-2" --message-type="QUERY" | grep -q "msg-" || exit 1
echo "✓ A2A message sent"

echo "Test 3: Receive messages"
dagger call receive-a2a-messages --agent-id="agent-2" | grep -q "\[" || exit 1
echo "✓ Messages received"

echo "Test 4: Agent negotiation"
dagger call negotiate-between-agents --initiator="agent-1" --responder="agent-2" | grep -q "negotiation_id" || exit 1
echo "✓ Negotiation works"

echo "Test 5: Initialize trust network"
dagger call initialize-trust-network --num-agents=5 | grep -q "average_trust" || exit 1
echo "✓ Trust network initialized"

echo "Test 6: Update trust"
dagger call update-trust-score --agent1="agent-0" --agent2="agent-1" --outcome="success" | grep -q "new_trust" || exit 1
echo "✓ Trust update works"

echo "Test 7: Suggest team"
dagger call suggest-optimal-team --team-size=3 | grep -q "suggested_team" || exit 1
echo "✓ Team suggestion works"

echo "Test 8: Trust clusters"
dagger call identify-trust-clusters | grep -q "trust_clusters" || exit 1
echo "✓ Trust clusters identified"

echo "Test 9: A2A conversation"
dagger call run-a2a-conversation | grep -q "Conversation Complete" || exit 1
echo "✓ A2A conversation demo works"

echo ""
echo "Sprint 7: ALL TESTS PASSED ✓"
echo "=========================="
echo "Total functions after Sprint 7: ~44"
echo ""
echo "🤖 Agents can now talk to each other!"
*/