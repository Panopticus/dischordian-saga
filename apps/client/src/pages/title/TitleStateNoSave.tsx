/* ═══════════════════════════════════════════════════════
   TitleStateNoSave — "NEW CONSCIOUSNESS DETECTED"

   Authenticated user, no character on file. RECONNECT is
   visibly disabled; ESTABLISH NEW CONNECTION is primary.
   Clicking it dismisses the title and lets AuthGate drop
   into the Awakening sequence (FIRST_VISIT phase).
   ═══════════════════════════════════════════════════════ */
import { KineticText } from "@/components/void";

import type { TitleTheme } from "./themes";

interface TitleStateNoSaveProps {
  theme: TitleTheme;
  displayName: string;
  neuralSignature: string;
  onBeginNewGame: () => void;
}

export function TitleStateNoSave({
  theme,
  displayName,
  neuralSignature,
  onBeginNewGame,
}: TitleStateNoSaveProps) {
  return (
    <>
      <div
        style={{
          color: theme.palette.accent,
          fontSize: "0.65rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          marginBottom: "2rem",
          opacity: 0.6,
        }}
      >
        <KineticText
          text="> NEW CONSCIOUSNESS DETECTED — CRYO BAY 1047-C RESERVED <"
          mode="decode"
          speed={30}
          showCursor={false}
        />
      </div>

      <IdentityCard
        theme={theme}
        displayName={displayName}
        subline={`NEURAL SIGNATURE: ${neuralSignature}`}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center", marginTop: "2rem" }}>
        <button
          type="button"
          disabled
          aria-disabled="true"
          style={{
            width: "320px",
            padding: "0.9rem 2rem",
            background: "rgba(120,120,120,0.05)",
            border: "1px solid rgba(120,120,120,0.25)",
            borderRadius: "4px",
            color: "rgba(200,200,200,0.35)",
            fontSize: "0.8rem",
            letterSpacing: "0.18em",
            fontFamily: "inherit",
            cursor: "not-allowed",
          }}
        >
          ⊘ RECONNECT — NO MEMORY STATE FOUND
        </button>

        <button
          type="button"
          onClick={onBeginNewGame}
          autoFocus
          style={{
            width: "320px",
            padding: "0.95rem 2rem",
            background: `${theme.palette.accent}1a`,
            border: `1px solid ${theme.palette.accent}`,
            borderRadius: "4px",
            color: theme.palette.accent,
            fontSize: "0.85rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            fontFamily: "inherit",
            cursor: "pointer",
            boxShadow: `0 0 30px ${theme.palette.accent}33`,
            animation: "nosave-pulse 2.2s ease-in-out infinite",
          }}
        >
          ▶ ESTABLISH NEW CONNECTION
        </button>
      </div>

      <style>{`
        @keyframes nosave-pulse {
          0%, 100% { box-shadow: 0 0 30px ${theme.palette.accent}33; }
          50%      { box-shadow: 0 0 45px ${theme.palette.accent}66; }
        }
        @media (prefers-reduced-motion: reduce) {
          [autofocus] { animation: none !important; }
        }
      `}</style>
    </>
  );
}

function IdentityCard({
  theme,
  displayName,
  subline,
}: {
  theme: TitleTheme;
  displayName: string;
  subline: string;
}) {
  return (
    <div
      style={{
        border: `1px solid ${theme.palette.accent}44`,
        background: "rgba(0,0,0,0.45)",
        padding: "0.9rem 1.4rem",
        borderRadius: "4px",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.25rem",
        minWidth: "320px",
      }}
    >
      <div
        style={{
          color: "#fff",
          fontSize: "0.95rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
        }}
      >
        {displayName || "UNREGISTERED OPERATOR"}
      </div>
      <div
        style={{
          color: theme.palette.accent,
          opacity: 0.6,
          fontSize: "0.55rem",
          letterSpacing: "0.22em",
        }}
      >
        {subline}
      </div>
    </div>
  );
}
