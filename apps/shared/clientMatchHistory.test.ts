/**
 * clientMatchHistory — localStorage round-trip tests.
 *
 * vitest's default pool runs apps/shared/ in node (no DOM), so we
 * stub a minimal localStorage before importing the module under
 * test. The helper's runtime guards (`typeof localStorage ===
 * "undefined"`) already tolerate the no-DOM case on the server,
 * but the round-trip behavior can only be exercised with a live
 * store.
 */
import { describe, it, expect, beforeEach } from "vitest";

class InMemoryStorage {
  private store = new Map<string, string>();
  getItem(k: string): string | null { return this.store.get(k) ?? null; }
  setItem(k: string, v: string): void { this.store.set(k, String(v)); }
  removeItem(k: string): void { this.store.delete(k); }
  clear(): void { this.store.clear(); }
  key(i: number): string | null { return Array.from(this.store.keys())[i] ?? null; }
  get length(): number { return this.store.size; }
}

if (typeof globalThis.localStorage === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).localStorage = new InMemoryStorage();
}
import {
  MATCH_HISTORY_STORAGE_KEY,
  MAX_ENTRIES,
  appendMatchHistoryEntry,
  readMatchHistory,
  summarizeMatchHistory,
  type MatchHistoryEntry,
} from "./clientMatchHistory";

function sample(
  overrides: Partial<MatchHistoryEntry> = {},
): MatchHistoryEntry {
  return {
    at: Date.now(),
    outcome: "win",
    opponent: "Warlord Zero",
    encounterId: "ch_warlord_zero_first",
    turns: 8,
    cardsPlayed: 12,
    playerFaction: "architect",
    ...overrides,
  };
}

describe("clientMatchHistory", () => {
  beforeEach(() => {
    // Fresh localStorage for every test.
    if (typeof localStorage !== "undefined") localStorage.clear();
  });

  it("reads [] on empty storage", () => {
    expect(readMatchHistory()).toEqual([]);
  });

  it("appends a single entry and reads it back", () => {
    const entry = sample();
    const list = appendMatchHistoryEntry(entry);
    expect(list).toEqual([entry]);
    expect(readMatchHistory()).toEqual([entry]);
  });

  it("newest entries land at the front of the list", () => {
    const first = sample({ at: 1, opponent: "First" });
    const second = sample({ at: 2, opponent: "Second" });
    appendMatchHistoryEntry(first);
    const list = appendMatchHistoryEntry(second);
    expect(list[0].opponent).toBe("Second");
    expect(list[1].opponent).toBe("First");
  });

  it("caps the history at MAX_ENTRIES", () => {
    let list: MatchHistoryEntry[] = [];
    for (let i = 0; i < MAX_ENTRIES + 5; i++) {
      list = appendMatchHistoryEntry(sample({ at: i, opponent: `match_${i}` }));
    }
    expect(list.length).toBe(MAX_ENTRIES);
    // Oldest-first eviction — the last item should be the most
    // recent *among the surviving window*, not a random entry.
    expect(list[0].opponent).toBe(`match_${MAX_ENTRIES + 4}`);
    expect(list[MAX_ENTRIES - 1].opponent).toBe(`match_5`);
  });

  it("returns [] on corrupt JSON blob", () => {
    localStorage.setItem(MATCH_HISTORY_STORAGE_KEY, "{not valid json");
    expect(readMatchHistory()).toEqual([]);
  });

  it("filters non-entry shapes out of the returned list", () => {
    localStorage.setItem(
      MATCH_HISTORY_STORAGE_KEY,
      JSON.stringify([
        sample({ at: 1 }),
        { bogus: true },
        "also bogus",
        null,
      ]),
    );
    const list = readMatchHistory();
    expect(list.length).toBe(1);
    expect(list[0].at).toBe(1);
  });

  it("summarizeMatchHistory counts outcomes", () => {
    const entries: MatchHistoryEntry[] = [
      sample({ outcome: "win" }),
      sample({ outcome: "win" }),
      sample({ outcome: "loss" }),
      sample({ outcome: "withdrawn" }),
    ];
    const stats = summarizeMatchHistory(entries);
    expect(stats).toEqual({ wins: 2, losses: 1, withdrawn: 1, total: 4 });
  });

  it("summarize on empty list is all zeros", () => {
    expect(summarizeMatchHistory([])).toEqual({
      wins: 0,
      losses: 0,
      withdrawn: 0,
      total: 0,
    });
  });
});
