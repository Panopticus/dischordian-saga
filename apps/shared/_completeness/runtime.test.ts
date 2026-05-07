/**
 * Tests for the parity-check runtime — the PASS/FAIL/RATCHET logic.
 *
 * Uses synthetic entries (not the real registry) so the runtime is
 * exercised even before any subsystem registers. Once Part B lands
 * its first checks, those bring their own assertions; this file
 * keeps testing the harness itself.
 */
import { describe, it, expect } from "vitest";
import { runParityCheck } from "./runtime";
import type { CompletenessEntry } from "./types";

function syntheticEntry(
  declared: number,
  implemented: number,
  ratchet?: { target: number },
): CompletenessEntry {
  return {
    id: "test.synthetic",
    name: "synthetic",
    description: "test fixture",
    check: () => ({ declared, implemented }),
    ratchet,
  };
}

describe("runParityCheck — status logic", () => {
  it("returns PASS when declared === implemented", async () => {
    const r = await runParityCheck(syntheticEntry(10, 10), {
      version: 1,
      worstByEntry: {},
    });
    expect(r.status).toBe("PASS");
    expect(r.gap).toBe(0);
  });

  it("returns FAIL when gap > 0 and no ratchet config", async () => {
    const r = await runParityCheck(syntheticEntry(10, 7), {
      version: 1,
      worstByEntry: {},
    });
    expect(r.status).toBe("FAIL");
    expect(r.gap).toBe(3);
  });

  it("returns RATCHET when gap > 0 and within recorded ceiling", async () => {
    const r = await runParityCheck(
      syntheticEntry(100, 50, { target: 0 }),
      { version: 1, worstByEntry: { "test.synthetic": 60 } },
    );
    expect(r.status).toBe("RATCHET");
    expect(r.gap).toBe(50);
  });

  it("returns FAIL when ratchet ceiling has slipped", async () => {
    const r = await runParityCheck(
      syntheticEntry(100, 50, { target: 0 }),
      { version: 1, worstByEntry: { "test.synthetic": 40 } },
    );
    expect(r.status).toBe("FAIL");
    expect(r.gap).toBe(50);
  });

  it("seeds RATCHET status on first run when ratchet config is present without ceiling", async () => {
    const r = await runParityCheck(
      syntheticEntry(100, 50, { target: 0 }),
      { version: 1, worstByEntry: {} },
    );
    expect(r.status).toBe("RATCHET");
  });

  it("rejects implemented > declared", async () => {
    await expect(
      runParityCheck(syntheticEntry(5, 7), {
        version: 1,
        worstByEntry: {},
      }),
    ).rejects.toThrow(/exceeds declared/);
  });

  it("rejects negative counts", async () => {
    await expect(
      runParityCheck(syntheticEntry(5, -1), {
        version: 1,
        worstByEntry: {},
      }),
    ).rejects.toThrow(/negative/);
  });
});
