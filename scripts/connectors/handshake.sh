#!/bin/bash
# ABOUTME: Fetches Handshake student profile data and outputs a formatted summary
# ABOUTME: Supports session token (API), profile JSON/CSV file, or manual data

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../lib/retry.sh"

CACHE_DIR="${COUNCIL_CACHE_DIR:-.claude/council-cache}"
CACHE_FILE="$CACHE_DIR/handshake-profile.txt"
CACHE_TTL="${COUNCIL_CACHE_TTL:-3600}"

BASE_URL="${HANDSHAKE_BASE_URL:-https://app.joinhandshake.com}"

cache_is_fresh() {
    [[ -f "$CACHE_FILE" ]] || return 1
    local now age mtime
    now=$(date +%s)
    mtime=$(stat -c %Y "$CACHE_FILE" 2>/dev/null || stat -f %m "$CACHE_FILE" 2>/dev/null)
    age=$(( now - mtime ))
    [[ $age -lt $CACHE_TTL ]]
}

output_profile() {
    local text="$1"
    mkdir -p "$CACHE_DIR"
    echo "$text" > "$CACHE_FILE"
    echo "$text"
}

# ── Session-token mode (HANDSHAKE_SESSION_TOKEN) ─────────────────────────────
# Uses the Handshake internal API authenticated via the session cookie.
# Token = the value of the "_hs_session" cookie from an active browser session.

fetch_via_session() {
    local token="$1"
    local cookie="_hs_session=$token"

    # Student profile
    local resp
    resp=$(curl_with_retry -s \
        -H "Accept: application/json" \
        -H "Cookie: $cookie" \
        -H "X-Requested-With: XMLHttpRequest" \
        "$BASE_URL/api/v1/students/me")

    local err
    err=$(echo "$resp" | jq -r '.error // .message // empty' 2>/dev/null || true)
    if [[ -n "$err" ]]; then
        echo "Error: Handshake API: $err" >&2
        return 1
    fi

    local student
    student=$(echo "$resp" | jq -r '.student // .')

    local name school major grad_year
    local first last
    first=$(echo "$student" | jq -r '.first_name // ""')
    last=$(echo "$student" | jq -r '.last_name // ""')
    name="$first $last"
    school=$(echo "$student" | jq -r '.school.name // ""')
    major=$(echo "$student" | jq -r '.major // (.majors[0] // "")')
    grad_year=$(echo "$student" | jq -r '.graduation_year // ""')

    local summary="Handshake Profile"
    [[ -n "$name"      ]] && summary+=$'\n'"Name: $name"
    [[ -n "$school"    ]] && summary+=$'\n'"School: $school"
    [[ -n "$major"     ]] && summary+=$'\n'"Major: $major"
    [[ -n "$grad_year" ]] && summary+=$'\n'"Graduation Year: $grad_year"

    # Work experience
    local exp_count
    exp_count=$(echo "$student" | jq '.work_experiences | length' 2>/dev/null || echo 0)
    if [[ "$exp_count" -gt 0 ]]; then
        summary+=$'\n\n'"Work Experience:"
        while IFS= read -r exp; do
            local title org start end
            title=$(echo "$exp" | jq -r '.position // ""')
            org=$(echo "$exp" | jq -r '.organization // ""')
            start=$(echo "$exp" | jq -r '.start_date // ""')
            end=$(echo "$exp" | jq -r '.end_date // "Present"')
            summary+=$'\n'"  - $title at $org ($start – $end)"
        done < <(echo "$student" | jq -c '.work_experiences[]?')
    fi

    # Education
    local edu_count
    edu_count=$(echo "$student" | jq '.education_experiences | length' 2>/dev/null || echo 0)
    if [[ "$edu_count" -gt 0 ]]; then
        summary+=$'\n\n'"Education:"
        while IFS= read -r edu; do
            local school_name degree field grad
            school_name=$(echo "$edu" | jq -r '.school_name // ""')
            degree=$(echo "$edu" | jq -r '.degree // ""')
            field=$(echo "$edu" | jq -r '.field_of_study // ""')
            grad=$(echo "$edu" | jq -r '.graduation_date // ""')
            local line="  - $school_name"
            [[ -n "$degree" ]] && line+=" — $degree"
            [[ -n "$field"  ]] && line+=" in $field"
            [[ -n "$grad"   ]] && line+=" ($grad)"
            summary+=$'\n'"$line"
        done < <(echo "$student" | jq -c '.education_experiences[]?')
    fi

    # Skills / interests
    local skills
    skills=$(echo "$student" | jq -r '[.skills[]?.name] | join(", ")' 2>/dev/null || true)
    [[ -n "$skills" ]] && summary+=$'\n\n'"Skills: $skills"

    # Saved/applied jobs (recent activity)
    local apps_resp
    apps_resp=$(curl_with_retry -s \
        -H "Accept: application/json" \
        -H "Cookie: $cookie" \
        -H "X-Requested-With: XMLHttpRequest" \
        "$BASE_URL/api/v1/applications?status=applied&per_page=5" 2>/dev/null || true)

    local app_count
    app_count=$(echo "$apps_resp" | jq '.applications | length' 2>/dev/null || echo 0)
    if [[ "$app_count" -gt 0 ]]; then
        summary+=$'\n\n'"Recent Applications:"
        while IFS= read -r app; do
            local job_title employer
            job_title=$(echo "$app" | jq -r '.job.title // ""')
            employer=$(echo "$app" | jq -r '.job.employer.name // ""')
            summary+=$'\n'"  - $job_title @ $employer"
        done < <(echo "$apps_resp" | jq -c '.applications[]?')
    fi

    output_profile "$summary"
}

# ── Profile-file mode (HANDSHAKE_PROFILE_FILE) ───────────────────────────────
# Accept a JSON or plain-text file the user created manually or exported.
# JSON shape mirrors the Handshake API student object (or a simplified subset).

fetch_from_file() {
    local file="$1"
    if [[ ! -f "$file" ]]; then
        echo "Error: Handshake profile file not found: $file" >&2
        return 1
    fi

    local summary
    if jq empty "$file" 2>/dev/null; then
        summary=$(jq -r '
            "Handshake Profile",
            "Name: \(.name // (.first_name + " " + .last_name) // "")",
            "School: \(.school // .school_name // "")",
            "Major: \(.major // "")",
            "Graduation Year: \(.graduation_year // .grad_year // "")",
            "",
            "Experience:",
            ((.work_experiences // .experience // [])[] | "  - \(.position // .title) at \(.organization // .company) (\(.start_date // "") – \(.end_date // "Present"))"),
            "",
            "Education:",
            ((.education_experiences // .education // [])[] | "  - \(.school_name // .school) — \(.degree // "") \(.field_of_study // .field // "")"),
            "",
            "Skills: \((.skills // []) | map(.name // .) | join(", "))"
        ' "$file")
    else
        summary=$(cat "$file")
    fi

    output_profile "$summary"
}

# ── Main ─────────────────────────────────────────────────────────────────────

if cache_is_fresh; then
    cat "$CACHE_FILE"
    exit 0
fi

if [[ -n "${HANDSHAKE_SESSION_TOKEN:-}" ]]; then
    fetch_via_session "$HANDSHAKE_SESSION_TOKEN"
elif [[ -n "${HANDSHAKE_PROFILE_FILE:-}" ]]; then
    fetch_from_file "$HANDSHAKE_PROFILE_FILE"
else
    echo "No Handshake credentials configured." >&2
    echo "Set one of: HANDSHAKE_SESSION_TOKEN, HANDSHAKE_PROFILE_FILE" >&2
    exit 1
fi
