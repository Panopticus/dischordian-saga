#!/usr/bin/env node
/**
 * CDN liveness probe — anonymous HEAD against the public S3 URL.
 *
 * Different from `_check-art-coverage.mjs` (signed AWS HEAD with
 * credentials): this script asks the same question a player's browser
 * asks. 200 means the runtime can fetch it; non-200 means it can't.
 *
 * Note on 403 vs 404: on this bucket, anonymous principals don't have
 * `s3:ListBucket`, so S3 can't tell unauthenticated callers "no such
 * key" — every "missing or denied" answer collapses to 403. A 403
 * therefore means *either* the object isn't in the bucket *or* the
 * object is there but anonymous read is denied (most common cause:
 * upload landed with the bucket's default KMS encryption rather than
 * `ServerSideEncryption: AES256`, so anonymous can't kms:Decrypt).
 * Disambiguate by running `_check-art-coverage.mjs` (signed HEAD)
 * over the 403 set: anything that flips to 200 with creds is in the
 * bucket and needs an SSE-S3 re-upload; anything that stays 403/404
 * with creds isn't there and needs to be produced.
 *
 * Critically: this disambiguates the audit's "31% live" claim. The
 * upload script's HEAD is a *signed* AWS HEAD that returns 200 on
 * a KMS-encrypted object the browser can't actually read.
 *
 * Output:
 *   - Per-status counts: 200 / 403 / 404 / other.
 *   - Per-source breakdown.
 *   - asset-liveness-report.json with one row per URL for follow-up.
 *
 * Usage:
 *   pnpm assets:liveness                    # probe everything (~1650 URLs)
 *   pnpm assets:liveness -- --sample=50     # random sample (smoke test)
 *   pnpm assets:liveness -- --source=base-set
 *
 * No AWS credentials required — pure anonymous HEAD over HTTPS.
 */
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import { collectAllJobs, PUBLIC_ASSET_BASE } from "./_lib/manifestJobs.mjs";

const REPO_ROOT = process.cwd();
const CONCURRENCY = 16;
const TIMEOUT_MS = 15_000;

/* ─── CLI ─── */

const argv = process.argv.slice(2);
const sampleArg = argv.find((a) => a.startsWith("--sample="));
const sourceArg = argv.find((a) => a.startsWith("--source="));
const sample = sampleArg ? parseInt(sampleArg.slice("--sample=".length), 10) : null;
const sourceFilter = sourceArg ? sourceArg.slice("--source=".length) : null;

let jobs = collectAllJobs(REPO_ROOT);
if (sourceFilter) {
  jobs = jobs.filter((j) => j.source === sourceFilter);
}
if (sample && sample > 0 && sample < jobs.length) {
  // Deterministic sample — sort by relPath, take every Nth so we hit
  // every prefix bucket rather than random-clustering on one source.
  const stride = Math.floor(jobs.length / sample);
  const sorted = [...jobs].sort((a, b) => a.relPath.localeCompare(b.relPath));
  jobs = sorted.filter((_, i) => i % stride === 0).slice(0, sample);
}

console.log("");
console.log(`CDN liveness probe — ${jobs.length} URLs`);
console.log(`Base: ${PUBLIC_ASSET_BASE}`);
console.log(`Concurrency: ${CONCURRENCY}`);
if (sourceFilter) console.log(`--source=${sourceFilter}`);
if (sample) console.log(`--sample=${sample}`);
console.log("");

/* ─── Probe ─── */

/**
 * @param {string} url
 * @returns {Promise<{ status: number, etag: string | null, contentLength: number | null, error?: string }>}
 */
async function probe(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { method: "HEAD", signal: controller.signal });
    return {
      status: res.status,
      etag: res.headers.get("etag"),
      contentLength: res.headers.get("content-length")
        ? Number(res.headers.get("content-length"))
        : null,
    };
  } catch (e) {
    return {
      status: 0,
      etag: null,
      contentLength: null,
      error: e instanceof Error ? e.message : String(e),
    };
  } finally {
    clearTimeout(timer);
  }
}

/** @type {Array<{ source: string, id: string, relPath: string, status: number, etag: string | null, contentLength: number | null, error?: string }>} */
const results = [];
let done = 0;

