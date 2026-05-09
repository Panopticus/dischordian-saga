/**
 * INVESTIGATION BOARD — Cluster A landing page (audit/16 PR 11).
 *
 * The audit'd "single biggest player-experience win" from
 * AUDIT_15_TRACKER.md. Renders four cohesive surfaces that
 * activate schemas already shipped in earlier PRs:
 *
 *  - Open Threads: active puzzle chains + dependency exposure
 *      via prerequisiteChains (Co8 / PR #528) + dependsOnClues
 *      (ER6 / PR #528)
 *  - Manuscript Vault: discovered Editor manuscript entries
 *      via getDiscoveredManuscriptEntries (Co1 / PR #529)
 *  - The Reconstruction (post-game): metariddle commentary
 *      (Co2 / PR #529) + accessible unreachables (Co7 / PR #529)
 *  - Thematic Threads: pivots into LoredexClusterView
 *      (Co5 / PR #525)
 *
 * MVP scope: list-and-link rendering, no SVG yarn-diagram yet.
 * The audit's full vision is a force-directed yarn graph; this
 * page lands the data surfaces + hooks; the visual layer is
 * queued for a follow-up.
 */

import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ChevronLeft, BookOpen, Scroll, ListTree, Layers,
  Lock, Sparkles,
} from "lucide-react";
import { useLoredex } from "@/contexts/LoredexContext";
import { useGame } from "@/contexts/GameContext";
import { getDiscoveredManuscriptEntries } from "@shared/manuscriptVault";
import {
  RIDDLE_COMMENTARY,
  getMetariddles,
} from "@shared/riddleCommentary";
import { getRegisteredUnreachables } from "@shared/accessibleUnreachables";
import { getActivePuzzleChains } from "@/game/adventureFeatures";
import { InvestigationYarnDiagram } from "@/components/InvestigationYarnDiagram";

type TabId = "open_threads" | "manuscript_vault" | "reconstruction";

interface TabDescriptor {
  id: TabId;
  label: string;
  icon: typeof BookOpen;
  /** When true, the tab is gated until the player has reached
   *  the post-game state (saga finale flag). */
  postGameOnly?: boolean;
}

const TABS: readonly TabDescriptor[] = [
  { id: "open_threads", label: "Open Threads", icon: ListTree },
  { id: "manuscript_vault", label: "Manuscript Vault", icon: Scroll },
  { id: "reconstruction", label: "Reconstruction", icon: BookOpen, postGameOnly: true },
];

export default function InvestigationBoardPage() {
  const { state } = useGame();
  const { discoveredIds } = useLoredex();
  const [activeTab, setActiveTab] = useState<TabId>("open_threads");

  // Player state used by every tab.
  const collectedClueIds = useMemo(
    () => new Set<string>(discoveredIds),
    [discoveredIds],
  );
  const narrativeFlags = useMemo(
    () =>
      new Set(
        Object.entries(state.narrativeFlags ?? {})
          .filter(([, v]) => v)
          .map(([k]) => k),
      ),
    [state.narrativeFlags],
  );

  // The Reconstruction tab is gated on saga-completion flag.
  // Players who haven't finished the game shouldn't be spoiled
  // by the post-game reveals.
  const sagaComplete = narrativeFlags.has("act_7_complete");

  return (
    <div className="min-h-screen w-full bg-black text-white/85 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/loredex"
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 hover:text-white/70 transition-colors mb-6"
        >
          <ChevronLeft size={12} /> back to loredex
        </Link>

        <header className="mb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            loredex · investigation board
          </p>
          <h1 className="font-serif text-3xl text-white/90 mt-1 flex items-center gap-2">
            <ListTree size={22} className="void-text-energy" />
            Investigation Board
          </h1>
          <p className="font-mono text-xs text-white/50 mt-3 leading-relaxed">
            Cross-room investigation surface. Track open threads,
            review manuscript fragments, reconstruct the saga's
            quiet places (post-game).
          </p>
        </header>

        {/* Tab rail */}
        <div className="flex gap-1 mb-6 border-b void-border" data-testid="investigation-tab-rail">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const gated = tab.postGameOnly && !sagaComplete;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => !gated && setActiveTab(tab.id)}
                disabled={gated}
                className={`px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 border-b-2 transition-colors ${
                  isActive
                    ? "void-text-energy border-white/30"
                    : "text-white/40 border-transparent hover:text-white/70"
                } ${gated ? "opacity-30 cursor-not-allowed" : ""}`}
                data-testid={`tab-${tab.id}`}
                data-active={isActive ? "true" : "false"}
                data-gated={gated ? "true" : "false"}
              >
                <Icon size={12} />
                {tab.label}
                {gated && <Lock size={10} />}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTab === "open_threads" && (
          <OpenThreadsTab
            narrativeFlags={state.narrativeFlags ?? {}}
            collectedClues={collectedClueIds}
          />
        )}
        {activeTab === "manuscript_vault" && (
          <ManuscriptVaultTab
            collectedClueIds={collectedClueIds}
            narrativeFlags={narrativeFlags}
          />
        )}
        {activeTab === "reconstruction" && sagaComplete && (
          <ReconstructionTab narrativeFlags={narrativeFlags} />
        )}

        {/* Cross-link to the Co5 thematic-threads view */}
        <div className="mt-10 pt-6 border-t void-border text-center">
          <Link
            href="/loredex/clusters"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 hover:void-text-energy transition-colors"
          >
            <Layers size={12} /> Thematic Threads →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── OPEN THREADS TAB ─────────────────────────────────── */

