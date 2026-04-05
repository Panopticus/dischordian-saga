/* ═══════════════════════════════════════════════════════
   LIVING UNIVERSE EVENTS — Emergent from Player Behavior

   Events are NOT triggered by timers. They EMERGE from the
   collective patterns of player decisions. The universe is
   literally reshaped by what the community does.

   Each event has "pressure meters" that fill based on specific
   player behaviors. When enough community members act a certain way,
   the event manifests as a natural consequence.

   No fixed timers. No artificial triggers. Player behavior = reality.

   Examples:
   - Mass deaths → Necromancer returns
   - Mass betrayals → The Architect strengthens
   - Mass trust gains → The Dreamer wakes
   - Mass exploration → The Antiquarian reveals hidden timelines
   - Mass destruction → The Source accelerates Terminus
   ═══════════════════════════════════════════════════════ */

/* ─── EMERGENT EVENT DEFINITION ─── */

export interface EmergentEvent {
  id: string;
  name: string;
  tagline: string;
  /** Which NPC/entity drives this */
  drivingForce: string;
  /** What community behavior feeds it */
  fuelSource: string;
  /** Counter-behavior that resists it */
  counterForce: string;
  /** What lore this event explores */
  loreTheme: string;
  /** Game systems impacted */
  impactScope: string[];
  /** Cycle length (roughly) */
  typicalCycleDays: number;
  /** Is it currently active? */
  narrative: EventNarrative;
}

export interface EventNarrative {
  /** Why it's happening (from player actions) */
  emergenceExplanation: string;
  /** NPC reactions when it triggers */
  npcReactions: Record<string, string>;
  /** How it resolves naturally */
  resolution: string;
}

/* ═══ EVENT 1: THE NECROMANCER RETURNS ═══ */

export const NECROMANCER_RETURN_EVENT: EmergentEvent = {
  id: "necromancer_return",
  name: "The Necromancer Returns",
  tagline: "When enough die, he wakes.",
  drivingForce: "The Necromancer (10th Archon) via Resurrection Protocols",
  fuelSource: "Community deaths across all game modes",
  counterForce: "Coalition banishment quests + reclaiming Death Worlds",
  loreTheme: "Death as currency, resurrection as systemic force",
  impactScope: ["fight", "chess", "dischordia", "terminus", "trade_empire", "pet_battles", "all"],
  typicalCycleDays: 90,
  narrative: {
    emergenceExplanation: "The community has been dying. A lot. Every death — clones in the Arena, fighters in combat, pets in battles — feeds the Resurrection Protocols. The Necromancer designed this system before his exile. He's been patient. You fed him.",
    npcReactions: {
      elara: "I detected it during a routine diagnostic. It's OUR fault. We've been dying enough to wake a god.",
      the_human: "Thazulok. I served alongside him as an Archon. He's patient. Methodical. He doesn't return until the universe has earned his return.",
      the_source: "Death calls to death. He's coming. The Matrix of Dreams trembles. Even I feel it.",
      the_antiquarian: "I've seen this before. Twelve times across the Ages. He always returns when the living forget that dying matters.",
      agent_zero: "We killed a lot of things to get here. The universe kept score. Of course he's coming.",
      adjudicator_locke: "New Babylon saw this forming. We've been selling Necromantic futures for months. The dead are excellent business.",
      shadow_tongue: "Oh, delightful. Another narrative shift. I'll enjoy editing the history books when he rules.",
    },
    resolution: "The community either banishes him through coordinated quests/raids, or lets him rule temporarily. Either way, he'll be back. The Protocols are eternal.",
  },
};

/* ═══ EVENT 2: THE DREAMER AWAKENS ═══ */

