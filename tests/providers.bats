#!/usr/bin/env bats
# ABOUTME: Tests for scripts/providers/{gemini,openai,grok,perplexity}.sh
# ABOUTME: Validates argument/key validation and response extraction per provider

load test_helper

PROVIDERS_DIR="${SCRIPTS_DIR}/providers"

setup() {
    mkdir -p "$TEST_CACHE_DIR"
    MOCK_BIN="$(mktemp -d)"
    # Required by all provider scripts (used in SYSTEM prompt construction)
    export BASE_SYSTEM_PROMPT="You are a helpful assistant."
    # Suppress the tmux streaming pane across all provider runs
    export COUNCIL_NO_PANE=1
    # Unset all keys so each test starts clean
    unset GEMINI_API_KEY OPENAI_API_KEY GROK_API_KEY XAI_API_KEY PERPLEXITY_API_KEY
}

teardown() {
    rm -rf "${MOCK_BIN:-}"
}

# Create a generic mock curl in MOCK_BIN:
#   MOCK_CURL_HTTP  — HTTP code written to stdout  (default 200)
#   MOCK_CURL_BODY  — response body written to -o  (default "")
#   MOCK_CURL_EXIT  — process exit code            (default 0)
_setup_mock_curl() {
    cat > "${MOCK_BIN}/curl" <<'CURL_EOF'
#!/bin/bash
output_file=""
args=("$@")
for ((i=0; i<${#args[@]}; i++)); do
    if [[ "${args[$i]}" == "-o" ]]; then
        output_file="${args[$((i+1))]}"
        break
    fi
done
[[ -n "$output_file" ]] && printf '%s' "${MOCK_CURL_BODY:-}" > "$output_file"
printf '%s' "${MOCK_CURL_HTTP:-200}"
exit "${MOCK_CURL_EXIT:-0}"
CURL_EOF
    chmod +x "${MOCK_BIN}/curl"
    export PATH="${MOCK_BIN}:${PATH}"
}

# ============================================================================
# Gemini
# ============================================================================

@test "gemini: exits 1 and prints error when no prompt provided" {
    run bash "${PROVIDERS_DIR}/gemini.sh"
    [ "$status" -eq 1 ]
    [[ "$output" == *"No prompt"* ]]
}

@test "gemini: exits 1 and prints error when GEMINI_API_KEY not set" {
    run bash "${PROVIDERS_DIR}/gemini.sh" "test prompt"
    [ "$status" -eq 1 ]
    [[ "$output" == *"GEMINI_API_KEY"* ]]
}

@test "gemini: outputs extracted text on successful API response" {
    _setup_mock_curl
    export GEMINI_API_KEY="test-key"
    export MOCK_CURL_HTTP=200
    export MOCK_CURL_BODY='{"candidates":[{"content":{"parts":[{"text":"hello from gemini"}]}}]}'

    run bash "${PROVIDERS_DIR}/gemini.sh" "test prompt"
    [ "$status" -eq 0 ]
    [ "$output" = "hello from gemini" ]
}

@test "gemini: exits 1 when API returns empty candidates" {
    _setup_mock_curl
    export GEMINI_API_KEY="test-key"
    export MOCK_CURL_HTTP=200
    export MOCK_CURL_BODY='{"candidates":[]}'

    run bash "${PROVIDERS_DIR}/gemini.sh" "test prompt"
    [ "$status" -eq 1 ]
    [[ "$output" == *"Error from Gemini"* ]]
}

@test "gemini: exits 1 and prints API error message on error response" {
    _setup_mock_curl
    export GEMINI_API_KEY="test-key"
    export MOCK_CURL_HTTP=200
    export MOCK_CURL_BODY='{"error":{"message":"quota exceeded"}}'

    run bash "${PROVIDERS_DIR}/gemini.sh" "test prompt"
    [ "$status" -eq 1 ]
    [[ "$output" == *"quota exceeded"* ]]
}

# ============================================================================
# OpenAI
# ============================================================================

@test "openai: exits 1 and prints error when no prompt provided" {
    run bash "${PROVIDERS_DIR}/openai.sh"
    [ "$status" -eq 1 ]
    [[ "$output" == *"No prompt"* ]]
}

@test "openai: exits 1 and prints error when OPENAI_API_KEY not set" {
    run bash "${PROVIDERS_DIR}/openai.sh" "test prompt"
    [ "$status" -eq 1 ]
    [[ "$output" == *"OPENAI_API_KEY"* ]]
}

@test "openai: outputs text from chat/completions response for standard model" {
    _setup_mock_curl
    export OPENAI_API_KEY="test-key"
    export OPENAI_MODEL="gpt-4o"
    export MOCK_CURL_HTTP=200
    export MOCK_CURL_BODY='{"choices":[{"message":{"content":"hello from openai"}}]}'

    run bash "${PROVIDERS_DIR}/openai.sh" "test prompt"
    [ "$status" -eq 0 ]
    [ "$output" = "hello from openai" ]
}

@test "openai: outputs text from v1/responses for reasoning model (o3)" {
    _setup_mock_curl
    export OPENAI_API_KEY="test-key"
    export OPENAI_MODEL="o3-mini"
    export MOCK_CURL_HTTP=200
    export MOCK_CURL_BODY='{"output":[{"type":"message","content":[{"text":"reasoning answer"}]}]}'

    run bash "${PROVIDERS_DIR}/openai.sh" "test prompt"
    [ "$status" -eq 0 ]
    [ "$output" = "reasoning answer" ]
}

@test "openai: outputs text from v1/responses for reasoning model (o4)" {
    _setup_mock_curl
    export OPENAI_API_KEY="test-key"
    export OPENAI_MODEL="o4-mini"
    export MOCK_CURL_HTTP=200
    export MOCK_CURL_BODY='{"output":[{"type":"message","content":[{"text":"o4 answer"}]}]}'

    run bash "${PROVIDERS_DIR}/openai.sh" "test prompt"
    [ "$status" -eq 0 ]
    [ "$output" = "o4 answer" ]
}

@test "openai: outputs text from v1/responses for gpt-5.5+ model" {
    _setup_mock_curl
    export OPENAI_API_KEY="test-key"
    export OPENAI_MODEL="gpt-5.5-pro"
    export MOCK_CURL_HTTP=200
    export MOCK_CURL_BODY='{"output":[{"type":"message","content":[{"text":"gpt5 answer"}]}]}'

    run bash "${PROVIDERS_DIR}/openai.sh" "test prompt"
    [ "$status" -eq 0 ]
    [ "$output" = "gpt5 answer" ]
}

@test "openai: exits 1 when API returns empty content" {
    _setup_mock_curl
    export OPENAI_API_KEY="test-key"
    export OPENAI_MODEL="gpt-4o"
    export MOCK_CURL_HTTP=200
    export MOCK_CURL_BODY='{"choices":[{"message":{"content":null}}]}'

    run bash "${PROVIDERS_DIR}/openai.sh" "test prompt"
    [ "$status" -eq 1 ]
}

@test "openai: exits 1 and prints API error message on error response" {
    _setup_mock_curl
    export OPENAI_API_KEY="test-key"
    export OPENAI_MODEL="gpt-4o"
    export MOCK_CURL_HTTP=200
    export MOCK_CURL_BODY='{"error":{"message":"model not found"}}'

    run bash "${PROVIDERS_DIR}/openai.sh" "test prompt"
    [ "$status" -eq 1 ]
    [[ "$output" == *"model not found"* ]]
}

# ============================================================================
# Grok
# ============================================================================

@test "grok: exits 1 and prints error when no prompt provided" {
    run bash "${PROVIDERS_DIR}/grok.sh"
    [ "$status" -eq 1 ]
    [[ "$output" == *"No prompt"* ]]
}

@test "grok: exits 1 and prints error when no API key set" {
    run bash "${PROVIDERS_DIR}/grok.sh" "test prompt"
    [ "$status" -eq 1 ]
    [[ "$output" == *"XAI_API_KEY"* ]]
}

@test "grok: outputs extracted text on successful API response" {
    _setup_mock_curl
    export GROK_API_KEY="test-key"
    export MOCK_CURL_HTTP=200
    export MOCK_CURL_BODY='{"choices":[{"message":{"content":"hello from grok"}}]}'

    run bash "${PROVIDERS_DIR}/grok.sh" "test prompt"
    [ "$status" -eq 0 ]
    [ "$output" = "hello from grok" ]
}

@test "grok: accepts XAI_API_KEY as an alias for GROK_API_KEY" {
    _setup_mock_curl
    export XAI_API_KEY="test-key-via-xai"
    export MOCK_CURL_HTTP=200
    export MOCK_CURL_BODY='{"choices":[{"message":{"content":"xai alias works"}}]}'

    run bash "${PROVIDERS_DIR}/grok.sh" "test prompt"
    [ "$status" -eq 0 ]
    [ "$output" = "xai alias works" ]
}

@test "grok: exits 1 when API returns empty content" {
    _setup_mock_curl
    export GROK_API_KEY="test-key"
    export MOCK_CURL_HTTP=200
    export MOCK_CURL_BODY='{"choices":[{"message":{"content":null}}]}'

    run bash "${PROVIDERS_DIR}/grok.sh" "test prompt"
    [ "$status" -eq 1 ]
    [[ "$output" == *"Error from Grok"* ]]
}

# ============================================================================
# Perplexity
# ============================================================================

@test "perplexity: exits 1 and prints error when no prompt provided" {
    run bash "${PROVIDERS_DIR}/perplexity.sh"
    [ "$status" -eq 1 ]
    [[ "$output" == *"No prompt"* ]]
}

@test "perplexity: exits 1 and prints error when PERPLEXITY_API_KEY not set" {
    run bash "${PROVIDERS_DIR}/perplexity.sh" "test prompt"
    [ "$status" -eq 1 ]
    [[ "$output" == *"PERPLEXITY_API_KEY"* ]]
}

@test "perplexity: outputs extracted text on successful API response" {
    _setup_mock_curl
    export PERPLEXITY_API_KEY="test-key"
    export MOCK_CURL_HTTP=200
    export MOCK_CURL_BODY='{"choices":[{"message":{"content":"hello from perplexity"}}]}'

    run bash "${PROVIDERS_DIR}/perplexity.sh" "test prompt"
    [ "$status" -eq 0 ]
    [ "$output" = "hello from perplexity" ]
}

@test "perplexity: exits 1 when API returns empty content" {
    _setup_mock_curl
    export PERPLEXITY_API_KEY="test-key"
    export MOCK_CURL_HTTP=200
    export MOCK_CURL_BODY='{"choices":[{"message":{"content":null}}]}'

    run bash "${PROVIDERS_DIR}/perplexity.sh" "test prompt"
    [ "$status" -eq 1 ]
    [[ "$output" == *"Error from Perplexity"* ]]
}

@test "perplexity: exits 1 and prints API error message on error response" {
    _setup_mock_curl
    export PERPLEXITY_API_KEY="test-key"
    export MOCK_CURL_HTTP=200
    export MOCK_CURL_BODY='{"error":{"message":"invalid key"}}'

    run bash "${PROVIDERS_DIR}/perplexity.sh" "test prompt"
    [ "$status" -eq 1 ]
    [[ "$output" == *"invalid key"* ]]
}

@test "perplexity: succeeds with PERPLEXITY_RECENCY filter set" {
    _setup_mock_curl
    export PERPLEXITY_API_KEY="test-key"
    export PERPLEXITY_RECENCY="week"
    export MOCK_CURL_HTTP=200
    export MOCK_CURL_BODY='{"choices":[{"message":{"content":"recent news"}}]}'

    run bash "${PROVIDERS_DIR}/perplexity.sh" "latest news"
    [ "$status" -eq 0 ]
    [ "$output" = "recent news" ]
}
