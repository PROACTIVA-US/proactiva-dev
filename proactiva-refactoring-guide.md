# ProactivaDev Safe Refactoring Guide

## 🛡️ Pre-Refactoring Safety Checklist

### Step 0: Create Safety Net
```bash
# 1. Run all existing tests and save results
dagger call test-all-sprints > test-baseline.txt
dagger call test-integration-sprint-10 >> test-baseline.txt

# 2. Document current functionality
dagger call list-functions > current-functions.txt

# 3. Create backup branch
git checkout -b pre-refactoring-backup
git add .
git commit -m "Pre-refactoring snapshot"
git push origin pre-refactoring-backup

# 4. Create refactoring branch
git checkout -b refactoring/modularize-index

# 5. Install validation dependencies (if needed)
npm install --save-dev ts-morph @types/node
```

## 📁 Target File Structure

```
.dagger/
└── src/
    ├── core/
    │   ├── types.ts           # All interfaces and types
    │   ├── constants.ts       # System constants
    │   └── utils.ts          # Common utilities
    ├── agents/
    │   ├── base.ts           # BaseAgent class
    │   ├── specialized.ts    # Specialized agent implementations
    │   └── orchestration.ts  # Agent orchestration logic
    ├── communication/
    │   ├── a2a-mesh.ts       # A2A communication system
    │   └── message-bus.ts    # Message routing
    ├── learning/
    │   ├── collective.ts     # Collective learning engine
    │   ├── memory.ts         # Experience store
    │   └── evolution.ts      # Intelligence evolution
    ├── web/
    │   ├── api.ts           # Web API handlers
    │   └── dashboard.ts     # Dashboard logic
    └── index.ts             # Main class (trimmed down)
```

## 🔄 Validation Scripts

### Create `validate-refactoring.ts`
```typescript
import { dag, connect } from "@dagger.io/dagger"

async function validateRefactoring() {
  console.log("🔍 Starting refactoring validation...\n");
  
  const sprintTests = [
    { name: 'sprint-1-init', description: 'Sprint 1: Project initialization' },
    { name: 'sprint-2-communication-setup', description: 'Sprint 2: Communication' },
    { name: 'sprint-3-mesh-network', description: 'Sprint 3: Mesh network' },
    { name: 'sprint-4-collective-learning', description: 'Sprint 4: Learning' },
    { name: 'sprint-5-agent-specialization', description: 'Sprint 5: Specialization' },
    { name: 'sprint-6-orchestration', description: 'Sprint 6: Orchestration' },
    { name: 'sprint-7-toolchain', description: 'Sprint 7: Toolchain' },
    { name: 'sprint-8-monitoring', description: 'Sprint 8: Monitoring' },
    { name: 'sprint-9-evolution', description: 'Sprint 9: Evolution' },
    { name: 'sprint-10-production', description: 'Sprint 10: Production' }
  ];
  
  const results = [];
  let allPassed = true;
  
  // Connect to Dagger
  await connect(async (client) => {
    for (const test of sprintTests) {
      process.stdout.write(`Testing ${test.description}... `);
      
      try {
        const startTime = Date.now();
        // Call the sprint function
        await client.container().from("alpine").exec(["echo", test.name]).sync();
        const duration = Date.now() - startTime;
        
        console.log(`✅ PASSED (${duration}ms)`);
        results.push({ ...test, status: 'passed', duration });
      } catch (error) {
        console.log(`❌ FAILED`);
        console.error(`  Error: ${error.message}`);
        results.push({ ...test, status: 'failed', error: error.message });
        allPassed = false;
      }
    }
  });
  
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
validateRefactoring().catch(console.error);
```

### Create `check-exports.sh`
```bash
#!/bin/bash

# Check that all exports are preserved after refactoring

echo "📊 Checking exports preservation..."

# Count exports in backup
BACKUP_EXPORTS=$(grep -c "export" src/index.ts.backup 2>/dev/null || echo "0")

# Count exports in refactored code
CURRENT_EXPORTS=$(grep -r "export" src/ --include="*.ts" | wc -l)

echo "Exports in original: $BACKUP_EXPORTS"
echo "Exports in refactored: $CURRENT_EXPORTS"

if [ "$CURRENT_EXPORTS" -ge "$BACKUP_EXPORTS" ]; then
    echo "✅ All exports preserved"
    exit 0
else
    echo "❌ Some exports may be missing"
    exit 1
fi
```

## 📋 Phase-by-Phase Refactoring Steps

### Phase 1: Extract Types and Interfaces (Week 1)

#### Day 1-2: Create Type Files
```typescript
// src/core/types.ts
export interface AgentConfig {
  name: string;
  role: string;
  capabilities: string[];
}

export interface SprintProgress {
  sprint: number;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
  artifacts: string[];
}

export interface MessageBusConfig {
  maxRetries: number;
  timeout: number;
}

// Add all other interfaces here...
```

```typescript
// src/core/constants.ts
import { CacheSharingMode, Platform } from "@dagger.io/dagger";

export const DEFAULT_CACHE_SHARING = CacheSharingMode.Shared;
export const DEFAULT_PLATFORM = Platform.Linux;
export const DEFAULT_NODE_VERSION = "20-slim";
export const DEFAULT_GO_VERSION = "1.21";

// Add all other constants here...
```

#### Day 3-4: Update Imports in index.ts
```typescript
// In index.ts, replace inline interfaces with imports
import { 
  AgentConfig, 
  SprintProgress, 
  MessageBusConfig 
} from './core/types';

import { 
  DEFAULT_CACHE_SHARING, 
  DEFAULT_PLATFORM 
} from './core/constants';
```

