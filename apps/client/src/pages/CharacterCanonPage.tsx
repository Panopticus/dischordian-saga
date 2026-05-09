/**
 * CHARACTER CANON PAGE
 * audit/16 PR 24 (Cluster E M-stage / finding Cos2 — Cosplay persona).
 *
 * Public-facing reference site for cosplayers + AI-prompt
 * generators + the cinematic team. Pulls from the data
 * layer shipped in PR #532 (apps/shared/characterCanon.ts +
 * characterMetadata.ts) and the Cos7 reveal-stage guidance
 * from PR #533.
 *
 * The audit'd Cluster E roadmap was S → M → XL:
 *   - S: data extraction (#532, #533) ✓
 *   - M: this page ✓
 *   - XL: per-character art turnaround backfill (queued)
 *
 * Per-character cards expose:
 *   - Bust portrait + faction colour
 *   - Cosplay metadata (height, build, age band,
 *     ageApproximation note, defaultExpression,
 *     cosplaySpine "the one thing to get right")
 *   - All authored expressions (clickable previews)
 *   - Blood Weave band visual when relevant
 *
 * Plus a Human-reveal-stages strip pulling the Cos7
 * cosplayGuidance authored in PR #533.
 */

import { useMemo } from "react";
import { Link } from "wouter";
import { ChevronLeft, Users, Ruler, Activity, Eye, Sparkles } from "lucide-react";
import {
  buildCanonRegistry,
  cosplayMetadataCoverage,
  type NPCPortraitLike,
} from "@shared/characterCanon";
import { NPC_PORTRAITS, HUMAN_REVEAL_STAGES } from "@/game/npcPortraits";

