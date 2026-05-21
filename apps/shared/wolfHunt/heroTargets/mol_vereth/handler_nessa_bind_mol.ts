import type { HeroTarget } from "../../types/HeroTarget";

export const HANDLER_NESSA_BIND_MOL: HeroTarget = {
  "id": "handler_nessa_bind_mol",
  "name": "Handler Nessa Bind",
  "classKey": "spy",
  "corruptorLord": "mol_vereth",
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
    "Extracts agreement under reasonable framing.",
    "Repeats the last sentence the hunter spoke before he committed to it.",
    "Has been listening since before the hunter arrived."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Handler Nessa Bind served the League as a long-listen officer in the League's counter-intelligence before the Trustee signed an apprenticeship contract on their behalf, then countersigned it himself.",
    "Mol'Vereth the Trustee now uses him to drive a substantive operation against League material."
  ]
};
