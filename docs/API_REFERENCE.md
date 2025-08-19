# ProactivaDev API Reference

## Overview

ProactivaDev provides 65+ Dagger functions organized into logical groups. All functions are accessible via the Dagger CLI and return appropriate Dagger types for containerized execution.

## Quick Reference

```bash
# List all available functions
dagger functions

# Get help for any function
dagger call <function-name> --help

# Execute a function
dagger call <function-name> --param "value"
```

## Function Categories

### 🛠️ Foundation Layer (Sprint 1)

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `testConnection()` | Verify module connectivity | None | Container |
| `executeContainer(command?)` | Run basic container command | command: string | Container |
| `saveState(key, value)` | Persist state data | key: string, value: string | Container |
| `loadState(key)` | Retrieve state data | key: string | Container |
| `executeWithTools(tools, command)` | Execute with tool installation | tools: string, command: string | Container |
| `executeWithLogging(command, logLevel?)` | Execute with structured logging | command: string, logLevel?: string | Container |

### 🤖 Agent Management (Sprint 2)

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `createAgent(name, type?)` | Create new agent instance | name: string, type?: string | Container |
| `executeAgent(agentId, task)` | Execute task with agent | agentId: string, task: string | Container |
| `executeAgentPipeline(agents, task)` | Sequential agent execution | agents: string, task: string | Container |
| `executeAgentWithTools(agentId, tools, task)` | Agent execution with tools | agentId: string, tools: string, task: string | Container |
| `updateAgentMemory(agentId, memory)` | Update agent memory | agentId: string, memory: string | Container |
| `getAgentMetrics(agentId?)` | Get agent performance metrics | agentId?: string | Container |

### 🎯 Specialized Agents (Sprint 3)

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `createCodeAgent(name, language?)` | Create code generation agent | name: string, language?: string | Container |
| `createTestAgent(name, framework?)` | Create testing agent | name: string, framework?: string | Container |
| `createSecurityAgent(name, scanType?)` | Create security scanning agent | name: string, scanType?: string | Container |
| `createPerformanceAgent(name, metrics?)` | Create performance monitoring agent | name: string, metrics?: string | Container |
| `createReviewAgent(name, criteria?)` | Create code review agent | name: string, criteria?: string | Container |

### ⚡ Enhanced Capabilities (Sprint 4)

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `executeAgentWithLLM(agentId, task, model?)` | Execute agent with LLM integration | agentId: string, task: string, model?: string | Container |
| `executeAgentWithContext(agentId, task, context)` | Execute with additional context | agentId: string, task: string, context: string | Container |
| `executeAgentWithFeedback(agentId, task, feedbackLoop?)` | Execute with feedback mechanism | agentId: string, task: string, feedbackLoop?: string | Container |
| `chainAgentExecution(chain)` | Execute predefined agent chain | chain: string | Container |
| `executeAgentWithRetry(agentId, task, maxRetries?)` | Execute with retry logic | agentId: string, task: string, maxRetries?: number | Container |
| `getAgentCollaborationHistory(agentId?)` | Get collaboration history | agentId?: string | Container |

### 🎭 Advanced Orchestration (Sprint 5)

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `executeAgentsParallel(agents, task)` | Parallel agent execution | agents: string, task: string | Container |
| `executeAgentsCollaborative(task, strategy?)` | Collaborative execution | task: string, strategy?: string | Container |
| `executeAgentsLoadBalanced(agents, task, strategy?)` | Load-balanced execution | agents: string, task: string, strategy?: string | Container |
| `executeAgentsWithPriority(agents, task, priorities)` | Priority-based execution | agents: string, task: string, priorities: string | Container |
| `executeAgentsConditional(agents, task, conditions)` | Conditional execution | agents: string, task: string, conditions: string | Container |
| `executeAgentsWorkflow(workflow)` | Execute complex workflow | workflow: string | Container |
| `monitorAgentExecution(sessionId?, duration?)` | Monitor execution | sessionId?: string, duration?: number | Container |
| `optimizeAgentResources(strategy?)` | Optimize resource usage | strategy?: string | Container |
| `getSystemMetrics()` | Get overall system metrics | None | Container |
| `generateExecutionReport(sessionId?)` | Generate execution report | sessionId?: string | Container |

