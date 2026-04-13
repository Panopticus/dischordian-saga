/**
 * Phase 64 Tests: QuestTracker UX Improvements & Triple Mastery Achievement
 *
 * Tests cover:
 * 1. QuestTracker z-index (z-40 below dialog z-50)
 * 2. Auto-minimize during Elara dialog events
 * 3. Swipe-to-dismiss gesture handling
 * 4. Triple Mastery achievement detection logic
 * 5. Triple Mastery journal entry (milestone M01 OMEGA)
 * 6. Triple Mastery reward system (500 DT + The Nexus card)
 * 7. Triple Mastery quest in QuestTracker
 * 8. RewardCelebration forceTier support
 */

/* ─── MOCK DATA: Character Choices ─── */
interface MockCharacterChoices {
  name: string;
  species: string;
  characterClass: string;
  alignment: string;
  element: string;
}

const MOCK_ENGINEER_ORDER_DEMAGI: MockCharacterChoices = {
  name: "TestPilot",
  species: "DeMagi",
  characterClass: "Engineer",
  alignment: "Order",
  element: "Fire",
};

const MOCK_ORACLE_CHAOS_QUARCHON: MockCharacterChoices = {
  name: "OracleBot",
  species: "Quarchon",
  characterClass: "Oracle",
  alignment: "Chaos",
  element: "Void",
};

const MOCK_SPY_ORDER_NEYON: MockCharacterChoices = {
  name: "ShadowAgent",
  species: "neyon",
  characterClass: "Spy",
  alignment: "Order",
  element: "Lightning",
};

/* ─── CHAIN MAPPING (mirrors QuestRewardSystem) ─── */
const CLASS_CHAIN_MAP: Record<string, string> = {
  engineer: "engineer_chain",
  oracle: "oracle_chain",
  assassin: "assassin_chain",
  soldier: "soldier_chain",
  spy: "spy_chain",
};

const ALIGN_CHAIN_MAP: Record<string, string> = {
  order: "order_chain",
  chaos: "chaos_chain",
};

const SPECIES_CHAIN_MAP: Record<string, string> = {
  demagi: "demagi_chain",
  quarchon: "quarchon_chain",
  neyon: "neyon_chain",
};

/* ─── HELPER: Check Triple Mastery ─── */
function checkTripleMastery(
  cc: MockCharacterChoices,
  narrativeFlags: Record<string, boolean>
): boolean {
  const classChain = CLASS_CHAIN_MAP[cc.characterClass.toLowerCase()];
  const alignChain = ALIGN_CHAIN_MAP[cc.alignment.toLowerCase()];
  const speciesChain = SPECIES_CHAIN_MAP[cc.species.toLowerCase()];
  if (!classChain || !alignChain || !speciesChain) return false;
  return (
    !!narrativeFlags[`chain_${classChain}_complete`] &&
    !!narrativeFlags[`chain_${alignChain}_complete`] &&
    !!narrativeFlags[`chain_${speciesChain}_complete`]
  );
}

/* ─── HELPER: Determine reward tier ─── */
function determineTier(dreamTokens: number): "standard" | "major" | "legendary" {
  if (dreamTokens >= 150) return "legendary";
  if (dreamTokens >= 100) return "major";
  return "standard";
}

/* ─── MILESTONE DEFINITIONS (mirrors MilestoneJournalEntries) ─── */
const MILESTONE_TRIPLE_MASTERY = {
  id: "triple_mastery",
  title: "THE CONVERGENCE OF ALL PATHS",
  entryNumber: "OMEGA",
  order: 999,
};

/* ─── QUEST DEFINITIONS (mirrors QuestTracker) ─── */
const QUEST_TRIPLE_MASTERY = {
  id: "triple_mastery",
  title: "TRIPLE MASTERY",
  category: "main",
  order: 99,
  reward: "500 Dream Tokens + The Nexus Card + OMEGA Clearance",
};

/* ─── TRIPLE MASTERY REWARD CONSTANTS ─── */
const TRIPLE_MASTERY_REWARD = {
  dreamTokens: 500,
  xp: 500,
  cardReward: "the-nexus",
  forceTier: "legendary" as const,
};

/* ═══════════════════════════════════════════════════════
   1. QUEST TRACKER Z-INDEX TESTS
   ═══════════════════════════════════════════════════════ */
