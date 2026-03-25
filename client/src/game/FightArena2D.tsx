/**
 * FightArena2D — React wrapper for the Canvas-based 2D fighting engine.
 * 
 * Drop-in replacement for FightArena3D. Same props interface, same callbacks,
 * but renders on HTML5 Canvas with proper AABB hitbox collision, multi-frame
 * animation, and a camera system.
 */
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Swords, Shield, Zap, ChevronUp, Hand, Timer } from "lucide-react";
import type { FighterData, ArenaData, DifficultyLevel } from "./gameData";
import { FightEngine2D, type FightCallbacks2D, type FightPhase2D, type TouchInput2D, type Difficulty2D, type TrainingData, type MoveListEntry } from "./FightEngine2D";
import TrainingModeOverlay from "./TrainingModeOverlay";

/* ═══ PROPS ═══ */
interface FightArena2DProps {
  player: FighterData;
  opponent: FighterData;
  arena: ArenaData;
  difficulty: DifficultyLevel;
  onMatchEnd: (winner: "p1" | "p2", perfect: boolean) => void;
  onBack: () => void;
  trainingMode?: boolean;
}

function mapDifficulty(d: DifficultyLevel): Difficulty2D {
  switch (d.id) {
    case "easy": return "recruit";
    case "normal": return "soldier";
    case "hard": return "veteran";
    case "nightmare": return "archon";
    default: return "soldier";
  }
}

/* ═══ GESTURE RECOGNIZER ═══ */
interface GestureTracker {
  id: number;
  startX: number;
  startY: number;
  startTime: number;
  side: "left" | "right";
  ended: boolean;
}

const SWIPE_THRESHOLD = 30;
const TAP_TIME = 250;
const DOUBLE_TAP_TIME = 300;

/* ═══ TUTORIAL ═══ */
const TUTORIAL_DONE_KEY = "loredex_fight2d_tutorial_done";

