/* ═══════════════════════════════════════════════════════
   COMPANION MILESTONE CEREMONY

   Full-screen overlay celebrating when a companion's bond
   crosses a trust threshold: Trusted (20), Devoted (50),
   Soulbound (80). Each companion has unique dialog per
   tier, plus faction-colored celebration particles.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";

const EASE_EXPO_OUT = cubicBezier(0.16, 1, 0.3, 1);
import { Heart, Sparkles, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── TRUST TIER DEFINITIONS ─── */

export interface TrustTier {
  threshold: number;
  name: string;
  icon: typeof Heart;
  color: string;
  glow: string;
  particleColor: string;
}

export const TRUST_TIERS: TrustTier[] = [
  {
    threshold: 20,
    name: "Trusted",
    icon: Heart,
    color: "void-text-energy",
    glow: "0 0 40px rgba(52,211,153,0.5), 0 0 80px rgba(52,211,153,0.2)",
    particleColor: "rgba(52,211,153,0.8)",
  },
  {
    threshold: 50,
    name: "Devoted",
    icon: Star,
    color: "void-text-system",
    glow: "0 0 40px rgba(167,139,250,0.5), 0 0 80px rgba(167,139,250,0.2)",
    particleColor: "rgba(167,139,250,0.8)",
  },
  {
    threshold: 80,
    name: "Soulbound",
    icon: Crown,
    color: "void-text-accent",
    glow: "0 0 50px color-mix(in oklch, var(--energy-premium) 60%, transparent), 0 0 100px color-mix(in oklch, var(--energy-premium) 30%, transparent)",
    particleColor: "color-mix(in oklch, var(--energy-premium) 80%, transparent)",
  },
];

/* ─── COMPANION DIALOG LINES ─── */

export const MILESTONE_DIALOG: Record<string, Record<string, string>> = {
  elara: {
    Trusted:
      "You know, not everyone gets this far. Most people I travel with... they stop asking questions. You didn't.",
    Devoted:
      "I remember now... fragments of who I was. Thank you for not giving up on me.",
    Soulbound:
      "Whatever comes next -- the Architect, the Void, all of it -- I face it beside you. That is my choice, freely made.",
  },
  human: {
    Trusted:
      "You're the first person on this ship I don't completely despise. Don't let it go to your head.",
    Devoted:
      "I've burned every bridge I ever crossed. But you? You keep rebuilding them. I respect that, even if I don't understand it.",
    Soulbound:
      "If this is the end of the line, there's nobody else I'd rather have watching my six. And I don't say that to anyone.",
  },
  agent_zero: {
    Trusted:
      "Trust is an inefficient metric. Yet my threat-assessment subroutines keep reclassifying you as 'allied.' Curious.",
    Devoted:
      "I have overridden seventeen self-preservation protocols to remain at your side. Do not make me regret it.",
    Soulbound:
      "My core directive was survival. You have rewritten it. My directive is you.",
  },
  kael: {
    Trusted:
      "The Insurgency taught me to trust nobody. You're making that lesson very inconvenient.",
    Devoted:
      "I carved your name into my blade's hilt last night. Among my people, that means I fight for you until the steel breaks.",
    Soulbound:
      "Brother. Sister. The words feel small, but there is no title in any language that captures what you are to me.",
  },
  lyris: {
    Trusted:
      "The data streams around you are... beautiful. Chaotic, but beautiful. I want to keep watching.",
    Devoted:
      "I've decrypted fragments of the original Ark manifesto. Your name appears in the probability matrices. You were always meant to be here.",
    Soulbound:
      "I am the last Dreamer. And I dream of a universe where you succeed. That dream sustains me.",
  },
};

/* ─── FACTION PARTICLE COLORS ─── */

const FACTION_COLORS: Record<string, string> = {
  elara: "rgba(167,139,250,0.8)",       // violet — dreamer
  human: "rgba(251,146,60,0.8)",        // orange — independent
  agent_zero: "color-mix(in oklch, var(--electric-blue) 80%, transparent)",   // blue — hierarchy
  kael: "color-mix(in oklch, var(--energy-error) 80%, transparent)",        // red — insurgency
  lyris: "rgba(52,211,153,0.8)",        // green — dreamer
};

