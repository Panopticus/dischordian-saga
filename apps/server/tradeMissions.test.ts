import { describe, expect, it, vi, beforeEach } from "vitest";
import { getTableName } from "drizzle-orm";

/* ═══════════════════════════════════════════════════════
   Trade Missions router — vertical slice integration tests.

   Mirrors the mock style used by tradeEmpireRouter.test.ts but
   carries a slightly richer fake-db so the complete() mutation
   (which sequences several reads/writes inside a transaction)
   can exercise its full reward-application path.

   Three tests covering the audit's required surface (audit §6
   item 1):
     1. accept() flips an `available` row to `active`.
     2. complete() applies rewardPayload (credits ↑).
     3. complete() writes the catalog's narrative flags.
   ═══════════════════════════════════════════════════════ */

// In-memory state. Each test seeds whichever rows the router will
// read; the fake builder dispatches reads by inspecting which table
// is on the .from() call. Writes are recorded on `mutations` so we
// can assert on them.
interface FakeRow extends Record<string, unknown> {
  __table?: string;
}

let missionsRows: FakeRow[] = [];
let agencyStandingRows: FakeRow[] = [];
let characterSheetRows: FakeRow[] = [];
let dreamBalanceRows: FakeRow[] = [];
let userProgressRows: FakeRow[] = [];

const mutations: Array<{ kind: string; table: string; payload: unknown }> = [];

function makeBuilder(initialTable: string | null = null): Record<string, unknown> {
  let currentTable = initialTable;
  let lastResult: FakeRow[] = [];
  const builder: Record<string, unknown> = {};
  builder.select = () => builder;
  builder.from = (tbl: unknown) => {
    // drizzle stores the SQL name behind the `Symbol(drizzle:Name)` symbol;
    // getTableName(...) is the public accessor.
    try {
      currentTable = getTableName(tbl as Parameters<typeof getTableName>[0]);
    } catch {
      currentTable = null;
    }
    return builder;
  };
  builder.where = () => builder;
  builder.orderBy = () => builder;
  builder.limit = (_n?: number) => {
    return Promise.resolve(rowsForTable(currentTable));
  };
  // Awaiting the chain without .limit() returns rowsForTable too.
  builder.then = (
    onFulfilled: (v: FakeRow[]) => unknown,
    onRejected?: (reason: unknown) => unknown,
  ) => Promise.resolve(rowsForTable(currentTable)).then(onFulfilled, onRejected);
  return builder;

  function rowsForTable(name: string | null): FakeRow[] {
    switch (name) {
      case "trade_missions":
        return missionsRows;
      case "trade_agency_standing":
        return agencyStandingRows;
      case "character_sheets":
        return characterSheetRows;
      case "dream_balance":
        return dreamBalanceRows;
      case "user_progress":
        return userProgressRows;
      default:
        return lastResult;
    }
  }
}

interface FakeDb {
  select: () => Record<string, unknown>;
  update: (table: unknown) => { set: (payload: Record<string, unknown>) => { where: (...args: unknown[]) => Promise<unknown> } };
  insert: (table: unknown) => { values: (payload: unknown) => Promise<unknown> };
  delete: () => { where: (...args: unknown[]) => Promise<unknown> };
  transaction: <T,>(cb: (tx: FakeDb) => Promise<T>) => Promise<T>;
}

vi.mock("./db", () => {
  function fakeDb(): FakeDb {
    const db: FakeDb = {
      select: () => {
        const b = makeBuilder();
        return (b.select as () => Record<string, unknown>)();
      },
      update: (table: unknown) => ({
        set: (payload: Record<string, unknown>) => ({
          where: vi.fn().mockImplementation(async () => {
            const tbl = (() => {
              try { return getTableName(table as Parameters<typeof getTableName>[0]); }
              catch { return "?"; }
            })();
            mutations.push({ kind: "update", table: tbl, payload });
            // Apply credit/dream updates to in-memory rows so subsequent
            // reads see them. We approximate sql`a + b` increments by
            // bumping a numeric column when the payload value is a
            // SQL chunk (pure object) — too coarse to evaluate the
            // expression, but sufficient for the in-test sequence.
            // For simple object payloads (acceptedAt, completedAt,
            // status), we just patch the field literal.
            for (const row of allRowsForTable(tbl)) {
              for (const [k, v] of Object.entries(payload)) {
                if (typeof v === "number" || typeof v === "string" || v instanceof Date) {
                  row[k] = v;
                }
              }
            }
            return undefined;
          }),
        }),
      }),
      insert: (table: unknown) => ({
        values: (payload: unknown) => {
          const tbl = (() => {
            try { return getTableName(table as Parameters<typeof getTableName>[0]); }
            catch { return "?"; }
          })();
          mutations.push({ kind: "insert", table: tbl, payload });
          // Append to the in-memory rows so subsequent reads see it.
          const rows = Array.isArray(payload) ? payload : [payload];
          for (const r of rows as FakeRow[]) {
            allRowsForTable(tbl).push({
              ...r,
              id: (r.id as number | undefined) ?? Math.floor(Math.random() * 1e6),
            });
          }
          return Promise.resolve([{ insertId: 1 }]);
        },
      }),
      delete: () => ({ where: vi.fn().mockResolvedValue(undefined) }),
      // The router's transaction(...) callback accepts a tx object;
      // we just hand back the db itself so all reads/writes route
      // through the same fakes.
      transaction: async <T,>(cb: (tx: FakeDb) => Promise<T>): Promise<T> => cb(db),
    };
    return db;
  }
  return {
    getDb: vi.fn(async () => fakeDb()),
    getDbWithRetry: vi.fn(async () => fakeDb()),
  };
});

