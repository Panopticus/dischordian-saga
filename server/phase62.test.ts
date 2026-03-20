/* ═══════════════════════════════════════════════════════
   PHASE 62 TESTS — Quest Chain Reward Claiming,
   Species-Specific Quest Chains, and Chain Journal Entries
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";

/* ─── IMPORT CHAIN SYSTEM ─── */
import {
  ALL_QUEST_CHAINS,
  matchesRequirement,
  type ChainCheckContext,
} from "../client/src/components/QuestChainSystem";

/* ─── IMPORT REWARD SYSTEM EXPORTS ─── */
import {
  QUEST_REWARDS,
  QUEST_TITLES,
} from "../client/src/components/QuestRewardSystem";

/* ─── IMPORT MILESTONE ENTRIES ─── */
import {
  MILESTONES,
  type MilestoneCheckContext,
} from "../client/src/components/MilestoneJournalEntries";

/* ─── HELPER: Default chain check context ─── */
function makeChainCtx(overrides: Partial<ChainCheckContext> = {}): ChainCheckContext {
  return {
    characterChoices: {
      name: "TestOp",
      species: "demagi",
      characterClass: "engineer",
      alignment: "order",
      element: "fire",
    },
    totalRoomsUnlocked: 0,
    totalItemsFound: 0,
    narrativeFlags: {},
    completedGames: [],
    collectedCards: [],
    discoveredCount: 0,
    fightWins: 0,
    totalFights: 0,
    winStreak: 0,
    solvedPuzzles: [],
    ...overrides,
  };
}

/* ─── HELPER: Default milestone check context ─── */
function makeMilestoneCtx(overrides: Partial<MilestoneCheckContext> = {}): MilestoneCheckContext {
  return {
    characterCreated: true,
    characterChoices: {
      name: "TestOp",
      species: "demagi",
      characterClass: "engineer",
      alignment: "order",
      element: "fire",
    },
    totalRoomsUnlocked: 0,
    totalItemsFound: 0,
    narrativeFlags: {},
    claimedQuestRewards: [],
    completedGames: [],
    collectedCards: [],
    fightWins: 0,
    fightLosses: 0,
    totalFights: 0,
    winStreak: 0,
    ...overrides,
  };
}

/* ═══════════════════════════════════════════════════════
   1. SPECIES-SPECIFIC QUEST CHAINS
   ═══════════════════════════════════════════════════════ */
