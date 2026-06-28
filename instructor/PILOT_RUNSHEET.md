# Pilot run-sheet

Drive the pilot from this. Print it or keep it open and **mark up the Notes column as you go** —
the friction you capture is the whole point of a pilot. The "Expected" column is your
pass/fail check at each step. Times are for a solo/small-group run; instructor-led is faster.

**Recommended first pilot = the critical path** (★ rows): one feature, requirement → tested →
fuzzed, plus the two riskiest labs (environment + sanitizers). ~2.5–3 hrs. Do the rest in a
second pass.

> Tip for an honest "newbie" run: clone into a **fresh folder** (`mkdir ~/pilot && cd ~/pilot`)
> so you feel the cold clone → build → first-conversation flow, not your already-set-up repo.

---

## Pre-flight (5 min)

> **Assumes the pre-work email is already done** — i.e. WSL2 (Windows) and the toolchain
> (`build-essential clang cppcheck gdb`) are installed. This is a *verification gate*, not a
> setup guide. If you're on a fresh machine, run the pre-work email steps first
> ([PILOT_PREWORK_EMAIL.md](PILOT_PREWORK_EMAIL.md), step 2 installs WSL2), then come back here.

| ✓ | Check | Expected |
|---|---|---|
| ☐ | `claude` opens, `/help` works | TUI + command list |
| ☐ | `git clone …/firmware-lab && cd firmware-lab` | clones |
| ☐ | `make && make test` | clean build, **13 Tests 0 Failures** |
| ☐ | `clang --version`, `cppcheck --version`, `gdb --version` | all present (Modules 5–6 need them) |

---

## Modules

| ★ | # | Module | Do this | Expected result | Time | Notes (friction?) |
|---|---|---|---|---|---|---|
| ★ | 0 | Setup & mental model | Open `claude`; ask "walk me through `src/main.c`"; ask "where does untrusted input enter?"; run `/init` | Sensible tour; names `proto_decode`/`config_load`/`cli`; `/init` drafts a CLAUDE.md | 20 | |
| ★ | 1 | Requirements | `/draft-req FR-7` | Asks clarifying Qs, then drafts requirement + acceptance criteria + traceability row | 20 | |
| ★ | 2 | Design | Plan-mode: explore impact of adding a CRC; have it draft an ADR | Fan-out finds encode/decode call sites + size budget; ADR written | 25 | |
| ★ | 3 | Implementation | Ask Claude to implement FR-7 (CRC-16) per the ADR; build + test each step | New `crc16.*`, decode validates CRC, tests updated & green; `-Wall -Wextra` clean | 40 | |
| ★ | 4 | Test | Ask for tests probing malformed `proto_decode` + `rb_peek` wrap (see Module 4 ⚠ note) | New tests; the wrap test exposes the latent bug | 20 | |
| ★ | 6 | Security | Build the libFuzzer harness; `./fuzz/fuzz_proto -max_total_time=30` | ASan **heap-buffer-overflow** + crash artifact in seconds (BUG-1) | 30 | |
|  | 5 | Debug | Reproduce BUG-3 (config `{"uplink":{}}`) under gdb; BUG-2/4 under ASan | gdb shows null-deref line; ASan shows the overflows | 25 | |
|  | 7 | Build & integrate | Break the build on purpose; run `claude -p "fix the build…"` | Headless loop edits → `make` → repairs → tests green | 20 | |
|  | 8 | Release | Run the `release-notes` skill since last tag | Grouped Features/Fixes/Security draft tied to backlog IDs | 15 | |
|  | 9 | Orchestration | `/ship-feature FR-6a` | Plans, fans out implementer+reviewer+tester, merges, runs tests | 20 | |
|  | 10 | Rollout | `claude plugin marketplace add kishore123/cc-masterclass` then install the kit | Plugin installs enabled; skills appear namespaced | 10 | |

---

## After the pilot — friction summary (fill in)

- **Environment:** anything that broke in pre-work / pre-flight? →
- **Prompts/commands that didn't fire as written:** →
- **Timing reality vs. the sheet** (too long / too short where?): →
- **Where I got stuck or confused as a "newbie":** →
- **Top 3 fixes before the real rollout:** →

Feed these back into the module text, the pre-work email, and the instructor guide before
inviting the wider group.
