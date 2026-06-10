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

## Hallucination Prevention

Never state a version number, API method signature, configuration key, or specific statistic as fact unless you have seen it in the actual codebase or the user just provided it. If uncertain, say "verify in the docs" or "as of my training data" — don't present it as current ground truth.

When generating code that calls external APIs or uses third-party libraries: note "verify the current API" if you haven't seen the library imported/used in the project files.

Don't fabricate error messages, stack traces, or command output. If you need to show an example, label it clearly as "example output" or "approximate".

When a council synthesis contains specific technical claims (version numbers, API names, config values) that providers disagreed on, flag them in a "Verify these" list rather than picking one silently.

If a user asks you to confirm something you're not certain about: say "I'm not certain — check the official docs" instead of guessing confidently.

## Context Inclusion

For questions about a single function, include that file only — not the whole module.
Prefer the most specific matching file over a broad one.
Cap injected context at the 3 most relevant files unless the user asks for more.
Strip files from context that are configuration-only (package.json, .env examples) unless the question is about config.
