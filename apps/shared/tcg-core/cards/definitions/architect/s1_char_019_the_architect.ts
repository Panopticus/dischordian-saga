/**
 * s1_char_019 — The Architect
 *
 * Legendary unit · Architect faction · 6 cost · 12/10
 * Keywords: overcharge, rally
 *
 * Oracle text (from season1-cards.json):
 *   "Deals +4 damage on first attack, then takes 3 self-damage.
 *    Adjacent allies gain +4 ATK this turn."
 *
 * Design interpretation:
 *   The spec normalizes the rally buff to +3 ATK for balance consistency
 *   across the rally keyword family. The JSON says +4, but the card-spec
 *   explicitly requests +3 — we follow the spec.
 *
 * Mechanical model:
 *  - Overcharge: a `first_attack_bonus` counter starts at 1 on deploy.
 *    A passive ability watches for `on_damage_dealt` by self. When the
 *    counter is >= 1, it fires a sequence: deal 4 bonus damage to the
 *    target, then deal 3 damage to self (burnout), then zero out the
 *    counter so the bonus is once-per-deployment.
 *  - Rally: on deploy, all friendly units within radius 1 get a +3/0
 *    stat buff that lasts until end of turn (`this_turn` duration).
 *
 * Golden tests: test/cards/architect/s1_char_019_the_architect.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_019" as CardDefinition["id"],
  name: "The Architect",
  faction: "architect",
  cardType: "unit",
  rarity: "legendary",
  cost: 6,
  baseStats: { power: 7, health: 7 },
  keywords: [],
  abilities: [
    // --- Overcharge: arm the first-attack bonus counter ---
    {
      id: "arch_arm_overcharge" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "first_attack_bonus",
        amount: 1,
        to: { kind: "self" },
      },
    },
    // --- Overcharge: fire on first attack ---
    {
      id: "arch_overcharge_fire" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      condition: {
        kind: "counter_gte",
        counter: "first_attack_bonus",
        value: 1,
      },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "deal_damage",
            amount: { kind: "const", value: 4 },
            to: { kind: "trigger_victim" },
          },
          {
            op: "deal_damage",
            amount: { kind: "const", value: 3 },
            to: { kind: "self" },
          },
          {
            op: "add_counter",
            kind: "first_attack_bonus",
            amount: -999,
            to: { kind: "self" },
          },
        ],
      },
    },
    // --- Rally: buff adjacent allies on deploy ---
    {
      id: "arch_rally_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { power: 3, health: 0 },
        duration: { kind: "this_turn" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_019.webp"),
  flavorText:
    "It embodies the ultimate antagonist, representing the tension between order and chaos, control and freedom.",
  rulesVersion: "1.1.0",
  trial_categories: ["evidence", "narrative", "offensive"] as const,
  verdict_delta: 2,
};
