import { describe, it, expect } from "vitest";
import {
  LEDGER_MILESTONES,
  getLedgerMilestone,
  hasMilestone,
  listLedgerSubsystems,
  listMilestonesBySubsystem,
  pendingMintFlags,
  recordMilestone,
} from "./crossGameLedger";

describe("LEDGER_MILESTONES — invariants", () => {
  it("ships at least one milestone per major subsystem covered today", () => {
    const subsystems = new Set(LEDGER_MILESTONES.map((m) => m.subsystem));
    expect(subsystems.has("card_battle")).toBe(true);
    expect(subsystems.has("chess")).toBe(true);
    expect(subsystems.has("romance")).toBe(true);
  });

  it("every milestone id is unique", () => {
    const ids = LEDGER_MILESTONES.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("mintFlag (when set) is lowercase snake_case", () => {
    const re = /^[a-z][a-z0-9_]*$/;
    for (const m of LEDGER_MILESTONES) {
      if (m.mintFlag) expect(m.mintFlag).toMatch(re);
    }
  });
});

describe("getLedgerMilestone", () => {
  it("returns by id", () => {
    expect(getLedgerMilestone("chess_tier_5_reached")?.subsystem).toBe("chess");
  });

  it("returns undefined for unknown ids", () => {
    expect(getLedgerMilestone("nope")).toBeUndefined();
  });
});

describe("listMilestonesBySubsystem", () => {
  it("returns only milestones for the named subsystem", () => {
    const out = listMilestonesBySubsystem("card_battle");
    expect(out.length).toBeGreaterThan(0);
    for (const m of out) expect(m.subsystem).toBe("card_battle");
  });
});

describe("recordMilestone", () => {
  it("appends a new entry with timestamp", () => {
    const out = recordMilestone("chess_tier_5_reached", [], 1000);
    expect(out).toHaveLength(1);
    expect(out[0]).toEqual({ milestoneId: "chess_tier_5_reached", achievedAt: 1000 });
  });

  it("is idempotent — re-recording does not duplicate", () => {
    const first = recordMilestone("chess_tier_5_reached", [], 1000);
    const second = recordMilestone("chess_tier_5_reached", first, 2000);
    expect(second).toHaveLength(1);
    expect(second[0].achievedAt).toBe(1000);
  });
});

describe("hasMilestone", () => {
  it("true when present", () => {
    const ledger = recordMilestone("chess_tier_5_reached", [], 1);
    expect(hasMilestone("chess_tier_5_reached", ledger)).toBe(true);
  });

  it("false when absent", () => {
    expect(hasMilestone("chess_tier_5_reached", [])).toBe(false);
  });
});

describe("listLedgerSubsystems", () => {
  it("returns distinct subsystems the player has touched", () => {
    let ledger = recordMilestone("chess_tier_5_reached", [], 1);
    ledger = recordMilestone("card_5_architect_wins", ledger, 2);
    expect(listLedgerSubsystems(ledger).sort()).toEqual(["card_battle", "chess"]);
  });
});

describe("pendingMintFlags", () => {
  it("returns flags that haven't been minted yet", () => {
    const ledger = recordMilestone("chess_tier_5_reached", [], 1);
    expect(pendingMintFlags(ledger, {})).toContain("chess_tier_5_reached");
  });

  it("excludes flags already in alreadySet", () => {
    const ledger = recordMilestone("chess_tier_5_reached", [], 1);
    expect(pendingMintFlags(ledger, { chess_tier_5_reached: true })).toEqual([]);
  });
});
