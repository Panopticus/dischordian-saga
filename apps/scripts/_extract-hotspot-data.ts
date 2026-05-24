import { ROOM_DEFINITIONS } from "../client/src/contexts/GameContext";
import * as fs from "fs";
import * as path from "path";

const rooms = ROOM_DEFINITIONS.map((r) => ({
  id: r.id,
  name: r.name,
  imageUrl: r.imageUrl,
  hotspots: r.hotspots,
}));

const outPath = path.resolve("tools/hotspot-author-data.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(rooms, null, 2));
console.log(`Wrote ${rooms.length} rooms / ${rooms.reduce((n, r) => n + r.hotspots.length, 0)} hotspots → ${outPath}`);
