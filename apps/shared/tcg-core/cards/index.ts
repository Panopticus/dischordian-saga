/**
 * Card registry barrel.
 *
 * Aggregates all hand-authored CardDefinitions into a single array that
 * buildCardRegistry() consumes at startup.
 *
 * One file per card, one import per file, one export from this barrel.
 * Generated in the long run by `pnpm cards:gen-index`, but hand-maintained
 * until WS2 card authoring reaches the volume where that matters.
 *
 * Ordering is irrelevant — the registry is keyed by card id, and card
 * authoring is data-only (no load-order dependencies).
 */
import type { CardDefinition } from "../index";

/* ─── Antiquarian faction ─── */
import { cardDef as s1_char_018 } from "./definitions/antiquarian/s1_char_018_the_antiquarian";

/* ─── Architect faction ─── */
import { cardDef as s1_char_019 } from "./definitions/architect/s1_char_019_the_architect";
import { cardDef as s1_char_039 } from "./definitions/architect/s1_char_039_the_necromancer";

/* ─── Dreamer faction ─── */
import { cardDef as s1_char_025 } from "./definitions/dreamer/s1_char_025_the_dreamer";
import { cardDef as s1_char_045 } from "./definitions/dreamer/s1_char_045_the_resurrectionist";
import { cardDef as s1_song_082 } from "./definitions/dreamer/s1_song_082_top_floor_door";

/* ─── Insurgency faction ─── */
import { cardDef as s1_char_002 } from "./definitions/insurgency/s1_char_002_agent_zero";
import { cardDef as s1_char_010 } from "./definitions/insurgency/s1_char_010_iron_lion";
import { cardDef as s1_song_091 } from "./definitions/insurgency/s1_song_091_i_love_war";

/* ─── New Babylon faction ─── */
import { cardDef as s1_char_066 } from "./definitions/new_babylon/s1_char_066_fenra_the_moon_tyrant";
import { cardDef as s1_char_061 } from "./definitions/new_babylon/s1_char_061_vexahlia_the_taskmaster";

/* ─── Thought Virus faction ─── */
import { cardDef as s1_char_049 } from "./definitions/thought_virus/s1_char_049_the_source";

/* ─── Neutral spells ─── */
import { cardDef as s1_song_061 } from "./definitions/neutral/s1_song_061_the_enigmas_lament";
import { cardDef as s1_song_062 } from "./definitions/neutral/s1_song_062_the_two_witnesses";
import { cardDef as s1_song_063 } from "./definitions/neutral/s1_song_063_building_the_architect";
import { cardDef as s1_song_070 } from "./definitions/neutral/s1_song_070_traces_of_something_spiritual";
import { cardDef as s1_song_079 } from "./definitions/neutral/s1_song_079_shades_of_grey";
import { cardDef as s1_song_084 } from "./definitions/neutral/s1_song_084_judgment_day";

/* ─── Tokens ─── */
import { cardDef as token_wolf_2_2 } from "./tokens/token_wolf_2_2";

/**
 * Frozen array of every authored card + token. Pass to buildCardRegistry().
 *
 * 18 Season 1 cards + 1 token = 19 definitions.
 * As WS2 continues, this list grows to the full 216 (plus tokens).
 */
export const ALL_CARD_DEFINITIONS: readonly CardDefinition[] = Object.freeze([
  // Antiquarian
  s1_char_018,
  // Architect
  s1_char_019,
  s1_char_039,
  // Dreamer
  s1_char_025,
  s1_char_045,
  s1_song_082,
  // Insurgency
  s1_char_002,
  s1_char_010,
  s1_song_091,
  // New Babylon
  s1_char_066,
  s1_char_061,
  // Thought Virus
  s1_char_049,
  // Neutral spells
  s1_song_061,
  s1_song_062,
  s1_song_063,
  s1_song_070,
  s1_song_079,
  s1_song_084,
  // Tokens
  token_wolf_2_2,
]);
