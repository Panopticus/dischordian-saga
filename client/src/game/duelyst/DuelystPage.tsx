/* ═══════════════════════════════════════════════════════
   DISCHORDIA PAGE — Main hub for the tactical card game
   Connects: Menu, Tutorial, Faction Select, Battle,
   Collection, Deck Builder, Pack Opening, Ranked Ladder
   ═══════════════════════════════════════════════════════ */
import { useState, useCallback } from "react";
import type { Faction } from "./types";
import { FACTION_COLORS, FACTION_NAMES, FACTION_DESCRIPTIONS, FACTION_EMBLEMS } from "./types";
import { getFactionCardCounts, getAllCardsForCollection } from "./cardAdapter";
import { GENERALS } from "./engine";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import DuelystGameUI from "./DuelystGameUI";
import PackOpening, { type PackCard } from "./PackOpening";
import CollectionView from "./CollectionView";
import DeckBuilder from "./DeckBuilder";
import { dischordiaSounds } from "./SoundManager";
import { motion, AnimatePresence } from "framer-motion";
import {
  Swords, Shield, Zap, Eye, Skull, Clock, Bug,
  ChevronRight, ArrowLeft, Trophy, Gamepad2, BookOpen,
  Package, Grid3X3, Layers, BarChart3, Volume2, VolumeX,
} from "lucide-react";

type View = "menu" | "faction_select" | "playing" | "result" | "collection" | "deck_builder" | "pack_opening" | "ranked";

const FACTION_ICONS: Record<Faction, typeof Swords> = {
  architect: Shield, dreamer: Zap, insurgency: Swords,
  new_babylon: Skull, antiquarian: Clock, thought_virus: Bug, neutral: Gamepad2,
};

const PLAYABLE_FACTIONS: Faction[] = ["architect", "dreamer", "insurgency", "new_babylon", "antiquarian", "thought_virus"];

// Ranked tier definitions
const RANKED_TIERS = [
  { name: "Bronze", minElo: 0, color: "#cd7f32", icon: "🥉" },
  { name: "Silver", minElo: 1400, color: "#c0c0c0", icon: "🥈" },
  { name: "Gold", minElo: 1600, color: "#ffd700", icon: "🥇" },
  { name: "Platinum", minElo: 1800, color: "#00bcd4", icon: "💎" },
  { name: "Diamond", minElo: 2000, color: "#b388ff", icon: "💠" },
  { name: "Master", minElo: 2200, color: "#ff5722", icon: "🔥" },
  { name: "Grandmaster", minElo: 2400, color: "#e91e63", icon: "👑" },
];

function getTierForElo(elo: number) {
  for (let i = RANKED_TIERS.length - 1; i >= 0; i--) {
    if (elo >= RANKED_TIERS[i].minElo) return RANKED_TIERS[i];
  }
  return RANKED_TIERS[0];
}

