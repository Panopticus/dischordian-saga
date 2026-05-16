/* ═══════════════════════════════════════════════════════
   PET ORIGIN CANON — integrity tests (PR-23)

   Proves the last loose thread is bound: all four anchors
   (imprint ontology / species registry / breeding mechanic /
   Risen fate) are declared and resolve, and the parity gate
   passes hard.
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";

import {
  PET_ORIGIN_BINDINGS,
  PET_ORIGIN_PREMISE,
  getPetOriginBinding,
} from "./petOriginCanon";
import { checkPetOriginCoverage } from "./_completeness/checks/petOriginCoverage";

describe("pet origin canon", () => {
  it("declares all four anchors exactly", () => {
    const anchors = PET_ORIGIN_BINDINGS.map((b) => b.anchor).sort();
    expect(anchors).toEqual([
      "breeding_mechanic",
      "imprint_ontology",
      "risen_fate",
      "species_registry",
    ]);
  });

  it("the premise threads the Pets into the First Coming", () => {
    expect(PET_ORIGIN_PREMISE.thesis).toMatch(/imprint/i);
    expect(PET_ORIGIN_PREMISE.spineRole).toMatch(/First Coming/i);
  });

  it("the parity gate passes (hard)", () => {
    const r = checkPetOriginCoverage();
    expect(r.missing).toEqual([]);
    expect(r.implemented).toBe(r.declared);
  });

  it("every binding has a loreSource", () => {
    for (const b of PET_ORIGIN_BINDINGS) {
      expect(b.loreSource.trim().length, b.id).toBeGreaterThan(0);
    }
  });

  it("the Risen-fate binding ties to the Necromancer return", () => {
    const r = getPetOriginBinding("pet_risen_fate");
    expect(r?.loreSource).toMatch(/necromancerReturn/);
    expect(r?.loreSource).toMatch(/theComingCanon/);
  });
});
