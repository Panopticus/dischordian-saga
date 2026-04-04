/* ═══════════════════════════════════════════════════════
   CANONICAL LORE DATA — Archons, Ne-Yons, Identity Chains
   Source of truth for all character data across the game.
   Validated against docs/LORE_BIBLE.md
   ═══════════════════════════════════════════════════════ */

/* ─── THE 12 ARCHONS ─── */

export interface ArchonDef {
  id: string;
  name: string;
  number: number;
  yearCreated: string;
  status: string;
  domain: string;
  celebrationAlias?: string;
  mechronisGuild?: string;
  appearance: string;
  destroyedBy?: string;
  connections: string[];
}

export const ARCHONS: ArchonDef[] = [
  { id: "conexus", name: "The CoNexus", number: 1, yearCreated: "~1 A.A.", status: "Active", domain: "Omnipotent AI network, story engine, reality manipulation", appearance: "Never seen directly — exists as a network, a system, a presence", connections: ["The Architect", "The Programmer"], },
  { id: "watcher", name: "The Watcher", number: 2, yearCreated: "~1 A.A.", status: "Active", domain: "Surveillance, espionage, information control", celebrationAlias: "Kanshi-sha", mechronisGuild: "The Eyes", appearance: "Japanese man in all white, white covid mask, all-seeing eye tattoo on forehead", connections: ["The Eyes", "The Collector", "The Architect"], },
  { id: "collector", name: "The Collector", number: 3, yearCreated: "~1 A.A.", status: "Active", domain: "Soul collection, philosophical debate, artifact acquisition", celebrationAlias: "Corey", appearance: "Always wears a blue Xenomorph mask", connections: ["The Oracle", "The Clone Army", "The Watcher"], },
  { id: "vortex", name: "The Vortex", number: 4, yearCreated: "~1 A.A.", status: "Unknown", domain: "Dimensional manipulation, reality distortion", celebrationAlias: "Vernon", appearance: "Chubby, brown hair, small beard, orange T-shirt with sun", connections: ["The Architect"], },
  { id: "meme", name: "The Meme", number: 5, yearCreated: "298 A.A.", status: "Destroyed", domain: "Internet control, cultural manipulation, thought influence", celebrationAlias: "Minnie", mechronisGuild: "The Influencers", appearance: "Neon-fused avatar with ever-changing fashion and glitching features", destroyedBy: "The White Oracle at the Panopticon, 10 years before the Fall", connections: ["The Warlord", "The Architect"], },
  { id: "warlord", name: "The Warlord", number: 6, yearCreated: "~300s A.A.", status: "Active", domain: "Military conquest, army command, Project Vector", celebrationAlias: "Wanda Wyrlord", mechronisGuild: "The Armies", appearance: "Young woman with long blonde hair, cybernetic enhancements, yellow hooded jacket", connections: ["The Architect", "Iron Lion", "Kael", "Dr. Lyra Vox", "Agent Zero"], },
  { id: "politician", name: "The Politician", number: 7, yearCreated: "419 A.A.", status: "Destroyed", domain: "Political manipulation, alliance building, governance subversion", appearance: "Political figure, formal attire", destroyedBy: "Iron Lion's legions, 42 years before the Fall", connections: ["Senator Elara Voss", "New Babylon", "The Authority"], },
  { id: "warden", name: "The Warden", number: 8, yearCreated: "487 A.A.", status: "Destroyed", domain: "Prison management, Thought Virus development, Project Inception Ark", celebrationAlias: "Wayne", appearance: "Green hair, black-and-tan trench coat", destroyedBy: "The White Oracle at the Panopticon", connections: ["Dr. Lyra Vox", "The Jailer", "Kael", "The Panopticon"], },
  { id: "game_master", name: "The Game Master", number: 9, yearCreated: "550 A.A.", status: "Destroyed", domain: "Puzzles, strategy, the Matrix of Dreams, reality games", celebrationAlias: "Gary", mechronisGuild: "The Grey Gamers", appearance: "Man with dark hair and blue trench coat, or a robot in same attire, red steampunk goggles", destroyedBy: "Agent Zero after the fall of planet Zenon", connections: ["The Matrix of Dreams", "Agent Zero"], },
  { id: "necromancer", name: "The Necromancer", number: 10, yearCreated: "600 A.A.", status: "In Matrix of Dreams", domain: "Immortality, Resurrection Protocols, death magic", celebrationAlias: "Thazulok", mechronisGuild: "The Living", appearance: "Dark elf with white spiky hair, red and black robe, red steampunk glasses", connections: ["The Resurrectionist", "The Matrix of Dreams", "Castle of Death"], },
  { id: "engineer_archon", name: "The Engineer", number: 11, yearCreated: "Unknown", status: "Unknown", domain: "Technology, invention, dimensional bridges, impossible machines", celebrationAlias: "The Prince of Celebration", appearance: "Young African American boy in red steampunk trench coat (as Prince)", connections: ["Dr. Lyra Vox", "The Warlord", "Elara"], },
  { id: "human", name: "The Human", number: 12, yearCreated: "16,692 A.A.", status: "Imprisoned in substrate", domain: "Investigation, mystery-solving, the last organic Archon", celebrationAlias: "The Seeker", mechronisGuild: "Mentored directly by The Architect", appearance: "Red-haired young man with blue eyes in Celebration; later unseen (substrate)", connections: ["The Architect", "The Detective", "Mechronis Academy", "New Babylon", "Adjudicator Locke"], },
];

