/**
 * GovernanceHubPage — The Living Democracy of Ark 1047
 *
 * 5-Panel Governance Hub:
 * 1. ActiveVotePanel (center) — current weekly/monthly vote
 * 2. ChroniclePanel (left) — the Antiquarian's Journal
 * 3. PulsePanel (right) — live engagement metrics
 * 4. DailyMicroVotes (below center) — quick daily choices
 * 5. UpcomingEventsBar (footer) — next 3 events with countdowns
 *
 * Desktop: 3-column grid. Mobile: tab-based navigation.
 */
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ChevronLeft, Vote, BookOpen, BarChart3, Calendar,
  Users, Swords, Shield, Sparkles, Clock, Check,
  Radio, TrendingUp, Eye, Target, Flame, Dna,
  Crown, ArrowLeftRight, Music, Heart, Skull,
  AlertTriangle, Flag, Package,
} from "lucide-react";
import { KineticText, AtmosphereScope } from "@/components/void";
import { useGovernanceStore } from "@/stores/governanceStore";
import {
  generateFeedItem, nextAIVoteInterval, calculatePaddedTally,
  type VoteFeedItem,
} from "@/services/aiVotePadding";
import {
  PRIMARY_METRICS, calculateTrend, trendArrow, trendHealthColor,
  getSparklineData, METRIC_DEFINITIONS,
} from "@/services/engagementTracker";
import { SEED_CHRONICLE } from "@/data/antiquarianChronicle";
import {
  ACTS, getCategoryLabel, getStatusColor, getNextEvents,
} from "@/data/eventsCalendar";
import { getDailyVote, generateVoterName } from "@shared/governance";

/* ─── ICON MAP (for dynamic metric rendering) ─── */
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Swords, Target, Vote, Users, Sparkles, Flame, Dna, Crown,
  Shield, ArrowLeftRight, BookOpen, Music, Heart, Skull,
  AlertTriangle, Eye, Flag, Package, Calendar, BarChart3,
};

