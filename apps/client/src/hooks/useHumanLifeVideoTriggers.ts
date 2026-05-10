/* ═══════════════════════════════════════════════════════
   HUMAN-LIFE VIDEO TRIGGER WATCHER

   Bridges existing narrative flags to the canonical four
   triggers defined in apps/shared/humanLifeVideoSequence.ts:

     - breath_beat_c5_complete                  → Celebration
     - slideshow_to_be_the_human_complete       → Mechronis
     - prelude_beat_h_inbox_first_open          → Detective
     - any act4_prisoner_*_complete             → Reveal

   Idempotent: each trigger is only fired once (we no-op when
   the seen flag has already been set). Mount once at App
   root alongside HumanLifeVideoOverlay.
   ═══════════════════════════════════════════════════════ */

import { useEffect } from "react";
import { useGame } from "@/contexts/GameContext";

interface BridgeRule {
  /** Existing narrative flag(s) — any one triggers the bridge. */
  sourceFlags: ReadonlyArray<string>;
  /** Target trigger flag from humanLifeVideoSequence. */
  targetTriggerFlag: string;
  /** Skip if this flag is already set (idempotency guard). */
  guardSeenFlag: string;
}

const BRIDGE_RULES: ReadonlyArray<BridgeRule> = [
  {
    sourceFlags: ["breath_beat_c5_complete"],
    targetTriggerFlag: "human_life_celebration_triggered",
    guardSeenFlag: "human_life_celebration_seen",
  },
  {
    sourceFlags: ["slideshow_to_be_the_human_complete"],
    targetTriggerFlag: "human_life_mechronis_triggered",
    guardSeenFlag: "human_life_mechronis_seen",
  },
  {
    sourceFlags: ["prelude_beat_h_inbox_first_open"],
    targetTriggerFlag: "human_life_detective_triggered",
    guardSeenFlag: "human_life_detective_seen",
  },
  {
    sourceFlags: [
      "act4_prisoner_cell_complete",
      "act4_prisoner_extraction_complete",
      "act4_prisoner_warlord_complete",
      "act4_prisoner_oracle_complete",
    ],
    targetTriggerFlag: "human_life_reveal_triggered",
    guardSeenFlag: "human_life_reveal_seen",
  },
];

export function useHumanLifeVideoTriggers(): void {
  const { state, setNarrativeFlag } = useGame();
  const flags = state.narrativeFlags ?? {};

  useEffect(() => {
    for (const rule of BRIDGE_RULES) {
      if (flags[rule.guardSeenFlag]) continue;
      if (flags[rule.targetTriggerFlag]) continue;
      const fired = rule.sourceFlags.some((src) => Boolean(flags[src]));
      if (fired) {
        setNarrativeFlag(rule.targetTriggerFlag, true);
      }
    }
  }, [flags, setNarrativeFlag]);
}

export function HumanLifeVideoTriggerWatcher(): null {
  useHumanLifeVideoTriggers();
  return null;
}
