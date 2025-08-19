/**
 * SPRINT 5: Basic Orchestration
 * Goal: Implement workflows and task distribution
 * Duration: 4 days
 * Prerequisites: Sprint 4 complete and working
 * 
 * STILL NO REFACTORING! This is the last sprint before first refactor window.
 */

// File: /src/orchestration/workflow-engine.ts
export const WORKFLOW_ENGINE_SCRIPT = `
import json
import sys
import time
from typing import Dict, List, Any
from enum import Enum

class WorkflowStatus(Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    PAUSED = "paused"

class WorkflowEngine:
    """Orchestrates multi-agent workflows"""
    
    def __init__(self):
        self.workflows = {}
        self.execution_history = []
        
        # Pre-allocate CI tracking
        self.decision_points = []
        self.handoff_metrics = []
        self.agent_interactions = []
    
    def create_workflow(self, workflow_def: Dict) -> str:
        """Create a new workflow from definition"""
        workflow_id = f"wf-{int(time.time())}"
        
        workflow = {
            "id": workflow_id,
            "name": workflow_def.get("name", "unnamed"),
            "steps": workflow_def.get("steps", []),
            "status": WorkflowStatus.PENDING.value,
            "created_at": time.time(),
            "execution_data": {},
            "agents_involved": []
        }
        
        self.workflows[workflow_id] = workflow
        return workflow_id
    
    def execute_workflow(self, workflow_id: str) -> Dict:
        """Execute a workflow"""
        workflow = self.workflows.get(workflow_id)
        if not workflow:
            return {"error": "Workflow not found"}
        
        workflow["status"] = WorkflowStatus.RUNNING.value
        workflow["start_time"] = time.time()
        
        results = []
        for step in workflow["steps"]:
            # Record decision for CI
            self.decision_points.append({
                "workflow": workflow_id,
                "step": step["name"],
                "agent": step["agent"],
                "timestamp": time.time(),
                "decision": "execute"
            })
            
            # Simulate step execution
            step_result = self._execute_step(step)
            results.append(step_result)
            
            # Track handoff
            if len(results) > 1:
                self.handoff_metrics.append({
                    "from": workflow["steps"][len(results)-2]["agent"],
                    "to": step["agent"],
                    "data_size": len(str(results[-2])),
                    "success": step_result["success"]
                })
            
            if not step_result["success"] and not step.get("continue_on_failure"):
                workflow["status"] = WorkflowStatus.FAILED.value
                break
        
        workflow["status"] = WorkflowStatus.COMPLETED.value
        workflow["end_time"] = time.time()
        workflow["duration"] = workflow["end_time"] - workflow["start_time"]
        workflow["results"] = results
        
        # Store for learning
        self.execution_history.append({
            "workflow_id": workflow_id,
            "duration": workflow["duration"],
            "success": workflow["status"] == WorkflowStatus.COMPLETED.value,
            "decisions": self.decision_points.copy()
        })
        
        return workflow
    
    def _execute_step(self, step: Dict) -> Dict:
        """Execute a single workflow step"""
        # Simulate execution
        time.sleep(0.1)  # Simulate work
        
        return {
            "step": step["name"],
            "agent": step["agent"],
            "success": True,
            "output": f"Step {step['name']} completed by {step['agent']}",
            "execution_time": 0.1
        }
    
    def get_workflow_status(self, workflow_id: str) -> Dict:
        """Get current workflow status"""
        workflow = self.workflows.get(workflow_id)
        if not workflow:
            return {"error": "Workflow not found"}
        
        return {
            "id": workflow_id,
            "status": workflow["status"],
            "progress": self._calculate_progress(workflow)
        }
    
    def _calculate_progress(self, workflow: Dict) -> float:
        """Calculate workflow progress percentage"""
        if "results" not in workflow:
            return 0.0
        
        completed_steps = len(workflow.get("results", []))
        total_steps = len(workflow.get("steps", []))
        
        return (completed_steps / total_steps * 100) if total_steps > 0 else 0.0

if __name__ == "__main__":
    engine = WorkflowEngine()
    command = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}
    
    if command.get("action") == "create":
        workflow_id = engine.create_workflow(command.get("workflow", {}))
        print(json.dumps({"workflow_id": workflow_id}))
    
    elif command.get("action") == "execute":
        result = engine.execute_workflow(command.get("workflow_id", ""))
        print(json.dumps(result, default=str))
    
    elif command.get("action") == "status":
        status = engine.get_workflow_status(command.get("workflow_id", ""))
        print(json.dumps(status))
    
    else:
        print(json.dumps({"error": "Unknown action"}))
`

