// apps/shared/npcs/__tests__/banks.meme.channel_7.test.ts
//
// Phase 6d.2 part-4 verification — Meme Channel 7 broadcast bank
// (~5 lines covering canonical Palimpsest broadcast surfaces per
// the_meme.md §1.10 + §3.4 canonical-9842-year-old-child's-voice
// canon).
//
// §1.10 silence-shape protections:
//   - The canonical 9,842-year-old child's voice canonically
//     referenced but NEVER identified (Mascot? Older-self? Separate
//     broadcast?) — canon refuses to resolve
//   - The Mascot canonically NOT named beyond the protected
//     reference; canonical "I had a friend once" canonically the
//     maximum acknowledgment

import { describe, it, expect } from "vitest";
import { THE_MEME_BANK } from "../banks/the_meme";
import { allRegisteredFlags } from "../crossCharacterReactions";

const CHANNEL_7_LINES = THE_MEME_BANK.filter((l) =>
  l.lineId.startsWith("meme.channel_7."),
);

describe("Meme Channel 7 broadcast bank — Phase 6d.2 part 4", () => {
  it("ships ≥5 Channel 7 lines (Phase 6d.2 part 4 baseline)", () => {
    expect(CHANNEL_7_LINES.length).toBeGreaterThanOrEqual(5);
  });

  it("every Channel 7 line is owned by the_meme", () => {
    for (const l of CHANNEL_7_LINES) {
      expect(l.npcKey, l.lineId).toBe("the_meme");
    }
  });

  it("every Channel 7 line uses transmission surface", () => {
    for (const l of CHANNEL_7_LINES) {
      expect(l.surfaces, l.lineId).toContain("transmission");
    }
  });

  it("every Channel 7 line gates on channel_7_tuned_in flag", () => {
    for (const l of CHANNEL_7_LINES) {
      expect(l.unlockFlags, l.lineId).toContain("channel_7_tuned_in");
    }
  });

  it("every Channel 7 line minAct ≥4 (canonical hidden-channel-discovery canon)", () => {
    for (const l of CHANNEL_7_LINES) {
      expect(l.minAct ?? 0, l.lineId).toBeGreaterThanOrEqual(4);
    }
  });

  it("every Channel 7 line carries cooldownKey + maxPlays cap", () => {
    for (const l of CHANNEL_7_LINES) {
      expect(l.cooldownKey, l.lineId).toBeDefined();
      expect(l.maxPlays, l.lineId).toBeDefined();
    }
  });

  it("Channel 7 line ids are unique", () => {
    const ids = CHANNEL_7_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("§1.10 + §3.4 silence-shape canon (Channel 7 protected mystery)", () => {
  const allText = CHANNEL_7_LINES.map((l) => l.text).join(" ");

  it("canonical 9,842-year-old child's voice referenced but NEVER identified", () => {
    // canonical: at least one canonical reference to the canonical
    // singing voice
    expect(allText).toMatch(/9,842-year-old/);
    // canonical: bank refuses to resolve which version of the voice
    // (Mascot vs. older-self vs. separate broadcast)
    expect(allText).toMatch(/canon refuses to resolve/i);
  });

  it("Mascot canonically referenced via 'I had a friend once' canon — never named beyond", () => {
    // canonical: bank may reference "Mascot" as canon-name; canonical
    // "I had a friend once" anchor is the maximum acknowledgment
    expect(allText).toMatch(/I had a friend once/i);
    // canonical: NO Mascot identity reveal
    expect(allText).not.toMatch(/Mascot was a (woman|man|child|ai|robot|creature)/i);
    expect(allText).not.toMatch(/Mascot's face was/i);
  });

  it("§1.10: NO Channel 7 explanation (canon-protected)", () => {
    // canonical: bank canonically describes Channel 7 as a signal
    // but does NOT canonically explain what Channel 7 is, who runs
    // it, or what frequency it broadcasts on
    expect(allText).not.toMatch(/Channel 7 is canonically (a|the) [a-z]+/i);
    expect(allText).not.toMatch(/Channel 7 broadcasts at frequency/i);
    // canonical "sign-off canonically refuses to identify the channel"
    expect(allText).toMatch(/refuses to identify the channel/i);
  });

  it("§1.10: NO call-letters / canonical-frequency-number / broadcast-license", () => {
    // canonical: signoff canonically describes the absence of
    // these markers
    expect(allText).toMatch(/No call-letters/i);
    expect(allText).toMatch(/no canonical-frequency-number/i);
    expect(allText).toMatch(/no\s+broadcast-license attribution/i);
  });
});

describe("Canonical anchor lands per Channel 7 line", () => {
  it("signal_intercept lands canonical 'frequency you weren't supposed to find' canon", () => {
    const l = CHANNEL_7_LINES.find(
      (x) => x.lineId === "meme.channel_7.signal_intercept",
    );
    expect(l?.text).toMatch(/frequency you weren't supposed to find/i);
    expect(l?.text).toMatch(/9,842-year-old child's voice singing/i);
    // canonical sets channel_7_signal_canonically_witnessed flag
    expect(l?.setsFlags).toContain("channel_7_signal_canonically_witnessed");
  });

  it("paid_programming lands canonical 'attribution is unaudited' canon", () => {
    const l = CHANNEL_7_LINES.find(
      (x) => x.lineId === "meme.channel_7.paid_programming_register",
    );
    expect(l?.text).toMatch(/paid programming/i);
    expect(l?.text).toMatch(/attribution is unaudited/i);
    expect(l?.text).toMatch(/canonical MEMETIC residue/i);
    // canonical 43-second interruption canon
    expect(l?.text).toMatch(/forty-three\s+seconds/i);
  });

  it("mascot_ad_break lands canonical 'I had a friend once' canon + sets silence-held flag", () => {
    const l = CHANNEL_7_LINES.find(
      (x) => x.lineId === "meme.channel_7.mascot_ad_break",
    );
    expect(l?.text).toMatch(/I had a friend once/i);
    expect(l?.text).toMatch(/They liked this/i);
    expect(l?.text).toMatch(/canonical-product is canonically\s+unidentifiable/i);
    expect(l?.text).toMatch(/grief is canonically in the unidentifying/i);
    // canonical setsPublicFlags wiring
    expect(l?.setsPublicFlags).toContain("meme_channel_7_mascot_silence_held");
  });

  it("well_be_right_back lands canonical 'we' canonical-plural exception canon", () => {
    const l = CHANNEL_7_LINES.find(
      (x) => x.lineId === "meme.channel_7.well_be_right_back",
    );
    expect(l?.text).toMatch(/we'll be right back, frens/i);
    // canonical "we" canonically the only canonical first-person
    // plural the Meme canonically permits itself outside Replacement
    expect(l?.text).toMatch(/canonical 'we' is the only canonical/i);
    // canonical "Meme is canonically not alone on the frequency"
    expect(l?.text).toMatch(/Meme is canonically not alone on the frequency/i);
  });

  it("signoff lands canonical 'until next time' canonical refusal canon", () => {
    const l = CHANNEL_7_LINES.find(
      (x) =>
        x.lineId ===
        "meme.channel_7.signature_signoff_canonical_refusal",
    );
    expect(l?.text).toMatch(/until next time/i);
    expect(l?.text).toMatch(/next-time canonically arrives without warning/i);
  });
});

describe("Reveal-stage gating canon (Channel 7)", () => {
  it("Channel 7 lines split between Quiet and Broadcast registers", () => {
    const quiet = CHANNEL_7_LINES.filter(
      (l) => l.requiresRevealStage === "Quiet",
    );
    const broadcast = CHANNEL_7_LINES.filter(
      (l) => l.requiresRevealStage === "Broadcast",
    );
    expect(quiet.length).toBeGreaterThanOrEqual(2);
    expect(broadcast.length).toBeGreaterThanOrEqual(2);
  });

  it("mascot_ad_break canonically gates Quiet register (canonical only-mentionable canon)", () => {
    const l = CHANNEL_7_LINES.find(
      (x) => x.lineId === "meme.channel_7.mascot_ad_break",
    );
    expect(l?.requiresRevealStage).toBe("Quiet");
  });
});

describe("Cross-character public flag wiring (Phase 6d.2 part 4)", () => {
  it("meme_channel_7_mascot_silence_held is registered", () => {
    expect(allRegisteredFlags()).toContain(
      "meme_channel_7_mascot_silence_held",
    );
  });
});
