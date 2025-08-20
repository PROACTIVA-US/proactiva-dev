# ProactivaDev Dashboard Documentation

## 🌐 Overview

The ProactivaDev Web Management Interface provides a comprehensive dashboard for monitoring and controlling your agentic development platform. Built with modern web technologies and a glass morphism design, it offers real-time insights and test capabilities.

## 🚀 Quick Start

### One-Command Launch
```bash
./dashboard
# Opens automatically at http://localhost:8080
```

## 🎨 Features

### UI/UX Design
- **Glass Morphism Effects**: Blur effects with transparency for modern aesthetics
- **Dark/Light Theme**: Toggle between themes with persistent storage
- **Responsive Design**: Adapts to different screen sizes
- **Real-time Updates**: Server-Sent Events for live data streaming

### Dashboard Components

#### 1. Status Bar
- **Connection Status**: Shows CONNECTED/DISCONNECTED based on real Dagger availability
- **Generation Counter**: Current evolution generation
- **Agent Count**: Number of active agents
- **Success Rate**: System-wide success percentage
- **Memory Usage**: Current RAM consumption
- **Function Count**: Total available Dagger functions (should show 66)

#### 2. System Metrics Card
- Success Rate percentage
- Fitness Score (0-1 scale)
- Active Workflows count
- Memory Usage in MB
- Total Functions available

#### 3. System Components Card
- Collective Intelligence status
- A2A Communication health
- Learning System status
- Agent Orchestration state
- Each component shows active/inactive and size in MB

#### 4. Charts
- **Success Rate Trend**: Line chart showing performance over time
- **Fitness Evolution**: Tracks system improvement across generations
- Both charts update in real-time with SSE data

#### 5. Quick Actions
- **Initialize System**: Sets up the platform
- **Run Tests**: Executes basic validation
- **Trigger Evolution**: Starts fitness-based improvement
- **Export Knowledge**: Saves system state to JSON

#### 6. Test Suites

##### Standard Tests (Safe & Quick)
- **Quick Test** (30s): Basic connectivity check
- **Agent Test** (2m): Creates and validates agents
- **A2A Test** (3m): Tests communication mesh
- **Learning Test** (5m): Validates collective learning

##### Advanced Tests (Resource Intensive)
⚠️ **Warning Box**: Clearly indicates resource requirements

- **Pipeline Test** (2-3m): Multi-agent collaboration workflow
  - Requires confirmation dialog
  - Tests code → test → review pipeline
  
- **Stress Test** (5+m): Heavy load testing
  - Strong warning about CPU/memory usage
  - Spawns 10+ parallel agents
  - Runs in background

#### 7. Real-time Events
- Live event log with timestamps
- Shows test results, system events, and status changes
- Auto-scrolls to latest events
- Keeps last 10 events visible

## 🔧 Technical Architecture

### Frontend Stack
- **HTML5/CSS3**: Semantic markup with CSS variables
- **Vanilla JavaScript**: No framework dependencies
- **Chart.js**: Interactive data visualization
- **Server-Sent Events**: Real-time updates

### Backend Components
- **Go HTTP Server**: `web-server.go`
- **REST API Endpoints**:
  - `/api/status`: System status
  - `/api/metrics`: Historical metrics
  - `/api/events`: SSE stream
  - `/api/execute`: Command execution
  - `/api/test`: Test suite execution

### Connection Flow
1. Dashboard checks Dagger availability via `dagger functions`
2. Shows CONNECTED if Dagger responds
3. Falls back to mock data if Dagger unavailable
4. Updates every 5 seconds via SSE

## 🧪 Test Integration

### How Tests Work
1. User clicks test button in UI
2. Frontend sends POST to `/api/test`
3. Backend executes actual Dagger commands
4. Results stream back via JSON response
5. UI updates with success/failure status

### Test Safety Features
- Standard tests run immediately
- Advanced tests require confirmation
- Clear time estimates provided
- Resource warnings for heavy tests
- Separate progress tracking

## 🎯 Configuration

### Environment Variables
```bash
# Port configuration (default: 8080)
PORT=8080

# Dashboard version tracking
DASHBOARD_VERSION=v2_glass_morphism

# Cache busting for updates
CACHE_BUST=timestamp
```

### Theme Customization
The dashboard uses CSS variables for theming:
```css
:root {
  --proactiva-blue: #0520A6;
  --va-red: #B91C1C;
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
}
```

## 🚨 Troubleshooting

### Dashboard Won't Load
```bash
# Check if port 8080 is in use
lsof -i :8080

# Kill existing process
kill -9 $(lsof -ti:8080)

# Restart dashboard
./dashboard
```

### Shows DISCONNECTED
```bash
# Verify Dagger is running
dagger functions

# Restart Dagger engine
docker restart dagger-engine-v0.18.16

# Reload module
dagger develop
```

### Tests Failing
```bash
# Check function names
dagger functions | grep test

# Run test directly
dagger call test-connection

# Check logs
docker logs dagger-engine-v0.18.16
```

## 📊 API Reference

### GET /api/status
Returns current system status:
```json
{
  "timestamp": "2024-08-20T14:00:00Z",
  "status": "CONNECTED",
  "agents": 5,
  "generation": 42,
  "fitness_score": 0.875,
  "success_rate": 0.92,
  "total_functions": 66,
  "active_workflows": 3,
  "memory_usage_mb": 123.5,
  "components": {
    "collective_intelligence": {
      "status": "active",
      "size_mb": 45.2
    }
  }
}
```

### POST /api/test
Execute test suite:
```json
// Request
{
  "suite": "quick" // or "agents", "a2a", "learning", "pipeline", "stress"
}

// Response
{
  "success": true,
  "message": "Test completed",
  "details": "Detailed output..."
}
```

### GET /api/events
Server-Sent Events stream:
```
data: {"event":"system_connected","timestamp":"2024-08-20T14:00:00Z"}

data: {"event":"test_complete","success":true,"timestamp":"2024-08-20T14:01:00Z"}
```

## 🔐 Security Considerations

- CORS enabled for local development
- No authentication (add for production)
- Commands executed with user permissions
- Confirmation required for destructive operations

## 🚀 Future Enhancements

- WebSocket support for bidirectional communication
- Authentication and user management
- Test scheduling and automation
- Export/import test configurations
- Mobile-responsive improvements
- Accessibility (ARIA) enhancements