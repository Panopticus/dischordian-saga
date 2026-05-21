import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_ESRA_GAUGE_XETH: HeroTarget = {
  "id": "architect_esra_gauge_xeth",
  "name": "Architect Esra Gauge",
  "classKey": "engineer",
  "corruptorLord": "xeth_raal",
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
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Architect Esra Gauge served the League as a field engineer in the League's frontier-design corps before the Ledger Keeper opened a contract clause they did not read aloud.",
    "Xeth'Raal the Ledger Keeper now uses her to hold a cell of the Crucible's lattice."
  ]
};