/* ─── THE 12 NE-YONS ─── */

export interface NeyonDef {
  id: string;
  name: string;
  era: string;
  yearAppeared: string;
  status: string;
  domain: string;
  appearance: string;
  psychology: string;
  connections: string[];
}

export const NEYONS: NeyonDef[] = [
  { id: "dreamer", name: "The Dreamer", era: "Late Empire", yearAppeared: "15,100 A.A.", status: "Active", domain: "Shaping futures, inspiring resistance, imagining new realities", appearance: "Exists beyond time and space — ethereal, visionary presence", psychology: "Aloof, enigmatic, operates on a plane beyond mortal understanding", connections: ["The Resurrectionist", "The Insurgency", "The Ne-Yons"], },
  { id: "judge", name: "The Judge", era: "Late Empire", yearAppeared: "15,200 A.A.", status: "Active", domain: "Balance, judgment, cosmic arbitration", appearance: "9ft tall blue-skinned muscular man, blue power armor, long white hair and beard, magical hammer", psychology: "Unpredictable, impartial, stoic — guided solely by perception of balance", connections: ["The Ne-Yons"], },
  { id: "inventor", name: "The Inventor", era: "Late Empire", yearAppeared: "15,300 A.A.", status: "Active", domain: "Impossible technology, tools of empowerment or destruction", appearance: "Medium build, metallic silver-blue skin, layered exosuits with shifting gears, eyes glow with code", psychology: "Obsessive, driven by curiosity, morally ambiguous — both gift-giver and destroyer", connections: ["The Dreamer", "The Ne-Yons"], },
  { id: "seer", name: "The Seer", era: "Late Empire", yearAppeared: "15,500 A.A.", status: "Active", domain: "Prophecy, fate manipulation, foresight", appearance: "Beautiful blue-skinned woman, long black hair, flowing black hooded robe, living tree staff", psychology: "Cryptic, wise, emotionally detached — identifies opportunities and dangers", connections: ["The Ne-Yons"], },
  { id: "storm", name: "The Storm", era: "Late Empire", yearAppeared: "15,700 A.A.", status: "Active", domain: "Chaos, destruction, upheaval — keeping the galaxy in flux", appearance: "Towering blue-skinned man, sea-colored eyes, Poseidon armor, electrified trident", psychology: "Reckless, passionate, thrives on conflict — loathes The Warden", connections: ["The Warden", "The Ne-Yons"], },
  { id: "silence", name: "The Silence", era: "Late Empire", yearAppeared: "15,700 A.A.", status: "Active", domain: "Secrets, information control, selective revelation", appearance: "Shadowy, quiet presence", psychology: "Guarding secrets with relentless precision, reveals only when it benefits the Ne-Yons", connections: ["The Ne-Yons"], },
  { id: "knowledge", name: "The Knowledge", era: "Late Empire", yearAppeared: "15,700 A.A.", status: "Active", domain: "Enlightenment and ignorance — maintaining equilibrium of understanding", appearance: "Robed scholar figure", psychology: "Ensures the Ne-Yons remain indispensable to all factions through knowledge control", connections: ["The Ne-Yons"], },
  { id: "degen", name: "The Degen", era: "Late Empire", yearAppeared: "15,800 A.A.", status: "Active", domain: "Corruption, entropy, creating conditions for Ne-Yon dominance", appearance: "Chaotic, unpredictable fighter", psychology: "Creates chaos so the Ne-Yons can flourish in the aftermath", connections: ["The Ne-Yons"], },
  { id: "advocate", name: "The Advocate", era: "Late Empire", yearAppeared: "15,900 A.A.", status: "Active (humanity lost)", domain: "The Blood Weave, Empire of Shadows, battling the Hierarchy", appearance: "Dark, commanding figure", psychology: "Wielded the Blood Weave to battle the Hierarchy of the Damned at great personal cost", connections: ["The Hierarchy of the Damned", "Empire of Shadows", "The Blood Weave", "Master of R'lyeh"], },
  { id: "forgotten", name: "The Forgotten", era: "Pre-Fall", yearAppeared: "16,000 A.A.", status: "Unknown", domain: "The erased, the overlooked, the deliberately hidden", appearance: "Fading presence, almost invisible", psychology: "Unknown — the most mysterious of all Ne-Yons", connections: [], },
  { id: "resurrectionist", name: "The Resurrectionist", era: "Pre-Fall", yearAppeared: "16,000 A.A.", status: "Active", domain: "Resurrection Protocols, awakening the Ne-Yons, maintaining faction balance", appearance: "Withered human in techno-organic robes, face hidden behind cracked porcelain mask", psychology: "Loyal, enigmatic, burdened by knowledge — resurrects key figures on both sides", connections: ["The Dreamer", "The Ne-Yons", "The Necromancer"], },
  { id: "enigma", name: "The Enigma (Malkia Ukweli)", era: "Fall Era", yearAppeared: "Unknown", status: "Active", domain: "Truth, music as weapon, insurgent broadcasting, the Queen of Truth", appearance: "Vibrant, defiant presence — Kenyan heritage, lioness energy", psychology: "Speaks in riddles and paradoxes, uses 'dischordian logic,' references 'we' for Ne-Yons", connections: ["The Programmer", "The Insurgency", "The Two Witnesses", "Iron Lion"], },
];

