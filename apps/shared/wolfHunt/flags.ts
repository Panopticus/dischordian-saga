/* ═══════════════════════════════════════════════════════
   WOLF-HUNT — Narrative flag identifiers

   Single source of truth for every narrativeFlag key the
   Wolf-Anara solo hunt arc reads or writes. Importers
   should NEVER hardcode the literal strings — go through
   these exports so a rename catches at the type level.

   The flag namespace is `wolfHunt.*`. Pre-pivot flags
   that lived under `wolf.hunt_the_hero_*` are retired
   (see C-pivot.A.1 in the plan).
   ═══════════════════════════════════════════════════════ */

/**
 * Set true by the ResurrectionCinematicRouter's Wolf-release
 * onComplete callback. Gates the WolfHuntDossierPanel mount —
 * the Antiquarian's casefile board becomes reachable from the
 * moment the release cinematic ends.
 */
export const WOLF_HUNT_ARC_AVAILABLE_FLAG = "wolfHunt.arc_available";

/**
 * Written when a mission's choice triggers a Lycos death roll
 * that fires. The value is the targetId where Lycos fell. Read
 * by WolfHuntOverlay on mount: when present + Lycos resurrected,
 * the overlay surfaces the "Resume the contract" CTA.
 */
export const WOLF_HUNT_PAUSED_AT_TARGET_FLAG_PREFIX = "wolfHunt.paused_at_target:";

/** Flag emitted when the player defeats a lord's boss lieutenant. */
export function lieutenantDefeatedFlag(lordId: string): string {
  return `wolfHunt.lord_lieutenant_defeated:${lordId}`;
}

/** Flag emitted when all 25 heroes under a lord are resolved (any outcome). */
export function lordFullyHarvestedFlag(lordId: string): string {
  return `wolfHunt.lord_fully_harvested:${lordId}`;
}

/** Kill-count milestone flag (e.g. ":10", ":25", ":50", ":100", ":200", ":250"). */
export function killsCountFlag(threshold: number): string {
  return `wolfHunt.kills_count:${threshold}`;
}

/** Set true the first time Lycos dies on a mission. */
export const WOLF_HUNT_LYCOS_FIRST_DEATH_FLAG = "wolfHunt.lycos_first_death";

/** Set true the first time Lycos returns via Path A or B after a mission death. */
export const WOLF_HUNT_LYCOS_RESURRECTED_FIRST_TIME_FLAG =
  "wolfHunt.lycos_resurrected_first_time";

/** Set true when the player drives `crucible.league_strength` ≤ 0.05 (good ending trigger). */
export const WOLF_HUNT_ARC_COMPLETE_TRIGGER_FLAG = "wolfHunt.arc_complete_trigger";

/** Set true when the player lets `crucible.release_pressure` ≥ 0.95 (bad ending trigger). */
export const WOLF_HUNT_ARC_FAILURE_TRIGGER_FLAG = "wolfHunt.arc_failure_trigger";
