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
  const { state, performPrestige, setNarrativeFlag } = useGame();
  const [, navigate] = useLocation();
  const [confirming, setConfirming] = useState(false);
  const [ceremonyPending, setCeremonyPending] = useState(false);
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
  const cinematicSeen = Boolean(flags.cutscene_prestige_reset_seen);

  const handleConfirm = useCallback(() => {
    if (!spineComplete) return;
    // Bible §6 — fire the 4-shot reset cinematic before applying
    // the prestige carryover. CutsceneRouter (mounted at App root)
    // watches `cutscene_prestige_reset_triggered`, plays the
    // PrestigeResetCutscene full-screen, and stamps
    // `cutscene_prestige_reset_seen` on completion. The useEffect
    // below picks that up and runs performPrestige + navigate.
    setNarrativeFlag("cutscene_prestige_reset_triggered", true);
    setCeremonyPending(true);
    setConfirming(false);
  }, [spineComplete, setNarrativeFlag]);

  // After the cinematic finishes, perform the actual prestige
  // carryover. Gated on ceremonyPending so a player who's already
  // seen the cutscene from a prior cycle doesn't re-prestige on
  // mount.
  useEffect(() => {
    if (!ceremonyPending || !cinematicSeen) return;
    setCeremonyPending(false);
    performPrestige();
    vo.speak("prestige-ceremony-close");
    toast.success(`Cycle ${nextPrestigeLevel} begins.`, {
      description:
        "The Ark resets. The Antiquarian remembers. Somewhere, a new Potential opens their eyes.",
      duration: 10_000,
    });
    setTimeout(() => navigate("/title"), 1_500);
  }, [
    ceremonyPending,
    cinematicSeen,
    performPrestige,
    vo,
    nextPrestigeLevel,
    navigate,
  ]);

  return (
    <div className="relative min-h-screen void-bg-canvas void-text">
      <LivingBackground
        src="/art/cinematics/act-7-convergence/hero.webp"
        accent="color-mix(in oklch, var(--energy-accent) 32%, transparent)"
        opacity={0.12}
        particleCount={4}
        scanlines={false}
      />

      <header className="relative z-10 flex items-center justify-between border-b void-border void-bg-canvas px-4 py-3 backdrop-blur">
        <Link
          to="/witnessing"
          className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] void-text-accent void-text-accent"
        >
          <ChevronLeft size={14} />
          Witnessing Hub
        </Link>
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] void-text-accent">
            §15 · Prestige Cycle Reset
          </p>
          <p className="mt-1 font-serif text-lg italic void-text-accent">
            The Antiquarian is still writing
          </p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] void-text-accent">
          Cycle {prestigeLevel} → {nextPrestigeLevel}
        </span>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-4 py-8">
        <section className="mb-6 rounded-md border void-border void-bg-sunk p-5">
          <p className="font-serif italic leading-relaxed text-[14px] void-text-accent">
            The seven acts resolved on a single sustained chord this afternoon.
            The galaxy paused for one measure. The cycle is complete — which
            means the cycle is about to begin. A new Potential is waking up
            somewhere. Your Ark will hand its history to them through the
            Antiquarian. Not all of it. Some of it. He has been keeping a list.
          </p>
        </section>

        {!spineComplete && (
          <section className="mb-6 rounded-md border void-border void-bg-canvas p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={16}
                className="mt-0.5 shrink-0 void-text"
              />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] void-text">
                  Cycle not yet complete
                </p>
                <p className="mt-1 font-serif italic text-[13px] void-text-dim">
                  Act 7 has not closed. The Antiquarian's book is still open.
                  Return when the Convergence has landed. The page will be
                  here. So will he.
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="mb-6 rounded-md border void-border void-bg-canvas p-5">
          <header className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] void-text-accent">
            <Sparkles size={12} />
            What the Antiquarian keeps
          </header>
          <ul className="space-y-3">
            {PRESTIGE_CARRYOVER_RULES.map((rule) => {
              const pct = Math.round(rule.carryoverPortion * 100);
              const tone =
                pct === 100
                  ? "void-text-energy"
                  : pct === 0
                    ? "void-text-error"
                    : "void-text-accent";
              return (
                <li
                  key={rule.id}
                  className="rounded border void-border void-bg-canvas p-3"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-serif text-[14px] italic void-text-accent">
                      {rule.label}
                    </p>
                    <span className={`font-mono text-[12px] font-bold ${tone}`}>
                      {pct}%
                    </span>
                  </div>
                  <p className="mt-1 font-serif italic leading-relaxed text-[12px] void-text-accent">
                    {rule.rationale}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-md border void-border-error void-bg-error p-5">
          <header className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] void-text-error">
            <AlertTriangle size={12} />
            What resets
          </header>
          <p className="font-serif italic leading-relaxed text-[13px] void-text-error">
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
            className="font-mono text-[11px] uppercase tracking-wider void-text-accent void-text-accent"
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
                ? "void-border void-bg-sunk void-text-accent void-bg-sunk"
                : "void-border void-bg-canvas void-text cursor-not-allowed",
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
      className="fixed inset-0 z-[120] flex items-center justify-center void-bg-canvas backdrop-blur-sm px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="w-full max-w-md rounded border void-border void-bg-canvas p-6 shadow-[0_0_80px_color-mix(in oklch, var(--energy-accent) 30%, transparent)]"
        initial={{ y: 12, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -12, opacity: 0 }}
        transition={{ duration: 0.35 }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] void-text-accent">
          One measure of silence
        </p>
        <h2 className="mt-2 font-serif text-xl italic void-text-accent">
          Begin cycle {nextCycleNumber}?
        </h2>
        <p className="mt-4 font-serif italic leading-relaxed text-[13px] void-text-accent">
          A new Potential is about to wake up. You will be on the other side
          of the pod. You will not be the person you were when this cycle
          started — you will be the person who finished it. That is the
          difference.
        </p>
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="font-mono text-[11px] uppercase tracking-wider void-text-accent void-text-accent"
          >
            Hold the measure
          </button>
          <button
            type="button"
            onClick={onConfirm}
            data-testid="prestige-cycle-confirm"
            className="rounded border void-border void-bg-sunk px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] void-text-accent void-bg-sunk"
          >
            Release
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
