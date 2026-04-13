/* Silence in Heaven — Loredex parity tests.
 *
 * The 37-track album ships as 37 canonical `type: "song"` Loredex entries
 * (`song_sih_1` … `song_sih_37`) in `apps/client/src/data/loredex-data.json`.
 * These tests guard against regression:
 *  - exactly 37 entries
 *  - contiguous track_number 1..37
 *  - every entry has a playable audio_url matching the album audio manifest
 *  - names and durations match the manifest exactly
 *  - 18 are kind:"song" (even positions), 19 are kind:"dialog" (odd positions)
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import albumAudio from "./silenceInHeavenAlbumAudio.json";

interface LoredexEntry {
  id: string;
  type: string;
  name: string;
  album?: string;
  track_number?: number;
  kind?: "song" | "dialog";
  audio_url?: string;
  duration_ms?: number;
}

const dataPath = resolve(__dirname, "../client/src/data/loredex-data.json");
const raw = JSON.parse(readFileSync(dataPath, "utf-8"));
const entries = raw.entries as LoredexEntry[];
const sih = entries
  .filter(e => e.type === "song" && e.album === "Silence in Heaven")
  .sort((a, b) => (a.track_number ?? 0) - (b.track_number ?? 0));

const manifest = albumAudio as {
  tracks: {
    trackNumber: number;
    title: string;
    kind: "song" | "dialog";
    durationMs: number;
    audioUrl: string;
  }[];
};

describe("Silence in Heaven Loredex parity", () => {
  it("has exactly 37 song entries on the album", () => {
    expect(sih).toHaveLength(37);
  });

  it("has contiguous track_number 1..37", () => {
    for (let i = 0; i < 37; i++) {
      expect(sih[i].track_number).toBe(i + 1);
    }
  });

  it("every entry has a stable song_sih_N id", () => {
    for (let i = 0; i < 37; i++) {
      expect(sih[i].id).toBe(`song_sih_${i + 1}`);
    }
  });

  it("every entry has an https audio_url pointing at silence-in-heaven", () => {
    for (const e of sih) {
      expect(e.audio_url).toMatch(/^https:\/\//);
      expect(e.audio_url).toContain("silence-in-heaven");
    }
  });

  it("18 entries are kind:'song', 19 are kind:'dialog'", () => {
    const songs = sih.filter(e => e.kind === "song");
    const dialog = sih.filter(e => e.kind === "dialog");
    expect(songs).toHaveLength(18);
    expect(dialog).toHaveLength(19);
  });

  it("odd track_numbers are dialog, even are songs", () => {
    for (const e of sih) {
      if ((e.track_number ?? 0) % 2 === 0) {
        expect(e.kind).toBe("song");
      } else {
        expect(e.kind).toBe("dialog");
      }
    }
  });

  it("names and audio_urls match the album audio manifest exactly", () => {
    for (let i = 0; i < 37; i++) {
      expect(sih[i].name).toBe(manifest.tracks[i].title);
      expect(sih[i].audio_url).toBe(manifest.tracks[i].audioUrl);
      expect(sih[i].duration_ms).toBe(manifest.tracks[i].durationMs);
    }
  });

  it("no other top-level song entry claims album 'Silence in Heaven'", () => {
    const stragglers = entries.filter(
      e =>
        e.type === "song" &&
        e.album === "Silence in Heaven" &&
        !(e.id ?? "").startsWith("song_sih_"),
    );
    expect(stragglers).toHaveLength(0);
  });

  it("every track_number is unique", () => {
    const nums = sih.map(e => e.track_number);
    expect(new Set(nums).size).toBe(nums.length);
  });

  it("opens with 'In the Beginning was the Word' and closes with 'The Story is Yours Now'", () => {
    expect(sih[0].name).toBe("In the Beginning was the Word");
    expect(sih[36].name).toBe("The Story is Yours Now");
  });

  it("title track 'Silence in Heaven' is at track_number 24", () => {
    const title = sih.find(e => e.name === "Silence in Heaven");
    expect(title?.track_number).toBe(24);
    expect(title?.kind).toBe("song");
  });
});
