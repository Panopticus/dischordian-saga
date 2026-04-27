/* ═══════════════════════════════════════════════════════
   LOTTIE SPINNER — Lottie-first loading indicator with a
   styled CSS fallback.

   Unifies loading UI across the app. Every page that used to
   render <Loader2 className="animate-spin" /> gets a
   consistent branded spinner that upgrades to a Lottie
   animation the moment the authored JSON lands at
   /art/lottie/spinner.json. Until then, callers see the
   void-cyan rotating ring fallback — still better-looking
   than the generic lucide spinner because it matches the
   Void Energy token palette.

   Why a dedicated component instead of LottiePlayer
   inline? Loading states are the highest-frequency UI
   chrome in the app; consolidating their styling into
   one place lets art land in a single location
   (/art/lottie/spinner.json) and every tab / query /
   modal picks it up without a code sweep.
   ═══════════════════════════════════════════════════════ */
import LottiePlayer from "@/components/LottiePlayer";

interface LottieSpinnerProps {
  /** Visual size in px. Defaults to 24 to match Loader2's default. */
  size?: number;
  /** CSS color for the fallback ring. Falls back to the neon cyan token. */
  accentColor?: string;
  /** Pass-through className on the wrapping span. */
  className?: string;
}

export default function LottieSpinner({
  size = 24,
  accentColor = "var(--neon-cyan)",
  className = "",
}: LottieSpinnerProps) {
  return (
    <LottiePlayer
      src="/art/lottie/spinner.json"
      loop
      autoplay
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      fallback={
        <span
          aria-label="Loading"
          role="status"
          className={`inline-block rounded-full animate-spin ${className}`}
          style={{
            width: size,
            height: size,
            // Thick arc on the accent color, 75% gap — reads as a
            // proper branded ring rather than Lucide's pencil-thin
            // default. Matches the visual weight the docked audio
            // spectrum and other loading states use.
            border: `${Math.max(2, Math.round(size / 10))}px solid color-mix(in oklch, ${accentColor} 18%, transparent)`,
            borderTopColor: accentColor,
            boxShadow: `0 0 ${Math.round(size / 2)}px color-mix(in oklch, ${accentColor} 22%, transparent)`,
          }}
        />
      }
    />
  );
}
