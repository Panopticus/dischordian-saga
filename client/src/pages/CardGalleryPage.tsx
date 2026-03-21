/* ═══════════════════════════════════════════════════════
   CARD COLLECTION GALLERY — All 178 cards with filtering,
   collection progress, full art detail modal, and lore
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useCallback } from "react";
import { useGame, type CharacterChoices } from "@/contexts/GameContext";
import { getCardSacrificeRewards } from "@/data/lootTables";
import { getMaterialById } from "@/data/craftingData";
import { toast } from "sonner";
import { generateStarterDeck, type StarterCard } from "@/components/StarterDeckViewer";
import { ROOM_EASTER_EGGS, getBonusCards } from "@/components/EasterEggs";
import { Link } from "wouter";
import {
  Crown, Filter, Sparkles, Lock, ChevronLeft, Eye, Search,
  Sword, Shield, Zap, Star, Gem, FlaskConical, X, Layers,
  Users, MapPin, Clock, Flame, Droplets, Wind, Mountain,
  Skull, Sun, LayoutGrid, List, ChevronDown, Trash2, AlertTriangle, Package
} from "lucide-react";
import ZoomableImage from "@/components/ZoomableImage";
import { useSwipeTabs } from "@/hooks/useSwipeTabs";
import { motion, AnimatePresence } from "framer-motion";
import allCardsRaw from "@/data/season1-cards.json";

/* ─── TYPES ─── */
interface FullCard {
  id: string;
  name: string;
  cardType: string;
  rarity: string;
  season: number;
  set: string;
  power: number;
  health: number;
  cost: number;
  element: string;
  alignment: string;
  species: string;
  characterClass: string;
  keywords: string[];
  abilityText: string;
  flavorText: string;
  loreSource: string;
  imageUrl: string;
  era: string;
  affiliation: string;
  // Collection tracking
  owned: boolean;
  source: "database" | "starter" | "easter_egg" | "battle_reward" | "discovery";
  sourceDetail?: string;
}

/* ─── CONSTANTS ─── */
const RARITY_COLORS: Record<string, { bg: string; border: string; text: string; glow: string; ring: string }> = {
  common:    { bg: "bg-zinc-800/60",    border: "border-zinc-600/40",    text: "text-zinc-300",   glow: "",                        ring: "ring-zinc-600/30" },
  uncommon:  { bg: "bg-emerald-950/40", border: "border-emerald-600/40", text: "text-emerald-400", glow: "",                        ring: "ring-emerald-600/30" },
  rare:      { bg: "bg-blue-950/40",    border: "border-blue-500/40",    text: "text-blue-400",   glow: "shadow-blue-500/20",      ring: "ring-blue-500/30" },
  epic:      { bg: "bg-purple-950/40",  border: "border-purple-500/40",  text: "text-purple-400", glow: "shadow-purple-500/25",    ring: "ring-purple-500/30" },
  legendary: { bg: "bg-amber-950/40",   border: "border-amber-500/40",   text: "text-amber-400",  glow: "shadow-amber-500/30",     ring: "ring-amber-500/30" },
  mythic:    { bg: "bg-rose-950/40",    border: "border-rose-500/50",    text: "text-rose-400",   glow: "shadow-rose-500/40",      ring: "ring-rose-500/30" },
};

const RARITY_ORDER = ["common", "uncommon", "rare", "epic", "legendary", "mythic"];

const ELEMENT_CONFIG: Record<string, { icon: typeof Flame; color: string; bg: string }> = {
  fire:      { icon: Flame,    color: "text-orange-400", bg: "bg-orange-900/30" },
  water:     { icon: Droplets, color: "text-blue-400",   bg: "bg-blue-900/30" },
  earth:     { icon: Mountain, color: "text-green-400",  bg: "bg-green-900/30" },
  air:       { icon: Wind,     color: "text-sky-400",    bg: "bg-sky-900/30" },
  void:      { icon: Skull,    color: "text-purple-400", bg: "bg-purple-900/30" },
  lightning: { icon: Zap,      color: "text-yellow-400", bg: "bg-yellow-900/30" },
  light:     { icon: Sun,      color: "text-amber-300",  bg: "bg-amber-900/30" },
};

const TYPE_ICONS: Record<string, typeof Sword> = {
  unit: Sword,
  spell: Zap,
  artifact: FlaskConical,
  support: Shield,
  field: Layers,
};

