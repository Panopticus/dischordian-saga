/**
 * S2 — Hierarchy of the Damned · Lord-tier · Pale Emissary
 *
 * Third demon-lord of the Hierarchy (apps/shared/hierarchyOfTheDamned.ts,
 * "the Courier of Vortex Standing"). The Pale Emissary brings the pen
 * and waits — never coerces, presents. The contracts are signed in inks
 * the signing party manufactures from their own resolve.
 *
 * Mechanical model: an offer-on-deploy. The opponent draws a card (the
 * pen offered) and the Emissary forces a sacrifice-equivalent — they
 * must discard a card of their choice (the ink that must come from
 * them). The sequence captures the "you have, in some prior small
 * moment, agreed not to refuse" clause. Stat-budget: 8-cost legendary
 * (4/14 = 18 stats; cost-8 curve is 20 ± 30%, range [14, 26], inside).
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "../../../../../client/src/lib/assetUrl";
import { HIERARCHY_FACTION as F } from "./_art";

const RULES = "1.1.0";

export const lord_pale_emissary: CardDefinition = {
  id: "s2_hierarchy_lord_pale_emissary" as CardDefinition["id"],
  name: "The Pale Emissary, Courier of Vortex Standing",
  faction: F,
  cardType: "unit",
  rarity: "legendary",
  cost: 8,
  baseStats: { power: 4, health: 14 },
  keywords: ["forcefield"],
  abilities: [
    // The contract is already on the table — on deploy, present the
    // offer: opponent draws (pen offered), then must discard one of
    // their choice (ink from their resolve).
    {
      id: "pale_emissary_offer_the_pen" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "draw",
            amount: { kind: "const", value: 1 },
            who: "opponent",
          },
          {
            op: "discard",
            amount: { kind: "const", value: 1 },
            from: "opponent",
            mode: "choose",
          },
        ],
      },
    },
    // Notarising the file — when ANY unit dies, the Emissary bows:
    // he heals 2 (the file is sealed, the next petitioner shown in).
    // Whether the unit was yours or theirs, the contract closes the
    // same way — that is the lore beat.
    {
      id: "pale_emissary_notarise_the_file" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_any_unit_dies" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 2 },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/hierarchy/lord_pale_emissary.webp"),
  flavorText:
    "The pen is offered. The pen is empty — the ink will come from you. Whether you sign or refuse, the Emissary bows.",
  rulesVersion: RULES,
  trial_categories: ["confession", "narrative", "reactive"] as const,
  verdict_delta: -2,
};
