import type { HeroTarget } from "../../types/HeroTarget";

export const PRAXIS_CEDAR_MENDSMITH_XETH: HeroTarget = {
  "id": "praxis_cedar_mendsmith_xeth",
  "name": "Praxis-Cedar Mendsmith",
  "classKey": "engineer",
  "corruptorLord": "xeth_raal",
  "threatTier": 4,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "patch_propagation",
      "category": "engineer",
      "severity": 1
    },
    {
      "id": "tooling_call",
      "category": "engineer",
      "severity": 1
    },
    {
      "id": "severance_protocol_refinement",
      "category": "engineer",
      "severity": 3
    },
    {
      "id": "iterative_flay",
      "category": "engineer",
      "severity": 3
    },
    {
      "id": "field_redesign",
      "category": "engineer",
      "severity": 2
    }
  ],
  "tells": [
    "Counts her revisions out loud — the second is the operational one.",
    "Reads the room's ambient telemetry before the first move."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Praxis-Cedar Mendsmith served the League as a field engineer in the League's frontier-design corps before the Ledger Keeper opened a contract clause they did not read aloud.",
    "Xeth'Raal the Ledger Keeper now uses her to anchor a load-bearing column of the corruption."
  ]
};
