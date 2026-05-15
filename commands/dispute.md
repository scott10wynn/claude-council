---
name: dispute
description: Cross-model dispute between Claude, GPT, and Gemini on architecture or technical decisions. Each model gives independent positions then negotiates through rounds until consensus. Requires mcp__codex and mcp__gemini MCP servers for full multi-model mode.
argument-hint: [topic-or-decision]
allowed-tools: AskUserQuestion, Read, Glob, Grep, Write, Agent, mcp__codex__codex, mcp__codex__codex-reply, mcp__gemini__gemini, mcp__gemini__gemini-reply
---

Invoke the `dispute` skill with the topic: $ARGUMENTS
