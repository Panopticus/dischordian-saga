import type { HeroTarget } from "../../types/HeroTarget";

export const HANDLER_ODE_BIND_VARKUL: HeroTarget = {
  "id": "handler_ode_bind_varkul",
  "name": "Handler Ode Bind",
  "classKey": "spy",
  "corruptorLord": "varkul",
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
    "Extracts agreement under reasonable framing.",
    "Repeats the last sentence the hunter spoke before he committed to it.",
    "Has been listening since before the hunter arrived."
  ],
  "lairLocation": "flayers_workshop",
  "briefingHints": [
    "Handler Ode Bind served the League as a long-listen officer in the League's counter-intelligence before the Blood Lord invited them into the Cathedral as visitor and they stayed.",
    "Varkul the Blood Lord now uses him to drive a substantive operation against League material."
  ]
};
