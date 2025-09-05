#!/bin/bash
# RFFL Week 1 Median Webapp - Development Server

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🏈 RFFL Week 1 Median Webapp${NC}"
echo "=================================="

# Check if port 8000 is already in use
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 8000 is already in use${NC}"
    echo "You may already have the server running."
    echo "Check http://localhost:8000 in your browser."
    echo ""
    echo "To kill existing server:"
    echo "  kill \$(lsof -ti:8000)"
    exit 1
fi

# Check for Python
if command -v python3 >/dev/null 2>&1; then
    PYTHON_CMD="python3"
elif command -v python >/dev/null 2>&1; then
    PYTHON_CMD="python"
else
    echo -e "${RED}❌ Python not found${NC}"
    echo "Please install Python to run the development server."
    exit 1
fi

# Start the server
echo -e "${GREEN}✅ Starting development server...${NC}"
echo ""
echo -e "🔴 LIVE Mobile: ${BLUE}http://localhost:8000/live-mobile.html${NC} ${RED}⭐ RECOMMENDED${NC}"
echo -e "📱 Mobile UI:   ${BLUE}http://localhost:8000/mobile.html${NC}"
echo -e "💻 Desktop:     ${BLUE}http://localhost:8000${NC}"
echo -e "🧪 Test Page:   ${BLUE}http://localhost:8000/test.html${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
echo ""

# Start HTTP server
$PYTHON_CMD -m http.server 8000