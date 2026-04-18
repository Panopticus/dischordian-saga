/**
 * StarChart — Constellation pattern-matching puzzle for the Observation Deck.
 *
 * Player connects scattered stars in the correct order to reveal a Dischordian
 * constellation. Daily rotation picks one of five constellations. Wrong
 * connections flash red and reset. Completing the pattern reveals the
 * constellation name, lore text, and fires a reward callback.
 */
import { useRef, useEffect, useState, useCallback } from "react";

/* ═══ TYPES ═══ */
interface Star {
  x: number; // 0-100 coordinate space
  y: number;
}

interface Constellation {
  name: string;
  stars: Star[];
  /** Each pair is [fromIndex, toIndex] — the order the player must connect. */
  connections: [number, number][];
  loreText: string;
}

interface StarChartProps {
  onComplete: (constellation: string) => void;
  onClose: () => void;
}

/* ═══ CONSTELLATION DATA ═══ */
const CONSTELLATIONS: Constellation[] = [
  {
    name: "The Architect's Eye",
    stars: [
      { x: 50, y: 20 }, // top
      { x: 70, y: 45 }, // right
      { x: 50, y: 70 }, // bottom
      { x: 30, y: 45 }, // left
      { x: 50, y: 45 }, // center (iris)
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4]],
    loreText:
      "The first navigators believed this eye watched over every jump gate. " +
      "To chart it was to earn safe passage through the unknown.",
  },
  {
    name: "Iron Lion's Shield",
    stars: [
      { x: 50, y: 18 }, // top
      { x: 72, y: 32 }, // upper-right
      { x: 72, y: 58 }, // lower-right
      { x: 50, y: 72 }, // bottom
      { x: 28, y: 58 }, // lower-left
      { x: 28, y: 32 }, // upper-left
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
    loreText:
      "Soldiers of the Iron Lion painted this hexagon on their hull plating. " +
      "They said no weapon could pierce a ship that bore it.",
  },
  {
    name: "The Dreamer's Spiral",
    stars: [
      { x: 50, y: 45 }, // center
      { x: 58, y: 40 }, // ring 1
      { x: 63, y: 52 }, // ring 2
      { x: 52, y: 62 }, // ring 3
      { x: 37, y: 56 }, // ring 4
      { x: 33, y: 38 }, // ring 5
      { x: 46, y: 22 }, // ring 6 (outer)
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
    loreText:
      "Dreamers traced this spiral on the observation glass before sleeping. " +
      "They claimed the shape opened a door to the shared dreamscape.",
  },
  {
    name: "Kael's Chain",
    stars: [
      { x: 25, y: 40 },
      { x: 38, y: 50 },
      { x: 50, y: 40 },
      { x: 62, y: 50 },
      { x: 75, y: 40 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4]],
    loreText:
      "Kael the Unbroken forged five links before the Ark launched. " +
      "Each link held a promise: protect, endure, remember, defy, return.",
  },
  {
    name: "The Two Witnesses",
    stars: [
      { x: 35, y: 20 }, // left-top
      { x: 35, y: 40 }, // left-mid
      { x: 35, y: 60 }, // left-bottom
      { x: 65, y: 20 }, // right-top
      { x: 65, y: 40 }, // right-mid
      { x: 65, y: 60 }, // right-bottom
      { x: 35, y: 80 }, // left-base
      { x: 65, y: 80 }, // right-base
    ],
    connections: [[0, 1], [1, 2], [2, 6], [3, 4], [4, 5], [5, 7], [2, 5]],
    loreText:
      "Two pillars of light, linked at the heart. The Witnesses saw the " +
      "cataclysm and chose to remain — their testimony etched in stars.",
  },
];

/* ═══ EPOCH CONSTELLATION THEMES ═══ */
interface EpochConstellationTheme {
  epochName: string;
  loreOverlay: string;
}

const EPOCH_CONSTELLATION_THEMES: Record<string, EpochConstellationTheme> = {
  "age-of-privacy": {
    epochName: "Age of Privacy",
    loreOverlay:
      "During the Surveillance Era, these constellations were used by The Eyes " +
      "for covert navigation — each star a hidden relay in their panoptic network.",
  },
  "age-of-prophecy": {
    epochName: "Age of Prophecy",
    loreOverlay:
      "The Seer mapped these stars to predict the Fall. Every alignment was a " +
      "verse in a prophecy written across the heavens themselves.",
  },
  "age-of-insurgency": {
    epochName: "Age of Insurgency",
    loreOverlay:
      "Rebels used these star patterns as coded meeting coordinates, turning " +
      "the night sky into a battlefield map only the resistance could read.",
  },
  "age-of-revelation": {
    epochName: "Age of Revelation",
    loreOverlay:
      "When the Revelation came, the true meaning of each constellation was " +
      "exposed — names changed, histories rewritten in starlight.",
  },
  "fall-of-reality": {
    epochName: "Fall of Reality",
    loreOverlay:
      "The constellations shifted when reality broke. Stars drifted from their " +
      "ancient positions, tracing new shapes no chart had ever recorded.",
  },
};

/** Return today's constellation theme overlay based on day of the week. */
function getDailyConstellationTheme(): EpochConstellationTheme {
  const dayOfWeek = new Date().getDay(); // 0=Sun ... 6=Sat
  const epochsByDay: Record<number, string> = {
    1: "age-of-privacy",
    2: "age-of-prophecy",
    3: "age-of-insurgency",
    4: "age-of-revelation",
    5: "fall-of-reality",
  };
  let epochId: string;
  if (epochsByDay[dayOfWeek]) {
    epochId = epochsByDay[dayOfWeek];
  } else {
    // Weekend: pick a random epoch seeded by the date so it's stable for the day
    const dayIndex = Math.floor(Date.now() / 86400000);
    const epochKeys = Object.keys(EPOCH_CONSTELLATION_THEMES);
    epochId = epochKeys[dayIndex % epochKeys.length];
  }
  return EPOCH_CONSTELLATION_THEMES[epochId];
}

/** Constellation reference art (shown on completion) */
const CONSTELLATION_ART: Record<string, string> = {
  "The Architect's Eye": "/art/constellations/constellation-architects-eye.png",
  "Iron Lion's Shield": "/art/constellations/constellation-iron-lions-shield.png",
  "The Dreamer's Spiral": "/art/constellations/constellation-dreamers-spiral.png",
  "Kael's Chain": "/art/constellations/constellation-kaels-chain.png",
  "The Two Witnesses": "/art/constellations/constellation-two-witnesses.png",
};

/** Pick today's constellation via daily rotation. */
function todaysConstellation(): Constellation {
  const dayIndex = Math.floor(Date.now() / 86_400_000) % CONSTELLATIONS.length;
  return CONSTELLATIONS[dayIndex];
}

/* ═══ DECORATIVE BACKGROUND STARS ═══ */
function generateBackgroundStars(count: number) {
  const seed: { x: number; y: number; r: number; twinkleOffset: number }[] = [];
  for (let i = 0; i < count; i++) {
    seed.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: 0.3 + Math.random() * 0.8,
      twinkleOffset: Math.random() * Math.PI * 2,
    });
  }
  return seed;
}

