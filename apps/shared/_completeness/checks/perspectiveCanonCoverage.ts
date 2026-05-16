/**
 * Perspective canon coverage parity check — PR-18
 * (Dischordian-Logic epistemology).
 *
 * Each of the saga's named storylines is a learnable
 * PERSPECTIVE (apps/shared/perspectiveCanon.ts). Closing the
 * storyline's Mystery-Engine arc unlocks the cards gated behind
 * it via the `perspective_learned` CardUnlockCondition kind.
 *
 * HARD parity. A perspective is "implemented" iff it is
 * well-formed:
 *   - status "locked"        → unlockingArcId resolves to an
 *                              authored arc AND
 *                              unlockingTerminalEpisodeId exists
 *                              in that arc's episode set
 *                              (episodeMysteries.ts). Otherwise
 *                              it is a card gated behind a lens
 *                              the player can never learn.
 *   - status "canon_pending" → carries a non-empty loreSource
 *                              (gate-then-stub; the loose thread
 *                              is bound to its dedicated backbone
 *                              in PR-21/PR-22/PR-23).
 *
 * No ratchet: a perspective is either coherent or it is a bug.
 */
import { PERSPECTIVES, getPerspectiveCoverage } from "../../perspectiveCanon";
import { getMysteriesForArc } from "../../episodeMysteries";
import type { ArcId } from "../../mysteryTypes";
import type { RawParityCount } from "../types";

function lockedResolves(arcId: string, episodeId: string): boolean {
  const mysteries = getMysteriesForArc(arcId as ArcId);
  if (mysteries.length === 0) return false;
  return mysteries.some((m) => m.episodes.some((e) => e.id === episodeId));
}

export function checkPerspectiveCanonCoverage(): RawParityCount {
  const { declared } = getPerspectiveCoverage();
  const missing: string[] = [];

  for (const p of PERSPECTIVES) {
    if (p.status === "locked") {
      if (!p.unlockingArcId || !p.unlockingTerminalEpisodeId) {
        missing.push(
          `perspective '${p.id}' is locked but has no unlockingArcId/terminalEpisodeId`,
        );
        continue;
      }
      if (!lockedResolves(p.unlockingArcId, p.unlockingTerminalEpisodeId)) {
        missing.push(
          `perspective '${p.id}' is locked but ${p.unlockingArcId}:${p.unlockingTerminalEpisodeId} ` +
            `does not resolve in episodeMysteries — a card gated behind an unlearnable lens`,
        );
      }
    } else {
      // canon_pending
      if (p.loreSource.trim().length === 0) {
        missing.push(
          `perspective '${p.id}' is canon_pending but has no loreSource`,
        );
      }
    }
  }

  return { declared, implemented: declared - missing.length, missing };
}
