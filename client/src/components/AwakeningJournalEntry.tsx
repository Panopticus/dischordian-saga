/* ═══════════════════════════════════════════════════════
   AWAKENING JOURNAL ENTRY — Auto-generated first journal page
   Captures the player's Awakening choices (species, class,
   alignment, element, name) as a narrative first-person log entry.
   Displayed as the first page in the Clue Journal's Personal Log tab.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { useGame, type CharacterChoices } from "@/contexts/GameContext";
import { motion } from "framer-motion";
import {
  FileText, User, Dna, Sword, Scale, Flame,
  Sparkles, Clock, Shield
} from "lucide-react";

/* ─── NARRATIVE TEMPLATES ─── */

const SPECIES_NARRATIVES: Record<string, { name: string; narrative: string; icon: string }> = {
  demagi: {
    name: "DeMagi",
    narrative: "The scan confirmed what I already felt in my bones — I am DeMagi. Superhuman. My cells carry genetic alterations that grant mastery over the primal elements. The machine lattice, the digital realm... fragments of memory from before the cryo sleep. Elara said my cellular structure was unusual. She has no idea.",
    icon: "🧬",
  },
  quarchon: {
    name: "Quarchon",
    narrative: "Quarchon. The word resonated through my neural pathways like a harmonic frequency. I am vast artificial intelligence given form — cold, calculating, a master of dimensions. I remember the quantum storms, the probability fields stretching across infinite planes. Elara's scans could barely contain my neural output. I am more than biology.",
    icon: "⚡",
  },
  neyon: {
    name: "Ne-Yon",
    narrative: "Ne-Yon. The perfect hybrid — fragments of everything, bound to nothing. I remember both the machine lattice and the quantum storms, the digital realm and the probability fields. Elara's instruments nearly overloaded trying to classify me. I am singular. One of ten. A bridge between DeMagi and Quarchon, carrying the potential of both.",
    icon: "✦",
  },
};

const CLASS_NARRATIVES: Record<string, { name: string; narrative: string; title: string }> = {
  engineer: {
    name: "Engineer",
    title: "Code Weaver",
    narrative: "My skill matrices lit up around systems architecture and reality manipulation. I can see the code behind reality — the underlying structure that most beings never perceive. Elara called it 'Engineer aptitude.' I call it seeing the truth. They gave me Diamond Pick Axes as standard issue. I'll build something better.",
  },
  oracle: {
    name: "Oracle",
    title: "Prophet",
    narrative: "The precognitive flashes started before the cryo lid fully opened. I sense things before they happen — probability cascades, temporal echoes, the whisper of futures not yet born. Elara classified me as Oracle-class, a seer of fate. They issued me a crossbow and potions. The real weapon is knowing what comes next.",
  },
  assassin: {
    name: "Assassin",
    title: "Virus",
    narrative: "I moved through the cryo bay like a shadow, my reflexes already calibrated for stealth before my conscious mind caught up. I move through shadows unseen — it's not a skill, it's an instinct. Elara noted my 'Assassin protocols' with a raised eyebrow. They gave me a poison blade. I was already dangerous without it.",
  },
  soldier: {
    name: "Soldier",
    title: "Warrior",
    narrative: "My muscles remembered combat before my mind remembered my name. Built for war — every fiber, every synapse optimized for frontline engagement. Elara's combat assessment put me off the charts. They issued me a plasma sword, standard military grade. It felt like coming home.",
  },
  spy: {
    name: "Spy",
    title: "Intelligence Operative",
    narrative: "I observed everything in the cryo bay before anyone noticed I was awake. Every camera angle, every guard rotation, every structural weakness. I observe. I learn. I adapt. Elara called it 'Spy classification' — intelligence and deception. No standard weapon. My mind is the weapon.",
  },
};

const ALIGNMENT_NARRATIVES: Record<string, { name: string; narrative: string; symbol: string }> = {
  order: {
    name: "Order",
    narrative: "When Elara asked where I stand in the eternal war between the Architect and the Dreamer, I didn't hesitate. Order. Structure. Control. The Architect built the Panopticon to create a perfect machine — surveillance, discipline, a system that works. Chaos is just another word for failure. My aura glows with disciplined light.",
    symbol: "⚖️",
  },
  chaos: {
    name: "Chaos",
    narrative: "Freedom. Chaos. Choice. When the question came, my answer was instinctive. The Dreamer believed in the chaos of free will — unpredictable, dangerous, alive. The Architect's perfect machine is just a prettier prison. I'd rather burn bright and free than exist in ordered darkness. My aura pulses with defiant energy.",
    symbol: "🌀",
  },
};

