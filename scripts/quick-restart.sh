#!/bin/bash

# Quick Restart Script for ClientHunt Frontend
# Use this when you've already built and just need to restart PM2

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Restarting ClientHunt Frontend...${NC}"

# Get the script directory and project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

cd "$PROJECT_ROOT"

# Check if standalone exists
if [ ! -d ".next/standalone" ]; then
    echo -e "${YELLOW}⚠ Standalone build not found. Run build-and-deploy.sh first.${NC}"
    exit 1
fi

# Ensure static files are copied
if [ -d ".next/static" ] && [ ! -d ".next/standalone/.next/static" ]; then
    echo "Copying static files..."
    mkdir -p .next/standalone/.next/static
    cp -r .next/static/* .next/standalone/.next/static/
fi

if [ -d "public" ] && [ ! -d ".next/standalone/public" ]; then
    echo "Copying public folder..."
    cp -r public .next/standalone/
fi

# Restart PM2
if pm2 list | grep -q "clienthunt-frontend"; then
    echo "Stopping existing process..."
    pm2 delete clienthunt-frontend 2>/dev/null || true
fi

cd .next/standalone
PORT=9100 HOSTNAME=0.0.0.0 pm2 start server.js --name clienthunt-frontend --update-env
pm2 save

echo -e "${GREEN}✓ Frontend restarted successfully${NC}"