function GestureTutorial({ onComplete, onSkip }: { onComplete: () => void; onSkip: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: <Hand size={32} />, title: "TAP RIGHT", desc: "Light attack" },
    { icon: <Swords size={32} />, title: "SWIPE RIGHT →", desc: "Medium attack" },
    { icon: <Zap size={32} />, title: "HOLD RIGHT", desc: "Heavy charge → release" },
    { icon: <Shield size={32} />, title: "TAP LEFT", desc: "Block" },
    { icon: <ChevronUp size={32} />, title: "SWIPE UP", desc: "Jump" },
    { icon: <Timer size={32} />, title: "DOUBLE TAP LEFT", desc: "Dash back (dodge)" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < steps.length - 1) {
        setStep(step + 1);
      } else {
        onComplete();
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/85"
    >
      <div className="text-center space-y-4">
        <p className="font-mono text-xs text-primary/60 tracking-[0.3em]">COMBAT CONTROLS</p>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="text-primary">{steps[step].icon}</div>
            <p className="font-display text-xl font-bold tracking-wider text-foreground">{steps[step].title}</p>
            <p className="font-mono text-sm text-muted-foreground">{steps[step].desc}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex gap-1 justify-center mt-4">
          {steps.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>
      </div>
      <button
        onClick={onSkip}
        className="absolute bottom-8 font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        [click to skip]
      </button>
    </motion.div>
  );
}

/* ═══ MAIN COMPONENT ═══ */
export default function FightArena2D({
  player,
  opponent,
  arena,
  difficulty,
  onMatchEnd,
  onBack,
  trainingMode = false,
}: FightArena2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<FightEngine2D | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gesturesRef = useRef<Map<number, GestureTracker>>(new Map());
  const lastTapRef = useRef<{ time: number; side: "left" | "right" }>({ time: 0, side: "left" });

  const [phase, setPhase] = useState<FightPhase2D>("intro");
  const [showIntroSplash, setShowIntroSplash] = useState(true);
  const [p1Perfect, setP1Perfect] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showTutorial, setShowTutorial] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem(TUTORIAL_DONE_KEY);
  });

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Arena colors
  const bgGradient = arena.bgGradient || "#0a0a1a";
  const floorColor = arena.floorColor || "#1a1a2e";
  const ambientColor = arena.ambientColor || "#00ffff";

  // Callbacks
  const callbacks = useMemo<FightCallbacks2D>(() => ({
    onPhaseChange: (p) => {
      setPhase(p);
      if (p === "intro") {
        setShowIntroSplash(true);
        setTimeout(() => setShowIntroSplash(false), 2500);
      }
    },
    onHealthChange: (p1Hp, p1Max, _p2Hp, _p2Max) => {
      if (p1Hp < p1Max) setP1Perfect(false);
    },
    onMatchEnd: (winner) => {
      const w = winner === 1 ? "p1" : "p2";
      const perfect = winner === 1 ? p1Perfect : false;
      // Delay to show victory animation
      setTimeout(() => onMatchEnd(w, perfect), 1500);
    },
  }), [onMatchEnd, p1Perfect]);

  // Initialize engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new FightEngine2D(
      canvas,
      player,
      opponent,
      arena.id,
      bgGradient,
      floorColor,
      ambientColor,
      mapDifficulty(difficulty),
      callbacks,
      trainingMode,
    );

    engineRef.current = engine;
    engine.start();

    // Load arena background image if available
    if (arena.backgroundImage) {
      engine.loadBackgroundImage(arena.backgroundImage);
    }

    // Enable hitbox display by default in training mode
    if (trainingMode) {
      engine.setShowHitboxes(true);
      engine.setShowFrameData(true);
      engine.setTrainingInfiniteHealth(true);
      engine.setTrainingAutoRecover(true);
    }

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [player, opponent, arena, difficulty, callbacks, trainingMode]);

  // Resize canvas to fill container
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      // Keep 16:9 aspect ratio
      const targetW = 1280;
      const targetH = 720;
      const scale = Math.min(rect.width / targetW, rect.height / targetH);
      canvas.style.width = `${targetW * scale}px`;
      canvas.style.height = `${targetH * scale}px`;
      canvas.style.position = "absolute";
      canvas.style.left = `${(rect.width - targetW * scale) / 2}px`;
      canvas.style.top = `${(rect.height - targetH * scale) / 2}px`;
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Keyboard: Escape to go back
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onBack();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onBack]);

  // Tutorial completion
  const completeTutorial = useCallback(() => {
    setShowTutorial(false);
    localStorage.setItem(TUTORIAL_DONE_KEY, "1");
  }, []);

  /* ═══ TOUCH GESTURE HANDLING ═══ */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const engine = engineRef.current;
    if (!engine) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const relX = touch.clientX - rect.left;
      const side: "left" | "right" = relX < rect.width / 2 ? "left" : "right";

      const tracker: GestureTracker = {
        id: touch.identifier,
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now(),
        side,
        ended: false,
      };
      gesturesRef.current.set(touch.identifier, tracker);
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const engine = engineRef.current;
    if (!engine) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const tracker = gesturesRef.current.get(touch.identifier);
      if (!tracker || tracker.ended) continue;
      tracker.ended = true;
      gesturesRef.current.delete(touch.identifier);

      const dx = touch.clientX - tracker.startX;
      const dy = touch.clientY - tracker.startY;
      const elapsed = Date.now() - tracker.startTime;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      let input: TouchInput2D;

      if (absDx > SWIPE_THRESHOLD || absDy > SWIPE_THRESHOLD) {
        // Swipe
        if (absDx > absDy) {
          input = {
            type: dx > 0 ? "swipe_right" : "swipe_left",
            side: tracker.side,
            timestamp: Date.now(),
          };
        } else {
          input = {
            type: dy < 0 ? "swipe_up" : "swipe_down",
            side: tracker.side,
            timestamp: Date.now(),
          };
        }
      } else if (elapsed < TAP_TIME) {
        // Check double tap
        const now = Date.now();
        const last = lastTapRef.current;
        if (now - last.time < DOUBLE_TAP_TIME && last.side === tracker.side) {
          input = { type: "double_tap", side: tracker.side, timestamp: now };
          lastTapRef.current = { time: 0, side: "left" };
        } else {
          input = { type: "tap", side: tracker.side, timestamp: now };
          lastTapRef.current = { time: now, side: tracker.side };
        }
      } else {
        // Long press release
        input = { type: "hold_end", side: tracker.side, timestamp: Date.now() };
      }

      engine.handleTouchInput(input);
    }
  }, []);

  const handleTouchCancel = useCallback((e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      gesturesRef.current.delete(e.changedTouches[i].identifier);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative bg-black select-none overflow-hidden"
      style={{ touchAction: "none" }}
      onTouchStart={showTutorial ? undefined : handleTouchStart}
      onTouchMove={() => {}} // Track but don't act until touchEnd
      onTouchEnd={showTutorial ? undefined : handleTouchEnd}
      onTouchCancel={showTutorial ? undefined : handleTouchCancel}
    >
      {/* Canvas — the engine renders everything here */}
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className="image-rendering-pixelated"
      />

      {/* Gesture Tutorial */}
      <AnimatePresence>
        {showTutorial && isMobile && (
          <GestureTutorial onComplete={completeTutorial} onSkip={completeTutorial} />
        )}
      </AnimatePresence>

      {/* VS Intro Splash */}
      <AnimatePresence>
        {showIntroSplash && phase === "intro" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-40 flex items-center justify-center"
          >
            <div className="flex items-center gap-6">
              {/* P1 */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-center"
              >
                {player.image ? (
                  <img src={player.image} alt={player.name} className="w-24 h-24 object-contain rounded-lg" />
                ) : (
                  <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: player.color + "30" }}>
                    <span className="font-display text-2xl font-bold" style={{ color: player.color }}>{player.name[0]}</span>
                  </div>
                )}
                <p className="font-mono text-xs mt-2 tracking-wider" style={{ color: player.color }}>
                  {player.name.toUpperCase()}
                </p>
              </motion.div>

              {/* VS */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                <span className="font-display text-4xl font-black text-destructive tracking-widest">VS</span>
              </motion.div>

              {/* P2 */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-center"
              >
                {opponent.image ? (
                  <img src={opponent.image} alt={opponent.name} className="w-24 h-24 object-contain rounded-lg" />
                ) : (
                  <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: opponent.color + "30" }}>
                    <span className="font-display text-2xl font-bold" style={{ color: opponent.color }}>{opponent.name[0]}</span>
                  </div>
                )}
                <p className="font-mono text-xs mt-2 tracking-wider" style={{ color: opponent.color }}>
                  {opponent.name.toUpperCase()}
                </p>
              </motion.div>
            </div>

            {/* Arena name */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-12 font-mono text-xs text-muted-foreground tracking-[0.3em]"
            >
              {arena.name.toUpperCase()}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile touch zones indicator */}
      {isMobile && phase === "fighting" && !showTutorial && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute left-0 top-0 bottom-0 w-1/2 border-r border-primary/5">
            <span className="absolute bottom-2 left-2 font-mono text-[8px] text-primary/20 tracking-wider">DEFEND</span>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/2">
            <span className="absolute bottom-2 right-2 font-mono text-[8px] text-destructive/20 tracking-wider">ATTACK</span>
          </div>
        </div>
      )}

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-3 left-3 z-50 p-2 rounded-md bg-black/50 hover:bg-black/80 transition-colors"
      >
        <ArrowLeft size={16} className="text-white/60 hover:text-white" />
      </button>

      {/* Training mode overlay with hitbox viewer and frame data */}
      {trainingMode && (
        <TrainingModeOverlay
          getTrainingData={() => {
            const engine = engineRef.current;
            if (!engine) return {
              p1: { state: "idle" as const, stateFrame: 0, hp: 0, maxHp: 0, meter: 0, comboCount: 0, comboDamage: 0, facingRight: true, airborne: false, isCrouching: false, x: 0, y: 0, moveData: null },
              p2: { state: "idle" as const, stateFrame: 0, hp: 0, maxHp: 0, meter: 0, comboCount: 0, comboDamage: 0, facingRight: false, airborne: false, isCrouching: false, x: 0, y: 0, moveData: null },
              stats: { maxCombo: 0, totalDamage: 0, hitsLanded: 0 },
              frameCount: 0, distance: 0, showHitboxes: true, showFrameData: true,
            };
            return engine.getTrainingData();
          }}
          getMoveList={(p) => {
            const engine = engineRef.current;
            if (!engine) return [];
            return engine.getAllMoveData(p);
          }}
          onToggleHitboxes={(show) => engineRef.current?.setShowHitboxes(show)}
          onToggleFrameData={(show) => engineRef.current?.setShowFrameData(show)}
          onResetDummy={() => engineRef.current?.resetTrainingDummy()}
          onResetPositions={() => engineRef.current?.resetP1Position()}
          onSetInfiniteHealth={(on) => engineRef.current?.setTrainingInfiniteHealth(on)}
          onSetInfiniteMeter={(on) => engineRef.current?.setTrainingInfiniteMeter(on)}
          onSetAutoRecover={(on) => engineRef.current?.setTrainingAutoRecover(on)}
          p1Name={player.name}
          p2Name={opponent.name}
        />
      )}
    </div>
  );
}
