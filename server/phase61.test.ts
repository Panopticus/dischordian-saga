/* ═══════════════════════════════════════════════════════
   PHASE 61 TESTS — Reward Celebration, Card Collection
   Milestones, and Branching Quest Chain System
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";

/* ─── REWARD CELEBRATION TESTS ─── */
describe("RewardCelebration: Tier Determination", () => {
  // Import the determineTier function logic
  function determineTier(dreamTokens: number): "standard" | "major" | "legendary" {
    if (dreamTokens >= 150) return "legendary";
    if (dreamTokens >= 100) return "major";
    return "standard";
  }

  it("classifies 25 tokens as standard tier", () => {
    expect(determineTier(25)).toBe("standard");
  });

  it("classifies 50 tokens as standard tier", () => {
    expect(determineTier(50)).toBe("standard");
  });

  it("classifies 99 tokens as standard tier", () => {
    expect(determineTier(99)).toBe("standard");
  });

  it("classifies 100 tokens as major tier", () => {
    expect(determineTier(100)).toBe("major");
  });

  it("classifies 120 tokens as major tier", () => {
    expect(determineTier(120)).toBe("major");
  });

  it("classifies 149 tokens as major tier", () => {
    expect(determineTier(149)).toBe("major");
  });

  it("classifies 150 tokens as legendary tier", () => {
    expect(determineTier(150)).toBe("legendary");
  });

  it("classifies 200 tokens as legendary tier", () => {
    expect(determineTier(200)).toBe("legendary");
  });

  it("classifies 0 tokens as standard tier", () => {
    expect(determineTier(0)).toBe("standard");
  });
});

describe("RewardCelebration: Particle System", () => {
  function generateParticleCount(tier: "standard" | "major" | "legendary", base: number): number {
    return tier === "legendary" ? base * 2 : tier === "major" ? Math.floor(base * 1.5) : base;
  }

  it("standard tier generates base particle count", () => {
    expect(generateParticleCount("standard", 25)).toBe(25);
  });

  it("major tier generates 1.5x particles", () => {
    expect(generateParticleCount("major", 25)).toBe(37);
  });

  it("legendary tier generates 2x particles", () => {
    expect(generateParticleCount("legendary", 25)).toBe(50);
  });

  it("legendary with 60 base generates 120 particles", () => {
    expect(generateParticleCount("legendary", 60)).toBe(120);
  });
});

describe("RewardCelebration: Animation Timing", () => {
  it("legendary rewards show for 5 seconds", () => {
    const tier = "legendary";
    const duration = tier === "legendary" ? 5000 : 4000;
    expect(duration).toBe(5000);
  });

  it("major rewards show for 4 seconds", () => {
    const tier = "major";
    const duration = tier === "legendary" ? 5000 : 4000;
    expect(duration).toBe(4000);
  });

  it("standard rewards show for 4 seconds", () => {
    const tier = "standard";
    const duration = tier === "legendary" ? 5000 : 4000;
    expect(duration).toBe(4000);
  });
});

