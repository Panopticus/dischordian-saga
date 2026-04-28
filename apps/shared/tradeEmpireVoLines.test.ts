import { describe, expect, it } from "vitest";

import {
  TE_VO,
  TRADE_EMPIRE_VO_LINES,
  type TradeEmpireVoLine,
  type TradeEmpireSpeaker,
} from "./tradeEmpireVoLines";

/**
 * Lock the contract between the typed VO catalog and the type-safe
 * call-site handles in TE_VO. If TE_VO references an id that doesn't
 * exist in TRADE_EMPIRE_VO_LINES, audio won't play and the wiring is
 * a silent no-op — that's the bug this catches.
 */
describe("tradeEmpireVoLines catalog", () => {
  it("ships the expected Tier-1 line count (60)", () => {
    expect(TRADE_EMPIRE_VO_LINES.length).toBe(60);
  });

  it("every line id is unique and te- prefixed", () => {
    const seen = new Set<string>();
    for (const line of TRADE_EMPIRE_VO_LINES) {
      expect(line.id.startsWith("te-")).toBe(true);
      expect(seen.has(line.id)).toBe(false);
      seen.add(line.id);
    }
  });

  it("every line has non-empty required fields", () => {
    for (const l of TRADE_EMPIRE_VO_LINES) {
      expect(l.id.length).toBeGreaterThan(0);
      expect(l.text.length).toBeGreaterThan(0);
      expect(l.context.length).toBeGreaterThan(0);
      expect(l.section.length).toBeGreaterThan(0);
      expect(l.emotion.length).toBeGreaterThan(0);
      expect(l.outputDir).toBe("audio/act3");
      expect(l.voiceId.length).toBeGreaterThan(0);
    }
  });

  it("every speaker is one of the registered types", () => {
    const ALLOWED: TradeEmpireSpeaker[] = [
      "elara",
      "the_antiquarian",
      "locke",
      "orin_fell",
      "human",
      "agent_zero",
      "the_source",
      "the_architect",
      "mol_garath",
      "the_eyes",
      "narrator",
    ];
    for (const l of TRADE_EMPIRE_VO_LINES) {
      expect(ALLOWED).toContain(l.speaker);
    }
  });

  it("no speakers carry TODO voiceIds — all five placeholders are filled", () => {
    const todo = TRADE_EMPIRE_VO_LINES.filter((l) => l.voiceId.startsWith("TODO_"));
    // Was 15 (antiquarian + locke + orin) before the voice-id fill in
    // PR #263; now 0. the_architect and mol_garath were declared in the
    // VOICE map for forward compatibility but no current TE lines reference
    // them. Re-tighten this guard to 0 so any future drift surfaces.
    expect(todo.length).toBe(0);
  });
});

describe("TE_VO type-safe handles", () => {
  it("every TE_VO leaf id resolves to a real catalog line", () => {
    const allLineIds = new Set(TRADE_EMPIRE_VO_LINES.map((l) => l.id));
    function walk(node: unknown): void {
      if (typeof node === "string") {
        expect(allLineIds.has(node)).toBe(true);
      } else if (typeof node === "object" && node !== null) {
        for (const v of Object.values(node as Record<string, unknown>)) {
          walk(v);
        }
      }
    }
    walk(TE_VO);
  });

  it("every catalog line is reachable through TE_VO", () => {
    const reachable = new Set<string>();
    function walk(node: unknown): void {
      if (typeof node === "string") {
        reachable.add(node);
      } else if (typeof node === "object" && node !== null) {
        for (const v of Object.values(node as Record<string, unknown>)) {
          walk(v);
        }
      }
    }
    walk(TE_VO);

    for (const line of TRADE_EMPIRE_VO_LINES) {
      expect(reachable.has(line.id)).toBe(true);
    }
  });
});

describe("Speaker assignments match the canon dossier", () => {
  function findById(id: string): TradeEmpireVoLine {
    const line = TRADE_EMPIRE_VO_LINES.find((l) => l.id === id);
    expect(line).toBeDefined();
    return line!;
  }

  it("era-advance lines use Elara", () => {
    for (const id of Object.values(TE_VO.eraAdvance)) {
      expect(findById(id).speaker).toBe("elara");
    }
  });

  it("wonder-completion lines use The Antiquarian", () => {
    for (const id of Object.values(TE_VO.wonderComplete)) {
      expect(findById(id).speaker).toBe("the_antiquarian");
    }
  });

  it("doctrine-slot civic adoption lines use Orin Fell", () => {
    expect(findById(TE_VO.civicAdopt.doctrine_iron_lion).speaker).toBe("orin_fell");
    expect(findById(TE_VO.civicAdopt.doctrine_nomad).speaker).toBe("orin_fell");
    expect(findById(TE_VO.civicAdopt.doctrine_archon).speaker).toBe("orin_fell");
  });

  it("economy-slot civic adoption lines use Locke", () => {
    expect(findById(TE_VO.civicAdopt.economy_free_ports).speaker).toBe("locke");
    expect(findById(TE_VO.civicAdopt.economy_authority_tithe).speaker).toBe("locke");
    expect(findById(TE_VO.civicAdopt.economy_antiquarian_ledger).speaker).toBe("locke");
  });

  it("order-slot civic adoption lines use The Human", () => {
    expect(findById(TE_VO.civicAdopt.order_council).speaker).toBe("human");
    expect(findById(TE_VO.civicAdopt.order_panopticon).speaker).toBe("human");
    expect(findById(TE_VO.civicAdopt.order_remembrance).speaker).toBe("human");
  });

  it("fleet doctrine adoption lines use The Human", () => {
    for (const id of Object.values(TE_VO.doctrineAdopt)) {
      expect(findById(id).speaker).toBe("human");
    }
  });

  it("pirate event lines use Agent Zero (per user-confirmed default)", () => {
    expect(findById(TE_VO.pirate.parked).speaker).toBe("agent_zero");
    expect(findById(TE_VO.pirate.dispatched).speaker).toBe("agent_zero");
  });

  it("conference signed → Elara, collapsed → Locke", () => {
    expect(findById(TE_VO.conference.signed).speaker).toBe("elara");
    expect(findById(TE_VO.conference.collapsed).speaker).toBe("locke");
  });

  it("cycle-outcome lines use Narrator", () => {
    for (const id of Object.values(TE_VO.cycle)) {
      expect(findById(id).speaker).toBe("narrator");
    }
  });

  it("doom-whisper lines use Eyes", () => {
    for (const id of Object.values(TE_VO.doomWhisper)) {
      expect(findById(id).speaker).toBe("the_eyes");
    }
  });

  it("encounter openings use Narrator", () => {
    for (const id of Object.values(TE_VO.encounterOpen)) {
      expect(findById(id).speaker).toBe("narrator");
    }
  });

  it("Final Awakening 'open' uses Narrator (per user-confirmed default)", () => {
    expect(findById(TE_VO.encounterOutcome.final.open).speaker).toBe("narrator");
  });

  it("sanity threshold lines use Elara (per user-confirmed default)", () => {
    expect(findById(TE_VO.sanity.below60).speaker).toBe("elara");
    expect(findById(TE_VO.sanity.below30).speaker).toBe("elara");
    expect(findById(TE_VO.sanity.below10).speaker).toBe("elara");
  });
});
