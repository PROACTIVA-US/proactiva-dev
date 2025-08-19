#!/bin/bash
set -e

echo "Sprint 2 Test Suite"
echo "=================="

# Test Sprint 1 still works
echo "Regression Test: Sprint 1"
./tests/integration/sprint-1.sh || exit 1

echo ""
echo "Sprint 2 Tests"
echo "--------------"

echo "Test 1: Create agent"
dagger call create-agent --name="test-agent" --type="code" stdout | grep -q "initialized" || exit 1
echo "✓ Agent creation works"

echo "Test 2: Execute agent (mock API key)"
TEST_KEY="test-key" dagger call execute-agent --agent-type="general" --task="test task" --llm-api-key=env:TEST_KEY stdout | grep -q "Processing task" || exit 1
echo "✓ Agent execution works"

echo "Test 3: Agent pipeline"
TEST_KEY="test-key" dagger call execute-agent-pipeline --task="test" --agents="code,test" --llm-api-key=env:TEST_KEY stdout | grep -q "Pipeline complete" || exit 1
echo "✓ Agent pipeline works"

echo "Test 4: Agent with tools"
TEST_KEY="test-key" dagger call execute-agent-with-tools --task="test" --tools="search,calculate" --llm-api-key=env:TEST_KEY stdout | grep -q "Using tool" || exit 1
echo "✓ Agent tools work"

echo "Test 5: Agent memory"
dagger call update-agent-memory --agent-id="test" --key="fact" --value="data" stdout | grep -q "Memory updated" || exit 1
echo "✓ Agent memory works"

echo "Test 6: Agent metrics"
dagger call get-agent-metrics --agent-id="test" stdout | grep -q "memory_entries" || exit 1
echo "✓ Agent metrics work"

echo ""
echo "Sprint 2: ALL TESTS PASSED ✓"
echo "=========================="