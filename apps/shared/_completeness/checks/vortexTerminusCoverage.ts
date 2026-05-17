/**
 * Vortex / Terminus reconciliation parity check — PR-22.
 *
 * Hard PASS (dreamer 2026-05-17). Both threads are
 * "reconciled" and each MUST carry a non-empty
 * canonicalReading, at least one recorded `alternate` (the
 * non-canon readings are preserved, not discarded), and a
 * loreSource:
 *   - the Terminus Swarm = the Thought Virus (independent
 *     threat); Risen / First-Coming + Vortex-manifestation
 *     recorded as alternates;
 *   - the Vortex = the doomsday-clock terminal state that
 *     feeds the Final Coming (Archon #9), hard-locked.
 * The "canon_pending" branch below is retained only as
 * defensive scaffolding — no thread is currently pending.
 *
 * declared = threads; implemented = well-formed reconciled
 * threads; the gap = canon_pending + any malformed thread.
 */
import {
  VORTEX_TERMINUS_THREADS,
  getVortexTerminusCoverage,
} from "../../vortexTerminusCanon";
import type { RawParityCount } from "../types";

export function checkVortexTerminusCoverage(): RawParityCount {
  const { declared } = getVortexTerminusCoverage();
  const missing: string[] = [];

  for (const t of VORTEX_TERMINUS_THREADS) {
    if (t.status === "reconciled") {
      if (!t.canonicalReading || t.canonicalReading.trim().length === 0) {
        missing.push(`thread '${t.id}' is reconciled but has no canonicalReading`);
      }
      if (!t.alternates || t.alternates.length === 0) {
        missing.push(
          `thread '${t.id}' is reconciled but records no alternate readings (they must be preserved, not discarded)`,
        );
      }
      if (t.loreSource.trim().length === 0) {
        missing.push(`thread '${t.id}' is reconciled but has no loreSource`);
      }
    } else {
      // canon_pending — the tracked gap
      if (t.loreSource.trim().length === 0) {
        missing.push(`thread '${t.id}' is canon_pending but has no loreSource`);
      }
      if (!t.canonNote || t.canonNote.trim().length === 0) {
        missing.push(`thread '${t.id}' is canon_pending but has no canonNote`);
      }
      missing.push(
        `thread '${t.id}' is canon_pending — awaiting a canonical binding (the tracked gap)`,
      );
    }
  }

  return {
    declared,
    implemented: Math.max(0, declared - missing.length),
    missing,
  };
}
