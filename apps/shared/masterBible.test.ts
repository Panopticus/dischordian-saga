import { describe, it, expect } from "vitest";
import { ALBUM_REGISTRY } from "./albumRegistry";
import { WBG_TRACKS } from "./westByGodTracks";
import { ALBUM_MEME_SCRIPTS } from "./albumMemeScripts";
import { BROADCAST_LIBRARY } from "./broadcastLibrary";
import { SONG_TRIGGER_MAP } from "./songTriggerMap";
import { LOREDEX_SONG_MAP } from "./loredexSongMap";
import sihAlbumAudio from "./silenceInHeavenAlbumAudio.json";
import { JOURNAL_ENTRIES } from "./journalEntries";
import { COMPANION_COMMENTS } from "./companionComments";
import { AGE_OF_PRIVACY_VOTES, AGE_OF_PROPHECY_VOTES } from "./epochWitnessVotes";
import { AGE_OF_INSURGENCY_VOTES, AGE_OF_REVELATION_VOTES, FALL_OF_REALITY_VOTES } from "./epochWitnessVotesLate";
import { EPOCH_ARCHETYPES } from "./epochArchetypes";
import { SHADOW_TONGUE_UI_EDITS, SHADOW_TONGUE_LOREDEX_EDITS, SHADOW_TONGUE_POWER_TIERS } from "./shadowTongueDictionary";
import { EPOCH_UNLOCK_TABLE } from "./epochUnlockTable";
import { EPOCH_COMPANION_REACTIONS } from "./companionEpochDialogs";

const ALL_EPOCH_VOTES = [...AGE_OF_PRIVACY_VOTES, ...AGE_OF_PROPHECY_VOTES, ...AGE_OF_INSURGENCY_VOTES, ...AGE_OF_REVELATION_VOTES, ...FALL_OF_REALITY_VOTES];

describe("Master Production Bible", () => {
  describe("album registry", () => {
    it("has 5 albums", () => { expect(ALBUM_REGISTRY).toHaveLength(5); });
    it("Silence in Heaven has 37 tracks", () => { expect(ALBUM_REGISTRY.find(a => a.id === "silence-in-heaven")?.trackCount).toBe(37); });
    it("West By God has 10 tracks", () => { expect(ALBUM_REGISTRY.find(a => a.id === "west-by-god")?.trackCount).toBe(10); });
  });

  describe("West By God", () => {
    it("has 10 tracks", () => { expect(WBG_TRACKS).toHaveLength(10); });
    it("every track has a Kling prompt", () => { for (const t of WBG_TRACKS) expect(t.klingPrompt).toBeTruthy(); });
    it("every track has a Seedance motion", () => { for (const t of WBG_TRACKS) expect(t.seedanceMotion).toBeTruthy(); });
  });

  describe("meme scripts", () => {
    it("has 8 scripts (intro+outro for 4 albums)", () => { expect(ALBUM_MEME_SCRIPTS).toHaveLength(8); });
    it("every album has both intro and outro", () => {
      const albums = new Set(ALBUM_MEME_SCRIPTS.map(s => s.albumId));
      for (const a of albums) {
        expect(ALBUM_MEME_SCRIPTS.filter(s => s.albumId === a && s.type === "intro")).toHaveLength(1);
        expect(ALBUM_MEME_SCRIPTS.filter(s => s.albumId === a && s.type === "outro")).toHaveLength(1);
      }
    });
  });

  describe("broadcast library", () => {
    it("has 30 interruptions", () => { expect(BROADCAST_LIBRARY).toHaveLength(30); });
    it("exactly one is forced", () => { expect(BROADCAST_LIBRARY.filter(b => b.forced)).toHaveLength(1); });
    it("first one is forced", () => { expect(BROADCAST_LIBRARY[0].forced).toBe(true); });
  });

  describe("song trigger map", () => {
    it("has 12+ triggers", () => { expect(SONG_TRIGGER_MAP.length).toBeGreaterThanOrEqual(12); });
  });

  describe("loredex song map", () => {
    it("has 20 links", () => { expect(LOREDEX_SONG_MAP).toHaveLength(20); });
    it("every link has a loredexId and songId", () => {
      for (const l of LOREDEX_SONG_MAP) { expect(l.loredexId).toBeTruthy(); expect(l.songId).toBeTruthy(); }
    });
    it("every silence-in-heaven entry's songId resolves to a real album manifest slug", () => {
      // Wiring invariant: a loredex→song link is "frame without wiring" if
      // the slug doesn't actually exist in the album audio catalog. This
      // test makes the resolution lookup that real consumers will make.
      const sihSlugs = new Set(
        (sihAlbumAudio as { tracks: { slug: string }[] }).tracks.map(t => t.slug),
      );
      const unresolved = LOREDEX_SONG_MAP
        .filter(l => l.album === "silence-in-heaven")
        .filter(l => !sihSlugs.has(l.songId));
      expect(unresolved).toEqual([]);
    });
  });

  describe("journal entries", () => {
    it("has 5+ entries", () => { expect(JOURNAL_ENTRIES.length).toBeGreaterThanOrEqual(5); });
    it("every entry has text and audio dialog id", () => {
      for (const e of JOURNAL_ENTRIES) { expect(e.textContent).toBeTruthy(); expect(e.audioDialogId).toBeTruthy(); }
    });
  });

  describe("companion comments", () => {
    it("has 15+ comments", () => { expect(COMPANION_COMMENTS.length).toBeGreaterThanOrEqual(15); });
    it("covers both Elara and Human", () => {
      expect(COMPANION_COMMENTS.some(c => c.speaker === "elara")).toBe(true);
      expect(COMPANION_COMMENTS.some(c => c.speaker === "human")).toBe(true);
    });
  });
});

describe("Epoch Witness System", () => {
  it("has ~40 total votes across 5 epochs", () => {
    expect(ALL_EPOCH_VOTES.length).toBeGreaterThanOrEqual(25);
  });

  it("vote ids are globally unique", () => {
    const ids = ALL_EPOCH_VOTES.map(v => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every vote has at least 3 options", () => {
    for (const v of ALL_EPOCH_VOTES) expect(v.options.length).toBeGreaterThanOrEqual(3);
  });

  it("every vote has a connected song", () => {
    for (const v of ALL_EPOCH_VOTES) expect(v.connectedSong).toBeTruthy();
  });

  it("epoch closers are marked", () => {
    const closers = ALL_EPOCH_VOTES.filter(v => v.isEpochCloser);
    expect(closers.length).toBeGreaterThanOrEqual(4);
  });

  it("has 7 archetypes", () => { expect(EPOCH_ARCHETYPES).toHaveLength(7); });

  it("Shadow Tongue has 5 power tiers", () => { expect(SHADOW_TONGUE_POWER_TIERS).toHaveLength(5); });

  it("Shadow Tongue has 10+ UI edits", () => { expect(Object.keys(SHADOW_TONGUE_UI_EDITS).length).toBeGreaterThanOrEqual(10); });

  it("unlock table has 20+ entries", () => { expect(EPOCH_UNLOCK_TABLE.length).toBeGreaterThanOrEqual(20); });

  it("companion epoch dialogs has 15+ reactions", () => { expect(EPOCH_COMPANION_REACTIONS.length).toBeGreaterThanOrEqual(15); });
});
