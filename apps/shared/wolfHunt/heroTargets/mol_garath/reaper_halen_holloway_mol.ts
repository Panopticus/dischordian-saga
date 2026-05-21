import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_HALEN_HOLLOWAY_MOL: HeroTarget = {
  "id": "reaper_halen_holloway_mol",
  "name": "Reaper Halen Holloway",
  "classKey": "assassin",
  "corruptorLord": "mol_garath",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "exact_quietus",
      "category": "assassin",
      "severity": 2
    },
    {
      "id": "shadow_weapon",
      "category": "assassin",
      "severity": 1
    },
    {
      "id": "ritual_grace",
      "category": "assassin",
      "severity": 1
    },
    {
      "id": "soul_taxis",
      "category": "assassin",
      "severity": 3
    }
  ],
  "tells": [
    "Takes the dead's last memory along with the life.",
    "Counts down souls in fives before each strike."
  ],
  "lairLocation": "antechamber",
  "briefingHints": [
    "Reaper Halen Holloway served the League as a retrieval specialist in the League's quiet branch before the Unmaker pulled rank on the chain of command they had once trusted.",
    "Mol'Garath the Unmaker now uses him to drive a substantive operation against League material."
  ]
};
