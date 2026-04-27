import { describe, expect, it, vi, beforeEach } from "vitest";

/**
 * Trade Empire router integration tests.
 *
 * Mirrors apps/server/palimpsestRouter.test.ts mocking style so the
 * suite runs without a real DATABASE_URL. We verify:
 *   1. Wiring — every Phase 2 procedure is registered on appRouter.
 *   2. Class-gate denials — Oracle / Soldier / Spy guards throw
 *      FORBIDDEN when a caller's characterSheets row carries the
 *      wrong class.
 *   3. Dispatch happy path — dispatchMission succeeds against a
 *      fresh user, hits the active-mission ceiling, and rejects
 *      duplicate mission IDs.
 *
 * Live DB-backed coverage lives in apps/server/tradeWars.test.ts
 * (skipped without DATABASE_URL).
 */

let mockSelectResult: unknown[] = [];

vi.mock("./db", () => {
  const builder: Record<string, unknown> = {
    select: () => builder,
    from: () => builder,
    where: () => builder,
    limit: () => Promise.resolve(mockSelectResult),
    then: (onFulfilled: (v: unknown[]) => unknown) =>
      Promise.resolve(mockSelectResult).then(onFulfilled),
  };
  return {
    getDb: vi.fn(async () => ({
      select: () => builder,
      update: () => ({
        set: () => ({
          where: vi.fn().mockResolvedValue(undefined),
        }),
      }),
      insert: () => ({
        values: vi.fn().mockResolvedValue([{ insertId: 1 }]),
      }),
    })),
  };
});

vi.mock("./services/rippleEngine", () => ({
  ripple: {
    emit: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("./services/imprintService", () => ({
  awardFragments: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./services/thoughtVirusService", () => ({
  addLoad: vi.fn().mockResolvedValue(undefined),
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
  };

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

const PHASE_2_PROCEDURES = [
  "tradeEmpire.getState",
  "tradeEmpire.dispatchMission",
  "tradeEmpire.completeMission",
  "tradeEmpire.cancelMission",
  "tradeEmpire.getMyClassAccess",
  "tradeEmpire.unlockClassSector",
  "tradeEmpire.purchaseFutures",
  "tradeEmpire.activateCoverIdentity",
  "tradeEmpire.blowCoverCheck",
  "tradeEmpire.resolveGeneralsDilemma",
  "tradeEmpire.signContract",
  "tradeEmpire.completeContractStage",
  "tradeEmpire.sectorFirstEntered",
  "tradeEmpire.markArrivalCinematicWatched",
  "tradeEmpire.recordRouteRun",
];

describe("tradeEmpire router wiring", () => {
  it("registers every Phase 2 procedure", async () => {
    const { appRouter } = await import("./routers");
    const procs = appRouter._def.procedures as Record<string, unknown>;
    for (const proc of PHASE_2_PROCEDURES) {
      expect(procs[proc], proc).toBeDefined();
    }
  }, 30_000);
});

describe("tradeEmpire class-gate denials", () => {
  beforeEach(() => {
    mockSelectResult = [];
  });

  it("blocks non-Oracle callers from purchaseFutures", async () => {
    mockSelectResult = [{ characterClass: "soldier" }];
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(1001));
    await expect(
      caller.tradeEmpire.purchaseFutures({
        sectorId: "stardock_anchor",
        commodity: "credits",
        cyclesAhead: 1,
        strikePrice: 100,
        projectedPrice: 150,
      }),
    ).rejects.toThrow(/Only Oracles/);
  }, 30_000);

  it("blocks non-Soldier callers from resolveGeneralsDilemma", async () => {
    mockSelectResult = [{ characterClass: "oracle" }];
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(1002));
    await expect(
      caller.tradeEmpire.resolveGeneralsDilemma({ resolution: "expose" }),
    ).rejects.toThrow(/Only Soldiers/);
  });

  it("blocks non-Spy callers from activateCoverIdentity", async () => {
    mockSelectResult = [{ characterClass: "engineer" }];
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(1003));
    await expect(
      caller.tradeEmpire.activateCoverIdentity({
        coverId: "cover_demagi_earth_broker",
        targetFactionId: "demagi_earth",
      }),
    ).rejects.toThrow(/Only Spies/);
  });

  it("rejects unlockClassSector for sectors the class cannot reach", async () => {
    // Engineer's allowlist contains only research_corridor_*, so
    // the Spy-only sector "intelligence_exchange_nightline" must be
    // refused with a FORBIDDEN error.
    mockSelectResult = [{ characterClass: "engineer" }];
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(1004));
    await expect(
      caller.tradeEmpire.unlockClassSector({ sectorId: "intelligence_exchange_nightline" }),
    ).rejects.toThrow(/cannot access sector/);
  });
});

describe("tradeEmpire dispatchMission happy path", () => {
  beforeEach(() => {
    mockSelectResult = [{ gameData: {} }];
  });

  it("succeeds against a fresh user and returns endsAt in the future", async () => {
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(2001));

    const before = Date.now();
    const result = await caller.tradeEmpire.dispatchMission({
      id: "mission_test_alpha",
      name: "Stardock Run",
      sectorId: "stardock_anchor",
      durationMs: 60_000,
      reward: { dream: 50, influence: 5 },
    });

    expect(result.success).toBe(true);
    expect(result.endsAt).toBeGreaterThanOrEqual(before + 60_000);
  }, 30_000);

  it("rejects when the user already has 3 active missions", async () => {
    const now = Date.now();
    const filled = (id: string) => ({
      id,
      name: id,
      sectorId: "s",
      dispatchedAt: now,
      durationMs: 60_000,
      reward: {},
    });
    mockSelectResult = [
      {
        gameData: {
          tradeEmpire: {
            activeMissions: [filled("m1"), filled("m2"), filled("m3")],
            completedMissionIds: [],
            totalMissionsCompleted: 0,
            totalDreamEarned: 0,
            totalInfluenceEarned: 0,
            sectors: {},
          },
        },
      },
    ];

    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(2002));
    const result = await caller.tradeEmpire.dispatchMission({
      id: "m4",
      name: "Overflow",
      sectorId: "s",
      durationMs: 60_000,
      reward: {},
    });
    expect(result).toEqual({ success: false, error: "Maximum 3 active missions" });
  });

  it("rejects duplicate mission IDs", async () => {
    mockSelectResult = [
      {
        gameData: {
          tradeEmpire: {
            activeMissions: [
              {
                id: "dup",
                name: "Duplicate",
                sectorId: "s",
                dispatchedAt: Date.now(),
                durationMs: 60_000,
                reward: {},
              },
            ],
            completedMissionIds: [],
            totalMissionsCompleted: 0,
            totalDreamEarned: 0,
            totalInfluenceEarned: 0,
            sectors: {},
          },
        },
      },
    ];

    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(2003));
    const result = await caller.tradeEmpire.dispatchMission({
      id: "dup",
      name: "Duplicate",
      sectorId: "s",
      durationMs: 60_000,
      reward: {},
    });
    expect(result).toEqual({ success: false, error: "Mission already dispatched" });
  });
});
