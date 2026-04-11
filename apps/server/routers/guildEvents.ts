/**
 * GUILD EVENTS ROUTER
 * ──────────────────────────────────────────────────
 * Backend for scheduled guild activities: raids, tournaments, roleplay
 * nights, lore sessions, PvP scrims, etc. Leaders/officers create
 * events; members RSVP (going/maybe/declined) and can check in.
 *
 * Endpoints:
 *   listUpcoming   — events for my guild starting in the future (+ live).
 *   listPast       — completed / cancelled events for my guild.
 *   getEvent       — full detail for one event, including attendance.
 *   createEvent    — leader/officer: schedule a new event.
 *   updateEvent    — leader/officer or creator: edit an existing event.
 *   cancelEvent    — leader/officer or creator: mark cancelled.
 *   rsvp           — member: set my RSVP (going/maybe/declined).
 *   checkIn        — member: mark myself as checked-in (only while live).
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { guildEvents, guildEventAttendance, guildMembers, guilds, users } from "../../db/schema";
import { eq, and, gte, lte, desc, asc, inArray, or } from "drizzle-orm";
import {
  validateEventInput, GUILD_EVENT_LIMITS, computeLiveStatus,
  type GuildEventType,
} from "../../shared/guildEvents";

const EVENT_TYPE_VALUES = [
  "raid", "tournament", "pvp_practice", "roleplay", "lore_night",
  "recruitment_drive", "trade_fair", "training", "social", "other",
] as const satisfies readonly GuildEventType[];

function dbUnavailable(): never {
  throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
}

async function getMyMembership(userId: number) {
  const db = await getDb();
  if (!db) dbUnavailable();
  const rows = await db.select().from(guildMembers).where(eq(guildMembers.userId, userId)).limit(1);
  return rows[0] ?? null;
}

function isOfficerOrLeader(role: string | null | undefined): boolean {
  return role === "leader" || role === "officer";
}

/** Fetch attendance + member name map for a set of event ids. */
async function fetchAttendanceByEvent(eventIds: number[]): Promise<Record<number, Array<{
  userId: number;
  userName: string | null;
  rsvpStatus: "going" | "maybe" | "declined";
  checkedInAt: Date | null;
}>>> {
  if (eventIds.length === 0) return {};
  const db = await getDb();
  if (!db) dbUnavailable();
  const rows = await db
    .select({
      eventId: guildEventAttendance.eventId,
      userId: guildEventAttendance.userId,
      userName: users.name,
      rsvpStatus: guildEventAttendance.rsvpStatus,
      checkedInAt: guildEventAttendance.checkedInAt,
    })
    .from(guildEventAttendance)
    .leftJoin(users, eq(users.id, guildEventAttendance.userId))
    .where(inArray(guildEventAttendance.eventId, eventIds));
  const out: Record<number, Array<{ userId: number; userName: string | null; rsvpStatus: "going" | "maybe" | "declined"; checkedInAt: Date | null }>> = {};
  for (const r of rows) {
    (out[r.eventId] ??= []).push({
      userId: r.userId,
      userName: r.userName,
      rsvpStatus: r.rsvpStatus,
      checkedInAt: r.checkedInAt,
    });
  }
  return out;
}

