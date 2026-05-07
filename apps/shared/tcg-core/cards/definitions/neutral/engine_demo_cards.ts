/**
 * Engine demo cards — Phase H1.
 *
 * Four neutral cards that exercise engine surface area the audit
 * flagged as "// reserved — no card uses." Each card is faction-
 * neutral so it can land in any deck and serve as both a playable
 * card AND a runtime regression suite for the underlying mechanic.
 *
 * Mechanics covered:
 *   - dispel op   → s1_neutral_dispel_001  (Cut the Threads)
 *   - push op     → s1_neutral_push_001    (Tidewall)
 *   - if op       → s1_neutral_if_001      (Witness Whose Time Has Come)
 *   - structure kw → s1_neutral_struct_001 (The Anchor of Kael)
 *
 * Each card's engine handler is fully implemented in shipping engine
 * code (engine/effectInterpreter.ts for ops, engine/movement.ts +
 * engine/combat.ts for structure). The audit's "reserved" annotation
 * was lifted in Phase H8 once these cards landed and the runtime tests
 * proved out.
 *
 * Per CLAUDE.md `trial_categories` rule, the array is sorted in the
 * canonical order: confession < defensive < evidence < narrative <
 * offensive < reactive.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";

/** s1_neutral_dispel_001 — Cut the Threads
 *
 *  2-cost spell. Choose a target unit; strip its ongoing buffs and
 *  granted keywords. The Antiquarian's namesake when the timeline is
 *  unraveled at the wrong place. */
const cut_the_threads: CardDefinition = {
  id: "s1_neutral_dispel_001" as CardDefinition["id"],
  name: "Cut the Threads",
  faction: "neutral",
  cardType: "spell",
  rarity: "common",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "ctt_dispel" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "any" },
          chooser: "player",
        },
        do: {
          op: "dispel",
          to: { kind: "previous_target" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_neutral_dispel_001.webp"),
  flavorText:
    "Some weaves only hold while no one is looking. Look carefully — and pull.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "reactive"] as const,
  verdict_delta: 0,
};

/** s1_neutral_push_001 — Tidewall
 *
 *  1-cost spell. Choose an enemy unit; push it 2 tiles away from the
 *  Tidewall caster's general. Cheap board-shape control for openings. */
const tidewall: CardDefinition = {
  id: "s1_neutral_push_001" as CardDefinition["id"],
  name: "Tidewall",
  faction: "neutral",
  cardType: "spell",
  rarity: "common",
  cost: 1,
  keywords: [],
  abilities: [
    {
      id: "tw_push" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "player",
        },
        do: {
          op: "push",
          target: { kind: "previous_target" },
          direction: { kind: "away_from_source" },
          distance: 2,
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_neutral_push_001.webp"),
  flavorText:
    "The wall arrives a heartbeat before the wave. The wave is the wall.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "offensive"] as const,
  verdict_delta: 0,
};

/** s1_neutral_if_001 — Witness Whose Time Has Come
 *
 *  3-cost 2/3 unit. On deploy, IF the controller has dealt 4+ damage
 *  this match (counter `damage_dealt_match`), this unit deploys with
 *  +2/+2 (becoming 4/5). Otherwise it deploys with default stats.
 *
 *  Demonstrates the conditional `op: "if"` branch — the engine reads
 *  the counter, branches, and applies one of two effect trees. */
const witness_whose_time_has_come: CardDefinition = {
  id: "s1_neutral_if_001" as CardDefinition["id"],
  name: "Witness Whose Time Has Come",
  faction: "neutral",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 2, health: 3 },
  keywords: [],
  abilities: [
    {
      id: "wwth_conditional_buff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "if",
        cond: {
          kind: "counter_gte",
          counter: "damage_dealt_match",
          value: 4,
        },
        then: {
          op: "buff",
          stats: { power: 2, health: 2 },
          duration: { kind: "permanent" },
          to: { kind: "self" },
        },
        // No `else` branch — non-witnesses deploy as a vanilla 2/3.
      },
    },
  ],
  art: assetUrl("art/cards/s1_neutral_if_001.webp"),
  flavorText:
    "If the courtroom is loud, she will speak. If the courtroom is quiet, she will listen.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative", "reactive"] as const,
  verdict_delta: 1,
  balanceException: {
    reason: "Ability-driven design: raw stats traded for build-around effect text; the curve over-predicts stats for cards whose power lives in their abilities. UNDER curve by 29%.",
    reviewer: "2026-05-stat-curve-recalibration",
  },
};

