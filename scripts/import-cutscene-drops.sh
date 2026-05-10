#!/usr/bin/env bash
# import-cutscene-drops.sh
#
# One-shot import for the 2026-05-10 producer cutscene drop:
#   FIGHT_INTROS_COMPLETE.zip   (21 chapter intros)
#   GUILD_SIGNATURES.zip        (24 signature ability cutscenes — already wired)
#   OTHER_CUTSCENES.zip         (46 misc: awakening, confession_close, etc.)
#
# Run from repo root with the three zips already saved locally:
#   FIGHT_INTROS_ZIP=~/Downloads/FIGHT_INTROS_COMPLETE.zip \
#   GUILD_SIGS_ZIP=~/Downloads/GUILD_SIGNATURES.zip \
#   OTHER_ZIP=~/Downloads/OTHER_CUTSCENES.zip \
#     bash scripts/import-cutscene-drops.sh
#
# What it does:
#   1. Unzips into a scratch dir under .cutscene-staging/ (gitignored)
#   2. Copies videos to apps/client/public/videos/<subdir>/ at paths the
#      existing manifests/registries expect (CDN mirrors public/ 1:1).
#   3. Prints a dry-run uploader preview. CDN push is a separate step:
#        AWS_ACCESS_KEY_ID=… AWS_SECRET_ACCESS_KEY=… pnpm assets:upload
#
# Idempotent: re-running won't re-copy existing files (uses cp --update=none).
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

FIGHT_INTROS_ZIP="${FIGHT_INTROS_ZIP:-${HOME}/Downloads/FIGHT_INTROS_COMPLETE.zip}"
GUILD_SIGS_ZIP="${GUILD_SIGS_ZIP:-${HOME}/Downloads/GUILD_SIGNATURES.zip}"
OTHER_ZIP="${OTHER_ZIP:-${HOME}/Downloads/OTHER_CUTSCENES.zip}"

for z in "$FIGHT_INTROS_ZIP" "$GUILD_SIGS_ZIP" "$OTHER_ZIP"; do
  if [[ ! -f "$z" ]]; then
    echo "ERROR: missing zip: $z" >&2
    echo "       set FIGHT_INTROS_ZIP / GUILD_SIGS_ZIP / OTHER_ZIP env vars" >&2
    exit 1
  fi
done

STAGING="${REPO_ROOT}/.cutscene-staging"
mkdir -p "${STAGING}"/{fight_intros,guild_signatures,other}

PUB="${REPO_ROOT}/apps/client/public/videos"
mkdir -p \
  "${PUB}/fight-intros" \
  "${PUB}/guild-cutscenes/f4_abilities" \
  "${PUB}/cutscenes/awakening" \
  "${PUB}/vfx/dreamer_visions" \
  "${PUB}/confession_close" \
  "${PUB}/dlc_mystery" \
  "${PUB}/events" \
  "${PUB}/human_reveal" \
  "${PUB}/prestige" \
  "${PUB}/wheel_reactions"

echo "==> Unzipping into ${STAGING}"
unzip -o -q "$FIGHT_INTROS_ZIP" -d "${STAGING}/fight_intros"
unzip -o -q "$GUILD_SIGS_ZIP"   -d "${STAGING}/guild_signatures"
unzip -o -q "$OTHER_ZIP"        -d "${STAGING}/other"

# ── Tier A: WIRED (paths already match manifests; uploading these is the
#            only step needed to bring them online) ──────────────────────

# Portable no-clobber copy — `cp -n` exists on both BSD (macOS) and GNU.
# Avoids GNU-only `--update=none` which BSD cp rejects.

echo "==> [WIRED] Guild signatures (24 → guild-cutscenes/f4_abilities/)"
# zip lays out per-professor folders: guild_signatures/<professor>_<variant>/cs_sig_N_<variant>.mp4
find "${STAGING}/guild_signatures" -type f -name 'cs_sig_*.mp4' \
  -exec cp -n {} "${PUB}/guild-cutscenes/f4_abilities/" \;

echo "==> [WIRED] Dreamer VFX (3 → vfx/dreamer_visions/)"
cp -n "${STAGING}/other/dreamer_vfx/"*.mp4 \
  "${PUB}/vfx/dreamer_visions/"

# ── Tier B: STAGED, NOT WIRED. Files land at the paths used elsewhere
#            in the project so when wiring lands, no path migration is
#            needed. Until wiring exists, these uploads serve as
#            preflight (CDN warm) but won't play in-game. ───────────────

echo "==> [STAGED-ONLY] Fight intros (21 → fight-intros/)"
# Zip contains both top-level + nested duplicate copies; pick top-level only.
for d in "${STAGING}/fight_intros"/*/; do
  [[ "$(basename "$d")" == "fight_intros" ]] && continue
  for f in "$d"*.mp4; do
    [[ -f "$f" ]] && cp -n "$f" "${PUB}/fight-intros/"
  done
done

echo "==> [STAGED-ONLY] Awakening shots (3 → cutscenes/awakening/)"
echo "    NOTE: producer-original filenames (93847_sunrises, first_clone_born,"
echo "    the_mandate). Cutscene player expects shot1/shot2/shot3.mp4 — needs"
echo "    a producer/writer call on shot ordering before renaming."
cp -n "${STAGING}/other/awakening/"*.mp4 "${PUB}/cutscenes/awakening/"

echo "==> [STAGED-ONLY] Other categories (no playback wiring yet)"
cp -n "${STAGING}/other/confession_close/"*.mp4 "${PUB}/confession_close/"
cp -nR "${STAGING}/other/dlc_mystery/"*         "${PUB}/dlc_mystery/"
cp -n "${STAGING}/other/events/"*.mp4           "${PUB}/events/"
cp -n "${STAGING}/other/human_reveal/"*.mp4     "${PUB}/human_reveal/"
cp -n "${STAGING}/other/prestige/"*.mp4         "${PUB}/prestige/"
cp -n "${STAGING}/other/wheel_reactions/"*.mp4  "${PUB}/wheel_reactions/"

echo
echo "==> Staged file count:"
find "${PUB}" -type f \( -name '*.mp4' -o -name '*.png' \) | wc -l

echo
echo "==> Next: dry-run the CDN uploader. This requires AWS creds in env."
echo "    AWS_ACCESS_KEY_ID=… AWS_SECRET_ACCESS_KEY=… pnpm assets:upload:dry"
echo "    Then for the real push:"
echo "    AWS_ACCESS_KEY_ID=… AWS_SECRET_ACCESS_KEY=… pnpm assets:upload"
echo
echo "Done."
