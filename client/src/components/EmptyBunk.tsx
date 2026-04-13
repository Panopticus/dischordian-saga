/* ═══════════════════════════════════════════════════════
   EMPTY BUNK — Visual Absence Indicator

   Shows the empty bed where a fallen apprentice slept.
   Their personal effects remain. A ghost silhouette
   fades in and out if the user allows motion.

   The cruelest UI is a bed that's still made.
   ═══════════════════════════════════════════════════════ */

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Bed, Ghost, Package } from "lucide-react";

export interface FallenApprenticeData {
  name: string;
  archetype: string;
  rarity: string;
  causeOfDeath: string;
  daysServed: number;
}

interface Props {
  fallenApprentice: FallenApprenticeData;
}

/* ─── PERSONAL EFFECTS BY ARCHETYPE ─── */

const PERSONAL_EFFECTS: Record<string, string[]> = {
  zealot: [
    "A hand-stitched banner bearing their personal sigil",
    "Incense sticks, half-burned, still fragrant",
    "A journal of convictions — every page filled to the margins",
  ],
  ghost: [
    "A lock-pick set wrapped in black cloth",
    "A mirror placed to watch the door from any angle",
    "A pillow with no impression — as if they never truly slept here",
  ],
  scholar: [
    "A stack of annotated books, spines cracked with use",
    "A magnifying lens with a scratch they refused to fix",
    "Ink-stained sheets and a half-written letter to no one",
  ],
  revenant: [
    "A coin with both faces scratched blank — passage paid twice",
    "Soil from a grave in a sealed jar",
    "A mirror turned face-down on the nightstand",
  ],
  artisan: [
    "A carving knife and an unfinished wooden figure",
    "Sawdust in the bed-frame joints — they worked here too",
    "A blueprint for something beautiful, never built",
  ],
  oracle: [
    "A star chart with dates circled in the future",
    "A blindfold folded neatly on the pillow",
    "Tea leaves dried in a cup — the shape might mean something",
  ],
  wanderer: [
    "A well-worn map with routes drawn and crossed out",
    "A compass that points somewhere other than north",
    "Boots by the door, still dusty from a road no one remembers",
  ],
  martyr: [
    "Bandages, clean and folded, enough for three people",
    "A letter that reads: 'If I don't come back, it was my choice.'",
    "Someone else's blanket draped over their own — they gave theirs away",
  ],
  heretic: [
    "A copy of the ship's regulations with every rule annotated",
    "A list titled 'Questions They Won't Answer'",
    "A chair facing the wall — away from everyone, on purpose",
  ],
  jester: [
    "A rubber chicken they never explained",
    "A journal of jokes — the last page is blank",
    "A mask, smiling, hanging from the bedpost",
  ],
  sentinel: [
    "A duty roster with their shift highlighted in every column",
    "Boot polish and a rag, still damp",
    "A notch-count on the bed frame — one for every watch completed",
  ],
  prodigal: [
    "A return ticket to a place that may no longer exist",
    "A letter, sealed, addressed to a name no one recognizes",
    "A key on a string — the lock it fits is somewhere else entirely",
  ],
};

/* ─── RARITY ACCENT ─── */

const RARITY_BORDER: Record<string, string> = {
  common: "border-slate-600/30",
  uncommon: "border-green-600/30",
  rare: "border-blue-600/30",
  epic: "border-purple-600/30",
  mythic: "border-amber-600/40",
};

const RARITY_TEXT: Record<string, string> = {
  common: "text-slate-500",
  uncommon: "text-green-500",
  rare: "text-blue-500",
  epic: "text-purple-500",
  mythic: "text-amber-500",
};

/* ─── GHOST SILHOUETTE STYLE (injected once) ─── */

const GHOST_STYLE_ID = "empty-bunk-ghost-silhouette";

function ensureGhostStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(GHOST_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = GHOST_STYLE_ID;
  style.textContent = `
    @keyframes ghostFade {
      0%, 100% { opacity: 0; }
      40% { opacity: 0.15; }
      60% { opacity: 0.12; }
      80% { opacity: 0.05; }
    }
    .ghost-silhouette {
      animation: ghostFade 6s ease-in-out infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .ghost-silhouette {
        animation: none;
        display: none;
      }
    }
  `;
  document.head.appendChild(style);
}

/* ─── COMPONENT ─── */

export default function EmptyBunk({ fallenApprentice }: Props) {
  const { name, archetype, rarity, causeOfDeath, daysServed } = fallenApprentice;

  if (typeof document !== "undefined") {
    ensureGhostStyles();
  }

  const effects = useMemo(() => {
    return PERSONAL_EFFECTS[archetype] ?? [
      "A few unnamed belongings",
      "A blanket, still folded",
      "Nothing that explains who they were",
    ];
  }, [archetype]);

  const borderColor = RARITY_BORDER[rarity] ?? "border-slate-600/30";
  const textColor = RARITY_TEXT[rarity] ?? "text-slate-500";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`
        relative border ${borderColor} rounded-lg bg-card/20 backdrop-blur-sm
        overflow-hidden p-4
      `}
      role="region"
      aria-label={`Empty bunk of ${name}`}
    >
      {/* Ghost silhouette — fades in/out over the bunk area */}
      <div
        className="ghost-silhouette absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <Ghost className="w-24 h-24 text-white/30" />
      </div>

      {/* Bunk header */}
      <div className="relative z-10 flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Bed className="w-5 h-5 text-muted-foreground/40" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-foreground/80">
              {name}&apos;s Bunk
            </h3>
            <span className={`text-xs ${textColor} font-medium`}>
              Empty
            </span>
          </div>
          <p className="text-xs text-muted-foreground/50 mt-0.5">
            {daysServed} {daysServed === 1 ? "day" : "days"} occupied
            &middot; Lost to {causeOfDeath}
          </p>
        </div>
      </div>

      {/* Personal effects */}
      <div className="relative z-10 mt-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Package className="w-3.5 h-3.5 text-muted-foreground/40" />
          <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
            Personal Effects
          </span>
        </div>
        <ul className="space-y-1.5">
          {effects.map((effect, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
              className="text-xs text-muted-foreground/70 leading-relaxed pl-3 border-l border-border/20"
            >
              {effect}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Bottom divider line — thin, muted, like a scratch on wood */}
      <div
        className="relative z-10 mt-4 h-px bg-gradient-to-r from-transparent via-border/20 to-transparent"
        aria-hidden="true"
      />
      <p className="relative z-10 text-[10px] text-muted-foreground/30 mt-2 text-center italic">
        The sheets are still tucked. No one will sleep here again.
      </p>
    </motion.div>
  );
}
