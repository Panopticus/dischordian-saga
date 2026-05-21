import type { HeroTarget } from "../../types/HeroTarget";

export const HANDLER_ULRIC_LETTER_XETH: HeroTarget = {
  "id": "handler_ulric_letter_xeth",
  "name": "Handler Ulric Letter",
  "classKey": "spy",
  "corruptorLord": "xeth_raal",
  "threatTier": 2,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "named_signal",
      "category": "spy",
      "severity": 1
    },
    {
      "id": "rumor_seed",
      "category": "spy",
      "severity": 1
    },
    {
      "id": "patient_subversion",
      "category": "spy",
      "severity": 2
    },
    {
      "id": "shadow_tongue_handle",
      "category": "spy",
      "severity": 2
    }
  ],
  "tells": [
    "Carries a cobalt thread visible only when she laughs.",
    "Extracts agreement under reasonable framing."
  ],
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Handler Ulric Letter served the League as a long-listen officer in the League's counter-intelligence before the Ledger Keeper opened a contract clause they did not read aloud.",
    "Xeth'Raal the Ledger Keeper now uses him to hold a cell of the Crucible's lattice."
  ]
};
