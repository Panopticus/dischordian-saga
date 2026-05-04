/* ═══════════════════════════════════════════════════════
   MECHANIC TUTORIAL GATES — Full Walkthrough Extension

   The existing apps/shared/mechanicSystemTutors.ts surfaces
   ONE-shot intro cards for ten mechanics (each with a single
   character-justified speaker). This module is the
   walkthrough-shaped follow-on: ordered gates the player
   progresses through, each delivered via the appropriate
   teacher voice.

   Engineer-domain mechanics route through the Apprentice
   (apps/shared/apprenticeChanneledLines.ts), so the dead
   Engineer can still teach. Other mentor assignments come
   straight from the canonical roster (per plan §10).

   Pattern this file establishes (extensible to all 10 mechanics
   + 30+ side-system tutorials): per-mechanic ordered gate list,
   each gate naming the speaker, the trigger condition, the
   payoff, and the optional apprentice-channeling topic.

   This file ships the FIRST FULL WALKTHROUGH — DECKBUILDER —
   as the executable pattern. Subsequent commits author the
   remaining mechanics on the same shape.

   See plan §11 (Implementation Phases — Phase E onward).
   ═══════════════════════════════════════════════════════ */

import type { EngineerDomainTopic } from "./apprenticeChanneledLines";
import type { MechanicSystemId } from "./mechanicSystemTutors";

/** Trigger condition — when the runtime decides this gate should fire. */
export type GateTrigger =
  /** Fires on first opening of the relevant UI. */
  | { kind: "first_ui_open"; uiId: string }
  /** Fires after the player completes a specified action. */
  | { kind: "after_action"; actionId: string }
  /** Fires after the player has reached a specified count of an action. */
  | { kind: "after_action_count"; actionId: string; count: number }
  /** Fires after a prior gate completes. */
  | { kind: "after_gate"; gateId: string }
  /** Fires manually — UI surfaces a "Learn More" button the player taps. */
  | { kind: "manual" };

/** Speaker dispatch — runtime decides who delivers the line. */
export type GateSpeaker =
  /**
   * Routed through the player's bonded Apprentice.
   * Engineer-voice lines slip through mid-line; Elara may overlay.
   * The actual lines are pulled from apprenticeChanneledLines.ts
   * by topic id.
   */
  | { kind: "apprentice_channeling"; topic: EngineerDomainTopic }
  /** Direct speaker — no channeling layer. */
  | { kind: "direct"; speaker: "elara" | "the_human" | "the_seer" | "antiquarian" | "locke" | "veska" | "the_game_master" | "mol_garath" | "the_dreamer" | "the_meme" | "the_degen" | "the_necromancer" | "shadow_tongue" | "the_oracle" | "kanevas" | "aoki" | "halverez" | "zephyr_9" | "the_antiquarian"; };

export interface MechanicTutorialGate {
  /** Unique gate id. */
  readonly id: string;
  /** Mechanic this gate belongs to. */
  readonly systemId: MechanicSystemId;
  /** 1-based ordering within the mechanic's walkthrough. */
  readonly order: number;
  /** Gate display label. */
  readonly label: string;
  /** What this gate teaches in plain English. */
  readonly teaches: string;
  /** When the gate fires. */
  readonly trigger: GateTrigger;
  /** Who delivers the line. */
  readonly speaker: GateSpeaker;
  /** Reward issued on first completion. */
  readonly reward?: Readonly<{
    dream?: number;
    xp?: number;
    cardId?: string;
    flagSet?: string;
  }>;
  /** Flag set on completion — wires into save state. */
  readonly completionFlag: string;
}

/* ═══════════════════════════════════════════════════════
   DECKBUILDER WALKTHROUGH — full pattern
   ═══════════════════════════════════════════════════════ */

const DECKBUILDER_GATES: readonly MechanicTutorialGate[] = [
  {
    id: "tutor_deck_builder_intro",
    systemId: "deckbuilder",
    order: 1,
    label: "First Bench Visit",
    teaches:
      "The Deck is a constrained graph: forty cards, mana curve, faction limits. The Apprentice channels the Engineer's first bench-rule.",
    trigger: { kind: "first_ui_open", uiId: "engineer_bench" },
    speaker: { kind: "apprentice_channeling", topic: "deck_builder_intro" },
    reward: { dream: 50, xp: 100, flagSet: "deckbuilder_gate_1_done" },
    completionFlag: "deckbuilder_gate_1_done",
  },
  {
    id: "tutor_deck_builder_curve",
    systemId: "deckbuilder",
    order: 2,
    label: "Mana Curve",
    teaches:
      "Two-drops, three-drops, four-drops. Cheap on the bottom, payoff on top. The shape IS the discipline.",
    trigger: { kind: "after_gate", gateId: "tutor_deck_builder_intro" },
    speaker: { kind: "apprentice_channeling", topic: "deck_builder_curve" },
    reward: { xp: 150, flagSet: "deckbuilder_gate_2_done" },
    completionFlag: "deckbuilder_gate_2_done",
  },
  {
    id: "tutor_deck_builder_synergy",
    systemId: "deckbuilder",
    order: 3,
    label: "Card Conversations",
    teaches:
      "Two cards that hum together do more than two cards. Listen for the hum. Build conversations.",
    trigger: { kind: "after_action_count", actionId: "card_added_to_deck", count: 10 },
    speaker: { kind: "apprentice_channeling", topic: "deck_builder_synergy" },
    reward: { xp: 200, flagSet: "deckbuilder_gate_3_done" },
    completionFlag: "deckbuilder_gate_3_done",
  },
  {
    id: "tutor_deck_builder_slot_optim",
    systemId: "deckbuilder",
    order: 4,
    label: "Every Slot Pays Rent",
    teaches:
      "Forty slots. Each card earns its seat. If a card isn't paying, it isn't living there.",
    trigger: { kind: "after_action", actionId: "deck_completed_first_time" },
    speaker: { kind: "apprentice_channeling", topic: "deck_builder_slot_optim" },
    reward: { dream: 100, xp: 250, flagSet: "deckbuilder_gate_4_done" },
    completionFlag: "deckbuilder_gate_4_done",
  },
  {
    id: "tutor_bench_three_frequencies",
    systemId: "deckbuilder",
    order: 5,
    label: "The Bench Hums in Three Frequencies",
    teaches:
      "The Engineer's left this line for the player. The bench hums in three frequencies — his, the Seer's, yours. Apprentice channels the line; Elara overlays.",
    trigger: { kind: "after_action_count", actionId: "deck_built", count: 3 },
    speaker: { kind: "apprentice_channeling", topic: "bench_three_frequencies" },
    reward: { dream: 200, xp: 500, flagSet: "deckbuilder_gate_5_done" },
    completionFlag: "deckbuilder_gate_5_done",
  },
];

