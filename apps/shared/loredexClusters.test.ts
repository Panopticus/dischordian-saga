import { describe, it, expect } from "vitest";
import {
  tallyConceptClusters,
  LOREDEX_CLUSTER_LABELS,
  LOREDEX_CLUSTER_ORDER,
} from "./loredexClusters";
import loredexData from "../client/src/data/loredex-data.json";

describe("tallyConceptClusters", () => {
  it("returns empty when given no entries", () => {
    expect(tallyConceptClusters([])).toEqual({});
  });

  it("ignores non-concept entries", () => {
    const tally = tallyConceptClusters([
      { type: "character", cluster: "imprint_mechanics" },
      { type: "song", cluster: "seer_method" },
      { type: "faction", cluster: "audit_discipline" },
    ]);
    expect(tally).toEqual({});
  });

  it("ignores concepts without a cluster", () => {
    const tally = tallyConceptClusters([
      { type: "concept" },
      { type: "concept", cluster: "" },
      { type: "concept", cluster: "imprint_mechanics" },
    ]);
    expect(tally).toEqual({ imprint_mechanics: 1 });
  });

  it("tallies concept entries per cluster", () => {
    const tally = tallyConceptClusters([
      { type: "concept", cluster: "seer_method" },
      { type: "concept", cluster: "seer_method" },
      { type: "concept", cluster: "audit_discipline" },
      { type: "concept", cluster: "lionism_ethics" },
    ]);
    expect(tally.seer_method).toBe(2);
    expect(tally.audit_discipline).toBe(1);
    expect(tally.lionism_ethics).toBe(1);
  });
});

describe("loredex-data live cluster coverage", () => {
  it("the five canonical clusters all have at least one tagged concept", () => {
    const tally = tallyConceptClusters(
      loredexData.entries as Array<{ type?: string; cluster?: string }>,
    );
    for (const cid of LOREDEX_CLUSTER_ORDER) {
      expect(
        tally[cid] ?? 0,
        `cluster "${cid}" has no tagged concepts in loredex-data.json`,
      ).toBeGreaterThan(0);
    }
  });

  it("tagged-concept count is at least 50 (audit/14.F1 baseline)", () => {
    const tally = tallyConceptClusters(
      loredexData.entries as Array<{ type?: string; cluster?: string }>,
    );
    const total = Object.values(tally).reduce((s, n) => s + n, 0);
    expect(total).toBeGreaterThanOrEqual(50);
  });
});

describe("cluster taxonomy invariants", () => {
  it("every cluster id in LOREDEX_CLUSTER_ORDER has a label", () => {
    for (const cid of LOREDEX_CLUSTER_ORDER) {
      expect(LOREDEX_CLUSTER_LABELS[cid]).toBeTruthy();
    }
  });

  it("every label keys back into LOREDEX_CLUSTER_ORDER", () => {
    for (const cid of Object.keys(LOREDEX_CLUSTER_LABELS)) {
      expect(LOREDEX_CLUSTER_ORDER).toContain(cid as never);
    }
  });
});
