import { describe, it, expect } from "vitest";
import { ALL_SIH_TRACKS } from "./slideshowData/silence-in-heaven/index";
import { SIH_TRACKLIST, SIH_NARRATORS, SIH_PROLOGUE, SIH_INTER_TRACK_DIALOG } from "./silenceInHeavenTracklist";
import { validateSlideshow } from "./songSlideshow";
import albumAudio from "./silenceInHeavenAlbumAudio.json";

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

  it("every slideshow track has an audioUrl pointing at the CDN", () => {
    for (const track of ALL_SIH_TRACKS) {
      expect(track.audioUrl).toMatch(/^https?:\/\//);
      expect(track.audioUrl).toContain("silence-in-heaven");
    }
  });

  it("every slideshow track has a realistic durationMs (> 60s, not the 210s placeholder)", () => {
    for (const track of ALL_SIH_TRACKS) {
      expect(track.durationMs).toBeGreaterThan(60_000);
      expect(track.durationMs).not.toBe(210_000);
    }
  });

  it("last frame endMs never runs past durationMs", () => {
    for (const track of ALL_SIH_TRACKS) {
      const last = track.frames[track.frames.length - 1];
      expect(last.endMs).toBeLessThanOrEqual(track.durationMs);
    }
  });
});

describe("Silence in Heaven — 37-track album audio manifest", () => {
  const manifest = albumAudio as {
    albumId: string;
    totalDurationMs: number;
    tracks: {
      trackNumber: number;
      title: string;
      kind: "song" | "dialog";
      slug: string;
      durationMs: number;
      audioUrl: string;
    }[];
  };

  it("has albumId 'silence-in-heaven'", () => {
    expect(manifest.albumId).toBe("silence-in-heaven");
  });

  it("has exactly 37 tracks", () => {
    expect(manifest.tracks).toHaveLength(37);
  });

  it("has 18 songs and 19 dialog tracks", () => {
    const songs = manifest.tracks.filter(t => t.kind === "song");
    const dialog = manifest.tracks.filter(t => t.kind === "dialog");
    expect(songs).toHaveLength(18);
    expect(dialog).toHaveLength(19);
  });

  it("track numbers are 1..37 contiguous in array order", () => {
    for (let i = 0; i < 37; i++) {
      expect(manifest.tracks[i].trackNumber).toBe(i + 1);
    }
  });

  it("odd positions are dialog, even positions are songs", () => {
    for (const t of manifest.tracks) {
      if (t.trackNumber % 2 === 0) {
        expect(t.kind).toBe("song");
      } else {
        expect(t.kind).toBe("dialog");
      }
    }
  });

  it("every track has a non-empty audioUrl on https", () => {
    for (const t of manifest.tracks) {
      expect(t.audioUrl).toMatch(/^https:\/\//);
      expect(t.audioUrl).toContain("silence-in-heaven");
    }
  });

  it("every track has durationMs > 30s", () => {
    for (const t of manifest.tracks) {
      expect(t.durationMs).toBeGreaterThan(30_000);
    }
  });

  it("slugs are unique", () => {
    const slugs = manifest.tracks.map(t => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("total duration matches sum of tracks", () => {
    const sum = manifest.tracks.reduce((a, t) => a + t.durationMs, 0);
    expect(manifest.totalDurationMs).toBe(sum);
  });

  it("the 18 SongSlideshowDef entries reuse manifest URLs at song positions 2,4,…,36", () => {
    for (let i = 0; i < 18; i++) {
      const albumPos = (i + 1) * 2; // 2, 4, …, 36
      const manifestTrack = manifest.tracks[albumPos - 1];
      expect(manifestTrack.kind).toBe("song");
      expect(ALL_SIH_TRACKS[i].audioUrl).toBe(manifestTrack.audioUrl);
      expect(ALL_SIH_TRACKS[i].durationMs).toBe(manifestTrack.durationMs);
    }
  });

  it("the title track is at album position 24", () => {
    expect(manifest.tracks[23].title).toBe("Silence in Heaven");
    expect(manifest.tracks[23].kind).toBe("song");
  });

  it("the album opens with a prologue and closes with an outro", () => {
    expect(manifest.tracks[0].title).toBe("In the Beginning was the Word");
    expect(manifest.tracks[0].kind).toBe("dialog");
    expect(manifest.tracks[36].title).toBe("The Story is Yours Now");
    expect(manifest.tracks[36].kind).toBe("dialog");
  });
});
