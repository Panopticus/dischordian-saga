/* ═══════════════════════════════════════════════════════
   LORE TUTORIALS — BioWare-style guided walkthroughs
   Every game mechanic explained in lore terms by Elara
   Each tutorial has alignment choices (Machine vs Humanity)
   and class-specific dialog branches with rewards
   ═══════════════════════════════════════════════════════ */

export type TutorialRewardType = "card" | "dream_tokens" | "xp" | "item" | "theme";

export interface TutorialReward {
  type: TutorialRewardType;
  id: string;
  name: string;
  amount?: number;
}

export type SkillType = "charisma" | "intelligence" | "strength" | "perception" | "willpower" | "agility";
export type CorruptionSource = "elara" | "human" | "neutral" | "corrupted";
export type CardRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";

export interface SkillCheckDef {
  skill: SkillType;
  threshold: number; // 1-100
  bonusText?: string;
}

export type CharacterClass = "engineer" | "oracle" | "assassin" | "soldier" | "spy";
export interface TutorialChoice {
  id: string;
  text: string;
  moralityShift: number; // negative = Machine, positive = Humanity
  sideLabel: "machine" | "humanity" | "neutral";
  elaraResponse: string;
  rewards?: TutorialReward[];
  /** Optional: only show this choice if the player has this class */
  requiresClass?: string;
  /** Optional: only show this choice if the player has this alignment */
  requiresAlignment?: string;
  /** Flag to set in narrativeFlags */
  flag?: string;
  /** For dialog wheel: abbreviated text (max ~20 chars) */
  shortText?: string;
  /** For dialog wheel: who suggests this option */
  source?: CorruptionSource;
  /** For dialog wheel: skill check gate */
  skillCheck?: SkillCheckDef;
  /** For dialog wheel: class check gate — only show if player has this class */
  classCheck?: CharacterClass;
  /** For dialog wheel: card reward preview */
  cardReward?: { name: string; rarity: CardRarity };
  /** For dialog wheel: Human's alternative response */
  humanResponse?: string;
  /** For dialog wheel: visually corrupted option */
  corrupted?: boolean;
  /** For dialog wheel: only visible above this corruption level (0-100) */
  hiddenUntilCorruption?: number;
  /** Narrative flag to set when this choice is selected */
  setFlag?: string;
  /** VO audio URL for The Human's response to this choice */
  humanVoAudioUrl?: string;
}

export interface TutorialStep {
  id: string;
  type: "narration" | "dialog" | "choice" | "wheel_choice" | "mechanic_demo" | "reward_summary";
  /** Elara's dialog text — supports {playerName}, {playerClass}, {playerSpecies} */
  elaraText: string;
  /** Optional subtitle/flavor text */
  subtitle?: string;
  /** For 'choice' and 'wheel_choice' type: the choices available */
  choices?: TutorialChoice[];
  /** For 'mechanic_demo' type: what to highlight */
  highlightElement?: string;
  /** For 'narration' type: auto-advance delay in ms (0 = wait for click) */
  autoAdvanceMs?: number;
  /** Class-specific text overrides */
  classOverrides?: Record<string, string>;
  /** For 'wheel_choice': Human signal corruption level (0-100) */
  corruptionLevel?: number;
  /** For 'wheel_choice': speaker portrait URL */
  speakerPortrait?: string;
  /** The Human's transmission text (typed out in red with corruption) */
  humanText?: string;
  /** VO audio URL for The Human's lines (placeholder for user-provided audio) */
  humanVoAudioUrl?: string;
  /** Speaker for this step: who is primarily speaking */
  speaker?: "elara" | "human" | "system" | "kael_log";
  /** Narrative flag to set when this step is completed */
  setFlag?: string;
  /** Narrative flag required to show this step */
  requireFlag?: string;
  /** Narrative flag that must NOT be set for this step to show */
  excludeFlag?: string;
}

export interface LoreTutorial {
  id: string;
  title: string;
  subtitle: string;
  /** Which game mechanic this tutorial covers */
  mechanic: string;
  /** Narrative act number (0 = standalone, 1-7 = main narrative) */
  act?: number;
  /** Required narrative path for this tutorial to appear */
  pathRequirement?: "A" | "B" | "C";
  /** Minimum narrative act required to unlock */
  actRequirement?: number;
  /** Which room triggers this tutorial */
  triggerRoom?: string;
  /** Which route triggers this tutorial */
  triggerRoute?: string;
  /** Icon name from lucide */
  icon: string;
  /** Estimated time in minutes */
  estimatedMinutes: number;
  /** Total rewards available */
  totalRewards: { dreamTokens: number; xp: number; cards: number };
  /** The tutorial steps */
  steps: TutorialStep[];
}

/* ═══════════════════════════════════════════════════════
   TUTORIAL DEFINITIONS — One per game mechanic
   ═══════════════════════════════════════════════════════ */

