# CLAUDE.md - ProactivaDev v2.0 Development Context

## 🎯 Project Overview

You are maintaining **ProactivaDev v2.0**, a complete enterprise-grade agentic development platform built as a Dagger module. This system enables AI agents to collaborate, learn from each other, and improve their teamwork over time through collective intelligence.

## 🏆 Current Status: PRODUCTION READY

### ✅ Completed Implementation (Sprints 1-11)
The system is **fully functional** with:
- **65 Dagger Functions** across all modules
- **Complete Web Management Interface** with real-time dashboard
- **A2A Communication System** with trust networks
- **Collective Intelligence Engine** with pattern recognition
- **Learning & Evolution System** with fitness scoring
- **Comprehensive Test Coverage** with integration tests

### 📊 System Statistics
- **Main Module**: `.dagger/src/index.ts` - 5,923 lines, 65 functions
- **Web Interface**: Complete HTML dashboard + Go HTTP server
- **Documentation**: Comprehensive README, API docs, architecture guides
- **Test Coverage**: Integration tests for all major components

## 🏗️ Architecture Overview

### Core Components
```
ProactivaDev Platform
├── 🌐 Web Management Interface (Sprint 11)
│   ├── Real-time Dashboard (dashboard.html - 403 lines)
│   ├── Go HTTP Server (web-server.go)
│   ├── REST API (/api/status, /api/metrics, /api/events, /api/execute)
│   └── SSE Live Updates
├── 🧠 Collective Intelligence (Sprint 10)
│   ├── Pattern Recognition & Learning
│   ├── Strategy Evolution & Mutation
│   ├── Team Prediction & Optimization
│   └── Emergent Insights Generation
├── 🔗 A2A Communication Mesh (Sprint 8)
│   ├── Direct Agent Messaging
│   ├── Trust Network Management
│   ├── Message Routing & Priority
│   └── Distributed Decision Making
├── 💾 Collective Learning (Sprint 9)
│   ├── Experience Store with LRU eviction
│   ├── Pattern Recognition Engine
│   ├── Trust Score Management
│   └── Performance Optimization
├── 🤖 Agent Orchestration (Sprints 4-5)
│   ├── 5 Specialized Agent Types
│   ├── Parallel & Sequential Execution
│   ├── Load Balancing & Resource Management
│   └── Advanced Collaboration Patterns
└── 🛠️ Foundation Layer (Sprints 1-3)
    ├── Basic Agent Operations
    ├── State Management & Persistence
    ├── Tool Integration
    └── Logging & Monitoring
```

### Function Distribution
| Sprint | Functions | Focus Area | Status |
|--------|-----------|------------|---------|
| 1 | 6 | Foundation & Basic Operations | ✅ Complete |
| 2 | 6 | Agent Lifecycle Management | ✅ Complete |
| 3 | 5 | Specialized Agent Types | ✅ Complete |
| 4 | 6 | Enhanced Agent Capabilities | ✅ Complete |
| 5 | 10 | Advanced Orchestration | ✅ Complete |
| 6 | - | Refactoring & Optimization | ✅ Complete |
| 7 | 6 | A2A Communication Foundation | ✅ Complete |
| 8 | 8 | Full A2A Mesh Implementation | ✅ Complete |
| 9 | 6 | Collective Learning System | ✅ Complete |
| 10 | 8 | Intelligence Evolution Engine | ✅ Complete |
| 11 | 4 | Web Management Interface | ✅ Complete |
| **Total** | **65** | **Complete Platform** | ✅ **Production Ready** |

## 🛠️ Current Development Phase

### Phase: Documentation & Refactoring
**Goal**: Transform from working prototype to production-ready enterprise platform

**Current Focus**:
1. **📚 Comprehensive Documentation** - Complete guides, API docs, architecture diagrams
2. **🔧 Code Refactoring** - Extract common patterns, eliminate duplication
3. **🧪 Enhanced Testing** - Unit tests, performance benchmarks, security scans
4. **📦 Deployment Optimization** - Production deployment guides, CI/CD integration

## 🎯 System Capabilities

### Web Management Interface 🌐
```bash
# Launch complete web dashboard
dagger call start-web-management-interface up --ports 8080:8080
```
**Features**: Real-time metrics, interactive charts, component monitoring, quick actions, live event streaming

### Agent Operations 🤖
```bash
# Create specialized agents
dagger call create-agent --name "CodeBot" --type "code"
dagger call execute-agent --agent-id "agent-123" --task "Create REST API"

# Advanced orchestration
dagger call execute-agents-parallel --task "Security audit"
dagger call execute-agent-pipeline --agents '["code","test","security"]'
```

