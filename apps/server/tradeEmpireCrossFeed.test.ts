/**
 * Trade Empire cross-feed wiring tests.
 *
 * The Trade Empire merge depends on three runtime cross-feeds bridging
 * the Map (economic) layer and the Court (political) layer. These are
 * runtime DB operations and hard to exercise as pure functions, so we
 * source-scan the wiring sites to pin that the calls remain in place.
 *
 * If you remove or rename these calls, update both the wiring AND
 * these tests with the rationale.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const REPO_ROOT = resolve(__dirname, "../..");

function readSrc(relPath: string): string {
  return readFileSync(resolve(REPO_ROOT, relPath), "utf8");
}

describe("Trade Empire cross-feed wiring", () => {
  it("completeMission bumps dominant sub-house rep with declaration modifier", () => {
    const src = readSrc("apps/server/routers/tradeEmpire.ts");
    expect(src).toContain("dominantSubHouseForSector");
    expect(src).toContain("applyDeclarationModifier");
    expect(src).toContain("applySubHouseRepDelta");
    // The cross-feed lives inside completeMission's reward block.
    const completeIdx = src.indexOf("completeMission: protectedProcedure");
    const cancelIdx = src.indexOf("cancelMission: protectedProcedure");
    expect(completeIdx).toBeGreaterThan(0);
    expect(cancelIdx).toBeGreaterThan(completeIdx);
    const completeBody = src.slice(completeIdx, cancelIdx);
    expect(completeBody).toContain("dominantSubHouseForSector");
    expect(completeBody).toContain("applyDeclarationModifier");
  });

  it("payDemand bumps the demanding house's anchor sector reputation", () => {
    const src = readSrc("apps/server/services/demandService.ts");
    expect(src).toContain("primarySectorId");
    expect(src).toContain("bumpSectorReputation");
    const payIdx = src.indexOf("export async function payDemand");
    const refuseIdx = src.indexOf("export async function refuseDemand");
    expect(payIdx).toBeGreaterThan(0);
    expect(refuseIdx).toBeGreaterThan(payIdx);
    const payBody = src.slice(payIdx, refuseIdx);
    expect(payBody).toContain("bumpSectorReputation");
  });

  it("agenda world-firing bumps the convergence climax", () => {
    const src = readSrc("apps/server/services/agendaEngine.ts");
    expect(src).toContain("bumpConvergence");
    expect(src).toContain("CLIMAX_BUMP_PER_WORLD_STEP");
    const fireIdx = src.indexOf("async function fireWorldStep");
    const tickIdx = src.indexOf("export async function tickUserAgendas");
    expect(fireIdx).toBeGreaterThan(0);
    expect(tickIdx).toBeGreaterThan(fireIdx);
    const fireBody = src.slice(fireIdx, tickIdx);
    expect(fireBody).toContain("bumpConvergence");
  });

  it("the shared sector-reputation service is the single bump path", () => {
    const src = readSrc("apps/server/services/tradeSectorReputationService.ts");
    expect(src).toContain("export async function bumpSectorReputation");
    expect(src).toContain("tradeSectorReputation");
  });
});