/* ═══════════════════════════════════════════════════════
   CRAFTING WALKTHROUGH — paired with deckbuilder
   ═══════════════════════════════════════════════════════ */

const CRAFTING_GATES: readonly MechanicTutorialGate[] = [
  {
    id: "tutor_crafting_imprint_laser",
    systemId: "deckbuilder",
    order: 6,
    label: "The Imprint Laser",
    teaches: "Steady hand. Don't blink. The binder catches your blink.",
    trigger: { kind: "first_ui_open", uiId: "imprint_laser" },
    speaker: { kind: "apprentice_channeling", topic: "crafting_imprint_laser" },
    reward: { xp: 200, flagSet: "crafting_imprint_done" },
    completionFlag: "crafting_imprint_done",
  },
  {
    id: "tutor_crafting_index_wall",
    systemId: "deckbuilder",
    order: 7,
    label: "The Index Wall",
    teaches:
      "The bench's memory. Anything you make goes up there; anything up there comes back down.",
    trigger: { kind: "after_gate", gateId: "tutor_crafting_imprint_laser" },
    speaker: { kind: "apprentice_channeling", topic: "crafting_index_wall" },
    reward: { xp: 100, flagSet: "crafting_index_wall_done" },
    completionFlag: "crafting_index_wall_done",
  },
  {
    id: "tutor_crafting_binder_clasp",
    systemId: "deckbuilder",
    order: 8,
    label: "The Binder Clasp",
    teaches: "Click, then quarter-turn. If it's loose, the imprint smudges.",
    trigger: { kind: "after_gate", gateId: "tutor_crafting_index_wall" },
    speaker: { kind: "apprentice_channeling", topic: "crafting_binder_clasp" },
    reward: { xp: 100, flagSet: "crafting_binder_clasp_done" },
    completionFlag: "crafting_binder_clasp_done",
  },
];

/* ═══════════════════════════════════════════════════════
   GOGGLES INHERITANCE GATE — endgame
   ═══════════════════════════════════════════════════════ */

const GOGGLES_INHERITANCE_GATE: MechanicTutorialGate = {
  id: "tutor_goggles_inherited",
  systemId: "deckbuilder",
  order: 9,
  label: "The Goggles, Inherited",
  teaches:
    "After the Apprentice graduates and the Goggles arc completes (Act 7), the bench gains source-sight. The Apprentice channels the Engineer's bequest line; Elara delivers his exact promise verbatim.",
  trigger: { kind: "after_action", actionId: "apprentice_graduates_act_7" },
  speaker: { kind: "apprentice_channeling", topic: "goggles_inherited" },
  reward: { dream: 1000, xp: 5000, flagSet: "goggles_inherited" },
  completionFlag: "goggles_inherited",
};

/* ═══════════════════════════════════════════════════════
   REGISTRY
   ═══════════════════════════════════════════════════════ */

export const MECHANIC_TUTORIAL_GATES: readonly MechanicTutorialGate[] = [
  ...DECKBUILDER_GATES,
  ...CRAFTING_GATES,
  GOGGLES_INHERITANCE_GATE,
];

export function getGatesForMechanic(
  systemId: MechanicSystemId,
): readonly MechanicTutorialGate[] {
  return [...MECHANIC_TUTORIAL_GATES]
    .filter((g) => g.systemId === systemId)
    .sort((a, b) => a.order - b.order);
}

export function getGateById(id: string): MechanicTutorialGate | undefined {
  return MECHANIC_TUTORIAL_GATES.find((g) => g.id === id);
}

/**
 * Given the player's flag state and trigger context, find the gates
 * eligible to fire. The runtime calls this whenever a relevant action
 * is logged.
 */
export interface GateContext {
  readonly flags: Record<string, unknown>;
  readonly recentAction?: string;
  readonly recentActionCount?: number;
  readonly openedUi?: string;
}

export function getEligibleGates(ctx: GateContext): readonly MechanicTutorialGate[] {
  return MECHANIC_TUTORIAL_GATES.filter((g) => {
    if (ctx.flags[g.completionFlag]) return false;
    return matchesTrigger(g.trigger, ctx);
  });
}

function matchesTrigger(trigger: GateTrigger, ctx: GateContext): boolean {
  switch (trigger.kind) {
    case "first_ui_open":
      return ctx.openedUi === trigger.uiId;
    case "after_action":
      return ctx.recentAction === trigger.actionId;
    case "after_action_count":
      return (
        ctx.recentAction === trigger.actionId &&
        (ctx.recentActionCount ?? 0) >= trigger.count
      );
    case "after_gate":
      return Boolean(ctx.flags[`${trigger.gateId}_done`] ?? ctx.flags[trigger.gateId]);
    case "manual":
      return false;
  }
}
