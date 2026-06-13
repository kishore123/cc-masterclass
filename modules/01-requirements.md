# Module 1 — Requirements

**SDLC stage:** Requirements.
**You'll learn:** prompting that elicits instead of assumes; plan mode; `AskUserQuestion`;
thinking effort; capturing a repeatable prompt as a slash command; **using an MCP tool to
reach the issue tracker** outside the repo.
**Lab:** turn backlog item **FR-7** (add CRC-16 to the wire frame) from one line into a real
spec with acceptance criteria and a traceability row.
**Autonomy:** L2 (Claude elicits, you decide) → L3 (a `/draft-req` command drafts, you edit).

---

## Concept: requirements is an *elicitation* problem, and the model is good at it

The failure mode of AI on requirements is confident invention. The fix is prompting that
forces the open questions to the surface *before* any text is written. Two tools:

- **Plan mode** (read-only) — Claude can read the SRS and code but cannot write, so the output
  is a proposal you ratify, not a fait accompli.
- **Clarifying questions** — a good requirements prompt instructs Claude to ask before drafting.

## Lab 1a (L2) — elicit FR-7

Open the draft spec and backlog:
- `firmware-lab/requirements/SRS.md` (FR-7 is "NOT IMPLEMENTED")
- `firmware-lab/requirements/backlog.md`

Prompt (in **plan mode**):

> "Read FR-7 in requirements/SRS.md and the protocol code in src/protocol.{c,h}. I want to
> specify adding a CRC-16 to the wire frame. **Before writing anything, ask me every question
> you need answered to write a complete, testable requirement** — polynomial, init value, bit
> order, where in the frame, how LEN is affected, what the decoder does on mismatch, backward
> compatibility."

Notice it surfaces the real decisions (CRC-16/CCITT vs CRC-16/IBM? does the 62-byte payload
budget shrink? reject vs flag on mismatch?). **You** answer; it drafts. That division is L2.

## Lab 1b — write acceptance criteria + traceability

Have Claude turn the answers into:
1. A revised FR-7 with **testable acceptance criteria** ("decoder returns -1 and consumes 0
   bytes on CRC mismatch", "encoder appends 2 bytes; max payload becomes 60", …).
2. A **traceability row**: FR-7 → planned test IDs (`test_proto_crc_roundtrip`,
   `test_proto_crc_rejects_corruption`). Tie it back to the table in SRS.md §3.

## Lab 1bb — reach the issue tracker with an MCP tool

So far everything Claude touched lived **inside the repo**. Real requirements live in an issue
tracker (GitHub Issues, Jira, Azure Boards). **MCP is how Claude reaches outside the repo** —
it registers an external system's operations directly into Claude's toolset, so you ask in
plain language and Claude routes the call (see [README](../README.md) "A live MCP call").

Connect the GitHub MCP server once (the lab repo is on GitHub):

```bash
claude mcp add --transport stdio github -- npx -y @modelcontextprotocol/server-github
# (set GITHUB_TOKEN in the environment first)
```

Then, in plain language:

> "Read GitHub issue #<n> in kishore123/firmware-lab, and draft FR-7's requirement from it.
> When I approve, **open a tracking issue** linking the requirement to the planned test IDs."

Three lessons land here:
1. **Reach beyond the repo.** Nothing in firmware-lab knows how to talk to GitHub — the MCP
   server holds that, runs remotely, and is always current (the "server-hosted, no staleness"
   case we contrast against local skills).
2. **Auto-routing from one sentence:** server → tool → args, picked by matching the tool's own
   description (the "description is the API" throughline again).
3. **Read vs. write is an autonomy line.** *Reading* the issue fires directly (safe, L3). But
   **creating** an issue is an outward-facing write — confirm before it executes, never
   silently auto-create. This is the trust-boundary lesson applied to your *tooling*, not just
   your code.

> No GitHub token in the room? Demo read-only against a public issue, or substitute the
> filesystem/SQLite MCP — the routing lesson is identical. The point is *Claude reached a
> system outside the repo*, not which system.

## Lab 1c (L3) — capture `/draft-req`

You'll do this again for FR-6a, FR-9. **Rule of three** → capture it. Create
`cc-masterclass/.claude/commands/draft-req.md` (or in firmware-lab so it travels with the code):

```markdown
Given a backlog item ID, read it from requirements/backlog.md and the relevant source.
First ask any clarifying questions needed for a complete, testable requirement.
Then draft: a numbered requirement, testable acceptance criteria, and a traceability row
mapping it to planned test IDs. Match the style of requirements/SRS.md.
```

Now `/draft-req FR-6a` repeats the ritual. That jump — from free-typing to a shared,
checked-in command — is the L2→L3 move for this stage.

## Gotcha

A command is a **prompt, not a script** ([README](../README.md) "How it actually runs"). It
*steers* Claude; it won't run identically byte-for-byte. That's the point: it flexes to each
backlog item instead of breaking.

## Autonomy verdict

Requirements tops out at **L3** for most teams: Claude drafts, a human owns intent and signs
off. L4 (auto-accept generated requirements) is a trap — the spec is the one artifact you
can't delegate the judgment of.

## Capture / deliverable
- A completed FR-7 in `requirements/SRS.md` with acceptance criteria + traceability.
- `.claude/commands/draft-req.md`.

➡ Next: [Module 2 — Design](02-design.md)