const ALIGNMENT_COLORS: Record<string, string> = {
  order: "text-blue-400",
  chaos: "text-red-400",
};

/* ─── BUILD FULL CATALOG ─── */
function buildFullCatalog(characterChoices: CharacterChoices): FullCard[] {
  const catalog: FullCard[] = [];
  const seenIds = new Set<string>();

  // 1. All 178 cards from the database
  (allCardsRaw as any[]).forEach(raw => {
    seenIds.add(raw.id);
    catalog.push({
      id: raw.id,
      name: raw.name,
      cardType: raw.cardType || "unit",
      rarity: raw.rarity || "common",
      season: raw.season || 1,
      set: raw.set || "Dischordian Saga",
      power: raw.power ?? 0,
      health: raw.health ?? 0,
      cost: raw.cost ?? 1,
      element: raw.element || "",
      alignment: raw.alignment || "",
      species: raw.species || "",
      characterClass: raw.characterClass || "",
      keywords: raw.keywords || [],
      abilityText: raw.abilityText || "",
      flavorText: raw.flavorText || "",
      loreSource: raw.loreSource || "",
      imageUrl: raw.imageUrl || "",
      era: raw.era || "",
      affiliation: raw.affiliation || "",
      owned: true, // All database cards are "discovered" by default
      source: "database",
      sourceDetail: raw.set || "Season 1",
    });
  });

  // 2. Starter deck cards (mark as owned)
  const starterDeck = generateStarterDeck({
    species: characterChoices.species || undefined,
    characterClass: characterChoices.characterClass || undefined,
    alignment: characterChoices.alignment || undefined,
    element: characterChoices.element || undefined,
    name: characterChoices.name,
  });
  const starterNames = new Set(starterDeck.map(c => c.name));

  // 3. Easter egg bonus cards (add if not in database)
  Object.entries(ROOM_EASTER_EGGS).forEach(([eggId, egg]) => {
    if (egg.bonusCard && !seenIds.has(`egg-${eggId}`)) {
      catalog.push({
        id: `egg-${eggId}`,
        name: egg.bonusCard.name,
        cardType: "artifact",
        rarity: egg.bonusCard.rarity === "mythic" ? "legendary" : egg.bonusCard.rarity,
        season: 1,
        set: "Easter Eggs",
        power: egg.bonusCard.rarity === "mythic" ? 8 : egg.bonusCard.rarity === "legendary" ? 6 : 4,
        health: egg.bonusCard.rarity === "mythic" ? 8 : egg.bonusCard.rarity === "legendary" ? 6 : 4,
        cost: egg.bonusCard.rarity === "mythic" ? 5 : egg.bonusCard.rarity === "legendary" ? 4 : 3,
        element: "",
        alignment: "",
        species: "",
        characterClass: "",
        keywords: [],
        abilityText: egg.bonusCard.description,
        flavorText: "",
        loreSource: egg.title,
        imageUrl: "",
        era: "",
        affiliation: "",
        owned: false,
        source: "easter_egg",
        sourceDetail: egg.title,
      });
    }
  });

  return catalog;
}

