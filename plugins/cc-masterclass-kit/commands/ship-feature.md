---
description: Ship a backlog item end to end — plan, fan out to implementer + reviewer + tester sub-agents, merge, and verify.
---

Given a backlog item ID, ship it end to end in this repo:

1. Plan the change and split it into independent subtasks.
2. Spawn in parallel where possible, each returning only its conclusion:
   - an **implementer** (Edit/Write/Bash) to make the change,
   - the **security-reviewer** sub-agent (Read/Grep) to review the diff,
   - the **test-writer** sub-agent (Bash) to add coverage.
3. Merge their outputs, apply review fixes, run the project's tests (e.g. `make test`), and
   keep the build warning-clean (e.g. `-Wall -Wextra`).
4. Report a summary and the final diff.

Honour `CLAUDE.md` (bounds-check trust boundaries, no hot-path heap, don't touch vendored
code). Stop and ask before any `git commit`.
