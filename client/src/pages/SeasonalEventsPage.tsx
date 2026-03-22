/* ═══════════════════════════════════════════════════════
   SEASONAL EVENTS PAGE — Time-limited events, tokens, shop
   Rich lore-driven UI with narrative context
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
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

type Tab = "overview" | "milestones" | "shop" | "lore";

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
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const { data: events, isLoading } = trpc.seasonalEvents.getActiveEvents.useQuery();
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
        <div className="text-center py-16 px-4">
          <Calendar size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="font-mono text-sm text-muted-foreground">No active events right now</p>
          <p className="font-mono text-xs text-muted-foreground/60 mt-1">Check back soon for new seasonal content!</p>
        </div>
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
          {(["overview", "milestones", "shop", "lore"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                tab === t
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "overview" ? "OVERVIEW" : t === "milestones" ? "MILESTONES" : t === "shop" ? "EVENT SHOP" : "LORE"}
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
    </div>
  );
}
