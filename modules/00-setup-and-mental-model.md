# Module 0 — Setup & Mental Model

**SDLC stage:** none yet — orientation.
**You'll learn:** the agent loop, context, permission modes, `/init`, and the L2–L4 ladder.
**Lab:** clone `firmware-lab`, build it, have your first real conversation, generate `CLAUDE.md`.
**Time:** 20 min.

---

## 1. The loop (the whole product in one sentence)

> Claude Code is **context + tools + a loop**: it reads context, picks a tool, runs it locally,
> reads the result, and repeats until the goal is met.

Every feature you'll meet (commands, skills, MCP, sub-agents, hooks, plugins) is just a
different way to *package and scope* those three things. See [README §1](../README.md) for the
full primitive table — keep it open all day.

## 1b. The capability ladder (the through-line — teach this once, refer back all day)

The Claude Code building blocks aren't a flat list — they form a ladder where **each rung adds
exactly one new power.** Show this first; then every module is just "we're on this rung now."

| Rung | Building block | The one power it adds | You meet it in |
|---|---|---|---|
| 1 | **Prompt / command** | a saved, repeatable instruction | Module 0–1 |
| 2 | **Skill** | packaged + **auto-selected** by description, can bundle code | Module 4, 8 |
| 3 | **MCP tool** | **reach beyond the repo** (issue tracker, DB, APIs) | Module 1, 7 |
| 4 | **Sub-agent** | **delegated context** — a worker with its own window + scoped tools | Module 2, 4, 5, 6 |
| 5 | **Orchestration** | **many agents** composed in one task | Module 9 |
| 6 | **Dynamic workflow** | **self-directing** — the agent picks its next step from results | Module 9 |

Read it as a sentence: *a prompt becomes a skill, which can reach out via MCP, delegate to a
sub-agent, compose into orchestration, and finally route itself as a dynamic workflow.* Hooks
and plugins sit alongside (a hook is the harness enforcing a rule; a plugin bundles the whole
ladder for distribution — Module 10). **The higher the rung, the more autonomy in play** — which
is why the capability ladder and the L2–L4 autonomy ladder rise together.

## 2. Permission modes (know these before you let it touch firmware)

| Mode | Behaviour | Use when |
|---|---|---|
| default | asks before edits / non-read commands | learning, risky code |
| acceptEdits | auto-accepts file edits, still asks for commands | trusted refactor |
| plan | **read-only**: explores and proposes, changes nothing | design, audits |
| bypass | no prompts | sandboxed CI only (L4) |

These modes *are* the autonomy ladder made concrete: `plan`/default = L2, acceptEdits with
hooks = L3, bypass-in-CI = L4.

## 3. The autonomy ladder (the spine of this course)

Read the L2–L4 table in [COURSE.md](../COURSE.md). One line to remember:

> **L2 you approve each step · L3 you approve at checkpoints · L4 you audit outcomes.**

Every later module does a task at L2, repeats it at L3, and asks whether it should ever be L4.

## Lab 0 — clone, build, first contact

```bash
git clone https://github.com/kishore123/firmware-lab.git
cd firmware-lab
make && make test        # green build + 13 passing tests
./build/sensor-gw
```

Now have a **real conversation** — don't just read. Try:

- "Walk me through what `src/main.c` does in one duty cycle."
- "Where does untrusted input enter this codebase?" *(seeds the security thread — note the
  answer: `proto_decode`, `config_load`, `cli_dispatch`.)*

Then generate the project memory file:

```
/init
```

`/init` reads the repo and writes a `CLAUDE.md`. The lab already ships one — compare what
Claude proposes against the curated version and discuss: **`CLAUDE.md` is the always-loaded
context that makes every later step better.** A good one is the cheapest quality lever you have.

## Gotcha

`/init` can be verbose. The shipped `CLAUDE.md` is deliberately short — house rules + build
commands + the trust-boundary invariant. **Long context isn't free; curate it.**

## Capture

Nothing to capture yet — but notice you already wanted to re-ask "where does input enter?"
That instinct (the **rule of three**) is how you'll know when to turn a prompt into a command.

➡ Next: [Module 1 — Requirements](01-requirements.md)
