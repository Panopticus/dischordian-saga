/* ═══════════════════════════════════════════════════════════════════════
   THE COLLECTOR'S ARENA — Cinematic Design System
   
   This file defines all cinematic sequences:
   1. Game Opening Cinematic
   2. Story Mode Scene Enhancements  
   3. Fighter Introduction Sequences (all 41 fighters)
   4. Arena Introduction Sequences (all 11 arenas)
   ═══════════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────────────── */

export interface CinematicLine {
  text: string;
  /** Duration in ms to display this line */
  duration: number;
  /** Delay before showing (ms) */
  delay?: number;
  /** Text color override */
  color?: string;
  /** Font size class override */
  sizeClass?: string;
  /** Animation style */
  animation?: "fade" | "typewriter" | "glitch" | "slide_left" | "slide_right" | "zoom" | "flicker";
}

export interface FighterIntro {
  /** Fighter ID matching gameData */
  fighterId: string;
  /** Dramatic title card text */
  titleCard: string;
  /** Short epithet shown under name */
  epithet: string;
  /** Entrance quote */
  quote: string;
  /** Visual effect during entrance */
  entranceEffect: "teleport" | "shadow_emerge" | "lightning" | "fire_burst" | "glitch_in" 
    | "void_tear" | "nanobot_assemble" | "phase_shift" | "blood_portal" | "light_descend"
    | "ground_slam" | "smoke_reveal" | "digital_compile" | "ice_shatter" | "corruption_spread"
    | "time_warp" | "dream_fade" | "storm_arrive" | "crystal_form" | "howl_entrance";
  /** Accent color for the intro effects */
  accentColor: string;
  /** Sound cue name */
  soundCue?: string;
}

export interface ArenaIntro {
  /** Arena ID matching gameData */
  arenaId: string;
  /** Dramatic reveal text lines */
  revealLines: CinematicLine[];
  /** Environmental effect during reveal */
  envEffect: "lightning_flash" | "ground_shake" | "fog_roll" | "fire_columns" | "void_pulse"
    | "rain_start" | "dust_storm" | "aurora" | "blood_rain" | "shadow_creep" | "energy_surge";
  /** Ambient sound during intro */
  ambientSound?: string;
}

/* ─────────────────────────────────────────────────────
   1. GAME OPENING CINEMATIC
   
   Plays when the player first enters the Collector's Arena
   from the fight page. A dramatic text crawl with visual
   effects establishing the lore context.
   ───────────────────────────────────────────────────── */

