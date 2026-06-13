---
name: test-gen
description: Generate and run Unity tests for a C module, including malformed-input cases. Use when the user asks to add or improve test coverage for embedded C code.
---
1. Read the target module's header for its error contract and any trust-boundary notes in
   `CLAUDE.md` / `docs/ARCHITECTURE.md`.
2. Write Unity tests covering: happy path, boundary values, and **adversarial / malformed
   input** (oversize and short frames, post-wrap buffer state, missing JSON keys, over-long
   strings).
3. Register each test in the test runner (e.g. `tests/test_runner.c`, add to the relevant
   `run_*` group).
4. Run the test build (e.g. `make test`). Report results. Any newly-red case is a suspected
   defect — surface it as a finding rather than weakening the assertion.
5. Optionally report uncovered branches via a `--coverage` build (`gcov src/<module>.c`).
