/**
 * NPC dialogue-coverage parity check.
 *
 * Mirror of apprenticeDialogueCoverage but for the 12 NamedNpcKey
 * NPCs. Each NPC must have all four BioWare-style topics
 * (past / calling / mortality / us) with non-empty openers, ≥3 entry
 * choices per topic, and at least one choice that opens a follow-up.
 *
 * Hard parity.
 */
import type { RawParityCount } from "../types";

export async function checkNpcDialogueCoverage(): Promise<RawParityCount> {
  const mod = await import("../../npcDialogues");
  const { declared, implemented, missing } = mod.npcDialogueCoverage();
  return { declared, implemented, missing };
}
