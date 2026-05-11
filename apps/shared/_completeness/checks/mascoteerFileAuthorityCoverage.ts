/**
 * Mascoteer-file authority coverage parity check.
 *
 * Two invariants:
 *
 *   1. Every member of `mascoteers[]` on every MascoteerFile is
 *      one of the four canonical CANONICAL_MASCOTEERS ids.
 *
 *   2. Every named child-Archon (Vernon Vortex / Wanda Wyrlord /
 *      Wayne Warden) is referenced by name in at least one
 *      detectiveCommentary line. Catches the case where a
 *      Mascoteer file invokes a name the Era-3 Detective surface
 *      doesn't echo — that would mean the player meets the name
 *      in the kid-detective file with no Era-3 callback to anchor
 *      it.
 *
 * Hard parity — both invariants are small and binary.
 */
import type { RawParityCount } from "../types";
import { readFile } from "fs/promises";
import { resolve } from "path";
import {
  CANONICAL_MASCOTEERS,
  MASCOTEER_FILES,
  type MascoteerId,
} from "../../mascoteerFiles";

const CHILD_ARCHON_DISPLAY_NAMES: Partial<Record<MascoteerId, string>> = {
  vernon_vortex: "Vernon Vortex",
  wanda_wyrlord: "Wanda Wyrlord",
  wayne_warden: "Wayne Warden",
};

export async function checkMascoteerFileAuthorityCoverage(): Promise<RawParityCount> {
  const missing: string[] = [];
  const allowed = new Set<MascoteerId>(CANONICAL_MASCOTEERS);
  let declared = 0;
  let implemented = 0;

  // Invariant 1: every mascoteers[] member is canonical.
  for (const f of MASCOTEER_FILES) {
    for (const m of f.mascoteers) {
      declared++;
      if (allowed.has(m)) {
        implemented++;
      } else {
        missing.push(`${f.caseId} names unknown mascoteer ${m}`);
      }
    }
  }

  // Invariant 2: every named child-Archon also appears in
  // detectiveCommentary.ts.
  let commentary = "";
  try {
    commentary = await readFile(
      resolve(process.cwd(), "apps/shared/detectiveCommentary.ts"),
      "utf8",
    );
  } catch {
    missing.push("detectiveCommentary.ts (not found — cannot cross-check)");
  }

  const usedInCases = new Set<MascoteerId>();
  for (const f of MASCOTEER_FILES) {
    for (const m of f.mascoteers) usedInCases.add(m);
  }

  for (const m of usedInCases) {
    const display = CHILD_ARCHON_DISPLAY_NAMES[m];
    if (!display) continue; // the_kid has no Era-3 callback to check
    declared++;
    if (commentary.includes(display)) {
      implemented++;
    } else {
      missing.push(`${display} appears in mascoteer file but not in detectiveCommentary.ts`);
    }
  }

  return { declared, implemented, missing };
}
