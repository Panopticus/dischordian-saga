import type { HeroTarget } from "../../types/HeroTarget";

export const REAPER_JOREN_QUIETUS_FENRA: HeroTarget = {
  "id": "reaper_joren_quietus_fenra",
  "name": "Reaper Joren Quietus",
  "classKey": "assassin",
  "corruptorLord": "fenra",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
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
    "Leaves a coin behind for every kill, weighted by market value.",
    "Hums a load-bearing frequency mid-strike.",
    "Speaks the hunter's own blood-type back at him as a curse."
  ],
  "lairLocation": "antechamber",
  "briefingHints": [
    "Reaper Joren Quietus served the League as a retrieval specialist in the League's quiet branch before the Moon Tyrant charted them from the inside.",
    "Fenra the Moon Tyrant now uses him to scout the threshold rooms."
  ]
};
