import type { HeroTarget } from "../../types/HeroTarget";

export const LISTENER_LYRA_BIND_ITH: HeroTarget = {
  "id": "listener_lyra_bind_ith",
  "name": "Listener Lyra Bind",
  "classKey": "spy",
  "corruptorLord": "ith_rael",
  "threatTier": 3,
  "isBossLieutenant": false,
  "powerSet": [
    {
      "id": "thaloria_dialect",
      "category": "spy",
      "severity": 3
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
    },
    {
      "id": "cobalt_conversion",
      "category": "spy",
      "severity": 3
    }
  ],
  "tells": [
    "Extracts agreement under reasonable framing."
  ],
  "lairLocation": "rylloh_galleries",
  "briefingHints": [
    "Listener Lyra Bind served the League as a long-listen officer in the League's counter-intelligence before the Whisperer turned them across a window of decades.",
    "Ith'Rael the Whisperer now uses him to drive a substantive operation against League material."
  ]
};
