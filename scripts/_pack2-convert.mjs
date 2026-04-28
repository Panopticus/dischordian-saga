#!/usr/bin/env node
/* Convert every .png under /tmp/aaa_assets/pack2 into a sibling .webp.
   Quality 85, effort 4. Concurrency: 8. Idempotent against fresh outputs. */
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = "/tmp/aaa_assets/pack2";
const QUALITY = 85;
const CONCURRENCY = 8;

async function* walk(dir) {
  const ents = await readdir(dir, { withFileTypes: true });
  for (const e of ents) {
    const full = join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (e.isFile() && full.endsWith(".png")) yield full;
  }
}

async function convertOne(pngPath) {
  const webpPath = pngPath.replace(/\.png$/, ".webp");
  try {
    const [src, dst] = await Promise.all([stat(pngPath), stat(webpPath).catch(() => null)]);
    if (dst && dst.mtimeMs >= src.mtimeMs) return { status: "skipped" };
  } catch { /* ignore */ }
  const info = await sharp(pngPath).webp({ quality: QUALITY, effort: 4 }).toFile(webpPath);
  return { status: "converted", outBytes: info.size };
}

const files = [];
for await (const f of walk(ROOT)) files.push(f);
console.log(`Found ${files.length} PNGs.`);

let i = 0, done = 0, conv = 0, skip = 0, totalOut = 0, fail = 0;
const started = Date.now();
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (true) {
      const idx = i++;
      if (idx >= files.length) return;
      try {
        const r = await convertOne(files[idx]);
        done++;
        if (r.status === "converted") { conv++; totalOut += r.outBytes ?? 0; }
        else skip++;
        if (done % 50 === 0 || done === files.length) {
          const elapsed = ((Date.now() - started) / 1000).toFixed(1);
          console.log(`  ${done}/${files.length} (conv=${conv} skip=${skip}) — ${elapsed}s`);
        }
      } catch (err) {
        fail++;
        console.error(`FAIL ${files[idx]}: ${err.message}`);
      }
    }
  }),
);
console.log(`Done. converted=${conv} skipped=${skip} failed=${fail} outBytes=${(totalOut / 1024 / 1024).toFixed(1)}MB elapsed=${((Date.now() - started) / 1000).toFixed(1)}s`);
process.exit(fail > 0 ? 1 : 0);
