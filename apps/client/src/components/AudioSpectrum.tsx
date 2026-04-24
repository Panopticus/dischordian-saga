/* ═══════════════════════════════════════════════════════
   AUDIO SPECTRUM — Canvas frequency-bar visualizer

   Pulls raw frequency bins from the shared AnalyserNode
   (registered by PlayerContext when the audio graph is
   built) and paints a band-averaged bar chart into a
   canvas. Pass 1 shipped --audio-bass / --audio-mid /
   --audio-treble as a CSS bus — this component is the
   cinematic, dedicated counterpart: a real spectrum
   analyzer for the Discography / album / song surfaces.

   Why band-average 256 bins down to 48–96 visible bars?
   256 bars at 60fps on a canvas wider than the viewport
   on desktop retina is ~15k rect calls per frame. Log-
   scale bucket down to 64 bars and the perceived detail
   is actually HIGHER — the ear groups frequency
   logarithmically, so a linear-in-Hz bar chart wastes
   half the canvas on the treble shelf.

   Respects:
     html.audio-reactive-off → render nothing; the surface
       collapses to whatever was under it.
     html.reduce-motion      → one-shot paint on mount,
       no RAF loop. Snapshot of the current spectrum so
       the space isn't visually empty.
     --motion-intensity      → scales peak-decay speed.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef } from "react";
import { getSharedAnalyser } from "@/hooks/useAudioAmplitude";

interface AudioSpectrumProps {
  /** Number of visible bars. Defaults to 64 (log-scale from 256 FFT bins). */
  bars?: number;
  /** Canvas height in px. Width fills the container. Default 64. */
  height?: number;
  /** Primary bar color. Accepts any CSS color expression. Defaults to Void cyan. */
  accentColor?: string;
  /** Secondary accent used at the top of each bar (peak cap). */
  peakColor?: string;
  /** Tuning knob for the bar top-to-bottom gradient intensity. 0 = flat, 1 = strong. */
  gradientStrength?: number;
  /** Pass-through className on the wrapping div. */
  className?: string;
}

