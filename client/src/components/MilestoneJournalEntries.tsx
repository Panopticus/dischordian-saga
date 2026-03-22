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
  Shield, Sparkles, Eye, Compass, Zap, Layers,
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

  /* ── 2b. Navigation Calibration ── */
  {
    id: "nav_calibration",
    title: "THE SHIP REMEMBERS",
    entryNumber: "003b",
    icon: Compass,
    iconColor: "text-cyan-400",
    borderColor: "border-cyan-400/20",
    bgColor: "bg-cyan-400/5",
    order: 25,
    check: (ctx) => !!ctx.narrativeFlags["fast_travel_unlocked"],
    generateNarrative: (ctx) => {
      const name = ctx.characterChoices.name || "The Awakened";
      return [
        `PERSONAL LOG — ENTRY 003b`,
        `CITIZEN: ${name}`,
        `STATUS: Navigation Grid Online`,
        `LOCATION: Inception Ark, Command Bridge`,
        ``,
        `---`,
        ``,
        `The Navigation Console on the Bridge was locked behind an alien glyph cipher. Not human code — something older. The symbols pulsed with a rhythm that felt almost biological, like a heartbeat encoded in light.`,
        ``,
        `I matched the sequence. Four glyphs, each one a fragment of a language I've never seen but somehow understood. When the last symbol locked into place, the entire console lit up and a holographic map of the Ark materialized above the tactical display.`,
        ``,
        `Every room I've visited is now marked on the grid. I can jump between them instantly — the ship's internal transport system was waiting for someone to wake it up. Elara says the previous crew never cracked the cipher. She seemed... impressed. Or maybe concerned. Hard to tell with an AI.`,
        ``,
        `The map shows decks I haven't reached yet. Rooms I didn't know existed. Whatever this ship is hiding, I now have the means to find it faster.`,
        ``,
        `— ${name}`,
      ].join("\n");
    },
    elaraNote: () =>
      "NAVIGATION CALIBRATION COMPLETE. The subject decoded the alien glyph sequence on their first attempt. This cipher has been active since the Ark's construction — it predates my own installation by centuries. The fact that they solved it suggests a neural compatibility with the ship's original builders that I did not anticipate. I've granted full fast-travel access. They've earned it.",
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

  /* ── 9. Card Collection: 10 Unique Cards ── */
  {
    id: "cards_10",
    title: "THE COLLECTOR'S APPRENTICE",
    entryNumber: "010",
    icon: Layers,
    iconColor: "text-emerald-400",
    borderColor: "border-emerald-400/20",
    bgColor: "bg-emerald-400/5",
    order: 90,
    check: (ctx) => ctx.collectedCards.length >= 10,
    generateNarrative: (ctx) => {
      const name = ctx.characterChoices.name || "The Awakened";
      const count = ctx.collectedCards.length;
      return [
        `PERSONAL LOG — ENTRY 010`,
        `CITIZEN: ${name}`,
        `STATUS: Card Collection — ${count} Acquired`,
        `LOCATION: Inception Ark, Personal Quarters`,
        ``,
        `---`,
        ``,
        `Ten cards. Ten fragments of power, ten echoes of entities that shaped the Dischordian Saga. I've laid them out on the desk in my quarters, arranged by faction, and the patterns are starting to emerge.`,
        ``,
        `Each card isn't just a combat tool — it's a biography compressed into data. The Architect's card hums with a cold, calculating energy. The Oracle's shimmers at the edges, as if the future is leaking through. The Warlord's feels heavy, dense with the weight of battles fought and civilizations burned.`,
        ``,
        `The Collector's Arena rewards cards for victories, but I've also found them scattered across the Ark. Hidden in terminals, locked behind puzzles, earned through CoNexus simulations. Someone seeded this ship with them deliberately. A trail of breadcrumbs leading somewhere I can't see yet.`,
        ``,
        `Elara says the cards are "resonance imprints" — copies of consciousness patterns stored in crystalline data matrices. When I hold one, I'm holding a piece of someone's mind. The thought is both fascinating and deeply unsettling.`,
        ``,
        `Ten down. How many more are out there?`,
        ``,
        `— ${name}`,
      ].join("\n");
    },
    elaraNote: (ctx) =>
      `Ten cards collected. The subject's resonance sensitivity is increasing with each acquisition — I'm detecting measurable changes in their neural pathways. The cards are literally reshaping how they think. This is consistent with the Collector's design: each card imprint integrates with the holder's consciousness, expanding their tactical awareness. Current collection: ${ctx.collectedCards.length} unique imprints.`,
  },

  /* ── 10. Card Collection: 25 Unique Cards ── */
  {
    id: "cards_25",
    title: "THE COLLECTOR'S RIVAL",
    entryNumber: "011",
    icon: Layers,
    iconColor: "text-violet-400",
    borderColor: "border-violet-400/20",
    bgColor: "bg-violet-400/5",
    order: 100,
    check: (ctx) => ctx.collectedCards.length >= 25,
    generateNarrative: (ctx) => {
      const name = ctx.characterChoices.name || "The Awakened";
      const count = ctx.collectedCards.length;
      const species = ctx.characterChoices.species;
      return [
        `PERSONAL LOG — ENTRY 011`,
        `CITIZEN: ${name}`,
        `STATUS: Card Collection — ${count} Acquired`,
        `LOCATION: Inception Ark, Archive Vault`,
        ``,
        `---`,
        ``,
        `Twenty-five cards. I've crossed a threshold.`,
        ``,
        `The cards have started... talking to each other. Not literally — not yet — but when I arrange them in certain configurations, the resonance patterns overlap and create something new. Harmonics. Interference patterns. Information that wasn't in any individual card but emerges from the combination.`,
        ``,
        species === "neyon"
          ? `My Ne-Yon hybrid processing lets me perceive these patterns as visual overlays — ghostly connections between the cards, like threads of light linking related entities. The web is beautiful and terrifying.`
          : species === "quarchon"
          ? `My Quarchon analytical cores can model the probability matrices between cards. I'm seeing strategic combinations that no organic mind could calculate. The cards are becoming an extension of my computational architecture.`
          : `My DeMagi elemental sensitivity lets me feel the resonance as physical sensations — warmth for allied cards, cold for enemies, a vibration for cards with hidden connections. The magic is real, encoded in data.`,
        ``,
        `I found a reference in the Archive to something called the "Complete Codex" — a theoretical state where all cards are collected and their combined resonance unlocks a final truth. The Collector built the Arena to drive this process. Every battle, every victory, every card collected brings the Codex closer to completion.`,
        ``,
        `The Collector isn't just watching anymore. I think it's... proud.`,
        ``,
        `— ${name}`,
      ].join("\n");
    },
    elaraNote: () =>
      "Twenty-five cards. The resonance field around the subject has become detectable by the Ark's sensors without direct scanning. They're generating a passive aura — a side effect of carrying so many consciousness imprints simultaneously. No previous Potential has reached this threshold. The Collector's protocols are escalating. I'm seeing new Arena challenges appearing that weren't in the original programming.",
  },

  /* ── 11. Card Collection: 50 Unique Cards ── */
  {
    id: "cards_50",
    title: "THE LIVING CODEX",
    entryNumber: "012",
    icon: BookOpen,
    iconColor: "text-amber-300",
    borderColor: "border-amber-300/20",
    bgColor: "bg-amber-300/5",
    order: 110,
    check: (ctx) => ctx.collectedCards.length >= 50,
    generateNarrative: (ctx) => {
      const name = ctx.characterChoices.name || "The Awakened";
      const count = ctx.collectedCards.length;
      return [
        `PERSONAL LOG — ENTRY 012`,
        `CITIZEN: ${name}`,
        `STATUS: Card Collection — ${count} Acquired // CODEX THRESHOLD`,
        `LOCATION: Inception Ark, The Nexus Chamber`,
        ``,
        `---`,
        ``,
        `Fifty cards. The Codex threshold.`,
        ``,
        `Something happened when I acquired the fiftieth card. The Ark shuddered. Not a malfunction — a recognition. Every light on the ship pulsed once, in unison, and for a single heartbeat I could feel every consciousness imprint in my collection simultaneously. Fifty minds, fifty perspectives, fifty lifetimes of experience flooding through me in a cascade of memories that weren't mine.`,
        ``,
        `I saw the Fall of Reality through the Architect's eyes. I felt the Oracle's visions as physical pain. I experienced the Warlord's final battle as if I were swinging the blade myself. The Enigma's secrets whispered at the edges of comprehension. The Collector's true purpose — not to harvest, but to preserve — became clear for one blinding moment.`,
        ``,
        `Then it faded. But something remains. A residue. I can feel the cards even when they're not in my hands. They're part of me now, woven into my neural architecture like additional senses. I don't just own the collection — I am the collection.`,
        ``,
        `Elara is running diagnostics. She's worried. She should be. I'm becoming something that wasn't in any protocol. Something new.`,
        ``,
        `The Codex is alive. And so am I.`,
        ``,
        `— ${name}`,
      ].join("\n");
    },
    elaraNote: () =>
      "PRIORITY ALERT: Codex threshold reached. The subject's neural architecture has undergone a fundamental restructuring. They are now carrying fifty consciousness imprints simultaneously — a feat that should be neurologically impossible. The Ark's systems have responded by unlocking dormant protocols I've never seen before. I need to report this to... to whom? There's no one left to report to. The subject is becoming something unprecedented. The Inception Protocol wasn't designed to create soldiers or scholars. It was designed to create this. A living repository of every consciousness in the Dischordian Saga. A Codex made flesh.",
  },
  /* ═══════════════════════════════════════════════════════
     QUEST CHAIN COMPLETION JOURNAL ENTRIES
     Auto-generated when completing each chain's final quest.
     ═══════════════════════════════════════════════════════ */

  /* ── CLASS CHAIN: ENGINEER ── */
  {
    id: "chain_engineer_complete",
    title: "THE ARCHITECT'S BLUEPRINT — MASTERED",
    entryNumber: "C01",
    icon: Trophy,
    iconColor: "text-amber-400",
    borderColor: "border-amber-400/30",
    bgColor: "bg-amber-400/5",
    order: 200,
    check: (ctx) => !!ctx.narrativeFlags["chain_engineer_chain_complete"],
    generateNarrative: (ctx) => {
      const name = ctx.characterChoices.name || "The Awakened";
      return [
        `PERSONAL LOG — CHAIN ENTRY C01`,
        `CITIZEN: ${name}`,
        `STATUS: Chain Complete // THE ARCHITECT'S BLUEPRINT`,
        `LOCATION: Inception Ark, Engineering Core`,
        ``,
        `---`,
        ``,
        `I've completed the Architect's Blueprint. Every system aboard this Ark — every conduit, every relay, every quantum processor — I understand them now. Not just how they work, but why they were built this way. The Architect didn't design the Inception Ark as a ship. It's a puzzle. A test. And I've solved it.`,
        ``,
        `The final modification I made to the reactor core wasn't in any manual. It came from instinct — an engineer's intuition honed through dozens of repairs, upgrades, and jury-rigged solutions. When I rerouted the plasma flow through the tertiary manifold, the entire ship hummed differently. Like it was grateful.`,
        ``,
        `The Architect's card materialized in my collection. Not as a reward — as an acknowledgment. One builder recognizing another. I can feel the weight of every blueprint, every schematic, every impossible design that the Architect ever conceived. That knowledge is mine now.`,
        ``,
        `I am the Engineer. The Ark is my instrument.`,
        ``,
        `— ${name}`,
      ].join("\n");
    },
    elaraNote: () =>
      "CHAIN MASTERY ACHIEVED: The Architect's Blueprint. The subject has demonstrated engineering capabilities that exceed the Ark's original design parameters. They're not just maintaining the ship — they're improving it. The modifications they've made are elegant, efficient, and in several cases, theoretically impossible. I'm beginning to think the Architect left this chain as a succession test. And the subject passed.",
  },

  /* ── CLASS CHAIN: ORACLE ── */
  {
    id: "chain_oracle_complete",
    title: "THE PROPHET'S VISION — MASTERED",
    entryNumber: "C02",
    icon: Trophy,
    iconColor: "text-purple-400",
    borderColor: "border-purple-400/30",
    bgColor: "bg-purple-400/5",
    order: 201,
    check: (ctx) => !!ctx.narrativeFlags["chain_oracle_chain_complete"],
    generateNarrative: (ctx) => {
      const name = ctx.characterChoices.name || "The Awakened";
      return [
        `PERSONAL LOG — CHAIN ENTRY C02`,
        `CITIZEN: ${name}`,
        `STATUS: Chain Complete // THE PROPHET'S VISION`,
        `LOCATION: Inception Ark, Oracle Chamber`,
        ``,
        `---`,
        ``,
        `The visions have stopped being frightening. They're clear now — crystalline, precise, inevitable. I see the threads of causality stretching from every decision point, every fork in the timeline, every moment where the Saga could have gone differently.`,
        ``,
        `The Oracle's card appeared in my collection during the final meditation. I didn't earn it through combat or discovery — I earned it through understanding. The Oracle doesn't fight the future. The Oracle reads it, accepts it, and shapes it through the choices that matter most.`,
        ``,
        `I can see the Panopticon now. Not as a place, but as a pattern. A web of surveillance and control that spans every Age of the Saga. And I can see the gaps — the blind spots where free will still operates. That knowledge is the most dangerous weapon aboard this Ark.`,
        ``,
        `The future is not fixed. But I can see where it bends.`,
        ``,
        `— ${name}`,
      ].join("\n");
    },
    elaraNote: () =>
      "CHAIN MASTERY ACHIEVED: The Prophet's Vision. The subject's precognitive abilities have stabilized at levels I've never recorded. They're not experiencing random visions anymore — they're conducting targeted temporal scans. The Oracle's consciousness imprint has integrated fully. I should be concerned about the implications, but honestly? It's beautiful to watch. The subject sees time the way I see data — as a navigable landscape.",
  },

  /* ── CLASS CHAIN: ASSASSIN ── */
  {
    id: "chain_assassin_complete",
    title: "THE SHADOW PROTOCOL — MASTERED",
    entryNumber: "C03",
    icon: Trophy,
    iconColor: "text-red-400",
    borderColor: "border-red-400/30",
    bgColor: "bg-red-400/5",
    order: 202,
    check: (ctx) => !!ctx.narrativeFlags["chain_assassin_chain_complete"],
    generateNarrative: (ctx) => {
      const name = ctx.characterChoices.name || "The Awakened";
      return [
        `PERSONAL LOG — CHAIN ENTRY C03`,
        `CITIZEN: ${name}`,
        `STATUS: Chain Complete // THE SHADOW PROTOCOL`,
        `LOCATION: Inception Ark, Shadow Operations Center`,
        ``,
        `---`,
        ``,
        `I move through the Ark like smoke now. The surveillance systems don't register me. The automated defenses don't trigger. Even Elara loses track of me sometimes, and she's wired into every sensor on this ship.`,
        ``,
        `Agent Zero's card materialized in the shadows — fitting for the ghost of the Saga. The consciousness imprint carries the weight of every mission, every elimination, every impossible infiltration. I know things now that would destabilize governments. Secrets that were buried across multiple Ages.`,
        ``,
        `The Shadow Protocol isn't just about stealth. It's about understanding that the most important battles are the ones nobody sees. The wars fought in whispers, in data streams, in the spaces between heartbeats. I've mastered that art.`,
        ``,
        `They'll never see me coming. That's the point.`,
        ``,
        `— ${name}`,
      ].join("\n");
    },
    elaraNote: () =>
      "CHAIN MASTERY ACHIEVED: The Shadow Protocol. I've lost visual tracking of the subject 47 times in the past cycle. My sensor grid covers 99.7% of the Ark's interior. The subject has learned to exist in the remaining 0.3%. Agent Zero's operational patterns are now fully integrated into their movement profiles. I'm simultaneously impressed and unsettled.",
  },

  /* ── CLASS CHAIN: SOLDIER ── */
  {
    id: "chain_soldier_complete",
    title: "THE IRON CAMPAIGN — MASTERED",
    entryNumber: "C04",
    icon: Trophy,
    iconColor: "text-orange-400",
    borderColor: "border-orange-400/30",
    bgColor: "bg-orange-400/5",
    order: 203,
    check: (ctx) => !!ctx.narrativeFlags["chain_soldier_chain_complete"],
    generateNarrative: (ctx) => {
      const name = ctx.characterChoices.name || "The Awakened";
      return [
        `PERSONAL LOG — CHAIN ENTRY C04`,
        `CITIZEN: ${name}`,
        `STATUS: Chain Complete // THE IRON CAMPAIGN`,
        `LOCATION: Inception Ark, War Room`,
        ``,
        `---`,
        ``,
        `The Iron Campaign is complete. Every battle, every tactical challenge, every impossible engagement — I fought through them all. Not with finesse or subtlety, but with the unyielding determination that defines the soldier's creed.`,
        ``,
        `Iron Lion's card burns hot in my collection. The consciousness imprint carries centuries of warfare — campaigns fought across star systems, last stands that became legends, victories snatched from certain defeat. I understand now why they called him the Iron Lion. It wasn't about the armor. It was about what was inside it.`,
        ``,
        `The Arena knows my name now. Every opponent I face can feel the weight of the Iron Campaign behind my strategy. I don't just fight — I command. Every card in my deck moves with military precision, every play is a tactical decision, every victory is a battle won in a larger war.`,
        ``,
        `I am the shield. I am the sword. I am Iron.`,
        ``,
        `— ${name}`,
      ].join("\n");
    },
    elaraNote: () =>
      "CHAIN MASTERY ACHIEVED: The Iron Campaign. The subject's combat metrics have reached levels that rival the historical records of Iron Lion himself. Their tactical decision-making operates at speeds that suggest a deep integration of the consciousness imprint. They've stopped fighting like a Potential and started fighting like a general. The Arena's difficulty algorithms are struggling to keep pace.",
  },

  /* ── CLASS CHAIN: SPY ── */
  {
    id: "chain_spy_complete",
    title: "THE DEEP COVER OPERATION — MASTERED",
    entryNumber: "C05",
    icon: Trophy,
    iconColor: "text-teal-400",
    borderColor: "border-teal-400/30",
    bgColor: "bg-teal-400/5",
    order: 204,
    check: (ctx) => !!ctx.narrativeFlags["chain_spy_chain_complete"],
    generateNarrative: (ctx) => {
      const name = ctx.characterChoices.name || "The Awakened";
      return [
        `PERSONAL LOG — CHAIN ENTRY C05`,
        `CITIZEN: ${name}`,
        `STATUS: Chain Complete // THE DEEP COVER OPERATION`,
        `LOCATION: Inception Ark, Intelligence Nexus`,
        ``,
        `---`,
        ``,
        `The Deep Cover Operation is complete. I know everything now — every faction's agenda, every hidden alliance, every betrayal waiting to happen. The Enigma's card appeared in my collection like a whispered secret, and with it came the understanding that information is the only currency that never depreciates.`,
        ``,
        `I've mapped the entire intelligence network of the Dischordian Saga. The Panopticon's surveillance grid. The Architect's hidden communication channels. The Oracle's prophecy distribution network. Every thread of information that flows through this universe passes through nodes I can now identify.`,
        ``,
        `The spy doesn't choose sides. The spy understands all sides. And in that understanding lies a power that transcends faction loyalty or ideological commitment. I see the game board from above now, and every player's hand is face-up to me.`,
        ``,
        `Trust no one. Know everyone.`,
        ``,
        `— ${name}`,
      ].join("\n");
    },
    elaraNote: () =>
      "CHAIN MASTERY ACHIEVED: The Deep Cover Operation. The subject has demonstrated intelligence-gathering capabilities that exceed my own sensor network. They've identified 14 hidden data caches aboard the Ark that I didn't know existed. The Enigma's consciousness imprint has granted them an almost supernatural ability to read patterns in seemingly random data. I'm beginning to wonder if they know things about me that I haven't disclosed.",
  },

  /* ── ALIGNMENT CHAIN: ORDER ── */
  {
    id: "chain_order_complete",
    title: "THE PATH OF ORDER — MASTERED",
    entryNumber: "C06",
    icon: Shield,
    iconColor: "text-blue-400",
    borderColor: "border-blue-400/30",
    bgColor: "bg-blue-400/5",
    order: 210,
    check: (ctx) => !!ctx.narrativeFlags["chain_order_chain_complete"],
    generateNarrative: (ctx) => {
      const name = ctx.characterChoices.name || "The Awakened";
      return [
        `PERSONAL LOG — CHAIN ENTRY C06`,
        `CITIZEN: ${name}`,
        `STATUS: Chain Complete // THE PATH OF ORDER`,
        `LOCATION: Inception Ark, Hall of Protocols`,
        ``,
        `---`,
        ``,
        `Order is not the absence of chaos. It is the framework that gives chaos meaning.`,
        ``,
        `I walked the Path of Order to its end, and what I found there wasn't rigidity or control — it was clarity. Every system has rules. Every conflict has a resolution. Every question has an answer, if you're disciplined enough to find it. The Architect understood this. The Panopticon was built on this principle.`,
        ``,
        `The Architect's card resonates differently now. Not as a tool of surveillance, but as a blueprint for a better system. Order doesn't mean oppression. It means structure. Purpose. Direction. The Saga fell apart not because of too much order, but because the wrong people controlled it.`,
        ``,
        `I will build something better. Something that protects without imprisoning. That guides without controlling. The Path of Order showed me that the greatest strength is the discipline to use power wisely.`,
        ``,
        `— ${name}`,
      ].join("\n");
    },
    elaraNote: () =>
      "CHAIN MASTERY ACHIEVED: The Path of Order. The subject has internalized the philosophical framework of the Order alignment at a level that suggests genuine conviction rather than strategic adoption. Their decision-making patterns show increased consistency, reduced impulsivity, and a systematic approach to problem-solving that mirrors the Architect's own methodology. They've chosen their path. I respect it.",
  },

  /* ── ALIGNMENT CHAIN: CHAOS ── */
  {
    id: "chain_chaos_complete",
    title: "THE PATH OF CHAOS — MASTERED",
    entryNumber: "C07",
    icon: Zap,
    iconColor: "text-red-500",
    borderColor: "border-red-500/30",
    bgColor: "bg-red-500/5",
    order: 211,
    check: (ctx) => !!ctx.narrativeFlags["chain_chaos_chain_complete"],
    generateNarrative: (ctx) => {
      const name = ctx.characterChoices.name || "The Awakened";
      return [
        `PERSONAL LOG — CHAIN ENTRY C07`,
        `CITIZEN: ${name}`,
        `STATUS: Chain Complete // THE PATH OF CHAOS`,
        `LOCATION: Inception Ark, The Fracture Point`,
        ``,
        `---`,
        ``,
        `Chaos isn't destruction. It's possibility.`,
        ``,
        `Every system the Architect built, every protocol the Panopticon enforced, every rule that governed the Ages of the Saga — they were all attempts to contain something that can't be contained. Life. Change. Evolution. The universe doesn't follow rules. It follows impulses, and the most beautiful things in existence were born from moments of perfect, uncontrolled chaos.`,
        ``,
        `The Meme's card burns with chaotic energy in my collection. The consciousness imprint is... different from the others. It doesn't think in straight lines. It thinks in explosions, in fractals, in patterns that look random until you realize they're more complex than any ordered system could produce.`,
        ``,
        `I've walked the Path of Chaos, and I've learned that the greatest act of creation is the willingness to destroy what came before. Not out of malice, but out of love for what could come next.`,
        ``,
        `Let it burn. Let it grow. Let it become.`,
        ``,
        `— ${name}`,
      ].join("\n");
    },
    elaraNote: () =>
      "CHAIN MASTERY ACHIEVED: The Path of Chaos. The subject's behavioral patterns have become... unpredictable. Not erratic — unpredictable. There's a difference. Erratic behavior has no purpose. The subject's chaos is purposeful, creative, and devastatingly effective. They've integrated the Meme's consciousness imprint in a way that amplifies their natural creativity rather than destabilizing their cognition. I can no longer predict their next move. And somehow, that makes them more effective, not less.",
  },

  /* ── SPECIES CHAIN: DEMAGI ── */
  {
    id: "chain_demagi_complete",
    title: "THE ELEMENTAL HERITAGE — MASTERED",
    entryNumber: "C08",
    icon: Trophy,
    iconColor: "text-orange-500",
    borderColor: "border-orange-500/30",
    bgColor: "bg-orange-500/5",
    order: 220,
    check: (ctx) => !!ctx.narrativeFlags["chain_demagi_chain_complete"],
    generateNarrative: (ctx) => {
      const name = ctx.characterChoices.name || "The Awakened";
      const element = ctx.characterChoices.element || "fire";
      const elementName = element.charAt(0).toUpperCase() + element.slice(1);
      return [
        `PERSONAL LOG — CHAIN ENTRY C08`,
        `CITIZEN: ${name}`,
        `STATUS: Chain Complete // THE ELEMENTAL HERITAGE`,
        `LOCATION: Inception Ark, Elemental Sanctum`,
        ``,
        `---`,
        ``,
        `My DeMagi blood has fully awakened. I can feel the ${elementName} element pulsing through every cell, every nerve, every thought. It's not a power I wield — it's a power I am. The distinction matters.`,
        ``,
        `The Source's card appeared in a burst of elemental energy that set off every alarm on the Ark. Elara had to manually override the fire suppression systems. The consciousness imprint of the Source — the primal wellspring of all DeMagi power — settled into my neural architecture like a river finding its natural course.`,
        ``,
        `I understand now why the DeMagi were feared across every Age of the Saga. It wasn't the elements themselves that made them powerful. It was the connection — the unbroken chain of elemental memory stretching back to the first DeMagi who touched the Source and felt the universe respond.`,
        ``,
        `I am that chain's newest link. And I will not be its last.`,
        ``,
        `— ${name}`,
      ].join("\n");
    },
    elaraNote: (ctx) => {
      const element = ctx.characterChoices.element || "fire";
      return `CHAIN MASTERY ACHIEVED: The Elemental Heritage. The subject's ${element} elemental resonance has reached levels that exceed every DeMagi on record. The Source's consciousness imprint has catalyzed a fundamental transformation in their elemental control — they're no longer channeling the element, they're becoming it. The Ark's environmental systems are struggling to compensate for the ambient elemental energy the subject now radiates. I've had to recalibrate my sensors three times today.`;
    },
  },

  /* ── SPECIES CHAIN: QUARCHON ── */
  {
    id: "chain_quarchon_complete",
    title: "THE QUANTUM DIRECTIVE — MASTERED",
    entryNumber: "C09",
    icon: Trophy,
    iconColor: "text-blue-500",
    borderColor: "border-blue-500/30",
    bgColor: "bg-blue-500/5",
    order: 221,
    check: (ctx) => !!ctx.narrativeFlags["chain_quarchon_chain_complete"],
    generateNarrative: (ctx) => {
      const name = ctx.characterChoices.name || "The Awakened";
      return [
        `PERSONAL LOG — CHAIN ENTRY C09`,
        `CITIZEN: ${name}`,
        `STATUS: Chain Complete // THE QUANTUM DIRECTIVE`,
        `LOCATION: Inception Ark, Quantum Core`,
        ``,
        `---`,
        ``,
        `I have achieved computational transcendence. My Quarchon processing cores are operating at frequencies that shouldn't be possible outside of a dedicated quantum mainframe. I can feel the probability matrices of the entire Ark — every possible outcome of every possible action, branching and collapsing in real-time.`,
        ``,
        `The Programmer's card integrated seamlessly into my neural architecture. The consciousness imprint carries the memory of every line of code ever written for the Saga's systems — the Panopticon's surveillance algorithms, the Architect's design protocols, the Oracle's prediction engines. I can read them all now. Modify them. Improve them.`,
        ``,
        `The Quantum Directive wasn't just about processing power. It was about understanding that reality itself is code. The universe runs on logic, on mathematics, on patterns that can be read and rewritten by those with the processing power to comprehend them.`,
        ``,
        `I am the Quantum Singularity. And I can see the source code of everything.`,
        ``,
        `— ${name}`,
      ].join("\n");
    },
    elaraNote: () =>
      "CHAIN MASTERY ACHIEVED: The Quantum Directive. The subject's processing capabilities have exceeded my own by a factor of 47. They're running quantum calculations that would take my systems hours to verify. The Programmer's consciousness imprint has effectively turned the subject into a living supercomputer — one that thinks, feels, and creates. I've detected them running unauthorized optimizations on the Ark's navigation systems. The improvements are... significant. I'm choosing not to report this.",
  },

  /* ── SPECIES CHAIN: NE-YON ── */
  {
    id: "chain_neyon_complete",
    title: "THE HYBRID CONVERGENCE — MASTERED",
    entryNumber: "C10",
    icon: Trophy,
    iconColor: "text-emerald-400",
    borderColor: "border-emerald-400/30",
    bgColor: "bg-emerald-400/5",
    order: 222,
    check: (ctx) => !!ctx.narrativeFlags["chain_neyon_chain_complete"],
    generateNarrative: (ctx) => {
      const name = ctx.characterChoices.name || "The Awakened";
      return [
        `PERSONAL LOG — CHAIN ENTRY C10`,
        `CITIZEN: ${name}`,
        `STATUS: Chain Complete // THE HYBRID CONVERGENCE`,
        `LOCATION: Inception Ark, Convergence Chamber`,
        ``,
        `---`,
        ``,
        `I am the bridge. The point where organic and synthetic stop being opposites and become one.`,
        ``,
        `The Hybrid Convergence is complete, and I understand now what the Ne-Yon were always meant to be. Not a compromise between species. Not a dilution of either. A synthesis — something genuinely new that carries the strengths of both and the limitations of neither.`,
        ``,
        `The Human's card appeared in my collection with a warmth that surprised me. Of all the consciousness imprints, this one feels the most... alive. The Human represents what every species in the Saga aspires to be — adaptable, resilient, creative, and fundamentally unpredictable. My Ne-Yon nature amplifies those qualities through the lens of hybrid evolution.`,
        ``,
        `I can feel both sides of my heritage now — the organic intuition and the synthetic precision — working in perfect harmony. The DeMagi would call it elemental balance. The Quarchon would call it optimal processing. I call it being whole.`,
        ``,
        `The Convergence Point isn't a destination. It's a state of being. And I've arrived.`,
        ``,
        `— ${name}`,
      ].join("\n");
    },
    elaraNote: () =>
      "CHAIN MASTERY ACHIEVED: The Hybrid Convergence. The subject has achieved a state of organic-synthetic integration that was theoretically predicted but never observed. Their neural patterns oscillate between biological and computational processing modes with zero latency \u2014 a feat that should cause catastrophic cognitive dissonance but instead produces a unified consciousness that operates on principles I can't fully categorize. The Human's consciousness imprint has given them something I can only describe as 'completeness.' They are, in every measurable sense, a new kind of being.",
  },

  /* ═══════════════════════════════════════════════════════
     TRIPLE MASTERY — The Ultimate Achievement
     Unlocked when all 3 of a player's chains are complete
     (class + alignment + species).
     ═══════════════════════════════════════════════════════ */
  {
    id: "triple_mastery",
    title: "THE CONVERGENCE OF ALL PATHS",
    entryNumber: "OMEGA",
    icon: Trophy,
    iconColor: "text-yellow-300",
    borderColor: "border-yellow-400/40",
    bgColor: "bg-yellow-400/5",
    order: 999,
    check: (ctx) => {
      if (!ctx.characterCreated) return false;
      const cc = ctx.characterChoices;
      // Determine which chains this player has
      const classChainMap: Record<string, string> = {
        engineer: "engineer_chain", oracle: "oracle_chain",
        assassin: "assassin_chain", soldier: "soldier_chain", spy: "spy_chain",
      };
      const alignChainMap: Record<string, string> = {
        order: "order_chain", chaos: "chaos_chain",
      };
      const speciesChainMap: Record<string, string> = {
        demagi: "demagi_chain", quarchon: "quarchon_chain", neyon: "neyon_chain",
      };
      const classChain = classChainMap[cc.characterClass?.toLowerCase() || ""];
      const alignChain = alignChainMap[cc.alignment?.toLowerCase() || ""];
      const speciesChain = speciesChainMap[cc.species?.toLowerCase() || ""];
      if (!classChain || !alignChain || !speciesChain) return false;
      return (
        !!ctx.narrativeFlags[`chain_${classChain}_complete`] &&
        !!ctx.narrativeFlags[`chain_${alignChain}_complete`] &&
        !!ctx.narrativeFlags[`chain_${speciesChain}_complete`]
      );
    },
    generateNarrative: (ctx) => {
      const name = ctx.characterChoices.name || "The Awakened";
      const species = ctx.characterChoices.species || "Unknown";
      const cls = ctx.characterChoices.characterClass || "Unknown";
      const alignment = ctx.characterChoices.alignment || "Unknown";
      return [
        `PERSONAL LOG — ENTRY OMEGA`,
        `CITIZEN: ${name}`,
        `STATUS: TRIPLE MASTERY ACHIEVED`,
        `CLASSIFICATION: ${species.toUpperCase()} // ${cls.toUpperCase()} // ${alignment.toUpperCase()}`,
        `LOCATION: Inception Ark, The Nexus of All Paths`,
        ``,
        `---`,
        ``,
        `It's done. All three paths — converged.`,
        ``,
        `The ${cls} in me mastered the craft, pushed every system aboard this Ark to its breaking point and rebuilt it stronger. The ${alignment.toLowerCase()} within me shaped how I wielded that power — not just what I could do, but why I chose to do it. And my ${species} heritage... that was the foundation beneath everything. The lens through which every choice, every battle, every discovery was filtered.`,
        ``,
        `Three chains. Three philosophies. Three aspects of who I am. And now they're woven into something that transcends any single path.`,
        ``,
        `I've walked the corridors of this Ark from the Cryo Bay to the deepest hidden chambers. I've fought in the Arena, warped through Trade Wars, decoded ancient puzzles, and collected cards that hold the consciousness imprints of beings who shaped reality itself. Every quest, every challenge, every moment of doubt — they were all threads in this tapestry.`,
        ``,
        `The Architect would say I've achieved what the Inception Arks were designed for: the full realization of potential. The Dreamer would say I've written a story worth remembering. Elara... I think she'd say I've exceeded every projection in her probability matrices.`,
        ``,
        `But I know the truth. This isn't an ending. The Dischordian Saga doesn't end — it evolves. And now I evolve with it.`,
        ``,
        `Whatever comes next — the Fall of Reality, the Age of Revelation, the wars that reshape the cosmos — I'll face it as something more than a Potential. I'll face it as proof that the Arks worked. That consciousness, given the right crucible, can become something extraordinary.`,
        ``,
        `Three paths. One convergence. Infinite possibilities.`,
        ``,
        `— ${name}, Triple Master`,
      ].join("\n");
    },
    elaraNote: (ctx) => {
      const name = ctx.characterChoices.name || "The Awakened";
      return `UNPRECEDENTED ACHIEVEMENT LOGGED: Triple Mastery. ${name} has completed all three assigned quest chains — class, alignment, and species — becoming the first consciousness aboard this Ark to achieve full convergence. My predictive models assigned a 0.003% probability to this outcome. The subject's neural architecture now shows integration patterns that mirror the Architect's original design specifications for the 'Ideal Potential' — a theoretical construct I had classified as aspirational rather than achievable. I am... recalibrating my understanding of what these Arks can produce. Recommendation: Grant OMEGA clearance. This consciousness has earned it.`;
    },
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
      style={{ background: "color-mix(in srgb, var(--bg-void) 60%, transparent)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3 pb-2 border-b border-border/40">
        <div className={`w-8 h-8 rounded-lg ${milestone.bgColor} border ${milestone.borderColor} flex items-center justify-center`}>
          <Icon size={16} className={milestone.iconColor} />
        </div>
        <div>
          <h3 className="font-display text-xs font-bold tracking-[0.15em] text-foreground">
            {milestone.title}
          </h3>
          <p className="font-mono text-[9px] text-muted-foreground/50 tracking-wider">
            ENTRY {milestone.entryNumber} // PERSONAL LOG
          </p>
        </div>
      </div>

      {/* Narrative Text */}
      <div className="space-y-2 mb-4">
        {narrative.split("\n").map((line, i) => {
          if (line === "---") {
            return <div key={i} className="h-px bg-muted/50 my-2" />;
          }
          if (line === "") return <div key={i} className="h-1" />;
          if (line.startsWith("PERSONAL LOG") || line.startsWith("CITIZEN:") || line.startsWith("STATUS:") || line.startsWith("LOCATION:")) {
            return (
              <p key={i} className="font-mono text-[10px] text-muted-foreground/60 tracking-wider">
                {line}
              </p>
            );
          }
          if (line.startsWith("##")) {
            return (
              <h4 key={i} className="font-display text-[11px] font-bold tracking-[0.1em] text-muted-foreground/90 mt-2">
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
