// apps/shared/tradeEmpire/__tests__/declarations.test.ts

import { describe, it, expect } from "vitest";
import {
  DECLARATION_REGISTRY,
  allDeclarationKeys,
  applyDeclarationModifier,
  declarationForHouses,
  getDeclaration,
  selectDeclarationForSeason,
  validateDeclarationRegistry,
} from "../declarations";

describe("Season declarations — phase 2", () => {
  it("registry passes validation", () => {
    expect(validateDeclarationRegistry()).toEqual([]);
  });

  it("every key matches its embedded declarationKey", () => {
    for (const [k, d] of Object.entries(DECLARATION_REGISTRY)) {
      expect(d.declarationKey).toBe(k);
    }
  });

  it("getDeclaration resolves by key", () => {
    expect(getDeclaration("decl.hierarchy.thaloria_heretical")).toBeDefined();
    expect(getDeclaration("does.not.exist")).toBeUndefined();
  });

  it("allDeclarationKeys is unique", () => {
    const keys = allDeclarationKeys();
    expect(keys.length).toBe(new Set(keys).size);
  });
});

describe("selectDeclarationForSeason — round-robin determinism", () => {
  it("returns the same declaration for the same season number", () => {
    const a = selectDeclarationForSeason(3);
    const b = selectDeclarationForSeason(3);
    expect(a.declarationKey).toBe(b.declarationKey);
  });

  it("cycles through every declaration before repeating", () => {
    const keys = allDeclarationKeys();
    const picked = new Set<string>();
    for (let s = 1; s <= keys.length; s++) {
      picked.add(selectDeclarationForSeason(s).declarationKey);
    }
    expect(picked.size).toBe(keys.length);
  });

  it("handles negative season numbers gracefully", () => {
    expect(() => selectDeclarationForSeason(-5)).not.toThrow();
    expect(() => selectDeclarationForSeason(0)).not.toThrow();
  });
});

describe("applyDeclarationModifier", () => {
  const decl = DECLARATION_REGISTRY["decl.hierarchy.thaloria_heretical"];

  it("amplifies positive deltas to the issuing house", () => {
    const out = applyDeclarationModifier(decl, decl.issuingHouse, 10);
    expect(out).toBe(Math.round(10 * decl.rivalryModifier));
  });

  it("amplifies negative deltas to the target house", () => {
    const out = applyDeclarationModifier(decl, decl.targetHouse, -10);
    expect(out).toBe(Math.round(-10 * decl.rivalryModifier));
  });

  it("leaves unrelated houses unchanged", () => {
    const out = applyDeclarationModifier(decl, "nb_civic_engineers", 10);
    expect(out).toBe(10);
  });

  it("does not amplify positive deltas to the target house", () => {
    const out = applyDeclarationModifier(decl, decl.targetHouse, 10);
    expect(out).toBe(10);
  });

  it("does not amplify negative deltas to the issuing house", () => {
    const out = applyDeclarationModifier(decl, decl.issuingHouse, -10);
    expect(out).toBe(-10);
  });

  it("returns base delta unchanged when declaration is null", () => {
    expect(applyDeclarationModifier(null, "nb_authoritys_ledger", 5)).toBe(5);
  });
});

describe("declarationForHouses", () => {
  it("finds the declaration matching a house pair", () => {
    const found = declarationForHouses("hierarchy_severance", "thaloria_council");
    expect(found?.declarationKey).toBe("decl.hierarchy.thaloria_heretical");
  });

  it("returns undefined for an unmatched pair", () => {
    expect(
      declarationForHouses("nb_authoritys_ledger", "antiquarian_casino"),
    ).toBeUndefined();
  });
});
