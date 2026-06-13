---
name: release-notes
description: Draft release notes from git history since the last tag. Use when preparing a release or asked for a changelog.
---
1. Find the last tag: `git describe --tags --abbrev=0` (if none, use the root commit).
2. Read commits since then: `git log <tag>..HEAD --oneline`.
3. Group changes into **Features / Fixes / Security**, mapping each to backlog IDs
   (`FR-*`, `BUG-*`, `SEC-*`) from the project backlog where possible.
4. Output Keep-a-Changelog markdown under a new version heading.
5. Do **not** create the git tag — propose the version (semver) and let a human approve and
   cut the release after review. Remind them to validate the version first (e.g. with
   `check-semver.sh <version>`).
