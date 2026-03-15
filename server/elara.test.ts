import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("elara", () => {
  it("getGreeting returns a message, choices, and portrait", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.elara.getGreeting();

    expect(result).toBeDefined();
    expect(typeof result.message).toBe("string");
    expect(result.message.length).toBeGreaterThan(0);
    expect(result.message).toContain("Operative");
    expect(Array.isArray(result.choices)).toBe(true);
    expect(result.choices.length).toBeGreaterThan(0);
    expect(result.choices[0]).toHaveProperty("id");
    expect(result.choices[0]).toHaveProperty("text");
    expect(result.choices[0]).toHaveProperty("category");
    expect(typeof result.portrait).toBe("string");
    expect(result.portrait).toContain("elara_portrait");
  });

  it("lookupEntity finds characters by name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.elara.lookupEntity({ query: "Architect" });

    expect(result).toBeDefined();
    expect(Array.isArray(result.results)).toBe(true);
    expect(result.results.length).toBeGreaterThan(0);
    expect(result.results[0]).toHaveProperty("name");
  });

  it("lookupEntity returns empty for nonsense query", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.elara.lookupEntity({ query: "xyznonexistent12345" });

    expect(result).toBeDefined();
    expect(Array.isArray(result.results)).toBe(true);
    expect(result.results.length).toBe(0);
  });

  it("lookupEntity limits results to 5", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // "the" should match many entries
    const result = await caller.elara.lookupEntity({ query: "the" });

    expect(result.results.length).toBeLessThanOrEqual(5);
  });
});
