import { useState, useMemo } from "react";
import { useGame, type CharacterChoices } from "@/contexts/GameContext";
import { generateStarterDeck, type StarterCard } from "@/components/StarterDeckViewer";
import { ROOM_EASTER_EGGS, getBonusCards } from "@/components/EasterEggs";
import { Link } from "wouter";
import {
  Crown, Filter, Sparkles, Lock, ChevronLeft, Eye,
  Sword, Shield, Zap, Star, Gem, FlaskConical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══ ALL POSSIBLE CARDS IN THE GAME ═══ */
const CARD_ART: Record<string, string> = {
  soldier: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/card_soldier-5DTnHpCwXMSjQwSSLL3Y69.webp",
  oracle: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/card_oracle-g4rDcyk322zSKbKGvF8dF6.webp",
  engineer: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/card_engineer-87sWBmYL7gTbn268o6MDC9.webp",
  assassin: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/card_assassin-KiyFK4iYWiFfBiKtgJcCVa.webp",
  spy: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/card_spy_art-Fp7AC4ebCPMRcnZRzAZZHg.webp",
};

interface CollectionCard extends StarterCard {
  source: "starter" | "easter_egg" | "battle_reward" | "discovery";
  owned: boolean;
  sourceDetail?: string;
}

const RARITY_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  common: { bg: "bg-zinc-800/60", border: "border-zinc-600/40", text: "text-zinc-300", glow: "" },
  uncommon: { bg: "bg-emerald-950/40", border: "border-emerald-600/40", text: "text-emerald-400", glow: "" },
  rare: { bg: "bg-blue-950/40", border: "border-blue-500/40", text: "text-blue-400", glow: "shadow-blue-500/20" },
  legendary: { bg: "bg-amber-950/40", border: "border-amber-500/40", text: "text-amber-400", glow: "shadow-amber-500/30" },
  mythic: { bg: "bg-purple-950/40", border: "border-purple-500/50", text: "text-purple-400", glow: "shadow-purple-500/40" },
};

const RARITY_ORDER = ["common", "uncommon", "rare", "legendary", "mythic"];

const TYPE_ICONS: Record<string, typeof Sword> = {
  unit: Sword,
  spell: Zap,
  artifact: FlaskConical,
};