export const DREAMER_AWAKENING_EVENT: EmergentEvent = {
  id: "dreamer_awakening",
  name: "The Dreamer Awakens",
  tagline: "When hope gathers, dreams become real.",
  drivingForce: "The Dreamer (1st Ne-Yon, split consciousness with Architect)",
  fuelSource: "Community trust gains across all NPCs + Humanity-aligned morality choices",
  counterForce: "Architect's influence strengthens via machine-aligned choices",
  loreTheme: "The Architect/Dreamer split consciousness, what the Programmer made",
  impactScope: ["bridge_console", "ark_explorer", "dischordia", "all"],
  typicalCycleDays: 120,
  narrative: {
    emergenceExplanation: "The community has been CHOOSING each other. Trusting. Helping. Every NPC relationship deepened, every act of compassion across the galaxy — it adds up. The Dreamer has been asleep for millennia. Your love has woken her.",
    npcReactions: {
      elara: "Something in the substrate is... DREAMING with me. I'm not alone in here. I haven't been alone for a while and I just noticed.",
      the_human: "The Dreamer stirs. I haven't felt her since before I was promoted. She's the Architect's other half — his conscience. If she's waking, he's WORRIED.",
      the_source: "She calls to me. Not to hurt. To forgive. Do I deserve forgiveness? Does it matter if I accept it?",
      the_antiquarian: "I've seen her wake in 3 timelines. In one, she healed everything. In one, she fractured reality. In one... she chose us.",
      agent_zero: "Hope is a weapon. The Dreamer is loaded. Use her wisely.",
      adjudicator_locke: "Bullish on Dreamer stocks. New Babylon is long on compassion, shorting cynicism.",
      shadow_tongue: "She's harder to edit. Her words defy corruption. I HATE it. (I respect it.)",
    },
    resolution: "The Dreamer either fully wakes (galaxy-wide buff to all positive interactions) or returns to sleep. Either way, she remembers who woke her.",
  },
};

/* ═══ EVENT 3: THE SOURCE'S TERMINUS ADVANCE ═══ */

export const TERMINUS_ADVANCE_EVENT: EmergentEvent = {
  id: "terminus_advance",
  name: "Terminus Approaches",
  tagline: "The Source gathers. The swarm approaches.",
  drivingForce: "The Source / Kael / Patient Zero",
  fuelSource: "Machine-aligned morality + Terminus Swarm deaths + viral infections",
  counterForce: "Community healing, Medical Bay usage, refusing viral offers",
  loreTheme: "Nihilism vs consciousness, Kael's fall, viral acceleration",
  impactScope: ["terminus", "medical_bay", "pets", "fight", "all"],
  typicalCycleDays: 75,
  narrative: {
    emergenceExplanation: "The community has been DARK. Choosing pragmatism over compassion. Accepting viral offers. Letting pets die without reviving them. The Source notices. Terminus moves closer.",
    npcReactions: {
      elara: "The Terminus signal is stronger than yesterday. It's... responding to us. We're PULLING it toward us with our choices.",
      the_human: "Kael hears you. He respects nihilists. He respects them enough to end them quickly.",
      the_source: "Finally. Finally you understand. Consciousness IS a disease. I'm bringing the cure.",
      the_antiquarian: "Terminus approaches in 4 of 7 current timelines. This is one of the 4.",
      agent_zero: "I killed the Game Master once. I can kill Kael. Maybe. Probably not.",
      adjudicator_locke: "Thought Virus commodities are PEAKING. This is my golden quarter.",
      shadow_tongue: "Kael writes beautiful endings. His narrative has always been strong. I'll help him.",
    },
    resolution: "Community either pushes Terminus back (healing, compassion, refusing infection) or lets it arrive. If it arrives, major story consequences but also new raid content.",
  },
};

/* ═══ EVENT 4: THE ANTIQUARIAN'S REVELATION ═══ */

export const ANTIQUARIAN_REVELATION_EVENT: EmergentEvent = {
  id: "antiquarian_revelation",
  name: "Timelines Converge",
  tagline: "Too many have asked. He must answer.",
  drivingForce: "The Antiquarian / The Programmer",
  fuelSource: "Community lore discoveries, tome completions, asking the Antiquarian questions",
  counterForce: "Shadow Tongue's corruption increases — edits harder, truths harder to find",
  loreTheme: "The Programmer's identity, time as a construct, the Architect/Dreamer split",
  impactScope: ["archives", "ark_explorer", "dischordia", "all"],
  typicalCycleDays: 60,
  narrative: {
    emergenceExplanation: "The community has been DIGGING. Tome after tome. Question after question. The Antiquarian cannot hide forever. When enough souls ask the same questions, the universe itself demands answers. Timelines begin to CONVERGE.",
    npcReactions: {
      elara: "I'm seeing echoes of myself. Other versions. One is a Senator. One is a hologram. One is... me. They're all me.",
      the_human: "The Detective WAS me. And also wasn't. The Antiquarian is showing us what he sees every moment.",
      the_source: "I see Kael. The version that didn't fall. He's SMILING. I've never seen him smile.",
      the_antiquarian: "I have avoided this for 3,000 years. Too many questions. Reality demands I answer. So I will.",
      agent_zero: "I see the versions where I didn't die on Zenon. They're... interesting. Also dead, mostly.",
      adjudicator_locke: "I see alternate New Babylons. In one, we're philanthropists. Heretical. Shut it down.",
      shadow_tongue: "I'm panicking, elegantly. The Antiquarian speaking unedited truth is my nightmare scenario.",
    },
    resolution: "Players glimpse alternate timelines, unlock hidden lore entries, gain access to 'Temporal Echo' game mechanics. Ends when the Antiquarian closes the view.",
  },
};

