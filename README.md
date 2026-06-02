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

#### How a skill actually fires (we built one: `git-insights`)

A skill is a **folder**, not a single file. Minimum contents = one file named exactly
`SKILL.md`; optional extra files (scripts, templates) ship alongside it:

```
.claude/skills/git-insights/
  SKILL.md       <- REQUIRED. frontmatter (name + description) + instructions
  insights.py    <- OPTIONAL bundled script (only if the skill runs code)
```

The round-trip when you say *"give me insights on this repo"* (no slash typed):

```
You: "give me insights on this repo"
  -> Claude scans every skill's name + description
  -> your phrasing matches git-insights' description
  -> Claude auto-selects it            <- the key difference from a command
  -> Claude reads SKILL.md's body for the first time (lazy load)
  -> body says: run python .claude/skills/git-insights/insights.py
  -> Claude runs the bundled script
  -> Claude formats the script's output for you
```

Two things to teach from this:

1. **The match is semantic, not keyword.** You said "insights on this repo," not
   "git-insights" or "stats" — it fired because the *description* covers that intent.
   This is why you write the description for **how people actually ask**, not for yourself.
2. **The script ran because SKILL.md told Claude to** — the skill is still a prompt; it
   just happens to instruct Claude to execute a bundled file. That bundling (shipping code
   + resources next to the prompt) is the thing a plain command can't do.

#### Command vs. skill, side by side

|  | Slash command (`/standup`) | Skill (`git-insights`) |
|---|---|---|
| Lives in | one `.md` in `commands/` | a **folder** with `SKILL.md` |
| Invoked by | **you** typing `/name` | **Claude**, by matching the description |
| Selection | explicit | **semantic, automatic** |
| Body loaded | every time | **lazily**, only when it fires |
| Can bundle scripts/files | no | **yes** |

A **slash command is the simplest kind of skill** (prompt-only). Reach for a full skill
the moment you need **auto-triggering** or **bundled files/code**.

### MCP server (consume an existing one first)
```bash
claude mcp add --transport stdio sqlite -- npx -y @modelcontextprotocol/server-sqlite ./db.sqlite
```
**Lesson:** MCP is how Claude reaches *outside* the repo — databases, APIs, Slack, your
internal services. Transports: **stdio**, **SSE**, **HTTP**. You'll mostly *consume*
existing servers; building one is a later module.

#### A live MCP call (worked example: Google Drive)

An MCP server registers its tools **directly into Claude's toolset** — no skill or command
needed. Ask in plain language and Claude routes the call:

```
You: "list my last 5 Drive files"
  -> Claude routes: server = Google Drive, tool = list_recent_files, arg = pageSize:5
  -> the call leaves your machine, hits Google's API via the MCP server
  -> server returns live JSON (titles, ids, mimeTypes, modified times, a nextPageToken)
  -> Claude formats it for you
```

Three things this proves:
1. **No local copy of the logic.** Nothing in your repo knows how to talk to Drive — the
   server holds that, runs remotely, and is always current. This is the "server-hosted, no
   staleness" case we contrast against skills (skills/commands are always local files).
2. **Reach beyond the repo.** It returned real Drive data — outside files + shell. That
   extension of reach is the entire point of MCP.
3. **Auto-routing from one sentence: server -> tool -> args.** The response's
   `nextPageToken` is how "show more" would paginate. Routing quality rides on the tool's
   **own `description`** — the "description is the API" throughline, again.

Honest edge: a **read** fires directly; a **write** (create/delete/send) should be
**confirmed first**, not silently auto-executed.

#### Mental model: one merged menu (skills + MCP tools + built-ins)

This is the orchestration insight that ties the modules together:

- Claude doesn't check skills *first* and fall back to MCP. **Everything available — skills,
  MCP tools, built-in Bash/Read — is on one table at once**, and Claude picks the best fit
  by matching intent against all their descriptions. Holistic selection, not ordered fallback.