function OpenThreadsTab({
  narrativeFlags,
  collectedClues,
}: {
  narrativeFlags: Record<string, boolean>;
  collectedClues: ReadonlySet<string>;
}) {
  const active = useMemo(
    () => getActivePuzzleChains(narrativeFlags),
    [narrativeFlags],
  );

  // Derive a coarse "solved" set from the existing chain
  // completion flags. Each PuzzleChainStep has a
  // completionFlag; if a chain's LAST step's flag is set,
  // the chain is considered solved.
  const solvedChainIds = useMemo(() => {
    const out = new Set<string>();
    for (const { chain, currentStep } of active) {
      if (currentStep >= chain.steps.length) out.add(chain.id);
    }
    return out;
  }, [active]);

  if (active.length === 0) {
    return (
      <div className="rounded-lg border void-border bg-black/40 p-8 text-center">
        <Sparkles size={24} className="mx-auto text-white/30 mb-2" />
        <p className="font-mono text-xs text-white/50">
          No active investigations. Start a thread by examining
          rooms or talking to the crew.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* audit/16 PR 26 (Cluster A polish) — force-directed yarn
          diagram. The audit'd "single biggest player-experience
          win" visual: clues + puzzles connected by red string.
          Pure SVG; force-layout from apps/shared/forceLayout.ts. */}
      <InvestigationYarnDiagram
        narrativeFlags={narrativeFlags}
        collectedClues={collectedClues}
        solvedPuzzles={solvedChainIds}
      />
      <div className="space-y-3" data-testid="open-threads-list">
      {active.map(({ chain, currentStep }) => {
        const totalSteps = chain.steps.length;
        const progress = (currentStep / totalSteps) * 100;
        return (
          <div
            key={chain.id}
            className="rounded-lg border void-border bg-black/40 p-4"
            data-testid={`thread-${chain.id}`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-display text-base void-text-energy">
                {chain.name}
              </h3>
              <span className="font-mono text-[10px] text-white/40 shrink-0">
                {currentStep}/{totalSteps}
              </span>
            </div>
            <div className="h-1 rounded-full bg-white/5 mb-3 overflow-hidden">
              <div
                className="h-full bg-[var(--energy-primary)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <ol className="space-y-1.5 font-mono text-[11px]">
              {chain.steps.map((step, i) => {
                const done = i < currentStep;
                const next = i === currentStep;
                return (
                  <li
                    key={step.step}
                    className={`flex items-start gap-2 ${
                      done ? "text-white/30 line-through" : next ? "void-text-energy" : "text-white/50"
                    }`}
                    data-testid={`thread-step-${chain.id}-${i}`}
                    data-state={done ? "done" : next ? "active" : "pending"}
                  >
                    <span className="font-mono text-[9px] mt-0.5 w-4">
                      {done ? "✓" : next ? "→" : "·"}
                    </span>
                    <span>{step.description}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        );
      })}
      </div>
    </div>
  );
}

/* ─── MANUSCRIPT VAULT TAB ─────────────────────────────── */

function ManuscriptVaultTab({
  collectedClueIds,
  narrativeFlags,
}: {
  collectedClueIds: ReadonlySet<string>;
  narrativeFlags: ReadonlySet<string>;
}) {
  const entries = useMemo(
    () =>
      getDiscoveredManuscriptEntries({
        collectedClueIds,
        narrativeFlags,
      }),
    [collectedClueIds, narrativeFlags],
  );

  if (entries.length === 0) {
    return (
      <div className="rounded-lg border void-border bg-black/40 p-8 text-center" data-testid="vault-empty">
        <Scroll size={24} className="mx-auto text-white/30 mb-2" />
        <p className="font-mono text-xs text-white/50 leading-relaxed">
          The vault is empty. Collect cross-room evidence of the
          Editor's hand and the manuscript will surface,
          fragment by fragment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="vault-entries">
      {entries.map((entry) => (
        <article
          key={entry.id}
          className="rounded-lg border void-border bg-gradient-to-b from-amber-950/20 to-black/40 p-5"
          data-testid={`vault-entry-${entry.id}`}
        >
          <header className="mb-2">
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">
              {entry.tier}
            </p>
            <h3 className="font-serif text-xl void-text-energy mt-1">
              {entry.title}
            </h3>
          </header>
          <div className="font-serif text-sm text-white/80 leading-relaxed whitespace-pre-line">
            {entry.body}
          </div>
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30 mt-3">
            — {entry.attribution}
          </p>
        </article>
      ))}
    </div>
  );
}

/* ─── RECONSTRUCTION TAB (post-game) ───────────────────── */

function ReconstructionTab({
  narrativeFlags,
}: {
  narrativeFlags: ReadonlySet<string>;
}) {
  const metariddles = useMemo(() => getMetariddles(), []);
  const unreachables = useMemo(
    () => getRegisteredUnreachables(narrativeFlags),
    [narrativeFlags],
  );

  return (
    <div className="space-y-8" data-testid="reconstruction-tab">
      {/* Metariddle commentary */}
      <section>
        <h2 className="font-display text-lg void-text-energy mb-3 flex items-center gap-2">
          <Sparkles size={16} />
          Riddle Confessions
        </h2>
        <p className="font-mono text-[11px] text-white/50 mb-4 leading-relaxed">
          The riddles you solved had answers. The answers
          had reasons. Now (game over) the reasons can speak.
        </p>
        <div className="space-y-3">
          {metariddles.map((entry) => (
            <article
              key={entry.puzzleId}
              className="rounded-lg border void-border bg-black/40 p-4"
              data-testid={`metariddle-${entry.puzzleId}`}
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40 mb-2">
                {entry.puzzleId} · attributed to{" "}
                <span className="void-text-energy">{entry.attributedTo}</span>
              </p>
              <p className="font-serif text-sm text-white/80 leading-relaxed">
                {entry.commentary}
              </p>
            </article>
          ))}
          {metariddles.length === 0 && (
            <p className="font-mono text-xs text-white/40 italic">
              No metariddle commentary registered. (Authors
              extend RIDDLE_COMMENTARY to add entries.)
            </p>
          )}
        </div>
      </section>

      {/* Accessible unreachables */}
      <section>
        <h2 className="font-display text-lg void-text-energy mb-3 flex items-center gap-2">
          <Lock size={16} />
          What You Saw and Couldn&apos;t Reach
        </h2>
        <p className="font-mono text-[11px] text-white/50 mb-4 leading-relaxed">
          The seals you accepted. The doors that stayed shut.
          The names beyond the touchable few. Memorial work
          outlasts the visit.
        </p>
        <div className="space-y-3">
          {unreachables.map((entry) => (
            <article
              key={entry.id}
              className="rounded-lg border void-border bg-black/40 p-4"
              data-testid={`unreachable-${entry.id}`}
            >
              <header className="mb-2">
                <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">
                  {entry.kind.replace(/_/g, " ")} · {entry.roomId}
                </p>
                <h3 className="font-serif text-base void-text-energy mt-1">
                  {entry.label}
                </h3>
              </header>
              <p className="font-serif text-[13px] text-white/60 italic mb-2">
                {entry.inGameDescription}
              </p>
              <p className="font-serif text-sm text-white/85 leading-relaxed">
                {entry.postGameReveal}
              </p>
            </article>
          ))}
          {unreachables.length === 0 && (
            <p className="font-mono text-xs text-white/40 italic">
              No registered unreachables. Some doors are still
              ahead of you.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
