/* ═══════════════════════════════════════════════════════
   EVENT REVEAL ROUTER

   Watches the active living-universe event flags
   (`living_universe_event_<id>_active`, set by
   `useLivingUniverseSync`) and fires a one-shot reveal
   cinematic the FIRST time a player sees an event manifest.

   Source of truth for the URL: the EmergentEvent's optional
   `cutsceneVideoRelPath` field (apps/shared/livingUniverseEvents.ts).
   Only events with that field populated trigger a reveal — others
   activate silently. Event_<id>_reveal_seen idempotents replays
   so a long-running event doesn't fire its reveal repeatedly.

   Mounted at App root next to the other cutscene routers.
   Pure resolver (`resolvePendingEventReveal`) is exported for unit
   testing without a DOM.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useMemo, type ReactElement } from "react";
import { useGame } from "@/contexts/GameContext";
import {
  ALL_EMERGENT_EVENTS,
  type EmergentEvent,
} from "@shared/livingUniverseEvents";
import { livingUniverseEventActiveFlag } from "@/hooks/useLivingShipSensor";
import { SingleVideoCutsceneOverlay } from "./SingleVideoCutsceneOverlay";

export const eventRevealSeenFlag = (eventId: string): string =>
  `event_${eventId}_reveal_seen`;

/** Pure resolver: given a narrative-flag map, return the first
 *  emergent event whose `_active` flag is set, whose
 *  `cutsceneVideoRelPath` is defined, and whose `_reveal_seen`
 *  flag is NOT yet set. Returns null when nothing's pending.
 *
 *  Iteration order matches ALL_EMERGENT_EVENTS — if multiple
 *  events activate at once (rare but possible per
 *  MAX_CONCURRENT_EVENTS = 2), the first canonical one wins. */
export function resolvePendingEventReveal(
  flags: Readonly<Record<string, unknown>>,
): EmergentEvent | null {
  for (const event of ALL_EMERGENT_EVENTS) {
    if (!event.cutsceneVideoRelPath) continue;
    if (flags[livingUniverseEventActiveFlag(event.id)] !== true) continue;
    if (flags[eventRevealSeenFlag(event.id)] === true) continue;
    return event;
  }
  return null;
}

export function EventRevealRouter(): ReactElement | null {
  const { state, setNarrativeFlag } = useGame();
  const flags = state.narrativeFlags ?? {};

  const active = useMemo<EmergentEvent | null>(
    () => resolvePendingEventReveal(flags),
    [flags],
  );

  const handleComplete = useCallback(() => {
    if (!active) return;
    setNarrativeFlag(eventRevealSeenFlag(active.id), true);
  }, [active, setNarrativeFlag]);

  if (!active || !active.cutsceneVideoRelPath) return null;

  return (
    <SingleVideoCutsceneOverlay
      cutsceneId={`event_reveal_${active.id}`}
      videoRelPath={active.cutsceneVideoRelPath}
      primaryLabel="Living Universe"
      secondaryLabel={active.name}
      badge={active.tagline}
      onComplete={handleComplete}
    />
  );
}

export default EventRevealRouter;
