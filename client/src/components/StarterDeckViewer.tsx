/* ═══════════════════════════════════════════════════════
   STARTER DECK VIEWER — Displays the cards earned from
   character creation during the Awakening sequence.
   Shows a dramatic card reveal animation.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Shield, Heart, Zap, Star, ChevronLeft, ChevronRight, X } from "lucide-react";

/* ─── CARD DATA ─── */
export interface StarterCard {
  id: string;
  name: string;
  type: "unit" | "spell" | "artifact";
  rarity: "common" | "uncommon" | "rare" | "legendary";
  attack: number;
  defense: number;
  cost: number;
  ability: string;
  lore: string;
  imageUrl: string;
  element?: string;
  faction?: string;
}

const CARD_ART: Record<string, string> = {
  soldier: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/card_soldier-5DTnHpCwXMSjQwSSLL3Y69.webp",
  oracle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/card_oracle-g4rDcyk322zSKbKGvF8dF6.webp",
  engineer: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/card_engineer-87sWBmYL7gTbn268o6MDC9.webp",
  assassin: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/card_assassin-KiyFK4iYWiFfBiKtgJcCVa.webp",
  spy: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/card_spy-4XKj4uc84NHCSshGpoDKqE.webp",
};

/* ─── STARTER DECK GENERATOR ─── */
export function generateStarterDeck(choices: {
  species?: string;
  characterClass?: string;
  alignment?: string;
  element?: string;
  name?: string;
}): StarterCard[] {
  const cls = choices.characterClass || "soldier";
  const species = choices.species || "human";
  const alignment = choices.alignment || "order";
  const element = choices.element || "void";

  // Class-specific hero card (legendary)
  const heroCard: StarterCard = {
    id: `hero-${cls}`,
    name: getHeroName(cls, species),
    type: "unit",
    rarity: "legendary",
    attack: cls === "soldier" ? 8 : cls === "assassin" ? 7 : cls === "engineer" ? 4 : cls === "oracle" ? 3 : 6,
    defense: cls === "soldier" ? 6 : cls === "assassin" ? 3 : cls === "engineer" ? 7 : cls === "oracle" ? 8 : 5,
    cost: 5,
    ability: getHeroAbility(cls),
    lore: getHeroLore(cls, species),
    imageUrl: CARD_ART[cls] || CARD_ART.soldier,
    element,
    faction: alignment === "order" ? "Panopticon" : "Insurgency",
  };

  // Species-specific spell card (rare)
  const speciesSpell: StarterCard = {
    id: `spell-${species}`,
    name: getSpeciesSpellName(species),
    type: "spell",
    rarity: "rare",
    attack: species === "demagi" ? 5 : species === "quarchon" ? 3 : 4,
    defense: species === "demagi" ? 2 : species === "quarchon" ? 5 : 4,
    cost: 3,
    ability: getSpeciesSpellAbility(species),
    lore: getSpeciesSpellLore(species),
    imageUrl: CARD_ART.oracle,
    element,
  };

  // Alignment artifact (rare)
  const alignmentArtifact: StarterCard = {
    id: `artifact-${alignment}`,
    name: alignment === "order" ? "Architect's Codex" : "Dreamer's Prism",
    type: "artifact",
    rarity: "rare",
    attack: alignment === "order" ? 2 : 4,
    defense: alignment === "order" ? 5 : 2,
    cost: 2,
    ability: alignment === "order"
      ? "All allied units gain +1 Defense. Reduce incoming damage by 1."
      : "All allied units gain +1 Attack. Draw an extra card each turn.",
    lore: alignment === "order"
      ? "A fragment of the Architect's original design. It hums with the frequency of perfect structure."
      : "A shard of the Dreamer's consciousness. Reality bends around it, full of chaotic potential.",
    imageUrl: CARD_ART.engineer,
    faction: alignment === "order" ? "Panopticon" : "Insurgency",
  };

  // Basic unit cards (uncommon, x2)
  const basicUnits: StarterCard[] = [
    {
      id: "unit-ark-sentinel",
      name: "Ark Sentinel",
      type: "unit",
      rarity: "uncommon",
      attack: 3,
      defense: 4,
      cost: 2,
      ability: "Guardian: Absorbs the first hit directed at an adjacent ally.",
      lore: "Automated defense drones still patrol the corridors of Vessel 47, their loyalty protocols intact after centuries.",
      imageUrl: CARD_ART.soldier,
    },
    {
      id: "unit-cryo-revenant",
      name: "Cryo Revenant",
      type: "unit",
      rarity: "uncommon",
      attack: 4,
      defense: 2,
      cost: 2,
      ability: "Frost Strike: Deals +2 damage to frozen or stunned targets.",
      lore: "Some Potentials didn't survive the thaw intact. Their bodies move, but their minds are... elsewhere.",
      imageUrl: CARD_ART.assassin,
    },
  ];

  // Common cards (x3)
  const commons: StarterCard[] = [
    {
      id: "common-neural-spike",
      name: "Neural Spike",
      type: "spell",
      rarity: "common",
      attack: 3,
      defense: 0,
      cost: 1,
      ability: "Deal 3 damage to target unit. If it's a synthetic, deal 5 instead.",
      lore: "A burst of raw psychic energy, channeled through the ship's neural network.",
      imageUrl: CARD_ART.oracle,
    },
    {
      id: "common-emergency-bulkhead",
      name: "Emergency Bulkhead",
      type: "spell",
      rarity: "common",
      attack: 0,
      defense: 4,
      cost: 1,
      ability: "Block all damage to one unit this turn. That unit cannot attack next turn.",
      lore: "When the alarms sound, the bulkheads slam shut. Nothing gets through.",
      imageUrl: CARD_ART.engineer,
    },
    {
      id: "common-scavenger-drone",
      name: "Scavenger Drone",
      type: "unit",
      rarity: "common",
      attack: 2,
      defense: 2,
      cost: 1,
      ability: "When deployed, draw 1 card from your deck.",
      lore: "Small, nimble, and endlessly curious. They pick through the wreckage looking for anything useful.",
      imageUrl: CARD_ART.spy,
    },
  ];

  return [heroCard, speciesSpell, alignmentArtifact, ...basicUnits, ...commons];
}

