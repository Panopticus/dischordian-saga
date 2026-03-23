import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useGame } from "@/contexts/GameContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import TransmissionDisplay from "@/components/TransmissionDisplay";
import type { TransmissionMessage } from "@/components/TransmissionDisplay";
import {
  ALL_RECRUITMENT_MISSIONS,
  SECTORS,
  DAILY_MISSIONS,
  WEEKLY_MISSIONS,
  EVENT_MISSIONS,
  getMissionsForSector,
  isSectorUnlocked,
  type RecruitmentMission,
  type DeploymentMissionTemplate,
} from "@/data/armyRecruitment";
import {
  Shield, Swords, Brain, Wrench, Skull, Users, MapPin,
  ChevronRight, Clock, Star, Zap, Target,
  Radio, AlertTriangle, Trophy, ArrowLeft, Play, Check,
  Lock, Crosshair, Send, RotateCcw,
} from "lucide-react";
import type { ArmyUnit, ArmyDeployment, ArmyUnitType, SectorControl } from "@/contexts/GameContext";

/* ═══ CONSTANTS ═══ */
const UNIT_TYPE_ICONS: Record<string, typeof Shield> = {
  operative: Swords, dreamer: Brain, engineer: Wrench, insurgent: Skull, diplomat: Star,
};
const UNIT_TYPE_COLORS: Record<string, string> = {
  operative: "text-destructive", dreamer: "text-chart-4", engineer: "text-accent",
  insurgent: "text-primary", diplomat: "text-yellow-400",
};
const UNIT_TYPE_BG: Record<string, string> = {
  operative: "bg-destructive/10 border-destructive/30",
  dreamer: "bg-chart-4/10 border-chart-4/30",
  engineer: "bg-accent/10 border-accent/30",
  insurgent: "bg-primary/10 border-primary/30",
  diplomat: "bg-yellow-400/10 border-yellow-400/30",
};

/* Map armyRecruitment UnitType to GameContext ArmyUnitType */
function toArmyUnitType(t: string): ArmyUnitType {
  const map: Record<string, ArmyUnitType> = {
    operative: "operative", dreamer: "dreamer", engineer: "engineer",
    insurgent: "insurgent", elite: "diplomat",
  };
  return map[t] || "operative";
}

/* ═══ HELPER: Time formatting ═══ */
function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return "COMPLETE";
  const mins = Math.floor(ms / 60000);
  const hrs = Math.floor(mins / 60);
  const remainMins = mins % 60;
  if (hrs > 0) return `${hrs}h ${remainMins}m`;
  return `${remainMins}m`;
}

