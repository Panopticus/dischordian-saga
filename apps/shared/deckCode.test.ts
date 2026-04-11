import { describe, it, expect } from "vitest";
import { encodeDeckCode, decodeDeckCode, DECK_CODE_PREFIX } from "./deckCode";

describe("deckCode", () => {
  const sample = [
    { cardId: "dsc_flame_01", quantity: 3 },
    { cardId: "dsc_shield_02", quantity: 2 },
    { cardId: "dsc_rare_legendary", quantity: 1 },
  ];

  it("round-trips a deck through encode → decode", () => {
    const code = encodeDeckCode(sample);
    expect(code.startsWith(DECK_CODE_PREFIX)).toBe(true);
    const decoded = decodeDeckCode(code);
    expect(decoded).not.toBeNull();
    expect(decoded?.version).toBe(1);
    expect(decoded?.cards).toEqual(sample);
  });

  it("rejects the empty deck", () => {
    expect(() => encodeDeckCode([])).toThrow();
  });

  it("rejects invalid quantities", () => {
    expect(() => encodeDeckCode([{ cardId: "a", quantity: 0 }])).toThrow();
    expect(() => encodeDeckCode([{ cardId: "a", quantity: -1 }])).toThrow();
  });

  it("returns null for codes without the DS1 prefix", () => {
    expect(decodeDeckCode("notavaliddeckcode")).toBeNull();
    expect(decodeDeckCode("")).toBeNull();
  });

  it("returns null for tampered payloads", () => {
    expect(decodeDeckCode(DECK_CODE_PREFIX + "!!!not-base64!!!")).toBeNull();
    expect(decodeDeckCode(DECK_CODE_PREFIX + "eyJ")).toBeNull(); // truncated JSON
  });

  it("returns null when quantity is out of range", () => {
    // Hand-craft a payload with qty=5 (above the 4-copy limit)
    const payload = JSON.stringify({ v: 1, c: [["card_a", 5]] });
    const code = DECK_CODE_PREFIX + Buffer.from(payload).toString("base64url");
    expect(decodeDeckCode(code)).toBeNull();
  });

  it("returns null when version mismatches", () => {
    const payload = JSON.stringify({ v: 99, c: [["card_a", 1]] });
    const code = DECK_CODE_PREFIX + Buffer.from(payload).toString("base64url");
    expect(decodeDeckCode(code)).toBeNull();
  });

  it("produces codes that decode back to the same cardList shape", () => {
    const code = encodeDeckCode([{ cardId: "only_one", quantity: 1 }]);
    const decoded = decodeDeckCode(code);
    expect(decoded?.cards).toHaveLength(1);
    expect(decoded?.cards[0].cardId).toBe("only_one");
  });
});
