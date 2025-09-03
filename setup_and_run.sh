#!/bin/bash

echo "Starting ERP setup..."

# 1. Extract zip (if zip is provided)
# unzip erp_live_ready.zip -d ./erp_live_ready

cd erp_live_ready/backend
echo "Installing backend dependencies..."
npm install

cd ../frontend
echo "Installing frontend dependencies..."
npm install

echo "Building frontend..."
npm run build

echo "Starting ERP live..."
npx concurrently "npm start --prefix ../backend" "npm start"
