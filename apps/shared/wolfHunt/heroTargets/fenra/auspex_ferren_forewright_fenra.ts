import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_FERREN_FOREWRIGHT_FENRA: HeroTarget = {
  "id": "auspex_ferren_forewright_fenra",
  "name": "Auspex Ferren Forewright",
  "classKey": "oracle",
  "corruptorLord": "fenra",
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
    "Auspex Ferren Forewright served the League as a auspice keeper on the Witness Council before the Moon Tyrant charted them from the inside.",
    "Fenra the Moon Tyrant now uses her to scout the threshold rooms."
  ]
};
