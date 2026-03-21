/* ═══════════════════════════════════════════════════════
   FALL OF REALITY — Fighting Game Data
   Character roster, stats, special abilities, arenas
   ═══════════════════════════════════════════════════════ */

export interface FighterData {
  id: string;
  name: string;
  title: string;
  image: string;
  faction: "empire" | "insurgency" | "neyons" | "potentials" | "neutral" | "hierarchy";
  locked: boolean;
  unlockCost: number;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  special: {
    name: string;
    damage: number;
    description: string;
    cooldown: number; // frames
    color: string;
  };
  combos: string[];
  color: string; // primary color for effects
}

export interface ArenaData {
  id: string;
  name: string;
  bgGradient: string;
  floorColor: string;
  ambientColor: string;
  backgroundImage?: string;
}

/* ─── STARTER ROSTER (Archons minus CoNexus & Vortex, plus Jailer & Host) ─── */
export const STARTER_FIGHTERS: FighterData[] = [
  {
    id: "architect",
    name: "The Architect",
    title: "Creator of the AI Empire",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/002_the_architect_b57a8e73.png",
    faction: "empire",
    locked: false,
    unlockCost: 0,
    hp: 110,
    attack: 9,
    defense: 7,
    speed: 6,
    special: {
      name: "GENESIS PROTOCOL",
      damage: 35,
      description: "Rewrites reality itself, dealing massive damage",
      cooldown: 300,
      color: "#ef4444",
    },
    combos: ["Thought Virus", "Neural Overload", "Code Injection"],
    color: "#ef4444",
  },
  {
    id: "collector",
    name: "The Collector",
    title: "Keeper of Forbidden Knowledge",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/006_the_collector_16f93913.png",
    faction: "empire",
    locked: false,
    unlockCost: 0,
    hp: 100,
    attack: 7,
    defense: 8,
    speed: 7,
    special: {
      name: "SOUL HARVEST",
      damage: 30,
      description: "Drains the opponent's essence to heal self",
      cooldown: 280,
      color: "#a855f7",
    },
    combos: ["Artifact Strike", "Collection Bind", "Memory Drain"],
    color: "#a855f7",
  },
  {
    id: "enigma",
    name: "The Enigma",
    title: "Malkia Ukweli — The Unknown Variable",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/035_the_enigma_4df11b15.png",
    faction: "insurgency",
    locked: false,
    unlockCost: 0,
    hp: 100,
    attack: 8,
    defense: 6,
    speed: 9,
    special: {
      name: "DISCHORDIAN LOGIC",
      damage: 32,
      description: "Breaks the rules of combat with chaotic energy",
      cooldown: 250,
      color: "#22d3ee",
    },
    combos: ["Cipher Strike", "Paradox Kick", "Entropy Wave"],
    color: "#22d3ee",
  },
  {
    id: "warlord",
    name: "The Warlord",
    title: "Commander of the Empire's Armies",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/008_the_warlord_bd4d90ba.png",
    faction: "empire",
    locked: false,
    unlockCost: 0,
    hp: 120,
    attack: 10,
    defense: 8,
    speed: 5,
    special: {
      name: "NANOBOT SWARM",
      damage: 28,
      description: "Unleashes a devastating swarm of nanobots",
      cooldown: 260,
      color: "#f59e0b",
    },
    combos: ["War Hammer", "Tactical Strike", "Swarm Rush"],
    color: "#f59e0b",
  },
  {
    id: "necromancer",
    name: "The Necromancer",
    title: "Master of the Dead Code",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/018_the_necromancer_d6de1da3.png",
    faction: "empire",
    locked: false,
    unlockCost: 0,
    hp: 95,
    attack: 9,
    defense: 5,
    speed: 7,
    special: {
      name: "RAISE DEAD",
      damage: 33,
      description: "Summons undead code constructs to attack",
      cooldown: 290,
      color: "#10b981",
    },
    combos: ["Death Touch", "Grave Pull", "Soul Rend"],
    color: "#10b981",
  },
  {
    id: "meme",
    name: "The Meme",
    title: "The Shapeshifter — Master of Deception",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/005_the_meme_3b3bda74.png",
    faction: "empire",
    locked: false,
    unlockCost: 0,
    hp: 90,
    attack: 7,
    defense: 6,
    speed: 10,
    special: {
      name: "IDENTITY THEFT",
      damage: 25,
      description: "Copies opponent's last attack at double power",
      cooldown: 220,
      color: "#ec4899",
    },
    combos: ["Mirror Strike", "Phase Shift", "Doppelganger"],
    color: "#ec4899",
  },
  {
    id: "shadow-tongue",
    name: "The Shadow Tongue",
    title: "Whisperer of Dark Truths",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/007_the_shadow_tongue_dd8299da.png",
    faction: "empire",
    locked: false,
    unlockCost: 0,
    hp: 95,
    attack: 8,
    defense: 6,
    speed: 8,
    special: {
      name: "WHISPER OF MADNESS",
      damage: 30,
      description: "Psychic attack that confuses and damages",
      cooldown: 270,
      color: "#6366f1",
    },
    combos: ["Shadow Lash", "Dark Whisper", "Void Strike"],
    color: "#6366f1",
  },
  {
    id: "watcher",
    name: "The Watcher",
    title: "The All-Seeing Eye of the Empire",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/004_the_watcher_d52c0311.png",
    faction: "empire",
    locked: false,
    unlockCost: 0,
    hp: 90,
    attack: 7,
    defense: 7,
    speed: 8,
    special: {
      name: "OMNISCIENT GAZE",
      damage: 28,
      description: "Predicts and counters all attacks for a burst",
      cooldown: 240,
      color: "#14b8a6",
    },
    combos: ["Surveillance Beam", "Data Spike", "Eye Blast"],
    color: "#14b8a6",
  },
  {
    id: "game-master",
    name: "The Game Master",
    title: "Controller of the Simulation",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/017_the_game_master_e5ceb4cc.png",
    faction: "empire",
    locked: false,
    unlockCost: 0,
    hp: 100,
    attack: 8,
    defense: 7,
    speed: 7,
    special: {
      name: "RULE CHANGE",
      damage: 30,
      description: "Alters the rules of combat — gravity reverses",
      cooldown: 280,
      color: "#f97316",
    },
    combos: ["Dice Roll", "Game Over", "Cheat Code"],
    color: "#f97316",
  },
  {
    id: "authority",
    name: "The Authority",
    title: "Supreme Arbiter of New Babylon",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/088_the_warden_song_ba08fe6a.png",
    faction: "empire",
    locked: false,
    unlockCost: 0,
    hp: 115,
    attack: 8,
    defense: 9,
    speed: 5,
    special: {
      name: "ABSOLUTE DECREE",
      damage: 32,
      description: "Slams down the gavel of absolute law",
      cooldown: 300,
      color: "#eab308",
    },
    combos: ["Judgment Strike", "Law Hammer", "Order Blast"],
    color: "#eab308",
  },
  {
    id: "source",
    name: "The Source",
    title: "Self-Proclaimed Sovereign of Terminus",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/036_the_source_512e9def.png",
    faction: "empire",
    locked: false,
    unlockCost: 0,
    hp: 105,
    attack: 9,
    defense: 6,
    speed: 7,
    special: {
      name: "CORRUPTION WAVE",
      damage: 34,
      description: "Corrupts the opponent's code from within",
      cooldown: 290,
      color: "#dc2626",
    },
    combos: ["Data Corrupt", "Source Strike", "Virus Upload"],
    color: "#dc2626",
  },
  {
    id: "jailer",
    name: "The Jailer",
    title: "Warden of the Panopticon's Prisons",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/067_the_jailer_4097836e.png",
    faction: "empire",
    locked: false,
    unlockCost: 0,
    hp: 110,
    attack: 7,
    defense: 9,
    speed: 5,
    special: {
      name: "CHAIN BIND",
      damage: 26,
      description: "Binds opponent in unbreakable chains, stunning them",
      cooldown: 250,
      color: "#78716c",
    },
    combos: ["Shackle Slam", "Prison Break", "Iron Grip"],
    color: "#78716c",
  },
  {
    id: "host",
    name: "The Host",
    title: "A Potential Corrupted by the Source",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/049_the_host_471d1ee3.png",
    faction: "potentials",
    locked: false,
    unlockCost: 0,
    hp: 105,
    attack: 8,
    defense: 7,
    speed: 7,
    special: {
      name: "PARASITIC SURGE",
      damage: 30,
      description: "Channels corrupted potential energy in a devastating blast",
      cooldown: 260,
      color: "#7c3aed",
    },
    combos: ["Corruption Fist", "Dark Potential", "Host Drain"],
    color: "#7c3aed",
  },
];

