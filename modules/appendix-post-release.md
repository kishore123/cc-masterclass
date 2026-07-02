# Appendix — After the Tag: Post-Release & Maintenance

> **Take-home track.** The live course ends at `v1.1.0` on purpose — but for a shipped
> device, the riskiest half of the lifecycle *starts* at the tag. This appendix maps that
> half, gives one runnable lab, and one drill. The rest is deliberately shaped like *your*
> real product, because that's where it has to live.

---

## Concept: the SDLC doesn't end at release — it loops

Everything before the tag happened in a repo you control, with a compiler as the oracle.
After the tag, the code runs on devices you *don't* control, and the inputs are field
reality: partial updates, hostile networks, CVEs in code you vendored years ago. The
autonomy ladder still applies — the split is the same one Module 6 taught: **machines watch
(L4), humans decide (L3).**

## The map

| Concern | What it is | Where Claude Code fits |
|---|---|---|
| **OTA update** | shipping v1.1.0 to devices in the field | design + review the update path like any FR (Modules 1–3); it's a trust boundary, so Lab 2d applies |
| **Rollback** | a bad update must not brick the fleet | threat-model the tension: A/B slots + anti-rollback counters vs. the need to recover — a great `design-reviewer` exercise |
| **Field monitoring** | crash reports, telemetry, watchdog resets | the kit's `triage` agent on real stack traces / ASan-style reports — first-pass triage at L3 |
| **Hotfix flow** | patch a *released* version while `main` has moved on | the drill below |
| **Vulnerability response** | a CVE lands in your code or a dependency | Lab PR-1 below, plus a `SECURITY.md` disclosure policy (Claude drafts it, you own it) |
| **End of life** | last release, final notes, key retirement | mostly human judgment; Claude drafts the comms and the archival checklist |

## Lab PR-1 — a CVE-watch routine (L4 watches, L3 decides)

The one genuinely recurring, dateable post-release obligation — which makes it the second
honest use of `/schedule` in this course (Module 8's rule: a real obligation with a date,
not scheduling for its own sake):

> Schedule weekly: cross-reference the SBOM (Lab 7e) and `vendor/` inventory against the
> OSV / NVD feeds. For each hit, open an issue with: affected component + version, whether
> our build actually compiles the affected code path, and a severity-in-context guess.
> **Do not fix anything.** A human triages Monday.

The routine files evidence at **L4**; the response decision is **L3**. Same split as
Module 6 — finding is mechanical, judging is human.

## Drill — the hotfix (the course under time pressure)

Simulate the real event: *"BUG-5 reported in released v1.1.0; `main` has moved on with
unreleased work."*

1. Branch from the tag: `git checkout -b hotfix/v1.1.1 v1.1.0`.
2. Have Claude reproduce from the symptom, fix on the hotfix branch, and cherry-pick the
   fix to `main` (or the reverse, if you fixed on `main` first — discuss which and why).
3. Re-run the gates you built — tests (M4), fuzz corpus (M6), `/security-review` (M6),
   review (M7) — on the *hotfix branch*. Gates that only run on `main` are a hole; this is
   how you find out.
4. Cut `v1.1.1` through the full Module 8 process — signed tag, digests, notes that say
   **security release** and what it fixes.

This drill exercises every module in the course under the constraint that actually breaks
teams: *the released code and the current code are no longer the same code.* It's a better
capstone-hardener than any new feature.

## Autonomy verdict

Post-release is **L4 for watching, L3 for deciding, L2 for the incident itself**. When a
real field incident is burning, drop *down* the ladder — you want every step visible. The
routines exist so that the human who gets paged starts with evidence instead of a blank
terminal.

## Capture / deliverable
- A scheduled CVE-watch routine (or the prompt for one, if you don't want it live yet).
- `SECURITY.md` with a disclosure contact and response-time promise you can keep.
- A completed hotfix drill: `v1.1.1` cut from a branch off the tag, gates green.

➡ Back to: [Module 10 — Capstone & rollout](10-capstone-and-rollout.md) ·
[Course map](../COURSE.md)
