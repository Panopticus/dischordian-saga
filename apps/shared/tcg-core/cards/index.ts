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
import { cardDef as s1_char_018 } from "./definitions/antiquarian/s1_char_018_the_antiquarian";
import { cardDef as s1_char_002 } from "./definitions/insurgency/s1_char_002_agent_zero";
import { cardDef as s1_song_061 } from "./definitions/neutral/s1_song_061_the_enigmas_lament";

/**
 * Frozen array of every authored card. Pass to buildCardRegistry().
 *
 * As WS2 lands more cards, this list grows to the full 216 (plus tokens).
 */
export const ALL_CARD_DEFINITIONS: readonly CardDefinition[] = Object.freeze([
  s1_char_018,
  s1_char_002,
  s1_song_061,
]);
