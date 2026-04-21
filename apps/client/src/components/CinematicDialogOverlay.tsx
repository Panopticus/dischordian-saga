/* ═══════════════════════════════════════════════════════
   CINEMATIC DIALOG OVERLAY — Bioware-style scene shell

   Composites a Kling-rendered looping mp4 behind the
   existing Awakening dialog chrome. When `videoUrl` is
   null (Kling render not yet produced), falls back to a
   static backdrop image so the Awakening flow never stalls.

   This component only provides the BACKDROP. The dialog
   itself — portrait, typewriter, choices — is rendered as
   `children` so AwakeningPage can keep using ElaraDialogBox
   unchanged.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Props {
  /** Rendered Kling Omni video URL for this step. Null → static fallback. */
  videoUrl: string | null;
  /** Static image to show while the video loads or if no video exists yet. */
  fallbackImageUrl: string;
  /** The dialog chrome — ElaraDialogBox, AttributeAllocator, etc. */
  children: React.ReactNode;
  /** Opacity of the backdrop (drives the existing screenOpacity ramp). */
  backdropOpacity?: number;
}

export default function CinematicDialogOverlay({
  videoUrl,
  fallbackImageUrl,
  children,
  backdropOpacity = 0.55,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Ensure autoplay succeeds after a mid-sequence source swap. Browsers
  // generally allow muted autoplay, but Safari sometimes needs a manual
  // .play() after changing src.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !videoUrl) return;
    const tryPlay = () => { v.play().catch(() => { /* muted will retry on gesture */ }); };
    tryPlay();
  }, [videoUrl]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Backdrop layer */}
      <motion.div
        key={videoUrl || fallbackImageUrl}
        initial={{ opacity: 0 }}
        animate={{ opacity: backdropOpacity }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            poster={fallbackImageUrl}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
        ) : (
          <img
            src={fallbackImageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Vignette + bottom darken for dialog readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/45 to-transparent pointer-events-none" />

        {/* Subtle scanlines — keeps the CRT/arcane texture consistent */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in oklch, var(--energy-primary) 25%, transparent) 2px, color-mix(in oklch, var(--energy-primary) 25%, transparent) 4px)",
          }}
        />
      </motion.div>

      {/* Dialog chrome — children pass through pointer events via their own handlers */}
      <div className="relative z-10 w-full h-full pointer-events-auto">
        {children}
      </div>
    </div>
  );
}
