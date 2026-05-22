/* ═══════════════════════════════════════════════════════
   WITNESS LEDGER — surfaces "all potentials shape the universe"
   as a visible mechanic.

   Every companion-quest completion writes
       potential.<anchor>.<sector>.<verb>
   into userProgress.gameData.narrativeFlags. The ledger reads
   those flags and groups them by anchor + sector — the
   Antiquarian's Archive UI renders the resulting map as
   "what the player has witnessed".

   Pure / synchronous / no I/O. The trpc procedure that
   exposes the ledger reads the flags from userProgress and
   calls aggregate() — see apps/server/routers/npcDialogues.ts.
   ═══════════════════════════════════════════════════════ */

import { COMPANION_QUEST_CATALOG } from "./companionQuestCatalog";
import type { CompanionQuestAnchor } from "./companionQuestCatalog";
import { SEASON_ARCS } from "./seasonArcs";

export interface LedgerEntry {
  /** The flag key that was set. */
  flag: string;
  /** The companion-quest id that emitted it. */
  questId: string;
  /** Title of the quest (for UI rendering). */
  questTitle: string;
  /** The card surfaced as a "potential" on completion. */
  cardId: string;
  /** Voiced fragment in the anchor's register. */
  fragment: string;
}

export interface WitnessLedger {
  /** Per-anchor entries — what the anchor has witnessed about the player. */
  byAnchor: Readonly<Record<string, ReadonlyArray<LedgerEntry>>>;
  /** Per-sector entries — what each sector remembers. */
  bySector: Readonly<Record<string, ReadonlyArray<LedgerEntry>>>;
  /** Season-arc progress — which chapters of which arcs the player has
   *  closed (count of closed chapters out of 5 per arc). */
  arcProgress: ReadonlyArray<{
    title: string;
    arcId: string;
    closed: number;
    total: number;
  }>;
  /** Total potentials collapsed. The number Daniel Cross will quote
   *  back at you when you ask after the Archive's word for this. */
  totalPotentials: number;
}

const QUESTS_BY_FLAG = new Map(
  COMPANION_QUEST_CATALOG.map((q) => [q.narrativeFlag, q] as const),
);

const ARC_CHAPTER_FLAGS_BY_ARC = new Map<string, ReadonlySet<string>>(
  SEASON_ARCS.map((arc) => [
    arc.arcId,
    new Set(arc.chapters.map((c) => `mystery_episode_complete:${arc.arcId}:${c.episodeId}`)),
  ]),
);

/** Aggregate a flag bag into a ledger view. Accepts the raw
 *  `gameData.narrativeFlags` record (string → truthy). */
export function aggregateWitnessLedger(
  flags: Readonly<Record<string, unknown>>,
): WitnessLedger {
  const byAnchor: Record<string, LedgerEntry[]> = {};
  const bySector: Record<string, LedgerEntry[]> = {};
  let totalPotentials = 0;

  for (const [flag, val] of Object.entries(flags)) {
    if (!val) continue;
    const def = QUESTS_BY_FLAG.get(flag);
    if (!def) continue;
    totalPotentials += 1;

    const entry: LedgerEntry = {
      flag,
      questId: def.id,
      questTitle: def.title,
      cardId: def.cardLoreHook.cardId,
      fragment: def.cardLoreHook.fragment,
    };
    for (const anchor of def.anchors) {
      (byAnchor[anchor] ??= []).push(entry);
    }
    for (const sector of def.sectors) {
      (bySector[sector] ??= []).push(entry);
    }
  }

  const arcProgress = SEASON_ARCS.map((arc) => {
    const arcFlags = ARC_CHAPTER_FLAGS_BY_ARC.get(arc.arcId) ?? new Set<string>();
    let closed = 0;
    for (const f of arcFlags) {
      if (flags[f]) closed += 1;
    }
    return {
      title: arc.title,
      arcId: arc.arcId,
      closed,
      total: arc.chapters.length,
    };
  });

  return { byAnchor, bySector, arcProgress, totalPotentials };
}

/** Convenience: derive an anchor's witness count from a flag bag. */
export function anchorWitnessCount(
  flags: Readonly<Record<string, unknown>>,
  anchor: CompanionQuestAnchor,
): number {
  let n = 0;
  for (const [flag, val] of Object.entries(flags)) {
    if (!val) continue;
    const def = QUESTS_BY_FLAG.get(flag);
    if (def?.anchors.includes(anchor)) n += 1;
  }
  return n;
}