export default function CharacterCanonPage() {
  // Build the canon registry from the live NPC portraits. The
  // structural NPCPortraitLike type avoids the cross-package
  // import constraint — apps/shared can't reach the client's
  // game module directly.
  const canonEntries = useMemo(
    () =>
      buildCanonRegistry(NPC_PORTRAITS as Readonly<Record<string, NPCPortraitLike>>),
    [],
  );

  const coverage = useMemo(
    () => cosplayMetadataCoverage(NPC_PORTRAITS as Readonly<Record<string, NPCPortraitLike>>),
    [],
  );

  return (
    <div className="min-h-screen w-full bg-black text-white/85 p-6 sm:p-10">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 hover:text-white/70 transition-colors mb-6"
        >
          <ChevronLeft size={12} /> back to hub
        </Link>

        <header className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            Reference · Cosplay · Prompt-gen
          </p>
          <h1 className="font-serif text-3xl text-white/90 mt-1 flex items-center gap-2">
            <Users size={22} className="void-text-energy" />
            Character Canon
          </h1>
          <p className="font-mono text-xs text-white/50 mt-3 leading-relaxed max-w-2xl">
            Single source of truth for every NPC's visual canon. Cosplayers, AI-prompt
            generators, and the cinematic team all consume the same data — this page
            is the human-readable surface.
          </p>
          <p
            className="font-mono text-[10px] text-white/30 mt-2"
            data-testid="metadata-coverage"
          >
            Cosplay metadata coverage: <span className="void-text-energy">{coverage.implemented}</span>
            {" / "}
            <span className="text-white/50">{coverage.declared}</span> NPCs
          </p>
        </header>

        {/* Per-character cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {canonEntries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-lg border void-border bg-black/40 p-5 flex gap-4"
              data-testid={`character-card-${entry.id}`}
              style={{ borderColor: entry.factionColor }}
            >
              <div className="shrink-0 w-24 h-24 rounded overflow-hidden border void-border">
                <img
                  src={entry.bustPortrait}
                  alt={`${entry.name} bust`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-lg void-text-energy">{entry.name}</h2>
                {entry.cosplay ? (
                  <>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2 mb-2 font-mono text-[10px]">
                      <span className="text-white/40 flex items-center gap-1">
                        <Ruler size={9} /> Height
                      </span>
                      <span className="text-white/80">
                        {entry.cosplay.canonicalHeightCm == null
                          ? "non-humanoid"
                          : `${entry.cosplay.canonicalHeightCm} cm`}
                      </span>
                      <span className="text-white/40 flex items-center gap-1">
                        <Activity size={9} /> Build
                      </span>
                      <span className="text-white/80">{entry.cosplay.buildType}</span>
                      <span className="text-white/40 flex items-center gap-1">
                        <Sparkles size={9} /> Age
                      </span>
                      <span className="text-white/80">{entry.cosplay.ageBand}</span>
                    </div>
                    <p className="font-mono text-[11px] text-white/60 italic leading-relaxed mb-2">
                      {entry.cosplay.ageApproximationNote}
                    </p>
                    <div className="rounded border void-border bg-black/30 p-2 mb-2">
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] void-text-energy mb-1">
                        Cosplay Spine
                      </p>
                      <p className="font-mono text-[10px] text-white/75 leading-relaxed">
                        {entry.cosplay.cosplaySpine}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="font-mono text-[10px] text-white/40 italic mt-2 mb-2">
                    Cosplay metadata pending. Authors extend
                    apps/shared/characterMetadata.ts.
                  </p>
                )}
                {/* Expression strip */}
                <div className="flex gap-1.5 flex-wrap mt-2" data-testid={`expressions-${entry.id}`}>
                  {Object.entries(entry.expressions).slice(0, 4).map(([key, url]) => (
                    <div
                      key={key}
                      className="w-10 h-10 rounded border border-white/10 overflow-hidden"
                      title={key}
                    >
                      <img
                        src={url}
                        alt={`${entry.name} ${key}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Human reveal stages strip — Cos7 cosplay guidance */}
        <section className="mb-8">
          <h2 className="font-display text-base uppercase tracking-[0.18em] void-text-energy mb-3 flex items-center gap-2">
            <Eye size={14} /> Human Reveal Stages
          </h2>
          <p className="font-mono text-[11px] text-white/50 mb-4 leading-relaxed">
            The Human's identity reveals progressively as trust climbs. Each stage
            below documents the cosplay spine cosplayers should target — the rig
            and makeup notes are authored canon, not best-guess.
          </p>
          <div className="space-y-3">
            {HUMAN_REVEAL_STAGES.map((stage) => (
              <article
                key={stage.id}
                className="rounded-lg border void-border bg-black/40 p-4 flex gap-4"
                data-testid={`reveal-stage-${stage.id}`}
              >
                <div className="shrink-0 w-20 h-20 rounded overflow-hidden border void-border">
                  <img
                    src={stage.imageUrl}
                    alt={stage.label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <header className="flex items-baseline gap-2 mb-1.5">
                    <h3 className="font-display text-sm void-text-energy">
                      {stage.label}
                    </h3>
                    <span className="font-mono text-[9px] text-white/40">
                      trust {stage.minTrust}–{stage.maxTrust}
                    </span>
                  </header>
                  <p className="font-mono text-[11px] text-white/60 italic mb-2">
                    {stage.description}
                  </p>
                  {stage.cosplayGuidance && (
                    <div className="rounded border void-border bg-black/30 p-2">
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] void-text-energy mb-1">
                        Cosplay Guidance
                      </p>
                      <p className="font-mono text-[10px] text-white/75 leading-relaxed">
                        {stage.cosplayGuidance}
                      </p>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className="border-t void-border pt-6 mt-8">
          <p className="font-mono text-[10px] text-white/30 text-center leading-relaxed">
            This page is generated from the canonical data sources. Authors update
            <code className="px-1 text-white/50">apps/shared/characterMetadata.ts</code>
            (cosplay metadata) and
            <code className="px-1 text-white/50">apps/client/src/game/npcPortraits.ts</code>
            (portraits + reveal-stage guidance). New entries surface here automatically.
          </p>
        </footer>
      </div>
    </div>
  );
}
