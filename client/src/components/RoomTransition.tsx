/* ═══════════════════════════════════════════════════════
   ROOM TRANSITION — Animated corridor-walking cutscene
   Plays a 2-3 second cinematic transition between rooms.
   Shows corridor perspective with lighting effects and
   destination room name reveal.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RoomTransitionProps {
  fromRoom: string;
  toRoom: string;
  toRoomName: string;
  toRoomImage: string;
  onComplete: () => void;
  isNewRoom?: boolean;
}

/* Corridor segment colors based on destination */
const CORRIDOR_THEMES: Record<string, { primary: string; secondary: string; accent: string }> = {
  "cryo-bay": { primary: "#33e2e6", secondary: "#1a5c5e", accent: "#0a2a2b" },
  "bridge": { primary: "#3875fa", secondary: "#1a3a7d", accent: "#0a1a3d" },
  "archives": { primary: "#a855f7", secondary: "#5a2d7d", accent: "#2a1540" },
  "comms-array": { primary: "#22c55e", secondary: "#115e2e", accent: "#0a2d15" },
  "engineering": { primary: "#f97316", secondary: "#7d3a0b", accent: "#3d1d05" },
  "armory": { primary: "#ef4444", secondary: "#7d2222", accent: "#3d1111" },
  "cargo-hold": { primary: "#eab308", secondary: "#7d5f04", accent: "#3d2f02" },
  "observation-deck": { primary: "#6366f1", secondary: "#3133a0", accent: "#191a50" },
  "medical-bay": { primary: "#14b8a6", secondary: "#0a5c53", accent: "#052e2a" },
  "hangar-bay": { primary: "#64748b", secondary: "#334155", accent: "#1e293b" },
  "mess-hall": { primary: "#f59e0b", secondary: "#7d4f06", accent: "#3d2703" },
  "captains-quarters": { primary: "#d4af37", secondary: "#6a5818", accent: "#35300c" },
};

