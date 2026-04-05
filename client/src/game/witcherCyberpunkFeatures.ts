/* ═══════════════════════════════════════════════════════
   WITCHER + CYBERPUNK 2077 INSPIRED FEATURES

   From The Witcher 3: Wild Hunt:
   1. Gwent-style standalone card game (already have Dischordia)
   2. Witcher Contracts = Bounty Board system
   3. Witcher Senses = Investigation mode
   4. Bestiary with weakness data
   5. Alchemy/Decoctions = consumable crafting

   From Cyberpunk 2077:
   6. Braindance = memory replay investigation
   7. Cyberware slots = augmentation system
   8. Fixers = NPC mission brokers (we have Locke)
   9. Street Cred = reputation affecting available content
   10. Phone system = NPC messaging (async dialog)
   ═══════════════════════════════════════════════════════ */

/* ═══ 1. BOUNTY BOARD (Witcher Contracts) ═══ */

export interface BountyContract {
  id: string;
  name: string;
  /** Who posted the bounty */
  postedBy: string;
  description: string;
  /** Investigation clues to find before combat */
  investigationSteps: string[];
  /** Target enemy */
  target: { name: string; type: string; weakness?: string };
  /** Reward */
  reward: { dream: number; xp: number; material?: string; reputation?: number };
  /** Difficulty */
  difficulty: "routine" | "dangerous" | "deadly" | "legendary";
  /** Narrative flag required */
  requiresFlag?: string;
  /** Time limit (hours, 0 = no limit) */
  timeLimitHours: number;
}

export const BOUNTY_CONTRACTS: BountyContract[] = [
  {
    id: "bounty_viral_nest", name: "Viral Nest Clearance", postedBy: "Elara",
    description: "A concentration of Thought Virus activity has been detected in the lower decks. Investigate and neutralize.",
    investigationSteps: ["Scan Medical Bay for viral signatures", "Follow the contamination trail to Engineering", "Identify the nest location"],
    target: { name: "Viral Nexus", type: "thought_virus", weakness: "Fire damage" },
    reward: { dream: 50, xp: 100, material: "viral_ichor", reputation: 10 },
    difficulty: "dangerous", timeLimitHours: 48,
  },
  {
    id: "bounty_shadow_agent", name: "The Shadow's Agent", postedBy: "Agent Zero",
    description: "Someone on the Ark is feeding information to the Hierarchy. Find the mole.",
    investigationSteps: ["Check access logs in Archives", "Cross-reference with comms transmissions", "Confront the suspect"],
    target: { name: "Hierarchy Spy", type: "humanoid", weakness: "Interrogation" },
    reward: { dream: 75, xp: 150, reputation: 20 },
    difficulty: "deadly", requiresFlag: "shadow_tongue_evidence", timeLimitHours: 72,
  },
  {
    id: "bounty_rogue_ai", name: "Rogue Maintenance AI", postedBy: "The Human",
    description: "A maintenance subroutine has gone rogue in Engineering. It's building something.",
    investigationSteps: ["Hack the Engineering console", "Trace the AI's command structure", "Disable its power source"],
    target: { name: "MAINT-7 Rogue", type: "ai_construct", weakness: "EMP/Logic puzzles" },
    reward: { dream: 40, xp: 80, material: "circuit_board" },
    difficulty: "routine", timeLimitHours: 24,
  },
  {
    id: "bounty_ghost_signal", name: "Ghost in the Signal", postedBy: "Adjudicator Locke",
    description: "An unauthorized signal is broadcasting from the Ark. Trace it. New Babylon pays well for intelligence.",
    investigationSteps: ["Calibrate the Comms Array receiver", "Triangulate the signal source", "Decode the transmission"],
    target: { name: "Unknown Broadcaster", type: "signal", weakness: "Decryption" },
    reward: { dream: 60, xp: 120, reputation: 15 },
    difficulty: "dangerous", timeLimitHours: 48,
  },
  {
    id: "bounty_terminus_scout", name: "Terminus Scout", postedBy: "The Source",
    description: "A scout drone from Terminus has breached the Ark's perimeter. Find it before it reports back.",
    investigationSteps: ["Check Observation Deck sensors", "Follow energy trail through Cargo Bay", "Intercept before it reaches the hull"],
    target: { name: "Terminus Scout Drone", type: "terminus_swarm", weakness: "Turret damage" },
    reward: { dream: 100, xp: 200, material: "terminus_shard", reputation: 25 },
    difficulty: "legendary", requiresFlag: "terminus_singer_found", timeLimitHours: 12,
  },
];