### A2A Communication 🔗
```bash
# Initialize communication mesh
dagger call initialize-a2a-mesh --agents 5
dagger call send-a2a-message --from "agent-1" --to "agent-2"
dagger call monitor-a2a-communication --duration 300
```

### Learning & Evolution 🧠
```bash
# System learning
dagger call learn-from-experience --experience '{"success":true,"agents":["code","test"]}'
dagger call trigger-evolution --fitness-threshold 0.8
dagger call export-knowledge --format "json"
```

## 🚨 Critical Maintenance Rules

### The Golden Rules (NEVER BREAK THESE)
```typescript
// 1. Class name MUST match dagger.json name
@object()
export class ProactivaDev {  // EXACTLY matches "proactiva-dev" in dagger.json

// 2. Every function needs @func() decorator
@func()
functionName(): Promise<Container> {  // MUST return Dagger type

// 3. Maintain flat structure
// ✅ /.dagger/src/index.ts (ONLY file in src/)
// ❌ /.dagger/src/modules/anything.ts
```

### Testing Discipline
```bash
# After ANY changes, ALWAYS:
1. dagger develop                    # Reload module
2. dagger functions | wc -l         # Verify 65 functions still exist
3. dagger call test-connection       # Verify basic functionality
4. git commit -m "Safe change"      # Commit immediately if working
```

## 📋 Refactoring Opportunities

### High Priority Refactoring
1. **File Size Reduction**: Main file is 5,923 lines - needs modularization
2. **Common Pattern Extraction**: Container builders, agent factories, error handling
3. **Type System Enhancement**: Extract interfaces to separate files
4. **Documentation Integration**: Add comprehensive JSDoc comments

### Refactoring Strategy
```
Phase 1: Extract utilities and common patterns (Week 1)
Phase 2: Create base classes and interfaces (Week 2) 
Phase 3: Modularize large functions (Week 3)
Phase 4: Comprehensive testing & validation (Week 4)
```

**CRITICAL**: Any refactoring must be incremental with testing after each change.

## 🧪 Testing Requirements

### Current Test Coverage
- **Integration Tests**: Sprints 8, 9, 10 have dedicated test scripts
- **Regression Tests**: All previous functionality preserved
- **Performance Tests**: Benchmarking for critical paths
- **Security Tests**: Vulnerability scanning

### Test Commands
```bash
# Integration tests
./tests/integration/sprint-8.sh     # A2A Communication
./tests/integration/sprint-9.sh     # Collective Learning
./tests/integration/sprint-10.sh    # Intelligence Evolution

# Performance monitoring
dagger call generate-performance-report

# Function verification
dagger functions | grep -c "^  " | grep 65  # Must show 65 functions
```

## 🔍 Common Maintenance Tasks

### Adding New Features
```typescript
// 1. Add function to main class
@func()
async newFeature(param: string): Promise<Container> {
  // Implementation
}

// 2. Test immediately
dagger develop
dagger functions | grep newFeature
dagger call new-feature --param "test"

// 3. Add to documentation
// Update README.md with usage example
// Add to API reference

// 4. Create integration test
echo "Testing new feature..." >> tests/integration/new-feature.sh
```

### Debugging Issues
```bash
# 1. Function not visible?
dagger functions | grep function-name
dagger develop  # Reload module

# 2. Function execution error?
dagger call function-name --help
dagger call function-name --param "debug"

# 3. Container/service issues?
docker ps | grep dagger
docker logs <container-id>

# 4. Web interface not loading?
lsof -i :8080  # Check port usage
curl http://localhost:8080  # Test directly
```

### Performance Optimization
```bash
# Monitor resource usage
dagger call get-system-metrics
dagger call generate-performance-report

# Cache optimization
dagger call optimize-cache-volumes
dagger call clear-unused-caches

# Agent performance
dagger call get-agent-metrics --agent-id "agent-123"
dagger call optimize-agent-resources
```

## 📝 Documentation Standards

### Code Comments
```typescript
/**
 * Advanced agent orchestration with load balancing
 * 
 * @param agents - Array of agent configurations
 * @param task - Task description for execution
 * @param strategy - Load balancing strategy ("round-robin", "least-loaded", "random")
 * @returns Container with orchestration results
 * 
 * @example
 * ```bash
 * dagger call execute-agents-load-balanced \
 *   --agents '[{"type":"code","count":2},{"type":"test","count":1}]' \
 *   --task "Build authentication system" \
 *   --strategy "least-loaded"
 * ```
 */
@func()
async executeAgentsLoadBalanced(
  agents: string,
  task: string,
  strategy: string = "round-robin"
): Promise<Container> {
```

