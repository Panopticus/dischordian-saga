/* ═══════════════════════════════════════════════════════
   FIGHT ARENA 3D — React wrapper for Three.js fight engine
   2.5D fighting with HTML overlay HUD (MK/SF style)
   Mobile-first with virtual D-pad and action buttons
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef, useState, useCallback } from "react";
import { FightEngine3D, type FightPhase, type Difficulty } from "./FightEngine3D";
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

export default function FightArena3D({ player, opponent, arena, difficulty, onMatchEnd, onBack, trainingMode = false }: FightArena3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<FightEngine3D | null>(null);
  const rafRef = useRef<number>(0);
  const [isMobile, setIsMobile] = useState(false);

  const [phase, setPhase] = useState<FightPhase>("intro");
  const [hudState, setHudState] = useState({
    round: 1,
    timer: 99,
    p1: { name: player.name, hp: player.hp, maxHp: player.hp, displayHp: player.hp, specialMeter: 0, roundWins: 0, state: "idle" as string, comboCount: 0, comboDamage: 0, color: player.color, image: player.image },
    p2: { name: opponent.name, hp: opponent.hp, maxHp: opponent.hp, displayHp: opponent.hp, specialMeter: 0, roundWins: 0, state: "idle" as string, comboCount: 0, comboDamage: 0, color: opponent.color, image: opponent.image },
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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initialize sound manager
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
          if (type.includes("punch_light") || type.includes("kick_light")) sound.play("punch_light");
          else if (type.includes("punch_heavy") || type.includes("kick_heavy")) sound.play("punch_heavy");
          else if (type.includes("block")) sound.play("block");
          else if (type.includes("special")) sound.play("special");
          else sound.play("punch_light");
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
  }, [player, opponent, difficulty, onMatchEnd, onBack, announce]);

  const setTouch = useCallback((key: string, value: boolean) => {
    if (engineRef.current) {
      engineRef.current.setTouchState({ [key]: value });
    }
  }, []);

  const p1HpPct = hudState.p1.maxHp > 0 ? (hudState.p1.displayHp / hudState.p1.maxHp) * 100 : 0;
  const p2HpPct = hudState.p2.maxHp > 0 ? (hudState.p2.displayHp / hudState.p2.maxHp) * 100 : 0;
  const p1SpecPct = hudState.p1.specialMeter;
  const p2SpecPct = hudState.p2.specialMeter;

  return (
    <div className="w-full h-full relative bg-black select-none overflow-hidden" style={{ touchAction: "none" }}>
      {/* Three.js container */}
      <div ref={containerRef} className="absolute inset-0" style={{ zIndex: 0 }} />

      {/* ═══ HUD OVERLAY — uses vw/vh units for consistent sizing ═══ */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
        
        {/* Top HUD — Health bars, timer, portraits */}
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
                    position: "absolute", inset: 0, display: "flex", alignItems: "center",
                    paddingLeft: "0.5vw",
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
                {/* Special meter */}
                <div style={{
                  height: "max(0.8vh, 6px)", marginTop: "0.3vh", borderRadius: 2,
                  overflow: "hidden", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)",
                }}>
                  <div style={{
                    height: "100%", borderRadius: 2, transition: "width 0.2s",
                    width: `${p1SpecPct}%`,
                    background: p1SpecPct >= 100 ? "linear-gradient(90deg, #f59e0b, #fbbf24)" : "linear-gradient(90deg, #3b82f6, #6366f1)",
                  }} />
                </div>
                {/* Round wins */}
                <div style={{ display: "flex", gap: "0.3vw", marginTop: "0.3vh" }}>
                  {[0, 1].map(i => (
                    <div key={i} style={{
                      width: "max(0.6vw, 8px)", height: "max(0.6vw, 8px)", borderRadius: "50%",
                      border: `1px solid ${i < hudState.p1.roundWins ? "#f59e0b" : "rgba(255,255,255,0.2)"}`,
                      background: i < hudState.p1.roundWins ? "#f59e0b" : "transparent",
                    }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Timer */}
            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                width: "max(5vw, 50px)", height: "max(5vw, 50px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: "0.5vw", border: "2px solid rgba(255,255,255,0.4)",
                background: "rgba(0,0,0,0.8)",
                clipPath: "polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)",
              }}>
                <span style={{
                  fontFamily: "'Rajdhani', sans-serif", fontWeight: 900,
                  fontSize: "max(2.5vw, 20px)", color: hudState.timer <= 10 ? "#ef4444" : "#ffffff",
                  textShadow: hudState.timer <= 10 ? "0 0 10px #ef4444" : "none",
                }}>
                  {hudState.timer}
                </span>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "max(0.7vw, 8px)", color: "rgba(255,255,255,0.4)", marginTop: "0.3vh" }}>
                ROUND {hudState.round}
              </div>
            </div>

            {/* P2 Portrait + Health */}
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
                {/* Health bar — drains left */}
                <div style={{
                  height: "max(1.5vh, 12px)", borderRadius: 3, overflow: "hidden",
                  background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.3)",
                  position: "relative",
                }}>
                  <div style={{
                    position: "absolute", top: 0, right: 0, bottom: 0, borderRadius: 3,
                    width: `${p2HpPct}%`,
                    background: p2HpPct > 50 ? `linear-gradient(270deg, #22c55e, ${hudState.p2.color})` :
                                p2HpPct > 25 ? "linear-gradient(270deg, #eab308, #ef4444)" : "#ef4444",
                    transition: "width 0.3s",
                  }} />
                  <div style={{
                    position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "flex-end",
                    paddingRight: "0.5vw",
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
                {/* Special meter */}
                <div style={{
                  height: "max(0.8vh, 6px)", marginTop: "0.3vh", borderRadius: 2,
                  overflow: "hidden", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)",
                }}>
                  <div style={{
                    height: "100%", borderRadius: 2, transition: "width 0.2s",
                    width: `${p2SpecPct}%`, marginLeft: "auto",
                    background: p2SpecPct >= 100 ? "linear-gradient(270deg, #f59e0b, #fbbf24)" : "linear-gradient(270deg, #3b82f6, #6366f1)",
                  }} />
                </div>
                {/* Round wins */}
                <div style={{ display: "flex", gap: "0.3vw", marginTop: "0.3vh", justifyContent: "flex-end" }}>
                  {[0, 1].map(i => (
                    <div key={i} style={{
                      width: "max(0.6vw, 8px)", height: "max(0.6vw, 8px)", borderRadius: "50%",
                      border: `1px solid ${i < hudState.p2.roundWins ? "#f59e0b" : "rgba(255,255,255,0.2)"}`,
                      background: i < hudState.p2.roundWins ? "#f59e0b" : "transparent",
                    }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ ANNOUNCER TEXT ═══ */}
        <AnimatePresence>
          {showAnnounce && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.3 }}
              style={{
                position: "absolute", top: "30%", left: 0, right: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <div style={{
                fontFamily: "'Rajdhani', sans-serif", fontWeight: 900,
                fontSize: "max(6vw, 40px)", letterSpacing: "0.1em",
                color: announceColor,
                textShadow: `0 0 40px ${announceColor}88, 0 0 80px ${announceColor}44, 0 4px 0 #000`,
                WebkitTextStroke: "2px rgba(0,0,0,0.5)",
              }}>
                {announceText}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ COMBO DISPLAY ═══ */}
        <AnimatePresence>
          {comboDisplay && (
            <motion.div
              initial={{ opacity: 0, x: comboDisplay.player === 1 ? -50 : 50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                position: "absolute", top: "45%",
                [comboDisplay.player === 1 ? "left" : "right"]: "3vw",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "'Rajdhani', sans-serif", fontWeight: 900,
                  fontSize: "max(4vw, 28px)", color: "#fbbf24",
                  textShadow: "0 0 20px rgba(251,191,36,0.5), 0 2px 0 #000",
                }}>
                  {comboDisplay.count} HIT
                </div>
                <div style={{ fontFamily: "monospace", fontSize: "max(1.2vw, 12px)", color: "rgba(255,255,255,0.6)" }}>
                  {comboDisplay.damage} DMG
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ SPECIAL READY FLASH ═══ */}
        {hudState.p1.specialMeter >= 100 && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{
              position: "absolute", bottom: "15vh", left: "3vw",
              fontFamily: "monospace", fontSize: "max(1.2vw, 12px)",
              color: "#fbbf24", fontWeight: "bold", letterSpacing: "0.15em",
              textShadow: "0 0 10px rgba(251,191,36,0.5)",
            }}
          >
            SPECIAL READY!
          </motion.div>
        )}
      </div>

      {/* ═══ MOBILE TOUCH CONTROLS ═══ */}
      {isMobile && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          padding: "0 3vw 3vh", height: "35%", zIndex: 20,
        }}>
          {/* D-Pad */}
          <div style={{ position: "relative", width: "28vw", height: "28vw", maxWidth: 160, maxHeight: 160 }}>
            {/* Up */}
            <button
              style={{
                position: "absolute", left: "50%", transform: "translateX(-50%)", top: 0,
                width: "9vw", height: "9vw", maxWidth: 50, maxHeight: 50,
                borderRadius: "1vw", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              onTouchStart={(e) => { e.preventDefault(); setTouch("up", true); }}
              onTouchEnd={(e) => { e.preventDefault(); setTouch("up", false); }}
              onTouchCancel={() => setTouch("up", false)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><path d="M8 2L14 10H2z"/></svg>
            </button>
            {/* Down */}
            <button
              style={{
                position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 0,
                width: "9vw", height: "9vw", maxWidth: 50, maxHeight: 50,
                borderRadius: "1vw", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              onTouchStart={(e) => { e.preventDefault(); setTouch("down", true); }}
              onTouchEnd={(e) => { e.preventDefault(); setTouch("down", false); }}
              onTouchCancel={() => setTouch("down", false)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><path d="M8 14L2 6h12z"/></svg>
            </button>
            {/* Left */}
            <button
              style={{
                position: "absolute", top: "50%", transform: "translateY(-50%)", left: 0,
                width: "9vw", height: "9vw", maxWidth: 50, maxHeight: 50,
                borderRadius: "1vw", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              onTouchStart={(e) => { e.preventDefault(); setTouch("left", true); }}
              onTouchEnd={(e) => { e.preventDefault(); setTouch("left", false); }}
              onTouchCancel={() => setTouch("left", false)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><path d="M2 8L10 2v12z"/></svg>
            </button>
            {/* Right */}
            <button
              style={{
                position: "absolute", top: "50%", transform: "translateY(-50%)", right: 0,
                width: "9vw", height: "9vw", maxWidth: 50, maxHeight: 50,
                borderRadius: "1vw", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              onTouchStart={(e) => { e.preventDefault(); setTouch("right", true); }}
              onTouchEnd={(e) => { e.preventDefault(); setTouch("right", false); }}
              onTouchCancel={() => setTouch("right", false)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><path d="M14 8L6 14V2z"/></svg>
            </button>
          </div>

          {/* Action Buttons — Diamond layout */}
          <div style={{ position: "relative", width: "32vw", height: "28vw", maxWidth: 180, maxHeight: 160 }}>
            {/* Punch — top (red) */}
            <button
              style={{
                position: "absolute", left: "50%", transform: "translateX(-50%)", top: 0,
                width: "10vw", height: "10vw", maxWidth: 56, maxHeight: 56,
                borderRadius: "50%", background: "rgba(239,68,68,0.25)", border: "2px solid rgba(239,68,68,0.6)",
                color: "#ef4444", fontFamily: "monospace", fontWeight: "bold", fontSize: "max(1.5vw, 12px)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              onTouchStart={(e) => { e.preventDefault(); setTouch("punch", true); }}
              onTouchEnd={(e) => { e.preventDefault(); setTouch("punch", false); }}
              onTouchCancel={() => setTouch("punch", false)}
            >P</button>
            {/* Kick — right (blue) */}
            <button
              style={{
                position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
                width: "10vw", height: "10vw", maxWidth: 56, maxHeight: 56,
                borderRadius: "50%", background: "rgba(59,130,246,0.25)", border: "2px solid rgba(59,130,246,0.6)",
                color: "#3b82f6", fontFamily: "monospace", fontWeight: "bold", fontSize: "max(1.5vw, 12px)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              onTouchStart={(e) => { e.preventDefault(); setTouch("kick", true); }}
              onTouchEnd={(e) => { e.preventDefault(); setTouch("kick", false); }}
              onTouchCancel={() => setTouch("kick", false)}
            >K</button>
            {/* Block — bottom (green) */}
            <button
              style={{
                position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 0,
                width: "10vw", height: "10vw", maxWidth: 56, maxHeight: 56,
                borderRadius: "50%", background: "rgba(34,197,94,0.25)", border: "2px solid rgba(34,197,94,0.6)",
                color: "#22c55e", fontFamily: "monospace", fontWeight: "bold", fontSize: "max(1.5vw, 12px)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              onTouchStart={(e) => { e.preventDefault(); setTouch("block", true); }}
              onTouchEnd={(e) => { e.preventDefault(); setTouch("block", false); }}
              onTouchCancel={() => setTouch("block", false)}
            >B</button>
            {/* Special — left (gold) */}
            <button
              style={{
                position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                width: "10vw", height: "10vw", maxWidth: 56, maxHeight: 56,
                borderRadius: "50%", background: "rgba(234,179,8,0.25)", border: "2px solid rgba(234,179,8,0.6)",
                color: "#eab308", fontFamily: "monospace", fontWeight: "bold", fontSize: "max(1.5vw, 12px)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              onTouchStart={(e) => { e.preventDefault(); setTouch("special", true); }}
              onTouchEnd={(e) => { e.preventDefault(); setTouch("special", false); }}
              onTouchCancel={() => setTouch("special", false)}
            >SP</button>
          </div>
        </div>
      )}

      {/* Desktop Controls Legend */}
      {!isMobile && (
        <div style={{
          position: "absolute", bottom: "1vh", left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: "2vw", fontFamily: "monospace",
          fontSize: "max(0.8vw, 10px)", color: "rgba(255,255,255,0.3)",
          background: "rgba(0,0,0,0.6)", padding: "0.5vh 1.5vw", borderRadius: "0.5vw",
          backdropFilter: "blur(4px)", zIndex: 20,
        }}>
          <span>WASD: Move</span>
          <span>J/Z: Punch</span>
          <span>K/X: Kick</span>
          <span>L/C: Block</span>
          <span>Space/V: Special</span>
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

      {/* Training Mode Overlay */}
      {trainingMode && (
        <>
          {/* Training Mode Banner */}
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

          {/* Training Stats Panel */}
          <div style={{
            position: "absolute", top: "5vh", right: "1vw",
            padding: "1vh 1vw", borderRadius: "0.5vw",
            background: "rgba(0,0,0,0.8)", border: "1px solid rgba(34,211,238,0.3)",
            fontFamily: "monospace", fontSize: "max(0.8vw, 10px)",
            color: "rgba(255,255,255,0.7)", zIndex: 25,
            minWidth: "12vw",
          }}>
            <div style={{ color: "#22d3ee", fontWeight: "bold", marginBottom: "0.5vh", letterSpacing: "0.1em" }}>STATS</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3vh" }}>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>Hits:</span>
              <span style={{ color: "#4ade80" }}>{trainingHitsLanded}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3vh" }}>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>Max Combo:</span>
              <span style={{ color: "#f59e0b" }}>{trainingComboMax}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3vh" }}>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>Total DMG:</span>
              <span style={{ color: "#ef4444" }}>{trainingDamageTotal}</span>
            </div>
            <div style={{ marginTop: "0.5vh", paddingTop: "0.5vh", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "max(0.6vw, 8px)" }}>Opponent auto-regens at 30% HP</div>
            </div>
          </div>

          {/* Move List Toggle */}
          <button
            onClick={() => setShowMoveList(prev => !prev)}
            style={{
              position: "absolute", top: "5vh", left: "1vw",
              padding: "0.5vh 1vw", borderRadius: "0.3vw",
              background: showMoveList ? "rgba(34,211,238,0.2)" : "rgba(0,0,0,0.7)",
              border: `1px solid ${showMoveList ? "rgba(34,211,238,0.5)" : "rgba(255,255,255,0.25)"}`,
              color: showMoveList ? "#22d3ee" : "rgba(255,255,255,0.5)",
              fontFamily: "monospace", fontSize: "max(0.8vw, 10px)",
              cursor: "pointer", zIndex: 25, letterSpacing: "0.05em",
            }}
          >
            {showMoveList ? "HIDE MOVES" : "SHOW MOVES"}
          </button>

          {/* Move List Panel */}
          {showMoveList && (
            <div style={{
              position: "absolute", top: "8vh", left: "1vw",
              padding: "1vh 1.5vw", borderRadius: "0.5vw",
              background: "rgba(0,0,0,0.9)", border: "1px solid rgba(34,211,238,0.3)",
              fontFamily: "monospace", fontSize: "max(0.7vw, 9px)",
              color: "rgba(255,255,255,0.8)", zIndex: 25,
              maxHeight: "60vh", overflowY: "auto", minWidth: "18vw",
            }}>
              <div style={{ color: "#22d3ee", fontWeight: "bold", marginBottom: "1vh", letterSpacing: "0.15em", fontSize: "max(0.9vw, 11px)" }}>
                MOVE LIST — {player.name.toUpperCase()}
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
                    <th style={{ textAlign: "left", padding: "0.3vh 0.5vw", color: "rgba(255,255,255,0.5)" }}>Move</th>
                    <th style={{ textAlign: "left", padding: "0.3vh 0.5vw", color: "rgba(255,255,255,0.5)" }}>Input</th>
                    <th style={{ textAlign: "right", padding: "0.3vh 0.5vw", color: "rgba(255,255,255,0.5)" }}>DMG</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "0.3vh 0.5vw" }}>Light Punch</td>
                    <td style={{ padding: "0.3vh 0.5vw", color: "#fbbf24" }}>J / Z</td>
                    <td style={{ padding: "0.3vh 0.5vw", textAlign: "right", color: "#ef4444" }}>{Math.round(player.attack * 0.8)}</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "0.3vh 0.5vw" }}>Heavy Punch</td>
                    <td style={{ padding: "0.3vh 0.5vw", color: "#fbbf24" }}>S + J</td>
                    <td style={{ padding: "0.3vh 0.5vw", textAlign: "right", color: "#ef4444" }}>{Math.round(player.attack * 1.4)}</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "0.3vh 0.5vw" }}>Light Kick</td>
                    <td style={{ padding: "0.3vh 0.5vw", color: "#fbbf24" }}>K / X</td>
                    <td style={{ padding: "0.3vh 0.5vw", textAlign: "right", color: "#ef4444" }}>{Math.round(player.attack * 1.0)}</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "0.3vh 0.5vw" }}>Heavy Kick</td>
                    <td style={{ padding: "0.3vh 0.5vw", color: "#fbbf24" }}>S + K</td>
                    <td style={{ padding: "0.3vh 0.5vw", textAlign: "right", color: "#ef4444" }}>{Math.round(player.attack * 1.6)}</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "0.3vh 0.5vw" }}>Block</td>
                    <td style={{ padding: "0.3vh 0.5vw", color: "#fbbf24" }}>L / C</td>
                    <td style={{ padding: "0.3vh 0.5vw", textAlign: "right", color: "#60a5fa" }}>—</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", background: "rgba(34,211,238,0.05)" }}>
                    <td style={{ padding: "0.3vh 0.5vw", color: player.special.color, fontWeight: "bold" }}>{player.special.name}</td>
                    <td style={{ padding: "0.3vh 0.5vw", color: "#fbbf24" }}>Space / V</td>
                    <td style={{ padding: "0.3vh 0.5vw", textAlign: "right", color: "#ef4444", fontWeight: "bold" }}>{player.special.damage}</td>
                  </tr>
                </tbody>
              </table>
              <div style={{ marginTop: "1vh", paddingTop: "0.5vh", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ color: "#22d3ee", fontWeight: "bold", marginBottom: "0.5vh" }}>COMBOS</div>
                {player.combos.map((combo, i) => (
                  <div key={i} style={{ color: "rgba(255,255,255,0.6)", marginBottom: "0.3vh" }}>
                    <span style={{ color: "#f59e0b" }}>{i + 1}.</span> {combo}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "1vh", paddingTop: "0.5vh", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "max(0.6vw, 8px)" }}>
                  Special requires full meter (100%). Build meter by landing hits.
                </div>
              </div>
            </div>
          )}
        </>
      )}

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
    </div>
  );
}
