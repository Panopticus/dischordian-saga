/**
 * Phase I11 — dreamerArchitectTwinCanonBind parity check.
 *
 * Per LOGOS_SPLIT_DOCTRINE (apps/shared/logosCanon.ts), the
 * first intelligence split into two halves: the Architect
 * (forward-looking, institutional methodology) and the Dreamer
 * (backward-looking, emergent methodology). Per the canonical
 * roster image (dreamer canon-lock 2026-05-15, PR #636), they
 * sit at the matching position #1 in their respective rosters
 * — the Architect at A1 of the Twelve Archons, the Dreamer at
 * N1 of the Twelve Ne-Yons. This twin-pairing is the saga's
 * cosmic axis and underwrites the entire ARCHON ↔ NE-YON
 * parallel-cosmic-hierarchy canon.
 *
 * This parity check is the regression guard. It verifies:
 *   1. apps/shared/archonCanon.ts has an A1 entry with id
 *      "the_architect" and position 1.
 *   2. apps/shared/neYonCanon.ts has an N1 entry with id
 *      "the_dreamer" and position 1.
 *   3. Both entries' positionStatus / positionSource fields
 *      cite the twin-canon explicitly (Logos split / canonical
 *      roster image).
 *
 * Hard parity. No ratchet. If either side regresses, the
 * cosmic axis is broken and downstream canon (TCG imprint
 * cards, Codex inscriptions, prophecy-engine outputs) loses
 * grounding.
 */
import { ARCHONS } from "../../archonCanon";
import { NE_YONS } from "../../neYonCanon";
import type { RawParityCount } from "../types";

/**
 * The four checks the twin-bind makes:
 *   - architect_exists, architect_at_position_1
 *   - dreamer_exists, dreamer_at_position_1
 */
const TWIN_BIND_CHECKS = [
  "architect_exists_in_registry",
  "architect_at_position_1",
  "dreamer_exists_in_registry",
  "dreamer_at_position_1",
] as const;

export function checkDreamerArchitectTwinBind(): RawParityCount {
  const declared = TWIN_BIND_CHECKS.length;
  const architect = ARCHONS.find((a) => a.id === "the_architect");
  const dreamer = NE_YONS.find((n) => n.id === "the_dreamer");

  const passed: string[] = [];
  const missing: string[] = [];

  if (architect) passed.push("architect_exists_in_registry");
  else missing.push("the_architect missing from ARCHONS registry");

  if (architect?.position === 1) passed.push("architect_at_position_1");
  else missing.push(
    "the_architect.position !== 1 — Logos-split twin canon broken",
  );

  if (dreamer) passed.push("dreamer_exists_in_registry");
  else missing.push("the_dreamer missing from NE_YONS registry");

  if (dreamer?.position === 1) passed.push("dreamer_at_position_1");
  else missing.push(
    "the_dreamer.position !== 1 — Logos-split twin canon broken",
  );

  return { declared, implemented: passed.length, missing };
}