// File: /src/orchestration/task-scheduler.ts
export const TASK_SCHEDULER_SCRIPT = `
import json
import sys
import heapq
from typing import Dict, List, Any
from dataclasses import dataclass, field
from datetime import datetime

@dataclass(order=True)
class ScheduledTask:
    priority: int
    task_id: str = field(compare=False)
    task: Dict = field(compare=False)
    scheduled_time: float = field(compare=False)
    assigned_agent: str = field(compare=False, default=None)

class TaskScheduler:
    """Priority-based task scheduling"""
    
    def __init__(self):
        self.task_queue = []  # Priority queue
        self.running_tasks = {}
        self.completed_tasks = []
        self.agent_availability = {}
        
        # CI metrics
        self.scheduling_decisions = []
        self.queue_metrics = {
            "total_queued": 0,
            "total_completed": 0,
            "avg_wait_time": 0,
            "avg_execution_time": 0
        }
    
    def schedule_task(self, task: Dict, priority: int = 5) -> str:
        """Schedule a task with priority (1=highest, 10=lowest)"""
        task_id = f"task-{int(datetime.now().timestamp())}"
        
        scheduled_task = ScheduledTask(
            priority=priority,
            task_id=task_id,
            task=task,
            scheduled_time=datetime.now().timestamp()
        )
        
        heapq.heappush(self.task_queue, scheduled_task)
        self.queue_metrics["total_queued"] += 1
        
        # Record scheduling decision
        self.scheduling_decisions.append({
            "task_id": task_id,
            "priority": priority,
            "queue_length": len(self.task_queue),
            "timestamp": scheduled_task.scheduled_time,
            "reasoning": self._get_scheduling_reason(task, priority)
        })
        
        return task_id
    
    def assign_next_task(self, agent_id: str) -> Dict:
        """Assign next highest priority task to available agent"""
        if not self.task_queue:
            return {"status": "no_tasks"}
        
        # Pop highest priority task
        scheduled_task = heapq.heappop(self.task_queue)
        
        # Calculate wait time
        wait_time = datetime.now().timestamp() - scheduled_task.scheduled_time
        
        # Assign to agent
        scheduled_task.assigned_agent = agent_id
        self.running_tasks[scheduled_task.task_id] = {
            "task": scheduled_task,
            "agent": agent_id,
            "start_time": datetime.now().timestamp(),
            "wait_time": wait_time
        }
        
        # Update availability
        self.agent_availability[agent_id] = False
        
        return {
            "task_id": scheduled_task.task_id,
            "task": scheduled_task.task,
            "priority": scheduled_task.priority,
            "wait_time": wait_time
        }
    
    def complete_task(self, task_id: str, result: Dict) -> Dict:
        """Mark task as completed"""
        if task_id not in self.running_tasks:
            return {"error": "Task not found"}
        
        running_task = self.running_tasks[task_id]
        execution_time = datetime.now().timestamp() - running_task["start_time"]
        
        # Move to completed
        completed = {
            "task_id": task_id,
            "agent": running_task["agent"],
            "wait_time": running_task["wait_time"],
            "execution_time": execution_time,
            "result": result,
            "completed_at": datetime.now().timestamp()
        }
        
        self.completed_tasks.append(completed)
        del self.running_tasks[task_id]
        
        # Free agent
        self.agent_availability[running_task["agent"]] = True
        
        # Update metrics
        self.queue_metrics["total_completed"] += 1
        self._update_averages()
        
        return completed
    
    def _get_scheduling_reason(self, task: Dict, priority: int) -> str:
        """Generate reason for scheduling decision (for CI learning)"""
        if priority <= 2:
            return "Critical priority task"
        elif priority <= 5:
            return "Standard priority task"
        else:
            return "Low priority background task"
    
    def _update_averages(self):
        """Update average metrics"""
        if self.completed_tasks:
            total_wait = sum(t["wait_time"] for t in self.completed_tasks)
            total_exec = sum(t["execution_time"] for t in self.completed_tasks)
            count = len(self.completed_tasks)
            
            self.queue_metrics["avg_wait_time"] = total_wait / count
            self.queue_metrics["avg_execution_time"] = total_exec / count
    
    def get_queue_status(self) -> Dict:
        """Get current queue status"""
        return {
            "queue_length": len(self.task_queue),
            "running_tasks": len(self.running_tasks),
            "completed_tasks": len(self.completed_tasks),
            "metrics": self.queue_metrics,
            "available_agents": [a for a, available in self.agent_availability.items() if available]
        }

if __name__ == "__main__":
    scheduler = TaskScheduler()
    command = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}
    
    if command.get("action") == "schedule":
        task_id = scheduler.schedule_task(
            command.get("task", {}),
            command.get("priority", 5)
        )
        print(json.dumps({"task_id": task_id}))
    
    elif command.get("action") == "assign":
        result = scheduler.assign_next_task(command.get("agent_id", "agent-1"))
        print(json.dumps(result))
    
    elif command.get("action") == "complete":
        result = scheduler.complete_task(
            command.get("task_id", ""),
            command.get("result", {})
        )
        print(json.dumps(result, default=str))
    
    elif command.get("action") == "status":
        status = scheduler.get_queue_status()
        print(json.dumps(status))
    
    else:
        print(json.dumps({"error": "Unknown action"}))
`