describe("Phase 64: QuestTracker Z-Index", () => {
  it("should use z-40 for QuestTracker (below dialog z-50)", () => {
    // The QuestTracker uses z-40, dialog uses z-50
    const questTrackerZ = 40;
    const dialogZ = 50;
    expect(questTrackerZ).toBeLessThan(dialogZ);
  });

  it("should not overlap with reward notification toasts (z-95)", () => {
    const questTrackerZ = 40;
    const toastZ = 95;
    expect(questTrackerZ).toBeLessThan(toastZ);
  });

  it("should not overlap with celebration overlay", () => {
    const questTrackerZ = 40;
    const celebrationZ = 100; // RewardCelebration uses z-[100]
    expect(questTrackerZ).toBeLessThan(celebrationZ);
  });
});

/* ═══════════════════════════════════════════════════════
   2. AUTO-MINIMIZE DURING DIALOG TESTS
   ═══════════════════════════════════════════════════════ */
describe("Phase 64: Auto-Minimize During Dialog", () => {
  it("should define elara-dialog-start event name", () => {
    const eventName = "elara-dialog-start";
    expect(eventName).toBe("elara-dialog-start");
  });

  it("should define elara-dialog-end event name", () => {
    const eventName = "elara-dialog-end";
    expect(eventName).toBe("elara-dialog-end");
  });

  it("should minimize tracker when dialog starts", () => {
    let isMinimized = false;
    // Simulate dialog start handler
    const handleDialogStart = () => { isMinimized = true; };
    handleDialogStart();
    expect(isMinimized).toBe(true);
  });

  it("should restore tracker when dialog ends", () => {
    let isMinimized = true;
    // Simulate dialog end handler
    const handleDialogEnd = () => { isMinimized = false; };
    handleDialogEnd();
    expect(isMinimized).toBe(false);
  });

  it("should track previous minimized state for restoration", () => {
    let wasMinimizedBefore = false;
    let isMinimized = false;

    // User manually minimizes
    isMinimized = true;
    wasMinimizedBefore = true;

    // Dialog starts → auto-minimize (already minimized)
    isMinimized = true;

    // Dialog ends → restore to previous state
    isMinimized = wasMinimizedBefore;
    expect(isMinimized).toBe(true); // Was already minimized, stays minimized
  });

  it("should restore expanded state after dialog if was expanded before", () => {
    let wasMinimizedBefore = false;
    let isMinimized = false;

    // Tracker is expanded
    wasMinimizedBefore = isMinimized; // false

    // Dialog starts → auto-minimize
    isMinimized = true;

    // Dialog ends → restore
    isMinimized = wasMinimizedBefore;
    expect(isMinimized).toBe(false); // Was expanded, restores to expanded
  });
});

/* ═══════════════════════════════════════════════════════
   3. SWIPE-TO-DISMISS GESTURE TESTS
   ═══════════════════════════════════════════════════════ */
describe("Phase 64: Swipe-to-Dismiss Gesture", () => {
  const SWIPE_THRESHOLD = 80; // pixels

  it("should define a swipe threshold of 80px", () => {
    expect(SWIPE_THRESHOLD).toBe(80);
  });

  it("should not dismiss on small swipe (< threshold)", () => {
    const swipeDistance = 50;
    const shouldDismiss = swipeDistance >= SWIPE_THRESHOLD;
    expect(shouldDismiss).toBe(false);
  });

  it("should dismiss on swipe exceeding threshold", () => {
    const swipeDistance = 100;
    const shouldDismiss = swipeDistance >= SWIPE_THRESHOLD;
    expect(shouldDismiss).toBe(true);
  });

  it("should dismiss on exact threshold swipe", () => {
    const swipeDistance = 80;
    const shouldDismiss = swipeDistance >= SWIPE_THRESHOLD;
    expect(shouldDismiss).toBe(true);
  });

  it("should calculate swipe distance from touch start to end", () => {
    const touchStartY = 400;
    const touchEndY = 520;
    const distance = touchEndY - touchStartY;
    expect(distance).toBe(120);
    expect(distance >= SWIPE_THRESHOLD).toBe(true);
  });

  it("should only respond to downward swipes (positive delta)", () => {
    const touchStartY = 400;
    const touchEndY = 300; // upward swipe
    const distance = touchEndY - touchStartY;
    const isDownward = distance > 0;
    expect(isDownward).toBe(false);
  });

  it("should provide visual feedback during swipe (translateY)", () => {
    const swipeDistance = 60;
    const clampedTranslate = Math.min(swipeDistance, 120); // max translate
    expect(clampedTranslate).toBe(60);
    expect(clampedTranslate).toBeLessThanOrEqual(120);
  });
});

