/**
 * Oracle Deck — spread definitions (Phase E2).
 *
 * Every reading in Dischordia uses one of three canonical spreads:
 *
 *   DAILY — a 1-card reading the player can cast once per day for
 *     a small persistent-day bonus. Single position: "today."
 *
 *   PRE_MATCH — a 3-card reading the player can spend an Oracle
 *     charge on before a TCG match. Position rules:
 *       0. PAST — buff applied at match start
 *       1. PRESENT — buff applied on turn 2
 *       2. FUTURE — buff applied at turn 5 (the "late-game hinge")
 *
 *   WEEKLY — a 5-card reading the player can cast once per week
 *     for a larger bonus. Positions are borrowed from the I Ching
 *     hexagram model via the Engineer's translation:
 *       0. SITUATION — the ground under your feet
 *       1. FORCES — what is pushing you
 *       2. RESISTANCE — what is pushing back
 *       3. HIDDEN — what neither you nor your opponent can see
 *       4. OUTCOME — the shape the week wants to settle into
 *
 * The spread definitions are pure data — no draw logic. The
 * deterministic-draw engine in readings.ts (E3) reads these
 * shapes and produces an actual OracleReading.
 *
 * Design references the Oracle cited: the I Ching's 6-position
 * hexagram model (the Engineer collapsed it from 6 to 5 because
 * "six is too many positions for a deck with only 23 cards");
 * the Tree of Life Celtic Cross is explicitly rejected as "the
 * wrong shape for a Saga in which time is already a board."
 */

import type { OracleBuff } from "./oracleDeckTypes";

/* ═══════════════════════════════════════════════════════
   SPREAD TYPES
   ═══════════════════════════════════════════════════════ */

/** Which canonical spread is being cast. */
export type OracleSpreadKind = "daily" | "pre_match" | "weekly";

/** A single position within a spread — describes what the card
 *  drawn here represents, and when its buff (if any) applies. */
export interface OracleSpreadPosition {
  /** 0-indexed slot in the spread. */
  index: number;
  /** Short position label for the reading UI (e.g. "Past"). */
  label: string;
  /** The Oracle's one-line description of what this slot means. */
  description: string;
  /** When the buff from the card in this slot applies. Pre-match
   *  and weekly positions map to specific trigger points in the
   *  match / week. Daily readings only have "day_start". */
  appliesAt:
    | "day_start"
    | "match_start"
    | "turn_2"
    | "turn_5"
    | "week_start"
    | "week_mid"
    | "week_end"
    | "week_hidden";
}

/** The shape of a spread — its kind and ordered positions.
 *  Does NOT include the drawn cards; those come from readings.ts. */
export interface OracleSpreadShape {
  /** Stable id for routing and the client UI. */
  id: OracleSpreadKind;
  /** Display name in the reading UI. */
  name: string;
  /** One-sentence blurb describing what this spread is for. */
  blurb: string;
  /** Ordered positions the draw engine fills. */
  positions: readonly OracleSpreadPosition[];
  /** How often the player can cast this spread.
   *  "daily" = once per 24h, "weekly" = once per 7d,
   *  "on_demand" = once per matching TCG match. */
  cadence: "daily" | "weekly" | "on_demand";
  /** What the player spends to cast this spread. Oracle charges
   *  are a single currency — gained from specific milestones. */
  cost: number;
}

/** A drawn card's position metadata bundled for the reading UI.
 *  Composed with the card in readings.ts. */
export interface OracleDrawnPosition {
  position: OracleSpreadPosition;
  /** The card that landed here. Slug reference; the router
   *  rehydrates it via getOracleCardBySlug. */
  cardSlug: string;
  /** Whether the card landed upright or reversed. Reversed cards
   *  grant a smaller / inverted buff. */
  orientation: "upright" | "reversed";
  /** The actual buff applied at the position's appliesAt trigger.
   *  Reading code reads this directly; match init does not have
   *  to re-resolve the card data. */
  buff: OracleBuff;
}

