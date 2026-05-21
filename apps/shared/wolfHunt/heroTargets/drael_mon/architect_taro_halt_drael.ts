import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_TARO_HALT_DRAEL: HeroTarget = {
  "id": "architect_taro_halt_drael",
  "name": "Architect Taro Halt",
  "classKey": "engineer",
  "corruptorLord": "drael_mon",
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
    "Architect Taro Halt served the League as a field engineer in the League's frontier-design corps before the Harvester paid them, in advance, for the souls they had not yet brought him.",
    "Drael'Mon the Harvester now uses her to scout the threshold rooms."
  ]
};
