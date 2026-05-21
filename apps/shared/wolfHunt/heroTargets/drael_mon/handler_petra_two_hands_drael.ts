import type { HeroTarget } from "../../types/HeroTarget";

export const HANDLER_PETRA_TWO_HANDS_DRAEL: HeroTarget = {
  "id": "handler_petra_two_hands_drael",
  "name": "Handler Petra Two-Hands",
  "classKey": "spy",
  "corruptorLord": "drael_mon",
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
    "Handler Petra Two-Hands served the League as a long-listen officer in the League's counter-intelligence before the Harvester paid them, in advance, for the souls they had not yet brought him.",
    "Drael'Mon the Harvester now uses him to drive a substantive operation against League material."
  ]
};
