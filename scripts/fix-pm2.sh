#!/bin/bash

# Fix PM2 Script - Cleans up and restarts PM2 correctly
# Use this if you see the "next start" warning

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Cleaning up PM2 process...${NC}"

# Get the script directory and project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

cd "$PROJECT_ROOT"

# Stop and delete existing process
if pm2 list | grep -q "clienthunt-frontend"; then
    echo "Stopping and deleting existing process..."
    pm2 delete clienthunt-frontend 2>/dev/null || true
    sleep 1
fi

# Ensure we're in the right directory and standalone exists
if [ ! -d ".next/standalone" ]; then
    echo -e "${RED}❌ Error: .next/standalone directory not found!${NC}"
    echo -e "${YELLOW}Run 'npm run build' first.${NC}"
    exit 1
fi

# Ensure static files are copied
if [ -d ".next/static" ]; then
    echo "Ensuring static files are copied..."
    mkdir -p .next/standalone/.next/static
    cp -r .next/static/* .next/standalone/.next/static/ 2>/dev/null || true
fi

if [ -d "public" ]; then
    echo "Ensuring public folder is copied..."
    cp -r public .next/standalone/ 2>/dev/null || true
fi

# Start PM2 correctly from standalone directory
echo -e "${YELLOW}Starting PM2 with correct command...${NC}"
cd .next/standalone

# Use absolute path to ensure we're running the right server.js
PORT=9100 HOSTNAME=0.0.0.0 pm2 start server.js --name clienthunt-frontend --update-env
pm2 save

echo ""
echo -e "${GREEN}✓ PM2 restarted correctly${NC}"
echo ""
echo "Check logs:"
echo "  pm2 logs clienthunt-frontend --lines 20"
echo ""
echo "The warning should be gone now!"

