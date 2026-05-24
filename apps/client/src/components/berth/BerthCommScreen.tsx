/* ═══════════════════════════════════════════════════════
   BERTH COMM SCREEN — the wall-mounted Mechronis terminal.

   Always on. Most of the time it shows trial day, ship time,
   Elara's pinned corner, the Human's signal at the bottom
   edge, and an ambient diagnostic line. Sometimes it blooms
   with a banter call, an NPC reaching you from their post,
   or the Warden tapping the line.

   No HUD chrome. The screen IS the chrome — it's a piece of
   in-fiction furniture that happens to surface UI.

   File: apps/client/src/components/berth/BerthCommScreen.tsx
   ═══════════════════════════════════════════════════════ */

import type { CommScreenState } from "@shared/berthCommScreen";
import { AnimatedPortrait } from "@/components/AnimatedPortrait";
import { useState, useEffect } from "react";

interface Props {
  state: CommScreenState;
  /** Mounted in either the upper-right (default) or upper-left of the
   *  berth scene. Slot driven by doorframeFor(member). */
  position?: "wall_left" | "wall_right" | "shelf_top";
}

const POSITION_CLASSES: Record<NonNullable<Props["position"]>, string> = {
  wall_left: "top-12 left-6",
  wall_right: "top-12 right-6",
  shelf_top: "top-6 left-1/2 -translate-x-1/2",
};

export function BerthCommScreen({ state, position = "wall_right" }: Props) {
  const positionClass = POSITION_CLASSES[position];
  // Cycle through call lines if a call is active.
  const [lineIdx, setLineIdx] = useState(0);
  useEffect(() => {
    setLineIdx(0);
  }, [state.activeCall?.sourceId]);

  const currentLine = state.activeCall?.lines[lineIdx];
  const advanceLine = () => {
    if (state.activeCall && lineIdx < state.activeCall.lines.length - 1) {
      setLineIdx(i => i + 1);
    }
  };

  return (
    <div
      className={`absolute ${positionClass} w-72 z-30 pointer-events-auto`}
      onClick={advanceLine}
    >
      {/* Frame — Mechronis-issue scuffed terminal. */}
      <div
        className="relative rounded-md overflow-hidden border border-slate-700/60 shadow-2xl"
        style={{
          background: "linear-gradient(180deg, rgba(15,18,28,0.95), rgba(8,10,18,0.95))",
        }}
      >
        {/* Tiny lapel-pin Architect logo top-right of the bezel. */}
        <div className="absolute top-1 right-2 text-[8px] text-slate-600 font-mono">
          MECH-COMM-7
        </div>

        {/* Screen surface. */}
        <div className="relative aspect-[4/3] p-2">
          {/* Watermark overlay (audit / mourning / warden tap). */}
          {state.watermark && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-20"
              style={{
                background: `rgba(0,0,0,${state.watermark.opacity})`,
              }}
            >
              {state.watermark.kind === "audit_in_progress" && (
                <>
                  <div className="text-xs text-slate-400 font-mono uppercase tracking-widest">
                    M-Audit · Line Held
                  </div>
                  {state.watermark.caption && (
                    <div className="text-[10px] text-slate-500 mt-2 px-3">
                      {state.watermark.caption}
                    </div>
                  )}
                </>
              )}
              {state.watermark.kind === "narrative_silence" && (
                <div className="text-xs text-slate-400 italic">
                  channel closed.
                </div>
              )}
              {state.watermark.kind === "warden_line_tap" && (
                <div className="absolute top-2 left-2 text-[8px] text-slate-700 font-mono opacity-40">
                  ⌖ tapped
                </div>
              )}
            </div>
          )}

          {/* Active call — full-screen overlay. */}
          {state.activeCall && currentLine && !state.watermark && (
            <div className="absolute inset-2 flex flex-col justify-end z-10">
              <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wider mb-1">
                {state.activeCall.source.replace(/_/g, " ")}
              </div>
              <div className="text-xs text-slate-200 leading-relaxed italic">
                "{currentLine.text}"
              </div>
              <div className="text-[9px] text-slate-600 mt-1">
                — {speakerLabel(currentLine.speaker)} ·
                {" "}
                {lineIdx + 1}/{state.activeCall.lines.length}
                {lineIdx < state.activeCall.lines.length - 1 && " · ▸ continue"}
              </div>
            </div>
          )}

          {/* Pinned Elara corner — upper-right, when not watermarked-dark. */}
          {state.pinnedElara && (
            <div
              className="absolute top-2 right-2 z-5"
              style={{
                width: cornerWidth(state.pinnedElara.size),
                height: cornerWidth(state.pinnedElara.size),
                opacity: state.pinnedElara.size === "absent" ? 0 : 0.8,
              }}
            >
              <AnimatedPortrait
                npcId="elara"
                size="bust"
                expression="neutral"
                isSpeaking={state.pinnedElara.size === "speaking"}
              />
            </div>
          )}

          {/* Pinned Human signal — bottom edge, low. */}
          {state.pinnedHuman && (
            <div
              className="absolute bottom-2 left-2 z-5"
              style={{
                width: cornerWidth(state.pinnedHuman.size) * 0.8,
                height: cornerWidth(state.pinnedHuman.size) * 0.8,
                opacity: state.pinnedHuman.size === "absent" ? 0 : 0.7,
                filter: state.pinnedHuman.size === "idle" ? "contrast(0.6) blur(1px)" : undefined,
              }}
            >
              <AnimatedPortrait
                npcId="the_human"
                size="bust"
                expression="neutral"
                isSpeaking={state.pinnedHuman.size === "speaking"}
              />
            </div>
          )}

          {/* Ambient diagnostic — always visible behind everything when no call. */}
          {!state.activeCall && !state.watermark && (
            <div className="absolute inset-2 flex flex-col justify-end pointer-events-none">
              <div className="text-[9px] text-slate-500 font-mono leading-tight">
                {state.ambient.lines[0]}
              </div>
              <div className="text-[9px] text-slate-600 font-mono leading-tight">
                {state.ambient.lines[1]}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function cornerWidth(size: "absent" | "idle" | "listening" | "speaking"): number {
  switch (size) {
    case "absent": return 0;
    case "idle": return 36;
    case "listening": return 56;
    case "speaking": return 96;
  }
}

function speakerLabel(speaker: string): string {
  if (speaker === "elara") return "Elara";
  if (speaker === "the_human") return "The Human";
  if (speaker === "apprentice_active") return "Apprentice";
  return speaker.replace(/_/g, " ");
}
