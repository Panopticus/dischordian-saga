import { describe, it, expect } from "vitest";
import { generateApprentice } from "./apprentices";
import {
  mintMemoryCardFromFallen,
  buildInheritedTrait,
  isInheritable,
  consumeCard,
  signatureGiftFor,
  inheritedLineFor,
  allSignatureGifts,
} from "./apprenticeMemoryInheritance";

describe("apprenticeMemoryInheritance", () => {
  it("mints a memory card from a fallen apprentice", () => {
    const fallen = generateApprentice({ forceArchetype: "ghost", forceRarity: "rare" });
    fallen.bond = 60;
    fallen.corruption = 30;
    const card = mintMemoryCardFromFallen({
      apprentice: fallen,
      doctrineId: "heretical_quiet",
      daysSurvived: 21,
      cause: "killed by Wanda Wee on Day 21",
      finalArchitectInfluence: 18,
    });
    expect(card.id).toBe(`memcard_${fallen.id}`);
    expect(card.deceasedName).toBe(fallen.name);
    expect(card.archetype).toBe("ghost");
    expect(card.finalBond).toBe(60);
  });

  it("builds an inherited trait with bond floor scaling on final bond", () => {
    const fallen = generateApprentice({ forceArchetype: "scholar" });
    fallen.bond = 80;
    const card = mintMemoryCardFromFallen({
      apprentice: fallen, doctrineId: "human_remainder",
      daysSurvived: 28, cause: "graduated then walked into traffic",
      finalArchitectInfluence: 5,
    });
    const trait = buildInheritedTrait(card);
    expect(trait.fromMemoryCardId).toBe(card.id);
    expect(trait.inheritedLike).toBe(signatureGiftFor("scholar"));
    expect(trait.bondFloor).toBeGreaterThanOrEqual(5);
    expect(trait.bondFloor).toBeLessThanOrEqual(25);
  });

  it("consumed cards are not inheritable", () => {
    const fallen = generateApprentice({ forceArchetype: "zealot" });
    const card = mintMemoryCardFromFallen({
      apprentice: fallen, doctrineId: "compliant_mouth",
      daysSurvived: 12, cause: "broke", finalArchitectInfluence: 50,
    });
    expect(isInheritable(card)).toBe(true);
    const consumed = consumeCard(card, "next-apprentice-id");
    expect(isInheritable(consumed)).toBe(false);
    expect(consumed.consumedByApprenticeId).toBe("next-apprentice-id");
  });

  it("double-consume throws", () => {
    const fallen = generateApprentice({ forceArchetype: "zealot" });
    const card = mintMemoryCardFromFallen({
      apprentice: fallen, doctrineId: null,
      daysSurvived: 1, cause: "trial fail", finalArchitectInfluence: 0,
    });
    const consumed = consumeCard(card, "first-id");
    expect(() => consumeCard(consumed, "second-id")).toThrow(/already consumed/);
  });

  it("transmits at most 30 architectInfluence", () => {
    const fallen = generateApprentice({ forceArchetype: "zealot" });
    const card = mintMemoryCardFromFallen({
      apprentice: fallen, doctrineId: "compliant_mouth",
      daysSurvived: 28, cause: "graduated", finalArchitectInfluence: 100,
    });
    const trait = buildInheritedTrait(card);
    expect(trait.inheritedArchitectInfluence).toBeLessThanOrEqual(30);
  });

  it("every archetype has a signature gift and inherited line", () => {
    const archetypes = ["zealot", "ghost", "scholar", "revenant", "artisan", "oracle",
      "wanderer", "martyr", "heretic", "jester", "sentinel", "prodigal"] as const;
    for (const a of archetypes) {
      expect(signatureGiftFor(a)).toBeTruthy();
      const line = inheritedLineFor(a);
      expect(line.id).toBeTruthy();
      expect(line.text.length).toBeGreaterThan(20);
    }
  });

  it("allSignatureGifts returns 12 distinct gift tags", () => {
    const gifts = allSignatureGifts();
    expect(new Set(gifts).size).toBe(12);
  });
});
