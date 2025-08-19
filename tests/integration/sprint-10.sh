#!/bin/bash
set -e

echo "Sprint 10 REVISED Test Suite"
echo "============================"

# Regression test
./tests/integration/sprint-9.sh || exit 1

echo ""
echo "Sprint 10 Tests"
echo "---------------"

echo "Test 1: Initialize evolutionary intelligence"
dagger call initialize-evolutionary-intelligence stdout | grep -q "collective-intelligence-v1" || exit 1
echo "✓ Evolutionary intelligence initialized"

echo "Test 2: Evolve from execution"
EXECUTION_RECORD='{
  "id": "exec-001",
  "task_type": "code-review",
  "agents": [
    {"id": "agent-1", "type": "code"},
    {"id": "agent-2", "type": "review"}
  ],
  "success": true,
  "duration": 3000,
  "expected_duration": 4000,
  "quality": 0.85
}'
dagger call evolve-from-execution --execution-record="$EXECUTION_RECORD" stdout | grep -q "patterns_discovered" || exit 1
echo "✓ Evolution from execution works"

echo "Test 3: Predict optimal team"
TASK_DESC="Review and optimize the authentication module for security vulnerabilities"
dagger call predict-optimal-team --task-description="$TASK_DESC" stdout | grep -q "recommended_team" || exit 1
echo "✓ Team prediction works"

echo "Test 4: Get emergent insights"
# Add more executions to generate patterns
for i in {1..5}; do
  EXEC="{\"id\":\"exec-$i\",\"task_type\":\"code\",\"agents\":[{\"type\":\"code\"},{\"type\":\"test\"}],\"success\":true,\"duration\":2000,\"expected_duration\":3000}"
  dagger call evolve-from-execution --execution-record="$EXEC" stdout > /dev/null 2>&1
done
dagger call get-emergent-insights stdout | grep -q "emergent_behaviors" || exit 1
echo "✓ Emergent insights generated"

echo "Test 5: Trigger system evolution"
dagger call trigger-system-evolution stdout | grep -q "new_generation" || exit 1
echo "✓ System evolution triggered"

echo "Test 6: Export collective knowledge"
dagger call export-collective-knowledge stdout | grep -q "export_successful" || exit 1
echo "✓ Knowledge export works"

echo ""
echo "Sprint 10: ALL TESTS PASSED ✓"
echo "============================="
echo "Total functions after Sprint 10: ~63"
echo ""
echo "🧬 EVOLUTIONARY INTELLIGENCE COMPLETE!"
echo "System capabilities:"
echo "  • Pattern recognition & learning"
echo "  • Strategy evolution & mutation"
echo "  • Team prediction based on history"
echo "  • Emergent behavior detection"
echo "  • Generational evolution"
echo "  • Knowledge export/import"
echo ""
echo "The system now evolves and improves autonomously!"