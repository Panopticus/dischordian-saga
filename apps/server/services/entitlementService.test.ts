/**
 * Tests for setEntitlement.
 *
 * No live DB / drizzle in this test environment, so we hand-roll a
 * thin mock TxOrDb that captures the merge result. The merge logic
 * is the only interesting behaviour in this module — a successful
 * grant on a fresh row, a no-op grant on an already-set value, and
 * a coexistence grant that preserves other entitlements.
 */
import { describe, it, expect, vi } from "vitest";
import { setEntitlement, isEntitlementKey } from "./entitlementService";

type AnyRecord = Record<string, unknown>;

interface MockTx {
  rows: AnyRecord[];
  lastUpdate?: AnyRecord;
  lastInsert?: AnyRecord;
}

function makeMockTx(initialRows: AnyRecord[]): {
  tx: any;
  state: MockTx;
} {
  const state: MockTx = { rows: [...initialRows] };

  const select = () => ({
    from: () => ({
      where: () => ({
        limit: () => Promise.resolve(state.rows),
      }),
    }),
  });
  const update = () => ({
    set: (patch: AnyRecord) => ({
      where: () => {
        state.lastUpdate = patch;
        return Promise.resolve();
      },
    }),
  });
  const insert = () => ({
    values: (row: AnyRecord) => {
      state.lastInsert = row;
      return Promise.resolve();
    },
  });

  return { tx: { select, update, insert }, state };
}

describe("isEntitlementKey", () => {
  it("accepts the two known keys", () => {
    expect(isEntitlementKey("foundingAuthor")).toBe(true);
    expect(isEntitlementKey("authorsEditionS2")).toBe(true);
  });

  it("rejects unknown values", () => {
    expect(isEntitlementKey("admin")).toBe(false);
    expect(isEntitlementKey(null)).toBe(false);
    expect(isEntitlementKey(123)).toBe(false);
    expect(isEntitlementKey(undefined)).toBe(false);
  });
});

describe("setEntitlement", () => {
  it("creates a userProgress row when none exists", async () => {
    const { tx, state } = makeMockTx([]);
    const result = await setEntitlement(tx, 42, "foundingAuthor", true);

    expect(result.changed).toBe(true);
    expect(state.lastInsert).toEqual({
      userId: 42,
      gameData: { entitlements: { foundingAuthor: true } },
    });
    expect(state.lastUpdate).toBeUndefined();
  });

  it("merges into existing entitlements without clobbering siblings", async () => {
    const { tx, state } = makeMockTx([
      {
        gameData: {
          battlePassTier: 12,
          entitlements: { authorsEditionS2: true, foundingAuthor: false },
          narrativeFlags: { act_3_completed: true },
        },
      },
    ]);
    const result = await setEntitlement(tx, 7, "foundingAuthor", true);

    expect(result.changed).toBe(true);
    expect(state.lastUpdate).toEqual({
      gameData: {
        battlePassTier: 12,
        entitlements: { authorsEditionS2: true, foundingAuthor: true },
        narrativeFlags: { act_3_completed: true },
      },
    });
    expect(state.lastInsert).toBeUndefined();
  });

  it("is a no-op when the value is already set (idempotent retry)", async () => {
    const { tx, state } = makeMockTx([
      { gameData: { entitlements: { foundingAuthor: true } } },
    ]);
    const result = await setEntitlement(tx, 1, "foundingAuthor", true);

    expect(result.changed).toBe(false);
    expect(state.lastUpdate).toBeUndefined();
    expect(state.lastInsert).toBeUndefined();
  });

  it("creates the entitlements sub-object when missing on existing gameData", async () => {
    const { tx, state } = makeMockTx([
      { gameData: { battlePassTier: 5 } },
    ]);
    const result = await setEntitlement(tx, 99, "authorsEditionS2", true);

    expect(result.changed).toBe(true);
    expect(state.lastUpdate).toEqual({
      gameData: {
        battlePassTier: 5,
        entitlements: { authorsEditionS2: true },
      },
    });
  });

  it("supports revoking by passing value=false", async () => {
    const { tx, state } = makeMockTx([
      { gameData: { entitlements: { foundingAuthor: true } } },
    ]);
    const result = await setEntitlement(tx, 1, "foundingAuthor", false);

    expect(result.changed).toBe(true);
    expect(state.lastUpdate).toEqual({
      gameData: { entitlements: { foundingAuthor: false } },
    });
  });
});

// Suppress unused-import warning for vi in case the mock above is
// later refactored away. vi is referenced indirectly via vitest globals.
void vi;
