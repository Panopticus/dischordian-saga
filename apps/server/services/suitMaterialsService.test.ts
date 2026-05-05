/**
 * Tests for grantSuitMaterials.
 *
 * The service queries the player's primary citizen, merges grants
 * into the existing pouch, and writes back. No live DB in this test
 * env — we hand-roll a mock DrizzleDb that records the merge.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

type AnyRecord = Record<string, unknown>;

interface MockState {
  rows: AnyRecord[];
  lastUpdate?: AnyRecord;
  // mock-getDb hook flips this on; the import of getDb resolves to a
  // function that returns the fake we install per-test.
  fake: AnyRecord | null;
}

const mockState: MockState = { rows: [], lastUpdate: undefined, fake: null };

vi.mock("../db", () => ({
  getDb: () => Promise.resolve(mockState.fake),
}));

beforeEach(() => {
  mockState.rows = [];
  mockState.lastUpdate = undefined;
  mockState.fake = null;
});

function makeFakeDb(rows: AnyRecord[]) {
  mockState.rows = [...rows];
  const select = () => ({
    from: () => ({
      where: () => ({
        limit: () => Promise.resolve(mockState.rows),
      }),
    }),
  });
  const update = () => ({
    set: (patch: AnyRecord) => ({
      where: () => {
        mockState.lastUpdate = patch;
        return Promise.resolve();
      },
    }),
  });
  mockState.fake = { select, update };
}

describe("grantSuitMaterials", () => {
  it("no-ops when grants is empty", async () => {
    makeFakeDb([{ id: 1, suitMaterials: {} }]);
    const { grantSuitMaterials } = await import("./suitMaterialsService");
    const added = await grantSuitMaterials(42, []);
    expect(added).toBe(0);
    expect(mockState.lastUpdate).toBeUndefined();
  });

  it("no-ops when DB is unavailable", async () => {
    mockState.fake = null;
    const { grantSuitMaterials } = await import("./suitMaterialsService");
    const added = await grantSuitMaterials(42, [
      { materialId: "brass-plate", count: 3 },
    ]);
    expect(added).toBe(0);
  });

  it("no-ops when player has no primary citizen", async () => {
    makeFakeDb([]); // no rows
    const { grantSuitMaterials } = await import("./suitMaterialsService");
    const added = await grantSuitMaterials(42, [
      { materialId: "brass-plate", count: 3 },
    ]);
    expect(added).toBe(0);
    expect(mockState.lastUpdate).toBeUndefined();
  });

  it("adds materials onto a fresh (empty) pouch", async () => {
    makeFakeDb([{ id: 7, suitMaterials: null }]);
    const { grantSuitMaterials } = await import("./suitMaterialsService");
    const added = await grantSuitMaterials(42, [
      { materialId: "brass-plate", count: 3 },
      { materialId: "earth-essence", count: 1 },
    ]);
    expect(added).toBe(4);
    expect(mockState.lastUpdate).toEqual({
      suitMaterials: {
        "brass-plate": 3,
        "earth-essence": 1,
      },
    });
  });

  it("merges into an existing pouch without clobbering siblings", async () => {
    makeFakeDb([
      {
        id: 7,
        suitMaterials: {
          "brass-plate": 5,
          "fire-essence": 2,
          __starterGranted: 1,
        },
      },
    ]);
    const { grantSuitMaterials } = await import("./suitMaterialsService");
    const added = await grantSuitMaterials(42, [
      { materialId: "brass-plate", count: 3 },
      { materialId: "thread-of-null", count: 1 },
    ]);
    expect(added).toBe(4);
    expect(mockState.lastUpdate).toEqual({
      suitMaterials: {
        "brass-plate": 8,
        "fire-essence": 2,
        "thread-of-null": 1,
        __starterGranted: 1,
      },
    });
  });

  it("ignores grants with non-positive counts but still applies the rest", async () => {
    makeFakeDb([{ id: 7, suitMaterials: {} }]);
    const { grantSuitMaterials } = await import("./suitMaterialsService");
    const added = await grantSuitMaterials(42, [
      { materialId: "brass-plate", count: 0 },
      { materialId: "earth-essence", count: -3 },
      { materialId: "fire-essence", count: 2 },
    ]);
    expect(added).toBe(2);
    expect(mockState.lastUpdate).toEqual({
      suitMaterials: { "fire-essence": 2 },
    });
  });
});