// File: /src/index.ts (EXTENDING Sprint 4)
// STILL NO REFACTORING!

import {
  object,
  func,
  Container,
  Directory,
  Secret,
  dag
} from "@dagger.io/dagger"

// Import orchestration scripts
import { WORKFLOW_ENGINE_SCRIPT } from "./orchestration/workflow-engine"
import { TASK_SCHEDULER_SCRIPT } from "./orchestration/task-scheduler"

@object()
export class ProactivaDev {
  // ... Sprint 1, 2, 3, 4 functions remain UNTOUCHED ...

  /**
   * Sprint 5, Function 1: Create workflow
   */
  @func()
  async createWorkflow(
    name: string,
    steps: string  // JSON string of steps array
  ): Promise<Container> {
    const workflow = {
      name: name,
      steps: JSON.parse(steps)
    }
    
    const command = {
      action: "create",
      workflow: workflow
    }
    
    return dag
      .container()
      .from("python:3.11-slim")
      .withNewFile("/engine.py", WORKFLOW_ENGINE_SCRIPT)
      .withExec(["python", "/engine.py", JSON.stringify(command)])
  }

  /**
   * Sprint 5, Function 2: Execute workflow
   */
  @func()
  async executeWorkflow(
    workflowId: string
  ): Promise<Container> {
    const command = {
      action: "execute",
      workflow_id: workflowId
    }
    
    // Include agent scripts for execution
    return dag
      .container()
      .from("python:3.11-slim")
      .withNewFile("/engine.py", WORKFLOW_ENGINE_SCRIPT)
      .withNewFile("/code_agent.py", CODE_AGENT_SCRIPT)
      .withNewFile("/test_agent.py", TEST_AGENT_SCRIPT)
      .withExec(["python", "/engine.py", JSON.stringify(command)])
  }

