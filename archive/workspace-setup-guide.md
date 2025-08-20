# ProactivaDev Workspace Setup Guide

## 1. Prerequisites Installation

### 1.1 Core Requirements
```bash
# Check versions - CRITICAL for compatibility
node --version          # Must be v20+
docker --version        # Must be running
```

### 1.2 Install Dagger CLI
```bash
# macOS
brew install dagger/tap/dagger

# Linux/WSL
curl -L https://dl.dagger.io/dagger/install.sh | BIN_DIR=$HOME/.local/bin sh

# Verify installation
dagger version
# Should show: v0.15.1 or higher
```

### 1.3 Verify Docker is Running
```bash
docker ps
# Should not error

# If using Docker Desktop, ensure:
# - Resources: At least 4GB RAM, 2 CPUs allocated
# - File sharing: Your project directory is shared
```

---

## 2. Workspace Structure

### 2.1 Create Project Structure
```bash
# Create main project directory
mkdir -p ~/projects/proactiva-dev
cd ~/projects/proactiva-dev

# Create the EXACT structure needed
mkdir -p {src,tests,docs,scripts,.github/workflows}

# Create documentation structure
mkdir -p docs/{dagger-reference,sprints,decisions,api}

# Create test structure  
mkdir -p tests/{unit,integration,regression}

# Initialize git IMMEDIATELY
git init
git branch -M main

# Create .gitignore
cat > .gitignore << 'EOF'
# Dagger
/sdk/
.dagger/
dagger.lock

# Node
node_modules/
dist/
*.log

# Environment
.env
.env.local

# IDE
.vscode/settings.json
.idea/

# OS
.DS_Store
Thumbs.db

# Test outputs
coverage/
test-results/
EOF
```

### 2.2 Initialize Dagger Module
```bash
# Initialize with TypeScript SDK
dagger init --sdk=typescript

# This creates:
# - dagger.json
# - src/index.ts (starter file)
# - package.json
# - tsconfig.json
```

### 2.3 Critical Configuration Files

#### dagger.json (MUST MATCH CLASS NAME)
```json
{
  "name": "proactiva-dev",
  "engineVersion": "v0.15.1"
}
```

#### package.json
```json
{
  "name": "proactiva-dev",
  "version": "2.0.0",
  "type": "module",
  "main": "./src/index.ts",
  "scripts": {
    "dev": "dagger develop",
    "test": "dagger functions",
    "test:integration": "./scripts/test-current-sprint.sh",
    "clean": "./scripts/clean-environment.sh",
    "verify": "./scripts/verify-functions.sh"
  },
  "devDependencies": {
    "@dagger.io/dagger": "^0.15.1",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

#### tsconfig.json
```json
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
    "emitDecoratorMetadata": true,
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "sdk", "dist", "tests"]
}
```

---

## 3. Development Scripts

### 3.1 Create Verification Script
```bash
cat > scripts/verify-functions.sh << 'EOF'
#!/bin/bash
set -e

echo "🔍 Verifying Dagger Module..."
echo "================================"

# Check if dagger engine is running
if ! docker ps | grep -q dagger-engine; then
    echo "⚠️  Dagger engine not running. Starting..."
    dagger develop
fi

# List all functions
echo ""
echo "📋 Available Functions:"
echo "-----------------------"
dagger functions

# Count functions
FUNC_COUNT=$(dagger functions | grep -c "^\s*[a-z]" || true)
echo ""
echo "✅ Total functions available: $FUNC_COUNT"

# Verify each function is callable
echo ""
echo "🧪 Testing function signatures..."
echo "----------------------------------"
for func in $(dagger functions | grep "^\s*[a-z]" | awk '{print $1}'); do
    echo -n "Testing $func... "
    if dagger call $func --help > /dev/null 2>&1; then
        echo "✅"
    else
        echo "❌ FAILED"
        exit 1
    fi
done

echo ""
echo "🎉 All functions verified successfully!"
EOF

chmod +x scripts/verify-functions.sh
```

### 3.2 Create Clean Environment Script
```bash
cat > scripts/clean-environment.sh << 'EOF'
#!/bin/bash
set -e

echo "🧹 Cleaning Dagger Environment..."
echo "=================================="

# Stop dagger engine
echo "Stopping Dagger engine..."
docker stop $(docker ps -q --filter name=dagger-engine) 2>/dev/null || true

# Remove dagger containers
echo "Removing Dagger containers..."
docker rm $(docker ps -aq --filter name=dagger-engine) 2>/dev/null || true

# Clear caches
echo "Clearing caches..."
rm -rf .dagger sdk dagger.lock

# Clear Docker build cache (optional - uncommment if needed)
# docker builder prune -f

echo ""
echo "✅ Environment cleaned. Run 'dagger develop' to reinitialize."
EOF

chmod +x scripts/clean-environment.sh
```

### 3.3 Create Test Runner
```bash
cat > scripts/test-current-sprint.sh << 'EOF'
#!/bin/bash
set -e

SPRINT=${1:-1}

echo "🧪 Running Sprint $SPRINT Tests"
echo "================================"

if [ -f "tests/integration/sprint-$SPRINT.sh" ]; then
    ./tests/integration/sprint-$SPRINT.sh
else
    echo "❌ No tests found for Sprint $SPRINT"
    exit 1
fi
EOF

chmod +x scripts/test-current-sprint.sh
```

---

## 4. Git Workflow Setup

### 4.1 Create Git Hooks
```bash
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Verify functions before commit
./scripts/verify-functions.sh
EOF