export const guildEventsRouter = router({
  /** Upcoming or currently-live events for my guild. */
  listUpcoming: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) dbUnavailable();
    const membership = await getMyMembership(ctx.user.id);
    if (!membership) return [];

    const now = new Date();
    const events = await db
      .select()
      .from(guildEvents)
      .where(and(
        eq(guildEvents.guildId, membership.guildId),
        gte(guildEvents.endsAt, now),
        or(eq(guildEvents.status, "scheduled"), eq(guildEvents.status, "in_progress")),
      ))
      .orderBy(asc(guildEvents.startsAt));

    const attendance = await fetchAttendanceByEvent(events.map((e) => e.id));
    return events.map((e) => {
      const att = attendance[e.id] ?? [];
      return {
        ...e,
        liveStatus: computeLiveStatus(e.status, e.startsAt, e.endsAt),
        attendance: att,
        goingCount: att.filter((a) => a.rsvpStatus === "going").length,
        maybeCount: att.filter((a) => a.rsvpStatus === "maybe").length,
        myRsvp: att.find((a) => a.userId === ctx.user.id)?.rsvpStatus ?? null,
      };
    });
  }),

  /** Completed / cancelled events for my guild (most recent first, capped). */
  listPast: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(20) }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) dbUnavailable();
      const membership = await getMyMembership(ctx.user.id);
      if (!membership) return [];

      const events = await db
        .select()
        .from(guildEvents)
        .where(and(
          eq(guildEvents.guildId, membership.guildId),
          or(eq(guildEvents.status, "completed"), eq(guildEvents.status, "cancelled")),
        ))
        .orderBy(desc(guildEvents.startsAt))
        .limit(input?.limit ?? 20);

      const attendance = await fetchAttendanceByEvent(events.map((e) => e.id));
      return events.map((e) => ({
        ...e,
        liveStatus: computeLiveStatus(e.status, e.startsAt, e.endsAt),
        attendance: attendance[e.id] ?? [],
        goingCount: (attendance[e.id] ?? []).filter((a) => a.rsvpStatus === "going").length,
      }));
    }),

  /** Full detail for a single event. Caller must be in the same guild. */
  getEvent: protectedProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) dbUnavailable();
      const membership = await getMyMembership(ctx.user.id);
      if (!membership) return null;

      const [event] = await db.select().from(guildEvents).where(eq(guildEvents.id, input.eventId));
      if (!event) return null;
      if (event.guildId !== membership.guildId) return null;

      const attendance = (await fetchAttendanceByEvent([event.id]))[event.id] ?? [];
      return {
        ...event,
        liveStatus: computeLiveStatus(event.status, event.startsAt, event.endsAt),
        attendance,
        goingCount: attendance.filter((a) => a.rsvpStatus === "going").length,
        maybeCount: attendance.filter((a) => a.rsvpStatus === "maybe").length,
        myRsvp: attendance.find((a) => a.userId === ctx.user.id)?.rsvpStatus ?? null,
      };
    }),

  /** Schedule a new event. Leader/officer only. */
  createEvent: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(GUILD_EVENT_LIMITS.titleMaxLen),
      description: z.string().max(GUILD_EVENT_LIMITS.descriptionMaxLen).optional(),
      eventType: z.enum(EVENT_TYPE_VALUES).default("social"),
      startsAt: z.number().int(), // epoch ms
      endsAt: z.number().int(),
      maxAttendees: z.number().int().min(0).max(GUILD_EVENT_LIMITS.maxAttendeesHardCap).default(0),
      locationRoomId: z.string().max(64).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) dbUnavailable();
      const membership = await getMyMembership(ctx.user.id);
      if (!membership) throw new TRPCError({ code: "FORBIDDEN", message: "Not in a guild" });
      if (!isOfficerOrLeader(membership.role)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only leaders or officers can create events" });
      }

      const errors = validateEventInput({
        title: input.title,
        description: input.description,
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        maxAttendees: input.maxAttendees,
      });
      if (errors.length > 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: errors[0].message });
      }

      await db.insert(guildEvents).values({
        guildId: membership.guildId,
        createdBy: ctx.user.id,
        title: input.title.trim(),
        description: input.description ?? null,
        eventType: input.eventType,
        startsAt: new Date(input.startsAt),
        endsAt: new Date(input.endsAt),
        maxAttendees: input.maxAttendees,
        status: "scheduled",
        locationRoomId: input.locationRoomId ?? null,
      });

      // Creators are auto-RSVP'd as "going".
      const [created] = await db
        .select()
        .from(guildEvents)
        .where(and(
          eq(guildEvents.guildId, membership.guildId),
          eq(guildEvents.createdBy, ctx.user.id),
          eq(guildEvents.title, input.title.trim()),
        ))
        .orderBy(desc(guildEvents.id))
        .limit(1);

      if (created) {
        await db.insert(guildEventAttendance).values({
          eventId: created.id,
          userId: ctx.user.id,
          rsvpStatus: "going",
        });
      }

      return { success: true, eventId: created?.id ?? null };
    }),

  /** Edit an existing event. Leader/officer or the original creator. */
  updateEvent: protectedProcedure
    .input(z.object({
      eventId: z.number(),
      title: z.string().min(1).max(GUILD_EVENT_LIMITS.titleMaxLen).optional(),
      description: z.string().max(GUILD_EVENT_LIMITS.descriptionMaxLen).nullable().optional(),
      eventType: z.enum(EVENT_TYPE_VALUES).optional(),
      startsAt: z.number().int().optional(),
      endsAt: z.number().int().optional(),
      maxAttendees: z.number().int().min(0).max(GUILD_EVENT_LIMITS.maxAttendeesHardCap).optional(),
      locationRoomId: z.string().max(64).nullable().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) dbUnavailable();
      const membership = await getMyMembership(ctx.user.id);
      if (!membership) throw new TRPCError({ code: "FORBIDDEN", message: "Not in a guild" });

      const [event] = await db.select().from(guildEvents).where(eq(guildEvents.id, input.eventId));
      if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      if (event.guildId !== membership.guildId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Event belongs to another guild" });
      }
      const canEdit = isOfficerOrLeader(membership.role) || event.createdBy === ctx.user.id;
      if (!canEdit) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only the creator or an officer can edit this event" });
      }

      const nextStarts = input.startsAt ?? event.startsAt.getTime();
      const nextEnds = input.endsAt ?? event.endsAt.getTime();
      const errors = validateEventInput({
        title: input.title ?? event.title,
        description: input.description === undefined ? event.description : input.description,
        startsAt: nextStarts,
        endsAt: nextEnds,
        maxAttendees: input.maxAttendees ?? event.maxAttendees,
      });
      if (errors.length > 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: errors[0].message });
      }

      const patch: Record<string, unknown> = {};
      if (input.title !== undefined) patch.title = input.title.trim();
      if (input.description !== undefined) patch.description = input.description;
      if (input.eventType !== undefined) patch.eventType = input.eventType;
      if (input.startsAt !== undefined) patch.startsAt = new Date(input.startsAt);
      if (input.endsAt !== undefined) patch.endsAt = new Date(input.endsAt);
      if (input.maxAttendees !== undefined) patch.maxAttendees = input.maxAttendees;
      if (input.locationRoomId !== undefined) patch.locationRoomId = input.locationRoomId;

      if (Object.keys(patch).length === 0) return { success: true, noop: true as const };

      await db.update(guildEvents).set(patch).where(eq(guildEvents.id, event.id));
      return { success: true };
    }),

  /** Cancel an event. Leader/officer or creator. */
  cancelEvent: protectedProcedure
    .input(z.object({ eventId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) dbUnavailable();
      const membership = await getMyMembership(ctx.user.id);
      if (!membership) throw new TRPCError({ code: "FORBIDDEN", message: "Not in a guild" });

      const [event] = await db.select().from(guildEvents).where(eq(guildEvents.id, input.eventId));
      if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      if (event.guildId !== membership.guildId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Event belongs to another guild" });
      }
      const canCancel = isOfficerOrLeader(membership.role) || event.createdBy === ctx.user.id;
      if (!canCancel) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only the creator or an officer can cancel" });
      }

      await db.update(guildEvents).set({ status: "cancelled" }).where(eq(guildEvents.id, event.id));
      return { success: true };
    }),

  /** Set or update my RSVP for an event in my guild. */
  rsvp: protectedProcedure
    .input(z.object({
      eventId: z.number(),
      status: z.enum(["going", "maybe", "declined"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) dbUnavailable();
      const membership = await getMyMembership(ctx.user.id);
      if (!membership) throw new TRPCError({ code: "FORBIDDEN", message: "Not in a guild" });

      const [event] = await db.select().from(guildEvents).where(eq(guildEvents.id, input.eventId));
      if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      if (event.guildId !== membership.guildId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Event belongs to another guild" });
      }
      if (event.status === "cancelled") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Event is cancelled" });
      }
      if (event.status === "completed") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Event is already completed" });
      }

      // Enforce capacity for "going" RSVPs.
      if (input.status === "going" && event.maxAttendees > 0) {
        const existing = await db
          .select()
          .from(guildEventAttendance)
          .where(and(
            eq(guildEventAttendance.eventId, event.id),
            eq(guildEventAttendance.rsvpStatus, "going"),
          ));
        const imAlreadyGoing = existing.some((a) => a.userId === ctx.user.id);
        if (!imAlreadyGoing && existing.length >= event.maxAttendees) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Event is full" });
        }
      }

      // Upsert: try update, fall back to insert.
      const [existingRsvp] = await db
        .select()
        .from(guildEventAttendance)
        .where(and(
          eq(guildEventAttendance.eventId, event.id),
          eq(guildEventAttendance.userId, ctx.user.id),
        ))
        .limit(1);

      if (existingRsvp) {
        await db
          .update(guildEventAttendance)
          .set({ rsvpStatus: input.status, rsvpAt: new Date() })
          .where(eq(guildEventAttendance.id, existingRsvp.id));
      } else {
        await db.insert(guildEventAttendance).values({
          eventId: event.id,
          userId: ctx.user.id,
          rsvpStatus: input.status,
        });
      }

      return { success: true, status: input.status };
    }),

  /** Check in to an event that is currently live. */
  checkIn: protectedProcedure
    .input(z.object({ eventId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) dbUnavailable();
      const membership = await getMyMembership(ctx.user.id);
      if (!membership) throw new TRPCError({ code: "FORBIDDEN", message: "Not in a guild" });

      const [event] = await db.select().from(guildEvents).where(eq(guildEvents.id, input.eventId));
      if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      if (event.guildId !== membership.guildId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Event belongs to another guild" });
      }

      const live = computeLiveStatus(event.status, event.startsAt, event.endsAt);
      if (live !== "in_progress") {
        throw new TRPCError({ code: "BAD_REQUEST", message: `Can only check in while the event is live (status: ${live})` });
      }

      const [existingRsvp] = await db
        .select()
        .from(guildEventAttendance)
        .where(and(
          eq(guildEventAttendance.eventId, event.id),
          eq(guildEventAttendance.userId, ctx.user.id),
        ))
        .limit(1);

      if (existingRsvp) {
        await db
          .update(guildEventAttendance)
          .set({ checkedInAt: new Date(), rsvpStatus: "going" })
          .where(eq(guildEventAttendance.id, existingRsvp.id));
      } else {
        await db.insert(guildEventAttendance).values({
          eventId: event.id,
          userId: ctx.user.id,
          rsvpStatus: "going",
          checkedInAt: new Date(),
        });
      }
      return { success: true };
    }),
});
