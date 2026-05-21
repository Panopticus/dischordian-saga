/* ═══════════════════════════════════════════════════════
   NPC DIALOGUES — getWitnessLedger procedure tests

   Structural-only (no live MySQL). Verifies:
     1. The procedure is registered under npcDialogues.
     2. Authentication is required (UNAUTHORIZED for null user).
     3. With a fake DB, the procedure round-trips a flag bag
        through aggregateWitnessLedger correctly.
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { TRPCError } from "@trpc/server";

type AnyRecord = Record<string, unknown>;

interface MockState {
  rows: AnyRecord[];
  fake: AnyRecord | null;
}

const mockState: MockState = { rows: [], fake: null };

vi.mock("../db", () => ({
  getDb: () => Promise.resolve(mockState.fake),
}));

beforeEach(() => {
  mockState.rows = [];
  mockState.fake = null;
});

function installFakeDb(rows: AnyRecord[]) {
  mockState.rows = [...rows];
  const select = () => ({
    from: () => ({
      where: () => ({
        limit: () => Promise.resolve(mockState.rows),
      }),
    }),
  });
  mockState.fake = { select };
}

// First-import of appRouter pulls in the full card registry +
// every router; 5s is too tight on a cold transform. Bump per-
// test timeout for this file to 30s — matches the practice in
// other appRouter-based tests in apps/server/routers/.
const TEST_TIMEOUT = 30_000;

describe("npcDialogues.getWitnessLedger — wiring", () => {
  it(
    "is registered under npcDialogues and rejects unauthenticated callers",
    async () => {
      const { appRouter } = await import("../routers");
      const procedures = appRouter._def.procedures as Record<string, unknown>;
      expect(procedures["npcDialogues.getWitnessLedger"]).toBeDefined();

      const caller = appRouter.createCaller({
        user: null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        req: {} as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        res: {} as any,
      });
      await expect(
        caller.npcDialogues.getWitnessLedger(),
      ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    },
    TEST_TIMEOUT,
  );
});

describe("npcDialogues.getWitnessLedger — aggregation", () => {
  it("returns an empty ledger when the user has no narrative flags", async () => {
    installFakeDb([{ gameData: { narrativeFlags: {} } }]);
    const { appRouter } = await import("../routers");
    const caller = appRouter.createCaller({
      // The procedure only reads ctx.user.id; the rest of the User
      // shape is irrelevant to this test, so the cast is intentional.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user: { id: 1 } as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      req: {} as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      res: {} as any,
    });
    const ledger = await caller.npcDialogues.getWitnessLedger();
    expect(ledger.totalPotentials).toBe(0);
    expect(ledger.arcProgress).toHaveLength(5);
  });

  it("surfaces a daily-quest flag as a per-anchor + per-sector entry", async () => {
    installFakeDb([
      {
        gameData: {
          narrativeFlags: {
            "potential.elara.ark_debris_field.familiar_wreck": true,
          },
        },
      },
    ]);
    const { appRouter } = await import("../routers");
    const caller = appRouter.createCaller({
      // The procedure only reads ctx.user.id; the rest of the User
      // shape is irrelevant to this test, so the cast is intentional.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user: { id: 1 } as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      req: {} as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      res: {} as any,
    });
    const ledger = await caller.npcDialogues.getWitnessLedger();
    expect(ledger.totalPotentials).toBe(1);
    expect(ledger.byAnchor["elara"]).toHaveLength(1);
    expect(ledger.bySector["ark_debris_field"]).toHaveLength(1);
  });

  it("counts arc-finale flags toward season-arc chapter progress", async () => {
    installFakeDb([
      {
        gameData: {
          narrativeFlags: {
            "mystery_episode_complete:arc.memento_dischordia:md.chapter_1": true,
          },
        },
      },
    ]);
    const { appRouter } = await import("../routers");
    const caller = appRouter.createCaller({
      // The procedure only reads ctx.user.id; the rest of the User
      // shape is irrelevant to this test, so the cast is intentional.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user: { id: 1 } as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      req: {} as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      res: {} as any,
    });
    const ledger = await caller.npcDialogues.getWitnessLedger();
    const md = ledger.arcProgress.find((a) => a.arcId === "arc.memento_dischordia");
    expect(md?.closed).toBe(1);
  });

  it("returns an empty ledger when the DB is unavailable", async () => {
    mockState.fake = null;
    const { appRouter } = await import("../routers");
    const caller = appRouter.createCaller({
      // The procedure only reads ctx.user.id; the rest of the User
      // shape is irrelevant to this test, so the cast is intentional.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user: { id: 1 } as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      req: {} as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      res: {} as any,
    });
    const ledger = await caller.npcDialogues.getWitnessLedger();
    expect(ledger.totalPotentials).toBe(0);
  });
});
