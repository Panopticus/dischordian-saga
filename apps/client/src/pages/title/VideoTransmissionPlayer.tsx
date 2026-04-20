/* ═══════════════════════════════════════════════════════
   VIDEO TRANSMISSION PLAYER — CRT-bezel pop-out viewer

   Renders an in-world player frame around an HTML5 video
   element. Supports three modes:

     - Inline (default): mounted over the title page with
       a centered modal-style frame.
     - PiP (Chrome/Edge/Firefox): native
       requestPictureInPicture when the user clicks the
       pop-out chip. The modal dismisses; the browser
       renders the PiP overlay.
     - Floating fallback: for engines without the PiP API
       (Safari, most mobile) the frame switches to a
       small draggable CSS-positioned window anchored in
       the lower-right.

   Audio ducks the title music by calling the existing
   GameAudioContext ducking API so VO/music share the
   same duck path.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useRef, useState } from "react";

import { useGameAudio } from "@/contexts/GameAudioContext";

import type { AnnouncementRow } from "./types";

interface VideoTransmissionPlayerProps {
  announcement: AnnouncementRow;
  /** Signal strength bars (1–5). Defaults to 4. Decorative only. */
  strength?: number;
  /** Fired when the user closes the player. */
  onClose: () => void;
  /** Fired when the user manually dismisses (separate from close). */
  onDismiss?: () => void;
  /** When true, a brief "INCOMING TRANSMISSION..." teaser plays
   *  before the player materialises. Used by auto-intercept. */
  playTeaser?: boolean;
}

type Mode = "inline" | "pip" | "floating";

