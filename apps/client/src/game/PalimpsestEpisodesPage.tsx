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

import { useState, useMemo, useEffect } from "react";
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
import { getBalanceDescription } from "@shared/palimpsest";
import { getHackForEpisode } from "@shared/theInventor";
import { getLetterForEpisode, isDarrenGone } from "@shared/darrenFessler";
import GamemastersArena from "./GamemastersArena";
import { HostMaskSlip } from "@/components/HostMaskSlip";
import { trpc } from "@/lib/trpc";
import { usePalimpsest } from "@/hooks/usePalimpsest";
import { useGame } from "@/contexts/GameContext";
import { EPISODE_11_COMPLETED_AT_KEY } from "@/game/humanRelationship";

type Phase = "lobby" | "broadcast" | "crawl" | "letter" | "funeral";

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
  const [crawlNames, setCrawlNames] = useState<string[]>([]);

  // Shared Palimpsest state (dedupes with the Governance Hub panel
  // and every CorruptibleBio on the page).
  const { state: palimpsestState, phase: phaseLabel, isMaskSlipping: maskSlipping, refetch: refetchPalimpsest } = usePalimpsest();
  const completedQuery = trpc.palimpsest.listCompletedEpisodes.useQuery();
  const { setElaraCallback, setHumanCallback, setNarrativeFlag } = useGame();
  const recordEpisode = trpc.palimpsest.recordEpisode.useMutation({
    onSuccess: () => {
      refetchPalimpsest();
      completedQuery.refetch();
    },
  });

  const completedSet = useMemo(
    () => new Set(completedQuery.data?.completed ?? []),
    [completedQuery.data],
  );

  const selectedEpisode = useMemo(
    () => (selected !== null ? getEpisode(selected) : null),
    [selected],
  );

  const completedCount = completedSet.size;

  const handleBroadcast = (episode: PalimpsestEpisode) => {
    setSelected(episode.episodeNumber);
    // Episode 13 is the silent funeral episode — no quiz, no casualty
    // crawl. The player watches in a separate dedicated view.
    if (episode.episodeNumber === 13) {
      setPhase("funeral");
      return;
    }
    setPhase("broadcast");
  };

  const handleEpisodeComplete = (dream: number, rounds: number) => {
    if (!selectedEpisode) return;
    const won = rounds >= 10;
    const winner: "signal" | "noise" = won ? "signal" : "noise";

    // Build the real casualty list from rolled count + elimination round.
    // Elimination round for the player is the round they lost on (or 10 for survivors).
    const casualtyCount = rollCasualtyCount(
      selectedEpisode.episodeNumber,
      palimpsestState.noise,
    );
    const casualties: { playerName: string; eliminationRound: number }[] = [];
    // First `casualtyCount` entries from the name pool, each assigned a
    // plausible elimination round distributed across the broadcast.
    for (let i = 0; i < Math.min(casualtyCount, CASUALTY_NAME_POOL.length); i++) {
      casualties.push({
        playerName: CASUALTY_NAME_POOL[i],
        eliminationRound: Math.min(10, 2 + Math.floor((i * 10) / Math.max(1, casualtyCount))),
      });
    }
    // Guaranteed: Darren dies in Episode 12, off-screen between rounds.
    if (selectedEpisode.episodeNumber === 12) {
      casualties.push({ playerName: "Darren Fessler", eliminationRound: 10 });
    }
    // The player's own clone death counts as a casualty when they lose.
    if (!won) {
      casualties.push({ playerName: "Clone 1047-A", eliminationRound: rounds + 1 });
    }
    const names = casualties.map((c) => c.playerName);
    setCrawlNames(names);

    // Inventor's hack landed this episode iff the canonical hack wasn't blocked.
    const hack = getHackForEpisode(selectedEpisode.episodeNumber);

    recordEpisode.mutate({
      episodeNumber: selectedEpisode.episodeNumber,
      winner,
      casualties,
      signalGained: won ? 50 : 0,
      noiseGained: won ? 0 : 25,
      inventorHackLanded: !!hack && !hack.blocked,
    });

    // Fire the dialog callback flags so Elara and The Human start
    // referencing the episode the next time the player visits an
    // Ark room that triggers their callbacks. Each episode has its
    // own flag so callbacks fire selectively, not all at once.
    const epFlag = `palimpsest_ep${selectedEpisode.episodeNumber}_completed`;
    setElaraCallback(epFlag);
    setHumanCallback(epFlag);
    // Also set a coarse narrative flag so gating systems (rooms,
    // Loredex unlocks, card drops) can check simple "did episode N
    // complete" predicates without threading callback state.
    setNarrativeFlag(epFlag);
    // Episode 11 starts The Human's 4-week silence window — record
    // the timestamp so getHumanCallback can suppress his whispers
    // outside the allowed Ep11/12/13 payloads until bandwidth
    // recovers. Stored in localStorage so it survives reloads
    // without requiring a GameState schema change.
    if (selectedEpisode.episodeNumber === 11) {
      try {
        localStorage.setItem(EPISODE_11_COMPLETED_AT_KEY, String(Date.now()));
      } catch {
        /* quota / private mode — non-blocking */
      }
    }

    toast.success(`Episode ${selectedEpisode.episodeNumber} complete`, {
      description: `+${dream} Dream · ${rounds}/10 rounds`,
    });

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
        <div className="max-w-5xl mx-auto flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => navigate("/ark")}
            className="text-white/30 hover:text-white/60 shrink-0"
            aria-label="back"
          >
            <ChevronLeft size={18} />
          </button>
          <Radio size={16} className="text-red-400 shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-sm font-bold tracking-[0.2em] text-red-400 truncate">
              THE PALIMPSEST
            </h1>
            <p className="font-mono text-[8px] text-white/30 truncate">
              <span className="hidden xs:inline">{completedCount}/13 EPISODES WITNESSED</span>
              <span className="xs:hidden">{completedCount}/13</span>
              <span className="mx-1">·</span>
              <span className="uppercase">{phaseLabel}</span>
            </p>
          </div>
          {maskSlipping && (
            <div className="flex items-center gap-1 text-red-400 shrink-0">
              <AlertTriangle size={12} className="animate-pulse" />
              <span className="font-mono text-[9px] hidden sm:inline">MASK SLIPPING</span>
              <span className="font-mono text-[9px] sm:hidden">SLIP</span>
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
              const isCompleted = completedSet.has(ep.episodeNumber);
              const isLocked =
                ep.episodeNumber > 1 && !completedSet.has(ep.episodeNumber - 1);
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
                      : isCompleted
                      ? "border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10"
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
                    ) : isCompleted ? (
                      <Trophy size={12} className="text-amber-400" />
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
        <>
          {/* Thaloria debate stage overlay on Episode 10 */}
          {selectedEpisode.useThaloriaStage && (
            <img
              src="/art/special-maps/special-thaloria-debate-stage.png"
              alt=""
              aria-hidden
              className="fixed inset-0 w-full h-full object-cover z-[55] pointer-events-none"
              style={{ opacity: 0.25, filter: "brightness(0.4) saturate(1.1)" }}
              data-testid="palimpsest-thaloria-stage"
            />
          )}
          {/* Host mask slip overlay — only when Noise dominates */}
          <HostMaskSlip state={palimpsestState} />
          <GamemastersArena
            onComplete={handleEpisodeComplete}
            onClose={() => {
              setPhase("lobby");
              setSelected(null);
            }}
          />
        </>
      )}

      {/* ═══ EPISODE 13 — FUNERAL (silent broadcast) ═══ */}
      <AnimatePresence>
        {phase === "funeral" && selectedEpisode && (
          <Episode13Funeral
            onDismiss={() => {
              // Finalize Episode 13 just by showing up.
              recordEpisode.mutate({
                episodeNumber: 13,
                winner: "signal",
                casualties: [],
                signalGained: 10,
                noiseGained: 0,
                inventorHackLanded: false,
              });
              // Fire the Ep13 callback flags — Elara/Human dialog
              // references the shimmering Marion Kell mourner in
              // subsequent room visits.
              setElaraCallback("palimpsest_ep13_completed");
              setHumanCallback("palimpsest_ep13_completed");
              setNarrativeFlag("palimpsest_ep13_completed");
              setPhase("lobby");
              setSelected(null);
            }}
          />
        )}
      </AnimatePresence>

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

/* ─── EPISODE 13: FUNERAL ─── */
/**
 * Silent broadcast. Thirty seconds of a black screen with
 * "TECHNICAL DIFFICULTIES." If the player waits, they see
 * Darren's graveside service in the Celebration cemetery.
 * No score. No casualties. Just showing up is Signal.
 */
function Episode13Funeral({ onDismiss }: { onDismiss: () => void }) {
  const [stage, setStage] = useState<"technical" | "service" | "credits">("technical");
  const [staticPhase, setStaticPhase] = useState(true);

  // Progress through the three stages. Total watch time ~36s.
  // The timer only advances while the tab is visible — a player
  // who backgrounds the funeral doesn't accidentally skip past
  // the graveside service while they're away. This mirrors the
  // in-universe act of *bearing witness*: you have to actually
  // be present to receive the Signal.
  useEffect(() => {
    const VISIBLE_STAGE_MS = [6000, 24000]; // technical → service → credits
    let visibleElapsed = 0;
    let lastTick = typeof document !== "undefined" && !document.hidden ? Date.now() : null;
    let raf: number | null = null;

    const advance = (elapsed: number) => {
      if (elapsed >= VISIBLE_STAGE_MS[0] + VISIBLE_STAGE_MS[1]) {
        setStage("credits");
      } else if (elapsed >= VISIBLE_STAGE_MS[0]) {
        setStage("service");
        setStaticPhase(false);
      }
    };

    const tick = () => {
      if (lastTick !== null) {
        const now = Date.now();
        visibleElapsed += now - lastTick;
        lastTick = now;
        advance(visibleElapsed);
      }
      raf = window.setTimeout(tick, 250);
    };

    const onVisibility = () => {
      if (document.hidden) {
        lastTick = null;
      } else {
        lastTick = Date.now();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    raf = window.setTimeout(tick, 250);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (raf !== null) clearTimeout(raf);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] bg-black text-white/80 flex flex-col items-center justify-center"
      data-testid="palimpsest-funeral"
    >
      {stage === "technical" && (
        <div className="text-center">
          <p
            className={`font-mono text-base tracking-[0.4em] ${
              staticPhase ? "animate-pulse" : ""
            }`}
          >
            TECHNICAL DIFFICULTIES
          </p>
          <p className="font-mono text-[10px] text-white/30 mt-4">
            Please stand by. Broadcast will resume shortly.
          </p>
        </div>
      )}

      {stage === "service" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-md text-center px-6"
        >
          <p className="font-serif text-[14px] italic text-amber-200/70 leading-relaxed mb-4">
            A small graveside service. The Celebration sector cemetery. The sky is
            painted; the flowers are real.
          </p>
          <p className="font-serif text-[13px] italic text-amber-200/60 leading-relaxed mb-4">
            Nine people attend. One wears red goggles. One of them shimmers faintly.
            Nobody speaks.
          </p>
          <p className="font-serif text-[12px] italic text-white/50 leading-relaxed">
            The headstone reads: DARREN FESSLER · BELOVED SON · HE WROTE DOWN THE
            THINGS THAT DIDN'T MAKE THE BROADCAST.
          </p>
        </motion.div>
      )}

      {stage === "credits" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-md px-6"
        >
          <p className="font-serif text-[14px] italic text-amber-200/80 mb-6">
            You stayed until the end. The Palimpsest remembers what you did.
          </p>
          <p className="font-mono text-[10px] text-white/40 mb-6 tracking-wider">
            EPISODE 13 · DIRECTED BY NOBODY · IN MEMORIAM
          </p>
          <button
            onClick={onDismiss}
            className="px-6 py-2 rounded border border-amber-500/30 font-mono text-[10px] tracking-wider text-amber-300 hover:bg-amber-500/10"
          >
            RETURN TO THE ARK
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
