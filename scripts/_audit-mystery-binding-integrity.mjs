#!/usr/bin/env node
/**
 * AUDIT: mystery-binding integrity
 *
 * Every room-mystery verb response with a `mysteryBinding` references
 * clue ids by string. The clue id must be authored in
 * `apps/shared/episodeMysteries.ts` AND belong to the same
 * mystery/arc as the binding for the recordEvidence round-trip to be
 * meaningful.
 *
 * IMPORTANT — invariant is arc-level, not episode-level:
 * `mysteryService.recordEvidence(userId, mysteryId, clueId, …)` is
 * keyed by clueId, NOT episodeId. A binding's `episodeId` is a
 * representative label, not load-bearing. One hotspot may
 * legitimately surface clues spanning several episodes of the same
 * mystery (e.g. the Antiquarian bust deliberately indexing all four
 * Lionism episodes at once). Such cross-episode bindings are correct
 * at runtime, so they must NOT be flagged as orphans. The real
 * integrity property is: the clue exists and is part of the
 * binding's mystery (matching arc prefix).
 *
 * This script walks both sides:
 *   1. apps/shared/roomMysteries/*.ts — extract every mysteryBinding's
 *      (mysteryId, episodeId, clueId) tuple.
 *   2. apps/shared/episodeMysteries.ts — extract every authored clue
 *      id (and the arc it belongs to).
 *
 * Reports:
 *   - bindings to clue ids not authored, or belonging to a different
 *     mystery/arc than the binding (orphan evidence)
 *   - episode clues no room-mystery hotspot binds to (unbinding)
 *   - bindings whose episodeId isn't a registered episode
 */
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOM_DIR = resolve(process.cwd(), "apps/shared/roomMysteries");
const EPISODES = resolve(process.cwd(), "apps/shared/episodeMysteries.ts");
const SKIP = new Set(["_template.ts", "_speciesExclusive.ts", "index.ts"]);

const epSrc = readFileSync(EPISODES, "utf8");

// Authored episode clue ids. Each EpisodeDefinition has an `id:` field
// and a `clues:` block of objects with `id:` fields. Pattern:
//   id: "wraith.e1" as EpisodeId,
//   ...
//   clues: [
//     { id: "wraith.e1.bounty_file" as ClueId, ... },
//     ...
const epIdsAuthored = new Set();
for (const m of epSrc.matchAll(/id:\s*"([a-z][a-z0-9_.]*\.[a-z][a-z0-9_]*)"\s+as\s+EpisodeId/g)) {
  epIdsAuthored.add(m[1]);
}
const clueIdsByEpisode = new Map();
// Corrected invariant (verified against runtime): mysteryService
// .recordEvidence(userId, mysteryId, clueId, …) is keyed by clueId,
// NOT episodeId — the binding's `episodeId` is a representative label,
// not load-bearing. A clue is validly bound iff it is authored AND
// belongs to the SAME mystery/arc as the binding (arc prefix of the
// clue id == arc prefix of the binding's episodeId). This makes
// intentional cross-episode "index" hotspots (e.g. the Antiquarian
// bust surfacing all four Lionism episodes at once) legitimate
// instead of false "orphans".
const allAuthoredClues = new Set();
const cluesByArc = new Map();
for (const m of epSrc.matchAll(/id:\s*"([a-z][a-z0-9_.]*\.[a-z][a-z0-9_.]*)"\s+as\s+ClueId/g)) {
  const clueId = m[1];
  // Parse arc.episode out of clue id "<arc>.<episode>.<slug>" — the
  // episodes file authors clue ids that always carry the episode they
  // belong to. e.g. "wraith.e1.bounty_file" → episode "wraith.e1".
  const parts = clueId.split(".");
  if (parts.length < 3) continue;
  const epId = parts.slice(0, 2).join(".");
  if (!clueIdsByEpisode.has(epId)) clueIdsByEpisode.set(epId, new Set());
  clueIdsByEpisode.get(epId).add(clueId);
  allAuthoredClues.add(clueId);
  const arc = parts[0];
  if (!cluesByArc.has(arc)) cluesByArc.set(arc, new Set());
  cluesByArc.get(arc).add(clueId);
}

