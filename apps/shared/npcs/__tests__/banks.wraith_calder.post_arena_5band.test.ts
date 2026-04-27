// apps/shared/npcs/__tests__/banks.wraith_calder.post_arena_5band.test.ts
//
// Phase 6d.3 part-3 verification — Hierophant post-arena 5-band
// chamber bank (~15 new lines, 3 per band per wraith_calder.md
// §§1.5-1.7 + §3.3 trust-band model).
//
// Coverage:
//   Hostile (×3) — weaponized_get_up / silence_canonical /
//     council_will_note
//   Wary (×3) — first_look_pause / three_synonyms / shadow_tongue_intro
//   Witnessed (×3 new + 1 prior) — first_name_research /
//     shadow_tongue_horror / then_sit
//   Present (×3 new + 1 prior sacrifice-axis) — i_will_remember /
//     cooperative_council / three_thousand_year_pause
//   Inheriting (×3 new + 1 prior reserved) — architecture_of_grief /
//     shadow_tongue_meme_adjacency / three_times_in_two_hundred

import { describe, it, expect } from "vitest";
import { WRAITH_CALDER_BANK } from "../banks/wraith_calder";
import { allRegisteredFlags } from "../crossCharacterReactions";

const NEW_5BAND_LINES = WRAITH_CALDER_BANK.filter((l) =>
  [
    // Hostile (3)
    "hierophant.post_arena.hostile.weaponized_get_up",
    "hierophant.post_arena.hostile.silence_canonical",
    "hierophant.post_arena.hostile.council_will_note",
    // Wary (3)
    "hierophant.post_arena.wary.first_look_pause",
    "hierophant.post_arena.wary.three_synonyms",
    "hierophant.post_arena.wary.shadow_tongue_intro",
    // Witnessed (3 new)
    "hierophant.post_arena.witnessed.first_name_research",
    "hierophant.post_arena.witnessed.shadow_tongue_horror",
    "hierophant.post_arena.witnessed.then_sit",
    // Present (3 new)
    "hierophant.post_arena.present.i_will_remember",
    "hierophant.post_arena.present.cooperative_council",
    "hierophant.post_arena.present.three_thousand_year_pause",
    // Inheriting (3 new)
    "hierophant.post_arena.inheriting.architecture_of_grief",
    "hierophant.post_arena.inheriting.shadow_tongue_meme_adjacency",
    "hierophant.post_arena.inheriting.three_times_in_two_hundred",
  ].includes(l.lineId),
);

