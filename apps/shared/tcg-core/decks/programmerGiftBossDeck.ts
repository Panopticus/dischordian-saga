/**
 * §5.6 Programmer Gift boss deck — "Two honest turns, then the gift."
 *
 * Per spec §5.6, the Programmer opens with two honest plays and the
 * gift modal surfaces at turn 3. The match can resolve by accept /
 * decline regardless of board, so deck power-level is deliberately
 * moderate — a "reasonable neutral curve" that would play out as a
 * close honest match without the gift mechanic.
 *
 * Composition differs from §5.7 Game Master by leaning toward
 * stability cards (Field Medic for sustain, Ambassador Veron for
 * tempo, Ark Emergency Protocol for board resets). The signature
 * `public_delta` spell (Dischordian Logic) is omitted here because
 * the Programmer is not on the public-witness verdict stream.
 *
 * Card ids are the short registry keys.
 */
function x(id: string, n: number): string[] {
  return Array.from({ length: n }, () => id);
}

/** 39 neutral cards composed as a stability-leaning tempo deck. */
export const PROGRAMMER_GIFT_BOSS_DECK: readonly string[] = Object.freeze([
  // Low-curve (cost 2–3).
  ...x("s1_char_086", 3),   // Wandering Merchant
  ...x("s1_char_089", 3),   // Courier Sprite
  ...x("s1_char_088", 3),   // Field Medic
  ...x("s1_char_091", 3),   // Border Scout
  // Mid-curve (cost 3–5).
  ...x("s1_char_090", 3),   // Hired Blade
  ...x("s1_char_004", 3),   // Ambassador Veron
  ...x("s1_char_087", 3),   // Scrapyard Golem
  ...x("s1_char_093", 3),   // Ironclad Veteran
  ...x("s1_char_092", 3),   // Ruin Stalker
  // Neutral spells / packs for interaction and stability.
  ...x("s1_spell_124", 3),  // Ark Emergency Protocol
  ...x("s1_pack_043", 3),   // Void Crystal
  ...x("s1_pack_044", 3),   // Ark Defender
  ...x("s1_pack_045", 3),   // Universal Adapter
]);

const _programmerSize: 39 = PROGRAMMER_GIFT_BOSS_DECK.length as 39;
void _programmerSize;