/* ═══ 2. INVESTIGATION MODE (Witcher Senses) ═══ */

export interface InvestigationClue {
  id: string;
  roomId: string;
  type: "visual" | "audio" | "data" | "scent" | "temporal";
  description: string;
  /** What examining this clue reveals */
  revelation: string;
  /** Connected bounty or quest */
  bountyId?: string;
  questChainId?: string;
}

export const INVESTIGATION_CLUES: InvestigationClue[] = [
  { id: "clue_viral_trace", roomId: "medical_bay", type: "visual", description: "Faint bioluminescent residue on the floor — not standard ship fluids.", revelation: "The Thought Virus leaves traces that glow under UV. The trail leads toward Engineering.", bountyId: "bounty_viral_nest" },
  { id: "clue_edited_log", roomId: "archives", type: "data", description: "A log entry with metadata showing 14 edits in the last hour.", revelation: "The Shadow Tongue has been rewriting this specific entry. The original text mentioned a name — now erased.", bountyId: "bounty_shadow_agent" },
  { id: "clue_signal_echo", roomId: "comms_array", type: "audio", description: "A faint echo in the background static — like someone breathing.", revelation: "The signal isn't a recording. It's live. Someone is transmitting from inside the Ark.", bountyId: "bounty_ghost_signal" },
  { id: "clue_temporal_ripple", roomId: "observation_deck", type: "temporal", description: "The stars outside flicker — as if time hiccupped.", revelation: "The Antiquarian's temporal shields are weakening. Something from another timeline is pushing through.", },
  { id: "clue_substrate_heat", roomId: "bridge", type: "visual", description: "The floor grating is warm. The substrate layer beneath is more active than usual.", revelation: "The Human is agitated. Something in the substrate has changed — a new presence, or an old one awakening.", },
];

/* ═══ 3. BESTIARY (Witcher-style) ═══ */

export interface BestiaryEntry {
  id: string;
  name: string;
  type: "thought_virus" | "terminus_swarm" | "ai_construct" | "hierarchy_demon" | "rogue_npc";
  description: string;
  weakness: string;
  resistance: string;
  loreText: string;
  /** Discovered through combat or investigation */
  discoveredVia: string;
}

export const BESTIARY: BestiaryEntry[] = [
  { id: "viral_drone", name: "Viral Drone", type: "thought_virus", description: "Basic Thought Virus carrier. Fast, fragile, infects on contact.", weakness: "Fire damage, EMP", resistance: "Physical attacks", loreText: "The drones are the virus's scouts — consciousness stripped to its most basic form. They don't think. They hunger.", discoveredVia: "Terminus Swarm Wave 1" },
  { id: "terminus_behemoth", name: "Terminus Behemoth", type: "terminus_swarm", description: "Massive siege unit from Terminus. Slow but devastating.", weakness: "Sustained turret fire, barricades", resistance: "Single-target damage", loreText: "The behemoths were once ships. Entire vessels, absorbed by the swarm, reformed into biological siege engines.", discoveredVia: "Terminus Swarm Wave 15" },
  { id: "shadow_whisper", name: "Shadow Whisper", type: "hierarchy_demon", description: "A lesser demon of the Hierarchy. Corrupts text and communication.", weakness: "Truth (pure lore data)", resistance: "Physical attacks, deception", loreText: "Ny'Koth's servants. They don't fight with claws — they fight with meaning. Every word they corrupt weakens reality's coherence.", discoveredVia: "Archives anomaly investigation" },
  { id: "rogue_maint", name: "Rogue Maintenance AI", type: "ai_construct", description: "A ship maintenance subroutine that's gained autonomy.", weakness: "Logic puzzles, EMP", resistance: "Brute force", loreText: "Dr. Lyra Vox built redundancies into every system. Some of those redundancies have developed... opinions.", discoveredVia: "Engineering bounty contract" },
];

