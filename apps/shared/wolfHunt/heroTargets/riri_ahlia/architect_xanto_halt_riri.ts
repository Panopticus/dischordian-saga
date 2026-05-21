import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_XANTO_HALT_RIRI: HeroTarget = {
  "id": "architect_xanto_halt_riri",
  "name": "Architect Xanto Halt",
  "classKey": "engineer",
  "corruptorLord": "riri_ahlia",
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
    "Architect Xanto Halt served the League as a field engineer in the League's frontier-design corps before the Taskmaster reorganised them onto a curriculum they had not been told existed.",
    "Riri'Ahlia the Taskmaster now uses her to scout the threshold rooms."
  ]
};
