#!/bin/bash
check_react_ready() {
  while ! nc -z localhost 3000; do
    echo "Waiting for React app to be available at localhost:3000..."
    sleep 1
  done
}

echo "Starting React app..."
npm start & 
react_pid=$!

check_react_ready

echo "Starting Electron..."
npm run electron

wait $react_pid