- A workflow is often a **mix**: maybe one skill, maybe three raw tools, often both. And a
  **skill can itself orchestrate MCP tools** (its body says "call Drive's `list_recent_files`,
  then Gmail's `search_threads`, then summarize").
- **Saving a liked workflow as a skill = freezing a good composition** so next time it's one
  named step instead of re-derived (the rule-of-three capture).

> **MCP gives Claude new _verbs_; skills/commands are _sentences_ that use those verbs in a
> repeatable way.**

#### Two doors to a skill: auto vs. explicit

Auto-selection is the default, not the only door:

| Door | How | When |
|---|---|---|
| **Auto** | natural language ("give me repo insights") | you want Claude to route; don't care which capability fires |
| **Explicit** | type `/git-insights` | you know exactly what you want; guarantee *this* skill, no routing guess |

Syntax note: it's **`/<skill-name>`** (e.g. `/git-insights`), **not** `/skills/<name>`. Same
`/name` form as a command — because a command *is* the simplest skill. Explicit invocation
pins *which* skill runs; the body still executes with model judgment (you pin the *which*,
not the byte-for-byte *how*).

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

#### Agent vs. sub-agent (same thing, different position)

"Agent" = anything that is *context + tools + a loop* — **the main session is an agent too.**
"Sub-agent" = an agent another agent **spawns as a worker** and that reports back up. The
"sub-" is positional, not a different technology.

```
You
 └─ Main agent (me)        <- an agent; runs the orchestration loop
      ├─ reviewer          <- a sub-agent: own context, scoped tools, returns only its result
      └─ tester            <- another, can run in parallel
```

Your mental model, confirmed: a sub-agent runs in its **own context**, does **one scoped
task**, with **only the tools you grant**, and hands back **only its final answer** (its
scratch work — even 20 files read — never enters the main context). That last bit is the
quiet superpower: heavy digging stays in the worker; the main thread stays clean.

#### Lifecycle: spawned per task, not a waiting daemon

`reviewer.md` is **inert definition on disk** — nothing runs until I delegate. Each
`Task(reviewer)` call spins up a **fresh, cold, stateless** instance that does the job,
returns, and is torn down. Spawn it twice = two independent instances with no shared memory.
**The loop lives in the orchestrator (me), not the worker** — a sub-agent is a *function
call*, not a *service*. (The persistent "waits for triggers" model is the Agent SDK /
scheduled routines, a different layer — see orchestration.)

#### Where they run: local PC + the model API

A sub-agent is **not a separate machine**. The harness, every agent loop, and **all tool
execution (Read, Bash, git) run locally on your PC**; only the **reasoning** happens on
Anthropic's servers via each agent's own API calls. "Parallel" = concurrency inside your one
local session, with the model calls overlapping. So fan-out is bounded by **your local I/O +
your API limits**, not free horizontal scale. (Genuinely remote agents — `/code-review
ultra`, scheduled routines — are a different feature set.)

#### Scope: same project / user / built-in model as everything else

| Scope | Path | Available in |
|---|---|---|
| **Project** | `<repo>/.claude/agents/` | only that repo (commit it → travels with the repo) |
| **User** | `~/.claude/agents/` | all your repos |
| **Built-in** | shipped with the harness | always (`Explore`, `general-purpose`, `Plan`, …) |

Our `reviewer` is **project-scoped**. Custom agents are **not** global — only built-ins are.

#### Two gotchas we hit live (worth teaching)

1. **Registration needs a session reload.** A sub-agent file created *mid-session* isn't
   selectable yet — custom agents register when Claude Code loads `.claude/agents/`. We had
   to demo with the built-in `Explore` instead; `reviewer` shows up after restart (`/agents`
   to verify). Built-ins work immediately; custom ones add role + format + tool-scope but
   cost you the reload.
2. **Workers aren't oracles — the orchestrator must verify.** Our reviewer flagged an
   `IndexError` in `insights.py` that **wasn't real** (a Python conditional short-circuits
   before the unsafe call). A read-only worker on a cheaper model reasoned plausibly but
   wrong. **Delegation buys isolation + parallelism; you pay in coordination, and the main
   agent owns final judgment.**

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

#### The key distinction: harness-runs, not model-decides

Every primitive before this — commands, skills, MCP, sub-agents — is something **Claude
chooses** to invoke. A hook is the opposite: **the harness fires it automatically on an
event, outside the model loop.** No description-matching, no judgment. That makes hooks the
tool for **guarantees**.