describe("Species-Specific Quest Chains", () => {
  it("should include DeMagi, Quarchon, and Ne-Yon chains", () => {
    const chainIds = ALL_QUEST_CHAINS.map(c => c.id);
    expect(chainIds).toContain("demagi_chain");
    expect(chainIds).toContain("quarchon_chain");
    expect(chainIds).toContain("neyon_chain");
  });

  it("should have 10 total chains (5 class + 2 alignment + 3 species)", () => {
    expect(ALL_QUEST_CHAINS.length).toBe(10);
  });

  describe("DeMagi Chain — The Elemental Heritage", () => {
    const chain = ALL_QUEST_CHAINS.find(c => c.id === "demagi_chain")!;

    it("should exist with correct name", () => {
      expect(chain.chainName).toBe("THE ELEMENTAL HERITAGE");
    });

    it("should require species demagi", () => {
      expect(chain.requirement.species).toBe("demagi");
    });

    it("should have 4 quests", () => {
      expect(chain.quests.length).toBe(4);
    });

    it("should match DeMagi characters", () => {
      expect(matchesRequirement(chain.requirement, { species: "demagi", characterClass: "engineer", alignment: "order", element: "fire", name: "Test" })).toBe(true);
      expect(matchesRequirement(chain.requirement, { species: "quarchon", characterClass: "engineer", alignment: "order", element: "fire", name: "Test" })).toBe(false);
    });

    it("quest 1 (Elemental Resonance) should complete at 3 rooms", () => {
      const ctx = makeChainCtx({ totalRoomsUnlocked: 2 });
      expect(chain.quests[0].check(ctx).complete).toBe(false);
      expect(chain.quests[0].check(ctx).progress).toBe(2);

      const ctx2 = makeChainCtx({ totalRoomsUnlocked: 3 });
      expect(chain.quests[0].check(ctx2).complete).toBe(true);
    });

    it("quest 2 (Primal Awakening) should require 3 fight wins", () => {
      const ctx = makeChainCtx({ fightWins: 2 });
      expect(chain.quests[1].check(ctx).complete).toBe(false);

      const ctx2 = makeChainCtx({ fightWins: 3 });
      expect(chain.quests[1].check(ctx2).complete).toBe(true);
    });

    it("quest 3 (Blood of the Ancients) should require 20 entries + 6 items", () => {
      const ctx = makeChainCtx({ discoveredCount: 20, totalItemsFound: 5 });
      expect(chain.quests[2].check(ctx).complete).toBe(false);

      const ctx2 = makeChainCtx({ discoveredCount: 20, totalItemsFound: 6 });
      expect(chain.quests[2].check(ctx2).complete).toBe(true);
    });

    it("quest 4 (Elemental Sovereign) should require 8 wins + 7 rooms + 10 cards", () => {
      const ctx = makeChainCtx({ fightWins: 8, totalRoomsUnlocked: 7, collectedCards: new Array(9).fill("c") });
      expect(chain.quests[3].check(ctx).complete).toBe(false);

      const ctx2 = makeChainCtx({ fightWins: 8, totalRoomsUnlocked: 7, collectedCards: new Array(10).fill("c") });
      expect(chain.quests[3].check(ctx2).complete).toBe(true);
    });

    it("should award 325 total Dream Tokens across all quests", () => {
      const total = chain.quests.reduce((sum, q) => sum + q.rewardDreamTokens, 0);
      expect(total).toBe(325);
    });
  });

  describe("Quarchon Chain — The Quantum Directive", () => {
    const chain = ALL_QUEST_CHAINS.find(c => c.id === "quarchon_chain")!;

    it("should exist with correct name", () => {
      expect(chain.chainName).toBe("THE QUANTUM DIRECTIVE");
    });

    it("should require species quarchon", () => {
      expect(chain.requirement.species).toBe("quarchon");
    });

    it("should have 4 quests", () => {
      expect(chain.quests.length).toBe(4);
    });

    it("quest 1 (Quantum Calibration) should require 2 solved puzzles", () => {
      const ctx = makeChainCtx({ solvedPuzzles: ["p1"] });
      expect(chain.quests[0].check(ctx).complete).toBe(false);

      const ctx2 = makeChainCtx({ solvedPuzzles: ["p1", "p2"] });
      expect(chain.quests[0].check(ctx2).complete).toBe(true);
    });

    it("quest 2 (Neural Network Expansion) should require 15 entries + 4 rooms", () => {
      const ctx = makeChainCtx({ discoveredCount: 15, totalRoomsUnlocked: 3 });
      expect(chain.quests[1].check(ctx).complete).toBe(false);

      const ctx2 = makeChainCtx({ discoveredCount: 15, totalRoomsUnlocked: 4 });
      expect(chain.quests[1].check(ctx2).complete).toBe(true);
    });

    it("quest 3 (Probability Cascade) should require 5 wins + 2 games", () => {
      const ctx = makeChainCtx({ fightWins: 5, completedGames: ["g1"] });
      expect(chain.quests[2].check(ctx).complete).toBe(false);

      const ctx2 = makeChainCtx({ fightWins: 5, completedGames: ["g1", "g2"] });
      expect(chain.quests[2].check(ctx2).complete).toBe(true);
    });

    it("quest 4 (Quantum Singularity) should require 35 entries + 15 cards + 8 rooms", () => {
      const ctx = makeChainCtx({ discoveredCount: 35, collectedCards: new Array(15).fill("c"), totalRoomsUnlocked: 7 });
      expect(chain.quests[3].check(ctx).complete).toBe(false);

      const ctx2 = makeChainCtx({ discoveredCount: 35, collectedCards: new Array(15).fill("c"), totalRoomsUnlocked: 8 });
      expect(chain.quests[3].check(ctx2).complete).toBe(true);
    });

    it("should award 325 total Dream Tokens", () => {
      const total = chain.quests.reduce((sum, q) => sum + q.rewardDreamTokens, 0);
      expect(total).toBe(325);
    });
  });

  describe("Ne-Yon Chain — The Hybrid Convergence", () => {
    const chain = ALL_QUEST_CHAINS.find(c => c.id === "neyon_chain")!;

    it("should exist with correct name", () => {
      expect(chain.chainName).toBe("THE HYBRID CONVERGENCE");
    });

    it("should require species neyon", () => {
      expect(chain.requirement.species).toBe("neyon");
    });

    it("should have 4 quests", () => {
      expect(chain.quests.length).toBe(4);
    });

    it("quest 1 (Dual-Core Synchronization) should require 3 rooms + 2 items", () => {
      const ctx = makeChainCtx({ totalRoomsUnlocked: 3, totalItemsFound: 1 });
      expect(chain.quests[0].check(ctx).complete).toBe(false);

      const ctx2 = makeChainCtx({ totalRoomsUnlocked: 3, totalItemsFound: 2 });
      expect(chain.quests[0].check(ctx2).complete).toBe(true);
    });

    it("quest 2 (Bridging the Divide) should require 1 game + 2 wins", () => {
      const ctx = makeChainCtx({ completedGames: ["g1"], fightWins: 1 });
      expect(chain.quests[1].check(ctx).complete).toBe(false);

      const ctx2 = makeChainCtx({ completedGames: ["g1"], fightWins: 2 });
      expect(chain.quests[1].check(ctx2).complete).toBe(true);
    });

    it("quest 3 (Adaptive Evolution) should require 25 entries + 8 cards + 1 puzzle", () => {
      const ctx = makeChainCtx({ discoveredCount: 25, collectedCards: new Array(8).fill("c"), solvedPuzzles: [] });
      expect(chain.quests[2].check(ctx).complete).toBe(false);

      const ctx2 = makeChainCtx({ discoveredCount: 25, collectedCards: new Array(8).fill("c"), solvedPuzzles: ["p1"] });
      expect(chain.quests[2].check(ctx2).complete).toBe(true);
    });

    it("quest 4 (Convergence Point) should require 7 wins + 8 rooms + 40 entries", () => {
      const ctx = makeChainCtx({ fightWins: 7, totalRoomsUnlocked: 8, discoveredCount: 39 });
      expect(chain.quests[3].check(ctx).complete).toBe(false);

      const ctx2 = makeChainCtx({ fightWins: 7, totalRoomsUnlocked: 8, discoveredCount: 40 });
      expect(chain.quests[3].check(ctx2).complete).toBe(true);
    });

    it("should award 325 total Dream Tokens", () => {
      const total = chain.quests.reduce((sum, q) => sum + q.rewardDreamTokens, 0);
      expect(total).toBe(325);
    });
  });

  it("each species chain should have unique quest IDs", () => {
    const speciesChains = ALL_QUEST_CHAINS.filter(c =>
      ["demagi_chain", "quarchon_chain", "neyon_chain"].includes(c.id)
    );
    const allIds = speciesChains.flatMap(c => c.quests.map(q => q.id));
    const uniqueIds = new Set(allIds);
    expect(allIds.length).toBe(uniqueIds.size);
  });

  it("species chains should only match their respective species", () => {
    const demagiChar = { species: "demagi", characterClass: "engineer", alignment: "order", element: "fire", name: "Test" };
    const quarchonChar = { species: "quarchon", characterClass: "engineer", alignment: "order", element: "fire", name: "Test" };
    const neyonChar = { species: "neyon", characterClass: "engineer", alignment: "order", element: "fire", name: "Test" };

    const demagi = ALL_QUEST_CHAINS.find(c => c.id === "demagi_chain")!;
    const quarchon = ALL_QUEST_CHAINS.find(c => c.id === "quarchon_chain")!;
    const neyon = ALL_QUEST_CHAINS.find(c => c.id === "neyon_chain")!;

    // DeMagi chain only matches DeMagi
    expect(matchesRequirement(demagi.requirement, demagiChar)).toBe(true);
    expect(matchesRequirement(demagi.requirement, quarchonChar)).toBe(false);
    expect(matchesRequirement(demagi.requirement, neyonChar)).toBe(false);

    // Quarchon chain only matches Quarchon
    expect(matchesRequirement(quarchon.requirement, quarchonChar)).toBe(true);
    expect(matchesRequirement(quarchon.requirement, demagiChar)).toBe(false);

    // Ne-Yon chain only matches Ne-Yon
    expect(matchesRequirement(neyon.requirement, neyonChar)).toBe(true);
    expect(matchesRequirement(neyon.requirement, demagiChar)).toBe(false);
  });
});

