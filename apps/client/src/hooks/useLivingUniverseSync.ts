/**
 * useLivingUniverseSync — pressure → flag setter
 *
 * Subscribes to the server's livingUniverse.getActiveEvents query
 * and reflects the active set into GameContext narrative flags as
 *   living_universe_event_<eventId>_active
 *
 * The LivingShipSensorOverlay (apps/client/src/components/
 * LivingShipSensorOverlay.tsx) reads those flags via
 * useLivingShipSensor and renders the sensor reactions. This hook
 * is the bridge between server-side community pressure aggregation
 * and the client-side diegetic surface.
 *
 * Mounted in App.tsx as a side-effect-only watcher (returns null).
 *
 * Design notes:
 *   - Uses a polling query interval (60s) — Living Universe state
 *     shifts slowly; faster polling is wasteful.
 *   - Clears stale flags when an event is no longer in the active
 *     set, so the sensor overlay doesn't show ghosts.
 *   - Tolerates query errors silently — the sensor falls back to
 *     "no active reaction," which is the correct degraded state.
 */

import { useEffect, useMemo, useRef } from "react";
import { useGame } from "@/contexts/GameContext";
import { trpc } from "@/lib/trpc";
import { livingUniverseEventActiveFlag } from "@/hooks/useLivingShipSensor";

const POLL_INTERVAL_MS = 60_000;

export function useLivingUniverseSync(): void {
  const { state, setNarrativeFlag } = useGame();
  const flags = state.narrativeFlags ?? {};

  const query = trpc.livingUniverse.getActiveEvents.useQuery(undefined, {
    refetchInterval: POLL_INTERVAL_MS,
    staleTime: POLL_INTERVAL_MS / 2,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  const previouslyActiveRef = useRef<ReadonlySet<string>>(new Set());

  const activeEventIds = useMemo<ReadonlySet<string>>(() => {
    const out = new Set<string>();
    const data = query.data;
    if (!data || !Array.isArray(data.active)) return out;
    for (const entry of data.active) {
      if (entry && typeof entry.eventId === "string") {
        out.add(entry.eventId);
      }
    }
    return out;
  }, [query.data]);

  useEffect(() => {
    // Set flags for currently-active events.
    for (const eventId of activeEventIds) {
      const flag = livingUniverseEventActiveFlag(eventId);
      if (!flags[flag]) {
        setNarrativeFlag(flag, true);
      }
    }
    // Clear flags for events that were active before but are no longer.
    for (const wasActive of previouslyActiveRef.current) {
      if (!activeEventIds.has(wasActive)) {
        const flag = livingUniverseEventActiveFlag(wasActive);
        if (flags[flag]) {
          setNarrativeFlag(flag, false);
        }
      }
    }
    previouslyActiveRef.current = activeEventIds;
  }, [activeEventIds, flags, setNarrativeFlag]);
}
