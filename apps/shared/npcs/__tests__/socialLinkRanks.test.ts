// apps/shared/npcs/__tests__/socialLinkRanks.test.ts
//
// Validates the Persona-style 5-rank social-link ladders per character.

import { describe, it, expect } from "vitest";
import {
  SOCIAL_LINK_LADDERS,
  ladderFor,
  rankDef,
  currentSocialLinkRank,
} from "../../socialLinkRanks";
import { NPC_REGISTRY } from "../registry";

describe("SOCIAL_LINK_LADDERS", () => {
  it("ships ladders for the 5 priority Phase 4 characters", () => {
    expect(SOCIAL_LINK_LADDERS.length).toBe(5);
  });

  it("every ladder has exactly 5 ranks (Persona convention)", () => {
    for (const ladder of SOCIAL_LINK_LADDERS) {
      expect(ladder.ranks.length, ladder.npcKey).toBe(5);
    }
  });

  it("ranks are canonically numbered 1..5 in order", () => {
    for (const ladder of SOCIAL_LINK_LADDERS) {
      for (let i = 0; i < ladder.ranks.length; i++) {
        expect(ladder.ranks[i]?.rank, `${ladder.npcKey} rank index ${i}`).toBe(i + 1);
      }
    }
  });

  it("every ladder's npcKey is in the NPC_REGISTRY", () => {
    for (const ladder of SOCIAL_LINK_LADDERS) {
      expect(NPC_REGISTRY[ladder.npcKey], ladder.npcKey).toBeDefined();
    }
  });

  it("every rank has unique setsFlag", () => {
    const flags = new Set<string>();
    for (const ladder of SOCIAL_LINK_LADDERS) {
      for (const rank of ladder.ranks) {
        expect(flags.has(rank.setsFlag), `duplicate flag: ${rank.setsFlag}`).toBe(false);
        flags.add(rank.setsFlag);
      }
    }
  });

  it("every rank has at least one unlock criterion", () => {
    for (const ladder of SOCIAL_LINK_LADDERS) {
      for (const rank of ladder.ranks) {
        const c = rank.unlockCriteria;
        const hasAny =
          c.publicFlag !== undefined ||
          c.minTrustBand !== undefined ||
          c.minInteractions !== undefined ||
          c.minAct !== undefined;
        expect(hasAny, `${ladder.npcKey} rank ${rank.rank}`).toBe(true);
      }
    }
  });
});

describe("ladderFor / rankDef", () => {
  it("ladderFor resolves Locke", () => {
    expect(ladderFor("adjudicator_locke")?.ranks.length).toBe(5);
  });

  it("rankDef resolves specific ranks", () => {
    expect(rankDef("adjudicator_locke", 5)?.label).toContain("Adjudicated");
    expect(rankDef("nilmorg", 4)?.label).toContain("Severance");
    expect(rankDef("wraith_calder", 4)?.label).toContain("Present");
  });

  it("rankDef returns undefined for unknown NPC or rank", () => {
    expect(rankDef("the_human", 5)).toBeUndefined(); // No ladder for the_human
  });
});

describe("currentSocialLinkRank — gating", () => {
  it("returns 0 if no criteria met (fresh player)", () => {
    const result = currentSocialLinkRank("adjudicator_locke", {
      currentRank: 0,
      publicFlags: new Set(),
      flags: new Set(),
      interactions: 0,
      act: 1,
    });
    expect(result).toBe(0);
  });

  it("returns 1 when met_adjudicator_locke flag set", () => {
    const result = currentSocialLinkRank("adjudicator_locke", {
      currentRank: 0,
      publicFlags: new Set(["met_adjudicator_locke"]),
      flags: new Set(),
      interactions: 0,
      act: 1,
    });
    expect(result).toBe(1);
  });

  it("walks up ladder when multiple criteria met", () => {
    const result = currentSocialLinkRank("adjudicator_locke", {
      currentRank: 0,
      publicFlags: new Set(["met_adjudicator_locke"]),
      flags: new Set(),
      trustBand: "Partner",
      trustBandIndex: 2, // Prospect=0, Client=1, Partner=2, Insider=3, Adjudicated=4
      bandOrdinalOf: (b) =>
        ({ Prospect: 0, Client: 1, Partner: 2, Insider: 3, Adjudicated: 4 }[b] ?? -1),
      interactions: 5,
      act: 3,
    });
    expect(result).toBe(3);
  });

  it("Rank 4 Locke requires Insider band AND minAct: 4", () => {
    // Insider band but Act 3 — should NOT advance to rank 4
    const partial = currentSocialLinkRank("adjudicator_locke", {
      currentRank: 0,
      publicFlags: new Set(["met_adjudicator_locke"]),
      flags: new Set(),
      trustBand: "Insider",
      trustBandIndex: 3,
      bandOrdinalOf: (b) =>
        ({ Prospect: 0, Client: 1, Partner: 2, Insider: 3, Adjudicated: 4 }[b] ?? -1),
      interactions: 5,
      act: 3, // Below minAct: 4
    });
    expect(partial).toBe(3);

    // Same context but Act 4 — should advance to rank 4
    const full = currentSocialLinkRank("adjudicator_locke", {
      currentRank: 0,
      publicFlags: new Set(["met_adjudicator_locke"]),
      flags: new Set(),
      trustBand: "Insider",
      trustBandIndex: 3,
      bandOrdinalOf: (b) =>
        ({ Prospect: 0, Client: 1, Partner: 2, Insider: 3, Adjudicated: 4 }[b] ?? -1),
      interactions: 5,
      act: 4,
    });
    expect(full).toBe(4);
  });

  it("Companion rank 4 requires first_word_was_wraith_calder flag", () => {
    const result = currentSocialLinkRank("dmc_clone_companion", {
      currentRank: 3,
      publicFlags: new Set([
        "nilmorg_kept_his_agreement",
        "companion_first_word_was_wraith_calder",
      ]),
      flags: new Set(),
      trustBand: "Inheriting",
      trustBandIndex: 3,
      bandOrdinalOf: (b) =>
        ({ Wary: 0, Witnessed: 1, Present: 2, Inheriting: 3 }[b] ?? -1),
      interactions: 10,
      act: 5,
    });
    expect(result).toBe(4);
  });
});
