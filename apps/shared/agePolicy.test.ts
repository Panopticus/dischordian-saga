/**
 * Age-policy tests. The policy module is the single source of truth
 * for the COPPA/GDPR-K minimum-age check (audit/15.R4); these tests
 * pin its behaviour against representative cases.
 */
import { describe, it, expect } from "vitest";
import {
  EEA_COUNTRY_CODES,
  EEA_MIN_AGE,
  GLOBAL_MIN_AGE,
  computeAgeYears,
  evaluateAgePolicy,
  minimumAgeForCountry,
} from "./agePolicy";

describe("minimumAgeForCountry", () => {
  it("returns 16 for EU member states", () => {
    expect(minimumAgeForCountry("DE")).toBe(EEA_MIN_AGE);
    expect(minimumAgeForCountry("FR")).toBe(EEA_MIN_AGE);
    expect(minimumAgeForCountry("PL")).toBe(EEA_MIN_AGE);
  });
  it("returns 16 for EEA non-EU + UK", () => {
    expect(minimumAgeForCountry("NO")).toBe(EEA_MIN_AGE);
    expect(minimumAgeForCountry("IS")).toBe(EEA_MIN_AGE);
    expect(minimumAgeForCountry("GB")).toBe(EEA_MIN_AGE);
  });
  it("returns 13 for non-EU/EEA countries", () => {
    expect(minimumAgeForCountry("US")).toBe(GLOBAL_MIN_AGE);
    expect(minimumAgeForCountry("JP")).toBe(GLOBAL_MIN_AGE);
    expect(minimumAgeForCountry("AU")).toBe(GLOBAL_MIN_AGE);
  });
  it("falls safe to 16 when country is unknown / empty / null", () => {
    expect(minimumAgeForCountry(null)).toBe(EEA_MIN_AGE);
    expect(minimumAgeForCountry(undefined)).toBe(EEA_MIN_AGE);
    expect(minimumAgeForCountry("")).toBe(EEA_MIN_AGE);
  });
  it("normalises case", () => {
    expect(minimumAgeForCountry("de")).toBe(EEA_MIN_AGE);
    expect(minimumAgeForCountry("us")).toBe(GLOBAL_MIN_AGE);
  });
});

describe("computeAgeYears", () => {
  it("computes age across the year", () => {
    const on = new Date("2026-05-01T00:00:00Z");
    expect(computeAgeYears("2010-04-30", on)).toBe(16);
    expect(computeAgeYears("2010-05-01", on)).toBe(16);
    expect(computeAgeYears("2010-05-02", on)).toBe(15);
  });
  it("rejects malformed input", () => {
    expect(computeAgeYears("not-a-date")).toBeNull();
    expect(computeAgeYears("2010-13-01")).toBeNull();
    expect(computeAgeYears("3000-01-01")).toBeNull();
  });
});

describe("evaluateAgePolicy", () => {
  const today = new Date("2026-05-01T00:00:00Z");

  it("ok for a 17yo in Germany", () => {
    const r = evaluateAgePolicy("2008-01-01", "DE", today);
    expect(r.allowed).toBe(true);
    expect(r.minAge).toBe(16);
    expect(r.reason).toBe("ok");
  });

  it("blocked for a 14yo in Germany (below EEA 16)", () => {
    const r = evaluateAgePolicy("2011-04-30", "DE", today);
    expect(r.allowed).toBe(false);
    expect(r.minAge).toBe(16);
    expect(r.reason).toBe("country_restricted_below_min");
  });

  it("ok for a 14yo in the US (above global 13)", () => {
    const r = evaluateAgePolicy("2011-04-30", "US", today);
    expect(r.allowed).toBe(true);
    expect(r.minAge).toBe(13);
  });

  it("blocked for a 12yo in the US", () => {
    const r = evaluateAgePolicy("2014-04-30", "US", today);
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe("below_min_age");
  });

  it("malformed DOB → blocked", () => {
    const r = evaluateAgePolicy("garbage", "US", today);
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe("malformed_dob");
  });

  it("unknown country applies the EEA rule (fail-safe)", () => {
    const r = evaluateAgePolicy("2011-04-30", null, today);
    expect(r.allowed).toBe(false);
    expect(r.minAge).toBe(16);
  });

  it("EEA_COUNTRY_CODES is non-empty and includes core EU 27", () => {
    expect(EEA_COUNTRY_CODES.size).toBeGreaterThan(25);
    expect(EEA_COUNTRY_CODES.has("DE")).toBe(true);
    expect(EEA_COUNTRY_CODES.has("FR")).toBe(true);
  });
});
