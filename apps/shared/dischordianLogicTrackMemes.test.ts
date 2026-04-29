import { describe, expect, it } from "vitest";
import {
  DISCHORDIAN_LOGIC_TRACK_MEMES,
  getTrackMeme,
} from "./dischordianLogicTrackMemes";
import { ALBUM_TRANSMISSION_TRACK_ORDER } from "./albumTransmissionCursor";

const MIN_LINE_CHARS = 60;
const MAX_LINE_CHARS = 700;

describe("dischordianLogicTrackMemes", () => {
  it("authors a meme entry for every track in ALBUM_TRANSMISSION_TRACK_ORDER", () => {
    for (const trackId of ALBUM_TRANSMISSION_TRACK_ORDER) {
      expect(DISCHORDIAN_LOGIC_TRACK_MEMES[trackId]).toBeDefined();
    }
  });

  it.each(ALBUM_TRANSMISSION_TRACK_ORDER)(
    "%s has non-empty intro and outro within sane length bounds",
    (trackId) => {
      const meme = DISCHORDIAN_LOGIC_TRACK_MEMES[trackId];
      expect(meme).toBeDefined();
      if (!meme) return;
      expect(meme.intro.length).toBeGreaterThanOrEqual(MIN_LINE_CHARS);
      expect(meme.intro.length).toBeLessThanOrEqual(MAX_LINE_CHARS);
      expect(meme.outro.length).toBeGreaterThanOrEqual(MIN_LINE_CHARS);
      expect(meme.outro.length).toBeLessThanOrEqual(MAX_LINE_CHARS);
    },
  );

  it("only T01 carries firstEverIntroId (the very first words ever)", () => {
    expect(DISCHORDIAN_LOGIC_TRACK_MEMES.T01?.firstEverIntroId).toBe(
      "login_first_ever",
    );
    for (const trackId of ALBUM_TRANSMISSION_TRACK_ORDER) {
      if (trackId === "T01") continue;
      expect(
        DISCHORDIAN_LOGIC_TRACK_MEMES[trackId]?.firstEverIntroId,
      ).toBeUndefined();
    }
  });

  it("never promises a daily-login experience in The Meme's voice", () => {
    // The fictional Meme is hijacking a frequency, not running a schedule.
    // Any line that says 'every login' / 'every time you log in' / 'each
    // day' is off-character and would create a UX promise we can't keep.
    const forbidden = /every login|every time you log in|each day|daily/i;
    for (const trackId of ALBUM_TRANSMISSION_TRACK_ORDER) {
      const meme = DISCHORDIAN_LOGIC_TRACK_MEMES[trackId];
      if (!meme) continue;
      expect(meme.intro).not.toMatch(forbidden);
      expect(meme.outro).not.toMatch(forbidden);
    }
  });

  describe("getTrackMeme", () => {
    it("returns the authored meme for a known track", () => {
      const meme = getTrackMeme("T01");
      expect(meme?.trackId).toBe("T01");
      expect(meme?.intro).toContain("Malkia Ukweli");
    });

    it("returns null for an unauthored track id", () => {
      expect(getTrackMeme("T15")).toBeNull();
    });
  });
});
