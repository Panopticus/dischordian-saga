import type { HeroTarget } from "../../types/HeroTarget";

export const LISTENER_RHIAN_QUIET_STEP_ITH: HeroTarget = {
  "id": "listener_rhian_quiet_step_ith",
  "name": "Listener Rhian Quiet-Step",
  "classKey": "spy",
  "corruptorLord": "ith_rael",
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
    "Listener Rhian Quiet-Step served the League as a long-listen officer in the League's counter-intelligence before the Whisperer turned them across a window of decades.",
    "Ith'Rael the Whisperer now uses him to scout the threshold rooms."
  ]
};
