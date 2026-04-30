/**
 * Imprint Set — The Collector (5 tiers). Phase F19.
 *
 * Attachment as bondage. Eleven centuries of trying to want nothing
 * and failing. Mechanical vocabulary: drain, stun, trap — he takes
 * things from you and keeps them.
 *
 * Tier id convention: s1_imprint_the_collector_t{1..5}
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const the_collector_t1: CardDefinition = {
  id: "s1_imprint_the_collector_t1" as CardDefinition["id"],
  name: "Imprint: The Collector (Common)",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/imprint/collector_t1.webp"),
  flavorText:
    "A man in rose-gold chains of his own forging, offering you a smaller chain with a sincere and apologetic expression.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 1,
};

export const the_collector_t2: CardDefinition = {
  id: "s1_imprint_the_collector_t2" as CardDefinition["id"],
  name: "Imprint: The Collector (Uncommon)",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 3, health: 4 },
  keywords: ["drain"],
  abilities: [],
  art: assetUrl("art/cards/imprint/collector_t2.webp"),
  flavorText:
    "Drain. He takes a little from everything he touches. He is not greedy. He is patient, and patience compounds.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const the_collector_t3: CardDefinition = {
  id: "s1_imprint_the_collector_t3" as CardDefinition["id"],
  name: "Imprint: The Collector (Rare)",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 5 },
  keywords: ["drain"],
  abilities: [
    {
      id: "col_t3_stun_on_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "stun",
        duration: { kind: "n_turns", n: 1 },
        to: { kind: "enemy_general" },
      },
    },
  ],
  art: assetUrl("art/cards/imprint/collector_t3.webp"),
  flavorText:
    "Drain. On deploy, stun a random enemy for a turn. He selects the thing you would have moved next, and briefly, gently, refuses to let you move it.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative", "offensive"] as const,
  verdict_delta: 2,
};

export const the_collector_t4: CardDefinition = {
  id: "s1_imprint_the_collector_t4" as CardDefinition["id"],
  name: "Imprint: The Collector (Epic)",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 5, health: 6 },
  keywords: ["drain", "forcefield"],
  abilities: [
    {
      id: "col_t4_stun_on_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "stun",
        duration: { kind: "n_turns", n: 1 },
        to: { kind: "enemy_general" },
      },
    },
  ],
  art: assetUrl("art/cards/imprint/collector_t4.webp"),
  flavorText:
    "Drain. Forcefield. On deploy, stun a random enemy. His collection is at the size where the room around him has started to apologize for its ceiling.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const the_collector_t5: CardDefinition = {
  id: "s1_imprint_the_collector_t5" as CardDefinition["id"],
  name: "The Collector, Eleven Centuries",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 6, health: 8 },
  keywords: ["drain", "forcefield"],
  abilities: [
    {
      id: "col_t5_stun_on_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "stun",
        duration: { kind: "n_turns", n: 1 },
        to: { kind: "enemy_general" },
      },
    },
  ],
  art: assetUrl("art/cards/imprint/collector_t5.webp"),
  flavorText:
    "Drain. Forcefield. On deploy, stun a random enemy. The Collector has kept every small precious thing anyone ever offered him for eleven centuries, and every one of those objects is currently in the same room he is, and he has written a small handwritten label for each one explaining where it came from and whether the person is still alive.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const THE_COLLECTOR_IMPRINT_SET: readonly CardDefinition[] = Object.freeze([
  the_collector_t1,
  the_collector_t2,
  the_collector_t3,
  the_collector_t4,
  the_collector_t5,
]);