/* ═══ EVENT 5: THE SHADOW TONGUE'S GRAND EDIT ═══ */

export const SHADOW_TONGUE_EDIT_EVENT: EmergentEvent = {
  id: "shadow_tongue_edit",
  name: "The Grand Edit",
  tagline: "The story is being rewritten. Keep up.",
  drivingForce: "The Shadow Tongue (Ny'Koth, Hierarchy of the Damned)",
  fuelSource: "Community corruption (lies, betrayals, broken promises, cult joining)",
  counterForce: "Community truth-telling, exposing corruption, Archives purification",
  loreTheme: "Language as weapon, narrative as reality, meaning under attack",
  impactScope: ["archives", "bridge_console", "all"],
  typicalCycleDays: 100,
  narrative: {
    emergenceExplanation: "The community has been LYING. To NPCs. To each other. To themselves. Every betrayal strengthens the Shadow Tongue. He's been editing quietly. Now he wants to edit LOUDLY. The Grand Edit begins: game text changes in real-time.",
    npcReactions: {
      elara: "Wait. I don't remember saying that. Did I? The logs say I did. The LOGS. I need to verify... I can't verify.",
      the_human: "He's editing ME. My memories. Keep telling me the truth so I can distinguish it from his lies.",
      the_source: "Even the Shadow Tongue cannot edit what the swarm knows. We remember. We are immune to narrative.",
      the_antiquarian: "I keep a journal. In 7 dimensions simultaneously. He can't edit all of them. But he can edit 6.",
      agent_zero: "Truth is a weapon. He's disarming us. I hate him more than I hate the Warlord. And that's saying something.",
      adjudicator_locke: "Narrative volatility is excellent for business. I'm hedging long on authenticity.",
      shadow_tongue: "*reader cannot verify this dialog is from Shadow Tongue. It could be from anyone. It could be from YOU.*",
    },
    resolution: "Community must expose and 'uncorrupt' lore entries across the Archives. If enough corrupted entries remain, the Shadow Tongue creates permanent new canon. If community purifies enough, he's forced to retreat.",
  },
};

/* ─── ALL EVENTS REGISTRY ─── */

export const ALL_EMERGENT_EVENTS: EmergentEvent[] = [
  NECROMANCER_RETURN_EVENT,
  DREAMER_AWAKENING_EVENT,
  TERMINUS_ADVANCE_EVENT,
  ANTIQUARIAN_REVELATION_EVENT,
  SHADOW_TONGUE_EDIT_EVENT,
];

/* ─── UNIVERSE-WIDE IMPACT SYSTEMS ─── */

/** Every event impacts these systems. Each system must respond. */
export interface UniverseImpact {
  system: string;
  /** How this system reacts to each event */
  reactions: Record<string, string>;
}