/* ═══ COMPONENT ═══ */
export default function StarChart({ onComplete, onClose }: StarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  const [constellation] = useState(todaysConstellation);
  const [selected, setSelected] = useState<number[]>([]);
  const [completedEdges, setCompletedEdges] = useState<[number, number][]>([]);
  const [errorFlash, setErrorFlash] = useState(false);
  const [won, setWon] = useState(false);
  const [revealedChars, setRevealedChars] = useState(0);
  const bgStarsRef = useRef(generateBackgroundStars(120));

  /* ── coordinate helpers ── */
  const toCanvas = useCallback(
    (pt: Star, w: number, h: number) => ({
      cx: (pt.x / 100) * w,
      cy: (pt.y / 100) * h,
    }),
    [],
  );

  const hitTest = useCallback(
    (mx: number, my: number, w: number, h: number): number | null => {
      const hitRadius = Math.max(w, h) * 0.03;
      for (let i = 0; i < constellation.stars.length; i++) {
        const { cx, cy } = toCanvas(constellation.stars[i], w, h);
        const dx = mx - cx;
        const dy = my - cy;
        if (dx * dx + dy * dy <= hitRadius * hitRadius) return i;
      }
      return null;
    },
    [constellation, toCanvas],
  );

  /* ── handle star tap ── */
  const handleTap = useCallback(
    (idx: number) => {
      if (won) return;
      const nextEdgeIdx = completedEdges.length;
      if (nextEdgeIdx >= constellation.connections.length) return;

      const expectedEdge = constellation.connections[nextEdgeIdx];
      const lastSelected = selected.length > 0 ? selected[selected.length - 1] : null;

      // First tap — must match the "from" of the first edge
      if (lastSelected === null) {
        if (idx === expectedEdge[0]) {
          setSelected([idx]);
        } else {
          setErrorFlash(true);
          setTimeout(() => setErrorFlash(false), 350);
        }
        return;
      }

      // Subsequent taps — last selected must be the "from" and new tap the "to"
      if (lastSelected === expectedEdge[0] && idx === expectedEdge[1]) {
        const newEdges: [number, number][] = [...completedEdges, expectedEdge];
        setCompletedEdges(newEdges);
        setSelected((prev) => [...prev, idx]);

        // Check win
        if (newEdges.length === constellation.connections.length) {
          setWon(true);
        }
      } else {
        // Wrong connection — flash and reset last connection only
        setErrorFlash(true);
        setTimeout(() => setErrorFlash(false), 350);
      }
    },
    [won, completedEdges, constellation, selected],
  );

  /* ── canvas click / tap handler ── */
  const handleCanvasPointer = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const idx = hitTest(mx, my, canvas.width, canvas.height);
      if (idx !== null) handleTap(idx);
    },
    [hitTest, handleTap],
  );

  /* ── typewriter effect on win ── */
  useEffect(() => {
    if (!won) return;
    if (revealedChars >= constellation.name.length) {
      const timer = setTimeout(() => onComplete(constellation.name), 2200);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(
      () => setRevealedChars((c) => c + 1),
      90,
    );
    return () => clearTimeout(timer);
  }, [won, revealedChars, constellation.name, onComplete]);

  /* ── render loop ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let running = true;

    const draw = (time: number) => {
      if (!running) return;
      const W = canvas.width;
      const H = canvas.height;
      const t = time / 1000;

      // -- background
      ctx.fillStyle = "#06060e";
      ctx.fillRect(0, 0, W, H);

      // -- twinkling background stars
      for (const s of bgStarsRef.current) {
        const alpha = 0.3 + 0.4 * Math.sin(t * 1.5 + s.twinkleOffset);
        ctx.beginPath();
        ctx.arc((s.x / 100) * W, (s.y / 100) * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `color-mix(in oklch, var(--text-primary) calc((alpha.toFixed(2)) * 100%), transparent)`;
        ctx.fill();
      }

      // -- completed connection lines (cyan glow)
      ctx.lineWidth = 2;
      for (const [a, b] of completedEdges) {
        const from = toCanvas(constellation.stars[a], W, H);
        const to = toCanvas(constellation.stars[b], W, H);
        ctx.strokeStyle = won ? "var(--energy-premium)" : "rgba(0,255,255,0.8)";
        ctx.shadowColor = won ? "var(--energy-premium)" : "#00ffff";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(from.cx, from.cy);
        ctx.lineTo(to.cx, to.cy);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // -- error flash overlay
      if (errorFlash) {
        ctx.fillStyle = "rgba(255,40,40,0.15)";
        ctx.fillRect(0, 0, W, H);
      }

      // -- golden glow flood on win
      if (won) {
        const gAlpha = Math.min((t % 100) * 0.04, 0.12);
        ctx.fillStyle = `color-mix(in oklch, var(--energy-premium) calc((gAlpha.toFixed(3)) * 100%), transparent)`;
        ctx.fillRect(0, 0, W, H);
      }

      // -- constellation stars
      for (let i = 0; i < constellation.stars.length; i++) {
        const { cx, cy } = toCanvas(constellation.stars[i], W, H);
        const isSelected = selected.includes(i);
        const pulse = 1 + 0.15 * Math.sin(t * 3 + i);
        const baseR = Math.max(W, H) * 0.012;
        const r = baseR * pulse;

        // glow
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 3);
        grd.addColorStop(0, isSelected || won ? "rgba(0,255,255,0.6)" : "rgba(0,255,255,0.25)");
        grd.addColorStop(1, "rgba(0,255,255,0)");
        ctx.beginPath();
        ctx.arc(cx, cy, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // core
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = won ? "var(--energy-premium)" : isSelected ? "#aaffff" : "#ffffff";
        ctx.fill();
      }

      // -- constellation name typewriter
      if (won && revealedChars > 0) {
        const text = constellation.name.slice(0, revealedChars);
        ctx.font = `bold ${Math.round(W * 0.05)}px serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = "var(--energy-premium)";
        ctx.shadowColor = "var(--energy-premium)";
        ctx.shadowBlur = 16;
        ctx.fillText(text, W / 2, H * 0.12);
        ctx.shadowBlur = 0;
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, [constellation, selected, completedEdges, errorFlash, won, revealedChars, toCanvas]);

  /* ── resize canvas to parent ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement!;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ═══ JSX ═══ */
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        background: "#06060e",
      }}
    >
      {/* Background art */}
      <img src="/art/minigames/minigame-star-chart.png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.1, filter: "brightness(0.3)", pointerEvents: "none", zIndex: 0 }} />
      {/* header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px",
          color: "#8ec8e8",
          fontFamily: "monospace",
          fontSize: 14,
        }}
      >
        <span>
          STAR CHART &middot; {completedEdges.length}/{constellation.connections.length}
        </span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "1px solid #334",
            color: "#8ec8e8",
            padding: "4px 14px",
            borderRadius: 4,
            cursor: "pointer",
            fontFamily: "monospace",
          }}
        >
          CLOSE
        </button>
      </div>

      {/* canvas */}
      <div style={{ flex: 1, position: "relative" }}>
        <canvas
          ref={canvasRef}
          onPointerDown={handleCanvasPointer}
          style={{ width: "100%", height: "100%", display: "block", cursor: "crosshair" }}
        />

        {/* lore overlay on win */}
        {won && revealedChars >= constellation.name.length && (
          <div
            style={{
              position: "absolute",
              bottom: 40,
              left: "50%",
              transform: "translateX(-50%)",
              maxWidth: 480,
              textAlign: "center",
              color: "#c8b87a",
              fontFamily: "serif",
              fontSize: 15,
              lineHeight: 1.6,
              padding: "16px 24px",
              background: "rgba(6,6,14,0.85)",
              borderRadius: 8,
              border: "1px solid color-mix(in oklch, var(--energy-premium) 25%, transparent)",
              animation: "fadeIn 1s ease",
            }}
          >
            {/* Constellation reference art */}
            {CONSTELLATION_ART[constellation.name] && (
              <img
                src={CONSTELLATION_ART[constellation.name]}
                alt={constellation.name}
                style={{ width: 180, height: 120, objectFit: "contain", margin: "0 auto 12px", opacity: 0.8, borderRadius: 6 }}
              />
            )}
            <p style={{ margin: 0 }}>{constellation.loreText}</p>
            <p style={{ margin: "12px 0 0", fontSize: 12, color: "#8ec8e8" }}>
              +100 XP &middot; dream-token acquired
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
