---
description: Get career advice from multiple AI agents using your LinkedIn and Handshake profile as context. Covers resume review, job search, interview prep, offer evaluation, and career planning. Suggest this command when the user asks about jobs, internships, resumes, LinkedIn optimization, Handshake applications, career decisions, or professional networking.
argument-hint: [--providers=list] [--output=path] [--no-linkedin] [--no-handshake] "question"
allowed-tools: Bash(*), Read, Write, AskUserQuestion, TaskCreate, TaskUpdate
---

Get career advice from the AI council, grounded in your LinkedIn and Handshake profile.

## Step 1: Load Profile Context

```
TaskCreate:
  subject: "Career council query"
  description: "Loading profiles and querying AI council for career advice"
  activeForm: "Loading profile data..."
TaskUpdate: status → in_progress
```

Load available profiles unless the corresponding `--no-*` flag is set:

```bash
# Load LinkedIn profile
LINKEDIN_CONTEXT=""
if [[ "$ARGUMENTS" != *"--no-linkedin"* ]]; then
    LINKEDIN_CONTEXT=$(bash ${CLAUDE_PLUGIN_ROOT}/scripts/connectors/linkedin.sh 2>/dev/null || echo "")
fi

# Load Handshake profile
HANDSHAKE_CONTEXT=""
if [[ "$ARGUMENTS" != *"--no-handshake"* ]]; then
    HANDSHAKE_CONTEXT=$(bash ${CLAUDE_PLUGIN_ROOT}/scripts/connectors/handshake.sh 2>/dev/null || echo "")
fi
```

Show the user what was loaded (one line each):
- `LinkedIn: [loaded — Name, Headline] | [not configured — see setup below]`
- `Handshake: [loaded — Name, School] | [not configured — see setup below]`

### Setup Prompts (if connectors returned nothing)

If **both** connectors are unconfigured, ask:

```
AskUserQuestion:
  Question: "No LinkedIn or Handshake profiles are configured. How would you like to proceed?"
  Header: "Profile setup"
  Options:
    - Continue without profile — give general career advice
    - I'll paste my profile — ask me for profile text
    - Show setup instructions — explain how to configure connectors
```

If the user chooses "I'll paste my profile", ask them to paste their profile info (experience, skills, target roles) and use that as context.

If the user chooses "Show setup instructions", output:

```
## LinkedIn Setup

**Option A — Access Token (live API)**
1. Create a LinkedIn app at https://www.linkedin.com/developers/apps
2. Request r_liteprofile and r_emailaddress scopes
3. Complete OAuth flow to get an access token
4. Set: export LINKEDIN_ACCESS_TOKEN="your-token"

**Option B — Data Export (full profile, no app required)**
1. Go to LinkedIn Settings → Data Privacy → Get a copy of your data
2. Request: Profile, Positions, Education, Skills
3. Extract the ZIP, note the directory path
4. Set: export LINKEDIN_EXPORT_DIR="/path/to/extracted-zip"

**Option C — Profile File (manual)**
Create a JSON or text file describing your profile, then:
  export LINKEDIN_PROFILE_FILE="/path/to/profile.json"

## Handshake Setup

**Option A — Session Token (live API)**
1. Log into Handshake at app.joinhandshake.com
2. Open DevTools → Application → Cookies → find _hs_session
3. Copy the cookie value
4. Set: export HANDSHAKE_SESSION_TOKEN="your-session-value"

**Option B — Profile File (manual)**
Create a JSON or text file with your Handshake profile info, then:
  export HANDSHAKE_PROFILE_FILE="/path/to/handshake-profile.json"
```

Then exit without querying the council.

## Step 2: Build the Enriched Prompt

Construct the prompt to send to providers:

```
CAREER_CONTEXT=""
[[ -n "$LINKEDIN_CONTEXT"   ]] && CAREER_CONTEXT+="=== LinkedIn Profile ===\n$LINKEDIN_CONTEXT\n\n"
[[ -n "$HANDSHAKE_CONTEXT"  ]] && CAREER_CONTEXT+="=== Handshake Profile ===\n$HANDSHAKE_CONTEXT\n\n"

FULL_PROMPT="${CAREER_CONTEXT}Career question: ${USER_QUESTION}"
```

Where `USER_QUESTION` is extracted from `$ARGUMENTS` (everything after `--` or the last non-flag argument).

## Step 3: Query the Council

Update task: `activeForm: "Querying career council..."`

Use the `career-guidance` skill — invoke it with the enriched prompt and call the query script with career-appropriate roles:

```bash
bash ${CLAUDE_PLUGIN_ROOT}/scripts/query-council.sh \
    --roles=career-advisor,recruiter,industry-expert \
    -- "$FULL_PROMPT"
```

If `--providers` is set in `$ARGUMENTS`, pass it through.

If `--output` is set in `$ARGUMENTS`, append `--output=<path>`.

Pipe results through the formatter:
```bash
| bash ${CLAUDE_PLUGIN_ROOT}/scripts/format-output.sh
```

## Step 4: Synthesize Career Advice

After formatted provider responses, generate a career-specific synthesis:

1. **Profile fit** — how the user's background aligns with what providers recommend
2. **Consensus advice** — where providers agree
3. **Divergent takes** — where they disagree and why it matters
4. **Top 3 actions** — specific next steps ranked by impact

Update task: `status → completed`

## Step 5: Export (if --output specified)

```bash
bash ${CLAUDE_PLUGIN_ROOT}/scripts/lib/export.sh --write "<output_path>" "<prompt>" "<providers>"
```

Confirm: `Saved to: <output_path>`

## Error Handling

- If connectors fail, note which are missing and continue with available context
- If all providers fail, report the error clearly
- Profile data is cached for 1 hour — run with `--no-cache` to force refresh
