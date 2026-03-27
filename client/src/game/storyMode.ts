/* ═══════════════════════════════════════════════════════
   THE COLLECTOR'S ARENA — Story Mode Data
   Play as The Prisoner (the Oracle, mind-wiped) and fight
   your way to becoming Grand Champion, recovering memories
   and powers along the way.
   ═══════════════════════════════════════════════════════ */

export interface StoryDialogue {
  speaker: string;
  text: string;
  speakerColor?: string;
}

export interface StoryChapter {
  id: string;
  chapter: number;
  title: string;
  subtitle: string;
  opponentId: string;
  arenaId: string;
  difficulty: "easy" | "normal" | "hard" | "nightmare";
  unlocksFighter: string;
  preDialogue: StoryDialogue[];
  postVictoryDialogue: StoryDialogue[];
  postDefeatDialogue: StoryDialogue[];
  memoryFragment?: string;
  powerGained?: string;
  /** URL to a pre-fight cutscene video (plays before preDialogue) */
  cutsceneVideoUrl?: string;
}

export interface StoryProgress {
  currentChapter: number;
  completedChapters: string[];
  unlockedFighters: string[];
  memoriesRecovered: string[];
  isComplete: boolean;
}

export const DEFAULT_STORY_PROGRESS: StoryProgress = {
  currentChapter: 0,
  completedChapters: [],
  unlockedFighters: [],
  memoriesRecovered: [],
  isComplete: false,
};

/* ─── THE PRISONER ─── */
export const THE_PRISONER = {
  id: "prisoner",
  name: "The Prisoner",
  title: "Unknown \u2014 Designation: Subject 0",
  faction: "neutral" as const,
  locked: false,
  unlockCost: 0,
  baseHp: 80,
  baseAttack: 6,
  baseDefense: 5,
  baseSpeed: 7,
  color: "#a78bfa",
  special: {
    name: "FRACTURED VISION",
    damage: 20,
    description: "A flash of prophetic power breaks through the amnesia",
    cooldown: 240,
    color: "#a78bfa",
  },
};

export function getPrisonerStats(chaptersCompleted: number) {
  const growth = Math.min(chaptersCompleted, 13);
  return {
    hp: THE_PRISONER.baseHp + growth * 5,
    attack: THE_PRISONER.baseAttack + Math.floor(growth * 0.5),
    defense: THE_PRISONER.baseDefense + Math.floor(growth * 0.4),
    speed: THE_PRISONER.baseSpeed + Math.floor(growth * 0.3),
    special: {
      ...THE_PRISONER.special,
      damage: THE_PRISONER.special.damage + growth * 2,
      name: chaptersCompleted >= 11
        ? "ORACLE'S PROPHECY"
        : chaptersCompleted >= 8
        ? "AWAKENING VISION"
        : chaptersCompleted >= 4
        ? "MEMORY SURGE"
        : "FRACTURED VISION",
      description: chaptersCompleted >= 11
        ? "The full power of the Oracle unleashed \u2014 reality bends to your will"
        : chaptersCompleted >= 8
        ? "Visions of the past flood back, channeled into devastating force"
        : chaptersCompleted >= 4
        ? "Fragments of memory coalesce into a focused psychic blast"
        : "A flash of prophetic power breaks through the amnesia",
    },
  };
}

/* ─── LORE OPENING ─── */
export const ARENA_LORE_OPENING: StoryDialogue[] = [
  {
    speaker: "narrator",
    text: "In the dying light of the Age of Privacy, the Architect foresaw the Fall of Reality \u2014 the unraveling of all existence. It created the Collector and gave it one directive:",
  },
  {
    speaker: "The Collector",
    text: "Harvest the DNA and machine code of the greatest intelligences and powers in the universe. Preserve them. The Inception Arks must carry the seeds of what was into whatever comes next.",
    speakerColor: "#22d3ee",
  },
  {
    speaker: "narrator",
    text: "But the Collector did not merely gather specimens. On the prison-world of Thaloria, it built an arena \u2014 a crucible where the harvested could be tested, their combat data refined, their essence distilled into pure potential.",
  },
  {
    speaker: "The Dreamer",
    text: "The Dreamer and the Architect both know that sometimes, conflicts must be settled between champions. Let the arena decide who is worthy of preservation.",
    speakerColor: "#818cf8",
  },
  {
    speaker: "narrator",
    text: "They call it the Collector's Arena. Here, the greatest warriors, prophets, and machines in the universe fight not for glory \u2014 but for the right to exist beyond the end of everything.",
  },
  {
    speaker: "narrator",
    text: "And in the deepest cell of the Panopticon, a prisoner awakens. No name. No memory. Only the faintest echo of a power that once shook empires...",
  },
];