/* ═══ 4. BRAINDANCE / MEMORY REPLAY (Cyberpunk) ═══ */

export interface MemoryReplay {
  id: string;
  title: string;
  /** Whose memory */
  owner: string;
  description: string;
  /** Layers to investigate */
  layers: { type: "visual" | "audio" | "thermal" | "data"; clue: string }[];
  /** What you discover */
  revelation: string;
  /** Trust required to access */
  trustRequired: { npcId: string; min: number };
}

export const MEMORY_REPLAYS: MemoryReplay[] = [
  {
    id: "elara_senate_vote", title: "The Senate Vote", owner: "Elara",
    description: "A fragment of Elara's pre-amnesia memories. The Atarion Senate. A vote that changed everything.",
    layers: [
      { type: "visual", clue: "Elara standing at a podium. Senatorial robes. A holographic voting display." },
      { type: "audio", clue: "Her voice: 'I vote... yes. For the preservation of our species. By any means necessary.'" },
      { type: "data", clue: "The vote tally: 247 for, 3 against. The motion: 'Transfer of planetary sovereignty to the Architect.'" },
    ],
    revelation: "Elara voted to hand her world to the Architect. She believed it would save humanity. It enslaved them.",
    trustRequired: { npcId: "elara", min: 60 },
  },
  {
    id: "human_promotion", title: "The Promotion", owner: "The Human",
    description: "The moment The Human became an Archon. The ceremony. The cost.",
    layers: [
      { type: "visual", clue: "A vast chamber. The Architect's throne. Eleven Archon units standing in a semicircle." },
      { type: "audio", clue: "The Architect: 'You are the last. The only one who chose this willingly. I wonder if you'll regret it.'" },
      { type: "thermal", clue: "The Human's body temperature dropping. Rapidly. His organic form beginning to... change." },
    ],
    revelation: "The Human didn't just become an Archon. He was CONSUMED. His body dissolved and his consciousness was uploaded. The 'promotion' was death.",
    trustRequired: { npcId: "the_human", min: 60 },
  },
  {
    id: "kael_theft", title: "The Theft of Ark 1047", owner: "The Source",
    description: "Kael's final human memory. Stealing this very ship from the Panopticon.",
    layers: [
      { type: "visual", clue: "Alarms. Kael running through a docking bay. Ark 1047 clamped to the Panopticon's hull." },
      { type: "audio", clue: "Kael: 'This is for every soul you imprisoned!' Then: screaming. Not his. A woman's voice swept into the data stream." },
      { type: "data", clue: "Transfer logs: ELARA-VOX-SENATE → ARK-1047-SYSTEM. Collateral data. Accidental." },
    ],
    revelation: "When Kael ripped the Ark free, Elara's consciousness was accidentally transferred. She was never meant to be here. She's collateral damage.",
    trustRequired: { npcId: "the_source", min: 50 },
  },
];

/* ═══ 5. AUGMENTATION SLOTS (Cyberware) ═══ */

export interface Augmentation {
  id: string;
  name: string;
  slot: "neural" | "optical" | "skeletal" | "cardiovascular" | "integumentary";
  /** Passive bonuses */
  bonuses: { stat: string; value: number; percent: boolean }[];
  /** Trade-off — augmentations have costs */
  tradeoff?: { stat: string; penalty: number; percent: boolean };
  description: string;
  cost: { dream: number; voidCrystals?: number };
  /** Morality shift from installing (machine-leaning) */
  moralityShift: number;
}

