/**
 * Narrative-spine coverage parity check.
 *
 * Design contract (owner-locked): "the story IS the connective layer."
 * Every game mode in GAME_MODE_PREMISES must be REVEALED by exactly one
 * narrative-spine beat (apps/shared/narrativeSpine.ts), and the
 * generated coherence doc must stay in sync.
 *
 * HARD PARITY: a system not on the spine is orphaned from the story —
 * the precise failure this work eliminates. declared = GAME_MODE_PREMISES
 * count; implemented = premises bound to exactly one structurally-valid
 * beat. Any structural defect (unresolvable premise, unregistered phase,
 * 0-or-many beats per system) OR coherence-doc drift folds into the gap.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import {
  getNarrativeSpineCoverage,
  getNarrativeSpineDefects,
  renderCoherenceMatrix,
} from "../../narrativeSpine";
import type { RawParityCount } from "../types";

const DOC_PATH = path.join(REPO_ROOT, "docs/built/SAGA_GAME_MODE_COHERENCE.md");

export function checkNarrativeSpineCoverage(): RawParityCount {
  const { declared, bound } = getNarrativeSpineCoverage();
  const missing = getNarrativeSpineDefects();

  let docInSync = true;
  try {
    const onDisk = fs.readFileSync(DOC_PATH, "utf-8").replace(/\r\n/g, "\n");
    const expected = renderCoherenceMatrix().replace(/\r\n/g, "\n");
    if (onDisk.trim() !== expected.trim()) {
      docInSync = false;
      missing.push(
        "docs/built/SAGA_GAME_MODE_COHERENCE.md has drifted from " +
          "narrativeSpine.ts — regenerate: pnpm tsx " +
          "apps/scripts/gen-saga-mode-coherence.ts",
      );
    }
  } catch {
    docInSync = false;
    missing.push(
      "docs/built/SAGA_GAME_MODE_COHERENCE.md is missing — generate: " +
        "pnpm tsx apps/scripts/gen-saga-mode-coherence.ts",
    );
  }

  // The implemented count is the bound-premise count, minus one if the
  // generated doc has drifted (the coherence contract is part of the
  // declared surface, not a free side-effect).
  const implemented = docInSync ? bound : Math.max(0, bound - 1);
  return { declared, implemented, missing };
}
