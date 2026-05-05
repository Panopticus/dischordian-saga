/* ═══════════════════════════════════════════════════════
   FACTION REGISTRY

   The five canonical factions named in NARRATIVE_ARCHITECTURE.md.
   Standing with each is tracked per-player in the
   user_faction_standing table; the factionStandingService applies
   deltas, writes threshold-crossing public flags, and the
   existing NPC banks read those flags via reactsToPublicFlag.

   Standing ranges and thresholds:

     +75 → +100  champion (writes `faction:championed:<id>` flag)
     +25 → +74   ally
     -24 →  +24  neutral (default for new players)
     -74 → -25   suspect
     -75 → -100  enemy (writes `faction:enemied:<id>` flag)

   Threshold-crossing flags are sticky — a championed-then-fallen
   player keeps the championed flag in the npc_public_flags ledger
   so callbacks like "you used to walk with us" still resolve. The
   service can clear them on request via clearFactionFlag.
   ═══════════════════════════════════════════════════════ */

export type FactionId =
  | "architect_remnants"
  | "new_babylon"
  | "hierarchy"
  | "insurgency"
  | "dreamers_children";

export interface FactionDef {
  id: FactionId;
  /** Human-readable name. */
  name: string;
  /** Two-sentence lore description for UI tooltips. */
  description: string;
  /** Default starting standing (almost always 0). */
  startingStanding: number;
  /** Factions whose +standing implies -standing here. Cross-axis
   *  pairing — championing the Insurgency drains New Babylon, etc. */
  opposes: readonly FactionId[];
  /** Public-flag string written when player crosses the +75
   *  champion threshold. */
  championedFlag: string;
  /** Public-flag string written when player crosses the -75
   *  enemy threshold. */
  enemiedFlag: string;
}

export const FACTION_REGISTRY: Readonly<Record<FactionId, FactionDef>> = {
  architect_remnants: {
    id: "architect_remnants",
    name: "Architect Remnants",
    description:
      "The fragmented order that once tended the Source. They keep the Ark's deepest archives and trust nothing built after the Fall.",
    startingStanding: 0,
    opposes: ["dreamers_children", "insurgency"],
    championedFlag: "faction:championed:architect_remnants",
    enemiedFlag: "faction:enemied:architect_remnants",
  },
  new_babylon: {
    id: "new_babylon",
    name: "New Babylon",
    description:
      "The Adjudicator's bureaucracy. Trade contracts, courtrooms, and the careful machinery of post-Fall order.",
    startingStanding: 0,
    opposes: ["insurgency", "dreamers_children"],
    championedFlag: "faction:championed:new_babylon",
    enemiedFlag: "faction:enemied:new_babylon",
  },
  hierarchy: {
    id: "hierarchy",
    name: "The Hierarchy",
    description:
      "The Hierarchy of the Damned — Zyr'Koth's order of demon-lords. Rumour says they have a ledger of every Potential. Probably true.",
    startingStanding: 0,
    opposes: ["dreamers_children", "architect_remnants"],
    championedFlag: "faction:championed:hierarchy",
    enemiedFlag: "faction:enemied:hierarchy",
  },
  insurgency: {
    id: "insurgency",
    name: "The Insurgency",
    description:
      "Iron Lions, demolitionists, and the people who think New Babylon's law is a slow knife. They keep the most reliable maps.",
    startingStanding: 0,
    opposes: ["new_babylon", "architect_remnants"],
    championedFlag: "faction:championed:insurgency",
    enemiedFlag: "faction:enemied:insurgency",
  },
  dreamers_children: {
    id: "dreamers_children",
    name: "Dreamer's Children",
    description:
      "Believers who follow the Dreamer's signal across cycle resets. Mystics, transhumanists, the Voltari-curious. Soft-edged and dangerous.",
    startingStanding: 0,
    opposes: ["architect_remnants", "hierarchy"],
    championedFlag: "faction:championed:dreamers_children",
    enemiedFlag: "faction:enemied:dreamers_children",
  },
};

export const FACTION_IDS: readonly FactionId[] = Object.keys(FACTION_REGISTRY) as FactionId[];

/** Standing band for a numeric value. */
export type FactionBand = "enemy" | "suspect" | "neutral" | "ally" | "champion";

export function bandFor(standing: number): FactionBand {
  if (standing >= 75) return "champion";
  if (standing >= 25) return "ally";
  if (standing <= -75) return "enemy";
  if (standing <= -25) return "suspect";
  return "neutral";
}

/**
 * Resolve cross-faction echoes for a primary delta. Championing
 * the Insurgency by +20 also drains opposed factions by -10. Used
 * by factionStandingService.applyDelta to keep the alignment
 * landscape coherent without writers having to specify every
 * cross-effect by hand.
 */
export function resolveCrossEffects(
  primary: FactionId,
  delta: number,
): Array<{ factionId: FactionId; delta: number }> {
  if (delta === 0) return [];
  const def = FACTION_REGISTRY[primary];
  const echo = -Math.round(delta / 2);
  if (echo === 0) return [];
  return def.opposes.map((id) => ({ factionId: id, delta: echo }));
}
