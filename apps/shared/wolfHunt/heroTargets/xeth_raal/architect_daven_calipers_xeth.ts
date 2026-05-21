import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_DAVEN_CALIPERS_XETH: HeroTarget = {
  "id": "architect_daven_calipers_xeth",
  "name": "Architect Daven Calipers",
  "classKey": "engineer",
  "corruptorLord": "xeth_raal",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "tooling_call",
      "category": "engineer",
      "severity": 1
    },
    {
      "id": "field_redesign",
      "category": "engineer",
      "severity": 2
    },
    {
      "id": "telemetry_swarm",
      "category": "engineer",
      "severity": 2
    }
  ],
  "tells": [
    "Reads the room's ambient telemetry before the first move.",
    "Holds a folded contract in his off-hand that updates itself.",
    "Reorders his own anatomy between strikes."
  ],
  "lairLocation": "antechamber",
  "briefingHints": [
    "Architect Daven Calipers served the League as a field engineer in the League's frontier-design corps before the Ledger Keeper opened a contract clause they did not read aloud.",
    "Xeth'Raal the Ledger Keeper now uses her to scout the threshold rooms."
  ]
};