/* ─── COUNTDOWN HELPER ─── */
function formatCountdown(targetMs: number): string {
  const diff = targetMs - Date.now();
  if (diff <= 0) return "NOW";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/* ─── MINI SPARKLINE (SVG) ─── */
function Sparkline({ data, color = "cyan" }: { data: number[]; color?: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 60;
  const h = 20;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={w} height={h} className="opacity-40">
      <polyline
        points={points}
        fill="none"
        stroke={`var(--color-${color}-400, #22d3ee)`}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── LIVE VOTER FEED HOOK ─── */
function useLiveVoterFeed() {
  const store = useGovernanceStore();
  const [feed, setFeed] = useState<VoteFeedItem[]>([]);

  useEffect(() => {
    const vote = store.activeVote;
    if (!vote) return;

    const optionIds = vote.options.map((o) => o.id);
    const optionLabels: Record<string, string> = {};
    vote.options.forEach((o) => { optionLabels[o.id] = o.label; });

    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      const item = generateFeedItem(optionIds, optionLabels, store.voteTally);
      setFeed((prev) => [item, ...prev.slice(0, 4)]);
      timeout = setTimeout(tick, nextAIVoteInterval());
    };
    timeout = setTimeout(tick, 2000 + Math.random() * 3000);
    return () => clearTimeout(timeout);
  }, [store.activeVote, store.voteTally]);

  // Fallback feed when no active vote
  useEffect(() => {
    if (store.activeVote) return;
    const names = Array.from({ length: 3 }, () => generateVoterName());
    setFeed(
      names.map((name, i) => ({
        id: `seed-${i}`,
        voterName: name,
        optionId: "",
        optionLabel: "the Ark's future",
        isAI: true,
        timestamp: Date.now() - i * 5000,
      })),
    );
  }, [store.activeVote]);

  return feed;
}

/* ═══════════════════════════════════════════════════════
   SUB-PANELS
   ═══════════════════════════════════════════════════════ */

/* ─── ACTIVE VOTE PANEL ─── */
function ActiveVotePanel() {
  const store = useGovernanceStore();
  const vote = store.activeVote;
  const liveVoters = useLiveVoterFeed();

  const playerVote = vote ? store.getPlayerVote(vote.id) : null;

  const handleCast = useCallback(
    (optionId: string) => {
      if (!vote || playerVote) return;
      store.castVote(vote.id, optionId);
    },
    [vote, playerVote, store],
  );

  // Padded tally for display
  const displayTally = useMemo(() => {
    if (!vote) return {};
    const { displayTally: t } = calculatePaddedTally(store.voteTally, 500);
    return t;
  }, [vote, store.voteTally]);

  const totalDisplayed = Object.values(displayTally).reduce((a, b) => a + b, 0);

  if (!vote) {
    const upcoming = store.getUpcomingEvents(1);
    return (
      <div className="void-elevated p-5 text-center">
        <Vote size={32} className="mx-auto text-muted-foreground/30 mb-3" />
        <h2 className="font-display text-sm font-bold tracking-wider text-muted-foreground/60 mb-2">
          NO ACTIVE VOTE
        </h2>
        <p className="font-mono text-[9px] text-muted-foreground/40 mb-4">
          The Antiquarian awaits the next decision.
        </p>
        {upcoming[0] && (
          <div className="void-surface p-3 inline-block">
            <span className="font-mono text-[8px] text-cyan-400 uppercase tracking-wider">NEXT: </span>
            <span className="font-mono text-[10px] text-foreground/70">{upcoming[0].title}</span>
            <span className="font-mono text-[9px] text-amber-400 ml-2">
              {formatCountdown(upcoming[0].startsAt)}
            </span>
          </div>
        )}
      </div>
    );
  }

  const timeLeft = formatCountdown(Date.now() + vote.durationHours * 3600000);

  return (
    <>
      <div className="void-elevated p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-cyan-400">
            MONTH {vote.month} · {vote.category.toUpperCase()} VOTE
          </span>
          <span className="font-mono text-[9px] text-amber-400 flex items-center gap-1">
            <Clock size={10} /> {timeLeft} remaining
          </span>
        </div>

        <h2 className="font-display text-lg font-bold tracking-wider text-foreground mb-3">
          {vote.question}
        </h2>

        {/* Antiquarian framing */}
        <div className="p-3 rounded border border-emerald-500/20 bg-emerald-500/5 mb-4" data-narrative="breathe">
          <div className="font-mono text-[8px] uppercase tracking-wider text-emerald-400 mb-1">
            <BookOpen size={10} className="inline mr-1" /> THE ANTIQUARIAN WRITES
          </div>
          <p className="font-mono text-[11px] italic text-emerald-300/80 leading-relaxed">
            <KineticText text={vote.antiquarianIntro} mode="word" speed={25} showCursor={false} />
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {vote.options.map((opt) => {
            const votes = displayTally[opt.id] || 0;
            const pct = totalDisplayed > 0 ? Math.round((votes / totalDisplayed) * 100) : 0;
            const isSelected = playerVote === opt.id;
            const maxVotes = Math.max(...Object.values(displayTally));
            const isLeading = votes === maxVotes && votes > 0;

            return (
              <motion.button
                key={opt.id}
                whileHover={!playerVote ? { scale: 1.01 } : {}}
                whileTap={!playerVote ? { scale: 0.99 } : {}}
                onClick={() => handleCast(opt.id)}
                disabled={!!playerVote}
                className={`w-full text-left p-4 void-surface relative overflow-hidden transition-all ${
                  isSelected ? "border-cyan-400/50" : ""
                } ${!playerVote ? "cursor-pointer hover:border-cyan-400/30" : "cursor-default"}`}
              >
                {playerVote && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0"
                    style={{
                      background: isLeading
                        ? "linear-gradient(90deg, rgba(34,211,238,0.08), rgba(34,211,238,0.03))"
                        : "linear-gradient(90deg, rgba(255,255,255,0.03), transparent)",
                    }}
                  />
                )}

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="font-display text-sm font-bold tracking-wider text-foreground mb-1 flex items-center gap-2">
                        {opt.label}
                        {isSelected && <Check size={14} className="text-cyan-400" />}
                        {isLeading && playerVote && <TrendingUp size={12} className="text-amber-400" />}
                      </div>
                      <p className="font-mono text-[10px] text-muted-foreground/70 leading-relaxed">{opt.description}</p>
                    </div>
                    {playerVote && (
                      <div className="text-right shrink-0">
                        <div className="font-display text-lg font-bold text-foreground">{pct}%</div>
                        <div className="font-mono text-[8px] text-muted-foreground/50">{votes} votes</div>
                      </div>
                    )}
                  </div>
                  {(isSelected || !playerVote) && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {opt.consequences.map((c, i) => (
                        <span key={i} className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground/60 border border-white/5">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono text-[9px] text-muted-foreground/50 flex items-center gap-1">
            <Users size={10} /> {totalDisplayed.toLocaleString()} Potentials have voted
          </span>
          <span className="font-mono text-[8px] text-muted-foreground/40">
            Proposed by {vote.proposedBy}
          </span>
        </div>
      </div>

      {/* Live voter feed */}
      <div className="void-surface p-3">
        <div className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/50 mb-2 flex items-center gap-1">
          <Radio size={9} className="text-cyan-400" /> LIVE ACTIVITY
        </div>
        <AnimatePresence>
          {liveVoters.slice(0, 3).map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="font-mono text-[9px] text-muted-foreground/40 py-0.5"
            >
              <span className="text-cyan-400/50">{v.voterName}</span>
              <span className="text-muted-foreground/30"> voted for </span>
              <span className="text-foreground/60">{v.optionLabel}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

/* ─── CHRONICLE PANEL ─── */
function ChroniclePanel() {
  const store = useGovernanceStore();
  const chronicleEntries = store.chronicleEntries.length > 0
    ? store.chronicleEntries
    : SEED_CHRONICLE;
  const tomeEntries = store.tomeEntries;

  // Merge and sort all entries by timestamp, newest first
  const allEntries = useMemo(() => {
    const combined = [
      ...chronicleEntries.map((e) => ({
        id: e.id,
        week: e.week,
        type: e.type,
        title: e.title,
        body: e.narrativeText,
        annotation: undefined as string | undefined,
        timestamp: e.timestamp,
      })),
      ...tomeEntries.map((e) => ({
        id: e.id,
        week: e.week,
        type: e.referenceType,
        title: undefined as string | undefined,
        body: e.body,
        annotation: e.annotation,
        timestamp: e.inscribedAt,
      })),
    ];
    return combined.sort((a, b) => b.timestamp - a.timestamp);
  }, [chronicleEntries, tomeEntries]);

  return (
    <AtmosphereScope themeId="golden_sanctuary">
      <div className="space-y-3">
        <div className="text-center mb-4">
          <BookOpen size={20} className="mx-auto text-amber-400 mb-1" />
          <h2 className="font-display text-sm font-bold tracking-wider text-amber-200">
            THE ANTIQUARIAN'S TOME
          </h2>
          <p className="font-mono text-[8px] text-amber-400/50 tracking-wider">
            EVERY CHOICE INSCRIBED
          </p>
        </div>

        <div className="space-y-2 max-h-[60vh] lg:max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin">
          {allEntries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="void-surface p-3"
              style={{
                borderColor: "rgba(251,191,36,0.15)",
                background: "rgba(20,15,10,0.6)",
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[8px] uppercase tracking-wider text-amber-400/60">
                  Week {entry.week} · {entry.type}
                </span>
                <span className="font-mono text-[8px] text-muted-foreground/30">
                  {new Date(entry.timestamp).toLocaleDateString()}
                </span>
              </div>

              {entry.title && (
                <h3 className="font-display text-xs font-bold tracking-wider text-amber-200/90 mb-1">
                  {entry.title}
                </h3>
              )}

              <p className="font-serif text-[11px] text-amber-100/70 leading-relaxed italic whitespace-pre-line">
                {entry.body}
              </p>

              {entry.annotation && (
                <div className="mt-2 pt-1.5 border-t border-amber-500/10">
                  <p className="font-mono text-[8px] text-red-300/50 italic leading-relaxed">
                    <span className="text-red-400/40 text-[7px] uppercase tracking-wider mr-1">
                      PRIVATE NOTE:
                    </span>
                    {entry.annotation}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </AtmosphereScope>
  );
}

/* ─── PULSE PANEL ─── */
function PulsePanel() {
  const store = useGovernanceStore();
  const { metrics, metricsHistory } = store;

  const previousMetrics = metricsHistory.length > 1
    ? metricsHistory[metricsHistory.length - 2]?.metrics
    : undefined;

  return (
    <div className="space-y-3">
      <div className="text-center mb-4">
        <BarChart3 size={20} className="mx-auto text-cyan-400 mb-1" />
        <h2 className="font-display text-sm font-bold tracking-wider">THE PULSE</h2>
        <p className="font-mono text-[8px] text-muted-foreground/50 tracking-wider">
          ARK VITAL SIGNS
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {PRIMARY_METRICS.map((def) => {
          const value = metrics[def.key];
          const prev = previousMetrics ? previousMetrics[def.key] : value;
          const trend = calculateTrend(value, prev);
          const Icon = ICON_MAP[def.icon] || Sparkles;
          const sparkData = getSparklineData(metricsHistory, def.key);

          return (
            <div key={def.key} className="void-surface p-2.5">
              <div className="flex items-center justify-between mb-1">
                <Icon size={12} className={def.color} />
                <span className={`font-mono text-[9px] ${trendHealthColor(trend)}`}>
                  {trendArrow(trend)}
                </span>
              </div>
              <div className="font-display text-base font-bold">{def.format(value)}</div>
              <div className="font-mono text-[7px] text-muted-foreground/50 uppercase tracking-wider">
                {def.shortLabel}
              </div>
              {sparkData.length > 1 && (
                <div className="mt-1">
                  <Sparkline data={sparkData} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── DAILY MICRO-VOTES ─── */
function DailyMicroVotes() {
  const store = useGovernanceStore();
  const today = new Date().toISOString().split("T")[0];
  const dailyVote = useMemo(() => getDailyVote(today), [today]);
  const existingChoice = store.getPlayerDailyVote(today);
  const [choice, setChoice] = useState<"a" | "b" | null>(existingChoice);

  const handleChoice = useCallback(
    (c: "a" | "b") => {
      if (choice) return;
      setChoice(c);
      store.castDailyVote(today, c);
    },
    [choice, today, store],
  );

  return (
    <div className="void-elevated p-4 mt-4">
      <div className="font-mono text-[8px] uppercase tracking-[0.3em] text-amber-400 mb-2">
        DAILY RESOURCE ALLOCATION · {today}
      </div>

      <div className="p-2 rounded border border-cyan-500/20 bg-cyan-500/5 mb-3">
        <div className="font-mono text-[8px] uppercase tracking-wider text-cyan-400 mb-0.5">
          <Eye size={9} className="inline mr-1" /> ELARA
        </div>
        <p className="font-mono text-[10px] text-cyan-300/80 leading-relaxed italic">
          {dailyVote.elaraContext}
        </p>
      </div>

      <h3 className="font-display text-xs font-bold tracking-wider mb-3">{dailyVote.question}</h3>

      <div className="grid grid-cols-2 gap-2">
        {[
          { key: "a" as const, ...dailyVote.optionA },
          { key: "b" as const, ...dailyVote.optionB },
        ].map((opt) => (
          <button
            key={opt.key}
            onClick={() => handleChoice(opt.key)}
            disabled={!!choice}
            className={`p-3 void-surface text-left transition-all ${
              choice === opt.key ? "border-cyan-400/50" : ""
            } ${!choice ? "cursor-pointer hover:border-cyan-400/30" : ""}`}
          >
            <div className="font-display text-xs font-bold tracking-wider mb-1 flex items-center gap-1.5">
              {opt.label}
              {choice === opt.key && <Check size={12} className="text-cyan-400" />}
            </div>
            <p className="font-mono text-[8px] text-muted-foreground/60">{opt.effect}</p>
          </button>
        ))}
      </div>

      {choice && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-[8px] text-cyan-400/60 mt-2 text-center"
        >
          Your allocation has been recorded. The Antiquarian inscribes.
        </motion.p>
      )}
    </div>
  );
}

/* ─── UPCOMING EVENTS BAR ─── */
function UpcomingEventsBar() {
  const store = useGovernanceStore();
  const upcoming = store.getUpcomingEvents(3);
  const [, setTick] = useState(0);

  // Update countdowns every minute
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  // Fallback placeholder events if calendar is empty
  const events = upcoming.length > 0
    ? upcoming
    : [
        { id: "placeholder-1", title: "First Community Vote", category: "weekly_vote" as const, startsAt: Date.now() + 86400000 * 2, status: "upcoming" as const },
        { id: "placeholder-2", title: "The Antiquarian's First Entry", category: "milestone" as const, startsAt: Date.now() + 86400000 * 5, status: "upcoming" as const },
        { id: "placeholder-3", title: "Monthly Decision", category: "monthly_vote" as const, startsAt: Date.now() + 86400000 * 14, status: "upcoming" as const },
      ];

  return (
    <div className="void-surface p-3 mt-4">
      <div className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/50 mb-2 flex items-center gap-1">
        <Calendar size={10} className="text-amber-400" /> UPCOMING EVENTS
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {events.map((event) => (
          <div key={event.id} className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/5">
            <div className="flex-1 min-w-0">
              <div className="font-display text-[10px] font-bold tracking-wider truncate">
                {event.title}
              </div>
              <div className="font-mono text-[7px] text-muted-foreground/40 uppercase tracking-wider">
                {getCategoryLabel(event.category)}
              </div>
            </div>
            <div className="shrink-0 ml-2 text-right">
              <span className={`font-mono text-[9px] font-bold ${getStatusColor(event.status)}`}>
                {formatCountdown(event.startsAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function GovernanceHubPage() {
  const [mobileTab, setMobileTab] = useState<"vote" | "chronicle" | "pulse" | "daily">("vote");

  const mobileTabs = [
    { id: "vote" as const, label: "VOTE", icon: Vote },
    { id: "daily" as const, label: "DAILY", icon: Clock },
    { id: "chronicle" as const, label: "TOME", icon: BookOpen },
    { id: "pulse" as const, label: "PULSE", icon: BarChart3 },
  ];

  return (
    <AtmosphereScope roomKey="guild_sanctum">
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              <ChevronLeft size={20} />
            </Link>
            <Vote size={20} className="text-cyan-400" />
            <div>
              <h1 className="font-display text-xl font-bold tracking-wider">GOVERNANCE HUB</h1>
              <p className="font-mono text-[9px] text-muted-foreground/60 tracking-wider">
                THE POTENTIALS SHAPE REALITY · EVERY CHOICE INSCRIBED
              </p>
            </div>
          </div>

          {/* ═══ MOBILE: Tab bar (visible < lg) ═══ */}
          <div className="flex gap-1 mb-6 overflow-x-auto lg:hidden">
            {mobileTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setMobileTab(t.id)}
                className={`void-btn font-mono text-[9px] tracking-wider flex items-center gap-1.5 whitespace-nowrap ve-compact-ok ${
                  mobileTab === t.id ? "void-btn-primary" : ""
                }`}
                style={{ minHeight: "36px", minWidth: "unset", padding: "6px 12px" }}
              >
                <t.icon size={12} /> {t.label}
              </button>
            ))}
          </div>

          {/* ═══ MOBILE LAYOUT (< lg) ═══ */}
          <div className="lg:hidden">
            <AnimatePresence mode="wait">
              {mobileTab === "vote" && (
                <motion.div key="vote" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <ActiveVotePanel />
                </motion.div>
              )}
              {mobileTab === "daily" && (
                <motion.div key="daily" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <DailyMicroVotes />
                </motion.div>
              )}
              {mobileTab === "chronicle" && (
                <motion.div key="chronicle" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <ChroniclePanel />
                </motion.div>
              )}
              {mobileTab === "pulse" && (
                <motion.div key="pulse" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <PulsePanel />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ═══ DESKTOP LAYOUT (lg+) — 3-column grid ═══ */}
          <div className="hidden lg:grid lg:grid-cols-[280px_1fr_260px] gap-4">
            {/* LEFT — Chronicle */}
            <div>
              <ChroniclePanel />
            </div>

            {/* CENTER — Active Vote + Daily */}
            <div>
              <ActiveVotePanel />
              <DailyMicroVotes />
            </div>

            {/* RIGHT — Pulse */}
            <div>
              <PulsePanel />
            </div>
          </div>

          {/* ═══ FOOTER — Upcoming Events (always visible) ═══ */}
          <UpcomingEventsBar />
        </div>
      </div>
    </AtmosphereScope>
  );
}
