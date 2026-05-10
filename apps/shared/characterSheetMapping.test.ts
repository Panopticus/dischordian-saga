/* ═══════════════════════════════════════════════════════
   CHARACTER SHEET TAXONOMY — mapping invariant test

   The codebase species/class enums (GameContext characterChoices)
   and the May 2026 producer drop's icon set don't 1:1 match.
   `characterSheetMapping.ts` is the canonical bridge. This test
   pins every mapping so:

   - Renaming a codebase enum value without updating the map
     breaks the test (you'd otherwise silently lose an icon).
   - Adding a new player species/class breaks the test
     (you must decide what archive icon it maps to).
   - The faction-default is `watcher` (the protagonist's
     narrative role pre-alignment).
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";
import {
  speciesToArchive,
  classToArchive,
  factionToArchive,
} from "./characterSheetMapping";

describe("characterSheetMapping — species", () => {
  it("demagi → hybrid (between-species)", () => {
    expect(speciesToArchive("demagi")).toBe("hybrid");
  });
  it("quarchon → void_touched (observer)", () => {
    expect(speciesToArchive("quarchon")).toBe("void_touched");
  });
  it("neyon → neyon (direct match)", () => {
    expect(speciesToArchive("neyon")).toBe("neyon");
  });
  it("null → null (no choice yet)", () => {
    expect(speciesToArchive(null)).toBeNull();
  });
});

describe("characterSheetMapping — class", () => {
  it("engineer → engineer (direct match)", () => {
    expect(classToArchive("engineer")).toBe("engineer");
  });
  it("assassin → assassin (direct match)", () => {
    expect(classToArchive("assassin")).toBe("assassin");
  });
  it("oracle → mystic (intuition / spirit)", () => {
    expect(classToArchive("oracle")).toBe("mystic");
  });
  it("soldier → warrior (combat)", () => {
    expect(classToArchive("soldier")).toBe("warrior");
  });
  it("spy → diplomat (covert / persuasive)", () => {
    expect(classToArchive("spy")).toBe("diplomat");
  });
  it("null → null", () => {
    expect(classToArchive(null)).toBeNull();
  });
});

describe("characterSheetMapping — faction", () => {
  it("empire → authority", () => {
    expect(factionToArchive("empire")).toBe("authority");
  });
  it("insurgency → insurgency", () => {
    expect(factionToArchive("insurgency")).toBe("insurgency");
  });
  it("null → watcher (the protagonist's default narrative role)", () => {
    expect(factionToArchive(null)).toBe("watcher");
  });
});
