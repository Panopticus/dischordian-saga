/**
 * PERSONAL QUARTERS ROUTER
 * ──────────────────────────────────────────────────
 * The consolidated player housing backend. Merges the old Personal Quarters
 * system (server-persisted, RPG-gated, multi-zone) with the visual slot maps,
 * lighting presets, music box, and companion visits from the legacy Player
 * Cabin system.
 *
 * Endpoints:
 *   getMyQuarters     — fetch quarters + available items + slot maps
 *                       + available lighting presets + music tracks
 *                       + companion visits based on current RPG state.
 *   placeItem         — place an item at (x,y) or pinned to a slotId.
 *   removeItem        — remove an item (by itemKey + zone, or slotId).
 *   unlockZone        — unlock a new room zone.
 *   setLighting       — change the active lighting preset.
 *   setMusicTrack     — change the active music box track.
 *   visitQuarters     — visit another player's quarters (logs visit).
 *   getRecentVisitors — list recent visitors to my quarters.
 *   rename            — rename my quarters.
 */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  playerQuarters, quarterVisits,
  citizenCharacters, civilSkillProgress, classMastery,
  prestigeProgress, bossMastery, eventParticipation,
  seasonalEvents, userAchievements, characterSheets,
  userProgress,
} from "../../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  DECORATION_ITEMS, ROOM_ZONES,
  LIGHTING_PRESETS, MUSIC_TRACKS, ZONE_SLOT_MAPS,
  getAvailableDecorations, calculateQuarterBonuses,
  getAvailableLightingPresets, getAvailableMusicTracks,
  getVisitingCompanions, getSlot, isItemAllowedInSlot,
  type PlacedQuartersItem,
} from "../../shared/personalQuarters";

