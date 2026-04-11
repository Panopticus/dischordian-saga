/* ═══════════════════════════════════════════════════════
   ADVENTURE FEATURES — Sierra/LucasArts-style improvements

   Classic point-and-click adventure mechanics for the Ark Explorer:
   1. Inventory combinations (use item A + B = C)
   2. Multi-action hotspots (look, examine, interact, use item on)
   3. Environmental state changes (rooms change after events)
   4. Hidden examination layers (click 3 times for secrets)
   5. Red herring items (humor + texture)
   6. Multi-step puzzle chains (find → insert → boot → solve)
   7. NPC dialog unlocking puzzle clues

   "You can't use the monkey with the wrench." — LucasArts
   ═══════════════════════════════════════════════════════ */

/* ═══ 1. INVENTORY COMBINATIONS ═══ */

export interface InventoryCombination {
  id: string;
  /** Items required (both consumed) */
  itemA: string;
  itemB: string;
  /** Result item created */
  result: string;
  resultName: string;
  /** Elara's reaction */
  elaraComment: string;
  /** Failure text when items don't combine */
  failText?: string;
}

export const INVENTORY_COMBINATIONS: InventoryCombination[] = [
  {
    id: "decoder_complete",
    itemA: "decoder_ring", itemB: "cipher_key",
    result: "master_decoder", resultName: "Master Decoder",
    elaraComment: "A decoder ring and a cipher key. Together they can crack any standard encryption on the Ark.",
  },
  {
    id: "power_cell_charged",
    itemA: "drained_power_cell", itemB: "energy_shard",
    result: "charged_power_cell", resultName: "Charged Power Cell",
    elaraComment: "The energy shard fits perfectly. This cell could restart systems that have been dark for centuries.",
  },
  {
    id: "medical_kit_enhanced",
    itemA: "basic_medkit", itemB: "neural_stim",
    result: "enhanced_medkit", resultName: "Enhanced Medical Kit",
    elaraComment: "Adding the neural stimulant to the medkit creates something that could revive a cryo-damaged patient.",
  },
  {
    id: "signal_booster",
    itemA: "antenna_fragment", itemB: "amplifier_circuit",
    result: "signal_booster", resultName: "Signal Booster",
    elaraComment: "This could amplify Agent Zero's signal. Or The Human's. Be careful whose voice you make louder.",
  },
  {
    id: "viral_antidote",
    itemA: "thought_virus_sample", itemB: "antibody_culture",
    result: "viral_antidote", resultName: "Viral Antidote",
    elaraComment: "An antidote to the Thought Virus. Kael would call this cruelty. I call it medicine.",
  },
  {
    id: "temporal_lens",
    itemA: "antiquarian_shard", itemB: "void_crystal",
    result: "temporal_lens", resultName: "Temporal Viewing Lens",
    elaraComment: "A lens that lets you see... other timelines? The Antiquarian would be very interested in this.",
  },
];

export function tryCombineItems(itemA: string, itemB: string): InventoryCombination | null {
  return INVENTORY_COMBINATIONS.find(c =>
    (c.itemA === itemA && c.itemB === itemB) ||
    (c.itemA === itemB && c.itemB === itemA)
  ) || null;
}

/* ═══ 2. MULTI-ACTION HOTSPOTS ═══ */

export type HotspotAction = "look" | "examine" | "interact" | "use_item";

export interface AdventureHotspot {
  id: string;
  roomId: string;
  name: string;
  /** Different text for each action level */
  actions: {
    look: string;         // First click — surface description
    examine: string;      // Second click — deeper detail
    interact?: string;    // Third click — do something
    useItem?: { itemId: string; result: string; rewardItem?: string; flag?: string }; // Use specific item on it
  };
  /** After how many examinations does a secret reveal? */
  secretOnExamine?: number;
  /** Hidden item found on examine */
  hiddenItem?: string;
  /** Requires a flag to be visible */
  requiresFlag?: string;
}

