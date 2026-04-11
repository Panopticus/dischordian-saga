/* ═══════════════════════════════════════════════════════
   THE PALIMPSEST — Episode Lobby & Casualty Crawl

   Landing page for the 13-episode Palimpsest broadcast. Shows:
     • Episode selector grid (13 cards)
     • Cold open preview, host line, guest list
     • "Broadcast" button — routes into the Gamemaster's Arena
        with episode context
     • Post-episode: scrolling casualty crawl overlay

   Uses the data model from apps/shared/palimpsestEpisodes.ts
   and the Palimpsest meter descriptors from apps/shared/palimpsest.ts.
   ═══════════════════════════════════════════════════════ */

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  Radio, Skull, Trophy, Lock, ChevronLeft, Users, AlertTriangle,
  BookOpen, Eye,
} from "lucide-react";
import {
  PALIMPSEST_EPISODES,
  getEpisode,
  rollCasualtyCount,
  type PalimpsestEpisode,
} from "@shared/palimpsestEpisodes";
import {
  DEFAULT_PALIMPSEST_STATE,
  getPhase,
  getBalanceDescription,
  shouldHostMaskSlip,
} from "@shared/palimpsest";
import { getHackForEpisode, didHackLand } from "@shared/theInventor";
import { getLetterForEpisode, isDarrenGone } from "@shared/darrenFessler";
import GamemastersArena from "./GamemastersArena";

type Phase = "lobby" | "broadcast" | "crawl" | "letter";

interface EpisodeProgress {
  [episodeNumber: number]: { completed: boolean; won: boolean; dreamEarned: number };
}

const STORAGE_KEY = "palimpsest_episode_progress";

function loadProgress(): EpisodeProgress {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveProgress(progress: EpisodeProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    /* quota full — non-blocking */
  }
}

/* ─── CASUALTY CRAWL ─── */
function CasualtyCrawl({
  episode,
  names,
  onDismiss,
}: {
  episode: PalimpsestEpisode;
  names: string[];
  onDismiss: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-black/95 flex flex-col items-center justify-center"
      onClick={onDismiss}
      data-testid="palimpsest-casualty-crawl"
    >
      <div className="max-w-lg w-full px-6">
        <div className="text-center mb-6">
          <Skull size={40} className="text-red-400/80 mx-auto mb-3" />
          <h2 className="font-display text-xl font-black tracking-[0.3em] text-red-400 mb-1">
            CASUALTY CRAWL
          </h2>
          <p className="font-mono text-[10px] text-red-300/50 tracking-wider">
            EPISODE {episode.episodeNumber} · {episode.title.toUpperCase()}
          </p>
        </div>

        <div className="h-56 overflow-hidden relative border-y border-red-500/20">
          {names.length === 0 ? (
            <p className="text-center font-mono text-xs text-green-400/70 pt-24">
              No casualties this week. The Host sulks.
            </p>
          ) : (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: "-100%" }}
              transition={{ duration: Math.max(6, names.length * 2), ease: "linear" }}
              className="absolute inset-x-0"
            >
              {names.map((name, i) => (
                <div
                  key={`${name}-${i}`}
                  className="py-2 font-serif text-base text-red-200/80 text-center italic"
                >
                  {name}
                </div>
              ))}
            </motion.div>
          )}
        </div>

        <p className="font-mono text-[9px] text-center text-white/30 mt-6 tracking-wider">
          Tap anywhere to dismiss
        </p>
      </div>
    </motion.div>
  );
}

