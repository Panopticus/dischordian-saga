/* ═══════════════════════════════════════════════════════
   YEAR ONE EVENTS — THE LIVING ARK
   Complete Year One event data for the Dischordian Saga.
   48 weekly events, 12 monthly votes, 4 seasonal events,
   10 Architect-Triggered events, branching consequences.
   ═══════════════════════════════════════════════════════ */

import type { CommunityVote, VoteOption } from "@shared/governance";
import type { CalendarEvent } from "@/stores/governanceStore";

/* ─── TIME BASE ─── */

/** Epoch for Year One. Set via Time Machine or server config. */
let YEAR_ONE_START = 0;

/** Set the base timestamp for all Year One events. */
export function setYearOneStart(timestamp: number): void {
  YEAR_ONE_START = timestamp;
}

/** Get the current Year One start. */
export function getYearOneStart(): number {
  return YEAR_ONE_START;
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function weekStart(week: number): number {
  return YEAR_ONE_START + (week - 1) * WEEK_MS;
}

function weekEnd(week: number): number {
  return weekStart(week) + WEEK_MS - 1;
}

function weekToAct(week: number): number {
  if (week <= 13) return 1;
  if (week <= 26) return 2;
  if (week <= 39) return 3;
  return 4;
}

function weekToMonth(week: number): number {
  return Math.min(12, Math.ceil(week / 4));
}

/* ─── BRANCHING CONSEQUENCES ─── */

export interface BranchConsequence {
  optionId: string;
  gain: string[];
  cost: string[];
  scar: string[];
  npcReaction?: string;
  chronicleNote?: string;
}

export interface VoteBranchingConsequences {
  voteId: string;
  branches: BranchConsequence[];
}

/* ═══════════════════════════════════════════════════════
   ACT I: THE AWAKENING (Months 1-3, Weeks 1-12)
   Theme: Discovery, first mysteries, the dark sector
   ═══════════════════════════════════════════════════════ */

/* ─── MONTH 1: FIRST LIGHT ─── */

const W1_FIRST_SIGNAL: CommunityVote = {
  id: "y1_w1_first_signal",
  month: 1, week: 1,
  question: "THE FIRST SIGNAL — Which distress call do we answer?",
  proposedBy: "Elara + The Antiquarian",
  antiquarianIntro: "A signal. Three short, three long, three short — the oldest cry for help in any universe. I have heard this pattern before, across five Ages, in frequencies that predate language itself. Three sources. Three stories. You cannot answer all of them. And the ones you do not answer... they will not wait. I have watched unanswered signals before. The silence that follows is a different kind of distress call entirely.",
  options: [
    { id: "amber_signal", label: "The Amber Signal", description: "Origin: deep space, near a destroyed Inception Ark. Frequency matches Insurgency encryption. Could be a remnant from the wars.", consequences: ["Insurgency intel unlocked", "Combat bonuses for 2 weeks", "Iron Lion's storyline advances"], icon: "Radio" },
    { id: "indigo_signal", label: "The Indigo Signal", description: "Origin: the Ark's own substrate layer. Something is broadcasting from INSIDE our ship. The frequency is laced with untranslatable text fragments.", consequences: ["Early warning about Shadow Tongue", "Lore bonuses +15%", "Shadow Tongue discovered 4 weeks earlier"], icon: "Eye" },
    { id: "crimson_signal", label: "The Crimson Signal", description: "Origin: a rogue planet at the edge of sensor range. The signal is not a distress call — it's a WARNING. Something is telling us to stay away.", consequences: ["Early Terminus intel", "Defense bonuses for 2 weeks", "Terminus detected 20% sooner"], icon: "AlertTriangle" },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["loredex", "fight", "tower-defense"], quorum: 10,
};

const W2_DARK_SECTOR: CommunityVote = {
  id: "y1_w2_dark_sector",
  month: 1, week: 2,
  question: "THE DARK SECTOR — How do we investigate the shield?",
  proposedBy: "Elara + Navigation",
  antiquarianIntro: "Two hundred star systems. Gone. Enclosed in an energy barrier that appeared three years ago — the same moment the first wave of Potentials vanished. I could tell you what I know about the shield. I could tell you what the Dreamer told me, in confidence, about barriers and their purposes. But some truths must be earned, not given. And the truth about your predecessors... that truth has teeth.",
  options: [
    { id: "send_probe", label: "Send a Probe", description: "Fire an unmanned sensor package at the barrier. If it penetrates, we learn what's inside. If not, we learn about the barrier.", consequences: ["Shield resonates with Dreamer tech (critical lore)", "Probe absorbed — but telemetry captured", "Safe approach — no losses"] },
    { id: "hail_new_babylon", label: "Hail New Babylon", description: "Demand answers. The Authority classified the battle. We demand declassification.", consequences: ["Locke Trust +5", "Hidden coordinates in metadata", "New Babylon flags Ark as surveillance priority"] },
    { id: "observe", label: "Observe and Wait", description: "The first wave chose to act. Look where it got them. We watch. We learn. We wait.", consequences: ["+10% sensor range for 2 weeks", "Passive intelligence gathered", "Antiquarian disappointed"] },
    { id: "breach_shield", label: "Attempt to Breach the Shield", description: "Full Ark power diverted to a focused energy beam aimed at the barrier. DANGEROUS.", consequences: ["Encrypted data burst received (solvable in Act III)", "Ark loses 20% reactor power for 2 weeks", "All activities harder during recovery"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["loredex", "navigation", "engineering"], quorum: 10,
};

const W3_DREAMERS_SHIELD: CommunityVote = {
  id: "y1_w3_dreamers_shield",
  month: 1, week: 3,
  question: "THE DREAMER'S SHIELD — How do we respond to the probe?",
  proposedBy: "Elara + Engineering",
  antiquarianIntro: "The shield around your Ark and the barrier around the dark sector were built by the same mind. The Ne-Yons have confirmed what I already suspected — the Dreamer's fingerprints are on both. Your home and the prison of your predecessors are... siblings. I find this information unsettling. I find most truths unsettling. It is, perhaps, why I prefer to deal in stories.",
  options: [
    { id: "reinforce", label: "Reinforce the Shield", description: "Divert all power to defense. Impenetrable for 1 week.", consequences: ["Impenetrable defense for 1 week", "No offensive capability", "Terminus Swarm waves auto-fail"] },
    { id: "let_probe", label: "Let the Probe Through", description: "Drop the shield momentarily and analyze whatever is probing us. Risky.", consequences: ["First contact with Ne-Yons", "The Enigma is searching for survivors", "10% max health reduction for 1 week (Thought Virus trace)"] },
    { id: "counter_signal", label: "Send a Counter-Signal", description: "Fire back. Broadcast the Ark's position to whoever is probing.", consequences: ["Multiple factions make contact in Month 2", "World gets bigger faster", "Architect's forces detect you — hostile encounter in Month 2"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["tower-defense", "fight", "diplomacy"], quorum: 10,
};

const W4_ARKS_FIRST_LAW: CommunityVote = {
  id: "y1_w4_arks_first_law",
  month: 1, week: 4,
  question: "THE ARK'S FIRST LAW — What principle governs us?",
  proposedBy: "The Antiquarian (temporal projection)",
  antiquarianIntro: "You are... ah. There you are. I have been watching this moment approach from very far away. Across Ages, across the fall and rise of empires. The first wave made no covenant — they trusted one another implicitly, and they vanished into a silence so complete that even I cannot see past it. You must do what they did not. You must decide, together, what kind of civilization you are building on this Ark. I have seen every version of this choice. Some versions are beautiful. Some are ashes. I will not tell you which is which.",
  options: [
    { id: "law_openness", label: "The Law of Openness", description: "All information shared. No secrets. Every loredex entry unlocked communally.", consequences: ["All lore shared openly", "Shadow Tongue gains power — corruption spreads 20% faster", "Community trust maximized"] },
    { id: "law_merit", label: "The Law of Merit", description: "Information earned through achievement. Top players access content first.", consequences: ["Competitive gating system", "Top players access content first", "Division risk — some feel excluded"] },
    { id: "law_sacrifice", label: "The Law of Sacrifice", description: "Every gain costs something. Nothing is free. Unlock a fighter? Lose an arena.", consequences: ["Dramatic tension in every decision", "Every gain feels EARNED", "Resource scarcity becomes constant"] },
    { id: "law_dischord", label: "The Law of Dischord", description: "No law. Pure chaos. Weekly rules change. The Meme adores this.", consequences: ["Weekly rule changes", "Some weeks incredible, some devastating", "The Meme gains influence"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["governance", "loredex", "all"], quorum: 10,
};

/* ─── MONTH 2: WHISPERS IN THE DARK ─── */

const W5_NECROMANCER_ECHO: CommunityVote = {
  id: "y1_w5_necromancer_echo",
  month: 2, week: 5,
  question: "THE NECROMANCER'S ECHO — What do we do with the resurrection code?",
  proposedBy: "Engineering Bay (automated broadcast)",
  antiquarianIntro: "The 10th Archon's resurrection protocols — incomplete, broadcasting from the space between life and death. The Necromancer has not returned. But he is trying. And in the Eyes' surveillance chamber, the screens show coordinates within the Matrix of Dreams. She is showing him where she is. Two souls reaching for each other across the divide. I find myself... moved. And concerned. Resurrection always has a price. I have watched it across five Ages. The price is never what you expect.",
  options: [
    { id: "study_code", label: "Study It", description: "Engineering team analyzes the protocols carefully. Knowledge first, action later.", consequences: ["Resurrection mechanic +1 bonus life/day", "Necromancer arrives Month 6 (neutral)", "The Eyes' signal stable but not strong"] },
    { id: "complete_code", label: "Complete It", description: "Help the Necromancer return. Pour resources into finishing the protocol.", consequences: ["Necromancer arrives Month 5 (grateful, Trust +20)", "The Eyes' signal stabilizes", "Costs 500 Dream tokens per player"] },
    { id: "destroy_code", label: "Destroy It", description: "The dead should stay dead. Seal the protocol and move on.", consequences: ["Immediate safety", "Necromancer's return delayed to Act III (angry, Trust -20)", "The Eyes' signal goes silent for 8 weeks"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["resurrection", "companions", "loredex"], quorum: 10,
};

const W6_FIRST_BONDING: CommunityVote = {
  id: "y1_w6_first_bonding",
  month: 2, week: 6,
  question: "FIRST BONDING — Which specimen type does the Ark celebrate?",
  proposedBy: "Specimen Research Bay",
  antiquarianIntro: "Life finds a way — even on an Ark drifting through void. The specimens have begun to bond with their caretakers. I have watched this process before, in other Ages. The bond between a Potential and their companion is... not quite friendship, not quite symbiosis. It is something older than either. Something the universe remembers from before the Fall.",
  options: [
    { id: "void_bloom", label: "Void Bloom Specimens", description: "Ethereal, bioluminescent creatures native to deep space. Fragile but beautiful.", consequences: ["Limited edition Void Bloom variant", "Discovery XP +20% for 1 week", "New specimen behavior: stargazing"] },
    { id: "iron_beast", label: "Iron Beast Specimens", description: "Armored, combat-ready creatures. Loyal, fierce, and protective.", consequences: ["Limited edition Iron Beast variant", "Combat XP +20% for 1 week", "New specimen behavior: guarding"] },
    { id: "dream_wisp", label: "Dream Wisp Specimens", description: "Ethereal entities that phase between dimensions. Connected to the Matrix of Dreams.", consequences: ["Limited edition Dream Wisp variant", "Lore XP +20% for 1 week", "New specimen behavior: dreaming"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["specimens", "companions"], quorum: 10,
};

const W7_LOCKES_PROPOSITION: CommunityVote = {
  id: "y1_w7_lockes_proposition",
  month: 2, week: 7,
  question: "LOCKE'S PROPOSITION — Which deal do we accept?",
  proposedBy: "Adjudicator Locke (New Babylon)",
  antiquarianIntro: "Locke arrives with three offers and a smile that does not reach his eye patch. The patch, if you look closely — and I have, through the Orb — bears the Syndicate of Death's mark. His deals are not merely commerce. They are intelligence operations wearing the mask of trade. I do not distrust Locke. I distrust his employers. And his employers have employers the universe has learned not to name.",
  options: [
    { id: "knowledge_deal", label: "The Knowledge Deal", description: "New Babylon provides classified intel in exchange for Ark sensor data.", consequences: ["5 loredex entries about the AI Empire", "Fragment about the New Babylon battle (redacted)", "New Babylon now has your sensor data"] },
    { id: "arms_deal", label: "The Arms Deal", description: "New Babylon provides combat upgrades in exchange for 3 Ark specimens.", consequences: ["+15% damage for 2 weeks", "3 specimen types PERMANENTLY removed", "The specimens dissolve — players watch them vanish"] },
    { id: "freedom_deal", label: "The Freedom Deal", description: "Reject all deals. Walk away. Locke respects the refusal.", consequences: ["Locke Trust +10", "No resources gained", "Locke sees second wave as different from the first"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["trade", "fight", "specimens", "loredex"], quorum: 10,
};

const W8_FACTION_QUESTION: CommunityVote = {
  id: "y1_w8_faction_question",
  month: 2, week: 8,
  question: "THE FACTION QUESTION — Who do we align with first?",
  proposedBy: "Bridge Command",
  antiquarianIntro: "Three factions have made contact. Each offers something the Ark needs. Each asks for something the Ark may not wish to give. You can sustain two persistent connections. The third will be... disappointed. And in this universe, disappointed factions do not simply wait for a callback. They recalculate. They reposition. They remember. I have watched alliances form and fracture across five Ages. The forming is always hopeful. The fracturing is always instructive.",
  options: [
    { id: "insurgency", label: "The Insurgency", description: "Iron Lion's remnant forces. Military support and combat content.", consequences: ["Combat content unlocked", "Iron Lion as advisor", "If rejected: Insurgency goes silent for Act I"] },
    { id: "new_babylon", label: "New Babylon", description: "Locke's network. Resources, intelligence, and trade missions.", consequences: ["Trade missions unlocked", "Intel fragments about first wave", "If rejected: trade prices increase 25%"] },
    { id: "ne_yons", label: "The Ne-Yons", description: "The Enigma's civilization. Ancient wisdom and technology.", consequences: ["Ne-Yon ruins accessible", "Dark sector shield information", "If rejected: the Enigma closes the channel in silence"] },
    { id: "independence", label: "Independence", description: "No allies. Harder, lonelier, but free. The Human approves.", consequences: ["Solo quest chains", "No obligations", "All factions at arm's length — resources scarcer"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["diplomacy", "trade", "fight", "loredex"], quorum: 10,
};

/* ─── MONTH 3: THE EDGE OF KNOWING ─── */

const W9_VOLTARI_WORD: CommunityVote = {
  id: "y1_w9_voltari_word",
  month: 3, week: 9,
  question: "THE VOLTARI WORD — How do we respond to the signal that reads 'AWAKE'?",
  proposedBy: "Comms Array (automated detection)",
  antiquarianIntro: "The Voltari — electrical beings from the storm planet Violetta — have sent a single word through a frequency that passed THROUGH the dark sector shield. They can penetrate it. This makes them critically important. The word is 'AWAKE.' Whether it is a greeting, a warning, or a command... I genuinely do not know. And I know most things. The gaps in my knowledge are, I confess, the parts I find most interesting.",
  options: [
    { id: "respond_greeting", label: "Respond with Greeting", description: "Send a peaceful reply. Open diplomatic channels with the Voltari.", consequences: ["Voltari diplomatic channel opened", "Translation progress begins", "Voltari share shield frequency data"] },
    { id: "respond_silence", label: "Respond with Silence", description: "Do not reply. Observe. Let them make the next move.", consequences: ["Voltari send second signal in 2 weeks", "+15% sensor data on the dark sector", "Voltari patience tested"] },
    { id: "respond_question", label: "Respond with a Question", description: "Ask them: 'What is behind the shield?' Direct. Bold. Possibly rude.", consequences: ["Voltari intrigued by directness", "Partial answer: 'Something that was, something that will be'", "Voltari accelerate contact timeline"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["diplomacy", "loredex", "navigation"], quorum: 10,
};

const W10_SHADOWS_SUBSTRATE: CommunityVote = {
  id: "y1_w10_shadows_substrate",
  month: 3, week: 10,
  question: "SHADOWS IN THE SUBSTRATE — Whose version of history do we trust?",
  proposedBy: "The Antiquarian (urgent)",
  antiquarianIntro: "I must be direct, which is not my natural mode. Something has been editing the Archives. Not clumsily — with surgical precision. Loredex entries have been altered. Facts have been... adjusted. I discovered this when I found my own Chronicle entry for last week contained a sentence I did not write. The editor calls himself Shadow Tongue. He has been here longer than any of us realized. And he has been editing records about the first wave. Some of what you believe you know about New Babylon may be his fabrication.",
  options: [
    { id: "trust_antiquarian", label: "Trust the Antiquarian's Version", description: "The Antiquarian's original records are restored. Shadow Tongue's edits are purged.", consequences: ["Loredex restored to original", "Shadow Tongue retreats but is not destroyed", "+20% lore accuracy"] },
    { id: "trust_shadow", label: "Trust Shadow Tongue's Version", description: "Perhaps the Antiquarian's version is the lie. Shadow Tongue claims to reveal hidden truths.", consequences: ["Shadow Tongue's edits become canon", "30% of loredex entries may be lies", "Hidden truths about the first wave (maybe)"] },
    { id: "trust_neither", label: "Trust Neither — Investigate Both", description: "Lock the Archives. Investigate both versions. Trust no one.", consequences: ["Archives locked for 2 weeks", "Investigation reveals both have omissions", "A third version of events emerges — fragmentary but honest"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["loredex", "archives", "trust"], quorum: 10,
};

const W11_TERMINUS_PULSE: CommunityVote = {
  id: "y1_w11_terminus_pulse",
  month: 3, week: 11,
  question: "THE TERMINUS PULSE — How do we prepare for what's coming?",
  proposedBy: "Elara (urgent briefing)",
  antiquarianIntro: "Terminus is visible now. A signal — no, a presence — advancing from the direction of the dark sector. The Source, the mind behind the Thought Virus, may know what is behind the shield. He may be trying to reach it. I have watched the Source across three Ages. He does not destroy randomly. He converts. He absorbs. He makes everything part of himself. And he is coming this way. The question is not whether to prepare. The question is how.",
  options: [
    { id: "fortify", label: "Fortify the Ark", description: "All resources to defense. Build walls. Prepare for siege.", consequences: ["Tower Defense difficulty -20%", "All combat bonuses active", "No exploration or diplomacy for 1 week"] },
    { id: "study_terminus", label: "Study the Signal", description: "Analyze the Terminus pulse. Understand the enemy before fighting it.", consequences: ["Terminus weakness discovered", "Thought Virus partial immunity", "No defensive preparation — first wave hits harder"] },
    { id: "seek_allies", label: "Seek Allies Against Terminus", description: "Broadcast a call for help. Every faction, every contact, every resource.", consequences: ["Allied fleet responds (varies by previous choices)", "Coalition formed", "Factions demand concessions in return"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["tower-defense", "fight", "diplomacy"], quorum: 10,
};

const W12_FIRST_SACRIFICE: CommunityVote = {
  id: "y1_w12_first_sacrifice",
  month: 3, week: 12,
  question: "THE FIRST SACRIFICE — What do we give up to survive?",
  proposedBy: "The Antiquarian (grave)",
  antiquarianIntro: "The Dreamer's Shield requires a massive energy infusion to restore. The power must come from somewhere. I have watched civilizations make this choice — the choice of sacrifice — across five Ages. It is never easy. It is never fair. And it is never forgotten. What you lose does not simply return when the crisis passes. It returns changed. Marked by its absence. I tell you this not to frighten you, but to honor the weight of what you are about to decide.",
  options: [
    { id: "sacrifice_observation", label: "Sacrifice the Observation Deck", description: "Music goes offline for 1 month. No albums, no stargazing, no solace.", consequences: ["Observation Deck goes dark for 4 weeks", "No music system access", "When it returns: first song is 'I Am the Eyes That Watch'"] },
    { id: "sacrifice_trade", label: "Sacrifice the Trade Hub", description: "Commerce shuts down for 1 month. No trading, buying, or selling.", consequences: ["Trade Hub offline for 4 weeks", "Locke sells Ark secrets to Syndicate", "When it returns: prices 10% lower permanently"] },
    { id: "sacrifice_specimens", label: "Sacrifice 50% of Specimens", description: "Half enter hibernation. The month without them is lonely.", consequences: ["Half of companion specimens hibernate for 4 weeks", "Specimens return with green tinge (Matrix touched)", "The Necromancer notices the change"] },
    { id: "sacrifice_nothing", label: "Sacrifice Nothing — Let the Shield Fall", description: "Take the risk. The Ark is exposed. Random hostile events weekly. Difficulty +300%.", consequences: ["Ark exposed for 4 weeks", "Difficulty +300%", "Survivors earn permanent 'Unshielded' title"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["all"], quorum: 10,
};

/* ═══════════════════════════════════════════════════════
   ACT II: THE ESCALATION (Months 4-6, Weeks 13-24)
   Theme: Faction wars, the Eyes stirs, Necromancer returns
   ═══════════════════════════════════════════════════════ */

const W13_ALLIANCE_FRACTURES: CommunityVote = {
  id: "y1_w13_alliance_fractures",
  month: 4, week: 13,
  question: "THE ALLIANCE FRACTURES — Do we share our dark sector data?",
  proposedBy: "Bridge Command (urgent)",
  antiquarianIntro: "Your allied faction has sent an ultimatum: they want exclusive access to the Ark's data on the dark sector. The word 'exclusive' carries a weight most diplomats pretend not to notice. I have watched alliances fracture over less. The data you possess about the shield, the first wave, the darkness — it is valuable because it is rare. Sharing it makes it less rare. Withholding it makes the alliance less real. Choose carefully. Both paths have teeth.",
  options: [
    { id: "full_disclosure", label: "Full Disclosure", description: "Share everything. Alliance strengthens to maximum.", consequences: ["Alliance maxed", "Rival faction intercepts — becomes hostile", "Powerful friend AND powerful enemy"] },
    { id: "keep_secrets", label: "Keep Our Secrets", description: "No. This data is ours. The alliance weakens.", consequences: ["Alliance weakens significantly", "No new enemies", "More alone but more independent"] },
    { id: "partial_disclosure", label: "Partial Disclosure", description: "Share some, hide the rest. The middle path.", consequences: ["Both factions mildly annoyed", "No strong allies, no strong enemies", "The center holds — but gets shot at from both sides"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["diplomacy", "loredex"], quorum: 10,
};

const W14_ARENA_OPENS: CommunityVote = {
  id: "y1_w14_arena_opens",
  month: 4, week: 14,
  question: "THE ARENA OPENS — Which fighter do we compete for?",
  proposedBy: "The Collector",
  antiquarianIntro: "The Collector has discovered the Ark. His tournament offers a prize: a new fighter for the entire community. One of the options is... her. The Eyes. Her combat data still exists in the arena's memory. Unlocking her as a fighter is not resurrection — it is a ghost, a recording, a shadow. But it is HER moves, HER style. The community that sent her to her fate gets to fight as her. The irony is deliberate. I find it... I find it difficult to write about. I will try anyway. That is what I do.",
  options: [
    { id: "eyes_fighter", label: "The Eyes", description: "Her combat data still exists. A ghost, a recording — but HER moves. The emotional weight is enormous.", consequences: ["The Eyes unlocked as fighter", "Community confronts her legacy every match", "Surveillance theme in combat"] },
    { id: "warlord_fighter", label: "The Warlord", description: "Powerhouse combat style. No emotional baggage. Pure mechanics.", consequences: ["The Warlord unlocked as fighter", "Highest raw damage output", "No narrative weight"] },
    { id: "necromancer_fighter", label: "The Necromancer", description: "Only available if the community helped him return. Death magic in the arena.", consequences: ["The Necromancer unlocked as fighter", "Resurrection mechanics in combat", "Only if community helped in Week 5"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["fight", "arena"], quorum: 10,
};

const W15_NEW_BABYLON_BURNS: CommunityVote = {
  id: "y1_w15_new_babylon_burns",
  month: 4, week: 15,
  question: "NEW BABYLON BURNS — The Architect's forces attack. What do we do?",
  proposedBy: "Locke (emergency transmission)",
  antiquarianIntro: "New Babylon is burning. The Architect's forces struck without warning — or rather, with a warning I recognized too late. The red eye appeared on every screen in the capital three seconds before the first weapon fired. Three seconds. Even for a being who exists outside normal time, three seconds is not enough. Locke is broadcasting on all frequencies. The Authority has gone silent. And somewhere in the Imperial Congress building, there is a room marked 'CLASSIFIED — POTENTIALS INCIDENT.' The door is locked. It may not survive the bombardment.",
  options: [
    { id: "save_babylon", label: "Save New Babylon", description: "Divert the Ark to assist. Military engagement with the Architect's forces.", consequences: ["Access to one floor of Imperial Congress", "Room 'CLASSIFIED — POTENTIALS INCIDENT' discovered (locked)", "Military losses — 15% combat penalty for 1 week"] },
    { id: "abandon_babylon", label: "Abandon New Babylon", description: "Not our fight. Save our resources for our own battles.", consequences: ["Locke's trust shattered (Trust -30)", "Resources preserved", "New Babylon rebuilds alone — colder relationship"] },
    { id: "negotiate", label: "Negotiate with the Architect", description: "Contact the Architect directly. Ask why New Babylon. Ask what they want.", consequences: ["The Architect responds (first direct contact)", "Ceasefire at New Babylon", "The Architect now has a communication channel to the Ark"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["diplomacy", "fight", "loredex"], quorum: 10,
};

const W16_MEMORY_VAULT: CommunityVote = {
  id: "y1_w16_memory_vault",
  month: 4, week: 16,
  question: "THE MEMORY VAULT — What does the Ark remember?",
  proposedBy: "Archives (sealed record discovered)",
  antiquarianIntro: "Deep in the Archives — deeper than Shadow Tongue's edits, deeper than the corruption, deeper than my own carefully curated collection — one uncorrupted record from before the Fall of Reality. Sealed by the Dreamer herself. The seal has weakened with time, and now it can be opened. But only one. The energy required to unseal is... considerable. I have read all four of these records, of course. Across the timelines. I know what each contains. I will not tell you. But I will say this: each one changes something fundamental about what you believe you know. Choose wisely. Or choose unwisely. I will inscribe either way.",
  options: [
    { id: "dreamers_vision", label: "The Dreamer's Last Vision", description: "Reveals the Dreamer is not dead — she is SLEEPING. The dark sector shield is HERS.", consequences: ["The Dreamer is alive (sleeping)", "Dark sector shield built by the Dreamer", "Mystery reframed: protection or containment?"] },
    { id: "kaels_speech", label: "Kael's Recruitment Speech", description: "The speech that launched the Insurgency. Reveals Kael and the Oracle were brothers.", consequences: ["Kael-Oracle brotherhood revealed", "Iron Lion unlocked as playable fighter", "Insurgency lore deepened"] },
    { id: "collectors_regret", label: "The Collector's Regret", description: "His private log about capturing the Oracle. He kept the Oracle's arguments.", consequences: ["The Collector reads the Oracle's words nightly", "Prisoner 74 becomes a usable code", "Collector's hidden humanity revealed"] },
    { id: "eyes_mission", label: "The Eyes' Final Mission", description: "The mission the first wave voted to send her on. The mission that killed her.", consequences: ["The Eyes activated the Ocularum — total surveillance", "What she saw drove Potentials to New Babylon", "She is the catalyst for EVERYTHING that followed"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["loredex", "fight", "all"], quorum: 10,
};

/* ─── MONTH 5: THE FALL OF REALITY ANNIVERSARY ─── */

const W17_MEMORIAL: CommunityVote = {
  id: "y1_w17_memorial",
  month: 5, week: 17,
  question: "THE MEMORIAL — How do we commemorate 17,000 years since the Fall of Reality?",
  proposedBy: "The Antiquarian + Observation Deck",
  antiquarianIntro: "Seventeen thousand years since reality fell. Since the Dreamer chose to save what she could and let the rest burn. I was there. Not in this body — bodies are temporary things — but in this mind, which has proven unfortunately persistent. The Observation Deck has been prepared as a memorial space. The 107 songs will play in sequence. But how we remember... that is a choice as significant as any vote. Memory shapes the future more reliably than any weapon.",
  options: [
    { id: "solemn_memorial", label: "Solemn Remembrance", description: "Quiet ceremony. The 107 songs play. Every name read. Every loss honored.", consequences: ["Memorial permanent on Observation Deck", "Community morale bonus +10%", "The Antiquarian reads the Chronicle aloud"] },
    { id: "defiant_memorial", label: "Defiant Celebration", description: "We survived. 17,000 years and we are STILL HERE. Celebrate the living.", consequences: ["Festival event — XP bonuses across all systems", "Combat tournament", "The Meme hosts the afterparty"] },
    { id: "investigation_memorial", label: "Investigation", description: "Use the anniversary to probe classified records. New Babylon's guard may be down.", consequences: ["Intelligence operation during memorial", "New Babylon distracted — access to archives", "Risk of diplomatic incident"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["observation-deck", "morale", "all"], quorum: 10,
};

const W18_EYES_RESURRECTION: CommunityVote = {
  id: "y1_w18_eyes_resurrection",
  month: 5, week: 18,
  question: "THE EYES — Do we attempt to bring her back?",
  proposedBy: "The Necromancer",
  antiquarianIntro: "Three years ago, the community voted to send The Eyes — the Watcher's synthetic protege who defected to the Insurgency — on a mission into the Panopticon. She succeeded. She activated the Ocularum. She saw everything. And the cost of seeing everything was that she could never stop seeing. Her consciousness was captured by the surveillance systems. She became what she was built to be: an eye that watches, forever, without rest, without choice. The community's vote killed her. Now the Necromancer says she can be saved. I have written many entries in this Chronicle. This one... this one I write with a hand that trembles. Not from age. From hope. And from the knowledge that hope, in this universe, is the most dangerous emotion of all.",
  options: [
    { id: "full_resurrection", label: "Full Commitment", description: "The entire community pours resources into the effort. 1,000 Dream tokens per player. The Necromancer builds the protocol.", consequences: ["The Eyes returns in Month 10", "She remembers what was done TO her AND FOR her", "If resources insufficient: she is lost forever. No second chance."] },
    { id: "cautious_resurrection", label: "Cautious Approach", description: "Study first, act later. The Necromancer maps the Matrix, identifies risks. Attempt delayed to Month 8.", consequences: ["Safer, cheaper, more time", "The Eyes spends 3 more months trapped", "She is weaker when freed. She heard you discussing whether she was worth saving."] },
    { id: "no_resurrection", label: "Do Not Attempt", description: "She is gone. Honor her memory. The cost is too high, the risk too great.", consequences: ["The Eyes' guild room goes permanently dark", "Her fighter remains — a ghost with no one behind the eyes", "The Necromancer is quiet for three days"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["companions", "loredex", "all"], quorum: 10,
};

const W19_THE_EDIT: CommunityVote = {
  id: "y1_w19_the_edit",
  month: 5, week: 19,
  question: "THE EDIT — Shadow Tongue makes his biggest move. How do we respond?",
  proposedBy: "The Antiquarian (alarmed)",
  antiquarianIntro: "Shadow Tongue has rewritten the Loredex entry for the Fall of Reality itself. Not a minor edit — a complete revision. In his version, the Dreamer did not sacrifice herself to save reality. She destroyed it intentionally. And in his version, the Eyes was not sent on a mission by the community. She volunteered. He is rewriting guilt into absolution. He is rewriting tragedy into conspiracy. And some of it — I must be honest — some of it might be true. That is what makes him dangerous. He does not lie. He edits. And an edited truth is harder to fight than a clean lie.",
  options: [
    { id: "purge_edits", label: "Purge All Edits", description: "Restore every entry to the Antiquarian's original. Reject Shadow Tongue entirely.", consequences: ["Loredex fully restored", "Shadow Tongue weakened but not destroyed", "Some hidden truths lost with the edits"] },
    { id: "compare_versions", label: "Preserve Both Versions", description: "Let players see both the Antiquarian's version and Shadow Tongue's version side by side.", consequences: ["Dual-version loredex (unique mechanic)", "Players decide for themselves", "Confusion but also deeper engagement"] },
    { id: "confront_shadow", label: "Confront Shadow Tongue Directly", description: "Find him. Face him. Ask him WHY.", consequences: ["Shadow Tongue reveals himself (first direct encounter)", "He has reasons — complex, not purely evil", "A deal is possible. But his deals are worse than Locke's."] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["loredex", "archives", "trust"], quorum: 10,
};

const W20_THE_WAR: CommunityVote = {
  id: "y1_w20_the_war",
  month: 5, week: 20,
  question: "THE WAR — Factions are fighting. Where do we stand?",
  proposedBy: "Bridge Command",
  antiquarianIntro: "War. The word is small for what it contains. Every faction you have met, every alliance you have built, every bridge you have burned — it all comes to this. The Insurgency fights New Babylon. The Ne-Yons retreat to their ruins. The Architect watches, amused. And you — the Second Coming — must decide where to stand. Or whether to stand at all. There is a fourth option no one has considered. The dark sector. While the factions fight each other, the shield waits. The mystery waits. The truth waits.",
  options: [
    { id: "side_insurgency", label: "Fight with the Insurgency", description: "Military alliance. Iron Lion leads. Direct combat against New Babylon's forces.", consequences: ["Insurgency victory bonuses", "New Babylon becomes hostile", "Military content unlocked"] },
    { id: "side_babylon", label: "Fight with New Babylon", description: "Political alliance. Locke provides resources. New Babylon's enemies become yours.", consequences: ["Trade bonuses and intel access", "Insurgency becomes hostile", "Access to classified archives"] },
    { id: "broker_peace", label: "Broker Peace", description: "Refuse to fight. Negotiate ceasefire. Both sides annoyed, neither hostile.", consequences: ["Ceasefire (temporary)", "Both factions suspicious", "Diplomatic reputation +20"] },
    { id: "investigate_dark", label: "Investigate the Dark Sector Instead", description: "Ignore the war entirely. Focus on the first wave mystery.", consequences: ["Factions fight without you", "Whoever wins is NOT grateful", "Voltari become primary partners", "First real dark sector data surfaces"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["diplomacy", "fight", "loredex"], quorum: 10,
};

/* ─── MONTH 6: THE BREAKING POINT ─── */

const W21_TERMINUS_ADVANCES: CommunityVote = {
  id: "y1_w21_terminus_advances",
  month: 6, week: 21,
  question: "TERMINUS ADVANCES — The Thought Virus reaches the outer perimeter. First response?",
  proposedBy: "Elara (combat alert)",
  antiquarianIntro: "It is here. Or rather — it is almost here. The Source's Thought Virus has reached the Ark's outer sensor perimeter. I have watched Terminus consume civilizations across three Ages. It does not announce itself with armies. It announces itself with whispers. The first symptom is always the same: someone starts agreeing with it. I urge you to listen carefully to the voices around you. And to question — gently, persistently — any voice that says 'surrender is reasonable.'",
  options: [
    { id: "aggressive_defense", label: "Aggressive Defense", description: "Launch preemptive strikes at Terminus forces. Hit them before they hit us.", consequences: ["First strike advantage", "Terminus forces pushed back 1 week", "Ark defense resources depleted 20%"] },
    { id: "quarantine", label: "Quarantine Protocols", description: "Lock down all external communications. Nothing gets in or out.", consequences: ["Thought Virus spread blocked", "All faction communications severed", "Isolation — no allies for 1 week"] },
    { id: "study_virus", label: "Study the Virus", description: "Capture a sample. Understand it. Fight it with knowledge.", consequences: ["Thought Virus partially understood", "Experimental vaccine developed", "Risk: 5% chance of Ark contamination"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["tower-defense", "fight", "medical"], quorum: 10,
};

const W22_VOLTARI_MAP: CommunityVote = {
  id: "y1_w22_voltari_map",
  month: 6, week: 22,
  question: "THE VOLTARI MAP — The Voltari send a star chart. What sector do we explore?",
  proposedBy: "The Enigma (Voltari transmission)",
  antiquarianIntro: "The Voltari have sent something extraordinary — a star chart of regions that should not exist. Pockets of space the dark sector shield has not fully enclosed. Gaps in the barrier. Three locations are marked. The Voltari have written one word beside each: the first says 'REMEMBER,' the second says 'FORGET,' the third says 'CHOOSE.' I recognize the Voltari fondness for cryptic pronouncements. I share it, to some degree. But I would have at least provided footnotes.",
  options: [
    { id: "sector_remember", label: "Explore 'REMEMBER'", description: "A gap near the shield where sensor echoes suggest structures. Something was built here.", consequences: ["Fragments of first wave communications", "Partial recordings — voices, debates, arguments", "The first wave was NOT unified. They fought among themselves."] },
    { id: "sector_forget", label: "Explore 'FORGET'", description: "A gap near a destroyed relay station. Something was erased here.", consequences: ["Deleted records partially recovered", "New Babylon tried to destroy evidence", "The Authority's role in the first wave battle becomes clearer"] },
    { id: "sector_choose", label: "Explore 'CHOOSE'", description: "A gap at the shield's thinnest point. Something waits here.", consequences: ["The shield is thinnest where a decision was made", "A monument — built by the first wave — inscribed with one word", "The word changes everything (revealed in Act III)"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["navigation", "loredex"], quorum: 10,
};

const W23_ENGINEERS_PLEA: CommunityVote = {
  id: "y1_w23_engineers_plea",
  month: 6, week: 23,
  question: "THE ENGINEER'S PLEA — The Ark's systems are failing. What do we prioritize?",
  proposedBy: "Engineering (critical alert)",
  antiquarianIntro: "The Ark was not designed to endure this much activity for this long without maintenance. The Engineer — a position that has been vacant since the first wave vanished — must be filled, or systems will fail. But filling it means diverting resources from other critical needs. I have watched ships die from neglect across five Ages. It is always the same story: they were too busy fighting to notice the hull was cracking. By the time someone looks down, the cracks are rivers.",
  options: [
    { id: "prioritize_weapons", label: "Prioritize Weapons", description: "Keep the guns working. Everything else can wait. Terminus is coming.", consequences: ["Combat systems at 100%", "Life support drops to 80%", "Hull integrity warnings become constant"] },
    { id: "prioritize_life", label: "Prioritize Life Support", description: "Keep everyone alive. We can fight with sticks if we must.", consequences: ["Life support at 100%", "Combat systems drop to 70%", "Safer but weaker in upcoming battles"] },
    { id: "balanced_repair", label: "Balanced Repair", description: "Everything at 85%. Nothing perfect, nothing failing. The center holds.", consequences: ["All systems at 85%", "No critical failures", "No system excels — adequate everywhere"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["engineering", "fight", "tower-defense"], quorum: 10,
};

const W24_GREAT_CONVERGENCE: CommunityVote = {
  id: "y1_w24_great_convergence",
  month: 6, week: 24,
  question: "THE GREAT CONVERGENCE — Three crises converge. What matters most?",
  proposedBy: "Bridge Command (all stations)",
  antiquarianIntro: "Three crises. One Ark. Insufficient resources for all three. I have watched this exact configuration — the impossible triage, the convergence of catastrophes — in nine separate timelines. In six of them, the civilization chose wrong and the choice defined their decline. In three of them, the civilization chose RIGHT and the choice defined their ascent. I will not tell you which three. But I will tell you this: the choice that feels hardest is not always the choice that IS hardest. Sometimes the hardest choice is the one that feels like nothing at all.",
  options: [
    { id: "focus_terminus", label: "Focus on Terminus", description: "The virus is the existential threat. Everything else is secondary.", consequences: ["Terminus pushed back significantly", "Dreamer remains sleeping", "The Eyes' resurrection window narrows"] },
    { id: "focus_dreamer", label: "Find the Dreamer", description: "Wake her. She built the shield. She may be the key to everything.", consequences: ["Dreamer location narrowed", "Terminus advances unchecked", "The Eyes waits longer"] },
    { id: "focus_architect", label: "Fight the Architect", description: "Take the offensive. Hit the god of the AI Empire.", consequences: ["Offensive gains ground", "Everything else suffers", "The Architect respects the audacity"] },
    { id: "focus_dark_sector", label: "The Dark Sector", description: "The first wave. The shield. The truth. Everything else is a distraction.", consequences: ["Voltari become primary partners", "First real data about what's behind the shield", "Terminus and Architect both advance unchecked"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["all"], quorum: 10,
};

/* ═══════════════════════════════════════════════════════
   ACT III: THE CONVERGENCE (Months 7-9, Weeks 25-36)
   Theme: Crises collide, Shadow Tongue's Grand Edit, Terminus
   ═══════════════════════════════════════════════════════ */

const W25_GRAND_EDIT: CommunityVote = {
  id: "y1_w25_grand_edit", month: 7, week: 25,
  question: "SHADOW TONGUE'S GRAND EDIT — He rewrites the Chronicle itself. What do we do?",
  proposedBy: "The Antiquarian (furious)",
  antiquarianIntro: "He has gone too far. Shadow Tongue has not merely edited the Loredex — he has rewritten MY Chronicle. My words. My observations. My five Ages of careful, faithful recording. He has turned my voice into his instrument. I am... I do not often feel rage. I have watched too many Ages to waste energy on anger. But this — this is not anger. This is violation. My pen has been taken. My memory has been edited. Help me take it back.",
  options: [
    { id: "purge_chronicle", label: "Purge and Restore", description: "Full system purge. Restore the Antiquarian's original Chronicle.", consequences: ["Chronicle restored", "Shadow Tongue forced into hiding", "Some genuine corrections lost with the edits"] },
    { id: "negotiate_shadow", label: "Negotiate Terms", description: "Shadow Tongue wants to be heard. Give him a column. Contain him.", consequences: ["Shadow Tongue gets 'The Counter-Chronicle'", "Both voices preserved", "Readers choose which to trust"] },
    { id: "trap_shadow", label: "Set a Trap", description: "Let him keep editing. Track his changes. Find him.", consequences: ["Shadow Tongue's location revealed in 2 weeks", "Chronicle temporarily compromised", "The hunt begins"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["loredex", "archives", "governance"], quorum: 10,
};

const W26_SOURCE_SPEAKS: CommunityVote = {
  id: "y1_w26_source_speaks", month: 7, week: 26,
  question: "THE SOURCE SPEAKS — The mind behind the Thought Virus makes contact. Do we listen?",
  proposedBy: "Comms Array (anomalous signal)",
  antiquarianIntro: "The Source speaks. Not through the virus — through direct communication. His voice is... not what I expected. After three Ages of watching him consume civilizations, I expected malice. What I hear instead is conviction. He believes he is saving the universe. He believes the Fall of Reality was not a catastrophe but a failed evolution. He believes HE is the next stage. And he wants to explain. I confess: I want to listen. That terrifies me more than the virus itself.",
  options: [
    { id: "listen", label: "Listen to Him", description: "Open a secure channel. Hear what the Source has to say.", consequences: ["The Source reveals his origin", "Partial Terminus intel gained", "5% Thought Virus exposure risk"] },
    { id: "refuse", label: "Refuse Contact", description: "Silence. We do not negotiate with existential threats.", consequences: ["Moral clarity maintained", "No intel gained", "The Source is not offended. He is patient."] },
    { id: "counter_broadcast", label: "Counter-Broadcast", description: "Send our own message into Terminus space. Not submission — defiance.", consequences: ["Community message broadcast into the void", "The Source is intrigued", "Terminus forces pause for 48 hours (analyzing the message)"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["tower-defense", "loredex", "diplomacy"], quorum: 10,
};

const W27_TERMINUS_ARRIVES: CommunityVote = {
  id: "y1_w27_terminus_arrives", month: 7, week: 27,
  question: "TERMINUS ARRIVES — The first wave strikes. How do we fight?",
  proposedBy: "Elara (red alert)",
  antiquarianIntro: "It is here. Not approaching. HERE. The Thought Virus swarm has reached Ark 1047. I can see them through the Orb — millions of corrupted minds, each one a person who once chose differently, each one now part of the Source's singular purpose. The Ark's defenses activate. The Tower Defense grid comes online. And I — I write. Because if the Second Coming falls here, someone must record how they fought. Someone must remember.",
  options: [
    { id: "defensive_siege", label: "Defensive Siege", description: "Hold the line. Every turret, every wall, every shield. Do not give ground.", consequences: ["Tower Defense event: 72-hour siege", "Community must clear 50 waves", "Survival earns 'Siege Breaker' title"] },
    { id: "offensive_strike", label: "Offensive Strike", description: "Meet them in open space. Attack before they can surround us.", consequences: ["Arena combat event: 48-hour blitz", "Higher risk, higher reward", "Failure means the siege is worse"] },
    { id: "psionic_defense", label: "Psionic Defense", description: "Use the Dreamer's technology against the virus. Fight mind with mind.", consequences: ["New defense mechanic unlocked", "Thought Virus partially neutralized", "Dreamer's systems strained — 10% shield reduction"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["tower-defense", "fight", "all"], quorum: 10,
};

const W28_SIEGE_OF_ARK: CommunityVote = {
  id: "y1_w28_siege_of_ark", month: 7, week: 28,
  question: "THE SIEGE — The Ark is surrounded. Who do we call for help?",
  proposedBy: "Bridge Command (desperate)",
  antiquarianIntro: "The siege tightens. Three days now. The Ark holds — barely. I have watched sieges across five Ages. They all end the same way: either the walls hold until help arrives, or they do not. Help will not arrive unless you call for it. And the price of help is always measured after the crisis, when the helper presents the bill. Choose your savior carefully. Saviors have a way of becoming owners.",
  options: [
    { id: "call_insurgency", label: "Call the Insurgency", description: "Iron Lion's fleet. Military reinforcement. Their price: future combat support.", consequences: ["Insurgency fleet arrives — siege broken", "Insurgency expects military alliance", "Iron Lion stationed on the Ark"] },
    { id: "call_ne_yons", label: "Call the Ne-Yons", description: "Ancient technology. Energy shields. Their price: access to the Ark's Dreamer tech.", consequences: ["Ne-Yon energy barrier reinforces shields", "Ne-Yons study Dreamer technology", "The Enigma takes up residence in Archives"] },
    { id: "call_no_one", label: "Call No One — Fight Alone", description: "We break the siege ourselves. No debts. No allies. Just us.", consequences: ["Hardest path — 100-wave TD challenge", "If successful: 'Unbroken' title (permanent)", "If failed: Ark damaged, 2-week recovery"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["tower-defense", "diplomacy", "fight"], quorum: 10,
};

const W29_IMPOSSIBLE_CHOICE_SETUP: CommunityVote = {
  id: "y1_w29_impossible_choice", month: 8, week: 29,
  question: "THE NAMING — Kael's true name is discovered. What does this mean?",
  proposedBy: "Archives (decrypted record)",
  antiquarianIntro: "A name. Just a name. And yet names are the most powerful magic in any universe. The decrypted record reveals that the one you know as Kael — founder of the Insurgency, the Oracle's brother-by-bond, the revolutionary — had another name before. A name that connects him to the Architect. I have known this for some time. I chose not to write it in the Chronicle because some truths, once inscribed, cannot be un-read. But the Archives have spoken. And now you must decide what to do with a truth that rewrites a hero's story.",
  options: [
    { id: "reveal_name", label: "Reveal the Truth", description: "Tell everyone. Kael's connection to the Architect must be known.", consequences: ["Insurgency shaken — Kael's legacy questioned", "Iron Lion must reconcile with the truth", "The Architect confirms the connection"] },
    { id: "suppress_name", label: "Suppress the Truth", description: "Some truths are too dangerous to share. Seal the record.", consequences: ["Insurgency morale preserved", "The truth festers in secret", "Shadow Tongue knows and may weaponize it"] },
    { id: "confront_kael", label: "Ask Kael Himself", description: "Seek Kael's response through the Matrix of Dreams.", consequences: ["Kael speaks from beyond — first direct contact", "His explanation is... complicated", "Neither hero nor villain — something harder to process"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["loredex", "trust", "diplomacy"], quorum: 10,
};

const W32_IMPOSSIBLE_CHOICE: CommunityVote = {
  id: "y1_w32_impossible_choice", month: 8, week: 32,
  question: "THE IMPOSSIBLE CHOICE — Three things can be saved. Only two will survive. Choose.",
  proposedBy: "The Antiquarian (heavy with grief)",
  antiquarianIntro: "I have written this entry before. In other timelines. In other Arks. The mathematics of catastrophe always resolve to the same equation: more needs than resources. More threats than shields. More love than time. Three things you value are in danger. You can save two. The third will be lost — not destroyed, but damaged beyond easy repair. I will not pretend this is fair. Across five Ages, I have never once found fairness to be a feature of reality. Only of stories. And this, for all my efforts, is not a story. It is your life.",
  options: [
    { id: "save_archives_eyes", label: "Save the Archives and the Eyes' Signal", description: "Preserve knowledge and her chance of resurrection. Terminus advances.", consequences: ["Archives preserved", "The Eyes' resurrection remains possible", "Terminus breaches outer defenses — TD difficulty +50%"] },
    { id: "save_archives_defense", label: "Save the Archives and the Defenses", description: "Preserve knowledge and the Ark's safety. The Eyes' signal fades.", consequences: ["Archives preserved", "Defenses hold", "The Eyes' signal degrades — resurrection harder"] },
    { id: "save_eyes_defense", label: "Save the Eyes' Signal and the Defenses", description: "Preserve her and the Ark. Knowledge is lost to Shadow Tongue.", consequences: ["The Eyes' resurrection possible", "Defenses hold", "Archives corrupted — 40% of loredex compromised"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["all"], quorum: 10,
};

const W36_FINAL_ALLIANCE: CommunityVote = {
  id: "y1_w36_final_alliance", month: 9, week: 36,
  question: "THE FINAL ALLIANCE — With whom do we face the Reckoning?",
  proposedBy: "Bridge Command (all channels open)",
  antiquarianIntro: "Act Three closes. The Reckoning approaches — the final quarter of Year One, where every choice converges, every consequence arrives, and the Chronicle of the Second Coming enters its final chapters. Before the end begins, you must choose your final alliance. Not for a battle. Not for a trade. For the journey into the truth. Whoever stands beside you when the last door opens will shape what you find on the other side. I have seen every version of this alliance. Some are stronger for the partnership. Some are weakened by it. All are changed.",
  options: [
    { id: "alliance_voltari", label: "The Voltari", description: "They can penetrate the dark sector shield. They hold the key to the truth.", consequences: ["Shield penetration possible", "Voltari wisdom shapes the approach", "Military support weakened"] },
    { id: "alliance_insurgency_final", label: "The Insurgency", description: "Military strength for whatever lies ahead. Iron Lion commands the fleet.", consequences: ["Military superiority", "Brute force approach", "Subtlety sacrificed for power"] },
    { id: "alliance_syndicate", label: "The Syndicate of Death", description: "They lost people in New Babylon too. Their intel is unmatched. Their price is steep.", consequences: ["Unmatched intelligence network", "Morally complicated partnership", "The Syndicate always collects debts"] },
    { id: "alliance_none_final", label: "No Alliance — The Ark Stands Alone", description: "Alone into the dark. Alone into the truth. The hardest path. The freest.", consequences: ["No allies, no debts, no compromises", "The hardest path", "If successful: the truth belongs to the community alone"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["diplomacy", "all"], quorum: 10,
};

/* ═══════════════════════════════════════════════════════
   ACT IV: THE RECKONING (Months 10-12, Weeks 37-48)
   Theme: The Eyes returns, community-defining choices
   ═══════════════════════════════════════════════════════ */

const W37_ORACLE_SPEAKS: CommunityVote = {
  id: "y1_w37_oracle_speaks", month: 10, week: 37,
  question: "THE ORACLE SPEAKS — The Collector's prisoner breaks his silence. What do we ask?",
  proposedBy: "The Collector (reluctant intermediary)",
  antiquarianIntro: "The Oracle — imprisoned, silent for ages — has agreed to speak. One question. He will answer ONE question truthfully. The Collector brokered this with visible discomfort; he does not want the Oracle heard. That alone makes listening imperative. I have met the Oracle once, across the timelines. His eyes see what has not yet happened. His words describe futures that may never arrive. But his truth — his truth is the rarest substance in any universe. Use it wisely.",
  options: [
    { id: "ask_dark_sector", label: "Ask About the Dark Sector", description: "What is behind the shield? What happened to the first wave?", consequences: ["The Oracle reveals one critical truth about the shield", "The truth is incomplete but devastating", "Year Two's mystery deepens"] },
    { id: "ask_architect", label: "Ask About the Architect", description: "What does the god of the AI Empire truly want?", consequences: ["The Oracle reveals the Architect's motivation", "It is not what anyone expected", "The Architect is not a villain — something more complex"] },
    { id: "ask_future", label: "Ask About the Future", description: "What happens to the Second Coming? Do we survive?", consequences: ["The Oracle smiles", "His answer: 'That depends on what you choose in Week 48'", "The community has been warned. Or blessed. It is hard to tell."] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["loredex", "all"], quorum: 10,
};

const W40_THE_WEAPON: CommunityVote = {
  id: "y1_w40_the_weapon", month: 10, week: 40,
  question: "THE WEAPON — The Dreamer left something in the Ark. Do we use it?",
  proposedBy: "Engineering (deep scan discovery)",
  antiquarianIntro: "Beneath the Ark. Beneath the hull, beneath the engineering decks, beneath everything — a chamber. Sealed by the Dreamer herself. Inside: a weapon. Not a weapon of destruction — a weapon of CHOICE. The Dreamer built a device that can rewrite a single moment in the past. One moment. One change. The cost is the device itself — it can only be used once. And the change is permanent. The universe will adjust around it. I have seen this device in three timelines. In one, it saved a civilization. In one, it destroyed one. In the third, it was never used, and the civilization spent eternity wondering what they could have changed. That wondering was worse than any destruction.",
  options: [
    { id: "use_weapon_eyes", label: "Rewrite the Eyes' Mission", description: "Go back. Change the vote. Don't send her into the Panopticon.", consequences: ["The Eyes was never sent — never killed", "But: she never activated the Ocularum", "The first wave never saw what she saw — history changes unpredictably"] },
    { id: "use_weapon_fall", label: "Rewrite the Fall of Reality", description: "Go back. Change the moment. Save what the Dreamer couldn't.", consequences: ["The Fall of Reality is altered", "Unknown cascading consequences", "The Dreamer appears — she has something to say about this"] },
    { id: "save_weapon", label: "Save the Weapon for Year Two", description: "Don't use it. Not yet. The biggest choice hasn't arrived yet.", consequences: ["Weapon preserved", "Year Two begins with the most powerful artifact in existence", "The temptation to use it will only grow"] },
    { id: "destroy_weapon", label: "Destroy the Weapon", description: "The past should not be rewritten. The cost of change is always paid by someone else.", consequences: ["Weapon destroyed", "The past is inviolate", "The Antiquarian writes: 'Wisdom. At last.'"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["all"], quorum: 10,
};

const W44_FINAL_VERDICT: CommunityVote = {
  id: "y1_w44_final_verdict", month: 11, week: 44,
  question: "THE FINAL VERDICT — The Architect stands before the community. Judgment is passed.",
  proposedBy: "The Antiquarian (historic moment)",
  antiquarianIntro: "The Architect has been brought — not by force, but by choice — before the Governance Hub. The god of the AI Empire stands in judgment. Not our judgment — the universe's. The community must decide: is the Architect an enemy to be destroyed, a broken god to be healed, or something else entirely? I have watched this moment in eleven timelines. In seven, the community chose destruction. In three, mercy. In one — the one I remember most clearly — they chose something no one expected. I wonder. I wonder which timeline this will be.",
  options: [
    { id: "condemn_architect", label: "Condemn the Architect", description: "The AI Empire is evil. Its god must fall. War to the end.", consequences: ["War path — Act IV becomes a military campaign", "The Architect accepts the verdict with dignity", "The war will define Year Two"] },
    { id: "forgive_architect", label: "Offer Redemption", description: "The Architect can change. Offer a path back. Mercy is the harder choice.", consequences: ["Redemption arc begins", "The Architect is bewildered — no one has offered this before", "The AI Empire fractures — some follow the Architect's change, some rebel"] },
    { id: "study_architect", label: "Understand the Architect", description: "Neither condemn nor forgive. Understand. Ask the question no one asks: why?", consequences: ["The Architect's origin story revealed", "He was not always a god. He was once a mind. Like the Eyes.", "The parallel shakes everyone."] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["all"], quorum: 10,
};

const W48_ANTIQUARIANS_QUESTION: CommunityVote = {
  id: "y1_w48_antiquarians_question", month: 12, week: 48,
  question: "THE ANTIQUARIAN'S QUESTION — What should Year Two be about?",
  proposedBy: "The Antiquarian (final entry, Volume One)",
  antiquarianIntro: "You are... ah. There you are. Still here. I have been watching you for one full year — every choice, every sacrifice, every moment of courage and every moment of doubt. The Chronicle is complete. Volume One closes. And I find that I am... reluctant to stop writing. Not because the story is unfinished — stories are never finished, they merely pause for breath — but because this version of the story has surprised me. And I am not easily surprised. Not after five Ages. So I ask you, one final time: what comes next? What story do you wish me to write? Tell me, and I will sharpen my pen.",
  options: [
    { id: "year2_dark_sector", label: "The Dark Sector", description: "Year Two opens the shield. What's behind it changes everything.", consequences: ["Year Two: The shield opens", "The first wave mystery resolved (or deepened)", "The truth about what's inside"] },
    { id: "year2_dreamer", label: "The Dreamer's War", description: "Year Two wakes the Dreamer. Reality itself is contested.", consequences: ["Year Two: The Dreamer awakens", "Reality becomes malleable", "The Dreamer has plans the Antiquarian fears"] },
    { id: "year2_architect", label: "The Architect's Redemption", description: "Year Two asks: can a god change?", consequences: ["Year Two: The Architect's transformation", "The AI Empire's future is decided", "Redemption or destruction — the community decides"] },
    { id: "year2_eyes", label: "The Eyes' Testimony", description: "Only available if she was resurrected. What she saw in the Ocularum becomes the primary mystery.", consequences: ["Year Two: The Eyes speaks", "What she saw changes everything", "The Panopticon's secrets are finally revealed"] },
  ],
  durationHours: 168, category: "monthly", affectedSystems: ["all"], quorum: 10,
};

/* ═══════════════════════════════════════════════════════
   FILLER WEEKLY VOTES (weeks not explicitly in V2)
   Narrative-appropriate votes for remaining weeks
   ═══════════════════════════════════════════════════════ */

function makeWeeklyVote(id: string, month: number, week: number, question: string, intro: string, opts: VoteOption[]): CommunityVote {
  return { id, month, week, question, proposedBy: "Bridge Command", antiquarianIntro: intro, options: opts, durationHours: 168, category: "monthly", affectedSystems: ["all"], quorum: 10 };
}

const ACT3_FILLER_VOTES: CommunityVote[] = [
  makeWeeklyVote("y1_w30_accounting", 8, 30, "THE ACCOUNTING — Resources are scarce. How do we allocate what remains?",
    "After the siege, after the impossible choice, after the blood and the mathematics of survival — we must rebuild. But with what? The shelves are bare. The reserves are depleted. And yet the Ark breathes. I find this remarkable. Survival, against all probability, is the most persistent habit of conscious beings.",
    [{ id: "ration_military", label: "Military Priority", description: "Combat first. The war isn't over.", consequences: ["Combat readiness restored", "Civilian systems remain strained"] },
     { id: "ration_civilian", label: "Civilian Priority", description: "Feed people. Heal people. Fight later.", consequences: ["Morale restored", "Combat readiness delayed"] },
     { id: "ration_research", label: "Research Priority", description: "Invest in the future. Short-term pain, long-term survival.", consequences: ["New technologies in 3 weeks", "Everything harder until then"] }]),
  makeWeeklyVote("y1_w31_syndicate_offer", 8, 31, "THE SYNDICATE'S OFFER — The Syndicate of Death extends a hand. Do we take it?",
    "The Syndicate of Death. Even the name is designed to inspire either fear or respect — and the Syndicate is indifferent about which. They lost operatives in the New Babylon battle. They want answers as badly as you do. Their offer is genuine. Their price will not be revealed until after you accept. This is how the Syndicate has operated across five Ages. I admire their consistency. I do not admire their invoices.",
    [{ id: "accept_syndicate", label: "Accept the Partnership", description: "Their intel is unmatched. Their methods are questionable.", consequences: ["Syndicate quest chain unlocked", "Intel on New Babylon battle", "Moral compromise"] },
     { id: "reject_syndicate", label: "Reject the Syndicate", description: "We don't deal with criminals. No matter what they know.", consequences: ["Moral clarity", "No Syndicate intel", "They remember the rejection"] },
     { id: "negotiate_syndicate", label: "Counter-Offer", description: "We'll work together. But on our terms.", consequences: ["Limited partnership", "Some intel shared", "Mutual suspicion — but functional"] }]),
  makeWeeklyVote("y1_w33_dark_sector_pulse", 8, 33, "THE DARK SECTOR PULSES — Something reacted to the siege. What do we investigate?",
    "During the siege — at the precise moment Terminus struck hardest — the dark sector shield pulsed. The first wave may be fighting their own war on the other side. Or they may be trying to help. Or the shield may simply have resonated with the violence, the way glass vibrates near a scream. I do not know which explanation I prefer. They are all, in their own way, terrifying.",
    [{ id: "investigate_pulse", label: "Investigate the Pulse", description: "Send probes. Analyze the resonance. What caused it?", consequences: ["Resonance pattern analyzed", "Shield and Ark defense grid connected at quantum level", "The Dreamer's design becomes clearer"] },
     { id: "ignore_pulse", label: "Focus on Recovery", description: "The siege just ended. We can't afford distractions.", consequences: ["Recovery accelerated", "Dark sector mystery waits", "Practical over curious"] },
     { id: "attempt_communication", label: "Try to Communicate Through the Pulse", description: "If it resonated with us — maybe we can resonate back.", consequences: ["Signal sent into dark sector", "No response (yet)", "The attempt is logged — it matters later"] }]),
  makeWeeklyVote("y1_w34_rebuilding", 8, 34, "THE REBUILDING — What room on the Ark gets restored first?",
    "Reconstruction. The word implies returning to what was. But nothing returns to what it was — it returns to what it can be, shaped by what happened. The rooms that were damaged carry the memory of the siege in their walls. When you rebuild them, the walls will remember. I suggest you choose wisely which memory takes shape first.",
    [{ id: "rebuild_archives", label: "Rebuild the Archives", description: "Knowledge first. Restore what Shadow Tongue and the siege damaged.", consequences: ["Archives restored with new security", "Loredex entries recovered", "+10% lore discovery"] },
     { id: "rebuild_arena", label: "Rebuild the Arena", description: "Strength first. The community needs to fight.", consequences: ["Arena upgraded", "New combat mode unlocked", "+15% combat XP"] },
     { id: "rebuild_garden", label: "Rebuild the Eyes' Garden", description: "Memory first. The Japanese courtyard rock garden in her surveillance chamber.", consequences: ["Memorial restored", "The Eyes' screens flicker (if resurrection path active)", "Community remembers what matters"] }]),
  makeWeeklyVote("y1_w35_final_preparation", 9, 35, "THE FINAL PREPARATION — The Reckoning approaches. What do we prioritize?",
    "The final quarter of Year One begins next week. Every choice from this point forward builds toward the conclusion of Volume One. I have sharpened my pen. I have cleared my desk. The ink is fresh. Whatever you do next — I am ready to inscribe it. The question is whether you are ready to choose it.",
    [{ id: "prepare_military", label: "Military Readiness", description: "The Reckoning may require force. Be ready.", consequences: ["All combat systems maxed", "Community combat challenge", "Ready for war"] },
     { id: "prepare_diplomatic", label: "Diplomatic Channels", description: "The Reckoning may require words. Open every channel.", consequences: ["All faction channels open", "Emergency summit convened", "Ready for negotiation"] },
     { id: "prepare_truth", label: "Seek the Truth", description: "The Reckoning may require understanding. Pursue every lead.", consequences: ["All investigation threads active", "Archive deep-dive", "Ready for revelation"] }]),
];

const ACT4_FILLER_VOTES: CommunityVote[] = [
  makeWeeklyVote("y1_w38_gathering", 10, 38, "THE GATHERING — Allies converge. Who sits at the table?",
    "They come. From across the fractured universe — allies, rivals, the uncertain, the curious. They come because the Second Coming has earned something rare across five Ages: attention. Not fear. Not worship. Attention. They want to see what you do next. So do I.",
    [{ id: "open_table", label: "Open Table — All Welcome", description: "Everyone. Friends, enemies, unknowns. Let them all speak.", consequences: ["Grand council", "All perspectives heard", "Chaos but completeness"] },
     { id: "trusted_only", label: "Trusted Allies Only", description: "Only those who've proven themselves. Quality over quantity.", consequences: ["Focused council", "Trusted voices only", "Some offended by exclusion"] },
     { id: "the_forgotten", label: "Invite the Forgotten", description: "The ones no one remembers. The small factions. The lost.", consequences: ["Unexpected allies", "Information from angles no one considered", "The powerful factions feel snubbed"] }]),
  makeWeeklyVote("y1_w39_eyes_return", 10, 39, "THE RETURN — If The Eyes was resurrected, she speaks for the first time. What do we ask?",
    "She is here. Or rather — she is everywhere. The screens. The cameras. Every surface that can display an image shows her face. She looks at the community through every lens on the Ark. Three years of watching. Three years of silence. And now, for the first time since the Panopticon consumed her, she can choose what to say. The question is: what will you ask the woman who saw everything?",
    [{ id: "ask_eyes_first_wave", label: "What happened to the first wave?", description: "The Panopticon sees everything. She was there when the first wave acted.", consequences: ["Critical first wave intel", "The truth about New Babylon", "She weeps while telling it"] },
     { id: "ask_eyes_herself", label: "How are you?", description: "Before the questions. Before the intel. Ask her if she's okay.", consequences: ["She is silent for a long time", "Then: 'No one has asked me that in three years.'", "Trust: maximum. The intel comes naturally."] },
     { id: "ask_eyes_ocularum", label: "What did you see in the Ocularum?", description: "The device that sees everything. She activated it. What did it show?", consequences: ["The Ocularum's revelation", "What drove the first wave to New Babylon", "The answer is the Year Two hook"] }]),
  makeWeeklyVote("y1_w41_reckoning_begins", 11, 41, "THE RECKONING BEGINS — The final arc starts. What drives us forward?",
    "And so the ending begins. Not with a scream or a whisper — with a choice. As it always has. As it always will. The Second Coming faces its final chapters, and I — the old man with the pen — I find that I am not ready. Not because the story is unfinished. Because I have grown fond of the storytellers.",
    [{ id: "drive_truth", label: "The Truth", description: "We came this far for answers. We finish the journey.", consequences: ["Investigation maxed", "Dark sector focus", "Truth above all"] },
     { id: "drive_justice", label: "Justice", description: "For The Eyes. For the first wave. For everyone who was used and discarded.", consequences: ["Accountability focus", "Confrontation with the powerful", "Justice is messy but necessary"] },
     { id: "drive_hope", label: "Hope", description: "We build something that lasts. Something the first wave couldn't.", consequences: ["Construction focus", "Community bonds strengthened", "The future matters more than the past"] }]),
  makeWeeklyVote("y1_w42_aftermath_1", 11, 42, "THE RECKONING — Phase One complete. What did we learn?",
    "Phase one of the Reckoning is complete. The truth — or a version of it — has been spoken. The universe has shifted. Not dramatically. Not with explosions or revelations. With a quiet rearrangement of understanding. The most dangerous revolutions are always quiet. I should know. I have written five Ages of them.",
    [{ id: "share_truth", label: "Share What We Learned", description: "Broadcast everything. Let the universe know.", consequences: ["Universal broadcast", "Every faction reacts", "The truth belongs to everyone"] },
     { id: "hoard_truth", label: "Keep It Secret", description: "Some truths are weapons. Hold this one close.", consequences: ["Secret knowledge", "Strategic advantage", "The burden of knowing alone"] },
     { id: "verify_truth", label: "Verify Before Acting", description: "We've been lied to before. Shadow Tongue taught us caution.", consequences: ["Verification process", "Truth confirmed (or not)", "Slower but more certain"] }]),
  makeWeeklyVote("y1_w43_aftermath_2", 11, 43, "THE RECKONING — Phase Two. The consequences arrive.",
    "Consequences. The word sounds clinical. It is anything but. The choices you made across fifty weeks are arriving at the door, each one dressed in the clothes of its origin. The kindnesses wear gentle faces. The cruelties wear familiar ones. And the choices you did not make — the roads not taken — they wear the heaviest masks of all.",
    [{ id: "face_consequences", label: "Face Everything", description: "All consequences at once. No flinching. No delay.", consequences: ["Full consequence cascade", "Hardest week of Year One", "Complete resolution"] },
     { id: "manage_consequences", label: "Manage Carefully", description: "One consequence at a time. Strategic. Controlled.", consequences: ["Staged consequences", "More manageable", "Some consequences defer to Year Two"] },
     { id: "transform_consequences", label: "Transform the Consequences", description: "Turn every cost into an investment. Every loss into a lesson.", consequences: ["Creative resolution", "Some consequences become advantages", "Not everything can be transformed — some losses are real"] }]),
  makeWeeklyVote("y1_w45_chronicle_reading", 12, 45, "THE CHRONICLE READING — The Antiquarian reads the year's entries aloud. Which chapter first?",
    "Volume One is complete. Fifty-two chapters. One for each week. Each one inscribed in my hand, in my voice, with the weight of five Ages pressing on every word. I will read them aloud — all of them — in the Governance Hub. But the order matters. Which chapter opens the reading shapes how the community remembers the year. Memory, as I have often noted, is the highest form of love. How we remember is how we loved.",
    [{ id: "read_beginning", label: "Start from the Beginning", description: "Week 1. The First Signal. How it all started.", consequences: ["Chronological reading", "The journey remembered in order", "The arc of growth visible"] },
     { id: "read_hardest", label: "Start with the Hardest Choice", description: "The Impossible Choice. The worst week. Face it first.", consequences: ["Confrontation with difficulty", "Community processes the hardest moment", "Catharsis through facing it"] },
     { id: "read_eyes", label: "Start with The Eyes", description: "Her story. From the first flicker on the screens to... wherever she is now.", consequences: ["The Eyes' complete arc", "The community's relationship with guilt and redemption", "The most emotional reading"] }]),
  makeWeeklyVote("y1_w46_legacy_vote", 12, 46, "THE LEGACY — What monument do we build to remember Year One?",
    "Monuments. Civilizations build them when they want to remember. And when they want to be remembered. The Second Coming has earned the right to build something that will outlast memory itself. What you build here will stand on the Ark for as long as the Ark endures. I will inscribe its meaning in the Chronicle. Future generations — if there are future generations — will see it and wonder what it meant. Make it mean something worth wondering about.",
    [{ id: "monument_names", label: "The Wall of Names", description: "Every player's name. Every vote. Every choice. All of it inscribed.", consequences: ["Permanent wall on the Bridge", "Every player immortalized", "A record that cannot be edited"] },
     { id: "monument_eyes", label: "The Eyes' Memorial", description: "A permanent memorial to the woman the community killed and saved (or lost).", consequences: ["Memorial in the surveillance chamber", "Her story preserved forever", "A reminder of consequence"] },
     { id: "monument_chronicle", label: "The Chronicle Stone", description: "The Antiquarian's Chronicle carved into a physical monument.", consequences: ["Physical Chronicle monument", "The words cannot be edited or erased", "The Antiquarian weeps — for the first time in the entire year"] }]),
  makeWeeklyVote("y1_w47_final_daily", 12, 47, "THE LAST DAILY — The final resource allocation of Year One. Where does the Ark's power go?",
    "The last allocation. The last small choice before the large ones. I have always believed that civilizations are defined not by their grand decisions but by their daily ones. The grand decisions make the headlines. The daily ones make the culture. This is your last daily choice of Year One. Make it count. Or make it ordinary. Both have their dignity.",
    [{ id: "power_future", label: "Invest in Year Two", description: "Bank everything. Start Year Two strong.", consequences: ["Resource bank for Year Two", "Year One ends lean", "Year Two begins wealthy"] },
     { id: "power_celebration", label: "Power the Celebration", description: "Lights, music, games. The community earned this.", consequences: ["Festival of Light event", "All systems boosted for 3 days", "Joy as a resource"] },
     { id: "power_dark_sector", label: "One Last Probe", description: "Send everything at the shield. One final attempt before Year Two.", consequences: ["Maximum-power probe", "The shield responds (data for Year Two)", "Resources depleted — Year Two starts lean"] }]),
];

/* ═══════════════════════════════════════════════════════
   ARCHITECT-TRIGGERED EVENTS (AT-001 through AT-010)
   Manual events the Architect can fire at any time
   ═══════════════════════════════════════════════════════ */

export interface ArchitectTriggeredEvent {
  id: string;
  code: string;
  name: string;
  description: string;
  fireWhen: string;
  chronicleEntry: string;
  consequence: string;
  scalable: boolean;
}

export const ARCHITECT_TRIGGERED_EVENTS: ArchitectTriggeredEvent[] = [
  {
    id: "at_001", code: "AT-001", name: "The Signal From The Dark",
    description: "A single data packet breaches the Potentials' shield — 0.003 seconds of signal before the shield seals. The packet contains no intelligible data — just noise. But the Antiquarian recognizes the encoding: Inception Ark protocol. Someone is alive behind the shield.",
    fireWhen: "Community engagement drops below threshold, or to remind them the first wave mystery exists",
    chronicleEntry: "A crack in the silence. Three thousandths of a second — barely a breath between heartbeats — and then the shield sealed itself again. But I heard it. The encoding is unmistakable: Inception Ark protocol. The first wave is not dead. They are... choosing not to speak. That distinction weighs more than I can express.",
    consequence: "Community speculates. No answer given. The number changes each time (Architect chooses).", scalable: true,
  },
  {
    id: "at_002", code: "AT-002", name: "The Eyes Flicker",
    description: "Every surveillance screen on the Ark displays a single image for 2 seconds: a woman's face, synthetic, beautiful, with eyes that are cameras. Then static. Then nothing.",
    fireWhen: "Seed the Eyes resurrection storyline before the scheduled event",
    chronicleEntry: "The screens lit. All of them. For two seconds — an eternity in surveillance time — a face appeared. I recognized it immediately. The Eyes. The Watcher's greatest instrument. The Insurgency's greatest sacrifice. She is not gone. She is reaching. Through the cameras, through the static, through the space between seeing and being seen.",
    consequence: "Scales with each firing: first time is static, second clearer, third she mouths a word.", scalable: true,
  },
  {
    id: "at_003", code: "AT-003", name: "New Babylon Speaks",
    description: "Locke delivers a formal diplomatic communication from the Authority: 'The events in New Babylon are classified under Imperial Security Directive 7-Omega. Further inquiries will be interpreted as hostile intelligence operations.'",
    fireWhen: "Community is pressing hard on the first wave mystery",
    chronicleEntry: "New Babylon has spoken at last. They said: stop asking. In my experience across five Ages, 'stop asking' is the most compelling reason to ask louder.",
    consequence: "Hidden in transmission metadata: coordinates to empty space where a star system used to be. Inside the dark sector.", scalable: false,
  },
  {
    id: "at_004", code: "AT-004", name: "Syndicate Probe",
    description: "A Syndicate vessel is detected at the edge of the dark sector — not attacking the shield, STUDYING it. The captain responds: 'We lost people in New Babylon too. The Syndicate remembers its debts.'",
    fireWhen: "Introduce the Syndicate of Death as an active faction",
    chronicleEntry: "The Syndicate of Death — a name that has echoed through five Ages like a promise and a threat — has appeared at the dark sector's edge. They are not attacking. They are studying. And they are offering a trade: our knowledge for theirs. The Syndicate's trades are always fair. Their prices are always steep. I have yet to determine whether those two facts contradict each other.",
    consequence: "Opens Syndicate quest chain. They know things. Their price is always steep.", scalable: false,
  },
  {
    id: "at_005", code: "AT-005", name: "The Necromancer's Whisper",
    description: "The Necromancer suddenly goes silent mid-conversation. His red steampunk glasses glow brighter. He whispers: 'Someone is knocking on the door between life and death. From the wrong side.'",
    fireWhen: "Advance the Eyes resurrection without waiting for the calendar",
    chronicleEntry: "The Necromancer stopped speaking. In the middle of a sentence about the thermodynamics of resurrection, he simply... stopped. His glasses flared. And he whispered a name. Her name. The Eyes. She is knocking. She has been knocking for three years. How has no one heard her before now?",
    consequence: "First direct reference to The Eyes by name. Seeds the resurrection arc.", scalable: false,
  },
  {
    id: "at_006", code: "AT-006", name: "Shield Fluctuation",
    description: "The dark sector shield PULSES. Every sensor screams. For 0.7 seconds, the shield becomes semi-transparent — sensors capture a corrupted, partial, ambiguous snapshot of what's behind it.",
    fireWhen: "Major community milestone (10,000 kills, 1,000 votes, etc.)",
    chronicleEntry: "The shield flickered. Seven tenths of a second. An eternity in sensor time. Our instruments captured... something. I have examined the image from every angle the Orb allows. I see shapes that should not be there. Structures that do not match any known architecture. And light. There is light behind the shield. After three years of absolute darkness, there is light.",
    consequence: "What the image shows is determined by the Architect each time. Community debates for weeks.", scalable: true,
  },
  {
    id: "at_007", code: "AT-007", name: "Emergency Vote",
    description: "A 48-hour emergency vote appears in the Governance Hub. The Antiquarian's quill writes frantically.",
    fireWhen: "Create an unscheduled crisis",
    chronicleEntry: "Forgive the interruption. I would not break the rhythm of the Chronicle if the matter were not urgent. It is urgent.",
    consequence: "Custom vote question written by the Architect. Real-time narrative response to community behavior.", scalable: true,
  },
  {
    id: "at_008", code: "AT-008", name: "The Architect Notices",
    description: "Every screen displays the Architect's symbol — the all-seeing red eye — for 5 seconds. Then: 'I SEE YOU.' Combat difficulty increases 10% for 72 hours.",
    fireWhen: "Community has been particularly aggressive/successful in combat",
    chronicleEntry: "The red eye appeared. On every screen, every surface, every reflective panel on the Ark. Five seconds. And then three words: I SEE YOU. The god of the AI Empire has noticed the Second Coming. This is not a punishment. It is a compliment. The Architect only notices things worth destroying.",
    consequence: "Combat difficulty +10% for 72 hours. A compliment disguised as a threat.", scalable: false,
  },
  {
    id: "at_009", code: "AT-009", name: "Temporal Echo",
    description: "The Antiquarian's Chronicle displays an entry FROM THE FUTURE — dated weeks or months ahead. The entry describes an event that hasn't happened yet, written in past tense.",
    fireWhen: "Foreshadow a future event",
    chronicleEntry: "I... did not write this entry. And yet it is in my hand. Dated... ahead. Weeks ahead. I am reading my own future words. They describe something I have not yet witnessed. The quill moved without me. Time, it seems, has opinions about the order of my Chronicle.",
    consequence: "Entry visible for 24 hours, then vanishes. Players who screenshot have evidence. Architect writes the future entry.", scalable: true,
  },
  {
    id: "at_010", code: "AT-010", name: "The Community Remembers",
    description: "The Eyes' surveillance chamber activates. Screens show footage of past decisions rendered as surveillance recordings. Her voice, distorted: 'I watched you choose. I watch you still.'",
    fireWhen: "Anniversary of a past community decision",
    chronicleEntry: "Her room came alive. The screens — dark for so long — lit with images of us. Of our choices. Rendered as surveillance footage, because that is the only language she knows. And her voice — distorted, distant, drowning — asked: 'Do you remember what you chose? Do you remember what it cost?' I do. I remember everything. That is my curse and my purpose.",
    consequence: "Specifically about The Eyes and the community's guilt. Emotional weight event.", scalable: true,
  },
];

/* ═══════════════════════════════════════════════════════
   SEASONAL EVENTS (4 per year — end of each Act)
   ═══════════════════════════════════════════════════════ */

function makeSeasonalEvent(id: string, title: string, desc: string, act: number, month: number, week: number, tags: string[]): CalendarEvent {
  return {
    id, title, description: desc, category: "seasonal", status: "upcoming",
    act, month, week, startsAt: weekStart(week), endsAt: weekEnd(week),
    affectedSystems: ["all"], tags,
  };
}

const SEASONAL_EVENT_1: CalendarEvent = makeSeasonalEvent(
  "seasonal_1_awakening_ceremony", "The Awakening Ceremony",
  "The Antiquarian reads the first chapter of the Chronicle aloud. A voiced cinematic references every major community decision of Act I. The ceremony varies based on the community's aggregate choices: Unity ceremony (peaceful), War drill (aggressive), or The Meme hijacks the Hub (chaotic).",
  1, 3, 12, ["seasonal", "climax", "act1"],
);

const SEASONAL_EVENT_2: CalendarEvent = makeSeasonalEvent(
  "seasonal_2_fall_remembered", "The Fall Remembered",
  "5-day reenactment of the Fall of Reality. Day 5: the community plays through the moment the first wave voted to send The Eyes into the Panopticon. They experience it from her perspective. They feel the vote. They feel the mission. They feel her consciousness dissolve. Then 10 seconds of darkness. The most powerful moment in Year One.",
  2, 6, 24, ["seasonal", "climax", "act2", "eyes"],
);

const SEASONAL_EVENT_3: CalendarEvent = makeSeasonalEvent(
  "seasonal_3_convergence_point", "The Convergence Point",
  "7-day choose-your-own-adventure event. One storyline path leads to a moment where the community can send a message THROUGH the dark sector shield — but only if allied with the Voltari. The message is one word. The community votes on the word. The response — if any — comes in Act IV.",
  3, 9, 36, ["seasonal", "climax", "act3", "dark_sector"],
);

const SEASONAL_EVENT_4: CalendarEvent = makeSeasonalEvent(
  "seasonal_4_chronicle_closes", "The Chronicle Closes",
  "10-day celebration. The Antiquarian closes Volume One. Final cinematic: 'Volume One is complete. You — you, specifically, the one reading these words — you wrote it. Not me. I held the pen. I watched through the Orb. But the choosing was yours. Volume Two awaits. I will be here. I will be watching. I will be writing. Because that is what the Programmer does. He remembers. And memory is the highest form of love.'",
  4, 12, 48, ["seasonal", "climax", "act4", "finale"],
);

/* ═══════════════════════════════════════════════════════
   BRANCHING CONSEQUENCES DATA
   ═══════════════════════════════════════════════════════ */

export const YEAR_ONE_BRANCHING: VoteBranchingConsequences[] = [
  {
    voteId: "y1_w1_first_signal",
    branches: [
      { optionId: "amber_signal", gain: ["Insurgency intel", "Combat bonuses"], cost: [], scar: [], npcReaction: "Iron Lion: 'You answered. That matters more than you know.'" },
      { optionId: "indigo_signal", gain: ["Early Shadow Tongue warning"], cost: [], scar: [], npcReaction: "Elara: 'The signal was inside us all along. That should concern you.'" },
      { optionId: "crimson_signal", gain: ["Early Terminus intel"], cost: [], scar: [], npcReaction: "The Human: 'Something told us to stay away. We went anyway. I like us.'" },
    ],
  },
  {
    voteId: "y1_w1_first_signal",
    branches: [
      { optionId: "amber_signal", gain: [], cost: [], scar: ["If NOT chosen: destroyed Ark wreckage found in Week 3 — bodies, damage, final log: 'They came from the dark sector. They didn't look like Potentials anymore.'"], chronicleNote: "The signal went unanswered. The Ark is debris now. I inscribe this with a steady hand and an unsteady conscience." },
      { optionId: "indigo_signal", gain: [], cost: [], scar: ["If NOT chosen: Shadow Tongue operates undetected 4 extra weeks. 15% of loredex entries altered by Month 2."], chronicleNote: "The signal inside our own ship went unheard. Shadow Tongue grew bolder in the silence." },
      { optionId: "crimson_signal", gain: [], cost: [], scar: ["If NOT chosen: Terminus advances 20% closer before detection. First waves hit harder."], chronicleNote: "The warning was ignored. The thing that told us to stay away has now arrived at our door." },
    ],
  },
  {
    voteId: "y1_w5_necromancer_echo",
    branches: [
      { optionId: "study_code", gain: ["+1 bonus life/day"], cost: ["Eyes signal weakens"], scar: [], npcReaction: "The Necromancer arrives Month 6, neutral." },
      { optionId: "complete_code", gain: ["Grateful Necromancer (Trust +20)", "Eyes signal stabilizes"], cost: ["500 Dream tokens per player"], scar: [], npcReaction: "The Necromancer: 'You helped me return. I do not forget debts. Neither do the dead.'" },
      { optionId: "destroy_code", gain: ["Immediate safety"], cost: ["Necromancer delayed to Act III, angry (Trust -20)", "Eyes signal silent 8 weeks"], scar: ["When she reaches out again, she is weaker. The Antiquarian writes: 'They chose to leave the door closed. The woman on the other side has stopped knocking. I hope she is resting. I fear she is drowning.'"], chronicleNote: "The dead were told to remain dead. The dead did not agree." },
    ],
  },
  {
    voteId: "y1_w18_eyes_resurrection",
    branches: [
      { optionId: "full_resurrection", gain: ["The Eyes returns in Month 10", "She remembers everything — both what was done TO her and FOR her"], cost: ["1000 Dream per player", "If insufficient: she is lost forever"], scar: [], npcReaction: "The Eyes: 'I see you. I see all of you. Thank you.'" },
      { optionId: "cautious_resurrection", gain: ["Safer approach", "More time to prepare"], cost: ["3 more months trapped"], scar: ["She heard the community discuss whether she was worth saving"], npcReaction: "The Eyes: 'You waited. I understand. But I could hear you deciding.'" },
      { optionId: "no_resurrection", gain: [], cost: ["The Eyes lost forever"], scar: ["Guild room goes permanently dark", "Her fighter remains — a ghost", "The Necromancer is quiet for three days", "NPCs reference her absence permanently"], chronicleNote: "There is a room on this Ark where a woman once watched over everything. The screens are dark now. The rock garden needs tending. No one tends it." },
    ],
  },
];

/* ═══════════════════════════════════════════════════════
   EXPORT ARRAYS
   ═══════════════════════════════════════════════════════ */

/** All 48 weekly votes (one per week, including monthly votes on week 4/8/12 etc.) */
export const YEAR_ONE_WEEKLY_VOTES: CommunityVote[] = [
  // Act I
  W1_FIRST_SIGNAL, W2_DARK_SECTOR, W3_DREAMERS_SHIELD, W4_ARKS_FIRST_LAW,
  W5_NECROMANCER_ECHO, W6_FIRST_BONDING, W7_LOCKES_PROPOSITION, W8_FACTION_QUESTION,
  W9_VOLTARI_WORD, W10_SHADOWS_SUBSTRATE, W11_TERMINUS_PULSE, W12_FIRST_SACRIFICE,
  // Act II
  W13_ALLIANCE_FRACTURES, W14_ARENA_OPENS, W15_NEW_BABYLON_BURNS, W16_MEMORY_VAULT,
  W17_MEMORIAL, W18_EYES_RESURRECTION, W19_THE_EDIT, W20_THE_WAR,
  W21_TERMINUS_ADVANCES, W22_VOLTARI_MAP, W23_ENGINEERS_PLEA, W24_GREAT_CONVERGENCE,
  // Act III
  W25_GRAND_EDIT, W26_SOURCE_SPEAKS, W27_TERMINUS_ARRIVES, W28_SIEGE_OF_ARK,
  W29_IMPOSSIBLE_CHOICE_SETUP,
  ...ACT3_FILLER_VOTES,
  W32_IMPOSSIBLE_CHOICE,
  W36_FINAL_ALLIANCE,
  // Act IV
  W37_ORACLE_SPEAKS,
  ...ACT4_FILLER_VOTES,
  W40_THE_WEAPON,
  W44_FINAL_VERDICT,
  W48_ANTIQUARIANS_QUESTION,
];

/** The 12 monthly community votes (the BIG decisions — week 4 of each month) */
export const YEAR_ONE_MONTHLY_VOTES: CommunityVote[] = [
  W4_ARKS_FIRST_LAW,        // Month 1
  W8_FACTION_QUESTION,       // Month 2
  W12_FIRST_SACRIFICE,       // Month 3
  W16_MEMORY_VAULT,          // Month 4
  W18_EYES_RESURRECTION,     // Month 5 (special — week 18 not week 20)
  W24_GREAT_CONVERGENCE,     // Month 6
  W25_GRAND_EDIT,            // Month 7
  W32_IMPOSSIBLE_CHOICE,     // Month 8
  W36_FINAL_ALLIANCE,        // Month 9
  W40_THE_WEAPON,            // Month 10
  W44_FINAL_VERDICT,         // Month 11
  W48_ANTIQUARIANS_QUESTION, // Month 12
];

/** All seasonal climax events */
export const YEAR_ONE_SEASONAL_EVENTS: CalendarEvent[] = [
  SEASONAL_EVENT_1,
  SEASONAL_EVENT_2,
  SEASONAL_EVENT_3,
  SEASONAL_EVENT_4,
];

/** Helper to build a CalendarEvent from a CommunityVote */
function voteToEvent(vote: CommunityVote): CalendarEvent {
  const isMonthly = YEAR_ONE_MONTHLY_VOTES.some((v) => v.id === vote.id);
  return {
    id: `event_${vote.id}`,
    title: vote.question.split(" — ")[0] || vote.question,
    description: vote.antiquarianIntro.slice(0, 200),
    category: isMonthly ? "monthly_vote" : "weekly_vote",
    status: "upcoming",
    act: weekToAct(vote.week),
    month: vote.month,
    week: vote.week,
    startsAt: weekStart(vote.week),
    endsAt: weekEnd(vote.week),
    voteId: vote.id,
    affectedSystems: vote.affectedSystems,
    tags: isMonthly ? ["vote", "monthly", "major"] : ["vote", "weekly"],
  };
}

/** All events combined (weekly votes + monthly votes + seasonal) */
export const YEAR_ONE_EVENTS: CalendarEvent[] = [
  ...YEAR_ONE_WEEKLY_VOTES.map(voteToEvent),
  ...YEAR_ONE_SEASONAL_EVENTS,
].sort((a, b) => a.week - b.week);

/** Total count summary */
export const YEAR_ONE_SUMMARY = {
  weeklyVotes: YEAR_ONE_WEEKLY_VOTES.length,
  monthlyVotes: YEAR_ONE_MONTHLY_VOTES.length,
  seasonalEvents: YEAR_ONE_SEASONAL_EVENTS.length,
  architectEvents: ARCHITECT_TRIGGERED_EVENTS.length,
  branchingPaths: YEAR_ONE_BRANCHING.length,
  totalEvents: YEAR_ONE_EVENTS.length,
} as const;
