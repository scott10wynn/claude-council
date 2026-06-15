#!/usr/bin/env bats
# ABOUTME: Tests for scripts/check-status.sh
# ABOUTME: Validates provider status detection, formatting, and availability summary

load test_helper

SCRIPT="${SCRIPTS_DIR}/check-status.sh"

setup() {
    MOCK_BIN="$(mktemp -d)"
    # Clear all API keys and CLI aliases so each test starts from a known state
    unset GEMINI_API_KEY OPENAI_API_KEY GROK_API_KEY XAI_API_KEY PERPLEXITY_API_KEY
    unset GEMINI_MODEL OPENAI_MODEL GROK_MODEL PERPLEXITY_MODEL
}

teardown() {
    rm -rf "${MOCK_BIN:-}"
}

# Create a mock curl that always returns a fixed HTTP code (MOCK_CURL_HTTP).
# check-status.sh uses its own curl calls (not curl_with_retry), so only
# the HTTP code output matters here.
_setup_mock_curl() {
    local http_code="${1:-200}"
    local exit_code="${2:-0}"
    cat > "${MOCK_BIN}/curl" <<EOF
#!/bin/bash
printf '%s' "${http_code}"
exit ${exit_code}
EOF
    chmod +x "${MOCK_BIN}/curl"
    export PATH="${MOCK_BIN}:${PATH}"
}

# Create a fake CLI binary (codex or gemini) that prints a version string.
_setup_mock_binary() {
    local name="$1"
    local version="${2:-1.0.0}"
    cat > "${MOCK_BIN}/${name}" <<EOF
#!/bin/bash
if [[ "\$1" == "--version" ]]; then
    printf '%s version %s\n' "${name}" "${version}"
    exit 0
fi
exit 0
EOF
    chmod +x "${MOCK_BIN}/${name}"
    export PATH="${MOCK_BIN}:${PATH}"
}

# ============================================================================
# No API keys configured
# ============================================================================

@test "check-status: shows 'API key not set' for gemini when key is absent" {
    _setup_mock_curl 200
    run bash "$SCRIPT"
    [ "$status" -eq 0 ]
    [[ "$output" == *"API key not set"* ]]
}

@test "check-status: shows 'API key not set' for all four API providers when no keys set" {
    _setup_mock_curl 200
    run bash "$SCRIPT"
    [ "$status" -eq 0 ]
    # Should mention "API key not set" multiple times (once per keyless provider)
    local count
    count=$(echo "$output" | grep -c "API key not set" || true)
    [ "$count" -ge 4 ]
}

@test "check-status: shows '0/6 providers available' when no keys and no CLIs" {
    # Strip any real CLI binaries from PATH
    export PATH="${MOCK_BIN}:/usr/bin:/bin"
    _setup_mock_curl 200
    run bash "$SCRIPT"
    [ "$status" -eq 0 ]
    [[ "$output" == *"0/6 providers available"* ]]
}

# ============================================================================
# CLI provider detection
# ============================================================================

@test "check-status: shows 'CLI not installed' for codex when binary is absent" {
    export PATH="${MOCK_BIN}:/usr/bin:/bin"
    _setup_mock_curl 200
    run bash "$SCRIPT"
    [ "$status" -eq 0 ]
    [[ "$output" == *"CLI not installed"* ]]
}

@test "check-status: shows 'Connected' for codex when binary is present" {
    export PATH="${MOCK_BIN}:/usr/bin:/bin"
    _setup_mock_binary "codex" "1.2.3"
    run bash "$SCRIPT"
    [ "$status" -eq 0 ]
    # codex CLI connected should bump available count
    [[ "$output" == *"1/6 providers available"* ]]
}

@test "check-status: shows 'Connected' for gemini-cli when gemini binary is present" {
    export PATH="${MOCK_BIN}:/usr/bin:/bin"
    _setup_mock_binary "gemini" "2.0.0"
    run bash "$SCRIPT"
    [ "$status" -eq 0 ]
    [[ "$output" == *"1/6 providers available"* ]]
}

# ============================================================================
# API provider HTTP responses
# ============================================================================

@test "check-status: shows 'Connected' for gemini when API returns 200" {
    _setup_mock_curl 200
    export GEMINI_API_KEY="test-key"
    run bash "$SCRIPT"
    [ "$status" -eq 0 ]
    [[ "$output" == *"Connected"* ]]
}

@test "check-status: shows 'Auth failed' when API returns 401" {
    _setup_mock_curl 401
    export GEMINI_API_KEY="test-key"
    run bash "$SCRIPT"
    [ "$status" -eq 0 ]
    [[ "$output" == *"Auth failed"* ]]
}

@test "check-status: shows 'Auth failed' when API returns 403" {
    _setup_mock_curl 403
    export GEMINI_API_KEY="test-key"
    run bash "$SCRIPT"
    [ "$status" -eq 0 ]
    [[ "$output" == *"Auth failed"* ]]
}

@test "check-status: shows 'Connection timeout' on network failure" {
    # curl exits 1 with no stdout; check-status.sh's '|| echo 000' sets http_code=000
    cat > "${MOCK_BIN}/curl" <<'EOF'
#!/bin/bash
exit 1
EOF
    chmod +x "${MOCK_BIN}/curl"
    export PATH="${MOCK_BIN}:${PATH}"
    export GEMINI_API_KEY="test-key"
    run bash "$SCRIPT"
    [ "$status" -eq 0 ]
    [[ "$output" == *"Connection timeout"* ]]
}

@test "check-status: shows 'Error' with HTTP code for unexpected status" {
    _setup_mock_curl 503
    export GEMINI_API_KEY="test-key"
    run bash "$SCRIPT"
    [ "$status" -eq 0 ]
    [[ "$output" == *"503"* ]]
}

# ============================================================================
# Summary count
# ============================================================================

@test "check-status: summary count increments for each connected API provider" {
    _setup_mock_curl 200
    export GEMINI_API_KEY="test-key"
    export OPENAI_API_KEY="test-key"
    export PATH="${MOCK_BIN}:/usr/bin:/bin"
    run bash "$SCRIPT"
    [ "$status" -eq 0 ]
    [[ "$output" == *"2/6 providers available"* ]]
}

@test "check-status: exits 0 regardless of provider availability" {
    export PATH="${MOCK_BIN}:/usr/bin:/bin"
    run bash "$SCRIPT"
    [ "$status" -eq 0 ]
}
