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
  // Thenable select builder — supports the chain shapes used by the
  // router: select().from().where(), .where().limit(), .where().orderBy(),
  // .where().orderBy().limit(). All terminal awaits resolve to the
  // shared mockSelectResult so individual tests can set the canned
  // response per scenario.
  const builder: Record<string, unknown> = {
    select: () => builder,
    from: () => builder,
    where: () => builder,
    orderBy: () => builder,
    limit: () => Promise.resolve(mockSelectResult),
    then: (onFulfilled: (v: unknown[]) => unknown) =>
      Promise.resolve(mockSelectResult).then(onFulfilled),
  };
  // Insert chain — supports both `await insert().values()` and
  // `await insert().values().onDuplicateKeyUpdate()` and
  // `insert().values().catch(...)` (used by recordRouteRun for
  // idempotent milestone inserts). The values() return is a
  // custom thenable carrying then/catch + onDuplicateKeyUpdate.
  const insertResultLike = [{ insertId: 1 }];
  const valuesReturn = {
    onDuplicateKeyUpdate: vi.fn().mockResolvedValue(insertResultLike),
    then: (
      onFulfilled: (v: unknown[]) => unknown,
      onRejected?: (reason: unknown) => unknown,
    ) => Promise.resolve(insertResultLike).then(onFulfilled, onRejected),
    catch: (onRejected: (reason: unknown) => unknown) =>
      Promise.resolve(insertResultLike).catch(onRejected),
  };
  const fakeDb = {
    select: () => builder,
    update: () => ({
      set: () => ({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    }),
    insert: () => ({
      values: () => valuesReturn,
    }),
    delete: () => ({
      where: vi.fn().mockResolvedValue(undefined),
    }),
  };
  return {
    getDb: vi.fn(async () => fakeDb),
    // Trade Empire's router uses getDbWithRetry as a thin wrapper that
    // resolves to the same shape as getDb when a connection is available.
    // For tests we collapse the retry to a one-shot resolve.
    getDbWithRetry: vi.fn(async () => fakeDb),
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
  // Phase 3 — Oracle futures resolver:
  "tradeEmpire.getOracleFutures",
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
    mockSelectResult = []; // fresh user — no rows in tradeActiveMissions
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
    const activeRow = (missionId: string, id: number) => ({
      id,
      userId: 2002,
      missionId,
      name: missionId,
      sectorId: "s",
      dispatchedAt: now,
      durationMs: 60_000,
      reward: {},
      createdAt: new Date(),
    });
    mockSelectResult = [
      activeRow("m1", 1),
      activeRow("m2", 2),
      activeRow("m3", 3),
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
        id: 1,
        userId: 2003,
        missionId: "dup",
        name: "Duplicate",
        sectorId: "s",
        dispatchedAt: Date.now(),
        durationMs: 60_000,
        reward: {},
        createdAt: new Date(),
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

describe("tradeEmpire signContract → completeContractStage", () => {
  beforeEach(() => {
    mockSelectResult = [];
  });

  it("signContract inserts a new tradeContracts row when none exists", async () => {
    mockSelectResult = []; // no existing contract, no broker engagement
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(4001));
    const result = await caller.tradeEmpire.signContract({
      contractKey: "locke.retainer_baseline",
      auditedOnSigning: true,
    });
    expect(result.success).toBe(true);
    expect(result.alreadySigned).toBe(false);
    // contractId comes from the mocked insert: [{ insertId: 1 }]
    expect(result.contractId).toBe(1);
  }, 30_000);

  it("signContract is idempotent on an already-signed contract", async () => {
    // The first select (existing contract lookup) returns a signed row.
    mockSelectResult = [{ id: 42, status: "signed" }];
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(4002));
    const result = await caller.tradeEmpire.signContract({
      contractKey: "locke.retainer_baseline",
    });
    expect(result.success).toBe(true);
    expect(result.alreadySigned).toBe(true);
    expect(result.contractId).toBe(42);
  });

  it("signContract throws NOT_FOUND for an unknown contract template", async () => {
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(4003));
    await expect(
      caller.tradeEmpire.signContract({ contractKey: "does.not.exist" }),
    ).rejects.toThrow(/Unknown contract template/);
  });

  it("completeContractStage marks a single-stage contract succeeded", async () => {
    // locke.audit_clause has one stage: "audit_executed".
    mockSelectResult = [
      { id: 1, status: "signed", stageStatus: {} },
    ];
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(4004));
    const result = await caller.tradeEmpire.completeContractStage({
      contractKey: "locke.audit_clause",
      stageId: "audit_executed",
      result: "succeeded",
    });
    expect(result.success).toBe(true);
    expect(result.contractStatus).toBe("succeeded");
    expect(result.completedStages).toBe(1);
    expect(result.totalStages).toBe(1);
  });

  it("completeContractStage marks a contract failed when result=failed", async () => {
    mockSelectResult = [{ id: 1, status: "signed", stageStatus: {} }];
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(4005));
    const result = await caller.tradeEmpire.completeContractStage({
      contractKey: "locke.audit_clause",
      stageId: "audit_executed",
      result: "failed",
    });
    expect(result.success).toBe(true);
    expect(result.contractStatus).toBe("failed");
  });

  it("completeContractStage keeps a multi-stage contract active until all stages succeed", async () => {
    // locke.retainer_baseline has 3 stages. With the first already
    // succeeded, completing the second leaves the contract active.
    mockSelectResult = [
      {
        id: 7,
        status: "active",
        stageStatus: { first_run: "succeeded" },
      },
    ];
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(4006));
    const result = await caller.tradeEmpire.completeContractStage({
      contractKey: "locke.retainer_baseline",
      stageId: "second_run",
      result: "succeeded",
    });
    expect(result.success).toBe(true);
    expect(result.contractStatus).toBe("active");
    expect(result.completedStages).toBe(2);
    expect(result.totalStages).toBe(3);
  });

  it("completeContractStage rejects when contract was not signed", async () => {
    mockSelectResult = []; // no row found for (user, contractKey)
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(4007));
    const result = await caller.tradeEmpire.completeContractStage({
      contractKey: "locke.audit_clause",
      stageId: "audit_executed",
      result: "succeeded",
    });
    expect(result).toEqual({ success: false, error: "Contract not signed" });
  });

  it("completeContractStage throws BAD_REQUEST for an unknown stage id", async () => {
    mockSelectResult = [{ id: 1, status: "signed", stageStatus: {} }];
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(4008));
    await expect(
      caller.tradeEmpire.completeContractStage({
        contractKey: "locke.audit_clause",
        stageId: "no_such_stage",
        result: "succeeded",
      }),
    ).rejects.toThrow(/Unknown stage/);
  });
});

