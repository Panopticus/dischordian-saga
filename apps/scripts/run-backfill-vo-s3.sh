#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════
#   VO S3 BACKFILL RUNNER — Wrapper for backfill-vo-s3.ts
#
#   Usage (from repo root):
#     ./apps/scripts/run-backfill-vo-s3.sh                    # upload + rewrite
#     ./apps/scripts/run-backfill-vo-s3.sh --dry-run          # preview only
#     ./apps/scripts/run-backfill-vo-s3.sh --only antiquarian # one speaker
#
#   Required env vars (real run only; --dry-run needs neither):
#     AWS_ACCESS_KEY_ID
#     AWS_SECRET_ACCESS_KEY
#
#   Optional (defaults applied if unset):
#     AWS_REGION   (default: us-east-2)
#     S3_BUCKET    (default: dgrsvoices)
#
#   Idempotent — skips any manifest entry whose URL is already an
#   https://… CDN URL.
# ═══════════════════════════════════════════════════════

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

# Let --dry-run bypass the AWS-cred check.
DRY_RUN=0
for arg in "$@"; do
  if [ "$arg" = "--dry-run" ]; then DRY_RUN=1; fi
done

if [ "$DRY_RUN" -eq 0 ]; then
  MISSING=()
  for var in AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY; do
    if [ -z "${!var:-}" ]; then
      MISSING+=("$var")
    fi
  done
  if [ ${#MISSING[@]} -gt 0 ]; then
    echo "ERROR: Missing required environment variable(s):"
    for var in "${MISSING[@]}"; do echo "  - $var"; done
    echo
    echo "Export them before running:"
    echo "  export AWS_ACCESS_KEY_ID=\"AKIA...\""
    echo "  export AWS_SECRET_ACCESS_KEY=\"...\""
    echo
    echo "Or preview what would upload without AWS creds:"
    echo "  ./apps/scripts/run-backfill-vo-s3.sh --dry-run"
    exit 1
  fi
fi

export AWS_REGION="${AWS_REGION:-us-east-2}"
export S3_BUCKET="${S3_BUCKET:-dgrsvoices}"

if ! command -v npx &>/dev/null; then
  echo "ERROR: npx not found. Install Node.js (v18 or newer)."
  exit 1
fi

echo "═══════════════════════════════════════"
echo "  VO S3 BACKFILL RUNNER"
echo "  Repo:   $REPO_ROOT"
echo "═══════════════════════════════════════"

exec npx tsx apps/scripts/backfill-vo-s3.ts "$@"
