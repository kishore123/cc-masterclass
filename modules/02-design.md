# Module 2 — Design

**SDLC stage:** Design.
**You'll learn:** read-only `Explore`/`Plan` sub-agents for fan-out; plan mode for proposals;
writing an ADR; managing context so the design conversation stays sharp.
**Lab:** design the FR-7 CRC change — explore the impact, produce an ADR + the interface, and
have a design-reviewer sub-agent critique it.
**Autonomy:** L2 (you design, Claude assists) → L3 (a design-reviewer sub-agent gates).

---

## Concept: design is where sub-agents earn their keep

A design question — "what does adding a CRC touch?" — means sweeping many files but only
needing the *conclusion*. That's exactly the [sub-agent](../README.md) shape: a worker with
its own context and read-only tools digs, and only its answer returns to your main thread.

## Lab 2a (L2) — impact fan-out with `Explore`

In plan mode, spawn read-only exploration (built-in `Explore` works immediately; custom
agents need a reload):

> "Spawn explorers in parallel to answer: (1) every call site of `proto_encode`/`proto_decode`
> and the frame-size assumptions around them; (2) every test that builds or parses a frame;
> (3) the wire-size budget — does a 2-byte CRC fit `PROTO_MAX_FRAME`, and what shrinks?"

You get three focused conclusions without 20 files of scratch entering your context. Discuss
**why this is cheaper than reading it all yourself** — and the honest cost: workers can be
confidently wrong, so you verify the load-bearing claims (the reviewer-false-positive lesson
from the README).

## Lab 2b — write the ADR

Have Claude draft `firmware-lab/docs/adr/0001-frame-crc.md`:

```markdown
# ADR-0001: CRC-16/CCITT trailer on the wire frame
## Status: proposed
## Context: FR-7; v1 frames have no integrity check (see requirements/SRS.md, protocol.h)
## Decision: append 2-byte CRC-16/CCITT (poly 0x1021, init 0xFFFF) after payload;
   LEN still counts TYPE+PAYLOAD (CRC excluded); decoder validates, returns -1 on mismatch;
   max payload 62 -> 60 to keep PROTO_MAX_FRAME.
## Consequences: breaks v1 compatibility; encode/decode + all frame tests change; +CRC table.
## Alternatives: CRC-16/IBM (rejected: CCITT standard for this link); checksum (weaker).
```

This is a real, reusable team habit: **decisions get a durable record, written by the tool
that just did the analysis.**

## Lab 2c (L3) — a design-reviewer sub-agent

Create `firmware-lab/.claude/agents/design-reviewer.md`:

```markdown
---
name: design-reviewer
description: Critiques a design/ADR for embedded C firmware. Use after an ADR is drafted.
tools: Read, Grep, Glob
model: sonnet
---
You review designs for an embedded sensor gateway. Check: bounds/trust-boundary impact,
wire-size budget, backward compatibility, hot-path allocation (none allowed), and test
coverage gaps. Report concrete risks with file:line. Be skeptical; flag missing acceptance
criteria. Do not propose code — only design critique.
```

Restart (or `/agents` to confirm registration), then delegate the ADR to it. The human still
approves — the sub-agent is a **gate, not the decision-maker**. That's L3.

## Gotcha

A sub-agent file created mid-session isn't selectable until reload ([README](../README.md)).
Build `design-reviewer` *before* this module, or demo the critique with built-in `Explore`.

## Autonomy verdict

Design stays **L2–L3**. Architectural judgment is the human's; Claude accelerates exploration
and documentation and provides a second set of eyes.

## Capture / deliverable
- `docs/adr/0001-frame-crc.md`, plus the updated `protocol.h` interface (signatures + the new
  size constant) — implementation comes next.
- `.claude/agents/design-reviewer.md`.

➡ Next: [Module 3 — Implementation](03-implementation.md)
