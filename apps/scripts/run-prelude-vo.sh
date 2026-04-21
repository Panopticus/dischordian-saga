#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════
#   PRELUDE VO RUNNER — Wrapper for generate-prelude-vo.ts
#
#   Usage (from repo root):
#     ./apps/scripts/run-prelude-vo.sh
#
#   Required env vars (export before running):
#     ELEVENLABS_API_KEY
#
#   Optional (if set, mp3s are uploaded to S3 and the VoManifest gets
#   CDN URLs instead of local /audio/... paths):
#     AWS_ACCESS_KEY_ID
#     AWS_SECRET_ACCESS_KEY
#     AWS_REGION   (default: us-east-2)
#     S3_BUCKET    (default: dgrsvoices)
#
#   Idempotent — skips lines already in the target VoManifest.json.
# ═══════════════════════════════════════════════════════

set -euo pipefail

# Resolve repo root relative to this script (apps/scripts/ -> two up)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

# ─── Validate ElevenLabs key (required). AWS vars are optional. ───
if [ -z "${ELEVENLABS_API_KEY:-}" ]; then
  echo "ERROR: ELEVENLABS_API_KEY is not set."
  echo
  echo "Export it before running:"
  echo "  export ELEVENLABS_API_KEY=\"sk_...\""
  echo
  echo "Optionally also export AWS creds to upload mp3s to S3 and"
  echo "record CDN URLs in the VoManifest files:"
  echo "  export AWS_ACCESS_KEY_ID=\"AKIA...\""
  echo "  export AWS_SECRET_ACCESS_KEY=\"...\""
  echo
  echo "Then run:"
  echo "  ./apps/scripts/run-prelude-vo.sh"
  exit 1
fi

# ─── Apply defaults for optional vars ───
export AWS_REGION="${AWS_REGION:-us-east-2}"
export S3_BUCKET="${S3_BUCKET:-dgrsvoices}"

# ─── Check tsx is available ───
if ! command -v npx &>/dev/null; then
  echo "ERROR: npx not found. Install Node.js (v18 or newer)."
  exit 1
fi

echo "═══════════════════════════════════════"
echo "  PRELUDE VO RUNNER"
echo "  Repo:   $REPO_ROOT"
echo "  Region: $AWS_REGION"
echo "  Bucket: $S3_BUCKET"
echo "═══════════════════════════════════════"
echo

# ─── Run the generator ───
exec npx tsx apps/scripts/generate-prelude-vo.ts
