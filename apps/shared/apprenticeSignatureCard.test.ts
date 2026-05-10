import { describe, it, expect } from "vitest";
import { generateApprentice } from "./apprentices";
import {
  forgeSignatureCard,
  signatureCardId,
  eligibleEffectSlots,
  EFFECT_SLOTS,
  type ForgeInput,
} from "./apprenticeSignatureCard";

const baseForge = (overrides: Partial<ForgeInput> = {}): ForgeInput => {
  const apprentice = generateApprentice({ forceArchetype: "scholar", forceRarity: "rare" });
  return {
    apprentice,
    doctrineId: "human_remainder",
    pickedSlotId: "battle_cry_recitation",
    bondAtForge: 70,
    corruptionAtForge: 10,
    architectInfluenceAtForge: 20,
    houseId: "house_umbra",
    ...overrides,
  };
};

describe("apprenticeSignatureCard", () => {
  describe("forgeSignatureCard", () => {
    it("mints a card with stable id", () => {
      const input = baseForge();
      const out = forgeSignatureCard(input);
      expect(out.card.id).toBe(signatureCardId(input.apprentice.id));
    });

    it("rejects effect slots not eligible for the doctrine", () => {
      // stun_keyturn is gated to cold_hand only.
      const input = baseForge({ doctrineId: "compliant_mouth", pickedSlotId: "stun_keyturn" });
      expect(() => forgeSignatureCard(input)).toThrow(/not eligible/);
    });

    it("forge captures bond/corruption/influence in provenance", () => {
      const input = baseForge({ bondAtForge: 88, corruptionAtForge: 4, architectInfluenceAtForge: 15 });
      const out = forgeSignatureCard(input);
      expect(out.provenance.bondAtForge).toBe(88);
      expect(out.provenance.corruptionAtForge).toBe(4);
      expect(out.provenance.architectInfluenceAtForge).toBe(15);
      expect(out.provenance.architectCoopted).toBe(false);
    });

    it("flags architectCoopted at influence ≥ 60", () => {
      const out = forgeSignatureCard(baseForge({ architectInfluenceAtForge: 75 }));
      expect(out.provenance.architectCoopted).toBe(true);
      expect(out.card.flavorText.toLowerCase()).toContain("architect");
    });

    it("Mythic apprentice produces legendary-rarity card", () => {
      const apprentice = generateApprentice({ forceArchetype: "ghost", forceRarity: "mythic" });
      const out = forgeSignatureCard(baseForge({ apprentice, doctrineId: "heretical_quiet", pickedSlotId: "rebirth_silence" }));
      expect(out.card.rarity).toBe("legendary");
    });

    it("trial_categories sorted in canonical order", () => {
      const out = forgeSignatureCard(baseForge({ doctrineId: "heretical_quiet", pickedSlotId: "rebirth_silence" }));
      const cats = out.card.trial_categories ?? [];
      const ORDER = ["confession", "defensive", "evidence", "narrative", "offensive", "reactive"];
      const indices = cats.map(c => ORDER.indexOf(c));
      const sorted = [...indices].sort((a, b) => a - b);
      expect(indices).toEqual(sorted);
    });
  });

  describe("eligibleEffectSlots", () => {
    it("Cold Hand can pick stun_keyturn; Compliant Mouth cannot", () => {
      const cold = eligibleEffectSlots("cold_hand").map(s => s.id);
      expect(cold).toContain("stun_keyturn");
      const compliant = eligibleEffectSlots("compliant_mouth").map(s => s.id);
      expect(compliant).not.toContain("stun_keyturn");
    });

    it("every doctrine has at least 2 eligible slots", () => {
      for (const d of ["compliant_mouth", "forked_path", "cold_hand", "heretical_quiet", "human_remainder"] as const) {
        expect(eligibleEffectSlots(d).length).toBeGreaterThanOrEqual(2);
      }
    });
  });

  describe("EFFECT_SLOTS catalog", () => {
    it("declares all 6 slots with non-empty descriptions", () => {
      expect(Object.keys(EFFECT_SLOTS).length).toBe(6);
      for (const s of Object.values(EFFECT_SLOTS)) {
        expect(s.description.length).toBeGreaterThan(20);
      }
    });
  });
});
