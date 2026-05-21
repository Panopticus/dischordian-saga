import type { HeroTarget } from "../../types/HeroTarget";

export const HANDLER_ORYN_SIDE_DOOR_FENRA: HeroTarget = {
  "id": "handler_oryn_side_door_fenra",
  "name": "Handler Oryn Side-Door",
  "classKey": "spy",
  "corruptorLord": "fenra",
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
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Handler Oryn Side-Door served the League as a long-listen officer in the League's counter-intelligence before the Moon Tyrant charted them from the inside.",
    "Fenra the Moon Tyrant now uses him to hold a cell of the Crucible's lattice."
  ]
};
