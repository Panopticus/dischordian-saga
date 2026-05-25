/* Extract NPC portrait registry for the standalone hotspot author.
   Pulls just the fields the tool needs (id, name, bustPortrait,
   factionColorHex) from NPC_PORTRAITS and writes
   tools/hotspot-author-npcs.json. */

import * as fs from "fs";
import * as path from "path";
import { NPC_PORTRAITS } from "../client/src/game/npcPortraits";

interface NpcOut {
  id: string;
  name: string;
  bustPortrait: string;
  factionColorHex: string;
}

// Fallback color when an entry hasn't been migrated off `color` to
// `factionColorHex`. Matches the convention used elsewhere in the tool
// (neutral magenta) so unmigrated NPCs visibly stand out.
const FALLBACK_COLOR = "#ff00aa";

const out: NpcOut[] = Object.values(NPC_PORTRAITS).map((p) => ({
  id: p.id,
  name: p.name,
  bustPortrait: p.bustPortrait,
  factionColorHex: p.factionColorHex ?? FALLBACK_COLOR,
}));

// Sort alphabetically by name for a stable palette order.
out.sort((a, b) => a.name.localeCompare(b.name));

const outPath = path.resolve("tools/hotspot-author-npcs.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`Wrote ${out.length} NPC portraits → ${outPath}`);
