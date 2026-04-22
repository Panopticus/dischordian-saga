/* ═══════════════════════════════════════════════════════
   THE TWO GAME MASTERS — §6.4 Act 2 encounter arena

   Split of the original Game Master into Left (tactical) and
   Right (improvisational). Who you meet here is chosen by the
   sign of your moralityScore via getActiveAct2GameMaster().

   Canon (GAME_MASTER_FIRST_LOSS_LINE): you will lose to them
   at chess. That loss is what fires `game_master_loss` — the
   Act 2 completion gate sub-flag. The ONLY way to finally beat
   a Game Master is in the Collector's Arena (TCG), which fires
   `game_master_defeated` for narrative continuity into Acts
   3-4 culling rematches.

   This page:
     - Picks Left vs. Right from moralityScore
     - Gates on moralityScore != 0 ("neither lens recognizes
       you yet")
     - Plays firstContactLine on first meeting
     - Offers two routes: Board (chess) and Arena (TCG). Dev
       buttons simulate each outcome for testing.
     - Fires firstDefeatLine + GAME_MASTER_FIRST_LOSS_LINE on
       first chess loss (sets game_master_loss).
     - Fires firstVictoryLine on first arena win (sets
       game_master_defeated + gm-specific _defeated flag).
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Eye, EyeOff, Goal, Sword, Swords } from "lucide-react";
import { toast } from "sonner";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { fireCompanionComment } from "@/lib/companionCommentQueue";
import { getActiveAct2GameMaster } from "@shared/witnessingRuntime";
import {
  GAME_MASTER_FIRST_LOSS_LINE,
  THE_LEFT_GAME_MASTER,
  THE_RIGHT_GAME_MASTER,
  type GameMasterProfile,
} from "@shared/act2Interlude";
import LivingBackground from "@/components/LivingBackground";

import { assetUrl } from "@/lib/assetUrl";
/** Minimum chess Climb rank (highestClearedRank) required before the
 *  Left/Right Game Masters recognize the player in the Arena. The
 *  Climb is the teaching ground; the Arena is the rematch venue. */
const CLIMB_RANK_REQUIRED_FOR_ARENA = 1;

