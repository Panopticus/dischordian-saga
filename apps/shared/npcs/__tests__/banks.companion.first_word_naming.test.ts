// apps/shared/npcs/__tests__/banks.companion.first_word_naming.test.ts
//
// Phase 6c.2 part-5 verification — Companion Channel-4 first-words +
// Channel-5 naming events bank expansion (~21 lines covering canonical
// first-word context variants, naming event ritual contexts, and
// named-personality variant seeds per dmc_clone_companion.md §§1.4-1.5).
//
// Coverage:
//   Channel-4 first-word context variants (5 new + 2 existing):
//     - severance_for_another_season_name (echo of season-name)
//     - eidolon_first_translation (Eidolon's nickname)
//     - identity_chain_last (canonical 'Last' mortality canon)
//     - faction_loyalty × 2 (Coalition + Insurgency)
//   Channel-5 naming events (6):
//     - player_rename_invocation
//     - companion_self_proposal (canonical Stage-4-deferred)
//     - hierophant_chamber_ritual
//     - eidolon_translation_ritual
//     - post_first_word_recall
//     - pre_naming_label_disowned
//   Channel-5 named-personality variant seeds (10):
//     - faction × 4 (Coalition / Insurgency / Hierarchy / Ark)
//     - trust-pattern × 2 (gregarious_many / concentrated_few)
//     - alignment × 2 (light / dark)
//     - identity-chain × 2 (Last / Seeker)

import { describe, it, expect } from "vitest";
import { DMC_CLONE_COMPANION_BANK } from "../banks/dmc_clone_companion";
import { allRegisteredFlags } from "../crossCharacterReactions";

const FIRST_WORD_NEW = DMC_CLONE_COMPANION_BANK.filter((l) =>
  [
    "companion.first_word.severance_for_another.season_name",
    "companion.first_word.eidolon_translation.nickname",
    "companion.first_word.identity_chain.last",
    "companion.first_word.faction_loyalty.coalition",
    "companion.first_word.faction_loyalty.insurgency",
  ].includes(l.lineId),
);

const NAMING_EVENTS = DMC_CLONE_COMPANION_BANK.filter((l) =>
  l.lineId.startsWith("companion.naming_event."),
);

const NAMED_VARIANTS = DMC_CLONE_COMPANION_BANK.filter((l) =>
  l.lineId.startsWith("companion.named.variant."),
);

describe("Channel-4 first-word context-variant bank expansion", () => {
  it("ships ≥5 new first-word context variants", () => {
    expect(FIRST_WORD_NEW.length).toBeGreaterThanOrEqual(5);
  });

  it("every first-word line is single-word + period (canonical Channel-4 shape)", () => {
    for (const l of FIRST_WORD_NEW) {
      // canonical first-word is one word + period (or {placeholder}.
      // for engineering substitution per Eidolon nickname canon)
      const text = l.text.trim();
      expect(text.endsWith("."), l.lineId).toBe(true);
      // canonical: single token (no spaces inside the body)
      const body = text.slice(0, -1);
      expect(body.includes(" "), l.lineId).toBe(false);
    }
  });

  it("every first-word line carries expressionChannel: 'first_word'", () => {
    for (const l of FIRST_WORD_NEW) {
      expect(l.expressionChannel, l.lineId).toBe("first_word");
    }
  });

  it("every first-word line excludes companion_first_word_spoken (fires-once canon)", () => {
    for (const l of FIRST_WORD_NEW) {
      expect(l.excludeFlags, l.lineId).toContain("companion_first_word_spoken");
    }
  });

  it("every first-word line sets companion_first_word_spoken (canonical permanent flag)", () => {
    for (const l of FIRST_WORD_NEW) {
      expect(l.setsFlags, l.lineId).toContain("companion_first_word_spoken");
    }
  });

  it("Severance season-name first-word canonically echoes 'Severance'", () => {
    const l = FIRST_WORD_NEW.find(
      (x) => x.lineId === "companion.first_word.severance_for_another.season_name",
    );
    expect(l?.text).toBe("Severance.");
    expect(l?.unlockFlags).toContain("another_severance_ceremony_active");
    expect(l?.setsPublicFlags).toContain(
      "companion_first_word_was_severance_season_name",
    );
  });

  it("Eidolon-translation first-word uses canonical {eidolon_nickname} substitution placeholder", () => {
    const l = FIRST_WORD_NEW.find(
      (x) => x.lineId === "companion.first_word.eidolon_translation.nickname",
    );
    expect(l?.text).toBe("{eidolon_nickname}.");
    expect(l?.unlockFlags).toContain("eidolon_in_echo_mode");
    expect(l?.unlockFlags).toContain("eidolon_first_translation_context");
    expect(l?.setsPublicFlags).toContain(
      "companion_first_word_was_eidolon_nickname",
    );
  });

  it("Identity-chain-Last first-word canonically lands 'Last' mortality canon", () => {
    const l = FIRST_WORD_NEW.find(
      (x) => x.lineId === "companion.first_word.identity_chain.last",
    );
    expect(l?.text).toBe("Last.");
    expect(l?.unlockFlags).toContain("dmc_identity_chain_completed");
    expect(l?.setsPublicFlags).toContain("companion_first_word_was_last");
  });

  it("Faction-loyalty first-words land canonical Coalition + Insurgency", () => {
    const coalition = FIRST_WORD_NEW.find(
      (x) => x.lineId === "companion.first_word.faction_loyalty.coalition",
    );
    const insurgency = FIRST_WORD_NEW.find(
      (x) => x.lineId === "companion.first_word.faction_loyalty.insurgency",
    );
    expect(coalition?.text).toBe("Coalition.");
    expect(insurgency?.text).toBe("Insurgency.");
    expect(coalition?.unlockFlags).toContain(
      "player_dominant_faction_coalition",
    );
    expect(insurgency?.unlockFlags).toContain(
      "player_dominant_faction_insurgency",
    );
  });
});

