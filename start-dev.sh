# #!/bin/bash

# # Colors for beautiful output
# RED='\033[0;31m'
# GREEN='\033[0;32m'
# YELLOW='\033[1;33m'
# BLUE='\033[0;34m'
# PURPLE='\033[0;35m'
# CYAN='\033[0;36m'
# WHITE='\033[1;37m'
# NC='\033[0m' # No Color

# echo -e "${BLUE}🚀 Starting Food Business Development Environment...${NC}"

# # Start Redis in background
# echo -e "${YELLOW}📡 Starting Redis...${NC}"
# redis-server --daemonize yes

# # Start Django backend
# echo -e "${GREEN}🐍 Starting Django backend...${NC}"
# cd backend
# source venv/bin/activate
# python manage.py runserver 
# DJANGO_PID=$!
# cd ..

# # Start React frontend
# echo -e "${CYAN}⚛️ Starting React frontend...${NC}"
# cd frontend
# npm start &
# REACT_PID=$!
# cd ..

# echo -e "${GREEN}✅ Development environment started!${NC}"
# echo -e "${BLUE}📱 Frontend:${NC} ${WHITE}http://localhost:3000${NC}"
# echo -e "${BLUE}🔧 Backend:${NC} ${RED}http://127.0.0.1:8000${NC}"
# echo -e "${PURPLE}⚡ Redis:${NC} ${WHITE}Running${NC}"

# # Wait for Ctrl+C
# trap "echo -e '${RED}🛑 Stopping servers...${NC}'; kill $DJANGO_PID $REACT_PID; exit" SIGINT
# wait
#!/bin/bash

# Colors for beautiful output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Food Business Development Environment...${NC}"

# Start Redis in background (usually fine as its logs are less critical for dev)
echo -e "${YELLOW}📡 Starting Redis...${NC}"
redis-server --daemonize yes

# Start React frontend in background and note the instruction to check its logs
echo -e "${CYAN}⚛️ Starting React frontend...${NC}"
cd frontend
npm start &
REACT_PID=$!
cd ..
echo -e "${YELLOW}   Note: React frontend output is in background. Check 'frontend/npm-debug.log' or similar if issues occur.${NC}" # Optional
echo -e "${YELLOW}   You might open a separate terminal and run 'cd frontend && npm start' there for live React logs.${NC}" # Optional


# Start Django backend in foreground
echo -e "${GREEN}🐍 Starting Django backend...${NC}"
cd backend
source venv/bin/activate
# NO '&' here, so Django logs will print directly to this terminal
python manage.py runserver
# Django will now block this terminal and show its logs.
# You'll need another terminal for React's live logs if you want them.
DJANGO_PID=$! # This PID won't be used for `wait`, but kept for consistency.
cd ..

echo -e "${GREEN}✅ Development environment started!${NC}"
echo -e "${BLUE}📱 Frontend:${NC} ${WHITE}http://localhost:3000${NC}"
echo -e "${BLUE}🔧 Backend:${NC} ${RED}http://127.0.0.1:8000${NC}"
echo -e "${PURPLE}⚡ Redis:${NC} ${WHITE}Running${NC}"

# The `wait` command won't be reached until Django server exits.
# You'd use Ctrl+C in the terminal running npm start if you went that route.
# The trap is still useful for stopping Django if it were backgrounded.
# trap "echo -e '${RED}🛑 Stopping servers...${NC}'; kill $DJANGO_PID $REACT_PID; exit" SIGINT
# wait # No need for wait if Django is in foreground