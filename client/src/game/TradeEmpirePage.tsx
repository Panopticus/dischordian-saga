/* ═══════════════════════════════════════════════════════
   TRADE EMPIRE PAGE — Galactic strategy command center
   Galaxy map, mission dispatch, agent management,
   diplomacy, and fleet operations.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Users, Swords, Shield, Package, Target, ChevronRight,
  ArrowLeft, Clock, Star, AlertTriangle, MapPin, Send, Eye,
} from "lucide-react";
import GalacticMap from "./GalacticMap";
import {
  GALACTIC_MAP, GALACTIC_FACTIONS, STARTER_MISSIONS,
  createInitialEmpire, type EmpireState, type MissionDef, type GalacticFactionId,
} from "./tradeEmpire";

type View = "map" | "missions" | "agents" | "diplomacy" | "fleet" | "sector_detail";

const MISSION_TYPE_ICONS: Record<string, typeof Globe> = {
  trade: Package, espionage: Eye, diplomacy: Users, combat: Swords,
  recruitment: Users, exploration: Globe, sabotage: AlertTriangle,
  rescue: Shield, construction: MapPin, lore_hunt: Star,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  routine: "#22c55e", challenging: "#eab308", dangerous: "#f97316", suicidal: "#ef4444",
};

export default function TradeEmpirePage() {
  const [view, setView] = useState<View>("map");
  const [empire, setEmpire] = useState<EmpireState>(() => {
    const saved = localStorage.getItem("trade_empire_state");
    return saved ? JSON.parse(saved) : createInitialEmpire();
  });
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedMission, setSelectedMission] = useState<MissionDef | null>(null);

  // Save empire state
  const saveEmpire = useCallback((newState: EmpireState) => {
    setEmpire(newState);
    localStorage.setItem("trade_empire_state", JSON.stringify(newState));
  }, []);

  // Available missions based on narrative flags
  const availableMissions = useMemo(() => {
    return STARTER_MISSIONS.filter(m => {
      if (m.requiresFlag) return false; // TODO: check actual flags
      return !empire.completedMissions.includes(m.id);
    });
  }, [empire.completedMissions]);

  // Active mission sectors
  const activeMissionSectors = useMemo(() => {
    return new Set(empire.activeMissions.map(am => {
      const mission = STARTER_MISSIONS.find(m => m.id === am.missionId);
      return mission?.targetSector || "";
    }));
  }, [empire.activeMissions]);

  // Dispatch a mission
  const dispatchMission = useCallback((mission: MissionDef) => {
    if (mission.cost.credits && empire.credits < mission.cost.credits) return;
    if (mission.cost.materials && empire.materials < mission.cost.materials) return;

    const newEmpire = { ...empire };
    if (mission.cost.credits) newEmpire.credits -= mission.cost.credits;
    if (mission.cost.materials) newEmpire.materials -= mission.cost.materials;
    if (mission.cost.influence) newEmpire.influence -= mission.cost.influence;

    const now = Date.now();
    newEmpire.activeMissions = [...empire.activeMissions, {
      missionId: mission.id,
      agentId: "self", // Player does it themselves initially
      startTime: now,
      endTime: now + mission.duration * 3600000,
    }];

    saveEmpire(newEmpire);
    setSelectedMission(null);
  }, [empire, saveEmpire]);

  // Check completed missions
  const completedActiveMissions = useMemo(() => {
    return empire.activeMissions.filter(am => Date.now() >= am.endTime);
  }, [empire.activeMissions]);

  // Collect mission rewards
  const collectRewards = useCallback((missionId: string) => {
    const mission = STARTER_MISSIONS.find(m => m.id === missionId);
    if (!mission) return;

    const newEmpire = { ...empire };
    if (mission.rewards.credits) newEmpire.credits += mission.rewards.credits;
    if (mission.rewards.materials) newEmpire.materials += mission.rewards.materials;
    if (mission.rewards.influence) newEmpire.influence += mission.rewards.influence;
    if (mission.rewards.intelligence) newEmpire.intelligence += mission.rewards.intelligence;

    // Apply reputation changes
    for (const rep of mission.reputationEffect) {
      if (newEmpire.diplomacy[rep.factionId]) {
        newEmpire.diplomacy[rep.factionId].reputation = Math.max(-100, Math.min(100,
          newEmpire.diplomacy[rep.factionId].reputation + rep.change
        ));
      }
    }

    newEmpire.activeMissions = empire.activeMissions.filter(am => am.missionId !== missionId);
    newEmpire.completedMissions = [...empire.completedMissions, missionId];
    saveEmpire(newEmpire);
  }, [empire, saveEmpire]);

  const selectedSectorData = selectedSector ? GALACTIC_MAP.find(s => s.id === selectedSector) : null;
  const selectedSectorFaction = selectedSectorData ? GALACTIC_FACTIONS[selectedSectorData.controlledBy] : null;

  return (
    <div className="min-h-screen bg-black p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 max-w-6xl mx-auto">
        <div>
          <h1 className="font-display text-xl tracking-[0.2em] text-white">GALACTIC COMMAND</h1>
          <p className="font-mono text-[10px] text-white/30">Ark Collective • Empire Level {empire.empireLevel}</p>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px]">
          <span className="text-amber-400">{empire.credits} <span className="text-white/20">CRD</span></span>
          <span className="text-cyan-400">{empire.materials} <span className="text-white/20">MAT</span></span>
          <span className="text-purple-400">{empire.influence} <span className="text-white/20">INF</span></span>
          <span className="text-blue-400">{empire.intelligence} <span className="text-white/20">INT</span></span>
          <span className="text-white/20">{empire.controlledSectors.length} sectors</span>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex gap-1 mb-4 max-w-6xl mx-auto overflow-x-auto">
        {[
          { id: "map" as View, label: "GALAXY MAP", icon: Globe },
          { id: "missions" as View, label: "MISSIONS", icon: Target },
          { id: "agents" as View, label: "AGENTS", icon: Users },
          { id: "diplomacy" as View, label: "DIPLOMACY", icon: Shield },
          { id: "fleet" as View, label: "FLEET", icon: Send },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setView(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-[10px] transition-colors ${
                view === tab.id ? "bg-white/10 text-white" : "bg-white/[0.02] text-white/30 hover:text-white/50"
              }`}>
              <Icon size={12} /> {tab.label}
              {tab.id === "missions" && completedActiveMissions.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-black text-[8px] flex items-center justify-center">{completedActiveMissions.length}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Galaxy Map View */}
        {view === "map" && (
          <div className="space-y-4">
            <GalacticMap
              empire={empire}
              selectedSector={selectedSector}
              onSelectSector={setSelectedSector}
              activeMissionSectors={activeMissionSectors}
            />

            {/* Sector detail panel */}
            {selectedSectorData && selectedSectorFaction && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedSectorFaction.color }} />
                    <h3 className="font-mono text-sm font-bold text-white">{selectedSectorData.name}</h3>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: selectedSectorFaction.color }}>
                    {selectedSectorFaction.name}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-3 mb-3">
                  <div className="text-center p-2 rounded bg-white/5">
                    <p className="font-mono text-xs text-amber-400 font-bold">{selectedSectorData.resources.credits}</p>
                    <p className="font-mono text-[8px] text-white/30">Credits/cycle</p>
                  </div>
                  <div className="text-center p-2 rounded bg-white/5">
                    <p className="font-mono text-xs text-cyan-400 font-bold">{selectedSectorData.resources.materials}</p>
                    <p className="font-mono text-[8px] text-white/30">Materials</p>
                  </div>
                  <div className="text-center p-2 rounded bg-white/5">
                    <p className={`font-mono text-xs font-bold ${selectedSectorData.threat > 60 ? "text-red-400" : "text-green-400"}`}>{selectedSectorData.threat}%</p>
                    <p className="font-mono text-[8px] text-white/30">Threat</p>
                  </div>
                  <div className="text-center p-2 rounded bg-white/5">
                    <p className="font-mono text-xs text-white font-bold">{selectedSectorData.stability}%</p>
                    <p className="font-mono text-[8px] text-white/30">Stability</p>
                  </div>
                </div>
                {selectedSectorData.lore && (
                  <p className="text-[10px] text-white/30 italic leading-relaxed">{selectedSectorData.lore}</p>
                )}
                {/* Available missions for this sector */}
                {availableMissions.filter(m => m.targetSector === selectedSector).map(mission => (
                  <button key={mission.id} onClick={() => setSelectedMission(mission)}
                    className="w-full mt-2 flex items-center gap-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/20 text-left hover:bg-amber-500/10 transition-colors">
                    <Target size={12} className="text-amber-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[10px] text-amber-400 font-bold truncate">{mission.name}</p>
                      <p className="font-mono text-[8px] text-white/30">from {mission.offeredBy}</p>
                    </div>
                    <ChevronRight size={10} className="text-white/20" />
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        )}

        {/* Missions View */}
        {view === "missions" && (
          <div className="space-y-3">
            {/* Completed missions ready to collect */}
            {completedActiveMissions.length > 0 && (
              <div className="space-y-2">
                <p className="font-mono text-[10px] text-emerald-400 tracking-wider">MISSIONS COMPLETE — COLLECT REWARDS</p>
                {completedActiveMissions.map(am => {
                  const mission = STARTER_MISSIONS.find(m => m.id === am.missionId);
                  if (!mission) return null;
                  return (
                    <button key={am.missionId} onClick={() => collectRewards(am.missionId)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-left hover:bg-emerald-500/20 transition-colors">
                      <Star size={16} className="text-emerald-400 shrink-0" />
                      <div className="flex-1">
                        <p className="font-mono text-xs text-white font-bold">{mission.name}</p>
                        <div className="flex gap-2 mt-1 font-mono text-[9px]">
                          {mission.rewards.credits && <span className="text-amber-400">+{mission.rewards.credits} CRD</span>}
                          {mission.rewards.materials && <span className="text-cyan-400">+{mission.rewards.materials} MAT</span>}
                          {mission.rewards.influence && <span className="text-purple-400">+{mission.rewards.influence} INF</span>}
                          {mission.rewards.intelligence && <span className="text-blue-400">+{mission.rewards.intelligence} INT</span>}
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-emerald-400 font-bold">COLLECT</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Active missions */}
            {empire.activeMissions.filter(am => Date.now() < am.endTime).length > 0 && (
              <div className="space-y-2">
                <p className="font-mono text-[10px] text-white/30 tracking-wider">ACTIVE MISSIONS</p>
                {empire.activeMissions.filter(am => Date.now() < am.endTime).map(am => {
                  const mission = STARTER_MISSIONS.find(m => m.id === am.missionId);
                  if (!mission) return null;
                  const progress = Math.min(100, ((Date.now() - am.startTime) / (am.endTime - am.startTime)) * 100);
                  const hoursLeft = Math.max(0, Math.ceil((am.endTime - Date.now()) / 3600000));
                  return (
                    <div key={am.missionId} className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-mono text-xs text-white font-bold">{mission.name}</p>
                        <span className="font-mono text-[9px] text-white/30 flex items-center gap-1"><Clock size={9} /> {hoursLeft}h</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full bg-cyan-500 transition-all" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Available missions */}
            <div className="space-y-2">
              <p className="font-mono text-[10px] text-white/30 tracking-wider">AVAILABLE MISSIONS</p>
              {availableMissions.map(mission => {
                const Icon = MISSION_TYPE_ICONS[mission.type] || Target;
                const canAfford = (!mission.cost.credits || empire.credits >= mission.cost.credits) &&
                  (!mission.cost.materials || empire.materials >= mission.cost.materials) &&
                  (!mission.cost.influence || empire.influence >= mission.cost.influence);
                return (
                  <button key={mission.id} onClick={() => setSelectedMission(mission)}
                    className={`w-full text-left p-3 rounded-xl border transition-colors ${
                      canAfford ? "bg-white/[0.02] border-white/10 hover:border-white/20" : "bg-white/[0.01] border-white/5 opacity-40"
                    }`}>
                    <div className="flex items-center gap-3">
                      <Icon size={14} style={{ color: DIFFICULTY_COLORS[mission.difficulty] }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-xs text-white font-bold truncate">{mission.name}</p>
                          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{
                            color: DIFFICULTY_COLORS[mission.difficulty],
                            backgroundColor: DIFFICULTY_COLORS[mission.difficulty] + "15",
                          }}>{mission.difficulty}</span>
                        </div>
                        <p className="font-mono text-[9px] text-white/30 truncate">{mission.description}</p>
                        <div className="flex items-center gap-3 mt-1 font-mono text-[8px] text-white/20">
                          <span className="flex items-center gap-0.5"><Clock size={8} /> {mission.duration}h</span>
                          <span>{mission.baseSuccessRate}% base</span>
                          <span>from {mission.offeredBy}</span>
                        </div>
                      </div>
                      <ChevronRight size={12} className="text-white/20 shrink-0" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Diplomacy View */}
        {view === "diplomacy" && (
          <div className="space-y-2">
            <p className="font-mono text-[10px] text-white/30 tracking-wider mb-3">FACTION RELATIONS</p>
            {Object.entries(empire.diplomacy).map(([fId, dip]) => {
              const faction = GALACTIC_FACTIONS[fId as GalacticFactionId];
              if (!faction) return null;
              return (
                <div key={fId} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10">
                  <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: faction.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-white font-bold truncate">{faction.name}</p>
                    <p className="font-mono text-[9px] text-white/30">{faction.leader}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-mono text-xs font-bold ${
                      dip.reputation > 30 ? "text-emerald-400" : dip.reputation > 0 ? "text-amber-400" : dip.reputation > -30 ? "text-orange-400" : "text-red-400"
                    }`}>{dip.reputation > 0 ? "+" : ""}{dip.reputation}</p>
                    <p className="font-mono text-[8px] text-white/20">
                      {dip.atWar ? "AT WAR" : dip.reputation > 50 ? "Allied" : dip.reputation > 20 ? "Friendly" : dip.reputation > -20 ? "Neutral" : dip.reputation > -50 ? "Hostile" : "Enemy"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Agents View */}
        {view === "agents" && (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <Users size={48} className="text-white/10" />
            <p className="font-mono text-sm text-white/30">No agents recruited yet.</p>
            <p className="font-mono text-[10px] text-white/20 max-w-sm text-center">
              Complete missions to discover recruitable allies. NPCs on the Ark may introduce agents as trust grows.
            </p>
          </div>
        )}

        {/* Fleet View */}
        {view === "fleet" && (
          <div className="space-y-2">
            <p className="font-mono text-[10px] text-white/30 tracking-wider mb-3">YOUR FLEET</p>
            {empire.fleet.map(ship => (
              <div key={ship.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10">
                <Send size={14} className="text-cyan-400 shrink-0" />
                <div className="flex-1">
                  <p className="font-mono text-xs text-white font-bold">{ship.name}</p>
                  <p className="font-mono text-[9px] text-white/30">{ship.type} • {ship.currentSector}</p>
                </div>
                <div className="flex gap-3 font-mono text-[9px] text-white/40">
                  <span>⚔{ship.combat}</span>
                  <span>🚀{ship.speed}</span>
                  <span>📦{ship.cargo}</span>
                  <span className={ship.health < ship.maxHealth * 0.5 ? "text-red-400" : "text-green-400"}>
                    HP {ship.health}/{ship.maxHealth}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mission detail modal */}
      <AnimatePresence>
        {selectedMission && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedMission(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="w-full max-w-md bg-black/95 border border-white/10 rounded-2xl p-5 space-y-4"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-sm font-bold text-white">{selectedMission.name}</h3>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded" style={{
                  color: DIFFICULTY_COLORS[selectedMission.difficulty],
                  backgroundColor: DIFFICULTY_COLORS[selectedMission.difficulty] + "15",
                }}>{selectedMission.difficulty}</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">{selectedMission.description}</p>
              {selectedMission.loreContext && (
                <p className="text-[10px] text-white/30 italic border-l-2 border-white/10 pl-3">{selectedMission.loreContext}</p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="font-mono text-[9px] text-white/30 mb-1">COST</p>
                  <div className="space-y-0.5 font-mono text-[10px]">
                    {selectedMission.cost.credits && <p className="text-amber-400">{selectedMission.cost.credits} Credits</p>}
                    {selectedMission.cost.materials && <p className="text-cyan-400">{selectedMission.cost.materials} Materials</p>}
                    {selectedMission.cost.influence && <p className="text-purple-400">{selectedMission.cost.influence} Influence</p>}
                    {!selectedMission.cost.credits && !selectedMission.cost.materials && !selectedMission.cost.influence && <p className="text-green-400">Free</p>}
                  </div>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-white/30 mb-1">REWARD</p>
                  <div className="space-y-0.5 font-mono text-[10px]">
                    {selectedMission.rewards.credits && <p className="text-amber-400">+{selectedMission.rewards.credits} Credits</p>}
                    {selectedMission.rewards.materials && <p className="text-cyan-400">+{selectedMission.rewards.materials} Materials</p>}
                    {selectedMission.rewards.influence && <p className="text-purple-400">+{selectedMission.rewards.influence} Influence</p>}
                    {selectedMission.rewards.intelligence && <p className="text-blue-400">+{selectedMission.rewards.intelligence} Intel</p>}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-white/30">
                <span className="flex items-center gap-1"><Clock size={10} /> {selectedMission.duration}h duration</span>
                <span>{selectedMission.baseSuccessRate}% success rate</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => dispatchMission(selectedMission)}
                  className="flex-1 py-2.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold hover:bg-cyan-500/30 transition-colors">
                  DISPATCH MISSION
                </button>
                <button onClick={() => setSelectedMission(null)}
                  className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/40 font-mono text-xs hover:text-white/60">
                  CANCEL
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
