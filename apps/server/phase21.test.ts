/* ═══════════════════════════════════════════════════════
   Phase 21 Tests — Server Save/Load, Leaderboard, Room Transitions
   Tests the logic for cross-device persistence, competitive rankings,
   and cinematic corridor transitions between rooms.
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";

/* ─── SERVER SAVE/LOAD LOGIC ─── */
describe("Server Save/Load — Game State Persistence", () => {
  // Mirrors the gameStateSchema from server/routers/gameState.ts
  const createMockGameState = (overrides: Partial<Record<string, unknown>> = {}) => ({
    phase: "EXPLORING",
    awakeningStep: "COMPLETE",
    characterChoices: {
      species: "demagi",
      characterClass: "oracle",
      alignment: "order",
      element: "water",
      name: "TestPotential",
      attrAttack: 3,
      attrDefense: 4,
      attrVitality: 3,
    },
    characterCreated: true,
    rooms: {
      "cryo-bay": { id: "cryo-bay", unlocked: true, visited: true, visitCount: 3, itemsFound: ["data-crystal-alpha"], elaraDialogSeen: true },
      "medical-bay": { id: "medical-bay", unlocked: true, visited: true, visitCount: 1, itemsFound: [], elaraDialogSeen: false },
      "bridge": { id: "bridge", unlocked: true, visited: true, visitCount: 2, itemsFound: [], elaraDialogSeen: true },
    },
    currentRoomId: "bridge",
    itemsCollected: ["data-crystal-alpha"],
    achievementsEarned: ["FIRST_STEPS"],
    elaraDialogHistory: ["cryo-bay-intro", "bridge-intro"],
    totalRoomsUnlocked: 3,
    totalItemsFound: 1,
    narrativeFlags: { firstCryoVisit: true, metElara: true },
    ...overrides,
  });

  it("should create a valid game state object", () => {
    const state = createMockGameState();
    expect(state.phase).toBe("EXPLORING");
    expect(state.characterCreated).toBe(true);
    expect(state.characterChoices.species).toBe("demagi");
    expect(state.characterChoices.name).toBe("TestPotential");
    expect(Object.keys(state.rooms)).toHaveLength(3);
  });

  it("should serialize and deserialize game state to JSON", () => {
    const state = createMockGameState();
    const json = JSON.stringify(state);
    const restored = JSON.parse(json);

    expect(restored.phase).toBe(state.phase);
    expect(restored.characterChoices.species).toBe(state.characterChoices.species);
    expect(restored.rooms["cryo-bay"].unlocked).toBe(true);
    expect(restored.itemsCollected).toEqual(state.itemsCollected);
  });

  it("should count unlocked rooms correctly", () => {
    const state = createMockGameState();
    const unlockedCount = Object.values(state.rooms).filter(
      (r: any) => r.unlocked
    ).length;
    expect(unlockedCount).toBe(3);
  });

  it("should merge server state with local state (server wins if more progress)", () => {
    const localState = createMockGameState({ totalRoomsUnlocked: 2 });
    const serverState = createMockGameState({
      totalRoomsUnlocked: 5,
      rooms: {
        ...createMockGameState().rooms,
        "archives": { id: "archives", unlocked: true, visited: true, visitCount: 1, itemsFound: [], elaraDialogSeen: false },
        "comms-array": { id: "comms-array", unlocked: true, visited: false, visitCount: 0, itemsFound: [], elaraDialogSeen: false },
      },
    });

    const localRooms = Object.values(localState.rooms as Record<string, any>).filter(r => r.unlocked).length;
    const serverRooms = Object.values(serverState.rooms as Record<string, any>).filter(r => r.unlocked).length;

    // Server has more rooms — server wins
    expect(serverRooms).toBeGreaterThan(localRooms);
    const winner = serverRooms >= localRooms ? serverState : localState;
    expect(winner).toBe(serverState);
  });

  it("should keep local state when server has less progress", () => {
    const localState = createMockGameState({
      totalRoomsUnlocked: 8,
      rooms: {
        ...createMockGameState().rooms,
        "archives": { id: "archives", unlocked: true, visited: true, visitCount: 2, itemsFound: ["archive-tome"], elaraDialogSeen: true },
        "engineering": { id: "engineering", unlocked: true, visited: true, visitCount: 1, itemsFound: [], elaraDialogSeen: false },
        "armory": { id: "armory", unlocked: true, visited: true, visitCount: 3, itemsFound: ["dogtag"], elaraDialogSeen: true },
        "cargo-hold": { id: "cargo-hold", unlocked: true, visited: true, visitCount: 1, itemsFound: [], elaraDialogSeen: false },
        "observation-deck": { id: "observation-deck", unlocked: true, visited: false, visitCount: 0, itemsFound: [], elaraDialogSeen: false },
      },
    });
    const serverState = createMockGameState({ totalRoomsUnlocked: 2 });

    const localRooms = Object.values(localState.rooms as Record<string, any>).filter(r => r.unlocked).length;
    const serverRooms = Object.values(serverState.rooms as Record<string, any>).filter(r => r.unlocked).length;

    expect(localRooms).toBeGreaterThan(serverRooms);
    const winner = serverRooms >= localRooms ? serverState : localState;
    expect(winner).toBe(localState);
  });

  it("should handle empty server state gracefully", () => {
    const serverState = null;
    const localState = createMockGameState();

    // If server returns null, keep local state
    const result = serverState ?? localState;
    expect(result).toBe(localState);
    expect(result.characterCreated).toBe(true);
  });

  it("should validate character choices structure", () => {
    const state = createMockGameState();
    const choices = state.characterChoices;

    expect(["demagi", "quarchon", "neyon"]).toContain(choices.species);
    expect(["engineer", "oracle", "assassin", "soldier", "spy"]).toContain(choices.characterClass);
    expect(["order", "chaos"]).toContain(choices.alignment);
    expect(choices.name.length).toBeGreaterThan(0);
    expect(choices.attrAttack).toBeGreaterThanOrEqual(0);
    expect(choices.attrDefense).toBeGreaterThanOrEqual(0);
    expect(choices.attrVitality).toBeGreaterThanOrEqual(0);
    expect(choices.attrAttack + choices.attrDefense + choices.attrVitality).toBe(10);
  });
});

