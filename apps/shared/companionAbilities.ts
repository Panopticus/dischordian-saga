/* ═══════════════════════════════════════════════════════
   COMPANION ABILITIES — bond-gated card-battle support kit

   Plan §B6. Today companions are emotional anchors and
   dialogue partners but never tactical assets. This module
   adds the data layer for "the companion you bring into a
   card battle grants 1–3 activated abilities, gated by your
   bond level with them."

   Engine wiring (consuming abilities from cardGame.ts) is a
   deliberate follow-up — this PR ships the data + lookup
   helpers + per-bond unlock progression so the card-battle
   UI can render the slot without changing combat semantics.

   Bond model — same scale eidolonBond.ts uses (0–100).
   Abilities unlock at 20 / 40 / 60 / 80 thresholds, mirroring
   the existing trust-band cadence (see useNpcTrustBand).
   ═══════════════════════════════════════════════════════ */

import type { CompanionRosterId } from "./companionRoomRegistry";

export type CompanionAbilityAlignment = "order" | "chaos" | "neutral";

export interface CompanionAbility {
  id: string;
  companionId: CompanionRosterId;
  /** Bond threshold required to unlock this ability. */
  minBondLevel: number;
  name: string;
  /** One-line description shown on the slot tooltip. Engine
   *  wiring (later) reads `effectKind` to actually apply the
   *  effect — for now `description` is the source of truth
   *  for the UI. */
  description: string;
  /** Cooldown in ms applied after the ability fires. The slot
   *  hook tracks the timer; the engine wiring decides what
   *  the cooldown counts (real-time vs per-turn). */
  cooldownMs: number;
  /** Optional alignment tag — drives the slot's visual tint
   *  and clusters bond-gates by player's morality lean. */
  alignment?: CompanionAbilityAlignment;
  /** Discriminated tag for the eventual engine wiring. The
   *  card-game effect interpreter will read this and dispatch.
   *  Today no consumer reads it — purely forward-declaration. */
  effectKind:
    | "draw_card"
    | "heal_general"
    | "buff_friendly_unit"
    | "debuff_enemy_unit"
    | "deal_damage"
    | "summon_token";
}

/** Bond-band breakpoints. Every ability's minBondLevel should
 *  match one of these so the UI can group "tier 1 / tier 2 /
 *  tier 3 / tier 4" without per-ability special cases. */
export const COMPANION_BOND_TIERS = [20, 40, 60, 80] as const;
export type CompanionBondTier = (typeof COMPANION_BOND_TIERS)[number];

export const COMPANION_ABILITIES: ReadonlyArray<CompanionAbility> = [
  /* ─── Elara (holographic recon support) ─── */
  {
    id: "elara_signal_boost",
    companionId: "elara",
    minBondLevel: 20,
    name: "Signal Boost",
    description: "Draw 1 card. Elara opens a clean channel to your deck.",
    cooldownMs: 30_000,
    alignment: "order",
    effectKind: "draw_card",
  },
  {
    id: "elara_diagnostic_field",
    companionId: "elara",
    minBondLevel: 60,
    name: "Diagnostic Field",
    description: "Heal your general for 3. The Bridge's biofeedback rerouted to you.",
    cooldownMs: 60_000,
    alignment: "order",
    effectKind: "heal_general",
  },

  /* ─── The Human (substrate-grade combat coaching) ─── */
  {
    id: "human_quiet_word",
    companionId: "the_human",
    minBondLevel: 20,
    name: "Quiet Word",
    description: "Buff a friendly unit by +1/+1. He noticed something nobody else did.",
    cooldownMs: 45_000,
    alignment: "neutral",
    effectKind: "buff_friendly_unit",
  },
  {
    id: "human_archon_recall",
    companionId: "the_human",
    minBondLevel: 80,
    name: "Archon Recall",
    description: "Deal 2 damage to any enemy unit. Fifteen thousand years of pattern recognition.",
    cooldownMs: 90_000,
    alignment: "chaos",
    effectKind: "deal_damage",
  },

  /* ─── Antiquarian (scholarly support) ─── */
  {
    id: "antiquarian_footnote",
    companionId: "the_antiquarian",
    minBondLevel: 40,
    name: "Footnote",
    description: "Draw 1 card. He marks the page on a tome you didn't notice.",
    cooldownMs: 40_000,
    alignment: "neutral",
    effectKind: "draw_card",
  },

  /* ─── Locke (warmap bias) ─── */
  {
    id: "locke_market_intel",
    companionId: "adjudicator_locke",
    minBondLevel: 40,
    name: "Market Intel",
    description: "Buff a friendly unit by +2 attack. Locke knows what to underprice.",
    cooldownMs: 50_000,
    alignment: "order",
    effectKind: "buff_friendly_unit",
  },

  /* ─── Vex (medical / sabotage) ─── */
  {
    id: "vex_palliative",
    companionId: "vex_solene",
    minBondLevel: 20,
    name: "Palliative",
    description: "Heal your general for 2. She kept the syringe just in case.",
    cooldownMs: 35_000,
    alignment: "neutral",
    effectKind: "heal_general",
  },
  {
    id: "vex_sample_swap",
    companionId: "vex_solene",
    minBondLevel: 60,
    name: "Sample Swap",
    description: "Debuff an enemy unit by -2 attack. The vials weren't where you left them.",
    cooldownMs: 60_000,
    alignment: "chaos",
    effectKind: "debuff_enemy_unit",
  },

  /* ─── Jericho (armoury / token summon) ─── */
  {
    id: "jericho_field_drone",
    companionId: "jericho_jones",
    minBondLevel: 40,
    name: "Field Drone",
    description: "Summon a 1/1 drone token on an empty adjacent tile.",
    cooldownMs: 70_000,
    alignment: "neutral",
    effectKind: "summon_token",
  },
];

/* ─── Helpers ─── */

/** Abilities the player has unlocked for the named companion
 *  given their current bond. Sorted by minBondLevel ascending
 *  so the UI can render tier-1 leftmost. */
export function listCompanionAbilities(
  companionId: CompanionRosterId,
  bondLevel: number,
): CompanionAbility[] {
  return COMPANION_ABILITIES
    .filter((a) => a.companionId === companionId && a.minBondLevel <= bondLevel)
    .sort((a, b) => a.minBondLevel - b.minBondLevel);
}

/** Lookup by id. */
export function getCompanionAbility(id: string): CompanionAbility | undefined {
  return COMPANION_ABILITIES.find((a) => a.id === id);
}

/** Bond tier for a given level — useful for grouping the UI
 *  into "Tier 1 unlocked / Tier 2 unlocked …" strips. */
export function bondTierFor(bondLevel: number): CompanionBondTier | 0 {
  let highest: CompanionBondTier | 0 = 0;
  for (const tier of COMPANION_BOND_TIERS) {
    if (bondLevel >= tier) highest = tier;
  }
  return highest;
}

/** Next locked ability for the named companion, if any —
 *  drives the slot's "unlocks at bond NN" preview. */
export function nextLockedAbility(
  companionId: CompanionRosterId,
  bondLevel: number,
): CompanionAbility | null {
  const locked = COMPANION_ABILITIES
    .filter((a) => a.companionId === companionId && a.minBondLevel > bondLevel)
    .sort((a, b) => a.minBondLevel - b.minBondLevel);
  return locked[0] ?? null;
}