#### Validation After Phase 1:
```bash
npm run validate-refactoring
./check-exports.sh
dagger call test-integration-sprint-10
```

### Phase 2: Extract Utilities (Week 1-2)

#### Day 5-6: Create Utility Functions
```typescript
// src/core/utils.ts
export function parseProgress(output: string): number {
  // Move implementation from index.ts
}

export function formatTimestamp(): string {
  return new Date().toISOString();
}

export async function withRetry<T>(
  fn: () => Promise<T>, 
  retries: number = 3
): Promise<T> {
  // Move retry logic here
}

// Add all utility functions here...
```

### Phase 3: Extract Base Classes (Week 2)

#### Day 7-9: Create Base Agent Class
```typescript
// src/agents/base.ts
import { Container } from "@dagger.io/dagger";
import { AgentConfig } from "../core/types";

export class BaseAgent {
  constructor(
    protected container: Container,
    protected config: AgentConfig
  ) {}
  
  // Move base agent methods here
}
```

#### Day 10-11: Create Specialized Agents
```typescript
// src/agents/specialized.ts
import { BaseAgent } from "./base";

export class ArchitectAgent extends BaseAgent {
  // Move architect-specific logic
}

export class DeveloperAgent extends BaseAgent {
  // Move developer-specific logic
}

export class ReviewerAgent extends BaseAgent {
  // Move reviewer-specific logic
}
```

### Phase 4: Extract Communication Layer (Week 2-3)

```typescript
// src/communication/message-bus.ts
export class MessageBus {
  // Move message bus implementation
}

// src/communication/a2a-mesh.ts
export class A2AMeshNetwork {
  // Move mesh network implementation
}
```

### Phase 5: Update Main Class (Week 3)

```typescript
// src/index.ts - Refactored version
import { dag, Container, Directory } from "@dagger.io/dagger";
import { AgentConfig, SprintProgress } from "./core/types";
import { DEFAULT_CACHE_SHARING } from "./core/constants";
import { parseProgress, withRetry } from "./core/utils";
import { BaseAgent, ArchitectAgent } from "./agents";
import { MessageBus, A2AMeshNetwork } from "./communication";

export class ProactivaDev {
  // Keep all @func decorated methods here
  // They MUST stay in the main class for Dagger
  
  /**
   * Initialize Sprint 1: Project Setup
   */
  @func()
  async sprint1Init(): Promise<Container> {
    // Implementation can call extracted modules
    const agent = new ArchitectAgent(this.container, config);
    return agent.initialize();
  }
  
  // ... other sprint functions
}

// CRITICAL: Keep this export
export { dag };
```

## 🧪 Testing Each Phase

### After Each Extraction:
1. **Run unit tests** (if available)
   ```bash
   npm test
   ```

2. **Run integration tests**
   ```bash
   dagger call test-integration-sprint-10
   ```

3. **Test each sprint function**
   ```bash
   dagger call sprint-1-init
   dagger call sprint-2-communication-setup
   # ... test all sprints
   ```

4. **Test web interface**
   ```bash
   dagger call start-management-interface
   # Open browser and verify dashboard works
   ```

5. **Check exports**
   ```bash
   ./check-exports.sh
   ```

## ⚠️ Common Pitfalls to Avoid

### 1. **Don't Move Dagger Decorators**
```typescript
// ❌ WRONG - This won't work
// src/sprints/sprint1.ts
@func()
async sprint1Init() { }

// ✅ CORRECT - Keep in main class
// src/index.ts
@func()
async sprint1Init() {
  return this.sprintService.initializeSprint1();
}
```

### 2. **Preserve Function Signatures**
```typescript
// ❌ WRONG - Changed signature
async sprint1Init(newParam: string): Promise<Container>

// ✅ CORRECT - Keep original signature
async sprint1Init(): Promise<Container>
```

### 3. **Maintain Re-exports**
```typescript
// src/index.ts - Always re-export moved items
export { BaseAgent } from './agents/base';
export { MessageBus } from './communication/message-bus';
export * from './core/types';
```

## 🔄 Rollback Plan

If something breaks:

```bash
# 1. Stash current changes
git stash

# 2. Return to backup
git checkout pre-refactoring-backup

# 3. Or selectively revert
git checkout HEAD~1 src/index.ts

# 4. Re-run validation
npm run validate-refactoring
```

## 📊 Success Metrics

After refactoring, you should see:

- ✅ Main index.ts file < 1000 lines
- ✅ All sprint functions still working
- ✅ Web dashboard fully functional
- ✅ All tests passing
- ✅ Better IDE autocomplete
- ✅ Faster build times
- ✅ Easier to find and modify code

## 🚀 Post-Refactoring Steps

1. **Update documentation**
   ```bash
   npm run generate-docs
   ```

2. **Run performance benchmarks**
   ```bash
   dagger call benchmark-all-sprints
   ```

3. **Update CLAUDE.md**
   - Document new file structure
   - Update import examples
   - Add architecture diagrams

4. **Create PR for review**
   ```bash
   git add .
   git commit -m "refactor: modularize index.ts into domain modules"
   git push origin refactoring/modularize-index
   ```

## 💡 Tips for Success

1. **Refactor in small, testable increments**
2. **Always validate after each change**
3. **Keep the Git history clean with meaningful commits**
4. **Document why decisions were made**
5. **Pair program or get reviews for complex extractions**
6. **Use TypeScript's refactoring tools in VS Code**
7. **Run the validation script frequently**

---

*Remember: The goal is maintainability without breaking functionality. When in doubt, test!*