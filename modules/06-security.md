# Module 6 — Security

**SDLC stage:** Security (scan, fuzz, gate).
**You'll learn:** `/security-review`; hooks as *gates* (block secrets, block protected paths);
a security-reviewer sub-agent; generating a libFuzzer harness; static analysis in CI.
**Lab:** fuzz `proto_decode` to crash on BUG-1, fix it, add a regression corpus; add a
pre-commit secret-scan hook and prove it blocks a planted key; wire scan-build into CI.
**Autonomy:** L3 (human triages) → L4 (scanning/fuzzing run unattended in CI).

> **Requires Linux/WSL** (clang + libFuzzer).

---

## Concept: security splits cleanly into delegable scanning and human triage

*Finding* candidates (fuzzers, static analysers, secret scanners) is mechanical and belongs at
**L4** — run it on every push, unattended. *Judging* findings (is it exploitable? what's the
right fix?) is **L3** — a human with Claude's help. Don't conflate them.

## Lab 6a — `/security-review` the trust boundaries

Run the built-in:

```
/security-review
```

on `src/protocol.c` and `src/config.c`. It should flag the unbounded decode and the `strcpy`.
Compare with what the unit tests said (nothing) — **green tests are not a security signal.**

## Lab 6b (L4) — fuzz `proto_decode` → BUG-1

Have Claude write `firmware-lab/fuzz/fuzz_proto.c`:

```c
#include "protocol.h"
#include <stddef.h>
#include <stdint.h>
int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
    proto_frame_t out; size_t consumed = 0;
    proto_decode(data, size, &out, &consumed);   /* must never overflow */
    return 0;
}
```

Build and run (drop `src/crc16.c` from the command if FR-7 hasn't been built yet):

```bash
clang -g -O1 -fsanitize=fuzzer,address,undefined -Isrc \
  src/protocol.c src/crc16.c fuzz/fuzz_proto.c -o fuzz/fuzz_proto
./fuzz/fuzz_proto -max_total_time=30
```

It crashes within seconds on a `LEN` that overflows `out.payload` (BUG-1). *(Dry-run verified:
ASan reports `heap-buffer-overflow in __asan_memcpy` and writes a `crash-…` artifact.)* Then:
1. **Fix** `proto_decode` (bounds-check; see CLAUDE.md NFR-3).
2. **Save the crashing input** into `fuzz/corpus/` as a **regression seed**.
3. Re-run: clean. The corpus is now a permanent guard (SEC-1 done).

This is the headline security lab — *the bug the green suite hid, found by a machine in 30s.*

> **⚠ Instructor sequencing note (validated in the dry-run).** BUG-1 lives in the *original*
> decoder. A rigorous FR-7 implementation in Module 3 adds the same bounds checks and therefore
> *already fixes BUG-1* — fuzzing that version finds nothing (we confirmed: the fixed decoder
> survives). That's not a failure, it's the deeper lesson: **bounds-checking at implementation
> time prevents the entire bug class.** To guarantee the live "found in 30s" crash, fuzz the
> **pre-FR-7 decoder** — either run this lab *before* Module 3, or `git stash` the FR-7 change /
> check out the starting `src/protocol.c`. Then contrast: same harness, vulnerable code crashes,
> hardened code survives.

## Lab 6c (gate hook) — block secrets before they commit

The strongest use of hooks is **blocking**, not logging. Add a `PreToolUse` gate that refuses
to write an obvious secret. `firmware-lab/.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Edit|Write",
        "hooks": [ { "type": "command",
          "command": "tools/secret-scan.sh" } ] }
    ]
  }
}
```

`tools/secret-scan.sh` reads the event JSON, greps the content for key patterns
(`AKIA[0-9A-Z]{16}`, `-----BEGIN .* PRIVATE KEY-----`, `ghp_…`), and **exits non-zero to
block** on a hit. Demo: ask Claude to add `const char *k = "AKIAIOSFODNN7EXAMPLE";` — the hook
blocks the write. This is policy-as-code: the harness enforces it regardless of model judgment.

### Where secrets *should* live (the positive half)

The gate says "not in the repo"; teams still need the answer to *then where?* Two rules:
- **Build/CI secrets** (API keys, signing keys): the CI secret store or a vault, injected as
  env vars at run time — never in source, never baked into the image.
- **Device secrets**: provisioned **per device** at manufacture (unique keys in secure storage
  or a secure element), never one shared key compiled into the firmware — one dumped image
  must not compromise the fleet.

Quick L3 exercise: have Claude grep the lab for anything violating either rule.

## Lab 6d (L4 in CI) — static analysis gate

Tighten the advisory cppcheck step in `.github/workflows/ci.yml` into a **gate** for new code,
and add `scan-build make` (clang static analyzer). Have Claude triage the findings and
suppress false positives with justification. Scanning is L4; the suppressions are L3.

## Lab 6e (sub-agent) — security-reviewer

`firmware-lab/.claude/agents/security-reviewer.md` (Read/Grep only): reviews a diff for
trust-boundary, memory-safety, and secret issues, reports with file:line and CWE where it
applies. Use it as a PR gate in Module 7.

> **If you ship under a standard** (MISRA C, IEC 62443, ISO 26262…): these labs are the
> *tooling* layer, not the compliance argument. Map the outputs — fuzz corpus, scan reports,
> triage records — onto your process's evidence requirements; Claude can draft that mapping,
> but your process owner ratifies it.

## Autonomy verdict

Security is the clearest **L3 + L4 split** in the course: fuzzing, secret-scanning, and static
analysis run **L4** unattended in CI; a human (with Claude) does **L3** triage and fixes. The
gate hook is the deterministic backstop under both.

## Capture / deliverable
- BUG-1 fixed; `fuzz/fuzz_proto.c` + a regression corpus.
- `tools/secret-scan.sh` + the `PreToolUse` gate hook.
- CI static-analysis step; `.claude/agents/security-reviewer.md`.

➡ Next: [Module 7 — Build & Integrate](07-build-integrate.md)
