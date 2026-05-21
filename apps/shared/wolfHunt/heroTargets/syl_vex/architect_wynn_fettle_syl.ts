import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_WYNN_FETTLE_SYL: HeroTarget = {
  "id": "architect_wynn_fettle_syl",
  "name": "Architect Wynn Fettle",
  "classKey": "engineer",
  "corruptorLord": "syl_vex",
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
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Architect Wynn Fettle served the League as a field engineer in the League's frontier-design corps before the Corruptor wove a cobalt thread into their decision-making.",
    "Syl'Vex the Corruptor now uses her to hold a cell of the Crucible's lattice."
  ]
};
