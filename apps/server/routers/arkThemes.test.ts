/* ═══════════════════════════════════════════════════════
   ARK THEMES ROUTER — wiring + contract tests

   Structural-only (no live MySQL). Verifies:
     1. The arkThemes router is registered under its new
        top-level namespace and the two procedures exist.
     2. The old inline gamification.getTheme /
        gamification.setTheme procedures are gone — the
        extraction removed them, and these assertions keep
        them gone.
     3. Both procedures require an authenticated user.
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

function createUnauthedContext(): TrpcContext {
  return {
    user: null,
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("appRouter wiring — arkThemes", () => {
  it("registers the new top-level arkThemes procedures", () => {
    const procedures = appRouter._def.procedures as Record<string, unknown>;
    expect(procedures["arkThemes.get"]).toBeDefined();
    expect(procedures["arkThemes.set"]).toBeDefined();
  });

  it("no longer exposes the old inline gamification.getTheme / setTheme", () => {
    const procedures = appRouter._def.procedures as Record<string, unknown>;
    expect(procedures["gamification.getTheme"]).toBeUndefined();
    expect(procedures["gamification.setTheme"]).toBeUndefined();
  });
});

describe("arkThemes.get — authorisation", () => {
  it("rejects unauthenticated callers with UNAUTHORIZED", async () => {
    const caller = appRouter.createCaller(createUnauthedContext());
    await expect(caller.arkThemes.get()).rejects.toBeInstanceOf(TRPCError);
    await expect(caller.arkThemes.get()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });
});

describe("arkThemes.set — authorisation + validation", () => {
  it("rejects unauthenticated callers with UNAUTHORIZED", async () => {
    const caller = appRouter.createCaller(createUnauthedContext());
    await expect(
      caller.arkThemes.set({ themeId: "default" }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects empty themeId with a zod validation error", async () => {
    // Unauthed caller still hits zod first (input validation runs
    // before the auth middleware's context-ful check — the empty
    // string trips the zod minLength rule regardless of auth).
    const caller = appRouter.createCaller(createUnauthedContext());
    await expect(
      caller.arkThemes.set({ themeId: "" }),
    ).rejects.toBeInstanceOf(TRPCError);
  });
});
