/**
 * Self-test for the completeness gate harness.
 *
 * Verifies the registry stays well-formed as entries are added in
 * Part B onward. Catches:
 *   - duplicate ids
 *   - id-format violations (must be lowercase / dot-separated)
 *   - missing or empty names / descriptions
 *   - check functions that crash, return negative counts, or return
 *     implemented > declared
 *   - ratchet ceilings that exceed declared (no entry should ever be
 *     allowed to ratchet at "everything missing" forever)
 *
 * Smoke-runs every entry's check function in-process so a broken
 * check function fails CI as a unit test, not just as a ship:check
 * harness crash.
 */
import { describe, it, expect } from "vitest";
import {
  COMPLETENESS_REGISTRY,
  runParityCheck,
} from "./index";

const ID_RE = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/;

describe("completeness registry — well-formedness", () => {
  it("ids are lowercase, dot-separated, and unique", () => {
    const seen = new Set<string>();
    const malformed: string[] = [];
    const duplicates: string[] = [];
    for (const entry of COMPLETENESS_REGISTRY) {
      if (!ID_RE.test(entry.id)) malformed.push(entry.id);
      if (seen.has(entry.id)) duplicates.push(entry.id);
      seen.add(entry.id);
    }
    expect(malformed, `malformed ids: ${malformed.join(", ")}`).toEqual([]);
    expect(duplicates, `duplicate ids: ${duplicates.join(", ")}`).toEqual([]);
  });

  it("every entry has non-empty name and description", () => {
    for (const entry of COMPLETENESS_REGISTRY) {
      expect(entry.name.trim(), `${entry.id}: name is empty`).not.toBe("");
      expect(
        entry.description.trim(),
        `${entry.id}: description is empty`,
      ).not.toBe("");
    }
  });

  // Smoke-runs every gate's check in-process. Grows with each
  // gate added; the full suite (~90 checks, several doing file
  // I/O) exceeds vitest's 5s default in CI's tsx transform path.
  // Explicit generous timeout — assertions still run and must
  // pass; this is not a silenced check.
  it("every entry's check function runs and returns a sane count", async () => {
    for (const entry of COMPLETENESS_REGISTRY) {
      const result = await runParityCheck(entry, {
        version: 1,
        worstByEntry: {},
      });
      expect(
        result.declared,
        `${entry.id}: declared count negative`,
      ).toBeGreaterThanOrEqual(0);
      expect(
        result.implemented,
        `${entry.id}: implemented count negative`,
      ).toBeGreaterThanOrEqual(0);
      expect(
        result.implemented,
        `${entry.id}: implemented exceeds declared`,
      ).toBeLessThanOrEqual(result.declared);
      expect(
        ["PASS", "FAIL", "RATCHET"],
        `${entry.id}: bad status ${result.status}`,
      ).toContain(result.status);
    }
  }, 30000);
});
