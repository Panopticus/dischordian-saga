/* ═══════════════════════════════════════════════════════
   DAILY SESSION LOOP — the designed "today" sequence

   Every part of a daily loop already exists (Memory Energy,
   the streak saver, the living-Ark daily brief, axis-tagged
   daily quests, bonus objectives, the featured-NPC rotation,
   the daily-reward ladder) — but as scattered surfaces with
   no designed order and no "what do I do for ~8 minutes
   today" through-line. This module is that through-line.

   It is the SAME pattern as the narrative spine: the parts
   shipped; the connective model did not. The loop ends by
   handing back to the spine's deriveObjectives — the daily
   session always points the player at the next story beat,
   so "open but guided" holds session-to-session too.

   The parity gate
   (apps/shared/_completeness/checks/dailySessionLoopCoverage.ts)
   is HARD PARITY: every step's anchor module MUST exist on
   disk (no orphaned step), and the total session budget MUST
   stay in the designed 5–12 minute band.

   Pure module. No React.
   ═══════════════════════════════════════════════════════ */

export interface DailyLoopStep {
  /** Stable id, snake_case. */
  id: string;
  /** Player-facing label. */
  label: string;
  /** In-fiction framing — the loop is diegetic, not a chore list. */
  diegeticFraming: string;
  /** Budgeted minutes for this step (the ~8-minute session design). */
  minutes: number;
  /** The shipped module this step is backed by (must exist on disk). */
  anchorModule: string;
}

/**
 * The designed daily session, in order. Total budget ≈ 8 minutes.
 * The final step is the spine handoff — the day always ends pointing
 * at the next narrative beat.
 */
export const DAILY_SESSION_LOOP: readonly DailyLoopStep[] = [
  {
    id: "energy_checkin",
    label: "Memory Energy check-in",
    diegeticFraming:
      "Elara reports the night's Memory Energy regen and your cap.",
    minutes: 0.5,
    anchorModule: "apps/shared/memoryEnergy.ts",
  },
  {
    id: "streak_keep",
    label: "Hold the streak",
    diegeticFraming:
      "The streak holds — and the saver covers you if a day slipped.",
    minutes: 0.5,
    anchorModule: "apps/shared/streakSaver.ts",
  },
  {
    id: "daily_brief",
    label: "The Ark's daily brief",
    diegeticFraming:
      "What moved on the Ark overnight — the living universe's report.",
    minutes: 1,
    anchorModule: "apps/client/src/hooks/useDailyBrief.ts",
  },
  {
    id: "daily_quests",
    label: "The day's quests",
    diegeticFraming:
      "Axis-tagged daily objectives — your choices nudge the meters.",
    minutes: 2.5,
    anchorModule: "apps/shared/dailyQuestAxisRouter.ts",
  },
  {
    id: "bonus_objectives",
    label: "A bonus the narrator calls",
    diegeticFraming:
      "The Mobile Narrator calls out a bonus objective by name.",
    minutes: 1.5,
    anchorModule: "apps/shared/bonusObjectives.ts",
  },
  {
    id: "npc_rotation",
    label: "Today's featured crew",
    diegeticFraming:
      "One crew member is featured today — extra trust if you visit.",
    minutes: 1,
    anchorModule: "apps/client/src/game/npcDailyRotation.ts",
  },
  {
    id: "daily_reward",
    label: "Claim the reward ladder",
    diegeticFraming: "The daily-reward ladder pays out the day's rung.",
    minutes: 0.5,
    anchorModule: "apps/client/src/components/DailyRewards.tsx",
  },
  {
    id: "spine_handoff",
    label: "What's next on the spine",
    diegeticFraming:
      "The day ends pointing at the next story beat — Locke, the " +
      "Antiquarian, or a companion names the next move.",
    minutes: 0.5,
    anchorModule: "apps/shared/spineObjectives.ts",
  },
] as const;

/** Total designed session length, in minutes. */
export function getDailySessionMinutes(): number {
  return DAILY_SESSION_LOOP.reduce((s, x) => s + x.minutes, 0);
}

export function getDailySessionLoopCoverage(): {
  declared: number;
  steps: number;
  minutes: number;
} {
  return {
    declared: DAILY_SESSION_LOOP.length,
    steps: DAILY_SESSION_LOOP.length,
    minutes: getDailySessionMinutes(),
  };
}
