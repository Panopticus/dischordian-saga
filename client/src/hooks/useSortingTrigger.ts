/* ═══════════════════════════════════════════════════════
   USE SORTING TRIGGER

   Watches player skill levels. When any skill first crosses
   a minimum threshold AND the player hasn't been sorted yet,
   returns the candidate skill for the Sorting Ceremony.

   The ceremony is opt-in — returns a skill ID, caller decides
   when to actually show the modal.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { useGame } from "@/contexts/GameContext";
import { getDominantGuild } from "@/game/archonTrainingVoices";
import type { SkillId } from "@/game/innerVoices";

const SORTING_THRESHOLD = 60;

export function useSortingTrigger(): { shouldTrigger: boolean; skillId: SkillId | null } {
  const { state } = useGame();
  const skills = (state.innerVoiceSkills ?? {}) as Record<SkillId, number>;

  return useMemo(() => {
    if (state.sortingComplete) return { shouldTrigger: false, skillId: null };

    // Find highest skill
    const sorted = (Object.entries(skills) as [SkillId, number][])
      .filter(([, lvl]) => typeof lvl === "number")
      .sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) return { shouldTrigger: false, skillId: null };

    const [topSkill, topLevel] = sorted[0];
    if (topLevel < SORTING_THRESHOLD) return { shouldTrigger: false, skillId: null };

    // Ensure getDominantGuild resolves too
    const guild = getDominantGuild(skills);
    if (!guild) return { shouldTrigger: false, skillId: null };

    return { shouldTrigger: true, skillId: topSkill };
  }, [skills, state.sortingComplete]);
}
