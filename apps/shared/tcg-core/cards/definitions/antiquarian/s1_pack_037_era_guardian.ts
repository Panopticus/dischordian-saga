/**
 * s1_pack_037 — Era Guardian
 *
 * Common unit · Antiquarian faction · 3 cost · 2/5
 * Keywords: provoke
 *
 * Oracle text:
 *   "Provoke. On deploy, gain +0/+2. The guardian of ages past
 *    cannot be ignored."
 *
 * A common defensive wall. The 2/5 provoke body is already solid, and
 * the deploy +0/+2 buff creates an effective 2/7 — a formidable
 * obstacle for 3 mana. The Antiquarian excels at stalling the game,
 * and Era Guardian is the foundation of that strategy.
 *
 * Mechanical model:
 *  - Provoke: intrinsic keyword. On deploy, buff self +0/+2 permanently.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_037" as CardDefinition["id"],
  name: "Era Guardian",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 2, health: 5 },
  keywords: ["provoke"],
  abilities: [
    {
      id: "eg_deploy_buff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { power: 0, health: 2 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "It has guarded the threshold between ages for so long that time itself detours around it.",
  rulesVersion: "1.0.0",
};