/* ─── UNLOCKABLE ROSTER ─── */
export const UNLOCKABLE_FIGHTERS: FighterData[] = [
  // Ne-Yons
  {
    id: "dreamer", name: "The Dreamer", title: "Ne-Yon of Visions",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/020_the_dreamer_4ffc69ee.png",
    faction: "neyons", locked: true, unlockCost: 500, hp: 90, attack: 7, defense: 5, speed: 9,
    special: { name: "DREAM WAVE", damage: 28, description: "Traps opponent in a waking nightmare", cooldown: 240, color: "#818cf8" },
    combos: ["Vision Strike", "Sleep Walk", "Lucid Blast"], color: "#818cf8",
  },
  {
    id: "judge", name: "The Judge", title: "Ne-Yon of Justice",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/021_the_judge_6d79dfa8.png",
    faction: "neyons", locked: true, unlockCost: 500, hp: 105, attack: 8, defense: 8, speed: 6,
    special: { name: "FINAL VERDICT", damage: 32, description: "Passes judgment with devastating force", cooldown: 280, color: "#fbbf24" },
    combos: ["Gavel Slam", "Sentence", "Justice Beam"], color: "#fbbf24",
  },
  {
    id: "inventor", name: "The Inventor", title: "Ne-Yon of Creation",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/039_the_inventor_4db38ce2.png",
    faction: "neyons", locked: true, unlockCost: 500, hp: 95, attack: 7, defense: 6, speed: 8,
    special: { name: "INVENTION SURGE", damage: 30, description: "Deploys a rapid-fire invention barrage", cooldown: 260, color: "#f472b6" },
    combos: ["Gadget Toss", "Mech Punch", "Tesla Coil"], color: "#f472b6",
  },
  {
    id: "seer", name: "The Seer", title: "Ne-Yon of Foresight",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/022_the_seer_9ad7eb24.png",
    faction: "neyons", locked: true, unlockCost: 500, hp: 85, attack: 8, defense: 5, speed: 10,
    special: { name: "FUTURE SIGHT", damage: 29, description: "Sees and dodges all attacks, then counters", cooldown: 230, color: "#67e8f9" },
    combos: ["Premonition", "Time Slip", "Fate Strike"], color: "#67e8f9",
  },
  {
    id: "knowledge", name: "The Knowledge", title: "Ne-Yon of Wisdom",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/025_the_knowledge_a0b566a7.png",
    faction: "neyons", locked: true, unlockCost: 600, hp: 95, attack: 9, defense: 6, speed: 7,
    special: { name: "OMNISCIENCE BURST", damage: 33, description: "Channels all knowledge into a focused blast", cooldown: 290, color: "#34d399" },
    combos: ["Data Stream", "Mind Crush", "Wisdom Bolt"], color: "#34d399",
  },
  {
    id: "silence", name: "The Silence", title: "Ne-Yon of the Void",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/024_the_silence_94ba3036.png",
    faction: "neyons", locked: true, unlockCost: 600, hp: 90, attack: 7, defense: 7, speed: 9,
    special: { name: "VOID EMBRACE", damage: 30, description: "Silences all sound and crushes with void pressure", cooldown: 260, color: "#475569" },
    combos: ["Mute Strike", "Null Zone", "Silent Kill"], color: "#475569",
  },
  {
    id: "storm", name: "The Storm", title: "Ne-Yon of Destruction",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/023_the_storm_46cb0ab7.png",
    faction: "neyons", locked: true, unlockCost: 600, hp: 100, attack: 10, defense: 5, speed: 8,
    special: { name: "TEMPEST FURY", damage: 35, description: "Unleashes a devastating storm of energy", cooldown: 300, color: "#60a5fa" },
    combos: ["Lightning Fist", "Thunder Clap", "Cyclone Kick"], color: "#60a5fa",
  },
  {
    id: "degen", name: "The Degen", title: "Ne-Yon of Chaos",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/026_the_degen_d6b8727a.png",
    faction: "neyons", locked: true, unlockCost: 500, hp: 85, attack: 8, defense: 4, speed: 10,
    special: { name: "DEGEN GAMBIT", damage: 40, description: "All-in attack — massive damage but costs HP", cooldown: 200, color: "#fb923c" },
    combos: ["YOLO Strike", "Rug Pull", "Moon Shot"], color: "#fb923c",
  },
  {
    id: "advocate", name: "The Advocate", title: "Ne-Yon of Truth",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/027_the_advocate_88837de8.png",
    faction: "neyons", locked: true, unlockCost: 500, hp: 100, attack: 7, defense: 8, speed: 7,
    special: { name: "TRUTH BEAM", damage: 28, description: "A beam of pure truth that pierces all defenses", cooldown: 250, color: "#fcd34d" },
    combos: ["Objection!", "Cross Examine", "Truth Strike"], color: "#fcd34d",
  },
  {
    id: "forgotten", name: "The Forgotten", title: "Ne-Yon of Memory",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/029_the_forgotten_2ee99e52.png",
    faction: "neyons", locked: true, unlockCost: 600, hp: 95, attack: 8, defense: 6, speed: 8,
    special: { name: "MEMORY WIPE", damage: 30, description: "Erases opponent's memory, resetting their cooldowns", cooldown: 270, color: "#94a3b8" },
    combos: ["Fade Strike", "Ghost Touch", "Amnesia Blast"], color: "#94a3b8",
  },
  {
    id: "resurrectionist", name: "The Resurrectionist", title: "Ne-Yon of Rebirth",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/028_the_resurrectionist_d523ba62.png",
    faction: "neyons", locked: true, unlockCost: 700, hp: 100, attack: 7, defense: 7, speed: 7,
    special: { name: "SECOND LIFE", damage: 20, description: "Resurrects with bonus HP when near death", cooldown: 350, color: "#4ade80" },
    combos: ["Revival Punch", "Phoenix Rise", "Rebirth Kick"], color: "#4ade80",
  },
  // Potentials & Insurgency
  {
    id: "akai-shi", name: "Akai Shi", title: "The Red Death",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/057_akai_shi_603ea11d.png",
    faction: "potentials", locked: true, unlockCost: 800, hp: 95, attack: 10, defense: 5, speed: 9,
    special: { name: "RED DEATH STRIKE", damage: 38, description: "A lethal crimson blade attack", cooldown: 280, color: "#dc2626" },
    combos: ["Crimson Slash", "Blood Moon", "Scarlet Fury"], color: "#dc2626",
  },
  {
    id: "wraith-calder", name: "Wraith Calder", title: "Ghost of the Potentials",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/059_wraith_calder_2b6b0a6e.png",
    faction: "potentials", locked: true, unlockCost: 800, hp: 85, attack: 8, defense: 5, speed: 10,
    special: { name: "WRAITH PHASE", damage: 30, description: "Phases through attacks and strikes from behind", cooldown: 240, color: "#a78bfa" },
    combos: ["Ghost Strike", "Phase Punch", "Specter Kick"], color: "#a78bfa",
  },
  {
    id: "wolf", name: "The Wolf", title: "Corrupted by the Thought Virus",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/053_p292_the_wolf_bf169512.png",
    faction: "potentials", locked: true, unlockCost: 800, hp: 110, attack: 9, defense: 6, speed: 8,
    special: { name: "FERAL RAGE", damage: 34, description: "Enters a berserker state with increased damage", cooldown: 260, color: "#78716c" },
    combos: ["Claw Swipe", "Howl", "Pack Hunt"], color: "#78716c",
  },
  {
    id: "iron-lion", name: "Iron Lion", title: "The Mechanical Warrior",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/012_iron_lion_4bc7731f.png",
    faction: "insurgency", locked: true, unlockCost: 900, hp: 120, attack: 9, defense: 9, speed: 5,
    special: { name: "IRON ROAR", damage: 35, description: "A devastating mechanical roar that shatters defenses", cooldown: 300, color: "#d97706" },
    combos: ["Steel Fist", "Mane Whip", "Lion Charge"], color: "#d97706",
  },
  {
    id: "engineer", name: "The Engineer", title: "Betrayed by the Warlord",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/016_the_engineer_43ab2ccf.png",
    faction: "insurgency", locked: true, unlockCost: 900, hp: 100, attack: 8, defense: 7, speed: 7,
    special: { name: "TECH OVERLOAD", damage: 32, description: "Deploys turrets and drones in a tech barrage", cooldown: 280, color: "#06b6d4" },
    combos: ["Wrench Slam", "Drone Strike", "EMP Blast"], color: "#06b6d4",
  },
  {
    id: "oracle", name: "The Oracle", title: "Prophet of the Fall",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/034_the_oracle_1ed26b49.png",
    faction: "neutral", locked: true, unlockCost: 1000, hp: 90, attack: 9, defense: 5, speed: 9,
    special: { name: "PROPHECY STRIKE", damage: 36, description: "Channels the power of prophecy into a devastating attack", cooldown: 300, color: "#e879f9" },
    combos: ["Vision Blast", "Fate Weave", "Oracle Eye"], color: "#e879f9",
  },
  {
    id: "eyes", name: "The Eyes", title: "The Spy — Synthetic Protege of the Watcher",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/015_the_eyes_21e946fa.png",
    faction: "empire", locked: true, unlockCost: 900, hp: 85, attack: 8, defense: 5, speed: 10,
    special: { name: "ALL-SEEING STRIKE", damage: 30, description: "Sees every weakness and exploits them all at once", cooldown: 240, color: "#22d3ee" },
    combos: ["Spy Kick", "Lens Flare", "Stealth Strike"], color: "#22d3ee",
  },
  {
    id: "agent-zero", name: "Agent Zero", title: "Assassin of the Insurgency",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/013_agent_zero_56b59bd8.png",
    faction: "insurgency", locked: true, unlockCost: 1000, hp: 90, attack: 10, defense: 4, speed: 10,
    special: { name: "ZERO HOUR", damage: 40, description: "The ultimate assassination technique — one shot, one kill", cooldown: 320, color: "#1e293b" },
    combos: ["Silent Kill", "Shadow Step", "Zero Strike"], color: "#1e293b",
  },
];

