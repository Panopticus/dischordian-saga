/**
 * H6 — procedureRateLimit unit tests.
 *
 * Exercises the in-memory token bucket through a faked clock so
 * refill semantics + key isolation are deterministic.
 */
import { describe, it, expect, beforeEach, afterAll } from "vitest";
import {
  procedureRateLimit,
  _resetForTests,
  _setClockForTests,
  _restoreClock,
} from "./procedureRateLimit";
import { TRPCError } from "@trpc/server";

let now = 0;
beforeEach(() => {
  _resetForTests();
  now = 0;
  _setClockForTests(() => now);
});
afterAll(() => {
  _restoreClock();
});

interface CallCtx {
  user?: { id: number };
  req?: { ip: string };
}

async function callMiddleware(
  mw: ReturnType<typeof procedureRateLimit>,
  ctx: CallCtx,
): Promise<{ ok: true } | { error: TRPCError }> {
  // Reach into the tRPC middleware shape directly. The middleware is
  // a function that takes `{ ctx, next, … }` and either calls next or
  // throws. We synthesize the minimum shape it needs.
  const opts = {
    ctx,
    next: () => Promise.resolve({ ok: true } as const),
    // Fields tRPC's runtime uses but the middleware doesn't read.
    path: "test.path",
    type: "mutation" as const,
    rawInput: undefined,
    input: undefined,
    meta: undefined,
  };
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = await (mw as any)._middlewares?.[0]?.(opts) ?? (mw as any)(opts);
    return r as { ok: true };
  } catch (err) {
    return { error: err as TRPCError };
  }
}

describe("procedureRateLimit", () => {
  it("allows up to `max` calls within the window, then throws TOO_MANY_REQUESTS", async () => {
    const mw = procedureRateLimit({ windowMs: 1000, max: 3 });
    const ctx: CallCtx = { user: { id: 1 } };
    expect(await callMiddleware(mw, ctx)).toEqual({ ok: true });
    expect(await callMiddleware(mw, ctx)).toEqual({ ok: true });
    expect(await callMiddleware(mw, ctx)).toEqual({ ok: true });
    const blocked = await callMiddleware(mw, ctx);
    expect("error" in blocked).toBe(true);
    if ("error" in blocked) {
      expect(blocked.error.code).toBe("TOO_MANY_REQUESTS");
    }
  });

  it("refills tokens linearly over the window", async () => {
    const mw = procedureRateLimit({ windowMs: 1000, max: 2 });
    const ctx: CallCtx = { user: { id: 7 } };
    expect(await callMiddleware(mw, ctx)).toEqual({ ok: true });
    expect(await callMiddleware(mw, ctx)).toEqual({ ok: true });
    expect("error" in (await callMiddleware(mw, ctx))).toBe(true);
    // Advance halfway through the window — refill rate 2/1000 = 0.002
    // tokens/ms; 500ms → 1 token. One additional call should pass.
    now += 500;
    expect(await callMiddleware(mw, ctx)).toEqual({ ok: true });
    expect("error" in (await callMiddleware(mw, ctx))).toBe(true);
    // Full window — bucket back to capacity.
    now += 1000;
    expect(await callMiddleware(mw, ctx)).toEqual({ ok: true });
    expect(await callMiddleware(mw, ctx)).toEqual({ ok: true });
  });

  it("isolates buckets per user (key = ctx.user.id)", async () => {
    const mw = procedureRateLimit({ windowMs: 1000, max: 1 });
    expect(await callMiddleware(mw, { user: { id: 1 } })).toEqual({ ok: true });
    expect(await callMiddleware(mw, { user: { id: 2 } })).toEqual({ ok: true });
    // User 1's bucket is now empty; user 2's bucket is also empty.
    expect("error" in (await callMiddleware(mw, { user: { id: 1 } }))).toBe(true);
    expect("error" in (await callMiddleware(mw, { user: { id: 2 } }))).toBe(true);
  });

  it("falls back to req.ip when no user is present", async () => {
    const mw = procedureRateLimit({ windowMs: 1000, max: 1 });
    expect(
      await callMiddleware(mw, { req: { ip: "10.0.0.1" } }),
    ).toEqual({ ok: true });
    expect(
      "error" in (await callMiddleware(mw, { req: { ip: "10.0.0.1" } })),
    ).toBe(true);
    // Different IP → independent bucket.
    expect(
      await callMiddleware(mw, { req: { ip: "10.0.0.2" } }),
    ).toEqual({ ok: true });
  });

  it("isolates buckets per (windowMs, max) combination", async () => {
    const tight = procedureRateLimit({ windowMs: 1000, max: 1 });
    const loose = procedureRateLimit({ windowMs: 1000, max: 10 });
    const ctx: CallCtx = { user: { id: 99 } };
    // Spend the tight bucket.
    expect(await callMiddleware(tight, ctx)).toEqual({ ok: true });
    expect("error" in (await callMiddleware(tight, ctx))).toBe(true);
    // The loose middleware has its own bucket — same user, different
    // capacity → still capacity 10 available.
    expect(await callMiddleware(loose, ctx)).toEqual({ ok: true });
    expect(await callMiddleware(loose, ctx)).toEqual({ ok: true });
  });
});
