/* ═══════════════════════════════════════════════════════
   SETTINGS ROUTER — Cloud sync for player settings
   Stores settings in userProgress.gameData.settings
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { logger } from "../logger";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userProgress } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { settingsSchema, DEFAULT_SETTINGS } from "../../shared/settingsSchema";

export const settingsRouter = router({
  /**
   * Get the user's synced settings from the database.
   * Returns DEFAULT_SETTINGS if no settings have been saved yet.
   */
  getSettings: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return DEFAULT_SETTINGS;

    const rows = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, ctx.user.id))
      .limit(1);

    if (!rows[0]) return DEFAULT_SETTINGS;

    const gameData = rows[0].gameData as Record<string, unknown> | null;
    if (!gameData?.settings) return DEFAULT_SETTINGS;

    // Parse with schema to ensure valid shape; fall back to defaults for missing fields
    const result = settingsSchema.safeParse(gameData.settings);
    if (!result.success) {
      logger.warn("[Settings] Invalid settings in DB for user", ctx.user.id, result.error.issues);
      return DEFAULT_SETTINGS;
    }
    return result.data;
  }),

  /**
   * Save (merge) settings to the database.
   * Accepts a partial settings object; merges with existing settings in DB.
   */
  saveSettings: protectedProcedure
    .input(settingsSchema.partial())
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      const existing = await db
        .select()
        .from(userProgress)
        .where(eq(userProgress.userId, ctx.user.id))
        .limit(1);

      if (existing.length > 0) {
        const currentGameData = (existing[0].gameData as Record<string, unknown>) || {};
        const currentSettings = (currentGameData.settings as Record<string, unknown>) || {};
        const mergedSettings = { ...DEFAULT_SETTINGS, ...currentSettings, ...input };

        // Validate merged result
        const validated = settingsSchema.parse(mergedSettings);

        await db
          .update(userProgress)
          .set({
            gameData: { ...currentGameData, settings: validated },
          })
          .where(eq(userProgress.userId, ctx.user.id));
      } else {
        const validated = settingsSchema.parse({ ...DEFAULT_SETTINGS, ...input });
        await db.insert(userProgress).values({
          userId: ctx.user.id,
          gameData: { settings: validated },
        });
      }

      logger.info("[Settings] Saved settings for user", ctx.user.id);
      return { success: true };
    }),

  /**
   * Reset settings to defaults.
   */
  resetSettings: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { success: false, settings: DEFAULT_SETTINGS };

    const existing = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, ctx.user.id))
      .limit(1);

    if (existing.length > 0) {
      const currentGameData = (existing[0].gameData as Record<string, unknown>) || {};
      await db
        .update(userProgress)
        .set({
          gameData: { ...currentGameData, settings: DEFAULT_SETTINGS },
        })
        .where(eq(userProgress.userId, ctx.user.id));
    }

    logger.info("[Settings] Reset settings to defaults for user", ctx.user.id);
    return { success: true, settings: DEFAULT_SETTINGS };
  }),
});
