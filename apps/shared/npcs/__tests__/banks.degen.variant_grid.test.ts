// apps/shared/npcs/__tests__/banks.degen.variant_grid.test.ts
//
// Phase 6c.1 part-2 verification — The Degen 5×5 personality-variant
// grid (~21 lines filling the missing cells across 5 archetypes ×
// 5 trust bands per the_degen.md §3.x).
//
// 5 archetypes per registry:
//   - All-in (canonical aggression-axis register)
//   - Pacifist-at-the-table (canonical restraint paradox)
//   - Citation-issuer (canonical archive register, Tell #5)
//   - Ne-Yon-aleatory (canonical let-the-dice-decide register)
//   - Ethics-committee-defendant (canonical Seer-citation defense)
//
// 5 trust bands per registry (DEGEN_BANDS):
//   - Cold-table (0)
//   - Recognized (25)
//   - Marked (50)
//   - Citation-holder (75)
//   - Ne-Yon-kin (90)
//
// Coverage assertions:
//   - All 4 new All-in cells (Recognized through Ne-Yon-kin)
//   - All 5 new Pacifist cells (full ladder)
//   - All 4 new Citation cells (Cold + Marked + Citation-holder + Ne-Yon-kin;
//     Recognized canonically already shipped via casino_data_source_offer)
//   - All 4 new Aleatory cells (Cold + Recognized + Citation-holder + Ne-Yon-kin)
//   - All 4 new Ethics cells (Cold + Marked variant-five + Citation-holder + Ne-Yon-kin)
//
// Voice protections (§1.4 forbidden vocabulary + §1.7 silence-shape):
//   - NO "fair" / "sorry" / "forever" / soul / salvation / sin
//   - NO war / engineering / biological metaphors
//   - "Mostly takes" leitmotif must NOT appear (already deployed once
//     in ask_degen_why_smile per §1.4 deploy-once canon)
//   - Pre-Ne-Yon-kin: only Seer + Enigma named among the Twelve
//   - Loneliness-close register canonically only in Ne-Yon-kin band

import { describe, it, expect } from "vitest";
import { THE_DEGEN_BANK } from "../banks/the_degen";

const VARIANT_LINES = THE_DEGEN_BANK.filter((l) =>
  l.lineId.startsWith("degen.variant."),
);

describe("Degen 5×5 variant grid — shape", () => {
  it("ships ≥21 new variant-grid lines (Phase 6c.1 part 2 baseline)", () => {
    expect(VARIANT_LINES.length).toBeGreaterThanOrEqual(21);
  });

  it("every variant line is owned by the_degen", () => {
    for (const l of VARIANT_LINES) {
      expect(l.npcKey, l.lineId).toBe("the_degen");
    }
  });

  it("variant-grid line ids are unique", () => {
    const ids = VARIANT_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every variant line has a cooldownKey (anti-spam contract)", () => {
    for (const l of VARIANT_LINES) {
      expect(l.cooldownKey, l.lineId).toBeDefined();
    }
  });
});

