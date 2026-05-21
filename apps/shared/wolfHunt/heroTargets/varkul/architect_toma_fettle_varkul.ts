import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_TOMA_FETTLE_VARKUL: HeroTarget = {
  "id": "architect_toma_fettle_varkul",
  "name": "Architect Toma Fettle",
  "classKey": "engineer",
  "corruptorLord": "varkul",
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
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Architect Toma Fettle served the League as a field engineer in the League's frontier-design corps before the Blood Lord invited them into the Cathedral as visitor and they stayed.",
    "Varkul the Blood Lord now uses her to hold a cell of the Crucible's lattice."
  ]
};
