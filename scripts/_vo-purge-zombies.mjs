#!/usr/bin/env node
/* VO ZOMBIE PURGE — find manifest entries pointing at S3 audio that
   doesn't exist (HEAD → 4xx) AND whose id is unreferenced in runtime
   code, then drop them.

   Why: VO manifests have accumulated entries from earlier naming
   conventions whose audio was never uploaded and whose ids are no
   longer read by any code. They're dead weight that confuses the
   audit (which only checks key membership, not S3 reachability).

   "Runtime references" means an id appearing in any .ts/.tsx/.js/.jsx
   file under apps/shared, apps/client, apps/server, excluding test
   files (*.test.ts, *.spec.ts). References in markdown / CSV /
   generator scripts / tests are ignored — those are documentation,
   not consumers.

   Usage:
     node scripts/_vo-purge-zombies.mjs --dry-run   (default: prints plan)
     node scripts/_vo-purge-zombies.mjs --apply     (actually rewrite manifests)
     node scripts/_vo-purge-zombies.mjs --apply --keep-referenced
       (also keep entries whose id IS referenced in runtime — i.e.
        only purge truly-orphan ids; default behavior already does this)
*/
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SHARED = join(ROOT, "apps", "shared");

const APPLY = process.argv.includes("--apply");

/* ---------- 1. Collect all manifest URLs ---------- */
const manifests = readdirSync(SHARED).filter((f) => f.endsWith("VoManifest.json"));
const items = [];
const manifestData = {};
for (const f of manifests) {
  const path = join(SHARED, f);
  const j = JSON.parse(readFileSync(path, "utf-8"));
  manifestData[f] = j;
  for (const [id, url] of Object.entries(j)) {
    if (typeof url === "string" && url.startsWith("http")) {
      items.push({ manifest: f, id, url });
    }
  }
}
console.error(`HEAD-checking ${items.length} URLs across ${manifests.length} manifests...`);

/* ---------- 2. HEAD-check each URL (with retry on transients) ---------- */
async function checkOnce(url) {
  try {
    const r = await fetch(url, { method: "HEAD" });
    return r.status;
  } catch {
    return 0; // network/dns
  }
}
async function checkUrl(url) {
  // Only treat 4xx as "dead". Retry on 5xx / transient failures up to 3
  // times; treat persistent failures as alive (conservative — better
  // to keep a real entry than purge over a transient blip).
  for (let i = 0; i < 3; i++) {
    const s = await checkOnce(url);
    if (s >= 200 && s < 300) return { alive: true, status: s };
    if (s >= 400 && s < 500) return { alive: false, status: s };
    await new Promise((r) => setTimeout(r, 500 * (i + 1)));
  }
  return { alive: true, status: "timeout-treated-alive" };
}
const CONC = 30;
let cursor = 0;
const dead = [];
async function worker() {
  while (cursor < items.length) {
    const it = items[cursor++];
    const r = await checkUrl(it.url);
    if (!r.alive) dead.push({ ...it, status: r.status });
  }
}
await Promise.all(Array.from({ length: CONC }, worker));
console.error(`${dead.length} manifest URLs return 4xx`);

/* ---------- 3. Check runtime references for the dead ids ---------- */
function isReferenced(id) {
  // Use ripgrep / grep to scan only runtime source files. Exclude
  // tests, generators, manifests, csvs, markdown.
  try {
    const out = execSync(
      `grep -rl --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" -- "${id}" apps/shared apps/client apps/server 2>/dev/null || true`,
      { cwd: ROOT, encoding: "utf-8" },
    );
    const files = out.split("\n").filter(Boolean);
    return files.some((f) => !/\.(test|spec)\.(ts|tsx|js|jsx)$/.test(f));
  } catch {
    return false;
  }
}

const purgeable = [];
const kept = [];
for (const d of dead) {
  if (isReferenced(d.id)) kept.push(d);
  else purgeable.push(d);
}

/* ---------- 4. Report ---------- */
console.log(`\nPlan${APPLY ? "" : " (dry-run — pass --apply to write)"}:`);
console.log(`  ${purgeable.length} dead-and-unreferenced ids will be REMOVED from manifests`);
console.log(`  ${kept.length} dead but RUNTIME-referenced ids will be KEPT (need rendering, not deletion)`);

const purgeByManifest = {};
for (const p of purgeable) (purgeByManifest[p.manifest] ??= []).push(p.id);
const keptByManifest = {};
for (const k of kept) (keptByManifest[k.manifest] ??= []).push(k.id);

console.log("\n── Purgeable (zombies) ──");
for (const m of Object.keys(purgeByManifest).sort()) {
  console.log(`  ${m}: ${purgeByManifest[m].length}`);
  for (const id of purgeByManifest[m].sort()) console.log(`    ${id}`);
}
console.log("\n── Kept (referenced — these still need a generator) ──");
for (const m of Object.keys(keptByManifest).sort()) {
  console.log(`  ${m}: ${keptByManifest[m].length}`);
  for (const id of keptByManifest[m].sort()) console.log(`    ${id}`);
}

/* ---------- 5. Apply ---------- */
if (APPLY && purgeable.length) {
  for (const m of Object.keys(purgeByManifest)) {
    const path = join(SHARED, m);
    const j = manifestData[m];
    for (const id of purgeByManifest[m]) delete j[id];
    writeFileSync(path, JSON.stringify(j, null, 2) + "\n");
  }
  console.log(`\n✓ wrote ${Object.keys(purgeByManifest).length} manifest files`);
}
