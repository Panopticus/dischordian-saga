import { describe, it, expect } from "vitest";
import {
  BABYLON_GUILDS,
  getBabylonGuild,
  listBabylonGuilds,
  listInfiltratedGuilds,
  listUnlockedGuildMechanics,
} from "./babylonGuilds";

describe("babylonGuilds — Appendix A.5", () => {
  it("has exactly four guilds", () => {
    expect(listBabylonGuilds().length).toBe(4);
    expect(Object.keys(BABYLON_GUILDS).length).toBe(4);
  });

  it("each guild id matches its key", () => {
    for (const [key, guild] of Object.entries(BABYLON_GUILDS)) {
      expect(guild.id).toBe(key);
    }
  });

  it("each guild has a distinct mechanicKind", () => {
    const kinds = listBabylonGuilds().map((g) => g.mechanicKind);
    expect(new Set(kinds).size).toBe(kinds.length);
  });

  it("each guild has distinct infiltration and unlock flags", () => {
    for (const g of listBabylonGuilds()) {
      expect(g.infiltrationFlag).not.toBe(g.unlockFlag);
    }
  });

  it("Living guild unlocks organic crafting", () => {
    expect(getBabylonGuild("living").mechanicKind).toBe("organic_crafting");
  });

  it("Locks guild unlocks puzzle-box cards", () => {
    expect(getBabylonGuild("locks").mechanicKind).toBe("puzzle_box_cards");
  });

  it("Yellow Coats guild unlocks market manipulation", () => {
    expect(getBabylonGuild("yellow_coats").mechanicKind).toBe(
      "market_manipulation",
    );
  });

  it("Influencers guild unlocks Loredex rewriting", () => {
    expect(getBabylonGuild("influencers").mechanicKind).toBe(
      "loredex_rewriting",
    );
  });

  it("listInfiltratedGuilds returns empty when nothing is flagged", () => {
    expect(listInfiltratedGuilds({}).length).toBe(0);
  });

  it("listInfiltratedGuilds returns the guild whose flag is raised", () => {
    const out = listInfiltratedGuilds({ guild_living_infiltrated: true });
    expect(out.length).toBe(1);
    expect(out[0].id).toBe("living");
  });

  it("listUnlockedGuildMechanics returns mechanicKinds for raised unlock flags", () => {
    const out = listUnlockedGuildMechanics({
      puzzle_box_cards_unlocked: true,
      loredex_rewriting_unlocked: true,
    });
    expect(out).toContain("puzzle_box_cards");
    expect(out).toContain("loredex_rewriting");
    expect(out).not.toContain("organic_crafting");
  });
});
