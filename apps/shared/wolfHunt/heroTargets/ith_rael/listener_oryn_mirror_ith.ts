import type { HeroTarget } from "../../types/HeroTarget";

export const LISTENER_ORYN_MIRROR_ITH: HeroTarget = {
  "id": "listener_oryn_mirror_ith",
  "name": "Listener Oryn Mirror",
  "classKey": "spy",
  "corruptorLord": "ith_rael",
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
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Listener Oryn Mirror served the League as a long-listen officer in the League's counter-intelligence before the Whisperer turned them across a window of decades.",
    "Ith'Rael the Whisperer now uses him to hold a cell of the Crucible's lattice."
  ]
};
