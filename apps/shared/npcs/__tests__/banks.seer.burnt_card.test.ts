// apps/shared/npcs/__tests__/banks.seer.burnt_card.test.ts
//
// Phase 6b.1 sub-chunk G verification — Seer burnt-card unlock surface
// (5 lines covering the canonical canon-hidden winnable path per
// the_seer.md §5.3 + §2.2).
//
// Per §5.3 the actual unlock-route is bible-deferred (SCB-1 open-
// design ticket); the canonical principle is narrative-earned-
// not-combat-earned. The 5 lines walk the canonical arc:
//   1. discovery — when the player canonically finds the card
//   2. carrying — recognition that the card is in the player's deck
//   3. pre-rematch — player approaches §4.9 with the card
//   4. win-path "Oh. You remembered." — canonical anchor per
//      dialogBank_chapters_10_12.ts:429-446
//   5. post-win "Archives not surprised" — canonical narrator-frame
//
// Validates per §1.5 + §2.3 + §5.3 canon:
//   1. 5 burnt-card lines shipped
//   2. 3 transmission surface (discovery / carrying / pre-rematch)
//      + 2 cinematic surface (win-path + post-win)
//   3. Witnessed band on every line
//   4. Canonical flag wiring: discovery → seer_burnt_card_in_deck;
//      carrying / pre-rematch / win-path gate on it; win-path sets
//      seer_burnt_card_win_path_unlocked + cross-character public
//      flag seer_burnt_card_path_completed
//   5. Canonical anchor preservations:
//      - "You opened the staff. The card was inside. You remembered
//        before I taught you how."
//      - "burnt card is in your deck" / "no longer scripted-loss"
//      - canonical pre-rematch "the I is in recording-form, as you
//        know now"
//      - canonical win-path "Oh. You remembered." (THE anchor)
//      - canonical narrator-frame "the only person in the Archives
//        who is not surprised"

import { describe, it, expect } from "vitest";
import { THE_SEER_BANK } from "../banks/the_seer";
import { CROSS_CHARACTER_REACTIONS } from "../crossCharacterReactions";

const BURNT_CARD_LINES = THE_SEER_BANK.filter((l) =>
  /\.burnt_card\./.test(l.lineId),
);