export default function DuelystPage() {
  const { isAuthenticated } = useAuth();
  const [view, setView] = useState<View>("menu");
  const [playerFaction, setPlayerFaction] = useState<Faction | null>(null);
  const [opponentFaction, setOpponentFaction] = useState<Faction | null>(null);
  const [result, setResult] = useState<"player" | "opponent" | null>(null);
  const [wins, setWins] = useState(() => parseInt(localStorage.getItem("dischordia_wins") || "0"));
  const [losses, setLosses] = useState(() => parseInt(localStorage.getItem("dischordia_losses") || "0"));
  const [isTutorial, setIsTutorial] = useState(false);
  const [muted, setMuted] = useState(false);
  const [packCards, setPackCards] = useState<PackCard[]>([]);
  const [elo, setElo] = useState(() => parseInt(localStorage.getItem("dischordia_elo") || "1200"));
  const [serverDeckId, setServerDeckId] = useState<number | null>(null);

  // Server queries — gracefully degrade if not authenticated
  const collectionQuery = trpc.cardGame.myCollection.useQuery(
    { page: 1, limit: 500 },
    { enabled: isAuthenticated, retry: false, refetchOnWindowFocus: false }
  );
  const decksQuery = trpc.cardGame.myDecks.useQuery(
    undefined,
    { enabled: isAuthenticated, retry: false, refetchOnWindowFocus: false }
  );
  const dreamQuery = trpc.crafting.getDreamBalance.useQuery(
    undefined,
    { enabled: isAuthenticated, retry: false, refetchOnWindowFocus: false }
  );

  // Server mutations
  const openBoosterPack = trpc.cardGame.openBoosterPack.useMutation();
  const claimStarterPack = trpc.cardGame.claimStarterPack.useMutation();
  const createDeck = trpc.cardGame.createDeck.useMutation();
  const updateDeck = trpc.cardGame.updateDeck.useMutation();
  const utils = trpc.useUtils();

  const tutorialComplete = localStorage.getItem("dischordia_tutorial_complete") === "true";
  const factionCounts = getFactionCardCounts();

  // Build collection data — merge server data with local card pool
  const collectionCards = (() => {
    const allCards = getAllCardsForCollection();
    if (collectionQuery.data?.cards) {
      const ownedMap = new Map<string, { quantity: number; isFoil: boolean }>();
      for (const c of collectionQuery.data.cards as any[]) {
        ownedMap.set(c.cardId || c.id, { quantity: c.quantity || 1, isFoil: !!c.isFoil });
      }
      return allCards.map(c => ({
        ...c,
        owned: ownedMap.has(c.id),
        quantity: ownedMap.get(c.id)?.quantity || 0,
        isFoil: ownedMap.get(c.id)?.isFoil || false,
      }));
    }
    // Fallback: show all as owned (no server connection)
    return allCards.map(c => ({ ...c, owned: true, quantity: 1, isFoil: false }));
  })();

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    dischordiaSounds.setMuted(next);
  };

  const handleFactionSelect = (faction: Faction) => {
    dischordiaSounds.play("button_click");
    setPlayerFaction(faction);
    const available = PLAYABLE_FACTIONS.filter(f => f !== faction);
    setOpponentFaction(available[Math.floor(Math.random() * available.length)]);
  };

  const handleStartGame = () => {
    if (!playerFaction || !opponentFaction) return;
    dischordiaSounds.play("button_click");
    setView("playing");
  };

  const handleGameEnd = (winner: "player" | "opponent") => {
    setResult(winner);
    if (winner === "player") {
      const w = wins + 1;
      setWins(w);
      localStorage.setItem("dischordia_wins", String(w));
      dischordiaSounds.play("victory");
      // ELO gain
      const gain = 15 + Math.floor(Math.random() * 10);
      const newElo = elo + gain;
      setElo(newElo);
      localStorage.setItem("dischordia_elo", String(newElo));
    } else {
      const l = losses + 1;
      setLosses(l);
      localStorage.setItem("dischordia_losses", String(l));
      dischordiaSounds.play("defeat");
      // ELO loss
      const loss = 10 + Math.floor(Math.random() * 8);
      const newElo = Math.max(100, elo - loss);
      setElo(newElo);
      localStorage.setItem("dischordia_elo", String(newElo));
    }
    setView("result");
  };

  const handleOpenPack = useCallback(async (season?: string) => {
    // Try server-side pack opening first (adds cards to real collection)
    if (isAuthenticated) {
      try {
        const result = await openBoosterPack.mutateAsync({ season: season || "1" });
        if (result.success && result.cards) {
          const ownedIds = new Set((collectionQuery.data?.cards as any[] || []).map((c: any) => c.cardId || c.id));
          const cards: PackCard[] = result.cards.map((c: any) => ({
            id: c.cardId || c.id,
            name: c.name,
            rarity: c.rarity || "common",
            imageUrl: c.imageUrl || "",
            attack: c.power || c.attack || 0,
            health: c.health || 0,
            manaCost: c.cost || 0,
            cardType: c.cardType || "unit",
            faction: c.faction || "",
            isNew: !ownedIds.has(c.cardId || c.id),
            isFoil: !!c.isFoil,
          }));
          setPackCards(cards);
          setView("pack_opening");
          // Refresh collection after opening
          utils.cardGame.myCollection.invalidate();
          return;
        }
      } catch (err) {
        console.warn("[Dischordia] Server pack opening failed, using local fallback:", err);
      }
    }

    // Local fallback — generate cards from adapted pool
    const rarities = ["common", "common", "common", "uncommon", "rare"];
    const lastCardRoll = Math.random();
    if (lastCardRoll < 0.01) rarities[4] = "neyon";
    else if (lastCardRoll < 0.03) rarities[4] = "mythic";
    else if (lastCardRoll < 0.08) rarities[4] = "legendary";
    else if (lastCardRoll < 0.25) rarities[4] = "epic";

    const allCards = getAllCardsForCollection();
    const cards: PackCard[] = rarities.map(rarity => {
      const pool = allCards.filter(c => c.rarity === rarity);
      const card = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : allCards[0];
      return {
        id: card.id, name: card.name, rarity: card.rarity, imageUrl: card.imageUrl,
        attack: card.attack, health: card.health, manaCost: card.manaCost,
        cardType: card.cardType, faction: card.faction,
        isNew: Math.random() < 0.4, isFoil: Math.random() < 0.05,
      };
    });
    setPackCards(cards);
    setView("pack_opening");
  }, [isAuthenticated, openBoosterPack, collectionQuery.data, utils]);

  const tier = getTierForElo(elo);

  return (
    <div className="min-h-screen">
      {/* Global mute toggle */}
      <button
        onClick={toggleMute}
        className="fixed top-3 right-3 z-40 p-2 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 text-white/40 hover:text-white/70 transition-colors"
      >
        {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </button>

      <AnimatePresence mode="wait">
        {/* ═══ MENU ═══ */}
        {view === "menu" && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[80vh] gap-6 p-4"
          >
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center mb-3">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50" />
                <span className="font-mono text-[10px] text-primary/70 tracking-[0.4em]">TACTICAL WARFARE</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50" />
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-black tracking-wider">
                <span className="text-primary glow-cyan">DISCHORDIA</span>
              </h1>
              <p className="font-mono text-sm text-muted-foreground mt-2 max-w-md">
                Command your faction on a 5×9 tactical grid. Summon units, cast spells,
                and destroy the enemy general to claim victory.
              </p>
            </div>

            {/* Rank + Dream balance */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                <span className="text-lg">{tier.icon}</span>
                <div>
                  <p className="font-mono text-xs font-bold" style={{ color: tier.color }}>{tier.name}</p>
                  <p className="font-mono text-[10px] text-white/30">{elo} ELO</p>
                </div>
                {(wins > 0 || losses > 0) && (
                  <div className="flex gap-3 ml-4 font-mono text-[10px]">
                    <span className="text-green-400">{wins}W</span>
                    <span className="text-red-400">{losses}L</span>
                  </div>
                )}
              </div>
              {dreamQuery.data && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <Sparkles size={14} className="text-purple-400" />
                  <span className="font-mono text-xs text-purple-400 font-bold">{dreamQuery.data.dream}</span>
                  <span className="font-mono text-[9px] text-purple-400/50">DREAM</span>
                </div>
              )}
            </div>

            {/* Main actions */}
            <div className="flex flex-col gap-2.5 w-full max-w-xs">
              {!tutorialComplete && (
                <button
                  onClick={() => {
                    setIsTutorial(true);
                    setPlayerFaction("architect");
                    setOpponentFaction("thought_virus");
                    setView("playing");
                    dischordiaSounds.play("button_click");
                  }}
                  className="group flex items-center gap-3 px-5 py-3 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-400 font-mono text-sm hover:bg-amber-500/20 transition-all animate-pulse"
                >
                  <BookOpen size={16} />
                  <span className="flex-1 text-left">PLAY TUTORIAL</span>
                  <ChevronRight size={14} className="opacity-50" />
                </button>
              )}

              <button
                onClick={() => { setView("faction_select"); dischordiaSounds.play("button_click"); }}
                className="group flex items-center gap-3 px-5 py-3 rounded-lg bg-primary/10 border border-primary/40 text-primary font-mono text-sm hover:bg-primary/20 transition-all"
              >
                <Swords size={16} />
                <span className="flex-1 text-left">{tutorialComplete ? "BATTLE" : "SKIP TO BATTLE"}</span>
                <ChevronRight size={14} className="opacity-50" />
              </button>

              <button
                onClick={() => { setView("collection"); dischordiaSounds.play("button_click"); }}
                className="group flex items-center gap-3 px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-white/70 font-mono text-sm hover:bg-white/10 hover:text-white transition-all"
              >
                <Grid3X3 size={16} />
                <span className="flex-1 text-left">COLLECTION</span>
                <ChevronRight size={14} className="opacity-30" />
              </button>

              <button
                onClick={() => { setView("deck_builder"); dischordiaSounds.play("button_click"); }}
                className="group flex items-center gap-3 px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-white/70 font-mono text-sm hover:bg-white/10 hover:text-white transition-all"
              >
                <Layers size={16} />
                <span className="flex-1 text-left">DECK BUILDER</span>
                <ChevronRight size={14} className="opacity-30" />
              </button>

              <button
                onClick={() => { handleOpenPack(); dischordiaSounds.play("button_click"); }}
                className="group flex items-center gap-3 px-5 py-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-amber-400/70 font-mono text-sm hover:bg-amber-500/10 hover:text-amber-400 transition-all"
              >
                <Package size={16} />
                <span className="flex-1 text-left">OPEN PACKS</span>
                <ChevronRight size={14} className="opacity-30" />
              </button>

              <button
                onClick={() => { setView("ranked"); dischordiaSounds.play("button_click"); }}
                className="group flex items-center gap-3 px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-white/70 font-mono text-sm hover:bg-white/10 hover:text-white transition-all"
              >
                <BarChart3 size={16} />
                <span className="flex-1 text-left">RANKED LADDER</span>
                <ChevronRight size={14} className="opacity-30" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══ FACTION SELECT ═══ */}
        {view === "faction_select" && (
          <motion.div
            key="faction"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 sm:p-6 max-w-5xl mx-auto"
          >
            <button onClick={() => setView("menu")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground font-mono text-xs mb-6 transition-colors">
              <ArrowLeft size={14} /> Back
            </button>
            <h2 className="font-display text-xl tracking-[0.2em] text-foreground mb-2">CHOOSE YOUR FACTION</h2>
            <p className="font-mono text-xs text-muted-foreground mb-6">Each faction has unique cards, a General, and a Bloodborn Spell</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {PLAYABLE_FACTIONS.map(faction => {
                const Icon = FACTION_ICONS[faction];
                const selected = playerFaction === faction;
                const color = FACTION_COLORS[faction];
                const general = GENERALS.find(g => g.faction === faction);
                const emblemUrl = FACTION_EMBLEMS[faction];
                return (
                  <button key={faction} onClick={() => handleFactionSelect(faction)}
                    className={`text-left p-4 rounded-lg border-2 transition-all hover-lift ${selected ? "border-primary bg-primary/5" : "border-border/30 bg-card/30 hover:border-primary/30"}`}>
                    <div className="flex items-center gap-3 mb-3">
                      {emblemUrl ? (
                        <img src={emblemUrl} alt={FACTION_NAMES[faction]} className="w-12 h-12 rounded-lg object-contain" style={{ border: `2px solid ${color}`, backgroundColor: color + "11" }} />
                      ) : (
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "22", border: `2px solid ${color}` }}>
                          <Icon size={22} style={{ color }} />
                        </div>
                      )}
                      <div>
                        <p className="font-display text-sm font-bold tracking-wider" style={{ color }}>{FACTION_NAMES[faction]}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">{factionCounts[faction]} cards</p>
                      </div>
                    </div>
                    {general && (
                      <div className="flex items-center gap-2 mb-2 p-2 rounded bg-background/50 border border-border/20">
                        {general.imageUrl && <img src={general.imageUrl} alt={general.name} className="w-8 h-8 rounded-full object-cover" />}
                        <div>
                          <p className="font-mono text-[10px] text-foreground font-semibold">General: {general.name}</p>
                          <p className="font-mono text-[9px] text-muted-foreground">{general.bloodbornSpell.name} — {general.bloodbornSpell.description}</p>
                        </div>
                      </div>
                    )}
                    <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">{FACTION_DESCRIPTIONS[faction]}</p>
                    {selected && <div className="mt-2 flex items-center gap-1 text-primary font-mono text-[10px]"><Swords size={10} /> SELECTED</div>}
                  </button>
                );
              })}
            </div>
            {playerFaction && opponentFaction && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-4 font-mono text-sm">
                  <span style={{ color: FACTION_COLORS[playerFaction] }}>{FACTION_NAMES[playerFaction]}</span>
                  <span className="text-muted-foreground">vs</span>
                  <span style={{ color: FACTION_COLORS[opponentFaction] }}>{FACTION_NAMES[opponentFaction]}</span>
                </div>
                <button onClick={handleStartGame} className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-mono text-sm font-bold hover:bg-primary/80 transition-colors">
                  BEGIN BATTLE
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ═══ PLAYING ═══ */}
        {view === "playing" && playerFaction && opponentFaction && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen">
            <DuelystGameUI
              playerFaction={playerFaction}
              opponentFaction={opponentFaction}
              isTutorial={isTutorial}
              onGameEnd={(winner) => {
                if (isTutorial && winner === "player") {
                  localStorage.setItem("dischordia_tutorial_complete", "true");
                  setIsTutorial(false);
                }
                handleGameEnd(winner);
              }}
              onBack={() => { setIsTutorial(false); setView("menu"); }}
            />
          </motion.div>
        )}

        {/* ═══ RESULT ═══ */}
        {view === "result" && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[80vh] gap-6 p-4">
            <Trophy size={48} className={result === "player" ? "text-amber-400" : "text-muted-foreground"} />
            <h2 className={`font-display text-3xl tracking-[0.3em] ${result === "player" ? "text-primary glow-cyan" : "text-destructive"}`}>
              {result === "player" ? "VICTORY" : "DEFEAT"}
            </h2>
            <p className="font-mono text-sm text-muted-foreground">
              {result === "player" ? "The enemy general has fallen. Glory to your faction." : "Your general has been destroyed. Regroup and try again."}
            </p>
            <div className="flex gap-3">
              <button onClick={() => { setView("faction_select"); setResult(null); dischordiaSounds.play("button_click"); }}
                className="px-5 py-2 bg-primary/10 border border-primary/40 text-primary rounded font-mono text-sm hover:bg-primary/20 transition-colors">
                PLAY AGAIN
              </button>
              <button onClick={() => { handleOpenPack(); setResult(null); }}
                className="px-5 py-2 bg-amber-500/10 border border-amber-500/40 text-amber-400 rounded font-mono text-sm hover:bg-amber-500/20 transition-colors">
                OPEN REWARD PACK
              </button>
              <button onClick={() => { setView("menu"); setResult(null); }}
                className="px-5 py-2 border border-border/30 text-muted-foreground rounded font-mono text-sm hover:text-foreground transition-colors">
                MENU
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══ COLLECTION ═══ */}
        {view === "collection" && (
          <motion.div key="collection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen">
            <CollectionView
              cards={collectionCards}
              onBack={() => setView("menu")}
              onOpenPacks={handleOpenPack}
            />
          </motion.div>
        )}

        {/* ═══ DECK BUILDER ═══ */}
        {view === "deck_builder" && (
          <motion.div key="deck_builder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen">
            <DeckBuilder
              collection={collectionCards.filter(c => c.owned).map(c => ({
                ...c,
                maxCopies: c.rarity === "legendary" || c.rarity === "mythic" || c.rarity === "neyon" ? 1 : c.rarity === "rare" || c.rarity === "epic" ? 2 : 3,
              }))}
              faction={playerFaction || "architect"}
              onSave={async (deck) => {
                dischordiaSounds.play("button_click");
                // Save deck to server
                if (isAuthenticated) {
                  try {
                    const cardList = Object.entries(
                      deck.reduce<Record<string, number>>((acc, c) => {
                        acc[c.id] = (acc[c.id] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([cardId, quantity]) => ({ cardId, quantity }));

                    if (serverDeckId) {
                      await updateDeck.mutateAsync({ deckId: serverDeckId, cardList });
                    } else {
                      await createDeck.mutateAsync({
                        name: `${FACTION_NAMES[playerFaction || "architect"]} Deck`,
                        deckType: "combined",
                        cardList,
                      });
                    }
                    utils.cardGame.myDecks.invalidate();
                  } catch (err) {
                    console.warn("[Dischordia] Failed to save deck to server:", err);
                  }
                }
                setView("menu");
              }}
              onBack={() => setView("menu")}
            />
          </motion.div>
        )}

        {/* ═══ PACK OPENING ═══ */}
        {view === "pack_opening" && (
          <PackOpening
            cards={packCards}
            packType="season1"
            onComplete={() => dischordiaSounds.play("victory")}
            onClose={() => setView("menu")}
          />
        )}

        {/* ═══ RANKED LADDER ═══ */}
        {view === "ranked" && (
          <motion.div key="ranked" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-4 sm:p-6 max-w-lg mx-auto">
            <button onClick={() => setView("menu")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground font-mono text-xs mb-6">
              <ArrowLeft size={14} /> Back
            </button>
            <h2 className="font-display text-xl tracking-[0.2em] text-white mb-6">RANKED LADDER</h2>

            {/* Current rank */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
              <span className="text-4xl">{tier.icon}</span>
              <div>
                <p className="font-display text-lg font-bold" style={{ color: tier.color }}>{tier.name}</p>
                <p className="font-mono text-sm text-white/40">{elo} ELO</p>
              </div>
              <div className="ml-auto text-right">
                <p className="font-mono text-sm text-green-400">{wins}W</p>
                <p className="font-mono text-sm text-red-400">{losses}L</p>
                <p className="font-mono text-[10px] text-white/30">{wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0}% WR</p>
              </div>
            </div>

            {/* Tier progression */}
            <div className="space-y-2">
              {RANKED_TIERS.map((t, i) => {
                const isCurrentTier = t === tier;
                const isReached = elo >= t.minElo;
                const nextTier = RANKED_TIERS[i + 1];
                const progressInTier = nextTier
                  ? Math.min(100, Math.max(0, ((elo - t.minElo) / (nextTier.minElo - t.minElo)) * 100))
                  : 100;

                return (
                  <div key={t.name} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    isCurrentTier ? "bg-white/10 border-white/20" : isReached ? "bg-white/5 border-white/5" : "bg-black/20 border-white/5 opacity-40"
                  }`}>
                    <span className="text-xl w-8">{t.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-xs font-bold" style={{ color: isReached ? t.color : "#666" }}>{t.name}</p>
                        <p className="font-mono text-[10px] text-white/30">{t.minElo}+</p>
                      </div>
                      {isCurrentTier && nextTier && (
                        <div className="mt-1 w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${progressInTier}%`, backgroundColor: t.color }} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button onClick={() => { setView("faction_select"); dischordiaSounds.play("button_click"); }}
              className="w-full mt-6 px-5 py-3 bg-primary/10 border border-primary/40 text-primary rounded-lg font-mono text-sm hover:bg-primary/20 transition-colors">
              PLAY RANKED MATCH
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
