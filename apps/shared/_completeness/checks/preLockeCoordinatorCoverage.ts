/**
 * Pre-Locke Coordinator coverage parity check.
 *
 * The Ocularum has had a chain of Coordinators from the
 * founding regicide to the modern era. PR-5 ships 2 named
 * predecessors (the Founder and Jericho — Locke's immediate
 * predecessor). The dreamer canon-lock places the full chain
 * length somewhere between 5 and 15 inclusive
 * (apps/shared/preLockeCoordinators.ts:PRE_LOCKE_COORDINATOR_COUNT_RANGE).
 *
 * This check is RATCHETED. The gap starts large (5 - 2 = 3
 * minimum unnamed predecessors) and shrinks only as named
 * Coordinators are added. Removing a registered Coordinator
 * regresses the gate; adding one tightens it.
 */
import {
  PRE_LOCKE_COORDINATOR_COUNT_RANGE,
  getPreLockeCoordinatorCoverage,
} from "../../preLockeCoordinators";
import type { RawParityCount } from "../types";

export function checkPreLockeCoordinatorCoverage(): RawParityCount {
  const declared = PRE_LOCKE_COORDINATOR_COUNT_RANGE.min;
  const implemented = getPreLockeCoordinatorCoverage();
  const missing =
    implemented < declared
      ? [
          `${declared - implemented} canon-pending pre-Locke Coordinator(s). ` +
            "Range per dreamer canon-lock 2026-05-14: " +
            `${PRE_LOCKE_COORDINATOR_COUNT_RANGE.min}-${PRE_LOCKE_COORDINATOR_COUNT_RANGE.max}.`,
        ]
      : [];
  return { declared, implemented, missing };
}
