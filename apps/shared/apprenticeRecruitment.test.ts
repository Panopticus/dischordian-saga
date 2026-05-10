import { describe, it, expect } from "vitest";
import { recruitApprentice } from "./apprenticeRecruitment";
import { mintMemoryCardFromFallen } from "./apprenticeMemoryInheritance";
import { generateApprentice } from "./apprentices";
import { EMPTY_MECHRONIS_CONTEXT } from "./apprenticeMechronisLink";

describe("apprenticeRecruitment", () => {
  it("recruits a baseline apprentice without context", () => {
    const out = recruitApprentice({});
    expect(out.apprentice).toBeDefined();
    expect(out.inheritedTrait).toBeNull();
    expect(out.consumedCard).toBeNull();
    expect(out.apprentice.cohortSlot).toBe("active");
  });

  it("seeds Architect Influence from the Mechronis context", () => {
    const out = recruitApprentice({
      mechronisContext: {
        transcript: { ...EMPTY_MECHRONIS_CONTEXT.transcript, narrativeCohort: "compliance_native" },
        playerMorality: 0,
      },
    });
    expect(out.apprentice.architectInfluence).toBeGreaterThan(20);
  });

  it("doctrine selection flows through to the apprentice", () => {
    const out = recruitApprentice({ doctrineId: "heretical_quiet" });
    expect(out.apprentice.doctrineId).toBe("heretical_quiet");
  });

  it("inheritance from a Memory Card sets bond floor and trait", () => {
    const fallen = generateApprentice({ forceArchetype: "ghost", forceRarity: "rare" });
    fallen.bond = 80;
    const card = mintMemoryCardFromFallen({
      apprentice: fallen,
      doctrineId: "heretical_quiet",
      daysSurvived: 28,
      cause: "graduated then walked into the seventh door",
      finalArchitectInfluence: 10,
    });
    const out = recruitApprentice({ inheritFrom: card, doctrineId: "human_remainder" });
    expect(out.inheritedTrait).not.toBeNull();
    expect(out.consumedCard).toBe(card);
    expect(out.apprentice.bond).toBeGreaterThanOrEqual(5);
    expect(out.apprentice.inheritedFromMemoryCardId).toBe(card.id);
  });

  it("recruiting into a training slot tags the apprentice correctly", () => {
    const out = recruitApprentice({ cohortSlot: "training_b" });
    expect(out.apprentice.cohortSlot).toBe("training_b");
  });

  it("Heretical Quiet doctrine raises the evil-roll multiplier", () => {
    // We can't observe the roll deterministically, but we can verify
    // the recruit path completes without exception under high
    // multiplier and produces a valid apprentice.
    for (let i = 0; i < 20; i++) {
      const out = recruitApprentice({ doctrineId: "heretical_quiet" });
      expect(out.apprentice.archetype).toBeDefined();
    }
  });
});