// Walk room-mystery modules for mysteryBinding usage. The TS source has
// the shape:
//   mysteryBinding: {
//     mysteryId: "mystery.wraith_calder",
//     episodeId: "wraith.e1",
//     cluesFound: ["wraith.e1.bounty_file"],
//   }
const files = readdirSync(ROOM_DIR)
  .filter(f => f.endsWith(".ts") && !f.endsWith(".test.ts") && !SKIP.has(f))
  .sort();

const bindings = [];
for (const file of files) {
  const src = readFileSync(resolve(ROOM_DIR, file), "utf8");
  // Find every `mysteryBinding: {` block and extract its three fields.
  const re = /mysteryBinding\s*:\s*\{([\s\S]*?)\}/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const body = m[1];
    const myMatch = body.match(/mysteryId:\s*"([^"]+)"/);
    const epMatch = body.match(/episodeId:\s*"([^"]+)"/);
    if (!myMatch || !epMatch) continue;
    const cluesMatch = body.match(/cluesFound:\s*\[([\s\S]*?)\]/);
    const clueIds = cluesMatch
      ? Array.from(cluesMatch[1].matchAll(/"([^"]+)"/g)).map(c => c[1])
      : [];
    for (const clueId of clueIds) {
      bindings.push({
        file: file.replace(/\.ts$/, ""),
        mysteryId: myMatch[1],
        episodeId: epMatch[1],
        clueId,
      });
    }
  }
}

// Cross-check
const orphanClues = []; // bindings whose clueId isn't authored
const unknownEpisodes = []; // bindings to episodes not in registry
const allBoundClues = new Set();
for (const b of bindings) {
  allBoundClues.add(b.clueId);
  if (!epIdsAuthored.has(b.episodeId)) {
    unknownEpisodes.push(b);
    continue;
  }
  // Orphan iff the clue is not authored at all, or it belongs to a
  // different mystery/arc than the binding. The clue need NOT be in
  // the binding's exact representative episode — recordEvidence is
  // clueId-keyed, and cross-episode index hotspots are intentional.
  const bindingArc = b.episodeId.split(".")[0];
  const clueArc = b.clueId.split(".")[0];
  if (!allAuthoredClues.has(b.clueId) || clueArc !== bindingArc) {
    orphanClues.push(b);
  }
}

const unboundClues = [];
for (const [epId, clues] of clueIdsByEpisode) {
  for (const c of clues) {
    if (!allBoundClues.has(c)) unboundClues.push({ epId, clueId: c });
  }
}

console.log(`\nBindings found: ${bindings.length} across ${files.length} room modules`);
console.log(`Authored episodes: ${epIdsAuthored.size}, authored clue ids: ${[...clueIdsByEpisode.values()].reduce((s, x) => s + x.size, 0)}`);

console.log(`\n=== ORPHAN BINDINGS (room references a clue id the episode doesn't author) ===`);
if (orphanClues.length === 0) console.log("  none");
for (const b of orphanClues) {
  console.log(`  [${b.file}.ts] ${b.mysteryId} / ${b.episodeId} → ${b.clueId}`);
}

console.log(`\n=== UNKNOWN EPISODES (room references an episodeId not in episodeMysteries.ts) ===`);
if (unknownEpisodes.length === 0) console.log("  none");
const seenUnknown = new Set();
for (const b of unknownEpisodes) {
  const key = `${b.mysteryId}:${b.episodeId}`;
  if (seenUnknown.has(key)) continue;
  seenUnknown.add(key);
  console.log(`  [${b.file}.ts] ${b.mysteryId} / ${b.episodeId}`);
}

console.log(`\n=== UNBOUND AUTHORED CLUES (episode authored a clueId nothing room-binds to) ===`);
if (unboundClues.length === 0) console.log("  none");
for (const u of unboundClues) {
  console.log(`  ${u.epId} → ${u.clueId}`);
}
console.log("");
