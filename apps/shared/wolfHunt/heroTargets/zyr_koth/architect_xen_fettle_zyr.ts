import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_XEN_FETTLE_ZYR: HeroTarget = {
  "id": "architect_xen_fettle_zyr",
  "name": "Architect Xen Fettle",
  "classKey": "engineer",
  "corruptorLord": "zyr_koth",
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
    "Architect Xen Fettle served the League as a field engineer in the League's frontier-design corps before the Flayer revised them — third iteration is the operational one.",
    "Zyr'Koth the Flayer now uses her to hold a cell of the Crucible's lattice."
  ]
};
