import type { HeroTarget } from "../../types/HeroTarget";

export const LIEUTENANT_ISOLDE_GARDENER_OF_LINES_VARKUL: HeroTarget = {
  "id": "lieutenant_isolde_gardener_of_lines_varkul",
  "name": "Lieutenant Isolde Gardener-of-Lines",
  "classKey": "soldier",
  "corruptorLord": "varkul",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "garrison_recall",
      "category": "soldier",
      "severity": 1
    },
    {
      "id": "executive_charge",
      "category": "soldier",
      "severity": 2
    },
    {
      "id": "iron_quartermaster",
      "category": "soldier",
      "severity": 2
    }
  ],
  "tells": [
    "Reorders his guard formation mid-fight — the formation is the attack.",
    "Refuses to retreat from a structured engagement.",
    "Plants a standard the cohort regroups around."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Lieutenant Isolde Gardener-of-Lines served the League as a ranking officer in the League's standing line before the Blood Lord invited them into the Cathedral as visitor and they stayed.",
    "Varkul the Blood Lord now uses him to scout the threshold rooms."
  ]
};
