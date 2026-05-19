#!/usr/bin/env bash
# Aggressive alternate-path probe for dead dgrsart URLs.
# See header in v1 for the candidate transformations applied.
# Output: docs/production/audit/path-mismatches-aggressive.tsv

set -uo pipefail

ROOT="$(cd "$(dirname "$0")"/../../.. && pwd)"
LIVENESS="$ROOT/docs/production/audit/cdn-liveness.tsv"
OUT="$ROOT/docs/production/audit/path-mismatches-aggressive.tsv"
WORK="$ROOT/docs/production/audit/.path-mismatches-aggressive"
mkdir -p "$WORK"

if [ ! -f "$LIVENESS" ]; then
  echo "error: $LIVENESS not found." >&2
  exit 1
fi

CAND="$WORK/candidates.tsv"

# Use Python for the candidate generation — awk doesn't allow nested
# functions and the candidate logic is too branchy for one-liners.
python3 - "$LIVENESS" > "$CAND" <<'PY'
import sys, os

inp = sys.argv[1]
EXTS = {".png", ".webp", ".jpg", ".jpeg", ".avif"}
VID_EXTS = {".mp4", ".webm", ".mov"}
AUD_EXTS = {".mp3", ".wav", ".m4a", ".ogg"}
PREFIXES = ("s1_", "s2_", "the_")
SWAPS = [
    ("element", "elemental"), ("elemental", "element"),
    ("dimension", "dimensional"), ("dimensional", "dimension"),
    ("cards", "character-cards"), ("character-cards", "cards"),
    ("specimens", "specimen"), ("specimen", "specimens"),
    ("prelude", "act1"), ("act1", "prelude"),
    ("classrooms", "classroom"), ("classroom", "classrooms"),
    ("slideshows", "slides"), ("slides", "slideshows"),
    ("recruits", "recruit"), ("recruit", "recruits"),
    ("rooms", "room"), ("room", "rooms"),
]
ROOT_PREFIX = "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/"

def alt_exts(ext):
    if ext in VID_EXTS:
        return VID_EXTS - {ext}
    if ext in AUD_EXTS:
        return AUD_EXTS - {ext}
    return EXTS - {ext}

with open(inp) as f:
    for line in f:
        parts = line.rstrip("\n").split("\t")
        if len(parts) < 3: continue
        code, url, src = parts[0], parts[1], parts[2]
        if code != "403": continue
        if not url.startswith(ROOT_PREFIX): continue
        key = url[len(ROOT_PREFIX):]
        if not key or key.endswith("/"): continue
        segs = key.split("/")
        leaf = segs[-1]
        if "." not in leaf: continue
        stem, ext = os.path.splitext(leaf)
        prefix = "/".join(segs[:-1])
        prefix = prefix + "/" if prefix else ""

        cands = set()

        # 1. extension flips
        for e in alt_exts(ext):
            cands.add(f"{prefix}{stem}{e}")

        # 2. snake↔kebab on the leaf
        snake = stem.replace("-", "_")
        kebab = stem.replace("_", "-")
        for variant in (snake, kebab):
            if variant != stem:
                cands.add(f"{prefix}{variant}{ext}")
                for e in alt_exts(ext):
                    cands.add(f"{prefix}{variant}{e}")

        # 3. strip/add common stem prefixes
        for p in PREFIXES:
            if stem.startswith(p):
                bare = stem[len(p):]
                cands.add(f"{prefix}{bare}{ext}")
                for e in alt_exts(ext):
                    cands.add(f"{prefix}{bare}{e}")

        # 4. drop one path segment at any depth
        for i in range(len(segs) - 1):
            dropped = segs[:i] + segs[i+1:-1]
            new_prefix = "/".join(dropped) + ("/" if dropped else "")
            cands.add(f"{new_prefix}{leaf}")
            for e in alt_exts(ext):
                cands.add(f"{new_prefix}{stem}{e}")

        # 5. parent-dir synonym swaps
        for src_seg, dst_seg in SWAPS:
            new_segs = [dst_seg if s == src_seg else s for s in segs[:-1]]
            if new_segs != segs[:-1]:
                new_prefix = "/".join(new_segs) + "/"
                cands.add(f"{new_prefix}{leaf}")
                for e in alt_exts(ext):
                    cands.add(f"{new_prefix}{stem}{e}")

        # 6. tier encoding _t<N> ↔ _0<N> ↔ _<N>
        import re
        m = re.search(r"_t([1-9])$", stem)
        if m:
            n = m.group(1)
            base = stem[:-len(m.group(0))]
            cands.add(f"{prefix}{base}_0{n}{ext}")
            cands.add(f"{prefix}{base}_{n}{ext}")
        m = re.search(r"_0([1-9])$", stem)
        if m:
            n = m.group(1)
            base = stem[:-len(m.group(0))]
            cands.add(f"{prefix}{base}_t{n}{ext}")
            cands.add(f"{prefix}{base}_{n}{ext}")

        for c in cands:
            full = ROOT_PREFIX + c
            if full == url: continue
            print(f"{url}\t{full}\t{src}")
PY

echo "candidates: $(wc -l < "$CAND")"

UNIQ="$WORK/unique-alts.txt"
awk -F'\t' '!seen[$2]++ {print $2}' "$CAND" > "$UNIQ"
echo "unique alt URLs to probe: $(wc -l < "$UNIQ")"

RES="$WORK/alt-results.tsv"
: > "$RES"
xargs -P 32 -I {} bash -c '
  url="$1"
  code=$(curl -s -o /dev/null -w "%{http_code}" -I --max-time 8 "$url" 2>/dev/null)
  [ -z "$code" ] && code=ERR
  printf "%s\t%s\n" "$code" "$url"
' _ {} < "$UNIQ" >> "$RES"

echo "probes complete:"
awk -F'\t' '{print $1}' "$RES" | sort | uniq -c | sort -rn

: > "$OUT"
awk -F'\t' '
  NR == FNR { code[$2] = $1; next }
  code[$2] == "200" { print $3 "\t" $1 "\t" $2 }
' "$RES" "$CAND" | sort -u > "$OUT"

echo ""
echo "=== PATH MISMATCHES (AGGRESSIVE): $(wc -l < "$OUT") ==="
awk -F'\t' '{print $1}' "$OUT" | sort | uniq -c | sort -rn | head -20