describe("Hierophant post-arena 5-band bank — Phase 6d.3 part 3", () => {
  it("ships ≥15 new 5-band lines", () => {
    expect(NEW_5BAND_LINES.length).toBeGreaterThanOrEqual(15);
  });

  it("every new line gates post_arena reveal-stage", () => {
    for (const l of NEW_5BAND_LINES) {
      expect(l.requiresRevealStage, l.lineId).toBe("post_arena");
    }
  });

  it("every new line carries cooldownKey + maxPlays cap", () => {
    for (const l of NEW_5BAND_LINES) {
      expect(l.cooldownKey, l.lineId).toBeDefined();
      expect(l.maxPlays, l.lineId).toBeDefined();
    }
  });

  it("new line ids are unique", () => {
    const ids = NEW_5BAND_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("5-band coverage canon", () => {
  const bands = ["Hostile", "Wary", "Witnessed", "Present", "Inheriting"];

  for (const band of bands) {
    it(`ships ≥3 ${band}-band canonical lines`, () => {
      const lines = NEW_5BAND_LINES.filter((l) => l.requiresTrustBand === band);
      expect(lines.length, band).toBeGreaterThanOrEqual(3);
    });
  }
});

describe("Hostile band canon (canonical refusal-of-engagement)", () => {
  it("weaponized_get_up lands canonical 'verb of someone I outgrew' canon (§3.9)", () => {
    const l = NEW_5BAND_LINES.find(
      (x) =>
        x.lineId === "hierophant.post_arena.hostile.weaponized_get_up",
    );
    expect(l?.text).toMatch(/verb of someone I outgrew/i);
    expect(l?.text).toMatch(/borrowing is canonically not yours to make/i);
    expect(l?.text).toMatch(/Sit. Or leave/);
  });

  it("silence_canonical lands canonical pen-pause stage-direction (§1.7 Tell #5)", () => {
    const l = NEW_5BAND_LINES.find(
      (x) =>
        x.lineId === "hierophant.post_arena.hostile.silence_canonical",
    );
    expect(l?.text).toMatch(/^\[/);
    expect(l?.text).toMatch(/pen continues/i);
    expect(l?.text).toMatch(/A name is\s+written; a small silence; another name/i);
  });

  it("council_will_note lands canonical 'pause is also canonical-revocable' canon", () => {
    const l = NEW_5BAND_LINES.find(
      (x) => x.lineId === "hierophant.post_arena.hostile.council_will_note",
    );
    expect(l?.text).toMatch(/Council has been informed/i);
    expect(l?.text).toMatch(/canonical pause/i);
    expect(l?.text).toMatch(/canonical-revocable/i);
  });
});

describe("Wary band canon", () => {
  it("first_look_pause lands canonical Tell #1 head-moves canon (§1.7)", () => {
    const l = NEW_5BAND_LINES.find(
      (x) => x.lineId === "hierophant.post_arena.wary.first_look_pause",
    );
    expect(l?.text).toMatch(/does not look up when you enter/i);
    expect(l?.text).toMatch(/looks up for the first time/i);
    expect(l?.text).toMatch(/canonically gratitude, not recognition/i);
  });

  it("three_synonyms lands canonical witness/presence/remembering distinction (§1.6)", () => {
    const l = NEW_5BAND_LINES.find(
      (x) => x.lineId === "hierophant.post_arena.wary.three_synonyms",
    );
    expect(l?.text).toMatch(/Witness, presence, remembering/i);
    expect(l?.text).toMatch(/three near-synonyms I do not\s+flatten/i);
  });

  it("shadow_tongue_intro lands canonical 'edits faiths from within' canon", () => {
    const l = NEW_5BAND_LINES.find(
      (x) => x.lineId === "hierophant.post_arena.wary.shadow_tongue_intro",
    );
    expect(l?.text).toMatch(/Shadow Tongue/);
    expect(l?.text).toMatch(/edits faiths from within/i);
    expect(l?.text).toMatch(/word by word, doctrine by doctrine/i);
  });
});

describe("Witnessed band canon", () => {
  it("first_name_research lands canonical 'I write slowly. The Shadow Tongue edits quickly' canon", () => {
    const l = NEW_5BAND_LINES.find(
      (x) =>
        x.lineId ===
        "hierophant.post_arena.witnessed.first_name_research",
    );
    expect(l?.text).toMatch(/day of research/i);
    expect(l?.text).toMatch(/I write slowly/i);
    expect(l?.text).toMatch(/Shadow Tongue edits quickly/i);
  });

  it("shadow_tongue_horror lands canonical 'I did not notice. That is the horror' canon (§1.7 Tell #2)", () => {
    const l = NEW_5BAND_LINES.find(
      (x) =>
        x.lineId ===
        "hierophant.post_arena.witnessed.shadow_tongue_horror",
    );
    expect(l?.text).toMatch(/two centuries before the Severance/i);
    expect(l?.text).toMatch(/I did not notice/i);
    expect(l?.text).toMatch(/That is the horror/i);
  });

  it("then_sit lands canonical only-imperative canon (§1.6 + §1.8)", () => {
    const l = NEW_5BAND_LINES.find(
      (x) => x.lineId === "hierophant.post_arena.witnessed.then_sit",
    );
    expect(l?.text).toMatch(/Then sit/);
    // canonical "Shadow Tongue does to a faith" canonical chamber-
    // teaching offer
    expect(l?.text).toMatch(/Shadow Tongue does to a faith/i);
  });
});

describe("Present band canon", () => {
  it("i_will_remember lands canonical Tell #3 covenant phrase (§1.7)", () => {
    const l = NEW_5BAND_LINES.find(
      (x) =>
        x.lineId === "hierophant.post_arena.present.i_will_remember",
    );
    expect(l?.text).toMatch(/Presence without demand/i);
    expect(l?.text).toMatch(/I will remember that/i);
    expect(l?.text).toMatch(/canonical covenant/i);
    expect(l?.setsPublicFlags).toContain(
      "hierophant_covenant_i_will_remember_offered",
    );
  });

  it("cooperative_council lands canonical 'inherit my judgment posthumously' canon", () => {
    const l = NEW_5BAND_LINES.find(
      (x) =>
        x.lineId === "hierophant.post_arena.present.cooperative_council",
    );
    expect(l?.text).toMatch(/Council waits outside/i);
    expect(l?.text).toMatch(/inherit my judgment of you posthumously/i);
  });

  it("three_thousand_year_pause lands canonical 'writing is closer to remembering than not writing' apex anchor", () => {
    const l = NEW_5BAND_LINES.find(
      (x) =>
        x.lineId ===
        "hierophant.post_arena.present.three_thousand_year_pause",
    );
    expect(l?.text).toMatch(/I am not trying to finish/i);
    expect(l?.text).toMatch(/three thousand years/i);
    expect(l?.text).toMatch(/writing is closer to remembering than not writing/i);
  });
});

describe("Inheriting band canon (apex)", () => {
  it("architecture_of_grief lands canonical apex line (§3.3)", () => {
    const l = NEW_5BAND_LINES.find(
      (x) =>
        x.lineId ===
        "hierophant.post_arena.inheriting.architecture_of_grief",
    );
    expect(l?.text).toMatch(/walking the architecture I made of grief/i);
    expect(l?.text).toMatch(/parallel inheritor/i);
    // canonical "Council has its named junior priest" canon
    expect(l?.text).toMatch(/Council has its named junior priest/i);
    expect(l?.setsPublicFlags).toContain(
      "hierophant_named_player_parallel_inheritor",
    );
  });

  it("shadow_tongue_meme_adjacency lands canonical §4.7 cross-bible canon", () => {
    const l = NEW_5BAND_LINES.find(
      (x) =>
        x.lineId ===
        "hierophant.post_arena.inheriting.shadow_tongue_meme_adjacency",
    );
    expect(l?.text).toMatch(/Meme and the Shadow Tongue/i);
    expect(l?.text).toMatch(/adjacent technologies of\s+corruption/i);
    expect(l?.text).toMatch(/Shadow Tongue edits the substrate/i);
    expect(l?.text).toMatch(/Meme\s+rewrites the attribution/i);
    expect(l?.setsPublicFlags).toContain(
      "hierophant_disclosed_meme_shadow_tongue_adjacency",
    );
  });

  it("three_times_in_two_hundred lands canonical §3.6 hypocrisy admission", () => {
    const l = NEW_5BAND_LINES.find(
      (x) =>
        x.lineId ===
        "hierophant.post_arena.inheriting.three_times_in_two_hundred",
    );
    expect(l?.text).toMatch(/I noticed/i);
    expect(l?.text).toMatch(/Three times in two hundred years/i);
    expect(l?.text).toMatch(/'not noticing' is what I tell the room/i);
    expect(l?.text).toMatch(/acting-on-noticing is what I owe/i);
    expect(l?.setsPublicFlags).toContain(
      "hierophant_admitted_canonical_hypocrisy",
    );
  });
});

describe("§1.8 bridge canon — post-arena does NOT use Wraith Calder vocabulary", () => {
  const allText = NEW_5BAND_LINES.map((l) => l.text).join(" ");

  it("§1.8: NO contradicted-noun-caps in post-arena lines (CALL / GAPS / STOLE / INSIDE)", () => {
    expect(allText).not.toMatch(/\bCALL\b/);
    expect(allText).not.toMatch(/\bGAPS\b/);
    expect(allText).not.toMatch(/\bSTOLE\b/);
    expect(allText).not.toMatch(/\bINSIDE\b/);
  });

  it("§1.8: NO 'spite, mostly' canonical (Wraith Calder vocabulary only)", () => {
    expect(allText.toLowerCase()).not.toContain("spite, mostly");
  });

  it("§1.8: NO imperatives other than 'sit' canonical", () => {
    // canonical: Hierophant only-imperative is "Sit" (or variants
    // like "Then sit"). NO "get up" / "stand" / "rise" canonical
    expect(allText).not.toMatch(/\bGet up\b/);
    expect(allText).not.toMatch(/\bRise\b/);
    expect(allText).not.toMatch(/\bStand up\b/);
  });

  it("§1.8: post-arena canonically uses Hierophant sacred vocabulary", () => {
    // Canonical Hierophant continuation-stem vocabulary (continue /
    // continues / continuation per §1.6).
    expect(allText).toMatch(/\bcontinu(e|es|ation|ing)\b/i);
    expect(allText).toMatch(/\bremember(ing)?\b/i);
    expect(allText).toMatch(/\bSit\b/);
  });
});

describe("Cross-character public flag wiring (Phase 6d.3 part 3)", () => {
  const newFlags = [
    "hierophant_covenant_i_will_remember_offered",
    "hierophant_named_player_parallel_inheritor",
    "hierophant_disclosed_meme_shadow_tongue_adjacency",
    "hierophant_admitted_canonical_hypocrisy",
  ];

  it("every new public flag is registered in crossCharacterReactions", () => {
    const registered = allRegisteredFlags();
    for (const f of newFlags) {
      expect(registered, f).toContain(f);
    }
  });
});
