import { z } from "zod";
import { logger } from "../logger";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { dailyBriefs, pressureEvents, universeEventState, roomStates, notifications } from "../../drizzle/schema";
import { eq, and, sql, gte, desc } from "drizzle-orm";
import {
  ALL_EMERGENT_EVENTS,
  MAX_CONCURRENT_EVENTS,
  EVENT_SYNERGIES,
  getEmergingEvent,
  type PressureTracker,
  DEFAULT_PRESSURE,
} from "@shared/livingUniverseEvents";
import { getEventSignalContent } from "../services/universeConsequences";

/* ═══════════════════════════════════════════════════════
   DAILY BRIEF + LIVING UNIVERSE + ROOM STATE ROUTER

   Three systems in one router:
   1. Daily Brief — 3 events/day per user (gameplay, story, relationship)
   2. Living Universe — community pressure tracking → emergent events
   3. Room States — visual evolution of Ark rooms per user
   ═══════════════════════════════════════════════════════ */

function getTodayStr() { return new Date().toISOString().split("T")[0]; }

/** Day seed: deterministic number from date string */
function daySeedFromDate(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash + dateStr.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/* ─── SERVER-SIDE BRIEF GENERATION ─── */
/* Mirrors client livingArk.ts logic so server doesn't import client code */

interface BriefEvent {
  id: string;
  roomId: string;
  type: string;
  title: string;
  description: string;
  npcId?: string;
  song?: string;
}

const ROOM_IDS = ["cryo_bay", "medical_bay", "bridge", "archives", "comms_array", "observation_deck", "armory", "engineering", "trade_hub", "cargo_bay", "trophy_room", "captains_quarters"] as const;
const ROOM_NAMES: Record<string, string> = {
  cryo_bay: "Cryo Bay", medical_bay: "Medical Bay", bridge: "Bridge", archives: "Archives",
  comms_array: "Comms Array", observation_deck: "Observation Deck", armory: "Armory",
  engineering: "Engineering Bay", trade_hub: "Trade Hub", cargo_bay: "Cargo Bay",
  trophy_room: "Trophy Room", captains_quarters: "Captain's Quarters",
};
const ROOM_NPCS: Record<string, string> = {
  medical_bay: "the_source", bridge: "elara", archives: "the_antiquarian",
  comms_array: "the_human", armory: "agent_zero", engineering: "shadow_tongue",
  trade_hub: "adjudicator_locke",
};
const ROOM_SONGS: Record<string, string> = {
  cryo_bay: "Seeds of Inception", medical_bay: "The Prisoner", bridge: "Building the Architect",
  archives: "The Book of Daniel 2.0", comms_array: "To Be the Human",
  observation_deck: "The Queen of Truth", armory: "It Ain't Illegal",
  engineering: "Virtual Reality", trade_hub: "Governance Hub",
};

const GAMEPLAY_POOL: BriefEvent[] = [
  { id: "boss", roomId: "armory", type: "boss_challenge", title: "Challenge available", description: "New opponent in the combat simulator." },
  { id: "draft", roomId: "cargo_bay", type: "draft_open", title: "Draft open", description: "Build from random cards." },
  { id: "trade", roomId: "trade_hub", type: "trade_opportunity", title: "Market shift", description: "Locke has a proposition.", npcId: "adjudicator_locke" },
  { id: "research", roomId: "engineering", type: "research_complete", title: "Research ready", description: "Blueprint synthesized." },
  { id: "recruit", roomId: "cryo_bay", type: "army_recruit", title: "Recruitment opportunity", description: "New operative available for recruitment." },
  { id: "crew_clone", roomId: "cryo_bay", type: "crew_cloning", title: "Incubator ready", description: "A cloning pod has completed its cycle." },
];

const STORY_POOL: BriefEvent[] = [
  { id: "signal_comms", roomId: "comms_array", type: "signal_fragment", title: "Signal in Comms Array", description: "Encrypted fragment.", npcId: "the_human" },
  { id: "signal_bridge", roomId: "bridge", type: "signal_fragment", title: "Signal on Bridge", description: "Encrypted fragment.", npcId: "the_human" },
  { id: "signal_archives", roomId: "archives", type: "signal_fragment", title: "Signal in Archives", description: "Encrypted fragment.", npcId: "the_human" },
  { id: "anomaly_archives", roomId: "archives", type: "system_anomaly", title: "Corruption in Archives", description: "Records being rewritten.", npcId: "shadow_tongue" },
  { id: "anomaly_bridge", roomId: "bridge", type: "system_anomaly", title: "Corruption on Bridge", description: "Records being rewritten.", npcId: "shadow_tongue" },
  { id: "lore_comms", roomId: "comms_array", type: "lore_discovery", title: "New data fragment", description: "Encrypted transmission decoded." },
  ...ROOM_IDS.filter(r => ROOM_SONGS[r]).map(r => ({
    id: `music_${r}`, roomId: r, type: "music_transmission",
    title: `"${ROOM_SONGS[r]}" intercepted`, description: "Transmission from the Two Witnesses.", song: ROOM_SONGS[r],
  })),
];

const RELATIONSHIP_POOL: BriefEvent[] = [
  ...Object.entries(ROOM_NPCS).map(([roomId, npcId]) => ({
    id: `npc_${roomId}`, roomId, type: "npc_conversation",
    title: `${npcId.replace(/_/g, " ")} wants to speak`, description: `Dialog in ${ROOM_NAMES[roomId]}.`, npcId,
  })),
  { id: "stargaze", roomId: "observation_deck", type: "stargazing", title: "Elara is at the viewport", description: "She seems reflective.", npcId: "elara", song: "The Enigma's Lament" },
  { id: "diag", roomId: "medical_bay", type: "diagnostic_scan", title: "Diagnostic available", description: "Elara wants to run your scan.", npcId: "elara" },
  { id: "pod", roomId: "cryo_bay", type: "pod_activity", title: "Pod anomaly", description: "Cryo pod showed activity." },
];

function seededPick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

function generateServerBrief(seed: number): { gameplay: BriefEvent; story: BriefEvent; relationship: BriefEvent } {
  return {
    gameplay: seededPick(GAMEPLAY_POOL, seed),
    story: seededPick(STORY_POOL, seed * 7 + 3),
    relationship: seededPick(RELATIONSHIP_POOL, seed * 13 + 7),
  };
}

/** Pressure type whitelist */
const PRESSURE_TYPES = [
  "deaths", "trustGains", "viralExposures", "loreDiscoveries", "betrayals",
  "moralityHumanity", "moralityMachine", "truthRevealed", "healingDone", "exploration",
] as const;

/** Cross-room event chains: when an event fires in one room, related rooms also get alerts */
const CROSS_ROOM_CHAINS: Record<string, { triggerRoom: string; alertRooms: string[]; alertType: string; description: string }[]> = {
  quarantine: [
    { triggerRoom: "medical_bay", alertRooms: ["engineering", "cryo_bay"], alertType: "containment_protocol", description: "Medical Bay quarantine triggered containment protocols" },
    { triggerRoom: "engineering", alertRooms: ["medical_bay", "bridge"], alertType: "system_lockdown", description: "Engineering contamination spreading through ventilation" },
  ],
  signal_fragment: [
    { triggerRoom: "comms_array", alertRooms: ["bridge"], alertType: "conspiracy_update", description: "New signal data updating Bridge conspiracy board" },
    { triggerRoom: "bridge", alertRooms: ["comms_array", "archives"], alertType: "signal_trace", description: "Bridge decoded partial coordinates from signal" },
  ],
  system_anomaly: [
    { triggerRoom: "archives", alertRooms: ["bridge", "engineering"], alertType: "data_corruption", description: "Archive corruption spreading to connected systems" },
    { triggerRoom: "bridge", alertRooms: ["archives", "comms_array"], alertType: "log_tampering", description: "Ship logs being rewritten in real-time" },
  ],
  tome_discovered: [
    { triggerRoom: "archives", alertRooms: ["captains_quarters", "observation_deck"], alertType: "lore_resonance", description: "Tome resonates with records in other rooms" },
  ],
};

/** Room visual evolution thresholds */
const VISUAL_TIER_THRESHOLDS = {
  engineering: { craftCount: [5, 20, 50] },   // craft 5/20/50 items → tier 1/2/3
  armory: { quarantineCount: [3, 10, 25] },   // survive 3/10/25 quarantines → tier 1/2/3
  bridge: { briefsCompleted: [7, 30, 100] },  // complete 7/30/100 daily briefs → tier 1/2/3
  archives: { tomeCount: [3, 8, 15] },        // find 3/8/15 tomes → tier 1/2/3
};

export const dailyBriefRouter = router({
  /* ═══════════════════════════════════════════════════════
     1. DAILY BRIEF ENDPOINTS
     ═══════════════════════════════════════════════════════ */

  /** Get today's daily brief (creates if not exists) */
  getToday: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    const today = getTodayStr();
    const existing = await db.select().from(dailyBriefs)
      .where(and(eq(dailyBriefs.userId, ctx.user.id), eq(dailyBriefs.briefDate, today)))
      .limit(1);

    if (existing[0]) {
      return existing[0];
    }

    // Generate new brief using seeded randomness (server-side generation)
    const seed = daySeedFromDate(today) + ctx.user.id;
    const events = generateServerBrief(seed);

    await db.insert(dailyBriefs).values({
      userId: ctx.user.id,
      briefDate: today,
      events,
      completedEvents: [],
    });

    const created = await db.select().from(dailyBriefs)
      .where(and(eq(dailyBriefs.userId, ctx.user.id), eq(dailyBriefs.briefDate, today)))
      .limit(1);

    return created[0] ?? null;
  }),

  /** Mark a daily brief event as completed and get cross-room chain alerts */
  completeEvent: protectedProcedure
    .input(z.object({
      eventId: z.string(),
      eventType: z.string(),
      roomId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      const today = getTodayStr();
      const brief = await db.select().from(dailyBriefs)
        .where(and(eq(dailyBriefs.userId, ctx.user.id), eq(dailyBriefs.briefDate, today)))
        .limit(1);

      if (!brief[0]) return { success: false, error: "No brief for today" };

      const completed = brief[0].completedEvents ?? [];
      if (completed.includes(input.eventId)) {
        return { success: true, alreadyCompleted: true, crossRoomAlerts: [] };
      }

      // Mark event completed
      const updatedCompleted = [...completed, input.eventId];
      await db.update(dailyBriefs)
        .set({ completedEvents: updatedCompleted })
        .where(eq(dailyBriefs.id, brief[0].id));

      // Check for cross-room event chains
      const chains = CROSS_ROOM_CHAINS[input.eventType] ?? [];
      const alerts = chains
        .filter(c => c.triggerRoom === input.roomId)
        .map(c => ({
          alertRooms: c.alertRooms,
          alertType: c.alertType,
          description: c.description,
        }));

      // Update room state based on event
      await updateRoomStateFromEvent(db, ctx.user.id, input.roomId, input.eventType);

      // Record pressure events based on event type
      await recordPressureFromEvent(db, ctx.user.id, input.eventType, input.roomId);

      // Notify if all 3 events completed
      if (updatedCompleted.length >= 3) {
        await db.insert(notifications).values({
          userId: ctx.user.id,
          type: "daily_brief_complete",
          title: "Daily Brief Complete",
          message: "All three Ark events addressed. The ship is stable... for now.",
        });
      }

      return { success: true, crossRoomAlerts: alerts };
    }),

  /** Get brief history for past N days */
  getHistory: protectedProcedure
    .input(z.object({ days: z.number().min(1).max(30).default(7) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - input.days);
      const cutoffStr = cutoff.toISOString().split("T")[0];

      return db.select().from(dailyBriefs)
        .where(and(
          eq(dailyBriefs.userId, ctx.user.id),
          gte(dailyBriefs.briefDate, cutoffStr),
        ))
        .orderBy(desc(dailyBriefs.briefDate));
    }),

  /* ═══════════════════════════════════════════════════════
     2. LIVING UNIVERSE ENDPOINTS
     ═══════════════════════════════════════════════════════ */

  /** Record a pressure event (called by game systems when players die, betray, heal, etc.) */
  recordPressure: protectedProcedure
    .input(z.object({
      pressureType: z.enum(PRESSURE_TYPES),
      amount: z.number().min(1).max(1000).default(1),
      source: z.string().max(128),
      metadata: z.record(z.string(), z.unknown()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      await db.insert(pressureEvents).values({
        userId: ctx.user.id,
        pressureType: input.pressureType,
        amount: input.amount,
        source: input.source,
        metadata: input.metadata,
      });

      // After recording, check if any event should emerge
      const emerging = await checkEmergingEvents(db);

      return { success: true, emerging };
    }),

  /** Get current community pressure levels and active/emerging events */
  getUniverseState: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { pressure: DEFAULT_PRESSURE, activeEvents: [], emergingEvent: null, synergies: [] };

    // Aggregate pressure from last 30 days (rolling window)
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);

    const aggregated = await db.select({
      pressureType: pressureEvents.pressureType,
      total: sql<number>`SUM(${pressureEvents.amount})`.as("total"),
    }).from(pressureEvents)
      .where(gte(pressureEvents.createdAt, cutoff))
      .groupBy(pressureEvents.pressureType);

    // Build pressure tracker from aggregated data
    const pressure: PressureTracker = { ...DEFAULT_PRESSURE };
    for (const row of aggregated) {
      if (row.pressureType in pressure) {
        (pressure as Record<string, number>)[row.pressureType] = Number(row.total) || 0;
      }
    }

    // Get active universe events
    const activeEvents = await db.select().from(universeEventState)
      .where(eq(universeEventState.isActive, 1));

    // Check what's emerging
    const emergingEvent = getEmergingEvent(pressure);

    // Check active synergies
    const activeEventIds = activeEvents.map(e => e.eventId);
    const activeSynergies = EVENT_SYNERGIES.filter(s =>
      s.events.every(eId => activeEventIds.includes(eId))
    );

    const signalContent = getEventSignalContent(activeEventIds);

    return {
      pressure,
      activeEvents: activeEvents.map(e => ({
        eventId: e.eventId,
        pressureScore: e.pressureScore,
        activatedAt: e.activatedAt,
        occurrenceCount: e.occurrenceCount,
        event: ALL_EMERGENT_EVENTS.find(ae => ae.id === e.eventId),
      })),
      emergingEvent,
      synergies: activeSynergies,
      signalContent,
    };
  }),

  /** Get event detail with NPC reactions */
  getEventDetail: publicProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input }) => {
      const event = ALL_EMERGENT_EVENTS.find(e => e.id === input.eventId);
      if (!event) return null;

      const db = await getDb();
      const state = db
        ? await db.select().from(universeEventState)
            .where(eq(universeEventState.eventId, input.eventId))
            .limit(1)
        : [];

      return {
        event,
        state: state[0] ?? null,
        synergies: EVENT_SYNERGIES.filter(s => s.events.includes(input.eventId)),
      };
    }),

  /* ═══════════════════════════════════════════════════════
     3. ROOM STATE ENDPOINTS
     ═══════════════════════════════════════════════════════ */

  /** Get all room states for the current user */
  getRoomStates: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    return db.select().from(roomStates)
      .where(eq(roomStates.userId, ctx.user.id));
  }),

  /** Get a single room's state */
  getRoomState: protectedProcedure
    .input(z.object({ roomId: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;

      const rows = await db.select().from(roomStates)
        .where(and(
          eq(roomStates.userId, ctx.user.id),
          eq(roomStates.roomId, input.roomId),
        ))
        .limit(1);

      return rows[0] ?? null;
    }),

  /** Assign crew member to a room (post Crew Awakening) */
  assignCrew: protectedProcedure
    .input(z.object({
      roomId: z.string(),
      crewMemberId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      const state = await ensureRoomState(db, ctx.user.id, input.roomId);
      const current = state.crewAssigned ?? [];

      if (current.includes(input.crewMemberId)) {
        return { success: true, alreadyAssigned: true };
      }

      // Max 3 crew per room
      if (current.length >= 3) {
        return { success: false, error: "Room crew capacity reached (max 3)" };
      }

      // Remove from any other room first
      const allRoomStates = await db.select().from(roomStates)
        .where(eq(roomStates.userId, ctx.user.id));

      for (const rs of allRoomStates) {
        const crew = rs.crewAssigned ?? [];
        if (crew.includes(input.crewMemberId)) {
          await db.update(roomStates)
            .set({ crewAssigned: crew.filter(c => c !== input.crewMemberId) })
            .where(eq(roomStates.id, rs.id));
        }
      }

      // Assign to target room
      await db.update(roomStates)
        .set({ crewAssigned: [...current, input.crewMemberId] })
        .where(eq(roomStates.id, state.id));

      return { success: true };
    }),

  /** Add decoration to a room */
  addDecoration: protectedProcedure
    .input(z.object({
      roomId: z.string(),
      decorationId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      const state = await ensureRoomState(db, ctx.user.id, input.roomId);
      const current = state.decorations ?? [];

      if (current.includes(input.decorationId)) {
        return { success: true, alreadyPlaced: true };
      }

      await db.update(roomStates)
        .set({ decorations: [...current, input.decorationId] })
        .where(eq(roomStates.id, state.id));

      return { success: true };
    }),
});

/* ═══════════════════════════════════════════════════════
   HELPER FUNCTIONS
   ═══════════════════════════════════════════════════════ */

type Db = NonNullable<Awaited<ReturnType<typeof getDb>>>;

/** Ensure a room state row exists, creating default if needed */
async function ensureRoomState(db: Db, userId: number, roomId: string) {
  const existing = await db.select().from(roomStates)
    .where(and(eq(roomStates.userId, userId), eq(roomStates.roomId, roomId)))
    .limit(1);

  if (existing[0]) return existing[0];

  await db.insert(roomStates).values({ userId, roomId });

  const created = await db.select().from(roomStates)
    .where(and(eq(roomStates.userId, userId), eq(roomStates.roomId, roomId)))
    .limit(1);

  return created[0]!;
}

/** Update room state when an event is completed */
async function updateRoomStateFromEvent(db: Db, userId: number, roomId: string, eventType: string) {
  const state = await ensureRoomState(db, userId, roomId);

  const updates: Partial<typeof roomStates.$inferInsert> = {};

  if (eventType === "quarantine") {
    updates.quarantineCount = state.quarantineCount + 1;
    // Quarantines increase damage to armory
    if (roomId === "armory") {
      updates.damageLevel = Math.min(3, state.damageLevel + 1);
    }
  }

  if (eventType === "research_complete" && roomId === "engineering") {
    updates.craftCount = state.craftCount + 1;
  }

  // Check visual tier upgrades
  const thresholds = VISUAL_TIER_THRESHOLDS[roomId as keyof typeof VISUAL_TIER_THRESHOLDS];
  if (thresholds) {
    const key = Object.keys(thresholds)[0] as string;
    const tiers = (thresholds as Record<string, number[]>)[key];
    const value = (state as Record<string, unknown>)[key];
    if (typeof value === "number" && tiers) {
      const newTier = tiers.filter(t => value + 1 >= t).length;
      if (newTier > state.visualTier) {
        updates.visualTier = newTier;
      }
    }
  }

  if (Object.keys(updates).length > 0) {
    await db.update(roomStates).set(updates).where(eq(roomStates.id, state.id));
  }
}

/** Record pressure events based on daily brief event completion */
async function recordPressureFromEvent(db: Db, userId: number, eventType: string, roomId: string) {
  const pressureMap: Record<string, { type: string; amount: number }> = {
    signal_fragment: { type: "exploration", amount: 5 },
    lore_discovery: { type: "loreDiscoveries", amount: 3 },
    tome_discovered: { type: "loreDiscoveries", amount: 10 },
    quarantine: { type: "viralExposures", amount: 5 },
    npc_conversation: { type: "trustGains", amount: 3 },
    stargazing: { type: "trustGains", amount: 5 },
    diagnostic_scan: { type: "healingDone", amount: 3 },
    system_anomaly: { type: "betrayals", amount: 2 },
    boss_challenge: { type: "deaths", amount: 1 },
    music_transmission: { type: "exploration", amount: 3 },
  };

  const mapping = pressureMap[eventType];
  if (mapping) {
    await db.insert(pressureEvents).values({
      userId,
      pressureType: mapping.type,
      amount: mapping.amount,
      source: `daily_brief_${eventType}_${roomId}`,
    });
  }
}

/** Check if any emergent event should activate based on community pressure */
async function checkEmergingEvents(db: Db): Promise<{ eventId: string; proximity: number } | null> {
  // Aggregate last 30 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);

  const aggregated = await db.select({
    pressureType: pressureEvents.pressureType,
    total: sql<number>`SUM(${pressureEvents.amount})`.as("total"),
  }).from(pressureEvents)
    .where(gte(pressureEvents.createdAt, cutoff))
    .groupBy(pressureEvents.pressureType);

  const pressure: PressureTracker = { ...DEFAULT_PRESSURE };
  for (const row of aggregated) {
    if (row.pressureType in pressure) {
      (pressure as Record<string, number>)[row.pressureType] = Number(row.total) || 0;
    }
  }

  const emerging = getEmergingEvent(pressure);
  if (!emerging) return null;

  // Check how many events are currently active
  const activeCount = await db.select({ count: sql<number>`COUNT(*)`.as("count") })
    .from(universeEventState)
    .where(eq(universeEventState.isActive, 1));

  const currentActive = Number(activeCount[0]?.count) || 0;

  // If under the limit and threshold met, activate the event
  if (emerging.proximity >= 100 && currentActive < MAX_CONCURRENT_EVENTS) {
    const existing = await db.select().from(universeEventState)
      .where(eq(universeEventState.eventId, emerging.eventId))
      .limit(1);

    if (existing[0]) {
      if (!existing[0].isActive) {
        await db.update(universeEventState)
          .set({
            isActive: 1,
            pressureScore: Math.round(emerging.proximity * 100),
            activatedAt: new Date(),
            occurrenceCount: existing[0].occurrenceCount + 1,
          })
          .where(eq(universeEventState.id, existing[0].id));
      }
    } else {
      await db.insert(universeEventState).values({
        eventId: emerging.eventId,
        isActive: 1,
        pressureScore: Math.round(emerging.proximity * 100),
        activatedAt: new Date(),
        occurrenceCount: 1,
      });
    }

    logger.info(`[LivingUniverse] Event activated: ${emerging.eventId} (pressure: ${emerging.proximity})`);
  }

  return emerging;
}
