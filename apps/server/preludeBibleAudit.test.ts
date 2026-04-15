import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  collectPreludeAssetPaths,
  PRELUDE_BEAT_J_MUSIC,
} from "../shared/preludeSequence";

/* ═══════════════════════════════════════════════════════
   PRELUDE BIBLE AUDIT — cross-check of "existing" claims

   docs/production/PRELUDE_SHIP_READY_BIBLE.md names lots of asset
   paths that it claims are "existing" (from a prior production
   run or a separate canon expansion). This test scans the Bible
   for every asset path it mentions, subtracts the known-new
   registry from apps/shared/preludeSequence.ts, and verifies
   what's left:

   - Art / video / VFX paths ending in .png/.webp/.mp4/.webm are
     verified against disk via fs.existsSync.
   - VO audio paths ending in .mp3 are verified against the
     matching `apps/shared/<speaker>VoManifest.json` file: the
     line id (the file's basename sans .mp3) must exist as a key.
   - Paths under apps/client/public/audio/music/ are Beat J's
     song_last_words_prelude_cut and are handled separately.
   - Paths under apps/client/public/audio/prince/ are Prince
     recordings, which live in apps/shared/engineerRecordings.ts
     (not a flat JSON manifest). For this PR's scope, Prince VO
     manifest checking is a known gap — see `PRINCE_VO_GAP`.

   Known-stale references are captured in STALE_REF_ALLOWLIST
   with a comment explaining each one. The allowlist prevents
   the test from failing on Bible bugs that need a separate doc
   fix. When the Bible is corrected, entries in the allowlist
   can be removed.

   Companion test: apps/server/preludeReadiness.test.ts runs the
   delivery dashboard for new Prelude assets.
   ═══════════════════════════════════════════════════════ */

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const BIBLE_PATH = "docs/production/PRELUDE_SHIP_READY_BIBLE.md";

/**
 * Known Bible bugs — references to "existing" assets that don't
 * actually exist. Each entry carries a short comment explaining
 * what's wrong so a future cleanup PR has a starting point.
 *
 * When the Bible is fixed, remove the corresponding entry here.
 */
const STALE_REF_ALLOWLIST: ReadonlyMap<string, string> = new Map([
  [
    "apps/client/public/audio/antiquarian/antiq_fc_1.mp3",
    "Bible §17.5 claims 'existing asset, no modification'. " +
      "In reality antiquarianVoManifest.json only has antiq_fulcrum/ages/variations/library/etc. " +
      "The antiq_fc_1 id is invented — either the line needs to be recorded (and added to the manifest) " +
      "or Beat J's first-contact VO needs to be remapped to an actually-existing antiquarian line. " +
      "Flagged as follow-up — must not block this PR.",
  ],
  // ── Per-section cutscene path drift from §19.2 ────────────────
  // Bible §19.2 is the authoritative delivery checklist — the
  // paths in preludeSequence.ts match §19.2. But each beat's own
  // §X.3/§X.4 cutscene sub-spec sometimes uses a slightly
  // different filename (shorter or differently-hyphenated). These
  // alternate paths are NOT tracked in preludeSequence.ts because
  // they'd be duplicate deliveries. The allowlist documents them
  // here so the audit test passes. A follow-up Bible cleanup PR
  // should align each §X.4 path to match §19.2 exactly.
  [
    "apps/client/public/videos/prelude/prelude-beat-a-awakening.mp4",
    "§3.4 cutscene path; §19.2 uses `prelude-beat-a-cryo-wake.mp4`. Drift — doc cleanup.",
  ],
  [
    "apps/client/public/videos/prelude/prelude-beat-a5-corridor.mp4",
    "§4.3 cutscene path; §19.2 uses `prelude-beat-a5-corridor-first-steps.mp4`. Drift — doc cleanup.",
  ],
  [
    "apps/client/public/videos/prelude/prelude-beat-b-escape.mp4",
    "§5.4 cutscene path; §19.2 uses `prelude-beat-b-corridor-escape.mp4`. Drift — doc cleanup.",
  ],
  [
    "apps/client/public/videos/prelude/prelude-beat-c-crew-and-incubators.mp4",
    "§6.4 cutscene path; §19.2 uses `prelude-beat-c-engineering-role-choice.mp4`. Drift — doc cleanup.",
  ],
]);

