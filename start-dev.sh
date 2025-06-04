#!/bin/bash
echo "🚀 Starting Food Business Development Environment..."

# Start Redis in background
echo "📡 Starting Redis..."
redis-server --daemonize yes

# Start Django backend
echo "🐍 Starting Django backend..."
cd backend
source venv/bin/activate
python manage.py runserver &
DJANGO_PID=$!
cd ..

# Start React frontend
echo "⚛️ Starting React frontend..."
cd frontend
npm start &
REACT_PID=$!
cd ..

echo "✅ Development environment started!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://127.0.0.1:8000"
echo "⚡ Redis: Running"

# Wait for Ctrl+C
trap "echo '🛑 Stopping servers...'; kill $DJANGO_PID $REACT_PID; exit" SIGINT
wait
