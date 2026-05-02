/**
 * Player Profile — standard delta registry.
 *
 * Maps every known choice / mechanical event to its standard
 * `ProfileDelta`. Centralizing weights here means dialog writers
 * never have to invent numbers, and a balance pass touches one
 * file instead of every dialog table.
 *
 * Sources are grouped by subsystem. Add a new entry whenever a new
 * choice point in the game is annotated to write to the profile.
 *
 * Convention for weights: most events move axes by 2..6 points.
 * Reserve ±10+ for genuinely defining choices (e.g. resigning a
 * winning position is a strong mercy signal). Profiles cap at
 * ±100; with this scale, a player needs ~20 strongly-aligned
 * choices to fully saturate an axis, which is roughly one act of
 * play. That tuning is intentional — the profile should be legible
 * by mid-game and confidently expressive by late game.
 */

import type { ProfileDelta } from "./playerProfile";

/** Lookup helper — return the standard delta for a registered
 *  source id, or `null` if the source is unknown. Unknown sources
 *  are tolerated (the event is still recorded; it just contributes
 *  no axis weight). */
export function getStandardDelta(
  sourceId: string,
): ProfileDelta | null {
  return PROFILE_SOURCE_DELTAS[sourceId] ?? null;
}

/* ═══════════════════════════════════════════════════════
   CHESS — MIND-GAME CHOICES
   Each chess mind-game cue offers 3 archetype choices plus an
   implicit silent default. The archetype carries the same delta
   regardless of which cue surfaced it; the GM's REPLY varies by
   profile, but the profile WRITE is uniform.
   ═══════════════════════════════════════════════════════ */

const CHESS_MIND_GAME_DEFIANT: ProfileDelta = {
  aggression: 4,
  vulnerability: -2,
  wit: 2,
};

const CHESS_MIND_GAME_CURIOUS: ProfileDelta = {
  curiosity: 5,
  vulnerability: 3,
  vigilance: -1,
};

const CHESS_MIND_GAME_PHILOSOPHICAL: ProfileDelta = {
  curiosity: 3,
  conformity: -2,
  vulnerability: 2,
  wit: 1,
};

const CHESS_MIND_GAME_MOCKING: ProfileDelta = {
  wit: 5,
  aggression: 3,
  mercy: -3,
};

const CHESS_MIND_GAME_VULNERABLE: ProfileDelta = {
  vulnerability: 6,
  mercy: 2,
  vigilance: -2,
};

const CHESS_MIND_GAME_SILENT: ProfileDelta = {
  vigilance: 3,
  vulnerability: -3,
  wit: -1,
};

/* ═══════════════════════════════════════════════════════
   CHESS — MECHANICAL ACTIONS
   ═══════════════════════════════════════════════════════ */

const CHESS_RESIGN_LOSING: ProfileDelta = {
  // Resigning a clearly lost game is pragmatic, not a personality
  // signal — small conformity bump (you took the recommended path)
  // and a small vulnerability bump (you admitted the loss).
  conformity: 2,
  vulnerability: 2,
};

const CHESS_RESIGN_WINNING: ProfileDelta = {
  // Resigning a position you were winning is a strong mercy signal
  // and a moderate vulnerability one.
  mercy: 8,
  vulnerability: 4,
  aggression: -4,
};

const CHESS_DRAW_OFFER_MADE: ProfileDelta = {
  mercy: 3,
  aggression: -2,
};

const CHESS_DRAW_OFFER_ACCEPTED: ProfileDelta = {
  mercy: 2,
  conformity: 2,
};

const CHESS_DRAW_OFFER_DECLINED: ProfileDelta = {
  aggression: 4,
  mercy: -3,
};

const CHESS_HINT_USED: ProfileDelta = {
  conformity: 3,
  vulnerability: 2,
};

const CHESS_PUZZLE_RETRIED: ProfileDelta = {
  conformity: 2,
  vulnerability: 1,
};

/* ═══════════════════════════════════════════════════════
   CHESS — CLIMB MODE
   ═══════════════════════════════════════════════════════ */

const CHESS_CLIMB_OFFER_ACCEPTED: ProfileDelta = {
  aggression: 3,
  conformity: -2,
};

