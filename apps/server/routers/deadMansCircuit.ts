/**
 * DEAD MAN'S CIRCUIT ROUTER
 * ──────────────────────────────────────────────────
 * Seasonal kart racing on bone-tracks. Godot iframe
 * submits race results; server validates, stores,
 * updates leaderboard, and emits ripple events.
 */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  circuitSeasons, circuitRaceResults, circuitLeaderboard, circuitClones,
  circuitSideQuestProgress, circuitIdentityChains,
  citizenCharacters, users, universeEventState,
  dreamBalance, userProgress, eidolonBonds, loreJournalEntries,
} from "../../db/schema";
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
  NEUTRAL_CIRCUIT_MODIFIERS,
  SEASON_REWARD_TIERS,
  CIRCUIT_SIDE_QUESTS,
  resolveCircuitUniverseModifiers,
  maybeScrambleDesignation,
  type SeasonPhase,
  type CircuitUniverseModifiers,
  type CircuitQuestTriggerKind,
} from "../../shared/deadMansCircuit";
import { ripple } from "../services/rippleEngine";
import {
  getOrOpenActiveSeason,
  appendBoneObstacle,
  snapshotUniverseEvents,
  tickCircuitSeasons,
} from "../services/circuitSeasonService";
import {
  advanceCircuitSideQuests,
  getMyCircuitSideQuests,
} from "../services/circuitSideQuestService";

/**
 * Look up the currently-active Living Universe event ids. Used by the
 * modifier resolver to decide how Circuit systems react to world state
 * (Necromancer Return, Dreamer Awakening, Terminus Advance, etc.).
 */
async function getActiveUniverseEventIds(): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];
  try {
    const rows = await db.select({ eventId: universeEventState.eventId })
      .from(universeEventState)
      .where(eq(universeEventState.isActive, 1));
    return rows.map(r => r.eventId);
  } catch {
    return [];
  }
}

/** Resolve the active universe-event modifier set, with a neutral fallback. */
async function getActiveCircuitModifiers(): Promise<{
  modifiers: CircuitUniverseModifiers;
  eventIds: string[];
}> {
  const eventIds = await getActiveUniverseEventIds();
  if (eventIds.length === 0) {
    return { modifiers: { ...NEUTRAL_CIRCUIT_MODIFIERS }, eventIds };
  }
  return { modifiers: resolveCircuitUniverseModifiers(eventIds), eventIds };
}

