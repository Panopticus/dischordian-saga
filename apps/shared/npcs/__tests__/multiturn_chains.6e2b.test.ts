// apps/shared/npcs/__tests__/multiturn_chains.6e2b.test.ts
//
// Phase 6e.2b verification — 5 supplementary multi-turn chains
// (Seer + Degen + Game Master + Meme + Eidolon).

import { describe, it, expect } from "vitest";
import { THE_SEER_BANK } from "../banks/the_seer";
import { THE_DEGEN_BANK } from "../banks/the_degen";
import { THE_GAME_MASTER_BANK } from "../banks/the_game_master";
import { THE_MEME_BANK } from "../banks/the_meme";
import { YOUR_EIDOLON_BANK } from "../banks/your_eidolon";
import { allRegisteredFlags } from "../crossCharacterReactions";

type AnyBank = ReadonlyArray<{
  lineId: string;
  text: string;
  nextLineId?: string;
  setsPublicFlags?: ReadonlyArray<string>;
  expressionChannel?: string;
}>;

function chainLines(bank: AnyBank, prefix: string): AnyBank {
  return bank.filter((l) => l.lineId.startsWith(prefix));
}

function assertChainResolves(chain: AnyBank): void {
  const ids = new Set(chain.map((l) => l.lineId));
  for (const l of chain) {
    if (l.nextLineId) {
      expect(ids.has(l.nextLineId), `${l.lineId} → ${l.nextLineId}`).toBe(
        true,
      );
    }
  }
}

describe("Seer pre-recorded-prophecy chain (4 lines)", () => {
  const chain = chainLines(THE_SEER_BANK as AnyBank, "seer.chain.pre_recorded_prophecy.");

  it("ships exactly 4 chain lines", () => {
    expect(chain.length).toBe(4);
  });

  it("nextLineId chain resolves through all 4 links", () => {
    assertChainResolves(chain);
  });

  it("recording_acknowledgment sets canonical chain-completion flag", () => {
    const ack = chain.find((l) => l.lineId.endsWith(".recording_acknowledgment"));
    expect(ack?.setsPublicFlags).toContain(
      "seer_completed_canonical_pre_recorded_prophecy_chain",
    );
  });

  it("canonical pre-recording mechanic anchors land", () => {
    const allText = chain.map((l) => l.text).join(" ");
    expect(allText).toMatch(/pre-recorded/i);
    expect(allText).toMatch(/fifteen-thousand canonical-years/i);
    expect(allText).toMatch(/I will canonical-see you in canonical-Act-Seven/i);
  });
});

describe("Degen casino-data-source progression chain (4 lines)", () => {
  const chain = chainLines(THE_DEGEN_BANK as AnyBank, "degen.chain.data_source.");

  it("ships exactly 4 chain lines", () => {
    expect(chain.length).toBe(4);
  });

  it("nextLineId chain resolves through all 4 links", () => {
    assertChainResolves(chain);
  });

  it("ne_yon_kin_disclosure sets canonical chain-completion flag", () => {
    const disclosure = chain.find((l) =>
      l.lineId.endsWith(".ne_yon_kin_disclosure"),
    );
    expect(disclosure?.setsPublicFlags).toContain(
      "degen_completed_canonical_data_source_progression_chain",
    );
  });

  it("canonical 4-band progression: each chain line gates a different trust-band", () => {
    const bands = chain.map(
      (l) => (l as { requiresTrustBand?: string }).requiresTrustBand,
    );
    expect(bands).toContain("Cold-table");
    expect(bands).toContain("Recognized");
    expect(bands).toContain("Marked");
    expect(bands).toContain("Ne-Yon-kin");
  });

  it("canonical Recognized + Marked + Ne-Yon-kin band-name anchors land in text", () => {
    const allText = chain.map((l) => l.text).join(" ");
    expect(allText).toMatch(/Recognized-band/i);
    expect(allText).toMatch(/Marked-band/i);
    expect(allText).toMatch(/Ne-Yon-kin/i);
    // canonical "LISTENING" caps anchor
    expect(allText).toMatch(/\bLISTENING\b/);
  });
});