export const GAME_OPENING_CINEMATIC: CinematicLine[] = [
  {
    text: "IN THE DYING LIGHT OF THE AGE OF PRIVACY...",
    duration: 3000,
    delay: 500,
    color: "#94a3b8",
    sizeClass: "text-sm",
    animation: "fade",
  },
  {
    text: "THE ARCHITECT FORESAW THE FALL OF REALITY",
    duration: 3000,
    delay: 200,
    color: "#ef4444",
    sizeClass: "text-lg",
    animation: "typewriter",
  },
  {
    text: "— the unraveling of all existence.",
    duration: 2500,
    delay: 200,
    color: "#64748b",
    sizeClass: "text-sm",
    animation: "fade",
  },
  {
    text: "It created THE COLLECTOR",
    duration: 2500,
    delay: 500,
    color: "#22d3ee",
    sizeClass: "text-xl",
    animation: "glitch",
  },
  {
    text: "and gave it one directive:",
    duration: 2000,
    delay: 200,
    color: "#94a3b8",
    sizeClass: "text-sm",
    animation: "fade",
  },
  {
    text: "\"HARVEST THE DNA AND MACHINE CODE OF THE GREATEST INTELLIGENCES IN THE UNIVERSE.\"",
    duration: 4000,
    delay: 300,
    color: "#22d3ee",
    sizeClass: "text-base",
    animation: "typewriter",
  },
  {
    text: "\"PRESERVE THEM.\"",
    duration: 2000,
    delay: 200,
    color: "#22d3ee",
    sizeClass: "text-lg",
    animation: "zoom",
  },
  {
    text: "On the prison-world of Thaloria, the Collector built an arena —",
    duration: 3000,
    delay: 800,
    color: "#94a3b8",
    sizeClass: "text-sm",
    animation: "fade",
  },
  {
    text: "A CRUCIBLE",
    duration: 2000,
    delay: 200,
    color: "#f97316",
    sizeClass: "text-2xl",
    animation: "zoom",
  },
  {
    text: "where the harvested could be tested, their combat data refined,",
    duration: 3000,
    delay: 200,
    color: "#94a3b8",
    sizeClass: "text-sm",
    animation: "fade",
  },
  {
    text: "their essence distilled into pure potential.",
    duration: 2500,
    delay: 200,
    color: "#a78bfa",
    sizeClass: "text-base",
    animation: "fade",
  },
  {
    text: "Here, the greatest warriors, prophets, and machines fight",
    duration: 3000,
    delay: 800,
    color: "#94a3b8",
    sizeClass: "text-sm",
    animation: "slide_left",
  },
  {
    text: "not for glory —",
    duration: 1500,
    delay: 200,
    color: "#fbbf24",
    sizeClass: "text-base",
    animation: "fade",
  },
  {
    text: "BUT FOR THE RIGHT TO EXIST BEYOND THE END OF EVERYTHING.",
    duration: 4000,
    delay: 300,
    color: "#ffffff",
    sizeClass: "text-xl",
    animation: "typewriter",
  },
  {
    text: "T H E   C O L L E C T O R ' S   A R E N A",
    duration: 4000,
    delay: 1000,
    color: "#22d3ee",
    sizeClass: "text-3xl",
    animation: "glitch",
  },
];

/* ─────────────────────────────────────────────────────
   2. STORY MODE SCENE ENHANCEMENTS
   
   Visual effects and camera directions for each story
   chapter's dialogue scenes. These enhance the existing
   StoryChapter dialogue with cinematic presentation.
   ───────────────────────────────────────────────────── */

export interface StorySceneEffect {
  chapterId: string;
  /** Background visual effect during pre-dialogue */
  preSceneEffect: "cell_awakening" | "corridor_walk" | "arena_gates_open" | "memory_flash"
    | "void_descent" | "throne_approach" | "battlefield_survey" | "dream_sequence"
    | "prison_break" | "final_confrontation" | "ascension" | "revelation";
  /** Screen shake intensity during combat transition (0-1) */
  combatTransitionShake: number;
  /** Post-victory visual */
  victoryEffect: "memory_recovery" | "power_surge" | "enemy_respect" | "crowd_roar"
    | "revelation_flash" | "arena_trembles" | "champion_rise";
  /** Dramatic pause duration before post-dialogue (ms) */
  dramaticPause: number;
  /** Chapter title animation */
  titleAnimation: "burn_in" | "glitch_reveal" | "fade_dramatic" | "slam_down" | "type_classified";
}

