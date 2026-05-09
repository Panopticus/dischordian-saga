/* ═══════════════════════════════════════════════════════
   PAZAAK TOURNAMENT PAGE
   audit/16 PR 3 — engagement loop

   Skill-based daily tournament. 4-player single-elim
   bracket: player vs Engineer (semi 1), Grifter vs Smuggler
   (semi 2), winners advance to the final. Entry 200D.
   Prizes: 1st = 800D (4x entry), 2nd = 200D (refund),
   3rd-4th = nothing.

   Player picks their stand value (10-21); the AI opponents
   stand at 17/18/19. The tournament is intentionally lossy
   on average — see the audit invariant test in
   apps/shared/casinoPazaakTournament.test.ts.
   ═══════════════════════════════════════════════════════ */

import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Trophy, Swords, Coins } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { PAZAAK_AI_OPPONENTS } from "@shared/casinoPazaakTournament";
import { toast } from "sonner";

interface BracketRoundView {
  a: { name: string; stand: number; total: number; bust: boolean };
  b: { name: string; stand: number; total: number; bust: boolean };
  winner: "a" | "b";
}

interface BracketResultView {
  semi1: BracketRoundView;
  semi2: BracketRoundView;
  final: BracketRoundView;
  playerPlace: 1 | 2 | 3;
  prize: number;
  seed: string;
}

function RoundCard({ title, round }: { title: string; round: BracketRoundView }) {
  const aWon = round.winner === "a";
  return (
    <div className="rounded-lg border void-border bg-black/40 p-4">
      <p className="font-display text-[10px] tracking-widest void-text-muted uppercase mb-2">
        {title}
      </p>
      <div className="space-y-2">
        <div className={`flex items-center justify-between text-sm font-mono ${aWon ? "void-text-accent" : "text-foreground/50"}`}>
          <span>{round.a.name} (stand {round.a.stand})</span>
          <span>{round.a.bust ? "BUST" : round.a.total}</span>
        </div>
        <div className={`flex items-center justify-between text-sm font-mono ${!aWon ? "void-text-accent" : "text-foreground/50"}`}>
          <span>{round.b.name} (stand {round.b.stand})</span>
          <span>{round.b.bust ? "BUST" : round.b.total}</span>
        </div>
      </div>
    </div>
  );
}

export default function CasinoPazaakTournamentPage() {
  const [, navigate] = useLocation();
  const [stand, setStand] = useState(18);
  const [resultView, setResultView] = useState<BracketResultView | null>(null);

  const statusQuery = trpc.casino.getPazaakTournamentStatus.useQuery();
  const enterMut = trpc.casino.enterPazaakTournament.useMutation({
    onSuccess: (data) => {
      setResultView(data as unknown as BracketResultView);
      const place = data.playerPlace;
      const placeLabel = place === 1 ? "Champion" : place === 2 ? "Runner-up" : "Eliminated";
      toast.success(`${placeLabel} — ${data.prize}D awarded`);
      statusQuery.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const enteredToday =
    statusQuery.data?.enteredToday === true || enterMut.isSuccess;
  const cachedResult =
    resultView ??
    (statusQuery.data?.lastResult as BracketResultView | null | undefined) ??
    null;
  const showBracket = enteredToday && cachedResult;

  return (
    <div className="min-h-screen bg-black text-foreground">
      <div className="px-4 sm:px-6 pt-6 pb-4 max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/casino")}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ChevronLeft size={14} /> CASINO
        </button>
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={20} className="void-text-accent" />
          <h1 className="font-display text-2xl void-text-accent uppercase tracking-widest">
            Pazaak Tournament
          </h1>
        </div>
        <p className="font-mono text-xs void-text-muted mb-6">
          Daily 4-player bracket. Pick your stand, face three legends, take the chair.
        </p>

        {/* Prize strip */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="rounded-md border void-border bg-amber-950/20 p-3 text-center">
            <p className="font-display text-[9px] uppercase tracking-widest void-text-accent">Entry</p>
            <p className="font-mono text-lg void-text-accent mt-1">{statusQuery.data?.entryFee ?? 200}D</p>
          </div>
          <div className="rounded-md border void-border bg-amber-950/30 p-3 text-center">
            <p className="font-display text-[9px] uppercase tracking-widest void-text-accent">1st Prize</p>
            <p className="font-mono text-lg void-text-accent mt-1">{statusQuery.data?.firstPrize ?? 800}D</p>
          </div>
          <div className="rounded-md border void-border bg-black/30 p-3 text-center">
            <p className="font-display text-[9px] uppercase tracking-widest void-text-muted">2nd Prize</p>
            <p className="font-mono text-lg void-text-muted mt-1">{statusQuery.data?.secondPrize ?? 200}D</p>
          </div>
        </div>

        {/* AI opponent strip */}
        <div className="mb-6">
          <p className="font-display text-[10px] uppercase tracking-widest void-text-muted mb-2">
            <Swords size={10} className="inline mr-1" /> Field
          </p>
          <div className="space-y-2">
            {PAZAAK_AI_OPPONENTS.map((ai) => (
              <div key={ai.id} className="rounded-md border void-border bg-black/30 p-3 flex items-center justify-between">
                <div>
                  <p className="font-display text-sm void-text-accent">{ai.name}</p>
                  <p className="font-mono text-[10px] text-foreground/60">{ai.archetype}</p>
                </div>
                <p className="font-mono text-xs void-text-muted">stand {ai.stand}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Entry form */}
        {!showBracket && (
          <div className="rounded-lg border void-border bg-black/40 p-5 mb-6">
            <p className="font-mono text-sm mb-3">Pick your stand value (10-21):</p>
            <div className="flex items-center gap-3 mb-4">
              <input
                type="range"
                min={10}
                max={21}
                value={stand}
                onChange={(e) => setStand(Number(e.target.value))}
                className="flex-1"
              />
              <span className="font-mono text-2xl void-text-accent w-12 text-right">{stand}</span>
            </div>
            <button
              onClick={() => enterMut.mutate({ stand })}
              disabled={enterMut.isPending || enteredToday}
              className="w-full px-4 py-3 rounded-md border void-border void-text-accent hover:bg-amber-950/30 transition-colors text-sm font-mono uppercase tracking-wider disabled:opacity-50"
            >
              <Coins size={14} className="inline mr-2" />
              {enterMut.isPending
                ? "Running bracket..."
                : enteredToday
                  ? "Already entered today"
                  : `Enter Tournament — ${statusQuery.data?.entryFee ?? 200}D`}
            </button>
          </div>
        )}

        {/* Bracket result */}
        <AnimatePresence>
          {showBracket && cachedResult && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="text-center mb-2">
                <p className="font-display text-xs uppercase tracking-widest void-text-muted">Today&apos;s Result</p>
                <p className="font-display text-3xl void-text-accent mt-1">
                  {cachedResult.playerPlace === 1
                    ? "Champion"
                    : cachedResult.playerPlace === 2
                      ? "Runner-Up"
                      : "Eliminated in Semis"}
                </p>
                <p className="font-mono text-sm void-text-muted mt-1">
                  Prize: {cachedResult.prize}D
                </p>
              </div>
              <RoundCard title="Semi 1 — You vs Engineer" round={cachedResult.semi1} />
              <RoundCard title="Semi 2 — Grifter vs Smuggler" round={cachedResult.semi2} />
              <RoundCard title="Final" round={cachedResult.final} />
              <p className="font-mono text-[10px] text-foreground/40 text-center mt-4">
                Bracket resets at UTC midnight.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
