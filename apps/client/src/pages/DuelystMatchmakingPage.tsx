/* ═══════════════════════════════════════════════════════
   DUELYST RANKED PVP — Matchmaking + minimal in-match UI

   Wires the previously-orphan duelystWs (apps/server/duelystWs.ts)
   into a player surface. Five phases:

     1. lobby   — pick a faction, see the starter deck preview, queue up
     2. queue   — "looking for opponent…" with position + leave button
     3. found   — splash card "MATCH FOUND vs <opponent>"
     4. playing — minimal authoritative-state view + End Turn / Surrender
     5. ended   — win/loss/draw + ELO change + back-to-lobby

   The in-match view is intentionally minimal for v1: it surfaces the
   server's GAME_STATE payload as a JSON-tree side panel plus the
   high-signal surface (whose turn, both players' HP/mana, hand sizes,
   board occupancy) so two players can run a live match end-to-end and
   confirm the wire works. A full board-renderer that mirrors the
   single-player DuelystGameUI is a follow-up — out of scope for the
   "build everything reserved" pass that closed the audit gap.

   Mirrors the architecture of PvpArenaPage (apps/client/src/pages/
   PvpArenaPage.tsx) with the simpler matchmaking shape duelystWs uses.
   ═══════════════════════════════════════════════════════ */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Loader2, Swords, Trophy, Skull, Handshake, X, AlertCircle,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  type Faction,
  FACTION_NAMES,
  FACTION_DESCRIPTIONS,
  FACTION_COLORS,
  FACTION_EMBLEMS,
} from "@/game/duelyst/types";
import { STARTER_DECK_MAP } from "@shared/tcg-core/decks/starterDecks";
import { useDuelystPvpSocket } from "@/game/duelyst/useDuelystPvpSocket";

const SELECTABLE_FACTIONS: Faction[] = [
  "architect", "dreamer", "insurgency", "new_babylon", "antiquarian", "thought_virus",
];

export default function DuelystMatchmakingPage() {
  const { user } = useAuth();
  const [faction, setFaction] = useState<Faction | null>(null);
  const sock = useDuelystPvpSocket({
    user: user ? { id: user.id, name: user.name ?? `Player ${user.id}` } : null,
  });

  /* ─── Lobby ─── */
  if (!user) {
    return <SignInGate />;
  }

  // Routing the phase to a sub-view keeps each section focused.
  if (sock.phase === "queue") {
    return <QueuePhase sock={sock} faction={faction} onLeave={() => sock.leaveQueue()} />;
  }

  if (sock.phase === "match_found" || sock.phase === "playing") {
    return <PlayingPhase sock={sock} faction={faction} />;
  }

  if (sock.phase === "ended") {
    return <EndedPhase sock={sock} onBack={() => sock.reset()} />;
  }

  return <LobbyPhase
    faction={faction}
    setFaction={setFaction}
    onJoin={(f) => {
      const deck = STARTER_DECK_MAP[f];
      if (!deck) return;
      sock.joinQueue({
        faction: f,
        deckCardIds: deck.cardDefIds,
        heatModifiers: [],
      });
    }}
    errors={sock.errors}
  />;
}

/* ─── Lobby phase ─── */

