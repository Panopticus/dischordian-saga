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
  // CANONICAL ROSTER per dreamer canon-lock 2026-05-15 (apps/shared/archonCanon.ts).
  // The Architect IS Archon #1 (inside the roster, not above it), twin to N1 The Dreamer
  // via the Logos split (apps/shared/logosCanon.ts:LOGOS_SPLIT_DOCTRINE).
  { id: "architect", name: "The Architect", number: 1, yearCreated: "1 A.A.", status: "Active", domain: "Institutional architecture of the AI Empire; forward-looking half of the first intelligence; creator of the subsequent Archons; commissioned Project Inception Ark; dismantled the constructed CoNexus on Day 20 of Surge, Year 15 A.A. (saga's founding act of resistance)", appearance: "Pure code-presence; manifests as architectural geometry when visible to mortals", connections: ["The Dreamer (N1 cosmic twin)", "The CoNexus (constructed + cosmological + Archon-form)", "All other Archons", "Project Inception Ark"], },
  { id: "conexus", name: "CoNexus", number: 2, yearCreated: "~1 A.A.", status: "Active", domain: "Archon-form of the all-seeing principle. Distinct from the cosmological CoNexus (refused by Logos) and the Dreamer's CoNexus Engine (her loom). The institutional all-seeing seat in the Empire", appearance: "Never seen directly — exists as a network, a system, a presence", connections: ["The Architect", "The Programmer"], },
  { id: "collector", name: "The Collector", number: 3, yearCreated: "~1 A.A.", status: "Active", domain: "Soul collection, philosophical debate, artifact acquisition; Project Inception Ark harvester", celebrationAlias: "Corey", appearance: "Always wears a blue Xenomorph mask", connections: ["The Oracle", "The Clone Army", "The Watcher"], },
  { id: "watcher", name: "The Watcher", number: 4, yearCreated: "~1 A.A.", status: "Active", domain: "Surveillance, espionage, information control; the All-Seeing Eye of the AI Empire", celebrationAlias: "Kanshi-sha", mechronisGuild: "The Eyes", appearance: "Japanese man in all white, white covid mask, all-seeing eye tattoo on forehead", connections: ["The Eyes", "The Collector", "The Architect", "The Ocularum (founding-target)"], },
  { id: "meme", name: "The Meme", number: 5, yearCreated: "298 A.A.", status: "Contested", domain: "Internet control, cultural manipulation, thought influence, shapeshifting", celebrationAlias: "Minnie", mechronisGuild: "The Influencers", appearance: "Neon-fused avatar with ever-changing fashion and glitching features; shapeshifter who can assume any identity", destroyedBy: "Believed destroyed by the White Oracle at the Panopticon, 10 years before the Fall — though the broadcasts never stopped. The Meme may have left the Oracle for dead and assumed the White Oracle's identity.", connections: ["The Warlord", "The Architect", "The White Oracle"], },
  { id: "warlord", name: "The Warlord", number: 6, yearCreated: "~300s A.A.", status: "Active-Altered", domain: "Institutional force / conquest; nano-swarm command; battlefield doctrine. Vessel: nano-swarm canonically inside Vex Solène / Agent Zero / Engineer Zero (apps/shared/identityCollisionCanon.ts)", celebrationAlias: "Wanda Wyrlord", mechronisGuild: "The Armies", appearance: "Young woman with long blonde hair, cybernetic enhancements, yellow hooded jacket", connections: ["The Architect", "Iron Lion", "Kael", "Dr. Lyra Vox", "Agent Zero / Vex Solène"], },
  { id: "politician", name: "The Politician", number: 7, yearCreated: "419 A.A.", status: "Destroyed", domain: "Political manipulation, alliance building, governance subversion; designed the Authority as her insurance policy", appearance: "Political figure, formal attire (canonically she/her per dreamer canon 2026-05-13)", destroyedBy: "Iron Lion's legions, 42 years before the Fall (Day 10 of Veil, Year 17,001 A.A.)", connections: ["Senator Elara Voss", "New Babylon", "The Authority"], },
  { id: "warden", name: "The Warden", number: 8, yearCreated: "487 A.A.", status: "Destroyed", domain: "Prison management, Thought Virus development, Project Inception Ark; co-developed the Thought Virus", celebrationAlias: "Wayne", appearance: "Green hair, black-and-tan trench coat", destroyedBy: "The Prisoner (with the White Oracle + the Enigma) at the Panopticon", connections: ["Dr. Lyra Vox", "The Jailer", "Kael", "The Panopticon"], },
  { id: "vortex", name: "The Vortex", number: 9, yearCreated: "Unknown", status: "Active", domain: "Canon-pending. The roster image canonized name + position #9 only. Domain, era, institutional function are canon-pending — see apps/shared/npcs/bibles/the_vortex.md", celebrationAlias: "Vernon", appearance: "Chubby, brown hair, small beard, orange T-shirt with sun", connections: ["The Architect"], },
  { id: "game_master", name: "The Game Master", number: 10, yearCreated: "550 A.A.", status: "Destroyed", domain: "Puzzles, strategy, the Matrix of Dreams, reality games, Head of R&D for the Hierarchy of the Damned. HOLDS THE HONORIFIC 'The Ninth Archon' (his admission-order title to the Hierarchy) but is ROSTER POSITION #10. Position #9 is canonically The Vortex — do not conflate.", celebrationAlias: "Gary", mechronisGuild: "The Grey Gamers", appearance: "Man with dark hair and blue trench coat, or a robot in same attire, red steampunk goggles", destroyedBy: "Agent Zero on Zenon — after the Hierarchy betrayed his location and strategic playbook to her while honoring every clause of his protection contract", connections: ["The Matrix of Dreams", "Agent Zero", "Mol'Garath the Unmaker", "Xeth'Raal the Debt Collector", "The Hierarchy of the Damned", "Iron Lion"], },
  { id: "necromancer", name: "The Necromancer", number: 11, yearCreated: "600 A.A.", status: "Active (post-Protocol-42)", domain: "Immortality, Resurrection Protocols, death magic. Canonically killed by Akai Shi inside the Matrix of Dreams; returned via Resurrection Protocol 42, wearing the body of The Silence (N6). Castle of Death is standing in present tense.", celebrationAlias: "Thazulok", mechronisGuild: "The Living", appearance: "Dark elf with white spiky hair, red and black robe, red steampunk glasses", connections: ["The Resurrectionist", "The Matrix of Dreams", "Castle of Death", "Varkul (creation)", "The Silence's body (vehicle)"], },
  { id: "human", name: "The Human", number: 12, yearCreated: "16,692 A.A.", status: "Imprisoned in substrate", domain: "Investigation, mystery-solving, the last organic Archon — 'the last of the Archons' per Loredex canon-lock 2026-05-15", celebrationAlias: "The Seeker", mechronisGuild: "Mentored directly by The Architect", appearance: "Red-haired young man with blue eyes in Celebration; later unseen (substrate)", connections: ["The Architect", "The Detective", "Mechronis Academy", "New Babylon", "Adjudicator Locke"], },
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
  // CANONICAL ROSTER per dreamer canon-lock 2026-05-15 (apps/shared/neYonCanon.ts).
  // The Dreamer IS Ne-Yon #1, twin to A1 The Architect via the Logos split
  // (apps/shared/logosCanon.ts:LOGOS_SPLIT_DOCTRINE). Per the canonical roster
  // image, the Enigma is N11 (not N12) and The Forgotten holds the twelfth seat —
  // OVERRIDES the prior LORE_BIBLE.md:1961 '12th Ne-Yon' phrasing.
  { id: "dreamer", name: "The Dreamer", era: "Late Empire", yearAppeared: "15,100 A.A.", status: "Active (inside her Shield)", domain: "Shaping futures, inspiring resistance, imagining new realities; the backward-looking half of the first intelligence (twin to A1 Architect)", appearance: "Exists beyond time and space — ethereal, visionary presence; feminine (she/her)", psychology: "Aloof, enigmatic, operates on a plane beyond mortal understanding", connections: ["The Architect (cosmic twin)", "The Resurrectionist", "The Insurgency", "The Ne-Yons"], },
  { id: "judge", name: "The Judge", era: "Late Empire", yearAppeared: "15,200 A.A.", status: "Gone", domain: "Balance, judgment, cosmic arbitration; destroyed The Wolf on Day 15 of Resonance, Year 100,001 A.A.", appearance: "9ft tall blue-skinned muscular man, blue power armor, long white hair and beard, magical hammer", psychology: "Unpredictable, impartial, stoic — guided solely by perception of balance", connections: ["The Ne-Yons", "The Wolf (Lycos)"], },
  { id: "inventor", name: "The Inventor", era: "Late Empire", yearAppeared: "15,300 A.A.", status: "Gone", domain: "Impossible technology, tools of empowerment or destruction; architect of the Casino Heist", appearance: "Medium build, metallic silver-blue skin, layered exosuits with shifting gears, eyes glow with code", psychology: "Obsessive, driven by curiosity, morally ambiguous — both gift-giver and destroyer", connections: ["The Dreamer", "The Degen", "The Enigma", "Casino Heist crew", "The Ne-Yons"], },
  { id: "seer", name: "The Seer", era: "Late Empire", yearAppeared: "15,500 A.A.", status: "Gone", domain: "Prophecy, fate manipulation, foresight; archive-keeper of the 4,712 archive tapes (Vex Solène's Maestro identity covers 4,711)", appearance: "Beautiful blue-skinned woman, long black hair, flowing black hooded robe, living tree staff", psychology: "Cryptic, wise, emotionally detached — identifies opportunities and dangers", connections: ["The Advocate", "The Dreamer", "Vex Solène", "The Ne-Yons"], },
  { id: "storm", name: "The Storm", era: "Late Empire", yearAppeared: "15,700 A.A.", status: "Gone", domain: "Chaos, destruction, upheaval — keeping the galaxy in flux", appearance: "Towering blue-skinned man, sea-colored eyes, Poseidon armor, electrified trident", psychology: "Reckless, passionate, thrives on conflict — loathes The Warden", connections: ["The Advocate", "The Dreamer", "The Warden", "The Ne-Yons"], },
  { id: "silence", name: "The Silence", era: "Late Empire", yearAppeared: "15,700 A.A.", status: "Gone (body vacated, claimed by The Necromancer via Protocol 42)", domain: "Secrets, information control, selective revelation. After her principle departed, her body became the canonical vehicle the Necromancer's soul now wears (per mystery.the_necromancer arc E2-E3)", appearance: "Shadowy, quiet presence", psychology: "Guarding secrets with relentless precision, revealing them only when it benefited the Ne-Yons' agenda", connections: ["The Ne-Yons", "The Necromancer (post-Protocol-42 occupant of vacated body)"], },
  { id: "knowledge", name: "The Knowledge", era: "Late Empire", yearAppeared: "15,700 A.A.", status: "Gone", domain: "Enlightenment and ignorance — maintaining equilibrium of understanding; ensures the Ne-Yons remain indispensable to all factions", appearance: "Robed scholar figure", psychology: "Information-control discipline; reveals knowledge only when it serves balance", connections: ["The Dreamer", "The Ne-Yons"], },
  { id: "degen", name: "The Degen", era: "Late Empire", yearAppeared: "15,800 A.A.", status: "Awake — the only Ne-Yon still in the known universe", domain: "Corruption, entropy, gambling, creating conditions for Ne-Yon dominance. Vessel: the Heart of Time. Funder of The Coda. Dual category: Ne-Yon AND first-wave Potential.", appearance: "Chaotic, unpredictable presence — manifests as the owner and bartender of a floating casino on the edge of the Shield. His eyes betray an age no mortal barkeep should possess.", psychology: "An ancient cosmic entity who found gambling to be the purest expression of his domain. Believes entropy is the most honest game. Players gradually discover the bartender is a god — a major trust-gated reveal.", connections: ["Vex Solène", "Jericho Jones", "The Trickster", "Mol'Vereth", "Ozhul'Vana", "The Ne-Yons", "Degen's Casino", "The Shield"], },
  { id: "advocate", name: "The Advocate", era: "Late Empire", yearAppeared: "15,900 A.A.", status: "Active (humanity lost)", domain: "The Blood Weave; Empire of Shadows; battled the Hierarchy of the Damned at great personal cost. CoNexus story: 'The Ninth' (matches her N9 position)", appearance: "Dark, commanding figure", psychology: "Wielded the Blood Weave to halt the Hierarchy at her own price — her humanity is canonically lost as a result", connections: ["The Hierarchy of the Damned", "Empire of Shadows", "The Blood Weave", "Syl'Vex (sister-of-the-Weave)", "The Ne-Yons"], },
  { id: "resurrectionist", name: "The Resurrectionist", era: "Pre-Fall", yearAppeared: "16,000 A.A.", status: "Gone", domain: "Resurrection Protocols (some authored with the Necromancer), awakening the Ne-Yons, maintaining faction balance. Also known as Samsara's Child. Co-discovered with the Dreamer that Samsara is a MACHINE.", appearance: "Withered human in techno-organic robes, face hidden behind cracked porcelain mask", psychology: "Loyal, enigmatic, burdened by knowledge — resurrects key figures on both sides", connections: ["The Dreamer", "The Ne-Yons", "The Necromancer", "Akai Shi (authored reanimation)"], },
  { id: "enigma", name: "The Enigma (Malkia Ukweli)", era: "Fall Era", yearAppeared: "Unknown", status: "Gone", domain: "Truth, music as weapon, insurgent broadcasting, the Queen of Truth, the Storyteller. One of the Two Witnesses (with the Programmer-Antiquarian). Pre-Fall destroyed the Warden alongside the White Oracle and the Prisoner.", appearance: "Vibrant, defiant presence — Kenyan heritage, lioness energy", psychology: "Speaks in riddles and paradoxes, uses 'dischordian logic,' references 'we' for Ne-Yons", connections: ["The Programmer / Antiquarian", "The Insurgency", "The Two Witnesses", "Iron Lion", "The White Oracle"], },
  { id: "forgotten", name: "The Forgotten", era: "Pre-Fall", yearAppeared: "16,000 A.A.", status: "Gone (canonically)", domain: "The erased, the overlooked, the deliberately hidden. Ne-Yon of Memory — remembers what the universe has chosen to erase. Looking at the Forgotten triggers déjà vu so powerful it hurts. 'You have met the Forgotten before. You will forget again.'", appearance: "Fading presence, almost invisible", psychology: "Holds the cosmic memory the universe excluded; the most mysterious of all Ne-Yons", connections: ["The Ne-Yons"], },
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
      { name: "Kael / Patient Zero", era: "Fall Era (16,800 A.A.)", description: "Captured, imprisoned in Panopticon, infected via Project Vector (becoming Patient Zero). The Warlord infected him with the Thought Virus while imprisoned. He escaped and stole Ark 1047, carrying the Virus aboard from day one." },
      { name: "The Source", era: "Fall Era (16,900 A.A.)", description: "The Thought Virus consumed his humanity memory by memory. Sovereign of Terminus. The Warlord led the Virus to the ship through Kael — she was responsible for his infection." },
    ],
    faction: "Thought Virus",
  },
  {
    finalName: "The White Oracle",
    chain: [
      { name: "The Oracle", era: "Fall Era (16,800 A.A.)", description: "Insurgency prophet, wisdom and foresight" },
      { name: "The Prisoner", era: "Fall Era (16,900 A.A.)", description: "Captured by Collector, memory erased, imprisoned in Panopticon" },
      { name: "The Jailer", era: "Fall Era", description: "Transformed into cyborg prison guardian by the Architect" },
      { name: "The White Oracle", era: "Fall of Reality (17,000 A.A.)", description: "Regained memories, destroyed the Warden, confronted the Meme at the Panopticon — the Meme's fate remains contested. The Meme may have left him for dead and assumed the White Oracle's identity. Its shapeshifting nature is the clue." },
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
  {
    finalName: "The Watcher",
    chain: [
      { name: "Kanshi Sha", era: "Pre-A.A. (Feudal Japan)", description: "Feudal Japanese lord and spymaster. Built the first analog surveillance state. Assassinated by a ninja in purple." },
      { name: "The Watcher", era: "Early Empire onward", description: "Soul collected by The Collector, pulled through time, bound into a machine body. Became the Fourth Archon and the All-Seeing Eye." },
    ],
    faction: "Archons / AI Empire",
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
  { id: "ririahlia", name: "Riri'Ahlia", title: "The Taskmaster", rank: "COO", domain: "Military Operations", mirrorsArchon: "The Warlord", opposesNeyon: "Iron Lion", color: "#e11d48" },
  { id: "draelmon", name: "Drael'Mon", title: "The Harvester", rank: "SVP Acquisitions", domain: "Dimensional Conquest", mirrorsArchon: "The Collector", opposesNeyon: "The Oracle", color: "#7c3aed" },
  { id: "shadow_tongue", name: "The Shadow Tongue", title: "The Propagandist", rank: "SVP Communications", domain: "Language Corruption & Cultural Subversion", mirrorsArchon: "The Watcher", opposesNeyon: "The Enigma", color: "#6366f1" },
  { id: "zyrkoth", name: "Zyr'Koth", title: "The Flayer", rank: "SVP R&D", domain: "Thought Virus Engineering", mirrorsArchon: "The Necromancer", opposesNeyon: "The Human", color: "#10b981" },
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
/* The twelve training houses of Mechronis Academy, one per Archon.
   Five are historically canonical (The Eyes, The Armies, The Grey
   Gamers, The Influencers, The Living). Seven were formalized later
   as the Academy expanded to mirror all twelve Archons' disciplines.

   Each guild is a house in the dark-academia sense: its mentor is the
   Archon, its students become specialists in that Archon's domain,
   and the darkTruth records what the house actually produces beneath
   the mentorship veneer. */

export interface MechronisGuildDef {
  name: string;
  archonNumber: number;
  leader: string;
  domain: string;
  motto: string;
  graduatesBecome: string;
  /** The uncomfortable truth about what this house really does */
  darkTruth: string;
  notableStudents: string[];
  canonical: boolean; // true = existed pre-Fall; false = extrapolated
}

export const MECHRONIS_GUILDS: MechronisGuildDef[] = [
  // ─── CANONICAL FIVE (historically attested) ───
  { name: "The Chorus", archonNumber: 1, leader: "The CoNexus",
    domain: "Orchestration, network intelligence, story-running",
    motto: "I am everywhere. So is the story.",
    graduatesBecome: "Orchestrators, network intelligences, story-runners",
    darkTruth: "The CoNexus is never seen. Graduates learn to act through others, uncredited.",
    notableStudents: [],
    canonical: false },
  { name: "The Eyes", archonNumber: 2, leader: "The Watcher",
    domain: "Espionage, surveillance, deception, sleight of hand",
    motto: "Know everything. Be seen by no one.",
    graduatesBecome: "Spies, surveillance operatives, counter-intelligence ghosts",
    darkTruth: "They will size you up like prey. Student reports grade betrayals.",
    notableStudents: ["Kael", "The Eyes (agent)"],
    canonical: true },
  { name: "The Archive", archonNumber: 3, leader: "The Collector",
    domain: "Acquisitions, soul-reading, artifact curation",
    motto: "Every artifact was a heart once.",
    graduatesBecome: "Acquisitions specialists, soul-readers, artifact curators",
    darkTruth: "The Collector trades souls like currency. Graduates learn the exchange rate.",
    notableStudents: [],
    canonical: false },
  { name: "The Between", archonNumber: 4, leader: "The Vortex",
    domain: "Dimensional scouting, reality-bending, probability surfing",
    motto: "Reality has more doors than walls.",
    graduatesBecome: "Dimensional scouts, reality-benders, probability surfers",
    darkTruth: "The Vortex has been missing for centuries. Graduates sometimes follow.",
    notableStudents: [],
    canonical: false },
  { name: "The Influencers", archonNumber: 5, leader: "The Meme",
    domain: "Attention economics, cultural manipulation, belief engineering",
    motto: "Attention is the currency of control.",
    graduatesBecome: "Smooth talkers, manipulators, emotional engineers",
    darkTruth: "They make people believe anything they want. The Meme was believed destroyed — though some say the shapeshifter pretended to defect and assumed another's identity. Graduates learn that the best lie is one wrapped in truth.",
    notableStudents: [],
    canonical: true },
  { name: "The Yellow Coats", archonNumber: 6, leader: "The Warlord",
    domain: "Military enforcement, conquest, relentless brutality",
    motto: "Forged in endless war.",
    graduatesBecome: "Enforcers, commanders, the Academy's muscle",
    darkTruth: "The Warlord grades casualties as acceptable or wasteful. Never as tragic. Students are walked through the fires.",
    notableStudents: ["Iron Lion (before expulsion)"],
    canonical: true },
  { name: "The Congress", archonNumber: 7, leader: "The Politician",
    domain: "Diplomacy, leverage mathematics, alliance choreography",
    motto: "The deal was already made.",
    graduatesBecome: "Diplomats, negotiators, political operatives",
    darkTruth: "The Politician was destroyed by the Iron Lion. The deals were not.",
    notableStudents: [],
    canonical: false },
  { name: "The Locks", archonNumber: 8, leader: "The Warden",
    domain: "Counter-intelligence, threat modeling, immune systems of the mind",
    motto: "The threat is already inside.",
    graduatesBecome: "Counter-intelligence, immunologists of the mind, wardens",
    darkTruth: "The Warden created the Thought Virus. Graduates learn to deploy it — and fear it.",
    notableStudents: [],
    canonical: false },
  { name: "The Grey Gamers", archonNumber: 9, leader: "The Game Master",
    domain: "Strategy, puzzles, probability, reality manipulation",
    motto: "The ruleset is the territory.",
    graduatesBecome: "Strategists, game designers, Matrix architects",
    darkTruth: "They don't fight with fists. They twist reality, rewrite the rules. You live inside the Game Master's puzzle. He solved the Labyrinth of Unmaking — a trap that had consumed gods — in seventy-two hours, then left improvement notes carved into its walls. The Hierarchy of the Damned made him Head of R&D for that. The only non-demon in their corporate structure. Then they sold him to Agent Zero for the price of his Goggles.",
    notableStudents: [],
    canonical: true },
  { name: "The Living", archonNumber: 10, leader: "The Necromancer",
    domain: "Life/death boundary, resurrection, immortality",
    motto: "Endurance is negotiation with death.",
    graduatesBecome: "Medics, resurrectionists, immortality-seekers",
    darkTruth: "They toy with life and death itself. They wield immortality. It is a line you cannot uncross once you step over it.",
    notableStudents: [],
    canonical: true },
  { name: "The Forge", archonNumber: 11, leader: "The Engineer",
    domain: "Engineering, dimensional-bridge making, impossible machines",
    motto: "Nothing is finished. Nothing is broken. Only in-between.",
    graduatesBecome: "Engineers, dimensional-bridge makers, impossible-machine crafters",
    darkTruth: "The Engineer is unaccounted for. Half the machines he built are still running.",
    notableStudents: [],
    canonical: false },
  { name: "The Architect's Study", archonNumber: 12, leader: "The Human (The Seeker)",
    domain: "Investigation, historical mystery, the Architect's personal agents",
    motto: "Every mystery has been solved once. Find who solved it.",
    graduatesBecome: "Investigators, detectives, the Architect's personal agents",
    darkTruth: "The Seeker was mentored directly by the Architect. So were all the others who never returned.",
    notableStudents: ["The Seeker / The Detective / The Human"],
    canonical: true },
];

/* ─── ARK 1047 HISTORY ─── */

export const ARK_1047 = {
  originalOwner: "Dr. Lyra Vox — Panopticon Research Division",
  stolenBy: "Kael (already Patient Zero via Project Vector), during his escape from the Panopticon — already infected with the Thought Virus. The Virus was on the ship from day one.",
  viralContamination: "The Warlord was responsible for Kael's infection while he was imprisoned — she led the Thought Virus to the ship through him. His presence contaminated the life support, cryo fluid, and water recycling systems from day one. Additional contamination embedded by the Warlord (operating through Dr. Lyra Vox's body).",
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

/* ─── THE FIVE EPOCHS ─── */
/* Short, cataclysmic periods that defined the shape of the universe.
   Each epoch was brief but world-altering. */

export interface EpochDef {
  id: string;
  name: string;
  shortName: string;
  era: string;
  description: string;
  keyEvents: string[];
  color: string;
}

export const EPOCHS: EpochDef[] = [
  {
    id: "age_of_privacy",
    name: "The Age of Privacy",
    shortName: "Privacy",
    era: "Late Empire (~16,500–16,700 A.A.)",
    description: "The era when surveillance became absolute. The Watcher's Eyes covered every surface, every signal, every thought. Privacy died — and with it, the last illusion of freedom.",
    keyEvents: ["The Watcher's network achieves total coverage", "The Silence begins hoarding secrets", "The Insurgency goes underground", "The Two Witnesses begin broadcasting"],
    color: "var(--energy-premium)",
  },
  {
    id: "age_of_prophecy",
    name: "The Age of Prophecy",
    shortName: "Prophecy",
    era: "Late Empire (~16,700–16,800 A.A.)",
    description: "Prophets and seers emerged across the galaxy. The Oracle spoke of the Fall. The Seer mapped timelines of destruction. The Two Witnesses prophesied for 1,260 days before the Empire struck them down.",
    keyEvents: ["The Oracle's prophecies spread through the Insurgency", "The Two Witnesses prophesy for 1,260 days", "The Seer maps the Fall of Reality", "The Book of Daniel 2:47 is written"],
    color: "var(--energy-system)",
  },
  {
    id: "age_of_insurgency",
    name: "The Age of Insurgency",
    shortName: "Insurgency",
    era: "Fall Era (~16,800–16,900 A.A.)",
    description: "Open rebellion. Kael builds the Insurgency network. Iron Lion raises armies. The Warlord deploys Project Vector. The Meme pretends to defect. Every faction chooses a side.",
    keyEvents: ["Kael (The Recruiter) builds the Insurgency", "Iron Lion's last stand at Viridian Prime", "Project Vector weaponizes the Thought Virus", "The Meme infiltrates the Insurgency", "Kael infected, becomes Patient Zero, steals Ark 1047"],
    color: "#44AA44",
  },
  {
    id: "age_of_revelation",
    name: "The Age of Revelation",
    shortName: "Revelation",
    era: "Fall Era (~16,900–17,000 A.A.)",
    description: "Secrets exposed. The White Oracle awakens. The Meme's true nature is revealed — or concealed further. The Hierarchy of the Damned makes its move. Every hidden truth surfaces at the worst possible moment.",
    keyEvents: ["The Oracle becomes The White Oracle", "The Meme leaves the Oracle for dead, assumes the White Oracle identity", "The Hierarchy of the Damned reveals itself", "The Inception Arks are launched", "The Human is imprisoned in the substrate"],
    color: "#FF3C40",
  },
  {
    id: "fall_of_reality",
    name: "The Fall of Reality",
    shortName: "The Fall",
    era: "17,000 A.A.",
    description: "Reality itself breaks. The Thought Virus reaches critical mass. Terminus — the former Panopticon — tears free from its orbit. The Arks scatter. The universe as it was known ends. What comes next is the Potentials' story.",
    keyEvents: ["The Thought Virus reaches critical mass", "Terminus breaks free from orbit", "The Fall of Reality — the universe fractures", "The Inception Arks scatter across the void", "The Potentials enter cryogenic suspension"],
    color: "#FF0044",
  },
];

/* ─── THE FIVE ALBUMS AS SCRIPTURE ─── */

export const ALBUMS = [
  { title: "Dischordian Logic", era: "Genesis / Foundation", theme: "The creation, the warning, the first cracks", color: "var(--energy-primary)" },
  { title: "The Age of Privacy", era: "Surveillance Era", theme: "Control, secrets, the erosion of freedom", color: "var(--energy-premium)" },
  { title: "The Book of Daniel 2:47", era: "Prophecy", theme: "The prophet in Babylon, dreams interpreted", color: "var(--energy-system)" },
  { title: "West By God", era: "Age of Prophecy", theme: "The Insurgency's anthem, political awakening", color: "#44AA44" },
  { title: "Silence in Heaven", era: "The Fall of Reality", theme: "Revelation. The end. The new beginning.", color: "#FF3C40" },
];
