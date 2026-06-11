#!/usr/bin/env bash
# Warn when Claude is about to run a broad/expensive command.
# Exit 2 = feedback shown to Claude without blocking the tool call.

input=$(cat)
cmd=$(echo "$input" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('command',''))" 2>/dev/null)

warn() {
  echo "efficiency-hook: $1" >&2
  exit 2
}

# Broad recursive searches
if echo "$cmd" | grep -qE 'grep[[:space:]]+-[a-zA-Z]*[rR]'; then
  warn "grep -r detected. Prefer: rg <pattern> <path>"
fi

if echo "$cmd" | grep -qE '^find[[:space:]]+\.?[[:space:]]*(-[^(]|$)'; then
  warn "Broad 'find .' detected. Prefer: rg --files or rg <pattern>"
fi

if echo "$cmd" | grep -qE 'ls[[:space:]]+-[a-zA-Z]*R'; then
  warn "ls -R detected. Prefer: rg --files | head or a targeted find with -maxdepth"
fi

# Full test suite signals
if echo "$cmd" | grep -qE '(pytest|jest|npm test|yarn test|go test \./\.\.\.)[[:space:]]*$'; then
  warn "Full test suite detected. Prefer running only relevant test files. Use /changed-tests to identify them."
fi

# Dependency installs
if echo "$cmd" | grep -qE '^(npm install|yarn add|pip install|gem install|cargo add)[[:space:]]+[^-]'; then
  warn "Dependency install detected. Confirm this is necessary before proceeding."
fi

exit 0
