/**
 * s1_pack_seed_governance — Antiquarian's Referendum
 *
 * Rare spell · Antiquarian faction · 3 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Draw 2 and heal your general for 2.
 *    The vote is called. The Archive opens. Democracy remembers what
 *    tyrants forget."
 *
 * Lore: The Antiquarian faction preserves knowledge and governs
 * through collective memory. This referendum spell channels the
 * faction's democratic traditions into raw card advantage and
 * restoration — the wisdom of the collective heals and informs.
 *
 * Cross-game seed: Collecting this card unlocks a new governance
 * vote topic in the political system.
 *
 * Balance: 3 cost spell. Draw 2 ~2 mana, heal general 2 ~1 mana.
 * Total ~3 mana value. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_seed_governance" as CardDefinition["id"],
  name: "Antiquarian's Referendum",
  faction: "antiquarian",
  cardType: "spell",
  rarity: "rare",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "ar_draw_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "draw",
            amount: { kind: "const", value: 2 },
            who: "self",
          },
          {
            op: "heal",
            amount: { kind: "const", value: 2 },
            to: { kind: "friendly_general" },
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_seed_governance.webp"),
  flavorText:
    "The vote is called. The Archive opens. Democracy remembers what tyrants forget.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "evidence"] as const,
  verdict_delta: 1,
};
