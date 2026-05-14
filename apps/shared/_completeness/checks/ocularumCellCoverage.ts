/**
 * Ocularum cell coverage parity check.
 *
 * The Ocularum's operational body is canonically 700 numbered cells
 * (`apps/shared/ocularumCanon.ts:CANONICAL_OCULARUM_CELL_COUNT`).
 * PR-1 canonizes 3 named cells (Old Tanjin / Mira / Seventh Whisper);
 * the remaining ~694 are owed by the future 700-card DLC and any
 * intermediate PRs that author named cells.
 *
 * This check is RATCHETED — the gap will start large (≈697) and is
 * expected to shrink only as canonical cells get authored. The
 * ratchet ensures that named cells cannot regress: a future PR that
 * removes a canonical cell from the registry without dreamer sign-off
 * fails the gate.
 *
 * Coordinators and predecessor-identities are NOT counted here (they
 * sit outside the cell-roster per canon). Warlord-fragmented sisters
 * are NOT counted either — they are canonically separated from the
 * operational body.
 */
import {
  CANONICAL_OCULARUM_CELL_COUNT,
  getRegisteredCells,
} from "../../ocularumCanon";
import type { RawParityCount } from "../types";

export function checkOcularumCellCoverage(): RawParityCount {
  const cells = getRegisteredCells();
  const declared = CANONICAL_OCULARUM_CELL_COUNT;
  const implemented = cells.length;

  const missing: string[] = [];
  if (implemented < declared) {
    const named = cells
      .map((c) => `cell ${c.cellNumber}: ${c.name}`)
      .join(", ");
    missing.push(
      `${declared - implemented} unnamed cells. Named so far: ${named || "(none)"}.`,
    );
    missing.push(
      "The 700 cells are owed by the future 700-card DLC. Each named cell here must canonically resolve to a card when the DLC ships.",
    );
  }

  return { declared, implemented, missing };
}
