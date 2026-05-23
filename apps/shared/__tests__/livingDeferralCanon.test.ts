import { describe, expect, it } from "vitest";

import {
  LIVING_DEFERRAL_BY_ID,
  LIVING_DEFERRAL_CANON,
  getLivingDeferralCoverage,
} from "../livingDeferralCanon";

describe("livingDeferralCanon — well-formedness", () => {
  it("every entry has all required fields populated", () => {
    for (const e of LIVING_DEFERRAL_CANON) {
      expect(e.id.length).toBeGreaterThan(0);
      expect(e.diegeticHandle.trim().length).toBeGreaterThan(0);
      expect(e.seamModule.trim().length).toBeGreaterThan(0);
      expect(e.seamIsIntentional).toBe(true);
    }
  });

  it("every seamModule contains at least one file:line pointer", () => {
    const fileLineRe = /[^\s:]+\.(ts|tsx|md|json):\d+/;
    for (const e of LIVING_DEFERRAL_CANON) {
      expect(e.seamModule).toMatch(fileLineRe);
    }
  });

  it("canon ids are unique", () => {
    expect(LIVING_DEFERRAL_BY_ID.size).toBe(LIVING_DEFERRAL_CANON.length);
  });

  it("getLivingDeferralCoverage classifies every entry", () => {
    const c = getLivingDeferralCoverage();
    expect(c.declared).toBe(LIVING_DEFERRAL_CANON.length);
    expect(c.classified).toBe(c.declared);
  });

  it("known canon entries are present", () => {
    // ch20_conexus_BONUS was resolved 2026-05-23 — Option A from the
    // ratification brief shipped (act_7_complete → authority_alignment_aligned).
    // The entry's slot in the canon array is a comment block; the
    // canon now tracks the heart-of-time + destination-gate + VO-manifest entries.
    expect(
      LIVING_DEFERRAL_BY_ID.has("epoch1_heart_of_time_four_presences"),
    ).toBe(true);
  });
});
