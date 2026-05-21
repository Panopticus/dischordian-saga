import type { HeroTarget } from "../../types/HeroTarget";

export const HANDLER_QUILL_LETTER_SYL: HeroTarget = {
  "id": "handler_quill_letter_syl",
  "name": "Handler Quill Letter",
  "classKey": "spy",
  "corruptorLord": "syl_vex",
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
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Handler Quill Letter served the League as a long-listen officer in the League's counter-intelligence before the Corruptor wove a cobalt thread into their decision-making.",
    "Syl'Vex the Corruptor now uses him to hold a cell of the Crucible's lattice."
  ]
};
