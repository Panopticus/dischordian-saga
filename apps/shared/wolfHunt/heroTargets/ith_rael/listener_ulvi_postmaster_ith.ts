import type { HeroTarget } from "../../types/HeroTarget";

export const LISTENER_ULVI_POSTMASTER_ITH: HeroTarget = {
  "id": "listener_ulvi_postmaster_ith",
  "name": "Listener Ulvi Postmaster",
  "classKey": "spy",
  "corruptorLord": "ith_rael",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
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
    },
    {
      "id": "shadow_tongue_handle",
      "category": "spy",
      "severity": 2
    },
    {
      "id": "cobalt_conversion",
      "category": "spy",
      "severity": 3
    }
  ],
  "tells": [
    "Repeats the last sentence the hunter spoke before he committed to it."
  ],
  "lairLocation": "rylloh_galleries",
  "briefingHints": [
    "Listener Ulvi Postmaster served the League as a long-listen officer in the League's counter-intelligence before the Whisperer turned them across a window of decades.",
    "Ith'Rael the Whisperer now uses him to anchor a load-bearing column of the corruption."
  ]
};
