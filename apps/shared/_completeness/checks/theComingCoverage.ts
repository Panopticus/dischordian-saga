/**
 * The Coming — two-stage canon binding parity check (PR-21).
 *
 * HARD parity. "The Coming" is one prophecy with two
 * fulfilments; the gate proves BOTH stages resolve every
 * registry they cite, so the binding is coherent at runtime:
 *
 *   FIRST  (Necromancer, halfway, Act 4 / phase 7):
 *     - the necromancer arc + terminal episode resolve;
 *     - saga phase 7 exists and maps to Act 4;
 *     - actCloseCutsceneCanon Act 4 carries comingStage
 *       "first";
 *     - the resurrection meter is wired
 *       (RESURRECTION_THRESHOLDS present).
 *
 *   FINAL  (Politician, endgame, Act 7 / phase 13):
 *     - the politician arc + terminal episode resolve;
 *     - the Politician is Archon position #7;
 *     - saga phase 13 exists and maps to Act 7;
 *     - actCloseCutsceneCanon Act 7 carries comingStage
 *       "final" AND ignitesContinuingLoop;
 *     - the continuing-loop canon (PR-16) is non-empty.
 *
 * No ratchet — a two-stage prophecy whose stages do not
 * resolve their anchors is a canon failure.
 */
import { THE_COMING, getTheComingCoverage } from "../../theComingCanon";
import { getMysteriesForArc } from "../../episodeMysteries";
import type { ArcId } from "../../mysteryTypes";
import { getSagaPhaseDefinition } from "../../sagaPhases";
import type { SagaPhase } from "../../sagaPhases";
import { getArchonByPosition } from "../../archonCanon";
import { RESURRECTION_THRESHOLDS } from "../../necromancerReturn";
import { getContinuingLoopCoverage } from "../../continuingLoopEndgameCanon";
import { getActCloseEntry } from "../../actCloseCutsceneCanon";
import type { RawParityCount } from "../types";

function arcResolves(arcId: string, episodeId: string): boolean {
  const ms = getMysteriesForArc(arcId as ArcId);
  return ms.some((m) => m.episodes.some((e) => e.id === episodeId));
}

function phaseInAct(sagaPhase: number, act: number): boolean {
  try {
    const def = getSagaPhaseDefinition(sagaPhase as SagaPhase);
    return act >= def.actRange.min && act <= def.actRange.max;
  } catch {
    return false;
  }
}

export function checkTheComingCoverage(): RawParityCount {
  const { declared } = getTheComingCoverage();
  const missing: string[] = [];

  for (const c of THE_COMING) {
    const tag = c.id;

    if (!arcResolves(c.anchorArcId, c.anchorEpisodeId)) {
      missing.push(`${tag}: anchor arc ${c.anchorArcId}:${c.anchorEpisodeId} does not resolve`);
    }
    if (!phaseInAct(c.sagaPhase, c.act)) {
      missing.push(
        `${tag}: saga phase ${c.sagaPhase} does not map to Act ${c.act}`,
      );
    }

    const close = getActCloseEntry(c.act);
    if (!close) {
      missing.push(`${tag}: no act-close entry for Act ${c.act}`);
    } else if (c.id === "first_coming" && close.comingStage !== "first") {
      missing.push(`${tag}: Act ${c.act} close must carry the FIRST Coming`);
    } else if (c.id === "final_coming") {
      if (close.comingStage !== "final") {
        missing.push(`${tag}: Act ${c.act} close must carry the FINAL Coming`);
      }
      if (close.ignitesContinuingLoop !== true) {
        missing.push(`${tag}: the Final Coming must ignite the continuing loop`);
      }
    }

    if (c.id === "first_coming") {
      if (
        typeof RESURRECTION_THRESHOLDS !== "object" ||
        RESURRECTION_THRESHOLDS === null
      ) {
        missing.push("first_coming: RESURRECTION_THRESHOLDS not wired");
      }
    }

    if (c.id === "final_coming") {
      const archon = getArchonByPosition(7);
      if (!archon || !/politician/i.test(archon.name)) {
        missing.push(
          "final_coming: Archon position 7 must resolve to the Politician",
        );
      }
      if (getContinuingLoopCoverage().declared <= 0) {
        missing.push(
          "final_coming: continuing-loop canon (PR-16) is empty — nothing to ignite",
        );
      }
    }
  }

  return {
    declared,
    implemented: Math.max(0, declared - missing.length),
    missing,
  };
}
