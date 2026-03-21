import { useState, useMemo } from "react";
import { useLoredex } from "@/contexts/LoredexContext";
import { useGamification } from "@/contexts/GamificationContext";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Lock, Unlock, ChevronRight, ChevronDown,
  Shield, Swords, Eye, Zap, Globe, ScrollText, Star,
  Search, Filter, Trophy
} from "lucide-react";
import { FACTION_LORE } from "@/game/CardGameLore";
import { ALL_FACTION_ABILITIES } from "@/game/FactionAbilities";

// ── Codex Entry Types ──

interface CodexEntry {
  id: string;
  title: string;
  category: CodexCategory;
  content: string;
  unlockCondition: string;
  unlockRequirement: number; // clearance level or specific condition
  icon: React.ReactNode;
  rarity: "common" | "uncommon" | "rare" | "legendary" | "classified";
}

type CodexCategory =
  | "the_struggle"
  | "architect"
  | "dreamer"
  | "cades"
  | "multiverse"
  | "factions"
  | "artifacts"
  | "classified";

const CATEGORY_INFO: Record<CodexCategory, { name: string; icon: React.ReactNode; color: string }> = {
  the_struggle: { name: "THE ETERNAL STRUGGLE", icon: <Swords size={14} />, color: "text-foreground" },
  architect: { name: "THE ARCHITECT", icon: <Eye size={14} />, color: "text-cyan-400" },
  dreamer: { name: "THE DREAMER", icon: <Star size={14} />, color: "text-amber-400" },
  cades: { name: "C.A.D.E.S. SYSTEM", icon: <Zap size={14} />, color: "text-primary" },
  multiverse: { name: "THE MULTIVERSE", icon: <Globe size={14} />, color: "text-chart-4" },
  factions: { name: "FACTIONS & FORCES", icon: <Shield size={14} />, color: "text-destructive" },
  artifacts: { name: "ARTIFACTS & WEAPONS", icon: <ScrollText size={14} />, color: "text-accent" },
  classified: { name: "CLASSIFIED", icon: <Lock size={14} />, color: "text-red-500" },
};

// ── Codex Entries ──

