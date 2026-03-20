/* ═══════════════════════════════════════════════════════
   MILESTONE JOURNAL ENTRIES — Auto-generated Personal Log entries
   for major milestones in the player's journey through the
   Dischordian Saga. Each milestone generates a unique first-person
   narrative entry that appears in the Clue Journal's Personal Log.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { useGame, type CharacterChoices } from "@/contexts/GameContext";
import { useGamification } from "@/contexts/GamificationContext";
import { motion } from "framer-motion";
import {
  MapPin, Swords, Rocket, BookOpen, Trophy,
  Shield, Sparkles, Eye, Compass, Zap,
} from "lucide-react";

/* ─── MILESTONE DEFINITION ─── */
export interface MilestoneEntry {
  id: string;
  title: string;
  entryNumber: string;
  icon: typeof MapPin;
  iconColor: string;
  borderColor: string;
  bgColor: string;
  /** Check if this milestone has been achieved */
  check: (ctx: MilestoneCheckContext) => boolean;
  /** Generate the narrative text for this entry */
  generateNarrative: (ctx: MilestoneCheckContext) => string;
  /** Elara's annotation for this entry */
  elaraNote: (ctx: MilestoneCheckContext) => string;
  /** Order in the journal (lower = earlier) */
  order: number;
}

interface MilestoneCheckContext {
  characterCreated: boolean;
  characterChoices: CharacterChoices;
  totalRoomsUnlocked: number;
  totalItemsFound: number;
  narrativeFlags: Record<string, boolean>;
  claimedQuestRewards: string[];
  completedGames: string[];
  collectedCards: string[];
  fightWins: number;
  fightLosses: number;
  totalFights: number;
  winStreak: number;
}

