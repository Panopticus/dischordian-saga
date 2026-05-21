/* ═══════════════════════════════════════════════════════
   WOLF-HUNT — Hero target registry

   Single source of truth for the 250-hero Wolf-Anara
   hunt matrix. Every dossier is imported here and
   validated through heroTargetSchema at module load.

   Authoring cadence: the registry ships partial and
   ratchets toward 250. The ship-check parity row
   `wolfHunt.hero_target_coverage` enforces non-regression;
   the `wolfHunt.boss_lieutenant_coverage` row enforces
   hard parity 10/10 on the lieutenant subset.

   File layout: dossiers live under
   `<lordKey>/<heroId>.ts`, one file per hero. Adding a
   hero is: (1) author the dossier file, (2) import it
   here, (3) spread it into ALL_HERO_TARGETS.
   ═══════════════════════════════════════════════════════ */

import type { HeroTarget } from "../types/HeroTarget";
import { CORE_HIERARCHY_LORD_IDS } from "../types/HeroTarget";
import type { CoreHierarchyLordId } from "../types/HeroTarget";
import { heroTargetSchema } from "./schema";

// ─── Lieutenants (C-pivot.A.9 — one per lord) ────────────
import { GENERAL_CAEDRYN_VOLK } from "./mol_garath/general_caedryn_volk";
import { AUDITOR_MIREILLE_YOM } from "./xeth_raal/auditor_mireille_yom";
import { MARSHAL_ORIN_THACE } from "./riri_ahlia/marshal_orin_thace";
import { PRAXIS_THREE_MIRA_VOLL } from "./zyr_koth/praxis_three_mira_voll";
import { LISTENER_EYRA_SHEEL } from "./ith_rael/listener_eyra_sheel";
import { PERSUADER_KAL_DEMIR } from "./syl_vex/persuader_kal_demir";
import { REAPER_NYX_SABLE } from "./drael_mon/reaper_nyx_sable";
import { BLOODSPEAKER_TESSEN_RAHL } from "./varkul/bloodspeaker_tessen_rahl";
import { MOONSCRIBE_ILARA_PELL } from "./fenra/moonscribe_ilara_pell";
import { ARCHITECT_RIVEN_SOLACE } from "./mol_vereth/architect_riven_solace";

const HERO_TARGET_DEFS: ReadonlyArray<HeroTarget> = [
  GENERAL_CAEDRYN_VOLK,
  AUDITOR_MIREILLE_YOM,
  MARSHAL_ORIN_THACE,
  PRAXIS_THREE_MIRA_VOLL,
  LISTENER_EYRA_SHEEL,
  PERSUADER_KAL_DEMIR,
  REAPER_NYX_SABLE,
  BLOODSPEAKER_TESSEN_RAHL,
  MOONSCRIBE_ILARA_PELL,
  ARCHITECT_RIVEN_SOLACE,
];

// Validate every dossier at module load. Throws on first failure.
for (const def of HERO_TARGET_DEFS) {
  heroTargetSchema.parse(def);
}

// Enforce id uniqueness across the registry.
{
  const seen = new Set<string>();
  for (const def of HERO_TARGET_DEFS) {
    if (seen.has(def.id)) {
      throw new Error(
        `wolfHunt heroTargets: duplicate id "${def.id}" — every dossier must have a unique id.`,
      );
    }
    seen.add(def.id);
  }
}

/** All hero targets currently shipped, in registration order. */
export const ALL_HERO_TARGETS: ReadonlyArray<HeroTarget> = HERO_TARGET_DEFS;

/** Canonical full count of the hero matrix (10 lords × 25 heroes). */
export const HERO_TARGET_FULL_MATRIX_COUNT = 250;

/** Canonical lieutenant count (one per lord). */
export const HERO_TARGET_LIEUTENANT_COUNT = 10;

/** Look up a hero target by id. Throws if not found. */
export function getHeroTarget(id: string): HeroTarget {
  const found = ALL_HERO_TARGETS.find((h) => h.id === id);
  if (!found) {
    throw new Error(`wolfHunt: unknown hero target id "${id}"`);
  }
  return found;
}

/** Return every lieutenant in registration order. */
export function getLieutenants(): ReadonlyArray<HeroTarget> {
  return ALL_HERO_TARGETS.filter((h) => h.isBossLieutenant);
}

/** Return every hero corrupted by a given lord. */
export function getHeroesByLord(
  lordId: CoreHierarchyLordId,
): ReadonlyArray<HeroTarget> {
  return ALL_HERO_TARGETS.filter((h) => h.corruptorLord === lordId);
}

/** Map of lord id → count of heroes registered under that lord. */
export function getLordCohortSizes(): Readonly<Record<CoreHierarchyLordId, number>> {
  const out = Object.fromEntries(
    CORE_HIERARCHY_LORD_IDS.map((id) => [id, 0]),
  ) as Record<CoreHierarchyLordId, number>;
  for (const h of ALL_HERO_TARGETS) {
    out[h.corruptorLord] += 1;
  }
  return out;
}
