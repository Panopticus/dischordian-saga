/* ═══════════════════════════════════════════════════════
   ARCHON CANON — Registry integrity tests

   Validates:
   - 8 Archons currently registered (of 12 canonical)
   - exactly 5 positions are locked (per audit 2026-05-12):
       #4 Watcher / #5 Meme / #7 Politician / #8 Warden /
       #10 Game Master
   - no duplicate ids or locked positions
   - every locked-position entry has a citation
   - every entry has a primary LORE_BIBLE source
   - Architect is NOT registered (he is creator of, not one of, the
     12 Archons)
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";

import {
  ARCHONS,
  CANONICAL_ARCHON_COUNT,
  getArchon,
  getArchonByPosition,
  getArchonRegistryCoverage,
  getNumberedArchons,
  getNumberedArchonPositionCount,
  getUnnumberedArchons,
  type ArchonPosition,
} from "./archonCanon";

describe("Archon canonical registry", () => {
  it("registers 8 of the 12 canonical Archons (4 canon-pending in LORE_BIBLE)", () => {
    expect(CANONICAL_ARCHON_COUNT).toBe(12);
    expect(getArchonRegistryCoverage()).toBe(8);
    expect(ARCHONS).toHaveLength(8);
  });

  it("has no duplicate ids", () => {
    const ids = ARCHONS.map((a) => a.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("has no duplicate locked positions", () => {
    const positions = ARCHONS.map((a) => a.position).filter(
      (p): p is ArchonPosition => p !== null,
    );
    const unique = new Set(positions);
    expect(unique.size).toBe(positions.length);
  });

  it("has exactly 5 locked positions per the 2026-05 audit", () => {
    expect(getNumberedArchonPositionCount()).toBe(5);
  });

  it("locks #4 to the Watcher per LORE_BIBLE.md:3449", () => {
    expect(getArchonByPosition(4)?.id).toBe("the_watcher");
  });

  it("locks #5 to the Meme per LORE_BIBLE.md:2459 + antiquariansJournal.ts:351", () => {
    expect(getArchonByPosition(5)?.id).toBe("the_meme");
  });

  it("locks #7 to the Politician per LORE_BIBLE.md:2676", () => {
    expect(getArchonByPosition(7)?.id).toBe("the_politician");
  });

  it("locks #8 to the Warden per LORE_BIBLE.md:3352", () => {
    expect(getArchonByPosition(8)?.id).toBe("the_warden");
  });

  it("locks #10 to the Game Master per LORE_BIBLE.md:345", () => {
    expect(getArchonByPosition(10)?.id).toBe("the_game_master");
  });

  it("leaves positions 1, 2, 3, 6, 9, 11, 12 canon-pending (no fabrication)", () => {
    for (const pos of [1, 2, 3, 6, 9, 11, 12] as const) {
      expect(getArchonByPosition(pos)).toBeNull();
    }
  });

  it("every locked-position entry has a positionSource citation", () => {
    for (const entry of getNumberedArchons()) {
      expect(entry.positionSource).not.toBeNull();
      expect(entry.positionSource!.length).toBeGreaterThan(0);
    }
  });

  it("every unconfirmed-position entry has positionSource null (no fake citations)", () => {
    for (const entry of getUnnumberedArchons()) {
      expect(entry.positionSource).toBeNull();
    }
  });

  it("every entry has a primary loreSource", () => {
    for (const entry of ARCHONS) {
      expect(entry.loreSource.length).toBeGreaterThan(0);
    }
  });

  it("every entry has a non-empty domain", () => {
    for (const entry of ARCHONS) {
      expect(entry.domain.length).toBeGreaterThan(20);
    }
  });

  it("getArchon returns the correct entry for every registered id", () => {
    for (const entry of ARCHONS) {
      expect(getArchon(entry.id).id).toBe(entry.id);
    }
  });

  it("dates of creation (where set) are in Empire chronology (>= 1 A.A.)", () => {
    for (const entry of ARCHONS) {
      if (entry.dateAA !== null) {
        expect(entry.dateAA).toBeGreaterThanOrEqual(1);
        expect(Number.isInteger(entry.dateAA)).toBe(true);
      }
    }
  });

  it("the Architect is NOT in the Archon registry (he creates them, is not one of them)", () => {
    const ids = new Set(ARCHONS.map((a) => a.id));
    expect(ids.has("the_architect" as never)).toBe(false);
  });

  it("the Necromancer carries a canonNote explaining the 'tenth Archon' canon-ambiguity", () => {
    const necro = getArchon("the_necromancer");
    expect(necro.canonNote).toBeDefined();
    expect(necro.canonNote).toMatch(/tenth/i);
  });

  it("the Meme's status is 'contested' per canonical fate-ambiguity", () => {
    expect(getArchon("the_meme").status).toBe("contested");
  });

  it("the Game Master's canonNote names Vex Solène as his destroyer", () => {
    const gm = getArchon("the_game_master");
    expect(gm.canonNote).toBeDefined();
    // Per LORE_BIBLE.md:5352, Agent Zero = Vex Solène destroyed the Game Master.
    expect(gm.canonNote).toMatch(/agent zero|vex sol/i);
  });

  it("the Human is registered as 'last Archon' with position canon-pending", () => {
    const human = getArchon("the_human");
    expect(human.position).toBeNull();
    expect(human.aliases).toContain("The Last Archon");
  });
});
