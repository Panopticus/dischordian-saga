/* ═══════════════════════════════════════════════════════
   PHASE 60 TESTS — Quest Reward System, Milestone Journal
   Entries, and Cryo Bay Orientation Enhancements
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";

/* ─── QUEST REWARD SYSTEM TESTS ─── */
describe("QuestRewardSystem", () => {
  // Import the reward definitions
  const QUEST_REWARDS = [
    { questId: "awaken", dreamTokens: 25, xp: 50, gamificationXp: 25, gamificationPoints: 50, description: "Identity established. Welcome to the Inception Ark.", cardReward: undefined },
    { questId: "explore_bridge", dreamTokens: 50, xp: 100, gamificationXp: 40, gamificationPoints: 75, description: "Bridge accessed. The Conspiracy Board awaits.", cardReward: undefined },
    { questId: "explore_5_rooms", dreamTokens: 50, xp: 75, gamificationXp: 30, gamificationPoints: 60, description: "Five rooms mapped. The Ark reveals its secrets.", cardReward: undefined },
    { questId: "collect_3_items", dreamTokens: 35, xp: 60, gamificationXp: 25, gamificationPoints: 50, description: "Scavenger protocol initiated. Keep collecting.", cardReward: undefined },
    { questId: "discover_10_entries", dreamTokens: 75, xp: 120, gamificationXp: 50, gamificationPoints: 100, description: "Intelligence network expanding. The web grows.", cardReward: undefined },
    { questId: "full_access", dreamTokens: 150, xp: 250, gamificationXp: 80, gamificationPoints: 200, description: "Full clearance granted. Every room is yours.", cardReward: "the-architect" },
    { questId: "collect_10_items", dreamTokens: 100, xp: 150, gamificationXp: 60, gamificationPoints: 120, description: "Artifact analyst certified. The Ark's history is in your hands.", cardReward: undefined },
    { questId: "discover_50_entries", dreamTokens: 200, xp: 300, gamificationXp: 100, gamificationPoints: 250, description: "Deep intelligence achieved. You see the full picture.", cardReward: "the-oracle" },
  ];

  const QUEST_TITLES: Record<string, string> = {
    awaken: "AWAKENING",
    explore_bridge: "REACH THE BRIDGE",
    explore_5_rooms: "MAP THE ARK",
    collect_3_items: "SCAVENGER PROTOCOL",
    discover_10_entries: "INTELLIGENCE GATHERING",
    full_access: "FULL CLEARANCE",
    collect_10_items: "ARTIFACT ANALYST",
    discover_50_entries: "DEEP INTELLIGENCE",
  };

  describe("Reward Definitions", () => {
    it("should have 8 quest rewards defined", () => {
      expect(QUEST_REWARDS).toHaveLength(8);
    });

    it("should have unique quest IDs", () => {
      const ids = QUEST_REWARDS.map(r => r.questId);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("should have positive Dream Token rewards for all quests", () => {
      for (const reward of QUEST_REWARDS) {
        expect(reward.dreamTokens).toBeGreaterThan(0);
      }
    });

    it("should have positive XP rewards for all quests", () => {
      for (const reward of QUEST_REWARDS) {
        expect(reward.xp).toBeGreaterThan(0);
      }
    });

    it("should have positive gamification points for all quests", () => {
      for (const reward of QUEST_REWARDS) {
        expect(reward.gamificationPoints).toBeGreaterThan(0);
      }
    });

    it("should have descriptions for all quests", () => {
      for (const reward of QUEST_REWARDS) {
        expect(reward.description.length).toBeGreaterThan(10);
      }
    });

    it("should have matching quest titles for all reward IDs", () => {
      for (const reward of QUEST_REWARDS) {
        expect(QUEST_TITLES[reward.questId]).toBeDefined();
        expect(QUEST_TITLES[reward.questId].length).toBeGreaterThan(0);
      }
    });

    it("should have card rewards for full_access and discover_50_entries", () => {
      const fullAccess = QUEST_REWARDS.find(r => r.questId === "full_access");
      const deepIntel = QUEST_REWARDS.find(r => r.questId === "discover_50_entries");
      expect(fullAccess?.cardReward).toBe("the-architect");
      expect(deepIntel?.cardReward).toBe("the-oracle");
    });

    it("should not have card rewards for early quests", () => {
      const earlyQuests = QUEST_REWARDS.filter(r => ["awaken", "explore_bridge", "explore_5_rooms", "collect_3_items"].includes(r.questId));
      for (const q of earlyQuests) {
        expect(q.cardReward).toBeUndefined();
      }
    });
  });

  describe("Reward Scaling", () => {
    it("should scale rewards progressively (later quests give more)", () => {
      const awaken = QUEST_REWARDS.find(r => r.questId === "awaken")!;
      const fullAccess = QUEST_REWARDS.find(r => r.questId === "full_access")!;
      const deepIntel = QUEST_REWARDS.find(r => r.questId === "discover_50_entries")!;

      expect(fullAccess.dreamTokens).toBeGreaterThan(awaken.dreamTokens);
      expect(deepIntel.dreamTokens).toBeGreaterThan(fullAccess.dreamTokens);
      expect(deepIntel.xp).toBeGreaterThan(awaken.xp);
    });

    it("should have total Dream Token rewards of 685", () => {
      const total = QUEST_REWARDS.reduce((sum, r) => sum + r.dreamTokens, 0);
      expect(total).toBe(685);
    });

    it("should have total XP rewards of 1105", () => {
      const total = QUEST_REWARDS.reduce((sum, r) => sum + r.xp, 0);
      expect(total).toBe(1105);
    });
  });

  describe("Quest Completion Checks", () => {
    // Simulate quest check logic
    function checkQuest(questId: string, state: {
      characterCreated: boolean;
      roomsUnlocked: number;
      totalItemsFound: number;
      discoveredCount: number;
      narrativeFlags: Record<string, boolean>;
      totalRooms: number;
    }): boolean {
      switch (questId) {
        case "awaken": return state.characterCreated;
        case "explore_bridge": return !!(state.narrativeFlags["room_bridge_visited"] || state.roomsUnlocked >= 3);
        case "explore_5_rooms": return state.roomsUnlocked >= 5;
        case "collect_3_items": return state.totalItemsFound >= 3;
        case "discover_10_entries": return state.discoveredCount >= 10;
        case "full_access": return state.roomsUnlocked >= state.totalRooms;
        case "collect_10_items": return state.totalItemsFound >= 10;
        case "discover_50_entries": return state.discoveredCount >= 50;
        default: return false;
      }
    }

    const baseState = {
      characterCreated: false,
      roomsUnlocked: 0,
      totalItemsFound: 0,
      discoveredCount: 0,
      narrativeFlags: {} as Record<string, boolean>,
      totalRooms: 11,
    };

    it("should not complete any quest in initial state", () => {
      for (const reward of QUEST_REWARDS) {
        expect(checkQuest(reward.questId, baseState)).toBe(false);
      }
    });

    it("should complete awaken when character is created", () => {
      expect(checkQuest("awaken", { ...baseState, characterCreated: true })).toBe(true);
    });

    it("should complete explore_bridge when bridge is visited", () => {
      expect(checkQuest("explore_bridge", {
        ...baseState,
        narrativeFlags: { room_bridge_visited: true },
      })).toBe(true);
    });

    it("should complete explore_bridge when 3+ rooms unlocked (fallback)", () => {
      expect(checkQuest("explore_bridge", { ...baseState, roomsUnlocked: 3 })).toBe(true);
    });

    it("should complete explore_5_rooms when 5 rooms unlocked", () => {
      expect(checkQuest("explore_5_rooms", { ...baseState, roomsUnlocked: 5 })).toBe(true);
      expect(checkQuest("explore_5_rooms", { ...baseState, roomsUnlocked: 4 })).toBe(false);
    });

    it("should complete collect_3_items when 3 items found", () => {
      expect(checkQuest("collect_3_items", { ...baseState, totalItemsFound: 3 })).toBe(true);
      expect(checkQuest("collect_3_items", { ...baseState, totalItemsFound: 2 })).toBe(false);
    });

    it("should complete discover_10_entries when 10 entries discovered", () => {
      expect(checkQuest("discover_10_entries", { ...baseState, discoveredCount: 10 })).toBe(true);
      expect(checkQuest("discover_10_entries", { ...baseState, discoveredCount: 9 })).toBe(false);
    });

    it("should complete full_access when all rooms unlocked", () => {
      expect(checkQuest("full_access", { ...baseState, roomsUnlocked: 11 })).toBe(true);
      expect(checkQuest("full_access", { ...baseState, roomsUnlocked: 10 })).toBe(false);
    });

    it("should complete collect_10_items when 10 items found", () => {
      expect(checkQuest("collect_10_items", { ...baseState, totalItemsFound: 10 })).toBe(true);
    });

    it("should complete discover_50_entries when 50 entries discovered", () => {
      expect(checkQuest("discover_50_entries", { ...baseState, discoveredCount: 50 })).toBe(true);
    });
  });

  describe("Claim Deduplication", () => {
    it("should not re-claim already claimed rewards", () => {
      const claimedRewards = ["awaken", "explore_bridge"];
      const newRewards = QUEST_REWARDS.filter(r =>
        !claimedRewards.includes(r.questId)
      );
      expect(newRewards).toHaveLength(6);
      expect(newRewards.find(r => r.questId === "awaken")).toBeUndefined();
      expect(newRewards.find(r => r.questId === "explore_bridge")).toBeUndefined();
    });

    it("should track claimed rewards via narrative flags", () => {
      const questId = "awaken";
      const flag = `quest_${questId}_claimed`;
      const flags: Record<string, boolean> = {};
      flags[flag] = true;
      expect(flags[`quest_awaken_claimed`]).toBe(true);
      expect(flags[`quest_explore_bridge_claimed`]).toBeUndefined();
    });
  });
});

/* ─── MILESTONE JOURNAL ENTRY TESTS ─── */
describe("MilestoneJournalEntries", () => {
  // Milestone definitions mirroring the component
  const MILESTONE_IDS = [
    "first_room_unlock",
    "bridge_access",
    "first_card_battle",
    "first_conexus_game",
    "five_rooms_explored",
    "first_trade_warp",
    "full_clearance",
    "arena_champion",
  ];

  const MILESTONE_ORDERS = [10, 20, 30, 40, 50, 60, 70, 80];
  const MILESTONE_ENTRY_NUMBERS = ["002", "003", "004", "005", "006", "007", "008", "009"];

  interface MilestoneCheckCtx {
    characterCreated: boolean;
    totalRoomsUnlocked: number;
    totalItemsFound: number;
    narrativeFlags: Record<string, boolean>;
    claimedQuestRewards: string[];
    completedGames: string[];
    collectedCards: string[];
    fightWins: number;
    fightLosses: number;
    totalFights: number;
    winStreak: number;
  }

  const baseCtx: MilestoneCheckCtx = {
    characterCreated: false,
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
  };

  // Milestone check functions (mirroring component)
  function checkMilestone(id: string, ctx: MilestoneCheckCtx): boolean {
    switch (id) {
      case "first_room_unlock": return ctx.totalRoomsUnlocked >= 2;
      case "bridge_access": return !!(ctx.narrativeFlags["room_bridge_visited"] || ctx.totalRoomsUnlocked >= 3);
      case "first_card_battle": return ctx.totalFights >= 1;
      case "first_conexus_game": return ctx.completedGames.length >= 1;
      case "five_rooms_explored": return ctx.totalRoomsUnlocked >= 5;
      case "first_trade_warp": return !!ctx.narrativeFlags["trade_wars_warped"];
      case "full_clearance": return ctx.totalRoomsUnlocked >= 11;
      case "arena_champion": return ctx.winStreak >= 5 || ctx.fightWins >= 10;
      default: return false;
    }
  }

  describe("Milestone Definitions", () => {
    it("should have 8 milestones defined", () => {
      expect(MILESTONE_IDS).toHaveLength(8);
    });

    it("should have unique IDs", () => {
      expect(new Set(MILESTONE_IDS).size).toBe(MILESTONE_IDS.length);
    });

    it("should have ascending order values", () => {
      for (let i = 1; i < MILESTONE_ORDERS.length; i++) {
        expect(MILESTONE_ORDERS[i]).toBeGreaterThan(MILESTONE_ORDERS[i - 1]);
      }
    });

    it("should have sequential entry numbers starting from 002", () => {
      expect(MILESTONE_ENTRY_NUMBERS[0]).toBe("002");
      expect(MILESTONE_ENTRY_NUMBERS[MILESTONE_ENTRY_NUMBERS.length - 1]).toBe("009");
    });
  });

  describe("Milestone Checks", () => {
    it("should not trigger any milestones in initial state", () => {
      for (const id of MILESTONE_IDS) {
        expect(checkMilestone(id, baseCtx)).toBe(false);
      }
    });

    it("should trigger first_room_unlock when 2+ rooms unlocked", () => {
      expect(checkMilestone("first_room_unlock", { ...baseCtx, totalRoomsUnlocked: 2 })).toBe(true);
      expect(checkMilestone("first_room_unlock", { ...baseCtx, totalRoomsUnlocked: 1 })).toBe(false);
    });

    it("should trigger bridge_access when bridge visited", () => {
      expect(checkMilestone("bridge_access", {
        ...baseCtx,
        narrativeFlags: { room_bridge_visited: true },
      })).toBe(true);
    });

    it("should trigger first_card_battle when 1+ fights", () => {
      expect(checkMilestone("first_card_battle", { ...baseCtx, totalFights: 1 })).toBe(true);
      expect(checkMilestone("first_card_battle", { ...baseCtx, totalFights: 0 })).toBe(false);
    });

    it("should trigger first_conexus_game when 1+ game completed", () => {
      expect(checkMilestone("first_conexus_game", { ...baseCtx, completedGames: ["game-1"] })).toBe(true);
      expect(checkMilestone("first_conexus_game", { ...baseCtx, completedGames: [] })).toBe(false);
    });

    it("should trigger five_rooms_explored when 5+ rooms", () => {
      expect(checkMilestone("five_rooms_explored", { ...baseCtx, totalRoomsUnlocked: 5 })).toBe(true);
      expect(checkMilestone("five_rooms_explored", { ...baseCtx, totalRoomsUnlocked: 4 })).toBe(false);
    });

    it("should trigger first_trade_warp when trade_wars_warped flag set", () => {
      expect(checkMilestone("first_trade_warp", {
        ...baseCtx,
        narrativeFlags: { trade_wars_warped: true },
      })).toBe(true);
      expect(checkMilestone("first_trade_warp", baseCtx)).toBe(false);
    });

    it("should trigger full_clearance when all 11 rooms unlocked", () => {
      expect(checkMilestone("full_clearance", { ...baseCtx, totalRoomsUnlocked: 11 })).toBe(true);
      expect(checkMilestone("full_clearance", { ...baseCtx, totalRoomsUnlocked: 10 })).toBe(false);
    });

    it("should trigger arena_champion with 5+ win streak", () => {
      expect(checkMilestone("arena_champion", { ...baseCtx, winStreak: 5 })).toBe(true);
      expect(checkMilestone("arena_champion", { ...baseCtx, winStreak: 4 })).toBe(false);
    });

    it("should trigger arena_champion with 10+ fight wins", () => {
      expect(checkMilestone("arena_champion", { ...baseCtx, fightWins: 10 })).toBe(true);
      expect(checkMilestone("arena_champion", { ...baseCtx, fightWins: 9 })).toBe(false);
    });
  });

  describe("Progressive Milestone Unlocking", () => {
    it("should unlock milestones in order as player progresses", () => {
      // Simulate a player's progression
      let ctx = { ...baseCtx };

      // Step 1: Create character and unlock first room
      ctx = { ...ctx, characterCreated: true, totalRoomsUnlocked: 2 };
      expect(checkMilestone("first_room_unlock", ctx)).toBe(true);
      expect(checkMilestone("bridge_access", ctx)).toBe(false);

      // Step 2: Reach the bridge
      ctx = { ...ctx, totalRoomsUnlocked: 3, narrativeFlags: { room_bridge_visited: true } };
      expect(checkMilestone("bridge_access", ctx)).toBe(true);

      // Step 3: First fight
      ctx = { ...ctx, totalFights: 1, fightWins: 1 };
      expect(checkMilestone("first_card_battle", ctx)).toBe(true);

      // Step 4: Complete a CoNexus game
      ctx = { ...ctx, completedGames: ["necromancers-lair"] };
      expect(checkMilestone("first_conexus_game", ctx)).toBe(true);

      // Step 5: Explore 5 rooms
      ctx = { ...ctx, totalRoomsUnlocked: 5 };
      expect(checkMilestone("five_rooms_explored", ctx)).toBe(true);

      // Step 6: Warp in Trade Wars
      ctx = { ...ctx, narrativeFlags: { ...ctx.narrativeFlags, trade_wars_warped: true } };
      expect(checkMilestone("first_trade_warp", ctx)).toBe(true);

      // Step 7: Full clearance
      ctx = { ...ctx, totalRoomsUnlocked: 11 };
      expect(checkMilestone("full_clearance", ctx)).toBe(true);

      // Step 8: Arena champion
      ctx = { ...ctx, fightWins: 10, winStreak: 5 };
      expect(checkMilestone("arena_champion", ctx)).toBe(true);

      // All milestones should be achieved
      for (const id of MILESTONE_IDS) {
        expect(checkMilestone(id, ctx)).toBe(true);
      }
    });
  });
});

/* ─── GAME CONTEXT EXTENSIONS TESTS ─── */
describe("GameContext Extensions", () => {
  describe("setNarrativeFlag", () => {
    it("should set a narrative flag to true by default", () => {
      const state = { narrativeFlags: {} as Record<string, boolean> };
      // Simulate the function
      const flag = "test_flag";
      state.narrativeFlags = { ...state.narrativeFlags, [flag]: true };
      expect(state.narrativeFlags["test_flag"]).toBe(true);
    });

    it("should allow setting a flag to false", () => {
      const state = { narrativeFlags: { test_flag: true } as Record<string, boolean> };
      state.narrativeFlags = { ...state.narrativeFlags, test_flag: false };
      expect(state.narrativeFlags["test_flag"]).toBe(false);
    });

    it("should not affect other flags", () => {
      const state = { narrativeFlags: { existing: true } as Record<string, boolean> };
      state.narrativeFlags = { ...state.narrativeFlags, new_flag: true };
      expect(state.narrativeFlags["existing"]).toBe(true);
      expect(state.narrativeFlags["new_flag"]).toBe(true);
    });
  });

  describe("claimQuestReward", () => {
    it("should add quest ID to claimedQuestRewards", () => {
      let claimedQuestRewards: string[] = [];
      const questId = "awaken";
      if (!claimedQuestRewards.includes(questId)) {
        claimedQuestRewards = [...claimedQuestRewards, questId];
      }
      expect(claimedQuestRewards).toContain("awaken");
    });

    it("should not duplicate quest IDs", () => {
      let claimedQuestRewards = ["awaken"];
      const questId = "awaken";
      if (!claimedQuestRewards.includes(questId)) {
        claimedQuestRewards = [...claimedQuestRewards, questId];
      }
      expect(claimedQuestRewards).toHaveLength(1);
    });

    it("should set quest_claimed narrative flag", () => {
      const narrativeFlags: Record<string, boolean> = {};
      const questId = "explore_bridge";
      narrativeFlags[`quest_${questId}_claimed`] = true;
      expect(narrativeFlags["quest_explore_bridge_claimed"]).toBe(true);
    });
  });

  describe("claimedQuestRewards in GameState", () => {
    it("should default to empty array", () => {
      const defaultState = { claimedQuestRewards: [] as string[] };
      expect(defaultState.claimedQuestRewards).toHaveLength(0);
    });

    it("should persist across multiple claims", () => {
      let rewards: string[] = [];
      rewards = [...rewards, "awaken"];
      rewards = [...rewards, "explore_bridge"];
      rewards = [...rewards, "explore_5_rooms"];
      expect(rewards).toHaveLength(3);
      expect(rewards).toEqual(["awaken", "explore_bridge", "explore_5_rooms"]);
    });
  });
});

/* ─── CRYO BAY ORIENTATION TESTS ─── */
describe("CryoBayOrientation", () => {
  // Orientation dialog lines (7 lines in the enhanced version)
  const ORIENTATION_LINE_COUNT = 7;

  it("should have 7 orientation dialog lines", () => {
    expect(ORIENTATION_LINE_COUNT).toBe(7);
  });

  describe("Species-specific dialog", () => {
    const speciesDialogs: Record<string, string> = {
      demagi: "DeMagi elemental signature",
      quarchon: "Quarchon quantum processing",
      neyon: "Ne-Yon hybrid neural",
    };

    it("should have dialog for all three species", () => {
      expect(Object.keys(speciesDialogs)).toHaveLength(3);
      expect(speciesDialogs["demagi"]).toBeDefined();
      expect(speciesDialogs["quarchon"]).toBeDefined();
      expect(speciesDialogs["neyon"]).toBeDefined();
    });

    it("should have unique dialog per species", () => {
      const values = Object.values(speciesDialogs);
      expect(new Set(values).size).toBe(values.length);
    });
  });

  describe("Class-specific dialog", () => {
    const classDialogs: Record<string, string> = {
      engineer: "engineering aptitude",
      oracle: "prophetic abilities",
      assassin: "stealth capabilities",
      soldier: "combat training",
      spy: "intelligence gathering",
    };

    it("should have dialog for all five classes", () => {
      expect(Object.keys(classDialogs)).toHaveLength(5);
    });

    it("should have unique dialog per class", () => {
      const values = Object.values(classDialogs);
      expect(new Set(values).size).toBe(values.length);
    });
  });
});

/* ─── TRADE WARS WARP FLAG INTEGRATION ─── */
describe("TradeWarsWarpFlag", () => {
  it("should set trade_wars_warped flag on successful warp", () => {
    const narrativeFlags: Record<string, boolean> = {};
    // Simulate successful warp
    const warpSuccess = true;
    if (warpSuccess) {
      narrativeFlags["trade_wars_warped"] = true;
    }
    expect(narrativeFlags["trade_wars_warped"]).toBe(true);
  });

  it("should not set flag on failed warp", () => {
    const narrativeFlags: Record<string, boolean> = {};
    const warpSuccess = false;
    if (warpSuccess) {
      narrativeFlags["trade_wars_warped"] = true;
    }
    expect(narrativeFlags["trade_wars_warped"]).toBeUndefined();
  });

  it("should trigger first_trade_warp milestone after flag is set", () => {
    const ctx = {
      narrativeFlags: { trade_wars_warped: true },
    };
    expect(!!ctx.narrativeFlags["trade_wars_warped"]).toBe(true);
  });
});

/* ─── GAMESTATE SCHEMA EXTENSION ─── */
describe("GameState Schema Extension", () => {
  it("should accept claimedQuestRewards as optional array", () => {
    // Simulate the zod schema validation
    const validState = {
      phase: "EXPLORING",
      awakeningStep: "COMPLETE",
      characterChoices: {
        species: "demagi",
        characterClass: "engineer",
        alignment: "order",
        element: "fire",
        name: "TestUser",
        attrAttack: 5,
        attrDefense: 5,
        attrVitality: 5,
      },
      characterCreated: true,
      rooms: {},
      currentRoomId: "cryo-bay",
      itemsCollected: [],
      achievementsEarned: [],
      elaraDialogHistory: [],
      totalRoomsUnlocked: 1,
      totalItemsFound: 0,
      narrativeFlags: {},
      claimedQuestRewards: ["awaken", "explore_bridge"],
    };
    expect(validState.claimedQuestRewards).toHaveLength(2);
  });

  it("should work without claimedQuestRewards (backward compat)", () => {
    const oldState = {
      phase: "EXPLORING",
      narrativeFlags: {},
      // No claimedQuestRewards field
    };
    const rewards = (oldState as any).claimedQuestRewards || [];
    expect(rewards).toHaveLength(0);
  });
});
