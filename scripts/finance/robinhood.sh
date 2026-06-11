#!/bin/bash
# ABOUTME: Fetches Robinhood account data and formats it for council analysis
# ABOUTME: Wraps robinhood_connector.py; outputs markdown portfolio snapshot

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONNECTOR="${SCRIPT_DIR}/robinhood_connector.py"

COMMAND="${1:-all}"
OUTPUT_FORMAT="${2:-markdown}"
DAYS="${3:-30}"

# Dependency check
if ! python3 -c "import robin_stocks" 2>/dev/null; then
    echo "## Setup Required" >&2
    echo "" >&2
    echo "The \`robin_stocks\` Python package is not installed." >&2
    echo "Run:  pip install robin_stocks" >&2
    echo "" >&2
    echo "If MFA uses TOTP, also run:  pip install pyotp" >&2
    exit 2
fi

exec python3 "$CONNECTOR" "$COMMAND" --output="$OUTPUT_FORMAT" --days="$DAYS"
