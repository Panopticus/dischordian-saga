import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_SAITH_QUILL_MARK_FENRA: HeroTarget = {
  "id": "architect_saith_quill_mark_fenra",
  "name": "Architect Saith Quill-Mark",
  "classKey": "engineer",
  "corruptorLord": "fenra",
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
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Architect Saith Quill-Mark served the League as a field engineer in the League's frontier-design corps before the Moon Tyrant charted them from the inside.",
    "Fenra the Moon Tyrant now uses her to drive a substantive operation against League material."
  ]
};
