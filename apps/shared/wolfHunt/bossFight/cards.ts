/* ═══════════════════════════════════════════════════════
   WOLF-HUNT — Boss fight card module: card definitions

   Tiny card pool (4 wolf cards + 4 defender cards). Each
   card resolves to a small set of state mutations the
   reducer applies. Pure data — no functions in the defs.
   ═══════════════════════════════════════════════════════ */

import type { WolfCardId, DefenderCardId } from "./state";

export interface WolfCardDef {
  id: WolfCardId;
  name: string;
  blurb: string;
  /** Lieutenant HP damage. */
  damage: number;
  /** Lycos HP self-cost. */
  selfCost: number;
  /** Whether playing this card spares the lieutenant (mercy branch). */
  spares: boolean;
}

export interface DefenderCardDef {
  id: DefenderCardId;
  name: string;
  blurb: string;
  /** Lycos HP damage. */
  damage: number;
  /** Lieutenant HP heal. */
  heal: number;
}

export const WOLF_CARD_DEFS: Readonly<Record<WolfCardId, WolfCardDef>> = {
  hunt: {
    id: "hunt",
    name: "Hunt",
    blurb: "Commit to the kill. High damage, costly to recover from.",
    damage: 10,
    selfCost: 5,
    spares: false,
  },
  restraint: {
    id: "restraint",
    name: "Restraint",
    blurb: "Disable rather than kill. Mid damage, no self-cost.",
    damage: 7,
    selfCost: 0,
    spares: false,
  },
  mercy: {
    id: "mercy",
    name: "Mercy",
    blurb: "Offer the lieutenant a way out. Low damage, but ends the fight if it lands at low HP.",
    damage: 3,
    selfCost: 0,
    spares: true,
  },
  memory_of_the_medic: {
    id: "memory_of_the_medic",
    name: "Memory of the Medic",
    blurb: "Recall the League's medic who saved Lycos once. Heals Lycos.",
    damage: 0,
    selfCost: -20, // negative cost = heal
    spares: false,
  },
};

export const DEFENDER_CARD_DEFS: Readonly<Record<DefenderCardId, DefenderCardDef>> = {
  lord_rally: {
    id: "lord_rally",
    name: "Lord's Rally",
    blurb: "The lieutenant calls on the corruptor's authority. Heals.",
    damage: 0,
    heal: 8,
  },
  corrupted_guard: {
    id: "corrupted_guard",
    name: "Corrupted Guard",
    blurb: "A corrupted guard intercepts. Damages Lycos.",
    damage: 8,
    heal: 0,
  },
  reposition: {
    id: "reposition",
    name: "Reposition",
    blurb: "The lieutenant withdraws to a defensible position. Small heal, light damage.",
    damage: 3,
    heal: 4,
  },
  counter_strike: {
    id: "counter_strike",
    name: "Counter-Strike",
    blurb: "Mirrors the Wolf's last attack back at him. High Lycos damage.",
    damage: 12,
    heal: 0,
  },
};
