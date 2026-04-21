import { describe, expect, it } from "vitest";

import { DGRS_LIONS_CLUB_MEMBERSHIP_ID } from "../lionsClub";
import {
  IRON_CLAD_LIONS_EXTENDED_FELLOWSHIP,
  IRON_CLAD_LIONS_FACTION,
  IRON_CLAD_LIONS_FOUNDING_NARRATIVE,
  IRON_CLAD_LIONS_NAMED_MEMBERS,
  IRON_CLAD_LIONS_REAL_WORLD_SERVICE_MESSAGE,
  IRON_CLAD_LIONS_RECRUITERS,
  IRON_CLAD_LIONS_RENTAL_TERMS,
  IRON_CLAD_LIONS_VESSEL,
  IRON_LION_CARD_IDS,
  JERICHO_JONES_CARD_ID,
} from "./ironCladLions";

describe("IRON_CLAD_LIONS_FACTION", () => {
  it("grounds membership in the real DGRS Lions Club org id", () => {
    expect(IRON_CLAD_LIONS_FACTION.requiresMembershipId).toBe(
      DGRS_LIONS_CLUB_MEMBERSHIP_ID,
    );
  });

  it("anchors to the canonical Iron Lion card ids", () => {
    expect(IRON_CLAD_LIONS_FACTION.canonicalCardIds).toBe(IRON_LION_CARD_IDS);
    expect(IRON_LION_CARD_IDS.seasonOneSignature).toBe("s1_char_010_iron_lion");
    expect(IRON_LION_CARD_IDS.seasonOneAlternate).toBe("s1_char_105_iron_lion");
  });

  it("exposes founding, recruiters, flagship, and named members on the top-level faction", () => {
    expect(IRON_CLAD_LIONS_FACTION.founding).toBe(
      IRON_CLAD_LIONS_FOUNDING_NARRATIVE,
    );
    expect(IRON_CLAD_LIONS_FACTION.recruiters).toBe(IRON_CLAD_LIONS_RECRUITERS);
    expect(IRON_CLAD_LIONS_FACTION.flagship).toBe(IRON_CLAD_LIONS_VESSEL);
    expect(IRON_CLAD_LIONS_FACTION.namedMembers).toBe(
      IRON_CLAD_LIONS_NAMED_MEMBERS,
    );
  });
});

describe("IRON_CLAD_LIONS_FOUNDING_NARRATIVE", () => {
  it("cites the Iron Lion's last stand at Veridian VI", () => {
    expect(IRON_CLAD_LIONS_FOUNDING_NARRATIVE.inspiration.battle).toBe(
      "The Last Stand on Veridian VI",
    );
    expect(IRON_CLAD_LIONS_FOUNDING_NARRATIVE.inspiration.yearAA).toBe(17_026);
  });

  it("anchors the inspiration to the canonical Iron Lion card id", () => {
    expect(IRON_CLAD_LIONS_FOUNDING_NARRATIVE.inspiration.personCardId).toBe(
      IRON_LION_CARD_IDS.seasonOneSignature,
    );
  });

  it("preserves the canonical epitaph verbatim", () => {
    expect(IRON_CLAD_LIONS_FOUNDING_NARRATIVE.inspiration.epitaph).toContain(
      "stands in front of it",
    );
  });

  it("frames the mission as opposition to darkness", () => {
    expect(IRON_CLAD_LIONS_FOUNDING_NARRATIVE.mission).toMatch(
      /rising tide of darkness/i,
    );
  });
});

describe("IRON_CLAD_LIONS_RECRUITERS", () => {
  it("names the Enigma and the Dreamer as the two Ne-Yon founders", () => {
    const names = IRON_CLAD_LIONS_RECRUITERS.map((r) => r.name);
    expect(names).toContain("the Enigma");
    expect(names).toContain("the Dreamer");
  });

  it("marks every recruiter as a Ne-Yon affiliate", () => {
    for (const r of IRON_CLAD_LIONS_RECRUITERS) {
      expect(r.neYonAffiliate).toBe(true);
    }
  });

  it("cites canon references so writers can trace each dossier", () => {
    for (const r of IRON_CLAD_LIONS_RECRUITERS) {
      expect(r.canonReference).toMatch(/LORE_BIBLE\.md/);
    }
  });
});

