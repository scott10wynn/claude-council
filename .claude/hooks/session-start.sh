#!/bin/bash
set -euo pipefail

# Only run in remote (web) sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Install MCP server dependencies
cd "$CLAUDE_PROJECT_DIR/mcp-servers/jobs"
npm install --prefer-offline --no-audit --no-fund 2>&1

echo "job-search MCP server dependencies ready"