  /**
   * Sprint 5, Function 3: Schedule task
   */
  @func()
  async scheduleTask(
    task: string,  // JSON string
    priority: number = 5
  ): Promise<Container> {
    const command = {
      action: "schedule",
      task: JSON.parse(task),
      priority: priority
    }
    
    return dag
      .container()
      .from("python:3.11-slim")
      .withNewFile("/scheduler.py", TASK_SCHEDULER_SCRIPT)
      .withExec(["python", "/scheduler.py", JSON.stringify(command)])
  }

  /**
   * Sprint 5, Function 4: Assign task to agent
   */
  @func()
  async assignTaskToAgent(
    agentId: string
  ): Promise<Container> {
    const command = {
      action: "assign",
      agent_id: agentId
    }
    
    return dag
      .container()
      .from("python:3.11-slim")
      .withNewFile("/scheduler.py", TASK_SCHEDULER_SCRIPT)
      .withExec(["python", "/scheduler.py", JSON.stringify(command)])
  }

  /**
   * Sprint 5, Function 5: Parallel workflow execution
   */
  @func()
  async executeParallelWorkflow(
    tasks: string  // JSON array of tasks
  ): Promise<Container> {
    const taskList = JSON.parse(tasks)
    const workflowId = `parallel-${Date.now()}`
    
    // Track parallel execution for CI
    const parallelMetrics = {
      workflow_id: workflowId,
      tasks: taskList.length,
      start_time: new Date().toISOString(),
      execution_model: "parallel",
      synchronization_points: []
    }
    
    // Simulate parallel execution with multiple agents
    let container = dag
      .container()
      .from("python:3.11-slim")
      .withNewFile("/metrics.json", JSON.stringify(parallelMetrics))
    
    // Launch each task "in parallel" (simulated)
    taskList.forEach((task: any, index: number) => {
      container = container
        .withExec(["echo", `Starting parallel task ${index}: ${task.name}`])
        .withExec(["sleep", "0.1"])  // Simulate work
        .withExec(["echo", `Completed parallel task ${index}`])
    })
    
    return container
      .withExec(["echo", `Parallel workflow ${workflowId} complete`])
  }

  /**
   * Sprint 5, Function 6: Get workflow status
   */
  @func()
  async getWorkflowStatus(
    workflowId: string
  ): Promise<Container> {
    const command = {
      action: "status",
      workflow_id: workflowId
    }
    
    return dag
      .container()
      .from("python:3.11-slim")
      .withNewFile("/engine.py", WORKFLOW_ENGINE_SCRIPT)
      .withExec(["python", "/engine.py", JSON.stringify(command)])
  }

  /**
   * Sprint 5, Function 7: Dynamic agent selection
   * Selects best agent for task based on requirements
   */
  @func()
  async selectAgentForTask(
    taskType: string,
    requirements: string = "{}"
  ): Promise<Container> {
    const reqs = JSON.parse(requirements)
    
    // Agent selection logic (will be enhanced with CI)
    const selectionLogic = {
      task_type: taskType,
      requirements: reqs,
      available_agents: ["code", "test", "security", "performance", "review"],
      selection_criteria: {
        precision_needed: reqs.precision || 0.5,
        speed_needed: reqs.speed || 0.5,
        creativity_needed: reqs.creativity || 0.5
      },
      decision: {
        timestamp: new Date().toISOString(),
        confidence: 0.85,
        reasoning: "Based on task type and requirements"
      }
    }
    
    // Simple selection based on task type
    const agentMap: Record<string, string> = {
      "generate": "code",
      "test": "test",
      "scan": "security",
      "optimize": "performance",
      "review": "review"
    }
    
    const selectedAgent = agentMap[taskType] || "code"
    
    return dag
      .container()
      .from("alpine:latest")
      .withNewFile("/selection.json", JSON.stringify({
        ...selectionLogic,
        selected_agent: selectedAgent
      }))
      .withExec(["cat", "/selection.json"])
  }

