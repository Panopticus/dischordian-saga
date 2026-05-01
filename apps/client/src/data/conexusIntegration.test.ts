/* CoNexus integration invariants
 *
 * Catches ID drift between the four datasets that have to stay in lockstep
 * for the Antiquarian's Library to function:
 *
 *   conexusGames.ts       CONEXUS_GAMES[i].id        — source of truth
 *   livingArk.ts          TOME_PLACEMENTS[i].tomeId  — where the tome appears
 *   loreAchievements.ts   LORE_ACHIEVEMENTS[i].gameId — lore fragment payload
 *   antiquarianAssignments.ts  ANTIQUARIAN_ASSIGNMENTS[i].gameId — prescriptions
 *
 * Before this test was added we shipped seven silent ID mismatches between
 * placements and the catalogue (e.g. `the-oracle` vs `the-oracle-foundation`)
 * that bypassed the discoverability gate entirely. Don't ship that again.
 */
import { describe, it, expect } from "vitest";
import { CONEXUS_GAMES } from "./conexusGames";
import { LORE_ACHIEVEMENTS } from "./loreAchievements";
import { ANTIQUARIAN_ASSIGNMENTS } from "./antiquarianAssignments";
import { TOME_PLACEMENTS } from "@/game/livingArk";

describe("CoNexus integration invariants", () => {
  const gameIds = new Set(CONEXUS_GAMES.map((g) => g.id));

  it("every CoNexus game has exactly one TomePlacement", () => {
    const placementIds = TOME_PLACEMENTS.map((p) => p.tomeId);
    const placementSet = new Set(placementIds);
    // No duplicates.
    expect(placementIds.length).toBe(placementSet.size);
    // 1:1 with the catalogue.
    for (const game of CONEXUS_GAMES) {
      expect(placementSet.has(game.id), `missing placement for game ${game.id}`).toBe(true);
    }
    // No orphan placements.
    for (const placement of TOME_PLACEMENTS) {
      expect(gameIds.has(placement.tomeId), `placement ${placement.tomeId} has no matching game`).toBe(true);
    }
  });

  it("every TomePlacement is internally consistent with its method", () => {
    for (const p of TOME_PLACEMENTS) {
      if (p.method === "trust" || p.method === "npc_gift") {
        expect(p.trustReq, `${p.tomeId}: ${p.method} placement needs a trustReq`).toBeDefined();
        expect(p.trustReq!.min).toBeGreaterThan(0);
      }
      if (p.method === "quest" || p.method === "game") {
        expect(p.flagReq, `${p.tomeId}: ${p.method} placement needs a flagReq`).toBeDefined();
        expect(p.flagReq!.length).toBeGreaterThan(0);
      }
    }
  });

  it("every LoreAchievement maps to a real game id", () => {
    for (const ach of LORE_ACHIEVEMENTS) {
      expect(gameIds.has(ach.gameId), `achievement ${ach.id} references missing game ${ach.gameId}`).toBe(true);
    }
  });

  it("every AntiquarianAssignment maps to a real game id and has unique id", () => {
    const assignmentIds = new Set<string>();
    for (const a of ANTIQUARIAN_ASSIGNMENTS) {
      expect(gameIds.has(a.gameId), `assignment ${a.id} references missing game ${a.gameId}`).toBe(true);
      expect(assignmentIds.has(a.id), `duplicate assignment id ${a.id}`).toBe(false);
      assignmentIds.add(a.id);
      expect(a.requiredAct).toBeGreaterThanOrEqual(1);
      expect(a.requiredAct).toBeLessThanOrEqual(7);
      expect(a.requiredTrust).toBeGreaterThanOrEqual(0);
      expect(a.requiredTrust).toBeLessThanOrEqual(100);
    }
  });

  it("Assignments are ordered by ascending Act + Trust (so earlier prescriptions don't shadow later ones)", () => {
    const sorted = [...ANTIQUARIAN_ASSIGNMENTS].sort(
      (a, b) => a.requiredAct - b.requiredAct || a.requiredTrust - b.requiredTrust,
    );
    expect(ANTIQUARIAN_ASSIGNMENTS).toEqual(sorted);
  });
});
