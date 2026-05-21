import type { HeroTarget } from "../../types/HeroTarget";

export const HANDLER_ONEK_SMOKE_SYL: HeroTarget = {
  "id": "handler_onek_smoke_syl",
  "name": "Handler Onek Smoke",
  "classKey": "spy",
  "corruptorLord": "syl_vex",
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
    "Knows the hunter's name in a register he has not used since boyhood.",
    "Plants a false rumour that returns as accepted truth.",
    "Carries a cobalt thread visible only when she laughs."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Handler Onek Smoke served the League as a long-listen officer in the League's counter-intelligence before the Corruptor wove a cobalt thread into their decision-making.",
    "Syl'Vex the Corruptor now uses him to anchor a load-bearing column of the corruption."
  ]
};
