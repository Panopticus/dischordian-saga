/**
 * LoredexClusterView — thematic-thread browser.
 *
 * audit/16 PR 5 (Cluster Co5 — Conspiracy persona).
 *
 * The five thematic clusters in loredex-data.json (imprint mechanics,
 * witnessing doctrine, audit discipline, seer method, lionism
 * ethics) were tagged for filtering in SearchPage but never had a
 * dedicated view that surfaces them as a curated reading list.
 * This page is that view — five cards, one per cluster, each
 * showing entry count + a 3-entry sample + a link into SearchPage
 * with the cluster pre-applied.
 *
 * Pure read-only surface; no DB writes; no API calls.
 */

import { useMemo } from "react";
import { Link } from "wouter";
import { ChevronLeft, BookOpen, ArrowRight } from "lucide-react";
import { useLoredex } from "@/contexts/LoredexContext";
import {
  LOREDEX_CLUSTER_LABELS,
  LOREDEX_CLUSTER_ORDER,
  type LoredexClusterId,
} from "@shared/loredexClusters";

interface ClusterDescriptor {
  id: LoredexClusterId;
  label: string;
  blurb: string;
}

/** One-line authorial framing per cluster. Drives the dossier
 *  voice on each card so this page reads as a reference, not a
 *  database dump. */
const CLUSTER_BLURBS: Readonly<Record<LoredexClusterId, string>> = {
  seer_method: "How the Seer Method reads what other methods miss.",
  audit_discipline: "What the Audit looked at and how it stayed honest.",
  lionism_ethics: "Lionism's ethics — the Iron Lion's hard line.",
  imprint_mechanics: "The mechanics of imprinting, allegiance, and persistence.",
  witnessing_doctrine: "The doctrine of witnessing, on the page and the floor.",
};

export default function LoredexClusterView() {
  const { entries, discoveredIds } = useLoredex();

  /** Per-cluster cache — entry count, sample names (max 3, only
   *  discovered), total discovered, total declared. */
  const perCluster = useMemo(() => {
    const map = new Map<
      string,
      { discovered: number; declared: number; samples: string[] }
    >();
    for (const cid of LOREDEX_CLUSTER_ORDER) {
      map.set(cid, { discovered: 0, declared: 0, samples: [] });
    }
    for (const e of entries) {
      if (e.type !== "concept") continue;
      const cluster = e.cluster as string | undefined;
      if (!cluster) continue;
      const slot = map.get(cluster);
      if (!slot) continue;
      slot.declared += 1;
      if (discoveredIds.has(e.id)) {
        slot.discovered += 1;
        if (slot.samples.length < 3) slot.samples.push(e.name);
      }
    }
    return map;
  }, [entries, discoveredIds]);

  const descriptors: ClusterDescriptor[] = LOREDEX_CLUSTER_ORDER.map((id) => ({
    id,
    label: LOREDEX_CLUSTER_LABELS[id],
    blurb: CLUSTER_BLURBS[id],
  }));

  return (
    <div className="min-h-screen w-full bg-black text-white/85 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/loredex"
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 hover:text-white/70 transition-colors mb-6"
        >
          <ChevronLeft size={12} /> back to loredex
        </Link>

        <header className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            loredex · thematic threads
          </p>
          <h1 className="font-serif text-3xl text-white/90 mt-1 flex items-center gap-2">
            <BookOpen size={22} className="void-text-energy" />
            Thematic Threads
          </h1>
          <p className="font-mono text-xs text-white/50 mt-3 leading-relaxed">
            Five clusters across the Loredex's concept entries. Each
            card opens the full reading list with the cluster filter
            pre-applied.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="loredex-cluster-grid">
          {descriptors.map((d) => {
            const slot = perCluster.get(d.id) ?? { discovered: 0, declared: 0, samples: [] };
            return (
              <Link
                key={d.id}
                href={`/loredex/search?type=concept&cluster=${d.id}`}
                className="group block rounded-xl border void-border bg-black/40 p-5 hover:bg-amber-950/10 transition-colors"
                data-testid={`cluster-card-${d.id}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="font-serif text-lg void-text-energy">
                    {d.label}
                  </h2>
                  <ArrowRight
                    size={16}
                    className="text-white/30 group-hover:text-white/70 transition-colors mt-1 shrink-0"
                  />
                </div>
                <p className="font-mono text-[11px] text-white/55 leading-relaxed mb-3">
                  {d.blurb}
                </p>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest void-text-energy">
                    {slot.discovered}/{slot.declared} discovered
                  </span>
                </div>
                {slot.samples.length > 0 && (
                  <p className="font-mono text-[10px] text-white/40 italic">
                    e.g. {slot.samples.join(" · ")}
                  </p>
                )}
                {slot.samples.length === 0 && slot.declared > 0 && (
                  <p className="font-mono text-[10px] text-white/30 italic">
                    No entries discovered yet. Read on.
                  </p>
                )}
                {slot.declared === 0 && (
                  <p className="font-mono text-[10px] text-white/30 italic">
                    No tagged entries.
                  </p>
                )}
              </Link>
            );
          })}
        </div>

        <p className="font-mono text-[10px] text-white/30 mt-8 text-center">
          Each cluster is a perspective — read them as essays, not as taxonomy.
        </p>
      </div>
    </div>
  );
}
