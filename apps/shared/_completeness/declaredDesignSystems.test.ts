/**
 * Self-test for the declared-design-systems registry.
 *
 * Three invariants:
 *
 * 1. The registry is well-formed: every entry has an id, docPath,
 *    non-empty symbol list, and unique id; every symbol has the
 *    fields its kind requires.
 *
 * 2. The check this registry powers
 *    ({@link checkDeclaredSubsystemRuntime}) declares exactly one row
 *    per expected symbol — so adding a new symbol always grows the
 *    declared count by 1 and adding a new system grows it by the
 *    symbol count of that system.
 *
 * 3. The audit-canonical "design exists, runtime doesn't" examples
 *    are still tracked: soul_stones, pet_breeding,
 *    living_character_sheet, trade_empire_coda each appear in the
 *    registry, so a future refactor that drops one fails this test
 *    rather than silently removing the gap.
 */
import { describe, it, expect } from "vitest";
import {
  DECLARED_DESIGN_SYSTEMS,
  countDeclaredSymbols,
} from "./declaredDesignSystems";
import { checkDeclaredSubsystemRuntime } from "./checks/declaredSubsystemRuntime";

describe("DECLARED_DESIGN_SYSTEMS registry", () => {
  it("entries are well-formed and unique", () => {
    const seen = new Set<string>();
    for (const sys of DECLARED_DESIGN_SYSTEMS) {
      expect(sys.id, "id missing").toBeTruthy();
      expect(seen.has(sys.id), `duplicate id ${sys.id}`).toBe(false);
      seen.add(sys.id);
      expect(sys.docPath, `${sys.id}: docPath missing`).toBeTruthy();
      expect(sys.expectedRuntimeSymbols.length, `${sys.id}: zero symbols`)
        .toBeGreaterThan(0);
      for (const sym of sys.expectedRuntimeSymbols) {
        expect(sym.needle, `${sys.id}: symbol needle missing`).toBeTruthy();
        expect(
          sym.description,
          `${sys.id}: symbol description missing`,
        ).toBeTruthy();
      }
    }
  });

  it("checkDeclaredSubsystemRuntime declares one row per expected symbol", () => {
    const result = checkDeclaredSubsystemRuntime();
    expect(result.declared).toBe(countDeclaredSymbols());
  });

  it("audit-canonical designs stay tracked", () => {
    const ids = new Set(DECLARED_DESIGN_SYSTEMS.map((s) => s.id));
    for (const required of [
      "soul_stones",
      "pet_breeding",
      "living_character_sheet",
      "trade_empire_coda",
    ]) {
      expect(ids.has(required), `${required} dropped from registry`).toBe(true);
    }
  });
});
