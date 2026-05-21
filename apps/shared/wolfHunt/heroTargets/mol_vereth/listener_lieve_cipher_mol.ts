import type { HeroTarget } from "../../types/HeroTarget";

export const LISTENER_LIEVE_CIPHER_MOL: HeroTarget = {
  "id": "listener_lieve_cipher_mol",
  "name": "Listener Lieve Cipher",
  "classKey": "spy",
  "corruptorLord": "mol_vereth",
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
  "lairLocation": "moonsick_terraces",
  "briefingHints": [
    "Listener Lieve Cipher served the League as a long-listen officer in the League's counter-intelligence before the Trustee signed an apprenticeship contract on their behalf, then countersigned it himself.",
    "Mol'Vereth the Trustee now uses him to scout the threshold rooms."
  ]
};
