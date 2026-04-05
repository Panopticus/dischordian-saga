/* ═══════════════════════════════════════════════════════
   COMPANION SELECTION — First 5 minutes onboarding

   After character creation, before entering the Ark, the player
   picks their first specimen companion. Elara presents them from
   the Collector's cloning archive.

   "Something in the archive responded to YOUR DNA specifically.
   This creature... it chose you."

   The 3 options depend on the player's species — but Ne-Yons
   can choose any.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ChevronRight, Sparkles } from "lucide-react";
import { useGame } from "@/contexts/GameContext";

interface CompanionOption {
  id: string;
  name: string;
  species: string;
  flavor: string;
  personality: string;
  bonus: string;
  color: string;
  emoji: string;
}

const COMPANION_OPTIONS: Record<string, CompanionOption[]> = {
  demagi: [
    { id: "lux", name: "Lux", species: "Holographic Fox", flavor: "A creature of pure light given form. It phases between solid and luminous.", personality: "Curious, playful, bonds fast", bonus: "+5% XP gain", color: "#22d3ee", emoji: "🦊" },
    { id: "echo", name: "Echo", species: "Temporal Kitten", flavor: "A kitten that exists slightly out of sync with time. It purrs 3 seconds before you pet it.", personality: "Sleepy, ancient, wise", bonus: "+5% lore discovery", color: "#10b981", emoji: "🐈" },
    { id: "spore", name: "Spore", species: "Viral Symbiote", flavor: "A tendriled organism that bonds to its host. Not infectious. Just protective. Mostly.", personality: "Unsettling, fiercely loyal", bonus: "+5% Terminus defense", color: "#ef4444", emoji: "🌸" },
  ],
  quarchon: [
    { id: "cipher", name: "Cipher", species: "Data Serpent", flavor: "A snake composed of moving data streams. Its scales are scrolling code.", personality: "Calculating, methodical", bonus: "+5% puzzle solve speed", color: "#a855f7", emoji: "🐍" },
    { id: "flicker", name: "Flicker", species: "Static Bird", flavor: "A bird made of electromagnetic interference. It flickers in and out of visibility.", personality: "Alert, twitchy, brave", bonus: "+5% signal detection", color: "#f59e0b", emoji: "🦅" },
    { id: "gilt", name: "Gilt", species: "Golden Beetle", flavor: "A beetle with a shell that grows more ornate the more treasure it's near.", personality: "Greedy, affectionate", bonus: "+5% Dream income", color: "#fbbf24", emoji: "🪲" },
  ],
  neyon: [
    { id: "lux", name: "Lux", species: "Holographic Fox", flavor: "A creature of pure light given form.", personality: "Curious, playful", bonus: "+5% XP gain", color: "#22d3ee", emoji: "🦊" },
    { id: "cipher", name: "Cipher", species: "Data Serpent", flavor: "A snake composed of moving data streams.", personality: "Calculating", bonus: "+5% puzzle solve speed", color: "#a855f7", emoji: "🐍" },
    { id: "echo", name: "Echo", species: "Temporal Kitten", flavor: "Exists slightly out of sync with time.", personality: "Ancient, wise", bonus: "+5% lore discovery", color: "#10b981", emoji: "🐈" },
    { id: "glyph", name: "Glyph", species: "Text Moth", flavor: "A moth whose wings display living words.", personality: "Beautiful, dangerous", bonus: "+5% crafting success", color: "#6366f1", emoji: "🦋" },
  ],
};

const ELARA_INTRO = [
  "Before you leave the Cryo Bay — there's something you need to see.",
  "The cloning pods activated when you woke up. That shouldn't have happened.",
  "The Collector's genetic archive responded to YOUR DNA specifically. Out of billions of preserved specimens... three stepped forward.",
  "Three chose you. You get to choose back.",
];

interface Props {
  species: string;
  onComplete: (companionId: string) => void;
}

export default function CompanionSelectionScene({ species, onComplete }: Props) {
  const [phase, setPhase] = useState<"intro" | "select" | "bonding">("intro");
  const [introStep, setIntroStep] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [selected, setSelected] = useState<CompanionOption | null>(null);

  const options = COMPANION_OPTIONS[species] || COMPANION_OPTIONS.neyon;

  // Typewriter for intro
  useEffect(() => {
    if (phase !== "intro" || introStep >= ELARA_INTRO.length) return;
    const line = ELARA_INTRO[introStep];
    setIsTyping(true);
    setTypedText("");
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < line.length) {
        setTypedText(line.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [phase, introStep]);

  const advance = useCallback(() => {
    if (phase === "intro") {
      if (isTyping) {
        setTypedText(ELARA_INTRO[introStep]);
        setIsTyping(false);
        return;
      }
      if (introStep < ELARA_INTRO.length - 1) {
        setIntroStep(s => s + 1);
      } else {
        setPhase("select");
      }
    }
  }, [phase, introStep, isTyping]);

  const handleSelect = (option: CompanionOption) => {
    setSelected(option);
    setPhase("bonding");
    setTimeout(() => onComplete(option.id), 4000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-black to-purple-950/20" />
      <div className="absolute inset-0 grid-bg opacity-20" />

      {/* ═══ INTRO ═══ */}
      {phase === "intro" && (
        <div onClick={advance} className="relative h-full flex items-center justify-center p-6 cursor-pointer">
          <div className="max-w-xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <Sparkles size={40} className="text-cyan-400 mx-auto mb-4 animate-pulse" />
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-400/60" />
                <span className="font-mono text-[10px] text-cyan-400/80 tracking-[0.4em]">ELARA</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-400/60" />
              </div>
            </motion.div>

            <motion.div
              key={introStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="min-h-[80px] flex items-center justify-center"
            >
              <p className="font-mono text-sm sm:text-base text-white/90 leading-relaxed">
                {typedText}
                {isTyping && <span className="inline-block w-2 h-4 bg-cyan-400 ml-0.5 animate-pulse" />}
              </p>
            </motion.div>

            <div className="flex items-center justify-center gap-2 mt-8">
              {ELARA_INTRO.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all ${i === introStep ? "w-6 bg-cyan-400" : i < introStep ? "w-3 bg-cyan-400/40" : "w-3 bg-white/15"}`} />
              ))}
            </div>

            <p className="font-mono text-[9px] text-white/20 mt-6 tracking-wider">
              {isTyping ? "CLICK TO SKIP" : introStep < ELARA_INTRO.length - 1 ? "CLICK TO CONTINUE" : "CLICK TO SEE YOUR CHOICES"}
            </p>
          </div>
        </div>
      )}

      {/* ═══ SELECTION ═══ */}
      {phase === "select" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-full flex flex-col items-center justify-center p-4"
        >
          <div className="text-center mb-8">
            <p className="font-mono text-[9px] text-white/30 tracking-[0.3em] mb-2">CHOOSE YOUR COMPANION</p>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-cyan-400 mb-1">Three chose you.</h2>
            <p className="font-mono text-xs text-white/50">Choose one back.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl w-full">
            {options.slice(0, 3).map((option, i) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                onClick={() => handleSelect(option)}
                whileHover={{ scale: 1.03, y: -4 }}
                className="group p-4 rounded-xl border transition-all text-left"
                style={{
                  background: `linear-gradient(135deg, ${option.color}08 0%, rgba(0,0,0,0.6) 100%)`,
                  borderColor: `${option.color}30`,
                  boxShadow: `0 0 30px ${option.color}10`,
                }}
              >
                <div className="text-5xl mb-3 text-center animate-pulse" style={{ filter: `drop-shadow(0 0 12px ${option.color}80)` }}>
                  {option.emoji}
                </div>
                <h3 className="font-display text-lg font-bold mb-1 text-center" style={{ color: option.color }}>
                  {option.name}
                </h3>
                <p className="font-mono text-[9px] text-white/40 tracking-wider text-center mb-3">
                  {option.species.toUpperCase()}
                </p>
                <p className="font-mono text-[10px] text-white/70 leading-relaxed mb-3 min-h-[48px]">
                  {option.flavor}
                </p>
                <div className="space-y-1">
                  <p className="font-mono text-[8px] text-white/30">Personality: <span className="text-white/50">{option.personality}</span></p>
                  <p className="font-mono text-[8px]" style={{ color: `${option.color}CC` }}>{option.bonus}</p>
                </div>
                <div className="mt-3 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="font-mono text-[9px]" style={{ color: option.color }}>CHOOSE</span>
                  <ChevronRight size={10} style={{ color: option.color }} />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* ═══ BONDING ═══ */}
      {phase === "bonding" && selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-full flex items-center justify-center p-6"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 12 }}
              className="text-8xl mb-6"
              style={{ filter: `drop-shadow(0 0 40px ${selected.color})` }}
            >
              {selected.emoji}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="font-mono text-[10px] text-white/30 tracking-[0.3em] mb-2">BOND FORGED</p>
              <h2 className="font-display text-3xl font-bold mb-2" style={{ color: selected.color }}>
                {selected.name}
              </h2>
              <p className="font-mono text-sm text-white/60 italic">
                "{selected.personality}"
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="mt-8"
            >
              <p className="font-mono text-xs text-cyan-400/70">The Ark awaits, Operative.</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
