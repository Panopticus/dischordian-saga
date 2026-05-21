import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_ULEN_HALT_ITH: HeroTarget = {
  "id": "architect_ulen_halt_ith",
  "name": "Architect Ulen Halt",
  "classKey": "engineer",
  "corruptorLord": "ith_rael",
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
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Architect Ulen Halt served the League as a field engineer in the League's frontier-design corps before the Whisperer turned them across a window of decades.",
    "Ith'Rael the Whisperer now uses her to scout the threshold rooms."
  ]
};
