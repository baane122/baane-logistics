#!/bin/bash
cd "$(dirname "$0")"
echo "============================================"
echo "  🚀 Baane Logistics — Starting..."
echo "  📍 http://localhost:3000"
echo "  🔧 http://localhost:3000/admin"
echo "============================================"
echo ""
npx vite --port 3000 --host
