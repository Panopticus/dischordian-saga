/* ═══════════════════════════════════════════════════════
   ACT 2 INTERLUDE PAGE — THE WHISPER

   Non-combat interlude. Acts 2 and 5 ship no scripted
   opponents (per ACTS_2_7_COMPLETENESS_AUDIT); this page
   surfaces Act 2's narrative beats:

     - The Human's first in-engine commentary
     - Dual-signal protocol activation
     - dual_channel system tutor (via acts2to7SystemTutors)

   On first entry, sets act2_dual_signal_activated (which
   gates companion comments + unlocks Ask topics) and fires
   the two reactive companion-comment lines authored in
   companionComments.ts.

   Route: /act2-interlude. Linked from Witnessing Hub when
   narrativeAct >= 2.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Ear, Play, X } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { fireCompanionComment } from "@/lib/companionCommentQueue";
import { useActVO } from "@/hooks/useActVO";
import { getActsSystemTutor } from "@shared/acts2to7SystemTutors";
import LivingBackground from "@/components/LivingBackground";

import { assetUrl } from "@/lib/assetUrl";
type View = "intro" | "tutor" | "close";

const HUMAN_COMMENTARY_1 =
  "I watched your tutorial. Elara's a good teacher. Patient. Thorough. But she only showed you one way to play. Every game on this Ark has two layers. The surface — what Elara teaches — and the substrate. The deeper mechanics. I'm not saying her way is wrong. I'm saying there's more.";

const HUMAN_COMMENTARY_2 =
  "From now on, when you play, you might notice my signal in the background. Brief transmissions. Alternative strategies. A different voice. Think of it as a second opinion. From someone who sees the game from inside the walls.";

const ELARA_RECOGNITION =
  "I'm detecting substrate activity during your gameplay sessions. The Human's signal. They're commenting. On your performance. On my teaching. I can't block it. But I want you to know: I'm aware of it. And I'm watching. Don't let a voice in the walls tell you how to live your life.";

export default function Act2InterludePage() {
  const { state: gameState, setNarrativeFlag } = useGame();
  const vo = useActVO("2");

  const alreadyActivated = useMemo(
    () => gameState.narrativeFlags["act2_dual_signal_activated"] === true,
    [gameState.narrativeFlags],
  );

  const [view, setView] = useState<View>("intro");
  const [firstVisit] = useState(!alreadyActivated);

  // Fire the dual-signal activation on mount if not already set.
  useEffect(() => {
    // Belt-and-suspenders: raise the Act 2 trigger flag + open Year-One
    // month 6 here even if the player reached this page without going
    // through advanceNarrativeAct (e.g. dev deep-link, replay).
    if (!gameState.narrativeFlags?.act_2_started) {
      setNarrativeFlag("act_2_started", true);
    }
    if (!gameState.narrativeFlags?.year_one_month_6_opened) {
      setNarrativeFlag("year_one_month_6_opened", true);
    }
    if (!alreadyActivated) {
      setNarrativeFlag("act2_dual_signal_activated", true);
      fireCompanionComment("act2_dual_signal_activated");
      // §1 · The Human's whisper intro plays first (queued so the two
      // lines come in sequence), then §2 · Elara's recognition lands
      // on top — matching the narrative beat in act2-vo-script.md.
      vo.speak("human_commentary_1");
      vo.speak("human_commentary_2");
      vo.speak("elara_recognition");
      const t = window.setTimeout(() => {
        fireCompanionComment("act2_first_substrate_ping");
      }, 1500);
      return () => window.clearTimeout(t);
    }
  }, [alreadyActivated, gameState.narrativeFlags, setNarrativeFlag, vo]);

  const tutor = getActsSystemTutor("dual_channel");

  const accent = "border-indigo-500/40 text-indigo-200";
  const subAccent = "text-indigo-300/80";

  return (
    <div className="relative min-h-screen bg-stone-950 text-stone-100">
      <LivingBackground
        src={assetUrl("art/rooms/room-comms-relay.png")}
        accent="rgba(99, 102, 241, 0.35)"
        opacity={0.08}
        particleCount={3}
        scanlines={false}
      />

      <header className="relative z-10 flex items-center justify-between border-b border-indigo-500/30 bg-stone-950/80 px-4 py-3 backdrop-blur">
        <Link
          to="/witnessing"
          className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] ${subAccent} hover:text-indigo-100`}
        >
          <ChevronLeft size={14} />
          Witnessing Hub
        </Link>
        <div className="text-center">
          <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${subAccent}`}>
            Act 2 · The Whisper
          </p>
          <p className="mt-1 font-serif text-lg italic text-indigo-50">
            The Second Voice
          </p>
        </div>
        <div className={`font-mono text-[10px] uppercase tracking-wider ${subAccent}`}>
          {firstVisit ? "Activating" : "Active"}
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-6">
        <AnimatePresence mode="wait">
          {view === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className={`rounded-md border ${accent} bg-stone-950/60 p-5`}>
                <div className="flex items-center gap-2">
                  <Ear size={14} className={subAccent} />
                  <p className={`font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                    Substrate · Human (muted audio)
                  </p>
                </div>
                <p className="mt-2 font-serif italic text-[14px] leading-relaxed text-indigo-100/90">
                  {HUMAN_COMMENTARY_1}
                </p>
              </div>

              <div className={`rounded-md border ${accent} bg-stone-950/60 p-5`}>
                <div className="flex items-center gap-2">
                  <Ear size={14} className={subAccent} />
                  <p className={`font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                    Substrate · Human (muted audio)
                  </p>
                </div>
                <p className="mt-2 font-serif italic text-[14px] leading-relaxed text-indigo-100/90">
                  {HUMAN_COMMENTARY_2}
                </p>
              </div>

              <div className="rounded-md border border-cyan-500/40 bg-cyan-950/15 p-5">
                <p className="font-mono text-[9px] uppercase tracking-wider text-cyan-300/80">
                  Primary channel · Elara
                </p>
                <p className="mt-2 font-serif italic text-[14px] leading-relaxed text-cyan-100/90">
                  {ELARA_RECOGNITION}
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setView("tutor")}
                  className={`flex items-center gap-2 rounded border ${accent} bg-indigo-950/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-indigo-100 hover:bg-indigo-900/60`}
                >
                  <Play size={12} />
                  Hear the protocol
                </button>
              </div>
            </motion.div>
          )}

          {view === "tutor" && tutor && (
            <motion.div
              key="tutor"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className={`rounded-md border ${accent} bg-stone-950/60 p-5`}>
                <p className={`font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                  Dual-Channel Protocol · Elara
                </p>
                <p className="mt-3 font-serif italic text-[14px] leading-relaxed text-indigo-50/95 whitespace-pre-line">
                  {tutor.introText}
                </p>
              </div>

              <div className="rounded-md border border-stone-700 bg-stone-900/40 p-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-stone-400">
                  Usage cues
                </p>
                <ul className="mt-2 space-y-2">
                  {Object.entries(tutor.usageHints).map(([action, hint]) => (
                    <li key={action} className="text-[12px]">
                      <p className="font-mono text-[9px] uppercase tracking-wider text-stone-500">
                        {action.replace(/_/g, " ")}
                      </p>
                      <p className="mt-0.5 font-serif italic text-stone-200">
                        {hint}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setView("intro")}
                  className={`flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider ${subAccent} hover:text-indigo-100`}
                >
                  <ChevronLeft size={12} />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNarrativeFlag("act2_tutor_dual_channel_seen", true);
                    setView("close");
                  }}
                  className={`rounded border ${accent} bg-indigo-950/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-indigo-100 hover:bg-indigo-900/60`}
                >
                  Understood
                </button>
              </div>
            </motion.div>
          )}

          {view === "close" && (
            <motion.div
              key="close"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              <div className={`rounded-md border ${accent} bg-stone-950/60 p-5`}>
                <div className="flex items-center justify-between">
                  <p className={`font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                    Act 2 · The Whisper · complete
                  </p>
                  <Link
                    to="/witnessing"
                    className={`${subAccent} hover:text-indigo-100`}
                    aria-label="Return"
                  >
                    <X size={14} />
                  </Link>
                </div>
                <p className="mt-2 font-serif italic text-[13px] leading-relaxed text-indigo-100/85">
                  Both voices are now active across every game mode. The
                  angel guides from above. The substrate whispers from below.
                  You decide which to listen to, when.
                </p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-stone-500">
                  Progress further on the Ark to trigger Act 3 · The Offer.
                </p>
              </div>
              <div className="flex justify-end">
                <Link
                  to="/witnessing"
                  className={`rounded border ${accent} bg-indigo-950/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-indigo-100 hover:bg-indigo-900/60`}
                >
                  Return to Hub
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
