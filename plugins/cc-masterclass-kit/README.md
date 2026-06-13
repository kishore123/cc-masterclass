# cc-masterclass-kit

The worked SDLC toolkit from the [Claude Code Masterclass](https://github.com/kishore123/cc-masterclass)
for embedded-C teams. One install gives you the commands, skills, sub-agents, and gate hooks
that the course builds — ready to use on `firmware-lab` and as templates to adapt to your own
repos.

## Install

```bash
# 1) register the company hub (once)
claude plugin marketplace add kishore123/cc-masterclass
# 2) install the kit
claude plugin install cc-masterclass-kit@cc-masterclass
# 3) update later
claude plugin update cc-masterclass-kit
```

## What's inside

| Type | Name | What it does |
|---|---|---|
| Command | `/standup` | Today's git changes as Done/In-progress/Next/Blockers |
| Command | `/draft-req` | Turn a backlog ID into a testable requirement + traceability row |
| Command | `/ship-feature` | Plan → implementer + reviewer + tester sub-agents → merge |
| Skill | `git-insights` | Repo stats report (bundled `insights.py`, stdlib only) |
| Skill | `test-gen` | Generate + run Unity tests incl. malformed-input cases |
| Skill | `release-notes` | Draft a changelog from git history since the last tag |
| Sub-agent | `reviewer` | Read-only correctness review |
| Sub-agent | `design-reviewer` | Critiques an ADR/design; GO / GO-WITH-CHANGES / NO-GO |
| Sub-agent | `test-writer` | Writes Unity tests, registers them, runs the suite |
| Sub-agent | `triage` | First-pass crash/ASan triage with root cause + fix |
| Sub-agent | `security-reviewer` | Diff security review with CWE ids |
| Hook | `secret-scan` (PreToolUse) | **Blocks** writes that introduce an obvious secret |
| Hook | `clang-format` (PostToolUse) | Auto-formats C files after each edit |

## Prerequisites

- **bash + grep** for the `secret-scan` hook (standard on Linux/macOS/WSL/Git-Bash). If your
  environment lacks them, disable that hook rather than risk wedging edits.
- **clang-format** on `PATH` for the format hook (the command no-ops cleanly if it's missing).
- **python3** + **git** for the `git-insights` skill.

## Two things to know

1. **The hooks are real guardrails.** Enabling the plugin activates them; disabling/uninstalling
   removes them — no editing of your `settings.json`. The `secret-scan` hook will *block* an edit
   that contains a credential. That's the point (policy-as-code), but know it's on.
2. **Several artifacts are firmware-lab-flavored templates.** `/draft-req`, `/ship-feature`,
   and the reviewers mention paths/commands like `requirements/`, `make test`, and frame-size
   budgets. They work as-is on `firmware-lab` and read as obvious templates to adapt to your
   repo — which is exactly the "capture, then adapt" habit the course teaches.

The `vendor/` edit-deny rule from the course is a *permission* (not a hook), so it can't ship in
a plugin — add it to your repo's `.claude/settings.json` directly:
`{"permissions":{"deny":["Edit(vendor/**)","Write(vendor/**)"]}}`.

## Verify after install

```
/standup            # should run
/plugin             # shows cc-masterclass-kit loaded; /agents and /hooks list its components
```
