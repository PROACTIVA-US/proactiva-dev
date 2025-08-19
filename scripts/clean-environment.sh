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