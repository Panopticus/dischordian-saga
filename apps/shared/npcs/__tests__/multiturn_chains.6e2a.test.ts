// apps/shared/npcs/__tests__/multiturn_chains.6e2a.test.ts
//
// Phase 6e.2a verification — 6 named multi-turn conversation chains
// (Locke + Nilmorg + Vex + Hierophant + Oracle + Companion).
//
// Validates:
//   - Each chain has the canonical-spec line-count
//   - nextLineId chains canonically resolve (every nextLineId
//     references a real line in the same bank)
//   - Last line of each chain canonically sets a chain-completion
//     public flag
//   - Canonical voice anchors land per chain
//   - Cross-character public flag wiring registered

import { describe, it, expect } from "vitest";
import { ADJUDICATOR_LOCKE_BANK } from "../banks/adjudicator_locke";
import { NILMORG_BANK } from "../banks/nilmorg";
import { VEX_SOLENE_BANK } from "../banks/vex_solene";
import { WRAITH_CALDER_BANK } from "../banks/wraith_calder";
import { THE_ORACLE_BANK } from "../banks/the_oracle";
import { DMC_CLONE_COMPANION_BANK } from "../banks/dmc_clone_companion";
import { allRegisteredFlags } from "../crossCharacterReactions";

type AnyBank = ReadonlyArray<{
  lineId: string;
  text: string;
  nextLineId?: string;
  setsPublicFlags?: ReadonlyArray<string>;
  surfaces?: ReadonlyArray<string>;
}>;

function chainLines(bank: AnyBank, prefix: string): AnyBank {
  return bank.filter((l) => l.lineId.startsWith(prefix));
}

describe("Locke contract-negotiation chain (4 lines)", () => {
  const chain = chainLines(
    ADJUDICATOR_LOCKE_BANK as AnyBank,
    "locke.chain.contract_negotiation.",
  );

  it("ships exactly 4 chain lines", () => {
    expect(chain.length).toBe(4);
  });

  it("nextLineId chain canonically resolves through all 4 links", () => {
    const ids = new Set(chain.map((l) => l.lineId));
    const links = chain.filter((l) => l.nextLineId);
    expect(links.length).toBe(3); // 3 of 4 have nextLineId; last is terminal
    for (const l of links) {
      expect(ids.has(l.nextLineId!), `${l.lineId} → ${l.nextLineId}`).toBe(
        true,
      );
    }
  });

  it("signing_completion sets canonical chain-completion flag", () => {
    const completion = chain.find((l) =>
      l.lineId.endsWith(".signing_completion"),
    );
    expect(completion?.setsPublicFlags).toContain(
      "locke_completed_canonical_contract_negotiation_chain",
    );
  });

  it("canonical voice anchors land", () => {
    const allText = chain.map((l) => l.text).join(" ");
    expect(allText).toMatch(/canonical-Authority/);
    expect(allText).toMatch(/page seven, paragraph three/i);
    expect(allText).toMatch(/canonical-three options/i);
  });
});