describe("Channel-5 naming-event bank", () => {
  it("ships ≥6 naming-event lines", () => {
    expect(NAMING_EVENTS.length).toBeGreaterThanOrEqual(6);
  });

  it("every naming-event line carries expressionChannel: 'named_personality'", () => {
    for (const l of NAMING_EVENTS) {
      expect(l.expressionChannel, l.lineId).toBe("named_personality");
    }
  });

  it("every naming-event line gates Inheriting trust-band + reveal-stage", () => {
    for (const l of NAMING_EVENTS) {
      expect(l.requiresTrustBand, l.lineId).toBe("Inheriting");
      expect(l.requiresRevealStage, l.lineId).toBe("Inheriting");
    }
  });

  it("player_rename_invocation lands canonical 'Severance Fragment' designation retirement", () => {
    const l = NAMING_EVENTS.find(
      (x) =>
        x.lineId === "companion.naming_event.player_rename_invocation",
    );
    expect(l?.text).toMatch(/Severance Fragment/);
    expect(l?.text).toMatch(/canonical-handle retire/i);
    expect(l?.setsFlags).toContain("companion_named");
    expect(l?.setsFlags).toContain("companion_named_by_player_choice");
  });

  it("companion_self_proposal lands canonical 'I have been holding a name' canon", () => {
    const l = NAMING_EVENTS.find(
      (x) =>
        x.lineId === "companion.naming_event.companion_self_proposal",
    );
    expect(l?.text).toMatch(/I have been holding a name/i);
    // canonical "choosing is canonically yours" deference canon
    expect(l?.text).toMatch(/choosing is canonically yours/i);
    expect(l?.setsFlags).toContain("companion_self_proposed_name");
  });

  it("hierophant_chamber_ritual lands canonical chamber + Wraith Calder context canon", () => {
    const l = NAMING_EVENTS.find(
      (x) =>
        x.lineId === "companion.naming_event.hierophant_chamber_ritual",
    );
    expect(l?.text).toMatch(/Hierophant said the name first/i);
    expect(l?.text).toMatch(/Wraith Calder/);
    expect(l?.unlockFlags).toContain("companion_first_word_was_wraith_calder");
    expect(l?.setsPublicFlags).toContain(
      "companion_named_in_hierophant_chamber",
    );
  });

  it("eidolon_translation_ritual lands canonical 'two non-verbal channels' canon", () => {
    const l = NAMING_EVENTS.find(
      (x) =>
        x.lineId === "companion.naming_event.eidolon_translation_ritual",
    );
    expect(l?.text).toMatch(/Eidolon translated/i);
    expect(l?.text).toMatch(/Echo mode held/);
    expect(l?.text).toMatch(/Two non-verbal channels/i);
    expect(l?.text).toMatch(/Eidolon is canonically also a soul-substrate/i);
    expect(l?.unlockFlags).toContain(
      "companion_first_word_was_eidolon_nickname",
    );
    expect(l?.setsPublicFlags).toContain(
      "companion_named_via_eidolon_translation",
    );
  });

  it("post_first_word_recall lands canonical post-naming reflection canon", () => {
    const l = NAMING_EVENTS.find(
      (x) =>
        x.lineId === "companion.naming_event.post_first_word_recall",
    );
    expect(l?.text).toMatch(/I remember the moment of the first word/i);
    expect(l?.text).toMatch(/half-beat before the word/i);
    expect(l?.text).toMatch(/glad/i);
    expect(l?.unlockFlags).toContain("companion_named");
  });

  it("pre_naming_label_disowned lands canonical 'Severance Fragment' label retirement canon", () => {
    const l = NAMING_EVENTS.find(
      (x) =>
        x.lineId === "companion.naming_event.pre_naming_label_disowned",
    );
    expect(l?.text).toMatch(/Severance Fragment/);
    expect(l?.text).toMatch(/canonically retired/i);
    expect(l?.text).toMatch(/canonically not yet me/i);
    expect(l?.text).toMatch(/first one that ever fit/i);
  });
});

