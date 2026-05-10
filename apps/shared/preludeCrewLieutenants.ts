/* ═══════════════════════════════════════════════════════
   PRELUDE CREW LIEUTENANTS — returning crew as Act 5 leads

   Patch (DeMagi engineer), Zephyr-9 (Quarchon fragment), and
   Little One (Ne-Yon child) led the three Prelude crew
   missions and then disappeared. Iron Lion has been a
   Loredex broadcast, and Locke has been an inbox handler.

   This module reframes the FIRST FIVE army recruitment
   missions as patron-led missions, with each lieutenant
   returning to lead one. The mapping is annotational — it
   does NOT modify the existing armyRecruitment data tree.
   The /army-management page reads it at render time and
   renders a small "Led by" patron card next to each mission.

   By the time a player begins recruiting in earnest (Act 5),
   they have already met all five patrons:

     - Patch       — Crew Mission 1
     - Zephyr-9    — Crew Mission 2 + chess depth tutor
     - Little One  — Crew Mission 3 (burnt-card carrier)
     - Iron Lion   — Cycle B opponent + Loredex broadcast
     - Locke       — Beat H Inbox + 5 inter-act bridges

   So none of these are stranger-introductions. The mission
   board reads as old friends asking for help.

   Pure module. No React, no server.
   ═══════════════════════════════════════════════════════ */

export type LieutenantId =
  | "patch"
  | "zephyr_9"
  | "little_one"
  | "iron_lion"
  | "adjudicator_locke";

export interface MissionLieutenant {
  id: LieutenantId;
  /** Display name for the patron card. */
  displayName: string;
  /** Where the player first met this lieutenant — surfaces in the
   *  patron card subtitle so the meeting feels remembered. */
  firstMet: string;
  /** One-line briefing in the lieutenant's voice. Renders inside
   *  the patron card. */
  patronBriefing: string;
  /** What this mission is, in fiction, from the lieutenant's view. */
  missionFraming: string;
  /** Color accent for the patron card (matches existing UI palette). */
  accent: "rose" | "cyan" | "violet" | "red" | "amber";
}

const PATCH: MissionLieutenant = {
  id: "patch",
  displayName: "Patch",
  firstMet: "Crew Mission 1 — The Wreck Next Door",
  patronBriefing:
    "Captain. The wreck next door wasn't as dead as we thought, was it. I got pulled out of cryo three weeks ago and I have been thinking about that wreck for two of those weeks. There are still names in the manifest we did not check. I want to go back. Will you come.",
  missionFraming:
    "Return to a wreck the Prelude crew left half-read. Patch knows which name was the wrong name to skip.",
  accent: "rose",
};

const ZEPHYR_9: MissionLieutenant = {
  id: "zephyr_9",
  displayName: "Zephyr-9",
  firstMet: "Crew Mission 2 — The Signal from Nowhere · Chess depth-1 tutor",
  patronBriefing:
    "Hello, friend. I have been listening to the Quarchon's other fragment for one hundred and forty-seven cycles. It sings the second half of what I sing. I am asking you to help me find it. I am asking nicely. The fragment will not be returned by force.",
  missionFraming:
    "Find the second half of Zephyr-9's split signal. The first half was Crew Mission 2; the second half wants to come home.",
  accent: "cyan",
};

const LITTLE_ONE: MissionLieutenant = {
  id: "little_one",
  displayName: "Little One",
  firstMet: "Crew Mission 3 — The Burnt Card",
  patronBriefing:
    "Hello again. I have another card. The Seer's deck has more than the one I burned. I think we should burn another. I think the picture inside is the one we are about to need. Will you let me show you.",
  missionFraming:
    "Burn one more card from the Seer's deck. Little One is small but the deck respects her hands. The card that surfaces will be the next one the player needs.",
  accent: "violet",
};

const IRON_LION: MissionLieutenant = {
  id: "iron_lion",
  displayName: "Iron Lion",
  firstMet: "Act 1 Cycle B (young) · Veridian VI broadcast",
  patronBriefing:
    "I printed three thousand posters. Three thousand reached destinations. There is one more. The 3001st. I have been printing it for eleven thousand years. I would like someone to pick it up before the press goes silent. The press is going silent.",
  missionFraming:
    "Recover the 3001st poster from the press room on Veridian VI. The Cades M7 placeholder cinematic completes when the poster is in your hand.",
  accent: "red",
};

const ADJUDICATOR_LOCKE: MissionLieutenant = {
  id: "adjudicator_locke",
  displayName: "Adjudicator Locke",
  firstMet: "Beat H Inbox · five inter-act bridges",
  patronBriefing:
    "I have been reading you. I am ready to send you on a real run. The Kelvara wreck is finally safe — the Hierarchy patrol left the lane on Tuesday. The bond is mine to hold. The work is yours to do. The version of you who picks this up will not be the version who finishes it. That is correct.",
  missionFraming:
    "Run a real Trade Empire route — the Kelvara wreck Locke offered at Beat D, now finally safe to travel.",
  accent: "amber",
};

/**
 * The five canonical Act-5 lieutenant assignments. The mapping is
 * stable; the mission ids match the existing armyRecruitment tree
 * at apps/client/src/data/armyRecruitment.ts. Intentionally pinned
 * to the first-encounter missions of each sector so the patrons
 * surface as soon as the player starts recruiting in earnest.
 */
export const MISSION_LIEUTENANT_BY_ID: Readonly<Record<string, MissionLieutenant>> = {
  "mission-1-1": PATCH,
  "mission-1-2": ZEPHYR_9,
  "mission-1-3": LITTLE_ONE,
  "mission-1-4": IRON_LION,
  "mission-2-1": ADJUDICATOR_LOCKE,
};

export function getMissionLieutenant(
  missionId: string,
): MissionLieutenant | undefined {
  return MISSION_LIEUTENANT_BY_ID[missionId];
}

export const ALL_LIEUTENANTS: ReadonlyArray<MissionLieutenant> = [
  PATCH,
  ZEPHYR_9,
  LITTLE_ONE,
  IRON_LION,
  ADJUDICATOR_LOCKE,
];

/** True once the player has cleared all five lieutenant-led missions —
 *  used by the Convergence Seat goodbye walk to know the lieutenant
 *  chairs are ready. */
export function allLieutenantMissionsComplete(
  completedMissionIds: ReadonlyArray<string>,
): boolean {
  const set = new Set(completedMissionIds);
  return Object.keys(MISSION_LIEUTENANT_BY_ID).every((id) => set.has(id));
}