export const personalQuartersRouter = router({
  /** Get or create my quarters */
  getMyQuarters: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");
    let [quarters] = await db.select().from(playerQuarters).where(eq(playerQuarters.userId, ctx.user.id));
    if (!quarters) {
      await db.insert(playerQuarters).values({
        userId: ctx.user.id,
        name: "My Quarters",
      });
      [quarters] = await db.select().from(playerQuarters).where(eq(playerQuarters.userId, ctx.user.id));
    }

    // Get RPG bonuses
    const [char] = await db.select().from(citizenCharacters).where(eq(citizenCharacters.userId, ctx.user.id));
    const civilSkills = await db.select().from(civilSkillProgress).where(eq(civilSkillProgress.userId, ctx.user.id));
    const skillMap: Record<string, number> = {};
    for (const s of civilSkills) skillMap[s.skillKey] = s.level;
    const classRows = await db.select().from(classMastery).where(eq(classMastery.userId, ctx.user.id));
    const classMap: Record<string, number> = {};
    for (const c of classRows) classMap[c.characterClass] = c.masteryRank;
    const prestRows = await db.select().from(prestigeProgress).where(eq(prestigeProgress.userId, ctx.user.id));

    // Get boss kill counts
    const bossRows = await db.select().from(bossMastery).where(eq(bossMastery.userId, ctx.user.id));
    const bossKills: Record<string, number> = {};
    for (const b of bossRows) bossKills[b.bossKey] = b.kills;

    // Get seasonal event participation
    const eventParts = await db.select({
      eventKey: seasonalEvents.eventKey,
    }).from(eventParticipation)
      .innerJoin(seasonalEvents, eq(eventParticipation.eventId, seasonalEvents.id))
      .where(eq(eventParticipation.userId, ctx.user.id));
    const seasonalEventsParticipated = Array.from(new Set(eventParts.map(e => e.eventKey)));

    // Get achievements
    const achievementRows = await db.select().from(userAchievements).where(eq(userAchievements.userId, ctx.user.id));
    const achievements = achievementRows.map(a => a.achievementId);

    // Get morality score and level
    const [sheet] = await db.select().from(characterSheets).where(eq(characterSheets.userId, ctx.user.id));
    const moralityScore = sheet?.moralityScore ?? 0;
    const citizenLevel = char?.level ?? 1;

    // Pull narrative progress (companion trust etc.) from userProgress.progressData.
    // These keys come from the legacy Cabin unlock rules and drive lighting/music/
    // companion-visit availability.
    const [progress] = await db.select().from(userProgress)
      .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")));
    const progressData = (progress?.progressData ?? {}) as Record<string, unknown>;
    const gameData = (progress?.gameData ?? {}) as Record<string, unknown>;
    const elaraTrust = (progressData.elaraTrust as number) ?? 0;
    const humanTrust = (progressData.humanTrust as number) ?? 0;
    const npcTrust = (progressData.npcTrust as Record<string, number>) ?? {};
    const completedQuests = (progressData.completedQuests as string[]) ?? [];
    const discoveredRooms = Object.keys((progressData.rooms as Record<string, unknown>) ?? {}).length;
    const totalRooms = (gameData.totalRoomCount as number) ?? 20;
    const thoughtsInternalized = ((progressData.thoughtInternalized as string[]) ?? []).length;
    const guildWarsWon = (gameData.guildWarsWon as number) ?? 0;

    // Get available decorations based on full RPG state
    const allAvailable = getAvailableDecorations({
      characterClass: char?.characterClass,
      species: char?.species,
      civilSkills: skillMap,
      prestigeClass: prestRows[0]?.prestigeClassKey,
      achievements,
      moralityScore,
      citizenLevel,
      bossKills,
      seasonalEventsParticipated,
    });

    // Unlocked lighting, music, and visiting companions derived from narrative state.
    const availableLighting = getAvailableLightingPresets({
      elaraTrust, humanTrust, npcTrust, completedQuests, discoveredRooms, totalRooms,
    });
    const availableMusic = getAvailableMusicTracks({
      elaraTrust, humanTrust, npcTrust, moralityScore, guildWarsWon, thoughtsInternalized,
    });
    const visitingCompanions = getVisitingCompanions({ elaraTrust, humanTrust, npcTrust });

    // Calculate bonuses from placed items
    const placedItemDefs = (quarters.placedItems || []).map(
      (pi: { itemKey: string }) => DECORATION_ITEMS.find(d => d.key === pi.itemKey)
    ).filter(Boolean);
    const bonuses = calculateQuarterBonuses(placedItemDefs as any);

    return {
      quarters,
      bonuses,
      availableItems: allAvailable,
      zones: ROOM_ZONES,
      slotMaps: ZONE_SLOT_MAPS,
      lighting: {
        active: quarters.lightingPreset,
        available: availableLighting,
        all: LIGHTING_PRESETS,
      },
      music: {
        active: quarters.musicTrack,
        available: availableMusic,
        all: MUSIC_TRACKS,
      },
      visitingCompanions,
      stats: {
        totalItems: DECORATION_ITEMS.length,
        unlockedItems: allAvailable.length,
        placedItems: (quarters.placedItems || []).length,
        bossKills,
        seasonalEventsParticipated,
        achievementCount: achievements.length,
      },
    };
  }),

  /**
   * Place an item. If `slotId` is supplied, the item is pinned to that
   * visual hotspot in the zone's slot map (see ZONE_SLOT_MAPS). The server
   * validates that the slot exists, that the zone owns it, and that the
   * item's category is compatible with the slot's accepts[] list. The
   * pre-existing grid-coordinate placement still works if slotId is omitted.
   */
  placeItem: protectedProcedure
    .input(z.object({
      itemKey: z.string(),
      zone: z.string(),
      x: z.number(),
      y: z.number(),
      slotId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [quarters] = await db.select().from(playerQuarters).where(eq(playerQuarters.userId, ctx.user.id));
      if (!quarters) throw new Error("No quarters found");

      const item = DECORATION_ITEMS.find(i => i.key === input.itemKey);
      if (!item) throw new Error("Item not found");

      const unlockedZones = quarters.unlockedZones || ["main"];
      if (!unlockedZones.includes(input.zone)) throw new Error("Zone not unlocked");

      // Validate slot placement if a slotId is supplied.
      if (input.slotId) {
        const slot = getSlot(input.zone as any, input.slotId);
        if (!slot) throw new Error(`Unknown slot ${input.slotId} in zone ${input.zone}`);
        if (!isItemAllowedInSlot(item, slot)) {
          throw new Error(`Item category ${item.category} not allowed in slot ${input.slotId}`);
        }
      }

      // If pinning to a slot, evict whatever is already there so each slot
      // holds at most one item. Grid placements just append.
      const existing: PlacedQuartersItem[] = (quarters.placedItems as PlacedQuartersItem[] | null) ?? [];
      const placedItems: PlacedQuartersItem[] = input.slotId
        ? existing.filter((p) => !(p.zone === input.zone && p.slotId === input.slotId))
        : [...existing];
      placedItems.push({
        itemKey: input.itemKey,
        zone: input.zone,
        x: input.x,
        y: input.y,
        ...(input.slotId ? { slotId: input.slotId } : {}),
      });

      const ownedItems = quarters.ownedItems || [];
      if (!ownedItems.includes(input.itemKey)) ownedItems.push(input.itemKey);

      await db.update(playerQuarters)
        .set({ placedItems, ownedItems })
        .where(eq(playerQuarters.id, quarters.id));

      return { placed: true };
    }),

  /**
   * Remove an item. Accepts either a (zone, slotId) pair — which clears
   * whatever slot-pinned item is there — or (zone, itemKey) for the
   * legacy grid-coordinate placement.
   */
  removeItem: protectedProcedure
    .input(z.object({
      itemKey: z.string().optional(),
      zone: z.string(),
      slotId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [quarters] = await db.select().from(playerQuarters).where(eq(playerQuarters.userId, ctx.user.id));
      if (!quarters) throw new Error("No quarters found");

      if (!input.slotId && !input.itemKey) {
        throw new Error("removeItem requires either slotId or itemKey");
      }

      const placedItems = ((quarters.placedItems as PlacedQuartersItem[] | null) ?? []).filter((i) => {
        if (i.zone !== input.zone) return true;
        if (input.slotId) return i.slotId !== input.slotId;
        return i.itemKey !== input.itemKey;
      });

      await db.update(playerQuarters)
        .set({ placedItems })
        .where(eq(playerQuarters.id, quarters.id));

      return { removed: true };
    }),

  /** Change the active lighting preset. Server-validates it is unlocked. */
  setLighting: protectedProcedure
    .input(z.object({ presetId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [quarters] = await db.select().from(playerQuarters).where(eq(playerQuarters.userId, ctx.user.id));
      if (!quarters) throw new Error("No quarters found");

      // Ensure the preset exists
      const preset = LIGHTING_PRESETS.find((p) => p.id === input.presetId);
      if (!preset) throw new Error(`Unknown lighting preset: ${input.presetId}`);

      // Server-side unlock check against narrative state
      const [progress] = await db.select().from(userProgress)
        .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")));
      const pd = (progress?.progressData ?? {}) as Record<string, unknown>;
      const gd = (progress?.gameData ?? {}) as Record<string, unknown>;
      const available = getAvailableLightingPresets({
        elaraTrust: (pd.elaraTrust as number) ?? 0,
        humanTrust: (pd.humanTrust as number) ?? 0,
        npcTrust: (pd.npcTrust as Record<string, number>) ?? {},
        completedQuests: (pd.completedQuests as string[]) ?? [],
        discoveredRooms: Object.keys((pd.rooms as Record<string, unknown>) ?? {}).length,
        totalRooms: (gd.totalRoomCount as number) ?? 20,
      });
      if (!available.some((p) => p.id === input.presetId)) {
        throw new Error(`Lighting preset ${input.presetId} is locked`);
      }

      await db.update(playerQuarters)
        .set({ lightingPreset: input.presetId })
        .where(eq(playerQuarters.id, quarters.id));

      return { set: true, presetId: input.presetId };
    }),

  /** Change the active music box track. Server-validates it is unlocked. */
  setMusicTrack: protectedProcedure
    .input(z.object({ trackId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [quarters] = await db.select().from(playerQuarters).where(eq(playerQuarters.userId, ctx.user.id));
      if (!quarters) throw new Error("No quarters found");

      const track = MUSIC_TRACKS.find((t) => t.id === input.trackId);
      if (!track) throw new Error(`Unknown music track: ${input.trackId}`);

      // Server-side unlock check
      const [progress] = await db.select().from(userProgress)
        .where(and(eq(userProgress.userId, ctx.user.id), eq(userProgress.franchiseId, "dischordian-saga")));
      const pd = (progress?.progressData ?? {}) as Record<string, unknown>;
      const gd = (progress?.gameData ?? {}) as Record<string, unknown>;
      const [sheet] = await db.select().from(characterSheets).where(eq(characterSheets.userId, ctx.user.id));
      const available = getAvailableMusicTracks({
        elaraTrust: (pd.elaraTrust as number) ?? 0,
        humanTrust: (pd.humanTrust as number) ?? 0,
        npcTrust: (pd.npcTrust as Record<string, number>) ?? {},
        moralityScore: sheet?.moralityScore ?? 0,
        guildWarsWon: (gd.guildWarsWon as number) ?? 0,
        thoughtsInternalized: ((pd.thoughtInternalized as string[]) ?? []).length,
      });
      if (!available.some((t) => t.id === input.trackId)) {
        throw new Error(`Music track ${input.trackId} is locked`);
      }

      await db.update(playerQuarters)
        .set({ musicTrack: input.trackId })
        .where(eq(playerQuarters.id, quarters.id));

      return { set: true, trackId: input.trackId };
    }),

  /** Unlock a zone */
  unlockZone: protectedProcedure
    .input(z.object({ zoneKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [quarters] = await db.select().from(playerQuarters).where(eq(playerQuarters.userId, ctx.user.id));
      if (!quarters) throw new Error("No quarters found");

      const zone = ROOM_ZONES.find((zn) => zn.zone === input.zoneKey);
      if (!zone) throw new Error("Zone not found");

      const unlockedZones = quarters.unlockedZones || ["main"];
      if (unlockedZones.includes(input.zoneKey)) throw new Error("Zone already unlocked");

      unlockedZones.push(input.zoneKey);
      await db.update(playerQuarters)
        .set({ unlockedZones })
        .where(eq(playerQuarters.id, quarters.id));

      return { unlocked: true, zone: zone.name };
    }),

  /** Visit someone's quarters */
  visitQuarters: protectedProcedure
    .input(z.object({ ownerId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const [quarters] = await db.select().from(playerQuarters).where(eq(playerQuarters.userId, input.ownerId));
      if (!quarters) return null;

      // Log visit
      if (ctx.user.id !== input.ownerId) {
        await db.insert(quarterVisits).values({
          ownerId: input.ownerId,
          visitorId: ctx.user.id,
        });
        await db.update(playerQuarters)
          .set({ visitCount: quarters.visitCount + 1 })
          .where(eq(playerQuarters.id, quarters.id));
      }

      return { quarters };
    }),

  /** Get recent visitors */
  getRecentVisitors: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("DB unavailable");
    return db.select().from(quarterVisits)
      .where(eq(quarterVisits.ownerId, ctx.user.id))
      .orderBy(desc(quarterVisits.visitedAt))
      .limit(20);
  }),

  /** Rename quarters */
  rename: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(100) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      await db.update(playerQuarters)
        .set({ name: input.name })
        .where(eq(playerQuarters.userId, ctx.user.id));
      return { renamed: true };
    }),
});
