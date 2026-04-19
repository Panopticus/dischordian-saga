/* ═══════════════════════════════════════════════════════
   CROSS-GAME THREAD ROUTER — wiring + contract tests

   Like casinoRouter.test.ts, these are structural tests
   that do NOT spin up a live MySQL. They verify:

     1. The router is registered on appRouter under the
        documented namespace (docs/design/AUTHORING_CROSS_
        GAME_THREADS.md).
     2. The `registry` public query matches the shipped
        CROSS_GAME_THREADS data.
     3. `emit` rejects unknown beats with NOT_FOUND before
        touching the database.
     4. `emit` and `list` require an authenticated user.

   Live DB-backed idempotency + flag-set persistence lands
   in the e2e pass.
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { appRouter } from "../routers";
import { CROSS_GAME_THREADS, getAllBeats } from "@shared/crossGameNarrativeThreads";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createUnauthedContext(): TrpcContext {
  return {
    user: null,
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createAuthedContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 42,
    openId: "test-user-42",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "oauth",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    deletedAt: null,
  };
  return {
    user,
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("appRouter wiring — crossGameThread", () => {
  it("registers all three crossGameThread procedures", () => {
    const procedures = appRouter._def.procedures as Record<string, unknown>;
    expect(procedures["crossGameThread.emit"]).toBeDefined();
    expect(procedures["crossGameThread.list"]).toBeDefined();
    expect(procedures["crossGameThread.registry"]).toBeDefined();
  });
});

describe("crossGameThread.registry", () => {
  it("returns every shipped thread with its beat ids", async () => {
    const caller = appRouter.createCaller(createUnauthedContext());
    const result = await caller.crossGameThread.registry();

    expect(result.threads).toHaveLength(CROSS_GAME_THREADS.length);
    for (const shipped of CROSS_GAME_THREADS) {
      const match = result.threads.find((t) => t.id === shipped.id);
      expect(match, `registry missing thread ${shipped.id}`).toBeDefined();
      expect(match?.beatIds).toEqual(shipped.beats.map((b) => b.id));
      expect(match?.participatingGames).toEqual(shipped.participatingGames);
      expect(match?.originGame).toBe(shipped.originGame);
    }
  });

  it("is reachable by an unauthenticated caller", async () => {
    // External games (Cades FPS, Dead Man's Circuit) need to
    // validate beat ids before they authenticate. The registry
    // is intentionally public.
    const caller = appRouter.createCaller(createUnauthedContext());
    await expect(caller.crossGameThread.registry()).resolves.toBeDefined();
  });
});

describe("crossGameThread.emit — authorisation", () => {
  it("rejects unauthenticated callers with UNAUTHORIZED", async () => {
    const caller = appRouter.createCaller(createUnauthedContext());
    // Use a known-valid beat id so the only thing that can fail
    // is the auth middleware.
    const validBeatId = Object.keys(getAllBeats())[0]!;
    await expect(
      caller.crossGameThread.emit({ beatId: validBeatId }),
    ).rejects.toBeInstanceOf(TRPCError);
    await expect(
      caller.crossGameThread.emit({ beatId: validBeatId }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});

describe("crossGameThread.emit — validation", () => {
  it("rejects unknown beat ids with NOT_FOUND", async () => {
    const caller = appRouter.createCaller(createAuthedContext());
    await expect(
      caller.crossGameThread.emit({ beatId: "does_not_exist" }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("rejects empty beat ids with a zod validation error", async () => {
    const caller = appRouter.createCaller(createAuthedContext());
    await expect(
      caller.crossGameThread.emit({ beatId: "" }),
    ).rejects.toBeInstanceOf(TRPCError);
  });
});

describe("crossGameThread.list — authorisation", () => {
  it("rejects unauthenticated callers with UNAUTHORIZED", async () => {
    const caller = appRouter.createCaller(createUnauthedContext());
    await expect(caller.crossGameThread.list()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });
});

describe("crossGameThread — registry integrity", () => {
  it("every shipped beat id maps to a known thread", () => {
    const allBeats = getAllBeats();
    for (const [beatId, beat] of Object.entries(allBeats)) {
      const thread = CROSS_GAME_THREADS.find((t) =>
        t.beats.some((b) => b.id === beatId),
      );
      expect(thread, `orphaned beat ${beatId}`).toBeDefined();
      expect(thread?.participatingGames).toContain(beat.emittedBy);
    }
  });

  it("every beat id produces a non-empty xgame_ flag", () => {
    for (const beatId of Object.keys(getAllBeats())) {
      expect(beatId.length).toBeGreaterThan(0);
      // The router-side flag convention: `xgame_<beatId>`.
      expect(`xgame_${beatId}`).toMatch(/^xgame_[a-z0-9_]+$/);
    }
  });
});
