import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_SERA_WRENWARD_VARKUL: HeroTarget = {
  "id": "architect_sera_wrenward_varkul",
  "name": "Architect Sera Wrenward",
  "classKey": "engineer",
  "corruptorLord": "varkul",
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
  "lairLocation": "antechamber",
  "briefingHints": [
    "Architect Sera Wrenward served the League as a field engineer in the League's frontier-design corps before the Blood Lord invited them into the Cathedral as visitor and they stayed.",
    "Varkul the Blood Lord now uses her to scout the threshold rooms."
  ]
};
