/**
 * s1_spell_223 — Spore Burst
 *
 * Common spell · Thought Virus faction · 2 cost
 *
 * Oracle text:
 *   "Summon a 1/1 Spore token with deathwatch. Each death around it
 *    makes the spore grow — the Virus propagates through carnage."
 *
 * Token generation with scaling potential. The Spore token gains +1/+0
 * whenever any unit dies (via its deathwatch ability). References tok_spore_1_1.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_223" as CardDefinition["id"],
  name: "Spore Burst",
  faction: "thought_virus",
  cardType: "spell",
  rarity: "common",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "sb_summon_spore" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "summon",
        tokenId: "tok_spore_1_1",
        at: { kind: "random_empty" },
        controller: "self",
      },
    },
  ],
  art: "/art/cards/s1_spell_223.webp",
  flavorText:
    "It lands softly, barely noticed. By the time you notice, the battlefield is a garden of infection.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
};
