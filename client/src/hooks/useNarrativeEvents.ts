/* ═══════════════════════════════════════════════════════
   USE NARRATIVE EVENTS — Bridge between game events and
   Void Energy narrative effects

   Listens to game event dispatchers (custom events, callbacks)
   and triggers physics-aware narrative effects on a target element.

   Mount once in the app shell. Narrative effects are applied
   to the document body (full-screen effects) or to a specific
   ref (scoped effects).

   Events wired:
   - "achievement-unlocked" → jolt
   - "npc-remember" → pulse
   - "combat-hit" → shake
   - "combat-critical" → quake
   - "combat-death" → freeze
   - "room-enter" → per-room effect from voidNarrative mapping
   - "narrative-effect" → direct effect trigger (escape hatch)
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef, useCallback } from "react";
import { useNarrative } from "./useNarrative";
import { getEffectForEvent, type NarrativeEffect } from "@/engine/voidNarrative";

/**
 * Bridge hook: listens to game events and triggers narrative effects
 * on the given element (defaults to document.body).
 *
 * Call once in AppShell or similar top-level component.
 */
export function useNarrativeEvents(
  elementRef?: React.RefObject<HTMLElement | null>,
) {
  const bodyRef = useRef<HTMLElement | null>(null);
  const activeRef = elementRef ?? bodyRef;

  // Point to body if no ref provided
  useEffect(() => {
    if (!elementRef) {
      bodyRef.current = document.body;
    }
  }, [elementRef]);

  const { trigger, clear } = useNarrative(activeRef);

  const handleEvent = useCallback((eventId: string) => {
    const effect = getEffectForEvent(eventId);
    if (effect) {
      trigger(effect);
    }
  }, [trigger]);

  // Direct effect trigger (for custom events with effect name)
  const handleDirectEffect = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail?.effect) {
      trigger(detail.effect);
    } else if (detail?.eventId) {
      handleEvent(detail.eventId);
    }
  }, [trigger, handleEvent]);

  useEffect(() => {
    // Achievement unlocked → jolt
    const onAchievement = () => handleEvent("achievement_unlock");
    window.addEventListener("achievement-unlocked", onAchievement);

    // NPC remember → pulse
    const onRemember = () => handleEvent("npc_trust_gained");
    window.addEventListener("npc-remember", onRemember);

    // Direct narrative effect trigger (escape hatch for any component)
    window.addEventListener("narrative-effect", handleDirectEffect);

    // Combat events (dispatched by fight engine callbacks)
    const onCombatHit = () => handleEvent("player_hit");
    const onCombatCritical = () => handleEvent("player_critical_hit");
    const onCombatDeath = () => handleEvent("player_death");
    const onLimitBreak = () => handleEvent("limit_break_activate");
    window.addEventListener("combat-hit", onCombatHit);
    window.addEventListener("combat-critical", onCombatCritical);
    window.addEventListener("combat-death", onCombatDeath);
    window.addEventListener("combat-limit-break", onLimitBreak);

    // Room enter (dispatched by GameContext.enterRoom)
    const onRoomEnter = (e: Event) => {
      const roomId = (e as CustomEvent).detail?.roomId;
      if (roomId) {
        const eventKey = `enter_${roomId.replace(/-/g, "_")}`;
        handleEvent(eventKey);
      }
    };
    window.addEventListener("room-enter", onRoomEnter);

    // Card game events
    const onCardSummon = () => handleEvent("card_summon");
    const onGeneralDefeated = () => handleEvent("general_defeated");
    window.addEventListener("card-summon", onCardSummon);
    window.addEventListener("card-general-defeated", onGeneralDefeated);

    // Morality shift
    const onMoralityShift = (e: Event) => {
      const direction = (e as CustomEvent).detail?.direction;
      handleEvent(direction === "machine" ? "morality_shift_machine" : "morality_shift_humanity");
    };
    window.addEventListener("morality-shift", onMoralityShift);

    return () => {
      window.removeEventListener("achievement-unlocked", onAchievement);
      window.removeEventListener("npc-remember", onRemember);
      window.removeEventListener("narrative-effect", handleDirectEffect);
      window.removeEventListener("combat-hit", onCombatHit);
      window.removeEventListener("combat-critical", onCombatCritical);
      window.removeEventListener("combat-death", onCombatDeath);
      window.removeEventListener("combat-limit-break", onLimitBreak);
      window.removeEventListener("room-enter", onRoomEnter);
      window.removeEventListener("card-summon", onCardSummon);
      window.removeEventListener("card-general-defeated", onGeneralDefeated);
      window.removeEventListener("morality-shift", onMoralityShift);
      clear();
    };
  }, [handleEvent, handleDirectEffect, clear]);

  return { triggerEffect: trigger, clearEffect: clear, handleEvent };
}

/* ─── DISPATCH HELPERS ───
   Call from any game system to emit narrative-triggering events. */

export function dispatchCombatHit() {
  window.dispatchEvent(new CustomEvent("combat-hit"));
}

export function dispatchCombatCritical() {
  window.dispatchEvent(new CustomEvent("combat-critical"));
}

export function dispatchCombatDeath() {
  window.dispatchEvent(new CustomEvent("combat-death"));
}

export function dispatchLimitBreak() {
  window.dispatchEvent(new CustomEvent("combat-limit-break"));
}

export function dispatchRoomEnter(roomId: string) {
  window.dispatchEvent(new CustomEvent("room-enter", { detail: { roomId } }));
}

export function dispatchCardSummon() {
  window.dispatchEvent(new CustomEvent("card-summon"));
}

export function dispatchCardGeneralDefeated() {
  window.dispatchEvent(new CustomEvent("card-general-defeated"));
}

export function dispatchMoralityShift(direction: "machine" | "humanity") {
  window.dispatchEvent(new CustomEvent("morality-shift", { detail: { direction } }));
}

/**
 * Escape hatch: trigger any narrative effect directly from any component.
 *   dispatchNarrativeEffect("glitch");
 *   dispatchNarrativeEffect(null, "virus_encounter"); // by event ID
 */
export function dispatchNarrativeEffect(effect?: NarrativeEffect, eventId?: string) {
  window.dispatchEvent(new CustomEvent("narrative-effect", {
    detail: { effect, eventId },
  }));
}
