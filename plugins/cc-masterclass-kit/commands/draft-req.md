---
description: Draft a complete, testable requirement from a backlog item ID, with acceptance criteria and a traceability row.
---

Given a backlog item ID (e.g. FR-6a), read it from the project's backlog
(`requirements/backlog.md` in firmware-lab; adapt the path for your repo) and the relevant
source under `src/`.

1. First, ask any clarifying questions needed to write a complete, *testable* requirement
   (interfaces, ranges, error behaviour, compatibility). Do not draft until they're answered.
2. Then produce, matching the style of the project's spec (`requirements/SRS.md`):
   - a numbered requirement statement,
   - bulleted, testable acceptance criteria,
   - a traceability row mapping the requirement to planned test IDs.
3. Offer to insert it into the spec and update the traceability table.
