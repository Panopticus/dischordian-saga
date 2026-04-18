#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════
# VOID ENERGY PRE-COMMIT HOOK
#
# Runs scripts/void-energy-migrate.mjs against every staged
# .tsx / .ts file that contains Tailwind color ramps, hex
# literals, or rgba literals. Any modifications made by the
# migrator are re-staged automatically so the commit picks
# them up.
#
# Wire up: copy/symlink this to .git/hooks/pre-commit, e.g.:
#
#   ln -s ../../scripts/void-energy-pre-commit.sh \
#         .git/hooks/pre-commit
#
# Or run the pnpm install-hook convenience script if it
# exists. The hook is opt-in — we do not check it in at
# .git/hooks/pre-commit because git repos don't track hooks.
#
# Exit codes:
#   0  always. The hook never blocks commits; it only
#      migrates files. Contributors see "[void-migrate]
#      migrated <file>" and re-stage is automatic.
# ═══════════════════════════════════════════════════════

set -e

repo_root="$(git rev-parse --show-toplevel)"
staged=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(tsx?|jsx?)$' || true)

[ -z "$staged" ] && exit 0

# Filter to files that actually contain migration targets.
candidates=()
while IFS= read -r f; do
  [ -z "$f" ] && continue
  [ -f "$repo_root/$f" ] || continue
  if grep -qE 'text-(cyan|rose|amber|sky|emerald|violet|stone|slate|zinc|neutral|red|orange|yellow|lime|green|teal|blue|indigo|purple|fuchsia|pink|gray)-[0-9]{2,3}|bg-(cyan|rose|amber|sky|emerald|violet|stone|slate|zinc|neutral|red|orange|yellow|lime|green|teal|blue|indigo|purple|fuchsia|pink|gray)-[0-9]{2,3}|border-(cyan|rose|amber|sky|emerald|violet|stone|slate|zinc|neutral|red|orange|yellow|lime|green|teal|blue|indigo|purple|fuchsia|pink|gray)-[0-9]{2,3}|#[0-9a-fA-F]{3,8}|rgba?\(' "$repo_root/$f"; then
    candidates+=("$f")
  fi
done <<< "$staged"

[ ${#candidates[@]} -eq 0 ] && exit 0

echo "[void-pre-commit] running migrator on ${#candidates[@]} staged file(s)"
node "$repo_root/scripts/void-energy-migrate.mjs" "${candidates[@]}" || true

# Re-stage any files the migrator modified
for f in "${candidates[@]}"; do
  if ! git diff --quiet -- "$f"; then
    git add "$f"
  fi
done

exit 0
