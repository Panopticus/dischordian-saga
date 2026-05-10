/* ═══════════════════════════════════════════════════════
   CAMPAIGN OBJECTIVES — wayfinding fallback

   The campaign's primary wayfinding is diegetic — Locke's
   inbox bridges (lockeInboxBridges.ts), the Antiquarian's
   Loredex pages (antiquarianLoredexBridges.ts), and the
   Mobile Narrator banter at every page.

   This module is the FALLBACK: a flat list of "what to do
   right now" objectives, derived from narrativeAct and the
   narrative-flag set, so a player who turned off ambient
   surfaces (or who has been away for a week) still has a
   single source of truth on the current beat. Renders into
   the CampaignObjectiveTracker overlay in App.tsx.

   The objectives are derived, not stored — they are pure
   functions of narrativeAct + flags + recruitmentCount.

   Pure module. No React.
   ═══════════════════════════════════════════════════════ */

import { RECRUITMENT_THRESHOLDS } from "./armyRecruitment";

export type ObjectiveStatus = "active" | "completed" | "blocked";

export interface CampaignObjective {
  /** Stable id used for keys + analytics. */
  id: string;
  /** Top-line label (e.g. "Cycle A: defeat Minnie, Corey, Kanshi Sha"). */
  label: string;
  /** One-line hint of the diegetic surface that ALSO carries this objective. */
  diegeticHint: string;
  /** Path to navigate to (used by the tracker's "go" button). */
  route?: string;
  status: ObjectiveStatus;
}

export interface CampaignObjectiveInput {
  narrativeAct: number;
  narrativeFlags: Record<string, boolean | undefined>;
  recruitmentMissionsCompleted: number;
  preludeComplete: boolean;
}

/**
 * Returns the player's current campaign objectives, ordered with the
 * most-immediate first. Returns an empty array if the player has
 * completed all 7 acts (post-prestige).
 */
export function deriveCampaignObjectives(
  input: CampaignObjectiveInput,
): CampaignObjective[] {
  const { narrativeAct, narrativeFlags: f, recruitmentMissionsCompleted, preludeComplete } = input;
  const out: CampaignObjective[] = [];

  // Prelude — narrativeAct 0
  if (narrativeAct === 0) {
    if (!preludeComplete) {
      out.push({
        id: "prelude_in_progress",
        label: "Wake up the Ark.",
        diegeticHint:
          "Elara is walking you through it. Follow her voice. Three crew missions wait at the Bridge.",
        route: "/prelude",
        status: "active",
      });
    } else {
      out.push({
        id: "prelude_to_act_1",
        label: "The Tribunal awaits.",
        diegeticHint:
          "Take the Bridge's Play Dischordia button when ready. Cycle A is three battles, Cycle B is five, Cycle C is the Authority Trial.",
        route: "/dashboard",
        status: "active",
      });
    }
    return out;
  }

  // Act 1 — Tribunal
  if (narrativeAct === 1) {
    if (!f.act_1_complete) {
      out.push({
        id: "act_1_tribunal",
        label: "Win the Tribunal (12 battles).",
        diegeticHint:
          "Three cycles. Cycle B's final battle will trigger the Mechronis video. Cycle C ends in the Last Words choice — Light or Dark.",
        route: "/act1-card-ladder",
        status: "active",
      });
    }
    return out;
  }

  // Act 2 — Forged Hand
  if (narrativeAct === 2) {
    if (!f.act_2_complete) {
      out.push({
        id: "act_2_forged_hand",
        label: "Master four disciplines.",
        diegeticHint:
          "Engineering bench (3 crafts), Chess Climb (5 wins), Collector's Arena (3 wins), Game Master (lose on purpose). The Antiquarian's Loredex bridge entry will land when you finish.",
        route: "/dashboard",
        status: "active",
      });
    }
    return out;
  }

  // Act 3 — Offer / path lock
  if (narrativeAct === 3) {
    if (!f.act_3_complete) {
      out.push({
        id: "act_3_substrate_ladder",
        label: "Run the Substrate Ladder (3 battles + path lock).",
        diegeticHint:
          "Three battles narrated by The Human. Path lock follows: Disclosure / Pragmatic / Full Secret. Locke will be watching.",
        route: "/act3-card-ladder",
        status: "active",
      });
    }
    return out;
  }

  // Act 4 — Revelation
  if (narrativeAct === 4) {
    if (!f.act_4_complete) {
      const anyChapter =
        f.act4_prisoner_cell_complete ||
        f.act4_prisoner_extraction_complete ||
        f.act4_prisoner_warlord_complete ||
        f.act4_prisoner_oracle_complete;
      out.push({
        id: "act_4_revelation",
        label: anyChapter
          ? "Close out the Revelation cycle."
          : "Pick one prisoner chapter (just one).",
        diegeticHint:
          "Cell, Extraction, Warlord Rematch, or White Oracle. Pick whichever feels true. The other three will keep. Human Reveal video plays at completion.",
        route: "/collectors-arena",
        status: "active",
      });
    }
    return out;
  }

  // Act 5 — Reckoning
  if (narrativeAct === 5) {
    const recruitGate = RECRUITMENT_THRESHOLDS.act6;
    if (recruitmentMissionsCompleted < recruitGate) {
      out.push({
        id: "act_5_recruitment",
        label: `Recruit ${recruitGate - recruitmentMissionsCompleted} more (need ${recruitGate} total for Act 6).`,
        diegeticHint:
          "Patch / Zephyr-9 / Little One have returned as your lieutenants. Three of the missions are theirs. The fourth is Iron Lion's last broadcast — Cades M7. The fifth is Locke's Kelvara wreck.",
        route: "/army-management",
        status: "active",
      });
    }
    if (!f.cades_m7_complete) {
      out.push({
        id: "act_5_cades_m7",
        label: "Hear Iron Lion before he goes.",
        diegeticHint:
          "Tune the Comms Array to the third-class Mechronis frequency. Recover the 3001st poster.",
        route: "/comms-array",
        status: "active",
      });
    }
    return out;
  }

  // Act 6 — Confession
  if (narrativeAct === 6) {
    if (!f.act_6_complete) {
      out.push({
        id: "act_6_confession",
        label: "Hear the two confessions.",
        diegeticHint:
          "The Antiquarian opens the Confession Hall. Elara and The Human lay down what they have been carrying.",
        route: "/act6-ladder",
        status: "active",
      });
    }
    return out;
  }

  // Act 7 — Convergence
  if (narrativeAct === 7) {
    const recruitGate = RECRUITMENT_THRESHOLDS.act7;
    if (recruitmentMissionsCompleted < recruitGate) {
      out.push({
        id: "act_7_final_recruitment",
        label: `Recruit ${recruitGate - recruitmentMissionsCompleted} more (need ${recruitGate} total for Convergence).`,
        diegeticHint:
          "The Antiquarian writes the final entries in real time. The Diplomacy Table is filling up.",
        route: "/army-management",
        status: "active",
      });
    } else if (!f.act_7_complete) {
      out.push({
        id: "act_7_convergence_seat",
        label: "Take the Convergence Seat.",
        diegeticHint:
          "Walk the Diplomacy Table once before you sit. Every NPC you have met will speak. Then pick a stance.",
        route: "/act7-card-ladder",
        status: "active",
      });
    }
    return out;
  }

  return out;
}