export const ADVENTURE_HOTSPOTS: AdventureHotspot[] = [
  // Cryo Bay
  {
    id: "cryo_control_panel", roomId: "cryo_bay", name: "Control Panel",
    actions: {
      look: "A dusty control panel with flickering readouts. Standard cryo management interface.",
      examine: "Wait — there's a secondary display behind the main one. It shows a different set of pod IDs. Pods that aren't in the main bay.",
      interact: "The secondary display reveals Pod 0 — a designation that shouldn't exist. It's been active for 247 years.",
    },
    secretOnExamine: 2,
  },
  {
    id: "cryo_locker", roomId: "cryo_bay", name: "Personal Locker",
    actions: {
      look: "A row of personal lockers. Most are sealed, but one is slightly ajar.",
      examine: "Inside the ajar locker: a faded photograph, a decoder ring, and a note in handwriting you don't recognize.",
      interact: "You take the decoder ring. The note reads: 'For Kael — when you remember who you were. —L.V.'",
    },
    hiddenItem: "decoder_ring",
  },
  // Medical Bay
  {
    id: "medical_safe", roomId: "medical_bay", name: "Emergency Safe",
    actions: {
      look: "A reinforced safe mounted in the wall. Dr. Lyra Vox's nameplate is engraved on it.",
      examine: "The lock mechanism uses biometric + code authentication. The biometric scanner looks damaged.",
      interact: "The damaged scanner accepts any input. Inside: an Observation Deck keycard and a sealed vial labeled 'Vector-1.'",
      useItem: { itemId: "charged_power_cell", result: "The power cell activates a hidden compartment behind the safe. Inside: Dr. Vox's personal log.", flag: "vox_log_found" },
    },
    hiddenItem: "observation_keycard",
  },
  // Bridge
  {
    id: "captain_chair", roomId: "bridge", name: "Captain's Chair",
    actions: {
      look: "The command chair. Empty for 247 years. Dust outlines suggest someone sat here recently.",
      examine: "Under the armrest: a hidden compartment. The latch is shaped like the Ark designation — 1047.",
      interact: "The compartment opens. Inside: the Captain's Master Key and a sealed holographic message.",
      useItem: { itemId: "temporal_lens", result: "Through the lens, you see the chair occupied — not by a captain, but by Kael. He's bleeding. He's laughing. He's stealing this ship.", flag: "kael_theft_witnessed" },
    },
    hiddenItem: "captains_master_key",
  },
  // Archives
  {
    id: "archives_terminal", roomId: "archives", name: "Research Terminal",
    actions: {
      look: "A research terminal with centuries of accumulated data. The screen flickers between two different interfaces.",
      examine: "One interface is Elara's. The other... isn't. Someone else has been using this terminal. The timestamps overlap — both users were active simultaneously.",
      interact: "You pull up the access logs. User 1: ELARA-SYS. User 2: [REDACTED]. The redacted user's edits changed 14,000 words across 200 documents.",
    },
    secretOnExamine: 2,
  },
  // Comms Array
  {
    id: "signal_receiver", roomId: "comms_array", name: "Long-Range Receiver",
    actions: {
      look: "A massive signal receiver dish, currently pointed at a fixed location in space.",
      examine: "The receiver is locked onto coordinates that don't match any known star system. Whatever it's listening to... it's been listening for a very long time.",
      interact: "You adjust the frequency. Static. Then — music. A woman's voice. Singing something old, something beautiful, something that makes the ship's lights flicker.",
      useItem: { itemId: "signal_booster", result: "The signal amplifies. The singing becomes clear — it's the same melody The Source described in his last memory. The woman is real. She's broadcasting from Terminus.", flag: "terminus_singer_found" },
    },
  },
];

/* ═══ 3. ENVIRONMENTAL STATE CHANGES ═══ */

export interface RoomStateChange {
  roomId: string;
  /** Flag that triggers this visual change */
  triggerFlag: string;
  /** What changed in the room */
  description: string;
  /** New hotspot that appears */
  newHotspot?: string;
  /** Hotspot that disappears */
  removedHotspot?: string;
  /** Overlay effect */
  visualEffect?: "quarantine_red" | "glitch_corruption" | "golden_glow" | "vine_growth" | "ice_crystal";
}

