/**
 * s1_spell_233 — Era Shift
 *
 * Rare spell · Antiquarian faction · 4 cost
 *
 * Oracle text:
 *   "Deal 3 damage to an enemy unit and stun it for 1 turn.
 *    The Antiquarian shifts the target through temporal turbulence —
 *    they arrive battered and disoriented."
 *
 * Combined damage + stun removal. Chunks a target and prevents it from
 * acting next turn. The Antiquarian's temporal manipulation at its most
 * aggressive — displacing enemies through hostile eras.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_233" as CardDefinition["id"],
  name: "Era Shift",
  faction: "antiquarian",
  cardType: "spell",
  rarity: "rare",
  cost: 4,
  keywords: [],
  abilities: [
    {
      id: "es_dmg_stun" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "player",
        },
        do: {
          op: "sequence",
          steps: [
            {
              op: "deal_damage",
              amount: { kind: "const", value: 3 },
              to: { kind: "it" },
            },
            {
              op: "stun",
              duration: { kind: "n_turns", n: 1 },
              to: { kind: "it" },
            },
          ],
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_233.webp"),
  flavorText:
    "One moment you stand in the present. The next, you are buried in an age that forgot your name.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