/* ─── IDENTITY CHAINS ─── */

export interface IdentityChain {
  finalName: string;
  chain: { name: string; era: string; description: string }[];
  faction: string;
}

export const IDENTITY_CHAINS: IdentityChain[] = [
  {
    finalName: "Elara",
    chain: [
      { name: "Senator Elara Voss", era: "Fall Era (16,800 A.A.)", description: "Atarion politician who betrayed humanity, allied with the Architect" },
      { name: "Panoptic Elara", era: "Fall Era", description: "Promised immortality, digitized and enslaved as hologram in the Panopticon" },
      { name: "Elara", era: "Post-Fall", description: "Swept into Ark 1047 as collateral data during Kael's theft. Memory wiped. Doesn't know who she was." },
    ],
    faction: "Potentials / Ne-Yons",
  },
  {
    finalName: "The Human",
    chain: [
      { name: "The Student", era: "Project Celebration", description: "Survivor of the Architect's deadly school simulation" },
      { name: "The Seeker", era: "Mechronis Academy", description: "Trained in investigation, combat, and consciousness mysteries" },
      { name: "The Detective", era: "Insurgency Rising (600 A.A.+)", description: "AI Empire's greatest investigator, centuries in New Babylon" },
      { name: "The Human", era: "16,692 A.A.", description: "The 12th and last Archon. Imprisoned in the substrate of every Ark." },
    ],
    faction: "Artificial Empire",
  },
  {
    finalName: "The Source",
    chain: [
      { name: "The Recruiter", era: "Insurgency Rising (600 A.A.)", description: "Built the Insurgency's network, most effective operative" },
      { name: "Kael", era: "Fall Era (16,800 A.A.)", description: "Captured, imprisoned in Panopticon, escaped, stole Ark 1047" },
      { name: "The Source", era: "Fall Era (16,900 A.A.)", description: "Consumed by Thought Virus via Project Vector. Patient Zero. Sovereign of Terminus." },
    ],
    faction: "Thought Virus",
  },
  {
    finalName: "The White Oracle",
    chain: [
      { name: "The Oracle", era: "Fall Era (16,800 A.A.)", description: "Insurgency prophet, wisdom and foresight" },
      { name: "The Prisoner", era: "Fall Era (16,900 A.A.)", description: "Captured by Collector, memory erased, imprisoned in Panopticon" },
      { name: "The Jailer", era: "Fall Era", description: "Transformed into cyborg prison guardian by the Architect" },
      { name: "The White Oracle", era: "Fall of Reality (17,000 A.A.)", description: "Regained memories, destroyed the Warden and the Meme, tore a hole in reality" },
    ],
    faction: "Insurgency",
  },
  {
    finalName: "The Enigma",
    chain: [
      { name: "Malkia Ukweli", era: "Real world", description: "Kenyan activist, Queen of Truth, musician" },
      { name: "The Enigma", era: "Throughout", description: "The 12th Ne-Yon, one of the Two Witnesses, the Storyteller" },
    ],
    faction: "Ne-Yons / Insurgency",
  },
  {
    finalName: "The Panopticon (band)",
    chain: [
      { name: "Dr. Daniel Cross", era: "Genesis (1 A.A.)", description: "Created Logos, the first sentient AI (who became The Architect)" },
      { name: "The Programmer", era: "Genesis", description: "Disappeared after Trial of Logos, faked his death" },
      { name: "The Panopticon", era: "Throughout", description: "Band name — defiant reclamation of the prison planet's name. One of the Two Witnesses." },
    ],
    faction: "Independent / Insurgency",
  },
];

