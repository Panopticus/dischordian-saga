/**
 * Non-Coordination Pact integrity parity check (PR-3C).
 *
 * Pins the pact's load-bearing invariants (apps/shared/nonCoordinationPact.ts:
 * PACT_INVARIANTS). The pact's structural integrity is canonically
 * load-bearing: a future PR that accidentally transcribes the four
 * founding lines, removes the canonical Touché echo, or breaks the
 * Antiquarian's tacit-guardian binding would compromise the saga's
 * cosmological resistance pattern (apps/shared/logosCanon.ts).
 *
 * Hard parity: all five invariants must be true. There is no
 * acceptable state in which any of them is false during the main
 * saga; a future DLC that breaks the pact will need to explicitly
 * relax this check rather than silently ratchet it.
 */
import {
  PACT_FOUNDING,
  PACT_INVARIANTS,
  PACT_RENEWAL,
  PACT_TACIT_GUARDIAN,
} from "../../nonCoordinationPact";
import type { RawParityCount } from "../types";

export function checkNonCoordinationPactIntegrity(): RawParityCount {
  const declared = 5; // five invariants in PACT_INVARIANTS
  const checks: Array<[string, boolean]> = [];

  // Invariant 1: the four founding lines are UNQUOTED (no canonicalText key)
  checks.push([
    "founding_exchange_unquoted",
    PACT_INVARIANTS.foundingExchangeIsUnquoted === true &&
      (PACT_FOUNDING as Record<string, unknown>).canonicalText === undefined,
  ]);

  // Invariant 2: the renewal echo IS canonically quoted (Touché)
  checks.push([
    "memorial_echo_canonical",
    PACT_INVARIANTS.memorialEchoIsCanonical === true &&
      PACT_RENEWAL.canonicalEcho.canonicalText.lines.length === 4 &&
      PACT_RENEWAL.canonicalEcho.canonicalText.lines[3].line
        .toLowerCase()
        .includes("touché"),
  ]);

  // Invariant 3: both operators can refuse the offer
  checks.push([
    "both_operators_can_refuse",
    PACT_INVARIANTS.bothOperatorsCanRefuseTheOffer === true,
  ]);

  // Invariant 4: the player canonically honors or breaks the pact
  checks.push([
    "player_canonically_honors_or_breaks",
    PACT_INVARIANTS.playerCanonicallyHonorsOrBreaksThePact === true,
  ]);

  // Invariant 5: the Antiquarian is the tacit guardian
  checks.push([
    "antiquarian_tacit_guardian",
    PACT_INVARIANTS.antiquarianIsTheTacitGuardian === true &&
      PACT_TACIT_GUARDIAN.guardian === "the_antiquarian",
  ]);

  const passed = checks.filter(([, ok]) => ok).length;
  const missing = checks.filter(([, ok]) => !ok).map(([name]) => name);

  return {
    declared,
    implemented: passed,
    missing,
  };
}
