/* ═══════════════════════════════════════════════════════
   AWAKENING CHARACTER PREVIEW — Growing live dossier

   The original plan called for a live-preview panel that updates
   as the player picks species / class / element / alignment so
   they see what they're building instead of waiting for the
   cryo reveal at the end.

   Rather than a full portrait swap (which would require art
   assets per species × class × element), this is a compact
   "dossier card" pinned to the top-right of the Awakening view.
   Each row fades in as its choice is made; absent rows stay
   hidden so players never see an empty schematic they can't
   fill yet.

   One card, four fields, no JS per frame. Position-fixed so it
   hangs above the ElaraDialogBox without fighting its layout.
   Mobile: collapses to a bottom-sheet pill that expands on tap.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CharacterChoices } from "@/contexts/GameContext";
import {
  Flame, Eye, Target, Shield, Crown, Zap, Sparkles, Swords, Compass,
  ChevronDown, ChevronUp,
} from "lucide-react";
import type { ComponentType } from "react";
import { bodyArtUrl, type BodySpecies } from "@/game/paperDoll/bodyArt";

interface AwakeningCharacterPreviewProps {
  choices: CharacterChoices;
}

/* ─── Display metadata per choice value ─── */
const SPECIES_META: Record<string, { label: string; color: string; tag: string }> = {
  demagi: { label: "DeMagi", color: "#FF5A5A", tag: "arcane blood" },
  quarchon: { label: "Quarchon", color: "#8A9DFF", tag: "quantum mind" },
  neyon: { label: "Neyon", color: "#33E2E6", tag: "bio-mystic hybrid" },
};

const CLASS_META: Record<string, { label: string; icon: ComponentType<{ size?: number }>; tag: string }> = {
  engineer: { label: "Engineer", icon: Zap, tag: "code-whisperer" },
  oracle: { label: "Oracle", icon: Eye, tag: "sees the weave" },
  assassin: { label: "Assassin", icon: Target, tag: "silent step" },
  soldier: { label: "Soldier", icon: Swords, tag: "forged for war" },
  spy: { label: "Spy", icon: Compass, tag: "eyes of the fleet" },
};

const ALIGNMENT_META: Record<string, { label: string; color: string; aura: string }> = {
  order: { label: "Order", color: "#F5BF24", aura: "radial-gradient(circle, #F5BF2433 0%, transparent 70%)" },
  chaos: { label: "Chaos", color: "#A078FF", aura: "radial-gradient(circle, #A078FF33 0%, transparent 70%)" },
};

