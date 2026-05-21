import type { HeroTarget } from "../../types/HeroTarget";

export const SERGEANT_JUREL_IRONSIDE_SYL: HeroTarget = {
  "id": "sergeant_jurel_ironside_syl",
  "name": "Sergeant Jurel Ironside",
  "classKey": "soldier",
  "corruptorLord": "syl_vex",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "reorganization_doctrine",
      "category": "soldier",
      "severity": 3
    },
    {
      "id": "attritional_will",
      "category": "soldier",
      "severity": 2
    },
    {
      "id": "flag_authority",
      "category": "soldier",
      "severity": 2
    },
    {
      "id": "uniform_disregard",
      "category": "soldier",
      "severity": 1
    }
  ],
  "tells": [
    "Calls a reserve unit on a delayed cadence."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Sergeant Jurel Ironside served the League as a ranking officer in the League's standing line before the Corruptor wove a cobalt thread into their decision-making.",
    "Syl'Vex the Corruptor now uses him to drive a substantive operation against League material."
  ]
};
