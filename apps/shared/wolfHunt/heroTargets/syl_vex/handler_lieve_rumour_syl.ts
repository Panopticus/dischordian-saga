import type { HeroTarget } from "../../types/HeroTarget";

export const HANDLER_LIEVE_RUMOUR_SYL: HeroTarget = {
  "id": "handler_lieve_rumour_syl",
  "name": "Handler Lieve Rumour",
  "classKey": "spy",
  "corruptorLord": "syl_vex",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "rumor_seed",
      "category": "spy",
      "severity": 1
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
    }
  ],
  "tells": [
    "Has been listening since before the hunter arrived.",
    "Speaks the Shadow Tongue when uncorrupted listeners are present.",
    "Argues the hunter into his opposite without raising the voice."
  ],
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Handler Lieve Rumour served the League as a long-listen officer in the League's counter-intelligence before the Corruptor wove a cobalt thread into their decision-making.",
    "Syl'Vex the Corruptor now uses him to scout the threshold rooms."
  ]
};
