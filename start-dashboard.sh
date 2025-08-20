#!/bin/bash

# ProactivaDev Dashboard Launcher
# Simple one-command solution to start the web interface

echo "🌐 Starting ProactivaDev Dashboard..."

# Kill any existing processes on port 8080
lsof -ti:8080 | xargs kill -9 2>/dev/null

# Start the Go web server
echo "📊 Launching web server on http://localhost:8080"
go run web-server.go &

# Wait for server to start
sleep 2

# Open browser
echo "🚀 Opening dashboard in browser..."
open http://localhost:8080

echo ""
echo "✅ Dashboard is running at http://localhost:8080"
echo "Press Ctrl+C to stop the server"

# Keep script running and handle Ctrl+C gracefully
trap "echo ''; echo '🛑 Stopping dashboard...'; pkill -f 'go run web-server.go'; exit 0" INT

# Wait indefinitely
while true; do
    sleep 1
done