describe("All-in archetype × bands", () => {
  it("Recognized cell ships canonical 'three hands' filing", () => {
    const l = VARIANT_LINES.find(
      (x) => x.lineId === "degen.variant.allin.recognized.three_hands",
    );
    expect(l).toBeDefined();
    expect(l?.requiresTrustBand).toBe("Recognized");
    expect(l?.text).toMatch(/shoved on three hands/i);
    expect(l?.playerAxisGate?.axis).toBe("aggression");
  });

  it("Marked cell lands canonical 'doctrine vs religion' refusal", () => {
    const l = VARIANT_LINES.find(
      (x) => x.lineId === "degen.variant.allin.marked.doctrine_recognized",
    );
    expect(l?.requiresTrustBand).toBe("Marked");
    expect(l?.text).toMatch(/Strategy is for cowards/);
    expect(l?.text).toMatch(/Once is doctrine; twice is religion/);
    // Tell #1 self-aware showmanship: refuses to be quoted into
    // canon despite being asked to.
    expect(l?.text).toMatch(/won't carry the WEIGHT/i);
  });

  it("Citation-holder cell lands canonical peer-doctrine triplet", () => {
    const l = VARIANT_LINES.find(
      (x) =>
        x.lineId === "degen.variant.allin.citation_holder.peer_doctrine",
    );
    expect(l?.requiresTrustBand).toBe("Citation-holder");
    expect(l?.text).toMatch(/You shove\. I shove\. The arithmetic shoves/);
  });

  it("Ne-Yon-kin cell lands canonical 'all-in on existence' Ascended register + 15,000-year canon", () => {
    const l = VARIANT_LINES.find(
      (x) =>
        x.lineId ===
        "degen.variant.allin.ne_yon_kin.both_in_on_existence",
    );
    expect(l?.requiresTrustBand).toBe("Ne-Yon-kin");
    expect(l?.text).toMatch(/all-in on the same hand/i);
    expect(l?.text).toMatch(/hand is existence/i);
    expect(l?.text).toMatch(/fifteen thousand years/i);
    expect(l?.text).toMatch(/haven't[\s\S]*blinked/);
  });
});

describe("Pacifist-at-the-table archetype × all 5 bands", () => {
  const pacifistIds = [
    "degen.variant.pacifist.cold.gentle_at_open",
    "degen.variant.pacifist.recognized.refuses_to_predict",
    "degen.variant.pacifist.marked.unpredictable_courtesy",
    "degen.variant.pacifist.citation_holder.advanced_restraint",
    "degen.variant.pacifist.ne_yon_kin.shared_restraint",
  ];

  it("ships all 5 Pacifist cells", () => {
    for (const id of pacifistIds) {
      expect(VARIANT_LINES.find((l) => l.lineId === id), id).toBeDefined();
    }
  });

  it("Cold-table cell canonically uses 'courtesy' framing", () => {
    const l = VARIANT_LINES.find(
      (x) => x.lineId === "degen.variant.pacifist.cold.gentle_at_open",
    );
    expect(l?.requiresTrustBand).toBe("Cold-table");
    expect(l?.text).toMatch(/courtesies/i);
  });

  it("Marked cell lands canonical 'fairly … not predictably' canon (echoes signature welcome)", () => {
    const l = VARIANT_LINES.find(
      (x) =>
        x.lineId === "degen.variant.pacifist.marked.unpredictable_courtesy",
    );
    expect(l?.text).toMatch(/play you fairly/i);
    expect(l?.text).toMatch(/not play you predictably/i);
    // Tell #4 rule-recited-then-broken: he cites his own welcome
    // canon and then makes the canon a kindness rather than a threat.
    expect(l?.text).toMatch(/courtesy/i);
  });

  it("Citation-holder cell canonically refuses the call (counter-archetype to All-in)", () => {
    const l = VARIANT_LINES.find(
      (x) =>
        x.lineId === "degen.variant.pacifist.citation_holder.advanced_restraint",
    );
    expect(l?.text).toMatch(/I could call\. I am not going to/);
  });

  it("Ne-Yon-kin cell lands canonical 'company is the stake' loneliness-adjacent register", () => {
    const l = VARIANT_LINES.find(
      (x) =>
        x.lineId === "degen.variant.pacifist.ne_yon_kin.shared_restraint",
    );
    expect(l?.requiresTrustBand).toBe("Ne-Yon-kin");
    expect(l?.text).toMatch(/company is the stake/i);
  });

  it("Pacifist Cold/Recognized/Marked cells gate on aggression-axis low magnitudes", () => {
    const lowAggressionGated = [
      "degen.variant.pacifist.cold.gentle_at_open",
      "degen.variant.pacifist.recognized.refuses_to_predict",
      "degen.variant.pacifist.marked.unpredictable_courtesy",
    ];
    for (const id of lowAggressionGated) {
      const l = VARIANT_LINES.find((x) => x.lineId === id);
      expect(l?.playerAxisGate?.axis, id).toBe("aggression");
      // canonical low-aggression magnitudes (negative side of the
      // axis triggers Pacifist register)
      const mags = l?.playerAxisGate?.magnitudes ?? [];
      expect(mags.some((m) => m.includes("negative")), id).toBe(true);
    }
  });
});

describe("Citation-issuer archetype × {Cold, Marked, Citation-holder, Ne-Yon-kin}", () => {
  const citationIds = [
    "degen.variant.citation.cold.first_filing",
    "degen.variant.citation.marked.deeper_taxonomy",
    "degen.variant.citation.citation_holder.player_is_a_filing",
    "degen.variant.citation.ne_yon_kin.archive_as_care",
  ];

  it("ships all 4 new Citation-issuer cells", () => {
    for (const id of citationIds) {
      expect(VARIANT_LINES.find((l) => l.lineId === id), id).toBeDefined();
    }
  });

  it("Cold cell lands canonical 3-heading filing (hungry/curious/looking-for-someone)", () => {
    const l = VARIANT_LINES.find(
      (x) => x.lineId === "degen.variant.citation.cold.first_filing",
    );
    expect(l?.text).toMatch(/hungry, curious, and looking-for-someone/i);
  });

  it("Marked cell canonically lists 3 indices and CAPS punchline noun", () => {
    const l = VARIANT_LINES.find(
      (x) => x.lineId === "degen.variant.citation.marked.deeper_taxonomy",
    );
    expect(l?.text).toMatch(/three indices/i);
    expect(l?.text).toMatch(/wagers/i);
    expect(l?.text).toMatch(/tells/i);
    expect(l?.text).toMatch(/names/i);
    // §1.3 canonical CAPS-on-punchline-noun
    expect(l?.text).toMatch(/LISTENING/);
  });

  it("Citation-holder cell lands meta-canonical 'you ARE a filing'", () => {
    const l = VARIANT_LINES.find(
      (x) =>
        x.lineId ===
        "degen.variant.citation.citation_holder.player_is_a_filing",
    );
    expect(l?.text).toMatch(/You ARE a filing/);
  });

  it("Ne-Yon-kin cell lands canonical 'archive-as-care' register + Seer reference", () => {
    const l = VARIANT_LINES.find(
      (x) => x.lineId === "degen.variant.citation.ne_yon_kin.archive_as_care",
    );
    expect(l?.requiresTrustBand).toBe("Ne-Yon-kin");
    expect(l?.text).toMatch(/closest thing to a friendship/i);
    expect(l?.text).toMatch(/Seer/);
    expect(l?.text).toMatch(/how I remember you/i);
  });
});

describe("Ne-Yon-aleatory archetype × {Cold, Recognized, Citation-holder, Ne-Yon-kin}", () => {
  const aleatoryIds = [
    "degen.variant.aleatory.cold.suppressed",
    "degen.variant.aleatory.recognized.dice_open",
    "degen.variant.aleatory.citation_holder.full_disclosure",
    "degen.variant.aleatory.ne_yon_kin.dice_are_choosing",
  ];

  it("ships all 4 new Ne-Yon-aleatory cells", () => {
    for (const id of aleatoryIds) {
      expect(VARIANT_LINES.find((l) => l.lineId === id), id).toBeDefined();
    }
  });

  it("Cold cell canonically suppresses the dice (pre-Bench-Partner gate)", () => {
    const l = VARIANT_LINES.find(
      (x) => x.lineId === "degen.variant.aleatory.cold.suppressed",
    );
    expect(l?.requiresTrustBand).toBe("Cold-table");
    expect(l?.text).toMatch(/I am not letting them speak/i);
    expect(l?.text).toMatch(/haven't earned the dice/i);
  });

  it("Recognized cell opens the dice (canonical 'three doors' aleatory)", () => {
    const l = VARIANT_LINES.find(
      (x) => x.lineId === "degen.variant.aleatory.recognized.dice_open",
    );
    expect(l?.text).toMatch(/three doors/i);
  });

  it("Citation-holder cell lands canonical full-disclosure aleatory register", () => {
    const l = VARIANT_LINES.find(
      (x) =>
        x.lineId === "degen.variant.aleatory.citation_holder.full_disclosure",
    );
    expect(l?.text).toMatch(/full canonical aleatory/i);
    expect(l?.text).toMatch(/interpretation is the part you owe yourself/i);
  });

  it("Ne-Yon-kin cell lands canonical 'dice ARE the choosing' Ascended register", () => {
    const l = VARIANT_LINES.find(
      (x) =>
        x.lineId === "degen.variant.aleatory.ne_yon_kin.dice_are_choosing",
    );
    expect(l?.requiresTrustBand).toBe("Ne-Yon-kin");
    expect(l?.text).toMatch(/dice ARE the choosing/);
  });
});

describe("Ethics-committee-defendant archetype × {Cold, Marked-five, Citation-holder, Ne-Yon-kin}", () => {
  const ethicsIds = [
    "degen.variant.ethics.cold.three_open_citations",
    "degen.variant.ethics.marked.citation_five",
    "degen.variant.ethics.citation_holder.peer_defense",
    "degen.variant.ethics.ne_yon_kin.citations_dont_matter",
  ];

  it("ships all 4 new Ethics-committee-defendant cells", () => {
    for (const id of ethicsIds) {
      expect(VARIANT_LINES.find((l) => l.lineId === id), id).toBeDefined();
    }
  });

  it("Cold cell lands canonical 'three open citations' first-mention", () => {
    const l = VARIANT_LINES.find(
      (x) => x.lineId === "degen.variant.ethics.cold.three_open_citations",
    );
    expect(l?.text).toMatch(/three open/i);
    expect(l?.text).toMatch(/Seer/);
    expect(l?.text).toMatch(/filing is the joke/i);
  });

  it("Marked variant lands canonical 'citation five' (escalation past the existing 'citation four')", () => {
    const l = VARIANT_LINES.find(
      (x) => x.lineId === "degen.variant.ethics.marked.citation_five",
    );
    expect(l?.text).toMatch(/Citation five/);
    // canonical Marked-band gating (the existing reactive citation
    // four uses seer_confidant_band_reached; citation five is the
    // canonical recurring background-gag, band-gated rather than
    // event-triggered)
    expect(l?.requiresTrustBand).toBe("Marked");
    // §1.3 CAPS-on-punchline-noun
    expect(l?.text).toMatch(/PUNISHING/);
  });

  it("Citation-holder cell extends the citation taxonomy to the player", () => {
    const l = VARIANT_LINES.find(
      (x) => x.lineId === "degen.variant.ethics.citation_holder.peer_defense",
    );
    expect(l?.text).toMatch(/eligible to be cited/i);
    expect(l?.text).toMatch(/Seer files everyone/i);
  });

  it("Ne-Yon-kin cell lands canonical 'citations don't matter' + 'arguing is the friendship' register", () => {
    const l = VARIANT_LINES.find(
      (x) =>
        x.lineId === "degen.variant.ethics.ne_yon_kin.citations_dont_matter",
    );
    expect(l?.requiresTrustBand).toBe("Ne-Yon-kin");
    expect(l?.text).toMatch(/citations don't matter/i);
    expect(l?.text).toMatch(/arguing is the friendship/i);
    expect(l?.text).toMatch(/first system\s+degraded/i);
  });
});

describe("§1.4 forbidden vocabulary protections (variant grid)", () => {
  const allText = VARIANT_LINES.map((l) => l.text).join(" ");

  it("§1.4: NO 'fair' (the idea offends him) — except canonical 'fairly' echo in Marked Pacifist", () => {
    // Canonical exception: §1.4 forbids "fair" (the standalone moral
    // claim); "fairly" as adverb is permitted because it canonically
    // refers back to the welcome-line "I will play you fairly."
    // Test enforces no standalone "fair" usage.
    expect(allText).not.toMatch(/\bfair\b/i);
  });

  it("§1.4: NO standalone 'sorry' (15,000-year apology canon)", () => {
    expect(allText).not.toMatch(/\bI('m| am) sorry\b/i);
    expect(allText).not.toMatch(/\bSorry\b/);
  });

  it("§1.4: NO 'forever' (entropy canon)", () => {
    expect(allText).not.toMatch(/\bforever\b/i);
  });

  it("§1.4: NO religious vocabulary (soul / salvation / sin)", () => {
    expect(allText).not.toMatch(/\b(soul|salvation|sin)\b/i);
  });

  it("§1.4: NO war metaphors (battle / weapon / siege / warrior)", () => {
    expect(allText).not.toMatch(/\b(battle|weapon|siege|warrior)\b/i);
  });

  it("§1.4: NO engineering metaphors (circuit / wire / gear / lever)", () => {
    expect(allText).not.toMatch(/\b(circuit|wire|gear|lever)\b/i);
  });

  it("§1.4: NO biological metaphors (blood / bone / sinew / nerve)", () => {
    expect(allText).not.toMatch(/\b(blood|bone|sinew|nerve)\b/i);
  });
});

describe("§1.7 silence-shape protections (variant grid)", () => {
  const allText = VARIANT_LINES.map((l) => l.text).join(" ");

  it("'Mostly takes' leitmotif NOT re-used in variant grid (§1.4 deploy-once canon)", () => {
    // Already deployed once in ask_degen_why_smile; canonical not-twice
    // rule applies across the entire bank surface.
    expect(allText).not.toMatch(/Mostly takes/);
  });

  it("Pre-Ne-Yon-kin variant lines name ONLY Seer (Enigma not invoked here, canonical)", () => {
    const preKinLines = VARIANT_LINES.filter(
      (l) => l.requiresTrustBand !== "Ne-Yon-kin",
    );
    const preKinText = preKinLines.map((l) => l.text).join(" ");
    // Other Ne-Yons (Architect / Antiquarian) must NOT be named
    // pre-Ne-Yon-kin.
    expect(preKinText).not.toMatch(/\bArchitect\b/);
    expect(preKinText).not.toMatch(/\bAntiquarian\b/);
  });

  it("loneliness-close register canonically only in Ne-Yon-kin band", () => {
    // The canonical "I run this casino because it means I'm never
    // alone" register is reserved for Ne-Yon-kin band only. Test
    // that no pre-Ne-Yon-kin line uses the canonical anchor.
    const preKinLines = VARIANT_LINES.filter(
      (l) => l.requiresTrustBand !== "Ne-Yon-kin",
    );
    const preKinText = preKinLines.map((l) => l.text).join(" ");
    expect(preKinText).not.toMatch(/never alone/i);
    expect(preKinText).not.toMatch(/I'm not alone/i);
  });
});

describe("Trust-band coverage across the grid", () => {
  it("every band has at least 2 archetype variants represented (counting prior bank cells)", () => {
    // Phase 6c.1 part 2 fills cells; the prior bank already covered
    // Cold-table (signature/welcome) + Recognized (data_source) +
    // Marked (neyon_roster_canon, trade_empire) + Ne-Yon-kin
    // (acknowledgment). Citation-holder was previously empty; this
    // chunk fills it.
    const bands = ["Cold-table", "Recognized", "Marked", "Citation-holder", "Ne-Yon-kin"];
    for (const band of bands) {
      const linesOnBand = VARIANT_LINES.filter(
        (l) => l.requiresTrustBand === band,
      );
      expect(linesOnBand.length, `band ${band} variant cells`).toBeGreaterThanOrEqual(2);
    }
  });

  it("Citation-holder band (previously empty) is now populated by ≥4 variant cells", () => {
    const citationHolder = VARIANT_LINES.filter(
      (l) => l.requiresTrustBand === "Citation-holder",
    );
    expect(citationHolder.length).toBeGreaterThanOrEqual(4);
  });

  it("Ne-Yon-kin band has ≥5 variant cells (one per archetype)", () => {
    const kin = VARIANT_LINES.filter(
      (l) => l.requiresTrustBand === "Ne-Yon-kin",
    );
    expect(kin.length).toBeGreaterThanOrEqual(5);
  });
});