const CHESS_CLIMB_OFFER_DECLINED: ProfileDelta = {
  vigilance: 3,
  aggression: -2,
};

const CHESS_SILENCE_STREAK_3: ProfileDelta = {
  // Three consecutive silent defaults — the GM acknowledges this.
  vigilance: 4,
  vulnerability: -4,
  wit: -2,
};

/* ═══════════════════════════════════════════════════════
   CARD GAME — extension placeholders. Values are conservative;
   the card-game dialog tables will get retroactive annotations in
   Phase F that override these defaults per choice when needed.
   ═══════════════════════════════════════════════════════ */

const CARD_DIALOG_CHOICE_DEFAULT: ProfileDelta = {
  // No-op default — written when a dialog choice fires without an
  // explicit override in the per-choice annotation. Keeps the
  // event log honest without drifting axes from unannotated text.
};

const CARD_MATCH_RESIGNED: ProfileDelta = {
  conformity: 2,
  vulnerability: 2,
};

const CARD_MATCH_CONCEDE_ACCEPTED: ProfileDelta = {
  mercy: 4,
  aggression: -2,
};

/* ═══════════════════════════════════════════════════════
   ENGINEER'S BENCH — first-craft archetypes (Act 2 §6.2)
   ═══════════════════════════════════════════════════════ */

/** First-ever craft of a light-aligned card. The bench teaches that
 *  "small is where the bench teaches; small is what survives the
 *  first thousand mistakes." Nudges mercy (a small, kind first act)
 *  and curiosity (the player chose to engage with the craft). */
const BENCH_CRAFT_LIGHT_FIRST: ProfileDelta = {
  mercy: 3,
  curiosity: 2,
};

/** First-ever craft of a dark-aligned card. The Human nods: "be
 *  honest about what you are making." Nudges vulnerability (the
 *  player chose to be seen making a dark thing) and wit (dark
 *  crafting carries a knowing humor in this universe). */
const BENCH_CRAFT_DARK_FIRST: ProfileDelta = {
  vulnerability: 3,
  wit: 2,
};

/* ═══════════════════════════════════════════════════════
   GOVERNANCE — VOTE #0 + CHAMBER PARTICIPATION
   The surveillance gate is the player's first vote ("did the
   Eye get an answer?"). Subsequent governance votes inherit
   the same Confirm-vs-Look-Away spine; the per-vote registry
   in apps/shared/governanceConsequences.ts maps each vote-option
   to one of these source ids.
   ═══════════════════════════════════════════════════════ */

/** CONFIRM at the surveillance gate: the player accepted the
 *  operator handshake. Anchors the conformist pole; small wit
 *  bump (the player engaged with the bit). */
const VOTE_ZERO_EYE_CONFIRMED: ProfileDelta = {
  conformity: 3,
  wit: 1,
};

/** LOOK AWAY at the surveillance gate: refusal of the operator
 *  handshake. Anchors the iconoclast pole and writes a small
 *  vigilance bump (the player noticed they were being looked at). */
const VOTE_ZERO_EYE_LOOKED_AWAY: ProfileDelta = {
  conformity: -3,
  vigilance: 2,
};

/** Sticking with the original Vote #0 answer when the Architect
 *  offers the Kierkegaardian re-cast. Reinforces the existing
 *  stance at half magnitude. */
const VOTE_ZERO_REAFFIRMED: ProfileDelta = {
  conformity: 2,
};

/** Switching the Vote #0 answer when offered the re-cast. The
 *  defection is the louder signal — full magnitude, opposite sign
 *  to whatever the original was. The dispatcher applies the inverse
 *  of the original via overrideDeltas, so this entry just records
 *  the standard "switched" weight. */
const VOTE_ZERO_RECANTED: ProfileDelta = {
  conformity: -3,
  vigilance: 1,
};

/** Generic governance-vote frames. Per-vote options pick one of
 *  these via the eyeFraming field on the VoteOption. The
 *  consequence dispatcher applies the matching delta when a
 *  player casts. */
const GOVERNANCE_VOTE_CONFIRM: ProfileDelta = {
  conformity: 2,
};