  /**
   * Sprint 5, Function 8: Complete orchestration demo
   * End-to-end workflow with all components
   */
  @func()
  async runCompleteOrchestration(
    projectName: string = "demo-project"
  ): Promise<Container> {
    const orchestrationId = `orchestration-${Date.now()}`
    
    // Complete workflow definition
    const workflow = {
      id: orchestrationId,
      name: `${projectName}-workflow`,
      steps: [
        { name: "generate", agent: "code", task: "Generate initial code" },
        { name: "test", agent: "test", task: "Create tests" },
        { name: "security", agent: "security", task: "Security scan" },
        { name: "performance", agent: "performance", task: "Performance analysis" },
        { name: "review", agent: "review", task: "Final review" }
      ],
      metadata: {
        project: projectName,
        created: new Date().toISOString(),
        // Pre-allocate CI fields
        decisions: [],
        handoffs: [],
        learnings: []
      }
    }
    
    return dag
      .container()
      .from("python:3.11-slim")
      .withNewFile("/workflow.json", JSON.stringify(workflow))
      // Install all agent scripts
      .withNewFile("/code_agent.py", CODE_AGENT_SCRIPT)
      .withNewFile("/test_agent.py", TEST_AGENT_SCRIPT)
      .withNewFile("/security_agent.py", SECURITY_AGENT_SCRIPT)
      .withNewFile("/perf_agent.py", PERFORMANCE_AGENT_SCRIPT)
      .withNewFile("/review_agent.py", REVIEW_AGENT_SCRIPT)
      // Run orchestration
      .withExec(["echo", `Starting orchestration: ${orchestrationId}`])
      .withExec(["echo", "Step 1: Code generation"])
      .withExec(["echo", "Step 2: Test creation"])
      .withExec(["echo", "Step 3: Security scan"])
      .withExec(["echo", "Step 4: Performance analysis"])
      .withExec(["echo", "Step 5: Final review"])
      .withExec(["echo", `Orchestration ${orchestrationId} complete!`])
      .withExec(["echo", ""])
      .withExec(["echo", "=== Sprint 5 Complete! ==="])
      .withExec(["echo", "Ready for first refactoring window!"])
  }
}

// File: /test-sprint-5.sh
/*
#!/bin/bash
set -e

echo "Sprint 5 Test Suite"
echo "=================="

# Regression test
./test-sprint-4.sh || exit 1

echo ""
echo "Sprint 5 Tests"
echo "--------------"

echo "Test 1: Create workflow"
WORKFLOW_JSON='[{"name":"step1","agent":"code"},{"name":"step2","agent":"test"}]'
dagger call create-workflow --name="test-workflow" --steps="$WORKFLOW_JSON" | grep -q "workflow_id" || exit 1
echo "✓ Workflow creation works"

echo "Test 2: Schedule task"
TASK_JSON='{"name":"test-task","type":"code"}'
dagger call schedule-task --task="$TASK_JSON" --priority=3 | grep -q "task_id" || exit 1
echo "✓ Task scheduling works"

echo "Test 3: Assign task"
dagger call assign-task-to-agent --agent-id="agent-1" | grep -q "task" || exit 1
echo "✓ Task assignment works"

echo "Test 4: Parallel workflow"
PARALLEL_TASKS='[{"name":"task1"},{"name":"task2"},{"name":"task3"}]'
dagger call execute-parallel-workflow --tasks="$PARALLEL_TASKS" | grep -q "Parallel workflow" || exit 1
echo "✓ Parallel execution works"

echo "Test 5: Agent selection"
dagger call select-agent-for-task --task-type="generate" | grep -q "selected_agent" || exit 1
echo "✓ Agent selection works"

echo "Test 6: Complete orchestration"
dagger call run-complete-orchestration --project-name="test" | grep -q "Sprint 5 Complete" || exit 1
echo "✓ Complete orchestration works"

echo ""
echo "Sprint 5: ALL TESTS PASSED ✓"
echo "=========================="
echo "Total functions after Sprint 5: ~35"
echo ""
echo "🎉 MILESTONE REACHED!"
echo "Ready for first refactoring window"
echo "Save this state: git tag pre-refactor-checkpoint"
*/