/**
 * Completeness gate — barrel.
 *
 * The "tracked-vs-shipped" gate. See {@link ./types} for the contract
 * and {@link ./registry} for the list of subsystems under enforcement.
 * The CLI is `scripts/ship-check.ts` (`pnpm ship:check`).
 */
export type {
  CompletenessEntry,
  ParityResult,
  ParityStatus,
  RawParityCount,
} from "./types";
export { COMPLETENESS_REGISTRY } from "./registry";
export { runParityCheck, runAll } from "./runtime";
