/**
 * Player Psychological Profile — game-wide style profile.
 *
 * Seven axes that describe HOW the player plays, not whether they
 * are good or evil. The existing moral meters track ethics; this
 * tracks personality. The two systems are intentionally orthogonal
 * — a merciful player can be predatory in style, a ruthless player
 * can be playful in tone.
 *
 * Every meaningful choice across the game writes a `ProfileDelta`
 * via `apps/server/routers/playerProfile.ts.recordEvent`. The
 * `playerProfileSources.ts` registry holds the standard delta for
 * each known source id so dialog writers don't reinvent weights.
 *
 * The profile is consumed by:
 *   1. The Game Master's mind-game replies (chess, Workstream 5)
 *   2. Tutorial pacing (Conformity / Curiosity adjustments)
 *   3. NPCs across the game (Phase F seeded lines via getProfileBlurb)
 *
 * The "I see you" reveals — Tier 1/2/3 of the chess climb, plus the
 * Gate 7 outro closer — read the profile back to the player as
 * dialog. That is the moment the player learns the game has been
 * watching.
 */

export const PROFILE_AXES = [
  "aggression",
  "mercy",
  "curiosity",
  "conformity",
  "vigilance",
  "vulnerability",
  "wit",
] as const;

export type ProfileAxis = (typeof PROFILE_AXES)[number];

/**
 * Per-axis poles used for narrative blurb generation. The negative
 * pole is the descriptor at -100; the positive pole is the
 * descriptor at +100; 0 is neutral.
 */
export const AXIS_POLES: Readonly<Record<
  ProfileAxis,
  { negative: string; positive: string; neutral: string }
>> = Object.freeze({
  aggression: {
    negative: "pacifist",
    positive: "predator",
    neutral: "measured",
  },
  mercy: {
    negative: "ruthless",
    positive: "merciful",
    neutral: "even-handed",
  },
  curiosity: {
    negative: "dismissive",
    positive: "inquisitive",
    neutral: "selective",
  },
  conformity: {
    negative: "iconoclast",
    positive: "conformist",
    neutral: "pragmatic",
  },
  vigilance: {
    negative: "trusting",
    positive: "suspicious",
    neutral: "alert",
  },
  vulnerability: {
    negative: "guarded",
    positive: "open",
    neutral: "discerning",
  },
  wit: {
    negative: "stoic",
    positive: "playful",
    neutral: "deliberate",
  },
});

/** A single axis adjustment. Positive values move toward the
 *  positive pole; negative values move toward the negative pole. */
export type ProfileDelta = Partial<Record<ProfileAxis, number>>;

/** A complete profile snapshot. All axes are -100..+100 floats.
 *  `eventCount` is the number of events that have been folded in
 *  (not all events apply to all axes — sparse deltas are fine). */
export interface PlayerProfile {
  aggression: number;
  mercy: number;
  curiosity: number;
  conformity: number;
  vigilance: number;
  vulnerability: number;
  wit: number;
  eventCount: number;
  lastUpdatedAt: Date | null;
}

/** A neutral (no-data) profile. Returned when a user has never
 *  triggered a profile event. */
export function emptyProfile(): PlayerProfile {
  return {
    aggression: 0,
    mercy: 0,
    curiosity: 0,
    conformity: 0,
    vigilance: 0,
    vulnerability: 0,
    wit: 0,
    eventCount: 0,
    lastUpdatedAt: null,
  };
}

/** Apply a delta to a profile, clamping every axis to [-100, 100].
 *  Returns a NEW profile object — never mutates the input. The
 *  `eventCount` is incremented even if the delta is empty (the
 *  event still happened, even if it carried no axis weight). */
export function applyDelta(
  profile: PlayerProfile,
  delta: ProfileDelta,
  at: Date = new Date(),
): PlayerProfile {
  const next: PlayerProfile = { ...profile };
  for (const axis of PROFILE_AXES) {
    const d = delta[axis];
    if (typeof d !== "number" || !Number.isFinite(d)) continue;
    const raw = next[axis] + d;
    next[axis] = Math.max(-100, Math.min(100, raw));
  }
  next.eventCount += 1;
  next.lastUpdatedAt = at;
  return next;
}