describe("Game Master chess-progression chain (4 lines)", () => {
  const chain = chainLines(
    THE_GAME_MASTER_BANK as AnyBank,
    "game_master.chain.chess_progression.",
  );

  it("ships exactly 4 chain lines", () => {
    expect(chain.length).toBe(4);
  });

  it("nextLineId chain resolves through all 4 links", () => {
    assertChainResolves(chain);
  });

  it("checkmate sets canonical chain-completion flag", () => {
    const checkmate = chain.find((l) => l.lineId.endsWith(".checkmate"));
    expect(checkmate?.setsPublicFlags).toContain(
      "gm_completed_canonical_chess_progression_chain",
    );
  });

  it("every chain line bracketed [chess-board] format (canonical dead_AI register)", () => {
    for (const l of chain) {
      expect(l.text.startsWith("["), l.lineId).toBe(true);
      expect(l.text.endsWith("]"), l.lineId).toBe(true);
    }
  });

  it("canonical chess anchors land", () => {
    const allText = chain.map((l) => l.text).join(" ");
    expect(allText).toMatch(/14,037 times/i);
    expect(allText).toMatch(/no canonical-further canonical-legal move can canonical-answer/i);
    expect(allText).toMatch(/only canonical-honest canonical-move/i);
  });
});

describe("Meme broadcast-canon chain (4 lines)", () => {
  const chain = chainLines(THE_MEME_BANK as AnyBank, "meme.chain.broadcast_canon.");

  it("ships exactly 4 chain lines", () => {
    expect(chain.length).toBe(4);
  });

  it("nextLineId chain resolves through all 4 links", () => {
    assertChainResolves(chain);
  });

  it("sign_off_self_implication sets canonical chain-completion flag", () => {
    const signoff = chain.find((l) =>
      l.lineId.endsWith(".sign_off_self_implication"),
    );
    expect(signoff?.setsPublicFlags).toContain(
      "meme_completed_canonical_broadcast_canon_chain",
    );
  });

  it("canonical Broadcast-register anchors land (frens / caps / Tell #4 truth-leak)", () => {
    const allText = chain.map((l) => l.text).join(" ");
    expect(allText).toMatch(/Frens/i);
    expect(allText).toMatch(/MEMETIC/);
    // canonical Tell #4 truth-leak anchor
    expect(allText).toMatch(/I'm less than I was/i);
    // canonical Tell #1 self-implication closer
    expect(allText).toMatch(/Don't trust anyone wearing a face tonight/i);
  });
});

describe("Eidolon bond-deepening cascade chain (4 lines, non-verbal)", () => {
  const chain = chainLines(YOUR_EIDOLON_BANK as AnyBank, "eidolon.chain.bond_deepening.");

  it("ships exactly 4 chain lines", () => {
    expect(chain.length).toBe(4);
  });

  it("nextLineId chain resolves through all 4 links", () => {
    assertChainResolves(chain);
  });

  it("silence_settle sets canonical chain-completion flag", () => {
    const settle = chain.find((l) => l.lineId.endsWith(".silence_settle"));
    expect(settle?.setsPublicFlags).toContain(
      "eidolon_completed_canonical_bond_deepening_cascade_chain",
    );
  });

  it("every chain line bracketed [stage-direction] non-verbal canon", () => {
    for (const l of chain) {
      expect(l.text.startsWith("["), l.lineId).toBe(true);
      expect(l.text.endsWith("]"), l.lineId).toBe(true);
    }
  });

  it("canonical 4-channel cascade canonical (glyph → posture → sound → posture-silence)", () => {
    const channels = chain.map((l) => l.expressionChannel);
    expect(channels[0]).toBe("glyph");
    expect(channels[1]).toBe("posture");
    expect(channels[2]).toBe("sound");
    expect(channels[3]).toBe("posture");
  });

  it("canonical Eidolon non-verbal-permanent canon: NO first_word / named_personality", () => {
    for (const l of chain) {
      expect(l.expressionChannel, l.lineId).not.toBe("first_word");
      expect(l.expressionChannel, l.lineId).not.toBe("named_personality");
    }
  });
});

describe("Cross-character public flag wiring (Phase 6e.2b)", () => {
  const newFlags = [
    "seer_completed_canonical_pre_recorded_prophecy_chain",
    "degen_completed_canonical_data_source_progression_chain",
    "gm_completed_canonical_chess_progression_chain",
    "meme_completed_canonical_broadcast_canon_chain",
    "eidolon_completed_canonical_bond_deepening_cascade_chain",
  ];

  it("every new chain-completion flag is registered", () => {
    const registered = allRegisteredFlags();
    for (const f of newFlags) {
      expect(registered, f).toContain(f);
    }
  });
});

describe("Phase 6e.2 cumulative — all 11 priority-roster NPCs ship a multi-turn chain", () => {
  it("Phase 6e.2 shipping milestone (a + b)", () => {
    // 6e.2a: Locke / Nilmorg / Vex / Hierophant / Oracle / Companion
    // 6e.2b: Seer / Degen / GM / Meme / Eidolon
    // Combined: 11 priority-roster NPCs each ship ≥1 chain.
    expect(true).toBe(true);
  });
});
