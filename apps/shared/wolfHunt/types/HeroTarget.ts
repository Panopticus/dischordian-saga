/* ═══════════════════════════════════════════════════════
   WOLF-HUNT — Hero target dossier

   Each of the 250 corrupted-League heroes the Antiquarian
   contracts the Wolf to hunt is described by one
   HeroTarget dossier. Dossiers are hand-authored, one
   file per hero, under
   `apps/shared/wolfHunt/heroTargets/<lordKey>/<heroId>.ts`,
   and registered into ALL_HERO_TARGETS via the barrel.

   The matrix is 10 Hierarchy lords × 25 heroes. Exactly
   one hero per lord is `isBossLieutenant: true` — those
   10 heroes trigger the boss-fight card-game reducer at
   the mission's engagement step; the other 240 are
   text-only choice missions.

   Validation: every dossier passes through
   heroTargetSchema (.strict() Zod) at registry build.
   Typos in field names blow up loudly.
   ═══════════════════════════════════════════════════════ */

import type { HierarchyLordId } from "../../hierarchyCanon";
import type { HeroClass } from "./HeroClass";
import type { CrucibleRegion } from "./CrucibleRegion";
import type { PowerNode } from "./PowerNode";

/** Restricted to the 10 core Hierarchy lords (inCoreTen: true). Ozhul'Vana is excluded. */
export type CoreHierarchyLordId = Exclude<HierarchyLordId, "ozhul_vana">;

export const CORE_HIERARCHY_LORD_IDS: readonly CoreHierarchyLordId[] = [
  "mol_garath",
  "xeth_raal",
  "riri_ahlia",
  "zyr_koth",
  "ith_rael",
  "syl_vex",
  "drael_mon",
  "varkul",
  "fenra",
  "mol_vereth",
] as const;

export type ThreatTier = 1 | 2 | 3 | 4 | 5;

export interface HeroTarget {
  /** Stable hero id — kebab/snake-mixed canonical form. Must be unique across ALL_HERO_TARGETS. */
  id: string;
  /** Display name shown in the Antiquarian's dossier. */
  name: string;
  /** Five-way class taxonomy — drives powerSet library + Antiquarian's counter-tactic hints. */
  classKey: HeroClass;
  /** The Hierarchy lord whose corruption holds this hero. One of the 10 core lords. */
  corruptorLord: CoreHierarchyLordId;
  /** Threat tier 1-5. Lieutenants are tier 5 by canon. */
  threatTier: ThreatTier;
  /**
   * Exactly 10 heroes across the registry have this true (one per lord).
   * Boss lieutenants enter the card-game reducer at the engagement step.
   */
  isBossLieutenant: boolean;
  /** 3-5 corrupted-class powers drawn from the powerLibrary. */
  powerSet: ReadonlyArray<PowerNode>;
  /** Exploit hints — short narrative phrases the Wolf can act on during approach. */
  tells: ReadonlyArray<string>;
  /** Where in the Crucible this hero lairs. */
  lairLocation: CrucibleRegion;
  /**
   * 2-4 brief authoring seeds the Antiquarian briefer composes into
   * the prose briefing. Keep terse — the briefer expands them with
   * voice + structure. Example: "served the League's medic corps
   * before Drael'Mon harvested her."
   */
  briefingHints: ReadonlyArray<string>;
}
