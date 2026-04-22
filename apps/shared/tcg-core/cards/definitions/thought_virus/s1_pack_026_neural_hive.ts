/**
 * s1_pack_026 — Neural Hive
 *
 * Common unit · Thought Virus faction · 3 cost · 2/4
 *
 * Oracle text:
 *   "On death, summon two 1/1 Spore tokens. The hive mind does not
 *    die — it divides."
 *
 * Sticky value body. The 2/4 statline trades decently, and on death
 * it splits into two 1/1 tokens, maintaining board presence. Excellent
 * synergy with deathwatch effects and sacrifice strategies. The Virus
 * always leaves something behind.
 *
 * Mechanical model:
 *  - On death, summon two tok_spore_1_1 tokens at random empty tiles.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_026" as CardDefinition["id"],
  name: "Neural Hive",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 2, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "nh_death_spawn" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_death" },
      effect: {
        op: "repeat",
        times: { kind: "const", value: 2 },
        do: {
          op: "summon",
          tokenId: "tok_spore_1_1",
          at: { kind: "random_empty" },
          controller: "self",
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_026.webp"),
  flavorText:
    "Kill it. Please. But understand: every wound you inflict is a seed.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "reactive"] as const,
  verdict_delta: 1,
};
