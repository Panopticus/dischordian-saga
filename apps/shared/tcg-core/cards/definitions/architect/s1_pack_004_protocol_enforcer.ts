/**
 * s1_pack_004 — Protocol Enforcer
 *
 * Common unit · Architect faction · 2 cost · 2/3
 * Keywords: provoke
 *
 * Oracle text:
 *   "Provoke. Enemies must attack this unit. The protocol is
 *    non-negotiable."
 *
 * Clean common provoke body. A 2-cost 2/3 with provoke is a strong
 * early-game defensive tool that forces opponents to deal with it
 * before attacking other targets. Vanilla but effective.
 *
 * Mechanical model:
 *  - Provoke: intrinsic keyword. Adjacent enemies must target this
 *    unit before attacking others. No additional abilities.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_004" as CardDefinition["id"],
  name: "Protocol Enforcer",
  faction: "architect",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: ["provoke"],
  abilities: [],
  art: "/art/cards/s1_pack_004.webp",
  flavorText:
    "It does not ask you to comply. It has already decided that you will.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