export const ROOM_STATE_CHANGES: RoomStateChange[] = [
  { roomId: "medical_bay", triggerFlag: "quarantine_encountered", description: "Faint red biosafety lights pulse in the corners. Residual contamination markers on the floor.", visualEffect: "quarantine_red" },
  { roomId: "archives", triggerFlag: "shadow_tongue_evidence", description: "Text on the screens flickers and rewrites itself. Some words are in languages that don't exist.", visualEffect: "glitch_corruption" },
  { roomId: "bridge", triggerFlag: "kael_theft_witnessed", description: "The captain's chair has scorch marks that weren't visible before. Kael's blood stain glows faintly under UV.", newHotspot: "kael_bloodstain" },
  { roomId: "observation_deck", triggerFlag: "terminus_singer_found", description: "The viewport now shows a faint light from Terminus. Someone — or something — is signaling back.", newHotspot: "terminus_signal_light" },
  { roomId: "engineering", triggerFlag: "vox_log_found", description: "Dr. Vox's holographic portrait has activated on the wall. Her eyes follow you.", newHotspot: "vox_hologram" },
  { roomId: "comms_array", triggerFlag: "human_contact_made", description: "The substrate layer pulses visibly through the floor grating. Red light from below.", visualEffect: "quarantine_red" },
  { roomId: "cryo_bay", triggerFlag: "pod_0_discovered", description: "Pod 0 now has a visible readout. The occupant's vitals are... impossible. They've been alive for 247 years without cryo.", newHotspot: "pod_0_readout" },
];

export function getRoomStateChanges(roomId: string, flags: Record<string, boolean>): RoomStateChange[] {
  return ROOM_STATE_CHANGES.filter(c => c.roomId === roomId && flags[c.triggerFlag]);
}

/* ═══ 4. RED HERRING ITEMS (Humor + Texture) ═══ */

export interface RedHerring {
  id: string;
  name: string;
  roomId: string;
  description: string;
  /** What Elara says when you try to use it */
  elaraReaction: string;
  /** What The Human says (if contact made) */
  humanReaction?: string;
}

export const RED_HERRINGS: RedHerring[] = [
  { id: "rubber_chicken", name: "Rubber Chicken", roomId: "cargo_bay",
    description: "A rubber chicken with a pulley in the middle. Why is this on a spaceship?",
    elaraReaction: "I have no tactical assessment for a rubber chicken. I've failed you as an AI.",
    humanReaction: "The Architect once tried to simulate humor. It looked exactly like this." },
  { id: "old_coffee", name: "247-Year-Old Coffee", roomId: "bridge",
    description: "A mug of coffee left on the command console. It has developed sentience.",
    elaraReaction: "Please do not drink the ancient coffee. Its chemical composition now resembles a biological weapon.",
    humanReaction: "That coffee has been there since before I was imprisoned. It's technically my colleague." },
  { id: "instruction_manual", name: "Ark Instruction Manual", roomId: "engineering",
    description: "A thick manual titled 'Inception Ark 1047 — Quick Start Guide.' Page 1: 'Step 1: Don't let it get stolen.'",
    elaraReaction: "Helpful. Perhaps we should have read this 247 years ago.",
    humanReaction: "Kael definitely didn't read the manual." },
  { id: "motivational_poster", name: "Motivational Poster", roomId: "armory",
    description: "A poster showing a sunset with text: 'HANG IN THERE!' Signed by Iron Lion.",
    elaraReaction: "Iron Lion was known for his... unconventional morale techniques.",
    humanReaction: "He put those in every military installation. Even the ones that were about to be destroyed." },
  { id: "cat_photo", name: "Photo of a Cat", roomId: "captains_quarters",
    description: "A framed photo of a cat wearing tiny goggles. Label reads: 'Mr. Whiskers — Chief Science Officer.'",
    elaraReaction: "The previous crew had... unorthodox staffing decisions.",
    humanReaction: "Mr. Whiskers was the only crew member Kael liked. He took the cat with him. I miss that cat." },
];

/* ═══ 5. MULTI-STEP PUZZLE CHAINS ═══ */

export interface PuzzleChain {
  id: string;
  name: string;
  steps: PuzzleChainStep[];
  /** Final reward for completing the chain */
  reward: { item?: string; flag?: string; trust?: { npcId: string; amount: number } };
}

