# Claude Code Masterclass

A fast, practical reference for learning Claude Code CLI and teaching it to a team —
covering the core building blocks (skills, MCP, sub-agents, hooks, plugins) and how to
orchestrate them with a master agent.

> Author note: written as a self-study path **and** a ready-to-run masterclass outline.
> Official docs: https://docs.claude.com/en/docs/claude-code

---

## 1. The mental model (teach this first)

Everything in Claude Code is **context + tools + a loop**. Every feature is just a
different way to *package and scope* those three things. Once a team sees this, the
features stop feeling unrelated.

| Primitive | What it is | Lives in | Who invokes it |
|---|---|---|---|
| **Slash command** | A saved prompt | `.claude/commands/*.md` | You, by typing `/name` |
| **Skill** | Prompt + scripts + resources, model-selected | `.claude/skills/<name>/SKILL.md` | Claude, by matching the description |
| **MCP server** | External tools/data over a protocol | `.mcp.json` / `claude mcp add` | Claude, as tools |
| **Sub-agent** | A fresh Claude with its own context + tool set | `.claude/agents/*.md` | Claude (or you), via the Task tool |
| **Hook** | Shell command on an event | `settings.json` | The harness, automatically |
| **Plugin** | A bundle of all the above | a marketplace repo | Installed, then auto-wired |
| **Agent SDK** | Claude Code as a library | your own code | Your program's loop |

---

## 2. The fastest way to actually learn (1–2 days hands-on)

1. **Run `/help` and use Claude Code for real work for an hour.** Nothing teaches the
   loop faster than watching it edit, run, and self-correct.
2. **Skim the CLI surface:** `claude --help`, `claude mcp --help`, `claude plugin --help`.
3. **Build one of each primitive** in a throwaway repo, smallest possible version
   (see the hello-worlds below).
4. **Then read the docs once** — they click instantly after you've felt the shapes:
   https://docs.claude.com/en/docs/claude-code (and the Agent SDK section).

---

## 3. Hello-world for each primitive (the lab exercises)

### Slash command
`.claude/commands/standup.md`
```markdown
Summarize what changed in git today as standup notes.
```
Type `/standup`. That's the whole feature — a reusable prompt.

#### How it actually runs (the part everyone gets confused by)

A command `.md` is a **prompt, not a script.** Nothing in the file executes on its own.
When you type `/standup`, the harness injects the file's text as instructions, and *Claude*
does the work:

```
/standup typed
  -> harness loads standup.md text as an instruction
  -> Claude interprets it
  -> Claude runs real tools (git log, git status) itself
  -> Claude reads the output
  -> Claude formats the result per the prompt
```

So when a `standup.md` says "run `git log --since=midnight`", that line is *guidance for
Claude*, not a shell command the file runs. Claude is free to adapt it — e.g. our Unix-style
`git` example got adjusted to PowerShell on Windows automatically. A real script would have
just errored; the prompt flexed. **That adaptability is the whole point of a prompt over a
script.**

#### Consistent ≠ deterministic (teach this explicitly)

- A **script** runs identically every time, byte for byte.
- A **command/skill** steers Claude toward the same *shape and facts*, but the wording can
  vary run to run. It's "reliably similar," not "identical."

Same repo + `/standup` → same Done/In-progress/Next/Blockers structure, essentially the same
facts, slightly different phrasing. The model's judgment is layered on top — which is what
makes it adapt instead of break.

#### Command vs. just typing the request

