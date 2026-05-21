import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_BRYA_LOCKERBY_XETH: HeroTarget = {
  "id": "architect_brya_lockerby_xeth",
  "name": "Architect Brya Lockerby",
  "classKey": "engineer",
  "corruptorLord": "xeth_raal",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "fiduciary_lock",
      "category": "engineer",
      "severity": 2
    },
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
    }
  ],
  "tells": [
    "Carries tools signed by the lord and by her in the same hand."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Architect Brya Lockerby served the League as a field engineer in the League's frontier-design corps before the Ledger Keeper opened a contract clause they did not read aloud.",
    "Xeth'Raal the Ledger Keeper now uses her to drive a substantive operation against League material."
  ]
};
