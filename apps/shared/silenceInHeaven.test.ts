import { describe, it, expect } from "vitest";
import { ALL_SIH_TRACKS } from "./slideshowData/silence-in-heaven/index";
import { SIH_TRACKLIST, SIH_NARRATORS, SIH_PROLOGUE, SIH_INTER_TRACK_DIALOG } from "./silenceInHeavenTracklist";
import { validateSlideshow } from "./songSlideshow";
import albumAudio from "./silenceInHeavenAlbumAudio.json";
import {
  SIH_SHOW_PROGRAM,
  SIH_SHOW_TOTAL_DURATION_MS,
  SIH_DIALOG_SLIDESHOWS,
  SIH_SHOW_SLIDESHOW_IDS,
  getShowStep,
  getNextShowStep,
  locateShowTime,
} from "./silenceInHeavenShow";
import { getSlideshow } from "./songSlideshows";

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

  it("every frame has an imageUrl bound to album5 CDN art", () => {
    for (const track of ALL_SIH_TRACKS) {
      for (const frame of track.frames) {
        expect(frame.imageUrl).toMatch(/\/art\/slideshows\/album5\/T\d{2}\/sih_t\d{2}_f\d{2}\.webp$/);
      }
    }
  });

  it("reduced-motion hero image is bound for every track", () => {
    for (const track of ALL_SIH_TRACKS) {
      expect(track.reducedMotionFallback.heroImageUrl).toMatch(
        /\/art\/slideshows\/album5\/T\d{2}\/sih_t\d{2}_f01\.webp$/,
      );
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

describe("Silence in Heaven — end-to-end show program", () => {
  it("has 37 ordered steps (1..37) matching the album manifest", () => {
    expect(SIH_SHOW_PROGRAM).toHaveLength(37);
    for (let i = 0; i < 37; i++) {
      expect(SIH_SHOW_PROGRAM[i].albumTrackNumber).toBe(i + 1);
    }
  });

  it("song steps carry the matching SongSlideshowDef", () => {
    for (const step of SIH_SHOW_PROGRAM) {
      if (step.kind !== "song") continue;
      expect(step.songNumber).toBeGreaterThanOrEqual(1);
      expect(step.songNumber).toBeLessThanOrEqual(18);
      expect(step.slideshow).toBe(ALL_SIH_TRACKS[step.songNumber - 1]);
      expect(step.audioUrl).toBe(step.slideshow.audioUrl);
      expect(step.durationMs).toBe(step.slideshow.durationMs);
    }
  });

  it("dialog steps default both narrators and a non-empty theme color", () => {
    for (const step of SIH_SHOW_PROGRAM) {
      if (step.kind !== "dialog") continue;
      expect(step.speakers).toEqual(["antiquarian", "storyteller"]);
      expect(step.themeColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it("the prologue step (track 1) carries the SIH_PROLOGUE beats", () => {
    const step = getShowStep(1)!;
    expect(step.kind).toBe("dialog");
    if (step.kind === "dialog") {
      expect(step.beats).toBe(SIH_PROLOGUE);
    }
  });

  it("authored inter-track interludes are wired to the right album positions", () => {
    for (const d of SIH_INTER_TRACK_DIALOG) {
      const albumPos = d.afterTrack * 2 + 1;
      const step = getShowStep(albumPos)!;
      expect(step.kind).toBe("dialog");
      if (step.kind === "dialog") {
        expect(step.beats).toBe(d.beats);
      }
    }
  });

  it("totalDurationMs sums the album manifest", () => {
    const sum = SIH_SHOW_PROGRAM.reduce((a, s) => a + s.durationMs, 0);
    expect(SIH_SHOW_TOTAL_DURATION_MS).toBe(sum);
    expect(SIH_SHOW_TOTAL_DURATION_MS).toBe((albumAudio as { totalDurationMs: number }).totalDurationMs);
  });

  it("getNextShowStep walks the program and falls off the end", () => {
    expect(getNextShowStep(1)?.albumTrackNumber).toBe(2);
    expect(getNextShowStep(36)?.albumTrackNumber).toBe(37);
    expect(getNextShowStep(37)).toBeUndefined();
  });

  it("synthesises 19 dialog slideshow defs with stable sih-dialog-<albumPos> ids", () => {
    expect(SIH_DIALOG_SLIDESHOWS).toHaveLength(19);
    const expectedIds = SIH_SHOW_PROGRAM
      .filter((s) => s.kind === "dialog")
      .map((s) => `sih-dialog-${s.albumTrackNumber}`);
    expect(SIH_DIALOG_SLIDESHOWS.map((d) => d.id)).toEqual(expectedIds);
  });

  it("every synthesised dialog slideshow validates", () => {
    for (const def of SIH_DIALOG_SLIDESHOWS) {
      expect(validateSlideshow(def)).toEqual([]);
    }
  });

  it("every synthesised dialog frame resolves to an album5 dialog background", () => {
    for (const def of SIH_DIALOG_SLIDESHOWS) {
      for (const frame of def.frames) {
        expect(frame.imageUrl).toMatch(
          /\/art\/slideshows\/album5\/bg\/sih_bg_[a-z_]+\.webp$/,
        );
      }
    }
  });

  it("SIH_SHOW_SLIDESHOW_IDS lists 37 ids in album order — 18 song ids + 19 dialog ids", () => {
    expect(SIH_SHOW_SLIDESHOW_IDS).toHaveLength(37);
    const songIds = SIH_SHOW_SLIDESHOW_IDS.filter((id) => /^sih-\d{2}$/.test(id));
    const dialogIds = SIH_SHOW_SLIDESHOW_IDS.filter((id) => id.startsWith("sih-dialog-"));
    expect(songIds).toHaveLength(18);
    expect(dialogIds).toHaveLength(19);
  });

  it("every show id resolves via getSlideshow()", () => {
    for (const id of SIH_SHOW_SLIDESHOW_IDS) {
      const def = getSlideshow(id);
      expect(def, `getSlideshow(${id}) should resolve`).toBeDefined();
      expect(def!.id).toBe(id);
    }
  });

  it("locateShowTime resolves boundaries correctly", () => {
    const first = locateShowTime(0)!;
    expect(first.step.albumTrackNumber).toBe(1);
    expect(first.offsetMs).toBe(0);

    const justBeforeSecond = locateShowTime(SIH_SHOW_PROGRAM[0].durationMs - 1)!;
    expect(justBeforeSecond.step.albumTrackNumber).toBe(1);

    const intoSecond = locateShowTime(SIH_SHOW_PROGRAM[0].durationMs + 100)!;
    expect(intoSecond.step.albumTrackNumber).toBe(2);
    expect(intoSecond.offsetMs).toBe(100);

    expect(locateShowTime(-1)).toBeNull();
    expect(locateShowTime(SIH_SHOW_TOTAL_DURATION_MS)).toBeNull();
  });
});
