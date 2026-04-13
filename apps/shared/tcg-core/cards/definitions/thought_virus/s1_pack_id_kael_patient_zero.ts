/**
 * s1_pack_id_kael_patient_zero — Kael, Patient Zero
 *
 * Epic unit · Thought Virus faction · 5 cost · 4/5
 * Keywords: deathwatch
 *
 * Oracle text:
 *   "Deathwatch: whenever any unit dies, deal 1 damage to the enemy general.
 *    The infection spreads through grief. Every death feeds the signal."
 *
 * Lore: Mid-infection Kael is caught between who he was and what the
 * Thought Virus is turning him into. Patient Zero retains enough
 * awareness to weaponize death itself — each fallen unit, friend or
 * foe, sends a pulse of corrupted signal that strikes the enemy
 * general. He is the vector, and grief is the transmission medium.
 *
 * Identity variant: Kael arc (2/3) — thought_virus phase, mid-infection.
 *
 * Balance: 5 cost · 4/5 = 9 stats. Budget = 5*2+1 = 11. Deathwatch
 * keyword ~1 stat, deal 1 to general on any death ~1 stat. 11 - 2 = 9.
 * On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_id_kael_patient_zero" as CardDefinition["id"],
  name: "Kael, Patient Zero",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 4, health: 5 },
  keywords: ["deathwatch"],
  abilities: [
    {
      id: "kpz_deathwatch_ping" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_any_unit_dies" },
      effect: {
        op: "deal_damage",
        amount: { kind: "const", value: 1 },
        to: { kind: "enemy_general" },
      },
    },
  ],
  art: "/art/cards/s1_pack_id_kael_patient_zero.webp",
  flavorText:
    "The infection spreads through grief. Every death feeds the signal.",
  rulesVersion: "1.0.0",
};