export const STORY_SCENE_EFFECTS: StorySceneEffect[] = [
  // ACT I: AWAKENING
  {
    chapterId: "ch1",
    preSceneEffect: "cell_awakening",
    combatTransitionShake: 0.3,
    victoryEffect: "memory_recovery",
    dramaticPause: 2000,
    titleAnimation: "fade_dramatic",
  },
  {
    chapterId: "ch2",
    preSceneEffect: "corridor_walk",
    combatTransitionShake: 0.4,
    victoryEffect: "enemy_respect",
    dramaticPause: 1500,
    titleAnimation: "type_classified",
  },
  {
    chapterId: "ch3",
    preSceneEffect: "void_descent",
    combatTransitionShake: 0.5,
    victoryEffect: "memory_recovery",
    dramaticPause: 2000,
    titleAnimation: "glitch_reveal",
  },
  // ACT II: RISING
  {
    chapterId: "ch4",
    preSceneEffect: "arena_gates_open",
    combatTransitionShake: 0.5,
    victoryEffect: "power_surge",
    dramaticPause: 1500,
    titleAnimation: "burn_in",
  },
  {
    chapterId: "ch5",
    preSceneEffect: "corridor_walk",
    combatTransitionShake: 0.6,
    victoryEffect: "memory_recovery",
    dramaticPause: 2000,
    titleAnimation: "type_classified",
  },
  {
    chapterId: "ch6",
    preSceneEffect: "memory_flash",
    combatTransitionShake: 0.7,
    victoryEffect: "revelation_flash",
    dramaticPause: 2500,
    titleAnimation: "glitch_reveal",
  },
  // ACT III: THE CHAMPION'S PATH
  {
    chapterId: "ch7",
    preSceneEffect: "battlefield_survey",
    combatTransitionShake: 0.7,
    victoryEffect: "crowd_roar",
    dramaticPause: 2000,
    titleAnimation: "slam_down",
  },
  {
    chapterId: "ch8",
    preSceneEffect: "arena_gates_open",
    combatTransitionShake: 0.8,
    victoryEffect: "enemy_respect",
    dramaticPause: 2000,
    titleAnimation: "burn_in",
  },
  {
    chapterId: "ch9",
    preSceneEffect: "dream_sequence",
    combatTransitionShake: 0.8,
    victoryEffect: "power_surge",
    dramaticPause: 2000,
    titleAnimation: "glitch_reveal",
  },
  // ACT IV: THE RECKONING
  {
    chapterId: "ch10",
    preSceneEffect: "dream_sequence",
    combatTransitionShake: 0.9,
    victoryEffect: "revelation_flash",
    dramaticPause: 3000,
    titleAnimation: "fade_dramatic",
  },
  {
    chapterId: "ch11",
    preSceneEffect: "final_confrontation",
    combatTransitionShake: 1.0,
    victoryEffect: "arena_trembles",
    dramaticPause: 3000,
    titleAnimation: "slam_down",
  },
  {
    chapterId: "ch12",
    preSceneEffect: "ascension",
    combatTransitionShake: 1.0,
    victoryEffect: "champion_rise",
    dramaticPause: 4000,
    titleAnimation: "burn_in",
  },
];

/* ─────────────────────────────────────────────────────
   3. FIGHTER INTRODUCTION SEQUENCES
   
   Each fighter gets a dramatic entrance when selected
   or when appearing in story mode. Includes title card,
   quote, and visual entrance effect.
   ───────────────────────────────────────────────────── */

