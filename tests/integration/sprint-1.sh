#!/bin/bash
set -e

echo "Sprint 1 Test Suite"
echo "=================="

echo "Test 1: Module loads"
dagger functions | grep -q "test-connection" || exit 1
echo "✓ Module loads"

echo "Test 2: Connection test"
dagger call test-connection | grep -q "Successfully" || exit 1
echo "✓ Connection works"

echo "Test 3: Container execution"
dagger call execute-container --command="echo test" stdout | grep -q "test" || exit 1
echo "✓ Container execution works"

echo "Test 4: State persistence"
dagger call save-state --key="test" --value="sprint1" stdout > /dev/null
dagger call load-state --key="test" stdout | grep -q "sprint1" || exit 1
echo "✓ State persistence works"

echo "Test 5: Tool installation"
dagger call execute-with-tools --script="import requests; print('tools work')" stdout | grep -q "tools work" || exit 1
echo "✓ Tool installation works"

echo "Test 6: Logging"
dagger call execute-with-logging --task="echo logged" stdout | grep -q "timestamp" || exit 1
echo "✓ Logging works"

echo ""
echo "Sprint 1: ALL TESTS PASSED ✓"
echo "=========================="