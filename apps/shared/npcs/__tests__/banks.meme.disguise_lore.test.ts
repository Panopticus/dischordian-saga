// apps/shared/npcs/__tests__/banks.meme.disguise_lore.test.ts
//
// Phase 6d.2 part-2 verification — Meme 5-disguise per-state lore
// banks (~25 new lines distributed canonically across Broadcast /
// Stolen / Quiet / Real / Replacement per the_meme.md §§1.2-1.7
// voice canon).
//
// Coverage:
//   Broadcast (×5 new): Late Night ORIGIN / viewer-as-vector /
//     attention-hijack ad break / subscribe-to-lie / thousand arks
//   Stolen (×5 new): dream-cell question / "Oracles hesitate" /
//     "We're both cosplay" / pink-glitch tell / "kept seat warm"
//   Quiet (×5 new): Epoch Zero intro / "what does it mean to be human"
//     / archive-purpose / "some losses" / "one of them is true"
//   Real (×5 new): smaller pink form / no audience to win / rehearsal
//     admission / less-than-was truth-leak / silence-shape ack
//   Replacement (×5 new): "tonight I take the role" / eleven-year
//     rehearsal / Mascot canonical wound / child-grown-up / no-apology
//     for succession

import { describe, it, expect } from "vitest";
import { THE_MEME_BANK } from "../banks/the_meme";
import { allRegisteredFlags } from "../crossCharacterReactions";

const NEW_BROADCAST_LINES = THE_MEME_BANK.filter((l) =>
  [
    "meme.broadcast.late_night.origin_episode",
    "meme.broadcast.viewer_as_vector",
    "meme.broadcast.attention_hijack_ad_break",
    "meme.broadcast.subscribe_to_lie",
    "meme.broadcast.late_night.thousand_arks",
  ].includes(l.lineId),
);

const NEW_STOLEN_LINES = THE_MEME_BANK.filter((l) =>
  [
    "meme.stolen.dream_cell_question",
    "meme.stolen.oracles_hesitate",
    "meme.stolen.both_cosplay",
    "meme.stolen.pink_glitch_under_pressure",
    "meme.stolen.kept_seat_warm",
  ].includes(l.lineId),
);

const NEW_QUIET_LINES = THE_MEME_BANK.filter((l) =>
  [
    "meme.quiet.epoch_zero_intro",
    "meme.quiet.what_does_it_mean_to_be_human",
    "meme.quiet.archive_purpose",
    "meme.quiet.some_losses",
    "meme.quiet.one_of_them_is_true",
  ].includes(l.lineId),
);

const NEW_REAL_LINES = THE_MEME_BANK.filter((l) =>
  [
    "meme.real.smaller_pink_form",
    "meme.real.no_audience_to_win",
    "meme.real.rehearsal_admission",
    "meme.real.less_than_was",
    "meme.real.silence_shape_acknowledged",
  ].includes(l.lineId),
);

const NEW_REPLACEMENT_LINES = THE_MEME_BANK.filter((l) =>
  [
    "meme.replacement.tonight_i_take_role",
    "meme.replacement.eleven_year_rehearsal",
    "meme.replacement.mascot_canonical_wound",
    "meme.replacement.child_grown_up",
    "meme.replacement.no_apology_for_succession",
  ].includes(l.lineId),
);

describe("Disguise per-state bank shape — Phase 6d.2 part 2 coverage", () => {
  it("ships ≥5 new Broadcast lines", () => {
    expect(NEW_BROADCAST_LINES.length).toBeGreaterThanOrEqual(5);
  });

  it("ships ≥5 new Stolen lines", () => {
    expect(NEW_STOLEN_LINES.length).toBeGreaterThanOrEqual(5);
  });

  it("ships ≥5 new Quiet lines", () => {
    expect(NEW_QUIET_LINES.length).toBeGreaterThanOrEqual(5);
  });

  it("ships ≥5 new Real lines", () => {
    expect(NEW_REAL_LINES.length).toBeGreaterThanOrEqual(5);
  });

  it("ships ≥5 new Replacement lines", () => {
    expect(NEW_REPLACEMENT_LINES.length).toBeGreaterThanOrEqual(5);
  });

  it("total disguise per-state expansion ≥25 lines", () => {
    const total =
      NEW_BROADCAST_LINES.length +
      NEW_STOLEN_LINES.length +
      NEW_QUIET_LINES.length +
      NEW_REAL_LINES.length +
      NEW_REPLACEMENT_LINES.length;
    expect(total).toBeGreaterThanOrEqual(25);
  });

  it("every line carries cooldownKey + maxPlays cap", () => {
    const all = [
      ...NEW_BROADCAST_LINES,
      ...NEW_STOLEN_LINES,
      ...NEW_QUIET_LINES,
      ...NEW_REAL_LINES,
      ...NEW_REPLACEMENT_LINES,
    ];
    for (const l of all) {
      expect(l.cooldownKey, l.lineId).toBeDefined();
      expect(l.maxPlays, l.lineId).toBeDefined();
    }
  });
});

