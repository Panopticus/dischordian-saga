/* ═══════════════════════════════════════════════════════
   TRADE EMPIRE PAGE — Galactic strategy command center
   Galaxy map, mission dispatch, agent management,
   diplomacy, and fleet operations.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Users, Swords, Shield, Package, Target, ChevronRight,
  Clock, Star, AlertTriangle, MapPin, Send, Eye,
  Bookmark, Route, ScrollText, Check, Flower2, Crown,
} from "lucide-react";
import GalacticMap from "./GalacticMap";
import { useGame } from "@/contexts/GameContext";
import { dispatchVoiceWhisper } from "@/components/VoiceWhisper";
import { getEquipmentGameBonuses } from "./equipmentState";
import {
  GALACTIC_MAP, GALACTIC_FACTIONS, STARTER_MISSIONS,
  createInitialEmpire, migrateEmpireState, ACT3_FACTION_IDS, ACT3_FACTION_ARCS,
  countArcsResolved, countPathsResolved, determineAct3Ending,
  type EmpireState, type MissionDef, type GalacticFactionId,
  type Act3FactionId, type FactionArcPath, type SectorEventEntry,
} from "./tradeEmpire";
import {
  EYES_LORE_FRAGMENTS, ACT3_ENDINGS,
} from "./eyesArc";
import DiplomacyTable from "./DiplomacyTable";
import EyesTransmission from "./EyesTransmission";
import OcularumSlideshow from "./OcularumSlideshow";
import CollectorGarden from "./CollectorGarden";
import Act3EndingReveal from "./Act3EndingReveal";
import EyesNarratorWhisper from "./EyesNarratorWhisper";
import InfiltrationRunner from "./InfiltrationRunner";
import { getInfiltrationStage, type InfiltrationStageResult } from "./infiltrationContent";
import InfiltrationPathSelector, {
  shouldShowInfiltrationSelector,
} from "@/components/InfiltrationPathSelector";
import { applyLoredexOverride } from "./loredexRewrite";
import {
  getTechsByBranch, canResearch, getTechById,
  type TechBranch, type TechTreeState, DEFAULT_TECH_STATE,
} from "./techTree";
import { FlaskConical } from "lucide-react";
import LivingBackground from "@/components/LivingBackground";
import { getNPCPortrait } from "@/game/npcPortraits";

/* ─── TRADE EMPIRE BACKGROUNDS ─── */
const TRADE_BACKGROUNDS: Record<string, { url: string; accent: string }> = {
  map: {
    url: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775675352/TE-001_THE_TRADE_MAP_a5bppy.jpg",
    accent: "var(--energy-primary)",
  },
  market: {
    url: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775675353/TE-002_THE_MARKET_FLOOR_gvqfsj.jpg",
    accent: "var(--energy-accent)",
  },
  colony: {
    url: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775675348/TE-003_THE_COLONY_VIEW_bkon59.jpg",
    accent: "var(--energy-success)",
  },
  office: {
    url: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775675350/TE-004_LOCKES_OFFICE_sqkcmx.jpg",
    accent: "#a855f7",
  },
};

/** Map each view to its background key */
function getTradeBackground(view: View) {
  switch (view) {
    case "map":
    case "sector_detail":
    case "routes":
    case "event_log":
      return TRADE_BACKGROUNDS.map;
    case "missions":
    case "fleet":
      return TRADE_BACKGROUNDS.market;
    case "agents":
    case "research":
      return TRADE_BACKGROUNDS.colony;
    case "diplomacy":
    case "act3":
      return TRADE_BACKGROUNDS.office;
    default:
      return TRADE_BACKGROUNDS.map;
  }
}

type View = "map" | "missions" | "agents" | "diplomacy" | "fleet" | "research" | "sector_detail" | "act3" | "routes" | "event_log";

const MISSION_TYPE_ICONS: Record<string, typeof Globe> = {
  trade: Package, espionage: Eye, diplomacy: Users, combat: Swords,
  recruitment: Users, exploration: Globe, sabotage: AlertTriangle,
  rescue: Shield, construction: MapPin, lore_hunt: Star,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  routine: "var(--energy-success)", challenging: "#eab308", dangerous: "#f97316", suicidal: "var(--energy-error)",
};

/** Which Act 3 factions have a diplomacy minigame table. Maps faction → table id. */
const DIPLOMACY_TABLES_AVAILABLE: Partial<Record<Act3FactionId, string>> = {
  new_babylon: "new_babylon",
  hierarchy: "hierarchy",
  artificial_empire: "artificial_empire",
};

