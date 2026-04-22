/* ═══════════════════════════════════════════════════════
   COMPANION SELECTION — First 5 minutes onboarding

   After character creation, before entering the Ark, the player
   picks their first specimen companion. Elara presents them from
   the Collector's cloning archive.

   "Something in the archive responded to YOUR DNA specifically.
   This creature... it chose you."

   The player gets exactly 3 choices:
     1. Race pet  — one specimen from their race's archive
     2. Class pet — based on their character class
     3. Strain   — the Thought Virus pet, available to everyone
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ChevronRight, Sparkles } from "lucide-react";
import { useGame } from "@/contexts/GameContext";

import { assetUrl } from "@/lib/assetUrl";
interface CompanionOption {
  id: string;
  name: string;
  species: string;
  flavor: string;
  personality: string;
  bonus: string;
  color: string;
  portrait: string;
}

const COMPANION_OPTIONS: Record<string, CompanionOption[]> = {
  demagi: [
    { id: "lux", name: "Lux", species: "Holographic Fox", flavor: "A creature of pure light given form. It phases between solid and luminous.", personality: "Curious, playful, bonds fast", bonus: "+5% XP gain", color: "var(--energy-primary)", portrait: assetUrl("art/specimens/lux-fragment.png") },
    { id: "echo", name: "Echo", species: "Temporal Kitten", flavor: "A kitten that exists slightly out of sync with time. It purrs 3 seconds before you pet it.", personality: "Sleepy, ancient, wise", bonus: "+5% lore discovery", color: "#10b981", portrait: assetUrl("art/specimens/echo-fragment.png") },
    { id: "spore", name: "Spore", species: "Viral Symbiote", flavor: "A tendriled organism that bonds to its host. Not infectious. Just protective. Mostly.", personality: "Unsettling, fiercely loyal", bonus: "+5% Terminus defense", color: "var(--energy-error)", portrait: assetUrl("art/specimens/spore-fragment.png") },
  ],
  quarchon: [
    { id: "cipher", name: "Cipher", species: "Data Serpent", flavor: "A snake composed of moving data streams. Its scales are scrolling code.", personality: "Calculating, methodical", bonus: "+5% puzzle solve speed", color: "#a855f7", portrait: assetUrl("art/specimens/cipher-fragment.png") },
    { id: "flicker", name: "Flicker", species: "Static Bird", flavor: "A bird made of electromagnetic interference. It flickers in and out of visibility.", personality: "Alert, twitchy, brave", bonus: "+5% signal detection", color: "var(--energy-accent)", portrait: assetUrl("art/specimens/flicker-fragment.png") },
    { id: "gilt", name: "Gilt", species: "Golden Beetle", flavor: "A beetle with a shell that grows more ornate the more treasure it's near.", personality: "Greedy, affectionate", bonus: "+5% Dream income", color: "#fbbf24", portrait: assetUrl("art/specimens/gilt-fragment.png") },
  ],
  default: [
    { id: "lux", name: "Lux", species: "Holographic Fox", flavor: "A creature of pure light given form.", personality: "Curious, playful", bonus: "+5% XP gain", color: "var(--energy-primary)", portrait: assetUrl("art/specimens/lux-fragment.png") },
    { id: "cipher", name: "Cipher", species: "Data Serpent", flavor: "A snake composed of moving data streams.", personality: "Calculating", bonus: "+5% puzzle solve speed", color: "#a855f7", portrait: assetUrl("art/specimens/cipher-fragment.png") },
    { id: "echo", name: "Echo", species: "Temporal Kitten", flavor: "Exists slightly out of sync with time.", personality: "Ancient, wise", bonus: "+5% lore discovery", color: "#10b981", portrait: assetUrl("art/specimens/echo-fragment.png") },
  ],
};

const CLASS_PETS: Record<string, CompanionOption> = {
  soldier: { id: "auros", name: "Auros", species: "Gilded Lion", flavor: "A void-forged Nemean lion. Golden mane burning with contained plasma. The last of a species the Architect bred for war.", personality: "Noble, protective, judges cowardice", bonus: "+5% combat defense", color: "#fbbf24", portrait: assetUrl("art/specimens/auros-fragment.png") },
  spy: { id: "nyx", name: "Nyx", species: "Umbral Raven", flavor: "Agent Zero's lost companion, found in stasis labeled 'DO NOT OPEN.' She carries fragments of a dead agent's memories in her neural lattice.", personality: "Paranoid, brilliant, fiercely loyal", bonus: "+5% espionage success", color: "#6366f1", portrait: assetUrl("art/specimens/nyx-fragment.png") },
  assassin: { id: "toxis", name: "Toxis", species: "Blight Frog", flavor: "Found in the Viral Wastes — the only living thing in a Thought Virus dead zone. Its toxin exists 2 seconds in the future.", personality: "Patient, cold, efficient", bonus: "+5% critical hit chance", color: "#10b981", portrait: assetUrl("art/specimens/toxis-fragment.png") },
  engineer: { id: "cog", name: "Cog", species: "Lattice Golem", flavor: "Not cloned — it assembled itself from nanobots while you slept. It has no DNA. It chose you because your neural patterns matched its swarm frequency.", personality: "Curious, builds gifts from scrap", bonus: "+5% crafting success", color: "#f97316", portrait: assetUrl("art/specimens/cog-fragment.png") },
  oracle: { id: "sibyl", name: "Sibyl", species: "Dreaming Owl", flavor: "Eyes that show glimpses of futures that were supposed to happen. She doesn't sleep — she's already dreaming. Older than the Panopticon.", personality: "Cryptic, maternal, terrifyingly perceptive", bonus: "+5% lore discovery", color: "#8b5cf6", portrait: assetUrl("art/specimens/sibyl-fragment.png") },
};

const THOUGHT_VIRUS_PET: CompanionOption = {
  id: "strain", name: "Strain", species: "Living Infection", flavor: "A piece of the Source that developed independent consciousness. The only Thought Virus entity to ever defect. Or it's a Trojan horse. You won't know for a long time.", personality: "Mute at first, then achingly curious", bonus: "+5% Terminus resistance", color: "var(--energy-error)", portrait: assetUrl("art/specimens/strain-fragment.png"),
};

const ELARA_INTRO = [
  "Before you leave the Cryo Bay — there's something you need to see.",
  "The cloning pods activated when you woke up. That shouldn't have happened.",
  "The Collector's genetic archive responded to YOUR DNA specifically. Out of billions of preserved specimens... three stepped forward.",
  "Three souls responded to your awakening. One from the Collector's archive. One drawn by your training. And one... that shouldn't exist.",
];

interface Props {
  species: string;
  playerClass?: string;
  onComplete: (companionId: string) => void;
}

/** Simple seeded random so the race pet pick is stable across re-renders. */
function seededRandom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return ((h >>> 0) % 1000) / 1000;
}

