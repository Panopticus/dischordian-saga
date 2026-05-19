#!/usr/bin/env bash
# Extract every asset URL/path referenced in source code.
# Output: docs/production/audit/all-urls.tsv (url \t source_file)
CDN_PUBLIC="https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public"
ROOT="$(cd "$(dirname "$0")"/../../.. && pwd)"
OUT="$ROOT/docs/production/audit/all-urls.tsv"
: > "$OUT"
cd "$ROOT"

# Pattern 1: assetUrl("path") → CDN_PUBLIC + path
grep -REn 'assetUrl\("[^"]+"\)' --include='*.ts' --include='*.tsx' \
  apps/client/src apps/shared apps/scripts 2>/dev/null \
  | grep -v '\.test\.' | grep -v __tests__ \
  | sed -E 's/^([^:]+):[0-9]+:.*assetUrl\("([^"]+)"\).*/\2|\1/' \
  | awk -F'|' -v cdn="$CDN_PUBLIC" '{
      gsub(/^\//, "", $1);
      print cdn "/" $1 "\t" $2
    }' >> "$OUT"

# Pattern 1b: pair("X.png") → emits both X.png and X.webp (see
# preludeAct1Deliverables.ts:36 — pair() forwards to assetUrl twice).
grep -REn 'pair\("[^"]+\.png"\)' --include='*.ts' --include='*.tsx' \
  apps/client/src apps/shared 2>/dev/null \
  | grep -v '\.test\.' | grep -v __tests__ \
  | sed -E 's/^([^:]+):[0-9]+:.*pair\("([^"]+)"\).*/\2|\1/' \
  | awk -F'|' -v cdn="$CDN_PUBLIC" '{
      gsub(/^\//, "", $1);
      png = $1
      webp = $1
      sub(/\.png$/, ".webp", webp)
      print cdn "/" png "\t" $2
      print cdn "/" webp "\t" $2
    }' >> "$OUT"

# Pattern 2: literal dgrsart.s3 URLs
grep -REoh 'https://dgrsart\.s3\.us-east-2\.amazonaws\.com/[A-Za-z0-9._/-]+' \
  --include='*.ts' --include='*.tsx' --include='*.json' \
  apps/client/src apps/shared 2>/dev/null \
  | sort -u | awk '{print $0 "\tliteral-dgrsart-url"}' >> "$OUT"

# Pattern 3: legacy CloudFront
grep -REoh 'https://d2xsxph8kpxj0f\.cloudfront\.net/[A-Za-z0-9._/-]+' \
  --include='*.ts' --include='*.tsx' --include='*.json' --include='*.txt' \
  apps/client/src apps/shared . 2>/dev/null \
  | sort -u | awk '{print $0 "\tlegacy-cloudfront"}' >> "$OUT"

# Pattern 4: voice manifests (per file with annotated source)
for f in apps/shared/*VoManifest.json; do
  [ -f "$f" ] || continue
  grep -oE 'https://[A-Za-z0-9./-]+\.(mp3|wav|ogg|m4a)' "$f" 2>/dev/null \
    | awk -v src="$f" '{print $0 "\t" src}' >> "$OUT"
done

# Pattern 5: room-artwork-urls.txt
if [ -f room-artwork-urls.txt ]; then
  grep -oE 'https://[^[:space:]]+' room-artwork-urls.txt 2>/dev/null \
    | awk '{print $0 "\troom-artwork-urls.txt"}' >> "$OUT"
fi

echo "raw lines: $(wc -l < "$OUT")"
echo "unique URLs: $(awk -F'\t' '{print $1}' "$OUT" | sort -u | wc -l)"
