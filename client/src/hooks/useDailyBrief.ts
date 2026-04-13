/* ═══════════════════════════════════════════════════════
   DAILY BRIEF HOOK — Connects client to the Daily Brief,
   Living Universe, and Room State server systems.

   Mount in AppShell or BridgeConsole to:
   - Fetch today's 3 events (gameplay, story, relationship)
   - Complete events and receive cross-room chain alerts
   - Track room visual evolution
   - Display Living Universe emergent event status
   - Record pressure events from game actions

   Integrates with:
   - livingArk.ts (room definitions, visual descriptions)
   - livingUniverseEvents.ts (pressure types, consequences)
   - arkEventHandler.ts (event processing)
   ═══════════════════════════════════════════════════════ */

import { useCallback, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { PRESSURE_SOURCE_MAP, getActiveConsequences } from "@shared/livingUniverseEvents";
import {
  getRoomVisualDescription,
  getCrossRoomAlerts,
  getCrewInRoom,
  DEFAULT_CREW,
  type RoomId,
  type EventType,
  type RoomVisualState,
} from "@/game/livingArk";

/* ─── DAILY BRIEF HOOK ─── */

export function useDailyBrief() {
  const utils = trpc.useUtils();

  // Fetch today's brief
  const { data: todayBrief, isLoading: briefLoading } = trpc.dailyBrief.getToday.useQuery(
    undefined,
    { staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false },
  );

  // Fetch brief history
  const { data: briefHistory } = trpc.dailyBrief.getHistory.useQuery(
    { days: 7 },
    { staleTime: 10 * 60 * 1000 },
  );

  // Complete event mutation
  const completeMutation = trpc.dailyBrief.completeEvent.useMutation({
    onSuccess: (result) => {
      utils.dailyBrief.getToday.invalidate();

      // Show cross-room alerts
      if (result.crossRoomAlerts && result.crossRoomAlerts.length > 0) {
        for (const alert of result.crossRoomAlerts) {
          toast.info(alert.description, {
            description: `Alert in: ${alert.alertRooms.join(", ")}`,
            duration: 5000,
          });
        }
      }
    },
  });

  const completeEvent = useCallback((eventId: string, eventType: string, roomId: string) => {
    completeMutation.mutate({ eventId, eventType, roomId });

    // Also generate client-side cross-room alerts for immediate feedback
    const alerts = getCrossRoomAlerts(eventType as EventType, roomId as RoomId);
    return alerts;
  }, [completeMutation]);

  // Derived: which events are completed today
  const completedEvents = useMemo(() => {
    return new Set(todayBrief?.completedEvents ?? []);
  }, [todayBrief]);

  // Derived: all 3 events with completion status
  const events = useMemo(() => {
    if (!todayBrief?.events) return null;
    return {
      gameplay: { ...todayBrief.events.gameplay, completed: completedEvents.has(todayBrief.events.gameplay.id) },
      story: { ...todayBrief.events.story, completed: completedEvents.has(todayBrief.events.story.id) },
      relationship: { ...todayBrief.events.relationship, completed: completedEvents.has(todayBrief.events.relationship.id) },
    };
  }, [todayBrief, completedEvents]);

  // Brief completion streak
  const briefStreak = useMemo(() => {
    if (!briefHistory) return 0;
    let streak = 0;
    for (const brief of briefHistory) {
      const completed = brief.completedEvents ?? [];
      if (completed.length >= 3) streak++;
      else break;
    }
    return streak;
  }, [briefHistory]);

  return {
    todayBrief,
    events,
    briefLoading,
    completedEvents,
    completeEvent,
    briefHistory,
    briefStreak,
    allCompleted: completedEvents.size >= 3,
  };
}

/* ─── LIVING UNIVERSE HOOK ─── */

export function useLivingUniverse() {
  const utils = trpc.useUtils();

  // Fetch universe state (community-wide)
  const { data: universeState, isLoading: universeLoading } = trpc.dailyBrief.getUniverseState.useQuery(
    undefined,
    { staleTime: 60 * 1000, refetchInterval: 5 * 60 * 1000 },
  );

  // Record pressure mutation
  const recordPressureMutation = trpc.dailyBrief.recordPressure.useMutation({
    onSuccess: (result) => {
      if (result.emerging) {
        utils.dailyBrief.getUniverseState.invalidate();
      }
    },
  });

  /** Record a game action that contributes to community pressure.
   *  Use PRESSURE_SOURCE_MAP keys: "fight_death", "npc_trust_gain", etc. */
  const recordAction = useCallback((actionKey: string, metadata?: Record<string, unknown>) => {
    const mapping = PRESSURE_SOURCE_MAP[actionKey];
    if (!mapping) return;

    recordPressureMutation.mutate({
      pressureType: mapping.pressureType,
      amount: mapping.amount,
      source: actionKey,
      metadata,
    });
  }, [recordPressureMutation]);

  // Derived: active event consequences that affect game systems
  const activeConsequences = useMemo(() => {
    if (!universeState?.activeEvents?.length) return null;
    const activeIds = universeState.activeEvents.map(e => e.eventId);
    return getActiveConsequences(activeIds);
  }, [universeState]);

  // Derived: proximity bar data for each potential event
  const pressureBars = useMemo(() => {
    if (!universeState?.pressure) return [];
    const p = universeState.pressure;
    return [
      { eventId: "necromancer_return", name: "The Necromancer Returns", score: Math.max(0, p.deaths - p.healingDone * 0.5), color: "#8b0000" },
      { eventId: "dreamer_awakening", name: "The Dreamer Awakens", score: Math.max(0, p.trustGains + p.moralityHumanity * 2), color: "#4a90d9" },
      { eventId: "terminus_advance", name: "Terminus Approaches", score: Math.max(0, p.viralExposures + p.moralityMachine - p.moralityHumanity), color: "#2d5016" },
      { eventId: "antiquarian_revelation", name: "Timelines Converge", score: Math.max(0, p.loreDiscoveries + p.exploration * 0.5), color: "#b8860b" },
      { eventId: "shadow_tongue_edit", name: "The Grand Edit", score: Math.max(0, p.betrayals - p.truthRevealed * 0.5), color: "#4b0082" },
    ].map(bar => ({ ...bar, proximity: Math.min(100, bar.score / 10) }));
  }, [universeState]);

  return {
    universeState,
    universeLoading,
    recordAction,
    activeConsequences,
    pressureBars,
    activeEvents: universeState?.activeEvents ?? [],
    emergingEvent: universeState?.emergingEvent ?? null,
    activeSynergies: universeState?.synergies ?? [],
  };
}

/* ─── ROOM STATE HOOK ─── */

export function useRoomStates() {
  const utils = trpc.useUtils();

  // Fetch all room states
  const { data: roomStates, isLoading: statesLoading } = trpc.dailyBrief.getRoomStates.useQuery(
    undefined,
    { staleTime: 5 * 60 * 1000 },
  );

  // Assign crew mutation
  const assignCrewMutation = trpc.dailyBrief.assignCrew.useMutation({
    onSuccess: () => {
      utils.dailyBrief.getRoomStates.invalidate();
      toast.success("Crew member reassigned");
    },
  });

  // Add decoration mutation
  const addDecorationMutation = trpc.dailyBrief.addDecoration.useMutation({
    onSuccess: () => {
      utils.dailyBrief.getRoomStates.invalidate();
      toast.success("Decoration placed");
    },
  });

  /** Get the visual state for a specific room */
  const getRoomVisual = useCallback((roomId: RoomId, crewAwakened: boolean) => {
    const state = roomStates?.find(rs => rs.roomId === roomId);
    const visualState: RoomVisualState = {
      visualTier: state?.visualTier ?? 0,
      damageLevel: state?.damageLevel ?? 0,
      crewPresent: state?.crewAssigned ?? [],
      decorations: state?.decorations ?? [],
    };

    const description = getRoomVisualDescription(roomId, visualState);
    const crew = getCrewInRoom(roomId, visualState.crewPresent, crewAwakened);

    return { ...description, crew, visualState };
  }, [roomStates]);

  /** Get all available crew members (for assignment UI) */
  const availableCrew = useMemo(() => {
    const assigned = new Set<string>();
    for (const rs of roomStates ?? []) {
      for (const crewId of rs.crewAssigned ?? []) {
        assigned.add(crewId);
      }
    }
    return DEFAULT_CREW.map(c => ({
      ...c,
      assignedRoom: (roomStates ?? []).find(rs => (rs.crewAssigned ?? []).includes(c.id))?.roomId ?? null,
    }));
  }, [roomStates]);

  return {
    roomStates,
    statesLoading,
    getRoomVisual,
    availableCrew,
    assignCrew: (roomId: string, crewMemberId: string) => assignCrewMutation.mutate({ roomId, crewMemberId }),
    addDecoration: (roomId: string, decorationId: string) => addDecorationMutation.mutate({ roomId, decorationId }),
  };
}
