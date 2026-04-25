#!/usr/bin/env bash
# Path-mismatch scanner.
#
# For every dead URL the audit probe found in the dgrsart bucket,
# generate plausible alternate paths and probe each. Any dead URL
# that has a live alternate is a registry path bug (the bytes
# shipped, the registry just points at the wrong key).
#
# Output:
#   docs/production/audit/path-mismatches.tsv
#     columns: source_file \t dead_url \t live_alternate
#   docs/production/audit/path-mismatches.summary.txt
#     human-readable, grouped by source_file
#
# Skips legacy-cloudfront URLs (the entire distribution is dead;
# alt-probing won't help). Only probes the dgrsart bucket.
#
# Rerun-safe: caches probe results in-script. Idempotent.
#
# Usage:
#   bash docs/production/audit/scan-path-mismatches.sh

set -uo pipefail

ROOT="$(cd "$(dirname "$0")"/../../.. && pwd)"
LIVENESS="$ROOT/docs/production/audit/cdn-liveness-files.tsv"
OUT="$ROOT/docs/production/audit/path-mismatches.tsv"
SUMMARY="$ROOT/docs/production/audit/path-mismatches.summary.txt"

if [ ! -f "$LIVENESS" ]; then
  echo "error: $LIVENESS not found. Run extract-urls.sh + probe-cdn.sh first." >&2
  exit 1
fi

# ─── 1. Build candidate-URL list per dead URL ─────────────────────
#
# For each dead dgrsart URL, emit up to ~8 alt candidates:
#   • drop a known-questionable path segment (prelude/, act1/, prelude/act1/)
#   • flip extension (png↔webp, jpg↔png, jpg↔webp)
#   • collapse a single subdirectory level (a/b/c/file → a/c/file)
#
# Output: TSV of original_dead_url \t candidate_alt_url \t source_file
# All candidates are deduplicated against the source URL itself.

CANDIDATES="$ROOT/docs/production/audit/.path-mismatches.candidates.tsv"
: > "$CANDIDATES"

awk -F'\t' '$1 == 403 && $2 ~ /^https:\/\/dgrsart\.s3/ {
  url = $2; src = $3
  # split URL into prefix (up to and incl. /cdn/<prefix>/) and key
  # path is everything after the bucket-relative root
  match(url, /amazonaws\.com\//)
  if (RSTART == 0) next
  base = substr(url, 1, RSTART + RLENGTH - 1)   # https://...amazonaws.com/
  key  = substr(url, RSTART + RLENGTH)          # cdn/client-public/art/...
  # detect file extension
  if (match(key, /\.[a-zA-Z0-9]+$/) == 0) next
  ext = substr(key, RSTART)                     # ".png"
  stem = substr(key, 1, RSTART - 1)             # everything before ".png"

  # --- Candidate 1-3: drop a path segment ---
  drop_segments[1] = "/prelude/"
  drop_segments[2] = "/act1/"
  drop_segments[3] = "/prelude/act1/"
  for (i = 1; i <= 3; i++) {
    seg = drop_segments[i]
    if (index(stem, seg) > 0) {
      alt_stem = stem
      gsub(seg, "/", alt_stem)
      print url "\t" base alt_stem ext "\t" src
    }
  }

  # --- Candidate 4-5: flip extension PNG↔WebP / JPG↔PNG ---
  if (ext == ".png") {
    print url "\t" base stem ".webp" "\t" src
    print url "\t" base stem ".jpg"  "\t" src
  } else if (ext == ".webp") {
    print url "\t" base stem ".png" "\t" src
    print url "\t" base stem ".jpg" "\t" src
  } else if (ext == ".jpg" || ext == ".jpeg") {
    print url "\t" base stem ".png"  "\t" src
    print url "\t" base stem ".webp" "\t" src
  }

  # --- Candidate 6: collapse innermost subdir (a/b/c/file → a/b/file) ---
  # e.g. cdn/client-public/art/rooms/prelude/room-X.png
  #   → cdn/client-public/art/rooms/room-X.png
  alt2 = stem ext
  if (match(alt2, /\/[^\/]+\/[^\/]+$/) > 0) {
    pre = substr(alt2, 1, RSTART)               # ".../"
    last = substr(alt2, RSTART + 1)             # "innerdir/file.ext"
    sub(/^[^\/]+\//, "", last)                  # "file.ext"
    print url "\t" base pre last "\t" src
  }
}' "$LIVENESS" > "$CANDIDATES"

echo "candidates generated: $(wc -l < "$CANDIDATES")"

# ─── 2. Dedupe candidate URLs to a unique probe list ──────────────

UNIQUE_ALTS="$ROOT/docs/production/audit/.path-mismatches.unique-alts.txt"
awk -F'\t' '!seen[$2]++ {print $2}' "$CANDIDATES" > "$UNIQUE_ALTS"
echo "unique alt URLs to probe: $(wc -l < "$UNIQUE_ALTS")"

# ─── 3. Probe each unique alt with retry-on-503 ───────────────────

ALT_RESULTS="$ROOT/docs/production/audit/.path-mismatches.alt-results.tsv"
: > "$ALT_RESULTS"

xargs -P 24 -I {} bash -c '
  url="$1"
  for i in 1 2 3; do
    code=$(curl -s -o /dev/null -w "%{http_code}" -I --max-time 12 "$url")
    [ -n "$code" ] && [ "$code" != "503" ] && break
    sleep 2
  done
  [ -z "$code" ] && code=ERR
  printf "%s\t%s\n" "$code" "$url"
' _ {} < "$UNIQUE_ALTS" >> "$ALT_RESULTS"

echo "alt probes complete:"
awk -F'\t' '{print $1}' "$ALT_RESULTS" | sort | uniq -c | sort -rn

# ─── 4. Join: candidates whose alt returned 200 are mismatches ────
#
# Build map: alt_url → http_code
# Then for each candidate row, if alt_url is 200, emit:
#   source_file \t dead_url \t live_alternate

: > "$OUT"
awk -F'\t' '
  NR == FNR { code[$2] = $1; next }
  code[$2] == "200" { print $3 "\t" $1 "\t" $2 }
' "$ALT_RESULTS" "$CANDIDATES" > "$OUT"

# ─── 5. Drop duplicates (same dead-url could have multiple matching alts) ───
sort -u "$OUT" -o "$OUT"

echo ""
echo "=== PATH MISMATCHES FOUND: $(wc -l < "$OUT") ==="
echo "(dead URL → live alternate, grouped by source registry)"
echo ""

# ─── 6. Human-readable summary grouped by source ──────────────────

awk -F'\t' '
{
  src = $1
  dead = $2
  alt = $3
  groups[src] = (src in groups ? groups[src] "\n  " : "")
  groups[src] = groups[src] dead "\n     → " alt
  count[src]++
}
END {
  for (s in count) {
    print "═══ " s " (" count[s] " mismatch" (count[s]==1?"":"es") ") ═══"
    print "  " groups[s]
    print ""
  }
}' "$OUT" > "$SUMMARY"

cat "$SUMMARY"

echo ""
echo "═══════════════════════════════════════════════════════"
echo "wrote:"
echo "  $OUT (machine-readable)"
echo "  $SUMMARY (human-readable, grouped)"
echo ""
echo "Each row of $OUT is a registry path bug: the source registry"
echo "points at <dead_url> but the bytes are live at <live_alternate>."
echo "Fix by editing the registry to use the live path."
