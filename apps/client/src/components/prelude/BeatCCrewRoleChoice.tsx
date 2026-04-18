/**
 * BeatCCrewRoleChoice — Beat C post-cutscene "Six Incubators" pick.
 *
 * Per Bible §6, Beat C ends on the engineering deck's six dormant
 * incubator pods. The player taps into one of three role lines —
 * Engineer / Assassin / Oracle — to seed which prestige-class
 * onboarding beat fires later in Act 1. Each choice raises a stable
 * narrative flag (`prelude_beat_c_role_<role>`) so downstream systems
 * (class tutor surfaces, prestige quest entries) can read the
 * preference without re-prompting.
 *
 * This component does NOT gate the player's final class choice at
 * Act 1 level-up — it just sets the affinity. The existing
 * PreludeTutorCard surfaces Locke's "roles open in Act 1" primer
 * alongside.
 */

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { PreludeTutorCard } from "./PreludeTutorCard";
import { fireCompanionComment } from "@/lib/companionCommentQueue";

export type BeatCRoleId = "engineer" | "assassin" | "oracle";

export interface BeatCRoleOption {
  id: BeatCRoleId;
  label: string;
  blurb: string;
  /** Flag raised on confirmation. */
  flag: string;
  /** Left-percent position on the engineering backdrop. */
  leftPct: number;
  /** Top-percent position. */
  topPct: number;
}

export const BEAT_C_ROLE_OPTIONS: readonly BeatCRoleOption[] = [
  {
    id: "engineer",
    label: "Engineer",
    blurb:
      "The bench still hums. You know where every tool is. You were always going to pick this.",
    flag: "prelude_beat_c_role_engineer",
    leftPct: 22,
    topPct: 55,
  },
  {
    id: "assassin",
    label: "Assassin",
    blurb:
      "Quiet is a skill. The Armory above has a rack with your name carved under it — in handwriting you don't remember.",
    flag: "prelude_beat_c_role_assassin",
    leftPct: 50,
    topPct: 55,
  },
  {
    id: "oracle",
    label: "Oracle",
    blurb:
      "The Seer's deck is still somewhere in the Archives. You've heard the cards shuffle in your sleep.",
    flag: "prelude_beat_c_role_oracle",
    leftPct: 78,
    topPct: 55,
  },
];

export interface BeatCCrewRoleChoiceProps {
  /** Called after the player confirms a role. */
  onComplete: () => void;
}

export function BeatCCrewRoleChoice({ onComplete }: BeatCCrewRoleChoiceProps) {
  const { setNarrativeFlag } = useGame();
  const [hovered, setHovered] = useState<BeatCRoleId | null>(null);
  const [picked, setPicked] = useState<BeatCRoleId | null>(null);

  const confirm = useCallback(
    (opt: BeatCRoleOption) => {
      if (picked) return;
      setPicked(opt.id);
      setNarrativeFlag(opt.flag, true);
      setNarrativeFlag("prelude_beat_c_role_chosen", true);
      fireCompanionComment(`prelude_beat_c_${opt.id}_picked`);
      // Small beat so the glow reads as "commit," then advance.
      const timer = window.setTimeout(onComplete, 900);
      return () => window.clearTimeout(timer);
    },
    [picked, onComplete, setNarrativeFlag],
  );

  const focusedBlurb = useMemo(() => {
    const id = picked ?? hovered;
    if (!id) return null;
    return BEAT_C_ROLE_OPTIONS.find((o) => o.id === id)?.blurb ?? null;
  }, [picked, hovered]);

  return (
    <div
      role="region"
      aria-label="Beat C — crew role choice"
      style={{ position: "absolute", inset: 0, pointerEvents: "auto" }}
    >
      <div className="absolute left-4 top-4 z-30 max-w-md">
        <PreludeTutorCard systemId="crew_role" />
      </div>

      {BEAT_C_ROLE_OPTIONS.map((opt) => {
        const isFocused = hovered === opt.id || picked === opt.id;
        const isCommitted = picked === opt.id;
        return (
          <button
            key={opt.id}
            onMouseEnter={() => setHovered(opt.id)}
            onMouseLeave={() => setHovered((h) => (h === opt.id ? null : h))}
            onFocus={() => setHovered(opt.id)}
            onBlur={() => setHovered((h) => (h === opt.id ? null : h))}
            onClick={() => confirm(opt)}
            disabled={picked !== null && picked !== opt.id}
            aria-label={`Choose role: ${opt.label}`}
            aria-pressed={isCommitted}
            style={{
              position: "absolute",
              left: `${opt.leftPct}%`,
              top: `${opt.topPct}%`,
              transform: "translate(-50%, -50%)",
              width: 112,
              padding: "var(--space-sm) var(--space-md)",
              borderRadius: 4,
              fontFamily: "monospace",
              fontSize: 12,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--energy-primary)",
              background: isCommitted
                ? "color-mix(in oklch, var(--energy-primary) 28%, transparent)"
                : isFocused
                ? "color-mix(in oklch, var(--energy-primary) 18%, transparent)"
                : "color-mix(in oklch, var(--energy-primary) 10%, transparent)",
              border: `1px solid color-mix(in oklch, var(--energy-primary) ${
                isFocused ? "70%" : "35%"
              }, transparent)`,
              boxShadow: isFocused
                ? "0 0 var(--space-xl) color-mix(in oklch, var(--energy-primary) 40%, transparent)"
                : "none",
              animation:
                !picked && !isFocused
                  ? "pvfx-cyan-shimmer 3.2s ease-in-out infinite"
                  : "none",
              cursor: picked ? "default" : "pointer",
              transition: "all 0.35s ease-out",
              zIndex: 40,
            }}
          >
            {opt.label}
          </button>
        );
      })}

      {/* Rolling blurb + status line along the bottom. */}
      <div
        aria-live="polite"
        style={{
          position: "absolute",
          left: "50%",
          bottom: 48,
          transform: "translateX(-50%)",
          maxWidth: 560,
          textAlign: "center",
          fontFamily: "serif",
          fontSize: 16,
          lineHeight: 1.55,
          color: "color-mix(in oklch, var(--text-primary) 85%, transparent)",
          zIndex: 50,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={picked ?? hovered ?? "idle"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            style={{ margin: 0 }}
          >
            {focusedBlurb ??
              "Six incubators. Three roles the Ark can teach you. Choose the one that answers first."}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
