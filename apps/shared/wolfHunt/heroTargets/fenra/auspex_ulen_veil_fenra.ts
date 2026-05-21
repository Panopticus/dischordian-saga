import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_ULEN_VEIL_FENRA: HeroTarget = {
  "id": "auspex_ulen_veil_fenra",
  "name": "Auspex Ulen Veil",
  "classKey": "oracle",
  "corruptorLord": "fenra",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "shape_of_the_loss",
      "category": "oracle",
      "severity": 1
    },
    {
      "id": "interest_compounder",
      "category": "oracle",
      "severity": 2
    },
    {
      "id": "default_reckoning",
      "category": "oracle",
      "severity": 2
    }
  ],
  "tells": [
    "Indexes the engagement against an unseen calendar.",
    "Names every promise the hunter has made aloud.",
    "Compounds the cost of the hunter's repeated choices."
  ],
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Auspex Ulen Veil served the League as a auspice keeper on the Witness Council before the Moon Tyrant charted them from the inside.",
    "Fenra the Moon Tyrant now uses her to scout the threshold rooms."
  ]
};
