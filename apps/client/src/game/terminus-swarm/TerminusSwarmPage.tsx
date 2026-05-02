/* ═══════════════════════════════════════════════════════
   TERMINUS SWARM — Main game page
   Narrative flow: Comms → Puzzle → Signal → Game
   ═══════════════════════════════════════════════════════ */
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { calculateStars } from "../waveRatings";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio, Wrench, AlertTriangle, Play, Pause, FastForward,
  Shield, Crosshair, Snowflake, Flame, Rocket, Zap,
  Heart, CircleDot, ArrowLeft, Package, SkipForward, Target, Sparkles, Swords, Trophy,
} from "lucide-react";
import HanoiPuzzle from "./HanoiPuzzle";
import {
  createGameState, placeTurret, sellTurret, startWave, tick,
  canPlaceTurret, placeBarricade, findPath, TURRETS, getWaveForNumber,
  setSuitModifiers,
} from "./engine";
import { getPassiveBonuses } from "@/game/passiveBonusAggregator";
import { toTerminusModifiers } from "@shared/suitAdapters/terminusSwarm";
import { MAPS } from "./definitions";
import QuestTracker from "../QuestTracker";
import { UPGRADE_LEVELS, TRAPS, LEAGUES, getLeague, ARK_COMMANDER_PASS } from "./baseSystem";
import SeasonPass from "./SeasonPass";
import { DockedNarrative } from "../../components/NarrativeControls";
import { CONVEYOR_COST, RESOURCE_NODES, MAP_RESOURCE_NODES, collectResources, createConveyorState, type ConveyorState } from "./conveyors";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useGame } from "@/contexts/GameContext";
import { useTerminusPvP } from "./pvpClient";
import type { TerminusGameState, TurretDef, GamePhase } from "./types";

import { assetUrl } from "@/lib/assetUrl";
import { TERMINUS_KEYFRAMES } from "@/data/terminusCinematicAssets";
type View = "intro" | "cinematic" | "puzzle" | "signal" | "map_select" | "playing" | "game_over" | "pvp_search" | "pvp_attack";

/** Resolve poster (start frame) for a cinematic video URL by extracting its
 * `cinNN` id and looking up the typed registry. Returns `undefined` if the
 * URL doesn't match the cinematic naming pattern. */
function getCinematicPoster(url: string): string | undefined {
  const m = url.match(/\/(cin\d+)/);
  if (!m) return undefined;
  const key = m[1] as keyof typeof TERMINUS_KEYFRAMES;
  return TERMINUS_KEYFRAMES[key]?.start;
}

const TURRET_LIST: TurretDef[] = Object.values(TURRETS);

const TURRET_ICONS: Record<string, typeof Shield> = {
  pulse_cannon: Crosshair,
  arc_emitter: Zap,
  cryo_array: Snowflake,
  flame_projector: Flame,
  missile_battery: Rocket,
  shield_pylon: Shield,
  emp_mine: AlertTriangle,
  nanite_swarm: Heart,
};

/* ─── SPRITE PATHS ─── */

const ENEMY_SPRITES: Record<string, string> = {
  undead_grub: assetUrl("art/terminus/enemies/undead-grub.png"),
  plague_ant: assetUrl("art/terminus/enemies/plague-ant.png"),
  infected_spore: assetUrl("art/terminus/enemies/infected-spore.png"),
  corrupt_mantis: assetUrl("art/terminus/enemies/corrupt-mantis.png"),
  rot_crawler: assetUrl("art/terminus/enemies/rot-crawler.png"),
  venom_wasp: assetUrl("art/terminus/enemies/venom-wasp.png"),
  bile_hulk: assetUrl("art/terminus/enemies/bile-hulk.png"),
  infected_reaper: assetUrl("art/terminus/enemies/infected-reaper.png"),
  neural_parasite: assetUrl("art/terminus/enemies/neural-parasite.png"),
  swarm_queen: assetUrl("art/terminus/enemies/swarm-queen.png"),
  hive_tyrant: assetUrl("art/terminus/enemies/hive-tyrant.png"),
  source_avatar: assetUrl("art/terminus/enemies/avatar-source.png"),
};

const TURRET_SPRITES: Record<string, string> = {
  pulse_cannon: assetUrl("art/terminus/turrets/pulse-cannon.png"),
  arc_emitter: assetUrl("art/terminus/turrets/arc-emitter.png"),
  cryo_array: assetUrl("art/terminus/turrets/cryo-array.png"),
  flame_projector: assetUrl("art/terminus/turrets/flame-projector.png"),
  missile_battery: assetUrl("art/terminus/turrets/missile-battery.png"),
  shield_pylon: assetUrl("art/terminus/turrets/shield-pylon.png"),
  emp_mine: assetUrl("art/terminus/turrets/emp-mine.png"),
  nanite_swarm: assetUrl("art/terminus/turrets/nanite-swarm.png"),
};

/* ─── CINEMATIC VIDEOS ─── */

const TERMINUS_CINEMATICS = {
  comms_discovery: assetUrl("videos/game-modes/tower-defense/cin01_comms_room_discovery.mp4"),
  first_view: assetUrl("videos/game-modes/tower-defense/cin02_first_view_terminus.mp4"),
  hive_tyrant: assetUrl("videos/game-modes/tower-defense/cin03_hive_tyrant_intro.mp4"),
  source_reveal: assetUrl("videos/game-modes/tower-defense/cin04_source_reveal.mp4"),
  first_wave: assetUrl("videos/game-modes/tower-defense/cin05_first_wave_discovery.mp4"),
};

const TILE_SIZE = 40;