```
Claude's primitives:  model decides  -> "consistent, not deterministic"
Hooks:                harness decides -> deterministic, every matching event
```

Three parts: **event** (`PostToolUse`), **matcher** (which tools, `Edit|Write`), **command**
(shell to run). The command gets the **event JSON on stdin** (`tool_name`, `tool_input.file_path`, …).

#### We built one: conditional `.py`-edit logger (and it fired live)

`.claude/settings.json` registers a `PostToolUse`/`Edit|Write` hook that runs a script:

```json
{ "hooks": { "PostToolUse": [ { "matcher": "Edit|Write",
  "hooks": [ { "type": "command",
    "command": "powershell -NoProfile -File .claude/hooks/log-py-edits.ps1" } ] } ] } }
```

The script (`.claude/hooks/log-py-edits.ps1`) reads the stdin JSON and logs **only `.py`**
edits — that `if file ends with .py` test is **rule-logic inside the hook** (the matcher is
coarse; the script is the fine rule). When we edited `insights.py`, a line appeared in
`hook.log` **without Claude choosing to write it** — the harness did. Editing a `.md` file
produced nothing. That's the whole lesson in one observation.

#### Rules & guidelines a hook can carry (three layers)

1. **Matcher** — *when* it triggers (which event/tools).
2. **Script logic** — *whether* to act, by inspecting the stdin payload (file type, path, args).
3. **Decision back to the harness** — a `PreToolUse` hook can **block** an action (non-zero
   exit / a permission-decision JSON), or **inject context** (`UserPromptSubmit`). So hooks
   don't just observe — they **gate and steer**.

#### Can a hook call an MCP tool?