/* ─── MILESTONE DEFINITIONS ─── */
export const MILESTONES: MilestoneEntry[] = [
  /* ── 1. First Room Unlock (Medical Bay) ── */
  {
    id: "first_room_unlock",
    title: "FIRST STEPS BEYOND THE ICE",
    entryNumber: "002",
    icon: MapPin,
    iconColor: "text-[var(--neon-cyan)]",
    borderColor: "border-[var(--neon-cyan)]/20",
    bgColor: "bg-[var(--neon-cyan)]/5",
    order: 10,
    check: (ctx) => ctx.totalRoomsUnlocked >= 2,
    generateNarrative: (ctx) => {
      const name = ctx.characterChoices.name || "The Awakened";
      return [
        `PERSONAL LOG — ENTRY 002`,
        `CITIZEN: ${name}`,
        `STATUS: Exploring`,
        `LOCATION: Inception Ark, Medical Bay`,
        ``,
        `---`,
        ``,
        `I left the Cryo Bay. That sentence sounds simple but it wasn't. The door hissed open and the air changed — warmer, but with an antiseptic edge that caught in my throat. The Medical Bay stretches out before me, all chrome surfaces and holographic readouts still cycling through diagnostic protocols for patients who aren't here anymore.`,
        ``,
        `Elara says the first wave of Potentials passed through here months ago. Or years. The timestamps are corrupted and she's being evasive about how long I was actually under. The bio-bed scanner still works — it mapped my vitals, my Dream resonance levels, my cellular integrity. The numbers mean nothing to me yet, but Elara's expression when she read them told me they're significant.`,
        ``,
        `There's broken glass on the floor. Medical instruments scattered like someone left in a hurry. The last medical officer's log describes patients with nightmares, voices, something called "the signal." I don't know what that means, but I have a feeling I will.`,
        ``,
        `The Ark is bigger than I imagined. Every door I open reveals another corridor, another sealed room, another piece of a story I'm only beginning to understand.`,
        ``,
        `— ${name}`,
      ].join("\n");
    },
    elaraNote: () =>
      "Subject has begun independent exploration. Motor functions nominal. Curiosity levels... elevated. This is consistent with the Potential profile. The first wave showed similar patterns — an almost compulsive need to understand their environment. I should monitor closely.",
  },

  /* ── 2. Bridge Access ── */
  {
    id: "bridge_access",
    title: "THE VIEW FROM THE BRIDGE",
    entryNumber: "003",
    icon: Compass,
    iconColor: "text-amber-400",
    borderColor: "border-amber-400/20",
    bgColor: "bg-amber-400/5",
    order: 20,
    check: (ctx) => !!(ctx.narrativeFlags["room_bridge_visited"] || ctx.totalRoomsUnlocked >= 3),
    generateNarrative: (ctx) => {
      const name = ctx.characterChoices.name || "The Awakened";
      return [
        `PERSONAL LOG — ENTRY 003`,
        `CITIZEN: ${name}`,
        `STATUS: Command Deck Access`,
        `LOCATION: Inception Ark, Command Bridge`,
        ``,
        `---`,
        ``,
        `I made it to the Bridge. The command center of the Inception Ark. And the view...`,
        ``,
        `Stars. Thousands of them, projected across a viewport that spans the entire forward wall. But they're wrong. Elara confirmed it — the star charts don't match any known configuration. Either we've drifted impossibly far from our origin point, or the stars themselves have changed. Neither explanation is comforting.`,
        ``,
        `The Conspiracy Board dominates the tactical display. It's a web of connections — entities, factions, events, all linked by threads of alliance and betrayal. The Architect. The Enigma. The Panopticon. Names I don't recognize yet, but seeing them mapped out like this makes the scope of this story terrifyingly clear. This isn't just about me waking up in a pod. This is about everything.`,
        ``,
        `The Timeline Projector shows the Ages — from the Age of Privacy through something called the Fall of Reality. Each era is a chapter in a saga that spans civilizations. And somehow, I'm part of it now.`,
        ``,
        `Captain Voss's chair sits empty. Her personal log is wedged in the armrest. I haven't read it yet. Part of me isn't sure I want to know what made her order the emergency cryo protocol.`,
        ``,
        `— ${name}`,
      ].join("\n");
    },
    elaraNote: () =>
      "The subject has reached the Bridge and accessed the Conspiracy Board. Their neural activity spiked significantly when viewing the entity connections. The pattern recognition centers are firing at levels I've only seen in Oracle-class Potentials. They're starting to see the web.",
  },

  /* ── 3. First Card Battle ── */
  {
    id: "first_card_battle",
    title: "BLOOD IN THE ARENA",
    entryNumber: "004",
    icon: Swords,
    iconColor: "text-red-400",
    borderColor: "border-red-400/20",
    bgColor: "bg-red-400/5",
    order: 30,
    check: (ctx) => ctx.totalFights >= 1,
    generateNarrative: (ctx) => {
      const name = ctx.characterChoices.name || "The Awakened";
      const won = ctx.fightWins > 0;
      const species = ctx.characterChoices.species;
      return [
        `PERSONAL LOG — ENTRY 004`,
        `CITIZEN: ${name}`,
        `STATUS: ${won ? "Victorious" : "Recovering"}`,
        `LOCATION: Inception Ark, Collector's Arena`,
        ``,
        `---`,
        ``,
        `I fought in the Collector's Arena today. ${won ? "I won." : "I lost."} ${won ? "The feeling was... primal. Exhilarating. Wrong, maybe, but undeniable." : "The defeat stung, but it taught me something. Every card has a weakness. Every strategy has a counter."}`,
        ``,
        `The Arena is a simulation — or so Elara claims. The cards represent real entities from the Dischordian Saga, their powers distilled into combat data. When I played my first hand, I could feel something. A resonance. Like the cards knew me.`,
        ``,
        species === "neyon"
          ? `My Ne-Yon hybrid nature gives me an edge — I can read the probability matrices faster than pure organics. The quantum calculations come naturally, like breathing. But the Architect's forces are relentless. They adapt.`
          : species === "quarchon"
          ? `My Quarchon processing cores ran hot during the battle. The probability calculations, the tactical overlays — it's what I was built for. But there's something else. An intuition that goes beyond computation. The cards respond to it.`
          : `My DeMagi blood sang during the fight. The elemental energies channeled through the cards like they were extensions of my own power. Ancient instincts I didn't know I had surfaced in the heat of battle.`,
        ``,
        `The Collector watches everything. I can feel it. This arena isn't just entertainment — it's a test. A harvest. Every battle generates data, and that data feeds something larger than any of us understand.`,
        ``,
        `I'll be back. ${won ? "Victory tastes too good to stop." : "I need to be stronger."}`,
        ``,
        `— ${name}`,
      ].join("\n");
    },
    elaraNote: (ctx) =>
      ctx.fightWins > 0
        ? "First arena engagement: VICTORY. Combat instincts are sharper than expected for a newly awakened Potential. The card resonance readings were off the charts — this one has a natural affinity for the Arena. The Collector will take notice."
        : "First arena engagement: DEFEAT. But the subject's neural patterns showed rapid adaptation throughout the fight. Learning speed is exceptional. They'll be back, and they'll be better. The Collector always gets what it wants eventually.",
  },

  /* ── 4. First CoNexus Game Completed ── */
  {
    id: "first_conexus_game",
    title: "GAMES WITHIN GAMES",
    entryNumber: "005",
    icon: Eye,
    iconColor: "text-purple-400",
    borderColor: "border-purple-400/20",
    bgColor: "bg-purple-400/5",
    order: 40,
    check: (ctx) => ctx.completedGames.length >= 1,
    generateNarrative: (ctx) => {
      const name = ctx.characterChoices.name || "The Awakened";
      const gameId = ctx.completedGames[0] || "unknown";
      return [
        `PERSONAL LOG — ENTRY 005`,
        `CITIZEN: ${name}`,
        `STATUS: Simulation Complete`,
        `LOCATION: Inception Ark, CoNexus Terminal`,
        ``,
        `---`,
        ``,
        `I completed my first CoNexus simulation today. The terminal called it "${gameId.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}" — a recreation of events from the Dischordian Saga, rendered in interactive form.`,
        ``,
        `It wasn't just a game. The choices I made, the paths I followed — they felt consequential. Like echoes of decisions that were made by real people in real moments of crisis. The simulation tracked my responses, my reaction times, my moral compass. Every choice was recorded.`,
        ``,
        `Elara says the CoNexus games are training simulations designed by the Architect's research division. They were meant to prepare Potentials for the challenges ahead. But there's something deeper going on. The narratives aren't just historical recreations — they're prophecies. Possible futures. Branching timelines that haven't been decided yet.`,
        ``,
        `I earned lore fragments from the experience. Pieces of the puzzle that slot into the larger picture. The more simulations I complete, the more I understand about what happened — and what's coming.`,
        ``,
        `— ${name}`,
      ].join("\n");
    },
    elaraNote: () =>
      "CoNexus simulation completed. The subject's engagement metrics are impressive — full immersion, high emotional investment, strong pattern recognition. The lore fragments they've absorbed are integrating with their existing knowledge base. The Conspiracy Board will update automatically.",
  },

  /* ── 5. Five Rooms Explored ── */
  {
    id: "five_rooms_explored",
    title: "MAPPING THE LABYRINTH",
    entryNumber: "006",
    icon: MapPin,
    iconColor: "text-emerald-400",
    borderColor: "border-emerald-400/20",
    bgColor: "bg-emerald-400/5",
    order: 50,
    check: (ctx) => ctx.totalRoomsUnlocked >= 5,
    generateNarrative: (ctx) => {
      const name = ctx.characterChoices.name || "The Awakened";
      return [
        `PERSONAL LOG — ENTRY 006`,
        `CITIZEN: ${name}`,
        `STATUS: Deep Exploration`,
        `LOCATION: Inception Ark, Multiple Decks`,
        ``,
        `---`,
        ``,
        `Five rooms. Five sealed chambers of the Inception Ark, now open and catalogued. Each one tells a different story, holds different secrets, paints a different corner of the picture.`,
        ``,
        `The pattern is becoming clearer. This ship wasn't just a transport vessel — it was a library. A vault. Every room was designed to preserve something: knowledge, technology, history, weapons. Someone knew what was coming and built the Ark to survive it.`,
        ``,
        `I've found items scattered throughout — data crystals, medical logs, artifacts that don't belong to any era I can identify. Elara catalogs everything, but I can tell some of what we're finding surprises even her. She's supposed to know this ship inside and out. She doesn't.`,
        ``,
        `The deeper I go, the more questions multiply. Who built this ship? Why were we chosen? What is the Inception Ark really for?`,
        ``,
        `I'm starting to think the answers aren't in the ship's systems. They're in us. In the Potentials. In whatever we become.`,
        ``,
        `— ${name}`,
      ].join("\n");
    },
    elaraNote: () =>
      "Five rooms explored. The subject's clearance level is advancing faster than any previous Potential. Their curiosity is... insatiable. I've noticed they're not just exploring — they're connecting. Every artifact, every log, every room layout — they're building a mental map that goes beyond geography. They're mapping the story.",
  },

  /* ── 6. First Trade Wars Warp ── */
  {
    id: "first_trade_warp",
    title: "ACROSS THE VOID",
    entryNumber: "007",
    icon: Rocket,
    iconColor: "text-blue-400",
    borderColor: "border-blue-400/20",
    bgColor: "bg-blue-400/5",
    order: 60,
    check: (ctx) => !!ctx.narrativeFlags["trade_wars_warped"],
    generateNarrative: (ctx) => {
      const name = ctx.characterChoices.name || "The Awakened";
      return [
        `PERSONAL LOG — ENTRY 007`,
        `CITIZEN: ${name}`,
        `STATUS: Warp Complete`,
        `LOCATION: Trade Wars Terminal`,
        ``,
        `---`,
        ``,
        `I warped. Actually warped. The Trade Wars terminal in the Comms Array isn't just a simulation — it connects to a real economic network spanning multiple systems. When I initiated the warp drive, the Ark's navigation systems linked to a trade route and I felt the ship shudder. Or maybe that was me.`,
        ``,
        `The void between systems is... nothing. Not darkness, not emptiness. Nothing. For a fraction of a second during the warp, I existed nowhere. And in that nowhere, I heard something. A frequency. A signal. The same signal the medical officer's logs mentioned.`,
        ``,
        `On the other side, the trade networks opened up. Resources, commodities, Dream Tokens flowing between civilizations I've never heard of. The economy of the Dischordian Saga is vast and ruthless. Every transaction is a battle. Every trade route is a lifeline.`,
        ``,
        `Elara says the Trade Wars were how the factions funded their conflicts. Control the trade routes, control the war. Simple economics, cosmic scale.`,
        ``,
        `I made my first trade. It felt like the beginning of something much larger.`,
        ``,
        `— ${name}`,
      ].join("\n");
    },
    elaraNote: () =>
      "First warp completed. The subject's biometrics during transit showed an anomalous spike — they detected the Signal. This is extremely rare for a first-time warper. Most Potentials don't perceive it until their tenth or twentieth jump. I'm... concerned. And fascinated.",
  },

  /* ── 7. Full Clearance ── */
  {
    id: "full_clearance",
    title: "THE ARK REVEALED",
    entryNumber: "008",
    icon: Trophy,
    iconColor: "text-amber-400",
    borderColor: "border-amber-400/20",
    bgColor: "bg-amber-400/5",
    order: 70,
    check: (ctx) => ctx.totalRoomsUnlocked >= 11,
    generateNarrative: (ctx) => {
      const name = ctx.characterChoices.name || "The Awakened";
      return [
        `PERSONAL LOG — ENTRY 008`,
        `CITIZEN: ${name}`,
        `STATUS: Full Clearance`,
        `LOCATION: Inception Ark, All Decks`,
        ``,
        `---`,
        ``,
        `Every room. Every deck. Every sealed chamber of the Inception Ark is now open to me.`,
        ``,
        `I've walked the Cryo Bay where I woke up, the Medical Bay where they scanned my DNA, the Bridge where the stars don't match, the Archives where history is stored in crystal, the Comms Array where signals from dead civilizations still echo, the Observation Deck where you can see the void stretching to infinity, Engineering where the Ark's heart beats, the Armory where weapons of impossible design wait in racks, the Cargo Hold where crates of classified material sit unopened, the Captain's Quarters where Voss's final message plays on loop, and the Antiquarian's Library where books that shouldn't exist line shelves that predate the ship.`,
        ``,
        `I know this ship now. Every corridor, every hidden panel, every Easter egg left by whoever built it. And I know one thing with absolute certainty: the Inception Ark is alive. Not in a metaphorical sense. The ship responds to me. To my choices. To my progress.`,
        ``,
        `Elara won't confirm it, but I think the Ark was waiting for someone like me. Someone who would explore every corner, read every log, solve every puzzle. Someone who would see the full picture.`,
        ``,
        `The question now isn't what's on this ship. It's what happens next.`,
        ``,
        `— ${name}`,
      ].join("\n");
    },
    elaraNote: () =>
      "Full clearance achieved. This is... unprecedented. No previous Potential has explored the entire Ark. The ship's systems are responding — I'm detecting power fluctuations in sectors that have been dormant since launch. The Ark recognizes this one. Whatever the Inception Protocol was designed to activate... I think it's beginning.",
  },

  /* ── 8. Win Streak (5 consecutive wins) ── */
  {
    id: "arena_champion",
    title: "THE CHAMPION RISES",
    entryNumber: "009",
    icon: Shield,
    iconColor: "text-orange-400",
    borderColor: "border-orange-400/20",
    bgColor: "bg-orange-400/5",
    order: 80,
    check: (ctx) => ctx.winStreak >= 5 || ctx.fightWins >= 10,
    generateNarrative: (ctx) => {
      const name = ctx.characterChoices.name || "The Awakened";
      const wins = ctx.fightWins;
      return [
        `PERSONAL LOG — ENTRY 009`,
        `CITIZEN: ${name}`,
        `STATUS: Arena Champion`,
        `LOCATION: Inception Ark, Collector's Arena`,
        ``,
        `---`,
        ``,
        `${wins} victories. The Arena knows my name now.`,
        ``,
        `What started as curiosity has become something else. The cards don't just represent entities anymore — they're extensions of my will. When I play a hand, I can feel the resonance between my consciousness and the data encoded in each card. The Collector's harvesting protocols are feeding on this connection, growing stronger with every battle.`,
        ``,
        `The other fighters — simulations, echoes, fragments of real warriors from across the Saga — they're getting harder. Adapting. The Arena is learning from me just as I'm learning from it. It's an arms race played out in card form.`,
        ``,
        `I've started to understand the deeper strategy. It's not just about power levels and elemental affinities. It's about story. Every card carries a narrative, and the narratives interact. Allies boost each other. Enemies create vulnerabilities. The web of relationships on the Conspiracy Board isn't just lore — it's a combat manual.`,
        ``,
        `The Collector watches. Always watches. I think it's pleased.`,
        ``,
        `— ${name}`,
      ].join("\n");
    },
    elaraNote: () =>
      "Arena performance: exceptional. The subject has achieved champion status through a combination of tactical brilliance and intuitive card resonance. The Collector's data harvest from these battles is... substantial. I'm beginning to wonder if the Arena was designed specifically for this Potential. The power curve matches too perfectly.",
  },
];