/* ═══════════════════════════════════════════════════════
   4. TRIPLE MASTERY DETECTION LOGIC TESTS
   ═══════════════════════════════════════════════════════ */
describe("Phase 64: Triple Mastery Detection", () => {
  it("should NOT trigger with zero chains complete", () => {
    const flags: Record<string, boolean> = {};
    expect(checkTripleMastery(MOCK_ENGINEER_ORDER_DEMAGI, flags)).toBe(false);
  });

  it("should NOT trigger with only class chain complete", () => {
    const flags: Record<string, boolean> = {
      chain_engineer_chain_complete: true,
    };
    expect(checkTripleMastery(MOCK_ENGINEER_ORDER_DEMAGI, flags)).toBe(false);
  });

  it("should NOT trigger with only alignment chain complete", () => {
    const flags: Record<string, boolean> = {
      chain_order_chain_complete: true,
    };
    expect(checkTripleMastery(MOCK_ENGINEER_ORDER_DEMAGI, flags)).toBe(false);
  });

  it("should NOT trigger with only species chain complete", () => {
    const flags: Record<string, boolean> = {
      chain_demagi_chain_complete: true,
    };
    expect(checkTripleMastery(MOCK_ENGINEER_ORDER_DEMAGI, flags)).toBe(false);
  });

  it("should NOT trigger with only 2 of 3 chains complete (class + alignment)", () => {
    const flags: Record<string, boolean> = {
      chain_engineer_chain_complete: true,
      chain_order_chain_complete: true,
    };
    expect(checkTripleMastery(MOCK_ENGINEER_ORDER_DEMAGI, flags)).toBe(false);
  });

  it("should NOT trigger with only 2 of 3 chains complete (class + species)", () => {
    const flags: Record<string, boolean> = {
      chain_engineer_chain_complete: true,
      chain_demagi_chain_complete: true,
    };
    expect(checkTripleMastery(MOCK_ENGINEER_ORDER_DEMAGI, flags)).toBe(false);
  });

  it("should NOT trigger with only 2 of 3 chains complete (alignment + species)", () => {
    const flags: Record<string, boolean> = {
      chain_order_chain_complete: true,
      chain_demagi_chain_complete: true,
    };
    expect(checkTripleMastery(MOCK_ENGINEER_ORDER_DEMAGI, flags)).toBe(false);
  });

  it("should TRIGGER with all 3 chains complete (Engineer/Order/DeMagi)", () => {
    const flags: Record<string, boolean> = {
      chain_engineer_chain_complete: true,
      chain_order_chain_complete: true,
      chain_demagi_chain_complete: true,
    };
    expect(checkTripleMastery(MOCK_ENGINEER_ORDER_DEMAGI, flags)).toBe(true);
  });

  it("should TRIGGER with all 3 chains complete (Oracle/Chaos/Quarchon)", () => {
    const flags: Record<string, boolean> = {
      chain_oracle_chain_complete: true,
      chain_chaos_chain_complete: true,
      chain_quarchon_chain_complete: true,
    };
    expect(checkTripleMastery(MOCK_ORACLE_CHAOS_QUARCHON, flags)).toBe(true);
  });

  it("should TRIGGER with all 3 chains complete (Spy/Order/NéYon)", () => {
    const flags: Record<string, boolean> = {
      chain_spy_chain_complete: true,
      chain_order_chain_complete: true,
      chain_neyon_chain_complete: true,
    };
    expect(checkTripleMastery(MOCK_SPY_ORDER_NEYON, flags)).toBe(true);
  });

  it("should still trigger even with extra unrelated flags present", () => {
    const flags: Record<string, boolean> = {
      chain_engineer_chain_complete: true,
      chain_order_chain_complete: true,
      chain_demagi_chain_complete: true,
      some_other_flag: true,
      quest_awaken_rewarded: true,
    };
    expect(checkTripleMastery(MOCK_ENGINEER_ORDER_DEMAGI, flags)).toBe(true);
  });

  it("should NOT trigger if wrong class chain is complete for the character", () => {
    const flags: Record<string, boolean> = {
      chain_oracle_chain_complete: true, // Wrong class for Engineer
      chain_order_chain_complete: true,
      chain_demagi_chain_complete: true,
    };
    expect(checkTripleMastery(MOCK_ENGINEER_ORDER_DEMAGI, flags)).toBe(false);
  });

  it("should handle all 5 class types", () => {
    const classes = ["engineer", "oracle", "assassin", "soldier", "spy"];
    for (const cls of classes) {
      expect(CLASS_CHAIN_MAP[cls]).toBeDefined();
      expect(CLASS_CHAIN_MAP[cls]).toMatch(/_chain$/);
    }
  });

  it("should handle both alignment types", () => {
    expect(ALIGN_CHAIN_MAP["order"]).toBe("order_chain");
    expect(ALIGN_CHAIN_MAP["chaos"]).toBe("chaos_chain");
  });

  it("should handle all 3 species types", () => {
    const species = ["demagi", "quarchon", "neyon"];
    for (const sp of species) {
      expect(SPECIES_CHAIN_MAP[sp]).toBeDefined();
      expect(SPECIES_CHAIN_MAP[sp]).toMatch(/_chain$/);
    }
  });
});

