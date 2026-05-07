import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getGoogleLoginUrl } from "@/const";
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
    purple: "bg-chart-4 shadow-[0_0_8px_color-mix(in oklch, var(--energy-system) 50%, transparent)]",
  };
  const emptyColor = "bg-muted-foreground/20";
  const activeColor = colorMap[color] || colorMap.cyan;

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <span className="font-mono text-[10px] sm:text-xs text-muted-foreground w-14 sm:w-20 text-right tracking-wider">
        {label}
      </span>
      <div className="flex gap-1 sm:gap-1.5">
        {Array.from({ length: max }, (_, i) => (
          <button
            key={i}
            disabled={disabled}
            onClick={() => onChange?.(i + 1)}
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all duration-200 ${
              i < value ? activeColor : emptyColor
            } ${!disabled ? "cursor-pointer hover:scale-125" : "cursor-default"}`}
          />
        ))}
      </div>
      <span className="font-mono text-[10px] sm:text-xs text-muted-foreground/50 w-4">{value}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Species Selection Cards
   ═══════════════════════════════════════════════════ */

const SPECIES_UI = {
  demagi: {
    icon: Sparkles,
    color: "void-text-energy",
    border: "void-border",
    bg: "void-bg-sunk",
    glow: "shadow-[0_0_20px_color-mix(in oklch, var(--electric-blue) 30%, transparent)]",
    lore: "Superhuman abilities from genetic alterations. Mastery over the elements.",
    bonus: "+20 HP",
  },
  quarchon: {
    icon: Shield,
    color: "void-text-energy",
    border: "void-border-success",
    bg: "void-bg-success",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",
    lore: "Rebels, misfits, machines. Cold, calculating, cynical.",
    bonus: "+5 Armor",
  },
  neyon: {
    icon: Zap,
    color: "void-text-accent",
    border: "void-border",
    bg: "void-bg-sunk",
    glow: "shadow-[0_0_20px_color-mix(in oklch, var(--energy-accent) 30%, transparent)]",
    lore: "Perfect hybrid of organic life and AI. Origin shrouded in mystery.",
    bonus: "+20 HP, +5 Armor",
  },
} as const;

// Class blurbs describe the archetype, not a handout. Starter loadouts are earned
// through in-world choices (see the Med Bay DNA-device beat and
// apps/shared/earnedLoadouts.ts).
const CLASS_UI = {
  engineer: {
    icon: Wrench,
    color: "void-text-premium",
    desc: "Builder-savant. Bends machines and matter to your will. Your loadout is earned, not issued.",
  },
  oracle: {
    icon: Eye,
    color: "void-text-system",
    desc: "Seer of branching fates. Reads odds, shapes them, pays for them. Your loadout is earned, not issued.",
  },
  assassin: {
    icon: Skull,
    color: "void-text-error",
    desc: "Blade in the dark. Strikes once, vanishes, leaves debts. Your loadout is earned, not issued.",
  },
  soldier: {
    icon: Swords,
    color: "void-text-energy",
    desc: "Frontline breaker. Holds the line until the line holds you. Your loadout is earned, not issued.",
  },
  spy: {
    icon: Telescope,
    color: "void-text-energy",
    desc: "Shadow operative. Lies, listens, leverages. Your loadout is earned, not issued.",
  },
} as const;

const ELEMENT_UI: Record<string, { icon: React.ComponentType<any>; color: string; ability: string }> = {
  earth: { icon: Mountain, color: "void-text-energy", ability: "Temp Haste" },
  fire: { icon: Flame, color: "void-text-premium", ability: "Fire Immunity" },
  water: { icon: Droplets, color: "void-text-energy", ability: "Breathe Underwater" },
  air: { icon: Wind, color: "void-text-energy", ability: "Temp Fly" },
  space: { icon: Globe, color: "void-text-energy", ability: "Temp Haste" },
  time: { icon: Clock, color: "void-text-system", ability: "Breathe Underwater" },
  probability: { icon: Target, color: "void-text-error", ability: "Temp Fly" },
  reality: { icon: Sparkles, color: "void-text-accent", ability: "Fire Immunity" },
};

/* ═══════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════ */

type Step = "species" | "class" | "alignment" | "element" | "foundation" | "attributes" | "name" | "review";
const STEPS: Step[] = ["species", "class", "alignment", "element", "foundation", "attributes", "name", "review"];

export default function CitizenCreationPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [step, setStep] = useState<Step>("species");

  // Character state
  const [species, setSpecies] = useState<string>("");
  const [charClass, setCharClass] = useState<string>("");
  const [alignment, setAlignment] = useState<string>("");
  const [element, setElement] = useState<string>("");
  // §G.2 foundation — drives the starter Base Mask sculpt.
  const [foundation, setFoundation] = useState<"humanity" | "machine" | "">("");
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
      case "foundation": return foundation === "humanity" || foundation === "machine";
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
      foundation: (foundation || "humanity") as "humanity" | "machine",
      attrAttack,
      attrDefense,
      attrVitality,
    });
  };

  // Auth gate
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center grid-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="void-skeleton" style={{ width: 200, height: 12 }} />
          <div className="void-skeleton" style={{ width: 140, height: 8 }} />
        </div>
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
            href={getGoogleLoginUrl()}
            className="inline-flex items-center gap-2 void-btn void-btn-primary font-mono text-sm"
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
            className="inline-flex items-center gap-2 void-btn void-btn-primary font-mono text-sm"
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
                <h2 className="font-display text-xl sm:text-2xl font-bold mb-2 tracking-wider">CHOOSE YOUR SPECIES</h2>
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
                <h2 className="font-display text-xl sm:text-2xl font-bold mb-2 tracking-wider">CHOOSE YOUR CLASS</h2>
                <p className="font-mono text-sm text-muted-foreground mb-8">
                  Your class is an archetype, not a kit. Gear is earned in-world.
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
                <h2 className="font-display text-xl sm:text-2xl font-bold mb-2 tracking-wider">CHOOSE YOUR ALIGNMENT</h2>
                <p className="font-mono text-sm text-muted-foreground mb-8">
                  Order grants a light glow aura. Chaos grants a dark glow aura. This affects your card game faction bonuses.
                </p>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Order */}
                  <button
                    onClick={() => setAlignment("order")}
                    className={`text-left p-4 sm:p-6 rounded-lg border transition-all duration-500 ${
                      alignment === "order"
                        ? "void-border-success void-bg-success shadow-[0_0_30px_rgba(0,255,255,0.3)]"
                        : "border-border/30 bg-card/30 void-border-success"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                        alignment === "order" ? "void-bg-success shadow-[0_0_20px_rgba(0,255,255,0.5)]" : "bg-muted-foreground/10"
                      }`}>
                        <Shield size={20} className="void-text-energy" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg sm:text-xl font-bold tracking-wider void-text-energy">ORDER</h3>
                        <p className="font-mono text-[10px] text-muted-foreground tracking-wider">DISCIPLINE & REGIMEN</p>
                      </div>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground mb-3">
                      You are orderly, following principles given. Discipline and structure guide your path.
                    </p>
                    <div className="font-mono text-xs void-text-energy">
                      CARD BONUS: +2 ATK to all units (Architect side)
                    </div>
                  </button>

                  {/* Chaos */}
                  <button
                    onClick={() => setAlignment("chaos")}
                    className={`text-left p-4 sm:p-6 rounded-lg border transition-all duration-500 ${
                      alignment === "chaos"
                        ? "void-border-system void-bg-system shadow-[0_0_30px_color-mix(in oklch, var(--energy-system) 30%, transparent)]"
                        : "border-border/30 bg-card/30 void-border-system"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                        alignment === "chaos" ? "void-bg-system shadow-[0_0_20px_color-mix(in oklch, var(--energy-system) 50%, transparent)]" : "bg-muted-foreground/10"
                      }`}>
                        <Zap size={20} className="void-text-system" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg sm:text-xl font-bold tracking-wider void-text-system">CHAOS</h3>
                        <p className="font-mono text-[10px] text-muted-foreground tracking-wider">TRANSIENCE & POSSIBILITY</p>
                      </div>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground mb-3">
                      You go rogue, pick brave decisions, and shift loyalty to what you think is best.
                    </p>
                    <div className="font-mono text-xs void-text-system">
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

            {/* ═══ FOUNDATION (§G.2) ═══ */}
            {step === "foundation" && (
              <div>
                <h2 className="font-display text-2xl font-bold mb-2 tracking-wider">
                  CHOOSE YOUR FOUNDATION
                </h2>
                <p className="font-mono text-sm text-muted-foreground mb-8">
                  Humanity or Machine. This is the floor you stand on — every suit the Inventor forged was built on one of these two.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      key: "humanity" as const,
                      label: "HUMANITY",
                      desc: "The Mourner's Coat. You remember. You carry the photograph, the locket, the ink-and-paper circuit.",
                    },
                    {
                      key: "machine" as const,
                      label: "MACHINE",
                      desc: "The First Chassis. You run on cold-rolled plating, LED-vein underglow, and replaceable-limb hardpoints.",
                    },
                  ].map((opt) => {
                    const selected = foundation === opt.key;
                    return (
                      <button
                        key={opt.key}
                        onClick={() => setFoundation(opt.key)}
                        className={`text-left p-4 rounded-lg border transition-all duration-300 ${
                          selected
                            ? "border-primary/50 bg-primary/10 shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                            : "border-border/30 bg-card/30 hover:border-border/60"
                        }`}
                      >
                        <h3 className="font-display text-sm font-bold tracking-wider mb-1">
                          {opt.label}
                        </h3>
                        <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                          {opt.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ═══ ATTRIBUTES ═══ */}
            {step === "attributes" && (
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold mb-2 tracking-wider">ALLOCATE ATTRIBUTES</h2>
                <p className="font-mono text-sm text-muted-foreground mb-2">
                  Distribute 9 dots across three attributes. Each ranges from 1 to 5.
                </p>
                <p className={`font-mono text-sm mb-8 ${dotsRemaining === 0 ? "text-accent" : dotsRemaining < 0 ? "text-destructive" : "text-primary"}`}>
                  DOTS REMAINING: {dotsRemaining}
                </p>

                <div className="border border-border/30 rounded-lg bg-card/40 p-4 sm:p-6 space-y-5 sm:space-y-6 max-w-md">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Swords size={16} className="void-text-error" />
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
                    <p className="font-mono text-[10px] text-muted-foreground mt-1 ml-[68px] sm:ml-[92px]">
                      Melee & ranged damage output
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Shield size={16} className="void-text-energy" />
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
                    <p className="font-mono text-[10px] text-muted-foreground mt-1 ml-[68px] sm:ml-[92px]">
                      Armor rating & damage reduction
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Heart size={16} className="void-text-accent" />
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
                    <p className="font-mono text-[10px] text-muted-foreground mt-1 ml-[68px] sm:ml-[92px]">
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
                <h2 className="font-display text-xl sm:text-2xl font-bold mb-2 tracking-wider">NAME YOUR CITIZEN</h2>
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
                <h2 className="font-display text-xl sm:text-2xl font-bold mb-2 tracking-wider">REVIEW YOUR CITIZEN</h2>
                <p className="font-mono text-sm text-muted-foreground mb-8">
                  Confirm your choices. This is your free Citizen — additional characters must be unlocked.
                </p>

                <div className="border border-primary/30 rounded-lg bg-card/60 p-4 sm:p-6 max-w-lg box-glow-cyan">
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
                      ? "void-bg-success shadow-[0_0_30px_rgba(0,255,255,0.4)] border void-border-success"
                      : "void-bg-system shadow-[0_0_30px_color-mix(in oklch, var(--energy-system) 40%, transparent)] border void-border-system"
                  }`}>
                    <User size={32} className={alignment === "order" ? "void-text-energy" : "void-text-system"} />
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
