import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useGame } from "@/contexts/GameContext";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Heart, Shield, Swords, BookOpen, MessageCircle, Lock, Unlock,
  ChevronRight, ChevronDown, Star, Zap, Eye, Radio, Users,
  Sparkles, ArrowLeft, Crown, Skull, AlertTriangle, Check, X,
  Send, Loader2, Gift, Package, Hammer,
} from "lucide-react";
import {
  ELARA_PROFILE, THE_HUMAN_PROFILE, COMPANION_QUESTS, INCEPTION_ARKS,
  type CompanionProfile, type CompanionQuest, type BackstoryStage,
} from "@/data/companionData";
import HolographicElara from "@/components/HolographicElara";
import { Streamdown } from "streamdown";
import CutsceneOverlay, { QUEST_CUTSCENES, type CutsceneData } from "@/components/CutsceneOverlay";
import { COMPANION_GIFTS, calculateGiftXp, canCraftGift, getRarityColor, type CompanionGift } from "@/data/companionGifts";
import { getMaterialById } from "@/data/craftingData";
import { ALL_LOYALTY_MISSIONS, getAvailableLoyaltyMissions, type LoyaltyMission, type LoyaltyMissionStep } from "@/data/loyaltyMissions";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
interface DialogChoice {
  id: string;
  text: string;
  category: string;
}
const ELARA_AVATAR = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara_avatar_dark_hair_small_2fcb00b8.png";

// ═══════════════════════════════════════════════════════
// COMPANION HUB PAGE
// BioWare-style companion relationship management
// ═══════════════════════════════════════════════════════

