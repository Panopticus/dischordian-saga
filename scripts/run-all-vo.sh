#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════
#   RUN ALL VO — orchestrator for every generator in the repo
#
#   Idempotent: each generator skips lines already in its
#   manifest, so re-running this script is free of duplicate
#   ElevenLabs charges. Crash-safe: every stage flushes after
#   each line, so Ctrl+C and re-run.
#
#   Use: bash scripts/run-all-vo.sh           (full run)
#        bash scripts/run-all-vo.sh --audit-only
#        bash scripts/run-all-vo.sh --skip-python
#
#   Required env:
#     ELEVENLABS_API_KEY      — must reach api.elevenlabs.io
#                               (cloud sandboxes that can't egress
#                               to that host will hard-fail at stage 2)
#     AWS_ACCESS_KEY_ID       — s3:PutObject on dgrsvoices
#     AWS_SECRET_ACCESS_KEY
#
#   Optional:
#     AWS_REGION              — default us-east-2
#     S3_BUCKET               — default dgrsvoices
# ═══════════════════════════════════════════════════════
set -uo pipefail

cd "$(dirname "$0")/.."
REPO_ROOT="$(pwd)"

AUDIT_ONLY=0
SKIP_PYTHON=0
for arg in "$@"; do
  case "$arg" in
    --audit-only)  AUDIT_ONLY=1 ;;
    --skip-python) SKIP_PYTHON=1 ;;
    *) echo "unknown flag: $arg"; exit 2 ;;
  esac
done

bold() { printf '\033[1m%s\033[0m\n' "$*"; }
dim()  { printf '\033[2m%s\033[0m\n' "$*"; }
ok()   { printf '\033[32m✓\033[0m %s\n' "$*"; }
warn() { printf '\033[33m!\033[0m %s\n' "$*"; }
fail() { printf '\033[31m✗\033[0m %s\n' "$*"; }

require_env() {
  local var=$1
  if [ -z "${!var:-}" ]; then
    fail "$var is required"
    return 1
  fi
}

# ── Pre-flight ──────────────────────────────────────────
bold "─── Pre-flight ───"
if [ $AUDIT_ONLY -eq 0 ]; then
  miss=0
  require_env ELEVENLABS_API_KEY    || miss=1
  require_env AWS_ACCESS_KEY_ID     || miss=1
  require_env AWS_SECRET_ACCESS_KEY || miss=1
  if [ $miss -eq 1 ]; then
    echo
    echo "Set the missing env vars and re-run. To probe coverage without"
    echo "running anything, use:  bash scripts/run-all-vo.sh --audit-only"
    exit 1
  fi

  # Probe api.elevenlabs.io. Cloud sandboxes (incl. Claude Code Remote)
  # block this host at the egress proxy — fail fast with a clear message
  # rather than burning N stages of failed retries.
  code=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 8 \
    -H "xi-api-key: $ELEVENLABS_API_KEY" \
    https://api.elevenlabs.io/v1/voices || echo "000")
  if [ "$code" = "403" ]; then
    deny=$(curl -sS -i --max-time 8 https://api.elevenlabs.io/v1/voices 2>/dev/null \
      | tr -d '\r' | grep -i '^x-deny-reason:' || true)
    if echo "$deny" | grep -qi host_not_allowed; then
      fail "Sandbox proxy is blocking egress to api.elevenlabs.io"
      echo "    ($deny)"
      echo "    Run this script from a host with open egress (your local"
      echo "    machine, a CI runner with no proxy, etc.). The README at"
      echo "    apps/scripts/VO_GENERATION_README.md calls out the same"
      echo "    constraint."
      exit 3
    fi
    fail "ElevenLabs returned 403 — most likely IP allowlist on the key."
    echo "    Disable IP restrictions on the key (or add your egress IP)."
    exit 4
  fi
  if [ "$code" != "200" ]; then
    fail "Unexpected response from ElevenLabs (HTTP $code). Aborting."
    exit 5
  fi
  ok "api.elevenlabs.io reachable (HTTP 200)"
fi

# ── Helper to time + label each stage ───────────────────
run_stage() {
  local label="$1"; shift
  echo
  bold "─── $label ───"
  local start=$(date +%s)
  if "$@"; then
    local elapsed=$(( $(date +%s) - start ))
    ok "$label complete (${elapsed}s)"
    return 0
  else
    local rc=$?
    local elapsed=$(( $(date +%s) - start ))
    fail "$label exited with code $rc (${elapsed}s) — continuing"
    return $rc
  fi
}

if [ $AUDIT_ONLY -eq 1 ]; then
  bold "─── Coverage Audit (no API calls) ───"
  node scripts/_vo-audit.mjs
  exit $?
fi

# ── Stage 1: TE-sync (no API calls) ────────────────────
run_stage "Stage 1 / sync trade empire lines into act3"  pnpm tsx apps/scripts/sync-te-vo-lines.ts

# ── Stage 2: Acts 2-7 spine ───────────────────────────
run_stage "Stage 2 / vo:act2"  pnpm vo:act2
run_stage "Stage 3 / vo:act3"  pnpm vo:act3
run_stage "Stage 4 / vo:act4"  pnpm vo:act4
run_stage "Stage 5 / vo:act5"  pnpm vo:act5
run_stage "Stage 6 / vo:act6"  pnpm vo:act6
run_stage "Stage 7 / vo:act7"  pnpm vo:act7

