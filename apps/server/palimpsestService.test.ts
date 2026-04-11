import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Palimpsest service tests.
 *
 * The service wraps pure reducers from apps/shared/palimpsest.ts
 * and persists to a `palimpsest_state` row. We mock the DB to
 * return `null` for reads — that triggers the lazy-init path and
 * lets us exercise the in-memory cache, which is where the hot
 * logic lives during a single request lifecycle.
 */

// Mock the DB: every read returns no rows (lazy init), every write
// is a no-op. This is enough to exercise the cache + pure reducers.
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue([]),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    }),
  }),
}));

vi.mock("./logger", () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe("palimpsestService", () => {
  beforeEach(async () => {
    const { palimpsestService } = await import("./services/palimpsestService");
    palimpsestService._resetForTests();
  });

  describe("apply", () => {
    it("increments Signal on a truth event", async () => {
      const { palimpsestService } = await import("./services/palimpsestService");
      const state = await palimpsestService.apply(1, "quizCorrect");
      expect(state.signal).toBe(1);
      expect(state.noise).toBe(0);
    });

    it("increments Noise on a corruption event", async () => {
      const { palimpsestService } = await import("./services/palimpsestService");
      const state = await palimpsestService.apply(1, "quizWrong");
      expect(state.noise).toBe(1);
      expect(state.signal).toBe(0);
    });

    it("respects multipliers (e.g. bulk score)", async () => {
      const { palimpsestService } = await import("./services/palimpsestService");
      const state = await palimpsestService.apply(1, "quizCorrect", 10);
      expect(state.signal).toBe(10);
    });

    it("keeps per-user state independent", async () => {
      const { palimpsestService } = await import("./services/palimpsestService");
      await palimpsestService.apply(1, "quizCorrect", 5);
      await palimpsestService.apply(2, "quizWrong", 3);
      const a = await palimpsestService.get(1);
      const b = await palimpsestService.get(2);
      expect(a.signal).toBe(5);
      expect(a.noise).toBe(0);
      expect(b.signal).toBe(0);
      expect(b.noise).toBe(3);
    });
  });

  describe("applyRaw", () => {
    it("never drives signal or noise below zero", async () => {
      const { palimpsestService } = await import("./services/palimpsestService");
      const state = await palimpsestService.applyRaw(1, -100, -100);
      expect(state.signal).toBe(0);
      expect(state.noise).toBe(0);
    });

    it("supports raw positive deltas", async () => {
      const { palimpsestService } = await import("./services/palimpsestService");
      const state = await palimpsestService.applyRaw(1, 42, 17);
      expect(state.signal).toBe(42);
      expect(state.noise).toBe(17);
    });
  });

  describe("recordEpisode", () => {
    it("advances currentEpisode and appends history", async () => {
      const { palimpsestService } = await import("./services/palimpsestService");
      const state = await palimpsestService.recordEpisode(1, {
        episodeNumber: 1,
        winner: "signal",
        casualties: [],
        signalGained: 50,
        noiseGained: 0,
        inventorHackLanded: false,
      });
      expect(state.currentEpisode).toBe(2);
      expect(state.history).toHaveLength(1);
    });

    it("caps currentEpisode at 13 even after 13 records", async () => {
      const { palimpsestService } = await import("./services/palimpsestService");
      for (let ep = 1; ep <= 15; ep++) {
        await palimpsestService.recordEpisode(1, {
          episodeNumber: ep,
          winner: "signal",
          casualties: [],
          signalGained: 0,
          noiseGained: 0,
          inventorHackLanded: false,
        });
      }
      const state = await palimpsestService.get(1);
      expect(state.currentEpisode).toBe(13);
    });
  });

  describe("isMaskSlipping", () => {
    it("returns false when Signal dominates", async () => {
      const { palimpsestService } = await import("./services/palimpsestService");
      await palimpsestService.applyRaw(1, 500, 0);
      expect(await palimpsestService.isMaskSlipping(1)).toBe(false);
    });

    it("returns true when Noise is 250+ ahead of Signal", async () => {
      const { palimpsestService } = await import("./services/palimpsestService");
      await palimpsestService.applyRaw(1, 0, 300);
      expect(await palimpsestService.isMaskSlipping(1)).toBe(true);
    });
  });

  describe("global aggregate", () => {
    it("accumulates deltas across users", async () => {
      const { palimpsestService } = await import("./services/palimpsestService");
      await palimpsestService.apply(1, "quizCorrect", 10);
      await palimpsestService.apply(2, "quizCorrect", 20);
      const global = palimpsestService.getGlobal();
      expect(global.signal).toBe(30);
    });

    it("resets when _resetForTests is called", async () => {
      const { palimpsestService } = await import("./services/palimpsestService");
      await palimpsestService.apply(1, "quizCorrect", 100);
      palimpsestService._resetForTests();
      const global = palimpsestService.getGlobal();
      expect(global.signal).toBe(0);
    });
  });
});
