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
import { useGame } from "@/contexts/GameContext";

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
      <span className="px-2 py-1 rounded void-bg-system void-text-system font-mono text-xs flex items-center gap-1">
        <Sparkles size={10} /> +{r.amount} Dream
      </span>
    );
  }
  return (
    <span className="px-2 py-1 rounded void-bg-sunk void-text-accent font-mono text-xs flex items-center gap-1">
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
        className="w-full max-w-md bg-black/95 border void-border rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b void-border void-bg-sunk">
          <div className="flex items-center gap-2">
            <Gift size={18} className="void-text-accent" />
            <h2 className="font-display text-lg tracking-[0.2em] void-text-accent">DAILY REWARDS</h2>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60"><X size={18} /></button>
        </div>

        {/* Current day + streak */}
        <div className="p-4 text-center">
          <p className="font-mono text-[10px] text-white/30 tracking-wider">
            DAY {currentDay} OF {cycleLength} — STREAK {streak}
          </p>
          <div className="w-full h-1.5 rounded-full bg-white/5 mt-2 overflow-hidden">
            <div className="h-full rounded-full void-bg-success"
              style={{ width: `${(currentDay / cycleLength) * 100}%` }} />
          </div>
        </div>

        {/* Today's reward */}
        {todayReward && (
          <div className="px-4 pb-4">
            <div className={`p-4 rounded-xl border ${claimedToday ? "border-white/10 bg-white/[0.02] opacity-50" : "void-border void-bg-sunk"}`}>
              <p className="font-mono text-xs void-text-accent font-bold mb-2">
                {claimedToday ? "CLAIMED TODAY" : "TODAY'S REWARD"}
              </p>
              <div className="flex flex-wrap gap-2">
                {formatRewardBadge(todayReward)}
              </div>

              {!claimedToday && (
                <button
                  onClick={onClaim}
                  disabled={claiming}
                  className="w-full mt-3 py-2.5 rounded-lg void-bg-sunk border void-border void-text-accent font-mono text-sm font-bold void-bg-sunk transition-colors disabled:opacity-50"
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
                    isToday ? "void-bg-sunk border void-border scale-110" :
                    isPast ? "bg-white/[0.02] opacity-30" :
                    isDream ? "void-bg-system border void-border-system" :
                    "void-bg-sunk border void-border"
                  }`}>
                  <p className="font-mono text-[8px] text-white/30">{reward.day}</p>
                  <p className={`font-mono text-[9px] font-bold ${
                    isDream ? "void-text-system" : "void-text-accent"
                  }`}>
                    {isDream ? `${reward.amount}D` : `${Math.round(reward.amount / 100)}00c`}
                  </p>
                  {isPast && <span className="text-[7px] void-text-energy">✓</span>}
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
  const { state } = useGame();
  const preludeComplete = Boolean(state.narrativeFlags?.prelude_complete);
  const [show, setShow] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const utils = trpc.useUtils();
  // F4 — do not fetch the login calendar until the prelude is past; the
  // popup and the VO both wait until the player has left the opening arc.
  const { data, isLoading } = trpc.quests.getLoginCalendar.useQuery(undefined, {
    staleTime: 60_000,
    enabled: preludeComplete,
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
    if (!preludeComplete) return; // F4
    if (isLoading || !data) return;
    if (data.claimedToday) return;
    // Delay popup so it doesn't compete with initial page load.
    const t = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(t);
  }, [isLoading, data, preludeComplete]);

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