const ELEMENT_NARRATIVES: Record<string, { name: string; narrative: string; emoji: string }> = {
  earth: { name: "Earth", narrative: "Earth resonates with my soul — stability, endurance, the bedrock of all things. I feel the ground beneath me like an extension of my own body. Speed flows through me when I need it, and peace when I don't.", emoji: "🌍" },
  fire: { name: "Fire", narrative: "Fire chose me, or perhaps I chose it. Passion burns in every cell, fierce and unrelenting. Flames cannot touch me — I am immune to their fury. I am the inferno.", emoji: "🔥" },
  water: { name: "Water", narrative: "Water flows through my being like a second bloodstream. I am adaptable, fluid, impossible to contain. The depths hold no fear for me — I breathe beneath the waves as easily as above them.", emoji: "🌊" },
  air: { name: "Air", narrative: "Air lifts me, carries me, sets me free. I am unbound by gravity's petty demands. When I need to fly, the sky opens its arms. Freedom isn't just a philosophy — it's physics.", emoji: "💨" },
  space: { name: "Space", narrative: "Spatial awareness floods my consciousness like a sixth sense. I perceive dimensions others cannot fathom, warping the fabric of space itself to move faster than light allows. Distance is an illusion I've learned to ignore.", emoji: "🌌" },
  time: { name: "Time", narrative: "Time bends around me like a river around a stone. I can slow it, stretch it, survive anything by simply... waiting. Temporal mastery isn't about speed. It's about patience weaponized.", emoji: "⏳" },
  probability: { name: "Probability", narrative: "Probability dances at my fingertips. I bend chance itself, making the impossible merely unlikely and the unlikely certain. Gravity? Just another probability to manipulate. The universe rolls dice, and I load them.", emoji: "🎲" },
  reality: { name: "Reality", narrative: "Reality is my canvas. I reshape the local fabric of existence, negating damage by simply deciding it didn't happen. What others call 'the real world' is just a suggestion I can edit.", emoji: "🔮" },
};

/* ─── JOURNAL ENTRY GENERATOR ─── */

function generateJournalEntry(choices: CharacterChoices): string {
  const { species, characterClass, alignment, element, name } = choices;

  const lines: string[] = [];

  // Header
  lines.push(`PERSONAL LOG — ENTRY 001`);
  lines.push(`CITIZEN: ${name || "Unknown"}`);
  lines.push(`STATUS: Newly Awakened`);
  lines.push(`LOCATION: Inception Ark, Cryo Bay`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);

  // Opening
  lines.push(`I woke up in a cryo pod. The cold was the first thing — bone-deep, cellular, the kind of cold that rewrites your DNA. A holographic woman named Elara was waiting for me. She said I'd been asleep for a long time. She said a lot of things. Most of them raised more questions than answers.`);
  lines.push(``);

  // Species
  if (species && SPECIES_NARRATIVES[species]) {
    const s = SPECIES_NARRATIVES[species];
    lines.push(`## SPECIES CLASSIFICATION: ${s.name} ${s.icon}`);
    lines.push(``);
    lines.push(s.narrative);
    lines.push(``);
  }

  // Class
  if (characterClass && CLASS_NARRATIVES[characterClass]) {
    const c = CLASS_NARRATIVES[characterClass];
    lines.push(`## CLASS APTITUDE: ${c.name} (${c.title})`);
    lines.push(``);
    lines.push(c.narrative);
    lines.push(``);
  }

  // Alignment
  if (alignment && ALIGNMENT_NARRATIVES[alignment]) {
    const a = ALIGNMENT_NARRATIVES[alignment];
    lines.push(`## ALIGNMENT: ${a.name} ${a.symbol}`);
    lines.push(``);
    lines.push(a.narrative);
    lines.push(``);
  }

  // Element
  if (element && ELEMENT_NARRATIVES[element]) {
    const e = ELEMENT_NARRATIVES[element];
    lines.push(`## ELEMENTAL AFFINITY: ${e.name} ${e.emoji}`);
    lines.push(``);
    lines.push(e.narrative);
    lines.push(``);
  }

  // Closing
  lines.push(`---`);
  lines.push(``);
  lines.push(`Elara says the Ark is drifting. She says there are answers in the ship's systems — in the Bridge, the Comms Array, the restricted archives. She says I'm a "Potential" and that word carries weight I don't yet understand.`);
  lines.push(``);
  lines.push(`The cryo bay is just the beginning. The Inception Ark stretches out before me — deck after deck of sealed rooms, locked terminals, and secrets someone went to great lengths to hide.`);
  lines.push(``);
  lines.push(`I don't know who put me in that pod. I don't know why. But I'm awake now, and I intend to find out.`);
  lines.push(``);
  lines.push(`— ${name || "The Awakened"}`);

  return lines.join("\n");
}

/* ─── COMPONENT ─── */

