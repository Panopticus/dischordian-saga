/* ═══════════════════════════════════════════════════════
   DECK BUILDER — Build and manage Dischordia decks
   Features mana curve visualization, faction restrictions,
   and suggested starter decks.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Save, Trash2, BarChart3, Sparkles, ArrowLeft } from "lucide-react";
import type { Faction } from "./types";
import { FACTION_COLORS, FACTION_NAMES } from "./types";
import { RARITY_COLORS } from "./PackOpening";

interface DeckCard {
  id: string;
  name: string;
  rarity: string;
  faction: string;
  cardType: string;
  manaCost: number;
  attack?: number;
  health?: number;
  imageUrl?: string;
  maxCopies: number; // 3 for common/uncommon, 2 for rare/epic, 1 for legendary+
}

interface DeckBuilderProps {
  collection: DeckCard[];
  faction: Faction;
  initialDeck?: DeckCard[];
  onSave: (deck: DeckCard[]) => void;
  onBack: () => void;
}

const DECK_SIZE = 40;
const MAX_COPIES: Record<string, number> = {
  common: 3, uncommon: 3, rare: 2, epic: 2, legendary: 1, mythic: 1, neyon: 1,
};

export default function DeckBuilder({ collection, faction, initialDeck, onSave, onBack }: DeckBuilderProps) {
  const [deck, setDeck] = useState<Map<string, number>>(
    () => {
      const m = new Map<string, number>();
      if (initialDeck) initialDeck.forEach(c => m.set(c.id, (m.get(c.id) || 0) + 1));
      return m;
    }
  );

  const factionColor = FACTION_COLORS[faction];

  // Available cards: must be from this faction or neutral
  const availableCards = useMemo(() =>
    collection.filter(c => c.faction === faction || c.faction === "neutral")
      .sort((a, b) => a.manaCost - b.manaCost || a.name.localeCompare(b.name)),
    [collection, faction]
  );

  const deckSize = useMemo(() => {
    let total = 0;
    for (const count of deck.values()) total += count;
    return total;
  }, [deck]);

  // Mana curve data
  const manaCurve = useMemo(() => {
    const curve: number[] = Array(10).fill(0); // 0-9+
    for (const [id, count] of deck) {
      const card = collection.find(c => c.id === id);
      if (card) {
        const bucket = Math.min(9, card.manaCost);
        curve[bucket] += count;
      }
    }
    return curve;
  }, [deck, collection]);

  const maxCurveHeight = Math.max(1, ...manaCurve);

  // Type distribution
  const typeDist = useMemo(() => {
    const dist = { unit: 0, spell: 0, artifact: 0 };
    for (const [id, count] of deck) {
      const card = collection.find(c => c.id === id);
      if (card) {
        const t = card.cardType as keyof typeof dist;
        if (t in dist) dist[t] += count;
      }
    }
    return dist;
  }, [deck, collection]);

  const addCard = useCallback((card: DeckCard) => {
    if (deckSize >= DECK_SIZE) return;
    const current = deck.get(card.id) || 0;
    const maxAllowed = MAX_COPIES[card.rarity] || 1;
    if (current >= maxAllowed) return;
    setDeck(new Map(deck).set(card.id, current + 1));
  }, [deck, deckSize]);

  const removeCard = useCallback((card: DeckCard) => {
    const current = deck.get(card.id) || 0;
    if (current <= 0) return;
    const newDeck = new Map(deck);
    if (current === 1) newDeck.delete(card.id);
    else newDeck.set(card.id, current - 1);
    setDeck(newDeck);
  }, [deck]);

  const handleSave = () => {
    const deckCards: DeckCard[] = [];
    for (const [id, count] of deck) {
      const card = collection.find(c => c.id === id);
      if (card) for (let i = 0; i < count; i++) deckCards.push(card);
    }
    onSave(deckCards);
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <button onClick={onBack} className="flex items-center gap-1 text-white/40 hover:text-white/70 font-mono text-sm">
          <ArrowLeft size={14} /> BACK
        </button>
        <h2 className="font-display text-lg tracking-[0.2em]" style={{ color: factionColor }}>
          {FACTION_NAMES[faction]} DECK
        </h2>
        <span className={`font-mono text-sm ${deckSize === DECK_SIZE ? "text-emerald-400" : deckSize > DECK_SIZE ? "text-red-400" : "text-white/40"}`}>
          {deckSize}/{DECK_SIZE}
        </span>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Available cards */}
        <div className="flex-1 overflow-y-auto border-r border-white/5 p-3">
          <p className="font-mono text-[10px] text-white/30 tracking-wider mb-2">AVAILABLE CARDS</p>
          <div className="space-y-1">
            {availableCards.map(card => {
              const inDeck = deck.get(card.id) || 0;
              const maxAllowed = MAX_COPIES[card.rarity] || 1;
              const canAdd = inDeck < maxAllowed && deckSize < DECK_SIZE;
              const rs = RARITY_COLORS[card.rarity] || RARITY_COLORS.common;

              return (
                <div key={card.id} className={`flex items-center gap-2 p-2 rounded-lg border ${rs.bg} ${rs.border} transition-opacity ${canAdd ? "opacity-100" : "opacity-40"}`}>
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/30 text-blue-300 font-mono text-[10px] font-bold shrink-0">
                    {card.manaCost}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-white/90 truncate">{card.name}</p>
                    <p className="text-[9px] font-mono text-white/30">
                      {card.cardType}{card.attack ? ` ${card.attack}/${card.health}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {inDeck > 0 && (
                      <button onClick={() => removeCard(card)} className="w-6 h-6 flex items-center justify-center rounded bg-red-500/20 text-red-400 hover:bg-red-500/30">
                        <Minus size={12} />
                      </button>
                    )}
                    <span className="font-mono text-[10px] text-white/40 w-6 text-center">{inDeck}/{maxAllowed}</span>
                    {canAdd && (
                      <button onClick={() => addCard(card)} className="w-6 h-6 flex items-center justify-center rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">
                        <Plus size={12} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Deck stats + mana curve */}
        <div className="w-full lg:w-64 p-3 flex flex-col gap-4 overflow-y-auto">
          {/* Mana curve */}
          <div>
            <p className="font-mono text-[10px] text-white/30 tracking-wider mb-2 flex items-center gap-1">
              <BarChart3 size={10} /> MANA CURVE
            </p>
            <div className="flex items-end gap-1 h-20">
              {manaCurve.map((count, cost) => (
                <div key={cost} className="flex-1 flex flex-col items-center gap-0.5">
                  <div className="w-full rounded-t" style={{
                    height: `${(count / maxCurveHeight) * 100}%`,
                    backgroundColor: factionColor + "60",
                    border: count > 0 ? `1px solid ${factionColor}` : "none",
                    minHeight: count > 0 ? "4px" : "0",
                  }} />
                  <span className="text-[8px] font-mono text-white/30">{cost === 9 ? "9+" : cost}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Type distribution */}
          <div>
            <p className="font-mono text-[10px] text-white/30 tracking-wider mb-2">CARD TYPES</p>
            <div className="flex gap-2">
              <div className="flex-1 text-center px-2 py-1.5 rounded bg-white/5">
                <p className="font-mono text-sm font-bold text-white">{typeDist.unit}</p>
                <p className="text-[8px] text-white/30 font-mono">UNITS</p>
              </div>
              <div className="flex-1 text-center px-2 py-1.5 rounded bg-white/5">
                <p className="font-mono text-sm font-bold text-purple-400">{typeDist.spell}</p>
                <p className="text-[8px] text-white/30 font-mono">SPELLS</p>
              </div>
              <div className="flex-1 text-center px-2 py-1.5 rounded bg-white/5">
                <p className="font-mono text-sm font-bold text-amber-400">{typeDist.artifact}</p>
                <p className="text-[8px] text-white/30 font-mono">ARTIFACTS</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-auto">
            <button
              onClick={() => setDeck(new Map())}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs hover:bg-red-500/20"
            >
              <Trash2 size={12} /> CLEAR DECK
            </button>
            <button
              onClick={handleSave}
              disabled={deckSize !== DECK_SIZE}
              className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg font-mono text-xs transition-all ${
                deckSize === DECK_SIZE
                  ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30"
                  : "bg-white/5 border border-white/10 text-white/20 cursor-not-allowed"
              }`}
            >
              <Save size={12} /> SAVE DECK ({deckSize}/{DECK_SIZE})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
