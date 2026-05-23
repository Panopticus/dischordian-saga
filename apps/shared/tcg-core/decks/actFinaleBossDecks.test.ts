import { describe, it, expect } from "vitest";
import {
  ACT_2_WHISPER_TRIAL_DECK,
  ACT_3_OFFER_TRIAL_DECK,
  ACT_4_HIERARCHY_TRIAL_DECK,
  ACT_5_CODA_TRIAL_DECK,
  ACT_6_CONVERGENCE_TRIAL_DECK,
  ACT_FINALE_DECKS,
  actFinaleDeckFor,
  type ActFinaleId,
} from "./actFinaleBossDecks";
import { ALL_CARD_DEFINITIONS } from "../cards";

const KNOWN_IDS = new Set(ALL_CARD_DEFINITIONS.map((d) => String(d.id)));

const ACT_DECKS: ReadonlyArray<[ActFinaleId, readonly string[]]> = [
  ["act2", ACT_2_WHISPER_TRIAL_DECK],
  ["act3", ACT_3_OFFER_TRIAL_DECK],
  ["act4", ACT_4_HIERARCHY_TRIAL_DECK],
  ["act5", ACT_5_CODA_TRIAL_DECK],
  ["act6", ACT_6_CONVERGENCE_TRIAL_DECK],
];

describe("act-finale boss decks — composition", () => {
  it("every deck contains exactly 39 cards (Authority Trial format)", () => {
    for (const [id, deck] of ACT_DECKS) {
      expect(deck.length, `${id} deck size`).toBe(39);
    }
  });

  it("every card id resolves to a real registry entry", () => {
    for (const [id, deck] of ACT_DECKS) {
      for (const cardId of deck) {
        expect(KNOWN_IDS.has(cardId), `${id}: unknown card "${cardId}"`).toBe(true);
      }
    }
  });

  it("decks are frozen (no accidental in-place mutation)", () => {
    for (const [_, deck] of ACT_DECKS) {
      expect(Object.isFrozen(deck)).toBe(true);
    }
  });
});

describe("ACT_FINALE_DECKS — registry + lookup", () => {
  it("covers act2 through act6 (5 entries)", () => {
    expect(Object.keys(ACT_FINALE_DECKS).sort()).toEqual([
      "act2",
      "act3",
      "act4",
      "act5",
      "act6",
    ]);
  });

  it("actFinaleDeckFor returns the matching deck", () => {
    for (const [id, deck] of ACT_DECKS) {
      expect(actFinaleDeckFor(id)).toBe(deck);
    }
  });
});

describe("act-finale boss decks — thematic anchors", () => {
  it("act2 leans Dreamer + Insurgency (Atarion senate intrigue)", () => {
    // The Dreamer (s1_char_025) and Agent Zero (s1_char_002) must
    // both appear — these are the two faction anchors for the
    // Whisper Trial's cross-pollination beat.
    expect(ACT_2_WHISPER_TRIAL_DECK).toContain("s1_char_025");
    expect(ACT_2_WHISPER_TRIAL_DECK).toContain("s1_char_002");
  });

  it("act3 leans Architect (the Offer is authored)", () => {
    expect(ACT_3_OFFER_TRIAL_DECK).toContain("s1_char_019"); // The Architect
    expect(ACT_3_OFFER_TRIAL_DECK).toContain("s1_spell_101"); // Predetermined Outcome
  });

  it("act4 leans New Babylon enforcement (institutional response)", () => {
    expect(ACT_4_HIERARCHY_TRIAL_DECK).toContain("s1_char_001"); // Adjudicar Locke
    expect(ACT_4_HIERARCHY_TRIAL_DECK).toContain("s1_char_020"); // The Authority
  });

  it("act5 leans Antiquarian (Coda chorus + the ledger)", () => {
    expect(ACT_5_CODA_TRIAL_DECK).toContain("s1_char_018"); // The Antiquarian
    expect(ACT_5_CODA_TRIAL_DECK).toContain("s1_song_066"); // The Book of Daniel
  });

  it("act6 spans many factions (pre-Convergence chaos)", () => {
    // The act 6 deck mixes insurgency, dreamer, architect, new_babylon,
    // antiquarian, and resurrectionist anchors. Count distinct
    // character anchors as a proxy.
    const factionAnchors = [
      "s1_char_010", // Iron Lion (Insurgency)
      "s1_char_025", // The Dreamer
      "s1_char_019", // The Architect
      "s1_char_001", // Adjudicar Locke (New Babylon)
      "s1_char_018", // The Antiquarian
      "s1_char_045", // The Resurrectionist
    ];
    for (const anchor of factionAnchors) {
      expect(ACT_6_CONVERGENCE_TRIAL_DECK).toContain(anchor);
    }
  });
});
