/* ═══════════════════════════════════════════════════════
   THEME SELECTOR — Equip ship & character themes
   Shows available themes based on morality score,
   previews effects, and persists selection.
   ═══════════════════════════════════════════════════════ */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Ship, User, Lock, Check, ChevronRight, Cpu, Heart, Shield } from "lucide-react";
import {
  SHIP_THEMES, CHARACTER_THEMES,
  getAvailableShipThemes, getAvailableCharacterThemes,
  type ShipThemeDef, type CharacterThemeDef,
} from "@shared/moralityThemes";
import { useGame } from "@/contexts/GameContext";
import { toast } from "sonner";

interface ThemeSelectorProps {
  activeShipTheme: string;
  activeCharacterTheme: string;
  onEquipShipTheme: (id: string) => void;
  onEquipCharacterTheme: (id: string) => void;
}

export function ThemeSelector({
  activeShipTheme,
  activeCharacterTheme,
  onEquipShipTheme,
  onEquipCharacterTheme,
}: ThemeSelectorProps) {
  const { state } = useGame();
  const score = state.moralityScore;
  const [tab, setTab] = useState<"ship" | "character">("ship");

  const availableShip = getAvailableShipThemes(score);
  const availableChar = getAvailableCharacterThemes(score);
  const availableShipIds = new Set(availableShip.map(t => t.id));
  const availableCharIds = new Set(availableChar.map(t => t.id));

  const sideIcon = (side: string) => {
    if (side === "machine") return <Cpu size={12} className="text-red-400" />;
    if (side === "humanity") return <Heart size={12} className="text-green-400" />;
    return <Shield size={12} className="text-purple-400" />;
  };

  return (
    <div className="border border-border/30 rounded-lg bg-card/30 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/20 bg-card/50">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-primary" />
          <span className="font-display text-xs font-bold tracking-[0.15em]">THEME SELECTOR</span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">
          MORALITY: <span className={score < 0 ? "text-red-400" : score > 0 ? "text-green-400" : "text-purple-400"}>{score}</span>
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/20">
        <button
          onClick={() => setTab("ship")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-mono transition-colors ${
            tab === "ship" ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Ship size={13} /> SHIP THEMES ({availableShip.length}/{SHIP_THEMES.length})
        </button>
        <button
          onClick={() => setTab("character")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-mono transition-colors ${
            tab === "character" ? "text-accent border-b-2 border-accent bg-accent/5" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User size={13} /> CHARACTER AURAS ({availableChar.length}/{CHARACTER_THEMES.length})
        </button>
      </div>

      {/* Theme Grid */}
      <div className="p-3 space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin">
        <AnimatePresence mode="wait">
          {tab === "ship" ? (
            <motion.div key="ship" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              {SHIP_THEMES.map((theme) => {
                const unlocked = availableShipIds.has(theme.id);
                const equipped = activeShipTheme === theme.id;
                return (
                  <ShipThemeCard
                    key={theme.id}
                    theme={theme}
                    unlocked={unlocked}
                    equipped={equipped}
                    onEquip={() => {
                      onEquipShipTheme(theme.id);
                      toast.success(`Ship theme set: ${theme.name}`);
                    }}
                  />
                );
              })}
            </motion.div>
          ) : (
            <motion.div key="char" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              {CHARACTER_THEMES.map((theme) => {
                const unlocked = availableCharIds.has(theme.id);
                const equipped = activeCharacterTheme === theme.id;
                return (
                  <CharThemeCard
                    key={theme.id}
                    theme={theme}
                    unlocked={unlocked}
                    equipped={equipped}
                    onEquip={() => {
                      onEquipCharacterTheme(theme.id);
                      toast.success(`Character aura set: ${theme.name}`);
                    }}
                  />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ShipThemeCard({ theme, unlocked, equipped, onEquip }: {
  theme: ShipThemeDef; unlocked: boolean; equipped: boolean; onEquip: () => void;
}) {
  return (
    <div className={`rounded-md border p-3 transition-all ${
      equipped ? "border-primary/50 bg-primary/10" :
      unlocked ? "border-border/30 bg-card/20 hover:border-primary/30 cursor-pointer" :
      "border-border/10 bg-card/5 opacity-50"
    }`}>
      <div className="flex items-start gap-3">
        {/* Color swatch */}
        <div
          className="w-10 h-10 rounded-md flex-shrink-0 flex items-center justify-center"
          style={{ backgroundColor: theme.glowColor + "20", border: `2px ${theme.borderStyle} ${theme.glowColor}40` }}
        >
          {unlocked ? (
            equipped ? <Check size={16} style={{ color: theme.glowColor }} /> : <Ship size={16} style={{ color: theme.glowColor }} />
          ) : (
            <Lock size={14} className="text-muted-foreground/50" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            {theme.side === "machine" ? <Cpu size={10} className="text-red-400" /> :
             theme.side === "humanity" ? <Heart size={10} className="text-green-400" /> :
             <Shield size={10} className="text-purple-400" />}
            <span className="font-mono text-xs font-semibold truncate">{theme.name}</span>
            {equipped && <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono">EQUIPPED</span>}
          </div>
          <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">{theme.description}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="font-mono text-[9px] text-muted-foreground/60">
              {theme.bgPattern.toUpperCase()} • {theme.particleEffect.toUpperCase()}
            </span>
            {!unlocked && (
              <span className="font-mono text-[9px] text-amber-400/70">
                REQ: {theme.requiredScore > 0 ? "+" : ""}{theme.requiredScore}
              </span>
            )}
          </div>
        </div>
        {unlocked && !equipped && (
          <button
            onClick={onEquip}
            className="flex-shrink-0 px-2 py-1 rounded text-[10px] font-mono bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors"
          >
            EQUIP
          </button>
        )}
      </div>
    </div>
  );
}

function CharThemeCard({ theme, unlocked, equipped, onEquip }: {
  theme: CharacterThemeDef; unlocked: boolean; equipped: boolean; onEquip: () => void;
}) {
  return (
    <div className={`rounded-md border p-3 transition-all ${
      equipped ? "border-accent/50 bg-accent/10" :
      unlocked ? "border-border/30 bg-card/20 hover:border-accent/30 cursor-pointer" :
      "border-border/10 bg-card/5 opacity-50"
    }`}>
      <div className="flex items-start gap-3">
        {/* Aura preview */}
        <div
          className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
          style={{
            backgroundColor: theme.auraColor + "15",
            boxShadow: unlocked ? `0 0 12px ${theme.auraColor}40, inset 0 0 8px ${theme.auraColor}20` : "none",
            border: `1px solid ${theme.auraColor}30`,
          }}
        >
          {unlocked ? (
            equipped ? <Check size={16} style={{ color: theme.auraColor }} /> : <User size={16} style={{ color: theme.auraColor }} />
          ) : (
            <Lock size={14} className="text-muted-foreground/50" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            {theme.side === "machine" ? <Cpu size={10} className="text-red-400" /> :
             theme.side === "humanity" ? <Heart size={10} className="text-green-400" /> :
             <Shield size={10} className="text-purple-400" />}
            <span className="font-mono text-xs font-semibold truncate">{theme.name}</span>
            {equipped && <span className="text-[9px] bg-accent/20 text-accent px-1.5 py-0.5 rounded font-mono">EQUIPPED</span>}
          </div>
          <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">{theme.description}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="font-mono text-[9px] text-muted-foreground/60">
              {theme.auraType.toUpperCase()} • {theme.overlayPattern === "none" ? "NO OVERLAY" : theme.overlayPattern.toUpperCase()}
            </span>
            {!unlocked && (
              <span className="font-mono text-[9px] text-amber-400/70">
                REQ: {theme.requiredScore > 0 ? "+" : ""}{theme.requiredScore}
              </span>
            )}
          </div>
        </div>
        {unlocked && !equipped && (
          <button
            onClick={onEquip}
            className="flex-shrink-0 px-2 py-1 rounded text-[10px] font-mono bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-colors"
          >
            EQUIP
          </button>
        )}
      </div>
    </div>
  );
}

export default ThemeSelector;