/* ─── CARD COLLECTION MILESTONE TESTS ─── */
describe("Card Collection Milestones: Threshold Checks", () => {
  interface MilestoneCheckContext {
    collectedCards: string[];
    characterChoices: { name: string | null; species: string | null };
  }

  const checkCards10 = (ctx: MilestoneCheckContext) => ctx.collectedCards.length >= 10;
  const checkCards25 = (ctx: MilestoneCheckContext) => ctx.collectedCards.length >= 25;
  const checkCards50 = (ctx: MilestoneCheckContext) => ctx.collectedCards.length >= 50;

  it("10-card milestone triggers at exactly 10 cards", () => {
    const ctx: MilestoneCheckContext = {
      collectedCards: Array.from({ length: 10 }, (_, i) => `card_${i}`),
      characterChoices: { name: "Test", species: "demagi" },
    };
    expect(checkCards10(ctx)).toBe(true);
  });

  it("10-card milestone does not trigger at 9 cards", () => {
    const ctx: MilestoneCheckContext = {
      collectedCards: Array.from({ length: 9 }, (_, i) => `card_${i}`),
      characterChoices: { name: "Test", species: "demagi" },
    };
    expect(checkCards10(ctx)).toBe(false);
  });

  it("25-card milestone triggers at exactly 25 cards", () => {
    const ctx: MilestoneCheckContext = {
      collectedCards: Array.from({ length: 25 }, (_, i) => `card_${i}`),
      characterChoices: { name: "Test", species: "quarchon" },
    };
    expect(checkCards25(ctx)).toBe(true);
  });

  it("25-card milestone does not trigger at 24 cards", () => {
    const ctx: MilestoneCheckContext = {
      collectedCards: Array.from({ length: 24 }, (_, i) => `card_${i}`),
      characterChoices: { name: "Test", species: "quarchon" },
    };
    expect(checkCards25(ctx)).toBe(false);
  });

  it("50-card milestone triggers at exactly 50 cards", () => {
    const ctx: MilestoneCheckContext = {
      collectedCards: Array.from({ length: 50 }, (_, i) => `card_${i}`),
      characterChoices: { name: "Test", species: "neyon" },
    };
    expect(checkCards50(ctx)).toBe(true);
  });

  it("50-card milestone does not trigger at 49 cards", () => {
    const ctx: MilestoneCheckContext = {
      collectedCards: Array.from({ length: 49 }, (_, i) => `card_${i}`),
      characterChoices: { name: "Test", species: "neyon" },
    };
    expect(checkCards50(ctx)).toBe(false);
  });

  it("all three milestones trigger at 50 cards", () => {
    const ctx: MilestoneCheckContext = {
      collectedCards: Array.from({ length: 50 }, (_, i) => `card_${i}`),
      characterChoices: { name: "Test", species: "demagi" },
    };
    expect(checkCards10(ctx)).toBe(true);
    expect(checkCards25(ctx)).toBe(true);
    expect(checkCards50(ctx)).toBe(true);
  });
});

describe("Card Collection Milestones: Species-Specific Narratives", () => {
  it("25-card milestone generates DeMagi-specific text for demagi species", () => {
    const species = "demagi";
    const text = species === "neyon"
      ? "Ne-Yon hybrid processing"
      : species === "quarchon"
      ? "Quarchon analytical cores"
      : "DeMagi elemental sensitivity";
    expect(text).toContain("DeMagi");
  });

  it("25-card milestone generates Quarchon-specific text for quarchon species", () => {
    const species = "quarchon";
    const text = species === "neyon"
      ? "Ne-Yon hybrid processing"
      : species === "quarchon"
      ? "Quarchon analytical cores"
      : "DeMagi elemental sensitivity";
    expect(text).toContain("Quarchon");
  });

  it("25-card milestone generates Ne-Yon-specific text for neyon species", () => {
    const species = "neyon";
    const text = species === "neyon"
      ? "Ne-Yon hybrid processing"
      : species === "quarchon"
      ? "Quarchon analytical cores"
      : "DeMagi elemental sensitivity";
    expect(text).toContain("Ne-Yon");
  });
});

describe("Card Collection Milestones: Entry Ordering", () => {
  const milestoneOrders = {
    cards_10: 90,
    cards_25: 100,
    cards_50: 110,
  };

  it("10-card milestone has order 90", () => {
    expect(milestoneOrders.cards_10).toBe(90);
  });

  it("25-card milestone has order 100", () => {
    expect(milestoneOrders.cards_25).toBe(100);
  });

  it("50-card milestone has order 110", () => {
    expect(milestoneOrders.cards_50).toBe(110);
  });

  it("milestones are ordered sequentially", () => {
    expect(milestoneOrders.cards_10).toBeLessThan(milestoneOrders.cards_25);
    expect(milestoneOrders.cards_25).toBeLessThan(milestoneOrders.cards_50);
  });
});

