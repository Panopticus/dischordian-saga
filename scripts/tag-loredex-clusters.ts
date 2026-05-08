/* ═══════════════════════════════════════════════════════
   TAG LOREDEX CLUSTERS — audit/14.F1

   One-shot tagger that adds `cluster` field to LOREDEX
   concept entries based on name + bio keyword heuristics.
   Idempotent — re-running with the same heuristics produces
   the same output. Existing cluster values are preserved
   (manual writer overrides win).

   Usage:
     pnpm tsx scripts/tag-loredex-clusters.ts

   The cluster taxonomy is the five buckets named in audit/
   14.F1's plan; concepts that don't match any bucket stay
   un-clustered (cluster: ""). Future content can re-cluster.
   ═══════════════════════════════════════════════════════ */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const DATA_PATH = resolve(
  process.cwd(),
  "apps/client/src/data/loredex-data.json",
);

type ClusterId =
  | "imprint_mechanics"
  | "witnessing_doctrine"
  | "audit_discipline"
  | "seer_method"
  | "lionism_ethics"
  | "";

interface Entry {
  id: string;
  type?: string;
  name: string;
  bio?: string;
  cluster?: string;
  [key: string]: unknown;
}

interface ClusterRule {
  id: ClusterId;
  /** Lowercased substrings that, when found in name or first ~400 chars of bio, classify the entry. */
  keywords: readonly string[];
}

/* Order matters — first matching rule wins. Place specific
 * keywords before broad ones (e.g. "iron lion" must match
 * lionism_ethics before generic "imprint" pulls it into
 * imprint_mechanics). */
const RULES: readonly ClusterRule[] = [
  {
    id: "lionism_ethics",
    keywords: [
      "iron lion",
      "lionism",
      "mercy killing",
      "lion's law",
      "lion principle",
    ],
  },
  {
    id: "seer_method",
    keywords: [
      "seer",
      "sealed letter",
      "prophecy",
      "variant prophecy",
      "seam discipline",
      "unread prophecy",
      "recorded warning",
    ],
  },
  {
    id: "witnessing_doctrine",
    keywords: [
      "witnessing",
      "three-witnesses",
      "completed witnessing",
      "witness arrival",
      "self-witnessing",
      "one-night witness",
      "engineer-witness",
      "witness clause",
    ],
  },
  {
    id: "imprint_mechanics",
    keywords: [
      "imprint",
      "dream-loom",
      "threshold doctrine",
      "resonance",
      "imprint set",
    ],
  },
  {
    id: "audit_discipline",
    keywords: [
      "audit",
      "audit legibility",
      "annual audit",
      "compliance",
      "settlement at empty table",
      "brokerage line",
      "discretion clause",
      "ledger",
      "tribunal",
    ],
  },
];

function classify(entry: Entry): ClusterId {
  const name = entry.name.toLowerCase();
  const bioHead = (entry.bio ?? "").toLowerCase().slice(0, 400);
  for (const rule of RULES) {
    for (const kw of rule.keywords) {
      if (name.includes(kw) || bioHead.includes(kw)) {
        return rule.id;
      }
    }
  }
  return "";
}

function main() {
  const raw = JSON.parse(readFileSync(DATA_PATH, "utf-8")) as {
    entries: Entry[];
    relationships?: unknown[];
  };

  let touched = 0;
  let preserved = 0;
  const tally: Record<string, number> = {};

  for (const e of raw.entries) {
    if (e.type !== "concept") continue;
    if (e.cluster && e.cluster.length > 0) {
      preserved++;
      tally[e.cluster] = (tally[e.cluster] ?? 0) + 1;
      continue;
    }
    const cluster = classify(e);
    if (cluster) {
      e.cluster = cluster;
      touched++;
      tally[cluster] = (tally[cluster] ?? 0) + 1;
    }
  }

  writeFileSync(DATA_PATH, JSON.stringify(raw, null, 2) + "\n");

  console.log(`tag-loredex-clusters: ${touched} concepts tagged, ${preserved} preserved.`);
  console.log("Cluster tally:");
  for (const [cid, n] of Object.entries(tally).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cid}: ${n}`);
  }
  const totalConcepts = raw.entries.filter((e) => e.type === "concept").length;
  console.log(
    `Coverage: ${touched + preserved}/${totalConcepts} concepts (${(((touched + preserved) / totalConcepts) * 100).toFixed(1)}%)`,
  );
}

main();
