/**
 * Zod schemas for CardDefinition and the effect-tree.
 *
 * Source of truth for what a valid hand-authored card looks like. The
 * loader (cards/loader.ts) runs every .ts definition file through
 * `cardDefinitionSchema.parse()` at startup. Any typo, missing field, or
 * malformed effect tree fails loudly with the offending card id.
 *
 * Design rules:
 *  - Types in apps/shared/tcg-core/types/*.ts are the source of truth for
 *    IDE types. Zod schemas here validate runtime shape *matching* those
 *    types — we do not infer types from Zod back into TS.
 *  - Every object is `.strict()` so unknown fields are rejected (catches
 *    typos like `powers: 3` when the author meant `power: 3`).
 *  - Recursive schemas use `z.lazy()` because Effect, Condition, and
 *    TargetSelector are all recursive through control-flow ops.
 *  - The schema is stable: adding a new effect op is additive (append to
 *    the discriminated union), not breaking. Renames require a
 *    RULES_VERSION minor bump and a replay-pin, because old replays
 *    reference the old op.
 */
import { z } from "zod";

/* ─── Leaf enums ─── */

/**
 * Single source of truth for the faction list. The Zod schema below
 * derives from this `as const` tuple; `Faction` (in types/Card.ts)
 * derives from the Zod schema. Adding a faction = one edit here.
 *
 * Audit/16.F4 — extracting this also makes a `pluginManifest` for
 * community packs tractable in v1.2.0.
 */
export const FACTIONS = [
  "architect",
  "dreamer",
  "insurgency",
  "new_babylon",
  "antiquarian",
  "thought_virus",
  "panopticon",
  "neutral",
  "hierarchy_of_damned",
] as const;

export const factionSchema = z.enum(FACTIONS);

export const cardTypeSchema = z.enum([
  "general",
  "unit",
  "spell",
  "artifact",
  "structure",
]);

export const raritySchema = z.enum([
  "basic",
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
]);

/**
 * Trial-phase category enum used by §5.8 Authority match.
 * Mirrors the TrialCategory type in ../types/Card.ts.
 * See docs/production/act1/authority-trial-phase-mechanic.md.
 */
export const trialCategorySchema = z.enum([
  "defensive",
  "offensive",
  "narrative",
  "evidence",
  "reactive",
  "confession",
]);

export const keywordSchema = z.enum([
  "rush",
  "ranged",
  "flying",
  "provoke",
  "celerity",
  "blast",
  "frenzy",
  "rebirth",
  "forcefield",
  "airdrop",
  "deathwatch",
  "infiltrate",
  "grow",
  "backstab",
  "zeal",
  "dispel",
  "stun",
  "structure",
  "ephemeral",
  "untargetable",
  "ignore_armor_3",
  "can_attack_this_turn",
  "taunt",
  "drain",
  "pierce",
  "overcharge",
  "fury",
  "pack",
  "rally_buff",
  "resurrect",
]);

/* ─── Filters & small shapes ─── */

export const unitFilterSchema = z
  .object({
    controller: z.enum(["self", "opponent", "any"]).optional(),
    keywords: z
      .object({
        has: z.array(keywordSchema).readonly().optional(),
        lacks: z.array(keywordSchema).readonly().optional(),
      })
      .strict()
      .optional(),
    faction: z.array(factionSchema).readonly().optional(),
    minStats: z
      .object({
        power: z.number().int().optional(),
        health: z.number().int().optional(),
      })
      .strict()
      .optional(),
    maxStats: z
      .object({
        power: z.number().int().optional(),
        health: z.number().int().optional(),
      })
      .strict()
      .optional(),
    except: z.literal("self").optional(),
    idPrefix: z.string().optional(),
  })
  .strict();

export const statDeltaSchema = z
  .object({
    power: z.number().int().optional(),
    health: z.number().int().optional(),
  })
  .strict();

export const durationSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("permanent") }).strict(),
  z.object({ kind: z.literal("this_turn") }).strict(),
  z.object({ kind: z.literal("until_end_of_opponent_turn") }).strict(),
  z.object({ kind: z.literal("n_turns"), n: z.number().int().positive() }).strict(),
]);

