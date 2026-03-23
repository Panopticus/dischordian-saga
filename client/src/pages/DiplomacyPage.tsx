import { useState, useMemo, useCallback } from "react";
import { useGame } from "@/contexts/GameContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Scale, Shield, Swords, Users, Crown, Eye, Lock,
  ChevronRight, ArrowLeft, AlertTriangle, Check, X,
  Heart, Skull, Star, Zap, MessageCircle, Radio,
  Sparkles, Target, Ship, Compass, Brain,
} from "lucide-react";
import {
  TRADE_NPCS, DIPLOMACY_EVENTS,
  type TradeNPC, type DiplomacyEvent, type DiplomacyChoice,
} from "@/data/companionData";

// ═══════════════════════════════════════════════════════
// TRADE EMPIRE DIPLOMACY
// Moral dilemmas, NPC encounters, and faction reputation
// ═══════════════════════════════════════════════════════

const FACTION_COLORS: Record<string, { color: string; icon: typeof Crown }> = {
  empire: { color: "#ef4444", icon: Crown },
  insurgency: { color: "#22d3ee", icon: Shield },
  independent: { color: "#a855f7", icon: Compass },
  pirate: { color: "#f59e0b", icon: Skull },
};

const BEHAVIOR_LABELS: Record<string, { label: string; color: string }> = {
  aggressive: { label: "AGGRESSIVE", color: "text-red-400" },
  diplomatic: { label: "DIPLOMATIC", color: "text-cyan-400" },
  cunning: { label: "CUNNING", color: "text-purple-400" },
  honorable: { label: "HONORABLE", color: "text-emerald-400" },
  ruthless: { label: "RUTHLESS", color: "text-amber-400" },
};

