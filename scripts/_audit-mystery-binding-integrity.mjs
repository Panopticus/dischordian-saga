#!/usr/bin/env -S pnpm tsx
/**
 * AUDIT: mystery-binding integrity (runtime-registry based)
 *
 * Every room-mystery verb response with a `mysteryBinding` references
 * clue ids by string. A clue is validly bound iff it is AUTHORED in
 * the mystery registry AND owned by the SAME mystery as the binding's
 * `mysteryId` — the `recordEvidence(userId, mysteryId, clueId, …)`
 * round-trip is keyed by (mysteryId, clueId), NOT episodeId.
 *
 * Why runtime, not text-scan: the 16 NPC arcs are authored inline in
 * `episodeMysteries.ts`, but the 13 DLC arcs are authored in
 * `apps/shared/dlcMysteries/*` and only merged into the registry at
 * import time. A regex over `episodeMysteries.ts` cannot see DLC
 * clues, and clue-id prefixes (`adv`, `memorial`, `charter2`, …) do
 * not match their mystery ids. Importing `MYSTERY_DEFINITIONS` gives
 * the authoritative (mysteryId → episodes → clues) graph for NPC + DLC
 * alike, so this stays a meaningful gate as DLC arcs are bound.
 *
 * `episodeId` on a binding is a representative label, not load-bearing
 * — one hotspot may legitimately surface clues spanning several
 * episodes of the same mystery (e.g. the Antiquarian bust indexing
 * all four Lionism episodes at once). Cross-episode bindings within
 * the same mystery are correct and are NOT orphans.
 *
 * Walks both sides:
 *   1. apps/shared/roomMysteries/*.ts — every mysteryBinding tuple
 *      (mysteryId, episodeId, clueId), via source scan.
 *   2. MYSTERY_DEFINITIONS (runtime) — authored clue → owning mystery.
 *
 * Reports:
 *   - orphan: clue not authored, or owned by a different mystery than
 *     the binding's mysteryId
 *   - unknown: binding mysteryId not registered, or episodeId not an
 *     episode of that mystery
 *   - unbound: an authored clue no room hotspot binds to
 *
 * Run with: `pnpm tsx scripts/_audit-mystery-binding-integrity.mjs`
 * (imports TS from the registry — plain `node` will not work.)
 */
import { readdirSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { MYSTERY_DEFINITIONS } from "../apps/shared/episodeMysteries";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOM_DIR = resolve(HERE, "../apps/shared/roomMysteries");
const SKIP = new Set(["_template.ts", "_speciesExclusive.ts", "index.ts"]);

// ── Authoritative authored graph from the runtime registry ──
const mysteryIds = new Set();
const episodesByMystery = new Map();
const clueToMystery = new Map();
const allAuthoredClues = new Set();
const clueOwnerLabel = new Map(); // clueId → "mysteryId / episodeId"
for (const m of MYSTERY_DEFINITIONS) {
  mysteryIds.add(m.id);
  const eps = new Set();
  for (const ep of m.episodes) {
    eps.add(ep.id);
    for (const c of ep.clues) {
      allAuthoredClues.add(c.id);
      clueToMystery.set(c.id, m.id);
      clueOwnerLabel.set(c.id, `${m.id} / ${ep.id}`);
    }
  }
  episodesByMystery.set(m.id, eps);
}

// ── Room-side mysteryBinding tuples (source scan) ──
const files = readdirSync(ROOM_DIR)
  .filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts") && !SKIP.has(f))
  .sort();

const bindings = [];
for (const file of files) {
  const src = readFileSync(resolve(ROOM_DIR, file), "utf8");
  const re = /mysteryBinding\s*:\s*\{([\s\S]*?)\}/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const body = m[1];
    const myMatch = body.match(/mysteryId:\s*"([^"]+)"/);
    const epMatch = body.match(/episodeId:\s*"([^"]+)"/);
    if (!myMatch || !epMatch) continue;
    const cluesMatch = body.match(/cluesFound:\s*\[([\s\S]*?)\]/);
    const clueIds = cluesMatch
      ? Array.from(cluesMatch[1].matchAll(/"([^"]+)"/g)).map((c) => c[1])
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

// ── Cross-check ──
const orphanClues = [];
const unknownRefs = [];
const allBoundClues = new Set();
for (const b of bindings) {
  allBoundClues.add(b.clueId);
  const knownMystery = mysteryIds.has(b.mysteryId);
  const knownEpisode =
    knownMystery &&
    (episodesByMystery.get(b.mysteryId)?.has(b.episodeId) ?? false);
  if (!knownMystery || !knownEpisode) {
    unknownRefs.push(b);
    continue;
  }
  // Orphan iff the clue isn't authored anywhere, or it is owned by a
  // different mystery than this binding declares. Cross-episode within
  // the same mystery is fine (episodeId is a label, not load-bearing).
  if (
    !allAuthoredClues.has(b.clueId) ||
    clueToMystery.get(b.clueId) !== b.mysteryId
  ) {
    orphanClues.push(b);
  }
}

const unboundClues = [];
for (const clueId of allAuthoredClues) {
  if (!allBoundClues.has(clueId)) {
    unboundClues.push({ owner: clueOwnerLabel.get(clueId) ?? "?", clueId });
  }
}
unboundClues.sort((a, b) => a.clueId.localeCompare(b.clueId));

console.log(
  `\nBindings found: ${bindings.length} across ${files.length} room modules`,
);
console.log(
  `Registered mysteries: ${mysteryIds.size}, authored clue ids: ${allAuthoredClues.size}, bound: ${allBoundClues.size}`,
);

console.log(
  `\n=== ORPHAN BINDINGS (clue unauthored, or owned by a different mystery) ===`,
);
if (orphanClues.length === 0) console.log("  none");
for (const b of orphanClues) {
  const owner = clueToMystery.get(b.clueId) ?? "(unauthored)";
  console.log(
    `  [${b.file}.ts] binding ${b.mysteryId} / ${b.episodeId} → ${b.clueId}  (clue owner: ${owner})`,
  );
}

console.log(
  `\n=== UNKNOWN REFS (binding mysteryId/episodeId not in the registry) ===`,
);
if (unknownRefs.length === 0) console.log("  none");
const seenUnknown = new Set();
for (const b of unknownRefs) {
  const key = `${b.mysteryId}:${b.episodeId}`;
  if (seenUnknown.has(key)) continue;
  seenUnknown.add(key);
  console.log(`  [${b.file}.ts] ${b.mysteryId} / ${b.episodeId}`);
}

console.log(
  `\n=== UNBOUND AUTHORED CLUES (authored clue no room hotspot binds) ===`,
);
if (unboundClues.length === 0) console.log("  none");
for (const u of unboundClues) {
  console.log(`  ${u.owner} → ${u.clueId}`);
}
console.log("");
