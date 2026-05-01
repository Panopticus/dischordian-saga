/* ═══════════════════════════════════════════════════════
   GUILD WARS — Faction vs Faction Territory Control Events
   Members contribute fight wins, PvP wins, trade volume,
   quest completions, and chess wins toward their faction's score.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { logger } from "../logger";
import { grantCardReward } from "../services/cardRewardService";
import { eq, and, desc, sql, gte, lte } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  guildWars, guildWarContributions, guilds, guildMembers,
  notifications, dreamBalance, marketTaxPool,
} from "../../db/schema";
import { fetchCitizenData, fetchPotentialNftData, resolveGuildWarBonuses } from "../traitResolver";
import { getConsequences } from "../services/universeConsequences";
import { pressureService } from "../services/pressureService";
import { warEventCutscene } from "@shared/expansionArt/guildCutsceneVoMap";

/** Territory names tied to Dischordian Saga lore */
const TERRITORIES = [
  { name: "The Panopticon Core", bonus: "dream_boost", bonusValue: 10, description: "Central surveillance hub — controlling faction earns +10% Dream from all sources" },
  { name: "Inception Ark Docks", bonus: "trade_boost", bonusValue: 15, description: "Primary trade nexus — controlling faction earns +15% credits from Trade Wars" },
  { name: "The Oracle's Sanctum", bonus: "card_boost", bonusValue: 5, description: "Prophetic chamber — controlling faction draws +1 extra card per card battle" },
  { name: "Necromancer's Crypt", bonus: "fight_boost", bonusValue: 10, description: "Dark arena — controlling faction fighters gain +10% damage in Fight Game" },
  { name: "The Source Nexus", bonus: "xp_boost", bonusValue: 20, description: "Reality wellspring — controlling faction earns +20% XP from all activities" },
  { name: "Architect's Workshop", bonus: "craft_boost", bonusValue: 15, description: "Master forge — controlling faction gets +15% chance of bonus materials from crafting" },
  { name: "The Enigma Vault", bonus: "loot_boost", bonusValue: 10, description: "Hidden treasury — controlling faction gets +10% rare drop rate" },
  { name: "Iron Lion Citadel", bonus: "defense_boost", bonusValue: 10, description: "Fortified stronghold — controlling faction guild members take -10% damage in PvP" },
];

/** Point values for different contribution sources */
const POINT_VALUES: Record<string, number> = {
  fight_win: 10,
  pvp_win: 25,
  trade_volume: 1,   // per 100 credits traded
  quest_complete: 15,
  card_battle_win: 15,
  chess_win: 20,
  terminus_wave: 15,          // per wave survived in Terminus Swarm
  terminus_boss_kill: 50,     // per boss killed
  terminus_pvp_star: 30,      // per star in TD PvP raid
  terminus_defense: 25,       // successful base defense
};