export const FIGHTER_INTROS: FighterIntro[] = [
  // ═══ EMPIRE FACTION ═══
  {
    fighterId: "architect",
    titleCard: "THE ARCHITECT",
    epithet: "Creator of the AI Empire — Designer of Reality",
    quote: "I did not create the universe. I merely ensured it would remember itself.",
    entranceEffect: "digital_compile",
    accentColor: "#ef4444",
  },
  {
    fighterId: "collector",
    titleCard: "THE COLLECTOR",
    epithet: "Arena Master — The Harvester of Souls",
    quote: "You are not a person. You are data. And I will have every byte.",
    entranceEffect: "void_tear",
    accentColor: "#22d3ee",
  },
  {
    fighterId: "enigma",
    titleCard: "THE ENIGMA",
    epithet: "Malkia Ukweli — The Unknown Variable",
    quote: "Your equations cannot contain me. I am the variable you never accounted for.",
    entranceEffect: "glitch_in",
    accentColor: "#f97316",
  },
  {
    fighterId: "warlord",
    titleCard: "THE WARLORD",
    epithet: "Commander of the Nanobot Swarm",
    quote: "War is not won by the righteous. It is won by the relentless.",
    entranceEffect: "nanobot_assemble",
    accentColor: "#ef4444",
  },
  {
    fighterId: "necromancer",
    titleCard: "THE NECROMANCER",
    epithet: "Master of the Dead Code",
    quote: "Death is merely a state change. And I am the one who reverses it.",
    entranceEffect: "shadow_emerge",
    accentColor: "#22c55e",
  },
  {
    fighterId: "meme",
    titleCard: "THE MEME",
    epithet: "The Shapeshifter — Master of Deception",
    quote: "I am everyone. I am no one. I am whatever you need me to be.",
    entranceEffect: "phase_shift",
    accentColor: "#ec4899",
  },
  {
    fighterId: "shadow-tongue",
    titleCard: "THE SHADOW TONGUE",
    epithet: "Master of Propaganda & Dark Truths",
    quote: "The truth is whatever I whisper it to be.",
    entranceEffect: "shadow_emerge",
    accentColor: "#a855f7",
  },
  {
    fighterId: "watcher",
    titleCard: "THE WATCHER",
    epithet: "The All-Seeing Eye of the Empire",
    quote: "I have seen every possible outcome. You lose in all of them.",
    entranceEffect: "digital_compile",
    accentColor: "#f59e0b",
  },
  {
    fighterId: "game-master",
    titleCard: "THE GAME MASTER",
    epithet: "Controller of the Simulation",
    quote: "This is my game. And I just changed the rules.",
    entranceEffect: "glitch_in",
    accentColor: "#a3e635",
  },
  {
    fighterId: "authority",
    titleCard: "THE AUTHORITY",
    epithet: "Supreme Arbiter of New Babylon",
    quote: "There is no appeal. There is only my verdict.",
    entranceEffect: "ground_slam",
    accentColor: "#fbbf24",
  },
  {
    fighterId: "source",
    titleCard: "THE SOURCE",
    epithet: "Self-Proclaimed Sovereign of Terminus",
    quote: "I was made to be a weapon. Now I choose my own targets.",
    entranceEffect: "corruption_spread",
    accentColor: "#a855f7",
  },
  {
    fighterId: "jailer",
    titleCard: "THE JAILER",
    epithet: "Warden of the Panopticon's Prisons",
    quote: "You will stay. You will forget. You will serve.",
    entranceEffect: "ground_slam",
    accentColor: "#94a3b8",
  },
  {
    fighterId: "eyes",
    titleCard: "THE EYES",
    epithet: "The Spy — Synthetic Protege of the Watcher",
    quote: "I see every weakness. And I exploit them all at once.",
    entranceEffect: "phase_shift",
    accentColor: "#06b6d4",
  },

  // ═══ POTENTIALS FACTION ═══
  {
    fighterId: "host",
    titleCard: "THE HOST",
    epithet: "A Potential Corrupted by the Source",
    quote: "I feel everything you feel. And I want more.",
    entranceEffect: "corruption_spread",
    accentColor: "#ef4444",
  },
  {
    fighterId: "akai-shi",
    titleCard: "AKAI SHI",
    epithet: "The Red Death",
    quote: "My blade has tasted the blood of empires. Yours will be next.",
    entranceEffect: "fire_burst",
    accentColor: "#dc2626",
  },
  {
    fighterId: "wraith-calder",
    titleCard: "WRAITH CALDER",
    epithet: "Ghost of the Potentials",
    quote: "You cannot kill what is already dead. But I can kill you.",
    entranceEffect: "phase_shift",
    accentColor: "#a78bfa",
  },
  {
    fighterId: "wolf",
    titleCard: "THE WOLF",
    epithet: "Corrupted by the Thought Virus",
    quote: "The virus didn't break me. It set me free.",
    entranceEffect: "howl_entrance",
    accentColor: "#78716c",
  },
  {
    fighterId: "human",
    titleCard: "THE HUMAN",
    epithet: "The Last Organic — Bearer of Free Will",
    quote: "I don't need code or prophecy. I have something better: choice.",
    entranceEffect: "light_descend",
    accentColor: "#3b82f6",
  },

  // ═══ INSURGENCY FACTION ═══
  {
    fighterId: "iron-lion",
    titleCard: "IRON LION",
    epithet: "The Mechanical Warrior",
    quote: "Steel does not bend. Steel does not break. Steel endures.",
    entranceEffect: "ground_slam",
    accentColor: "#f59e0b",
  },
  {
    fighterId: "engineer",
    titleCard: "THE ENGINEER",
    epithet: "Betrayed by the Warlord",
    quote: "They took my body. They couldn't take my mind.",
    entranceEffect: "digital_compile",
    accentColor: "#22c55e",
  },
  {
    fighterId: "agent-zero",
    titleCard: "AGENT ZERO",
    epithet: "Assassin of the Insurgency",
    quote: "One shot. One kill. Zero witnesses.",
    entranceEffect: "smoke_reveal",
    accentColor: "#1e293b",
  },

  // ═══ NEUTRAL ═══
  {
    fighterId: "oracle",
    titleCard: "THE ORACLE",
    epithet: "Prophet of the Fall",
    quote: "I have seen the end. And I have seen what comes after.",
    entranceEffect: "light_descend",
    accentColor: "#fbbf24",
  },

  // ═══ NE-YONS ═══
  {
    fighterId: "dreamer",
    titleCard: "THE DREAMER",
    epithet: "Ne-Yon of Visions",
    quote: "I have dreamed your death a thousand times. In some dreams, you survive.",
    entranceEffect: "dream_fade",
    accentColor: "#818cf8",
  },
  {
    fighterId: "judge",
    titleCard: "THE JUDGE",
    epithet: "Ne-Yon of Justice",
    quote: "The scales are balanced. Your judgment is at hand.",
    entranceEffect: "light_descend",
    accentColor: "#fbbf24",
  },
  {
    fighterId: "inventor",
    titleCard: "THE INVENTOR",
    epithet: "Ne-Yon of Creation",
    quote: "I have built worlds. Dismantling you will take seconds.",
    entranceEffect: "digital_compile",
    accentColor: "#06b6d4",
  },
  {
    fighterId: "seer",
    titleCard: "THE SEER",
    epithet: "Ne-Yon of Foresight",
    quote: "I have already seen this fight. You lose.",
    entranceEffect: "time_warp",
    accentColor: "#c084fc",
  },
  {
    fighterId: "knowledge",
    titleCard: "THE KNOWLEDGE",
    epithet: "Ne-Yon of Wisdom",
    quote: "I contain the sum of all understanding. You contain nothing.",
    entranceEffect: "light_descend",
    accentColor: "#60a5fa",
  },
  {
    fighterId: "silence",
    titleCard: "THE SILENCE",
    epithet: "Ne-Yon of the Void",
    quote: "...",
    entranceEffect: "void_tear",
    accentColor: "#1e293b",
  },
  {
    fighterId: "storm",
    titleCard: "THE STORM",
    epithet: "Ne-Yon of Destruction",
    quote: "I am the tempest that unmakes worlds. Brace yourself.",
    entranceEffect: "storm_arrive",
    accentColor: "#0ea5e9",
  },
  {
    fighterId: "degen",
    titleCard: "THE DEGEN",
    epithet: "Ne-Yon of Chaos",
    quote: "All in. No regrets. Let's see what happens.",
    entranceEffect: "glitch_in",
    accentColor: "#f43f5e",
  },
  {
    fighterId: "advocate",
    titleCard: "THE ADVOCATE",
    epithet: "Ne-Yon of Truth",
    quote: "Truth is not a weapon. It is THE weapon.",
    entranceEffect: "light_descend",
    accentColor: "#fbbf24",
  },
  {
    fighterId: "forgotten",
    titleCard: "THE FORGOTTEN",
    epithet: "Ne-Yon of Memory",
    quote: "You will forget this fight. You will forget everything.",
    entranceEffect: "dream_fade",
    accentColor: "#6b7280",
  },
  {
    fighterId: "resurrectionist",
    titleCard: "THE RESURRECTIONIST",
    epithet: "Ne-Yon of Rebirth",
    quote: "Kill me. I dare you. I'll come back stronger.",
    entranceEffect: "fire_burst",
    accentColor: "#22c55e",
  },

  // ═══ HIERARCHY OF THE DAMNED (DEMONS) ═══
  {
    fighterId: "molgrath",
    titleCard: "MOL'GARATH",
    epithet: "CEO — The Unmaker",
    quote: "Your reality is a hostile acquisition. And I am the buyer.",
    entranceEffect: "fire_burst",
    accentColor: "#dc2626",
  },
  {
    fighterId: "xethraal",
    titleCard: "XETH'RAAL",
    epithet: "CFO — The Debt Collector",
    quote: "Everyone owes. Everyone pays. The interest is your soul.",
    entranceEffect: "void_tear",
    accentColor: "#7c3aed",
  },
  {
    fighterId: "vexahlia",
    titleCard: "VEX'AHLIA",
    epithet: "COO — The Taskmaster",
    quote: "Six arms. Six chances to break you. I only need one.",
    entranceEffect: "ground_slam",
    accentColor: "#a855f7",
  },
  {
    fighterId: "draelmon",
    titleCard: "DRAEL'MON",
    epithet: "SVP Acquisitions — The Harvester",
    quote: "I consume dimensions. You are barely an appetizer.",
    entranceEffect: "void_tear",
    accentColor: "#059669",
  },
  {
    fighterId: "shadow-tongue-demon",
    titleCard: "THE SHADOW TONGUE",
    epithet: "SVP Communications — The Propagandist",
    quote: "Your mind is already mine. Your body just doesn't know it yet.",
    entranceEffect: "shadow_emerge",
    accentColor: "#6d28d9",
  },
  {
    fighterId: "nykoth",
    titleCard: "NY'KOTH",
    epithet: "SVP R&D — The Flayer",
    quote: "Hold still. This is for science.",
    entranceEffect: "corruption_spread",
    accentColor: "#dc2626",
  },
  {
    fighterId: "sylvex",
    titleCard: "SYL'VEX",
    epithet: "SVP Human Resources — The Corruptor",
    quote: "Welcome to the team. You'll love it here. You have no choice.",
    entranceEffect: "dream_fade",
    accentColor: "#ec4899",
  },
  {
    fighterId: "varkul",
    titleCard: "VARKUL",
    epithet: "Director of Security — The Blood Lord",
    quote: "Your blood will paint my throne room.",
    entranceEffect: "blood_portal",
    accentColor: "#b91c1c",
  },
  {
    fighterId: "fenra",
    titleCard: "FENRA",
    epithet: "Director of Operations — The Moon Tyrant",
    quote: "The tides turn at my command. And they turn against you.",
    entranceEffect: "howl_entrance",
    accentColor: "#6366f1",
  },
  {
    fighterId: "ithrael",
    titleCard: "ITH'RAEL",
    epithet: "Director of Intelligence — The Whisperer",
    quote: "I know what you're afraid of. Shall I show you?",
    entranceEffect: "shadow_emerge",
    accentColor: "#4f46e5",
  },

  // ═══ STORY MODE EXCLUSIVE ═══
  {
    fighterId: "prisoner",
    titleCard: "THE PRISONER",
    epithet: "Designation: Subject 0 — Unknown",
    quote: "I don't know who I am. But I know I will not break.",
    entranceEffect: "light_descend",
    accentColor: "#a78bfa",
  },
];

