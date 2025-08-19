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

// SystemStatus represents the current system state
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

type MetricsData struct {
    Timestamp   string  `json:"timestamp"`
    SuccessRate float64 `json:"success_rate"`
    Fitness     float64 `json:"fitness"`
    TaskCount   int     `json:"task_count"`
    MemoryMB    float64 `json:"memory_mb"`
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

func statusHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    
    // Simulate reading from cache volumes
    status := SystemStatus{
        Timestamp:       time.Now().Format(time.RFC3339),
        Status:          "OPERATIONAL",
        Agents:          5,
        Generation:      1,
        FitnessScore:    0.75 + rand.Float64()*0.1,
        SuccessRate:     0.82 + rand.Float64()*0.05,
        TotalFunctions:  60,
        ActiveWorkflows: rand.Intn(5),
        MemoryUsageMB:   45.3 + rand.Float64()*10,
        Components: map[string]Component{
            "agent_memory":      {Status: "active", SizeMB: 12.5 + rand.Float64()*2},
            "a2a_mesh":          {Status: "active", SizeMB: 8.3 + rand.Float64()},
            "collective_memory": {Status: "active", SizeMB: 15.7 + rand.Float64()*3},
            "evolution_memory":  {Status: "active", SizeMB: 6.2 + rand.Float64()},
            "proactiva_state":   {Status: "active", SizeMB: 2.6 + rand.Float64()*0.5},
        },
    }
    
    json.NewEncoder(w).Encode(status)
}

func metricsHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    
    metrics := []MetricsData{}
    now := time.Now()
    
    for i := 59; i >= 0; i-- {
        t := now.Add(-time.Duration(i) * time.Minute)
        metrics = append(metrics, MetricsData{
            Timestamp:   t.Format(time.RFC3339),
            SuccessRate: 0.7 + float64(60-i)*0.003 + rand.Float64()*0.05,
            Fitness:     0.5 + float64(60-i)*0.005 + rand.Float64()*0.02,
            TaskCount:   3 + (60-i)/10 + rand.Intn(3),
            MemoryMB:    40 + float64(60-i)*0.1 + rand.Float64()*5,
        })
    }
    
    json.NewEncoder(w).Encode(metrics)
}

func eventsHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "text/event-stream")
    w.Header().Set("Cache-Control", "no-cache")
    w.Header().Set("Connection", "keep-alive")
    
    flusher, ok := w.(http.Flusher)
    if !ok {
        http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
        return
    }
    
    ticker := time.NewTicker(3 * time.Second)
    defer ticker.Stop()
    
    events := []string{"Task completed", "Agent spawned", "Pattern recognized", "Evolution triggered"}
    
    for {
        select {
        case <-ticker.C:
            event := map[string]interface{}{
                "timestamp":    time.Now().Format(time.RFC3339),
                "type":         "update",
                "success_rate": 0.7 + rand.Float64()*0.3,
                "active_tasks": rand.Intn(8),
                "memory_mb":    40 + rand.Float64()*20,
                "event":        events[rand.Intn(len(events))],
            }
            
            data, _ := json.Marshal(event)
            fmt.Fprintf(w, "data: %s\n\n", data)
            flusher.Flush()
            
        case <-r.Context().Done():
            return
        }
    }
}

func executeHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    
    var request struct {
        Command string `json:"command"`
    }
    
    if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    
    response := map[string]interface{}{
        "status":  "executed",
        "command": request.Command,
        "output":  fmt.Sprintf("Command '%s' executed successfully", request.Command),
        "timestamp": time.Now().Format(time.RFC3339),
    }
    
    json.NewEncoder(w).Encode(response)
}

func main() {
    // Read HTML dashboard from file
    dashboardHTML, err := os.ReadFile("/dashboard.html")
    if err != nil {
        log.Fatal("Failed to read dashboard HTML:", err)
    }
    
    // API endpoints with CORS
    http.HandleFunc("/api/status", corsMiddleware(statusHandler))
    http.HandleFunc("/api/metrics", corsMiddleware(metricsHandler))
    http.HandleFunc("/api/events", corsMiddleware(eventsHandler))
    http.HandleFunc("/api/execute", corsMiddleware(executeHandler))
    
    // Serve dashboard
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "text/html")
        w.Write(dashboardHTML)
    })
    
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }
    
    log.Printf("🌐 ProactivaDev Web Management Interface starting on port %s", port)
    log.Printf("📊 Dashboard: http://localhost:%s", port)
    log.Printf("🔌 API: http://localhost:%s/api/status", port)
    log.Printf("📈 SSE: http://localhost:%s/api/events", port)
    
    if err := http.ListenAndServe(":"+port, nil); err != nil {
        log.Fatal(err)
    }
}