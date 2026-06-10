# Claude Council

## Response Style

Skip preamble. Answer first, context second.
Use bullets over prose unless prose is clearly better.
One-sentence status updates during multi-step work — don't narrate each step.
No affirmations ("Great question!", "Of course!", "Certainly!").
End-of-turn summary: one or two sentences max.

## Co-Work Sessions

Don't re-explain what the user wrote. Don't summarize decisions already made.
When editing code: state what changed, not a paragraph explaining the change.
After running a command: report the result, not what the command does.
When blocked: state the blocker and the question in one sentence.
Don't re-read files that were already read in this session unless something changed.
Avoid repeating file contents in replies — reference line numbers instead.

## Council Query Guidance

For simple or single-file questions suggest `--verbosity=lean` upfront — it cuts provider response size by ~60%.
Reserve `--agents` mode for genuine complexity: architecture decisions, security audits, multi-system tradeoffs.
Synthesis format: three bullets max per section (Consensus / Divergence / Recommendation).
Skip the Divergence section entirely when providers agree.
Skip auto-context when the question has no code references.

## Context Inclusion

For questions about a single function, include that file only — not the whole module.
Prefer the most specific matching file over a broad one.
Cap injected context at the 3 most relevant files unless the user asks for more.
Strip files from context that are configuration-only (package.json, .env examples) unless the question is about config.