/* ─── PAGE ─── */
export default function PalimpsestEpisodesPage() {
  const [, navigate] = useLocation();
  const [phase, setPhase] = useState<Phase>("lobby");
  const [selected, setSelected] = useState<number | null>(null);
  const [progress, setProgress] = useState<EpisodeProgress>(() => loadProgress());
  const [crawlNames, setCrawlNames] = useState<string[]>([]);

  // Keep progress persisted.
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const palimpsestState = DEFAULT_PALIMPSEST_STATE; // Placeholder until tRPC hookup.
  const phaseLabel = getPhase(palimpsestState);
  const maskSlipping = shouldHostMaskSlip(palimpsestState);

  const selectedEpisode = useMemo(
    () => (selected !== null ? getEpisode(selected) : null),
    [selected],
  );

  const completedCount = Object.values(progress).filter((p) => p.completed).length;

  const handleBroadcast = (episode: PalimpsestEpisode) => {
    // Ep 13 is the silent funeral — no quiz, just watch.
    if (episode.round3Format === "silent" && episode.episodeNumber === 13) {
      toast("The broadcast is thirty minutes of a black screen. You watch anyway.", {
        description: "+1 Signal for showing up.",
      });
      setProgress((prev) => ({
        ...prev,
        [episode.episodeNumber]: { completed: true, won: true, dreamEarned: 0 },
      }));
      return;
    }
    setSelected(episode.episodeNumber);
    setPhase("broadcast");
  };

  const handleEpisodeComplete = (dream: number, rounds: number) => {
    if (!selectedEpisode) return;
    const won = rounds >= 10;

    setProgress((prev) => ({
      ...prev,
      [selectedEpisode.episodeNumber]: {
        completed: true,
        won,
        dreamEarned: dream,
      },
    }));

    // Roll casualties for the crawl.
    const casualtyCount = rollCasualtyCount(selectedEpisode.episodeNumber, palimpsestState.noise);
    const names = CASUALTY_NAME_POOL.slice(0, casualtyCount);
    // Guaranteed entry for Episode 12: Darren.
    if (selectedEpisode.episodeNumber === 12 && !names.includes("Darren Fessler")) {
      names.push("Darren Fessler");
    }
    setCrawlNames(names);
    setPhase("crawl");
  };

  const handleCrawlDismiss = () => {
    // After the crawl, show Darren's letter if the episode has one.
    if (selectedEpisode && getLetterForEpisode(selectedEpisode.episodeNumber)) {
      setPhase("letter");
      return;
    }
    setPhase("lobby");
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/95 border-b border-red-500/15 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/ark")}
            className="text-white/30 hover:text-white/60"
            aria-label="back"
          >
            <ChevronLeft size={18} />
          </button>
          <Radio size={16} className="text-red-400" />
          <div>
            <h1 className="font-display text-sm font-bold tracking-[0.2em] text-red-400">
              THE PALIMPSEST
            </h1>
            <p className="font-mono text-[8px] text-white/30">
              {completedCount}/13 EPISODES WITNESSED · {phaseLabel.toUpperCase()}
            </p>
          </div>
          {maskSlipping && (
            <div className="ml-auto flex items-center gap-1 text-red-400">
              <AlertTriangle size={12} className="animate-pulse" />
              <span className="font-mono text-[9px]">MASK SLIPPING</span>
            </div>
          )}
        </div>
      </div>

      {/* ═══ LOBBY ═══ */}
      {phase === "lobby" && (
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="mb-6 p-4 rounded border border-amber-500/20 bg-amber-500/5">
            <p className="font-serif text-[12px] italic text-amber-200/70 leading-relaxed">
              {getBalanceDescription(palimpsestState)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PALIMPSEST_EPISODES.map((ep) => {
              const epProgress = progress[ep.episodeNumber];
              const isLocked = ep.episodeNumber > 1 && !progress[ep.episodeNumber - 1]?.completed;
              const hack = getHackForEpisode(ep.episodeNumber);

              return (
                <motion.button
                  key={ep.episodeNumber}
                  disabled={isLocked}
                  onClick={() => !isLocked && handleBroadcast(ep)}
                  whileHover={!isLocked ? { scale: 1.02 } : {}}
                  whileTap={!isLocked ? { scale: 0.98 } : {}}
                  className={`text-left p-4 rounded-lg border transition-all ${
                    isLocked
                      ? "opacity-30 cursor-not-allowed border-white/5 bg-white/[0.02]"
                      : epProgress?.won
                      ? "border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10"
                      : epProgress?.completed
                      ? "border-red-500/20 bg-red-500/5 hover:bg-red-500/10"
                      : "border-white/10 bg-white/[0.02] hover:border-red-400/30"
                  }`}
                  data-testid={`palimpsest-episode-${ep.episodeNumber}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-mono text-[8px] text-white/30 tracking-wider">
                      EPISODE {ep.episodeNumber}
                    </span>
                    {isLocked ? (
                      <Lock size={10} className="text-white/20" />
                    ) : epProgress?.won ? (
                      <Trophy size={12} className="text-amber-400" />
                    ) : epProgress?.completed ? (
                      <Skull size={12} className="text-red-400/60" />
                    ) : (
                      <Radio size={12} className="text-red-400/40" />
                    )}
                  </div>
                  <h3 className="font-display text-sm font-bold text-white/90 mb-1">
                    {ep.title}
                  </h3>
                  <p className="font-mono text-[9px] text-white/40 mb-2 leading-relaxed">
                    {ep.synopsis}
                  </p>
                  <div className="flex items-center gap-3 text-[8px] font-mono">
                    <span className="text-cyan-400/60">{ep.round3Format.toUpperCase()}</span>
                    {ep.guests.length > 0 && (
                      <span className="text-purple-400/60 flex items-center gap-0.5">
                        <Users size={8} /> {ep.guests.length}
                      </span>
                    )}
                    {hack && !hack.blocked && (
                      <span className="text-green-400/50 flex items-center gap-0.5" title={hack.description}>
                        <Eye size={8} /> HACK
                      </span>
                    )}
                    {ep.safePoint && <span className="text-amber-400/60">★ SAFE</span>}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Darren absence notice */}
          {isDarrenGone(completedCount) && (
            <div className="mt-6 p-4 rounded border border-blue-500/20 bg-blue-500/5 text-center">
              <BookOpen size={16} className="mx-auto text-blue-400/70 mb-2" />
              <p className="font-mono text-[10px] text-blue-300/70">
                Darren's desk in the Dreams Workshop is now accessible. The blue folder is on top.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ═══ BROADCAST (Gamemaster's Arena quiz) ═══ */}
      {phase === "broadcast" && selectedEpisode && (
        <GamemastersArena
          onComplete={handleEpisodeComplete}
          onClose={() => {
            setPhase("lobby");
            setSelected(null);
          }}
        />
      )}

      {/* ═══ CASUALTY CRAWL ═══ */}
      <AnimatePresence>
        {phase === "crawl" && selectedEpisode && (
          <CasualtyCrawl
            episode={selectedEpisode}
            names={crawlNames}
            onDismiss={handleCrawlDismiss}
          />
        )}
      </AnimatePresence>

      {/* ═══ DARREN'S LETTER ═══ */}
      <AnimatePresence>
        {phase === "letter" && selectedEpisode && (
          <DarrenLetterModal
            episode={selectedEpisode.episodeNumber}
            onDismiss={() => {
              setPhase("lobby");
              setSelected(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── LETTER MODAL ─── */
function DarrenLetterModal({
  episode,
  onDismiss,
}: {
  episode: number;
  onDismiss: () => void;
}) {
  const letter = getLetterForEpisode(episode);
  if (!letter) {
    onDismiss();
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-4"
      onClick={onDismiss}
      data-testid="palimpsest-darren-letter"
    >
      <div
        className="max-w-md w-full p-5 rounded-lg border border-amber-500/30 bg-[#1a1308] font-serif text-amber-100/80"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-mono text-[9px] text-amber-400/50 mb-2 tracking-wider">
          FROM: DARREN FESSLER · SUBJECT: {letter.subject.toUpperCase()}
        </div>
        <hr className="border-amber-500/20 mb-3" />
        <p className="text-[12px] leading-relaxed italic mb-4">{letter.surface}</p>
        <hr className="border-amber-500/10 mb-3 border-dashed" />
        <p className="text-[11px] leading-relaxed text-amber-200/90">
          <span className="font-mono text-[8px] text-red-300/60 uppercase tracking-wider mr-1">
            BURIED:
          </span>
          {letter.buried}
        </p>
        <button
          onClick={onDismiss}
          className="mt-5 w-full py-2 rounded border border-amber-500/30 font-mono text-[10px] tracking-wider text-amber-300 hover:bg-amber-500/10"
        >
          CLOSE LETTER
        </button>
      </div>
    </motion.div>
  );
}

/* ─── NAME POOL FOR CASUALTY CRAWL ─── */
/** Procedural names used when the noise/base casualty count pulls extras. */
const CASUALTY_NAME_POOL: string[] = [
  "Theodora Vance",
  "Rurik Palwin",
  "Jessamine Cole",
  "Otavio Black",
  "Freya Kessler",
  "Maren Vos",
  "Auren Hollister",
  "Pell Kadir",
  "Wren Ostlund",
  "Marguerite Fessler", // Darren's mother — her name edited onto the crawl in Ep 9.
];
