import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_QUIRA_HALT_FENRA: HeroTarget = {
  "id": "architect_quira_halt_fenra",
  "name": "Architect Quira Halt",
  "classKey": "engineer",
  "corruptorLord": "fenra",
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
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Architect Quira Halt served the League as a field engineer in the League's frontier-design corps before the Moon Tyrant charted them from the inside.",
    "Fenra the Moon Tyrant now uses her to scout the threshold rooms."
  ]
};
