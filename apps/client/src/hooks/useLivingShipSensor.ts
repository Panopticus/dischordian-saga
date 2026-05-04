/**
 * useLivingShipSensor — Living Universe → Ark sensor reactions
 *
 * Reads narrative flags of the form
 *   living_universe_event_<eventId>_active
 * and resolves the highest-priority matching shipSensorReaction
 * (per shipSensorReactions.ts). The page mounts the
 * LivingShipSensorOverlay which renders the Elara catch-line +
 * affected room + investigation CTA.
 *
 * This wiring deliberately keys off narrative flags rather than
 * the full Living-Universe pressure system. The pressure system
 * sets these flags when an event activates; the sensor merely
 * reads them. Either system can evolve independently.
 */

import { useMemo } from "react";
import { useGame } from "@/contexts/GameContext";
import {
  getPrimaryReactionForEvent,
  type ShipSensorReaction,
} from "@shared/shipSensorReactions";

export function livingUniverseEventActiveFlag(eventId: string): string {
  return `living_universe_event_${eventId}_active`;
}

export function useLivingShipSensor(): {
  activeReactions: readonly ShipSensorReaction[];
  primaryReaction: ShipSensorReaction | undefined;
} {
  const { state } = useGame();
  const flags = state.narrativeFlags ?? {};

  const activeReactions = useMemo<readonly ShipSensorReaction[]>(() => {
    const out: ShipSensorReaction[] = [];
    // We don't import the full event registry here — instead we walk
    // any flag matching the active prefix and resolve via the canonical
    // primary-reaction helper. This keeps the hook decoupled from the
    // event-list shape.
    for (const key of Object.keys(flags)) {
      const match = key.match(/^living_universe_event_(.+)_active$/);
      if (!match || !flags[key]) continue;
      const eventId = match[1];
      const reaction = getPrimaryReactionForEvent(eventId);
      if (reaction) out.push(reaction);
    }
    return out;
  }, [flags]);

  // Pick the highest-priority reaction across all active events.
  const primaryReaction = useMemo(() => {
    if (activeReactions.length === 0) return undefined;
    return [...activeReactions].sort((a, b) => b.priority - a.priority)[0];
  }, [activeReactions]);

  return { activeReactions, primaryReaction };
}