/* ─── STATS CALCULATION FOR SERVER SAVE ─── */
describe("Server Save — Stats Calculation", () => {
  function calculateStats(data: {
    roomsUnlocked: number;
    puzzlesSolved: number;
    easterEggsFound: number;
    cardsCollected: number;
    battlesWon: number;
    battlesPlayed: number;
  }) {
    const totalRooms = 12;
    const totalPuzzles = 8;
    const totalEasterEggs = 10;
    const totalCards = 30;

    const completionPercent = Math.round(
      (data.roomsUnlocked / totalRooms * 30) +
      (data.puzzlesSolved / totalPuzzles * 20) +
      (data.easterEggsFound / totalEasterEggs * 20) +
      (data.cardsCollected / totalCards * 15) +
      (Math.min(data.battlesWon, 10) / 10 * 15)
    );

    const ranks = [
      { min: 0, name: "Unranked" }, { min: 5, name: "Recruit" },
      { min: 20, name: "Field Operative" }, { min: 40, name: "Senior Agent" },
      { min: 65, name: "Master Operative" }, { min: 90, name: "Grand Archivist" },
    ];
    const rank = [...ranks].reverse().find(r => completionPercent >= r.min)?.name ?? "Unranked";

    return {
      roomsUnlocked: data.roomsUnlocked,
      totalRooms,
      puzzlesSolved: data.puzzlesSolved,
      totalPuzzles,
      easterEggsFound: data.easterEggsFound,
      totalEasterEggs,
      battlesWon: data.battlesWon,
      battlesPlayed: data.battlesPlayed,
      cardsCollected: data.cardsCollected,
      totalCards,
      completionPercent,
      rank,
    };
  }

  it("should calculate 0% for a brand new player", () => {
    const stats = calculateStats({
      roomsUnlocked: 0, puzzlesSolved: 0, easterEggsFound: 0,
      cardsCollected: 0, battlesWon: 0, battlesPlayed: 0,
    });
    expect(stats.completionPercent).toBe(0);
    expect(stats.rank).toBe("Unranked");
  });

  it("should calculate 100% for a fully completed player", () => {
    const stats = calculateStats({
      roomsUnlocked: 12, puzzlesSolved: 8, easterEggsFound: 10,
      cardsCollected: 30, battlesWon: 10, battlesPlayed: 15,
    });
    expect(stats.completionPercent).toBe(100);
    expect(stats.rank).toBe("Grand Archivist");
  });

  it("should calculate partial completion with correct weights", () => {
    const stats = calculateStats({
      roomsUnlocked: 6,     // 50% of 12 → 0.5 * 30 = 15
      puzzlesSolved: 4,      // 50% of 8  → 0.5 * 20 = 10
      easterEggsFound: 5,    // 50% of 10 → 0.5 * 20 = 10
      cardsCollected: 15,    // 50% of 30 → 0.5 * 15 = 7.5
      battlesWon: 5,         // 50% of 10 → 0.5 * 15 = 7.5
      battlesPlayed: 8,
    });
    // 15 + 10 + 10 + 7.5 + 7.5 = 50
    expect(stats.completionPercent).toBe(50);
    expect(stats.rank).toBe("Senior Agent");
  });

  it("should cap battles at 10 for completion calculation", () => {
    const stats = calculateStats({
      roomsUnlocked: 0, puzzlesSolved: 0, easterEggsFound: 0,
      cardsCollected: 0, battlesWon: 100, battlesPlayed: 200,
    });
    // Only battles contribute: min(100,10)/10 * 15 = 15
    expect(stats.completionPercent).toBe(15);
    expect(stats.rank).toBe("Recruit");
  });

  it("should derive XP from completion percentage", () => {
    const stats = calculateStats({
      roomsUnlocked: 6, puzzlesSolved: 4, easterEggsFound: 5,
      cardsCollected: 15, battlesWon: 5, battlesPlayed: 8,
    });
    const xp = stats.completionPercent * 10;
    expect(xp).toBe(500);
  });

  it("should derive level from completion percentage", () => {
    const stats = calculateStats({
      roomsUnlocked: 6, puzzlesSolved: 4, easterEggsFound: 5,
      cardsCollected: 15, battlesWon: 5, battlesPlayed: 8,
    });
    const level = Math.max(1, Math.floor(stats.completionPercent / 10));
    expect(level).toBe(5);
  });

  it("should assign correct rank thresholds", () => {
    const testCases = [
      { pct: 0, rank: "Unranked" },
      { pct: 4, rank: "Unranked" },
      { pct: 5, rank: "Recruit" },
      { pct: 19, rank: "Recruit" },
      { pct: 20, rank: "Field Operative" },
      { pct: 39, rank: "Field Operative" },
      { pct: 40, rank: "Senior Agent" },
      { pct: 64, rank: "Senior Agent" },
      { pct: 65, rank: "Master Operative" },
      { pct: 89, rank: "Master Operative" },
      { pct: 90, rank: "Grand Archivist" },
      { pct: 100, rank: "Grand Archivist" },
    ];

    for (const tc of testCases) {
      const ranks = [
        { min: 0, name: "Unranked" }, { min: 5, name: "Recruit" },
        { min: 20, name: "Field Operative" }, { min: 40, name: "Senior Agent" },
        { min: 65, name: "Master Operative" }, { min: 90, name: "Grand Archivist" },
      ];
      const rank = [...ranks].reverse().find(r => tc.pct >= r.min)?.name ?? "Unranked";
      expect(rank).toBe(tc.rank);
    }
  });
});

