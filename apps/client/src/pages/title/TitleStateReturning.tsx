/* ═══════════════════════════════════════════════════════
   TitleStateReturning — "IDENTITY RECOGNIZED"

   Authed user with a save. RECONNECT is primary and
   auto-focused so the first keypress (Enter/Space) fires
   it — part of the 1.5s threshold beat design.
   ═══════════════════════════════════════════════════════ */
import { KineticText } from "@/components/void";

import type { TitleTheme } from "./themes";

interface TitleStateReturningProps {
  theme: TitleTheme;
  displayName: string;
  lastRoomLabel: string;
  lastSessionLabel: string;
  actLabel: string;
  onReconnect: () => void;
  onResetRequested: () => void;
}

export function TitleStateReturning({
  theme,
  displayName,
  lastRoomLabel,
  lastSessionLabel,
  actLabel,
  onReconnect,
  onResetRequested,
}: TitleStateReturningProps) {
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
          text="> IDENTITY RECOGNIZED — WELCOME BACK, OPERATOR <"
          mode="decode"
          speed={30}
          showCursor={false}
        />
      </div>

      <ReturningIdentityCard
        theme={theme}
        displayName={displayName}
        lastRoomLabel={lastRoomLabel}
        lastSessionLabel={lastSessionLabel}
        actLabel={actLabel}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          alignItems: "center",
          marginTop: "2rem",
        }}
      >
        <button
          type="button"
          autoFocus
          onClick={onReconnect}
          style={{
            width: "320px",
            padding: "1rem 2rem",
            background: `${theme.palette.accent}26`,
            border: `1px solid ${theme.palette.accent}`,
            borderRadius: "4px",
            color: theme.palette.accent,
            fontSize: "0.9rem",
            fontWeight: 800,
            letterSpacing: "0.22em",
            fontFamily: "inherit",
            cursor: "pointer",
            boxShadow: `0 0 40px ${theme.palette.accent}55`,
          }}
        >
          ▶ RECONNECT
        </button>

        <button
          type="button"
          onClick={onResetRequested}
          style={{
            width: "320px",
            padding: "0.7rem 2rem",
            background: "transparent",
            border: "1px solid rgba(255, 180, 60, 0.35)",
            borderRadius: "4px",
            color: "rgba(255, 180, 60, 0.75)",
            fontSize: "0.7rem",
            letterSpacing: "0.22em",
            fontFamily: "inherit",
            cursor: "pointer",
          }}
        >
          ⊘ ESTABLISH NEW CONNECTION
        </button>
      </div>
    </>
  );
}

function ReturningIdentityCard({
  theme,
  displayName,
  lastRoomLabel,
  lastSessionLabel,
  actLabel,
}: {
  theme: TitleTheme;
  displayName: string;
  lastRoomLabel: string;
  lastSessionLabel: string;
  actLabel: string;
}) {
  return (
    <div
      style={{
        border: `1px solid ${theme.palette.accent}44`,
        background: "rgba(0,0,0,0.5)",
        padding: "1rem 1.5rem",
        borderRadius: "4px",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "0.4rem",
        minWidth: "340px",
      }}
    >
      <div
        style={{
          alignSelf: "center",
          color: "#fff",
          fontSize: "1rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
        }}
      >
        {displayName || "OPERATOR"}
      </div>
      <IdRow label="LAST POSITION"   value={lastRoomLabel}    accent={theme.palette.accent} />
      <IdRow label="LAST TRANSMISSION" value={lastSessionLabel} accent={theme.palette.accent} />
      <IdRow label="CYCLE"           value={actLabel}         accent={theme.palette.accent} />
    </div>
  );
}

function IdRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.65rem", letterSpacing: "0.18em", width: "100%" }}>
      <span style={{ color: accent, opacity: 0.55, minWidth: "130px" }}>{label}</span>
      <span style={{ color: "rgba(255,255,255,0.8)", flex: 1 }}>{value || "—"}</span>
    </div>
  );
}
