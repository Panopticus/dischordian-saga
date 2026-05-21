import type { HeroTarget } from "../../types/HeroTarget";

export const LISTENER_NYX_QUIET_STEP_DRAEL: HeroTarget = {
  "id": "listener_nyx_quiet_step_drael",
  "name": "Listener Nyx Quiet-Step",
  "classKey": "spy",
  "corruptorLord": "drael_mon",
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
    "Listener Nyx Quiet-Step served the League as a long-listen officer in the League's counter-intelligence before the Harvester paid them, in advance, for the souls they had not yet brought him.",
    "Drael'Mon the Harvester now uses him to scout the threshold rooms."
  ]
};