export function VideoTransmissionPlayer({
  announcement,
  strength = 4,
  onClose,
  onDismiss,
  playTeaser = false,
}: VideoTransmissionPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { duckForElara, unduckForElara } = useGameAudio();

  const [mode, setMode] = useState<Mode>("inline");
  const [teaserVisible, setTeaserVisible] = useState(playTeaser);
  const [playerVisible, setPlayerVisible] = useState(!playTeaser);

  // Teaser → player handoff
  useEffect(() => {
    if (!playTeaser) return;
    const t = setTimeout(() => {
      setTeaserVisible(false);
      setPlayerVisible(true);
    }, 2000);
    return () => clearTimeout(t);
  }, [playTeaser]);

  // Duck title music while the player is visible
  useEffect(() => {
    if (!playerVisible) return;
    duckForElara();
    return () => { unduckForElara(); };
  }, [playerVisible, duckForElara, unduckForElara]);

  // Try to autoplay the video when it becomes visible
  useEffect(() => {
    if (!playerVisible) return;
    const v = videoRef.current;
    if (!v) return;
    const p = v.play();
    if (p && typeof p.then === "function") {
      p.catch(() => { /* autoplay blocked — user can click ▶ */ });
    }
  }, [playerVisible]);

  const handlePopOut = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    if (
      "requestPictureInPicture" in v &&
      typeof (v as HTMLVideoElement).requestPictureInPicture === "function"
    ) {
      try {
        await v.requestPictureInPicture();
        setMode("pip");
        // Close the modal frame — the browser's PiP overlay takes over.
        setPlayerVisible(false);
      } catch {
        setMode("floating");
      }
    } else {
      setMode("floating");
    }
  }, []);

  const handleClose = useCallback(async () => {
    const v = videoRef.current;
    if (v && document.pictureInPictureElement === v) {
      try { await document.exitPictureInPicture(); } catch { /* ignore */ }
    }
    if (onDismiss) onDismiss();
    onClose();
  }, [onClose, onDismiss]);

  if (!announcement.videoUrl) return null;

  // Teaser overlay
  if (teaserVisible) {
    return (
      <div
        aria-live="assertive"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.35)",
          pointerEvents: "none",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        }}
      >
        <div
          style={{
            color: "#FF3C40",
            fontSize: "0.75rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            animation: "transmission-blink 0.6s steps(2) 3",
            textShadow: "0 0 30px rgba(255,60,64,0.8)",
          }}
        >
          &gt; INCOMING TRANSMISSION... &lt;
        </div>
        <style>{`
          @keyframes transmission-blink {
            0%, 49%   { opacity: 1; }
            50%, 100% { opacity: 0.25; }
          }
          @media (prefers-reduced-motion: reduce) {
            [aria-live="assertive"] > div { animation: none !important; }
          }
        `}</style>
      </div>
    );
  }

  const frameStyle =
    mode === "floating"
      ? floatingFrame
      : inlineFrame;

  if (!playerVisible) return null;

  return (
    <div
      role="dialog"
      aria-label="Video transmission"
      aria-modal={mode === "inline"}
      style={frameStyle}
    >
      <div style={bezel}>
        {/* LED + header bar */}
        <div style={header}>
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#FF3C40",
              boxShadow: "0 0 10px #FF3C40",
              marginRight: "0.75rem",
            }}
            aria-hidden
          />
          <span style={{ flex: 1, textAlign: "left" }}>
            &gt; INCOMING TRANSMISSION // SRC: {announcement.slug.toUpperCase()} // STRENGTH: {bars(strength)} &lt;
          </span>
          <button
            type="button"
            onClick={handlePopOut}
            aria-label="Pop out to floating player"
            style={chipBtn}
            title="Pop out"
          >
            ⇱ POP OUT
          </button>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Sever feed"
            style={{ ...chipBtn, color: "#FF9999" }}
            title="Sever feed"
          >
            ⊗ SEVER FEED
          </button>
        </div>

        {/* Video surface */}
        <div style={videoWell}>
          <video
            ref={videoRef}
            src={announcement.videoUrl}
            poster={announcement.videoPosterUrl ?? undefined}
            controls
            playsInline
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              background: "#000",
              filter: "url(#transmissionVhs)",
            }}
          />
          {/* SVG filter for mild VHS chromatic aberration */}
          <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
            <defs>
              <filter id="transmissionVhs">
                <feColorMatrix
                  type="matrix"
                  values="1 0 0 0 0.02  0 1 0 0 0  0 0 1 0 -0.02  0 0 0 1 0"
                />
              </filter>
            </defs>
          </svg>
          {/* Scanline overlay */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 3px)",
              mixBlendMode: "overlay",
            }}
          />
        </div>

        {/* Caption */}
        <div style={caption}>
          <div style={{ fontWeight: 700, letterSpacing: "0.12em", marginBottom: "0.3rem" }}>
            {announcement.title}
          </div>
          {announcement.body && (
            <div style={{ fontSize: "0.7rem", opacity: 0.75 }}>{announcement.body}</div>
          )}
        </div>
      </div>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          [role="dialog"][aria-label="Video transmission"] {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function bars(n: number): string {
  const filled = Math.max(0, Math.min(5, Math.round(n)));
  return "▮".repeat(filled) + "▯".repeat(5 - filled);
}

/* ─── Styles ─── */

const inlineFrame: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 9200,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0,0,0,0.65)",
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  padding: "2rem",
};

const floatingFrame: React.CSSProperties = {
  position: "fixed",
  bottom: "2rem",
  right: "2rem",
  width: "min(380px, 90vw)",
  zIndex: 9200,
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
};

const bezel: React.CSSProperties = {
  width: "100%",
  maxWidth: "min(820px, 100%)",
  background: "#070709",
  border: "1px solid #33E2E6",
  borderRadius: "6px",
  boxShadow: "0 0 60px rgba(51, 226, 230, 0.15), inset 0 0 30px rgba(0,0,0,0.6)",
  padding: "14px",
  position: "relative",
};

const header: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  color: "#33E2E6",
  fontSize: "0.6rem",
  letterSpacing: "0.18em",
  marginBottom: "8px",
  fontFamily: "inherit",
};

const chipBtn: React.CSSProperties = {
  marginLeft: "0.5rem",
  background: "transparent",
  color: "#33E2E6",
  border: "1px solid rgba(51, 226, 230, 0.4)",
  borderRadius: "3px",
  padding: "4px 10px",
  fontSize: "0.55rem",
  letterSpacing: "0.15em",
  cursor: "pointer",
  fontFamily: "inherit",
};

const videoWell: React.CSSProperties = {
  position: "relative",
  width: "100%",
  aspectRatio: "16 / 9",
  background: "#000",
  overflow: "hidden",
  borderRadius: "3px",
};

const caption: React.CSSProperties = {
  padding: "10px 4px 2px",
  color: "#fff",
  fontSize: "0.8rem",
  letterSpacing: "0.08em",
};