chmod +x .git/hooks/pre-commit
```

### 4.2 Branch Strategy
```bash
# Main branch: always working
git checkout -b main

# Development branches
git checkout -b sprint-1/foundation
# Work on sprint 1
# Test thoroughly
# Merge only when ALL tests pass

git checkout -b sprint-2/agents
# etc.
```

---

## 5. VS Code Setup

### 5.1 Install Extensions
```bash
code --install-extension ms-vscode-remote.remote-containers
code --install-extension ms-azuretools.vscode-docker
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
```

### 5.2 Create VS Code Settings
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "files.exclude": {
    "sdk": true,
    ".dagger": true,
    "dagger.lock": true
  },
  "terminal.integrated.env.linux": {
    "PATH": "${env:PATH}:${workspaceFolder}/scripts"
  }
}
```

### 5.3 Create Launch Configuration
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Dagger Develop",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "dagger",
      "runtimeArgs": ["develop"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal"
    },
    {
      "name": "Test Current Sprint",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "bash",
      "runtimeArgs": ["./scripts/test-current-sprint.sh"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal"
    }
  ]
}
```

---

## 6. Development Workflow

### 6.1 Daily Development Cycle
```bash
# 1. Start fresh
./scripts/clean-environment.sh
dagger develop

# 2. Verify base state
./scripts/verify-functions.sh

# 3. Create feature branch
git checkout -b feature/function-name

# 4. Write ONE function
# Edit src/index.ts

# 5. Test immediately
dagger develop
dagger functions | grep "function-name"
dagger call function-name --help

# 6. Commit if working
git add -A
git commit -m "Add working function: function-name"

# 7. Run integration tests
./scripts/test-current-sprint.sh

# 8. Push and create PR
git push origin feature/function-name
```

### 6.2 Debugging Workflow
```bash
# When things break:

# 1. Check what functions are visible
dagger functions

# 2. Check Docker status
docker ps | grep dagger

# 3. Check for nested directories (COMMON ISSUE!)
find src -name "*.ts" -type f

# 4. Verify class name matches module name
grep "export class" src/index.ts
cat dagger.json | grep name

# 5. Clean and restart
./scripts/clean-environment.sh
dagger develop

# 6. If still broken, rollback
git checkout main
./scripts/clean-environment.sh
dagger develop
```

---

## 7. Testing Strategy

### 7.1 Test Structure
```bash
tests/
├── unit/           # Individual function tests
├── integration/    # Sprint-level tests
│   ├── sprint-1.sh
│   ├── sprint-2.sh
│   └── sprint-3.sh
└── regression/     # Ensure nothing breaks
    └── all-sprints.sh
```

### 7.2 Test After EVERY Change
```bash
# The Golden Rule:
# 1. Make change
# 2. Run: dagger develop
# 3. Run: dagger functions
# 4. Test the specific function
# 5. ONLY then make next change
```

---

## 8. Documentation Structure

### 8.1 Keep Documentation Current
```bash
docs/
├── dagger-reference/
│   ├── common-issues.md
│   ├── api-patterns.md
│   └── troubleshooting.md
├── sprints/
│   ├── sprint-1-completed.md
│   ├── sprint-2-in-progress.md
│   └── sprint-3-planned.md
├── decisions/
│   ├── ADR-001-flat-structure.md
│   └── ADR-002-test-first.md
└── api/
    └── functions.md
```

---

## 9. Common Issues & Solutions

### Issue: Functions not appearing
```bash
# Solution:
1. Check class name matches dagger.json name EXACTLY
2. Ensure @func() decorator is present
3. Clean and restart: ./scripts/clean-environment.sh
```

### Issue: Nested directory error
```bash
# Solution:
1. Ensure src/index.ts is the ONLY source location
2. No src/src/ or other nesting
3. Check tsconfig.json rootDir points to ./src
```

### Issue: SDK errors
```bash
# Solution:
1. NEVER modify anything in sdk/ folder
2. If corrupted: rm -rf sdk && dagger develop
```

### Issue: Cache persistence
```bash
# Solution:
1. Stop engine: docker stop $(docker ps -q --filter name=dagger-engine)
2. Remove: docker rm $(docker ps -aq --filter name=dagger-engine)
3. Clear: rm -rf ~/.dagger
```

---

## 10. Emergency Recovery

### When Everything Is Broken
```bash
# Nuclear option - complete reset
cd ~/projects/proactiva-dev

# 1. Save your work
cp -r src /tmp/backup-src

# 2. Complete cleanup
docker stop $(docker ps -q --filter name=dagger-engine)
docker rm $(docker ps -aq --filter name=dagger-engine)
rm -rf .dagger sdk node_modules dagger.lock package-lock.json

# 3. Reinstall
npm install
dagger develop

# 4. Restore work carefully
# Check each function one at a time

# 5. Verify
./scripts/verify-functions.sh
```

---

## Quick Reference Card

```bash
# Daily Commands
dagger develop              # Initialize/update module
dagger functions           # List all functions
dagger call <func> --help  # Test function exists
./scripts/verify-functions.sh  # Verify all functions

# When Stuck
./scripts/clean-environment.sh  # Reset environment
git checkout main              # Return to known good
docker ps | grep dagger        # Check engine status

# Golden Rules
1. ONE function at a time
2. Test IMMEDIATELY after each change
3. Commit EVERY working state
4. NEVER nest directories
5. NEVER modify sdk/ folder
```