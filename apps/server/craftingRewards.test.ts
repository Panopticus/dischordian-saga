/* ═══════════════════════════════════════════════════════
   CRAFTING REWARDS WIRING TESTS

   Validates that the new craftingRewards service is wired
   into every game-mode reward path (fight / card battle /
   bulk disenchant), that getCraftingProfile seeds starter
   materials for first-time players, and that the Character
   Sheet equipment picker surfaces crafted items so newly
   forged gear is actually equippable.

   Uses the same source-file inspection style as the other
   `task*` suites in this directory.
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { craftingRewards } from "./services/craftingRewards";

/* ── Pure-function helpers on the service ── */

describe("craftingRewards.forFight", () => {
  it("returns nothing on a loss", () => {
    const drops = craftingRewards.forFight({ won: false, difficulty: "legendary", winStreak: 9 });
    expect(drops).toEqual({});
  });

  it("awards a battle_shard for any arena win", () => {
    const drops = craftingRewards.forFight({ won: true, difficulty: "easy", winStreak: 1 });
    expect(drops.battle_shard).toBe(1);
  });

  it("awards champions_mark on a 3-win streak", () => {
    const drops = craftingRewards.forFight({ won: true, difficulty: "normal", winStreak: 3 });
    expect(drops.champions_mark).toBe(1);
  });

  it("drops void_catalyst on hard/elite/legendary wins", () => {
    for (const difficulty of ["hard", "elite", "legendary"]) {
      const drops = craftingRewards.forFight({ won: true, difficulty, winStreak: 1 });
      expect(drops.void_catalyst).toBe(1);
    }
  });

  it("drops the legendary architects_tear only on legendary wins", () => {
    const legendaryDrops = craftingRewards.forFight({ won: true, difficulty: "legendary", winStreak: 1 });
    expect(legendaryDrops.architects_tear).toBe(1);

    const hardDrops = craftingRewards.forFight({ won: true, difficulty: "hard", winStreak: 1 });
    expect(hardDrops.architects_tear).toBeUndefined();
  });
});

describe("craftingRewards.forCardBattle", () => {
  it("grants card_essence on win only", () => {
    expect(craftingRewards.forCardBattle({ won: true })).toEqual({ card_essence: 2 });
    expect(craftingRewards.forCardBattle({ won: false })).toEqual({});
  });
});

describe("craftingRewards.forDisenchant", () => {
  it("returns empty for zero disenchants", () => {
    expect(craftingRewards.forDisenchant({ common: 0, rare: 0, legendary: 0 })).toEqual({});
  });

  it("buckets each rarity into the right material", () => {
    const drops = craftingRewards.forDisenchant({ common: 5, rare: 2, legendary: 1 });
    expect(drops.card_essence).toBe(5);
    expect(drops.rare_essence).toBe(2);
    expect(drops.legendary_essence).toBe(1);
  });
});

/* ── Source-level wiring checks: the service is actually called ── */

function loadSource(rel: string): string {
  return fs.readFileSync(path.resolve(__dirname, rel), "utf-8");
}

describe("fightLeaderboard.recordMatch wires craftingRewards", () => {
  const src = loadSource("routers/fightLeaderboard.ts");

  it("imports the crafting rewards service", () => {
    expect(src).toContain('from "../services/craftingRewards"');
  });

  it("calls forFight with won / difficulty / winStreak after recording the match", () => {
    expect(src).toMatch(/craftingRewards\.forFight\(\s*\{/);
    expect(src).toContain("won: input.won");
    expect(src).toContain("difficulty: input.difficulty");
    expect(src).toContain("winStreak: newStreak");
  });

  it("awards the drops via craftingRewards.award", () => {
    expect(src).toMatch(/craftingRewards\.award\(userId,\s*craftingDrops\)/);
  });

  it("returns craftingDrops in the recordMatch response", () => {
    expect(src).toMatch(/craftingDrops,?\s*\n\s*\};/);
  });
});

describe("cardGame win paths wire craftingRewards", () => {
  const src = loadSource("routers/cardGame.ts");

  it("imports the crafting rewards service", () => {
    expect(src).toContain('from "../services/craftingRewards"');
  });

  it("calls forCardBattle on every completed-match branch", () => {
    // Three endTurn / playCard win-detection branches (see cardGame.ts).
    const matches = src.match(/craftingRewards\.forCardBattle/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(3);
  });

  it("routes the drops through craftingRewards.award", () => {
    expect(src).toMatch(/craftingRewards\.award\(ctx\.user\.id,\s*cardDrops\)/);
  });
});

describe("inventory.disenchantDuplicates wires craftingRewards", () => {
  const src = loadSource("routers/inventory.ts");

  it("imports the crafting rewards service", () => {
    expect(src).toContain('from "../services/craftingRewards"');
  });

  it("awards card_essence based on disenchanted card count", () => {
    expect(src).toMatch(/craftingRewards\.forDisenchant\(/);
    expect(src).toContain("common: cardsDisenchanted");
  });

  it("returns the materials bag on the disenchant response", () => {
    expect(src).toMatch(/materials:\s*craftingDrops/);
  });
});

/* ── Seed / profile behavior ── */

describe("crafting.getCraftingProfile seeds starter materials", () => {
  const src = loadSource("routers/crafting.ts");

  it("defines a STARTER_MATERIALS bundle inside getCraftingProfile", () => {
    expect(src).toContain("STARTER_MATERIALS");
    expect(src).toMatch(/card_essence:\s*10/);
    expect(src).toMatch(/iron_ore:\s*\d+/);
    expect(src).toMatch(/stardust:\s*\d+/);
  });

  it("persists the seed with a craftingSeeded flag so it only runs once", () => {
    expect(src).toContain("craftingSeeded");
  });

  it("still falls back to starter materials when the DB is unavailable", () => {
    expect(src).toMatch(/materials:\s*\{\s*\.\.\.STARTER_MATERIALS\s*\}/);
  });
});

/* ── Client-side equipment picker surfaces crafted items ── */

describe("CharacterSheetPage equipment picker includes crafted items", () => {
  const src = fs.readFileSync(
    path.resolve(__dirname, "../client/src/pages/CharacterSheetPage.tsx"),
    "utf-8",
  );

  it("queries the crafting profile", () => {
    expect(src).toContain("trpc.crafting.getCraftingProfile.useQuery");
  });

  it("folds crafted item IDs into the owned-inventory set", () => {
    expect(src).toContain("craftedItemIds");
    expect(src).toMatch(/for \(const id of craftedItemIds\) owned\.add\(id\);/);
  });
});

/* ── Inventory page Forge tab ── */

describe("InventoryPage exposes a Forge tab", () => {
  const src = fs.readFileSync(
    path.resolve(__dirname, "../client/src/pages/InventoryPage.tsx"),
    "utf-8",
  );

  it("adds a forge tab to the tab list", () => {
    expect(src).toMatch(/"overview",\s*"cards",\s*"forge",\s*"disenchant"/);
  });

  it("defines a ForgeTab component that reads the crafting profile", () => {
    expect(src).toContain("function ForgeTab");
    expect(src).toContain("trpc.crafting.getCraftingProfile.useQuery");
  });

  it("links to the Forge page and Character Sheet for equipping", () => {
    expect(src).toContain('href="/forge"');
    expect(src).toContain('href="/character-sheet"');
  });
});
