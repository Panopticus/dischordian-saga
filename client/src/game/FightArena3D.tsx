/* ═══════════════════════════════════════════════════════
   FIGHT ARENA 3D — MCOC-Style Mobile Controls
   Split-screen: LEFT = Defense, RIGHT = Offense
   Tap/Swipe gesture recognition for mobile-first fighting
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef, useState, useCallback } from "react";
import { FightEngine3D, type FightPhase, type Difficulty, type TouchInput } from "./FightEngine3D";
import { FightSoundManager } from "./FightSoundManager";
import type { FighterData, ArenaData, DifficultyLevel } from "./gameData";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

interface FightArena3DProps {
  player: FighterData;
  opponent: FighterData;
  arena: ArenaData;
  difficulty: DifficultyLevel;
  onMatchEnd: (winner: "p1" | "p2", perfect: boolean) => void;
  onBack: () => void;
  trainingMode?: boolean;
}

function mapDifficulty(d: DifficultyLevel): Difficulty {
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

const SWIPE_THRESHOLD = 30;  // px minimum for swipe
const TAP_MAX_TIME = 250;    // ms max for tap
const HOLD_MIN_TIME = 300;   // ms min for hold

export default function FightArena3D({ player, opponent, arena, difficulty, onMatchEnd, onBack, trainingMode = false }: FightArena3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<FightEngine3D | null>(null);
  const rafRef = useRef<number>(0);
  const [isMobile, setIsMobile] = useState(false);

  const [phase, setPhase] = useState<FightPhase>("intro");
  const [hudState, setHudState] = useState({
    round: 1,
    timer: 99,
    p1: { name: player.name, hp: player.hp, maxHp: player.hp, displayHp: player.hp, specialMeter: 0, roundWins: 0, state: "idle" as string, comboCount: 0, comboDamage: 0, comboChain: 0, stunTimer: 0, isParrying: false, dexActive: false, heavyCharging: false, heavyChargeRatio: 0, color: player.color, image: player.image },
    p2: { name: opponent.name, hp: opponent.hp, maxHp: opponent.hp, displayHp: opponent.hp, specialMeter: 0, roundWins: 0, state: "idle" as string, comboCount: 0, comboDamage: 0, comboChain: 0, stunTimer: 0, isParrying: false, dexActive: false, heavyCharging: false, heavyChargeRatio: 0, color: opponent.color, image: opponent.image },
  });
  const [announceText, setAnnounceText] = useState("");
  const [announceColor, setAnnounceColor] = useState("#ffffff");
  const [showAnnounce, setShowAnnounce] = useState(false);
  const [comboDisplay, setComboDisplay] = useState<{ player: 1 | 2; count: number; damage: number } | null>(null);
  const [matchEnded, setMatchEnded] = useState(false);
  const soundRef = useRef<FightSoundManager | null>(null);
  const [soundMuted, setSoundMuted] = useState(false);
  const [showMoveList, setShowMoveList] = useState(trainingMode);
  const [trainingComboMax, setTrainingComboMax] = useState(0);
  const [trainingDamageTotal, setTrainingDamageTotal] = useState(0);
  const [trainingHitsLanded, setTrainingHitsLanded] = useState(0);
  const [eventFlash, setEventFlash] = useState<{ text: string; color: string } | null>(null);

  // Gesture tracking
  const gesturesRef = useRef<Map<number, GestureTracker>>(new Map());
  const holdTimerRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const announce = useCallback((text: string, color: string, duration = 2000) => {
    setAnnounceText(text);
    setAnnounceColor(color);
    setShowAnnounce(true);
    setTimeout(() => setShowAnnounce(false), duration);
  }, []);

  const flashEvent = useCallback((text: string, color: string) => {
    setEventFlash({ text, color });
    setTimeout(() => setEventFlash(null), 800);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sound = new FightSoundManager(arena.id);
    sound.init();
    soundRef.current = sound;

    const engine = new FightEngine3D(
      container,
      player,
      opponent,
      mapDifficulty(difficulty),
      {
        onPhaseChange: (p) => {
          setPhase(p);
          switch (p) {
            case "intro":
              announce("GET READY", "#ffffff", 1500);
              sound.announce("Get Ready");
              sound.startArenaMusic();
              break;
            case "round_announce": {
              const state = engine.getState();
              announce(`ROUND ${state.round}`, "#22d3ee", 1200);
              sound.playRoundFanfare();
              sound.announce(`Round ${state.round}`);
              setTimeout(() => {
                announce("FIGHT!", "#ef4444", 800);
                sound.announce("Fight!");
              }, 1300);
              break;
            }
            case "ko":
              announce("K.O.!", "#ef4444", 2000);
              sound.play("ko");
              sound.announce("K O!");
              break;
            case "match_end": {
              const finalState = engine.getState();
              const winner = finalState.p1.hp > 0 ? 1 : 2;
              const winnerName = winner === 1 ? finalState.p1.name : finalState.p2.name;
              announce(`${winnerName.toUpperCase()} WINS!`, winner === 1 ? finalState.p1.color : finalState.p2.color, 3000);
              sound.playVictoryFanfare();
              sound.announce(`${winnerName} wins!`);
              sound.stopArenaMusic();
              break;
            }
          }
        },
        onCombo: (p, count, damage) => {
          if (count >= 2) {
            setComboDisplay({ player: p, count, damage: Math.round(damage) });
            setTimeout(() => setComboDisplay(null), 1500);
            sound.play("combo_hit");
            if (count >= 3) sound.announce(`${count} hit combo!`);
          }
          if (trainingMode && p === 1) {
            setTrainingComboMax(prev => Math.max(prev, count));
            setTrainingDamageTotal(prev => prev + Math.round(damage));
          }
        },
        onHit: (_attacker, type) => {
          if (trainingMode && _attacker === 1) {
            setTrainingHitsLanded(prev => prev + 1);
          }
          if (type.includes("light")) sound.play("punch_light");
          else if (type.includes("heavy") || type.includes("medium")) sound.play("punch_heavy");
          else if (type.includes("block")) sound.play("block");
          else if (type.includes("special")) sound.play("special");
          else if (type.includes("parried")) sound.play("block");
          else sound.play("punch_light");
        },
        onParry: (p) => {
          flashEvent("PARRY!", "#ffdd00");
          sound.play("block");
        },
        onDex: (p) => {
          flashEvent("EVADE!", "#22d3ee");
        },
        onIntercept: (p) => {
          flashEvent("INTERCEPT!", "#ff6600");
        },
        onGuardBreak: (p) => {
          flashEvent("GUARD BREAK!", "#ef4444");
          sound.play("punch_heavy");
        },
        onSpecialReady: (p, level) => {
          if (p === 1) {
            flashEvent(`SP${level} READY!`, "#fbbf24");
          }
        },
        onMatchEnd: (winner) => {
          setMatchEnded(true);
          const finalState = engine.getState();
          const perfect = winner === 1 ? finalState.p1.hp >= finalState.p1.maxHp : finalState.p2.hp >= finalState.p2.maxHp;
          if (perfect) sound.announce("Perfect!");
          setTimeout(() => onMatchEnd(winner === 1 ? "p1" : "p2", perfect), 3000);
        },
      },
      {
        backgroundImage: arena.backgroundImage,
        ambientColor: arena.ambientColor,
        floorColor: arena.floorColor,
      },
      trainingMode
    );

    engineRef.current = engine;

    const loop = () => {
      engine.update();
      const state = engine.getState();
      setHudState(state);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onBack();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      cancelAnimationFrame(rafRef.current);
      engine.dispose();
      sound.dispose();
      soundRef.current = null;
      window.removeEventListener("keydown", handleKey);
    };
  }, [player, opponent, difficulty, onMatchEnd, onBack, announce, flashEvent]);

  /* ═══ MCOC-STYLE GESTURE HANDLERS ═══ */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const screenMid = window.innerWidth / 2;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const side: "left" | "right" = touch.clientX < screenMid ? "left" : "right";

      const tracker: GestureTracker = {
        id: touch.identifier,
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now(),
        side,
        ended: false,
      };
      gesturesRef.current.set(touch.identifier, tracker);

      // Start hold timer for right side (heavy charge)
      if (side === "right") {
        const timer = setTimeout(() => {
          const t = gesturesRef.current.get(touch.identifier);
          if (t && !t.ended) {
            // Hold detected — start heavy charge
            engineRef.current?.setHeavyHold(true);
          }
        }, HOLD_MIN_TIME);
        holdTimerRef.current.set(touch.identifier, timer);
      }

      // Left side hold = block
      if (side === "left") {
        engineRef.current?.setBlockHold(true);
      }
    }
  }, []);

  const handleTouchMove = useCallback((_e: React.TouchEvent) => {
    // We track movement but don't act until touchEnd for swipes
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const tracker = gesturesRef.current.get(touch.identifier);
      if (!tracker || tracker.ended) continue;
      tracker.ended = true;

      // Clear hold timer
      const holdTimer = holdTimerRef.current.get(touch.identifier);
      if (holdTimer) {
        clearTimeout(holdTimer);
        holdTimerRef.current.delete(touch.identifier);
      }

      const dx = touch.clientX - tracker.startX;
      const dy = touch.clientY - tracker.startY;
      const elapsed = Date.now() - tracker.startTime;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (tracker.side === "left") {
        // LEFT SIDE — Defense
        engineRef.current?.setBlockHold(false);

        if (absDx > SWIPE_THRESHOLD || absDy > SWIPE_THRESHOLD) {
          // Swipe detected
          if (absDx > absDy) {
            if (dx < 0) {
              // Swipe left = Dash back
              engineRef.current?.pushTouchInput({ type: "swipe_left", side: "left", timestamp: Date.now() });
            } else {
              // Swipe right = Dash forward
              engineRef.current?.pushTouchInput({ type: "swipe_right", side: "left", timestamp: Date.now() });
            }
          } else {
            if (dy < 0) {
              // Swipe up = Jump
              engineRef.current?.pushTouchInput({ type: "swipe_up", side: "left", timestamp: Date.now() });
            }
          }
        }
        // If no swipe and short hold, it was a block (already handled by hold)
      } else {
        // RIGHT SIDE — Offense
        // Release heavy if charging
        engineRef.current?.setHeavyHold(false);

        if (elapsed >= HOLD_MIN_TIME) {
          // Was a hold — heavy attack already triggered by setHeavyHold(false)
        } else if (absDx > SWIPE_THRESHOLD || absDy > SWIPE_THRESHOLD) {
          // Swipe detected
          if (absDx > absDy) {
            if (dx > 0) {
              // Swipe right = Medium attack
              engineRef.current?.pushTouchInput({ type: "swipe_right", side: "right", timestamp: Date.now() });
            } else {
              // Swipe left on right side = also dash back (convenience)
              engineRef.current?.pushTouchInput({ type: "swipe_left", side: "left", timestamp: Date.now() });
            }
          } else {
            if (dy < 0) {
              // Swipe up = Special attack
              engineRef.current?.pushTouchInput({ type: "swipe_up", side: "right", timestamp: Date.now() });
            } else {
              // Swipe down = Heavy attack (quick)
              engineRef.current?.pushTouchInput({ type: "swipe_down", side: "right", timestamp: Date.now() });
            }
          }
        } else {
          // Tap = Light attack
          engineRef.current?.pushTouchInput({ type: "tap", side: "right", timestamp: Date.now() });
        }
      }

      gesturesRef.current.delete(touch.identifier);
    }
  }, []);

  const handleTouchCancel = useCallback((e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const holdTimer = holdTimerRef.current.get(touch.identifier);
      if (holdTimer) clearTimeout(holdTimer);
      holdTimerRef.current.delete(touch.identifier);
      gesturesRef.current.delete(touch.identifier);
    }
    engineRef.current?.setBlockHold(false);
    engineRef.current?.setHeavyHold(false);
  }, []);

  /* ═══ HUD CALCULATIONS ═══ */
  const p1HpPct = hudState.p1.maxHp > 0 ? (hudState.p1.displayHp / hudState.p1.maxHp) * 100 : 0;
  const p2HpPct = hudState.p2.maxHp > 0 ? (hudState.p2.displayHp / hudState.p2.maxHp) * 100 : 0;
  const p1SpecLevel = hudState.p1.specialMeter >= 300 ? 3 : hudState.p1.specialMeter >= 200 ? 2 : hudState.p1.specialMeter >= 100 ? 1 : 0;
  const p2SpecLevel = hudState.p2.specialMeter >= 300 ? 3 : hudState.p2.specialMeter >= 200 ? 2 : hudState.p2.specialMeter >= 100 ? 1 : 0;
  const p1SpecPct = (hudState.p1.specialMeter % 100);
  const p2SpecPct = (hudState.p2.specialMeter % 100);

  return (
    <div
      className="w-full h-full relative bg-black select-none overflow-hidden"
      style={{ touchAction: "none" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      {/* Three.js container */}
      <div ref={containerRef} className="absolute inset-0" style={{ zIndex: 0 }} />

      {/* ═══ HUD OVERLAY ═══ */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>

        {/* ── TOP HUD — Health bars, timer, portraits ── */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "1.5vh 2vw" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1vw" }}>

            {/* P1 Portrait + Health */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.8vw", flex: 1 }}>
              <div style={{
                width: "4vw", height: "4vw", minWidth: 40, minHeight: 40,
                borderRadius: "0.5vw", overflow: "hidden",
                border: `0.3vw solid ${hudState.p1.color}`,
                flexShrink: 0,
              }}>
                <img src={hudState.p1.image} alt={hudState.p1.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ flex: 1, paddingTop: "0.3vh" }}>
                <div style={{ fontFamily: "monospace", fontSize: "max(1vw, 10px)", color: "rgba(255,255,255,0.7)", marginBottom: "0.3vh" }}>
                  {hudState.p1.name}
                </div>
                {/* Health bar */}
                <div style={{
                  height: "max(1.5vh, 12px)", borderRadius: 3, overflow: "hidden",
                  background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.3)",
                  position: "relative",
                }}>
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: 3,
                    width: `${p1HpPct}%`,
                    background: p1HpPct > 50 ? `linear-gradient(90deg, #22c55e, ${hudState.p1.color})` :
                                p1HpPct > 25 ? "linear-gradient(90deg, #eab308, #ef4444)" : "#ef4444",
                    transition: "width 0.3s",
                  }} />
                  <div style={{
                    position: "absolute", inset: 0, display: "flex", alignItems: "center", paddingLeft: "0.5vw",
                  }}>
                    <span style={{
                      fontFamily: "monospace", fontSize: "max(0.8vw, 9px)",
                      color: "rgba(255,255,255,0.95)", fontWeight: "bold",
                      textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                    }}>
                      {Math.ceil(hudState.p1.displayHp)}
                    </span>
                  </div>
                </div>
                {/* Special meter — 3 segments (MCOC style) */}
                <div style={{ display: "flex", gap: 2, marginTop: "0.4vh" }}>
                  {[0, 1, 2].map(seg => {
                    const segFill = hudState.p1.specialMeter >= (seg + 1) * 100 ? 100 :
                                    hudState.p1.specialMeter >= seg * 100 ? ((hudState.p1.specialMeter - seg * 100)) : 0;
                    const segColor = seg === 0 ? "#22c55e" : seg === 1 ? "#eab308" : "#ef4444";
                    return (
                      <div key={seg} style={{
                        flex: 1, height: "max(0.6vh, 4px)", borderRadius: 2,
                        background: "rgba(0,0,0,0.5)", border: `1px solid ${segFill > 0 ? segColor : "rgba(255,255,255,0.15)"}`,
                        overflow: "hidden", position: "relative",
                      }}>
                        <div style={{
                          width: `${segFill}%`, height: "100%", borderRadius: 2,
                          background: segColor, transition: "width 0.2s",
                          boxShadow: segFill >= 100 ? `0 0 6px ${segColor}` : "none",
                        }} />
                      </div>
                    );
                  })}
                </div>
                {/* Round wins */}
                <div style={{ display: "flex", gap: 3, marginTop: "0.3vh" }}>
                  {[0, 1].map(i => (
                    <div key={i} style={{
                      width: "max(0.6vw, 6px)", height: "max(0.6vw, 6px)",
                      borderRadius: "50%",
                      background: i < hudState.p1.roundWins ? hudState.p1.color : "rgba(255,255,255,0.15)",
                      border: `1px solid ${i < hudState.p1.roundWins ? hudState.p1.color : "rgba(255,255,255,0.3)"}`,
                      boxShadow: i < hudState.p1.roundWins ? `0 0 4px ${hudState.p1.color}` : "none",
                    }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Timer */}
            <div style={{
              textAlign: "center", minWidth: "5vw", paddingTop: "0.2vh",
            }}>
              <div style={{
                fontFamily: "monospace", fontSize: "max(2.5vw, 22px)", fontWeight: "bold",
                color: hudState.timer <= 10 ? "#ef4444" : "#ffffff",
                textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                lineHeight: 1,
              }}>
                {hudState.timer}
              </div>
              <div style={{
                fontFamily: "monospace", fontSize: "max(0.6vw, 7px)",
                color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em",
              }}>
                R{hudState.round}
              </div>
            </div>

            {/* P2 Portrait + Health (mirrored) */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.8vw", flex: 1, flexDirection: "row-reverse" }}>
              <div style={{
                width: "4vw", height: "4vw", minWidth: 40, minHeight: 40,
                borderRadius: "0.5vw", overflow: "hidden",
                border: `0.3vw solid ${hudState.p2.color}`,
                flexShrink: 0,
              }}>
                <img src={hudState.p2.image} alt={hudState.p2.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ flex: 1, paddingTop: "0.3vh" }}>
                <div style={{ fontFamily: "monospace", fontSize: "max(1vw, 10px)", color: "rgba(255,255,255,0.7)", marginBottom: "0.3vh", textAlign: "right" }}>
                  {hudState.p2.name}
                </div>
                {/* Health bar (reversed) */}
                <div style={{
                  height: "max(1.5vh, 12px)", borderRadius: 3, overflow: "hidden",
                  background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.3)",
                  position: "relative", direction: "rtl",
                }}>
                  <div style={{
                    position: "absolute", top: 0, right: 0, bottom: 0,
                    width: `${p2HpPct}%`, borderRadius: 3,
                    background: p2HpPct > 50 ? `linear-gradient(270deg, #22c55e, ${hudState.p2.color})` :
                                p2HpPct > 25 ? "linear-gradient(270deg, #eab308, #ef4444)" : "#ef4444",
                    transition: "width 0.3s",
                  }} />
                  <div style={{
                    position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: "0.5vw",
                  }}>
                    <span style={{
                      fontFamily: "monospace", fontSize: "max(0.8vw, 9px)",
                      color: "rgba(255,255,255,0.95)", fontWeight: "bold",
                      textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                    }}>
                      {Math.ceil(hudState.p2.displayHp)}
                    </span>
                  </div>
                </div>
                {/* P2 Special meter */}
                <div style={{ display: "flex", gap: 2, marginTop: "0.4vh", flexDirection: "row-reverse" }}>
                  {[0, 1, 2].map(seg => {
                    const segFill = hudState.p2.specialMeter >= (seg + 1) * 100 ? 100 :
                                    hudState.p2.specialMeter >= seg * 100 ? ((hudState.p2.specialMeter - seg * 100)) : 0;
                    const segColor = seg === 0 ? "#22c55e" : seg === 1 ? "#eab308" : "#ef4444";
                    return (
                      <div key={seg} style={{
                        flex: 1, height: "max(0.6vh, 4px)", borderRadius: 2,
                        background: "rgba(0,0,0,0.5)", border: `1px solid ${segFill > 0 ? segColor : "rgba(255,255,255,0.15)"}`,
                        overflow: "hidden", position: "relative",
                      }}>
                        <div style={{
                          width: `${segFill}%`, height: "100%", borderRadius: 2,
                          background: segColor, transition: "width 0.2s",
                          boxShadow: segFill >= 100 ? `0 0 6px ${segColor}` : "none",
                        }} />
                      </div>
                    );
                  })}
                </div>
                {/* Round wins */}
                <div style={{ display: "flex", gap: 3, marginTop: "0.3vh", justifyContent: "flex-end" }}>
                  {[0, 1].map(i => (
                    <div key={i} style={{
                      width: "max(0.6vw, 6px)", height: "max(0.6vw, 6px)",
                      borderRadius: "50%",
                      background: i < hudState.p2.roundWins ? hudState.p2.color : "rgba(255,255,255,0.15)",
                      border: `1px solid ${i < hudState.p2.roundWins ? hudState.p2.color : "rgba(255,255,255,0.3)"}`,
                      boxShadow: i < hudState.p2.roundWins ? `0 0 4px ${hudState.p2.color}` : "none",
                    }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ANNOUNCEMENTS ── */}
        <AnimatePresence>
          {showAnnounce && (
            <motion.div
              key={announceText}
              initial={{ opacity: 0, scale: 1.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              style={{
                position: "absolute", top: "35%", left: "50%", transform: "translate(-50%, -50%)",
                fontFamily: "'Orbitron', monospace", fontSize: "max(5vw, 36px)", fontWeight: "900",
                color: announceColor, letterSpacing: "0.15em",
                textShadow: `0 0 40px ${announceColor}80, 0 0 80px ${announceColor}40, 0 4px 0 #000`,
                whiteSpace: "nowrap",
              }}
            >
              {announceText}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── EVENT FLASH (Parry, Evade, Intercept, Guard Break) ── */}
        <AnimatePresence>
          {eventFlash && (
            <motion.div
              key={eventFlash.text}
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.5, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                fontFamily: "'Orbitron', monospace", fontSize: "max(2.5vw, 18px)", fontWeight: "bold",
                color: eventFlash.color, letterSpacing: "0.2em",
                textShadow: `0 0 20px ${eventFlash.color}80, 0 2px 0 #000`,
              }}
            >
              {eventFlash.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── COMBO DISPLAY ── */}
        <AnimatePresence>
          {comboDisplay && (
            <motion.div
              key={`combo-${comboDisplay.count}`}
              initial={{ opacity: 0, x: comboDisplay.player === 1 ? -30 : 30, scale: 0.7 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{
                position: "absolute",
                top: "25%",
                [comboDisplay.player === 1 ? "left" : "right"]: "3vw",
                textAlign: comboDisplay.player === 1 ? "left" : "right",
              }}
            >
              <div style={{
                fontFamily: "'Orbitron', monospace", fontSize: "max(3vw, 28px)", fontWeight: "900",
                color: comboDisplay.count >= 5 ? "#ef4444" : "#fbbf24",
                textShadow: `0 0 20px ${comboDisplay.count >= 5 ? "rgba(239,68,68,0.5)" : "rgba(251,191,36,0.5)"}, 0 2px 0 #000`,
              }}>
                {comboDisplay.count} HIT{comboDisplay.count >= 5 ? "!" : ""}
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "max(1.2vw, 12px)", color: "rgba(255,255,255,0.6)" }}>
                {comboDisplay.damage} DMG
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SPECIAL READY INDICATOR ── */}
        {p1SpecLevel > 0 && (
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6], scale: [0.97, 1.03, 0.97] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{
              position: "absolute", bottom: "15vh", left: "3vw",
              fontFamily: "monospace", fontSize: "max(1.2vw, 12px)",
              color: p1SpecLevel === 3 ? "#ef4444" : p1SpecLevel === 2 ? "#eab308" : "#22c55e",
              fontWeight: "bold", letterSpacing: "0.15em",
              textShadow: `0 0 10px ${p1SpecLevel === 3 ? "rgba(239,68,68,0.5)" : p1SpecLevel === 2 ? "rgba(234,179,8,0.5)" : "rgba(34,197,94,0.5)"}`,
            }}
          >
            SP{p1SpecLevel} READY! {"\u2191"}
          </motion.div>
        )}

        {/* ── HEAVY CHARGE INDICATOR ── */}
        {hudState.p1.heavyCharging && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3, repeat: Infinity }}
            style={{
              position: "absolute", bottom: "22vh", right: "3vw",
              fontFamily: "monospace", fontSize: "max(1vw, 11px)",
              color: "#ff6600", fontWeight: "bold",
              textShadow: "0 0 10px rgba(255,102,0,0.5)",
            }}
          >
            CHARGING... {Math.round(hudState.p1.heavyChargeRatio * 100)}%
          </motion.div>
        )}
      </div>

      {/* ═══ MOBILE TOUCH ZONES OVERLAY (visual guide) ═══ */}
      {isMobile && phase === "fighting" && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
          {/* Left zone indicator */}
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: "50%",
            borderRight: "1px solid rgba(255,255,255,0.05)",
          }}>
            <div style={{
              position: "absolute", bottom: "3vh", left: "50%", transform: "translateX(-50%)",
              fontFamily: "monospace", fontSize: "max(0.8vw, 9px)",
              color: "rgba(255,255,255,0.15)", textAlign: "center",
              lineHeight: 1.6,
            }}>
              <div>HOLD: BLOCK</div>
              <div>{"\u2190"} DASH BACK</div>
              <div>{"\u2192"} DASH FWD</div>
            </div>
          </div>
          {/* Right zone indicator */}
          <div style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: "50%",
          }}>
            <div style={{
              position: "absolute", bottom: "3vh", left: "50%", transform: "translateX(-50%)",
              fontFamily: "monospace", fontSize: "max(0.8vw, 9px)",
              color: "rgba(255,255,255,0.15)", textAlign: "center",
              lineHeight: 1.6,
            }}>
              <div>TAP: LIGHT</div>
              <div>{"\u2192"} MEDIUM</div>
              <div>HOLD: HEAVY</div>
              <div>{"\u2191"} SPECIAL</div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ DESKTOP CONTROLS LEGEND ═══ */}
      {!isMobile && (
        <div style={{
          position: "absolute", bottom: "1vh", left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: "2vw", fontFamily: "monospace",
          fontSize: "max(0.8vw, 10px)", color: "rgba(255,255,255,0.3)",
          background: "rgba(0,0,0,0.6)", padding: "0.5vh 1.5vw", borderRadius: "0.5vw",
          backdropFilter: "blur(4px)", zIndex: 20,
        }}>
          <span>WASD: Move</span>
          <span>J/Z: Light</span>
          <span>K/X: Medium</span>
          <span>L/C: Block</span>
          <span>Q: Dash Back</span>
          <span>E: Dash Fwd</span>
          <span>Space: Special</span>
          <span>ESC: Quit</span>
        </div>
      )}

      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          position: "absolute", top: "1vh", left: "1vw",
          padding: "0.5vh 1vw", borderRadius: "0.3vw",
          background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.25)",
          color: "rgba(255,255,255,0.5)", fontFamily: "monospace",
          fontSize: "max(0.8vw, 10px)", cursor: "pointer", zIndex: 20,
        }}
      >
        ESC
      </button>

      {/* Sound mute toggle */}
      <button
        onClick={() => {
          if (soundRef.current) {
            const muted = soundRef.current.toggleMute();
            setSoundMuted(muted);
          }
        }}
        style={{
          position: "absolute", top: "1vh", left: "5vw",
          padding: "0.5vh 0.8vw", borderRadius: "0.3vw",
          background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.25)",
          color: soundMuted ? "rgba(255,80,80,0.7)" : "rgba(255,255,255,0.5)",
          fontFamily: "monospace", fontSize: "max(0.8vw, 10px)",
          cursor: "pointer", zIndex: 20, display: "flex", alignItems: "center", gap: "0.3vw",
        }}
      >
        {soundMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        <span>{soundMuted ? "OFF" : "SFX"}</span>
      </button>

      {/* Training Mode Overlay */}
      {trainingMode && (
        <>
          <div style={{
            position: "absolute", top: "1vh", left: "50%", transform: "translateX(-50%)",
            padding: "0.3vh 2vw", borderRadius: "0.3vw",
            background: "rgba(34,211,238,0.15)", border: "1px solid rgba(34,211,238,0.5)",
            color: "#22d3ee", fontFamily: "monospace",
            fontSize: "max(1vw, 12px)", fontWeight: "bold",
            letterSpacing: "0.2em", zIndex: 25, textAlign: "center",
          }}>
            TRAINING MODE
          </div>
          {/* Training stats */}
          <div style={{
            position: "absolute", top: "5vh", right: "2vw",
            fontFamily: "monospace", fontSize: "max(0.8vw, 10px)",
            color: "rgba(255,255,255,0.5)", zIndex: 25,
            background: "rgba(0,0,0,0.5)", padding: "1vh 1vw", borderRadius: "0.3vw",
            border: "1px solid rgba(34,211,238,0.2)",
          }}>
            <div>Best Combo: <span style={{ color: "#fbbf24" }}>{trainingComboMax}</span></div>
            <div>Total DMG: <span style={{ color: "#ef4444" }}>{trainingDamageTotal}</span></div>
            <div>Hits: <span style={{ color: "#22c55e" }}>{trainingHitsLanded}</span></div>
          </div>
          {/* Move list toggle */}
          <button
            onClick={() => setShowMoveList(!showMoveList)}
            style={{
              position: "absolute", bottom: "2vh", right: "2vw",
              padding: "0.5vh 1vw", borderRadius: "0.3vw",
              background: "rgba(0,0,0,0.7)", border: "1px solid rgba(34,211,238,0.5)",
              color: "#22d3ee", fontFamily: "monospace",
              fontSize: "max(0.8vw, 10px)", cursor: "pointer", zIndex: 25,
            }}
          >
            {showMoveList ? "HIDE MOVES" : "SHOW MOVES"}
          </button>
          {showMoveList && (
            <div style={{
              position: "absolute", bottom: "6vh", right: "2vw",
              width: "max(22vw, 220px)", maxHeight: "50vh", overflow: "auto",
              background: "rgba(0,0,0,0.85)", border: "1px solid rgba(34,211,238,0.3)",
              borderRadius: "0.5vw", padding: "1.5vh 1.2vw", zIndex: 25,
              fontFamily: "monospace", fontSize: "max(0.8vw, 10px)", color: "rgba(255,255,255,0.8)",
            }}>
              <div style={{ color: "#22d3ee", fontWeight: "bold", marginBottom: "1vh", letterSpacing: "0.15em", borderBottom: "1px solid rgba(34,211,238,0.2)", paddingBottom: "0.5vh" }}>
                MCOC-STYLE CONTROLS
              </div>
              <div style={{ marginBottom: "0.8vh", color: "#fbbf24", fontWeight: "bold" }}>MOBILE (Touch)</div>
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1vh" }}>
                <tbody>
                  <tr><td style={{ padding: "0.2vh 0", color: "#22c55e" }}>Hold Left</td><td>Block</td></tr>
                  <tr><td style={{ padding: "0.2vh 0", color: "#22c55e" }}>{"\u2190"} Left</td><td>Dash Back / Evade</td></tr>
                  <tr><td style={{ padding: "0.2vh 0", color: "#22c55e" }}>{"\u2192"} Left</td><td>Dash Forward</td></tr>
                  <tr><td style={{ padding: "0.2vh 0", color: "#ef4444" }}>Tap Right</td><td>Light Attack</td></tr>
                  <tr><td style={{ padding: "0.2vh 0", color: "#ef4444" }}>{"\u2192"} Right</td><td>Medium Attack</td></tr>
                  <tr><td style={{ padding: "0.2vh 0", color: "#ef4444" }}>Hold Right</td><td>Heavy (charge)</td></tr>
                  <tr><td style={{ padding: "0.2vh 0", color: "#ef4444" }}>{"\u2191"} Right</td><td>Special Attack</td></tr>
                </tbody>
              </table>
              <div style={{ marginBottom: "0.8vh", color: "#fbbf24", fontWeight: "bold" }}>KEYBOARD</div>
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1vh" }}>
                <tbody>
                  <tr><td style={{ padding: "0.2vh 0", color: "#22c55e" }}>L / C</td><td>Block</td></tr>
                  <tr><td style={{ padding: "0.2vh 0", color: "#22c55e" }}>Q</td><td>Dash Back</td></tr>
                  <tr><td style={{ padding: "0.2vh 0", color: "#22c55e" }}>E</td><td>Dash Forward</td></tr>
                  <tr><td style={{ padding: "0.2vh 0", color: "#ef4444" }}>J / Z</td><td>Light Attack</td></tr>
                  <tr><td style={{ padding: "0.2vh 0", color: "#ef4444" }}>K / X</td><td>Medium Attack</td></tr>
                  <tr><td style={{ padding: "0.2vh 0", color: "#ef4444" }}>Space</td><td>Special</td></tr>
                </tbody>
              </table>
              <div style={{ marginBottom: "0.8vh", color: "#fbbf24", fontWeight: "bold" }}>TECHNIQUES</div>
              <div style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                <div><span style={{ color: "#ffdd00" }}>Parry:</span> Block just before hit</div>
                <div><span style={{ color: "#22d3ee" }}>Evade:</span> Dash back during attack</div>
                <div><span style={{ color: "#ff6600" }}>Intercept:</span> Hit during their dash</div>
                <div><span style={{ color: "#ef4444" }}>Guard Break:</span> Heavy vs block</div>
                <div><span style={{ color: "#fbbf24" }}>Combo:</span> M-L-L-L-M (5 hits)</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
