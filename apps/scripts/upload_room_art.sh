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
TMP_DIR="/tmp/rooms_library"

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

  # Download if --url given and zip not already at --zip path
  if [[ -n "$ZIP_URL" && -z "$ZIP_PATH" ]]; then
    mkdir -p "$TMP_DIR"
    ZIP_PATH="$TMP_DIR/rooms_complete_library.zip"
    if [[ ! -f "$ZIP_PATH" ]]; then
      echo "[H.A] Downloading rooms_complete_library.zip from presigned URL..."
      curl -fsSL -o "$ZIP_PATH" "$ZIP_URL"
      echo "[H.A] Downloaded $(du -h "$ZIP_PATH" | cut -f1)"
    fi
  fi

  if [[ -z "$ZIP_PATH" || ! -f "$ZIP_PATH" ]]; then
    echo "Error: no zip path provided. Use --zip <path> or --url <url>." >&2
    exit 1
  fi

  # Extract into a tmp dir to verify structure, then sync into public/
  mkdir -p "$TMP_DIR"
  if [[ ! -d "$TMP_DIR/rooms" ]]; then
    echo "[H.A] Extracting zip to $TMP_DIR..."
    unzip -q -o "$ZIP_PATH" -d "$TMP_DIR"
  fi

  # Verify structure
  if [[ ! -d "$TMP_DIR/rooms" ]]; then
    echo "Error: extracted zip does not contain a rooms/ directory" >&2
    exit 1
  fi

  ROOM_COUNT=$(find "$TMP_DIR/rooms" -maxdepth 1 -type d | tail -n +2 | wc -l)
  FILE_COUNT=$(find "$TMP_DIR/rooms" -type f -name "*.png" | wc -l)
  echo "[H.A] Extract OK: $ROOM_COUNT rooms / $FILE_COUNT PNG files"

  # Sync into apps/client/public/art/rooms/ (mirrors public/ → S3 convention)
  echo "[H.A] Syncing into $PUBLIC_DEST/..."
  mkdir -p "$PUBLIC_DEST"
  cp -r "$TMP_DIR/rooms/"* "$PUBLIC_DEST/"
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
