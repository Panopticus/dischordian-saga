import { describe, it, expect } from "vitest";
import {
  composeRegistryFromForges,
  buildSignatureRegistry,
  validateSignaturePayload,
  pinSignatureCard,
  verifySignaturePin,
  type SignatureCardPersistedPayload,
} from "./playerCardRegistry";
import { generateApprentice } from "../apprentices";
import { forgeSignatureCard } from "../apprenticeSignatureCard";
import type { CardRegistry } from "./types/GameState";
import type { CardDefinition } from "./types/Card";

function buildPayload(
  archetype: Parameters<typeof generateApprentice>[0] extends infer A
    ? A extends { forceArchetype?: infer X } ? NonNullable<X> : never
    : never = "scholar" as never,
): SignatureCardPersistedPayload {
  const apprentice = generateApprentice({ forceArchetype: archetype, forceRarity: "rare" });
  const out = forgeSignatureCard({
    apprentice,
    doctrineId: "human_remainder",
    pickedSlotId: "battle_cry_recitation",
    bondAtForge: 70,
    corruptionAtForge: 5,
    architectInfluenceAtForge: 20,
    houseId: null,
  });
  return {
    cardId: out.card.id as string,
    card: out.card,
    rulesVersion: out.card.rulesVersion,
  };
}

const emptyGlobal: CardRegistry = {
  get: () => undefined,
  has: () => false,
  listAll: () => [],
};

describe("playerCardRegistry", () => {
  describe("validateSignaturePayload", () => {
    it("accepts a valid payload", () => {
      const p = buildPayload();
      const def = validateSignaturePayload(p);
      expect(def.id).toBe(p.cardId);
    });

    it("rejects a mismatched cardId", () => {
      const p = buildPayload();
      const tampered: SignatureCardPersistedPayload = {
        ...p,
        cardId: "sigcard_someone_else",
      };
      expect(() => validateSignaturePayload(tampered)).toThrow(/id mismatch/);
    });
  });

  describe("composeRegistryFromForges", () => {
    it("delegates to global first, then to player layer", () => {
      const p = buildPayload("ghost");
      const composite = composeRegistryFromForges(emptyGlobal, [p]);
      expect(composite.has(p.cardId)).toBe(true);
      const def = composite.get(p.cardId);
      expect(def?.id).toBe(p.cardId);
    });

    it("listAll includes signature cards", () => {
      const p1 = buildPayload("scholar");
      const p2 = buildPayload("zealot");
      const composite = composeRegistryFromForges(emptyGlobal, [p1, p2]);
      const ids = composite.listAll().map(c => c.id as string);
      expect(ids).toContain(p1.cardId);
      expect(ids).toContain(p2.cardId);
    });

    it("rejects collision with global card id", () => {
      const p = buildPayload();
      const fakeGlobal: CardRegistry = {
        get: (id) => id === p.cardId
          ? ({ id, name: "Ghost", faction: "neutral", cardType: "unit", rarity: "common", cost: 1, baseStats: { power: 1, health: 1 }, keywords: [], abilities: [], art: "x", flavorText: "x", rulesVersion: "1.0.0" } as unknown as CardDefinition)
          : undefined,
        has: (id) => id === p.cardId,
        listAll: () => [],
      };
      expect(() => composeRegistryFromForges(fakeGlobal, [p])).toThrow(/collides/);
    });

    it("rejects duplicate signature card ids", () => {
      const p = buildPayload();
      expect(() => composeRegistryFromForges(emptyGlobal, [p, p])).toThrow(/duplicate/);
    });
  });

  describe("buildSignatureRegistry", () => {
    it("standalone player registry", () => {
      const p = buildPayload();
      const reg = buildSignatureRegistry([p]);
      expect(reg.has(p.cardId)).toBe(true);
      expect(reg.listAll().length).toBe(1);
    });
  });

  describe("replay-pin", () => {
    it("pin + verify on the same payload returns live_compatible", () => {
      const p = buildPayload();
      const pin = pinSignatureCard(p);
      expect(verifySignaturePin(pin, [p])).toBe("live_compatible");
    });

    it("missing pin", () => {
      const p = buildPayload();
      const pin = pinSignatureCard(p);
      expect(verifySignaturePin(pin, [])).toBe("missing");
    });
  });
});
