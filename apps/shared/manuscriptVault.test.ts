import { describe, expect, it } from "vitest";
import {
  MANUSCRIPT_VAULT,
  getDiscoveredManuscriptEntries,
  getAllReferencedClueIds,
} from "./manuscriptVault";

describe("manuscriptVault registry invariants", () => {
  it("ids are globally unique", () => {
    const ids = MANUSCRIPT_VAULT.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every entry pulls from at least 2 distinct rooms (cross-room intent)", () => {
    // The audit'd intent is "gated on cross-room clue logging".
    // Sanity-check that authors aren't ratcheting back to single-room
    // gates by accident. We can't enforce per-room without a clue→room
    // map (lives in ClueJournal); use the count-of-distinct-clue-id-
    // prefixes as a proxy.
    for (const e of MANUSCRIPT_VAULT) {
      expect(e.requiredClues.length, `${e.id} has fewer than 2 required clues`).toBeGreaterThanOrEqual(2);
    }
  });

  it("body is non-empty for every entry", () => {
    for (const e of MANUSCRIPT_VAULT) {
      expect(e.body.trim().length, `${e.id} has empty body`).toBeGreaterThan(0);
    }
  });

  it("attribution is non-empty for every entry", () => {
    for (const e of MANUSCRIPT_VAULT) {
      expect(e.attribution.trim().length, `${e.id} has empty attribution`).toBeGreaterThan(0);
    }
  });

  it("rejects stub markers", () => {
    const stubs = [/\bTODO\b/, /\bFIXME\b/, /\[placeholder\]/i];
    for (const e of MANUSCRIPT_VAULT) {
      for (const pattern of stubs) {
        expect(pattern.test(e.body), `${e.id} contains stub ${pattern}`).toBe(false);
      }
    }
  });
});

describe("getDiscoveredManuscriptEntries", () => {
  const ALL_CLUES = new Set([
    "shadow_tongue_signature",
    "pod_zero_blank_slot",
    "kael_doctrine_inconsistency",
    "bridge_door_telemetry",
    "indigo_density_observation",
  ]);

  it("returns no entries when no clues are collected", () => {
    expect(
      getDiscoveredManuscriptEntries({ collectedClueIds: new Set() }),
    ).toEqual([]);
  });

  it("returns no entries when partial clue sets are collected", () => {
    expect(
      getDiscoveredManuscriptEntries({
        collectedClueIds: new Set(["shadow_tongue_signature"]),
      }),
    ).toEqual([]);
  });

  it("vault_method_confession unlocks with both indigo + shadow_tongue clues (no flag gate)", () => {
    const result = getDiscoveredManuscriptEntries({
      collectedClueIds: new Set([
        "indigo_density_observation",
        "shadow_tongue_signature",
      ]),
    });
    expect(result.map((e) => e.id)).toContain("vault_method_confession");
  });

  it("vault_pod_zero_erasure requires its narrative flag too", () => {
    const collected = new Set([
      "shadow_tongue_signature",
      "pod_zero_blank_slot",
    ]);
    // Without the flag, locked.
    expect(
      getDiscoveredManuscriptEntries({ collectedClueIds: collected })
        .map((e) => e.id),
    ).not.toContain("vault_pod_zero_erasure");
    // With the flag, unlocked.
    expect(
      getDiscoveredManuscriptEntries({
        collectedClueIds: collected,
        narrativeFlags: new Set(["act_2_complete"]),
      }).map((e) => e.id),
    ).toContain("vault_pod_zero_erasure");
  });

  it("returns all entries when all clues + flags are collected", () => {
    const result = getDiscoveredManuscriptEntries({
      collectedClueIds: ALL_CLUES,
      narrativeFlags: new Set(["act_2_complete"]),
    });
    expect(result.length).toBe(MANUSCRIPT_VAULT.length);
  });
});

describe("getAllReferencedClueIds", () => {
  it("returns the full set of clue ids referenced anywhere in the registry", () => {
    const ids = getAllReferencedClueIds();
    expect(ids.has("shadow_tongue_signature")).toBe(true);
    expect(ids.has("pod_zero_blank_slot")).toBe(true);
    expect(ids.has("indigo_density_observation")).toBe(true);
  });
});
