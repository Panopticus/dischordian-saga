/* ═══════════════════════════════════════════════════════
   DIRECT DUELS REGISTRY
   Post-arc TCG duels canonized by the Ocularum wave.

   A "direct duel" is a one-time canonical match against a
   named opponent that opens after a specific narrative
   gate. Distinct from CycleBattles (apps/shared/cycleBattles.ts)
   which are pre-Fall student duels in Project Celebration
   / Mechronis Academy; direct duels are post-arc
   confrontations gated by arc-episode completion.

   Each duel is gated by a CardUnlockCondition — the same
   condition shape the TCG card-unlock system uses
   (apps/shared/tcg-core/types/Card.ts:CardUnlockCondition).
   The runtime that surfaces a duel-opens-now event reads
   `unlockCondition` and asks the same expansion-unlock
   service the TCG uses for cards
   (apps/shared/tcg-core/rewards/expansionUnlockService.ts).

   PR-4 landed the Watcher direct duel as a single-duel
   module (apps/shared/watcherDirectDuel.ts). PR-5 generalized
   the shape into this registry so future arc-direct duels
   (Ith'Rael-direct, Logos-direct, etc.) can join without
   duplicating the runtime-binding code.
   ═══════════════════════════════════════════════════════ */

import type { CardUnlockCondition } from "./tcg-core/types/Card";

/**
 * The canonical direct-duel definition shape.
 *
 * Single duel definition for the saga. Future arc-direct duels
 * (Ith'Rael-direct, etc.) would follow this pattern as separate
 * exports in their own canon modules.
 */
export interface DirectDuelDef {
  /** Stable id. */
  id: string;
  /** Display name. */
  name: string;
  /** Canonical opponent id. */
  opponentId: string;
  /** Opponent display name. */
  opponentName: string;
  /** Faction of the opponent's deck. */
  opponentFaction: string;
  /** Deck theme name — flavors the AI and card pool. */
  deckTheme: string;
  /** Short mechanical description of the opponent's deck gimmick. */
  deckMechanics: string;
  /** Narrative beat that surfaces when the duel opens. */
  narrativeBeat: string;
  /** Reward card unlock (one-time, post-victory). */
  cardUnlock: {
    cardId: string;
    name: string;
    rarity: "common" | "rare" | "epic" | "legendary" | "mythic";
    alignment: "light" | "dark" | "neutral";
    flavor: string;
  };
  /**
   * The CardUnlockCondition that mirrors this duel's gating.
   * Runtime code that surfaces the duel-opens-now event reads
   * this and asks the same expansion-unlock service the TCG
   * uses for cards.
   */
  unlockCondition: CardUnlockCondition;
  /** Canonical arc + episode whose close opens this duel. */
  arcGate: { arcId: string; episodeId: string };
}

/**
 * THE WATCHER DIRECT DUEL — post-watcher.e3 unlock.
 *
 * The player canonically duels The Watcher. The deck is
 * surveillance-themed; the mechanics reward observation. The
 * card unlocked on victory is the Eye of the Order — a
 * structural reward that names what the Order's discipline
 * has just earned.
 */
export const WATCHER_DIRECT_DUEL: DirectDuelDef = {
  id: "watcher_direct_duel",
  name: "The Watcher Direct Duel",
  opponentId: "the_watcher",
  opponentName: "The Watcher / Lord Kanshi Sha",
  opponentFaction: "panopticon",
  deckTheme: "The All-Seeing Eye",
  deckMechanics:
    "Reveal-driven: the Watcher sees the top card of the player's deck at " +
    "the start of every turn and may discard it from a small palette of " +
    "responses. The player's hand size is canonically capped at 5; the " +
    "Watcher's is uncapped. The duel rewards the player who plays as if " +
    "every card is already visible to the opponent — because it is.",
  narrativeBeat:
    "Locke arranges the meeting. Neither the Authority nor the Hierarchy " +
    "is informed. The Watcher accepts on terms the Order finds curious — " +
    "he wants to play. He is the All-Seeing Eye; the discipline he " +
    "demands of his servants is the discipline the assassin used to end " +
    "his first life. The duel is the Order's question: has he learned " +
    "from the lesson, or only from the loss?",
  cardUnlock: {
    cardId: "s2_watcher_004_eye_of_the_order",
    name: "Eye of the Order",
    rarity: "legendary",
    alignment: "dark",
    flavor:
      "He watched the assassin enter. He watched the assassin leave. " +
      "The eye he was wearing then was the eye he taught her to use.",
  },
  unlockCondition: {
    kind: "arc_episode_complete",
    arcId: "arc.the_watcher",
    episodeId: "watcher.e3",
  },
  arcGate: {
    arcId: "arc.the_watcher",
    episodeId: "watcher.e3",
  },
};

/**
 * All registered direct duels. Currently one; future PRs
 * (Ith'Rael, others) may add more.
 */
export const DIRECT_DUELS: readonly DirectDuelDef[] = [
  WATCHER_DIRECT_DUEL,
] as const;

/**
 * Look up a direct duel by stable id.
 */
export function getDirectDuel(id: string): DirectDuelDef | undefined {
  return DIRECT_DUELS.find((d) => d.id === id);
}
