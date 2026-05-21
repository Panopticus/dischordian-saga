import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_ARIC_FETTLE_XETH: HeroTarget = {
  "id": "architect_aric_fettle_xeth",
  "name": "Architect Aric Fettle",
  "classKey": "engineer",
  "corruptorLord": "xeth_raal",
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
    "Architect Aric Fettle served the League as a field engineer in the League's frontier-design corps before the Ledger Keeper opened a contract clause they did not read aloud.",
    "Xeth'Raal the Ledger Keeper now uses her to hold a cell of the Crucible's lattice."
  ]
};
