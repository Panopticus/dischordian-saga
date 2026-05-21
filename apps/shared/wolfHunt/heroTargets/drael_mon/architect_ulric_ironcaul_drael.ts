import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_ULRIC_IRONCAUL_DRAEL: HeroTarget = {
  "id": "architect_ulric_ironcaul_drael",
  "name": "Architect Ulric Ironcaul",
  "classKey": "engineer",
  "corruptorLord": "drael_mon",
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
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Architect Ulric Ironcaul served the League as a field engineer in the League's frontier-design corps before the Harvester paid them, in advance, for the souls they had not yet brought him.",
    "Drael'Mon the Harvester now uses her to hold a cell of the Crucible's lattice."
  ]
};
