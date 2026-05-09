/* ═══════════════════════════════════════════════════════
   PERSONAL-QUEST SUB-TASKS — shared type + validators

   Sub-tasks gate stage advance on top of the bond / encounter
   threshold. Authored on each stage in apprenticeIdentity.ts
   (apprentices) and npcIdentity.ts (named NPCs).

   Five sub-task kinds:
     loredex_read           — player has opened a specific entry
     mission_tag_complete   — player has resolved a mission carrying
                              a specific tag (faction:* / theme:* /
                              era:* / danger:*)
     gift_given             — player has gifted a specific item to
                              the subject
     dialogue_topic_played  — player has played a specific topic at
                              least once (any path)
     commons_scene_witnessed— player has watched a specific commons
                              scene play to its conclusion

   The validators live in apps/server/services/apprenticeQuestSubtaskService.ts
   and read each kind off existing tables (no per-subtask storage).

   Authoring: every stage in a tier-2 NPC chain or apprentice chain
   must declare ≥3 sub-tasks; tier-3 cosmic single-encounter stages
   declare ≥4. The ship-check parity entries enforce this.
   ═══════════════════════════════════════════════════════ */

export type PersonalQuestSubtaskKind =
  | "loredex_read"
  | "mission_tag_complete"
  | "gift_given"
  | "dialogue_topic_played"
  | "commons_scene_witnessed";

export interface PersonalQuestSubtaskRef {
  /** Stable id, unique within the stage. */
  id: string;
  type: PersonalQuestSubtaskKind;
  /** What the validator looks up. Shape depends on `type`:
   *   loredex_read           → loredex entryId
   *   mission_tag_complete   → "faction:coda" | "theme:calibration" | …
   *   gift_given             → gift catalog itemId
   *   dialogue_topic_played  → topic id ("the_seer_past")
   *   commons_scene_witnessed→ commons sceneId
   */
  targetId: string;
  /** Player-facing label rendered in the PersonalQuestPanel. Should
   *  be self-contained — the player should not need to read prior
   *  stages to understand what to do. */
  label: string;
}

/** True if the targetId is shaped like a recognised mission tag. */
export function isMissionTag(target: string): boolean {
  return (
    target.startsWith("faction:") ||
    target.startsWith("theme:") ||
    target.startsWith("era:") ||
    target.startsWith("danger:")
  );
}