describe("IRON_CLAD_LIONS_VESSEL", () => {
  it("identifies the Heart of Time as the flagship", () => {
    expect(IRON_CLAD_LIONS_VESSEL.name).toBe("Heart of Time");
  });

  it("records the canon timeline — stolen in 15,306 A.A., reappeared in 101,001 A.A.", () => {
    expect(IRON_CLAD_LIONS_VESSEL.timeline.stolenYearAA).toBe(15_306);
    expect(IRON_CLAD_LIONS_VESSEL.timeline.reappearedYearAA).toBe(101_001);
  });

  it("credits the Sorcerer as the former owner, not the Iron Clad Lions", () => {
    expect(IRON_CLAD_LIONS_VESSEL.formerOwner).toBe("the Sorcerer");
  });

  it("describes the ship as the golden eye-vessel with the green crystal (canon: they are the same ship)", () => {
    expect(IRON_CLAD_LIONS_VESSEL.summary).toContain(
      "golden spaceship shaped like an eye",
    );
    expect(IRON_CLAD_LIONS_VESSEL.summary).toContain("green crystal");
  });
});

describe("IRON_CLAD_LIONS_NAMED_MEMBERS", () => {
  it("lists Jericho Jones as the first Potential to take the oath directly", () => {
    const jericho = IRON_CLAD_LIONS_NAMED_MEMBERS.find(
      (m) => m.cardId === JERICHO_JONES_CARD_ID,
    );
    expect(jericho).toBeDefined();
    expect(jericho?.rank).toBe("first-potential");
    expect(jericho?.name).toBe("Jericho Jones");
  });

  it("ties Jericho's backstory to Thaloria + Akai Shi + the golden eye-ship", () => {
    const jericho = IRON_CLAD_LIONS_NAMED_MEMBERS.find(
      (m) => m.cardId === JERICHO_JONES_CARD_ID,
    );
    expect(jericho?.role).toContain("Thaloria");
    expect(jericho?.role).toContain("Akai Shi");
    expect(jericho?.role).toContain("golden spaceship shaped like an eye");
  });
});

describe("IRON_CLAD_LIONS_EXTENDED_FELLOWSHIP", () => {
  it("defines the fellowship as everyone aligned with the Dreamer/Enigma/Potentials", () => {
    expect(IRON_CLAD_LIONS_EXTENDED_FELLOWSHIP.summary.toLowerCase()).toContain(
      "creed",
    );
    expect(IRON_CLAD_LIONS_EXTENDED_FELLOWSHIP.inheritors.length).toBeGreaterThan(
      0,
    );
  });

  it("names the three inheritor groups", () => {
    const concatenated = IRON_CLAD_LIONS_EXTENDED_FELLOWSHIP.inheritors.join(
      " || ",
    );
    expect(concatenated).toMatch(/Potentials/);
    expect(concatenated).toMatch(/Dreamer/);
    expect(concatenated).toMatch(/Enigma/);
  });
});

describe("IRON_CLAD_LIONS_REAL_WORLD_SERVICE_MESSAGE", () => {
  it("is explicit that the chapter is real Lions Clubs International", () => {
    expect(IRON_CLAD_LIONS_REAL_WORLD_SERVICE_MESSAGE).toContain(
      "Lions Clubs International",
    );
  });

  it("is explicit that good in the game translates to good in the world", () => {
    expect(IRON_CLAD_LIONS_REAL_WORLD_SERVICE_MESSAGE).toMatch(
      /real world/i,
    );
    expect(IRON_CLAD_LIONS_REAL_WORLD_SERVICE_MESSAGE).toMatch(/LCIF/);
  });
});

describe("IRON_CLAD_LIONS_RENTAL_TERMS", () => {
  it("preserves the returns-on-lapse + no-trading rules that gate the armor", () => {
    expect(IRON_CLAD_LIONS_RENTAL_TERMS.returnsOnLapse).toBe(true);
    expect(IRON_CLAD_LIONS_RENTAL_TERMS.noNamedArmorTrading).toBe(true);
    expect(IRON_CLAD_LIONS_RENTAL_TERMS.namesEngravedAtRenewal).toBe(true);
  });
});