export const guildWarsRouter = router({
  /* ──────────────────────────────────────────────
     GET ACTIVE WARS
     ────────────────────────────────────────────── */
  getActiveWars: protectedProcedure.query(async ({ ctx }) => {
    const db = (await getDb())!;
    const now = new Date();
    const wars = await db.select().from(guildWars)
      .where(eq(guildWars.status, "active"))
      .orderBy(desc(guildWars.startsAt));
    return wars;
  }),

  /** Get all wars (active + upcoming + recent ended) */
  getAllWars: protectedProcedure.query(async ({ ctx }) => {
    const db = (await getDb())!;
    const wars = await db.select().from(guildWars)
      .orderBy(desc(guildWars.startsAt))
      .limit(20);
    return wars;
  }),

  /** Get war details with contribution leaderboard */
  getWarDetails: protectedProcedure
    .input(z.object({ warId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const war = await db.select().from(guildWars)
        .where(eq(guildWars.id, input.warId)).limit(1);
      if (!war[0]) throw new Error("War not found");

      // Get top contributors
      const contributions = await db.select({
        guildId: guildWarContributions.guildId,
        userId: guildWarContributions.userId,
        totalPoints: sql<number>`SUM(${guildWarContributions.points})`,
        source: guildWarContributions.source,
      }).from(guildWarContributions)
        .where(eq(guildWarContributions.warId, input.warId))
        .groupBy(guildWarContributions.userId, guildWarContributions.guildId, guildWarContributions.source)
        .orderBy(desc(sql`SUM(${guildWarContributions.points})`))
        .limit(50);

      // Get guild scores
      const guildScores = await db.select({
        guildId: guildWarContributions.guildId,
        totalPoints: sql<number>`SUM(${guildWarContributions.points})`,
      }).from(guildWarContributions)
        .where(eq(guildWarContributions.warId, input.warId))
        .groupBy(guildWarContributions.guildId)
        .orderBy(desc(sql`SUM(${guildWarContributions.points})`));

      return { war: war[0], contributions, guildScores };
    }),

  /** Contribute points to the active war for your faction */
  contribute: protectedProcedure
    .input(z.object({
      warId: z.number(),
      source: z.enum(["fight_win", "pvp_win", "trade_volume", "quest_complete", "card_battle_win", "chess_win", "terminus_wave", "terminus_boss_kill", "terminus_pvp_star", "terminus_defense"]),
      rawValue: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = (await getDb())!;

      // Verify war is active
      const war = await db.select().from(guildWars)
        .where(and(eq(guildWars.id, input.warId), eq(guildWars.status, "active")))
        .limit(1);
      if (!war[0]) throw new Error("No active war found");

      // Get player's guild
      const membership = await db.select().from(guildMembers)
        .where(eq(guildMembers.userId, ctx.user.id)).limit(1);
      if (!membership[0]) throw new Error("You must be in a guild to contribute to wars");

      // Get guild faction
      const guild = await db.select().from(guilds)
        .where(eq(guilds.id, membership[0].guildId)).limit(1);
      if (!guild[0]) throw new Error("Guild not found");

      // Verify guild faction matches one of the war factions
      const guildFaction = guild[0].faction;
      if (guildFaction !== war[0].factionA && guildFaction !== war[0].factionB) {
        throw new Error("Your guild's faction is not participating in this war");
      }

      // Fetch citizen trait bonuses for guild wars
      const [warCitizen, warNft] = await Promise.all([
        fetchCitizenData(ctx.user.id),
        fetchPotentialNftData(ctx.user.id),
      ]);
      const warTb = resolveGuildWarBonuses(warCitizen, warNft);

      // Calculate points — apply trait multiplier
      const basePoints = POINT_VALUES[input.source] || 10;
      const rawPoints = input.source === "trade_volume"
        ? Math.floor((input.rawValue || 0) / 100) * basePoints
        : basePoints;

      // Apply war point multiplier from traits
      let points = Math.round(rawPoints * warTb.warPointMultiplier);

      // Check if the war territory matches player's element affinity
      if (war[0].territory && warTb.boostedTerritories.includes(war[0].territory)) {
        points = Math.round(points * (1 + warTb.elementTerritoryBonus));
      }

      // Apply Living Universe guild war score multiplier
      const fx = await getConsequences();
      points = Math.round(points * fx.guildWarScoreMultiplier);

      if (points <= 0) return { success: false, message: "No points earned" };

      // F.3.2 first-blood detection — read the war row before we
      // mutate it. If both factions are still at 0, this is the
      // first contribution of the war and we fire the cs_war_first_blood
      // cinematic alongside the normal point-award response.
      const wasFirstBlood = war[0].scoreA === 0 && war[0].scoreB === 0;

      // Record contribution
      await db.insert(guildWarContributions).values({
        warId: input.warId,
        guildId: membership[0].guildId,
        userId: ctx.user.id,
        points,
        source: input.source,
      });

      // Update war score
      const scoreField = guildFaction === war[0].factionA ? "scoreA" : "scoreB";
      await db.update(guildWars)
        .set({ [scoreField]: sql`${guildWars[scoreField]} + ${points}` })
        .where(eq(guildWars.id, input.warId));

      // Award class mastery XP for guild war contribution
      const { awardClassXp } = await import("../classMasteryHelper");
      awardClassXp(ctx.user.id, "guild_war_contribute").catch(e => logger.error("[GuildWars] Class XP award failed:", e));

      // Award civil skill XP (tactics + endurance)
      const { awardCivilXp } = await import("../civilSkillHelper");
      awardCivilXp(ctx.user.id, "guild_war_contribute").catch(e => logger.error("[GuildWars] Civil XP award failed:", e));

      return {
        success: true,
        points,
        faction: guildFaction,
        traitMultiplier: warTb.warPointMultiplier,
        cutscene: wasFirstBlood ? warEventCutscene("war_first_blood") : undefined,
      };
    }),

  /** Get player's contribution summary for a war */
  myContributions: protectedProcedure
    .input(z.object({ warId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const contributions = await db.select({
        source: guildWarContributions.source,
        totalPoints: sql<number>`SUM(${guildWarContributions.points})`,
        count: sql<number>`COUNT(*)`,
      }).from(guildWarContributions)
        .where(and(
          eq(guildWarContributions.warId, input.warId),
          eq(guildWarContributions.userId, ctx.user.id),
        ))
        .groupBy(guildWarContributions.source);
      return contributions;
    }),

  /** Get available territories and their current control status */
  getTerritories: protectedProcedure.query(async () => {
    return TERRITORIES;
  }),

  /** Get full territory map with active war overlays and control history */
  getTerritoryMap: protectedProcedure.query(async ({ ctx }) => {
    const db = (await getDb())!;

    // Get all active wars
    const activeWars = await db.select().from(guildWars)
      .where(eq(guildWars.status, "active"))
      .orderBy(desc(guildWars.startsAt));

    // Get recently ended wars (last 7 days) for control history
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentWars = await db.select().from(guildWars)
      .where(and(
        eq(guildWars.status, "ended"),
        gte(guildWars.endsAt, weekAgo),
      ))
      .orderBy(desc(guildWars.endsAt))
      .limit(20);

    // Get user's guild and faction
    const membership = await db.select().from(guildMembers)
      .where(eq(guildMembers.userId, ctx.user.id)).limit(1);
    let userFaction: string | null = null;
    let userGuildId: number | null = null;
    if (membership[0]) {
      userGuildId = membership[0].guildId;
      const guild = await db.select().from(guilds)
        .where(eq(guilds.id, membership[0].guildId)).limit(1);
      if (guild[0]) userFaction = guild[0].faction;
    }

    // Build territory map
    const territoryMap = TERRITORIES.map((territory) => {
      // Find active war for this territory
      const activeWar = activeWars.find(w => w.territory === territory.name);
      // Find most recent ended war for this territory
      const lastWar = recentWars.find(w => w.territory === territory.name);

      let controller: string | null = null;
      let controlScore = 0;
      let contested = false;

      if (activeWar) {
        contested = true;
        const total = activeWar.scoreA + activeWar.scoreB;
        controlScore = total > 0 ? Math.round((activeWar.scoreA / total) * 100) : 50;
      } else if (lastWar) {
        // Territory controlled by the winner of the last war
        if (lastWar.scoreA > lastWar.scoreB) {
          controller = lastWar.factionA;
          controlScore = 100;
        } else if (lastWar.scoreB > lastWar.scoreA) {
          controller = lastWar.factionB;
          controlScore = 100;
        }
      }

      return {
        ...territory,
        activeWar: activeWar ? {
          id: activeWar.id,
          name: activeWar.name,
          factionA: activeWar.factionA,
          factionB: activeWar.factionB,
          scoreA: activeWar.scoreA,
          scoreB: activeWar.scoreB,
          endsAt: activeWar.endsAt,
          startsAt: activeWar.startsAt,
        } : null,
        controller,
        controlScore,
        contested,
        lastWar: lastWar ? {
          winner: lastWar.scoreA > lastWar.scoreB ? lastWar.factionA
            : lastWar.scoreB > lastWar.scoreA ? lastWar.factionB : "draw",
          endedAt: lastWar.endsAt,
        } : null,
      };
    });

    return {
      territories: territoryMap,
      userFaction,
      userGuildId,
      activeWarCount: activeWars.length,
    };
  }),

  /** Admin: Create a new guild war event */
  createWar: protectedProcedure
    .input(z.object({
      name: z.string().min(3).max(128),
      factionA: z.enum(["empire", "insurgency", "neutral"]),
      factionB: z.enum(["empire", "insurgency", "neutral"]),
      territory: z.string(),
      durationHours: z.number().min(1).max(168).default(48),
      prizePoolDream: z.number().min(0).default(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const startsAt = new Date();
      const endsAt = new Date(startsAt.getTime() + input.durationHours * 60 * 60 * 1000);

      // Optionally fund from tax pool
      if (input.prizePoolDream > 0) {
        const pool = await db.select().from(marketTaxPool).limit(1);
        if (pool[0] && pool[0].poolDream >= input.prizePoolDream) {
          await db.update(marketTaxPool)
            .set({ poolDream: sql`${marketTaxPool.poolDream} - ${input.prizePoolDream}` })
            .where(eq(marketTaxPool.id, pool[0].id));
        }
      }

      const result = await db.insert(guildWars).values({
        name: input.name,
        factionA: input.factionA,
        factionB: input.factionB,
        territory: input.territory,
        prizePoolDream: input.prizePoolDream,
        startsAt,
        endsAt,
        status: "active",
      });

      return {
        success: true,
        warId: Number(result[0].insertId),
        // F.3.1 cinematic — clients render <GuildCutscenePlayer csId
        // voLineId /> from this trigger when the war banner mounts.
        cutscene: warEventCutscene("war_declared"),
      };
    }),

  /** Resolve an ended war — distribute prizes to winning faction's guilds */
  resolveWar: protectedProcedure
    .input(z.object({ warId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const war = await db.select().from(guildWars)
        .where(eq(guildWars.id, input.warId)).limit(1);
      if (!war[0]) throw new Error("War not found");
      if (war[0].status === "ended") throw new Error("War already resolved");

      // Determine winner
      const winnerFaction = war[0].scoreA > war[0].scoreB ? war[0].factionA
        : war[0].scoreB > war[0].scoreA ? war[0].factionB
        : null; // draw

      // Mark as ended
      await db.update(guildWars)
        .set({ status: "ended" })
        .where(eq(guildWars.id, input.warId));

      // F.3.3 MVP detection — top contributor across the war,
      // computed once here and re-used for both the cinematic
      // trigger and the playerName SSML slot in the VO line.
      const mvpRows = await db
        .select({
          userId: guildWarContributions.userId,
          totalPoints: sql<number>`SUM(${guildWarContributions.points})`,
        })
        .from(guildWarContributions)
        .where(eq(guildWarContributions.warId, input.warId))
        .groupBy(guildWarContributions.userId)
        .orderBy(desc(sql`SUM(${guildWarContributions.points})`))
        .limit(1);
      const mvpUserId = mvpRows[0]?.userId ?? null;
      const mvpPoints = Number(mvpRows[0]?.totalPoints ?? 0);

      if (!winnerFaction || war[0].prizePoolDream <= 0) {
        return {
          success: true,
          winner: winnerFaction || "draw",
          distributed: 0,
          mvpUserId,
          mvpPoints,
          // F.3.3 still fires on draws — there's still a top contributor
          // to crown — but war_victory does not.
          cutscenes: mvpUserId
            ? [warEventCutscene("war_mvp_crowned")]
            : [],
        };
      }

      // Get winning faction guilds that contributed
      const winningGuilds = await db.select({
        guildId: guildWarContributions.guildId,
        totalPoints: sql<number>`SUM(${guildWarContributions.points})`,
      }).from(guildWarContributions)
        .where(eq(guildWarContributions.warId, input.warId))
        .groupBy(guildWarContributions.guildId);

      // Filter to only winning faction guilds
      const winnerGuildIds = new Set<number>();
      for (const gc of winningGuilds) {
        const g = await db.select().from(guilds).where(eq(guilds.id, gc.guildId)).limit(1);
        if (g[0] && g[0].faction === winnerFaction) {
          winnerGuildIds.add(gc.guildId);
        }
      }

      // Distribute prize proportionally to contribution
      const totalWinnerPoints = winningGuilds
        .filter((g) => winnerGuildIds.has(g.guildId))
        .reduce((sum: number, g) => sum + g.totalPoints, 0);

      if (totalWinnerPoints > 0) {
        for (const gc of winningGuilds) {
          if (!winnerGuildIds.has(gc.guildId)) continue;
          const share = Math.floor((gc.totalPoints / totalWinnerPoints) * war[0].prizePoolDream);
          if (share > 0) {
            await db.update(guilds)
              .set({ treasuryDream: sql`${guilds.treasuryDream} + ${share}` })
              .where(eq(guilds.id, gc.guildId));
          }
        }
      }

      // Notify all contributing members of winning guilds.
      // Task 5.3 — Include the faction shift in the message so players
      // see the cross-system consequence ("your guild's victory shifted
      // the empire faction balance by +N"), and record an analytics
      // event so admin tooling can chart the shifts over time.
      const factionShiftPoints = Math.max(1, Math.floor((war[0].scoreA + war[0].scoreB) / 100));

      // Task 5.3 — Bump community pressure for the winning faction.
      // Empire victories push the `exploration` dimension (feeds
      // Antiquarian's Revelation); insurgency victories push
      // `betrayals` (feeds Shadow Tongue). This is the first real
      // cross-system pull between guild wars and the Living Universe
      // event system — guild-level outcomes now nudge community-wide
      // narrative meters.
      try {
        // Use one of the contributors as the pressure owner so the
        // entry links to a real userId. If there are no contributors
        // (shouldn't happen post-resolution), skip the bump.
        const pressureOwner = winningGuilds.find((g) => winnerGuildIds.has(g.guildId));
        if (pressureOwner) {
          const [anyMember] = await db.select({ userId: guildMembers.userId })
            .from(guildMembers)
            .where(eq(guildMembers.guildId, pressureOwner.guildId))
            .limit(1);
          if (anyMember) {
            const pressureType = winnerFaction === "insurgency" ? "betrayals" : "exploration";
            await pressureService.increment(
              anyMember.userId,
              pressureType,
              factionShiftPoints,
              `guild_war_resolved_${input.warId}_${winnerFaction}`,
            );
          }
        }
      } catch (e) {
        logger.error("[GuildWars] Faction pressure increment failed:", e);
      }

      // Grant card reward for territory capture to all contributing members of winning guilds
      for (const guildId of Array.from(winnerGuildIds)) {
        const members = await db.select({ userId: guildMembers.userId }).from(guildMembers)
          .where(eq(guildMembers.guildId, guildId));
        for (const m of members) {
          try {
            await grantCardReward(m.userId, "guild_wars_territory");
          } catch (e) {
            logger.warn("Failed to grant guild wars territory card reward", e);
          }
          db.insert(notifications).values({
            userId: m.userId,
            type: "guild_war_victory",
            title: "Faction War Victory!",
            message: `Your faction ${winnerFaction} won the war! Prize Dream distributed to your guild treasury, and your victory shifted the ${winnerFaction} faction balance by +${factionShiftPoints}.`,
            actionUrl: "/guild",
          }).catch(e => logger.error("[GuildWars] Notification send failed:", e));
        }
      }
      // F.3.7 — thought-virus reinfection. The Living Universe
      // event "terminus_advance" is the bible-canonical signal that
      // viral contamination is spreading through the system; if
      // it's active when a war resolves, the corruption-arc
      // cinematic plays alongside the victory beat. Cheap check
      // because getConsequences caches.
      const universe = await getConsequences();
      const reinfectionActive = universe.activeEventIds.includes(
        "terminus_advance",
      );

      // Build the cinematic queue — MVP coronation chains in front
      // of the global war_victory so the player who placed first sees
      // their name spoken before the celebratory beat. Reinfection
      // chains last so it plays as an aftermath / coda.
      const cutscenes = [
        ...(mvpUserId ? [warEventCutscene("war_mvp_crowned")] : []),
        warEventCutscene("war_victory"),
        ...(reinfectionActive ? [warEventCutscene("thought_virus_reinfection")] : []),
      ];

      return {
        success: true,
        winner: winnerFaction,
        distributed: war[0].prizePoolDream,
        factionShiftPoints,
        factionShiftMessage: `Your guild's victory shifted the ${winnerFaction} faction balance by +${factionShiftPoints}`,
        mvpUserId,
        mvpPoints,
        // F.3.4 / F.3.5 cinematic — the resolver doesn't know
        // whether the *caller* is on the winning or losing side, so
        // it returns the global victory cutscene; the client decides
        // whether to render this or swap to cs_war_defeat by checking
        // the caller's guild membership against winnerFaction.
        cutscenes,
      };
    }),

  /** Register guild for a war — costs treasury Dream as entry fee */
  registerGuild: protectedProcedure
    .input(z.object({ warId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = (await getDb())!;

      // Verify war exists and is active
      const [war] = await db.select().from(guildWars)
        .where(and(eq(guildWars.id, input.warId), eq(guildWars.status, "active")));
      if (!war) throw new Error("No active war found");

      // Get player's guild
      const [membership] = await db.select().from(guildMembers)
        .where(eq(guildMembers.userId, ctx.user.id));
      if (!membership) throw new Error("You must be in a guild");
      if (membership.role !== "leader" && membership.role !== "officer") {
        throw new Error("Only leaders and officers can register the guild for wars");
      }

      // Get guild
      const [guild] = await db.select().from(guilds)
        .where(eq(guilds.id, membership.guildId));
      if (!guild) throw new Error("Guild not found");

      // Verify faction matches
      if (guild.faction !== war.factionA && guild.faction !== war.factionB) {
        throw new Error("Your guild's faction is not participating in this war");
      }

      // Entry fee: 50 Dream per guild level (min 50)
      const entryFee = Math.max(50, guild.level * 50);
      if (guild.treasuryDream < entryFee) {
        throw new Error(`Not enough treasury Dream. Need ${entryFee}, have ${guild.treasuryDream}. Ask members to donate!`);
      }

      // Deduct entry fee
      await db.update(guilds)
        .set({ treasuryDream: guild.treasuryDream - entryFee })
        .where(eq(guilds.id, guild.id));

      // Add entry fee to war prize pool
      await db.update(guildWars)
        .set({ prizePoolDream: war.prizePoolDream + entryFee })
        .where(eq(guildWars.id, input.warId));

      // Notify guild
      const { guildChat } = await import("../../db/schema");
      await db.insert(guildChat).values({
        guildId: guild.id,
        userId: ctx.user.id,
        userName: "SYSTEM",
        message: `Guild registered for war "${war.name}"! Entry fee: ${entryFee} Dream (added to prize pool).`,
        messageType: "system",
      });

      return {
        success: true,
        entryFee,
        newPrizePool: war.prizePoolDream + entryFee,
        // F.3.6 — every guild registration is a placement-lock event.
        cutscene: warEventCutscene("alliance_war_placement_lock"),
      };
    }),

  /** Get the war leaderboard — top contributing guilds across all wars */
  warLeaderboard: protectedProcedure.query(async () => {
    const db = (await getDb())!;
    const leaderboard = await db.select({
      guildId: guildWarContributions.guildId,
      totalPoints: sql<number>`SUM(${guildWarContributions.points})`,
      warCount: sql<number>`COUNT(DISTINCT ${guildWarContributions.warId})`,
    }).from(guildWarContributions)
      .groupBy(guildWarContributions.guildId)
      .orderBy(desc(sql`SUM(${guildWarContributions.points})`))
      .limit(20);
    return leaderboard;
  }),
});