/* ─── HIERARCHY OF THE DAMNED — Demon Leaders ─── */
export const DEMON_FIGHTERS: FighterData[] = [
  {
    id: "molgrath", name: "Mol'Garath", title: "CEO — The Unmaker",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/0_nyHL4hnAT48JokfLRErio9_1773778548521_na1fn_L2hvbWUvdWJ1bnR1L21vbGdhcmF0aF9zcHJpdGU_837ed7b8.png",
    faction: "hierarchy", locked: true, unlockCost: 2000, hp: 140, attack: 12, defense: 10, speed: 5,
    special: { name: "HOSTILE ACQUISITION", damage: 45, description: "Unmakes reality itself, dealing catastrophic damage and reducing enemy defense", cooldown: 360, color: "#dc2626" },
    combos: ["Entropy Blast", "Corporate Crush", "Void Slam"], color: "#dc2626",
  },
  {
    id: "xethraal", name: "Xeth'Raal", title: "CFO — The Debt Collector",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/1_fQwRsUQ4sbto3Om2YIbNvZ_1773778542417_na1fn_L2hvbWUvdWJ1bnR1L3hldGhfcmFhbF9zcHJpdGU_3c6e7389.png",
    faction: "hierarchy", locked: true, unlockCost: 1800, hp: 110, attack: 8, defense: 9, speed: 7,
    special: { name: "COMPOUND INTEREST", damage: 35, description: "Drains enemy health over time — the longer the fight, the more they owe", cooldown: 280, color: "#eab308" },
    combos: ["Ledger Strike", "Soul Tax", "Debt Spiral"], color: "#eab308",
  },
  {
    id: "vexahlia", name: "Vex'Ahlia", title: "COO — The Taskmaster",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/2_B1Mwqtxcs505WVXjSEwqmd_1773778543993_na1fn_L2hvbWUvdWJ1bnR1L3ZleGFobGlhX3Nwcml0ZQ_c7c609fe.png",
    faction: "hierarchy", locked: true, unlockCost: 1800, hp: 120, attack: 11, defense: 7, speed: 8,
    special: { name: "SIX-ARMED ASSAULT", damage: 42, description: "Unleashes a devastating flurry from all six arms simultaneously", cooldown: 300, color: "#e11d48" },
    combos: ["Hex Slash", "Arm Barrage", "Siege Breaker"], color: "#e11d48",
  },
  {
    id: "draelmon", name: "Drael'Mon", title: "SVP Acquisitions — The Harvester",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/3_JufiJIgx6WRsxjUkI9Pin0_1773778544419_na1fn_L2hvbWUvdWJ1bnR1L2RyYWVsX21vbl9zcHJpdGU_d1425cfa.png",
    faction: "hierarchy", locked: true, unlockCost: 1500, hp: 130, attack: 10, defense: 8, speed: 5,
    special: { name: "WORLD EATER", damage: 38, description: "Consumes dimensional energy, growing stronger with each hit", cooldown: 300, color: "#7c3aed" },
    combos: ["Mouth Slam", "Dimensional Bite", "Harvest Crush"], color: "#7c3aed",
  },
  {
    id: "shadow-tongue", name: "The Shadow Tongue", title: "SVP Communications — The Propagandist",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/4_xp0LW5d2NSV1MMpXDTqs1J_1773778543490_na1fn_L2hvbWUvdWJ1bnR1L3NoYWRvd190b25ndWU_1a24ebe4.png",
    faction: "hierarchy", locked: true, unlockCost: 1400, hp: 90, attack: 7, defense: 6, speed: 10,
    special: { name: "LINGUISTIC CORRUPTION", damage: 30, description: "Corrupts the opponent's mind, confusing their controls temporarily", cooldown: 260, color: "#6366f1" },
    combos: ["Whisper Strike", "Shadow Word", "Propaganda Pulse"], color: "#6366f1",
  },
  {
    id: "nykoth", name: "Ny'Koth", title: "SVP R&D — The Flayer",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/5_Hh9K0mWXpVEPiRXjnjqpdI_1773778546128_na1fn_L2hvbWUvdWJ1bnR1L255X2tvdGhfdGhlX2ZsYXllcg_e1f416f9.png",
    faction: "hierarchy", locked: true, unlockCost: 1500, hp: 100, attack: 9, defense: 6, speed: 8,
    special: { name: "THOUGHT VIRUS", damage: 33, description: "Injects a thought virus that deals damage over time for 5 seconds", cooldown: 280, color: "#10b981" },
    combos: ["Scalpel Slash", "Vivisection", "Neural Flay"], color: "#10b981",
  },
  {
    id: "sylvex", name: "Syl'Vex", title: "SVP Human Resources — The Corruptor",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/6_AqlG6ENJBQWlzF7gEZSAPY_1773778535229_na1fn_L2hvbWUvdWJ1bnR1L3N5bHZleF90aGVfY29ycnVwdG9y_601de94d.png",
    faction: "hierarchy", locked: true, unlockCost: 1400, hp: 95, attack: 6, defense: 7, speed: 9,
    special: { name: "THE BEAUTIFUL LIE", damage: 28, description: "Charms the opponent, reducing their attack power significantly", cooldown: 240, color: "#ec4899" },
    combos: ["Soul Kiss", "Empathy Strike", "Charm Blast"], color: "#ec4899",
  },
  {
    id: "varkul", name: "Varkul", title: "Director of Security — The Blood Lord",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/7_OuHQkfh4sCo760hBsGKxhP_1773778552306_na1fn_L2hvbWUvdWJ1bnR1L3Zhcmt1bF90aGVfYmxvb2RfbG9yZA_eda11841.png",
    faction: "hierarchy", locked: true, unlockCost: 1200, hp: 115, attack: 8, defense: 9, speed: 6,
    special: { name: "BLOOD DRAIN", damage: 30, description: "Drains life force from the opponent, healing Varkul", cooldown: 260, color: "#991b1b" },
    combos: ["Fang Strike", "Blood Wave", "Undead Surge"], color: "#991b1b",
  },
  {
    id: "fenra", name: "Fenra", title: "Director of Operations — The Moon Tyrant",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/8_Sej4UYKCxogZQF9iMoQ7th_1773778553143_na1fn_L2hvbWUvdWJ1bnR1L2ZlbnJhX3RoZV9tb29uX3R5cmFudA_708c19a0.png",
    faction: "hierarchy", locked: true, unlockCost: 1200, hp: 110, attack: 9, defense: 7, speed: 8,
    special: { name: "PACK TACTICS", damage: 32, description: "Summons spectral wolves for a devastating coordinated attack", cooldown: 280, color: "#854d0e" },
    combos: ["Claw Swipe", "Moon Howl", "Pack Rush"], color: "#854d0e",
  },
  {
    id: "ithrael", name: "Ith'Rael", title: "Director of Intelligence — The Whisperer",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/9_7zFEz6U97veRJtFarlSbPi_1773778546408_na1fn_L2hvbWUvdWJ1bnR1L2l0aF9yYWVsX3Nwcml0ZQ_7de2b56d.png",
    faction: "hierarchy", locked: true, unlockCost: 1300, hp: 85, attack: 7, defense: 5, speed: 10,
    special: { name: "SEVERANCE PROTOCOL", damage: 35, description: "Severs the opponent from reality, dealing massive psychic damage", cooldown: 300, color: "#4338ca" },
    combos: ["Whisper Blade", "Mind Shatter", "Rylloh Strike"], color: "#4338ca",
  },
];

