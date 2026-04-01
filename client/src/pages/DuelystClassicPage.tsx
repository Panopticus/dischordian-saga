import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Maximize2, Minimize2, Volume2, VolumeX, Loader2 } from "lucide-react";

/**
 * DuelystClassicPage — Embeds the full Open Duelyst game (Cocos2d-HTML5)
 * as an iframe within the Loredex OS React application.
 *
 * The game itself runs at /duelyst-classic (served by Express as a standalone HTML page).
 * This React wrapper provides:
 * - Loading state with themed animation
 * - Fullscreen toggle
 * - Back navigation to the games hub
 * - Audio mute toggle
 */
export default function DuelystClassicPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  const toggleMute = () => {
    if (iframeRef.current?.contentWindow) {
      // Toggle audio in the iframe
      try {
        const iframeDoc = iframeRef.current.contentDocument;
        if (iframeDoc) {
          const audios = iframeDoc.querySelectorAll("audio");
          audios.forEach((a) => {
            a.muted = !isMuted;
          });
        }
      } catch {
        // Cross-origin restrictions may prevent this
      }
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/90 border-b border-primary/20 z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/games"
            className="flex items-center gap-2 text-primary/70 hover:text-primary transition-colors font-mono text-xs tracking-wider"
          >
            <ArrowLeft size={14} />
            LOREDEX OS
          </Link>
          <span className="text-border/50">|</span>
          <span className="font-display text-sm font-bold text-foreground tracking-wider">
            DUELYST <span className="text-primary">CLASSIC</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-1.5 rounded text-muted-foreground hover:text-primary transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded text-muted-foreground hover:text-primary transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Game container */}
      <div ref={containerRef} className="flex-1 relative bg-black">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20">
            <h1 className="font-display text-3xl font-black tracking-[0.3em] text-primary mb-4 glow-cyan">
              DUELYST
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs">
              <Loader2 size={14} className="animate-spin" />
              <span>INITIALIZING COCOS2D ENGINE...</span>
            </div>
            <div className="mt-6 w-48 h-1 bg-border/20 rounded-full overflow-hidden">
              <div className="h-full bg-primary/60 rounded-full animate-pulse" style={{ width: "60%" }} />
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src="/duelyst-classic"
          className="w-full h-full border-0"
          style={{ minHeight: "calc(100vh - 44px)" }}
          onLoad={() => setLoading(false)}
          allow="autoplay; fullscreen"
          title="Duelyst Classic"
        />
      </div>
    </div>
  );
}
