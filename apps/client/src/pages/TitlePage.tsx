/**
 * TitlePage — The Dischordian Saga entry screen.
 * Shown to unauthenticated users. CRT sci-fi aesthetic
 * with Google sign-in. First thing anyone sees.
 */
import { useEffect, useRef, useState } from "react";
import { getGoogleLoginUrl, getDiscordLoginUrl, getGitHubLoginUrl } from "@/const";
import { KineticText } from "@/components/void";

const OPENING_MUSIC_SRC = "/audio/music/main-menu/the-enigmas-lament.mp3";

export default function TitlePage() {
  const [glitchText, setGlitchText] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [scanlineOffset, setScanlineOffset] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Opening music — try autoplay; if blocked by browser policy,
  // start on the first user interaction anywhere on the page.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.35;

    let started = false;
    const start = () => {
      if (started) return;
      const p = audio.play();
      if (p && typeof p.then === "function") {
        p.then(() => { started = true; }).catch(() => { /* will retry on next gesture */ });
      } else {
        started = true;
      }
    };

    start();

    const onGesture = () => {
      start();
      if (started) {
        window.removeEventListener("pointerdown", onGesture);
        window.removeEventListener("keydown", onGesture);
      }
    };
    window.addEventListener("pointerdown", onGesture);
    window.addEventListener("keydown", onGesture);

    return () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    // Stagger the reveal
    const t1 = setTimeout(() => setShowSubtitle(true), 1200);
    const t2 = setTimeout(() => setShowLogin(true), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Periodic glitch on title
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 150);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  // Slow scanline drift
  useEffect(() => {
    let raf: number;
    const tick = () => {
      setScanlineOffset(prev => (prev + 0.3) % 100);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const discordUrl = getDiscordLoginUrl();
  const githubUrl = getGitHubLoginUrl();

  const handleLogin = (url: string) => {
    window.location.href = url;
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        overflow: "hidden",
        zIndex: 9999,
      }}
    >
      <audio
        ref={audioRef}
        src={OPENING_MUSIC_SRC}
        loop
        preload="auto"
        autoPlay
      />
      {/* Background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/art/ui/title-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.45,
          filter: "brightness(0.7) contrast(1.1)",
        }}
      />
      {/* Scanlines overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 255, 0.015) 2px,
            rgba(0, 255, 255, 0.015) 4px
          )`,
          backgroundPosition: `0 ${scanlineOffset}px`,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 50%, color-mix(in oklch, var(--bg-void) 80%, transparent) 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 3, textAlign: "center", padding: "2rem" }}>
        {/* Intercepted signal indicator */}
        <div
          style={{
            color: "var(--energy-primary)",
            fontSize: "0.65rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: "2rem",
            opacity: 0.5,
          }}
        >
          <KineticText text="> INTERCEPTING SIGNAL... CLEARANCE: UNAUTHORIZED <" mode="decode" speed={30} showCursor={false} />
        </div>

        {/* Main logo + title */}
        <img
          src="/art/logos/dischordian-saga.png"
          alt=""
          style={{
            maxWidth: "min(400px, 80vw)",
            height: "auto",
            marginBottom: "0.75rem",
            filter: "drop-shadow(0 0 30px color-mix(in oklch, var(--energy-primary) 30%, transparent))",
          }}
        />
        <h1
          style={{
            fontSize: "clamp(2rem, 6vw, 4.5rem)",
            fontWeight: 900,
            letterSpacing: "0.08em",
            lineHeight: 1.1,
            color: glitchText ? "#ff3366" : "#ffffff",
            textShadow: glitchText
              ? "3px 0 #00ffff, -3px 0 #ff0066, 0 0 30px rgba(255,51,102,0.5)"
              : "0 0 40px color-mix(in oklch, var(--energy-primary) 30%, transparent), 0 0 80px color-mix(in oklch, var(--energy-primary) 10%, transparent)",
            transition: "all 0.05s ease",
            transform: glitchText ? "translateX(2px)" : "none",
            marginBottom: "0.5rem",
          }}
        >
          THE DISCHORDIAN
        </h1>
        <h1
          style={{
            fontSize: "clamp(2.5rem, 8vw, 6rem)",
            fontWeight: 900,
            letterSpacing: "0.15em",
            lineHeight: 1,
            color: "var(--energy-primary)",
            textShadow: "0 0 60px color-mix(in oklch, var(--energy-primary) 50%, transparent), 0 0 120px color-mix(in oklch, var(--energy-primary) 20%, transparent)",
            marginBottom: "1.5rem",
          }}
        >
          SAGA
        </h1>

        {/* Subtitle */}
        <div
          style={{
            opacity: showSubtitle ? 1 : 0,
            transform: showSubtitle ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.8s ease",
            marginBottom: "3rem",
          }}
        >
          <p
            style={{
              color: "color-mix(in oklch, var(--text-primary) 40%, transparent)",
              fontSize: "0.8rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            INCEPTION ARK VESSEL 1047 {'//'}  LOREDEX OS v2.0
          </p>
          <p
            style={{
              color: "color-mix(in oklch, var(--text-primary) 25%, transparent)",
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              marginTop: "0.5rem",
            }}
          >
            A MULTIMEDIA EXPERIENCE FROM THE FALL OF REALITY
          </p>
        </div>

        {/* Login button */}
        <div
          style={{
            opacity: showLogin ? 1 : 0,
            transform: showLogin ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
            {/* Google */}
            <button
              onClick={() => handleLogin(getGoogleLoginUrl())}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                width: "280px",
                padding: "0.875rem 2rem",
                background: "color-mix(in oklch, var(--energy-primary) 8%, transparent)",
                border: "1px solid color-mix(in oklch, var(--energy-primary) 30%, transparent)",
                borderRadius: "4px",
                color: "var(--energy-primary)",
                fontSize: "0.85rem",
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontFamily: "inherit",
                justifyContent: "center",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "color-mix(in oklch, var(--energy-primary) 15%, transparent)";
                e.currentTarget.style.borderColor = "color-mix(in oklch, var(--energy-primary) 60%, transparent)";
                e.currentTarget.style.boxShadow = "0 0 30px color-mix(in oklch, var(--energy-primary) 20%, transparent)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "color-mix(in oklch, var(--energy-primary) 8%, transparent)";
                e.currentTarget.style.borderColor = "color-mix(in oklch, var(--energy-primary) 30%, transparent)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="var(--energy-primary)" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="var(--energy-primary)" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="var(--energy-primary)" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="var(--energy-primary)" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              INITIALIZE WITH GOOGLE
            </button>

            {/* Discord */}
            {discordUrl && (
              <button
                onClick={() => handleLogin(discordUrl)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  width: "280px",
                  padding: "0.875rem 2rem",
                  background: "rgba(88, 101, 242, 0.08)",
                  border: "1px solid rgba(88, 101, 242, 0.3)",
                  borderRadius: "4px",
                  color: "#5865F2",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  fontFamily: "inherit",
                  justifyContent: "center",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(88, 101, 242, 0.15)";
                  e.currentTarget.style.borderColor = "rgba(88, 101, 242, 0.6)";
                  e.currentTarget.style.boxShadow = "0 0 30px rgba(88, 101, 242, 0.2)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(88, 101, 242, 0.08)";
                  e.currentTarget.style.borderColor = "rgba(88, 101, 242, 0.3)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#5865F2" d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
                </svg>
                INITIALIZE WITH DISCORD
              </button>
            )}

            {/* GitHub */}
            {githubUrl && (
              <button
                onClick={() => handleLogin(githubUrl)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  width: "280px",
                  padding: "0.875rem 2rem",
                  background: "color-mix(in oklch, var(--text-primary) 5%, transparent)",
                  border: "1px solid color-mix(in oklch, var(--text-primary) 20%, transparent)",
                  borderRadius: "4px",
                  color: "color-mix(in oklch, var(--text-primary) 80%, transparent)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  fontFamily: "inherit",
                  justifyContent: "center",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "color-mix(in oklch, var(--text-primary) 12%, transparent)";
                  e.currentTarget.style.borderColor = "color-mix(in oklch, var(--text-primary) 40%, transparent)";
                  e.currentTarget.style.boxShadow = "0 0 30px color-mix(in oklch, var(--text-primary) 10%, transparent)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "color-mix(in oklch, var(--text-primary) 5%, transparent)";
                  e.currentTarget.style.borderColor = "color-mix(in oklch, var(--text-primary) 20%, transparent)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="color-mix(in oklch, var(--text-primary) 80%, transparent)" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                INITIALIZE WITH GITHUB
              </button>
            )}
          </div>

          <p
            style={{
              color: "color-mix(in oklch, var(--text-primary) 20%, transparent)",
              fontSize: "0.6rem",
              marginTop: "1rem",
              letterSpacing: "0.1em",
            }}
          >
            SECURE AUTHENTICATION PROTOCOL {'//'}  NEURAL LINK REQUIRED
          </p>
        </div>

        {/* Bottom signal */}
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "color-mix(in oklch, var(--energy-primary) 30%, transparent)",
              fontSize: "0.55rem",
              letterSpacing: "0.2em",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--energy-primary)",
                boxShadow: "0 0 10px var(--energy-primary)",
                animation: "pulse-dot 2s ease-in-out infinite",
              }}
            />
            SIGNAL ACTIVE {'//'}  ARK 1047 STANDING BY
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
            <a href="/terms" style={{ color: "color-mix(in oklch, var(--energy-primary) 25%, transparent)", fontSize: "0.5rem", letterSpacing: "0.15em" }}>TERMS</a>
            <a href="/privacy" style={{ color: "color-mix(in oklch, var(--energy-primary) 25%, transparent)", fontSize: "0.5rem", letterSpacing: "0.15em" }}>PRIVACY</a>
          </div>
        </div>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
