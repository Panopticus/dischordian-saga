/**
 * audit/16 PR 31 (Co6 follow-up) — bridge.ts mechanical-refactor
 * snapshot-equivalence tests.
 *
 * The mechanical refactor replaces every
 *   { lucid: "...", fragmented: "...", luminous: "..." }
 * literal in bridge.ts with a `bandedNarration(...)` call (and
 * the same for `bandedHumanNarration`). The change is type-
 * equivalent and pure-ergonomic.
 *
 * These tests exist to catch the only realistic regression
 * mode: a typo during the manual conversion that drops a band
 * or duplicates one. They walk every authored triplet in
 * BRIDGE_MYSTERY and assert:
 *   - All three Elara bands resolve to non-empty strings
 *   - All three Human bands (where authored) resolve to
 *     non-empty strings
 *   - No band is silently identical to another (would indicate
 *     a copy-paste typo)
 *
 * Anything stronger (snapshot of all 144 band-keys' authored
 * text) would re-encode the whole file and bloat diffs without
 * adding signal beyond what these structural invariants catch.
 */

import { describe, expect, it } from "vitest";
import { BRIDGE_MYSTERY } from "./bridge";
import {
  resolveBandedNarration,
  resolveHumanBandedNarration,
  type ElaraNarration,
  type HumanNarration,
  type VerbResponse,
} from "./_template";

const ELARA_BANDS = ["lucid", "fragmented", "luminous"] as const;
const HUMAN_BANDS = ["shadow", "balanced", "warm"] as const;

function isBandedElara(n: ElaraNarration): boolean {
  return typeof n !== "string";
}
function isBandedHuman(n: HumanNarration): boolean {
  return typeof n !== "string";
}

/** Walk the BRIDGE_MYSTERY responses tree and yield every
 *  banded narration we should validate. */
function* walkBandedNarrations(
  responses: typeof BRIDGE_MYSTERY.responses,
): Generator<{ path: string; narration: ElaraNarration | HumanNarration; kind: "elara" | "human" }> {
  for (const [hotspotId, verbs] of Object.entries(responses)) {
    for (const [verb, response] of Object.entries(verbs)) {
      const r = response as VerbResponse;
      yield {
        path: `${hotspotId}.${verb}.narration`,
        narration: r.narration,
        kind: "elara",
      };
      if (r.humanReaction) {
        yield {
          path: `${hotspotId}.${verb}.humanReaction.narration`,
          narration: r.humanReaction.narration,
          kind: "human",
        };
      }
      // Tier responses
      if (r.tiers) {
        for (let i = 0; i < r.tiers.length; i++) {
          const tier = r.tiers[i]!;
          yield {
            path: `${hotspotId}.${verb}.tiers[${i}].narration`,
            narration: tier.narration,
            kind: "elara",
          };
          if (tier.humanReaction) {
            yield {
              path: `${hotspotId}.${verb}.tiers[${i}].humanReaction.narration`,
              narration: tier.humanReaction.narration,
              kind: "human",
            };
          }
        }
      }
    }
  }
}

describe("bridge.ts refactor invariants (audit/16 PR 31 / Co6)", () => {
  it("BRIDGE_MYSTERY exists and has hotspots", () => {
    expect(BRIDGE_MYSTERY.roomId).toBe("bridge");
    expect(Object.keys(BRIDGE_MYSTERY.responses).length).toBeGreaterThan(0);
  });

  it("every banded Elara triplet resolves non-empty for all 3 bands", () => {
    let bandedCount = 0;
    for (const entry of walkBandedNarrations(BRIDGE_MYSTERY.responses)) {
      if (entry.kind !== "elara") continue;
      if (!isBandedElara(entry.narration as ElaraNarration)) continue;
      bandedCount++;
      for (const band of ELARA_BANDS) {
        const text = resolveBandedNarration(entry.narration as ElaraNarration, band);
        expect(
          text.trim().length,
          `${entry.path} ${band} is empty`,
        ).toBeGreaterThan(0);
      }
    }
    // Sanity — bridge.ts should have lots of banded triplets.
    expect(bandedCount, "bridge.ts has surprisingly few banded triplets").toBeGreaterThan(20);
  });

  it("every banded Human triplet resolves non-empty for all 3 bands", () => {
    let bandedCount = 0;
    for (const entry of walkBandedNarrations(BRIDGE_MYSTERY.responses)) {
      if (entry.kind !== "human") continue;
      if (!isBandedHuman(entry.narration as HumanNarration)) continue;
      bandedCount++;
      for (const band of HUMAN_BANDS) {
        const text = resolveHumanBandedNarration(entry.narration as HumanNarration, band);
        expect(
          text.trim().length,
          `${entry.path} ${band} is empty`,
        ).toBeGreaterThan(0);
      }
    }
    expect(bandedCount, "bridge.ts has no banded Human reactions?").toBeGreaterThan(0);
  });

  it("no Elara triplet has two bands with identical text (copy-paste typo guard)", () => {
    for (const entry of walkBandedNarrations(BRIDGE_MYSTERY.responses)) {
      if (entry.kind !== "elara") continue;
      if (!isBandedElara(entry.narration as ElaraNarration)) continue;
      const lucid = resolveBandedNarration(entry.narration as ElaraNarration, "lucid");
      const fragmented = resolveBandedNarration(entry.narration as ElaraNarration, "fragmented");
      const luminous = resolveBandedNarration(entry.narration as ElaraNarration, "luminous");
      expect(lucid, `${entry.path} lucid==fragmented`).not.toBe(fragmented);
      expect(lucid, `${entry.path} lucid==luminous`).not.toBe(luminous);
      expect(fragmented, `${entry.path} fragmented==luminous`).not.toBe(luminous);
    }
  });

  it("no Human triplet has two bands with identical text (copy-paste typo guard)", () => {
    for (const entry of walkBandedNarrations(BRIDGE_MYSTERY.responses)) {
      if (entry.kind !== "human") continue;
      if (!isBandedHuman(entry.narration as HumanNarration)) continue;
      const shadow = resolveHumanBandedNarration(entry.narration as HumanNarration, "shadow");
      const balanced = resolveHumanBandedNarration(entry.narration as HumanNarration, "balanced");
      const warm = resolveHumanBandedNarration(entry.narration as HumanNarration, "warm");
      expect(shadow, `${entry.path} shadow==balanced`).not.toBe(balanced);
      expect(shadow, `${entry.path} shadow==warm`).not.toBe(warm);
      expect(balanced, `${entry.path} balanced==warm`).not.toBe(warm);
    }
  });
});
