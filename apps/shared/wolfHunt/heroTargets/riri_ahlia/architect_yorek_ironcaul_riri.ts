import type { HeroTarget } from "../../types/HeroTarget";

export const ARCHITECT_YOREK_IRONCAUL_RIRI: HeroTarget = {
  "id": "architect_yorek_ironcaul_riri",
  "name": "Architect Yorek Ironcaul",
  "classKey": "engineer",
  "corruptorLord": "riri_ahlia",
  "threatTier": 2,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "anniversary_recursion",
      "category": "engineer",
      "severity": 2
    },
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
    }
  ],
  "tells": [
    "Refuses to commit to a tactic she has used before.",
    "Carries tools signed by the lord and by her in the same hand.",
    "Counts her revisions out loud — the second is the operational one."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Architect Yorek Ironcaul served the League as a field engineer in the League's frontier-design corps before the Taskmaster reorganised them onto a curriculum they had not been told existed.",
    "Riri'Ahlia the Taskmaster now uses her to hold a cell of the Crucible's lattice."
  ]
};
