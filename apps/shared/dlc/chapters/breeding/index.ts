/* Breeding Program — Crew-Bene-Gesserit DLC chapter ladder.
 *
 * Three chapters chain in lore order:
 *   01 The Bene-Gesserit Manifest        Act 3 unlock + 7 bloodlines
 *   02 The First Generation              1 PURE generation logged
 *   03 The Coordinates                   5 PURE generations + spine
 *                                        complete → S2 Advocate-body
 *
 * Mascoteers tier (the Act-1 tutorial) is documented in the
 * BreedingProgramTier type but ships no DLC chapters — its content
 * loop lives directly in narrativeActs.ts. */

import type { DlcChapter } from "../../types";

import { DLC_BREEDING_01_CREW_UNLOCKS } from "./crew_unlocks";
import { DLC_BREEDING_02_FIRST_PURE_CYCLE } from "./first_pure_cycle";
import { DLC_BREEDING_03_ADVOCATE_BODY_COORDINATES } from "./advocate_body_coordinates";

export {
  DLC_BREEDING_01_CREW_UNLOCKS,
  DLC_BREEDING_02_FIRST_PURE_CYCLE,
  DLC_BREEDING_03_ADVOCATE_BODY_COORDINATES,
};

export const ALL_BREEDING_DLC_CHAPTERS: readonly DlcChapter[] = Object.freeze([
  DLC_BREEDING_01_CREW_UNLOCKS,
  DLC_BREEDING_02_FIRST_PURE_CYCLE,
  DLC_BREEDING_03_ADVOCATE_BODY_COORDINATES,
] as DlcChapter[]);