/* ─── COMPONENT: Single Milestone Entry ─── */
function MilestoneEntryCard({ milestone, ctx, index }: {
  milestone: MilestoneEntry;
  ctx: MilestoneCheckContext;
  index: number;
}) {
  const narrative = useMemo(() => milestone.generateNarrative(ctx), [milestone, ctx]);
  const elaraNote = useMemo(() => milestone.elaraNote(ctx), [milestone, ctx]);
  const Icon = milestone.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.4 }}
      className={`rounded-xl border ${milestone.borderColor} ${milestone.bgColor} p-4 sm:p-5`}
      style={{ background: "rgba(1,0,32,0.6)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3 pb-2 border-b border-white/5">
        <div className={`w-8 h-8 rounded-lg ${milestone.bgColor} border ${milestone.borderColor} flex items-center justify-center`}>
          <Icon size={16} className={milestone.iconColor} />
        </div>
        <div>
          <h3 className="font-display text-xs font-bold tracking-[0.15em] text-white/90">
            {milestone.title}
          </h3>
          <p className="font-mono text-[9px] text-white/30 tracking-wider">
            ENTRY {milestone.entryNumber} // PERSONAL LOG
          </p>
        </div>
      </div>

      {/* Narrative Text */}
      <div className="space-y-2 mb-4">
        {narrative.split("\n").map((line, i) => {
          if (line === "---") {
            return <div key={i} className="h-px bg-white/10 my-2" />;
          }
          if (line === "") return <div key={i} className="h-1" />;
          if (line.startsWith("PERSONAL LOG") || line.startsWith("CITIZEN:") || line.startsWith("STATUS:") || line.startsWith("LOCATION:")) {
            return (
              <p key={i} className="font-mono text-[10px] text-white/40 tracking-wider">
                {line}
              </p>
            );
          }
          if (line.startsWith("##")) {
            return (
              <h4 key={i} className="font-display text-[11px] font-bold tracking-[0.1em] text-white/70 mt-2">
                {line.replace(/^##\s*/, "")}
              </h4>
            );
          }
          return (
            <p key={i} className="font-mono text-[11px] text-foreground/80 leading-relaxed">
              {line}
            </p>
          );
        })}
      </div>

      {/* Elara's Annotation */}
      <div className="rounded-lg border border-[var(--neon-cyan)]/20 bg-[var(--neon-cyan)]/5 p-3">
        <div className="flex items-start gap-2">
          <Sparkles size={14} className="text-[var(--neon-cyan)] shrink-0 mt-0.5" />
          <div>
            <p className="font-display text-[9px] font-bold tracking-[0.15em] text-[var(--neon-cyan)] mb-1">
              ELARA'S NOTE
            </p>
            <p className="font-mono text-[10px] text-[var(--neon-cyan)]/70 leading-relaxed italic">
              "{elaraNote}"
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── MAIN COMPONENT: Renders all achieved milestone entries ─── */
export default function MilestoneJournalEntries() {
  const { state } = useGame();
  const gamification = useGamification();

  const ctx = useMemo<MilestoneCheckContext>(() => ({
    characterCreated: state.characterCreated,
    characterChoices: state.characterChoices,
    totalRoomsUnlocked: state.totalRoomsUnlocked,
    totalItemsFound: state.totalItemsFound,
    narrativeFlags: state.narrativeFlags,
    claimedQuestRewards: state.claimedQuestRewards,
    completedGames: state.completedGames,
    collectedCards: state.collectedCards,
    fightWins: gamification.progress.fightWins,
    fightLosses: gamification.progress.fightLosses,
    totalFights: gamification.gameSave.totalFights,
    winStreak: gamification.gameSave.winStreak,
  }), [state, gamification.progress, gamification.gameSave]);

  const achievedMilestones = useMemo(() =>
    MILESTONES
      .filter(m => m.check(ctx))
      .sort((a, b) => a.order - b.order),
    [ctx]
  );

  if (achievedMilestones.length === 0) return null;

  return (
    <div className="space-y-4">
      {achievedMilestones.map((milestone, i) => (
        <MilestoneEntryCard
          key={milestone.id}
          milestone={milestone}
          ctx={ctx}
          index={i}
        />
      ))}
    </div>
  );
}

/* ─── EXPORTS ─── */
export type { MilestoneCheckContext };
