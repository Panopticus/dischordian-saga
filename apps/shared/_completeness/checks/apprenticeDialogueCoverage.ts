/**
 * Apprentice dialogue coverage parity check.
 *
 * Declared surface: 12 ApprenticeArchetype values. Each is
 * "implemented" only when its authored ArchetypeDialogues set has
 * all four topics (past / calling / mortality / us), every topic
 * has ≥ 3 entry choices, every topic has at least one choice that
 * branches into a follow-up node, and every topic has a non-empty
 * opener.
 *
 * Hard parity — every archetype must have a complete branching set
 * for the gate to pass.
 */
import type { RawParityCount } from "../types";

export async function checkApprenticeDialogueCoverage(): Promise<RawParityCount> {
  const mod = await import("../../apprenticeDialogues");
  const { declared, implemented, missing } = mod.dialogueCoverage();
  return { declared, implemented, missing };
}
