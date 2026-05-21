import type { HeroTarget } from "../../types/HeroTarget";

export const LISTENER_NIALL_QUIET_STEP_FENRA: HeroTarget = {
  "id": "listener_niall_quiet_step_fenra",
  "name": "Listener Niall Quiet-Step",
  "classKey": "spy",
  "corruptorLord": "fenra",
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
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Listener Niall Quiet-Step served the League as a long-listen officer in the League's counter-intelligence before the Moon Tyrant charted them from the inside.",
    "Fenra the Moon Tyrant now uses him to scout the threshold rooms."
  ]
};