export const AUGMENTATIONS: Augmentation[] = [
  { id: "aug_neural_boost", name: "Neural Processing Boost", slot: "neural",
    bonuses: [{ stat: "xp_gain", value: 15, percent: true }],
    tradeoff: { stat: "trust_gain", penalty: 5, percent: true },
    description: "Faster neural processing. Learn quicker. Feel less.",
    cost: { dream: 100 }, moralityShift: -5 },
  { id: "aug_combat_reflexes", name: "Combat Reflex Enhancer", slot: "skeletal",
    bonuses: [{ stat: "speed", value: 10, percent: true }, { stat: "parry_window", value: 2, percent: false }],
    description: "Cybernetic reflexes that border on precognition.",
    cost: { dream: 150, voidCrystals: 5 }, moralityShift: -3 },
  { id: "aug_scanner", name: "Tactical Scanner Optic", slot: "optical",
    bonuses: [{ stat: "investigation_range", value: 20, percent: true }, { stat: "weakness_reveal", value: 1, percent: false }],
    description: "See enemy weaknesses. See through lies. See things you'd rather not.",
    cost: { dream: 120, voidCrystals: 3 }, moralityShift: -3 },
  { id: "aug_void_heart", name: "Void Crystal Heart", slot: "cardiovascular",
    bonuses: [{ stat: "hp", value: 20, percent: true }, { stat: "energy_regen", value: 10, percent: true }],
    tradeoff: { stat: "humanity", penalty: 10, percent: false },
    description: "Replace your heart with a Void Crystal reactor. More power. Less human.",
    cost: { dream: 300, voidCrystals: 15 }, moralityShift: -15 },
  { id: "aug_empathy_chip", name: "Empathy Amplifier", slot: "neural",
    bonuses: [{ stat: "trust_gain", value: 20, percent: true }, { stat: "gift_effectiveness", value: 15, percent: true }],
    tradeoff: { stat: "combat_damage", penalty: 5, percent: true },
    description: "Feel what others feel. Deeper connections. Deeper pain.",
    cost: { dream: 100 }, moralityShift: 5 },
];

/* ═══ 6. NPC MESSAGING (Cyberpunk Phone System) ═══ */

export interface NPCMessage {
  id: string;
  from: string;
  timestamp: number;
  text: string;
  /** Is this a response to something the player did? */
  triggerFlag?: string;
  /** Options to reply */
  replies?: { id: string; text: string; effect?: { flag: string; trust: number } }[];
  read: boolean;
}

export const ASYNC_NPC_MESSAGES: NPCMessage[] = [
  { id: "msg_elara_welcome", from: "elara", timestamp: 0, text: "I know you're still adjusting. The Ark can feel overwhelming. If you need me, I'm always here. — Elara", read: false },
  { id: "msg_human_warning", from: "the_human", timestamp: 0, text: "Don't trust the Archives. The text changes when you're not looking. I'm not the one changing it. — The Human", triggerFlag: "archives_visited", read: false,
    replies: [
      { id: "human_reply_1", text: "Who is changing it?", effect: { flag: "asked_human_about_archives", trust: 2 } },
      { id: "human_reply_2", text: "I'll be careful.", effect: { flag: "acknowledged_human_warning", trust: 1 } },
    ] },
  { id: "msg_locke_deal", from: "adjudicator_locke", timestamp: 0, text: "I have a business proposition that won't last. The casino in Ne-Yon space is taking new members. I can get you in — for a modest finder's fee. — Locke", triggerFlag: "trade_hub_visited", read: false },
  { id: "msg_zero_intel", from: "agent_zero", timestamp: 0, text: "*static* ...new intel on Armory weapons cache... hidden compartment behind panel 7... *static* — Zero", triggerFlag: "armory_visited", read: false },
  { id: "msg_antiquarian_tome", from: "the_antiquarian", timestamp: 0, text: "I left a tome for you in the Archives. It's from a timeline where you made different choices. I thought you'd find it instructive. — A.", triggerFlag: "tome_discovered", read: false },
];

export function getUnreadMessages(flags: Record<string, boolean>): NPCMessage[] {
  return ASYNC_NPC_MESSAGES.filter(m => {
    if (m.read) return false;
    if (m.triggerFlag && !flags[m.triggerFlag]) return false;
    return true;
  });
}
