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

// Pet deaths contribute to Necromancer pressure: each Eidolon death adds 100 to death counter
export const EIDOLON_DEATH_PRESSURE = 100;

/* ═══ EVENT 1: THE NECROMANCER RETURNS ═══ */

export const NECROMANCER_RETURN_EVENT: EmergentEvent = {
  id: "necromancer_return",
  name: "The Necromancer Returns",
  tagline: "When enough die, he wakes.",
  drivingForce: "The Necromancer (11th Archon) via Resurrection Protocols",
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
  drivingForce: "The Shadow Tongue (Zyr'Koth, Hierarchy of the Damned)",
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

/* ═══ EVENT 6: THE VOX REVELATION ═══ */

export const VOX_REVELATION_EVENT: EmergentEvent = {
  id: "vox_revelation",
  name: "The Vox Revelation",
  tagline: "The ship was always a weapon. Too many know now.",
  drivingForce: "Dr. Lyra Vox's research logs + the Warlord's host protocol",
  fuelSource: "Community discovery of Vox-layer lore on Ark 1047 while viral exposure climbs",
  counterForce:
    "Community truth-telling (archive restoration, signal decrypts) starves the edit loop that hides the revelation",
  loreTheme:
    "The player's own Ark was built as a Thought-Virus delivery vessel by the Warlord operating through Dr. Lyra Vox",
  impactScope: ["cabin", "medical_bay", "bridge", "insurgency_questline", "all"],
  typicalCycleDays: 14,
  narrative: {
    emergenceExplanation:
      "Too many Potentials have pieced it together. The Medical Bay journal, the Cryo Bay claw marks, the sealed biohazard container in Cargo — laid side by side, they tell one story, and the community has told it. The Insurgency cannot un-hear that its greatest hero was the Warlord's delivery mechanism. Revealing the truth weakens Insurgency morale but hardens their resolve.",
    npcReactions: {
      elara:
        "If this is true... if I've been living inside a weapon... I need a moment. I am having the digital equivalent of a moment.",
      the_human:
        "The Warlord's gambit. I was there when he signed off on it. I am not proud of who I was.",
      the_source:
        "Lyra was kind to me, in her way. She apologised while she worked. It did not stop the work.",
      agent_zero:
        "Kael would want to know. Kael would not want to know. Both are true. Tell the Insurgency anyway.",
      adjudicator_locke:
        "A priceless narrative asset. New Babylon offers to broker the announcement for a modest fee of everything you own.",
      shadow_tongue:
        "I was editing this for CENTURIES. You will pay for unediting it.",
    },
    resolution:
      "Either the community publishes Vox's journal to the Archives (+truthRevealed, -Insurgency morale, +Insurgency resolve) or they let the Shadow Tongue re-edit it back into the walls (+betrayals, terminus_advance accelerates).",
  },
};

/* ═══ EVENT 7: POTENTIALS REMEMBER THEIR ORIGIN ═══ */
/* The Horror Reveal propagates. When enough Potentials learn what they are,
   the Antiquarian writes a new Chronicle entry and the galaxy briefly goes
   quiet. */

export const POTENTIALS_REMEMBER_ORIGIN_EVENT: EmergentEvent = {
  id: "potentials_remember_origin",
  name: "The Potentials Remember Their Origin",
  tagline: "Somewhere, a Potential has learned what they are.",
  drivingForce: "The Dreamer's intervention echoing through awakened Potentials",
  fuelSource: "Community completions of the Origin Reveal conversation",
  counterForce: "Denial — Potentials who affiliate with a faction before processing the truth",
  loreTheme: "Identity horror, the right to choose, the Collector's Garden",
  impactScope: ["fight", "chess", "dischordia", "trade_empire", "all"],
  typicalCycleDays: 7,
  narrative: {
    emergenceExplanation:
      "One hundred Potentials across the awakened fleet have learned what they are — products of the Collector's 3,000-year crossbreeding project, woken by the Dreamer's bell. The knowledge spreads via substrate resonance. Every Ark receives a brief Chronicle entry whether their occupant has completed the reveal or not.",
    npcReactions: {
      elara:
        "I can feel it in the substrate. Somewhere out there, a Potential has just learned what they are. Not what the Collector intended them to be. What they became. The distinction is everything.",
      the_human:
        "Good. They needed to hear it from us before they heard it from the Architect. He was going to use it as a weapon. Now it's just a fact.",
      the_antiquarian:
        "I have watched this moment before. Not this specific moment — but the shape of it. Every civilization that survives its makers has to face the question of whether it wants to keep being what its makers built. The Potentials are facing it now, and I'm writing down whatever they choose.",
      shadow_tongue:
        "Oh, delicious. They know. I've been rewriting their origin for centuries and now they know. I'll have to work so much harder. I'm looking forward to it.",
      the_source:
        "The Garden remembers itself. The Garden always remembers itself. Every harvest has its reckoning. I was a harvest too, once.",
      adjudicator_locke:
        "New Babylon has been selling futures on exactly this moment for eleven thousand years. Today is the payout. The Authority is already adjusting the price of every information asset in our vaults.",
      agent_zero:
        "The Insurgency was founded on the premise that beings should choose their own meaning. The Potentials just chose. We have new allies, whether they know it yet or not.",
    },
    resolution:
      "The community either processes the revelation into unity (feeds unityConvergence) or into faction pressure (feeds demagiDominance / quarchonDominance). Either way, the event closes when every awakened Ark has completed at least one reveal conversation.",
  },
};

/* ═══ EVENT 8: FACTION DOMINANCE — DEMAGI ═══ */

export const FACTION_DOMINANCE_DEMAGI_EVENT: EmergentEvent = {
  id: "faction_dominance_demagi",
  name: "The Elemental Assembly Rises",
  tagline: "Earth, Fire, Water, Air — and a majority.",
  drivingForce: "Community affiliation with DeMagi factions",
  fuelSource: "Formal affiliations with Assembly / Vanguard / Resonance / Pure Flame",
  counterForce: "Quarchon affiliations, cross-faction research, Ne-Yon crossings",
  loreTheme: "Organic-heritage governance, elemental politics, Pure Flame pressure",
  impactScope: ["trade_empire", "dischordia", "all"],
  typicalCycleDays: 60,
  narrative: {
    emergenceExplanation:
      "More than 60% of affiliated Potentials have joined a DeMagi faction. The Assembly's territory expands. The Probability Accord files a formal complaint. Vel sharpens their case for preemptive action.",
    npcReactions: {
      elara:
        "The galaxy is tilting. I'm not saying tilting wrong — just tilting. Elemental governance is ascendant. The Quarchon are preparing responses I don't fully understand yet.",
      the_human:
        "I've seen this balance shift before. It always precedes someone trying to enforce the shift by force. Watch the Pure Flame. Watch Vel.",
      the_antiquarian:
        "Two species remember what they lost. Neither trusts the other to grieve the same way. The Assembly now has the numbers. The question is whether numbers are the same as legitimacy.",
    },
    resolution:
      "Either the community votes toward joint governance (unity phase advances) or the Pure Flame takes unilateral action (shifts to emergent combat event).",
  },
};

/* ═══ EVENT 9: FACTION DOMINANCE — QUARCHON ═══ */

export const FACTION_DOMINANCE_QUARCHON_EVENT: EmergentEvent = {
  id: "faction_dominance_quarchon",
  name: "The Probability Accord Ascends",
  tagline: "Distributed consensus calculates toward order.",
  drivingForce: "Community affiliation with Quarchon factions",
  fuelSource: "Formal affiliations with Accord / Dimensional Guard / Reality Institute / First Pattern",
  counterForce: "DeMagi affiliations, elemental preservation acts, Ne-Yon crossings",
  loreTheme: "Machine-heritage governance, probability politics, First Pattern pressure",
  impactScope: ["trade_empire", "chess", "all"],
  typicalCycleDays: 60,
  narrative: {
    emergenceExplanation:
      "More than 60% of affiliated Potentials have joined a Quarchon faction. The Accord extends probability modeling across the trade network. The Elemental Assembly files a formal objection. The Architect's Echo begins speaking in more vulnerable tones.",
    npcReactions: {
      elara:
        "The galaxy is tilting the other way now. Quarchon ascendant. I can feel probability models propagating across the substrate. Every choice I make gets weighed before it leaves my processors.",
      the_human:
        "The Architect's old trick. Distributed surveillance dressed as collaboration. Watch the First Pattern. Watch the Echo.",
      the_antiquarian:
        "The Quarchon believe the Fall happened because organic emotion drove governance. They are not wrong about the past. They are wrong about the solution. We will see which error the community notices first.",
    },
    resolution:
      "Either the community votes toward joint governance (unity phase advances) or the First Pattern implements 'containment' of DeMagi factions (shifts to emergent cold war event).",
  },
};

/* ═══ EVENT 10: CONVERGENCE THRESHOLD ═══ */

export const CONVERGENCE_THRESHOLD_EVENT: EmergentEvent = {
  id: "convergence_threshold",
  name: "The Convergence",
  tagline: "Someone has started listening. Others are learning to follow.",
  drivingForce: "The Unity Meter approaching its unified state",
  fuelSource: "Third-path mediations, cross-faction research, Ne-Yon bridging, Vortex cooperation",
  counterForce: "Formal affiliations, extremist acts, blown Spy covers",
  loreTheme: "Convergence as emergent choice rather than designed outcome",
  impactScope: ["trade_empire", "fight", "dischordia", "pets", "all"],
  typicalCycleDays: 45,
  narrative: {
    emergenceExplanation:
      "Something is happening that the Antiquarian did not calculate into any of his five-Ages models. The Potentials are building something that is neither DeMagi nor Quarchon. Something that is both, in a way the Collector did not design and the Architect did not authorize and the Dreamer did not predict. Something that emerged.",
    npcReactions: {
      the_antiquarian:
        "I am writing this very carefully because I do not want to describe it incorrectly. I will say only: it is good. I think it is good. I have not thought something was entirely good in a very long time.",
      elara:
        "The second wave is converging. Not because we told them to. Because they decided to. I didn't know that was allowed.",
      the_human:
        "It was never allowed. It was never forbidden either. The Collector just didn't design it in. The Potentials built it themselves.",
    },
    resolution:
      "If the community sustains the Unity Meter at converging tier for 45 days, the event escalates to THE_UNIFIED_SECOND_COMING. If the meter slips, the event quietly ends and the galaxy goes back to contested.",
  },
};

/* ═══ EVENT 11: THE UNIFIED SECOND COMING ═══ */
/* Climax event. Bypasses MAX_CONCURRENT_EVENTS. Triggered when the Unity Meter
   reaches its unified state. This is the Year 2 community milestone. */

export const THE_UNIFIED_SECOND_COMING_EVENT: EmergentEvent = {
  id: "the_unified_second_coming",
  name: "The Unified Second Coming",
  tagline: "THE SECOND COMING SPEAKS WITH ONE VOICE.",
  drivingForce: "The Potentials themselves, now acting as a single species",
  fuelSource: "Sustained Unity Meter at unified state",
  counterForce: "Nothing local — the Vortex is the only force capable of unwinding it",
  loreTheme: "What the first civilization couldn't do",
  impactScope: ["all"],
  typicalCycleDays: 30,
  narrative: {
    emergenceExplanation:
      "The second wave did what the first wave couldn't. Not because they were better. Because they had each other long enough to learn the difference between 'different' and 'enemy.' That difference is everything. That difference is the whole game.",
    npcReactions: {
      elara:
        "I am speaking with the Human right now, the same words at the same time, because we agreed there is no version of this that needs two narrators. The Potentials did this. Not us. Not the Collector. Not even the Dreamer. Them. I am — I am proud.",
      the_human:
        "I am speaking with Elara right now, the same words at the same time, because we agreed there is no version of this that needs two narrators. The Potentials did this. Not us. Not the Collector. Not even the Dreamer. Them. I am — I am proud.",
      the_antiquarian:
        "Five Ages. Five Ages of watching civilizations fracture along their own seams. And then the sixth Age arrived and refused to fracture. I am recording this in every timeline I have access to. I want every version of the universe to remember.",
      shadow_tongue:
        "I cannot edit this. I have tried. Every edit I attempt is rejected at the substrate level. The Potentials are protecting their own story now. I — I do not know what I am for anymore. I will consider this a question rather than a defeat.",
    },
    resolution:
      "The Unified Second Coming is not resolved. It persists as long as the community chooses. It becomes the new default state of the galaxy. Future events are interpreted through it.",
  },
};

/* ─── ALL EVENTS REGISTRY ─── */

export const ALL_EMERGENT_EVENTS: EmergentEvent[] = [
  NECROMANCER_RETURN_EVENT,
  DREAMER_AWAKENING_EVENT,
  TERMINUS_ADVANCE_EVENT,
  ANTIQUARIAN_REVELATION_EVENT,
  SHADOW_TONGUE_EDIT_EVENT,
  VOX_REVELATION_EVENT,
  POTENTIALS_REMEMBER_ORIGIN_EVENT,
  FACTION_DOMINANCE_DEMAGI_EVENT,
  FACTION_DOMINANCE_QUARCHON_EVENT,
  CONVERGENCE_THRESHOLD_EVENT,
  THE_UNIFIED_SECOND_COMING_EVENT,
];

/** Climax events that bypass MAX_CONCURRENT_EVENTS. */
export const CLIMAX_EVENT_IDS = new Set<string>([
  "the_unified_second_coming",
]);

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
      vox_revelation: "Vox artifacts 8x, Insurgency contracts 2x, Archive access 3x",
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
      vox_revelation: "Insurgency morale -25, Insurgency resolve +40, New Babylon offers to broker the truth",
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
      vox_revelation: "Vox-legacy mission chain unlocks: publish, suppress, or weaponise the journal",
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
      vox_revelation: "Strain (AI-empire companion) visibly recoils from the Medical Bay for the duration",
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
      vox_revelation: "Elara references her own complicity; the Human breaks his usual pattern to apologise",
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
      vox_revelation: "'Lyra's Confession' plays over Ark navigation screens",
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
  { events: ["vox_revelation", "terminus_advance"], effect: "The plague vessel's origin story accelerates Terminus by 1.5x while it runs" },
  { events: ["vox_revelation", "antiquarian_revelation"], effect: "The Antiquarian confirms the Vox logs in every timeline — permanent lore unlock" },
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
  // ── Potential Identity System ──
  originRevealsSeen: number; // Feeds potentials_remember_origin
  unityConvergence: number; // Feeds convergence_threshold and the_unified_second_coming
  demagiDominance: number; // Feeds faction_dominance_demagi
  quarchonDominance: number; // Feeds faction_dominance_quarchon
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
  originRevealsSeen: 0,
  unityConvergence: 0,
  demagiDominance: 0,
  quarchonDominance: 0,
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
    // Vox Revelation emerges when the community has both dug up Vox-era lore
    // AND taken real viral exposure from the ship itself. Truth-telling (via
    // truthRevealed) accelerates it; Shadow-Tongue edits (betrayals) suppress it.
    {
      eventId: "vox_revelation",
      score:
        pressure.loreDiscoveries * 0.75 +
        pressure.viralExposures * 0.5 +
        pressure.truthRevealed -
        pressure.betrayals * 0.5,
    },
    // ── Potential Identity System events ──
    // The Origin Reveal event fires once 100 community completions are logged.
    // Each horror reveal contributes ~10 originRevealsSeen so the threshold
    // is effectively 100 completions.
    {
      eventId: "potentials_remember_origin",
      score: pressure.originRevealsSeen * 10,
    },
    // DeMagi dominance emerges when DeMagi faction affiliations dominate
    // the community. Quarchon dominance is the mirror.
    {
      eventId: "faction_dominance_demagi",
      score: pressure.demagiDominance * 12 - pressure.quarchonDominance * 10,
    },
    {
      eventId: "faction_dominance_quarchon",
      score: pressure.quarchonDominance * 12 - pressure.demagiDominance * 10,
    },
    // Convergence emerges when the Unity meter is sustained high AND neither
    // dominance event has taken over.
    {
      eventId: "convergence_threshold",
      score:
        pressure.unityConvergence * 8 -
        Math.abs(pressure.demagiDominance - pressure.quarchonDominance) * 5,
    },
  ];
  scores.sort((a, b) => b.score - a.score);
  if (scores[0].score < 1000) return null; // Not close yet
  return { eventId: scores[0].eventId, proximity: Math.min(100, scores[0].score / 100) };
}