/* ═══ SUB-COMPONENT: Sector Map ═══ */
function SectorMap({
  activeSector, setActiveSector, completedMissions,
}: {
  activeSector: number; setActiveSector: (s: number) => void; completedMissions: string[];
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={14} className="text-primary" />
        <span className="font-display text-xs font-bold tracking-[0.2em]">KAEL'S ROUTES</span>
      </div>
      {SECTORS.map((sector) => {
        const unlocked = isSectorUnlocked(sector.id, completedMissions);
        const missions = getMissionsForSector(sector.id);
        const completed = missions.filter((m: RecruitmentMission) => completedMissions.includes(m.id)).length;
        const isActive = activeSector === sector.id;
        return (
          <button
            key={sector.id}
            onClick={() => unlocked && setActiveSector(sector.id)}
            disabled={!unlocked}
            className={`w-full text-left p-3 rounded-lg border transition-all ${
              isActive
                ? "border-primary/50 bg-primary/10"
                : unlocked
                ? "border-border/30 bg-card/30 hover:border-primary/30 hover:bg-card/50"
                : "border-border/10 bg-card/10 opacity-40 cursor-not-allowed"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {unlocked ? (
                  React.createElement(UNIT_TYPE_ICONS[sector.unitType] || Shield, {
                    size: 14, className: UNIT_TYPE_COLORS[sector.unitType] || "text-muted-foreground",
                  })
                ) : (
                  <Lock size={14} className="text-muted-foreground" />
                )}
                <span className="font-mono text-xs font-semibold">{sector.name}</span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">
                {completed}/{missions.length}
              </span>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground/60 mt-1 line-clamp-1">
              {unlocked ? sector.description : sector.unlockCondition}
            </p>
          </button>
        );
      })}
    </div>
  );
}

/* ═══ SUB-COMPONENT: Mission Briefing ═══ */
function MissionBriefing({
  mission, playerName, onAccept, completed,
}: {
  mission: RecruitmentMission; playerName: string; onAccept: () => void; completed: boolean;
}) {
  const [briefingPhase, setBriefingPhase] = useState<"kael" | "elara" | "human" | "ready">("kael");
  const [showBriefing, setShowBriefing] = useState(false);

  const elaraText = mission.elaraAssessment.replace("{playerName}", playerName);

  if (completed) {
    return (
      <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
        <div className="flex items-center gap-2">
          <Check size={16} className="text-primary" />
          <span className="font-mono text-sm text-primary">MISSION COMPLETE</span>
        </div>
        <p className="font-mono text-xs text-muted-foreground mt-2">
          {mission.unitName} recruited from {mission.worldName}.
        </p>
      </div>
    );
  }

  if (!showBriefing) {
    return (
      <div className="space-y-3">
        <div className="p-4 rounded-lg border border-border/30 bg-card/30">
          <h4 className="font-display text-sm font-bold tracking-wide mb-1">{mission.worldName}</h4>
          <p className="font-mono text-xs text-muted-foreground">{mission.worldDescription}</p>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              {React.createElement(UNIT_TYPE_ICONS[mission.unitType] || Shield, {
                size: 12, className: UNIT_TYPE_COLORS[mission.unitType],
              })}
              <span className="font-mono text-[10px] text-muted-foreground">{mission.unitName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Target size={12} className="text-accent" />
              <span className="font-mono text-[10px] text-muted-foreground">{mission.testMissionType.toUpperCase()}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowBriefing(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary/10 border border-primary/40 text-primary text-xs font-mono hover:bg-primary/20 transition-all"
        >
          <Radio size={14} />
          RECEIVE BRIEFING
        </button>
      </div>
    );
  }

  const kaelMessages: TransmissionMessage[] = [{ speaker: "kael", text: mission.kaelLog }];
  const elaraMessages: TransmissionMessage[] = [{ speaker: "elara", text: elaraText }];
  const humanMessages: TransmissionMessage[] = [{
    speaker: "human", text: mission.humanIntel,
    voUrl: mission.humanVoAudioUrl, corruptionLevel: 40,
  }];

  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait">
        {briefingPhase === "kael" && (
          <motion.div key="kael" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mb-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-[10px] text-accent tracking-[0.3em]">KAEL'S LOG</span>
            </div>
            <TransmissionDisplay
              messages={kaelMessages}
              onAllComplete={() => setTimeout(() => setBriefingPhase("elara"), 800)}
              compact
            />
          </motion.div>
        )}
        {briefingPhase === "elara" && (
          <motion.div key="elara" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mb-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono text-[10px] text-cyan-400 tracking-[0.3em]">ELARA'S ASSESSMENT</span>
            </div>
            <TransmissionDisplay
              messages={elaraMessages}
              onAllComplete={() => setTimeout(() => setBriefingPhase("human"), 800)}
              compact
            />
          </motion.div>
        )}
        {briefingPhase === "human" && (
          <motion.div key="human" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mb-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono text-[10px] text-red-500 tracking-[0.3em]">ENCRYPTED SIGNAL</span>
            </div>
            <TransmissionDisplay
              messages={humanMessages}
              onAllComplete={() => setTimeout(() => setBriefingPhase("ready"), 800)}
              compact
            />
          </motion.div>
        )}
        {briefingPhase === "ready" && (
          <motion.div key="ready" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="p-4 rounded-lg border border-accent/30 bg-accent/5">
              <h4 className="font-display text-sm font-bold tracking-wide mb-1">MISSION READY</h4>
              <p className="font-mono text-xs text-muted-foreground mb-3">{mission.testMissionDescription}</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1.5">
                  <Zap size={12} className="text-accent" />
                  <span className="font-mono text-[10px]">{mission.rewards.xp} XP</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={12} className="text-yellow-400" />
                  <span className="font-mono text-[10px]">{mission.rewards.dreamTokens} DT</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Trophy size={12} className="text-primary" />
                  <span className="font-mono text-[10px]">{mission.rewards.cards} Cards</span>
                </div>
              </div>
              <button
                onClick={onAccept}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-accent/20 border border-accent/50 text-accent text-xs font-mono hover:bg-accent/30 transition-all"
              >
                <Play size={14} />
                LAUNCH MISSION
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══ SUB-COMPONENT: Deployed Mission Card ═══ */
function DeployedMissionCard({
  deployment, units, onComplete, now,
}: {
  deployment: ArmyDeployment; units: ArmyUnit[]; onComplete: (id: string) => void; now: number;
}) {
  const assignedUnits = units.filter((u: ArmyUnit) => deployment.unitIds.includes(u.id));
  const remaining = (deployment.startedAt + deployment.durationMs) - now;
  const progress = Math.min(100, Math.max(0, ((deployment.durationMs - Math.max(0, remaining)) / deployment.durationMs) * 100));
  const isComplete = remaining <= 0;

  return (
    <div className={`p-3 rounded-lg border ${isComplete ? "border-primary/40 bg-primary/5" : "border-border/30 bg-card/30"}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs font-semibold truncate">{deployment.missionName}</span>
        <span className={`font-mono text-[10px] ${isComplete ? "text-primary" : "text-muted-foreground"}`}>
          {isComplete ? "COMPLETE" : formatTimeRemaining(remaining)}
        </span>
      </div>
      {assignedUnits.length > 0 && (
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          {assignedUnits.map((u: ArmyUnit) => (
            <span key={u.id} className="flex items-center gap-1">
              {React.createElement(UNIT_TYPE_ICONS[u.type] || Shield, {
                size: 10, className: UNIT_TYPE_COLORS[u.type],
              })}
              <span className="font-mono text-[10px] text-muted-foreground">{u.name}</span>
            </span>
          ))}
        </div>
      )}
      <div className="w-full h-1.5 rounded-full bg-border/30 overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isComplete ? "bg-primary" : "bg-accent/60"}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {isComplete && (
        <button
          onClick={() => onComplete(deployment.id)}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 border border-primary/40 text-primary text-[10px] font-mono hover:bg-primary/20 transition-all"
        >
          <Check size={12} />
          COLLECT REPORT
        </button>
      )}
    </div>
  );
}

/* ═══ SUB-COMPONENT: Deploy Mission Dialog ═══ */
function DeployMissionDialog({
  template, units, playerName, onDeploy, onCancel,
}: {
  template: DeploymentMissionTemplate;
  units: ArmyUnit[];
  playerName: string;
  onDeploy: (unitId: string) => void;
  onCancel: () => void;
}) {
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [briefingPhase, setBriefingPhase] = useState<"elara" | "human" | "ready">("elara");
  const availableUnits = units.filter((u: ArmyUnit) => !u.deployed);

  const elaraText = template.elaraBriefing.replace("{playerName}", playerName);
  const elaraMessages: TransmissionMessage[] = [{ speaker: "elara", text: elaraText }];
  const humanMessages: TransmissionMessage[] = [{ speaker: "human", text: template.humanBriefing, corruptionLevel: 35 }];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-lg border border-border/50 bg-card p-5"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-sm font-bold tracking-wide">{template.title}</h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <RotateCcw size={14} />
          </button>
        </div>

        <p className="font-mono text-xs text-muted-foreground mb-4">{template.description}</p>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-accent" />
            <span className="font-mono text-[10px]">{template.duration}m</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={12} className="text-destructive" />
            <span className="font-mono text-[10px]">Difficulty {template.difficulty}/5</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Target size={12} className="text-primary" />
            <span className="font-mono text-[10px]">{template.baseSuccessRate}% base</span>
          </div>
        </div>

        {/* Briefing */}
        <div className="mb-4 space-y-2">
          <AnimatePresence mode="wait">
            {briefingPhase === "elara" && (
              <motion.div key="elara" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <TransmissionDisplay
                  messages={elaraMessages}
                  onAllComplete={() => setTimeout(() => setBriefingPhase("human"), 500)}
                  compact
                />
              </motion.div>
            )}
            {briefingPhase === "human" && (
              <motion.div key="human" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <TransmissionDisplay
                  messages={humanMessages}
                  onAllComplete={() => setTimeout(() => setBriefingPhase("ready"), 500)}
                  compact
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {briefingPhase === "ready" && (
          <>
            {/* Unit Selection */}
            <div className="mb-4">
              <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] block mb-2">SELECT UNIT</span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {availableUnits.length === 0 ? (
                  <p className="font-mono text-xs text-muted-foreground/50 text-center py-4">No available units</p>
                ) : (
                  availableUnits.map((unit: ArmyUnit) => {
                    const isPreferred = template.preferredUnitTypes?.includes(unit.type as any);
                    return (
                      <button
                        key={unit.id}
                        onClick={() => setSelectedUnit(unit.id)}
                        className={`w-full text-left p-2 rounded-md border transition-all ${
                          selectedUnit === unit.id
                            ? "border-primary/50 bg-primary/10"
                            : "border-border/20 bg-card/20 hover:border-border/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {React.createElement(UNIT_TYPE_ICONS[unit.type] || Shield, {
                              size: 12, className: UNIT_TYPE_COLORS[unit.type],
                            })}
                            <span className="font-mono text-xs">{unit.name}</span>
                            {isPreferred && (
                              <span className="font-mono text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">PREFERRED</span>
                            )}
                          </div>
                          <span className="font-mono text-[10px] text-muted-foreground">Lv.{unit.level}</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Rewards */}
            <div className="flex items-center gap-3 mb-4">
              {template.rewards.credits > 0 && (
                <span className="font-mono text-[10px] text-accent">{template.rewards.credits} CR</span>
              )}
              {template.rewards.materials > 0 && (
                <span className="font-mono text-[10px] text-chart-4">{template.rewards.materials} MAT</span>
              )}
              {template.rewards.intel > 0 && (
                <span className="font-mono text-[10px] text-primary">{template.rewards.intel} INT</span>
              )}
              {template.rewards.xp > 0 && (
                <span className="font-mono text-[10px] text-yellow-400">{template.rewards.xp} XP</span>
              )}
            </div>

            <button
              onClick={() => selectedUnit && onDeploy(selectedUnit)}
              disabled={!selectedUnit}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-xs font-mono transition-all ${
                selectedUnit
                  ? "bg-accent/20 border border-accent/50 text-accent hover:bg-accent/30"
                  : "bg-border/10 border border-border/20 text-muted-foreground/50 cursor-not-allowed"
              }`}
            >
              <Send size={14} />
              DEPLOY UNIT
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ═══ MAIN COMPONENT ═══ */
export default function ArmyManagementPage() {
  const {
    state, recruitUnit, deployUnits, completeDeployment,
    getAvailableUnits, getActiveDeployments, checkDeploymentCompletion,
  } = useGame();
  const { playSong } = usePlayer();
  const [activeSector, setActiveSector] = useState(1);
  const [selectedMission, setSelectedMission] = useState<RecruitmentMission | null>(null);
  const [deployDialog, setDeployDialog] = useState<DeploymentMissionTemplate | null>(null);
  const [activeTab, setActiveTab] = useState<"recruit" | "deploy" | "roster">("recruit");
  const [missionReport, setMissionReport] = useState<{ success: boolean; elara: string; human: string } | null>(null);
  const [now, setNow] = useState(Date.now());

  const gameState = state;
  const playerName = gameState.characterChoices.name || "Operative";
  const completedMissions = gameState.armyRecruitmentMissionsCompleted;
  const units = gameState.armyUnits;
  const deployedMissions = gameState.armyDeployments;

  // Tick timer for deployed missions
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  const sectorMissions = useMemo(() => getMissionsForSector(activeSector), [activeSector]);

  const handleLaunchMission = useCallback((mission: RecruitmentMission) => {
    // Simulate completing the test mission — in full implementation this routes to the game mode
    const newUnit: ArmyUnit = {
      id: `unit-${mission.id}-${Date.now()}`,
      name: mission.unitName,
      type: toArmyUnitType(mission.unitType),
      rank: "recruit",
      level: 1,
      xp: 0,
      sector: mission.sectorName,
      specialization: mission.testMissionType,
      successRate: 60 + mission.rewards.unitStrength,
      recruitedAt: Date.now(),
      deployed: false,
    };
    recruitUnit(newUnit);
  }, [recruitUnit]);

  const handleDeploy = useCallback((templateId: string, unitId: string) => {
    const template = [...DAILY_MISSIONS, ...WEEKLY_MISSIONS, ...EVENT_MISSIONS].find((t: DeploymentMissionTemplate) => t.id === templateId);
    if (!template) return;
    const deployment: ArmyDeployment = {
      id: `deploy-${Date.now()}`,
      missionId: template.id,
      missionName: template.title,
      missionType: template.type,
      unitIds: [unitId],
      startedAt: Date.now(),
      durationMs: template.duration * 60000,
      successChance: template.baseSuccessRate,
      sector: `sector-${template.sectorRequirement}`,
      rewards: [
        { type: "credits", amount: template.rewards.credits },
        { type: "materials", amount: template.rewards.materials },
        { type: "intel", amount: template.rewards.intel },
        { type: "xp", amount: template.rewards.xp },
      ].filter((r) => r.amount > 0),
    };
    deployUnits(deployment);
    setDeployDialog(null);
  }, [deployUnits]);

  const handleCompleteDeployed = useCallback((deploymentId: string) => {
    const deployment = deployedMissions.find((m: ArmyDeployment) => m.id === deploymentId);
    if (!deployment) return;
    const template = [...DAILY_MISSIONS, ...WEEKLY_MISSIONS, ...EVENT_MISSIONS].find((t: DeploymentMissionTemplate) => t.id === deployment.missionId);
    if (!template) return;

    // Calculate success
    const assignedUnits = units.filter((u: ArmyUnit) => deployment.unitIds.includes(u.id));
    let successRate = deployment.successChance;
    assignedUnits.forEach((u: ArmyUnit) => {
      successRate += u.level * 2;
      if (template.preferredUnitTypes?.includes(u.type as any)) successRate += 10;
    });
    const success = Math.random() * 100 < successRate;

    const report = success ? template.successReport : template.failureReport;
    const unitName = assignedUnits[0]?.name || "Unknown Unit";
    const elaraReport = report.elara.replace("{unitName}", unitName).replace("{playerName}", playerName);
    const humanReport = report.human.replace("{unitName}", unitName);

    setMissionReport({ success, elara: elaraReport, human: humanReport });
    completeDeployment(
      deploymentId, success, elaraReport, "elara",
      success ? deployment.rewards : undefined,
    );
  }, [deployedMissions, units, completeDeployment, playerName]);

  const availableDeployments = useMemo(() => {
    const maxSector = Math.max(...completedMissions.map((id: string) => {
      const m = ALL_RECRUITMENT_MISSIONS.find((rm: RecruitmentMission) => rm.id === id);
      return m?.sector || 0;
    }), 1);
    return [
      ...DAILY_MISSIONS.filter((m: DeploymentMissionTemplate) => m.sectorRequirement <= maxSector),
      ...WEEKLY_MISSIONS.filter((m: DeploymentMissionTemplate) => m.sectorRequirement <= maxSector),
      ...EVENT_MISSIONS.filter((m: DeploymentMissionTemplate) => m.sectorRequirement <= maxSector),
    ];
  }, [completedMissions]);

  const elaraReportMessages: TransmissionMessage[] = missionReport ? [{ speaker: "elara", text: missionReport.elara }] : [];
  const humanReportMessages: TransmissionMessage[] = missionReport ? [{ speaker: "human", text: missionReport.human, corruptionLevel: 30 }] : [];

  return (
    <div className="min-h-screen grid-bg animate-fade-in">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/ark" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-primary" />
              <h1 className="font-display text-lg font-bold tracking-wider">ARMY COMMAND</h1>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground tracking-[0.2em]">
              {units.length} UNITS // {completedMissions.length}/{ALL_RECRUITMENT_MISSIONS.length} RECRUITED // {deployedMissions.length} DEPLOYED
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border/20 pb-1">
          {(["recruit", "deploy", "roster"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-mono text-xs tracking-wider transition-all ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "recruit" ? "RECRUIT" : tab === "deploy" ? "DEPLOY" : "ROSTER"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 pb-8">
        {/* ═══ RECRUIT TAB ═══ */}
        {activeTab === "recruit" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Sector Map */}
            <div className="lg:col-span-1">
              <SectorMap
                activeSector={activeSector}
                setActiveSector={setActiveSector}
                completedMissions={completedMissions}
              />
            </div>

            {/* Mission List */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Crosshair size={14} className="text-accent" />
                <span className="font-display text-xs font-bold tracking-[0.2em]">
                  {SECTORS.find((s) => s.id === activeSector)?.name.toUpperCase()} MISSIONS
                </span>
              </div>
              {!isSectorUnlocked(activeSector, completedMissions) ? (
                <div className="p-6 rounded-lg border border-border/20 bg-card/20 text-center">
                  <Lock size={24} className="text-muted-foreground mx-auto mb-2" />
                  <p className="font-mono text-xs text-muted-foreground">
                    {SECTORS.find((s) => s.id === activeSector)?.unlockCondition}
                  </p>
                </div>
              ) : selectedMission ? (
                <div>
                  <button
                    onClick={() => setSelectedMission(null)}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-xs font-mono mb-3 transition-colors"
                  >
                    <ArrowLeft size={12} />
                    BACK TO MISSIONS
                  </button>
                  <MissionBriefing
                    mission={selectedMission}
                    playerName={playerName}
                    completed={completedMissions.includes(selectedMission.id)}
                    onAccept={() => handleLaunchMission(selectedMission)}
                  />
                </div>
              ) : (
                sectorMissions.map((mission: RecruitmentMission) => {
                  const completed = completedMissions.includes(mission.id);
                  return (
                    <button
                      key={mission.id}
                      onClick={() => setSelectedMission(mission)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        completed
                          ? "border-primary/20 bg-primary/5"
                          : "border-border/30 bg-card/30 hover:border-accent/30 hover:bg-card/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {completed ? (
                            <Check size={14} className="text-primary" />
                          ) : (
                            React.createElement(UNIT_TYPE_ICONS[mission.unitType] || Shield, {
                              size: 14, className: UNIT_TYPE_COLORS[mission.unitType],
                            })
                          )}
                          <span className="font-mono text-xs font-semibold">{mission.worldName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${UNIT_TYPE_BG[mission.unitType]}`}>
                            {mission.unitName}
                          </span>
                          <ChevronRight size={12} className="text-muted-foreground" />
                        </div>
                      </div>
                      <p className="font-mono text-[10px] text-muted-foreground/60 mt-1 line-clamp-1">
                        {mission.worldDescription}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ═══ DEPLOY TAB ═══ */}
        {activeTab === "deploy" && (
          <div className="space-y-6">
            {/* Active Deployments */}
            {deployedMissions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Send size={14} className="text-accent" />
                  <span className="font-display text-xs font-bold tracking-[0.2em]">ACTIVE DEPLOYMENTS</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {deployedMissions.map((deployment: ArmyDeployment) => (
                    <DeployedMissionCard
                      key={deployment.id}
                      deployment={deployment}
                      units={units}
                      onComplete={handleCompleteDeployed}
                      now={now}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Available Missions */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target size={14} className="text-primary" />
                <span className="font-display text-xs font-bold tracking-[0.2em]">AVAILABLE MISSIONS</span>
              </div>
              {getAvailableUnits().length === 0 ? (
                <div className="p-6 rounded-lg border border-border/20 bg-card/20 text-center">
                  <Users size={24} className="text-muted-foreground mx-auto mb-2" />
                  <p className="font-mono text-xs text-muted-foreground">
                    {units.length === 0 ? "No units recruited yet. Visit the RECRUIT tab." : "All units are currently deployed."}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {(["daily", "weekly", "event"] as const).map((type) => {
                    const missions = availableDeployments.filter((m: DeploymentMissionTemplate) => m.type === type);
                    if (missions.length === 0) return null;
                    return (
                      <div key={type}>
                        <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] block mb-2">
                          {type.toUpperCase()} MISSIONS
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {missions.map((template: DeploymentMissionTemplate) => (
                            <button
                              key={template.id}
                              onClick={() => setDeployDialog(template)}
                              className="w-full text-left p-3 rounded-lg border border-border/30 bg-card/30 hover:border-accent/30 hover:bg-card/50 transition-all"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-xs font-semibold">{template.title}</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[10px] text-muted-foreground">{template.duration}m</span>
                                  <span className="font-mono text-[10px] text-accent">D{template.difficulty}</span>
                                </div>
                              </div>
                              <p className="font-mono text-[10px] text-muted-foreground/60 line-clamp-1">{template.description}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ ROSTER TAB ═══ */}
        {activeTab === "roster" && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users size={14} className="text-primary" />
              <span className="font-display text-xs font-bold tracking-[0.2em]">ARMY ROSTER</span>
            </div>
            {units.length === 0 ? (
              <div className="p-8 rounded-lg border border-border/20 bg-card/20 text-center">
                <Shield size={32} className="text-muted-foreground mx-auto mb-3" />
                <p className="font-mono text-sm text-muted-foreground mb-2">No units recruited</p>
                <p className="font-mono text-xs text-muted-foreground/50">
                  Use Kael's ship logs to explore the reborn universe and recruit allies.
                </p>
                <button
                  onClick={() => setActiveTab("recruit")}
                  className="mt-4 px-4 py-2 rounded-md bg-primary/10 border border-primary/40 text-primary text-xs font-mono hover:bg-primary/20 transition-all"
                >
                  BEGIN RECRUITING
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {units.map((unit: ArmyUnit) => {
                  const Icon = UNIT_TYPE_ICONS[unit.type] || Shield;
                  const isDeployed = unit.deployed;
                  return (
                    <div
                      key={unit.id}
                      className={`p-4 rounded-lg border ${UNIT_TYPE_BG[unit.type] || "bg-card/30 border-border/30"} transition-all`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon size={16} className={UNIT_TYPE_COLORS[unit.type]} />
                          <span className="font-mono text-xs font-semibold">{unit.name}</span>
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground">Lv.{unit.level}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <div>
                          <p className="font-mono text-[9px] text-muted-foreground/60">RANK</p>
                          <p className="font-mono text-xs capitalize">{unit.rank}</p>
                        </div>
                        <div>
                          <p className="font-mono text-[9px] text-muted-foreground/60">SUCCESS</p>
                          <p className="font-mono text-xs">{unit.successRate}%</p>
                        </div>
                        <div>
                          <p className="font-mono text-[9px] text-muted-foreground/60">SPEC</p>
                          <p className="font-mono text-xs capitalize">{unit.specialization}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isDeployed ? (
                          <>
                            <Clock size={10} className="text-accent" />
                            <span className="font-mono text-[10px] text-accent">DEPLOYED</span>
                          </>
                        ) : (
                          <>
                            <Check size={10} className="text-primary" />
                            <span className="font-mono text-[10px] text-primary">IDLE</span>
                          </>
                        )}
                      </div>
                      {/* XP Progress */}
                      <div className="mt-2">
                        <div className="w-full h-1 rounded-full bg-border/30 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-yellow-400/60"
                            style={{ width: `${(unit.xp % 1000) / 10}%` }}
                          />
                        </div>
                        <p className="font-mono text-[9px] text-muted-foreground/40 mt-0.5">{unit.xp % 1000}/1000 XP</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Deploy Dialog */}
      <AnimatePresence>
        {deployDialog && (
          <DeployMissionDialog
            template={deployDialog}
            units={units}
            playerName={playerName}
            onDeploy={(unitId: string) => handleDeploy(deployDialog.id, unitId)}
            onCancel={() => setDeployDialog(null)}
          />
        )}
      </AnimatePresence>

      {/* Mission Report Modal */}
      <AnimatePresence>
        {missionReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => setMissionReport(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md rounded-lg border border-border/50 bg-card p-5"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-4">
                {missionReport.success ? (
                  <Check size={16} className="text-primary" />
                ) : (
                  <AlertTriangle size={16} className="text-destructive" />
                )}
                <h3 className="font-display text-sm font-bold tracking-wide">
                  {missionReport.success ? "MISSION SUCCESS" : "MISSION FAILED"}
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span className="font-mono text-[10px] text-cyan-400 tracking-[0.2em]">ELARA</span>
                  </div>
                  <TransmissionDisplay messages={elaraReportMessages} compact />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span className="font-mono text-[10px] text-red-500 tracking-[0.2em]">SIGNAL</span>
                  </div>
                  <TransmissionDisplay messages={humanReportMessages} compact />
                </div>
              </div>
              <button
                onClick={() => setMissionReport(null)}
                className="w-full mt-4 px-4 py-2 rounded-md bg-primary/10 border border-primary/40 text-primary text-xs font-mono hover:bg-primary/20 transition-all"
              >
                ACKNOWLEDGED
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
