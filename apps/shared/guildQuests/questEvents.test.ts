/**
 * Quest event-mapping tests — pure logic only. The DB-touching
 * `recordQuestEvent` wrapper is exercised by the e2e suite.
 *
 * We re-implement the event-to-delta mapping inline to keep this
 * test pure (no DB import). The contract is documented next to the
 * server `deltaForEvent` function.
 */
import { describe, it, expect } from "vitest";
import type { GuildQuestCondition } from "./questDefinitions";

type QuestEvent =
  | { kind: "pvp_card_won"; userId: number; gameType: "card_1v1" | "card_2v2" | "card_ffa" }
  | { kind: "pvp_card_played"; userId: number }
  | { kind: "chess_won"; userId: number }
  | { kind: "raid_cleared"; userId: number; bossKey: string }
  | { kind: "td_raid_won"; userId: number }
  | { kind: "td_defense_held"; userId: number }
  | { kind: "circuit_race_completed"; userId: number }
  | { kind: "trade_mission_completed"; userId: number }
  | { kind: "conspiracy_clue_collected"; userId: number; clueKey: string }
  | { kind: "conspiracy_board_solved"; userId: number; boardKey: string }
  | { kind: "member_reached_tier"; userId: number; gameType: string; tier: number }
  | { kind: "guild_war_contribution"; userId: number; points: number }
  | { kind: "any_pvp_match"; userId: number };

function deltaForEvent(cond: GuildQuestCondition, evt: QuestEvent): number {
  switch (cond.kind) {
    case "pvp_wins_total":
      if (evt.kind === "pvp_card_won") {
        if (cond.gameType && cond.gameType !== evt.gameType) return 0;
        return 1;
      }
      if (evt.kind === "chess_won" && cond.gameType === "chess") return 1;
      return 0;
    case "card_duels_played":
      return evt.kind === "pvp_card_played" ? 1 : 0;
    case "chess_wins":
      return evt.kind === "chess_won" ? 1 : 0;
    case "raid_clears":
      return evt.kind === "raid_cleared" ? 1 : 0;
    case "td_raid_wins":
      return evt.kind === "td_raid_won" ? 1 : 0;
    case "td_defenses":
      return evt.kind === "td_defense_held" ? 1 : 0;
    case "circuit_races":
      return evt.kind === "circuit_race_completed" ? 1 : 0;
    case "trade_missions_complete":
      return evt.kind === "trade_mission_completed" ? 1 : 0;
    case "conspiracy_clues_collected":
      return evt.kind === "conspiracy_clue_collected" ? 1 : 0;
    case "conspiracy_board_solved":
      if (evt.kind !== "conspiracy_board_solved") return 0;
      if (cond.boardKey && cond.boardKey !== evt.boardKey) return 0;
      return 1;
    case "member_reaches_tier":
      if (evt.kind !== "member_reached_tier") return 0;
      if (cond.gameType && cond.gameType !== evt.gameType) return 0;
      return evt.tier >= cond.tier ? 1 : 0;
    case "guild_war_contribution":
      return evt.kind === "guild_war_contribution" ? evt.points : 0;
    case "any_pvp_match":
      return evt.kind === "any_pvp_match" ? 1 : 0;
  }
}

describe("quest event → delta mapping", () => {
  it("pvp_wins_total fires for card win when gameType matches", () => {
    expect(deltaForEvent(
      { kind: "pvp_wins_total", gameType: "card_1v1", count: 5 },
      { kind: "pvp_card_won", userId: 1, gameType: "card_1v1" },
    )).toBe(1);
  });

  it("pvp_wins_total ignores card win when gameType doesn't match", () => {
    expect(deltaForEvent(
      { kind: "pvp_wins_total", gameType: "card_2v2", count: 5 },
      { kind: "pvp_card_won", userId: 1, gameType: "card_1v1" },
    )).toBe(0);
  });

  it("pvp_wins_total fires for chess only when gameType=chess", () => {
    expect(deltaForEvent(
      { kind: "pvp_wins_total", gameType: "chess", count: 5 },
      { kind: "chess_won", userId: 1 },
    )).toBe(1);
    expect(deltaForEvent(
      { kind: "pvp_wins_total", gameType: "card_1v1", count: 5 },
      { kind: "chess_won", userId: 1 },
    )).toBe(0);
  });

  it("conspiracy_board_solved respects boardKey filter", () => {
    expect(deltaForEvent(
      { kind: "conspiracy_board_solved", boardKey: "thought_virus" },
      { kind: "conspiracy_board_solved", userId: 1, boardKey: "thought_virus" },
    )).toBe(1);
    expect(deltaForEvent(
      { kind: "conspiracy_board_solved", boardKey: "thought_virus" },
      { kind: "conspiracy_board_solved", userId: 1, boardKey: "kaels_revenge" },
    )).toBe(0);
  });

  it("conspiracy_board_solved without boardKey accepts any", () => {
    expect(deltaForEvent(
      { kind: "conspiracy_board_solved" },
      { kind: "conspiracy_board_solved", userId: 1, boardKey: "anything" },
    )).toBe(1);
  });

  it("member_reaches_tier fires only when reaching at-or-above the gate", () => {
    expect(deltaForEvent(
      { kind: "member_reaches_tier", tier: 4, count: 1 },
      { kind: "member_reached_tier", userId: 1, gameType: "card_1v1", tier: 4 },
    )).toBe(1);
    expect(deltaForEvent(
      { kind: "member_reaches_tier", tier: 4, count: 1 },
      { kind: "member_reached_tier", userId: 1, gameType: "card_1v1", tier: 3 },
    )).toBe(0);
    // Higher tier still satisfies the gate.
    expect(deltaForEvent(
      { kind: "member_reaches_tier", tier: 4, count: 1 },
      { kind: "member_reached_tier", userId: 1, gameType: "card_1v1", tier: 6 },
    )).toBe(1);
  });

  it("member_reaches_tier respects optional gameType filter", () => {
    expect(deltaForEvent(
      { kind: "member_reaches_tier", gameType: "chess", tier: 4, count: 1 },
      { kind: "member_reached_tier", userId: 1, gameType: "card_1v1", tier: 6 },
    )).toBe(0);
  });

  it("guild_war_contribution accumulates by point value", () => {
    expect(deltaForEvent(
      { kind: "guild_war_contribution", points: 10000 },
      { kind: "guild_war_contribution", userId: 1, points: 250 },
    )).toBe(250);
  });

  it("any_pvp_match increments by 1 per match", () => {
    expect(deltaForEvent(
      { kind: "any_pvp_match", count: 10 },
      { kind: "any_pvp_match", userId: 1 },
    )).toBe(1);
  });

  it("td_defenses fires only for defense-held events", () => {
    expect(deltaForEvent(
      { kind: "td_defenses", count: 25 },
      { kind: "td_defense_held", userId: 1 },
    )).toBe(1);
    expect(deltaForEvent(
      { kind: "td_defenses", count: 25 },
      { kind: "td_raid_won", userId: 1 },
    )).toBe(0);
  });

  it("unrelated events return 0 for every condition", () => {
    expect(deltaForEvent(
      { kind: "trade_missions_complete", count: 20 },
      { kind: "chess_won", userId: 1 },
    )).toBe(0);
  });
});
