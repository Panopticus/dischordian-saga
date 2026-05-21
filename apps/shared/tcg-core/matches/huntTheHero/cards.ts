/* ═══════════════════════════════════════════════════════
   HUNT-THE-HERO — card definitions

   Two small decks, ten cards each, that capture the
   minigame's argument:

     PLAYER (defenders of the League heroes):
       warn       — +2 max HP and shield on a target hero;
                    represents getting word out to them in
                    advance of the Wolf's hunt.
       shield     — one-shot defensive buff on a target hero;
                    blocks the next hunt aimed at them.
       evacuate   — remove a hero from the board (counts as
                    saved); only useable on a hero ≥ 50% HP.
       confront   — deal 2 damage to every hero's pending
                    Wolf-action chance (interrupts the Wolf's
                    next hunt globally, but does not target).

     WOLF (Lycos's predator instincts):
       hunt       — deal 3 damage to a target hero. If the
                    hero is shielded, the shield is consumed
                    and the hunt deals 0; otherwise hp -= 3.
       restraint  — Lycos holds back this turn; gains +morale
                    (cosmetic), draws an extra card.
       mercy      — choose a hero; that hero is spared
                    (resolution = "spared"). Sets
                    mercyPlayed: true on the state. The
                    `mercy_extended` outcome requires this.
       memory_of_the_medic — auto-mercy targeting the
                    field_medic; consumed first if drawn.

   Cards are pure data — the reducer interprets them.
   ═══════════════════════════════════════════════════════ */

import type { PlayerCardId, WolfCardId } from "./state";

export interface PlayerCardDef {
  id: PlayerCardId;
  name: string;
  description: string;
  /** True if the card requires a target hero on play. */
  targeted: boolean;
}

export interface WolfCardDef {
  id: WolfCardId;
  name: string;
  description: string;
  targeted: boolean;
}

export const PLAYER_CARD_DEFS: Readonly<Record<PlayerCardId, PlayerCardDef>> = {
  warn: {
    id: "warn",
    name: "Warn",
    description:
      "Reach the hero in advance of the Hall. +2 max HP, +shield. Targeted.",
    targeted: true,
  },
  shield: {
    id: "shield",
    name: "Shield",
    description:
      "Brace the hero against the next hunt. The shield absorbs the next damage instance entirely. Targeted.",
    targeted: true,
  },
  evacuate: {
    id: "evacuate",
    name: "Evacuate",
    description:
      "Pull the hero from the Hall before the Wolf reaches them. Saved. Requires hero at ≥ 50% HP. Targeted.",
    targeted: true,
  },
  confront: {
    id: "confront",
    name: "Confront",
    description:
      "Force Lycos to look at his own ethic. His next hunt is interrupted (deals 0). Untargeted.",
    targeted: false,
  },
};

export const WOLF_CARD_DEFS: Readonly<Record<WolfCardId, WolfCardDef>> = {
  hunt: {
    id: "hunt",
    name: "Hunt",
    description:
      "Deal 3 damage to a hero. Shield is consumed instead if present.",
    targeted: true,
  },
  restraint: {
    id: "restraint",
    name: "Restraint",
    description:
      "Hold the hunt this turn. Draw one card. Cosmetic +morale.",
    targeted: false,
  },
  mercy: {
    id: "mercy",
    name: "Mercy",
    description:
      "Spare a hero. They are saved; the chronicle marks the gesture. Targeted.",
    targeted: true,
  },
  memory_of_the_medic: {
    id: "memory_of_the_medic",
    name: "Memory of the Medic",
    description:
      "The field medic to whom Lycos extended mercy returns to memory. Auto-mercy targeting the field_medic. Cannot target other heroes.",
    targeted: false,
  },
};

/** Canonical starting deck composition for the player side (10
 *  cards). Conservative bias toward defensive plays. */
export const PLAYER_STARTING_DECK: ReadonlyArray<PlayerCardId> = [
  "warn",
  "warn",
  "warn",
  "shield",
  "shield",
  "shield",
  "evacuate",
  "evacuate",
  "confront",
  "confront",
];

/** Canonical starting deck composition for the Wolf side (10
 *  cards). The hunt-restraint ratio is tuned so a passive Wolf
 *  produces the `mercy_extended` ending if and only if the
 *  player keeps every hero alive long enough for a mercy draw. */
export const WOLF_STARTING_DECK: ReadonlyArray<WolfCardId> = [
  "hunt",
  "hunt",
  "hunt",
  "hunt",
  "restraint",
  "restraint",
  "mercy",
  "mercy",
  "memory_of_the_medic",
  "restraint",
];