describe("Seer burnt-card unlock surface — shape", () => {
  it("ships 5 burnt-card lines (Phase 6b.1 sub-chunk G — final 6b.1 chunk)", () => {
    expect(BURNT_CARD_LINES.length).toBe(5);
  });

  it("3 transmission surface + 2 cinematic surface (canonical surface split)", () => {
    const transmission = BURNT_CARD_LINES.filter((l) =>
      l.surfaces.includes("transmission"),
    );
    const cinematic = BURNT_CARD_LINES.filter((l) =>
      l.surfaces.includes("cinematic"),
    );
    expect(transmission.length).toBe(3);
    expect(cinematic.length).toBe(2);
  });

  it("every burnt-card line gates on Witnessed trust band", () => {
    for (const l of BURNT_CARD_LINES) {
      expect(l.requiresTrustBand, l.lineId).toBe("Witnessed");
    }
  });

  it("every burnt-card line is canonically once-per-playthrough (maxPlays === 1)", () => {
    for (const l of BURNT_CARD_LINES) {
      expect(l.maxPlays, l.lineId).toBe(1);
    }
  });

  it("burnt-card lineIds are unique", () => {
    const ids = BURNT_CARD_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Burnt-card canonical flag chain", () => {
  it("discovery line gates on seer_burnt_card_discovered + sets seer_burnt_card_in_deck", () => {
    const discovery = THE_SEER_BANK.find(
      (l) => l.lineId === "seer.transmission.burnt_card.discovery",
    );
    expect(discovery?.unlockFlags).toContain("seer_burnt_card_discovered");
    expect(discovery?.setsFlags).toContain("seer_burnt_card_in_deck");
  });

  it("carrying line gates on seer_burnt_card_in_deck", () => {
    const carrying = THE_SEER_BANK.find(
      (l) => l.lineId === "seer.transmission.burnt_card.carrying",
    );
    expect(carrying?.unlockFlags).toContain("seer_burnt_card_in_deck");
  });

  it("pre-rematch line gates on seer_burnt_card_in_deck", () => {
    const pre = THE_SEER_BANK.find(
      (l) => l.lineId === "seer.transmission.burnt_card.pre_rematch",
    );
    expect(pre?.unlockFlags).toContain("seer_burnt_card_in_deck");
  });

  it("win-path 'Oh. You remembered.' sets the canonical unlock + public flags", () => {
    const win = THE_SEER_BANK.find(
      (l) =>
        l.lineId ===
        "seer.cinematic.burnt_card.win_path_oh_you_remembered",
    );
    expect(win?.unlockFlags).toContain("seer_burnt_card_in_deck");
    expect(win?.unlockFlags).toContain("seer_mechronis_rematch_won");
    expect(win?.setsFlags).toContain("seer_burnt_card_win_path_unlocked");
    expect(win?.setsPublicFlags).toContain(
      "seer_burnt_card_path_completed",
    );
  });

  it("Archives-not-surprised post-win line gates on win-path unlocked", () => {
    const post = THE_SEER_BANK.find(
      (l) =>
        l.lineId === "seer.cinematic.burnt_card.archives_not_surprised",
    );
    expect(post?.unlockFlags).toContain(
      "seer_burnt_card_win_path_unlocked",
    );
  });
});

describe("Burnt-card canonical anchor landings", () => {
  it("discovery lands canonical 'You remembered before I taught you how' anchor (§2.2)", () => {
    // Per `burnt_card_placeholder.ts` canonical flavor: "You found
    // her staff on the bench. Inside the staff was this card. You
    // remembered before she taught you how." The Seer bank line
    // self-references this canonical flavor.
    const discovery = THE_SEER_BANK.find(
      (l) => l.lineId === "seer.transmission.burnt_card.discovery",
    );
    expect(discovery?.text).toMatch(/You opened the staff/i);
    expect(discovery?.text).toMatch(/card was inside/i);
    expect(discovery?.text).toMatch(/remembered before I taught you how/i);
    expect(discovery?.text).toMatch(/recording fires/i);
  });

  it("carrying lands canonical 'no longer scripted-loss' / re-keyed anchor", () => {
    const carrying = THE_SEER_BANK.find(
      (l) => l.lineId === "seer.transmission.burnt_card.carrying",
    );
    expect(carrying?.text).toMatch(/burnt card is in your deck/i);
    expect(carrying?.text).toMatch(/no longer scripted-loss/i);
    expect(carrying?.text).toMatch(/Walk to the bench/i);
  });

  it("pre-rematch lands canonical 'I is in recording-form, as you know now' anchor", () => {
    // Cross-time-canon-self-aware register — the line presupposes
    // the player has reached the cross-time mechanic disclosures
    // (Phase 6b.1 sub-chunk E).
    const pre = THE_SEER_BANK.find(
      (l) => l.lineId === "seer.transmission.burnt_card.pre_rematch",
    );
    expect(pre?.text).toMatch(/about to play the card back/i);
    expect(pre?.text).toMatch(/the I is in recording-form/i);
    expect(pre?.text).toMatch(/recording I made for this version of you/i);
  });

  it("win-path lands the canonical 'Oh. You remembered.' anchor (THE anchor)", () => {
    // Per dialogBank_chapters_10_12.ts:429-446 — the canonical
    // shipped win-path line. The bank version is the same single-
    // sentence canonical anchor.
    const win = THE_SEER_BANK.find(
      (l) =>
        l.lineId ===
        "seer.cinematic.burnt_card.win_path_oh_you_remembered",
    );
    expect(win?.text).toBe("Oh. You remembered.");
  });

  it("post-win lands canonical 'only person in the Archives who is not surprised' narrator-frame", () => {
    const post = THE_SEER_BANK.find(
      (l) =>
        l.lineId === "seer.cinematic.burnt_card.archives_not_surprised",
    );
    expect(post?.text).toMatch(/carried the burnt card all the way back/i);
    expect(post?.text).toMatch(/she left it on/i);
    expect(post?.text).toMatch(
      /only person in the Archives who is not surprised/i,
    );
    expect(post?.text).toMatch(/she foresaw this version of you/i);
  });
});

describe("Burnt-card chunk — bible canon protections", () => {
  it("§1.3 most-load-bearing absence: NO 'destiny'/'fate'/'destined'", () => {
    for (const l of BURNT_CARD_LINES) {
      expect(l.text, l.lineId).not.toMatch(/\bdestin(y|ed)\b/i);
      expect(l.text, l.lineId).not.toMatch(/\bfate(d)?\b/i);
    }
  });

  it("§1.2 cadence rule #3: NO colon-introduced revelation pattern", () => {
    for (const l of BURNT_CARD_LINES) {
      expect(l.text, l.lineId).not.toMatch(/\bProphecy:/i);
      expect(l.text, l.lineId).not.toMatch(/\bWhat I see:/i);
    }
  });

  it("§5.3 canonical canon: discovery line names canonical 'recording fires' mechanic", () => {
    // §5.3 cross-time canon: the win-path is canonically a
    // pre-recording. The discovery line surfaces this mechanic
    // canonically.
    const discovery = THE_SEER_BANK.find(
      (l) => l.lineId === "seer.transmission.burnt_card.discovery",
    );
    expect(discovery?.text).toMatch(/recording/i);
    expect(discovery?.text).toMatch(/recorded it for the version of you/i);
  });

  it("§5.3 canonical canon: post-win line names canonical Archives-asymmetry", () => {
    // §5.3 metacommentary canon: the not-surprised is canonically
    // because-she-foresaw; the Archives are surprised because the
    // Archives are not foresighted; she was both.
    const post = THE_SEER_BANK.find(
      (l) =>
        l.lineId === "seer.cinematic.burnt_card.archives_not_surprised",
    );
    expect(post?.text).toMatch(
      /Archives are surprised because the Archives are not foresighted/i,
    );
    expect(post?.text).toMatch(/she was both/i);
  });
});

describe("Burnt-card chunk — cross-character flag wiring", () => {
  it("seer_burnt_card_path_completed has a registry entry", () => {
    const entry = CROSS_CHARACTER_REACTIONS.find(
      (r) => r.flag === "seer_burnt_card_path_completed",
    );
    expect(entry).toBeDefined();
    expect(entry?.setBy).toContain("the_seer");
  });
});
