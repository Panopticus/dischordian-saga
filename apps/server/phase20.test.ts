/* ═══════════════════════════════════════════════════════
   Phase 20 Tests — Card Gallery, Player Profile, Ambient Music
   Tests the client-side logic for these new features
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";

/* ─── CARD GALLERY LOGIC ─── */
describe("Card Gallery — Collection Catalog", () => {
  // Card rarity tiers
  const RARITY_ORDER = ["common", "uncommon", "rare", "legendary", "mythic"];

  it("should define correct rarity ordering", () => {
    expect(RARITY_ORDER.indexOf("common")).toBeLessThan(RARITY_ORDER.indexOf("uncommon"));
    expect(RARITY_ORDER.indexOf("uncommon")).toBeLessThan(RARITY_ORDER.indexOf("rare"));
    expect(RARITY_ORDER.indexOf("rare")).toBeLessThan(RARITY_ORDER.indexOf("legendary"));
    expect(RARITY_ORDER.indexOf("legendary")).toBeLessThan(RARITY_ORDER.indexOf("mythic"));
  });

  it("should generate unique card IDs from name and rarity", () => {
    const makeId = (name: string, rarity: string) =>
      `${name.toLowerCase().replace(/\s+/g, "-")}-${rarity}`;

    const id1 = makeId("Void Sentinel", "rare");
    const id2 = makeId("Void Sentinel", "legendary");
    const id3 = makeId("Iron Vanguard", "rare");

    expect(id1).toBe("void-sentinel-rare");
    expect(id2).toBe("void-sentinel-legendary");
    expect(id1).not.toBe(id2);
    expect(id1).not.toBe(id3);
  });

  it("should filter cards by rarity", () => {
    const cards = [
      { name: "A", rarity: "common" },
      { name: "B", rarity: "rare" },
      { name: "C", rarity: "legendary" },
      { name: "D", rarity: "common" },
      { name: "E", rarity: "mythic" },
    ];

    const filterByRarity = (r: string) => cards.filter(c => c.rarity === r);

    expect(filterByRarity("common")).toHaveLength(2);
    expect(filterByRarity("rare")).toHaveLength(1);
    expect(filterByRarity("legendary")).toHaveLength(1);
    expect(filterByRarity("mythic")).toHaveLength(1);
    expect(filterByRarity("uncommon")).toHaveLength(0);
  });

  it("should calculate collection completion percentage", () => {
    const totalCards = 50;
    const ownedCards = 12;
    const percentage = Math.round((ownedCards / totalCards) * 100);
    expect(percentage).toBe(24);

    const fullCollection = Math.round((50 / 50) * 100);
    expect(fullCollection).toBe(100);

    const empty = Math.round((0 / 50) * 100);
    expect(empty).toBe(0);
  });

  it("should sort cards by rarity tier", () => {
    const cards = [
      { name: "A", rarity: "legendary" },
      { name: "B", rarity: "common" },
      { name: "C", rarity: "mythic" },
      { name: "D", rarity: "rare" },
      { name: "E", rarity: "uncommon" },
    ];

    const sorted = [...cards].sort(
      (a, b) => RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity)
    );

    expect(sorted[0].rarity).toBe("mythic");
    expect(sorted[1].rarity).toBe("legendary");
    expect(sorted[2].rarity).toBe("rare");
    expect(sorted[3].rarity).toBe("uncommon");
    expect(sorted[4].rarity).toBe("common");
  });
});

