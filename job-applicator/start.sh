#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

# Install dependencies if needed
if ! python3 -c "import flask" 2>/dev/null; then
  echo "Installing Python dependencies..."
  pip3 install -r requirements.txt
fi

# Install Playwright browsers if needed
if ! python3 -c "from playwright.sync_api import sync_playwright; p = sync_playwright().start(); p.stop()" 2>/dev/null; then
  echo "Installing Playwright browsers..."
  python3 -m playwright install chromium
fi

echo "Starting Job Applicator at http://localhost:5050"
python3 app.py
