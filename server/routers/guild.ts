import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { guilds, guildMembers, guildChat, guildInvites, guildRecruitment, notifications, users } from "../../drizzle/schema";
import { eq, and, desc, sql, like, ne } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

/* ═══ GUILD EMBLEMS ═══ */
const GUILD_EMBLEMS = [
  "default", "sword", "shield", "crown", "skull", "star", "flame",
  "eye", "serpent", "phoenix", "anchor", "compass", "lightning",
  "moon", "sun", "tree", "wolf", "eagle", "dragon", "raven",
];

/* ═══ GUILD LEVEL THRESHOLDS ═══ */
const LEVEL_XP = [0, 500, 1500, 3500, 7000, 12000, 20000, 35000, 60000, 100000];
function guildLevelFromXp(xp: number): number {
  for (let i = LEVEL_XP.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_XP[i]) return i + 1;
  }
  return 1;
}

export const guildRouter = router({
  /* ─── List all guilds (public browsing) ─── */
  list: publicProcedure
    .input(z.object({
      search: z.string().optional(),
      faction: z.enum(["empire", "insurgency", "neutral", "all"]).optional(),
      recruiting: z.boolean().optional(),
      limit: z.number().min(1).max(50).optional().default(20),
      offset: z.number().min(0).optional().default(0),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { guilds: [], total: 0 };

      let query = db.select().from(guilds).$dynamic();
      const conditions = [];

      if (input?.search) {
        conditions.push(like(guilds.name, `%${input.search}%`));
      }
      if (input?.faction && input.faction !== "all") {
        conditions.push(eq(guilds.faction, input.faction));
      }
      if (input?.recruiting) {
        conditions.push(eq(guilds.isRecruiting, true));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      const items = await query
        .orderBy(desc(guilds.totalWarPoints))
        .limit(input?.limit ?? 20)
        .offset(input?.offset ?? 0);

      const countResult = await db.select({ count: sql<number>`count(*)` }).from(guilds);

      return {
        guilds: items,
        total: Number(countResult[0]?.count ?? 0),
      };
    }),

  /* ─── Get guild details ─── */
  get: publicProcedure
    .input(z.object({ guildId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "NOT_FOUND" });

      const guild = await db.select().from(guilds)
        .where(eq(guilds.id, input.guildId)).limit(1);
      if (!guild[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Syndicate not found" });

      const members = await db.select({
        id: guildMembers.id,
        userId: guildMembers.userId,
        role: guildMembers.role,
        contributionXp: guildMembers.contributionXp,
        donatedDream: guildMembers.donatedDream,
        donatedCredits: guildMembers.donatedCredits,
        warPoints: guildMembers.warPoints,
        joinedAt: guildMembers.joinedAt,
        userName: users.name,
      }).from(guildMembers)
        .innerJoin(users, eq(guildMembers.userId, users.id))
        .where(eq(guildMembers.guildId, input.guildId))
        .orderBy(desc(guildMembers.contributionXp));

      return { ...guild[0], members };
    }),

  /* ─── Get current user's guild ─── */
  myGuild: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    const membership = await db.select().from(guildMembers)
      .where(eq(guildMembers.userId, ctx.user.id)).limit(1);
    if (!membership[0]) return null;

    const guild = await db.select().from(guilds)
      .where(eq(guilds.id, membership[0].guildId)).limit(1);
    if (!guild[0]) return null;

    return { guild: guild[0], membership: membership[0] };
  }),

  /* ─── Create a new guild ─── */
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(3).max(32),
      tag: z.string().min(2).max(5).regex(/^[A-Z0-9]+$/),
      description: z.string().max(500).optional(),
      faction: z.enum(["empire", "insurgency", "neutral"]),
      emblem: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Check user isn't already in a guild
      const existing = await db.select().from(guildMembers)
        .where(eq(guildMembers.userId, ctx.user.id)).limit(1);
      if (existing[0]) throw new TRPCError({ code: "CONFLICT", message: "You are already in a Syndicate" });

      // Check name/tag uniqueness
      const nameCheck = await db.select().from(guilds)
        .where(eq(guilds.name, input.name)).limit(1);
      if (nameCheck[0]) throw new TRPCError({ code: "CONFLICT", message: "Syndicate name already taken" });

      const tagCheck = await db.select().from(guilds)
        .where(eq(guilds.tag, input.tag)).limit(1);
      if (tagCheck[0]) throw new TRPCError({ code: "CONFLICT", message: "Syndicate tag already taken" });

      const [result] = await db.insert(guilds).values({
        name: input.name,
        tag: input.tag,
        description: input.description || null,
        leaderId: ctx.user.id,
        faction: input.faction,
        emblem: input.emblem || "default",
        memberCount: 1,
      });

      const guildId = Number(result.insertId);
      if (!guildId || isNaN(guildId)) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create Syndicate" });

      // Add creator as leader
      await db.insert(guildMembers).values({
        guildId,
        userId: ctx.user.id,
        role: "leader",
      });

      return { guildId, name: input.name };
    }),

  /* ─── Join a guild ─── */
  join: protectedProcedure
    .input(z.object({ guildId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Check not already in a guild
      const existing = await db.select().from(guildMembers)
        .where(eq(guildMembers.userId, ctx.user.id)).limit(1);
      if (existing[0]) throw new TRPCError({ code: "CONFLICT", message: "You are already in a Syndicate" });

      const guild = await db.select().from(guilds)
        .where(eq(guilds.id, input.guildId)).limit(1);
      if (!guild[0]) throw new TRPCError({ code: "NOT_FOUND" });
      if (!guild[0].isRecruiting) throw new TRPCError({ code: "FORBIDDEN", message: "Syndicate is not recruiting" });
      if (guild[0].memberCount >= guild[0].maxMembers) throw new TRPCError({ code: "FORBIDDEN", message: "Syndicate is full" });

      await db.insert(guildMembers).values({
        guildId: input.guildId,
        userId: ctx.user.id,
        role: "member",
      });

      await db.update(guilds)
        .set({ memberCount: sql`${guilds.memberCount} + 1` })
        .where(eq(guilds.id, input.guildId));

      // System message in guild chat
      await db.insert(guildChat).values({
        guildId: input.guildId,
        userId: ctx.user.id,
        userName: ctx.user.name || "Unknown",
        message: `${ctx.user.name || "A new operative"} has joined the Syndicate.`,
        messageType: "system",
      });

      // Notify guild leader
      await db.insert(notifications).values({
        userId: guild[0].leaderId,
        type: "guild_message",
        title: "New Syndicate Member",
        message: `${ctx.user.name || "Unknown"} has joined ${guild[0].name}.`,
        actionUrl: "/guild",
      });

      return { success: true };
    }),

  /* ─── Leave guild ─── */
  leave: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const membership = await db.select().from(guildMembers)
      .where(eq(guildMembers.userId, ctx.user.id)).limit(1);
    if (!membership[0]) throw new TRPCError({ code: "NOT_FOUND", message: "You are not in a Syndicate" });

    if (membership[0].role === "leader") {
      // Check if there are other members to transfer leadership
      const otherMembers = await db.select().from(guildMembers)
        .where(and(
          eq(guildMembers.guildId, membership[0].guildId),
          ne(guildMembers.userId, ctx.user.id),
        )).limit(1);

      if (otherMembers[0]) {
        // Transfer leadership to highest contributor
        const topMember = await db.select().from(guildMembers)
          .where(and(
            eq(guildMembers.guildId, membership[0].guildId),
            ne(guildMembers.userId, ctx.user.id),
          ))
          .orderBy(desc(guildMembers.contributionXp))
          .limit(1);

        if (topMember[0]) {
          await db.update(guildMembers)
            .set({ role: "leader" })
            .where(eq(guildMembers.id, topMember[0].id));
          await db.update(guilds)
            .set({ leaderId: topMember[0].userId })
            .where(eq(guilds.id, membership[0].guildId));
        }
      } else {
        // Last member — dissolve guild
        await db.delete(guildChat).where(eq(guildChat.guildId, membership[0].guildId));
        await db.delete(guildInvites).where(eq(guildInvites.guildId, membership[0].guildId));
        await db.delete(guilds).where(eq(guilds.id, membership[0].guildId));
      }
    }

    await db.delete(guildMembers).where(eq(guildMembers.id, membership[0].id));

    await db.update(guilds)
      .set({ memberCount: sql`GREATEST(${guilds.memberCount} - 1, 0)` })
      .where(eq(guilds.id, membership[0].guildId));

    return { success: true };
  }),

  /* ─── Donate to treasury ─── */
  donate: protectedProcedure
    .input(z.object({
      amount: z.number().min(1),
      currency: z.enum(["dream", "credits"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const membership = await db.select().from(guildMembers)
        .where(eq(guildMembers.userId, ctx.user.id)).limit(1);
      if (!membership[0]) throw new TRPCError({ code: "NOT_FOUND", message: "You are not in a Syndicate" });

      // Update guild treasury
      if (input.currency === "dream") {
        await db.update(guilds)
          .set({ treasuryDream: sql`${guilds.treasuryDream} + ${input.amount}` })
          .where(eq(guilds.id, membership[0].guildId));
        await db.update(guildMembers)
          .set({ donatedDream: sql`${guildMembers.donatedDream} + ${input.amount}` })
          .where(eq(guildMembers.id, membership[0].id));
      } else {
        await db.update(guilds)
          .set({ treasuryCredits: sql`${guilds.treasuryCredits} + ${input.amount}` })
          .where(eq(guilds.id, membership[0].guildId));
        await db.update(guildMembers)
          .set({ donatedCredits: sql`${guildMembers.donatedCredits} + ${input.amount}` })
          .where(eq(guildMembers.id, membership[0].id));
      }

      // Add contribution XP
      const xpGain = Math.floor(input.amount * (input.currency === "dream" ? 2 : 0.01));
      await db.update(guildMembers)
        .set({ contributionXp: sql`${guildMembers.contributionXp} + ${xpGain}` })
        .where(eq(guildMembers.id, membership[0].id));
      await db.update(guilds)
        .set({ xp: sql`${guilds.xp} + ${xpGain}` })
        .where(eq(guilds.id, membership[0].guildId));

      // Check guild level up
      const guild = await db.select().from(guilds)
        .where(eq(guilds.id, membership[0].guildId)).limit(1);
      if (guild[0]) {
        const newLevel = guildLevelFromXp(guild[0].xp);
        if (newLevel > guild[0].level) {
          await db.update(guilds)
            .set({ level: newLevel })
            .where(eq(guilds.id, membership[0].guildId));

          await db.insert(guildChat).values({
            guildId: membership[0].guildId,
            userId: ctx.user.id,
            userName: "SYSTEM",
            message: `Syndicate leveled up to Level ${newLevel}!`,
            messageType: "system",
          });
        }
      }

      await db.insert(guildChat).values({
        guildId: membership[0].guildId,
        userId: ctx.user.id,
        userName: ctx.user.name || "Unknown",
        message: `Donated ${input.amount.toLocaleString()} ${input.currency} to the treasury.`,
        messageType: "system",
      });

      // Award civil skill XP for guild donation (negotiation + diplomacy)
      const { awardCivilXp } = await import("../civilSkillHelper");
      awardCivilXp(ctx.user.id, "guild_donation").catch(() => {});

      return { success: true, xpGain };
    }),

  /* ─── Guild chat — get messages ─── */
  getChat: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(100).optional().default(50) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      const membership = await db.select().from(guildMembers)
        .where(eq(guildMembers.userId, ctx.user.id)).limit(1);
      if (!membership[0]) return [];

      return db.select().from(guildChat)
        .where(eq(guildChat.guildId, membership[0].guildId))
        .orderBy(desc(guildChat.createdAt))
        .limit(input.limit);
    }),

  /* ─── Guild chat — send message ─── */
  sendMessage: protectedProcedure
    .input(z.object({ message: z.string().min(1).max(500) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const membership = await db.select().from(guildMembers)
        .where(eq(guildMembers.userId, ctx.user.id)).limit(1);
      if (!membership[0]) throw new TRPCError({ code: "FORBIDDEN", message: "Not in a Syndicate" });

      await db.insert(guildChat).values({
        guildId: membership[0].guildId,
        userId: ctx.user.id,
        userName: ctx.user.name || "Unknown",
        message: input.message,
        messageType: "chat",
      });

      return { success: true };
    }),

  /* ─── Invite a player ─── */
  invite: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const membership = await db.select().from(guildMembers)
        .where(eq(guildMembers.userId, ctx.user.id)).limit(1);
      if (!membership[0]) throw new TRPCError({ code: "FORBIDDEN" });
      if (membership[0].role === "member") throw new TRPCError({ code: "FORBIDDEN", message: "Only officers and leaders can invite" });

      // Check target isn't already in a guild
      const targetMembership = await db.select().from(guildMembers)
        .where(eq(guildMembers.userId, input.userId)).limit(1);
      if (targetMembership[0]) throw new TRPCError({ code: "CONFLICT", message: "Player is already in a Syndicate" });

      // Check for existing pending invite
      const existingInvite = await db.select().from(guildInvites)
        .where(and(
          eq(guildInvites.guildId, membership[0].guildId),
          eq(guildInvites.invitedUserId, input.userId),
          eq(guildInvites.status, "pending"),
        )).limit(1);
      if (existingInvite[0]) throw new TRPCError({ code: "CONFLICT", message: "Invite already pending" });

      await db.insert(guildInvites).values({
        guildId: membership[0].guildId,
        invitedUserId: input.userId,
        invitedBy: ctx.user.id,
      });

      // Notify the invited user
      const guild = await db.select().from(guilds)
        .where(eq(guilds.id, membership[0].guildId)).limit(1);

      await db.insert(notifications).values({
        userId: input.userId,
        type: "guild_invite",
        title: "Syndicate Invitation",
        message: `You've been invited to join ${guild[0]?.name || "a Syndicate"}.`,
        actionUrl: "/guild",
      });

      return { success: true };
    }),

  /* ─── Respond to invite ─── */
  respondInvite: protectedProcedure
    .input(z.object({
      inviteId: z.number(),
      accept: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const invite = await db.select().from(guildInvites)
        .where(and(
          eq(guildInvites.id, input.inviteId),
          eq(guildInvites.invitedUserId, ctx.user.id),
          eq(guildInvites.status, "pending"),
        )).limit(1);
      if (!invite[0]) throw new TRPCError({ code: "NOT_FOUND" });

      await db.update(guildInvites)
        .set({ status: input.accept ? "accepted" : "declined" })
        .where(eq(guildInvites.id, input.inviteId));

      if (input.accept) {
        // Check not already in a guild
        const existing = await db.select().from(guildMembers)
          .where(eq(guildMembers.userId, ctx.user.id)).limit(1);
        if (existing[0]) throw new TRPCError({ code: "CONFLICT", message: "Already in a Syndicate" });

        await db.insert(guildMembers).values({
          guildId: invite[0].guildId,
          userId: ctx.user.id,
          role: "member",
        });

        await db.update(guilds)
          .set({ memberCount: sql`${guilds.memberCount} + 1` })
          .where(eq(guilds.id, invite[0].guildId));

        await db.insert(guildChat).values({
          guildId: invite[0].guildId,
          userId: ctx.user.id,
          userName: ctx.user.name || "Unknown",
          message: `${ctx.user.name || "A new operative"} has joined the Syndicate.`,
          messageType: "system",
        });
      }

      return { success: true };
    }),

  /* ─── Get pending invites for current user ─── */
  myInvites: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const invites = await db.select({
      id: guildInvites.id,
      guildId: guildInvites.guildId,
      guildName: guilds.name,
      guildTag: guilds.tag,
      guildFaction: guilds.faction,
      invitedBy: guildInvites.invitedBy,
      createdAt: guildInvites.createdAt,
    }).from(guildInvites)
      .innerJoin(guilds, eq(guildInvites.guildId, guilds.id))
      .where(and(
        eq(guildInvites.invitedUserId, ctx.user.id),
        eq(guildInvites.status, "pending"),
      ))
      .orderBy(desc(guildInvites.createdAt));

    return invites;
  }),

  /* ─── Update guild settings (leader/officer only) ─── */
  updateSettings: protectedProcedure
    .input(z.object({
      description: z.string().max(500).optional(),
      motd: z.string().max(300).optional(),
      isRecruiting: z.boolean().optional(),
      minLevelToJoin: z.number().min(1).max(100).optional(),
      emblem: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const membership = await db.select().from(guildMembers)
        .where(eq(guildMembers.userId, ctx.user.id)).limit(1);
      if (!membership[0] || membership[0].role === "member") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only officers and leaders can edit settings" });
      }

      const updates: Record<string, unknown> = {};
      if (input.description !== undefined) updates.description = input.description;
      if (input.motd !== undefined) updates.motd = input.motd;
      if (input.isRecruiting !== undefined) updates.isRecruiting = input.isRecruiting;
      if (input.minLevelToJoin !== undefined) updates.minLevelToJoin = input.minLevelToJoin;
      if (input.emblem !== undefined) updates.emblem = input.emblem;

      if (Object.keys(updates).length > 0) {
        await db.update(guilds)
          .set(updates)
          .where(eq(guilds.id, membership[0].guildId));
      }

      return { success: true };
    }),

  /* ─── Promote/demote member (leader only) ─── */
  setMemberRole: protectedProcedure
    .input(z.object({
      memberId: z.number(),
      role: z.enum(["officer", "member"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const membership = await db.select().from(guildMembers)
        .where(eq(guildMembers.userId, ctx.user.id)).limit(1);
      if (!membership[0] || membership[0].role !== "leader") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only the leader can promote/demote" });
      }

      await db.update(guildMembers)
        .set({ role: input.role })
        .where(and(
          eq(guildMembers.id, input.memberId),
          eq(guildMembers.guildId, membership[0].guildId),
        ));

      return { success: true };
    }),

  /* ─── Kick member (leader/officer) ─── */
  kickMember: protectedProcedure
    .input(z.object({ memberId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const membership = await db.select().from(guildMembers)
        .where(eq(guildMembers.userId, ctx.user.id)).limit(1);
      if (!membership[0] || membership[0].role === "member") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const target = await db.select().from(guildMembers)
        .where(eq(guildMembers.id, input.memberId)).limit(1);
      if (!target[0] || target[0].guildId !== membership[0].guildId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      if (target[0].role === "leader") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot kick the leader" });
      }

      await db.delete(guildMembers).where(eq(guildMembers.id, input.memberId));
      await db.update(guilds)
        .set({ memberCount: sql`GREATEST(${guilds.memberCount} - 1, 0)` })
        .where(eq(guilds.id, membership[0].guildId));

      // Notify kicked user
      await db.insert(notifications).values({
        userId: target[0].userId,
        type: "guild_message",
        title: "Removed from Syndicate",
        message: "You have been removed from your Syndicate.",
      });

      return { success: true };
    }),

  /* ─── Guild leaderboard ─── */
  leaderboard: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(50).optional().default(20) }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      return db.select().from(guilds)
        .orderBy(desc(guilds.totalWarPoints))
        .limit(input?.limit ?? 20);
    }),

  /* ─── Available emblems ─── */
  emblems: publicProcedure.query(() => GUILD_EMBLEMS),

  /* ═══ GUILD RECRUITMENT BOARD ═══ */

  /** Get recruitment posts for browsing */
  getRecruitmentPosts: publicProcedure
    .input(z.object({
      faction: z.enum(["empire", "insurgency", "neutral", "all"]).optional(),
      limit: z.number().min(1).max(50).optional().default(20),
      offset: z.number().min(0).optional().default(0),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { posts: [], total: 0 };
      const posts = await db.select({
        recruitment: guildRecruitment,
        guild: guilds,
      }).from(guildRecruitment)
        .innerJoin(guilds, eq(guildRecruitment.guildId, guilds.id))
        .where(eq(guildRecruitment.status, "open"))
        .orderBy(desc(guildRecruitment.updatedAt))
        .limit(input?.limit ?? 20)
        .offset(input?.offset ?? 0);

      const filtered = posts.filter(p => {
        if (input?.faction && input.faction !== "all" && p.guild.faction !== input.faction) return false;
        return true;
      });

      return {
        posts: filtered.map(p => ({
          id: p.recruitment.id,
          guildId: p.guild.id,
          guildName: p.guild.name,
          guildTag: p.guild.tag,
          guildFaction: p.guild.faction,
          guildLevel: p.guild.level,
          guildEmblem: p.guild.emblem,
          memberCount: p.guild.memberCount,
          maxMembers: p.guild.maxMembers,
          description: p.recruitment.description,
          requirements: p.recruitment.requirements,
          minLevel: p.recruitment.minLevel,
          preferredClasses: p.recruitment.preferredClasses,
          updatedAt: p.recruitment.updatedAt,
        })),
        total: filtered.length,
      };
    }),

  /** Create or update recruitment post (guild leader/officer) */
  setRecruitmentPost: protectedProcedure
    .input(z.object({
      description: z.string().min(10).max(500),
      requirements: z.string().max(300).optional(),
      minLevel: z.number().min(1).max(50).optional().default(1),
      preferredClasses: z.array(z.string()).optional(),
      status: z.enum(["open", "closed"]).optional().default("open"),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [membership] = await db.select().from(guildMembers)
        .where(eq(guildMembers.userId, ctx.user.id));
      if (!membership) throw new TRPCError({ code: "FORBIDDEN", message: "You must be in a Syndicate" });
      if (membership.role !== "leader" && membership.role !== "officer") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only leaders and officers can manage recruitment" });
      }
      const [existing] = await db.select().from(guildRecruitment)
        .where(eq(guildRecruitment.guildId, membership.guildId));
      if (existing) {
        await db.update(guildRecruitment)
          .set({
            description: input.description,
            requirements: input.requirements || null,
            minLevel: input.minLevel,
            preferredClasses: input.preferredClasses || null,
            status: input.status,
          })
          .where(eq(guildRecruitment.id, existing.id));
      } else {
        await db.insert(guildRecruitment).values({
          guildId: membership.guildId,
          description: input.description,
          requirements: input.requirements || "",
          minLevel: input.minLevel,
          preferredClasses: input.preferredClasses || null,
          status: input.status,
        });
      }
      return { success: true };
    }),

  /** Get my guild's recruitment post */
  getMyRecruitmentPost: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const [membership] = await db.select().from(guildMembers)
      .where(eq(guildMembers.userId, ctx.user.id));
    if (!membership) return null;
    const [post] = await db.select().from(guildRecruitment)
      .where(eq(guildRecruitment.guildId, membership.guildId));
    return post || null;
  }),

  /** Delete recruitment post */
  deleteRecruitmentPost: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    const [membership] = await db.select().from(guildMembers)
      .where(eq(guildMembers.userId, ctx.user.id));
    if (!membership) throw new TRPCError({ code: "FORBIDDEN" });
    if (membership.role !== "leader" && membership.role !== "officer") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Only leaders and officers can manage recruitment" });
    }
    await db.delete(guildRecruitment).where(eq(guildRecruitment.guildId, membership.guildId));
    return { deleted: true };
  }),

  /** Spend treasury on guild upgrades */
  spendTreasury: protectedProcedure
    .input(z.object({
      upgradeType: z.enum([
        "member_slots",      // +5 max members per upgrade (costs Dream)
        "xp_boost",          // +10% guild XP for 7 days (costs Dream)
        "war_banner",        // +5% war point bonus for next war (costs Credits)
        "treasury_expansion",// +1000 max treasury capacity per upgrade (costs Credits)
      ]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [membership] = await db.select().from(guildMembers)
        .where(eq(guildMembers.userId, ctx.user.id));
      if (!membership) throw new TRPCError({ code: "NOT_FOUND", message: "You are not in a Syndicate" });
      if (membership.role !== "leader" && membership.role !== "officer") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only leaders and officers can spend treasury" });
      }

      const [guild] = await db.select().from(guilds)
        .where(eq(guilds.id, membership.guildId));
      if (!guild) throw new TRPCError({ code: "NOT_FOUND" });

      // Upgrade costs and effects
      const UPGRADES = {
        member_slots: { cost: { dream: 200 + guild.level * 50 }, effect: "Max members +5" },
        xp_boost: { cost: { dream: 100 }, effect: "Guild XP +10% for 7 days" },
        war_banner: { cost: { credits: 500 + guild.level * 100 }, effect: "War points +5% next war" },
        treasury_expansion: { cost: { credits: 300 }, effect: "Treasury capacity +1000" },
      } as const;

      const upgrade = UPGRADES[input.upgradeType];
      const dreamCost = "dream" in upgrade.cost ? upgrade.cost.dream : 0;
      const creditCost = "credits" in upgrade.cost ? upgrade.cost.credits : 0;

      if (dreamCost > 0 && guild.treasuryDream < dreamCost) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Not enough treasury Dream. Need ${dreamCost}, have ${guild.treasuryDream}`,
        });
      }
      if (creditCost > 0 && guild.treasuryCredits < creditCost) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Not enough treasury Credits. Need ${creditCost}, have ${guild.treasuryCredits}`,
        });
      }

      // Deduct
      await db.update(guilds)
        .set({
          treasuryDream: dreamCost > 0 ? guild.treasuryDream - dreamCost : guild.treasuryDream,
          treasuryCredits: creditCost > 0 ? guild.treasuryCredits - creditCost : guild.treasuryCredits,
        })
        .where(eq(guilds.id, guild.id));

      // Apply upgrade (guild XP as a simple tracking mechanism)
      await db.update(guilds)
        .set({ xp: sql`${guilds.xp} + ${50}` })
        .where(eq(guilds.id, guild.id));

      // Log to guild chat
      await db.insert(guildChat).values({
        guildId: guild.id,
        userId: ctx.user.id,
        userName: "SYSTEM",
        message: `Treasury spent: ${upgrade.effect} (cost: ${dreamCost > 0 ? `${dreamCost} Dream` : `${creditCost} Credits`})`,
        messageType: "system",
      });

      return { success: true, upgrade: input.upgradeType, effect: upgrade.effect, dreamSpent: dreamCost, creditsSpent: creditCost };
    }),
});
