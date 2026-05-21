import type { HeroTarget } from "../../types/HeroTarget";

export const LISTENER_WREN_LISTENER_XETH: HeroTarget = {
  "id": "listener_wren_listener_xeth",
  "name": "Listener Wren Listener",
  "classKey": "spy",
  "corruptorLord": "xeth_raal",
  "threatTier": 4,
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
    "Repeats the last sentence the hunter spoke before he committed to it."
  ],
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Listener Wren Listener served the League as a long-listen officer in the League's counter-intelligence before the Ledger Keeper opened a contract clause they did not read aloud.",
    "Xeth'Raal the Ledger Keeper now uses him to anchor a load-bearing column of the corruption."
  ]
};