export default function RoomTransition({
  fromRoom,
  toRoom,
  toRoomName,
  toRoomImage,
  onComplete,
  isNewRoom = false,
}: RoomTransitionProps) {
  const [phase, setPhase] = useState<"corridor" | "arriving" | "reveal">("corridor");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startTime = useRef(Date.now());

  const theme = CORRIDOR_THEMES[toRoom] ?? CORRIDOR_THEMES["bridge"];

  // Corridor animation using canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    startTime.current = Date.now();

    function draw() {
      if (!ctx) return;
      const elapsed = (Date.now() - startTime.current) / 1000;
      const speed = 2 + elapsed * 3; // Accelerating

      // Clear
      ctx.fillStyle = "#010020";
      ctx.fillRect(0, 0, w, h);

      // Vanishing point
      const vpX = w / 2;
      const vpY = h / 2;

      // Draw corridor panels (perspective lines)
      const numPanels = 20;
      for (let i = 0; i < numPanels; i++) {
        const depth = ((i / numPanels + elapsed * speed * 0.1) % 1);
        const scale = Math.pow(depth, 1.5);
        const alpha = depth < 0.1 ? depth * 10 : depth > 0.8 ? (1 - depth) * 5 : 1;

        if (alpha <= 0) continue;

        const halfW = 20 + (w / 2 - 20) * scale;
        const halfH = 15 + (h / 2 - 15) * scale;

        // Corridor walls
        ctx.strokeStyle = `rgba(${hexToRgb(theme.primary)}, ${alpha * 0.4})`;
        ctx.lineWidth = 1 + scale * 2;
        ctx.beginPath();
        // Left wall
        ctx.moveTo(vpX - halfW, vpY - halfH);
        ctx.lineTo(vpX - halfW, vpY + halfH);
        // Right wall
        ctx.moveTo(vpX + halfW, vpY - halfH);
        ctx.lineTo(vpX + halfW, vpY + halfH);
        // Top
        ctx.moveTo(vpX - halfW, vpY - halfH);
        ctx.lineTo(vpX + halfW, vpY - halfH);
        // Bottom
        ctx.moveTo(vpX - halfW, vpY + halfH);
        ctx.lineTo(vpX + halfW, vpY + halfH);
        ctx.stroke();

        // Floor grid lines
        if (i % 2 === 0) {
          ctx.strokeStyle = `rgba(${hexToRgb(theme.primary)}, ${alpha * 0.15})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(vpX - halfW, vpY + halfH);
          ctx.lineTo(vpX + halfW, vpY + halfH);
          ctx.stroke();
        }

        // Ceiling lights
        if (i % 3 === 0) {
          const lightFlicker = Math.sin(elapsed * 8 + i * 2) * 0.3 + 0.7;
          ctx.fillStyle = `rgba(${hexToRgb(theme.primary)}, ${alpha * 0.3 * lightFlicker})`;
          ctx.fillRect(vpX - halfW * 0.3, vpY - halfH - 2, halfW * 0.6, 4);
        }
      }

      // Perspective lines from corners to vanishing point
      ctx.strokeStyle = `rgba(${hexToRgb(theme.secondary)}, 0.2)`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(vpX, vpY);
      ctx.moveTo(w, 0); ctx.lineTo(vpX, vpY);
      ctx.moveTo(0, h); ctx.lineTo(vpX, vpY);
      ctx.moveTo(w, h); ctx.lineTo(vpX, vpY);
      ctx.stroke();

      // Central light beam
      const beamPulse = Math.sin(elapsed * 4) * 0.2 + 0.6;
      const gradient = ctx.createRadialGradient(vpX, vpY, 0, vpX, vpY, w * 0.4);
      gradient.addColorStop(0, `rgba(${hexToRgb(theme.primary)}, ${beamPulse * 0.15})`);
      gradient.addColorStop(0.5, `rgba(${hexToRgb(theme.primary)}, ${beamPulse * 0.05})`);
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Floating particles
      for (let p = 0; p < 15; p++) {
        const px = (Math.sin(elapsed * 0.5 + p * 1.7) * 0.4 + 0.5) * w;
        const py = (Math.cos(elapsed * 0.3 + p * 2.3) * 0.4 + 0.5) * h;
        const pAlpha = Math.sin(elapsed * 2 + p) * 0.3 + 0.4;
        ctx.fillStyle = `rgba(${hexToRgb(theme.primary)}, ${pAlpha * 0.3})`;
        ctx.beginPath();
        ctx.arc(px, py, 1 + Math.sin(elapsed + p) * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Scanline effect
      for (let y = 0; y < h; y += 4) {
        ctx.fillStyle = `rgba(0, 0, 0, ${0.05 + Math.sin(y * 0.1 + elapsed * 10) * 0.02})`;
        ctx.fillRect(0, y, w, 2);
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [theme]);

  // Phase progression
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("arriving"), 1500);
    const t2 = setTimeout(() => setPhase("reveal"), 2200);
    const t3 = setTimeout(() => onComplete(), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "#010020" }}
    >
      {/* Corridor canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Overlay content */}
      <div className="relative z-10 text-center">
        <AnimatePresence mode="wait">
          {phase === "corridor" && (
            <motion.div
              key="corridor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              {/* Walking indicator */}
              <div className="flex items-center justify-center gap-1">
                {[0, 1, 2, 3, 4].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: theme.primary }}
                    animate={{
                      opacity: [0.2, 1, 0.2],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.12,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>
              <p className="font-mono text-xs tracking-[0.3em]" style={{ color: theme.primary, opacity: 0.6 }}>
                TRAVERSING CORRIDOR
              </p>
            </motion.div>
          )}

          {phase === "arriving" && (
            <motion.div
              key="arriving"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="space-y-2"
            >
              <motion.div
                className="w-16 h-16 mx-auto rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: theme.primary, background: `${theme.primary}15` }}
                animate={{ boxShadow: [`0 0 20px ${theme.primary}30`, `0 0 40px ${theme.primary}50`, `0 0 20px ${theme.primary}30`] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <motion.div
                  className="w-3 h-3 rounded-full"
                  style={{ background: theme.primary }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              </motion.div>
              <p className="font-mono text-[10px] tracking-[0.4em]" style={{ color: theme.primary }}>
                APPROACHING
              </p>
            </motion.div>
          )}

          {phase === "reveal" && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Room image preview */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-48 h-28 mx-auto rounded-lg overflow-hidden border"
                style={{ borderColor: `${theme.primary}50` }}
              >
                <img
                  src={toRoomImage}
                  alt={toRoomName}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <div>
                <motion.p
                  initial={{ opacity: 0, letterSpacing: "0.5em" }}
                  animate={{ opacity: 1, letterSpacing: "0.2em" }}
                  transition={{ duration: 0.5 }}
                  className="font-display text-lg font-bold"
                  style={{ color: theme.primary }}
                >
                  {toRoomName.toUpperCase()}
                </motion.p>
                {isNewRoom && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="font-mono text-[10px] text-amber-400/60 tracking-[0.3em] mt-1"
                  >
                    ★ NEW AREA DISCOVERED ★
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edge vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at center, transparent 40%, var(--bg-overlay) 100%)",
      }} />
    </motion.div>
  );
}

/* Helper: hex color to rgb string */
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}
