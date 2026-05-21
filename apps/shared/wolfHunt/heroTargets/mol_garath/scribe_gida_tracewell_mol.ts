import type { HeroTarget } from "../../types/HeroTarget";

export const SCRIBE_GIDA_TRACEWELL_MOL: HeroTarget = {
  "id": "scribe_gida_tracewell_mol",
  "name": "Scribe Gida Tracewell",
  "classKey": "oracle",
  "corruptorLord": "mol_garath",
  "threatTier": 2,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "interest_compounder",
      "category": "oracle",
      "severity": 2
    },
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
    "Names every promise the hunter has made aloud."
  ],
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Scribe Gida Tracewell served the League as a auspice keeper on the Witness Council before the Unmaker pulled rank on the chain of command they had once trusted.",
    "Mol'Garath the Unmaker now uses her to hold a cell of the Crucible's lattice."
  ]
};
