#!/usr/bin/env bash
# Apply the high-confidence card-art rewrites from
# card-art-rename-map.md to every card def in apps/shared/tcg-core/cards/definitions/.
#
# Usage:
#   bash audit/ship-readiness-2026-05-22/apply-card-art-rename.sh --dry-run
#   bash audit/ship-readiness-2026-05-22/apply-card-art-rename.sh --apply
#
# Each rewrite swaps an `art: assetUrl("OLD")` for `art: assetUrl("NEW")`
# in-place. Only entries from the "Auto-mapped (high confidence)" section
# of card-art-rename-map.md are applied — verify-low-confidence and
# unmapped sections require producer input first.
set -euo pipefail

MAP_FILE="audit/ship-readiness-2026-05-22/card-art-rename-map.md"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

MODE="${1:-}"
if [[ "$MODE" != "--dry-run" && "$MODE" != "--apply" ]]; then
  echo "Usage: $0 --dry-run | --apply" >&2
  exit 1
fi

# Parse the high-confidence section. Stop at the next H2 header.
awk '
  /^## Auto-mapped \(high confidence\)/ { collecting=1; next }
  /^## / && collecting { exit }
  collecting && /^\| `/ {
    # Extract Old + New from columns 4 and 5 of the markdown table row
    n = split($0, cols, "|")
    if (n < 6) next
    old = cols[4]
    new = cols[5]
    gsub(/^[[:space:]`]+|[[:space:]`]+$/, "", old)
    gsub(/^[[:space:]`]+|[[:space:]`]+$/, "", new)
    if (old != "" && new != "" && old != new) {
      printf "%s\t%s\n", old, new
    }
  }
' "$MAP_FILE" > /tmp/card-art-rename-pairs.tsv

count=$(wc -l < /tmp/card-art-rename-pairs.tsv)
echo "[card-rewire] ${count} high-confidence rewrites loaded"

if [[ "$MODE" == "--dry-run" ]]; then
  echo "[card-rewire] dry-run. The following rewrites would apply:"
  head -10 /tmp/card-art-rename-pairs.tsv | awk -F'\t' '{ printf "  %s  →  %s\n", $1, $2 }'
  if [[ $count -gt 10 ]]; then echo "  …and $((count - 10)) more"; fi
  exit 0
fi

# Apply each rewrite across the card-definition tree.
applied=0
while IFS=$'\t' read -r old new; do
  hits=$(grep -rl --include='*.ts' -F "assetUrl(\"$old\")" apps/shared/tcg-core/cards/definitions/ || true)
  if [[ -z "$hits" ]]; then
    continue
  fi
  for f in $hits; do
    sed -i "s|assetUrl(\"$old\")|assetUrl(\"$new\")|g" "$f"
    applied=$((applied + 1))
  done
done < /tmp/card-art-rename-pairs.tsv

echo "[card-rewire] applied across ${applied} file-edits"
echo "[card-rewire] re-run \`pnpm check\` + \`pnpm vitest run apps/shared/tcg-core\` before committing"
