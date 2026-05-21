import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_BORAN_GAUGE_ZYR: HeroTarget = {
  "id": "architect_boran_gauge_zyr",
  "name": "Architect Boran Gauge",
  "classKey": "engineer",
  "corruptorLord": "zyr_koth",
  "threatTier": 2,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "field_redesign",
      "category": "engineer",
      "severity": 2
    },
    {
      "id": "telemetry_swarm",
      "category": "engineer",
      "severity": 2
    },
    {
      "id": "anniversary_recursion",
      "category": "engineer",
      "severity": 2
    },
    {
      "id": "fiduciary_lock",
      "category": "engineer",
      "severity": 2
    }
  ],
  "tells": [
    "Holds a folded contract in his off-hand that updates itself."
  ],
  "lairLocation": "antechamber",
  "briefingHints": [
    "Architect Boran Gauge served the League as a field engineer in the League's frontier-design corps before the Flayer revised them — third iteration is the operational one.",
    "Zyr'Koth the Flayer now uses her to hold a cell of the Crucible's lattice."
  ]
};