const BOND_LABELS: string[] = ["RACE BOND", "CLASS BOND", "THOUGHT VIRUS"];
const BOND_LABEL_COLORS: string[] = ["var(--energy-primary)", "#fbbf24", "var(--energy-error)"];

export default function CompanionSelectionScene({ species, playerClass, onComplete }: Props) {
  const [phase, setPhase] = useState<"intro" | "select" | "bonding">("intro");
  const [introStep, setIntroStep] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [selected, setSelected] = useState<CompanionOption | null>(null);

  const options = useMemo(() => {
    // Pick one race pet (randomly from the race's available specimens, with stable seed)
    const racePets = COMPANION_OPTIONS[species] || COMPANION_OPTIONS.default;
    const rng = seededRandom(species + (playerClass || ""));
    const racePet = racePets[Math.floor(rng * racePets.length)];

    // Get class pet
    const classPet = playerClass ? CLASS_PETS[playerClass] : null;

    // Build the 3 choices
    return [racePet, classPet, THOUGHT_VIRUS_PET].filter(Boolean) as CompanionOption[];
  }, [species, playerClass]);

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
              <Sparkles size={40} className="void-text-energy mx-auto mb-4 animate-pulse" />
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-400/60" />
                <span className="font-mono text-[10px] void-text-energy tracking-[0.4em]">ELARA</span>
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
                {isTyping && <span className="inline-block w-2 h-4 void-bg-success ml-0.5 animate-pulse" />}
              </p>
            </motion.div>

            <div className="flex items-center justify-center gap-2 mt-8">
              {ELARA_INTRO.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all ${i === introStep ? "w-6 void-bg-success" : i < introStep ? "w-3 void-bg-success" : "w-3 bg-white/15"}`} />
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
          className="relative h-full flex flex-col items-center justify-center p-4 sm:p-6"
        >
          <div className="text-center mb-6 sm:mb-10">
            <p className="font-mono text-[9px] text-white/30 tracking-[0.3em] mb-2">CHOOSE YOUR COMPANION</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold void-text-energy mb-1">Three souls await.</h2>
            <p className="font-mono text-xs text-white/40">Choose one back.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl w-full">
            {options.slice(0, 3).map((option, i) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.2, type: "spring", damping: 20 }}
                onClick={() => handleSelect(option)}
                whileHover={{ scale: 1.04, y: -8 }}
                whileTap={{ scale: 0.98 }}
                className="group relative rounded-2xl overflow-hidden transition-all cursor-pointer"
                style={{
                  boxShadow: `0 0 40px ${option.color}15, 0 0 80px ${option.color}08`,
                }}
              >
                {/* Category label */}
                <div className="py-2 text-center">
                  <span
                    className="font-mono text-[9px] tracking-[0.3em] font-bold"
                    style={{ color: BOND_LABEL_COLORS[i] || option.color }}
                  >
                    {BOND_LABELS[i] || "EIDOLON"}
                  </span>
                </div>

                {/* Portrait image — hero showcase */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={option.portrait}
                    alt={option.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Gradient overlay — bottom fade for text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  {/* Side glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ boxShadow: `inset 0 0 60px ${option.color}30` }}
                  />
                  {/* Energy ring border */}
                  <div
                    className="absolute inset-0 rounded-2xl border-2 opacity-30 group-hover:opacity-80 transition-opacity duration-300"
                    style={{ borderColor: option.color }}
                  />

                  {/* Name + info overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-display text-2xl font-black tracking-wide mb-0.5" style={{ color: option.color, textShadow: `0 0 20px ${option.color}80` }}>
                      {option.name}
                    </h3>
                    <p className="font-mono text-[9px] tracking-[0.2em] mb-3" style={{ color: `${option.color}99` }}>
                      {option.species.toUpperCase()}
                    </p>
                    <p className="font-mono text-[10px] text-white/70 leading-relaxed mb-3">
                      {option.flavor}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[8px] text-white/40">
                        {option.personality}
                      </p>
                      <p className="font-mono text-[9px] font-bold" style={{ color: option.color }}>
                        {option.bonus}
                      </p>
                    </div>

                    {/* Choose prompt */}
                    <div className="mt-3 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <div className="px-4 py-1.5 rounded-full border font-mono text-[10px] tracking-[0.2em]" style={{ borderColor: `${option.color}60`, color: option.color, background: `${option.color}15` }}>
                        CHOOSE {option.name.toUpperCase()}
                      </div>
                    </div>
                  </div>
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
          className="relative h-full flex items-center justify-center p-6 overflow-hidden"
        >
          {/* Full-screen portrait background — blurred and dimmed */}
          <motion.img
            src={selected.portrait}
            alt=""
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "blur(30px) saturate(1.5)" }}
          />
          <div className="absolute inset-0 bg-black/60" />

          <div className="relative text-center z-10">
            {/* Portrait circle reveal */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15, delay: 0.2 }}
              className="w-40 h-40 sm:w-52 sm:h-52 rounded-full overflow-hidden mx-auto mb-6 border-2"
              style={{
                borderColor: selected.color,
                boxShadow: `0 0 40px ${selected.color}60, 0 0 80px ${selected.color}30, inset 0 0 30px ${selected.color}20`,
              }}
            >
              <img src={selected.portrait} alt={selected.name} className="w-full h-full object-cover" />
            </motion.div>

            {/* Pulsing energy ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.3, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-44 h-44 sm:w-56 sm:h-56 rounded-full border"
              style={{ borderColor: `${selected.color}30` }}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p className="font-mono text-[10px] text-white/40 tracking-[0.4em] mb-2">BOND FORGED</p>
              <h2 className="font-display text-4xl sm:text-5xl font-black mb-2" style={{ color: selected.color, textShadow: `0 0 30px ${selected.color}80` }}>
                {selected.name}
              </h2>
              <p className="font-mono text-[10px] tracking-[0.2em] mb-1" style={{ color: `${selected.color}99` }}>
                {selected.species.toUpperCase()}
              </p>
              <p className="font-mono text-sm text-white/60 italic mt-3">
                &ldquo;{selected.personality}&rdquo;
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="mt-8"
            >
              <p className="font-mono text-xs void-text-energy tracking-[0.15em]">The Ark awaits, Operative.</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
