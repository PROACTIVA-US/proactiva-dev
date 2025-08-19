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