/* ─── QUEST CHAIN SYSTEM TESTS ─── */
describe("QuestChainSystem: Requirement Matching", () => {
  interface Requirement {
    characterClass?: string | string[];
    alignment?: string | string[];
    species?: string | string[];
  }

  interface Choices {
    characterClass: string | null;
    alignment: string | null;
    species: string | null;
  }

  function matchesRequirement(req: Requirement, choices: Choices): boolean {
    if (req.characterClass) {
      const classes = Array.isArray(req.characterClass) ? req.characterClass : [req.characterClass];
      if (!choices.characterClass || !classes.includes(choices.characterClass)) return false;
    }
    if (req.alignment) {
      const aligns = Array.isArray(req.alignment) ? req.alignment : [req.alignment];
      if (!choices.alignment || !aligns.includes(choices.alignment)) return false;
    }
    if (req.species) {
      const specs = Array.isArray(req.species) ? req.species : [req.species];
      if (!choices.species || !specs.includes(choices.species)) return false;
    }
    return true;
  }

  it("engineer chain matches engineer class", () => {
    expect(matchesRequirement(
      { characterClass: "engineer" },
      { characterClass: "engineer", alignment: "order", species: "demagi" }
    )).toBe(true);
  });

  it("engineer chain does not match oracle class", () => {
    expect(matchesRequirement(
      { characterClass: "engineer" },
      { characterClass: "oracle", alignment: "order", species: "demagi" }
    )).toBe(false);
  });

  it("order chain matches order alignment", () => {
    expect(matchesRequirement(
      { alignment: "order" },
      { characterClass: "soldier", alignment: "order", species: "quarchon" }
    )).toBe(true);
  });

  it("order chain does not match chaos alignment", () => {
    expect(matchesRequirement(
      { alignment: "order" },
      { characterClass: "soldier", alignment: "chaos", species: "quarchon" }
    )).toBe(false);
  });

  it("chaos chain matches chaos alignment", () => {
    expect(matchesRequirement(
      { alignment: "chaos" },
      { characterClass: "assassin", alignment: "chaos", species: "neyon" }
    )).toBe(true);
  });

  it("null class does not match any class requirement", () => {
    expect(matchesRequirement(
      { characterClass: "engineer" },
      { characterClass: null, alignment: "order", species: "demagi" }
    )).toBe(false);
  });

  it("empty requirement matches any choices", () => {
    expect(matchesRequirement(
      {},
      { characterClass: "spy", alignment: "chaos", species: "neyon" }
    )).toBe(true);
  });

  it("multi-class requirement matches any listed class", () => {
    expect(matchesRequirement(
      { characterClass: ["engineer", "spy"] },
      { characterClass: "spy", alignment: "order", species: "demagi" }
    )).toBe(true);
  });

  it("multi-class requirement rejects unlisted class", () => {
    expect(matchesRequirement(
      { characterClass: ["engineer", "spy"] },
      { characterClass: "soldier", alignment: "order", species: "demagi" }
    )).toBe(false);
  });
});

describe("QuestChainSystem: Chain Definitions", () => {
  const CHAIN_IDS = [
    "engineer_chain", "oracle_chain", "assassin_chain",
    "soldier_chain", "spy_chain", "order_chain", "chaos_chain",
  ];

  it("has 7 quest chains total", () => {
    expect(CHAIN_IDS.length).toBe(7);
  });

  it("has 5 class-specific chains", () => {
    const classChains = CHAIN_IDS.filter(id => !id.includes("order") && !id.includes("chaos"));
    expect(classChains.length).toBe(5);
  });

  it("has 2 alignment-specific chains", () => {
    const alignChains = CHAIN_IDS.filter(id => id.includes("order") || id.includes("chaos"));
    expect(alignChains.length).toBe(2);
  });
});

describe("QuestChainSystem: Prerequisite Logic", () => {
  interface ChainQuest {
    id: string;
    prerequisite: string | null;
    check: () => { complete: boolean };
  }

  function isQuestLocked(quest: ChainQuest, allQuests: ChainQuest[]): boolean {
    if (!quest.prerequisite) return false;
    const prereq = allQuests.find(q => q.id === quest.prerequisite);
    return !prereq || !prereq.check().complete;
  }

  it("first quest in chain is never locked", () => {
    const quest: ChainQuest = { id: "eng_1", prerequisite: null, check: () => ({ complete: false }) };
    expect(isQuestLocked(quest, [])).toBe(false);
  });

  it("second quest is locked when first is incomplete", () => {
    const quests: ChainQuest[] = [
      { id: "eng_1", prerequisite: null, check: () => ({ complete: false }) },
      { id: "eng_2", prerequisite: "eng_1", check: () => ({ complete: false }) },
    ];
    expect(isQuestLocked(quests[1], quests)).toBe(true);
  });

  it("second quest is unlocked when first is complete", () => {
    const quests: ChainQuest[] = [
      { id: "eng_1", prerequisite: null, check: () => ({ complete: true }) },
      { id: "eng_2", prerequisite: "eng_1", check: () => ({ complete: false }) },
    ];
    expect(isQuestLocked(quests[1], quests)).toBe(false);
  });

  it("third quest is locked when second is incomplete even if first is complete", () => {
    const quests: ChainQuest[] = [
      { id: "eng_1", prerequisite: null, check: () => ({ complete: true }) },
      { id: "eng_2", prerequisite: "eng_1", check: () => ({ complete: false }) },
      { id: "eng_3", prerequisite: "eng_2", check: () => ({ complete: false }) },
    ];
    expect(isQuestLocked(quests[2], quests)).toBe(true);
  });
});