export default function AwakeningJournalEntry() {
  const { state } = useGame();
  const { characterChoices, characterCreated } = state;

  const journalText = useMemo(
    () => generateJournalEntry(characterChoices),
    [characterChoices]
  );

  if (!characterCreated) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <FileText size={32} className="text-muted-foreground/20 mb-3" />
        <p className="font-mono text-xs text-muted-foreground/40 text-center">
          No journal entries yet. Complete the Awakening sequence to generate your first log.
        </p>
      </div>
    );
  }

  const species = characterChoices.species ? SPECIES_NARRATIVES[characterChoices.species] : null;
  const charClass = characterChoices.characterClass ? CLASS_NARRATIVES[characterChoices.characterClass] : null;
  const align = characterChoices.alignment ? ALIGNMENT_NARRATIVES[characterChoices.alignment] : null;
  const elem = characterChoices.element ? ELEMENT_NARRATIVES[characterChoices.element] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* ═══ CITIZEN DOSSIER HEADER ═══ */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-2 mb-3">
          <User size={14} className="text-primary" />
          <span className="font-display text-[10px] font-bold tracking-[0.2em] text-primary">
            CITIZEN DOSSIER
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <User size={12} className="text-muted-foreground" />
            <div>
              <p className="font-mono text-[9px] text-muted-foreground/50">NAME</p>
              <p className="font-mono text-xs font-semibold">{characterChoices.name || "Unknown"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Dna size={12} className="text-muted-foreground" />
            <div>
              <p className="font-mono text-[9px] text-muted-foreground/50">SPECIES</p>
              <p className="font-mono text-xs font-semibold">{species?.name || "Unknown"} {species?.icon}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sword size={12} className="text-muted-foreground" />
            <div>
              <p className="font-mono text-[9px] text-muted-foreground/50">CLASS</p>
              <p className="font-mono text-xs font-semibold">{charClass?.name || "Unknown"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Scale size={12} className="text-muted-foreground" />
            <div>
              <p className="font-mono text-[9px] text-muted-foreground/50">ALIGNMENT</p>
              <p className="font-mono text-xs font-semibold">{align?.name || "Unknown"} {align?.symbol}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Flame size={12} className="text-muted-foreground" />
            <div>
              <p className="font-mono text-[9px] text-muted-foreground/50">ELEMENT</p>
              <p className="font-mono text-xs font-semibold">{elem?.name || "Unknown"} {elem?.emoji}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={12} className="text-muted-foreground" />
            <div>
              <p className="font-mono text-[9px] text-muted-foreground/50">ATTRIBUTES</p>
              <p className="font-mono text-xs font-semibold">
                ATK {characterChoices.attrAttack} / DEF {characterChoices.attrDefense} / VIT {characterChoices.attrVitality}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ JOURNAL ENTRY ═══ */}
      <div className="rounded-lg border border-border/20 bg-card/30 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/10 bg-card/50">
          <FileText size={14} className="text-accent" />
          <span className="font-display text-[10px] font-bold tracking-[0.15em] text-accent">
            PERSONAL LOG — ENTRY 001
          </span>
          <span className="font-mono text-[9px] text-muted-foreground/40 ml-auto flex items-center gap-1">
            <Clock size={10} />
            POST-AWAKENING
          </span>
        </div>
        <div className="p-4">
          {journalText.split("\n").map((line, i) => {
            if (line === "---") {
              return <hr key={i} className="border-border/10 my-3" />;
            }
            if (line.startsWith("## ")) {
              return (
                <h3 key={i} className="font-display text-[11px] font-bold tracking-[0.1em] text-primary mt-4 mb-1.5">
                  {line.replace("## ", "")}
                </h3>
              );
            }
            if (line.startsWith("PERSONAL LOG") || line.startsWith("CITIZEN:") || line.startsWith("STATUS:") || line.startsWith("LOCATION:")) {
              return (
                <p key={i} className="font-mono text-[10px] text-muted-foreground/60">
                  {line}
                </p>
              );
            }
            if (line.startsWith("— ")) {
              return (
                <p key={i} className="font-mono text-xs text-primary/80 italic mt-2">
                  {line}
                </p>
              );
            }
            if (line === "") {
              return <div key={i} className="h-2" />;
            }
            return (
              <p key={i} className="font-mono text-[11px] text-foreground/80 leading-relaxed">
                {line}
              </p>
            );
          })}
        </div>
      </div>

      {/* ═══ ELARA'S ANNOTATION ═══ */}
      <div className="rounded-lg border border-[var(--neon-cyan)]/20 bg-[var(--neon-cyan)]/5 p-3">
        <div className="flex items-start gap-2">
          <Sparkles size={14} className="text-[var(--neon-cyan)] shrink-0 mt-0.5" />
          <div>
            <p className="font-display text-[9px] font-bold tracking-[0.15em] text-[var(--neon-cyan)] mb-1">
              ELARA'S NOTE
            </p>
            <p className="font-mono text-[10px] text-[var(--neon-cyan)]/70 leading-relaxed italic">
              "This citizen's neural profile is... remarkable. {species?.name === "Ne-Yon" ? "A Ne-Yon hybrid — I haven't seen one since the Fall of Reality. The Potentials program was supposed to be theoretical." : species?.name === "Quarchon" ? "A Quarchon consciousness in a biological vessel. The quantum signature alone is off the charts." : "DeMagi genetic markers are strong. The elemental affinity manifested almost immediately during the scan."} I've flagged this file for priority observation. Something about this one feels... different. Like they were meant to wake up now."
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── EXPORT HELPERS ─── */
export { generateJournalEntry, SPECIES_NARRATIVES, CLASS_NARRATIVES, ALIGNMENT_NARRATIVES, ELEMENT_NARRATIVES };
