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
import * as fs from "node:fs";
import * as path from "node:path";
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
    // Walks every registered check in-process (~90 scans); the
    // default 5s vitest budget is too small for the full registry
    // walk on slower machines. Explicit budget, no assertion change.
  }, 60000);

  it("recorded ratchet ceilings never exceed the entry's declared count", async () => {
    const raw = fs.readFileSync(
      path.join(__dirname, "ratchet-state.json"),
      "utf-8",
    );
    const state = JSON.parse(raw) as {
      worstByEntry: Record<string, number>;
    };
    for (const entry of COMPLETENESS_REGISTRY) {
      const ceiling = state.worstByEntry[entry.id];
      if (ceiling === undefined) continue;
      const result = await runParityCheck(entry, {
        version: 1,
        worstByEntry: {},
      });
      expect(
        ceiling,
        `${entry.id}: ratchet ceiling ${ceiling} exceeds declared ${result.declared} — an entry must never be allowed to ratchet at "everything missing" forever`,
      ).toBeLessThanOrEqual(result.declared);
    }
  }, 60000);

  describe("narrative.mystery_clue_binding_coverage", () => {
    it("is registered as a ratcheted Mystery Engine entry", () => {
      const entry = COMPLETENESS_REGISTRY.find(
        (e) => e.id === "narrative.mystery_clue_binding_coverage",
      );
      expect(entry, "entry must be registered").toBeDefined();
      expect(entry?.ratchet?.target).toBe(0);
    });

    it("counts the Watcher arc's progression-critical clues as fully bound", async () => {
      const entry = COMPLETENESS_REGISTRY.find(
        (e) => e.id === "narrative.mystery_clue_binding_coverage",
      )!;
      const result = await runParityCheck(entry, {
        version: 1,
        worstByEntry: {},
      });
      // Watcher and Ith'Rael are the arcs wired end-to-end; neither
      // may appear among the still-stranded arcs in the missing list.
      for (const line of result.notes ?? []) {
        expect(
          line.startsWith("mystery.watcher:"),
          `Watcher arc must be fully bound, but it is reported unbound: ${line}`,
        ).toBe(false);
        expect(
          line.startsWith("mystery.ith_rael:"),
          `Ith'Rael arc must be fully bound, but it is reported unbound: ${line}`,
        ).toBe(false);
        expect(
          line.startsWith("mystery.politician:"),
          `Politician arc must be fully bound, but it is reported unbound: ${line}`,
        ).toBe(false);
        expect(
          line.startsWith("mystery.collector:"),
          `Collector arc must be fully bound, but it is reported unbound: ${line}`,
        ).toBe(false);
        expect(
          line.startsWith("mystery.varkul:"),
          `Varkul arc must be fully bound, but it is reported unbound: ${line}`,
        ).toBe(false);
        expect(
          line.startsWith("mystery.necromancer:"),
          `Necromancer arc must be fully bound, but it is reported unbound: ${line}`,
        ).toBe(false);
      }
      // The check must be doing real work (non-trivial declared set).
      expect(result.declared).toBeGreaterThan(0);
      expect(result.implemented).toBeGreaterThan(0);
    });
  });
});
