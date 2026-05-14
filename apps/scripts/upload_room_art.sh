#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════
#   Phase H — producer-art room library CDN upload
#
#   One-shot script to upload the 561 PNG files from the
#   rooms_complete_library.zip ingest (H.A) to the dgrsart
#   S3 bucket at the canonical cdn/client-public/art/rooms/
#   prefix.
#
#   Two phases:
#     1. Extract the zip into apps/client/public/art/rooms/
#        (mirrors the existing public/ → S3 sync convention)
#     2. Run apps/scripts/upload-public-to-s3.ts which HEAD-
#        compares ETag, only uploads changed / missing files,
#        and emits a manifest of changes
#
#   Requirements:
#     - AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY in env
#       (or any credential source resolvable by
#       @aws-sdk/credential-provider-node) with s3:PutObject
#       + s3:HeadObject on the dgrsart bucket
#     - pnpm + tsx installed (root package.json)
#     - rooms_complete_library.zip available — either at
#       --zip <path> or by re-downloading via the AAA Final
#       presigned URL passed as --url <url>
#
#   Usage:
#     ./apps/scripts/upload_room_art.sh --zip /tmp/rooms_complete_library.zip
#     ./apps/scripts/upload_room_art.sh --url '<presigned URL>'
#     ./apps/scripts/upload_room_art.sh --skip-extract  # if already in public/
#     ./apps/scripts/upload_room_art.sh --dry-run       # print only
#
#   Idempotent: re-runnable. ETag compare skips already-uploaded
#   files. Safe to interrupt + resume.
# ═══════════════════════════════════════════════════════

set -euo pipefail

ZIP_PATH=""
ZIP_URL=""
DRY_RUN=""
SKIP_EXTRACT=""
PUBLIC_DEST="apps/client/public/art/rooms"
TMP_BASE="/tmp/rooms_library"

usage() {
  cat <<EOF
Usage: $0 [options]

Options:
  --zip <path>      Path to rooms_complete_library.zip
  --url <url>       Presigned URL to download the zip from (alternative to --zip)
  --skip-extract    Skip extract step (files already in apps/client/public/art/rooms/)
  --dry-run         Print upload commands without executing
  --help            Show this help

Examples:
  $0 --zip ~/Downloads/rooms_complete_library.zip
  $0 --url 'https://dgrsart.s3.us-east-2.amazonaws.com/...'
  $0 --skip-extract --dry-run
EOF
  exit 0
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --zip) ZIP_PATH="$2"; shift 2 ;;
    --url) ZIP_URL="$2"; shift 2 ;;
    --skip-extract) SKIP_EXTRACT="1"; shift ;;
    --dry-run) DRY_RUN="--dry-run"; shift ;;
    --help|-h) usage ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

# ────────────────────────────────────────────────────
# Phase 1: ensure zip is present, extract to public/
# ────────────────────────────────────────────────────

if [[ -z "$SKIP_EXTRACT" ]]; then

  # Per-zip extract dir, derived from the zip filename — so pass 1, 2, 3
  # don't collide and re-extracts don't get silently skipped.
  if [[ -n "$ZIP_URL" && -z "$ZIP_PATH" ]]; then
    mkdir -p "$TMP_BASE"
    ZIP_PATH="$TMP_BASE/$(basename "${ZIP_URL%%\?*}")"
    if [[ ! -f "$ZIP_PATH" ]]; then
      echo "[H.A] Downloading $(basename "$ZIP_PATH") from presigned URL..."
      curl -fsSL -o "$ZIP_PATH" "$ZIP_URL"
      echo "[H.A] Downloaded $(du -h "$ZIP_PATH" | cut -f1)"
    fi
  fi

  if [[ -z "$ZIP_PATH" || ! -f "$ZIP_PATH" ]]; then
    echo "Error: no zip path provided. Use --zip <path> or --url <url>." >&2
    exit 1
  fi

  ZIP_BASENAME=$(basename "$ZIP_PATH" .zip)
  TMP_DIR="$TMP_BASE/$ZIP_BASENAME"

  # Always re-extract — cheap (~seconds) and avoids stale-cache bugs across passes.
  rm -rf "$TMP_DIR"
  mkdir -p "$TMP_DIR"
  echo "[H.A] Extracting $(basename "$ZIP_PATH") to $TMP_DIR..."
  unzip -q -o "$ZIP_PATH" -d "$TMP_DIR"

  # Auto-detect the zip's internal layout. Producer passes used three
  # different conventions:
  #   pass 1 (rooms_complete_library.zip):  rooms/<zipDir>/<file>
  #   pass 2 (final_22_rooms.zip):          <zipDir>/<file>     (bare; some nested under hellbox/)
  #   pass 3 (NEW_ROOMS_82.zip):            art/rooms/<zipDir>/<file>
  if [[ -d "$TMP_DIR/art/rooms" ]]; then
    SOURCE_DIR="$TMP_DIR/art/rooms"
  elif [[ -d "$TMP_DIR/rooms" ]]; then
    SOURCE_DIR="$TMP_DIR/rooms"
  else
    SOURCE_DIR="$TMP_DIR"
  fi

  # Count .png files under SOURCE_DIR; count distinct top-level dirs as a sanity readout.
  FILE_COUNT=$(find "$SOURCE_DIR" -type f -name "*.png" | wc -l | tr -d ' ')
  ROOM_COUNT=$(find "$SOURCE_DIR" -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')
  echo "[H.A] Extract OK: layout=$SOURCE_DIR — $ROOM_COUNT top-level dirs / $FILE_COUNT PNG files"

  if [[ "$FILE_COUNT" -eq 0 ]]; then
    echo "Error: no PNG files found under $SOURCE_DIR — zip layout not recognised" >&2
    exit 1
  fi

  # Sync into apps/client/public/art/rooms/ — preserves subdir structure
  # (e.g. hellbox/castle_of_death/throne_of_mercy_apse/baseline.png).
  echo "[H.A] Syncing into $PUBLIC_DEST/..."
  mkdir -p "$PUBLIC_DEST"
  cp -R "$SOURCE_DIR/"* "$PUBLIC_DEST/"
  echo "[H.A] Sync complete"

fi

# ────────────────────────────────────────────────────
# Phase 2: upload via existing apps/scripts/upload-public-to-s3.ts
# ────────────────────────────────────────────────────

if [[ -z "${AWS_ACCESS_KEY_ID:-}" && -z "${AWS_PROFILE:-}" ]]; then
  echo "Warning: AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY not set in env." >&2
  echo "The upload script will fail unless credentials are resolvable by" >&2
  echo "@aws-sdk/credential-provider-node (env / shared config / EC2 instance role)." >&2
fi

echo "[H.A] Running apps/scripts/upload-public-to-s3.ts --only=art$([ -n "$DRY_RUN" ] && echo " $DRY_RUN")"
pnpm tsx apps/scripts/upload-public-to-s3.ts --only=art $DRY_RUN

echo ""
echo "[H.A] Upload pass complete."
echo "      CDN URL pattern:"
echo "        https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/rooms/<zipDir>/<filename>"
echo ""
echo "      Example:"
echo "        https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/rooms/cryo_bay/baseline.png"
echo ""
echo "      Verify with: pnpm tsx scripts/_check-art-coverage.mjs"
