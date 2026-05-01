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
