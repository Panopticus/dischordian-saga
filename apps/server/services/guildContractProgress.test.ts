/**
 * Tests for the F.2 weekly contract progress service.
 *
 * The DB-touching paths are tested via a mocked drizzle client; the
 * test focus is on the source→contract mapping logic and the
 * tryCompleteContract decision-tree (unknown id, below target,
 * already-complete idempotency, fresh completion).
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

import { WEEKLY_CONTRACTS } from "../../shared/guildContracts";

/* ─── Mock setup ─── */

interface FakeRow {
  userId: number;
  weekId: string;
  contractId: string;
  progressCount: number;
  completedAt: Date | null;
}

const fakeRows: FakeRow[] = [];
const upsertCalls: Array<{ userId: number; weekId: string; contractId: string; progressCount: number; completedAt?: Date }> = [];
const selectCalls: Array<{ userId: number; weekId: string; contractId?: string }> = [];

function reset() {
  fakeRows.length = 0;
  upsertCalls.length = 0;
  selectCalls.length = 0;
}

const fakeDb = {
  select: () => ({
    from: () => ({
      where: (predicate: { userId: number; weekId: string; contractId?: string }) => {
        selectCalls.push(predicate);
        const rowsForUser = fakeRows.filter(
          (r) => r.userId === predicate.userId && r.weekId === predicate.weekId,
        );
        const filtered = predicate.contractId
          ? rowsForUser.filter((r) => r.contractId === predicate.contractId)
          : rowsForUser;
        return {
          limit: () => Promise.resolve(filtered),
          // No .limit(): the listAvailable path uses await directly.
          then: (cb: (rows: FakeRow[]) => unknown) => Promise.resolve(filtered).then(cb),
        };
      },
    }),
  }),
  insert: () => ({
    values: (v: { userId: number; weekId: string; contractId: string; progressCount: number; completedAt?: Date }) => ({
      onDuplicateKeyUpdate: ({ set }: { set: { progressCount?: { _delta?: number }; completedAt?: Date } }) => {
        upsertCalls.push(v);
        const existing = fakeRows.find(
          (r) =>
            r.userId === v.userId &&
            r.weekId === v.weekId &&
            r.contractId === v.contractId,
        );
        if (existing) {
          // The set object in real drizzle is a SQL fragment; here
          // we just bump by the upsert's progressCount value (which
          // matches `amount` in the increment helper).
          if (set.progressCount !== undefined) existing.progressCount += v.progressCount;
          if (set.completedAt) existing.completedAt = set.completedAt;
        } else {
          fakeRows.push({
            userId: v.userId,
            weekId: v.weekId,
            contractId: v.contractId,
            progressCount: v.progressCount,
            completedAt: v.completedAt ?? null,
          });
        }
        return Promise.resolve();
      },
    }),
  }),
};

/* Drizzle's eq/and/sql shims — the fake doesn't need to interpret
 * them, just produce something that the .where() function accepts
 * as a single object. */
vi.mock("drizzle-orm", () => ({
  eq: (col: { name?: string }, val: unknown) => ({ col, val }),
  and: (...preds: { col?: { name?: string }; val?: unknown }[]) => {
    const out: Record<string, unknown> = {};
    for (const p of preds) {
      if (p.col?.name) out[p.col.name] = p.val;
    }
    return out;
  },
  sql: (() => ({ _sql: true })) as unknown,
}));

vi.mock("../db", () => ({
  getDb: () => Promise.resolve(fakeDb),
}));

