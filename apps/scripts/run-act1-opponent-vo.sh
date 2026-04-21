#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════
#   ACT 1 OPPONENT VO RUNNER — Wrapper for generate-act1-opponent-vo.ts
#
#   Usage (from repo root):
#     ./apps/scripts/run-act1-opponent-vo.sh
#     ./apps/scripts/run-act1-opponent-vo.sh --only elara
#     ./apps/scripts/run-act1-opponent-vo.sh --limit 3
#
#   Required env vars:
#     ELEVENLABS_API_KEY
#
#   Optional (if set, mp3s are uploaded to S3 and the VoManifest gets
#   CDN URLs instead of local /audio/... paths):
#     AWS_ACCESS_KEY_ID
#     AWS_SECRET_ACCESS_KEY
#     AWS_REGION   (default: us-east-2)
#     S3_BUCKET    (default: dgrsvoices)
#
#   Idempotent — skips any line id already present in the speaker's
#   VoManifest.json (elara, human, antiquarian).
# ═══════════════════════════════════════════════════════

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

if [ -z "${ELEVENLABS_API_KEY:-}" ]; then
  echo "ERROR: ELEVENLABS_API_KEY is not set."
  echo "  export ELEVENLABS_API_KEY=\"sk_...\""
  exit 1
fi

export AWS_REGION="${AWS_REGION:-us-east-2}"
export S3_BUCKET="${S3_BUCKET:-dgrsvoices}"

if ! command -v npx &>/dev/null; then
  echo "ERROR: npx not found. Install Node.js (v18 or newer)."
  exit 1
fi

echo "═══════════════════════════════════════"
echo "  ACT 1 OPPONENT VO RUNNER"
echo "  Repo:   $REPO_ROOT"
echo "═══════════════════════════════════════"

exec npx tsx apps/scripts/generate-act1-opponent-vo.ts "$@"
