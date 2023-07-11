#!/bin/bash

# Frontend
cd frontend
./build.sh --no-docker clean init build
cd ..

# Backend
cd backend
cp -R ../frontend/dist/* ./src/main/resources/
mkdir -p ./src/main/resources/view
find ./src/main/resources -name "*.html" -type f -exec cp {} ./src/main/resources/view/ \;
find ./src/main/resources -maxdepth 1 -type f -name "*.html" -delete
rm -rf ../frontend/dist
./build.sh --no-docker clean build
find ./src/main/resources -mindepth 1 -type d -exec rm -rf {} +