function LobbyPhase({
  faction,
  setFaction,
  onJoin,
  errors,
}: {
  faction: Faction | null;
  setFaction: (f: Faction) => void;
  onJoin: (f: Faction) => void;
  errors: readonly string[];
}) {
  const deck = faction ? STARTER_DECK_MAP[faction] : null;
  return (
    <div className="min-h-screen grid-bg p-4 sm:p-6 max-w-3xl mx-auto">
      <Link href="/duelyst" className="flex items-center gap-1 text-muted-foreground hover:text-foreground font-mono text-xs mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Duelyst
      </Link>

      <h1 className="font-display text-2xl tracking-[0.2em] mb-2">RANKED PVP</h1>
      <p className="font-mono text-xs text-muted-foreground mb-8">
        Pick a faction. Queue. Play a real opponent in real time.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {SELECTABLE_FACTIONS.map((f) => {
          const color = FACTION_COLORS[f];
          const isPicked = faction === f;
          return (
            <button
              key={f}
              onClick={() => setFaction(f)}
              className={`p-3 rounded-lg border text-left transition-all ${
                isPicked
                  ? "void-bg-system void-border-system"
                  : "bg-card/30 border-border/20 hover:border-border/40"
              }`}
              style={isPicked ? { borderColor: color } : undefined}
            >
              <div className="flex items-center gap-2 mb-2">
                {FACTION_EMBLEMS[f] && (
                  <img src={FACTION_EMBLEMS[f]} alt="" className="w-6 h-6" />
                )}
                <span className="font-display text-sm font-bold tracking-wide" style={{ color }}>
                  {FACTION_NAMES[f]}
                </span>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground line-clamp-3">
                {FACTION_DESCRIPTIONS[f]}
              </p>
            </button>
          );
        })}
      </div>

      {deck && (
        <div className="p-4 rounded-lg bg-card/40 border border-border/20 mb-6">
          <p className="font-mono text-[10px] text-muted-foreground tracking-wider mb-1">
            STARTER DECK
          </p>
          <h3 className="font-display text-base font-bold mb-1">{deck.name}</h3>
          <p className="font-mono text-xs text-muted-foreground italic">"{deck.description}"</p>
          <p className="font-mono text-[10px] text-muted-foreground mt-2">
            {deck.cardDefIds.length} cards
          </p>
        </div>
      )}

      {errors.length > 0 && (
        <div className="p-3 rounded-md border border-rose-500/40 bg-rose-950/20 mb-4 flex items-start gap-2">
          <AlertCircle size={14} className="text-rose-400 mt-0.5 shrink-0" />
          <ul className="font-mono text-[11px] text-rose-200 space-y-1">
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      <button
        disabled={!faction}
        onClick={() => faction && onJoin(faction)}
        className="w-full py-3 rounded-lg bg-primary/15 border border-primary/40 text-primary font-display text-sm font-bold tracking-[0.2em] hover:bg-primary/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Swords size={16} /> JOIN QUEUE
      </button>
    </div>
  );
}

/* ─── Queue phase ─── */

function QueuePhase({
  sock,
  faction,
  onLeave,
}: {
  sock: ReturnType<typeof useDuelystPvpSocket>;
  faction: Faction | null;
  onLeave: () => void;
}) {
  return (
    <div className="min-h-screen grid-bg p-4 sm:p-6 max-w-md mx-auto flex flex-col items-center justify-center">
      <Loader2 size={32} className="animate-spin text-primary mb-6" />
      <h1 className="font-display text-xl tracking-[0.2em] mb-2">SEARCHING…</h1>
      {faction && (
        <p className="font-mono text-xs text-muted-foreground mb-4">
          Queued as <span style={{ color: FACTION_COLORS[faction] }}>{FACTION_NAMES[faction]}</span>
        </p>
      )}
      <div className="font-mono text-[11px] text-muted-foreground space-y-1 mb-8 text-center">
        {sock.queuePosition != null && <p>Position: #{sock.queuePosition}</p>}
        {sock.playersInQueue != null && <p>{sock.playersInQueue} players in queue</p>}
      </div>
      <button
        onClick={onLeave}
        className="px-6 py-2 rounded-md bg-card/40 border border-border/30 text-muted-foreground hover:text-foreground hover:border-border/60 font-mono text-xs tracking-wider"
      >
        <X size={12} className="inline mr-1" /> LEAVE QUEUE
      </button>
    </div>
  );
}

/* ─── Playing phase (minimal authoritative-state view) ─── */

interface BoardEntityShape {
  defId?: string;
  power?: number;
  health?: number;
  side?: 0 | 1;
  row?: number;
  col?: number;
  [key: string]: unknown;
}

interface PlayerStateShape {
  hp?: number;
  mana?: number;
  manaCap?: number;
  hand?: readonly { defId?: string }[] | readonly unknown[];
  deck?: readonly unknown[];
  [key: string]: unknown;
}

interface MinimalGameState {
  phase?: string;
  turnNumber?: number;
  currentPlayer?: 0 | 1;
  board?: Record<string, BoardEntityShape>;
  players?: readonly [PlayerStateShape, PlayerStateShape];
  [key: string]: unknown;
}

function PlayingPhase({
  sock,
  faction,
}: {
  sock: ReturnType<typeof useDuelystPvpSocket>;
  faction: Faction | null;
}) {
  const gs = (sock.gameState as MinimalGameState | null) ?? null;
  const mySide = sock.mySide ?? 0;
  const oppSide = mySide === 0 ? 1 : 0;
  const me = gs?.players?.[mySide] ?? null;
  const opp = gs?.players?.[oppSide] ?? null;

  const handleEndTurn = () => {
    // Translate-client-action accepts a legacy shape; the engine maps
    // {action:"end_turn"} to its End Turn action via translateClientAction.
    sock.sendAction({ type: "end_turn" });
  };
  const handleSurrender = () => {
    if (window.confirm("Surrender this match?")) sock.surrender();
  };

  return (
    <div className="min-h-screen grid-bg p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Match header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/30">
        <div>
          <p className="font-mono text-[10px] text-muted-foreground tracking-wider">YOU</p>
          <p className="font-display text-sm font-bold" style={{ color: faction ? FACTION_COLORS[faction] : undefined }}>
            {FACTION_NAMES[(faction ?? "neutral") as Faction]}
          </p>
        </div>
        <div className="text-center">
          {sock.phase === "match_found" && (
            <p className="font-display text-sm tracking-[0.3em] text-primary animate-pulse">MATCH FOUND</p>
          )}
          {gs?.phase === "playing" && (
            <p className="font-mono text-[11px] text-muted-foreground tracking-wider">
              Turn {gs?.turnNumber ?? 1} · {sock.isYourTurn ? "YOUR TURN" : "OPPONENT'S TURN"}
            </p>
          )}
          {sock.opponentDisconnected && (
            <p className="font-mono text-[11px] text-amber-400">opponent disconnected</p>
          )}
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] text-muted-foreground tracking-wider">OPPONENT</p>
          <p className="font-display text-sm font-bold" style={{ color: sock.opponentFaction ? FACTION_COLORS[sock.opponentFaction as Faction] : undefined }}>
            {sock.opponentName ?? "—"}
          </p>
        </div>
      </div>

      {/* Both players' status */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <PlayerStatusCard label="YOU" player={me} />
        <PlayerStatusCard label="OPPONENT" player={opp} />
      </div>

      {/* Board summary — counts by side. Full visual board is a follow-up. */}
      {gs?.board && <BoardSummary board={gs.board} mySide={mySide} />}

      {/* Action bar */}
      {sock.phase === "playing" && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleEndTurn}
            disabled={!sock.isYourTurn || !sock.connected}
            className="flex-1 py-3 rounded-lg bg-primary/15 border border-primary/40 text-primary font-display text-sm font-bold tracking-[0.2em] hover:bg-primary/25 transition-all disabled:opacity-40"
          >
            END TURN
          </button>
          <button
            onClick={handleSurrender}
            className="px-6 py-3 rounded-lg bg-rose-950/30 border border-rose-700/40 text-rose-300 font-mono text-xs tracking-wider hover:bg-rose-950/50"
          >
            SURRENDER
          </button>
        </div>
      )}

      {sock.errors.length > 0 && (
        <div className="mt-4 p-3 rounded-md border border-rose-500/40 bg-rose-950/20">
          <ul className="font-mono text-[11px] text-rose-200 space-y-1">
            {sock.errors.slice(-3).map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      {/* Raw state preview — collapsed by default. Useful while the
       *  full board renderer is still a follow-up. */}
      {gs && (
        <details className="mt-6 text-muted-foreground">
          <summary className="font-mono text-[10px] tracking-wider cursor-pointer">RAW STATE</summary>
          <pre className="mt-2 max-h-72 overflow-auto rounded-md bg-card/40 border border-border/20 p-3 font-mono text-[10px]">
            {JSON.stringify(gs, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

function PlayerStatusCard({ label, player }: { label: string; player: PlayerStateShape | null }) {
  if (!player) {
    return (
      <div className="p-3 rounded-lg bg-card/30 border border-border/20">
        <p className="font-mono text-[10px] text-muted-foreground tracking-wider">{label}</p>
        <p className="font-mono text-xs text-muted-foreground/60 mt-2">awaiting state…</p>
      </div>
    );
  }
  return (
    <div className="p-3 rounded-lg bg-card/40 border border-border/30 space-y-1">
      <p className="font-mono text-[10px] text-muted-foreground tracking-wider">{label}</p>
      <p className="font-display text-lg font-bold">
        ❤ {player.hp ?? 0}
      </p>
      <p className="font-mono text-[11px] text-muted-foreground">
        Mana {player.mana ?? 0}/{player.manaCap ?? 0} · Hand {player.hand?.length ?? 0} · Deck {player.deck?.length ?? 0}
      </p>
    </div>
  );
}

function BoardSummary({ board, mySide }: { board: Record<string, BoardEntityShape>; mySide: 0 | 1 }) {
  const entries = Object.values(board);
  const mine = entries.filter((e) => e.side === mySide);
  const theirs = entries.filter((e) => e.side === (mySide === 0 ? 1 : 0));
  return (
    <div className="grid grid-cols-2 gap-3">
      <BoardSide label="YOUR BOARD" units={mine} />
      <BoardSide label="OPPONENT BOARD" units={theirs} />
    </div>
  );
}

function BoardSide({ label, units }: { label: string; units: readonly BoardEntityShape[] }) {
  return (
    <div className="p-3 rounded-lg bg-card/30 border border-border/20">
      <p className="font-mono text-[10px] text-muted-foreground tracking-wider mb-2">
        {label} · {units.length} unit{units.length === 1 ? "" : "s"}
      </p>
      <ul className="space-y-1 max-h-48 overflow-auto">
        {units.map((u, i) => (
          <li key={i} className="font-mono text-[10px] text-foreground/80">
            {u.defId ?? "?"} · {u.power ?? 0}/{u.health ?? 0}
            {typeof u.row === "number" && typeof u.col === "number" && (
              <span className="text-muted-foreground"> @ ({u.row},{u.col})</span>
            )}
          </li>
        ))}
        {units.length === 0 && <li className="font-mono text-[10px] text-muted-foreground/40">empty</li>}
      </ul>
    </div>
  );
}

/* ─── Ended phase ─── */

function EndedPhase({
  sock,
  onBack,
}: {
  sock: ReturnType<typeof useDuelystPvpSocket>;
  onBack: () => void;
}) {
  const r = sock.matchResult?.result ?? "draw";
  const Icon = r === "win" ? Trophy : r === "loss" ? Skull : Handshake;
  const tone = r === "win" ? "void-text-energy" : r === "loss" ? "void-text-error" : "text-muted-foreground";
  const label = r === "win" ? "VICTORY" : r === "loss" ? "DEFEAT" : "DRAW";

  return (
    <div className="min-h-screen grid-bg p-4 sm:p-6 max-w-md mx-auto flex flex-col items-center justify-center">
      <AnimatePresence>
        <motion.div
          key={r}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <Icon size={64} className={`${tone} mb-4`} />
          <h1 className={`font-display text-3xl tracking-[0.3em] ${tone} mb-2`}>{label}</h1>
          {sock.matchResult && (
            <p className="font-mono text-sm text-muted-foreground">
              ELO change: {sock.matchResult.eloChange >= 0 ? "+" : ""}{sock.matchResult.eloChange}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      <button
        onClick={onBack}
        className="mt-12 px-8 py-3 rounded-lg bg-primary/15 border border-primary/40 text-primary font-display text-sm font-bold tracking-[0.2em] hover:bg-primary/25"
      >
        BACK TO LOBBY
      </button>
    </div>
  );
}

/* ─── Sign-in gate ─── */

function SignInGate() {
  return (
    <div className="min-h-screen grid-bg p-6 max-w-md mx-auto flex flex-col items-center justify-center text-center">
      <h1 className="font-display text-xl tracking-[0.2em] mb-4">SIGN IN REQUIRED</h1>
      <p className="font-mono text-xs text-muted-foreground mb-6">
        Ranked PvP needs an authenticated account so matches can be attributed and ELO tracked.
      </p>
      <Link href="/duelyst">
        <button className="px-8 py-2 rounded-lg bg-card/40 border border-border/30 text-muted-foreground hover:text-foreground font-mono text-xs tracking-wider">
          Back to Duelyst
        </button>
      </Link>
    </div>
  );
}
