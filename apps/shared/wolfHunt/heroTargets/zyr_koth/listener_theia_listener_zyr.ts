import type { HeroTarget } from "../../types/HeroTarget";

export const LISTENER_THEIA_LISTENER_ZYR: HeroTarget = {
  "id": "listener_theia_listener_zyr",
  "name": "Listener Theia Listener",
  "classKey": "spy",
  "corruptorLord": "zyr_koth",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
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
    }
  ],
  "tells": [
    "Repeats the last sentence the hunter spoke before he committed to it."
  ],
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Listener Theia Listener served the League as a long-listen officer in the League's counter-intelligence before the Flayer revised them — third iteration is the operational one.",
    "Zyr'Koth the Flayer now uses him to anchor a load-bearing column of the corruption."
  ]
};
