---
name: Feedback & Preferences
description: Approaches that worked, things to avoid, and user preferences observed during this project
type: feedback
---

## Agent setup
User wants a structured dev team with clear role separation. Agents confirmed and accepted after explanation of the planner-as-orchestrator model.

## Codebase cleanup
User wants `.opencode` and `.tmp` directories removed — these are opencode AI tool artifacts and should not be in the repo. Both are now in `.gitignore`.

## Communication style
Keep responses concise and direct. Use tables for comparisons. No filler text or generic advice.

## Memory & token strategy
User is aware of and interested in token efficiency. Use agents to isolate context, CLAUDE.md for orientation, skills for lazy-loaded domain knowledge, and memory files for cross-session continuity.