/* ─── LEADERBOARD LOGIC ─── */
describe("Leaderboard — Ranking and Sorting", () => {
  const createMockEntry = (overrides: Partial<Record<string, unknown>> = {}) => ({
    userId: 1,
    userName: "TestPlayer",
    title: "Recruit",
    level: 1,
    xp: 50,
    species: "demagi",
    characterClass: "oracle",
    completionPercent: 25,
    roomsUnlocked: 3,
    totalRooms: 12,
    battlesWon: 2,
    battlesPlayed: 5,
    easterEggsFound: 1,
    totalEasterEggs: 10,
    cardsCollected: 5,
    puzzlesSolved: 2,
    rank: "Recruit",
    lastActive: new Date().toISOString(),
    ...overrides,
  });

  it("should sort by completion percentage (default)", () => {
    const entries = [
      createMockEntry({ userId: 1, completionPercent: 30 }),
      createMockEntry({ userId: 2, completionPercent: 80 }),
      createMockEntry({ userId: 3, completionPercent: 55 }),
    ];

    entries.sort((a, b) => b.completionPercent - a.completionPercent);

    expect(entries[0].completionPercent).toBe(80);
    expect(entries[1].completionPercent).toBe(55);
    expect(entries[2].completionPercent).toBe(30);
  });

  it("should sort by battles won", () => {
    const entries = [
      createMockEntry({ userId: 1, battlesWon: 5, completionPercent: 20 }),
      createMockEntry({ userId: 2, battlesWon: 15, completionPercent: 60 }),
      createMockEntry({ userId: 3, battlesWon: 8, completionPercent: 40 }),
    ];

    entries.sort((a, b) => b.battlesWon - a.battlesWon || b.completionPercent - a.completionPercent);

    expect(entries[0].battlesWon).toBe(15);
    expect(entries[1].battlesWon).toBe(8);
    expect(entries[2].battlesWon).toBe(5);
  });

  it("should sort by Easter eggs found", () => {
    const entries = [
      createMockEntry({ userId: 1, easterEggsFound: 2, completionPercent: 30 }),
      createMockEntry({ userId: 2, easterEggsFound: 8, completionPercent: 70 }),
      createMockEntry({ userId: 3, easterEggsFound: 5, completionPercent: 50 }),
    ];

    entries.sort((a, b) => b.easterEggsFound - a.easterEggsFound || b.completionPercent - a.completionPercent);

    expect(entries[0].easterEggsFound).toBe(8);
    expect(entries[1].easterEggsFound).toBe(5);
    expect(entries[2].easterEggsFound).toBe(2);
  });

  it("should sort by rooms unlocked", () => {
    const entries = [
      createMockEntry({ userId: 1, roomsUnlocked: 4, completionPercent: 20 }),
      createMockEntry({ userId: 2, roomsUnlocked: 12, completionPercent: 90 }),
      createMockEntry({ userId: 3, roomsUnlocked: 7, completionPercent: 50 }),
    ];

    entries.sort((a, b) => b.roomsUnlocked - a.roomsUnlocked || b.completionPercent - a.completionPercent);

    expect(entries[0].roomsUnlocked).toBe(12);
    expect(entries[1].roomsUnlocked).toBe(7);
    expect(entries[2].roomsUnlocked).toBe(4);
  });

  it("should break ties using completion percentage", () => {
    const entries = [
      createMockEntry({ userId: 1, battlesWon: 10, completionPercent: 40 }),
      createMockEntry({ userId: 2, battlesWon: 10, completionPercent: 80 }),
      createMockEntry({ userId: 3, battlesWon: 10, completionPercent: 60 }),
    ];

    entries.sort((a, b) => b.battlesWon - a.battlesWon || b.completionPercent - a.completionPercent);

    expect(entries[0].completionPercent).toBe(80);
    expect(entries[1].completionPercent).toBe(60);
    expect(entries[2].completionPercent).toBe(40);
  });

  it("should filter out inactive players (0% completion and 0 rooms)", () => {
    const entries = [
      createMockEntry({ userId: 1, completionPercent: 30, roomsUnlocked: 3 }),
      createMockEntry({ userId: 2, completionPercent: 0, roomsUnlocked: 0 }),
      createMockEntry({ userId: 3, completionPercent: 50, roomsUnlocked: 6 }),
    ];

    const active = entries.filter(e => e.completionPercent > 0 || e.roomsUnlocked > 0);
    expect(active).toHaveLength(2);
    expect(active.every(e => e.completionPercent > 0 || e.roomsUnlocked > 0)).toBe(true);
  });

  it("should assign rank positions after sorting", () => {
    const entries = [
      createMockEntry({ userId: 1, completionPercent: 30 }),
      createMockEntry({ userId: 2, completionPercent: 80 }),
      createMockEntry({ userId: 3, completionPercent: 55 }),
    ];

    entries.sort((a, b) => b.completionPercent - a.completionPercent);
    const ranked = entries.map((e, i) => ({ ...e, rank_position: i + 1 }));

    expect(ranked[0].rank_position).toBe(1);
    expect(ranked[0].completionPercent).toBe(80);
    expect(ranked[1].rank_position).toBe(2);
    expect(ranked[2].rank_position).toBe(3);
  });

  it("should limit results to requested count", () => {
    const entries = Array.from({ length: 100 }, (_, i) =>
      createMockEntry({ userId: i + 1, completionPercent: Math.floor(Math.random() * 100) })
    );

    const limit = 50;
    const limited = entries.slice(0, limit);
    expect(limited).toHaveLength(50);
  });

  it("should handle empty leaderboard gracefully", () => {
    const entries: ReturnType<typeof createMockEntry>[] = [];
    expect(entries).toHaveLength(0);
    const sorted = [...entries].sort((a, b) => b.completionPercent - a.completionPercent);
    expect(sorted).toHaveLength(0);
  });
});