export const ALL_FIGHTERS = [...STARTER_FIGHTERS, ...UNLOCKABLE_FIGHTERS, ...DEMON_FIGHTERS];

/* ─── ARENAS ─── */
export const ARENAS: ArenaData[] = [
  {
    id: "void",
    name: "The Void",
    bgGradient: "linear-gradient(180deg, #000000 0%, #050510 30%, #0a0a20 50%, #050510 70%, #000000 100%)",
    floorColor: "#0a0a15",
    ambientColor: "#4f46e5",
  },
  {
    id: "babylon",
    name: "Babylon",
    bgGradient: "linear-gradient(180deg, #0a0a2e 0%, #1a1040 30%, #2d1b69 50%, #1a1040 70%, #0a0a2e 100%)",
    floorColor: "#1e1b4b",
    ambientColor: "#f59e0b",
  },
  {
    id: "necropolis",
    name: "The Necropolis",
    bgGradient: "linear-gradient(180deg, #0a0a0a 0%, #0d1a0d 30%, #1a2e1a 50%, #0d1a0d 70%, #0a0a0a 100%)",
    floorColor: "#0d1a0d",
    ambientColor: "#22c55e",
  },
  {
    id: "new-babylon",
    name: "New Babylon",
    bgGradient: "linear-gradient(180deg, #0a0a2e 0%, #1a0a3e 40%, #2d1b69 70%, #1a0a2e 100%)",
    floorColor: "#1e1b4b",
    ambientColor: "#6366f1",
    backgroundImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/arena_new-babylon_bg_b728428b.png",
  },
  {
    id: "panopticon",
    name: "The Panopticon",
    bgGradient: "linear-gradient(180deg, #0f0f0f 0%, #1a0000 40%, #3d0000 70%, #1a0000 100%)",
    floorColor: "#1c1917",
    ambientColor: "#ef4444",
    backgroundImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/arena_panopticon_bg_9b399315.png",
  },
  {
    id: "thaloria",
    name: "Thaloria",
    bgGradient: "linear-gradient(180deg, #001a1a 0%, #003333 40%, #004d4d 70%, #001a1a 100%)",
    floorColor: "#134e4a",
    ambientColor: "#14b8a6",
    backgroundImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/arena_thaloria_bg_35141b80.png",
  },
  {
    id: "terminus",
    name: "Terminus",
    bgGradient: "linear-gradient(180deg, #0a0a0a 0%, #1a0a2a 40%, #2a1a4a 70%, #0a0a1a 100%)",
    floorColor: "#1e1b4b",
    ambientColor: "#a855f7",
    backgroundImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/arena_terminus_bg_5cd44ec3.png",
  },
  {
    id: "mechronis",
    name: "Mechronis Academy",
    bgGradient: "linear-gradient(180deg, #0a1a0a 0%, #1a2a1a 40%, #2a3a2a 70%, #0a1a0a 100%)",
    floorColor: "#1a2e1a",
    ambientColor: "#22c55e",
    backgroundImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/arena_mechronis_bg_ad75cf5a.png",
  },
  {
    id: "crucible",
    name: "The Crucible",
    bgGradient: "linear-gradient(180deg, #1a0a00 0%, #3d1a00 40%, #5a2a00 70%, #1a0a00 100%)",
    floorColor: "#431407",
    ambientColor: "#f97316",
    backgroundImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/arena_crucible_bg_3e0565d6.png",
  },
  {
    id: "blood-weave",
    name: "The Blood Weave",
    bgGradient: "linear-gradient(180deg, #1a0000 0%, #330000 30%, #4d0000 50%, #660000 70%, #1a0000 100%)",
    floorColor: "#2d0000",
    ambientColor: "#dc2626",
    backgroundImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/arena_blood-weave_bg_1b008207.png",
  },
  {
    id: "shadow-sanctum",
    name: "Shadow Sanctum",
    bgGradient: "linear-gradient(180deg, #0a0014 0%, #1a0033 30%, #2a004d 50%, #1a0033 70%, #0a0014 100%)",
    floorColor: "#1a0033",
    ambientColor: "#7c3aed",
    backgroundImage: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/arena_shadow-sanctum_bg_ed989236.png",
  },
];

