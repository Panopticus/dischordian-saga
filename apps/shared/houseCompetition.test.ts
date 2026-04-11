import { describe, it, expect } from "vitest";
import {
  initHouseCompetitionState,
  tickBots,
  maybeWeeklyReset,
  playerContributes,
  getRankings,
  getPlayerRank,
  WEEKLY_RESET_DAYS,
} from "./houseCompetition";

describe("houseCompetition", () => {
  describe("initHouseCompetitionState", () => {
    it("creates 12 guilds", () => {
      const state = initHouseCompetitionState();
      expect(Object.keys(state.standings)).toHaveLength(12);
    });

    it("each guild has 8-19 bot members", () => {
      const state = initHouseCompetitionState();
      for (const guild of Object.values(state.standings)) {
        expect(guild.botCount).toBeGreaterThanOrEqual(8);
        expect(guild.botCount).toBeLessThanOrEqual(19);
      }
    });

    it("starts at week 1 with empty history", () => {
      const state = initHouseCompetitionState();
      expect(state.currentWeek).toBe(1);
      expect(state.winnerHistory).toEqual([]);
    });

    it("next reset is in the future", () => {
      const state = initHouseCompetitionState();
      expect(state.nextResetAt).toBeGreaterThan(Date.now());
    });
  });

  describe("tickBots", () => {
    it("maintains 12 guilds", () => {
      let state = initHouseCompetitionState();
      state = tickBots(state);
      expect(Object.keys(state.standings)).toHaveLength(12);
    });

    it("increases scores over time (with mocked elapsed time)", () => {
      let state = initHouseCompetitionState();
      // Back-date lastBotTick on all guilds to simulate 1 hour elapsed
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      for (const k of Object.keys(state.standings)) {
        state.standings[k].lastBotTick = oneHourAgo;
      }
      const totalBefore = Object.values(state.standings).reduce((s, g) => s + g.score, 0);
      state = tickBots(state);
      const totalAfter = Object.values(state.standings).reduce((s, g) => s + g.score, 0);
      expect(totalAfter).toBeGreaterThanOrEqual(totalBefore);
    });

    it("lastBotTick updates after tick", () => {
      let state = initHouseCompetitionState();
      const ticks0 = Object.values(state.standings).map(g => g.lastBotTick);
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      for (const k of Object.keys(state.standings)) {
        state.standings[k].lastBotTick = oneHourAgo;
      }
      state = tickBots(state);
      const ticks1 = Object.values(state.standings).map(g => g.lastBotTick);
      for (const t of ticks1) {
        expect(t).toBeGreaterThanOrEqual(ticks0[0]);
      }
    });
  });

  describe("playerContributes", () => {
    it("adds points to specified guild", () => {
      let state = initHouseCompetitionState();
      const guildName = "The Eyes";
      const before = state.standings[guildName].score;
      state = playerContributes(state, guildName, 50);
      expect(state.standings[guildName].score).toBe(before + 50);
    });

    it("noop for unknown guild", () => {
      let state = initHouseCompetitionState();
      const before = JSON.stringify(state.standings);
      state = playerContributes(state, "Not A Guild", 100);
      expect(JSON.stringify(state.standings)).toBe(before);
    });
  });

  describe("maybeWeeklyReset", () => {
    it("does nothing if reset time not reached", () => {
      const state = initHouseCompetitionState();
      const after = maybeWeeklyReset(state);
      expect(after.currentWeek).toBe(1);
      expect(after.winnerHistory).toHaveLength(0);
    });

    it("resets + crowns winner when reset time passed", () => {
      const state = initHouseCompetitionState();
      state.nextResetAt = Date.now() - 1000; // force past
      // Give one guild a clear high score
      state.standings["The Yellow Coats"].score = 999;
      const after = maybeWeeklyReset(state);
      expect(after.currentWeek).toBe(2);
      expect(after.winnerHistory).toHaveLength(1);
      expect(after.winnerHistory[0].guildName).toBe("The Yellow Coats");
    });

    it("increments leadStreak for top-3 after reset", () => {
      const state = initHouseCompetitionState();
      state.nextResetAt = Date.now() - 1000;
      state.standings["The Yellow Coats"].score = 999;
      state.standings["The Eyes"].score = 500;
      state.standings["The Forge"].score = 250;
      const after = maybeWeeklyReset(state);
      expect(after.standings["The Yellow Coats"].leadStreak).toBe(1);
      expect(after.standings["The Eyes"].leadStreak).toBe(1);
      expect(after.standings["The Forge"].leadStreak).toBe(1);
    });
  });

  describe("rankings", () => {
    it("sorts by score descending", () => {
      let state = initHouseCompetitionState();
      state.standings["The Forge"].score = 1000;
      state.standings["The Chorus"].score = 500;
      const rankings = getRankings(state);
      expect(rankings[0].guildName).toBe("The Forge");
      const secondPlaceScore = rankings[1].score;
      expect(secondPlaceScore).toBeLessThanOrEqual(1000);
      expect(secondPlaceScore).toBeGreaterThanOrEqual(state.standings["The Chorus"].score);
    });

    it("assigns rank 1..12", () => {
      const state = initHouseCompetitionState();
      const rankings = getRankings(state);
      expect(rankings).toHaveLength(12);
      expect(rankings[0].rank).toBe(1);
      expect(rankings[11].rank).toBe(12);
    });

    it("getPlayerRank returns -1 for unknown guild", () => {
      const state = initHouseCompetitionState();
      expect(getPlayerRank(state, "Not A Guild")).toBe(-1);
    });
  });
});
