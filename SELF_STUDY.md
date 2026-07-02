# Claude Code SDLC Masterclass — Self-Directed Guide

You don't need to be in the room. This guide takes you through the whole course solo, at your
own pace, on real embedded-C code. Budget **one focused day** (or 5–6 evenings); everything is
hands-on and self-checking.

> Running a live session instead? See [instructor/INSTRUCTOR_GUIDE.md](instructor/INSTRUCTOR_GUIDE.md).
> Want the underlying "how does each primitive work" reference? See [README.md](README.md).

---

## What you'll be able to do at the end

1. Use every Claude Code building block — prompts, skills, MCP tools, sub-agents, hooks,
   orchestration, dynamic workflows — and know *which* to reach for.
2. Run each stage of the SDLC (Requirements → Release) with Claude Code on real C firmware.
3. Decide, per stage, how much autonomy to give the agent (L2 assisted → L3 supervised → L4
   delegated) and defend the call.
4. Install and adapt the team toolkit (`cc-masterclass-kit`) for your own repos.

## Before you start (20 minutes — don't skip)

1. **Claude Code installed and signed in.** Run `claude`, confirm `/help` works.
2. **A Linux build environment.** Mac/Linux are ready (`gcc`/`clang`, `make`). **On Windows,
   install WSL2 Ubuntu** — Modules 5–6 use AddressSanitizer and a fuzzer, which native
   Windows/MinGW does not provide. Then:
   ```bash
   sudo apt update && sudo apt install -y build-essential clang cppcheck gdb git python3
   ```
3. **Clone the lab and confirm a green baseline:**
   ```bash
   git clone https://github.com/kishore123/firmware-lab.git
   cd firmware-lab
   make && make test        # expect a clean build + 13 passing tests
   ./build/sensor-gw
   ```
   If that works, you're ready. If not, fix the environment now — every module builds on it.

## How to work through it

The course is **11 modules** in [`modules/`](modules/), each a single SDLC stage. Do them
**in order** — they share one continuous thread: the same feature (FR-7, add a CRC to the wire
frame) and the same four planted bugs carry across modules, so your work compounds.

Each module file has the same shape:
**concept → build the artifact live → demo → gotchas → capture it.**
Read the concept, then actually *do* the lab in your `firmware-lab` clone. Don't just read —
the whole point is feeling the loop.

| # | Module | ~Time | You produce |
|---|---|---|---|
| 0 | [Setup & mental model](modules/00-setup-and-mental-model.md) | 20m | `CLAUDE.md`, first real conversation |
| 1 | [Requirements](modules/01-requirements.md) | 30m | FR-7 spec + `/draft-req`; an MCP call to the issue tracker |
| 2 | [Design](modules/02-design.md) | 40m | ADR-0001 (incl. `## Threats` table) + a design-reviewer sub-agent |
| 3 | [Implementation](modules/03-implementation.md) | 35m | FR-7 CRC implemented; format hook + permission rules |
| 4 | [Test](modules/04-test.md) | 30m | tests that expose the bugs; `test-gen` skill |
| 5 | [Debug](modules/05-debug.md) | 35m | BUG-2/3/4 root-caused with gdb + ASan |
| 6 | [Security](modules/06-security.md) | 40m | fuzz harness finds BUG-1; secret-scan gate hook |
| 7 | [Build & integrate](modules/07-build-integrate.md) | 45m | headless build-fixer; agent PR review (injection-hardened); supply-chain pass (SHA-pins, SBOM, vendor audit) |
| 8 | [Release](modules/08-release.md) | 30m | v1.1.0 with generated notes + semver check; signed tag + `SHA256SUMS` |
| 9 | [Orchestration & dynamic workflow](modules/09-orchestration.md) | 35m | `/ship-feature`; static vs dynamic workflow |
| 10 | [Capstone & rollout](modules/10-capstone-and-rollout.md) | 40m | one feature end-to-end; install the kit |

Optional appendices:
- [Zephyr](modules/appendix-zephyr.md) — how all of this transfers to a real Zephyr tree.
- [After the tag](modules/appendix-post-release.md) (~45m) — post-release & maintenance:
  the hotfix drill and a CVE-watch routine. Strongly recommended if you ship devices.

## Checking your work (the honest way)

This is self-directed, so *you* are the grader. Two safety nets — **use them only after you've
tried**:

- **The bugs are described as symptoms** in `firmware-lab/requirements/backlog.md` (BUG-1..4).
  Hunt the root cause yourself first. The full answer key — exact file, root cause, and fix —
  is in [instructor/SEEDED_DEFECTS.md](instructor/SEEDED_DEFECTS.md). Peeking before you've
  driven Claude to the diagnosis robs you of the rep.
- **The finished end state** of every lab (FR-7 done, all bugs fixed, the whole `.claude/` kit)
  lives on the **`solution` branch** of `firmware-lab` *(ask the course owner for access — it's
  kept private so it doesn't spoil the labs)*. Diff your work against it when you're done with a
  module: `git diff main solution -- src/`.

Your objective check at every step is the code itself: **does it build warning-clean, and do
the tests pass for the right reason?** If yes, you're done; if a test passes on broken code,
that's a Module 4 lesson, not a win.

## The two ladders to keep in your head

- **Capability ladder** (Module 0): prompt → skill → MCP → sub-agent → orchestration → dynamic
  workflow. Each rung adds one power.
- **Autonomy ladder** (used everywhere): **L2** you approve each step · **L3** you approve at
  checkpoints · **L4** you audit outcomes. After each module, ask: *should this stage ever run
  at L4 on my real systems?* Module 10 makes you commit to an answer.

## After the course — make it stick

Install the toolkit you just learned and point it at your own code:

```bash
claude plugin marketplace add kishore123/cc-masterclass
claude plugin install cc-masterclass-kit@cc-masterclass
```

See [plugins/cc-masterclass-kit/README.md](plugins/cc-masterclass-kit/README.md). Then adapt
`/draft-req`, `/ship-feature`, and the reviewers to your repo's paths and house rules — that
act of adaptation is the course's core habit (capture a good workflow, then reuse it).

Start now: [Module 0 →](modules/00-setup-and-mental-model.md)
