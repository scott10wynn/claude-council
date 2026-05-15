---
name: career-guidance
description: Career guidance using LinkedIn and Handshake profile context. Covers resume review, job search strategy, interview preparation, networking advice, and career path planning. Triggers when the user asks about jobs, internships, resumes, career decisions, job applications, or professional networking. Uses LinkedIn and Handshake profile data as context when available.
---

# Career Guidance Skill

Provides career advice grounded in the user's actual LinkedIn and/or Handshake profile data.

## Context Gathering

Before advising, load available profile data:

```bash
# LinkedIn profile (outputs formatted summary or error)
bash ${CLAUDE_PLUGIN_ROOT}/scripts/connectors/linkedin.sh 2>/dev/null || true

# Handshake profile (outputs formatted summary or error)
bash ${CLAUDE_PLUGIN_ROOT}/scripts/connectors/handshake.sh 2>/dev/null || true
```

If both connectors return errors, proceed with only the user's stated context.

Summarize what data is available before giving advice:
```
Using context: [LinkedIn profile] [Handshake profile] [user-provided info]
```

## Advice Framework

Tailor advice based on the question type:

### Resume / Profile Review
- Evaluate headline, summary, and experience bullets against target roles
- Flag vague language ("worked on", "helped with") — suggest impact metrics instead
- Check skills alignment with job postings in the user's target area
- LinkedIn: note profile completeness (photo, connections, recommendations)
- Handshake: note whether profile reaches Handshake's "complete" threshold

### Job Search Strategy
- Identify gaps between current profile and target-role requirements
- Suggest specific companies on Handshake that match the user's school/major
- Surface networking moves (alumni, 2nd-degree connections, events)
- Recommend timeline given graduation year or career stage

### Interview Preparation
- Build STAR stories from the user's actual experience bullets
- Flag likely behavioral questions for their target role/industry
- Suggest technical prep areas based on job description and skill gaps

### Offer Evaluation / Career Decisions
- Frame tradeoffs concretely (growth vs. compensation, brand vs. learning)
- Use the user's stated priorities to weight the analysis
- Note red flags and green flags in job descriptions

## Output Format

1. **Profile snapshot** — one-line summary of the user's background (skip if no profile data)
2. **Direct answer** — answer the user's actual question first
3. **Specific actions** — numbered list of concrete next steps
4. **Watch-outs** — risks or gaps worth flagging

Keep advice specific to the user's data. Avoid generic career advice when profile context is available.