/**
 * The Prelude Bible uses "existing elara_fc_*" references that
 * don't map to elaraVoManifest.json keys. Rather than listing
 * every one individually in the allowlist, this prefix-based
 * allowlist suppresses the whole family.
 */
const STALE_REF_PREFIX_ALLOWLIST: readonly { prefix: string; note: string }[] = [
  {
    prefix: "apps/client/public/audio/elara/elara_fc",
    note:
      "Bible §3.5 references 'elara_fc_* lines from VOICE_OVER_BIBLE.md lines 86-91'. " +
      "elaraVoManifest.json has no entries matching elara_fc*. These are stale IDs — " +
      "real existing Elara lines live under other naming conventions. Flagged as follow-up.",
  },
];

/** Paths explicitly spec'd by the canon expansion doc, not this Bible. */
const CANON_EXPANSION_OWNED_PATHS: ReadonlySet<string> = new Set([
  "apps/client/public/audio/prince/holo_log_5_full.mp3",
  "apps/client/public/audio/music/song_last_words_prelude_cut.mp3",
]);

/**
 * Speaker → VO manifest JSON file. Used by the audit to verify
 * that a referenced <speaker>/<lineId>.mp3 path maps to a real
 * key in the matching manifest.
 */
const VO_MANIFEST_BY_SPEAKER: ReadonlyMap<string, string> = new Map([
  ["elara", "apps/shared/elaraVoManifest.json"],
  ["human", "apps/shared/humanVoManifest.json"],
  ["locke", "apps/shared/lockeVoManifest.json"],
  ["antiquarian", "apps/shared/antiquarianVoManifest.json"],
  ["agent_zero", "apps/shared/agent_zeroVoManifest.json"],
  ["architect", "apps/shared/architectVoManifest.json"],
  ["cades", "apps/shared/cadesVoManifest.json"],
  ["collector", "apps/shared/collectorVoManifest.json"],
  ["degen", "apps/shared/degenVoManifest.json"],
  ["meme", "apps/shared/memeVoManifest.json"],
  ["necromancer", "apps/shared/necromancerVoManifest.json"],
  ["nilmorg", "apps/shared/nilmorgVoManifest.json"],
  ["palimpsestHost", "apps/shared/palimpsestHostVoManifest.json"],
  ["shadow_tongue", "apps/shared/shadow_tongueVoManifest.json"],
  ["source", "apps/shared/sourceVoManifest.json"],
]);

/** Known gap: Prince VO lives in engineerRecordings.ts, not a flat JSON. */
const PRINCE_VO_GAP =
  "Prince VO lines live in apps/shared/engineerRecordings.ts (typed registry, not flat JSON manifest). " +
  "Full audit requires a separate code path that imports the registry and checks line ids. " +
  "For this PR, Prince references are skipped.";

function resolveFromRepoRoot(p: string): string {
  return path.resolve(REPO_ROOT, p);
}

function loadBible(): string {
  return fs.readFileSync(resolveFromRepoRoot(BIBLE_PATH), "utf-8");
}

/**
 * Extract every `apps/client/public/...<ext>` path in the Bible,
 * where <ext> is one of the asset file extensions we care about.
 * Stops on whitespace, markdown punctuation, and quote characters
 * so we don't gather trailing commas / backticks / parentheses.
 * Filters out documentation template strings that contain `{` or
 * `}` (e.g. `{beat-id}-{slug}.mp4` pseudocode used in the Bible to
 * describe path conventions without naming real files).
 */
