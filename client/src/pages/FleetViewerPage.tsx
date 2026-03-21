import { useState, useMemo, useCallback } from "react";
import { useGame } from "@/contexts/GameContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Rocket, Shield, Zap, Eye, Star, Lock, Unlock,
  ChevronRight, ChevronDown, ArrowLeft, Crown, Radio,
  Swords, Heart, Sparkles, Compass, Wrench, Brain,
  Skull, Users, Ship, Target, Crosshair,
} from "lucide-react";
import {
  INCEPTION_ARKS, type InceptionArkDef,
} from "@/data/companionData";

// ═══════════════════════════════════════════════════════
// INCEPTION ARK FLEET VIEWER
// Explore the fleet of Inception Arks scattered across dimensions
// ═══════════════════════════════════════════════════════

const CLASS_ICONS: Record<string, typeof Rocket> = {
  "Prophet-Class": Brain,
  "Warrior-Class": Swords,
  "Builder-Class": Wrench,
  "Shadow-Class": Eye,
  "Virus-Class": Skull,
  "Genesis-Class": Sparkles,
  "Archon-Class": Crown,
};

const CLASS_DESCRIPTIONS: Record<string, string> = {
  "Prophet-Class": "Designed for precognitive navigation and early warning systems. Crystal-lattice hull resonates with probability matrices.",
  "Warrior-Class": "A fortress that flies. Reinforced with materials from the Warlord's personal armory. Every corridor is a kill zone.",
  "Builder-Class": "Part ship, part factory, part laboratory. Can manufacture anything from raw materials at the molecular level.",
  "Shadow-Class": "Equipped with the most advanced cloaking technology ever developed. Absorbs sensor signals like a black hole absorbs light.",
  "Virus-Class": "Sleek, fast, and lethal. Designed for surgical strikes that can disable a dreadnought without scratching the hull.",
  "Genesis-Class": "The first Inception Ark ever built. Carries the genetic template of the Ne-Yon species and dimensional frequencies for seeding new realities.",
  "Archon-Class": "Modified with Archon-level technology. Smaller than standard Arks but exponentially more advanced.",
};

