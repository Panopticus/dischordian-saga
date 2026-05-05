import { describe, expect, it, vi, beforeEach } from "vitest";

/**
 * Cross-game thread emit router integration tests.
 *
 * Mocks the DB the same way palimpsestRouter.test.ts does so the suite
 * runs without DATABASE_URL. We verify:
 *   - listThreads returns the registry shape (publicProcedure)
 *   - listThreads filters by game
 *   - emit validates the beat id against the canonical registry
 *   - emit rejects emittedBy/canonical-emitter mismatches
 *   - emit sets the xgame_<beatId> flag idempotently
 *   - status reads the per-player emit state for a thread
 */

// In-memory store for the mocked userProgress row. The DB mock
// reads/writes against this so emit + status see the same state.
let mockProgressRow: { id: number; userId: number; gameData: Record<string, unknown> } | null = null;

function makeThenableBuilder(resolved: unknown[] = []) {
  const builder: Record<string, unknown> = {
    select: () => builder,
    from: () => builder,
    where: () => builder,
    limit: () => Promise.resolve(resolved),
    then: (onFulfilled: (v: unknown[]) => unknown) =>
      Promise.resolve(resolved).then(onFulfilled),
  };
  return builder;
}

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    select: () => {
      // Always return a builder whose .limit() resolves to the current
      // mockProgressRow (or empty array if none).
      const result = mockProgressRow ? [mockProgressRow] : [];
      return makeThenableBuilder(result);
    },
    from: () => makeThenableBuilder(mockProgressRow ? [mockProgressRow] : []),
    where: () => makeThenableBuilder(mockProgressRow ? [mockProgressRow] : []),
    limit: () => Promise.resolve(mockProgressRow ? [mockProgressRow] : []),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockImplementation((row: Record<string, unknown>) => {
        mockProgressRow = {
          id: 1,
          userId: row.userId as number,
          gameData: (row.gameData as Record<string, unknown>) ?? {},
        };
        return Promise.resolve(undefined);
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockImplementation((patch: Record<string, unknown>) => ({
        where: vi.fn().mockImplementation(() => {
          if (mockProgressRow && patch.gameData) {
            mockProgressRow.gameData = patch.gameData as Record<string, unknown>;
          }
          return Promise.resolve(undefined);
        }),
      })),
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

import type { TrpcContext } from "./_core/context";
type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId = 9001): TrpcContext {
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
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("crossGameThreads router", () => {
  beforeEach(() => {
    mockProgressRow = null;
  });

  describe("listThreads", () => {
    it("returns the registry shape without auth", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createPublicContext());
      const threads = await caller.crossGameThreads.listThreads();
      expect(threads.length).toBeGreaterThanOrEqual(9);
      for (const t of threads) {
        expect(t.id.length).toBeGreaterThan(0);
        expect(t.beatCount).toBeGreaterThan(0);
        expect(t.participatingGames.length).toBeGreaterThan(0);
      }
    }, 30_000);

    it("filters threads by participating game", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createPublicContext());
      const cades = await caller.crossGameThreads.listThreads({
        game: "cades_fps",
      });
      const ids = cades.map((t) => t.id);
      expect(ids).toContain("cades_fall");
      expect(ids).not.toContain("programmers_gift");
    });
  });

  describe("emit", () => {
    it("rejects unknown beat ids", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createAuthContext());
      await expect(
        caller.crossGameThreads.emit({ beatId: "does_not_exist" }),
      ).rejects.toThrow(/Unknown cross-game beat/);
    });

    it("rejects emittedBy that does not match the canonical emitter", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createAuthContext());
      // cades_fall_arrival is canonically emitted by cades_fps.
      await expect(
        caller.crossGameThreads.emit({
          beatId: "cades_fall_arrival",
          emittedBy: "loredex",
        }),
      ).rejects.toThrow(/can only be emitted by cades_fps/);
    });

    it("sets the xgame flag and reports alreadyEmitted=false on first call", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createAuthContext(9002));
      const result = await caller.crossGameThreads.emit({
        beatId: "cades_fall_expulsion",
        emittedBy: "loredex",
      });
      expect(result.success).toBe(true);
      expect(result.flag).toBe("xgame_cades_fall_expulsion");
      expect(result.alreadyEmitted).toBe(false);
      expect(result.threadId).toBe("cades_fall");
      // Mock row should now hold the flag.
      const flags = (mockProgressRow?.gameData.narrativeFlags ?? {}) as Record<
        string,
        boolean
      >;
      expect(flags.xgame_cades_fall_expulsion).toBe(true);
    });

    it("is idempotent — second emit reports alreadyEmitted=true", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createAuthContext(9003));
      await caller.crossGameThreads.emit({
        beatId: "programmers_gift_loredex_award",
        emittedBy: "loredex",
      });
      const second = await caller.crossGameThreads.emit({
        beatId: "programmers_gift_loredex_award",
        emittedBy: "loredex",
      });
      expect(second.alreadyEmitted).toBe(true);
    });
  });

  describe("status", () => {
    it("rejects unknown thread ids", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createAuthContext());
      await expect(
        caller.crossGameThreads.status({ threadId: "does_not_exist" }),
      ).rejects.toThrow(/Unknown thread/);
    });

    it("reports per-beat emit state with totals + complete flag", async () => {
      const { appRouter } = await import("./routers");
      const caller = appRouter.createCaller(createAuthContext(9004));
      // Emit one beat from the cades_fall thread.
      await caller.crossGameThreads.emit({
        beatId: "cades_fall_expulsion",
      });
      const status = await caller.crossGameThreads.status({
        threadId: "cades_fall",
      });
      expect(status.threadId).toBe("cades_fall");
      expect(status.totalBeats).toBe(3);
      expect(status.totalEmitted).toBe(1);
      expect(status.complete).toBe(false);
      const expulsion = status.beats.find(
        (b) => b.id === "cades_fall_expulsion",
      );
      expect(expulsion?.emitted).toBe(true);
      const fall = status.beats.find((b) => b.id === "cades_fall_fall");
      expect(fall?.emitted).toBe(false);
    });
  });
});