export const targetRefSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("self") }).strict(),
  z.object({ kind: z.literal("it") }).strict(),
  z.object({ kind: z.literal("previous_target") }).strict(),
  z.object({ kind: z.literal("trigger_source") }).strict(),
  z.object({ kind: z.literal("trigger_victim") }).strict(),
  z.object({ kind: z.literal("friendly_general") }).strict(),
  z.object({ kind: z.literal("enemy_general") }).strict(),
]);

/* ─── Amount (depends on UnitFilter + TargetRef) ─── */

export const amountSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("const"), value: z.number().int() }).strict(),
  z.object({ kind: z.literal("x_cost") }).strict(),
  z.object({ kind: z.literal("count_of"), filter: unitFilterSchema }).strict(),
  z
    .object({ kind: z.literal("missing_health"), of: targetRefSchema })
    .strict(),
  z
    .object({
      kind: z.literal("counter_of"),
      counter: z.string().min(1),
      of: targetRefSchema,
    })
    .strict(),
]);

/* ─── Positions & directions ─── */

export const positionSelectorSchema = z.discriminatedUnion("kind", [
  z
    .object({
      kind: z.literal("origin_offset"),
      dRow: z.number().int(),
      dCol: z.number().int(),
    })
    .strict(),
  z
    .object({
      kind: z.literal("random_empty"),
      within: z
        .object({
          row: z.number().int(),
          col: z.number().int(),
          radius: z.number().int().positive(),
        })
        .strict()
        .optional(),
    })
    .strict(),
  z
    .object({
      kind: z.literal("specific"),
      row: z.number().int().min(0),
      col: z.number().int().min(0),
    })
    .strict(),
]);

export const directionRefSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("away_from_source") }).strict(),
  z.object({ kind: z.literal("toward_friendly_general") }).strict(),
  z
    .object({
      kind: z.literal("specific"),
      dRow: z.number().int(),
      dCol: z.number().int(),
    })
    .strict(),
]);

/* ─── Targeting (recursive through TargetSelector -> UnitFilter) ─── */

export const originSelectorSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("self") }).strict(),
  z.object({ kind: z.literal("trigger_source") }).strict(),
  z.object({ kind: z.literal("trigger_victim") }).strict(),
  z.object({ kind: z.literal("friendly_general") }).strict(),
  z.object({ kind: z.literal("enemy_general") }).strict(),
  z.object({ kind: z.literal("last_target") }).strict(),
]);

export const positionConstraintSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("any") }).strict(),
  z.object({ kind: z.literal("adjacent_to_friendly") }).strict(),
  z.object({ kind: z.literal("adjacent_to_enemy") }).strict(),
  z.object({ kind: z.literal("own_side") }).strict(),
  z.object({ kind: z.literal("enemy_side") }).strict(),
]);

export const targetSelectorSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("self") }).strict(),
  z.object({ kind: z.literal("friendly_general") }).strict(),
  z.object({ kind: z.literal("enemy_general") }).strict(),
  z
    .object({
      kind: z.literal("single"),
      filter: unitFilterSchema,
      chooser: z.enum(["player", "opponent", "random"]),
    })
    .strict(),
  z
    .object({
      kind: z.literal("all"),
      filter: unitFilterSchema,
    })
    .strict(),
  z
    .object({
      kind: z.literal("radius"),
      origin: originSelectorSchema,
      radius: z.number().int().positive(),
      filter: unitFilterSchema,
    })
    .strict(),
  z
    .object({
      kind: z.literal("line"),
      origin: originSelectorSchema,
      direction: z.enum(["up", "down", "left", "right"]),
      length: z.number().int().positive(),
      filter: unitFilterSchema,
    })
    .strict(),
  z
    .object({
      kind: z.literal("nearest"),
      from: originSelectorSchema,
      filter: unitFilterSchema,
    })
    .strict(),
  z
    .object({
      kind: z.literal("position_empty"),
      constraint: positionConstraintSchema,
    })
    .strict(),
]);