export default function FleetViewerPage() {
  const { state, assignArk, discoverArk } = useGame();
  const [selectedArk, setSelectedArk] = useState<InceptionArkDef | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const playerClass = state.characterChoices?.characterClass;
  const assignedArkId = state.assignedArkId;

  // Find the player's class-matched ark
  const playerArk = useMemo(() => {
    if (!playerClass) return null;
    return INCEPTION_ARKS.find(a => a.playerClass === playerClass) || null;
  }, [playerClass]);

  // Sort arks: assigned first, then discovered, then undiscovered
  const sortedArks = useMemo(() => {
    return [...INCEPTION_ARKS].sort((a, b) => {
      if (a.id === assignedArkId) return -1;
      if (b.id === assignedArkId) return 1;
      const aDisc = state.discoveredArks.includes(a.id);
      const bDisc = state.discoveredArks.includes(b.id);
      if (aDisc && !bDisc) return -1;
      if (!aDisc && bDisc) return 1;
      return 0;
    });
  }, [assignedArkId, state.discoveredArks]);

  const handleAssignArk = useCallback((arkId: string) => {
    assignArk(arkId);
  }, [assignArk]);

  const handleDiscoverArk = useCallback((arkId: string) => {
    discoverArk(arkId);
  }, [discoverArk]);

  // ═══ DETAIL VIEW ═══
  if (selectedArk) {
    const isAssigned = assignedArkId === selectedArk.id;
    const isDiscovered = state.discoveredArks.includes(selectedArk.id);
    const isPlayerClassMatch = playerClass && selectedArk.playerClass === playerClass;
    const ClassIcon = CLASS_ICONS[selectedArk.class] || Rocket;

    return (
      <div className="min-h-screen p-4 sm:p-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setSelectedArk(null)}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4 font-mono text-xs"
          >
            <ArrowLeft size={14} />
            BACK TO FLEET
          </button>

          {/* Ark Header */}
          <div
            className="rounded-lg border overflow-hidden mb-6"
            style={{ borderColor: `${selectedArk.color}40` }}
          >
            {/* Top accent bar */}
            <div className="h-1" style={{ background: `linear-gradient(to right, transparent, ${selectedArk.color}, transparent)` }} />

            <div className="p-5 sm:p-6" style={{ background: `${selectedArk.color}08` }}>
              <div className="flex items-start gap-4 sm:gap-6">
                {/* Ark Icon */}
                <div
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 flex-shrink-0 flex items-center justify-center"
                  style={{
                    borderColor: `${selectedArk.color}50`,
                    background: `linear-gradient(135deg, ${selectedArk.color}15, ${selectedArk.color}05)`,
                  }}
                >
                  <ClassIcon size={36} style={{ color: selectedArk.color }} />
                  {isAssigned && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Star size={10} className="text-white fill-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-display text-xl sm:text-2xl font-black tracking-wider text-foreground">
                      {selectedArk.name}
                    </h2>
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground tracking-wider mb-1">
                    {selectedArk.designation} // {selectedArk.class}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground/80 mb-3">
                    {selectedArk.specialization}
                  </p>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-2">
                    {isAssigned && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        YOUR ARK
                      </span>
                    )}
                    {isPlayerClassMatch && !isAssigned && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        CLASS MATCH
                      </span>
                    )}
                    {isDiscovered && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-primary/20 text-primary border border-primary/30">
                        DISCOVERED
                      </span>
                    )}
                    <span
                      className="px-2 py-0.5 rounded text-[9px] font-mono border"
                      style={{
                        backgroundColor: `${selectedArk.color}15`,
                        color: selectedArk.color,
                        borderColor: `${selectedArk.color}30`,
                      }}
                    >
                      {selectedArk.class.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-5 sm:p-6 space-y-5">
              <div>
                <h3 className="font-display text-sm font-bold tracking-wider text-foreground mb-2 flex items-center gap-2">
                  <Ship size={14} style={{ color: selectedArk.color }} />
                  VESSEL PROFILE
                </h3>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                  {selectedArk.description}
                </p>
              </div>

              {/* AI Guardian */}
              <div className="rounded border border-border/30 bg-card/30 p-4">
                <h3 className="font-display text-sm font-bold tracking-wider text-foreground mb-2 flex items-center gap-2">
                  <Brain size={14} style={{ color: selectedArk.color }} />
                  AI GUARDIAN
                </h3>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                  {selectedArk.aiGuardian}
                </p>
              </div>

              {/* Card Stats */}
              <div className="rounded border border-border/30 bg-card/30 p-4">
                <h3 className="font-display text-sm font-bold tracking-wider text-foreground mb-3 flex items-center gap-2">
                  <Target size={14} style={{ color: selectedArk.color }} />
                  COMBAT SPECIFICATIONS
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-1">
                      <Swords size={18} className="text-red-400" />
                    </div>
                    <p className="font-display text-lg font-bold text-red-400">{selectedArk.cardStats.power}</p>
                    <p className="font-mono text-[9px] text-muted-foreground tracking-wider">POWER</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-1">
                      <Shield size={18} className="text-emerald-400" />
                    </div>
                    <p className="font-display text-lg font-bold text-emerald-400">{selectedArk.cardStats.health}</p>
                    <p className="font-mono text-[9px] text-muted-foreground tracking-wider">HEALTH</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-1">
                      <Zap size={18} className="text-amber-400" />
                    </div>
                    <p className="font-display text-lg font-bold text-amber-400">{selectedArk.cardStats.cost}</p>
                    <p className="font-mono text-[9px] text-muted-foreground tracking-wider">COST</p>
                  </div>
                </div>
              </div>

              {/* Class Description */}
              <div className="rounded border border-border/30 bg-card/30 p-4">
                <h3 className="font-display text-sm font-bold tracking-wider text-foreground mb-2 flex items-center gap-2">
                  <Compass size={14} style={{ color: selectedArk.color }} />
                  {selectedArk.class.toUpperCase()} OVERVIEW
                </h3>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                  {CLASS_DESCRIPTIONS[selectedArk.class] || selectedArk.description}
                </p>
              </div>

              {/* Assign Button */}
              {!isAssigned && (
                <button
                  onClick={() => handleAssignArk(selectedArk.id)}
                  className="w-full py-3 rounded-lg font-mono text-xs tracking-wider transition-all border"
                  style={{
                    backgroundColor: `${selectedArk.color}15`,
                    color: selectedArk.color,
                    borderColor: `${selectedArk.color}30`,
                  }}
                >
                  {isPlayerClassMatch ? "ASSIGN AS YOUR ARK (CLASS MATCH)" : "ASSIGN AS YOUR ARK"}
                </button>
              )}

              {/* Link to Ark Explorer */}
              {isAssigned && (
                <Link
                  href="/ark"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-mono text-xs tracking-wider bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-colors"
                >
                  EXPLORE YOUR ARK <ChevronRight size={14} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══ FLEET OVERVIEW ═══
  return (
    <div className="min-h-screen p-4 sm:p-6 pb-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="h-px flex-1 max-w-8 bg-gradient-to-r from-transparent to-primary/50" />
            <span className="font-mono text-[10px] text-primary/70 tracking-[0.3em]">INCEPTION ARK REGISTRY</span>
            <div className="h-px flex-1 max-w-8 bg-gradient-to-l from-transparent to-primary/50" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-wider text-foreground mb-2">
            THE <span className="text-primary glow-cyan">FLEET</span>
          </h1>
          <p className="font-mono text-xs text-muted-foreground max-w-xl leading-relaxed">
            The Engineer built dozens of Inception Arks before the Fall — massive vessels, each a seed of civilization. Most are dark. Some still carry the last survivors of a shattered universe.
          </p>
        </motion.div>

        {/* Your Assigned Ark Banner */}
        {assignedArkId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            {(() => {
              const ark = INCEPTION_ARKS.find(a => a.id === assignedArkId);
              if (!ark) return null;
              const ClassIcon = CLASS_ICONS[ark.class] || Rocket;
              return (
                <button
                  onClick={() => setSelectedArk(ark)}
                  className="w-full text-left rounded-lg border overflow-hidden transition-all hover:scale-[1.01] group"
                  style={{ borderColor: `${ark.color}30`, background: `${ark.color}08` }}
                >
                  <div className="p-4 flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 border"
                      style={{
                        borderColor: `${ark.color}40`,
                        background: `linear-gradient(135deg, ${ark.color}20, ${ark.color}05)`,
                      }}
                    >
                      <ClassIcon size={24} style={{ color: ark.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Star size={12} className="text-emerald-400 fill-emerald-400" />
                        <span className="font-mono text-[9px] text-emerald-400 tracking-wider">YOUR ASSIGNED ARK</span>
                      </div>
                      <h3 className="font-display text-lg font-bold tracking-wide text-foreground group-hover:text-primary transition-colors">
                        {ark.name}
                      </h3>
                      <p className="font-mono text-[10px] text-muted-foreground">
                        {ark.designation} // {ark.class}
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground/30 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="h-0.5" style={{ background: `linear-gradient(to right, transparent, ${ark.color}, transparent)` }} />
                </button>
              );
            })()}
          </motion.div>
        )}

        {/* Class Match Suggestion */}
        {playerClass && !assignedArkId && playerArk && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 rounded-lg border border-amber-500/30 bg-amber-950/10 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-amber-400" />
              <span className="font-mono text-[10px] text-amber-400 tracking-wider">CLASS MATCH DETECTED</span>
            </div>
            <p className="font-mono text-xs text-muted-foreground mb-3">
              As a <span className="text-amber-400 font-bold">{playerClass.toUpperCase()}</span>, the{" "}
              <span className="text-foreground font-bold">{playerArk.name}</span> ({playerArk.designation}) is designed for your specialization.
            </p>
            <button
              onClick={() => {
                handleAssignArk(playerArk.id);
                setSelectedArk(playerArk);
              }}
              className="px-4 py-2 rounded font-mono text-[10px] tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
            >
              ASSIGN & VIEW ARK
            </button>
          </motion.div>
        )}

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedArks.map((ark, i) => {
            const isAssigned = assignedArkId === ark.id;
            const isDiscovered = state.discoveredArks.includes(ark.id);
            const isClassMatch = playerClass && ark.playerClass === playerClass;
            const ClassIcon = CLASS_ICONS[ark.class] || Rocket;

            return (
              <motion.button
                key={ark.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => {
                  if (!isDiscovered) handleDiscoverArk(ark.id);
                  setSelectedArk(ark);
                }}
                className="text-left rounded-lg border overflow-hidden transition-all duration-300 hover:scale-[1.02] group"
                style={{
                  borderColor: isAssigned ? `${ark.color}50` : `${ark.color}20`,
                  background: isAssigned ? `${ark.color}10` : `${ark.color}05`,
                }}
              >
                <div className="p-4">
                  {/* Icon + Name */}
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 border transition-all"
                      style={{
                        borderColor: `${ark.color}30`,
                        background: `linear-gradient(135deg, ${ark.color}15, ${ark.color}05)`,
                      }}
                    >
                      <ClassIcon size={20} style={{ color: ark.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-sm font-bold tracking-wide text-foreground group-hover:text-primary transition-colors truncate">
                        {ark.name}
                      </h3>
                      <p className="font-mono text-[9px] text-muted-foreground tracking-wider">
                        {ark.designation}
                      </p>
                    </div>
                  </div>

                  {/* Class badge */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span
                      className="px-1.5 py-0.5 rounded text-[8px] font-mono border"
                      style={{
                        backgroundColor: `${ark.color}10`,
                        color: ark.color,
                        borderColor: `${ark.color}25`,
                      }}
                    >
                      {ark.class}
                    </span>
                    {isAssigned && (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        YOUR ARK
                      </span>
                    )}
                    {isClassMatch && !isAssigned && (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        CLASS MATCH
                      </span>
                    )}
                  </div>

                  {/* Specialization */}
                  <p className="font-mono text-[10px] text-muted-foreground/70 line-clamp-2 mb-3">
                    {ark.specialization}
                  </p>

                  {/* Card Stats Mini */}
                  <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground/50">
                    <span className="flex items-center gap-1">
                      <Swords size={10} className="text-red-400/60" /> {ark.cardStats.power}
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield size={10} className="text-emerald-400/60" /> {ark.cardStats.health}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap size={10} className="text-amber-400/60" /> {ark.cardStats.cost}
                    </span>
                  </div>
                </div>

                {/* Bottom accent */}
                <div className="h-0.5" style={{ background: `linear-gradient(to right, transparent, ${ark.color}80, transparent)` }} />
              </motion.button>
            );
          })}
        </div>

        {/* Fleet Lore */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 rounded-lg border border-border/30 bg-card/30 p-5"
        >
          <h3 className="font-display text-sm font-bold tracking-wider text-foreground mb-3 flex items-center gap-2">
            <Compass size={14} className="text-primary" />
            THE INCEPTION ARK PROJECT
          </h3>
          <div className="space-y-3 font-mono text-xs text-muted-foreground leading-relaxed">
            <p>
              When the Fall of Reality became inevitable, the Engineer — one of the most brilliant minds in the multiverse — began constructing the Inception Arks in secret. Each vessel was designed not merely to survive, but to carry the seeds of entire civilizations across the dimensional void.
            </p>
            <p>
              The CoNexus, originally an advanced construct designed as a universal blockchain bridge, was dismantled by the Architect and its technology repurposed into the Arks' core systems. Each Ark carries a CoNexus Core — a fragment of the original technology — enabling the CADES (CoNexus Advanced Dimensional Exploration Simulation) system that allows crews to immerse in any conceivable reality within the multiverse.
            </p>
            <p>
              Of the dozens of Arks launched, most have gone dark. The seven catalogued here represent the known survivors — each assigned to a different class of operative, each carrying a unique AI guardian, and each holding a piece of the puzzle that might lead to a new home.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
