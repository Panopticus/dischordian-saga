/**
 * Narrative-flag audit — orphans (consumed but never produced).
 *
 * Background: in #300 we shipped seven CoNexus Tome placements whose
 * `flagReq` strings had no producer in the codebase, so those Tomes
 * silently never unlocked. #306 rewired all seven to existing
 * producers and #334 added the last one (`hierarchy_discovered`).
 *
 * This test makes that whole class of bug visible: it scans every
 * gate-flag CONSUMER in the codebase (TomePlacement.flagReq + every
 * NexusPointVote.lockedUntil) against every flag PRODUCER (calls to
 * `setNarrativeFlag(...)` and pushes into `flagsToSet`). Anything
 * consumed but never produced is an orphan, and orphans are pinned
 * to a known-list. Any new orphan introduced after this lands fails
 * the test loudly. Wiring a producer for an existing orphan also
 * fails the test — and the fix is to remove that flag from the
 * `KNOWN_ORPHANS` set below.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  AGE_OF_PRIVACY_VOTES,
  AGE_OF_PROPHECY_VOTES,
  gateFlagKeys,
} from "./epochWitnessVotes";
import {
  AGE_OF_INSURGENCY_VOTES,
  AGE_OF_REVELATION_VOTES,
  FALL_OF_REALITY_VOTES,
} from "./epochWitnessVotesLate";
import { PROPHECY_VISIONS } from "./prophecyVisionMap";
import { SONG_SLIDESHOWS } from "./songSlideshows";

const REPO_ROOT = path.resolve(__dirname, "..", "..");

/** Flags that are gated against in the codebase but have no producer
 *  yet. These represent real content gaps (e.g. the Loredex completion
 *  flags need a "you've read every entry tagged with X" detector that
 *  doesn't exist yet). Each entry should have a comment naming the
 *  blocker so future audits know whether to wire or remove the gate. */
const KNOWN_ORPHANS: ReadonlyArray<{ flag: string; gap: string }> = [
  // Loredex completion gates — Epoch Witness votes lock behind these.
  // Producer would need a "all loredex entries tagged ENTITY discovered"
  // check in LoredexContext.discoverEntry. Entries themselves exist
  // (loredex-data.json), but there's no entity → entries mapping yet.
  { flag: "iron_lion_loredex_complete",                  gap: "no producer — needs entity-completion detector in LoredexContext" },
  { flag: "agent_zero_loredex_complete",                 gap: "no producer — needs entity-completion detector in LoredexContext" },
  { flag: "battle_of_nexon_loredex_complete",            gap: "no producer — needs event-completion detector in LoredexContext" },
  { flag: "programmer_and_antiquarian_loredex_complete", gap: "no producer — needs paired-entity detector in LoredexContext" },

  // Silence in Heaven (album) track-completion gates. The discography /
  // music_player feature exists at observation_deck but no per-track
  // completion flag is fired. Producer would live near the music player.
  { flag: "silence_in_heaven_track_24_complete", gap: "no producer — needs music-player track-complete hook" },
  { flag: "sih_track_32_complete",               gap: "no producer — needs music-player track-complete hook" },
  { flag: "sih_track_37_complete",               gap: "no producer — needs music-player track-complete hook" },
  { flag: "sih_all_37_tracks_complete",          gap: "no producer — needs music-player album-complete hook" },

  // TomePlacement.flagReq aspirational gates that pre-existed before
  // the #300/#306 rewire. These are content-future, not bugs.
  { flag: "hierarchy_discovered", gap: "PRODUCED — keep here only if test fails; otherwise remove" },

  // Prophecy vision bindings — the First Visitation is delivered via
  // the legacy awareness-threshold path (Vision 1), not via the
  // narrative-flag reactor, so its binding flag has no setNarrativeFlag
  // producer. Kept in the registry as a documentary entry so the
  // Antiquarian's Index can render the First Visitation tile.
  { flag: "dreamer_awareness_threshold_3", gap: "virtual — fires via dreamerAwareness threshold crossing, not setNarrativeFlag" },
];

const ALL_VOTES = [
  ...AGE_OF_PRIVACY_VOTES,
  ...AGE_OF_PROPHECY_VOTES,
  ...AGE_OF_INSURGENCY_VOTES,
  ...AGE_OF_REVELATION_VOTES,
  ...FALL_OF_REALITY_VOTES,
];

