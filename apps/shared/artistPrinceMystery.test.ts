import { describe, it, expect } from "vitest";
import {
  CLUE_CARDS,
  BOARD_CONNECTIONS,
  getAvailableConnections,
  getClueById,
  getConnectionById,
  boardCompletionPercent,
  type ClueId,
} from "./artistPrinceMystery";
import { MATRIX_OF_DREAMS_LEVELS } from "./matrixOfDreamsLevels";

describe("artistPrinceMystery — Hamlet conspiracy board", () => {
  it("registers 8 clue cards", () => {
    expect(CLUE_CARDS.length).toBe(8);
  });

  it("every clue references a real episode in the level registry", () => {
    const episodeIds = new Set(MATRIX_OF_DREAMS_LEVELS.map((l) => l.id));
    for (const clue of CLUE_CARDS) {
      expect(episodeIds.has(clue.sourceEpisodeId)).toBe(true);
    }
  });

  it("every clue has unique id, title, and framing", () => {
    const ids = CLUE_CARDS.map((c) => c.id);
    const titles = CLUE_CARDS.map((c) => c.title);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(titles).size).toBe(titles.length);
    for (const c of CLUE_CARDS) expect(c.framing.length).toBeGreaterThan(20);
  });

  it("every connection points at registered clues", () => {
    const allClueIds = new Set(CLUE_CARDS.map((c) => c.id));
    for (const conn of BOARD_CONNECTIONS) {
      expect(allClueIds.has(conn.fromClue)).toBe(true);
      expect(allClueIds.has(conn.toClue)).toBe(true);
    }
  });

  it("the Prince-is-Engineer connection requires First-Celebration-destroyed", () => {
    const conn = BOARD_CONNECTIONS.find(
      (c) => c.fromClue === "first_celebration_destroyed" && c.toClue === "prince_is_engineer",
    );
    expect(conn).toBeDefined();
    expect(conn!.inference.toLowerCase()).toContain("engineer");
  });

  it("getAvailableConnections returns nothing when no clues are collected", () => {
    const state = {
      cluesCollected: new Set<ClueId>(),
      connectionsMade: new Set<string>(),
    };
    expect(getAvailableConnections(state).length).toBe(0);
  });

  it("getAvailableConnections gates correctly when both clues are present", () => {
    const state = {
      cluesCollected: new Set<ClueId>(["ghost_seen", "ghost_speaks_the_warlord"]),
      connectionsMade: new Set<string>(),
    };
    const available = getAvailableConnections(state);
    expect(available.length).toBeGreaterThan(0);
    expect(available.find((c) => c.id === "conn_ghost_to_ghost_speaks")).toBeDefined();
  });

  it("getAvailableConnections excludes already-made connections", () => {
    const state = {
      cluesCollected: new Set<ClueId>(["ghost_seen", "ghost_speaks_the_warlord"]),
      connectionsMade: new Set<string>(["conn_ghost_to_ghost_speaks"]),
    };
    const available = getAvailableConnections(state);
    expect(available.find((c) => c.id === "conn_ghost_to_ghost_speaks")).toBeUndefined();
  });

  it("boardCompletionPercent reports 0 for empty state and 100 for full state", () => {
    const empty = {
      cluesCollected: new Set<ClueId>(),
      connectionsMade: new Set<string>(),
    };
    expect(boardCompletionPercent(empty)).toBe(0);
    const full = {
      cluesCollected: new Set<ClueId>(CLUE_CARDS.map((c) => c.id)),
      connectionsMade: new Set<string>(BOARD_CONNECTIONS.map((c) => c.id)),
    };
    expect(boardCompletionPercent(full)).toBe(100);
  });

  it("getClueById and getConnectionById return canonical entries", () => {
    expect(getClueById("ghost_seen")?.title).toContain("Ghost");
    expect(getConnectionById("conn_ghost_to_ghost_speaks")).toBeDefined();
    expect(getClueById("not_a_clue" as ClueId)).toBeUndefined();
  });

  it("the Antiquarian's responses carry his archival voice", () => {
    for (const conn of BOARD_CONNECTIONS) {
      expect(conn.antiquarianResponse.length).toBeGreaterThan(40);
    }
    // Some response should reference filing/archive vocabulary
    const archivalCount = BOARD_CONNECTIONS.filter(
      (c) =>
        c.antiquarianResponse.toLowerCase().includes("file") ||
        c.antiquarianResponse.toLowerCase().includes("archive") ||
        c.antiquarianResponse.toLowerCase().includes("record"),
    ).length;
    expect(archivalCount).toBeGreaterThanOrEqual(2);
  });

  it("the cross-school clue (Patron is Architect Proxy) sources from a Mechronis episode", () => {
    const clue = getClueById("patron_is_architect_proxy");
    expect(clue?.sourceEpisodeId).toMatch(/^mechronis_/);
  });
});
