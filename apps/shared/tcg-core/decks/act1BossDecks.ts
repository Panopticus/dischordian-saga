/**
 * Act 1 boss deck definitions — Season One.
 *
 * Each boss needs exactly 39 card definition ids (the general is
 * separate, defined in chapters.ts). This file is the single place
 * to curate boss decks from the existing 610-card pool.
 *
 * Migration path:
 *   1. This file ships with placeholder() decks (auto-generated ids)
 *   2. Designers replace each placeholder() call with a curated list
 *      of real card def ids from the registry
 *   3. The validation test (act1Readiness.test.ts) catches any boss
 *      whose deck still has unresolved placeholder ids
 *
 * Deck rules: 39 cards. Max 3 copies of any card. Cards must belong
 * to the boss's faction or be neutral.
 */

const BOSS_DECK_SIZE = 39;

function placeholder(prefix: string): readonly string[] {
  return Array.from({ length: BOSS_DECK_SIZE }, (_, i) => `${prefix}_${i}`);
}

export function isPlaceholderDeckId(id: string): boolean {
  return /_\d+$/.test(id) && id.startsWith("boss_");
}

export const ACT_1_BOSS_DECKS = {
  ch1: placeholder("boss_ch1"),
  ch2: placeholder("boss_ch2"),
  ch3a: placeholder("boss_ch3a"),
  ch3b: placeholder("boss_ch3b"),
  ch4: placeholder("boss_ch4"),
  ch5: placeholder("boss_ch5"),
  ch6: placeholder("boss_ch6"),
  ch7: placeholder("boss_ch7"),
  ch8: placeholder("boss_ch8"),
  ch9a: placeholder("boss_ch9a"),
  ch9b: placeholder("boss_ch9b"),
  ch10: placeholder("boss_ch10"),
  ch11: placeholder("boss_ch11"),
  ch12: placeholder("boss_ch12"),
  warlord_zero_first: placeholder("boss_warlord_zero_first"),
  authority_trial: placeholder("boss_authority_trial"),
} as const;

export type Act1BossId = keyof typeof ACT_1_BOSS_DECKS;

export function getBossDeck(bossId: Act1BossId): readonly string[] {
  return ACT_1_BOSS_DECKS[bossId];
}

export function isBossDeckCurated(bossId: Act1BossId): boolean {
  return !ACT_1_BOSS_DECKS[bossId].some(isPlaceholderDeckId);
}
