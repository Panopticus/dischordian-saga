/**
 * FightArena2D — React wrapper for the Canvas-based 2D fighting engine.
 * 
 * Drop-in replacement for FightArena3D. Same props interface, same callbacks,
 * but renders on HTML5 Canvas with proper AABB hitbox collision, multi-frame
 * animation, and a camera system.
 */
import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Swords, Shield, Zap, ChevronUp, Hand, Timer } from "lucide-react";
import { ScreenReaderOnly, LiveRegion } from "@/components/a11y";
import type { FighterData, ArenaData, DifficultyLevel } from "./gameData";
import { fightHudUrl, fightVfxUrl } from "@shared/aaaArtArchive";
import { FightEngine2D, type FightCallbacks2D, type FightPhase2D, type TouchInput2D, type Difficulty2D, type TrainingData, type MoveListEntry } from "./FightEngine2D";
import { hapticMediumHit, hapticHeavyHit, hapticBlock, hapticSP1, hapticSP2, hapticSP3 } from "./haptics";
import { useHaptics } from "@/hooks/useHaptics";
import { screenShake, hitFlash, comboFlash, koSlowmo } from "@/lib/combatJuice";
import TrainingModeOverlay from "./TrainingModeOverlay";
import FighterIntroOverlay from "./FighterIntroOverlay";
import { useSagaThemeBGM } from "@/contexts/SagaThemeBGMContext";
import { getAtmosphereForRoom, applyThemeToDOM } from "@/engine/voidEngine";
import {
  dispatchCombatHit, dispatchCombatCritical, dispatchCombatDeath,
  dispatchLimitBreak, dispatchNarrativeEffect,
} from "@/hooks/useNarrativeEvents";

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
  holdTimer: ReturnType<typeof setTimeout> | null;
}

const SWIPE_THRESHOLD = 30;
const TAP_TIME = 250;
const DOUBLE_TAP_TIME = 300;
const HOLD_THRESHOLD = 300; // ms before hold_start fires

/* ═══ TUTORIAL ═══ */
const TUTORIAL_DONE_KEY = "loredex_fight2d_tutorial_done";

