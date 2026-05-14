#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════
#   NEW_ART_{1,2,3} drop CDN upload (2026-05-12)
#
#   One-shot wrapper for the 2026-05-12 producer megadrop:
#     - NEW_ART_1_characters_cards_sheets.zip     (280 files, 1.1 GB)
#     - NEW_ART_2_destinations_overlays_sprites_ui.zip (431 files, 2.4 GB)
#     - NEW_ART_3_fight_portraits.zip             (1,127 files, 5.6 GB)
#
#   Each zip is structured at the canonical `art/<category>/...`
#   prefix verbatim (matches the manifest pattern). Wrapper extracts
#   into `apps/client/public/art/<category>/` and then runs the
#   idempotent ETag-compare upload-public-to-s3.ts.
#
#   Usage:
#     ./apps/scripts/upload_new_art.sh --zip ~/Downloads/NEW_ART_1_characters_cards_sheets.zip
#     ./apps/scripts/upload_new_art.sh --zip ~/Downloads/NEW_ART_2_destinations_overlays_sprites_ui.zip
#     ./apps/scripts/upload_new_art.sh --zip ~/Downloads/NEW_ART_3_fight_portraits.zip
#     ./apps/scripts/upload_new_art.sh --all     # extract all three from ~/Downloads/
#     ./apps/scripts/upload_new_art.sh --dry-run
#
#   Idempotent — ETag compare skips already-uploaded files.
# ═══════════════════════════════════════════════════════

set -euo pipefail

ZIP_PATH=""
ALL_MODE=""
DRY_RUN=""
SKIP_EXTRACT=""
PUBLIC_DEST="apps/client/public"
TMP_BASE="/tmp/new_art_drop"

usage() {
  cat <<EOF
Usage: $0 [options]

Options:
  --zip <path>      Path to one of NEW_ART_{1,2,3}*.zip
  --all             Process all three zips from ~/Downloads/
  --skip-extract    Skip extract (files already in apps/client/public/art/)
  --dry-run         Print upload commands without executing
  --help            Show this help

Examples:
  $0 --zip ~/Downloads/NEW_ART_1_characters_cards_sheets.zip
  $0 --all
EOF
  exit 0
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --zip) ZIP_PATH="$2"; shift 2 ;;
    --all) ALL_MODE="1"; shift ;;
    --skip-extract) SKIP_EXTRACT="1"; shift ;;
    --dry-run) DRY_RUN="--dry-run"; shift ;;
    --help|-h) usage ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

extract_one() {
  local zip="$1"
  local base
  base=$(basename "$zip" .zip)
  local tmp="$TMP_BASE/$base"
  rm -rf "$tmp"
  mkdir -p "$tmp"
  echo "[new-art] Extracting $(basename "$zip") to $tmp..."
  unzip -q -o "$zip" -d "$tmp"

  # Zip layout is `art/<category>/...` verbatim — sync straight into
  # apps/client/public/ (preserve the art/ prefix).
  if [[ ! -d "$tmp/art" ]]; then
    echo "Error: $(basename "$zip") does not contain an art/ root" >&2
    exit 1
  fi
  local count
  count=$(find "$tmp/art" -type f | wc -l | tr -d ' ')
  echo "[new-art] Extract OK: $count files under art/"

  echo "[new-art] Syncing into $PUBLIC_DEST/art/..."
  mkdir -p "$PUBLIC_DEST"
  cp -R "$tmp/art" "$PUBLIC_DEST/"
  echo "[new-art] Sync complete for $(basename "$zip")"
}

if [[ -z "$SKIP_EXTRACT" ]]; then
  if [[ -n "$ALL_MODE" ]]; then
    for z in \
      "$HOME/Downloads/NEW_ART_1_characters_cards_sheets.zip" \
      "$HOME/Downloads/NEW_ART_2_destinations_overlays_sprites_ui.zip" \
      "$HOME/Downloads/NEW_ART_3_fight_portraits.zip"; do
      if [[ ! -f "$z" ]]; then
        echo "Error: $z not found. Download all three zips into ~/Downloads/ first." >&2
        exit 1
      fi
      extract_one "$z"
    done
  else
    if [[ -z "$ZIP_PATH" || ! -f "$ZIP_PATH" ]]; then
      echo "Error: --zip <path> required (or use --all)." >&2
      exit 1
    fi
    extract_one "$ZIP_PATH"
  fi
fi

if [[ -z "${AWS_ACCESS_KEY_ID:-}" && -z "${AWS_PROFILE:-}" ]]; then
  echo "Warning: AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY not set in env." >&2
fi

echo "[new-art] Running apps/scripts/upload-public-to-s3.ts --only=art$([ -n "$DRY_RUN" ] && echo " $DRY_RUN")"
pnpm tsx apps/scripts/upload-public-to-s3.ts --only=art $DRY_RUN

echo ""
echo "[new-art] Upload pass complete."
echo "      CDN URL pattern:"
echo "        https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/<category>/<file>"
echo ""
echo "      Verify with: pnpm tsx scripts/_check-art-coverage.mjs"