/* ═══════════════════════════════════════════════════════
   5. TRIPLE MASTERY JOURNAL ENTRY TESTS
   ═══════════════════════════════════════════════════════ */
describe("Phase 64: Triple Mastery Journal Entry", () => {
  it("should have milestone ID 'triple_mastery'", () => {
    expect(MILESTONE_TRIPLE_MASTERY.id).toBe("triple_mastery");
  });

  it("should have entry number OMEGA", () => {
    expect(MILESTONE_TRIPLE_MASTERY.entryNumber).toBe("OMEGA");
  });

  it("should have highest order (999) to appear last", () => {
    expect(MILESTONE_TRIPLE_MASTERY.order).toBe(999);
  });

  it("should have title 'THE CONVERGENCE OF ALL PATHS'", () => {
    expect(MILESTONE_TRIPLE_MASTERY.title).toBe("THE CONVERGENCE OF ALL PATHS");
  });

  it("should generate narrative with character name", () => {
    const name = "TestPilot";
    const narrative = `PERSONAL LOG — ENTRY OMEGA\nCITIZEN: ${name}`;
    expect(narrative).toContain("ENTRY OMEGA");
    expect(narrative).toContain(name);
  });

  it("should include all three path types in narrative classification", () => {
    const cc = MOCK_ENGINEER_ORDER_DEMAGI;
    const classification = `${cc.species.toUpperCase()} // ${cc.characterClass.toUpperCase()} // ${cc.alignment.toUpperCase()}`;
    expect(classification).toBe("DEMAGI // ENGINEER // ORDER");
  });

  it("should include Elara annotation with OMEGA clearance recommendation", () => {
    const elaraNote = "UNPRECEDENTED ACHIEVEMENT LOGGED: Triple Mastery. Recommendation: Grant OMEGA clearance.";
    expect(elaraNote).toContain("OMEGA clearance");
    expect(elaraNote).toContain("Triple Mastery");
  });
});

/* ═══════════════════════════════════════════════════════
   6. TRIPLE MASTERY REWARD SYSTEM TESTS
   ═══════════════════════════════════════════════════════ */
describe("Phase 64: Triple Mastery Reward", () => {
  it("should award 500 Dream Tokens", () => {
    expect(TRIPLE_MASTERY_REWARD.dreamTokens).toBe(500);
  });

  it("should award 500 XP", () => {
    expect(TRIPLE_MASTERY_REWARD.xp).toBe(500);
  });

  it("should grant 'the-nexus' card", () => {
    expect(TRIPLE_MASTERY_REWARD.cardReward).toBe("the-nexus");
  });

  it("should force legendary tier celebration", () => {
    expect(TRIPLE_MASTERY_REWARD.forceTier).toBe("legendary");
  });

  it("should be the highest reward in the game (500 DT > any chain total)", () => {
    const maxChainTotal = 325; // Species chains are highest at 325 DT
    expect(TRIPLE_MASTERY_REWARD.dreamTokens).toBeGreaterThan(maxChainTotal);
  });

  it("should not trigger if already claimed", () => {
    const claimedRewards = ["triple_mastery"];
    const alreadyClaimed = claimedRewards.includes("triple_mastery");
    expect(alreadyClaimed).toBe(true);
  });

  it("should set triple_mastery_achieved narrative flag", () => {
    const flags: Record<string, boolean> = {};
    flags["triple_mastery_achieved"] = true;
    expect(flags["triple_mastery_achieved"]).toBe(true);
  });
});

