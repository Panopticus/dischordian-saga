/* ═══════════════════════════════════════════════════════
   OPENING CINEMATIC VIDEO

   Fullscreen MP4 player for AAA opening cinematics (Welcome
   to Celebration, Mechronis Academy). Sibling of
   `SongCinematicVideo` but plays the video's own audio track
   (these cinematics arrive with baked-in score + VO; no
   separate music bed to ride underneath).

   Used by:
     • HellboxPortalPage  — chained after the compelled
       prose cinematic; lands the player on the rampart.
     • MatrixSchoolEpisodePage — first-visit gate on
       Mechronis episodes, before the cohort dialogue runs.
   ═══════════════════════════════════════════════════════ */
import { useRef, useState } from "react";
import { motion } from "framer-motion";

export interface OpeningCinematicVideoProps {
  /** The cinematic MP4 URL — required. */
  videoUrl: string;
  /** Allow the viewer to dismiss early. Defaults to true. */
  dismissible?: boolean;
  /** Fired on natural end, dismiss, or unrecoverable video error. */
  onEnd?: () => void;
}

export default function OpeningCinematicVideo({
  videoUrl,
  dismissible = true,
  onEnd,
}: OpeningCinematicVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const finish = () => {
    if (dismissed) return;
    setDismissed(true);
    onEnd?.();
  };

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      onClick={dismissible ? finish : undefined}
      role="dialog"
      aria-label="Opening cinematic"
    >
      {dismissible && (
        <div className="absolute top-4 right-4 z-10">
          <span className="font-mono text-[10px] text-white/30 uppercase tracking-wider">
            tap to skip
          </span>
        </div>
      )}

      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay
        playsInline
        onEnded={finish}
        onError={finish}
        className="absolute inset-0 w-full h-full object-contain"
      />
    </motion.div>
  );
}