### 🔗 A2A Communication (Sprint 7-8)

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `initializeA2AMesh(agents?)` | Initialize communication mesh | agents?: number | Container |
| `sendA2AMessage(from, to, content)` | Send agent-to-agent message | from: string, to: string, content: string | Container |
| `broadcastA2AMessage(from, content, recipients?)` | Broadcast message | from: string, content: string, recipients?: string | Container |
| `getA2AMessageHistory(agentId?, limit?)` | Get message history | agentId?: string, limit?: number | Container |
| `updateA2ATrustScore(from, to, score)` | Update trust relationship | from: string, to: string, score: number | Container |
| `getA2ATrustNetwork(agentId?)` | Get trust network | agentId?: string | Container |
| `monitorA2ACommunication(duration?)` | Monitor communications | duration?: number | Container |
| `optimizeA2ARouting()` | Optimize message routing | None | Container |
| `exportA2ANetworkState()` | Export network state | None | Container |
| `importA2ANetworkState(state)` | Import network state | state: string | Container |
| `analyzeA2APatterns(timeframe?)` | Analyze communication patterns | timeframe?: string | Container |
| `getA2APerformanceMetrics()` | Get A2A performance metrics | None | Container |
| `resetA2ATrustScores()` | Reset all trust scores | None | Container |
| `validateA2AIntegrity()` | Validate network integrity | None | Container |

### 🧠 Collective Learning (Sprint 9)

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `initializeCollectiveLearning()` | Initialize learning system | None | Container |
| `learnFromExperience(experience)` | Record learning experience | experience: string | Container |
| `queryMemory(criteria)` | Query collective memory | criteria: string | Container |
| `getPatterns()` | Get recognized patterns | None | Container |
| `runTests()` | Run test suite | None | Container |
| `generatePerformanceReport()` | Generate performance report | None | Container |

### 🧬 Intelligence Evolution (Sprint 10)

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `testCollectiveIntelligence()` | Test evolution system | None | Container |
| `learnFromExecution(execution)` | Learn from task execution | execution: string | Container |
| `triggerEvolution()` | Trigger system evolution | None | Container |
| `predictOptimalTeam(task, constraints)` | Predict best team composition | task: string, constraints: string | Container |
| `getEmergentInsights()` | Get system insights | None | Container |
| `exportKnowledge()` | Export collective knowledge | None | Container |
| `importKnowledge(knowledge)` | Import knowledge | knowledge: string | Container |
| `evolveFromExecution(executionRecord)` | Evolve based on execution | executionRecord: string | Container |

### 🌐 Web Management (Sprint 11)

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `startWebManagementInterface()` | Start web dashboard | None | Container |
| `generateSystemStatus()` | Generate status report | None | Container |
| `exportSystemMetrics()` | Export metrics data | None | Container |
| `startDevelopmentServer()` | Start development server | None | Container |

## Web API Endpoints

The web management interface provides REST API endpoints:

### Status & Monitoring

```http
GET /api/status
```
Returns real-time system status including agents, generation, fitness scores, and component health.

**Response:**
```json
{
  "timestamp": "2024-01-01T00:00:00Z",
  "status": "OPERATIONAL",
  "agents": 5,
  "generation": 3,
  "fitness_score": 0.82,
  "success_rate": 0.89,
  "total_functions": 65,
  "active_workflows": 2,
  "memory_usage_mb": 47.3,
  "components": {
    "agent_memory": {"status": "active", "size_mb": 12.5},
    "a2a_mesh": {"status": "active", "size_mb": 8.3},
    "collective_memory": {"status": "active", "size_mb": 15.7}
  }
}
```

### Performance Metrics

```http
GET /api/metrics
```
Returns historical performance data for charts and analysis.

**Response:**
```json
[
  {
    "timestamp": "2024-01-01T00:00:00Z",
    "success_rate": 0.85,
    "fitness": 0.78,
    "task_count": 15,
    "memory_mb": 45.2
  }
]
```

### Real-time Events

```http
GET /api/events
```
Server-Sent Events stream for real-time dashboard updates.

**Event Format:**
```
data: {"timestamp": "2024-01-01T00:00:00Z", "event": "Task completed", "success_rate": 0.87}
```

