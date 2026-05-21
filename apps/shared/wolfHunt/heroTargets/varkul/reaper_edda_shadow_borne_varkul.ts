import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_EDDA_SHADOW_BORNE_VARKUL: HeroTarget = {
  "id": "reaper_edda_shadow_borne_varkul",
  "name": "Reaper Edda Shadow-Borne",
  "classKey": "assassin",
  "corruptorLord": "varkul",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "memorial_taking",
      "category": "assassin",
      "severity": 2
    },
    {
      "id": "vampiric_economy",
      "category": "assassin",
      "severity": 2
    },
    {
      "id": "exact_quietus",
      "category": "assassin",
      "severity": 2
    }
  ],
  "tells": [
    "Carries a weapon composed of the hunter's afterimage.",
    "Performs a brief sacrament before each kill."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Reaper Edda Shadow-Borne served the League as a retrieval specialist in the League's quiet branch before the Blood Lord invited them into the Cathedral as visitor and they stayed.",
    "Varkul the Blood Lord now uses him to scout the threshold rooms."
  ]
};
