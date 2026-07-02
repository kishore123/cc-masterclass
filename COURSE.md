# Claude Code SDLC Masterclass — Course Map

> **Audience:** embedded / Linux / device-driver engineers working in C.
> **Format:** in-person, hands-on, ~4 hours (with a take-home track for depth).
> **Lab repo:** [`firmware-lab`](https://github.com/kishore123/firmware-lab) — a host-buildable
> sensor-gateway firmware you take from a backlog item to a tagged release.
> **This repo** ([`cc-masterclass`](https://github.com/kishore123/cc-masterclass)) holds the
> teaching material, the `.claude/` artifacts you build, the instructor guide, and the
> seeded-defect answer key.

The original [`README.md`](README.md) is the **mechanics reference** — how each Claude Code
primitive (command, skill, MCP, sub-agent, hook, plugin, orchestration) actually works, built
and verified live. This `COURSE.md` is the **process spine** that puts those primitives to
work across a real SDLC on real C code.

> **Working through this solo?** Follow [SELF_STUDY.md](SELF_STUDY.md) — a self-paced path with
> time estimates and self-check instructions. **Want the team toolkit?** Install
> [`cc-masterclass-kit`](plugins/cc-masterclass-kit/README.md):
> `claude plugin marketplace add kishore123/cc-masterclass` then
> `claude plugin install cc-masterclass-kit@cc-masterclass`.

---

## The one idea: SDLC stage × Claude Code primitive × autonomy level

Every module answers three questions at once:

1. **Which SDLC stage** are we doing? (Requirements → … → Release)
2. **Which Claude Code primitive** is the right tool here? (and which are *not*)
3. **How much autonomy** should Claude have for this stage — and why?

### The autonomy ladder (defined once, used everywhere)

| Level | Name | Who drives | Claude's job | Guardrails | Human gate |
|---|---|---|---|---|---|
| **L2** | Assisted | Human, step by step | Expert pair: suggest, draft, explain | Permission prompts, plan mode | Every action |
| **L3** | Supervised workflow | Claude runs a multi-step flow | Execute commands/skills/sub-agents to a defined plan | Hooks, permission rules, scoped tools | At defined checkpoints (plan approval, PR review) |
| **L4** | Delegated | Claude, headless | Run unattended (CI, `claude -p`, Agent SDK, routines) | Policy-as-code, sandboxed CI, audit log | Outcome audit only |

> L1 (raw autocomplete) and L5 (no human in the loop at all) are named for completeness but
> are **out of scope**: L1 isn't agentic, and L5 is not something we recommend for shipping
> firmware. The course lives in **L2–L4**, and a core outcome is judgment about *which stages
> earn L4 and which must stay L2*.

**The recurring move:** do a task at L2, then the same task at L3, then ask "should this ever
be L4?" Feeling the trade-off beats being told it.

---

## Module index

| # | SDLC stage | Primary Claude Code concepts | Lab on `firmware-lab` | Autonomy arc |
|---|---|---|---|---|
| [0](modules/00-setup-and-mental-model.md) | Setup & mental model | the loop; context; permission modes; `/init` + `CLAUDE.md` | clone, build, first conversation | — |
| [1](modules/01-requirements.md) | Requirements | prompting; plan mode; `AskUserQuestion`; capture a command; **MCP tool** (issue tracker) | turn backlog FR-7 into a spec w/ acceptance criteria + traceability; pull/link the GitHub issue via MCP | L2→L3 |
| [2](modules/02-design.md) | Design | `Explore`/`Plan` sub-agents; plan mode; ADRs; **design-time threat modeling**; context mgmt | design the CRC frame change; threat-model the frame (ADR `## Threats` table); design-reviewer sub-agent critiques | L2→L3 |
| [3](modules/03-implementation.md) | Implementation | `CLAUDE.md` rules; commands; format-on-edit hook; permission rules | implement FR-7 CRC; hook auto-formats; rules forbid hot-path heap | L2→L3 |
| [4](modules/04-test.md) | Test | test-writer sub-agent; skills bundling scripts; coverage | generate the tests that catch BUG-1/BUG-4; capture a `test-gen` skill | L3 |
| [5](modules/05-debug.md) | Debug | driving gdb/ASan; log reading; hypothesis loop | hunt BUG-3, BUG-4, BUG-2 from symptoms only | L2→L3 |
| [6](modules/06-security.md) | Security | `/security-review`; gate hooks; security sub-agent; fuzzing; where secrets *should* live | fuzz `proto_decode` (BUG-1); secret-scan hook; scan-build in CI | L3→L4 |
| [7](modules/07-build-integrate.md) | Build & integrate | headless `claude -p`; build-fixer loop; `/code-review`; CI bot; **prompt injection**; supply chain (SHA-pinning, SBOM, vendor audit) | break the build, let an L4 fixer repair it; agent + human PR review | L3→**L4** |
| [8](modules/08-release.md) | Release | release-notes skill; `/schedule` routines; semver hook; **signed tags + artifact digests** | cut v1.1.0: agent drafts notes, human approves, hook checks semver, tag is signed | L3→L4 |
| [9](modules/09-orchestration.md) | Orchestration & dynamic workflow | Task fan-out; orchestrator command; Agent SDK; `/loop`; when *not* to | `/ship-feature`: plan → implementer + reviewer + tester → merge | L3→L4 |
| [10](modules/10-capstone-and-rollout.md) | Capstone & rollout | plugin marketplace; team distribution; metrics | one backlog item, requirement → tagged release, autonomy chosen per stage | all |

Each module file follows the house format proven in the README:
**concept → build the artifact live → demo → gotchas → capture it (rule of three).**

**Appendices (take-home):**
- [Zephyr — instructor demo + take-home](modules/appendix-zephyr.md) — why Zephyr is a demo,
  not the lab, and how everything here transfers to your real Zephyr tree.
- [After the tag — post-release & maintenance](modules/appendix-post-release.md) — OTA,
  rollback, field triage, the hotfix drill, and a CVE-watch routine; the half of the
  lifecycle that starts where the live course ends.

---

## How the pieces relate

```
firmware-lab (the work)            cc-masterclass (the learning)
─────────────────────              ─────────────────────────────
requirements/backlog.md  ─────►    modules/01..10  (what to do, how to do it w/ Claude Code)
src/*.c  (defects + FR-7) ─────►    instructor/SEEDED_DEFECTS.md (answer key)
.claude/  (you build it) ◄─────    artifacts authored during each module
Makefile / CI            ─────►    Module 7 build-fixer + Module 6 scan gate
                                   README.md  (primitive mechanics reference)
```

Start at [Module 0](modules/00-setup-and-mental-model.md). Instructors: read
[instructor/INSTRUCTOR_GUIDE.md](instructor/INSTRUCTOR_GUIDE.md) first.