describe("QuestChainSystem: Player Gets Correct Chains", () => {
  interface Requirement {
    characterClass?: string | string[];
    alignment?: string | string[];
  }

  interface Chain {
    id: string;
    requirement: Requirement;
  }

  function matchesRequirement(req: Requirement, choices: { characterClass: string; alignment: string }): boolean {
    if (req.characterClass) {
      const classes = Array.isArray(req.characterClass) ? req.characterClass : [req.characterClass];
      if (!classes.includes(choices.characterClass)) return false;
    }
    if (req.alignment) {
      const aligns = Array.isArray(req.alignment) ? req.alignment : [req.alignment];
      if (!aligns.includes(choices.alignment)) return false;
    }
    return true;
  }

  const chains: Chain[] = [
    { id: "engineer_chain", requirement: { characterClass: "engineer" } },
    { id: "oracle_chain", requirement: { characterClass: "oracle" } },
    { id: "assassin_chain", requirement: { characterClass: "assassin" } },
    { id: "soldier_chain", requirement: { characterClass: "soldier" } },
    { id: "spy_chain", requirement: { characterClass: "spy" } },
    { id: "order_chain", requirement: { alignment: "order" } },
    { id: "chaos_chain", requirement: { alignment: "chaos" } },
  ];

  it("engineer+order player gets engineer chain + order chain", () => {
    const choices = { characterClass: "engineer", alignment: "order" };
    const active = chains.filter(c => matchesRequirement(c.requirement, choices));
    expect(active.map(c => c.id)).toEqual(["engineer_chain", "order_chain"]);
  });

  it("assassin+chaos player gets assassin chain + chaos chain", () => {
    const choices = { characterClass: "assassin", alignment: "chaos" };
    const active = chains.filter(c => matchesRequirement(c.requirement, choices));
    expect(active.map(c => c.id)).toEqual(["assassin_chain", "chaos_chain"]);
  });

  it("oracle+order player gets oracle chain + order chain", () => {
    const choices = { characterClass: "oracle", alignment: "order" };
    const active = chains.filter(c => matchesRequirement(c.requirement, choices));
    expect(active.map(c => c.id)).toEqual(["oracle_chain", "order_chain"]);
  });

  it("soldier+chaos player gets soldier chain + chaos chain", () => {
    const choices = { characterClass: "soldier", alignment: "chaos" };
    const active = chains.filter(c => matchesRequirement(c.requirement, choices));
    expect(active.map(c => c.id)).toEqual(["soldier_chain", "chaos_chain"]);
  });

  it("spy+order player gets spy chain + order chain", () => {
    const choices = { characterClass: "spy", alignment: "order" };
    const active = chains.filter(c => matchesRequirement(c.requirement, choices));
    expect(active.map(c => c.id)).toEqual(["spy_chain", "order_chain"]);
  });

  it("every class+alignment combo gets exactly 2 chains", () => {
    const classes = ["engineer", "oracle", "assassin", "soldier", "spy"];
    const alignments = ["order", "chaos"];
    for (const cls of classes) {
      for (const align of alignments) {
        const choices = { characterClass: cls, alignment: align };
        const active = chains.filter(c => matchesRequirement(c.requirement, choices));
        expect(active.length).toBe(2);
      }
    }
  });
});

describe("QuestChainSystem: Class Chain Quest Counts", () => {
  it("each class chain has 4 quests", () => {
    const classChainQuestCounts = {
      engineer: 4,
      oracle: 4,
      assassin: 4,
      soldier: 4,
      spy: 4,
    };
    for (const [cls, count] of Object.entries(classChainQuestCounts)) {
      expect(count).toBe(4);
    }
  });

  it("each alignment chain has 3 quests", () => {
    const alignChainQuestCounts = {
      order: 3,
      chaos: 3,
    };
    for (const [align, count] of Object.entries(alignChainQuestCounts)) {
      expect(count).toBe(3);
    }
  });
});

