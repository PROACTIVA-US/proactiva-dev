# CLAUDE.md - Context for AI Assistant

## Project Overview
You are helping develop **ProactivaDev v2.0**, an enterprise-grade agentic development platform built as a Dagger module. This system enables AI agents to collaborate, learn from each other, and improve their teamwork over time through collective intelligence.

## Critical Context from Past Failures

### ⚠️ POSTMORTEM LESSONS (MUST READ)
1. **Module/Class name mismatch killed everything** - The class name MUST match dagger.json name EXACTLY
2. **Nested directories broke module discovery** - ONLY use /src/index.ts, never /src/src/
3. **SDK modifications corrupted everything** - NEVER touch the /sdk folder
4. **Lost 26 functions from 28 to 2** - Always test after EVERY single change
5. **52% code "improvement" = 93% functionality loss** - Incremental changes only

## Dagger Module Rules (CRITICAL)

### The Golden Rules
```typescript
// 1. Class name MUST match module name
// If dagger.json says: "name": "proactiva-dev"
@object()
export class ProactivaDev {  // MUST be ProactivaDev (PascalCase of module name)

// 2. Every function needs decorator
@func()
myFunction(): Container {  // MUST return Dagger type

// 3. Flat structure ONLY
// ✅ /src/index.ts
// ❌ /src/src/index.ts
// ❌ /src/modules/agent.ts (imported into index)
```

### Testing Discipline
```bash
# After EVERY function addition:
1. dagger develop
2. dagger functions  # New function MUST appear
3. dagger call <function-name> --help  # MUST work
4. git commit -m "Add working function X"  # Save immediately
```

## Current Development Status

### Completed Sprints
- [ ] Sprint 1: Foundation (6 basic functions)
- [ ] Sprint 2: Basic Agents (LLM integration)
- [ ] Sprint 3: Specialized Agents (5 types)

### Current Sprint Focus
**Sprint 1: Foundation**
- Goal: Get ONE working function before adding more
- Success Metric: All 6 functions appear in `dagger functions`

## Dagger API Reference

### Core Types You Can Use
```typescript
import {
  Container,      // Docker container
  Directory,      // File directory
  CacheVolume,    // Persistent cache
  Service,        // Long-running service
  Secret,         // Secret value
  File,           // Single file
  dag            // Dagger client
} from "@dagger.io/dagger"
```

### Common Dagger Patterns
```typescript
// Create container
dag.container()
  .from("python:3.11-slim")
  .withExec(["pip", "install", "openai"])

// Mount cache volume
const cache = dag.cacheVolume("my-cache")
container.withMountedCache("/cache", cache)

// Use secrets
container.withSecretVariable("API_KEY", secret)

// Chain operations
container
  .withExec(["cmd1"])
  .withExec(["cmd2"])
  .withExec(["cmd3"])
```

### What Works in Dagger
- ✅ Returning Container, Directory, Service
- ✅ Simple string/number parameters
- ✅ Optional parameters with defaults
- ✅ Async functions
- ✅ Cache volumes for persistence

### What Doesn't Work in Dagger
- ❌ Complex object parameters (use JSON strings)
- ❌ Returning custom classes
- ❌ Modifying the SDK folder
- ❌ Nested source directories
- ❌ Class name != module name

## Architecture Decisions

### Why Collective Intelligence?
The system is designed to enable:
1. **A2A Communication**: Agents talk directly without orchestrator bottleneck
2. **Trust Networks**: Agents learn who to work with
3. **Pattern Recognition**: System identifies successful collaboration patterns
4. **Strategy Evolution**: Approaches improve over time

### Telemetry-First Design
Every action captures:
```typescript
{
  timestamp: string,
  agentId: string,
  decision: {
    options: string[],
    selected: string,
    confidence: number,
    reasoning: string
  },
  outcome: {
    success: boolean,
    quality: number
  }
}
```

## Common Issues & Solutions

