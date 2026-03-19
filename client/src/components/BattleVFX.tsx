/* ═══════════════════════════════════════════════════════
   BATTLE VFX — Visual effects system for card combat
   Particles, floating damage, screen flash, impact effects
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Types ── */
export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  type: "damage" | "heal" | "status" | "miss";
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  driftX: number;
}

export interface ScreenEffect {
  id: string;
  type: "flash" | "shake" | "heavyShake" | "redFlash" | "blueFlash";
}

/* ── Ambient Particles (floating background embers) ── */
export function AmbientParticles({ count = 20, color = "rgba(51,226,230,0.3)" }: { count?: number; color?: string }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: `amb-${i}`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 1 + Math.random() * 3,
    duration: 3 + Math.random() * 5,
    delay: Math.random() * 5,
    driftX: -30 + Math.random() * 60,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full animate-ambient-particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: color,
            "--particle-duration": `${p.duration}s`,
            "--particle-delay": `${p.delay}s`,
            "--drift-x": `${p.driftX}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/* ── Floating Damage/Heal Numbers ── */
export function FloatingNumbers({ texts, onComplete }: { texts: FloatingText[]; onComplete: (id: string) => void }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {texts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 1, 0], y: -60, scale: [0.5, 1.4, 1, 0.8] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            onAnimationComplete={() => onComplete(t.id)}
            className="absolute font-display font-black tracking-wider"
            style={{
              left: t.x,
              top: t.y,
              color: t.color,
              fontSize: t.type === "damage" ? "28px" : t.type === "heal" ? "24px" : "18px",
              textShadow: `0 0 12px ${t.color}, 0 2px 4px rgba(0,0,0,0.8)`,
              zIndex: 100,
            }}
          >
            {t.type === "damage" ? `-${t.text}` : t.type === "heal" ? `+${t.text}` : t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ── Screen Flash Overlay ── */
export function ScreenFlash({ effects, onComplete }: { effects: ScreenEffect[]; onComplete: (id: string) => void }) {
  return (
    <AnimatePresence>
      {effects.filter(e => e.type === "flash" || e.type === "redFlash" || e.type === "blueFlash").map(e => (
        <motion.div
          key={e.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onAnimationComplete={() => onComplete(e.id)}
          className="fixed inset-0 pointer-events-none z-40"
          style={{
            background: e.type === "redFlash"
              ? "radial-gradient(circle, rgba(239,68,68,0.3) 0%, transparent 70%)"
              : e.type === "blueFlash"
              ? "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 60%)",
          }}
        />
      ))}
    </AnimatePresence>
  );
}

/* ── Summon Ring Effect ── */
export function SummonRing({ x, y, color = "rgba(51,226,230,0.5)" }: { x: number; y: number; color?: string }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0.8 }}
      animate={{ scale: [0, 2.5], opacity: [0.8, 0] }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="absolute pointer-events-none z-30"
      style={{
        left: x - 40,
        top: y - 40,
        width: 80,
        height: 80,
        borderRadius: "50%",
        border: `2px solid ${color}`,
        boxShadow: `0 0 20px ${color}, inset 0 0 20px ${color}`,
      }}
    />
  );
}

/* ── Impact Sparks ── */
export function ImpactSparks({ x, y, count = 8, color = "#ef4444" }: { x: number; y: number; count?: number; color?: string }) {
  const sparks = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const dist = 30 + Math.random() * 40;
    return {
      id: i,
      endX: Math.cos(angle) * dist,
      endY: Math.sin(angle) * dist,
      size: 2 + Math.random() * 3,
    };
  });

  return (
    <>
      {sparks.map(s => (
        <motion.div
          key={s.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: s.endX, y: s.endY, opacity: 0, scale: 0 }}
          transition={{ duration: 0.4 + Math.random() * 0.2, ease: "easeOut" }}
          className="absolute rounded-full pointer-events-none z-30"
          style={{
            left: x,
            top: y,
            width: s.size,
            height: s.size,
            background: color,
            boxShadow: `0 0 6px ${color}`,
          }}
        />
      ))}
    </>
  );
}

/* ── Turn Banner ── */
export function TurnBanner({ text, color }: { text: string; color: string }) {
  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: ["−100%", "0%", "0%", "100%"], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.2, times: [0, 0.3, 0.7, 1] }}
      className="fixed top-1/2 left-0 right-0 -translate-y-1/2 z-50 pointer-events-none"
    >
      <div
        className="py-3 text-center"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}22, ${color}33, ${color}22, transparent)`,
          borderTop: `1px solid ${color}44`,
          borderBottom: `1px solid ${color}44`,
        }}
      >
        <span
          className="font-display text-lg sm:text-2xl tracking-[0.4em] font-black"
          style={{ color, textShadow: `0 0 20px ${color}` }}
        >
          {text}
        </span>
      </div>
    </motion.div>
  );
}

/* ── VFX Manager Hook ── */
export function useVFX() {
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [screenEffects, setScreenEffects] = useState<ScreenEffect[]>([]);
  const [shakeClass, setShakeClass] = useState("");
  const idCounter = useRef(0);

  const nextId = () => `vfx-${++idCounter.current}`;

  const spawnDamage = useCallback((x: number, y: number, amount: number) => {
    const id = nextId();
    setFloatingTexts(prev => [...prev, { id, text: String(amount), x, y, color: "#ef4444", type: "damage" }]);
    setScreenEffects(prev => [...prev, { id: nextId(), type: "redFlash" }]);
    setShakeClass("animate-screen-shake");
    setTimeout(() => setShakeClass(""), 400);
  }, []);

  const spawnHeavyDamage = useCallback((x: number, y: number, amount: number) => {
    const id = nextId();
    setFloatingTexts(prev => [...prev, { id, text: String(amount), x, y, color: "#fbbf24", type: "damage" }]);
    setScreenEffects(prev => [...prev, { id: nextId(), type: "flash" }]);
    setShakeClass("animate-screen-shake-heavy");
    setTimeout(() => setShakeClass(""), 500);
  }, []);

  const spawnHeal = useCallback((x: number, y: number, amount: number) => {
    const id = nextId();
    setFloatingTexts(prev => [...prev, { id, text: String(amount), x, y, color: "#00e055", type: "heal" }]);
  }, []);

  const spawnStatus = useCallback((x: number, y: number, text: string, color = "#33e2e6") => {
    const id = nextId();
    setFloatingTexts(prev => [...prev, { id, text, x, y, color, type: "status" }]);
  }, []);

  const triggerFlash = useCallback((type: ScreenEffect["type"] = "flash") => {
    setScreenEffects(prev => [...prev, { id: nextId(), type }]);
  }, []);

  const triggerShake = useCallback((heavy = false) => {
    setShakeClass(heavy ? "animate-screen-shake-heavy" : "animate-screen-shake");
    setTimeout(() => setShakeClass(""), heavy ? 500 : 400);
  }, []);

  const removeFloatingText = useCallback((id: string) => {
    setFloatingTexts(prev => prev.filter(t => t.id !== id));
  }, []);

  const removeScreenEffect = useCallback((id: string) => {
    setScreenEffects(prev => prev.filter(e => e.id !== id));
  }, []);

  return {
    floatingTexts, screenEffects, shakeClass,
    spawnDamage, spawnHeavyDamage, spawnHeal, spawnStatus,
    triggerFlash, triggerShake,
    removeFloatingText, removeScreenEffect,
  };
}