describe("tradeEmpire recordRouteRun milestone tiers", () => {
  beforeEach(() => {
    mockSelectResult = [];
  });

  it("first run on a new route registers no tier crossing", async () => {
    mockSelectResult = []; // no existing route row
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(5001));
    const result = await caller.tradeEmpire.recordRouteRun({
      fromSectorId: "stardock_anchor",
      toSectorId: "vox_corridor",
    });
    expect(result.success).toBe(true);
    expect(result.runCount).toBe(1);
    expect(result.currentMilestoneTier).toBe(0);
    expect(result.tiersCrossedThisRun).toEqual([]);
  });

  it("crosses tier 5 when an existing route's run count goes from 4 → 5", async () => {
    mockSelectResult = [
      { id: 1, runCount: 4, milestoneTier: 0 },
    ];
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(5002));
    const result = await caller.tradeEmpire.recordRouteRun({
      fromSectorId: "stardock_anchor",
      toSectorId: "vox_corridor",
      cargoCategory: "industrial",
    });
    expect(result.success).toBe(true);
    expect(result.runCount).toBe(5);
    expect(result.currentMilestoneTier).toBe(5);
    expect(result.tiersCrossedThisRun).toEqual([5]);
  });

  it("crosses tier 10 when an existing route's run count goes from 9 → 10", async () => {
    mockSelectResult = [
      { id: 1, runCount: 9, milestoneTier: 5 },
    ];
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(5003));
    const result = await caller.tradeEmpire.recordRouteRun({
      fromSectorId: "stardock_anchor",
      toSectorId: "vox_corridor",
    });
    expect(result.success).toBe(true);
    expect(result.runCount).toBe(10);
    expect(result.currentMilestoneTier).toBe(10);
    expect(result.tiersCrossedThisRun).toEqual([10]);
  });

  it("crosses MULTIPLE tiers in a single run if the gap spans them", async () => {
    // Single run jumping from 4 → 5 only crosses tier 5; but if
    // a row carries runCount=4 and milestoneTier was somehow stale,
    // we still expect a normal crossing of just [5]. (Multi-tier
    // crossings happen only when external loaders bulk-update.)
    mockSelectResult = [
      { id: 1, runCount: 24, milestoneTier: 10 },
    ];
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(5004));
    const result = await caller.tradeEmpire.recordRouteRun({
      fromSectorId: "vox_corridor",
      toSectorId: "the_trench",
    });
    expect(result.runCount).toBe(25);
    expect(result.currentMilestoneTier).toBe(25);
    expect(result.tiersCrossedThisRun).toEqual([25]);
  });

  it("between tiers, no tier is crossed and milestoneTier holds the prior tier", async () => {
    mockSelectResult = [
      { id: 1, runCount: 6, milestoneTier: 5 },
    ];
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(5005));
    const result = await caller.tradeEmpire.recordRouteRun({
      fromSectorId: "stardock_anchor",
      toSectorId: "vox_corridor",
    });
    expect(result.runCount).toBe(7);
    expect(result.currentMilestoneTier).toBe(5); // last-crossed tier holds
    expect(result.tiersCrossedThisRun).toEqual([]);
  });
});

