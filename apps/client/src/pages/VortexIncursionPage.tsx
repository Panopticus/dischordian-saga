/* ═══════════════════════════════════════════════════════
   VORTEX INCURSION PAGE — §11.5 endgame

   The player-facing loop for the 10-room Vortex Incursion.
   Walks through each canonical room from VORTEX_INCURSION_
   ROOMS, showing the room card, its buff preview, and a
   Clear button that advances the run. On each clear, the
   player's Dischordia Cycle light meter advances; the
   Vortex Core (room 9) adds a bonus and flips the
   sector_wakes milestone flag.

   This is the narrative-shell version of the gameplay.
   The actual minigames (combat / puzzle / card duel per
   room type) can be wired into the Clear handler later —
   right now clearing a room is the canonical state
   transition the rest of the system watches for.
   ═══════════════════════════════════════════════════════ */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CircleDashed,
  X,
  CheckCircle2,
  Lock,
  Trophy,
  Crosshair,
} from "lucide-react";
import type { IncursionRoomDef, IncursionRun } from "@shared/incursions";
import { VortexRoomMinigame } from "@/components/VortexRoomMinigame";
import {
  VORTEX_CORE_BONUS_LIGHT,
  VORTEX_LIGHT_PER_ROOM,
  countVortexRoomsCleared,
  isVortexRunComplete,
} from "@shared/vortexIncursionRun";
import { useVortexIncursionStore } from "@/stores/vortexIncursionStore";
import { useDischordiaCycleStore } from "@/stores/dischordiaCycleStore";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import LivingBackground from "@/components/LivingBackground";

import { assetUrl } from "@/lib/assetUrl";
type View = "briefing" | "running" | "complete";

