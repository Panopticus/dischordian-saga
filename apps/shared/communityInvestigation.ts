/* ═══════════════════════════════════════════════════════
   COMMUNITY INVESTIGATION — global discovery tracking.

   audit/16 PR 29 (finding AR7 — ARG persona).

   Pre-audit, the saga had no player-coordination surface for
   ARG campaigns. Each player solved their own mysteries in
   isolation; the community had no way to see "X clues have
   been discovered globally" or "we're 30% of the way to
   solving the act-6 conspiracy thread together."

   This module ships the schema substrate. The audit asked
   for `investigationBoard.ts` (the per-player surface;
   PR #531 + #547 ship this as the Investigation Board page +
   yarn-diagram) and `communityInvestigation.ts` (the global
   tracker — this file).

   Schema-only ship. The server-side persistence (a
   `community_discovery_events` table + tally jobs) and the
   tRPC procedures that gate on `playerOptIn` and surface
   the snapshot are the consumer follow-up; this module
   ships the helpers + invariants so the runtime can wire in
   cleanly.

   Privacy: every event carries an `optIn` flag. Helpers
   filter on it; players who don't opt in contribute to the
   global tally for THEIR account but are never aggregated
   across the community. Anti-spoiler: only DISCOVERY counts
   are aggregated; specific clue/mystery IDs that any one
   player has uncovered are NOT surfaced cross-player.
   ═══════════════════════════════════════════════════════ */

/** Discovery events the community tracker aggregates. */
export type CommunityDiscoveryKind =
  | "clue_collected"
  | "mystery_solved"
  | "puzzle_solved"
  | "manuscript_entry_unlocked"
  | "unreachable_registered";

/** A single contribution to the global pool. The runtime
 *  inserts one of these per discovery; the aggregator folds
 *  them into the snapshot. */
export interface CommunityDiscoveryEvent {
  /** Stable id (uuid in production; deterministic in tests). */
  id: string;
  /** Kind of discovery. */
  kind: CommunityDiscoveryKind;
  /** The thing discovered — a clue id, mystery id, etc.
   *  ANTI-SPOILER: The runtime does NOT surface this field
   *  cross-player. Only the helper that computes per-target
   *  discovery counts can read it; the cross-player UI gets
   *  aggregate counts only. */
  targetId: string;
  /** Did the player opt in to contribute to the global
   *  tally? When false, the event still gets recorded for
   *  the player's own progress UI, but the helpers filter
   *  it out of any cross-player aggregation. */
  optIn: boolean;
  /** Real-world timestamp. Useful for season-window queries. */
  occurredAt: Date;
  /** ISO season key (e.g. "S2-2026") so historical events
   *  can be queried per-season. Falls back to undefined for
   *  pre-season events. */
  seasonKey?: string;
}

/** Aggregate snapshot. The runtime computes this once per
 *  query (cached briefly); the UI reads it. */
export interface CommunityInvestigationSnapshot {
  /** Total globally-discovered events that opted in. */
  globalDiscoveryCount: number;
  /** Per-kind breakdown for surface-tab counts. */
  countsByKind: Readonly<Record<CommunityDiscoveryKind, number>>;
  /** Total declared targets in this season — drives the
   *  percent-discovered surface. The runtime computes this
   *  by walking the canonical target registries (CLUES,
   *  MANUSCRIPT_VAULT, etc.). Optional in the snapshot
   *  shape for callers who only want raw counts. */
  declaredTargets?: Readonly<Record<CommunityDiscoveryKind, number>>;
  /** Optional season window the snapshot is filtered to. */
  seasonKey?: string;
}

/* ─── Pure helpers ─────────────────────────────────────── */

const KIND_KEYS: readonly CommunityDiscoveryKind[] = [
  "clue_collected",
  "mystery_solved",
  "puzzle_solved",
  "manuscript_entry_unlocked",
  "unreachable_registered",
];

function emptyCountsByKind(): Record<CommunityDiscoveryKind, number> {
  return {
    clue_collected: 0,
    mystery_solved: 0,
    puzzle_solved: 0,
    manuscript_entry_unlocked: 0,
    unreachable_registered: 0,
  };
}

/** Build a snapshot from raw events. Pure aggregator —
 *  filters on `optIn`, dedupes per-target so the same clue
 *  collected by 50 players counts ONCE in the global tally
 *  (the audit'd "we're 30% of the way" framing wants
 *  unique-discoveries, not total-events).
 *
 *  Optional seasonKey filter — drops events outside the
 *  named season window. */