/** Bucket an axis value into one of seven labels for narration:
 *    -100..-67  → strong negative
 *    -66 ..-34  → moderate negative
 *    -33 ..-11  → mild negative
 *    -10 .. 10  → neutral
 *     11 .. 33  → mild positive
 *     34 .. 66  → moderate positive
 *     67 ..100  → strong positive
 */
export type ProfileMagnitude =
  | "strong_negative"
  | "moderate_negative"
  | "mild_negative"
  | "neutral"
  | "mild_positive"
  | "moderate_positive"
  | "strong_positive";

export function magnitudeOf(value: number): ProfileMagnitude {
  if (value <= -67) return "strong_negative";
  if (value <= -34) return "moderate_negative";
  if (value <= -11) return "mild_negative";
  if (value <= 10 && value >= -10) return "neutral";
  if (value <= 33) return "mild_positive";
  if (value <= 66) return "moderate_positive";
  return "strong_positive";
}

/** A short narrative descriptor for an axis at its current value.
 *  Returns the appropriate pole (positive/negative/neutral) noun
 *  with an intensity adverb. Used by NPC dialog writers via
 *  `getProfileBlurb(axis, profile)`.
 *
 *  Example: getProfileBlurb("aggression", { aggression: 72, ... })
 *           → "fiercely predator" */
export function getProfileBlurb(
  axis: ProfileAxis,
  profile: PlayerProfile,
): string {
  const value = profile[axis];
  const mag = magnitudeOf(value);
  const poles = AXIS_POLES[axis];

  switch (mag) {
    case "strong_negative":
      return `fiercely ${poles.negative}`;
    case "moderate_negative":
      return `clearly ${poles.negative}`;
    case "mild_negative":
      return `quietly ${poles.negative}`;
    case "neutral":
      return poles.neutral;
    case "mild_positive":
      return `quietly ${poles.positive}`;
    case "moderate_positive":
      return `clearly ${poles.positive}`;
    case "strong_positive":
      return `fiercely ${poles.positive}`;
  }
}

/** Serialize a profile into the seven-sentence portrait the Game
 *  Master reads aloud at the Tier 3 reveal. Each sentence describes
 *  one axis using the player's current value. The order is fixed
 *  for narrative cadence: aggression → mercy → curiosity →
 *  conformity → vigilance → vulnerability → wit. */
export function buildPortraitSentences(profile: PlayerProfile): string[] {
  return PROFILE_AXES.map((axis) => {
    const blurb = getProfileBlurb(axis, profile);
    const noun = (() => {
      switch (axis) {
        case "aggression":
          return "On the board you are";
        case "mercy":
          return "When the win is yours you are";
        case "curiosity":
          return "When the world offers a question you are";
        case "conformity":
          return "When a teacher offers a path you are";
        case "vigilance":
          return "When a stranger speaks you are";
        case "vulnerability":
          return "When a friend asks you are";
        case "wit":
          return "When the silence opens you are";
      }
    })();
    return `${noun} ${blurb}.`;
  });
}

/** Source labels for `player_profile_events.source`. Add new
 *  sources here as new systems start writing to the profile. */
export const PROFILE_EVENT_SOURCES = [
  "chess_mind_game_choice",
  "chess_resign",
  "chess_draw_offer_made",
  "chess_draw_offer_accepted",
  "chess_draw_offer_declined",
  "chess_hint_used",
  "chess_puzzle_retried",
  "chess_climb_offer_accepted",
  "chess_climb_offer_declined",
  "chess_silence_streak",
  "card_dialog_choice",
  "card_match_resigned",
  "card_match_concede_accepted",
  "room_dialog_choice",
  "mission_outcome",
  "narrative_choice",
] as const;

export type ProfileEventSource = (typeof PROFILE_EVENT_SOURCES)[number];
