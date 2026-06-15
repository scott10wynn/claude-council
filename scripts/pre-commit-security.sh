#!/usr/bin/env bash
# Pre-commit hook: blocks commits that contain likely secrets or .env files.
# Install: cp scripts/pre-commit-security.sh .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit

set -euo pipefail

RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

FAIL=0

# ── 1. Block .env files ────────────────────────────────────────────────────
ENV_FILES=$(git diff --cached --name-only | grep -E '\.env($|\.)' || true)
if [ -n "$ENV_FILES" ]; then
  echo -e "${RED}[BLOCKED] .env file staged for commit:${NC}"
  echo "$ENV_FILES"
  FAIL=1
fi

# ── 2. Block private key material ─────────────────────────────────────────
PRIVATE_KEY=$(git diff --cached -U0 | grep -E '^\+.*-----BEGIN (RSA|EC|OPENSSH|DSA|PGP) PRIVATE KEY' || true)
if [ -n "$PRIVATE_KEY" ]; then
  echo -e "${RED}[BLOCKED] Private key material detected in diff.${NC}"
  FAIL=1
fi

# ── 3. Warn on AWS key patterns ───────────────────────────────────────────
AWS_KEY=$(git diff --cached -U0 | grep -oE '^\+.*AKIA[0-9A-Z]{16}' || true)
if [ -n "$AWS_KEY" ]; then
  echo -e "${RED}[BLOCKED] AWS Access Key ID pattern detected.${NC}"
  FAIL=1
fi

# ── 4. Warn on high-entropy strings that look like tokens ─────────────────
# (crude heuristic: 40+ char alphanum/+/= strings after = or :)
LONG_SECRETS=$(git diff --cached -U0 | grep -oE '^\+.*(password|token|secret|key|api_key)\s*[:=]\s*[A-Za-z0-9/+=]{32,}' \
  | grep -v 'example\|placeholder\|your_\|CHANGE_ME\|xxxx\|XXXX' || true)
if [ -n "$LONG_SECRETS" ]; then
  echo -e "${YELLOW}[WARNING] Possible secret value detected:${NC}"
  echo "$LONG_SECRETS"
  echo -e "${YELLOW}Review carefully. If intentional, commit with: git commit --no-verify${NC}"
  # Warn only, don't hard-block — user may have a valid reason
fi

if [ $FAIL -eq 1 ]; then
  echo ""
  echo -e "${RED}Commit blocked. Fix the issues above before committing.${NC}"
  echo "To bypass (dangerous): git commit --no-verify"
  exit 1
fi

exit 0