/** s1_neutral_zeal_001 — Honor Guard
 *
 *  3-cost 2/3 unit with `zeal`. While adjacent to its general the
 *  unit attacks for +1 (effective 3 power). The bonus is computed
 *  fresh every swing in engine/combat.ts via `effectivePower`, so
 *  moving the general into adjacency mid-turn flips the bonus on
 *  immediately. */
const honor_guard: CardDefinition = {
  id: "s1_neutral_zeal_001" as CardDefinition["id"],
  name: "Honor Guard",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 2, health: 3 },
  keywords: ["zeal"],
  abilities: [],
  art: assetUrl("art/cards/s1_neutral_zeal_001.webp"),
  flavorText:
    "He stands within arm's reach of the one he chose. The bond is the weapon.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "offensive"] as const,
  verdict_delta: 0,
  balanceException: {
    reason: "Ability-driven design: raw stats traded for build-around effect text; the curve over-predicts stats for cards whose power lives in their abilities. UNDER curve by 29%.",
    reviewer: "2026-05-stat-curve-recalibration",
  },
};

/** s1_neutral_pack_001 — Wolfpack Initiate
 *
 *  2-cost 1/2 unit with the `pack` keyword. Gains +1 power per other
 *  copy of the same defId on its own side of the board (i.e. another
 *  Wolfpack Initiate boosts every member). Read fresh per combat in
 *  engine/combat.ts via `packBonus`, so deaths and deploys flip the
 *  bonus immediately. */
const wolfpack_initiate: CardDefinition = {
  id: "s1_neutral_pack_001" as CardDefinition["id"],
  name: "Wolfpack Initiate",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 1, health: 2 },
  keywords: ["pack"],
  abilities: [],
  art: assetUrl("art/cards/s1_neutral_pack_001.webp"),
  flavorText:
    "Alone she is a yelp. In two she is a song. In four she is the dawn.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 0,
  balanceException: {
    reason: "Ability-driven design: raw stats traded for build-around effect text; the curve over-predicts stats for cards whose power lives in their abilities. UNDER curve by 40%.",
    reviewer: "2026-05-stat-curve-recalibration",
  },
};

/** s1_neutral_resurrect_001 — Phoenix Cadre
 *
 *  4-cost 4/4 unit with `resurrect`. Returns once at full health on
 *  the next state-based-action pass after dying. `card.counters.
 *  has_resurrected` flips to 1 on the rebirth so the second death
 *  is permanent. on_death triggers from the FIRST death are
 *  suppressed because the unit didn't actually leave the board.
 *  Engine handler: engine/stateBasedActions.ts (Pass 1a). */
const phoenix_cadre: CardDefinition = {
  id: "s1_neutral_resurrect_001" as CardDefinition["id"],
  name: "Phoenix Cadre",
  faction: "neutral",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 4 },
  keywords: ["resurrect"],
  abilities: [],
  art: assetUrl("art/cards/s1_neutral_resurrect_001.webp"),
  flavorText:
    "Killed once, the Cadre learns to die. Killed twice, the Cadre learns to stay.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "reactive"] as const,
  verdict_delta: 0,
};

/** s1_neutral_oncardplayed_001 — The Reading Room
 *
 *  3-cost 2/3 unit. on_card_played(spell): controller draws 1 card.
 *  Engine handler in playCard.ts after the card_played event. */
