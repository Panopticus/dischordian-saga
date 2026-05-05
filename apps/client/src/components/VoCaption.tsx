/**
 * <VoCaption /> — accessible caption overlay for VO playback.
 *
 * Renders the spoken text in an aria-live region so screen-reader
 * users get the same content sighted players hear, AND so deaf /
 * hard-of-hearing players can follow the narrative without sound.
 *
 * Visibility is controlled by user preference (Settings → Audio →
 * Captions, persisted in localStorage). Defaults to on; unmuting
 * requires action — fail-accessible.
 *
 * Hook into the existing VO playback path:
 *
 *   const audio = new Audio(manifest[lineKey]);
 *   audio.play();
 *   <VoCaption lineKey={lineKey} captions={captionsManifest} />
 */
import { useEffect, useState } from "react";
import type { CaptionManifest } from "@shared/voCaptions";
import { lookupCaption } from "@shared/voCaptions";

const STORAGE_KEY = "loredex_captions_enabled";

export function getCaptionsEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === null ? true : v === "1";
}

export function setCaptionsEnabled(enabled: boolean): void {
  window.localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
  window.dispatchEvent(new CustomEvent("loredex:captions-changed", {
    detail: { enabled },
  }));
}

export interface VoCaptionProps {
  lineKey: string | null;
  captions: CaptionManifest | undefined;
  /** Optional class name for layout / styling. */
  className?: string;
}

export function VoCaption({ lineKey, captions, className }: VoCaptionProps) {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(getCaptionsEnabled());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ enabled: boolean }>).detail;
      setEnabled(detail.enabled);
    };
    window.addEventListener("loredex:captions-changed", onChange);
    return () => window.removeEventListener("loredex:captions-changed", onChange);
  }, []);

  if (!enabled || !lineKey) return null;
  const caption = lookupCaption(captions, lineKey);
  if (!caption) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      data-vo-caption
      className={className}
      style={{
        position: "fixed",
        insetInlineStart: "50%",
        transform: "translateX(-50%)",
        bottom: 24,
        zIndex: 50,
        background: "rgba(8, 10, 16, 0.85)",
        color: "#f3f3f8",
        padding: "8px 12px",
        borderRadius: 4,
        fontSize: 16,
        lineHeight: 1.4,
        maxWidth: "min(800px, 90vw)",
        textAlign: "center",
        pointerEvents: "none",
      }}
      lang={caption.lang ?? "en"}
    >
      {caption.speaker ? (
        <strong style={{ display: "block", fontSize: 13, opacity: 0.7, marginBottom: 2 }}>
          {caption.speaker}
        </strong>
      ) : null}
      {caption.text}
    </div>
  );
}