const queue = [...jobs];
const workers = [];
for (let i = 0; i < CONCURRENCY; i++) {
  workers.push(
    (async () => {
      while (queue.length) {
        const job = queue.shift();
        if (!job) return;
        const url = `${PUBLIC_ASSET_BASE}/${job.relPath}`;
        const r = await probe(url);
        results.push({ ...job, ...r });
        done++;
        if (done % 100 === 0 || done === jobs.length) {
          const live = results.filter((x) => x.status === 200).length;
          const dead = results.filter((x) => x.status === 404).length;
          const blocked = results.filter((x) => x.status === 403).length;
          console.log(
            `  ${done}/${jobs.length}  200=${live}  404=${dead}  403=${blocked}`,
          );
        }
      }
    })(),
  );
}
await Promise.all(workers);

/* ─── Report ─── */

const counts = { 200: 0, 403: 0, 404: 0, other: 0, error: 0 };
for (const r of results) {
  if (r.status === 200) counts[200]++;
  else if (r.status === 403) counts[403]++;
  else if (r.status === 404) counts[404]++;
  else if (r.status === 0) counts.error++;
  else counts.other++;
}

const total = results.length;
const pct = (n) => ((n / total) * 100).toFixed(1) + "%";

console.log("");
console.log("═══════════════════════════════════════════════════════════════");
console.log(" CDN LIVENESS REPORT (anonymous HEAD)");
console.log("═══════════════════════════════════════════════════════════════");
console.log(` Total probed:  ${total}`);
console.log("");
console.log(` 200  LIVE                  ${String(counts[200]).padStart(5)}  (${pct(counts[200])})`);
console.log(` 403  MISSING_OR_KMS        ${String(counts[403]).padStart(5)}  (${pct(counts[403])})  → run signed HEAD to disambiguate`);
console.log(` 404  EXPLICITLY_NOT_FOUND  ${String(counts[404]).padStart(5)}  (${pct(counts[404])})  → produce + upload`);
console.log(` other                  ${String(counts.other).padStart(5)}  (${pct(counts.other)})`);
console.log(` error (network/abort)  ${String(counts.error).padStart(5)}  (${pct(counts.error)})`);
console.log("");

// Per-source breakdown
console.log("─── By manifest source ─────────────────────────────────────────");
const bySource = new Map();
for (const r of results) {
  if (!bySource.has(r.source)) {
    bySource.set(r.source, { 200: 0, 403: 0, 404: 0, other: 0, error: 0, total: 0 });
  }
  const row = bySource.get(r.source);
  if (r.status === 200) row[200]++;
  else if (r.status === 403) row[403]++;
  else if (r.status === 404) row[404]++;
  else if (r.status === 0) row.error++;
  else row.other++;
  row.total++;
}
const sourceRows = [...bySource.entries()].sort((a, b) => b[1].total - a[1].total);
console.log(
  " " +
    "source".padEnd(26) +
    "total".padStart(7) +
    "200".padStart(7) +
    "403".padStart(7) +
    "404".padStart(7) +
    "other".padStart(7),
);
for (const [src, row] of sourceRows) {
  console.log(
    " " +
      src.padEnd(26) +
      String(row.total).padStart(7) +
      String(row[200]).padStart(7) +
      String(row[403]).padStart(7) +
      String(row[404]).padStart(7) +
      String(row.other + row.error).padStart(7),
  );
}
console.log("");

// Sample of 403s — these are the "re-upload to fix" set.
const blocked = results.filter((r) => r.status === 403);
if (blocked.length > 0) {
  console.log("─── 403 sample (up to 10) — missing OR KMS-encrypted ──────────");
  for (const r of blocked.slice(0, 10)) {
    console.log(`  ${r.relPath}`);
  }
  if (blocked.length > 10) {
    console.log(`  … and ${blocked.length - 10} more.`);
  }
  console.log("");
}

// Sample of 404s — these need actual production.
const dead = results.filter((r) => r.status === 404);
if (dead.length > 0) {
  console.log("─── 404 sample (up to 10) — not in bucket ──────────────────────");
  for (const r of dead.slice(0, 10)) {
    console.log(`  ${r.relPath}`);
  }
  if (dead.length > 10) {
    console.log(`  … and ${dead.length - 10} more.`);
  }
  console.log("");
}

// Write JSON for follow-up tooling.
const reportPath = join(REPO_ROOT, "asset-liveness-report.json");
await writeFile(
  reportPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      base: PUBLIC_ASSET_BASE,
      total,
      counts,
      bySource: Object.fromEntries(bySource),
      results,
    },
    null,
    2,
  ),
);
console.log(`Wrote ${reportPath}`);
