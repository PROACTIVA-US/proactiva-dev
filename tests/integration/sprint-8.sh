#!/bin/bash
set -e

echo "Sprint 8 Test Suite"
echo "=================="

# Regression test
./tests/integration/sprint-7.sh || exit 1

echo ""
echo "Sprint 8 Tests"
echo "--------------"

echo "Test 1: Enable A2A communication"
dagger call enable-a-2-acommunication --message-bus-url="tcp://localhost:5555" stdout | grep -q "A2A Communication enabled" || exit 1
echo "✓ A2A communication enabled"

echo "Test 2: Create task delegation network"
AGENTS_JSON='[{"name":"code","capabilities":["generate","refactor"]},{"name":"test","capabilities":["unit","integration"]}]'
dagger call create-task-delegation-network --agents="$AGENTS_JSON" stdout | grep -q "total_agents" || exit 1
echo "✓ Task delegation network created"

echo "Test 3: Discover agent capabilities"
dagger call discover-agent-capabilities stdout | grep -q "backend_agent" || exit 1
echo "✓ Agent capabilities discovered"

echo "Test 4: Execute collaborative task"
TASK_JSON='{"name":"complex_task","requirements":["code","test","security"]}'
REQUIRED_AGENTS='["code","test","security"]'
dagger call execute-collaborative-task --task="$TASK_JSON" --required-agents="$REQUIRED_AGENTS" stdout | grep -q "summary" || exit 1
echo "✓ Collaborative task executed"

echo "Test 5: Setup direct communication"
dagger call setup-direct-communication --source-agent="code" --target-agent="test" --protocol="tcp" stdout | grep -q "channel" || exit 1
echo "✓ Direct communication setup"

echo "Test 6: Monitor A2A communication"
dagger call monitor-a-2-acommunication --duration=5 stdout | grep -q "Communication Report" || exit 1
echo "✓ A2A communication monitoring works"

echo ""
echo "Sprint 8: ALL TESTS PASSED ✓"
echo "=========================="
echo "Total functions after Sprint 8: ~51"
echo ""
echo "🚀 ADVANCED A2A COMMUNICATION COMPLETE!"
echo "Agents now have:"
echo "  • Enhanced messaging protocols"
echo "  • Task delegation networks"
echo "  • Capability discovery"
echo "  • Direct communication channels"
echo "  • Communication monitoring"