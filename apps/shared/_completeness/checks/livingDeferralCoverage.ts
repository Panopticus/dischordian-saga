/**
 * Living-deferral coverage parity check.
 *
 * Declared surface: `LIVING_DEFERRAL_CANON` entries in
 * `apps/shared/livingDeferralCanon.ts` — surfaces whose absence in the
 * shipped loop is deliberate and recorded with a typed status +
 * structural seam pointer + diegetic justification.
 *
 * Implemented surface: entries that pass the well-formedness predicate
 * in `getLivingDeferralCoverage()` (every field populated, seamModule
 * resolves to a file:line, seamIsIntentional true).
 *
 * The gate PASSES when declared === implemented. This is hard parity —
 * any entry that loses its seam or diegetic handle fails the build.
 * The contract is "if something is deferred, the canon spine must
 * record why."
 */
import type { RawParityCount } from "../types";

export async function checkLivingDeferralCoverage(): Promise<RawParityCount> {
  const { LIVING_DEFERRAL_CANON, getLivingDeferralCoverage } = await import(
    "../../livingDeferralCanon"
  );
  const { declared, classified } = getLivingDeferralCoverage();

  const missing: string[] = [];
  if (classified < declared) {
    for (const entry of LIVING_DEFERRAL_CANON) {
      if (
        !entry.seamIsIntentional ||
        entry.diegeticHandle.trim().length === 0 ||
        entry.seamModule.trim().length === 0
      ) {
        missing.push(
          `${entry.id}: missing seam/handle/intent — ${entry.status}`,
        );
      }
    }
  }

  return {
    declared,
    implemented: classified,
    missing,
  };
}
