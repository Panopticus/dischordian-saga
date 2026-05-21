import type { HeroTarget } from "../../types/HeroTarget";

export const HANDLER_ORLA_SIDE_DOOR_DRAEL: HeroTarget = {
  "id": "handler_orla_side_door_drael",
  "name": "Handler Orla Side-Door",
  "classKey": "spy",
  "corruptorLord": "drael_mon",
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
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Handler Orla Side-Door served the League as a long-listen officer in the League's counter-intelligence before the Harvester paid them, in advance, for the souls they had not yet brought him.",
    "Drael'Mon the Harvester now uses him to hold a cell of the Crucible's lattice."
  ]
};
