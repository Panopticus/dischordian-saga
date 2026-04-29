#!/usr/bin/env node
/* Convert every .png under /tmp/aaa_assets/pack2 into a sibling .webp.
   Quality 85, effort 4. Idempotent against fresh outputs.
   Concurrency: 8. Uses scripts/_lib/{walk, webp}.mjs. */
import { walk } from "./_lib/walk.mjs";
import { convertPngsConcurrent } from "./_lib/webp.mjs";

const ROOT = "/tmp/aaa_assets/pack2";
const CONCURRENCY = 8;

const files = [];
for await (const f of walk(ROOT, { extensions: [".png"] })) files.push(f);
console.log(`Found ${files.length} PNGs.`);

const jobs = files.map((src) => ({ src, dst: src.replace(/\.png$/, ".webp") }));
const started = Date.now();
const result = await convertPngsConcurrent(jobs, {
  concurrency: CONCURRENCY,
  onProgress: (n, total) => {
    if (n % 50 === 0 || n === total) {
      const elapsed = ((Date.now() - started) / 1000).toFixed(1);
      console.log(`  ${n}/${total} — ${elapsed}s`);
    }
  },
});
console.log(
  `Done. converted=${result.converted} skipped=${result.skipped} ` +
  `failed=${result.failed} elapsed=${((Date.now() - started) / 1000).toFixed(1)}s`,
);
process.exit(result.failed > 0 ? 1 : 0);
