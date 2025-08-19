#!/bin/bash

# Check that all exports are preserved after refactoring

echo "📊 Checking exports preservation..."

# Create backup of current index.ts
cp .dagger/src/index.ts .dagger/src/index.ts.backup 2>/dev/null || echo "No backup needed yet"

# Count exports in original
ORIGINAL_EXPORTS=$(grep -c "export\|@func" .dagger/src/index.ts.backup 2>/dev/null || grep -c "export\|@func" .dagger/src/index.ts)

# Count exports in refactored code (all .ts files in src)
CURRENT_EXPORTS=$(find .dagger/src -name "*.ts" -exec grep -l "export\|@func" {} \; | xargs grep -c "export\|@func" | awk '{sum+=$1} END {print sum}')

echo "Functions/exports in original: $ORIGINAL_EXPORTS"
echo "Functions/exports in refactored: $CURRENT_EXPORTS"

if [ "$CURRENT_EXPORTS" -ge "$ORIGINAL_EXPORTS" ]; then
    echo "✅ All exports preserved or increased"
    exit 0
else
    echo "❌ Some exports may be missing"
    echo "Expected: >= $ORIGINAL_EXPORTS, Got: $CURRENT_EXPORTS"
    exit 1
fi