import { useGame } from "@/contexts/GameContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Swords, Shield, Skull, ChevronRight, Trophy, Map,
  Zap, Target, Clock, Star, AlertTriangle, Crown
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import {
  FACTION_WAR_EVENTS,
  getNextWarEvent,
  getContributionRank,
  type FactionWarEvent,
} from "@/data/factionWarData";

export default function FactionWarPage() {
  const {
    state,
    startFactionWar,
    contributeFactionWar,
    endFactionWar,
  } = useGame();

  const fw = state.factionWarState;
  const [phase, setPhase] = useState<"lobby" | "briefing" | "active" | "outcome">("lobby");
  const [selectedWar, setSelectedWar] = useState<FactionWarEvent | null>(null);
  const [selectedFaction, setSelectedFaction] = useState<"empire" | "insurgency" | null>(null);
  const [outcomeText, setOutcomeText] = useState("");
  const [typewriterIdx, setTypewriterIdx] = useState(0);
  const [showContributeEffect, setShowContributeEffect] = useState(false);

  // If there's an active war, go to active phase
  useEffect(() => {
    if (fw.activeWar) {
      const war = FACTION_WAR_EVENTS.find(w => w.id === fw.activeWar);
      if (war) {
        setSelectedWar(war);
        setPhase("active");
      }
    }
  }, []);

  // Typewriter effect for outcome text
  useEffect(() => {
    if (phase !== "outcome" || !outcomeText) return;
    if (typewriterIdx >= outcomeText.length) return;
    const timer = setTimeout(() => setTypewriterIdx(prev => prev + 1), 15);
    return () => clearTimeout(timer);
  }, [typewriterIdx, outcomeText, phase]);

  const nextWar = useMemo(() => getNextWarEvent(fw.completedWars, state.conexusXp), [fw.completedWars, state.conexusXp]);
  const contributionRank = useMemo(() => getContributionRank(fw.playerContribution), [fw.playerContribution]);

  const handleStartWar = () => {
    if (!selectedWar || !selectedFaction) return;
    startFactionWar(selectedWar.id, selectedFaction);
    setPhase("active");
  };

  const handleContribute = (amount: number) => {
    contributeFactionWar(amount);
    setShowContributeEffect(true);
    setTimeout(() => setShowContributeEffect(false), 600);
  };

  const handleEndWar = () => {
    if (!selectedWar) return;
    const result = endFactionWar();
    const narratives = selectedWar.narratives;
    const text = result.winner === "empire" ? narratives.empireWin
      : result.winner === "insurgency" ? narratives.insurgencyWin
      : narratives.stalemate;
    setOutcomeText(text);
    setTypewriterIdx(0);
    setPhase("outcome");
  };

  const warProgress = selectedWar ? Math.min(100, (fw.warProgress / selectedWar.duration) * 100) : 0;
  const isWarComplete = selectedWar ? fw.warProgress >= selectedWar.duration : false;

  return (
    <div className="min-h-screen p-4 sm:p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-red-500/10 border border-red-500/30">
            <Swords size={18} className="text-red-400" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold tracking-wider">FACTION WARS</h1>
            <p className="font-mono text-[10px] text-muted-foreground tracking-wider">GALACTIC CONFLICT // CHOOSE YOUR SIDE</p>
          </div>
        </div>

        {/* War History Banner */}
        {fw.warHistory.length > 0 && phase === "lobby" && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={14} className="text-amber-400" />
              <span className="font-mono text-xs font-bold text-amber-400">WAR RECORD</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {fw.warHistory.map((h, i) => {
                const war = FACTION_WAR_EVENTS.find(w => w.id === h.warId);
                return (
                  <div key={i} className="rounded-md bg-card/30 border border-border/20 p-2">
                    <p className="font-mono text-[10px] text-muted-foreground truncate">{war?.name || h.warId}</p>
                    <p className={`font-mono text-xs font-bold ${h.winner === "empire" ? "text-blue-400" : h.winner === "insurgency" ? "text-red-400" : "text-muted-foreground"}`}>
                      {h.winner.toUpperCase()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Exclusive Routes */}
        {fw.activeExclusiveRoutes.length > 0 && phase === "lobby" && (
          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Map size={14} className="text-green-400" />
              <span className="font-mono text-xs font-bold text-green-400">ACTIVE EXCLUSIVE ROUTES</span>
            </div>
            {fw.activeExclusiveRoutes.map(r => (
              <div key={r.routeId} className="flex items-center justify-between font-mono text-xs">
                <span className="text-foreground">{r.routeId}</span>
                <span className="text-muted-foreground">{r.warpsRemaining} warps remaining</span>
              </div>
            ))}
          </div>
        )}

        {/* ═══ LOBBY PHASE ═══ */}
        {phase === "lobby" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Available Wars */}
            <div className="rounded-lg border border-border/30 bg-card/30 p-4">
              <h2 className="font-display text-sm font-bold tracking-wider mb-4 flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-400" />
                AVAILABLE CONFLICTS
              </h2>

              {FACTION_WAR_EVENTS.map(war => {
                const isCompleted = fw.completedWars.includes(war.id);
                const isLocked = state.conexusXp < war.minLevel;
                const isAvailable = !isCompleted && !isLocked;

                return (
                  <div
                    key={war.id}
                    className={`rounded-lg border p-4 mb-3 transition-all ${
                      isAvailable
                        ? "border-border/40 bg-card/20 hover:border-primary/30 cursor-pointer"
                        : isCompleted
                        ? "border-green-500/20 bg-green-500/5 opacity-60"
                        : "border-border/20 bg-card/10 opacity-40"
                    }`}
                    onClick={() => {
                      if (isAvailable) {
                        setSelectedWar(war);
                        setPhase("briefing");
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{war.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-display text-sm font-bold" style={{ color: war.color }}>{war.name}</span>
                          {isCompleted && <span className="font-mono text-[9px] text-green-400 bg-green-500/20 px-1.5 py-0.5 rounded">COMPLETED</span>}
                          {isLocked && <span className="font-mono text-[9px] text-muted-foreground bg-secondary/30 px-1.5 py-0.5 rounded">LVL {war.minLevel}+</span>}
                        </div>
                        <p className="font-mono text-[10px] text-muted-foreground mt-1 line-clamp-2">{war.description}</p>
                      </div>
                      {isAvailable && <ChevronRight size={16} className="text-muted-foreground" />}
                    </div>
                    <div className="flex gap-4 mt-2 font-mono text-[9px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock size={10} /> {war.duration} TURNS</span>
                      <span className="flex items-center gap-1"><Star size={10} /> {war.victoryRewards.credits.toLocaleString()} CR</span>
                      <span className="flex items-center gap-1"><Target size={10} /> {war.contestedSectors.length} SECTORS</span>
                    </div>
                  </div>
                );
              })}

              {!nextWar && fw.completedWars.length === FACTION_WAR_EVENTS.length && (
                <div className="text-center py-8">
                  <Crown size={32} className="text-amber-400 mx-auto mb-3" />
                  <p className="font-display text-sm font-bold text-amber-400">ALL WARS COMPLETED</p>
                  <p className="font-mono text-xs text-muted-foreground mt-1">You have shaped the fate of the galaxy.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ═══ BRIEFING PHASE ═══ */}
        {phase === "briefing" && selectedWar && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* War Briefing */}
            <div className="rounded-lg border border-amber-500/30 bg-card/30 p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{selectedWar.icon}</span>
                <div>
                  <h2 className="font-display text-lg font-bold" style={{ color: selectedWar.color }}>{selectedWar.name}</h2>
                  <p className="font-mono text-[10px] text-muted-foreground">PRIORITY BRIEFING // CLASSIFIED</p>
                </div>
              </div>

              <div className="rounded-md bg-black/30 border border-amber-500/20 p-4 mb-4 font-mono text-xs text-foreground/80 whitespace-pre-line leading-relaxed">
                {selectedWar.narratives.start}
              </div>

              {/* Contested Sectors */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedWar.contestedSectors.map(s => (
                  <span key={s} className="font-mono text-[9px] px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400">
                    {s.replace(/_/g, " ").toUpperCase()}
                  </span>
                ))}
              </div>

              {/* Rewards Preview */}
              <div className="rounded-md bg-secondary/20 p-3 mb-4">
                <p className="font-mono text-[9px] text-muted-foreground mb-2">VICTORY REWARDS</p>
                <div className="flex flex-wrap gap-3 font-mono text-xs">
                  <span className="text-amber-400">{selectedWar.victoryRewards.credits.toLocaleString()} CR</span>
                  {selectedWar.victoryRewards.materials.map(m => (
                    <span key={m.materialId} className="text-green-400">{m.quantity}x {m.materialId.replace(/_/g, " ")}</span>
                  ))}
                  {selectedWar.victoryRewards.exclusiveRoute && (
                    <span className="text-purple-400">+ Exclusive Trade Route</span>
                  )}
                </div>
              </div>

              {/* Faction Selection */}
              <p className="font-display text-xs font-bold tracking-wider mb-3">CHOOSE YOUR ALLEGIANCE</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => setSelectedFaction("empire")}
                  className={`rounded-lg border p-4 text-left transition-all ${
                    selectedFaction === "empire"
                      ? "border-blue-500/50 bg-blue-500/10 box-glow-cyan"
                      : "border-border/30 bg-card/20 hover:border-blue-500/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Shield size={16} className="text-blue-400" />
                    <span className="font-display text-sm font-bold text-blue-400">THE EMPIRE</span>
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground">Order through strength. Control through commerce. The Empire's vision of a unified galaxy under one banner.</p>
                  <p className="font-mono text-[9px] text-blue-400/60 mt-2">Current Rep: {state.factionReputation.empire || 0}</p>
                </button>
                <button
                  onClick={() => setSelectedFaction("insurgency")}
                  className={`rounded-lg border p-4 text-left transition-all ${
                    selectedFaction === "insurgency"
                      ? "border-red-500/50 bg-red-500/10"
                      : "border-border/30 bg-card/20 hover:border-red-500/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Skull size={16} className="text-red-400" />
                    <span className="font-display text-sm font-bold text-red-400">THE INSURGENCY</span>
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground">Freedom through resistance. Liberation through chaos. The Insurgency fights for a galaxy without masters.</p>
                  <p className="font-mono text-[9px] text-red-400/60 mt-2">Current Rep: {state.factionReputation.insurgency || 0}</p>
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setPhase("lobby"); setSelectedFaction(null); }}
                  className="px-4 py-2 rounded-md border border-border/30 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  ABORT
                </button>
                <button
                  onClick={handleStartWar}
                  disabled={!selectedFaction}
                  className={`flex-1 py-2.5 rounded-md font-mono text-xs font-bold transition-all ${
                    selectedFaction
                      ? selectedFaction === "empire"
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/40 hover:bg-blue-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30"
                      : "bg-secondary/20 text-muted-foreground/50 border border-border/20 cursor-not-allowed"
                  }`}
                >
                  {selectedFaction ? `DEPLOY FOR THE ${selectedFaction.toUpperCase()}` : "SELECT A FACTION"}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ ACTIVE WAR PHASE ═══ */}
        {phase === "active" && selectedWar && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* War Status */}
            <div className={`rounded-lg border p-4 ${
              fw.playerFaction === "empire" ? "border-blue-500/30 bg-blue-500/5" : "border-red-500/30 bg-red-500/5"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedWar.icon}</span>
                  <div>
                    <h2 className="font-display text-sm font-bold" style={{ color: selectedWar.color }}>{selectedWar.name}</h2>
                    <p className="font-mono text-[9px] text-muted-foreground">TURN {fw.warProgress}/{selectedWar.duration}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs font-bold" style={{ color: contributionRank.color }}>{contributionRank.rank}</p>
                  <p className="font-mono text-[9px] text-muted-foreground">YOUR RANK</p>
                </div>
              </div>

              {/* War Progress Bar */}
              <div className="mb-4">
                <div className="h-2 rounded-full bg-secondary/30 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: selectedWar.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${warProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="flex justify-between font-mono text-[9px] text-muted-foreground mt-1">
                  <span>PROGRESS</span>
                  <span>{Math.round(warProgress)}%</span>
                </div>
              </div>

              {/* Faction Contributions */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className={`rounded-md p-3 ${fw.playerFaction === "empire" ? "bg-blue-500/10 border border-blue-500/20" : "bg-blue-500/5 border border-border/20"}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Shield size={12} className="text-blue-400" />
                    <span className="font-mono text-[10px] font-bold text-blue-400">EMPIRE</span>
                  </div>
                  <p className="font-display text-lg font-bold text-blue-300">{fw.empireContribution.toLocaleString()}</p>
                  <p className="font-mono text-[9px] text-muted-foreground">WAR POINTS</p>
                </div>
                <div className={`rounded-md p-3 ${fw.playerFaction === "insurgency" ? "bg-red-500/10 border border-red-500/20" : "bg-red-500/5 border border-border/20"}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Skull size={12} className="text-red-400" />
                    <span className="font-mono text-[10px] font-bold text-red-400">INSURGENCY</span>
                  </div>
                  <p className="font-display text-lg font-bold text-red-300">{fw.insurgencyContribution.toLocaleString()}</p>
                  <p className="font-mono text-[9px] text-muted-foreground">WAR POINTS</p>
                </div>
              </div>

              {/* Your Contribution */}
              <div className="rounded-md bg-secondary/20 p-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">YOUR CONTRIBUTION</span>
                  <span className="font-display text-sm font-bold text-amber-400">{fw.playerContribution.toLocaleString()} pts</span>
                </div>
              </div>

              {/* Contribute Actions */}
              {!isWarComplete ? (
                <div className="space-y-2">
                  <p className="font-mono text-[9px] text-muted-foreground">CONTRIBUTE TO THE WAR EFFORT</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "SMALL SUPPLY", amount: 1000, desc: "Trade goods" },
                      { label: "ARMS SHIPMENT", amount: 5000, desc: "Military supplies" },
                      { label: "FLEET SUPPORT", amount: 15000, desc: "Capital ships" },
                    ].map(opt => (
                      <button
                        key={opt.label}
                        onClick={() => handleContribute(opt.amount)}
                        className={`rounded-md border p-2.5 text-center transition-all hover:scale-[1.02] active:scale-95 ${
                          fw.playerFaction === "empire"
                            ? "border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10"
                            : "border-red-500/30 bg-red-500/5 hover:bg-red-500/10"
                        } ${showContributeEffect ? "ring-2 ring-amber-400/50" : ""}`}
                      >
                        <Zap size={14} className="mx-auto mb-1 text-amber-400" />
                        <p className="font-mono text-[10px] font-bold">{opt.label}</p>
                        <p className="font-mono text-[9px] text-muted-foreground">{opt.desc}</p>
                        <p className="font-mono text-xs text-amber-400 mt-1">+{opt.amount.toLocaleString()}</p>
                      </button>
                    ))}
                  </div>
                  <p className="font-mono text-[9px] text-muted-foreground text-center mt-2">
                    TIP: Trading in contested sectors during Trade Empire also contributes war points!
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    <Swords size={32} className="mx-auto mb-3 text-amber-400" />
                  </motion.div>
                  <p className="font-display text-sm font-bold text-amber-400 mb-2">WAR CONCLUDED</p>
                  <p className="font-mono text-xs text-muted-foreground mb-4">The battle is over. View the outcome.</p>
                  <button
                    onClick={handleEndWar}
                    className="px-6 py-2.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono text-xs font-bold hover:bg-amber-500/30 transition-all"
                  >
                    VIEW OUTCOME
                  </button>
                </div>
              )}
            </div>

            {/* Contested Sectors Status */}
            <div className="rounded-lg border border-border/30 bg-card/30 p-4">
              <h3 className="font-display text-xs font-bold tracking-wider mb-3 flex items-center gap-2">
                <Target size={12} className="text-primary" />
                CONTESTED SECTORS
              </h3>
              <div className="space-y-2">
                {selectedWar.contestedSectors.map(sector => {
                  const total = fw.empireContribution + fw.insurgencyContribution;
                  const empirePercent = total > 0 ? (fw.empireContribution / total) * 100 : 50;
                  return (
                    <div key={sector} className="rounded-md bg-secondary/20 p-2">
                      <p className="font-mono text-[10px] text-foreground mb-1">{sector.replace(/_/g, " ").toUpperCase()}</p>
                      <div className="h-1.5 rounded-full bg-red-500/30 overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${empirePercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between font-mono text-[8px] text-muted-foreground mt-0.5">
                        <span className="text-blue-400">EMPIRE</span>
                        <span className="text-red-400">INSURGENCY</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ OUTCOME PHASE ═══ */}
        {phase === "outcome" && selectedWar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="rounded-lg border border-amber-500/30 bg-card/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trophy size={24} className="text-amber-400" />
                <div>
                  <h2 className="font-display text-lg font-bold text-amber-400">WAR OUTCOME</h2>
                  <p className="font-mono text-[10px] text-muted-foreground">{selectedWar.name} // DECLASSIFIED</p>
                </div>
              </div>

              {/* Typewriter Narrative */}
              <div className="rounded-md bg-black/40 border border-amber-500/20 p-4 mb-4 min-h-[120px]">
                <p className="font-mono text-xs text-foreground/80 whitespace-pre-line leading-relaxed">
                  {outcomeText.slice(0, typewriterIdx)}
                  {typewriterIdx < outcomeText.length && (
                    <span className="inline-block w-1.5 h-4 bg-amber-400 animate-pulse ml-0.5" />
                  )}
                </p>
              </div>

              {/* Final Stats */}
              {typewriterIdx >= outcomeText.length && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-md bg-secondary/20 p-3 text-center">
                      <p className="font-display text-lg font-bold" style={{ color: contributionRank.color }}>{contributionRank.rank}</p>
                      <p className="font-mono text-[9px] text-muted-foreground">YOUR RANK</p>
                    </div>
                    <div className="rounded-md bg-secondary/20 p-3 text-center">
                      <p className="font-display text-lg font-bold text-amber-400">{fw.playerContribution.toLocaleString()}</p>
                      <p className="font-mono text-[9px] text-muted-foreground">CONTRIBUTION</p>
                    </div>
                    <div className="rounded-md bg-secondary/20 p-3 text-center">
                      <p className="font-display text-lg font-bold text-green-400">{selectedWar.victoryRewards.credits.toLocaleString()}</p>
                      <p className="font-mono text-[9px] text-muted-foreground">CREDITS WON</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setPhase("lobby");
                      setSelectedWar(null);
                      setSelectedFaction(null);
                    }}
                    className="w-full py-2.5 rounded-md bg-primary/10 border border-primary/30 text-primary font-mono text-xs font-bold hover:bg-primary/20 transition-all"
                  >
                    RETURN TO WAR ROOM
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
