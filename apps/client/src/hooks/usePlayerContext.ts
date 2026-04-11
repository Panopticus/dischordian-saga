/* ═══════════════════════════════════════════════════════
   usePlayerContext — Build a PlayerContext for transmission
   unlock evaluation.

   Consolidates game-state + citizen level + story progress
   into the `PlayerContext` shape consumed by
   `isUnlocked()` / `getNewlyUnlocked()` from @shared/transmissions.
   Replaces the two places where this object was being
   constructed ad-hoc with hardcoded level / completedChapters.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useGame } from "@/contexts/GameContext";
import { loadStoryProgress } from "@/game/storyMode";
import type { PlayerContext } from "@shared/transmissions";

export function usePlayerContext(): PlayerContext {
  const { isAuthenticated } = useAuth();
  const { state } = useGame();

  // Citizen character provides the authoritative player level.
  // Falls back to 1 for anonymous sessions.
  const { data: character } = trpc.citizen.getCharacter.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 60_000,
  });

  // Fight story progress — source of truth for completedChapters.
  // Loaded synchronously from localStorage (tiny cost).
  const storyProgress = useMemo(() => loadStoryProgress(), []);

  return useMemo<PlayerContext>(
    () => ({
      level: character?.level ?? 1,
      awakeningStep: state.awakeningStep,
      completedChapters: storyProgress.completedChapters,
      elaraTrust: state.elaraTrust ?? 0,
      humanTrust: state.humanTrust ?? 0,
      npcTrust: state.npcTrust ?? {},
      moralityScore: state.moralityScore ?? 0,
      narrativeFlags: state.narrativeFlags ?? {},
      roomsVisited: Object.keys(state.rooms ?? {}).filter(
        k => (state.rooms as Record<string, { visited?: boolean }> | undefined)?.[k]?.visited,
      ),
      hasApprenticeGraduate: Object.keys(state.legionGraduates ?? {}).length > 0,
    }),
    [
      character?.level,
      state.awakeningStep,
      storyProgress.completedChapters,
      state.elaraTrust,
      state.humanTrust,
      state.npcTrust,
      state.moralityScore,
      state.narrativeFlags,
      state.rooms,
      state.legionGraduates,
    ],
  );
}
