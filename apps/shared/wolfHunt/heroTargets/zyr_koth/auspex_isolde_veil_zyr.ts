import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_ISOLDE_VEIL_ZYR: HeroTarget = {
  "id": "auspex_isolde_veil_zyr",
  "name": "Auspex Isolde Veil",
  "classKey": "oracle",
  "corruptorLord": "zyr_koth",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "default_reckoning",
      "category": "oracle",
      "severity": 2
    },
    {
      "id": "lunatic_compass",
      "category": "oracle",
      "severity": 2
    },
    {
      "id": "phase_displacement",
      "category": "oracle",
      "severity": 2
    }
  ],
  "tells": [
    "Indexes the engagement against an unseen calendar.",
    "Names every promise the hunter has made aloud."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Auspex Isolde Veil served the League as a auspice keeper on the Witness Council before the Flayer revised them — third iteration is the operational one.",
    "Zyr'Koth the Flayer now uses her to scout the threshold rooms."
  ]
};
