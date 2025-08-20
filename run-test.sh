#!/bin/bash

# ProactivaDev Interactive Test Runner
# Simple script to run real tests that actually work with current functions

set -e

echo "🧪 ProactivaDev Test Runner"
echo "=========================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to run test and show results
run_test() {
    local test_name=$1
    local test_cmd=$2
    
    echo -e "${BLUE}▶ Running: $test_name${NC}"
    if eval "$test_cmd"; then
        echo -e "${GREEN}✓ $test_name passed${NC}\n"
        return 0
    else
        echo -e "${RED}✗ $test_name failed${NC}\n"
        return 1
    fi
}

# Test Suite Selection
echo "Select a test suite to run:"
echo "1) Quick Connection Test (30 seconds)"
echo "2) Agent Creation & Execution (2 minutes)"
echo "3) A2A Communication Test (3 minutes)"
echo "4) Learning System Test (5 minutes)"
echo "5) Full Integration Test (10 minutes)"
echo "6) Custom Test (enter your own command)"
echo ""
read -p "Enter choice (1-6): " choice

case $choice in
    1)
        echo -e "\n${YELLOW}Quick Connection Test${NC}"
        echo "====================="
        
        run_test "System Connection" \
            "dagger call test-connection"
        
        run_test "Function Count" \
            "test \$(dagger functions | grep -c '^  ') -ge 65"
        
        run_test "Get System Status" \
            "dagger call get-system-status"
        
        run_test "Check Memory State" \
            "dagger call check-memory-state"
        ;;
        
    2)
        echo -e "\n${YELLOW}Agent Creation & Execution Test${NC}"
        echo "================================"
        
        run_test "Create Code Agent" \
            "dagger call create-agent --name 'test-coder' --type 'code'"
        
        run_test "Create Test Agent" \
            "dagger call create-agent --name 'test-tester' --type 'test'"
        
        run_test "Execute Simple Task" \
            "dagger call execute-agent --agent-id 'agent-1' --task 'Write a hello world function'"
        
        run_test "Execute Parallel Agents" \
            "dagger call execute-agents-parallel --task 'Analyze code quality'"
        
        run_test "Get Agent Metrics" \
            "dagger call get-agent-metrics --agent-id 'agent-1'"
        ;;
        
    3)
        echo -e "\n${YELLOW}A2A Communication Test${NC}"
        echo "======================"
        
        run_test "Initialize A2A Mesh" \
            "dagger call initialize-a2a-mesh --agents 3"
        
        run_test "Send A2A Message" \
            "dagger call send-a2a-message --from 'agent-1' --to 'agent-2' --content 'Test message' --priority 1"
        
        run_test "Check Trust Network" \
            "dagger call get-trust-network-status"
        
        run_test "Monitor Communication" \
            "dagger call monitor-a2a-communication --duration 5"
        ;;
        
    4)
        echo -e "\n${YELLOW}Learning System Test${NC}"
        echo "===================="
        
        # Create test experiences
        EXPERIENCE1='{"task_type":"code_review","success":true,"agents":["code","test"],"duration":5000,"patterns":["validation","error-handling"]}'
        EXPERIENCE2='{"task_type":"bug_fix","success":true,"agents":["code","security"],"duration":3000,"patterns":["null-check","bounds-check"]}'
        EXPERIENCE3='{"task_type":"api_design","success":false,"agents":["code"],"duration":8000,"error":"timeout"}'
        
        run_test "Learn from Success Experience" \
            "dagger call learn-from-experience --experience '$EXPERIENCE1'"
        
        run_test "Learn from Another Success" \
            "dagger call learn-from-experience --experience '$EXPERIENCE2'"
        
        run_test "Learn from Failure" \
            "dagger call learn-from-experience --experience '$EXPERIENCE3'"
        
        run_test "Analyze Patterns" \
            "dagger call analyze-collective-patterns"
        
        run_test "Generate Insights" \
            "dagger call generate-collective-insights"
        
        run_test "Check Learning State" \
            "dagger call get-collective-memory-stats"
        ;;
        
    5)
        echo -e "\n${YELLOW}Full Integration Test${NC}"
        echo "====================="
        
        # Test 1: Create and execute pipeline
        echo -e "${BLUE}Test Group 1: Pipeline Execution${NC}"
        run_test "Create Agent Pipeline" \
            "dagger call execute-agent-pipeline --agents '[\"code\",\"test\",\"review\"]' --task 'Create a user authentication module'"
        
        # Test 2: A2A Communication
        echo -e "${BLUE}Test Group 2: A2A Mesh${NC}"
        run_test "Setup Communication Mesh" \
            "dagger call initialize-a2a-mesh --agents 5"
        
        run_test "Test Message Routing" \
            "dagger call route-a2a-message --from 'agent-1' --to 'agent-5' --content 'Integration test message'"
        
        # Test 3: Collective Learning
        echo -e "${BLUE}Test Group 3: Collective Intelligence${NC}"
        run_test "Store Multiple Experiences" \
            "for i in 1 2 3; do dagger call learn-from-experience --experience '{\"task\":\"test-\$i\",\"success\":true,\"agents\":[\"code\"]}'; done"
        
        run_test "Trigger Evolution" \
            "dagger call trigger-evolution --mutation-rate 0.1 --fitness-threshold 0.7"
        
        # Test 4: System Metrics
        echo -e "${BLUE}Test Group 4: System Health${NC}"
        run_test "Get Performance Metrics" \
            "dagger call get-system-metrics"
        
        run_test "Generate Performance Report" \
            "dagger call generate-performance-report"
        
        # Test 5: Knowledge Export
        echo -e "${BLUE}Test Group 5: Knowledge Management${NC}"
        run_test "Export System Knowledge" \
            "dagger call export-knowledge --format 'json'"
        
        run_test "Get Evolution Summary" \
            "dagger call get-evolution-summary"
        ;;
        
    6)
        echo -e "\n${YELLOW}Custom Test${NC}"
        echo "==========="
        read -p "Enter Dagger command to test: " custom_cmd
        run_test "Custom Command" "$custom_cmd"
        ;;
        
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

# Summary
echo ""
echo "======================================"
echo -e "${GREEN}Test Suite Complete!${NC}"
echo ""

# Show system status after tests
echo "Final System Status:"
dagger call get-system-status

echo ""
echo "For more detailed testing, run:"
echo "  ./tests/real-world-tests.sh    # Comprehensive test suite"
echo "  ./tests/scenario-tests.md      # Test scenario documentation"