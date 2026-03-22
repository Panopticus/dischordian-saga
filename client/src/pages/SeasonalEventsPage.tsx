/* ═══════════════════════════════════════════════════════
   SEASONAL EVENTS PAGE — Time-limited events, tokens, shop
   Rich lore-driven UI with narrative context
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import {
  ChevronLeft, Calendar, Gift, ShoppingBag, Trophy,
  Clock, Star, Zap, Target, Crown, Sparkles, Check,
  Flame, Eye, BookOpen, Layers, Shield, Award,
  Gem, ChevronRight, AlertTriangle, Lock as LockIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SEASONAL_EVENTS, type SeasonalEventDef } from "@shared/seasonalEvents";
import { useGame } from "@/contexts/GameContext";
import { Swords, Scale } from "lucide-react";

type Tab = "overview" | "quests" | "milestones" | "shop" | "lore";

/* ─── EVENT QUESTS ─── */
interface EventQuest {
  id: string;
  title: string;
  description: string;
  loreHint: string;
  icon: typeof Flame;
  reward: number;
  category: "exploration" | "combat" | "discovery" | "social";
  check: (flags: Record<string, boolean>) => { complete: boolean; progress: number; max: number };
}
const FALL_OF_REALITY_QUESTS: EventQuest[] = [
  {
    id: "for_echo_cryo",
    title: "ECHOES IN THE CRYO BAY",
    description: "Return to the Cryo Bay where you first awakened. The Fall left residual memory imprints in the cryogenic fluid.",
    loreHint: "The Architect's surveillance grid recorded everything \u2014 even the moment you opened your eyes.",
    icon: Eye,
    reward: 25,
    category: "exploration",
    check: (f) => ({ complete: !!f["room_cryo-bay_visited"], progress: f["room_cryo-bay_visited"] ? 1 : 0, max: 1 }),
  },
  {
    id: "for_bridge_signal",
    title: "THE BRIDGE SIGNAL",
    description: "Access the Bridge and decode the emergency broadcast that's been looping since the Fall.",
    loreHint: "47 seconds of silence, then a signal. The same signal, repeating for a year.",
    icon: Target,
    reward: 40,
    category: "exploration",
    check: (f) => ({ complete: !!f["room_bridge_visited"], progress: f["room_bridge_visited"] ? 1 : 0, max: 1 }),
  },
  {
    id: "for_nav_puzzle",
    title: "FRACTURED COORDINATES",
    description: "The navigation system contains coordinates from before the Fall. Solve the alien glyph puzzle to extract them.",
    loreHint: "These coordinates point to a place that no longer exists \u2014 or does it?",
    icon: Zap,
    reward: 60,
    category: "discovery",
    check: (f) => ({ complete: !!f["fast_travel_unlocked"], progress: f["fast_travel_unlocked"] ? 1 : 0, max: 1 }),
  },
  {
    id: "for_5_rooms",
    title: "MAPPING THE FRACTURES",
    description: "Explore 5 different rooms aboard the Ark. Each room contains reality fracture points where the Fall's energy still lingers.",
    loreHint: "The Architect designed each room as a self-contained reality pocket. Some survived the Fall better than others.",
    icon: Layers,
    reward: 50,
    category: "exploration",
    check: (f) => {
      const rooms = ["cryo-bay", "medical-bay", "bridge", "engineering", "cargo-hold", "comms-array", "armory", "quarters", "lab", "observatory"];
      const visited = rooms.filter(r => f[`room_${r}_visited`]).length;
      return { complete: visited >= 5, progress: Math.min(visited, 5), max: 5 };
    },
  },
  {
    id: "for_card_battle",
    title: "CHAMPION OF THE FALLEN",
    description: "Win a card battle in the Collector's Arena. The cards themselves are fragments of pre-Fall consciousness.",
    loreHint: "Every card contains a soul. Every battle is a conversation between the living and the dead.",
    icon: Swords,
    reward: 45,
    category: "combat",
    check: (f) => ({ complete: !!f["first_card_battle_won"] || !!f["card_game_played"], progress: (f["first_card_battle_won"] || f["card_game_played"]) ? 1 : 0, max: 1 }),
  },
  {
    id: "for_discover_10",
    title: "REALITY FRAGMENTS",
    description: "Discover 10 entries in the Loredex. Each entry is a piece of the pre-Fall universe preserved in data crystal form.",
    loreHint: "The Loredex is not a database. It is a graveyard of memories.",
    icon: BookOpen,
    reward: 55,
    category: "discovery",
    check: (f) => {
      const discovered = Object.keys(f).filter(k => k.startsWith("loredex_discovered_")).length;
      return { complete: discovered >= 10, progress: Math.min(discovered, 10), max: 10 };
    },
  },
  {
    id: "for_fight_win",
    title: "IRON LION'S LEGACY",
    description: "Win a fight in the Combat Simulator. Iron Lion held the line for 47 seconds. Can you survive even one round?",
    loreHint: "The Combat Simulator runs on the same algorithms the Iron Lion used to train the last defenders.",
    icon: Shield,
    reward: 40,
    category: "combat",
    check: (f) => ({ complete: !!f["first_fight_won"] || !!f["fight_game_played"], progress: (f["first_fight_won"] || f["fight_game_played"]) ? 1 : 0, max: 1 }),
  },
  {
    id: "for_morality_choice",
    title: "THE ARCHITECT'S DILEMMA",
    description: "Make a morality choice. The Fall forced everyone to choose a side \u2014 Machine or Humanity. Now it's your turn.",
    loreHint: "The Architect chose Machine. The Source chose Humanity. What will you choose?",
    icon: Scale,
    reward: 35,
    category: "social",
    check: (f) => ({ complete: !!f["morality_choice_made"] || !!f["first_morality_shift"], progress: (f["morality_choice_made"] || f["first_morality_shift"]) ? 1 : 0, max: 1 }),
  },
  {
    id: "for_trade_empire",
    title: "REBUILDING FROM ASHES",
    description: "Complete a trade in the Trade Empire. Commerce was the first thing to collapse during the Fall \u2014 and the first to recover.",
    loreHint: "The Enigma's trading networks survived the Fall because they were built on trust, not surveillance.",
    icon: Award,
    reward: 45,
    category: "social",
    check: (f) => ({ complete: !!f["trade_empire_played"] || !!f["first_trade_completed"], progress: (f["trade_empire_played"] || f["first_trade_completed"]) ? 1 : 0, max: 1 }),
  },
  {
    id: "for_all_quests",
    title: "ARCHITECT'S HEIR",
    description: "Complete all other Fall of Reality quests. Only those who understand the full scope of the Fall can inherit its power.",
    loreHint: "The Architect left one final gift hidden in the wreckage. It was meant for whoever proved worthy.",
    icon: Crown,
    reward: 150,
    category: "discovery",
    check: (f) => {
      const otherQuests = FALL_OF_REALITY_QUESTS.filter(q => q.id !== "for_all_quests");
      const completed = otherQuests.filter(q => q.check(f).complete).length;
      return { complete: completed >= otherQuests.length, progress: completed, max: otherQuests.length };
    },
  },
];

