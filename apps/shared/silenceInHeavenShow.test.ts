import { describe, it, expect } from "vitest";
import {
  buildSIHStepLoredexDiscoveryEvent,
  SIH_DIALOG_SLIDESHOWS,
  SIH_SHOW_PROGRAM,
  type SIHDialogShowStep,
  type SIHSongShowStep,
} from "./silenceInHeavenShow";

describe("SIH_SHOW_PROGRAM — structural invariants", () => {
  it("has 37 steps (18 songs + 19 dialog interludes)", () => {
    expect(SIH_SHOW_PROGRAM.length).toBe(37);
    const songs = SIH_SHOW_PROGRAM.filter((s) => s.kind === "song");
    const dialogs = SIH_SHOW_PROGRAM.filter((s) => s.kind === "dialog");
    expect(songs.length).toBe(18);
    expect(dialogs.length).toBe(19);
  });

  it("every dialog interlude unlocks a per-track loredex entry", () => {
    expect(SIH_DIALOG_SLIDESHOWS.length).toBe(19);
    for (const def of SIH_DIALOG_SLIDESHOWS) {
      expect(def.unlockLoredexEntry).toBeTruthy();
      expect(def.unlockLoredexEntry).toMatch(/^song_sih_\d+$/);
    }
  });
});

describe("buildSIHStepLoredexDiscoveryEvent", () => {
  const firstSong = SIH_SHOW_PROGRAM.find(
    (s): s is SIHSongShowStep => s.kind === "song",
  )!;
  const firstDialog = SIH_SHOW_PROGRAM.find(
    (s): s is SIHDialogShowStep => s.kind === "dialog",
  )!;

  it("emits the kind discriminator for the ripple engine to route on", () => {
    const event = buildSIHStepLoredexDiscoveryEvent(firstDialog, 42);
    expect(event?.kind).toBe("loredex_entry_discovered");
  });

  it("returns the per-position entryId for dialog interludes", () => {
    const event = buildSIHStepLoredexDiscoveryEvent(firstDialog, 42);
    expect(event).toEqual({
      kind: "loredex_entry_discovered",
      userId: 42,
      entryId: `song_sih_${firstDialog.albumTrackNumber}`,
      entryType: "slideshow",
      albumTrackNumber: firstDialog.albumTrackNumber,
    });
  });

  it("returns the song's own loredex entry when set on a song step", () => {
    const event = buildSIHStepLoredexDiscoveryEvent(firstSong, 42);
    if (firstSong.slideshow.unlockLoredexEntry) {
      expect(event?.entryId).toBe(firstSong.slideshow.unlockLoredexEntry);
    } else {
      expect(event).toBeNull();
    }
  });

  it("returns null when the song step has no loredex entry to unlock", () => {
    const stepWithoutEntry: SIHSongShowStep = {
      ...firstSong,
      slideshow: { ...firstSong.slideshow, unlockLoredexEntry: undefined },
    };
    expect(buildSIHStepLoredexDiscoveryEvent(stepWithoutEntry, 42)).toBeNull();
  });
});
