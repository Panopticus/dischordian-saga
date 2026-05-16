/* ═══════════════════════════════════════════════════════
   NE-YON CANON — Registry integrity tests

   Validates:
   - exactly 12 Ne-Yons registered (canonical count)
   - exactly 1 Ne-Yon is `awake` (the Degen — canon invariant)
   - all 12 positions locked (full roster dreamer-locked
     2026-05-15): #1 Dreamer / #2 Judge / #8 Degen / #11 Enigma
     / #12 the Forgotten / …
   - no duplicate ids
   - no duplicate locked positions
   - every locked-position entry has a citation
   - every entry has a primary LORE_BIBLE source
   - dates of emergence are non-negative when present
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";

import {
  NE_YONS,
  getAwakeNeYon,
  getNeYon,
  getNeYonByPosition,
  getNumberedNeYons,
  getNumberedPositionCount,
  getUnnumberedNeYons,
  type NeYonPosition,
} from "./neYonCanon";

describe("Ne-Yon canonical registry", () => {
  it("contains exactly 12 entries — the canonical count", () => {
    expect(NE_YONS).toHaveLength(12);
  });

  it("has exactly 1 awake Ne-Yon — the Degen", () => {
    const awake = NE_YONS.filter((n) => n.status === "awake");
    expect(awake).toHaveLength(1);
    expect(awake[0].id).toBe("the_degen");
    expect(awake[0].position).toBe(8);
  });

  it("getAwakeNeYon returns the Degen", () => {
    const awake = getAwakeNeYon();
    expect(awake.id).toBe("the_degen");
    expect(awake.position).toBe(8);
  });

  it("has no duplicate ids", () => {
    const ids = NE_YONS.map((n) => n.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("has no duplicate locked positions", () => {
    const positions = NE_YONS.map((n) => n.position).filter(
      (p): p is NeYonPosition => p !== null,
    );
    const unique = new Set(positions);
    expect(unique.size).toBe(positions.length);
  });

  it("has all 12 positions locked (full roster dreamer-locked 2026-05-15)", () => {
    expect(getNumberedPositionCount()).toBe(12);
  });

  it("locks position #1 to the Dreamer per dreamer-directive + earliest emergence", () => {
    const dreamer = getNeYonByPosition(1);
    expect(dreamer?.id).toBe("the_dreamer");
  });

  it("locks position #2 to the Judge per LORE_BIBLE:3582", () => {
    const judge = getNeYonByPosition(2);
    expect(judge?.id).toBe("the_judge");
  });

  it("locks position #8 to the Degen per multiple LORE_BIBLE citations", () => {
    const degen = getNeYonByPosition(8);
    expect(degen?.id).toBe("the_degen");
  });

  it("locks position #11 to the Enigma per LORE_BIBLE:1961", () => {
    const enigma = getNeYonByPosition(11);
    expect(enigma?.id).toBe("the_enigma");
  });

  it("locks position #12 to the Forgotten (full roster dreamer-locked 2026-05-15)", () => {
    const forgotten = getNeYonByPosition(12);
    expect(forgotten?.id).toBe("the_forgotten");
  });

  it("every position 1-12 is locked exactly once (no gaps, no duplicates)", () => {
    const positions = NE_YONS.map((n) => n.position);
    for (const pos of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const) {
      expect(getNeYonByPosition(pos), `position ${pos}`).not.toBeNull();
    }
    expect([...positions].sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
  });

  it("every locked-position entry has a positionSource citation", () => {
    for (const entry of getNumberedNeYons()) {
      expect(entry.positionSource).not.toBeNull();
      expect(entry.positionSource!.length).toBeGreaterThan(0);
    }
  });

  it("every unconfirmed-position entry has positionSource null (no fake citations)", () => {
    for (const entry of getUnnumberedNeYons()) {
      expect(entry.positionSource).toBeNull();
    }
  });

  it("every entry has a primary loreSource", () => {
    for (const entry of NE_YONS) {
      expect(entry.loreSource).toMatch(/LORE_BIBLE\.md:\d+/);
    }
  });

  it("every entry has a non-empty domain description", () => {
    for (const entry of NE_YONS) {
      expect(entry.domain.length).toBeGreaterThan(20);
    }
  });

  it("getNeYon returns the correct entry for every canonical id", () => {
    for (const entry of NE_YONS) {
      expect(getNeYon(entry.id).id).toBe(entry.id);
    }
  });

  it("dates of emergence (where set) are positive integers in A.A.", () => {
    for (const entry of NE_YONS) {
      if (entry.dateAA !== null) {
        expect(entry.dateAA).toBeGreaterThan(0);
        expect(Number.isInteger(entry.dateAA)).toBe(true);
      }
    }
  });

  it("the Dreamer is canonically the earliest emergent (15100 A.A.)", () => {
    const dreamer = getNeYon("the_dreamer");
    expect(dreamer.dateAA).toBe(15100);

    const datedEntries = NE_YONS.filter((n) => n.dateAA !== null);
    const earliest = datedEntries.reduce((min, cur) =>
      cur.dateAA! < min.dateAA! ? cur : min,
    );
    expect(earliest.id).toBe("the_dreamer");
  });

  it("the Advocate's status reflects 'Active (though her humanity is lost)' per LORE_BIBLE:1462", () => {
    const advocate = getNeYon("the_advocate");
    expect(advocate.status).toBe("active-lost");
  });

  it("no fabricated names — only canonical Ne-Yons are present", () => {
    const ids = new Set(NE_YONS.map((n) => n.id));
    // Verify the fabrications from the 2026-05 audit are NOT in the registry.
    expect(ids.has("lirielle_vance_solene" as never)).toBe(false);
    expect(ids.has("the_ninth_neon" as never)).toBe(false);
  });

  it("the Trickster is NOT in the 12 (canon-ambiguous per the_degen.md:168)", () => {
    const ids = new Set(NE_YONS.map((n) => n.id));
    expect(ids.has("the_trickster" as never)).toBe(false);
  });

  it("11 + 1 invariant: 11 gone OR active-lost + 1 awake = 12 total", () => {
    const awake = NE_YONS.filter((n) => n.status === "awake").length;
    const gone = NE_YONS.filter((n) => n.status === "gone").length;
    const activeLost = NE_YONS.filter((n) => n.status === "active-lost").length;
    expect(awake).toBe(1);
    expect(awake + gone + activeLost).toBe(12);
  });
});
