import type { HeroTarget } from "../../types/HeroTarget";

export const AUSPEX_FERREN_VEIL_MOL: HeroTarget = {
  "id": "auspex_ferren_veil_mol",
  "name": "Auspex Ferren Veil",
  "classKey": "oracle",
  "corruptorLord": "mol_garath",
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
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Auspex Ferren Veil served the League as a auspice keeper on the Witness Council before the Unmaker pulled rank on the chain of command they had once trusted.",
    "Mol'Garath the Unmaker now uses her to scout the threshold rooms."
  ]
};
