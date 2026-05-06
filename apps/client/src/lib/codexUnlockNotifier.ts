/* ═══════════════════════════════════════════════════════
   CODEX UNLOCK NOTIFIER

   Surfaces "X codex entry unlocked" toasts when the player's
   progression crosses an entry's unlockRequirement. Pure
   helpers below are testable without React; the
   `useCodexUnlockToasts` hook composes them with localStorage
   bookkeeping + sonner.

   Design lineage: ME's "codex update" pop-up. See plan §A4
   in /root/.claude/plans/restart-in-plan-mode-wobbly-dawn.md.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  CODEX_LORE_EXTENSIONS,
  type CodexLoreExtension,
} from "@/game/codexLoreExtensions";

const SEEN_STORAGE_KEY = "loredex-codex-seen-unlocks";

/* ─── Pure helpers ─── */

export interface UnlockableCodexEntry {
  id: string;
  title: string;
  unlockRequirement: number;
}

/** Pure-function entry filter — the same numeric-threshold rule
 *  CodexPage uses, factored out so other surfaces can reuse it. */
export function isCodexEntryUnlocked(
  entry: UnlockableCodexEntry,
  playerLevel: number,
): boolean {
  if (entry.unlockRequirement <= 0) return true;
  return playerLevel >= entry.unlockRequirement;
}

/** Diff a "previously seen unlocked" id-set against the
 *  current state. Returns the set of entries that just became
 *  unlocked — i.e. they're unlocked now AND weren't in the
 *  seen-set. Pure and trivially testable. */
export function diffNewlyUnlocked<T extends UnlockableCodexEntry>(
  entries: ReadonlyArray<T>,
  seenIds: ReadonlySet<string>,
  playerLevel: number,
): T[] {
  const out: T[] = [];
  for (const e of entries) {
    if (!isCodexEntryUnlocked(e, playerLevel)) continue;
    if (seenIds.has(e.id)) continue;
    out.push(e);
  }
  return out;
}

/* ─── localStorage bookkeeping ─── */

export function loadSeenUnlockIds(): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
}

export function persistSeenUnlockIds(ids: ReadonlySet<string>): void {
  try {
    localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    /* quota / private mode — silently degrade */
  }
}

/* ─── Hook ─── */

/** Mounts a side-effect that toasts each newly-unlocked codex
 *  entry whenever `playerLevel` changes upward. Suppresses
 *  toasts on first-load for entries already unlocked when the
 *  player started this session (a player who was already at
 *  level 5 shouldn't get 12 toasts on app boot). */
export function useCodexUnlockToasts(
  playerLevel: number,
  entries: ReadonlyArray<CodexLoreExtension> = CODEX_LORE_EXTENSIONS,
): void {
  const isFirstRunRef = useRef(true);

  useEffect(() => {
    const seen = loadSeenUnlockIds();
    const newlyUnlocked = diffNewlyUnlocked(entries, seen, playerLevel);

    // Always update the seen-set so we never re-toast the same
    // entry, even on first run (where we suppress UI but still
    // commit to storage).
    if (newlyUnlocked.length > 0) {
      const next = new Set(seen);
      for (const entry of newlyUnlocked) next.add(entry.id);
      persistSeenUnlockIds(next);
    }

    if (isFirstRunRef.current) {
      isFirstRunRef.current = false;
      return;
    }

    for (const entry of newlyUnlocked) {
      toast.success(`Codex updated: ${entry.title}`, {
        description: entry.unlockCondition,
        duration: 6000,
      });
    }
  }, [playerLevel, entries]);
}
