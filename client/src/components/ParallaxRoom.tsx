/* ═══════════════════════════════════════════════════════
   PARALLAX ROOM — Multi-layer depth effect for ship rooms

   Creates a parallax depth illusion from stacked image layers.
   Each layer shifts by a different amount based on input:
   - Desktop: mouse position within the container
   - Mobile: device orientation (gyroscope)

   Depth convention:
     depth > 0 — foreground (close objects, moves most)
     depth = 0 — middle ground (room itself, no movement)
     depth < 0 — background (distant/window, parallax inversion)

   Uses CSS transforms exclusively for GPU compositing
   (no layout repaints). Falls back gracefully when
   DeviceOrientationEvent is unavailable.

   Respects html.reduce-motion — disables all movement.

   Props:
     layers    — ordered array of { src, depth } image layers
     className — optional wrapper class
   ═══════════════════════════════════════════════════════ */

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type CSSProperties,
} from "react";

export interface ParallaxLayer {
  /** Image source URL */
  src: string;
  /** Depth factor: positive = foreground (moves more), negative = background (inverted) */
  depth: number;
}

interface ParallaxRoomProps {
  layers: ParallaxLayer[];
  className?: string;
}

/** Maximum pixel offset for the most extreme depth layer. */
const MAX_OFFSET = 15;

/** Check if the user has reduce-motion enabled. */
function isReducedMotion(): boolean {
  return document.documentElement.classList.contains("reduce-motion");
}

export default function ParallaxRoom({
  layers,
  className = "",
}: ParallaxRoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const [useGyroscope, setUseGyroscope] = useState(false);
  const [gyroAvailable, setGyroAvailable] = useState(false);

  // Detect mobile / gyroscope availability
  useEffect(() => {
    if (typeof DeviceOrientationEvent === "undefined") {
      setGyroAvailable(false);
      return;
    }

    // iOS 13+ requires permission
    const doeAny = DeviceOrientationEvent as any;
    if (typeof doeAny.requestPermission === "function") {
      // We'll request on first touch interaction
      setGyroAvailable(true);
      return;
    }

    // Test if events actually fire (some desktop browsers expose the API but never fire)
    let received = false;
    const testHandler = () => {
      received = true;
      setGyroAvailable(true);
      setUseGyroscope(true);
      window.removeEventListener("deviceorientation", testHandler);
    };
    window.addEventListener("deviceorientation", testHandler);

    // Give it a short window to fire
    const timeout = setTimeout(() => {
      if (!received) {
        window.removeEventListener("deviceorientation", testHandler);
        setGyroAvailable(false);
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("deviceorientation", testHandler);
    };
  }, []);

  // Request gyro permission on iOS (needs user gesture)
  const requestGyroPermission = useCallback(async () => {
    const doeAny = DeviceOrientationEvent as any;
    if (typeof doeAny.requestPermission === "function") {
      try {
        const result = await doeAny.requestPermission();
        if (result === "granted") {
          setUseGyroscope(true);
        }
      } catch {
        // Permission denied — fall back to no parallax on mobile
      }
    }
  }, []);

  // Apply transforms via CSS will-change for GPU compositing
  const applyTransforms = useCallback(() => {
    if (isReducedMotion()) {
      // Clear any existing transforms
      layerRefs.current.forEach((el) => {
        if (el) el.style.transform = "translate3d(0, 0, 0)";
      });
      return;
    }

    // Lerp current toward target for smooth motion
    const lerp = 0.08;
    currentRef.current.x +=
      (targetRef.current.x - currentRef.current.x) * lerp;
    currentRef.current.y +=
      (targetRef.current.y - currentRef.current.y) * lerp;

    const { x, y } = currentRef.current;

    layers.forEach((layer, i) => {
      const el = layerRefs.current[i];
      if (!el) return;

      // Depth factor determines direction and magnitude
      // Positive depth: moves WITH the input (foreground parallax)
      // Negative depth: moves AGAINST the input (background inversion)
      const factor = layer.depth;
      const tx = x * factor * MAX_OFFSET;
      const ty = y * factor * MAX_OFFSET;

      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });

    rafRef.current = requestAnimationFrame(applyTransforms);
  }, [layers]);

  // Mouse tracking (desktop)
  useEffect(() => {
    if (useGyroscope) return;

    const container = containerRef.current;
    if (!container) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      // Normalize to -1..1 range centered on the container
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetRef.current.x = nx;
      targetRef.current.y = ny;
    };

    const onMouseLeave = () => {
      // Smoothly return to center when mouse leaves
      targetRef.current.x = 0;
      targetRef.current.y = 0;
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [useGyroscope]);

  // Gyroscope tracking (mobile)
  useEffect(() => {
    if (!useGyroscope) return;

    const onOrientation = (e: DeviceOrientationEvent) => {
      // beta = front-back tilt (-180 to 180), gamma = left-right tilt (-90 to 90)
      const beta = e.beta ?? 0;
      const gamma = e.gamma ?? 0;

      // Normalize to -1..1 range. Typical holding range is beta 30-60, gamma -30 to 30
      const ny = Math.max(-1, Math.min(1, (beta - 45) / 30));
      const nx = Math.max(-1, Math.min(1, gamma / 30));

      targetRef.current.x = nx;
      targetRef.current.y = ny;
    };

    window.addEventListener("deviceorientation", onOrientation);

    return () => {
      window.removeEventListener("deviceorientation", onOrientation);
    };
  }, [useGyroscope]);

  // Animation loop
  useEffect(() => {
    rafRef.current = requestAnimationFrame(applyTransforms);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [applyTransforms]);

  // Handle iOS permission request on touch
  useEffect(() => {
    if (!gyroAvailable || useGyroscope) return;

    const container = containerRef.current;
    if (!container) return;

    const onTouch = () => {
      requestGyroPermission();
      container.removeEventListener("touchstart", onTouch);
    };

    container.addEventListener("touchstart", onTouch, { once: true });

    return () => {
      container.removeEventListener("touchstart", onTouch);
    };
  }, [gyroAvailable, useGyroscope, requestGyroPermission]);

  const containerStyle: CSSProperties = {
    position: "relative",
    overflow: "hidden",
    width: "100%",
    height: "100%",
  };

  const layerStyle = (index: number): CSSProperties => ({
    position: "absolute",
    inset: `-${MAX_OFFSET}px`,
    willChange: "transform",
    backgroundImage: `url(${layers[index]?.src})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    zIndex: index,
    transform: "translate3d(0, 0, 0)",
  });

  return (
    <div
      ref={containerRef}
      className={`parallax-room ${className}`}
      style={containerStyle}
    >
      {layers.map((layer, i) => (
        <div
          key={`${layer.src}-${i}`}
          ref={(el) => {
            layerRefs.current[i] = el;
          }}
          style={layerStyle(i)}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
