import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from '@shared/const';
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";
import { withSpan } from "../otel";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;

// #88 OpenTelemetry — wrap every tRPC procedure in a span. When OTel
// isn't initialized (default), `withSpan` is a tail-call to `fn()`
// with one boolean check overhead, so this is safe to apply
// universally. When the SDK is loaded, every query/mutation produces
// a `trpc.<path>` span with `trpc.type` and `trpc.has_user`
// attributes for correlation with downstream DB / external traces.
const traceMiddleware = t.middleware(async opts => {
  const { next, path, type, ctx } = opts;
  return (await withSpan(
    `trpc.${path}`,
    () => next(),
    {
      "trpc.path": path,
      "trpc.type": type,
      "trpc.has_user": ctx.user != null,
    },
  )) as Awaited<ReturnType<typeof next>>;
});

export const publicProcedure = t.procedure.use(traceMiddleware);

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

export const protectedProcedure = t.procedure.use(traceMiddleware).use(requireUser);

export const adminProcedure = t.procedure.use(traceMiddleware).use(
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
 * Staff procedure: allows either `moderator` or `admin`. Moderators
 * can view analytics and submit approval requests for economy
 * changes, but cannot execute those changes directly — that still
 * requires two admin approvals via the architectConsole flow.
 */
export const moderatorProcedure = t.procedure.use(traceMiddleware).use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    if (!ctx.user || (ctx.user.role !== "moderator" && ctx.user.role !== "admin")) {
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
