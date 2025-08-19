# Sprint 6: First Refactoring Window

## 🛑 CRITICAL: Before You Start

### Pre-Refactor Checklist
```bash
# 1. Ensure ALL tests pass
./test-sprint-5.sh
# Must see: "Sprint 5: ALL TESTS PASSED ✓"

# 2. Count working functions
dagger functions | wc -l
# Should be ~35 functions

# 3. Create safety checkpoint
git add -A
git commit -m "Pre-refactor: 35 functions working"
git tag pre-refactor-checkpoint

# 4. Create refactor branch
git checkout -b refactor/sprint-6-consolidation

# 5. Document current state
dagger functions > functions-before-refactor.txt
```

## Refactoring Rules

### ✅ SAFE to Refactor

1. **Extract Common Container Setup**
```typescript
// BEFORE (repeated 20+ times):
dag.container()
  .from("python:3.11-slim")
  .withExec(["pip", "install", "..."])

// AFTER (safe extraction):
private createPythonContainer(packages: string[]): Container {
  return dag.container()
    .from("python:3.11-slim")
    .withExec(["pip", "install", ...packages])
}
```

2. **Consolidate Agent Scripts**
```typescript
// BEFORE: Scripts as string constants
export const CODE_AGENT_SCRIPT = `...`
export const TEST_AGENT_SCRIPT = `...`

// AFTER: Script loader
private getAgentScript(agentType: string): string {
  const scripts = {
    "code": CODE_AGENT_SCRIPT,
    "test": TEST_AGENT_SCRIPT,
    // etc
  }
  return scripts[agentType]
}
```

3. **Standardize JSON Task Creation**
```typescript
// BEFORE (repeated pattern):
const task = {
  action: "something",
  data: someData
}
JSON.stringify(task)

// AFTER:
private createTask(action: string, data: any): string {
  return JSON.stringify({ action, ...data })
}
```

### ❌ DO NOT Refactor

1. **Function Signatures** - Keep all @func() methods exactly the same
2. **Return Types** - Don't change Container to something else
3. **Module Structure** - Keep flat /src/index.ts
4. **Import Patterns** - Don't get clever with imports

## Safe Refactoring Process

### Step 1: Extract Helper Methods (NO function signature changes)
```typescript
@object()
export class ProactivaDev {
  // All existing @func() methods stay EXACTLY the same
  
  // Add private helpers at the bottom
  private createPythonContainer(packages: string[]): Container {
    return dag.container()
      .from("python:3.11-slim")
      .withExec(["pip", "install", ...packages])
  }
  
  private mountAgentCache(container: Container, agentId: string): Container {
    const cache = dag.cacheVolume(`agent-${agentId}-memory`)
    return container.withMountedCache("/memory", cache)
  }
  
  private createAgentEnvironment(
    container: Container, 
    agentId: string, 
    agentType: string
  ): Container {
    return container
      .withEnvVariable("AGENT_ID", agentId)
      .withEnvVariable("AGENT_TYPE", agentType)
  }
}
```

### Step 2: Test After EACH Extraction
```bash
# After adding EACH helper:
dagger develop
dagger functions | wc -l  # Must still be 35
./test-sprint-5.sh  # Must still pass

# If anything breaks:
git reset --hard HEAD
```

### Step 3: Update Functions to Use Helpers (ONE AT A TIME)
```typescript
@func()
async createCodeAgent(name: string = "code-agent"): Promise<Container> {
  const agentId = `code-${Date.now()}`
  
  // Use new helpers
  let container = this.createPythonContainer(["black", "pylint", "mypy"])
  container = this.mountAgentCache(container, agentId)
  container = this.createAgentEnvironment(container, agentId, "code")
  
  return container
    .withNewFile("/agent.py", CODE_AGENT_SCRIPT)
    .withExec(["python", "-c", "print('CodeAgent initialized')"])
}
```

### Step 4: Group Related Constants
```typescript
// Top of file, after imports
const AGENT_TYPES = {
  CODE: "code",
  TEST: "test",
  SECURITY: "security",
  PERFORMANCE: "performance",
  REVIEW: "review"
} as const

const PYTHON_IMAGE = "python:3.11-slim"
const ALPINE_IMAGE = "alpine:latest"

// But DON'T change existing functions that use strings directly
// Only use these in NEW code or careful refactors
```

## What Success Looks Like

### Before Refactor
- 35 functions working
- ~2000 lines of code
- Lots of duplication
- All tests passing

### After Refactor
- 35 functions STILL working
- ~1200 lines of code (40% reduction)
- Clean helper methods
- ALL TESTS STILL PASSING

## Testing During Refactor

### Continuous Testing Script
```bash
#!/bin/bash
# save as: test-during-refactor.sh

while true; do
  clear
  echo "Testing refactor changes..."
  
  # Check functions still visible
  FUNC_COUNT=$(dagger functions | wc -l)
  echo "Functions visible: $FUNC_COUNT (should be 35)"
  
  if [ "$FUNC_COUNT" -lt "35" ]; then
    echo "❌ FUNCTIONS MISSING! STOP REFACTORING!"
    exit 1
  fi
  
  # Run quick test
  if dagger call test-connection | grep -q "Success"; then
    echo "✓ Basic connection works"
  else
    echo "❌ Basic test failed!"
    exit 1
  fi
  
  echo "✓ All good, continue refactoring"
  sleep 5
done
```

## Common Refactoring Pitfalls

### Pitfall 1: Over-abstracting
```typescript
// ❌ TOO ABSTRACT
private createAgent<T extends AgentType>(
  type: T, 
  config: AgentConfig<T>
): Promise<Container>

// ✅ SIMPLE
private createBasicAgent(
  type: string,
  packages: string[]
): Container
```

### Pitfall 2: Changing Too Much at Once
```typescript
// ❌ WRONG: Refactor everything in one commit
// ✅ RIGHT: One extraction, test, commit, repeat
```

### Pitfall 3: Breaking Function Discovery
```typescript
// ❌ WRONG: Moving functions to other files
// src/agents/index.ts - Dagger won't find these!

// ✅ RIGHT: Everything stays in /src/index.ts
// Just organize with comments and helpers
```

## Post-Refactor Validation

```bash
# 1. Full test suite
./tests/regression/all-sprints.sh

# 2. Verify function count
test $(dagger functions | wc -l) -eq 35 || echo "MISSING FUNCTIONS!"

# 3. Performance check
time dagger call test-connection
# Should be similar or faster than before

# 4. Create post-refactor checkpoint
git add -A
git commit -m "Refactor complete: 35 functions, 40% less code"
git tag post-refactor-checkpoint

# 5. Merge if successful
git checkout main
git merge refactor/sprint-6-consolidation
```

## If Things Go Wrong

```bash
# Nuclear option - abandon refactor
git checkout main
git branch -D refactor/sprint-6-consolidation
git checkout -b refactor/sprint-6-take-2
# Try again with smaller changes
```

## Next Steps After Refactor

Once refactoring is complete and tested:
1. Proceed to Sprint 7 (A2A Communication)
2. Build on the cleaner codebase
3. Don't refactor again until Sprint 8 checkpoint

Remember: The goal is WORKING code with less duplication, not perfect architecture!