function GestureTutorial({ onComplete, onSkip }: { onComplete: () => void; onSkip: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: <Hand size={32} />, title: "TAP RIGHT", desc: "Light punch" },
    { icon: <Swords size={32} />, title: "SWIPE RIGHT →", desc: "Medium punch" },
    { icon: <Zap size={32} />, title: "HOLD RIGHT", desc: "Heavy charge → release" },
    { icon: <Hand size={32} />, title: "DOUBLE TAP RIGHT", desc: "Light kick" },
    { icon: <Swords size={32} />, title: "SWIPE DOWN ↓ RIGHT", desc: "Medium kick" },
    { icon: <Zap size={32} />, title: "SWIPE LEFT ← RIGHT", desc: "Heavy kick" },
    { icon: <Shield size={32} />, title: "TAP LEFT", desc: "Block" },
    { icon: <ChevronUp size={32} />, title: "SWIPE UP", desc: "Jump" },
    { icon: <Timer size={32} />, title: "TRIPLE TAP RIGHT", desc: "Taunt (meter boost)" },
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
function FightArena2D({
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
  const { trigger: hapticTrigger } = useHaptics();
  const lastTapRef = useRef<{ time: number; side: "left" | "right"; count: number }>({ time: 0, side: "left", count: 0 });

  const [phase, setPhase] = useState<FightPhase2D>("intro");
  const [showIntroSplash, setShowIntroSplash] = useState(true);
  const [p1Perfect, setP1Perfect] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showTutorial, setShowTutorial] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem(TUTORIAL_DONE_KEY);
  });
  const [announceMessage, setAnnounceMessage] = useState("");
  /** May 2026 archive HUD chrome — what banner (if any) should be
   *  overlayed right now. Set on round-end / match-end and cleared
   *  after a timeout so the next one can fire. */
  const [hudBanner, setHudBanner] = useState<
    | "round_card_round_1"
    | "round_card_round_2"
    | "round_card_final"
    | "ko_splash"
    | "perfect_banner"
    | "victory_banner"
    | "flawless_victory_banner"
    | null
  >(null);
  /** Screen-space VFX flash from the May 2026 archive (super_screenflash
   *  on a level-3 super, ko_blackout on match end). Fades over ~600ms. */
  const [vfxFlash, setVfxFlash] = useState<"super_screenflash" | "ko_blackout" | null>(null);
  /** Combo pop tier — bronze (3-5) → silver (6-8) → gold (9-11) →
   *  platinum (12+). Set on every onCombo callback; cleared after
   *  ~700ms so the next pop can fire fresh. Includes a key so React
   *  re-mounts the motion.img and replays the bump animation. */
  const [comboPop, setComboPop] = useState<
    | { tier: "bronze" | "silver" | "gold" | "platinum"; key: number }
    | null
  >(null);
  const comboPopKeyRef = useRef(0);
  /** Brief DOM overlay for a hit-spark PNG. Triggered on heavy / launcher
   *  hits dealt by the player; faded over ~250ms. */
  const [hitSpark, setHitSpark] = useState<
    | { intensity: "light" | "medium" | "heavy"; key: number }
    | null
  >(null);
  const hitSparkKeyRef = useRef(0);

  // Suppress BGM when fight starts, restore when leaving
  const bgm = useSagaThemeBGM();
  useEffect(() => {
    bgm.suppress();
    return () => {
      bgm.unsuppress();
    };
  }, []);

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

  // Callbacks — use refs so the engine never gets re-created mid-fight
  const onMatchEndRef = useRef(onMatchEnd);
  const p1PerfectRef = useRef(p1Perfect);
  useEffect(() => { onMatchEndRef.current = onMatchEnd; }, [onMatchEnd]);
  useEffect(() => { p1PerfectRef.current = p1Perfect; }, [p1Perfect]);

  // Stable callbacks object — created once, reads latest values from refs
  const callbacks = useMemo<FightCallbacks2D>(() => ({
    onPhaseChange: (p) => {
      setPhase(p);
      if (p === "intro") {
        setShowIntroSplash(true);
      }
      // Show "ROUND 1" card when fighting first begins; clear it
      // after 900ms so the action isn't obscured. Subsequent rounds
      // are driven by onRoundEnd below.
      if (p === "fighting" && !hudBanner) {
        setHudBanner("round_card_round_1");
        window.setTimeout(() => setHudBanner(null), 900);
      }
    },
    onRoundEnd: (_winner, p1Wins, p2Wins) => {
      // Best-of-three semantics — match the engine's round counter.
      const totalRounds = p1Wins + p2Wins;
      if (totalRounds >= 2) {
        setHudBanner("round_card_final");
      } else {
        setHudBanner("round_card_round_2");
      }
      window.setTimeout(() => setHudBanner(null), 900);
    },
    onHealthChange: (p1Hp, p1Max, _p2Hp, _p2Max) => {
      if (p1Hp < p1Max) setP1Perfect(false);
    },
    onHit: (attacker, type) => {
      if (attacker === 1) {
        // Haptic feedback fires on player 1 hits (mobile).
        if (type === "blocked" || type === "parried") hapticBlock();
        else if (type === "heavy" || type === "launcher") hapticHeavyHit();
        else hapticMediumHit();

        // May 2026 archive hit-spark overlay. Blocked / parried hits
        // don't spark — the player needs distinct visual feedback for
        // a successful defense. The intensity ladder mirrors the
        // engine's hit_type taxonomy.
        if (type !== "blocked" && type !== "parried") {
          const intensity: "light" | "medium" | "heavy" =
            type === "heavy" || type === "launcher" ? "heavy"
            : type === "light" ? "light"
            : "medium";
          hitSparkKeyRef.current += 1;
          setHitSpark({ intensity, key: hitSparkKeyRef.current });
          window.setTimeout(() => setHitSpark(null), 260);
        }

        // useHaptics pattern-based feedback (augments existing haptics)
        if (type === "heavy" || type === "launcher") {
          hapticTrigger("heavyHit");
          screenShake("heavy");
          hitFlash();
        } else if (type === "blocked" || type === "parried") {
          hapticTrigger("lightHit");
          screenShake("light");
        } else {
          hapticTrigger("lightHit");
          screenShake("medium");
          hitFlash();
        }
      } else {
        // Narrative effects — player 2 hitting us triggers screen effects.
        if (type === "heavy" || type === "launcher") dispatchCombatCritical();
        else dispatchCombatHit();
      }
    },
    onSpecialActivate: (player, level) => {
      if (player !== 1) return;
      if (level === 3) hapticSP3();
      else if (level === 2) hapticSP2();
      else hapticSP1();

      // May 2026 archive — super screen-flash overlay on the level-3
      // super. Faded out by the AnimatePresence below.
      if (level === 3) {
        setVfxFlash("super_screenflash");
        window.setTimeout(() => setVfxFlash(null), 550);
      }

      // Narrative: limit break / special activation
      if (level >= 2) dispatchLimitBreak();
      else dispatchNarrativeEffect("jolt");
    },
    onCombo: (_player, count, _damage) => {
      // Combat juice: combo flash feedback based on combo count
      comboFlash(count);
      // May 2026 archive — combo pop banner. Tier ladders to the
      // four canonical tiers; <3 hits is below the pop threshold.
      if (count >= 3) {
        const tier: "bronze" | "silver" | "gold" | "platinum" =
          count >= 12 ? "platinum"
          : count >= 9 ? "gold"
          : count >= 6 ? "silver"
          : "bronze";
        comboPopKeyRef.current += 1;
        setComboPop({ tier, key: comboPopKeyRef.current });
        window.setTimeout(() => setComboPop(null), 700);
      }
    },
    onFinishHim: () => {
      // Narrative: finishing blow moment
      dispatchNarrativeEffect("surge");
    },
    onMatchEnd: (winner) => {
      const w = winner === 1 ? "p1" : "p2";
      const perfect = winner === 1 ? p1PerfectRef.current : false;
      setAnnounceMessage(w === "p1" ? (perfect ? "You win! Perfect victory!" : "You win!") : "You lose!");

      // May 2026 archive HUD chrome — KO splash, then victory/perfect/
      // flawless banner depending on outcome. Sequenced so each banner
      // gets ~700ms of screen time before the route transition fires.
      // Also flash the KO blackout VFX behind the banner.
      setVfxFlash("ko_blackout");
      window.setTimeout(() => setVfxFlash(null), 800);
      setHudBanner("ko_splash");
      window.setTimeout(() => {
        if (w !== "p1") {
          setHudBanner(null);
          return;
        }
        setHudBanner(
          perfect ? "flawless_victory_banner" : "victory_banner",
        );
      }, 700);

      // Combat juice: KO slowmo + heavy screen shake
      hapticTrigger("ko");
      koSlowmo();
      screenShake("ko");
      hitFlash("#ff4444");

      // Narrative: death/victory effects
      if (w === "p2") dispatchCombatDeath();
      else if (perfect) dispatchNarrativeEffect("surge");

      // Delay to show victory animation
      setTimeout(() => onMatchEndRef.current(w, perfect), 1500);
    },
  }), []); // empty deps — stable forever

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

    // Load arena background image if available. When the May 2026
    // producer-drop parallax triplet is present, push all three planes
    // so FightEngine2D can render bg/mg/fg with depth-correct parallax;
    // otherwise fall back to the legacy single-plate backdrop.
    if (arena.parallax) {
      engine.loadParallaxLayers(
        arena.parallax.bg,
        arena.parallax.mg,
        arena.parallax.fg,
      );
    } else if (arena.backgroundImage) {
      engine.loadBackgroundImage(arena.backgroundImage);
    }

    // Push arena-specific Void Energy atmosphere
    const arenaRoomKey = `arena_${arena.id.replace(/-/g, "_")}`;
    const arenaAtmosphere = getAtmosphereForRoom(arenaRoomKey);
    const prevAtmosphere = document.documentElement.dataset.atmosphere;
    if (arenaAtmosphere) {
      applyThemeToDOM(arenaAtmosphere);
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
      // Restore previous atmosphere when leaving fight
      if (prevAtmosphere) {
        applyThemeToDOM(prevAtmosphere);
      }
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

  // Stage music — when the arena ships a musicUrl from the May 2026
  // producer drop, play it on a dedicated <audio> element (not routed
  // through GameAudioContext so a transient fight doesn't displace the
  // global area BGM). Cleans up on unmount or arena change.
  useEffect(() => {
    if (!arena.musicUrl) return;
    const el = new Audio(arena.musicUrl);
    el.loop = true;
    el.volume = 0.45;
    void el.play().catch(() => {
      // autoplay blocked is expected before user gesture; the engine's
      // input handler will retry on first input via the ResizeObserver
      // re-render, so leave the element ready and silent.
    });
    return () => {
      el.pause();
      el.src = "";
    };
  }, [arena.musicUrl]);

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
      const touchId = touch.identifier;

      // Schedule hold_start after threshold — fires block/heavy charge if finger stays down
      const holdTimer = setTimeout(() => {
        const tracked = gesturesRef.current.get(touchId);
        if (tracked && !tracked.ended) {
          engine.handleTouchInput({ type: "hold_start", side, timestamp: Date.now() });
        }
      }, HOLD_THRESHOLD);

      const tracker: GestureTracker = {
        id: touchId,
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now(),
        side,
        ended: false,
        holdTimer,
      };
      gesturesRef.current.set(touchId, tracker);
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
      if (tracker.holdTimer) clearTimeout(tracker.holdTimer);
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
        // Check multi-tap (double/triple)
        const now = Date.now();
        const last = lastTapRef.current;
        if (now - last.time < DOUBLE_TAP_TIME && last.side === tracker.side) {
          const tapCount = last.count + 1;
          if (tapCount >= 3) {
            input = { type: "triple_tap", side: tracker.side, timestamp: now };
            lastTapRef.current = { time: 0, side: "left", count: 0 };
          } else {
            input = { type: "double_tap", side: tracker.side, timestamp: now };
            lastTapRef.current = { time: now, side: tracker.side, count: tapCount };
          }
        } else {
          input = { type: "tap", side: tracker.side, timestamp: now };
          lastTapRef.current = { time: now, side: tracker.side, count: 1 };
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
      const tracker = gesturesRef.current.get(e.changedTouches[i].identifier);
      if (tracker?.holdTimer) clearTimeout(tracker.holdTimer);
      gesturesRef.current.delete(e.changedTouches[i].identifier);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      role="application"
      aria-label="Fighting game"
      className="w-full h-full relative bg-black select-none overflow-hidden safe-area-top safe-area-x"
      style={{ touchAction: "none" }}
      onTouchStart={showTutorial ? undefined : handleTouchStart}
      onTouchMove={() => {}} // Track but don't act until touchEnd
      onTouchEnd={showTutorial ? undefined : handleTouchEnd}
      onTouchCancel={showTutorial ? undefined : handleTouchCancel}
    >
      <ScreenReaderOnly>2D fighting game arena. Use keyboard controls to fight.</ScreenReaderOnly>
      <LiveRegion message={announceMessage} assertive />

      {/* Canvas — the engine renders everything here */}
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className="image-rendering-pixelated"
      />

      {/* Screen-space VFX flash — super_screenflash / ko_blackout from
          the May 2026 archive. Drawn behind the HUD banner overlay so
          the round card / KO splash reads on top. */}
      <AnimatePresence>
        {vfxFlash && (
          <motion.img
            key={vfxFlash}
            src={fightVfxUrl(vfxFlash)}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 z-20 w-full h-full object-cover pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: vfxFlash === "ko_blackout" ? 0.85 : 0.75 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />
        )}
      </AnimatePresence>

      {/* Hit-spark overlay — brief PNG flash at the canvas center on
          successful hits. Light/medium/heavy intensities map to the
          three hit_spark_* assets. */}
      <AnimatePresence>
        {hitSpark && (
          <motion.img
            key={`spark-${hitSpark.key}`}
            src={fightVfxUrl(`hit_spark_${hitSpark.intensity}` as
              "hit_spark_light" | "hit_spark_medium" | "hit_spark_heavy")}
            alt=""
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 z-20 pointer-events-none"
            style={{
              width: hitSpark.intensity === "heavy" ? 320 : hitSpark.intensity === "medium" ? 220 : 160,
              transform: "translate(-50%, -50%)",
              mixBlendMode: "screen",
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1.05 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.16 }}
          />
        )}
      </AnimatePresence>

      {/* Combo pop banner — bronze/silver/gold/platinum tiered overlay
          on the player's combo count. Sits above the hit-spark layer
          so a long combo's pop reads clearly. */}
      <AnimatePresence>
        {comboPop && (
          <motion.img
            key={`combo-${comboPop.key}`}
            src={fightHudUrl(`combo_pop_${comboPop.tier}` as
              "combo_pop_bronze" | "combo_pop_silver" | "combo_pop_gold" | "combo_pop_platinum")}
            alt={`${comboPop.tier} combo`}
            className="absolute z-25 pointer-events-none"
            style={{
              right: "8%",
              top: "30%",
              width: "22%",
              maxWidth: 320,
            }}
            initial={{ opacity: 0, x: 40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* HUD banner overlays — round cards, KO splash, victory banners.
          May 2026 archive chrome. Rendered above the canvas, below the
          gesture tutorial so the player can still see the cards. */}
      <AnimatePresence>
        {hudBanner && (
          <motion.img
            key={hudBanner}
            src={fightHudUrl(hudBanner)}
            alt={hudBanner.replace(/_/g, " ")}
            className="absolute left-1/2 top-1/2 z-30 pointer-events-none"
            style={{ width: "62%", maxWidth: 900, transform: "translate(-50%, -50%)" }}
            initial={{ opacity: 0, scale: 1.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Gesture Tutorial */}
      <AnimatePresence>
        {showTutorial && isMobile && (
          <GestureTutorial onComplete={completeTutorial} onSkip={completeTutorial} />
        )}
      </AnimatePresence>

      {/* Cinematic Fighter Intro Overlay */}
      <AnimatePresence>
        {showIntroSplash && phase === "intro" && (
          <FighterIntroOverlay
            player={player}
            opponent={opponent}
            arenaName={arena.name}
            arenaColor={ambientColor}
            onComplete={() => setShowIntroSplash(false)}
          />
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

export default React.memo(FightArena2D);