export default function CompanionHubPage() {
  const { state, gainCompanionXp, activateCompanionQuest, completeCompanionQuest, unlockBackstory, setRomance, addCompanionDialogChoice, getCompanionLevel, shiftMorality, startLoyaltyMission, advanceLoyaltyMission, completeLoyaltyMission } = useGame();
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "backstory" | "quests" | "dialog" | "gifts" | "loyalty">("overview");
  const [expandedBackstory, setExpandedBackstory] = useState<string | null>(null);
  const [activeDialog, setActiveDialog] = useState<CompanionQuest | null>(null);
  const [dialogPhase, setDialogPhase] = useState<"intro" | "choices" | "completion">("intro");
  const [activeCutscene, setActiveCutscene] = useState<CutsceneData | null>(null);
  const [giftResult, setGiftResult] = useState<{ gift: CompanionGift; xpGained: number; response: string } | null>(null);
  const [craftingGift, setCraftingGift] = useState<string | null>(null);
  const [activeMissionStep, setActiveMissionStep] = useState<LoyaltyMissionStep | null>(null);
  const [missionStepIndex, setMissionStepIndex] = useState(0);
  const [missionChoiceOutcome, setMissionChoiceOutcome] = useState<string | null>(null);

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
    // Trigger cutscene if one exists for this quest
    const cutscene = QUEST_CUTSCENES[quest.id];
    if (cutscene) {
      setActiveCutscene(cutscene);
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
      {/* Cutscene Overlay */}
      {activeCutscene && (
        <CutsceneOverlay
          cutscene={activeCutscene}
          onComplete={() => setActiveCutscene(null)}
          onClose={() => setActiveCutscene(null)}
        />
      )}
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
            {(["overview", "backstory", "quests", "gifts", "loyalty", "dialog"] as const).map(tab => (
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

          {activeTab === "gifts" && (
            <motion.div
              key="gifts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Gift size={14} className={isElara ? "text-cyan-400" : "text-red-400"} />
                <span className="font-mono text-xs text-muted-foreground">COMPANION GIFTS — Craft and give gifts to strengthen your bond</span>
              </div>

              {/* Gift Result Overlay */}
              <AnimatePresence>
                {giftResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`rounded-lg border p-4 ${isElara ? "border-cyan-500/40 bg-cyan-500/10" : "border-red-500/40 bg-red-500/10"}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{giftResult.gift.icon}</span>
                      <div>
                        <p className="font-display text-sm font-bold" style={{ color: giftResult.gift.color }}>{giftResult.gift.name}</p>
                        <p className="font-mono text-xs text-green-400">+{giftResult.xpGained} RELATIONSHIP XP</p>
                      </div>
                    </div>
                    <div className={`rounded-md p-3 mb-3 ${isElara ? "bg-cyan-500/5 border border-cyan-500/20" : "bg-red-500/5 border border-red-500/20"}`}>
                      <p className="font-mono text-xs text-foreground/80 italic">"{giftResult.response}"</p>
                    </div>
                    <button
                      onClick={() => setGiftResult(null)}
                      className="font-mono text-xs text-muted-foreground hover:text-foreground"
                    >
                      DISMISS
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Gift Grid */}
              {!giftResult && (
                <div className="space-y-3">
                  {COMPANION_GIFTS.map(gift => {
                    const xpGain = calculateGiftXp(gift, selectedCompanion.id);
                    const isPreferred = gift.preferredBy === selectedCompanion.id;
                    const canCraft = canCraftGift(gift, state.craftingMaterials, state.craftingSkills);
                    const isExpanded = craftingGift === gift.id;
                    const rarityColor = getRarityColor(gift.rarity);

                    return (
                      <div
                        key={gift.id}
                        className={`rounded-lg border transition-all ${
                          isExpanded
                            ? `${isElara ? "border-cyan-500/40 bg-cyan-500/5" : "border-red-500/40 bg-red-500/5"}`
                            : "border-border/30 bg-card/30 hover:border-border/50"
                        }`}
                      >
                        <button
                          onClick={() => setCraftingGift(isExpanded ? null : gift.id)}
                          className="w-full flex items-center gap-3 p-3 text-left"
                        >
                          <span className="text-xl">{gift.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold" style={{ color: rarityColor }}>{gift.name}</span>
                              {isPreferred && (
                                <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${isElara ? "bg-cyan-500/20 text-cyan-400" : "bg-red-500/20 text-red-400"}`}>
                                  ♥ FAVORITE
                                </span>
                              )}
                            </div>
                            <p className="font-mono text-[10px] text-muted-foreground truncate">{gift.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-xs text-green-400">+{xpGain} XP</p>
                            <p className="font-mono text-[9px]" style={{ color: rarityColor }}>{gift.rarity.toUpperCase()}</p>
                          </div>
                          <ChevronDown size={14} className={`text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-3 pb-3 space-y-2">
                                {/* Recipe */}
                                <div className="rounded-md bg-secondary/30 p-2">
                                  <p className="font-mono text-[9px] text-muted-foreground mb-1.5">RECIPE ({gift.craftingSkill.toUpperCase()} LVL {gift.minSkillLevel}+)</p>
                                  <div className="flex flex-wrap gap-2">
                                    {gift.recipe.map(req => {
                                      const mat = getMaterialById(req.materialId);
                                      const owned = state.craftingMaterials[req.materialId] || 0;
                                      const hasEnough = owned >= req.quantity;
                                      return (
                                        <div key={req.materialId} className={`flex items-center gap-1 font-mono text-[10px] ${hasEnough ? "text-green-400" : "text-red-400"}`}>
                                          <span>{mat?.icon || "?"}</span>
                                          <span>{owned}/{req.quantity} {mat?.name || req.materialId}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Special Effect */}
                                {gift.specialEffect && (
                                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-amber-400">
                                    <Sparkles size={10} />
                                    <span>SPECIAL: {gift.specialEffect.type === "unlock_backstory" ? "Unlocks hidden backstory" : gift.specialEffect.type === "morality_shift" ? `Shifts morality by ${gift.specialEffect.value}` : gift.specialEffect.type === "unlock_quest" ? "Unlocks special quest" : "Bonus materials"}</span>
                                  </div>
                                )}

                                {/* Craft & Gift Button */}
                                <button
                                  onClick={() => {
                                    if (!canCraft) return;
                                    // Deduct materials
                                    const newMaterials = { ...state.craftingMaterials };
                                    gift.recipe.forEach(req => {
                                      newMaterials[req.materialId] = Math.max(0, (newMaterials[req.materialId] || 0) - req.quantity);
                                    });
                                    // Apply XP
                                    gainCompanionXp(selectedCompanion.id, xpGain);
                                    // Apply special effects
                                    if (gift.specialEffect?.type === "unlock_backstory") {
                                      unlockBackstory(gift.specialEffect.value as string);
                                    } else if (gift.specialEffect?.type === "morality_shift") {
                                      shiftMorality(gift.specialEffect.value as number);
                                    }
                                    // Show result
                                    const response = isElara ? gift.dialogResponses.elara : gift.dialogResponses.the_human;
                                    setGiftResult({ gift, xpGained: xpGain, response });
                                    setCraftingGift(null);
                                  }}
                                  disabled={!canCraft}
                                  className={`w-full py-2 rounded-md font-mono text-xs font-bold transition-all ${
                                    canCraft
                                      ? `${isElara ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30" : "bg-red-500/20 text-red-400 hover:bg-red-500/30"}`
                                      : "bg-secondary/20 text-muted-foreground/50 cursor-not-allowed"
                                  }`}
                                >
                                  {canCraft ? (
                                    <span className="flex items-center justify-center gap-1.5">
                                      <Hammer size={12} /> CRAFT & GIFT
                                    </span>
                                  ) : (
                                    <span className="flex items-center justify-center gap-1.5">
                                      <Lock size={12} /> INSUFFICIENT MATERIALS
                                    </span>
                                  )}
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "loyalty" && (
            <LoyaltyMissionsTab
              companion={selectedCompanion}
              level={level}
              morality={state.moralityScore}
              isElara={isElara}
              completedMissions={state.completedLoyaltyMissions}
              activeMissionId={state.activeLoyaltyMission}
              activeMissionStepIdx={state.loyaltyMissionStep}
              loreUnlocked={state.loyaltyLoreUnlocked}
              titles={state.loyaltyTitles}
              startMission={startLoyaltyMission}
              advanceMission={advanceLoyaltyMission}
              completeMission={completeLoyaltyMission}
              gainXp={() => gainCompanionXp(selectedCompanion.id, 5)}
            />
          )}

          {activeTab === "dialog" && (
            <CompanionChatTab
              companion={selectedCompanion}
              level={level}
              morality={state.moralityScore}
              isElara={isElara}
              activeDialog={activeDialog}
              dialogPhase={dialogPhase}
              setActiveDialog={setActiveDialog}
              gainXp={() => gainCompanionXp(selectedCompanion.id, 2)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══ COMPANION CHAT TAB ═══
   LLM-powered dialog for both Elara and The Human */
function CompanionChatTab({
  companion, level, morality, isElara, activeDialog, dialogPhase, setActiveDialog, gainXp,
}: {
  companion: CompanionProfile;
  level: number;
  morality: number;
  isElara: boolean;
  activeDialog: CompanionQuest | null;
  dialogPhase: "intro" | "choices" | "completion";
  setActiveDialog: (q: CompanionQuest | null) => void;
  gainXp: () => void;
}) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [choices, setChoices] = useState<DialogChoice[]>([]);
  const [lastCategory, setLastCategory] = useState<string>("lore");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // LLM mutations
  const elaraChat = trpc.elara.chat.useMutation();
  const humanChat = trpc.companion.chatWithHuman.useMutation();

  // Get initial greeting for The Human
  const humanGreeting = trpc.companion.getHumanGreeting.useQuery(
    { relationshipLevel: level },
    { enabled: !isElara && chatMessages.length === 0 }
  );

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  // Load initial greeting
  useEffect(() => {
    if (!isElara && humanGreeting.data && chatMessages.length === 0) {
      setChatMessages([{ role: "assistant", content: humanGreeting.data.greeting }]);
      setChoices(humanGreeting.data.choices);
    }
  }, [humanGreeting.data, isElara, chatMessages.length]);

  // Reset chat when companion changes
  useEffect(() => {
    setChatMessages([]);
    setChoices([]);
    setInputText("");
  }, [companion.id]);

  const sendMessage = useCallback(async (message: string, category?: string) => {
    if (!message.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: "user", content: message.trim() };
    setChatMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);
    setChoices([]);

    try {
      if (isElara) {
        const result = await elaraChat.mutateAsync({
          message: message.trim(),
          history: chatMessages.slice(-10),
          pageContext: "/companions",
        });
        setChatMessages(prev => [...prev, { role: "assistant", content: result.message }]);
        setChoices(result.choices || []);
      } else {
        const result = await humanChat.mutateAsync({
          message: message.trim(),
          history: chatMessages.slice(-10),
          relationshipLevel: level,
          moralityScore: morality,
          category: category || lastCategory,
        });
        setChatMessages(prev => [...prev, { role: "assistant", content: result.message }]);
        setChoices(result.choices || []);
        if (category) setLastCategory(category);
      }
      // Gain relationship XP for chatting
      gainXp();
    } catch {
      setChatMessages(prev => [...prev, {
        role: "assistant",
        content: isElara
          ? "*holographic interference* ...systems experiencing momentary disruption. Please try again, Operative."
          : "*static* ...relay's down. Someone's jamming the signal. Give it a minute, kid.",
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [isTyping, chatMessages, isElara, level, morality, lastCategory, elaraChat, humanChat, gainXp]);

  const handleChoiceClick = useCallback((choice: DialogChoice) => {
    sendMessage(choice.text, choice.category);
  }, [sendMessage]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  }, [inputText, sendMessage]);

  const accentColor = isElara ? "cyan" : "red";
  const accentBg = isElara ? "bg-cyan-950/20" : "bg-red-950/20";
  const accentBorder = isElara ? "border-cyan-500/20" : "border-red-500/20";

  return (
    <motion.div
      key="dialog"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className={`rounded-lg border overflow-hidden ${accentBorder}`}>
        {/* Dialog Header */}
        <div className={`p-4 ${accentBg}`}>
          <div className="flex items-center gap-3">
            {isElara ? (
              <HolographicElara size="sm" isSpeaking={isTyping} />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-red-500/30">
                {level >= 50 ? (
                  <Eye size={20} className="text-red-400" />
                ) : (
                  <Radio size={18} className={`text-red-500/60 ${isTyping ? "animate-pulse" : ""}`} />
                )}
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-display text-sm font-bold text-foreground">
                {isElara ? "Elara" : level >= 50 ? "The Human" : "???"}
              </h4>
              <p className="font-mono text-[10px] text-muted-foreground">
                {isElara ? "Ship Intelligence" : level >= 50 ? "The Twelfth Archon" : "Unknown Contact"}
              </p>
            </div>
            <div className={`px-2 py-1 rounded text-[9px] font-mono tracking-wider ${isTyping ? `text-${accentColor}-400 bg-${accentColor}-500/10` : "text-muted-foreground/40 bg-muted/20"}`}>
              {isTyping ? "TRANSMITTING..." : "RELAY ACTIVE"}
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-80 overflow-y-auto p-4 bg-card/10 space-y-3 scrollbar-thin">
          {chatMessages.length === 0 && isElara && (
            <div className="text-center py-8">
              <MessageCircle size={24} className="text-cyan-500/30 mx-auto mb-3" />
              <p className="font-mono text-xs text-muted-foreground/50">
                Open a channel with Elara. Ask about the Saga, the Ark, or anything on your mind.
              </p>
            </div>
          )}
          {chatMessages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] rounded-lg px-3 py-2 ${
                msg.role === "user"
                  ? "bg-primary/15 border border-primary/20"
                  : isElara
                    ? "bg-cyan-950/20 border border-cyan-500/10"
                    : "bg-red-950/20 border border-red-500/10"
              }`}>
                {msg.role === "user" ? (
                  <p className="font-mono text-xs text-foreground">{msg.content}</p>
                ) : (
                  <div className="font-mono text-xs text-muted-foreground leading-relaxed prose-sm">
                    <Streamdown>{msg.content}</Streamdown>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className={`rounded-lg px-3 py-2 ${isElara ? "bg-cyan-950/20 border border-cyan-500/10" : "bg-red-950/20 border border-red-500/10"}`}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${isElara ? "bg-cyan-400" : "bg-red-400"} animate-bounce`} style={{ animationDelay: "0ms" }} />
                  <div className={`w-1.5 h-1.5 rounded-full ${isElara ? "bg-cyan-400" : "bg-red-400"} animate-bounce`} style={{ animationDelay: "150ms" }} />
                  <div className={`w-1.5 h-1.5 rounded-full ${isElara ? "bg-cyan-400" : "bg-red-400"} animate-bounce`} style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quest Dialog Overlay (if active) */}
        {activeDialog && (
          <div className={`p-3 border-t ${accentBorder} ${accentBg}`}>
            <div className="flex items-center gap-2 mb-2">
              <Swords size={12} className={`text-${accentColor}-400`} />
              <span className="font-mono text-[10px] font-bold text-foreground">ACTIVE QUEST: {activeDialog.title}</span>
            </div>
            {dialogPhase === "intro" && (
              <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                {activeDialog.introDialog.slice(0, 200)}...
              </p>
            )}
            {dialogPhase === "completion" && (
              <div className="flex items-center gap-3">
                <div className="p-2 rounded border border-emerald-500/20 bg-emerald-950/10">
                  <p className="font-mono text-[9px] text-emerald-400 font-bold">QUEST COMPLETE</p>
                  <div className="flex items-center gap-2 text-[9px] font-mono text-muted-foreground mt-1">
                    <span>+{activeDialog.rewards.relationshipXp} REL</span>
                    <span>+{activeDialog.rewards.dreamTokens} DREAM</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveDialog(null)}
                  className="px-3 py-1.5 rounded font-mono text-[9px] tracking-wider bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 transition-colors"
                >
                  DISMISS
                </button>
              </div>
            )}
          </div>
        )}

        {/* Dialog Choices */}
        {choices.length > 0 && !isTyping && (
          <div className={`p-3 border-t ${accentBorder} bg-card/5`}>
            <p className="font-mono text-[9px] text-muted-foreground/40 tracking-wider mb-2">SUGGESTED QUERIES</p>
            <div className="flex flex-wrap gap-1.5">
              {choices.slice(0, 5).map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoiceClick(choice)}
                  className={`px-2.5 py-1.5 rounded text-[10px] font-mono border transition-all hover:scale-[1.02] ${
                    isElara
                      ? "border-cyan-500/20 text-cyan-300/70 hover:bg-cyan-500/10 hover:text-cyan-300"
                      : "border-red-500/20 text-red-300/70 hover:bg-red-500/10 hover:text-red-300"
                  }`}
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className={`p-3 border-t ${accentBorder} bg-card/20`}>
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={isElara ? "Ask Elara anything..." : level >= 50 ? "Talk to The Human..." : "Send encrypted message..."}
              className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-foreground placeholder:text-muted-foreground/30"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className={`p-2 rounded transition-all ${
                inputText.trim() && !isTyping
                  ? isElara
                    ? "text-cyan-400 hover:bg-cyan-500/10"
                    : "text-red-400 hover:bg-red-500/10"
                  : "text-muted-foreground/20"
              }`}
            >
              {isTyping ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

/* ═══ LOYALTY MISSIONS TAB ═══
   Deep lore side-quests unlocked at relationship 75+ */
function LoyaltyMissionsTab({
  companion, level, morality, isElara, completedMissions, activeMissionId,
  activeMissionStepIdx, loreUnlocked, titles, startMission, advanceMission,
  completeMission, gainXp,
}: {
  companion: CompanionProfile;
  level: number;
  morality: number;
  isElara: boolean;
  completedMissions: string[];
  activeMissionId: string | null;
  activeMissionStepIdx: number;
  loreUnlocked: string[];
  titles: string[];
  startMission: (missionId: string) => void;
  advanceMission: (choiceId?: string, moralityShift?: number) => void;
  completeMission: (missionId: string, loreUnlock: string, moralityBonus: number, relationshipBonus: number, companionId: string, title?: string) => void;
  gainXp: () => void;
}) {
  const [choiceOutcome, setChoiceOutcome] = useState<string | null>(null);
  const [revealedLore, setRevealedLore] = useState<string | null>(null);
  const [missionComplete, setMissionComplete] = useState<LoyaltyMission | null>(null);

  const accentColor = isElara ? "cyan" : "red";
  const accentBg = isElara ? "bg-cyan-500/10" : "bg-red-500/10";
  const accentBorder = isElara ? "border-cyan-500/30" : "border-red-500/30";
  const accentText = isElara ? "text-cyan-400" : "text-red-400";

  const companionMissions = ALL_LOYALTY_MISSIONS.filter(m => m.companionId === companion.id);
  const available = getAvailableLoyaltyMissions(
    companion.id as "elara" | "the_human", level, morality, completedMissions
  );

  // Get the active mission object
  const activeMission = activeMissionId
    ? ALL_LOYALTY_MISSIONS.find(m => m.id === activeMissionId) || null
    : null;

  const currentStep = activeMission ? activeMission.steps[activeMissionStepIdx] : null;
  const isLastStep = activeMission ? activeMissionStepIdx >= activeMission.steps.length - 1 : false;

  const handleAdvance = () => {
    if (!activeMission) return;
    setChoiceOutcome(null);
    setRevealedLore(null);

    if (isLastStep) {
      // Complete the mission
      const r = activeMission.reward;
      completeMission(activeMission.id, r.loreUnlock, r.moralityBonus, r.relationshipBonus, companion.id, r.title);
      setMissionComplete(activeMission);
    } else {
      advanceMission();
    }
  };

  const handleChoice = (choice: { id: string; text: string; moralityShift: number; outcome: string }) => {
    setChoiceOutcome(choice.outcome);
    advanceMission(choice.id, choice.moralityShift);
  };

  // Mission complete overlay
  if (missionComplete) {
    return (
      <motion.div
        key="mission-complete"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <div className={`rounded-lg border ${accentBorder} ${accentBg} p-6 text-center`}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <Crown size={48} className={`${accentText} mx-auto mb-4`} />
          </motion.div>
          <h3 className="font-display text-xl font-bold text-foreground mb-2">MISSION COMPLETE</h3>
          <p className={`font-display text-sm ${accentText} mb-4`}>{missionComplete.title}</p>

          {missionComplete.reward.title && (
            <div className="mb-4 py-2 px-4 rounded-md bg-amber-500/10 border border-amber-500/30 inline-block">
              <p className="font-mono text-[10px] text-amber-400/60 tracking-wider">TITLE EARNED</p>
              <p className="font-display text-sm font-bold text-amber-400">{missionComplete.reward.title}</p>
            </div>
          )}

          <div className="space-y-2 text-left max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <BookOpen size={12} className="text-purple-400" />
              <span className="font-mono text-xs text-purple-400">LORE: {missionComplete.reward.loreUnlock}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart size={12} className="text-rose-400" />
              <span className="font-mono text-xs text-rose-400">+{missionComplete.reward.relationshipBonus} RELATIONSHIP</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={12} className="text-amber-400" />
              <span className="font-mono text-xs text-amber-400">+{missionComplete.reward.moralityBonus} MORALITY</span>
            </div>
            {missionComplete.reward.specialUnlock && (
              <div className="flex items-center gap-2">
                <Sparkles size={12} className="text-emerald-400" />
                <span className="font-mono text-xs text-emerald-400">UNLOCKED: {missionComplete.reward.specialUnlock.replace(/_/g, " ").toUpperCase()}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setMissionComplete(null)}
            className={`mt-6 px-6 py-2 rounded-md font-mono text-xs ${accentText} ${accentBg} border ${accentBorder} hover:opacity-80 transition-all`}
          >
            CONTINUE
          </button>
        </div>
      </motion.div>
    );
  }

  // Active mission step view
  if (activeMission && currentStep) {
    return (
      <motion.div
        key="active-mission"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Mission Header */}
        <div className={`rounded-lg border ${accentBorder} ${accentBg} p-4`}>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={14} className={accentText} />
            <span className="font-mono text-[10px] text-muted-foreground tracking-wider">LOYALTY MISSION</span>
          </div>
          <h3 className="font-display text-sm font-bold text-foreground">{activeMission.title}</h3>
          <p className="font-mono text-[10px] text-muted-foreground">{activeMission.subtitle}</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full bg-secondary/50">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isElara ? "bg-cyan-500" : "bg-red-500"}`}
                style={{ width: `${((activeMissionStepIdx + 1) / activeMission.steps.length) * 100}%` }}
              />
            </div>
            <span className="font-mono text-[9px] text-muted-foreground">
              {activeMissionStepIdx + 1}/{activeMission.steps.length}
            </span>
          </div>
        </div>

        {/* Current Step */}
        <div className="rounded-lg border border-border/30 bg-card/30 p-4">
          {/* Step type indicator */}
          <div className="flex items-center gap-2 mb-3">
            {currentStep.type === "dialogue" && <MessageCircle size={12} className={accentText} />}
            {currentStep.type === "investigation" && <Eye size={12} className="text-amber-400" />}
            {currentStep.type === "choice" && <Swords size={12} className="text-purple-400" />}
            {currentStep.type === "revelation" && <Sparkles size={12} className="text-emerald-400" />}
            {currentStep.type === "combat_challenge" && <Skull size={12} className="text-red-400" />}
            <span className="font-mono text-[9px] text-muted-foreground tracking-wider">
              {currentStep.type.toUpperCase().replace("_", " ")}
            </span>
          </div>

          {/* Speaker */}
          {currentStep.speaker && (
            <p className={`font-mono text-[10px] ${accentText} mb-1 tracking-wider`}>
              [{currentStep.speaker}]
            </p>
          )}

          {/* Text with typewriter-like reveal */}
          <motion.p
            key={currentStep.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-xs text-foreground/90 leading-relaxed"
          >
            {currentStep.text}
          </motion.p>

          {/* Choice outcome display */}
          {choiceOutcome && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-3 p-3 rounded-md ${accentBg} border ${accentBorder}`}
            >
              <p className="font-mono text-xs text-foreground/80 italic">{choiceOutcome}</p>
            </motion.div>
          )}

          {/* Revealed lore display */}
          {currentStep.type === "revelation" && currentStep.revealedLore && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-4 p-4 rounded-md bg-purple-500/5 border border-purple-500/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={12} className="text-purple-400" />
                <span className="font-mono text-[9px] text-purple-400 tracking-wider">LORE REVEALED</span>
              </div>
              <p className="font-mono text-[10px] text-purple-300/80 leading-relaxed">
                {currentStep.revealedLore}
              </p>
            </motion.div>
          )}

          {/* Choices */}
          {currentStep.type === "choice" && currentStep.choices && !choiceOutcome && (
            <div className="mt-4 space-y-2">
              {currentStep.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice)}
                  className={`w-full text-left p-3 rounded-md border transition-all hover:scale-[1.01] ${
                    isElara
                      ? "border-cyan-500/20 hover:border-cyan-500/40 hover:bg-cyan-500/5"
                      : "border-red-500/20 hover:border-red-500/40 hover:bg-red-500/5"
                  }`}
                >
                  <p className="font-mono text-xs text-foreground/80">{choice.text}</p>
                  {choice.moralityShift !== 0 && (
                    <p className={`font-mono text-[9px] mt-1 ${choice.moralityShift > 0 ? "text-cyan-400" : "text-red-400"}`}>
                      {choice.moralityShift > 0 ? "▲" : "▼"} MORALITY {choice.moralityShift > 0 ? "+" : ""}{choice.moralityShift}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Advance / Complete Button */}
        {(currentStep.type !== "choice" || choiceOutcome) && (
          <button
            onClick={handleAdvance}
            className={`w-full py-3 rounded-md font-mono text-xs font-bold tracking-wider transition-all ${
              isLastStep
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30"
                : `${accentBg} ${accentText} border ${accentBorder} hover:opacity-80`
            }`}
          >
            {isLastStep ? "⚡ COMPLETE MISSION" : "CONTINUE ▸"}
          </button>
        )}
      </motion.div>
    );
  }

  // Mission list view
  return (
    <motion.div
      key="loyalty"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <Shield size={14} className={accentText} />
        <span className="font-mono text-xs text-muted-foreground">
          LOYALTY MISSIONS — Deep lore quests at relationship 75+
        </span>
      </div>

      {/* Earned Titles */}
      {titles.length > 0 && (
        <div className={`rounded-lg border ${accentBorder} ${accentBg} p-3`}>
          <p className="font-mono text-[9px] text-muted-foreground tracking-wider mb-2">EARNED TITLES</p>
          <div className="flex flex-wrap gap-2">
            {titles.map(t => (
              <span key={t} className="font-mono text-[10px] text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                ⚜ {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Unlocked Lore */}
      {loreUnlocked.length > 0 && (
        <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-3">
          <p className="font-mono text-[9px] text-purple-400/60 tracking-wider mb-2">PANOPTICON LORE UNLOCKED</p>
          {loreUnlocked.map(l => (
            <div key={l} className="flex items-center gap-2 mb-1">
              <BookOpen size={10} className="text-purple-400" />
              <span className="font-mono text-[10px] text-purple-300/80">{l}</span>
            </div>
          ))}
        </div>
      )}

      {/* Mission Cards */}
      {companionMissions.map(mission => {
        const isCompleted = completedMissions.includes(mission.id);
        const isAvailable = available.some(m => m.id === mission.id);
        const isLocked = !isCompleted && !isAvailable;
        const meetsRelationship = level >= mission.requiredRelationship;
        const meetsMorality = !mission.requiredMorality || (
          mission.requiredMorality.side === "humanity"
            ? morality >= mission.requiredMorality.min
            : morality <= -mission.requiredMorality.min
        );

        return (
          <div
            key={mission.id}
            className={`rounded-lg border p-4 transition-all ${
              isCompleted
                ? "border-emerald-500/30 bg-emerald-500/5"
                : isAvailable
                ? `${accentBorder} ${accentBg} hover:scale-[1.01] cursor-pointer`
                : "border-border/20 bg-card/20 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {isCompleted ? (
                    <Check size={14} className="text-emerald-400" />
                  ) : isLocked ? (
                    <Lock size={14} className="text-muted-foreground/50" />
                  ) : (
                    <Shield size={14} className={accentText} />
                  )}
                  <h4 className={`font-display text-sm font-bold ${isCompleted ? "text-emerald-400" : isAvailable ? "text-foreground" : "text-muted-foreground/50"}`}>
                    {isLocked ? "???" : mission.title}
                  </h4>
                </div>
                <p className="font-mono text-[10px] text-muted-foreground/70 mb-2">
                  {isLocked ? "Requirements not met" : mission.subtitle}
                </p>

                {/* Requirements */}
                <div className="flex flex-wrap gap-2">
                  <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${
                    meetsRelationship ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                  }`}>
                    {meetsRelationship ? "✓" : "✗"} REL {mission.requiredRelationship}+
                  </span>
                  {mission.requiredMorality && (
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${
                      meetsMorality ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                    }`}>
                      {meetsMorality ? "✓" : "✗"} {mission.requiredMorality.side.toUpperCase()} ≥{mission.requiredMorality.min}
                    </span>
                  )}
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-secondary/30 text-muted-foreground">
                    {mission.steps.length} STEPS
                  </span>
                </div>
              </div>

              {/* Start Button */}
              {isAvailable && !isCompleted && (
                <button
                  onClick={() => startMission(mission.id)}
                  className={`px-3 py-1.5 rounded-md font-mono text-[10px] font-bold tracking-wider ${accentText} ${accentBg} border ${accentBorder} hover:opacity-80 transition-all`}
                >
                  BEGIN
                </button>
              )}
              {isCompleted && (
                <span className="font-mono text-[9px] text-emerald-400 px-2 py-1 rounded bg-emerald-500/10">
                  COMPLETED
                </span>
              )}
            </div>

            {/* Rewards Preview */}
            {!isLocked && (
              <div className="mt-3 pt-2 border-t border-border/20 flex flex-wrap gap-3">
                <span className="font-mono text-[9px] text-purple-400">📖 {mission.reward.loreUnlock}</span>
                <span className="font-mono text-[9px] text-rose-400">♥ +{mission.reward.relationshipBonus}</span>
                {mission.reward.title && (
                  <span className="font-mono text-[9px] text-amber-400">⚜ {mission.reward.title}</span>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Locked message if below 75 */}
      {level < 75 && companionMissions.every(m => !completedMissions.includes(m.id)) && (
        <div className="text-center py-6">
          <Lock size={24} className="text-muted-foreground/30 mx-auto mb-2" />
          <p className="font-mono text-xs text-muted-foreground/50">
            Reach relationship level 75 to unlock loyalty missions
          </p>
          <p className="font-mono text-[10px] text-muted-foreground/30 mt-1">
            Current: {level}/75
          </p>
        </div>
      )}
    </motion.div>
  );
}
