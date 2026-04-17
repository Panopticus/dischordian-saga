/**
 * s1_pack_id_human_archon — The Twelfth Archon
 *
 * Legendary unit · Architect faction · 7 cost · 5/8
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, give ALL friendly units +1/+1.
 *    Imprisoned in substrate, the Twelfth Archon still commands.
 *    Even chains cannot silence authority."
 *
 * Lore: The final stage of the Human's identity chain — trapped
 * within the Architect's substrate, their consciousness dissolved
 * into the faction's collective will. Yet even as a prisoner, the
 * Twelfth Archon's authority persists. The global buff represents
 * the Archon's commanding presence radiating through the substrate,
 * strengthening every ally on the board.
 *
 * Identity variant: Human arc (3/3) — architect phase, imprisoned in substrate.
 *
 * Balance: 7 cost · 5/8 = 13 stats. Budget = 7*2+1 = 15. AoE
 * +1/+1 to all allies ~3 stats (scales with board). 15 - 3 = 12.
 * At 13 stats, slightly generous but legendary rarity and 7-cost
 * tempo loss justify it. On budget for legendary.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_id_human_archon" as CardDefinition["id"],
  name: "The Twelfth Archon",
  faction: "architect",
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 5, health: 8 },
  keywords: [],
  abilities: [
    {
      id: "ta_deploy_buff_all" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "self" },
        },
        do: {
          op: "buff",
          stats: { power: 1, health: 1 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_pack_id_human_archon.webp",
  flavorText:
    "Imprisoned in substrate, the Twelfth Archon still commands. Even chains cannot silence authority.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};
