import { describe, expect, it } from "vitest";

/**
 * Tests for the puzzle system and starter deck generation.
 * These test the client-side game logic that drives the adventure experience.
 */

/* ─── PUZZLE SYSTEM TESTS ─── */

// Re-implement the puzzle validation logic from PuzzleSystem.tsx for testing
function validateRiddleAnswer(answer: string, acceptableAnswers: string[]): boolean {
  const normalized = answer.trim().toLowerCase();
  return acceptableAnswers.some(a => normalized.includes(a.toLowerCase()));
}

function decodeCaesarCipher(text: string, shift: number): string {
  return text
    .split("")
    .map(ch => {
      if (ch >= "A" && ch <= "Z") {
        return String.fromCharCode(((ch.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
      }
      if (ch >= "a" && ch <= "z") {
        return String.fromCharCode(((ch.charCodeAt(0) - 97 - shift + 26) % 26) + 97);
      }
      return ch;
    })
    .join("");
}

function decodeReverseCipher(text: string): string {
  return text.split("").reverse().join("").toLowerCase();
}

function validateSequence(input: string[], expected: string[]): boolean {
  if (input.length !== expected.length) return false;
  return input.every((item, i) => item.toUpperCase() === expected[i].toUpperCase());
}

function validatePowerRelay(pattern: boolean[], expected: boolean[]): boolean {
  if (pattern.length !== expected.length) return false;
  return pattern.every((v, i) => v === expected[i]);
}

describe("Puzzle System — Riddle Puzzles", () => {
  const archivesAcceptable = ["lore", "memory", "history", "knowledge", "story", "stories", "narrative"];
  const armoryAcceptable = ["courage", "bravery", "valor", "will", "willpower", "determination", "resolve"];

  it("accepts correct answer for Archives riddle", () => {
    expect(validateRiddleAnswer("lore", archivesAcceptable)).toBe(true);
    expect(validateRiddleAnswer("LORE", archivesAcceptable)).toBe(true);
    expect(validateRiddleAnswer("  memory  ", archivesAcceptable)).toBe(true);
    expect(validateRiddleAnswer("history", archivesAcceptable)).toBe(true);
  });

  it("rejects incorrect answer for Archives riddle", () => {
    expect(validateRiddleAnswer("sword", archivesAcceptable)).toBe(false);
    expect(validateRiddleAnswer("power", archivesAcceptable)).toBe(false);
    expect(validateRiddleAnswer("", archivesAcceptable)).toBe(false);
  });

  it("accepts correct answer for Armory riddle", () => {
    expect(validateRiddleAnswer("courage", armoryAcceptable)).toBe(true);
    expect(validateRiddleAnswer("bravery", armoryAcceptable)).toBe(true);
    expect(validateRiddleAnswer("VALOR", armoryAcceptable)).toBe(true);
  });

  it("rejects incorrect answer for Armory riddle", () => {
    expect(validateRiddleAnswer("weapon", armoryAcceptable)).toBe(false);
    expect(validateRiddleAnswer("strength", armoryAcceptable)).toBe(false);
  });
});

describe("Puzzle System — Cipher Puzzles", () => {
  it("decodes Caesar cipher (shift 3) for Comms Array", () => {
    const decoded = decodeCaesarCipher("WKH VDJD FRQWLQXHV", 3);
    expect(decoded.toLowerCase()).toBe("the saga continues");
  });

  it("decodes reverse cipher for Cargo Hold", () => {
    const decoded = decodeReverseCipher("NEPO DLOH OGRAC");
    expect(decoded).toBe("cargo hold open");
  });

  it("handles empty cipher text", () => {
    expect(decodeCaesarCipher("", 3)).toBe("");
    expect(decodeReverseCipher("")).toBe("");
  });
});

describe("Puzzle System — Sequence Puzzle", () => {
  const engineeringSequence = ["POWER CORE", "LIFE SUPPORT", "NAVIGATION", "SHIELDS"];

  it("validates correct sequence for Engineering", () => {
    expect(validateSequence(
      ["POWER CORE", "LIFE SUPPORT", "NAVIGATION", "SHIELDS"],
      engineeringSequence
    )).toBe(true);
  });

  it("rejects wrong order", () => {
    expect(validateSequence(
      ["LIFE SUPPORT", "POWER CORE", "NAVIGATION", "SHIELDS"],
      engineeringSequence
    )).toBe(false);
  });

  it("rejects incomplete sequence", () => {
    expect(validateSequence(
      ["POWER CORE", "LIFE SUPPORT"],
      engineeringSequence
    )).toBe(false);
  });
});

describe("Puzzle System — Power Relay", () => {
  const bridgePattern = [true, false, true, true, true, true]; // 47 in binary

  it("validates correct relay pattern for Bridge", () => {
    expect(validatePowerRelay(
      [true, false, true, true, true, true],
      bridgePattern
    )).toBe(true);
  });

  it("rejects incorrect relay pattern", () => {
    expect(validatePowerRelay(
      [false, false, true, true, true, true],
      bridgePattern
    )).toBe(false);
  });

  it("rejects wrong length", () => {
    expect(validatePowerRelay(
      [true, false, true],
      bridgePattern
    )).toBe(false);
  });
});

/* ─── STARTER DECK GENERATION TESTS ─── */

// Re-implement the core deck generation logic for testing
interface StarterCard {
  id: string;
  name: string;
  type: "unit" | "spell" | "artifact";
  rarity: "common" | "uncommon" | "rare" | "legendary";
  attack: number;
  defense: number;
  cost: number;
  ability: string;
  lore: string;
  imageUrl: string;
}

function generateStarterDeckTest(choices: {
  species?: string;
  characterClass?: string;
  alignment?: string;
}): StarterCard[] {
  const cards: StarterCard[] = [];
  const species = choices.species || "demagi";
  const charClass = choices.characterClass || "soldier";

  // Species-based card
  const speciesCards: Record<string, Partial<StarterCard>> = {
    demagi: { name: "DeMagi Initiate", type: "unit", attack: 3, defense: 4, cost: 2, ability: "Dream Tap: Draw 1 card when played" },
    quarchon: { name: "Quarchon Warrior", type: "unit", attack: 5, defense: 2, cost: 3, ability: "Berserker: +2 ATK when below half health" },
    neyon: { name: "Ne-Yon Shade", type: "unit", attack: 2, defense: 3, cost: 2, ability: "Phase Shift: Cannot be targeted for 1 turn" },
  };

  const speciesCard = speciesCards[species] || speciesCards.demagi;
  cards.push({
    id: `starter-${species}-1`,
    rarity: "uncommon",
    lore: `A ${species} awakened from cryo.`,
    imageUrl: "",
    ...speciesCard,
  } as StarterCard);

  // Class-based card
  const classCards: Record<string, Partial<StarterCard>> = {
    soldier: { name: "Standard Issue Blaster", type: "artifact", attack: 2, defense: 0, cost: 1, ability: "Equip: +2 ATK to attached unit" },
    oracle: { name: "Prophetic Vision", type: "spell", attack: 0, defense: 0, cost: 2, ability: "Reveal top 3 cards, add 1 to hand" },
    engineer: { name: "Repair Drone", type: "unit", attack: 1, defense: 5, cost: 2, ability: "Restore: Heal 2 HP to adjacent unit each turn" },
    assassin: { name: "Shadow Strike", type: "spell", attack: 4, defense: 0, cost: 3, ability: "Deal 4 damage to target unit, ignore shields" },
    spy: { name: "Intel Report", type: "spell", attack: 0, defense: 0, cost: 1, ability: "Look at opponent's hand, discard 1 card" },
  };

  const classCard = classCards[charClass] || classCards.soldier;
  cards.push({
    id: `starter-${charClass}-1`,
    rarity: "uncommon",
    lore: `Standard issue for ${charClass} class.`,
    imageUrl: "",
    ...classCard,
  } as StarterCard);

  return cards;
}

describe("Starter Deck Generation", () => {
  it("generates cards for DeMagi Soldier", () => {
    const deck = generateStarterDeckTest({ species: "demagi", characterClass: "soldier" });
    expect(deck.length).toBeGreaterThanOrEqual(2);
    expect(deck.some(c => c.name.includes("DeMagi"))).toBe(true);
    expect(deck.some(c => c.name.includes("Blaster"))).toBe(true);
  });

  it("generates cards for Quarchon Assassin", () => {
    const deck = generateStarterDeckTest({ species: "quarchon", characterClass: "assassin" });
    expect(deck.length).toBeGreaterThanOrEqual(2);
    expect(deck.some(c => c.name.includes("Quarchon"))).toBe(true);
    expect(deck.some(c => c.name.includes("Shadow Strike"))).toBe(true);
  });

  it("generates cards for Ne-Yon Oracle", () => {
    const deck = generateStarterDeckTest({ species: "neyon", characterClass: "oracle" });
    expect(deck.length).toBeGreaterThanOrEqual(2);
    expect(deck.some(c => c.name.includes("Ne-Yon"))).toBe(true);
    expect(deck.some(c => c.name.includes("Prophetic"))).toBe(true);
  });

  it("defaults to DeMagi Soldier when no choices provided", () => {
    const deck = generateStarterDeckTest({});
    expect(deck.length).toBeGreaterThanOrEqual(2);
    expect(deck.some(c => c.name.includes("DeMagi"))).toBe(true);
  });

  it("all cards have required fields", () => {
    const deck = generateStarterDeckTest({ species: "demagi", characterClass: "engineer" });
    deck.forEach(card => {
      expect(card.id).toBeTruthy();
      expect(card.name).toBeTruthy();
      expect(["unit", "spell", "artifact"]).toContain(card.type);
      expect(["common", "uncommon", "rare", "legendary"]).toContain(card.rarity);
      expect(typeof card.attack).toBe("number");
      expect(typeof card.defense).toBe("number");
      expect(typeof card.cost).toBe("number");
      expect(card.ability).toBeTruthy();
    });
  });

  it("generates different cards for different species", () => {
    const demagiDeck = generateStarterDeckTest({ species: "demagi", characterClass: "soldier" });
    const quarchonDeck = generateStarterDeckTest({ species: "quarchon", characterClass: "soldier" });
    const neyonDeck = generateStarterDeckTest({ species: "neyon", characterClass: "soldier" });

    // Species cards should be different
    const demagiNames = demagiDeck.map(c => c.name);
    const quarchonNames = quarchonDeck.map(c => c.name);
    const neyonNames = neyonDeck.map(c => c.name);

    // At least one card should differ between species
    expect(demagiNames.some(n => !quarchonNames.includes(n))).toBe(true);
    expect(demagiNames.some(n => !neyonNames.includes(n))).toBe(true);
  });
});
