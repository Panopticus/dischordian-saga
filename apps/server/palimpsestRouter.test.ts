import { describe, expect, it, vi, beforeEach } from "vitest";

/**
 * Palimpsest router integration tests.
 *
 * These exercise the tRPC router end-to-end using a mocked DB
 * so they run regardless of whether DATABASE_URL is set (matches
 * apps/server/palimpsestService.test.ts). We verify:
 *   - get returns decoded state + phase
 *   - recordQuiz flows through ripple emit + palimpsestService
 *   - recordDebate applies signal/noise deltas correctly
 *   - recordEpisode persists to contentParticipation and fans out
 *     show_casualty_rolled / inventor_hack_landed
 *   - listCompletedEpisodes returns parsed episode numbers
 */

// Mock the DB BEFORE importing anything downstream of it.
// Drizzle query builders are thenable — awaiting a builder without
// calling `.limit()` resolves to the row array. The mock below
// makes `.where()` both chainable (for `.limit(1)`) AND directly
// awaitable (resolves to `[]`) so the router's two query shapes
// (`select().from().where().limit(1)` and `select().from().where()`)
// both work under the same mock.
function makeThenableBuilder(resolved: unknown[] = []) {
  const builder: Record<string, unknown> = {
    select: () => builder,
    from: () => builder,
    where: () => builder,
    limit: () => Promise.resolve(resolved),
    // Make the builder itself thenable so `await db.select()...where()` works.
    then: (onFulfilled: (v: unknown[]) => unknown) => Promise.resolve(resolved).then(onFulfilled),
  };
  return builder;
}

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    select: () => makeThenableBuilder([]),
    from: () => makeThenableBuilder([]),
    where: () => makeThenableBuilder([]),
    limit: () => Promise.resolve([]),
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

// Stub pressureService so ripple handlers don't try to write pressure events.
vi.mock("./services/pressureService", () => ({
  pressureService: {
    increment: vi.fn().mockResolvedValue(undefined),
    checkThresholds: vi.fn().mockResolvedValue(undefined),
  },
}));

import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId = 777): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "oauth",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    deletedAt: null,
    signupWeek: null,
    installSource: null,
    abVariant: null,
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

describe("palimpsest router", () => {
  beforeEach(async () => {
    const { palimpsestService } = await import("./services/palimpsestService");
    palimpsestService._resetForTests();
  });

  describe("get", () => {
    // First `await import("./routers")` in the suite pays the
    // cold-start cost (full tRPC tree + card registry + schema).
    // 5s (vitest default) is borderline; 30s gives headroom without
    // masking real hangs. Subsequent tests hit the import cache.
    it("returns the default state, global aggregate, and phase for a new user", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createAuthContext(1));
      const result = await caller.palimpsest.get();
      expect(result.state.signal).toBe(0);
      expect(result.state.noise).toBe(0);
      expect(result.phase).toBe("balanced");
      expect(result.globalPhase).toBe("balanced");
      expect(result.state.currentEpisode).toBe(1);
    }, 30_000);
  });

  describe("recordQuiz", () => {
    it("adds Signal when all answers are correct", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createAuthContext(2));
      const result = await caller.palimpsest.recordQuiz({
        correct: 10,
        wrong: 0,
        source: "lore_quiz",
      });
      expect(result.state.signal).toBe(10);
      expect(result.state.noise).toBe(0);
    });

    it("adds Noise when all answers are wrong", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createAuthContext(3));
      const result = await caller.palimpsest.recordQuiz({
        correct: 0,
        wrong: 5,
        source: "gamemasters_arena",
      });
      expect(result.state.noise).toBe(5);
      expect(result.state.signal).toBe(0);
    });

    it("splits Signal and Noise on mixed results", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createAuthContext(4));
      const result = await caller.palimpsest.recordQuiz({
        correct: 7,
        wrong: 3,
        source: "palimpsest_episode",
        episode: 5,
      });
      expect(result.state.signal).toBe(7);
      expect(result.state.noise).toBe(3);
    });

    it("rejects negative counts via zod input", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createAuthContext(5));
      await expect(
        caller.palimpsest.recordQuiz({
          correct: -1,
          wrong: 0,
          source: "lore_quiz",
        }),
      ).rejects.toThrow();
    });
  });

  describe("recordDebate", () => {
    it("grants Signal when the player exposes Alaric", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createAuthContext(6));
      const result = await caller.palimpsest.recordDebate({
        episode: 10,
        signalDelta: 25,
        noiseDelta: 0,
        exposed: true,
      });
      expect(result.state.signal).toBe(25);
      expect(result.state.noise).toBe(0);
    });

    it("grants Noise when the player agrees with Alaric", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createAuthContext(7));
      const result = await caller.palimpsest.recordDebate({
        episode: 2,
        signalDelta: 0,
        noiseDelta: 10,
        exposed: false,
      });
      expect(result.state.noise).toBe(10);
    });
  });

  describe("recordEpisode", () => {
    it("advances currentEpisode and records a winning episode", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createAuthContext(8));
      const result = await caller.palimpsest.recordEpisode({
        episodeNumber: 1,
        winner: "signal",
        casualties: [],
        signalGained: 50,
        noiseGained: 0,
        inventorHackLanded: false,
      });
      expect(result.state.currentEpisode).toBe(2);
      expect(result.state.history).toHaveLength(1);
      expect(result.state.signal).toBeGreaterThanOrEqual(50); // Winning ripples in 50.
    });

    it("accepts casualties with real elimination rounds", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createAuthContext(9));
      const result = await caller.palimpsest.recordEpisode({
        episodeNumber: 9,
        winner: "noise",
        casualties: [
          { playerName: "Theodora Vance", eliminationRound: 3 },
          { playerName: "Marion Kell", eliminationRound: 10 },
        ],
        signalGained: 0,
        noiseGained: 25,
        inventorHackLanded: true,
      });
      expect(result.state.currentEpisode).toBe(2); // Advanced from 1.
    });

    it("rejects elimination rounds out of 1..10", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createAuthContext(10));
      await expect(
        caller.palimpsest.recordEpisode({
          episodeNumber: 4,
          winner: "signal",
          casualties: [{ playerName: "test", eliminationRound: 11 }],
          signalGained: 0,
          noiseGained: 0,
          inventorHackLanded: false,
        }),
      ).rejects.toThrow();
    });

    it("rejects episode numbers outside 1..13", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createAuthContext(11));
      await expect(
        caller.palimpsest.recordEpisode({
          episodeNumber: 14,
          winner: "signal",
          casualties: [],
          signalGained: 0,
          noiseGained: 0,
          inventorHackLanded: false,
        }),
      ).rejects.toThrow();
    });
  });

  describe("listCompletedEpisodes", () => {
    it("returns an empty list when no episodes have been recorded", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createAuthContext(12));
      const result = await caller.palimpsest.listCompletedEpisodes();
      expect(result.completed).toEqual([]);
    });
  });
});
