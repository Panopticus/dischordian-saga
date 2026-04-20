/* ═══════════════════════════════════════════════════════
   BROADCAST PANEL — slide-in announcements deck

   Triggered by the [📡 BROADCASTS] chip on the title.
   Renders each announcement as a card with the art
   thumbnail, category tag, signal bars, title/body, and
   a [TUNE IN] button. Clicking opens:

     - external link for linkUrl rows
     - video player for videoUrl rows (within this panel
       host — parent passes an onPlayVideo handler)

   Keeps existing tRPC fetch logic in parent: this is a
   pure presentational component.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";

import type { AnnouncementRow } from "./types";

interface BroadcastPanelProps {
  open: boolean;
  announcements: AnnouncementRow[];
  accentColor?: string;
  onClose: () => void;
  onPlayVideo: (a: AnnouncementRow) => void;
}

export function BroadcastPanel({
  open,
  announcements,
  accentColor = "#33E2E6",
  onClose,
  onPlayVideo,
}: BroadcastPanelProps) {
  const rows = useMemo(() => {
    const sorted = [...announcements].sort((a, b) => {
      if (a.priority !== b.priority) return a.priority === "high" ? -1 : 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
    return sorted.slice(0, 6);
  }, [announcements]);

  return (
    <div
      aria-hidden={!open}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "min(440px, 95vw)",
        transform: open ? "translateX(0)" : "translateX(105%)",
        transition: "transform 0.35s ease",
        background: "rgba(5, 5, 12, 0.96)",
        borderLeft: `1px solid ${accentColor}`,
        boxShadow: "-8px 0 40px rgba(0,0,0,0.6)",
        zIndex: 8000,
        display: "flex",
        flexDirection: "column",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "1rem 1.25rem",
          borderBottom: `1px solid ${accentColor}33`,
        }}
      >
        <div
          style={{
            flex: 1,
            color: accentColor,
            fontSize: "0.7rem",
            letterSpacing: "0.22em",
          }}
        >
          &gt; ARK COMMS // BROADCAST ARCHIVE &lt;
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close broadcast panel"
          style={{
            background: "transparent",
            border: `1px solid ${accentColor}55`,
            borderRadius: "3px",
            color: accentColor,
            padding: "4px 12px",
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          CLOSE
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem" }}>
        {rows.length === 0 ? (
          <div style={{ color: accentColor, opacity: 0.5, fontSize: "0.75rem", letterSpacing: "0.12em", textAlign: "center", marginTop: "4rem" }}>
            No transmissions received.
          </div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
            {rows.map(a => (
              <BroadcastCard
                key={a.id}
                announcement={a}
                accentColor={accentColor}
                onPlayVideo={onPlayVideo}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function BroadcastCard({
  announcement,
  accentColor,
  onPlayVideo,
}: {
  announcement: AnnouncementRow;
  accentColor: string;
  onPlayVideo: (a: AnnouncementRow) => void;
}) {
  const cat = CATEGORY_LABEL[announcement.category] ?? "TRANSMISSION";
  const isVideo = !!announcement.videoUrl;
  const dateStr = formatDate(announcement.publishedAt);

  const handleAction = () => {
    if (isVideo) {
      onPlayVideo(announcement);
      return;
    }
    if (announcement.linkUrl) {
      window.open(announcement.linkUrl, "_blank", "noopener,noreferrer");
    }
  };

  const categoryColor =
    announcement.category === "ark_alert"
      ? "#FF3C40"
      : announcement.category === "archival_footage"
        ? "#F59E0B"
        : accentColor;

  return (
    <li
      style={{
        background: "rgba(10, 10, 20, 0.6)",
        border: `1px solid ${categoryColor}40`,
        borderRadius: "4px",
        padding: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem" }}>
        <span
          style={{
            color: categoryColor,
            fontSize: "0.55rem",
            letterSpacing: "0.25em",
            border: `1px solid ${categoryColor}60`,
            padding: "3px 8px",
            borderRadius: "2px",
          }}
        >
          {cat}
        </span>
        <span style={{ flex: 1, color: "#888", fontSize: "0.55rem", letterSpacing: "0.15em" }}>
          {dateStr}
        </span>
        <span aria-label="signal strength" style={{ color: categoryColor, fontSize: "0.55rem", letterSpacing: "0.05em" }}>
          ▮▮▮▯▯
        </span>
      </div>

      {announcement.artUrl && (
        <div
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            background: `#000 center / cover no-repeat url(${JSON.stringify(announcement.artUrl)})`,
            borderRadius: "2px",
            marginBottom: "0.8rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {isVideo && (
            <div
              style={{
                position: "absolute",
                bottom: "0.5rem",
                right: "0.5rem",
                background: "rgba(0,0,0,0.75)",
                color: categoryColor,
                padding: "3px 8px",
                fontSize: "0.55rem",
                letterSpacing: "0.15em",
                borderRadius: "2px",
              }}
            >
              ▶ {formatDuration(announcement.videoDurationSec)}
            </div>
          )}
        </div>
      )}

      <div style={{ color: "#fff", fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.05em", marginBottom: "0.4rem" }}>
        {announcement.title}
      </div>
      {announcement.body && (
        <div style={{ color: "#bbb", fontSize: "0.72rem", lineHeight: 1.6, marginBottom: "0.8rem" }}>
          {announcement.body}
        </div>
      )}

      {(isVideo || announcement.linkUrl) && (
        <button
          type="button"
          onClick={handleAction}
          style={{
            background: "transparent",
            border: `1px solid ${categoryColor}`,
            color: categoryColor,
            padding: "6px 14px",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            borderRadius: "3px",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          [ TUNE IN ]
        </button>
      )}
    </li>
  );
}

const CATEGORY_LABEL: Record<string, string> = {
  ark_alert: "ARK ALERT",
  transmission_incoming: "TRANSMISSION INCOMING",
  archival_footage: "ARCHIVAL FOOTAGE",
  overlay: "BROADCAST",
};

function formatDate(ts: Date | string): string {
  const d = ts instanceof Date ? ts : new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

function formatDuration(seconds: number | null): string {
  if (!seconds || seconds <= 0) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
