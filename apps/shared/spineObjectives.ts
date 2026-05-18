/* ═══════════════════════════════════════════════════════
   SPINE OBJECTIVES — the open-but-guided wing layer

   deriveCampaignObjectives (campaignObjectives.ts) owns the
   MANDATORY trunk — the single "do this now" per act. That
   contract is unchanged and its tests still pin it.

   This module adds the OPEN-BUT-GUIDED layer: as the universe
   widens, every system the narrative spine has already revealed
   (apps/shared/narrativeSpine.ts) is offered as an available
   destination, voiced by the in-fiction carrier that reveals it.
   It also fills the post-Act-7 blank — deriveCampaignObjectives
   returns [] there; the living universe does not stop, so the
   composed entry point keeps surfacing the open wings + the
   continuing-loop pointer.

   deriveObjectives() is the composed entry point the tracker
   consumes: trunk first (so the mandatory beat stays primary
   mid-campaign), then the spine wings.

   Pure module. No React.
   ═══════════════════════════════════════════════════════ */

import {
  deriveCampaignObjectives,
  type CampaignObjective,
  type CampaignObjectiveInput,
} from "./campaignObjectives";
import { getGameModePremise } from "./gameModeNarrativePremises";
import { getSurfaceRouteForPremise } from "./surfaceDiscoverabilityCanon";
import {
  NARRATIVE_SPINE,
  actForBeat,
  type SpineCarrier,
} from "./narrativeSpine";

/** The in-fiction source tag shown so the player knows who is speaking. */
const CARRIER_TAG: Record<SpineCarrier, string> = {
  elara_prelude: "Elara",
  locke: "Locke's inbox",
  antiquarian: "The Antiquarian's Loredex",
  companion: "A companion",
  cutscene: "A cutscene",
};

/**
 * Every spine WING the universe has already opened for this player
 * (its act has been reached), as available, diegetically-voiced
 * destinations. Trunk beats are excluded — those are the mandatory
 * path deriveCampaignObjectives already owns.
 */
export function deriveSpineWingObjectives(
  input: CampaignObjectiveInput,
): CampaignObjective[] {
  return [...NARRATIVE_SPINE]
    .filter((b) => b.spineRole === "wing")
    .filter((b) => actForBeat(b) <= input.narrativeAct)
    .sort((a, b) => a.sagaPhase - b.sagaPhase)
    .map((b) => {
      const m = getGameModePremise(b.revealsPremiseId);
      return {
        id: `spine_wing_${b.revealsPremiseId}`,
        label: `${m?.name ?? b.revealsPremiseId} has opened.`,
        diegeticHint: `${CARRIER_TAG[b.carrier]}: ${b.diegeticReveal}`,
        route: getSurfaceRouteForPremise(b.revealsPremiseId),
        status: "active" as const,
      };
    });
}

/**
 * Composed wayfinding: the mandatory trunk first (unchanged), then
 * the open-but-guided wings. Post-Act-7 the trunk is empty — the
 * universe is still alive, so we lead with the continuing-loop
 * pointer and keep the opened wings available rather than going
 * blank (the BioWare "the world keeps turning" endgame).
 */
export function deriveObjectives(
  input: CampaignObjectiveInput,
): CampaignObjective[] {
  const trunk = deriveCampaignObjectives(input);
  const wings = deriveSpineWingObjectives(input);

  const postAct7 = Boolean(input.narrativeFlags.act_7_complete);
  const head: CampaignObjective[] = [];
  if (postAct7) {
    head.push({
      id: "endgame_continuing_loop",
      label: "The cycle continues.",
      diegeticHint:
        "The Antiquarian keeps writing. Governance votes, fights, and " +
        "the per-cycle chronicle carry the universe past the ending — " +
        "the saga does not close, it turns.",
      route: getSurfaceRouteForPremise("governance_hub"),
      status: "active",
    });
  }

  const seen = new Set<string>();
  return [...head, ...trunk, ...wings].filter((o) => {
    if (seen.has(o.id)) return false;
    seen.add(o.id);
    return true;
  });
}
