import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_ZOFIA_WRENWARD_XETH: HeroTarget = {
  "id": "architect_zofia_wrenward_xeth",
  "name": "Architect Zofia Wrenward",
  "classKey": "engineer",
  "corruptorLord": "xeth_raal",
  "threatTier": 1,
  "isBossLieutenant": false,
  "powerSet": [
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
    "Speaks to her hands as if they were a separate crew.",
    "Refuses to commit to a tactic she has used before."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Architect Zofia Wrenward served the League as a field engineer in the League's frontier-design corps before the Ledger Keeper opened a contract clause they did not read aloud.",
    "Xeth'Raal the Ledger Keeper now uses her to scout the threshold rooms."
  ]
};