function allRowsForTable(name: string): FakeRow[] {
  switch (name) {
    case "trade_missions":
      return missionsRows;
    case "trade_agency_standing":
      return agencyStandingRows;
    case "character_sheets":
      return characterSheetRows;
    case "dream_balance":
      return dreamBalanceRows;
    case "user_progress":
      return userProgressRows;
    default:
      return [];
  }
}

import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId = 9001): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `tm-test-${userId}`,
    email: `tm${userId}@example.com`,
    name: `TM User ${userId}`,
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

beforeEach(() => {
  missionsRows = [];
  agencyStandingRows = [];
  characterSheetRows = [];
  dreamBalanceRows = [];
  userProgressRows = [];
  mutations.length = 0;
});

describe("tradeMissions.accept", () => {
  it("flips status from available to active", async () => {
    missionsRows.push({
      id: 11,
      userId: 9001,
      missionDefId: "tm_freeport_manifest",
      status: "available",
      agencyId: null,
      offeredAt: new Date(),
      acceptedAt: null,
      completedAt: null,
      rewardPayload: null,
    });

    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(9001));
    const result = await caller.tradeMissions.accept({ id: 11 });
    expect(result.success).toBe(true);
    expect(result.id).toBe(11);

    const updated = mutations.find(
      (m) => m.kind === "update" && m.table === "trade_missions",
    );
    expect(updated).toBeDefined();
    expect((updated!.payload as { status?: string }).status).toBe("active");
    expect((updated!.payload as { acceptedAt?: Date }).acceptedAt).toBeInstanceOf(Date);
  }, 30_000);
});

describe("tradeMissions.complete", () => {
  it("applies the reward payload — credits update fires for the active row", async () => {
    // Pick a tier-1 Coda mission with a credits reward.
    // tm_coda_dead_drop_pickup grants 400 credits.
    missionsRows.push({
      id: 22,
      userId: 9002,
      missionDefId: "tm_coda_dead_drop_pickup",
      status: "active",
      agencyId: "coda_central",
      offeredAt: new Date(),
      acceptedAt: new Date(),
      completedAt: null,
      rewardPayload: null,
    });
    characterSheetRows.push({ userId: 9002, credits: 1000 });
    userProgressRows.push({ userId: 9002, gameData: {} });

    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(9002));
    const result = await caller.tradeMissions.complete({ id: 22 });
    expect(result.success).toBe(true);
    expect(result.reward.credits).toBe(400);

    // The credits update fires against the character_sheets table.
    const creditsUpdate = mutations.find(
      (m) =>
        m.kind === "update" &&
        m.table === "character_sheets" &&
        "credits" in (m.payload as Record<string, unknown>),
    );
    expect(creditsUpdate).toBeDefined();

    // The status flip lands at the end.
    const completed = mutations
      .filter((m) => m.kind === "update" && m.table === "trade_missions")
      .find((m) => (m.payload as { status?: string }).status === "completed");
    expect(completed).toBeDefined();
    expect((completed!.payload as { rewardPayload?: unknown }).rewardPayload).toBeDefined();
  }, 30_000);

  it("writes the catalog's narrative flags into userProgress.gameData", async () => {
    // tm_vex_listening_post sets the "vex_first_contact" flag.
    missionsRows.push({
      id: 33,
      userId: 9003,
      missionDefId: "tm_vex_listening_post",
      status: "active",
      agencyId: "vex_solene",
      offeredAt: new Date(),
      acceptedAt: new Date(),
      completedAt: null,
      rewardPayload: null,
    });
    characterSheetRows.push({ userId: 9003, credits: 0 });
    userProgressRows.push({ userId: 9003, gameData: {} });

    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createAuthContext(9003));
    const result = await caller.tradeMissions.complete({ id: 33 });
    expect(result.success).toBe(true);

    // setNarrativeFlag(...) writes via update() against user_progress
    // with a gameData payload containing narrativeFlags.vex_first_contact.
    const flagWrite = mutations.find(
      (m) =>
        m.kind === "update" &&
        m.table === "user_progress" &&
        "gameData" in (m.payload as Record<string, unknown>),
    );
    expect(flagWrite).toBeDefined();
    const gameData = (flagWrite!.payload as { gameData: Record<string, unknown> }).gameData;
    const flags = gameData.narrativeFlags as Record<string, boolean>;
    expect(flags.vex_first_contact).toBe(true);
  }, 30_000);
});