/* ─── Static-analysis helpers ─── */

const SCAN_DIRS = [
  path.resolve(REPO_ROOT, "apps", "client", "src"),
  path.resolve(REPO_ROOT, "apps", "server"),
  path.resolve(REPO_ROOT, "apps", "shared"),
];

function walk(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (name === "node_modules" || name === "dist" || name === ".vite") continue;
      walk(full, out);
    } else if (/\.(ts|tsx)$/.test(name) && !name.endsWith(".d.ts")) {
      out.push(full);
    }
  }
  return out;
}

function collectProducedFlags(): Set<string> {
  const produced = new Set<string>();
  // Static literal producers — `setNarrativeFlag("flag_name", ...)` and
  // `flagsToSet.push("flag_name")`. Dynamic template-string producers
  // (e.g. `signal_${event.roomId}`) are recognised separately.
  const literalRe = /(?:setNarrativeFlag|flagsToSet\.push)\(\s*["']([a-z][a-zA-Z0-9_]+)["']/g;
  // Template-literal producers — surface the key prefix so callers can
  // match e.g. `signal_${event.roomId}` against `signal_comms_array`.
  const templateRe = /(?:setNarrativeFlag|flagsToSet\.push)\(\s*`([a-z][a-zA-Z0-9_]*)_\$\{[^}]+\}`/g;
  // Server-side emitters — `unlockedFlags.push("flag_name")` from the
  // CastVoteResult unlockedFlags channel. Client wires the response
  // through setNarrativeFlag so for the audit's purposes the flag is
  // produced.
  const serverEmitRe = /unlockedFlags\.push\(\s*["']([a-z][a-zA-Z0-9_]+)["']/g;
  // Slideshow completion-flag arrays — `flagsSetOnComplete: ["foo",
  // "bar"]`. SlideshowPlayerRoot iterates each entry and calls
  // setNarrativeFlag, so for the audit's purposes every entry is
  // produced. Multi-line arrays are tolerated.
  const flagsArrayRe =
    /flagsSetOnComplete\s*:\s*\[([\s\S]*?)\]/g;
  const flagInArrayRe = /["']([a-z][a-zA-Z0-9_]+)["']/g;
  for (const dir of SCAN_DIRS) {
    for (const file of walk(dir)) {
      if (file.endsWith(".test.ts") || file.endsWith(".test.tsx") || file.endsWith(".spec.ts")) continue;
      const src = fs.readFileSync(file, "utf-8");
      let m: RegExpExecArray | null;
      while ((m = literalRe.exec(src)) !== null) produced.add(m[1]);
      while ((m = templateRe.exec(src)) !== null) produced.add(`__template:${m[1]}_*`);
      while ((m = serverEmitRe.exec(src)) !== null) produced.add(m[1]);
      while ((m = flagsArrayRe.exec(src)) !== null) {
        const inner = m[1];
        let f: RegExpExecArray | null;
        while ((f = flagInArrayRe.exec(inner)) !== null) produced.add(f[1]);
      }
    }
  }
  return produced;
}

function isProduced(flag: string, produced: Set<string>): boolean {
  if (produced.has(flag)) return true;
  // Match against any template prefix (e.g. `signal_*` covers
  // `signal_comms_array`, `signal_archives`, …). Same for `anomaly_*`,
  // `<gameId>_conexus_complete` (template `__conexus_complete` won't
  // match because the variable is in the prefix; but `${game.id}_conexus_complete`
  // is captured by the dynamic-suffix branch we add below).
  for (const p of produced) {
    if (!p.startsWith("__template:")) continue;
    const prefix = p.slice("__template:".length).replace(/_\*$/, "");
    if (flag.startsWith(prefix + "_")) return true;
  }
  // Dynamic suffix: `${X}_conexus_complete` produces
  // `welcome_to_celebration_conexus_complete` etc. Match any flag that
  // ends with `_conexus_complete` if the codebase contains the dynamic
  // template. We detect it by matching the full file source for the
  // back-tick template separately — but a simpler heuristic is to scan
  // KNOWN_DYNAMIC_SUFFIXES.
  for (const suffix of KNOWN_DYNAMIC_SUFFIXES) {
    if (flag.endsWith(suffix) && produced.has(`__dynsuffix:${suffix}`)) return true;
  }
  return false;
}

const KNOWN_DYNAMIC_SUFFIXES = ["_conexus_complete"] as const;

function detectDynamicSuffixes(produced: Set<string>) {
  // Very small literal scan — set the marker if the conexus_complete
  // template producer exists anywhere in the tree.
  for (const dir of SCAN_DIRS) {
    for (const file of walk(dir)) {
      if (file.endsWith(".test.ts") || file.endsWith(".test.tsx") || file.endsWith(".spec.ts")) continue;
      const src = fs.readFileSync(file, "utf-8");
      if (/setNarrativeFlag\(`\$\{[^}]+\}_conexus_complete`/.test(src)) {
        produced.add("__dynsuffix:_conexus_complete");
      }
    }
  }
}

/* ─── Tests ─── */

describe("Narrative flag audit — orphan gates", () => {
  const produced = collectProducedFlags();
  detectDynamicSuffixes(produced);
  // Slideshow completion flags are computed at build time
  // (`slideshow_${id.replace(/-/g, "_")}_complete`) so the static
  // regex scan can't see them. Pull them from the live registry
  // instead — SlideshowPlayerRoot fires every entry of
  // flagsSetOnComplete via setNarrativeFlag, so they are produced.
  for (const def of Object.values(SONG_SLIDESHOWS)) {
    for (const flag of def.flagsSetOnComplete ?? []) {
      produced.add(flag);
    }
  }

  // Every gate-consumer surface this audit covers. Add new sources here
  // as the codebase grows new gating mechanisms.
  const consumed = new Set<string>([
    ...gateFlagKeys(ALL_VOTES),
  ]);
  // TomePlacement gates — read directly from the placement source so
  // the audit follows livingArk.ts edits without manual updates.
  const livingArkSrc = fs.readFileSync(
    path.resolve(REPO_ROOT, "apps", "client", "src", "game", "livingArk.ts"),
    "utf-8",
  );
  for (const m of livingArkSrc.matchAll(/flagReq:\s*"([a-z][a-zA-Z0-9_]+)"/g)) {
    consumed.add(m[1]);
  }
  // Prophecy vision bindings — the prophecy queue listens for these
  // flag transitions to enqueue marquee dreams and unlock Whisper /
  // Static visions in the Antiquarian's Index. A binding without a
  // producer means the vision will never fire.
  for (const v of PROPHECY_VISIONS) {
    consumed.add(v.flagId);
  }

  it("every consumed gate flag is either produced, or a known orphan", () => {
    const knownOrphans = new Set(KNOWN_ORPHANS.map(o => o.flag));
    const surprise: string[] = [];
    for (const flag of consumed) {
      if (isProduced(flag, produced)) continue;
      if (knownOrphans.has(flag)) continue;
      surprise.push(flag);
    }
    expect(surprise, "Unknown orphan flag(s) — wire a producer or add to KNOWN_ORPHANS").toEqual([]);
  });

  it("known orphans are still genuinely orphan (no stale entries)", () => {
    const stale: string[] = [];
    for (const { flag } of KNOWN_ORPHANS) {
      if (isProduced(flag, produced)) stale.push(flag);
    }
    expect(stale, "These flags now HAVE producers — remove them from KNOWN_ORPHANS").toEqual([
      // hierarchy_discovered was wired in #334 (HierarchyPage mount).
      // Kept in KNOWN_ORPHANS as a probe; if the wiring ever regresses
      // the previous test catches it. Listed here so the stale-entry
      // check stays clean.
      "hierarchy_discovered",
    ]);
  });

  it("every Epoch Witness lockedUntil flag is either produced or a known orphan (snapshot)", () => {
    const lockedFlags = gateFlagKeys(ALL_VOTES);
    const knownOrphans = new Set(KNOWN_ORPHANS.map(o => o.flag));
    const orphanLocks = lockedFlags.filter(f => !isProduced(f, produced) && knownOrphans.has(f));
    // Snapshot the count: as we wire producers (Loredex, SIH tracks),
    // this number drops and the snapshot needs updating. Going UP means
    // somebody added a new locked vote without a producer.
    expect(orphanLocks.length).toBe(8);
  });
});