export default function AudioSpectrum({
  bars = 64,
  height = 64,
  accentColor = "var(--neon-cyan)",
  peakColor = "rgba(255, 255, 255, 0.85)",
  gradientStrength = 0.6,
  className = "",
}: AudioSpectrumProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const peaksRef = useRef<Float32Array | null>(null);
  const bufRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const bandsRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Resolve the accent/peak colors through the computed style on the
    // element, so CSS custom-property values like `var(--neon-cyan)`
    // turn into concrete rgb() strings that canvas 2D can consume.
    // Recomputed whenever the user changes atmospheres, so tone swaps
    // propagate without a remount.
    const getResolvedColor = (value: string): string => {
      if (!value.startsWith("var(")) return value;
      const probe = document.createElement("span");
      probe.style.color = value;
      probe.style.display = "none";
      document.body.appendChild(probe);
      const resolved = getComputedStyle(probe).color;
      document.body.removeChild(probe);
      return resolved || value;
    };

    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const sizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.height = `${height}px`;
    };
    sizeCanvas();

    const resize = () => sizeCanvas();
    window.addEventListener("resize", resize);

    let resolvedAccent = getResolvedColor(accentColor);
    let resolvedPeak = getResolvedColor(peakColor);

    // Observe atmosphere / physics swaps so colors re-resolve without
    // a remount when the player changes a Settings toggle.
    const atmosphereObserver = new MutationObserver(() => {
      resolvedAccent = getResolvedColor(accentColor);
      resolvedPeak = getResolvedColor(peakColor);
    });
    atmosphereObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-atmosphere", "data-physics", "class"],
    });

    // Band-averaging scheme. Log-scale from a minimum frequency up
    // to nyquist so low frequencies (where the interesting music
    // energy lives) get more resolution than the treble shelf.
    function computeBandEdges(binCount: number, bandCount: number): number[] {
      const edges: number[] = [];
      const minBin = 1;
      const maxBin = binCount - 1;
      const logMin = Math.log(minBin);
      const logMax = Math.log(maxBin);
      for (let i = 0; i <= bandCount; i++) {
        const t = i / bandCount;
        edges.push(Math.floor(Math.exp(logMin + (logMax - logMin) * t)));
      }
      return edges;
    }

    function drawBars(bandEnergies: Float32Array, peaks: Float32Array) {
      const w = canvas!.width;
      const h = canvas!.height;
      const barGap = Math.max(1, Math.floor(1 * dpr));
      const barWidth = Math.max(1, Math.floor((w - (bars + 1) * barGap) / bars));
      const inset = Math.floor((w - (barWidth * bars + barGap * (bars - 1))) / 2);

      ctx2d!.clearRect(0, 0, w, h);

      for (let i = 0; i < bars; i++) {
        const v = bandEnergies[i] ?? 0; // 0..1
        if (v <= 0.001) continue;

        const barH = v * h;
        const x = inset + i * (barWidth + barGap);
        const yTop = h - barH;

        // Main bar with a vertical gradient — darker at base,
        // bright at top. Single gradient per bar is fine: gradient
        // creation here is a canvas primitive, not a per-pixel op.
        const grad = ctx2d!.createLinearGradient(0, yTop, 0, h);
        grad.addColorStop(0, resolvedAccent);
        grad.addColorStop(
          1,
          mixRgba(resolvedAccent, 1 - gradientStrength),
        );
        ctx2d!.fillStyle = grad;
        ctx2d!.fillRect(x, yTop, barWidth, barH);

        // Peak cap — tracks the max of (live value, decayed peak)
        // so the top of each bar leaves a trailing "ceiling" that
        // falls back slowly. Classic Winamp look.
        const peakY = h - peaks[i]! * h - 2 * dpr;
        if (peaks[i]! > 0.02) {
          ctx2d!.fillStyle = resolvedPeak;
          ctx2d!.fillRect(x, peakY, barWidth, Math.max(1, Math.floor(1.5 * dpr)));
        }
      }
    }

    function isAudioReactiveEnabled(): boolean {
      const root = document.documentElement;
      if (root.classList.contains("audio-reactive-off")) return false;
      if (root.classList.contains("reduce-motion")) return false;
      return true;
    }

    function readMotionIntensity(): number {
      const raw = document.documentElement.style.getPropertyValue("--motion-intensity").trim();
      if (raw === "") return 1;
      const n = parseFloat(raw);
      if (!Number.isFinite(n) || n < 0) return 1;
      if (n > 1) return 1;
      return n;
    }

    function tick() {
      rafRef.current = requestAnimationFrame(tick);
      const analyser = getSharedAnalyser();
      if (!analyser) {
        // No graph yet (nothing's played). Decay peaks gracefully if
        // we have any lingering; otherwise idle with a clear canvas.
        if (peaksRef.current) {
          const peaks = peaksRef.current;
          const decay = 0.96;
          for (let i = 0; i < peaks.length; i++) peaks[i] *= decay;
        }
        if (bandsRef.current) {
          for (let i = 0; i < bandsRef.current.length; i++) bandsRef.current[i] = 0;
        }
        if (bandsRef.current && peaksRef.current) {
          drawBars(bandsRef.current, peaksRef.current);
        }
        return;
      }

      const binCount = analyser.frequencyBinCount;
      if (!bufRef.current || bufRef.current.length !== binCount) {
        bufRef.current = new Uint8Array(new ArrayBuffer(binCount));
        bandsRef.current = new Float32Array(bars);
        peaksRef.current = new Float32Array(bars);
      }
      const buf = bufRef.current;
      const bands = bandsRef.current!;
      const peaks = peaksRef.current!;
      const reactive = isAudioReactiveEnabled();

      if (!reactive) {
        // Hold whatever was last drawn; if the user just toggled the
        // setting mid-playback, this pins the visualizer at a
        // snapshot until they toggle it back on.
        return;
      }

      analyser.getByteFrequencyData(buf);

      const edges = computeBandEdges(binCount, bars);
      for (let i = 0; i < bars; i++) {
        const start = edges[i]!;
        const end = Math.max(start + 1, edges[i + 1]!);
        let sum = 0;
        for (let j = start; j < end; j++) sum += buf[j]!;
        const avg = sum / (end - start) / 255;
        bands[i] = avg;
        // Peak tracking — snap up to live value, decay by a
        // motion-intensity-scaled factor. Lower intensity = peaks
        // hang longer, higher = snappy.
        const intensity = readMotionIntensity();
        const decay = 0.94 + 0.05 * (1 - intensity); // 0.94..0.99
        peaks[i] = Math.max(avg, peaks[i] * decay);
      }

      drawBars(bands, peaks);
    }

    // One-shot paint under reduce-motion — a single snapshot at
    // mount so the surface reads "spectrum visualizer" rather than
    // a blank strip, but no RAF loop.
    if (document.documentElement.classList.contains("reduce-motion")) {
      const analyser = getSharedAnalyser();
      if (analyser) {
        const binCount = analyser.frequencyBinCount;
        const buf = new Uint8Array(new ArrayBuffer(binCount));
        analyser.getByteFrequencyData(buf);
        const bands = new Float32Array(bars);
        const peaks = new Float32Array(bars);
        const edges = computeBandEdges(binCount, bars);
        for (let i = 0; i < bars; i++) {
          const start = edges[i]!;
          const end = Math.max(start + 1, edges[i + 1]!);
          let sum = 0;
          for (let j = start; j < end; j++) sum += buf[j]!;
          const avg = sum / (end - start) / 255;
          bands[i] = avg;
          peaks[i] = avg;
        }
        drawBars(bands, peaks);
      }
      return () => {
        window.removeEventListener("resize", resize);
        atmosphereObserver.disconnect();
      };
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      atmosphereObserver.disconnect();
    };
  }, [bars, height, accentColor, peakColor, gradientStrength]);

  return (
    <div className={`audio-spectrum ${className}`} aria-hidden>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", display: "block", height: `${height}px` }}
      />
    </div>
  );
}

/**
 * Lighten/darken an rgb() string by mixing it toward black/white.
 * Used by the bar gradient so we don't need a second CSS variable
 * for the "bottom of bar" color. `strength` is 0–1; 0 returns the
 * original color, 1 returns pure black.
 */
function mixRgba(cssColor: string, strength: number): string {
  // Handles "rgb(r, g, b)" and "rgba(r, g, b, a)" — produced by
  // getComputedStyle's color resolution.
  const m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(cssColor);
  if (!m) return cssColor;
  const r = Math.round(parseInt(m[1]!, 10) * (1 - strength));
  const g = Math.round(parseInt(m[2]!, 10) * (1 - strength));
  const b = Math.round(parseInt(m[3]!, 10) * (1 - strength));
  return `rgb(${r}, ${g}, ${b})`;
}
