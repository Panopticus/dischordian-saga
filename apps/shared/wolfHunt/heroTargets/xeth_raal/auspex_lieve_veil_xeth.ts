import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_LIEVE_VEIL_XETH: HeroTarget = {
  "id": "auspex_lieve_veil_xeth",
  "name": "Auspex Lieve Veil",
  "classKey": "oracle",
  "corruptorLord": "xeth_raal",
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
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Auspex Lieve Veil served the League as a auspice keeper on the Witness Council before the Ledger Keeper opened a contract clause they did not read aloud.",
    "Xeth'Raal the Ledger Keeper now uses her to scout the threshold rooms."
  ]
};