/* ═══════════════════════════════════════════════════════
   2. QUEST CHAIN REWARD CLAIMING
   ═══════════════════════════════════════════════════════ */
describe("Quest Chain Reward Claiming", () => {
  it("QUEST_REWARDS should have 8 base quest rewards", () => {
    expect(QUEST_REWARDS.length).toBe(8);
  });

  it("QUEST_TITLES should map all 8 quest IDs", () => {
    expect(Object.keys(QUEST_TITLES).length).toBe(8);
    for (const reward of QUEST_REWARDS) {
      expect(QUEST_TITLES[reward.questId]).toBeDefined();
    }
  });

  it("every quest reward should have positive dreamTokens and xp", () => {
    for (const reward of QUEST_REWARDS) {
      expect(reward.dreamTokens).toBeGreaterThan(0);
      expect(reward.xp).toBeGreaterThan(0);
    }
  });

  it("full_access quest should reward the-architect card", () => {
    const fullAccess = QUEST_REWARDS.find(r => r.questId === "full_access");
    expect(fullAccess?.cardReward).toBe("the-architect");
  });

  it("discover_50_entries quest should reward the-oracle card", () => {
    const deep = QUEST_REWARDS.find(r => r.questId === "discover_50_entries");
    expect(deep?.cardReward).toBe("the-oracle");
  });

  it("all chain quests should have prerequisite chains", () => {
    for (const chain of ALL_QUEST_CHAINS) {
      // First quest should have no prerequisite
      expect(chain.quests[0].prerequisite).toBeNull();
      // Subsequent quests should reference previous quest
      for (let i = 1; i < chain.quests.length; i++) {
        expect(chain.quests[i].prerequisite).toBe(chain.quests[i - 1].id);
      }
    }
  });

  it("all chain quests should have positive reward values", () => {
    for (const chain of ALL_QUEST_CHAINS) {
      for (const quest of chain.quests) {
        expect(quest.rewardDreamTokens).toBeGreaterThan(0);
        expect(quest.rewardXp).toBeGreaterThan(0);
      }
    }
  });

  it("each player gets exactly 3 chains (class + alignment + species)", () => {
    const chars = [
      { species: "demagi", characterClass: "engineer", alignment: "order", element: "fire", name: "T" },
      { species: "quarchon", characterClass: "oracle", alignment: "chaos", element: "fire", name: "T" },
      { species: "neyon", characterClass: "assassin", alignment: "order", element: "fire", name: "T" },
    ];

    for (const char of chars) {
      const matching = ALL_QUEST_CHAINS.filter(c => matchesRequirement(c.requirement, char));
      expect(matching.length).toBe(3);
    }
  });
});

