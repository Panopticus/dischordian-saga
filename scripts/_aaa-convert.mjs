#!/usr/bin/env node
/* Convert every .png under /tmp/aaa_assets/extracted/{trade_empire,expansion_cards}
   into a .webp sibling. Quality 85, lossy. Idempotent (mtime compare).
   Concurrency: 8. Uses scripts/_lib/{walk, webp}.mjs. */
import { walk } from "./_lib/walk.mjs";
import { convertPngsConcurrent } from "./_lib/webp.mjs";

const ROOTS = [
  "/tmp/aaa_assets/extracted/trade_empire",
  "/tmp/aaa_assets/extracted/expansion_cards",
];
const CONCURRENCY = 8;

const files = [];
for (const root of ROOTS) {
  for await (const f of walk(root, { extensions: [".png"] })) files.push(f);
}
console.log(`Found ${files.length} PNGs.`);

const jobs = files.map((src) => ({ src, dst: src.replace(/\.png$/, ".webp") }));
const started = Date.now();
const result = await convertPngsConcurrent(jobs, {
  concurrency: CONCURRENCY,
  onProgress: (n, total) => {
    if (n % 20 === 0 || n === total) {
      const elapsed = ((Date.now() - started) / 1000).toFixed(1);
      console.log(`  ${n}/${total} — ${elapsed}s`);
    }
  },
});
console.log(
  `Done. converted=${result.converted} skipped=${result.skipped} ` +
  `failed=${result.failed} elapsed=${((Date.now() - started) / 1000).toFixed(1)}s`,
);
if (result.failed > 0) process.exit(1);
