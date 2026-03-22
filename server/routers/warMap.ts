/* ═══════════════════════════════════════════════════════
   WAR MAP ROUTER — Faction Territory Control
   
   Real-time faction war between Empire (Architect) and
   Insurgency (Dreamer) with weekly season resets.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { eq, and, desc, sql, count, sum } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  warTerritories,
  warContributions,
  warSeasons,
  twSectors,
  twPlayerState,
} from "../../drizzle/schema";

/* ─── SEASON NAMES ─── */
const SEASON_NAMES = [
  "The First Conflict",
  "The Architect's Gambit",
  "The Dreamer's Awakening",
  "The Panopticon Wars",
  "The Babylon Siege",
  "The Void Incursion",
  "The Neyon Uprising",
  "The Oracle's Prophecy",
  "The Source Code War",
  "The Final Reckoning",
];

/* ─── HELPERS ─── */

/** Get or create the current active season */
async function getCurrentSeason() {
  const db = (await getDb())!;
  const [active] = await db
    .select()
    .from(warSeasons)
    .where(sql`${warSeasons.endedAt} IS NULL`)
    .orderBy(desc(warSeasons.id))
    .limit(1);

  if (active) return active;

  // Create first season
  const [created] = await db.insert(warSeasons).values({
    seasonNumber: 1,
    name: SEASON_NAMES[0],
  }).$returningId();

  const [season] = await db.select().from(warSeasons).where(eq(warSeasons.id, created.id));
  return season;
}

/** Initialize territories for a season if they don't exist */
async function ensureTerritoriesExist(seasonId: number) {
  const db = (await getDb())!;
  const [existing] = await db
    .select({ cnt: count() })
    .from(warTerritories)
    .where(eq(warTerritories.seasonId, seasonId));

  if (existing.cnt > 0) return;

  // Get all sectors
  const sectors = await db.select({ sectorId: twSectors.sectorId }).from(twSectors);

  // Initialize all sectors as contested (50/50)
  const values = sectors.map((s) => ({
    sectorId: s.sectorId,
    faction: null as any,
    controlPoints: 50,
    seasonId,
  }));

  // Batch insert
  for (let i = 0; i < values.length; i += 50) {
    const batch = values.slice(i, i + 50);
    if (batch.length > 0) {
      await db.insert(warTerritories).values(batch);
    }
  }
}

/** Check if a season should end (7 days) and rotate */
async function checkSeasonRotation() {
  const db = (await getDb())!;
  const season = await getCurrentSeason();
  const startedAt = new Date(season.startedAt).getTime();
  const now = Date.now();
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

  if (now - startedAt < WEEK_MS) return season;

  // Season ended — determine winner
  const territories = await db
    .select()
    .from(warTerritories)
    .where(eq(warTerritories.seasonId, season.id));

  let empireControl = 0;
  let insurgencyControl = 0;
  for (const t of territories) {
    if (t.faction === "empire") empireControl++;
    else if (t.faction === "insurgency") insurgencyControl++;
  }

  const winner = empireControl > insurgencyControl ? "empire" : "insurgency";

  // End current season
  await db
    .update(warSeasons)
    .set({
      winner: winner as any,
      endedAt: new Date(),
      rewards: {
        empireControl,
        insurgencyControl,
        totalSectors: territories.length,
      },
    })
    .where(eq(warSeasons.id, season.id));

  // Create new season
  const nextNumber = season.seasonNumber + 1;
  const [created] = await db.insert(warSeasons).values({
    seasonNumber: nextNumber,
    name: SEASON_NAMES[(nextNumber - 1) % SEASON_NAMES.length],
  }).$returningId();

  const [newSeason] = await db.select().from(warSeasons).where(eq(warSeasons.id, created.id));
  return newSeason;
}

