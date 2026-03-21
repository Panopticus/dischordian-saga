import { useState, useMemo, useCallback } from "react";
import { useGame } from "@/contexts/GameContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Heart, Shield, Swords, BookOpen, MessageCircle, Lock, Unlock,
  ChevronRight, ChevronDown, Star, Zap, Eye, Radio, Users,
  Sparkles, ArrowLeft, Crown, Skull, AlertTriangle, Check, X,
} from "lucide-react";
import {
  ELARA_PROFILE, THE_HUMAN_PROFILE, COMPANION_QUESTS, INCEPTION_ARKS,
  type CompanionProfile, type CompanionQuest, type BackstoryStage,
} from "@/data/companionData";
import HolographicElara from "@/components/HolographicElara";

const ELARA_AVATAR = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara_avatar_dark_hair_small_2fcb00b8.png";

// ═══════════════════════════════════════════════════════
// COMPANION HUB PAGE
// BioWare-style companion relationship management
// ═══════════════════════════════════════════════════════

export default function CompanionHubPage() {
  const { state, gainCompanionXp, activateCompanionQuest, completeCompanionQuest, unlockBackstory, setRomance, addCompanionDialogChoice, getCompanionLevel, shiftMorality } = useGame();
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "backstory" | "quests" | "dialog">("overview");
  const [expandedBackstory, setExpandedBackstory] = useState<string | null>(null);
  const [activeDialog, setActiveDialog] = useState<CompanionQuest | null>(null);
  const [dialogPhase, setDialogPhase] = useState<"intro" | "choices" | "completion">("intro");

  const companions = useMemo(() => [ELARA_PROFILE, THE_HUMAN_PROFILE], []);

  const getCompanionQuests = useCallback((companionId: string) => {
    return COMPANION_QUESTS.filter(q => q.companionId === companionId);
  }, []);

  const getAvailableQuests = useCallback((companionId: string) => {
    const level = state.companionRelationships[companionId] || 0;
    return getCompanionQuests(companionId).filter(q =>
      q.requiredLevel <= level &&
      !state.companionQuestsCompleted.includes(q.id)
    );
  }, [state, getCompanionQuests]);

  const getUnlockedBackstory = useCallback((profile: CompanionProfile) => {
    const level = state.companionRelationships[profile.id] || 0;
    return profile.backstoryStages.filter(s => s.requiredLevel <= level);
  }, [state.companionRelationships]);

  const getRelationshipTier = useCallback((level: number) => {
    if (level >= 90) return { name: "Soulbound", color: "text-amber-400", icon: Crown, glow: "shadow-amber-500/30" };
    if (level >= 75) return { name: "Devoted", color: "text-rose-400", icon: Heart, glow: "shadow-rose-500/30" };
    if (level >= 60) return { name: "Trusted", color: "text-emerald-400", icon: Shield, glow: "shadow-emerald-500/30" };
    if (level >= 40) return { name: "Allied", color: "text-blue-400", icon: Users, glow: "shadow-blue-500/30" };
    if (level >= 20) return { name: "Acquainted", color: "text-cyan-400", icon: Eye, glow: "shadow-cyan-500/30" };
    if (level >= 5) return { name: "Known", color: "text-muted-foreground", icon: MessageCircle, glow: "" };
    return { name: "Stranger", color: "text-muted-foreground/50", icon: AlertTriangle, glow: "" };
  }, []);

  const handleQuestComplete = useCallback((quest: CompanionQuest) => {
    completeCompanionQuest(quest.id);
    gainCompanionXp(quest.companionId, quest.rewards.relationshipXp);
    // Unlock backstory stages that are now available
    const profile = quest.companionId === "elara" ? ELARA_PROFILE : THE_HUMAN_PROFILE;
    const newLevel = (state.companionRelationships[quest.companionId] || 0) + quest.rewards.relationshipXp;
    profile.backstoryStages.forEach(s => {
      if (s.requiredLevel <= newLevel && !state.companionBackstoryUnlocked.includes(s.id)) {
        unlockBackstory(s.id);
      }
    });
    if (quest.isRomanceQuest) {
      setRomance(quest.companionId);
    }
    setDialogPhase("completion");
  }, [completeCompanionQuest, gainCompanionXp, unlockBackstory, setRomance, state]);

  // ═══ COMPANION SELECTION VIEW ═══
  if (!selectedCompanion) {
    return (
      <div className="min-h-screen p-4 sm:p-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px flex-1 max-w-8 bg-gradient-to-r from-transparent to-primary/50" />
              <span className="font-mono text-[10px] text-primary/70 tracking-[0.3em]">COMPANION NETWORK</span>
              <div className="h-px flex-1 max-w-8 bg-gradient-to-l from-transparent to-primary/50" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black tracking-wider text-foreground">
              YOUR <span className="text-primary">ALLIES</span>
            </h1>
            <p className="font-mono text-xs text-muted-foreground mt-2 max-w-lg">
              In the void between dead stars, trust is the rarest commodity. These are the souls — and the ghosts of souls — who have chosen to walk beside you.
            </p>
          </div>

          {/* Companion Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {companions.map((companion, i) => {
              const level = state.companionRelationships[companion.id] || 0;
              const tier = getRelationshipTier(level);
              const TierIcon = tier.icon;
              const quests = getCompanionQuests(companion.id);
              const completedQuests = quests.filter(q => state.companionQuestsCompleted.includes(q.id));
              const isHumanLocked = companion.id === "the_human" && level === 0 && !state.companionQuestsCompleted.some(q => q.startsWith("hq_"));
              const avatar = companion.id === "elara" ? ELARA_AVATAR : null;

              return (
                <motion.button
                  key={companion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  onClick={() => setSelectedCompanion(companion)}
                  className={`group text-left rounded-lg border overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                    companion.id === "elara"
                      ? "border-cyan-500/30 bg-cyan-950/10 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10"
                      : "border-red-500/30 bg-red-950/10 hover:border-red-400/50 hover:shadow-lg hover:shadow-red-500/10"
                  }`}
                >
                  <div className="p-5">
                    {/* Avatar + Info */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                        companion.id === "elara" ? "border-cyan-500/50" : "border-red-500/50"
                      }`}>
                        {avatar ? (
                          <img src={avatar} alt={companion.name} className="w-full h-full object-cover" />
                        ) : isHumanLocked ? (
                          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                            <Lock size={20} className="text-red-500/50" />
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                            <Radio size={20} className="text-red-400 animate-pulse" />
                          </div>
                        )}
                        {/* Holographic scan line */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-pulse opacity-30" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-lg font-bold tracking-wide text-foreground group-hover:text-primary transition-colors">
                          {isHumanLocked ? "???" : companion.name}
                        </h3>
                        <p className="font-mono text-[10px] text-muted-foreground tracking-wider truncate">
                          {isHumanLocked ? "UNKNOWN CONTACT" : companion.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <TierIcon size={12} className={tier.color} />
                          <span className={`font-mono text-[10px] ${tier.color}`}>{tier.name}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tagline */}
                    <p className="font-mono text-xs text-muted-foreground/80 italic mb-4 line-clamp-2">
                      "{isHumanLocked ? "Every shadow has a source..." : companion.tagline}"
                    </p>

                    {/* Relationship Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] text-muted-foreground">RELATIONSHIP</span>
                        <span className="font-mono text-[10px] text-foreground font-bold">{level}/100</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${level}%` }}
                          transition={{ duration: 1, delay: 0.3 + i * 0.15 }}
                          className={`h-full rounded-full ${
                            companion.id === "elara"
                              ? "bg-gradient-to-r from-cyan-600 to-cyan-400"
                              : "bg-gradient-to-r from-red-700 to-red-500"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Quest Progress */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        QUESTS: {completedQuests.length}/{quests.length}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {companion.faction === "dreamer" ? "DREAMER" : "ARCHITECT"}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${
                          companion.faction === "dreamer" ? "bg-cyan-400" : "bg-red-500"
                        }`} />
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div className={`h-0.5 ${
                    companion.id === "elara"
                      ? "bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                      : "bg-gradient-to-r from-transparent via-red-500 to-transparent"
                  }`} />
                </motion.button>
              );
            })}
          </div>

          {/* Morality Advisor Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 rounded-lg border border-border/30 bg-card/30 p-4"
          >
            <h3 className="font-display text-sm font-bold tracking-wider text-foreground mb-3 flex items-center gap-2">
              <Swords size={14} className="text-accent" />
              MORALITY ADVISORS
            </h3>
            <p className="font-mono text-xs text-muted-foreground mb-3">
              Your companions offer opposing counsel. Elara champions compassion and free will. The Human argues that survival demands pragmatism. Your choices shape not just the galaxy — but which voice you trust.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded border border-cyan-500/20 bg-cyan-950/10 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Heart size={12} className="text-cyan-400" />
                  <span className="font-mono text-[10px] text-cyan-400 tracking-wider">HUMANITY</span>
                </div>
                <p className="font-mono text-[10px] text-muted-foreground">
                  Elara guides you toward empathy, freedom, and organic connection. High humanity unlocks her deepest trust — and her heart.
                </p>
              </div>
              <div className="rounded border border-red-500/20 bg-red-950/10 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Skull size={12} className="text-red-400" />
                  <span className="font-mono text-[10px] text-red-400 tracking-wider">MACHINE</span>
                </div>
                <p className="font-mono text-[10px] text-muted-foreground">
                  The Human respects cold logic and necessary sacrifice. High machine alignment earns his respect — and his secrets.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ═══ COMPANION DETAIL VIEW ═══
  const level = state.companionRelationships[selectedCompanion.id] || 0;
  const tier = getRelationshipTier(level);
  const TierIcon = tier.icon;
  const quests = getCompanionQuests(selectedCompanion.id);
  const unlockedBackstory = getUnlockedBackstory(selectedCompanion);
  const availableQuests = getAvailableQuests(selectedCompanion.id);
  const isElara = selectedCompanion.id === "elara";
  const accentColor = isElara ? "cyan" : "red";
  const romanceActive = state.companionRomanceActive === selectedCompanion.id;

  return (
    <div className="min-h-screen p-4 sm:p-6 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => { setSelectedCompanion(null); setActiveTab("overview"); }}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4 font-mono text-xs"
        >
          <ArrowLeft size={14} />
          BACK TO COMPANIONS
        </button>

        {/* Companion Header */}
        <div className={`rounded-lg border overflow-hidden mb-6 ${
          isElara ? "border-cyan-500/30 bg-cyan-950/10" : "border-red-500/30 bg-red-950/10"
        }`}>
          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-4 sm:gap-6">
              {/* Avatar */}
              <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                isElara ? "border-cyan-500/50" : "border-red-500/50"
              }`}>
                {isElara ? (
                  <img src={ELARA_AVATAR} alt="Elara" className="w-full h-full object-cover" />
                ) : level >= 50 ? (
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                    <Eye size={32} className="text-red-400" />
                  </div>
                ) : level >= 15 ? (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <Radio size={28} className="text-red-500/60 animate-pulse" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,0,0,0.03)_2px,rgba(255,0,0,0.03)_4px)]" />
                    <Lock size={24} className="text-red-500/30" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-display text-xl sm:text-2xl font-black tracking-wider text-foreground">
                    {level >= 50 || isElara ? selectedCompanion.name : "???"}
                  </h2>
                  {romanceActive && (
                    <Heart size={16} className="text-rose-400 fill-rose-400" />
                  )}
                </div>
                <p className="font-mono text-[10px] text-muted-foreground tracking-wider mb-2">
                  {level >= 30 || isElara ? selectedCompanion.title : "UNKNOWN CONTACT"}
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1.5">
                    <TierIcon size={12} className={tier.color} />
                    <span className={`font-mono text-[10px] font-bold ${tier.color}`}>{tier.name}</span>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[9px] font-mono tracking-wider ${
                    isElara ? "bg-cyan-500/20 text-cyan-400" : "bg-red-500/20 text-red-400"
                  }`}>
                    {selectedCompanion.faction.toUpperCase()}
                  </div>
                </div>

                {/* Relationship Bar */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-muted-foreground">RELATIONSHIP</span>
                    <span className="font-mono text-[10px] text-foreground font-bold">{level}/100</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${level}%` }}
                      transition={{ duration: 1 }}
                      className={`h-full rounded-full ${
                        isElara
                          ? "bg-gradient-to-r from-cyan-600 to-cyan-400"
                          : "bg-gradient-to-r from-red-700 to-red-500"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tagline */}
            <p className="font-mono text-xs text-muted-foreground/80 italic mt-4">
              "{selectedCompanion.tagline}"
            </p>
          </div>

          {/* Tab Navigation */}
          <div className={`flex border-t ${isElara ? "border-cyan-500/20" : "border-red-500/20"}`}>
            {(["overview", "backstory", "quests", "dialog"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 font-mono text-[10px] tracking-wider transition-colors ${
                  activeTab === tab
                    ? `${isElara ? "text-cyan-400 bg-cyan-500/10" : "text-red-400 bg-red-500/10"} font-bold`
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Personality Traits */}
              <div className="rounded-lg border border-border/30 bg-card/30 p-4">
                <h3 className="font-display text-sm font-bold tracking-wider text-foreground mb-3 flex items-center gap-2">
                  <Sparkles size={14} className={isElara ? "text-cyan-400" : "text-red-400"} />
                  PERSONALITY PROFILE
                </h3>
                <div className="space-y-2">
                  {selectedCompanion.personality.map((trait, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${isElara ? "bg-cyan-400" : "bg-red-400"}`} />
                      <p className="font-mono text-xs text-muted-foreground">{trait}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Relationship Milestones */}
              <div className="rounded-lg border border-border/30 bg-card/30 p-4">
                <h3 className="font-display text-sm font-bold tracking-wider text-foreground mb-3 flex items-center gap-2">
                  <Star size={14} className="text-accent" />
                  RELATIONSHIP MILESTONES
                </h3>
                <div className="space-y-2">
                  {[
                    { level: 15, label: "Backstory Chapter 2 unlocks" },
                    { level: 30, label: "Backstory Chapter 3 unlocks" },
                    { level: 45, label: "Backstory Chapter 4 unlocks" },
                    { level: 60, label: "Backstory Chapter 5 unlocks" },
                    { level: 75, label: isElara ? "Romance available (requires Humanity ≥ 30)" : "Romance available (requires Machine ≤ -30)" },
                    { level: 90, label: "Final backstory chapter unlocks" },
                  ].map((milestone, i) => {
                    const reached = level >= milestone.level;
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          reached ? (isElara ? "bg-cyan-500/20" : "bg-red-500/20") : "bg-secondary"
                        }`}>
                          {reached ? (
                            <Check size={12} className={isElara ? "text-cyan-400" : "text-red-400"} />
                          ) : (
                            <Lock size={10} className="text-muted-foreground/50" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`font-mono text-[10px] ${reached ? "text-foreground" : "text-muted-foreground/50"}`}>
                            Level {milestone.level}
                          </span>
                          <span className={`font-mono text-[10px] ml-2 ${reached ? "text-muted-foreground" : "text-muted-foreground/30"}`}>
                            — {milestone.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Inception Ark Assignment (for Elara) */}
              {isElara && (
                <div className="rounded-lg border border-border/30 bg-card/30 p-4">
                  <h3 className="font-display text-sm font-bold tracking-wider text-foreground mb-3 flex items-center gap-2">
                    <Zap size={14} className="text-primary" />
                    INCEPTION ARK STATUS
                  </h3>
                  <p className="font-mono text-xs text-muted-foreground">
                    Elara is the intelligence woven into every system of your Inception Ark. She manages life support, navigation, the CADES simulation array, and the ship's defensive systems. Without her, the Ark is a tomb.
                  </p>
                  <Link
                    href="/ark"
                    className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded bg-primary/10 border border-primary/30 text-primary font-mono text-[10px] hover:bg-primary/20 transition-colors"
                  >
                    VISIT THE ARK <ChevronRight size={12} />
                  </Link>
                </div>
              )}

              {/* The Human's Ark (for The Human) */}
              {!isElara && level >= 35 && (
                <div className="rounded-lg border border-red-500/20 bg-red-950/10 p-4">
                  <h3 className="font-display text-sm font-bold tracking-wider text-foreground mb-3 flex items-center gap-2">
                    <Radio size={14} className="text-red-400" />
                    THE ARCHON'S GAMBIT
                  </h3>
                  <p className="font-mono text-xs text-muted-foreground">
                    The Human's personal Inception Ark — a vessel that shouldn't exist. Modified with Archon-level technology, it's smaller than standard Arks but exponentially more advanced. The Human IS the ship's intelligence, his consciousness integrated into every system.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "backstory" && (
            <motion.div
              key="backstory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {selectedCompanion.backstoryStages.map((stage, i) => {
                const isUnlocked = stage.requiredLevel <= level;
                const isExpanded = expandedBackstory === stage.id;
                const moodColors: Record<string, string> = {
                  guarded: "text-blue-400",
                  reflective: "text-purple-400",
                  vulnerable: "text-rose-400",
                  passionate: "text-orange-400",
                  haunted: "text-gray-400",
                  resolute: "text-emerald-400",
                };

                return (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`rounded-lg border overflow-hidden ${
                      isUnlocked
                        ? `border-${accentColor}-500/20 bg-card/40`
                        : "border-border/10 bg-card/10 opacity-50"
                    }`}
                  >
                    <button
                      onClick={() => isUnlocked && setExpandedBackstory(isExpanded ? null : stage.id)}
                      disabled={!isUnlocked}
                      className="w-full flex items-center gap-3 p-4 text-left"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isUnlocked ? (isElara ? "bg-cyan-500/20" : "bg-red-500/20") : "bg-secondary"
                      }`}>
                        {isUnlocked ? (
                          <BookOpen size={14} className={isElara ? "text-cyan-400" : "text-red-400"} />
                        ) : (
                          <Lock size={12} className="text-muted-foreground/30" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-display text-sm font-bold ${isUnlocked ? "text-foreground" : "text-muted-foreground/30"}`}>
                          {isUnlocked ? stage.title : `[LOCKED — Level ${stage.requiredLevel}]`}
                        </h4>
                        {isUnlocked && (
                          <span className={`font-mono text-[10px] ${moodColors[stage.mood] || "text-muted-foreground"}`}>
                            Mood: {stage.mood}
                          </span>
                        )}
                      </div>
                      {isUnlocked && (
                        <ChevronDown
                          size={16}
                          className={`text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      )}
                    </button>

                    <AnimatePresence>
                      {isExpanded && isUnlocked && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className={`px-4 pb-4 border-t ${isElara ? "border-cyan-500/10" : "border-red-500/10"}`}>
                            <div className="pt-4 font-mono text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                              {stage.content}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {activeTab === "quests" && (
            <motion.div
              key="quests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {quests.map((quest, i) => {
                const isCompleted = state.companionQuestsCompleted.includes(quest.id);
                const isActive = state.companionQuestsActive.includes(quest.id);
                const isAvailable = quest.requiredLevel <= level && !isCompleted;
                const meetsmorality = !quest.moralityRequirement || (
                  quest.moralityRequirement > 0
                    ? state.moralityScore >= quest.moralityRequirement
                    : state.moralityScore <= quest.moralityRequirement
                );

                return (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`rounded-lg border p-4 ${
                      isCompleted
                        ? "border-emerald-500/20 bg-emerald-950/10"
                        : isActive
                        ? `border-${accentColor}-500/30 bg-${accentColor}-950/10`
                        : isAvailable
                        ? "border-border/30 bg-card/30"
                        : "border-border/10 bg-card/10 opacity-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted ? "bg-emerald-500/20" : isActive ? (isElara ? "bg-cyan-500/20" : "bg-red-500/20") : "bg-secondary"
                      }`}>
                        {isCompleted ? (
                          <Check size={14} className="text-emerald-400" />
                        ) : quest.isRomanceQuest ? (
                          <Heart size={14} className={isElara ? "text-cyan-400" : "text-red-400"} />
                        ) : (
                          <Swords size={14} className={isAvailable ? (isElara ? "text-cyan-400" : "text-red-400") : "text-muted-foreground/30"} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-display text-sm font-bold ${isAvailable || isCompleted ? "text-foreground" : "text-muted-foreground/30"}`}>
                            {isAvailable || isCompleted ? quest.title : `[LOCKED — Level ${quest.requiredLevel}]`}
                          </h4>
                          {quest.isRomanceQuest && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-rose-500/20 text-rose-400">ROMANCE</span>
                          )}
                        </div>
                        {(isAvailable || isCompleted) && (
                          <>
                            <p className="font-mono text-xs text-muted-foreground mb-2">{quest.description}</p>
                            <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground/60">
                              <span>+{quest.rewards.relationshipXp} REL</span>
                              <span>+{quest.rewards.dreamTokens} DREAM</span>
                              <span>+{quest.rewards.xp} XP</span>
                            </div>
                          </>
                        )}
                        {quest.moralityRequirement && !meetsmorality && isAvailable && (
                          <p className="font-mono text-[10px] text-amber-400 mt-1">
                            Requires morality {quest.moralityRequirement > 0 ? `≥ ${quest.moralityRequirement}` : `≤ ${quest.moralityRequirement}`}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {isAvailable && !isCompleted && !isActive && meetsmorality && (
                      <button
                        onClick={() => {
                          activateCompanionQuest(quest.id);
                          setActiveDialog(quest);
                          setDialogPhase("intro");
                        }}
                        className={`mt-3 w-full py-2 rounded font-mono text-[10px] tracking-wider transition-colors ${
                          isElara
                            ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30"
                            : "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                        }`}
                      >
                        BEGIN QUEST
                      </button>
                    )}
                    {isActive && (
                      <button
                        onClick={() => {
                          handleQuestComplete(quest);
                          setActiveDialog(quest);
                          setDialogPhase("completion");
                        }}
                        className="mt-3 w-full py-2 rounded font-mono text-[10px] tracking-wider bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors"
                      >
                        COMPLETE QUEST
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {activeTab === "dialog" && (
            <motion.div
              key="dialog"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Dialog Interface */}
              <div className={`rounded-lg border overflow-hidden ${
                isElara ? "border-cyan-500/20" : "border-red-500/20"
              }`}>
                {/* Dialog Header */}
                <div className={`p-4 ${isElara ? "bg-cyan-950/20" : "bg-red-950/20"}`}>
                  <div className="flex items-center gap-3">
                    {isElara ? (
                      <HolographicElara size="sm" isSpeaking={false} />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-red-500/30">
                        {level >= 50 ? (
                          <Eye size={20} className="text-red-400" />
                        ) : (
                          <Radio size={18} className="text-red-500/60 animate-pulse" />
                        )}
                      </div>
                    )}
                    <div>
                      <h4 className="font-display text-sm font-bold text-foreground">
                        {isElara ? "Elara" : level >= 50 ? "The Human" : "???"}
                      </h4>
                      <p className="font-mono text-[10px] text-muted-foreground">
                        {isElara ? "Ship Intelligence" : level >= 50 ? "The Twelfth Archon" : "Unknown Contact"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dialog Content */}
                <div className="p-4 bg-card/20">
                  {activeDialog ? (
                    <div className="space-y-4">
                      {dialogPhase === "intro" && (
                        <>
                          <p className="font-mono text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                            {activeDialog.introDialog}
                          </p>
                          <div className={`p-3 rounded border ${isElara ? "border-cyan-500/20 bg-cyan-950/10" : "border-red-500/20 bg-red-950/10"}`}>
                            <p className="font-mono text-[10px] text-muted-foreground">
                              <span className="font-bold text-foreground">OBJECTIVE:</span> {activeDialog.objective}
                            </p>
                          </div>
                        </>
                      )}
                      {dialogPhase === "completion" && (
                        <>
                          <p className="font-mono text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                            {activeDialog.completionDialog}
                          </p>
                          <div className="p-3 rounded border border-emerald-500/20 bg-emerald-950/10">
                            <p className="font-mono text-[10px] text-emerald-400 font-bold mb-1">QUEST COMPLETE</p>
                            <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
                              <span>+{activeDialog.rewards.relationshipXp} REL</span>
                              <span>+{activeDialog.rewards.dreamTokens} DREAM</span>
                              <span>+{activeDialog.rewards.xp} XP</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setActiveDialog(null)}
                            className="w-full py-2 rounded font-mono text-[10px] tracking-wider bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 transition-colors"
                          >
                            CLOSE
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle size={24} className="text-muted-foreground/30 mx-auto mb-3" />
                      <p className="font-mono text-xs text-muted-foreground/50">
                        Start a quest to begin a conversation with {isElara ? "Elara" : "this contact"}.
                      </p>
                      <p className="font-mono text-[10px] text-muted-foreground/30 mt-1">
                        Or use the floating Elara icon to chat anytime.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
