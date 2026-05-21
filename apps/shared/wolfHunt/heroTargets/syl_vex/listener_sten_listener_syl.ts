import type { HeroTarget } from "../../types/HeroTarget";

export const LISTENER_STEN_LISTENER_SYL: HeroTarget = {
  "id": "listener_sten_listener_syl",
  "name": "Listener Sten Listener",
  "classKey": "spy",
  "corruptorLord": "syl_vex",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "cobalt_conversion",
      "category": "spy",
      "severity": 3
    },
    {
      "id": "mirror_argument",
      "category": "spy",
      "severity": 3
    },
    {
      "id": "consent_extraction",
      "category": "spy",
      "severity": 2
    },
    {
      "id": "long_listen",
      "category": "spy",
      "severity": 2
    },
    {
      "id": "named_signal",
      "category": "spy",
      "severity": 1
    }
  ],
  "tells": [
    "Repeats the last sentence the hunter spoke before he committed to it."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Listener Sten Listener served the League as a long-listen officer in the League's counter-intelligence before the Corruptor wove a cobalt thread into their decision-making.",
    "Syl'Vex the Corruptor now uses him to anchor a load-bearing column of the corruption."
  ]
};
