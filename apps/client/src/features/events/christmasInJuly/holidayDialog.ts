/* ═══════════════════════════════════════════════════════
   CHRISTMAS IN JULY — Holiday Dialog consumers

   Thin helpers that expose the NPC holiday lines from
   `data/events/christmasInJuly/npcHolidayDialog.ts` and
   the pet reactions from `petHolidayReactions.ts` to any
   caller that already knows it wants the "festive"
   variant of an NPC greeting.

   Consumers should call `useIsChristmasActive()` first
   and fall back to their normal NPC lines when it
   returns false.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { NPC_HOLIDAY_DIALOG, type NpcHolidayLines } from "@/data/events/christmasInJuly/npcHolidayDialog";
import { STARTER_PET_REACTIONS, EIDOLON_REACTIONS } from "@/data/events/christmasInJuly/petHolidayReactions";
import { CHRISTMAS_EVENT_CONFIG } from "@/data/events/christmasInJuly/eventConfig";

/** Returns true when the current wall-clock time is inside the
 *  Christmas in July event window. */
export function useIsChristmasActive(): boolean {
  return useMemo(() => {
    const now = Date.now();
    return now >= new Date(CHRISTMAS_EVENT_CONFIG.startDate).getTime() &&
           now <= new Date(CHRISTMAS_EVENT_CONFIG.endDate).getTime();
  }, []);
}

/** Fetch the holiday line for an NPC, or null if we don't have one. */
export function getNpcHolidayLines(npcId: string): NpcHolidayLines | null {
  return NPC_HOLIDAY_DIALOG[npcId] ?? null;
}

/**
 * Build a display object that merges the regular NPC greeting with
 * the holiday override (if one exists and the event is active).
 */
export function resolveNpcGreeting(
  npcId: string,
  fallback: string,
  active: boolean,
): { text: string; isHoliday: boolean; source: string } {
  if (!active) return { text: fallback, isHoliday: false, source: "default" };
  const holiday = getNpcHolidayLines(npcId);
  if (!holiday) return { text: fallback, isHoliday: false, source: "default" };
  return { text: holiday.welcome, isHoliday: true, source: "christmas_in_july" };
}

/** Pet reactions — walk both tables and return the one matching the id. */
export function getPetHolidayReaction(petId: string) {
  return (
    STARTER_PET_REACTIONS.find(p => p.petId === petId) ??
    EIDOLON_REACTIONS.find(p => p.petId === petId) ??
    null
  );
}

/** React-friendly variant — prefer the holiday reaction line, fall back. */
export function resolvePetReaction(petId: string, active: boolean): string | null {
  if (!active) return null;
  const reaction = getPetHolidayReaction(petId);
  if (!reaction) return null;
  return reaction.casinoReaction;
}
