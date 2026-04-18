/**
 * §5.7 Game Master boss deck — "Every play enters the public record."
 *
 * The Game Master's §5.7 arc runs the public-witness verdict stream:
 * each card play appends a row to PublicWitnessColumn, scaled by
 * `public_delta`. This deck deliberately over-selects the authored
 * `public_delta` cards (Field Medic, Hired Blade, Scrapyard Golem,
 * Dischordian Logic) so the verdict column actually populates during
 * the match — otherwise the player sees a largely empty transcript.
 *
 * Composition is the §5.7 counterpart to §5.6 Programmer: same
 * neutral faction, similar curve shape, differentiated by verdict
 * weight. Dischordian Logic goes in at full 3× despite being a
 * 4-cost "negative verdict" spell — its flavor anchors the Game
 * Master's "prosecutorial" voice.
 *
 * Card ids are the short registry keys.
 */
function x(id: string, n: number): string[] {
  return Array.from({ length: n }, () => id);
}

/** Short registry ids for the 4 authored `public_delta` cards. */
export const GAME_MASTER_PUBLIC_DELTA_IDS = Object.freeze([
  "s1_char_088",  // Field Medic (public_delta)
  "s1_char_090",  // Hired Blade (public_delta)
  "s1_char_087",  // Scrapyard Golem (public_delta)
  "s1_spell_123", // Dischordian Logic (public_delta -1)
]);

/** 39 neutral cards weighted toward `public_delta` authored content. */
export const GAME_MASTER_BOSS_DECK: readonly string[] = Object.freeze([
  // Authored public_delta cards (verdict stream primary drivers).
  ...x("s1_char_088", 3),   // Field Medic
  ...x("s1_char_090", 3),   // Hired Blade
  ...x("s1_char_087", 3),   // Scrapyard Golem
  ...x("s1_spell_123", 3),  // Dischordian Logic
  // Supporting neutral curve (units).
  ...x("s1_char_086", 3),   // Wandering Merchant
  ...x("s1_char_089", 3),   // Courier Sprite
  ...x("s1_char_091", 3),   // Border Scout
  ...x("s1_char_004", 3),   // Ambassador Veron
  ...x("s1_char_092", 3),   // Ruin Stalker
  ...x("s1_char_093", 3),   // Ironclad Veteran
  // Neutral spells / packs for reach.
  ...x("s1_spell_124", 3),  // Ark Emergency Protocol
  ...x("s1_pack_043", 3),   // Void Crystal
  ...x("s1_pack_044", 3),   // Ark Defender
]);

const _gameMasterSize: 39 = GAME_MASTER_BOSS_DECK.length as 39;
void _gameMasterSize;
