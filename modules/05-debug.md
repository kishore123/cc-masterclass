# Module 5 — Debug

**SDLC stage:** Debug.
**You'll learn:** letting Claude drive gdb and AddressSanitizer; reading crash output; the
hypothesis→experiment→evidence loop; why debug is the most interactive stage.
**Lab:** hunt BUG-3 (crash), BUG-4 (peek wrap), BUG-2 (config overflow) from **symptoms only**.
**Autonomy:** L2 (you and Claude at the debugger together) → L3 (a triage sub-agent for first-pass).

> **Requires Linux/WSL** for ASan. MinGW on Windows has no sanitizer runtime.

---

## Concept: debugging is a loop of evidence, and the model is a fast hypothesis engine

Give Claude a **symptom**, not the answer, and make it earn the root cause: form a hypothesis,
run an experiment (gdb, ASan, a print, a targeted test), read the evidence, revise. This is L2
by nature — you're both staring at the same crash. The skill is *steering* it to evidence
instead of accepting its first plausible guess.

## Lab 5a — BUG-3 from a ticket (gdb)

The backlog ticket (BUG-3): *"a config with an `uplink` object but no `port` key hard-faults."*
Reproduce and drive gdb:

```bash
gdb --args ./build/sensor-gw     # after wiring a config_load call, or via a small harness
```

Prompt: *"BUG-3 says config with `uplink` but no `port` crashes. Write a 10-line harness that
calls `config_load` with `{\"uplink\":{}}`, build it, run under gdb, and tell me the exact
faulting line and why."* Claude should land on the NULL deref of `port->valueint` in
`config.c`. Make it **show you the evidence** (the backtrace), not just assert.

## Lab 5b — BUG-4 and BUG-2 under ASan

Build the lab with sanitizers and let the tool point at memory:

```bash
make asan CC=clang        # build/sensor-gw-asan
```

Feed the red tests from Module 4 through an ASan build:
- BUG-4: `rb_peek` when buffered data wraps the array end → ASan **stack-buffer-overflow READ**
  in `rb_peek` (build the wrap: fill 7, drain 6, put 2, then `peek(2)` — see Module 4's note).
- BUG-2: a long `device_id` in config → ASan **stack-buffer-overflow WRITE of size N** in the
  `strcpy`.

Prompt: *"Run this under ASan, read the report, and identify the exact line and the fix that
respects CLAUDE.md's bounds-checking rule."* Discuss how ASan turns "occasionally garbage"
(BUG-4's ticket) into a precise file:line.

## Lab 5c (L3) — a triage sub-agent for first pass

**Write this file yourself** at `firmware-lab/.claude/agents/triage.md` — a sub-agent is just
config that shapes how Claude behaves, not an analysis artifact, so the format is the lesson:

```markdown
---
name: triage
description: First-pass crash triage for firmware-lab. Use on a stack trace or ASan report.
tools: Read, Grep, Glob, Bash
model: sonnet
---
Given a crash/ASan report, locate the faulting code, state the most likely root cause with
file:line and evidence, and propose a minimal fix consistent with CLAUDE.md. Do not commit;
hand back a diagnosis for human confirmation.
```

> **Plan B:** stuck on the frontmatter? Ask Claude to draft one example, then delete it and
> write your own from scratch before moving on.

Delegate the raw ASan dump to it for a first read, then **you confirm**. The orchestrator owns
final judgment — a worker on a cheaper model can be confidently wrong (README's reviewer story).

## Gotcha

Don't let Claude "fix" by mutating until the crash disappears — that hides bugs (e.g. enlarging
a buffer instead of bounds-checking). Insist the fix matches the **root cause and the house
rule**. The red Module-4 tests are your proof the fix is real: they must go green for the right
reason.

## Autonomy verdict

Debug is the stage that **stays L2–L3**. The interactive evidence loop is the human's; a
sub-agent can do first-pass triage, but you confirm the diagnosis before any fix lands.

## Capture / deliverable
- BUG-2, BUG-3, BUG-4 root-caused and fixed; Module-4 red tests now green.
- `.claude/agents/triage.md`.

➡ Next: [Module 6 — Security](06-security.md)