export default function TerminusSwarmPage() {
  const { user, isAuthenticated } = useAuth();
  const { setNarrativeFlag } = useGame();

  // §G.11 — pull suit bonuses through the passive-bonus aggregator
  // and latch them into the engine's module state before
  // createGameState runs. Citizen fetch is enabled only when
  // authenticated; missing data yields an empty bonus list and the
  // engine's module-state defaults (1.0 multipliers, 0 starting
  // currency) keep pre-suit behavior identical.
  const citizenQuery = trpc.citizen.getCharacter.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
  useEffect(() => {
    const citizen = citizenQuery.data;
    if (!citizen) {
      setSuitModifiers({
        startingCurrency: 0,
        extraStartingTurrets: 0,
        towerDamageMult: 1,
        towerCooldownMult: 1,
        virusTickReduction: 1,
      });
      return;
    }
    const bonuses = getPassiveBonuses({
      citizen: citizen as Parameters<typeof getPassiveBonuses>[0]["citizen"],
      gear: citizen.gear,
    });
    const mods = toTerminusModifiers(bonuses);
    setSuitModifiers({
      startingCurrency: mods.startingCurrency,
      extraStartingTurrets: mods.extraStartingTurrets,
      towerDamageMult: mods.towerDamageMult,
      towerCooldownMult: mods.towerCooldownMult,
      virusTickReduction: mods.virusTickReduction,
    });
  }, [citizenQuery.data]);

  const [view, setView] = useState<View>(() => {
    return localStorage.getItem("terminus_puzzle_complete") === "true" ? "map_select" : "intro";
  });
  const [gameState, setGameState] = useState<TerminusGameState | null>(null);
  const [selectedTurret, setSelectedTurret] = useState<string | null>(null);
  const [selectedTrap, setSelectedTrap] = useState<string | null>(null);
  const [placementMode, setPlacementMode] = useState<"turret" | "barricade" | "trap" | "conveyor" | "none">("none");
  const [selectedTileInfo, setSelectedTileInfo] = useState<{ row: number; col: number } | null>(null);
  const [running, setRunning] = useState(false);
  const [showQuests, setShowQuests] = useState(false);
  const [showSeasonPass, setShowSeasonPass] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [narrativeText, setNarrativeText] = useState<string | null>(null);
  const [trophies, setTrophies] = useState(() => parseInt(localStorage.getItem("terminus_trophies") || "0"));
  const [totalKills, setTotalKills] = useState(() => parseInt(localStorage.getItem("terminus_kills") || "0"));
  const [highestWave, setHighestWave] = useState(() => parseInt(localStorage.getItem("terminus_highest_wave") || "0"));
  const [lastWaveStars, setLastWaveStars] = useState(0);
  const [conveyorState, setConveyorState] = useState<ConveyorState | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<TerminusGameState | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const bgLoadedRef = useRef(false);
  const spriteCache = useRef<Record<string, HTMLImageElement>>({});
  const [cinematicUrl, setCinematicUrl] = useState<string | null>(null);
  const [cinematicNext, setCinematicNext] = useState<(() => void) | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Server persistence
  const saveBase = trpc.terminusSwarm.saveBase.useMutation();
  const reportWave = trpc.terminusSwarm.reportWaveComplete.useMutation();
  const updateStats = trpc.terminusSwarm.updateStats.useMutation();
  const updateQuestProgress = trpc.quests.updateProgress.useMutation();
  const battlePassProgress = trpc.battlePass.myProgress.useQuery(undefined, { enabled: isAuthenticated });
  const seasonPassPremium = battlePassProgress.data?.progress?.isPremium ?? false;

  const league = getLeague(trophies);

  // PvP WebSocket connection
  const pvp = useTerminusPvP(user?.id ?? 0, user?.name ?? "Potential", trophies);
  const animRef = useRef<number>(0);

  // Preload enemy + turret sprites on mount
  useEffect(() => {
    const load = (key: string, src: string) => {
      const img = new Image();
      img.onload = () => { spriteCache.current[key] = img; };
      img.src = src;
    };
    Object.entries(ENEMY_SPRITES).forEach(([k, v]) => load(`enemy_${k}`, v));
    Object.entries(TURRET_SPRITES).forEach(([k, v]) => load(`turret_${k}`, v));
  }, []);

  // Play a cinematic video, then call onDone
  const playCinematic = useCallback((url: string, onDone: () => void) => {
    setCinematicUrl(url);
    setCinematicNext(() => onDone);
  }, []);

  const skipCinematic = useCallback(() => {
    setCinematicUrl(null);
    cinematicNext?.();
    setCinematicNext(null);
  }, [cinematicNext]);

  // Start game on map
  const handleStartMap = useCallback((mapIndex: number) => {
    const map = MAPS[mapIndex] || MAPS[0];
    const state = createGameState(map, mapIndex);
    setGameState(state);
    gameRef.current = state;
    setView("playing");
    setRunning(false);

    // Load map background image
    bgLoadedRef.current = false;
    bgImageRef.current = null;
    if (map.backgroundImage) {
      const img = new Image();
      img.onload = () => { bgImageRef.current = img; bgLoadedRef.current = true; };
      img.src = map.backgroundImage;
    }

    // Show wave 1 narrative
    const wave = getWaveForNumber(1);
    if (wave.narrative) setNarrativeText(wave.narrative);
  }, []);

  // Place turret on click
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!gameState || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const col = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const row = Math.floor((e.clientY - rect.top) / TILE_SIZE);

    if (row < 0 || row >= gameState.gridHeight || col < 0 || col >= gameState.gridWidth) return;

    if (placementMode === "barricade") {
      const newState = placeBarricade({ ...gameState, turrets: new Map(gameState.turrets), enemies: new Map(gameState.enemies), projectiles: [...gameState.projectiles] }, row, col);
      setGameState(newState);
      gameRef.current = newState;
      return;
    }

    if (placementMode === "trap" && selectedTrap) {
      const cell = gameState.grid[row]?.[col];
      if (cell?.type === "empty") {
        const trapDef = TRAPS[selectedTrap];
        if (trapDef && gameState.resources.salvage >= trapDef.cost.salvage) {
          gameState.resources.salvage -= trapDef.cost.salvage;
          if (trapDef.cost.viralIchor) gameState.resources.viralIchor -= trapDef.cost.viralIchor;
          // Mark tile (traps don't block pathing — they're hidden)
          setGameState({ ...gameState });
          gameRef.current = gameState;
        }
      }
      return;
    }

    if (placementMode === "conveyor") {
      const cell = gameState.grid[row]?.[col];
      if (cell?.type === "empty" && gameState.resources.salvage >= 10) {
        gameState.resources.salvage -= 10;
        // Mark as conveyor (visual only — conveyors don't block pathing)
        setGameState({ ...gameState });
        gameRef.current = gameState;
      }
      return;
    }

    if (selectedTurret && placementMode === "turret") {
      if (canPlaceTurret(gameState, row, col)) {
        const newState = placeTurret({ ...gameState, turrets: new Map(gameState.turrets), enemies: new Map(gameState.enemies), projectiles: [...gameState.projectiles] }, row, col, selectedTurret);
        setGameState(newState);
        gameRef.current = newState;
      }
    } else {
      // Select tile for info
      setSelectedTileInfo({ row, col });
    }
  }, [gameState, selectedTurret]);

  // Actually launch the wave (after any cinematic)
  const launchWave = useCallback(() => {
    if (!gameState) return;
    const newState = startWave({ ...gameState, turrets: new Map(gameState.turrets), enemies: new Map(gameState.enemies), projectiles: [...gameState.projectiles] });
    setGameState(newState);
    gameRef.current = newState;
    setRunning(true);
    setNarrativeText(null);

    // Narrative effect: surge on wave start
    canvasRef.current?.parentElement?.setAttribute("data-narrative", "surge");
    setTimeout(() => canvasRef.current?.parentElement?.removeAttribute("data-narrative"), 700);

    // Show narrative for next wave
    const wave = getWaveForNumber(newState.wave);
    if (wave.narrative) {
      setNarrativeText(wave.narrative);
    }
  }, [gameState]);

  // Start next wave — play boss cinematics first if applicable
  const handleStartWave = useCallback(() => {
    if (!gameState) return;
    const nextWave = gameState.wave + 1;
    if (nextWave === 10) {
      playCinematic(TERMINUS_CINEMATICS.hive_tyrant, launchWave);
    } else if (nextWave === 20) {
      playCinematic(TERMINUS_CINEMATICS.source_reveal, launchWave);
    } else if (nextWave === 1) {
      playCinematic(TERMINUS_CINEMATICS.first_wave, launchWave);
    } else {
      launchWave();
    }
  }, [gameState, launchWave, playCinematic]);

  // Game loop
  useEffect(() => {
    if (!running || !gameRef.current) return;

    let lastTime = performance.now();
    let accumulator = 0;
    const frameTime = 1000 / 60;

    const loop = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;
      accumulator += delta * speed;

      while (accumulator >= frameTime) {
        if (gameRef.current) {
          const updated = tick(gameRef.current);
          gameRef.current = updated;

          if (updated.phase === "intermission" || updated.phase === "victory" || updated.phase === "defeat") {
            setRunning(false);
            setGameState({ ...updated });

            // Report wave to server + collect conveyor resources
            if (updated.phase === "intermission" && isAuthenticated) {
              const isBoss = updated.wave === 10 || updated.wave === 15 || updated.wave === 20;
              reportWave.mutate({
                wave: updated.wave,
                kills: updated.kills,
                bossKilled: isBoss,
                sourceAvatarKilled: updated.wave === 20,
                resourcesEarned: updated.resources,
              });
              // Quest integration: increment swarm-related quests
              updateQuestProgress.mutate({ questId: "d_survive_wave", increment: 1 });
              if (isBoss) updateQuestProgress.mutate({ questId: "w_kill_boss", increment: 1 });
              if (updated.wave >= 10) {
                updateQuestProgress.mutate({ questId: "w_reach_wave_10", increment: 1 });
                // Narrative gate — TomePlacement.flagReq for terminus-swarm
                // and civil-war-samsara-rising. Idempotent (setNarrativeFlag
                // skips if already true).
                setNarrativeFlag("terminus_wave_10", true);
              }
            }

            // Collect conveyor resources between waves
            if (updated.phase === "intermission" && conveyorState) {
              const conveyorResources = collectResources(conveyorState);
              updated.resources.salvage += conveyorResources.salvage;
              updated.resources.viralIchor += conveyorResources.viralIchor;
              updated.resources.neuralCores += conveyorResources.neuralCores;
              updated.resources.voidCrystals += conveyorResources.voidCrystals;
            }

            // Track stats + calculate wave star rating
            if (updated.wave > highestWave) {
              setHighestWave(updated.wave);
              localStorage.setItem("terminus_highest_wave", String(updated.wave));
            }
            // Star rating: survived (1★), no core damage (2★), under time limit (3★)
            const coreDmg = (updated.coreMaxHealth ?? 500) - (updated.coreHealth ?? 500);
            const waveTime = Math.floor(updated.frameCount / 60); // Convert frames to seconds
            const starsResult = calculateStars(true, coreDmg, waveTime, 60);
            setLastWaveStars(starsResult.stars);
            setTotalKills(updated.kills);
            localStorage.setItem("terminus_kills", String(updated.kills));

            // Update server stats
            if (isAuthenticated) {
              updateStats.mutate({
                highestWave: Math.max(highestWave, updated.wave),
                totalKills: updated.kills,
                trophies,
                gamesPlayed: 1, // incremental
              });
            }

            return;
          }
        }
        accumulator -= frameTime;
      }

      setGameState(gameRef.current ? { ...gameRef.current } : null);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [running, speed]);

  // Canvas rendering
  useEffect(() => {
    if (!gameState || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const w = gameState.gridWidth * TILE_SIZE;
    const h = gameState.gridHeight * TILE_SIZE;
    canvasRef.current.width = w;
    canvasRef.current.height = h;

    // Clear
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, w, h);

    // Background image layer (if loaded)
    if (bgLoadedRef.current && bgImageRef.current) {
      ctx.save();
      ctx.globalAlpha = 0.45;
      ctx.drawImage(bgImageRef.current, 0, 0, w, h);
      ctx.globalAlpha = 1;
      ctx.restore();

      // Ambient breathing overlay
      const t = performance.now();
      const breathe = 0.02 + 0.01 * Math.sin(t * 0.0008);
      ctx.save();
      ctx.globalAlpha = breathe;
      ctx.fillStyle = "#ff4444";
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    // Grid overlay — semi-transparent tile indicators
    for (let r = 0; r < gameState.gridHeight; r++) {
      for (let c = 0; c < gameState.gridWidth; c++) {
        const cell = gameState.grid[r][c];
        const x = c * TILE_SIZE;
        const y = r * TILE_SIZE;

        if (cell.type === "blocked") {
          ctx.fillStyle = bgLoadedRef.current ? "rgba(26, 26, 46, 0.5)" : "#1a1a2e";
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        } else if (cell.type === "spawn") {
          ctx.fillStyle = bgLoadedRef.current ? "rgba(80, 20, 20, 0.55)" : "#331111";
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          // Pulsing spawn indicator
          const pulse = 0.15 + 0.1 * Math.sin(performance.now() * 0.003);
          ctx.fillStyle = `rgba(255, 60, 60, ${pulse})`;
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        } else if (cell.type === "core") {
          ctx.fillStyle = bgLoadedRef.current ? "rgba(17, 51, 51, 0.5)" : "#113333";
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        } else if (!bgLoadedRef.current) {
          ctx.fillStyle = (r + c) % 2 === 0 ? "#0f0f1a" : "#12121f";
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        }

        // Grid lines — subtle when bg image present
        ctx.strokeStyle = bgLoadedRef.current ? "rgba(100, 180, 255, 0.08)" : "#1a1a2e";
        ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);

        // Highlight placeable tiles with green edge glow
        if (selectedTurret && cell.type === "empty") {
          ctx.fillStyle = bgLoadedRef.current ? "rgba(68, 255, 136, 0.08)" : "rgba(68, 136, 255, 0.1)";
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.strokeStyle = "rgba(68, 255, 136, 0.15)";
          ctx.strokeRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        }
      }
    }

    // Core
    const cx = gameState.corePosition.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = gameState.corePosition.y * TILE_SIZE + TILE_SIZE / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, TILE_SIZE * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = gameState.coreHealth > gameState.coreMaxHealth * 0.3 ? "#00ddff" : "#ff4444";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("CORE", cx, cy);

    // Turrets
    for (const [, turret] of gameState.turrets) {
      const tx = turret.col * TILE_SIZE + TILE_SIZE / 2;
      const ty = turret.row * TILE_SIZE + TILE_SIZE / 2;

      // Range circle
      if (selectedTileInfo?.row === turret.row && selectedTileInfo?.col === turret.col) {
        ctx.beginPath();
        ctx.arc(tx, ty, turret.def.range * TILE_SIZE, 0, Math.PI * 2);
        ctx.strokeStyle = turret.def.color + "40";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Turret body — use sprite if loaded, fallback to circle
      const turretSprite = spriteCache.current[`turret_${turret.def.type}`];
      if (turretSprite) {
        const spriteSize = TILE_SIZE * 0.8;
        ctx.drawImage(turretSprite, tx - spriteSize / 2, ty - spriteSize / 2, spriteSize, spriteSize);
      } else {
        ctx.beginPath();
        ctx.arc(tx, ty, TILE_SIZE * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = turret.def.color + "60";
        ctx.fill();
        ctx.strokeStyle = turret.def.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Health bar
      if (turret.health < turret.maxHealth) {
        const barW = TILE_SIZE * 0.8;
        const barH = 3;
        const barX = tx - barW / 2;
        const barY = ty + TILE_SIZE * 0.35 + 4;
        ctx.fillStyle = "#333";
        ctx.fillRect(barX, barY, barW, barH);
        ctx.fillStyle = turret.health > turret.maxHealth * 0.5 ? "#44ff44" : "#ff4444";
        ctx.fillRect(barX, barY, barW * (turret.health / turret.maxHealth), barH);
      }
    }

    // Enemies
    for (const [, enemy] of gameState.enemies) {
      if (!enemy.alive) continue;
      const ex = enemy.x * TILE_SIZE + TILE_SIZE / 2;
      const ey = enemy.y * TILE_SIZE + TILE_SIZE / 2;
      const size = TILE_SIZE * 0.3 * enemy.def.size;

      // Enemy body — use sprite if loaded, fallback to circle
      const enemySprite = spriteCache.current[`enemy_${enemy.def.type}`];
      if (enemySprite) {
        const spriteW = size * 2;
        ctx.drawImage(enemySprite, ex - spriteW / 2, ey - spriteW / 2, spriteW, spriteW);
      } else {
        ctx.beginPath();
        ctx.arc(ex, ey, size, 0, Math.PI * 2);
        ctx.fillStyle = enemy.def.color;
        ctx.fill();
      }

      // Flying indicator
      if (enemy.def.flying) {
        ctx.strokeStyle = "#ffffff40";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ex, ey, size + 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Health bar
      if (enemy.health < enemy.maxHealth) {
        const barW = size * 2;
        const barH = 2;
        ctx.fillStyle = "#333";
        ctx.fillRect(ex - barW / 2, ey - size - 5, barW, barH);
        ctx.fillStyle = "#ff4444";
        ctx.fillRect(ex - barW / 2, ey - size - 5, barW * (enemy.health / enemy.maxHealth), barH);
      }

      // Slow/stun indicators
      if (enemy.slowTimer > 0) {
        ctx.fillStyle = "#88ddff";
        ctx.fillRect(ex - 2, ey + size + 2, 4, 4);
      }
      if (enemy.stunTimer > 0) {
        ctx.fillStyle = "#ffdd44";
        ctx.fillRect(ex - 2, ey + size + 2, 4, 4);
      }
    }

    // Projectiles
    for (const proj of gameState.projectiles) {
      const px = proj.x * TILE_SIZE + TILE_SIZE / 2;
      const py = proj.y * TILE_SIZE + TILE_SIZE / 2;
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fillStyle = proj.color;
      ctx.fill();
    }
  }, [gameState, selectedTurret, selectedTileInfo]);

  return (
    <div className="min-h-screen bg-black">
      {/* ═══ CINEMATIC VIDEO OVERLAY ═══ */}
      <AnimatePresence>
        {cinematicUrl && (
          <motion.div
            key="cinematic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <video
              ref={videoRef}
              src={cinematicUrl}
              autoPlay
              playsInline
              onEnded={skipCinematic}
              poster={getCinematicPoster(cinematicUrl)}
              className="w-full h-full object-contain"
            />
            <button
              onClick={skipCinematic}
              className="absolute bottom-8 right-8 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white/60 font-mono text-xs hover:bg-white/20 hover:text-white transition-all"
            >
              SKIP ›
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* ═══ INTRO — Comms Room ═══ */}
        {view === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen gap-6 p-6 text-center">
            <Radio size={48} className="void-text-accent animate-pulse" />
            <h1 className="font-display text-2xl tracking-[0.2em] void-text-accent">COMMS ROOM</h1>
            <div className="max-w-md space-y-4 font-mono text-sm text-white/70 leading-relaxed">
              <p>The long-range communication array is offline. Damage from the initial system failures has misaligned the cascading gear mechanism.</p>
              <p>If you can repair it, you might be able to reach other Arks... if any survived.</p>
              <p className="void-text-accent italic">Elara: "I'm detecting faint signals on the emergency band. They're too degraded to decode without the full array. Fix the gears, Potential."</p>
            </div>
            <button onClick={() => playCinematic(TERMINUS_CINEMATICS.comms_discovery, () => setView("puzzle"))}
              className="flex items-center gap-2 px-6 py-3 rounded-lg void-bg-sunk border void-border void-text-accent font-mono text-sm void-bg-sunk transition-all">
              <Wrench size={16} /> REPAIR COMMS ARRAY
            </button>
          </motion.div>
        )}

        {/* ═══ PUZZLE — Towers of Hanoi ═══ */}
        {view === "puzzle" && (
          <motion.div key="puzzle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HanoiPuzzle
              numDiscs={4}
              onComplete={() => {
                localStorage.setItem("terminus_puzzle_complete", "true");
                setView("signal");
              }}
              onSkip={() => {
                localStorage.setItem("terminus_puzzle_complete", "true");
                setView("signal");
              }}
            />
          </motion.div>
        )}

        {/* ═══ DISTRESS SIGNAL ═══ */}
        {view === "signal" && (
          <motion.div key="signal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen gap-6 p-6 text-center">
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }}>
              <AlertTriangle size={48} className="void-text-error" />
            </motion.div>
            <h1 className="font-display text-2xl tracking-[0.2em] void-text-error">DISTRESS SIGNAL RECEIVED</h1>
            <div className="max-w-lg space-y-4 font-mono text-sm leading-relaxed">
              <p className="void-text-error">[AUTOMATED DISTRESS BEACON — INCEPTION ARK #25]</p>
              <p className="text-white/50">[SIGNAL ORIGIN: ROGUE PLANET — DESIGNATION: TERMINUS]</p>
              <p className="text-white/70">
                "This is... anyone... Ark Twenty-Five... crashed... the planet... it's not what we thought...
                the first wave... they're all... something is here... it gets inside your head...
                machines too... everything is... infected..."
              </p>
              <p className="void-text-error italic">[SIGNAL DEGRADED — VIRAL INTERFERENCE DETECTED]</p>
              <p className="void-text-accent italic">
                Elara: "That signal. It's from one of the first wave Arks. A thousand ships launched before us,
                Potential. They crashed on a rogue planet called Terminus. And something... something is wrong there.
                Something called The Source. We need to help them reactivate their defenses."
              </p>
            </div>
            <button onClick={() => playCinematic(TERMINUS_CINEMATICS.first_view, () => setView("map_select"))}
              className="flex items-center gap-2 px-6 py-3 rounded-lg void-bg-error border void-border-error void-text-error font-mono text-sm void-bg-error transition-all">
              <Play size={16} /> LAUNCH TERMINUS SWARM
            </button>
          </motion.div>
        )}

        {/* ═══ MAP SELECT ═══ */}
        {view === "map_select" && (
          <motion.div key="map" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-6 max-w-2xl mx-auto">
            <img src={assetUrl("art/logos/terminus-swarm.png")} alt="Terminus Swarm" className="h-10 object-contain mb-3 opacity-90" />

            {/* League + stats bar */}
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-xl">{league.icon}</span>
              <div>
                <p className="font-mono text-xs font-bold" style={{ color: league.color }}>{league.name}</p>
                <p className="font-mono text-[10px] text-white/30">{trophies} Trophies</p>
              </div>
              <div className="flex gap-3 ml-auto font-mono text-[10px]">
                <span className="text-white/40">Wave {highestWave}</span>
                <span className="text-white/40">{totalKills} kills</span>
              </div>
            </div>

            {/* Mode buttons */}
            <div className="flex gap-2 mb-4">
              <button onClick={() => setShowSeasonPass(true)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg void-bg-sunk border void-border void-text-accent font-mono text-xs void-bg-sunk">
                <Trophy size={12} /> SEASON PASS
              </button>
              <button onClick={() => setShowQuests(true)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg void-bg-system border void-border-system void-text-system font-mono text-xs void-bg-system">
                <Target size={12} /> QUESTS
              </button>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <img src={assetUrl("art/terminus/maps/terminus-planet.png")} alt="Terminus" className="w-10 h-10 rounded-full border void-border-error shadow-[0_0_12px_color-mix(in oklch, var(--energy-error) 30%, transparent)]" />
              <p className="font-mono text-xs text-white/40">DEFEND — Choose a section of the crashed Ark</p>
            </div>
            <div className="space-y-2 mb-6">
              {MAPS.map((map, i) => (
                <button key={i} onClick={() => handleStartMap(i)}
                  className="w-full text-left p-4 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] void-border-error transition-all">
                  <p className="font-mono text-sm font-bold text-white">{map.name}</p>
                  <p className="font-mono text-[10px] text-white/40 mt-1">{map.description}</p>
                  <p className="font-mono text-[9px] text-white/20 mt-1">{map.width}×{map.height} grid • {map.spawnPoints.length} spawn point(s)</p>
                </button>
              ))}
            </div>

            {/* PvP Raid button */}
            <p className="font-mono text-xs text-white/40 mb-3">ATTACK — Raid another player's base</p>
            <button
              onClick={() => setView("pvp_search")}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-lg border void-border-error void-bg-error void-bg-error void-text-error font-mono text-sm void-border-error transition-all"
            >
              <Swords size={16} /> FIND BASE TO RAID
            </button>
            <p className="font-mono text-[9px] text-white/20 mt-1 text-center">Costs 5 salvage per search • Earn trophies and steal resources</p>
          </motion.div>
        )}

        {/* ═══ PVP SEARCH ═══ */}
        {view === "pvp_search" && (
          <motion.div key="pvp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6">
            {pvp.phase === "idle" || pvp.phase === "searching" ? (
              <>
                <Swords size={48} className="void-text-error animate-pulse" />
                <h2 className="font-display text-xl tracking-[0.2em] void-text-error">
                  {pvp.phase === "searching" ? "SCANNING FOR TARGET" : "READY TO RAID"}
                </h2>
                <p className="font-mono text-sm text-white/40">
                  {pvp.phase === "searching" ? "Scanning bases in your trophy range..." : "Connect to find a target base"}
                </p>
                <p className="font-mono text-[10px] text-white/20">Trophy range: {Math.max(0, trophies - 300)} — {trophies + 300}</p>
                {pvp.error && <p className="font-mono text-xs void-text-error">{pvp.error}</p>}
                <div className="flex gap-3">
                  {pvp.phase === "idle" && (
                    <button onClick={() => pvp.connect()}
                      className="px-5 py-2 void-bg-error border void-border-error void-text-error rounded-lg font-mono text-xs void-bg-error">
                      SEARCH FOR BASE
                    </button>
                  )}
                  <button onClick={() => { pvp.cancel(); setView("map_select"); }}
                    className="px-5 py-2 border border-white/20 text-white/40 rounded-lg font-mono text-xs hover:text-white/60">
                    CANCEL
                  </button>
                </div>
              </>
            ) : pvp.phase === "base_found" && pvp.defenderBase ? (
              <>
                <h2 className="font-display text-xl tracking-[0.2em] void-text-error">TARGET FOUND</h2>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-sm w-full">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-mono text-sm text-white font-bold">{pvp.defenderBase.userName}</p>
                    <p className="font-mono text-xs void-text-accent">{pvp.defenderBase.trophies} 🏆</p>
                  </div>
                  <div className="flex gap-3 font-mono text-[10px] text-white/40">
                    <span>{pvp.defenderBase.turrets.length} turrets</span>
                    <span>{pvp.defenderBase.barricades.length} walls</span>
                    <span>Lv.{pvp.defenderBase.commanderLevel}</span>
                  </div>
                  <div className="flex gap-3 mt-2 font-mono text-[9px] text-white/30">
                    <span className="void-text-accent">{pvp.defenderBase.resources.salvage} SAL</span>
                    <span className="void-text-energy">{pvp.defenderBase.resources.viralIchor} ICH</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => pvp.startAttack()}
                    className="px-6 py-2.5 void-bg-error border void-border-error void-text-error rounded-lg font-mono text-sm font-bold void-bg-error">
                    ATTACK
                  </button>
                  <button onClick={() => pvp.skipBase()}
                    className="px-4 py-2 border border-white/20 text-white/40 rounded-lg font-mono text-xs hover:text-white/60">
                    SKIP (-5 SAL)
                  </button>
                </div>
              </>
            ) : pvp.phase === "results" && pvp.raidResult ? (
              <>
                <h2 className={`font-display text-2xl tracking-[0.2em] ${pvp.raidResult.stars >= 2 ? "void-text-accent" : pvp.raidResult.stars === 1 ? "text-white" : "void-text-error"}`}>
                  {"★".repeat(pvp.raidResult.stars)}{"☆".repeat(3 - pvp.raidResult.stars)}
                </h2>
                <div className="flex gap-4 font-mono text-sm">
                  <span className="void-text-accent">+{pvp.raidResult.loot.salvage} SAL</span>
                  <span className="void-text-energy">+{pvp.raidResult.loot.viralIchor} ICH</span>
                  <span className={pvp.raidResult.trophyChange >= 0 ? "void-text-energy" : "void-text-error"}>
                    {pvp.raidResult.trophyChange >= 0 ? "+" : ""}{pvp.raidResult.trophyChange} 🏆
                  </span>
                </div>
                <button onClick={() => { pvp.disconnect(); setView("map_select"); }}
                  className="px-6 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg font-mono text-sm hover:bg-white/20">
                  RETURN TO BASE
                </button>
              </>
            ) : (
              <p className="font-mono text-sm text-white/40 animate-pulse">Attacking...</p>
            )}
          </motion.div>
        )}

        {/* ═══ PLAYING ═══ */}
        {view === "playing" && gameState && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-screen bg-black overflow-hidden">

            {/* Narrative panel — player-paced, not auto-dismiss */}
            {narrativeText && (
              <DockedNarrative
                messages={[{ speaker: "system", text: narrativeText }]}
                onDismiss={() => setNarrativeText(null)}
                game="terminus"
              />
            )}

            {/* Top bar: wave, core health, resources */}
            <div className="flex items-center gap-3 px-3 py-2 border-b border-white/10 bg-black/60 shrink-0">
              <button onClick={() => setView("map_select")} className="text-white/30 hover:text-white/60">
                <ArrowLeft size={14} />
              </button>
              <span className="font-mono text-xs void-text-error font-bold">WAVE {gameState.wave}</span>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded void-bg-error">
                <Heart size={10} className="void-text-error" />
                <span className="font-mono text-xs void-text-error">{Math.ceil(gameState.coreHealth)}/{gameState.coreMaxHealth}</span>
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-3 font-mono text-[10px]">
                <span className="void-text-accent">{gameState.resources.salvage} <span className="text-white/20">SAL</span></span>
                <span className="void-text-energy">{gameState.resources.viralIchor} <span className="text-white/20">ICH</span></span>
                <span className="void-text-system">{gameState.resources.neuralCores} <span className="text-white/20">CORE</span></span>
                <span className="void-text-energy">{gameState.resources.voidCrystals} <span className="text-white/20">VOID</span></span>
              </div>
              <span className="font-mono text-[10px] text-white/20">K:{gameState.kills}</span>
            </div>

            {/* Game board */}
            <div className="flex-1 flex items-center justify-center overflow-auto p-2">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="cursor-crosshair border border-white/5 rounded"
                style={{ imageRendering: "pixelated" }}
              />
            </div>

            {/* Bottom bar: turret selection + controls */}
            <div className="border-t border-white/10 bg-black/60 px-3 py-2 shrink-0">
              {/* Wave controls */}
              <div className="flex items-center gap-2 mb-2">
                {(gameState.phase === "setup" || gameState.phase === "intermission") && (
                  <button onClick={handleStartWave}
                    className="flex items-center gap-1 px-4 py-1.5 rounded-lg void-bg-error border void-border-error void-text-error font-mono text-xs void-bg-error transition-all">
                    <Play size={12} /> {gameState.phase === "setup" ? "START WAVE 1" : `START WAVE ${gameState.wave + 1}`}
                  </button>
                )}
                {running && (
                  <>
                    <button onClick={() => setRunning(false)} className="p-1.5 rounded bg-white/10 text-white/60">
                      <Pause size={12} />
                    </button>
                    <button onClick={() => setSpeed(speed === 1 ? 2 : speed === 2 ? 3 : 1)}
                      className="p-1.5 rounded bg-white/10 text-white/60 font-mono text-[10px]">
                      {speed}×
                    </button>
                  </>
                )}
                {gameState.phase === "defeat" && (
                  <span className="font-mono text-sm void-text-error font-bold animate-pulse">ARK CORE DESTROYED</span>
                )}
                <div className="flex-1" />
                {/* Barricade mode */}
                <button
                  onClick={() => {
                    if (placementMode === "barricade") { setPlacementMode("none"); }
                    else { setPlacementMode("barricade"); setSelectedTurret(null); }
                  }}
                  className={`flex items-center gap-1 px-3 py-1 rounded font-mono text-[10px] transition-colors ${
                    placementMode === "barricade" ? "bg-white/20 text-white" : "bg-white/5 text-white/40 hover:text-white/60"
                  }`}
                >
                  <Shield size={10} /> WALL (25)
                </button>
                {/* Trap mode */}
                <button
                  onClick={() => {
                    if (placementMode === "trap") { setPlacementMode("none"); setSelectedTrap(null); }
                    else { setPlacementMode("trap"); setSelectedTurret(null); setSelectedTrap("proximity_mine"); }
                  }}
                  className={`flex items-center gap-1 px-3 py-1 rounded font-mono text-[10px] transition-colors ${
                    placementMode === "trap" ? "void-bg-error void-text-error" : "bg-white/5 text-white/40 hover:text-white/60"
                  }`}
                >
                  <AlertTriangle size={10} /> TRAP
                </button>
                {/* Conveyor mode */}
                <button
                  onClick={() => {
                    if (placementMode === "conveyor") { setPlacementMode("none"); }
                    else { setPlacementMode("conveyor"); setSelectedTurret(null); setSelectedTrap(null); }
                  }}
                  className={`flex items-center gap-1 px-3 py-1 rounded font-mono text-[10px] transition-colors ${
                    placementMode === "conveyor" ? "void-bg-success void-text-energy" : "bg-white/5 text-white/40 hover:text-white/60"
                  }`}
                >
                  <FastForward size={10} /> BELT (10)
                </button>
                {/* Season pass */}
                <button
                  onClick={() => setShowSeasonPass(true)}
                  className="flex items-center gap-1 px-3 py-1 rounded void-bg-sunk void-text-accent font-mono text-[10px] void-bg-sunk"
                >
                  <Sparkles size={10} /> PASS
                </button>
                {/* Quest tracker */}
                <button
                  onClick={() => setShowQuests(true)}
                  className="flex items-center gap-1 px-3 py-1 rounded void-bg-system void-text-system font-mono text-[10px] void-bg-system"
                >
                  <Target size={10} /> QUESTS
                </button>
                {(selectedTurret || placementMode !== "none") && (
                  <button onClick={() => { setSelectedTurret(null); setPlacementMode("none"); }}
                    className="px-3 py-1 rounded bg-white/10 text-white/40 font-mono text-[10px]">
                    CANCEL
                  </button>
                )}
              </div>

              {/* Turret shop */}
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {TURRET_LIST.map(turret => {
                  const Icon = TURRET_ICONS[turret.type] || CircleDot;
                  const canAfford = gameState.resources.salvage >= turret.cost.salvage &&
                    (!turret.cost.viralIchor || gameState.resources.viralIchor >= turret.cost.viralIchor) &&
                    (!turret.cost.neuralCores || gameState.resources.neuralCores >= turret.cost.neuralCores);
                  const isSelected = selectedTurret === turret.type;

                  return (
                    <button
                      key={turret.type}
                      onClick={() => {
                        if (isSelected) { setSelectedTurret(null); setPlacementMode("none"); }
                        else { setSelectedTurret(turret.type); setPlacementMode("turret"); }
                      }}
                      className={`shrink-0 flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                        isSelected ? "border-white bg-white/10" :
                        canAfford ? "border-white/10 bg-white/[0.02] hover:border-white/20" :
                        "border-white/5 bg-black opacity-40"
                      }`}
                      style={{ minWidth: "64px" }}
                    >
                      <Icon size={14} style={{ color: turret.color }} />
                      <span className="font-mono text-[8px] text-white/60 truncate w-full text-center">{turret.name}</span>
                      <span className="font-mono text-[8px] void-text-accent">{turret.cost.salvage}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Turret detail panel — shows when clicking a placed turret */}
            {selectedTileInfo && gameState && (() => {
              const cell = gameState.grid[selectedTileInfo.row]?.[selectedTileInfo.col];
              if (!cell?.turretId) return null;
              const turret = gameState.turrets.get(cell.turretId);
              if (!turret) return null;
              const nextLevel = UPGRADE_LEVELS[turret.level]; // index = next level (0-based levels)
              const canUpgrade = nextLevel && turret.level < 6 &&
                gameState.resources.salvage >= (nextLevel?.cost.salvage || 0);

              return (
                <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-30 w-72 p-3 rounded-xl border border-white/20 bg-black/90 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: turret.def.color }} />
                      <span className="font-mono text-xs font-bold text-white">{turret.def.name}</span>
                      <span className="font-mono text-[9px] text-white/30">Lv.{turret.level}</span>
                    </div>
                    <button onClick={() => setSelectedTileInfo(null)} className="text-white/30 hover:text-white/60 text-xs">✕</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2 text-center">
                    <div>
                      <p className="font-mono text-[9px] text-white/30">DMG</p>
                      <p className="font-mono text-xs void-text-error font-bold">{Math.round(turret.def.damage * turret.level)}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[9px] text-white/30">RANGE</p>
                      <p className="font-mono text-xs void-text-energy font-bold">{turret.def.range}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[9px] text-white/30">HP</p>
                      <p className="font-mono text-xs void-text-energy font-bold">{Math.ceil(turret.health)}/{turret.maxHealth}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {canUpgrade && nextLevel && (
                      <button
                        onClick={() => {
                          if (!nextLevel || gameState.resources.salvage < nextLevel.cost.salvage) return;
                          gameState.resources.salvage -= nextLevel.cost.salvage;
                          if (nextLevel.cost.viralIchor) gameState.resources.viralIchor -= nextLevel.cost.viralIchor;
                          if (nextLevel.cost.neuralCores) gameState.resources.neuralCores -= nextLevel.cost.neuralCores;
                          turret.level++;
                          turret.maxHealth = Math.round(turret.def.health * nextLevel.healthMultiplier);
                          turret.health = turret.maxHealth;
                          setGameState({ ...gameState });
                          gameRef.current = gameState;
                        }}
                        className="flex-1 py-1.5 rounded void-bg-success border void-border-success void-text-energy font-mono text-[10px] font-bold void-bg-success"
                      >
                        UPGRADE ({nextLevel.cost.salvage})
                      </button>
                    )}
                    <button
                      onClick={() => {
                        const newState = sellTurret({ ...gameState, turrets: new Map(gameState.turrets) }, cell.turretId!);
                        setGameState(newState);
                        gameRef.current = newState;
                        setSelectedTileInfo(null);
                      }}
                      className="px-3 py-1.5 rounded void-bg-error border void-border-error void-text-error font-mono text-[10px] void-bg-error"
                    >
                      SELL
                    </button>
                  </div>
                  {turret.def.special && (
                    <p className="font-mono text-[9px] text-white/20 mt-2">{turret.def.special}</p>
                  )}
                  <p className="font-mono text-[8px] text-white/10 mt-1">Kills: {turret.kills}</p>
                </div>
              );
            })()}
          </motion.div>
        )}

        {/* ═══ GAME OVER ═══ */}
        {view === "game_over" && (
          <motion.div key="gameover" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
            <h2 className="font-display text-2xl void-text-error">ARK DEFENSES FALLEN</h2>
            <button onClick={() => setView("map_select")}
              className="px-6 py-3 void-bg-error border void-border-error void-text-error rounded-lg font-mono text-sm">
              TRY AGAIN
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quest Tracker Modal */}
      {showQuests && (
        <QuestTracker
          progress={{}}
          onClaimReward={(id) => { console.log("Claim reward:", id); }}
          onClose={() => setShowQuests(false)}
        />
      )}

      {/* Season Pass Modal */}
      {showSeasonPass && (
        <SeasonPass
          currentPoints={totalKills + highestWave * 10} // Simple point calculation from gameplay
          isPremium={seasonPassPremium}
          claimedTiers={new Set()}
          onClaimTier={(tier) => { console.log("Claim tier:", tier); }}
          onPurchasePremium={() => { console.log("Purchase premium"); }}
          onClose={() => setShowSeasonPass(false)}
        />
      )}
    </div>
  );
}