function getHeroName(cls: string, species: string): string {
  const prefix = species === "demagi" ? "Digital" : species === "quarchon" ? "Quantum" : "Hybrid";
  switch (cls) {
    case "soldier": return `${prefix} Vanguard`;
    case "oracle": return `${prefix} Seer`;
    case "engineer": return `${prefix} Artificer`;
    case "assassin": return `${prefix} Phantom`;
    case "spy": return `${prefix} Infiltrator`;
    default: return `${prefix} Operative`;
  }
}

function getHeroAbility(cls: string): string {
  switch (cls) {
    case "soldier": return "Frontline: This unit must be destroyed before other units can be targeted. +2 Attack when below half health.";
    case "oracle": return "Foresight: Preview the top 3 cards of your deck. Rearrange them in any order. Heal 2 HP to any ally.";
    case "engineer": return "Construct: Deploy a 2/2 Drone token each turn. Your artifacts cost 1 less to play.";
    case "assassin": return "Shadow Strike: Can attack any unit regardless of position. First strike deals double damage.";
    case "spy": return "Infiltrate: Look at opponent's hand. Copy one card. That card costs 0 this turn.";
    default: return "Adaptable: Choose one ability at the start of each turn.";
  }
}

function getHeroLore(cls: string, species: string): string {
  const speciesLore = species === "demagi"
    ? "Born of the machine lattice, your code runs deeper than flesh."
    : species === "quarchon"
    ? "Quantum probability flows through your veins. You exist in all states simultaneously."
    : "A bridge between worlds, you carry fragments of every reality.";

  switch (cls) {
    case "soldier": return `${speciesLore} You were built for war, and war has found you aboard this dying ship.`;
    case "oracle": return `${speciesLore} You see the threads of fate, and they all converge on Vessel 47.`;
    case "engineer": return `${speciesLore} The ship speaks to you in frequencies others can't hear. You will rebuild what was broken.`;
    case "assassin": return `${speciesLore} You move through shadows that shouldn't exist in the vacuum of space.`;
    case "spy": return `${speciesLore} You observe. You learn. You adapt. And you remember everything.`;
    default: return speciesLore;
  }
}

function getSpeciesSpellName(species: string): string {
  switch (species) {
    case "demagi": return "Digital Cascade";
    case "quarchon": return "Probability Storm";
    default: return "Hybrid Resonance";
  }
}

function getSpeciesSpellAbility(species: string): string {
  switch (species) {
    case "demagi": return "Rewrite target unit's code. Set its Attack to 0 for 2 turns. Draw 1 card.";
    case "quarchon": return "Split target unit into two copies with half stats (rounded up). Both are under your control.";
    default: return "Heal 3 HP to all allies. Deal 2 damage to all enemies. Balanced as all things should be.";
  }
}

