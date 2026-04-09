#!/bin/bash
# GENERATE ALL REMAINING VO — Run all 8 character generators
# Usage: bash scripts/generate_all_vo.sh
set -e

echo "═══════════════════════════════════════"
echo "  DISCHORDIAN SAGA — FULL VO GENERATION"
echo "  8 characters, ~258 lines"
echo "═══════════════════════════════════════"

if [ -z "$ELEVENLABS_API_KEY" ] || [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
  echo "ERROR: Set these env vars first:"
  echo "  export ELEVENLABS_API_KEY=your_key"
  echo "  export AWS_ACCESS_KEY_ID=your_key_id"
  echo "  export AWS_SECRET_ACCESS_KEY=your_secret"
  exit 1
fi

cd "$(dirname "$0")/.."

for char in degen source shadow_tongue locke antiquarian nilmorg necromancer agent_zero; do
  echo ""
  echo "─── Generating: $char ───"
  python3 "scripts/generate_${char}_vo.py"
  echo "✓ $char complete"
  sleep 2
done

echo ""
echo "═══════════════════════════════════════"
echo "  ALL VO GENERATION COMPLETE"
echo "  Push manifests:"
echo "  git add shared/*VoManifest.json"
echo "  git commit -m 'All VO manifests'"
echo "  git push"
echo "═══════════════════════════════════════"
