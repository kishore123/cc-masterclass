Summarize what changed in git today as standup notes.

Steps:
1. Run `git log --since=midnight --oneline` to find today's commits. If there are none, fall back to the most recent day that has commits.
2. Run `git status --short` to capture any uncommitted work in progress.
3. Produce concise standup notes in this format:
   - **Done:** what was completed (from commits), one bullet each
   - **In progress:** uncommitted/staged changes
   - **Next:** logical next steps inferred from the above (mark these as a guess)
   - **Blockers:** anything that looks stuck (failing tests, TODO/FIXME, reverts) — omit if none

Keep it short and skimmable. Don't include raw hashes unless they add clarity.
