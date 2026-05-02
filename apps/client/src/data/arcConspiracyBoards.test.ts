import { describe, expect, it } from "vitest";
import { ARC_BOARD_MANIFESTS, getArcBoardManifest } from "./arcConspiracyBoards";
import { MYSTERY_DEFINITIONS } from "@shared/episodeMysteries";

/* ═══════════════════════════════════════════════════════
   arcConspiracyBoards.test.ts — registry validity probes

   Per docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md §14b.6,
   the per-arc conspiracy-board manifest is data-only — the
   `SagaConspiracyBoard` reads it directly. These tests
   guard the contract between `arcConspiracyBoards.ts` and
   the canonical `episodeMysteries.ts` registry: every
   board must reference a real mystery, every laid-out
   suspect must exist in that mystery's suspect graph, and
   every reveal-rule clue must come from one of the
   mystery's authored episodes.
   ═══════════════════════════════════════════════════════ */

describe("ARC_BOARD_MANIFESTS — registry validity", () => {
  it("has unique tab ids", () => {
    const ids = ARC_BOARD_MANIFESTS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("references one MysteryDefinition per arc", () => {
    const knownMysteryIds = new Set(MYSTERY_DEFINITIONS.map((m) => String(m.id)));
    for (const board of ARC_BOARD_MANIFESTS) {
      expect(
        knownMysteryIds.has(board.mysteryId),
        `Board ${board.id}: mysteryId "${board.mysteryId}" not in MYSTERY_DEFINITIONS`,
      ).toBe(true);
    }
  });

  it("anchor + every laid-out suspect exists in the mystery's suspect graph", () => {
    for (const board of ARC_BOARD_MANIFESTS) {
      const mystery = MYSTERY_DEFINITIONS.find((m) => String(m.id) === board.mysteryId);
      expect(mystery, `${board.id}: mystery missing`).toBeDefined();
      const suspectIds = new Set((mystery?.suspects ?? []).map((s) => String(s.id)));

      expect(
        suspectIds.has(board.anchorSuspectId),
        `${board.id}: anchor "${board.anchorSuspectId}" not in suspect graph`,
      ).toBe(true);

      for (const sid of Object.keys(board.nodeLayout)) {
        expect(
          suspectIds.has(sid),
          `${board.id}: laid-out suspect "${sid}" not in suspect graph`,
        ).toBe(true);
      }

      for (const rule of board.revealRules) {
        for (const sid of rule.revealsSuspectIds) {
          expect(
            suspectIds.has(sid),
            `${board.id}: reveal rule references unknown suspect "${sid}"`,
          ).toBe(true);
        }
      }
    }
  });

  it("every reveal-rule clue exists in the mystery's authored episodes", () => {
    for (const board of ARC_BOARD_MANIFESTS) {
      const mystery = MYSTERY_DEFINITIONS.find((m) => String(m.id) === board.mysteryId)!;
      const knownClueIds = new Set<string>();
      for (const ep of mystery.episodes) {
        for (const c of ep.clues) {
          knownClueIds.add(String(c.id));
        }
      }
      for (const rule of board.revealRules) {
        expect(
          knownClueIds.has(rule.clueId),
          `${board.id}: reveal-rule clueId "${rule.clueId}" not in authored episodes`,
        ).toBe(true);
      }
    }
  });

  it("getArcBoardManifest looks up by id", () => {
    expect(getArcBoardManifest("wraith")?.tabLabel).toBe("Wraith Calder");
    expect(getArcBoardManifest("__nonexistent__")).toBeNull();
  });
});
