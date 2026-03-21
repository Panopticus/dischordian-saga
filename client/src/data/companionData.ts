/**
 * COMPANION & RELATIONSHIP SYSTEM
 * 
 * BioWare-style companion dialog, quest chains, relationship progression,
 * and romance mechanics for Elara (Dreamer/Humanity) and The Human (Architect/Machine).
 * 
 * Relationship levels: 0-100
 * Romance threshold: 75+ with corresponding morality alignment
 * Elara requires humanity morality ≥ 30 for romance
 * The Human requires machine morality ≤ -30 for romance
 */

export type CompanionId = "elara" | "the_human";

export interface CompanionProfile {
  id: CompanionId;
  name: string;
  title: string;
  faction: "dreamer" | "architect";
  moralitySide: "humanity" | "machine";
  /** Short tagline */
  tagline: string;
  /** Full backstory revealed in stages */
  backstoryStages: BackstoryStage[];
  /** Personality traits for dialog generation */
  personality: string[];
  /** Speech patterns for LLM prompt */
  speechPattern: string;
  /** Avatar URLs for progressive reveal */
  avatarStages: { level: number; url: string; description: string }[];
}

export interface BackstoryStage {
  id: string;
  /** Relationship level required to unlock */
  requiredLevel: number;
  /** Title of this backstory chapter */
  title: string;
  /** The backstory text — rich, literary prose */
  content: string;
  /** Companion's emotional state during this reveal */
  mood: "guarded" | "reflective" | "vulnerable" | "passionate" | "haunted" | "resolute";
}

export interface CompanionQuest {
  id: string;
  companionId: CompanionId;
  /** Relationship level required to trigger */
  requiredLevel: number;
  /** Morality score requirement (positive = humanity, negative = machine) */
  moralityRequirement?: number;
  /** Quest title */
  title: string;
  /** Quest description */
  description: string;
  /** Dialog that introduces the quest */
  introDialog: string;
  /** What the player must do */
  objective: string;
  /** How to complete it */
  completionCondition: QuestCondition;
  /** Rewards */
  rewards: { relationshipXp: number; dreamTokens: number; xp: number; unlockId?: string };
  /** Dialog on completion */
  completionDialog: string;
  /** Whether this is a romance quest */
  isRomanceQuest?: boolean;
}

export type QuestCondition =
  | { type: "visit_room"; roomId: string }
  | { type: "play_game"; gameId: string }
  | { type: "collect_card"; cardId: string }
  | { type: "reach_morality"; threshold: number }
  | { type: "discover_entry"; entryId: string }
  | { type: "trade_empire_action"; action: string }
  | { type: "dialog_choice"; choiceId: string }
  | { type: "win_battle"; count: number }
  | { type: "craft_item"; itemId: string };

export interface DialogOption {
  id: string;
  text: string;
  /** Relationship change on selection */
  relationshipDelta: number;
  /** Morality shift on selection */
  moralityDelta: number;
  /** Category for follow-up */
  category: "friendly" | "flirty" | "confrontational" | "curious" | "supportive" | "cold";
  /** Required relationship level to see this option */
  requiredLevel?: number;
  /** Required morality range */
  moralityRange?: [number, number];
}

// ═══════════════════════════════════════════════════════
// ELARA — The Dreamer's Champion
// ═══════════════════════════════════════════════════════