Not as a normal shell hook — MCP tools live in **Claude's loop**; a `command` hook runs
*outside* it. Two clean bridges: (a) the hook script **calls the external service directly**
(its own API/CLI), or (b) the hook **feeds context back** and lets Claude make the MCP call.
*(Advanced: the hooks schema also supports `type: "mcp_tool"`, `"prompt"`, `"agent"`, and
`"http"` hooks — so the harness itself can invoke an MCP tool as a hook. The plain "shell
command can't call an MCP tool" rule is about `type: "command"`.)*

#### Two gotchas we hit live (worth teaching)

1. **Watcher registration.** A `settings.json` created *mid-session* may not be watched
   until you open `/hooks` once or restart — the watcher only tracks dirs that had a settings
   file at session start. (Ours happened to fire; don't rely on it — verify with `/hooks`.)
2. **Hooks run real shell, silently, on every match.** That's the power *and* the footgun:
   a bad command fires every time. Keep them safe (we logged, didn't mutate), pick the right
   **scope** (`settings.json` = shared/committed vs `settings.local.json` = personal/gitignored),
   and remember the generated output (`hook.log`) is an artifact — **gitignore it.**

### Plugin
**Lesson:** a plugin **bundles the primitives** (commands + skills + agents + hooks + MCP
configs) into one installable unit — the answer to "give the whole team this exact toolkit."

#### Do you still need a marketplace? (Claude Code 2.1.x) — two paths

The marketplace is **no longer required for authoring/personal use** — it's now reserved for
*distribution*:

| Goal | Marketplace? | How |
|---|---|---|
| **Author / use locally** | **No** | `claude plugin init <name>` scaffolds into `~/.claude/skills/<name>/` and **auto-loads** as `<name>@skills-dir`. Zero marketplace. |
| **Distribute to a team** | **Yes** | publish to a marketplace (git/GitHub/local path); others `claude plugin install`. `claude plugin tag` cuts release tags. |

`~/.claude/skills/` does **double duty**: a folder with a `.claude-plugin/plugin.json` loads
as a **plugin**; a folder with just `SKILL.md` loads as a **bare skill**. The `@skills-dir`
pseudo-marketplace is what auto-scans that directory.

#### We built one: `cc-masterclass-kit` (bundling all four primitives)

```
~/.claude/skills/cc-masterclass-kit/
  .claude-plugin/plugin.json          # manifest: name, version, description, author
  commands/standup.md                 # the command
  agents/reviewer.md                  # the sub-agent
  skills/git-insights/SKILL.md (+ insights.py)   # the skill + its script
  hooks/hooks.json (+ log-py-edits.ps1)          # the hook config + its script
```

Flow we used: **`init` → populate → `validate` → `/reload-plugins`.**

- **`init` auto-fills** name, version (`0.1.0`), author, `$schema` — and leaves the
  **description** + contents as `TODO`. Like `npm init`: valid skeleton, details are yours.
- **You populate**: drop in the four primitives, write a real description.
- **`claude plugin validate <path>`** catches manifest/frontmatter errors (it flagged our
  command's missing frontmatter; we added a `description`).
- **`/reload-plugins`** loads it **without a full restart** (or restart). Result:
  `cc-masterclass-kit@skills-dir · v0.1.0 · user scope · loaded`.

#### Hooks in a plugin live in the plugin, not your settings.json

A plugin can't (and shouldn't) edit a user's `settings.json`. So its hook ships in the
plugin's **own `hooks/hooks.json`**, and the harness **auto-merges** it when the plugin loads.
The installer **touches no settings file** — enable the plugin, the hook is active; disable/
uninstall, it's gone. Use **`${CLAUDE_PLUGIN_ROOT}`** for paths so the hook finds its script
wherever the plugin lands on each machine.

| | `settings.json` hook | plugin `hooks/hooks.json` |
|---|---|---|
| Installed by | each person, by hand | the plugin, automatically |
| To get it | paste into settings | enable the plugin |
| To remove | hand-edit settings | disable/uninstall plugin |

#### Namespacing resolves duplicates

After load, plugin components are namespaced **`<plugin>:<name>`** — e.g.
`cc-masterclass-kit:standup`, `cc-masterclass-kit:git-insights` — so they coexist with any
project-scope `standup`/`git-insights` instead of colliding. (In a real rollout you'd ship the
plugin *instead of* hand-placed files, not alongside them.)

#### Distribution (the team path), in brief

```bash
claude plugin marketplace add <repo-or-path>      # register the hub once
claude plugin install cc-masterclass-kit@<market> # pull it
claude plugin update  cc-masterclass-kit          # restart required to apply
```

This is the **managed-local** distribution from the scopes discussion: the marketplace (a git
repo) is the source of truth; `update` re-pulls. One artifact, two delivery modes —
auto-load locally now, marketplace-distribute later.

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

### Three scopes (they merge at session start)

| Scope | Path | Visible to |
|---|---|---|
| **Project** | `<repo>/.claude/` | anyone who clones the repo (versioned with the code) |
| **User** | `~/.claude/` | just you, across every repo |
| **Plugin** | `~/.claude/plugins/` | bundles you install from a marketplace |

The built-in commands you see (`/code-review`, `/verify`, `/simplify`…) come from the
**plugin** layer, not files you wrote.

### Local vs. a company "skills hub" (and staleness)

**Core truth: skills/commands always load from the local filesystem.** There is *no*
"point Claude at a hub URL and it fetches the skill live mid-conversation." At session
start Claude reads the files physically present in the folders above. So there is always a
**local copy** — deliberately, because a skill can ship executable code (`insights.py`),
and you don't want that silently pulled from a remote at run time.

But that does **not** mean hand-copied, rotting files. A **plugin marketplace** *is* the
company hub — just a git repo of bundled skills/commands/agents:

```bash
claude plugin marketplace add <company-repo>   # register the hub once
claude plugin install <bundle>                  # pulls it local
claude plugin update  <bundle>                  # re-syncs to latest
```

So the model is **managed-local**, not manual-local: the hub is the source of truth, and
`update` re-pulls. Three ways to keep current:

1. **Marketplace + `update`** (recommended for a company) — versioned, auditable, rollback-able.
2. **Make the folder a synced checkout** — `.claude/skills/` as a git submodule, or a
   `~/.claude/` your team `git pull`s. Hub stays authoritative; local is just a clone.
3. **Project scope for repo-specific skills** (like `git-insights`) — they live *in the
   repo*, versioned with the code, so cloning = getting the current skills, no drift.

**When you truly need always-fresh, centrally-hosted logic with no local copy at all,
that's not a skill — that's an MCP server** (logic runs on the server, Claude talks to it
over a protocol). See the MCP section.
