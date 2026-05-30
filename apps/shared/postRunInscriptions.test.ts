import { describe, it, expect } from "vitest";

import {
  buildCycleAwareInscription,
  buildDischordiaInscription,
  type PostRunInscriptionContext,
} from "./postRunInscriptions";

const baseCtx: PostRunInscriptionContext = {
  prestigeTier: 1,
  stanceFlag: "act7_s1_humanity_path",
  pathFlag: "act1_path_a",
  humanityRunCount: 1,
  machineRunCount: 0,
  balanceRunCount: 0,
  communityLight: 100,
  communityDark: 50,
};

describe("buildCycleAwareInscription", () => {
  it("first cycle inscription mentions cycle 1 and the canonical pen-down register", () => {
    const inscription = buildCycleAwareInscription({ ...baseCtx, prestigeTier: 1 });
    expect(inscription.body).toContain("Cycle 1");
    expect(inscription.body.toLowerCase()).toContain("pen");
    expect(inscription.annotation).toBeDefined();
  });

  it("second cycle inscription mentions a separate ledger", () => {
    const inscription = buildCycleAwareInscription({ ...baseCtx, prestigeTier: 2 });
    expect(inscription.body).toContain("Cycle 2");
    expect(inscription.body.toLowerCase()).toContain("ledger");
  });

  it("third-time-Humanity triggers the 'authoring a thesis' inscription", () => {
    const inscription = buildCycleAwareInscription({
      ...baseCtx,
      prestigeTier: 3,
      humanityRunCount: 3,
      stanceFlag: "act7_s1_humanity_path",
    });
    expect(inscription.body.toLowerCase()).toContain("thesis");
  });

  it("inscriptions reference the path label (Disclosure / Discovery / Betrayal)", () => {
    const a = buildCycleAwareInscription({ ...baseCtx, pathFlag: "act1_path_a" });
    const b = buildCycleAwareInscription({ ...baseCtx, pathFlag: "act3_partial_share" });
    const c = buildCycleAwareInscription({ ...baseCtx, pathFlag: "act3_full_secret" });
    expect(a.body).toContain("Disclosure");
    expect(b.body).toContain("Discovery");
    expect(c.body).toContain("Betrayal");
  });

  it("inscriptions reference the stance label", () => {
    const humanity = buildCycleAwareInscription({ ...baseCtx, stanceFlag: "act7_s1_humanity_path" });
    const machine = buildCycleAwareInscription({ ...baseCtx, stanceFlag: "act7_s1_machine_path" });
    const balance = buildCycleAwareInscription({ ...baseCtx, stanceFlag: "act7_s1_balance" });
    const silence = buildCycleAwareInscription({ ...baseCtx, stanceFlag: "act7_silence_stance" });
    expect(humanity.body).toContain("Humanity");
    expect(machine.body).toContain("Machine");
    expect(balance.body).toContain("Balance");
    expect(silence.body).toContain("Silence");
  });

  it("unknown stance falls back to 'Undeclared'", () => {
    const inscription = buildCycleAwareInscription({ ...baseCtx, stanceFlag: null });
    expect(inscription.body).toContain("Undeclared");
  });
});

describe("buildDischordiaInscription", () => {
  it("reports the lighter side's percentage when light dominates", () => {
    const inscription = buildDischordiaInscription({
      ...baseCtx,
      communityLight: 200,
      communityDark: 100,
    });
    expect(inscription.body).toContain("Light");
    expect(inscription.body).toMatch(/67%|66%/);
  });

  it("reports Dark when dark dominates", () => {
    const inscription = buildDischordiaInscription({
      ...baseCtx,
      communityLight: 30,
      communityDark: 90,
    });
    expect(inscription.body).toContain("Dark");
  });

  it("returns Balance when light and dark are equal", () => {
    const inscription = buildDischordiaInscription({
      ...baseCtx,
      communityLight: 50,
      communityDark: 50,
    });
    expect(inscription.body).toContain("Balance");
  });

  it("includes annotation that anchors the player's run as one of many", () => {
    const inscription = buildDischordiaInscription(baseCtx);
    expect(inscription.annotation?.toLowerCase()).toContain("collective");
  });
});
