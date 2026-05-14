/* ═══════════════════════════════════════════════════════
   SAGA STATUS PANEL
   The visible UI surface that consumes the canon-foundation
   renderer (apps/shared/sagaStatusRenderer.ts). Reads the
   player's narrativeAct + narrativeFlags from GameContext
   and renders the four foundation surfaces:

     - Saga-phase progress (current phase + next-step hint)
     - Mystery Engine catalog (available + upcoming arcs)
     - Cross-arc reactivity (active thread count)
     - Real-World Chronicle (next service trip + countdown)

   The panel reads through renderSagaStatus() — never reaches
   directly into the foundation registries. This indirection
   keeps the four surfaces canon-anchored and JSON-serializable.
   ═══════════════════════════════════════════════════════ */

import { useMemo } from "react";
import { Compass, Sparkles, Link2, Plane } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { renderSagaStatus } from "@shared/sagaStatusRenderer";
import type { SagaPhaseInput } from "@shared/sagaPhases";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function SagaStatusPanel() {
  const { state } = useGame();

  const input: SagaPhaseInput = useMemo(
    () => ({
      narrativeAct: state.narrativeAct ?? 0,
      flags: state.narrativeFlags ?? {},
    }),
    [state.narrativeAct, state.narrativeFlags],
  );

  const payload = useMemo(
    () => renderSagaStatus(input, todayIso()),
    [input],
  );

  const { phase, mysteries, crossArcs, realWorld } = payload;
  const nextStepHint = phase.nextPhaseGuidance
    ? `Your path continues: Phase ${phase.nextPhaseGuidance.phase} — ${phase.nextPhaseGuidance.title}.`
    : "Your saga is complete. The Servant Hero Academy era continues.";

  return (
    <div
      className="rounded-lg border border-stone-600/40 bg-zinc-950/80 p-4"
      data-component="saga-status-panel"
    >
      <div className="flex items-center gap-2 mb-3">
        <Compass size={14} className="void-text-energy" />
        <h2 className="font-display text-sm font-bold tracking-wider">
          THE PATH
        </h2>
      </div>

      {/* ─── Phase row ─── */}
      <section className="mb-3" data-section="phase">
        <div className="flex items-baseline justify-between mb-1">
          <p className="font-mono text-[10px] text-muted-foreground/70 tracking-wider">
            {phase.panelTitle.toUpperCase()}
          </p>
          <p className="font-mono text-[10px] text-muted-foreground/70">
            {phase.progressPercent}%
          </p>
        </div>
        <div
          className="h-1 w-full overflow-hidden rounded bg-stone-800/60"
          role="progressbar"
          aria-valuenow={phase.progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Saga progress"
        >
          <div
            className="h-full bg-amber-500/70 transition-all duration-700"
            style={{ width: `${phase.progressPercent}%` }} // void-ignore — dynamic progress width
          />
        </div>
        <p className="mt-2 text-xs text-stone-300 italic">{nextStepHint}</p>
      </section>

      {/* ─── Mystery Engine row ─── */}
      <section className="mb-3 border-t border-stone-700/40 pt-3" data-section="mysteries">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={12} className="text-amber-300/70" />
          <p className="font-mono text-[10px] tracking-wider text-muted-foreground/80">
            MYSTERY ENGINES · {mysteries.availableCount}/{mysteries.totalCount} AVAILABLE
          </p>
        </div>
        {mysteries.availableArcs.length === 0 ? (
          <p className="text-[11px] text-stone-400 italic">
            No arcs unlocked yet. Walk further into the saga.
          </p>
        ) : (
          <ul className="space-y-1">
            {mysteries.availableArcs.map((arc) => (
              <li
                key={arc.arcId}
                className="text-[11px] text-stone-300 flex items-baseline gap-2"
              >
                <span className="text-amber-300/80">·</span>
                <span className="font-medium">{arc.title}</span>
                {arc.spoilerProtected && (
                  <span className="ml-auto font-mono text-[9px] text-rose-300/70 tracking-wider">
                    REVEAL
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
        {mysteries.upcomingArcs.length > 0 && (
          <p className="mt-2 text-[10px] text-stone-500/80 italic">
            {mysteries.upcomingArcs.length} arc
            {mysteries.upcomingArcs.length === 1 ? "" : "s"} still gated by the path.
          </p>
        )}
      </section>

      {/* ─── Cross-arc threads row ─── */}
      <section className="mb-3 border-t border-stone-700/40 pt-3" data-section="cross-arcs">
        <div className="flex items-center gap-2 mb-1">
          <Link2 size={12} className="text-violet-300/70" />
          <p className="font-mono text-[10px] tracking-wider text-muted-foreground/80">
            ACTIVE THREADS · {crossArcs.activeBindings.length}/{crossArcs.totalBindings}
          </p>
        </div>
        {crossArcs.activeBindings.length === 0 ? (
          <p className="text-[11px] text-stone-400 italic">
            No cross-arc threads active at this phase.
          </p>
        ) : (
          <p className="text-[11px] text-stone-300">
            {crossArcs.activeBindings.length} cross-arc{" "}
            {crossArcs.activeBindings.length === 1 ? "thread" : "threads"}{" "}
            ready to surface in adjacent investigations.
          </p>
        )}
      </section>

      {/* ─── Real-world chronicle row ─── */}
      <section className="border-t border-stone-700/40 pt-3" data-section="real-world">
        <div className="flex items-center gap-2 mb-1">
          <Plane size={12} className="text-emerald-300/70" />
          <p className="font-mono text-[10px] tracking-wider text-muted-foreground/80">
            REAL-WORLD CHRONICLE
          </p>
        </div>
        {realWorld.nextTrip ? (
          <div className="text-[11px] text-stone-300">
            <p className="font-medium">{realWorld.nextTrip.name}</p>
            <p className="text-stone-400">
              {realWorld.nextTrip.location.city},{" "}
              {realWorld.nextTrip.location.country}
            </p>
            <p className="text-stone-400">
              {realWorld.nextTrip.dateRange.startIso} →{" "}
              {realWorld.nextTrip.dateRange.endIso}
            </p>
            {realWorld.daysUntilNextTrip !== null && (
              <p className="text-stone-500/80 italic mt-1">
                {realWorld.daysUntilNextTrip > 0
                  ? `${realWorld.daysUntilNextTrip} days until departure`
                  : realWorld.daysUntilNextTrip === 0
                    ? "Departing today"
                    : `Trip in progress (day ${Math.abs(realWorld.daysUntilNextTrip) + 1})`}
              </p>
            )}
            {realWorld.hasPartnership && realWorld.nextTrip.partnership && (
              <p className="mt-1 font-mono text-[9px] text-emerald-300/70 tracking-wider">
                · {realWorld.nextTrip.partnership.organization.toUpperCase()} ·{" "}
                {realWorld.nextTrip.partnership.event}
              </p>
            )}
          </div>
        ) : (
          <p className="text-[11px] text-stone-400 italic">
            No scheduled trips on the chronicle.
          </p>
        )}
      </section>
    </div>
  );
}

export default SagaStatusPanel;