/* ═══════════════════════════════════════════════════════
   SPREAD SHAPES
   ═══════════════════════════════════════════════════════ */

export const DAILY_SPREAD: OracleSpreadShape = {
  id: "daily",
  name: "Daily Reading",
  blurb:
    "A single card for the shape of your day. The reading is deterministic — the same day and the same player always draws the same card. Tomorrow is different, and the day after that is different again.",
  positions: [
    {
      index: 0,
      label: "Today",
      description:
        "The day's shape. The card's buff is small but applies to every activity you do today — match, quest, conversation, vote.",
      appliesAt: "day_start",
    },
  ],
  cadence: "daily",
  cost: 0, // Free — one per day.
};

export const PRE_MATCH_SPREAD: OracleSpreadShape = {
  id: "pre_match",
  name: "Pre-Match Reading — Past / Present / Future",
  blurb:
    "A three-card reading cast before a TCG match. Past buffs the opening. Present buffs turn 2. Future buffs turn 5 — the late-game hinge where the match usually turns.",
  positions: [
    {
      index: 0,
      label: "Past",
      description:
        "The ground you stand on. Buffs the opening hand and the first deployment.",
      appliesAt: "match_start",
    },
    {
      index: 1,
      label: "Present",
      description:
        "The forces in motion now. Buffs your turn 2 — the pivot where tempo is usually decided.",
      appliesAt: "turn_2",
    },
    {
      index: 2,
      label: "Future",
      description:
        "The hinge. Buffs your turn 5 — the late-game inflection where the match's shape becomes visible.",
      appliesAt: "turn_5",
    },
  ],
  cadence: "on_demand",
  cost: 1, // 1 Oracle charge per match.
};

export const WEEKLY_SPREAD: OracleSpreadShape = {
  id: "weekly",
  name: "Weekly Spread — The Five Forces",
  blurb:
    "A five-card reading the Engineer adapted from the I Ching's hexagram model. Collapses the traditional six-line hexagram into five positions because a 23-card deck cannot honestly fill six. Cast once per week. The Hidden card is the deck's nod to The Fnord — its effect is sealed until it fires.",
  positions: [
    {
      index: 0,
      label: "Situation",
      description:
        "The ground under your feet this week. Buffs everything you do on day 1.",
      appliesAt: "week_start",
    },
    {
      index: 1,
      label: "Forces",
      description:
        "What is pushing you forward. Buffs every match you play on days 2-3.",
      appliesAt: "week_mid",
    },
    {
      index: 2,
      label: "Resistance",
      description:
        "What is pushing back. Applies a defensive buff during days 4-5.",
      appliesAt: "week_mid",
    },
    {
      index: 3,
      label: "Hidden",
      description:
        "What neither you nor your opponent can see. The card in this slot is not revealed in the reading UI; its effect fires at an unspecified moment during the week.",
      appliesAt: "week_hidden",
    },
    {
      index: 4,
      label: "Outcome",
      description:
        "The shape the week wants to settle into. Applies a final bonus on day 7.",
      appliesAt: "week_end",
    },
  ],
  cadence: "weekly",
  cost: 3, // 3 Oracle charges per week — substantial.
};

/** All canonical spreads, keyed by id. The router and client UI
 *  iterate this to offer reading options to the player. */
export const ORACLE_SPREADS: Readonly<Record<OracleSpreadKind, OracleSpreadShape>> =
  Object.freeze({
    daily: DAILY_SPREAD,
    pre_match: PRE_MATCH_SPREAD,
    weekly: WEEKLY_SPREAD,
  });

/** Lookup helper — returns the spread shape or undefined. */
export function getOracleSpread(
  kind: OracleSpreadKind | string,
): OracleSpreadShape | undefined {
  return (ORACLE_SPREADS as Record<string, OracleSpreadShape>)[kind];
}
