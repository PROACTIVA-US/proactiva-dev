import { execSync } from 'child_process';

async function validateRefactoring() {
  console.log("🔍 Starting refactoring validation...\n");
  
  // Core functions to test - based on our current functions
  const coreFunctions = [
    { name: 'test-connection', description: 'Sprint 1: Basic connectivity' },
    { name: 'create-agent', description: 'Sprint 2: Agent creation' },
    { name: 'create-code-agent', description: 'Sprint 3: Specialized agents' },
    { name: 'create-performance-agent', description: 'Sprint 4: Enhanced agents' },
    { name: 'execute-parallel-workflow', description: 'Sprint 5: Orchestration' },
    { name: 'initialize-a-2-amesh', description: 'Sprint 7: A2A Communication' },
    { name: 'initialize-collective-learning', description: 'Sprint 9: Collective Learning' },
    { name: 'initialize-evolutionary-intelligence', description: 'Sprint 10: Evolution' },
    { name: 'start-web-management-interface', description: 'Sprint 11: Web Interface' }
  ];
  
  const results = [];
  let allPassed = true;
  
  // Test function availability first
  console.log("📋 Checking function availability...");
  try {
    const output = execSync('dagger functions', { encoding: 'utf8' });
    const functionCount = output.split('\n').filter(line => line.trim() && !line.includes('Name')).length;
    console.log(`✅ Functions available: ${functionCount} (expected: 65+)`);
    
    if (functionCount < 65) {
      console.log(`❌ Function count decreased! Expected 65+, got ${functionCount}`);
      allPassed = false;
    }
  } catch (error: any) {
    console.log(`❌ Failed to list functions: ${error.message}`);
    allPassed = false;
  }
  
  // Test core functions
  console.log("\n🧪 Testing core functions...");
  for (const test of coreFunctions) {
    process.stdout.write(`Testing ${test.description}... `);
    
    try {
      const startTime = Date.now();
      
      // Test function help (this validates the function exists and is properly registered)
      execSync(`dagger call ${test.name} --help`, { encoding: 'utf8', stdio: 'pipe' });
      
      const duration = Date.now() - startTime;
      console.log(`✅ PASSED (${duration}ms)`);
      results.push({ ...test, status: 'passed', duration });
    } catch (error: any) {
      console.log(`❌ FAILED`);
      console.error(`  Error: ${error.message}`);
      results.push({ ...test, status: 'failed', error: error.message });
      allPassed = false;
    }
  }
  
  // Test web interface (just function existence, not full build)
  console.log("\n🌐 Testing web interface availability...");
  try {
    process.stdout.write("Checking web interface function... ");
    const startTime = Date.now();
    execSync('dagger call start-web-management-interface --help', { 
      encoding: 'utf8', 
      stdio: 'pipe'
    });
    const duration = Date.now() - startTime;
    console.log(`✅ PASSED (${duration}ms)`);
  } catch (error: any) {
    console.log(`❌ FAILED: ${error.message}`);
    allPassed = false;
  }
  
  // Print summary
  console.log("\n📊 Validation Summary:");
  console.log("─".repeat(50));
  
  const passed = results.filter(r => r.status === 'passed').length;
  const failed = results.filter(r => r.status === 'failed').length;
  
  console.log(`Total Tests: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (!allPassed) {
    console.log("\n⚠️  Some tests failed! Do not proceed with refactoring.");
    process.exit(1);
  } else {
    console.log("\n🎉 All tests passed! Safe to proceed with refactoring.");
  }
}

// Run validation
validateRefactoring().catch((error) => {
  console.error("Validation failed:", error);
  process.exit(1);
});