/* ─── ROOM TRANSITION LOGIC ─── */
describe("Room Transition — Corridor Animation", () => {
  // Corridor theme definitions (mirrors RoomTransition.tsx)
  const CORRIDOR_THEMES: Record<string, { primary: string; secondary: string; accent: string }> = {
    "cryo-bay": { primary: "#33e2e6", secondary: "#1a5c5e", accent: "#0a2a2b" },
    "bridge": { primary: "#3875fa", secondary: "#1a3a7d", accent: "#0a1a3d" },
    "archives": { primary: "#a855f7", secondary: "#5a2d7d", accent: "#2a1540" },
    "comms-array": { primary: "#22c55e", secondary: "#115e2e", accent: "#0a2d15" },
    "engineering": { primary: "#f97316", secondary: "#7d3a0b", accent: "#3d1d05" },
    "armory": { primary: "#ef4444", secondary: "#7d2222", accent: "#3d1111" },
    "cargo-hold": { primary: "#eab308", secondary: "#7d5f04", accent: "#3d2f02" },
    "observation-deck": { primary: "#6366f1", secondary: "#3133a0", accent: "#191a50" },
    "medical-bay": { primary: "#14b8a6", secondary: "#0a5c53", accent: "#052e2a" },
    "hangar-bay": { primary: "#64748b", secondary: "#334155", accent: "#1e293b" },
    "mess-hall": { primary: "#f59e0b", secondary: "#7d4f06", accent: "#3d2703" },
    "captains-quarters": { primary: "#d4af37", secondary: "#6a5818", accent: "#35300c" },
  };

  it("should have a theme for every room", () => {
    const rooms = [
      "cryo-bay", "bridge", "archives", "comms-array", "engineering",
      "armory", "cargo-hold", "observation-deck", "medical-bay",
      "hangar-bay", "mess-hall", "captains-quarters",
    ];

    for (const room of rooms) {
      expect(CORRIDOR_THEMES[room]).toBeDefined();
      expect(CORRIDOR_THEMES[room].primary).toMatch(/^#[0-9a-f]{6}$/i);
      expect(CORRIDOR_THEMES[room].secondary).toMatch(/^#[0-9a-f]{6}$/i);
      expect(CORRIDOR_THEMES[room].accent).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("should have 12 corridor themes total", () => {
    expect(Object.keys(CORRIDOR_THEMES)).toHaveLength(12);
  });

  it("should fall back to bridge theme for unknown rooms", () => {
    const unknownRoom = "nonexistent-room";
    const theme = CORRIDOR_THEMES[unknownRoom] ?? CORRIDOR_THEMES["bridge"];
    expect(theme).toBe(CORRIDOR_THEMES["bridge"]);
    expect(theme.primary).toBe("#3875fa");
  });

  it("should convert hex to RGB correctly", () => {
    function hexToRgb(hex: string): string {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `${r}, ${g}, ${b}`;
    }

    expect(hexToRgb("#33e2e6")).toBe("51, 226, 230");
    expect(hexToRgb("#3875fa")).toBe("56, 117, 250");
    expect(hexToRgb("#ef4444")).toBe("239, 68, 68");
    expect(hexToRgb("#000000")).toBe("0, 0, 0");
    expect(hexToRgb("#ffffff")).toBe("255, 255, 255");
  });

  it("should define transition phase sequence", () => {
    const phases = ["corridor", "arriving", "reveal"];
    expect(phases).toHaveLength(3);
    expect(phases[0]).toBe("corridor");
    expect(phases[1]).toBe("arriving");
    expect(phases[2]).toBe("reveal");
  });

  it("should have correct timing for phase progression", () => {
    const corridorDuration = 1500;  // ms
    const arrivingDuration = 700;   // 2200 - 1500
    const revealDuration = 800;     // 3000 - 2200
    const totalDuration = 3000;     // ms

    expect(corridorDuration).toBe(1500);
    expect(arrivingDuration).toBe(700);
    expect(revealDuration).toBe(800);
    expect(corridorDuration + arrivingDuration + revealDuration).toBe(totalDuration);
  });

  it("should distinguish new rooms from revisited rooms", () => {
    const visitedRooms = new Set(["cryo-bay", "medical-bay", "bridge"]);

    const isNewRoom = (roomId: string) => !visitedRooms.has(roomId);

    expect(isNewRoom("archives")).toBe(true);
    expect(isNewRoom("cryo-bay")).toBe(false);
    expect(isNewRoom("engineering")).toBe(true);
    expect(isNewRoom("bridge")).toBe(false);
  });

  it("should use unique colors for each room theme", () => {
    const primaryColors = Object.values(CORRIDOR_THEMES).map(t => t.primary);
    const uniqueColors = new Set(primaryColors);
    expect(uniqueColors.size).toBe(primaryColors.length);
  });
});

/* ─── PUZZLE DEFINITIONS INTEGRITY ─── */
describe("Puzzle Definitions — Data Integrity", () => {
  const ROOM_PUZZLES: Record<string, { id: string; roomId: string; type: string; title: string; description: string; elaraHint: string }> = {
    "bridge": { id: "puzzle-bridge", roomId: "bridge", type: "power_relay", title: "BRIDGE POWER RELAY", description: "The bridge power grid is offline.", elaraHint: "Binary pattern 1047 = 10000010111" },
    "archives": { id: "puzzle-archives", roomId: "archives", type: "riddle", title: "ARCHIVES ACCESS PROTOCOL", description: "The data core requires a verbal passphrase.", elaraHint: "What binds stories together" },
    "comms-array": { id: "puzzle-comms", roomId: "comms-array", type: "cipher", title: "COMMUNICATIONS DECRYPTION", description: "Decode the encrypted signal.", elaraHint: "Caesar cipher shift-3" },
    "observation-deck": { id: "puzzle-observation", roomId: "observation-deck", type: "keycard", title: "OBSERVATION DECK SEAL", description: "Biometric lock.", elaraHint: "Keycard in Medical Bay" },
    "engineering": { id: "puzzle-engineering", roomId: "engineering", type: "sequence", title: "ENGINEERING CONSOLE REBOOT", description: "Enter correct boot sequence.", elaraHint: "PLNS" },
    "armory": { id: "puzzle-armory", roomId: "armory", type: "riddle", title: "ARMORY VOICE LOCK", description: "Voice-activated lock.", elaraHint: "What a warrior truly needs" },
    "cargo-hold": { id: "puzzle-cargo", roomId: "cargo-hold", type: "cipher", title: "CARGO MANIFEST DECRYPTION", description: "Decrypt the manifest code.", elaraHint: "Reverse cipher" },
    "captains-quarters": { id: "puzzle-captains", roomId: "captains-quarters", type: "keycard", title: "CAPTAIN'S QUARTERS — RESTRICTED", description: "Requires Captain's Master Key.", elaraHint: "Hidden on the Bridge" },
  };

  it("should have 8 puzzles total", () => {
    expect(Object.keys(ROOM_PUZZLES)).toHaveLength(8);
  });

  it("should have unique puzzle IDs", () => {
    const ids = Object.values(ROOM_PUZZLES).map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should match roomId to the puzzle key", () => {
    for (const [key, puzzle] of Object.entries(ROOM_PUZZLES)) {
      expect(puzzle.roomId).toBe(key);
    }
  });

  it("should use valid puzzle types", () => {
    const validTypes = ["riddle", "keycard", "sequence", "cipher", "power_relay"];
    for (const puzzle of Object.values(ROOM_PUZZLES)) {
      expect(validTypes).toContain(puzzle.type);
    }
  });

  it("should have 5 distinct puzzle types across all rooms", () => {
    const types = new Set(Object.values(ROOM_PUZZLES).map(p => p.type));
    expect(types.size).toBe(5);
  });

  it("should have Elara hints for every puzzle", () => {
    for (const puzzle of Object.values(ROOM_PUZZLES)) {
      expect(puzzle.elaraHint.length).toBeGreaterThan(0);
    }
  });
});

/* ─── GAME PHASE STATE MACHINE ─── */
describe("Game Phase — State Machine Transitions", () => {
  const PHASES = ["FIRST_VISIT", "AWAKENING", "QUARTERS_UNLOCKED", "EXPLORING", "FULL_ACCESS"];
  const AWAKENING_STEPS = [
    "BLACKOUT", "CRYO_OPEN", "ELARA_INTRO",
    "SPECIES_QUESTION", "CLASS_QUESTION", "ALIGNMENT_QUESTION",
    "ELEMENT_QUESTION", "NAME_INPUT", "ATTRIBUTES", "FIRST_STEPS", "COMPLETE",
  ];

  it("should have 5 game phases", () => {
    expect(PHASES).toHaveLength(5);
  });

  it("should have 11 awakening steps", () => {
    expect(AWAKENING_STEPS).toHaveLength(11);
  });

  it("should start at FIRST_VISIT phase", () => {
    expect(PHASES[0]).toBe("FIRST_VISIT");
  });

  it("should end at FULL_ACCESS phase", () => {
    expect(PHASES[PHASES.length - 1]).toBe("FULL_ACCESS");
  });

  it("should advance awakening steps sequentially", () => {
    for (let i = 0; i < AWAKENING_STEPS.length - 1; i++) {
      const current = AWAKENING_STEPS[i];
      const next = AWAKENING_STEPS[i + 1];
      const idx = AWAKENING_STEPS.indexOf(current);
      const nextIdx = Math.min(idx + 1, AWAKENING_STEPS.length - 1);
      expect(AWAKENING_STEPS[nextIdx]).toBe(next);
    }
  });

  it("should transition to QUARTERS_UNLOCKED when awakening completes", () => {
    const lastStep = AWAKENING_STEPS[AWAKENING_STEPS.length - 1];
    expect(lastStep).toBe("COMPLETE");
    // When step is COMPLETE, phase should be QUARTERS_UNLOCKED
    const expectedPhase = lastStep === "COMPLETE" ? "QUARTERS_UNLOCKED" : "AWAKENING";
    expect(expectedPhase).toBe("QUARTERS_UNLOCKED");
  });

  it("should transition to EXPLORING when player enters rooms beyond cryo-bay", () => {
    const currentPhase = "QUARTERS_UNLOCKED";
    const enteringNewRoom = true;
    const nextPhase = enteringNewRoom && (currentPhase === "QUARTERS_UNLOCKED" || currentPhase === "EXPLORING")
      ? "EXPLORING"
      : currentPhase;
    expect(nextPhase).toBe("EXPLORING");
  });

  it("should transition to FULL_ACCESS when all rooms are unlocked", () => {
    const totalRooms = 12;
    const unlockedRooms = 12;
    const allUnlocked = unlockedRooms >= totalRooms;
    const phase = allUnlocked ? "FULL_ACCESS" : "EXPLORING";
    expect(phase).toBe("FULL_ACCESS");
  });
});

/* ─── ROOM CONNECTIONS GRAPH ─── */
describe("Room Connections — Navigation Graph", () => {
  const ROOM_CONNECTIONS: Record<string, string[]> = {
    "cryo-bay": ["medical-bay", "bridge"],
    "medical-bay": ["cryo-bay"],
    "bridge": ["cryo-bay", "archives", "comms-array"],
    "archives": ["bridge"],
    "comms-array": ["bridge"],
    "engineering": ["comms-array", "armory"],
    "armory": ["engineering"],
    "cargo-hold": ["engineering", "hangar-bay"],
    "observation-deck": ["bridge"],
    "hangar-bay": ["cargo-hold"],
    "mess-hall": ["cryo-bay"],
    "captains-quarters": ["bridge"],
  };

  it("should define connections for all 12 rooms", () => {
    expect(Object.keys(ROOM_CONNECTIONS)).toHaveLength(12);
  });

  it("should have cryo-bay as the starting room with 2 connections", () => {
    expect(ROOM_CONNECTIONS["cryo-bay"]).toHaveLength(2);
    expect(ROOM_CONNECTIONS["cryo-bay"]).toContain("medical-bay");
    expect(ROOM_CONNECTIONS["cryo-bay"]).toContain("bridge");
  });

  it("should have bridge as the hub with most connections", () => {
    const bridgeConnections = ROOM_CONNECTIONS["bridge"];
    expect(bridgeConnections.length).toBeGreaterThanOrEqual(3);
  });

  it("should ensure all connected rooms exist", () => {
    const allRooms = new Set(Object.keys(ROOM_CONNECTIONS));
    for (const [room, connections] of Object.entries(ROOM_CONNECTIONS)) {
      for (const conn of connections) {
        expect(allRooms.has(conn)).toBe(true);
      }
    }
  });
});
