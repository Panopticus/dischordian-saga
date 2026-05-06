#!/usr/bin/env node
/**
 * AUDIT: mystery-binding integrity
 *
 * Every room-mystery verb response with a `mysteryBinding` references
 * clue ids by string. The clue ids must exist in the matching
 * episode in `apps/shared/episodeMysteries.ts` for the recordEvidence
 * round-trip to be meaningful.
 *
 * This script walks both sides:
 *   1. apps/shared/roomMysteries/*.ts — extract every mysteryBinding's
 *      (mysteryId, episodeId, clueId) tuple.
 *   2. apps/shared/episodeMysteries.ts — extract every (mysteryId,
 *      episodeId, clueId) authored.
 *
 * Reports:
 *   - bindings to clue ids the episode doesn't author (orphan evidence)
 *   - episode clues no room-mystery hotspot binds to (unbinding)
 *   - bindings whose mysteryId or episodeId aren't registered
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
  const cluesForEp = clueIdsByEpisode.get(b.episodeId);
  if (!cluesForEp || !cluesForEp.has(b.clueId)) {
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
