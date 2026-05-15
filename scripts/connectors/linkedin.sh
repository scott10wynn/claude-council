#!/bin/bash
# ABOUTME: Fetches LinkedIn profile data and outputs a formatted summary
# ABOUTME: Supports API token, LinkedIn data export directory, or profile JSON file

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../lib/retry.sh"

CACHE_DIR="${COUNCIL_CACHE_DIR:-.claude/council-cache}"
CACHE_FILE="$CACHE_DIR/linkedin-profile.txt"
CACHE_TTL="${COUNCIL_CACHE_TTL:-3600}"

# Check if cache is fresh enough to use
cache_is_fresh() {
    [[ -f "$CACHE_FILE" ]] || return 1
    local now age mtime
    now=$(date +%s)
    mtime=$(stat -c %Y "$CACHE_FILE" 2>/dev/null || stat -f %m "$CACHE_FILE" 2>/dev/null)
    age=$(( now - mtime ))
    [[ $age -lt $CACHE_TTL ]]
}

# Write profile summary to cache and stdout
output_profile() {
    local text="$1"
    mkdir -p "$CACHE_DIR"
    echo "$text" > "$CACHE_FILE"
    echo "$text"
}

# ── API mode (LINKEDIN_ACCESS_TOKEN) ────────────────────────────────────────

fetch_via_api() {
    local token="$1"
    local base="https://api.linkedin.com/v2"
    local auth="Authorization: Bearer $token"

    # Basic profile (r_liteprofile scope)
    local me
    me=$(curl_with_retry -s -H "$auth" \
        "$base/me?projection=(id,firstName,lastName,headline,vanityName,location,industry)")

    local err
    err=$(echo "$me" | jq -r '.message // empty' 2>/dev/null || true)
    if [[ -n "$err" ]]; then
        echo "Error: LinkedIn API: $err" >&2
        return 1
    fi

    local first last headline location industry username
    first=$(echo "$me" | jq -r '.firstName.localized | to_entries[0].value // ""')
    last=$(echo "$me" | jq -r '.lastName.localized | to_entries[0].value // ""')
    headline=$(echo "$me" | jq -r '.headline.localized | to_entries[0].value // ""')
    location=$(echo "$me" | jq -r '.location.name // ""')
    industry=$(echo "$me" | jq -r '.industry // ""')
    username=$(echo "$me" | jq -r '.vanityName // ""')

    local summary="LinkedIn Profile"
    [[ -n "$username" ]] && summary+=" (linkedin.com/in/$username)"
    summary+=$'\n'"Name: $first $last"
    [[ -n "$headline" ]] && summary+=$'\n'"Headline: $headline"
    [[ -n "$location" ]] && summary+=$'\n'"Location: $location"
    [[ -n "$industry" ]] && summary+=$'\n'"Industry: $industry"

    # Email (r_emailaddress scope) — best-effort, skip if scope missing
    local email_resp email
    email_resp=$(curl_with_retry -s -H "$auth" \
        "$base/emailAddress?q=members&projection=(elements*(handle~))" 2>/dev/null || true)
    email=$(echo "$email_resp" | jq -r '.elements[0]["handle~"].emailAddress // ""' 2>/dev/null || true)
    [[ -n "$email" ]] && summary+=$'\n'"Email: $email"

    # Positions (r_fullprofile scope — gracefully absent for basic apps)
    local pos_resp
    pos_resp=$(curl_with_retry -s -H "$auth" \
        "$base/positions?q=members&projection=(elements*(title,company,startMonthYear,endMonthYear,description))" \
        2>/dev/null || true)
    local pos_count
    pos_count=$(echo "$pos_resp" | jq '.elements | length' 2>/dev/null || echo 0)
    if [[ "$pos_count" -gt 0 ]]; then
        summary+=$'\n\n'"Work Experience:"
        while IFS= read -r pos; do
            local title company start_year end_year
            title=$(echo "$pos" | jq -r '.title // ""')
            company=$(echo "$pos" | jq -r '.company.name // ""')
            start_year=$(echo "$pos" | jq -r '.startMonthYear.year // ""')
            end_year=$(echo "$pos" | jq -r '.endMonthYear.year // "Present"')
            summary+=$'\n'"  - $title at $company ($start_year–$end_year)"
        done < <(echo "$pos_resp" | jq -c '.elements[]')
    fi

    # Education (r_fullprofile scope — gracefully absent)
    local edu_resp
    edu_resp=$(curl_with_retry -s -H "$auth" \
        "$base/educations?q=members&projection=(elements*(schoolName,fieldOfStudy,degree,startMonthYear,endMonthYear))" \
        2>/dev/null || true)
    local edu_count
    edu_count=$(echo "$edu_resp" | jq '.elements | length' 2>/dev/null || echo 0)
    if [[ "$edu_count" -gt 0 ]]; then
        summary+=$'\n\n'"Education:"
        while IFS= read -r edu; do
            local school degree field end_year
            school=$(echo "$edu" | jq -r '.schoolName // ""')
            degree=$(echo "$edu" | jq -r '.degree // ""')
            field=$(echo "$edu" | jq -r '.fieldOfStudy // ""')
            end_year=$(echo "$edu" | jq -r '.endMonthYear.year // ""')
            local line="  - $school"
            [[ -n "$degree" || -n "$field" ]] && line+=" — ${degree}${degree:+, }${field}"
            [[ -n "$end_year" ]] && line+=" ($end_year)"
            summary+=$'\n'"$line"
        done < <(echo "$edu_resp" | jq -c '.elements[]')
    fi

    # Skills (r_fullprofile scope — gracefully absent)
    local skills_resp
    skills_resp=$(curl_with_retry -s -H "$auth" \
        "$base/skills?q=members&projection=(elements*(name))" 2>/dev/null || true)
    local skills_list
    skills_list=$(echo "$skills_resp" | jq -r '[.elements[].name] | join(", ")' 2>/dev/null || true)
    [[ -n "$skills_list" ]] && summary+=$'\n\n'"Skills: $skills_list"

    output_profile "$summary"
}