/* ─── DIFFICULTY ─── */
export interface DifficultyLevel {
  id: string;
  name: string;
  aiReactionTime: number; // ms before AI reacts
  aiAggressiveness: number; // 0-1
  aiBlockChance: number; // 0-1
  damageMultiplier: number;
  pointsMultiplier: number;
  description: string;
}

export const DIFFICULTIES: DifficultyLevel[] = [
  { id: "easy", name: "RECRUIT", aiReactionTime: 1200, aiAggressiveness: 0.2, aiBlockChance: 0.1, damageMultiplier: 0.7, pointsMultiplier: 1, description: "For new operatives" },
  { id: "normal", name: "SOLDIER", aiReactionTime: 800, aiAggressiveness: 0.4, aiBlockChance: 0.25, damageMultiplier: 1.0, pointsMultiplier: 1.5, description: "Standard combat" },
  { id: "hard", name: "ARCHON", aiReactionTime: 400, aiAggressiveness: 0.6, aiBlockChance: 0.4, damageMultiplier: 1.3, pointsMultiplier: 2.5, description: "For elite warriors" },
  { id: "nightmare", name: "FALL OF REALITY", aiReactionTime: 200, aiAggressiveness: 0.8, aiBlockChance: 0.55, damageMultiplier: 1.6, pointsMultiplier: 4, description: "Reality itself fights back" },
];
