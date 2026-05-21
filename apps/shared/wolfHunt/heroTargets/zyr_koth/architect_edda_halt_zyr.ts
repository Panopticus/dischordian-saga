import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_EDDA_HALT_ZYR: HeroTarget = {
  "id": "architect_edda_halt_zyr",
  "name": "Architect Edda Halt",
  "classKey": "engineer",
  "corruptorLord": "zyr_koth",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
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
    "Speaks to her hands as if they were a separate crew."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Architect Edda Halt served the League as a field engineer in the League's frontier-design corps before the Flayer revised them — third iteration is the operational one.",
    "Zyr'Koth the Flayer now uses her to scout the threshold rooms."
  ]
};