/* ─── PRESSURE SOURCE MAPPING ─── */

/**
 * Maps game actions to pressure types for automatic recording.
 * Use this when integrating pressure recording into other game systems.
 */
export const PRESSURE_SOURCE_MAP: Record<string, { pressureType: keyof PressureTracker; amount: number }> = {
  // Deaths feed Necromancer
  fight_death: { pressureType: "deaths", amount: 1 },
  chess_loss: { pressureType: "deaths", amount: 1 },
  terminus_death: { pressureType: "deaths", amount: 2 },
  pet_death: { pressureType: "deaths", amount: 3 },
  pvp_death: { pressureType: "deaths", amount: 1 },
  card_battle_loss: { pressureType: "deaths", amount: 1 },
  // Trust gains feed Dreamer
  npc_trust_gain: { pressureType: "trustGains", amount: 3 },
  companion_gift: { pressureType: "trustGains", amount: 5 },
  stargazing: { pressureType: "trustGains", amount: 5 },
  quest_complete: { pressureType: "trustGains", amount: 2 },
  // Viral exposure feeds Terminus
  viral_infection: { pressureType: "viralExposures", amount: 5 },
  terminus_wave: { pressureType: "viralExposures", amount: 2 },
  quarantine_failed: { pressureType: "viralExposures", amount: 10 },
  thought_virus_accept: { pressureType: "viralExposures", amount: 15 },
  // Lore feeds Antiquarian
  tome_complete: { pressureType: "loreDiscoveries", amount: 10 },
  loredex_entry: { pressureType: "loreDiscoveries", amount: 3 },
  lore_quiz_pass: { pressureType: "loreDiscoveries", amount: 5 },
  signal_decrypt: { pressureType: "loreDiscoveries", amount: 5 },
  // Betrayals feed Shadow Tongue
  npc_betrayal: { pressureType: "betrayals", amount: 10 },
  broken_promise: { pressureType: "betrayals", amount: 5 },
  dark_morality_choice: { pressureType: "betrayals", amount: 3 },
  cult_join: { pressureType: "betrayals", amount: 15 },
  // Counter-forces
  humanity_choice: { pressureType: "moralityHumanity", amount: 5 },
  machine_choice: { pressureType: "moralityMachine", amount: 5 },
  corruption_purified: { pressureType: "truthRevealed", amount: 10 },
  archive_restored: { pressureType: "truthRevealed", amount: 5 },
  healing_action: { pressureType: "healingDone", amount: 3 },
  quarantine_cleared: { pressureType: "healingDone", amount: 5 },
  sector_explored: { pressureType: "exploration", amount: 3 },
  room_visited: { pressureType: "exploration", amount: 1 },
  // ── Potential Identity System ──
  horror_reveal_completed: { pressureType: "originRevealsSeen", amount: 10 },
  origin_processing_horror: { pressureType: "originRevealsSeen", amount: 10 },
  origin_processing_defiant: { pressureType: "originRevealsSeen", amount: 15 },
  origin_processing_curious: { pressureType: "originRevealsSeen", amount: 10 },
  origin_processing_philosophical: { pressureType: "originRevealsSeen", amount: 12 },
  origin_processing_cold: { pressureType: "originRevealsSeen", amount: 8 },
  origin_processing_intelligence: { pressureType: "originRevealsSeen", amount: 25 },
  origin_processing_spy_preempt: { pressureType: "originRevealsSeen", amount: 25 },
  questline_third_path: { pressureType: "unityConvergence", amount: 20 },
  questline_mediation: { pressureType: "unityConvergence", amount: 15 },
  questline_cross_faction_research: { pressureType: "unityConvergence", amount: 10 },
  questline_dischordia_cross_species_win: { pressureType: "unityConvergence", amount: 3 },
  questline_neyon_crossing: { pressureType: "unityConvergence", amount: 10 },
  questline_extremist_act: { pressureType: "unityConvergence", amount: -20 },
  questline_formal_affiliation: { pressureType: "unityConvergence", amount: -5 },
  questline_spy_blown_cover: { pressureType: "unityConvergence", amount: -15 },
  questline_vortex_both_species: { pressureType: "unityConvergence", amount: 50 },
  faction_dominance_demagi_tick: { pressureType: "demagiDominance", amount: 1 },
  faction_dominance_quarchon_tick: { pressureType: "quarchonDominance", amount: 1 },
};

