import { describe, it, expect } from "vitest";

import { GALACTIC_FACTIONS } from "@/game/tradeEmpire";
import { FACTIONS as CARD_FACTIONS } from "./tcg-core/cards/schema";
import { FACTION_IDS as STANDING_FACTION_IDS } from "./factions";
import {
  CROSSWALK,
  CANONICAL_FACTION_IDS,
  CARD_NEUTRAL_IS_SENTINEL,
  fromStanding,
  fromCard,
  fromTradeEmpire,
  getCanonical,
} from "./factionCrosswalk";

describe("factionCrosswalk — coverage", () => {
  it("every standing FactionId has a crosswalk entry", () => {
    for (const id of STANDING_FACTION_IDS) {
      expect(() => fromStanding(id)).not.toThrow();
      expect(fromStanding(id).standing).toBe(id);
    }
  });

  it("every card-engine Faction except the `neutral` sentinel has a crosswalk entry", () => {
    for (const faction of CARD_FACTIONS) {
      if (faction === CARD_NEUTRAL_IS_SENTINEL) {
        expect(fromCard(faction)).toBeNull();
        continue;
      }
      const entry = fromCard(faction);
      expect(entry).not.toBeNull();
      expect(entry?.card).toBe(faction);
    }
  });

  it("every Trade Empire GalacticFactionId has a crosswalk entry", () => {
    for (const id of Object.keys(GALACTIC_FACTIONS) as Array<
      keyof typeof GALACTIC_FACTIONS
    >) {
      expect(() => fromTradeEmpire(id)).not.toThrow();
      expect(fromTradeEmpire(id).tradeEmpire).toBe(id);
    }
  });

  it("every canonical entry maps to at least one registry (no orphans)", () => {
    for (const id of CANONICAL_FACTION_IDS) {
      const entry = CROSSWALK[id];
      const mapped =
        (entry.standing !== null) ||
        (entry.card !== null) ||
        (entry.tradeEmpire !== null);
      expect(mapped).toBe(true);
    }
  });

  it("registry mappings are unique across canonical entries (no double-mapping)", () => {
    const standings = new Set<string>();
    const cards = new Set<string>();
    const tradeEmpires = new Set<string>();
    for (const entry of Object.values(CROSSWALK)) {
      if (entry.standing) {
        expect(standings.has(entry.standing)).toBe(false);
        standings.add(entry.standing);
      }
      if (entry.card) {
        expect(cards.has(entry.card)).toBe(false);
        cards.add(entry.card);
      }
      if (entry.tradeEmpire) {
        expect(tradeEmpires.has(entry.tradeEmpire)).toBe(false);
        tradeEmpires.add(entry.tradeEmpire);
      }
    }
  });
});

describe("factionCrosswalk — round-trip", () => {
  it("standing → entry → standing is identity", () => {
    for (const id of STANDING_FACTION_IDS) {
      const entry = fromStanding(id);
      expect(entry.standing).toBe(id);
    }
  });

  it("card → entry → card is identity for non-sentinel values", () => {
    for (const faction of CARD_FACTIONS) {
      if (faction === CARD_NEUTRAL_IS_SENTINEL) continue;
      const entry = fromCard(faction);
      expect(entry?.card).toBe(faction);
    }
  });

  it("trade empire → entry → trade empire is identity", () => {
    for (const id of Object.keys(GALACTIC_FACTIONS) as Array<
      keyof typeof GALACTIC_FACTIONS
    >) {
      const entry = fromTradeEmpire(id);
      expect(entry.tradeEmpire).toBe(id);
    }
  });

  it("canonical id → entry → id is identity", () => {
    for (const id of CANONICAL_FACTION_IDS) {
      expect(getCanonical(id).id).toBe(id);
    }
  });
});

describe("factionCrosswalk — load-bearing canonical decisions", () => {
  it("the player's faction (Potentials) is Trade-Empire-only by canon", () => {
    const entry = getCanonical("potentials");
    expect(entry.standing).toBeNull();
    expect(entry.card).toBeNull();
    expect(entry.tradeEmpire).toBe("potentials");
  });

  it("Thaloria has no card faction (Hierophant material is filed under Insurgency or Neutral cards)", () => {
    const entry = getCanonical("thaloria");
    expect(entry.card).toBeNull();
    expect(entry.tradeEmpire).toBe("thaloria");
  });

  it("Panopticon is cards-only at the top-level (folds into AE court at sub-house tier)", () => {
    const entry = getCanonical("panopticon");
    expect(entry.card).toBe("panopticon");
    expect(entry.tradeEmpire).toBeNull();
    expect(entry.standing).toBeNull();
  });

  it("the four standing-only gaps (Antiquarian, Thought Virus, Panopticon, Thaloria, Potentials, Independent) are explicitly null in standing", () => {
    expect(getCanonical("antiquarian_circle").standing).toBeNull();
    expect(getCanonical("thought_virus").standing).toBeNull();
    expect(getCanonical("panopticon").standing).toBeNull();
    expect(getCanonical("thaloria").standing).toBeNull();
    expect(getCanonical("potentials").standing).toBeNull();
    expect(getCanonical("independent_civilizations").standing).toBeNull();
  });

  it("the five standing-tracked entities map to their standing ids", () => {
    expect(getCanonical("architect_order").standing).toBe("architect_remnants");
    expect(getCanonical("dreamer_order").standing).toBe("dreamers_children");
    expect(getCanonical("new_babylon").standing).toBe("new_babylon");
    expect(getCanonical("hierarchy_of_damned").standing).toBe("hierarchy");
    expect(getCanonical("insurgency").standing).toBe("insurgency");
  });

  it("naming-divergence cases — different ids in different registries — resolve via the crosswalk", () => {
    expect(fromStanding("architect_remnants").card).toBe("architect");
    expect(fromStanding("architect_remnants").tradeEmpire).toBe(
      "artificial_empire",
    );
    expect(fromCard("architect")?.standing).toBe("architect_remnants");
    expect(fromCard("hierarchy_of_damned")?.standing).toBe("hierarchy");
    expect(fromTradeEmpire("dreamer_shield").card).toBe("dreamer");
  });
});
