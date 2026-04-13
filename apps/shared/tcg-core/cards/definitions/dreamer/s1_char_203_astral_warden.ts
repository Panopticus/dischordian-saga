/**
 * s1_char_203 — Astral Warden
 *
 * Uncommon unit · Dreamer faction · 5 cost · 4/6
 * Keywords: forcefield
 *
 * Oracle text:
 *   "Forcefield. On deploy, draw 1 card. The Astral Warden exists
 *    between planes — armored by unreality, bearing gifts from
 *    the dream."
 *
 * Midrange value unit. Comes in with forcefield for survivability and
 * replaces itself with a card draw on deploy. Solid two-for-one that
 * stabilizes the Dreamer's board while maintaining hand size.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_203" as CardDefinition["id"],
  name: "Astral Warden",
  faction: "dreamer",
  cardType: "unit",
  rarity: "uncommon",
  cost: 5,
  baseStats: { power: 4, health: 6 },
  keywords: ["forcefield"],
  abilities: [
    {
      id: "aw_deploy_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: "/art/cards/s1_char_203.webp",
  flavorText:
    "She stepped out of the dream carrying a shield of starlight and a secret meant only for you.",
  rulesVersion: "1.0.0",
};
