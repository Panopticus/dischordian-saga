/* ═══════════════════════════════════════════════════════
   WOLF-HUNT — Hero power-set node

   Each hero target carries a small (3-5 node) powerSet
   sampled from their classKey's corrupted-power library.
   Power nodes are referenced by the Antiquarian briefer
   when composing tells/exploit hints and by the mission
   reducer when scoring choice-vs-power matchups during
   approach + engagement steps.

   Power nodes are typed unions — each has a category
   (the class library it belongs to) and a stable id.
   The runtime library lives at
   `apps/shared/wolfHunt/powerLibrary.ts` (added in a
   follow-up commit when the mission reducer lands).
   ═══════════════════════════════════════════════════════ */

import type { HeroClass } from "./HeroClass";

export interface PowerNode {
  /** Stable power id — must resolve in the power library. */
  id: string;
  /** Owning class library. Mirrors the parent HeroTarget.classKey. */
  category: HeroClass;
  /**
   * Severity tier 1-3. Higher severity = the power is harder
   * to neutralize via approach choices and more lethal during
   * engagement. A hero's total severity informs threatTier.
   */
  severity: 1 | 2 | 3;
}