export default function GameMastersArenaAct2Page() {
  const { state, setNarrativeFlag } = useGame();
  const flags = state.narrativeFlags ?? {};
  const moralityScore = state.moralityScore ?? 0;

  const { isAuthenticated } = useAuth();
  const climbStateQ = trpc.chessClimb.getState.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });
  const climbRank = climbStateQ.data?.unlocks.highestClearedRank ?? -1;
  const climbGateMet = climbRank >= CLIMB_RANK_REQUIRED_FOR_ARENA;

  const activeGM = useMemo(
    () => getActiveAct2GameMaster(moralityScore),
    [moralityScore],
  );

  const contactFlag = activeGM
    ? `${activeGM.id}_first_contact_seen`
    : undefined;
  const hasContacted = !!(contactFlag && flags[contactFlag]);

  // Fire the first-contact line on first mount with an active GM.
  useEffect(() => {
    if (activeGM && contactFlag && !hasContacted) {
      setNarrativeFlag(contactFlag, true);
    }
  }, [activeGM, contactFlag, hasContacted, setNarrativeFlag]);

  const handleChessLoss = useCallback(() => {
    if (!activeGM) return;
    if (!flags.game_master_loss) {
      setNarrativeFlag("game_master_loss", true);
      fireCompanionComment("game_master_first_loss");
      toast.info("The Game Masters", {
        description: GAME_MASTER_FIRST_LOSS_LINE,
        duration: 15000,
      });
    }
    toast.message(activeGM.name, {
      description: activeGM.firstDefeatLine,
      duration: 10000,
    });
  }, [activeGM, flags.game_master_loss, setNarrativeFlag]);

  const handleArenaWin = useCallback(() => {
    if (!activeGM) return;
    const defeatedFlag = `${activeGM.id}_defeated`;
    const firstWin = !flags[defeatedFlag];
    if (firstWin) {
      setNarrativeFlag(defeatedFlag, true);
      setNarrativeFlag("game_master_defeated", true);
      toast.success(activeGM.name, {
        description: activeGM.firstVictoryLine,
        duration: 12000,
      });
    } else if (activeGM.repeatVictoryLine) {
      toast.message(activeGM.name, {
        description: activeGM.repeatVictoryLine,
        duration: 10000,
      });
    }
  }, [activeGM, flags, setNarrativeFlag]);

  if (!climbGateMet) {
    return <ClimbGate climbRank={climbRank} loading={climbStateQ.isLoading} />;
  }
  if (!activeGM) {
    return <ArenaGate moralityScore={moralityScore} />;
  }

  const lensLabel = activeGM.lens === "left" ? "Left Hemisphere" : "Right Hemisphere";
  const accent =
    activeGM.lens === "left"
      ? "rgba(14, 165, 233, 0.35)"
      : "rgba(236, 72, 153, 0.35)";

  return (
    <div className="relative min-h-screen bg-stone-950 text-stone-100">
      <LivingBackground
        src={assetUrl("art/rooms/room-game-masters-arena.png")}
        accent={accent}
        opacity={0.12}
        particleCount={3}
        scanlines={false}
      />

      <header className="relative z-10 flex items-center justify-between border-b border-indigo-500/30 bg-stone-950/80 px-4 py-3 backdrop-blur">
        <Link
          to="/ark"
          className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-indigo-300/80 hover:text-indigo-100"
        >
          <ChevronLeft size={14} />
          Ark
        </Link>
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-indigo-300/80">
            §6.4 · The Two Game Masters
          </p>
          <p className="mt-1 font-serif text-lg italic text-indigo-50">
            {activeGM.name}
          </p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-indigo-300/80">
          {lensLabel}
        </span>
      </header>

      <main className="relative z-10 mx-auto grid max-w-5xl gap-4 px-4 py-6 lg:grid-cols-[1fr_1fr]">
        {/* ── ACTIVE GM PANEL ── */}
        <section className="space-y-3">
          <div className="rounded-md border border-indigo-500/40 bg-stone-950/70 p-5">
            <div className="flex items-center gap-2">
              {activeGM.lens === "left" ? (
                <Eye size={14} className="text-cyan-300" />
              ) : (
                <EyeOff size={14} className="text-pink-300" />
              )}
              <p className="font-mono text-[9px] uppercase tracking-wider text-indigo-300/80">
                First contact · {activeGM.name}
              </p>
            </div>
            <p className="mt-3 font-serif text-[14px] italic leading-relaxed text-indigo-50">
              {activeGM.firstContactLine}
            </p>
            <p className="mt-3 font-mono text-[10px] text-stone-400">
              {activeGM.temperament}
            </p>
          </div>

          <div className="rounded-md border border-stone-700 bg-stone-900/40 p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-stone-400">
              Act 2 completion · the canon of the loss
            </p>
            <p className="mt-2 font-serif text-[12px] italic leading-relaxed text-stone-300">
              The Game Masters read your moves from the Matrix of Dreams. You
              will lose at chess. Make peace with that. The real contest is in
              the Arena.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded bg-amber-950/30 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-amber-200">
                game_master_loss: {flags.game_master_loss ? "✓" : "pending"}
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-emerald-950/30 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-emerald-200">
                game_master_defeated: {flags.game_master_defeated ? "✓" : "pending"}
              </span>
            </div>
          </div>
        </section>

        {/* ── ENCOUNTER ROUTES ── */}
        <section className="space-y-3">
          <div className="rounded-md border border-indigo-500/30 bg-stone-950/60 p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-indigo-300/80">
              The Board · Chess
            </p>
            <p className="mt-2 font-serif text-[12px] italic leading-relaxed text-indigo-100/90">
              Face {activeGM.name} at the Board. This is where you lose. That
              is the design. Your loss fires the canonical {`"`}game_master_loss
              {`"`} flag and advances the Act 2 completion gate.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                to="/chess"
                className="flex items-center gap-2 rounded border border-indigo-500/40 bg-indigo-950/30 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-indigo-100 hover:bg-indigo-900/40"
              >
                <Goal size={12} />
                Play chess
              </Link>
              <button
                type="button"
                onClick={handleChessLoss}
                className="rounded border border-amber-500/40 bg-amber-950/20 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-amber-200 hover:bg-amber-900/30"
                data-testid="bench-record-chess-loss"
              >
                Record loss (for story)
              </button>
            </div>
          </div>

          <div className="rounded-md border border-indigo-500/30 bg-stone-950/60 p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-indigo-300/80">
              The Arena · Collector
            </p>
            <p className="mt-2 font-serif text-[12px] italic leading-relaxed text-indigo-100/90">
              Face {activeGM.name} in the Collector{"'"}s Arena. Their seeded
              deck: <em>{activeGM.deckId ?? "game_master_neutral"}</em>. A win
              here fires <code className="text-indigo-200">
                game_master_defeated
              </code>{" "}
              and their per-GM defeat flag.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                to="/collector-arena"
                className="flex items-center gap-2 rounded border border-indigo-500/40 bg-indigo-950/30 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-indigo-100 hover:bg-indigo-900/40"
              >
                <Swords size={12} />
                Enter Arena
              </Link>
              <button
                type="button"
                onClick={handleArenaWin}
                className="rounded border border-emerald-500/40 bg-emerald-950/20 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-emerald-200 hover:bg-emerald-900/30"
                data-testid="bench-record-arena-win"
              >
                Record win (for story)
              </button>
            </div>
          </div>

          <InactiveGMCard activeId={activeGM.id} />
        </section>
      </main>
    </div>
  );
}