/* ─── Effect (recursive — uses z.lazy) ─── */

/**
 * Effect is mutually recursive with Condition (through `if.cond`) and with
 * TargetSelector (which is non-recursive, so it can be eagerly built above).
 *
 * Zod's z.lazy() lets us tie the knot. The loader does not evaluate schemas
 * until .parse() is called, so lazy references resolve at validation time.
 */

/**
 * Condition is recursive through and/or/not combinators.
 */
export const conditionSchema: z.ZodType<unknown> = z.lazy(() =>
  z.discriminatedUnion("kind", [
    z
      .object({
        kind: z.literal("allies_with"),
        filter: unitFilterSchema,
        op: z.enum(["gte", "lte", "eq"]),
        count: z.number().int().nonnegative(),
      })
      .strict(),
    z.object({ kind: z.literal("self_damaged") }).strict(),
    z
      .object({
        kind: z.literal("self_at_health"),
        op: z.enum(["gte", "lte"]),
        value: z.number().int(),
      })
      .strict(),
    z
      .object({
        kind: z.literal("counter_gte"),
        counter: z.string().min(1),
        value: z.number().int(),
      })
      .strict(),
    z
      .object({
        kind: z.literal("mana_available"),
        amount: z.number().int().nonnegative(),
      })
      .strict(),
    z
      .object({
        kind: z.literal("target_exists"),
        selector: targetSelectorSchema,
      })
      .strict(),
    z
      .object({
        kind: z.literal("and"),
        all: z.array(conditionSchema).min(1),
      })
      .strict(),
    z
      .object({
        kind: z.literal("or"),
        any: z.array(conditionSchema).min(1),
      })
      .strict(),
    z
      .object({
        kind: z.literal("not"),
        c: conditionSchema,
      })
      .strict(),
  ])
);

/**
 * Effect is the tree node type. Primitive ops are leaves; sequence/if/
 * foreach/choose_one/repeat/sacrifice_then/with_target are control flow
 * that recursively contain other Effects.
 */
