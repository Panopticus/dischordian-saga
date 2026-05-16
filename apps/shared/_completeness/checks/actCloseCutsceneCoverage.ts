/**
 * Act-close chapter cutscene coverage parity check — PR-20.
 *
 * HARD parity. The 7 act-close entries
 * (apps/shared/actCloseCutsceneCanon.ts) are the only new
 * cutscenes the spine work introduces; each must be fully
 * wired:
 *
 *   - acts are exactly {1..7}, once each;
 *   - triggerFlag is the canonical `act_<n>_complete`;
 *   - antiquarianBridgeId resolves in
 *     antiquarianLoredexBridges (the shipped delivery runtime —
 *     proves the close actually reaches the player);
 *   - the act has a prophecyTarotCanon binding (PR-19), so the
 *     Seal + Daniel-Cross bookend resolve transitively without
 *     duplication;
 *   - assetStatus is a valid classification;
 *   - the FIRST Coming is on Act 4 (Necromancer = halfway);
 *   - the FINAL Coming is on Act 7 (Politician = endgame) AND
 *     it ignites the continuing loop (PR-16 canon, layered).
 *
 * No ratchet — an act with no felt close, or a Coming on the
 * wrong act, is a spine bug.
 */
import {
  ACT_CLOSE_ENTRIES,
  getActCloseCoverage,
} from "../../actCloseCutsceneCanon";
import { getAntiquarianBridge } from "../../antiquarianLoredexBridges";
import { getProphecyTarotAct } from "../../prophecyTarotCanon";
import type { RawParityCount } from "../types";

const VALID_ASSET = new Set(["produced", "pending"]);

export function checkActCloseCutsceneCoverage(): RawParityCount {
  const { declared } = getActCloseCoverage();
  const missing: string[] = [];
  const seenActs = new Set<number>();

  for (const e of ACT_CLOSE_ENTRIES) {
    const tag = `act ${e.act}`;
    seenActs.add(e.act);

    if (e.triggerFlag !== `act_${e.act}_complete`) {
      missing.push(`${tag}: triggerFlag '${e.triggerFlag}' is not act_${e.act}_complete`);
    }
    if (!getAntiquarianBridge(e.antiquarianBridgeId)) {
      missing.push(
        `${tag}: antiquarianBridgeId '${e.antiquarianBridgeId}' does not resolve — the close has no delivery runtime`,
      );
    }
    if (!getProphecyTarotAct(e.act)) {
      missing.push(`${tag}: no prophecyTarotCanon binding — Seal/prophecy unresolved`);
    }
    if (!VALID_ASSET.has(e.assetStatus)) {
      missing.push(`${tag}: invalid assetStatus '${e.assetStatus}'`);
    }
    if (e.nextActTease.trim().length === 0) {
      missing.push(`${tag}: empty nextActTease`);
    }
  }

  // The two Comings must land on the canonical acts.
  const act4 = ACT_CLOSE_ENTRIES.find((e) => e.act === 4);
  if (!act4 || act4.comingStage !== "first") {
    missing.push("Act 4 must carry the FIRST Coming (Necromancer = halfway)");
  }
  const act7 = ACT_CLOSE_ENTRIES.find((e) => e.act === 7);
  if (!act7 || act7.comingStage !== "final") {
    missing.push("Act 7 must carry the FINAL Coming (Politician = endgame)");
  }
  if (!act7 || act7.ignitesContinuingLoop !== true) {
    missing.push(
      "Act 7's Final Coming must ignite the continuing loop (continuingLoopEndgameCanon, PR-16)",
    );
  }
  // No other act may claim a Coming.
  for (const e of ACT_CLOSE_ENTRIES) {
    if (e.comingStage && e.act !== 4 && e.act !== 7) {
      missing.push(`${`act ${e.act}`}: only Acts 4 and 7 may carry a Coming`);
    }
  }

  for (let a = 1; a <= 7; a++) {
    if (!seenActs.has(a)) missing.push(`act ${a} has no close entry`);
  }

  return {
    declared,
    implemented: Math.max(0, declared - missing.length),
    missing,
  };
}
