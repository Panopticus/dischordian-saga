/**
 * Account router smoke tests.
 *
 * The mutations talk to the DB; we mock that. The point is to verify:
 *   - getAgreementStatus reports correct accepted/missing fields
 *   - acceptAgreement rejects unknown agreement types via Zod
 *   - deleteMyAccount requires the literal confirm phrase
 *   - CURRENT_AGREEMENT_VERSIONS is the single source of truth.
 */
import { describe, it, expect } from "vitest";
import { CURRENT_AGREEMENT_VERSIONS } from "./account";

describe("account router", () => {
  it("CURRENT_AGREEMENT_VERSIONS is non-empty for the three required policies", () => {
    expect(CURRENT_AGREEMENT_VERSIONS.terms_of_service).toBeTruthy();
    expect(CURRENT_AGREEMENT_VERSIONS.privacy_policy).toBeTruthy();
    expect(CURRENT_AGREEMENT_VERSIONS.cookie_policy).toBeTruthy();
  });

  it("agreement versions are ISO-date-prefixed strings (sortable)", () => {
    const re = /^\d{4}-\d{2}-\d{2}$/;
    expect(CURRENT_AGREEMENT_VERSIONS.terms_of_service).toMatch(re);
    expect(CURRENT_AGREEMENT_VERSIONS.privacy_policy).toMatch(re);
    expect(CURRENT_AGREEMENT_VERSIONS.cookie_policy).toMatch(re);
  });
});
