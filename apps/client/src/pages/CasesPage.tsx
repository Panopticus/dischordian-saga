/* ═══════════════════════════════════════════════════════
   CASES PAGE — Mystery Engine player surface

   Mounts the SagaConspiracyBoard alongside an active-case
   header and a list of investigations the player can open.
   First playable surface for the Streamed Prism Mystery
   Engine (per docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md).

   Three regions:
     1. Active case header — current mystery + episode title;
        empty state when no case is open
     2. Available cases list — every authored mystery; "Open"
        button opens the case with the player's current lens
     3. SagaConspiracyBoard — tabbed per-arc evidence boards
        (CADES + Wraith Calder ship today)
   ═══════════════════════════════════════════════════════ */

import { ChevronLeft, Folder, FolderOpen, Users } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { SagaConspiracyBoard } from "@/components/SagaConspiracyBoard";
import { DeductionPanel } from "@/components/DeductionPanel";
import { ChoicePanel } from "@/components/ChoicePanel";
import { CaseRecap } from "@/components/CaseRecap";
import { TrustScalars } from "@/components/TrustScalars";
import {
  TrustVoiceLine,
  WRAITH_CALDER_LINES,
  JERICHO_JONES_LINES,
  THE_SEER_LINES,
  VEX_SOLENE_LINES,
  GAME_MASTER_LINES,
  THE_DEGEN_LINES,
} from "@/components/TrustVoiceLine";
import { CrossArcThreads } from "@/components/CrossArcThreads";

