# Module 9 — Orchestration & Dynamic Workflow

**SDLC stage:** cross-cutting — composing the whole lifecycle.
**You'll learn:** in-session Task fan-out; an orchestrator command; the Agent SDK for durable
loops; `/loop` and `/schedule` as the middle ground; **when *not* to orchestrate**.
**Lab:** `/ship-feature` — plan → implementer + reviewer + tester sub-agents → merge — on a
real backlog item (FR-6a `stats` command).
**Autonomy:** L3 → L4. This is the parked finale from the original README, now on real code.

---

## Concept: two kinds of "master agent," and teams confuse them

### A. In-session orchestration (no code)
Your main Claude **is** the master. It spawns sub-agents via the Task tool, in parallel, each
with scoped tools, then synthesizes. Great for fan-out research, multi-file refactors, parallel
review. No infra. ([README §4A](../README.md).)

### B. Programmatic orchestration (Agent SDK)
When you need a **durable** loop — retries, scheduling, external triggers, a control plane —
drive Claude Code from code (`claude-agent-sdk`, Python/TS). Your program is the master.
([README §4B](../README.md).)

### Middle ground
`/loop` (interval or self-paced) and `/schedule` (cron routines) — recurring without writing a
control plane.

**Rule of thumb:** stay in-session (A) until you need persistence, triggers, or non-interactive
runs — then graduate to the SDK (B).

## Lab 9a — the `/ship-feature` orchestrator

`firmware-lab/.claude/commands/ship-feature.md`:

```markdown
Given a backlog item ID, ship it end to end:
1. Plan the change and split into subtasks.
2. Spawn in parallel where possible: an implementer (Edit/Write/Bash), a reviewer
   (Read/Grep — reuse security-reviewer), and a test-writer (Bash). Each returns only its
   conclusion.
3. Merge their outputs, apply review fixes, run `make test`, and report a summary diff.
Stop and ask before any git commit.
```

Run `/ship-feature FR-6a` (the `stats` CLI command). Watch the main agent plan, fan out to
workers with scoped tools, and synthesize — every primitive from the course composing at once:
a command driving sub-agents, guarded by hooks and rules, verified by the test suite.

## Lab 9b — feel the cost, and when *not* to

Orchestration isn't free: workers are cold/stateless, can be confidently wrong, and you pay in
coordination. For a one-file fix, a single L2 conversation beats a fan-out. Teach the
**negative space**: don't spawn five agents for a job one focused session does better. (This is
the README's "delegation buys isolation + parallelism; you pay in coordination.")

## Lab 9c — the SDK sketch (explained, not run)

Show the shape so the team knows the escape hatch exists:

```python
from claude_agent_sdk import query
async for msg in query(prompt="fix the build and open a PR", options={...}):
    ...   # your program decides when to call, how to route, when to stop
```

This is what you reach for to build a CI bot, a 24/7 firmware-triage service, or a fleet of
specialized agent configs — a different layer from the in-session Task tool.

## Autonomy verdict

Orchestration spans **L3→L4**: in-session fan-out with human gates (L3) graduates to an
SDK/scheduled control plane (L4) when you need durability. The judgment taught here — *when
orchestration earns its complexity* — is the capstone skill.

## Capture / deliverable
- `.claude/commands/ship-feature.md`; FR-6a shipped through it.
- A written note on when your team will and won't orchestrate.

➡ Next: [Module 10 — Capstone & Rollout](10-capstone-and-rollout.md)
