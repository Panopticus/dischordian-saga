import { describe, it, expect } from "vitest";
import {
  CROSS_ARC_ALLOWED_FIELDS,
  CROSS_ARC_ALLOWED_FLAGS,
  MAX_SAVE_SLOTS,
  buildCrossArcCarryforward,
  deleteSlot,
  getSlot,
  listSlots,
  restoreFromSlot,
  saveToSlot,
} from "./saveSlots";

describe("saveSlots — listSlots / getSlot", () => {
  it("returns empty when no slots exist", () => {
    expect(listSlots({})).toEqual([]);
  });

  it("ignores malformed entries in gameData.saveSlots", () => {
    const out = listSlots({ saveSlots: [null, "string", 42, { id: "incomplete" }] });
    expect(out).toEqual([]);
  });

  it("returns slots sorted by updatedAt descending (newest first)", () => {
    let gd: Record<string, unknown> = {};
    const r1 = saveToSlot(gd, "a", "First", 1000);
    if ("error" in r1) throw new Error(r1.error);
    gd = r1.gameData;
    const r2 = saveToSlot(gd, "b", "Second", 2000);
    if ("error" in r2) throw new Error(r2.error);
    gd = r2.gameData;
    const list = listSlots(gd);
    expect(list[0].id).toBe("b");
    expect(list[1].id).toBe("a");
  });
});

describe("saveSlots — saveToSlot", () => {
  it("creates a new slot when none exists with the id", () => {
    const out = saveToSlot({ moralityScore: 42 }, "slot1", "Pre-decision", 1000);
    if ("error" in out) throw new Error(out.error);
    expect(out.slot.id).toBe("slot1");
    expect(out.slot.label).toBe("Pre-decision");
    expect(out.slot.data.moralityScore).toBe(42);
  });

  it("updates the existing slot when re-saving with the same id", () => {
    const r1 = saveToSlot({ moralityScore: 5 }, "slot1", "v1", 1000);
    if ("error" in r1) throw new Error(r1.error);
    const r2 = saveToSlot(
      { ...r1.gameData, moralityScore: 8 },
      "slot1",
      "v2",
      2000,
    );
    if ("error" in r2) throw new Error(r2.error);
    expect(r2.slot.data.moralityScore).toBe(8);
    expect(r2.slot.createdAt).toBe(1000); // preserved
    expect(r2.slot.updatedAt).toBe(2000);
    expect(r2.slot.label).toBe("v2");
  });

  it("strips saveSlots out of the snapshot (no recursive nesting)", () => {
    const r1 = saveToSlot({ moralityScore: 5 }, "a", "A", 1000);
    if ("error" in r1) throw new Error(r1.error);
    const r2 = saveToSlot(r1.gameData, "b", "B", 2000);
    if ("error" in r2) throw new Error(r2.error);
    expect(r2.slot.data.saveSlots).toBeUndefined();
  });

  it("rejects when MAX_SAVE_SLOTS is reached and the id is new", () => {
    let gd: Record<string, unknown> = {};
    for (let i = 0; i < MAX_SAVE_SLOTS; i++) {
      const r = saveToSlot(gd, `s${i}`, `slot ${i}`, 1000 + i);
      if ("error" in r) throw new Error(r.error);
      gd = r.gameData;
    }
    const overflow = saveToSlot(gd, "overflow", "extra", 10_000);
    expect("error" in overflow).toBe(true);
  });

  it("truncates labels longer than the limit", () => {
    const r = saveToSlot({}, "long", "x".repeat(100), 1000);
    if ("error" in r) throw new Error(r.error);
    expect(r.slot.label.length).toBeLessThanOrEqual(40);
  });
});

describe("saveSlots — restoreFromSlot", () => {
  it("returns the slot's snapshot data and preserves siblings", () => {
    const r1 = saveToSlot({ moralityScore: 5 }, "a", "A", 1000);
    if ("error" in r1) throw new Error(r1.error);
    const r2 = saveToSlot(r1.gameData, "b", "B", 2000);
    if ("error" in r2) throw new Error(r2.error);
    const restore = restoreFromSlot(r2.gameData, "a");
    if ("error" in restore) throw new Error(restore.error);
    expect(restore.gameData.moralityScore).toBe(5);
    expect(listSlots(restore.gameData).length).toBe(2);
  });

  it("errors on unknown slot id", () => {
    expect("error" in restoreFromSlot({}, "nope")).toBe(true);
  });
});

describe("saveSlots — deleteSlot", () => {
  it("removes the named slot", () => {
    const r1 = saveToSlot({}, "a", "A", 1000);
    if ("error" in r1) throw new Error(r1.error);
    const out = deleteSlot(r1.gameData, "a");
    expect(getSlot(out.gameData, "a")).toBeUndefined();
  });
});

describe("buildCrossArcCarryforward", () => {
  it("strips fields not in the allowlist", () => {
    const gd = {
      moralityScore: 42,
      activeDeck: ["card_a", "card_b"], // NOT in allowlist
      totalPlaytime: 1000,
    };
    const out = buildCrossArcCarryforward(gd);
    expect(out.moralityScore).toBe(42);
    expect(out.totalPlaytime).toBe(1000);
    expect(out.activeDeck).toBeUndefined();
  });

  it("filters narrativeFlags down to the cross-arc allowlist", () => {
    const gd = {
      narrativeFlags: {
        narrative_spine_complete: true,
        kael_questline_complete: true,
        act1_closing_choice_made: true, // NOT in cross-arc allowlist
        random_arc_local_flag: true,
      },
    };
    const out = buildCrossArcCarryforward(gd);
    const flags = out.narrativeFlags as Record<string, boolean>;
    expect(flags.narrative_spine_complete).toBe(true);
    expect(flags.kael_questline_complete).toBe(true);
    expect(flags.act1_closing_choice_made).toBeUndefined();
    expect(flags.random_arc_local_flag).toBeUndefined();
  });

  it("only carries flags whose value is exactly true (not falsy / unset)", () => {
    const gd = {
      narrativeFlags: { narrative_spine_complete: false },
    };
    const flags = (buildCrossArcCarryforward(gd).narrativeFlags ?? {}) as Record<string, boolean>;
    expect(flags.narrative_spine_complete).toBeUndefined();
  });

  it("CROSS_ARC_ALLOWED_FIELDS and CROSS_ARC_ALLOWED_FLAGS are non-empty", () => {
    expect(CROSS_ARC_ALLOWED_FIELDS.size).toBeGreaterThan(0);
    expect(CROSS_ARC_ALLOWED_FLAGS.size).toBeGreaterThan(0);
  });
});
