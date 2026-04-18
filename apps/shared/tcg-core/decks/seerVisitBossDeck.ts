/**
 * §4.9 Seer prophecy boss deck — "She will not raise her staff today."
 *
 * The Seer (gen_seer, 3/25) does not play from hand — `forceSeerPlay`
 * in engine/seerProphecy.ts samples this deck via
 * `sampleSeerFutureCard` (SEER_FUTURE_LOOKAHEAD_WINDOW = 5) and
 * force-plays the sampled card as a "future turn" on side 1. Because
 * the player sees each sampled card twice (once as the pending
 * future, once as the actual play), deck composition should be
 * *thematically coherent* — a messy deck makes the prophecy feel
 * arbitrary.
 *
 * Composition leans on "seeing-ahead" flavor (Border Scout, Ruin
 * Stalker — scouts and survey units) plus the Dimensional Rift pack
 * to echo the "ripping through time" visual. The winnable-path card
 * (burnt_card_placeholder) is NOT in the deck — it only reaches the
 * player's hand via the Acts 2+ unlock route (spec §3.3).
 *
 * Card ids are the short registry keys.
 */
function x(id: string, n: number): string[] {
  return Array.from({ length: n }, () => id);
}

/** 39 neutral cards composed with a scout / oracle thematic lean. */
export const SEER_VISIT_BOSS_DECK: readonly string[] = Object.freeze([
  // Low-curve scouts (oracular leanings — cards that "see ahead").
  ...x("s1_char_091", 3),   // Border Scout
  ...x("s1_char_089", 3),   // Courier Sprite
  ...x("s1_char_086", 3),   // Wandering Merchant
  ...x("s1_char_088", 3),   // Field Medic
  // Mid-curve neutral bodies.
  ...x("s1_char_087", 3),   // Scrapyard Golem
  ...x("s1_char_090", 3),   // Hired Blade
  ...x("s1_char_004", 3),   // Ambassador Veron
  ...x("s1_char_092", 3),   // Ruin Stalker
  ...x("s1_char_093", 3),   // Ironclad Veteran
  // Neutral spells (prophecy-coded — future manipulation).
  ...x("s1_spell_123", 3),  // Dischordian Logic
  ...x("s1_spell_124", 3),  // Ark Emergency Protocol
  ...x("s1_pack_046", 3),   // Dimensional Rift — "ripping through time"
  ...x("s1_pack_043", 3),   // Void Crystal
]);

const _seerSize: 39 = SEER_VISIT_BOSS_DECK.length as 39;
void _seerSize;