/* ─── §8.2 QUICK-WIN: Trade routes panel ─── */
function RoutesPanel({
  empire,
  saveEmpire,
  logEvent,
}: {
  empire: EmpireState;
  saveEmpire: (e: EmpireState) => void;
  logEvent: (entry: Omit<SectorEventEntry, "id" | "timestamp">) => void;
}) {
  const [newName, setNewName] = useState("");
  const [draft, setDraft] = useState<string[]>([]);
  const routes = empire.tradeRoutes ?? [];

  const toggleSector = (id: string) => {
    setDraft(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const saveRoute = () => {
    if (draft.length < 2 || !newName.trim()) return;
    const next: EmpireState = {
      ...empire,
      tradeRoutes: [
        ...routes,
        {
          id: `route_${Date.now()}`,
          name: newName.trim(),
          sectorIds: draft,
          runCount: 0,
          createdAt: Date.now(),
        },
      ],
    };
    saveEmpire(next);
    setNewName("");
    setDraft([]);
  };

  const runRoute = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    if (!route) return;
    const nextRoutes = routes.map(r => r.id === routeId ? { ...r, runCount: r.runCount + 1 } : r);
    saveEmpire({ ...empire, tradeRoutes: nextRoutes });
    logEvent({
      sectorId: route.sectorIds[0] ?? "unknown",
      label: `Ran route: ${route.name}`,
      detail: `Route touches ${route.sectorIds.length} sectors. Total runs: ${route.runCount + 1}.`,
      tone: "neutral",
    });
  };

  const deleteRoute = (routeId: string) => {
    saveEmpire({ ...empire, tradeRoutes: routes.filter(r => r.id !== routeId) });
  };

  return (
    <div className="space-y-4">
      {/* Saved routes */}
      <div>
        <p className="font-mono text-[10px] text-white/30 tracking-wider mb-2">SAVED ROUTES</p>
        {routes.length === 0 && (
          <p className="font-mono text-[10px] text-white/30 italic">No routes saved. Build one below.</p>
        )}
        {routes.map(route => (
          <div key={route.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/10 mb-2">
            <div className="flex items-center justify-between mb-1">
              <p className="font-mono text-xs font-bold text-white">{route.name}</p>
              <span className="font-mono text-[9px] text-white/30">{route.runCount} runs</span>
            </div>
            <p className="font-mono text-[9px] text-white/40 mb-2">
              {route.sectorIds.map(s => GALACTIC_MAP.find(sec => sec.id === s)?.name ?? s).join(" → ")}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => runRoute(route.id)}
                className="px-3 py-1 rounded void-bg-success border void-border-success void-text-energy font-mono text-[9px] font-bold void-bg-success"
              >
                RUN ROUTE
              </button>
              <button
                onClick={() => deleteRoute(route.id)}
                className="px-3 py-1 rounded bg-white/5 border border-white/10 text-white/40 font-mono text-[9px] hover:text-white/60"
              >
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Builder */}
      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
        <p className="font-mono text-[10px] text-white/30 tracking-wider mb-2">BUILD NEW ROUTE</p>
        <input
          type="text"
          placeholder="Route name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          className="w-full px-3 py-2 mb-2 rounded bg-black/60 border border-white/10 font-mono text-[11px] text-white"
        />
        <p className="font-mono text-[9px] text-white/30 mb-2">Tap sectors to add (min 2, max 10):</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 max-h-48 overflow-y-auto mb-2">
          {GALACTIC_MAP.map(sector => {
            const idx = draft.indexOf(sector.id);
            const selected = idx !== -1;
            return (
              <button
                key={sector.id}
                onClick={() => toggleSector(sector.id)}
                className={`p-1.5 rounded text-left font-mono text-[9px] border transition-colors ${
                  selected ? "void-border-success void-bg-success void-text-energy" : "border-white/10 bg-white/[0.02] text-white/50 hover:bg-white/5"
                }`}
              >
                {selected && `${idx + 1}. `}{sector.name}
              </button>
            );
          })}
        </div>
        <button
          onClick={saveRoute}
          disabled={draft.length < 2 || !newName.trim()}
          className="w-full py-2 rounded void-bg-success border void-border-success void-text-energy font-mono text-[10px] font-bold disabled:opacity-30 disabled:cursor-not-allowed void-bg-success"
        >
          SAVE ROUTE
        </button>
      </div>
    </div>
  );
}

export default function TradeEmpirePage() {
  const { state: gameState, setNarrativeFlag } = useGame();
  const playerName = gameState.characterChoices?.name || "Captain";
  const [view, setView] = useState<View>("map");
  const [empire, setEmpire] = useState<EmpireState>(() => {
    const saved = localStorage.getItem("trade_empire_state");
    if (!saved) return createInitialEmpire();
    try {
      return migrateEmpireState(JSON.parse(saved));
    } catch {
      return createInitialEmpire();
    }
  });
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedMission, setSelectedMission] = useState<MissionDef | null>(null);
  // Audit 2H — trade_offered whisper fires when a new mission is
  // selected (the first time the player looks at the dispatch dialog
  // for that mission). Guarded by a ref so re-opening the same
  // mission doesn't re-whisper.
  const lastTradeWhisperedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!selectedMission) return;
    if (lastTradeWhisperedRef.current === selectedMission.id) return;
    lastTradeWhisperedRef.current = selectedMission.id;
    dispatchVoiceWhisper(
      { type: "trade_offered" },
      (gameState.innerVoiceSkills ?? {}) as Record<string, number>,
    );
  }, [selectedMission, gameState.innerVoiceSkills]);

  // ─── Act 3 cinematic overlays ───
  const [showEyesTransmission, setShowEyesTransmission] = useState(false);
  const [showOcularum, setShowOcularum] = useState(false);
  const [showCollector, setShowCollector] = useState(false);
  const [showEndingReveal, setShowEndingReveal] = useState(false);
  const [activeDiplomacyTable, setActiveDiplomacyTable] = useState<string | null>(null);
  /** Active infiltration stage id — when non-null, the runner modal is open. */
  const [activeInfiltrationStage, setActiveInfiltrationStage] = useState<string | null>(null);
  /** Which faction the active infiltration stage belongs to (for callbacks) */
  const [activeInfiltrationFaction, setActiveInfiltrationFaction] = useState<Act3FactionId | null>(null);

  // Act 3 selections
  const [selectedArc, setSelectedArc] = useState<Act3FactionId | null>(null);

  // §8.2 Quick-win: galaxy map faction filter
  const [factionFilter, setFactionFilter] = useState<GalacticFactionId | "all">("all");

  // Equipment bonuses for Trade Empire
  const tradeBonuses = useMemo(() => getEquipmentGameBonuses("trade_empire"), []);
  const missionSpeedBonus = tradeBonuses.get("mission_speed") || 0;

  // Save empire state
  const saveEmpire = useCallback((newState: EmpireState) => {
    setEmpire(newState);
    localStorage.setItem("trade_empire_state", JSON.stringify(newState));
  }, []);

  // Append a sector event to the rolling event log (§8.2)
  const logEvent = useCallback((entry: Omit<SectorEventEntry, "id" | "timestamp">) => {
    setEmpire(prev => {
      const log = [...(prev.eventLog ?? [])];
      log.unshift({
        id: `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        timestamp: Date.now(),
        ...entry,
      });
      const next = { ...prev, eventLog: log.slice(0, 50) };
      localStorage.setItem("trade_empire_state", JSON.stringify(next));
      return next;
    });
  }, []);

  // ─── Act 3: unlock the arcs once the Eyes transmission has been watched ───
  const beginAct3 = useCallback(() => {
    setEmpire(prev => {
      // migrateEmpireState at load-time guarantees prev.act3 exists, but guard anyway.
      const act3 = prev.act3 ?? createInitialEmpire().act3!;
      const nextArcs = { ...act3.arcs };
      for (const fId of ACT3_FACTION_IDS) {
        if (nextArcs[fId]?.status === "locked") {
          nextArcs[fId] = { ...nextArcs[fId], status: "available" };
        }
      }
      const next: EmpireState = {
        ...prev,
        act3: { ...act3, arcs: nextArcs, eyesTransmissionSeen: true },
      };
      localStorage.setItem("trade_empire_state", JSON.stringify(next));
      return next;
    });
    setNarrativeFlag("eyes_transmission_seen");
    setNarrativeFlag("act3_started");
  }, [setNarrativeFlag]);

  // ─── Act 3: choose a path on a faction arc ───
  const chooseArcPath = useCallback((factionId: Act3FactionId, path: FactionArcPath) => {
    setEmpire(prev => {
      if (!prev.act3) return prev;
      const arc = prev.act3.arcs[factionId];
      if (!arc || arc.status === "resolved") return prev;

      // Spec impossibilities: mark failed immediately.
      const impossible =
        (factionId === "thought_virus" && path === "diplomacy") ||
        (factionId === "antiquarian" && path === "conquest");

      const nextArc = impossible
        ? {
            ...arc,
            chosenPath: path,
            status: "failed" as const,
            stageIndex: 1,
            completedStages: [ACT3_FACTION_ARCS[factionId].paths[path].stages[0]?.id].filter(Boolean) as string[],
          }
        : {
            ...arc,
            chosenPath: path,
            status: "in_progress" as const,
            stageIndex: 0,
            completedStages: [] as string[],
          };
      const next: EmpireState = {
        ...prev,
        act3: { ...prev.act3, arcs: { ...prev.act3.arcs, [factionId]: nextArc } },
      };
      localStorage.setItem("trade_empire_state", JSON.stringify(next));
      return next;
    });
    logEvent({
      sectorId: factionId,
      label: `Chose ${path} path against ${GALACTIC_FACTIONS[factionId as GalacticFactionId]?.name ?? factionId}`,
      detail: ACT3_FACTION_ARCS[factionId].paths[path].summary,
      tone: path === "conquest" ? "dark" : path === "diplomacy" ? "light" : "neutral",
    });
  }, [logEvent]);

  // ─── Act 3: complete the current stage of a faction arc ───
  const completeArcStage = useCallback((factionId: Act3FactionId, stageId: string) => {
    setEmpire(prev => {
      if (!prev.act3) return prev;
      const arc = prev.act3.arcs[factionId];
      if (!arc || arc.status !== "in_progress" || !arc.chosenPath) return prev;
      const pathDef = ACT3_FACTION_ARCS[factionId].paths[arc.chosenPath];
      const completed = arc.completedStages.includes(stageId)
        ? arc.completedStages
        : [...arc.completedStages, stageId];
      const stageIndex = completed.length;
      const justResolved = stageIndex >= pathDef.stages.length;
      const nextArc = justResolved
        ? { ...arc, completedStages: completed, stageIndex, status: "resolved" as const, resolvedAt: Date.now() }
        : { ...arc, completedStages: completed, stageIndex };
      const next: EmpireState = {
        ...prev,
        act3: { ...prev.act3, arcs: { ...prev.act3.arcs, [factionId]: nextArc } },
      };
      localStorage.setItem("trade_empire_state", JSON.stringify(next));
      return next;
    });
  }, []);

  // ─── Act 3: fail an in-progress arc (used by infiltration fail choices) ───
  // Some choices in the infiltration runner explicitly close the path — e.g.
  // ae_i_1 refusing the Architect's invitation. Flag the arc as failed so
  // the Act 3 UI stops offering it.
  const failArc = useCallback((factionId: Act3FactionId) => {
    setEmpire(prev => {
      if (!prev.act3) return prev;
      const arc = prev.act3.arcs[factionId];
      if (!arc) return prev;
      const nextArc = { ...arc, status: "failed" as const };
      const next: EmpireState = {
        ...prev,
        act3: { ...prev.act3, arcs: { ...prev.act3.arcs, [factionId]: nextArc } },
      };
      localStorage.setItem("trade_empire_state", JSON.stringify(next));
      return next;
    });
  }, []);

  // ─── Act 3: the infiltration runner posts results back here ───
  // Applies flags, writes any loredex override, advances or fails the stage,
  // and logs an event to the §8.2 sector event feed.
  const handleInfiltrationResolve = useCallback((result: InfiltrationStageResult) => {
    const factionId = activeInfiltrationFaction;
    const stageId = activeInfiltrationStage;
    if (!factionId || !stageId) return;

    // Flags first — the runner doesn't set anything directly.
    for (const flag of result.flagsToSet ?? []) setNarrativeFlag(flag);

    // Loredex override, if the runner produced one (binding rewrite stages).
    // The runner already wrote it to localStorage; this ensures a second
    // persistence path if the runner's write ever fails (defense in depth).
    if (result.loredexOverride) {
      applyLoredexOverride(result.loredexOverride);
    }

    // Advance or fail the arc.
    if (result.success) {
      completeArcStage(factionId, stageId);
    } else {
      failArc(factionId);
    }

    // Event log entry.
    logEvent({
      sectorId: factionId,
      label: result.logLabel ?? `Infiltration: ${stageId}`,
      detail: result.success
        ? "Stage resolved via the infiltration runner."
        : "Path closed by player choice.",
      tone: result.success ? "neutral" : "dark",
    });

    // Close the runner.
    setActiveInfiltrationStage(null);
    setActiveInfiltrationFaction(null);
  }, [activeInfiltrationFaction, activeInfiltrationStage, setNarrativeFlag, completeArcStage, failArc, logEvent]);

  // ─── Act 3: mark the Collector boss result ───
  // On defeat the Collector permanently takes a card keyed to the player's last
  // resolved faction arc. We persist both the flag and the card name so the
  // card game engine can honor the loss from the unified save state.
  const LAST_ARC_CARD_LOSS_MAP: Record<string, string> = {
    new_babylon: "Adjudicator's Decree",
    hierarchy: "Blood Weave Token",
    insurgency: "The Engineer Remembers",
    thought_virus: "Immunity",
    artificial_empire: "Archon Robe",
    antiquarian: "A Moment Outside Time",
  };
  const recordCollectorResult = useCallback((won: boolean) => {
    setEmpire(prev => {
      if (!prev.act3) return prev;
      // Determine which card was lost (if any) from the last resolved arc.
      let lostCard: string | null = prev.act3.lostCardToCollector ?? null;
      if (!won) {
        const sorted = Object.values(prev.act3.arcs)
          .filter(a => a.status === "resolved" && a.resolvedAt)
          .sort((a, b) => (b.resolvedAt ?? 0) - (a.resolvedAt ?? 0));
        const lastArcId = sorted[0]?.factionId;
        if (lastArcId) lostCard = LAST_ARC_CARD_LOSS_MAP[lastArcId] ?? lostCard;
      }
      const next: EmpireState = {
        ...prev,
        act3: {
          ...prev.act3,
          collectorBossFought: true,
          collectorBossWon: won,
          lostCardToCollector: lostCard,
        },
        // +500 "Light Energy" is tracked through the narrative-proxy influence counter.
        influence: won ? prev.influence + 500 : prev.influence,
      };
      localStorage.setItem("trade_empire_state", JSON.stringify(next));
      return next;
    });
    if (won) {
      setNarrativeFlag("collector_boss_won");
      setNarrativeFlag("eyes_full_transmission_recovered");
    } else {
      setNarrativeFlag("collector_boss_lost");
      setNarrativeFlag("collector_card_forfeit");
    }
    logEvent({
      sectorId: "thaloria",
      label: won ? "Defeated the Collector" : "Lost to the Collector",
      detail: won
        ? "The Collector retreats. You recovered the Eyes' final transmission. +500 Light Energy."
        : "The Collector takes a card from your deck. He will remember your face.",
      tone: won ? "light" : "dark",
    });
  }, [logEvent, setNarrativeFlag]);

  // ─── Act 3: ending selection ───
  const chooseAct3Ending = useCallback((ending: "eyes_shadow" | "iron_path" | "council") => {
    setEmpire(prev => {
      if (!prev.act3) return prev;
      const next: EmpireState = { ...prev, act3: { ...prev.act3, act3Ending: ending } };
      localStorage.setItem("trade_empire_state", JSON.stringify(next));
      return next;
    });
    for (const flag of ACT3_ENDINGS[ending].flagsOnReach) setNarrativeFlag(flag);
  }, [setNarrativeFlag]);

  // Tech tree state
  const [techState, setTechState] = useState<TechTreeState>(() => {
    const saved = localStorage.getItem("trade_empire_tech");
    return saved ? JSON.parse(saved) : DEFAULT_TECH_STATE;
  });

  const startResearch = useCallback((techId: string) => {
    const tech = getTechById(techId);
    if (!tech || !canResearch(techId, techState.researched)) return;
    if (empire.influence < tech.cost.influence) return;
    const newEmpire = { ...empire, influence: empire.influence - tech.cost.influence };
    saveEmpire(newEmpire);
    const newTech: TechTreeState = {
      ...techState,
      currentResearch: { techId, startedAt: Date.now(), endsAt: Date.now() + tech.researchHours * 3600000 },
    };
    setTechState(newTech);
    localStorage.setItem("trade_empire_tech", JSON.stringify(newTech));
  }, [techState, empire, saveEmpire]);

  const completeResearch = useCallback(() => {
    if (!techState.currentResearch) return;
    if (Date.now() < techState.currentResearch.endsAt) return;
    const newTech: TechTreeState = {
      researched: [...techState.researched, techState.currentResearch.techId],
      currentResearch: null,
      totalResearched: techState.totalResearched + 1,
    };
    setTechState(newTech);
    localStorage.setItem("trade_empire_tech", JSON.stringify(newTech));
  }, [techState]);

  // Auto-complete research when timer expires
  if (techState.currentResearch && Date.now() >= techState.currentResearch.endsAt) {
    completeResearch();
  }

  // Available missions based on narrative flags
  const availableMissions = useMemo(() => {
    return STARTER_MISSIONS.filter(m => {
      if (m.requiresFlag && !gameState.narrativeFlags[m.requiresFlag]) return false;
      return !empire.completedMissions.includes(m.id);
    });
  }, [empire.completedMissions, gameState.narrativeFlags]);

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
      endTime: now + mission.duration * 3600000 * (1 - (missionSpeedBonus / 100)), // Equipment/crafted speed bonus
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

    // §8.2: log the completion as a sector event
    const log = [...(newEmpire.eventLog ?? [])];
    log.unshift({
      id: `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      sectorId: mission.targetSector,
      label: `Completed: ${mission.name}`,
      detail: `Collected rewards. Reputation shifted across ${mission.reputationEffect.length} faction(s).`,
      timestamp: Date.now(),
      tone: "neutral",
    });
    newEmpire.eventLog = log.slice(0, 50);

    // §7.4: discover Eyes lore fragment if this mission visits a tied sector and Act 3 is active
    if (newEmpire.act3?.eyesTransmissionSeen) {
      const frag = EYES_LORE_FRAGMENTS.find(f => f.sectorId === mission.targetSector);
      if (frag && !newEmpire.act3.discoveredFragments.includes(frag.id)) {
        newEmpire.act3 = {
          ...newEmpire.act3,
          discoveredFragments: [...newEmpire.act3.discoveredFragments, frag.id],
        };
        log.unshift({
          id: `evt_${Date.now()}_frag`,
          sectorId: mission.targetSector,
          label: `Eyes fragment discovered: ${frag.title}`,
          detail: frag.toastLabel,
          timestamp: Date.now(),
          tone: "neutral",
        });
        newEmpire.eventLog = log.slice(0, 50);
      }
    }
    saveEmpire(newEmpire);
  }, [empire, saveEmpire]);

  // ─── §8.2: Sector bookmark toggle (max 5) ───
  const toggleBookmark = useCallback((sectorId: string) => {
    setEmpire(prev => {
      const current = prev.sectorBookmarks ?? [];
      const next = current.includes(sectorId)
        ? current.filter(s => s !== sectorId)
        : current.length >= 5 ? current : [...current, sectorId];
      const updated: EmpireState = { ...prev, sectorBookmarks: next };
      localStorage.setItem("trade_empire_state", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // ─── §8.2: Filter the galaxy by faction ───
  const filteredSectors = useMemo(() => {
    if (factionFilter === "all") return GALACTIC_MAP;
    return GALACTIC_MAP.filter(s => s.controlledBy === factionFilter);
  }, [factionFilter]);

  const selectedSectorData = selectedSector ? GALACTIC_MAP.find(s => s.id === selectedSector) : null;
  const selectedSectorFaction = selectedSectorData ? GALACTIC_FACTIONS[selectedSectorData.controlledBy] : null;

  const activeBg = getTradeBackground(view);

  return (
    <div className="min-h-screen bg-black p-4 relative overflow-hidden">
      {/* Dynamic view background */}
      <LivingBackground
        key={activeBg.url}
        src={activeBg.url}
        accent={activeBg.accent}
        opacity={0.12}
        particleCount={6}
        scanlines={false}
      />

      {/* Eyes narrator whisper — only fires after eyes_shadow ending */}
      <EyesNarratorWhisper
        selectedSectorId={selectedSector}
        narrativeFlags={gameState.narrativeFlags}
        act3State={empire.act3}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 max-w-6xl mx-auto relative z-10">
        <div className="flex items-center gap-3">
          {(() => { const locke = getNPCPortrait("adjudicator_locke"); return locke ? (
            <img src={locke.bustPortrait} alt={locke.name} className="w-10 h-10 rounded-full border-2 object-cover" style={{ borderColor: locke.color }} />
          ) : null; })()}
          <div>
            <h1 className="font-display text-xl tracking-[0.2em] text-white">GALACTIC COMMAND</h1>
            <p className="font-mono text-[10px] text-white/30">Ark Collective • Empire Level {empire.empireLevel}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px]">
          <span className="void-text-accent">{empire.credits} <span className="text-white/20">CRD</span></span>
          <span className="void-text-energy">{empire.materials} <span className="text-white/20">MAT</span></span>
          <span className="void-text-system">{empire.influence} <span className="text-white/20">INF</span></span>
          <span className="void-text-energy">{empire.intelligence} <span className="text-white/20">INT</span></span>
          <span className="text-white/20">{empire.controlledSectors.length} sectors</span>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex gap-1 mb-4 max-w-6xl mx-auto overflow-x-auto relative z-10">
        {[
          { id: "map" as View, label: "GALAXY MAP", icon: Globe },
          { id: "missions" as View, label: "MISSIONS", icon: Target },
          { id: "act3" as View, label: "ACT III", icon: Eye, accent: "purple" },
          { id: "agents" as View, label: "AGENTS", icon: Users },
          { id: "diplomacy" as View, label: "DIPLOMACY", icon: Shield },
          { id: "fleet" as View, label: "FLEET", icon: Send },
          { id: "routes" as View, label: "ROUTES", icon: Route },
          { id: "event_log" as View, label: "EVENT LOG", icon: ScrollText },
          { id: "research" as View, label: "RESEARCH", icon: FlaskConical },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setView(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-[10px] transition-colors ${
                view === tab.id ? "bg-white/10 text-white" : "bg-white/[0.02] text-white/30 hover:text-white/50"
              }`}>
              <Icon size={12} /> {tab.label}
              {tab.id === "missions" && completedActiveMissions.length > 0 && (
                <span className="w-4 h-4 rounded-full void-bg-success text-black text-[8px] flex items-center justify-center">{completedActiveMissions.length}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Galaxy Map View */}
        {view === "map" && (
          <div className="space-y-4">
            {/* §8.2: Faction filter + bookmarks bar */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-mono text-[9px] text-white/30 tracking-wider">FILTER:</span>
              <button
                onClick={() => setFactionFilter("all")}
                className={`px-2 py-1 rounded font-mono text-[9px] ${factionFilter === "all" ? "bg-white/15 text-white" : "bg-white/[0.02] text-white/40 hover:text-white/70"}`}
              >
                ALL
              </button>
              {Object.values(GALACTIC_FACTIONS).map(f => (
                <button
                  key={f.id}
                  onClick={() => setFactionFilter(f.id)}
                  className="px-2 py-1 rounded font-mono text-[9px] hover:text-white/80 transition-colors"
                  style={{
                    backgroundColor: factionFilter === f.id ? f.color + "40" : f.color + "10",
                    border: `1px solid ${f.color}30`,
                    color: factionFilter === f.id ? "#fff" : "color-mix(in oklch, var(--text-primary) 50%, transparent)",
                  }}
                >
                  {f.name.replace("The ", "")}
                </button>
              ))}
              <span className="font-mono text-[9px] text-white/20 ml-2">
                {filteredSectors.length} sectors shown
              </span>
            </div>

            {(empire.sectorBookmarks ?? []).length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="font-mono text-[9px] text-white/30 tracking-wider">BOOKMARKS:</span>
                {(empire.sectorBookmarks ?? []).map(id => {
                  const sec = GALACTIC_MAP.find(s => s.id === id);
                  if (!sec) return null;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedSector(id)}
                      className="px-2 py-1 rounded void-bg-sunk border void-border font-mono text-[9px] void-text-accent void-bg-sunk flex items-center gap-1"
                    >
                      <Bookmark size={9} />
                      {sec.name}
                    </button>
                  );
                })}
              </div>
            )}

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
                {selectedSectorData.image && (
                  <div className="relative h-32 -mx-4 -mt-4 mb-3 rounded-t-xl overflow-hidden">
                    <img src={selectedSectorData.image} alt={selectedSectorData.name} className="w-full h-full object-cover" style={{ filter: "brightness(0.4) saturate(0.8)" }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                  </div>
                )}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedSectorFaction.color }} />
                    <h3 className="font-mono text-sm font-bold text-white">{selectedSectorData.name}</h3>
                    <button
                      onClick={() => toggleBookmark(selectedSectorData.id)}
                      className="p-1 rounded hover:bg-white/10"
                      title={(empire.sectorBookmarks ?? []).includes(selectedSectorData.id) ? "Remove bookmark" : "Bookmark sector"}
                    >
                      <Bookmark
                        size={12}
                        className={(empire.sectorBookmarks ?? []).includes(selectedSectorData.id) ? "void-text-accent fill-amber-400" : "text-white/30"}
                      />
                    </button>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: selectedSectorFaction.color }}>
                    {selectedSectorFaction.name}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-3 mb-3">
                  <div className="text-center p-2 rounded bg-white/5">
                    <p className="font-mono text-xs void-text-accent font-bold">{selectedSectorData.resources.credits}</p>
                    <p className="font-mono text-[8px] text-white/30">Credits/cycle</p>
                  </div>
                  <div className="text-center p-2 rounded bg-white/5">
                    <p className="font-mono text-xs void-text-energy font-bold">{selectedSectorData.resources.materials}</p>
                    <p className="font-mono text-[8px] text-white/30">Materials</p>
                  </div>
                  <div className="text-center p-2 rounded bg-white/5">
                    <p className={`font-mono text-xs font-bold ${selectedSectorData.threat > 60 ? "void-text-error" : "void-text-energy"}`}>{selectedSectorData.threat}%</p>
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
                    className="w-full mt-2 flex items-center gap-2 p-2 rounded-lg void-bg-sunk border void-border text-left void-bg-sunk transition-colors">
                    <Target size={12} className="void-text-accent shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[10px] void-text-accent font-bold truncate">{mission.name}</p>
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
                <p className="font-mono text-[10px] void-text-energy tracking-wider">MISSIONS COMPLETE — COLLECT REWARDS</p>
                {completedActiveMissions.map(am => {
                  const mission = STARTER_MISSIONS.find(m => m.id === am.missionId);
                  if (!mission) return null;
                  return (
                    <button key={am.missionId} onClick={() => collectRewards(am.missionId)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl void-bg-success border void-border-success text-left void-bg-success transition-colors">
                      <Star size={16} className="void-text-energy shrink-0" />
                      <div className="flex-1">
                        <p className="font-mono text-xs text-white font-bold">{mission.name}</p>
                        <div className="flex gap-2 mt-1 font-mono text-[9px]">
                          {mission.rewards.credits && <span className="void-text-accent">+{mission.rewards.credits} CRD</span>}
                          {mission.rewards.materials && <span className="void-text-energy">+{mission.rewards.materials} MAT</span>}
                          {mission.rewards.influence && <span className="void-text-system">+{mission.rewards.influence} INF</span>}
                          {mission.rewards.intelligence && <span className="void-text-energy">+{mission.rewards.intelligence} INT</span>}
                        </div>
                      </div>
                      <span className="font-mono text-[10px] void-text-energy font-bold">COLLECT</span>
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
                        <div className="h-full rounded-full void-bg-success transition-all" style={{ width: `${progress}%` }} />
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
          <div className="relative space-y-2">
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
                      dip.reputation > 30 ? "void-text-energy" : dip.reputation > 0 ? "void-text-accent" : dip.reputation > -30 ? "void-text-premium" : "void-text-error"
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
                <Send size={14} className="void-text-energy shrink-0" />
                <div className="flex-1">
                  <p className="font-mono text-xs text-white font-bold">{ship.name}</p>
                  <p className="font-mono text-[9px] text-white/30">{ship.type} • {ship.currentSector}</p>
                </div>
                <div className="flex gap-3 font-mono text-[9px] text-white/40">
                  <span>⚔{ship.combat}</span>
                  <span>🚀{ship.speed}</span>
                  <span>📦{ship.cargo}</span>
                  <span className={ship.health < ship.maxHealth * 0.5 ? "void-text-error" : "void-text-energy"}>
                    HP {ship.health}/{ship.maxHealth}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══ RESEARCH TAB (Tech Tree) ═══ */}
        {view === "research" && (
          <div className="space-y-4">
            {/* Current research */}
            {techState.currentResearch && (() => {
              const tech = getTechById(techState.currentResearch.techId);
              const progress = Math.min(100, ((Date.now() - techState.currentResearch.startedAt) / (techState.currentResearch.endsAt - techState.currentResearch.startedAt)) * 100);
              return tech ? (
                <div className="p-3 rounded-xl void-bg-success border void-border-success">
                  <p className="font-mono text-[9px] void-text-energy tracking-wider mb-1">RESEARCHING</p>
                  <p className="font-mono text-sm void-text-energy font-bold">{tech.name}</p>
                  <div className="h-1.5 rounded-full bg-white/5 mt-2 overflow-hidden">
                    <div className="h-full rounded-full void-bg-success transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="font-mono text-[8px] text-white/20 mt-1">{Math.round(progress)}% complete</p>
                </div>
              ) : null;
            })()}

            {/* Tech branches */}
            {(["military", "economic", "diplomatic"] as TechBranch[]).map(branch => {
              const techs = getTechsByBranch(branch);
              const branchColor = branch === "military" ? "var(--energy-error)" : branch === "economic" ? "var(--energy-success)" : "#a855f7";
              return (
                <div key={branch}>
                  <p className="font-mono text-[10px] tracking-wider mb-2" style={{ color: branchColor }}>
                    {branch.toUpperCase()} BRANCH ({techs.filter(t => techState.researched.includes(t.id)).length}/{techs.length})
                  </p>
                  <div className="space-y-1.5">
                    {techs.map(tech => {
                      const researched = techState.researched.includes(tech.id);
                      const available = canResearch(tech.id, techState.researched);
                      const isResearching = techState.currentResearch?.techId === tech.id;
                      return (
                        <button
                          key={tech.id}
                          onClick={() => available && !techState.currentResearch && startResearch(tech.id)}
                          disabled={researched || !available || !!techState.currentResearch}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            researched ? "border-white/10 bg-white/5 opacity-60" :
                            isResearching ? "void-border-success void-bg-success" :
                            available ? "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer" :
                            "border-white/5 bg-white/[0.01] opacity-30"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-xs font-bold" style={{ color: researched ? "color-mix(in oklch, var(--text-primary) 40%, transparent)" : branchColor }}>
                              {researched ? "✓ " : ""}{tech.name}
                            </span>
                            <span className="font-mono text-[8px] text-white/20">T{tech.tier} • {tech.cost.influence} INF{tech.researchHours}h</span>
                          </div>
                          <p className="font-mono text-[9px] text-white/30">{tech.description}</p>
                          <p className="font-mono text-[8px] text-white/15 mt-1 italic">{tech.loreText}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ ACT III: FACTION ARCS ═══ */}
        {view === "act3" && (() => {
          const act3 = empire.act3;
          if (!act3 || !act3.eyesTransmissionSeen) {
            return (
              <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
                <Eye size={48} className="void-text-system" />
                <p className="font-display text-sm tracking-widest void-text-system">THE EYES IN THE DARK</p>
                <p className="font-mono text-[11px] text-white/50 max-w-md leading-relaxed">
                  An archival transmission is waiting in the Ark's substrate layer. Seventeen thousand years old.
                  A woman's voice. She knows both of your companions by name.
                </p>
                <button
                  onClick={() => setShowEyesTransmission(true)}
                  className="mt-2 px-5 py-2.5 rounded-lg void-bg-system border void-border-system void-text-system font-mono text-xs font-bold void-bg-system"
                >
                  PLAY THE TRANSMISSION
                </button>
              </div>
            );
          }

          const resolvedCount = countArcsResolved(act3);
          const paths = countPathsResolved(act3);
          const eligibleEnding = determineAct3Ending(act3);
          const act3Complete = resolvedCount >= 5;

          return (
            <div className="space-y-4">
              {/* Status bar */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <p className="font-mono text-[9px] text-white/30 tracking-wider">ARCS RESOLVED</p>
                  <p className="font-mono text-lg font-bold text-white">{resolvedCount} / 6</p>
                  <p className="font-mono text-[8px] text-white/40">{act3Complete ? "Act 3 complete" : `${5 - resolvedCount} to unlock ending`}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] void-text-error tracking-wider">CONQUEST</p>
                  <p className="font-mono text-lg font-bold void-text-error">{paths.conquest}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] void-text-accent tracking-wider">DIPLOMACY</p>
                  <p className="font-mono text-lg font-bold void-text-accent">{paths.diplomacy}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] void-text-system tracking-wider">INFILTRATION</p>
                  <p className="font-mono text-lg font-bold void-text-system">{paths.infiltration}</p>
                </div>
              </div>

              {/* Act 3 climax buttons */}
              {act3Complete && (
                <div className="flex gap-2">
                  {!act3.collectorBossFought && (
                    <button
                      onClick={() => setShowCollector(true)}
                      className="flex-1 p-3 rounded-xl void-bg-error border void-border-error text-left void-bg-error"
                    >
                      <div className="flex items-center gap-2">
                        <Flower2 size={14} className="void-text-error" />
                        <p className="font-mono text-xs font-bold void-text-error">THE COLLECTOR'S GARDEN</p>
                      </div>
                      <p className="font-mono text-[9px] text-white/40 mt-1">A Thalorian field. A helmet in the grass. A boss fight.</p>
                    </button>
                  )}
                  {act3.collectorBossFought && !act3.act3Ending && (
                    <button
                      onClick={() => setShowEndingReveal(true)}
                      className="flex-1 p-3 rounded-xl void-bg-sunk border void-border text-left void-bg-sunk"
                    >
                      <div className="flex items-center gap-2">
                        <Crown size={14} className="void-text-accent" />
                        <p className="font-mono text-xs font-bold void-text-accent">REACH AN ENDING</p>
                      </div>
                      <p className="font-mono text-[9px] text-white/40 mt-1">Eligible: {eligibleEnding ? ACT3_ENDINGS[eligibleEnding].title : "none yet"}</p>
                    </button>
                  )}
                  {act3.act3Ending && (
                    <div className="flex-1 p-3 rounded-xl void-bg-success border void-border-success">
                      <div className="flex items-center gap-2">
                        <Check size={14} className="void-text-energy" />
                        <p className="font-mono text-xs font-bold void-text-energy">ENDING: {ACT3_ENDINGS[act3.act3Ending].title.toUpperCase()}</p>
                      </div>
                      <p className="font-mono text-[9px] text-white/40 mt-1">Act 4 unlocked.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Faction arc cards */}
              <div className="space-y-2">
                <p className="font-mono text-[10px] text-white/30 tracking-wider">FACTION ARCS</p>
                {ACT3_FACTION_IDS.map(fId => {
                  const arc = act3.arcs[fId];
                  const def = ACT3_FACTION_ARCS[fId];
                  const faction = GALACTIC_FACTIONS[fId];
                  const chosen = arc?.chosenPath;
                  const chosenPathDef = chosen ? def.paths[chosen] : null;
                  const isResolved = arc?.status === "resolved";
                  const isFailed = arc?.status === "failed";
                  const isInProgress = arc?.status === "in_progress";
                  return (
                    <div
                      key={fId}
                      className={`p-3 rounded-xl border transition-colors ${
                        isResolved ? "void-bg-success void-border-success" :
                        isFailed ? "void-bg-error void-border-error" :
                        isInProgress ? "void-bg-success void-border-success" :
                        "bg-white/[0.02] border-white/10"
                      }`}
                    >
                      <button onClick={() => setSelectedArc(selectedArc === fId ? null : fId)} className="w-full text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: faction.color }} />
                          <p className="font-mono text-xs font-bold text-white flex-1">{faction.name}</p>
                          {isResolved && <Check size={12} className="void-text-energy" />}
                          {isFailed && <AlertTriangle size={12} className="void-text-error" />}
                          {isInProgress && <Clock size={12} className="void-text-energy" />}
                        </div>
                        <p className="font-mono text-[9px] text-white/40">Boss: {def.boss}</p>
                        {chosenPathDef && (
                          <p className="font-mono text-[9px] mt-1" style={{ color: chosen === "conquest" ? "#f87171" : chosen === "diplomacy" ? "#fbbf24" : "#c084fc" }}>
                            Chosen: {chosenPathDef.name}
                            {isInProgress && ` (${arc.completedStages.length}/${chosenPathDef.stages.length})`}
                          </p>
                        )}
                      </button>

                      {/* Expanded: choose a path OR advance stages */}
                      {selectedArc === fId && (
                        <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                          {!chosen && arc?.status === "available" && (
                            <div className="grid md:grid-cols-3 gap-2">
                              {(["conquest", "diplomacy", "infiltration"] as FactionArcPath[]).map(p => {
                                const pathDef = def.paths[p];
                                const impossible = pathDef.impossible;
                                return (
                                  <button
                                    key={p}
                                    disabled={impossible}
                                    onClick={() => chooseArcPath(fId, p)}
                                    className={`p-2.5 rounded-lg border text-left transition-all ${
                                      impossible
                                        ? "opacity-40 border-white/5 bg-white/[0.01] cursor-not-allowed"
                                        : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                                    }`}
                                  >
                                    <p className="font-mono text-[10px] font-bold" style={{ color: p === "conquest" ? "#f87171" : p === "diplomacy" ? "#fbbf24" : "#c084fc" }}>
                                      {pathDef.name}
                                    </p>
                                    <p className="font-mono text-[8px] text-white/40 mt-1 leading-tight">{pathDef.summary}</p>
                                    {impossible && <p className="font-mono text-[8px] void-text-error mt-1 italic">IMPOSSIBLE (see spec)</p>}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {chosen && isInProgress && chosenPathDef && (
                            <div>
                              <p className="font-mono text-[9px] text-white/30 tracking-wider mb-2">STAGES</p>
                              {chosenPathDef.stages.map((stage, idx) => {
                                const done = arc.completedStages.includes(stage.id);
                                const available = idx === arc.completedStages.length;
                                const isDiplomacy = chosen === "diplomacy";
                                return (
                                  <div
                                    key={stage.id}
                                    className={`p-2 rounded-lg mb-1 border ${
                                      done ? "void-bg-success void-border-success" :
                                      available ? "void-bg-success void-border-success" :
                                      "bg-white/[0.02] border-white/5 opacity-50"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <p className="font-mono text-[10px] text-white font-bold">{idx + 1}. {stage.name}</p>
                                      {done && <Check size={10} className="void-text-energy" />}
                                    </div>
                                    <p className="font-mono text-[9px] text-white/50 mt-0.5">{stage.description}</p>
                                    <p className="font-mono text-[8px] text-white/30 italic mt-0.5">→ {stage.objective}</p>
                                    {available && (() => {
                                      const isInfiltration = chosen === "infiltration";
                                      const infiltrationContent = isInfiltration ? getInfiltrationStage(stage.id) : null;
                                      return (
                                        <div className="flex gap-2 mt-2 flex-wrap">
                                          {isDiplomacy && idx === 0 && !done && (
                                            <button
                                              onClick={() => {
                                                // Launch the diplomacy minigame for this faction if a table exists
                                                const table = DIPLOMACY_TABLES_AVAILABLE[fId];
                                                if (table) {
                                                  setActiveDiplomacyTable(table);
                                                } else {
                                                  completeArcStage(fId, stage.id);
                                                }
                                              }}
                                              className="px-2 py-1 rounded void-bg-sunk border void-border void-text-accent font-mono text-[9px] void-bg-sunk"
                                            >
                                              OPEN THE TABLE
                                            </button>
                                          )}
                                          {isInfiltration && infiltrationContent && (
                                            <button
                                              onClick={() => {
                                                setActiveInfiltrationFaction(fId);
                                                setActiveInfiltrationStage(stage.id);
                                              }}
                                              className="px-2 py-1 rounded void-bg-system border void-border-system void-text-system font-mono text-[9px] void-bg-system"
                                            >
                                              ENTER INFILTRATION
                                            </button>
                                          )}
                                          <button
                                            onClick={() => completeArcStage(fId, stage.id)}
                                            className="px-2 py-1 rounded void-bg-success border void-border-success void-text-energy font-mono text-[9px] void-bg-success"
                                          >
                                            MARK STAGE COMPLETE
                                          </button>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                );
                              })}
                              {chosenPathDef.reward.description && (
                                <p className="font-mono text-[9px] void-text-energy italic mt-2 border-l-2 void-border-success pl-2">
                                  Reward on completion: {chosenPathDef.reward.description}
                                </p>
                              )}
                            </div>
                          )}

                          {isResolved && chosenPathDef && (
                            <div>
                              <p className="font-mono text-[9px] void-text-energy tracking-wider">RESOLVED — {chosenPathDef.name}</p>
                              <p className="font-mono text-[9px] text-white/60 mt-1 italic">{chosenPathDef.reward.description}</p>
                            </div>
                          )}

                          {isFailed && chosenPathDef && (
                            <div>
                              <p className="font-mono text-[9px] void-text-error tracking-wider">FAILED — {chosenPathDef.name}</p>
                              <p className="font-mono text-[9px] text-white/60 mt-1 italic">{chosenPathDef.summary}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Lore fragments */}
              {act3.discoveredFragments.length > 0 && (
                <div>
                  <p className="font-mono text-[10px] text-white/30 tracking-wider mb-2">
                    EYES' BIOGRAPHY ({act3.discoveredFragments.length}/{EYES_LORE_FRAGMENTS.length})
                  </p>
                  <div className="space-y-2">
                    {EYES_LORE_FRAGMENTS.filter(f => act3.discoveredFragments.includes(f.id)).map(frag => (
                      <div key={frag.id} className="p-3 rounded-lg void-bg-system border void-border-system">
                        <p className="font-mono text-[10px] font-bold void-text-system">{frag.title}</p>
                        <p className="font-mono text-[8px] text-white/30">{frag.period}</p>
                        <p className="font-mono text-[9px] text-white/60 italic mt-1 leading-relaxed">{frag.narrative}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ocularum trigger — available once New Babylon OR Artificial Empire arc is resolved */}
              {!act3.watcherOriginSeen &&
                ((act3.arcs.new_babylon?.status === "resolved") || (act3.arcs.artificial_empire?.status === "resolved")) && (
                <button
                  onClick={() => setShowOcularum(true)}
                  className="w-full p-3 rounded-xl void-bg-sunk border void-border void-bg-sunk text-left"
                >
                  <div className="flex items-center gap-2">
                    <Eye size={14} className="void-text-accent" />
                    <p className="font-mono text-xs font-bold void-text-accent">OCULARUM — THE WATCHER'S ORIGIN</p>
                  </div>
                  <p className="font-mono text-[9px] text-white/40 mt-1">New slideshow available. The Watcher was not a man. He was a network.</p>
                </button>
              )}
            </div>
          );
        })()}

        {/* ═══ ROUTES VIEW (§8.2 quick-win) ═══ */}
        {view === "routes" && (
          <RoutesPanel empire={empire} saveEmpire={saveEmpire} logEvent={logEvent} />
        )}

        {/* ═══ EVENT LOG VIEW (§8.2 quick-win) ═══ */}
        {view === "event_log" && (
          <div className="space-y-2">
            <p className="font-mono text-[10px] text-white/30 tracking-wider">RECENT SECTOR EVENTS (most recent first)</p>
            {(empire.eventLog ?? []).length === 0 && (
              <p className="font-mono text-[11px] text-white/30 italic mt-4">No events logged yet. Take action in a sector and it will appear here.</p>
            )}
            {(empire.eventLog ?? []).map(e => {
              const tone = e.tone;
              const toneColor = tone === "light" ? "emerald-400" : tone === "dark" ? "red-400" : "white/60";
              return (
                <div key={e.id} className={`p-2.5 rounded-lg border bg-white/[0.02] ${tone === "light" ? "void-border-success" : tone === "dark" ? "void-border-error" : "border-white/10"}`}>
                  <div className="flex items-center justify-between">
                    <p className={`font-mono text-[10px] font-bold text-${toneColor}`}>{e.label}</p>
                    <span className="font-mono text-[8px] text-white/20">{new Date(e.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="font-mono text-[9px] text-white/40 mt-1 italic">{e.detail}</p>
                  <p className="font-mono text-[8px] text-white/20 mt-1">{e.sectorId}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Act 3 cinematic overlays */}
      <AnimatePresence>
        {showEyesTransmission && (
          <EyesTransmission
            playerName={playerName}
            onComplete={() => {
              setShowEyesTransmission(false);
              beginAct3();
            }}
          />
        )}
        {showOcularum && (
          <OcularumSlideshow
            onComplete={() => {
              setShowOcularum(false);
              setEmpire(prev => {
                if (!prev.act3) return prev;
                const next: EmpireState = { ...prev, act3: { ...prev.act3, watcherOriginSeen: true } };
                localStorage.setItem("trade_empire_state", JSON.stringify(next));
                return next;
              });
              setNarrativeFlag("watcher_origin_seen");
            }}
          />
        )}
        {showCollector && (
          <CollectorGarden
            lastFactionArc={(() => {
              // Find most recently resolved arc
              if (!empire.act3) return null;
              const sorted = Object.values(empire.act3.arcs)
                .filter(a => a.status === "resolved" && a.resolvedAt)
                .sort((a, b) => (b.resolvedAt ?? 0) - (a.resolvedAt ?? 0));
              return sorted[0]?.factionId ?? null;
            })()}
            onComplete={(won) => recordCollectorResult(won)}
            onClose={() => setShowCollector(false)}
          />
        )}
        {showEndingReveal && empire.act3 && (
          <Act3EndingReveal
            eligible={determineAct3Ending(empire.act3)}
            pathCounts={countPathsResolved(empire.act3)}
            onConfirm={(ending) => chooseAct3Ending(ending)}
            onClose={() => setShowEndingReveal(false)}
          />
        )}
        {activeDiplomacyTable && (
          <DiplomacyTable
            tableId={activeDiplomacyTable}
            onClose={() => setActiveDiplomacyTable(null)}
            onResolve={(result) => {
              // On success, mark the current stage complete (only when a faction arc is in progress).
              if (result === "success" && selectedArc) {
                const arc = empire.act3?.arcs[selectedArc];
                if (arc?.status === "in_progress" && arc.chosenPath === "diplomacy") {
                  const def = ACT3_FACTION_ARCS[selectedArc].paths.diplomacy;
                  const currentStage = def.stages[arc.completedStages.length];
                  if (currentStage) completeArcStage(selectedArc, currentStage.id);
                }
                logEvent({
                  sectorId: selectedArc ?? "diplomacy",
                  label: `Treaty signed with ${GALACTIC_FACTIONS[selectedArc as GalacticFactionId]?.name ?? selectedArc}`,
                  detail: "The Table held. A binding treaty has been entered into the ledger.",
                  tone: "light",
                });
              } else if (result === "failure" && selectedArc) {
                logEvent({
                  sectorId: selectedArc ?? "diplomacy",
                  label: `The Table broke at ${GALACTIC_FACTIONS[selectedArc as GalacticFactionId]?.name ?? selectedArc}`,
                  detail: "The words ran out before the NPCs did.",
                  tone: "dark",
                });
              }
            }}
          />
        )}
        {activeInfiltrationStage && (
          <InfiltrationRunner
            stageId={activeInfiltrationStage}
            onResolve={handleInfiltrationResolve}
            onClose={() => {
              setActiveInfiltrationStage(null);
              setActiveInfiltrationFaction(null);
            }}
          />
        )}
        {/* §7 — Fires once per save when the player first enters the
            Trade Empire era in Act 3 without having committed to a
            path. Commit writes the canonical flag; modal closes on
            its own via the shouldShowInfiltrationSelector guard. */}
        <InfiltrationPathSelector
          open={shouldShowInfiltrationSelector(
            gameState.narrativeFlags,
            gameState.narrativeAct,
          )}
        />
      </AnimatePresence>

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
                    {selectedMission.cost.credits && <p className="void-text-accent">{selectedMission.cost.credits} Credits</p>}
                    {selectedMission.cost.materials && <p className="void-text-energy">{selectedMission.cost.materials} Materials</p>}
                    {selectedMission.cost.influence && <p className="void-text-system">{selectedMission.cost.influence} Influence</p>}
                    {!selectedMission.cost.credits && !selectedMission.cost.materials && !selectedMission.cost.influence && <p className="void-text-energy">Free</p>}
                  </div>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-white/30 mb-1">REWARD</p>
                  <div className="space-y-0.5 font-mono text-[10px]">
                    {selectedMission.rewards.credits && <p className="void-text-accent">+{selectedMission.rewards.credits} Credits</p>}
                    {selectedMission.rewards.materials && <p className="void-text-energy">+{selectedMission.rewards.materials} Materials</p>}
                    {selectedMission.rewards.influence && <p className="void-text-system">+{selectedMission.rewards.influence} Influence</p>}
                    {selectedMission.rewards.intelligence && <p className="void-text-energy">+{selectedMission.rewards.intelligence} Intel</p>}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-white/30">
                <span className="flex items-center gap-1"><Clock size={10} /> {selectedMission.duration}h duration</span>
                <span>{selectedMission.baseSuccessRate}% success rate</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => dispatchMission(selectedMission)}
                  className="flex-1 py-2.5 rounded-lg void-bg-success border void-border-success void-text-energy font-mono text-xs font-bold void-bg-success transition-colors">
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
