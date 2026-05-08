/**
 * Recruitment quest chain coverage parity check.
 *
 * Declared surface: the 5 recruitable NPCs from
 * RESURRECTABLE_NPC_KEYS. Each NPC is "implemented" only when its
 * authored RecruitmentChain has:
 *   - briefing length ≥ 40
 *   - ≥ 3 stages, with the start stage present
 *   - every stage has ≥ 2 choices
 *   - every choice's `advanceTo` references a real stage or "end"
 *   - the chain reaches all three terminal outcomes:
 *       recruited_loyal, recruited_tense, refused
 *
 * Hard parity — every recruitable NPC must have a complete chain
 * for the gate to pass.
 */
import type { RawParityCount } from "../types";

export async function checkRecruitmentChainCoverage(): Promise<RawParityCount> {
  const mod = await import("../../recruitmentQuests");
  const { declared, implemented, missing } = mod.recruitmentChainCoverage();
  return { declared, implemented, missing };
}
