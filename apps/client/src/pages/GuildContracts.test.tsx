/**
 * Structural tests for the GuildContracts component on GuildPage.
 * Source-scan style — verifies the contract UI consumes the expected
 * tRPC procedures, follows the existing GuildTreasury cinematic-queue
 * pattern, and surfaces every WEEKLY_CONTRACTS template id.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { WEEKLY_CONTRACTS } from "@shared/guildContracts";

const src = fs.readFileSync(
  path.resolve(__dirname, "GuildPage.tsx"),
  "utf-8",
);

describe("GuildPage — Contracts tab wiring", () => {
  it("registers a CONTRACTS tab in the tab list", () => {
    expect(src).toContain('id: "contracts"');
    expect(src).toContain('label: "CONTRACTS"');
    expect(src).toContain("ScrollText");
  });

  it("mounts a GuildContracts component when the contracts tab is active", () => {
    expect(src).toMatch(/tab === "contracts"[\s\S]{0,200}<GuildContracts \/>/);
  });

  it("declares the GuildContracts component", () => {
    expect(src).toContain("function GuildContracts()");
  });
});

describe("GuildPage — GuildContracts data + mutations", () => {
  it("queries listAvailable for the per-week contract set", () => {
    expect(src).toContain("trpc.guildContracts.listAvailable.useQuery");
  });

  it("calls completeContract with the contract id from the CLAIM button", () => {
    expect(src).toContain("trpc.guildContracts.completeContract.useMutation");
    expect(src).toContain("completeMut.mutate({ contractId: c.id })");
  });

  it("acknowledges weekly unlock + reset against localStorage on mount", () => {
    expect(src).toContain("trpc.guildContracts.acknowledgeWeeklyUnlock.useMutation");
    expect(src).toContain("trpc.guildContracts.acknowledgeWeeklyReset.useMutation");
    expect(src).toContain("dischordian:guild:lastAckUnlockWeek");
    expect(src).toContain("dischordian:guild:lastAckResetWeek");
  });
});

describe("GuildPage — GuildContracts cinematic queue (mirrors GuildTreasury)", () => {
  it("collects cutscene triggers from completeContract + ack mutations", () => {
    expect(src).toContain("setCinematicQueue");
    expect(src).toContain("CutsceneTrigger");
  });

  it("renders GuildCutsceneQueue when the queue is non-empty", () => {
    expect(src).toMatch(/<GuildCutsceneQueue[\s\S]{0,80}triggers=\{cinematicQueue\}/);
  });
});

describe("GuildPage — Contracts UI exposes every template", () => {
  // Sanity: a developer who adds a 9th template will see the assertion fire
  // until the cinematic's tarot-fan layout is updated to match.
  it("WEEKLY_CONTRACTS is exactly 8 entries (matches the cinematic fan)", () => {
    expect(WEEKLY_CONTRACTS.length).toBe(8);
  });

  it("renders bars and CLAIM buttons keyed by contract id", () => {
    expect(src).toMatch(/data\.contracts\.map\(\(c\)/);
    expect(src).toContain("c.targetCount");
    expect(src).toContain("progressCount");
  });
});