vi.mock("../logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

vi.mock("../routers/guildContracts", () => ({
  currentWeekId: () => "2026-W18",
}));

/* The schema columns reference the db table; mock with name-only
 * stubs so eq/and can route by column name. */
vi.mock("../../db/schema", () => {
  const col = (name: string) => ({ name });
  return {
    guildContractProgress: {
      userId: col("userId"),
      weekId: col("weekId"),
      contractId: col("contractId"),
      progressCount: col("progressCount"),
    },
  };
});

import {
  incrementContractProgress,
  getContractProgress,
  tryCompleteContract,
} from "./guildContractProgress";

/* ─── Tests ─── */

describe("incrementContractProgress", () => {
  beforeEach(reset);

  it("upserts one row per matching contract for the source", async () => {
    // pvp_win matches exactly one contract: wc_arena_day.
    await incrementContractProgress(42, "pvp_win", 1);
    expect(upsertCalls.length).toBe(1);
    expect(upsertCalls[0].contractId).toBe("wc_arena_day");
    expect(upsertCalls[0].progressCount).toBe(1);
  });

  it("no-ops for sources that have no matching contract", async () => {
    // terminus_boss_kill isn't in any WEEKLY_CONTRACTS entry today.
    await incrementContractProgress(42, "terminus_boss_kill", 1);
    expect(upsertCalls.length).toBe(0);
  });

  it("trade_volume passes the credit amount through as the increment", async () => {
    await incrementContractProgress(42, "trade_volume", 1500);
    expect(upsertCalls[0].contractId).toBe("wc_trade_caravan");
    expect(upsertCalls[0].progressCount).toBe(1500);
  });
});

describe("getContractProgress", () => {
  beforeEach(reset);

  it("returns all 8 contracts with progressCount=0 when no rows exist", async () => {
    const rows = await getContractProgress(42);
    expect(rows.length).toBe(WEEKLY_CONTRACTS.length);
    for (const r of rows) {
      expect(r.progressCount).toBe(0);
      expect(r.completed).toBe(false);
    }
  });

  it("hydrates progressCount + completed from existing rows", async () => {
    fakeRows.push({
      userId: 42,
      weekId: "2026-W18",
      contractId: "wc_arena_day",
      progressCount: 3,
      completedAt: new Date(),
    });
    fakeRows.push({
      userId: 42,
      weekId: "2026-W18",
      contractId: "wc_quest_loop",
      progressCount: 2,
      completedAt: null,
    });
    const rows = await getContractProgress(42);
    const arena = rows.find((r) => r.contractId === "wc_arena_day")!;
    expect(arena.progressCount).toBe(3);
    expect(arena.completed).toBe(true);
    const quest = rows.find((r) => r.contractId === "wc_quest_loop")!;
    expect(quest.progressCount).toBe(2);
    expect(quest.completed).toBe(false);
  });
});

describe("tryCompleteContract", () => {
  beforeEach(reset);

  it("rejects unknown contract ids", async () => {
    const r = await tryCompleteContract(42, "wc_does_not_exist");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("unknown_contract");
  });

  it("rejects when progress is below target", async () => {
    fakeRows.push({
      userId: 42,
      weekId: "2026-W18",
      contractId: "wc_arena_day",
      progressCount: 1,
      completedAt: null,
    });
    const r = await tryCompleteContract(42, "wc_arena_day");
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.reason).toBe("below_target");
      expect(r.progressCount).toBe(1);
      expect(r.targetCount).toBe(3);
    }
  });

  it("stamps completedAt when progress meets the target", async () => {
    fakeRows.push({
      userId: 42,
      weekId: "2026-W18",
      contractId: "wc_arena_day",
      progressCount: 3,
      completedAt: null,
    });
    const r = await tryCompleteContract(42, "wc_arena_day");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.alreadyCompleted).toBe(false);
      expect(r.progressCount).toBe(3);
    }
    // Upsert should have been called with completedAt set.
    expect(upsertCalls.some((c) => c.completedAt instanceof Date)).toBe(true);
  });

  it("is idempotent — second call returns alreadyCompleted=true", async () => {
    const completedAt = new Date();
    fakeRows.push({
      userId: 42,
      weekId: "2026-W18",
      contractId: "wc_arena_day",
      progressCount: 3,
      completedAt,
    });
    const r = await tryCompleteContract(42, "wc_arena_day");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.alreadyCompleted).toBe(true);
  });
});
