/* ═══════════════════════════════════════════════════════
   PROPHECY-TAROT UNIFICATION — integrity tests (PR-19)

   Proves the four registries are coherently cross-bound:
   - exactly 7 bindings, acts {1..7} once each
   - the parity gate passes (hard)
   - every Seal / prophecy bookend / Oracle slug / manifold
     reference resolves against its source registry
   - the Dischordian Tarot is the EXISTING Oracle Deck (no
     new cards) — slugs are sourced from PROPHECY_VISIONS
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";

import {
  PROPHECY_TAROT_ACTS,
  TAROT_BRAND,
  oracleCardSlugsForAct,
  getProphecyTarotAct,
} from "./prophecyTarotCanon";
import { SEVEN_SEALS } from "./sevenSeals";
import { getProphecyById } from "./danielCrossProphecies";
import { IDENTITY_MANIFOLDS } from "./identityCollisionCanon";
import { checkProphecyTarotCoverage } from "./_completeness/checks/prophecyTarotCoverage";

describe("prophecy-tarot unification", () => {
  it("has exactly 7 bindings, acts 1..7 once each", () => {
    expect(PROPHECY_TAROT_ACTS.length).toBe(7);
    const acts = PROPHECY_TAROT_ACTS.map((b) => b.act).sort();
    expect(acts).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("the parity gate passes (hard)", () => {
    const r = checkProphecyTarotCoverage();
    expect(r.missing).toEqual([]);
    expect(r.implemented).toBe(r.declared);
  });

  it("every Seal binding resolves with matching num + act", () => {
    for (const b of PROPHECY_TAROT_ACTS) {
      const seal = SEVEN_SEALS.find(
        (s) => s.num === b.sealNum && s.act === b.act,
      );
      expect(seal, `act ${b.act} seal`).toBeDefined();
    }
  });

  it("every prophecy bookend resolves in the Daniel Cross bank", () => {
    for (const b of PROPHECY_TAROT_ACTS) {
      expect(
        getProphecyById(b.prophecyBookend.openingId),
        `act ${b.act} open`,
      ).toBeDefined();
      expect(
        getProphecyById(b.prophecyBookend.closingId),
        `act ${b.act} close`,
      ).toBeDefined();
    }
  });

  it("every act binds at least one Oracle-Tarot slug from PROPHECY_VISIONS", () => {
    for (const b of PROPHECY_TAROT_ACTS) {
      expect(
        oracleCardSlugsForAct(b.act).length,
        `act ${b.act} slugs`,
      ).toBeGreaterThan(0);
    }
  });

  it("the prophet is always the Antiquarian manifold", () => {
    const ok = IDENTITY_MANIFOLDS.some(
      (m) => m.manifoldId === "antiquarian_manifold",
    );
    expect(ok).toBe(true);
    for (const b of PROPHECY_TAROT_ACTS) {
      expect(b.danielCrossManifold).toBe("antiquarian_manifold");
    }
  });

  it("the Seer register follows the cold→warm→confidant band", () => {
    const band = (a: number) =>
      a <= 2 ? "cold" : a <= 5 ? "warm" : "confidant";
    for (const b of PROPHECY_TAROT_ACTS) {
      expect(b.seerRegister, `act ${b.act}`).toBe(band(b.act));
    }
  });

  it("brands the existing 23-card Oracle Deck (no new cards)", () => {
    expect(TAROT_BRAND.cardCount).toBe(23);
    expect(TAROT_BRAND.deckRoute).toBe("/oracle");
    expect(getProphecyTarotAct(7)?.sealNum).toBe(7);
  });
});
