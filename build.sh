#!/bin/bash

# Frontend
cd frontend
./build.sh --no-docker clean init build
cd ..

cd backend
# Create directory structure and copy frontend dist
mkdir -p ./src/main/resources
cp -R ../frontend/dist/* ./src/main/resources/

# Create view directory and copy HTML files
mkdir -p ./src/main/resources/view
cp -R ./src/main/resources/*.html ./src/main/resources/view

# Build .
./build.sh --no-docker clean build

# Clean up - remove frontend/dist and backend/src/main/resources
rm -rf ../frontend/dist
rm -rf ./src/main/resources