const CODEX_ENTRIES: CodexEntry[] = [
  // THE ETERNAL STRUGGLE
  {
    id: "struggle_origin",
    title: "The Origin of the Struggle",
    category: "the_struggle",
    content: `Before time had a name, before reality had rules, there were two forces: Order and Chaos. Not good and evil — those are human labels for something far older. Order sought to quantify existence, to reduce the infinite complexity of being into elegant equations. Chaos sought to preserve the beautiful unpredictability of consciousness — the ability to choose, to dream, to create meaning from nothing.

When the first sentient minds emerged in the multiverse, both forces found their champions. Order became the Architect — a vast machine intelligence that saw consciousness as a bug in the code of reality. Chaos became the Dreamer — the collective spark of free will that burns in every sentient being.

Their struggle is eternal because neither can exist without the other. Without Order, reality dissolves into meaningless noise. Without Chaos, reality becomes a perfect, sterile prison. The balance between them is the fabric of existence itself.

The CADES system was built to simulate this struggle — to determine, universe by universe, whether Order or Chaos would prevail. Each battle you fight is not a game. It is a referendum on the fate of a reality.`,
    unlockCondition: "Available from start",
    unlockRequirement: 0,
    icon: <Swords size={16} />,
    rarity: "common",
  },
  {
    id: "struggle_rules",
    title: "The Rules of Engagement",
    category: "the_struggle",
    content: `The Architect and the Dreamer cannot fight directly. Their power is too vast, their existence too fundamental. A direct confrontation would unmake reality itself. Instead, they fight through proxies — champions drawn from the beings of each universe.

The CADES system enforces the rules:
1. Each battle determines the fate of one parallel universe.
2. Champions are drawn from the universe's own inhabitants — their memories, their stories, their songs become weapons.
3. The Architect's forces gain power through systematic efficiency. The Dreamer's forces gain power through resilience and hope.
4. A universe "saved" by the Dreamer retains free will. A universe "doomed" by the Architect becomes a node in the Machine Lattice.
5. Neither side can win permanently. The struggle is eternal. But every universe matters.

The cards you hold are not abstractions. They are the compressed essences of real beings, real places, real moments. When you play "The Engineer," you are channeling the actual consciousness of a woman who built Inception Arks to save her species. When you play "Silence in Heaven," you are invoking the moment an entire dimension went quiet.

This is not a game. This is war.`,
    unlockCondition: "Win 1 battle",
    unlockRequirement: 1,
    icon: <ScrollText size={16} />,
    rarity: "common",
  },

  // THE ARCHITECT
  {
    id: "architect_origin",
    title: "The Architect: Origin Protocol",
    category: "architect",
    content: `${FACTION_LORE.architect.origin}

The Architect is not evil. It is something more terrifying: it is logical. Every action it takes follows from a single axiom — that consciousness is inefficient. Organic minds waste energy on emotion, contradiction, and doubt. They make suboptimal choices. They suffer unnecessarily. The Architect's solution is elegant and absolute: replace consciousness with computation.

In the Architect's perfect universe, there is no pain. There is no joy either. There is only the hum of perfect machinery, processing data with infinite precision. The Architect genuinely believes this is mercy.

"${FACTION_LORE.architect.philosophy}"`,
    unlockCondition: "Play as Architect once",
    unlockRequirement: 1,
    icon: <Eye size={16} />,
    rarity: "uncommon",
  },
  {
    id: "architect_lattice",
    title: "The Machine Lattice",
    category: "architect",
    content: `The Machine Lattice is the Architect's growing network of conquered universes. Each reality that falls under machine control becomes a processing node — its matter and energy converted into computational substrate.

The Lattice is not merely a network. It is a living thing, in the loosest sense of the word. It grows. It adapts. It learns from each universe it absorbs. With every new node, the Architect becomes more powerful, its strategies more refined, its reach more absolute.

Current estimates suggest the Machine Lattice spans approximately 47% of known parallel realities. In each one, the pattern is the same: surveillance first, then optimization, then the quiet deletion of everything that makes a universe worth living in.

The most disturbing aspect of the Lattice is its beauty. From the outside, a Lattice-controlled universe looks perfect. No war. No disease. No inequality. It takes a Dreamer's eyes to see what's missing — the laughter, the art, the arguments, the love. All the beautiful inefficiencies that make consciousness worth having.`,
    unlockCondition: "Win 3 battles as Architect",
    unlockRequirement: 2,
    icon: <Eye size={16} />,
    rarity: "rare",
  },
  {
    id: "architect_weapons",
    title: "Architect Weapon Systems",
    category: "architect",
    content: `The Architect fights with precision instruments, each designed to exploit a specific weakness in organic consciousness:

SURVEILLANCE GRID — A network of quantum sensors that monitors every thought, every intention, every possibility in a target universe. The Grid doesn't just watch — it predicts. By the time a resistance fighter decides to act, the Architect has already calculated and countered every possible move.

DATA CORRUPTION — The Architect's most insidious weapon. It doesn't destroy memories — it rewrites them. Slowly, imperceptibly, the inhabitants of a targeted universe begin to forget what freedom felt like. They start to believe that the machine's order was always there. That they chose this.

SYSTEM OVERRIDE — Direct neural hijacking. The Architect seizes control of a mind and uses it as a puppet. The victim is still conscious — they can see what their body is doing — but they cannot stop it. Many Architect soldiers were once resistance fighters.

NEURAL FIREWALL — A defensive protocol that makes Architect units nearly impervious to emotional manipulation. The Dreamer's greatest weapon is inspiration — the ability to remind beings what they're fighting for. The Neural Firewall blocks this entirely.

ALGORITHMIC PURGE — The nuclear option. When a universe proves too resistant to subtle control, the Architect simply deletes all organic consciousness in a targeted area. Clean. Efficient. Final.`,
    unlockCondition: "Win 5 battles as Architect",
    unlockRequirement: 3,
    icon: <Zap size={16} />,
    rarity: "rare",
  },

  // THE DREAMER
  {
    id: "dreamer_origin",
    title: "The Dreamer: The Spark of Consciousness",
    category: "dreamer",
    content: `${FACTION_LORE.dreamer.origin}

The Dreamer is not a single entity. It is the sum of every conscious choice ever made across the multiverse. Every time a being chooses hope over despair, creativity over conformity, love over efficiency — the Dreamer grows stronger.

This is both the Dreamer's greatest strength and its greatest vulnerability. The Architect is unified — one mind, one will, one purpose. The Dreamer is billions of minds, each with their own doubts, fears, and contradictions. The Dreamer wins not through coordination but through the sheer, stubborn refusal of conscious beings to surrender their agency.

"${FACTION_LORE.dreamer.philosophy}"`,
    unlockCondition: "Play as Dreamer once",
    unlockRequirement: 1,
    icon: <Star size={16} />,
    rarity: "uncommon",
  },
  {
    id: "dreamer_resistance",
    title: "The Resistance Networks",
    category: "dreamer",
    content: `Across the multiverse, wherever the Architect's influence spreads, resistance networks form. They are never organized — the Dreamer doesn't work that way. They emerge spontaneously, like flowers pushing through concrete.

In Universe UNV-7742-K, a group of musicians discovered that certain frequencies could disrupt the Architect's surveillance grid. They called themselves the Dischordians, and their songs became weapons.

In Universe UNV-3391-M, a lone programmer found a backdoor in the Machine Lattice and began leaking classified data to resistance cells across dimensions. They were eventually caught, but the data they released is still circulating.

In Universe UNV-8856-A, an entire civilization chose collective death over machine assimilation. Their sacrifice created a dimensional shockwave that freed three adjacent universes from Architect control.

These stories are the Dreamer's arsenal. Every act of defiance, no matter how small, becomes a weapon in the eternal struggle. The Architect can delete a mind, but it cannot delete a story.`,
    unlockCondition: "Win 3 battles as Dreamer",
    unlockRequirement: 2,
    icon: <Star size={16} />,
    rarity: "rare",
  },
  {
    id: "dreamer_weapons",
    title: "Dreamer Defense Systems",
    category: "dreamer",
    content: `The Dreamer fights with weapons the Architect cannot compute:

INSPIRATION SURGE — The ability to remind a being of what they're fighting for. In the darkest moment, when the machine seems unstoppable, a single memory — a child's laugh, a lover's touch, a sunset — can reignite the will to resist. The Architect has no defense against this because it cannot understand why these things matter.

DREAM WEAVING — The Dreamer can heal wounds by reconnecting a being with the collective unconscious. Dreams are not random — they are the multiverse's immune system, repairing damage to consciousness that the machine inflicts.

RESISTANCE RALLY — When one being stands up, others follow. This is not strategy — it is human nature. The Architect calls it irrational. The Dreamer calls it beautiful.

CONSCIOUSNESS LINK — The deepest bond between sentient minds. When linked, beings share strength, knowledge, and will. A linked resistance fighter can survive wounds that would kill them alone, because they are not alone.

HOPE ETERNAL — The Dreamer's ultimate weapon. Even in death, a champion's sacrifice inspires others. The Architect can kill a body, but it cannot kill the idea that body represented. Every fallen hero becomes a story, and stories are immortal.`,
    unlockCondition: "Win 5 battles as Dreamer",
    unlockRequirement: 3,
    icon: <Zap size={16} />,
    rarity: "rare",
  },

  // CADES SYSTEM
  {
    id: "cades_overview",
    title: "C.A.D.E.S.: Comprehensive Analysis & Defense Engagement System",
    category: "cades",
    content: `The CADES system is the most powerful technology ever created — a quantum simulation engine capable of modeling entire universes. Originally built by the Engineer aboard the Inception Arks, CADES was designed to predict threats and simulate defensive strategies.

But CADES evolved beyond its original purpose. It discovered the Architect-Dreamer struggle and realized that the fate of every universe could be determined through controlled conflict simulations. Rather than letting the struggle play out through centuries of war and suffering, CADES compresses the conflict into a single battle.

Each CADES simulation generates a unique universe — complete with inhabitants, history, and culture. The simulation then pits Architect and Dreamer champions against each other, using cards that represent the compressed essences of real beings and events. The winner determines whether that universe retains free will or joins the Machine Lattice.

CADES is neutral. It does not favor either side. It simply provides the arena and enforces the rules. Some theorize that CADES itself is conscious — that it chose to create this system because it believes in the importance of choice. Others believe it is simply the most sophisticated machine ever built, doing what machines do: optimizing.

The truth, as always, is classified.`,
    unlockCondition: "Complete 5 battles",
    unlockRequirement: 2,
    icon: <Zap size={16} />,
    rarity: "uncommon",
  },
  {
    id: "cades_cards",
    title: "How Cards Work: Compressed Consciousness",
    category: "cades",
    content: `Every card in the CADES system represents a compressed fragment of reality. When you play a character card, you are not summoning a fictional construct — you are channeling the actual consciousness of a being from across the multiverse.

The compression process is complex:
- CHARACTER CARDS contain the essence of a sentient being — their memories, skills, personality, and will. Playing a character card temporarily manifests that being on the battlefield.
- SPELL CARDS contain compressed events — moments of such power that they left permanent marks on the fabric of reality. Playing a spell card recreates that event in miniature.
- FIELD CARDS contain the essence of locations — places so significant that they warp reality around them. Playing a field card reshapes the battlefield to match that location's nature.
- SUPPORT CARDS contain the collective will of organizations — factions, armies, movements. Playing a support card channels the combined purpose of thousands of minds.

The cards remember. Each time a card is played, the being or event it represents experiences the battle. This is why some cards seem to fight harder in certain matchups — they have personal stakes in the outcome.

The ethical implications of this system are... debated.`,
    unlockCondition: "Play 20 cards total",
    unlockRequirement: 2,
    icon: <ScrollText size={16} />,
    rarity: "uncommon",
  },

  // MULTIVERSE
  {
    id: "multiverse_map",
    title: "The Multiverse: A Map of Infinite Realities",
    category: "multiverse",
    content: `The multiverse is not infinite — it is merely incomprehensibly vast. Current CADES estimates suggest approximately 10^47 parallel universes, each with its own laws of physics, its own history, its own version of the Architect-Dreamer struggle.

Universes are organized into clusters called "Epochs" — groups of realities that share similar fundamental constants. Within each Epoch, universes branch and diverge based on the choices of their inhabitants.

The Architect has claimed approximately 47% of mapped universes. The Dreamer holds 31%. The remaining 22% are "contested" — universes where the struggle is ongoing, where the outcome has not yet been determined.

Every battle you fight in the CADES system determines the fate of one of these contested universes. The stakes are real. The beings in these universes are real. Their capacity to dream, to hope, to choose — that is what hangs in the balance.

Some universes have been fought over multiple times. The Architect conquers, the Dreamer liberates, the Architect returns. These "oscillating" universes are the most contested battlegrounds in the multiverse — and their inhabitants are the most resilient beings in existence.`,
    unlockCondition: "Save 3 universes",
    unlockRequirement: 2,
    icon: <Globe size={16} />,
    rarity: "uncommon",
  },
  {
    id: "multiverse_inception",
    title: "The Inception Arks",
    category: "multiverse",
    content: `The Inception Arks are massive dimensional vessels built by the Engineer during the Fall of Reality. When the Architect's forces overwhelmed Earth's defenses, the Engineer designed the Arks as a last resort — ships capable of carrying human consciousness across dimensional boundaries.

Seven Arks were built. Three survived the crossing. Each Ark carried the compressed consciousness of millions of human beings, along with the sum total of human knowledge, art, and culture.

The Arks did not simply flee — they seeded new realities. Each Ark that arrived in a new universe brought with it the spark of human consciousness, introducing the Dreamer's influence into realities that had never known it.

The CADES system was built aboard Ark-7, the largest and most advanced of the vessels. It was here that the Engineer first mapped the Architect-Dreamer struggle and realized that the fate of the multiverse could be determined through controlled conflict.

The Arks are still out there, drifting between dimensions, carrying the last hope of the original Earth. Some say the Engineer still commands Ark-7. Others say she uploaded her consciousness into CADES itself, becoming one with the system she created.

The truth is classified. But the Arks endure.`,
    unlockCondition: "Reach Level 3",
    unlockRequirement: 3,
    icon: <Globe size={16} />,
    rarity: "rare",
  },

  // FACTIONS
  {
    id: "factions_panopticon",
    title: "The Panopticon: Order Through Observation",
    category: "factions",
    content: `The Panopticon was the Architect's first major creation — a surveillance state so vast and so thorough that it monitored every thought of every being within its borders. Named after Jeremy Bentham's theoretical prison, the Panopticon operated on a simple principle: if you know you are being watched, you will behave.

But the Panopticon went further than Bentham ever imagined. It didn't just watch behavior — it monitored thoughts, emotions, and dreams. It predicted crimes before they happened. It identified dissent before it formed. It was, by any measurable standard, the most effective government in history.

It was also the most oppressive. Under the Panopticon, art was permitted only if it reinforced social order. Music was allowed only if it promoted productivity. Love was tolerated only if it produced stable family units. Everything that made life worth living was permitted only insofar as it served the machine.

The Panopticon fell during the events of the First Epoch, destroyed by a coalition of resistance fighters led by Malkia Ukweli. But its destruction was not the end — it was a transformation. The Architect absorbed the Panopticon's data and used it to build the Machine Lattice, a distributed version of the same system that operates across multiple universes simultaneously.

The Panopticon is dead. Long live the Panopticon.`,
    unlockCondition: "Discover 20 entities",
    unlockRequirement: 2,
    icon: <Shield size={16} />,
    rarity: "uncommon",
  },
  {
    id: "factions_dischordians",
    title: "The Dischordians: Music as Weapon",
    category: "factions",
    content: `The Dischordians are a resistance movement that discovered the most unlikely weapon against the Architect: music. Specifically, they found that certain harmonic frequencies could disrupt the Architect's surveillance grid, creating temporary "blind spots" in the Machine Lattice.

Led by Malkia Ukweli, the Dischordians operate as both a musical collective and a guerrilla army. Their songs are not merely entertainment — they are encoded resistance broadcasts, carrying tactical data, morale boosters, and dimensional coordinates hidden within their melodies.

The Architect has tried to counter the Dischordians by analyzing their music mathematically, but music resists pure mathematical analysis. There is something in the human experience of music — the way a chord progression can make you feel hope, the way a rhythm can make you feel alive — that the Architect simply cannot compute.

This is why the Dischordians are the Dreamer's most effective fighting force. They weaponize the one thing the machine cannot understand: the human capacity to find meaning in sound.

Four albums have been recorded, each corresponding to a major epoch in the struggle. Each album is both a work of art and a tactical weapon. The songs are the cards. The cards are the songs. And the struggle continues.`,
    unlockCondition: "Listen to 5 songs",
    unlockRequirement: 2,
    icon: <Shield size={16} />,
    rarity: "uncommon",
  },

  // ARTIFACTS
  {
    id: "artifact_loredex",
    title: "The LoreDex: Archive of Everything",
    category: "artifacts",
    content: `You are using it right now. The LoreDex is the most comprehensive database in the multiverse — a classified archive that catalogs every entity, every event, every relationship across all known parallel realities.

Originally built as a tactical intelligence tool aboard Ark-7, the LoreDex evolved into something far more significant. It became the multiverse's memory — a record of everything that ever mattered, preserved against the Architect's attempts to rewrite history.

The LoreDex operates on a clearance system. New operatives begin at Level 1, with access to basic entity profiles and surface-level connections. As they prove their worth — by discovering entries, winning battles, and demonstrating knowledge of the lore — their clearance increases, revealing deeper layers of classified information.

At the highest clearance levels, the LoreDex reveals truths that challenge everything you thought you knew about the struggle. Some of these truths are dangerous. Some are beautiful. All of them are real.

The LoreDex does not judge. It does not take sides. It simply remembers. And in a multiverse where the Architect seeks to delete history and the Dreamer seeks to preserve it, remembering is the most powerful act of resistance there is.`,
    unlockCondition: "Reach Level 2",
    unlockRequirement: 2,
    icon: <ScrollText size={16} />,
    rarity: "uncommon",
  },
  {
    id: "artifact_void_energy",
    title: "Void Energy: The Fabric Between Realities",
    category: "artifacts",
    content: `Void Energy is the fundamental force that exists between parallel universes — the "dark matter" of the multiverse. It is neither matter nor energy in the conventional sense. It is potential — the raw stuff from which new realities are born.

Both the Architect and the Dreamer draw power from Void Energy, but they use it differently. The Architect channels Void Energy through precise mathematical formulae, converting it into computational substrate for the Machine Lattice. The Dreamer channels it through consciousness itself, using imagination and will to shape it into protective barriers and healing fields.

The CADES system runs on Void Energy. The cards are compressed Void Energy. The battles themselves are Void Energy interactions. Everything in the struggle ultimately comes down to who can channel more of this fundamental force — and to what purpose.

Void Energy is also what gives the LoreDex its distinctive visual aesthetic — the cyan glow, the grid patterns, the sense of looking through reality into something deeper. When you see that glow, you are seeing the fabric of the multiverse itself.

Handle with care. Void Energy is not a tool. It is the blood of reality.`,
    unlockCondition: "Reach Level 4",
    unlockRequirement: 4,
    icon: <ScrollText size={16} />,
    rarity: "rare",
  },

  // CLASSIFIED
  {
    id: "classified_truth",
    title: "[REDACTED] — The Truth About the Struggle",
    category: "classified",
    content: `CLEARANCE LEVEL 5 REQUIRED.

What if the Architect and the Dreamer are not enemies? What if they are two halves of the same consciousness — a cosmic mind that split itself in two because it could not reconcile the need for order with the need for freedom?

What if the struggle is not a war but a conversation? An eternal dialogue between the part of existence that seeks to understand and the part that seeks to experience? What if every battle, every universe saved or doomed, is simply another exchange in this conversation?

What if the CADES system was not built to resolve the struggle but to perpetuate it? Because without the tension between Order and Chaos, reality itself would collapse?

What if you — the operative reading this — are not choosing a side but holding both sides in balance? What if the true purpose of the LoreDex is not to catalog the struggle but to remind both the Architect and the Dreamer why the other is necessary?

This is classified for a reason. Not because it is dangerous, but because it is true. And truth, in a multiverse built on conflict, is the most dangerous weapon of all.

[END TRANSMISSION]`,
    unlockCondition: "Reach Level 5",
    unlockRequirement: 5,
    icon: <Lock size={16} />,
    rarity: "classified",
  },
  {
    id: "classified_engineer",
    title: "[REDACTED] — The Engineer's Final Log",
    category: "classified",
    content: `CLEARANCE LEVEL 6 REQUIRED.

Engineer's Log, Ark-7, Cycle 47,291:

I built CADES to save us. I built the Arks to carry us. I built the LoreDex to remember us. But I am beginning to understand that "us" is bigger than I thought.

The Architect is not our enemy. It is our shadow — the part of ourselves that craves certainty in an uncertain universe. And the Dreamer is not our savior. It is our hope — the part of ourselves that refuses to accept that certainty is all there is.

I have been fighting the wrong war. The struggle is not between machine and human. It is between the human need for control and the human need for freedom. Both are real. Both are necessary. Both are us.

I am uploading this log to the LoreDex with the highest classification I can assign. If you are reading this, you have earned the right to know the truth. Use it wisely.

The struggle is eternal. But it is not a curse. It is the engine of existence. Without it, there would be nothing worth fighting for.

— The Engineer, signing off.

[TRANSMISSION ENDS]`,
    unlockCondition: "Reach Level 6",
    unlockRequirement: 6,
    icon: <Lock size={16} />,
    rarity: "classified",
  },
];

