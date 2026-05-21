import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_WYNN_GAUGE_MOL: HeroTarget = {
  "id": "architect_wynn_gauge_mol",
  "name": "Architect Wynn Gauge",
  "classKey": "engineer",
  "corruptorLord": "mol_vereth",
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
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Architect Wynn Gauge served the League as a field engineer in the League's frontier-design corps before the Trustee signed an apprenticeship contract on their behalf, then countersigned it himself.",
    "Mol'Vereth the Trustee now uses her to hold a cell of the Crucible's lattice."
  ]
};
