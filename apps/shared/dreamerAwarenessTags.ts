/**
 * Dreamer-Awareness tag catalog.
 *
 * Specific player actions that the Dreamer's agents notice. When a
 * tag fires, the corresponding weight is added to the player's
 * awareness counter (silent — no UI). Threshold crossings at {3, 7,
 * 13, 23} (Discordian primes) trigger coded vision cutscenes per
 * the dual-faction recruitment plan
 * (/root/.claude/plans/continue-your-qr-assessment-mighty-valley.md).
 *
 * Each tag fires at most once per player. The service enforces
 * idempotency via the dreamerAwareness.tagsFired column.
 *
 * Adding a new tag:
 *   1. Pick a stable id (snake_case, never repurposed).
 *   2. Pick a weight — most are +1; reserve higher weights for rare
 *      / climactic actions like the Burnt Card discovery.
 *   3. Call from the gameplay site that owns the trigger condition
 *      via `tagDreamerAwareness(userId, tagId)`.
 *
 * The catalog is intentionally narrow. Don't tag every player choice
 * — only those that signal "this player breaks the optimization
 * pattern in a way the Dreamer's agents would notice."
 */

export interface DreamerAwarenessTag {
  /** Stable id used in the dreamerAwareness.tagsFired dedupe set. */
  readonly id: string;
  /** Awareness counter increment when the tag fires. */
  readonly weight: number;
  /** Human-readable description for moderator / debug surfaces. */
  readonly description: string;
}

export const DECLINE_WINNING_DRAW: DreamerAwarenessTag = {
  id: "decline_winning_draw",
  weight: 1,
  description:
    "Player declined a draw offer in chess while holding a winning position. Refusing comfort signals the kind of agent the Dreamer's network notices.",
};

/**
 * NOT YET WIRED. Blocked on engine-level lethal-attack detection —
 * needs an `availableLethalAttacks(state, side)` helper in
 * apps/shared/tcg-core/engine to enumerate "had a unit in range
 * with attack ≥ enemy general HP and didn't use it" at end-of-
 * turn. The tag id + weight are reserved here so the catalog stays
 * stable for downstream consumers (DREAMER_AWARENESS_TAGS, the
 * idempotency dedupe set, etc.); when the engine helper lands, add
 * a maybeTagSpareLethalOpponent(...) helper to
 * apps/server/services/dreamerAwarenessTriggers.ts and call from
 * the duelyst end-of-turn path.
 */
export const SPARE_LETHAL_OPPONENT: DreamerAwarenessTag = {
  id: "spare_lethal_opponent",
  weight: 1,
  description:
    "Player spared an opponent at < 5 HP that game rules would have killed. Mercy chosen against the optimizer's grain.",
};

export const ASK_SUBSTRATE_REPEATED: DreamerAwarenessTag = {
  id: "ask_substrate_repeated",
  weight: 1,
  description:
    "Player asked any companion about The Substrate three or more times. Curiosity persistent enough to register.",
};

export const ASK_DREAM_REPEATED: DreamerAwarenessTag = {
  id: "ask_dream_repeated",
  weight: 1,
  description:
    "Player asked any companion about The Dream three or more times. The word itself is a signal.",
};

export const ASK_ORACLE_REPEATED: DreamerAwarenessTag = {
  id: "ask_oracle_repeated",
  weight: 1,
  description:
    "Player asked any companion about the Oracle three or more times. The relay node noticed.",
};

export const MORALITY_DIVERGENT_CHOICE: DreamerAwarenessTag = {
  id: "morality_divergent_choice",
  weight: 1,
  description:
    "Player chose a morality-divergent option in a dialog wheel where the obvious choice was machine-aligned.",
};

/**
 * NOT YET WIRED. Blocked on the Trade Empire "wonder" mechanic
 * not yet existing — apps/server/routers/tradeEmpire.ts has eras /
 * encounters / doctrines / civics / fleet / sectors but no
 * "wonder" concept. (Guild wonders in apps/shared/guildWonders.ts
 * are a different surface — guild-level, not Trade Empire.) When
 * the Trade Empire content layer adds wonder completion + an
 * "expected to consolidate" optimizer signal, plug the trigger in
 * via apps/server/services/dreamerAwarenessTriggers.ts following
 * the maybeTagMoralityDivergent shape.
 */
export const TRADE_WONDER_OFF_META: DreamerAwarenessTag = {
  id: "trade_wonder_off_meta",
  weight: 1,
  description:
    "Player won a Trade Empire wonder while the system expected them to consolidate. Declining the optimizer's path.",
};

export const BURNT_CARD_WITNESSED: DreamerAwarenessTag = {
  id: "burnt_card_witnessed",
  weight: 5,
  description:
    "Player witnessed the Burnt Card via the Seer-Prophecy `defeated` outcome. Rare. The Dreamer attends.",
};

/** Canonical catalog. Order is the in-game discovery order; numerology
 *  alignment with thresholds {3, 7, 13, 23} is incidental — the actual
 *  threshold crossing depends on which tags fire in which order, not on
 *  catalog position. */
