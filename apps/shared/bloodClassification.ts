/* ═══════════════════════════════════════════════════════
   BLOOD CLASSIFICATION — skeleton (Testament v2)

   Per the Advocate's Testament (docs/design/DISCHORDIAN_SAGA_
   FULL_GAME_LAYOUT.md §VI), the Crew-Bene-Gesserit Breeding
   Program (Act 3+) classifies every crew member into one of
   seven bloodlines. Each classification yields a different
   amount of Blood Weave crystal per ritual cycle, and chains
   into the Season-2 endgame hook: 5+ generations of PURE
   bloodline unlocks the coordinates of the Advocate's body.

   Wave 2 ships the type union + yield matrix only. The full
   bloodline registry, crew-genetics integration, mission
   generator, and cross-Ark ferry system land in Wave 6.
   ═══════════════════════════════════════════════════════ */

/** Seven canonical blood classifications. Order is the
 *  display order used by the Collector's Work mission card. */
export const BLOOD_CLASSIFICATIONS = [
  "PURE",
  "HYBRID",
  "DEMONIC",
  "ADVOCATE",
  "SAMSARA",
  "NAMED",
  "UNKNOWN",
] as const;

export type BloodClassification = (typeof BLOOD_CLASSIFICATIONS)[number];

/** Blood Weave crystal yield per ritual cycle, by bloodline.
 *  Numbers are per the v2 canon — PURE returns the lowest
 *  density (the bloodline is too clean to refine into
 *  crystal at scale; that's why generations matter), DEMONIC
 *  returns the highest at the cost of corruption pressure. */
export const CRYSTAL_YIELD_PER_CYCLE: Readonly<
  Record<BloodClassification, number>
> = Object.freeze({
  PURE: 1,
  HYBRID: 3,
  DEMONIC: 9,
  ADVOCATE: 12,
  SAMSARA: 6,
  NAMED: 4,
  UNKNOWN: 2,
});

/** Generations of PURE bloodline required before the Season-2
 *  Advocate-body coordinates unlock. Documented in §VI Crew
 *  Bene-Gesserit. */
export const PURE_BLOODLINE_GENERATIONS_FOR_ADVOCATE_BODY = 5;

/** Pure-function helper: total crystal yield across N cycles for
 *  a given bloodline. Useful for Collector's Work mission preview
 *  cards and the breeding-program forecast. */
export function projectCrystalYield(
  classification: BloodClassification,
  cycles: number,
): number {
  if (cycles <= 0) return 0;
  return CRYSTAL_YIELD_PER_CYCLE[classification] * Math.floor(cycles);
}

/** Predicate: does the player's PURE-bloodline generation count
 *  unlock the Season-2 Advocate-body coordinate hook? */
export function isAdvocateBodyUnlocked(
  pureGenerations: number,
): boolean {
  return pureGenerations >= PURE_BLOODLINE_GENERATIONS_FOR_ADVOCATE_BODY;
}
