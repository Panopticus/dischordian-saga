/**
 * TitlePage — The Dischordian Saga entry screen.
 * Shown to unauthenticated users. CRT sci-fi aesthetic
 * with Google sign-in. First thing anyone sees.
 */
import { useEffect, useState } from "react";
import { getLoginUrl } from "@/const";

export default function TitlePage() {
  const [glitchText, setGlitchText] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [scanlineOffset, setScanlineOffset] = useState(0);

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

  const handleLogin = () => {
    window.location.href = getLoginUrl();
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
      {/* Background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/title-bg.jpg)",
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
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.8) 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 3, textAlign: "center", padding: "2rem" }}>
        {/* Intercepted signal indicator */}
        <div
          style={{
            color: "#33E2E6",
            fontSize: "0.65rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: "2rem",
            opacity: 0.5,
          }}
        >
          {'>'} INTERCEPTING SIGNAL... CLEARANCE: UNAUTHORIZED {'<'}
        </div>

        {/* Main title */}
        <h1
          style={{
            fontSize: "clamp(2rem, 6vw, 4.5rem)",
            fontWeight: 900,
            letterSpacing: "0.08em",
            lineHeight: 1.1,
            color: glitchText ? "#ff3366" : "#ffffff",
            textShadow: glitchText
              ? "3px 0 #00ffff, -3px 0 #ff0066, 0 0 30px rgba(255,51,102,0.5)"
              : "0 0 40px rgba(51, 226, 230, 0.3), 0 0 80px rgba(51, 226, 230, 0.1)",
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
            color: "#33E2E6",
            textShadow: "0 0 60px rgba(51, 226, 230, 0.5), 0 0 120px rgba(51, 226, 230, 0.2)",
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
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.8rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            INCEPTION ARK VESSEL 1047 {'//'}  LOREDEX OS v2.0
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.25)",
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              marginTop: "0.5rem",
            }}
          >
            A TRANSMEDIA EXPERIENCE FROM THE FALL OF REALITY
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
          <button
            onClick={handleLogin}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              margin: "0 auto",
              padding: "0.875rem 2rem",
              background: "rgba(51, 226, 230, 0.08)",
              border: "1px solid rgba(51, 226, 230, 0.3)",
              borderRadius: "4px",
              color: "#33E2E6",
              fontSize: "0.85rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontFamily: "inherit",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(51, 226, 230, 0.15)";
              e.currentTarget.style.borderColor = "rgba(51, 226, 230, 0.6)";
              e.currentTarget.style.boxShadow = "0 0 30px rgba(51, 226, 230, 0.2)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(51, 226, 230, 0.08)";
              e.currentTarget.style.borderColor = "rgba(51, 226, 230, 0.3)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Google G icon */}
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#33E2E6"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#33E2E6"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#33E2E6"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#33E2E6"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            INITIALIZE WITH GOOGLE
          </button>

          <p
            style={{
              color: "rgba(255,255,255,0.2)",
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
              color: "rgba(51, 226, 230, 0.3)",
              fontSize: "0.55rem",
              letterSpacing: "0.2em",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#33E2E6",
                boxShadow: "0 0 10px #33E2E6",
                animation: "pulse-dot 2s ease-in-out infinite",
              }}
            />
            SIGNAL ACTIVE {'//'}  ARK 1047 STANDING BY
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
