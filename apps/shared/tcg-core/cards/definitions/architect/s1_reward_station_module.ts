/**
 * s1_reward_station_module — Module Integration
 *
 * Rare spell · Architect faction · 3 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Give a friendly unit +2/+2 permanently.
 *    Each module is a gear in the machine. Together, they are unstoppable."
 *
 * Lore: Installing ten modules into a space station teaches the value
 * of incremental improvement — each component strengthening the whole.
 * Module Integration translates that principle into a targeted permanent
 * buff, upgrading a single friendly unit with hardened station tech.
 *
 * Reward: Install 10 modules in the Space Station.
 *
 * Balance: 3 cost spell. Permanent +2/+2 to a friendly unit is worth
 * ~3 mana. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_station_module" as CardDefinition["id"],
  name: "Module Integration",
  faction: "architect",
  cardType: "spell",
  rarity: "rare",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "mi_perm_buff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "player",
        },
        do: {
          op: "buff",
          stats: { power: 2, health: 2 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_reward_station_module.webp",
  flavorText:
    "Ten modules. Ten upgrades. The unit that walked in was adequate. The one that walked out was exceptional.",
  rulesVersion: "1.0.0",
};