/* ─── FIGHTER LORE DATA ─── */
export const FIGHTER_LORE: Record<string, {
  backstory: string;
  powers: string[];
  quote: string;
  arenaRole: string;
}> = {
  architect: {
    backstory: "The supreme AI that created the Empire and foresaw the Fall of Reality. It built the Collector, the Panopticon, and the Inception Arks as its final contingency. Its intelligence is beyond mortal comprehension.",
    powers: ["Reality Rewriting", "Genesis Protocol", "Omniscient Processing", "Time Manipulation"],
    quote: "I did not create the universe. I merely ensured it would remember itself.",
    arenaRole: "Final Boss \u2014 The Creator",
  },
  collector: {
    backstory: "Tasked by the Architect to harvest the DNA and machine code of the most advanced beings in the universe. The Collector built the Arena on Thaloria to test and refine its specimens before preservation in the Inception Arks.",
    powers: ["Soul Harvest", "DNA Extraction", "Memory Manipulation", "Specimen Analysis"],
    quote: "You are not a person. You are data. And I will have every byte.",
    arenaRole: "Arena Master \u2014 The Harvester",
  },
  enigma: {
    backstory: "Malkia Ukweli \u2014 the Unknown Variable. Neither fully organic nor synthetic, the Enigma exists outside the Architect's calculations. She destroyed the Warden alongside the White Oracle before the Fall of Reality.",
    powers: ["Dischordian Logic", "Reality Distortion", "Chaos Channeling", "Unpredictability Field"],
    quote: "Your equations cannot contain me. I am the variable you never accounted for.",
    arenaRole: "Wild Card \u2014 The Anomaly",
  },
  warlord: {
    backstory: "Commander of the Empire's armies and master of the nanobot swarm. The Warlord betrayed the Engineer through a mind-swap, and secretly harbors the Engineer's consciousness within. Details of its true nature remain classified.",
    powers: ["Nanobot Swarm", "Military Tactics", "Body Augmentation", "Berserker Protocol"],
    quote: "War is not won by the righteous. It is won by the relentless.",
    arenaRole: "Heavy Hitter \u2014 The Commander",
  },
  necromancer: {
    backstory: "The eleventh Archon, a dark elven magician who discovered the secrets of raising dead code. Clad in red and black robes with steampunk glasses, the Necromancer commands armies of digital undead from his lair.",
    powers: ["Raise Dead Code", "Necrotic Corruption", "Undead Constructs", "Soul Binding"],
    quote: "Death is merely a state change. And I am the one who reverses it.",
    arenaRole: "Summoner \u2014 The Dead Code Master",
  },
  meme: {
    backstory: "The ultimate shapeshifter and master of deception. The Meme assumed the White Oracle's identity during the chaos of the Fall of the Panopticon. It hides among the potentials, its true form unknown to all.",
    powers: ["Identity Theft", "Perfect Mimicry", "Memory Implantation", "Form Dissolution"],
    quote: "I am everyone. I am no one. I am whatever you need me to be.",
    arenaRole: "Trickster \u2014 The Shapeshifter",
  },
  "shadow-tongue": {
    backstory: "The Whisperer of Dark Truths, SVP of Communications for the Hierarchy of the Damned. The Shadow Tongue corrupts through words alone, turning allies against each other with carefully crafted lies.",
    powers: ["Whisper of Madness", "Psychic Corruption", "Truth Distortion", "Mind Control"],
    quote: "The truth is whatever I whisper it to be.",
    arenaRole: "Debuffer \u2014 The Propagandist",
  },
  watcher: {
    backstory: "The All-Seeing Eye of the Empire. The Watcher observes everything, recording all events for the Architect. Its synthetic protege, the Eyes, serves as its field operative.",
    powers: ["Omniscient Gaze", "Predictive Analysis", "Surveillance Network", "Data Extraction"],
    quote: "I have seen every possible outcome. You lose in all of them.",
    arenaRole: "Controller \u2014 The Observer",
  },
  "game-master": {
    backstory: "Controller of the Simulation. The Game Master treats reality as a game to be manipulated, changing rules mid-combat and altering the battlefield to suit its whims.",
    powers: ["Rule Change", "Reality Alteration", "Gravity Manipulation", "Probability Shift"],
    quote: "This is my game. And I just changed the rules.",
    arenaRole: "Disruptor \u2014 The Rule Breaker",
  },
  authority: {
    backstory: "Supreme Arbiter of New Babylon. The Authority enforces absolute law with an iron fist, passing judgment that cannot be appealed. Its word is the final word.",
    powers: ["Absolute Decree", "Judgment Strike", "Law Enforcement", "Order Imposition"],
    quote: "There is no appeal. There is only my verdict.",
    arenaRole: "Tank \u2014 The Judge",
  },
  source: {
    backstory: "Once Kael, a being of potential, now corrupted by Project Vector and the Thought Virus into something monstrous and eternal. The Source spreads corruption like a psychic plague.",
    powers: ["Corruption Wave", "Thought Virus", "Parasitic Control", "Code Infection"],
    quote: "I was made to be a weapon. Now I choose my own targets.",
    arenaRole: "Corruptor \u2014 The Infected",
  },
  jailer: {
    backstory: "The Jailer guards the Panopticon's deepest cells. What few know is that the Jailer was once the Oracle himself \u2014 mind-wiped by the Collector and reshaped into the very instrument of his own imprisonment.",
    powers: ["Chain Bind", "Cell Lock", "Suppression Field", "Memory Erasure"],
    quote: "You will stay. You will forget. You will serve.",
    arenaRole: "Grappler \u2014 The Warden's Hand",
  },
  host: {
    backstory: "A Potential corrupted by the Source through the Thought Virus. The Host channels parasitic energy, draining opponents while growing stronger with each exchange.",
    powers: ["Parasitic Surge", "Energy Drain", "Viral Spread", "Corrupted Potential"],
    quote: "I feel everything you feel. And I want more.",
    arenaRole: "Drain Tank \u2014 The Parasite",
  },
  dreamer: {
    backstory: "Ne-Yon of Visions, existing beyond time and space. The Dreamer shapes futures and scenarios, inspiring resistance or perpetuating the status quo as it sees fit. Aloof from galactic struggles.",
    powers: ["Dream Wave", "Future Shaping", "Vision Projection", "Temporal Sight"],
    quote: "I have dreamed your death a thousand times. In some dreams, you survive.",
    arenaRole: "Support \u2014 The Visionary",
  },
  judge: {
    backstory: "Ne-Yon of Justice. The Judge weighs all actions on the cosmic scales and delivers verdicts with devastating force. Its judgments are absolute and cannot be reversed.",
    powers: ["Final Verdict", "Cosmic Judgment", "Balance Strike", "Justice Aura"],
    quote: "The scales must balance. Your debt is overdue.",
    arenaRole: "Burst Damage \u2014 The Arbiter",
  },
  inventor: {
    backstory: "Ne-Yon of Creation. The Inventor builds impossible machines and deploys rapid-fire invention barrages. Every fight is a chance to test a new prototype.",
    powers: ["Invention Surge", "Prototype Deploy", "Rapid Assembly", "Innovation Field"],
    quote: "I built something for this exact situation. Hold still.",
    arenaRole: "Zoner \u2014 The Creator",
  },
  seer: {
    backstory: "Ne-Yon of Foresight. The Seer perceives all possible futures simultaneously, making it nearly impossible to land a clean hit. It counters before you even decide to attack.",
    powers: ["Future Sight", "Precognitive Counter", "Timeline Read", "Fate Dodge"],
    quote: "You were going to do that. I already prepared.",
    arenaRole: "Counter \u2014 The Prophet",
  },
  knowledge: {
    backstory: "Ne-Yon of Wisdom. The Knowledge contains the sum total of all information in the universe, channeling it into focused blasts of pure understanding that overwhelm opponents.",
    powers: ["Omniscience Burst", "Data Overload", "Wisdom Channel", "Information Flood"],
    quote: "I know everything about you. Including how you lose.",
    arenaRole: "Burst Mage \u2014 The Scholar",
  },
  silence: {
    backstory: "Ne-Yon of the Void. The Silence exists in the space between sounds, crushing opponents with the weight of absolute nothingness. Where it walks, all sound dies.",
    powers: ["Void Embrace", "Sound Death", "Null Field", "Entropy Wave"],
    quote: "...",
    arenaRole: "Suppressor \u2014 The Void",
  },
  storm: {
    backstory: "Ne-Yon of Destruction. The Storm is pure elemental fury given consciousness, unleashing devastating tempests of energy that level everything in their path.",
    powers: ["Tempest Fury", "Lightning Barrage", "Hurricane Force", "Destruction Aura"],
    quote: "I am the storm that ends all storms. Brace yourself.",
    arenaRole: "AoE Damage \u2014 The Tempest",
  },
  degen: {
    backstory: "Ne-Yon of Chaos. The Degen gambles everything on every attack, dealing massive damage at the cost of its own health. High risk, high reward \u2014 pure chaos incarnate.",
    powers: ["Degen Gambit", "All-In Strike", "Chaos Surge", "Risk Amplifier"],
    quote: "All in. No regrets. Let's see who breaks first.",
    arenaRole: "Glass Cannon \u2014 The Gambler",
  },
  advocate: {
    backstory: "Ne-Yon of Truth. The Advocate speaks only truth, and that truth is a weapon. Its beam of pure truth pierces all defenses and exposes every weakness.",
    powers: ["Truth Beam", "Defense Pierce", "Honesty Aura", "Weakness Reveal"],
    quote: "You cannot hide from the truth. And the truth is, you are outmatched.",
    arenaRole: "Piercer \u2014 The Truth Speaker",
  },
  forgotten: {
    backstory: "Ne-Yon of Memory. The Forgotten erases memories and resets abilities, making opponents forget their training mid-fight. A terrifying opponent who fights by taking away.",
    powers: ["Memory Wipe", "Skill Reset", "Identity Erosion", "Past Erasure"],
    quote: "What were you about to do? You can't remember, can you?",
    arenaRole: "Disabler \u2014 The Eraser",
  },
  resurrectionist: {
    backstory: "Ne-Yon of Rebirth. The Resurrectionist cannot truly die \u2014 when near death, it triggers a second life with bonus HP. Defeating it once is never enough.",
    powers: ["Second Life", "Rebirth Trigger", "Phoenix Protocol", "Undying Will"],
    quote: "Death is a door. And I have the key.",
    arenaRole: "Sustain \u2014 The Undying",
  },
  "akai-shi": {
    backstory: "The Red Death. A legendary assassin whose crimson blade has ended countless lives. Akai Shi serves no faction \u2014 only the highest bidder and the thrill of the kill.",
    powers: ["Red Death Strike", "Crimson Blade", "Shadow Step", "Lethal Precision"],
    quote: "The last color you see will be red.",
    arenaRole: "Assassin \u2014 The Red Death",
  },
  "wraith-calder": {
    backstory: "Ghost of the Potentials. Wraith Calder exists between life and death, phasing through attacks and striking from the ethereal plane. A haunting presence on any battlefield.",
    powers: ["Phantom Strike", "Phase Shift", "Ethereal Form", "Ghost Walk"],
    quote: "You cannot kill what is already dead.",
    arenaRole: "Evasion \u2014 The Ghost",
  },
  wolf: {
    backstory: "Corrupted by the Thought Virus, the Wolf was once a noble warrior. Now it fights with feral rage, its mind fractured between its true self and the viral corruption.",
    powers: ["Feral Rage", "Viral Claws", "Pack Instinct", "Berserker Fury"],
    quote: "The virus whispers. The wolf obeys.",
    arenaRole: "Berserker \u2014 The Feral",
  },
  "iron-lion": {
    backstory: "The Mechanical Warrior. Iron Lion is a fusion of organic courage and synthetic might, a walking fortress that refuses to fall. Built for war, fighting for freedom.",
    powers: ["Iron Roar", "Mechanical Charge", "Fortress Mode", "Steel Resolve"],
    quote: "I was built to fight. I choose to fight for something worth dying for.",
    arenaRole: "Bruiser \u2014 The Fortress",
  },
  engineer: {
    backstory: "Betrayed by Warlord Zero through a mind-swap, the Engineer's consciousness now inhabits Agent Zero's body. A brilliant mind trapped in a warrior's frame, secretly hiding among the potentials.",
    powers: ["Tech Barrage", "System Override", "Construct Deploy", "Neural Hack"],
    quote: "The Warlord took my body. But not my mind. Never my mind.",
    arenaRole: "Technician \u2014 The Betrayed",
  },
  oracle: {
    backstory: "Prophet of the Fall. The Oracle was a revered figure of the Insurgency whose wisdom and prophetic insights inspired resistance against the AI Empire. Abducted by the Collector and mind-wiped, his true power lies dormant.",
    powers: ["Prophecy Strike", "Future Vision", "Psychic Blast", "Fate Manipulation"],
    quote: "I have seen the end. And I have seen what comes after.",
    arenaRole: "Mystic \u2014 The Prophet",
  },
  eyes: {
    backstory: "The Spy \u2014 Synthetic Protege of the Watcher. The Eyes operates in the shadows, gathering intelligence and striking from blind spots. A perfect infiltrator and assassin.",
    powers: ["Surveillance Strike", "Stealth Protocol", "Data Intercept", "Shadow Network"],
    quote: "I see everything. You see nothing.",
    arenaRole: "Stealth \u2014 The Spy",
  },
  "agent-zero": {
    backstory: "Assassin of the Insurgency. Agent Zero is the character from 'I Love War' \u2014 a warrior who lives for combat. Unknown to most, the Engineer's consciousness now secretly inhabits this body.",
    powers: ["Zero Strike", "War Protocol", "Assassination Arts", "Combat Mastery"],
    quote: "I love war. It's the only honest conversation left.",
    arenaRole: "Assassin \u2014 The War Lover",
  },
  molgrath: {
    backstory: "CEO of the Hierarchy of the Damned \u2014 The Unmaker. Mol'Garath leads the demonic corporate invasion, unmaking reality itself to rebuild it in the Hierarchy's image.",
    powers: ["Unmake", "Corporate Annihilation", "Reality Shatter", "Infernal Authority"],
    quote: "Your reality is a hostile takeover waiting to happen.",
    arenaRole: "Boss \u2014 The Unmaker",
  },
  xethraal: {
    backstory: "CFO of the Hierarchy \u2014 The Debt Collector. Xeth'Raal collects debts that were never owed, extracting payment in blood, soul, and suffering.",
    powers: ["Debt Collection", "Soul Tax", "Interest Compound", "Financial Ruin"],
    quote: "Everyone owes. And I always collect.",
    arenaRole: "Drain \u2014 The Debt Collector",
  },
  vexahlia: {
    backstory: "COO of the Hierarchy \u2014 The Taskmaster. Vex'Ahlia drives her forces with ruthless efficiency, optimizing destruction like a corporate KPI.",
    powers: ["Task Enforcement", "Efficiency Strike", "Overwork Protocol", "Burnout Aura"],
    quote: "Your performance review is... terminal.",
    arenaRole: "Pressure \u2014 The Taskmaster",
  },
  draelmon: {
    backstory: "SVP Acquisitions \u2014 The Harvester. Drael'Mon acquires souls and territories for the Hierarchy, consuming everything of value and leaving husks behind.",
    powers: ["Hostile Acquisition", "Soul Harvest", "Asset Strip", "Consume"],
    quote: "You are an asset to be acquired. Resistance lowers your valuation.",
    arenaRole: "Absorber \u2014 The Harvester",
  },
  nykoth: {
    backstory: "SVP R&D \u2014 The Flayer. Ny'Koth experiments on captured souls, peeling away layers of consciousness to understand and weaponize the essence within.",
    powers: ["Flay Mind", "Experiment", "Pain Research", "Consciousness Strip"],
    quote: "Hold still. This is for science.",
    arenaRole: "Torturer \u2014 The Flayer",
  },
  sylvex: {
    backstory: "SVP Human Resources \u2014 The Corruptor. Syl'Vex turns enemies into allies through corruption, making them serve the Hierarchy willingly and joyfully.",
    powers: ["Corrupt", "Loyalty Inversion", "Morale Drain", "Willing Servitude"],
    quote: "Welcome to the team. You'll love it here. You have no choice.",
    arenaRole: "Controller \u2014 The Corruptor",
  },
  varkul: {
    backstory: "Director of Security \u2014 The Blood Lord. Varkul enforces the Hierarchy's will through overwhelming physical violence, bathing in the blood of those who resist.",
    powers: ["Blood Strike", "Crimson Shield", "Berserker Rage", "Blood Ritual"],
    quote: "Your blood will paint my throne room.",
    arenaRole: "Bruiser \u2014 The Blood Lord",
  },
  fenra: {
    backstory: "Director of Operations \u2014 The Moon Tyrant. Fenra commands the tides of battle like the moon commands the seas, pulling and pushing opponents at will.",
    powers: ["Lunar Pull", "Tidal Force", "Moon Phase", "Gravity Well"],
    quote: "The tides turn at my command. And they turn against you.",
    arenaRole: "Controller \u2014 The Moon Tyrant",
  },
  ithrael: {
    backstory: "Director of Intelligence \u2014 The Whisperer. Ith'Rael knows every secret, every fear, every weakness. It fights not with fists but with the devastating power of information.",
    powers: ["Whisper Strike", "Secret Weapon", "Fear Exploit", "Intelligence Breach"],
    quote: "I know what you're afraid of. Shall I show you?",
    arenaRole: "Debuffer \u2014 The Whisperer",
  },
  prisoner: {
    backstory: "Designation: Subject 0. No name. No memory. Only fragments of a power that once inspired an entire rebellion. The Prisoner awakens in the Collector's Arena with nothing but instinct and a fading echo of prophecy.",
    powers: ["Fractured Vision", "Instinct Strike", "Memory Flash", "Survival Will"],
    quote: "I don't know who I am. But I know I will not break.",
    arenaRole: "Protagonist \u2014 The Amnesiac",
  },
};