/* ═══════════════════════════════════════════════════════
   3. CHAIN COMPLETION JOURNAL ENTRIES
   ═══════════════════════════════════════════════════════ */
describe("Chain Completion Journal Entries", () => {
  const chainEntries = MILESTONES.filter(m => m.id.startsWith("chain_"));

  it("should have 10 chain completion journal entries", () => {
    expect(chainEntries.length).toBe(10);
  });

  it("should have entries for all 5 class chains", () => {
    const classEntries = chainEntries.filter(m =>
      ["chain_engineer_complete", "chain_oracle_complete", "chain_assassin_complete",
       "chain_soldier_complete", "chain_spy_complete"].includes(m.id)
    );
    expect(classEntries.length).toBe(5);
  });

  it("should have entries for both alignment chains", () => {
    const alignEntries = chainEntries.filter(m =>
      ["chain_order_complete", "chain_chaos_complete"].includes(m.id)
    );
    expect(alignEntries.length).toBe(2);
  });

  it("should have entries for all 3 species chains", () => {
    const speciesEntries = chainEntries.filter(m =>
      ["chain_demagi_complete", "chain_quarchon_complete", "chain_neyon_complete"].includes(m.id)
    );
    expect(speciesEntries.length).toBe(3);
  });

  it("chain entries should have higher order than regular milestones (excluding triple_mastery)", () => {
    const regularMax = Math.max(
      ...MILESTONES.filter(m => !m.id.startsWith("chain_") && m.id !== "triple_mastery").map(m => m.order)
    );
    const chainMin = Math.min(...chainEntries.map(m => m.order));
    expect(chainMin).toBeGreaterThan(regularMax);
  });

  it("engineer chain entry should check for chain_engineer_chain_complete flag", () => {
    const entry = MILESTONES.find(m => m.id === "chain_engineer_complete")!;
    const ctx = makeMilestoneCtx({ narrativeFlags: {} });
    expect(entry.check(ctx)).toBe(false);

    const ctx2 = makeMilestoneCtx({ narrativeFlags: { chain_engineer_chain_complete: true } });
    expect(entry.check(ctx2)).toBe(true);
  });

  it("oracle chain entry should check for chain_oracle_chain_complete flag", () => {
    const entry = MILESTONES.find(m => m.id === "chain_oracle_complete")!;
    const ctx = makeMilestoneCtx({ narrativeFlags: { chain_oracle_chain_complete: true } });
    expect(entry.check(ctx)).toBe(true);
  });

  it("demagi chain entry should check for chain_demagi_chain_complete flag", () => {
    const entry = MILESTONES.find(m => m.id === "chain_demagi_complete")!;
    const ctx = makeMilestoneCtx({ narrativeFlags: { chain_demagi_chain_complete: true } });
    expect(entry.check(ctx)).toBe(true);
  });

  it("quarchon chain entry should check for chain_quarchon_chain_complete flag", () => {
    const entry = MILESTONES.find(m => m.id === "chain_quarchon_complete")!;
    const ctx = makeMilestoneCtx({ narrativeFlags: { chain_quarchon_chain_complete: true } });
    expect(entry.check(ctx)).toBe(true);
  });

  it("neyon chain entry should check for chain_neyon_chain_complete flag", () => {
    const entry = MILESTONES.find(m => m.id === "chain_neyon_complete")!;
    const ctx = makeMilestoneCtx({ narrativeFlags: { chain_neyon_chain_complete: true } });
    expect(entry.check(ctx)).toBe(true);
  });

  it("chain entries should generate narratives with character name", () => {
    for (const entry of chainEntries) {
      const ctx = makeMilestoneCtx({
        narrativeFlags: { [`${entry.id.replace("_complete", "_chain_complete")}`]: true },
      });
      const narrative = entry.generateNarrative(ctx);
      expect(narrative).toContain("TestOp");
      expect(narrative).toContain("PERSONAL LOG");
    }
  });

  it("chain entries should have Elara notes", () => {
    for (const entry of chainEntries) {
      const ctx = makeMilestoneCtx();
      const note = entry.elaraNote(ctx);
      expect(note.length).toBeGreaterThan(50);
      expect(note).toContain("CHAIN MASTERY ACHIEVED");
    }
  });

  it("demagi chain entry should reference the element in Elara's note", () => {
    const entry = MILESTONES.find(m => m.id === "chain_demagi_complete")!;
    const ctx = makeMilestoneCtx({
      characterChoices: { name: "TestOp", species: "demagi", characterClass: "engineer", alignment: "order", element: "fire" },
    });
    const note = entry.elaraNote(ctx);
    expect(note).toContain("fire");
  });

  it("all chain entry numbers should use C prefix", () => {
    for (const entry of chainEntries) {
      expect(entry.entryNumber).toMatch(/^C\d{2}$/);
    }
  });

  it("class chain entries should have order 200-204", () => {
    const classEntries = chainEntries.filter(m =>
      ["chain_engineer_complete", "chain_oracle_complete", "chain_assassin_complete",
       "chain_soldier_complete", "chain_spy_complete"].includes(m.id)
    );
    for (const entry of classEntries) {
      expect(entry.order).toBeGreaterThanOrEqual(200);
      expect(entry.order).toBeLessThanOrEqual(204);
    }
  });

  it("alignment chain entries should have order 210-211", () => {
    const alignEntries = chainEntries.filter(m =>
      ["chain_order_complete", "chain_chaos_complete"].includes(m.id)
    );
    for (const entry of alignEntries) {
      expect(entry.order).toBeGreaterThanOrEqual(210);
      expect(entry.order).toBeLessThanOrEqual(211);
    }
  });

  it("species chain entries should have order 220-222", () => {
    const speciesEntries = chainEntries.filter(m =>
      ["chain_demagi_complete", "chain_quarchon_complete", "chain_neyon_complete"].includes(m.id)
    );
    for (const entry of speciesEntries) {
      expect(entry.order).toBeGreaterThanOrEqual(220);
      expect(entry.order).toBeLessThanOrEqual(222);
    }
  });
});

