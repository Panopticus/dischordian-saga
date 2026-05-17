/* ═══════════════════════════════════════════════════════
   ACT-CLOSE CHAPTER CUTSCENE CANON — PR-20

   The ONLY new cutscenes the spine work introduces: one
   closing chapter per Act (1-7). Each summarises the act,
   breaks its Seal, and builds tension for the next. They are
   NOT a new cinematic engine — they are delivered through the
   already-shipped Antiquarian bridge overlay
   (apps/client/src/components/AntiquarianBridgeOverlay.tsx →
   pendingAntiquarianBridge), which PR-20 extended to cover all
   seven acts. So `assetStatus` is "produced": the runtime
   exists, the text ships, no new art.

   THE TWO COMINGS (project-owner canon, 2026-05-16):
   "The Coming" is one prophecy with two fulfilments —
     - FIRST  Coming  = the Necromancer's Return. The HALFWAY
                         point, pinned to the Act 4 close
                         (saga phase 7, the Memento Dischordia
                         cliffhanger). Mistaken for the end; it
                         is the midpoint.
     - FINAL  Coming  = the Politician's Return. The ENDGAME,
                         at the Act 7 close. It IGNITES the
                         already-canon-locked continuing loop
                         (continuingLoopEndgameCanon, PR-16) —
                         the endgame is a door, not a wall.

   Seal + prophecy are NOT duplicated here: each entry defers
   to its prophecyTarotCanon binding (PR-19), which the gate
   already validates resolves its Seal + Daniel-Cross bookend.
   This module adds the act-close delivery binding + the
   two-Comings classification on top.

   The parity gate
   (apps/shared/_completeness/checks/actCloseCutsceneCoverage.ts)
   is HARD: 7 entries, acts {1..7} once each; every
   antiquarianBridgeId resolves; every act has a prophecyTarot
   binding; assetStatus valid; Act 4 carries the FIRST Coming;
   Act 7 carries the FINAL Coming AND ignitesContinuingLoop.
   ═══════════════════════════════════════════════════════ */

import type { SealNumber } from "./sevenSeals";
import type { AntiquarianBridgeId } from "./antiquarianLoredexBridges";

/** Which fulfilment of "the Coming" this act close delivers. */
export type ComingStage = "first" | "final";

export type ActCloseAssetStatus = "produced" | "pending";

export interface ActCloseEntry {
  act: SealNumber;
  /** Existing act-completion flag that fires the close. */
  triggerFlag: `act_${number}_complete`;
  /** The Antiquarian bridge page that delivers this close
   *  (apps/shared/antiquarianLoredexBridges.ts). */
  antiquarianBridgeId: AntiquarianBridgeId;
  /** The close cinematic IS this act's Seal breaking. */
  breaksSeal: true;
  /** "produced" — delivered via the shipped Antiquarian bridge
   *  overlay; text ships, no new art. */
  assetStatus: ActCloseAssetStatus;
  /** Set only on the two Comings. */
  comingStage?: ComingStage;
  /** Act 7 only: the Final Coming ignites the continuing loop
   *  (PR-16 canon stays intact — layered, not replaced). */
  ignitesContinuingLoop?: true;
  /** One-line tension build for the next act. */
  nextActTease: string;
  loreSource: string;
}

export const ACT_CLOSE_ENTRIES: readonly ActCloseEntry[] = [
  {
    act: 1,
    triggerFlag: "act_1_complete",
    antiquarianBridgeId: "antiq_bridge_act_1_close",
    breaksSeal: true,
    assetStatus: "produced",
    nextActTease: "The white horse has ridden out. The red horse is saddled.",
    loreSource: "apps/shared/antiquarianLoredexBridges.ts (act 1) + prophecyTarotCanon.ts",
  },
  {
    act: 2,
    triggerFlag: "act_2_complete",
    antiquarianBridgeId: "antiq_bridge_act_2_close",
    breaksSeal: true,
    assetStatus: "produced",
    nextActTease: "War was the second seal. Famine reads the scales next.",
    loreSource: "apps/shared/antiquarianLoredexBridges.ts (act 2) + prophecyTarotCanon.ts",
  },
  {
    act: 3,
    triggerFlag: "act_3_complete",
    antiquarianBridgeId: "antiq_bridge_act_3_close",
    breaksSeal: true,
    assetStatus: "produced",
    nextActTease:
      "The scales have weighed everyone. At the midpoint, the dead do not stay weighed.",
    loreSource: "apps/shared/antiquarianLoredexBridges.ts (act 3) + prophecyTarotCanon.ts",
  },
  {
    act: 4,
    triggerFlag: "act_4_complete",
    antiquarianBridgeId: "antiq_bridge_act_4_close",
    breaksSeal: true,
    assetStatus: "produced",
    comingStage: "first",
    nextActTease:
      "The Necromancer came back — the First Coming. Most believe that was the end. It was the halfway mark.",
    loreSource:
      "apps/shared/antiquarianLoredexBridges.ts (act 4) + prophecyTarotCanon.ts + necromancerReturn.ts (the First Coming, saga phase 7)",
  },
  {
    act: 5,
    triggerFlag: "act_5_complete",
    antiquarianBridgeId: "antiq_bridge_act_5_close",
    breaksSeal: true,
    assetStatus: "produced",
    nextActTease:
      "The souls under the altar asked how long. The Civil War is the answer they did not want.",
    loreSource: "apps/shared/antiquarianLoredexBridges.ts (act 5) + prophecyTarotCanon.ts",
  },
  {
    act: 6,
    triggerFlag: "act_6_complete",
    antiquarianBridgeId: "antiq_bridge_act_6_close",
    breaksSeal: true,
    assetStatus: "produced",
    nextActTease:
      "The sixth seal blackened the sun. After the seventh comes the silence — and after the silence, the one who was always going to come back.",
    loreSource: "apps/shared/antiquarianLoredexBridges.ts (act 6) + prophecyTarotCanon.ts",
  },
  {
    act: 7,
    triggerFlag: "act_7_complete",
    antiquarianBridgeId: "antiq_bridge_act_7_close",
    breaksSeal: true,
    assetStatus: "produced",
    comingStage: "final",
    ignitesContinuingLoop: true,
    nextActTease:
      "The Politician returned — the Final Coming. The endgame is a door: it ignites the Cycle. Volume Nineteen does not close here; it begins here.",
    loreSource:
      "apps/shared/antiquarianLoredexBridges.ts (act 7) + prophecyTarotCanon.ts + continuingLoopEndgameCanon.ts (PR-16, ignited by the Final Coming)",
  },
];

/** Look up an act's close entry. */
export function getActCloseEntry(act: number): ActCloseEntry | undefined {
  return ACT_CLOSE_ENTRIES.find((e) => e.act === act);
}

/**
 * Pure resolver: the first triggered-but-unseen act close, in
 * Act order. Mirrors pendingAntiquarianBridge's contract so the
 * existing bridge overlay remains the single delivery runtime.
 */
export function pendingActClose(
  flags: ReadonlySet<string>,
): ActCloseEntry | null {
  for (const e of ACT_CLOSE_ENTRIES) {
    const seen = `${e.antiquarianBridgeId}_seen`;
    if (flags.has(e.triggerFlag) && !flags.has(seen)) return e;
  }
  return null;
}

/** Coverage snapshot for the parity gate. */
export function getActCloseCoverage(): { declared: number; acts: number } {
  return { declared: ACT_CLOSE_ENTRIES.length, acts: 7 };
}