function extractPreludePathsFromBible(bibleSrc: string): string[] {
  const re =
    /apps\/client\/public\/[^\s"'`),]+?\.(?:png|webp|mp3|mp4|webm)/gu;
  const matches = bibleSrc.match(re) ?? [];
  const filtered = matches.filter((p) => !p.includes("{") && !p.includes("}"));
  return Array.from(new Set(filtered)).sort();
}

function isStaleAllowlisted(p: string): boolean {
  if (STALE_REF_ALLOWLIST.has(p)) return true;
  for (const { prefix } of STALE_REF_PREFIX_ALLOWLIST) {
    if (p.startsWith(prefix)) return true;
  }
  return false;
}

function isPrinceAudioPath(p: string): boolean {
  return p.startsWith("apps/client/public/audio/prince/");
}

function isMusicPath(p: string): boolean {
  return p.startsWith("apps/client/public/audio/music/");
}

/**
 * Classify an audio path by speaker based on its directory segment.
 * Returns null for paths that don't follow the `audio/<speaker>/` convention.
 */
function audioSpeakerFromPath(p: string): string | null {
  const match = /^apps\/client\/public\/audio\/([^/]+)\//u.exec(p);
  return match ? match[1] : null;
}

/**
 * Extract the VO line id from an audio path. E.g.
 * `apps/client/public/audio/elara/elara_beat_d_17000_year_mission.mp3`
 * → `elara_beat_d_17000_year_mission`.
 */
function voLineIdFromPath(p: string): string {
  return path.basename(p, ".mp3");
}

/* ─── BUILD THE KNOWN-NEW SET ─── */

function buildKnownNewPaths(): Set<string> {
  const collected = collectPreludeAssetPaths();
  return new Set([
    ...collected.roomPngs,
    ...collected.roomWebps,
    ...collected.cutsceneMp4s,
    ...collected.voAudioNew,
    ...collected.voAudioExisting,
    ...collected.vfxWebms,
    ...collected.ambientMp3s,
    ...PRELUDE_BEAT_J_MUSIC.map((m) => m.mp3),
  ]);
}

/* ─── TESTS ─── */

describe("Prelude Bible audit — structural", () => {
  it("the Bible file exists", () => {
    expect(fs.existsSync(resolveFromRepoRoot(BIBLE_PATH))).toBe(true);
  });

  it("the Bible references at least 30 prelude asset paths", () => {
    // Floor sanity check — if this number collapses, something
    // has gone wrong with the Bible or the extraction regex.
    const bibleSrc = loadBible();
    const paths = extractPreludePathsFromBible(bibleSrc);
    expect(paths.length).toBeGreaterThan(30);
  });

  it("every preludeSequence new-asset path is mentioned somewhere in the Bible", () => {
    // Sanity: preludeSequence.ts should derive from the Bible, so
    // every path it tracks should be findable in the Bible source.
    // This catches data drift where preludeSequence gets edited
    // without a matching Bible update.
    const bibleSrc = loadBible();
    const bibleText = bibleSrc; // direct substring check is fine
    const collected = collectPreludeAssetPaths();
    const newPaths = [
      ...collected.roomPngs,
      ...collected.cutsceneMp4s,
      ...collected.voAudioNew,
      ...collected.ambientMp3s,
    ];
    const orphans = newPaths.filter((p) => !bibleText.includes(p));
    if (orphans.length > 0) {
      expect.fail(
        `${orphans.length} preludeSequence path(s) not referenced in the Bible:\n  ${orphans.join("\n  ")}`,
      );
    }
  });
});

describe("Prelude Bible audit — disk asset claims (art/video/vfx)", () => {
  const bibleSrc = loadBible();
  const allPaths = extractPreludePathsFromBible(bibleSrc);
  const knownNew = buildKnownNewPaths();

  // Paths that should exist on disk: non-audio, not in the known-new
  // registry, not allowlisted as stale, not owned by the canon expansion.
  const toCheck = allPaths.filter(
    (p) =>
      !p.startsWith("apps/client/public/audio/") &&
      !knownNew.has(p) &&
      !isStaleAllowlisted(p) &&
      !CANON_EXPANSION_OWNED_PATHS.has(p),
  );

  it(`classified ${toCheck.length} non-audio 'existing' claims to verify`, () => {
    // Informational — just so the test output shows the count.
    // eslint-disable-next-line no-console
    console.log(
      `[bible audit] non-audio existing claims to verify: ${toCheck.length}`,
    );
  });

  it("every non-audio 'existing' asset in the Bible actually exists on disk", () => {
    const missing = toCheck.filter(
      (p) => !fs.existsSync(resolveFromRepoRoot(p)),
    );
    if (missing.length > 0) {
      const details = missing.map((p) => `  ${p}`).join("\n");
      expect.fail(
        `Bible references ${missing.length} non-audio 'existing' asset(s) that don't exist on disk:\n${details}`,
      );
    }
  });
});

describe("Prelude Bible audit — VO manifest claims", () => {
  const bibleSrc = loadBible();
  const allPaths = extractPreludePathsFromBible(bibleSrc);
  const knownNew = buildKnownNewPaths();

  // Audio paths to verify via VO manifests: audio/<speaker>/*.mp3
  // excluding music, prince (manifest-less), and canon-expansion-owned.
  const audioToCheck = allPaths.filter(
    (p) =>
      p.startsWith("apps/client/public/audio/") &&
      !isMusicPath(p) &&
      !isPrinceAudioPath(p) &&
      !knownNew.has(p) &&
      !isStaleAllowlisted(p) &&
      !CANON_EXPANSION_OWNED_PATHS.has(p),
  );

  it(`classified ${audioToCheck.length} audio 'existing' claims to verify`, () => {
    // eslint-disable-next-line no-console
    console.log(
      `[bible audit] audio existing claims to verify: ${audioToCheck.length}`,
    );
  });

  it("every Bible-claimed VO path maps to a real key in the speaker's VoManifest.json", () => {
    // Load each speaker's manifest lazily on first reference.
    const manifestCache = new Map<string, Record<string, unknown>>();
    const loadManifest = (speaker: string): Record<string, unknown> | null => {
      if (manifestCache.has(speaker)) return manifestCache.get(speaker)!;
      const manifestPath = VO_MANIFEST_BY_SPEAKER.get(speaker);
      if (!manifestPath) return null;
      const absPath = resolveFromRepoRoot(manifestPath);
      if (!fs.existsSync(absPath)) return null;
      try {
        const parsed = JSON.parse(fs.readFileSync(absPath, "utf-8"));
        manifestCache.set(speaker, parsed);
        return parsed;
      } catch {
        return null;
      }
    };

    const offenders: Array<{ path: string; reason: string }> = [];
    for (const p of audioToCheck) {
      const speaker = audioSpeakerFromPath(p);
      if (!speaker) {
        offenders.push({ path: p, reason: "no speaker directory in path" });
        continue;
      }
      if (!VO_MANIFEST_BY_SPEAKER.has(speaker)) {
        // No manifest mapped for this speaker — skip (would be a
        // legitimate cross-check gap). Examples: "music" (handled
        // separately), "ambient" (not VO), new unknown speakers.
        continue;
      }
      const manifest = loadManifest(speaker);
      if (!manifest) {
        offenders.push({
          path: p,
          reason: `manifest at ${VO_MANIFEST_BY_SPEAKER.get(speaker)} could not be read`,
        });
        continue;
      }
      const lineId = voLineIdFromPath(p);
      if (!(lineId in manifest)) {
        offenders.push({
          path: p,
          reason: `id '${lineId}' not found in ${VO_MANIFEST_BY_SPEAKER.get(speaker)}`,
        });
      }
    }

    if (offenders.length > 0) {
      const details = offenders
        .map((o) => `  ${o.path}\n    → ${o.reason}`)
        .join("\n");
      expect.fail(
        `Bible references ${offenders.length} VO line path(s) that are not in their manifests:\n${details}`,
      );
    }
  });

  it("documents the Prince VO manifest gap", () => {
    // Pure documentation — no assertion. Makes the known gap
    // visible in the test output so a future PR can close it.
    // eslint-disable-next-line no-console
    console.log(`[bible audit] Prince VO gap: ${PRINCE_VO_GAP}`);
  });
});

describe("Prelude Bible audit — allowlist accountability", () => {
  it("every entry in STALE_REF_ALLOWLIST still appears in the Bible", () => {
    // If a stale allowlist entry is no longer referenced in the Bible,
    // it should be removed from the allowlist (cleanup housekeeping).
    const bibleSrc = loadBible();
    const orphans: string[] = [];
    for (const p of STALE_REF_ALLOWLIST.keys()) {
      if (!bibleSrc.includes(p)) orphans.push(p);
    }
    if (orphans.length > 0) {
      expect.fail(
        `Allowlist entries no longer referenced in the Bible (can be removed):\n  ${orphans.join("\n  ")}`,
      );
    }
  });

  it("logs the allowlist size as a debt counter", () => {
    // eslint-disable-next-line no-console
    console.log(
      `[bible audit] STALE_REF_ALLOWLIST size: ${STALE_REF_ALLOWLIST.size} exact + ${STALE_REF_PREFIX_ALLOWLIST.length} prefix`,
    );
  });
});
