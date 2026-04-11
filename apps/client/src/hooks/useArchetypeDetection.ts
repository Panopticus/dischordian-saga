/* ═══════════════════════════════════════════════════════
   USE ARCHETYPE DETECTION

   Background hook that auto-runs detectArchetype() whenever
   player behavior state changes (morality, trust, etc.) and
   emerges new archetypes as they develop.

   In the Matrix of Dreams fiction: Project Celebration's
   grading system is always running. It watches what you do
   and writes what you are becoming.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef } from "react";
import { useGame } from "@/contexts/GameContext";
import { detectArchetype, getPrimaryArchetype, type ArchetypeId } from "@/game/playerArchetypes";

export function useArchetypeDetection() {
  const { state, addArchetypeEmergence } = useGame();
  const lastRunRef = useRef<number>(0);

  useEffect(() => {
    // Throttle — only run detection at most every 30s
    const now = Date.now();
    if (now - lastRunRef.current < 30_000) return;
    lastRunRef.current = now;

    const loreCount = state.loreAchievements?.length ?? 0;
    const combatWins = 0; // No direct fightRecord in GameState; extend later
    const tradeVolume = 0; // No direct trade tracking in GameState; extend later

    const newlyEmerged = detectArchetype(
      state.npcTrust ?? {},
      state.elaraTrust ?? 0,
      state.humanTrust ?? 0,
      state.moralityScore ?? 0,
      combatWins,
      loreCount,
      tradeVolume,
    );

    // Emerge any archetypes not yet emerged
    const known = new Set<string>(state.archetypeEmerged);
    for (const id of newlyEmerged) {
      if (!known.has(id)) {
        addArchetypeEmergence(id);
      }
    }

    // Update primary archetype
    if (newlyEmerged.length > 0) {
      const primary = getPrimaryArchetype(newlyEmerged);
      if (primary && primary !== state.archetypePrimary) {
        addArchetypeEmergence(primary, true);
      }
    }
  }, [
    state.npcTrust,
    state.elaraTrust,
    state.humanTrust,
    state.moralityScore,
    state.archetypeEmerged,
    state.archetypePrimary,
    state.loreAchievements,
    addArchetypeEmergence,
  ]);
}
