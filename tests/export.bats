#!/usr/bin/env bats
# ABOUTME: Tests for scripts/lib/export.sh
# ABOUTME: Validates strip_ansi and write_export

load test_helper

setup() {
    source "${LIB_DIR}/export.sh"
    EXPORT_TMP="$(mktemp -d)"
}

teardown() {
    rm -rf "${EXPORT_TMP:-}"
}

# ============================================================================
# strip_ansi
# ============================================================================

@test "strip_ansi: strips basic foreground color code" {
    local result
    result=$(printf '\e[31mred text\e[0m' | strip_ansi)
    [ "$result" = "red text" ]
}

@test "strip_ansi: strips bold code" {
    local result
    result=$(printf '\e[1mbold\e[0m' | strip_ansi)
    [ "$result" = "bold" ]
}

@test "strip_ansi: strips dim/faint code" {
    local result
    result=$(printf '\e[2mdim\e[0m' | strip_ansi)
    [ "$result" = "dim" ]
}

@test "strip_ansi: strips combined style+color code (e.g. 1;32)" {
    local result
    result=$(printf '\e[1;32mbold green\e[0m' | strip_ansi)
    [ "$result" = "bold green" ]
}

@test "strip_ansi: strips background color code" {
    local result
    result=$(printf '\e[44mblue bg\e[0m' | strip_ansi)
    [ "$result" = "blue bg" ]
}

@test "strip_ansi: strips cursor movement codes" {
    local result
    result=$(printf '\e[2J\e[Htext' | strip_ansi)
    [ "$result" = "text" ]
}

@test "strip_ansi: leaves plain text unchanged" {
    local result
    result=$(printf 'plain text' | strip_ansi)
    [ "$result" = "plain text" ]
}

@test "strip_ansi: leaves regular brackets unchanged" {
    local result
    result=$(printf 'a [bracket] b' | strip_ansi)
    [ "$result" = "a [bracket] b" ]
}

@test "strip_ansi: handles multiline input" {
    local result
    result=$(printf '\e[31mline one\e[0m\nline two' | strip_ansi)
    [ "$result" = "$(printf 'line one\nline two')" ]
}

@test "strip_ansi: handles empty input" {
    local result
    result=$(printf '' | strip_ansi)
    [ "$result" = "" ]
}

# ============================================================================
# write_export
# ============================================================================

@test "write_export: creates file at specified path" {
    local out="${EXPORT_TMP}/out.md"
    printf 'content' | write_export "$out" "my prompt" "gemini openai"
    [ -f "$out" ]
}

@test "write_export: output contains Council Response header" {
    local out="${EXPORT_TMP}/out.md"
    printf 'content' | write_export "$out" "my prompt" "gemini"
    grep -q "# Council Response" "$out"
}

@test "write_export: output contains the prompt" {
    local out="${EXPORT_TMP}/out.md"
    printf 'content' | write_export "$out" "what is the answer?" "gemini"
    grep -q "what is the answer?" "$out"
}

@test "write_export: output contains the providers list" {
    local out="${EXPORT_TMP}/out.md"
    printf 'content' | write_export "$out" "prompt" "gemini openai grok"
    grep -q "gemini openai grok" "$out"
}

@test "write_export: output contains a date line" {
    local out="${EXPORT_TMP}/out.md"
    local year
    year=$(date '+%Y')
    printf 'content' | write_export "$out" "prompt" "gemini"
    grep -q "$year" "$out"
}

@test "write_export: strips ANSI codes from stdin content" {
    local out="${EXPORT_TMP}/out.md"
    printf '\e[31mcolored content\e[0m' | write_export "$out" "prompt" "gemini"
    grep -q "colored content" "$out"
    # Raw escape sequences should not appear
    ! grep -qP '\e\[' "$out"
}

@test "write_export: creates parent directories when they do not exist" {
    local out="${EXPORT_TMP}/nested/deep/out.md"
    printf 'content' | write_export "$out" "prompt" "gemini"
    [ -f "$out" ]
}

@test "write_export: returns the output file path" {
    local out="${EXPORT_TMP}/result.md"
    local returned
    returned=$(printf 'content' | write_export "$out" "prompt" "gemini")
    [ "$returned" = "$out" ]
}

@test "write_export: plain content appears in output after the separator" {
    local out="${EXPORT_TMP}/out.md"
    printf 'hello world' | write_export "$out" "prompt" "gemini"
    grep -q "hello world" "$out"
}

# ============================================================================
# Direct invocation (--strip and --write flags)
# ============================================================================

@test "direct --strip: strips ANSI from stdin" {
    local result
    result=$(printf '\e[32mgreen\e[0m' | bash "${LIB_DIR}/export.sh" --strip)
    [ "$result" = "green" ]
}

@test "direct --write: writes file and returns path" {
    local out="${EXPORT_TMP}/direct.md"
    local returned
    returned=$(printf 'body' | bash "${LIB_DIR}/export.sh" --write "$out" "test prompt" "openai")
    [ "$returned" = "$out" ]
    [ -f "$out" ]
}

@test "direct invocation with no args: exits non-zero and shows usage" {
    run bash "${LIB_DIR}/export.sh"
    [ "$status" -ne 0 ]
    [[ "$output" == *"Usage"* ]]
}
