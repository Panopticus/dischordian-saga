import { ROOM_ART_ENTRIES } from "../shared/expansionArt/roomArtManifest.data";
import * as fs from "fs";
import * as path from "path";

const CDN_PREFIX = "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/";

// Group by zipDir, list each variant + its full CDN URL.
const byZipDir: Record<string, Array<{ variantId: string; url: string }>> = {};
for (const entry of ROOM_ART_ENTRIES) {
  if (!byZipDir[entry.zipDir]) byZipDir[entry.zipDir] = [];
  byZipDir[entry.zipDir].push({
    variantId: entry.id,
    url: CDN_PREFIX + entry.relPath,
  });
}

const outPath = path.resolve("tools/hotspot-author-variants.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(byZipDir, null, 2));
const totalEntries = Object.values(byZipDir).reduce((n, a) => n + a.length, 0);
console.log(`Wrote ${Object.keys(byZipDir).length} zipDirs / ${totalEntries} entries → ${outPath}`);
