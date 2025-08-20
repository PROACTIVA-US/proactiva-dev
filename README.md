# 🌐 ProactivaDev v2.0

**Enterprise-Grade Agentic Development Platform**

[![Dagger](https://img.shields.io/badge/Built%20with-Dagger-blue)](https://dagger.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Go](https://img.shields.io/badge/Go-00ADD8?logo=go&logoColor=white)](https://golang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

ProactivaDev is a revolutionary agentic development platform that enables AI agents to collaborate, learn from each other, and improve their teamwork over time through collective intelligence. Built as a Dagger module, it provides enterprise-grade reliability and scalability.

## 🚀 Quick Start

### Prerequisites
- [Dagger CLI](https://docs.dagger.io/quickstart/cli) (v0.18+)
- [Docker](https://www.docker.com/get-started) (for containerization)
- [Go](https://golang.org/doc/install) (v1.21+ for local development)

### Installation
```bash
git clone https://github.com/PROACTIVA-US/proactiva-dev.git
cd proactiva-dev
dagger develop
```

### Launch Web Dashboard
```bash
dagger call start-web-management-interface up --ports 8080:8080
# Open http://localhost:8080 in your browser
```

## 🌟 Key Features

### 🤖 Multi-Agent Collaboration
- **65+ Dagger Functions** for comprehensive agent operations
- **5 Specialized Agent Types**: Code, Test, Security, Performance, Review
- **Advanced Orchestration** with parallel and sequential execution patterns
- **Real-time Collaboration** with direct agent-to-agent communication

### 🧠 Collective Intelligence
- **Pattern Recognition**: System learns from successful collaboration patterns
- **Trust Networks**: Agents build trust relationships based on collaboration outcomes
- **Strategy Evolution**: Approaches improve over time through fitness-based selection
- **Emergent Insights**: Discovers high-level system behaviors and optimizations

### 🌐 Web Management Interface
- **Real-time Dashboard** with professional gradient UI
- **Interactive Charts** using Chart.js for success rates and fitness evolution
- **Live System Monitoring** with Server-Sent Events (SSE)
- **Component Status** tracking for all system components
- **Quick Actions** for system operations (initialize, test, evolve, export)

### 🔗 A2A Communication
- **Direct Agent Messaging** without orchestrator bottlenecks
- **Message Routing** with intelligent path selection
- **Trust Scoring** based on collaboration success rates
- **Distributed Decision Making** across agent networks

### 💾 Persistent Learning
- **Experience Storage** with pattern recognition
- **Collective Memory** shared across all agents
- **Performance Metrics** tracking and optimization
- **Knowledge Export/Import** for system backup and sharing

## 🏗️ Architecture

### 🎯 Refactored Modular Structure (v2.0)
**Professional modular architecture implemented with zero breaking changes:**

```
.dagger/src/
├── index.ts              (196 KB - Main ProactivaDev class with 65+ functions)
├── types.ts              (4.8 KB - TypeScript interfaces & type definitions)
├── constants.ts          (5.4 KB - System constants & configuration values)
├── utils.ts              (8.4 KB - Utility functions & helper methods)
├── scripts.ts            (11.6 KB - Basic agent & workflow scripts)
├── advanced-scripts.ts   (23.9 KB - A2A communication & learning scripts)
├── container-helpers.ts  (5.4 KB - Container creation & configuration)
└── remaining-scripts.ts  (45.9 KB - Protocol & evolution scripts)
```

**Refactoring Benefits:**
- ✅ **105+ KB of code modularized** across 7 specialized files
- ✅ **Zero breaking changes** - all 65+ functions working perfectly
- ✅ **Improved maintainability** with clear separation of concerns
- ✅ **Enhanced reusability** of components across the platform
- ✅ **Performance optimized** with minimal imports and reduced memory footprint

### System Overview
```
┌─────────────────────────────────────────────────────────────┐
│                 ProactivaDev Platform                        │
├─────────────────────────────────────────────────────────────┤
│  🌐 Web Management Interface                                │
│  ├── Real-time Dashboard (HTML/CSS/JS)                     │
│  ├── REST API (Go HTTP Server)                             │
│  └── SSE Events for live updates                           │
├─────────────────────────────────────────────────────────────┤
│  🧠 Collective Intelligence Engine                          │
│  ├── Pattern Recognition & Learning                        │
│  ├── Strategy Evolution & Fitness Scoring                  │
│  ├── Team Prediction & Optimization                        │
│  └── Emergent Insights Generation                          │
├─────────────────────────────────────────────────────────────┤
│  🔗 A2A Communication Mesh                                  │
│  ├── Direct Agent-to-Agent Messaging                       │
│  ├── Trust Network Management                              │
│  ├── Message Routing & Priority Handling                   │
│  └── Distributed Collaboration Protocols                   │
├─────────────────────────────────────────────────────────────┤
│  🤖 Agent Orchestration Layer                               │
│  ├── Agent Lifecycle Management                            │
│  ├── Task Distribution & Load Balancing                    │
│  ├── Resource Allocation & Optimization                    │
│  └── Performance Monitoring & Metrics                      │
├─────────────────────────────────────────────────────────────┤
│  🛠️ Specialized Agent Types                                 │
│  ├── Code Agent (Development & Implementation)             │
│  ├── Test Agent (Quality Assurance & Validation)          │
│  ├── Security Agent (Vulnerability & Compliance)          │
│  ├── Performance Agent (Optimization & Benchmarking)      │
│  └── Review Agent (Code Review & Documentation)           │
├─────────────────────────────────────────────────────────────┤
│  💾 Persistent Storage Layer                                │
│  ├── Agent Memory (Individual agent state)                 │
│  ├── Collective Memory (Shared experiences)               │
│  ├── Evolution Memory (Learning patterns)                 │
│  └── System State (Configuration & metrics)               │
├─────────────────────────────────────────────────────────────┤
│  🐳 Dagger Infrastructure                                   │
│  ├── Container Orchestration                               │
│  ├── Cache Volume Management                               │
│  ├── Secret Handling                                       │
│  └── Service Lifecycle Management                          │
└─────────────────────────────────────────────────────────────┘
```

### Component Relationships
- **Web Interface** ↔️ **API Server** ↔️ **Dagger Functions**
- **Agents** ↔️ **A2A Mesh** ↔️ **Trust Network**
- **Learning Engine** ↔️ **Experience Store** ↔️ **Pattern Recognition**
- **Evolution Engine** ↔️ **Fitness Scoring** ↔️ **Strategy Optimization**

## 📊 System Capabilities

### Dagger Functions (65 total)
- **Foundation**: 6 core functions for basic operations
- **Agent Management**: 12 functions for agent lifecycle
- **Orchestration**: 10 functions for task coordination
- **A2A Communication**: 8 functions for agent messaging
- **Collective Learning**: 6 functions for experience management
- **Intelligence Evolution**: 8 functions for system optimization
- **Web Interface**: 5 functions for dashboard management
- **Utilities**: 10 functions for system maintenance

### Agent Types & Capabilities
| Agent Type | Primary Role | Key Capabilities |
|------------|--------------|------------------|
| **Code** | Development & Implementation | Code generation, debugging, optimization |
| **Test** | Quality Assurance | Test creation, validation, coverage analysis |
| **Security** | Vulnerability Assessment | Security scanning, compliance checking |
| **Performance** | Optimization | Benchmarking, profiling, resource optimization |
| **Review** | Code Review | Code analysis, documentation, best practices |

## 🎯 Usage Examples

### Basic Agent Operations
```bash
# Create and initialize an agent
dagger call create-agent --name "CodeBot" --type "code"

# Execute a task with an agent
dagger call execute-agent --agent-id "agent-123" --task "Create a REST API endpoint"

# Run multiple agents in parallel
dagger call execute-agents-parallel --task "Comprehensive security audit"
```

### Advanced Orchestration
```bash
# Sequential agent pipeline
dagger call execute-agent-pipeline --agents '["code","test","security"]' --task "Build secure payment system"

# Collaborative agent execution
dagger call execute-agents-collaborative --task "Optimize database performance"

# Load-balanced agent distribution
dagger call execute-agents-load-balanced --task "Process large dataset"
```

### A2A Communication
```bash
# Initialize A2A communication mesh
dagger call initialize-a2a-mesh --agents 5

# Send direct agent message
dagger call send-a2a-message --from "agent-1" --to "agent-2" --content "Need code review"

# Monitor A2A message flow
dagger call monitor-a2a-communication --duration 300
```

### Learning & Evolution
```bash
# Record learning experience
dagger call learn-from-experience --experience '{"task":"deployment","success":true,"agents":["code","test"]}'

# Trigger system evolution
dagger call trigger-evolution --fitness-threshold 0.8

# Export collective knowledge
dagger call export-knowledge --format "json"
```

### Web Management
```bash
# Launch web dashboard
dagger call start-web-management-interface up --ports 8080:8080

# Access dashboard at http://localhost:8080
# Features: Real-time metrics, interactive charts, system controls
```

## 🧪 Testing

### Running Tests
```bash
# Run all integration tests
./tests/integration/all-sprints.sh

# Run specific sprint tests
./tests/integration/sprint-8.sh    # A2A Communication
./tests/integration/sprint-9.sh    # Collective Learning
./tests/integration/sprint-10.sh   # Intelligence Evolution

# Performance benchmarks
dagger call generate-performance-report
```

### Test Coverage
- **Unit Tests**: Core functionality and utilities
- **Integration Tests**: End-to-end system workflows
- **Performance Tests**: Load testing and benchmarks
- **Security Tests**: Vulnerability scanning and compliance

## 🔧 Configuration

### Environment Variables
```bash
# API Configuration
export OPENAI_API_KEY="your-api-key"          # Required for LLM integration
export ANTHROPIC_API_KEY="your-api-key"       # Alternative LLM provider

# System Configuration  
export PROACTIVA_MAX_AGENTS=10                # Maximum concurrent agents
export PROACTIVA_LEARNING_RATE=0.1           # Learning algorithm rate
export PROACTIVA_FITNESS_THRESHOLD=0.75       # Evolution trigger threshold

# Web Interface
export PROACTIVA_WEB_PORT=8080                # Dashboard port
export PROACTIVA_API_CORS_ORIGIN="*"          # CORS settings
```

### Cache Volumes
The system uses persistent cache volumes for:
- `agent-memory`: Individual agent state and memory
- `collective-memory`: Shared experiences and patterns
- `a2a-mesh`: Communication history and trust scores
- `evolution-memory`: Learning patterns and fitness data
- `proactiva-state`: System configuration and metrics

## 📈 Performance & Scalability

### Benchmarks
- **Agent Creation**: <500ms per agent
- **Task Execution**: 2-10s depending on complexity  
- **A2A Messaging**: <100ms latency
- **Learning Updates**: <50ms per experience
- **Web Dashboard**: <1s initial load, real-time updates

### Scalability Limits
- **Maximum Agents**: 100 concurrent (configurable)
- **Memory Usage**: ~50MB baseline + 5MB per active agent
- **Storage**: Unlimited (uses Dagger cache volumes)
- **Network**: Supports distributed deployment

## 🚢 Deployment

### Local Development
```bash
# Quick start
dagger develop
dagger call test-connection

# Launch web interface
dagger call start-web-management-interface up --ports 8080:8080
```

### Production Deployment
```bash
# Build container image
dagger call start-web-management-interface export --path ./proactiva-web.tar

# Deploy with Docker Compose
docker load < proactiva-web.tar
docker-compose up -d

# Or deploy with Kubernetes
kubectl apply -f deployment/kubernetes/
```

### CI/CD Integration
```bash
# GitHub Actions workflow
dagger call run-tests
dagger call generate-performance-report
dagger call security-scan
```

## 📚 Documentation

### Developer Resources
- **[API Reference](docs/api-reference.md)**: Complete function documentation
- **[Architecture Guide](docs/architecture.md)**: System design and patterns
- **[Development Guide](docs/development.md)**: Contributing and extending
- **[Troubleshooting](docs/troubleshooting.md)**: Common issues and solutions

### User Guides
- **[Getting Started](docs/getting-started.md)**: Quick start tutorial
- **[Web Interface Guide](docs/web-interface.md)**: Dashboard usage
- **[Agent Configuration](docs/agent-config.md)**: Customizing agent behavior
- **[Best Practices](docs/best-practices.md)**: Optimization recommendations

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make changes with comprehensive tests
4. Run the full test suite
5. Submit a pull request

### Code Standards
- **TypeScript**: Strict mode with comprehensive typing
- **Testing**: 90%+ code coverage required
- **Documentation**: All public APIs documented
- **Performance**: Benchmarks for critical paths

## 🐛 Troubleshooting

### Common Issues

**🔸 "Function not found" error**
```bash
# Check function registration
dagger functions | grep your-function

# Restart Dagger daemon
dagger develop
```

**🔸 Agent execution timeout**
```bash
# Increase timeout limits
export PROACTIVA_AGENT_TIMEOUT=300

# Monitor agent resources
dagger call get-agent-metrics
```

**🔸 Web dashboard not loading**
```bash
# Check service status
dagger call start-web-management-interface stdout

# Verify port availability
lsof -i :8080
```

### Support Resources
- **[Issue Tracker](https://github.com/PROACTIVA-US/proactiva-dev/issues)**: Bug reports and feature requests
- **[Discussions](https://github.com/PROACTIVA-US/proactiva-dev/discussions)**: Community support
- **[Documentation](docs/)**: Comprehensive guides and references

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Acknowledgments

- **[Dagger](https://dagger.io)**: For the amazing containerized CI/CD platform
- **[OpenAI](https://openai.com)**: For GPT models powering the agents
- **[Anthropic](https://anthropic.com)**: For Claude integration
- **[Chart.js](https://www.chartjs.org)**: For beautiful dashboard visualizations

## 🔮 Roadmap

### Upcoming Features
- **🌍 Multi-cloud Deployment**: AWS, GCP, Azure support
- **🔒 Enhanced Security**: Advanced authentication and authorization
- **📱 Mobile Dashboard**: React Native mobile app
- **🤖 Custom Agent Types**: User-defined agent capabilities
- **📊 Advanced Analytics**: ML-powered insights and predictions

### Community Requests
- **Plugin System**: Third-party integrations
- **Visual Workflow Builder**: Drag-and-drop agent orchestration
- **Multi-language Support**: Python, Java, Rust agent implementations
- **Enterprise SSO**: SAML/OAuth integration

---

**Built with ❤️ by the ProactivaDev team**

*Transforming software development through intelligent agent collaboration*