# ── Stage 3: Prelude + Act 1 + Companion ──────────────
run_stage "Stage 8 / vo:companion"   pnpm vo:companion
run_stage "Stage 9 / vo:prelude"     pnpm vo:prelude
run_stage "Stage 10 / vo:act1"       pnpm vo:act1

# ── Stage 4: First contact + story mode + chess climb ─
run_stage "Stage 11 / vo:first-contact"  pnpm vo:first-contact
run_stage "Stage 12 / vo:story-mode"     pnpm vo:story-mode
run_stage "Stage 13 / chess-climb"       pnpm tsx apps/scripts/generate-chess-climb-vo.ts

# ── Stage 4b: Room-mystery verb-coin surface ──────────
# Walks ROOM_MYSTERY_REGISTRY (apps/shared/roomMysteries) plus the
# legacy cryo bay table and emits one ElevenLabs recording per
# (voId, speaker) pair. Banded narrations expand to three recordings
# per band (lucid/fragmented/luminous for Elara; shadow/balanced/warm
# for the Detective). Idempotent — every voId already in its target
# manifest is skipped. Without this stage, every Look/Use/Talk click
# in the Ark Explorer's verb coin falls back to silent text.
run_stage "Stage 13b / vo:room-mystery"  pnpm vo:room-mystery

# ── Stage 4c: Other generator surfaces wired to npm scripts but
# previously missed by this orchestrator. Each is idempotent and
# safe to re-run; the historical bug is that they were never invoked
# by `pnpm vo:run-all`, so their content lived in code without
# corresponding audio:
#   • vo:awakening      → awakeningVoManifest    (cryo-bay revival sequence)
#   • vo:engineer-logs  → engineerVoManifest     (engineer-memoir field logs)
#   • vo:episodes       → episodeVoManifest      (CoNexus episode dialog
#                                                  from CELEBRATION + MECHRONIS
#                                                  episode-scene maps)
#   • vo:guild-cutscenes → 25 per-speaker manifests fed by
#                          guild-cutscene-vo-lines.json (aoki, architect,
#                          between, chorus, engineer, greenshaw, halverez,
#                          kanevas, kasra, mireille, orphic, politician,
#                          proctor, vasara, vellis, vent, vex, warden,
#                          plus elara/human/meme/necromancer/etc.)
run_stage "Stage 13c / vo:awakening"       pnpm vo:awakening
run_stage "Stage 13d / vo:engineer-logs"   pnpm vo:engineer-logs
run_stage "Stage 13e / vo:episodes"        pnpm vo:episodes
run_stage "Stage 13f / vo:guild-cutscenes" pnpm vo:guild-cutscenes
# vo:act1-taunts: 21 taunt lines for the 7 act-1 opponents
# (collector, watcher, eidola, matrikala, authority, programmer,
# warlord-zero-first). Client wiring is complete — Act1OpponentDialog
# carries tauntVoIds, useAct1TauntsVO merges the 7 manifests, and
# Act1OpponentTauntOverlay calls speak() on phase change. Without
# this stage the taunts silently fall back to text-only.
run_stage "Stage 13g / vo:act1-taunts"     pnpm vo:act1-taunts

# vo:first-meet: 54 lines across 8 NPC first-meeting dialog trees
# (adjudicator-locke, degen, game-master, meme, oracle, seer,
# vex-solene, wraith-calder). Lines emitted by
# _generate-npc-first-meet-lines.mjs. Each NPC merges into its
# existing per-character manifest where one ships, otherwise lands
# in a new <npc>VoManifest.json under apps/shared/.
run_stage "Stage 13h / vo:first-meet"      pnpm vo:first-meet

# vo:apprentice: 1,978 lines across 24 voice slots (12 archetypes ×
# 2 genders). Voice direction sourced from apps/shared/apprentices.ts;
# voice ids in apprentice-voice-config.json. Writes one manifest per
# (archetype, gender) at apps/shared/apprentice<Archetype><Gender>VoManifest.json.
# This is the largest single stage of the orchestrator by line count.
run_stage "Stage 13i / vo:apprentice"      pnpm vo:apprentice

# ── Stage 5: Per-character Python generators ──────────
if [ $SKIP_PYTHON -eq 0 ]; then
  for char in elara human agent_zero antiquarian cades degen locke \
              meme necromancer nilmorg shadow_tongue source \
              engineer_memoir palimpsest_host seer; do
    run_stage "Stage 14.$char / generate_${char}_vo.py" \
      python3 apps/scripts/generate_${char}_vo.py
  done
else
  warn "skipping python char generators (--skip-python)"
fi

# ── Final audit ────────────────────────────────────────
echo
bold "─── Final coverage audit ───"
node scripts/_vo-audit.mjs

echo
bold "All stages complete."
echo "If 'TOTAL missing across all surfaces: 0' above, every VO line"
echo "in the game is now generated and on S3. Otherwise, see"
echo "docs/asset-uploads/2026-04-28-vo-coverage-audit.md for help."
