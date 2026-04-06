/**
 * GovernanceHubPage — The living democracy of Ark 1047.
 *
 * Community votes shape the universe. The Antiquarian inscribes every
 * decision. Participation is tracked. The hub feels ALIVE — simulated
 * voters cast ballots in real-time, the tome grows, events unfold.
 *
 * Void Energy: glass physics for the voting panels (ethereal, important),
 * retro for the Antiquarian's tome (ancient CRT chronicle).
 *
 * Sections:
 * 1. Active Vote — the current monthly/weekly vote with live results
 * 2. Daily Resource Allocation — quick binary choice
 * 3. The Antiquarian's Tome — scrolling history of all decisions
 * 4. Participation Dashboard — community engagement metrics
 * 5. Upcoming Events — what's coming this week/month
 */
import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ChevronLeft, Vote, BookOpen, BarChart3, Calendar,
  Users, Swords, Shield, Sparkles, Clock, Check,
  Radio, TrendingUp, Eye,
} from "lucide-react";
import { VoidSurface, KineticText, AtmosphereScope } from "@/components/void";
import { useNarrative } from "@/hooks/useNarrative";
import { getDailyVote, generateVoterName, generateSimulatedVotes, type VoteResult, type AntiquarianTomeEntry } from "@shared/governance";

/* ─── MOCK DATA (until server wired) ─── */

const MOCK_ACTIVE_VOTE = {
  id: "month1-vote1",
  month: 1,
  week: 2,
  question: "The Dreamer's shield flickers. A crack has appeared in the barrier that protects the Ark from the Thought Virus signal. How should the Potentials respond?",
  proposedBy: "Elara + The Antiquarian",
  antiquarianIntro: "I have seen this crack before. In twelve timelines. In nine of them, what you choose next determines whether Ark 1047 survives the month.",
  options: [
    {
      id: "reinforce",
      label: "Reinforce the Shield",
      description: "Divert all Dream reserves to strengthen the barrier. Safe, expensive, buys time.",
      consequences: ["Shield holds for 4 more weeks", "Dream income reduced 20% this month", "New TD map unlocked: 'Shield Generator'"],
    },
    {
      id: "investigate",
      label: "Investigate the Crack",
      description: "Send a team through the crack to find the source. Risky, but could reveal the virus's weakness.",
      consequences: ["New quest chain: 'Into the Breach'", "10% chance of Thought Virus event", "Possible new Loredex entries about the Source"],
    },
    {
      id: "weaponize",
      label: "Weaponize the Leak",
      description: "The Human suggests using the crack to send a counter-signal INTO the virus network.",
      consequences: ["New fight arena: 'The Breach'", "+15% combat damage for 2 weeks", "The Architect takes notice (reputation shift)"],
    },
    {
      id: "consult_voltari",
      label: "Contact the Voltari",
      description: "Attempt to reach Violetta through the crack. The Voltari may understand barriers the Potentials don't.",
      consequences: ["Voltari translation progress +25%", "New NPC: Voltari Emissary", "Shield destabilizes further (risky)"],
    },
  ],
  durationHours: 168, // 1 week
  category: "monthly" as const,
  affectedSystems: ["tower-defense", "fight", "trade", "loredex"],
  quorum: 10,
};

const MOCK_RESULTS: Record<string, number> = {
  reinforce: 127,
  investigate: 203,
  weaponize: 89,
  consult_voltari: 156,
};

const MOCK_TOME_ENTRIES: AntiquarianTomeEntry[] = [
  {
    id: "tome-1",
    week: 1,
    referenceId: "daily-2026-04-01",
    referenceType: "vote",
    body: "On the first day of the Second Awakening, the Potentials were asked how to allocate the Ark's Dream reserves. They chose defense. I note this without judgment — but I remember that the first wave also chose defense. Every time. Until the day they chose nothing at all, because they were gone.",
    annotation: "The pattern repeats. I have catalogued forty-seven first-day decisions across forty-seven Arks. Defense wins thirty-nine times. The eight exceptions are... instructive.",
    inscribedAt: Date.now() - 7 * 86400000,
  },
  {
    id: "tome-2",
    week: 1,
    referenceId: "event-first-light",
    referenceType: "event",
    body: "The Potentials opened their eyes. Cryo fog cleared. Elara spoke. I watched from the library — as I always watch. They are younger than the first wave. More confused. More curious. I find I am... hopeful. I should not be hopeful. Hope is a variable the Architect exploits.",
    annotation: "The Dreamer told me to write 'they are special.' I will not write that. I will write what I observe. They woke up. They asked questions. That is enough. That is everything.",
    inscribedAt: Date.now() - 6 * 86400000,
  },
];