export const warMapRouter = router({
  /** Get the current war map state — all territories with control data */
  getWarMap: protectedProcedure.query(async ({ ctx }) => {
      const db = (await getDb())!;
    const season = await checkSeasonRotation();
    await ensureTerritoriesExist(season.id);

    // Get all territories for this season
    const territories = await db
      .select()
      .from(warTerritories)
      .where(eq(warTerritories.seasonId, season.id));

    // Get sector info for named sectors
    const sectors = await db.select().from(twSectors);
    const sectorMap = new Map<number, any>(sectors.map((s: any) => [s.sectorId, s]));

    // Get faction totals
    let empireCount = 0;
    let insurgencyCount = 0;
    let contestedCount = 0;
    for (const t of territories) {
      if (t.faction === "empire") empireCount++;
      else if (t.faction === "insurgency") insurgencyCount++;
      else contestedCount++;
    }

    // Get player's faction
    const [player] = await db
      .select({ faction: twPlayerState.faction })
      .from(twPlayerState)
      .where(eq(twPlayerState.userId, ctx.user.id))
      .limit(1);

    // Get top contributors for each faction this season
    const topEmpire = await db
      .select({
        userId: warContributions.userId,
        totalPoints: sum(warContributions.points),
      })
      .from(warContributions)
      .where(
        and(
          eq(warContributions.seasonId, season.id),
          eq(warContributions.faction, "empire")
        )
      )
      .groupBy(warContributions.userId)
      .orderBy(desc(sum(warContributions.points)))
      .limit(5);

    const topInsurgency = await db
      .select({
        userId: warContributions.userId,
        totalPoints: sum(warContributions.points),
      })
      .from(warContributions)
      .where(
        and(
          eq(warContributions.seasonId, season.id),
          eq(warContributions.faction, "insurgency")
        )
      )
      .groupBy(warContributions.userId)
      .orderBy(desc(sum(warContributions.points)))
      .limit(5);

    // Get player's contribution this season
    const [myContrib] = await db
      .select({
        totalPoints: sum(warContributions.points),
        actions: count(),
      })
      .from(warContributions)
      .where(
        and(
          eq(warContributions.seasonId, season.id),
          eq(warContributions.userId, ctx.user.id)
        )
      );

    return {
      season: {
        id: season.id,
        number: season.seasonNumber,
        name: season.name,
        startedAt: season.startedAt,
        endsAt: new Date(new Date(season.startedAt).getTime() + 7 * 24 * 60 * 60 * 1000),
      },
      territories: territories.map((t: any) => {
        const sector = sectorMap.get(t.sectorId) as any;
        return {
          sectorId: t.sectorId,
          sectorName: sector?.name || `Sector ${t.sectorId}`,
          sectorType: sector?.sectorType || "empty",
          faction: t.faction,
          controlPoints: t.controlPoints,
          contestCount: t.contestCount,
          lastCaptured: t.lastCaptured,
        };
      }),
      factionTotals: {
        empire: empireCount,
        insurgency: insurgencyCount,
        contested: contestedCount,
        total: territories.length,
      },
      playerFaction: player?.faction || "empire",
      myContribution: {
        totalPoints: Number(myContrib?.totalPoints || 0),
        actions: Number(myContrib?.actions || 0),
      },
      leaderboard: {
        empire: topEmpire.map((e: { userId: number; totalPoints: string | number | null }) => ({
          userId: e.userId,
          points: Number(e.totalPoints || 0),
        })),
        insurgency: topInsurgency.map((e: { userId: number; totalPoints: string | number | null }) => ({
          userId: e.userId,
          points: Number(e.totalPoints || 0),
        })),
      },
    };
  }),

  /** Capture or reinforce a sector for your faction */
  contestSector: protectedProcedure
    .input(
      z.object({
        sectorId: z.number(),
        action: z.enum(["capture", "reinforce", "sabotage"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const season = await getCurrentSeason();

      // Get player's faction
      const [player] = await db
        .select({ faction: twPlayerState.faction, currentSector: twPlayerState.currentSector })
        .from(twPlayerState)
        .where(eq(twPlayerState.userId, ctx.user.id))
        .limit(1);

      if (!player) {
        return { success: false, message: "You must start Trade Empire first." };
      }

      const faction = player.faction || "empire";

      // Get territory state
      const [territory] = await db
        .select()
        .from(warTerritories)
        .where(
          and(
            eq(warTerritories.sectorId, input.sectorId),
            eq(warTerritories.seasonId, season.id)
          )
        )
        .limit(1);

      if (!territory) {
        return { success: false, message: "Sector not found in war map." };
      }

      let pointsChange = 0;
      let actionType: "capture" | "reinforce" | "sabotage" | "defend" = input.action;
      let message = "";

      switch (input.action) {
        case "capture": {
          // Can only capture contested or enemy sectors
          if (territory.faction === faction && territory.controlPoints >= 80) {
            return { success: false, message: "This sector is already firmly under your faction's control." };
          }
          pointsChange = 15;
          if (territory.faction && territory.faction !== faction) {
            // Attacking enemy territory
            const newPoints = Math.max(0, territory.controlPoints - pointsChange);
            const newFaction = newPoints <= 0 ? faction : territory.faction;
            const finalPoints = newPoints <= 0 ? 15 : newPoints;
            await db
              .update(warTerritories)
              .set({
                faction: newFaction as any,
                controlPoints: finalPoints,
                contestCount: territory.contestCount + 1,
                lastCaptured: newPoints <= 0 ? new Date() : territory.lastCaptured,
              })
              .where(eq(warTerritories.id, territory.id));
            message = newPoints <= 0
              ? `SECTOR CAPTURED! ${faction === "empire" ? "The Architect's" : "The Dreamer's"} forces now control Sector ${input.sectorId}!`
              : `Attack successful! Enemy control reduced to ${newPoints}%.`;
          } else {
            // Capturing neutral/contested
            await db
              .update(warTerritories)
              .set({
                faction: faction as any,
                controlPoints: Math.min(100, (territory.controlPoints || 0) + pointsChange),
                lastCaptured: new Date(),
              })
              .where(eq(warTerritories.id, territory.id));
            message = `Sector claimed for ${faction === "empire" ? "the Empire" : "the Insurgency"}!`;
          }
          break;
        }
        case "reinforce": {
          if (territory.faction !== faction) {
            return { success: false, message: "You can only reinforce sectors your faction controls." };
          }
          pointsChange = 10;
          const newPoints = Math.min(100, territory.controlPoints + pointsChange);
          await db
            .update(warTerritories)
            .set({ controlPoints: newPoints })
            .where(eq(warTerritories.id, territory.id));
          message = `Defenses reinforced! Control strength: ${newPoints}%.`;
          break;
        }
        case "sabotage": {
          if (!territory.faction || territory.faction === faction) {
            return { success: false, message: "You can only sabotage enemy-controlled sectors." };
          }
          pointsChange = 8;
          const newPoints = Math.max(0, territory.controlPoints - pointsChange);
          const flipped = newPoints <= 0;
          await db
            .update(warTerritories)
            .set({
              controlPoints: flipped ? 10 : newPoints,
              faction: flipped ? (faction as any) : territory.faction,
              contestCount: territory.contestCount + 1,
              lastCaptured: flipped ? new Date() : territory.lastCaptured,
            })
            .where(eq(warTerritories.id, territory.id));
          message = flipped
            ? `Sabotage successful! Sector flipped to ${faction === "empire" ? "Empire" : "Insurgency"}!`
            : `Sabotage dealt ${pointsChange} damage. Enemy control: ${newPoints}%.`;
          actionType = "sabotage";
          break;
        }
      }

      // Log contribution
      await db.insert(warContributions).values({
        userId: ctx.user.id,
        sectorId: input.sectorId,
        faction: faction as any,
        actionType: actionType as any,
        points: pointsChange,
        seasonId: season.id,
      });

      // Award civil skill XP based on action type
      const { awardCivilXp } = await import("../civilSkillHelper");
      if (actionType === "capture") {
        awardCivilXp(ctx.user.id, "capture_territory").catch(() => {});
      } else if (actionType === "sabotage") {
        awardCivilXp(ctx.user.id, "sabotage_territory").catch(() => {});
      }

      return { success: true, message, pointsEarned: pointsChange };
    }),

  /** Get past season results */
  getSeasonHistory: protectedProcedure.query(async () => {
      const db = (await getDb())!;
    const seasons = await db
      .select()
      .from(warSeasons)
      .where(sql`${warSeasons.endedAt} IS NOT NULL`)
      .orderBy(desc(warSeasons.seasonNumber))
      .limit(10);

    return seasons.map((s: any) => ({
      number: s.seasonNumber,
      name: s.name,
      winner: s.winner,
      startedAt: s.startedAt,
      endedAt: s.endedAt,
      rewards: s.rewards,
    }));
  }),

  /** Get player's war stats across all seasons */
  getMyWarStats: protectedProcedure.query(async ({ ctx }) => {
      const db = (await getDb())!;
    const contributions = await db
      .select({
        seasonId: warContributions.seasonId,
        actionType: warContributions.actionType,
        totalPoints: sum(warContributions.points),
        actionCount: count(),
      })
      .from(warContributions)
      .where(eq(warContributions.userId, ctx.user.id))
      .groupBy(warContributions.seasonId, warContributions.actionType);

    return contributions.map((c: any) => ({
      seasonId: c.seasonId,
      actionType: c.actionType,
      totalPoints: Number(c.totalPoints || 0),
      actionCount: Number(c.actionCount || 0),
    }));
  }),
});
