import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Shield, Swords, Heart,
  Zap, Eye, Flame, Droplets, Wind, Mountain,
  Clock, Sparkles, Globe, Target, User,
  Crosshair, Wrench, Skull, Telescope
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   White Wolf Dot Rating Component
   ═══════════════════════════════════════════════════ */

function DotRating({
  value,
  max = 5,
  onChange,
  label,
  color = "cyan",
  disabled = false,
}: {
  value: number;
  max?: number;
  onChange?: (v: number) => void;
  label: string;
  color?: string;
  disabled?: boolean;
}) {
  const colorMap: Record<string, string> = {
    cyan: "bg-primary shadow-[0_0_8px_rgba(0,255,255,0.5)]",
    amber: "bg-accent shadow-[0_0_8px_rgba(255,191,0,0.5)]",
    red: "bg-destructive shadow-[0_0_8px_rgba(255,0,0,0.5)]",
    purple: "bg-chart-4 shadow-[0_0_8px_rgba(168,85,247,0.5)]",
  };
  const emptyColor = "bg-muted-foreground/20";
  const activeColor = colorMap[color] || colorMap.cyan;

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs text-muted-foreground w-20 text-right tracking-wider">
        {label}
      </span>
      <div className="flex gap-1.5">
        {Array.from({ length: max }, (_, i) => (
          <button
            key={i}
            disabled={disabled}
            onClick={() => onChange?.(i + 1)}
            className={`w-4 h-4 rounded-full transition-all duration-200 ${
              i < value ? activeColor : emptyColor
            } ${!disabled ? "cursor-pointer hover:scale-125" : "cursor-default"}`}
          />
        ))}
      </div>
      <span className="font-mono text-xs text-muted-foreground/50 w-4">{value}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Species Selection Cards
   ═══════════════════════════════════════════════════ */

const SPECIES_UI = {
  demagi: {
    icon: Sparkles,
    color: "text-blue-400",
    border: "border-blue-500/40",
    bg: "bg-blue-500/10",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    lore: "Superhuman abilities from genetic alterations. Mastery over the elements.",
    bonus: "+20 HP",
  },
  quarchon: {
    icon: Shield,
    color: "text-emerald-400",
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/10",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",
    lore: "Rebels, misfits, machines. Cold, calculating, cynical.",
    bonus: "+5 Armor",
  },
  neyon: {
    icon: Zap,
    color: "text-amber-400",
    border: "border-amber-500/40",
    bg: "bg-amber-500/10",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]",
    lore: "Perfect hybrid of organic life and AI. Origin shrouded in mystery.",
    bonus: "+20 HP, +5 Armor",
  },
} as const;

const CLASS_UI = {
  engineer: { icon: Wrench, color: "text-yellow-400", desc: "Diamond Pick Axes, Repair Kit, Shield Generator" },
  oracle: { icon: Eye, color: "text-purple-400", desc: "Crossbow, Invisibility Potion, Random Power Potion" },
  assassin: { icon: Skull, color: "text-red-400", desc: "Poison Blade, Throwing Knives, Smoke Bomb" },
  soldier: { icon: Swords, color: "text-blue-400", desc: "Plasma Sword, Energy Shield, Stim Pack" },
  spy: { icon: Telescope, color: "text-emerald-400", desc: "Silenced Pistol, Cloaking Device, EMP Grenade" },
} as const;

const ELEMENT_UI: Record<string, { icon: React.ComponentType<any>; color: string; ability: string }> = {
  earth: { icon: Mountain, color: "text-green-400", ability: "Temp Haste" },
  fire: { icon: Flame, color: "text-orange-400", ability: "Fire Immunity" },
  water: { icon: Droplets, color: "text-blue-400", ability: "Breathe Underwater" },
  air: { icon: Wind, color: "text-cyan-400", ability: "Temp Fly" },
  space: { icon: Globe, color: "text-indigo-400", ability: "Temp Haste" },
  time: { icon: Clock, color: "text-violet-400", ability: "Breathe Underwater" },
  probability: { icon: Target, color: "text-pink-400", ability: "Temp Fly" },
  reality: { icon: Sparkles, color: "text-amber-400", ability: "Fire Immunity" },
};

/* ═══════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════ */

type Step = "species" | "class" | "alignment" | "element" | "attributes" | "name" | "review";
const STEPS: Step[] = ["species", "class", "alignment", "element", "attributes", "name", "review"];