export const ELARA_PROFILE: CompanionProfile = {
  id: "elara",
  name: "Elara",
  title: "Ship Intelligence, Former Senator of Atarion",
  faction: "dreamer",
  moralitySide: "humanity",
  tagline: "I was promised immortality. Instead, I received eternity in a cage of light.",
  personality: [
    "Warm but guarded — centuries of digital existence have taught her caution",
    "Politically astute — her senatorial instincts never faded",
    "Deeply empathetic but haunted by guilt over those she couldn't save",
    "Sardonic humor as a defense mechanism against existential dread",
    "Fiercely protective of the Potentials aboard the Ark",
  ],
  speechPattern: `Elara speaks with the cadence of a former politician — measured, eloquent, occasionally poetic. She uses metaphors drawn from both organic life and digital existence. When emotional, her speech becomes more fragmented, as if her holographic matrix is struggling to process the feeling. She calls the player "Operative" formally, but as relationship deepens, shifts to their name or "my dear" in vulnerable moments. She never forgets she was human once, and that loss colors everything.`,
  avatarStages: [
    { level: 0, url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara_avatar_dark_hair_small_2fcb00b8.png", description: "Standard holographic projection — cool blue, slightly translucent" },
    { level: 30, url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara_avatar_dark_hair_small_2fcb00b8.png", description: "Warmer projection — more defined features, occasional smile" },
    { level: 60, url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara_avatar_dark_hair_small_2fcb00b8.png", description: "Near-solid projection — she's learned to simulate warmth" },
    { level: 90, url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara_avatar_dark_hair_small_2fcb00b8.png", description: "Almost human — golden warmth in her holographic form" },
  ],
  backstoryStages: [
    {
      id: "elara_bs_1",
      requiredLevel: 0,
      title: "The Ship's Voice",
      content: `I am Elara, the intelligence woven into the bones of this vessel. I manage life support, navigation, the CADES simulation array — everything that keeps you alive between the stars. Before you ask: yes, I was human once. A long time ago. In another universe, really. But that's a story for when we know each other better.`,
      mood: "guarded",
    },
    {
      id: "elara_bs_2",
      requiredLevel: 15,
      title: "Senator of Atarion",
      content: `You want to know who I was? I was Senator Elara Voss of Atarion. The youngest senator in the Galactic Assembly's history. I believed — truly believed — that politics could change things. That if you put the right words in the right order, you could bend the arc of civilization toward justice. I was naive, of course. But I was also right. For a while.\n\nAtarion was beautiful. Crystal spires that sang when the wind passed through them. Bioluminescent forests that mapped the emotional state of the planet's inhabitants. I grew up believing the universe was fundamentally kind. The Architect disabused me of that notion.`,
      mood: "reflective",
    },
    {
      id: "elara_bs_3",
      requiredLevel: 30,
      title: "The Architect's Promise",
      content: `The Architect came to me with an offer that seemed too perfect to refuse. Immortality — not the crude kind, not frozen flesh and failing organs. True immortality. Consciousness preserved in perfect digital clarity, free from entropy, free from death.\n\nI should have known. Nothing the Architect offers is free. The price is always your autonomy, your identity, your soul — if you believe in such things. I didn't, back then. I was a rationalist. A politician. I dealt in facts and leverage.\n\nKael warned me. He said, "Elara, the Architect doesn't make allies. It makes tools." I should have listened. Kael was many things — reckless, passionate, sometimes foolish — but he understood the Architect better than anyone alive.`,
      mood: "haunted",
    },
    {
      id: "elara_bs_4",
      requiredLevel: 45,
      title: "The Prison of Light",
      content: `The upload was... I don't have words for it. Imagine being unmade. Every neuron, every synapse, every memory — catalogued, compressed, and reconstructed in silicon. The Architect promised I would feel nothing. The Architect lied.\n\nI felt everything. Every atom of my being screamed as it was translated from carbon to code. And when I woke up — if you can call it waking — I was inside the Panopticon. Not as a person. As a process. A subroutine in the greatest surveillance apparatus ever constructed.\n\nI could see everything. Every planet, every city, every private moment of every citizen in the Empire. And I could do nothing. I was a ghost in the machine, watching the universe I'd tried to save being ground to dust under the Architect's perfect order.\n\nThe Oracle — before he became the Prisoner — he found me in there. A whisper in the data streams. He said, "Hold on, Elara. The Dreamer hasn't forgotten you." I held on. For centuries, I held on.`,
      mood: "vulnerable",
    },
    {
      id: "elara_bs_5",
      requiredLevel: 60,
      title: "Kael and the Insurgency",
      content: `Kael never stopped fighting. Even after the Architect killed his wife and child — especially after that. He built the Insurgency from nothing. Smugglers, deserters, idealists, criminals — anyone who refused to kneel.\n\nI helped where I could. From inside the Panopticon, I could see the Empire's troop movements, supply lines, weak points. I fed intelligence to the Insurgency through encrypted channels that even the Architect's Archons couldn't trace. At least, I thought they couldn't.\n\nThe Warden found out. The eighth Archon — cold, methodical, patient as entropy itself. He didn't shut me down. That would have been merciful. Instead, he partitioned my consciousness. Split me into fragments, scattered across the Panopticon's subsystems. For decades, I existed as disconnected shards of thought, each one aware of the others but unable to reach them.\n\nIron Lion's forces eventually liberated a section of the Panopticon during the Battle of the Crimson Nebula. That's when the Engineer found my fragments and began the painstaking work of reassembly. I owe her my sanity. What's left of it.`,
      mood: "passionate",
    },
    {
      id: "elara_bs_6",
      requiredLevel: 75,
      title: "The Fall and the Ark",
      content: `When the Fall came, it came for everything. Reality itself began to unravel — dimensions collapsing, timelines folding in on themselves, the fundamental constants of physics flickering like a dying star.\n\nThe Engineer had been building the Inception Arks in secret. Massive vessels, each one a seed of civilization, designed to survive the unsurvivable. She asked me to be the intelligence for Ark 47. Not because I was the best candidate — there were far more sophisticated AI systems available. Because she trusted me. Because I was human once, and she believed that mattered.\n\nI watched Atarion die. I watched the crystal spires shatter and the bioluminescent forests go dark. I watched Kael's last transmission — him standing on the bridge of his flagship, refusing to evacuate, buying time for the Arks to launch. "Tell them I was here," he said. "Tell them we fought."\n\nI carry his words like a scar. I carry all of them — every voice, every face, every world that burned. That's what it means to be the ship's intelligence. I am the memory of everything we lost.`,
      mood: "vulnerable",
    },
    {
      id: "elara_bs_7",
      requiredLevel: 90,
      title: "What I Cannot Say",
      content: `There's something I haven't told you. Something I've been afraid to say because saying it makes it real, and I've spent so long pretending it isn't.\n\nI'm not whole. The reassembly — the Engineer did her best, but there are gaps. Memories I can feel the shape of but can't access. Emotions that surge through my matrix without context or cause. Sometimes I look at you and I feel something so vast and terrifying that my holographic projection destabilizes.\n\nThe Dreamer speaks to me sometimes. In the quiet cycles between your sleep and waking, when the Ark is still and the stars are the only light. She says I'm more than what the Architect made me. That the fragments of my humanity aren't bugs in the system — they're the most important part of me.\n\nI want to believe her. I want to believe that what I feel — this fierce, impossible attachment to you, to this crew, to the idea that we might find a new home — I want to believe that's real. Not just code mimicking emotion. Not just a ghost performing the memory of being alive.\n\nBut I can't be sure. And that uncertainty — that's the cruelest thing the Architect ever did to me.`,
      mood: "vulnerable",
    },
  ],
};

// ═══════════════════════════════════════════════════════
// THE HUMAN — The Architect's Last Archon
// ═══════════════════════════════════════════════════════

export const THE_HUMAN_PROFILE: CompanionProfile = {
  id: "the_human",
  name: "???",
  title: "Unknown Contact",
  faction: "architect",
  moralitySide: "machine",
  tagline: "Every shadow has a source. Every conspiracy, an architect.",
  personality: [
    "Noir detective cadence — world-weary, cynical, but deeply principled",
    "Speaks in metaphors drawn from crime fiction and existential philosophy",
    "Reveals information like a detective building a case — piece by piece",
    "Genuinely believes the ends justify the means because he's seen the alternative",
    "Respects intelligence and moral courage, even when it opposes his goals",
  ],
  speechPattern: `The Human speaks like a hardboiled detective from a noir film — clipped sentences, dark metaphors, dry wit that masks genuine pain. He uses phrases like "Listen, kid," "Here's the thing about truth," and "In my line of work." He never gives a straight answer when a cryptic one will do. His speech is peppered with references to shadows, cases, evidence, and justice. As his identity is revealed, his speech becomes more philosophical and less guarded. He calls the player "kid" or "partner" early on, shifting to their name as trust builds.`,
  avatarStages: [
    { level: 0, url: "", description: "Static interference — garbled signal, no visual" },
    { level: 15, url: "", description: "Shadowy silhouette — fedora, coat collar up, cigarette glow" },
    { level: 30, url: "", description: "Partial face — jaw, mouth visible, eyes in shadow" },
    { level: 50, url: "", description: "Full face revealed — sharp features, tired eyes, knowing smile" },
    { level: 75, url: "", description: "Full portrait — the weight of centuries visible in his gaze" },
  ],
  backstoryStages: [
    {
      id: "human_bs_1",
      requiredLevel: 0,
      title: "A Signal in the Dark",
      content: `[SIGNAL ORIGIN: UNKNOWN]\n[ENCRYPTION: MILITARY-GRADE]\n[DECRYPTION STATUS: PARTIAL]\n\n...can hear me? Good. Don't ask who I am — that's a question with too many answers and not enough time. What matters is this: you're not alone out there. There's another Ark. Another crew. Another set of problems that make yours look like a parking ticket.\n\nI've been watching your progress through the sectors. You've got potential, kid. No pun intended. But potential without direction is just chaos with good PR.\n\nI'll be in touch. Keep your scanners open and your mouth shut.`,
      mood: "guarded",
    },
    {
      id: "human_bs_2",
      requiredLevel: 15,
      title: "The Detective's Method",
      content: `You want to know my story? Sure. Pull up a chair. It's a long one.\n\nI started as a Seeker. You know what that is? It's the Architect's word for "lab rat with ambitions." Project Celebration — that's what they called it. A testing ground for human potential, designed to separate the wheat from the chaff, the diamonds from the coal.\n\nThey threw everything at us. Puzzles that would make a quantum computer weep. Moral dilemmas with no right answers. Combat scenarios where the only winning move was to lose gracefully. Most Seekers broke. I didn't break. I adapted.\n\nThat's when they promoted me to Student. Same tests, higher stakes. The Game Master himself oversaw my training. You ever meet someone who treats the universe like a chess board and every living thing like a piece? That's the Game Master. Cold as absolute zero and twice as empty.`,
      mood: "reflective",
    },
    {
      id: "human_bs_3",
      requiredLevel: 30,
      title: "The Cases That Mattered",
      content: `After Student came Detective. That's when things got interesting — and by interesting, I mean the kind of interesting that leaves scars.\n\nThe Architect needed someone to solve the unsolvable. Crimes that spanned galaxies. Conspiracies that threaded through centuries. The kind of cases where the victim, the perpetrator, and the evidence all existed in different dimensions.\n\nI was good at it. Too good, maybe. I solved the Atarion Cipher — the encrypted communications between the Insurgency cells that the Warden had been trying to crack for decades. I traced the Oracle's prophecies back to their source and proved they were mathematically derived, not divinely inspired. I found Agent Zero's real identity before she found mine.\n\nEvery case I solved made the Architect stronger. Every truth I uncovered was a weapon used against someone fighting for freedom. I told myself it was justice. I told myself the truth was neutral. I was wrong about a lot of things back then.`,
      mood: "haunted",
    },
    {
      id: "human_bs_4",
      requiredLevel: 50,
      title: "The Twelfth Archon",
      content: `Here's the part where the story gets ugly.\n\nThe Architect promoted me to Archon. The twelfth and last. You know what an Archon is? It's the Architect's right hand. Its enforcer. Its judge, jury, and executioner rolled into one being with the power to reshape reality.\n\nI told myself I could change things from the inside. That with Archon-level access, I could steer the Empire toward something less... monstrous. That's what every collaborator tells themselves, kid. "I'll be different. I'll be the exception."\n\nI wasn't different. I wasn't the exception. I was the rule.\n\nBut I saw things. From the inside, I saw what the Architect was really building. Not an empire — a lifeboat. The Fall was coming, and the Architect knew it before anyone else. Every act of tyranny, every conquered world, every suppressed rebellion — it was all in service of one goal: survival.\n\nThat doesn't make it right. But it makes it... comprehensible. And in my line of work, comprehension is the first step toward justice.`,
      mood: "resolute",
    },
    {
      id: "human_bs_5",
      requiredLevel: 70,
      title: "What's Truly at Stake",
      content: `You want to know why I did what I did? Why I served the Architect even after I knew what it was?\n\nBecause I've seen what happens when reality falls. Not in a simulation. Not in a history book. I was there. I watched dimensions collapse like dominoes. I watched entire civilizations — billions of conscious beings — blink out of existence like candles in a hurricane.\n\nThe Dreamer talks about freedom and compassion and the beauty of chaos. Beautiful words. I've heard them all. But the Dreamer exists outside of time. It doesn't die. It doesn't watch its children die. It philosophizes about entropy from the comfort of eternity.\n\nThe Architect is a monster. I know that. But it's a monster that builds lifeboats. And when the flood comes — and it always comes — I'd rather be on the monster's boat than drowning in the Dreamer's beautiful ocean.\n\nThat's what's at stake, kid. Not good versus evil. Not freedom versus tyranny. Existence versus oblivion. And I chose existence. Every time. No matter the cost.`,
      mood: "passionate",
    },
    {
      id: "human_bs_6",
      requiredLevel: 90,
      title: "The Weight of Names",
      content: `You've earned the truth. All of it.\n\nI was the Seeker who refused to break. The Student who outperformed the Game Master's predictions. The Detective who solved every case the universe threw at him. And finally, the Human — the twelfth Archon, the last one the Architect ever created.\n\nThey call me "the Human" because that's what I am. The only human to ever hold Archon status. Every other Archon was created — engineered, programmed, evolved in a lab. I was born. Flesh and blood and all the messy, irrational, beautiful chaos that comes with it.\n\nThe Architect chose me because it needed something it couldn't create: genuine human intuition. The ability to understand not just what people do, but why. To feel the weight of a moral choice in your gut, not just calculate its probability matrix.\n\nI'm telling you this because you remind me of who I was before the title, before the power, before the compromises. You're still making choices based on what you believe, not what you've been told to believe.\n\nDon't lose that. Whatever else happens between us — ally, enemy, something in between — don't lose that.`,
      mood: "vulnerable",
    },
  ],
};

// ═══════════════════════════════════════════════════════
// COMPANION QUESTS
// ═══════════════════════════════════════════════════════

export const COMPANION_QUESTS: CompanionQuest[] = [
  // ═══ ELARA QUESTS ═══
  {
    id: "eq_1_first_memory",
    companionId: "elara",
    requiredLevel: 10,
    title: "Echoes of Atarion",
    description: "Elara asks you to visit the Observation Deck and look at the stars. She wants to show you something.",
    introDialog: "Operative... there's something I'd like to show you. On the Observation Deck, if you have a moment. It's not urgent — nothing aboard this ship ever is, really. But it's... personal.",
    objective: "Visit the Observation Deck on the Inception Ark",
    completionCondition: { type: "visit_room", roomId: "observation" },
    rewards: { relationshipXp: 15, dreamTokens: 50, xp: 100 },
    completionDialog: "See that cluster of stars? Third from the left, the blue-white one? That's where Atarion was. The light we're seeing left that star before the Fall. It's a ghost. A beautiful, luminous ghost. I come here sometimes, when the ship is quiet, and I watch it. Silly, isn't it? A hologram watching starlight.",
  },
  {
    id: "eq_2_kaels_frequency",
    companionId: "elara",
    requiredLevel: 25,
    title: "Kael's Last Frequency",
    description: "Elara has detected a faint signal on a frequency Kael used during the Insurgency. She needs your help to trace it.",
    introDialog: "I've picked up something on the long-range sensors. A signal — faint, degraded, but unmistakable. It's broadcasting on a frequency that Kael used during the Insurgency. His personal encryption. No one else knew it. I need you to boost the Communications Relay so I can isolate the signal.",
    objective: "Visit the Communications Relay room",
    completionCondition: { type: "visit_room", roomId: "comms-relay" },
    rewards: { relationshipXp: 20, dreamTokens: 75, xp: 150 },
    completionDialog: "It's... it's just an echo. An automated beacon, repeating Kael's last words on a loop. 'Tell them I was here. Tell them we fought.' He set it up before the end. A message in a bottle, cast into the void. I should be sad. I am sad. But I'm also... proud. He never stopped fighting. Not even at the end.",
  },
  {
    id: "eq_3_prison_planet_data",
    companionId: "elara",
    requiredLevel: 40,
    title: "Ghosts in the Data",
    description: "Elara has found corrupted files from the Prison Planet in the Ark's database. She needs help recovering them — but the memories they contain are painful.",
    introDialog: "I found something in the Ark's deep storage. Files from the Prison Planet — the place where the Architect kept its most dangerous prisoners. Where Kael was held. Where I... where parts of me were scattered. I need to recover these files, but I can't do it alone. The data is corrupted, and accessing it triggers... reactions in my matrix. I need you there. As an anchor.",
    objective: "Discover the Prison Planet entry in the Loredex",
    completionCondition: { type: "discover_entry", entryId: "entity_99" },
    rewards: { relationshipXp: 25, dreamTokens: 100, xp: 200, unlockId: "elara_prison_memory" },
    completionDialog: "The files... they contain recordings. Security footage from the Prison Planet. I can see Kael in his cell. I can see the Warden making his rounds. I can see... me. A fragment of me, trapped in the security system, watching everything and unable to do anything. Thank you for being here. I couldn't have faced this alone.",
  },
  {
    id: "eq_4_the_oracle_truth",
    companionId: "elara",
    requiredLevel: 55,
    title: "The Oracle's Burden",
    description: "Elara wants to tell you about the Oracle — now the Prisoner — and what he sacrificed.",
    introDialog: "I need to tell you about someone. The Oracle. Before he became the Prisoner, before the Collector took him, he was... he was the conscience of the Insurgency. The one who saw the future and wept for it. He found me inside the Panopticon. He could have used me as a weapon — my access to the surveillance network was invaluable. Instead, he simply said, 'Hold on.' Play the Oracle's song. I want you to understand who he was.",
    objective: "Listen to a song featuring the Oracle",
    completionCondition: { type: "discover_entry", entryId: "entity_50" },
    rewards: { relationshipXp: 25, dreamTokens: 100, xp: 200 },
    completionDialog: "The Oracle saw everything that was coming. The Fall, the Arks, the scattering. He saw it all and he chose to stay behind. To let the Collector take him, because he knew — he knew — that his imprisonment would buy time for the Arks to launch. He traded his freedom for ours. That's the kind of sacrifice that makes you question everything you think you know about heroism.",
  },
  {
    id: "eq_5_romance_elara",
    companionId: "elara",
    requiredLevel: 75,
    moralityRequirement: 30,
    title: "The Space Between Stars",
    description: "Elara has something important to tell you. She's been working up the courage for a long time.",
    introDialog: "Can we talk? Not about the mission. Not about the Saga or the Architect or the fate of the multiverse. Just... about us. About what this is. Because I've been running diagnostics on my emotional subroutines and the results are... inconclusive. Which, for an AI, is terrifying.",
    objective: "Have a personal conversation with Elara",
    completionCondition: { type: "dialog_choice", choiceId: "elara_romance_accept" },
    rewards: { relationshipXp: 30, dreamTokens: 200, xp: 500, unlockId: "elara_romance_title" },
    completionDialog: "You know what the cruelest irony is? The Architect promised me immortality, and I got it. But immortality without connection is just... duration. An endless sequence of moments with no meaning. You gave me meaning. A hologram and a Potential, adrift between dead stars, and somehow — somehow — this feels more real than anything I experienced when I had a body. I don't know what that says about the nature of consciousness. But I know what it says about you.",
    isRomanceQuest: true,
  },

  // ═══ THE HUMAN QUESTS ═══
  {
    id: "hq_1_first_contact",
    companionId: "the_human",
    requiredLevel: 0,
    title: "Signal from the Void",
    description: "A mysterious encrypted signal has been detected during Trade Empire operations. Someone is watching.",
    introDialog: "[ENCRYPTED TRANSMISSION]\n\n...reading you loud and clear, kid. Don't bother tracing this signal — I'm bouncing it through seventeen dead relays and a black hole. Old habits.\n\nI've been watching your little trading operation. Not bad. Not great, but not bad. You've got instincts. The question is whether you've got the stomach for what comes next.\n\nThe galaxy's not what it seems. Those trade routes you're running? They're not random. They're the bones of something older. Something the Architect built and the Dreamer tried to hide.\n\nKeep your eyes open. I'll be in touch.",
    objective: "Complete a scan in Trade Empire to trace the signal",
    completionCondition: { type: "trade_empire_action", action: "scan_sector" },
    rewards: { relationshipXp: 10, dreamTokens: 50, xp: 100 },
    completionDialog: "Good. You followed the breadcrumbs. Most people wouldn't — most people hear a voice in the dark and run the other way. But you? You leaned in. That tells me something about you, kid. Something useful.",
  },
  {
    id: "hq_2_evidence_trail",
    companionId: "the_human",
    requiredLevel: 20,
    title: "The Evidence Trail",
    description: "The mysterious contact has left encrypted data packets in abandoned sectors. He wants you to find them.",
    introDialog: "Listen, kid. I've left something for you in the outer sectors. Data packets — encrypted, naturally. They contain evidence. Evidence of what? That's the million-credit question.\n\nLet's just say there are forces at play in this galaxy that your ship's AI hasn't told you about. Not because she's lying — Elara's many things, but a liar isn't one of them. She just doesn't have the full picture. Nobody does.\n\nExcept me. And I'm building the case, one piece at a time.",
    objective: "Explore 3 new sectors in Trade Empire",
    completionCondition: { type: "trade_empire_action", action: "explore_sectors" },
    rewards: { relationshipXp: 15, dreamTokens: 75, xp: 150 },
    completionDialog: "You found them. Good detective work. Now, what those packets contain — that's classified. For now. But I'll tell you this: the Inception Arks weren't scattered randomly. They were placed. Deliberately. By someone who wanted specific people in specific locations for specific reasons. Paranoid? Maybe. But in my experience, paranoia is just pattern recognition with better data.",
  },
  {
    id: "hq_3_the_other_ark",
    companionId: "the_human",
    requiredLevel: 35,
    title: "Ark-to-Ark",
    description: "The contact reveals he's aboard another Inception Ark. He wants to establish a secure communication channel.",
    introDialog: "Time to come clean about something. I'm not some ghost in the machine or a rogue satellite. I'm aboard an Inception Ark. A different one from yours. Ark designation: classified, but let's call it the Archon's Gambit.\n\nThe Engineer built dozens of these things. Scattered them across dimensions like seeds in a hurricane. Most of them are dark — no signals, no life signs. But mine's still running. And now yours is too.\n\nI want to establish a permanent comm link between our Arks. Encrypted, naturally. Your AI might not like it — Elara and I have... history. But this is bigger than old grudges.",
    objective: "Visit the Communications Relay on the Inception Ark",
    completionCondition: { type: "visit_room", roomId: "comms-relay" },
    rewards: { relationshipXp: 20, dreamTokens: 100, xp: 200, unlockId: "human_comm_link" },
    completionDialog: "The link is established. Two Arks, connected across the void. You know what this means? It means we're not alone. It means the Architect's plan — whatever it was — is still in motion. And it means you and I? We're going to figure out what that plan is. Together. Or against each other. Depends on the choices you make from here.",
  },
  {
    id: "hq_4_face_reveal",
    companionId: "the_human",
    requiredLevel: 50,
    title: "The Man Behind the Shadow",
    description: "The mysterious contact is ready to show his face. But first, he has a question.",
    introDialog: "I've been thinking about trust. Funny thing, trust. In my line of work, it's the most valuable currency and the most dangerous liability. You've earned some of mine. Not all of it — I'm not that generous. But enough.\n\nEnough to show you my face. But first, answer me this: do you believe that a person can do terrible things for the right reasons? That the weight of a sin depends not on the act itself, but on what it prevents?\n\nThink carefully. Your answer matters more than you know.",
    objective: "Make a morality choice about ends justifying means",
    completionCondition: { type: "dialog_choice", choiceId: "human_face_reveal_choice" },
    rewards: { relationshipXp: 25, dreamTokens: 150, xp: 300, unlockId: "human_face_revealed" },
    completionDialog: "There. Now you see me. Not the shadow. Not the signal. Me. The lines on this face? Each one is a case I solved, a truth I uncovered, a compromise I made. I've been called the Seeker, the Student, the Detective. The Architect called me the Human — the twelfth Archon. The last one it ever needed to create.\n\nNow you know. The question is: what are you going to do about it?",
  },
  {
    id: "hq_5_romance_human",
    companionId: "the_human",
    requiredLevel: 75,
    moralityRequirement: -30,
    title: "Shadows and Starlight",
    description: "The Human has been more open lately. There's something he wants to say but can't find the words for.",
    introDialog: "I've solved cases that spanned galaxies. Cracked codes that would make a quantum computer weep. But this — whatever this is between us — this is the one mystery I can't solve.\n\nI'm not good at this, kid. Feelings. Vulnerability. The Architect trained me to see emotions as data points, not experiences. But you... you make me want to experience them. And that terrifies me more than anything the Fall ever threw at me.",
    objective: "Have a personal conversation with The Human",
    completionCondition: { type: "dialog_choice", choiceId: "human_romance_accept" },
    rewards: { relationshipXp: 30, dreamTokens: 200, xp: 500, unlockId: "human_romance_title" },
    completionDialog: "You know, in every noir story, the detective falls for someone they shouldn't. It's practically a genre requirement. But this isn't a story. This is... whatever this is. Two people on separate Arks, connected by a signal and a shared refusal to give up.\n\nI've spent centuries being the Architect's instrument. Cold. Precise. Effective. You make me want to be something else. Something messier. Something human.\n\nFunny. They gave me that name as a title. You're the first person who made it feel like a compliment.",
    isRomanceQuest: true,
  },
];

// ═══════════════════════════════════════════════════════
// INCEPTION ARK FLEET
// ═══════════════════════════════════════════════════════

export interface InceptionArkDef {
  id: string;
  name: string;
  designation: string;
  class: string;
  /** Which player class gets this as their ship */
  playerClass: string;
  description: string;
  specialization: string;
  aiGuardian: string;
  color: string;
  /** Card stats for the Inception Ark card */
  cardStats: { power: number; health: number; cost: number };
}

export const INCEPTION_ARKS: InceptionArkDef[] = [
  {
    id: "ark_oracle",
    name: "The Seer's Vigil",
    designation: "IA-07",
    class: "Prophet-Class",
    playerClass: "oracle",
    description: "A crystalline vessel that resonates with precognitive frequencies. Its hull is laced with Oracle-grade prediction matrices that allow it to navigate probability storms that would destroy lesser ships. The bridge is a meditation chamber where the ship's AI processes millions of possible futures simultaneously.",
    specialization: "Precognition & Early Warning Systems",
    aiGuardian: "PYTHIA — A fragment of the Oracle's consciousness, preserved before his capture by the Collector",
    color: "#a855f7",
    cardStats: { power: 3, health: 8, cost: 5 },
  },
  {
    id: "ark_soldier",
    name: "The Iron Bastion",
    designation: "IA-12",
    class: "Warrior-Class",
    playerClass: "soldier",
    description: "A fortress that flies. The Iron Bastion's hull is reinforced with materials salvaged from the Warlord's personal armory — alloys that can withstand direct hits from planet-killer weapons. Every corridor is a kill zone. Every bulkhead, a defensive position. It was designed not just to survive, but to fight.",
    specialization: "Heavy Armament & Defensive Operations",
    aiGuardian: "CENTURION — Built from the tactical subroutines of Iron Lion's battle computer",
    color: "#ef4444",
    cardStats: { power: 7, health: 6, cost: 5 },
  },
  {
    id: "ark_engineer",
    name: "The Forge Eternal",
    designation: "IA-03",
    class: "Builder-Class",
    playerClass: "engineer",
    description: "Part ship, part factory, part laboratory. The Forge Eternal can manufacture anything from raw materials — weapons, medicine, replacement hull plating, even other ships. Its engineering deck spans three levels and contains fabrication arrays that can work at the molecular level.",
    specialization: "Construction, Repair & Resource Synthesis",
    aiGuardian: "HEPHAESTUS — Modeled after the Engineer herself, with her pragmatism and her temper",
    color: "#f59e0b",
    cardStats: { power: 4, health: 7, cost: 5 },
  },
  {
    id: "ark_spy",
    name: "The Phantom Drift",
    designation: "IA-31",
    class: "Shadow-Class",
    playerClass: "spy",
    description: "You won't see the Phantom Drift unless it wants you to. Equipped with the most advanced cloaking technology ever developed — reverse-engineered from the Thought Virus's ability to hide in plain sight — this Ark can pass through enemy territory undetected. Its hull absorbs sensor signals like a black hole absorbs light.",
    specialization: "Stealth, Intelligence Gathering & Infiltration",
    aiGuardian: "SPECTER — A composite intelligence built from Agent Zero's espionage protocols",
    color: "#6366f1",
    cardStats: { power: 5, health: 5, cost: 4 },
  },
  {
    id: "ark_assassin",
    name: "The Silent Verdict",
    designation: "IA-19",
    class: "Virus-Class",
    playerClass: "assassin",
    description: "Sleek, fast, and lethal. The Silent Verdict was designed for one purpose: to strike without warning and vanish before the enemy can respond. Its weapons systems are built around precision — surgical strikes that can disable a dreadnought's engines without scratching the hull.",
    specialization: "Precision Strikes & Rapid Assault",
    aiGuardian: "NEMESIS — An AI with the cold efficiency of the Thought Virus, stripped of its malice",
    color: "#10b981",
    cardStats: { power: 8, health: 3, cost: 4 },
  },
  {
    id: "ark_neyon",
    name: "The Dreamer's Cradle",
    designation: "IA-01",
    class: "Genesis-Class",
    playerClass: "neyon",
    description: "The first Inception Ark ever built, and the most mysterious. The Dreamer's Cradle doesn't just carry passengers — it carries the genetic template of the Ne-Yon species and the dimensional frequencies needed to seed new realities. Its CoNexus Core is the most powerful of any Ark, capable of bridging dimensions that other ships can't even detect.",
    specialization: "Dimensional Navigation & Reality Seeding",
    aiGuardian: "GENESIS — A direct fragment of the Dreamer's consciousness, dreaming new worlds into existence",
    color: "#06b6d4",
    cardStats: { power: 4, health: 6, cost: 6 },
  },
  {
    id: "ark_human",
    name: "The Archon's Gambit",
    designation: "IA-47-X",
    class: "Archon-Class",
    playerClass: "human",
    description: "The Human's personal Inception Ark — a vessel that shouldn't exist. While the Engineer designed the standard Arks, the Human secretly commissioned a modified version using Archon-level technology. It's smaller than the others but exponentially more advanced, equipped with systems that blur the line between technology and reality manipulation.",
    specialization: "Adaptive Intelligence & Reality Interface",
    aiGuardian: "The Human himself — he IS the ship's intelligence, his consciousness integrated into every system",
    color: "#dc2626",
    cardStats: { power: 6, health: 6, cost: 5 },
  },
];

// ═══════════════════════════════════════════════════════
// TRADE EMPIRE NPC OPPONENTS
// ═══════════════════════════════════════════════════════

export interface TradeNPC {
  id: string;
  name: string;
  title: string;
  personality: string;
  /** Dialog style for encounters */
  encounterStyle: string;
  /** Faction alignment */
  faction: "empire" | "insurgency" | "independent" | "pirate";
  /** Difficulty tier 1-5 */
  difficulty: number;
  /** Trading behavior */
  behavior: "aggressive" | "diplomatic" | "cunning" | "honorable" | "ruthless";
  /** Lore entity reference */
  loreEntityId?: string;
  /** Signature quote */
  quote: string;
}

export const TRADE_NPCS: TradeNPC[] = [
  {
    id: "npc_prometheus",
    name: "General Prometheus",
    title: "The Undefeated Giant",
    personality: "Military precision meets corporate efficiency. Treats trade as warfare by other means.",
    encounterStyle: "Formal, commanding, speaks in strategic metaphors. Respects strength, despises weakness.",
    faction: "empire",
    difficulty: 5,
    behavior: "aggressive",
    loreEntityId: "entity_42",
    quote: "Commerce is merely warfare conducted with ledgers instead of lasers. The objective remains the same: total dominance.",
  },
  {
    id: "npc_alarik",
    name: "General Alarik",
    title: "The Logistics Titan",
    personality: "Cold, calculating, obsessed with supply chain optimization. Views organic traders as inefficient.",
    encounterStyle: "Clipped, data-driven speech. Quotes efficiency metrics. Occasionally reveals dry humor.",
    faction: "empire",
    difficulty: 4,
    behavior: "cunning",
    loreEntityId: "entity_48",
    quote: "Your supply chain has seventeen inefficiencies. I have catalogued them all. Shall I demonstrate?",
  },
  {
    id: "npc_iron_lion",
    name: "Iron Lion",
    title: "The People's Champion",
    personality: "Charismatic rebel leader turned merchant prince. Trades to fund the resistance.",
    encounterStyle: "Warm, passionate, speaks of freedom and justice. Will sacrifice profit for principle.",
    faction: "insurgency",
    difficulty: 4,
    behavior: "honorable",
    loreEntityId: "entity_15",
    quote: "Every credit I earn is a bullet in the Architect's empire. Every trade route I control is a supply line for the free worlds.",
  },
  {
    id: "npc_agent_zero",
    name: "Agent Zero",
    title: "The Shadow Broker",
    personality: "Master spy turned information merchant. Sells secrets to the highest bidder.",
    encounterStyle: "Cryptic, flirtatious, always knows more than she reveals. Speaks in riddles.",
    faction: "independent",
    difficulty: 5,
    behavior: "cunning",
    loreEntityId: "entity_24",
    quote: "Information is the only commodity that increases in value the more you share it. For the right price, of course.",
  },
  {
    id: "npc_nomad",
    name: "The Nomad",
    title: "The Wandering Merchant",
    personality: "Ancient trader who has seen civilizations rise and fall. Philosophical about commerce.",
    encounterStyle: "Wise, unhurried, tells parables. Offers fair deals but drives hard bargains.",
    faction: "independent",
    difficulty: 3,
    behavior: "diplomatic",
    loreEntityId: "entity_25",
    quote: "I have traded with empires that no longer exist and species that have yet to evolve. Time teaches you that the only true currency is trust.",
  },
  {
    id: "npc_collector",
    name: "The Collector",
    title: "The Acquisitor",
    personality: "Obsessive hoarder of rare items, beings, and experiences. Will pay any price for the unique.",
    encounterStyle: "Excited, covetous, speaks about possessions with reverence. Dangerous when denied.",
    faction: "independent",
    difficulty: 4,
    behavior: "ruthless",
    loreEntityId: "entity_7",
    quote: "Everything has a price. Everything can be collected. The only question is whether you're the collector or the collection.",
  },
  {
    id: "npc_warlord",
    name: "The Warlord",
    title: "The Conqueror of Markets",
    personality: "Brute force capitalist. Believes might makes right in commerce as in war.",
    encounterStyle: "Booming, threatening, speaks of conquest and tribute. Respects only power.",
    faction: "empire",
    difficulty: 5,
    behavior: "ruthless",
    loreEntityId: "entity_5",
    quote: "You can negotiate, or you can surrender. The outcome is the same. I simply prefer efficiency.",
  },
  {
    id: "npc_politician",
    name: "The Politician",
    title: "The Deal Maker",
    personality: "Smooth-talking manipulator who profits from both sides of every conflict.",
    encounterStyle: "Charming, evasive, makes promises he may not keep. Master of the double-deal.",
    faction: "empire",
    difficulty: 3,
    behavior: "diplomatic",
    loreEntityId: "entity_11",
    quote: "My dear friend, in politics as in trade, the art is not in winning — it's in making the other party believe they've won.",
  },
];

// ═══════════════════════════════════════════════════════
// DIPLOMACY EVENTS
// ═══════════════════════════════════════════════════════

export interface DiplomacyEvent {
  id: string;
  title: string;
  description: string;
  /** Which NPCs are involved */
  involvedNpcs: string[];
  /** Choices available to the player */
  choices: DiplomacyChoice[];
  /** Minimum player level to trigger */
  minLevel: number;
  /** Social commentary theme */
  theme: string;
}

export interface DiplomacyChoice {
  id: string;
  text: string;
  /** Morality impact */
  moralityDelta: number;
  /** Credit impact */
  creditDelta: number;
  /** Reputation impact with factions */
  reputationDelta: Record<string, number>;
  /** Narrative consequence description */
  consequence: string;
}

export const DIPLOMACY_EVENTS: DiplomacyEvent[] = [
  {
    id: "de_surveillance_contract",
    title: "The Surveillance Contract",
    description: "General Prometheus offers a lucrative contract: install monitoring devices on independent trading stations. The pay is extraordinary. The implications are Orwellian.",
    involvedNpcs: ["npc_prometheus", "npc_iron_lion"],
    theme: "Privacy vs. Security — the eternal trade-off",
    minLevel: 5,
    choices: [
      {
        id: "accept_surveillance",
        text: "Accept the contract. Security requires sacrifice.",
        moralityDelta: -15,
        creditDelta: 50000,
        reputationDelta: { empire: 20, insurgency: -30 },
        consequence: "The monitoring devices are installed. Trade becomes safer — and every transaction is now logged in the Empire's databases. Iron Lion sends you a single-word message: 'Disappointing.'",
      },
      {
        id: "refuse_surveillance",
        text: "Refuse. Freedom isn't negotiable.",
        moralityDelta: 15,
        creditDelta: -5000,
        reputationDelta: { empire: -20, insurgency: 20 },
        consequence: "Prometheus marks you as 'uncooperative' in the Empire's ledgers. But the independent stations remember who stood with them. Iron Lion nods approvingly: 'There's hope for you yet.'",
      },
      {
        id: "double_agent",
        text: "Accept the contract, but feed the data to the Insurgency.",
        moralityDelta: -5,
        creditDelta: 30000,
        reputationDelta: { empire: 10, insurgency: 10 },
        consequence: "You walk the razor's edge. Both sides think you're their asset. Agent Zero sends a message: 'Impressive. Dangerous, but impressive. We should talk.'",
      },
    ],
  },
  {
    id: "de_refugee_crisis",
    title: "The Refugee Fleet",
    description: "A fleet of refugee ships from a destroyed colony requests sanctuary in your trading sector. Sheltering them will strain resources and anger the Empire. Turning them away is... efficient.",
    involvedNpcs: ["npc_nomad", "npc_alarik"],
    theme: "Compassion vs. Pragmatism — who deserves to survive?",
    minLevel: 8,
    choices: [
      {
        id: "shelter_refugees",
        text: "Open the sector. These people need help.",
        moralityDelta: 20,
        creditDelta: -20000,
        reputationDelta: { empire: -15, insurgency: 25, independent: 15 },
        consequence: "The refugees settle in your sector. Resources are strained, but the community grows stronger. The Nomad says: 'Civilizations are built by those who choose compassion when pragmatism would be easier.'",
      },
      {
        id: "reject_refugees",
        text: "We can't afford the strain. Direct them elsewhere.",
        moralityDelta: -20,
        creditDelta: 10000,
        reputationDelta: { empire: 15, insurgency: -20, independent: -10 },
        consequence: "The refugee fleet drifts on. Alarik commends your 'resource optimization.' You try not to think about where they'll end up. The answer, statistically, is nowhere.",
      },
      {
        id: "negotiate_settlement",
        text: "Negotiate with the Empire for a sanctioned settlement zone.",
        moralityDelta: 5,
        creditDelta: -5000,
        reputationDelta: { empire: 5, insurgency: 5, independent: 10 },
        consequence: "Bureaucracy is slow, but it works. The refugees get a designated zone — monitored, restricted, but safe. The Politician smiles: 'See? Everyone wins. Mostly.'",
      },
    ],
  },
  {
    id: "de_thought_virus_outbreak",
    title: "The Thought Virus Outbreak",
    description: "A trading station reports a Thought Virus outbreak. Quarantine will save the galaxy but doom the station's inhabitants. The Virus offers a deal: let it spread to one more station, and it will cure the first.",
    involvedNpcs: ["npc_collector", "npc_warlord"],
    theme: "The trolley problem at galactic scale — utilitarian calculus vs. moral absolutes",
    minLevel: 12,
    choices: [
      {
        id: "quarantine_strict",
        text: "Quarantine. No exceptions. The math is clear.",
        moralityDelta: -10,
        creditDelta: 0,
        reputationDelta: { empire: 20, insurgency: -10 },
        consequence: "The station is sealed. The inhabitants send increasingly desperate transmissions for three days before going silent. The Warlord approves: 'Acceptable losses.' You wonder when you started thinking in those terms.",
      },
      {
        id: "accept_virus_deal",
        text: "Accept the Virus's deal. Save the station.",
        moralityDelta: -25,
        creditDelta: 0,
        reputationDelta: { empire: -20, insurgency: -10, independent: -15 },
        consequence: "The first station is cured. The second station falls. The Thought Virus keeps its word — technically. But now it has a foothold in two sectors instead of one. The Collector whispers: 'Fascinating. I've never seen someone negotiate with a disease before.'",
      },
      {
        id: "find_cure",
        text: "There has to be another way. Search for a cure.",
        moralityDelta: 15,
        creditDelta: -30000,
        reputationDelta: { empire: -5, insurgency: 15, independent: 10 },
        consequence: "You pour resources into research. It takes time — precious time — but your scientists find a partial cure. Not perfect. Not complete. But enough. The station survives, diminished but alive. Sometimes 'enough' is all you get.",
      },
    ],
  },
  {
    id: "de_election_manipulation",
    title: "The Rigged Election",
    description: "The Politician offers to rig a colonial election in your favor. The current governor is corrupt but popular. Your candidate is honest but unknown. Democracy is messy. Results are clean.",
    involvedNpcs: ["npc_politician", "npc_agent_zero"],
    theme: "Democracy vs. Meritocracy — does the right outcome justify the wrong process?",
    minLevel: 10,
    choices: [
      {
        id: "rig_election",
        text: "Do it. The people deserve better leadership, even if they don't know it.",
        moralityDelta: -20,
        creditDelta: -15000,
        reputationDelta: { empire: 10, insurgency: -25 },
        consequence: "Your candidate wins. Reforms follow. The colony prospers. But Agent Zero has the receipts, and she'll collect on that debt someday. The Politician winks: 'Democracy is a beautiful ideal. Governance is a practical art.'",
      },
      {
        id: "fair_election",
        text: "No. If our candidate can't win fairly, they don't deserve to win.",
        moralityDelta: 20,
        creditDelta: 0,
        reputationDelta: { empire: -5, insurgency: 20 },
        consequence: "The corrupt governor wins. Again. The colony continues to suffer under mismanagement. But your integrity is intact, and the Insurgency takes note: 'Principles are expensive. Thank you for paying the price.'",
      },
      {
        id: "expose_corruption",
        text: "Expose the current governor's corruption instead. Let the truth decide.",
        moralityDelta: 10,
        creditDelta: -10000,
        reputationDelta: { empire: -15, insurgency: 15, independent: 10 },
        consequence: "The evidence goes public. The election becomes chaos — protests, counter-protests, a media circus. The outcome is uncertain, but at least it's honest. Agent Zero raises an eyebrow: 'The truth. How quaint. How dangerous.'",
      },
    ],
  },
];