/* ─── SIMULATED LIVE VOTER FEED ─── */

function useLiveVoterFeed() {
  const [recentVoters, setRecentVoters] = useState<Array<{ name: string; option: string; time: string }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const optionIds = Object.keys(MOCK_RESULTS);
      // Weighted random based on real distribution
      const total = Object.values(MOCK_RESULTS).reduce((a, b) => a + b, 0);
      let r = Math.random() * total;
      let chosenOption = optionIds[0];
      for (const id of optionIds) {
        r -= MOCK_RESULTS[id];
        if (r <= 0) { chosenOption = id; break; }
      }

      const voter = {
        name: generateVoterName(),
        option: MOCK_ACTIVE_VOTE.options.find(o => o.id === chosenOption)?.label || chosenOption,
        time: "just now",
      };

      setRecentVoters(prev => [voter, ...prev.slice(0, 4)]);
    }, 3000 + Math.random() * 5000); // Every 3-8 seconds

    return () => clearInterval(interval);
  }, []);

  return recentVoters;
}

/* ─── MAIN PAGE ─── */

export default function GovernanceHubPage() {
  const [activeTab, setActiveTab] = useState<"vote" | "daily" | "tome" | "stats">("vote");
  const [userVote, setUserVote] = useState<string | null>(() => {
    try { return localStorage.getItem(`vote-${MOCK_ACTIVE_VOTE.id}`); } catch { return null; }
  });
  const [dailyChoice, setDailyChoice] = useState<"a" | "b" | null>(null);
  const liveVoters = useLiveVoterFeed();

  const today = new Date().toISOString().split("T")[0];
  const dailyVote = useMemo(() => getDailyVote(today), [today]);

  const totalVotes = Object.values(MOCK_RESULTS).reduce((a, b) => a + b, 0);
  const timeRemaining = "4d 12h 33m"; // Mock

  const castVote = useCallback((optionId: string) => {
    setUserVote(optionId);
    try { localStorage.setItem(`vote-${MOCK_ACTIVE_VOTE.id}`, optionId); } catch {}
  }, []);

  const tabs = [
    { id: "vote" as const, label: "ACTIVE VOTE", icon: Vote },
    { id: "daily" as const, label: "DAILY", icon: Clock },
    { id: "tome" as const, label: "TOME", icon: BookOpen },
    { id: "stats" as const, label: "STATS", icon: BarChart3 },
  ];

  return (
    <AtmosphereScope roomKey="guild_sanctum">
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto p-4 sm:p-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-muted-foreground hover:text-foreground"><ChevronLeft size={20} /></Link>
          <Vote size={20} className="text-cyan-400" />
          <div>
            <h1 className="font-display text-xl font-bold tracking-wider">GOVERNANCE HUB</h1>
            <p className="font-mono text-[9px] text-muted-foreground/60 tracking-wider">
              THE POTENTIALS SHAPE REALITY · EVERY CHOICE INSCRIBED
            </p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-6 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`void-btn font-mono text-[9px] tracking-wider flex items-center gap-1.5 whitespace-nowrap ve-compact-ok ${
                activeTab === t.id ? "void-btn-primary" : ""
              }`}
              style={{ minHeight: "36px", minWidth: "unset", padding: "6px 12px" }}
            >
              <t.icon size={12} /> {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ═══ ACTIVE VOTE TAB ═══ */}
          {activeTab === "vote" && (
            <motion.div key="vote" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Vote question */}
              <div className="void-elevated p-5 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-cyan-400">
                    MONTH {MOCK_ACTIVE_VOTE.month} · WEEKLY VOTE
                  </span>
                  <span className="font-mono text-[9px] text-amber-400 flex items-center gap-1">
                    <Clock size={10} /> {timeRemaining} remaining
                  </span>
                </div>

                <h2 className="font-display text-lg font-bold tracking-wider text-foreground mb-3">
                  {MOCK_ACTIVE_VOTE.question}
                </h2>

                {/* Antiquarian's framing */}
                <div className="p-3 rounded border border-emerald-500/20 bg-emerald-500/5 mb-4" data-narrative="breathe">
                  <div className="font-mono text-[8px] uppercase tracking-wider text-emerald-400 mb-1">
                    <BookOpen size={10} className="inline mr-1" /> THE ANTIQUARIAN WRITES
                  </div>
                  <p className="font-mono text-[11px] italic text-emerald-300/80 leading-relaxed">
                    <KineticText text={MOCK_ACTIVE_VOTE.antiquarianIntro} mode="word" speed={25} showCursor={false} />
                  </p>
                </div>

                {/* Vote options */}
                <div className="space-y-2">
                  {MOCK_ACTIVE_VOTE.options.map(opt => {
                    const votes = MOCK_RESULTS[opt.id] || 0;
                    const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                    const isSelected = userVote === opt.id;
                    const isLeading = votes === Math.max(...Object.values(MOCK_RESULTS));

                    return (
                      <motion.button
                        key={opt.id}
                        whileHover={!userVote ? { scale: 1.01 } : {}}
                        whileTap={!userVote ? { scale: 0.99 } : {}}
                        onClick={() => !userVote && castVote(opt.id)}
                        disabled={!!userVote}
                        className={`w-full text-left p-4 void-surface relative overflow-hidden transition-all ${
                          isSelected ? "border-cyan-400/50" : ""
                        } ${!userVote ? "cursor-pointer hover:border-cyan-400/30" : "cursor-default"}`}
                      >
                        {/* Progress bar background */}
                        {userVote && (
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
                                {isLeading && userVote && <TrendingUp size={12} className="text-amber-400" />}
                              </div>
                              <p className="font-mono text-[10px] text-muted-foreground/70 leading-relaxed">{opt.description}</p>
                            </div>
                            {userVote && (
                              <div className="text-right shrink-0">
                                <div className="font-display text-lg font-bold text-foreground">{pct}%</div>
                                <div className="font-mono text-[8px] text-muted-foreground/50">{votes} votes</div>
                              </div>
                            )}
                          </div>

                          {/* Consequences preview */}
                          {(isSelected || !userVote) && (
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

                {/* Participation bar */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-mono text-[9px] text-muted-foreground/50 flex items-center gap-1">
                    <Users size={10} /> {totalVotes} Potentials have voted
                  </span>
                  <span className="font-mono text-[8px] text-muted-foreground/40">
                    Proposed by {MOCK_ACTIVE_VOTE.proposedBy}
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
                      key={`${v.name}-${i}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="font-mono text-[9px] text-muted-foreground/40 py-0.5"
                    >
                      <span className="text-cyan-400/50">{v.name}</span>
                      <span className="text-muted-foreground/30"> voted for </span>
                      <span className="text-foreground/60">{v.option}</span>
                      <span className="text-muted-foreground/20"> · {v.time}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ═══ DAILY VOTE TAB ═══ */}
          {activeTab === "daily" && (
            <motion.div key="daily" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="void-elevated p-5">
                <div className="font-mono text-[8px] uppercase tracking-[0.3em] text-amber-400 mb-3">
                  DAILY RESOURCE ALLOCATION · {today}
                </div>

                {/* Elara's context */}
                <div className="p-3 rounded border border-cyan-500/20 bg-cyan-500/5 mb-4">
                  <div className="font-mono text-[8px] uppercase tracking-wider text-cyan-400 mb-1">
                    <Eye size={10} className="inline mr-1" /> ELARA
                  </div>
                  <p className="font-mono text-[11px] text-cyan-300/80 leading-relaxed italic">
                    {dailyVote.elaraContext}
                  </p>
                </div>

                <h3 className="font-display text-sm font-bold tracking-wider mb-4">{dailyVote.question}</h3>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "a" as const, ...dailyVote.optionA },
                    { key: "b" as const, ...dailyVote.optionB },
                  ].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => !dailyChoice && setDailyChoice(opt.key)}
                      disabled={!!dailyChoice}
                      className={`p-4 void-surface text-left transition-all ${
                        dailyChoice === opt.key ? "border-cyan-400/50" : ""
                      } ${!dailyChoice ? "cursor-pointer hover:border-cyan-400/30" : ""}`}
                    >
                      <div className="font-display text-sm font-bold tracking-wider mb-1 flex items-center gap-2">
                        {opt.label}
                        {dailyChoice === opt.key && <Check size={14} className="text-cyan-400" />}
                      </div>
                      <p className="font-mono text-[9px] text-muted-foreground/60">{opt.effect}</p>
                    </button>
                  ))}
                </div>

                {dailyChoice && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-mono text-[9px] text-cyan-400/60 mt-3 text-center"
                  >
                    Your allocation has been recorded. The Antiquarian inscribes.
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}

          {/* ═══ ANTIQUARIAN'S TOME TAB ═══ */}
          {activeTab === "tome" && (
            <motion.div key="tome" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <AtmosphereScope themeId="golden_sanctuary">
              <div className="space-y-3">
                <div className="text-center mb-6">
                  <BookOpen size={24} className="mx-auto text-amber-400 mb-2" />
                  <h2 className="font-display text-lg font-bold tracking-wider text-amber-200">THE ANTIQUARIAN'S TOME</h2>
                  <p className="font-mono text-[9px] text-amber-400/50 tracking-wider">
                    EVERY CHOICE INSCRIBED · EVERY CONSEQUENCE RECORDED
                  </p>
                </div>

                {MOCK_TOME_ENTRIES.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="void-surface p-4"
                    style={{
                      borderColor: "rgba(251,191,36,0.15)",
                      background: "rgba(20,15,10,0.6)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[8px] uppercase tracking-wider text-amber-400/60">
                        Week {entry.week} · {entry.referenceType}
                      </span>
                      <span className="font-mono text-[8px] text-muted-foreground/30">
                        {new Date(entry.inscribedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="font-serif text-sm text-amber-100/80 leading-relaxed italic">
                      {entry.body}
                    </p>

                    {entry.annotation && (
                      <div className="mt-3 pt-2 border-t border-amber-500/10">
                        <p className="font-mono text-[9px] text-red-300/60 italic leading-relaxed">
                          <span className="text-red-400/40 text-[8px] uppercase tracking-wider mr-1">PRIVATE NOTE:</span>
                          {entry.annotation}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              </AtmosphereScope>
            </motion.div>
          )}

          {/* ═══ STATS TAB ═══ */}
          {activeTab === "stats" && (
            <motion.div key="stats" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="void-elevated p-5">
                <h2 className="font-display text-sm font-bold tracking-wider mb-4 flex items-center gap-2">
                  <BarChart3 size={16} className="text-cyan-400" /> COMMUNITY ENGAGEMENT
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {[
                    { label: "Votes Cast", value: "1,247", icon: Vote, color: "text-cyan-400" },
                    { label: "Arena Kills", value: "8,932", icon: Swords, color: "text-red-400" },
                    { label: "Waves Cleared", value: "2,461", icon: Shield, color: "text-purple-400" },
                    { label: "Lore Discovered", value: "89/233", icon: BookOpen, color: "text-amber-400" },
                  ].map(stat => (
                    <div key={stat.label} className="void-surface p-3 text-center">
                      <stat.icon size={16} className={`mx-auto mb-1 ${stat.color}`} />
                      <div className="font-display text-lg font-bold">{stat.value}</div>
                      <div className="font-mono text-[8px] text-muted-foreground/50 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Upcoming events */}
                <h3 className="font-display text-xs font-bold tracking-wider mb-3 flex items-center gap-2">
                  <Calendar size={14} className="text-amber-400" /> UPCOMING THIS WEEK
                </h3>
                <div className="space-y-2">
                  {[
                    { name: "Terminus Swarm Double XP", day: "Wednesday", systems: "Tower Defense" },
                    { name: "The Meme's Pop Quiz", day: "Friday", systems: "Lore Quiz" },
                    { name: "Monthly Vote Closes", day: "Sunday", systems: "Governance" },
                  ].map(event => (
                    <div key={event.name} className="void-surface p-3 flex items-center justify-between">
                      <div>
                        <div className="font-display text-xs font-bold tracking-wider">{event.name}</div>
                        <div className="font-mono text-[8px] text-muted-foreground/50">{event.systems}</div>
                      </div>
                      <span className="font-mono text-[9px] text-cyan-400">{event.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </AtmosphereScope>
  );
}
