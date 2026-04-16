import { describe, it, expect } from "vitest";
import {
  LOCKE_FIRST_MESSAGE,
  getLockeFirstMessageVoUrl,
} from "../client/src/components/prelude/beatHInboxMessage";

/* ═══════════════════════════════════════════════════════
   Beat H inbox message — canon invariants.

   Locks the Bible §14.5 canonical text + highlight-sentence
   target so future "small fixes" can't accidentally break
   the sentence bloom sync with the VO.
   ═══════════════════════════════════════════════════════ */

describe("Locke first message — canonical text", () => {
  it("has 8 sentences matching Bible §14.5", () => {
    expect(LOCKE_FIRST_MESSAGE.sentences).toHaveLength(8);
  });

  it("opens with the Adjudicator Locke / New Babylon identifier", () => {
    expect(LOCKE_FIRST_MESSAGE.sentences[0]).toContain("Adjudicator Locke");
    expect(LOCKE_FIRST_MESSAGE.sentences[0]).toContain("New Babylon");
  });

  it("ends with the 'End transmission.' sign-off", () => {
    const last = LOCKE_FIRST_MESSAGE.sentences[
      LOCKE_FIRST_MESSAGE.sentences.length - 1
    ];
    expect(last).toBe("End transmission.");
  });

  it("contains the canonical Kelvara lane forward-reference to Beat D", () => {
    // Bible §14.5 ties this message textually to the Beat D mission
    // board's Kelvara posting. Drift between the two breaks the
    // planted echo.
    const hasKelvara = LOCKE_FIRST_MESSAGE.sentences.some((s) =>
      s.toLowerCase().includes("kelvara"),
    );
    expect(hasKelvara).toBe(true);
  });

  it("contains the canonical 'three jobs' phrasing", () => {
    const hasThreeJobs = LOCKE_FIRST_MESSAGE.sentences.some((s) =>
      s.toLowerCase().includes("three jobs"),
    );
    expect(hasThreeJobs).toBe(true);
  });
});

describe("Locke first message — highlight sentence", () => {
  it("highlightSentenceIndex is within the sentences array", () => {
    expect(LOCKE_FIRST_MESSAGE.highlightSentenceIndex).toBeGreaterThanOrEqual(0);
    expect(LOCKE_FIRST_MESSAGE.highlightSentenceIndex).toBeLessThan(
      LOCKE_FIRST_MESSAGE.sentences.length,
    );
  });

  it("points at the 'I am watching…' sentence (Bible §18.3 canonical)", () => {
    const highlighted =
      LOCKE_FIRST_MESSAGE.sentences[LOCKE_FIRST_MESSAGE.highlightSentenceIndex];
    expect(highlighted.toLowerCase()).toContain("i am watching");
    expect(highlighted.toLowerCase()).toContain("kind of person");
  });

  it("highlightTimingPct is in (0, 1) and biased late in the VO", () => {
    expect(LOCKE_FIRST_MESSAGE.highlightTimingPct).toBeGreaterThan(0);
    expect(LOCKE_FIRST_MESSAGE.highlightTimingPct).toBeLessThanOrEqual(1);
    // The "watching" line is sentence 7 of 8, so the bloom should
    // happen comfortably past the halfway point.
    expect(LOCKE_FIRST_MESSAGE.highlightTimingPct).toBeGreaterThan(0.5);
  });
});

describe("Locke first message — metadata", () => {
  it("has the canonical voLineId", () => {
    expect(LOCKE_FIRST_MESSAGE.voLineId).toBe("locke_beat_h_first_message");
  });

  it("has the canonical sender + context", () => {
    expect(LOCKE_FIRST_MESSAGE.sender).toBe("Adjudicator Locke");
    expect(LOCKE_FIRST_MESSAGE.senderContext).toBe("New Babylon");
  });

  it("has a stable completionFlag", () => {
    expect(LOCKE_FIRST_MESSAGE.completionFlag).toMatch(/^beat_h_/);
  });
});

describe("getLockeFirstMessageVoUrl", () => {
  it("returns the manifest url when present", () => {
    const url = getLockeFirstMessageVoUrl({
      locke_beat_h_first_message: "https://example.com/locke.mp3",
    });
    expect(url).toBe("https://example.com/locke.mp3");
  });

  it("returns null when absent", () => {
    expect(getLockeFirstMessageVoUrl({})).toBeNull();
  });

  it("reads the real lockeVoManifest.json when no override", () => {
    // locke_beat_h_first_message was generated and merged via PR #49's
    // run. Smoke-test that the real manifest wires through cleanly.
    const url = getLockeFirstMessageVoUrl();
    expect(url).toBeTruthy();
    expect(url).toContain("locke_beat_h_first_message.mp3");
  });
});
