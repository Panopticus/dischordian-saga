import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

import {
  LOREDEX_MENTION_LINES,
  mentionLinesFor,
  mentionsOf,
  mentionSpeakers,
  mentionTargets,
} from "../loredexMentions";
import { resolveTrustBand, NPC_REGISTRY } from "../npcs/registry";

const LOREDEX_PATH = resolve(
  __dirname,
  "../../client/src/data/loredex-data.json",
);

describe("loredexMentions — bank shape", () => {
  it("loads at least one mention line", () => {
    expect(LOREDEX_MENTION_LINES.length).toBeGreaterThan(0);
  });

  it("every line has the required fields", () => {
    for (const line of LOREDEX_MENTION_LINES) {
      expect(line.id).toBeTruthy();
      expect(line.speaker).toBeTruthy();
      expect(line.mentionTargetEntryId).toBeTruthy();
      expect(line.trustBandMin).toBeTruthy();
      expect(line.text).toBeTruthy();
      expect(line.emotion).toBeTruthy();
    }
  });

  it("ids are unique", () => {
    const ids = LOREDEX_MENTION_LINES.map(l => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every speaker is a registered NpcKey", () => {
    const validKeys = new Set<string>(Object.keys(NPC_REGISTRY));
    for (const line of LOREDEX_MENTION_LINES) {
      expect(validKeys.has(line.speaker)).toBe(true);
    }
  });

  it("every trustBandMin is a known band on the speaker's ladder", () => {
    for (const line of LOREDEX_MENTION_LINES) {
      const profile = NPC_REGISTRY[line.speaker];
      const validBands = new Set(profile.trustBands.map(b => b.band));
      expect(validBands.has(line.trustBandMin)).toBe(true);
    }
  });

  it("every mentionTargetEntryId resolves to a real Loredex entry", () => {
    const ld = JSON.parse(readFileSync(LOREDEX_PATH, "utf-8"));
    const validIds = new Set<string>(
      (ld.entries as Array<{ id: string }>).map(e => e.id),
    );
    for (const line of LOREDEX_MENTION_LINES) {
      expect(validIds.has(line.mentionTargetEntryId)).toBe(true);
    }
  });
});

describe("loredexMentions — helpers", () => {
  it("mentionLinesFor returns only that speaker's lines", () => {
    for (const speaker of mentionSpeakers()) {
      const lines = mentionLinesFor(speaker);
      expect(lines.length).toBeGreaterThan(0);
      for (const line of lines) {
        expect(line.speaker).toBe(speaker);
      }
    }
  });

  it("mentionsOf returns only lines mentioning the requested entry", () => {
    for (const target of mentionTargets()) {
      const lines = mentionsOf(target);
      expect(lines.length).toBeGreaterThan(0);
      for (const line of lines) {
        expect(line.mentionTargetEntryId).toBe(target);
      }
    }
  });
});

describe("loredexMentions — trust-band gating sanity", () => {
  it("Locke's mention of Marion Kell is gated to Adjudicated (apex)", () => {
    const line = LOREDEX_MENTION_LINES.find(
      l => l.id === "locke_mentions_marion_kell",
    );
    expect(line?.trustBandMin).toBe("Adjudicated");
    // Sanity: a player at trust 0 resolves to Prospect (below Adjudicated).
    expect(resolveTrustBand("adjudicator_locke", 0)).toBe("Prospect");
  });

  it("Wraith's Inheriting-band mention of Marion Kell exists (bible §3.10)", () => {
    const line = LOREDEX_MENTION_LINES.find(
      l => l.id === "wraith_mentions_marion_kell",
    );
    expect(line?.trustBandMin).toBe("Inheriting");
    expect(line?.speaker).toBe("wraith_calder");
  });
});