export function buildCommunitySnapshot(
  events: ReadonlyArray<CommunityDiscoveryEvent>,
  options: {
    seasonKey?: string;
    declaredTargets?: Readonly<Record<CommunityDiscoveryKind, number>>;
  } = {},
): CommunityInvestigationSnapshot {
  const counts = emptyCountsByKind();
  const seenTargets = new Map<CommunityDiscoveryKind, Set<string>>();
  for (const kind of KIND_KEYS) seenTargets.set(kind, new Set());

  for (const event of events) {
    if (!event.optIn) continue;
    if (options.seasonKey && event.seasonKey !== options.seasonKey) continue;
    const set = seenTargets.get(event.kind)!;
    if (set.has(event.targetId)) continue;
    set.add(event.targetId);
    counts[event.kind] += 1;
  }

  const total = Object.values(counts).reduce((s, n) => s + n, 0);
  return {
    globalDiscoveryCount: total,
    countsByKind: counts,
    declaredTargets: options.declaredTargets,
    seasonKey: options.seasonKey,
  };
}

/** Compute percent-discovered per kind. Returns -1 for
 *  kinds with no declared-target denominator (so consumers
 *  can render a "-" cell instead of dividing by zero). */
export function percentDiscoveredByKind(
  snapshot: CommunityInvestigationSnapshot,
): Readonly<Record<CommunityDiscoveryKind, number>> {
  const out = emptyCountsByKind();
  if (!snapshot.declaredTargets) {
    for (const k of KIND_KEYS) out[k] = -1;
    return out;
  }
  for (const k of KIND_KEYS) {
    const declared = snapshot.declaredTargets[k] ?? 0;
    if (declared === 0) {
      out[k] = -1;
    } else {
      out[k] = Math.min(1, snapshot.countsByKind[k] / declared);
    }
  }
  return out;
}

/* ─── Milestones ───────────────────────────────────────── */

/** A community milestone — a threshold + a label that the
 *  UI surfaces when the global tally crosses it. */
export interface CommunityMilestone {
  id: string;
  /** Discovery count threshold. */
  threshold: number;
  /** Player-facing label. */
  label: string;
  /** Optional flavour blurb; the audit'd intent is that
   *  hitting a milestone feels like a community event,
   *  not a counter ticking. */
  blurb?: string;
}

/** Default milestone ladder — 10 / 50 / 100 / 500 / 1000.
 *  The runtime can replace this list per-season; the
 *  helpers read whatever ladder is passed in. */
export const DEFAULT_COMMUNITY_MILESTONES: readonly CommunityMilestone[] = [
  { id: "first_ten", threshold: 10, label: "First Ten", blurb: "The community has logged its first ten cross-player discoveries." },
  { id: "first_fifty", threshold: 50, label: "Fifty Logged", blurb: "Fifty discoveries. The thread is being followed." },
  { id: "first_hundred", threshold: 100, label: "Hundred Logged", blurb: "One hundred discoveries. The investigation has critical mass." },
  { id: "first_five_hundred", threshold: 500, label: "Five Hundred Logged" },
  { id: "first_thousand", threshold: 1000, label: "Thousand Logged" },
];

/** Returns the highest milestone whose threshold has been
 *  crossed. null when no milestone is yet reached. */
export function currentMilestone(
  snapshot: CommunityInvestigationSnapshot,
  ladder: readonly CommunityMilestone[] = DEFAULT_COMMUNITY_MILESTONES,
): CommunityMilestone | null {
  // Walk back-to-front to find the highest reached.
  for (let i = ladder.length - 1; i >= 0; i--) {
    const m = ladder[i]!;
    if (snapshot.globalDiscoveryCount >= m.threshold) return m;
  }
  return null;
}

/** Returns the next-unreached milestone — drives the
 *  "you're X away from Y" hint in the UI. null when all
 *  milestones reached. */
export function nextMilestone(
  snapshot: CommunityInvestigationSnapshot,
  ladder: readonly CommunityMilestone[] = DEFAULT_COMMUNITY_MILESTONES,
): { milestone: CommunityMilestone; remaining: number } | null {
  for (const m of ladder) {
    if (snapshot.globalDiscoveryCount < m.threshold) {
      return { milestone: m, remaining: m.threshold - snapshot.globalDiscoveryCount };
    }
  }
  return null;
}

/* ─── Privacy ──────────────────────────────────────────── */

/** Has the player opted in to community contribution?
 *  Pure helper that the UI calls before showing the
 *  "your discoveries are contributing" indicator. */
export interface CommunityPlayerSettings {
  /** Default false — players opt in explicitly per the
   *  audit's privacy framing. */
  optInToCommunityContribution: boolean;
}

export function canPlayerContribute(settings: CommunityPlayerSettings | null | undefined): boolean {
  return settings?.optInToCommunityContribution === true;
}
