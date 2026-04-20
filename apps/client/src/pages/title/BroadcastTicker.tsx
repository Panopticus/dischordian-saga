/* ═══════════════════════════════════════════════════════
   BROADCAST TICKER — always-on footer scroller

   Renders a single-line right-to-left crawl of active
   announcements at the bottom edge of the title. Cyan
   default; alert red for rows with `priority === "high"`.
   Content is fed from `trpc.announcements.listActive`.

   Safe to render even when no announcements are returned —
   falls back to a generic "SIGNAL ACTIVE" line.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";

import type { AnnouncementRow } from "./types";

interface BroadcastTickerProps {
  announcements: AnnouncementRow[];
  accentColor?: string;
}

const GENERIC_FALLBACK = "> SIGNAL ACTIVE // ARK 1047 STANDING BY <";

export function BroadcastTicker({ announcements, accentColor = "#33E2E6" }: BroadcastTickerProps) {
  const rows = useMemo(() => {
    if (announcements.length === 0) {
      return [{ text: GENERIC_FALLBACK, tone: "normal" as const }];
    }
    return announcements.map(a => {
      const stamp = formatBroadcastStamp(a.publishedAt);
      const labelByCategory: Record<string, string> = {
        ark_alert: "ARK ALERT",
        transmission_incoming: "TRANSMISSION INCOMING",
        archival_footage: "ARCHIVAL FOOTAGE",
        overlay: "BROADCAST",
      };
      const cat = labelByCategory[a.category] ?? "TRANSMISSION";
      return {
        text: `> ${stamp} // ${cat} — "${a.title.toUpperCase()}" <`,
        tone: a.priority === "high" ? ("alarm" as const) : ("normal" as const),
      };
    });
  }, [announcements]);

  // Join all rows into one long string so the animation is seamless.
  // Duplicate the content to make the marquee loop cleanly.
  const stream = rows.map(r => r.text).join("   |   ");
  const hasAlarm = rows.some(r => r.tone === "alarm");

  return (
    <div
      aria-live="polite"
      aria-label="Broadcast ticker"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "28px",
        overflow: "hidden",
        background: "linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.4) 10%, rgba(0,0,0,0.4) 90%, rgba(0,0,0,0))",
        borderTop: `1px solid ${toRgba(hasAlarm ? "#FF3C40" : accentColor, 0.2)}`,
        zIndex: 4,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          whiteSpace: "nowrap",
          position: "absolute",
          left: "100%",
          top: "50%",
          transform: "translateY(-50%)",
          animation: "broadcast-ticker-scroll 60s linear infinite",
          color: toRgba(hasAlarm ? "#FF3C40" : accentColor, 0.7),
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        }}
      >
        {stream}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;{stream}
      </div>
      <style>{`
        @keyframes broadcast-ticker-scroll {
          0%   { transform: translate(0, -50%); }
          100% { transform: translate(-100%, -50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [aria-label="Broadcast ticker"] > div {
            animation: none !important;
            left: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}

function formatBroadcastStamp(ts: Date | string): string {
  const d = ts instanceof Date ? ts : new Date(ts);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function toRgba(hex: string, alpha: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
