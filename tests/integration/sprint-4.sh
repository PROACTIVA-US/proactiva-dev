#!/bin/bash
set -e

echo "Sprint 4 Test Suite"
echo "=================="

# Regression test previous sprints
echo "Running Sprint 3 tests..."
./tests/integration/sprint-3.sh || exit 1

echo ""
echo "Sprint 4 Tests"
echo "--------------"

echo "Test 1: Performance agent creation"
dagger call create-performance-agent stdout | grep -q "PerformanceAgent initialized" || exit 1
echo "✓ Performance agent works"

echo "Test 2: Performance profiling"
dagger call profile-performance --code="for i in range(100): print(i)" stdout | grep -q "profile" || exit 1
echo "✓ Performance profiling works"

echo "Test 3: Review agent creation"
dagger call create-review-agent stdout | grep -q "ReviewAgent initialized" || exit 1
echo "✓ Review agent works"

echo "Test 4: Code review"
dagger call review-code --code="def test(): pass" stdout | grep -q "overall_score" || exit 1
echo "✓ Code review works"

echo "Test 5: Tool registry"
dagger call initialize-tool-registry stdout | grep -q "filesystem" || exit 1
echo "✓ Tool registry works"

echo "Test 6: Tool recommendations"
dagger call get-tool-recommendations --agent-type="security" stdout | grep -q "recommended_tools" || exit 1
echo "✓ Tool recommendations work"

echo "Test 7: Review pipeline"
dagger call run-review-pipeline --code="def hello(): return 'world'" stdout | grep -q "Review pipeline complete" || exit 1
echo "✓ Review pipeline works"

echo "Test 8: Capability matrix"
dagger call get-agent-capability-matrix stdout | grep -q "cognitive" || exit 1
echo "✓ Capability matrix works"

echo ""
echo "Sprint 4: ALL TESTS PASSED ✓"
echo "=========================="
echo "Total functions after Sprint 4: ~27"