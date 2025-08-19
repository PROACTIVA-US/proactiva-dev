#!/bin/bash
set -e

echo "Sprint 3 Test Suite"
echo "=================="

# Regression tests
echo "Running Sprint 2 tests..."
./tests/integration/sprint-2.sh || exit 1

echo ""
echo "Sprint 3 Tests"
echo "--------------"

echo "Test 1: Code agent creation"
dagger call create-code-agent stdout | grep -q "CodeAgent initialized" || exit 1
echo "✓ Code agent works"

echo "Test 2: Code generation"
dagger call generate-code --specification="Process user data" stdout | grep -q "generated_function" || exit 1
echo "✓ Code generation works"

echo "Test 3: Test agent creation"
dagger call create-test-agent stdout | grep -q "TestAgent initialized" || exit 1
echo "✓ Test agent works"

echo "Test 4: Test generation"
dagger call generate-tests stdout | grep -q "test_function" || exit 1
echo "✓ Test generation works"

echo "Test 5: Security agent creation"
dagger call create-security-agent stdout | grep -q "SecurityAgent initialized" || exit 1
echo "✓ Security agent works"

echo "Test 6: Security scan"
dagger call scan-security --code="password='12345'" stdout | grep -q "Hardcoded password" || exit 1
echo "✓ Security scan works"

echo "Test 7: Agent collaboration"
dagger call agent-collaboration --task="Create user handler" stdout | grep -q "Collaboration complete" || exit 1
echo "✓ Agent collaboration works"

echo ""
echo "Sprint 3: ALL TESTS PASSED ✓"
echo "=========================="