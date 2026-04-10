/**
 * DEAD MAN'S CIRCUIT ROUTER
 * ──────────────────────────────────────────────────
 * Seasonal kart racing on bone-tracks. Godot iframe
 * submits race results; server validates, stores,
 * updates leaderboard, and emits ripple events.
 */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  circuitSeasons, circuitRaceResults, circuitLeaderboard,
  citizenCharacters, users,
} from "../../drizzle/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  calculateCP,
  generateCloneDesignation,
  getCurrentPhase,
  CIRCUIT_ABILITIES,
  CLASS_ABILITY_SUGGESTIONS,
  SPECIES_CHASSIS_COLOR,
  TRACK_PRESETS,
  CIRCUIT_PALETTE,
  type SeasonPhase,
} from "../../shared/deadMansCircuit";
import { ripple } from "../services/rippleEngine";

export const deadMansCircuitRouter = router({

  /* ═══ GET CURRENT SEASON (public) ═══ */
  getCurrentSeason: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return null;
    const [season] = await db.select().from(circuitSeasons)
      .where(eq(circuitSeasons.status, "active"))
      .orderBy(desc(circuitSeasons.startsAt))
      .limit(1);
    return season ?? null;
  }),

  /* ═══ GET SEASON HISTORY (protected) ═══ */
  getSeasonHistory: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(circuitSeasons)
      .where(eq(circuitSeasons.status, "ended"))
      .orderBy(desc(circuitSeasons.seasonNumber))
      .limit(20);
  }),

  /* ═══ GET MY STATS (protected) ═══ */
  getMyStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    // Find active season
    const [season] = await db.select().from(circuitSeasons)
      .where(eq(circuitSeasons.status, "active"))
      .limit(1);
    if (!season) return null;

    // Leaderboard entry
    const [lb] = await db.select().from(circuitLeaderboard)
      .where(and(
        eq(circuitLeaderboard.userId, ctx.user.id),
        eq(circuitLeaderboard.seasonId, season.id),
      ))
      .limit(1);

    // Recent race results
    const recentRaces = await db.select().from(circuitRaceResults)
      .where(and(
        eq(circuitRaceResults.userId, ctx.user.id),
        eq(circuitRaceResults.seasonId, season.id),
      ))
      .orderBy(desc(circuitRaceResults.createdAt))
      .limit(10);

    return {
      season,
      leaderboard: lb ?? null,
      recentRaces,
    };
  }),

  /* ═══ GET LEADERBOARD (public) ═══ */
  getLeaderboard: publicProcedure
    .input(z.object({ seasonId: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      let seasonId = input?.seasonId;

      // Default to active season
      if (!seasonId) {
        const [active] = await db.select().from(circuitSeasons)
          .where(eq(circuitSeasons.status, "active"))
          .limit(1);
        if (!active) return [];
        seasonId = active.id;
      }

      const rows = await db.select({
        id: circuitLeaderboard.id,
        userId: circuitLeaderboard.userId,
        seasonId: circuitLeaderboard.seasonId,
        totalCp: circuitLeaderboard.totalCp,
        racesCompleted: circuitLeaderboard.racesCompleted,
        bestPosition: circuitLeaderboard.bestPosition,
        bestLapMs: circuitLeaderboard.bestLapMs,
        totalKills: circuitLeaderboard.totalKills,
        clonesSurvived: circuitLeaderboard.clonesSurvived,
        clonesLost: circuitLeaderboard.clonesLost,
        username: users.name,
      })
        .from(circuitLeaderboard)
        .leftJoin(users, eq(circuitLeaderboard.userId, users.id))
        .where(eq(circuitLeaderboard.seasonId, seasonId))
        .orderBy(desc(circuitLeaderboard.totalCp))
        .limit(50);

      return rows.map((row, idx) => ({
        rank: idx + 1,
        ...row,
        username: row.username ?? "Unknown Clone",
      }));
    }),

  /* ═══ SUBMIT RACE RESULT (protected) ═══ */
  submitRaceResult: protectedProcedure
    .input(z.object({
      finishPosition: z.number().min(1).max(8),
      totalTimeMs: z.number().min(1000),
      bestLapMs: z.number().min(500).optional(),
      cloneSurvived: z.boolean(),
      rivalKills: z.number().min(0).max(7).default(0),
      abilitiesUsed: z.array(z.string()).default([]),
      cloneDesignation: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");

      // Find active season
      const [season] = await db.select().from(circuitSeasons)
        .where(eq(circuitSeasons.status, "active"))
        .limit(1);
      if (!season) throw new Error("No active circuit season");

      const phase = getCurrentPhase(season.startsAt) as SeasonPhase;

      // Check personal best
      const [prevBest] = await db.select({ bestLap: circuitRaceResults.bestLapMs })
        .from(circuitRaceResults)
        .where(and(
          eq(circuitRaceResults.userId, ctx.user.id),
          eq(circuitRaceResults.seasonId, season.id),
        ))
        .orderBy(circuitRaceResults.bestLapMs)
        .limit(1);

      const isPersonalBest = input.bestLapMs != null &&
        (prevBest?.bestLap == null || input.bestLapMs < prevBest.bestLap);

      // Calculate CP
      const cpResult = calculateCP(
        input.finishPosition,
        phase,
        input.cloneSurvived,
        isPersonalBest,
        input.rivalKills,
      );

      const designation = input.cloneDesignation ?? generateCloneDesignation();

      // Store race result
      await db.insert(circuitRaceResults).values({
        userId: ctx.user.id,
        seasonId: season.id,
        cloneDesignation: designation,
        finishPosition: input.finishPosition,
        totalTimeMs: input.totalTimeMs,
        bestLapMs: input.bestLapMs ?? null,
        cloneSurvived: input.cloneSurvived ? 1 : 0,
        rivalKills: input.rivalKills,
        abilitiesUsed: input.abilitiesUsed,
        cpEarned: cpResult.total,
        cpBreakdown: cpResult as unknown as Record<string, number>,
        phase,
      });

      // Update season stats
      await db.update(circuitSeasons)
        .set({
          totalRaces: sql`${circuitSeasons.totalRaces} + 1`,
          totalDeaths: input.cloneSurvived
            ? sql`${circuitSeasons.totalDeaths}`
            : sql`${circuitSeasons.totalDeaths} + 1`,
          phase,
        })
        .where(eq(circuitSeasons.id, season.id));

      // Upsert leaderboard
      const [existing] = await db.select().from(circuitLeaderboard)
        .where(and(
          eq(circuitLeaderboard.userId, ctx.user.id),
          eq(circuitLeaderboard.seasonId, season.id),
        ))
        .limit(1);

      if (existing) {
        await db.update(circuitLeaderboard)
          .set({
            totalCp: existing.totalCp + cpResult.total,
            racesCompleted: existing.racesCompleted + 1,
            bestPosition: Math.min(existing.bestPosition, input.finishPosition),
            bestLapMs: (input.bestLapMs != null && (existing.bestLapMs == null || input.bestLapMs < existing.bestLapMs))
              ? input.bestLapMs
              : existing.bestLapMs,
            totalKills: existing.totalKills + input.rivalKills,
            clonesSurvived: input.cloneSurvived ? existing.clonesSurvived + 1 : existing.clonesSurvived,
            clonesLost: input.cloneSurvived ? existing.clonesLost : existing.clonesLost + 1,
          })
          .where(eq(circuitLeaderboard.id, existing.id));
      } else {
        await db.insert(circuitLeaderboard).values({
          userId: ctx.user.id,
          seasonId: season.id,
          totalCp: cpResult.total,
          racesCompleted: 1,
          bestPosition: input.finishPosition,
          bestLapMs: input.bestLapMs ?? null,
          totalKills: input.rivalKills,
          clonesSurvived: input.cloneSurvived ? 1 : 0,
          clonesLost: input.cloneSurvived ? 0 : 1,
        });
      }

      // ── Ripple Events ──

      await ripple.emit("circuit_race_complete", {
        userId: ctx.user.id,
        position: input.finishPosition,
        survived: input.cloneSurvived,
        kills: input.rivalKills,
        cpEarned: cpResult.total,
      });

      // Clone death → combat_death ripple
      if (!input.cloneSurvived) {
        await ripple.emit("combat_death", {
          userId: ctx.user.id,
          cause: "circuit_race",
          gameMode: "dead_mans_circuit",
          companionActive: false,
        });
      }

      // First place → boss_defeated ripple (Nilmorg acknowledges the winner)
      if (input.finishPosition === 1) {
        await ripple.emit("boss_defeated", {
          userId: ctx.user.id,
          bossKey: "nilmorg_circuit",
          difficulty: `phase_${phase}`,
        });
      }

      return {
        cpEarned: cpResult.total,
        cpBreakdown: cpResult,
        isPersonalBest,
        designation,
        phase,
      };
    }),

  /* ═══ GET CLONE CONFIG (protected) ═══ */
  getCloneConfig: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");

    // Fetch player's citizen build
    const [citizen] = await db.select().from(citizenCharacters)
      .where(eq(citizenCharacters.userId, ctx.user.id))
      .limit(1);

    const species = citizen?.species ?? "neyon";
    const characterClass = citizen?.characterClass ?? "soldier";
    const level = citizen?.level ?? 1;

    // Species → chassis color
    const chassisColor = SPECIES_CHASSIS_COLOR[species] ?? CIRCUIT_PALETTE.BONE_WHITE;

    // Class → ability suggestions
    const suggestedAbilities = CLASS_ABILITY_SUGGESTIONS[characterClass] ?? ["emp_pulse", "neural_flood"];
    const abilityDetails = CIRCUIT_ABILITIES.filter(a => suggestedAbilities.includes(a.key));

    // Level → stat scaling (higher level = better base stats)
    const levelBonus = Math.min(20, Math.floor(level / 5));

    const designation = generateCloneDesignation();

    const cloneStats = {
      designation,
      neural_sync: 60 + Math.floor(Math.random() * 21) + levelBonus,        // 60-100
      physical_integrity: 100,
      velocity_ceiling_pct: 80 + Math.floor(Math.random() * 21) + levelBonus, // 80-120
      surface_grip_pct: 40 + Math.floor(Math.random() * 21) + levelBonus,     // 40-80
      survival_instinct: 10 + Math.floor(Math.random() * 21),                 // 10-40
      chassisColor,
    };

    // Clamp stats to valid ranges
    cloneStats.neural_sync = Math.min(100, cloneStats.neural_sync);
    cloneStats.velocity_ceiling_pct = Math.min(120, cloneStats.velocity_ceiling_pct);
    cloneStats.surface_grip_pct = Math.min(80, cloneStats.surface_grip_pct);

    return {
      clone: cloneStats,
      suggestedAbilities: abilityDetails,
      allAbilities: CIRCUIT_ABILITIES,
      species,
      characterClass,
      level,
    };
  }),

  /* ═══ GET TRACK CONFIG (protected) ═══ */
  getTrackConfig: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");

    // Get active season
    const [season] = await db.select().from(circuitSeasons)
      .where(eq(circuitSeasons.status, "active"))
      .limit(1);
    if (!season) return null;

    const phase = getCurrentPhase(season.startsAt) as SeasonPhase;
    const trackKey = season.trackPreset ?? "the_first_circuit";
    const preset = TRACK_PRESETS.find(t => t.key === trackKey) ?? TRACK_PRESETS[0];

    // In phase 3, if The Dead Run is available and current preset isn't extreme, upgrade
    const effectivePreset = (phase === 3 && preset.difficulty !== "extreme")
      ? (TRACK_PRESETS.find(t => t.key === "the_dead_run") ?? preset)
      : preset;

    return {
      season: {
        id: season.id,
        seasonNumber: season.seasonNumber,
        name: season.name,
        phase,
        status: season.status,
      },
      track: effectivePreset,
      boneObstacles: season.boneObstacles ?? [],
      totalDeaths: season.totalDeaths,
      totalRaces: season.totalRaces,
    };
  }),
});
