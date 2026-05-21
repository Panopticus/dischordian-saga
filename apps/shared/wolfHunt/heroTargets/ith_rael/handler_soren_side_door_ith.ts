import type { HeroTarget } from "../../types/HeroTarget";

export const HANDLER_SOREN_SIDE_DOOR_ITH: HeroTarget = {
  "id": "handler_soren_side_door_ith",
  "name": "Handler Soren Side-Door",
  "classKey": "spy",
  "corruptorLord": "ith_rael",
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
  "lairLocation": "antechamber",
  "briefingHints": [
    "Handler Soren Side-Door served the League as a long-listen officer in the League's counter-intelligence before the Whisperer turned them across a window of decades.",
    "Ith'Rael the Whisperer now uses him to hold a cell of the Crucible's lattice."
  ]
};