export interface PuzzleChainStep {
  step: number;
  description: string;
  roomId: string;
  type: "find_item" | "use_item" | "solve_puzzle" | "talk_to_npc" | "examine_hotspot";
  targetId: string;
  completionFlag: string;
}

export const PUZZLE_CHAINS: PuzzleChain[] = [
  {
    id: "dr_vox_mystery",
    name: "The Dr. Vox Mystery",
    steps: [
      { step: 1, description: "Find the decoder ring in the Cryo Bay locker", roomId: "cryo_bay", type: "find_item", targetId: "decoder_ring", completionFlag: "vox_step_1" },
      { step: 2, description: "Examine the emergency safe in Medical Bay", roomId: "medical_bay", type: "examine_hotspot", targetId: "medical_safe", completionFlag: "vox_step_2" },
      { step: 3, description: "Use the charged power cell on the safe's hidden compartment", roomId: "medical_bay", type: "use_item", targetId: "charged_power_cell", completionFlag: "vox_step_3" },
      { step: 4, description: "Read Dr. Vox's personal log in the Archives terminal", roomId: "archives", type: "examine_hotspot", targetId: "archives_terminal", completionFlag: "vox_step_4" },
      { step: 5, description: "Ask The Source about Dr. Vox", roomId: "medical_bay", type: "talk_to_npc", targetId: "the_source", completionFlag: "vox_step_5" },
    ],
    reward: { item: "vox_research_notes", flag: "vox_mystery_solved", trust: { npcId: "the_source", amount: 10 } },
  },
  {
    id: "terminus_signal",
    name: "The Terminus Signal",
    steps: [
      { step: 1, description: "Find the antenna fragment in Engineering", roomId: "engineering", type: "find_item", targetId: "antenna_fragment", completionFlag: "terminus_step_1" },
      { step: 2, description: "Find the amplifier circuit in the Armory", roomId: "armory", type: "find_item", targetId: "amplifier_circuit", completionFlag: "terminus_step_2" },
      { step: 3, description: "Combine items to create Signal Booster", roomId: "engineering", type: "use_item", targetId: "signal_booster", completionFlag: "terminus_step_3" },
      { step: 4, description: "Use the Signal Booster on the Comms Array receiver", roomId: "comms_array", type: "use_item", targetId: "signal_booster", completionFlag: "terminus_step_4" },
      { step: 5, description: "Tell The Antiquarian what you heard", roomId: "archives", type: "talk_to_npc", targetId: "the_antiquarian", completionFlag: "terminus_step_5" },
    ],
    reward: { flag: "terminus_singer_found", trust: { npcId: "the_antiquarian", amount: 10 } },
  },
  {
    id: "pod_zero",
    name: "Pod Zero",
    steps: [
      { step: 1, description: "Discover Pod 0 on the Cryo Bay control panel", roomId: "cryo_bay", type: "examine_hotspot", targetId: "cryo_control_panel", completionFlag: "pod0_step_1" },
      { step: 2, description: "Ask Elara about Pod 0 (she doesn't know)", roomId: "bridge", type: "talk_to_npc", targetId: "elara", completionFlag: "pod0_step_2" },
      { step: 3, description: "Ask The Human about Pod 0 (he does know)", roomId: "comms_array", type: "talk_to_npc", targetId: "the_human", completionFlag: "pod0_step_3" },
      { step: 4, description: "Use the enhanced medkit on Pod 0", roomId: "cryo_bay", type: "use_item", targetId: "enhanced_medkit", completionFlag: "pod0_step_4" },
    ],
    reward: { flag: "pod_0_opened", trust: { npcId: "the_human", amount: 15 } },
  },
];

export function getActivePuzzleChains(flags: Record<string, boolean>): { chain: PuzzleChain; currentStep: number }[] {
  return PUZZLE_CHAINS.map(chain => {
    let currentStep = 0;
    for (const step of chain.steps) {
      if (flags[step.completionFlag]) currentStep = step.step;
      else break;
    }
    return { chain, currentStep };
  }).filter(({ currentStep, chain }) => currentStep < chain.steps.length);
}
