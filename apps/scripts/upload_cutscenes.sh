#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════
#   Producer-cutscene-drop CDN upload wrapper
#
#   One-shot script to upload the .mp4 + _start.png files from a
#   producer cutscene drop (e.g. NEW_CUTSCENES_67.zip, 2026-05-12)
#   to the dgrsart S3 bucket at the canonical
#   cdn/client-public/art/cutscenes/<category>/<file> prefix.
#
#   Two phases:
#     1. Extract the zip into apps/client/public/art/cutscenes/
#        (mirrors producer's `art/cutscenes/<category>/<file>` layout)
#     2. Run apps/scripts/upload-public-to-s3.ts which HEAD-compares
#        ETag, only uploads changed / missing files, and emits a
#        manifest of changes
#
#   Auto-detects the zip's internal layout. Producer drops have used
#   three different conventions across passes:
#     - bare `<category>/<file>`
#     - `cutscenes/<category>/<file>`
#     - `art/cutscenes/<category>/<file>`  (NEW_CUTSCENES_67.zip)
#
#   Requirements:
#     - AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY in env (or
#       any credential source resolvable by
#       @aws-sdk/credential-provider-node) with s3:PutObject +
#       s3:HeadObject on the dgrsart bucket
#     - pnpm + tsx installed (root package.json)
#
#   Usage:
#     ./apps/scripts/upload_cutscenes.sh --zip ~/Downloads/NEW_CUTSCENES_67.zip
#     ./apps/scripts/upload_cutscenes.sh --url '<presigned URL>'
#     ./apps/scripts/upload_cutscenes.sh --skip-extract        # already in public/
#     ./apps/scripts/upload_cutscenes.sh --dry-run             # print only
#
#   Idempotent: re-runnable. ETag compare skips already-uploaded files.
# ═══════════════════════════════════════════════════════

set -euo pipefail

ZIP_PATH=""
ZIP_URL=""
DRY_RUN=""
SKIP_EXTRACT=""
PUBLIC_DEST="apps/client/public/art/cutscenes"
TMP_BASE="/tmp/cutscenes_drop"

usage() {
  cat <<EOF
Usage: $0 [options]

Options:
  --zip <path>      Path to producer-cutscene zip
  --url <url>       Presigned URL to download the zip from
  --skip-extract    Skip extract step (files already in apps/client/public/art/cutscenes/)
  --dry-run         Print upload commands without executing
  --help            Show this help

Examples:
  $0 --zip ~/Downloads/NEW_CUTSCENES_67.zip
  $0 --url 'https://dgrsart.s3.us-east-2.amazonaws.com/...'
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

if [[ -z "$SKIP_EXTRACT" ]]; then

  if [[ -n "$ZIP_URL" && -z "$ZIP_PATH" ]]; then
    mkdir -p "$TMP_BASE"
    ZIP_PATH="$TMP_BASE/$(basename "${ZIP_URL%%\?*}")"
    if [[ ! -f "$ZIP_PATH" ]]; then
      echo "[cutscenes] Downloading $(basename "$ZIP_PATH") from presigned URL..."
      curl -fsSL -o "$ZIP_PATH" "$ZIP_URL"
      echo "[cutscenes] Downloaded $(du -h "$ZIP_PATH" | cut -f1)"
    fi
  fi

  if [[ -z "$ZIP_PATH" || ! -f "$ZIP_PATH" ]]; then
    echo "Error: no zip path provided. Use --zip <path> or --url <url>." >&2
    exit 1
  fi

  ZIP_BASENAME=$(basename "$ZIP_PATH" .zip)
  TMP_DIR="$TMP_BASE/$ZIP_BASENAME"
  rm -rf "$TMP_DIR"
  mkdir -p "$TMP_DIR"
  echo "[cutscenes] Extracting $(basename "$ZIP_PATH") to $TMP_DIR..."
  unzip -q -o "$ZIP_PATH" -d "$TMP_DIR"

  # Auto-detect the zip's internal layout.
  if [[ -d "$TMP_DIR/art/cutscenes" ]]; then
    SOURCE_DIR="$TMP_DIR/art/cutscenes"
  elif [[ -d "$TMP_DIR/cutscenes" ]]; then
    SOURCE_DIR="$TMP_DIR/cutscenes"
  else
    SOURCE_DIR="$TMP_DIR"
  fi

  MP4_COUNT=$(find "$SOURCE_DIR" -type f -name "*.mp4" | wc -l | tr -d ' ')
  PNG_COUNT=$(find "$SOURCE_DIR" -type f -name "*.png" | wc -l | tr -d ' ')
  CAT_COUNT=$(find "$SOURCE_DIR" -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')
  echo "[cutscenes] Extract OK: layout=$SOURCE_DIR — $CAT_COUNT categories / $MP4_COUNT mp4s / $PNG_COUNT pngs"

  if [[ "$MP4_COUNT" -eq 0 ]]; then
    echo "Error: no mp4 files found under $SOURCE_DIR — zip layout not recognised" >&2
    exit 1
  fi

  echo "[cutscenes] Syncing into $PUBLIC_DEST/..."
  mkdir -p "$PUBLIC_DEST"
  cp -R "$SOURCE_DIR/"* "$PUBLIC_DEST/"
  echo "[cutscenes] Sync complete"

fi

if [[ -z "${AWS_ACCESS_KEY_ID:-}" && -z "${AWS_PROFILE:-}" ]]; then
  echo "Warning: AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY not set in env." >&2
  echo "The upload script will fail unless credentials are resolvable by" >&2
  echo "@aws-sdk/credential-provider-node (env / shared config / EC2 instance role)." >&2
fi

echo "[cutscenes] Running apps/scripts/upload-public-to-s3.ts --only=art$([ -n "$DRY_RUN" ] && echo " $DRY_RUN")"
pnpm tsx apps/scripts/upload-public-to-s3.ts --only=art $DRY_RUN

echo ""
echo "[cutscenes] Upload pass complete."
echo "      CDN URL pattern:"
echo "        https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/cutscenes/<category>/<file>"
echo ""
echo "      Example:"
echo "        https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/cutscenes/forge/cs_forge_first_creation.mp4"
echo ""
echo "      Verify with: pnpm tsx scripts/_check-art-coverage.mjs"
