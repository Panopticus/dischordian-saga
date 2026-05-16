/* ═══════════════════════════════════════════════════════
   ARCHON CANON — Registry integrity tests

   Validates (updated for the dreamer canon-lock 2026-05-15:
   the full 12-Archon roster is now locked):
   - all 12 canonical Archons registered, every position 1-12
     locked exactly once
   - the Architect IS position #1 (the prior "creator, not one
     of them" reading was overridden by the roster image)
   - the Human is the last Archon at position #12
   - no duplicate ids or positions
   - every entry has a positionSource citation + a primary
     LORE_BIBLE source + a non-empty domain
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
  it("registers all 12 canonical Archons (full roster dreamer-locked 2026-05-15)", () => {
    expect(CANONICAL_ARCHON_COUNT).toBe(12);
    expect(getArchonRegistryCoverage()).toBe(12);
    expect(ARCHONS).toHaveLength(12);
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

  it("has all 12 positions locked (full roster dreamer-locked 2026-05-15)", () => {
    expect(getNumberedArchonPositionCount()).toBe(12);
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

  it("every position 1-12 is locked exactly once (no gaps, no duplicates)", () => {
    const positions = ARCHONS.map((a) => a.position);
    for (const pos of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const) {
      expect(getArchonByPosition(pos), `position ${pos}`).not.toBeNull();
    }
    expect([...positions].sort((a, b) => (a ?? 0) - (b ?? 0))).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
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

  it("the Architect IS position #1 (roster image overrode the prior 'creator, not one of them' reading)", () => {
    const arch = getArchonByPosition(1);
    expect(arch?.id).toBe("the_architect");
    expect(arch?.positionSource ?? "").toMatch(/2026-05-15|roster image/i);
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

  it("the Human is the last Archon at position #12", () => {
    const human = getArchon("the_human");
    expect(human.position).toBe(12);
    expect(human.aliases).toContain("The Last Archon");
  });
});