export default function CasesPage() {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const activeCase = trpc.mysteries.getActiveCase.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const available = trpc.mysteries.listAvailable.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const community = trpc.mysteries.listCommunityCases.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const openCase = trpc.mysteries.openCase.useMutation({
    onSuccess: () => {
      utils.mysteries.getActiveCase.invalidate();
      utils.mysteries.getEvidenceBoard.invalidate();
    },
  });

  return (
    <div className="min-h-screen px-4 py-6" style={{ background: "var(--bg-void)", color: "#e2e8f0" }}>
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] mb-4" style={{ color: "rgba(226, 232, 240, 0.6)" }}>
          <ChevronLeft size={14} />
          BACK
        </Link>

        <h1 className="font-mono text-xl tracking-[0.3em] mb-1" style={{ color: "var(--energy-primary)" }}>
          CASE FILES
        </h1>
        <p className="font-mono text-[10px] mb-6" style={{ color: "rgba(226, 232, 240, 0.55)" }}>
          The Streamed Prism Mystery Engine — investigations across the saga.
        </p>

        {/* Active case header */}
        <section className="mb-6 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur p-4">
          <p className="font-mono text-[9px] tracking-[0.3em] mb-2" style={{ color: "var(--energy-accent)" }}>
            ACTIVE CASE
          </p>
          {activeCase.isLoading ? (
            <p className="font-mono text-[10px]" style={{ color: "rgba(226, 232, 240, 0.5)" }}>
              Loading…
            </p>
          ) : activeCase.data?.mystery ? (
            <>
              <p className="font-mono text-sm font-bold" style={{ color: "#e2e8f0" }}>
                {activeCase.data.mystery.title}
              </p>
              {activeCase.data.currentEpisode && (
                <p className="font-mono text-[10px] mt-1" style={{ color: "rgba(226, 232, 240, 0.65)" }}>
                  Episode {activeCase.data.currentEpisode.ordinal}: {activeCase.data.currentEpisode.title}
                </p>
              )}
            </>
          ) : (
            <p className="font-mono text-[10px] italic" style={{ color: "rgba(226, 232, 240, 0.5)" }}>
              No case open. Choose an investigation below.
            </p>
          )}
        </section>

        {/* Trust scalars — hidden when the player has no scalars yet */}
        <section className="mb-6 space-y-3">
          <TrustScalars />
          <TrustVoiceLine
            npcId="wraith_calder"
            speakerLabel="Wraith Calder, Hierophant"
            lines={WRAITH_CALDER_LINES}
          />
          <TrustVoiceLine
            npcId="jericho_jones"
            speakerLabel="Jericho Jones, Iron Lion in training"
            lines={JERICHO_JONES_LINES}
          />
          <TrustVoiceLine
            npcId="the_seer"
            speakerLabel="The Seer"
            lines={THE_SEER_LINES}
          />
          <TrustVoiceLine
            npcId="vex_solene"
            speakerLabel="Vex Solène, Engineer"
            lines={VEX_SOLENE_LINES}
          />
          <TrustVoiceLine
            npcId="game_master"
            speakerLabel="The Game Master, from the unedited fragment"
            lines={GAME_MASTER_LINES}
          />
          <TrustVoiceLine
            npcId="the_degen"
            speakerLabel="The Degen, Trustee"
            lines={THE_DEGEN_LINES}
          />
        </section>

        {/* Cross-arc threads — saga weave readout */}
        <section className="mb-6">
          <CrossArcThreads />
        </section>

        {/* Available cases */}
        <section className="mb-6">
          <p className="font-mono text-[9px] tracking-[0.3em] mb-3" style={{ color: "var(--energy-accent)" }}>
            AVAILABLE INVESTIGATIONS
          </p>
          <div className="space-y-2">
            {available.data?.map((m) => {
              const isActive = activeCase.data?.progress?.mysteryId === m.id;
              const Icon = isActive ? FolderOpen : Folder;
              return (
                <div
                  key={m.id}
                  className="flex items-start gap-3 p-3 rounded-lg border"
                  style={{
                    background: isActive ? "color-mix(in oklch, var(--energy-primary) 6%, transparent)" : "rgba(255, 255, 255, 0.02)",
                    borderColor: isActive ? "color-mix(in oklch, var(--energy-primary) 50%, transparent)" : "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <Icon size={16} className="mt-0.5 shrink-0" style={{ color: isActive ? "var(--energy-primary)" : "rgba(226, 232, 240, 0.6)" }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[11px] font-bold" style={{ color: isActive ? "var(--energy-primary)" : "#e2e8f0" }}>
                      {m.title}
                    </p>
                    <p className="font-mono text-[10px] leading-relaxed mt-1" style={{ color: "rgba(226, 232, 240, 0.55)" }}>
                      {m.summary}
                    </p>
                    <p className="font-mono text-[9px] mt-2" style={{ color: "rgba(226, 232, 240, 0.4)" }}>
                      {m.episodeCount} episode{m.episodeCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  {!isActive && (
                    <button
                      type="button"
                      disabled={openCase.isPending}
                      onClick={() => openCase.mutate({ mysteryId: m.id, lensId: "lens.neutral" })}
                      className="font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-md transition-colors"
                      style={{
                        background: "color-mix(in oklch, var(--energy-primary) 18%, transparent)",
                        border: "1px solid color-mix(in oklch, var(--energy-primary) 50%, transparent)",
                        color: "var(--energy-primary)",
                        cursor: openCase.isPending ? "wait" : "pointer",
                        opacity: openCase.isPending ? 0.6 : 1,
                      }}
                    >
                      OPEN
                    </button>
                  )}
                </div>
              );
            })}
            {available.data?.length === 0 && (
              <p className="font-mono text-[10px] italic" style={{ color: "rgba(226, 232, 240, 0.5)" }}>
                No mysteries authored yet.
              </p>
            )}
          </div>
        </section>

        {/* Community-spawned investigations — vote closures */}
        <section className="mb-6">
          <p className="font-mono text-[9px] tracking-[0.3em] mb-3 flex items-center gap-2" style={{ color: "var(--energy-accent)" }}>
            <Users size={11} />
            COMMUNITY INVESTIGATIONS
          </p>
          {community.data && community.data.length > 0 ? (
            <div className="space-y-2">
              {community.data.map((m) => {
                const isActive = activeCase.data?.progress?.mysteryId === m.id;
                return (
                  <div
                    key={m.id}
                    className="flex items-start gap-3 p-3 rounded-lg border"
                    style={{
                      background: isActive ? "color-mix(in oklch, var(--energy-accent) 6%, transparent)" : "rgba(255, 255, 255, 0.02)",
                      borderColor: isActive ? "color-mix(in oklch, var(--energy-accent) 50%, transparent)" : "rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <Users size={14} className="mt-0.5 shrink-0" style={{ color: "var(--energy-accent)" }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[11px] font-bold" style={{ color: isActive ? "var(--energy-accent)" : "#e2e8f0" }}>
                        {m.title}
                      </p>
                      <p className="font-mono text-[10px] leading-relaxed mt-1" style={{ color: "rgba(226, 232, 240, 0.55)" }}>
                        {m.summary}
                      </p>
                      <p className="font-mono text-[9px] mt-2" style={{ color: "rgba(226, 232, 240, 0.4)" }}>
                        {m.episodeCount} episode{m.episodeCount === 1 ? "" : "s"}
                        {m.seedSource && ` · spawned by ${m.seedSource.replace(/_/g, " ")}`}
                      </p>
                    </div>
                    {!isActive && (
                      <button
                        type="button"
                        disabled={openCase.isPending}
                        onClick={() => openCase.mutate({ mysteryId: m.id, lensId: "lens.neutral" })}
                        className="font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-md transition-colors"
                        style={{
                          background: "color-mix(in oklch, var(--energy-accent) 18%, transparent)",
                          border: "1px solid color-mix(in oklch, var(--energy-accent) 50%, transparent)",
                          color: "var(--energy-accent)",
                          cursor: openCase.isPending ? "wait" : "pointer",
                          opacity: openCase.isPending ? 0.6 : 1,
                        }}
                      >
                        OPEN
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="font-mono text-[10px] italic" style={{ color: "rgba(226, 232, 240, 0.4)" }}>
              No community-spawned cases yet. Vote closures generate investigations across the saga.
            </p>
          )}
        </section>

        {/* Deduction + choice panels + recap — visible only when a case is open */}
        {activeCase.data?.progress && activeCase.data?.currentEpisode && (
          <section className="mb-6 space-y-4">
            <CaseRecap mysteryId={activeCase.data.progress.mysteryId} />
            <DeductionPanel
              mysteryId={activeCase.data.progress.mysteryId}
              episodeId={activeCase.data.progress.currentEpisodeId}
            />
            <ChoicePanel
              mysteryId={activeCase.data.progress.mysteryId}
              episodeId={activeCase.data.progress.currentEpisodeId}
            />
          </section>
        )}

        {/* Conspiracy board */}
        <section>
          <p className="font-mono text-[9px] tracking-[0.3em] mb-3" style={{ color: "var(--energy-accent)" }}>
            CONSPIRACY BOARD
          </p>
          <SagaConspiracyBoard />
        </section>
      </div>
    </div>
  );
}
