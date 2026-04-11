/* ═══════════════════════════════════════════════════════
   CASINO LEADERBOARD — Biggest jackpots + progressive pool.
   ═══════════════════════════════════════════════════════ */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Trophy, Skull } from "lucide-react";
import { trpc } from "@/lib/trpc";

const GAME_LABELS: Record<string, string> = {
  void_slots: "Void Slots",
  entropy_dice: "Entropy Dice",
  nebula_poker: "Nebula Poker",
  quantum_roulette: "Quantum Roulette",
  pazaak_21: "Pazaak 21",
  high_low: "High/Low",
  scratch_cards: "Void Scratch Cards",
  void_blackjack_tournament: "Void Blackjack Tournament",
  liars_dice: "Liar's Dice",
  faction_war_betting: "Faction War Betting",
  dream_roulette: "Dream Roulette",
  card_battlers_gauntlet: "Card Battler's Gauntlet",
  void_bingo: "Void Bingo",
  void_cases: "Void Cases",
  dischordian_mahjong: "Dischordian Mahjong",
};

export default function CasinoLeaderboardPage() {
  const leaderboardQuery = trpc.casino.jackpotLeaderboard.useQuery({ limit: 25 });
  const poolQuery = trpc.casino.getJackpotPool.useQuery(undefined, { refetchInterval: 10_000 });
  const claimMut = trpc.casino.claimJackpot.useMutation({
    onSuccess: () => poolQuery.refetch(),
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/casino">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40"
            >
              <ChevronLeft className="w-5 h-5 text-amber-400" />
            </motion.button>
          </Link>
          <div>
            <h1 className="font-display text-2xl text-amber-400 tracking-[0.2em]">CASINO LEADERBOARD</h1>
            <p className="text-xs text-amber-400/40 font-mono tracking-widest uppercase">
              The Hall of Ridiculous Luck
            </p>
          </div>
        </div>

        {/* Progressive jackpot pool */}
        <div className="bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-amber-950/40 border border-amber-500/30 rounded-xl p-6 mb-8 text-center">
          <p className="font-mono text-xs text-amber-400/60 uppercase tracking-widest mb-2">
            Progressive Jackpot Pool
          </p>
          <motion.p
            className="font-display text-5xl font-bold text-amber-300"
            key={poolQuery.data?.balance}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            {(poolQuery.data?.balance ?? 0).toLocaleString()}
            <span className="text-2xl text-amber-400/70 ml-2">DREAM</span>
          </motion.p>
          {poolQuery.data?.lastWinnerId && (
            <p className="text-xs text-amber-400/50 font-mono mt-2">
              Last paid out {poolQuery.data.lastWinAt ? new Date(poolQuery.data.lastWinAt).toLocaleDateString() : "—"}
            </p>
          )}
          <p className="text-xs text-gray-500 font-mono mt-2">
            Total paid out lifetime: {(poolQuery.data?.totalPaidOut ?? 0).toLocaleString()} Dream
          </p>
          <button
            onClick={() => claimMut.mutate()}
            disabled={claimMut.isPending}
            className="mt-4 px-6 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-200 font-mono text-sm hover:bg-amber-500/30 disabled:opacity-50"
          >
            {claimMut.isPending ? "Claiming..." : "Claim (if you just hit a jackpot)"}
          </button>
          {claimMut.isError && (
            <p className="mt-2 text-xs text-red-400/80 font-mono">{claimMut.error.message}</p>
          )}
          {claimMut.isSuccess && (
            <p className="mt-2 text-xs text-green-400/80 font-mono">
              Paid out {claimMut.data?.payout} Dream! Your balance has been credited.
            </p>
          )}
        </div>

        {/* Top jackpots */}
        <h2 className="font-display text-lg text-amber-300 mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Biggest Jackpots
        </h2>
        {leaderboardQuery.isLoading && (
          <p className="font-mono text-sm text-white/40">Loading the hall of chaos...</p>
        )}
        {leaderboardQuery.data && leaderboardQuery.data.length === 0 && (
          <div className="bg-gray-900/40 border border-gray-700/20 rounded-xl p-6 text-center">
            <Skull className="w-10 h-10 text-white/20 mx-auto mb-2" />
            <p className="font-mono text-sm text-white/40">
              No jackpots have been hit yet. Will you be the first?
            </p>
          </div>
        )}
        {leaderboardQuery.data && leaderboardQuery.data.length > 0 && (
          <div className="space-y-2">
            {leaderboardQuery.data.map((row, i) => (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-4 p-3 rounded-lg border font-mono text-sm ${
                  i === 0
                    ? "bg-amber-500/10 border-amber-500/40"
                    : "bg-gray-900/40 border-gray-700/20"
                }`}
              >
                <span className={`w-8 text-center ${i === 0 ? "text-amber-300" : "text-white/30"}`}>
                  #{i + 1}
                </span>
                <span className="flex-1 text-white/70">
                  {GAME_LABELS[row.game] ?? row.game}
                </span>
                <span className={i === 0 ? "text-amber-300" : "text-green-400/70"}>
                  {row.payout.toLocaleString()}D
                </span>
                <span className="text-[10px] text-white/20">
                  {new Date(row.playedAt).toLocaleDateString()}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
