/* ═══════════════════════════════════════════════════════
   LOTTIE PLAYER — thin wrapper around lottie-react

   Until now the app carried zero Lottie coverage; every UI
   flourish was CSS or framer-motion. This component adds
   the runtime so when authored `.json` animations land
   (achievement tier flourish, currency bursts, level-up
   celebration, loading spinners) they drop in as one-line
   swaps without each consumer re-implementing fetch +
   lifecycle + a11y gating.

   Three load modes:
     1. `data={animationDataObject}`  — inline JSON, zero fetch.
        Use for small/animations bundled with the component.
     2. `src={"/art/lottie/foo.json"}` — fetches + caches once.
        Preferred for large animations authored as static assets.
     3. `fallback={<ReactNode>}`       — rendered while src is
        loading, or permanently if src 404s. Lets consumers
        graceful-degrade to existing CSS animations.

   Accessibility:
     - `html.reduce-motion` pauses at frame 0 (static poster).
     - `onComplete` fires once per iteration when loop=false.
     - `aria-hidden` forced true — Lottie animations are
       decorative; screen readers ignore them.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef, useState, type ReactNode } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";

interface LottiePlayerProps {
  /** Inline animation data (precedence over `src` when both are set). */
  data?: object;
  /** URL to a Lottie JSON file. Fetched on mount, cached module-level. */
  src?: string;
  /** Rendered while `src` is loading, or if it fails. Lets callers degrade
   *  gracefully to an existing CSS animation without a second component. */
  fallback?: ReactNode;
  /** Loop forever (default true). */
  loop?: boolean;
  /** Autoplay on mount (default true). Ignored under reduce-motion. */
  autoplay?: boolean;
  /** Playback speed multiplier. Default 1. */
  speed?: number;
  /** Fires once per playthrough when loop=false. */
  onComplete?: () => void;
  /** Pass-through class on the wrapper div. */
  className?: string;
  /** Pass-through inline style. */
  style?: React.CSSProperties;
}

/**
 * Module-level cache so the same URL isn't fetched twice when a
 * page renders multiple Lottie players (e.g. 4 achievement flourishes
 * in a unlock streak). Keyed by URL.
 */
const fetchCache = new Map<string, Promise<object | null>>();
function fetchLottieJson(src: string): Promise<object | null> {
  const existing = fetchCache.get(src);
  if (existing) return existing;
  const req = fetch(src)
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);
  fetchCache.set(src, req);
  return req;
}

export default function LottiePlayer({
  data,
  src,
  fallback = null,
  loop = true,
  autoplay = true,
  speed = 1,
  onComplete,
  className,
  style,
}: LottiePlayerProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [fetched, setFetched] = useState<object | null>(null);
  const [fetchFailed, setFetchFailed] = useState(false);

  useEffect(() => {
    if (data || !src) return;
    let cancelled = false;
    fetchLottieJson(src).then((json) => {
      if (cancelled) return;
      if (json) setFetched(json);
      else setFetchFailed(true);
    });
    return () => {
      cancelled = true;
    };
  }, [data, src]);

  // Apply speed after mount — lottie-react exposes setSpeed on the
  // ref handle, not as a prop we can pass declaratively.
  useEffect(() => {
    lottieRef.current?.setSpeed(speed);
  }, [speed, fetched]);

  // Under html.reduce-motion we hold at frame 0 so players who opt
  // into reduced motion still see the animation's intended poster
  // frame, not an empty box. Cheaper than removing the component
  // entirely (call-site layout stays the same).
  useEffect(() => {
    const root = document.documentElement;
    const check = () => {
      if (root.classList.contains("reduce-motion")) {
        lottieRef.current?.goToAndStop(0, true);
      }
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [fetched]);

  const animationData = data ?? fetched;

  if (!animationData) {
    // Either src is still loading or it failed. `fallback` lets the
    // caller render an existing CSS animation / icon / skeleton in
    // the same slot so layout doesn't pop when the Lottie arrives.
    if (fetchFailed && fallback) return <>{fallback}</>;
    return <>{fallback}</>;
  }

  return (
    <div className={className} style={style} aria-hidden>
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        onComplete={onComplete}
      />
    </div>
  );
}
