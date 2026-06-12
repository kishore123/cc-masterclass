# Module 8 — Release

**SDLC stage:** Release.
**You'll learn:** a release-notes skill that drafts from git history; a semver-validation hook;
`/schedule` routines for recurring release chores; the human-approval gate.
**Lab:** cut **v1.1.0** (FR-7 + the bug fixes) — Claude drafts notes from commits, a hook
validates the tag, you approve the cut.
**Autonomy:** L3 (automate the mechanics, human approves) → L4 (scheduled release-prep routine).

---

## Concept: release is mechanical drafting + a human go/no-go

The *content* of release notes is recoverable from commits and the closed backlog — delegable.
The *decision to ship* is a human's. Release is the cleanest example of "L4 the typing, L3 the
judgment."

## Lab 8a — a release-notes skill

`firmware-lab/.claude/skills/release-notes/SKILL.md`:

```markdown
---
name: release-notes
description: Draft release notes for firmware-lab from git history since the last tag.
  Use when preparing a release or asked for a changelog.
---
1. Find the last tag (`git describe --tags --abbrev=0`).
2. Read commits since then (`git log <tag>..HEAD`).
3. Group into Features / Fixes / Security, mapping to backlog IDs (FR-*, BUG-*, SEC-*).
4. Output Keep-a-Changelog markdown under a new version heading. Do not tag — that's the
   human's call after review.
```

Run it after FR-7 + the Module 5/6 fixes. You get a structured draft tied to backlog IDs —
note FR-7, BUG-1..4, SEC-1/2 all surface from the history you built across the course.

## Lab 8b — a semver-validation hook

Releases go wrong when the tag is malformed or out of order. A `PreToolUse` hook on the tag
command (or a `tools/check-semver.sh` you call before tagging) validates `vX.Y.Z`, monotonic
increase, and that the working tree is clean. Deterministic guardrail, human still pulls the
trigger.

## Lab 8c — cut the release (L3)

```bash
git tag -a v1.1.0 -m "FR-7 CRC frame; fixes BUG-1..4; SEC-1/2"
git push origin v1.1.0
```

Claude drafted the notes; the hook validated the tag; **you** decided it was ready. That
division is the L3 release pattern.

## Lab 8d (L4) — a scheduled release-prep routine

For recurring cadence, `/schedule` (or `/loop`) can run release *prep* unattended — e.g. every
Friday, draft the pending changelog and open a release PR for human approval Monday. The
routine does L4 prep; the merge stays an L3 human gate.

> This is the one place a `/schedule` is genuinely warranted: a real recurring obligation with
> a date. Elsewhere in the course, don't reach for scheduling just because you can.

## Autonomy verdict

Release runs **L3–L4**: notes, changelog, and tag validation are automated/scheduled (L4 prep);
the go/no-go to publish stays a human gate (L3). Never auto-publish firmware from a model
decision alone.

## Capture / deliverable
- `.claude/skills/release-notes/SKILL.md`, `tools/check-semver.sh`.
- A tagged `v1.1.0` with generated, human-approved notes.

➡ Next: [Module 9 — Orchestration & Dynamic Workflow](09-orchestration.md)
