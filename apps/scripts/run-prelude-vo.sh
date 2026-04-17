#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════
#   PRELUDE VO RUNNER — Wrapper for generate-prelude-vo.ts
#
#   Usage (from repo root):
#     ./apps/scripts/run-prelude-vo.sh
#
#   Required env vars (export before running):
#     ELEVENLABS_API_KEY
#     AWS_ACCESS_KEY_ID
#     AWS_SECRET_ACCESS_KEY
#
#   Optional (defaults applied if unset):
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

# ─── Validate required env vars ───
MISSING=()
for var in ELEVENLABS_API_KEY AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY; do
  if [ -z "${!var:-}" ]; then
    MISSING+=("$var")
  fi
done

if [ ${#MISSING[@]} -gt 0 ]; then
  echo "ERROR: Missing required environment variable(s):"
  for var in "${MISSING[@]}"; do
    echo "  - $var"
  done
  echo
  echo "Export them before running:"
  echo "  export ELEVENLABS_API_KEY=\"sk_...\""
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