function getSpeciesSpellLore(species: string): string {
  switch (species) {
    case "demagi": return "The DeMagi don't fight with weapons. They fight with logic, rewriting the rules of engagement.";
    case "quarchon": return "Quarchon probability manipulation can split reality itself. Use with caution.";
    default: return "The Ne-Yon walk between worlds, channeling both creation and destruction in equal measure.";
  }
}

/* ─── RARITY COLORS ─── */
function getRarityColor(rarity: StarterCard["rarity"]) {
  switch (rarity) {
    case "legendary": return { border: "#FFD700", bg: "rgba(255,215,0,0.08)", glow: "rgba(255,215,0,0.3)", text: "#FFD700" };
    case "rare": return { border: "#a855f7", bg: "rgba(168,85,247,0.08)", glow: "rgba(168,85,247,0.3)", text: "#a855f7" };
    case "uncommon": return { border: "#3b82f6", bg: "rgba(59,130,246,0.08)", glow: "rgba(59,130,246,0.3)", text: "#3b82f6" };
    default: return { border: "rgba(255,255,255,0.3)", bg: "rgba(255,255,255,0.03)", glow: "rgba(255,255,255,0.1)", text: "rgba(255,255,255,0.6)" };
  }
}

function getTypeIcon(type: StarterCard["type"]) {
  switch (type) {
    case "unit": return Swords;
    case "spell": return Zap;
    case "artifact": return Star;
  }
}

