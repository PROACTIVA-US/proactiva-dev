#!/bin/bash

# ProactivaDev Real-World Test Suite
# Comprehensive tests that validate the entire system

set -e

echo "🧪 ProactivaDev Real-World Test Suite"
echo "======================================"

# Test 1: Multi-Agent Code Review Pipeline
test_code_review_pipeline() {
    echo ""
    echo "📝 Test 1: Multi-Agent Code Review Pipeline"
    echo "--------------------------------------------"
    echo "Scenario: Submit buggy code for multi-agent review and fixing"
    
    # Create a buggy code sample
    echo 'function calculateTotal(items) {
        let total = 0;
        for (let i = 0; i <= items.length; i++) {  // Bug: should be i < items.length
            total += items[i].price * items[i].quantity;
        }
        return total;  // Bug: no null check
    }' > /tmp/buggy-code.js
    
    # Phase 1: Code agent analyzes
    echo "→ Phase 1: Code agent analyzing..."
    dagger call create-agent --name "analyzer" --type "code" \
        --task "Analyze this code for bugs: $(cat /tmp/buggy-code.js)"
    
    # Phase 2: Security agent reviews
    echo "→ Phase 2: Security agent reviewing..."
    dagger call create-agent --name "security" --type "security" \
        --task "Review for security vulnerabilities"
    
    # Phase 3: Test agent creates tests
    echo "→ Phase 3: Test agent creating tests..."
    dagger call create-agent --name "tester" --type "test" \
        --task "Create comprehensive tests for calculateTotal function"
    
    # Phase 4: Review agent coordinates fixes
    echo "→ Phase 4: Review agent coordinating..."
    dagger call execute-agent-pipeline \
        --agents '["analyzer","security","tester"]' \
        --task "Fix all identified issues and verify"
    
    # Check collective learning
    echo "→ Phase 5: System learning from review..."
    dagger call learn-from-experience \
        --experience '{"task":"code_review","success":true,"patterns":["off-by-one","null-check"],"agents":["code","security","test","review"]}'
}

# Test 2: A2A Communication Stress Test
test_a2a_communication() {
    echo ""
    echo "🔗 Test 2: A2A Communication Mesh Stress Test"
    echo "----------------------------------------------"
    echo "Scenario: 10 agents collaborating on distributed task with trust networks"
    
    # Initialize A2A mesh with 10 agents
    echo "→ Creating A2A mesh with 10 agents..."
    dagger call initialize-a2a-mesh --agents 10
    
    # Send burst of messages
    echo "→ Sending 100 messages across mesh..."
    for i in {1..100}; do
        FROM=$((RANDOM % 10 + 1))
        TO=$((RANDOM % 10 + 1))
        dagger call send-a2a-message \
            --from "agent-$FROM" \
            --to "agent-$TO" \
            --content "Task fragment $i" \
            --priority $((RANDOM % 3 + 1)) &
    done
    wait
    
    # Monitor communication patterns
    echo "→ Analyzing communication patterns..."
    dagger call monitor-a2a-communication --duration 10
    
    # Check trust scores
    echo "→ Evaluating trust network evolution..."
    dagger call get-trust-network-status
}

# Test 3: Collective Learning from Failures
test_learning_from_failures() {
    echo ""
    echo "🧠 Test 3: Collective Learning from Failure Patterns"
    echo "-----------------------------------------------------"
    echo "Scenario: System learns from repeated failures and adapts"
    
    # Simulate various failure scenarios
    FAILURES=(
        '{"task_type":"api_integration","error":"timeout","agent":"code","duration":30000}'
        '{"task_type":"api_integration","error":"timeout","agent":"test","duration":28000}'
        '{"task_type":"database_query","error":"deadlock","agent":"code","duration":5000}'
        '{"task_type":"api_integration","error":"timeout","agent":"review","duration":31000}'
        '{"task_type":"database_query","error":"deadlock","agent":"security","duration":4500}'
    )
    
    echo "→ Injecting failure patterns..."
    for failure in "${FAILURES[@]}"; do
        dagger call learn-from-experience --experience "$failure"
    done
    
    # Analyze patterns
    echo "→ System analyzing failure patterns..."
    dagger call analyze-collective-patterns
    
    # Generate insights
    echo "→ Generating collective insights..."
    dagger call generate-collective-insights
    
    # Check if system adapts strategy
    echo "→ Testing adapted strategies..."
    dagger call execute-with-collective-intelligence \
        --task "api_integration" \
        --use-learned-patterns true
}

# Test 4: Evolution and Fitness-Based Selection
test_evolution_system() {
    echo ""
    echo "🧬 Test 4: Evolution System with Fitness-Based Agent Selection"
    echo "---------------------------------------------------------------"
    echo "Scenario: System evolves better strategies through generational improvement"
    
    # Run 5 generations of evolution
    for gen in {1..5}; do
        echo "→ Generation $gen starting..."
        
        # Execute tasks with current generation
        dagger call execute-generation \
            --task "Build a REST API with authentication" \
            --population-size 8
        
        # Evaluate fitness
        dagger call evaluate-generation-fitness
        
        # Trigger evolution
        dagger call trigger-evolution \
            --mutation-rate 0.2 \
            --crossover-rate 0.3 \
            --elitism-count 2
        
        # Show fitness improvement
        dagger call get-fitness-history
    done
    
    # Compare first vs last generation
    echo "→ Evolution complete. Analyzing improvement..."
    dagger call compare-generations --from 1 --to 5
}