export const deadMansCircuitRouter = router({

  /* ═══ GET CURRENT SEASON (public) ═══
     Delegates to the season service so a fresh deploy lazily opens
     the in-window season without waiting for the hourly tick. */
  getCurrentSeason: publicProcedure.query(async () => {
    return getOrOpenActiveSeason();
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

    // Find (or lazily open) the active season
    const season = await getOrOpenActiveSeason();
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

      // Find (or lazily open) the active season
      const season = await getOrOpenActiveSeason();
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

      // Universe modifiers affect CP bonuses and bone-lane cap
      const { modifiers, eventIds } = await getActiveCircuitModifiers();

      // Snapshot which events were active during the race so season
      // recaps can show "this was a Necromancer Return season".
      await snapshotUniverseEvents(season.id, eventIds);

      // Calculate CP
      const cpResult = calculateCP(
        input.finishPosition,
        phase,
        input.cloneSurvived,
        isPersonalBest,
        input.rivalKills,
      );

      // Dreamer Awakening doubles the survival bonus. We fold the
      // extra points into both the survivalBonus and the total so
      // cpBreakdown stays internally consistent for the client.
      if (modifiers.survivalBonusDoubled && input.cloneSurvived && cpResult.survivalBonus > 0) {
        const bonus = Math.floor(cpResult.survivalBonus * cpResult.phaseMultiplier);
        cpResult.survivalBonus += cpResult.survivalBonus;
        cpResult.total += bonus;
      }

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

      // Advance the clone roster row for this race. If the designation
      // matches a live clone we update that row; otherwise we noop (the
      // legacy path, before rosters were persisted).
      const [rosterClone] = await db.select().from(circuitClones)
        .where(and(
          eq(circuitClones.userId, ctx.user.id),
          eq(circuitClones.seasonId, season.id),
          eq(circuitClones.designation, designation),
        ))
        .limit(1);
      if (rosterClone) {
        const newRaces = rosterClone.racesRun + 1;
        const newKills = rosterClone.killsScored + input.rivalKills;
        if (input.cloneSurvived) {
          await db.update(circuitClones)
            .set({
              racesRun: newRaces,
              killsScored: newKills,
              veteranNoted: newRaces >= 3 ? 1 : rosterClone.veteranNoted,
            })
            .where(eq(circuitClones.id, rosterClone.id));
        } else {
          await db.update(circuitClones)
            .set({
              racesRun: newRaces,
              killsScored: newKills,
              status: "dead",
              diedAt: new Date(),
            })
            .where(eq(circuitClones.id, rosterClone.id));
        }
      }

      // ── Grow the Bone Lane ──
      // On every clone death we append a calcified obstacle to the
      // track. The cap scales with Necromancer Return (1.5x) and any
      // future event that changes boneObstacleMultiplier.
      if (!input.cloneSurvived) {
        const baseCap = 200;
        const scaledCap = Math.max(1, Math.floor(baseCap * modifiers.boneObstacleMultiplier));
        const obstacle = {
          // Randomized track-local coordinates. The Godot side treats
          // these as (x, z) world-space positions and places visual
          // obstacles at them when the track loads.
          x: Math.floor(Math.random() * 1600 - 800),
          z: Math.floor(Math.random() * 1600 - 800),
        };
        await appendBoneObstacle(season.id, obstacle, scaledCap);
      }

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

  /* ═══ GET CLONE CONFIG (protected) ═══
     Reuses an active clone from the roster if the player has one in
     the current season; otherwise generates + persists a new clone row. */
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

    // Universe modifiers — Dreamer Awakening grants a sync bonus,
    // Shadow Tongue scrambles designations, etc.
    const { modifiers, eventIds } = await getActiveCircuitModifiers();

    // Do we have a live clone to reuse?
    const season = await getOrOpenActiveSeason();
    let rosterRow: typeof circuitClones.$inferSelect | null = null;
    if (season) {
      const [existing] = await db.select().from(circuitClones)
        .where(and(
          eq(circuitClones.userId, ctx.user.id),
          eq(circuitClones.seasonId, season.id),
          eq(circuitClones.status, "active"),
        ))
        .orderBy(desc(circuitClones.bornAt))
        .limit(1);
      rosterRow = existing ?? null;
    }

    let cloneStats: {
      designation: string;
      neural_sync: number;
      physical_integrity: number;
      velocity_ceiling_pct: number;
      surface_grip_pct: number;
      survival_instinct: number;
      chassisColor: string;
    };
    let isVeteran = false;
    let racesRun = 0;
    let killsScored = 0;

    if (rosterRow) {
      // Reuse the living clone. Stats come from the DB row, not re-rolled.
      cloneStats = {
        designation: maybeScrambleDesignation(rosterRow.designation, modifiers.designationsScrambled),
        neural_sync: Math.min(100, rosterRow.neuralSync + modifiers.neuralSyncBonus),
        physical_integrity: 100,
        velocity_ceiling_pct: rosterRow.velocityCeilingPct,
        surface_grip_pct: rosterRow.surfaceGripPct,
        survival_instinct: rosterRow.survivalInstinct,
        chassisColor: rosterRow.chassisColor,
      };
      isVeteran = !!rosterRow.veteranNoted || rosterRow.racesRun >= 3;
      racesRun = rosterRow.racesRun;
      killsScored = rosterRow.killsScored;
    } else {
      // Roll a fresh clone and persist it
      const rawDesignation = generateCloneDesignation();

      const neuralSync = Math.min(100, 60 + Math.floor(Math.random() * 21) + levelBonus);
      const velocity = Math.min(120, 80 + Math.floor(Math.random() * 21) + levelBonus);
      const grip = Math.min(80, 40 + Math.floor(Math.random() * 21) + levelBonus);
      const survival = 10 + Math.floor(Math.random() * 21);

      if (season) {
        await db.insert(circuitClones).values({
          userId: ctx.user.id,
          seasonId: season.id,
          designation: rawDesignation,
          neuralSync,
          velocityCeilingPct: velocity,
          surfaceGripPct: grip,
          survivalInstinct: survival,
          chassisColor,
          status: "active",
        });
      }

      cloneStats = {
        designation: maybeScrambleDesignation(rawDesignation, modifiers.designationsScrambled),
        // The universe modifier sync bonus is additive on top of the
        // persisted roll so the stored roster stat stays clean.
        neural_sync: Math.min(100, neuralSync + modifiers.neuralSyncBonus),
        physical_integrity: 100,
        velocity_ceiling_pct: velocity,
        surface_grip_pct: grip,
        survival_instinct: survival,
        chassisColor,
      };
    }

    return {
      clone: cloneStats,
      suggestedAbilities: abilityDetails,
      allAbilities: CIRCUIT_ABILITIES,
      species,
      characterClass,
      level,
      modifiers,
      activeUniverseEvents: eventIds,
      rosterMeta: {
        racesRun,
        killsScored,
        isVeteran,
        cloneId: rosterRow?.id ?? null,
      },
    };
  }),

  /* ═══ GET MY CLONES (protected) ═══
     Roster of every clone in the current season, active or dead. */
  getMyClones: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const season = await getOrOpenActiveSeason();
    if (!season) return [];

    return db.select().from(circuitClones)
      .where(and(
        eq(circuitClones.userId, ctx.user.id),
        eq(circuitClones.seasonId, season.id),
      ))
      .orderBy(desc(circuitClones.bornAt));
  }),

  /* ═══ RETIRE CLONE (protected) ═══
     Voluntarily removes a clone from the active roster without killing
     it. Used when a player wants to field a fresh clone on the next race
     without losing the old one's record in the roster. */
  retireClone: protectedProcedure
    .input(z.object({ cloneId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");

      const [clone] = await db.select().from(circuitClones)
        .where(and(
          eq(circuitClones.id, input.cloneId),
          eq(circuitClones.userId, ctx.user.id),
        ))
        .limit(1);
      if (!clone) throw new Error("Clone not found");
      if (clone.status !== "active") throw new Error("Clone is not active");

      await db.update(circuitClones)
        .set({ status: "severed" })
        .where(eq(circuitClones.id, clone.id));

      return { success: true, cloneId: clone.id };
    }),

  /* ═══ GET TRACK CONFIG (protected) ═══ */
  getTrackConfig: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");

    // Find (or lazily open) the active season
    const season = await getOrOpenActiveSeason();
    if (!season) return null;

    const phase = getCurrentPhase(season.startsAt) as SeasonPhase;
    const trackKey = season.trackPreset ?? "the_first_circuit";
    const preset = TRACK_PRESETS.find(t => t.key === trackKey) ?? TRACK_PRESETS[0];

    // In phase 3, if The Dead Run is available and current preset isn't extreme, upgrade
    const effectivePreset = (phase === 3 && preset.difficulty !== "extreme")
      ? (TRACK_PRESETS.find(t => t.key === "the_dead_run") ?? preset)
      : preset;

    // Universe modifiers affect how much of the stored Bone Lane we
    // ship to the client, and expose hidden lore markers during an
    // active Antiquarian Revelation event.
    const { modifiers, eventIds } = await getActiveCircuitModifiers();
    const storedObstacles = season.boneObstacles ?? [];
    const effectiveCap = Math.max(0, Math.floor(storedObstacles.length * modifiers.boneObstacleMultiplier));
    // If the multiplier is > 1 we keep all stored obstacles and signal
    // the client to duplicate visuals; if < 1 we slice from the tail.
    const clientObstacles = effectiveCap >= storedObstacles.length
      ? storedObstacles
      : storedObstacles.slice(storedObstacles.length - effectiveCap);

    return {
      season: {
        id: season.id,
        seasonNumber: season.seasonNumber,
        name: season.name,
        phase,
        status: season.status,
      },
      track: effectivePreset,
      boneObstacles: clientObstacles,
      totalDeaths: season.totalDeaths,
      totalRaces: season.totalRaces,
      modifiers,
      activeUniverseEvents: eventIds,
      hiddenLoreEnabled: modifiers.hiddenLoreEnabled,
    };
  }),

  /* ═══ CLAIM REWARD TIER (protected) ═══
     Grants the rewards for one of the Bone/Wire/Chrome/Dead Man's tiers
     to the player's leaderboard row. Idempotent — a tier can only be
     claimed once per season. */
  claimRewardTier: protectedProcedure
    .input(z.object({
      tier: z.enum(["bone", "wire", "chrome", "dead_mans"]),
      seasonId: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");

      // Resolve the season — default to the active one, but allow
      // claiming from a just-closed season too.
      let seasonId = input.seasonId;
      if (!seasonId) {
        const active = await getOrOpenActiveSeason();
        if (!active) throw new Error("No active season");
        seasonId = active.id;
      }

      // Look up the player's leaderboard row for this season
      const [lb] = await db.select().from(circuitLeaderboard)
        .where(and(
          eq(circuitLeaderboard.userId, ctx.user.id),
          eq(circuitLeaderboard.seasonId, seasonId),
        ))
        .limit(1);
      if (!lb) throw new Error("No leaderboard entry for this season");

      const tierDef = SEASON_REWARD_TIERS.find(t => t.tier === input.tier);
      if (!tierDef) throw new Error("Unknown reward tier");

      if (lb.totalCp < tierDef.minCp) {
        throw new Error(`Requires ${tierDef.minCp} CP (you have ${lb.totalCp})`);
      }

      const claimed = (lb.claimedTiers as string[] | null) ?? [];
      if (claimed.includes(input.tier)) {
        throw new Error("Tier already claimed");
      }

      // Walk the rewards list and dispatch by type
      let xpAwarded = 0;
      let dreamAwarded = 0;
      const cosmeticsAwarded: string[] = [];
      const materialsAwarded: { key: string; amount: number }[] = [];

      // userProgress row for XP / cosmetics / title grants
      const [existingProgress] = await db.select().from(userProgress)
        .where(eq(userProgress.userId, ctx.user.id))
        .limit(1);
      const prevGameData = (existingProgress?.gameData as Record<string, unknown> | null) ?? {};
      const prevCosmetics = Array.isArray(prevGameData.cosmetics)
        ? [...(prevGameData.cosmetics as string[])]
        : [];
      const prevMaterials = (typeof prevGameData.materials === "object" && prevGameData.materials !== null)
        ? { ...(prevGameData.materials as Record<string, number>) }
        : {};

      for (const r of tierDef.rewards) {
        switch (r.type) {
          case "xp":
            xpAwarded += r.amount ?? 0;
            break;
          case "cosmetic":
          case "decoration":
            if (!prevCosmetics.includes(r.key)) prevCosmetics.push(r.key);
            cosmeticsAwarded.push(r.key);
            break;
          case "material":
            prevMaterials[r.key] = (prevMaterials[r.key] ?? 0) + (r.amount ?? 1);
            materialsAwarded.push({ key: r.key, amount: r.amount ?? 1 });
            break;
        }
      }

      // Some tiers also grant Dream tokens per the production doc
      // (Section 7). We read that off the shared tier def's rewards
      // that don't fit a type — we model it via a well-known key.
      // For now: Bone = 50 Dream, Wire = 200, Chrome = 500, Dead Man's = 1000.
      const DREAM_BY_TIER: Record<string, number> = {
        bone: 50, wire: 200, chrome: 500, dead_mans: 1000,
      };
      dreamAwarded = DREAM_BY_TIER[input.tier] ?? 0;

      // Grant Dream
      if (dreamAwarded > 0) {
        const [existingDream] = await db.select().from(dreamBalance)
          .where(eq(dreamBalance.userId, ctx.user.id))
          .limit(1);
        if (existingDream) {
          await db.update(dreamBalance)
            .set({ dreamTokens: sql`${dreamBalance.dreamTokens} + ${dreamAwarded}` })
            .where(eq(dreamBalance.userId, ctx.user.id));
        } else {
          await db.insert(dreamBalance).values({
            userId: ctx.user.id,
            dreamTokens: dreamAwarded,
            soulBoundDream: 0,
          });
        }
      }

      // Grant XP + cosmetics via userProgress
      const newGameData = { ...prevGameData, cosmetics: prevCosmetics, materials: prevMaterials };
      if (existingProgress) {
        await db.update(userProgress)
          .set({
            xp: sql`${userProgress.xp} + ${xpAwarded}`,
            gameData: newGameData,
          })
          .where(eq(userProgress.userId, ctx.user.id));
      } else {
        await db.insert(userProgress).values({
          userId: ctx.user.id,
          xp: xpAwarded,
          gameData: newGameData,
        });
      }

      // Append the claimed tier to the leaderboard row
      const newClaimed = [...claimed, input.tier];
      await db.update(circuitLeaderboard)
        .set({ claimedTiers: newClaimed })
        .where(eq(circuitLeaderboard.id, lb.id));

      return {
        success: true,
        tier: input.tier,
        xpAwarded,
        dreamAwarded,
        cosmeticsAwarded,
        materialsAwarded,
        claimedTiers: newClaimed,
      };
    }),

  /* ═══ GRANT SEVERANCE PRIZE (protected) ═══
     Once per closed season: if the caller was the champion of that
     season, they can redeem the Severance Prize for a permanent
     companion (a soul fragment drawn from their own Potential).
     Inserts a non-soul-bound eidolonBonds row so it coexists with any
     existing soul-bound companion the player already has. */
  grantSeverancePrize: protectedProcedure
    .input(z.object({ seasonId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");

      // The season must be closed and the caller must be its champion
      const [season] = await db.select().from(circuitSeasons)
        .where(eq(circuitSeasons.id, input.seasonId))
        .limit(1);
      if (!season) throw new Error("Season not found");
      if (season.status !== "ended") {
        throw new Error("Season is not yet closed");
      }
      if (season.championUserId !== ctx.user.id) {
        throw new Error("Only the season's champion can claim the Severance Prize");
      }

      // Idempotency — flip severancePrizeClaimed on the leaderboard row
      const [lb] = await db.select().from(circuitLeaderboard)
        .where(and(
          eq(circuitLeaderboard.userId, ctx.user.id),
          eq(circuitLeaderboard.seasonId, season.id),
        ))
        .limit(1);
      if (!lb) throw new Error("No leaderboard entry for this season");
      if (lb.severancePrizeClaimed) {
        throw new Error("Severance Prize already claimed for this season");
      }

      // Create the companion. Use a season-scoped eidolonId so each
      // season champion's prize is a distinct entity. isSoulBound is
      // false so the insert never conflicts with the player's existing
      // soul-bound companion (eidolonBond router enforces a single
      // soul-bound per user).
      const eidolonId = `severance_circuit_s${season.seasonNumber}`;
      const nickname = `Severance Fragment — ${season.name}`;

      await db.insert(eidolonBonds).values({
        userId: ctx.user.id,
        eidolonId,
        bond: 25,
        level: 1,
        xp: 0,
        stage: "companion",
        rarity: "legendary",
        health: "healthy",
        injury: 0,
        deathCount: 0,
        isResonant: true,
        isSoulBound: false,
        nickname,
        memories: [`Born from the Severance Prize of ${season.name}. A fragment of your own Potential, wearing a new body. Nilmorg kept his agreement.`],
        unlockedSkills: [],
        skillPoints: 0,
        missionsShared: 0,
        questsCompleted: [],
        moralityDissonance: 0,
        redStonesAbsorbed: 0,
        goldFragmentsAbsorbed: 0,
      });

      // Mark as claimed
      await db.update(circuitLeaderboard)
        .set({ severancePrizeClaimed: 1 })
        .where(eq(circuitLeaderboard.id, lb.id));

      // Phase 2 cross-system bridge: emit severance_prize_paid ripple.
      // Trade Empire's Nilmorg severance broker unlocks contracts on this
      // event (per nilmorg.md §5.7 deferred broker hook now active).
      try {
        await ripple.emit("severance_prize_paid", {
          userId: ctx.user.id,
          seasonName: season.name,
          championUserId: ctx.user.id,
          companionEidolonId: eidolonId,
        });
      } catch (rippleErr) {
        // Silent-fail: bridge ripple shouldn't block the prize delivery.
        console.error("severance_prize_paid ripple failed", rippleErr);
      }

      return {
        success: true,
        eidolonId,
        nickname,
        seasonName: season.name,
      };
    }),

  /* ═══ SIDE QUESTS — LIST / CLAIM / RECORD ═══ */

  /** List all 8 cross-game side quests with the player's progress. */
  getMySideQuests: protectedProcedure.query(async ({ ctx }) => {
    return getMyCircuitSideQuests(ctx.user.id);
  }),

  /** Claim the CP + cosmetic/title reward for a completed side quest. */
  claimSideQuest: protectedProcedure
    .input(z.object({ questKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");

      const season = await getOrOpenActiveSeason();
      if (!season) throw new Error("No active season");

      const questDef = CIRCUIT_SIDE_QUESTS.find(q => q.key === input.questKey);
      if (!questDef) throw new Error("Unknown quest");

      const [row] = await db.select().from(circuitSideQuestProgress)
        .where(and(
          eq(circuitSideQuestProgress.userId, ctx.user.id),
          eq(circuitSideQuestProgress.seasonId, season.id),
          eq(circuitSideQuestProgress.questKey, input.questKey),
        ))
        .limit(1);
      if (!row) throw new Error("No progress for this quest");
      if (!row.completed) throw new Error("Quest not yet complete");
      if (row.claimed) throw new Error("Already claimed");

      // Mark claimed + record the CP grant
      await db.update(circuitSideQuestProgress)
        .set({ claimed: 1, cpAwarded: questDef.cpReward })
        .where(eq(circuitSideQuestProgress.id, row.id));

      // Apply the CP to the leaderboard
      const [lb] = await db.select().from(circuitLeaderboard)
        .where(and(
          eq(circuitLeaderboard.userId, ctx.user.id),
          eq(circuitLeaderboard.seasonId, season.id),
        ))
        .limit(1);
      if (lb) {
        await db.update(circuitLeaderboard)
          .set({ totalCp: lb.totalCp + questDef.cpReward })
          .where(eq(circuitLeaderboard.id, lb.id));
      } else {
        // Seed a leaderboard row so a player who's only done side
        // quests (no races yet) still shows up.
        await db.insert(circuitLeaderboard).values({
          userId: ctx.user.id,
          seasonId: season.id,
          totalCp: questDef.cpReward,
          racesCompleted: 0,
          bestPosition: 99,
          totalKills: 0,
          clonesSurvived: 0,
          clonesLost: 0,
        });
      }

      // Grant cosmetic / title (if the quest def has them)
      if (questDef.cosmeticReward || questDef.titleReward) {
        const [existingProgress] = await db.select().from(userProgress)
          .where(eq(userProgress.userId, ctx.user.id))
          .limit(1);
        const prevGameData = (existingProgress?.gameData as Record<string, unknown> | null) ?? {};
        const prevCosmetics = Array.isArray(prevGameData.cosmetics)
          ? [...(prevGameData.cosmetics as string[])]
          : [];
        if (questDef.cosmeticReward && !prevCosmetics.includes(questDef.cosmeticReward)) {
          prevCosmetics.push(questDef.cosmeticReward);
        }
        const newGameData = { ...prevGameData, cosmetics: prevCosmetics };

        if (existingProgress) {
          await db.update(userProgress)
            .set({
              gameData: newGameData,
              // Only overwrite the title if the quest grants one
              ...(questDef.titleReward ? { title: questDef.titleReward } : {}),
            })
            .where(eq(userProgress.userId, ctx.user.id));
        } else {
          await db.insert(userProgress).values({
            userId: ctx.user.id,
            gameData: newGameData,
            ...(questDef.titleReward ? { title: questDef.titleReward } : {}),
          });
        }
      }

      // Act 4.5 Casino completion bridge — the canonical "completed
      // the Degen Casino" event is claiming the_degens_wager side
      // quest (win 5 casino games during a Circuit season). Raise
      // `act_4_5_casino_complete` so the Act 4.5 completion gate in
      // useNarrativeIntegration.ts fires. Written on claim (not on
      // progress.completed) so the player's explicit take-the-reward
      // action is what rolls the Degen's Pact forward.
      if (input.questKey === "the_degens_wager") {
        const [progressRow] = await db.select().from(userProgress)
          .where(eq(userProgress.userId, ctx.user.id))
          .limit(1);
        const prevGameData = (progressRow?.gameData as Record<string, unknown> | null) ?? {};
        const prevFlags = (typeof prevGameData.narrativeFlags === "object" && prevGameData.narrativeFlags !== null
          ? prevGameData.narrativeFlags
          : {}) as Record<string, boolean>;
        if (!prevFlags.act_4_5_casino_complete) {
          const newFlags = { ...prevFlags, act_4_5_casino_complete: true };
          const newGameData = { ...prevGameData, narrativeFlags: newFlags };
          if (progressRow) {
            await db.update(userProgress)
              .set({ gameData: newGameData })
              .where(eq(userProgress.userId, ctx.user.id));
          } else {
            await db.insert(userProgress).values({
              userId: ctx.user.id,
              gameData: newGameData,
            });
          }
        }
      }

      return {
        success: true,
        questKey: input.questKey,
        cpAwarded: questDef.cpReward,
        cosmeticAwarded: questDef.cosmeticReward ?? null,
        titleAwarded: questDef.titleReward ?? null,
        nilmorgLine: questDef.nilmorgLine ?? null,
      };
    }),

  /** Client-callable advance — used by systems that don't already
     flow through a rippleEngine event (the casino is client-side). */
  recordSideQuestEvent: protectedProcedure
    .input(z.object({
      trigger: z.enum([
        "fight_won",
        "card_battle_won",
        "chess_checkmate_fast",
        "trade_run_complete",
        "td_wave_survived",
        "casino_game_won",
        "companion_trust_reached",
        "raid_damage_dealt",
      ]),
      amount: z.number().min(1).max(1_000_000).default(1),
    }))
    .mutation(async ({ ctx, input }) => {
      await advanceCircuitSideQuests(
        ctx.user.id,
        input.trigger as CircuitQuestTriggerKind,
        input.amount,
      );
      return { success: true };
    }),

  /* ═══ IDENTITY CHAIN ═══
     The player authors their own four-name identity (Student → Seeker
     → Detective → Last) between race blocks. When all four slots are
     filled, we write a permanent entry into the Loredex journal and
     flip the narrative flags that unlock Act 5. */

  /** Fetch the current identity chain state for the player. */
  getMyIdentityChain: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const [row] = await db.select().from(circuitIdentityChains)
      .where(eq(circuitIdentityChains.userId, ctx.user.id))
      .limit(1);
    return row ?? null;
  }),

  /** Author one of the four names. Idempotent per slot — calling twice
     with the same slot overwrites. On slot 4, finalizes the chain by
     writing a Loredex journal entry and setting narrative flags. */
  submitIdentityChainName: protectedProcedure
    .input(z.object({
      slot: z.enum(["student", "seeker", "detective", "last"]),
      name: z.string().min(1).max(64),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");

      const [existing] = await db.select().from(circuitIdentityChains)
        .where(eq(circuitIdentityChains.userId, ctx.user.id))
        .limit(1);

      // Patch — slot name → column
      const slotCols: Record<typeof input.slot, keyof typeof circuitIdentityChains.$inferInsert> = {
        student: "studentName",
        seeker: "seekerName",
        detective: "detectiveName",
        last: "lastName",
      };
      const col = slotCols[input.slot];

      // Compose the next row state
      const merged = {
        studentName: existing?.studentName ?? null,
        seekerName: existing?.seekerName ?? null,
        detectiveName: existing?.detectiveName ?? null,
        lastName: existing?.lastName ?? null,
      };
      (merged as Record<string, string | null>)[col] = input.name;

      const slotsCompleted =
        (merged.studentName ? 1 : 0) +
        (merged.seekerName ? 1 : 0) +
        (merged.detectiveName ? 1 : 0) +
        (merged.lastName ? 1 : 0);

      // On completion, author the Loredex entry
      let loredexEntryId: number | null = existing?.loredexEntryId ?? null;
      let completedAt: Date | null = existing?.completedAt ?? null;
      let justCompleted = false;

      if (slotsCompleted === 4 && !existing?.completedAt) {
        const chainNarrative =
          `You stood in The Trench and named yourself four times.\n\n` +
          `Student: **${merged.studentName}**\n` +
          `Seeker: **${merged.seekerName}**\n` +
          `Detective: **${merged.detectiveName}**\n` +
          `Last: **${merged.lastName}**\n\n` +
          `Every major figure in the saga has an identity chain. The ` +
          `Student → The Seeker → The Detective → The Human. The Prince ` +
          `→ The Engineer → Warlord Zero → Agent Zero's body. You now ` +
          `have one too. Nilmorg watched. He found it mildly ` +
          `interesting. The Antiquarian, who watches everything, took ` +
          `notes.`;

        const [inserted] = await db.insert(loreJournalEntries).values({
          userId: ctx.user.id,
          title: `The Chain of ${merged.lastName ?? "the Last"}`,
          content: chainNarrative,
          category: "personal_log",
          wordCount: chainNarrative.split(/\s+/).filter(Boolean).length,
          xpEarned: 0,
          published: false,
        }).$returningId();
        loredexEntryId = inserted?.id ?? null;
        completedAt = new Date();
        justCompleted = true;

        // Also set the narrative flags in userProgress.gameData. The
        // WITNESSING_NARRATIVE_PROPOSAL §10.1 specifies two flags:
        // dead_mans_circuit_complete and player_identity_chain_authored.
        const [progressRow] = await db.select().from(userProgress)
          .where(eq(userProgress.userId, ctx.user.id))
          .limit(1);
        const prevGameData = (progressRow?.gameData as Record<string, unknown> | null) ?? {};
        const prevFlags = (typeof prevGameData.narrativeFlags === "object" && prevGameData.narrativeFlags !== null
          ? prevGameData.narrativeFlags
          : {}) as Record<string, boolean>;
        const newFlags = {
          ...prevFlags,
          dead_mans_circuit_complete: true,
          player_identity_chain_authored: true,
          // Act 4.5 completion gate reads the canonical
          // `act_4_5_circuit_complete` name from
          // apps/shared/actsFourFiveShells.ts DEAD_MANS_CIRCUIT_TRACKS.
          // Write both names so the existing WITNESSING §10.1 flag
          // stays for backwards compat AND the new gate fires.
          act_4_5_circuit_complete: true,
        };
        const newGameData = { ...prevGameData, narrativeFlags: newFlags };
        if (progressRow) {
          await db.update(userProgress)
            .set({ gameData: newGameData })
            .where(eq(userProgress.userId, ctx.user.id));
        } else {
          await db.insert(userProgress).values({
            userId: ctx.user.id,
            gameData: newGameData,
          });
        }
      }

      // Upsert the chain row
      if (existing) {
        await db.update(circuitIdentityChains)
          .set({
            ...merged,
            slotsCompleted,
            loredexEntryId,
            completedAt,
          })
          .where(eq(circuitIdentityChains.id, existing.id));
      } else {
        await db.insert(circuitIdentityChains).values({
          userId: ctx.user.id,
          ...merged,
          slotsCompleted,
          loredexEntryId,
          completedAt,
        });
      }

      return {
        success: true,
        slot: input.slot,
        name: input.name,
        slotsCompleted,
        chainComplete: slotsCompleted === 4,
        justCompleted,
        loredexEntryId,
      };
    }),

  /* ═══ ADMIN LIFECYCLE CONTROLS ═══
     Escape hatches for the architect console. Normal season
     progression runs via the hourly background tick in
     _core/index.ts; these exist for testing and live intervention. */

  /** Force the tick to run now. Opens the in-window season if one
     is missing and advances phase on anything already active. */
  openSeasonManual: adminProcedure.mutation(async () => {
    const result = await tickCircuitSeasons(new Date());
    return {
      success: true,
      ...result,
    };
  }),

  /** Force-close an active season. Optionally accepts a champion
     override for when the admin needs to pick a winner by hand. */
  closeSeasonManual: adminProcedure
    .input(z.object({
      seasonId: z.number(),
      championUserId: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");

      const [season] = await db.select().from(circuitSeasons)
        .where(eq(circuitSeasons.id, input.seasonId))
        .limit(1);
      if (!season) throw new Error("Season not found");
      if (season.status === "ended") {
        throw new Error("Season is already closed");
      }

      // Champion defaults to the current leaderboard leader if the
      // caller didn't pin one.
      let championUserId = input.championUserId ?? null;
      if (championUserId == null) {
        const [top] = await db.select().from(circuitLeaderboard)
          .where(eq(circuitLeaderboard.seasonId, input.seasonId))
          .orderBy(desc(circuitLeaderboard.totalCp))
          .limit(1);
        championUserId = top?.userId ?? null;
      }

      const now = new Date();
      await db.update(circuitSeasons)
        .set({
          status: "ended",
          championUserId,
          closedAt: now,
        })
        .where(eq(circuitSeasons.id, season.id));

      // Sever all still-active clones — the race is over for them
      await db.update(circuitClones)
        .set({ status: "severed" })
        .where(and(
          eq(circuitClones.seasonId, season.id),
          eq(circuitClones.status, "active"),
        ));

      return {
        success: true,
        seasonId: season.id,
        championUserId,
        closedAt: now,
      };
    }),
});
