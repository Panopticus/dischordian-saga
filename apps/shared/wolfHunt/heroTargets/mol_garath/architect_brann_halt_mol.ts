import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_BRANN_HALT_MOL: HeroTarget = {
  "id": "architect_brann_halt_mol",
  "name": "Architect Brann Halt",
  "classKey": "engineer",
  "corruptorLord": "mol_garath",
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
    "Architect Brann Halt served the League as a field engineer in the League's frontier-design corps before the Unmaker pulled rank on the chain of command they had once trusted.",
    "Mol'Garath the Unmaker now uses her to scout the threshold rooms."
  ]
};