export default function AwakeningCharacterPreview({ choices }: AwakeningCharacterPreviewProps) {
  const species = choices.species ? SPECIES_META[choices.species] : null;
  const characterClass = choices.characterClass ? CLASS_META[choices.characterClass] : null;
  const alignment = choices.alignment ? ALIGNMENT_META[choices.alignment] : null;
  const hasAnything = !!(species || characterClass || alignment || choices.element || choices.name);

  // Mobile defaults to collapsed because the expanded card was tall enough
  // to cover Elara's holographic portrait on phone-sized viewports — the
  // player saw the dossier instead of the lip-sync animation. Desktop
  // viewports have room for the full card alongside the dialog.
  const [expanded, setExpanded] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 640px)").matches;
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 640px)");
    const onChange = (e: MediaQueryListEvent) => setExpanded(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Suppress until the first real choice so we're not rendering an
  // empty "OPERATIVE DOSSIER" placeholder before the player even
  // opens their cryopod.
  if (!hasAnything) return null;

  // Portrait color mixes alignment aura over species base. Without
  // either we fall back to void cyan so the silhouette still reads.
  const portraitAccent = species?.color ?? "var(--neon-cyan)";
  const aura = alignment?.aura ?? "transparent";

  return (
    <motion.aside
      key="char-preview"
      initial={{ opacity: 0, x: 30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      aria-label="Character dossier preview"
      className={`fixed z-[55] top-4 right-4 sm:top-6 sm:right-6 rounded-xl border backdrop-blur-md ${expanded ? "w-[min(240px,calc(100vw-32px))]" : "w-auto"}`}
      style={{
        background: "color-mix(in oklch, var(--bg-void) 88%, transparent)",
        borderColor: `color-mix(in oklch, ${portraitAccent} 30%, transparent)`,
        boxShadow: `0 0 30px color-mix(in oklch, ${portraitAccent} 15%, transparent)`,
      }}
    >
      {/* Header — always visible; doubles as collapse/expand toggle. */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        aria-expanded={expanded}
        aria-controls="awakening-dossier-rows"
        className="relative w-full px-3 sm:px-4 pt-3 pb-2 sm:pt-4 flex items-center gap-2 sm:gap-3 text-left"
      >
        <div
          className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-full shrink-0 flex items-center justify-center"
          style={{ background: aura }}
        >
          <div
            className="w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-colors overflow-hidden"
            style={{
              background: `color-mix(in oklch, ${portraitAccent} 18%, transparent)`,
              borderColor: `color-mix(in oklch, ${portraitAccent} 60%, transparent)`,
              boxShadow: `0 0 12px color-mix(in oklch, ${portraitAccent} 40%, transparent)`,
            }}
          >
            {choices.species && SPECIES_META[choices.species] ? (
              <img
                src={bodyArtUrl(choices.species as BodySpecies)}
                alt={`${SPECIES_META[choices.species].label} silhouette`}
                className="w-full h-full object-cover"
                style={{ objectPosition: "center 20%" }}
              />
            ) : (
              <Sparkles size={14} style={{ color: portraitAccent }} />
            )}
          </div>
        </div>
        {expanded && (
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[9px] tracking-[0.3em] text-muted-foreground/60 uppercase">
              Operative Dossier
            </p>
            <p
              className="font-display text-sm font-bold truncate"
              style={{ color: portraitAccent }}
            >
              {choices.name.trim() || "UNNAMED"}
            </p>
          </div>
        )}
        <span
          className="shrink-0 text-muted-foreground/60"
          aria-hidden
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>

      {/* Rows — only visible once their corresponding choice is made,
          staggered in so the card feels like it's accreting the
          character's identity piece by piece. Hidden when collapsed
          so the card doesn't cover the Elara portrait on mobile. */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id="awakening-dossier-rows"
            key="rows"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 pb-3 space-y-1.5 overflow-hidden"
          >
            {species && (
              <PreviewRow
                key="species"
                label="Species"
                value={species.label}
                hint={species.tag}
                valueColor={species.color}
                icon={Flame}
              />
            )}
            {characterClass && (
              <PreviewRow
                key="class"
                label="Class"
                value={characterClass.label}
                hint={characterClass.tag}
                icon={characterClass.icon}
              />
            )}
            {choices.element && (
              <PreviewRow
                key="element"
                label="Element"
                value={choices.element.toUpperCase()}
                hint={species?.tag ?? ""}
                icon={Flame}
              />
            )}
            {alignment && (
              <PreviewRow
                key="alignment"
                label="Alignment"
                value={alignment.label}
                hint={alignment.label === "Order" ? "light glow · +2 ATK" : "dark glow · +2 DEF"}
                valueColor={alignment.color}
                icon={alignment.label === "Order" ? Shield : Crown}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}

function PreviewRow({
  label,
  value,
  hint,
  valueColor,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  valueColor?: string;
  icon: ComponentType<{ size?: number }>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-2"
    >
      <Icon size={11} />
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[9px] tracking-wider text-muted-foreground/50 uppercase">
          {label}
        </p>
        <p
          className="font-mono text-xs font-semibold truncate"
          style={valueColor ? { color: valueColor } : undefined}
        >
          {value}
        </p>
        {hint && (
          <p className="font-mono text-[9px] text-muted-foreground/40 truncate italic">
            {hint}
          </p>
        )}
      </div>
    </motion.div>
  );
}
