import type { HeroTarget } from "../../types/HeroTarget";

export const SERGEANT_KESTREL_DRILL_VARKUL: HeroTarget = {
  "id": "sergeant_kestrel_drill_varkul",
  "name": "Sergeant Kestrel Drill",
  "classKey": "soldier",
  "corruptorLord": "varkul",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "flag_authority",
      "category": "soldier",
      "severity": 2
    },
    {
      "id": "uniform_disregard",
      "category": "soldier",
      "severity": 1
    },
    {
      "id": "garrison_recall",
      "category": "soldier",
      "severity": 1
    },
    {
      "id": "unmaking_command",
      "category": "soldier",
      "severity": 3
    }
  ],
  "tells": [
    "Plants a standard the cohort regroups around.",
    "Bleeds chairman-black when struck."
  ],
  "lairLocation": "antechamber",
  "briefingHints": [
    "Sergeant Kestrel Drill served the League as a ranking officer in the League's standing line before the Blood Lord invited them into the Cathedral as visitor and they stayed.",
    "Varkul the Blood Lord now uses him to drive a substantive operation against League material."
  ]
};
