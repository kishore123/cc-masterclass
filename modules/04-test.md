# Module 4 — Test

**SDLC stage:** Test.
**You'll learn:** a test-writer sub-agent; bundling a test-gen workflow as a skill; coverage
as the check; why example tests miss edge bugs.
**Lab:** write the tests that *would have caught* BUG-1 and BUG-4; capture the workflow as a
`test-gen` skill.
**Autonomy:** L3 — generation is delegable because the suite itself is the verifier.

---

## Concept: tests are the one artifact where L4 is almost free

A generated test is safe to accept because **a passing-or-failing test is self-checking** —
if it's wrong, it goes red. So test generation is the most delegable stage. The catch: the
green baseline suite already "passes" while BUG-1 and BUG-4 lurk. Example-based tests only
cover the cases the author imagined. The fix is **adversarial + property** thinking.

## Lab 4a — make the latent bugs visible

The shipped suite is green but the code is wrong. Prompt:

> "The protocol and ring-buffer tests pass, but I suspect untested edge cases. Without reading
> any answer key, generate tests that probe malformed input to `proto_decode` (oversized LEN,
> LEN=0, truncated frames) and `rb_peek` after the buffer has wrapped (many put/get cycles
> first, then peek). Add them to the suite and run."

These new tests should **go red** — exposing BUG-1 (decode overflow) and BUG-4 (peek wrap)
from Module 5's backlog. You just turned "looks fine" into "provably broken." Leave them red;
Module 5/6 fix the code.

## Lab 4b — a test-writer sub-agent

`firmware-lab/.claude/agents/test-writer.md`:

```markdown
---
name: test-writer
description: Writes Unity unit tests for embedded C modules. Use when adding test coverage.
tools: Read, Grep, Glob, Edit, Bash
model: sonnet
---
You write Unity tests for this firmware. Cover happy path, boundary values, and adversarial
/ malformed input (this code crosses trust boundaries). Register each test in test_runner.c.
Build and run `make test` and report pass/fail. Prefer many small assertions with clear names.
```

## Lab 4c (capture) — the `test-gen` skill

You'll generate tests repeatedly → make it a **skill** (auto-fires on intent, can bundle a
coverage script). `firmware-lab/.claude/skills/test-gen/SKILL.md`:

```markdown
---
name: test-gen
description: Generate and run Unity tests for a C module, including malformed-input cases.
  Use when the user asks to add or improve test coverage for firmware-lab.
---
1. Read the target module's header for its error contract.
2. Write happy-path, boundary, and adversarial tests; register them in tests/test_runner.c.
3. Run `make test`; report results and any newly-red cases as suspected defects.
```

Remember: the **description is the API** — write it for how people ask ("add coverage for the
ring buffer"), not for yourself.

## Lab 4d — coverage as the check

```bash
make test CFLAGS="-std=c11 -Wall -Wextra -O0 -g --coverage"
gcov src/protocol.c    # or: lcov + genhtml for a report
```

Ask Claude to read the gcov output and name the **uncovered branches** — those are where the
next bug hides. Coverage is the objective gate that lets you trust delegated generation.

## Autonomy verdict

Test generation runs at **L3–L4**: delegate the writing, let the suite + coverage be the
verifier. Keep a human eye on *what* is asserted (a test that asserts the wrong thing is worse
than none) — that review is the L3 part.

## Capture / deliverable
- New red tests pinning BUG-1 and BUG-4.
- `.claude/agents/test-writer.md`, `.claude/skills/test-gen/SKILL.md`.

➡ Next: [Module 5 — Debug](05-debug.md)
