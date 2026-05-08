/**
 * Seven-seals epigraph coverage parity check.
 *
 * Every seal in `apps/shared/sevenSeals.ts` must have a non-empty
 * authored epigraph in `apps/shared/sevenSealsEpigraphs.ts`. Hard
 * parity — a missing epigraph leaves the SealEpigraphCinematic
 * falling back to the one-line fallSummary, which is fine in
 * staging but not at ship.
 */
import { SEVEN_SEALS } from "../../sevenSeals";
import { SEAL_EPIGRAPHS } from "../../sevenSealsEpigraphs";
import type { RawParityCount } from "../types";

export function checkSevenSealEpigraphCoverage(): RawParityCount {
  const missing: string[] = [];
  let implemented = 0;
  for (const seal of SEVEN_SEALS) {
    const e = SEAL_EPIGRAPHS[seal.num];
    if (!e) {
      missing.push(`seal ${seal.num}: no epigraph entry`);
      continue;
    }
    const okOpen = e.openingLine.length > 0 && e.openingLine.length <= 80;
    const okBody = e.body.length >= 200 && e.body.length <= 600;
    const okAttrib = e.attribution.length > 0;
    const okCite = e.citation.length > 0;
    if (okOpen && okBody && okAttrib && okCite) {
      implemented++;
    } else {
      const flags: string[] = [];
      if (!okOpen) flags.push(`openingLine length ${e.openingLine.length} not in (0, 80]`);
      if (!okBody) flags.push(`body length ${e.body.length} not in [200, 600]`);
      if (!okAttrib) flags.push("attribution empty");
      if (!okCite) flags.push("citation empty");
      missing.push(`seal ${seal.num}: ${flags.join("; ")}`);
    }
  }
  return {
    declared: SEVEN_SEALS.length,
    implemented,
    missing,
  };
}