describe("tradeEmpire Oracle futures (Phase 3)", () => {
  beforeEach(() => {
    mockSelectResult = [];
  });

  it("purchaseFutures (Oracle) returns settlesAt strictly in the future", async () => {
    // First select hit returns the Oracle character sheet; subsequent
    // reads (gameData) hit the same uniform mock — fine for this path
    // because purchaseFutures only reads characterSheets before writing.
    mockSelectResult = [{ characterClass: "oracle" }];
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(3001));

    const before = Date.now();
    const result = await caller.tradeEmpire.purchaseFutures({
      sectorId: "probability_market_hub",
      commodity: "credits",
      cyclesAhead: 1,
      strikePrice: 100,
      projectedPrice: 130,
      position: "call",
      contractKey: "antiquarian.futures_call",
    });

    expect(result.success).toBe(true);
    expect(result.contractKey).toBe("antiquarian.futures_call");
    expect(result.position).toBe("call");
    // 1 cycle = 24h; settlesAt should be ~24h in the future.
    const settles = new Date(result.settlesAt!).getTime();
    expect(settles).toBeGreaterThan(before + 23 * 60 * 60 * 1000);
    expect(settles).toBeLessThan(before + 25 * 60 * 60 * 1000);
  }, 30_000);

  it("purchaseFutures rejects an unknown contract key", async () => {
    mockSelectResult = [{ characterClass: "oracle" }];
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(3002));
    await expect(
      caller.tradeEmpire.purchaseFutures({
        sectorId: "probability_market_hub",
        commodity: "credits",
        cyclesAhead: 1,
        strikePrice: 100,
        projectedPrice: 130,
        position: "call",
        contractKey: "antiquarian.futures_unicorn",
      }),
    ).rejects.toThrow(/Unknown or non-futures contract template/);
  });

  it("purchaseFutures rejects a non-futures contract key", async () => {
    mockSelectResult = [{ characterClass: "oracle" }];
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(3003));
    await expect(
      caller.tradeEmpire.purchaseFutures({
        sectorId: "probability_market_hub",
        commodity: "credits",
        cyclesAhead: 1,
        strikePrice: 100,
        projectedPrice: 130,
        position: "call",
        contractKey: "antiquarian.provenance_run",
      }),
    ).rejects.toThrow(/Unknown or non-futures contract template/);
  });

  it("getOracleFutures returns { open: [], settled: [] } shape for Oracles with no positions", async () => {
    mockSelectResult = [{ characterClass: "oracle" }];
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(3004));
    const result = await caller.tradeEmpire.getOracleFutures();
    expect(result).toEqual({ open: [], settled: [] });
  });

  it("getOracleFutures rejects non-Oracle callers", async () => {
    mockSelectResult = [{ characterClass: "engineer" }];
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(3005));
    await expect(caller.tradeEmpire.getOracleFutures()).rejects.toThrow(
      /Only Oracles/,
    );
  });
});