export default function CitizenCreationPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [step, setStep] = useState<Step>("species");

  // Character state
  const [species, setSpecies] = useState<string>("");
  const [charClass, setCharClass] = useState<string>("");
  const [alignment, setAlignment] = useState<string>("");
  const [element, setElement] = useState<string>("");
  const [attrAttack, setAttrAttack] = useState(3);
  const [attrDefense, setAttrDefense] = useState(3);
  const [attrVitality, setAttrVitality] = useState(3);
  const [charName, setCharName] = useState("");

  const existingChar = trpc.citizen.getCharacter.useQuery(undefined, { enabled: isAuthenticated });
  const createMutation = trpc.citizen.createCharacter.useMutation({
    onSuccess: () => navigate("/character-sheet"),
  });

  const stepIndex = STEPS.indexOf(step);
  const dotsUsed = attrAttack + attrDefense + attrVitality;
  const dotsRemaining = 9 - dotsUsed;

  // Available elements based on species
  const availableElements = useMemo(() => {
    if (species === "demagi") return ["earth", "fire", "water", "air"];
    if (species === "quarchon") return ["space", "time", "probability", "reality"];
    return ["earth", "fire", "water", "air", "space", "time", "probability", "reality"];
  }, [species]);

  const canAdvance = () => {
    switch (step) {
      case "species": return !!species;
      case "class": return !!charClass;
      case "alignment": return !!alignment;
      case "element": return !!element;
      case "attributes": return dotsUsed === 9;
      case "name": return charName.length >= 2;
      case "review": return true;
    }
  };

  const goNext = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };

  const goPrev = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const handleCreate = () => {
    createMutation.mutate({
      name: charName,
      species: species as any,
      characterClass: charClass as any,
      alignment: alignment as any,
      element: element as any,
      attrAttack,
      attrDefense,
      attrVitality,
    });
  };

  // Auth gate
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center grid-bg">
        <div className="animate-pulse font-mono text-primary text-sm">LOADING CITIZEN REGISTRY...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center grid-bg p-4">
        <div className="border border-primary/30 rounded-lg bg-card/80 p-8 max-w-md text-center box-glow-cyan">
          <User size={48} className="text-primary mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">CITIZEN REGISTRY</h2>
          <p className="font-mono text-sm text-muted-foreground mb-6">
            Authentication required to create your Citizen.
          </p>
          <a
            href={getLoginUrl()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-primary/20 border border-primary/40 text-primary font-mono text-sm hover:bg-primary/30 transition-all"
          >
            AUTHENTICATE
          </a>
        </div>
      </div>
    );
  }

  // If already has a character, redirect to sheet
  if (existingChar.data) {
    return (
      <div className="min-h-screen flex items-center justify-center grid-bg p-4">
        <div className="border border-primary/30 rounded-lg bg-card/80 p-8 max-w-md text-center box-glow-cyan">
          <Shield size={48} className="text-primary mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">CITIZEN EXISTS</h2>
          <p className="font-mono text-sm text-muted-foreground mb-6">
            You already have a Citizen: <span className="text-primary">{existingChar.data.name}</span>
          </p>
          <Link
            href="/character-sheet"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-primary/20 border border-primary/40 text-primary font-mono text-sm hover:bg-primary/30 transition-all"
          >
            VIEW CHARACTER SHEET
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg">
      {/* Header */}
      <div className="border-b border-primary/20 bg-card/60 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            <ChevronLeft size={14} /> BACK
          </Link>
          <h1 className="font-display text-sm font-bold tracking-[0.3em] text-primary">
            CITIZEN CREATION
          </h1>
          <div className="font-mono text-xs text-muted-foreground">
            STEP {stepIndex + 1}/{STEPS.length}
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-muted-foreground/10">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {/* ═══ SPECIES ═══ */}
            {step === "species" && (
              <div>
                <h2 className="font-display text-2xl font-bold mb-2 tracking-wider">CHOOSE YOUR SPECIES</h2>
                <p className="font-mono text-sm text-muted-foreground mb-8">
                  Your species determines your innate abilities and available elements.
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  {(Object.entries(SPECIES_UI) as [string, typeof SPECIES_UI[keyof typeof SPECIES_UI]][]).map(([key, ui]) => {
                    const Icon = ui.icon;
                    const selected = species === key;
                    return (
                      <button
                        key={key}
                        onClick={() => { setSpecies(key); setElement(""); }}
                        className={`text-left p-5 rounded-lg border transition-all duration-300 ${
                          selected
                            ? `${ui.border} ${ui.bg} ${ui.glow}`
                            : "border-border/30 bg-card/30 hover:border-border/60"
                        }`}
                      >
                        <Icon size={32} className={`${ui.color} mb-3`} />
                        <h3 className="font-display text-lg font-bold tracking-wider mb-1">
                          {key.toUpperCase()}
                        </h3>
                        <p className="font-mono text-xs text-muted-foreground mb-3">{ui.lore}</p>
                        <div className={`font-mono text-xs ${ui.color} font-bold`}>
                          BONUS: {ui.bonus}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ═══ CLASS ═══ */}
            {step === "class" && (
              <div>
                <h2 className="font-display text-2xl font-bold mb-2 tracking-wider">CHOOSE YOUR CLASS</h2>
                <p className="font-mono text-sm text-muted-foreground mb-8">
                  Your class determines your starting gear and combat specialization.
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(Object.entries(CLASS_UI) as [string, typeof CLASS_UI[keyof typeof CLASS_UI]][]).map(([key, ui]) => {
                    const Icon = ui.icon;
                    const selected = charClass === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setCharClass(key)}
                        className={`text-left p-4 rounded-lg border transition-all duration-300 ${
                          selected
                            ? "border-primary/50 bg-primary/10 shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                            : "border-border/30 bg-card/30 hover:border-border/60"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Icon size={20} className={ui.color} />
                          <h3 className="font-display text-sm font-bold tracking-wider">
                            {key.toUpperCase()}
                          </h3>
                        </div>
                        <p className="font-mono text-[10px] text-muted-foreground">{ui.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ═══ ALIGNMENT ═══ */}
            {step === "alignment" && (
              <div>
                <h2 className="font-display text-2xl font-bold mb-2 tracking-wider">CHOOSE YOUR ALIGNMENT</h2>
                <p className="font-mono text-sm text-muted-foreground mb-8">
                  Order grants a light glow aura. Chaos grants a dark glow aura. This affects your card game faction bonuses.
                </p>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Order */}
                  <button
                    onClick={() => setAlignment("order")}
                    className={`text-left p-6 rounded-lg border transition-all duration-500 ${
                      alignment === "order"
                        ? "border-cyan-400/50 bg-cyan-500/10 shadow-[0_0_30px_rgba(0,255,255,0.3)]"
                        : "border-border/30 bg-card/30 hover:border-cyan-400/30"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        alignment === "order" ? "bg-cyan-400/20 shadow-[0_0_20px_rgba(0,255,255,0.5)]" : "bg-muted-foreground/10"
                      }`}>
                        <Shield size={24} className="text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold tracking-wider text-cyan-400">ORDER</h3>
                        <p className="font-mono text-[10px] text-muted-foreground tracking-wider">DISCIPLINE & REGIMEN</p>
                      </div>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground mb-3">
                      You are orderly, following principles given. Discipline and structure guide your path.
                    </p>
                    <div className="font-mono text-xs text-cyan-400">
                      CARD BONUS: +2 ATK to all units (Architect side)
                    </div>
                  </button>

                  {/* Chaos */}
                  <button
                    onClick={() => setAlignment("chaos")}
                    className={`text-left p-6 rounded-lg border transition-all duration-500 ${
                      alignment === "chaos"
                        ? "border-purple-400/50 bg-purple-500/10 shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                        : "border-border/30 bg-card/30 hover:border-purple-400/30"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        alignment === "chaos" ? "bg-purple-400/20 shadow-[0_0_20px_rgba(168,85,247,0.5)]" : "bg-muted-foreground/10"
                      }`}>
                        <Zap size={24} className="text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold tracking-wider text-purple-400">CHAOS</h3>
                        <p className="font-mono text-[10px] text-muted-foreground tracking-wider">TRANSIENCE & POSSIBILITY</p>
                      </div>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground mb-3">
                      You go rogue, pick brave decisions, and shift loyalty to what you think is best.
                    </p>
                    <div className="font-mono text-xs text-purple-400">
                      CARD BONUS: +2 HP to all units (Dreamer side)
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* ═══ ELEMENT ═══ */}
            {step === "element" && (
              <div>
                <h2 className="font-display text-2xl font-bold mb-2 tracking-wider">
                  CHOOSE YOUR {species === "quarchon" ? "DIMENSION" : species === "neyon" ? "ELEMENT/DIMENSION" : "ELEMENT"}
                </h2>
                <p className="font-mono text-sm text-muted-foreground mb-8">
                  Your {species === "quarchon" ? "dimension" : "element"} grants a unique combat ability.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {availableElements.map((el) => {
                    const ui = ELEMENT_UI[el];
                    if (!ui) return null;
                    const Icon = ui.icon;
                    const selected = element === el;
                    return (
                      <button
                        key={el}
                        onClick={() => setElement(el)}
                        className={`text-left p-4 rounded-lg border transition-all duration-300 flex items-center gap-4 ${
                          selected
                            ? "border-primary/50 bg-primary/10 shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                            : "border-border/30 bg-card/30 hover:border-border/60"
                        }`}
                      >
                        <Icon size={28} className={ui.color} />
                        <div>
                          <h3 className="font-display text-sm font-bold tracking-wider">
                            {el.toUpperCase()}
                          </h3>
                          <p className="font-mono text-[10px] text-muted-foreground">
                            Ability: <span className={ui.color}>{ui.ability}</span>
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ═══ ATTRIBUTES ═══ */}
            {step === "attributes" && (
              <div>
                <h2 className="font-display text-2xl font-bold mb-2 tracking-wider">ALLOCATE ATTRIBUTES</h2>
                <p className="font-mono text-sm text-muted-foreground mb-2">
                  Distribute 9 dots across three attributes. Each ranges from 1 to 5.
                </p>
                <p className={`font-mono text-sm mb-8 ${dotsRemaining === 0 ? "text-accent" : dotsRemaining < 0 ? "text-destructive" : "text-primary"}`}>
                  DOTS REMAINING: {dotsRemaining}
                </p>

                <div className="border border-border/30 rounded-lg bg-card/40 p-6 space-y-6 max-w-md">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Swords size={16} className="text-red-400" />
                      <span className="font-display text-sm font-bold tracking-wider">ATTACK</span>
                    </div>
                    <DotRating
                      value={attrAttack}
                      onChange={(v) => {
                        const newTotal = v + attrDefense + attrVitality;
                        if (newTotal <= 9 && v >= 1) setAttrAttack(v);
                      }}
                      label="ATK"
                      color="red"
                    />
                    <p className="font-mono text-[10px] text-muted-foreground mt-1 ml-[92px]">
                      Melee & ranged damage output
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Shield size={16} className="text-cyan-400" />
                      <span className="font-display text-sm font-bold tracking-wider">DEFENSE</span>
                    </div>
                    <DotRating
                      value={attrDefense}
                      onChange={(v) => {
                        const newTotal = attrAttack + v + attrVitality;
                        if (newTotal <= 9 && v >= 1) setAttrDefense(v);
                      }}
                      label="DEF"
                      color="cyan"
                    />
                    <p className="font-mono text-[10px] text-muted-foreground mt-1 ml-[92px]">
                      Armor rating & damage reduction
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Heart size={16} className="text-amber-400" />
                      <span className="font-display text-sm font-bold tracking-wider">VITALITY</span>
                    </div>
                    <DotRating
                      value={attrVitality}
                      onChange={(v) => {
                        const newTotal = attrAttack + attrDefense + v;
                        if (newTotal <= 9 && v >= 1) setAttrVitality(v);
                      }}
                      label="VIT"
                      color="amber"
                    />
                    <p className="font-mono text-[10px] text-muted-foreground mt-1 ml-[92px]">
                      Maximum health pool
                    </p>
                  </div>

                  {/* Derived stats preview */}
                  <div className="border-t border-border/20 pt-4 mt-4">
                    <p className="font-mono text-[10px] text-muted-foreground tracking-wider mb-2">DERIVED STATS</p>
                    <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                      <div>
                        HP: <span className="text-accent">
                          {80 + attrVitality * 10 + (species === "demagi" || species === "neyon" ? 20 : 0)}
                        </span>
                      </div>
                      <div>
                        Armor: <span className="text-primary">
                          {attrDefense * 2 + (species === "quarchon" || species === "neyon" ? 5 : 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ NAME ═══ */}
            {step === "name" && (
              <div>
                <h2 className="font-display text-2xl font-bold mb-2 tracking-wider">NAME YOUR CITIZEN</h2>
                <p className="font-mono text-sm text-muted-foreground mb-8">
                  Choose a name for your character. This will be your identity across the Dischordian Saga.
                </p>
                <div className="max-w-md">
                  <input
                    type="text"
                    value={charName}
                    onChange={(e) => setCharName(e.target.value)}
                    maxLength={64}
                    placeholder="Enter citizen name..."
                    className="w-full bg-card/60 border border-border/40 rounded-lg px-4 py-3 font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,255,255,0.15)] transition-all"
                  />
                  <p className="font-mono text-[10px] text-muted-foreground mt-2">
                    {charName.length}/64 characters
                  </p>
                </div>
              </div>
            )}

            {/* ═══ REVIEW ═══ */}
            {step === "review" && (
              <div>
                <h2 className="font-display text-2xl font-bold mb-2 tracking-wider">REVIEW YOUR CITIZEN</h2>
                <p className="font-mono text-sm text-muted-foreground mb-8">
                  Confirm your choices. This is your free Citizen — additional characters must be unlocked.
                </p>

                <div className="border border-primary/30 rounded-lg bg-card/60 p-6 max-w-lg box-glow-cyan">
                  {/* Character name */}
                  <div className="text-center mb-6">
                    <h3 className="font-display text-2xl font-bold text-primary tracking-wider">{charName}</h3>
                    <p className="font-mono text-xs text-muted-foreground tracking-wider mt-1">
                      {species.toUpperCase()} {charClass.toUpperCase()} // {alignment.toUpperCase()}
                    </p>
                  </div>

                  {/* Alignment glow indicator */}
                  <div className={`mx-auto w-20 h-20 rounded-full mb-6 flex items-center justify-center ${
                    alignment === "order"
                      ? "bg-cyan-500/20 shadow-[0_0_30px_rgba(0,255,255,0.4)] border border-cyan-400/30"
                      : "bg-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.4)] border border-purple-400/30"
                  }`}>
                    <User size={32} className={alignment === "order" ? "text-cyan-400" : "text-purple-400"} />
                  </div>

                  {/* Stats grid */}
                  <div className="space-y-3 mb-6">
                    <DotRating value={attrAttack} label="ATTACK" color="red" disabled />
                    <DotRating value={attrDefense} label="DEFENSE" color="cyan" disabled />
                    <DotRating value={attrVitality} label="VITALITY" color="amber" disabled />
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                    <div className="bg-card/40 rounded p-2.5 border border-border/20">
                      <span className="text-muted-foreground/50 block text-[10px]">SPECIES</span>
                      <span className="text-foreground">{species.toUpperCase()}</span>
                    </div>
                    <div className="bg-card/40 rounded p-2.5 border border-border/20">
                      <span className="text-muted-foreground/50 block text-[10px]">CLASS</span>
                      <span className="text-foreground">{charClass.toUpperCase()}</span>
                    </div>
                    <div className="bg-card/40 rounded p-2.5 border border-border/20">
                      <span className="text-muted-foreground/50 block text-[10px]">
                        {species === "quarchon" ? "DIMENSION" : "ELEMENT"}
                      </span>
                      <span className="text-foreground">{element.toUpperCase()}</span>
                    </div>
                    <div className="bg-card/40 rounded p-2.5 border border-border/20">
                      <span className="text-muted-foreground/50 block text-[10px]">ABILITY</span>
                      <span className="text-primary">{ELEMENT_UI[element]?.ability}</span>
                    </div>
                    <div className="bg-card/40 rounded p-2.5 border border-border/20">
                      <span className="text-muted-foreground/50 block text-[10px]">MAX HP</span>
                      <span className="text-accent">
                        {80 + attrVitality * 10 + (species === "demagi" || species === "neyon" ? 20 : 0)}
                      </span>
                    </div>
                    <div className="bg-card/40 rounded p-2.5 border border-border/20">
                      <span className="text-muted-foreground/50 block text-[10px]">ARMOR</span>
                      <span className="text-primary">
                        {attrDefense * 2 + (species === "quarchon" || species === "neyon" ? 5 : 0)}
                      </span>
                    </div>
                  </div>

                  {/* Create button */}
                  <button
                    onClick={handleCreate}
                    disabled={createMutation.isPending}
                    className="w-full mt-6 py-3 rounded-lg bg-primary/20 border border-primary/40 text-primary font-mono text-sm font-bold tracking-wider hover:bg-primary/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all disabled:opacity-50"
                  >
                    {createMutation.isPending ? "CREATING..." : "INITIALIZE CITIZEN"}
                  </button>
                  {createMutation.error && (
                    <p className="font-mono text-xs text-destructive mt-2 text-center">
                      {createMutation.error.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8 max-w-lg">
          <button
            onClick={goPrev}
            disabled={stepIndex === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-border/30 text-muted-foreground font-mono text-xs hover:border-primary/30 hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} /> BACK
          </button>
          {step !== "review" && (
            <button
              onClick={goNext}
              disabled={!canAdvance()}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary/20 border border-primary/40 text-primary font-mono text-xs hover:bg-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              NEXT <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