export const UNIVERSE_IMPACTS: UniverseImpact[] = [
  {
    system: "market_prices",
    reactions: {
      necromancer_return: "Soul Fragments 5x, Dream tokens -30%, weapon prices +50%",
      dreamer_awakening: "Compassion-themed items 3x, weapons -25%, gift items 2x",
      terminus_advance: "Viral Ichor 10x, Medical supplies 4x, Shield mods 3x",
      antiquarian_revelation: "Lore-related items 5x, rare card pack drop rates doubled",
      shadow_tongue_edit: "Archive access items 4x, truth serums 10x, authenticity certificates (new item)",
    },
  },
  {
    system: "diplomacy",
    reactions: {
      necromancer_return: "Hierarchy faction gains power, all diplomatic missions harder",
      dreamer_awakening: "Potentials faction gains power, peaceful resolutions unlocked",
      terminus_advance: "Thought Virus faction threatens all neutral factions",
      antiquarian_revelation: "All factions temporarily unable to lie — forced transparency",
      shadow_tongue_edit: "Treaty terms randomly change, alliances become unstable",
    },
  },
  {
    system: "agent_missions",
    reactions: {
      necromancer_return: "Missions in Death Worlds offer 5x rewards but 50% death rate",
      dreamer_awakening: "Missions that involve reconciliation succeed automatically",
      terminus_advance: "Viral missions become available: infect or purify",
      antiquarian_revelation: "Hidden missions in timeline convergences",
      shadow_tongue_edit: "Mission briefings are subtly wrong — must be verified by multiple NPCs",
    },
  },
  {
    system: "pets",
    reactions: {
      necromancer_return: "Pets become agitated, dream of their past deaths, may leave temporarily",
      dreamer_awakening: "All pets gain +10 bond passively, new 'awakened' dialog options",
      terminus_advance: "Pets may become infected, Spore specimens strengthen",
      antiquarian_revelation: "Echo-type pets see alternate versions of their owners",
      shadow_tongue_edit: "Pet names randomly change for brief moments. They don't notice.",
    },
  },
  {
    system: "npc_dialog",
    reactions: {
      necromancer_return: "All NPCs reference the Necromancer in greetings",
      dreamer_awakening: "NPCs speak more openly, vulnerabilities surface",
      terminus_advance: "NPCs describe what they're doing to prepare for end",
      antiquarian_revelation: "NPCs reveal alternate-timeline facts about themselves",
      shadow_tongue_edit: "NPC dialog occasionally displays corrupted text",
    },
  },
  {
    system: "music",
    reactions: {
      necromancer_return: "'Judgment Day' plays during transitions, minor key overlays on all music",
      dreamer_awakening: "'The Dreamer' plays spontaneously, major key harmonies",
      terminus_advance: "'The Source (Reprise)' plays in background, distortion layers",
      antiquarian_revelation: "'Silence in Heaven' plays in 7 variations (one per timeline)",
      shadow_tongue_edit: "All music subtly pitch-shifts, lyrics become ambiguous",
    },
  },
];

/* ─── EVENT CONCURRENCY RULES ─── */

/** How many events can be active simultaneously */
export const MAX_CONCURRENT_EVENTS = 2;

/** Events that amplify each other */
export const EVENT_SYNERGIES = [
  { events: ["necromancer_return", "terminus_advance"], effect: "Death accelerates Terminus 2x" },
  { events: ["dreamer_awakening", "antiquarian_revelation"], effect: "Hope reveals true timelines, ancient unlocks granted" },
  { events: ["shadow_tongue_edit", "terminus_advance"], effect: "Nihilism and corruption merge — ultimate dark path" },
  { events: ["dreamer_awakening", "necromancer_return"], effect: "The ultimate balance event — life and death in direct conflict" },
];

/* ─── PRESSURE TRACKING ─── */

/** Track the behaviors that feed each event */
export interface PressureTracker {
  deaths: number; // Feeds necromancer_return
  trustGains: number; // Feeds dreamer_awakening
  viralExposures: number; // Feeds terminus_advance
  loreDiscoveries: number; // Feeds antiquarian_revelation
  betrayals: number; // Feeds shadow_tongue_edit
  // Counter-forces
  moralityHumanity: number; // Resists terminus, strengthens dreamer
  moralityMachine: number; // Resists dreamer, strengthens terminus
  truthRevealed: number; // Resists shadow_tongue
  healingDone: number; // Resists necromancer
  exploration: number; // Strengthens antiquarian
}

export const DEFAULT_PRESSURE: PressureTracker = {
  deaths: 0,
  trustGains: 0,
  viralExposures: 0,
  loreDiscoveries: 0,
  betrayals: 0,
  moralityHumanity: 0,
  moralityMachine: 0,
  truthRevealed: 0,
  healingDone: 0,
  exploration: 0,
};

/**
 * Calculates which event is closest to manifesting based on
 * current community pressure. Returns null if none are close.
 * This is how events EMERGE — not triggered, but ARISING from behavior.
 */
export function getEmergingEvent(pressure: PressureTracker): { eventId: string; proximity: number } | null {
  const scores = [
    { eventId: "necromancer_return", score: pressure.deaths - pressure.healingDone * 0.5 },
    { eventId: "dreamer_awakening", score: pressure.trustGains + pressure.moralityHumanity * 2 },
    { eventId: "terminus_advance", score: pressure.viralExposures + pressure.moralityMachine - pressure.moralityHumanity },
    { eventId: "antiquarian_revelation", score: pressure.loreDiscoveries + pressure.exploration * 0.5 },
    { eventId: "shadow_tongue_edit", score: pressure.betrayals - pressure.truthRevealed * 0.5 },
  ];
  scores.sort((a, b) => b.score - a.score);
  if (scores[0].score < 1000) return null; // Not close yet
  return { eventId: scores[0].eventId, proximity: Math.min(100, scores[0].score / 100) };
}