function buildFullCatalog(characterChoices: CharacterChoices): CollectionCard[] {
  const catalog: CollectionCard[] = [];

  // 1. Starter deck cards (always 8 cards from character creation)
  const starterDeck = generateStarterDeck({
    species: characterChoices.species || undefined,
    characterClass: characterChoices.characterClass || undefined,
    alignment: characterChoices.alignment || undefined,
    element: characterChoices.element || undefined,
    name: characterChoices.name,
  });
  starterDeck.forEach(card => {
    catalog.push({ ...card, source: "starter", owned: true, sourceDetail: "Character Creation" });
  });

  // 2. Easter egg bonus cards
  Object.entries(ROOM_EASTER_EGGS).forEach(([eggId, egg]) => {
    if (egg.bonusCard) {
      catalog.push({
        id: `egg-card-${eggId}`,
        name: egg.bonusCard.name,
        type: "artifact",
        rarity: (egg.bonusCard.rarity === "mythic" ? "legendary" : egg.bonusCard.rarity) as StarterCard["rarity"],
        attack: egg.bonusCard.rarity === "mythic" ? 8 : egg.bonusCard.rarity === "legendary" ? 6 : 4,
        defense: egg.bonusCard.rarity === "mythic" ? 8 : egg.bonusCard.rarity === "legendary" ? 6 : 4,
        cost: egg.bonusCard.rarity === "mythic" ? 5 : egg.bonusCard.rarity === "legendary" ? 4 : 3,
        ability: egg.bonusCard.description,
        lore: `Discovered in: ${egg.title}`,
        imageUrl: CARD_ART.oracle, // Default art for egg cards
        source: "easter_egg",
        owned: false, // Will be checked against collected items
        sourceDetail: egg.title,
      });
    }
  });

  // 3. Battle reward cards (potential rewards from winning battles)
  const battleRewards: CollectionCard[] = [
    {
      id: "battle-reward-sentinel-core",
      name: "Sentinel Core Fragment",
      type: "artifact",
      rarity: "uncommon",
      attack: 0, defense: 4, cost: 2,
      ability: "Absorb 2 damage from the next attack against any ally.",
      lore: "Salvaged from a defeated Corrupted Sentinel.",
      imageUrl: CARD_ART.engineer,
      source: "battle_reward", owned: false, sourceDetail: "Defeat Corrupted Sentinel",
    },
    {
      id: "battle-reward-virus-sample",
      name: "Thought Virus Sample",
      type: "spell",
      rarity: "rare",
      attack: 3, defense: 0, cost: 3,
      ability: "Infect target enemy: -2 attack for 2 turns.",
      lore: "A contained sample of the Thought Virus, weaponized for your use.",
      imageUrl: CARD_ART.spy,
      source: "battle_reward", owned: false, sourceDetail: "Defeat The Thought Virus",
    },
    {
      id: "battle-reward-void-shard",
      name: "Void Shard",
      type: "artifact",
      rarity: "legendary",
      attack: 5, defense: 5, cost: 4,
      ability: "When played, banish one enemy card from the field permanently.",
      lore: "A fragment of the void between dimensions, pulsing with terrible energy.",
      imageUrl: CARD_ART.assassin,
      source: "battle_reward", owned: false, sourceDetail: "Defeat Void Entity",
    },
    {
      id: "battle-reward-ark-shield",
      name: "Ark Shield Protocol",
      type: "spell",
      rarity: "uncommon",
      attack: 0, defense: 6, cost: 2,
      ability: "All allies gain +1 defense this turn.",
      lore: "Emergency defense protocol from the Inception Ark's systems.",
      imageUrl: CARD_ART.soldier,
      source: "battle_reward", owned: false, sourceDetail: "Win 3 battles",
    },
    {
      id: "battle-reward-elara-blessing",
      name: "Elara's Blessing",
      type: "spell",
      rarity: "rare",
      attack: 0, defense: 0, cost: 1,
      ability: "Draw 2 cards and restore 2 HP.",
      lore: "The ship's AI extends her protection to those she deems worthy.",
      imageUrl: CARD_ART.oracle,
      source: "battle_reward", owned: false, sourceDetail: "Win 5 battles",
    },
  ];
  catalog.push(...battleRewards);

  // 4. Discovery cards (found by exploring rooms)
  const discoveryCards: CollectionCard[] = [
    {
      id: "discovery-cryo-residue",
      name: "Cryo Residue",
      type: "spell",
      rarity: "common",
      attack: 1, defense: 0, cost: 1,
      ability: "Freeze target enemy for 1 turn (cannot attack).",
      lore: "Crystallized cryogenic fluid from your own pod.",
      imageUrl: CARD_ART.spy,
      source: "discovery", owned: false, sourceDetail: "Explore Cryo Bay",
    },
    {
      id: "discovery-bridge-access",
      name: "Bridge Access Code",
      type: "artifact",
      rarity: "uncommon",
      attack: 0, defense: 2, cost: 1,
      ability: "Peek at the top 3 cards of your deck. Rearrange in any order.",
      lore: "A command code that grants tactical foresight.",
      imageUrl: CARD_ART.engineer,
      source: "discovery", owned: false, sourceDetail: "Explore Bridge",
    },
    {
      id: "discovery-archive-data",
      name: "Archived Intelligence",
      type: "spell",
      rarity: "uncommon",
      attack: 2, defense: 0, cost: 2,
      ability: "Reveal all enemy hand cards for 2 turns.",
      lore: "Data recovered from the Archives' corrupted memory banks.",
      imageUrl: CARD_ART.oracle,
      source: "discovery", owned: false, sourceDetail: "Explore Archives",
    },
    {
      id: "discovery-engineering-tool",
      name: "Engineer's Multitool",
      type: "artifact",
      rarity: "rare",
      attack: 2, defense: 3, cost: 2,
      ability: "Repair: Restore 2 HP to target ally card.",
      lore: "A versatile tool left behind in the Engineering Bay.",
      imageUrl: CARD_ART.engineer,
      source: "discovery", owned: false, sourceDetail: "Explore Engineering Bay",
    },
    {
      id: "discovery-comms-signal",
      name: "Distorted Signal",
      type: "spell",
      rarity: "common",
      attack: 0, defense: 0, cost: 1,
      ability: "Shuffle your graveyard back into your deck.",
      lore: "A looping signal from the Communications Array, carrying echoes of the past.",
      imageUrl: CARD_ART.spy,
      source: "discovery", owned: false, sourceDetail: "Explore Comms Array",
    },
  ];
  catalog.push(...discoveryCards);

  return catalog;
}

