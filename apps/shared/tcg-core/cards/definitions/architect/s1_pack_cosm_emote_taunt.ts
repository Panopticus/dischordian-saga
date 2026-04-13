/**
 * s1_pack_cosm_emote_taunt — Architect's Mockery
 *
 * Rare unit · Architect faction · 2 cost · 3/2
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, deal 1 damage to a random enemy.
 *    The Architect does not fight. The Architect laughs."
 *
 * Lore: The Architect faction views lesser beings with amused
 * contempt. This unit embodies that mockery — a small, aggressive
 * construct that announces its arrival by striking a random enemy,
 * as if the Architect is flicking a piece off a game board. The
 * insult is the point.
 *
 * Cosmetic unlock: Collecting this card unlocks the Architect's
 * Laugh emote.
 *
 * Balance: 2 cost · 3/2 = 5 stats. Budget = 2*2+1 = 5. Deal 1 to
 * random enemy on deploy ~0.5 stat. 5 - 0.5 = 4.5. At 5 stats,
 * slightly generous but the random targeting adds variance.
 * On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_cosm_emote_taunt" as CardDefinition["id"],
  name: "Architect's Mockery",
  faction: "architect",
  cardType: "unit",
  rarity: "rare",
  cost: 2,
  baseStats: { power: 3, health: 2 },
  keywords: [],
  abilities: [
    {
      id: "am_deploy_ping_random" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "random",
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_pack_cosm_emote_taunt.webp",
  flavorText:
    "The Architect does not fight. The Architect laughs.",
  rulesVersion: "1.0.0",
};
