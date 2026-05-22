#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════
#   VO GAPS PIPELINE — end-to-end one-shot
#
#   Runs the full unified gap-fill pipeline in three stages:
#
#     1. Re-extract TS dialog banks → JSON
#        (apps/scripts/_extract-ts-dialog-banks.ts)
#        Pulls romance / encounter / act7-epilogue / story
#        dialog banks from their canonical TS sources and
#        emits matching *-lines.json files.
#
#     2. Re-sync Trade Empire VO lines → act3-vo-lines.json
#        (apps/scripts/sync-te-vo-lines.ts)
#        Merges TRADE_EMPIRE_VO_LINES into act3-vo-lines.json
#        so the act3_narrative bank in vo:gaps picks them up.
#
#     3. Run the gap-fill generator
#        (apps/scripts/generate_vo_gaps.py)
#        Discovers gaps across all 88 banks, generates only
#        missing lines, idempotent + resumable across runs.
#
#   Both stages 1+2 are idempotent JSON rewrites — safe to
#   re-run anytime. Stage 3 calls ElevenLabs / S3, so
#   credentials are required for the actual generation.
#
#   Usage:
#     bash scripts/run-vo-gaps-pipeline.sh           # full pipeline
#     bash scripts/run-vo-gaps-pipeline.sh --dry     # extract + sync + dry-run only
#     bash scripts/run-vo-gaps-pipeline.sh --extract-only   # just refresh JSONs
#     bash scripts/run-vo-gaps-pipeline.sh --only akai_shi,lycos  # subset
#
#   Required env (for stage 3, not for --dry / --extract-only):
#     ELEVENLABS_API_KEY        — ElevenLabs TTS API key
#     AWS_ACCESS_KEY_ID         — s3:PutObject on dgrsvoices
#     AWS_SECRET_ACCESS_KEY
#
#   Crash-safe: each line's manifest entry is persisted
#   immediately on success. Re-run after Ctrl+C / network
#   failure picks up exactly where it stopped.
# ═══════════════════════════════════════════════════════
# NOTE: deliberately NOT using `set -u` — macOS ships bash 3.2 which
# errors on empty-array expansion (`"${arr[@]}"`) under nounset.
set -o pipefail

cd "$(dirname "$0")/.."
REPO_ROOT="$(pwd)"

# ─── argv parsing ───
DRY=0
EXTRACT_ONLY=0
ONLY_FILTER=""
GAPS_FLAGS=()

while [ $# -gt 0 ]; do
  case "$1" in
    --dry|--dry-run)
      DRY=1
      GAPS_FLAGS+=(--dry-run)
      shift
      ;;
    --extract-only)
      EXTRACT_ONLY=1
      shift
      ;;
    --only)
      ONLY_FILTER="$2"
      GAPS_FLAGS+=(--only "$2")
      shift 2
      ;;
    --show-todos)
      GAPS_FLAGS+=(--show-todos)
      shift
      ;;
    -h|--help)
      sed -n '2,/^# ════/p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *)
      echo "unknown flag: $1" >&2
      exit 2
      ;;
  esac
done

step() {
  printf "\n\033[1;34m━━━ %s\033[0m\n" "$*"
}

# ─── Stage 1: extract TS dialog banks → JSON ───
step "Stage 1 · Extract TS dialog banks → JSON"
pnpm tsx apps/scripts/_extract-ts-dialog-banks.ts
EXTRACT_RC=$?
if [ $EXTRACT_RC -ne 0 ]; then
  echo "✗ extractor exited $EXTRACT_RC" >&2
  exit $EXTRACT_RC
fi

# ─── Stage 2: sync Trade Empire → act3-vo-lines.json ───
step "Stage 2 · Sync Trade Empire VO → act3-vo-lines.json"
pnpm tsx apps/scripts/sync-te-vo-lines.ts
SYNC_RC=$?
if [ $SYNC_RC -ne 0 ]; then
  echo "✗ sync exited $SYNC_RC" >&2
  exit $SYNC_RC
fi

if [ $EXTRACT_ONLY -eq 1 ]; then
  step "extract-only mode — stopping after re-sync."
  echo "Next: \`pnpm vo:gaps:dry\` to see gap surface, or"
  echo "      \`pnpm vo:gaps\` to generate (requires API credentials)."
  exit 0
fi

# ─── Stage 3: run the gap-fill generator ───
step "Stage 3 · vo:gaps (dry-run mode)" 2>&1
if [ $DRY -eq 0 ]; then
  # Live run — confirm credentials are present.
  MISSING_CREDS=0
  if [ -z "${ELEVENLABS_API_KEY:-}" ]; then
    echo "  ✗ \$ELEVENLABS_API_KEY is not set"
    MISSING_CREDS=1
  fi
  if [ -z "${AWS_ACCESS_KEY_ID:-}" ]; then
    echo "  ✗ \$AWS_ACCESS_KEY_ID is not set"
    MISSING_CREDS=1
  fi
  if [ -z "${AWS_SECRET_ACCESS_KEY:-}" ]; then
    echo "  ✗ \$AWS_SECRET_ACCESS_KEY is not set"
    MISSING_CREDS=1
  fi
  if [ $MISSING_CREDS -eq 1 ]; then
    echo
    echo "Live generation skipped — set the missing env vars and re-run."
    echo "Falling back to dry-run for the inventory."
    GAPS_FLAGS+=(--dry-run)
  fi
fi

# Bash-3-safe expansion of a possibly-empty array.
if [ ${#GAPS_FLAGS[@]} -eq 0 ]; then
  python3 apps/scripts/generate_vo_gaps.py
else
  python3 apps/scripts/generate_vo_gaps.py "${GAPS_FLAGS[@]}"
fi
GAPS_RC=$?

step "Pipeline complete · exit code $GAPS_RC"
exit $GAPS_RC
