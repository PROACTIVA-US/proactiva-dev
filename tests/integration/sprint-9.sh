#!/bin/bash
set -e

echo "Sprint 9 REVISED Test Suite"
echo "==========================="

# Regression test
./tests/integration/sprint-8.sh || exit 1

echo ""
echo "Sprint 9 Tests"
echo "--------------"

echo "Test 1: Initialize collective learning"
dagger call initialize-collective-learning stdout | grep -q "initialized" || exit 1
echo "✓ Collective learning initialized"

echo "Test 2: Store experience"
EXPERIENCE='{
  "task": {"type": "code-review", "description": "Review API endpoints", "complexity": 5},
  "agents": [
    {"id": "agent-1", "type": "code", "role": "reviewer"},
    {"id": "agent-2", "type": "test", "role": "validator"}
  ],
  "outcome": {"success": true, "quality": 0.85, "duration": 150, "tokensUsed": 75},
  "interactions": [],
  "decisions": ["use-static-analysis", "require-tests"],
  "lessonsLearned": ["automated-checks-helpful"]
}'
dagger call learn-from-experience --experience="$EXPERIENCE" stdout | grep -q "experienceId" || exit 1
echo "✓ Experience stored and learned"

echo "Test 3: Query collective memory"
CRITERIA='{"taskType": "code-review", "minQuality": 0.5, "limit": 10}'
dagger call query-collective-memory --criteria="$CRITERIA" stdout | grep -q "experiences" || exit 1
echo "✓ Memory query works"

echo "Test 4: Pattern recognition"
# Add more experiences for pattern recognition
for i in {1..5}; do
  EXP="{\"task\":{\"type\":\"code-review\",\"complexity\":5},\"agents\":[{\"type\":\"code\"},{\"type\":\"test\"}],\"outcome\":{\"success\":true,\"quality\":0.$((70 + i * 5))}}"
  dagger call learn-from-experience --experience="$EXP" stdout > /dev/null 2>&1
done
dagger call recognize-patterns stdout | grep -q "patterns" || exit 1
echo "✓ Pattern recognition works"

echo "Test 5: Generate insights"
dagger call generate-learning-insights stdout | grep -q "key_insights" || exit 1
echo "✓ Learning insights generated"

echo "Test 6: Optimize from learnings"
dagger call optimize-from-learnings stdout | grep -q "strategies" || exit 1
echo "✓ Optimization strategies generated"

echo ""
echo "Sprint 9: ALL TESTS PASSED ✓"
echo "=========================="
echo "Total functions after Sprint 9: ~57"
echo ""
echo "🧠 COLLECTIVE LEARNING COMPLETE!"
echo "System capabilities:"
echo "  • Experience storage & retrieval"
echo "  • Pattern recognition"
echo "  • Trust network evolution"
echo "  • Learning insights"
echo "  • Optimization strategies"
echo "  • Performance monitoring"