/**
 * s1_reward_discovery_all — Complete Archive
 *
 * Legendary spell · Antiquarian faction · 4 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Draw 3. The complete record of everything that was, is, and will be."
 *
 * Lore: Discovering every loredex entry is the ultimate act of
 * Antiquarian devotion — assembling the complete archive of the
 * Saga's history, from the founding of New Babylon to the Thought
 * Virus outbreak. The Complete Archive spell channels that exhaustive
 * knowledge into pure card advantage: three draws representing the
 * past, present, and future branches of the timeline.
 *
 * Reward: Discover all loredex entries.
 *
 * Balance: 4 cost spell. Draw 3 at 4 mana is premium card advantage,
 * roughly on par with similar effects in other TCGs. Legendary rarity
 * gates access. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_discovery_all" as CardDefinition["id"],
  name: "Complete Archive",
  faction: "antiquarian",
  cardType: "spell",
  rarity: "legendary",
  cost: 4,
  keywords: [],
  abilities: [
    {
      id: "ca_draw_3" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 3 },
        who: "self",
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_discovery_all.webp"),
  flavorText:
    "The complete record of everything that was, is, and will be. It fits in one spell. Barely.",
  rulesVersion: "1.1.0",
  trial_categories: ["evidence", "narrative"] as const,
  verdict_delta: 2,
};