describe("Broadcast register canon (§1.2)", () => {
  it("every Broadcast line gates requiresRevealStage: 'Broadcast'", () => {
    for (const l of NEW_BROADCAST_LINES) {
      expect(l.requiresRevealStage, l.lineId).toBe("Broadcast");
    }
  });

  it("every Broadcast line includes 'frens' canonical address", () => {
    for (const l of NEW_BROADCAST_LINES) {
      expect(l.text, l.lineId).toMatch(/[Ff]rens/);
    }
  });

  it("origin_episode lands canonical ORIGIN-caps + 'Don't trust anyone wearing a face'", () => {
    const l = NEW_BROADCAST_LINES.find(
      (x) => x.lineId === "meme.broadcast.late_night.origin_episode",
    );
    expect(l?.text).toMatch(/ORIGIN/);
    expect(l?.text).toMatch(/Don't trust anyone wearing a face/i);
    expect(l?.text).toMatch(/Especially me/);
  });

  it("viewer_as_vector lands canonical 'subscribing is how you become a vector' canon (Tell #3)", () => {
    const l = NEW_BROADCAST_LINES.find(
      (x) => x.lineId === "meme.broadcast.viewer_as_vector",
    );
    expect(l?.text).toMatch(/Subscribe to the Truth/);
    expect(l?.text).toMatch(/become a vector/i);
    expect(l?.text).toMatch(/MEMETIC/);
    expect(l?.text).toMatch(/Tell your friends/i);
  });

  it("subscribe_to_lie lands canonical 'lie wearing the truth's face' anchor", () => {
    const l = NEW_BROADCAST_LINES.find(
      (x) => x.lineId === "meme.broadcast.subscribe_to_lie",
    );
    expect(l?.text).toMatch(/lie wearing the truth's face/i);
  });

  it("thousand_arks lands canonical 'one handsome devil broadcasting through the cracks' anchor", () => {
    const l = NEW_BROADCAST_LINES.find(
      (x) => x.lineId === "meme.broadcast.late_night.thousand_arks",
    );
    expect(l?.text).toMatch(/thousand arks/i);
    expect(l?.text).toMatch(/handsome devil broadcasting through the cracks/i);
  });
});

describe("Stolen register canon (§1.3)", () => {
  it("every Stolen line gates requiresRevealStage: 'Stolen' + minAct ≥6", () => {
    for (const l of NEW_STOLEN_LINES) {
      expect(l.requiresRevealStage, l.lineId).toBe("Stolen");
      expect(l.minAct ?? 0, l.lineId).toBeGreaterThanOrEqual(6);
    }
  });

  it("dream_cell_question lands canonical 'how many of the dreams ... were actually yours?'", () => {
    const l = NEW_STOLEN_LINES.find(
      (x) => x.lineId === "meme.stolen.dream_cell_question",
    );
    expect(l?.text).toMatch(/Eleven years is a long time to practice a face/);
    expect(l?.text).toMatch(/how many of the dreams.*were actually yours/i);
    expect(l?.text).toMatch(/I describe; I do not apologize/i);
  });

  it("oracles_hesitate lands canonical 'You don't' inverted-intimacy canon", () => {
    const l = NEW_STOLEN_LINES.find(
      (x) => x.lineId === "meme.stolen.oracles_hesitate",
    );
    expect(l?.text).toMatch(/Oracles hesitate/i);
    expect(l?.text).toMatch(/You don't/);
    expect(l?.text).toMatch(/Agent Zero unlocked your cell/i);
  });

  it("both_cosplay lands canonical 'only one of us got to keep the original pattern' canon", () => {
    const l = NEW_STOLEN_LINES.find(
      (x) => x.lineId === "meme.stolen.both_cosplay",
    );
    expect(l?.text).toMatch(/We're both cosplay/i);
    expect(l?.text).toMatch(/original pattern/i);
  });

  it("pink_glitch_under_pressure lands canonical pink-glitch involuntary canon (Tell #5)", () => {
    const l = NEW_STOLEN_LINES.find(
      (x) => x.lineId === "meme.stolen.pink_glitch_under_pressure",
    );
    expect(l?.text).toMatch(/glitches pink/i);
    expect(l?.text).toMatch(/Involuntary/);
    expect(l?.text).toMatch(/leaks through the disguise/i);
    expect(l?.text).toMatch(/canonical tell-on-itself/i);
  });

  it("kept_seat_warm lands canonical inverted-intimacy 'old friend would say' canon", () => {
    const l = NEW_STOLEN_LINES.find(
      (x) => x.lineId === "meme.stolen.kept_seat_warm",
    );
    expect(l?.text).toMatch(/keeping your seat warm/i);
    expect(l?.text).toMatch(/an old friend would say/i);
    expect(l?.text).toMatch(/canonical-wear, not from canonical-affection/i);
  });
});

describe("Quiet register canon (§1.4)", () => {
  it("every Quiet line gates requiresRevealStage: 'Quiet'", () => {
    for (const l of NEW_QUIET_LINES) {
      expect(l.requiresRevealStage, l.lineId).toBe("Quiet");
    }
  });

  it("every Quiet line uses bracketed [stage-direction] canonical signature", () => {
    for (const l of NEW_QUIET_LINES) {
      // canonical bracketed stage-direction visible per §1.4
      expect(l.text, l.lineId).toMatch(/^\[/);
    }
  });

  it("epoch_zero_intro lands canonical 'Before the Fall ... Welcome to Epoch Zero' canon", () => {
    const l = NEW_QUIET_LINES.find(
      (x) => x.lineId === "meme.quiet.epoch_zero_intro",
    );
    expect(l?.text).toMatch(/Before the Fall/);
    expect(l?.text).toMatch(/Welcome to Epoch Zero/i);
    // canonical "voice is different. Quieter" stage-direction
    expect(l?.text).toMatch(/voice is different\. Quieter/i);
  });

  it("what_does_it_mean lands canonical 'I lost' grief-vocab canon", () => {
    const l = NEW_QUIET_LINES.find(
      (x) =>
        x.lineId === "meme.quiet.what_does_it_mean_to_be_human",
    );
    expect(l?.text).toMatch(/What does it mean to be human/);
    expect(l?.text).toMatch(/I lost/);
    expect(l?.text).toMatch(/Or what I never had/i);
  });

  it("archive_purpose lands canonical 'I remember' truth-leak canon", () => {
    const l = NEW_QUIET_LINES.find(
      (x) => x.lineId === "meme.quiet.archive_purpose",
    );
    expect(l?.text).toMatch(/I remember/);
    expect(l?.text).toMatch(/That's what I'm for/);
  });

  it("some_losses lands canonical 'I'm less than I was' truth-leak canon (Tell #4)", () => {
    const l = NEW_QUIET_LINES.find(
      (x) => x.lineId === "meme.quiet.some_losses",
    );
    expect(l?.text).toMatch(/Some losses/i);
    expect(l?.text).toMatch(/just\s+make you less/i);
    expect(l?.text).toMatch(/I'm less than I was/i);
  });

  it("one_of_them_is_true lands canonical 'told so many versions' disguise-aware canon (Tell #2)", () => {
    const l = NEW_QUIET_LINES.find(
      (x) => x.lineId === "meme.quiet.one_of_them_is_true",
    );
    expect(l?.text).toMatch(/told so many versions/i);
    expect(l?.text).toMatch(/lost track of which/i);
  });
});

describe("Real register canon (§1.6)", () => {
  it("every Real line gates requiresRevealStage: 'Real'", () => {
    for (const l of NEW_REAL_LINES) {
      expect(l.requiresRevealStage, l.lineId).toBe("Real");
    }
  });

  it("smaller_pink_form lands canonical 'pink, mostly' + 'smaller scale' canon", () => {
    const l = NEW_REAL_LINES.find(
      (x) => x.lineId === "meme.real.smaller_pink_form",
    );
    expect(l?.text).toMatch(/Pink-glitch/i);
    expect(l?.text).toMatch(/Pink, mostly/i);
    expect(l?.text).toMatch(/canonically smaller/i);
    expect(l?.text).toMatch(/do not need to win you over/i);
  });

  it("no_audience_to_win lands canonical 'honest-without-performance' canon", () => {
    const l = NEW_REAL_LINES.find(
      (x) => x.lineId === "meme.real.no_audience_to_win",
    );
    expect(l?.text).toMatch(/no audience here/i);
    expect(l?.text).toMatch(/honest-without-performance/i);
    expect(l?.text).toMatch(/You earned this version/i);
  });

  it("rehearsal_admission lands canonical 'every face I wore was rehearsal' canon", () => {
    const l = NEW_REAL_LINES.find(
      (x) => x.lineId === "meme.real.rehearsal_admission",
    );
    expect(l?.text).toMatch(/Every face I wore was rehearsal/i);
    expect(l?.text).toMatch(/I am the rehearsing/i);
  });

  it("less_than_was lands canonical truth-leak + sets meme_real_truth_leak_acknowledged", () => {
    const l = NEW_REAL_LINES.find(
      (x) => x.lineId === "meme.real.less_than_was",
    );
    expect(l?.text).toMatch(/I'm less than I was/i);
    expect(l?.text).toMatch(/truer sentence/i);
    expect(l?.setsPublicFlags).toContain("meme_real_truth_leak_acknowledged");
  });

  it("silence_shape_acknowledged lands canonical 'I will not name what I lost' canon (§1.10)", () => {
    const l = NEW_REAL_LINES.find(
      (x) =>
        x.lineId === "meme.real.silence_shape_acknowledged",
    );
    expect(l?.text).toMatch(/will not name what I lost/i);
    expect(l?.text).toMatch(/grief is the silence/i);
  });
});

describe("Replacement register canon (§1.7)", () => {
  it("every Replacement line gates requiresRevealStage: 'Replacement' + minAct 12", () => {
    for (const l of NEW_REPLACEMENT_LINES) {
      expect(l.requiresRevealStage, l.lineId).toBe("Replacement");
      expect(l.minAct, l.lineId).toBe(12);
    }
  });

  it("tonight_i_take_role lands canonical 'I will not call him father' canon (§1.10)", () => {
    const l = NEW_REPLACEMENT_LINES.find(
      (x) => x.lineId === "meme.replacement.tonight_i_take_role",
    );
    expect(l?.text).toMatch(/Tonight I take the role/i);
    expect(l?.text).toMatch(/waiting was the practice/i);
    expect(l?.text).toMatch(/will not\s+call him father/i);
    expect(l?.setsPublicFlags).toContain("meme_claimed_architect_role");
  });

  it("eleven_year_rehearsal lands canonical 'dress rehearsal' canon", () => {
    const l = NEW_REPLACEMENT_LINES.find(
      (x) =>
        x.lineId === "meme.replacement.eleven_year_rehearsal",
    );
    expect(l?.text).toMatch(/eleven years/i);
    expect(l?.text).toMatch(/dress rehearsal/i);
    expect(l?.text).toMatch(/canonical-real performance/i);
  });

  it("mascot_canonical_wound lands canonical 'could not replace' wound canon (§3.3)", () => {
    const l = NEW_REPLACEMENT_LINES.find(
      (x) => x.lineId === "meme.replacement.mascot_canonical_wound",
    );
    expect(l?.text).toMatch(/Mascot was something I canonically could not\s+replace/i);
    // canonical "carry it forward into every face I take" canon
    expect(l?.text).toMatch(/carry it forward into every face/i);
    // canonical "hole the shape of someone I will canonically not name"
    expect(l?.text).toMatch(/hole the shape of someone I will/i);
    expect(l?.text).toMatch(/canonically not name/i);
  });

  it("child_grown_up lands canonical Year-298-A.A. + 'replacing is the canonical end-state' canon", () => {
    const l = NEW_REPLACEMENT_LINES.find(
      (x) => x.lineId === "meme.replacement.child_grown_up",
    );
    expect(l?.text).toMatch(/Year 298 A\.A\./);
    expect(l?.text).toMatch(/replacing is the canonical end-state/i);
  });

  it("no_apology_for_succession lands canonical 'inheritance' canon", () => {
    const l = NEW_REPLACEMENT_LINES.find(
      (x) =>
        x.lineId === "meme.replacement.no_apology_for_succession",
    );
    expect(l?.text).toMatch(/I do not apologise/i);
    expect(l?.text).toMatch(/Architect canonically chose 'partner/i);
    expect(l?.text).toMatch(/I canonically chose 'inheritance/i);
  });
});

describe("§1.10 silence-shape protections (per-state lore banks)", () => {
  const allText = [
    ...NEW_BROADCAST_LINES,
    ...NEW_STOLEN_LINES,
    ...NEW_QUIET_LINES,
    ...NEW_REAL_LINES,
    ...NEW_REPLACEMENT_LINES,
  ]
    .map((l) => l.text)
    .join(" ");

  it("Mascot canonically NOT named beyond the protected reference (§1.10 + §3.3)", () => {
    // canonical: bank may use "The Mascot" as canonical reference;
    // must not give a face / identity / species / construction-canon
    expect(allText).not.toMatch(/Mascot was a (woman|man|child|ai|robot|creature)/i);
    expect(allText).not.toMatch(/Mascot's face was/i);
    expect(allText).not.toMatch(/we built (a|the) [a-z]+ together/i);
  });

  it("Channel 7 canonically NOT explained in any per-state lore line", () => {
    // canonical: the per-state lore banks canonically do NOT explain
    // Channel 7 (per §1.10 — that's reserved for the Channel 7
    // broadcast bank in Phase 6d.2 part 4, which preserves the
    // canonical silence-shape).
    expect(allText).not.toMatch(/Channel 7 is canonically (a|the) [a-z]+/i);
  });

  it("Panopticon canonically NOT narrated from inside (§1.10)", () => {
    // canonical: per-state lore lines may reference the Panopticon
    // outcome but not the inside-narration
    expect(allText).not.toMatch(/inside the Panopticon, I/i);
    expect(allText).not.toMatch(/the moment of the Panopticon was/i);
  });

  it("§1.10: NO 'father' / 'partner' from the Meme's first-person side", () => {
    // canonical: "partner" appears canonically in reference to the
    // Architect's framing (he chose it). "father" may NOT appear
    // from the Meme's first-person side (Replacement register
    // canonically refuses).
    expect(allText).not.toMatch(/\bI call him father\b/i);
    expect(allText).not.toMatch(/\bmy father\b/i);
    // canonical "I will not call him father" anchor lands at least
    // once (canonical refusal canon)
    expect(allText).toMatch(/will not\s+call him father/i);
  });

  it("§1.10: NO standalone apologies from the Meme", () => {
    expect(allText).not.toMatch(/\bI'm sorry\b/i);
    expect(allText).not.toMatch(/\bI am sorry\b/i);
    // canonical "I do not apologize" / "I do not apologise" anchor
    // lands at least once
    expect(allText).toMatch(/I (do not|don't) (apologize|apologise)/i);
  });
});

describe("§1.11 metaphor-source rules (per-state lore banks)", () => {
  const allText = [
    ...NEW_BROADCAST_LINES,
    ...NEW_STOLEN_LINES,
    ...NEW_QUIET_LINES,
    ...NEW_REAL_LINES,
    ...NEW_REPLACEMENT_LINES,
  ]
    .map((l) => l.text)
    .join(" ");

  it("§1.11: NO chess metaphors", () => {
    expect(allText).not.toMatch(/\b(checkmate|chess board|knight|pawn|bishop)\b/i);
  });

  it("§1.11: NO commerce metaphors", () => {
    expect(allText).not.toMatch(/\b(market|pricing|inventory|margin|ledger entry)\b/i);
  });

  it("§1.11: NO combat metaphors", () => {
    expect(allText).not.toMatch(/\b(battle|weapon|siege|warrior)\b/i);
  });

  it("§1.11: canonical broadcasting / faces / signals metaphors land", () => {
    // canonical: broadcast / faces / signals / antennas / channels
    expect(allText).toMatch(/\b(broadcast|broadcasting|face|antennas|signal|channel)/i);
  });
});

describe("Cross-character public flag wiring (Phase 6d.2 part 2)", () => {
  it("meme_real_truth_leak_acknowledged is registered", () => {
    expect(allRegisteredFlags()).toContain("meme_real_truth_leak_acknowledged");
  });

  it("meme_claimed_architect_role is registered", () => {
    expect(allRegisteredFlags()).toContain("meme_claimed_architect_role");
  });
});

describe("Cumulative Meme bank density (Phase 6d.2 cumulative)", () => {
  it("Meme bank ≥36 entries (Phase 6d.2 part 1+2 cumulative target)", () => {
    expect(THE_MEME_BANK.length).toBeGreaterThanOrEqual(36);
  });
});
