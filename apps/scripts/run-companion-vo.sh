#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════
#   COMPANION VO RUNNER — Wrapper for generate-companion-vo.ts
#
#   Usage (from repo root):
#     ./apps/scripts/run-companion-vo.sh
#     ./apps/scripts/run-companion-vo.sh --dry-run
#     ./apps/scripts/run-companion-vo.sh --only elara
#     ./apps/scripts/run-companion-vo.sh --only human --limit 3
#
#   Required env vars:
#     ELEVENLABS_API_KEY
#
#   Optional (if set, uploads to S3 and records CDN URLs; if unset,
#   writes /audio/... dev paths for `pnpm vo:s3-backfill` to upgrade):
#     AWS_ACCESS_KEY_ID
#     AWS_SECRET_ACCESS_KEY
#     AWS_REGION   (default: us-east-2)
#     S3_BUCKET    (default: dgrsvoices)
#
#   Idempotent — skips any line id already in the speaker's
#   VoManifest.json.
# ═══════════════════════════════════════════════════════

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

# Allow --dry-run without any creds (plan-only, no network I/O).
DRY_RUN=0
for arg in "$@"; do
  if [ "$arg" = "--dry-run" ]; then DRY_RUN=1; fi
done

if [ "$DRY_RUN" -eq 0 ] && [ -z "${ELEVENLABS_API_KEY:-}" ]; then
  echo "ERROR: ELEVENLABS_API_KEY is not set."
  echo "  export ELEVENLABS_API_KEY=\"sk_...\""
  echo
  echo "Or preview what would generate without creds:"
  echo "  ./apps/scripts/run-companion-vo.sh --dry-run"
  exit 1
fi

export AWS_REGION="${AWS_REGION:-us-east-2}"
export S3_BUCKET="${S3_BUCKET:-dgrsvoices}"

if ! command -v npx &>/dev/null; then
  echo "ERROR: npx not found. Install Node.js (v18 or newer)."
  exit 1
fi

echo "═══════════════════════════════════════"
echo "  COMPANION VO RUNNER"
echo "  Repo:   $REPO_ROOT"
echo "═══════════════════════════════════════"

exec npx tsx apps/scripts/generate-companion-vo.ts "$@"
