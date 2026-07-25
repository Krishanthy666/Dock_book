#!/bin/bash

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

echo "============================================="
echo "Starting eDocBook - Doctor Booking System"
echo "============================================="

# Function to kill child processes on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}
trap cleanup SIGINT SIGTERM

# Start backend
echo "Starting FastAPI Backend..."
cd "$SCRIPT_DIR/backend"
# Use virtualenv python if it exists, otherwise fall back to global python
if [ -d "./venv" ]; then
    ./venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 &
else
    python3 -m uvicorn main:app --host 127.0.0.1 --port 8000 &
fi
BACKEND_PID=$!

# Start frontend
echo "Starting React Frontend..."
cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo "---------------------------------------------"
echo "FastAPI Backend running at: http://127.0.0.1:8000"
echo "React Frontend running at: http://localhost:5173"
echo "Press Ctrl+C to stop both servers."
echo "---------------------------------------------"

# Wait for background processes to keep script running
wait $BACKEND_PID $FRONTEND_PID
