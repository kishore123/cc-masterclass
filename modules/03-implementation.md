# Module 3 — Implementation

**SDLC stage:** Implementation.
**You'll learn:** `CLAUDE.md` rules as coding standards; format-on-edit hooks; permission
rules that scope what Claude may touch; iterating with build feedback.
**Lab:** implement FR-7 (CRC-16/CCITT) per the ADR, with a clang-format hook and house rules
enforced.
**Autonomy:** L2 (pair) → L3 (guarded edits: hooks + rules + scoped permissions).

---

## Concept: at implementation, guardrails replace supervision

L2 means you eyeball every edit. That doesn't scale. L3 means **deterministic guardrails** do
the watching so you only review at the end:

- **Rules** (`CLAUDE.md`) — always-loaded coding standards. The lab's already say *bounds-check
  trust boundaries, no hot-path heap, don't edit `vendor/`, keep warnings clean*.
- **Hooks** — the harness runs them on events, not the model ([README](../README.md) "harness
  decides"). Format-on-edit is the canonical one.
- **Permission rules** — allow/deny tool calls by pattern, so "never edit `vendor/`" is enforced.

## Lab 3a — add a format-on-edit hook

**Write this file yourself** at `firmware-lab/.claude/settings.json` — hook config shapes how
the harness behaves, not an analysis artifact, so the format is the lesson:

```json
{
  "hooks": {
    "PostToolUse": [
      { "matcher": "Edit|Write",
        "hooks": [ { "type": "command",
          "command": "clang-format -i $CLAUDE_FILE_PATHS 2>/dev/null || true" } ] }
    ]
  }
}
```

> **Plan B:** stuck on the hook schema? Ask Claude to draft one example, then delete it and
> write your own from scratch before moving on.

Now every edit is auto-formatted to `.clang-format`. Edit a `.c` file and watch it normalize
**without Claude choosing to** — the harness did it. (Open `/hooks` once so the watcher
registers; see README gotcha.)

## Lab 3b — scope what Claude may touch

Add permission rules so the `vendor/` rule is enforced, not just hoped:

```json
{
  "permissions": {
    "deny": [ "Edit(vendor/**)", "Write(vendor/**)" ]
  }
}
```

Try to get Claude to "fix a warning in vendor/cjson/cJSON.c" — the deny rule blocks it. This
is policy-as-code: the L3 guardrail that lets you stop watching every keystroke.

## Lab 3c (L2→L3) — implement FR-7

Now build the feature. Let Claude work against the ADR and the build:

> "Implement ADR-0001: add `crc16_ccitt()` in a new `src/crc16.{c,h}`, append the CRC in
> `proto_encode`, validate it in `proto_decode` (return -1 on mismatch), update
> `PROTO_MAX_PAYLOAD` to 60, and update the frame tests. Build and run the tests after each
> step; keep `-Wall -Wextra` clean."

Watch the loop: edit → `make` → read errors → fix → `make test`. The format hook fires on
every write; the rules keep it from allocating in the hot path or touching `vendor/`. You
review the final diff, not each step — **that's the L2→L3 shift.**

## Gotcha

The format hook runs real shell on every matching edit — a footgun if the command is wrong.
Keep hooks safe and idempotent; the `|| true` stops a clang-format hiccup from blocking edits.
Use `settings.json` (shared) vs `settings.local.json` (personal) deliberately.

## Autonomy verdict

Implementation runs well at **L3**: rules + hooks + scoped permissions + the test suite are
the safety net, and a human reviews the diff. Pure L4 (merge unread) waits until Module 7,
and only behind CI.

## Capture / deliverable
- FR-7 implemented: `src/crc16.{c,h}`, updated `protocol.c`, green tests.
- `.claude/settings.json` with the format hook + `vendor/` deny rule.

➡ Next: [Module 4 — Test](04-test.md)