function InactiveGMCard({ activeId }: { activeId: GameMasterProfile["id"] }) {
  const other =
    activeId === THE_LEFT_GAME_MASTER.id
      ? THE_RIGHT_GAME_MASTER
      : THE_LEFT_GAME_MASTER;
  return (
    <div className="rounded-md border border-stone-800 bg-stone-900/30 p-4 opacity-60">
      <p className="font-mono text-[10px] uppercase tracking-wider text-stone-500">
        Dormant · {other.name}
      </p>
      <p className="mt-1 font-serif text-[11px] italic leading-relaxed text-stone-400">
        Tilt your moral scales toward the opposite lens and this one will
        greet you instead. You can meet both in this Act. The order is yours.
      </p>
    </div>
  );
}

function ArenaGate({ moralityScore }: { moralityScore: number }) {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <header className="flex items-center justify-between border-b border-stone-700 bg-stone-950/80 px-4 py-3 backdrop-blur">
        <Link
          to="/ark"
          className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-stone-400 hover:text-stone-100"
        >
          <ChevronLeft size={14} />
          Ark
        </Link>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-400">
          §6.4 · Neither Lens Recognizes You Yet
        </p>
        <span />
      </header>
      <main className="mx-auto max-w-xl p-8">
        <motion.div
          className="rounded-md border border-stone-700 bg-stone-900/50 p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Sword size={20} className="text-stone-400" />
          <p className="mt-4 font-serif text-[14px] italic leading-relaxed text-stone-200">
            The Game Masters read from your hemispheres. Right now neither
            lens recognizes you. Your moral scales sit exactly at zero
            ({moralityScore}).
          </p>
          <p className="mt-3 font-mono text-[11px] text-stone-400">
            Make a choice that tilts the scales in either direction. Return
            when one of them calls.
          </p>
          <Link
            to="/ark"
            className="mt-5 inline-flex rounded border border-stone-700 bg-stone-800 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-stone-100 hover:bg-stone-700"
          >
            Back to the Ark
          </Link>
        </motion.div>
      </main>
    </div>
  );
}

/** Rendered when the player hasn't cleared enough of the chess Climb
 *  to earn a rematch with the split Game Masters. Canon: the Climb
 *  (server-authoritative) is the teaching ground; the Arena is where
 *  the Left/Right lenses show up as rematch adversaries. Tier 1
 *  (Wagered) is the minimum — once you've paid ELO and gotten it
 *  back, the split is ready to read you. */
function ClimbGate({
  climbRank,
  loading,
}: {
  climbRank: number;
  loading: boolean;
}) {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <header className="flex items-center justify-between border-b border-stone-700 bg-stone-950/80 px-4 py-3 backdrop-blur">
        <Link
          to="/ark"
          className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-stone-400 hover:text-stone-100"
        >
          <ChevronLeft size={14} />
          Ark
        </Link>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-400">
          §6.4 · The Climb Comes First
        </p>
        <span />
      </header>
      <main className="mx-auto max-w-xl p-8">
        <motion.div
          className="rounded-md border border-stone-700 bg-stone-900/50 p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Swords size={20} className="text-stone-400" />
          <p className="mt-4 font-serif text-[14px] italic leading-relaxed text-stone-200">
            The Left and Right Game Masters don't appear for players who
            haven't yet taken the Wagered tier of the Climb. The Arena is
            a rematch. Earn the first match first.
          </p>
          <p className="mt-3 font-mono text-[11px] text-stone-400">
            {loading
              ? "Reading the board…"
              : `Current Climb rank: ${climbRank < 0 ? "—" : climbRank}. Required: ${CLIMB_RANK_REQUIRED_FOR_ARENA}.`}
          </p>
          <div className="mt-5 flex gap-2">
            <Link
              to="/chess/climb"
              className="inline-flex rounded border border-indigo-500/40 bg-indigo-950/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-indigo-100 hover:bg-indigo-900/60"
            >
              Enter the Climb
            </Link>
            <Link
              to="/ark"
              className="inline-flex rounded border border-stone-700 bg-stone-800 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-stone-100 hover:bg-stone-700"
            >
              Back to the Ark
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
