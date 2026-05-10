/**
 * Apprentice Warden coverage parity check.
 *
 * Declared surface: 4 sub-systems the Warden module ships:
 *   - identity (WARDEN const, ≥ 5 fields populated)
 *   - candidate pool (≥ 4 candidates, all fully authored)
 *   - audit cameo (4 classification cases, each with non-empty closing line)
 *   - purge notice (3 options at Day 14)
 *
 * Hard parity.
 */
import type { RawParityCount } from "../types";

export async function checkApprenticeWardenCoverage(): Promise<RawParityCount> {
  const mod = await import("../../apprenticeWarden");

  const missing: string[] = [];
  let implemented = 0;
  let declared = 0;

  // 1. Identity
  declared += 1;
  const w = mod.WARDEN;
  if (w && w.id === "the_warden" && w.privateName && w.appearance && w.cadence && w.failureLine) {
    implemented += 1;
  } else {
    missing.push("WARDEN identity incomplete");
  }

  // 2. Candidate pool
  declared += 1;
  const cov = mod.wardenCandidateCoverage();
  const incomplete = cov.filter(c => !c.complete);
  if (cov.length >= 4 && incomplete.length === 0) {
    implemented += 1;
  } else {
    missing.push(`candidate pool: ${cov.length} entries, ${incomplete.length} incomplete`);
  }

  // 3. Audit cameo (4 classification cases must each return a non-empty
  //    closing line and a classified modifier shape).
  declared += 1;
  const classifications: Array<"compliant" | "ambiguous" | "noncompliant" | "withheld"> =
    ["compliant", "ambiguous", "noncompliant", "withheld"];
  let cameoOk = 0;
  for (const c of classifications) {
    const m = mod.wardenAuditCameo({
      classification: c,
      doctrineId: "compliant_mouth",
      cumulativeArchitectInfluence: 50,
    });
    if (m.closingLine && m.closingLine.length > 10 && Number.isFinite(m.influenceDeltaMultiplier)) {
      cameoOk += 1;
    }
  }
  if (cameoOk === classifications.length) {
    implemented += 1;
  } else {
    missing.push(`audit cameo: ${cameoOk}/${classifications.length} classifications authored`);
  }

  // 4. Purge notice — 3 options at Day 14.
  declared += 1;
  const notice = mod.buildPurgeNotice("Test");
  const opts = notice.options;
  const hasAll = ["accept_exit", "refuse_exit", "negotiate"].every(id =>
    opts.some(o => o.id === id),
  );
  if (notice.day === 14 && opts.length === 3 && hasAll && notice.exitOffer.length > 30) {
    implemented += 1;
  } else {
    missing.push("purge notice: missing options or short flavor");
  }

  return { declared, implemented, missing };
}