# ── Export-directory mode (LINKEDIN_EXPORT_DIR) ──────────────────────────────
# LinkedIn lets users download their data (Settings → Privacy → Get a copy).
# The ZIP contains Profile.csv, Positions.csv, Education.csv, Skills.csv, etc.

fetch_from_export() {
    local dir="$1"

    if [[ ! -d "$dir" ]]; then
        echo "Error: LinkedIn export directory not found: $dir" >&2
        return 1
    fi

    local summary="LinkedIn Profile (from data export)"

    # Profile.csv — header row + data row
    if [[ -f "$dir/Profile.csv" ]]; then
        local name headline location industry
        # csv columns: First Name,Last Name,Maiden Name,Address,Birth Date,Headline,Summary,Industry,...
        name=$(awk -F',' 'NR==2{print $1" "$2}' "$dir/Profile.csv" | tr -d '"')
        headline=$(awk -F',' 'NR==2{print $6}' "$dir/Profile.csv" | tr -d '"')
        industry=$(awk -F',' 'NR==2{print $8}' "$dir/Profile.csv" | tr -d '"')
        [[ -n "$name"     ]] && summary+=$'\n'"Name: $name"
        [[ -n "$headline" ]] && summary+=$'\n'"Headline: $headline"
        [[ -n "$industry" ]] && summary+=$'\n'"Industry: $industry"
    fi

    # Positions.csv — Company Name,Title,Description,Location,Started On,Finished On
    if [[ -f "$dir/Positions.csv" ]]; then
        summary+=$'\n\n'"Work Experience:"
        tail -n +2 "$dir/Positions.csv" | while IFS=',' read -r company title desc loc start finish; do
            company=$(echo "$company" | tr -d '"')
            title=$(echo "$title" | tr -d '"')
            start=$(echo "$start" | tr -d '"')
            finish=$(echo "$finish" | tr -d '"')
            finish="${finish:-Present}"
            summary+=$'\n'"  - $title at $company ($start – $finish)"
        done
        summary+=$'\n'"$summary"
    fi

    # Education.csv — School Name,Degree Name,Start Date,End Date,Notes,Activities,Description,Standardized...
    if [[ -f "$dir/Education.csv" ]]; then
        summary+=$'\n\n'"Education:"
        tail -n +2 "$dir/Education.csv" | while IFS=',' read -r school degree field start finish _rest; do
            school=$(echo "$school" | tr -d '"')
            degree=$(echo "$degree" | tr -d '"')
            field=$(echo "$field" | tr -d '"')
            finish=$(echo "$finish" | tr -d '"')
            local line="  - $school"
            [[ -n "$degree" ]] && line+=" — $degree"
            [[ -n "$field"  ]] && line+=" in $field"
            [[ -n "$finish" ]] && line+=" ($finish)"
            summary+=$'\n'"$line"
        done
    fi

    # Skills.csv — Name
    if [[ -f "$dir/Skills.csv" ]]; then
        local skills
        skills=$(tail -n +2 "$dir/Skills.csv" | tr -d '"' | paste -sd ', ')
        [[ -n "$skills" ]] && summary+=$'\n\n'"Skills: $skills"
    fi

    output_profile "$summary"
}

# ── Profile-file mode (LINKEDIN_PROFILE_FILE) ────────────────────────────────
# Accept a plain-text or JSON file the user wrote manually.

fetch_from_file() {
    local file="$1"
    if [[ ! -f "$file" ]]; then
        echo "Error: LinkedIn profile file not found: $file" >&2
        return 1
    fi

    local summary
    # If JSON, pretty-print key fields; otherwise pass through as-is
    if jq empty "$file" 2>/dev/null; then
        summary=$(jq -r '
            "LinkedIn Profile",
            "Name: \(.name // (.firstName + " " + .lastName) // "")",
            "Headline: \(.headline // "")",
            "Location: \(.location // "")",
            "",
            "Experience:",
            (.experience[]? | "  - \(.title) at \(.company) (\(.startDate // "") – \(.endDate // "Present"))"),
            "",
            "Education:",
            (.education[]? | "  - \(.school) — \(.degree // "") \(.field // "")"),
            "",
            "Skills: \((.skills // []) | join(", "))"
        ' "$file")
    else
        summary=$(cat "$file")
    fi

    output_profile "$summary"
}

# ── Main ─────────────────────────────────────────────────────────────────────

# Return cached data if fresh
if cache_is_fresh; then
    cat "$CACHE_FILE"
    exit 0
fi

if [[ -n "${LINKEDIN_ACCESS_TOKEN:-}" ]]; then
    fetch_via_api "$LINKEDIN_ACCESS_TOKEN"
elif [[ -n "${LINKEDIN_EXPORT_DIR:-}" ]]; then
    fetch_from_export "$LINKEDIN_EXPORT_DIR"
elif [[ -n "${LINKEDIN_PROFILE_FILE:-}" ]]; then
    fetch_from_file "$LINKEDIN_PROFILE_FILE"
else
    echo "No LinkedIn credentials configured." >&2
    echo "Set one of: LINKEDIN_ACCESS_TOKEN, LINKEDIN_EXPORT_DIR, LINKEDIN_PROFILE_FILE" >&2
    exit 1
fi
