/* ═══════════════════════════════════════════════════════
   DAILY LOGIN REWARDS — 30-day reward cycle

   State is server-authoritative. The `loginCalendar` table
   tracks streak, claim date, and cycle day. The client only
   renders what the server returns — it never decides the
   reward itself. This closes the old localStorage exploit
   where clearing browser storage let players re-claim.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift, X, Sparkles, Coins } from "lucide-react";
import { trpc } from "@/lib/trpc";

type ServerReward = {
  day: number;
  type: "dream" | "credits";
  amount: number;
  label: string;
};

interface DailyRewardsProps {
  currentDay: number;       // Cycle day the NEXT claim will land on (1..cycleLength)
  cycleLength: number;      // Typically 30
  streak: number;           // Lifetime streak count
  claimedToday: boolean;
  claiming: boolean;
  rewards: ServerReward[];  // Schedule from server
  onClaim: () => void;
  onClose: () => void;
}

function formatRewardBadge(r: ServerReward) {
  if (r.type === "dream") {
    return (
      <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 font-mono text-xs flex items-center gap-1">
        <Sparkles size={10} /> +{r.amount} Dream
      </span>
    );
  }
  return (
    <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 font-mono text-xs flex items-center gap-1">
      <Coins size={10} /> +{r.amount.toLocaleString()} Credits
    </span>
  );
}

export default function DailyRewards({
  currentDay,
  cycleLength,
  streak,
  claimedToday,
  claiming,
  rewards,
  onClaim,
  onClose,
}: DailyRewardsProps) {
  const todayReward = rewards.find(r => r.day === currentDay);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-black/95 border border-amber-500/20 rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-transparent">
          <div className="flex items-center gap-2">
            <Gift size={18} className="text-amber-400" />
            <h2 className="font-display text-lg tracking-[0.2em] text-amber-400">DAILY REWARDS</h2>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60"><X size={18} /></button>
        </div>

        {/* Current day + streak */}
        <div className="p-4 text-center">
          <p className="font-mono text-[10px] text-white/30 tracking-wider">
            DAY {currentDay} OF {cycleLength} — STREAK {streak}
          </p>
          <div className="w-full h-1.5 rounded-full bg-white/5 mt-2 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
              style={{ width: `${(currentDay / cycleLength) * 100}%` }} />
          </div>
        </div>

        {/* Today's reward */}
        {todayReward && (
          <div className="px-4 pb-4">
            <div className={`p-4 rounded-xl border ${claimedToday ? "border-white/10 bg-white/[0.02] opacity-50" : "border-amber-500/40 bg-amber-500/5"}`}>
              <p className="font-mono text-xs text-amber-400 font-bold mb-2">
                {claimedToday ? "CLAIMED TODAY" : "TODAY'S REWARD"}
              </p>
              <div className="flex flex-wrap gap-2">
                {formatRewardBadge(todayReward)}
              </div>

              {!claimedToday && (
                <button
                  onClick={onClaim}
                  disabled={claiming}
                  className="w-full mt-3 py-2.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono text-sm font-bold hover:bg-amber-500/30 transition-colors disabled:opacity-50"
                >
                  {claiming ? "CLAIMING…" : "CLAIM REWARD"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Reward timeline */}
        <div className="px-4 pb-4">
          <p className="font-mono text-[9px] text-white/20 tracking-wider mb-2">CYCLE REWARDS</p>
          <div className="grid grid-cols-5 gap-1.5">
            {rewards.map(reward => {
              const isPast = reward.day < currentDay;
              const isToday = reward.day === currentDay;
              const isDream = reward.type === "dream";

              return (
                <div key={reward.day}
                  className={`p-1.5 rounded text-center transition-all ${
                    isToday ? "bg-amber-500/20 border border-amber-500/40 scale-110" :
                    isPast ? "bg-white/[0.02] opacity-30" :
                    isDream ? "bg-purple-500/5 border border-purple-500/10" :
                    "bg-amber-500/5 border border-amber-500/10"
                  }`}>
                  <p className="font-mono text-[8px] text-white/30">{reward.day}</p>
                  <p className={`font-mono text-[9px] font-bold ${
                    isDream ? "text-purple-400" : "text-amber-400/80"
                  }`}>
                    {isDream ? `${reward.amount}D` : `${Math.round(reward.amount / 100)}00c`}
                  </p>
                  {isPast && <span className="text-[7px] text-green-400">✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Auto-popup wrapper: shows DailyRewards on login if a reward is available.
 *
 * All state is pulled from the server via `trpc.quests.getLoginCalendar`.
 * Claims go through `trpc.quests.claimLogin`, which is the only place that
 * mutates `loginCalendar`. The client no longer decides or passes reward
 * amounts — the server does, and localStorage is not involved.
 */
export function DailyRewardPopup() {
  const [show, setShow] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.quests.getLoginCalendar.useQuery(undefined, {
    staleTime: 60_000,
  });
  const claimLogin = trpc.quests.claimLogin.useMutation({
    onSuccess: () => {
      setClaimed(true);
      void utils.quests.getLoginCalendar.invalidate();
      // Auto-close after a short celebration window so the player sees the
      // updated "CLAIMED TODAY" state.
      setTimeout(() => setShow(false), 1500);
    },
  });

  useEffect(() => {
    if (isLoading || !data) return;
    if (data.claimedToday) return;
    // Delay popup so it doesn't compete with initial page load.
    const t = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(t);
  }, [isLoading, data]);

  if (!show || !data) return null;

  return (
    <DailyRewards
      currentDay={data.nextClaimDay}
      cycleLength={data.cycleLength}
      streak={data.streak}
      claimedToday={data.claimedToday || claimed}
      claiming={claimLogin.isPending}
      rewards={data.rewards}
      onClaim={() => claimLogin.mutate()}
      onClose={() => setShow(false)}
    />
  );
}