export default function DiplomacyPage() {
  const { state, completeDiplomacyEvent, shiftMorality } = useGame();
  const [activeTab, setActiveTab] = useState<"events" | "npcs" | "reputation">("events");
  const [selectedEvent, setSelectedEvent] = useState<DiplomacyEvent | null>(null);
  const [selectedNpc, setSelectedNpc] = useState<TradeNPC | null>(null);
  const [choiceResult, setChoiceResult] = useState<{ choice: DiplomacyChoice; event: DiplomacyEvent } | null>(null);

  // Derive player level from conexusXp (100 XP per level, minimum 1)
  const playerLevel = Math.max(1, Math.floor((state.conexusXp || 0) / 100) + 1);

  const availableEvents = useMemo(() => {
    return DIPLOMACY_EVENTS.filter(e =>
      e.minLevel <= playerLevel &&
      !state.completedDiplomacyEvents.includes(e.id)
    );
  }, [playerLevel, state.completedDiplomacyEvents]);

  const completedEvents = useMemo(() => {
    return DIPLOMACY_EVENTS.filter(e =>
      state.completedDiplomacyEvents.includes(e.id)
    );
  }, [state.completedDiplomacyEvents]);

  const lockedEvents = useMemo(() => {
    return DIPLOMACY_EVENTS.filter(e =>
      e.minLevel > playerLevel &&
      !state.completedDiplomacyEvents.includes(e.id)
    );
  }, [playerLevel, state.completedDiplomacyEvents]);

  const handleChoice = useCallback((event: DiplomacyEvent, choice: DiplomacyChoice) => {
    completeDiplomacyEvent(event.id, choice.id, choice.moralityDelta, choice.reputationDelta);
    setChoiceResult({ choice, event });
    setSelectedEvent(null);
  }, [completeDiplomacyEvent]);

  // ═══ CHOICE RESULT OVERLAY ═══
  if (choiceResult) {
    const { choice, event } = choiceResult;
    return (
      <div className="min-h-screen p-4 sm:p-6 pb-24">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg border border-border/30 bg-card/30 overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-primary/10 to-transparent border-b border-border/20">
              <div className="flex items-center gap-2 mb-1">
                <Scale size={16} className="text-primary" />
                <span className="font-mono text-[10px] text-primary tracking-wider">DIPLOMATIC RESOLUTION</span>
              </div>
              <h2 className="font-display text-lg font-bold tracking-wider text-foreground">
                {event.title}
              </h2>
            </div>

            <div className="p-5 space-y-4">
              {/* Your Choice */}
              <div className="rounded border border-primary/20 bg-primary/5 p-4">
                <p className="font-mono text-[10px] text-primary tracking-wider mb-2">YOUR DECISION</p>
                <p className="font-mono text-sm text-foreground font-bold">{choice.text}</p>
              </div>

              {/* Consequence */}
              <div className="rounded border border-border/30 bg-card/20 p-4">
                <p className="font-mono text-[10px] text-muted-foreground tracking-wider mb-2">CONSEQUENCE</p>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed italic">
                  {choice.consequence}
                </p>
              </div>

              {/* Impact */}
              <div className="grid grid-cols-2 gap-3">
                {/* Morality */}
                <div className={`rounded border p-3 ${
                  choice.moralityDelta > 0
                    ? "border-cyan-500/20 bg-cyan-950/10"
                    : choice.moralityDelta < 0
                    ? "border-red-500/20 bg-red-950/10"
                    : "border-border/20 bg-card/10"
                }`}>
                  <p className="font-mono text-[9px] text-muted-foreground tracking-wider mb-1">MORALITY</p>
                  {choice.moralityDelta !== 0 ? (
                    <>
                      <div className="flex items-center gap-1.5">
                        <span className={`font-display text-lg font-bold ${choice.moralityDelta > 0 ? "text-cyan-400" : "text-red-400"}`}>
                          {choice.moralityDelta > 0 ? "+" : ""}{choice.moralityDelta}
                        </span>
                      </div>
                      <p className="font-mono text-[9px] text-muted-foreground">
                        {choice.moralityDelta > 0
                          ? `→ HUMANITY +${choice.moralityDelta} / MACHINE -${choice.moralityDelta}`
                          : `→ MACHINE +${Math.abs(choice.moralityDelta)} / HUMANITY ${choice.moralityDelta}`}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-display text-lg font-bold text-muted-foreground">0</p>
                      <p className="font-mono text-[9px] text-muted-foreground">NEUTRAL</p>
                    </>
                  )}
                </div>

                {/* Credits */}
                <div className={`rounded border p-3 ${
                  choice.creditDelta > 0
                    ? "border-emerald-500/20 bg-emerald-950/10"
                    : choice.creditDelta < 0
                    ? "border-amber-500/20 bg-amber-950/10"
                    : "border-border/20 bg-card/10"
                }`}>
                  <p className="font-mono text-[9px] text-muted-foreground tracking-wider mb-1">CREDITS</p>
                  <p className={`font-display text-lg font-bold ${
                    choice.creditDelta > 0 ? "text-emerald-400" : choice.creditDelta < 0 ? "text-amber-400" : "text-muted-foreground"
                  }`}>
                    {choice.creditDelta > 0 ? "+" : ""}{choice.creditDelta.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Reputation Changes */}
              <div className="rounded border border-border/30 bg-card/20 p-4">
                <p className="font-mono text-[9px] text-muted-foreground tracking-wider mb-3">REPUTATION IMPACT</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(choice.reputationDelta).map(([faction, delta]) => {
                    const factionInfo = FACTION_COLORS[faction];
                    const FactionIcon = factionInfo?.icon || Users;
                    return (
                      <div key={faction} className="flex items-center gap-2">
                        <FactionIcon size={12} style={{ color: factionInfo?.color || "#888" }} />
                        <span className="font-mono text-[10px] text-muted-foreground capitalize flex-1">{faction}</span>
                        <span className={`font-mono text-[10px] font-bold ${
                          delta > 0 ? "text-emerald-400" : delta < 0 ? "text-red-400" : "text-muted-foreground"
                        }`}>
                          {delta > 0 ? "+" : ""}{delta}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Theme */}
              <div className="rounded border border-border/20 bg-card/10 p-3">
                <p className="font-mono text-[9px] text-muted-foreground/60 italic text-center">
                  "{event.theme}"
                </p>
              </div>

              <button
                onClick={() => setChoiceResult(null)}
                className="w-full py-3 rounded-lg font-mono text-xs tracking-wider bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-colors"
              >
                CONTINUE
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ═══ EVENT DETAIL VIEW ═══
  if (selectedEvent) {
    const involvedNpcs = TRADE_NPCS.filter(n => selectedEvent.involvedNpcs.includes(n.id));

    return (
      <div className="min-h-screen p-4 sm:p-6 pb-24">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setSelectedEvent(null)}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4 font-mono text-xs"
          >
            <ArrowLeft size={14} />
            BACK TO DIPLOMACY
          </button>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-border/30 bg-card/30 overflow-hidden"
          >
            {/* Event Header */}
            <div className="p-5 border-b border-border/20 bg-gradient-to-r from-amber-500/5 to-transparent">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} className="text-amber-400" />
                <span className="font-mono text-[10px] text-amber-400 tracking-wider">DIPLOMATIC CRISIS</span>
              </div>
              <h2 className="font-display text-xl font-bold tracking-wider text-foreground mb-2">
                {selectedEvent.title}
              </h2>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                {selectedEvent.description}
              </p>
            </div>

            {/* Involved NPCs */}
            <div className="p-4 border-b border-border/20">
              <p className="font-mono text-[9px] text-muted-foreground tracking-wider mb-3">INVOLVED PARTIES</p>
              <div className="flex gap-3">
                {involvedNpcs.map(npc => {
                  const factionInfo = FACTION_COLORS[npc.faction];
                  const FactionIcon = factionInfo?.icon || Users;
                  return (
                    <div
                      key={npc.id}
                      className="flex items-center gap-2 px-3 py-2 rounded border"
                      style={{
                        borderColor: `${factionInfo?.color || "#888"}30`,
                        background: `${factionInfo?.color || "#888"}08`,
                      }}
                    >
                      <FactionIcon size={14} style={{ color: factionInfo?.color || "#888" }} />
                      <div>
                        <p className="font-mono text-[10px] text-foreground font-bold">{npc.name}</p>
                        <p className="font-mono text-[8px] text-muted-foreground">{npc.title}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Theme */}
            <div className="px-4 py-3 border-b border-border/20 bg-card/10">
              <p className="font-mono text-[10px] text-muted-foreground/70 italic text-center">
                "{selectedEvent.theme}"
              </p>
            </div>

            {/* Choices */}
            <div className="p-4 space-y-3">
              <p className="font-mono text-[9px] text-muted-foreground tracking-wider mb-2">YOUR RESPONSE</p>
              {selectedEvent.choices.map((choice, i) => (
                <motion.button
                  key={choice.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => handleChoice(selectedEvent, choice)}
                  className="w-full text-left rounded-lg border border-border/30 bg-card/20 p-4 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                >
                  <p className="font-mono text-sm text-foreground font-bold mb-2 group-hover:text-primary transition-colors">
                    {choice.text}
                  </p>
                  <div className="flex flex-wrap gap-2 text-[9px] font-mono">
                    <span className={choice.moralityDelta > 0 ? "text-cyan-400" : choice.moralityDelta < 0 ? "text-red-400" : "text-muted-foreground"}>
                      MORALITY: {choice.moralityDelta > 0 ? "+" : ""}{choice.moralityDelta}
                    </span>
                    <span className="text-muted-foreground/30">|</span>
                    <span className={choice.creditDelta > 0 ? "text-emerald-400" : choice.creditDelta < 0 ? "text-amber-400" : "text-muted-foreground"}>
                      CREDITS: {choice.creditDelta > 0 ? "+" : ""}{choice.creditDelta.toLocaleString()}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ═══ NPC DETAIL VIEW ═══
  if (selectedNpc) {
    const factionInfo = FACTION_COLORS[selectedNpc.faction];
    const FactionIcon = factionInfo?.icon || Users;
    const behaviorInfo = BEHAVIOR_LABELS[selectedNpc.behavior];
    const involvedEvents = DIPLOMACY_EVENTS.filter(e => e.involvedNpcs.includes(selectedNpc.id));

    return (
      <div className="min-h-screen p-4 sm:p-6 pb-24">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setSelectedNpc(null)}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4 font-mono text-xs"
          >
            <ArrowLeft size={14} />
            BACK TO DIPLOMACY
          </button>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border overflow-hidden"
            style={{ borderColor: `${factionInfo?.color || "#888"}30` }}
          >
            {/* NPC Header */}
            <div className="h-1" style={{ background: `linear-gradient(to right, transparent, ${factionInfo?.color || "#888"}, transparent)` }} />
            <div className="p-5" style={{ background: `${factionInfo?.color || "#888"}08` }}>
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 border"
                  style={{
                    borderColor: `${factionInfo?.color || "#888"}40`,
                    background: `linear-gradient(135deg, ${factionInfo?.color || "#888"}20, ${factionInfo?.color || "#888"}05)`,
                  }}
                >
                  <FactionIcon size={28} style={{ color: factionInfo?.color || "#888" }} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-xl font-bold tracking-wider text-foreground mb-0.5">
                    {selectedNpc.name}
                  </h2>
                  <p className="font-mono text-[10px] text-muted-foreground tracking-wider mb-2">
                    {selectedNpc.title}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-[9px] font-mono border"
                      style={{
                        backgroundColor: `${factionInfo?.color || "#888"}15`,
                        color: factionInfo?.color || "#888",
                        borderColor: `${factionInfo?.color || "#888"}30`,
                      }}
                    >
                      {selectedNpc.faction.toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono bg-secondary border border-border/30 ${behaviorInfo?.color || "text-muted-foreground"}`}>
                      {behaviorInfo?.label || selectedNpc.behavior.toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-secondary border border-border/30 text-muted-foreground">
                      TIER {selectedNpc.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Quote */}
              <div className="rounded border border-border/20 bg-card/10 p-4">
                <p className="font-mono text-xs text-muted-foreground/80 italic leading-relaxed">
                  "{selectedNpc.quote}"
                </p>
              </div>

              {/* Personality */}
              <div>
                <h3 className="font-display text-sm font-bold tracking-wider text-foreground mb-2 flex items-center gap-2">
                  <Brain size={14} style={{ color: factionInfo?.color || "#888" }} />
                  PERSONALITY PROFILE
                </h3>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                  {selectedNpc.personality}
                </p>
              </div>

              {/* Encounter Style */}
              <div>
                <h3 className="font-display text-sm font-bold tracking-wider text-foreground mb-2 flex items-center gap-2">
                  <MessageCircle size={14} style={{ color: factionInfo?.color || "#888" }} />
                  ENCOUNTER STYLE
                </h3>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                  {selectedNpc.encounterStyle}
                </p>
              </div>

              {/* Involved Events */}
              {involvedEvents.length > 0 && (
                <div>
                  <h3 className="font-display text-sm font-bold tracking-wider text-foreground mb-2 flex items-center gap-2">
                    <Scale size={14} style={{ color: factionInfo?.color || "#888" }} />
                    DIPLOMATIC INCIDENTS
                  </h3>
                  <div className="space-y-2">
                    {involvedEvents.map(event => {
                      const isCompleted = state.completedDiplomacyEvents.includes(event.id);
                      return (
                        <div
                          key={event.id}
                          className={`rounded border p-3 ${
                            isCompleted ? "border-emerald-500/20 bg-emerald-950/10" : "border-border/20 bg-card/10"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isCompleted ? (
                              <Check size={12} className="text-emerald-400" />
                            ) : (
                              <AlertTriangle size={12} className="text-amber-400" />
                            )}
                            <span className="font-mono text-[10px] text-foreground font-bold">{event.title}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Lore Link */}
              {selectedNpc.loreEntityId && (
                <Link
                  href={`/entity/${selectedNpc.loreEntityId}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded font-mono text-[10px] tracking-wider bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-colors"
                >
                  VIEW LOREDEX ENTRY <ChevronRight size={12} />
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ═══ MAIN DIPLOMACY VIEW ═══
  return (
    <div className="min-h-screen p-4 sm:p-6 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="h-px flex-1 max-w-8 bg-gradient-to-r from-transparent to-amber-500/50" />
            <span className="font-mono text-[10px] text-amber-400/70 tracking-[0.3em]">TRADE EMPIRE // DIPLOMATIC CORPS</span>
            <div className="h-px flex-1 max-w-8 bg-gradient-to-l from-transparent to-amber-500/50" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-wider text-foreground mb-2">
            <span className="text-amber-400">DIPLOMACY</span> & ENCOUNTERS
          </h1>
          <p className="font-mono text-xs text-muted-foreground max-w-xl leading-relaxed">
            Navigate moral dilemmas, forge alliances, and shape the galaxy through your choices. Every decision shifts the balance between humanity and machine.
          </p>
        </motion.div>

        {/* Morality & Reputation Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6"
        >
          {/* Morality */}
          <div className={`col-span-2 sm:col-span-1 rounded-lg border p-3 ${
            state.moralityScore > 0
              ? "border-cyan-500/20 bg-cyan-950/10"
              : state.moralityScore < 0
              ? "border-red-500/20 bg-red-950/10"
              : "border-border/20 bg-card/10"
          }`}>
            <p className="font-mono text-[9px] text-muted-foreground tracking-wider mb-1">MORALITY</p>
            <p className={`font-display text-xl font-bold ${
              state.moralityScore > 0 ? "text-cyan-400" : state.moralityScore < 0 ? "text-red-400" : "text-muted-foreground"
            }`}>
              {state.moralityScore > 0 ? "+" : ""}{state.moralityScore}
            </p>
          </div>

          {/* Faction Reputations */}
          {Object.entries(FACTION_COLORS).map(([faction, info]) => {
            const rep = state.factionReputation[faction] || 0;
            const FIcon = info.icon;
            return (
              <div
                key={faction}
                className="rounded-lg border p-3"
                style={{ borderColor: `${info.color}20`, background: `${info.color}05` }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <FIcon size={10} style={{ color: info.color }} />
                  <p className="font-mono text-[9px] text-muted-foreground tracking-wider capitalize">{faction}</p>
                </div>
                <p className="font-display text-lg font-bold" style={{ color: info.color }}>
                  {rep > 0 ? "+" : ""}{rep}
                </p>
              </div>
            );
          })}
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 border-b border-border/20 pb-2">
          {(["events", "npcs", "reputation"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t font-mono text-[10px] tracking-wider transition-colors ${
                activeTab === tab
                  ? "bg-primary/10 text-primary border border-primary/30 border-b-0"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "events" ? "DIPLOMATIC EVENTS" : tab === "npcs" ? "NPC DOSSIERS" : "FACTION STATUS"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ═══ EVENTS TAB ═══ */}
          {activeTab === "events" && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Available Events */}
              {availableEvents.length > 0 && (
                <div>
                  <h3 className="font-display text-sm font-bold tracking-wider text-foreground mb-3 flex items-center gap-2">
                    <AlertTriangle size={14} className="text-amber-400" />
                    ACTIVE CRISES ({availableEvents.length})
                  </h3>
                  <div className="space-y-3">
                    {availableEvents.map((event, i) => (
                      <motion.button
                        key={event.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setSelectedEvent(event)}
                        className="w-full text-left rounded-lg border border-amber-500/20 bg-amber-950/5 p-4 hover:border-amber-400/40 hover:bg-amber-950/10 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                            <Scale size={18} className="text-amber-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-display text-sm font-bold text-foreground group-hover:text-amber-400 transition-colors mb-1">
                              {event.title}
                            </h4>
                            <p className="font-mono text-[10px] text-muted-foreground line-clamp-2 mb-2">
                              {event.description}
                            </p>
                            <div className="flex items-center gap-3 text-[9px] font-mono text-muted-foreground/50">
                              <span>{event.choices.length} options</span>
                              <span>•</span>
                              <span className="italic">"{event.theme}"</span>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-muted-foreground/30 group-hover:text-amber-400 transition-colors mt-1" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Events */}
              {completedEvents.length > 0 && (
                <div>
                  <h3 className="font-display text-sm font-bold tracking-wider text-foreground mb-3 flex items-center gap-2">
                    <Check size={14} className="text-emerald-400" />
                    RESOLVED ({completedEvents.length})
                  </h3>
                  <div className="space-y-2">
                    {completedEvents.map(event => {
                      const choiceData = state.diplomacyChoices.find(c => c.eventId === event.id);
                      const choiceObj = event.choices.find(c => c.id === choiceData?.choiceId);
                      return (
                        <div
                          key={event.id}
                          className="rounded-lg border border-emerald-500/15 bg-emerald-950/5 p-3"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Check size={12} className="text-emerald-400" />
                            <span className="font-display text-sm font-bold text-foreground">{event.title}</span>
                          </div>
                          {choiceObj && (
                            <p className="font-mono text-[10px] text-muted-foreground/60 ml-5">
                              Choice: "{choiceObj.text}" (Morality: {choiceData?.moralityDelta && choiceData.moralityDelta > 0 ? "+" : ""}{choiceData?.moralityDelta})
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Locked Events */}
              {lockedEvents.length > 0 && (
                <div>
                  <h3 className="font-display text-sm font-bold tracking-wider text-muted-foreground/50 mb-3 flex items-center gap-2">
                    <Lock size={14} />
                    LOCKED ({lockedEvents.length})
                  </h3>
                  <div className="space-y-2">
                    {lockedEvents.map(event => (
                      <div
                        key={event.id}
                        className="rounded-lg border border-border/10 bg-card/5 p-3 opacity-50"
                      >
                        <div className="flex items-center gap-2">
                          <Lock size={12} className="text-muted-foreground/30" />
                          <span className="font-mono text-[10px] text-muted-foreground/30">
                            [CLASSIFIED — Level {event.minLevel} Required]
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {availableEvents.length === 0 && completedEvents.length === 0 && (
                <div className="text-center py-12">
                  <Scale size={32} className="text-muted-foreground/20 mx-auto mb-3" />
                  <p className="font-mono text-sm text-muted-foreground/50">No diplomatic events available yet.</p>
                  <p className="font-mono text-xs text-muted-foreground/30 mt-1">Level up in Trade Empire to unlock crises.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ═══ NPCS TAB ═══ */}
          {activeTab === "npcs" && (
            <motion.div
              key="npcs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {TRADE_NPCS.map((npc, i) => {
                const factionInfo = FACTION_COLORS[npc.faction];
                const FactionIcon = factionInfo?.icon || Users;
                const behaviorInfo = BEHAVIOR_LABELS[npc.behavior];

                return (
                  <motion.button
                    key={npc.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedNpc(npc)}
                    className="text-left rounded-lg border overflow-hidden transition-all hover:scale-[1.02] group"
                    style={{
                      borderColor: `${factionInfo?.color || "#888"}20`,
                      background: `${factionInfo?.color || "#888"}05`,
                    }}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border"
                          style={{
                            borderColor: `${factionInfo?.color || "#888"}30`,
                            background: `linear-gradient(135deg, ${factionInfo?.color || "#888"}15, ${factionInfo?.color || "#888"}05)`,
                          }}
                        >
                          <FactionIcon size={18} style={{ color: factionInfo?.color || "#888" }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                            {npc.name}
                          </h4>
                          <p className="font-mono text-[9px] text-muted-foreground tracking-wider">{npc.title}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span
                          className="px-1.5 py-0.5 rounded text-[8px] font-mono border"
                          style={{
                            backgroundColor: `${factionInfo?.color || "#888"}10`,
                            color: factionInfo?.color || "#888",
                            borderColor: `${factionInfo?.color || "#888"}25`,
                          }}
                        >
                          {npc.faction.toUpperCase()}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono bg-secondary border border-border/20 ${behaviorInfo?.color || "text-muted-foreground"}`}>
                          {behaviorInfo?.label || npc.behavior.toUpperCase()}
                        </span>
                      </div>

                      <p className="font-mono text-[10px] text-muted-foreground/60 italic line-clamp-2">
                        "{npc.quote}"
                      </p>
                    </div>
                    <div className="h-0.5" style={{ background: `linear-gradient(to right, transparent, ${factionInfo?.color || "#888"}60, transparent)` }} />
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {/* ═══ REPUTATION TAB ═══ */}
          {activeTab === "reputation" && (
            <motion.div
              key="reputation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Morality Meter */}
              <div className="rounded-lg border border-border/30 bg-card/30 p-5">
                <h3 className="font-display text-sm font-bold tracking-wider text-foreground mb-4 flex items-center gap-2">
                  <Scale size={14} className="text-primary" />
                  MORALITY SPECTRUM
                </h3>
                <div className="relative mb-3">
                  <div className="h-3 rounded-full bg-gradient-to-r from-red-500/30 via-muted/30 to-cyan-500/30 overflow-hidden">
                    <div
                      className="absolute top-0 h-3 w-1 bg-white rounded-full shadow-lg"
                      style={{ left: `${50 + (state.moralityScore / 2)}%`, transform: "translateX(-50%)" }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="font-mono text-[9px] text-red-400">MACHINE (-100)</span>
                    <span className="font-mono text-[9px] text-muted-foreground">NEUTRAL</span>
                    <span className="font-mono text-[9px] text-cyan-400">HUMANITY (+100)</span>
                  </div>
                </div>
                <p className="font-mono text-xs text-muted-foreground text-center">
                  Current alignment: {state.moralityScore !== 0 ? (
                    <>
                      <span className={`font-bold ${state.moralityScore > 0 ? "text-cyan-400" : "text-red-400"}`}>
                        {state.moralityScore > 0 ? "HUMANITY" : "MACHINE"}
                      </span>
                      {" "}({state.moralityScore > 0
                        ? `HUMANITY +${state.moralityScore} / MACHINE -${state.moralityScore}`
                        : `MACHINE +${Math.abs(state.moralityScore)} / HUMANITY ${state.moralityScore}`})
                    </>
                  ) : (
                    <span className="font-bold text-muted-foreground">NEUTRAL</span>
                  )}
                </p>
              </div>

              {/* Faction Reputation Detail */}
              {Object.entries(FACTION_COLORS).map(([faction, info]) => {
                const rep = state.factionReputation[faction] || 0;
                const FIcon = info.icon;
                const standing = rep >= 50 ? "ALLIED" : rep >= 20 ? "FRIENDLY" : rep >= -20 ? "NEUTRAL" : rep >= -50 ? "HOSTILE" : "ENEMY";
                const standingColor = rep >= 20 ? "text-emerald-400" : rep >= -20 ? "text-muted-foreground" : "text-red-400";

                return (
                  <div
                    key={faction}
                    className="rounded-lg border p-4"
                    style={{ borderColor: `${info.color}20`, background: `${info.color}05` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FIcon size={16} style={{ color: info.color }} />
                        <span className="font-display text-sm font-bold tracking-wider text-foreground capitalize">{faction}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-[10px] ${standingColor}`}>{standing}</span>
                        <span className="font-display text-lg font-bold" style={{ color: info.color }}>
                          {rep > 0 ? "+" : ""}{rep}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(5, 50 + (rep / 2))}%`,
                          background: info.color,
                          opacity: 0.7,
                        }}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Diplomacy History */}
              {state.diplomacyChoices.length > 0 && (
                <div className="rounded-lg border border-border/30 bg-card/30 p-4">
                  <h3 className="font-display text-sm font-bold tracking-wider text-foreground mb-3 flex items-center gap-2">
                    <MessageCircle size={14} className="text-primary" />
                    DECISION LOG
                  </h3>
                  <div className="space-y-2">
                    {state.diplomacyChoices.map((choice, i) => {
                      const event = DIPLOMACY_EVENTS.find(e => e.id === choice.eventId);
                      const choiceObj = event?.choices.find(c => c.id === choice.choiceId);
                      return (
                        <div key={i} className="flex items-center gap-3 py-1.5 border-b border-border/10 last:border-0">
                          <div className={`w-2 h-2 rounded-full ${
                            choice.moralityDelta > 0 ? "bg-cyan-400" : choice.moralityDelta < 0 ? "bg-red-400" : "bg-muted-foreground"
                          }`} />
                          <div className="flex-1 min-w-0">
                            <span className="font-mono text-[10px] text-foreground">{event?.title || "Unknown"}</span>
                          </div>
                          <span className={`font-mono text-[10px] ${
                            choice.moralityDelta > 0 ? "text-cyan-400" : choice.moralityDelta < 0 ? "text-red-400" : "text-muted-foreground"
                          }`}>
                            {choice.moralityDelta > 0 ? "+" : ""}{choice.moralityDelta}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
