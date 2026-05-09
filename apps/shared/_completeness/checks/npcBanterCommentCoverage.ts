/**
 * NPC banter + reactive-comment coverage parity check.
 *
 * Declared: 12 NamedNpcKey. Implemented: each NPC has ≥3 reactive
 * comments in NPC_REACTIVE_COMMENTS and ≥3 banter pairs in
 * NPC_BANTER_PAIRS (either side of the speakers tuple). Lands at
 * RATCHET — easy to pass at landing but the ratchet ensures the
 * authoring doesn't regress as the roster grows.
 */
import type { RawParityCount } from "../types";

export async function checkNpcBanterCommentCoverage(): Promise<RawParityCount> {
  const mod = await import("../../npcCompanionExtensions");
  const { declared, implemented, missing } = mod.npcBanterCommentCoverage();
  return { declared, implemented, missing };
}