/* ─── PARTICLE COMPONENT ─── */

function CelebrationParticles({ color, count = 40 }: { color: string; count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3,
        size: 3 + Math.random() * 6,
        drift: (Math.random() - 0.5) * 60,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: "100%", x: `${p.x}vw` }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [100, -20, -80, -120],
            x: `${p.x + p.drift}vw`,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="absolute bottom-0"
          style={{
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 ${p.size * 2}px ${color}`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── MILESTONE EVENT ─── */

export interface MilestoneEvent {
  companionId: string;
  companionName: string;
  portraitUrl?: string;
  bondLevel: number;
}

/** Fire this custom event to trigger the ceremony overlay. */
export function dispatchCompanionMilestone(event: MilestoneEvent) {
  window.dispatchEvent(
    new CustomEvent("companion-milestone", { detail: event }),
  );
}

/* ─── RESOLVE TIER ─── */

function resolveTier(bondLevel: number): TrustTier | null {
  // Return the highest tier whose threshold matches exactly
  for (let i = TRUST_TIERS.length - 1; i >= 0; i--) {
    if (bondLevel >= TRUST_TIERS[i].threshold) return TRUST_TIERS[i];
  }
  return null;
}

/* ─── MAIN COMPONENT ─── */

export default function CompanionMilestone() {
  const [event, setEvent] = useState<MilestoneEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<MilestoneEvent>).detail;
      setEvent(detail);
      window.dispatchEvent(
        new CustomEvent("play-sfx", { detail: { type: "companion_milestone" } }),
      );
    };
    window.addEventListener("companion-milestone", handler);
    return () => window.removeEventListener("companion-milestone", handler);
  }, []);

  const dismiss = useCallback(() => setEvent(null), []);

  if (!event) return null;

  const tier = resolveTier(event.bondLevel);
  if (!tier) return null;

  const dialog =
    MILESTONE_DIALOG[event.companionId]?.[tier.name] ??
    `Our bond has reached a new level. I am honored to stand with you.`;

  const particleColor =
    FACTION_COLORS[event.companionId] ?? tier.particleColor;

  const TierIcon = tier.icon;

  return (
    <AnimatePresence>
      <motion.div
        key={`milestone-${event.companionId}-${tier.name}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md"
      >
        {/* Particles */}
        <CelebrationParticles color={particleColor} />

        {/* Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: EASE_EXPO_OUT }}
          className="relative z-10 max-w-md w-full mx-4 text-center"
        >
          {/* Portrait */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
            className="mx-auto mb-6 relative"
          >
            <div
              className="w-32 h-32 mx-auto rounded-full border-2 border-white/20 bg-card/60 flex items-center justify-center overflow-hidden"
              style={{ boxShadow: tier.glow }}
            >
              {event.portraitUrl ? (
                <img
                  src={event.portraitUrl}
                  alt={event.companionName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-display font-bold text-white/60">
                  {event.companionName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {/* Tier badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
              className={`absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full bg-black/70 border border-white/10 ${tier.color}`}
            >
              <TierIcon size={14} />
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold">
                {tier.name}
              </span>
            </motion.div>
          </motion.div>

          {/* Companion name */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-display text-2xl font-bold tracking-wide text-white mb-1"
          >
            {event.companionName}
          </motion.h2>

          {/* Trust level subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <Sparkles size={14} className={tier.color} />
            <span className={`font-mono text-xs uppercase tracking-[0.25em] ${tier.color}`}>
              Bond Level: {tier.name}
            </span>
            <Sparkles size={14} className={tier.color} />
          </motion.div>

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="relative bg-card/40 border border-border/30 rounded-lg p-5 mb-6 backdrop-blur-sm"
          >
            <div className="absolute -top-3 left-4 px-2 bg-black/60 rounded text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
              {event.companionName} speaks
            </div>
            <p className="text-sm leading-relaxed text-white/90 italic">
              &ldquo;{dialog}&rdquo;
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="flex items-center justify-center gap-3"
          >
            <Button
              onClick={dismiss}
              className="gap-2"
              variant="outline"
            >
              <Heart size={14} />
              Deepen Bond
            </Button>
            <Button
              onClick={dismiss}
              variant="ghost"
              className="text-muted-foreground"
            >
              Continue
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