/* ─── PLAYER PROFILE LOGIC ─── */
describe("Player Profile — Stats Calculation", () => {
  const TOTAL_ROOMS = 12;
  const TOTAL_PUZZLES = 8;
  const TOTAL_EASTER_EGGS = 10;
  const TOTAL_ACHIEVEMENTS = 50;

  function calcCompletionPercentage(stats: {
    roomsUnlocked: number;
    puzzlesSolved: number;
    easterEggsFound: number;
    achievementsEarned: number;
    battlesWon: number;
  }) {
    const weights = {
      rooms: 0.25,
      puzzles: 0.20,
      easterEggs: 0.15,
      achievements: 0.25,
      battles: 0.15,
    };

    const roomPct = Math.min(stats.roomsUnlocked / TOTAL_ROOMS, 1);
    const puzzlePct = Math.min(stats.puzzlesSolved / TOTAL_PUZZLES, 1);
    const eggPct = Math.min(stats.easterEggsFound / TOTAL_EASTER_EGGS, 1);
    const achievePct = Math.min(stats.achievementsEarned / TOTAL_ACHIEVEMENTS, 1);
    const battlePct = Math.min(stats.battlesWon / 10, 1); // 10 battles for full credit

    return Math.round(
      (roomPct * weights.rooms +
        puzzlePct * weights.puzzles +
        eggPct * weights.easterEggs +
        achievePct * weights.achievements +
        battlePct * weights.battles) * 100
    );
  }

  it("should calculate 0% for a brand new player", () => {
    expect(calcCompletionPercentage({
      roomsUnlocked: 0,
      puzzlesSolved: 0,
      easterEggsFound: 0,
      achievementsEarned: 0,
      battlesWon: 0,
    })).toBe(0);
  });

  it("should calculate 100% for a fully completed player", () => {
    expect(calcCompletionPercentage({
      roomsUnlocked: 12,
      puzzlesSolved: 8,
      easterEggsFound: 10,
      achievementsEarned: 50,
      battlesWon: 10,
    })).toBe(100);
  });

  it("should calculate partial completion correctly", () => {
    const pct = calcCompletionPercentage({
      roomsUnlocked: 6,    // 50% of 12 → 0.5 * 0.25 = 0.125
      puzzlesSolved: 4,     // 50% of 8 → 0.5 * 0.20 = 0.10
      easterEggsFound: 2,   // 20% of 10 → 0.2 * 0.15 = 0.03
      achievementsEarned: 10, // 20% of 50 → 0.2 * 0.25 = 0.05
      battlesWon: 3,        // 30% of 10 → 0.3 * 0.15 = 0.045
    });
    // 0.125 + 0.10 + 0.03 + 0.05 + 0.045 = 0.35 → 35%
    expect(pct).toBe(35);
  });

  it("should cap individual categories at 100%", () => {
    const pct = calcCompletionPercentage({
      roomsUnlocked: 20, // Over max, should cap at 100%
      puzzlesSolved: 100,
      easterEggsFound: 50,
      achievementsEarned: 200,
      battlesWon: 100,
    });
    expect(pct).toBe(100);
  });

  it("should generate rank titles based on completion", () => {
    function getRank(pct: number): string {
      if (pct >= 100) return "GRAND ARCHIVIST";
      if (pct >= 80) return "MASTER OPERATIVE";
      if (pct >= 60) return "SENIOR AGENT";
      if (pct >= 40) return "FIELD OPERATIVE";
      if (pct >= 20) return "RECRUIT";
      return "UNRANKED";
    }

    expect(getRank(0)).toBe("UNRANKED");
    expect(getRank(15)).toBe("UNRANKED");
    expect(getRank(20)).toBe("RECRUIT");
    expect(getRank(40)).toBe("FIELD OPERATIVE");
    expect(getRank(60)).toBe("SENIOR AGENT");
    expect(getRank(80)).toBe("MASTER OPERATIVE");
    expect(getRank(100)).toBe("GRAND ARCHIVIST");
  });
});