describe("Channel-5 named-personality variant seeds (4-tuple axes)", () => {
  it("ships ≥10 variant seeds (faction × 4 + trust-pattern × 2 + alignment × 2 + identity-chain × 2)", () => {
    expect(NAMED_VARIANTS.length).toBeGreaterThanOrEqual(10);
  });

  it("every variant seed carries expressionChannel: 'named_personality'", () => {
    for (const l of NAMED_VARIANTS) {
      expect(l.expressionChannel, l.lineId).toBe("named_personality");
    }
  });

  it("every variant seed gates Inheriting + companion_named", () => {
    for (const l of NAMED_VARIANTS) {
      expect(l.requiresTrustBand, l.lineId).toBe("Inheriting");
      expect(l.requiresRevealStage, l.lineId).toBe("Inheriting");
      expect(l.unlockFlags, l.lineId).toContain("companion_named");
    }
  });

  it("ships all 4 faction variants (Coalition / Insurgency / Hierarchy / Ark)", () => {
    const factionIds = [
      "companion.named.variant.faction_coalition",
      "companion.named.variant.faction_insurgency",
      "companion.named.variant.faction_hierarchy",
      "companion.named.variant.faction_ark",
    ];
    for (const id of factionIds) {
      expect(NAMED_VARIANTS.find((l) => l.lineId === id), id).toBeDefined();
    }
  });

  it("ships both trust-pattern variants (gregarious_many + concentrated_few)", () => {
    const trustIds = [
      "companion.named.variant.trust_gregarious_many",
      "companion.named.variant.trust_concentrated_few",
    ];
    for (const id of trustIds) {
      expect(NAMED_VARIANTS.find((l) => l.lineId === id), id).toBeDefined();
    }
  });

  it("ships both alignment variants (light + dark)", () => {
    const alignIds = [
      "companion.named.variant.alignment_light",
      "companion.named.variant.alignment_dark",
    ];
    for (const id of alignIds) {
      expect(NAMED_VARIANTS.find((l) => l.lineId === id), id).toBeDefined();
    }
  });

  it("ships ≥2 identity-chain variants (Last + Seeker canonical)", () => {
    const identityIds = [
      "companion.named.variant.identity_chain_last",
      "companion.named.variant.identity_chain_seeker",
    ];
    for (const id of identityIds) {
      expect(NAMED_VARIANTS.find((l) => l.lineId === id), id).toBeDefined();
    }
  });

  it("identity_chain_last lands canonical 'two; the Last is canonical for both' mortality canon", () => {
    const l = NAMED_VARIANTS.find(
      (x) => x.lineId === "companion.named.variant.identity_chain_last",
    );
    expect(l?.text).toMatch(/Student, Seeker, Detective, Last/i);
    expect(l?.text).toMatch(/canonical-Last-shaped commitment/i);
    expect(l?.text).toMatch(/We are canonically two/i);
    expect(l?.text).toMatch(/Last is canonical for both/i);
  });

  it("alignment variants land donor-state-derivation canonical 'shaping is what I am' anchor", () => {
    const light = NAMED_VARIANTS.find(
      (x) => x.lineId === "companion.named.variant.alignment_light",
    );
    const dark = NAMED_VARIANTS.find(
      (x) => x.lineId === "companion.named.variant.alignment_dark",
    );
    expect(light?.text).toMatch(/shaping is what I am/i);
    expect(dark?.text).toMatch(/shaping is what I am/i);
  });
});

describe("Cross-character public flag wiring (Phase 6c.2 part 5)", () => {
  const newFlags = [
    "companion_first_word_was_severance_season_name",
    "companion_first_word_was_eidolon_nickname",
    "companion_first_word_was_last",
    "companion_first_word_was_faction_coalition",
    "companion_first_word_was_faction_insurgency",
    "companion_named_in_hierophant_chamber",
    "companion_named_via_eidolon_translation",
  ];

  it("every new public flag is registered in crossCharacterReactions", () => {
    const registered = allRegisteredFlags();
    for (const f of newFlags) {
      expect(registered, f).toContain(f);
    }
  });
});

describe("Voice gate canon — Channel-5 lines are full sentences", () => {
  it("naming-event + named-variant lines are first-person verbal (canonical Channel-5 register)", () => {
    const verbalLines = [...NAMING_EVENTS, ...NAMED_VARIANTS];
    for (const l of verbalLines) {
      // canonical Channel-5: full verbal NPC content, no brackets
      expect(l.text.startsWith("["), l.lineId).toBe(false);
      expect(l.text.endsWith("]"), l.lineId).toBe(false);
    }
  });

  it("naming-event + named-variant lines do NOT carry [bracketed] non-verbal format", () => {
    const verbalLines = [...NAMING_EVENTS, ...NAMED_VARIANTS];
    for (const l of verbalLines) {
      // canonical: non-verbal expression-bank lines start with "[The
      // Companion ..." — Channel-5 lines do not
      expect(l.text.startsWith("[The"), l.lineId).toBe(false);
    }
  });
});
