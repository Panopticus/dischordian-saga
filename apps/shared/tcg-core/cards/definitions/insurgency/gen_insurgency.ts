/**
 * gen_insurgency — Agent Zero
 *
 * General · Insurgency faction · 0 cost · 2/25
 *
 * "I've been looking for you for eleven years. Forgive the emotion."
 *
 * Dead yet broadcasting — her signal persists encrypted in Armory combat
 * systems. The first rebel, the one who hacked the scheduling matrix,
 * whose dog tags match The Engineer's biometrics. She built the
 * Insurgency's backbone before Kael's fall. Every broken rule is a
 * small victory.
 *
 * Bloodborn Spell: DEAD SIGNAL
 * Give a friendly unit +2 attack this turn. The signal doesn't die —
 * it amplifies through every insurgent who receives it. Guerrilla
 * tactics: hit hard, hit fast, disappear.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "gen_insurgency" as CardDefinition["id"],
  name: "Agent Zero",
  faction: "insurgency",
  cardType: "general",
  rarity: "basic",
  cost: 0,
  baseStats: { power: 2, health: 25 },
  keywords: [],
  abilities: [
    {
      id: "ins_bbs_dead_signal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "activated", cost: { kind: "once_per_match", manaCost: 1 } },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "player",
        },
        do: {
          op: "buff",
          stats: { power: 2 },
          duration: { kind: "this_turn" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/gen_insurgency.webp",
  flavorText:
    "Cameras cycle every 43 seconds. I have 31. The Collector wiped your memory. But not your instincts.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