export const DREAMER_AWARENESS_TAGS: readonly DreamerAwarenessTag[] = [
  DECLINE_WINNING_DRAW,
  SPARE_LETHAL_OPPONENT,
  ASK_SUBSTRATE_REPEATED,
  ASK_DREAM_REPEATED,
  ASK_ORACLE_REPEATED,
  MORALITY_DIVERGENT_CHOICE,
  TRADE_WONDER_OFF_META,
  BURNT_CARD_WITNESSED,
];

/** Discordian thresholds at which a vision cutscene is delivered. */
export const DREAMER_VISION_THRESHOLDS: readonly number[] = [3, 7, 13, 23];

/** Lookup by id. */
const TAGS_BY_ID = new Map<string, DreamerAwarenessTag>(
  DREAMER_AWARENESS_TAGS.map((t) => [t.id, t]),
);

export function getDreamerAwarenessTag(id: string): DreamerAwarenessTag | undefined {
  return TAGS_BY_ID.get(id);
}

/**
 * Compute which vision threshold (if any) was *crossed* by this tag
 * fire. Returns the threshold value (e.g. 7) if the count moved from
 * below to at-or-above; otherwise undefined.
 *
 * Pure helper; the service uses it to decide whether to enqueue a
 * vision delivery alongside the tag write.
 */
export function thresholdCrossed(
  prevCount: number,
  newCount: number,
): number | undefined {
  for (const t of DREAMER_VISION_THRESHOLDS) {
    if (prevCount < t && newCount >= t) return t;
  }
  return undefined;
}

/* ─── Trigger-wiring patterns ─────────────────────────────────────
 *
 * The recruitment plan describes WHEN each tag should fire. Server-
 * side trigger sites need to translate "ask about The Substrate
 * three or more times" / "decline a winning chess draw" into
 * concrete predicates against existing data. This block exposes the
 * configuration those triggers consume so future tag additions or
 * topic renames don't require chasing pattern strings through the
 * server.
 *
 * Topic-id patterns are matched as case-insensitive substrings of
 * the topic id stored in npc_ask_topic_history. Conservative by
 * design — better to miss a borderline match than to fire the tag
 * on a Storyteller "tell me about your dreams" small-talk topic.
 * ─────────────────────────────────────────────────────────────── */

/** Topic-id patterns that count toward `ask_substrate_repeated`. */
export const SUBSTRATE_TOPIC_PATTERNS: readonly string[] = [
  "substrate",
];

/** Topic-id patterns that count toward `ask_dream_repeated`. */
export const DREAM_TOPIC_PATTERNS: readonly string[] = [
  "the_dream",
  "the-dream",
  "dreamer",
];

/** Topic-id patterns that count toward `ask_oracle_repeated`. */
export const ORACLE_TOPIC_PATTERNS: readonly string[] = [
  "oracle",
];

/** Threshold (asks of any single keyword) at which the tag fires. */
export const ASK_REPEAT_THRESHOLD = 3;

/** Material-advantage threshold (centipawns equivalent in standard
 *  piece values) at which a chess decline-draw tag fires. +3 = a
 *  minor piece up; conservative bar so we don't tag every "I'd
 *  rather play it out" decline. */
export const DECLINE_DRAW_MATERIAL_ADVANTAGE = 3;

/** Magnitude of a single morality choice that counts as
 *  "divergent." Positive moralityDelta is humanity-aligned in this
 *  codebase (see apps/server/routers/rpgSystems.ts threshold
 *  registry — +75 = "dreamer_noticed"); a delta of ≥5 from a
 *  player-choice context (dialog / companion / governance) is the
 *  bar at which the choice is intentional rather than incidental.
 *  Smaller +1/+2 nudges aren't tagged. */
export const MORALITY_DIVERGENT_THRESHOLD = 5;

/** Source-context values for which a positive morality delta counts
 *  as a divergent player CHOICE. Context values like "event" /
 *  "quest" describe automatic / world-state deltas the player
 *  didn't directly pick from a wheel; those are excluded. */
export const MORALITY_DIVERGENT_CONTEXTS: readonly string[] = [
  "dialog",
  "companion",
  "governance",
];

/** Resolve which tag (if any) a given topic id maps to. Pure helper
 *  used by the server-side trigger glue. */
export function dreamerTagForTopicId(topicId: string): typeof ASK_SUBSTRATE_REPEATED | typeof ASK_DREAM_REPEATED | typeof ASK_ORACLE_REPEATED | undefined {
  const lower = topicId.toLowerCase();
  if (SUBSTRATE_TOPIC_PATTERNS.some((p) => lower.includes(p))) return ASK_SUBSTRATE_REPEATED;
  if (DREAM_TOPIC_PATTERNS.some((p) => lower.includes(p))) return ASK_DREAM_REPEATED;
  if (ORACLE_TOPIC_PATTERNS.some((p) => lower.includes(p))) return ASK_ORACLE_REPEATED;
  return undefined;
}