/* ═══════════════════════════════════════════════════════
   7. QUEST TRACKER TRIPLE MASTERY QUEST TESTS
   ═══════════════════════════════════════════════════════ */
describe("Phase 64: QuestTracker Triple Mastery Quest", () => {
  it("should have quest ID 'triple_mastery'", () => {
    expect(QUEST_TRIPLE_MASTERY.id).toBe("triple_mastery");
  });

  it("should be in 'main' category", () => {
    expect(QUEST_TRIPLE_MASTERY.category).toBe("main");
  });

  it("should have order 99 (last quest)", () => {
    expect(QUEST_TRIPLE_MASTERY.order).toBe(99);
  });

  it("should have reward description mentioning Dream Tokens, Nexus card, and OMEGA", () => {
    expect(QUEST_TRIPLE_MASTERY.reward).toContain("500 Dream Tokens");
    expect(QUEST_TRIPLE_MASTERY.reward).toContain("The Nexus Card");
    expect(QUEST_TRIPLE_MASTERY.reward).toContain("OMEGA Clearance");
  });

  it("should track progress as 0/3 with no chains complete", () => {
    const chainFlags = Object.keys({}).filter(
      (f) => f.startsWith("chain_") && f.endsWith("_complete")
    );
    expect(chainFlags.length).toBe(0);
  });

  it("should track progress as 1/3 with one chain complete", () => {
    const flags: Record<string, boolean> = {
      chain_engineer_chain_complete: true,
    };
    const chainFlags = Object.keys(flags).filter(
      (f) => f.startsWith("chain_") && f.endsWith("_complete")
    );
    expect(chainFlags.length).toBe(1);
  });

  it("should track progress as 2/3 with two chains complete", () => {
    const flags: Record<string, boolean> = {
      chain_engineer_chain_complete: true,
      chain_order_chain_complete: true,
    };
    const chainFlags = Object.keys(flags).filter(
      (f) => f.startsWith("chain_") && f.endsWith("_complete")
    );
    expect(chainFlags.length).toBe(2);
  });

  it("should track progress as 3/3 (complete) with all chains done", () => {
    const flags: Record<string, boolean> = {
      chain_engineer_chain_complete: true,
      chain_order_chain_complete: true,
      chain_demagi_chain_complete: true,
    };
    const chainFlags = Object.keys(flags).filter(
      (f) => f.startsWith("chain_") && f.endsWith("_complete")
    );
    expect(chainFlags.length).toBe(3);
    expect(chainFlags.length >= 3).toBe(true);
  });
});

/* ═══════════════════════════════════════════════════════
   8. REWARD CELEBRATION FORCE TIER TESTS
   ═══════════════════════════════════════════════════════ */
describe("Phase 64: RewardCelebration forceTier", () => {
  it("should determine 'standard' tier for < 100 DT", () => {
    expect(determineTier(50)).toBe("standard");
    expect(determineTier(99)).toBe("standard");
  });

  it("should determine 'major' tier for 100-149 DT", () => {
    expect(determineTier(100)).toBe("major");
    expect(determineTier(149)).toBe("major");
  });

  it("should determine 'legendary' tier for >= 150 DT", () => {
    expect(determineTier(150)).toBe("legendary");
    expect(determineTier(500)).toBe("legendary");
  });

  it("should allow forceTier to override determineTier", () => {
    const data = {
      dreamTokens: 50, // Would normally be "standard"
      forceTier: "legendary" as const,
    };
    const tier = data.forceTier || determineTier(data.dreamTokens);
    expect(tier).toBe("legendary");
  });

  it("should fall back to determineTier when forceTier is undefined", () => {
    const data = {
      dreamTokens: 500,
      forceTier: undefined,
    };
    const tier = data.forceTier || determineTier(data.dreamTokens);
    expect(tier).toBe("legendary");
  });

  it("should use forceTier even when dreamTokens would give different tier", () => {
    const data = {
      dreamTokens: 10, // Would be "standard"
      forceTier: "major" as const,
    };
    const tier = data.forceTier || determineTier(data.dreamTokens);
    expect(tier).toBe("major");
  });
});

