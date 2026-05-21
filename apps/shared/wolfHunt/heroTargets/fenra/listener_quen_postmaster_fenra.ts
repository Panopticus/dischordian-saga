import type { HeroTarget } from "../../types/HeroTarget";

export const LISTENER_QUEN_POSTMASTER_FENRA: HeroTarget = {
  "id": "listener_quen_postmaster_fenra",
  "name": "Listener Quen Postmaster",
  "classKey": "spy",
  "corruptorLord": "fenra",
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
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Listener Quen Postmaster served the League as a long-listen officer in the League's counter-intelligence before the Moon Tyrant charted them from the inside.",
    "Fenra the Moon Tyrant now uses him to anchor a load-bearing column of the corruption."
  ]
};
