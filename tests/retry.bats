#!/usr/bin/env bats
# ABOUTME: Tests for scripts/lib/retry.sh
# ABOUTME: Validates is_retryable_status, is_timeout_error, and curl_with_retry

load test_helper

setup() {
    source "${LIB_DIR}/retry.sh"
    MOCK_BIN="$(mktemp -d)"
    # Keep retries low and delay zero so tests don't stall
    export COUNCIL_MAX_RETRIES=2
    export COUNCIL_RETRY_DELAY=0
    export COUNCIL_TIMEOUT=5
}

teardown() {
    rm -rf "${MOCK_BIN:-}"
}

# Write a simple mock curl into MOCK_BIN and prepend it to PATH.
# The mock writes MOCK_CURL_BODY to the -o file and outputs MOCK_CURL_HTTP to
# stdout (simulating curl's -w "%{http_code}"). Exits MOCK_CURL_EXIT (default 0).
_setup_mock_curl() {
    cat > "${MOCK_BIN}/curl" <<'EOF'
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
EOF
    chmod +x "${MOCK_BIN}/curl"
    export PATH="${MOCK_BIN}:${PATH}"
}

# Write a counting mock curl that returns MOCK_CURL_HTTP_1 on the first N-1
# calls and MOCK_CURL_HTTP_2 on the Nth call onward, writing corresponding
# body variants.
_setup_counting_curl() {
    local switch_on="${1:-2}"
    local http1="${2:-429}"
    local body1="${3:-rate limited}"
    local http2="${4:-200}"
    local body2="${5:-success}"
    local counter_file="${MOCK_BIN}/count"
    printf '0' > "$counter_file"

    cat > "${MOCK_BIN}/curl" <<EOF
#!/bin/bash
count=\$(cat "${counter_file}")
count=\$((count + 1))
printf '%s' "\$count" > "${counter_file}"
output_file=""
args=("\$@")
for ((i=0; i<\${#args[@]}; i++)); do
    if [[ "\${args[\$i]}" == "-o" ]]; then
        output_file="\${args[\$((i+1))]}"
        break
    fi
done
if [[ \$count -lt ${switch_on} ]]; then
    [[ -n "\$output_file" ]] && printf '%s' "${body1}" > "\$output_file"
    printf '%s' "${http1}"
    exit 0
else
    [[ -n "\$output_file" ]] && printf '%s' "${body2}" > "\$output_file"
    printf '%s' "${http2}"
    exit 0
fi
EOF
    chmod +x "${MOCK_BIN}/curl"
    export PATH="${MOCK_BIN}:${PATH}"
}

# ============================================================================
# is_retryable_status
# ============================================================================

@test "is_retryable_status: 429 is retryable (rate limit)" {
    run is_retryable_status 429
    [ "$status" -eq 0 ]
}

@test "is_retryable_status: 500 is retryable (internal server error)" {
    run is_retryable_status 500
    [ "$status" -eq 0 ]
}

@test "is_retryable_status: 502 is retryable (bad gateway)" {
    run is_retryable_status 502
    [ "$status" -eq 0 ]
}

@test "is_retryable_status: 503 is retryable (service unavailable)" {
    run is_retryable_status 503
    [ "$status" -eq 0 ]
}

@test "is_retryable_status: 504 is retryable (gateway timeout)" {
    run is_retryable_status 504
    [ "$status" -eq 0 ]
}

@test "is_retryable_status: 200 is not retryable" {
    run is_retryable_status 200
    [ "$status" -ne 0 ]
}

@test "is_retryable_status: 400 is not retryable (bad request)" {
    run is_retryable_status 400
    [ "$status" -ne 0 ]
}

@test "is_retryable_status: 401 is not retryable (unauthorized)" {
    run is_retryable_status 401
    [ "$status" -ne 0 ]
}

@test "is_retryable_status: 404 is not retryable (not found)" {
    run is_retryable_status 404
    [ "$status" -ne 0 ]
}

@test "is_retryable_status: 201 is not retryable (created)" {
    run is_retryable_status 201
    [ "$status" -ne 0 ]
}

# ============================================================================
# is_timeout_error
# ============================================================================

@test "is_timeout_error: exit code 28 is a timeout (curl --max-time exceeded)" {
    run is_timeout_error 28
    [ "$status" -eq 0 ]
}

@test "is_timeout_error: exit code 0 is not a timeout" {
    run is_timeout_error 0
    [ "$status" -ne 0 ]
}

@test "is_timeout_error: exit code 6 is not a timeout (DNS failure)" {
    run is_timeout_error 6
    [ "$status" -ne 0 ]
}

@test "is_timeout_error: exit code 7 is not a timeout (connection refused)" {
    run is_timeout_error 7
    [ "$status" -ne 0 ]
}

@test "is_timeout_error: exit code 1 is not a timeout" {
    run is_timeout_error 1
    [ "$status" -ne 0 ]
}

# ============================================================================
# curl_with_retry — success path
# ============================================================================

@test "curl_with_retry: returns response body on HTTP 200" {
    _setup_mock_curl
    export MOCK_CURL_HTTP=200
    export MOCK_CURL_BODY='{"result":"ok"}'

    run curl_with_retry -s https://example.com
    [ "$status" -eq 0 ]
    [ "$output" = '{"result":"ok"}' ]
}

@test "curl_with_retry: returns empty body on HTTP 200 with no body" {
    _setup_mock_curl
    export MOCK_CURL_HTTP=200
    export MOCK_CURL_BODY=''

    run curl_with_retry -s https://example.com
    [ "$status" -eq 0 ]
    [ "$output" = '' ]
}

# ============================================================================
# curl_with_retry — timeout handling
# ============================================================================

@test "curl_with_retry: returns timeout JSON when curl exits 28" {
    _setup_mock_curl
    export MOCK_CURL_EXIT=28
    export MOCK_CURL_HTTP=000

    run curl_with_retry -s https://example.com
    [ "$status" -eq 28 ]
    [[ "$output" == *"timed out"* ]]
}

@test "curl_with_retry: timeout JSON contains the configured timeout value" {
    _setup_mock_curl
    export MOCK_CURL_EXIT=28
    export COUNCIL_TIMEOUT=42

    run curl_with_retry -s https://example.com
    [ "$status" -eq 28 ]
    [[ "$output" == *"42"* ]]
}

# ============================================================================
# curl_with_retry — retry on retryable HTTP codes
# ============================================================================

@test "curl_with_retry: retries on HTTP 429 and returns subsequent success" {
    _setup_counting_curl 2 429 "rate limited" 200 "success"

    run curl_with_retry -s https://example.com
    [ "$status" -eq 0 ]
    [ "$output" = "success" ]
    local count
    count=$(cat "${MOCK_BIN}/count")
    [ "$count" -ge 2 ]
}

@test "curl_with_retry: retries on HTTP 500 and returns subsequent success" {
    _setup_counting_curl 2 500 "server error" 200 "recovered"

    run curl_with_retry -s https://example.com
    [ "$status" -eq 0 ]
    [ "$output" = "recovered" ]
}

@test "curl_with_retry: exhausts max retries on persistent HTTP 500 and returns last response" {
    _setup_mock_curl
    export MOCK_CURL_HTTP=500
    export MOCK_CURL_BODY="always failing"
    export COUNCIL_MAX_RETRIES=2

    run curl_with_retry -s https://example.com
    [ "$status" -eq 0 ]
    [ "$output" = "always failing" ]
}

# ============================================================================
# curl_with_retry — no retry on non-retryable HTTP codes
# ============================================================================

@test "curl_with_retry: does not retry on HTTP 401" {
    local counter_file="${MOCK_BIN}/count"
    printf '0' > "$counter_file"
    cat > "${MOCK_BIN}/curl" <<EOF
#!/bin/bash
count=\$(cat "${counter_file}")
count=\$((count+1))
printf '%s' "\$count" > "${counter_file}"
output_file=""
args=("\$@")
for ((i=0; i<\${#args[@]}; i++)); do
    [[ "\${args[\$i]}" == "-o" ]] && output_file="\${args[\$((i+1))]}"
done
[[ -n "\$output_file" ]] && printf 'unauthorized' > "\$output_file"
printf '401'
exit 0
EOF
    chmod +x "${MOCK_BIN}/curl"
    export PATH="${MOCK_BIN}:${PATH}"

    run curl_with_retry -s https://example.com
    [ "$status" -eq 0 ]
    local count
    count=$(cat "${counter_file}")
    [ "$count" -eq 1 ]
}

@test "curl_with_retry: does not retry on HTTP 400" {
    local counter_file="${MOCK_BIN}/count"
    printf '0' > "$counter_file"
    cat > "${MOCK_BIN}/curl" <<EOF
#!/bin/bash
count=\$(cat "${counter_file}")
count=\$((count+1))
printf '%s' "\$count" > "${counter_file}"
output_file=""
args=("\$@")
for ((i=0; i<\${#args[@]}; i++)); do
    [[ "\${args[\$i]}" == "-o" ]] && output_file="\${args[\$((i+1))]}"
done
[[ -n "\$output_file" ]] && printf 'bad request' > "\$output_file"
printf '400'
exit 0
EOF
    chmod +x "${MOCK_BIN}/curl"
    export PATH="${MOCK_BIN}:${PATH}"

    run curl_with_retry -s https://example.com
    [ "$status" -eq 0 ]
    local count
    count=$(cat "${counter_file}")
    [ "$count" -eq 1 ]
}

# ============================================================================
# curl_with_retry — retry on curl network errors (non-28 exit codes)
# ============================================================================

@test "curl_with_retry: retries on curl network error (exit 7) and returns success" {
    local counter_file="${MOCK_BIN}/count"
    printf '0' > "$counter_file"
    cat > "${MOCK_BIN}/curl" <<EOF
#!/bin/bash
count=\$(cat "${counter_file}")
count=\$((count+1))
printf '%s' "\$count" > "${counter_file}"
output_file=""
args=("\$@")
for ((i=0; i<\${#args[@]}; i++)); do
    [[ "\${args[\$i]}" == "-o" ]] && output_file="\${args[\$((i+1))]}"
done
if [[ \$count -lt 2 ]]; then
    exit 7
else
    [[ -n "\$output_file" ]] && printf 'recovered' > "\$output_file"
    printf '200'
    exit 0
fi
EOF
    chmod +x "${MOCK_BIN}/curl"
    export PATH="${MOCK_BIN}:${PATH}"

    run curl_with_retry -s https://example.com
    [ "$status" -eq 0 ]
    [ "$output" = "recovered" ]
}

@test "curl_with_retry: returns curl exit code after exhausting retries on network error" {
    _setup_mock_curl
    export MOCK_CURL_EXIT=7
    export MOCK_CURL_HTTP=000
    export COUNCIL_MAX_RETRIES=2

    run curl_with_retry -s https://example.com
    [ "$status" -eq 7 ]
}