/* ─── CARD COMPONENT ─── */
function CardDisplay({ card, onClick, viewMode }: { card: FullCard; onClick: () => void; viewMode: "grid" | "list" }) {
  const rarity = RARITY_COLORS[card.rarity] || RARITY_COLORS.common;
  const TypeIcon = TYPE_ICONS[card.cardType] || Sword;
  const elemCfg = ELEMENT_CONFIG[card.element];

  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={{ x: 4 }}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${rarity.border} ${rarity.bg} cursor-pointer hover:bg-muted/50 transition-colors`}
        onClick={onClick}
      >
        <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
          {card.imageUrl ? (
            <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
              <TypeIcon size={16} className="text-zinc-600" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-xs font-semibold truncate">{card.name}</p>
          <div className="flex items-center gap-2">
            <span className={`font-mono text-[9px] ${rarity.text} uppercase`}>{card.rarity}</span>
            <span className="font-mono text-[9px] text-muted-foreground uppercase">{card.cardType}</span>
            {card.element && elemCfg && (
              <span className={`font-mono text-[9px] ${elemCfg.color}`}>{card.element}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-0.5">
            <Zap size={10} className="text-blue-400" />
            <span className="font-mono text-[10px] text-blue-300">{card.cost}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <Sword size={10} className="text-red-400" />
            <span className="font-mono text-[10px] text-red-300">{card.power}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <Shield size={10} className="text-green-400" />
            <span className="font-mono text-[10px] text-green-300">{card.health}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`relative rounded-lg border ${rarity.border} ${rarity.bg} overflow-hidden cursor-pointer group ${rarity.glow ? `shadow-lg ${rarity.glow}` : ""}`}
      onClick={onClick}
    >
      <div className="aspect-[3/4] overflow-hidden relative">
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <TypeIcon size={24} className="text-zinc-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        {/* Cost badge */}
        <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-blue-600/90 flex items-center justify-center border border-blue-400/50">
          <span className="font-display text-[10px] font-bold text-foreground">{card.cost}</span>
        </div>
        {/* Element badge */}
        {card.element && elemCfg && (
          <div className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full ${elemCfg.bg} flex items-center justify-center border border-border/60`}>
            <elemCfg.icon size={10} className={elemCfg.color} />
          </div>
        )}
        {/* Stats */}
        <div className="absolute bottom-1.5 left-1.5 right-1.5 flex justify-between">
          <div className="flex items-center gap-0.5 bg-red-900/70 px-1.5 py-0.5 rounded">
            <Sword size={9} className="text-red-400" />
            <span className="font-mono text-[9px] text-red-300 font-bold">{card.power}</span>
          </div>
          <div className="flex items-center gap-0.5 bg-green-900/70 px-1.5 py-0.5 rounded">
            <Shield size={9} className="text-green-400" />
            <span className="font-mono text-[9px] text-green-300 font-bold">{card.health}</span>
          </div>
        </div>
      </div>
      <div className="p-2 border-t border-border/40">
        <p className="font-mono text-[10px] font-semibold truncate text-foreground">{card.name}</p>
        <div className="flex items-center justify-between">
          <p className={`font-mono text-[8px] ${rarity.text} uppercase tracking-wider`}>{card.rarity}</p>
          <p className="font-mono text-[8px] text-muted-foreground/50 uppercase">{card.cardType}</p>
        </div>
      </div>
      {/* Rarity shimmer for legendary+ */}
      {(card.rarity === "legendary" || card.rarity === "epic" || card.rarity === "mythic") && (
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        </div>
      )}
    </motion.div>
  );
}

