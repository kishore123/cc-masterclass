#!/usr/bin/env bash
# Validate a release version before tagging:
#   - matches vX.Y.Z
#   - strictly greater than the current latest tag
#   - working tree is clean
# Usage: bash "${CLAUDE_PLUGIN_ROOT}/scripts/check-semver.sh" v1.1.0

set -euo pipefail

ver="${1:-}"
if [[ ! "$ver" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "check-semver: '$ver' is not vX.Y.Z" >&2
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "check-semver: working tree is not clean; commit or stash first." >&2
  exit 1
fi

latest="$(git describe --tags --abbrev=0 2>/dev/null || echo v0.0.0)"

# Compare semver numerically (strip leading v).
ver_n="${ver#v}"; latest_n="${latest#v}"
IFS=. read -r a b c <<< "$ver_n"
IFS=. read -r x y z <<< "$latest_n"
new=$((a*1000000 + b*1000 + c))
old=$((x*1000000 + y*1000 + z))
if (( new <= old )); then
  echo "check-semver: $ver is not greater than latest tag $latest." >&2
  exit 1
fi

echo "check-semver: $ver OK (latest is $latest, tree clean)."
