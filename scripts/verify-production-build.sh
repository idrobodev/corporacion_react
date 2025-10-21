#!/bin/bash

# Script to verify production build doesn't include development dependencies

echo "🔍 Verifying production build..."

# Check if build directory exists
if [ ! -d "build" ]; then
    echo "❌ Build directory not found. Run 'npm run build' first."
    exit 1
fi

# Check for React Refresh in bundle
if grep -r "react-refresh" build/static/js/ 2>/dev/null; then
    echo "❌ ERROR: React Refresh found in production bundle!"
    exit 1
else
    echo "✅ React Refresh not found in production bundle"
fi

# Check for webpack-dev-server
if grep -r "webpack-dev-server" build/static/js/ 2>/dev/null; then
    echo "❌ ERROR: webpack-dev-server found in production bundle!"
    exit 1
else
    echo "✅ webpack-dev-server not found in production bundle"
fi

# Check for $RefreshSig$
if grep -r "\$RefreshSig\$" build/static/js/ 2>/dev/null; then
    echo "❌ ERROR: React Refresh signatures found in production bundle!"
    exit 1
else
    echo "✅ No React Refresh signatures found in production bundle"
fi

echo ""
echo "✅ Production build verification passed!"
echo "Bundle is clean and ready for deployment."
