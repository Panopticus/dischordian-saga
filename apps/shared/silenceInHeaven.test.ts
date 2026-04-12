import { describe, it, expect } from "vitest";
import { ALL_SIH_TRACKS } from "./slideshowData/silence-in-heaven/index";
import { SIH_TRACKLIST, SIH_NARRATORS, SIH_PROLOGUE, SIH_INTER_TRACK_DIALOG } from "./silenceInHeavenTracklist";
import { validateSlideshow } from "./songSlideshow";

describe("Silence in Heaven", () => {
  it("has 18 tracks in the tracklist", () => {
    expect(SIH_TRACKLIST).toHaveLength(18);
  });

  it("has 18 track data files", () => {
    expect(ALL_SIH_TRACKS).toHaveLength(18);
  });

  it("track ids match between tracklist and data files", () => {
    for (let i = 0; i < 18; i++) {
      expect(ALL_SIH_TRACKS[i].id).toBe(SIH_TRACKLIST[i].id);
    }
  });

  it("every track has at least one frame", () => {
    for (const track of ALL_SIH_TRACKS) {
      expect(track.frames.length).toBeGreaterThan(0);
    }
  });

  it("every frame has a klingPrompt", () => {
    for (const track of ALL_SIH_TRACKS) {
      for (const frame of track.frames) {
        expect(frame.klingPrompt).toBeTruthy();
      }
    }
  });

  it("tracks 01-02 have full frame sequences (7+ frames)", () => {
    expect(ALL_SIH_TRACKS[0].frames.length).toBeGreaterThanOrEqual(7);
    expect(ALL_SIH_TRACKS[1].frames.length).toBeGreaterThanOrEqual(7);
  });

  it("every track has theaterMode config", () => {
    for (const track of ALL_SIH_TRACKS) {
      expect(track.theaterMode).toBeDefined();
      expect(track.theaterMode!.themeColor).toBeTruthy();
    }
  });

  it("has 2 narrators", () => {
    expect(SIH_NARRATORS).toHaveLength(2);
    expect(SIH_NARRATORS.map(n => n.id)).toContain("antiquarian");
    expect(SIH_NARRATORS.map(n => n.id)).toContain("storyteller");
  });

  it("prologue has 4 beats ending with 'New Babylon. Goddamn.'", () => {
    expect(SIH_PROLOGUE).toHaveLength(4);
    expect(SIH_PROLOGUE[3].speaker).toBe("both");
    expect(SIH_PROLOGUE[3].line).toContain("New Babylon");
  });

  it("has inter-track dialog transitions", () => {
    expect(SIH_INTER_TRACK_DIALOG.length).toBeGreaterThan(0);
    for (const d of SIH_INTER_TRACK_DIALOG) {
      expect(d.beats.length).toBeGreaterThan(0);
    }
  });

  it("track order follows canonical v2 (New Babylon Goddamn first, All Things New last)", () => {
    expect(SIH_TRACKLIST[0].title).toBe("New Babylon Goddamn");
    expect(SIH_TRACKLIST[17].title).toBe("All Things New");
  });

  it("Revelation parallels are set for every track", () => {
    for (const t of SIH_TRACKLIST) {
      expect(t.revParallel).toBeTruthy();
    }
  });
});
