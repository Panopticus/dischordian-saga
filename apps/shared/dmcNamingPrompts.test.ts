import { describe, it, expect } from "vitest";
import {
  DMC_NAMING_PROMPTS,
  getDmcIdentityChain,
  getNextDmcNamingPrompt,
  listDmcNamingPrompts,
} from "./dmcNamingPrompts";

describe("dmcNamingPrompts — Appendix A.9", () => {
  it("has exactly four prompts", () => {
    expect(DMC_NAMING_PROMPTS.length).toBe(4);
  });

  it("prompts are ordered 1-4 contiguously", () => {
    const orders = [...DMC_NAMING_PROMPTS].map((p) => p.order).sort();
    expect(orders).toEqual([1, 2, 3, 4]);
  });

  it("ids are Student / Seeker / Detective / Last in order", () => {
    expect(DMC_NAMING_PROMPTS.map((p) => p.id)).toEqual([
      "student",
      "seeker",
      "detective",
      "last",
    ]);
  });

  it("racesCompletedBefore is 3 / 6 / 9 / 12", () => {
    expect(DMC_NAMING_PROMPTS.map((p) => p.racesCompletedBefore)).toEqual([
      3, 6, 9, 12,
    ]);
  });

  it("each prompt has a unique completedFlag", () => {
    const flags = DMC_NAMING_PROMPTS.map((p) => p.completedFlag);
    expect(new Set(flags).size).toBe(flags.length);
  });

  it("getNextDmcNamingPrompt returns null below 3 races", () => {
    expect(getNextDmcNamingPrompt(0, {})).toBeNull();
    expect(getNextDmcNamingPrompt(2, {})).toBeNull();
  });

  it("getNextDmcNamingPrompt returns Student at 3 races", () => {
    const out = getNextDmcNamingPrompt(3, {});
    expect(out?.id).toBe("student");
  });

  it("getNextDmcNamingPrompt skips Student once its flag is raised", () => {
    const out = getNextDmcNamingPrompt(6, { dmc_student_named: true });
    expect(out?.id).toBe("seeker");
  });

  it("getNextDmcNamingPrompt returns Last at 12 races", () => {
    const out = getNextDmcNamingPrompt(12, {
      dmc_student_named: true,
      dmc_seeker_named: true,
      dmc_detective_named: true,
    });
    expect(out?.id).toBe("last");
  });

  it("getNextDmcNamingPrompt returns null when all four are named", () => {
    const out = getNextDmcNamingPrompt(20, {
      dmc_student_named: true,
      dmc_seeker_named: true,
      dmc_detective_named: true,
      dmc_last_named: true,
    });
    expect(out).toBeNull();
  });

  it("getDmcIdentityChain returns sparse chain", () => {
    const chain = getDmcIdentityChain({ student: "Andy", detective: "Ren" });
    expect(chain.student).toBe("Andy");
    expect(chain.seeker).toBeUndefined();
    expect(chain.detective).toBe("Ren");
    expect(chain.last).toBeUndefined();
  });

  it("listDmcNamingPrompts returns all four", () => {
    expect(listDmcNamingPrompts().length).toBe(4);
  });
});
