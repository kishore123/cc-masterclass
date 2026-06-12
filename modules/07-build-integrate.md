# Module 7 — Build & Integrate

**SDLC stage:** Build & integration.
**You'll learn:** headless `claude -p`; an autonomous build-fixer loop; `/code-review` on a
diff; Claude as a CI reviewer in GitHub Actions; the PR workflow.
**Lab:** deliberately break the build, let an **L4** fixer loop repair it unattended, then run
the change through agent review + human review on a PR.
**Autonomy:** L3 → **L4** — this is the first stage we genuinely delegate end-to-end.

---

## Concept: build/integration is deterministic, sandboxed, and auditable — so it earns L4

Unlike design or debug, "make the build green" has an **objective oracle** (the compiler and
the test suite) and runs in a **sandbox** (CI) with a full **audit log**. That combination is
exactly what makes unattended autonomy safe here.

## Lab 7a — headless `claude -p`

Claude Code runs non-interactively:

```bash
claude -p "Run make. If it fails, read the errors, fix the source (not vendor/), and re-run
until it builds and `make test` passes. Then print a one-line summary of what you changed."
```

`-p` (print mode) is the gateway to automation: no TUI, exit when done. This same invocation
is what a CI job or a git hook would call.

## Lab 7b (L4) — the build-fixer loop

Break the build on purpose (e.g. rename a symbol, drop a `#include`). Then run the headless
fixer above, optionally in `acceptEdits` so it doesn't stop to ask. Watch it loop
edit→`make`→read→fix→`make test` with **no human in the loop**, then report. That's L4: you set
policy ("fix the build, don't touch vendor/, tests must pass") and **audit the outcome**, not
each step.

Discuss the guardrails that make this safe: scoped permissions (vendor/ deny), the test suite
as the stop condition, and the fact it runs on a branch, not main.

## Lab 7c — `/code-review` the diff

```
/code-review
```

reviews the working diff for correctness and cleanups. Run it on your FR-7 + bug-fix changes.
Pair it with the `security-reviewer` and `design-reviewer` sub-agents from earlier modules —
three lenses on one diff.

## Lab 7d — Claude as a CI reviewer

Add a job to `.github/workflows/` that runs Claude Code headless on PRs to post review
comments. Sketch:

```yaml
  agent-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Claude review
        run: claude -p "Review the diff in this PR for memory-safety and trust-boundary bugs;
             output findings as a markdown list with file:line." > review.md
        env: { ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }} }
      # ...post review.md as a PR comment
```

Now every PR gets an automated first-pass review (L4) **before** a human review (the L3 gate).
The two stack; the agent doesn't replace the human, it sharpens what the human spends time on.

## Gotcha

L4 needs **hard boundaries**: run on branches not main, keep the `vendor/` deny and secret-scan
hooks active, require the test suite as the stop condition, and keep the audit log. "Headless"
without those is how you get a confidently-wrong change merged.

## Autonomy verdict

Build & integration is the **first true L4** stage: objective oracle + sandbox + audit. Most
teams can let Claude own "keep the build green" and "first-pass PR review" unattended, with
humans approving the merge.

## Capture / deliverable
- A demonstrated headless build-fixer run (transcript/summary).
- A CI `agent-review` job (sketched or wired).

➡ Next: [Module 8 — Release](08-release.md)
