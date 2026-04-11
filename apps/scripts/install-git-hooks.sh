#!/usr/bin/env sh
# Task 9.1 — one-shot installer for the repo's git hooks.
#
# Git doesn't auto-activate hooks from a tracked directory, so this
# script flips `core.hooksPath` to point at `.githooks/`. Run it
# once after cloning the repo:
#
#     scripts/install-git-hooks.sh
#
# Unlike husky, there's no dependency, no node_modules install step,
# and the hook definitions live in version control alongside
# everything else. CI doesn't care (it runs the full pipeline via
# .github/workflows/ci.yml); this is local-only enforcement.

set -eu

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "[install-git-hooks] ❌ Must be run inside the dischordian-saga git repo."
  exit 1
}

HOOKS_DIR="$REPO_ROOT/.githooks"

if [ ! -d "$HOOKS_DIR" ]; then
  echo "[install-git-hooks] ❌ $HOOKS_DIR not found. Did the checkout include the .githooks/ directory?"
  exit 1
fi

# Make sure every hook is executable (git will silently ignore
# non-executable ones on POSIX systems).
chmod +x "$HOOKS_DIR"/*

git -C "$REPO_ROOT" config core.hooksPath .githooks

echo "[install-git-hooks] ✅ hooks path set to .githooks/"
echo "[install-git-hooks] Active hooks:"
ls -1 "$HOOKS_DIR"
