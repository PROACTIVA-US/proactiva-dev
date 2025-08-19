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