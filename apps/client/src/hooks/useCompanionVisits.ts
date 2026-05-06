/* ═══════════════════════════════════════════════════════
   useCompanionVisits — "new content available" tracker

   Plan §B5. The companion-room registry tells the player
   *where* each companion lives; this hook tells them
   *when* a companion has something new to say.

   Each companion's authored content (banks, banter pairs,
   romance scenes, conditional banter) carries a version
   integer that the writing pass bumps when new lines land.
   The player's last-seen version per companion is persisted
   in localStorage. A companion has unread content iff their
   current authored version > the player's last-seen version.

   Pure helpers below; the React hook composes them with
   localStorage. The hook is the only React-touching part —
   the diff math is testable.
   ═══════════════════════════════════════════════════════ */

import { useCallback, useEffect, useState } from "react";
import type { CompanionRosterId } from "@shared/companionRoomRegistry";

const STORAGE_KEY = "loredex-companion-visits";

/** Per-companion "last seen content version" + last visit
 *  timestamp. Versions are integers — bump in the companion
 *  bank file when new authored content lands. */
export interface CompanionVisitState {
  /** Highest content version the player has seen. */
  lastSeenVersion: number;
  /** Wall-clock timestamp of the most recent visit. Used by
   *  the UI to show "you visited 3 days ago" framing. */
  lastVisitedAt: number;
}

export type CompanionVisitMap = Readonly<Record<string, CompanionVisitState | undefined>>;

/* ─── Pure helpers ─── */

/** True iff there's authored content the player hasn't seen
 *  yet for the named companion. Returns true when no record
 *  exists at all (first sight = "new"). */
export function hasUnreadContent(
  companionId: CompanionRosterId,
  currentVersion: number,
  visits: CompanionVisitMap,
): boolean {
  const entry = visits[companionId];
  if (!entry) return currentVersion > 0;
  return currentVersion > entry.lastSeenVersion;
}

/** Mark the named companion as "seen at this version" — used
 *  on visit. Returns the new map (immutable update). */
export function markVisited(
  companionId: CompanionRosterId,
  currentVersion: number,
  visits: CompanionVisitMap,
  now: number = Date.now(),
): CompanionVisitMap {
  return {
    ...visits,
    [companionId]: {
      lastSeenVersion: currentVersion,
      lastVisitedAt: now,
    },
  };
}

/** Days since the companion was last visited; null if never. */
export function daysSinceLastVisit(
  companionId: CompanionRosterId,
  visits: CompanionVisitMap,
  now: number = Date.now(),
): number | null {
  const entry = visits[companionId];
  if (!entry) return null;
  const ms = Math.max(0, now - entry.lastVisitedAt);
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

/** Companion ids that currently have unread content given
 *  the player's visit map and the current authored versions.
 *  Versions can be partial — companions absent from the map
 *  contribute nothing (no version means "no authored content
 *  to track yet"). */
export function listUnreadCompanions(
  versions: Partial<Record<CompanionRosterId, number>>,
  visits: CompanionVisitMap,
): CompanionRosterId[] {
  const out: CompanionRosterId[] = [];
  for (const [companionId, version] of Object.entries(versions)) {
    if (version === undefined) continue;
    if (hasUnreadContent(companionId as CompanionRosterId, version, visits)) {
      out.push(companionId as CompanionRosterId);
    }
  }
  return out;
}

/* ─── localStorage glue ─── */

export function loadVisits(): CompanionVisitMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    return parsed as CompanionVisitMap;
  } catch {
    return {};
  }
}

export function persistVisits(visits: CompanionVisitMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
  } catch {
    /* private mode / quota — silently degrade */
  }
}

/* ─── Hook ─── */

export interface UseCompanionVisitsResult {
  visits: CompanionVisitMap;
  hasUnread: (companionId: CompanionRosterId, currentVersion: number) => boolean;
  visit: (companionId: CompanionRosterId, currentVersion: number) => void;
}

/** React glue around the pure helpers + localStorage. Reads
 *  the visit map on mount; exposes a `visit(companion,
 *  version)` mutator that updates state + persists in one
 *  step. */
export function useCompanionVisits(): UseCompanionVisitsResult {
  const [visits, setVisits] = useState<CompanionVisitMap>({});

  // Hydrate from storage once on mount.
  useEffect(() => {
    setVisits(loadVisits());
  }, []);

  const hasUnread = useCallback(
    (companionId: CompanionRosterId, currentVersion: number) =>
      hasUnreadContent(companionId, currentVersion, visits),
    [visits],
  );

  const visit = useCallback((companionId: CompanionRosterId, currentVersion: number) => {
    setVisits((prev) => {
      const next = markVisited(companionId, currentVersion, prev);
      persistVisits(next);
      return next;
    });
  }, []);

  return { visits, hasUnread, visit };
}
