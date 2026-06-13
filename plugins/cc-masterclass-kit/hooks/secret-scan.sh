#!/usr/bin/env bash
# PreToolUse gate hook (Edit|Write): block writes that introduce an obvious secret.
#
# The harness passes the tool-call event as JSON on stdin. We scan the whole payload
# (which includes the content being written) for high-signal secret patterns and exit
# non-zero to BLOCK the write when one matches. Deterministic: the harness enforces this
# regardless of model judgment.
#
# Exit 0 = allow, exit 2 = block (with a message on stderr).
#
# Requires bash + grep (standard on Linux/macOS/WSL/Git-Bash). If those are unavailable,
# remove this hook rather than risk wedging edits.

set -uo pipefail

payload="$(cat)"

# High-signal patterns. Keep these specific to avoid false positives on normal code.
patterns=(
  'AKIA[0-9A-Z]{16}'                         # AWS access key id
  '-----BEGIN [A-Z ]*PRIVATE KEY-----'       # PEM private key
  'ghp_[0-9A-Za-z]{36}'                       # GitHub personal access token
  'xox[baprs]-[0-9A-Za-z-]{10,}'             # Slack token
  'AIza[0-9A-Za-z_\-]{35}'                    # Google API key
)

for p in "${patterns[@]}"; do
  if printf '%s' "$payload" | grep -Eq -e "$p"; then
    echo "secret-scan: blocked write — content matches a secret pattern (/$p/)." >&2
    echo "Remove the credential and use a secret store / env var instead." >&2
    exit 2
  fi
done

exit 0