/* ═══ CARD COMPONENT ═══ */
function CardDisplay({ card, onClick }: { card: CollectionCard; onClick: () => void }) {
  const rarity = RARITY_COLORS[card.rarity] || RARITY_COLORS.common;
  const TypeIcon = TYPE_ICONS[card.type] || Sword;

  if (!card.owned) {
    return (
      <motion.div
        whileHover={{ scale: 1.03 }}
        className="relative rounded-lg border border-zinc-700/30 bg-zinc-900/60 overflow-hidden cursor-pointer group"
        onClick={onClick}
      >
        <div className="aspect-[3/4] flex flex-col items-center justify-center p-3 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/40 to-zinc-900/80" />
          <Lock size={28} className="text-zinc-600 mb-2 relative z-10" />
          <p className="font-mono text-[9px] text-zinc-600 text-center relative z-10 tracking-wider">LOCKED</p>
          <p className="font-mono text-[8px] text-zinc-700 text-center mt-1 relative z-10">{card.sourceDetail}</p>
        </div>
        <div className="p-2 border-t border-zinc-700/20">
          <p className="font-mono text-[10px] text-zinc-600 truncate">???</p>
          <p className={`font-mono text-[8px] ${rarity.text} uppercase tracking-wider`}>{card.rarity}</p>
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
        <img
          src={card.imageUrl}
          alt={card.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        {/* Cost badge */}
        <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-blue-600/90 flex items-center justify-center border border-blue-400/50">
          <span className="font-display text-[10px] font-bold text-white">{card.cost}</span>
        </div>
        {/* Type icon */}
        <div className="absolute top-1.5 right-1.5">
          <TypeIcon size={14} className="text-white/70" />
        </div>
        {/* Stats */}
        <div className="absolute bottom-1.5 left-1.5 right-1.5 flex justify-between">
          <div className="flex items-center gap-0.5 bg-red-900/70 px-1.5 py-0.5 rounded">
            <Sword size={9} className="text-red-400" />
            <span className="font-mono text-[9px] text-red-300 font-bold">{card.attack}</span>
          </div>
          <div className="flex items-center gap-0.5 bg-blue-900/70 px-1.5 py-0.5 rounded">
            <Shield size={9} className="text-blue-400" />
            <span className="font-mono text-[9px] text-blue-300 font-bold">{card.defense}</span>
          </div>
        </div>
      </div>
      <div className="p-2 border-t border-white/5">
        <p className="font-mono text-[10px] font-semibold truncate text-foreground">{card.name}</p>
        <p className={`font-mono text-[8px] ${rarity.text} uppercase tracking-wider`}>{card.rarity}</p>
      </div>
      {/* Rarity shimmer for legendary+ */}
      {(card.rarity === "legendary" || (card.rarity as string) === "mythic") && (
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        </div>
      )}
    </motion.div>
  );
}

/* ═══ CARD DETAIL MODAL ═══ */
function CardDetailModal({ card, onClose }: { card: CollectionCard | null; onClose: () => void }) {
  if (!card) return null;
  const rarity = RARITY_COLORS[card.rarity] || RARITY_COLORS.common;
  const TypeIcon = TYPE_ICONS[card.type] || Sword;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, rotateY: -90 }}
        animate={{ scale: 1, rotateY: 0 }}
        exit={{ scale: 0.8, rotateY: 90 }}
        transition={{ type: "spring", damping: 20 }}
        className={`relative w-full max-w-sm rounded-xl border-2 ${rarity.border} ${rarity.bg} overflow-hidden ${rarity.glow ? `shadow-2xl ${rarity.glow}` : "shadow-2xl"}`}
        onClick={e => e.stopPropagation()}
      >
        {card.owned ? (
          <>
            <div className="aspect-[4/3] overflow-hidden relative">
              <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-blue-600/90 flex items-center justify-center border-2 border-blue-400/50">
                <span className="font-display text-lg font-bold text-white">{card.cost}</span>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded-full">
                <TypeIcon size={14} className="text-white/70" />
                <span className="font-mono text-xs text-white/70 uppercase">{card.type}</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                <div className="flex items-center gap-1 bg-red-900/80 px-3 py-1.5 rounded-lg">
                  <Sword size={14} className="text-red-400" />
                  <span className="font-display text-lg text-red-300 font-bold">{card.attack}</span>
                </div>
                <div className="flex items-center gap-1 bg-blue-900/80 px-3 py-1.5 rounded-lg">
                  <Shield size={14} className="text-blue-400" />
                  <span className="font-display text-lg text-blue-300 font-bold">{card.defense}</span>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">{card.name}</h3>
                <p className={`font-mono text-xs ${rarity.text} uppercase tracking-widest`}>{card.rarity} {card.type}</p>
              </div>
              <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                <p className="font-mono text-xs text-primary mb-1 flex items-center gap-1">
                  <Zap size={11} /> ABILITY
                </p>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">{card.ability}</p>
              </div>
              <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                <p className="font-mono text-xs text-accent mb-1 flex items-center gap-1">
                  <Eye size={11} /> LORE
                </p>
                <p className="font-mono text-[11px] text-muted-foreground/80 italic leading-relaxed">{card.lore}</p>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="font-mono text-[10px] text-muted-foreground/50">SOURCE:</span>
                <span className="font-mono text-[10px] text-muted-foreground">{card.sourceDetail}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 text-center space-y-4">
            <Lock size={48} className="text-zinc-600 mx-auto" />
            <h3 className="font-display text-lg font-bold text-zinc-500">CLASSIFIED</h3>
            <p className={`font-mono text-xs ${rarity.text} uppercase tracking-widest`}>{card.rarity}</p>
            <p className="font-mono text-xs text-zinc-600 leading-relaxed">
              This card has not been discovered yet.
            </p>
            <div className="bg-black/30 rounded-lg p-3 border border-zinc-700/30">
              <p className="font-mono text-[10px] text-zinc-500">HOW TO UNLOCK:</p>
              <p className="font-mono text-xs text-zinc-400 mt-1">{card.sourceDetail}</p>
            </div>
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/80 transition-colors"
        >
          &times;
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ═══ MAIN PAGE ═══ */
export default function CardGalleryPage() {
  const { state } = useGame();
  const [selectedCard, setSelectedCard] = useState<CollectionCard | null>(null);
  const [filterRarity, setFilterRarity] = useState<string>("all");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [showOwned, setShowOwned] = useState<"all" | "owned" | "locked">("all");

  // Build the full catalog with ownership status
  const catalog = useMemo(() => {
    const cards = buildFullCatalog(state.characterChoices);
    const collectedBonusCards = getBonusCards();
    const collectedBonusNames = new Set(collectedBonusCards.map(c => c.name));

    // Mark ownership for Easter egg cards
    cards.forEach(card => {
      if (card.source === "easter_egg") {
        card.owned = collectedBonusNames.has(card.name);
      }
      // Discovery cards: owned if the room has been visited
      if (card.source === "discovery") {
        const roomMap: Record<string, string> = {
          "discovery-cryo-residue": "cryo-bay",
          "discovery-bridge-access": "bridge",
          "discovery-archive-data": "archives",
          "discovery-engineering-tool": "engineering",
          "discovery-comms-signal": "comms-array",
        };
        const roomId = roomMap[card.id];
        if (roomId && state.rooms[roomId]?.visited) {
          card.owned = true;
        }
      }
      // Battle rewards: check localStorage for battle wins
      if (card.source === "battle_reward") {
        try {
          const battleStats = JSON.parse(localStorage.getItem("loredex_battle_stats") || "{}");
          const wins = battleStats.totalWins || 0;
          if (card.id === "battle-reward-sentinel-core" && wins >= 1) card.owned = true;
          if (card.id === "battle-reward-virus-sample" && wins >= 2) card.owned = true;
          if (card.id === "battle-reward-void-shard" && wins >= 4) card.owned = true;
          if (card.id === "battle-reward-ark-shield" && wins >= 3) card.owned = true;
          if (card.id === "battle-reward-elara-blessing" && wins >= 5) card.owned = true;
        } catch { /* ignore */ }
      }
    });

    return cards;
  }, [state.characterChoices, state.rooms]);

  // Apply filters
  const filtered = useMemo(() => {
    return catalog.filter(card => {
      if (filterRarity !== "all" && card.rarity !== filterRarity) return false;
      if (filterSource !== "all" && card.source !== filterSource) return false;
      if (filterType !== "all" && card.type !== filterType) return false;
      if (showOwned === "owned" && !card.owned) return false;
      if (showOwned === "locked" && card.owned) return false;
      return true;
    });
  }, [catalog, filterRarity, filterSource, filterType, showOwned]);

  // Stats
  const totalCards = catalog.length;
  const ownedCards = catalog.filter(c => c.owned).length;
  const completionPct = Math.round((ownedCards / totalCards) * 100);

  const rarityCounts = useMemo(() => {
    const counts: Record<string, { total: number; owned: number }> = {};
    RARITY_ORDER.forEach(r => { counts[r] = { total: 0, owned: 0 }; });
    catalog.forEach(c => {
      if (!counts[c.rarity]) counts[c.rarity] = { total: 0, owned: 0 };
      counts[c.rarity].total++;
      if (c.owned) counts[c.rarity].owned++;
    });
    return counts;
  }, [catalog]);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="border-b border-border/30 bg-card/30 backdrop-blur-sm sticky top-0 z-30">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/ark" className="text-muted-foreground hover:text-primary transition-colors">
              <ChevronLeft size={18} />
            </Link>
            <Crown size={18} className="text-amber-400" />
            <h1 className="font-display text-sm font-bold tracking-[0.2em]">CARD COLLECTION</h1>
            <div className="ml-auto flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">{ownedCards}/{totalCards}</span>
              <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <span className="font-mono text-xs text-primary">{completionPct}%</span>
            </div>
          </div>

          {/* Rarity breakdown */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
            {RARITY_ORDER.map(r => {
              const rc = rarityCounts[r];
              const colors = RARITY_COLORS[r];
              return (
                <button
                  key={r}
                  onClick={() => setFilterRarity(filterRarity === r ? "all" : r)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                    filterRarity === r
                      ? `${colors.border} ${colors.bg} ${colors.text}`
                      : "border-zinc-700/30 bg-zinc-800/30 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Gem size={10} />
                  {r} {rc.owned}/{rc.total}
                </button>
              );
            })}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <Filter size={12} className="text-muted-foreground" />
              <select
                value={filterSource}
                onChange={e => setFilterSource(e.target.value)}
                className="bg-zinc-800/60 border border-zinc-700/30 rounded px-2 py-1 font-mono text-[10px] text-muted-foreground"
              >
                <option value="all">All Sources</option>
                <option value="starter">Starter Deck</option>
                <option value="easter_egg">Easter Eggs</option>
                <option value="battle_reward">Battle Rewards</option>
                <option value="discovery">Discoveries</option>
              </select>
            </div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="bg-zinc-800/60 border border-zinc-700/30 rounded px-2 py-1 font-mono text-[10px] text-muted-foreground"
            >
              <option value="all">All Types</option>
              <option value="unit">Units</option>
              <option value="spell">Spells</option>
              <option value="artifact">Artifacts</option>
            </select>
            <div className="flex rounded-md border border-zinc-700/30 overflow-hidden">
              {(["all", "owned", "locked"] as const).map(opt => (
                <button
                  key={opt}
                  onClick={() => setShowOwned(opt)}
                  className={`px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    showOwned === opt
                      ? "bg-primary/20 text-primary"
                      : "bg-zinc-800/30 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Card Grid */}
      <div className="px-4 sm:px-6 pt-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Lock size={32} className="text-zinc-600 mx-auto mb-3" />
            <p className="font-mono text-sm text-zinc-500">No cards match your filters.</p>
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
                  transition={{ delay: Math.min(i * 0.02, 0.3) }}
                  layout
                >
                  <CardDisplay card={card} onClick={() => setSelectedCard(card)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <CardDetailModal card={selectedCard} onClose={() => setSelectedCard(null)} />
        )}
      </AnimatePresence>

      {/* Shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer { animation: shimmer 2s infinite; }
      `}</style>
    </div>
  );
}
