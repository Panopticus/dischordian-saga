import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  PRELUDE_BEATS,
  PRELUDE_BACKFILL_ROOMS,
  PRELUDE_AMBIENT_BEDS,
  PRELUDE_BEAT_J_MUSIC,
  collectPreludeAssetPaths,
  countPreludeNewDeliveries,
  type PreludeBeatId,
} from "../shared/preludeSequence";

/* ═══════════════════════════════════════════════════════
   PRELUDE READINESS — Phase 1 media production dashboard

   Walks the authoritative PRELUDE_BEATS registry from
   apps/shared/preludeSequence.ts and reports how many of the ~107
   specified asset files exist on disk vs are still awaiting
   delivery from the media production pipeline (Nano Banana 2 for
   rooms, Seedance 2.0 for cutscenes, ElevenLabs for VO, WebM
   renders for VFX, EBU-normalized MP3s for ambient beds).

   Design intent:
   - **Structural tests MUST pass** (beat count, no duplicate ids,
     no cutscene path collisions, etc.). Any structural regression
     fails CI immediately.
   - **Existence assertions for `existingOnMain: true` assets MUST
     pass** (currently just the bridge room). These act as
     regression checks — if someone deletes a pre-existing asset
     the test catches it.
   - **Presence DASHBOARD logs** count per-category delivery
     progress but do NOT fail the test. They're informational so
     CI can stay green while the media pipeline is still running.
     When every category reaches full delivery, a future cleanup
     PR can flip the dashboards from `console.log` to `expect.fail`.

   Companion test: apps/server/preludeBibleAudit.test.ts runs the
   Bible cross-audit (checks "existing asset" claims against disk
   and VO manifests).
   ═══════════════════════════════════════════════════════ */

// apps/server/ lives two levels under repo root (matches
// task9-qa-infrastructure.test.ts's REPO_ROOT convention).
const REPO_ROOT = path.resolve(__dirname, "..", "..");

/** Resolve a repo-relative path to an absolute path on disk. */
function resolveFromRepoRoot(relativePath: string): string {
  return path.resolve(REPO_ROOT, relativePath);
}

/** Count how many of the given repo-relative paths exist on disk. */
function countPresent(paths: readonly string[]): {
  present: string[];
  missing: string[];
} {
  const present: string[] = [];
  const missing: string[] = [];
  for (const p of paths) {
    if (fs.existsSync(resolveFromRepoRoot(p))) {
      present.push(p);
    } else {
      missing.push(p);
    }
  }
  return { present, missing };
}

/* ─── STRUCTURAL TESTS — must pass ─── */

