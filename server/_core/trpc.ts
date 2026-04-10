import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from '@shared/const';
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";
import { takeRateLimitToken, type RateLimitConfig } from "../mutationRateLimit";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

export const adminProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== 'admin') {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);

/**
 * Per-user token-bucket rate limiter middleware.
 *
 * Apply AFTER a procedure with `ctx.user` is established (typically
 * `protectedProcedure.use(rateLimit(...))`). Anonymous calls fall
 * through — the outer middleware is responsible for rejecting those.
 *
 * Throws a tRPC TOO_MANY_REQUESTS error when the bucket is empty.
 *
 * Example:
 *   sendMessage: protectedProcedure
 *     .use(rateLimit({ key: "dm.send", maxTokens: 10, refillRate: 1 }))
 *     .mutation(...)
 */
export function rateLimit(cfg: RateLimitConfig & { message?: string }) {
  return t.middleware(async ({ ctx, next }) => {
    const userId = ctx.user?.id;
    if (userId === undefined || userId === null) {
      return next();
    }
    if (!takeRateLimitToken(cfg, userId)) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: cfg.message ?? "You're doing that too much — slow down a bit.",
      });
    }
    return next();
  });
}