export default function VortexIncursionPage() {
  const { user, isAuthenticated } = useAuth();
  const { state: gameState, setNarrativeFlag } = useGame();
  const applyRawDelta = useDischordiaCycleStore((s) => s.applyRawDelta);
  const activeRun = useVortexIncursionStore((s) => s.activeRun);
  const stats = useVortexIncursionStore((s) => s.stats);
  const startRun = useVortexIncursionStore((s) => s.startRun);
  const clearCurrentRoom = useVortexIncursionStore((s) => s.clearCurrentRoom);
  const abandonRun = useVortexIncursionStore((s) => s.abandonRun);

  // Server sync — the community progress counter + the
  // mutation that reports each room clear back to the server.
  const communityProgress = trpc.vortexIncursion.getCommunityProgress.useQuery(
    undefined,
    {
      retry: false,
      refetchInterval: 30_000,
      refetchOnWindowFocus: false,
    },
  );
  const reportRoomCleared = trpc.vortexIncursion.reportRoomCleared.useMutation();
  const utils = trpc.useUtils();

  const [view, setView] = useState<View>(() =>
    activeRun && !isVortexRunComplete(activeRun) ? "running" : "briefing",
  );
  const [roomStartMs, setRoomStartMs] = useState<number>(() => Date.now());

  // Reset the room clock whenever the room index changes.
  useEffect(() => {
    setRoomStartMs(Date.now());
  }, [activeRun?.currentRoomIndex]);

  // Detect run completion.
  useEffect(() => {
    if (activeRun && isVortexRunComplete(activeRun)) {
      setView("complete");
    }
  }, [activeRun]);

  const handleStart = useCallback(() => {
    const playerId = user?.id ? String(user.id) : "solo_player";
    startRun(playerId);
    setView("running");
  }, [user?.id, startRun]);

  const handleClearRoom = useCallback(() => {
    if (!activeRun) return;
    const elapsedMs = Date.now() - roomStartMs;
    const roomIndex = activeRun.currentRoomIndex;
    const roomDef = activeRun.rooms[roomIndex]?.def;
    const isCore = roomDef?.key === "vortex_core";
    clearCurrentRoom(elapsedMs);

    // Apply the canonical Dischordia Cycle light energy.
    const lightGain =
      VORTEX_LIGHT_PER_ROOM + (isCore ? VORTEX_CORE_BONUS_LIGHT : 0);
    applyRawDelta({ light: lightGain });

    // Vortex Core clear fires the sector_wakes milestone.
    if (isCore) {
      setNarrativeFlag("event_sector_wakes", true);
      setNarrativeFlag("vortex_core_cleared", true);
    }

    // Server sync — fire-and-forget. The ripple engine will
    // emit vortex_room_cleared on the server side, which the
    // community counter queries pick up on the next refetch.
    if (isAuthenticated && roomDef) {
      reportRoomCleared
        .mutateAsync({
          runId: activeRun.runId,
          roomKey: roomDef.key,
          roomIndex,
          elapsedMs,
          isCore,
        })
        .then(() => {
          // Bump the community counter query on successful report.
          utils.vortexIncursion.getCommunityProgress.invalidate();
        })
        .catch((err) => {
          // Best-effort — the local store already advanced.
          console.warn("[vortexIncursion] report failed:", err);
        });
    }
  }, [
    activeRun,
    roomStartMs,
    clearCurrentRoom,
    applyRawDelta,
    setNarrativeFlag,
    isAuthenticated,
    reportRoomCleared,
    utils,
  ]);

  const handleAbandon = useCallback(() => {
    abandonRun();
    setView("briefing");
  }, [abandonRun]);

  const currentRoom = useMemo(() => {
    if (!activeRun) return null;
    return activeRun.rooms[activeRun.currentRoomIndex] ?? null;
  }, [activeRun]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 to-[#050010] relative">
      <LivingBackground
        src={assetUrl("art/rooms/room-observation-deck.png")}
        accent="#a78bfa"
        opacity={0.12}
        particleCount={5}
        scanlines={true}
      />
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b void-border-system void-bg-canvas backdrop-blur-sm">
          <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link
                  href="/witnessing"
                  className="void-text-system void-text-system transition-colors"
                  aria-label="Back to Witnessing Hub"
                >
                  <ChevronLeft size={18} />
                </Link>
                <div>
                  <h1 className="font-display text-lg font-bold tracking-wider void-text-system flex items-center gap-2">
                    <CircleDashed size={16} className="void-text-system" />
                    THE VORTEX INCURSION
                  </h1>
                  <p className="font-mono text-[10px] void-text-system tracking-wider">
                    §11.5 · Community Endgame · {stats.runsCompleted} run
                    {stats.runsCompleted === 1 ? "" : "s"} complete
                  </p>
                </div>
              </div>
              {activeRun && view === "running" && (
                <p className="font-mono text-[10px] void-text-system">
                  Room {activeRun.currentRoomIndex + 1} / 10
                </p>
              )}
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <AnimatePresence mode="wait">
            {view === "briefing" && (
              <motion.section
                key="briefing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <BriefingView
                  stats={stats}
                  communityProgress={communityProgress.data ?? null}
                  onStart={handleStart}
                />
              </motion.section>
            )}

            {view === "running" && activeRun && currentRoom && (
              <motion.section
                key={`running_${activeRun.currentRoomIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                <RunningView
                  run={activeRun}
                  currentRoomDef={currentRoom.def}
                  onClearRoom={handleClearRoom}
                  onAbandon={handleAbandon}
                />
              </motion.section>
            )}

            {view === "complete" && activeRun && (
              <motion.section
                key="complete"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CompleteView
                  run={activeRun}
                  stats={stats}
                  onBackToBriefing={() => {
                    abandonRun();
                    setView("briefing");
                  }}
                />
              </motion.section>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   BRIEFING VIEW
   ═══════════════════════════════════════════════════════ */

function BriefingView({
  stats,
  communityProgress,
  onStart,
}: {
  stats: { runsCompleted: number; roomsCleared: number; coresReached: number };
  communityProgress: {
    roomsClearedThisWeek: number;
    coresHeldThisWeek: number;
    uniqueArksThisWeek: number;
  } | null;
  onStart: () => void;
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-md border void-border-system void-bg-canvas p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] void-text-system">
          COMMUNITY ENDGAME
        </p>
        <h2 className="mt-1 font-display text-2xl void-text-system">
          Push Back the Vortex
        </h2>
        <p className="mt-4 font-serif text-[14px] leading-relaxed void-text">
          Ten rooms separate you from the Vortex itself. The first four are
          the drift into its territory — silence, memory, a chapel of lost
          names, and the first thing that notices you. The fifth is its
          firstborn Sentinel. The sixth is a Mini-Vortex you can step into.
          Rooms seven through nine are the deep incursion — a garden that
          remembers itself, a library of erased books, and a room that has
          refused to be consumed.
        </p>
        <p className="mt-3 font-serif text-[14px] leading-relaxed void-text">
          The tenth room is the Vortex. It does not stop eating. You do not
          defeat it. You hold the line long enough for another Ark to take
          the next watch.
        </p>
      </section>

      {/* Community progress — aggregated across every Ark
          that reported a Vortex room clear in the last 7 days. */}
      <section className="rounded-md border void-border-system void-bg-system p-4">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] void-text-system">
          COMMUNITY THIS WEEK
        </p>
        {communityProgress ? (
          <div className="grid grid-cols-3 gap-3 font-mono text-[10px] void-text-system">
            <Stat label="Rooms held" value={communityProgress.roomsClearedThisWeek} />
            <Stat label="Cores held" value={communityProgress.coresHeldThisWeek} />
            <Stat label="Arks active" value={communityProgress.uniqueArksThisWeek} />
          </div>
        ) : (
          <p className="font-mono text-[10px] void-text-system">
            Fetching the next watch…
          </p>
        )}
      </section>

      <section className="rounded-md border void-border-system void-bg-canvas p-4">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] void-text-system">
          YOUR RECORD
        </p>
        <div className="grid grid-cols-3 gap-3 font-mono text-[10px] void-text-system">
          <Stat label="Runs" value={stats.runsCompleted} />
          <Stat label="Rooms cleared" value={stats.roomsCleared} />
          <Stat label="Cores reached" value={stats.coresReached} />
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onStart}
          className="flex items-center gap-2 rounded-sm border void-border-system void-bg-system px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider void-text-system void-border-system void-bg-system transition-colors"
        >
          <CircleDashed size={14} />
          Begin the Incursion
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border void-border-system void-bg-canvas p-2">
      <p className="text-[8px] uppercase void-text-system">{label}</p>
      <p className="font-display text-lg void-text-system">{value}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   RUNNING VIEW — active room
   ═══════════════════════════════════════════════════════ */

function RunningView({
  run,
  currentRoomDef,
  onClearRoom,
  onAbandon,
}: {
  run: IncursionRun;
  currentRoomDef: IncursionRoomDef;
  onClearRoom: () => void;
  onAbandon: () => void;
}) {
  const clearedCount = countVortexRoomsCleared(run);
  const progressPct = Math.round((clearedCount / run.rooms.length) * 100);
  const roomIndex = run.currentRoomIndex;
  const isCore = currentRoomDef.key === "vortex_core";

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div>
        <div className="h-1 w-full rounded void-bg-system overflow-hidden">
          <motion.div
            className="h-full void-bg-system"
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider void-text-system">
          <span>{clearedCount} cleared</span>
          <span>{run.rooms.length - clearedCount} remaining</span>
        </div>
      </div>

      {/* Room card */}
      <section
        className={`rounded-md border p-6 ${
          isCore
            ? "void-border-system void-bg-system shadow-[0_0_40px_rgba(167,139,250,0.2)]"
            : "void-border-system void-bg-canvas"
        }`}
      >
        <div className="mb-3 flex items-center gap-2">
          {isCore ? (
            <Crosshair size={14} className="void-text-system" />
          ) : (
            <CircleDashed size={14} className="void-text-system" />
          )}
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] void-text-system">
            ROOM {roomIndex + 1} · {currentRoomDef.type.toUpperCase()}
            {currentRoomDef.puzzleVariant
              ? ` · ${currentRoomDef.puzzleVariant.toUpperCase()}`
              : ""}
          </p>
        </div>
        <h2
          className={`font-display text-xl ${
            isCore ? "void-text-system" : "void-text-system"
          }`}
        >
          {currentRoomDef.name}
        </h2>
        <p className="mt-3 font-serif text-[14px] leading-relaxed void-text">
          {currentRoomDef.description}
        </p>
        <div className="mt-5 rounded border void-border-system void-bg-canvas p-3">
          <p className="font-mono text-[9px] uppercase tracking-wider void-text-system">
            Buff on clear
          </p>
          <p className="mt-1 font-mono text-[11px] void-text-system">
            {currentRoomDef.buff.label}
          </p>
        </div>
        <p className="mt-3 font-mono text-[10px] void-text-system">
          Difficulty modifier · ×{currentRoomDef.difficultyMod.toFixed(2)}
        </p>
      </section>

      {/* Minigame dispatcher — renders the interactive content
          for this room type. On resolve the page fires
          onClearRoom, which advances the run + applies light. */}
      <VortexRoomMinigame
        roomDef={currentRoomDef}
        seed={run.startedAt + roomIndex * 7919}
        onResolve={(outcome) => {
          if (outcome === "won") onClearRoom();
          // A failed minigame leaves the room unresolved — the
          // player can retry the same puzzle by staying on the
          // page. Loss tracking could be wired here later.
        }}
      />

      {/* Abandon action */}
      <div className="flex items-center justify-start">
        <button
          type="button"
          onClick={onAbandon}
          className="flex items-center gap-1.5 rounded-sm border void-border-error void-bg-error px-4 py-2 font-mono text-[10px] uppercase tracking-wider void-text-error void-border-error void-bg-error transition-colors"
        >
          <X size={11} />
          Abandon
        </button>
      </div>

      {/* Mini-map of all ten rooms */}
      <section className="rounded-md border void-border-system void-bg-canvas p-3">
        <p className="mb-2 font-mono text-[9px] uppercase tracking-wider void-text-system">
          Incursion map
        </p>
        <ul className="grid grid-cols-10 gap-1">
          {run.rooms.map((room, i) => {
            const done = room.cleared;
            const current = i === roomIndex;
            const upcoming = i > roomIndex;
            return (
              <li
                key={room.def.key}
                className={`h-8 rounded border flex items-center justify-center text-[9px] font-mono ${
                  done
                    ? "void-border-system void-bg-system void-text-system"
                    : current
                    ? "void-border-success void-bg-success void-text-energy"
                    : "void-border-system void-bg-canvas void-text-system"
                }`}
                title={room.def.name}
              >
                {done ? (
                  <CheckCircle2 size={10} />
                ) : upcoming ? (
                  <Lock size={10} />
                ) : (
                  <span>{i + 1}</span>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   COMPLETE VIEW
   ═══════════════════════════════════════════════════════ */

function CompleteView({
  run,
  stats,
  onBackToBriefing,
}: {
  run: IncursionRun;
  stats: { lastRunLightEnergy: number; coresReached: number };
  onBackToBriefing: () => void;
}) {
  const totalTime = run.rooms.reduce((sum, r) => sum + r.elapsedMs, 0);
  const minutes = Math.floor(totalTime / 60000);
  const seconds = Math.floor((totalTime % 60000) / 1000);
  return (
    <div className="space-y-6">
      <section className="rounded-md border void-border-system void-bg-system p-8 text-center shadow-[0_0_50px_rgba(167,139,250,0.25)]">
        <Trophy size={36} className="mx-auto mb-3 void-text-system" />
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] void-text-system">
          VORTEX HELD
        </p>
        <h2 className="mt-2 font-display text-2xl void-text-system">
          The line held.
        </h2>
        <p className="mt-4 max-w-md mx-auto font-serif text-[14px] leading-relaxed void-text">
          The Vortex pauses. Not for long. Long enough for another Ark to
          take the next watch. Every player on the server gets a little
          more Light for the next day.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 font-mono text-[10px] void-text-system">
          <span className="rounded border void-border-system void-bg-system px-3 py-1">
            +{stats.lastRunLightEnergy} Community Light
          </span>
          <span className="rounded border void-border-system void-bg-system px-3 py-1">
            {minutes}m {seconds}s total
          </span>
          <span className="rounded border void-border-system void-bg-system px-3 py-1">
            Cores reached · {stats.coresReached}
          </span>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onBackToBriefing}
          className="flex items-center gap-2 rounded-sm border void-border-system void-bg-system px-4 py-2 font-mono text-[10px] uppercase tracking-wider void-text-system void-border-system void-bg-system transition-colors"
        >
          Return to briefing
          <ChevronRight size={12} />
        </button>
      </div>

      {/* Icon that doesn't get used in production — keeps the
          import compiler-friendly */}
      <span className="hidden" aria-hidden>
        <Sparkles size={1} />
      </span>
    </div>
  );
}