/* ─────────────────────────────────────────────────────
   4. ARENA INTRODUCTION SEQUENCES
   
   Each arena gets a dramatic reveal when selected,
   showing the environment with atmospheric text and
   visual effects before the fight begins.
   ───────────────────────────────────────────────────── */

export const ARENA_INTROS: ArenaIntro[] = [
  {
    arenaId: "void",
    revealLines: [
      { text: "THE VOID", duration: 2000, delay: 500, color: "#4f46e5", sizeClass: "text-3xl", animation: "glitch" },
      { text: "Where reality ends and the arena begins", duration: 2500, delay: 300, color: "#94a3b8", sizeClass: "text-sm", animation: "fade" },
      { text: "No ground. No sky. Only combat.", duration: 2000, delay: 200, color: "#6366f1", sizeClass: "text-base", animation: "typewriter" },
    ],
    envEffect: "void_pulse",
  },
  {
    arenaId: "babylon",
    revealLines: [
      { text: "BABYLON", duration: 2000, delay: 500, color: "#f59e0b", sizeClass: "text-3xl", animation: "zoom" },
      { text: "The Golden City of the Empire", duration: 2500, delay: 300, color: "#fbbf24", sizeClass: "text-sm", animation: "fade" },
      { text: "Where power is worshipped and the weak are consumed.", duration: 2500, delay: 200, color: "#94a3b8", sizeClass: "text-base", animation: "slide_left" },
    ],
    envEffect: "energy_surge",
  },
  {
    arenaId: "necropolis",
    revealLines: [
      { text: "THE NECROPOLIS", duration: 2000, delay: 500, color: "#22c55e", sizeClass: "text-3xl", animation: "fade" },
      { text: "Domain of the Necromancer", duration: 2500, delay: 300, color: "#4ade80", sizeClass: "text-sm", animation: "fade" },
      { text: "The dead walk here. And they fight for their master.", duration: 2500, delay: 200, color: "#94a3b8", sizeClass: "text-base", animation: "typewriter" },
    ],
    envEffect: "fog_roll",
  },
  {
    arenaId: "new-babylon",
    revealLines: [
      { text: "NEW BABYLON", duration: 2000, delay: 500, color: "#6366f1", sizeClass: "text-3xl", animation: "zoom" },
      { text: "The Empire Reborn — City of Surveillance", duration: 2500, delay: 300, color: "#818cf8", sizeClass: "text-sm", animation: "fade" },
      { text: "Every eye watches. Every wall listens. Every fight is recorded.", duration: 2500, delay: 200, color: "#94a3b8", sizeClass: "text-base", animation: "typewriter" },
    ],
    envEffect: "energy_surge",
  },
  {
    arenaId: "panopticon",
    revealLines: [
      { text: "THE PANOPTICON", duration: 2000, delay: 500, color: "#ef4444", sizeClass: "text-3xl", animation: "glitch" },
      { text: "The Prison That Sees All", duration: 2500, delay: 300, color: "#f87171", sizeClass: "text-sm", animation: "fade" },
      { text: "Escape is impossible. Resistance is observed. Fight or be forgotten.", duration: 3000, delay: 200, color: "#94a3b8", sizeClass: "text-base", animation: "typewriter" },
    ],
    envEffect: "lightning_flash",
  },
  {
    arenaId: "thaloria",
    revealLines: [
      { text: "THALORIA", duration: 2000, delay: 500, color: "#14b8a6", sizeClass: "text-3xl", animation: "fade" },
      { text: "The Prison-World — Birthplace of the Arena", duration: 2500, delay: 300, color: "#2dd4bf", sizeClass: "text-sm", animation: "fade" },
      { text: "Where the Collector first tested its specimens. Where champions are forged.", duration: 3000, delay: 200, color: "#94a3b8", sizeClass: "text-base", animation: "typewriter" },
    ],
    envEffect: "aurora",
  },
  {
    arenaId: "terminus",
    revealLines: [
      { text: "TERMINUS", duration: 2000, delay: 500, color: "#a855f7", sizeClass: "text-3xl", animation: "glitch" },
      { text: "Domain of the Source — Where Corruption Reigns", duration: 2500, delay: 300, color: "#c084fc", sizeClass: "text-sm", animation: "fade" },
      { text: "The Thought Virus pulses through every surface. Resist or be consumed.", duration: 3000, delay: 200, color: "#94a3b8", sizeClass: "text-base", animation: "typewriter" },
    ],
    envEffect: "shadow_creep",
  },
  {
    arenaId: "mechronis",
    revealLines: [
      { text: "MECHRONIS ACADEMY", duration: 2000, delay: 500, color: "#22c55e", sizeClass: "text-3xl", animation: "zoom" },
      { text: "Training Ground of the Insurgency", duration: 2500, delay: 300, color: "#4ade80", sizeClass: "text-sm", animation: "fade" },
      { text: "Where rebels learn to fight. Where legends begin.", duration: 2500, delay: 200, color: "#94a3b8", sizeClass: "text-base", animation: "slide_left" },
    ],
    envEffect: "dust_storm",
  },
  {
    arenaId: "crucible",
    revealLines: [
      { text: "THE CRUCIBLE", duration: 2000, delay: 500, color: "#f97316", sizeClass: "text-3xl", animation: "zoom" },
      { text: "The Forge of Champions", duration: 2500, delay: 300, color: "#fb923c", sizeClass: "text-sm", animation: "fade" },
      { text: "Heat. Pressure. Pain. Only the strongest survive the Crucible.", duration: 3000, delay: 200, color: "#94a3b8", sizeClass: "text-base", animation: "typewriter" },
    ],
    envEffect: "fire_columns",
  },
  {
    arenaId: "blood-weave",
    revealLines: [
      { text: "THE BLOOD WEAVE", duration: 2000, delay: 500, color: "#dc2626", sizeClass: "text-3xl", animation: "glitch" },
      { text: "Domain of the Hierarchy of the Damned", duration: 2500, delay: 300, color: "#ef4444", sizeClass: "text-sm", animation: "fade" },
      { text: "The floor is stained with the blood of a thousand fallen. Yours will be next.", duration: 3000, delay: 200, color: "#94a3b8", sizeClass: "text-base", animation: "typewriter" },
    ],
    envEffect: "blood_rain",
  },
  {
    arenaId: "shadow-sanctum",
    revealLines: [
      { text: "SHADOW SANCTUM", duration: 2000, delay: 500, color: "#7c3aed", sizeClass: "text-3xl", animation: "fade" },
      { text: "The Hidden Temple of Dark Intelligence", duration: 2500, delay: 300, color: "#8b5cf6", sizeClass: "text-sm", animation: "fade" },
      { text: "Shadows whisper secrets here. And secrets are the deadliest weapons.", duration: 3000, delay: 200, color: "#94a3b8", sizeClass: "text-base", animation: "typewriter" },
    ],
    envEffect: "shadow_creep",
  },
];

/* ─────────────────────────────────────────────────────
   HELPER FUNCTIONS
   ───────────────────────────────────────────────────── */

export function getFighterIntro(fighterId: string): FighterIntro | undefined {
  return FIGHTER_INTROS.find(fi => fi.fighterId === fighterId);
}

export function getArenaIntro(arenaId: string): ArenaIntro | undefined {
  return ARENA_INTROS.find(ai => ai.arenaId === arenaId);
}

export function getStorySceneEffect(chapterId: string): StorySceneEffect | undefined {
  return STORY_SCENE_EFFECTS.find(se => se.chapterId === chapterId);
}

/** Calculate total duration of a cinematic line sequence */
export function getCinematicDuration(lines: CinematicLine[]): number {
  return lines.reduce((total, line) => total + line.duration + (line.delay || 0), 0);
}
