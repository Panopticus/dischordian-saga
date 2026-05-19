/**
 * One-shot generator (Batches 1-13): bind every DLC arc's
 * progression-critical clues to a reachable room hotspot.
 *
 * For each DLC arc, group its progression-critical clues
 * (clueA/B/C of any deduction with unlocksEpisode) by foundIn room.
 * For each (arc, room) add ONE "dlc index" hotspot to that room's
 * mystery module (union member + a compact look response carrying a
 * mysteryBinding with every such clue) and ONE matching GameContext
 * HotspotDef so the runtime can wire room-mystery:<room>:<hsid>.
 *
 * Re-derives everything from MYSTERY_DEFINITIONS so ids/episodes are
 * authoritative. Prepends into `responses:{`, the HotspotId union,
 * and the room's `hotspots:[` (key/element order is irrelevant), so
 * no brace-matching is needed. Idempotent: skips a group whose
 * hotspot id already exists.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { MYSTERY_DEFINITIONS } from "../apps/shared/episodeMysteries";

const ROOM_DIR = resolve(process.cwd(), "apps/shared/roomMysteries");
const GAMECTX = resolve(process.cwd(), "apps/client/src/contexts/GameContext.tsx");
const SKIP = new Set(["_template.ts", "_speciesExclusive.ts", "index.ts"]);

const DLC_PREFIX = "arc.dlc.";

// roomId -> { file, unionType }  (unionType "string" => no union edit)
const roomMeta = new Map();
for (const f of readdirSync(ROOM_DIR)) {
  if (!f.endsWith(".ts") || f.endsWith(".test.ts") || SKIP.has(f)) continue;
  const s = readFileSync(resolve(ROOM_DIR, f), "utf8");
  const rid = (s.match(/roomId:\s*"([^"]+)"/) || [])[1];
  const ut = (s.match(/RoomMysteryModule<\s*([A-Za-z_]+)/) || [])[1];
  if (rid && ut) roomMeta.set(rid, { file: f, unionType: ut });
}

// Build per-arc progression-critical clue groups.
const arcs = [];
for (const m of MYSTERY_DEFINITIONS) {
  if (!String(m.arcId).startsWith(DLC_PREFIX)) continue;
  const clueInfo = new Map(); // clueId -> { foundIn, episodeId }
  for (const ep of m.episodes)
    for (const c of ep.clues)
      clueInfo.set(c.id, { foundIn: c.foundIn, episodeId: ep.id });
  const crit = new Set();
  for (const ep of m.episodes)
    for (const d of ep.deductions || []) {
      if (!d.unlocksEpisode) continue;
      for (const cid of [d.clueA, d.clueB, d.clueC]) if (cid) crit.add(cid);
    }
  const byRoom = new Map(); // room -> { clues:[], episodeId }
  for (const cid of crit) {
    const info = clueInfo.get(cid);
    if (!info) throw new Error(`clue ${cid} not in ${m.id}`);
    if (!byRoom.has(info.foundIn))
      byRoom.set(info.foundIn, { clues: [], episodeId: info.episodeId });
    byRoom.get(info.foundIn).clues.push(cid);
  }
  arcs.push({ mysteryId: m.id, arcId: m.arcId, byRoom });
}

const arcSlug = (arcId) => String(arcId).replace(DLC_PREFIX, "").replace(/_/g, "-");

// ---- edit roomMysteries modules ----
const moduleEdits = new Map(); // file -> { unionAdds:[], responseAdds:[] }
const ctxAdds = []; // { room, hsid, mysteryId }
let groups = 0,
  clueCount = 0;
for (const a of arcs) {
  for (const [room, g] of a.byRoom) {
    const meta = roomMeta.get(room);
    if (!meta) throw new Error(`no room module for "${room}" (arc ${a.arcId})`);
    const hsid = `dlc-${arcSlug(a.arcId)}-${room}`;
    const clues = g.clues.slice().sort();
    groups++;
    clueCount += clues.length;
    const cluesLit = clues.map((c) => `"${c}"`).join(", ");
    const narr =
      `Case material for ${a.mysteryId} surfaces here — the records ` +
      `pertinent to this room's part of the investigation.`;
    const block =
      `    "${hsid}": {\n` +
      `      look: {\n` +
      `        narration: ${JSON.stringify(narr)},\n` +
      `        mysteryBinding: {\n` +
      `          mysteryId: "${a.mysteryId}",\n` +
      `          episodeId: "${g.episodeId}",\n` +
      `          cluesFound: [${cluesLit}],\n` +
      `        },\n` +
      `      },\n` +
      `    },\n`;
    if (!moduleEdits.has(meta.file))
      moduleEdits.set(meta.file, {
        unionType: meta.unionType,
        unionAdds: [],
        responseAdds: [],
      });
    const e = moduleEdits.get(meta.file);
    e.unionAdds.push(`  | "${hsid}"\n`);
    e.responseAdds.push(block);
    ctxAdds.push({ room, hsid, mysteryId: a.mysteryId });
  }
}

for (const [file, e] of moduleEdits) {
  const p = resolve(ROOM_DIR, file);
  let s = readFileSync(p, "utf8");
  const newHsids = e.unionAdds
    .map((u) => (u.match(/"([^"]+)"/) || [])[1])
    .filter((h) => !s.includes(`"${h}"`));
  const newResp = e.responseAdds.filter(
    (b) => !s.includes(b.split("\n")[0].trim()),
  );
  if (newHsids.length && e.unionType !== "string") {
    const re = new RegExp(
      `export type ${e.unionType}\\s*=\\s*([\\s\\S]*?);`,
    );
    const m = s.match(re);
    if (!m) throw new Error(`union decl not found in ${file}`);
    const body = m[1]
      .trim()
      .replace(/^\|\s*/, "")
      .replace(/\s+/g, " ");
    const lines = newHsids.map((h) => `  | "${h}"`).join("\n");
    const replacement = `export type ${e.unionType} =\n${lines}\n  | ${body};`;
    s = s.replace(re, () => replacement);
  }
  if (newResp.length) {
    const re = /(\n\s*responses:\s*\{\n)/;
    if (!re.test(s)) throw new Error(`responses anchor not found in ${file}`);
    s = s.replace(re, `$1${newResp.join("")}`);
  }
  writeFileSync(p, s);
  console.log(
    `module ${file}: +${newResp.length} hotspots (union ${e.unionType})`,
  );
}

