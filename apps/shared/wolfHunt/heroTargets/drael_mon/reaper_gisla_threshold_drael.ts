import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_GISLA_THRESHOLD_DRAEL: HeroTarget = {
  "id": "reaper_gisla_threshold_drael",
  "name": "Reaper Gisla Threshold",
  "classKey": "assassin",
  "corruptorLord": "drael_mon",
  "threatTier": 2,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "vampiric_economy",
      "category": "assassin",
      "severity": 2
    },
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
    }
  ],
  "tells": [
    "Performs a brief sacrament before each kill.",
    "Takes the dead's last memory along with the life.",
    "Counts down souls in fives before each strike."
  ],
  "lairLocation": "antechamber",
  "briefingHints": [
    "Reaper Gisla Threshold served the League as a retrieval specialist in the League's quiet branch before the Harvester paid them, in advance, for the souls they had not yet brought him.",
    "Drael'Mon the Harvester now uses him to hold a cell of the Crucible's lattice."
  ]
};
