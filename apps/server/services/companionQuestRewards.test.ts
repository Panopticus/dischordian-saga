/**
 * Tests for applyCompanionQuestRewards.
 *
 * Verifies that:
 *   - per-anchor bond deltas land in npc_trust_scalars (insert path
 *     for new anchors, update path for existing rows, clamp to [0,100])
 *   - per-agency standing deltas land in trade_agency_standing (insert
 *     path for new agencies, update path for existing rows)
 *   - zero deltas no-op (skip-cheap)
 *   - missing-DB returns counts of 0 without throwing
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

import type { CompanionQuestDef } from "../../shared/tradeEmpire/companionQuestCatalog";
import { npcTrustScalars, tradeAgencyStanding } from "../../db/schema";

type AnyRecord = Record<string, unknown>;

interface InsertCapture {
  table: unknown;
  values: AnyRecord;
}

interface UpdateCapture {
  table: unknown;
  set: AnyRecord;
}

interface MockState {
  trustRows: AnyRecord[];
  standingRows: AnyRecord[];
  inserts: InsertCapture[];
  updates: UpdateCapture[];
  fake: AnyRecord | null;
}

const mockState: MockState = {
  trustRows: [],
  standingRows: [],
  inserts: [],
  updates: [],
  fake: null,
};

vi.mock("../db", () => ({
  getDb: () => Promise.resolve(mockState.fake),
}));

beforeEach(() => {
  mockState.trustRows = [];
  mockState.standingRows = [];
  mockState.inserts = [];
  mockState.updates = [];
  mockState.fake = null;
});

function installFakeDb(opts: {
  trustRows?: AnyRecord[];
  standingRows?: AnyRecord[];
}) {
  mockState.trustRows = opts.trustRows ?? [];
  mockState.standingRows = opts.standingRows ?? [];
  // Per call, remember which table the latest select.from() touched so
  // the .where().limit() at the end can return the right row set.
  // Compares table args by reference equality against the imported
  // drizzle table objects — robust against any internal name format.
  let pendingTable: unknown = null;
  const select = () => ({
    from: (table: unknown) => {
      pendingTable = table;
      return {
        where: () => ({
          limit: () => {
            const rows =
              pendingTable === npcTrustScalars
                ? mockState.trustRows
                : pendingTable === tradeAgencyStanding
                  ? mockState.standingRows
                  : [];
            return Promise.resolve(rows);
          },
        }),
      };
    },
  });
  const insert = (table: unknown) => ({
    values: (v: AnyRecord) => {
      mockState.inserts.push({ table, values: v });
      return Promise.resolve();
    },
  });
  const update = (table: unknown) => ({
    set: (patch: AnyRecord) => ({
      where: () => {
        mockState.updates.push({ table, set: patch });
        return Promise.resolve();
      },
    }),
  });
  mockState.fake = { select, insert, update };
}

function defWith(overrides: Partial<CompanionQuestDef>): CompanionQuestDef {
  return {
    id: "cq_d_test_anchor_action",
    cadence: "daily",
    anchors: ["elara"],
    sectors: ["ark_debris_field"],
    questType: "explore",
    target: 1,
    title: "Test",
    flavor: "Test flavor.",
    cardLoreHook: { cardId: "s1_pack_id_elara_ship_ai", fragment: "frag" },
    narrativeFlag: "potential.elara.ark_debris_field.test",
    reward: { dream: 1, xp: 1, credits: 1 },
    ...overrides,
  } as CompanionQuestDef;
}

describe("applyCompanionQuestRewards", () => {
  it("inserts new npc_trust_scalars row when bond delta is positive and no row exists", async () => {
    installFakeDb({});
    const { applyCompanionQuestRewards } = await import("./companionQuestRewards");
    const def = defWith({ relationshipDelta: { elara: 3 } });

    const res = await applyCompanionQuestRewards(1, def);

    expect(res.bondsApplied).toBe(1);
    expect(mockState.inserts).toHaveLength(1);
    expect(mockState.inserts[0].table).toBe(npcTrustScalars);
    expect(mockState.inserts[0].values).toMatchObject({
      userId: 1,
      npcId: "elara",
      scalar: 53, // midpoint 50 + 3
      lastUpdatedFromMysteryId: "cq_d_test_anchor_action",
    });
  });

  it("updates existing npc_trust_scalars row by delta, clamping to [0,100]", async () => {
    installFakeDb({ trustRows: [{ id: 7, scalar: 99 }] });
    const { applyCompanionQuestRewards } = await import("./companionQuestRewards");
    const def = defWith({ relationshipDelta: { elara: 5 } });

    const res = await applyCompanionQuestRewards(1, def);

    expect(res.bondsApplied).toBe(1);
    expect(mockState.updates).toHaveLength(1);
    expect(mockState.updates[0].table).toBe(npcTrustScalars);
    expect(mockState.updates[0].set).toMatchObject({ scalar: 100 });
  });

  it("clamps negative deltas at 0", async () => {
    installFakeDb({ trustRows: [{ id: 7, scalar: 2 }] });
    const { applyCompanionQuestRewards } = await import("./companionQuestRewards");
    const def = defWith({ relationshipDelta: { elara: -10 } });

    const res = await applyCompanionQuestRewards(1, def);

    expect(res.bondsApplied).toBe(1);
    expect(mockState.updates[0].set).toMatchObject({ scalar: 0 });
  });

  it("inserts new trade_agency_standing row for fresh agencies", async () => {
    installFakeDb({});
    const { applyCompanionQuestRewards } = await import("./companionQuestRewards");
    const def = defWith({ standingDelta: { hierarchy: 4 } });

    const res = await applyCompanionQuestRewards(1, def);

    expect(res.standingsApplied).toBe(1);
    expect(mockState.inserts).toHaveLength(1);
    expect(mockState.inserts[0].table).toBe(tradeAgencyStanding);
    expect(mockState.inserts[0].values).toMatchObject({
      userId: 1,
      agencyId: "hierarchy",
      standing: 4,
    });
  });

  it("zero deltas are skipped (no insert / update)", async () => {
    installFakeDb({});
    const { applyCompanionQuestRewards } = await import("./companionQuestRewards");
    const def = defWith({
      relationshipDelta: { elara: 0 },
      standingDelta: { hierarchy: 0 },
    });

    const res = await applyCompanionQuestRewards(1, def);

    expect(res.bondsApplied).toBe(0);
    expect(res.standingsApplied).toBe(0);
    expect(mockState.inserts).toHaveLength(0);
    expect(mockState.updates).toHaveLength(0);
  });

  it("missing DB returns zeros without throwing", async () => {
    mockState.fake = null;
    const { applyCompanionQuestRewards } = await import("./companionQuestRewards");
    const def = defWith({
      relationshipDelta: { elara: 5 },
      standingDelta: { hierarchy: 5 },
    });

    const res = await applyCompanionQuestRewards(1, def);
    expect(res).toEqual({ bondsApplied: 0, standingsApplied: 0 });
  });
});