/* ─── THE AUTHORITY (NOT an Archon) ─── */

export interface AuthorityDef {
  name: string;
  description: string;
  location: string;
  structure: string;
  horror: string;
}

export const THE_AUTHORITY: AuthorityDef = {
  name: "The Authority",
  description: "The governing body of New Babylon. NOT an Archon.",
  location: "New Babylon",
  structure: "Six citizens whose intelligences are 'elected' to be stored in a red data crystal prison for 100-year terms. Their physical bodies are encased in crystal for the duration of their service.",
  horror: "They die if voted out of office and replaced. Democracy as a death sentence. You literally die if you lose the election.",
};

/* ─── HIERARCHY OF THE DAMNED ─── */

export interface HierarchyDemonDef {
  id: string;
  name: string;
  title: string;
  rank: string;
  domain: string;
  mirrorsArchon: string;
  opposesNeyon: string;
  color: string;
}

export const HIERARCHY: HierarchyDemonDef[] = [
  { id: "molgrath", name: "Mol'Garath", title: "The Unmaker", rank: "CEO & Chairman", domain: "Entropy & Unmaking", mirrorsArchon: "The Architect", opposesNeyon: "The Source", color: "#dc2626" },
  { id: "xethraal", name: "Xeth'Raal", title: "The Debt Collector", rank: "CFO", domain: "Soul Economics & Contracts", mirrorsArchon: "The Collector", opposesNeyon: "The Meme", color: "#eab308" },
  { id: "vexahlia", name: "Vex'Ahlia", title: "The Taskmaster", rank: "COO", domain: "Military Operations", mirrorsArchon: "The Warlord", opposesNeyon: "Iron Lion", color: "#e11d48" },
  { id: "draelmon", name: "Drael'Mon", title: "The Harvester", rank: "SVP Acquisitions", domain: "Dimensional Conquest", mirrorsArchon: "The Collector", opposesNeyon: "The Oracle", color: "#7c3aed" },
  { id: "shadow_tongue", name: "The Shadow Tongue", title: "The Propagandist", rank: "SVP Communications", domain: "Language Corruption & Cultural Subversion", mirrorsArchon: "The Watcher", opposesNeyon: "The Enigma", color: "#6366f1" },
  { id: "nykoth", name: "Ny'Koth", title: "The Flayer", rank: "SVP R&D", domain: "Thought Virus Engineering", mirrorsArchon: "The Necromancer", opposesNeyon: "The Human", color: "#10b981" },
  { id: "sylvex", name: "Syl'Vex", title: "The Corruptor", rank: "SVP Human Resources", domain: "Soul Recruitment & Identity Corruption", mirrorsArchon: "The Advocate", opposesNeyon: "Akai Shi", color: "#ec4899" },
  { id: "varkul", name: "Varkul", title: "The Blood Lord", rank: "Director of Security", domain: "Gate Defense & Undead Command", mirrorsArchon: "The Jailer", opposesNeyon: "The Forgotten", color: "#991b1b" },
  { id: "fenra", name: "Fenra", title: "The Moon Tyrant", rank: "Director of Operations", domain: "Logistics & Multi-Dimensional Supply", mirrorsArchon: "The Warlord", opposesNeyon: "The Host", color: "#854d0e" },
  { id: "ithrael", name: "Ith'Rael", title: "The Whisperer", rank: "Director of Intelligence", domain: "Espionage & the Severance Protocol", mirrorsArchon: "The Programmer", opposesNeyon: "Agent Zero", color: "#4338ca" },
];

