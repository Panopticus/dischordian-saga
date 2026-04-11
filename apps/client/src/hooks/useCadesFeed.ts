/* ═══════════════════════════════════════════════════════
   useCadesFeed — listens to narrative-effect events and
   accumulates matching CADES crew reactions into a local
   session feed. Not persisted; resets on page reload.

   Consumers:
   - CADESFPSPage result screen (shows entries triggered
     by the just-completed scenario)
   - ArkExplorerPage bridge console (shows recent entries)
   ═══════════════════════════════════════════════════════ */
import { useEffect, useState, useCallback } from "react";
import { ALL_CREW_REACTIONS, type CrewReaction } from "@/game/crewReactions";

export interface CadesFeedEntry {
  id: string;
  reaction: CrewReaction;
  timestamp: number;
}

// Module-level store so multiple consumer components share the same feed.
const entries: CadesFeedEntry[] = [];
const listeners = new Set<() => void>();
let eventListenerAttached = false;

function notify() {
  for (const fn of listeners) fn();
}

function findReactionForEvent(eventId: string): CrewReaction | null {
  return ALL_CREW_REACTIONS.find(
    (r) => r.trigger.type === "living_universe_event" && (r.trigger as { type: "living_universe_event"; eventId: string }).eventId === eventId
  ) ?? null;
}

function pushEntry(eventId: string) {
  const reaction = findReactionForEvent(eventId);
  if (!reaction) return;
  // Dedupe: don't show the same reaction id twice in a row within 5s.
  const last = entries[entries.length - 1];
  if (last && last.reaction.id === reaction.id && Date.now() - last.timestamp < 5000) return;
  entries.push({
    id: `${reaction.id}_${Date.now()}`,
    reaction,
    timestamp: Date.now(),
  });
  // Cap to last 40 entries.
  while (entries.length > 40) entries.shift();
  notify();
}

function ensureGlobalListener() {
  if (eventListenerAttached) return;
  eventListenerAttached = true;
  if (typeof window === "undefined") return;
  window.addEventListener("narrative-effect", (e: Event) => {
    const detail = (e as CustomEvent).detail;
    const eventId: string | undefined = detail?.eventId;
    if (typeof eventId === "string" && eventId.startsWith("cades_")) {
      pushEntry(eventId);
    }
  });
}

export function useCadesFeed(limit: number = 10) {
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    ensureGlobalListener();
    const listener = () => forceUpdate((n) => n + 1);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);
  const clear = useCallback(() => {
    entries.length = 0;
    notify();
  }, []);
  // Return newest first, limited.
  return {
    entries: entries.slice(-limit).reverse(),
    allEntries: entries.slice().reverse(),
    clear,
  };
}