// ---- edit GameContext ROOM_DEFINITIONS ----
const ctx = readFileSync(GAMECTX, "utf8");
const ctxLines = ctx.split("\n");
// room -> first `hotspots: [` line index after its `id: "<room>",`
function hotspotsAnchorLine(room) {
  for (let i = 0; i < ctxLines.length; i++) {
    if (new RegExp(`^\\s{4}id:\\s*"${room}"\\s*,\\s*$`).test(ctxLines[i])) {
      for (let j = i + 1; j < ctxLines.length && j < i + 40; j++) {
        if (/^\s+hotspots:\s*\[\s*$/.test(ctxLines[j])) return j;
      }
    }
  }
  throw new Error(`no hotspots:[ for room "${room}"`);
}
const byRoomCtx = new Map();
for (const c of ctxAdds) {
  if (!byRoomCtx.has(c.room)) byRoomCtx.set(c.room, []);
  byRoomCtx.get(c.room).push(c);
}
// Insert from highest line first so earlier indices stay valid.
const insertions = [];
for (const [room, list] of byRoomCtx) {
  const ln = hotspotsAnchorLine(room);
  const defs = list
    .filter((c) => !ctx.includes(`room-mystery:${room}:${c.hsid}`))
    .map((c, i) => {
      const x = 6 + ((i * 7) % 80);
      const y = 8 + ((i * 11) % 78);
      const name = `DLC Case Index — ${c.mysteryId}`;
      const desc = `Investigative records tied to ${c.mysteryId} are catalogued here.`;
      return `      { id: "mystery-${c.hsid}", name: ${JSON.stringify(name)}, description: ${JSON.stringify(desc)}, x: ${x}, y: ${y}, width: 6, height: 6, type: "interact", action: "room-mystery:${room}:${c.hsid}" },`;
    });
  if (defs.length) insertions.push({ ln, text: defs.join("\n") });
}
insertions.sort((a, b) => b.ln - a.ln);
for (const ins of insertions) {
  ctxLines.splice(ins.ln + 1, 0, ins.text);
}
writeFileSync(GAMECTX, ctxLines.join("\n"));

console.log(
  `\nDLC binding generation: ${arcs.length} arcs, ${groups} (arc,room) hotspots, ${clueCount} clues bound.`,
);
