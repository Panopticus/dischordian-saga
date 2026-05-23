/**
 * Floor for art.hotspot_coverage.
 *
 * The ratchet allows zero slippage; this test makes regressions
 * obvious at vitest time rather than ship:check time so a writer
 * deleting a sidecar entry sees the failure during local development.
 */
import { describe, it, expect } from "vitest";

import { checkHotspotCoverage } from "./hotspotCoverage";

describe("checkHotspotCoverage", () => {
  it("hits the 166-space spec contract (PASS, gap=0)", async () => {
    const report = await checkHotspotCoverage();
    expect(report.declared).toBe(166);
    expect(report.implemented).toBe(166);
    expect(report.declared - report.implemented).toBe(0);
    expect(report.missing).toEqual([]);
  });
});