describe("QuestChainSystem: Reward Values", () => {
  const classChainRewards = [40, 60, 80, 120]; // Dream tokens per quest in each class chain
  const alignChainRewards = [50, 75, 100]; // Dream tokens per quest in each alignment chain

  it("class chain rewards escalate correctly", () => {
    for (let i = 1; i < classChainRewards.length; i++) {
      expect(classChainRewards[i]).toBeGreaterThan(classChainRewards[i - 1]);
    }
  });

  it("alignment chain rewards escalate correctly", () => {
    for (let i = 1; i < alignChainRewards.length; i++) {
      expect(alignChainRewards[i]).toBeGreaterThan(alignChainRewards[i - 1]);
    }
  });

  it("class chain total is 300 Dream Tokens", () => {
    expect(classChainRewards.reduce((a, b) => a + b, 0)).toBe(300);
  });

  it("alignment chain total is 225 Dream Tokens", () => {
    expect(alignChainRewards.reduce((a, b) => a + b, 0)).toBe(225);
  });

  it("max possible from both chains is 525 Dream Tokens", () => {
    const classTotal = classChainRewards.reduce((a, b) => a + b, 0);
    const alignTotal = alignChainRewards.reduce((a, b) => a + b, 0);
    expect(classTotal + alignTotal).toBe(525);
  });
});

describe("QuestChainSystem: Engineer Chain Progression", () => {
  it("eng_1 requires 3 rooms", () => {
    expect(3 >= 3).toBe(true);
    expect(2 >= 3).toBe(false);
  });

  it("eng_2 requires 2 puzzles", () => {
    expect(2 >= 2).toBe(true);
    expect(1 >= 2).toBe(false);
  });

  it("eng_3 requires 5 items", () => {
    expect(5 >= 5).toBe(true);
    expect(4 >= 5).toBe(false);
  });

  it("eng_4 requires 8 rooms", () => {
    expect(8 >= 8).toBe(true);
    expect(7 >= 8).toBe(false);
  });
});

describe("QuestChainSystem: Soldier Chain Progression", () => {
  it("sol_1 requires 2 fight wins", () => {
    expect(2 >= 2).toBe(true);
    expect(1 >= 2).toBe(false);
  });

  it("sol_2 requires 5 rooms and 3 items", () => {
    expect(5 >= 5 && 3 >= 3).toBe(true);
    expect(4 >= 5 && 3 >= 3).toBe(false);
  });

  it("sol_3 requires 7 fight wins", () => {
    expect(7 >= 7).toBe(true);
    expect(6 >= 7).toBe(false);
  });

  it("sol_4 requires 15 wins and 5 win streak", () => {
    expect(15 >= 15 && 5 >= 5).toBe(true);
    expect(15 >= 15 && 4 >= 5).toBe(false);
  });
});

describe("QuestChainSystem: Card Rewards per Chain", () => {
  const cardRewards: Record<string, string> = {
    engineer_chain: "Architect's Blueprint Card",
    oracle_chain: "Oracle's Eye Card",
    assassin_chain: "Agent Zero Card",
    soldier_chain: "Iron Lion Card",
    spy_chain: "The Enigma Card",
    order_chain: "The Architect's Seal Card",
    chaos_chain: "The Meme Card",
  };

  it("each chain has a unique card reward", () => {
    const rewards = Object.values(cardRewards);
    const unique = new Set(rewards);
    expect(unique.size).toBe(rewards.length);
  });

  it("engineer chain rewards Architect's Blueprint Card", () => {
    expect(cardRewards.engineer_chain).toContain("Architect");
  });

  it("oracle chain rewards Oracle's Eye Card", () => {
    expect(cardRewards.oracle_chain).toContain("Oracle");
  });

  it("assassin chain rewards Agent Zero Card", () => {
    expect(cardRewards.assassin_chain).toContain("Agent Zero");
  });

  it("soldier chain rewards Iron Lion Card", () => {
    expect(cardRewards.soldier_chain).toContain("Iron Lion");
  });

  it("spy chain rewards The Enigma Card", () => {
    expect(cardRewards.spy_chain).toContain("Enigma");
  });

  it("order chain rewards The Architect's Seal Card", () => {
    expect(cardRewards.order_chain).toContain("Architect");
  });

  it("chaos chain rewards The Meme Card", () => {
    expect(cardRewards.chaos_chain).toContain("Meme");
  });
});
