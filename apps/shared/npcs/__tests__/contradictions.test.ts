import { describe, it, expect } from "vitest";

import {
  CONTRADICTION_REGISTRY,
  claimsForSpeaker,
  contradictionConfrontedFlag,
  contradictionsAbout,
  validateAllContradictions,
  validateContradiction,
  type Contradiction,
} from "../contradictions";
import { NPC_REGISTRY } from "../registry";

describe("CONTRADICTION_REGISTRY — coverage + validation", () => {
  it("loads at least one contradiction", () => {
    expect(CONTRADICTION_REGISTRY.length).toBeGreaterThan(0);
  });

  it("every contradiction passes validateContradiction()", () => {
    expect(validateAllContradictions()).toEqual([]);
  });

  it("every contradictionId is unique", () => {
    const ids = CONTRADICTION_REGISTRY.map(c => c.contradictionId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every speaker is a registered NpcKey", () => {
    const validKeys = new Set<string>(Object.keys(NPC_REGISTRY));
    for (const c of CONTRADICTION_REGISTRY) {
      for (const claim of c.claims) {
        expect(validKeys.has(claim.speaker)).toBe(true);
      }
    }
  });

  it("every claim with a trustBandMin uses a band on the speaker's ladder", () => {
    for (const c of CONTRADICTION_REGISTRY) {
      for (const claim of c.claims) {
        if (!claim.trustBandMin) continue;
        const profile = NPC_REGISTRY[claim.speaker];
        const validBands = new Set(profile.trustBands.map(b => b.band));
        expect(
          validBands.has(claim.trustBandMin),
          `${c.contradictionId}/${claim.speaker}: trustBandMin "${claim.trustBandMin}" not in ladder ${[...validBands]}`,
        ).toBe(true);
      }
    }
  });

  it("every contradiction has at least 2 distinct speakers", () => {
    for (const c of CONTRADICTION_REGISTRY) {
      const speakers = new Set(c.claims.map(claim => claim.speaker));
      expect(speakers.size).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("validateContradiction — rejects malformed entries", () => {
  it("rejects single-speaker entries (not a contradiction)", () => {
    const bad: Contradiction = {
      contradictionId: "test_single",
      subject: "test",
      loreContext: "test",
      claims: [
        {
          speaker: "elara",
          position: "single position",
        },
      ],
    };
    expect(validateContradiction(bad).length).toBeGreaterThan(0);
  });

  it("rejects multi-claim entries with only one distinct speaker", () => {
    const bad: Contradiction = {
      contradictionId: "test_dup_speaker",
      subject: "test",
      loreContext: "test",
      claims: [
        { speaker: "elara", position: "first" },
        { speaker: "elara", position: "second" },
      ],
    };
    expect(validateContradiction(bad).length).toBeGreaterThan(0);
  });

  it("rejects empty positions", () => {
    const bad: Contradiction = {
      contradictionId: "test_empty",
      subject: "test",
      loreContext: "test",
      claims: [
        { speaker: "elara", position: "" },
        { speaker: "the_human", position: "real" },
      ],
    };
    expect(validateContradiction(bad).length).toBeGreaterThan(0);
  });
});

describe("Helpers", () => {
  it("claimsForSpeaker returns only that speaker's claims", () => {
    const speakerKeys = new Set<string>();
    for (const c of CONTRADICTION_REGISTRY) {
      for (const claim of c.claims) {
        speakerKeys.add(claim.speaker);
      }
    }
    for (const sk of speakerKeys) {
      const claims = claimsForSpeaker(sk as never);
      expect(claims.length).toBeGreaterThan(0);
      for (const entry of claims) {
        expect(entry.claim.speaker).toBe(sk);
      }
    }
  });

  it("contradictionsAbout matches subject substring", () => {
    const programmerHits = contradictionsAbout("Programmer");
    expect(programmerHits.length).toBeGreaterThan(0);
    for (const c of programmerHits) {
      expect(c.subject.toLowerCase()).toContain("programmer");
    }
  });

  it("contradictionConfrontedFlag formats canonically", () => {
    expect(contradictionConfrontedFlag("the_meme_status")).toBe(
      "contradiction:the_meme_status:confronted",
    );
  });
});

describe("Bible-grounded coverage", () => {
  it("the_programmers_fate covers Programmer/Antiquarian, Vex, the_human", () => {
    const c = CONTRADICTION_REGISTRY.find(
      x => x.contradictionId === "the_programmers_fate",
    );
    expect(c).toBeDefined();
    const speakers = new Set(c!.claims.map(claim => claim.speaker));
    expect(speakers.has("the_antiquarian")).toBe(true);
    expect(speakers.has("vex_solene")).toBe(true);
    expect(speakers.has("the_human")).toBe(true);
  });

  it("thaloria_revival_purpose surfaces the §3.10 reconciliation across speakers", () => {
    const c = CONTRADICTION_REGISTRY.find(
      x => x.contradictionId === "thaloria_revival_purpose",
    );
    expect(c).toBeDefined();
    const speakers = new Set(c!.claims.map(claim => claim.speaker));
    expect(speakers.has("wraith_calder")).toBe(true);
    expect(speakers.has("drael_mon")).toBe(true);
    expect(speakers.has("vex_solene")).toBe(true);
  });

  it("marion_kell_recoverable's Wraith Calder claim gates on Inheriting band", () => {
    const c = CONTRADICTION_REGISTRY.find(
      x => x.contradictionId === "marion_kell_recoverable",
    );
    const wraithClaim = c?.claims.find(claim => claim.speaker === "wraith_calder");
    expect(wraithClaim?.trustBandMin).toBe("Inheriting");
  });
});
