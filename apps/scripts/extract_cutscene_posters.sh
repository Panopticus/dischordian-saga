#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════
#   Extract first-frame _start.png posters for every cutscene
#   that doesn't already have one — closes _MISSING_ART_PROMPTS.md §B.
#
#   Walks apps/client/public/art/cutscenes/<category>/*.mp4 and for
#   each mp4 whose `<stem>_start.png` sibling does NOT exist, uses
#   ffmpeg to extract the first frame.
#
#   Idempotent — already-present posters are skipped. Safe to re-run.
#
#   Requires: ffmpeg (any build — uses PNG output, no libwebp needed).
#
#   Usage:
#     ./apps/scripts/extract_cutscene_posters.sh                   # extract all missing
#     ./apps/scripts/extract_cutscene_posters.sh --dry-run         # list what would be extracted
#     ./apps/scripts/extract_cutscene_posters.sh --webp            # also encode to .webp via cwebp
#
#   After running, upload via the existing wrapper:
#     ./apps/scripts/upload_cutscenes.sh --skip-extract
#   then verify:
#     pnpm tsx scripts/_check-art-coverage.mjs
# ═══════════════════════════════════════════════════════

set -euo pipefail

DRY_RUN=""
WEBP=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN="1"; shift ;;
    --webp) WEBP="1"; shift ;;
    --help|-h)
      sed -n '2,22p' "$0"
      exit 0
      ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Error: ffmpeg not found. Install via: brew install ffmpeg" >&2
  exit 1
fi
if [[ -n "$WEBP" ]] && ! command -v cwebp >/dev/null 2>&1; then
  echo "Error: cwebp not found (--webp requested). Install via: brew install webp" >&2
  exit 1
fi

ROOT="apps/client/public/art/cutscenes"
if [[ ! -d "$ROOT" ]]; then
  echo "Error: $ROOT not found. Run from the repo root." >&2
  exit 1
fi

extracted=0
skipped=0
failed=0
missing_list=()

while IFS= read -r mp4; do
  stem="${mp4%.mp4}"
  png="${stem}_start.png"
  webp="${stem}_start.webp"

  # Skip if poster already exists (either png or webp).
  if [[ -f "$png" || -f "$webp" ]]; then
    skipped=$((skipped + 1))
    continue
  fi

  missing_list+=("$mp4")

  if [[ -n "$DRY_RUN" ]]; then
    echo "  would extract: $png"
    extracted=$((extracted + 1))
    continue
  fi

  # Extract first frame as PNG.
  if ffmpeg -y -loglevel error -i "$mp4" -frames:v 1 "$png" 2>/dev/null; then
    extracted=$((extracted + 1))
    echo "  extracted: $(basename "$png")"
    # Optional WebP transcode (smaller file; CDN-friendly).
    if [[ -n "$WEBP" ]]; then
      if cwebp -q 90 "$png" -o "$webp" >/dev/null 2>&1; then
        rm "$png"
        echo "    + transcoded to webp"
      fi
    fi
  else
    failed=$((failed + 1))
    echo "  FAILED: $mp4" >&2
  fi
done < <(find "$ROOT" -type f -name "*.mp4" | sort)

echo ""
echo "═══════════════════════════════════════════════════════"
if [[ -n "$DRY_RUN" ]]; then
  echo "DRY RUN summary"
  echo "  would extract: $extracted"
  echo "  already have:  $skipped"
else
  echo "Extraction complete"
  echo "  extracted:    $extracted"
  echo "  skipped:      $skipped (poster already exists)"
  echo "  failed:       $failed"
fi
echo "═══════════════════════════════════════════════════════"

if [[ -z "$DRY_RUN" && "$extracted" -gt 0 ]]; then
  echo ""
  echo "Next steps:"
  echo "  1. Upload the new posters to CDN:"
  echo "       ./apps/scripts/upload_cutscenes.sh --skip-extract"
  echo "     (--skip-extract = don't re-unzip; just sync public/ → S3)"
  echo "  2. Verify:"
  echo "       pnpm tsx scripts/_check-art-coverage.mjs"
fi
