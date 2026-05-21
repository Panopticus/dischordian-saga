import type { HeroTarget } from "../../types/HeroTarget";

export const LISTENER_MARA_FADED_SYL: HeroTarget = {
  "id": "listener_mara_faded_syl",
  "name": "Listener Mara Faded",
  "classKey": "spy",
  "corruptorLord": "syl_vex",
  "threatTier": 2,
  "isBossLieutenant": false,
  "powerSet": [
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
      "id": "consent_extraction",
      "category": "spy",
      "severity": 2
    },
    {
      "id": "long_listen",
      "category": "spy",
      "severity": 2
    }
  ],
  "tells": [
    "Speaks the Shadow Tongue when uncorrupted listeners are present."
  ],
  "lairLocation": "antechamber",
  "briefingHints": [
    "Listener Mara Faded served the League as a long-listen officer in the League's counter-intelligence before the Corruptor wove a cobalt thread into their decision-making.",
    "Syl'Vex the Corruptor now uses him to hold a cell of the Crucible's lattice."
  ]
};
