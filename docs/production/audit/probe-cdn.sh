#!/usr/bin/env bash
# Probe every unique URL via curl HEAD in parallel.
# Output: code \t url \t source_file
ROOT="$(cd "$(dirname "$0")"/../../.. && pwd)"
IN="$ROOT/docs/production/audit/all-urls.tsv"
OUT="$ROOT/docs/production/audit/cdn-liveness.tsv"

# Dedupe (first source wins per URL)
awk -F'\t' '!seen[$1]++' "$IN" > "$OUT.urls.tsv"
echo "unique URLs to probe: $(wc -l < "$OUT.urls.tsv")"

: > "$OUT"

# Use null-byte delimiter (xargs -0) so URLs containing spaces or special
# chars survive intact. GNU xargs supports -d '\n' but BSD xargs (macOS)
# does not — null-delim works on both.
awk -F'\t' '{print $1 "|" $2}' "$OUT.urls.tsv" \
| tr '\n' '\0' \
| xargs -0 -P 48 -I {} bash -c '
  pair="$1"
  url="${pair%%|*}"
  src="${pair#*|}"
  code=$(curl -s -o /dev/null -w "%{http_code}" -I --max-time 10 "$url" 2>/dev/null)
  [ -z "$code" ] && code=ERR
  printf "%s\t%s\t%s\n" "$code" "$url" "$src"
' _ {} >> "$OUT"

echo "=== probe complete ==="
echo "total probed: $(wc -l < "$OUT")"
echo "by code:"
awk -F'\t' '{print $1}' "$OUT" | sort | uniq -c | sort -rn
