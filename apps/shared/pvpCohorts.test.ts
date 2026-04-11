import { describe, it, expect } from "vitest";
import {
  generateCohort,
  advanceCohortDay,
  getCohortLeaderboard,
  getPlayerStanding,
  COHORT_SIZE_MIN,
  COHORT_SIZE_MAX,
  COHORT_LENGTH_DAYS,
} from "./pvpCohorts";
import { generateApprentice } from "./apprentices";

describe("pvpCohorts", () => {
  describe("generateCohort", () => {
    it("creates cohort within size bounds", () => {
      const c = generateCohort(1);
      expect(c.members.length).toBeGreaterThanOrEqual(COHORT_SIZE_MIN);
      expect(c.members.length).toBeLessThanOrEqual(COHORT_SIZE_MAX);
    });

    it("starts at day 0, active status, no winner", () => {
      const c = generateCohort(1);
      expect(c.currentDay).toBe(0);
      expect(c.status).toBe("active");
      expect(c.winner).toBeNull();
    });

    it("includes player apprentice when provided", () => {
      const player = generateApprentice();
      const c = generateCohort(1, player);
      const playerMember = c.members.find(m => m.isPlayer);
      expect(playerMember).toBeTruthy();
      expect(playerMember!.apprenticeId).toBe(player.id);
      expect(playerMember!.apprenticeName).toBe(player.name);
    });

    it("no player when not provided", () => {
      const c = generateCohort(1);
      expect(c.members.some(m => m.isPlayer)).toBe(false);
    });

    it("all members start alive", () => {
      const c = generateCohort(1);
      expect(c.members.every(m => m.alive)).toBe(true);
    });

    it("risk scores are in 5-100 range", () => {
      const c = generateCohort(1);
      for (const m of c.members) {
        expect(m.riskScore).toBeGreaterThanOrEqual(5);
        expect(m.riskScore).toBeLessThanOrEqual(100);
      }
    });
  });

  describe("advanceCohortDay", () => {
    it("advances currentDay by 1", () => {
      const c = generateCohort(1);
      const next = advanceCohortDay(c);
      expect(next.currentDay).toBe(c.currentDay + 1);
    });

    it("never revives dead members", () => {
      let c = generateCohort(1);
      for (let day = 0; day < 5; day++) {
        c = advanceCohortDay(c);
      }
      const dead = c.members.filter(m => !m.alive);
      expect(dead.every(d => d.dayFallen !== undefined)).toBe(true);
    });

    it("reduces alive count over time", () => {
      let c = generateCohort(1);
      const initialAlive = c.members.filter(m => m.alive).length;
      for (let day = 0; day < 14; day++) {
        c = advanceCohortDay(c);
      }
      const laterAlive = c.members.filter(m => m.alive).length;
      expect(laterAlive).toBeLessThan(initialAlive);
    });

    it("leaves exactly 1 alive by day 28 (or terminates earlier with a winner)", () => {
      let c = generateCohort(1);
      for (let day = 0; day < COHORT_LENGTH_DAYS; day++) {
        c = advanceCohortDay(c);
        if (c.status === "concluded") break;
      }
      const alive = c.members.filter(m => m.alive);
      expect(alive.length).toBeLessThanOrEqual(1);
      expect(c.status).toBe("concluded");
    });

    it("does not advance concluded cohort", () => {
      let c = generateCohort(1);
      for (let day = 0; day < COHORT_LENGTH_DAYS + 5; day++) {
        c = advanceCohortDay(c);
      }
      expect(c.status).toBe("concluded");
      const post = advanceCohortDay(c);
      expect(post.currentDay).toBe(c.currentDay);
    });

    it("each dead member gets a cause of death", () => {
      let c = generateCohort(1);
      for (let day = 0; day < 10; day++) {
        c = advanceCohortDay(c);
      }
      const dead = c.members.filter(m => !m.alive);
      for (const d of dead) {
        expect(d.causeOfDeath).toBeTruthy();
        expect(d.dayFallen).toBeGreaterThan(0);
      }
    });
  });

  describe("leaderboard", () => {
    it("alive members sorted before dead ones", () => {
      let c = generateCohort(1);
      for (let day = 0; day < 5; day++) {
        c = advanceCohortDay(c);
      }
      const board = getCohortLeaderboard(c);
      const aliveCount = c.members.filter(m => m.alive).length;
      for (let i = 0; i < aliveCount; i++) {
        expect(board[i].alive).toBe(true);
      }
      for (let i = aliveCount; i < board.length; i++) {
        expect(board[i].alive).toBe(false);
      }
    });

    it("player standing returns null when no player in cohort", () => {
      const c = generateCohort(1);
      expect(getPlayerStanding(c)).toBeNull();
    });

    it("player standing returns rank when player in cohort", () => {
      const player = generateApprentice();
      const c = generateCohort(1, player);
      const standing = getPlayerStanding(c);
      expect(standing).not.toBeNull();
      expect(standing!.rank).toBeGreaterThan(0);
      expect(standing!.alive).toBe(true);
    });
  });
});
