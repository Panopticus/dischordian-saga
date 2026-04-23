/* ═══════════════════════════════════════════════════════
   COMPANION TIER CEREMONY — One-shot reveal on threshold crossings

   When a companion's affinity crosses a tier boundary
   (e.g. Acquainted → Allied) we want the moment to feel
   earned — not just a number bump on a progress bar.

   This component watches a numeric affinity and, when it
   crosses one of the 7 tier thresholds (5/20/40/60/75/90),
   fades in a full-screen overlay with KineticText rendering
   the new tier's title, holds 2.4s, then fades out. Only
   one ceremony per component instance at a time.

   Used by CompanionHubPage so the player feels a visible,
   diegetic marker of progress without us owning a new global
   toast slot. Tasteful, skippable-by-click.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import KineticText from "@/components/void/KineticText";

interface TierInfo {
  name: string;
  color: string;
}

/** Mirrors getRelationshipTier in CompanionHubPage. Kept local so
 *  the ceremony is self-contained; changes to the tier ladder should
 *  update both call sites — there are only two. */
const TIER_LADDER: { min: number; tier: TierInfo }[] = [
  { min: 90, tier: { name: "SOULBOUND",    color: "var(--energy-premium)" } },
  { min: 75, tier: { name: "DEVOTED",      color: "var(--energy-error)"   } },
  { min: 60, tier: { name: "TRUSTED",      color: "var(--energy-success)" } },
  { min: 40, tier: { name: "ALLIED",       color: "var(--energy-primary)" } },
  { min: 20, tier: { name: "ACQUAINTED",   color: "var(--energy-primary)" } },
  { min: 5,  tier: { name: "KNOWN",        color: "var(--neon-cyan)"      } },
  { min: 0,  tier: { name: "STRANGER",     color: "color-mix(in oklch, var(--neon-cyan) 40%, transparent)" } },
];

function tierFor(level: number): TierInfo {
  for (const rung of TIER_LADDER) {
    if (level >= rung.min) return rung.tier;
  }
  return TIER_LADDER[TIER_LADDER.length - 1].tier;
}

function tierIndex(level: number): number {
  // 0 = STRANGER at the bottom, 6 = SOULBOUND at the top. We walk the
  // ladder top-down so higher thresholds take precedence.
  for (let i = 0; i < TIER_LADDER.length; i++) {
    if (level >= TIER_LADDER[i].min) return TIER_LADDER.length - 1 - i;
  }
  return 0;
}

interface Props {
  /** Numeric affinity (0–100). */
  level: number;
  /** Companion display name for the ceremony's subtitle line. */
  companionName: string;
}

export default function CompanionTierCeremony({ level, companionName }: Props) {
  const [active, setActive] = useState<TierInfo | null>(null);
  // lastSeenTierRef stores the tier index the user has *acknowledged*.
  // We only fire on advance — the player shouldn't see the ceremony
  // again when they re-open the Hub at the same affinity.
  const lastSeenTierRef = useRef<number | null>(null);

  useEffect(() => {
    const currentIdx = tierIndex(level);
    if (lastSeenTierRef.current === null) {
      // First render: seed the ref without firing. Otherwise opening
      // a save at tier 4 would play the ceremony at every page mount.
      lastSeenTierRef.current = currentIdx;
      return;
    }
    if (currentIdx > lastSeenTierRef.current) {
      lastSeenTierRef.current = currentIdx;
      setActive(tierFor(level));
    }
  }, [level]);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setActive(null), 3400);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key={active.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => setActive(null)}
          className="fixed inset-0 z-[9997] flex items-center justify-center pointer-events-auto cursor-pointer"
          style={{
            // Radial wash fades darker at edges so the overlay reads
            // as "the world briefly darkens around this moment" — a
            // trick Persona + Mass Effect both use for tier-up beats.
            background: `radial-gradient(ellipse at center, color-mix(in oklch, ${active.color} 12%, transparent) 0%, color-mix(in oklch, var(--bg-void) 88%, transparent) 70%)`,
            backdropFilter: "blur(3px)",
          }}
        >
          <motion.div
            initial={{ y: 10, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.15 }}
            className="text-center px-6"
          >
            <p
              className="font-mono text-[11px] tracking-[0.5em] mb-3 opacity-70"
              style={{ color: active.color }}
            >
              RELATIONSHIP ADVANCED
            </p>
            <h2
              className="font-display text-5xl md:text-7xl font-black tracking-[0.25em] mb-3"
              style={{
                color: active.color,
                textShadow: `0 0 30px color-mix(in oklch, ${active.color} 70%, transparent)`,
              }}
            >
              <KineticText
                key={active.name}
                text={active.name}
                mode="decode"
                speed={45}
                showCursor={false}
                as="span"
              />
            </h2>
            <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground/70 uppercase">
              with {companionName}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
