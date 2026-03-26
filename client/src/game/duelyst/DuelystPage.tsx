/* ═══════════════════════════════════════════════════════
   DUELYST PAGE — Faction selection, game setup, and
   main game flow for the tactical card game
   ═══════════════════════════════════════════════════════ */
import { useState } from "react";
import type { Faction } from "./types";
import { FACTION_COLORS, FACTION_NAMES, FACTION_DESCRIPTIONS } from "./types";
import { getFactionCardCounts } from "./cardAdapter";
import DuelystGameUI from "./DuelystGameUI";
import { motion, AnimatePresence } from "framer-motion";
import {
  Swords, Shield, Zap, Eye, Skull, Atom,
  ChevronRight, ArrowLeft, Trophy, Gamepad2,
} from "lucide-react";

type View = "menu" | "faction_select" | "playing" | "result";

const FACTION_ICONS: Record<Faction, typeof Swords> = {
  panopticon: Eye,
  architects: Shield,
  demagi: Skull,
  quarchon: Atom,
  neyon: Zap,
  chaos: Swords,
  neutral: Gamepad2,
};

const AI_FACTIONS: Faction[] = ["panopticon", "architects", "demagi", "quarchon", "neyon", "chaos"];

export default function DuelystPage() {
  const [view, setView] = useState<View>("menu");
  const [playerFaction, setPlayerFaction] = useState<Faction | null>(null);
  const [opponentFaction, setOpponentFaction] = useState<Faction | null>(null);
  const [result, setResult] = useState<"player" | "opponent" | null>(null);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  const factionCounts = getFactionCardCounts();

  const handleFactionSelect = (faction: Faction) => {
    setPlayerFaction(faction);
    // Pick random AI faction (different from player)
    const available = AI_FACTIONS.filter(f => f !== faction);
    setOpponentFaction(available[Math.floor(Math.random() * available.length)]);
  };

  const handleStartGame = () => {
    if (!playerFaction || !opponentFaction) return;
    setView("playing");
  };

  const handleGameEnd = (winner: "player" | "opponent") => {
    setResult(winner);
    if (winner === "player") setWins(w => w + 1);
    else setLosses(l => l + 1);
    setView("result");
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {/* ═══ MENU ═══ */}
        {view === "menu" && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[80vh] gap-8 p-4"
          >
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center mb-3">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50" />
                <span className="font-mono text-[10px] text-primary/70 tracking-[0.4em]">TACTICAL WARFARE</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50" />
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-black tracking-wider">
                <span className="text-primary glow-cyan">DUELYST</span>
              </h1>
              <p className="font-mono text-sm text-muted-foreground mt-2 max-w-md">
                Command your faction on a 5×9 tactical grid. Summon units, cast spells,
                and destroy the enemy general to claim victory.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button
                onClick={() => setView("faction_select")}
                className="group flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary/10 border border-primary/40 text-primary font-mono text-sm hover:bg-primary/20 hover:box-glow-cyan transition-all"
              >
                <Swords size={16} />
                START BATTLE
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            {(wins > 0 || losses > 0) && (
              <div className="flex gap-6 font-mono text-sm">
                <span className="text-green-400">W: {wins}</span>
                <span className="text-red-400">L: {losses}</span>
              </div>
            )}
          </motion.div>
        )}

        {/* ═══ FACTION SELECT ═══ */}
        {view === "faction_select" && (
          <motion.div
            key="faction"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 sm:p-6 max-w-4xl mx-auto"
          >
            <button
              onClick={() => setView("menu")}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground font-mono text-xs mb-6 transition-colors"
            >
              <ArrowLeft size={14} /> Back
            </button>

            <h2 className="font-display text-xl tracking-[0.2em] text-foreground mb-2">CHOOSE YOUR FACTION</h2>
            <p className="font-mono text-xs text-muted-foreground mb-6">Each faction has unique cards and a Bloodborn Spell</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {AI_FACTIONS.map(faction => {
                const Icon = FACTION_ICONS[faction];
                const selected = playerFaction === faction;
                const color = FACTION_COLORS[faction];
                return (
                  <button
                    key={faction}
                    onClick={() => handleFactionSelect(faction)}
                    className={`text-left p-4 rounded-lg border-2 transition-all hover-lift ${
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-border/30 bg-card/30 hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "22", border: `2px solid ${color}` }}>
                        <Icon size={20} style={{ color }} />
                      </div>
                      <div>
                        <p className="font-display text-sm font-bold tracking-wider">{FACTION_NAMES[faction]}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">{factionCounts[faction]} cards</p>
                      </div>
                    </div>
                    <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">
                      {FACTION_DESCRIPTIONS[faction]}
                    </p>
                    {selected && (
                      <div className="mt-2 flex items-center gap-1 text-primary font-mono text-[10px]">
                        <Swords size={10} /> SELECTED
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {playerFaction && opponentFaction && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="flex items-center gap-4 font-mono text-sm">
                  <span style={{ color: FACTION_COLORS[playerFaction] }}>{FACTION_NAMES[playerFaction]}</span>
                  <span className="text-muted-foreground">vs</span>
                  <span style={{ color: FACTION_COLORS[opponentFaction] }}>{FACTION_NAMES[opponentFaction]}</span>
                </div>
                <button
                  onClick={handleStartGame}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-mono text-sm font-bold hover:bg-primary/80 transition-colors"
                >
                  BEGIN BATTLE
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ═══ PLAYING ═══ */}
        {view === "playing" && playerFaction && opponentFaction && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DuelystGameUI
              playerFaction={playerFaction}
              opponentFaction={opponentFaction}
              onGameEnd={handleGameEnd}
              onBack={() => setView("menu")}
            />
          </motion.div>
        )}

        {/* ═══ RESULT ═══ */}
        {view === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[80vh] gap-6 p-4"
          >
            <Trophy size={48} className={result === "player" ? "text-amber-400" : "text-muted-foreground"} />
            <h2 className={`font-display text-3xl tracking-[0.3em] ${result === "player" ? "text-primary glow-cyan" : "text-destructive"}`}>
              {result === "player" ? "VICTORY" : "DEFEAT"}
            </h2>
            <p className="font-mono text-sm text-muted-foreground">
              {result === "player"
                ? "The enemy general has fallen. Glory to your faction."
                : "Your general has been destroyed. Regroup and try again."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setView("faction_select"); setResult(null); }}
                className="px-5 py-2 bg-primary/10 border border-primary/40 text-primary rounded font-mono text-sm hover:bg-primary/20 transition-colors"
              >
                PLAY AGAIN
              </button>
              <button
                onClick={() => { setView("menu"); setResult(null); }}
                className="px-5 py-2 border border-border/30 text-muted-foreground rounded font-mono text-sm hover:text-foreground transition-colors"
              >
                MAIN MENU
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