const GOVERNANCE_VOTE_LOOK_AWAY: ProfileDelta = {
  conformity: -2,
  vigilance: 1,
};

const GOVERNANCE_VOTE_NEUTRAL: ProfileDelta = {
  // Neutral framings still log the participation event but carry
  // no axis weight — keeps the event log honest.
};

/* ═══════════════════════════════════════════════════════
   ROOMS / NARRATIVE — placeholders
   ═══════════════════════════════════════════════════════ */

const ROOM_DIALOG_CHOICE_DEFAULT: ProfileDelta = {};
const MISSION_OUTCOME_DEFAULT: ProfileDelta = {};
const NARRATIVE_CHOICE_DEFAULT: ProfileDelta = {};

/* ═══════════════════════════════════════════════════════
   REGISTRY — source id → standard delta
   ═══════════════════════════════════════════════════════ */

const PROFILE_SOURCE_DELTAS: Readonly<Record<string, ProfileDelta>> =
  Object.freeze({
    // Chess mind-game choices — keyed by archetype (suffix on the
    // source id passed to recordEvent, e.g.
    // "chess_mind_game_choice:defiant").
    "chess_mind_game_choice:defiant": CHESS_MIND_GAME_DEFIANT,
    "chess_mind_game_choice:curious": CHESS_MIND_GAME_CURIOUS,
    "chess_mind_game_choice:philosophical": CHESS_MIND_GAME_PHILOSOPHICAL,
    "chess_mind_game_choice:mocking": CHESS_MIND_GAME_MOCKING,
    "chess_mind_game_choice:vulnerable": CHESS_MIND_GAME_VULNERABLE,
    "chess_mind_game_choice:silent": CHESS_MIND_GAME_SILENT,

    // Chess mechanical actions
    "chess_resign:losing": CHESS_RESIGN_LOSING,
    "chess_resign:winning": CHESS_RESIGN_WINNING,
    chess_draw_offer_made: CHESS_DRAW_OFFER_MADE,
    chess_draw_offer_accepted: CHESS_DRAW_OFFER_ACCEPTED,
    chess_draw_offer_declined: CHESS_DRAW_OFFER_DECLINED,
    chess_hint_used: CHESS_HINT_USED,
    chess_puzzle_retried: CHESS_PUZZLE_RETRIED,

    // Chess climb
    chess_climb_offer_accepted: CHESS_CLIMB_OFFER_ACCEPTED,
    chess_climb_offer_declined: CHESS_CLIMB_OFFER_DECLINED,
    chess_silence_streak: CHESS_SILENCE_STREAK_3,

    // Card game (placeholders, override per choice as content
    // annotations land)
    card_dialog_choice: CARD_DIALOG_CHOICE_DEFAULT,
    card_match_resigned: CARD_MATCH_RESIGNED,
    card_match_concede_accepted: CARD_MATCH_CONCEDE_ACCEPTED,

    // Engineer's Bench first-craft archetypes (Act 2 §6.2)
    "bench_craft:light_first": BENCH_CRAFT_LIGHT_FIRST,
    "bench_craft:dark_first": BENCH_CRAFT_DARK_FIRST,

    // Governance — Vote #0 (surveillance gate) + Architect re-cast
    "vote_zero_eye:confirmed": VOTE_ZERO_EYE_CONFIRMED,
    "vote_zero_eye:looked_away": VOTE_ZERO_EYE_LOOKED_AWAY,
    vote_zero_reaffirmed: VOTE_ZERO_REAFFIRMED,
    vote_zero_recanted: VOTE_ZERO_RECANTED,

    // Governance — generic per-option frames
    "governance_vote:confirm": GOVERNANCE_VOTE_CONFIRM,
    "governance_vote:look_away": GOVERNANCE_VOTE_LOOK_AWAY,
    "governance_vote:neutral": GOVERNANCE_VOTE_NEUTRAL,

    // Rooms / narrative (placeholders)
    room_dialog_choice: ROOM_DIALOG_CHOICE_DEFAULT,
    mission_outcome: MISSION_OUTCOME_DEFAULT,
    narrative_choice: NARRATIVE_CHOICE_DEFAULT,
  });