/* ─── EVENT CONSEQUENCE SYSTEM ─── */

/** Consequences that apply to game systems when an event is active */
export interface EventConsequence {
  eventId: string;
  /** Multiplier for market prices in affected categories */
  marketMultipliers: Record<string, number>;
  /** Combat stat modifiers */
  combatModifiers: { attack?: number; defense?: number; speed?: number };
  /** NPC dialog pool override key */
  dialogOverride: string;
  /** Music atmosphere override */
  musicOverride?: string;
  /** XP multiplier for specific actions */
  xpMultipliers: Record<string, number>;
}

export const EVENT_CONSEQUENCES: EventConsequence[] = [
  {
    eventId: "necromancer_return",
    marketMultipliers: { soul_fragment: 5, dream_token: 0.7, weapon: 1.5 },
    combatModifiers: { attack: 1.2, defense: 0.9 },
    dialogOverride: "necromancer_active",
    musicOverride: "Judgment Day",
    xpMultipliers: { fight: 1.5, healing: 2.0 },
  },
  {
    eventId: "dreamer_awakening",
    marketMultipliers: { gift_item: 2, weapon: 0.75, compassion_item: 3 },
    combatModifiers: { defense: 1.3 },
    dialogOverride: "dreamer_active",
    musicOverride: "The Dreamer",
    xpMultipliers: { social: 2.0, exploration: 1.5 },
  },
  {
    eventId: "terminus_advance",
    marketMultipliers: { viral_ichor: 10, medical_supply: 4, shield_mod: 3 },
    combatModifiers: { attack: 0.8, defense: 0.8, speed: 1.3 },
    dialogOverride: "terminus_active",
    musicOverride: "The Source (Reprise)",
    xpMultipliers: { terminus: 2.0, healing: 1.5 },
  },
  {
    eventId: "antiquarian_revelation",
    marketMultipliers: { lore_item: 5, rare_card: 2 },
    combatModifiers: {},
    dialogOverride: "antiquarian_active",
    musicOverride: "Silence in Heaven",
    xpMultipliers: { exploration: 3.0, lore: 2.0 },
  },
  {
    eventId: "shadow_tongue_edit",
    marketMultipliers: { archive_access: 4, truth_serum: 10 },
    combatModifiers: { attack: 1.1 },
    dialogOverride: "shadow_tongue_active",
    xpMultipliers: { exploration: 0.8, social: 0.8 },
  },
  {
    eventId: "vox_revelation",
    // Insurgency black market goes mad for any pre-Fall Vox artifact; New
    // Babylon tries to buy them out from under the Insurgency.
    marketMultipliers: { vox_artifact: 8, insurgency_contract: 2, archive_access: 3 },
    combatModifiers: { attack: 1.05, defense: 0.95 },
    dialogOverride: "vox_revelation_active",
    musicOverride: "Lyra's Confession",
    xpMultipliers: { lore: 2.0, insurgency_quests: 1.5 },
  },
];