### Command Execution

```http
POST /api/execute
Content-Type: application/json

{
  "command": "initialize"
}
```

Executes system commands through the web interface.

**Response:**
```json
{
  "status": "executed",
  "command": "initialize",
  "output": "Command 'initialize' executed successfully",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Usage Examples

### Basic Agent Workflow

```bash
# 1. Create a code agent
dagger call create-code-agent --name "MyBot" --language "typescript"

# 2. Execute a task
dagger call execute-agent --agent-id "agent-123" --task "Create a REST API endpoint"

# 3. Get performance metrics
dagger call get-agent-metrics --agent-id "agent-123"
```

### Advanced Orchestration

```bash
# 1. Set up multiple agents for parallel execution
agents='[{"type":"code","count":2},{"type":"test","count":1},{"type":"security","count":1}]'
task="Build and secure a payment processing system"

# 2. Execute with load balancing
dagger call execute-agents-load-balanced --agents "$agents" --task "$task" --strategy "least-loaded"

# 3. Monitor execution
dagger call monitor-agent-execution --duration 300
```

### A2A Communication Setup

```bash
# 1. Initialize communication mesh
dagger call initialize-a2a-mesh --agents 5

# 2. Send messages between agents
dagger call send-a2a-message --from "agent-1" --to "agent-2" --content "Need code review for payment module"

# 3. Monitor communication patterns
dagger call monitor-a2a-communication --duration 300

# 4. Analyze trust network
dagger call get-a2a-trust-network
```

### Learning & Evolution Cycle

```bash
# 1. Record successful collaboration
experience='{"task":"payment-system","success":true,"quality":0.9,"agents":["code","test","security"],"duration":1800}'
dagger call learn-from-experience --experience "$experience"

# 2. Query for similar patterns
criteria='{"taskType":"payment-system","minQuality":0.8}'
dagger call query-memory --criteria "$criteria"

# 3. Trigger evolution when ready
dagger call trigger-evolution

# 4. Get insights about system improvements
dagger call get-emergent-insights
```

### Web Dashboard Management

```bash
# 1. Start web interface
dagger call start-web-management-interface up --ports 8080:8080

# 2. Access dashboard at http://localhost:8080
# Features available:
# - Real-time system monitoring
# - Interactive performance charts
# - Component status tracking
# - Quick action buttons
# - Live event streaming

# 3. Export system data
dagger call export-system-metrics
```

## Error Handling

### Common Error Patterns

**Function Not Found**
```bash
# Check if function is registered
dagger functions | grep function-name

# Reload module if needed
dagger develop
```

**Parameter Validation Errors**
```bash
# Get parameter details
dagger call function-name --help

# Use proper parameter format
dagger call create-agent --name "ValidName" --type "code"
```

**Container Execution Errors**
```bash
# Check container logs
dagger call function-name stdout

# Monitor resource usage
dagger call get-system-metrics
```

### Debugging Tips

1. **Always check function availability first**: `dagger functions`
2. **Use help for parameter guidance**: `dagger call function-name --help`
3. **Test with minimal parameters**: Start simple, add complexity gradually
4. **Monitor system resources**: `dagger call get-system-metrics`
5. **Check recent logs**: `dagger call function-name stdout`

## Rate Limits & Performance

### System Limits
- **Maximum Concurrent Agents**: 100 (configurable)
- **Function Execution Timeout**: 300 seconds (adjustable)
- **Memory Usage**: ~50MB baseline + 5MB per active agent
- **Message Queue Size**: 10,000 messages per agent

### Performance Optimization
- Use `execute-agents-load-balanced` for resource optimization
- Monitor with `get-system-metrics` and `generate-performance-report`
- Optimize cache usage with appropriate retention policies
- Use A2A communication for direct agent coordination

### Best Practices
1. **Batch Operations**: Use parallel execution for independent tasks
2. **Resource Monitoring**: Regular performance checks
3. **Cache Management**: Proper cache volume utilization
4. **Error Recovery**: Implement retry logic for critical operations
5. **Load Balancing**: Distribute workload across available agents

---

*This API reference covers all 65+ functions in the ProactivaDev platform. For specific implementation details, see the source code and integration tests.*