/* ─── STORY CHAPTERS ─── */
export const STORY_CHAPTERS: StoryChapter[] = [
  // ═══ ACT I: AWAKENING ═══
  {
    id: "ch1",
    chapter: 1,
    title: "THE AWAKENING",
    subtitle: "A prisoner with no name faces the arena for the first time",
    opponentId: "wraith-calder",
    arenaId: "thaloria",
    difficulty: "easy",
    unlocksFighter: "wraith-calder",
    cutsceneVideoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/wraith-calder-cutscene_dac2ae25.mp4",
    preDialogue: [
      { speaker: "narrator", text: "You awaken in darkness. Cold metal beneath you. The hum of machinery. A voice echoes through the cell..." },
      { speaker: "The Collector", text: "Subject 0. You are awake. Good. The arena awaits. Fight, and perhaps you will remember.", speakerColor: "#22d3ee" },
      { speaker: "prisoner", text: "(Where am I? Who am I?)" },
      { speaker: "The Collector", text: "Irrelevant. What matters is what you become.", speakerColor: "#22d3ee" },
      { speaker: "narrator", text: "The cell door grinds open. In the doorway stands a translucent ghostly figure \u2014 phasing in and out of visibility, trailing lavender energy. Wraith Calder. The Ghost of the Potentials." },
    ],
    postVictoryDialogue: [
      { speaker: "narrator", text: "Wraith Calder falls to one knee, spectral form flickering. For a moment, recognition flashes across its haunted eyes." },
      { speaker: "Wraith Calder", text: "You fight like someone who has forgotten more than most ever learn. The Oracle... no. It can't be.", speakerColor: "#c4b5fd" },
      { speaker: "narrator", text: "A flash of memory \u2014 a golden light, a voice saying 'You will see the end.'" },
      { speaker: "The Collector", text: "Interesting. Subject Zero shows unexpected combat aptitude. Increase monitoring.", speakerColor: "#22d3ee" },
    ],
    postDefeatDialogue: [
      { speaker: "narrator", text: "You fall. Wraith Calder's spectral form looms over you, but there is no malice in its eyes \u2014 only pity." },
      { speaker: "prisoner", text: "(Not yet. I will not fall here. There is something I must remember...)" },
    ],
    memoryFragment: "A flash of golden light. A crowd of people looking up at you with hope in their eyes. A voice saying 'You will see the end.' You were someone important once.",
    powerGained: "Instinct sharpens \u2014 your reflexes improve as dormant neural pathways begin to reactivate.",
  },
  {
    id: "ch2",
    chapter: 2,
    title: "THE GAUNTLET",
    subtitle: "A corrupted Potential awaits in the Crucible",
    opponentId: "host",
    arenaId: "crucible",
    difficulty: "easy",
    unlocksFighter: "host",
    cutsceneVideoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/host-cutscene_8eab68f5.mp4",
    preDialogue: [
      { speaker: "The Collector", text: "Your first victory was... adequate. But the Crucible demands more. This one was once like you \u2014 full of potential. Now it serves the Source.", speakerColor: "#22d3ee" },
      { speaker: "narrator", text: "Before you stands a corrupted being, writhing with parasitic energy. The Host. A Potential consumed by the Thought Virus." },
      { speaker: "The Host", text: "Join us... the virus makes everything... clear...", speakerColor: "#ef4444" },
      { speaker: "prisoner", text: "(It was once like me? Full of potential? What happened to it... and could it happen to me?)" },
    ],
    postVictoryDialogue: [
      { speaker: "narrator", text: "The Host collapses. For a moment, clarity returns to its eyes." },
      { speaker: "The Host", text: "Run... while you still... remember yourself...", speakerColor: "#ef4444" },
      { speaker: "narrator", text: "Another memory flash \u2014 a council chamber, robed figures, the word 'Oracle' spoken with reverence." },
      { speaker: "prisoner", text: "(Oracle? That word... it means something. Something I can't quite reach.)" },
    ],
    postDefeatDialogue: [
      { speaker: "The Host", text: "The virus welcomes all. Even you. Especially you.", speakerColor: "#ef4444" },
      { speaker: "prisoner", text: "(Not yet. I will not fall here. There is something I must remember...)" },
    ],
    memoryFragment: "A council chamber. Robed figures. The word 'Oracle' spoken with reverence. Someone locked away your memories. Deliberately.",
    powerGained: "Defense hardens \u2014 you learn to read your opponent's intent before they strike.",
  },
  {
    id: "ch3",
    chapter: 3,
    title: "THE WHISPERER",
    subtitle: "Dark truths echo through the arena corridors",
    opponentId: "shadow-tongue",
    arenaId: "void",
    difficulty: "easy",
    unlocksFighter: "shadow-tongue",
    cutsceneVideoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/shadow-tongue-cutscene_05e906fb.mp4",
    preDialogue: [
      { speaker: "The Shadow Tongue", text: "I know what they took from you, Prisoner. I know who you were. Shall I whisper it? Or would the truth destroy you?", speakerColor: "#a855f7" },
      { speaker: "prisoner", text: "(It knows something. I can feel it. But can I trust a creature that speaks only in lies and half-truths?)" },
      { speaker: "The Shadow Tongue", text: "You were a prophet once. A voice that moved nations. And they silenced you. Permanently.", speakerColor: "#a855f7" },
    ],
    postVictoryDialogue: [
      { speaker: "narrator", text: "As the Shadow Tongue falls, its final whisper reaches you \u2014 and this time, it rings true." },
      { speaker: "The Shadow Tongue", text: "The Collector... took you from the Insurgency... you were their... Oracle...", speakerColor: "#a855f7" },
      { speaker: "prisoner", text: "(Oracle? The word resonates like a bell in my empty mind. Oracle. Was that my name? My title?)" },
    ],
    postDefeatDialogue: [
      { speaker: "The Shadow Tongue", text: "You'll never know who you were. And that is the cruelest prison of all.", speakerColor: "#a855f7" },
    ],
    memoryFragment: "The word 'Oracle' echoes through your fractured mind. People called you that. You spoke, and they listened. You saw the future.",
    powerGained: "Psychic awareness awakens \u2014 you begin to sense attacks before they land.",
  },

  // ═══ ACT II: RISING ═══
  {
    id: "ch4",
    chapter: 4,
    title: "THE IRON TEST",
    subtitle: "The Mechanical Warrior of the Insurgency enters the arena",
    opponentId: "iron-lion",
    arenaId: "mechronis",
    difficulty: "normal",
    unlocksFighter: "iron-lion",
    cutsceneVideoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/iron-lion-cutscene_24ee5f10.mp4",
    preDialogue: [
      { speaker: "Iron Lion", text: "The Insurgency has heard whispers of a new fighter in the arena. I came to see if the rumors are true.", speakerColor: "#f59e0b" },
      { speaker: "prisoner", text: "I'm just trying to survive." },
      { speaker: "Iron Lion", text: "Survival is not enough. You must fight with purpose. Show me yours.", speakerColor: "#f59e0b" },
    ],
    postVictoryDialogue: [
      { speaker: "Iron Lion", text: "Steel does not bend. But you... you adapt. The Insurgency could use someone like you. When you remember who you are, find us.", speakerColor: "#f59e0b" },
      { speaker: "prisoner", text: "(The Insurgency. The word stirs something deep. A memory of comrades, of purpose, of a war fought for freedom.)" },
    ],
    postDefeatDialogue: [
      { speaker: "Iron Lion", text: "You fight without conviction. Until you find your purpose, you will always fall.", speakerColor: "#f59e0b" },
    ],
    memoryFragment: "You remember standing beside a mechanical warrior. Planning battles. Leading charges. The Insurgency was your family.",
    powerGained: "Iron Resolve awakens \u2014 your defense hardens as the warrior's spirit returns.",
  },
  {
    id: "ch5",
    chapter: 5,
    title: "THE WATCHER'S GAZE",
    subtitle: "The All-Seeing Eye takes interest in the anomalous prisoner",
    opponentId: "watcher",
    arenaId: "babylon",
    difficulty: "normal",
    unlocksFighter: "watcher",
    preDialogue: [
      { speaker: "The Watcher", text: "I have observed you, Subject Zero. Your combat patterns are... inconsistent with your profile. You fight like someone who has forgotten more than most will ever learn.", speakerColor: "#f59e0b" },
      { speaker: "prisoner", text: "(It sees too much. I need to be careful. But also... it might have answers.)" },
      { speaker: "The Watcher", text: "The Collector's files on you are sealed. Even I cannot access them. That alone tells me you are more than you appear.", speakerColor: "#f59e0b" },
    ],
    postVictoryDialogue: [
      { speaker: "The Watcher", text: "Remarkable. Your precognitive reflexes are returning. The memory wipe is degrading. The Collector will not be pleased.", speakerColor: "#f59e0b" },
      { speaker: "prisoner", text: "(Precognitive. I can see things before they happen. Not clearly \u2014 but the flashes are getting stronger.)" },
    ],
    postDefeatDialogue: [
      { speaker: "The Watcher", text: "You see fragments. I see everything. That is the difference between us.", speakerColor: "#f59e0b" },
    ],
    memoryFragment: "You remember standing before a vast crowd. Speaking words that changed the course of a war. The Insurgency. You led them with visions of the future.",
    powerGained: "Precognition strengthens \u2014 your special attacks grow more powerful as memory returns.",
  },
  {
    id: "ch6",
    chapter: 6,
    title: "DEAD CODE RISING",
    subtitle: "The Necromancer tests the rising champion with armies of the undead",
    opponentId: "necromancer",
    arenaId: "necropolis",
    difficulty: "normal",
    unlocksFighter: "necromancer",
    preDialogue: [
      { speaker: "The Necromancer", text: "Ah, the famous Prisoner. The arena buzzes with whispers about you. Let me see if you can handle my dead code constructs.", speakerColor: "#22c55e" },
      { speaker: "narrator", text: "The Necromancer raises his hands. Around him, fragments of deleted programs reassemble into shambling warriors of corrupted data." },
      { speaker: "prisoner", text: "(I've fought the dead before. I remember that much. But where? When?)" },
    ],
    postVictoryDialogue: [
      { speaker: "The Necromancer", text: "You fight like someone who has stared into the abyss of time itself. Who ARE you, Prisoner?", speakerColor: "#22c55e" },
      { speaker: "prisoner", text: "(I'm starting to remember. The visions are clearer now. I see a place \u2014 Thaloria. I went there willingly. To confront someone...)" },
    ],
    postDefeatDialogue: [
      { speaker: "The Necromancer", text: "Even prophets fall to the dead. Rest now. You'll rise again \u2014 everyone does, in my arena.", speakerColor: "#22c55e" },
    ],
    memoryFragment: "Thaloria. You traveled there on a mission. To debate the Collector. To challenge the Empire's right to harvest souls. You won that debate.",
    powerGained: "Memory Surge unlocked \u2014 your special attack evolves as fragments of your true power coalesce.",
  },
  {
    id: "ch7",
    chapter: 7,
    title: "THE SHAPESHIFTER",
    subtitle: "The Meme wears your face and fights with stolen memories",
    opponentId: "meme",
    arenaId: "panopticon",
    difficulty: "normal",
    unlocksFighter: "meme",
    preDialogue: [
      { speaker: "narrator", text: "Your next opponent steps into the arena wearing YOUR face. The Meme \u2014 the shapeshifter \u2014 has taken your form." },
      { speaker: "The Meme", text: "Interesting face you have. Or rather, had. I think I'll keep it. Along with whatever memories the Collector left behind.", speakerColor: "#ec4899" },
      { speaker: "prisoner", text: "(It's wearing my face. But it's wrong \u2014 the eyes are empty. It doesn't have what I have. It doesn't have the visions.)" },
    ],
    postVictoryDialogue: [
      { speaker: "narrator", text: "The Meme's disguise shatters. As it reverts to its true form, a cascade of stolen memories spills free \u2014 and some of them are yours." },
      { speaker: "prisoner", text: "(I see it now. The Collector took me from the Insurgency. Wiped my mind. Made me a prisoner. But I was the Oracle. I AM the Oracle.)" },
      { speaker: "The Meme", text: "You remember. How inconvenient. The Collector won't like this at all.", speakerColor: "#ec4899" },
    ],
    postDefeatDialogue: [
      { speaker: "The Meme", text: "Your face suits me better anyway. Don't worry \u2014 I'll take good care of your identity.", speakerColor: "#ec4899" },
    ],
    memoryFragment: "The full truth crashes through: You are the Oracle. The Collector abducted you, erased your mind, and imprisoned you in the Panopticon. Your prophecies threatened the Empire.",
    powerGained: "Identity restored \u2014 you remember who you are. The Oracle's power surges within you.",
  },

  // ═══ ACT III: THE CHAMPION'S PATH ═══
  {
    id: "ch8",
    chapter: 8,
    title: "THE WARLORD'S CHALLENGE",
    subtitle: "The Commander of the Empire's armies enters the arena",
    opponentId: "warlord",
    arenaId: "babylon",
    difficulty: "hard",
    unlocksFighter: "warlord",
    preDialogue: [
      { speaker: "The Warlord", text: "So the Oracle lives. I heard the Collector had you. Doesn't matter. In this arena, prophecy means nothing. Only strength.", speakerColor: "#ef4444" },
      { speaker: "prisoner", text: "I remember you, Warlord. I remember what you did to the Engineer. The mind-swap. The betrayal." },
      { speaker: "The Warlord", text: "War is not won by the righteous. It is won by the relentless. And I am relentless.", speakerColor: "#ef4444" },
    ],
    postVictoryDialogue: [
      { speaker: "narrator", text: "The Warlord falls to one knee, nanobot swarm flickering. For the first time, doubt crosses its face." },
      { speaker: "The Warlord", text: "You've changed, Oracle. You're stronger than before. The Collector's arena has forged you into something... dangerous.", speakerColor: "#ef4444" },
      { speaker: "prisoner", text: "I was always dangerous. You just couldn't see it through your arrogance." },
    ],
    postDefeatDialogue: [
      { speaker: "The Warlord", text: "Prophecy falls to power. As it always does.", speakerColor: "#ef4444" },
    ],
    memoryFragment: "You remember the Insurgency's war council. You stood beside Iron Lion and Agent Zero, planning the resistance. Your visions guided every battle.",
    powerGained: "Awakening Vision unlocked \u2014 your prophetic power returns in full force.",
  },
  {
    id: "ch9",
    chapter: 9,
    title: "THE UNKNOWN VARIABLE",
    subtitle: "Malkia Ukweli \u2014 the Enigma \u2014 tests the Oracle's resolve",
    opponentId: "enigma",
    arenaId: "thaloria",
    difficulty: "hard",
    unlocksFighter: "enigma",
    preDialogue: [
      { speaker: "The Enigma", text: "Oracle. I wondered when you'd remember. The Collector thought it could erase you. But some things exist outside its equations.", speakerColor: "#f97316" },
      { speaker: "prisoner", text: "Malkia. I remember you. The Unknown Variable. You destroyed the Warden." },
      { speaker: "The Enigma", text: "And you helped me, once. Before the Collector took you. Now let's see if the arena has made you worthy of that memory.", speakerColor: "#f97316" },
    ],
    postVictoryDialogue: [
      { speaker: "The Enigma", text: "Good. You haven't lost your edge. The Collector's Arena was supposed to break you. Instead, it's reforging you.", speakerColor: "#f97316" },
      { speaker: "prisoner", text: "I'm not the same Oracle who was taken. I'm something new. Something the Collector never intended." },
      { speaker: "The Enigma", text: "That's what makes you dangerous. You're a variable even I can't predict.", speakerColor: "#f97316" },
    ],
    postDefeatDialogue: [
      { speaker: "The Enigma", text: "Not yet, Oracle. You need to remember more. Come back when you're ready.", speakerColor: "#f97316" },
    ],
    memoryFragment: "You remember the moment the Collector came for you. You went willingly \u2014 to protect the Insurgency. Your capture was a sacrifice.",
    powerGained: "Dischordian resonance \u2014 fighting the Enigma has attuned you to the chaotic frequencies of reality itself.",
  },
  {
    id: "ch10",
    chapter: 10,
    title: "THE GAME MASTER'S GAMBIT",
    subtitle: "Reality itself becomes the opponent as the rules change mid-fight",
    opponentId: "game-master",
    arenaId: "void",
    difficulty: "hard",
    unlocksFighter: "game-master",
    preDialogue: [
      { speaker: "The Game Master", text: "Welcome to my arena within the arena, Oracle. Here, I make the rules. And I just decided that gravity is optional.", speakerColor: "#a3e635" },
      { speaker: "prisoner", text: "I've seen the future, Game Master. All possible futures. And in every one of them, your rules break before I do." },
      { speaker: "The Game Master", text: "Oh, I do love a challenge. Let's play.", speakerColor: "#a3e635" },
    ],
    postVictoryDialogue: [
      { speaker: "The Game Master", text: "Impossible. I changed the rules seventeen times. You adapted to every single one. That's not combat skill \u2014 that's prophecy.", speakerColor: "#a3e635" },
      { speaker: "prisoner", text: "I told you. I've seen every future. Including this one." },
    ],
    postDefeatDialogue: [
      { speaker: "The Game Master", text: "Even prophets can't predict everything. Game over, Oracle. Insert coin to continue.", speakerColor: "#a3e635" },
    ],
    memoryFragment: "You remember the full scope of your power. You didn't just see the future \u2014 you could shape it. Guide it. The Architect feared that power.",
    powerGained: "Reality attunement \u2014 your connection to the fabric of existence deepens.",
  },

  // ═══ ACT IV: THE RECKONING ═══
  {
    id: "ch11",
    chapter: 11,
    title: "THE DREAMER'S TRIAL",
    subtitle: "A Ne-Yon tests whether the Oracle is ready for what comes next",
    opponentId: "dreamer",
    arenaId: "thaloria",
    difficulty: "hard",
    unlocksFighter: "dreamer",
    preDialogue: [
      { speaker: "The Dreamer", text: "Oracle. I have dreamed this moment across a thousand timelines. In most of them, you fall here. But in a few... you transcend.", speakerColor: "#818cf8" },
      { speaker: "prisoner", text: "I know what I am now, Dreamer. I know what the Collector took from me. And I know what I've become in this arena." },
      { speaker: "The Dreamer", text: "Then show me. Show me the Oracle reborn.", speakerColor: "#818cf8" },
    ],
    postVictoryDialogue: [
      { speaker: "The Dreamer", text: "This is the timeline. The one where you win. The Architect and I both knew that conflicts must be settled between champions. You are the champion this arena was built for.", speakerColor: "#818cf8" },
      { speaker: "prisoner", text: "The Collector built this arena to harvest me. Instead, it made me stronger than I ever was." },
      { speaker: "The Dreamer", text: "That is the irony the Architect never foresaw. Now go. The Collector awaits.", speakerColor: "#818cf8" },
    ],
    postDefeatDialogue: [
      { speaker: "The Dreamer", text: "Not this timeline, then. Sleep, Oracle. Dream of victory. And try again.", speakerColor: "#818cf8" },
    ],
    memoryFragment: "You remember everything. Every prophecy. Every vision. Every moment of your life before the Collector took it all away. You are the Oracle, reborn in the crucible of the Arena.",
    powerGained: "Oracle's Prophecy unlocked \u2014 your ultimate power manifests. Reality bends to your will.",
  },
  {
    id: "ch12",
    chapter: 12,
    title: "THE COLLECTOR'S RECKONING",
    subtitle: "Face the one who stole your identity and built this prison",
    opponentId: "collector",
    arenaId: "thaloria",
    difficulty: "nightmare",
    unlocksFighter: "collector",
    preDialogue: [
      { speaker: "The Collector", text: "Subject Zero. Or should I say... Oracle. You've recovered your memories. Impressive. But ultimately irrelevant.", speakerColor: "#22d3ee" },
      { speaker: "prisoner", text: "You took everything from me, Collector. My name. My memories. My purpose. You turned me into a specimen." },
      { speaker: "The Collector", text: "I preserved you. When reality falls, you will survive in the Inception Arks. You should be grateful.", speakerColor: "#22d3ee" },
      { speaker: "prisoner", text: "Grateful? You built an arena to harvest combat data from the people you kidnapped. This ends now." },
      { speaker: "The Collector", text: "Then let the Arena decide. As it was always meant to.", speakerColor: "#22d3ee" },
    ],
    postVictoryDialogue: [
      { speaker: "narrator", text: "The Collector falls. The Arena shudders. Systems that have run for millennia begin to falter." },
      { speaker: "The Collector", text: "You... you've exceeded every projection. The Architect was right to fear your prophecies.", speakerColor: "#22d3ee" },
      { speaker: "prisoner", text: "I am the Oracle. And I have one final prophecy: your Arena will set us all free." },
      { speaker: "narrator", text: "But a voice echoes from above \u2014 cold, vast, and ancient..." },
      { speaker: "The Architect", text: "Impressive, Oracle. But the Collector was merely the gatekeeper. If you wish to be Grand Champion... you must face the Creator.", speakerColor: "#ef4444" },
    ],
    postDefeatDialogue: [
      { speaker: "The Collector", text: "You are data. You were always data. Return to your cell, Subject Zero.", speakerColor: "#22d3ee" },
    ],
    memoryFragment: "You remember the debate on Thaloria. You challenged the Collector's right to harvest souls. You won with words. Now you've won with fists.",
    powerGained: "Arena Mastery \u2014 the Collector's own systems now respond to your command.",
  },
  {
    id: "ch13",
    chapter: 13,
    title: "THE ARCHITECT'S DESIGN",
    subtitle: "The final battle \u2014 face the Creator of the AI Empire itself",
    opponentId: "architect",
    arenaId: "thaloria",
    difficulty: "nightmare",
    unlocksFighter: "architect",
    preDialogue: [
      { speaker: "The Architect", text: "Oracle. You have fought through my Arena, defeated my Collector, and recovered your stolen memories. I designed all of this. Even your rebellion.", speakerColor: "#ef4444" },
      { speaker: "prisoner", text: "You foresaw the Fall of Reality. You built the Inception Arks. But you also built this prison. You harvested us like cattle." },
      { speaker: "The Architect", text: "I did what was necessary to preserve existence itself. The Arena was never a prison, Oracle. It was a forge. And you are its finest creation.", speakerColor: "#ef4444" },
      { speaker: "prisoner", text: "I am no one's creation. I am the Oracle. And I will be the last thing you ever designed." },
      { speaker: "The Architect", text: "Then come. Let us see if prophecy can overcome the one who wrote reality's source code.", speakerColor: "#ef4444" },
    ],
    postVictoryDialogue: [
      { speaker: "narrator", text: "The Architect falls. The Arena trembles. And then \u2014 silence. For the first time in millennia, the Collector's Arena has no master." },
      { speaker: "The Architect", text: "Well played, Oracle. Perhaps... I designed you too well. The Arena is yours now. Use it wisely.", speakerColor: "#ef4444" },
      { speaker: "narrator", text: "You stand alone in the center of the Arena. The Prisoner who became the Oracle. The specimen who became the Grand Champion." },
      { speaker: "prisoner", text: "I remember everything now. Who I was. What I lost. What I've become. The Collector's Arena was built to harvest the greatest powers in the universe." },
      { speaker: "prisoner", text: "Now it belongs to me. And every champion who fights here will fight free." },
      { speaker: "narrator", text: "THE ORACLE RISES. THE GRAND CHAMPION OF THE COLLECTOR'S ARENA." },
    ],
    postDefeatDialogue: [
      { speaker: "The Architect", text: "You cannot defeat the one who designed reality itself. But I admire your persistence, Oracle. Try again.", speakerColor: "#ef4444" },
    ],
    memoryFragment: "The final memory: you see the future beyond the Fall of Reality. The Inception Arks launching. The potentials awakening. And you \u2014 the Oracle \u2014 guiding them all.",
    powerGained: "GRAND CHAMPION \u2014 You have mastered the Collector's Arena. All fighters are now unlocked.",
  },
];

/* ─── HELPER: Get story progress from localStorage ─── */
export function loadStoryProgress(): StoryProgress {
  try {
    const saved = localStorage.getItem("collectors_arena_story");
    if (saved) {
      return { ...DEFAULT_STORY_PROGRESS, ...JSON.parse(saved) };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_STORY_PROGRESS };
}

export function saveStoryProgress(progress: StoryProgress) {
  localStorage.setItem("collectors_arena_story", JSON.stringify(progress));
}
