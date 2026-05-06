#!/usr/bin/env node
/**
 * AUDIT: room-mystery hotspot reachability
 *
 * For every hotspot id authored in apps/shared/roomMysteries/<room>.ts
 * the player should be able to reach its verb-coin responses by
 * clicking some GameContext hotspot whose `action` is
 *
 *   "room-mystery:<roomId>:<hotspotId>"
 *
 * This walks every mystery module, collects each (roomId, hotspotId)
 * pair, then greps GameContext.tsx for the matching action string.
 * Missing actions are silent verbs — authored content the player
 * can never reach.
 *
 * Use:
 *   node scripts/_audit-room-mystery-reachability.mjs
 */
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOM_DIR = resolve(process.cwd(), "apps/shared/roomMysteries");
const GAMECTX = resolve(process.cwd(), "apps/client/src/contexts/GameContext.tsx");
const SKIP = new Set(["_template.ts", "_speciesExclusive.ts", "index.ts"]);

function findResponsesBlock(src) {
  const m = src.match(/responses\s*:\s*\{/);
  if (!m) return null;
  const start = m.index + m[0].length;
  let depth = 1;
  let i = start;
  while (i < src.length && depth > 0) {
    const ch = src[i];
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    i++;
  }
  return depth === 0 ? src.slice(start, i - 1) : null;
}

function topLevelHotspotIds(block) {
  const ids = [];
  const re = /(?:"([^"\\]+)"|([A-Za-z_][\w-]*))\s*:\s*\{/g;
  let match;
  while ((match = re.exec(block)) !== null) {
    const id = match[1] ?? match[2];
    const start = match.index + match[0].length;
    let depth = 1;
    let i = start;
    while (i < block.length && depth > 0) {
      const ch = block[i];
      if (ch === "{") depth++;
      else if (ch === "}") depth--;
      i++;
    }
    if (depth === 0) {
      ids.push(id);
      re.lastIndex = i;
    } else break;
  }
  return ids;
}

const ctx = readFileSync(GAMECTX, "utf8");
const ctxActions = new Set();
const actionRe = /room-mystery:([a-z][a-z0-9-]*):([a-z][a-z0-9-]*)/g;
let m;
while ((m = actionRe.exec(ctx)) !== null) {
  ctxActions.add(`${m[1]}:${m[2]}`);
}

const files = readdirSync(ROOM_DIR)
  .filter(f => f.endsWith(".ts") && !f.endsWith(".test.ts") && !SKIP.has(f))
  .sort();

let totalAuthored = 0;
let totalReachable = 0;
const gaps = [];
for (const file of files) {
  const src = readFileSync(resolve(ROOM_DIR, file), "utf8");
  const block = findResponsesBlock(src);
  if (!block) continue;
  const hotspots = topLevelHotspotIds(block);
  const ridMatch = src.match(/roomId\s*:\s*"([^"]+)"/);
  const roomId = ridMatch ? ridMatch[1] : file.replace(/\.ts$/, "");
  const missing = [];
  for (const id of hotspots) {
    totalAuthored++;
    if (ctxActions.has(`${roomId}:${id}`)) {
      totalReachable++;
    } else {
      missing.push(id);
    }
  }
  if (missing.length > 0) gaps.push({ roomId, missing, total: hotspots.length });
}

console.log("ROOM                         GAP    /TOTAL  UNREACHABLE HOTSPOTS");
console.log("─".repeat(78));
for (const g of gaps) {
  const w = (s, n) => String(s).padEnd(n);
  console.log(
    w(g.roomId, 28),
    w(g.missing.length, 6),
    w(`/${g.total}`, 7),
    g.missing.join(", "),
  );
}
console.log("─".repeat(78));
console.log(`OVERALL: ${totalReachable} / ${totalAuthored} reachable (${Math.round((totalReachable / totalAuthored) * 100)}%)`);