/* ─── SINGLE CARD COMPONENT ─── */
function CardDisplay({ card, index, isActive, onClick }: {
  card: StarterCard;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const colors = getRarityColor(card.rarity);
  const TypeIcon = getTypeIcon(card.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateY: 180 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ delay: index * 0.15, duration: 0.6, type: "spring" }}
      onClick={onClick}
      className={`cursor-pointer transition-all duration-300 ${isActive ? "scale-105 z-10" : "hover:scale-102"}`}
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative rounded-lg overflow-hidden w-full"
        style={{
          border: `2px solid ${colors.border}`,
          boxShadow: isActive ? `0 0 30px ${colors.glow}, 0 10px 40px rgba(0,0,0,0.5)` : `0 0 10px ${colors.glow}`,
          background: "linear-gradient(135deg, var(--bg-void) 0%, var(--bg-spotlight) 100%)",
          minHeight: "260px",
        }}
      >
        {/* Card image */}
        <div className="relative h-32 overflow-hidden">
          <img
            src={card.imageUrl}
            alt={card.name}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-void)] via-transparent to-transparent" />
          {/* Cost badge */}
          <div
            className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full flex items-center justify-center font-display text-xs font-bold"
            style={{
              background: "var(--bg-void)",
              border: `1.5px solid ${colors.border}`,
              color: colors.text,
            }}
          >
            {card.cost}
          </div>
          {/* Rarity indicator */}
          <div
            className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded font-mono text-[7px] tracking-wider uppercase max-w-[60%] truncate"
            style={{
              background: "var(--bg-overlay)",
              border: `1px solid ${colors.border}`,
              color: colors.text,
            }}
          >
            {card.rarity}
          </div>
        </div>

        {/* Card info */}
        <div className="p-2.5">
          <div className="flex items-center gap-1.5 mb-1 min-w-0">
            <TypeIcon size={10} className="flex-shrink-0" style={{ color: colors.text }} />
            <p className="font-display text-[11px] font-bold tracking-wide text-foreground truncate min-w-0">{card.name}</p>
          </div>
          <p className="font-mono text-[8px] text-muted-foreground/60 uppercase tracking-wider mb-2">{card.type}</p>

          {/* Stats */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1">
              <Swords size={9} className="text-red-400" />
              <span className="font-mono text-[10px] text-red-400 font-bold">{card.attack}</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield size={9} className="text-blue-400" />
              <span className="font-mono text-[10px] text-blue-400 font-bold">{card.defense}</span>
            </div>
            {card.element && (
              <span className="font-mono text-[8px] text-muted-foreground/50 uppercase">{card.element}</span>
            )}
          </div>

          {/* Ability */}
          <p className="font-mono text-[8px] text-muted-foreground/70 leading-relaxed line-clamp-3">{card.ability}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── CARD DETAIL MODAL ─── */
function CardDetailModal({ card, onClose }: { card: StarterCard; onClose: () => void }) {
  const colors = getRarityColor(card.rarity);
  const TypeIcon = getTypeIcon(card.type);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.8, rotateY: 90 }}
        animate={{ scale: 1, rotateY: 0 }}
        exit={{ scale: 0.8, rotateY: -90 }}
        transition={{ type: "spring", damping: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative rounded-xl overflow-hidden max-w-sm w-full"
        style={{
          border: `2px solid ${colors.border}`,
          boxShadow: `0 0 60px ${colors.glow}, 0 20px 80px rgba(0,0,0,0.7)`,
          background: "linear-gradient(135deg, var(--bg-void) 0%, var(--bg-spotlight) 100%)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1 rounded-full bg-background/60 text-muted-foreground/70 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        {/* Large card image */}
        <div className="relative overflow-hidden" style={{ minHeight: "220px", maxHeight: "300px" }}>
          <img src={card.imageUrl} alt={card.name} className="w-full h-auto object-contain" style={{ maxHeight: "300px" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-void)] via-[color-mix(in_srgb,var(--bg-void)_20%,transparent)] to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-2 mb-1">
              <TypeIcon size={14} style={{ color: colors.text }} />
              <h3 className="font-display text-lg font-bold tracking-wide text-white">{card.name}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-0.5 rounded font-mono text-[9px] tracking-wider uppercase"
                style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}
              >
                {card.rarity}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground/60 uppercase">{card.type}</span>
              {card.faction && (
                <span className="font-mono text-[10px] text-muted-foreground/50">// {card.faction}</span>
              )}
            </div>
          </div>
        </div>

        {/* Card details */}
        <div className="p-4 space-y-3">
          {/* Stats row */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-500/10 border border-red-500/20">
              <Swords size={12} className="text-red-400" />
              <span className="font-mono text-sm text-red-400 font-bold">{card.attack}</span>
              <span className="font-mono text-[9px] text-red-400/50">ATK</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-500/10 border border-blue-500/20">
              <Shield size={12} className="text-blue-400" />
              <span className="font-mono text-sm text-blue-400 font-bold">{card.defense}</span>
              <span className="font-mono text-[9px] text-blue-400/50">DEF</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/20">
              <Heart size={12} className="text-amber-400" />
              <span className="font-mono text-sm text-amber-400 font-bold">{card.cost}</span>
              <span className="font-mono text-[9px] text-amber-400/50">COST</span>
            </div>
          </div>

          {/* Ability */}
          <div className="rounded-md p-3" style={{ background: "rgba(51,226,230,0.03)", border: "1px solid rgba(51,226,230,0.1)" }}>
            <p className="font-mono text-[9px] text-[var(--neon-cyan)]/50 tracking-[0.2em] mb-1">ABILITY</p>
            <p className="font-mono text-xs text-muted-foreground/90 leading-relaxed">{card.ability}</p>
          </div>

          {/* Lore */}
          <div className="rounded-md p-3" style={{ background: "rgba(168,85,247,0.03)", border: "1px solid rgba(168,85,247,0.1)" }}>
            <p className="font-mono text-[9px] text-purple-400/50 tracking-[0.2em] mb-1">LORE</p>
            <p className="font-mono text-[11px] text-muted-foreground/70 leading-relaxed italic">{card.lore}</p>
          </div>

          {card.element && (
            <div className="flex items-center gap-2">
              <Zap size={10} className="text-muted-foreground/50" />
              <span className="font-mono text-[10px] text-muted-foreground/50 uppercase">Element: {card.element}</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── MAIN DECK VIEWER ─── */
export default function StarterDeckViewer({
  cards,
  onClose,
  onContinue,
}: {
  cards: StarterCard[];
  onClose?: () => void;
  onContinue?: () => void;
}) {
  const [selectedCard, setSelectedCard] = useState<StarterCard | null>(null);
  const [revealPhase, setRevealPhase] = useState<"intro" | "revealing" | "complete">("intro");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setRevealPhase("revealing"), 1500);
    const t2 = setTimeout(() => setRevealPhase("complete"), 1500 + cards.length * 200 + 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [cards.length]);

  // Scroll helpers for arrow buttons
  const scrollBy = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  return (
    <div className="w-full relative">
      {/* ─── CLOSE BUTTON (always visible) ─── */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-30 p-2 rounded-full transition-all hover:scale-110"
          style={{
            background: "var(--bg-void)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
          aria-label="Close starter deck"
        >
          <X size={16} className="text-muted-foreground/80 hover:text-white" />
        </button>
      )}

      <AnimatePresence mode="wait">
        {revealPhase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{
              background: "rgba(255,215,0,0.1)",
              border: "2px solid rgba(255,215,0,0.3)",
              boxShadow: "0 0 30px rgba(255,215,0,0.15)",
            }}>
              <Star size={24} className="text-amber-400 animate-pulse" />
            </div>
            <h2 className="font-display text-lg font-bold tracking-[0.2em] text-amber-400 mb-2">
              INITIALIZING STARTER DECK
            </h2>
            <p className="font-mono text-xs text-muted-foreground/60">Generating cards from your neural profile...</p>
          </motion.div>
        )}

        {(revealPhase === "revealing" || revealPhase === "complete") && (
          <motion.div
            key="cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center mb-4">
              <h2 className="font-display text-sm font-bold tracking-[0.2em] text-amber-400">
                YOUR STARTER DECK
              </h2>
              <p className="font-mono text-[10px] text-muted-foreground/50 mt-1">
                {cards.length} CARDS // TAP TO INSPECT • SWIPE TO SCROLL
              </p>
            </div>

            {/* Card carousel — native horizontal scroll for mobile */}
            <div className="relative">
              {/* Desktop scroll arrows */}
              <button
                onClick={() => scrollBy(-1)}
                className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 p-2 rounded-full items-center justify-center"
                style={{
                  background: "var(--bg-void)",
                  border: "1px solid rgba(51,226,230,0.3)",
                  boxShadow: "0 0 12px rgba(51,226,230,0.15)",
                }}
              >
                <ChevronLeft size={16} className="text-[var(--neon-cyan)]" />
              </button>
              <button
                onClick={() => scrollBy(1)}
                className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 p-2 rounded-full items-center justify-center"
                style={{
                  background: "var(--bg-void)",
                  border: "1px solid rgba(51,226,230,0.3)",
                  boxShadow: "0 0 12px rgba(51,226,230,0.15)",
                }}
              >
                <ChevronRight size={16} className="text-[var(--neon-cyan)]" />
              </button>

              {/* Scrollable card strip — touch-friendly horizontal scroll */}
              <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto px-4 pb-3 snap-x snap-mandatory scrollbar-hide"
                style={{
                  WebkitOverflowScrolling: "touch",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {cards.map((card, i) => (
                  <div key={card.id} className="snap-center flex-shrink-0" style={{ width: "min(200px, 55vw)" }}>
                    <CardDisplay
                      card={card}
                      index={i}
                      isActive={selectedCard?.id === card.id}
                      onClick={() => setSelectedCard(card)}
                    />
                  </div>
                ))}
              </div>

              {/* Scroll indicator dots */}
              <div className="flex justify-center gap-1.5 mt-2">
                {cards.map((card, i) => (
                  <div
                    key={card.id}
                    className="w-1.5 h-1.5 rounded-full transition-all"
                    style={{
                      background: i === 0 ? "var(--neon-cyan)" : "rgba(255,255,255,0.15)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Deck summary */}
            {revealPhase === "complete" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-center"
              >
                <div className="flex justify-center gap-4 mb-4">
                  <div className="font-mono text-[10px]">
                    <span className="text-amber-400">{cards.filter(c => c.rarity === "legendary").length}</span>
                    <span className="text-muted-foreground/50 ml-1">LEGENDARY</span>
                  </div>
                  <div className="font-mono text-[10px]">
                    <span className="text-purple-400">{cards.filter(c => c.rarity === "rare").length}</span>
                    <span className="text-muted-foreground/50 ml-1">RARE</span>
                  </div>
                  <div className="font-mono text-[10px]">
                    <span className="text-blue-400">{cards.filter(c => c.rarity === "uncommon").length}</span>
                    <span className="text-muted-foreground/50 ml-1">UNCOMMON</span>
                  </div>
                  <div className="font-mono text-[10px]">
                    <span className="text-muted-foreground/60">{cards.filter(c => c.rarity === "common").length}</span>
                    <span className="text-muted-foreground/50 ml-1">COMMON</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  {onClose && (
                    <button
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-md font-mono text-xs tracking-wider transition-all hover:scale-105"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      SKIP FOR NOW
                    </button>
                  )}
                  {onContinue && (
                    <button
                      onClick={onContinue}
                      className="px-6 py-2.5 rounded-md font-mono text-xs tracking-wider transition-all hover:scale-105 animate-pulse"
                      style={{
                        background: "rgba(51,226,230,0.15)",
                        border: "1px solid rgba(51,226,230,0.4)",
                        color: "var(--neon-cyan)",
                        boxShadow: "0 0 25px rgba(51,226,230,0.15)",
                      }}
                    >
                      REVIEW NEURAL SCAN RESULTS →
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card detail modal */}
      <AnimatePresence>
        {selectedCard && (
          <CardDetailModal card={selectedCard} onClose={() => setSelectedCard(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