export const effectSchema: z.ZodType<unknown> = z.lazy(() =>
  z.discriminatedUnion("op", [
    // Damage / healing
    z
      .object({
        op: z.literal("deal_damage"),
        amount: amountSchema,
        to: targetRefSchema,
      })
      .strict(),
    z
      .object({
        op: z.literal("heal"),
        amount: amountSchema,
        to: targetRefSchema,
      })
      .strict(),
    // Stats
    z
      .object({
        op: z.literal("buff"),
        stats: statDeltaSchema,
        duration: durationSchema,
        to: targetRefSchema,
      })
      .strict(),
    z
      .object({
        op: z.literal("debuff"),
        stats: statDeltaSchema,
        duration: durationSchema,
        to: targetRefSchema,
      })
      .strict(),
    // Keywords
    z
      .object({
        op: z.literal("grant_keyword"),
        keyword: keywordSchema,
        duration: durationSchema,
        to: targetRefSchema,
      })
      .strict(),
    z
      .object({
        op: z.literal("remove_keyword"),
        keyword: keywordSchema,
        to: targetRefSchema,
      })
      .strict(),
    // Hand / deck
    z
      .object({
        op: z.literal("draw"),
        amount: amountSchema,
        who: z.enum(["self", "opponent"]),
      })
      .strict(),
    z
      .object({
        op: z.literal("discard"),
        amount: amountSchema,
        from: z.enum(["self", "opponent"]),
        mode: z.enum(["random", "choose"]),
      })
      .strict(),
    z
      .object({
        op: z.literal("mill"),
        amount: amountSchema,
        who: z.enum(["self", "opponent"]),
      })
      .strict(),
    z
      .object({
        op: z.literal("return_to_hand"),
        to: targetRefSchema,
        owner: z.enum(["original", "self"]),
      })
      .strict(),
    // Board
    z
      .object({
        op: z.literal("summon"),
        tokenId: z.string().min(1),
        at: positionSelectorSchema,
        controller: z.enum(["self", "opponent"]),
      })
      .strict(),
    z
      .object({
        op: z.literal("transform"),
        into: z.string().min(1),
        to: targetRefSchema,
      })
      .strict(),
    z.object({ op: z.literal("destroy"), to: targetRefSchema }).strict(),
    z.object({ op: z.literal("dispel"), to: targetRefSchema }).strict(),
    z.object({ op: z.literal("silence"), to: targetRefSchema }).strict(),
    z
      .object({
        op: z.literal("stun"),
        duration: durationSchema,
        to: targetRefSchema,
      })
      .strict(),
    z
      .object({
        op: z.literal("teleport"),
        target: targetRefSchema,
        to: positionSelectorSchema,
      })
      .strict(),
    z
      .object({
        op: z.literal("push"),
        target: targetRefSchema,
        direction: directionRefSchema,
        distance: z.number().int().positive(),
      })
      .strict(),
    // Resource
    z
      .object({
        op: z.literal("gain_mana"),
        amount: amountSchema,
        permanent: z.boolean(),
      })
      .strict(),
    // Counters
    z
      .object({
        op: z.literal("add_counter"),
        kind: z.string().min(1),
        amount: z.number().int(),
        to: targetRefSchema,
      })
      .strict()
      .superRefine((val, ctx) => {
        // Hand-roll a "use reset_counter instead" hint when authors
        // try to zero a counter via a large negative amount. -999
        // was the historical workaround; the engine clamps to 0
        // (effectInterpreter Math.max(0, current + amount)) but the
        // shape is brittle: as soon as a counter legitimately holds
        // > 999, the reset breaks silently. The reset_counter op
        // (added in B3) is the explicit primitive.
        if (val.amount <= -100) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              `add_counter with amount ${val.amount} is the legacy "-999" reset workaround. ` +
              `Use { op: "reset_counter", counter: "${val.kind}", to: ... } instead — ` +
              `it's an explicit primitive that doesn't break when counters exceed the workaround value.`,
            path: ["amount"],
          });
        }
      }),
    z
      .object({
        op: z.literal("reset_counter"),
        counter: z.string().min(1),
        to: targetRefSchema,
      })
      .strict(),
    // Control flow
    z
      .object({
        op: z.literal("sequence"),
        steps: z.array(effectSchema).min(1),
      })
      .strict(),
    z
      .object({
        op: z.literal("if"),
        cond: conditionSchema,
        then: effectSchema,
        else: effectSchema.optional(),
      })
      .strict(),
    z
      .object({
        op: z.literal("foreach"),
        over: targetSelectorSchema,
        do: effectSchema,
      })
      .strict(),
    z
      .object({
        op: z.literal("choose_one"),
        options: z
          .array(
            z
              .object({
                text: z.string().min(1),
                effect: effectSchema,
              })
              .strict()
          )
          .min(2)
          .max(4),
      })
      .strict(),
    z
      .object({
        op: z.literal("repeat"),
        times: amountSchema,
        do: effectSchema,
      })
      .strict(),
    z
      .object({
        op: z.literal("sacrifice_then"),
        sac: targetSelectorSchema,
        then: effectSchema,
      })
      .strict(),
    z
      .object({
        op: z.literal("with_target"),
        selector: targetSelectorSchema,
        do: effectSchema,
      })
      .strict(),
  ])
);

/* ─── Triggers & abilities ─── */

export const cardFilterSchema = z
  .object({
    cardType: z.enum(["unit", "spell", "artifact", "structure"]).optional(),
    faction: z.array(factionSchema).readonly().optional(),
    rarity: z.array(z.string()).readonly().optional(),
    keywords: z
      .object({ has: z.array(keywordSchema).readonly().optional() })
      .strict()
      .optional(),
    idPrefix: z.string().optional(),
  })
  .strict();

