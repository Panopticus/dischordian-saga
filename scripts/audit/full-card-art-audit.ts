/**
 * Full card-art audit — extracts every card def's `art:` reference,
 * resolves it to a CDN URL through whichever resolver the def uses
 * (`assetUrl`, `art`, or `sigArt`), and HEAD-checks each URL against
 * the dgrsart bucket. Emits two files:
 *
 *   audit/ship-readiness-2026-05-22/full-card-art-audit.tsv
 *     One row per (cardDef, art URL, status) — for diffing against
 *     subsequent runs.
 *
 *   audit/ship-readiness-2026-05-22/full-card-art-audit.missing.json
 *     One entry per MISSING card with full metadata pulled from its
 *     def file (name, faction, cost, baseStats, keywords, flavorText,
 *     trial_categories) — drives the commission-prompts generator.
 *
 * Run:
 *   pnpm tsx scripts/audit/full-card-art-audit.ts
 *   pnpm tsx scripts/audit/full-card-art-audit.ts --live-head=N    # cap live HEADs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, relative } from "node:path";

const REPO_ROOT = resolve(import.meta.dirname, "..", "..");
const DEFS_ROOT = join(REPO_ROOT, "apps/shared/tcg-core/cards/definitions");
const INVENTORY_PATH = join(REPO_ROOT, "audit/ship-readiness-2026-05-22/cdn-inventory.tsv");
const OUT_TSV = join(REPO_ROOT, "audit/ship-readiness-2026-05-22/full-card-art-audit.tsv");
const OUT_JSON = join(REPO_ROOT, "audit/ship-readiness-2026-05-22/full-card-art-audit.missing.json");

const CDN_BASE = "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/";

// ─── Phase 0: load CDN inventory snapshot ───────────────────────────
const inventory = new Set<string>();
for (const line of readFileSync(INVENTORY_PATH, "utf-8").split("\n")) {
  const key = line.split("\t")[0];
  if (key) inventory.add(key);
}
console.log(`[audit] inventory snapshot: ${inventory.size} keys`);

// ─── Phase 1: resolve the s2_hierarchy `art()` manifest ────────────
// The manifest is just a TypeScript array literal of {assetId, relPath}
// — we don't need to actually execute it, we can parse the assetId →
// relPath map by source inspection.
function loadHierarchyManifest(): Map<string, string> {
  const src = readFileSync(join(REPO_ROOT, "apps/shared/expansionArt/hierarchyOfDamned.ts"), "utf-8");
  const map = new Map<string, string>();
  // Entries look like:
  //   { assetId: "s2_hierarchy_dir_jira_ghoul", rarity: "rare",
  //     relPath: "art/expansions/hierarchy-of-damned/rare/s2_hierarchy_dir_jira_ghoul.webp", ... }
  const re = /assetId:\s*"([^"]+)"[\s\S]*?relPath:\s*"([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) map.set(m[1], m[2]);
  return map;
}
const HIERARCHY_MAP = loadHierarchyManifest();
console.log(`[audit] hierarchy manifest: ${HIERARCHY_MAP.size} entries`);

// ─── Phase 2: walk all card defs, extract refs ─────────────────────
interface ArtRef {
  defPath: string;
  resolver: "assetUrl" | "art" | "sigArt";
  raw: string;
  cdnKey: string | null;
  cdnUrl: string | null;
  failure?: string;
}

function walkDirSync(dir: string, acc: string[] = []): string[] {
  for (const ent of readdirSync(dir)) {
    const p = join(dir, ent);
    const st = statSync(p);
    if (st.isDirectory()) walkDirSync(p, acc);
    else if (p.endsWith(".ts") && !p.endsWith(".test.ts")) acc.push(p);
  }
  return acc;
}

const defFiles = walkDirSync(DEFS_ROOT);
console.log(`[audit] card def files: ${defFiles.length}`);

const refs: ArtRef[] = [];
for (const f of defFiles) {
  const src = readFileSync(f, "utf-8");
  const relF = relative(REPO_ROOT, f);

  // Pattern A: art: assetUrl("...")
  const reA = /art:\s+assetUrl\("([^"]+)"\)/g;
  let m: RegExpExecArray | null;
  while ((m = reA.exec(src))) {
    refs.push({
      defPath: relF, resolver: "assetUrl", raw: m[1],
      cdnKey: m[1], cdnUrl: CDN_BASE + m[1],
    });
  }

  // Pattern B: art: art("hierarchy_asset_id")
  const reB = /art:\s+art\("([^"]+)"\)/g;
  while ((m = reB.exec(src))) {
    const relPath = HIERARCHY_MAP.get(m[1]) ?? null;
    refs.push({
      defPath: relF, resolver: "art", raw: m[1],
      cdnKey: relPath,
      cdnUrl: relPath ? CDN_BASE + relPath : null,
      failure: relPath ? undefined : "manifest miss",
    });
  }

  // Pattern C: art: sigArt(N, "light"|"dark")
  const reC = /art:\s+sigArt\((\d+),\s*"(light|dark)"\)/g;
  while ((m = reC.exec(src))) {
    const k = `art/guild-cutscenes/f4_abilities/cs_sig_${m[1]}_${m[2]}_start.png`;
    refs.push({
      defPath: relF, resolver: "sigArt", raw: `${m[1]}/${m[2]}`,
      cdnKey: k, cdnUrl: CDN_BASE + k,
    });
  }
}
console.log(`[audit] extracted ${refs.length} art refs`);

// ─── Phase 3: classify ───────────────────────────────────────────────
const args = process.argv.slice(2);
const liveCap = Number(args.find((a) => a.startsWith("--live-head="))?.split("=")[1] ?? "Infinity");

type Status = "OK_inventory" | "MISSING_manifest" | "needs_live" | "OK_live" | "MISSING_live";
const status = new Map<number, Status>();

const liveQueue: number[] = [];
for (let i = 0; i < refs.length; i++) {
  const r = refs[i];
  if (r.failure === "manifest miss") {
    status.set(i, "MISSING_manifest");
  } else if (r.cdnKey && inventory.has(r.cdnKey)) {
    status.set(i, "OK_inventory");
  } else {
    status.set(i, "needs_live");
    liveQueue.push(i);
  }
}
console.log(`[audit] in-inventory OK: ${[...status.values()].filter((s) => s === "OK_inventory").length}`);
console.log(`[audit] needs live HEAD: ${liveQueue.length}`);
console.log(`[audit] manifest miss: ${[...status.values()].filter((s) => s === "MISSING_manifest").length}`);

// ─── Phase 4: live HEAD checks (parallel, capped) ───────────────────
async function head(url: string): Promise<number> {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.status;
  } catch {
    return 0;
  }
}

async function runLive() {
  const concurrency = 16;
  const queue = [...liveQueue].slice(0, liveCap);
  let next = 0;
  let done = 0;
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (next < queue.length) {
        const myIdx = next++;
        const i = queue[myIdx];
        const r = refs[i];
        if (!r.cdnUrl) {
          status.set(i, "MISSING_live");
          continue;
        }
        const code = await head(r.cdnUrl);
        status.set(i, code === 200 ? "OK_live" : "MISSING_live");
        done++;
        if (done % 100 === 0) console.log(`[audit]   live HEAD ${done}/${queue.length}`);
      }
    }),
  );
}
await runLive();

// ─── Phase 5: emit TSV + missing JSON ──────────────────────────────
const tsv: string[] = ["defPath\tresolver\traw\tcdnKey\tstatus"];
for (let i = 0; i < refs.length; i++) {
  const r = refs[i];
  tsv.push([r.defPath, r.resolver, r.raw, r.cdnKey ?? "", status.get(i)].join("\t"));
}
writeFileSync(OUT_TSV, tsv.join("\n"));

// For MISSING entries, extract card metadata from the def source
interface Missing {
  defPath: string;
  cardId: string;
  cardName: string;
  faction: string;
  cardType: string;
  cost: string;
  baseStats: string;
  keywords: string[];
  rarity: string;
  flavorText: string;
  trial_categories: string[];
  cdnKey: string;
  resolver: string;
}

function extractCardMeta(src: string, defPath: string, raw: string, cdnKey: string, resolver: string): Missing[] {
  // A card definition is a top-level object with `id:` at the OUTER
  // indent level (typically 2 spaces). Ability ids live one nesting
  // level deeper inside `abilities: [{ id: ... }]`, which our naïve
  // slicer used to grab as if they were card ids — pinning each
  // missing art ref to the wrong "id" (an ability) and reading
  // (unnamed) because abilities don't have name/baseStats/etc.
  //
  // Fix: only treat `^  id:` (exactly two leading spaces) as a card
  // boundary. Card-def style across every multi-card file in the
  // repo uses 2-space indent for the outer object.
  const out: Missing[] = [];
  const idMatches = [...src.matchAll(/^ {2}id:\s*"([^"]+)"/gm)];
  // Build slices [from, to)
  const slices: Array<{ id: string; body: string }> = [];
  for (let i = 0; i < idMatches.length; i++) {
    const start = idMatches[i].index!;
    const end = i + 1 < idMatches.length ? idMatches[i + 1].index! : src.length;
    slices.push({ id: idMatches[i][1], body: src.slice(start, end) });
  }
  for (const s of slices) {
    // Match if the slice references this `raw` token
    const tok = resolver === "assetUrl" ? `"${raw}"` : raw;
    if (!s.body.includes(tok)) continue;
    out.push({
      defPath,
      cardId: s.id,
      cardName: s.body.match(/name:\s*"([^"]+)"/)?.[1] ?? "(unnamed)",
      faction: s.body.match(/faction:\s*([A-Z_a-z0-9"]+)/)?.[1]?.replace(/"/g, "") ?? "?",
      cardType: s.body.match(/cardType:\s*"([^"]+)"/)?.[1] ?? "?",
      cost: s.body.match(/cost:\s*(\d+)/)?.[1] ?? "?",
      baseStats: s.body.match(/baseStats:\s*\{([^}]+)\}/)?.[1]?.replace(/\s+/g, " ").trim() ?? "—",
      keywords: [...(s.body.match(/keywords:\s*\[([^\]]+)\]/)?.[1] ?? "").matchAll(/"([^"]+)"/g)].map((m) => m[1]),
      rarity: s.body.match(/rarity:\s*"([^"]+)"/)?.[1] ?? "?",
      flavorText: s.body.match(/flavorText:\s*\n?\s*"([^"]+)"/)?.[1]
        ?? s.body.match(/flavorText:\s*\n?\s*"([^"]*(?:\\.[^"]*)*)"/)?.[1] ?? "",
      trial_categories: [...(s.body.match(/trial_categories:\s*\[([^\]]+)\]/)?.[1] ?? "").matchAll(/"([^"]+)"/g)].map((m) => m[1]),
      cdnKey,
      resolver,
    });
  }
  return out;
}

const missing: Missing[] = [];
const seenCdnKeys = new Set<string>();
for (let i = 0; i < refs.length; i++) {
  const r = refs[i];
  const st = status.get(i);
  if (st !== "MISSING_live" && st !== "MISSING_manifest") continue;
  if (!r.cdnKey || seenCdnKeys.has(`${r.defPath}|${r.cdnKey}`)) continue;
  seenCdnKeys.add(`${r.defPath}|${r.cdnKey}`);
  const src = readFileSync(join(REPO_ROOT, r.defPath), "utf-8");
  missing.push(...extractCardMeta(src, r.defPath, r.raw, r.cdnKey, r.resolver));
}
writeFileSync(OUT_JSON, JSON.stringify(missing, null, 2));

console.log("");
console.log(`=== SUMMARY ===`);
const buckets = {
  OK_inventory: 0, OK_live: 0,
  MISSING_live: 0, MISSING_manifest: 0,
  needs_live: 0,
};
for (const s of status.values()) (buckets as any)[s]++;
for (const [k, v] of Object.entries(buckets)) console.log(`  ${k.padEnd(20)} ${v}`);
console.log(`  refs total            ${refs.length}`);
console.log(`  missing-card rows     ${missing.length}`);
console.log("");
console.log(`wrote ${OUT_TSV}`);
console.log(`wrote ${OUT_JSON}`);
