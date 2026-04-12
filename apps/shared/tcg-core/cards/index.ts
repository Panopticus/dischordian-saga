/**
 * Card registry barrel — 34 Season 1 cards + 1 token = 35 definitions.
 */
import type { CardDefinition } from "../index";

/* ─── Antiquarian ─── */
import { cardDef as s1_char_018 } from "./definitions/antiquarian/s1_char_018_the_antiquarian";

/* ─── Architect ─── */
import { cardDef as s1_char_019 } from "./definitions/architect/s1_char_019_the_architect";
import { cardDef as s1_char_039 } from "./definitions/architect/s1_char_039_the_necromancer";
import { cardDef as s1_char_006 } from "./definitions/architect/s1_char_006_dr_lyra_vox";
import { cardDef as s1_char_007 } from "./definitions/architect/s1_char_007_general_alarik";
import { cardDef as s1_char_008 } from "./definitions/architect/s1_char_008_general_binath";
import { cardDef as s1_char_009 } from "./definitions/architect/s1_char_009_general_prometheus";

/* ─── Dreamer ─── */
import { cardDef as s1_char_025 } from "./definitions/dreamer/s1_char_025_the_dreamer";
import { cardDef as s1_char_045 } from "./definitions/dreamer/s1_char_045_the_resurrectionist";
import { cardDef as s1_char_005 } from "./definitions/dreamer/s1_char_005_destiny";
import { cardDef as s1_song_082 } from "./definitions/dreamer/s1_song_082_top_floor_door";

/* ─── Insurgency ─── */
import { cardDef as s1_char_002 } from "./definitions/insurgency/s1_char_002_agent_zero";
import { cardDef as s1_char_010 } from "./definitions/insurgency/s1_char_010_iron_lion";
import { cardDef as s1_char_011 } from "./definitions/insurgency/s1_char_011_jericho_jones";
import { cardDef as s1_char_012 } from "./definitions/insurgency/s1_char_012_kael";
import { cardDef as s1_song_091 } from "./definitions/insurgency/s1_song_091_i_love_war";

/* ─── New Babylon ─── */
import { cardDef as s1_char_001 } from "./definitions/new_babylon/s1_char_001_adjudicar_locke";
import { cardDef as s1_char_003 } from "./definitions/new_babylon/s1_char_003_akai_shi";
import { cardDef as s1_char_066 } from "./definitions/new_babylon/s1_char_066_fenra_the_moon_tyrant";
import { cardDef as s1_char_061 } from "./definitions/new_babylon/s1_char_061_vexahlia_the_taskmaster";

/* ─── Thought Virus ─── */
import { cardDef as s1_char_049 } from "./definitions/thought_virus/s1_char_049_the_source";

/* ─── Neutral ─── */
import { cardDef as s1_char_004 } from "./definitions/neutral/s1_char_004_ambassador_veron";
import { cardDef as s1_song_059 } from "./definitions/neutral/s1_song_059_lip_service";
import { cardDef as s1_song_060 } from "./definitions/neutral/s1_song_060_nonos";
import { cardDef as s1_song_061 } from "./definitions/neutral/s1_song_061_the_enigmas_lament";
import { cardDef as s1_song_062 } from "./definitions/neutral/s1_song_062_the_two_witnesses";
import { cardDef as s1_song_063 } from "./definitions/neutral/s1_song_063_building_the_architect";
import { cardDef as s1_song_064 } from "./definitions/neutral/s1_song_064_dischordian_logic";
import { cardDef as s1_song_065 } from "./definitions/neutral/s1_song_065_sixth_sense";
import { cardDef as s1_song_066 } from "./definitions/neutral/s1_song_066_the_book_of_daniel";
import { cardDef as s1_song_070 } from "./definitions/neutral/s1_song_070_traces_of_something_spiritual";
import { cardDef as s1_song_079 } from "./definitions/neutral/s1_song_079_shades_of_grey";
import { cardDef as s1_song_084 } from "./definitions/neutral/s1_song_084_judgment_day";

/* ─── Tokens ─── */
import { cardDef as token_wolf_2_2 } from "./tokens/token_wolf_2_2";

export const ALL_CARD_DEFINITIONS: readonly CardDefinition[] = Object.freeze([
  s1_char_018, s1_char_019, s1_char_039, s1_char_006, s1_char_007,
  s1_char_008, s1_char_009, s1_char_025, s1_char_045, s1_char_005,
  s1_song_082, s1_char_002, s1_char_010, s1_char_011, s1_char_012,
  s1_song_091, s1_char_001, s1_char_003, s1_char_066, s1_char_061,
  s1_char_049, s1_char_004, s1_song_059, s1_song_060, s1_song_061,
  s1_song_062, s1_song_063, s1_song_064, s1_song_065, s1_song_066,
  s1_song_070, s1_song_079, s1_song_084, token_wolf_2_2,
]);
