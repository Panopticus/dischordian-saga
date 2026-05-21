/* ═══════════════════════════════════════════════════════
   WOLF-HUNT — Hero target coverage parity check

   Canonical matrix: 10 Hierarchy lords × 25 heroes = 250
   hand-authored hero dossiers. Compares the canonical
   target (HERO_TARGET_FULL_MATRIX_COUNT) against the
   actual registry size.

   Ratcheted: gap > 0 is expected during the C-pivot.A →
   C-pivot.C authoring marathon. The ratchet ceiling only
   tightens — once a dossier is authored, future PRs
   cannot remove it without ship-check failing.

   End state: 250/250 PASS (after the authoring tail
   completes).
   ═══════════════════════════════════════════════════════ */

import {
  ALL_HERO_TARGETS,
  HERO_TARGET_FULL_MATRIX_COUNT,
} from "../../wolfHunt";
import type { RawParityCount } from "../types";

export function checkWolfHuntHeroTargetCoverage(): RawParityCount {
  const implemented = ALL_HERO_TARGETS.length;
  const declared = HERO_TARGET_FULL_MATRIX_COUNT;
  const missing: string[] = [];
  const remaining = declared - implemented;
  if (remaining > 0) {
    missing.push(
      `${remaining} hero dossiers remaining — author under apps/shared/wolfHunt/heroTargets/<lordKey>/<heroId>.ts and register in heroTargets/index.ts.`,
    );
  }
  return {
    declared,
    implemented,
    missing,
  };
}
