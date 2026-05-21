/* ═══════════════════════════════════════════════════════
   WOLF-HUNT — Hero target registry invariants

   The registry self-validates at module load (every
   dossier goes through heroTargetSchema.parse, id
   uniqueness throws). These tests cover the cross-
   registry invariants that the schema alone cannot
   express, plus the canonical-count assertions the
   ship-check parity rows depend on.
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect } from "vitest";
import {
  ALL_HERO_TARGETS,
  HERO_TARGET_FULL_MATRIX_COUNT,
  HERO_TARGET_LIEUTENANT_COUNT,
  CORE_HIERARCHY_LORD_IDS,
  getHeroesByLord,
  getLieutenants,
  getLordCohortSizes,
  heroTargetSchema,
} from "..";

describe("wolfHunt — hero target registry", () => {
  it("registers all 10 lieutenants (one per Hierarchy lord)", () => {
    const lieutenants = getLieutenants();
    expect(lieutenants.length).toBe(HERO_TARGET_LIEUTENANT_COUNT);

    const seenLords = new Set(lieutenants.map((l) => l.corruptorLord));
    expect(seenLords.size).toBe(HERO_TARGET_LIEUTENANT_COUNT);

    for (const lordId of CORE_HIERARCHY_LORD_IDS) {
      const lordLieutenants = lieutenants.filter(
        (l) => l.corruptorLord === lordId,
      );
      expect(
        lordLieutenants.length,
        `lord ${lordId} must have exactly 1 lieutenant`,
      ).toBe(1);
    }
  });

  it("every lieutenant is threatTier 5", () => {
    for (const lt of getLieutenants()) {
      expect(lt.threatTier, `lieutenant ${lt.id}`).toBe(5);
    }
  });

  it("every dossier validates against heroTargetSchema (.strict())", () => {
    for (const def of ALL_HERO_TARGETS) {
      expect(() => heroTargetSchema.parse(def)).not.toThrow();
    }
  });

  it("every dossier has a unique id", () => {
    const ids = ALL_HERO_TARGETS.map((h) => h.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("powerSet entries always match the hero's classKey", () => {
    for (const def of ALL_HERO_TARGETS) {
      for (const power of def.powerSet) {
        expect(
          power.category,
          `${def.id}: power ${power.id} category=${power.category} must equal classKey=${def.classKey}`,
        ).toBe(def.classKey);
      }
    }
  });

  it("getHeroesByLord returns the lord's whole cohort", () => {
    const cohort = getHeroesByLord("mol_garath");
    expect(cohort.length).toBeGreaterThan(0);
    expect(cohort.every((h) => h.corruptorLord === "mol_garath")).toBe(true);
  });

  it("getLordCohortSizes covers all 10 core lords", () => {
    const sizes = getLordCohortSizes();
    for (const lordId of CORE_HIERARCHY_LORD_IDS) {
      expect(sizes[lordId], `lord ${lordId} cohort size`).toBeGreaterThanOrEqual(
        1,
      );
    }
  });

  it("ALL_HERO_TARGETS count never exceeds the canonical matrix size", () => {
    expect(ALL_HERO_TARGETS.length).toBeLessThanOrEqual(
      HERO_TARGET_FULL_MATRIX_COUNT,
    );
  });
});
