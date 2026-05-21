import type { HeroTarget } from "../../types/HeroTarget";

export const LISTENER_REN_POSTMASTER_DRAEL: HeroTarget = {
  "id": "listener_ren_postmaster_drael",
  "name": "Listener Ren Postmaster",
  "classKey": "spy",
  "corruptorLord": "drael_mon",
  "threatTier": 4,
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
      "id": "whisper_inheritance",
      "category": "spy",
      "severity": 3
    },
    {
      "id": "thaloria_dialect",
      "category": "spy",
      "severity": 3
    },
    {
      "id": "patient_subversion",
      "category": "spy",
      "severity": 2
    }
  ],
  "tells": [
    "Repeats the last sentence the hunter spoke before he committed to it."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Listener Ren Postmaster served the League as a long-listen officer in the League's counter-intelligence before the Harvester paid them, in advance, for the souls they had not yet brought him.",
    "Drael'Mon the Harvester now uses him to anchor a load-bearing column of the corruption."
  ]
};