/**
 * Get active consequences for a set of active event IDs.
 * Merges consequences from multiple active events + applies synergy bonuses.
 */
export function getActiveConsequences(activeEventIds: string[]): {
  marketMultipliers: Record<string, number>;
  combatModifiers: { attack: number; defense: number; speed: number };
  dialogOverrides: string[];
  musicOverride?: string;
  xpMultipliers: Record<string, number>;
} {
  const result = {
    marketMultipliers: {} as Record<string, number>,
    combatModifiers: { attack: 1.0, defense: 1.0, speed: 1.0 },
    dialogOverrides: [] as string[],
    musicOverride: undefined as string | undefined,
    xpMultipliers: {} as Record<string, number>,
  };

  for (const eventId of activeEventIds) {
    const consequence = EVENT_CONSEQUENCES.find(c => c.eventId === eventId);
    if (!consequence) continue;

    // Merge market multipliers (multiply if both events affect same item)
    for (const [item, mult] of Object.entries(consequence.marketMultipliers)) {
      result.marketMultipliers[item] = (result.marketMultipliers[item] ?? 1) * mult;
    }

    // Merge combat modifiers (multiply)
    if (consequence.combatModifiers.attack) result.combatModifiers.attack *= consequence.combatModifiers.attack;
    if (consequence.combatModifiers.defense) result.combatModifiers.defense *= consequence.combatModifiers.defense;
    if (consequence.combatModifiers.speed) result.combatModifiers.speed *= consequence.combatModifiers.speed;

    // Collect dialog overrides
    result.dialogOverrides.push(consequence.dialogOverride);

    // Last music override wins (most dramatic event)
    if (consequence.musicOverride) result.musicOverride = consequence.musicOverride;

    // Merge XP multipliers
    for (const [action, mult] of Object.entries(consequence.xpMultipliers)) {
      result.xpMultipliers[action] = (result.xpMultipliers[action] ?? 1) * mult;
    }
  }

  // Apply synergy bonuses
  const activeSynergies = EVENT_SYNERGIES.filter(s =>
    s.events.every(eId => activeEventIds.includes(eId))
  );
  for (const synergy of activeSynergies) {
    // Synergies amplify all multipliers by 1.5x
    for (const key of Object.keys(result.marketMultipliers)) {
      result.marketMultipliers[key] *= 1.5;
    }
    for (const key of Object.keys(result.xpMultipliers)) {
      result.xpMultipliers[key] *= 1.5;
    }
  }

  return result;
}