/* ─── CARD DETAIL MODAL ─── */
function CardDetailModal({ card, onClose, onSacrifice }: { card: FullCard | null; onClose: () => void; onSacrifice?: (card: FullCard) => void }) {
  const [showSacrificeConfirm, setShowSacrificeConfirm] = useState(false);
  const [sacrificeResult, setSacrificeResult] = useState<{ materialId: string; quantity: number }[] | null>(null);

  if (!card) return null;
  const rarity = RARITY_COLORS[card.rarity] || RARITY_COLORS.common;
  const TypeIcon = TYPE_ICONS[card.cardType] || Sword;
  const elemCfg = ELEMENT_CONFIG[card.element];

  // Preview what sacrifice would yield
  const sacrificePreview = useMemo(() => {
    return getCardSacrificeRewards(card.rarity);
  }, [card.rarity]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, rotateY: -90 }}
        animate={{ scale: 1, rotateY: 0 }}
        exit={{ scale: 0.85, rotateY: 90 }}
        transition={{ type: "spring", damping: 20 }}
        className={`relative w-full max-w-lg rounded-xl border-2 ${rarity.border} bg-card overflow-hidden ${rarity.glow ? `shadow-2xl ${rarity.glow}` : "shadow-2xl"}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Full art header */}
        <div className="aspect-[16/9] overflow-hidden relative">
          {card.imageUrl ? (
            <ZoomableImage src={card.imageUrl} alt={card.name} className="w-full h-full" />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
              <TypeIcon size={48} className="text-zinc-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          {/* Cost */}
          <div className="absolute top-3 left-3 w-12 h-12 rounded-full bg-blue-600/90 flex items-center justify-center border-2 border-blue-400/50 shadow-lg shadow-blue-500/30">
            <span className="font-display text-xl font-bold text-foreground">{card.cost}</span>
          </div>
          {/* Element + Type */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {card.element && elemCfg && (
              <div className={`flex items-center gap-1 ${elemCfg.bg} px-2 py-1 rounded-full border border-border/60`}>
                <elemCfg.icon size={12} className={elemCfg.color} />
                <span className={`font-mono text-[10px] ${elemCfg.color} uppercase`}>{card.element}</span>
              </div>
            )}
            <div className="flex items-center gap-1 bg-background/60 px-2 py-1 rounded-full">
              <TypeIcon size={12} className="text-muted-foreground/90" />
              <span className="font-mono text-[10px] text-muted-foreground/90 uppercase">{card.cardType}</span>
            </div>
          </div>
          {/* Stats bar */}
          <div className="absolute bottom-3 left-3 right-3 flex justify-between">
            <div className="flex items-center gap-1.5 bg-red-900/80 px-3 py-1.5 rounded-lg shadow-lg">
              <Sword size={14} className="text-red-400" />
              <span className="font-display text-lg text-red-300 font-bold">{card.power}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-green-900/80 px-3 py-1.5 rounded-lg shadow-lg">
              <Shield size={14} className="text-green-400" />
              <span className="font-display text-lg text-green-300 font-bold">{card.health}</span>
            </div>
          </div>
        </div>

        {/* Card info */}
        <div className="p-4 space-y-3">
          {/* Name + rarity */}
          <div>
            <h3 className="font-display text-xl font-bold text-foreground">{card.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`font-mono text-xs ${rarity.text} uppercase tracking-widest`}>{card.rarity}</span>
              {card.alignment && (
                <span className={`font-mono text-xs ${ALIGNMENT_COLORS[card.alignment] || "text-muted-foreground"} uppercase`}>
                  {card.alignment}
                </span>
              )}
              {card.species && (
                <span className="font-mono text-xs text-muted-foreground/60 uppercase">{card.species}</span>
              )}
            </div>
          </div>

          {/* Keywords */}
          {card.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {card.keywords.map(kw => (
                <span key={kw} className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 font-mono text-[10px] text-primary uppercase tracking-wider">
                  {kw}
                </span>
              ))}
            </div>
          )}

          {/* Ability */}
          {card.abilityText && (
            <div className="bg-muted/50 rounded-lg p-3 border border-border/40">
              <p className="font-mono text-xs text-primary mb-1 flex items-center gap-1">
                <Zap size={11} /> ABILITY
              </p>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">{card.abilityText}</p>
            </div>
          )}

          {/* Flavor text / Lore */}
          {card.flavorText && (
            <div className="bg-muted/40 rounded-lg p-3 border border-border/40">
              <p className="font-mono text-xs text-accent mb-1 flex items-center gap-1">
                <Eye size={11} /> LORE
              </p>
              <p className="font-mono text-[11px] text-muted-foreground/80 italic leading-relaxed">{card.flavorText}</p>
            </div>
          )}

          {/* Meta info */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {card.era && (
              <div className="flex items-center gap-1.5">
                <Clock size={10} className="text-muted-foreground/40" />
                <span className="font-mono text-[10px] text-muted-foreground/60">{card.era}</span>
              </div>
            )}
            {card.characterClass && (
              <div className="flex items-center gap-1.5">
                <Users size={10} className="text-muted-foreground/40" />
                <span className="font-mono text-[10px] text-muted-foreground/60 capitalize">{card.characterClass}</span>
              </div>
            )}
            {card.affiliation && (
              <div className="col-span-2 flex items-center gap-1.5">
                <MapPin size={10} className="text-muted-foreground/40" />
                <span className="font-mono text-[10px] text-muted-foreground/60 truncate">{card.affiliation}</span>
              </div>
            )}
            {card.loreSource && (
              <div className="col-span-2 flex items-center gap-1.5">
                <Star size={10} className="text-muted-foreground/40" />
                <span className="font-mono text-[10px] text-muted-foreground/60">{card.loreSource}</span>
              </div>
            )}
          </div>

          {/* ═══ SACRIFICE SECTION ═══ */}
          {card.owned && onSacrifice && (
            <div className="border-t border-border/40 pt-3">
              {!showSacrificeConfirm && !sacrificeResult && (
                <button
                  onClick={() => setShowSacrificeConfirm(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-950/30 border border-red-800/30 text-red-400 font-mono text-xs hover:bg-red-950/50 hover:border-red-700/40 transition-all"
                >
                  <Trash2 size={14} />
                  SACRIFICE FOR MATERIALS
                </button>
              )}

              {showSacrificeConfirm && !sacrificeResult && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-xs">
                    <AlertTriangle size={14} />
                    <span>This will destroy the card permanently!</span>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-2.5 border border-border/40">
                    <p className="font-mono text-[10px] text-muted-foreground/70 mb-1.5">ESTIMATED YIELD:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {sacrificePreview.map((r, i) => {
                        const mat = getMaterialById(r.materialId);
                        return (
                          <span key={i} className="flex items-center gap-1 bg-background/40 px-2 py-1 rounded-md border border-border/40">
                            <span>{mat?.icon || "📦"}</span>
                            <span className="font-mono text-[10px] text-foreground">×{r.quantity}</span>
                            <span className="font-mono text-[9px] text-muted-foreground/60">{mat?.name || r.materialId}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowSacrificeConfirm(false)}
                      className="flex-1 py-2 rounded-lg bg-muted/30 border border-border/60 text-muted-foreground font-mono text-xs hover:bg-muted/50 transition-all"
                    >
                      CANCEL
                    </button>
                    <button
                      onClick={() => {
                        onSacrifice(card);
                        const rewards = getCardSacrificeRewards(card.rarity);
                        setSacrificeResult(rewards);
                      }}
                      className="flex-1 py-2 rounded-lg bg-red-900/50 border border-red-700/40 text-red-300 font-mono text-xs hover:bg-red-900/70 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Trash2 size={12} />
                      CONFIRM SACRIFICE
                    </button>
                  </div>
                </div>
              )}

              {sacrificeResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 text-primary font-mono text-xs">
                    <Package size={14} />
                    <span>MATERIALS EXTRACTED</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sacrificeResult.map((r, i) => {
                      const mat = getMaterialById(r.materialId);
                      return (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-1.5 bg-primary/10 px-2.5 py-1.5 rounded-lg border border-primary/20"
                        >
                          <span className="text-sm">{mat?.icon || "📦"}</span>
                          <span className="font-mono text-xs text-primary font-bold">+{r.quantity}</span>
                          <span className="font-mono text-[10px] text-muted-foreground">{mat?.name || r.materialId}</span>
                        </motion.span>
                      );
                    })}
                  </div>
                  <button
                    onClick={onClose}
                    className="w-full py-2 rounded-lg bg-muted/30 border border-border/60 text-muted-foreground font-mono text-xs hover:bg-muted/50 transition-all mt-1"
                  >
                    CLOSE
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/70 flex items-center justify-center text-muted-foreground/80 hover:text-foreground hover:bg-background/90 transition-colors z-10"
        >
          <X size={16} />
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ─── FILTER DROPDOWN ─── */
function FilterSelect({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none bg-zinc-800/60 border border-zinc-700/30 rounded-md px-2.5 py-1.5 pr-7 font-mono text-[10px] text-muted-foreground cursor-pointer hover:border-zinc-600/50 transition-colors focus:outline-none focus:ring-1 focus:ring-primary/30"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none" />
    </div>
  );
}

/* ═══ MAIN PAGE ═══ */
export default function CardGalleryPage() {
  const { state } = useGame();
  const [selectedCard, setSelectedCard] = useState<FullCard | null>(null);
  const { addMaterial } = useGame();

  const handleSacrificeCard = useCallback((card: FullCard) => {
    // Get the sacrifice rewards and add materials to inventory
    const rewards = getCardSacrificeRewards(card.rarity);
    for (const reward of rewards) {
      addMaterial(reward.materialId, reward.quantity);
    }
    const matNames = rewards.map(r => {
      const mat = getMaterialById(r.materialId);
      return `${mat?.icon || ""} ${r.quantity}x ${mat?.name || r.materialId}`;
    }).join(", ");
    toast.success(`Card sacrificed! Gained: ${matNames}`, { duration: 4000 });
  }, [addMaterial]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRarity, setFilterRarity] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterElement, setFilterElement] = useState("all");
  const [filterAlignment, setFilterAlignment] = useState("all");
  const [filterSpecies, setFilterSpecies] = useState("all");
  const [filterEra, setFilterEra] = useState("all");
  const [filterClass, setFilterClass] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "cost" | "power" | "rarity">("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Build the full catalog
  const catalog = useMemo(() => {
    return buildFullCatalog(state.characterChoices);
  }, [state.characterChoices]);

  // Extract unique filter values
  const filterOptions = useMemo(() => {
    const elements = new Set<string>();
    const species = new Set<string>();
    const eras = new Set<string>();
    const classes = new Set<string>();
    catalog.forEach(c => {
      if (c.element) elements.add(c.element);
      if (c.species) species.add(c.species);
      if (c.era) eras.add(c.era);
      if (c.characterClass) classes.add(c.characterClass);
    });
    return {
      elements: Array.from(elements).sort(),
      species: Array.from(species).sort(),
      eras: Array.from(eras).sort(),
      classes: Array.from(classes).sort(),
    };
  }, [catalog]);

  // Apply filters and search
  const filtered = useMemo(() => {
    let result = catalog.filter(card => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const searchable = `${card.name} ${card.abilityText} ${card.flavorText} ${card.affiliation} ${card.keywords.join(" ")}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      if (filterRarity !== "all" && card.rarity !== filterRarity) return false;
      if (filterType !== "all" && card.cardType !== filterType) return false;
      if (filterElement !== "all" && card.element !== filterElement) return false;
      if (filterAlignment !== "all" && card.alignment !== filterAlignment) return false;
      if (filterSpecies !== "all" && card.species !== filterSpecies) return false;
      if (filterEra !== "all" && card.era !== filterEra) return false;
      if (filterClass !== "all" && card.characterClass !== filterClass) return false;
      return true;
    });

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "cost": return a.cost - b.cost;
        case "power": return b.power - a.power;
        case "rarity": return RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity);
        default: return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [catalog, searchQuery, filterRarity, filterType, filterElement, filterAlignment, filterSpecies, filterEra, filterClass, sortBy]);

  // Stats
  const totalCards = catalog.length;
  const activeFilters = [filterRarity, filterType, filterElement, filterAlignment, filterSpecies, filterEra, filterClass].filter(f => f !== "all").length;

  const rarityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    RARITY_ORDER.forEach(r => { counts[r] = 0; });
    catalog.forEach(c => {
      counts[c.rarity] = (counts[c.rarity] || 0) + 1;
    });
    return counts;
  }, [catalog]);

  const rarityKeys = useMemo(() => ["all", ...RARITY_ORDER.filter(r => (rarityCounts[r] || 0) > 0)], [rarityCounts]);
  const activeRarityIndex = rarityKeys.indexOf(filterRarity);
  const { handlers: swipeHandlers, swipeStyle } = useSwipeTabs({
    tabCount: rarityKeys.length,
    activeIndex: activeRarityIndex >= 0 ? activeRarityIndex : 0,
    onTabChange: (idx) => setFilterRarity(rarityKeys[idx]),
  });

  const clearFilters = () => {
    setFilterRarity("all");
    setFilterType("all");
    setFilterElement("all");
    setFilterAlignment("all");
    setFilterSpecies("all");
    setFilterEra("all");
    setFilterClass("all");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="border-b border-border/30 bg-card/30 backdrop-blur-sm sticky top-0 z-30">
        <div className="px-4 sm:px-6 py-3">
          {/* Title row */}
          <div className="flex items-center gap-3 mb-3">
            <Link href="/games" className="text-muted-foreground hover:text-primary transition-colors">
              <ChevronLeft size={18} />
            </Link>
            <Crown size={18} className="text-amber-400" />
            <h1 className="font-display text-sm font-bold tracking-[0.2em]">CARD COLLECTION</h1>
            <div className="ml-auto flex items-center gap-3">
              <span className="font-mono text-xs text-muted-foreground">{totalCards} cards</span>
              {/* View toggle */}
              <div className="flex rounded-md border border-zinc-700/30 overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-primary/20 text-primary" : "bg-zinc-800/30 text-zinc-500"}`}
                >
                  <LayoutGrid size={12} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-primary/20 text-primary" : "bg-zinc-800/30 text-zinc-500"}`}
                >
                  <List size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search cards by name, ability, lore..."
              className="w-full bg-zinc-800/60 border border-zinc-700/30 rounded-lg pl-9 pr-8 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Rarity pills */}
          <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterRarity("all")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-[10px] font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                filterRarity === "all"
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-zinc-700/30 bg-zinc-800/30 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              ALL {totalCards}
            </button>
            {RARITY_ORDER.map(r => {
              const count = rarityCounts[r] || 0;
              if (count === 0) return null;
              const colors = RARITY_COLORS[r];
              return (
                <button
                  key={r}
                  onClick={() => setFilterRarity(filterRarity === r ? "all" : r)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-[10px] font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                    filterRarity === r
                      ? `${colors.border} ${colors.bg} ${colors.text}`
                      : "border-zinc-700/30 bg-zinc-800/30 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Gem size={9} />
                  {r} {count}
                </button>
              );
            })}
          </div>

          {/* Filter toggle + sort */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-[10px] font-mono uppercase tracking-wider transition-all ${
                showFilters || activeFilters > 0
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-zinc-700/30 bg-zinc-800/30 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Filter size={10} />
              FILTERS {activeFilters > 0 && `(${activeFilters})`}
            </button>

            <FilterSelect
              label="Sort"
              value={sortBy}
              onChange={v => setSortBy(v as any)}
              options={[
                { value: "name", label: "Sort: Name" },
                { value: "cost", label: "Sort: Cost" },
                { value: "power", label: "Sort: Power" },
                { value: "rarity", label: "Sort: Rarity" },
              ]}
            />

            {activeFilters > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-2 py-1.5 rounded-md text-[10px] font-mono text-red-400 hover:bg-red-900/20 transition-colors"
              >
                <X size={10} />
                CLEAR
              </button>
            )}

            <span className="ml-auto font-mono text-[10px] text-muted-foreground/50">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Expanded filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-3">
                  <FilterSelect
                    label="Type"
                    value={filterType}
                    onChange={setFilterType}
                    options={[
                      { value: "all", label: "All Types" },
                      { value: "unit", label: "Unit" },
                      { value: "spell", label: "Spell" },
                      { value: "support", label: "Support" },
                      { value: "field", label: "Field" },
                    ]}
                  />
                  <FilterSelect
                    label="Element"
                    value={filterElement}
                    onChange={setFilterElement}
                    options={[
                      { value: "all", label: "All Elements" },
                      ...filterOptions.elements.map(e => ({ value: e, label: e.charAt(0).toUpperCase() + e.slice(1) })),
                    ]}
                  />
                  <FilterSelect
                    label="Alignment"
                    value={filterAlignment}
                    onChange={setFilterAlignment}
                    options={[
                      { value: "all", label: "All Alignments" },
                      { value: "order", label: "Order" },
                      { value: "chaos", label: "Chaos" },
                    ]}
                  />
                  <FilterSelect
                    label="Species"
                    value={filterSpecies}
                    onChange={setFilterSpecies}
                    options={[
                      { value: "all", label: "All Species" },
                      ...filterOptions.species.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) })),
                    ]}
                  />
                  <FilterSelect
                    label="Era"
                    value={filterEra}
                    onChange={setFilterEra}
                    options={[
                      { value: "all", label: "All Eras" },
                      ...filterOptions.eras.map(e => ({ value: e, label: e })),
                    ]}
                  />
                  <FilterSelect
                    label="Class"
                    value={filterClass}
                    onChange={setFilterClass}
                    options={[
                      { value: "all", label: "All Classes" },
                      ...filterOptions.classes.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) })),
                    ]}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Card Grid / List */}
      <div className="px-4 sm:px-6 pt-6" {...swipeHandlers} style={swipeStyle}>
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Search size={32} className="text-zinc-600 mx-auto mb-3" />
            <p className="font-mono text-sm text-zinc-500">No cards match your filters.</p>
            <button
              onClick={clearFilters}
              className="mt-3 font-mono text-xs text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : viewMode === "list" ? (
          <div className="space-y-1.5 max-w-4xl">
            <AnimatePresence mode="popLayout">
              {filtered.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: Math.min(i * 0.01, 0.2) }}
                  layout
                >
                  <CardDisplay card={card} onClick={() => setSelectedCard(card)} viewMode="list" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: Math.min(i * 0.015, 0.3) }}
                  layout
                >
                  <CardDisplay card={card} onClick={() => setSelectedCard(card)} viewMode="grid" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <CardDetailModal card={selectedCard} onClose={() => setSelectedCard(null)} onSacrifice={handleSacrificeCard} />
        )}
      </AnimatePresence>
    </div>
  );
}