const the_reading_room: CardDefinition = {
  id: "s1_neutral_oncardplayed_001" as CardDefinition["id"],
  name: "The Reading Room",
  faction: "neutral",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 2, health: 3 },
  keywords: [],
  abilities: [
    {
      id: "trr_draw_on_spell" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_card_played", filter: { cardType: "spell" } },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: assetUrl("art/cards/s1_neutral_oncardplayed_001.webp"),
  flavorText:
    "Every spell cast in the room is a page added to the next book.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative", "reactive"] as const,
  verdict_delta: 1,
  balanceException: {
    reason: "Ability-driven design: raw stats traded for build-around effect text; the curve over-predicts stats for cards whose power lives in their abilities. UNDER curve by 29%.",
    reviewer: "2026-05-stat-curve-recalibration",
  },
};

/** s1_neutral_onmove_001 — The Watchtower's Eye
 *
 *  2-cost 2/2 unit. on_move: deal 1 damage to friendly_general's row
 *  enemy. Demonstrates the on_move trigger which fires after every
 *  successful move. (Damage target uses friendly_general as a stable
 *  TargetRef the existing engine resolves.) */
const watchtowers_eye: CardDefinition = {
  id: "s1_neutral_onmove_001" as CardDefinition["id"],
  name: "The Watchtower's Eye",
  faction: "neutral",
  cardType: "unit",
  rarity: "uncommon",
  cost: 2,
  baseStats: { power: 2, health: 2 },
  keywords: [],
  abilities: [
    {
      id: "twe_ping_on_move" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_move" },
      effect: {
        op: "deal_damage",
        amount: { kind: "const", value: 1 },
        to: { kind: "enemy_general" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_neutral_onmove_001.webp"),
  flavorText:
    "Every step the watcher takes, the watched flinches. Every flinch counts.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive", "reactive"] as const,
  verdict_delta: 0,
};

/** s1_neutral_summonednear_001 — The Hospitality Officer
 *
 *  3-cost 2/4 unit. on_summoned_near_me(radius 2): grant +1/+1 to
 *  self for every friendly summon within 2 tiles. Engine handler in
 *  deploy.ts after on_deploy enqueue. */
const the_hospitality_officer: CardDefinition = {
  id: "s1_neutral_summonednear_001" as CardDefinition["id"],
  name: "The Hospitality Officer",
  faction: "neutral",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 2, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "tho_buff_on_summon" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_summoned_near_me", radius: 2 },
      effect: {
        op: "buff",
        stats: { power: 1, health: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_neutral_summonednear_001.webp"),
  flavorText:
    "She arrives at every guest's first step into the room. She makes the room feel chosen.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative", "reactive"] as const,
  verdict_delta: 1,
};

/** s1_neutral_struct_001 — The Anchor of Kael
 *
 *  4-cost 4/8 unit with the `structure` keyword. Cannot move or
 *  attack. Pure board presence — a wall of HP that taunts enemy
 *  attention through sheer mass. Engine enforces the immobility +
 *  no-attack rule via engine/movement.ts:54 and engine/combat.ts:96. */
const the_anchor_of_kael: CardDefinition = {
  id: "s1_neutral_struct_001" as CardDefinition["id"],
  name: "The Anchor of Kael",
  faction: "neutral",
  cardType: "unit",
  rarity: "uncommon",
  cost: 4,
  baseStats: { power: 4, health: 8 },
  keywords: ["structure"],
  abilities: [],
  art: assetUrl("art/cards/s1_neutral_struct_001.webp"),
  flavorText:
    "Set down where Kael walked away. The Anchor remembers. The Anchor does not move.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "evidence"] as const,
  verdict_delta: 0,
  balanceException: {
    reason: "Aggressive low-cost utility: stats traded down OR up against the curve to reach a specific play pattern (rush threat, sticky blocker, etc.). OVER curve by 33%.",
    reviewer: "2026-05-stat-curve-recalibration",
  },
};

export const ENGINE_DEMO_CARDS: readonly CardDefinition[] = [
  cut_the_threads,
  tidewall,
  witness_whose_time_has_come,
  honor_guard,
  wolfpack_initiate,
  phoenix_cadre,
  the_reading_room,
  watchtowers_eye,
  the_hospitality_officer,
  the_anchor_of_kael,
];