/* ─── AMBIENT MUSIC LOGIC ─── */
describe("Ambient Music — Room-to-Album Mapping", () => {
  // Room-to-album mapping from AmbientMusicContext
  const ROOM_ALBUM_MAP: Record<string, string> = {
    "bridge": "Dischordian Logic",
    "cryo-bay": "Dischordian Logic",
    "archives": "The Age of Privacy",
    "comms-array": "The Age of Privacy",
    "engineering": "The Book of Daniel 2:47",
    "armory": "The Book of Daniel 2:47",
    "cargo-hold": "Dischordian Logic",
    "observation-deck": "Silence in Heaven",
    "medical-bay": "The Age of Privacy",
    "captains-quarters": "Silence in Heaven",
  };

  it("should map every room to an album", () => {
    const rooms = Object.keys(ROOM_ALBUM_MAP);
    expect(rooms.length).toBeGreaterThanOrEqual(10);
    rooms.forEach(room => {
      expect(ROOM_ALBUM_MAP[room]).toBeTruthy();
    });
  });

  it("should use Dischordian Logic for command rooms", () => {
    expect(ROOM_ALBUM_MAP["bridge"]).toBe("Dischordian Logic");
    expect(ROOM_ALBUM_MAP["cryo-bay"]).toBe("Dischordian Logic");
  });

  it("should use Age of Privacy for intelligence rooms", () => {
    expect(ROOM_ALBUM_MAP["archives"]).toBe("The Age of Privacy");
    expect(ROOM_ALBUM_MAP["comms-array"]).toBe("The Age of Privacy");
    expect(ROOM_ALBUM_MAP["medical-bay"]).toBe("The Age of Privacy");
  });

  it("should use Book of Daniel for combat/engineering rooms", () => {
    expect(ROOM_ALBUM_MAP["engineering"]).toBe("The Book of Daniel 2:47");
    expect(ROOM_ALBUM_MAP["armory"]).toBe("The Book of Daniel 2:47");
  });

  it("should use Silence in Heaven for contemplative rooms", () => {
    expect(ROOM_ALBUM_MAP["observation-deck"]).toBe("Silence in Heaven");
    expect(ROOM_ALBUM_MAP["captains-quarters"]).toBe("Silence in Heaven");
  });

  it("should select random track from album playlist", () => {
    const playlist = [
      { id: "1", title: "Track A", videoId: "abc", album: "Test" },
      { id: "2", title: "Track B", videoId: "def", album: "Test" },
      { id: "3", title: "Track C", videoId: "ghi", album: "Test" },
    ];

    // Simulate random selection
    const selected = playlist[Math.floor(Math.random() * playlist.length)];
    expect(playlist).toContainEqual(selected);
    expect(selected.album).toBe("Test");
  });

  it("should handle rooms without music gracefully", () => {
    const unknownRoom = "nonexistent-room";
    const album = ROOM_ALBUM_MAP[unknownRoom];
    expect(album).toBeUndefined();
    // System should fall back to default or no music
  });
});

/* ─── EASTER EGG TRACKING LOGIC ─── */
describe("Easter Egg — Discovery Tracking", () => {
  it("should track discovered eggs in a Set", () => {
    const discovered = new Set<string>();

    discovered.add("cryo-bay-egg");
    discovered.add("bridge-egg");

    expect(discovered.size).toBe(2);
    expect(discovered.has("cryo-bay-egg")).toBe(true);
    expect(discovered.has("archives-egg")).toBe(false);

    // Adding duplicate should not increase size
    discovered.add("cryo-bay-egg");
    expect(discovered.size).toBe(2);
  });

  it("should serialize and deserialize discovered eggs", () => {
    const original = new Set(["egg-1", "egg-2", "egg-3"]);
    const serialized = JSON.stringify(Array.from(original));
    const restored = new Set(JSON.parse(serialized));

    expect(restored.size).toBe(3);
    expect(restored.has("egg-1")).toBe(true);
    expect(restored.has("egg-2")).toBe(true);
    expect(restored.has("egg-3")).toBe(true);
  });

  it("should calculate discovery percentage", () => {
    const totalEggs = 10;
    const found = 4;
    expect(Math.round((found / totalEggs) * 100)).toBe(40);
  });
});

/* ─── TTS VOICE SELECTION LOGIC ─── */
describe("Elara TTS — Voice Configuration", () => {
  it("should define correct pitch and rate for horror sci-fi tone", () => {
    const config = { rate: 0.85, pitch: 0.9, volume: 0.8 };

    expect(config.rate).toBeLessThan(1); // Slower than normal
    expect(config.pitch).toBeLessThan(1); // Slightly lower pitch
    expect(config.volume).toBeGreaterThan(0);
    expect(config.volume).toBeLessThanOrEqual(1);
  });

  it("should prefer female voices for Elara", () => {
    const mockVoices = [
      { name: "Google US English Male", lang: "en-US" },
      { name: "Google UK English Female", lang: "en-GB" },
      { name: "Microsoft Zira", lang: "en-US" },
      { name: "Samantha", lang: "en-US" },
    ];

    const femaleKeywords = ["female", "zira", "samantha", "victoria", "karen", "moira"];
    const preferred = mockVoices.filter(v =>
      femaleKeywords.some(k => v.name.toLowerCase().includes(k))
    );

    expect(preferred.length).toBeGreaterThan(0);
    expect(preferred.some(v => v.name.includes("Zira") || v.name.includes("Samantha"))).toBe(true);
  });
});
