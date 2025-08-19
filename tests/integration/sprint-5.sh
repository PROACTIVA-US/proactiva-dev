#!/bin/bash
set -e

echo "Sprint 5 Test Suite"
echo "=================="

# Regression test
./tests/integration/sprint-4.sh || exit 1

echo ""
echo "Sprint 5 Tests"
echo "--------------"

echo "Test 1: Create workflow"
WORKFLOW_JSON='[{"name":"step1","agent":"code"},{"name":"step2","agent":"test"}]'
dagger call create-workflow --name="test-workflow" --steps="$WORKFLOW_JSON" stdout | grep -q "workflow_id" || exit 1
echo "✓ Workflow creation works"

echo "Test 2: Schedule task"
TASK_JSON='{"name":"test-task","type":"code"}'
dagger call schedule-task --task="$TASK_JSON" --priority=3 stdout | grep -q "task_id" || exit 1
echo "✓ Task scheduling works"

echo "Test 3: Assign task"
dagger call assign-task-to-agent --agent-id="agent-1" stdout | grep -q "task" || exit 1
echo "✓ Task assignment works"

echo "Test 4: Parallel workflow"
PARALLEL_TASKS='[{"name":"task1"},{"name":"task2"},{"name":"task3"}]'
dagger call execute-parallel-workflow --tasks="$PARALLEL_TASKS" stdout | grep -q "Parallel workflow" || exit 1
echo "✓ Parallel execution works"

echo "Test 5: Agent selection"
dagger call select-agent-for-task --task-type="generate" stdout | grep -q "selected_agent" || exit 1
echo "✓ Agent selection works"

echo "Test 6: Complete orchestration"
dagger call run-complete-orchestration --project-name="test" stdout | grep -q "Sprint 5 Complete" || exit 1
echo "✓ Complete orchestration works"

echo ""
echo "Sprint 5: ALL TESTS PASSED ✓"
echo "=========================="
echo "Total functions after Sprint 5: ~35"
echo ""
echo "🎉 MILESTONE REACHED!"
echo "Ready for first refactoring window"
echo "Save this state: git tag pre-refactor-checkpoint"