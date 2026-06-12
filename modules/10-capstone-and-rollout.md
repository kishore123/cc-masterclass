# Module 10 — Capstone & Rollout

**SDLC stage:** all of them, once, by the attendees.
**You'll learn:** packaging the course's artifacts as a distributable plugin; the autonomy
decision rubric; how to roll Claude Code out to a few-hundred-person org.
**Lab:** take one backlog item from requirement to tagged release, **choosing the autonomy
level per stage and justifying it**; then install the team toolkit.

---

## Capstone lab — one feature, full lifecycle, your autonomy calls

In teams of 2–3, take a backlog item (FR-9 wear-leveling stats, FR-10 config persistence, or a
fresh one) and run it through the whole SDLC **using the artifacts you built**:

| Stage | Use | Decide |
|---|---|---|
| Requirements | `/draft-req` | what acceptance criteria? |
| Design | `Explore` fan-out + `design-reviewer` + ADR | what's the interface? |
| Implement | `CLAUDE.md` rules + format hook + scoped permissions | L2 or L3? |
| Test | `test-gen` skill + `test-writer` | coverage target? |
| Debug | ASan + `triage` | — |
| Security | fuzz harness + `security-reviewer` + gate hooks | what's the gate? |
| Build | headless `claude -p` fixer + `/code-review` | L3 or L4? |
| Release | `release-notes` skill + semver hook | who approves? |
| Orchestrate | `/ship-feature` | orchestrate or not? |

**The deliverable isn't just the feature — it's a one-page record of which autonomy level you
chose at each stage and why.** That artifact is what your org's quality/safety process needs.

## The autonomy decision rubric (fill in for *your* systems)

| Stage | Typical ceiling | Your team's ceiling | Rationale |
|---|---|---|---|
| Requirements | L3 | ? | human owns intent |
| Design | L3 | ? | architectural judgment human-gated |
| Implementation | L3 | ? | rules + tests + review as net |
| Test | L4 | ? | suite is self-checking |
| Debug | L3 | ? | interactive evidence loop |
| Security scan | L4 | ? | scanning delegable, triage human |
| Build/integrate | L4 | ? | objective oracle + sandbox + audit |
| Release | L4 prep / L3 cut | ? | automate mechanics, human ships |

There are no universally correct answers — a medical or automotive firmware team will sit
lower than a hobby project. The win is a **shared, written, defensible position.**

## Rollout — from this room to a few hundred engineers

1. **Package the toolkit as a plugin.** Bundle the commands, skills, agents, and hook configs
   built across the course into `cc-masterclass-kit` (the README already walks the
   `init → populate → validate → reload` flow). Ship it as **one installable unit** instead of
   hand-placed files.
2. **Stand up a marketplace** (a git repo) as the company hub:
   ```bash
   claude plugin marketplace add <company-repo>
   claude plugin install cc-masterclass-kit@<market>
   claude plugin update  cc-masterclass-kit
   ```
   This is the **managed-local** model from the README: the hub is the source of truth,
   `update` re-pulls, versioned and auditable — the right shape for a few-hundred-person team.
3. **Repo-specific skills stay project-scoped** (like `git-insights`): they live in the repo,
   versioned with the code, so cloning gets the current toolkit with no drift.
4. **Standardize the guardrails**, not just the tools: ship the `vendor/` deny rule, the
   secret-scan gate, and the format hook in the plugin so every engineer inherits the same
   policy-as-code.
5. **Measure adoption**: PRs with agent review, build-fixer hits, fuzz crashes caught
   pre-merge. Let data, not mandate, drive the rollout.

## Close

Attendees leave with: a working mental model of every primitive; reps across the full SDLC on
real C firmware; a defensible per-stage autonomy position; and a toolkit they can install and a
hub they can distribute it from. That's the masterclass.

⬅ Back to [COURSE.md](../COURSE.md)
