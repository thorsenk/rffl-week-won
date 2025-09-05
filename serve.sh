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
OPEN_INDEX=false
OPEN_STYLEGUIDE=false
OPEN_LIVE=false

for arg in "$@"; do
  case "$arg" in
    --open)
      OPEN_INDEX=true
      ;;
    --open-styleguide)
      OPEN_STYLEGUIDE=true
      ;;
    --open-live)
      OPEN_LIVE=true
      ;;
  esac
done

open_url() {
  local url="$1"
  if command -v open >/dev/null 2>&1; then
    open "$url" >/dev/null 2>&1 &
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$url" >/dev/null 2>&1 &
  else
    echo -e "${YELLOW}Cannot auto-open browser. Please visit:${NC} $url"
  fi
}

echo -e "${GREEN}✅ Starting development server...${NC}"
echo ""
echo -e "🔴 LIVE Mobile: ${BLUE}http://localhost:8000/live-mobile.html${NC} ${RED}⭐ RECOMMENDED${NC}"
echo -e "📱 Mobile UI:   ${BLUE}http://localhost:8000/mobile.html${NC}"
echo -e "💻 Desktop:     ${BLUE}http://localhost:8000${NC}"
echo -e "🧪 Test Page:   ${BLUE}http://localhost:8000/test.html${NC}"
echo -e "🎨 Style Guide: ${BLUE}http://localhost:8000/styleguide.html${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
echo ""

# Start HTTP server in background, then open browser if requested
"$PYTHON_CMD" -m http.server 8000 &
SERVER_PID=$!

# Give the server a moment to start
sleep 1

if $OPEN_INDEX; then
  open_url "http://localhost:8000"
fi
if $OPEN_STYLEGUIDE; then
  open_url "http://localhost:8000/styleguide.html"
fi
if $OPEN_LIVE; then
  open_url "http://localhost:8000/live-mobile.html"
fi

# Forward Ctrl+C to child and wait
trap 'echo; echo -e "${RED}Stopping server...${NC}"; kill $SERVER_PID 2>/dev/null' INT TERM
wait $SERVER_PID