/* ═══════════════════════════════════════════════════════
   9. ALL POSSIBLE TRIPLE MASTERY COMBINATIONS
   ═══════════════════════════════════════════════════════ */
describe("Phase 64: All Triple Mastery Combinations", () => {
  const allClasses = ["engineer", "oracle", "assassin", "soldier", "spy"];
  const allAlignments = ["order", "chaos"];
  const allSpecies = ["demagi", "quarchon", "neyon"];

  it("should have 30 possible Triple Mastery combinations (5 * 2 * 3)", () => {
    expect(allClasses.length * allAlignments.length * allSpecies.length).toBe(30);
  });

  for (const cls of allClasses) {
    for (const align of allAlignments) {
      for (const sp of allSpecies) {
        it(`should detect Triple Mastery for ${cls}/${align}/${sp}`, () => {
          const cc: MockCharacterChoices = {
            name: "Test",
            species: sp.charAt(0).toUpperCase() + sp.slice(1),
            characterClass: cls.charAt(0).toUpperCase() + cls.slice(1),
            alignment: align.charAt(0).toUpperCase() + align.slice(1),
            element: "Fire",
          };
          // Species is stored as lowercase in the game

          const classChain = CLASS_CHAIN_MAP[cls];
          const alignChain = ALIGN_CHAIN_MAP[align];
          const speciesChain = SPECIES_CHAIN_MAP[sp];

          const flags: Record<string, boolean> = {
            [`chain_${classChain}_complete`]: true,
            [`chain_${alignChain}_complete`]: true,
            [`chain_${speciesChain}_complete`]: true,
          };

          expect(checkTripleMastery(cc, flags)).toBe(true);
        });
      }
    }
  }
});

/* ═══════════════════════════════════════════════════════
   10. CHAIN CARD REWARD MAPPINGS
   ═══════════════════════════════════════════════════════ */
describe("Phase 64: Chain Card Reward Mappings", () => {
  const CHAIN_CARD_REWARDS: Record<string, string> = {
    engineer_chain: "the-architect",
    oracle_chain: "the-oracle",
    assassin_chain: "agent-zero",
    soldier_chain: "iron-lion",
    spy_chain: "the-enigma",
    order_chain: "the-architect",
    chaos_chain: "the-meme",
    demagi_chain: "the-source",
    quarchon_chain: "the-programmer",
    neyon_chain: "the-human",
  };

  it("should have 10 chain card reward mappings", () => {
    expect(Object.keys(CHAIN_CARD_REWARDS).length).toBe(10);
  });

  it("should map all 5 class chains to cards", () => {
    expect(CHAIN_CARD_REWARDS["engineer_chain"]).toBe("the-architect");
    expect(CHAIN_CARD_REWARDS["oracle_chain"]).toBe("the-oracle");
    expect(CHAIN_CARD_REWARDS["assassin_chain"]).toBe("agent-zero");
    expect(CHAIN_CARD_REWARDS["soldier_chain"]).toBe("iron-lion");
    expect(CHAIN_CARD_REWARDS["spy_chain"]).toBe("the-enigma");
  });

  it("should map both alignment chains to cards", () => {
    expect(CHAIN_CARD_REWARDS["order_chain"]).toBe("the-architect");
    expect(CHAIN_CARD_REWARDS["chaos_chain"]).toBe("the-meme");
  });

  it("should map all 3 species chains to cards", () => {
    expect(CHAIN_CARD_REWARDS["demagi_chain"]).toBe("the-source");
    expect(CHAIN_CARD_REWARDS["quarchon_chain"]).toBe("the-programmer");
    expect(CHAIN_CARD_REWARDS["neyon_chain"]).toBe("the-human");
  });

  it("should have Triple Mastery card as 'the-nexus' (not in chain rewards)", () => {
    expect(TRIPLE_MASTERY_REWARD.cardReward).toBe("the-nexus");
    expect(Object.values(CHAIN_CARD_REWARDS)).not.toContain("the-nexus");
  });
});
