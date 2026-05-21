import type { HeroTarget } from "../../types/HeroTarget";

export const HANDLER_VELA_BIND_XETH: HeroTarget = {
  "id": "handler_vela_bind_xeth",
  "name": "Handler Vela Bind",
  "classKey": "spy",
  "corruptorLord": "xeth_raal",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "long_listen",
      "category": "spy",
      "severity": 2
    },
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
    }
  ],
  "tells": [
    "Extracts agreement under reasonable framing.",
    "Repeats the last sentence the hunter spoke before he committed to it.",
    "Has been listening since before the hunter arrived."
  ],
  "lairLocation": "antechamber",
  "briefingHints": [
    "Handler Vela Bind served the League as a long-listen officer in the League's counter-intelligence before the Ledger Keeper opened a contract clause they did not read aloud.",
    "Xeth'Raal the Ledger Keeper now uses him to drive a substantive operation against League material."
  ]
};
