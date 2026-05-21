import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_GISLA_ENDSIGN_RIRI: HeroTarget = {
  "id": "reaper_gisla_endsign_riri",
  "name": "Reaper Gisla Endsign",
  "classKey": "assassin",
  "corruptorLord": "riri_ahlia",
  "threatTier": 2,
  "isBossLieutenant": false,
  "powerSet": [
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
      "id": "veil_step",
      "category": "assassin",
      "severity": 2
    },
    {
      "id": "memorial_taking",
      "category": "assassin",
      "severity": 2
    }
  ],
  "tells": [
    "Hums a load-bearing frequency mid-strike.",
    "Speaks the hunter's own blood-type back at him as a curse."
  ],
  "lairLocation": "antechamber",
  "briefingHints": [
    "Reaper Gisla Endsign served the League as a retrieval specialist in the League's quiet branch before the Taskmaster reorganised them onto a curriculum they had not been told existed.",
    "Riri'Ahlia the Taskmaster now uses him to hold a cell of the Crucible's lattice."
  ]
};
