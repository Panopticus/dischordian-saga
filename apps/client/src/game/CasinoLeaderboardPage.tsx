/* ═══════════════════════════════════════════════════════
   CASINO LEADERBOARD — Biggest jackpots + progressive pool
   + the player's cosmetic inventory with equip controls.
   ═══════════════════════════════════════════════════════ */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Trophy, Skull, Crown, Circle, Layers, Sparkles, BookOpen, Ghost } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { casinoSeasonKey } from "@shared/casinoGames";
import { toast } from "sonner";

/** Slot → icon mapping for the cosmetic inventory panel. */
const SLOT_ICONS: Record<string, React.ReactNode> = {
  title: <Crown className="w-3 h-3" />,
  chip: <Circle className="w-3 h-3" />,
  card_back: <Layers className="w-3 h-3" />,
  table_felt: <Sparkles className="w-3 h-3" />,
  companion: <Ghost className="w-3 h-3" />,
  loredex: <BookOpen className="w-3 h-3" />,
};

/** Rarity tier → text colour. */
const TIER_COLORS: Record<string, string> = {
  common: "text-white/60",
  rare: "void-text-energy",
  epic: "void-text-system",
  legendary: "void-text-accent",
  mythic: "void-text-error",
};

function CosmeticsInventory() {
  const utils = trpc.useUtils();
  const rewardsQuery = trpc.casino.getMyCasinoRewards.useQuery(undefined, { retry: false });
  const equip = trpc.casino.equipCasinoCosmetic.useMutation({
    onSuccess: (data) => {
      utils.casino.getMyCasinoRewards.invalidate();
      toast.success(`Equipped: ${data.rewardId.split(":")[1]?.replace(/_/g, " ")}`);
    },
    onError: (err) => toast.error(err.message),
  });
  const unequip = trpc.casino.unequipCasinoCosmetic.useMutation({
    onSuccess: () => {
      utils.casino.getMyCasinoRewards.invalidate();
      toast.success("Unequipped");
    },
    onError: (err) => toast.error(err.message),
  });

  const rewards = rewardsQuery.data ?? [];
  if (rewards.length === 0) {
    return (
      <div className="void-bg-canvas border void-border rounded-xl p-6 text-center mb-8">
        <Sparkles className="w-8 h-8 text-white/20 mx-auto mb-2" />
        <p className="font-mono text-xs text-white/40">
          You haven't earned any casino cosmetics yet. Chase achievements to unlock titles,
          chips, card backs, and more.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-950/30 to-red-950/20 border void-border rounded-xl p-5 mb-8">
      <h2 className="font-display text-lg void-text-accent mb-3 flex items-center gap-2">
        <Sparkles className="w-5 h-5 void-text-accent" />
        My Casino Cosmetics
        <span className="ml-auto text-[10px] font-mono void-text-accent uppercase tracking-widest">
          {rewards.length} earned
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {rewards.map((r) => {
          const slot = r.slot ?? "cosmetic";
          const icon = SLOT_ICONS[slot] ?? <Sparkles className="w-3 h-3" />;
          const color = TIER_COLORS[r.tier] ?? TIER_COLORS.common;
          return (
            <div
              key={r.id}
              className={`rounded-lg border p-3 flex items-start gap-3 font-mono text-xs ${
                r.equipped
                  ? "void-bg-sunk void-border"
                  : "void-bg-canvas void-border"
              }`}
            >
              <span className={`mt-0.5 ${color}`}>{icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-display text-sm ${color} truncate`}>{r.label}</span>
                  <span className="text-[9px] uppercase tracking-widest text-white/30 shrink-0">
                    {slot.replace(/_/g, " ")}
                  </span>
                </div>
                {r.description && (
                  <p className="text-[11px] text-white/50 mt-1 leading-relaxed">{r.description}</p>
                )}
              </div>
              <button
                onClick={() => {
                  if (r.equipped) {
                    unequip.mutate({ slot: slot as "title" | "chip" | "card_back" | "table_felt" | "companion" | "loredex" });
                  } else {
                    equip.mutate({ rewardId: r.id });
                  }
                }}
                disabled={equip.isPending || unequip.isPending}
                className={`px-3 py-1 rounded-lg border font-mono text-[10px] shrink-0 ${
                  r.equipped
                    ? "void-bg-sunk void-border void-text-accent void-bg-sunk"
                    : "bg-white/[0.02] border-white/20 text-white/60 void-border void-text-accent"
                }`}
              >
                {r.equipped ? "Unequip" : "Equip"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
  const utils = trpc.useUtils();
  const leaderboardQuery = trpc.casino.jackpotLeaderboard.useQuery({ limit: 25 });
  const achievementBoardQuery = trpc.casino.achievementLeaderboard.useQuery({ limit: 10 });
  const firstClaimsQuery = trpc.casino.achievementFirstClaims.useQuery();
  // audit/16 PR 3 — Pazaak tournament season leaderboard (current season).
  const tournamentBoardQuery = trpc.casino.pazaakTournamentLeaderboard.useQuery({ limit: 10 });
  const currentSeason = casinoSeasonKey();
  const poolQuery = trpc.casino.getJackpotPool.useQuery(undefined, { refetchInterval: 60_000 });
  const stateQuery = trpc.casino.getState.useQuery(undefined, { retry: false });
  const claimMut = trpc.casino.claimJackpot.useMutation({
    onSuccess: () => poolQuery.refetch(),
  });
  const jackpotOptOutMut = trpc.casino.setJackpotBroadcastOptOut.useMutation({
    onSuccess: () => {
      utils.casino.getState.invalidate();
      toast.success("Updated notification preference");
    },
  });
  const milestoneOptOutMut = trpc.casino.setMilestoneBroadcastOptOut.useMutation({
    onSuccess: () => {
      utils.casino.getState.invalidate();
      toast.success("Updated notification preference");
    },
  });
  const jackpotOptedOut = Boolean(stateQuery.data?.jackpotBroadcastOptOut);
  const milestoneOptedOut = Boolean(stateQuery.data?.milestoneBroadcastOptOut);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/casino">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg void-bg-sunk border void-border void-border"
            >
              <ChevronLeft className="w-5 h-5 void-text-accent" />
            </motion.button>
          </Link>
          <div>
            <h1 className="font-display text-2xl void-text-accent tracking-[0.2em]">CASINO LEADERBOARD</h1>
            <p className="text-xs void-text-accent font-mono tracking-widest uppercase">
              The Hall of Ridiculous Luck
            </p>
          </div>
        </div>

        {/* Progressive jackpot pool */}
        <div className="bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-amber-950/40 border void-border rounded-xl p-6 mb-8 text-center">
          <p className="font-mono text-xs void-text-accent uppercase tracking-widest mb-2">
            Progressive Jackpot Pool
          </p>
          <p className="font-display text-5xl font-bold void-text-accent">
            {(poolQuery.data?.balance ?? 0).toLocaleString()}
            <span className="text-2xl void-text-accent ml-2">DREAM</span>
          </p>
          {poolQuery.data?.lastWinnerId && (
            <p className="text-xs void-text-accent font-mono mt-2">
              Last paid out {poolQuery.data.lastWinAt ? new Date(poolQuery.data.lastWinAt).toLocaleDateString() : "—"}
            </p>
          )}
          <p className="text-xs void-text font-mono mt-2">
            Total paid out lifetime: {(poolQuery.data?.totalPaidOut ?? 0).toLocaleString()} Dream
          </p>
          <button
            onClick={() => claimMut.mutate()}
            disabled={claimMut.isPending}
            className="mt-4 px-6 py-2 rounded-lg void-bg-sunk border void-border void-text-accent font-mono text-sm void-bg-sunk disabled:opacity-50"
          >
            {claimMut.isPending ? "Claiming..." : "Claim (if you just hit a jackpot)"}
          </button>
          {claimMut.isError && (
            <p className="mt-2 text-xs void-text-error font-mono">{claimMut.error.message}</p>
          )}
          {claimMut.isSuccess && (
            <p className="mt-2 text-xs void-text-energy font-mono">
              Paid out {claimMut.data?.payout} Dream! Your balance has been credited.
            </p>
          )}
          <div className="mt-4 pt-4 border-t void-border space-y-2">
            <p className="text-[10px] font-mono void-text-accent uppercase tracking-widest">
              Notification preferences
            </p>
            <label className="flex items-center gap-2 text-[10px] font-mono void-text-accent cursor-pointer">
              <input
                type="checkbox"
                checked={jackpotOptedOut}
                onChange={(e) => jackpotOptOutMut.mutate({ optOut: e.target.checked })}
                disabled={jackpotOptOutMut.isPending}
                className="accent-amber-400"
              />
              Mute jackpot claim broadcasts
            </label>
            <label className="flex items-center gap-2 text-[10px] font-mono void-text-accent cursor-pointer">
              <input
                type="checkbox"
                checked={milestoneOptedOut}
                onChange={(e) => milestoneOptOutMut.mutate({ optOut: e.target.checked })}
                disabled={milestoneOptOutMut.isPending}
                className="accent-amber-400"
              />
              Mute Christmas in July milestone broadcasts
            </label>
          </div>
        </div>

        {/* Cosmetic inventory with equip controls */}
        <CosmeticsInventory />

        {/* Achievement leaderboard — top players by count */}
        <div className="bg-gradient-to-br from-green-950/20 to-gray-900/40 border void-border-success rounded-xl p-5 mb-6">
          <h2 className="font-display text-lg void-text-energy mb-3 flex items-center gap-2">
            <Crown className="w-5 h-5 void-text-energy" />
            Most Achievements
          </h2>
          {achievementBoardQuery.isLoading && (
            <p className="font-mono text-sm text-white/40">Loading…</p>
          )}
          {achievementBoardQuery.data && achievementBoardQuery.data.length === 0 && (
            <p className="font-mono text-xs text-white/30">No achievements unlocked yet.</p>
          )}
          {achievementBoardQuery.data && achievementBoardQuery.data.length > 0 && (
            <div className="space-y-2">
              {achievementBoardQuery.data.map((row, i) => (
                <div
                  key={row.userId}
                  className={`flex items-center gap-3 p-2 rounded-lg border font-mono text-sm ${
                    i === 0 ? "void-bg-success void-border-success" : "void-bg-canvas void-border"
                  }`}
                >
                  <span className={`w-8 text-center ${i === 0 ? "void-text-energy" : "text-white/30"}`}>
                    #{i + 1}
                  </span>
                  <span className="flex-1 text-white/70">
                    {row.name ?? `Captain #${row.userId}`}
                  </span>
                  <span className={i === 0 ? "void-text-energy font-bold" : "void-text-energy"}>
                    {row.count} unlocked
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* First-to-earn rare achievements */}
        <div className="bg-gradient-to-br from-purple-950/20 to-gray-900/40 border void-border-system rounded-xl p-5 mb-8">
          <h2 className="font-display text-lg void-text-system mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 void-text-system" />
            First to Earn
          </h2>
          {firstClaimsQuery.isLoading && (
            <p className="font-mono text-sm text-white/40">Loading…</p>
          )}
          {firstClaimsQuery.data && (
            <div className="space-y-2">
              {firstClaimsQuery.data.map((claim) => (
                <div
                  key={claim.achievementId}
                  className="flex items-center gap-3 p-2 rounded-lg border void-border-system void-bg-canvas font-mono text-xs"
                >
                  <span className="flex-1 void-text-system uppercase tracking-widest">
                    {claim.achievementId.replace(/_/g, " ")}
                  </span>
                  {claim.userId != null ? (
                    <>
                      <span className="text-white/60">
                        {claim.name ?? `Captain #${claim.userId}`}
                      </span>
                      <span className="text-[10px] text-white/30">
                        {claim.earnedAt ? new Date(claim.earnedAt).toLocaleDateString() : ""}
                      </span>
                    </>
                  ) : (
                    <span className="text-white/20">unclaimed</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* audit/16 PR 3 — Pazaak Tournament season leaderboard */}
        <div className="mb-8">
          <h2 className="font-display text-lg void-text-accent mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 void-text-accent" />
            Pazaak Tournament — {currentSeason}
            <Link href="/casino/tournament" className="ml-auto font-mono text-[10px] void-text-muted hover:void-text-accent">
              Enter today's bracket →
            </Link>
          </h2>
          {tournamentBoardQuery.isLoading && (
            <p className="font-mono text-sm text-white/40">Tallying brackets...</p>
          )}
          {tournamentBoardQuery.data && tournamentBoardQuery.data.length === 0 && (
            <div className="void-bg-canvas border void-border rounded-xl p-6 text-center">
              <p className="font-mono text-xs text-white/40">No tournament wins this season yet. Be first.</p>
            </div>
          )}
          {tournamentBoardQuery.data && tournamentBoardQuery.data.length > 0 && (
            <div className="rounded-xl border void-border void-bg-canvas overflow-hidden" data-testid="pazaak-tournament-leaderboard">
              {tournamentBoardQuery.data.map((row, i) => (
                <div
                  key={row.userId}
                  className={`flex items-center justify-between px-4 py-3 ${
                    i % 2 === 0 ? "void-bg-canvas" : "bg-black/30"
                  } ${i === 0 ? "void-text-accent" : "text-foreground/80"}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-white/40 w-6">#{i + 1}</span>
                    <span className="font-mono text-sm">Player {row.userId}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-white/60">
                      {row.wins} {row.wins === 1 ? "win" : "wins"}
                    </span>
                    <span className="font-mono text-sm void-text-accent">{row.totalPrize}D</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top jackpots */}
        <h2 className="font-display text-lg void-text-accent mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 void-text-accent" />
          Biggest Jackpots — {currentSeason}
        </h2>
        {leaderboardQuery.isLoading && (
          <p className="font-mono text-sm text-white/40">Loading the hall of chaos...</p>
        )}
        {leaderboardQuery.data && leaderboardQuery.data.length === 0 && (
          <div className="void-bg-canvas border void-border rounded-xl p-6 text-center">
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
                    ? "void-bg-sunk void-border"
                    : "void-bg-canvas void-border"
                }`}
              >
                <span className={`w-8 text-center ${i === 0 ? "void-text-accent" : "text-white/30"}`}>
                  #{i + 1}
                </span>
                <span className="flex-1 text-white/70">
                  {GAME_LABELS[row.game] ?? row.game}
                </span>
                <span className={i === 0 ? "void-text-accent" : "void-text-energy"}>
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