export const activationCostSchema = z.discriminatedUnion("kind", [
  z
    .object({
      kind: z.literal("once_per_turn"),
      manaCost: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      kind: z.literal("once_per_match"),
      manaCost: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      kind: z.literal("per_use"),
      manaCost: z.number().int().nonnegative(),
    })
    .strict(),
]);

export const auraRangeSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("self") }).strict(),
  z.object({ kind: z.literal("adjacent") }).strict(),
  z
    .object({ kind: z.literal("radius"), n: z.number().int().positive() })
    .strict(),
  z.object({ kind: z.literal("same_row") }).strict(),
  z.object({ kind: z.literal("same_col") }).strict(),
  z.object({ kind: z.literal("friendly_side") }).strict(),
  z.object({ kind: z.literal("global") }).strict(),
]);

export const triggerSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("on_deploy") }).strict(),
  z.object({ kind: z.literal("on_cast") }).strict(),
  z.object({ kind: z.literal("on_death") }).strict(),
  z
    .object({
      kind: z.literal("on_damage_dealt"),
      by: z.enum(["self", "any_ally", "any"]),
    })
    .strict(),
  z.object({ kind: z.literal("on_damage_taken") }).strict(),
  z
    .object({
      kind: z.literal("on_kill"),
      of: z.enum(["unit", "general", "any"]),
    })
    .strict(),
  z
    .object({
      kind: z.literal("on_turn_start"),
      owner: z.enum(["self", "opponent", "either"]),
    })
    .strict(),
  z
    .object({
      kind: z.literal("on_turn_end"),
      owner: z.enum(["self", "opponent", "either"]),
    })
    .strict(),
  z
    .object({
      kind: z.literal("on_any_unit_dies"),
      filter: cardFilterSchema.optional(),
    })
    .strict(),
  z
    .object({
      kind: z.literal("on_card_drawn"),
      filter: cardFilterSchema.optional(),
    })
    .strict(),
  z
    .object({
      kind: z.literal("on_card_played"),
      filter: cardFilterSchema.optional(),
    })
    .strict(),
  z.object({ kind: z.literal("on_move") }).strict(),
  z
    .object({
      kind: z.literal("on_summoned_near_me"),
      filter: cardFilterSchema.optional(),
      radius: z.number().int().positive(),
    })
    .strict(),
  z
    .object({
      kind: z.literal("passive_aura"),
      range: auraRangeSchema,
    })
    .strict(),
  z
    .object({
      kind: z.literal("activated"),
      cost: activationCostSchema,
    })
    .strict(),
]);

export const abilitySchema = z
  .object({
    id: z.string().min(1),
    trigger: triggerSchema,
    condition: conditionSchema.optional(),
    targetSelector: targetSelectorSchema.optional(),
    effect: effectSchema,
  })
  .strict();

/**
 * Discriminated union of card unlock gates. Mirrors the
 * CardUnlockCondition type in ../types/Card.ts. See
 * apps/shared/tcg-core/rewards/expansionUnlockService.ts for the
 * dispatcher that consumes these.
 */
export const cardUnlockConditionSchema = z.discriminatedUnion("kind", [
  z
    .object({
      kind: z.literal("act_completion"),
      act: z.union([
        z.literal(1),
        z.literal(2),
        z.literal(3),
        z.literal(4),
        z.literal(5),
        z.literal(6),
        z.literal(7),
      ]),
    })
    .strict(),
  z
    .object({
      kind: z.literal("secret"),
      act: z.union([
        z.literal(1),
        z.literal(2),
        z.literal(3),
        z.literal(4),
        z.literal(5),
        z.literal(6),
        z.literal(7),
      ]),
    })
    .strict(),
  z
    .object({
      kind: z.literal("battle_pass"),
      tier: z.number().int().min(1).max(100),
    })
    .strict(),
  z.object({ kind: z.literal("founding_author") }).strict(),
  z
    .object({
      kind: z.literal("authors_edition"),
      season: z.literal("s2"),
    })
    .strict(),
  z
    .object({
      kind: z.literal("dlc_chapter_completion"),
      chapterId: z.string().min(1),
    })
    .strict(),
  z
    .object({
      kind: z.literal("bloodline_threshold"),
      classification: z.string().min(1),
      minGenerations: z.number().int().positive(),
    })
    .strict(),
  z
    .object({
      kind: z.literal("arc_episode_complete"),
      arcId: z.string().min(1),
      episodeId: z.string().min(1),
    })
    .strict(),
  z
    .object({
      kind: z.literal("perspective_learned"),
      perspectiveId: z.string().min(1),
    })
    .strict(),
  z
    .object({
      kind: z.literal("dialog_choice"),
      /** Canonical narrative flag minted by an `NpcDialogChoice.sets`.
       *  See the corresponding type-side doc in
       *  apps/shared/tcg-core/types/Card.ts. */
      flag: z.string().min(1),
    })
    .strict(),
]);

