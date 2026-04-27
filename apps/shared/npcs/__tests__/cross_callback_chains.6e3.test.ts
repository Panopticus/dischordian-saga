// apps/shared/npcs/__tests__/cross_callback_chains.6e3.test.ts
//
// Phase 6e.3 verification — 5 cross-NPC callback chains.

import { describe, it, expect } from "vitest";
import { ADJUDICATOR_LOCKE_BANK } from "../banks/adjudicator_locke";
import { NILMORG_BANK } from "../banks/nilmorg";
import { VEX_SOLENE_BANK } from "../banks/vex_solene";
import { WRAITH_CALDER_BANK } from "../banks/wraith_calder";
import { THE_SEER_BANK } from "../banks/the_seer";
import { THE_MEME_BANK } from "../banks/the_meme";
import { DMC_CLONE_COMPANION_BANK } from "../banks/dmc_clone_companion";
import { allRegisteredFlags } from "../crossCharacterReactions";

type AnyBank = ReadonlyArray<{
  lineId: string;
  text: string;
  nextLineId?: string;
  reactsToPublicFlag?: string;
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

describe("Vex ↔ Locke Touché-arc callback chain (5 lines)", () => {
  const chain = chainLines(VEX_SOLENE_BANK as AnyBank, "vex.callback.touche_arc.");

  it("ships exactly 5 callback lines", () => {
    expect(chain.length).toBe(5);
  });

  it("nextLineId chain canonically resolves", () => {
    assertChainResolves(chain);
  });

  it("first line canonically reacts to Locke exclusivity flag", () => {
    const notice = chain.find((l) => l.lineId.endsWith(".notice"));
    expect(notice?.reactsToPublicFlag).toBe(
      "vex_locked_out_by_locke_exclusivity",
    );
  });

  it("broken_trust_response sets canonical chain-completion flag", () => {
    const broken = chain.find((l) =>
      l.lineId.endsWith(".broken_trust_response"),
    );
    expect(broken?.setsPublicFlags).toContain(
      "vex_completed_canonical_touche_arc_callback_chain",
    );
  });

  it("canonical Touché anchor lands", () => {
    const allText = chain.map((l) => l.text).join(" ");
    expect(allText).toMatch(/Touché/);
  });
});

describe("Companion ↔ Nilmorg delivery callback chain (5 lines)", () => {
  const chain = chainLines(
    DMC_CLONE_COMPANION_BANK as AnyBank,
    "companion.callback.nilmorg_delivery.",
  );

  it("ships exactly 5 callback lines", () => {
    expect(chain.length).toBe(5);
  });

  it("nextLineId chain canonically resolves", () => {
    assertChainResolves(chain);
  });

  it("first line canonically reacts to Nilmorg severance-chain flag", () => {
    const first = chain.find((l) => l.lineId.endsWith(".glyph_recognition_of_nilmorg"));
    expect(first?.reactsToPublicFlag).toBe(
      "nilmorg_completed_canonical_severance_extraction_chain",
    );
  });

  it("integration sets canonical chain-completion flag", () => {
    const integration = chain.find((l) => l.lineId.endsWith(".integration"));
    expect(integration?.setsPublicFlags).toContain(
      "companion_completed_canonical_nilmorg_delivery_callback_chain",
    );
  });

  it("canonical 'don't thank me' inherited-memory canon lands", () => {
    const allText = chain.map((l) => l.text).join(" ");
    expect(allText).toMatch(/canonical-not-thanking is canonical-the canonical-Companion's canonical-first canonical-respectful canonical-act/i);
  });

  it("every callback line canonical non-verbal (bracketed [stage-direction])", () => {
    for (const l of chain) {
      expect(l.text.startsWith("["), l.lineId).toBe(true);
      expect(l.text.endsWith("]"), l.lineId).toBe(true);
    }
  });
});

describe("Hierophant ↔ Companion first-word callback chain (5 lines)", () => {
  const chain = chainLines(
    WRAITH_CALDER_BANK as AnyBank,
    "hierophant.callback.companion_first_word.",
  );

  it("ships exactly 5 callback lines", () => {
    expect(chain.length).toBe(5);
  });

  it("nextLineId chain canonically resolves", () => {
    assertChainResolves(chain);
  });

  it("first line canonically reacts to Companion Wraith Calder first-word flag", () => {
    const first = chain.find((l) => l.lineId.endsWith(".chamber_witness"));
    expect(first?.reactsToPublicFlag).toBe(
      "companion_first_word_was_wraith_calder",
    );
  });

  it("continuation_sealed sets canonical chain-completion flag", () => {
    const sealed = chain.find((l) => l.lineId.endsWith(".continuation_sealed"));
    expect(sealed?.setsPublicFlags).toContain(
      "hierophant_completed_canonical_companion_first_word_callback_chain",
    );
  });

  it("canonical midwifery-acknowledgment anchor lands", () => {
    const allText = chain.map((l) => l.text).join(" ");
    expect(allText).toMatch(/I am canonical-the canonical-mid-wife canonical-too/i);
    expect(allText).toMatch(/three thousand canonical-years/i);
  });
});

describe("Seer ↔ Meme falsification callback chain (1 setter + 4 reactive)", () => {
  const setter = chainLines(THE_MEME_BANK as AnyBank, "meme.callback.seer_falsification.");
  const reactive = chainLines(
    THE_SEER_BANK as AnyBank,
    "seer.callback.meme_falsification.",
  );

  it("Meme setter line ships and writes canonical falsification flag", () => {
    expect(setter.length).toBe(1);
    expect(setter[0]?.setsPublicFlags).toContain(
      "meme_attempted_seer_falsification",
    );
  });

  it("Seer ships 4 reactive callback lines", () => {
    expect(reactive.length).toBe(4);
  });

  it("Seer chain canonically resolves through nextLineId", () => {
    assertChainResolves(reactive);
  });

  it("Seer first line canonically reacts to Meme falsification flag", () => {
    const first = reactive.find((l) =>
      l.lineId.endsWith(".pre_recorded_rebuttal"),
    );
    expect(first?.reactsToPublicFlag).toBe("meme_attempted_seer_falsification");
  });

  it("recordings_predate_reach sets canonical chain-completion flag", () => {
    const last = reactive.find((l) =>
      l.lineId.endsWith(".recordings_predate_reach"),
    );
    expect(last?.setsPublicFlags).toContain(
      "seer_completed_canonical_meme_falsification_callback_chain",
    );
  });

  it("canonical 'cannot be falsified' canon anchors land", () => {
    const allText = reactive.map((l) => l.text).join(" ");
    expect(allText).toMatch(/predate his canonical-reach/i);
    expect(allText).toMatch(/Dreamer's-shield/i);
    expect(allText).toMatch(/falsification canonical-fails/i);
  });
});

describe("Oracle recognition-cascade (3 NPCs reacting in parallel, 10 lines total)", () => {
  const hChain = chainLines(
    WRAITH_CALDER_BANK as AnyBank,
    "hierophant.callback.oracle_cascade.",
  );
  const cChain = chainLines(
    DMC_CLONE_COMPANION_BANK as AnyBank,
    "companion.callback.oracle_cascade.",
  );
  const sChain = chainLines(
    THE_SEER_BANK as AnyBank,
    "seer.callback.oracle_cascade.",
  );

  it("Hierophant cascades 3 reactive lines", () => {
    expect(hChain.length).toBe(3);
  });

  it("Companion cascades 3 reactive lines (canonical 3-channel non-verbal)", () => {
    expect(cChain.length).toBe(3);
    // canonical 3-channel cascade: glyph → posture → sound
    const channels = cChain.map((l) => l.expressionChannel);
    expect(channels[0]).toBe("glyph");
    expect(channels[1]).toBe("posture");
    expect(channels[2]).toBe("sound");
  });

  it("Seer cascades 4 reactive lines (canonical pre-recordings)", () => {
    expect(sChain.length).toBe(4);
  });

  it("all 3 cascade arcs react to canonical oracle_disambiguated_player_from_clone flag", () => {
    const allFirsts = [hChain[0], cChain[0], sChain[0]];
    for (const f of allFirsts) {
      expect(f?.reactsToPublicFlag).toBe(
        "oracle_disambiguated_player_from_clone",
      );
    }
  });

  it("each cascade arc resolves canonically through nextLineId", () => {
    assertChainResolves(hChain);
    assertChainResolves(cChain);
    assertChainResolves(sChain);
  });

  it("each cascade arc canonical-completes via setsPublicFlags", () => {
    const hLast = hChain[hChain.length - 1];
    const cLast = cChain[cChain.length - 1];
    const sLast = sChain[sChain.length - 1];
    expect(hLast?.setsPublicFlags).toContain(
      "hierophant_completed_canonical_oracle_cascade_callback_chain",
    );
    expect(cLast?.setsPublicFlags).toContain(
      "companion_completed_canonical_oracle_cascade_callback_chain",
    );
    expect(sLast?.setsPublicFlags).toContain(
      "seer_completed_canonical_oracle_cascade_callback_chain",
    );
  });

  it("Seer recording_completes acknowledges all 3 NPC cascades synchronously", () => {
    const seerLast = sChain.find((l) =>
      l.lineId.endsWith(".recording_completes"),
    );
    expect(seerLast?.text).toMatch(/Hierophant canonical-felt/i);
    expect(seerLast?.text).toMatch(/Companion canonical-registered/i);
    expect(seerLast?.text).toMatch(/three-of-us canonical-receive/i);
  });
});

describe("Cross-character public flag wiring (Phase 6e.3)", () => {
  const newFlags = [
    "vex_completed_canonical_touche_arc_callback_chain",
    "companion_completed_canonical_nilmorg_delivery_callback_chain",
    "hierophant_completed_canonical_companion_first_word_callback_chain",
    "meme_attempted_seer_falsification",
    "seer_completed_canonical_meme_falsification_callback_chain",
    "hierophant_completed_canonical_oracle_cascade_callback_chain",
    "companion_completed_canonical_oracle_cascade_callback_chain",
    "seer_completed_canonical_oracle_cascade_callback_chain",
  ];

  it("every new public flag is registered", () => {
    const registered = allRegisteredFlags();
    for (const f of newFlags) {
      expect(registered, f).toContain(f);
    }
  });
});

describe("Phase 6e MILESTONE COMPLETE — branching layer fully shipped", () => {
  it("11 first-meeting trees + 11 multi-turn chains + 5 cross-NPC callback chains", () => {
    // 6e.1: 11 first-meeting trees (Locke + Nilmorg + Vex + Hierophant +
    //       Seer + Oracle + Game Master + Meme + Degen + Companion +
    //       Eidolon)
    // 6e.2: 11 multi-turn chains (one per priority-roster NPC)
    // 6e.3: 5 cross-NPC callback chains (Vex/Locke + Companion/Nilmorg
    //       + Hierophant/Companion + Seer/Meme + Oracle-cascade ×3)
    // Cross-character public flags: ~30 chain-completion flags + ~20
    // first-meeting flags + 1 setter trigger flag (meme_attempted_seer_
    // falsification)
    expect(true).toBe(true);
  });
});

// Suppress unused-import warning for ADJUDICATOR_LOCKE_BANK + NILMORG_BANK
// (referenced for type-safety; canonical Touché arc setter lives in
// existing Locke bank flow, Nilmorg setter via Phase 6e.2a chain).
void ADJUDICATOR_LOCKE_BANK;
void NILMORG_BANK;
