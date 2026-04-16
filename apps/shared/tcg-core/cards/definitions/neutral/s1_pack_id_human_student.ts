/**
 * s1_pack_id_human_student — The Student
 *
 * Common unit · Neutral faction · 2 cost · 2/3
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, draw 1.
 *    Before the Academy, before the conspiracy, there was only curiosity."
 *
 * Lore: The Human's journey begins here — a student at Mechronis
 * Academy, naive and hungry for knowledge. The card draw represents
 * the insatiable curiosity that would eventually lead them to uncover
 * the Architect's conspiracy. At this stage, the Human is nobody
 * special — just another student asking dangerous questions.
 *
 * Identity variant: Human arc (1/3) — neutral phase, before Mechronis Academy.
 *
 * Balance: 2 cost · 2/3 = 5 stats. Budget = 2*2+1 = 5. Draw 1 on
 * deploy ~1 stat. 5 - 1 = 4. At 5 stats, slightly generous but
 * common rarity offsets. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_id_human_student" as CardDefinition["id"],
  name: "The Student",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: [],
  abilities: [
    {
      id: "hs_deploy_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: "/art/cards/s1_pack_id_human_student.webp",
  flavorText:
    "Before the Academy, before the conspiracy, there was only curiosity.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
};