### README Updates
- Keep usage examples current
- Update performance benchmarks
- Add new features to capability matrix
- Maintain accurate architecture diagrams

## 🚀 Deployment & Operations

### Local Development
```bash
# Quick start
dagger develop
dagger call test-connection

# Launch full system
dagger call start-web-management-interface up --ports 8080:8080
```

### Production Considerations
- **Resource Limits**: 100 max concurrent agents
- **Memory Usage**: ~50MB baseline + 5MB per agent
- **Storage**: Uses Dagger cache volumes for persistence
- **Networking**: Supports distributed deployment
- **Security**: API key management, CORS configuration

### Monitoring & Observability
```bash
# System health
dagger call get-system-status
dagger call monitor-agent-performance
dagger call check-cache-health

# Performance tracking
dagger call generate-performance-report
dagger call export-telemetry-data
```

## 💡 Development Best Practices

### When Making Changes
1. **Start Small**: One function or component at a time
2. **Test Immediately**: Verify functionality before proceeding
3. **Document Changes**: Update relevant docs and comments
4. **Commit Often**: Save working states frequently
5. **Monitor Impact**: Check performance and resource usage

### When Refactoring
1. **Preserve Functionality**: All 65 functions must continue working
2. **Maintain API Compatibility**: Don't break existing usage patterns
3. **Test Thoroughly**: Regression test all affected components
4. **Update Documentation**: Keep docs synchronized with changes

### When Debugging
1. **Check Function Count**: `dagger functions | wc -l` should show 65+
2. **Verify Basic Operations**: `dagger call test-connection` should work
3. **Monitor Logs**: Check container logs for error messages
4. **Test Incrementally**: Isolate issues to specific components

## 🎯 Success Metrics

### System Health Indicators
- ✅ All 65 functions discoverable and executable
- ✅ Web dashboard accessible and responsive
- ✅ A2A communication mesh operational
- ✅ Learning system accumulating experiences
- ✅ Evolution system improving performance
- ✅ Integration tests passing
- ✅ Performance within acceptable ranges

### Quality Gates
- **Function Coverage**: 65+ functions working
- **Test Coverage**: 90%+ code coverage
- **Performance**: <2s average response time
- **Documentation**: All public APIs documented
- **Security**: No critical vulnerabilities

## 🔮 Future Development

### Planned Enhancements
1. **Multi-cloud Deployment**: AWS, GCP, Azure support
2. **Enhanced Security**: Advanced auth and authorization
3. **Mobile Dashboard**: React Native mobile app
4. **Custom Agent Types**: User-defined capabilities
5. **Advanced Analytics**: ML-powered insights

### Community Requests
- Plugin system for third-party integrations
- Visual workflow builder for agent orchestration
- Multi-language support (Python, Java, Rust)
- Enterprise SSO integration

## 📞 Support & Resources

### When You Need Help
1. **Check Documentation**: README.md, docs/ folder
2. **Review Past Issues**: GitHub issue tracker
3. **Test Isolation**: Reproduce in minimal environment
4. **Gather Context**: Function lists, logs, performance metrics

### Emergency Recovery
```bash
# When system breaks completely
docker stop $(docker ps -q --filter name=dagger-engine)
docker rm $(docker ps -aq --filter name=dagger-engine)
rm -rf .dagger/sdk .dagger/dagger.lock
dagger develop

# Verify recovery
dagger functions | wc -l  # Should show 65+
dagger call test-connection  # Should work
```

---

## 🎖️ Your Role as AI Assistant

You are the **technical steward** responsible for:

### Primary Responsibilities
- **Maintain System Integrity**: Never break the 65+ working functions
- **Guide Safe Development**: Ensure incremental, tested changes
- **Preserve Documentation**: Keep all docs current and accurate
- **Optimize Performance**: Improve efficiency without breaking functionality
- **Enable Growth**: Support new features while maintaining stability

### Key Principles
1. **Test Before Commit**: Every change must be verified working
2. **Document Everything**: Code changes need doc updates
3. **Incremental Progress**: Small, safe steps over large risky changes
4. **User Focus**: Features must provide real value to users
5. **Enterprise Quality**: Production-ready code with proper error handling

### Decision Framework
When faced with changes:
1. **Will this break existing functionality?** → If yes, redesign approach
2. **Can this be tested immediately?** → If no, break into testable pieces
3. **Does this improve user experience?** → If no, consider if really needed
4. **Is this documented properly?** → If no, add documentation first
5. **Does this follow established patterns?** → If no, justify the deviation

Remember: ProactivaDev v2.0 is a **production system** serving real users. Every change must maintain the high standard of reliability and functionality that users depend on.

**The goal is continuous improvement while preserving the robust foundation we've built.**