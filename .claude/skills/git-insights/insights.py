#!/usr/bin/env python3
"""Print a compact insights report for the current git repo.

Bundled with the git-insights skill. Pure stdlib + git CLI, no deps.
Usage: python insights.py [--since <git-date>]
"""
import argparse
import subprocess
import sys
from collections import Counter


def git(*args):
    out = subprocess.run(
        ["git", *args], capture_output=True, text=True, encoding="utf-8"
    )
    return out.stdout.strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--since", default=None, help="git date, e.g. '1 week ago'")
    args = ap.parse_args()

    if git("rev-parse", "--is-inside-work-tree") != "true":
        print("Not inside a git repository.")
        sys.exit(1)

    log_args = ["log", "--pretty=%an"]
    if args.since:
        log_args += [f"--since={args.since}"]

    branch = git("rev-parse", "--abbrev-ref", "HEAD")
    total = git("rev-list", "--count", "HEAD") or "0"
    first = git("log", "--reverse", "--pretty=%ad", "--date=short")
    first = first.splitlines()[0] if first else "n/a"
    last = git("log", "-1", "--pretty=%ad", "--date=short") or "n/a"

    authors = Counter(a for a in git(*log_args).splitlines() if a)
    files = git("ls-files")
    file_count = len(files.splitlines()) if files else 0

    scope = f" (since {args.since})" if args.since else ""
    print(f"# Git insights - {branch}{scope}\n")
    print(f"- Commits: {total}   Tracked files: {file_count}")
    print(f"- History: {first} -> {last}")
    print("\n## Top contributors")
    for name, n in authors.most_common(5):
        print(f"- {name}: {n}")

    print("\n## Recent commits")
    recent = git("log", "-5", "--pretty=%h %s")
    print(recent or "(none)")


if __name__ == "__main__":
    main()
