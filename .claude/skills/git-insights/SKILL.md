---
name: git-insights
description: Produce a clear insights report about the current git repository — commit count, contributors, history span, recent activity. Use when the user asks for repo insights, project/git stats, an overview of the codebase's history, or "what's in this repo".
---

# git-insights

Generate a repository insights report.

## Steps

1. Run the bundled script from the repo root:
   ```
   python .claude/skills/git-insights/insights.py
   ```
   For a time-bounded view, pass `--since`, e.g. `--since "1 week ago"`.
2. Present the script's output to the user. Keep the structure it produces
   (counts, contributors, recent commits) — tidy formatting only, don't invent data.
3. If the script errors (e.g. no git repo), say so plainly instead of guessing.

The script is pure stdlib + the git CLI, so it has no dependencies to install.
