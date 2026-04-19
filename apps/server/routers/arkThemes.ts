/* ═══════════════════════════════════════════════════════
   ARK THEMES ROUTER

   Closes bible §8.7 ("arkThemes — accessed inline in
   routers.ts, not via proper router"). Extracts the two
   theme procedures out of the top-level gamification block
   into their own module so they live beside every other
   domain router.

   Exposed procedures:
     - get: fetch the current user's persisted Ark theme.
       Returns null when the user has no row.
     - set: upsert the user's theme. Returns { success }.

   The schema (ark_themes) was already in place; this router
   just moves the handlers to their canonical home.
   ═══════════════════════════════════════════════════════ */

import { eq } from "drizzle-orm";
import { z } from "zod";

import { arkThemes } from "../../db/schema";
import { getDb } from "../db";
import { protectedProcedure, router } from "../_core/trpc";

export const arkThemesRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const rows = await db
      .select()
      .from(arkThemes)
      .where(eq(arkThemes.userId, ctx.user.id))
      .limit(1);
    return rows[0] ?? null;
  }),

  set: protectedProcedure
    .input(z.object({ themeId: z.string().min(1, "themeId required") }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false } as const;
      const existing = await db
        .select()
        .from(arkThemes)
        .where(eq(arkThemes.userId, ctx.user.id))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(arkThemes)
          .set({ themeId: input.themeId })
          .where(eq(arkThemes.userId, ctx.user.id));
      } else {
        await db.insert(arkThemes).values({
          userId: ctx.user.id,
          themeId: input.themeId,
        });
      }
      return { success: true } as const;
    }),
});
