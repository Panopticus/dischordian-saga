import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_RYL_IRONCAUL_FENRA: HeroTarget = {
  "id": "architect_ryl_ironcaul_fenra",
  "name": "Architect Ryl Ironcaul",
  "classKey": "engineer",
  "corruptorLord": "fenra",
  "threatTier": 2,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "anniversary_recursion",
      "category": "engineer",
      "severity": 2
    },
    {
      "id": "fiduciary_lock",
      "category": "engineer",
      "severity": 2
    },
    {
      "id": "patch_propagation",
      "category": "engineer",
      "severity": 1
    },
    {
      "id": "tooling_call",
      "category": "engineer",
      "severity": 1
    }
  ],
  "tells": [
    "Refuses to commit to a tactic she has used before.",
    "Carries tools signed by the lord and by her in the same hand.",
    "Counts her revisions out loud — the second is the operational one."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Architect Ryl Ironcaul served the League as a field engineer in the League's frontier-design corps before the Moon Tyrant charted them from the inside.",
    "Fenra the Moon Tyrant now uses her to hold a cell of the Crucible's lattice."
  ]
};
