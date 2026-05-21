import type { HeroTarget } from "../../types/HeroTarget";

export const LISTENER_TARO_CIPHER_XETH: HeroTarget = {
  "id": "listener_taro_cipher_xeth",
  "name": "Listener Taro Cipher",
  "classKey": "spy",
  "corruptorLord": "xeth_raal",
  "threatTier": 1,
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
    }
  ],
  "tells": [
    "Plants a false rumour that returns as accepted truth."
  ],
  "lairLocation": "corrupters_orchard",
  "briefingHints": [
    "Listener Taro Cipher served the League as a long-listen officer in the League's counter-intelligence before the Ledger Keeper opened a contract clause they did not read aloud.",
    "Xeth'Raal the Ledger Keeper now uses him to scout the threshold rooms."
  ]
};
