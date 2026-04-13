/**
 * s1_pack_pet_void_crawler_3 — Void Leviathan
 *
 * Epic unit · Thought Virus faction · 6 cost · 5/6
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, deal 2 damage to all enemy units.
 *    It crawled out of nothing and brought nothing with it —
 *    nothing that erases everything it touches."
 *
 * Lore: The Void Leviathan is the final evolution of the Void
 * Crawler line — an abyssal horror that displaces reality upon
 * arrival. Its board-wide damage represents a shockwave of
 * anti-existence that tears through every enemy on the field. The
 * Thought Virus faction's ultimate expression of annihilation
 * through mere presence.
 *
 * Pet Evolution: Void Crawler stage 3 of 3.
 * Collect all 3 stages to unlock the Void Crawler card back.
 *
 * Balance: 6 cost · 5/6 = 11 stats. Budget = 6*2+1 = 13. Deal 2
 * to all enemies on deploy ~2-3 stats (board-dependent). 13 - 2.5
 * = 10.5. At 11 stats, slightly over but epic pack-exclusive
 * capstone. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_pet_void_crawler_3" as CardDefinition["id"],
  name: "Void Leviathan",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "epic",
  cost: 6,
  baseStats: { power: 5, health: 6 },
  keywords: [],
  abilities: [
    {
      id: "vl_deploy_aoe" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "opponent" },
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 2 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_pack_pet_void_crawler_3.webp",
  flavorText:
    "It crawled out of nothing and brought nothing with it — nothing that erases everything it touches.",
  rulesVersion: "1.0.0",
};