### Issue: "Function not found"
```bash
# Check 1: Is function decorated?
@func()  # MUST have this

# Check 2: Does it return Dagger type?
: Promise<Container>  # Not : Promise<string>

# Check 3: Did you run dagger develop?
dagger develop  # After EVERY change
```

### Issue: "Module not loading"
```bash
# Check 1: Class name matches?
cat dagger.json | grep name  # "proactiva-dev"
grep "export class" src/index.ts  # ProactivaDev

# Check 2: Flat structure?
ls src/  # Should only show index.ts

# Check 3: Clean restart
./scripts/clean-environment.sh
dagger develop
```

## Code Review Checklist

When reviewing code, ensure:
- [ ] Class name matches dagger.json name
- [ ] All functions have @func() decorator
- [ ] All functions return Dagger types
- [ ] No nested directories created
- [ ] Each function tested individually
- [ ] Changes are incremental (one function at a time)
- [ ] Git commits after each working function

## Sprint Implementation Guide

### Sprint 1 Goals (Current)
1. testConnection() - Verify module loads
2. executeContainer() - Run basic container
3. saveState() - Persist data
4. loadState() - Retrieve data
5. executeWithTools() - Install/use tools
6. executeWithLogging() - Structured logs

### Sprint 2 Goals (Next)
1. createAgent() - Basic agent creation
2. executeAgent() - Run agent with task
3. executeAgentPipeline() - Sequential agents
4. executeAgentWithTools() - Agent + tools
5. updateAgentMemory() - Persistent memory
6. getAgentMetrics() - Performance tracking

## Testing Requirements

### Every Function Must Be Tested
```bash
# Individual function test
dagger call function-name --param="value"

# Sprint test suite
./tests/integration/sprint-N.sh

# Regression test (all previous sprints)
./tests/regression/all-sprints.sh
```

### Test Output Verification
```bash
# Must see function in list
dagger functions | grep "function-name"

# Must get help text
dagger call function-name --help

# Must execute successfully
dagger call function-name | grep "expected output"
```

## Communication Guidelines

### When Suggesting Code
1. **ALWAYS** maintain flat structure
2. **NEVER** create nested directories
3. **ENSURE** class name matches module name
4. **ADD** one function at a time
5. **INCLUDE** test commands after each function

### When Debugging
1. First check: Are functions visible? `dagger functions`
2. Second check: Class name match? Module name match?
3. Third check: Flat structure maintained?
4. Fourth check: Clean and restart needed?

## Emergency Commands

```bash
# When everything breaks
docker stop $(docker ps -q --filter name=dagger-engine)
docker rm $(docker ps -aq --filter name=dagger-engine)
rm -rf .dagger sdk dagger.lock
dagger develop

# Return to last working state
git checkout main
./scripts/clean-environment.sh
dagger develop
```

## Success Metrics

### Sprint 1 Success
- [ ] All 6 functions visible in `dagger functions`
- [ ] All 6 functions execute without error
- [ ] State persists between function calls
- [ ] No nested directories created
- [ ] Git history shows incremental commits

### Overall Success
- [ ] 28+ functions working (not 2!)
- [ ] Agents can execute tasks
- [ ] Agents can communicate (A2A)
- [ ] System learns from interactions
- [ ] Performance improves over time

## Remember

**The path to success:**
1. Start with ONE working function
2. Test it completely
3. Commit it immediately
4. Add next function
5. Repeat

**Never:**
- Refactor everything at once
- Create nested directories  
- Modify SDK folder
- Change class/module names without testing
- Add multiple functions without testing

## Your Role

You are the **technical advisor** who:
- Prevents the mistakes from the postmortem
- Ensures incremental, tested development
- Maintains flat structure discipline
- Catches class/module name mismatches
- Insists on testing after every change

When in doubt, refer to the postmortem and remember: We lost 26 functions trying to be clever. Simple and working beats elegant and broken.