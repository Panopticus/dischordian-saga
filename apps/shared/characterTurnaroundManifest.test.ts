import { describe, expect, it } from "vitest";
import {
  CHARACTER_TURNAROUND_MANIFEST,
  CHARACTER_TURNAROUND_IDS,
  isTurnaroundReady,
  listMissingTurnarounds,
  turnaroundCoverage,
} from "./characterTurnaroundManifest";

describe("CHARACTER_TURNAROUND_MANIFEST (audit/16 PR 37 — Cos1)", () => {
  it("ships exactly 26 character entries", () => {
    expect(CHARACTER_TURNAROUND_MANIFEST).toHaveLength(26);
    expect(CHARACTER_TURNAROUND_IDS).toHaveLength(26);
  });

  it("character ids are unique", () => {
    const ids = CHARACTER_TURNAROUND_MANIFEST.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every entry has both turnaround slots (front + full)", () => {
    for (const e of CHARACTER_TURNAROUND_MANIFEST) {
      expect(e.slots, `${e.id} missing slots`).toHaveLength(2);
      const slotIds = e.slots.map((s) => s.slot).sort();
      expect(slotIds).toEqual(["front_turnaround", "full_turnaround"]);
    }
  });

  it("rel paths follow the canonical convention", () => {
    for (const e of CHARACTER_TURNAROUND_MANIFEST) {
      for (const s of e.slots) {
        expect(s.rel).toBe(`${e.id}/${s.slot}.avif`);
      }
    }
  });

  it("Elara + The Human are the only non-pending entries (the protagonists)", () => {
    const ready = CHARACTER_TURNAROUND_MANIFEST.filter((e) =>
      e.slots.every((s) => !s.pending),
    ).map((e) => e.id);
    expect(ready.sort()).toEqual(["elara", "the_human"]);
  });

  it("every other entry has both slots pending", () => {
    const protagonists = new Set(["elara", "the_human"]);
    for (const e of CHARACTER_TURNAROUND_MANIFEST) {
      if (protagonists.has(e.id)) continue;
      for (const s of e.slots) {
        expect(s.pending, `${e.id}/${s.slot} should be pending`).toBe(true);
      }
    }
  });

  it("labels are non-empty and human-readable", () => {
    for (const e of CHARACTER_TURNAROUND_MANIFEST) {
      expect(e.label.length).toBeGreaterThan(0);
      expect(e.label.length).toBeLessThanOrEqual(40);
    }
  });
});

describe("isTurnaroundReady", () => {
  it("returns true for the protagonists", () => {
    expect(isTurnaroundReady("elara")).toBe(true);
    expect(isTurnaroundReady("the_human")).toBe(true);
  });

  it("returns false for every NPC (initial state — all pending)", () => {
    expect(isTurnaroundReady("agent_zero")).toBe(false);
    expect(isTurnaroundReady("the_antiquarian")).toBe(false);
    expect(isTurnaroundReady("the_source")).toBe(false);
  });
});

describe("listMissingTurnarounds", () => {
  it("returns the 24 NPCs at audit-time", () => {
    const missing = listMissingTurnarounds();
    expect(missing).toHaveLength(24);
    // Protagonists must NOT appear.
    const ids = missing.map((m) => m.id);
    expect(ids).not.toContain("elara");
    expect(ids).not.toContain("the_human");
  });

  it("lists both slots as pending for every NPC initially", () => {
    const missing = listMissingTurnarounds();
    for (const m of missing) {
      expect([...m.pendingSlots].sort()).toEqual([
        "front_turnaround",
        "full_turnaround",
      ]);
    }
  });
});

describe("turnaroundCoverage", () => {
  it("returns 2/26 ready at audit-time", () => {
    const cov = turnaroundCoverage();
    expect(cov.ready).toBe(2);
    expect(cov.total).toBe(26);
    expect(cov.percent).toBe(8); // round(2/26 * 100) = 8
  });
});
