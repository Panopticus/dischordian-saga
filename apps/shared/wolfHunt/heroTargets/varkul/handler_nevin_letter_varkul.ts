import type { HeroTarget } from "../../types/HeroTarget";

export const HANDLER_NEVIN_LETTER_VARKUL: HeroTarget = {
  "id": "handler_nevin_letter_varkul",
  "name": "Handler Nevin Letter",
  "classKey": "spy",
  "corruptorLord": "varkul",
  "threatTier": 2,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "named_signal",
      "category": "spy",
      "severity": 1
    },
    {
      "id": "rumor_seed",
      "category": "spy",
      "severity": 1
    },
    {
      "id": "patient_subversion",
      "category": "spy",
      "severity": 2
    },
    {
      "id": "shadow_tongue_handle",
      "category": "spy",
      "severity": 2
    }
  ],
  "tells": [
    "Carries a cobalt thread visible only when she laughs.",
    "Extracts agreement under reasonable framing."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Handler Nevin Letter served the League as a long-listen officer in the League's counter-intelligence before the Blood Lord invited them into the Cathedral as visitor and they stayed.",
    "Varkul the Blood Lord now uses him to hold a cell of the Crucible's lattice."
  ]
};
