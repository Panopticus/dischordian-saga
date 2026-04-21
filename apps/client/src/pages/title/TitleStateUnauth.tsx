/* ═══════════════════════════════════════════════════════
   TitleStateUnauth — "CoNEXUS HANDSHAKE REQUIRED"

   Renders the existing OAuth entry (Google / Discord /
   GitHub) inside the reworked in-world frame. Logic is
   lifted from the original TitlePage.tsx; the parent now
   owns the shared chrome (scanlines, music, ticker).
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef } from "react";

import { getGoogleLoginUrl, getDiscordLoginUrl, getGitHubLoginUrl } from "@/const";
import { KineticText } from "@/components/void";

import type { TitleTheme } from "./themes";

interface TitleStateUnauthProps {
  theme: TitleTheme;
  showLogin: boolean;
  /** Called after the OAuth popup reports success, so the parent can
   *  refetch `auth.me` without a page navigation. */
  onAuthSuccess?: () => void;
}

export function TitleStateUnauth({ theme, showLogin, onAuthSuccess }: TitleStateUnauthProps) {
  const discordUrl = getDiscordLoginUrl();
  const githubUrl = getGitHubLoginUrl();
  const popupRef = useRef<Window | null>(null);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const data = e.data as { type?: string } | null;
      if (data?.type !== "oauth:success") return;
      try { popupRef.current?.close(); } catch { /* ignore */ }
      popupRef.current = null;
      onAuthSuccess?.();
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onAuthSuccess]);

  const go = (url: string) => {
    // Try a popup first so the title page (and its opening music) keeps
    // playing in the background. If the browser blocks the popup, fall
    // back to the legacy full-page redirect.
    const w = 520;
    const h = 640;
    const y = window.top?.outerHeight
      ? Math.max(0, (window.top.outerHeight - h) / 2 + (window.top.screenY ?? 0))
      : 0;
    const x = window.top?.outerWidth
      ? Math.max(0, (window.top.outerWidth - w) / 2 + (window.top.screenX ?? 0))
      : 0;
    const features = `width=${w},height=${h},left=${x},top=${y},resizable,scrollbars=yes`;
    const popup = window.open(url, "dischordia_oauth", features);
    if (!popup) {
      window.location.href = url;
      return;
    }
    popupRef.current = popup;
    popup.focus();
  };

  return (
    <>
      <div
        style={{
          color: theme.palette.accent,
          fontSize: "0.65rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          marginBottom: "2rem",
          opacity: 0.55,
        }}
      >
        <KineticText
          text="> CoNEXUS HANDSHAKE REQUIRED — CLEARANCE: NONE <"
          mode="decode"
          speed={30}
          showCursor={false}
        />
      </div>

      <p
        style={{
          color: "rgba(255,255,255,0.55)",
          fontSize: "0.8rem",
          letterSpacing: "0.12em",
          marginBottom: "2rem",
          fontStyle: "italic",
        }}
      >
        An unidentified consciousness is attempting contact.
      </p>

      <div
        style={{
          opacity: showLogin ? 1 : 0,
          transform: showLogin ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.6s ease",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          alignItems: "center",
        }}
      >
        <LoginButton
          label="INITIALIZE WITH GOOGLE"
          accent={theme.palette.accent}
          onClick={() => go(getGoogleLoginUrl())}
          icon={<GoogleGlyph color={theme.palette.accent} />}
        />
        {discordUrl && (
          <LoginButton
            label="INITIALIZE WITH DISCORD"
            accent="#5865F2"
            onClick={() => go(discordUrl)}
            icon={<DiscordGlyph />}
          />
        )}
        {githubUrl && (
          <LoginButton
            label="INITIALIZE WITH GITHUB"
            accent="rgba(255,255,255,0.8)"
            onClick={() => go(githubUrl)}
            icon={<GithubGlyph />}
          />
        )}

        <p
          style={{
            color: "rgba(255,255,255,0.35)",
            fontSize: "0.6rem",
            marginTop: "1rem",
            letterSpacing: "0.1em",
          }}
        >
          SECURE AUTHENTICATION PROTOCOL // NEURAL LINK REQUIRED
        </p>
      </div>
    </>
  );
}

function LoginButton({
  label,
  accent,
  onClick,
  icon,
}: {
  label: string;
  accent: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        width: "280px",
        padding: "0.875rem 2rem",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${accent}55`,
        borderRadius: "4px",
        color: accent,
        fontSize: "0.85rem",
        fontWeight: 600,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all 0.3s ease",
        fontFamily: "inherit",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = `${accent}22`;
        e.currentTarget.style.borderColor = `${accent}88`;
        e.currentTarget.style.boxShadow = `0 0 30px ${accent}44`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.borderColor = `${accent}55`;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function GoogleGlyph({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill={color} d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill={color} d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill={color} d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill={color} d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function DiscordGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#5865F2" d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
    </svg>
  );
}

function GithubGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="rgba(255,255,255,0.8)" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
