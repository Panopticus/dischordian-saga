/* ═══════════════════════════════════════════════════════
   PRESTIGE CYCLE RESET — The ceremony after Act 7

   Act 7 closes the visible narrative spine. The canon §1.5 reveal
   is that the cycle rolls over: new Potential, new Ark, but the
   Antiquarian remembers. `performPrestige()` in GameContext does
   the actual reducer work — clamps `narrativeAct` to 0, clears
   the Prelude playhead, applies `applyPrestigeCarryover()` against
   the canonical §15 rules in `actsFourFiveShells.ts`.

   Previously the only entry point was a `window.confirm()` dialog
   on CharacterSheetPage.tsx. This page replaces it with a proper
   ceremony: the §15 carryover rules laid bare, a moment of silence
   for what the player is about to let go of, and a single
   deliberate button that fires `performPrestige()`.

   Gate: the page is REACHABLE at `/prestige-cycle` always (for
   dev / canon lookup), but the "Begin Next Cycle" action is
   disabled unless the player has either:
     - `act_7_complete` (canonical spine-complete path), OR
     - `narrative_spine_complete` (matches the flag my hook
       sets alongside act_7_complete).
   A pre-complete visit shows the rules + a "not yet" state.

   Route: /prestige-cycle (added to App.tsx).
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ChevronLeft,
  Crown,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useGame } from "@/contexts/GameContext";
import { PRESTIGE_CARRYOVER_RULES } from "@shared/actsFourFiveShells";
import LivingBackground from "@/components/LivingBackground";
import { useActVO } from "@/hooks/useActVO";

export default function PrestigeCycleResetPage() {
  const { state, performPrestige } = useGame();
  const [, navigate] = useLocation();
  const [confirming, setConfirming] = useState(false);
  // Prestige VO lives in Act 7's manifest (outputDir `vo/prestige`).
  const vo = useActVO("7");

  useEffect(() => {
    // Fires once on mount. The manifest key lookup is a no-op when the
    // MP3 hasn't landed yet, so local dev silently skips.
    vo.speak("prestige-ceremony-open");
  }, [vo]);

  const flags = state.narrativeFlags ?? {};
  const spineComplete =
    Boolean(flags.act_7_complete) || Boolean(flags.narrative_spine_complete);
  const prestigeLevel = state.prestigeLevel ?? 0;
  const nextPrestigeLevel = prestigeLevel + 1;

  const handleConfirm = useCallback(() => {
    if (!spineComplete) return;
    performPrestige();
    vo.speak("prestige-ceremony-close");
    toast.success(`Cycle ${nextPrestigeLevel} begins.`, {
      description:
        "The Ark resets. The Antiquarian remembers. Somewhere, a new Potential opens their eyes.",
      duration: 10_000,
    });
    // Route the player back to the title / awakening so the new
    // Prelude playhead has a clean context.
    setTimeout(() => navigate("/title"), 1_500);
  }, [spineComplete, performPrestige, nextPrestigeLevel, navigate, vo]);

  return (
    <div className="relative min-h-screen bg-stone-950 text-stone-100">
      <LivingBackground
        src="/art/cinematics/act-7-convergence/hero.webp"
        accent="rgba(245, 158, 11, 0.32)"
        opacity={0.12}
        particleCount={4}
        scanlines={false}
      />

      <header className="relative z-10 flex items-center justify-between border-b border-amber-500/30 bg-stone-950/85 px-4 py-3 backdrop-blur">
        <Link
          to="/witnessing"
          className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-amber-300/80 hover:text-amber-100"
        >
          <ChevronLeft size={14} />
          Witnessing Hub
        </Link>
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-300/70">
            §15 · Prestige Cycle Reset
          </p>
          <p className="mt-1 font-serif text-lg italic text-amber-50">
            The Antiquarian is still writing
          </p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-300/80">
          Cycle {prestigeLevel} → {nextPrestigeLevel}
        </span>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-4 py-8">
        <section className="mb-6 rounded-md border border-amber-500/30 bg-amber-950/10 p-5">
          <p className="font-serif italic leading-relaxed text-[14px] text-amber-100/90">
            The seven acts resolved on a single sustained chord this afternoon.
            The galaxy paused for one measure. The cycle is complete — which
            means the cycle is about to begin. A new Potential is waking up
            somewhere. Your Ark will hand its history to them through the
            Antiquarian. Not all of it. Some of it. He has been keeping a list.
          </p>
        </section>

        {!spineComplete && (
          <section className="mb-6 rounded-md border border-stone-700 bg-stone-900/40 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={16}
                className="mt-0.5 shrink-0 text-stone-400"
              />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-300">
                  Cycle not yet complete
                </p>
                <p className="mt-1 font-serif italic text-[13px] text-stone-300/90">
                  Act 7 has not closed. The Antiquarian's book is still open.
                  Return when the Convergence has landed. The page will be
                  here. So will he.
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="mb-6 rounded-md border border-amber-500/30 bg-stone-950/60 p-5">
          <header className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-300/80">
            <Sparkles size={12} />
            What the Antiquarian keeps
          </header>
          <ul className="space-y-3">
            {PRESTIGE_CARRYOVER_RULES.map((rule) => {
              const pct = Math.round(rule.carryoverPortion * 100);
              const tone =
                pct === 100
                  ? "text-emerald-300"
                  : pct === 0
                    ? "text-red-300"
                    : "text-amber-200";
              return (
                <li
                  key={rule.id}
                  className="rounded border border-amber-500/20 bg-stone-950/40 p-3"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-serif text-[14px] italic text-amber-50">
                      {rule.label}
                    </p>
                    <span className={`font-mono text-[12px] font-bold ${tone}`}>
                      {pct}%
                    </span>
                  </div>
                  <p className="mt-1 font-serif italic leading-relaxed text-[12px] text-amber-100/75">
                    {rule.rationale}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-md border border-red-500/30 bg-red-950/10 p-5">
          <header className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-red-300/80">
            <AlertTriangle size={12} />
            What resets
          </header>
          <p className="font-serif italic leading-relaxed text-[13px] text-red-100/85">
            Narrative act, Prelude playhead, Light/Dark alignment, room
            discovery, narrator dominance, and any flag tied to a specific
            cycle. You will wake up on the Ark again. You will meet Elara
            again. You will recognize her. She will not recognize you — not
            at first. That is the design.
          </p>
        </section>

        <div className="mt-8 flex items-center justify-between gap-3">
          <Link
            to="/witnessing"
            className="font-mono text-[11px] uppercase tracking-wider text-amber-300/60 hover:text-amber-100"
          >
            Not yet
          </Link>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={!spineComplete}
            data-testid="prestige-cycle-begin"
            className={[
              "rounded border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em]",
              spineComplete
                ? "border-amber-400/60 bg-amber-900/40 text-amber-100 hover:bg-amber-800/60"
                : "border-stone-700 bg-stone-900/40 text-stone-500 cursor-not-allowed",
            ].join(" ")}
          >
            <Crown size={12} className="mr-2 inline-block" />
            Begin cycle {nextPrestigeLevel}
          </button>
        </div>
      </main>

      <AnimatePresence>
        {confirming && (
          <ConfirmCeremony
            nextCycleNumber={nextPrestigeLevel}
            onCancel={() => setConfirming(false)}
            onConfirm={handleConfirm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ConfirmCeremony({
  nextCycleNumber,
  onCancel,
  onConfirm,
}: {
  nextCycleNumber: number;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-stone-950/90 backdrop-blur-sm px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="w-full max-w-md rounded border border-amber-400/60 bg-stone-950/95 p-6 shadow-[0_0_80px_rgba(245,158,11,0.3)]"
        initial={{ y: 12, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -12, opacity: 0 }}
        transition={{ duration: 0.35 }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-300/80">
          One measure of silence
        </p>
        <h2 className="mt-2 font-serif text-xl italic text-amber-50">
          Begin cycle {nextCycleNumber}?
        </h2>
        <p className="mt-4 font-serif italic leading-relaxed text-[13px] text-amber-100/85">
          A new Potential is about to wake up. You will be on the other side
          of the pod. You will not be the person you were when this cycle
          started — you will be the person who finished it. That is the
          difference.
        </p>
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="font-mono text-[11px] uppercase tracking-wider text-amber-300/60 hover:text-amber-100"
          >
            Hold the measure
          </button>
          <button
            type="button"
            onClick={onConfirm}
            data-testid="prestige-cycle-confirm"
            className="rounded border border-amber-400/70 bg-amber-900/50 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-amber-100 hover:bg-amber-800/70"
          >
            Release
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
