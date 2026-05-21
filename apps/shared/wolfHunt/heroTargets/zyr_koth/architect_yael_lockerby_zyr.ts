import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_YAEL_LOCKERBY_ZYR: HeroTarget = {
  "id": "architect_yael_lockerby_zyr",
  "name": "Architect Yael Lockerby",
  "classKey": "engineer",
  "corruptorLord": "zyr_koth",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "principal_machinery",
      "category": "engineer",
      "severity": 3
    },
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
    }
  ],
  "tells": [
    "Carries tools signed by the lord and by her in the same hand."
  ],
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Architect Yael Lockerby served the League as a field engineer in the League's frontier-design corps before the Flayer revised them — third iteration is the operational one.",
    "Zyr'Koth the Flayer now uses her to drive a substantive operation against League material."
  ]
};