/* ═══════════════════════════════════════════════════════
   4. CHAIN STRUCTURE INTEGRITY
   ═══════════════════════════════════════════════════════ */
describe("Chain Structure Integrity", () => {
  it("all chains should have unique IDs", () => {
    const ids = ALL_QUEST_CHAINS.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all quest IDs across all chains should be unique", () => {
    const allQuestIds = ALL_QUEST_CHAINS.flatMap(c => c.quests.map(q => q.id));
    expect(new Set(allQuestIds).size).toBe(allQuestIds.length);
  });

  it("all chains should have at least 3 quests", () => {
    for (const chain of ALL_QUEST_CHAINS) {
      expect(chain.quests.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("all chains should have ordered quests (1, 2, 3, ...)", () => {
    for (const chain of ALL_QUEST_CHAINS) {
      for (let i = 0; i < chain.quests.length; i++) {
        expect(chain.quests[i].order).toBe(i + 1);
      }
    }
  });

  it("prerequisite chains should be valid", () => {
    for (const chain of ALL_QUEST_CHAINS) {
      for (const quest of chain.quests) {
        if (quest.prerequisite) {
          const prereqExists = chain.quests.some(q => q.id === quest.prerequisite);
          expect(prereqExists).toBe(true);
        }
      }
    }
  });

  it("every chain should have a non-empty description", () => {
    for (const chain of ALL_QUEST_CHAINS) {
      expect(chain.chainDescription.length).toBeGreaterThan(20);
    }
  });

  it("every quest should have a non-empty hint", () => {
    for (const chain of ALL_QUEST_CHAINS) {
      for (const quest of chain.quests) {
        expect(quest.hint.length).toBeGreaterThan(10);
      }
    }
  });

  it("total Dream Tokens across all chains should be substantial", () => {
    const total = ALL_QUEST_CHAINS.reduce(
      (sum, chain) => sum + chain.quests.reduce((s, q) => s + q.rewardDreamTokens, 0),
      0
    );
    // 10 chains × ~300 DT each = ~3000 DT
    expect(total).toBeGreaterThan(2500);
  });
});

/* ═══════════════════════════════════════════════════════
   5. PLAYER JOURNEY SIMULATION
   ═══════════════════════════════════════════════════════ */
describe("Player Journey Simulation", () => {
  it("DeMagi Engineer Order player should have exactly 3 active chains", () => {
    const char = { species: "demagi", characterClass: "engineer", alignment: "order", element: "fire", name: "Kael" };
    const active = ALL_QUEST_CHAINS.filter(c => matchesRequirement(c.requirement, char));
    expect(active.map(c => c.id)).toEqual(
      expect.arrayContaining(["engineer_chain", "order_chain", "demagi_chain"])
    );
    expect(active.length).toBe(3);
  });

  it("Quarchon Oracle Chaos player should have exactly 3 active chains", () => {
    const char = { species: "quarchon", characterClass: "oracle", alignment: "chaos", element: "fire", name: "Zyx" };
    const active = ALL_QUEST_CHAINS.filter(c => matchesRequirement(c.requirement, char));
    expect(active.map(c => c.id)).toEqual(
      expect.arrayContaining(["oracle_chain", "chaos_chain", "quarchon_chain"])
    );
    expect(active.length).toBe(3);
  });

  it("Ne-Yon Spy Order player should have exactly 3 active chains", () => {
    const char = { species: "neyon", characterClass: "spy", alignment: "order", element: "fire", name: "Nyx" };
    const active = ALL_QUEST_CHAINS.filter(c => matchesRequirement(c.requirement, char));
    expect(active.map(c => c.id)).toEqual(
      expect.arrayContaining(["spy_chain", "order_chain", "neyon_chain"])
    );
    expect(active.length).toBe(3);
  });

  it("completing all 3 chains should trigger 3 journal entries", () => {
    const ctx = makeMilestoneCtx({
      narrativeFlags: {
        chain_engineer_chain_complete: true,
        chain_order_chain_complete: true,
        chain_demagi_chain_complete: true,
      },
    });
    const achieved = MILESTONES.filter(m => m.id.startsWith("chain_") && m.check(ctx));
    expect(achieved.length).toBe(3);
  });

  it("no chain journal entries should appear without completion flags", () => {
    const ctx = makeMilestoneCtx({ narrativeFlags: {} });
    const achieved = MILESTONES.filter(m => m.id.startsWith("chain_") && m.check(ctx));
    expect(achieved.length).toBe(0);
  });
});