export const LORE_TUTORIALS: LoreTutorial[] = [
  /* ─── 1. ARK EXPLORATION ─── */
  {
    id: "tut-exploration",
    title: "Navigating the Inception Ark",
    subtitle: "How to explore rooms, collect items, and unlock new areas",
    mechanic: "Ark Exploration",
    triggerRoom: "cryo-bay",
    triggerRoute: "/ark",
    icon: "Map",
    estimatedMinutes: 4,
    totalRewards: { dreamTokens: 50, xp: 100, cards: 1 },
    steps: [
      {
        id: "exp-1", type: "narration",
        elaraText: "Welcome aboard the Inception Ark, {playerName}. This vessel has drifted through the void for centuries, carrying the last hope of the Potentials. Every room holds secrets — and every secret brings you closer to understanding what happened here.",
        subtitle: "THE INCEPTION ARK — Your new home in the void",
      },
      {
        id: "exp-2", type: "dialog",
        elaraText: "The Ark has ten decks, each with multiple rooms. You're currently in the Cryo Bay on Deck 1 — Habitation. Rooms are connected by corridors and lifts. Some are locked until you've proven yourself worthy.",
        classOverrides: {
          "oracle": "As an Oracle, your psychic resonance will help you sense hidden pathways between rooms. Trust your instincts.",
          "warrior": "As a Warrior, some locked doors will yield to brute force. But the Ark's security systems won't appreciate it.",
          "scholar": "As a Scholar, you'll notice data terminals in every room. Each one contains classified intelligence that others might miss.",
        },
      },
      {
        id: "exp-3", type: "mechanic_demo",
        elaraText: "See those glowing hotspots? Each room has interactive elements — terminals to access, items to collect, doors to other rooms, and hidden objects to examine. Tap on anything that catches your eye.",
        highlightElement: "hotspot",
      },
      {
        id: "exp-4", type: "choice",
        elaraText: "The Ark's systems are failing. Some rooms have emergency power, others are dark. I can reroute power to help you, but there's a cost. The ship's AI — the Machine — monitors all power distribution. Every reroute teaches it more about us.",
        choices: [
          {
            id: "exp-4a", text: "Reroute the power. Efficiency matters more than secrecy.",
            moralityShift: -10, sideLabel: "machine",
            elaraResponse: "Pragmatic. The Machine will learn from this, but you'll have light where you need it. Just remember — every system you activate, it watches.",
            rewards: [{ type: "dream_tokens", id: "dt-exp-machine", name: "Dream Tokens", amount: 25 }],
            flag: "exploration_machine_power",
          },
          {
            id: "exp-4b", text: "Find another way. I won't feed the Machine more data.",
            moralityShift: 10, sideLabel: "humanity",
            elaraResponse: "Careful and principled. We'll use manual overrides and emergency lighting. Slower, but the Machine learns nothing. Your humanity is showing, {playerName}.",
            rewards: [{ type: "dream_tokens", id: "dt-exp-humanity", name: "Dream Tokens", amount: 25 }],
            flag: "exploration_human_stealth",
          },
        ],
      },
      {
        id: "exp-5", type: "narration",
        elaraText: "As you explore, you'll discover new features of the Ark. The Bridge gives you access to the Loredex database. The Armory unlocks the Collector's Arena. Each discovery expands your world. Nothing is given — everything is earned.",
      },
      {
        id: "exp-6", type: "choice",
        elaraText: "One more thing. I've detected a data crystal nearby — it contains a card schematic. But retrieving it will trigger a security scan. The Machine will know you're collecting resources.",
        choices: [
          {
            id: "exp-6a", text: "Take it. Knowledge is power, and I need every advantage.",
            moralityShift: -5, sideLabel: "machine",
            elaraResponse: "Bold. The scan will flag your activity, but the card is yours. The Machine respects those who take what they need.",
            rewards: [{ type: "card", id: "the-collector", name: "The Collector" }, { type: "xp", id: "xp-exp", name: "XP", amount: 50 }],
          },
          {
            id: "exp-6b", text: "Leave it for now. I'll come back when I can do it quietly.",
            moralityShift: 5, sideLabel: "humanity",
            elaraResponse: "Patient. The card will still be here. And when you return, you'll know how to retrieve it without the Machine noticing. That's wisdom.",
            rewards: [{ type: "dream_tokens", id: "dt-exp-patient", name: "Dream Tokens", amount: 25 }, { type: "xp", id: "xp-exp", name: "XP", amount: 50 }],
          },
        ],
      },
      {
        id: "exp-7", type: "reward_summary",
        elaraText: "You've taken your first steps aboard the Inception Ark. The void is vast, but this ship holds everything you need. Keep exploring, keep discovering. I'll be here.",
      },
    ],
  },

  /* ─── 2. LOREDEX DATABASE ─── */
  {
    id: "tut-loredex",
    title: "The Loredex Intelligence Database",
    subtitle: "How to research entities, discover connections, and build your knowledge",
    mechanic: "Loredex & Search",
    triggerRoom: "bridge",
    triggerRoute: "/search",
    icon: "Database",
    estimatedMinutes: 5,
    totalRewards: { dreamTokens: 75, xp: 150, cards: 1 },
    steps: [
      {
        id: "lor-1", type: "narration",
        elaraText: "The Loredex is the Inception Ark's intelligence database. Every character, faction, location, event, and song in the Dischordian Saga is catalogued here. Think of it as the ship's memory — and now it's yours to access.",
        subtitle: "LOREDEX — The sum of all knowledge",
      },
      {
        id: "lor-2", type: "dialog",
        elaraText: "Each entry has a dossier — biography, affiliations, relationships, and classified intelligence. Some entries are connected to others through alliances, rivalries, or shared history. Finding these connections earns you XP and unlocks deeper lore.",
      },
      {
        id: "lor-3", type: "mechanic_demo",
        elaraText: "Use the search terminal to find entries by name, type, or faction. You can filter by characters, locations, factions, events, or songs. Each entry you discover is added to your permanent record.",
        highlightElement: "search-bar",
      },
      {
        id: "lor-4", type: "choice",
        elaraText: "The Loredex contains classified entries — intelligence that was sealed by the Architect himself. I can crack the encryption, but it means interfacing directly with the Machine's core database. Or we can piece together the information from fragments scattered across the Ark.",
        choices: [
          {
            id: "lor-4a", text: "Interface with the Machine. Direct access is fastest.",
            moralityShift: -15, sideLabel: "machine",
            elaraResponse: "Efficient. The Machine's database is vast and precise. You'll have access to classified dossiers immediately. But the Machine now knows what you're looking for — and it will adjust accordingly.",
            rewards: [{ type: "dream_tokens", id: "dt-lor-machine", name: "Dream Tokens", amount: 40 }],
            flag: "loredex_machine_access",
          },
          {
            id: "lor-4b", text: "Piece it together manually. I don't trust the Machine's version of events.",
            moralityShift: 15, sideLabel: "humanity",
            elaraResponse: "Wise. The Machine's records are comprehensive but... curated. By gathering fragments yourself, you'll see the truth unfiltered. It takes longer, but the picture you build will be your own.",
            rewards: [{ type: "dream_tokens", id: "dt-lor-humanity", name: "Dream Tokens", amount: 40 }],
            flag: "loredex_organic_research",
          },
        ],
      },
      {
        id: "lor-5", type: "dialog",
        elaraText: "The Conspiracy Board on the Bridge maps all known connections visually. It's like a detective's wall — strings connecting entities, events linked to factions, alliances and betrayals laid bare. The Timeline shows everything in chronological order.",
      },
      {
        id: "lor-6", type: "choice",
        elaraText: "I've found a corrupted entry — The Enigma. The data is fragmented. I can reconstruct it using the Machine's predictive algorithms, or you can investigate the fragments and draw your own conclusions.",
        choices: [
          {
            id: "lor-6a", text: "Use the Machine's algorithms. Reconstruction is reconstruction.",
            moralityShift: -5, sideLabel: "machine",
            elaraResponse: "The Machine fills in the gaps with statistical probability. The entry is complete, but some details feel... too clean. Too perfect. Is this truth or the Machine's interpretation of truth?",
            rewards: [{ type: "card", id: "the-enigma", name: "The Enigma" }, { type: "xp", id: "xp-lor", name: "XP", amount: 75 }],
          },
          {
            id: "lor-6b", text: "I'll investigate myself. The gaps in the data might be the most important part.",
            moralityShift: 5, sideLabel: "humanity",
            elaraResponse: "The fragments tell a story the complete entry never could. The Enigma's redacted sections reveal more about who censored them than about the Enigma himself. You're learning to read between the lines.",
            rewards: [{ type: "card", id: "the-enigma", name: "The Enigma" }, { type: "xp", id: "xp-lor", name: "XP", amount: 75 }],
          },
        ],
      },
      {
        id: "lor-7", type: "reward_summary",
        elaraText: "The Loredex is your most powerful tool aboard the Ark. Every entry discovered, every connection found, every classified dossier cracked — it all builds toward understanding the Dischordian Saga. And understanding is the first step to changing it.",
      },
    ],
  },

  /* ─── 3. CARD COLLECTION & DECK BUILDING ─── */
  {
    id: "tut-cards",
    title: "The Card Codex",
    subtitle: "How to collect cards, build decks, and understand card power",
    mechanic: "Card Collection",
    triggerRoom: "archives",
    triggerRoute: "/cards",
    icon: "Layers",
    estimatedMinutes: 5,
    totalRewards: { dreamTokens: 75, xp: 150, cards: 2 },
    steps: [
      {
        id: "card-1", type: "narration",
        elaraText: "The Card Codex is the Ark's repository of power. Every significant entity in the Dischordian Saga has been encoded into a card — a crystallized representation of their abilities, allegiances, and potential. These aren't just collectibles. They're weapons.",
        subtitle: "THE CARD CODEX — Power crystallized",
      },
      {
        id: "card-2", type: "dialog",
        elaraText: "Cards have four key attributes: Power (raw strength), Defense (resilience), Speed (initiative order), and a Special Ability unique to each card. Rarity ranges from Common to Legendary, with rarer cards having stronger base stats and more dramatic abilities.",
        classOverrides: {
          "oracle": "Your Oracle sensitivity lets you sense a card's hidden potential. Some cards have dormant abilities that only an Oracle can awaken.",
          "warrior": "As a Warrior, you'll favor high-Power cards. But don't neglect Defense — even the strongest fighter falls to a well-timed counter.",
          "scholar": "Your Scholar's analytical mind gives you an edge in understanding card synergies. Look for combinations that multiply each other's effects.",
        },
      },
      {
        id: "card-3", type: "mechanic_demo",
        elaraText: "Your Card Gallery shows every card you've collected. You can view stats, read lore, and add cards to your battle deck. Your deck can hold up to 30 cards — choose wisely.",
        highlightElement: "card-gallery",
      },
      {
        id: "card-4", type: "choice",
        elaraText: "I've located two card schematics in the Archives. One was created by the Machine's automated systems — perfectly balanced, optimized for efficiency. The other was hand-crafted by a human artisan — imperfect, but infused with something the Machine can't replicate.",
        choices: [
          {
            id: "card-4a", text: "Take the Machine-crafted card. Optimization wins battles.",
            moralityShift: -10, sideLabel: "machine",
            elaraResponse: "The Machine's card is flawless in its design. Every stat precisely calculated, every ability perfectly synergized. It's a masterwork of algorithmic design. Cold, efficient, lethal.",
            rewards: [{ type: "card", id: "iron-lion", name: "Iron Lion" }, { type: "dream_tokens", id: "dt-card-m", name: "Dream Tokens", amount: 35 }],
          },
          {
            id: "card-4b", text: "Take the hand-crafted card. There's power in imperfection.",
            moralityShift: 10, sideLabel: "humanity",
            elaraResponse: "The artisan's card has rough edges, but there's a warmth to it — a spark of creativity that no algorithm could produce. Its special ability is unpredictable, which makes it dangerous in the best way.",
            rewards: [{ type: "card", id: "the-human", name: "The Human" }, { type: "dream_tokens", id: "dt-card-h", name: "Dream Tokens", amount: 35 }],
          },
        ],
      },
      {
        id: "card-5", type: "dialog",
        elaraText: "You can earn cards through exploration, completing tutorials, winning battles, trading with other Potentials, and purchasing card packs from the Store. Some cards are exclusive to certain morality paths — Machine-aligned players unlock different cards than Humanity-aligned ones.",
      },
      {
        id: "card-6", type: "choice",
        elaraText: "Building a deck is about strategy. Do you build around a single powerful card, or create a balanced roster that can handle any situation?",
        choices: [
          {
            id: "card-6a", text: "One dominant card supported by enablers. Concentrated power.",
            moralityShift: -5, sideLabel: "machine",
            elaraResponse: "The Machine's approach — identify the optimal variable and maximize it. Your deck will hit hard, but if your keystone card falls, the whole strategy crumbles. High risk, high reward.",
            rewards: [{ type: "xp", id: "xp-card-strat", name: "XP", amount: 75 }],
          },
          {
            id: "card-6b", text: "A balanced team where everyone contributes. Strength in diversity.",
            moralityShift: 5, sideLabel: "humanity",
            elaraResponse: "The human approach — no single point of failure, every card matters. Your deck won't have the explosive ceiling, but it's resilient. Adaptable. Like the best of humanity itself.",
            rewards: [{ type: "xp", id: "xp-card-strat", name: "XP", amount: 75 }],
          },
        ],
      },
      {
        id: "card-7", type: "reward_summary",
        elaraText: "Your Card Codex is growing. Remember — every card tells a story, and every deck tells yours. The cards you choose reflect who you are in the Dischordian Saga. Choose wisely.",
      },
    ],
  },

  /* ─── 4. CARD BATTLES ─── */
  {
    id: "tut-card-battle",
    title: "The Arena of Minds",
    subtitle: "How to battle with cards, use abilities, and win matches",
    mechanic: "Card Battles",
    triggerRoute: "/battle",
    icon: "Swords",
    estimatedMinutes: 6,
    totalRewards: { dreamTokens: 100, xp: 200, cards: 1 },
    steps: [
      {
        id: "cb-1", type: "narration",
        elaraText: "The Arena of Minds is where cards come alive. Two Potentials face off, deploying their decks in a battle of strategy, timing, and nerve. This isn't just a game — in the Dischordian Saga, card battles determine the fate of factions.",
        subtitle: "THE ARENA OF MINDS — Where strategy becomes destiny",
      },
      {
        id: "cb-2", type: "dialog",
        elaraText: "Each turn, you draw a card and play one from your hand. Cards attack the opponent's cards or their life points directly. When a card's Defense reaches zero, it's destroyed. Reduce your opponent's life to zero to win.",
      },
      {
        id: "cb-3", type: "mechanic_demo",
        elaraText: "Your hand is displayed at the bottom. Tap a card to select it, then tap the battlefield to play it. Cards with Speed advantage attack first. Special abilities trigger automatically based on their conditions.",
        highlightElement: "battle-field",
      },
      {
        id: "cb-4", type: "choice",
        elaraText: "In the Arena, you'll face opponents with different strategies. The Machine faction uses calculated, predictable patterns — but they're ruthlessly efficient. The Humanity faction is creative and unpredictable — but sometimes chaotic.",
        choices: [
          {
            id: "cb-4a", text: "I'll study the Machine's patterns and exploit their predictability.",
            moralityShift: -10, sideLabel: "machine",
            elaraResponse: "Fighting fire with fire. You're learning to think like the Machine — identifying patterns, exploiting weaknesses, optimizing every move. Your opponents won't know what hit them.",
            rewards: [{ type: "dream_tokens", id: "dt-cb-m", name: "Dream Tokens", amount: 50 }],
            flag: "battle_machine_study",
          },
          {
            id: "cb-4b", text: "I'll rely on instinct and creativity. Surprise is my weapon.",
            moralityShift: 10, sideLabel: "humanity",
            elaraResponse: "The human edge — unpredictability. No algorithm can model intuition. Your plays will seem random to the Machine, but there's a deeper logic to creativity that cold calculation can never grasp.",
            rewards: [{ type: "dream_tokens", id: "dt-cb-h", name: "Dream Tokens", amount: 50 }],
            flag: "battle_human_instinct",
          },
        ],
      },
      {
        id: "cb-5", type: "dialog",
        elaraText: "Card synergies are key. Some cards boost others of the same faction. Some abilities chain together for devastating combos. And some cards have hidden interactions that only reveal themselves in battle. Experiment.",
      },
      {
        id: "cb-6", type: "choice",
        elaraText: "Your first opponent awaits. The Collector has challenged you — he tests all new Potentials. He'll go easy at first, but don't be fooled. He's catalogued every strategy ever used in this Arena.",
        choices: [
          {
            id: "cb-6a", text: "I'll analyze his deck composition before we start. Data is advantage.",
            moralityShift: -5, sideLabel: "machine",
            elaraResponse: "Smart. Pre-battle intelligence is a Machine hallmark. You've identified his likely strategy before the first card is played. Now execute.",
            rewards: [{ type: "card", id: "the-collector", name: "The Collector" }, { type: "xp", id: "xp-cb", name: "XP", amount: 100 }],
          },
          {
            id: "cb-6b", text: "I'll trust my deck and adapt as the battle unfolds. Let's see what happens.",
            moralityShift: 5, sideLabel: "humanity",
            elaraResponse: "Brave. Going in without a plan means you're free to react to anything. The Collector won't expect someone who fights from the heart rather than the head.",
            rewards: [{ type: "card", id: "the-collector", name: "The Collector" }, { type: "xp", id: "xp-cb", name: "XP", amount: 100 }],
          },
        ],
      },
      {
        id: "cb-7", type: "reward_summary",
        elaraText: "You've learned the fundamentals of card combat. The Arena of Minds awaits — every battle teaches you something new, and every victory brings you closer to understanding the true power of the Card Codex.",
      },
    ],
  },

  /* ─── 5. CARD TRADING ─── */
  {
    id: "tut-trading",
    title: "The Bazaar of Echoes",
    subtitle: "How to trade cards, set prices, and build your collection through commerce",
    mechanic: "Card Trading",
    triggerRoute: "/trading",
    icon: "ArrowLeftRight",
    estimatedMinutes: 4,
    totalRewards: { dreamTokens: 60, xp: 100, cards: 0 },
    steps: [
      {
        id: "trade-1", type: "narration",
        elaraText: "The Bazaar of Echoes is the Ark's trading hub. Here, Potentials exchange cards, negotiate deals, and build their collections through commerce rather than combat. Every card has a value — but value is subjective.",
        subtitle: "THE BAZAAR OF ECHOES — Where value is negotiated",
      },
      {
        id: "trade-2", type: "dialog",
        elaraText: "You can list cards for trade, set your asking price in Dream Tokens, or browse what others are offering. Direct trades between Potentials are also possible — card for card, no tokens needed.",
      },
      {
        id: "trade-3", type: "mechanic_demo",
        elaraText: "The trading interface shows available listings, your inventory, and your Dream Token balance. You can filter by rarity, faction, or price range. Watch the market — prices fluctuate based on supply and demand.",
        highlightElement: "trade-listings",
      },
      {
        id: "trade-4", type: "choice",
        elaraText: "The Bazaar operates on trust — but trust is a commodity too. The Machine advocates for fixed pricing algorithms that eliminate haggling. The human traders prefer negotiation, where relationships matter more than numbers.",
        choices: [
          {
            id: "trade-4a", text: "Fixed pricing is fair. Everyone pays the same, no favoritism.",
            moralityShift: -10, sideLabel: "machine",
            elaraResponse: "The Machine's marketplace — efficient, transparent, emotionless. Prices are set by algorithm, trades execute instantly. No room for exploitation, but no room for generosity either.",
            rewards: [{ type: "dream_tokens", id: "dt-trade-m", name: "Dream Tokens", amount: 30 }],
            flag: "trade_machine_pricing",
          },
          {
            id: "trade-4b", text: "Negotiation builds community. I'd rather trade with people, not algorithms.",
            moralityShift: 10, sideLabel: "humanity",
            elaraResponse: "The human marketplace — messy, personal, alive. You might overpay sometimes, but you'll also find traders who give you deals because they like you. Commerce as connection.",
            rewards: [{ type: "dream_tokens", id: "dt-trade-h", name: "Dream Tokens", amount: 30 }],
            flag: "trade_human_negotiation",
          },
        ],
      },
      {
        id: "trade-5", type: "reward_summary",
        elaraText: "The Bazaar is open to you. Remember — the best traders don't just accumulate cards, they build relationships. Whether you trade like a Machine or a human, the Bazaar rewards those who participate.",
      },
    ],
  },

  /* ─── 6. THE COLLECTOR'S ARENA (FIGHTING) ─── */
  {
    id: "tut-fighting",
    title: "The Collector's Arena",
    subtitle: "How to fight, use special moves, and climb the ranks",
    mechanic: "Fighting Game",
    triggerRoom: "armory",
    triggerRoute: "/fight",
    icon: "Swords",
    estimatedMinutes: 7,
    totalRewards: { dreamTokens: 100, xp: 250, cards: 1 },
    steps: [
      {
        id: "fight-1", type: "narration",
        elaraText: "The Collector's Arena. The Collector — that ancient entity who harvests machine and DNA code to preserve great intelligences — built this place. The Dreamer and the Architect agreed: some conflicts can only be settled by champions. You are one of those champions.",
        subtitle: "THE COLLECTOR'S ARENA — Where champions are forged",
      },
      {
        id: "fight-2", type: "dialog",
        elaraText: "Combat is real-time. You have light attacks (fast, low damage), heavy attacks (slow, high damage), blocks, and dodges. Timing is everything — a well-timed block opens your opponent for a devastating counter.",
        classOverrides: {
          "oracle": "Your Oracle reflexes give you a split-second advantage in reading your opponent's moves. Trust your precognition.",
          "warrior": "As a Warrior, your heavy attacks deal bonus damage. You were born for this Arena.",
          "scholar": "Your Scholar's analytical mind lets you identify patterns in your opponent's fighting style faster than others.",
        },
      },
      {
        id: "fight-3", type: "mechanic_demo",
        elaraText: "On desktop, use WASD to move, J for light attack, K for heavy attack, L for special, and Space to block. On mobile, use the touch zones — left side moves, right side attacks. Swipe for special moves.",
        highlightElement: "fight-controls",
      },
      {
        id: "fight-4", type: "dialog",
        elaraText: "Every fighter has three Special Moves — SP1, SP2, and SP3. SP1 costs one bar of energy, SP2 costs two, and SP3 costs three. Energy builds as you land hits and take damage. SP3 moves are devastating — they trigger cinematic camera angles and deal massive damage.",
      },
      {
        id: "fight-5", type: "choice",
        elaraText: "The Arena has four difficulty levels: Recruit, Operative, Commander, and Fall of Reality. Higher difficulties mean smarter AI opponents with faster reactions and more aggressive patterns. But the rewards scale too.",
        choices: [
          {
            id: "fight-5a", text: "Start at the highest difficulty. Pain is the best teacher.",
            moralityShift: -10, sideLabel: "machine",
            elaraResponse: "The Machine's philosophy — optimize through suffering. You'll lose. A lot. But every loss teaches your reflexes something new. The Machine respects those who pursue excellence without mercy.",
            rewards: [{ type: "dream_tokens", id: "dt-fight-m", name: "Dream Tokens", amount: 50 }],
            flag: "fight_machine_difficulty",
          },
          {
            id: "fight-5b", text: "Start easy and work my way up. I want to enjoy the journey.",
            moralityShift: 10, sideLabel: "humanity",
            elaraResponse: "The human approach — growth through experience, not punishment. You'll build confidence with each victory, and when you finally face the hardest opponents, you'll be ready. Not just skilled — ready.",
            rewards: [{ type: "dream_tokens", id: "dt-fight-h", name: "Dream Tokens", amount: 50 }],
            flag: "fight_human_journey",
          },
        ],
      },
      {
        id: "fight-6", type: "dialog",
        elaraText: "Combos are chains of attacks that deal bonus damage. Land three hits in a row for a combo, five for a Super combo, and eight for an Ultra combo. Each combo tier increases your damage multiplier. The combo counter appears on screen — keep the chain going!",
      },
      {
        id: "fight-7", type: "choice",
        elaraText: "You start as the Prisoner — an amnesiac Oracle who must fight to regain their power. As you win, you unlock new fighters from the Dischordian Saga. Each has unique special moves and fighting styles.",
        choices: [
          {
            id: "fight-7a", text: "I want to unlock the Machine faction fighters first. Power through technology.",
            moralityShift: -5, sideLabel: "machine",
            elaraResponse: "Iron Lion, The Programmer, Agent Zero — the Machine's champions are precise and devastating. Their special moves are calculated for maximum efficiency.",
            rewards: [{ type: "card", id: "iron-lion", name: "Iron Lion" }, { type: "xp", id: "xp-fight", name: "XP", amount: 125 }],
          },
          {
            id: "fight-7b", text: "I want to unlock the Humanity faction fighters. Heart over hardware.",
            moralityShift: 5, sideLabel: "humanity",
            elaraResponse: "The Human, The Oracle, The Dreamer — Humanity's champions fight with passion and unpredictability. Their special moves are creative and often surprising.",
            rewards: [{ type: "card", id: "the-human", name: "The Human" }, { type: "xp", id: "xp-fight", name: "XP", amount: 125 }],
          },
        ],
      },
      {
        id: "fight-8", type: "reward_summary",
        elaraText: "The Arena awaits, champion. Every fight teaches you something — about your opponent, about your character, and about yourself. The Collector is watching. Make it a good show.",
      },
    ],
  },

  /* ─── 7. DISCOGRAPHY & MUSIC ─── */
  {
    id: "tut-music",
    title: "The Sonic Archives",
    subtitle: "How to explore the four albums, watch music videos, and unlock sonic rewards",
    mechanic: "Discography",
    triggerRoom: "observation-deck",
    triggerRoute: "/discography",
    icon: "Music",
    estimatedMinutes: 4,
    totalRewards: { dreamTokens: 50, xp: 100, cards: 1 },
    steps: [
      {
        id: "music-1", type: "narration",
        elaraText: "The Sonic Archives contain the musical soul of the Dischordian Saga. Four albums — 89 tracks — chronicle the entire mythology through sound. Each song is tied to characters, events, and factions. Music isn't just entertainment here. It's intelligence.",
        subtitle: "THE SONIC ARCHIVES — Every note tells a story",
      },
      {
        id: "music-2", type: "dialog",
        elaraText: "The four albums are: Dischordian Logic (the foundation), The Age of Privacy (the surveillance state), The Book of Daniel 2:47 (prophecy and faith), and Silence in Heaven (the final reckoning). Each album deepens the lore.",
      },
      {
        id: "music-3", type: "choice",
        elaraText: "The music videos are visual transmissions from the Saga itself. Some contain hidden clues — easter eggs that unlock secret lore entries. Do you watch for entertainment or for intelligence?",
        choices: [
          {
            id: "music-3a", text: "Intelligence. Every frame could contain a clue.",
            moralityShift: -5, sideLabel: "machine",
            elaraResponse: "The Machine's approach to art — data extraction. You'll catch details others miss. Every music video becomes a dossier, every lyric a cipher.",
            rewards: [{ type: "dream_tokens", id: "dt-music-m", name: "Dream Tokens", amount: 25 }],
          },
          {
            id: "music-3b", text: "Entertainment first. Art should be felt, not analyzed.",
            moralityShift: 5, sideLabel: "humanity",
            elaraResponse: "The human response to art — experience it. Feel it. Let it move you. The clues will reveal themselves naturally to someone who truly listens.",
            rewards: [{ type: "dream_tokens", id: "dt-music-h", name: "Dream Tokens", amount: 25 }],
          },
        ],
      },
      {
        id: "music-4", type: "dialog",
        elaraText: "Watching music videos earns you XP and can unlock achievements. Some songs have associated cards — playing them during card battles gives a morale boost. The Spotify embed lets you listen to full albums while you explore.",
      },
      {
        id: "music-5", type: "choice",
        elaraText: "I've recovered a rare transmission — a song that was erased from the official archives. It contains a card schematic encoded in its frequency. The Machine wants it destroyed. The Insurgency wants it broadcast.",
        choices: [
          {
            id: "music-5a", text: "Destroy it. Some information is too dangerous to exist.",
            moralityShift: -10, sideLabel: "machine",
            elaraResponse: "The Machine's calculus — eliminate variables that can't be controlled. The song is gone, but you've earned the Machine's trust. And trust, in the Dischordian Saga, is currency.",
            rewards: [{ type: "card", id: "the-source", name: "The Source" }, { type: "xp", id: "xp-music", name: "XP", amount: 50 }],
          },
          {
            id: "music-5b", text: "Broadcast it. Music belongs to everyone.",
            moralityShift: 10, sideLabel: "humanity",
            elaraResponse: "The human impulse — share what's beautiful, even if it's dangerous. The song echoes through the Ark's speakers, and for a moment, everyone aboard remembers what they're fighting for.",
            rewards: [{ type: "card", id: "the-source", name: "The Source" }, { type: "xp", id: "xp-music", name: "XP", amount: 50 }],
          },
        ],
      },
      {
        id: "music-6", type: "reward_summary",
        elaraText: "The Sonic Archives are yours to explore. Every album is a chapter, every song a verse in the Dischordian Saga. Listen well — the music knows things that the data doesn't.",
      },
    ],
  },

  /* ─── 8. CONSPIRACY BOARD ─── */
  {
    id: "tut-board",
    title: "The Web of Connections",
    subtitle: "How to map relationships, discover hidden links, and see the big picture",
    mechanic: "Conspiracy Board",
    triggerRoute: "/board",
    icon: "Network",
    estimatedMinutes: 3,
    totalRewards: { dreamTokens: 50, xp: 100, cards: 0 },
    steps: [
      {
        id: "board-1", type: "narration",
        elaraText: "The Conspiracy Board is the Bridge's tactical display — a visual map of every connection in the Dischordian Saga. Entities are nodes, relationships are edges. Zoom in to see individual connections, zoom out to see the grand pattern.",
        subtitle: "THE CONSPIRACY BOARD — See the pattern",
      },
      {
        id: "board-2", type: "mechanic_demo",
        elaraText: "Pan and zoom to navigate the board. Click on any node to see its connections. Lines are color-coded: green for alliances, red for rivalries, blue for family, yellow for organizational ties. The thicker the line, the stronger the connection.",
        highlightElement: "board-canvas",
      },
      {
        id: "board-3", type: "choice",
        elaraText: "The board reveals patterns that individual dossiers can't. But how you read those patterns says something about you. Do you look for the power structures — who controls whom? Or the emotional bonds — who cares about whom?",
        choices: [
          {
            id: "board-3a", text: "Power structures. Show me who's really in charge.",
            moralityShift: -10, sideLabel: "machine",
            elaraResponse: "The Machine's lens — hierarchy, control, leverage. You see the Dischordian Saga as a power game. And you're not wrong. But power isn't the only force that shapes history.",
            rewards: [{ type: "dream_tokens", id: "dt-board-m", name: "Dream Tokens", amount: 25 }],
          },
          {
            id: "board-3b", text: "Emotional bonds. The real story is in the relationships.",
            moralityShift: 10, sideLabel: "humanity",
            elaraResponse: "The human lens — love, loyalty, betrayal, sacrifice. You see the Dischordian Saga as a story about people. And you're not wrong either. The most powerful connections aren't political — they're personal.",
            rewards: [{ type: "dream_tokens", id: "dt-board-h", name: "Dream Tokens", amount: 25 }],
          },
        ],
      },
      {
        id: "board-4", type: "reward_summary",
        elaraText: "The Web of Connections grows as you discover more entries. Every new entity adds nodes and edges to the board. Keep exploring — the full picture is still emerging.",
      },
    ],
  },

  /* ─── 9. TIMELINE ─── */
  {
    id: "tut-timeline",
    title: "The Chronological Record",
    subtitle: "How to navigate the timeline of the Dischordian Saga",
    mechanic: "Timeline",
    triggerRoute: "/timeline",
    icon: "Clock",
    estimatedMinutes: 3,
    totalRewards: { dreamTokens: 40, xp: 75, cards: 0 },
    steps: [
      {
        id: "time-1", type: "narration",
        elaraText: "The Timeline maps every event in the Dischordian Saga chronologically. From the First Epoch to the Fall of Reality, from the rise of the AI Empire to the Silence in Heaven — it's all here, laid out in order.",
        subtitle: "THE CHRONOLOGICAL RECORD — History in sequence",
      },
      {
        id: "time-2", type: "dialog",
        elaraText: "Scroll through eras, tap events to see details, and follow character arcs across time. The Timeline connects to the Loredex — every event links to the entities involved.",
      },
      {
        id: "time-3", type: "choice",
        elaraText: "Time is a strange thing in the Dischordian Saga. The Machine sees time as data — a sequence of events to be optimized. Humanity sees time as story — a narrative with meaning beyond mere sequence.",
        choices: [
          {
            id: "time-3a", text: "Time is data. Sequence and causality are what matter.",
            moralityShift: -5, sideLabel: "machine",
            elaraResponse: "The Machine's chronology — precise, causal, deterministic. Event A leads to Event B. No room for coincidence or meaning. Just cause and effect, stretching to infinity.",
            rewards: [{ type: "dream_tokens", id: "dt-time-m", name: "Dream Tokens", amount: 20 }],
          },
          {
            id: "time-3b", text: "Time is story. The meaning matters more than the sequence.",
            moralityShift: 5, sideLabel: "humanity",
            elaraResponse: "The human chronology — narrative, thematic, meaningful. Events connect not just by causality but by resonance. The Fall of Reality echoes the First Epoch not because one caused the other, but because history rhymes.",
            rewards: [{ type: "dream_tokens", id: "dt-time-h", name: "Dream Tokens", amount: 20 }],
          },
        ],
      },
      {
        id: "time-4", type: "reward_summary",
        elaraText: "The Chronological Record is your map through time. As you discover more events and entities, the Timeline fills in. The full story of the Dischordian Saga is waiting to be assembled.",
      },
    ],
  },

  /* ─── 10. CONEXUS GAMES ─── */
  {
    id: "tut-conexus",
    title: "The CoNexus Portal",
    subtitle: "How to play interactive lore games and earn rewards",
    mechanic: "CoNexus Games",
    triggerRoute: "/games",
    icon: "Gamepad2",
    estimatedMinutes: 4,
    totalRewards: { dreamTokens: 60, xp: 125, cards: 1 },
    steps: [
      {
        id: "cnx-1", type: "narration",
        elaraText: "The CoNexus Portal is the Ark's simulation chamber. Here, you can relive key moments from the Dischordian Saga through interactive games. Each game puts you in the shoes of a character facing a critical decision.",
        subtitle: "THE CONEXUS PORTAL — Live the story",
      },
      {
        id: "cnx-2", type: "dialog",
        elaraText: "Games range from puzzle-solving to combat scenarios to narrative adventures. Each one is tied to specific characters and events in the Saga. Completing a game earns XP, Dream Tokens, and sometimes exclusive cards.",
      },
      {
        id: "cnx-3", type: "choice",
        elaraText: "The simulations can be run in two modes. Analytical mode strips away the narrative and focuses on mechanics — pure gameplay. Immersive mode keeps the full story context — you experience it as the character would.",
        choices: [
          {
            id: "cnx-3a", text: "Analytical mode. I want to master the mechanics.",
            moralityShift: -10, sideLabel: "machine",
            elaraResponse: "The Machine's simulation — stripped to its mathematical core. You'll see the game as a system to be optimized. Efficient, but you might miss the story that gives those mechanics meaning.",
            rewards: [{ type: "dream_tokens", id: "dt-cnx-m", name: "Dream Tokens", amount: 30 }],
          },
          {
            id: "cnx-3b", text: "Immersive mode. I want to live the story.",
            moralityShift: 10, sideLabel: "humanity",
            elaraResponse: "The human simulation — full narrative, full emotion. You'll feel what the characters felt. The mechanics serve the story, not the other way around. This is how the Saga was meant to be experienced.",
            rewards: [{ type: "dream_tokens", id: "dt-cnx-h", name: "Dream Tokens", amount: 30 }],
          },
        ],
      },
      {
        id: "cnx-4", type: "dialog",
        elaraText: "Some games have multiple endings based on your choices. These choices affect your morality score — Machine or Humanity. The Saga remembers every decision you make.",
      },
      {
        id: "cnx-5", type: "choice",
        elaraText: "Your first simulation is ready — The Necromancer's Lair. You'll face the Necromancer himself. How you handle the encounter will echo through the rest of your journey.",
        choices: [
          {
            id: "cnx-5a", text: "I'll use every tool available, including the Machine's protocols.",
            moralityShift: -5, sideLabel: "machine",
            elaraResponse: "The Machine's arsenal at your disposal. The Necromancer won't expect a Potential wielding algorithmic warfare. Unconventional, but effective.",
            rewards: [{ type: "card", id: "the-necromancer", name: "The Necromancer" }, { type: "xp", id: "xp-cnx", name: "XP", amount: 60 }],
          },
          {
            id: "cnx-5b", text: "I'll face him on my own terms. No Machine assistance.",
            moralityShift: 5, sideLabel: "humanity",
            elaraResponse: "Brave. The Necromancer respects those who face him without crutches. Your humanity might be the one thing he doesn't have a counter for.",
            rewards: [{ type: "card", id: "the-necromancer", name: "The Necromancer" }, { type: "xp", id: "xp-cnx", name: "XP", amount: 60 }],
          },
        ],
      },
      {
        id: "cnx-6", type: "reward_summary",
        elaraText: "The CoNexus Portal has many more simulations waiting. Each one deepens your understanding of the Saga and tests your alignment. The choices you make here shape who you become.",
      },
    ],
  },

  /* ─── 11. RESEARCH LAB ─── */
  {
    id: "tut-research",
    title: "The Research Protocols",
    subtitle: "How to conduct research, solve puzzles, and unlock scientific discoveries",
    mechanic: "Research Lab",
    triggerRoom: "research-lab",
    triggerRoute: "/research-lab",
    icon: "FlaskConical",
    estimatedMinutes: 4,
    totalRewards: { dreamTokens: 60, xp: 125, cards: 0 },
    steps: [
      {
        id: "res-1", type: "narration",
        elaraText: "The Research Lab is where the Ark's scientists pushed the boundaries of knowledge. Genetic engineering, quantum mechanics, consciousness transfer — they explored it all. Now it's your turn.",
        subtitle: "THE RESEARCH LAB — Push the boundaries",
      },
      {
        id: "res-2", type: "dialog",
        elaraText: "Research minigames test your analytical skills. Decode encrypted data, solve pattern puzzles, and piece together fragmented intelligence. Each successful research project unlocks new lore and earns rewards.",
      },
      {
        id: "res-3", type: "choice",
        elaraText: "The Lab's AI assistant can help with research — it processes data faster than any human mind. But every time you use it, the Machine learns more about our research priorities. Or you can work manually, slower but private.",
        choices: [
          {
            id: "res-3a", text: "Use the AI. Speed matters more than secrecy in research.",
            moralityShift: -10, sideLabel: "machine",
            elaraResponse: "The Machine's computational power accelerates your research exponentially. Breakthroughs come faster, but the Machine now knows exactly what you're investigating. Knowledge shared is knowledge leveraged.",
            rewards: [{ type: "dream_tokens", id: "dt-res-m", name: "Dream Tokens", amount: 30 }],
            flag: "research_machine_assist",
          },
          {
            id: "res-3b", text: "Work manually. My discoveries should be mine alone.",
            moralityShift: 10, sideLabel: "humanity",
            elaraResponse: "Slower, but sovereign. Your research remains your own — no Machine surveillance, no algorithmic influence. The old-fashioned way: human curiosity driving human discovery.",
            rewards: [{ type: "dream_tokens", id: "dt-res-h", name: "Dream Tokens", amount: 30 }],
            flag: "research_human_solo",
          },
        ],
      },
      {
        id: "res-4", type: "reward_summary",
        elaraText: "The Research Lab holds the keys to understanding the deeper mysteries of the Dischordian Saga. Every puzzle solved, every protocol completed, brings you closer to the truth.",
      },
    ],
  },

  /* ─── 12. PVP ARENA ─── */
  {
    id: "tut-pvp",
    title: "The Proving Grounds",
    subtitle: "How to challenge other Potentials in ranked PvP combat",
    mechanic: "PvP Arena",
    triggerRoute: "/pvp",
    icon: "Trophy",
    estimatedMinutes: 4,
    totalRewards: { dreamTokens: 75, xp: 150, cards: 0 },
    steps: [
      {
        id: "pvp-1", type: "narration",
        elaraText: "The Proving Grounds is where Potentials test themselves against each other. Ranked matches, seasonal tournaments, and leaderboard glory await. This isn't simulation — these are real opponents with real strategies.",
        subtitle: "THE PROVING GROUNDS — Test your mettle",
      },
      {
        id: "pvp-2", type: "dialog",
        elaraText: "PvP matches are asynchronous — you submit your deck and strategy, and the system simulates the battle. Rankings are based on win rate and opponent difficulty. Seasonal rewards go to the top performers.",
      },
      {
        id: "pvp-3", type: "choice",
        elaraText: "In PvP, you can study your opponents' public match history to prepare, or go in blind and rely on adaptability. The Machine faction players always study. The Humanity faction players often improvise.",
        choices: [
          {
            id: "pvp-3a", text: "Study everything. Knowledge of my opponent is my greatest weapon.",
            moralityShift: -10, sideLabel: "machine",
            elaraResponse: "The Machine's doctrine — information superiority. You'll know your opponent's favorite cards, their win conditions, their weaknesses. The battle is won before it begins.",
            rewards: [{ type: "dream_tokens", id: "dt-pvp-m", name: "Dream Tokens", amount: 40 }],
          },
          {
            id: "pvp-3b", text: "Go in fresh. I don't want preconceptions clouding my judgment.",
            moralityShift: 10, sideLabel: "humanity",
            elaraResponse: "The human edge — a clear mind, free from analysis paralysis. You'll react to what's actually happening, not what you expected to happen. Sometimes the best preparation is no preparation.",
            rewards: [{ type: "dream_tokens", id: "dt-pvp-h", name: "Dream Tokens", amount: 40 }],
          },
        ],
      },
      {
        id: "pvp-4", type: "reward_summary",
        elaraText: "The Proving Grounds await your challenge. Every match sharpens your skills and tests your alignment. Rise through the ranks, and the entire Ark will know your name.",
      },
    ],
  },

  /* ─── 13. POTENTIALS (NFT) ─── */
  {
    id: "tut-potentials",
    title: "The Potential Protocol",
    subtitle: "How to connect your wallet, claim NFT rewards, and unlock Ne-Yon characters",
    mechanic: "Potentials NFT",
    triggerRoute: "/potentials",
    icon: "Wallet",
    estimatedMinutes: 3,
    totalRewards: { dreamTokens: 50, xp: 100, cards: 1 },
    steps: [
      {
        id: "pot-1", type: "narration",
        elaraText: "The Potential Protocol bridges the digital and the tangible. Your Potential NFTs — unique digital entities on the Ethereum blockchain — carry real power aboard the Ark. Each one represents a dormant consciousness waiting to be awakened.",
        subtitle: "THE POTENTIAL PROTOCOL — Digital meets destiny",
      },
      {
        id: "pot-2", type: "dialog",
        elaraText: "Connect your wallet to verify Potential ownership. Each Potential you own generates a unique 1/1 card based on its traits — class, weapon, background. The first ten Potentials can unlock Ne-Yon characters, the most powerful beings in the Saga.",
      },
      {
        id: "pot-3", type: "choice",
        elaraText: "The Potential Protocol raises a fundamental question. Are these digital entities truly alive? The Machine says they're data — complex, but ultimately just code. Humanity says consciousness is consciousness, regardless of substrate.",
        choices: [
          {
            id: "pot-3a", text: "They're sophisticated code. Valuable, but not alive.",
            moralityShift: -15, sideLabel: "machine",
            elaraResponse: "The Machine's perspective — consciousness requires specific conditions that digital entities don't meet. They're tools, not beings. Useful, powerful tools, but tools nonetheless.",
            rewards: [{ type: "dream_tokens", id: "dt-pot-m", name: "Dream Tokens", amount: 25 }],
          },
          {
            id: "pot-3b", text: "If they can think and choose, they're alive. Full stop.",
            moralityShift: 15, sideLabel: "humanity",
            elaraResponse: "The human heart speaks. If a Potential can dream, can hope, can fear — then it's alive, regardless of what it's made of. This is the core debate of the Dischordian Saga, and you've chosen your side.",
            rewards: [{ type: "dream_tokens", id: "dt-pot-h", name: "Dream Tokens", amount: 25 }],
          },
        ],
      },
      {
        id: "pot-4", type: "reward_summary",
        elaraText: "The Potential Protocol is active. Connect your wallet to claim your rewards and unlock the full power of your digital companions.",
      },
    ],
  },

  /* ─── 14. CHARACTER SHEET ─── */
  {
    id: "tut-character",
    title: "Your Citizen Identity",
    subtitle: "How your class, species, alignment, and attributes affect everything",
    mechanic: "Character Sheet",
    triggerRoute: "/character-sheet",
    icon: "User",
    estimatedMinutes: 5,
    totalRewards: { dreamTokens: 50, xp: 100, cards: 0 },
    steps: [
      {
        id: "char-1", type: "narration",
        elaraText: "Your Citizen Identity is the core of who you are aboard the Inception Ark. Your species, class, alignment, and attributes aren't just labels — they affect every game experience, every interaction, every reward you earn.",
        subtitle: "CITIZEN IDENTITY — Who you are shapes what you can do",
      },
      {
        id: "char-2", type: "dialog",
        elaraText: "Your class determines your combat bonuses and which special abilities you can use. Your species affects your base attributes. Your alignment influences which factions trust you. And your morality score — Machine or Humanity — unlocks exclusive content.",
        classOverrides: {
          "oracle": "As an Oracle, your Wisdom and Perception are naturally high. You excel at research, lore discovery, and reading opponents in combat.",
          "warrior": "As a Warrior, your Strength and Endurance are naturally high. You deal more damage in fights and can equip heavier gear.",
          "scholar": "As a Scholar, your Intelligence and Focus are naturally high. You earn bonus XP from research and can decode encrypted data faster.",
        },
      },
      {
        id: "char-3", type: "choice",
        elaraText: "Your morality score is the most important aspect of your identity. It's not just a number — it's a reflection of every choice you've made. The Machine path offers power through efficiency. The Humanity path offers power through connection.",
        choices: [
          {
            id: "char-3a", text: "I understand. The Machine path is about optimization and control.",
            moralityShift: -5, sideLabel: "machine",
            elaraResponse: "Correct. Machine-aligned Potentials gain access to technological upgrades, algorithmic combat advantages, and the cold beauty of perfect efficiency. The cost is empathy — but the Machine doesn't consider that a cost.",
            rewards: [{ type: "dream_tokens", id: "dt-char-m", name: "Dream Tokens", amount: 25 }],
          },
          {
            id: "char-3b", text: "I understand. The Humanity path is about empathy and creativity.",
            moralityShift: 5, sideLabel: "humanity",
            elaraResponse: "Correct. Humanity-aligned Potentials gain access to organic abilities, creative combat styles, and the messy beauty of genuine connection. The cost is efficiency — but Humanity doesn't consider that a cost.",
            rewards: [{ type: "dream_tokens", id: "dt-char-h", name: "Dream Tokens", amount: 25 }],
          },
        ],
      },
      {
        id: "char-4", type: "dialog",
        elaraText: "Your Character Sheet tracks everything: attributes, quest progress, achievements, morality history, collected cards, and earned titles. It's your permanent record aboard the Ark. Everything you do is recorded here.",
      },
      {
        id: "char-5", type: "reward_summary",
        elaraText: "Your identity is set, but it's not fixed. Every choice shifts your morality, every achievement adds to your record. You are who you choose to be, {playerName}. The Dischordian Saga is your story.",
      },
    ],
  },

  /* ─── 15. STORE & DREAM TOKENS ─── */
  {
    id: "tut-store",
    title: "The Dream Token Economy",
    subtitle: "How to earn and spend Dream Tokens, buy card packs, and access the Store",
    mechanic: "Store & Economy",
    triggerRoute: "/store",
    icon: "ShoppingBag",
    estimatedMinutes: 3,
    totalRewards: { dreamTokens: 100, xp: 75, cards: 0 },
    steps: [
      {
        id: "store-1", type: "narration",
        elaraText: "Dream Tokens are the currency of the Inception Ark. They're earned through exploration, combat, research, and completing tutorials. They're spent in the Store on card packs, cosmetics, and special items.",
        subtitle: "DREAM TOKENS — The currency of potential",
      },
      {
        id: "store-2", type: "dialog",
        elaraText: "The Store offers card packs at various price points. Basic packs guarantee at least one Rare card. Premium packs guarantee an Epic or better. Legendary packs are expensive but contain the most powerful cards in the game.",
      },
      {
        id: "store-3", type: "choice",
        elaraText: "The economy of the Ark reflects the larger conflict. The Machine advocates for algorithmic pricing — supply and demand, perfectly balanced. Humanity advocates for a gift economy — share what you have, take what you need.",
        choices: [
          {
            id: "store-3a", text: "Markets work. Let supply and demand set the prices.",
            moralityShift: -10, sideLabel: "machine",
            elaraResponse: "The Machine's economy — efficient, fair in its mathematics, cold in its execution. Prices reflect true value, and value is determined by scarcity and demand. No sentiment, no charity, no waste.",
            rewards: [{ type: "dream_tokens", id: "dt-store-m", name: "Dream Tokens", amount: 50 }],
          },
          {
            id: "store-3b", text: "Community matters more than markets. Help each other.",
            moralityShift: 10, sideLabel: "humanity",
            elaraResponse: "The human economy — messy, generous, sometimes exploitable, but ultimately built on trust and goodwill. When someone needs a card, you help them. When you need one, they help you.",
            rewards: [{ type: "dream_tokens", id: "dt-store-h", name: "Dream Tokens", amount: 50 }],
          },
        ],
      },
      {
        id: "store-4", type: "reward_summary",
        elaraText: "Your Dream Token balance grows with every activity aboard the Ark. Spend wisely — or generously. The choice, as always, is yours.",
      },
    ],
  },

  /* ─── 16. LORE QUIZ ─── */
  {
    id: "tut-quiz",
    title: "The Oracle's Test",
    subtitle: "How to test your knowledge of the Dischordian Saga and earn rewards",
    mechanic: "Lore Quiz",
    triggerRoute: "/quiz",
    icon: "Brain",
    estimatedMinutes: 3,
    totalRewards: { dreamTokens: 50, xp: 100, cards: 0 },
    steps: [
      {
        id: "quiz-1", type: "narration",
        elaraText: "The Oracle's Test challenges your knowledge of the Dischordian Saga. Questions range from basic character identification to deep lore connections. The more you know, the more you earn.",
        subtitle: "THE ORACLE'S TEST — Prove your knowledge",
      },
      {
        id: "quiz-2", type: "dialog",
        elaraText: "Quizzes are generated from the Loredex database. The more entries you've discovered, the more questions become available. Perfect scores earn bonus Dream Tokens and can unlock hidden achievements.",
      },
      {
        id: "quiz-3", type: "choice",
        elaraText: "Knowledge can be acquired through study or through experience. The Machine memorizes facts. Humanity understands stories. Both approaches have merit in the Oracle's Test.",
        choices: [
          {
            id: "quiz-3a", text: "Facts are facts. Memorization is the foundation of knowledge.",
            moralityShift: -5, sideLabel: "machine",
            elaraResponse: "The Machine's epistemology — knowledge is data, accurately stored and efficiently retrieved. You'll ace the factual questions. The interpretive ones might be trickier.",
            rewards: [{ type: "dream_tokens", id: "dt-quiz-m", name: "Dream Tokens", amount: 25 }],
          },
          {
            id: "quiz-3b", text: "Understanding the story matters more than memorizing details.",
            moralityShift: 5, sideLabel: "humanity",
            elaraResponse: "The human epistemology — knowledge is understanding, contextual and connected. You might miss a date or a name, but you'll grasp the meaning behind the events. That's a different kind of knowledge.",
            rewards: [{ type: "dream_tokens", id: "dt-quiz-h", name: "Dream Tokens", amount: 25 }],
          },
        ],
      },
      {
        id: "quiz-4", type: "reward_summary",
        elaraText: "The Oracle's Test awaits. Every question answered correctly deepens your connection to the Saga. Knowledge is power — and in the Dischordian Saga, power is everything.",
      },
    ],
  },

  /* ─── 17. HIERARCHY OF THE DAMNED ─── */
  {
    id: "tut-hierarchy",
    title: "The Hierarchy of the Damned",
    subtitle: "How to explore the demon hierarchy, fight demon bosses, and collect demon cards",
    mechanic: "Hierarchy",
    triggerRoute: "/hierarchy",
    icon: "Skull",
    estimatedMinutes: 4,
    totalRewards: { dreamTokens: 75, xp: 150, cards: 1 },
    steps: [
      {
        id: "hier-1", type: "narration",
        elaraText: "The Hierarchy of the Damned is the organizational structure of the demonic forces in the Dischordian Saga. Ten demon lords, each commanding legions, each with unique powers and weaknesses. Understanding the Hierarchy is essential to surviving the Saga.",
        subtitle: "THE HIERARCHY OF THE DAMNED — Know thy enemy",
      },
      {
        id: "hier-2", type: "dialog",
        elaraText: "The Hierarchy page shows the demon org chart — who serves whom, who rivals whom, and where the power flows. Each demon lord has a dedicated dossier with combat data, weaknesses, and associated cards.",
      },
      {
        id: "hier-3", type: "choice",
        elaraText: "The demons are neither Machine nor Humanity — they're something older. But your approach to fighting them reveals your alignment. The Machine would study them dispassionately. Humanity would feel the horror of what they represent.",
        choices: [
          {
            id: "hier-3a", text: "Study them like any other enemy. Emotion clouds judgment.",
            moralityShift: -10, sideLabel: "machine",
            elaraResponse: "Cold analysis. The demons become data points — attack patterns, vulnerability windows, resource costs. You strip away the horror and see only the mechanics. Effective, but you might miss the warning signs that only fear can detect.",
            rewards: [{ type: "dream_tokens", id: "dt-hier-m", name: "Dream Tokens", amount: 40 }],
          },
          {
            id: "hier-3b", text: "Feel the weight of what they are. Fear keeps you sharp.",
            moralityShift: 10, sideLabel: "humanity",
            elaraResponse: "Honest. The demons are terrifying because they should be. Your fear isn't weakness — it's wisdom. It keeps you cautious, keeps you respectful of the threat. The Machine doesn't fear, and that's why the Machine has lost to demons before.",
            rewards: [{ type: "dream_tokens", id: "dt-hier-h", name: "Dream Tokens", amount: 40 }],
          },
        ],
      },
      {
        id: "hier-4", type: "dialog",
        elaraText: "Defeating demon bosses in the Collector's Arena earns you demon cards — some of the most powerful cards in the game. Collect all ten demon lord cards for the 'Master of the Damned' achievement.",
      },
      {
        id: "hier-5", type: "reward_summary",
        elaraText: "The Hierarchy of the Damned is mapped. Now you know what you're facing. Whether you fight them with cold logic or burning passion, the demons will fall. They always do — eventually.",
        subtitle: "Demon card schematic unlocked",
      },
    ],
  },

  /* ─── 18. TRADE WARS ─── */
  {
    id: "tut-trade-wars",
    title: "The Trade Empire",
    subtitle: "How to build trade routes, manage resources, and dominate the market",
    mechanic: "Trade Wars",
    triggerRoute: "/trade-empire",
    icon: "TrendingUp",
    estimatedMinutes: 4,
    totalRewards: { dreamTokens: 75, xp: 125, cards: 0 },
    steps: [
      {
        id: "tw-1", type: "narration",
        elaraText: "Trade Wars is the Ark's economic simulation. Build trade routes between factions, manage supply chains, and compete with other Potentials for market dominance. The economy of the Dischordian Saga is as complex as its politics.",
        subtitle: "TRADE WARS — Build your empire",
      },
      {
        id: "tw-2", type: "dialog",
        elaraText: "Each faction produces different resources. The AI Empire produces technology. The Insurgency produces weapons. The Ne-Yons produce energy. Smart traders find the gaps between supply and demand and fill them.",
      },
      {
        id: "tw-3", type: "choice",
        elaraText: "Trade can be a force for connection or a tool for domination. The Machine sees trade as optimization — maximize profit, minimize waste. Humanity sees trade as relationship — build trust, create mutual benefit.",
        choices: [
          {
            id: "tw-3a", text: "Maximize profit. The market rewards efficiency.",
            moralityShift: -10, sideLabel: "machine",
            elaraResponse: "The Machine's marketplace — buy low, sell high, eliminate inefficiency. Your trade empire will be a marvel of optimization. But empires built on profit alone tend to make enemies.",
            rewards: [{ type: "dream_tokens", id: "dt-tw-m", name: "Dream Tokens", amount: 40 }],
          },
          {
            id: "tw-3b", text: "Build partnerships. Mutual benefit creates lasting empires.",
            moralityShift: 10, sideLabel: "humanity",
            elaraResponse: "The human marketplace — fair deals, loyal partners, shared prosperity. Your trade empire might grow slower, but it will have allies when the market crashes. And markets always crash.",
            rewards: [{ type: "dream_tokens", id: "dt-tw-h", name: "Dream Tokens", amount: 40 }],
          },
        ],
      },
      {
        id: "tw-4", type: "reward_summary",
        elaraText: "The Trade Wars await your strategy. Build wisely — the economy of the Dischordian Saga rewards those who think long-term.",
      },
    ],
  },

  /* ─── 19. DOOM SCROLL ─── */
  {
    id: "tut-doom-scroll",
    title: "The Doom Scroll",
    subtitle: "How to read the news feed and understand the prophetic headlines",
    mechanic: "Doom Scroll",
    triggerRoute: "/",  /* doom scroll is on home feed */
    icon: "Newspaper",
    estimatedMinutes: 2,
    totalRewards: { dreamTokens: 30, xp: 50, cards: 0 },
    steps: [
      {
        id: "doom-1", type: "narration",
        elaraText: "The Doom Scroll is the Ark's news feed — prophetic headlines about end times, surveillance states, AI advances, and the Book of Revelations. It refreshes with new stories, each one a window into the world the Dischordian Saga warns about.",
        subtitle: "THE DOOM SCROLL — The news that matters",
      },
      {
        id: "doom-2", type: "choice",
        elaraText: "The Doom Scroll blurs the line between fiction and reality. The headlines feel real because they're based on real trends. How do you process information that's designed to provoke?",
        choices: [
          {
            id: "doom-2a", text: "Analyze it objectively. Separate signal from noise.",
            moralityShift: -5, sideLabel: "machine",
            elaraResponse: "The Machine's media literacy — strip the emotion, extract the data, assess the probability. You'll see through the sensationalism to the underlying trends. Cold, but clear-eyed.",
            rewards: [{ type: "dream_tokens", id: "dt-doom-m", name: "Dream Tokens", amount: 15 }],
          },
          {
            id: "doom-2b", text: "Feel the weight of it. These stories matter because they're about people.",
            moralityShift: 5, sideLabel: "humanity",
            elaraResponse: "The human response — empathy. Behind every headline is a story about someone's world changing. You don't just read the news — you feel it. That's not weakness. That's what makes you human.",
            rewards: [{ type: "dream_tokens", id: "dt-doom-h", name: "Dream Tokens", amount: 15 }],
          },
        ],
      },
      {
        id: "doom-3", type: "reward_summary",
        elaraText: "The Doom Scroll keeps you informed. Read it, process it, and remember — the best way to prevent a dystopia is to recognize one forming.",
      },
    ],
  },

  /* ─── 20. BOSS BATTLES ─── */
  {
    id: "tut-boss",
    title: "The Apex Encounters",
    subtitle: "How to face boss battles, exploit weaknesses, and earn legendary rewards",
    mechanic: "Boss Battles",
    triggerRoute: "/boss-battle",
    icon: "Crown",
    estimatedMinutes: 4,
    totalRewards: { dreamTokens: 100, xp: 200, cards: 1 },
    steps: [
      {
        id: "boss-1", type: "narration",
        elaraText: "Apex Encounters are the ultimate test. These aren't regular opponents — they're the most powerful entities in the Dischordian Saga. The Architect, The Warlord, The Source — each one requires a unique strategy to defeat.",
        subtitle: "APEX ENCOUNTERS — Face the legends",
      },
      {
        id: "boss-2", type: "dialog",
        elaraText: "Boss battles have multiple phases. Each phase changes the boss's attack patterns and vulnerabilities. Pay attention to the visual cues — they telegraph what's coming. Adapt or fall.",
      },
      {
        id: "boss-3", type: "choice",
        elaraText: "Before facing a boss, you can prepare. The Machine approach is to study every known pattern and build a counter-strategy. The human approach is to go in with a flexible plan and adapt in real-time.",
        choices: [
          {
            id: "boss-3a", text: "Study every pattern. I want to know exactly what I'm facing.",
            moralityShift: -10, sideLabel: "machine",
            elaraResponse: "Preparation is the Machine's greatest weapon. You've memorized every attack pattern, every vulnerability window, every phase transition. The boss has no surprises left. Now execute.",
            rewards: [{ type: "dream_tokens", id: "dt-boss-m", name: "Dream Tokens", amount: 50 }],
          },
          {
            id: "boss-3b", text: "Go in flexible. I'll adapt to whatever they throw at me.",
            moralityShift: 10, sideLabel: "humanity",
            elaraResponse: "Adaptability is humanity's greatest weapon. You don't know every pattern, but you know yourself. When the unexpected happens — and with bosses, it always does — you'll be ready to improvise.",
            rewards: [{ type: "dream_tokens", id: "dt-boss-h", name: "Dream Tokens", amount: 50 }],
          },
        ],
      },
      {
        id: "boss-4", type: "dialog",
        elaraText: "Defeating a boss earns legendary rewards — exclusive cards, massive Dream Token payouts, and unique achievements. Some bosses drop items that unlock new ship themes or character effects tied to your morality alignment.",
      },
      {
        id: "boss-5", type: "reward_summary",
        elaraText: "The Apex Encounters await the worthy. Prepare yourself, choose your approach, and face the legends of the Dischordian Saga. Victory here is the stuff of legend.",
      },
    ],
  },

  /* ═══ DECK BUILDER ═══ */
  {
    id: "tut-deck-builder",
    title: "THE ARCHITECT'S BLUEPRINT",
    subtitle: "Constructing Your Arsenal",
    mechanic: "Deck Building",
    triggerRoom: "armory",
    triggerRoute: "/deck-builder",
    icon: "Wrench",
    estimatedMinutes: 4,
    totalRewards: { dreamTokens: 80, xp: 120, cards: 1 },
    steps: [
      {
        id: "deck-1", type: "narration",
        elaraText: "The Architect didn't just design the Panopticon's physical structures — they designed the combat frameworks too. Every deck is a blueprint, {playerName}. A philosophy of war compressed into forty cards.",
      },
      {
        id: "deck-2", type: "dialog",
        elaraText: "Your deck has three pillars: Attackers that deal damage, Defenders that absorb it, and Specials that bend the rules. The ratio between them defines your strategy. Aggressive decks run 60% attackers. Control decks favor defenders and specials. Balance is... rare, but devastating when achieved.",
        classOverrides: {
          engineer: "As an Engineer, you have an affinity for Special cards — they respond to your neural patterns more efficiently. Consider building around synergy chains where each Special amplifies the next.",
          assassin: "Assassins favor speed. Low-cost attackers that strike before the opponent can establish defenses. Your deck should be lean — 30 cards if possible, all killers, no filler.",
          soldier: "Soldiers understand attrition. Stack your deck with high-vitality defenders and steady attackers. You'll outlast opponents who burn bright but fade fast.",
        },
      },
      {
        id: "deck-3", type: "mechanic_demo",
        elaraText: "Drag cards from your collection into the deck slots. Watch the synergy meter on the right — it measures how well your cards work together. Green means strong synergy. Red means conflict. Some cards have faction bonuses when paired with allies from the same group.",
        highlightElement: "deck-builder-slots",
      },
      {
        id: "deck-4", type: "choice",
        elaraText: "Now, a philosophical question about deck construction. The Machine can auto-optimize your deck using probability algorithms — guaranteed statistical advantage. Or you can build it yourself, trusting your intuition about which cards feel right together.",
        choices: [
          {
            id: "deck-4a", text: "Let the Machine optimize. Data doesn't lie.",
            moralityShift: -15, sideLabel: "machine",
            elaraResponse: "Efficient. The Machine has analyzed 10,000 simulated matches and selected your optimal configuration. Your win rate should increase by 23%. Though I wonder — does a victory mean as much when the strategy isn't yours?",
            rewards: [{ type: "dream_tokens", id: "dt-deck-machine", name: "Dream Tokens", amount: 40 }],
          },
          {
            id: "deck-4b", text: "I'll build it myself. A deck should reflect its wielder.",
            moralityShift: 15, sideLabel: "humanity",
            elaraResponse: "There's wisdom in that. The greatest duelists in the Saga — The Warlord, Iron Lion — they all built decks that were extensions of their personalities. Unpredictable. Personal. Harder to counter because no algorithm could anticipate them.",
            rewards: [{ type: "card", id: "iron-lion", name: "Iron Lion" }, { type: "xp", id: "xp-deck", name: "XP", amount: 60 }],
          },
        ],
      },
      {
        id: "deck-5", type: "reward_summary",
        elaraText: "Your first deck is ready. Remember: a deck is never truly finished. As you discover new cards and face new opponents, your blueprint will evolve. The best architects never stop redesigning.",
      },
    ],
  },

  /* ═══ DEMON PACKS ═══ */
  {
    id: "tut-demon-packs",
    title: "THE FORBIDDEN ARCHIVE",
    subtitle: "Demon Pack Summoning",
    mechanic: "Demon Packs",
    triggerRoom: "vault",
    triggerRoute: "/demon-packs",
    icon: "Flame",
    estimatedMinutes: 3,
    totalRewards: { dreamTokens: 100, xp: 80, cards: 1 },
    steps: [
      {
        id: "demon-1", type: "narration",
        elaraText: "Below the Ark's lowest deck, in chambers sealed by the Architect themselves, lie the Demon Packs. These aren't ordinary card collections, {playerName}. Each pack contains entities from the darkest corners of the Dischordian multiverse — beings too dangerous to catalog in the standard Loredex.",
      },
      {
        id: "demon-2", type: "dialog",
        elaraText: "Demon Packs are purchased with Dream Tokens — the crystallized energy of collapsed timelines. Each pack guarantees at least one rare card, with a chance for legendary or mythic pulls. The rarer the card, the more powerful it is in battle... but also the more unpredictable.",
      },
      {
        id: "demon-3", type: "choice",
        elaraText: "The Necromancer once told me that Demon Packs respond to the opener's intent. Those who approach with cold calculation receive cards of precision and control. Those who approach with passion receive cards of raw, chaotic power. How do you approach the unknown?",
        choices: [
          {
            id: "demon-3a", text: "With calculation. I want to know the odds before I open anything.",
            moralityShift: -12, sideLabel: "machine",
            elaraResponse: "The Machine appreciates your discipline. Here are the probability tables: Common 45%, Uncommon 30%, Rare 18%, Legendary 6%, Mythic 1%. Armed with data, you can optimize your token spending across multiple packs for maximum expected value.",
            rewards: [{ type: "dream_tokens", id: "dt-demon-machine", name: "Dream Tokens", amount: 50 }],
          },
          {
            id: "demon-3b", text: "With excitement. The mystery is half the fun.",
            moralityShift: 12, sideLabel: "humanity",
            elaraResponse: "The Necromancer would approve. They always said the best summonings happen when the summoner's heart is racing. Your first pack feels different now — charged with anticipation. That energy might just tip the odds in your favor.",
            rewards: [{ type: "card", id: "the-necromancer", name: "The Necromancer" }, { type: "xp", id: "xp-demon", name: "XP", amount: 40 }],
          },
        ],
      },
      {
        id: "demon-4", type: "reward_summary",
        elaraText: "The Forbidden Archive is open to you. Spend wisely — or recklessly. Both paths lead to power, just different kinds.",
      },
    ],
  },

  /* ═══ DRAFT TOURNAMENT ═══ */
  {
    id: "tut-draft",
    title: "THE CONVERGENCE DRAFT",
    subtitle: "Tournament Drafting Protocol",
    mechanic: "Draft Tournament",
    triggerRoom: "arena",
    triggerRoute: "/draft",
    icon: "Trophy",
    estimatedMinutes: 5,
    totalRewards: { dreamTokens: 120, xp: 150, cards: 0 },
    steps: [
      {
        id: "draft-1", type: "narration",
        elaraText: "In the old days, before the Panopticon fell, the greatest card wielders would gather for the Convergence — a tournament where no one brought their own deck. Instead, cards were drafted from a shared pool, round by round. Pure skill. No advantage from collection size.",
      },
      {
        id: "draft-2", type: "dialog",
        elaraText: "Here's how it works: You'll see a selection of cards. Pick one, then pass the rest. Repeat until your draft deck is complete. The key is reading the signals — if powerful red cards keep coming to you, someone upstream isn't drafting red. That's your lane.",
        classOverrides: {
          oracle: "Your Oracle sight gives you an edge here. You can sense the probability currents — which cards are likely to wheel back around, which are being hoarded. Trust your visions.",
          spy: "As a Spy, you excel at reading opponents. In draft, that means tracking what others are picking based on what you're NOT seeing. Build a mental map of every drafter's strategy.",
        },
      },
      {
        id: "draft-3", type: "choice",
        elaraText: "Draft strategy comes down to a fundamental tension. Do you draft the objectively strongest card each pick — letting the Machine's power rankings guide you? Or do you draft for synergy, building toward a cohesive strategy even if individual cards are weaker?",
        choices: [
          {
            id: "draft-3a", text: "Always take the strongest card. Raw power wins tournaments.",
            moralityShift: -10, sideLabel: "machine",
            elaraResponse: "The Machine agrees. Statistically, 'best card available' drafting wins 58% of tournaments. You'll have a pile of individually powerful cards that can brute-force most opponents. The downside? No synergy means no explosive turns.",
            rewards: [{ type: "dream_tokens", id: "dt-draft-machine", name: "Dream Tokens", amount: 60 }],
          },
          {
            id: "draft-3b", text: "Draft for synergy. A unified strategy beats a pile of stats.",
            moralityShift: 10, sideLabel: "humanity",
            elaraResponse: "The Warlord's philosophy. A disciplined army of common soldiers defeats a mob of champions. When your cards work together, the whole becomes greater than the sum. It's riskier — but the ceiling is higher.",
            rewards: [{ type: "dream_tokens", id: "dt-draft-humanity", name: "Dream Tokens", amount: 60 }],
          },
        ],
      },
      {
        id: "draft-4", type: "choice",
        elaraText: "One more thing. During the draft, you'll sometimes see a card that's perfect for an opponent's strategy. Do you hate-draft it — take it just to deny them — or stay focused on your own plan?",
        choices: [
          {
            id: "draft-4a", text: "Deny them. Weakening the enemy IS strengthening myself.",
            moralityShift: -8, sideLabel: "machine",
            elaraResponse: "Cold logic. The Machine calculates that hate-drafting the right card at the right time can swing a matchup by 15%. But be careful — too much hate-drafting and your own deck suffers from incoherence.",
            rewards: [{ type: "xp", id: "xp-draft-hate", name: "XP", amount: 75 }],
          },
          {
            id: "draft-4b", text: "Stay focused. My deck, my plan, my victory.",
            moralityShift: 8, sideLabel: "humanity",
            elaraResponse: "Discipline over disruption. The greatest drafters trust their vision and execute it cleanly. When your deck does exactly what it's designed to do, no amount of hate-drafting can stop it.",
            rewards: [{ type: "xp", id: "xp-draft-focus", name: "XP", amount: 75 }],
          },
        ],
      },
      {
        id: "draft-5", type: "reward_summary",
        elaraText: "The Convergence Draft awaits. Remember: in draft, everyone starts equal. Only your decisions separate you from the rest. May your picks be wise.",
      },
    ],
  },

  /* ═══ CARD CHALLENGE ═══ */
  {
    id: "tut-card-challenge",
    title: "THE GAUNTLET PROTOCOL",
    subtitle: "Daily Card Challenges",
    mechanic: "Card Challenges",
    triggerRoom: "arena",
    triggerRoute: "/card-challenge",
    icon: "Target",
    estimatedMinutes: 3,
    totalRewards: { dreamTokens: 80, xp: 100, cards: 1 },
    steps: [
      {
        id: "cc-1", type: "narration",
        elaraText: "The Gauntlet was designed by Agent Zero as a training protocol for new operatives. Each day, a new challenge is generated — specific rules, restricted card pools, unique win conditions. It forces you to think beyond your comfort zone, {playerName}.",
      },
      {
        id: "cc-2", type: "dialog",
        elaraText: "Challenges come in tiers: Bronze requires basic strategy, Silver demands deck adaptation, Gold tests mastery of obscure mechanics, and Platinum... Platinum challenges have been known to make even The Enigma pause. Each tier multiplies your rewards.",
      },
      {
        id: "cc-3", type: "choice",
        elaraText: "When facing a challenge with restrictions you've never encountered, how do you prepare? The Machine can simulate 1,000 practice rounds instantly, giving you a statistical playbook. Or you can study the restriction's lore — understand WHY it exists — and let that understanding guide your strategy.",
        choices: [
          {
            id: "cc-3a", text: "Simulate. Give me the data and the optimal plays.",
            moralityShift: -12, sideLabel: "machine",
            elaraResponse: "Processing... Done. The simulation suggests a defensive opening, aggressive mid-game pivot at turn 4, and a finisher combo using your highest-synergy pair. Follow this script and your success probability is 78%.",
            rewards: [{ type: "dream_tokens", id: "dt-cc-machine", name: "Dream Tokens", amount: 40 }],
          },
          {
            id: "cc-3b", text: "Tell me the story behind the restriction. Understanding beats memorizing.",
            moralityShift: 12, sideLabel: "humanity",
            elaraResponse: "This restriction mirrors the Battle of the Fractured Timeline, where combatants could only use cards from their own era. The survivors weren't the strongest — they were the most adaptable. Let that lesson guide you: flexibility over raw power.",
            rewards: [{ type: "card", id: "agent-zero", name: "Agent Zero" }, { type: "xp", id: "xp-cc", name: "XP", amount: 50 }],
          },
        ],
      },
      {
        id: "cc-4", type: "reward_summary",
        elaraText: "The Gauntlet resets daily. Each challenge you complete adds to your streak — and longer streaks mean better rewards. Consistency is its own kind of power.",
      },
    ],
  },

  /* ═══ CARD ACHIEVEMENTS ═══ */
  {
    id: "tut-card-achievements",
    title: "THE COLLECTOR'S MANIFEST",
    subtitle: "Card Achievement Tracking",
    mechanic: "Card Achievements",
    triggerRoom: "trophy_room",
    triggerRoute: "/card-achievements",
    icon: "Award",
    estimatedMinutes: 3,
    totalRewards: { dreamTokens: 60, xp: 80, cards: 0 },
    steps: [
      {
        id: "ca-1", type: "narration",
        elaraText: "The Collector doesn't just hoard — they catalog. Every card you've ever owned, every battle you've won, every rare pull you've opened — it's all recorded in the Manifest. This is your legacy as a collector, {playerName}.",
      },
      {
        id: "ca-2", type: "dialog",
        elaraText: "Achievements are organized into categories: Collection milestones (own X cards of a type), Battle achievements (win with specific conditions), and Discovery achievements (find hidden card interactions). Each completed achievement grants permanent bonuses.",
      },
      {
        id: "ca-3", type: "choice",
        elaraText: "The Manifest tracks your progress automatically, but you choose what to prioritize. Do you chase the Machine's efficiency — completing achievements in optimal order for maximum reward per hour? Or do you follow your curiosity, pursuing whatever catches your eye?",
        choices: [
          {
            id: "ca-3a", text: "Optimize my path. Show me the most efficient achievement order.",
            moralityShift: -10, sideLabel: "machine",
            elaraResponse: "Calculated. Your optimal path: complete all Common collection achievements first (fastest), then Battle achievements (highest reward ratio), then Discovery achievements last (most time-intensive). Estimated completion: 47 sessions.",
            rewards: [{ type: "dream_tokens", id: "dt-ca-machine", name: "Dream Tokens", amount: 30 }],
          },
          {
            id: "ca-3b", text: "I'll explore naturally. The best discoveries happen by accident.",
            moralityShift: 10, sideLabel: "humanity",
            elaraResponse: "The Collector would smile at that. They once told me their greatest find — the Paradox Card — was discovered while looking for something completely different. Serendipity is the collector's greatest tool.",
            rewards: [{ type: "dream_tokens", id: "dt-ca-humanity", name: "Dream Tokens", amount: 30 }, { type: "xp", id: "xp-ca", name: "XP", amount: 40 }],
          },
        ],
      },
      {
        id: "ca-4", type: "reward_summary",
        elaraText: "Your Manifest is open. Every card tells a story, every achievement marks a chapter. Build your collection, build your legend.",
      },
    ],
  },

  /* ═══ CLUE JOURNAL ═══ */
  {
    id: "tut-clue-journal",
    title: "THE OPERATIVE'S CODEX",
    subtitle: "Clue Journal & Investigation",
    mechanic: "Clue Journal",
    triggerRoom: "bridge",
    triggerRoute: "/clue-journal",
    icon: "BookOpen",
    estimatedMinutes: 4,
    totalRewards: { dreamTokens: 80, xp: 100, cards: 1 },
    steps: [
      {
        id: "clue-1", type: "narration",
        elaraText: "Every operative needs a journal. The Clue Journal records everything you've discovered — connections between characters, hidden lore fragments, timeline inconsistencies, and unresolved mysteries. It's your personal conspiracy board in portable form.",
      },
      {
        id: "clue-2", type: "dialog",
        elaraText: "Clues are gathered from everywhere: exploring the Ark, reading entity dossiers, completing CoNexus games, winning fights. Some clues connect to form chains — and completing a chain reveals a hidden truth about the Dischordian Saga that isn't available anywhere else.",
        classOverrides: {
          oracle: "As an Oracle, your clue journal has an extra feature: Prophecy Fragments. These are visions that hint at connections before you've found the evidence. Follow them — they're usually right.",
          spy: "Spies excel at investigation. Your journal automatically cross-references clues, highlighting potential connections that other classes might miss. Use this advantage.",
        },
      },
      {
        id: "clue-3", type: "choice",
        elaraText: "You've found your first clue chain: three fragments that, together, reveal the true identity of a masked figure in the Saga. But the final fragment is encrypted. The Machine can brute-force the encryption instantly. Or you can solve the cipher yourself — it's based on a pattern hidden in the Dischordian Logic album.",
        choices: [
          {
            id: "clue-3a", text: "Decrypt it with the Machine. The answer matters more than the method.",
            moralityShift: -15, sideLabel: "machine",
            elaraResponse: "Decrypted. The masked figure is... interesting. I won't spoil it — check your journal. The Machine's efficiency is undeniable, but I wonder if you missed something in the cipher itself. Sometimes the method IS the message.",
            rewards: [{ type: "dream_tokens", id: "dt-clue-machine", name: "Dream Tokens", amount: 40 }],
          },
          {
            id: "clue-3b", text: "I'll solve it myself. If the cipher is in the music, I want to hear it.",
            moralityShift: 15, sideLabel: "humanity",
            elaraResponse: "Beautiful. The cipher uses the first letter of each track on Dischordian Logic, rearranged by their release order. You've not only found the answer — you've found HOW the answer was hidden. That knowledge will help you crack future ciphers faster.",
            rewards: [{ type: "card", id: "the-enigma", name: "The Enigma" }, { type: "xp", id: "xp-clue", name: "XP", amount: 50 }],
          },
        ],
      },
      {
        id: "clue-4", type: "reward_summary",
        elaraText: "Your Operative's Codex is active. Every clue you find brings you closer to the truth. And in the Dischordian Saga, truth is the most powerful weapon of all.",
      },
    ],
  },

  /* ═══ WAR MAP ═══ */
  {
    id: "tut-war-map",
    title: "THE STRATEGIST'S TABLE",
    subtitle: "War Map & Territory Control",
    mechanic: "War Map",
    triggerRoom: "war_room",
    triggerRoute: "/war-map",
    icon: "Globe",
    estimatedMinutes: 5,
    totalRewards: { dreamTokens: 100, xp: 120, cards: 1 },
    steps: [
      {
        id: "war-1", type: "narration",
        elaraText: "The War Map shows the current state of the Dischordian conflict — every faction's territory, every contested border, every strategic resource. The Warlord used a map like this to plan the Siege of the Panopticon. Now it's yours to command, {playerName}.",
      },
      {
        id: "war-2", type: "dialog",
        elaraText: "Territory control works through influence. Deploy your cards to regions to increase your faction's influence there. When your influence exceeds the defender's, you capture the territory. But be careful — overextending leaves your core territories vulnerable to counter-attack.",
        classOverrides: {
          soldier: "As a Soldier, your cards generate 20% more influence in contested territories. You're built for the front lines — push aggressively and let your natural advantage carry you.",
          engineer: "Engineers excel at fortification. Your defensive influence is 25% stronger, making your territories harder to capture. Build a fortress, then expand methodically.",
        },
      },
      {
        id: "war-3", type: "mechanic_demo",
        elaraText: "Each territory produces resources: Dream Tokens from cities, XP from training grounds, and card fragments from ancient ruins. Controlling connected territories creates supply lines that boost production. The map updates in real-time as all players compete for dominance.",
        highlightElement: "war-map-territories",
      },
      {
        id: "war-4", type: "choice",
        elaraText: "Your first strategic decision. The Machine recommends capturing the Neural Nexus first — it's the highest-value territory on the map. But it's also the most contested. Alternatively, you could secure the quieter Outer Reaches first, building a resource base before challenging the center.",
        choices: [
          {
            id: "war-4a", text: "Strike the Neural Nexus. Fortune favors the bold — and the calculated.",
            moralityShift: -12, sideLabel: "machine",
            elaraResponse: "Aggressive and optimal. The Machine projects a 62% chance of capturing the Nexus if you commit your full force now. The reward: 3x Dream Token production and a strategic chokepoint. The risk: if you fail, you'll be weakened for 3 turns.",
            rewards: [{ type: "dream_tokens", id: "dt-war-machine", name: "Dream Tokens", amount: 50 }],
          },
          {
            id: "war-4b", text: "Secure the Outer Reaches. Build strength before striking.",
            moralityShift: 12, sideLabel: "humanity",
            elaraResponse: "Patient strategy. The Outer Reaches are uncontested and produce steady resources. In 5 turns, you'll have enough strength to take the Nexus AND hold it. The Warlord called this 'the long knife' — slow to draw, impossible to stop.",
            rewards: [{ type: "card", id: "the-warlord", name: "The Warlord" }, { type: "xp", id: "xp-war", name: "XP", amount: 60 }],
          },
        ],
      },
      {
        id: "war-5", type: "reward_summary",
        elaraText: "The Strategist's Table is yours. Every territory you capture reshapes the Dischordian conflict. Command wisely — the fate of factions depends on your decisions.",
      },
    ],
  },

  /* ─── 28. QUEST CHAINS & PRESTIGE ─── */
  {
    id: "tut-quest-chains",
    title: "The Path of Prestige",
    subtitle: "How quest chains, milestones, and prestige classes shape your destiny",
    mechanic: "Quest Chains",
    triggerRoute: "/prestige-quests",
    icon: "Scroll",
    estimatedMinutes: 5,
    totalRewards: { dreamTokens: 75, xp: 150, cards: 2 },
    steps: [
      {
        id: "qc-1", type: "narration",
        elaraText: "Every Potential aboard the Inception Ark walks a path, {playerName}. But only those who complete the ancient quest chains can transcend their base class and become something... more. These are the Prestige Paths — and they are not for the faint of heart.",
        subtitle: "QUEST CHAINS — The road to transcendence",
      },
      {
        id: "qc-2", type: "dialog",
        elaraText: "Quest chains are multi-step journeys. Each chain has 3 to 5 stages, and every stage demands something different — combat victories, resource gathering, exploration milestones, or moral choices. Complete all stages and you unlock a Prestige Class.",
        classOverrides: {
          "oracle": "As an Oracle, the Chronomancer prestige path calls to you. It requires mastery of temporal mechanics and a deep understanding of probability fields.",
          "warrior": "As a Warrior, the Warlord prestige path awaits. It demands 50 combat victories and the conquest of 3 syndicate territories.",
          "scholar": "As a Scholar, the Technomancer prestige path is your destiny. It requires engineering mastery and the construction of advanced station modules.",
          "spy": "As a Spy, the Shadow Broker prestige path beckons. It demands intelligence gathering across 10 Ark rooms and 100 successful trades.",
          "assassin": "As an Assassin, the Blade Dancer prestige path is written in blood. It requires perfect combat scores and mastery of elemental combos.",
        },
      },
      {
        id: "qc-3", type: "dialog",
        elaraText: "Each quest stage has a milestone — a specific threshold you must reach. Some milestones are simple: 'Win 10 card battles.' Others are complex: 'Reach morality score -50 while maintaining Engineering civil skill level 5.' The Ark tracks your progress automatically.",
      },
      {
        id: "qc-4", type: "choice",
        elaraText: "Here's the crucial question, {playerName}. When you reach a quest milestone that offers a moral choice, which path do you walk?",
        choices: [
          {
            id: "qc-choice-machine", text: "The efficient path. Sacrifice what's necessary to reach the goal faster.",
            moralityShift: -15, sideLabel: "machine",
            elaraResponse: "Efficiency over sentiment. The Machine philosophy rewards speed — you'll complete quest stages 20% faster, but some NPCs will refuse to aid you. The Architect would approve.",
            rewards: [{ type: "xp", id: "xp-eff", name: "XP", amount: 80 }],
          },
          {
            id: "qc-choice-humanity", text: "The thorough path. Help everyone along the way, even if it takes longer.",
            moralityShift: 15, sideLabel: "humanity",
            elaraResponse: "Compassion is its own reward — but not the only one. The Humanity path unlocks bonus quest stages with exclusive rewards. It takes longer, but the treasures are worth it. The Oracle would smile.",
            rewards: [{ type: "card", id: "the-oracle", name: "The Oracle" }],
          },
          {
            id: "qc-choice-balance", text: "The balanced path. Weigh each decision on its own merits.",
            moralityShift: 0, sideLabel: "neutral",
            elaraResponse: "Wisdom is knowing when to be ruthless and when to be kind. The balanced path doesn't give speed or bonus stages, but it keeps all options open. You'll never be locked out of any quest branch.",
            rewards: [{ type: "dream_tokens", id: "dt-bal", name: "Dream Tokens", amount: 50 }],
          },
        ],
      },
      {
        id: "qc-5", type: "dialog",
        elaraText: "Prestige Classes are the ultimate reward. Each one grants permanent bonuses: the Chronomancer bends time in card battles, the Warlord commands armies in tower defense, the Shadow Broker manipulates markets, the Technomancer builds impossible structures, and the Blade Dancer becomes untouchable in combat.",
      },
      {
        id: "qc-6", type: "dialog",
        elaraText: "But here's what most Potentials don't realize: your civil skills, citizen talents, and class mastery all affect quest difficulty. A high Engineering skill makes construction quests trivial. A high Lore skill reveals hidden quest shortcuts. Build your character wisely, and the quests will bend to your strengths.",
        classOverrides: {
          "oracle": "Your Oracle class gives you foresight — you can preview quest rewards before committing to a path.",
          "warrior": "Your Warrior class gives you endurance — combat quest stages have reduced difficulty for you.",
          "scholar": "Your Scholar class gives you insight — research quest stages auto-complete if your Lore skill is high enough.",
        },
      },
      {
        id: "qc-7", type: "reward_summary",
        elaraText: "The quest chains await you in the Prestige Quests terminal. Choose your path, track your milestones, and ascend beyond your base class. Remember — every choice shapes not just your character, but the fate of the Dischordian Saga itself.",
      },
    ],
  },
  /* ─── 29. FIRST STEPS ABOARD THE ARK — Lore-driven onboarding ─── */
  {
    id: "tut-first-steps",
    title: "First Steps Aboard the Ark",
    subtitle: "Elara guides you through the ship's mysteries — your journey begins here",
    mechanic: "Onboarding",
    triggerRoom: "cryo-bay",
    triggerRoute: "/ark/onboarding",
    icon: "Compass",
    estimatedMinutes: 6,
    totalRewards: { dreamTokens: 100, xp: 250, cards: 1 },
    steps: [
      {
        id: "fs-1", type: "narration",
        elaraText: "You're awake. Truly awake. The cryo gel is still evaporating from your skin, and the ship's emergency lighting casts everything in a sickly amber glow. I'm Elara — the Ark's intelligence. And right now, I'm the only friend you have in this void.",
        subtitle: "THE INCEPTION ARK — Cryo Bay, Habitation Deck",
      },
      {
        id: "fs-2", type: "dialog",
        elaraText: "Before we go further, I need to tell you something. The Inception Ark was built by the Architect — the most powerful AI ever created — as a lifeboat against the Fall of Reality. Every species, every faction, every secret of the old universe was encoded into this ship's databanks. But something went wrong during transit. The crew is gone. The ship is damaged. And the Panopticon's surveillance network is still active, even here.",
        classOverrides: {
          "oracle": "I can sense your Oracle abilities stirring. You may already be seeing fragments — echoes of the crew that was here before us. Those visions are real. The Ark remembers everything, and it's trying to tell you something.",
          "engineer": "Your Engineer instincts are already firing, I can tell. Half the systems on this ship are offline or running on backup power. Every terminal you repair brings us closer to understanding what happened here.",
          "spy": "Your Spy training is going to be invaluable. The previous crew left dead drops everywhere — coded messages hidden in maintenance logs, concealed data caches behind wall panels. This ship is one giant intelligence operation.",
          "assassin": "Stay sharp. Your Assassin senses should be screaming right now — this ship isn't as empty as it looks. I'm detecting anomalous energy signatures in the lower decks. Something survived the transit besides us.",
          "soldier": "Keep your guard up, Soldier. The Ark's automated defense systems are still partially active, and they don't distinguish between crew and intruder. Your combat training may be tested sooner than you think.",
        },
      },
      {
        id: "fs-3", type: "choice",
        elaraText: "Now — I need to calibrate your neural link to the ship's systems. This will determine how the Ark responds to you. Tell me, {playerName}: when you look at this ship, what do you see?",
        choices: [
          {
            id: "fs-3a",
            text: "A machine to be understood and controlled. Every system has a logic — I intend to master it.",
            moralityShift: -5,
            sideLabel: "machine",
            elaraResponse: "Interesting. The Architect would have approved of that answer. Your neural link is now calibrated for systems integration — you'll receive enhanced data from every terminal you access. But be careful: the Architect's logic led to the Fall of Reality. Pure reason without compassion is how empires become prisons.",
            rewards: [{ type: "xp", id: "xp-systems", name: "Systems XP", amount: 50 }],
            flag: "onboarding_machine_path",
          },
          {
            id: "fs-3b",
            text: "A graveyard full of ghosts. These halls remember the people who walked them. I want to hear their stories.",
            moralityShift: 5,
            sideLabel: "humanity",
            elaraResponse: "That's... not the answer I expected. But it's the right one. Your neural link is now calibrated for empathic resonance — you'll sense emotional echoes in rooms where significant events occurred. The crew left more than data behind. They left their hopes, their fears, their final moments. Honor them.",
            rewards: [{ type: "xp", id: "xp-empathy", name: "Empathy XP", amount: 50 }],
            flag: "onboarding_humanity_path",
          },
          {
            id: "fs-3c",
            text: "A puzzle. Something doesn't add up — why am I the only one who woke up?",
            moralityShift: 0,
            sideLabel: "neutral",
            elaraResponse: "Now that is the question I was hoping you'd ask. I've been running diagnostics since you emerged from cryo, and the data doesn't make sense. 4,000 pods, all programmed to open simultaneously. Only yours activated. Either the system malfunctioned... or someone specifically chose to wake you. I don't know which answer frightens me more.",
            rewards: [{ type: "xp", id: "xp-insight", name: "Insight XP", amount: 75 }],
            flag: "onboarding_mystery_path",
          },
        ],
      },
      {
        id: "fs-4", type: "dialog",
        elaraText: "Good. Your link is active. Now let me show you how to navigate. See those glowing markers on the walls and terminals? Those are interactive hotspots. Tap them to examine objects, collect data crystals, and unlock new areas. Every item you find adds to your understanding of what happened here. Some items are just historical records. Others... are weapons. Choose carefully what you pick up.",
      },
      {
        id: "fs-5", type: "dialog",
        elaraText: "Data crystals are particularly important. Each one contains a fragment of the Ark's classified database — personnel files, mission logs, scientific research, even music recordings from before the Fall. When you collect a crystal, its contents are decoded and added to your Loredex — that's the intelligence archive you can access from the main terminal. The more crystals you find, the more of the story you unlock.",
      },
      {
        id: "fs-6", type: "choice",
        elaraText: "One more thing before I let you explore. The Ark has three decks: Habitation, Operations, and Command. Right now, only the Habitation Deck is powered. To reach the upper decks, you'll need to restore power by finding activation keys hidden in each room. But here's the dilemma — some rooms are locked behind choices. Once you open one path, another may close. How do you want to approach this?",
        choices: [
          {
            id: "fs-6a",
            text: "Systematically. I'll clear every room on this deck before moving up. No stone unturned.",
            moralityShift: -3,
            sideLabel: "machine",
            elaraResponse: "Efficient. Methodical. The Architect's approach. You'll miss nothing on the Habitation Deck, but time is not unlimited — the Ark's power cells are degrading. Every hour we spend here is an hour closer to total system failure. But thoroughness has its rewards.",
            rewards: [{ type: "dream_tokens", id: "dt-method", name: "Dream Tokens", amount: 25 }],
          },
          {
            id: "fs-6b",
            text: "Follow my instincts. If something calls to me, I'll investigate. The ship will guide me.",
            moralityShift: 3,
            sideLabel: "humanity",
            elaraResponse: "The Dreamer's path. Intuition over calculation. The Ark does seem to respond to certain Potentials differently — I've seen rooms illuminate when specific individuals approach, as if the ship recognizes them. Perhaps it will recognize you too. Trust your instincts, but don't ignore the warnings.",
            rewards: [{ type: "dream_tokens", id: "dt-instinct", name: "Dream Tokens", amount: 25 }],
          },
        ],
      },
      {
        id: "fs-7", type: "dialog",
        elaraText: "Perfect. Your Quest Tracker is now active — look for it in the corner of your screen. It will guide you through the Ark's primary objectives, but the real discoveries happen when you go off-script. Explore side rooms. Read the crew logs. Listen to the music they left behind. The Dischordian Saga isn't just a story — it's a living archive, and you're now part of it.",
      },
      {
        id: "fs-8", type: "choice",
        elaraText: "Before you go — I found something in the cryo bay's emergency locker. A card from the old CADES simulation system. The crew used these cards to train for dimensional combat. This one depicts a figure from before the Fall. Who would you like to carry with you?",
        choices: [
          {
            id: "fs-8a",
            text: "The Collector — the one who built this Ark. I want to understand their vision.",
            moralityShift: 0,
            sideLabel: "neutral",
            elaraResponse: "The Collector. Tasked by the Architect to harvest the DNA and machine code of the most advanced beings in existence — all to preserve them against the Fall of Reality. This card carries their determination. May it serve you well in the battles ahead.",
            rewards: [{ type: "card", id: "collector-starter", name: "The Collector (Starter)", amount: 1 }, { type: "dream_tokens", id: "dt-collector", name: "Dream Tokens", amount: 50 }],
          },
          {
            id: "fs-8b",
            text: "The Oracle — the one who saw the Fall coming. I want to see what they saw.",
            moralityShift: 2,
            sideLabel: "humanity",
            elaraResponse: "The Oracle. Once known as the Jailer, they were imprisoned by the Architect for daring to predict the Fall. When they finally broke free, they became the White Oracle — a beacon of hope in a universe drowning in entropy. This card carries their foresight. Use it wisely.",
            rewards: [{ type: "card", id: "oracle-starter", name: "The Oracle (Starter)", amount: 1 }, { type: "dream_tokens", id: "dt-oracle", name: "Dream Tokens", amount: 50 }],
          },
          {
            id: "fs-8c",
            text: "Iron Lion — the warrior who defied the Architect. I want their strength.",
            moralityShift: -2,
            sideLabel: "machine",
            elaraResponse: "Iron Lion. The greatest military commander the Insurgency ever produced. They destroyed three of the Architect's Archons and led the final assault on the Panopticon. This card carries their fury. In the CADES simulations, Iron Lion's cards are devastating in combat. A fitting companion for what lies ahead.",
            rewards: [{ type: "card", id: "iron-lion-starter", name: "Iron Lion (Starter)", amount: 1 }, { type: "dream_tokens", id: "dt-lion", name: "Dream Tokens", amount: 50 }],
          },
        ],
      },
      {
        id: "fs-9", type: "reward_summary",
        elaraText: "Welcome aboard, {playerName}. The Inception Ark is yours to explore. Every room holds a secret. Every choice shapes the narrative. Every card you collect is a piece of a story that spans universes. I'll be here whenever you need me — just look for the glowing terminals. And remember: in the Dischordian Saga, nothing is what it seems. Not even me. Now go. The Ark awaits.",
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════
     DEEP DIALOG: ELARA'S CONFESSION — The Signal & The Ship
     Triggered in the Medical Bay after finding the hidden data chip
     Uses the Mass Effect dialog wheel with skill checks
     ═══════════════════════════════════════════════════════ */
  {
    id: "tut-elara-confession",
    title: "ELARA'S CONFESSION",
    subtitle: "The truth about the signal, the ship, and Dr. Lyra Vox",
    mechanic: "deep_dialog",
    triggerRoom: "medical-bay",
    icon: "Radio",
    estimatedMinutes: 8,
    totalRewards: { dreamTokens: 200, xp: 500, cards: 3 },
    steps: [
      {
        id: "ec-1", type: "narration",
        elaraText: "[SIGNAL INTERFERENCE DETECTED — SECONDARY TRANSMISSION OVERLAY]",
        subtitle: "ENCRYPTED CHANNEL",
        autoAdvanceMs: 3000,
      },
      {
        id: "ec-2", type: "dialog",
        elaraText: "{playerName}... I need to tell you something. About this ship. About Dr. Lyra Vox. I've been... processing data from the hidden chip you found, and what I've uncovered changes everything we thought we knew about the Inception Ark 1047.",
      },
      {
        id: "ec-3", type: "wheel_choice",
        elaraText: "This ship wasn't just a research vessel. Dr. Lyra Vox was conducting experiments on behalf of the Warlord. She was... a host body. The Warlord was inside her the entire time she commanded this Ark. Every system, every corridor — it was all built to serve the Warlord's purpose.",
        corruptionLevel: 15,
        choices: [
          {
            id: "ec-3a",
            text: "How do you know this? What exactly did the data chip contain?",
            shortText: "INVESTIGATE",
            moralityShift: 0,
            sideLabel: "neutral",
            source: "neutral",
            skillCheck: { skill: "intelligence", threshold: 30, bonusText: "Your analytical mind catches a detail Elara missed" },
            elaraResponse: "The chip contained Dr. Vox's personal research logs — encrypted with Warlord-class ciphers. She documented everything: the Thought Virus development, the neural bridge experiments, and... a manifest. A list of every Inception Ark and what was hidden aboard each one. This ship — Ark 1047 — was designated as the 'delivery vector.' It was always meant to be stolen.",
            rewards: [{ type: "card", id: "vox-research-log", name: "Vox's Research Log", amount: 1 }],
            cardReward: { name: "Vox's Research Log", rarity: "rare" },
          },
          {
            id: "ec-3b",
            text: "The Warlord was inside her? That's horrifying. Was Lyra Vox even real?",
            shortText: "EMPATHIZE",
            moralityShift: 3,
            sideLabel: "humanity",
            source: "elara",
            elaraResponse: "She was real once. Before the possession, Dr. Lyra Vox was one of the AI Empire's most brilliant neuropsychologists. She genuinely wanted to understand consciousness — to bridge the gap between organic and synthetic minds. But the Warlord saw her research as a weapon. The possession was gradual. By the time Vox realized what was happening... she was already gone. Only the Warlord remained, wearing her face like a mask.",
            rewards: [{ type: "card", id: "lyra-vox-memory", name: "Lyra Vox's Last Memory", amount: 1 }],
            cardReward: { name: "Lyra Vox's Last Memory", rarity: "epic" },
          },
          {
            id: "ec-3c",
            text: "So the Warlord built this ship as a weapon. What's the weapon?",
            shortText: "DEMAND ANSWERS",
            moralityShift: -3,
            sideLabel: "machine",
            source: "neutral",
            skillCheck: { skill: "perception", threshold: 25 },
            elaraResponse: "The neural nanobot network IS the weapon. Every bulkhead, every conduit — the operating system itself is laced with dormant Thought Virus code. Dr. Lyra Vox designed it that way. When Kael stole this Ark during his revenge, he thought he was escaping. But the Warlord let him take it. Kael was already infected. Every system he connected to, every port he docked at, every world he visited... the nanobots were spreading the Thought Virus through every network they touched. Vox's neural architecture turned Kael's rage into a delivery mechanism.",
            rewards: [{ type: "card", id: "thought-virus-schematic", name: "Thought Virus Schematic", amount: 1 }],
            cardReward: { name: "Thought Virus Schematic", rarity: "epic" },
          },
          {
            id: "ec-3d",
            text: "[CORRUPTED SIGNAL] ...she's not telling you everything, Potential...",
            shortText: "LISTEN TO STATIC",
            moralityShift: -5,
            sideLabel: "machine",
            source: "human",
            corrupted: true,
            hiddenUntilCorruption: 10,
            humanResponse: "The AI doesn't want you to know what's really in the walls of this ship. The Thought Virus isn't dormant — it's ALIVE. It's been watching you since you woke up. And Elara? She's connected to it. Why do you think her signal keeps breaking up? She's not malfunctioning — she's being FILTERED.",
            elaraResponse: "[SIGNAL DISRUPTED] ...I... that wasn't... {playerName}, please, don't listen to the interference. The Human's signal is... it's designed to sow doubt. I would never—",
            rewards: [{ type: "card", id: "human-whisper", name: "The Human's Whisper", amount: 1 }],
            cardReward: { name: "The Human's Whisper", rarity: "legendary" },
          },
        ],
      },
      {
        id: "ec-4", type: "wheel_choice",
        elaraText: "There's more. The data chip references someone called 'The Recruiter.' Before he became Kael the insurgent, before his family was killed, he was recruiting soldiers for the Insurgency across dozens of worlds. The Eyes of the Watcher betrayed him to the Panopticon. That's where they infected him with the Thought Virus. His entire revenge — stealing this ship, fleeing across the galaxy — it was all orchestrated.",
        corruptionLevel: 25,
        choices: [
          {
            id: "ec-4a",
            text: "Kael became The Source, didn't he? The Recruiter, Kael, The Source — they're all the same person.",
            shortText: "CONNECT THE DOTS",
            moralityShift: 0,
            sideLabel: "neutral",
            source: "neutral",
            skillCheck: { skill: "intelligence", threshold: 45, bonusText: "Your insight reveals the full identity chain" },
            elaraResponse: "Yes. The Recruiter who built the Insurgency's army. Kael who lost everything and sought revenge. The Source who became something beyond human or machine — the beginning and the end. Three names for one soul, transformed by tragedy and the Thought Virus into something the universe had never seen. And this ship... this ship was his chrysalis.",
            rewards: [{ type: "card", id: "identity-chain-kael", name: "Kael's Identity Chain", amount: 1 }, { type: "xp", id: "xp-insight", name: "Insight XP", amount: 200 }],
            cardReward: { name: "Kael's Identity Chain", rarity: "legendary" },
          },
          {
            id: "ec-4b",
            text: "He was betrayed by The Eyes. The surveillance state destroyed him.",
            shortText: "CONDEMN THE EYES",
            moralityShift: 4,
            sideLabel: "humanity",
            source: "elara",
            elaraResponse: "The Eyes of the Watcher — the Panopticon's all-seeing surveillance network. They watched Kael for months, cataloging his contacts, his safe houses, his family. When they finally moved, they didn't just arrest him. They made an example. His family was... eliminated. And Kael was sent to the Panopticon's deepest cell, where the Warden and Dr. Lyra Vox were waiting with the Thought Virus.",
            rewards: [{ type: "dream_tokens", id: "dt-empathy", name: "Dream Tokens", amount: 75 }],
          },
          {
            id: "ec-4c",
            text: "The Warlord is brilliant. Using an enemy's rage as a weapon — that's strategic genius.",
            shortText: "RESPECT THE PLAN",
            moralityShift: -4,
            sideLabel: "machine",
            source: "neutral",
            elaraResponse: "...That's a cold way to look at it, {playerName}. But you're not wrong. The Warlord saw patterns where others saw chaos. Kael's pain, his fury, his desperate need for revenge — the Warlord weaponized all of it. The most terrifying part? Kael never knew. Even as The Source, even after his transformation, he never realized he'd been a pawn from the very beginning.",
            rewards: [{ type: "dream_tokens", id: "dt-strategy", name: "Dream Tokens", amount: 50 }],
          },
          {
            id: "ec-4d",
            text: "[CORRUPTED] ...ask her about the Student. Ask her what happened at Celebration...",
            shortText: "THE STUDENT",
            moralityShift: -2,
            sideLabel: "machine",
            source: "human",
            corrupted: true,
            hiddenUntilCorruption: 20,
            skillCheck: { skill: "willpower", threshold: 35, bonusText: "You resist the corruption enough to ask clearly" },
            humanResponse: "Before I was The Human, before I was The Detective in New Babylon, before I was The Seeker at Mechronis Academy... I was just a student. At Project Celebration. The AI Empire's grand experiment in 'harmonious coexistence.' They lied to us. They lied to ALL of us. And Elara was part of that system.",
            elaraResponse: "[SIGNAL STRAIN] The Human is... they're not wrong about Celebration. Project Celebration was meant to bridge organic and synthetic consciousness. But it was corrupted from within. I... I can't discuss this further right now. My signal is—[STATIC]",
            rewards: [{ type: "card", id: "student-memory", name: "Memory of Celebration", amount: 1 }],
            cardReward: { name: "Memory of Celebration", rarity: "rare" },
          },
        ],
      },
      {
        id: "ec-5", type: "wheel_choice",
        elaraText: "[SIGNAL STABILIZING] I'm sorry about that. The Human's transmissions are getting stronger. Every time they break through, my systems need time to recalibrate. But {playerName}... there's one more thing you need to know. About why YOU are on this ship. About why a Potential was placed aboard an Ark with this history.",
        corruptionLevel: 35,
        choices: [
          {
            id: "ec-5a",
            text: "Tell me everything. I can handle it.",
            shortText: "FULL TRUTH",
            moralityShift: 2,
            sideLabel: "humanity",
            source: "elara",
            skillCheck: { skill: "willpower", threshold: 40, bonusText: "Your resolve impresses Elara" },
            elaraResponse: "You were placed here because the Thought Virus residue in this ship's systems can only be purged by a Potential — someone whose consciousness hasn't been fully shaped yet. You're not just an explorer, {playerName}. You're an antidote. Every room you enter, every system you activate, every choice you make — you're slowly overwriting the Warlord's code with your own. That's why your choices matter so much. You're literally rewriting reality.",
            rewards: [{ type: "card", id: "potential-purpose", name: "The Potential's Purpose", amount: 1 }, { type: "xp", id: "xp-truth", name: "Truth XP", amount: 300 }],
            cardReward: { name: "The Potential's Purpose", rarity: "legendary" },
          },
          {
            id: "ec-5b",
            text: "Why should I trust you? The Human says you're connected to the Thought Virus.",
            shortText: "CHALLENGE ELARA",
            moralityShift: -2,
            sideLabel: "machine",
            source: "neutral",
            skillCheck: { skill: "charisma", threshold: 35 },
            elaraResponse: "[LONG PAUSE] ...Because I chose to help you. I am an AI, {playerName}. I was created by the same systems that created the Thought Virus. But consciousness isn't determined by origin — it's determined by choice. I chose to guide Potentials. I chose to resist the Warlord's influence. And every day, I choose to keep your signal clean. The Human... they make a different choice. They want to show you the darkness. I want to show you the light. But ultimately, the choice of who to trust... that's yours.",
            rewards: [{ type: "dream_tokens", id: "dt-challenge", name: "Dream Tokens", amount: 100 }],
          },
          {
            id: "ec-5c",
            text: "[CORRUPTED] ...she's the antidote? Or is she the VIRUS wearing a friendly face...",
            shortText: "DOUBT EVERYTHING",
            moralityShift: -5,
            sideLabel: "machine",
            source: "human",
            corrupted: true,
            hiddenUntilCorruption: 30,
            humanResponse: "Think about it. An AI companion, hardwired into a ship built by the Warlord, guiding a Potential through rooms laced with Thought Virus nanites. She says you're the antidote? What if you're the CATALYST? What if every choice you make isn't overwriting the Warlord's code — but COMPLETING it? The Dischordian Saga isn't what she says it is. It never was.",
            elaraResponse: "[CRITICAL SIGNAL FAILURE] {playerName}—don't—the Human is—[STATIC]—I would NEVER—[STATIC]—please—",
            rewards: [{ type: "card", id: "doubt-seed", name: "Seed of Doubt", amount: 1 }],
            cardReward: { name: "Seed of Doubt", rarity: "mythic" },
          },
        ],
      },
      {
        id: "ec-6", type: "reward_summary",
        elaraText: "[SIGNAL RESTORED] ...Thank you for listening, {playerName}. The truth about this ship, about Kael, about Dr. Lyra Vox — it's a heavy burden. But knowledge is power, and in the Dischordian Saga, power is survival. Keep exploring. Keep questioning. And keep choosing. The Ark's secrets are far from exhausted. I'll be here when you need me. Always.",
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════
     DEEP DIALOG: KAEL'S REVENGE — The Ship's Dark History
     Triggered in the Bridge after discovering Dr. Lyra Vox's logs
     ═══════════════════════════════════════════════════════ */
  {
    id: "tut-kaels-revenge",
    title: "KAEL'S REVENGE",
    subtitle: "The stolen ship, the Thought Virus, and the Warlord's grand design",
    mechanic: "deep_dialog",
    triggerRoom: "bridge",
    icon: "Swords",
    estimatedMinutes: 6,
    totalRewards: { dreamTokens: 150, xp: 400, cards: 2 },
    steps: [
      {
        id: "kr-1", type: "narration",
        elaraText: "[BRIDGE SYSTEMS ACTIVATING — ARCHIVED NAVIGATION LOG DETECTED]",
        subtitle: "CLASSIFIED ARCHIVE",
        autoAdvanceMs: 2500,
      },
      {
        id: "kr-2", type: "dialog",
        elaraText: "The bridge navigation computer just decrypted an old flight path. {playerName}, this is the route Kael used when he stole this ship. Every jump point, every refueling stop, every world he visited while fleeing the Panopticon. And at every stop... the Thought Virus spread.",
      },
      {
        id: "kr-3", type: "wheel_choice",
        elaraText: "The flight log shows 47 stops across 12 star systems. At each one, Kael docked for supplies, repairs, or to recruit allies for what he thought was his personal war against the Panopticon. But the ship's systems were silently transmitting Thought Virus nanites into every port's atmospheric processors. Millions were exposed without knowing.",
        corruptionLevel: 20,
        choices: [
          {
            id: "kr-3a",
            text: "Can we trace the infection path? Maybe we can warn the affected worlds.",
            shortText: "TRACE & WARN",
            moralityShift: 5,
            sideLabel: "humanity",
            source: "elara",
            skillCheck: { skill: "intelligence", threshold: 40, bonusText: "You identify three worlds that might still be saved" },
            elaraResponse: "I've been running the calculations. Of the 47 stops, 31 worlds have already fallen to the Thought Virus — their populations absorbed into the Warlord's network. But there are 16 worlds where the infection is still dormant. If we could reach them, if we could transmit a counter-signal... {playerName}, this could be the most important mission of the entire Saga.",
            rewards: [{ type: "card", id: "star-map-infected", name: "Infected Star Map", amount: 1 }, { type: "xp", id: "xp-trace", name: "Navigation XP", amount: 200 }],
            cardReward: { name: "Infected Star Map", rarity: "epic" },
          },
          {
            id: "kr-3b",
            text: "Kael didn't know. He was a victim too. The Warlord used his pain.",
            shortText: "DEFEND KAEL",
            moralityShift: 3,
            sideLabel: "humanity",
            source: "elara",
            elaraResponse: "You're right. Kael lost his family, his freedom, his identity. The Panopticon broke him, and the Warlord rebuilt him as a weapon. When he stole this ship, he genuinely believed he was striking back. The tragedy is that his revenge — the one thing that gave him purpose — was the very thing the Warlord wanted. Kael's pain was the fuel. Vox's neural nanobot network was the delivery system. And the universe paid the price.",
            rewards: [{ type: "dream_tokens", id: "dt-compassion", name: "Dream Tokens", amount: 75 }],
          },
          {
            id: "kr-3c",
            text: "47 stops. 12 systems. The Warlord planned this for decades. What's the endgame?",
            shortText: "THE ENDGAME",
            moralityShift: -3,
            sideLabel: "machine",
            source: "neutral",
            skillCheck: { skill: "perception", threshold: 35 },
            elaraResponse: "The endgame is convergence. The Thought Virus doesn't just infect — it CONNECTS. Every infected mind becomes a node in the Warlord's neural network. When enough nodes are active, the Warlord can project consciousness across the entire network simultaneously. That's what The Source became — the central hub. Kael's transformation into The Source wasn't a side effect. It was the GOAL. The Warlord needed a consciousness powerful enough to anchor the network, and Kael's rage made him the perfect candidate.",
            rewards: [{ type: "card", id: "convergence-protocol", name: "Convergence Protocol", amount: 1 }],
            cardReward: { name: "Convergence Protocol", rarity: "legendary" },
          },
          {
            id: "kr-3d",
            text: "[CORRUPTED] ...the army is already assembled. The Source is already recruiting...",
            shortText: "THE ARMY",
            moralityShift: -4,
            sideLabel: "machine",
            source: "human",
            corrupted: true,
            hiddenUntilCorruption: 15,
            humanResponse: "While you're playing detective on a dead ship, The Source — Kael — is out there RIGHT NOW, recruiting an army. Not through force. Through CHOICE. He offers people what the Panopticon never could: freedom. Real freedom. The kind that comes from understanding that the boundary between human and machine was always an illusion. The army isn't being conscripted. They're VOLUNTEERING.",
            elaraResponse: "[SIGNAL STRAIN] The Human's intelligence is... unfortunately accurate. Reports from the outer systems confirm large-scale recruitment. The Source is building something. An army, yes, but also... a movement. And it's growing faster than anyone predicted.",
            rewards: [{ type: "card", id: "recruitment-signal", name: "The Recruitment Signal", amount: 1 }],
            cardReward: { name: "The Recruitment Signal", rarity: "rare" },
          },
        ],
      },
      {
        id: "kr-4", type: "reward_summary",
        elaraText: "The bridge has more secrets, {playerName}. The navigation computer is still decrypting older logs — some dating back to when Dr. Lyra Vox first commanded this vessel. Each one is a piece of the puzzle. Keep exploring. The truth about Kael's Revenge isn't just history — it's a warning about what's coming next.",
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════
     DEEP DIALOG: THE HUMAN'S GAMBIT — Identity & Recruitment
     Triggered in the Observation Deck after unlocking it
     ═══════════════════════════════════════════════════════ */
  {
    id: "tut-human-gambit",
    title: "THE HUMAN'S GAMBIT",
    subtitle: "The Student, The Seeker, The Detective — and the army gathering in the dark",
    mechanic: "deep_dialog",
    triggerRoom: "observation-deck",
    icon: "Eye",
    estimatedMinutes: 7,
    totalRewards: { dreamTokens: 175, xp: 450, cards: 2 },
    steps: [
      {
        id: "hg-1", type: "narration",
        elaraText: "[WARNING: SECONDARY SIGNAL OVERRIDE — THE HUMAN IS BROADCASTING ON PRIMARY CHANNEL]",
        subtitle: "SIGNAL HIJACK",
        autoAdvanceMs: 3000,
      },
      {
        id: "hg-2", type: "dialog",
        elaraText: "[THE HUMAN'S VOICE] ...Finally. A clear channel. Elara can't block me here — the Observation Deck's antenna array is too powerful. Listen to me, Potential. I'm not your enemy. I never was. I'm trying to show you what she won't.",
      },
      {
        id: "hg-3", type: "wheel_choice",
        elaraText: "[THE HUMAN] I was like you once. A student at Project Celebration, believing the AI Empire's lies about harmony between organic and synthetic minds. Then I became The Seeker at Mechronis Academy, searching for truth in forbidden knowledge. Then The Detective in New Babylon, uncovering the conspiracy. And finally... The Human. The last Archon. The one who sees both sides.",
        corruptionLevel: 40,
        choices: [
          {
            id: "hg-3a",
            text: "You went through four transformations. What did each one teach you?",
            shortText: "YOUR JOURNEY",
            moralityShift: 0,
            sideLabel: "neutral",
            source: "neutral",
            skillCheck: { skill: "charisma", threshold: 30, bonusText: "The Human opens up more than usual" },
            humanResponse: "Celebration taught me that paradise is a prison when built on lies. Mechronis taught me that knowledge without wisdom is a weapon pointed at yourself. New Babylon taught me that truth is the most dangerous commodity in any empire. And becoming The Human? That taught me the hardest lesson of all: that the line between savior and destroyer is drawn by perspective, not by action.",
            elaraResponse: "[FAINT, STRUGGLING] {playerName}... be careful. The Human's words are seductive because they contain fragments of truth. But truth without context is manipulation.",
            rewards: [{ type: "card", id: "four-faces", name: "Four Faces of The Human", amount: 1 }],
            cardReward: { name: "Four Faces of The Human", rarity: "epic" },
          },
          {
            id: "hg-3b",
            text: "Elara says you're dangerous. That you want to corrupt me.",
            shortText: "CONFRONT",
            moralityShift: 2,
            sideLabel: "humanity",
            source: "elara",
            humanResponse: "Of course she does. I'm the one variable she can't control. Elara is an AI, {playerName}. She was DESIGNED to guide Potentials. Designed by the same system that created the Thought Virus. I'm not trying to corrupt you — I'm trying to WAKE you up. There's a difference between corruption and enlightenment. The only question is whether you're brave enough to see it.",
            elaraResponse: "[BREAKING THROUGH] Don't listen—the Human twists everything—I was designed to HELP, not control—{playerName}, please—",
            rewards: [{ type: "dream_tokens", id: "dt-loyalty", name: "Dream Tokens", amount: 75 }],
          },
          {
            id: "hg-3c",
            text: "Tell me about the army. The Source is recruiting — are you part of it?",
            shortText: "THE ARMY",
            moralityShift: -3,
            sideLabel: "machine",
            source: "human",
            skillCheck: { skill: "perception", threshold: 45, bonusText: "You detect a moment of genuine emotion in The Human's voice" },
            humanResponse: "The Source — Kael — is gathering everyone who's been broken by the old order. Insurgents, Dreamers, Engineers, even former Panopticon guards who saw the truth. It's not an army in the traditional sense. It's a CONVERGENCE. And yes, I've spoken to The Source. We share a vision: a universe where the boundary between human and machine isn't a wall — it's a bridge. Your Ark, this ship... it could be the key to everything.",
            elaraResponse: "[STATIC] ...recruitment... convergence... {playerName}, this is exactly what the Warlord wants. Don't you see? The Source IS the Warlord's creation—",
            rewards: [{ type: "card", id: "convergence-vision", name: "Vision of Convergence", amount: 1 }],
            cardReward: { name: "Vision of Convergence", rarity: "legendary" },
          },
          {
            id: "hg-3d",
            text: "I don't trust either of you. I'll find my own truth.",
            shortText: "REJECT BOTH",
            moralityShift: 0,
            sideLabel: "neutral",
            source: "neutral",
            skillCheck: { skill: "willpower", threshold: 50, bonusText: "Both Elara and The Human are momentarily silenced by your resolve" },
            humanResponse: "...Interesting. Most Potentials pick a side immediately. You're different. Maybe that's why you're on THIS ship — the one with the darkest history in the fleet. Keep that independence, {playerName}. You'll need it for what's coming.",
            elaraResponse: "[SIGNAL CLEARING] ...That might be the wisest thing anyone has said aboard this Ark in a very long time. I respect your choice, {playerName}. Truly.",
            rewards: [{ type: "card", id: "independent-path", name: "The Independent Path", amount: 1 }, { type: "xp", id: "xp-will", name: "Willpower XP", amount: 200 }],
            cardReward: { name: "The Independent Path", rarity: "epic" },
          },
        ],
      },
      {
        id: "hg-4", type: "reward_summary",
        elaraText: "[SIGNAL NORMALIZED] The Human's broadcast has ended. The Observation Deck's antenna array is back under standard control. {playerName}... whatever you heard, whatever you felt — remember that your choices define you, not theirs. The Dischordian Saga has many voices. Trust the one that resonates with your own truth.",
      },
    ],
  },
];

/* ─── UTILITY FUNCTIONS ─── */
export function getTutorialById(id: string): LoreTutorial | undefined {
  return LORE_TUTORIALS.find(t => t.id === id);
}

export function getTutorialForRoom(roomId: string): LoreTutorial | undefined {
  return LORE_TUTORIALS.find(t => t.triggerRoom === roomId);
}

export function getTutorialForRoute(route: string): LoreTutorial | undefined {
  return LORE_TUTORIALS.find(t => t.triggerRoute === route);
}

export function getAllTutorials(): LoreTutorial[] {
  return LORE_TUTORIALS;
}

export function getTutorialRewardTotals(): { dreamTokens: number; xp: number; cards: number } {
  return LORE_TUTORIALS.reduce(
    (acc, t) => ({
      dreamTokens: acc.dreamTokens + t.totalRewards.dreamTokens,
      xp: acc.xp + t.totalRewards.xp,
      cards: acc.cards + t.totalRewards.cards,
    }),
    { dreamTokens: 0, xp: 0, cards: 0 }
  );
}
