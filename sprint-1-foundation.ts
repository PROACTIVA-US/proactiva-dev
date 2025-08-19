/**
 * SPRINT 1: Foundation - Single Working Function
 * Goal: Create the simplest possible working Dagger module
 * Duration: 3 days
 * Success Metric: ONE function that reliably works
 */

// File: /src/index.ts
// DO NOT CREATE NESTED DIRECTORIES!

import {
  object,
  func,
  Container,
  Directory,
  CacheVolume,
  dag
} from "@dagger.io/dagger"

/**
 * ProactivaDev - Enterprise Agentic Development Platform
 * 
 * CRITICAL: This class name MUST match the name in dagger.json
 * If dagger.json has "name": "proactiva-dev", class MUST be ProactivaDev
 */
@object()
export class ProactivaDev {
  /**
   * Sprint 1, Function 1: Test the module works at all
   * This is our canary - if this breaks, nothing works
   */
  @func()
  async testConnection(): Promise<string> {
    return "ProactivaDev v2.0 - Module Connected Successfully"
  }

  /**
   * Sprint 1, Function 2: Execute a simple container
   * Proves we can create and run containers
   */
  @func()
  async executeContainer(
    command: string = "echo 'Hello from ProactivaDev'"
  ): Promise<Container> {
    return dag
      .container()
      .from("alpine:latest")
      .withExec(["sh", "-c", command])
  }

  /**
   * Sprint 1, Function 3: Basic state management
   * Proves we can persist data between runs
   */
  @func()
  async saveState(
    key: string,
    value: string
  ): Promise<Container> {
    const cache = dag.cacheVolume("proactiva-state")
    
    return dag
      .container()
      .from("alpine:latest")
      .withMountedCache("/state", cache)
      .withExec(["sh", "-c", `echo '${value}' > /state/${key}.txt`])
      .withExec(["cat", `/state/${key}.txt`]) // Verify it saved
  }

  /**
   * Sprint 1, Function 4: Load state
   * Proves state persists across function calls
   */
  @func()
  async loadState(
    key: string
  ): Promise<Container> {
    const cache = dag.cacheVolume("proactiva-state")
    
    return dag
      .container()
      .from("alpine:latest")
      .withMountedCache("/state", cache)
      .withExec(["cat", `/state/${key}.txt`])
  }

  /**
   * Sprint 1, Function 5: Execute with tools
   * Proves we can install and use tools in containers
   */
  @func()
  async executeWithTools(
    script: string
  ): Promise<Container> {
    return dag
      .container()
      .from("python:3.11-slim")
      .withExec(["pip", "install", "requests", "pandas"])
      .withExec(["python", "-c", script])
  }

  /**
   * Sprint 1, Function 6: Basic observability
   * Proves we can capture structured logs
   */
  @func()
  async executeWithLogging(
    task: string
  ): Promise<Container> {
    const timestamp = new Date().toISOString()
    const logEntry = JSON.stringify({
      timestamp,
      level: "info",
      task,
      sprint: 1,
      function: "executeWithLogging"
    })
    
    return dag
      .container()
      .from("alpine:latest")
      .withExec(["sh", "-c", `echo '${logEntry}' >> /tmp/logs.json`])
      .withExec(["sh", "-c", task])
      .withExec(["cat", "/tmp/logs.json"]) // Show logs
  }
}

// File: /dagger.json
/*
{
  "name": "proactiva-dev",
  "engineVersion": "v0.15.1"
}
*/

// File: /package.json
/*
{
  "name": "proactiva-dev",
  "version": "2.0.0",
  "type": "module",
  "main": "./src/index.ts",
  "scripts": {
    "test": "dagger functions",
    "dev": "dagger develop"
  },
  "devDependencies": {
    "@dagger.io/dagger": "^0.15.1",
    "typescript": "^5.0.0"
  }
}
*/

// File: /tsconfig.json
/*
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "sdk"]
}
*/

// File: /.gitignore
/*
node_modules/
sdk/
.dagger/
*.log
.env
*/

// File: /test-sprint-1.sh
/*
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
dagger call execute-container --command="echo test" | grep -q "test" || exit 1
echo "✓ Container execution works"

echo "Test 4: State persistence"
dagger call save-state --key="test" --value="sprint1" > /dev/null
dagger call load-state --key="test" | grep -q "sprint1" || exit 1
echo "✓ State persistence works"

echo "Test 5: Tool installation"
dagger call execute-with-tools --script="import requests; print('tools work')" | grep -q "tools work" || exit 1
echo "✓ Tool installation works"

echo "Test 6: Logging"
dagger call execute-with-logging --task="echo logged" | grep -q "timestamp" || exit 1
echo "✓ Logging works"

echo ""
echo "Sprint 1: ALL TESTS PASSED ✓"
echo "=========================="
*/

// File: /SPRINT-1-CHECKLIST.md
/*
# Sprint 1 Checklist

## Pre-Development
- [ ] Remove ALL previous code
- [ ] Start with fresh `dagger init --sdk=typescript`
- [ ] Verify directory structure is flat (/src/index.ts)
- [ ] Ensure class name matches module name

## Development (ONE FUNCTION AT A TIME)
- [ ] Implement testConnection()
  - [ ] Run `dagger develop`
  - [ ] Run `dagger functions` - verify it appears
  - [ ] Run `dagger call test-connection`
  - [ ] Git commit
  
- [ ] Implement executeContainer()
  - [ ] Run `dagger develop`
  - [ ] Run `dagger functions` - verify it appears
  - [ ] Run `dagger call execute-container --command="echo test"`
  - [ ] Git commit

- [ ] Implement saveState()
  - [ ] Run `dagger develop`
  - [ ] Run `dagger functions` - verify it appears
  - [ ] Run `dagger call save-state --key="test" --value="data"`
  - [ ] Git commit

- [ ] Implement loadState()
  - [ ] Run `dagger develop`
  - [ ] Run `dagger functions` - verify it appears
  - [ ] Run `dagger call load-state --key="test"`
  - [ ] Git commit

- [ ] Implement executeWithTools()
  - [ ] Run `dagger develop`
  - [ ] Run `dagger functions` - verify it appears
  - [ ] Run `dagger call execute-with-tools --script="print('hi')"`
  - [ ] Git commit

- [ ] Implement executeWithLogging()
  - [ ] Run `dagger develop`
  - [ ] Run `dagger functions` - verify it appears
  - [ ] Run `dagger call execute-with-logging --task="echo test"`
  - [ ] Git commit

## Post-Development
- [ ] Run full test suite: `./test-sprint-1.sh`
- [ ] Tag release: `git tag sprint-1-complete`
- [ ] Document any issues in NOTES.md
- [ ] Backup working state

## Success Criteria
- All 6 functions appear in `dagger functions`
- All 6 functions execute successfully
- State persists between calls
- No nested directories created
- No modifications to SDK folder
*/