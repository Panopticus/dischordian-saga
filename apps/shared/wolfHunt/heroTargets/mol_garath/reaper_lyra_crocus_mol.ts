import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_LYRA_CROCUS_MOL: HeroTarget = {
  "id": "reaper_lyra_crocus_mol",
  "name": "Reaper Lyra Crocus",
  "classKey": "assassin",
  "corruptorLord": "mol_garath",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "harvest_pace",
      "category": "assassin",
      "severity": 3
    },
    {
      "id": "veil_step",
      "category": "assassin",
      "severity": 2
    },
    {
      "id": "memorial_taking",
      "category": "assassin",
      "severity": 2
    },
    {
      "id": "cathedral_resonance",
      "category": "assassin",
      "severity": 3
    }
  ],
  "tells": [
    "Speaks the hunter's own blood-type back at him as a curse.",
    "Strikes only on the exact breath he chose in advance.",
    "Carries a weapon composed of the hunter's afterimage."
  ],
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Reaper Lyra Crocus served the League as a retrieval specialist in the League's quiet branch before the Unmaker pulled rank on the chain of command they had once trusted.",
    "Mol'Garath the Unmaker now uses him to drive a substantive operation against League material."
  ]
};
