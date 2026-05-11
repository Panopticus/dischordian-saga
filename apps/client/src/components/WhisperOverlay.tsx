/* ═══════════════════════════════════════════════════════
   WhisperOverlay — ambient pre-Beat-H Human whispers

   Renders the next eligible whisper from useHumanWhispers as a
   subtle, dim fragment near the bottom of the viewport. Plays
   the matching VO via useHumanVO when available; falls back to
   text-only when the manifest entry has no audio yet.

   Visual register intentionally subdued — italic, low contrast,
   monospace. The whisper should feel like it leaked through
   rather than being announced. No close button; auto-dismisses
   after a short hold so the player's hands stay free for the
   room they are exploring.

   Suppression rules:
     - When `suppressed` is true (Elara conversation popup is
       active, a cutscene is playing, etc.) the overlay renders
       nothing. The hook also refuses to surface a whisper while
       suppressed, so the dismiss timer never starts.
     - Once human_life_detective_seen flips, the hook returns
       null forever — the overlay is harmless on the Beat-H+
       client because it simply never renders.
   ═══════════════════════════════════════════════════════ */

import { useEffect, type ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useHumanWhispers } from "@/hooks/useHumanWhispers";
import { useHumanVO } from "@/hooks/useHumanVO";

const WHISPER_HOLD_MS = 5200;

interface WhisperOverlayProps {
  /** When true, the overlay renders nothing and the hook does
   *  not surface a new whisper. Wire from the host's "is an
   *  Elara/conversation popup currently open" boolean. */
  suppressed: boolean;
}

export function WhisperOverlay({ suppressed }: WhisperOverlayProps): ReactElement | null {
  const { whisper, dismiss } = useHumanWhispers(suppressed);
  const { speak, stop } = useHumanVO();

  // Fire VO + start the auto-dismiss timer whenever a fresh
  // whisper becomes available. The hook clears `whisper` on
  // dismiss, which unmounts the inner block via AnimatePresence
  // and stops the audio cleanly.
  useEffect(() => {
    if (!whisper) return;
    speak(whisper.voId);
    const timer = window.setTimeout(() => {
      dismiss();
    }, WHISPER_HOLD_MS);
    return () => {
      window.clearTimeout(timer);
      stop();
    };
  }, [whisper, speak, stop, dismiss]);

  // The overlay is permanently silent post-Beat-H or during
  // suppression — render nothing rather than an empty wrapper
  // so the layout tree stays clean.
  if (suppressed) return null;

  return (
    <AnimatePresence>
      {whisper && (
        <motion.div
          data-testid="whisper-overlay"
          data-whisper-id={whisper.id}
          data-whisper-era={whisper.era}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.72, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="pointer-events-none fixed bottom-24 left-1/2 z-30 -translate-x-1/2 px-6"
          aria-hidden="true"
        >
          <p
            className="whisper-line font-mono text-sm italic lowercase tracking-wide text-slate-300/80"
            style={{ textShadow: "0 0 12px rgba(120, 100, 160, 0.35)" }}
          >
            {whisper.text}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default WhisperOverlay;