/* ─── Top-level card definition ─── */

export const cardDefinitionSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9_]+$/, "lowercase snake_case only"),
    name: z.string().min(1),
    faction: factionSchema,
    cardType: cardTypeSchema,
    rarity: raritySchema,
    cost: z.number().int().min(0).max(9),
    baseStats: z
      .object({
        power: z.number().int().nonnegative(),
        health: z.number().int().positive(),
      })
      .strict()
      .optional(),
    keywords: z.array(keywordSchema).readonly(),
    abilities: z.array(abilitySchema).readonly(),
    art: z.string().min(1),
    flavorText: z.string(),
    rulesVersion: z.string().regex(/^\d+\.\d+\.\d+$/, "semver"),
    artifactDurability: z.number().int().positive().optional(),
    /** Player class restriction (Phase B7). When set, the card
     *  may only be added to decks built by players of this
     *  character class. Enforced by validateDeck in Phase B8.
     *  Omitting the field leaves the card class-neutral. */
    characterClass: z
      .enum(["spy", "oracle", "assassin", "engineer", "soldier", "neyon"])
      .optional(),
    /** §5.8 Authority trial-phase admissibility. Optional; see
     *  docs/production/act1/authority-trial-phase-mechanic.md. Empty
     *  array or absent field means unplayable in every restricted
     *  §5.8 phase — backfill planned before §5.8 runtime ships. */
    trial_categories: z.array(trialCategorySchema).readonly().optional(),
    /** §5.5 Warlord-deck-only marker. Cards with this flag are
     *  filtered out of every player-buildable pool by the deck
     *  builder; they appear only in scripted opponent decks. See
     *  docs/production/act1/warlord-three-move-mechanic.md §6.1. */
    warlord_only: z.literal(true).optional(),
    /** §5.8 verdict-stream delta. Integer in [-3, +3]; absent
     *  defaults to PLACEHOLDER_PLAY_DELTA (+1) per
     *  engine/trialPhase.ts. See
     *  docs/production/act1/authority-trial-phase-mechanic.md §3 for
     *  how the delta composes into the trial balance. */
    verdict_delta: z.number().int().min(-3).max(3).optional(),
    /** Optional §5.7 public-witness override. Same [-3, +3] range.
     *  When set, diverges from verdict_delta to drive the rust-
     *  orange warning border on the §5.7 TranscriptColumn row.
     *  See engine/publicWitness.ts applyPublicWitnessPlay. */
    public_delta: z.number().int().min(-3).max(3).optional(),
    /** Multi-axis stakes deltas — generalization of
     *  `verdict_delta` / `public_delta`. Same [-3, +3] per-axis
     *  integer range. Keys are the canonical `StakesAxis` values
     *  (engine/stakesResolver.ts STAKES_AXES). Authoring rule
     *  enforced by .superRefine below: a card may set
     *  `verdict_delta` OR `stakes_deltas.verdict`, never both
     *  (same for public_delta / stakes_deltas.public_witness). */
    stakes_deltas: z
      .object({
        verdict: z.number().int().min(-3).max(3).optional(),
        public_witness: z.number().int().min(-3).max(3).optional(),
      })
      .strict()
      .optional(),
    /** Optional: marks a card as reserved-from-pools (see Card.ts
     *  `reserved` doc). Only `true` is meaningful; absence ≡ false. */
    reserved: z.literal(true).optional(),
    /** Optional: gates the card behind a story / progression milestone.
     *  See Card.ts `unlockCondition` doc + expansionUnlockService.ts. */
    unlockCondition: cardUnlockConditionSchema.optional(),
    /** Optional: explicit acknowledgement that this card's stat budget
     *  diverges from the STAT_CURVE / KEYWORD_TAX expectation in
     *  apps/shared/tcg-core/balance/statCurve.ts. The
     *  ship:check tcg.card_stat_budget_coverage gate flags any
     *  off-curve unit/structure that does NOT carry this field. The
     *  exception is by-design — designer intent on record — not a
     *  silencer for "we'll fix it later." `reason` is plain English;
     *  `reviewer` is the human who signed off. */
    balanceException: z
      .object({
        reason: z.string().min(8),
        reviewer: z.string().min(2),
      })
      .strict()
      .optional(),

    /* H2 keyword-config fields. Each is optional — absent values
     * fall back to documented engine defaults when the matching
     * keyword is present. */
    growAmount: z
      .object({
        power: z.number().int().nonnegative(),
        health: z.number().int().nonnegative(),
      })
      .strict()
      .optional(),
    furyCount: z.number().int().min(2).max(5).optional(),
    infiltrateBonus: z.number().int().min(0).max(5).optional(),
    overchargeBonus: z.number().int().min(0).max(5).optional(),
    overchargeSelfDamage: z.number().int().min(0).max(5).optional(),
    rallyBuff: z
      .object({
        power: z.number().int().nonnegative(),
        health: z.number().int().nonnegative(),
      })
      .strict()
      .optional(),
    backstabBonus: z.number().int().min(0).max(5).optional(),
    /** Starting armor stack. Soaks damage 1-for-1 before HP. Most
     *  cards omit this (default 0); generals and tank-style units
     *  opt in. The `pierce` and `ignore_armor_3` keywords reduce
     *  the soak — see engine/combat.ts:applyCombatDamage. */
    baseArmor: z.number().int().min(0).max(20).optional(),
  })
  .strict()
  .superRefine((card, ctx) => {
    // Units and artifacts must have baseStats; spells must not.
    if (card.cardType === "unit" && !card.baseStats) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "unit cards must declare baseStats",
        path: ["baseStats"],
      });
    }
    if (card.cardType === "spell" && card.baseStats) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "spell cards must not declare baseStats",
        path: ["baseStats"],
      });
    }
    // Ability IDs must be unique within a card so logs are unambiguous.
    const seen = new Set<string>();
    for (const a of card.abilities) {
      if (seen.has(a.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `duplicate ability id '${a.id}'`,
          path: ["abilities"],
        });
      }
      seen.add(a.id);
    }

    // H2 — `rally_buff` keyword has no required config field —
    // engine defaults to {power:1, health:1} when absent — so the
    // schema doesn't enforce. Mentioned here so future schema
    // refactors don't accidentally reintroduce a strict check that
    // breaks the existing rally_buff cards.

    // Stakes Stream widening — dual-source rejection. A card MUST
    // NOT author both the legacy single-axis field AND the
    // corresponding stakes_deltas entry — the two would silently
    // disagree at runtime (the resolver in engine/stakesResolver.ts
    // prefers stakes_deltas, so authors who set both would have
    // their verdict_delta ignored without any signal).
    if (
      card.verdict_delta !== undefined &&
      card.stakes_deltas?.verdict !== undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "card sets both `verdict_delta` and `stakes_deltas.verdict` — pick one",
        path: ["stakes_deltas", "verdict"],
      });
    }
    if (
      card.public_delta !== undefined &&
      card.stakes_deltas?.public_witness !== undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "card sets both `public_delta` and `stakes_deltas.public_witness` — pick one",
        path: ["stakes_deltas", "public_witness"],
      });
    }
  });

export type ValidatedCardDefinition = z.infer<typeof cardDefinitionSchema>;
