/* ═══════════════════════════════════════════════════════
   CRAFTING REWARDS — DB round-trip tests (mocked driver)

   The service layer in services/craftingRewards.ts actually
   touches the database on `award()`. These tests stub the
   Drizzle client with a tiny in-memory table so we can
   exercise the real select/update/insert branches without
   requiring a live MySQL instance.

   Coverage:
   - award() on a user with no userProgress row → insert path
   - award() on a user with existing materials → merge path
   - award() preserves other keys in gameData
   - award() skips zero / negative amounts
   - award() returns null when getDb() yields nothing
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect, vi, beforeEach } from "vitest";

/* ─── Tiny in-memory Drizzle stand-in ─── */

interface ProgressRow {
  userId: number;
  franchiseId: string;
  gameData: Record<string, unknown>;
}

const rows: ProgressRow[] = [];

function resetRows(): void {
  rows.length = 0;
}

// The mock mirrors Drizzle's builder chain just enough for award() to
// work: select().from().where().limit() returns a filtered row list,
// update().set().where() updates in place, and insert().values() pushes.
function buildFakeDb() {
  return {
    select() {
      let pending: ProgressRow[] = [];
      const builder = {
        from(_table: unknown) {
          pending = [...rows];
          return builder;
        },
        where(_cond: unknown) {
          // `and(eq(userId, X), eq(franchiseId, Y))` is opaque here, so
          // in this stub we assume the caller always scopes queries to
          // the single row in `rows` that matches — tests stage exactly
          // the rows they need. For first-time callers (`rows` empty)
          // the filter naturally yields [].
          return builder;
        },
        limit(_n: number) {
          return Promise.resolve(pending.slice(0, _n));
        },
      };
      return builder;
    },
    update(_table: unknown) {
      let patch: Partial<ProgressRow> = {};
      const builder = {
        set(p: Partial<ProgressRow>) {
          patch = p;
          return builder;
        },
        where(_cond: unknown) {
          if (rows[0]) {
            rows[0] = { ...rows[0], ...patch } as ProgressRow;
          }
          return Promise.resolve();
        },
      };
      return builder;
    },
    insert(_table: unknown) {
      return {
        values(v: ProgressRow) {
          rows.push(v);
          return Promise.resolve();
        },
      };
    },
  };
}

let dbImpl: unknown = buildFakeDb();

vi.mock("./db", () => ({
  getDb: vi.fn().mockImplementation(() => Promise.resolve(dbImpl)),
}));

vi.mock("./logger", () => ({
  logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}));

// Import AFTER the mock is staged so the service binds to the stub.
const { craftingRewards } = await import("./services/craftingRewards");

describe("craftingRewards.award — DB round-trip", () => {
  beforeEach(() => {
    resetRows();
    dbImpl = buildFakeDb();
  });

  it("returns null when the database is unavailable", async () => {
    dbImpl = null;
    const result = await craftingRewards.award(42, { battle_shard: 1 });
    expect(result).toBeNull();
  });

  it("returns null for empty material bags", async () => {
    const result = await craftingRewards.award(42, {});
    expect(result).toBeNull();
    expect(rows.length).toBe(0);
  });

  it("inserts a fresh userProgress row on first award", async () => {
    const result = await craftingRewards.award(42, { battle_shard: 2, stardust: 3 });
    expect(result).toEqual({ battle_shard: 2, stardust: 3 });
    expect(rows.length).toBe(1);
    expect(rows[0].userId).toBe(42);
    expect(rows[0].franchiseId).toBe("dischordian-saga");
    expect(rows[0].gameData).toEqual({ materials: { battle_shard: 2, stardust: 3 } });
  });

  it("merges into an existing row's materials without clobbering other keys", async () => {
    rows.push({
      userId: 42,
      franchiseId: "dischordian-saga",
      gameData: {
        materials: { battle_shard: 1 },
        tradeEmpire: { totalMissionsCompleted: 7 },
        craftingSkills: { weaponsmith: { level: 3, xp: 120 } },
      },
    });

    const result = await craftingRewards.award(42, { battle_shard: 2, iron_ore: 5 });

    expect(result).toEqual({ battle_shard: 3, iron_ore: 5 });
    // Only one row, still with the same identity.
    expect(rows.length).toBe(1);
    expect(rows[0].gameData.materials).toEqual({ battle_shard: 3, iron_ore: 5 });
    // Unrelated gameData keys survive.
    expect(rows[0].gameData.tradeEmpire).toEqual({ totalMissionsCompleted: 7 });
    expect(rows[0].gameData.craftingSkills).toEqual({ weaponsmith: { level: 3, xp: 120 } });
  });

  it("drops zero and negative amounts during the merge", async () => {
    rows.push({
      userId: 42,
      franchiseId: "dischordian-saga",
      gameData: { materials: { card_essence: 4 } },
    });

    const result = await craftingRewards.award(42, {
      card_essence: 0,
      iron_ore: -1,
      stardust: 2,
    });

    expect(result).toEqual({ card_essence: 4, stardust: 2 });
    expect(result?.iron_ore).toBeUndefined();
  });

  it("accepts the legacy `craftingMaterials` key as a fallback source", async () => {
    rows.push({
      userId: 42,
      franchiseId: "dischordian-saga",
      gameData: { craftingMaterials: { stardust: 4 } },
    });

    const result = await craftingRewards.award(42, { stardust: 1 });

    expect(result?.stardust).toBe(5);
    // Writes the canonical `materials` key.
    expect(rows[0].gameData.materials).toBeDefined();
  });
});
