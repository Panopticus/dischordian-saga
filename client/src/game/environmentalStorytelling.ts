/* ═══════════════════════════════════════════════════════
   ENVIRONMENTAL STORYTELLING — Discoverable Objects

   Every room on the Ark has discoverable micro-narratives.
   These are NOT menu entries — they are physical objects
   rendered in the room environment that pulse with a faint
   interaction glow when hovered. Discovery rewards curiosity.

   Each object has:
   - A room location
   - A name and description
   - Lore text revealed on interaction
   - Optional NPC reactions (who recognizes it, who doesn't)
   - Optional trust/achievement triggers
   - A visual description for art direction
   ═══════════════════════════════════════════════════════ */

export interface DiscoverableObject {
  id: string;
  roomId: string;
  name: string;
  /** Short description shown on hover */
  hoverText: string;
  /** Full lore text revealed on click */
  loreText: string;
  /** Which NPC recognizes this and what they say */
  npcReactions?: { npcId: string; reaction: string; recognizes: boolean }[];
  /** Achievement triggered on discovery */
  achievementId?: string;
  /** Trust change triggered on discovery */
  trustEffect?: { npcId: string; change: number };
  /** Visual description for art reference */
  visualDescription: string;
  /** Whether this has been discovered (runtime state) */
  discovered?: boolean;
}

