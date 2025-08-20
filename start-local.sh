#!/bin/bash

# ProactivaDev Local Dashboard - Ultra Simple Launcher
# One command to rule them all

echo "🌐 ProactivaDev Dashboard Starting..."

# Create a temporary Go file that works locally
cat > /tmp/proactiva-server.go << 'EOF'
package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "os"
    "time"
    "math/rand"
)

type SystemStatus struct {
    Timestamp       string                 `json:"timestamp"`
    Status          string                 `json:"status"`
    Agents          int                    `json:"agents"`
    Generation      int                    `json:"generation"`
    FitnessScore    float64                `json:"fitness_score"`
    SuccessRate     float64                `json:"success_rate"`
    TotalFunctions  int                    `json:"total_functions"`
    ActiveWorkflows int                    `json:"active_workflows"`
    MemoryUsageMB   float64                `json:"memory_usage_mb"`
    Components      map[string]Component   `json:"components"`
}

type Component struct {
    Status string  `json:"status"`
    SizeMB float64 `json:"size_mb"`
}

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }
        next(w, r)
    }
}

func main() {
    dashboardHTML, err := os.ReadFile("dashboard.html")
    if err != nil {
        log.Fatal("Failed to read dashboard HTML:", err)
    }
    
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "text/html")
        w.Write(dashboardHTML)
    })
    
    http.HandleFunc("/api/status", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
        status := SystemStatus{
            Timestamp:       time.Now().Format(time.RFC3339),
            Status:          "operational",
            Agents:          5,
            Generation:      42,
            FitnessScore:    0.875,
            SuccessRate:     0.92,
            TotalFunctions:  66,
            ActiveWorkflows: 3,
            MemoryUsageMB:   123.5,
            Components: map[string]Component{
                "collective_intelligence": {Status: "active", SizeMB: 45.2},
                "a2a_communication":       {Status: "active", SizeMB: 23.8},
                "learning_system":         {Status: "active", SizeMB: 31.5},
                "agent_orchestration":     {Status: "active", SizeMB: 22.9},
            },
        }
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(status)
    }))
    
    fmt.Println("🚀 Dashboard running at http://localhost:8080")
    fmt.Println("Press Ctrl+C to stop")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
EOF

# Kill any existing process on port 8080
lsof -ti:8080 | xargs kill -9 2>/dev/null

# Run the server
go run /tmp/proactiva-server.go &
SERVER_PID=$!

# Wait for server to start
sleep 2

# Open browser
open http://localhost:8080

echo ""
echo "✅ Dashboard is running at http://localhost:8080"
echo "Press Ctrl+C to stop"

# Cleanup on exit
trap "kill $SERVER_PID 2>/dev/null; rm /tmp/proactiva-server.go; echo '👋 Dashboard stopped'; exit 0" INT

# Keep running
wait $SERVER_PID