describe("Prelude sequence structural invariants", () => {
  it("has exactly 15 beats", () => {
    // The canonical Prelude is 15 beats: A, A.5, B, C, C.5, D, D.5,
    // E, F, F.5, G, H, H.5, I, J per Bible §1 Master Index.
    expect(PRELUDE_BEATS).toHaveLength(15);
  });

  it("beat ids are all unique", () => {
    const ids = PRELUDE_BEATS.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("sequenceOrder values are unique and cover 1..15", () => {
    const orders = PRELUDE_BEATS.map((b) => b.sequenceOrder).sort(
      (a, b) => a - b,
    );
    expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  });

  it("every beat has a cutscene with non-empty mp4 path and positive duration", () => {
    for (const beat of PRELUDE_BEATS) {
      expect(beat.cutscene.mp4).toMatch(/^apps\/client\/public\/videos\/prelude\/.*\.mp4$/u);
      expect(beat.cutscene.targetDurationMs).toBeGreaterThan(0);
    }
  });

  it("cutscene mp4 paths are unique across beats", () => {
    const paths = PRELUDE_BEATS.map((b) => b.cutscene.mp4);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("every beat with room: null must have inheritsRoomFrom set to a real earlier beat", () => {
    const knownIds = new Set<PreludeBeatId>(PRELUDE_BEATS.map((b) => b.id));
    const orderById = new Map(PRELUDE_BEATS.map((b) => [b.id, b.sequenceOrder]));
    for (const beat of PRELUDE_BEATS) {
      if (beat.room === null) {
        expect(beat.inheritsRoomFrom).toBeDefined();
        expect(knownIds.has(beat.inheritsRoomFrom!)).toBe(true);
        // The inherited beat must appear earlier in the sequence.
        const parentOrder = orderById.get(beat.inheritsRoomFrom!) ?? -1;
        expect(parentOrder).toBeLessThan(beat.sequenceOrder);
      }
    }
  });

  it("every inherits-room beat's parent actually has a room", () => {
    const roomByBeatId = new Map(PRELUDE_BEATS.map((b) => [b.id, b.room]));
    for (const beat of PRELUDE_BEATS) {
      if (beat.inheritsRoomFrom) {
        const parentRoom = roomByBeatId.get(beat.inheritsRoomFrom);
        expect(parentRoom).toBeTruthy();
      }
    }
  });

  it("new VO lineIds are unique across the entire Prelude", () => {
    const newLineIds: string[] = [];
    for (const beat of PRELUDE_BEATS) {
      for (const line of beat.voLines) {
        if (line.status === "new") newLineIds.push(line.lineId);
      }
    }
    expect(new Set(newLineIds).size).toBe(newLineIds.length);
  });

  it("VFX asset ids are globally unique (a vfx id may only be declared once)", () => {
    // A VFX effect with `reused: true` references a prior declaration by
    // `webmPath`, not a duplicate id. The same id must not appear twice
    // with reused:false.
    const declaredIds: string[] = [];
    for (const beat of PRELUDE_BEATS) {
      for (const vfx of beat.vfxAssets) {
        if (!vfx.reused) declaredIds.push(vfx.id);
      }
    }
    expect(new Set(declaredIds).size).toBe(declaredIds.length);
  });

  it("Prelude has exactly 2 P1 backfill rooms (armory + captains-quarters)", () => {
    expect(PRELUDE_BACKFILL_ROOMS).toHaveLength(2);
  });

  it("Prelude has exactly 3 ambient audio beds", () => {
    expect(PRELUDE_AMBIENT_BEDS).toHaveLength(3);
  });

  it("every ambient bed has a plausible LUFS loudness target", () => {
    // EBU R128 targets for broadcast are in the -14 to -27 range;
    // Bible §19.5 specifies -18, -19, -20 for the three beds.
    for (const bed of PRELUDE_AMBIENT_BEDS) {
      expect(bed.loudnessTargetLufs).toBeLessThan(0);
      expect(bed.loudnessTargetLufs).toBeGreaterThan(-30);
    }
  });

  it("Beat J music (Last Words) is tracked separately from VO", () => {
    expect(PRELUDE_BEAT_J_MUSIC).toHaveLength(1);
    expect(PRELUDE_BEAT_J_MUSIC[0].mp3).toContain("song_last_words");
  });
});

/* ─── EXISTENCE ASSERTIONS — regression checks on pre-existing assets ─── */

describe("Prelude readiness — regression checks on existing-on-main assets", () => {
  it("every room flagged existingOnMain: true actually exists on disk", () => {
    // Today this is only `room-bridge.png` / `.webp`. If this test
    // fails it means someone deleted a pre-existing asset the Prelude
    // depends on — real regression, fix immediately.
    const offenders: string[] = [];
    for (const beat of PRELUDE_BEATS) {
      if (beat.room?.existingOnMain) {
        for (const p of [beat.room.png, beat.room.webp]) {
          if (!fs.existsSync(resolveFromRepoRoot(p))) {
            offenders.push(`${beat.id}: ${p}`);
          }
        }
      }
    }
    if (offenders.length > 0) {
      expect.fail(
        `Pre-existing room asset(s) missing from disk:\n  ${offenders.join("\n  ")}`,
      );
    }
  });
});

/* ─── DELIVERY DASHBOARD — informational, never fails ─── */

describe("Prelude readiness — Phase 1 delivery dashboard", () => {
  const paths = collectPreludeAssetPaths();

  it("reports new-delivery total from countPreludeNewDeliveries()", () => {
    const total = countPreludeNewDeliveries();
    // Sanity: the Bible's §19.6 states ~61 new asset rows, but that
    // counts unique VFX effects; this count expands variants into
    // individual files and so is higher. We assert a plausible
    // floor (50) and ceiling (500) to catch accidental data drift.
    expect(total).toBeGreaterThan(50);
    expect(total).toBeLessThan(500);
    // eslint-disable-next-line no-console
    console.log(
      `[prelude readiness] Phase 1 new deliveries tracked: ${total}`,
    );
  });

  it("rooms — present / missing", () => {
    const { present, missing } = countPresent(paths.roomPngs);
    // eslint-disable-next-line no-console
    console.log(
      `[prelude readiness] rooms: ${present.length}/${paths.roomPngs.length} PNG present — ${missing.length} awaiting delivery`,
    );
    if (missing.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`  missing room PNGs:\n    ${missing.join("\n    ")}`);
    }
  });

  it("cutscenes — present / missing", () => {
    const { present, missing } = countPresent(paths.cutsceneMp4s);
    // eslint-disable-next-line no-console
    console.log(
      `[prelude readiness] cutscenes: ${present.length}/${paths.cutsceneMp4s.length} present — ${missing.length} awaiting delivery`,
    );
  });

  it("VO (new) — present / missing", () => {
    const { present, missing } = countPresent(paths.voAudioNew);
    // eslint-disable-next-line no-console
    console.log(
      `[prelude readiness] VO new: ${present.length}/${paths.voAudioNew.length} present — ${missing.length} awaiting delivery`,
    );
  });

  it("VFX (video) — present / missing", () => {
    const { present, missing } = countPresent(paths.vfxWebms);
    // eslint-disable-next-line no-console
    console.log(
      `[prelude readiness] VFX (video): ${present.length}/${paths.vfxWebms.length} present — ${missing.length} awaiting delivery`,
    );
  });

  it("VFX (code-implemented) — reports component-based effects", () => {
    // Code-implemented VFX live as React components in
    // apps/client/src/components/prelude/vfx/ rather than .webm files.
    // They're not subject to disk-presence checks; this test just logs
    // the count for the dashboard.
    // eslint-disable-next-line no-console
    console.log(
      `[prelude readiness] VFX (code): ${paths.vfxCodeImplemented.length} effects implemented in React components — no .webm files required`,
    );
  });

  it("ambient beds — present / missing", () => {
    const { present, missing } = countPresent(paths.ambientMp3s);
    // eslint-disable-next-line no-console
    console.log(
      `[prelude readiness] ambient beds: ${present.length}/${paths.ambientMp3s.length} present — ${missing.length} awaiting delivery`,
    );
  });

  it("Beat J music — present / missing", () => {
    const musicPaths = PRELUDE_BEAT_J_MUSIC.map((m) => m.mp3);
    const { present, missing } = countPresent(musicPaths);
    // eslint-disable-next-line no-console
    console.log(
      `[prelude readiness] Beat J music: ${present.length}/${musicPaths.length} present — ${missing.length} awaiting delivery (spec'd in CANON_REV_7_ORACLE_VEX_EXPANSION.md §5.6.9)`,
    );
  });
});