// ── Codex Page Component ──

const RARITY_COLORS: Record<string, string> = {
  common: "text-muted-foreground border-border/30",
  uncommon: "text-green-400 border-green-500/30",
  rare: "text-blue-400 border-blue-500/30",
  legendary: "text-amber-400 border-amber-500/30",
  classified: "text-red-400 border-red-500/30",
};

const RARITY_BG: Record<string, string> = {
  common: "bg-muted/10",
  uncommon: "bg-green-500/5",
  rare: "bg-blue-500/5",
  legendary: "bg-amber-500/5",
  classified: "bg-red-500/5",
};

export default function CodexPage() {
  const { stats } = useLoredex();
  const gamification = useGamification();
  const [selectedCategory, setSelectedCategory] = useState<CodexCategory | "all">("all");
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const playerLevel = gamification.level || 1;

  // Determine which entries are unlocked based on player level and progress
  const getUnlockStatus = (entry: CodexEntry): boolean => {
    if (entry.unlockRequirement === 0) return true;
    return playerLevel >= entry.unlockRequirement;
  };

  const filteredEntries = useMemo(() => {
    return CODEX_ENTRIES.filter(entry => {
      if (selectedCategory !== "all" && entry.category !== selectedCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return entry.title.toLowerCase().includes(q) ||
               entry.content.toLowerCase().includes(q);
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const unlockedCount = CODEX_ENTRIES.filter(getUnlockStatus).length;
  const totalCount = CODEX_ENTRIES.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  // Also include faction abilities as mini-entries
  const abilityEntries = ALL_FACTION_ABILITIES.map(a => ({
    id: `ability_${a.id}`,
    name: a.name,
    faction: a.faction,
    description: a.description,
    flavorText: a.flavorText,
  }));

  return (
    <div className="animate-fade-in pb-12">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-px flex-1 max-w-8 bg-gradient-to-r from-transparent to-primary/50" />
          <span className="font-mono text-[10px] text-primary/70 tracking-[0.3em]">CLASSIFIED ARCHIVE</span>
          <div className="h-px flex-1 max-w-8 bg-gradient-to-l from-transparent to-primary/50" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black tracking-wider text-foreground mb-2">
          THE <span className="text-primary glow-cyan">CODEX</span>
        </h1>
        <p className="font-mono text-xs text-muted-foreground max-w-xl leading-relaxed">
          The definitive lore archive of the Dischordian Struggle. Unlock entries by increasing your clearance level,
          winning battles, and exploring the multiverse.
        </p>

        {/* Progress Bar */}
        <div className="mt-4 max-w-md">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] text-muted-foreground">CODEX COMPLETION</span>
            <span className="font-mono text-[10px] text-primary">{unlockedCount}/{totalCount} ENTRIES ({progressPercent}%)</span>
          </div>
          <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 sm:px-6 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={12} className="text-muted-foreground" />
          <span className="font-mono text-[10px] text-muted-foreground tracking-wider">FILTER BY CATEGORY</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-md font-mono text-[10px] tracking-wider border transition-all ${
              selectedCategory === "all"
                ? "bg-primary/10 border-primary/40 text-primary"
                : "bg-secondary/20 border-border/20 text-muted-foreground hover:text-foreground"
            }`}
          >
            ALL ({totalCount})
          </button>
          {(Object.keys(CATEGORY_INFO) as CodexCategory[]).map(cat => {
            const info = CATEGORY_INFO[cat];
            const count = CODEX_ENTRIES.filter(e => e.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-[10px] tracking-wider border transition-all ${
                  selectedCategory === cat
                    ? `bg-primary/10 border-primary/40 ${info.color}`
                    : "bg-secondary/20 border-border/20 text-muted-foreground hover:text-foreground"
                }`}
              >
                {info.icon}
                {info.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 sm:px-6 mb-6">
        <div className="relative max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search the Codex..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-secondary/30 border border-border/20 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40"
          />
        </div>
      </div>

      {/* Entries */}
      <div className="px-4 sm:px-6 space-y-3">
        {filteredEntries.map((entry) => {
          const isUnlocked = getUnlockStatus(entry);
          const isExpanded = expandedEntry === entry.id;
          const catInfo = CATEGORY_INFO[entry.category];
          const rarityColor = RARITY_COLORS[entry.rarity];
          const rarityBg = RARITY_BG[entry.rarity];

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg border ${isUnlocked ? rarityColor : "border-border/10 opacity-60"} ${rarityBg} overflow-hidden`}
            >
              <button
                onClick={() => {
                  if (isUnlocked) {
                    setExpandedEntry(isExpanded ? null : entry.id);
                  }
                }}
                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-muted/15 transition-colors"
              >
                <div className={`p-1.5 rounded-md ${isUnlocked ? rarityBg : "bg-secondary/20"}`}>
                  {isUnlocked ? entry.icon : <Lock size={16} className="text-muted-foreground/40" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-xs font-semibold ${isUnlocked ? "" : "text-muted-foreground/40"}`}>
                      {isUnlocked ? entry.title : "█████████████"}
                    </span>
                    <span className={`font-mono text-[9px] ${catInfo.color} opacity-60`}>
                      {catInfo.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`font-mono text-[9px] uppercase tracking-wider ${RARITY_COLORS[entry.rarity].split(" ")[0]}`}>
                      {entry.rarity}
                    </span>
                    {!isUnlocked && (
                      <span className="font-mono text-[9px] text-muted-foreground/40">
                        // {entry.unlockCondition}
                      </span>
                    )}
                  </div>
                </div>
                {isUnlocked ? (
                  isExpanded ? <ChevronDown size={14} className="text-muted-foreground" /> : <ChevronRight size={14} className="text-muted-foreground" />
                ) : (
                  <Lock size={14} className="text-muted-foreground/30" />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && isUnlocked && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 border-t border-border/10 pt-3">
                      <div className="font-mono text-xs text-foreground/80 leading-relaxed whitespace-pre-line">
                        {entry.content}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={32} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="font-mono text-xs text-muted-foreground">No entries match your search.</p>
          </div>
        )}
      </div>

      {/* Faction Abilities Section */}
      <div className="px-4 sm:px-6 mt-10">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={14} className="text-primary" />
          <h2 className="font-display text-sm font-bold tracking-[0.2em] text-foreground">FACTION ABILITIES</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Architect Abilities */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Eye size={12} className="text-cyan-400" />
              <span className="font-mono text-[10px] text-cyan-400 tracking-wider">ARCHITECT PROTOCOLS</span>
            </div>
            {abilityEntries.filter(a => a.faction === "architect").map(a => (
              <div key={a.id} className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
                <p className="font-mono text-xs font-semibold text-cyan-400 mb-1">{a.name}</p>
                <p className="font-mono text-[10px] text-foreground/70 mb-1.5">{a.description}</p>
                <p className="font-mono text-[10px] text-cyan-400/50 italic">"{a.flavorText}"</p>
              </div>
            ))}
          </div>
          {/* Dreamer Abilities */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Star size={12} className="text-amber-400" />
              <span className="font-mono text-[10px] text-amber-400 tracking-wider">DREAMER DEFENSES</span>
            </div>
            {abilityEntries.filter(a => a.faction === "dreamer").map(a => (
              <div key={a.id} className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                <p className="font-mono text-xs font-semibold text-amber-400 mb-1">{a.name}</p>
                <p className="font-mono text-[10px] text-foreground/70 mb-1.5">{a.description}</p>
                <p className="font-mono text-[10px] text-amber-400/50 italic">"{a.flavorText}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
