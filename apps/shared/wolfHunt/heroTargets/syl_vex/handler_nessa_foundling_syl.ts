import type { HeroTarget } from "../../types/HeroTarget";

export const HANDLER_NESSA_FOUNDLING_SYL: HeroTarget = {
  "id": "handler_nessa_foundling_syl",
  "name": "Handler Nessa Foundling",
  "classKey": "spy",
  "corruptorLord": "syl_vex",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "rumor_seed",
      "category": "spy",
      "severity": 1
    },
    {
      "id": "whisper_inheritance",
      "category": "spy",
      "severity": 3
    },
    {
      "id": "thaloria_dialect",
      "category": "spy",
      "severity": 3
    },
    {
      "id": "patient_subversion",
      "category": "spy",
      "severity": 2
    }
  ],
  "tells": [
    "Argues the hunter into his opposite without raising the voice.",
    "Knows the hunter's name in a register he has not used since boyhood."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Handler Nessa Foundling served the League as a long-listen officer in the League's counter-intelligence before the Corruptor wove a cobalt thread into their decision-making.",
    "Syl'Vex the Corruptor now uses him to drive a substantive operation against League material."
  ]
};
