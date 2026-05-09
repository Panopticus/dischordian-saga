/**
 * NPC BioWare-coverage parity check.
 *
 * Declared surface: 12 NamedNpcKey values (6 tier-2 + 6 tier-3). Each
 * is "implemented" only when its NpcIdentity entry has the required
 * shape: likes / dislikes / wants / signatureLine non-empty, and a
 * personalQuest with the right number of stages for its tier (tier-2
 * needs 3 stages with stage-3 breaking-point choices; tier-3 needs
 * stage-1 with ≥3 subtasks).
 *
 * Hard parity — every NPC must be fully authored.
 */
import type { RawParityCount } from "../types";

export async function checkNpcBiowareCoverage(): Promise<RawParityCount> {
  const mod = await import("../../npcIdentity");
  const { declared, implemented, missing } = mod.npcIdentityCoverage();
  return { declared, implemented, missing };
}
