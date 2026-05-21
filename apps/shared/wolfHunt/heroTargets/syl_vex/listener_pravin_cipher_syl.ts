import type { HeroTarget } from "../../types/HeroTarget";

export const LISTENER_PRAVIN_CIPHER_SYL: HeroTarget = {
  "id": "listener_pravin_cipher_syl",
  "name": "Listener Pravin Cipher",
  "classKey": "spy",
  "corruptorLord": "syl_vex",
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
  "lairLocation": "ledger_vault",
  "briefingHints": [
    "Listener Pravin Cipher served the League as a long-listen officer in the League's counter-intelligence before the Corruptor wove a cobalt thread into their decision-making.",
    "Syl'Vex the Corruptor now uses him to scout the threshold rooms."
  ]
};
