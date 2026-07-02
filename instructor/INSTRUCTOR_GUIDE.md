# Instructor Guide

How to run the Claude Code SDLC Masterclass for an embedded-C team. Read this, then
[SEEDED_DEFECTS.md](SEEDED_DEFECTS.md), then skim every `modules/*.md`.

---

## What attendees walk away with

1. A working mental model of every Claude Code primitive (from the README mechanics).
2. Hands-on reps doing **each SDLC stage** with Claude Code on real C firmware.
3. Judgment about **autonomy** — which stages earn L4, which stay L2, and why.
4. A reusable team toolkit (`cc-masterclass-kit` plugin) they can install Monday.

## Pre-work email (send 3+ days out — this protects your 4-hour budget)

> **Subject: Before the Claude Code workshop — 20 min of setup**
>
> 1. **Claude Code installed and signed in.** Run `claude` once; confirm `/help` works.
> 2. **A Linux build environment.** Mac/Linux: you're set (`gcc`/`clang`, `make`). **Windows:
>    install WSL2 Ubuntu** — we need AddressSanitizer and a fuzzer, which MinGW on Windows
>    does not provide. In WSL: `sudo apt update && sudo apt install -y build-essential clang
>    cppcheck gdb git`.
> 3. **Clone and verify the lab:**
>    ```bash
>    git clone https://github.com/kishore123/firmware-lab.git
>    cd firmware-lab && make && make test     # expect a green build + 13 passing tests
>    ./build/sensor-gw
>    ```
> 4. Reply "verified" or send me the error. **Do not skip step 3** — a room of people
>    debugging `apt` is the workshop failing.

Have a couple of cloud dev containers / spare WSL images ready for stragglers.

## The 4-hour run sheet

Tight but real. Times assume the pre-work landed. The lab is a continuous thread: the **same
FR-7 feature** and the **same backlog defects** carry across modules, so momentum compounds.

| Time | Module(s) | What happens | Autonomy beat |
|---|---|---|---|
| 0:00–0:20 | 0 Setup & mental model | the loop live; `/init` writes `CLAUDE.md`; the L2–L4 ladder slide | — |
| 0:20–0:45 | 1 Requirements | take FR-7 from one backlog line to a spec w/ acceptance criteria; capture `/draft-req` | L2 → L3 |
| 0:45–1:15 | 2 Design + 3 Implementation | `Explore` fan-out on the codebase; plan-mode the CRC change; **threat-model the frame** (5-min beat — the ADR gains a `## Threats` table; land "CRC ≠ tamper-proofing"); implement it with a format-on-edit hook + `CLAUDE.md` rules | L2 → L3 |
| 1:15–1:25 | — | **break** | — |
| 1:25–1:50 | 4 Test | sub-agent writes the tests that catch BUG-1/BUG-4; coverage; capture `test-gen` skill | L3 |
| 1:50–2:25 | 5 Debug | hunt BUG-3 (gdb), BUG-4 + BUG-2 (ASan) from symptoms only | L2 → L3 |
| 2:25–3:05 | 6 Security | fuzz `proto_decode` → BUG-1 crash → fix → regression corpus; secret-scan hook blocks a planted key; 2-min beat: where secrets *should* live | L3 → L4 |
| 3:05–3:35 | 7 Build & integrate + 8 Release | break the build; headless `claude -p` fixer loop; `/code-review`; the prompt-injection gotcha (the CI reviewer reads attacker-controlled PRs); cut v1.1.0 with a semver hook + **signed tag** | L3 → **L4** |
| 3:35–4:00 | 9 Orchestration + 10 Rollout | `/ship-feature` fan-out live; package & install `cc-masterclass-kit`; autonomy decision rubric; Q&A | L3 → L4 |

**If you have a full day:** give each of 5–9 its own 30–40 min slot, let attendees drive
solo, and run the Zephyr appendix demo (below). The 4-hour version is instructor-driven with
attendees following along; the full-day version is attendee-driven with you circulating.

**Take-home additions — don't try to fit them in the 4 hours.** Supply-chain hygiene
(Lab 7e), sign-what-you-ship (Lab 8e), and the
[post-release appendix](../modules/appendix-post-release.md) (CVE-watch routine + the hotfix
drill) are flagged take-home in the modules. Point at them explicitly in the close — the
hotfix drill is the single best post-course exercise, so sell it.

## Live-demo failure kit (things that bite, and the recovery)

- **A sub-agent created mid-session isn't selectable** until reload — demo with built-in
  `Explore`, then `/agents` after restart. (Documented in README.)
- **A hook added mid-session may not fire** until `/hooks` is opened once. Open it on stage.
- **MinGW/Windows has no ASan** — if someone skipped WSL, pair them with a neighbor for the
  Debug/Security modules. Don't try to make MinGW sanitize; you'll lose 10 minutes.
- **Workers reason plausibly but wrong** — the reviewer false-positive story (README) is a
  feature, not a bug: use it to teach "the orchestrator owns final judgment."
- **Line numbers in the answer key drift** as attendees edit — search by function name.
- **`git tag -s` fails without a configured signing key** — fall back to `-a` on stage and
  point at Lab 8e for the why; do not debug GPG in front of a room.

## Lab validation status (what's been run end-to-end)

The security/debug labs were dry-run on **Ubuntu 26.04 LTS (WSL2), clang 21 / gcc 15**, on a
fresh `git clone`. Confirmed working as written:

| Lab | Validated result |
|---|---|
| 6b — fuzz `proto_decode` (BUG-1) | libFuzzer+ASan → `heap-buffer-overflow in __asan_memcpy`, crash artifact written, < 5s |
| 5b — BUG-2 (config strcpy) | ASan → `stack-buffer-overflow WRITE of size 61 in strcpy` |
| 5a — BUG-3 (missing `port`) | SIGSEGV, exit 139 |
| 5b — BUG-4 (peek wrap) | ASan → `stack-buffer-overflow READ in rb_peek`; fix returns the correct wrapped value |
| Solution branch | `make test` 21/21 green; fuzzing the fixed decoder survives (no crash) |

Two things the dry-run *fixed*, now baked into the materials: the BUG-4 repro/test construction
(see the ⚠ notes in Modules 4–5 and the answer key) and the BUG-1/FR-7 sequencing (Module 6 ⚠
note). **Sanitizer labs require Linux/macOS/WSL — they do not run on native Windows/MinGW.**

## Autonomy decision rubric (the closing discussion — don't skip)

Put this on the board and fill it in with the room for *their* real systems:

| Stage | Safe ceiling for us | Why |
|---|---|---|
| Requirements | L2–L3 | human owns intent; Claude drafts |
| Design | L2–L3 | architectural judgment stays human-gated |
| Implementation | L3 | guarded by rules + tests + review |
| Test | L3–L4 | generation is delegable; the suite is the check |
| Debug | L2–L3 | interactive by nature |
| Security scan | L3–L4 | scanning delegable; triage human |
| Build/integrate | L4 | deterministic, CI-sandboxed, auditable |
| Release | L3–L4 | automate mechanics, human approves the cut |
| Post-release (CVE watch, field triage) | L3–L4 | machines watch (L4); a human owns the response (L3) |

The point isn't the "right" answers — it's that the team leaves with a shared, defensible
position they can take to their safety/quality process.