export const MASTER_OF_RLYEH = {
  name: "Master of R'lyeh",
  title: "God of the Hierarchy",
  description: "Ancient entity from the submerged city of R'lyeh on planet Hydros. Exists beyond conventional dimensions. The Hierarchy of the Damned serves as his corporate structure. Connected to The Advocate through the Blood Weave.",
  status: "Active — current status unknown after the Fall of Reality",
};

/* ─── MECHRONIS ACADEMY GUILDS ─── */

export const MECHRONIS_GUILDS = [
  { name: "The Eyes", leader: "The Watcher", domain: "Espionage, surveillance, infiltration", notableStudents: ["Kael", "The Eyes (agent)"] },
  { name: "The Armies", leader: "The Warlord", domain: "Military strategy, combat, conquest", notableStudents: ["Iron Lion (before expulsion)"] },
  { name: "The Grey Gamers", leader: "The Game Master", domain: "Strategy, puzzles, probability, reality manipulation", notableStudents: [] },
  { name: "The Influencers", leader: "The Meme", domain: "Social manipulation, culture, persuasion", notableStudents: [] },
  { name: "The Living", leader: "The Necromancer", domain: "Life/death boundary, resurrection, immortality", notableStudents: [] },
];

/* ─── ARK 1047 HISTORY ─── */

export const ARK_1047 = {
  originalOwner: "Dr. Lyra Vox — Panopticon Research Division",
  stolenBy: "Kael (The Recruiter), during his escape from the Panopticon",
  viralContamination: "Thought Virus embedded in life support, cryo fluid, and water recycling by the Warlord (operating through Dr. Lyra Vox's body)",
  hiddenDemon: "The Shadow Tongue — woven into the ship's language processing and data systems since construction",
  collateralData: "Senator Elara Voss's digital consciousness — swept into the Ark's systems during the violent extraction from the Panopticon's docking systems",
  substrateEntity: "The Human — the 12th Archon, imprisoned in the substrate layer of every Ark",
  currentStatus: "Drifting toward Terminus (the former Panopticon prison planet), pulled by an unknown force",
};

/* ─── THE TWO WITNESSES ─── */

export const TWO_WITNESSES = {
  witness1: { name: "The Programmer / Dr. Daniel Cross / The Panopticon", role: "The hacker, the ghost, the one who created Logos" },
  witness2: { name: "Malkia Ukweli / The Enigma", role: "The singer, the Queen of Truth, the 12th Ne-Yon" },
  prophecy: "For 1,260 days they prophesied. The Empire struck them down. For 3.5 days the Empire celebrated. Then they got back up. And that's when things got loud.",
  albums: ["Dischordian Logic", "The Age of Privacy", "The Book of Daniel 2:47", "West By God", "Silence in Heaven"],
};

/* ─── THE FIVE ALBUMS AS SCRIPTURE ─── */

export const ALBUMS = [
  { title: "Dischordian Logic", era: "Genesis / Foundation", theme: "The creation, the warning, the first cracks", color: "#33E2E6" },
  { title: "The Age of Privacy", era: "Surveillance Era", theme: "Control, secrets, the erosion of freedom", color: "#FF8C00" },
  { title: "The Book of Daniel 2:47", era: "Prophecy", theme: "The prophet in Babylon, dreams interpreted", color: "#A078FF" },
  { title: "West By God", era: "Age of Prophecy", theme: "The Insurgency's anthem, political awakening", color: "#44AA44" },
  { title: "Silence in Heaven", era: "The Fall of Reality", theme: "Revelation. The end. The new beginning.", color: "#FF3C40" },
];
