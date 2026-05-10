/* ═══════════════════════════════════════════════════════
   CONSPIRACY REVELATION BRIDGE — board solve fires cutscene

   Watches the seven `secret_act_N_revealed` flags fired by
   conspiracyService.ts (server-side) and bridges them to the
   memory-locked cutscene triggers declared in
   apps/shared/conspiracyBoardRevelations.ts.

   Mechanism:
     - When `secret_act_N_revealed` becomes true AND the
       associated cutscene's seen-flag is NOT yet set,
       the cutscene's trigger flag fires.
     - CutsceneRouter (already mounted at App root) detects
       the trigger flag and plays the cutscene.
     - On cutscene completion, CutsceneRouter sets the
       cutscene's `setsFlags` (which includes the
       `*_seen` flag), so this watcher does not loop.

   Idempotent — guarded by a per-board ref so the trigger
   does not re-fire even if React renders multiple times
   between the cutscene starting and the seen flag landing.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef } from "react";
import { useGame } from "@/contexts/GameContext";
import {
  CONSPIRACY_BOARD_REVELATIONS,
  type ConspiracyBoardRevelation,
} from "@shared/conspiracyBoardRevelations";
import { CONSPIRACY_BOARDS } from "@shared/conspiracyBoards/definitions";
import { CUTSCENE_REGISTRY } from "@shared/cutsceneRegistry";

/** Pairs each revelation with the matching board's revealFlag (the
 *  source of truth fired server-side). Computed once at module load. */
interface BridgeEntry {
  revelation: ConspiracyBoardRevelation;
  /** The `secret_act_N_revealed` flag fired when the board is solved. */
  sourceFlag: string;
  /** The cutscene's trigger flag (the `*_triggered` form). */
  cutsceneTriggerFlag: string;
  /** The cutscene's seen flag (so the trigger does not re-fire). */
  cutsceneSeenFlag: string;
}

const BRIDGE_ENTRIES: ReadonlyArray<BridgeEntry> = CONSPIRACY_BOARD_REVELATIONS
  .filter((r) => Boolean(r.unlocksCutscene))
  .map((revelation) => {
    const board = CONSPIRACY_BOARDS.find((b) => b.boardKey === revelation.boardKey);
    if (!board?.revealFlag) {
      throw new Error(
        `[conspiracyRevelationBridge] board ${revelation.boardKey} has no revealFlag`,
      );
    }
    const cutscene = CUTSCENE_REGISTRY[revelation.unlocksCutscene!];
    if (!cutscene) {
      throw new Error(
        `[conspiracyRevelationBridge] unknown cutscene ${revelation.unlocksCutscene}`,
      );
    }
    return {
      revelation,
      sourceFlag: board.revealFlag,
      cutsceneTriggerFlag: cutscene.triggerFlag,
      // CutsceneRouter computes the seen flag as
      // `cutscene_${id.replace(/^cutscene_/, "")}_seen` — mirror it.
      cutsceneSeenFlag: `cutscene_${cutscene.id.replace(/^cutscene_/, "")}_seen`,
    };
  });

export function useConspiracyRevelationBridge(): void {
  const { state, setNarrativeFlag } = useGame();
  const flags = state.narrativeFlags ?? {};
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    for (const entry of BRIDGE_ENTRIES) {
      // Fire only when the source flag is set and the cutscene has
      // neither been triggered already nor watched.
      if (!flags[entry.sourceFlag]) continue;
      if (flags[entry.cutsceneSeenFlag]) continue;
      if (flags[entry.cutsceneTriggerFlag]) continue;
      if (firedRef.current.has(entry.cutsceneTriggerFlag)) continue;
      firedRef.current.add(entry.cutsceneTriggerFlag);
      setNarrativeFlag(entry.cutsceneTriggerFlag, true);
    }
  }, [flags, setNarrativeFlag]);
}

export function ConspiracyRevelationBridgeWatcher(): null {
  useConspiracyRevelationBridge();
  return null;
}

/** Exposed for tests — the resolved bridge table. */
export const _CONSPIRACY_BRIDGE_ENTRIES_FOR_TEST = BRIDGE_ENTRIES;
