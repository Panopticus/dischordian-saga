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
        expect(
          line.startsWith("mystery.zyr_koth:"),
          `Zyr'Koth arc must be fully bound, but it is reported unbound: ${line}`,
        ).toBe(false);
        expect(
          line.startsWith("mystery.syl_vex:"),
          `Syl'Vex arc must be fully bound, but it is reported unbound: ${line}`,
        ).toBe(false);
        expect(
          line.startsWith("mystery.riri_ahlia:"),
          `Riri'Ahlia arc must be fully bound, but it is reported unbound: ${line}`,
        ).toBe(false);
        expect(
          line.startsWith("mystery.fenra:"),
          `Fenra arc must be fully bound, but it is reported unbound: ${line}`,
        ).toBe(false);
      }
      // The check must be doing real work (non-trivial declared set).
      expect(result.declared).toBeGreaterThan(0);
      expect(result.implemented).toBeGreaterThan(0);
    });
  });

  describe("narrative.mystery_clue_foundin_parity", () => {
    it("is registered as a hard-parity (un-ratcheted) Mystery Engine entry", () => {
      const entry = COMPLETENESS_REGISTRY.find(
        (e) => e.id === "narrative.mystery_clue_foundin_parity",
      );
      expect(entry, "entry must be registered").toBeDefined();
      // Hard parity: a dead-hint is always a bug, never an accepted
      // backlog. Absence of `ratchet` is what makes any gap a FAIL.
      expect(entry?.ratchet).toBeUndefined();
    });

    it("holds at zero gap — every bound clue's foundIn names a room that binds it", async () => {
      const entry = COMPLETENESS_REGISTRY.find(
        (e) => e.id === "narrative.mystery_clue_foundin_parity",
      )!;
      const result = await runParityCheck(entry, {
        version: 1,
        worstByEntry: {},
      });
      // The check must be doing real work (every bound, hinted clue).
      expect(result.declared).toBeGreaterThan(0);
      // Hard parity invariant: no clue may point its foundIn hint at
      // a room that does not bind it. Any mismatch is listed.
      expect(
        result.notes ?? [],
        `clue foundIn ⇄ binding-room mismatches:\n${(result.notes ?? []).join("\n")}`,
      ).toEqual([]);
      expect(result.implemented).toBe(result.declared);
    });
  });

  describe("audit parity rows — replay determinism + store SKU (F1/F7)", () => {
    it("server.replay_determinism_guard is a registered, ratcheted entry that runs", async () => {
      const entry = COMPLETENESS_REGISTRY.find(
        (e) => e.id === "server.replay_determinism_guard",
      );
      expect(entry, "entry must be registered").toBeDefined();
      // Ratcheted on purpose: the audit's first step is to make the
      // unwired determinism gap mechanical, not to hard-fail CI on it.
      expect(entry?.ratchet?.target).toBe(0);
      const result = await runParityCheck(entry!, {
        version: 1,
        worstByEntry: {},
      });
      // It must declare the determinism-contract probes and never
      // claim more implemented than declared.
      expect(result.declared).toBeGreaterThan(0);
      expect(result.implemented).toBeLessThanOrEqual(result.declared);
      // The version contract itself (RULES_VERSION + isReplayCompatible)
      // already exists, so at least one probe must pass — proving the
      // check reads source, not a constant.
      expect(result.implemented).toBeGreaterThan(0);
    });

    it("economy.store_sku_parity is a registered, ratcheted entry that runs", async () => {
      const entry = COMPLETENESS_REGISTRY.find(
        (e) => e.id === "economy.store_sku_parity",
      );
      expect(entry, "entry must be registered").toBeDefined();
      expect(entry?.ratchet?.target).toBe(0);
      const result = await runParityCheck(entry!, {
        version: 1,
        worstByEntry: {},
      });
      // There ARE real-money products to cover, so the contract is
      // non-trivial; the catalog does not exist yet so the gap is
      // legitimately tracked (RATCHET), never negative.
      expect(result.declared).toBeGreaterThan(0);
      expect(result.implemented).toBeLessThanOrEqual(result.declared);
    });
  });
});
