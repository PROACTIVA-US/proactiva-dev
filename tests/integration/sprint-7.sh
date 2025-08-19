#!/bin/bash
set -e

echo "Sprint 7 Test Suite"
echo "=================="

echo ""
echo "Sprint 7 Tests"
echo "--------------"

echo "Test 1: Initialize A2A mesh"
dagger call initialize-a-2-amesh stdout | grep -q "total_channels" || exit 1
echo "✓ A2A mesh initialized"

echo "Test 2: Send A2A message"
dagger call send-a-2-amessage --from-agent="agent-1" --to-agent="agent-2" --message-type="QUERY" stdout | grep -q "msg-" || exit 1
echo "✓ A2A message sent"

echo "Test 3: Receive messages"
dagger call receive-a-2-amessages --agent-id="agent-2" stdout | grep -q "\\[" || exit 1
echo "✓ Messages received"

echo "Test 4: Agent negotiation"
dagger call negotiate-between-agents --initiator="agent-1" --responder="agent-2" stdout | grep -q "negotiation_id" || exit 1
echo "✓ Negotiation works"

echo "Test 5: Initialize trust network"
dagger call initialize-trust-network --num-agents=5 stdout | grep -q "average_trust" || exit 1
echo "✓ Trust network initialized"

echo "Test 6: Update trust"
dagger call update-trust-score --agent1="agent-0" --agent2="agent-1" --outcome="success" stdout | grep -q "new_trust" || exit 1
echo "✓ Trust update works"

echo "Test 7: Suggest team"
dagger call suggest-optimal-team --team-size=3 stdout | grep -q "suggested_team" || exit 1
echo "✓ Team suggestion works"

echo "Test 8: Trust clusters"
dagger call identify-trust-clusters stdout | grep -q "trust_clusters" || exit 1
echo "✓ Trust clusters identified"

echo "Test 9: A2A conversation"
dagger call run-a-2-aconversation stdout | grep -q "Conversation Complete" || exit 1
echo "✓ A2A conversation demo works"

echo ""
echo "Sprint 7: ALL TESTS PASSED ✓"
echo "=========================="
echo "Total functions after Sprint 7: ~45"
echo ""
echo "🤖 Agents can now talk to each other!"