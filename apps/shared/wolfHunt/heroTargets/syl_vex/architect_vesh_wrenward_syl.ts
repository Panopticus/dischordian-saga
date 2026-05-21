import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_VESH_WRENWARD_SYL: HeroTarget = {
  "id": "architect_vesh_wrenward_syl",
  "name": "Architect Vesh Wrenward",
  "classKey": "engineer",
  "corruptorLord": "syl_vex",
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
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Architect Vesh Wrenward served the League as a field engineer in the League's frontier-design corps before the Corruptor wove a cobalt thread into their decision-making.",
    "Syl'Vex the Corruptor now uses her to scout the threshold rooms."
  ]
};
