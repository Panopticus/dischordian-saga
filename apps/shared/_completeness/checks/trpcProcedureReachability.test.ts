/**
 * Self-test for marquee tRPC procedure reachability.
 *
 * Floor test: the check must run with sane counts. Specific
 * known-unreachable procedures (e.g. mysteryEngine.getActiveMysteries
 * if no UI yet calls it) are NOT pinned here — that's the ratchet's
 * job. This test guards against the check itself regressing.
 */
import { describe, it, expect } from "vitest";
import { checkTrpcProcedureReachability } from "./trpcProcedureReachability";

describe("checkTrpcProcedureReachability", () => {
  it("returns a sane parity count", async () => {
    const result = await checkTrpcProcedureReachability();
    expect(result.declared).toBeGreaterThan(0);
    expect(result.implemented).toBeGreaterThanOrEqual(0);
    expect(result.implemented).toBeLessThanOrEqual(result.declared);
  });

  it("missing lines are prefixed with trpc.<router>.<procedure>", async () => {
    const result = await checkTrpcProcedureReachability();
    for (const line of result.missing ?? []) {
      expect(line.startsWith("trpc."), `bad missing line: ${line}`).toBe(true);
    }
  });
});
