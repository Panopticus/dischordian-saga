/* ═══════════════════════════════════════════════════════
   ACT 5 INTERLUDE PAGE — THE MAP

   Non-combat interlude. Surfaces Act 5's narrative beats:

     - Kael's master log preamble (taught by his own voice)
     - Five-sector reveal (Shattered Frontier, Dreaming
       Expanse, Forge Worlds, etc.)
     - star_map system tutor (Kael's archival voice — the
       canonical introducer of the navigation data)

   On first entry, sets act5_map_first_open and fires the
   companion-comment trigger by the same name. Subsequent
   visits skip the activation and present the same data
   for re-reading.

   Route: /act5-interlude. Linked from Witnessing Hub when
   narrativeAct >= 5.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Map as MapIcon, Play, X } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { fireCompanionComment } from "@/lib/companionCommentQueue";
import { getActsSystemTutor } from "@shared/acts2to7SystemTutors";
import LivingBackground from "@/components/LivingBackground";

import { assetUrl } from "@/lib/assetUrl";
type View = "intro" | "tutor" | "sectors" | "iron_lion" | "close";

const IRON_LION_BROADCAST = `[CADES SIGNAL · THIRD-CLASS MECHRONIS BAND]
[ORIGIN: VERIDIAN VI · PRESS ROOM 14-B]
[TIMESTAMP: PERPETUAL — EVERY SHIFT, FOR ELEVEN THOUSAND YEARS]

To the free souls of the galaxy. We've faced the might of the Architect and found its weaknesses.

I printed three thousand posters in seventy-two hours. The presses are loud. The presses are old. They were here before me. They will be here after me. The 3001st poster is set up on the carriage and the ink is wet. I have been printing it for a long time. I have not finished it because I have not had a hand to hand it to.

If you are receiving this, the hand has arrived. Walk in. The press is the second one on the left. The poster is the only one on the carriage. Take it. The cat at my feet is not mine. Tell whoever owns him that he was a good cat.

— Iron Lion. The press is going silent.`;

const KAEL_PREAMBLE = `[RECRUITER'S LOG — MASTER INDEX]
[DECRYPTED FROM SUBSTRATE LAYER]
[ENTRIES: 447 — SPANNING 23 SECTORS]

"If you're reading this, I'm either dead or something worse. These logs contain every contact I made, every world I visited, every alliance I forged during the Insurgency's recruitment campaign.

I was the best recruiter the Insurgency ever had. I visited every corner of the universe. I built an army that could have challenged the Architect himself.

I didn't know I was carrying the Thought Virus. I didn't know every handshake, every alliance, every contact was spreading the infection.

By the time I tried to reassemble the army for the final battle before the Fall of Reality… it was too late.

I'm sorry. For all of it.
— Kael, The Recruiter"`;

const ELARA_BRIEFING =
  "I've cross-referenced Kael's navigation data with current star charts. Five major sectors where Kael's contacts had the strongest presence. Twenty worlds. Each one a potential source of allies. These people's ancestors were betrayed by a recruiter once before. They'll remember. Earn their respect. Don't take it.";

const HUMAN_INTEL =
  "Five sectors. Twenty worlds. Each one touched by Kael's campaign. Every world he visited was exposed to the Thought Virus. Most survived — the virus went dormant after the Fall. But dormant isn't dead. Scan their systems. The army you're building isn't just for the visible war. It's for the invisible one.";

const SECTORS: ReadonlyArray<{
  id: string;
  name: string;
  archetype: string;
  blurb: string;
}> = [
  {
    id: "shattered_frontier",
    name: "The Shattered Frontier",
    archetype: "Combat Veterans",
    blurb:
      "Kael's combat veterans. Their descendants have been fighting alone for millennia. Hard-eyed. Capable. They will test you before they trust you.",
  },
  {
    id: "dreaming_expanse",
    name: "The Dreaming Expanse",
    archetype: "Intelligence Network",
    blurb:
      "Kael's intelligence network. Their descendants developed psychic traditions and prophetic cultures. The Dreamer's frequency runs strongest here.",
  },
  {
    id: "forge_worlds",
    name: "The Forge Worlds",
    archetype: "Engineers / Builders",
    blurb:
      "Kael's technical corps. They built new civilisations from Inception Ark wreckage. They will weigh your engineering before they weigh your words.",
  },
  {
    id: "concord_remnants",
    name: "The Concord Remnants",
    archetype: "Diplomats",
    blurb:
      "Kael's diplomatic contacts. Their descendants kept the old Concord protocols alive. Bring patience. Their meetings run long. The patience is the trust.",
  },
  {
    id: "outer_dusk",
    name: "The Outer Dusk",
    archetype: "Mystics / Outliers",
    blurb:
      "Kael's least-documented contacts. The Outer Dusk lineages remember him in songs and family names, not records. Listen for the markers. They will not announce themselves.",
  },
];

export default function Act5InterludePage() {
  const { state: gameState, setNarrativeFlag } = useGame();

  const alreadyOpened = useMemo(
    () => gameState.narrativeFlags["act5_map_first_open"] === true,
    [gameState.narrativeFlags],
  );

  const [view, setView] = useState<View>("intro");
  const [firstVisit] = useState(!alreadyOpened);

  useEffect(() => {
    if (!alreadyOpened) {
      setNarrativeFlag("act5_map_first_open", true);
      fireCompanionComment("act5_map_first_open");
    }
  }, [alreadyOpened, setNarrativeFlag]);

  const tutor = getActsSystemTutor("star_map");

  const accent = "border-amber-500/40 text-amber-200";
  const subAccent = "text-amber-300/80";

  return (
    <div className="relative min-h-screen bg-stone-950 text-stone-100">
      <LivingBackground
        src={assetUrl("art/rooms/room-war-room.png")}
        accent="rgba(245, 158, 11, 0.32)"
        opacity={0.08}
        particleCount={3}
        scanlines={false}
      />

      <header className="relative z-10 flex items-center justify-between border-b border-amber-500/30 bg-stone-950/80 px-4 py-3 backdrop-blur">
        <Link
          to="/witnessing"
          className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] ${subAccent} hover:text-amber-100`}
        >
          <ChevronLeft size={14} />
          Witnessing Hub
        </Link>
        <div className="text-center">
          <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${subAccent}`}>
            Act 5 · The Map
          </p>
          <p className="mt-1 font-serif text-lg italic text-amber-50">
            Five Sectors, Twenty Worlds
          </p>
        </div>
        <div className={`font-mono text-[10px] uppercase tracking-wider ${subAccent}`}>
          {firstVisit ? "Opening" : "Open"}
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
                <p className={`font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                  Kael's archive · master log preamble
                </p>
                <p className="mt-2 font-mono text-[12px] leading-relaxed whitespace-pre-line text-amber-100/90">
                  {KAEL_PREAMBLE}
                </p>
              </div>

              <div className="rounded-md border border-cyan-500/40 bg-cyan-950/15 p-5">
                <p className="font-mono text-[9px] uppercase tracking-wider text-cyan-300/80">
                  Primary channel · Elara
                </p>
                <p className="mt-2 font-serif italic text-[14px] leading-relaxed text-cyan-100/90">
                  {ELARA_BRIEFING}
                </p>
              </div>

              <div className="rounded-md border border-rose-500/40 bg-rose-950/15 p-5">
                <p className="font-mono text-[9px] uppercase tracking-wider text-rose-300/80">
                  Substrate · Human
                </p>
                <p className="mt-2 font-serif italic text-[14px] leading-relaxed text-rose-100/90">
                  {HUMAN_INTEL}
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setView("tutor")}
                  className={`flex items-center gap-2 rounded border ${accent} bg-amber-950/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-amber-100 hover:bg-amber-900/60`}
                >
                  <Play size={12} />
                  Hear the map
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
                  Star Map Protocol · Kael's archival voice
                </p>
                <p className="mt-3 font-serif italic text-[14px] leading-relaxed text-amber-50/95 whitespace-pre-line">
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
                  className={`flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider ${subAccent} hover:text-amber-100`}
                >
                  <ChevronLeft size={12} />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNarrativeFlag("act5_tutor_star_map_seen", true);
                    setView("sectors");
                  }}
                  className={`rounded border ${accent} bg-amber-950/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-amber-100 hover:bg-amber-900/60`}
                >
                  See the sectors
                </button>
              </div>
            </motion.div>
          )}

          {view === "sectors" && (
            <motion.div
              key="sectors"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <div className={`rounded-md border ${accent} bg-stone-950/60 p-4`}>
                <div className="flex items-center gap-2">
                  <MapIcon size={14} className={subAccent} />
                  <p className={`font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                    Recruitment sectors · Kael's reach
                  </p>
                </div>
                <p className="mt-2 font-serif italic text-[12px] leading-relaxed text-amber-100/80">
                  Every world below has a descendant population. Most
                  carry dormant Thought Virus traces. Scan twice — once
                  for contamination, once for the thing they would never
                  think to mention.
                </p>
              </div>

              {SECTORS.map((s) => (
                <div
                  key={s.id}
                  className="rounded-md border border-amber-500/30 bg-amber-950/15 p-4"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-serif text-[14px] text-amber-50">
                      {s.name}
                    </p>
                    <p className={`font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                      {s.archetype}
                    </p>
                  </div>
                  <p className="mt-1 font-serif italic text-[12px] leading-relaxed text-amber-100/80">
                    {s.blurb}
                  </p>
                </div>
              ))}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setView("tutor")}
                  className={`flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider ${subAccent} hover:text-amber-100`}
                >
                  <ChevronLeft size={12} />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setView("iron_lion")}
                  className={`rounded border border-red-700/60 bg-red-950/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-red-100 hover:bg-red-900/60`}
                >
                  Tune the Comms Array
                </button>
              </div>
            </motion.div>
          )}

          {view === "iron_lion" && (
            <motion.div
              key="iron_lion"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <div className="rounded-md border border-red-700/60 bg-red-950/30 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-300/80">
                  Cades signal · Veridian VI
                </p>
                <p className="mt-1 font-display text-xl text-red-100">
                  Iron Lion's last broadcast
                </p>
                <p className="mt-3 font-mono text-[12px] leading-relaxed whitespace-pre-line text-red-100/90">
                  {IRON_LION_BROADCAST}
                </p>
              </div>
              <div className="rounded-md border border-stone-700 bg-stone-900/40 p-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-stone-400">
                  Cades campaign · M7 placeholder
                </p>
                <p className="mt-1 font-serif italic text-[12px] leading-relaxed text-stone-300/90">
                  The Cades external campaign covers the playable form of
                  Iron Lion's last stand. Until the producer team ships
                  the Godot project (or while running the in-fiction
                  signal-only path), the press-room recovery resolves
                  here.
                </p>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setView("sectors")}
                  className={`flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider ${subAccent} hover:text-amber-100`}
                >
                  <ChevronLeft size={12} />
                  Back to the map
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNarrativeFlag("cades_m7_complete", true);
                    setNarrativeFlag("iron_lion_3001st_poster_recovered", true);
                    setView("close");
                  }}
                  className="rounded border border-red-700/60 bg-red-950/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-red-100 hover:bg-red-900/60"
                  data-testid="cades-m7-recover-poster"
                >
                  Recover the 3001st poster
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
                    Act 5 · The Map · open
                  </p>
                  <Link
                    to="/witnessing"
                    className={`${subAccent} hover:text-amber-100`}
                    aria-label="Return"
                  >
                    <X size={14} />
                  </Link>
                </div>
                <p className="mt-2 font-serif italic text-[13px] leading-relaxed text-amber-100/85">
                  The map is yours now. Recruitment runs through the
                  War Room. The first recruitment from any Kael-lineage
                  world fires the cross-game thread.
                </p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-stone-500">
                  Complete the recruitment thresholds to trigger Act 6 ·
                  The Confession.
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Link
                  to="/cross-game-threads"
                  className="rounded border border-stone-500/40 bg-stone-800/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-stone-200 hover:bg-stone-700/40"
                >
                  See cross-game threads
                </Link>
                <Link
                  to="/witnessing"
                  className={`rounded border ${accent} bg-amber-950/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-amber-100 hover:bg-amber-900/60`}
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
