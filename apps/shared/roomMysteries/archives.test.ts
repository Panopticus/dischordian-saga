import { describe, expect, it } from "vitest";

import { ARCHIVES_MYSTERY } from "./archives";
import { combineInventory, resolveVerbResponse } from "./_template";

describe("archives mystery — Shadow Tongue point-and-click hotspots", () => {
  it("ships 6 hotspots (2 legacy + 4 ST)", () => {
    const ids = Object.keys(ARCHIVES_MYSTERY.responses);
    expect(ids).toContain("data-banks");
    expect(ids).toContain("egg-archive-tome");
    expect(ids).toContain("corrupted-scroll-rack");
    expect(ids).toContain("rewritten-ledger");
    expect(ids).toContain("indigo-glow-lectern");
    expect(ids).toContain("unnameable-hue-cabinet");
    expect(ids.length).toBe(6);
  });

  describe("corrupted-scroll-rack", () => {
    const r = resolveVerbResponse(ARCHIVES_MYSTERY, "look", "corrupted-scroll-rack")!;
    it("grants a corrupted-fragment", () => {
      expect(r.grantsInventory).toBe("corrupted-fragment");
    });
    it("records an ST edit on scroll-rack", () => {
      expect(r.recordsActiveEdit).toEqual({ artifact: "scroll-rack", type: "rewrite" });
    });
    it("sets the corruption-seen flag", () => {
      expect(r.setsFlag).toBe("shadow_tongue_corruption_seen");
    });
    it("logs a clue with archives source", () => {
      expect(r.logsClue?.source).toBe("archives");
    });
    it("has a Detective humanReaction", () => {
      expect(r.humanReaction).toBeDefined();
    });
  });

  describe("rewritten-ledger", () => {
    const r = resolveVerbResponse(ARCHIVES_MYSTERY, "look", "rewritten-ledger")!;
    it("grants the original-ledger-fragment", () => {
      expect(r.grantsInventory).toBe("original-ledger-fragment");
    });
    it("does NOT record a new ST edit (the scrub already happened — we read it)", () => {
      expect(r.recordsActiveEdit).toBeUndefined();
    });
    it("sets the ledger-read flag", () => {
      expect(r.setsFlag).toBe("shadow_tongue_ledger_read");
    });
    it("authors a Talk variant for reading aloud", () => {
      const t = resolveVerbResponse(ARCHIVES_MYSTERY, "talk", "rewritten-ledger");
      expect(t).not.toBeNull();
    });
  });

  describe("indigo-glow-lectern", () => {
    const r = resolveVerbResponse(ARCHIVES_MYSTERY, "look", "indigo-glow-lectern")!;
    it("records an ST edit on the lectern (rewrite type)", () => {
      expect(r.recordsActiveEdit).toEqual({ artifact: "lectern", type: "rewrite" });
    });
    it("sets the lectern-lit flag", () => {
      expect(r.setsFlag).toBe("shadow_tongue_lectern_lit");
    });
    it("authors a Use variant (touch the halo)", () => {
      const u = resolveVerbResponse(ARCHIVES_MYSTERY, "use", "indigo-glow-lectern");
      expect(u).not.toBeNull();
    });
  });

  describe("unnameable-hue-cabinet", () => {
    const r = resolveVerbResponse(ARCHIVES_MYSTERY, "look", "unnameable-hue-cabinet")!;
    it("does NOT record an ST edit (the cabinet survives)", () => {
      expect(r.recordsActiveEdit).toBeUndefined();
    });
    it("sets the hue-named flag", () => {
      expect(r.setsFlag).toBe("shadow_tongue_hue_named");
    });
    it("logs a clue about the surviving original", () => {
      expect(r.logsClue?.title).toMatch(/original survives/i);
    });
  });

  describe("uncorruption combine rule", () => {
    it("combines corrupted-fragment + original-ledger-fragment in either order", () => {
      const a = combineInventory(
        ARCHIVES_MYSTERY,
        "corrupted-fragment",
        "original-ledger-fragment",
      );
      const b = combineInventory(
        ARCHIVES_MYSTERY,
        "original-ledger-fragment",
        "corrupted-fragment",
      );
      expect(a).not.toBeNull();
      expect(b).not.toBeNull();
      expect(a).toEqual(b);
    });

    it("produces a restored-ledger and consumes inputs", () => {
      const r = combineInventory(
        ARCHIVES_MYSTERY,
        "corrupted-fragment",
        "original-ledger-fragment",
      )!;
      expect(r.producesInventory).toBe("restored-ledger");
      expect(r.consumesItems).toBe(true);
    });

    it("clears the archives_lectern active edit", () => {
      const r = combineInventory(
        ARCHIVES_MYSTERY,
        "corrupted-fragment",
        "original-ledger-fragment",
      )!;
      expect(r.clearsActiveEdit).toBe("archives_lectern");
    });

    it("sets the first-uncorruption flag and logs a victory clue", () => {
      const r = combineInventory(
        ARCHIVES_MYSTERY,
        "corrupted-fragment",
        "original-ledger-fragment",
      )!;
      expect(r.setsFlag).toBe("shadow_tongue_first_uncorruption");
      expect(r.logsClue?.id).toBe("clue-archives-first-uncorruption");
    });

    it("returns null for unrelated inventory pairs", () => {
      const r = combineInventory(
        ARCHIVES_MYSTERY,
        "corrupted-fragment",
        "restored-ledger",
      );
      expect(r).toBeNull();
    });
  });

  it("every new clue is sourced to archives with a unique order", () => {
    const orders: number[] = [];
    for (const verbs of Object.values(ARCHIVES_MYSTERY.responses)) {
      for (const resp of Object.values(verbs ?? {})) {
        const c = resp?.logsClue;
        if (c && c.source === "archives") orders.push(c.order);
      }
    }
    for (const rule of ARCHIVES_MYSTERY.combines ?? []) {
      const c = rule.result.logsClue;
      if (c && c.source === "archives") orders.push(c.order);
    }
    expect(orders.length).toBe(new Set(orders).size);
  });
});