You could always free-type "summarize today's git changes as standup notes." So why save a
command? Three reasons: **consistency** (same structure every time), **less typing + a shared
team vocabulary** (it's checked into the repo), and it **encodes decisions you don't want to
re-make** (our `standup.md` bakes in "fall back to the most recent day if nothing today,"
"mark Next as a guess," "omit Blockers if none").

**Rule of three:** free-type a request until you've asked for roughly the same thing three
times — *then* capture it as a command. Exploration stays free-form; rituals become commands.

#### Terminology, kept straight

A **slash command is the simplest kind of skill** — a prompt-only one. A full **skill** can
also bundle scripts, resource files, and a `description` that lets Claude auto-select it. So:
command ⊂ skill. Don't over-think the distinction; reach for a skill when you need
auto-triggering or bundled files (see next).

### Skill
`.claude/skills/pdf-report/SKILL.md`
```markdown
---
name: pdf-report
description: Generate a branded PDF report from a CSV. Use when the user asks for a PDF report.
---
Steps: read the CSV, build an HTML report using template.html in this folder, render to PDF.
```
**Key lesson: the `description` is the API.** Claude reads only the name + description
until it decides to use the skill, then loads the body. A vague description = the skill
never fires. Skills can also ship scripts and resource files in the same folder.

### MCP server (consume an existing one first)
```bash
claude mcp add --transport stdio sqlite -- npx -y @modelcontextprotocol/server-sqlite ./db.sqlite
```
**Lesson:** MCP is how Claude reaches *outside* the repo — databases, APIs, Slack, your
internal services. Transports: **stdio**, **SSE**, **HTTP**. You'll mostly *consume*
existing servers; building one is a later module.

### Sub-agent
`.claude/agents/reviewer.md`
```markdown
---
name: reviewer
description: Reviews a diff for bugs. Use proactively after code changes.
tools: Read, Grep, Glob
model: sonnet
---
You are a strict code reviewer. Report only real correctness bugs with file:line.
```
**Lesson:** a sub-agent has its **own context window** and **restricted tools**. That
isolation is the point — it keeps the main thread clean and caps what each helper can touch.

### Hook
`settings.json`
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "npx prettier --write $CLAUDE_FILE_PATHS" }]
      }
    ]
  }
}
```
**Lesson:** hooks are deterministic automation the *harness* runs, not Claude. This is how
you enforce "always format after edit," "never touch prod," etc. Common events:
`PreToolUse`, `PostToolUse`, `Stop`, `UserPromptSubmit`.

### Plugin
Once you have skills/agents/commands you like, bundle them into a repo with a
`marketplace.json`, then:
```bash
claude plugin marketplace add <repo>
claude plugin install <name>
```
**Lesson:** plugins are how you **distribute your masterclass kit to the whole team in one
command** — they can bundle skills, agents, commands, hooks, and MCP servers together.

---

## 4. The orchestration / master-agent module (the finale)

There are two distinct ways to do "master agent orchestrating workers." Teams confuse them.

### A. In-session orchestration (no code)
Your main Claude **is** the master. It spawns sub-agents via the Task tool, in parallel,
each with scoped tools, then synthesizes their results. Steer it with a planner command:

`.claude/commands/orchestrate.md`
```markdown
Break this task into independent subtasks. Spawn one sub-agent per subtask
in parallel, each returning only its conclusion. Then merge and report.
```
Great for research fan-out, multi-file refactors, parallel reviews. No infra, cheap to demo.

### B. Programmatic orchestration (Agent SDK)
When you need a **durable** loop — retries, scheduling, external triggers, a real control
plane — drive Claude Code from code. Your program is the master: it decides when to call
the model, how to route to specialized agent configs, and when to stop.

Python (`claude-agent-sdk`):
```python
from claude_agent_sdk import query

async for msg in query(prompt="...", options={...}):
    ...
```
TypeScript (`@anthropic-ai/claude-agent-sdk`): same shape, Node-native.

This is what you reach for to build a product, a CI bot, or a 24/7 service.

### Middle ground (no SDK, still recurring)
- **`/loop`** — run a prompt or command on an interval (or self-paced).
- **`/schedule`** — cron-style remote agents (routines).

**Rule of thumb to teach:** stay in-session (A) until you need persistence, triggers, or
non-interactive runs — then graduate to the SDK (B).

---

## 5. Suggested masterclass running order (½ day)

1. The loop + mental-model table — 15 min, live demo on real code
2. Commands → Skills → the "description is the API" lesson — 30 min
3. MCP: consume one server, explain transports — 20 min
4. Sub-agents + tool scoping + isolation — 30 min
5. Hooks for guardrails & automation — 20 min
6. Plugins: package & distribute the above — 20 min
7. Orchestration: in-session fan-out, then SDK + `/loop` / `/schedule` — 40 min
8. **Capstone lab:** a master command that plans → spawns reviewer + tester + implementer
   sub-agents → merges results — hands-on

---

## 6. Capstone lab idea

Build a `/ship-feature` command that:
1. Plans the change and splits it into subtasks.
2. Spawns an **implementer** sub-agent (Edit/Write/Bash), a **reviewer** sub-agent
   (Read/Grep only), and a **tester** sub-agent (Bash) in parallel where possible.
3. Merges their outputs, applies review fixes, and reports a summary.

This single exercise exercises commands, sub-agents, tool scoping, and orchestration at once.

---

## Quick reference: where things live

```
.claude/
  commands/      *.md   -> slash commands
  skills/<name>/ SKILL.md (+ scripts, resources) -> skills
  agents/        *.md   -> sub-agents
  settings.json         -> hooks, permissions, env, model
.mcp.json               -> MCP servers (project scope)
```

User-level equivalents live under `~/.claude/` (Windows: `C:\Users\<you>\.claude\`).