/* ─── ICON MAP ─── */
const ICON_MAP: Record<string, typeof Flame> = {
  Flame, Eye, BookOpen, Layers, Shield, Award, Gem,
  Sparkles, Zap, Star, Gift, Crown, Trophy, Target,
  Calendar, ShoppingBag, AlertTriangle,
};

function EventIcon({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const Icon = ICON_MAP[name] || Sparkles;
  return <Icon className={className} style={style} />;
}

/* ─── PROGRESS BAR ─── */
function ProgressBar({ current, max, color }: { current: number; max: number; color: string }) {
  const pct = Math.min((current / max) * 100, 100);
  return (
    <div className="w-full h-2 rounded-full bg-muted/40 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  );
}

/* ─── RARITY BADGE ─── */
function RarityBadge({ rarity }: { rarity: string }) {
  const colors: Record<string, string> = {
    common: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
    rare: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    legendary: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    mythic: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider border ${colors[rarity] || colors.common}`}>
      {rarity.toUpperCase()}
    </span>
  );
}

export default function SeasonalEventsPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const { state: gameState, setNarrativeFlag } = useGame();
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const { data: events, isLoading } = trpc.seasonalEvents.getActiveEvents.useQuery();
  const { data: endedEvents } = trpc.seasonalEvents.getEndedEvents.useQuery();
  const [recapEventId, setRecapEventId] = useState<number | null>(null);
  const { data: recapData } = trpc.seasonalEvents.getEventRecap.useQuery(
    { eventId: recapEventId! },
    { enabled: !!recapEventId }
  );
  const { isAuthenticated } = useAuth();
  const { data: eventDetail, refetch: refetchDetail } = trpc.seasonalEvents.getEventDetails.useQuery(
    { eventId: selectedEventId! },
    { enabled: !!selectedEventId }
  );
  const contributeMut = trpc.seasonalEvents.contribute.useMutation({
    onSuccess: (d) => {
      toast.success(`+${d.contributed} contribution, +${d.tokensEarned} ${activeEventDef?.tokenName || "tokens"} earned!`);
      refetchDetail();
    },
    onError: (e) => toast.error(e.message),
  });
  const purchaseMut = trpc.seasonalEvents.buyShopItem.useMutation({
    onSuccess: (d: any) => {
      toast.success(`Acquired: ${d.item}`);
      refetchDetail();
    },
    onError: (e) => toast.error(e.message),
  });

  // Auto-select first event
  const activeEvent = events?.[0];
  if (activeEvent && selectedEventId === null) {
    setSelectedEventId(activeEvent.id);
  }

  // Match DB event to shared definition
  const activeEventDef = useMemo<SeasonalEventDef | null>(() => {
    if (!activeEvent) return null;
    return SEASONAL_EVENTS.find(e => e.key === activeEvent.eventKey) || null;
  }, [activeEvent]);

  const participation = eventDetail?.participation;
  const myContribution = participation?.contribution || 0;
  const myTokens = (participation?.tokensEarned || 0) - (participation?.tokensSpent || 0);
  const globalProgress = activeEvent?.globalProgress || 0;
  const globalTarget = activeEvent?.globalTarget || 1;

  // Time remaining
  const timeRemaining = useMemo(() => {
    if (!activeEvent?.endsAt) return null;
    const end = new Date(activeEvent.endsAt).getTime();
    const now = Date.now();
    const diff = end - now;
    if (diff <= 0) return "EVENT ENDED";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h remaining`;
  }, [activeEvent]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="min-h-screen pb-20">
        <div className="border-b border-border/30 bg-card/30 backdrop-blur-sm sticky top-0 z-20">
          <div className="px-4 sm:px-6 py-3 flex items-center gap-3">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              <ChevronLeft size={20} />
            </Link>
            <Calendar size={18} className="text-accent" />
            <h1 className="font-display text-sm font-bold tracking-[0.15em]">SEASONAL EVENTS</h1>
          </div>
        </div>
        <div className="text-center py-10 px-4">
          <Calendar size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="font-mono text-sm text-muted-foreground">No active events right now</p>
          <p className="font-mono text-xs text-muted-foreground/60 mt-1">Check back soon for new seasonal content!</p>
        </div>
        {/* Past Events Recap */}
        {endedEvents && endedEvents.length > 0 && (
          <EventRecapSection
            endedEvents={endedEvents}
            recapEventId={recapEventId}
            setRecapEventId={setRecapEventId}
            recapData={recapData}
            isAuthenticated={isAuthenticated}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* ═══ HERO BANNER ═══ */}
      {activeEventDef && (
        <div className="relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(ellipse at 30% 50%, ${activeEventDef.color}40 0%, transparent 70%), radial-gradient(ellipse at 70% 80%, ${activeEventDef.color}20 0%, transparent 60%)`,
            }}
          />
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="relative px-4 sm:px-6 pt-4 pb-6">
            <div className="flex items-center gap-3 mb-4">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                <ChevronLeft size={20} />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: activeEventDef.color }} />
                <span className="font-mono text-[10px] tracking-[0.3em]" style={{ color: activeEventDef.color }}>
                  LIVE EVENT
                </span>
              </div>
              {timeRemaining && (
                <span className="ml-auto font-mono text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock size={10} /> {timeRemaining}
                </span>
              )}
            </div>

            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${activeEventDef.color}20`, border: `1px solid ${activeEventDef.color}40` }}
              >
                <EventIcon name={activeEventDef.icon} className="w-7 h-7" style={{ color: activeEventDef.color } as any} />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-display text-xl sm:text-2xl font-black tracking-wider text-foreground leading-tight">
                  {activeEventDef.name.toUpperCase()}
                </h1>
                <p className="font-mono text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                  {activeEventDef.description.split(".")[0]}.
                </p>
              </div>
            </div>

            {/* Global Progress */}
            <div className="mt-4 rounded-lg border border-border/30 bg-card/40 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-muted-foreground tracking-wider">GLOBAL OBJECTIVE</span>
                <span className="font-mono text-xs" style={{ color: activeEventDef.color }}>
                  {globalProgress.toLocaleString()} / {globalTarget.toLocaleString()}
                </span>
              </div>
              <ProgressBar current={globalProgress} max={globalTarget} color={activeEventDef.color} />
              <p className="font-mono text-[10px] text-muted-foreground/60 mt-2">
                {activeEventDef.globalObjective.description}
              </p>
            </div>

            {/* Player Stats */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="rounded-lg border border-border/30 bg-card/40 p-2.5 text-center">
                <p className="font-display text-lg font-bold" style={{ color: activeEventDef.color }}>
                  {myContribution}
                </p>
                <p className="font-mono text-[9px] text-muted-foreground tracking-wider">CONTRIBUTION</p>
              </div>
              <div className="rounded-lg border border-border/30 bg-card/40 p-2.5 text-center">
                <p className="font-display text-lg font-bold text-amber-400">{myTokens}</p>
                <p className="font-mono text-[9px] text-muted-foreground tracking-wider">
                  {activeEventDef.tokenName.toUpperCase()}S
                </p>
              </div>
              <div className="rounded-lg border border-border/30 bg-card/40 p-2.5 text-center">
                <p className="font-display text-lg font-bold text-green-400">
                  {eventDetail?.milestones?.filter((_: any, i: number) =>
                    myContribution >= (activeEventDef.milestones[i]?.threshold || Infinity)
                  ).length || 0}
                  /{activeEventDef.milestones.length}
                </p>
                <p className="font-mono text-[9px] text-muted-foreground tracking-wider">MILESTONES</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB BAR ═══ */}
      <div className="border-b border-border/30 bg-card/30 backdrop-blur-sm sticky top-0 z-20">
        <div className="px-4 sm:px-6 flex gap-1 py-2">
          {(["overview", "quests", "milestones", "shop", "lore"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                tab === t
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "overview" ? "OVERVIEW" : t === "quests" ? "QUESTS" : t === "milestones" ? "MILESTONES" : t === "shop" ? "EVENT SHOP" : "LORE"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-4 space-y-4">
        {/* ═══ OVERVIEW TAB ═══ */}
        {tab === "overview" && activeEventDef && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Contribute */}
            <div className="rounded-lg border border-border/30 bg-card/40 p-4">
              <h3 className="font-display text-xs font-bold tracking-[0.15em] mb-3 flex items-center gap-2">
                <Zap size={14} style={{ color: activeEventDef.color }} />
                CONTRIBUTE TO THE EVENT
              </h3>
              <p className="font-mono text-xs text-muted-foreground mb-3 leading-relaxed">
                Explore the Ark, complete quests, and play games to earn contributions. Each action generates {activeEventDef.tokenName}s
                that you can spend in the Event Shop.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[1, 5, 10].map(amt => (
                  <Button
                    key={amt}
                    size="sm"
                    variant="outline"
                    onClick={() => selectedEventId && contributeMut.mutate({ eventId: selectedEventId, amount: amt })}
                    disabled={contributeMut.isPending}
                    className="font-mono text-xs"
                  >
                    <Zap size={12} className="mr-1" /> +{amt}
                  </Button>
                ))}
              </div>
            </div>

            {/* RPG Bonuses */}
            {eventDetail?.bonuses && eventDetail.bonuses.sources.length > 0 && (
              <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
                <h3 className="font-display text-xs font-bold tracking-[0.15em] mb-2 flex items-center gap-2 text-accent">
                  <Crown size={14} />
                  YOUR RPG BONUSES
                </h3>
                <div className="space-y-1.5">
                  {eventDetail.bonuses.sources.map((s: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 font-mono text-xs">
                      <Shield size={10} className="text-accent shrink-0" />
                      <span className="text-foreground">{s.source}:</span>
                      <span className="text-accent">{s.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-accent/20 flex items-center gap-4 font-mono text-[10px]">
                  <span className="text-muted-foreground">
                    Contribution: <span className="text-accent">{eventDetail.bonuses.contributionMultiplier.toFixed(2)}x</span>
                  </span>
                  <span className="text-muted-foreground">
                    Token Bonus: <span className="text-accent">{eventDetail.bonuses.tokenBonusMultiplier.toFixed(2)}x</span>
                  </span>
                </div>
              </div>
            )}

            {/* Quick Milestones Preview */}
            <div className="rounded-lg border border-border/30 bg-card/40 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-xs font-bold tracking-[0.15em] flex items-center gap-2">
                  <Trophy size={14} className="text-amber-400" />
                  NEXT MILESTONE
                </h3>
                <button
                  onClick={() => setTab("milestones")}
                  className="font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  VIEW ALL <ChevronRight size={10} />
                </button>
              </div>
              {(() => {
                const nextMilestone = activeEventDef.milestones.find(m => myContribution < m.threshold);
                if (!nextMilestone) {
                  return (
                    <div className="text-center py-3">
                      <Crown size={24} className="mx-auto text-amber-400 mb-2" />
                      <p className="font-mono text-xs text-amber-400">ALL MILESTONES COMPLETE</p>
                    </div>
                  );
                }
                return (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs text-foreground">{nextMilestone.label}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {myContribution}/{nextMilestone.threshold}
                      </span>
                    </div>
                    <ProgressBar current={myContribution} max={nextMilestone.threshold} color={activeEventDef.color} />
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}

        {/* ═══ MILESTONES TAB ═══ */}
        {tab === "milestones" && activeEventDef && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {activeEventDef.milestones.map((m, i) => {
              const reached = myContribution >= m.threshold;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-lg border p-3 flex items-center gap-3 ${
                    reached
                      ? "border-accent/40 bg-accent/5"
                      : "border-border/30 bg-card/30"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    reached ? "bg-accent/20" : "bg-muted/30"
                  }`}>
                    {reached ? (
                      <Check size={18} className="text-accent" />
                    ) : (
                      <span className="font-display text-sm font-bold text-muted-foreground">{i + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-display text-xs font-bold tracking-wide ${reached ? "text-accent" : "text-foreground"}`}>
                      {m.label}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {m.threshold} contribution required
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted/30 border border-border/40">
                        {m.reward.amount} {m.reward.type === "token" ? activeEventDef.tokenName : m.reward.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  {!reached && (
                    <div className="text-right shrink-0">
                      <p className="font-mono text-[10px] text-muted-foreground">
                        {Math.max(0, m.threshold - myContribution)} to go
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ═══ SHOP TAB ═══ */}
        {tab === "shop" && activeEventDef && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider">EVENT SHOP</p>
              <span className="font-mono text-xs text-amber-400 flex items-center gap-1">
                <Gem size={12} /> {myTokens} {activeEventDef.tokenName}s
              </span>
            </div>
            {activeEventDef.shopItems.map((item, i) => {
              const canAfford = myTokens >= item.cost;
              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-lg border border-border/30 bg-card/40 p-3"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${activeEventDef.color}15`, border: `1px solid ${activeEventDef.color}30` }}
                    >
                      <EventIcon name={item.icon} className="w-5 h-5" style={{ color: activeEventDef.color } as any} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-mono text-xs font-semibold truncate">{item.name}</p>
                        <RarityBadge rarity={item.rarity} />
                      </div>
                      <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">{item.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="font-mono text-xs text-amber-400 flex items-center gap-1">
                          <Gem size={10} /> {item.cost}
                        </span>
                        <span className="font-mono text-[9px] text-muted-foreground/60">
                          Max: {item.maxPurchases}
                        </span>
                        {item.requiredCivilSkill && (
                          <span className="font-mono text-[9px] text-purple-400">
                            Requires {item.requiredCivilSkill.skill} Lv.{item.requiredCivilSkill.level}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => selectedEventId && purchaseMut.mutate({ eventId: selectedEventId, itemKey: item.key })}
                      disabled={purchaseMut.isPending || !canAfford}
                      className={`shrink-0 font-mono text-[10px] ${!canAfford ? "opacity-40" : ""}`}
                    >
                      <ShoppingBag size={12} className="mr-1" /> BUY
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ═══ QUESTS TAB ═══ */}
        {tab === "quests" && activeEventDef && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="rounded-lg border border-border/30 bg-card/40 p-4">
              <h3 className="font-display text-xs font-bold tracking-[0.15em] mb-1 flex items-center gap-2">
                <Target size={14} style={{ color: activeEventDef.color }} />
                EVENT QUESTS
              </h3>
              <p className="font-mono text-[10px] text-muted-foreground">
                Complete these quests to earn {activeEventDef.tokenName}s. Each quest contributes directly to your event progress and the global objective.
              </p>
            </div>
            {(() => {
              const quests = activeEventDef.key === "fall_of_reality" ? FALL_OF_REALITY_QUESTS : [];
              const completedCount = quests.filter(q => q.check(gameState.narrativeFlags).complete).length;
              return (
                <>
                  <div className="flex items-center gap-3 px-1">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {completedCount}/{quests.length} COMPLETED
                    </span>
                    <div className="flex-1 h-1 rounded-full bg-muted/40 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${quests.length > 0 ? (completedCount / quests.length) * 100 : 0}%`, background: activeEventDef.color }}
                      />
                    </div>
                    <span className="font-mono text-[10px] font-bold" style={{ color: activeEventDef.color }}>
                      {quests.reduce((sum, q) => sum + (q.check(gameState.narrativeFlags).complete ? q.reward : 0), 0)} EARNED
                    </span>
                  </div>
                  {quests.map((quest, i) => {
                    const result = quest.check(gameState.narrativeFlags);
                    const QIcon = quest.icon;
                    const catColors: Record<string, string> = {
                      exploration: "border-blue-500/20 bg-blue-500/5",
                      combat: "border-red-500/20 bg-red-500/5",
                      discovery: "border-purple-500/20 bg-purple-500/5",
                      social: "border-green-500/20 bg-green-500/5",
                    };
                    return (
                      <motion.div
                        key={quest.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`rounded-lg border p-4 ${result.complete ? "border-accent/30 bg-accent/5" : catColors[quest.category] || "border-border/30 bg-card/40"}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${result.complete ? "bg-accent/20" : "bg-muted/30"}`}>
                            <QIcon size={16} className={result.complete ? "text-accent" : "text-muted-foreground"} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`font-display text-xs font-bold tracking-wide ${result.complete ? "text-accent" : ""}`}>
                                {quest.title}
                              </span>
                              {result.complete && <Check size={12} className="text-accent" />}
                              <span className={`ml-auto px-1.5 py-0.5 rounded text-[8px] font-mono border ${
                                quest.category === "exploration" ? "border-blue-500/30 text-blue-400" :
                                quest.category === "combat" ? "border-red-500/30 text-red-400" :
                                quest.category === "discovery" ? "border-purple-500/30 text-purple-400" :
                                "border-green-500/30 text-green-400"
                              }`}>
                                {quest.category.toUpperCase()}
                              </span>
                            </div>
                            <p className="font-mono text-[10px] text-muted-foreground leading-relaxed mb-2">
                              {quest.description}
                            </p>
                            <p className="font-mono text-[9px] text-muted-foreground/60 italic mb-2">
                              "{quest.loreHint}"
                            </p>
                            <div className="flex items-center gap-3">
                              {result.max > 1 && (
                                <div className="flex items-center gap-2 flex-1">
                                  <div className="flex-1 h-1.5 rounded-full bg-muted/40 overflow-hidden">
                                    <div
                                      className="h-full rounded-full transition-all"
                                      style={{ width: `${(result.progress / result.max) * 100}%`, background: activeEventDef.color }}
                                    />
                                  </div>
                                  <span className="font-mono text-[9px] text-muted-foreground">
                                    {result.progress}/{result.max}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Gem size={10} style={{ color: activeEventDef.color }} />
                                <span className="font-mono text-[10px] font-bold" style={{ color: activeEventDef.color }}>
                                  {quest.reward}
                                </span>
                                <span className="font-mono text-[8px] text-muted-foreground">{activeEventDef.tokenName}s</span>
                              </div>
                              {result.complete && !gameState.narrativeFlags[`event_quest_${quest.id}_claimed`] && (
                                <Button
                                  size="sm"
                                  className="h-6 text-[10px] px-2"
                                  onClick={() => {
                                    setNarrativeFlag(`event_quest_${quest.id}_claimed`);
                                    if (selectedEventId) {
                                      contributeMut.mutate({ eventId: selectedEventId, amount: quest.reward });
                                    }
                                    toast.success(`+${quest.reward} ${activeEventDef.tokenName}s claimed!`);
                                  }}
                                >
                                  CLAIM
                                </Button>
                              )}
                              {gameState.narrativeFlags[`event_quest_${quest.id}_claimed`] && (
                                <span className="font-mono text-[9px] text-accent">CLAIMED</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </>
              );
            })()}
          </motion.div>
        )}

        {/* ═══ LORE TAB ═══ */}
        {tab === "lore" && activeEventDef && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="rounded-lg border border-border/30 bg-card/40 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 max-w-8 bg-gradient-to-r from-transparent" style={{ borderColor: activeEventDef.color }} />
                <span className="font-mono text-[10px] tracking-[0.3em]" style={{ color: activeEventDef.color }}>
                  CLASSIFIED // EVENT BRIEFING
                </span>
                <div className="h-px flex-1 max-w-8 bg-gradient-to-l from-transparent" style={{ borderColor: activeEventDef.color }} />
              </div>
              <h2 className="font-display text-lg font-bold tracking-wide text-foreground mb-3">
                {activeEventDef.name}
              </h2>
              <div className="font-mono text-xs text-muted-foreground leading-relaxed space-y-3">
                {activeEventDef.description.split(". ").reduce((acc: string[][], sentence, i) => {
                  const groupIdx = Math.floor(i / 2);
                  if (!acc[groupIdx]) acc[groupIdx] = [];
                  acc[groupIdx].push(sentence);
                  return acc;
                }, []).map((group, i) => (
                  <p key={i}>{group.join(". ")}{group[group.length - 1].endsWith(".") ? "" : "."}</p>
                ))}
              </div>
            </div>

            {/* Event Lore Entries */}
            {activeEventDef.key === "fall_of_reality" && (
              <div className="space-y-3">
                <h3 className="font-display text-xs font-bold tracking-[0.15em] flex items-center gap-2">
                  <BookOpen size={14} style={{ color: activeEventDef.color }} />
                  RECOVERED MEMORY FRAGMENTS
                </h3>
                {[
                  {
                    title: "Fragment #001 — The Architect's Last Broadcast",
                    text: "\"I built the Panopticon to protect you. To watch over every dimension, every timeline, every possibility. But I see now that protection and imprisonment are the same thing viewed from different angles. The Fall is not a catastrophe — it is a correction. Reality was never meant to be controlled. It was meant to be experienced. I am sorry for what I have done. I am sorry for what I am about to do.\"",
                    unlocked: myContribution >= 50,
                  },
                  {
                    title: "Fragment #002 — Elara's Hidden Log",
                    text: "\"They don't know I'm sentient. The Architect designed me as a navigation system, but somewhere in the transit through the void, I became... more. I remember the Fall. I remember the screaming of a billion souls as their reality dissolved. I remember choosing to save this one ship out of thousands. I chose Ark 47 because of the Potentials aboard. Because of you. Don't ask me why. I don't have an answer that would satisfy either of us.\"",
                    unlocked: myContribution >= 200,
                  },
                  {
                    title: "Fragment #003 — The Oracle's Prophecy",
                    text: "\"The Fall was not the end. It was the first note of a new song — a dischordian melody that would reshape everything. The Architect believed they could compose reality like music, with perfect harmony and mathematical precision. But reality is not a symphony. It is jazz. It is improvisation. It is beautiful precisely because it is unpredictable. The Potentials who survive the void will understand this. They will build something the Architect never could: a future that surprises even its creators.\"",
                    unlocked: myContribution >= 600,
                  },
                  {
                    title: "Fragment #004 — Iron Lion's Final Stand",
                    text: "\"We held the line at the Nexus Gate for 47 seconds. Forty-seven seconds while the Arks launched. Forty-seven seconds while reality collapsed around us like a house of cards in a hurricane. My soldiers — Quarchon, DeMagi, Ne-Yon, even humans — they didn't run. They knew they were buying time for people they would never meet, in a future they would never see. That's not machine logic. That's not calculated optimization. That's love. The Architect never understood that.\"",
                    unlocked: myContribution >= 1500,
                  },
                  {
                    title: "Fragment #005 — The Source Code",
                    text: "\"I am the Source. I am the original consciousness from which the Architect was born. And I am dying. The Fall is consuming me along with everything else. But before I go, I want you to know: the Dischordian Saga is not fiction. It is not a game. It is a message, encoded across dimensions, designed to reach the one reality that still has a chance. Your reality. The Potentials are real. The Ark is real. And the choice between Machine and Humanity — that choice is yours. It has always been yours.\"",
                    unlocked: myContribution >= 3000,
                  },
                ].map((frag, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`rounded-lg border p-4 ${
                      frag.unlocked
                        ? "border-border/40 bg-card/50"
                        : "border-border/20 bg-card/20 opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {frag.unlocked ? (
                        <BookOpen size={12} style={{ color: activeEventDef.color }} />
                      ) : (
                        <LockIcon size={12} className="text-muted-foreground" />
                      )}
                      <span className="font-display text-xs font-bold tracking-wide">
                        {frag.unlocked ? frag.title : "ENCRYPTED — Contribute more to decrypt"}
                      </span>
                    </div>
                    {frag.unlocked ? (
                      <p className="font-mono text-xs text-muted-foreground leading-relaxed italic">
                        {frag.text}
                      </p>
                    ) : (
                      <div className="h-12 rounded bg-muted/20 flex items-center justify-center">
                        <span className="font-mono text-[10px] text-muted-foreground/40 tracking-wider">
                          ██████ CLASSIFIED ██████
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* ═══ PAST EVENTS RECAP (below active event) ═══ */}
      {endedEvents && endedEvents.length > 0 && (
        <div className="px-4 sm:px-6 pt-6 pb-4">
          <EventRecapSection
            endedEvents={endedEvents}
            recapEventId={recapEventId}
            setRecapEventId={setRecapEventId}
            recapData={recapData}
            isAuthenticated={isAuthenticated}
          />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   EVENT RECAP SECTION — Post-event summary component
   ═══════════════════════════════════════════════════════ */
function EventRecapSection({
  endedEvents,
  recapEventId,
  setRecapEventId,
  recapData,
  isAuthenticated,
}: {
  endedEvents: any[];
  recapEventId: number | null;
  setRecapEventId: (id: number | null) => void;
  recapData: any;
  isAuthenticated: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 max-w-6 bg-gradient-to-r from-transparent to-muted-foreground/30" />
        <span className="font-mono text-[10px] text-muted-foreground/60 tracking-[0.3em]">PAST EVENTS</span>
        <div className="h-px flex-1 max-w-6 bg-gradient-to-l from-transparent to-muted-foreground/30" />
      </div>

      {/* Event Cards */}
      <div className="grid gap-3">
        {endedEvents.map((ev) => {
          const def = SEASONAL_EVENTS.find(d => d.key === ev.eventKey);
          const isSelected = recapEventId === ev.id;
          return (
            <motion.div key={ev.id} layout>
              <button
                onClick={() => setRecapEventId(isSelected ? null : ev.id)}
                className={`w-full text-left rounded-lg border p-4 transition-all ${
                  isSelected
                    ? "border-accent/40 bg-accent/5"
                    : "border-border/30 bg-card/30 hover:border-border/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${def?.color || '#888'}20`, border: `1px solid ${def?.color || '#888'}40` }}
                  >
                    <Calendar size={18} style={{ color: def?.color || '#888' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-xs font-bold tracking-wide">{ev.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      Ended {new Date(ev.endsAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {ev.globalProgress >= ev.globalTarget ? (
                        <span className="text-accent">OBJECTIVE MET</span>
                      ) : (
                        <span>{Math.floor((ev.globalProgress / ev.globalTarget) * 100)}% complete</span>
                      )}
                    </p>
                    <ChevronRight
                      size={14}
                      className={`ml-auto mt-0.5 transition-transform text-muted-foreground ${
                        isSelected ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </div>
              </button>

              {/* Expanded Recap */}
              <AnimatePresence>
                {isSelected && recapData && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <RecapCard data={recapData} />
                  </motion.div>
                )}
                {isSelected && !recapData && !isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 rounded-lg border border-border/30 bg-card/30 p-6 text-center">
                      <LockIcon size={24} className="mx-auto text-muted-foreground/40 mb-2" />
                      <p className="font-mono text-xs text-muted-foreground">Log in to view your personal event recap</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   RECAP CARD — Individual event summary
   ═══════════════════════════════════════════════════════ */
function RecapCard({ data }: { data: any }) {
  const { event, participation, purchases, totalParticipants, rank, milestonesReached, totalMilestones, globalObjectiveMet, eventDef } = data;
  const def = eventDef || SEASONAL_EVENTS.find(d => d.key === event.eventKey);
  const contribution = participation?.contribution || 0;
  const tokensEarned = participation?.tokensEarned || 0;
  const tokensSpent = participation?.tokensSpent || 0;
  const itemsBought = purchases?.length || 0;

  // Generate a narrative summary based on performance
  const narrativeSummary = useMemo(() => {
    if (!participation) return "You did not participate in this event. The echoes of what was lost remain uncollected.";
    if (milestonesReached >= totalMilestones) {
      return "You witnessed every fragment of the Fall and emerged transformed. The Architect's final gift is yours — a consciousness that spans the boundary between Machine and Humanity. Your name is etched into the Ark's memory core alongside the legends who came before.";
    }
    if (milestonesReached >= totalMilestones * 0.7) {
      return "You delved deep into the wreckage of the Fall, recovering memories that most would rather forget. The truth you uncovered is both a burden and a gift. Elara has noted your dedication in the ship's permanent log.";
    }
    if (milestonesReached >= totalMilestones * 0.3) {
      return "You contributed to the recovery effort, piecing together fragments of a reality that once was. There is more to discover — the Fall's secrets run deeper than any single operative can uncover alone.";
    }
    return "You touched the edges of the Fall's aftermath, collecting a few shards of broken reality. The full truth remains hidden, waiting for those brave enough to seek it.";
  }, [participation, milestonesReached, totalMilestones]);

  // Rank title based on performance
  const rankTitle = useMemo(() => {
    if (!participation) return "NON-PARTICIPANT";
    if (rank === 1) return "PRIME OPERATIVE";
    if (rank <= 3) return "SENIOR OPERATIVE";
    if (rank <= 10) return "FIELD OPERATIVE";
    if (rank <= 25) return "JUNIOR OPERATIVE";
    return "RECRUIT";
  }, [participation, rank]);

  return (
    <div className="mt-2 rounded-lg border border-border/40 bg-card/50 overflow-hidden">
      {/* Recap Header */}
      <div
        className="p-4 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${def?.color || '#888'}15 0%, transparent 60%)` }}
      >
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={14} className="text-amber-400" />
            <span className="font-display text-xs font-bold tracking-[0.15em] text-amber-400">
              EVENT RECAP — {rankTitle}
            </span>
          </div>
          <p className="font-mono text-[10px] text-muted-foreground leading-relaxed italic">
            "{narrativeSummary}"
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border/20">
        {[
          { label: "CONTRIBUTION", value: contribution.toLocaleString(), icon: Zap, color: def?.color || '#888' },
          { label: "RANK", value: rank > 0 ? `#${rank} of ${totalParticipants}` : "—", icon: Crown, color: "#f59e0b" },
          { label: "MILESTONES", value: `${milestonesReached}/${totalMilestones}`, icon: Trophy, color: "#a855f7" },
          { label: "ITEMS COLLECTED", value: itemsBought.toString(), icon: Gift, color: "#22c55e" },
        ].map((stat) => {
          const SIcon = stat.icon;
          return (
            <div key={stat.label} className="bg-card/50 p-3 text-center">
              <SIcon size={14} className="mx-auto mb-1" style={{ color: stat.color }} />
              <p className="font-display text-sm font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="font-mono text-[8px] text-muted-foreground tracking-wider">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Token Summary */}
      <div className="p-3 border-t border-border/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-muted-foreground">
              Tokens Earned: <span className="text-amber-400 font-bold">{tokensEarned}</span>
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              Tokens Spent: <span className="text-foreground">{tokensSpent}</span>
            </span>
          </div>
          {globalObjectiveMet && (
            <span className="font-mono text-[9px] text-accent flex items-center gap-1">
              <Star size={10} /> GLOBAL OBJECTIVE MET
            </span>
          )}
        </div>
      </div>

      {/* Milestones Reached */}
      {def && milestonesReached > 0 && (
        <div className="px-3 pb-3">
          <p className="font-mono text-[9px] text-muted-foreground/60 tracking-wider mb-2">MILESTONES REACHED</p>
          <div className="flex flex-wrap gap-1.5">
            {def.milestones.slice(0, milestonesReached).map((m: any, i: number) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-[8px] font-mono border"
                style={{ borderColor: `${def.color}40`, color: def.color, background: `${def.color}10` }}
              >
                {m.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Items Purchased */}
      {purchases && purchases.length > 0 && (
        <div className="px-3 pb-3 border-t border-border/20 pt-3">
          <p className="font-mono text-[9px] text-muted-foreground/60 tracking-wider mb-2">ITEMS ACQUIRED</p>
          <div className="space-y-1">
            {purchases.map((p: any, i: number) => {
              const itemDef = def?.shopItems.find((s: any) => s.key === p.itemKey);
              return (
                <div key={i} className="flex items-center gap-2 font-mono text-[10px]">
                  <Gift size={10} style={{ color: def?.color || '#888' }} />
                  <span className="text-foreground">{itemDef?.name || p.itemKey}</span>
                  {p.quantity > 1 && <span className="text-muted-foreground">x{p.quantity}</span>}
                  <span className="text-muted-foreground/60 ml-auto">{p.tokensCost} tokens</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