# Test 5: Full Software Development Lifecycle
test_full_lifecycle() {
    echo ""
    echo "🚀 Test 5: Full Software Development Lifecycle Simulation"
    echo "---------------------------------------------------------"
    echo "Scenario: Build complete microservice from scratch"
    
    PROJECT="user-management-service"
    
    # Phase 1: Planning
    echo "→ Phase 1: Planning and Architecture..."
    dagger call create-agent-team \
        --project "$PROJECT" \
        --agents '["architect","code","test","security","docs"]'
    
    dagger call execute-planning-phase \
        --requirements "User CRUD API with JWT auth, PostgreSQL, rate limiting"
    
    # Phase 2: Implementation
    echo "→ Phase 2: Implementation..."
    dagger call execute-implementation-phase \
        --parallel-agents 3 \
        --components '["models","controllers","middleware","auth","database"]'
    
    # Phase 3: Testing
    echo "→ Phase 3: Comprehensive Testing..."
    dagger call execute-testing-phase \
        --test-types '["unit","integration","security","performance"]'
    
    # Phase 4: Review and Optimization
    echo "→ Phase 4: Review and Optimization..."
    dagger call execute-review-phase \
        --review-aspects '["code-quality","security","performance","documentation"]'
    
    # Phase 5: Learning and Evolution
    echo "→ Phase 5: System Learning..."
    dagger call capture-project-learning --project "$PROJECT"
    
    # Final metrics
    echo "→ Final Project Metrics..."
    dagger call get-project-metrics --project "$PROJECT"
}

# Test 6: Chaos Engineering - System Resilience
test_chaos_engineering() {
    echo ""
    echo "💥 Test 6: Chaos Engineering - System Resilience"
    echo "------------------------------------------------"
    echo "Scenario: Test system behavior under adverse conditions"
    
    # Start normal workflow
    echo "→ Starting normal workflow..."
    dagger call execute-agents-parallel \
        --task "Build payment processing system" &
    WORKFLOW_PID=$!
    
    sleep 5
    
    # Inject chaos
    echo "→ Injecting chaos events..."
    
    # Agent failure
    echo "  • Simulating agent failure..."
    dagger call simulate-agent-failure --agent-id "agent-2"
    
    # Network partition
    echo "  • Simulating network partition..."
    dagger call simulate-network-partition --duration 10
    
    # Resource exhaustion
    echo "  • Simulating resource exhaustion..."
    dagger call simulate-resource-exhaustion --resource "memory" --severity "high"
    
    # Check recovery
    echo "→ Monitoring system recovery..."
    dagger call monitor-system-recovery
    
    wait $WORKFLOW_PID
    
    # Analyze resilience
    echo "→ Analyzing system resilience..."
    dagger call analyze-resilience-metrics
}

# Test 7: Performance Benchmarking
test_performance_benchmark() {
    echo ""
    echo "⚡ Test 7: Performance Benchmarking"
    echo "-----------------------------------"
    echo "Scenario: Measure system performance under various loads"
    
    LOADS=(1 5 10 20 50)
    
    for load in "${LOADS[@]}"; do
        echo "→ Testing with $load concurrent agents..."
        
        START_TIME=$(date +%s)
        
        # Run concurrent workloads
        for i in $(seq 1 $load); do
            dagger call execute-agent \
                --agent-id "perf-agent-$i" \
                --task "Process data batch $i" &
        done
        wait
        
        END_TIME=$(date +%s)
        DURATION=$((END_TIME - START_TIME))
        
        echo "  Completed in ${DURATION}s"
        
        # Collect metrics
        dagger call collect-performance-metrics \
            --load $load \
            --duration $DURATION
    done
    
    # Generate performance report
    echo "→ Generating performance report..."
    dagger call generate-performance-report
}

# Test 8: Knowledge Transfer and Retention
test_knowledge_transfer() {
    echo ""
    echo "📚 Test 8: Knowledge Transfer and Retention"
    echo "-------------------------------------------"
    echo "Scenario: Test if agents can transfer and retain knowledge"
    
    # Train agent on specific domain
    echo "→ Training specialist agent..."
    dagger call train-agent \
        --agent-id "specialist" \
        --domain "GraphQL API design" \
        --training-data "advanced"
    
    # Transfer knowledge to new agents
    echo "→ Transferring knowledge to team..."
    dagger call transfer-knowledge \
        --from "specialist" \
        --to '["learner-1","learner-2","learner-3"]'
    
    # Test knowledge retention
    echo "→ Testing knowledge retention..."
    dagger call test-agent-knowledge \
        --agents '["learner-1","learner-2","learner-3"]' \
        --domain "GraphQL API design"
    
    # Verify collective intelligence improved
    echo "→ Measuring collective intelligence gain..."
    dagger call measure-collective-intelligence
}

# Main test runner
main() {
    echo "Starting comprehensive test suite..."
    echo "This will take approximately 10-15 minutes"
    echo ""
    
    # Run all tests
    test_code_review_pipeline
    test_a2a_communication
    test_learning_from_failures
    test_evolution_system
    test_full_lifecycle
    test_chaos_engineering
    test_performance_benchmark
    test_knowledge_transfer
    
    echo ""
    echo "======================================"
    echo "✅ All tests completed!"
    echo ""
    echo "📊 Final System Report:"
    dagger call generate-system-report
    
    echo ""
    echo "📈 Collective Intelligence Metrics:"
    dagger call get-collective-intelligence-status
    
    echo ""
    echo "🧬 Evolution Summary:"
    dagger call get-evolution-summary
}

# Run tests
main "$@"