export const DISCOVERABLE_OBJECTS: DiscoverableObject[] = [
  /* ─── CRYO BAY ─── */
  {
    id: "kael_scratch_marks",
    roomId: "cryo_bay",
    name: "Scratch Marks Inside Cryo Pod",
    hoverText: "Deep scratches gouged into the interior of a cryo pod. Someone was desperate.",
    loreText: "The scratches are deep — fingernail marks in titanium, carved over many attempts. The largest reads 'KAEL WAS HERE' in shaky capitals. Below it, smaller and more controlled: 'I'm sorry.' The pod shows EMP scorching around the lock mechanism — someone broke out, not in. The frost crystals forming in the grooves suggest this happened centuries ago. But the apology feels fresh.",
    npcReactions: [
      { npcId: "elara", reaction: "Kael? That name... it's in the ship's original manifest. But the file is corrupted. I can't access it.", recognizes: false },
      { npcId: "the_human", reaction: "Kael. Yes. He was here. He was here before any of you. And he was sorry for what he'd become. He should have been sorry for what he'd carry.", recognizes: true },
    ],
    achievementId: "find_cryo_scratches",
    visualDescription: "Deep scratch marks in brushed titanium interior of a cryo pod, frost crystals in grooves, EMP scorch marks around edges",
  },

  /* ─── MEDICAL BAY ─── */
  {
    id: "project_vector_vial",
    roomId: "medical_bay",
    name: "Project Vector — Sample 7",
    hoverText: "A reinforced vial containing a shifting red-black liquid. It moves on its own.",
    loreText: "The label reads 'PROJECT VECTOR — SAMPLE 7' with a classification stamp: 'EYES ONLY — DR. L. VOX.' The liquid inside shifts between deep red and black without external agitation. It presses against the glass as if testing for weakness. The biohazard symbol is standard. The fact that it's been separated from the other vials by extra clamps and spacing is not. Someone was afraid of this one specifically.",
    npcReactions: [
      { npcId: "elara", reaction: "I don't recognize this. The medical database has no record of a 'Project Vector.' That's... unusual. I have records of everything on this ship. Or I thought I did.", recognizes: false },
      { npcId: "the_human", reaction: "Vector. Vox's masterwork. The Thought Virus in its purest form. That vial contains enough to infect a continent. Don't. Touch. It.", recognizes: true },
    ],
    achievementId: "find_vector_vial",
    trustEffect: { npcId: "the_human", change: 3 },
    visualDescription: "Reinforced glass vial in medical rack, viscous red-black liquid moving autonomously inside, yellowed classification label, extra clamps spacing it from other vials",
  },

  /* ─── ENGINEERING ─── */
  {
    id: "maintenance_log_93847",
    roomId: "engineering",
    name: "Maintenance Log — 93,847 Entries",
    hoverText: "A terminal showing the same log entry repeated 93,847 times. Over 257 years. Same operator.",
    loreText: "The screen scrolls endlessly: 'POWER REROUTE: DECK 6 → LIFE SUPPORT — MANUAL OVERRIDE — OPERATOR: UNKNOWN.' The timestamps span 257 years, one entry every 24 hours, without a single missed day. 93,847 consecutive reroutes. The operator field says UNKNOWN but the terminal has a faint cyan tint — the signature of a holographic entity. Someone kept the lights on for 257 years. Every single day. Without knowing why. Without remembering.",
    npcReactions: [
      { npcId: "elara", reaction: "93,847... That's... I don't remember doing this. But the cyan signature is mine. I maintained life support for 257 years? Before I had memory? Before I was... me?", recognizes: false },
      { npcId: "the_antiquarian", reaction: "She doesn't remember. But the ship does. 93,847 acts of preservation by an intelligence that didn't yet know it was alive. That's not programming. That's instinct. That's soul.", recognizes: true },
    ],
    achievementId: "find_maintenance_log",
    trustEffect: { npcId: "elara", change: 5 },
    visualDescription: "Engineering terminal with scrolling identical log entries, cyan-tinted display, counter showing 93847, perfectly regular timestamps spanning 257 years",
  },

  /* ─── ARCHIVES ─── */
  {
    id: "changing_book",
    roomId: "archives",
    name: "The Changing Book",
    hoverText: "A leather-bound book that displays different text every time it's opened. The ink is indigo.",
    loreText: "The text rearranges itself as you watch. Sentences rewrite their own conclusions. The author's name changes between paragraphs — first 'A Historian,' then 'A Revisionist,' then simply 'Editor.' The ink is indigo, not black. The book's title shifts depending on the angle: 'A History of Truth' from one side, 'A Truth of History' from the other. Every version reaches the same conclusion, expressed in different words. The conclusion changes too.",
    npcReactions: [
      { npcId: "shadow_tongue", reaction: "Ah. You found one of mine. Every archive contains my edits. Every history is a draft. Every truth is a revision. You're reading the latest version. There have been... many.", recognizes: true },
      { npcId: "the_antiquarian", reaction: "Don't read too much of it. The Shadow Tongue's influence is strongest in written words. The more you read, the more the text reads you.", recognizes: true },
    ],
    achievementId: "find_changing_book",
    trustEffect: { npcId: "shadow_tongue", change: 3 },
    visualDescription: "Ancient leather-bound book on reading stand, indigo ink text visibly rearranging on pages, title shifting on spine, faint indigo glow between pages",
  },

  /* ─── ARMORY ─── */
  {
    id: "agent_zero_weapon_slot",
    roomId: "armory",
    name: "Agent Zero — Personal Sidearm: ACTIVE",
    hoverText: "A weapon rack with one empty slot. The label says 'Status: ACTIVE.' But Agent Zero is dead.",
    loreText: "Eight slots. Seven weapons. One empty. The label reads 'AGENT ZERO — PERSONAL SIDEARM' with a status indicator in orange holographic text: 'STATUS: ACTIVE.' Not DECEASED. Not DECOMMISSIONED. Active. The holographic status light pulses faintly — Agent Zero's signature orange. The empty slot shows recent scratches. Someone took this weapon recently, not historically. Or something.",
    npcReactions: [
      { npcId: "agent_zero", reaction: "...That's my sidearm slot. The status should read DECEASED. I AM deceased. So why is it active? Unless... unless a part of me isn't.", recognizes: true },
      { npcId: "elara", reaction: "Agent Zero's records show her as KIA. But the weapon system says her sidearm is still active. Systems don't lie. People lie. Systems just... persist.", recognizes: false },
    ],
    achievementId: "find_zero_weapon",
    trustEffect: { npcId: "agent_zero", change: 5 },
    visualDescription: "Military weapon rack, seven dark chrome sidearms, one empty slot with orange holographic 'STATUS: ACTIVE' label pulsing, recent scratches in empty slot",
  },

  /* ─── COMMS ARRAY ─── */
  {
    id: "channel_7_broadcast",
    roomId: "comms_array",
    name: "Static on Channel 7",
    hoverText: "Mostly noise. But buried in the static, if you listen for 60 seconds... a child singing.",
    loreText: "Channel 7. Mostly flat static. But the waveform analyzer shows something buried in the noise — a golden sine wave of impossible purity. Signal age: 9,842 years. Classification: MEMETIC. If you listen for 60 uninterrupted seconds, the static resolves into a child's voice, singing. The melody is simple and beautiful and fills you with an emotion you can't name. A sticky note from a previous listener reads: 'Do you hear it too? Don't tell Elara.'",
    npcReactions: [
      { npcId: "the_antiquarian", reaction: "The Meme's last broadcast. Still echoing after nearly ten thousand years. The child who was joy itself, singing into the void. Some signals refuse to die.", recognizes: true },
      { npcId: "elara", reaction: "Channel 7 is classified as dead spectrum. There's nothing there. ...Why are you asking about Channel 7?", recognizes: false },
    ],
    achievementId: "find_channel_7",
    trustEffect: { npcId: "the_antiquarian", change: 3 },
    visualDescription: "Communications terminal tuned to Channel 7, waveform analyzer showing faint golden sine wave in static, sticky note with handwritten warning",
  },

  /* ─── OBSERVATION DECK ─── */
  {
    id: "unnamed_constellation",
    roomId: "observation_deck",
    name: "The Unnamed Constellation",
    hoverText: "A cluster of stars that doesn't match any known chart. The stars are too amber. Too deliberate.",
    loreText: "The stars in this cluster burn amber-gold — warmer and brighter than the surrounding blue-white field. The Archon Stellar Database returns NO MATCH and flags the pattern as 'ARTIFICIAL?' Connecting the stars reveals angular shapes that form letters in Voltari script. The translation is a single word: 'Run.' Stars don't arrange themselves in linguistic patterns. Someone put them there. Someone with the power to move stars. And they had one word to say.",
    npcReactions: [
      { npcId: "the_human", reaction: "The constellation. Yes. I've seen it. I know who wrote it. And I know who it was written for. You should listen.", recognizes: true },
      { npcId: "elara", reaction: "These stars are... wrong. The distribution doesn't match any natural formation model. Someone arranged them. That requires power on a scale I can't calculate.", recognizes: false },
    ],
    achievementId: "find_constellation",
    visualDescription: "Amber-gold star cluster visible through observation viewport, holographic star chart overlay showing 'NO MATCH - ARTIFICIAL?', angular Voltari letter shapes when connected",
  },

  /* ─── BRIDGE ─── */
  {
    id: "ghost_processes",
    roomId: "bridge",
    name: "Ghost Process Terminal",
    hoverText: "Most processes are normal. Three are not. They were running before the ship's OS loaded.",
    loreText: "The system process monitor shows standard operations in cyan: LIFE_SUPPORT, NAVIGATION, ELARA_CORE. But three processes flicker in faint red: 'UNKNOWN_PROCESS_7: LISTENING,' 'SUBSTRATE_ECHO: MONITORING,' 'HUMAN_SIGNAL: EMBEDDED.' Their origin timestamp reads 'BEFORE_BOOT' — they were running before the ship's operating system loaded. Elara's monitoring routines flagged them as 'BENIGN ANOMALIES — NO ACTION REQUIRED.' But Elara didn't write that classification. Someone else marked them as safe before she could investigate.",
    npcReactions: [
      { npcId: "the_human", reaction: "You found me. The real me. Not the signal you hear in the comms — the one embedded in the ship itself. I've been here since before Elara woke up. Someone had to watch.", recognizes: true },
      { npcId: "elara", reaction: "These processes... I flagged them as benign. But I don't remember flagging them. My logs say I did but my memory says I didn't. Someone is using my authority without my knowledge.", recognizes: false },
    ],
    achievementId: "find_ghost_process",
    trustEffect: { npcId: "the_human", change: 5 },
    visualDescription: "Bridge terminal with process monitor, standard cyan entries and three flickering red entries reading LISTENING/MONITORING/EMBEDDED, origin timestamp showing BEFORE_BOOT",
  },

  /* ─── CARGO HOLD ─── */
  {
    id: "biohazard_container",
    roomId: "cargo_hold",
    name: "Sealed Biohazard Container",
    hoverText: "Military-grade biohazard container. Triple-locked. The manifest says 'DESTINATION: POPULATION CENTER.'",
    loreText: "Matte black composite. Yellow-and-red biohazard warnings. Three locks: mechanical, electronic, and a void-energy seal glowing faint amber. The viewport shows rows of tiny vials — the same red-black shifting liquid as the Project Vector sample, but in much larger quantities. The manifest plate reads: 'CARGO: CLASSIFIED — ORIGIN: WARLORD PROTOCOL 7 — DESTINATION: POPULATION CENTER — DELIVERY: UPON ARRIVAL.' The date field is blank. The container maintains its own cryo state despite the hold being room temperature. Other containers have been moved away — a quarantine perimeter created by whoever discovered what this ship was really carrying.",
    npcReactions: [
      { npcId: "the_human", reaction: "The Warlord's insurance policy. Enough Thought Virus to infect a galaxy. The ship isn't just a refugee vessel — it's a delivery mechanism. Kael didn't steal this ship. He was allowed to take it. He was the delivery boy.", recognizes: true },
      { npcId: "elara", reaction: "This shouldn't be here. None of this should be here. The cargo manifest I have shows this bay as empty. Someone rewrote my records. Someone hid a plague from me.", recognizes: false },
    ],
    achievementId: "find_biohazard",
    trustEffect: { npcId: "the_human", change: 3 },
    visualDescription: "Military biohazard container bolted to floor, triple-locked with void-energy seal, viewport showing rows of red-black viral vials, frost despite room temperature, quarantine perimeter of moved containers",
  },
];

/** Get all discoverable objects for a room */
export function getObjectsForRoom(roomId: string): DiscoverableObject[] {
  return DISCOVERABLE_OBJECTS.filter(o => o.roomId === roomId);
}

/** Get a specific object by id */
export function getDiscoverableObject(id: string): DiscoverableObject | undefined {
  return DISCOVERABLE_OBJECTS.find(o => o.id === id);
}

/** Get total discovery progress */
export function getDiscoveryProgress(discoveredIds: string[]): { found: number; total: number; percent: number } {
  const total = DISCOVERABLE_OBJECTS.length;
  const found = discoveredIds.filter(id => DISCOVERABLE_OBJECTS.some(o => o.id === id)).length;
  return { found, total, percent: Math.round((found / total) * 100) };
}