describe("Nilmorg Severance-Prize-extraction chain (5 lines)", () => {
  const chain = chainLines(NILMORG_BANK as AnyBank, "nilmorg.chain.severance.");

  it("ships exactly 5 chain lines", () => {
    expect(chain.length).toBe(5);
  });

  it("nextLineId chain canonically resolves through all 5 links", () => {
    const ids = new Set(chain.map((l) => l.lineId));
    const links = chain.filter((l) => l.nextLineId);
    expect(links.length).toBe(4);
    for (const l of links) {
      expect(ids.has(l.nextLineId!), `${l.lineId} → ${l.nextLineId}`).toBe(
        true,
      );
    }
  });

  it("delivery sets canonical chain-completion flag + 'Don't thank me' canon", () => {
    const delivery = chain.find((l) => l.lineId.endsWith(".delivery"));
    expect(delivery?.setsPublicFlags).toContain(
      "nilmorg_completed_canonical_severance_extraction_chain",
    );
    expect(delivery?.text).toMatch(/Don't thank me/);
  });

  it("canonical voice anchors land per stage", () => {
    const allText = chain.map((l) => l.text).join(" ");
    expect(allText).toMatch(/Severance Prize ceremony/i);
    expect(allText).toMatch(/three seconds. Two. One. CLEAR/);
    expect(allText).toMatch(/seventy-two hours/i);
  });
});

describe("Vex Engineer Zero reveal chain (5 lines, reveal-stage gated)", () => {
  const chain = chainLines(
    VEX_SOLENE_BANK as AnyBank,
    "vex.chain.engineer_zero_reveal.",
  );

  it("ships exactly 5 chain lines", () => {
    expect(chain.length).toBe(5);
  });

  it("nextLineId chain canonically resolves through all 5 links", () => {
    const ids = new Set(chain.map((l) => l.lineId));
    const links = chain.filter((l) => l.nextLineId);
    expect(links.length).toBe(4);
    for (const l of links) {
      expect(ids.has(l.nextLineId!), `${l.lineId} → ${l.nextLineId}`).toBe(
        true,
      );
    }
  });

  it("integration sets canonical chain-completion flag", () => {
    const integration = chain.find((l) => l.lineId.endsWith(".integration"));
    expect(integration?.setsPublicFlags).toContain(
      "vex_completed_canonical_engineer_zero_reveal_chain",
    );
  });

  it("§1.6 silence-shape: NEVER 'Engineer' / 'Engineer Zero' / 'Agent Zero' aloud anywhere", () => {
    const allText = chain.map((l) => l.text).join(" ");
    expect(allText).not.toMatch(/\bEngineer( Zero)?\b/);
    expect(allText).not.toMatch(/\bAgent Zero\b/);
  });

  it("reveal-stage progression canonical (vex_public → engineer_zero_hint → engineer_zero_confirmed)", () => {
    const stages = chain.map(
      (l) => (l as { requiresRevealStage?: string }).requiresRevealStage,
    );
    expect(stages).toContain("vex_public");
    expect(stages).toContain("engineer_zero_hint");
    expect(stages).toContain("engineer_zero_confirmed");
  });
});

describe("Hierophant Long Mourning naming-recovery chain (4 lines)", () => {
  const chain = chainLines(
    WRAITH_CALDER_BANK as AnyBank,
    "hierophant.chain.naming_recovery.",
  );

  it("ships exactly 4 chain lines", () => {
    expect(chain.length).toBe(4);
  });

  it("nextLineId chain canonically resolves through all 4 links", () => {
    const ids = new Set(chain.map((l) => l.lineId));
    const links = chain.filter((l) => l.nextLineId);
    expect(links.length).toBe(3);
    for (const l of links) {
      expect(ids.has(l.nextLineId!), `${l.lineId} → ${l.nextLineId}`).toBe(
        true,
      );
    }
  });

  it("completion sets canonical chain-completion flag + 'I will remember' covenant canon", () => {
    const completion = chain.find((l) => l.lineId.endsWith(".completion"));
    expect(completion?.setsPublicFlags).toContain(
      "hierophant_completed_canonical_naming_recovery_chain",
    );
    expect(completion?.text).toMatch(/I will canonical-remember/i);
    expect(completion?.text).toMatch(/canonical-covenant/i);
  });

  it("canonical sacred vocabulary lands (name / pen / pencil / wall / ink)", () => {
    const allText = chain.map((l) => l.text).join(" ");
    expect(allText).toMatch(/\bname\b/i);
    expect(allText).toMatch(/canonical-pencil/i);
    expect(allText).toMatch(/canonical-ink/i);
    expect(allText).toMatch(/wall/i);
  });
});

describe("Oracle dream-sequence interpretation chain (3 lines)", () => {
  const chain = chainLines(
    THE_ORACLE_BANK as AnyBank,
    "oracle.chain.dream_interpretation.",
  );

  it("ships exactly 3 chain lines", () => {
    expect(chain.length).toBe(3);
  });

  it("nextLineId chain canonically resolves through all 3 links", () => {
    const ids = new Set(chain.map((l) => l.lineId));
    const links = chain.filter((l) => l.nextLineId);
    expect(links.length).toBe(2);
    for (const l of links) {
      expect(ids.has(l.nextLineId!), `${l.lineId} → ${l.nextLineId}`).toBe(
        true,
      );
    }
  });

  it("mission_unlock_ack sets canonical chain-completion flag", () => {
    const ack = chain.find((l) => l.lineId.endsWith(".mission_unlock_ack"));
    expect(ack?.setsPublicFlags).toContain(
      "oracle_completed_canonical_dream_interpretation_chain",
    );
  });

  it("every chain line uses canonical dream_sequence/memory_residue surface only", () => {
    for (const l of chain) {
      const surfaces = l.surfaces ?? [];
      const usesSubstrate = surfaces.some(
        (s) => s === "dream_sequence" || s === "memory_residue",
      );
      expect(usesSubstrate, l.lineId).toBe(true);
    }
  });
});

describe("Companion post-naming integration chain (4 lines)", () => {
  const chain = chainLines(
    DMC_CLONE_COMPANION_BANK as AnyBank,
    "companion.chain.post_naming_integration.",
  );

  it("ships exactly 4 chain lines", () => {
    expect(chain.length).toBe(4);
  });

  it("nextLineId chain canonically resolves through all 4 links", () => {
    const ids = new Set(chain.map((l) => l.lineId));
    const links = chain.filter((l) => l.nextLineId);
    expect(links.length).toBe(3);
    for (const l of links) {
      expect(ids.has(l.nextLineId!), `${l.lineId} → ${l.nextLineId}`).toBe(
        true,
      );
    }
  });

  it("first_trust_band_crossing sets canonical chain-completion flag", () => {
    const crossing = chain.find((l) =>
      l.lineId.endsWith(".first_trust_band_crossing"),
    );
    expect(crossing?.setsPublicFlags).toContain(
      "companion_completed_canonical_post_naming_integration_chain",
    );
  });

  it("canonical post-naming voice anchors land", () => {
    const allText = chain.map((l) => l.text).join(" ");
    expect(allText).toMatch(/I am canonical-named now/i);
    expect(allText).toMatch(/Eidolon canonical-felt/i);
    expect(allText).toMatch(/canonical-trust-band canonical-cross/i);
  });
});

describe("Cross-character public flag wiring (Phase 6e.2a)", () => {
  const newFlags = [
    "locke_completed_canonical_contract_negotiation_chain",
    "nilmorg_completed_canonical_severance_extraction_chain",
    "vex_completed_canonical_engineer_zero_reveal_chain",
    "hierophant_completed_canonical_naming_recovery_chain",
    "oracle_completed_canonical_dream_interpretation_chain",
    "companion_completed_canonical_post_naming_integration_chain",
  ];

  it("every new chain-completion flag is registered", () => {
    const registered = allRegisteredFlags();
    for (const f of newFlags) {
      expect(registered, f).toContain(f);
    }
  });
});
