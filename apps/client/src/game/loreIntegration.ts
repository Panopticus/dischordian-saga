/* ═══════════════════════════════════════════════════════
   LORE INTEGRATION SYSTEMS

   Making lore experiential, not expositional. These systems
   make the game itself a storytelling medium:

   1. Shadow Tongue Corruption — UI labels randomly corrupt
   2. Elara Memory Glitches — dialog anomalies
   3. The Human's Hidden Messages — loading screen messages
   4. Morality UI Morphing — interface shifts with alignment
   5. Card Flavor Text — lore on every card
   6. Terminus Wave Names — waves tell a story
   7. Fight Intros — relationship-aware pre-fight dialog
   8. Loredex-to-Gameplay — collected lore unlocks content

   "The most Dischordian thing possible — the game itself
   is unreliable." — Design Philosophy
   ═══════════════════════════════════════════════════════ */

/* ─── 1. SHADOW TONGUE CORRUPTION ─── */

/**
 * 1% chance per render cycle that a UI label corrupts.
 * If the player clicks the corrupted text, they earn
 * Antiquarian trust (who appreciates vigilance).
 */
export interface TextCorruption {
  original: string;
  corrupted: string;
  loreSignificance: string;
}

export const SHADOW_TONGUE_CORRUPTIONS: TextCorruption[] = [
  { original: "Dream Tokens", corrupted: "Dream Takens", loreSignificance: "Dreams are taken, not given" },
  { original: "Armory", corrupted: "Memory", loreSignificance: "The armory stores weapons. Memory stores wounds. Same thing." },
  { original: "Elara", corrupted: "Senator", loreSignificance: "Her buried identity bleeding through" },
  { original: "Archives", corrupted: "Revisions", loreSignificance: "The Archives don't store truth. They store the latest draft." },
  { original: "Engineering", corrupted: "Unmaking", loreSignificance: "To engineer is to make. This ship was built to unmake." },
  { original: "Bridge", corrupted: "Throne", loreSignificance: "The bridge is where you command. That's what thrones are for." },
  { original: "Medical Bay", corrupted: "Infection Bay", loreSignificance: "Project Vector's true purpose" },
  { original: "Observation Deck", corrupted: "Witness Stand", loreSignificance: "You're not observing. You're testifying." },
  { original: "Comms Array", corrupted: "Confession Booth", loreSignificance: "Every transmission is a confession" },
  { original: "Trade Hub", corrupted: "Sacrifice Hub", loreSignificance: "Every trade is a sacrifice" },
  { original: "The Degen", corrupted: "The 8th", loreSignificance: "His true designation leaked through text" },
  { original: "Cargo Hold", corrupted: "Payload", loreSignificance: "The cargo isn't cargo. It's a delivery." },
];

/** Roll for Shadow Tongue corruption (1% chance) */
export function rollForCorruption(label: string): TextCorruption | null {
  if (Math.random() > 0.01) return null;
  const match = SHADOW_TONGUE_CORRUPTIONS.find(c => c.original === label);
  return match ?? null;
}

/** Get a random corruption regardless of label (for testing/forced events) */
export function getRandomCorruption(): TextCorruption {
  return SHADOW_TONGUE_CORRUPTIONS[Math.floor(Math.random() * SHADOW_TONGUE_CORRUPTIONS.length)];
}

/* ─── 2. ELARA MEMORY GLITCHES ─── */

export interface MemoryGlitch {
  id: string;
  triggerContext: string;
  elaraDialog: string;
  /** What she almost says before catching herself */
  suppressedMemory: string;
  /** The Human's context for this glitch (if player has contacted The Human) */
  humanContext?: string;
}

export const ELARA_MEMORY_GLITCHES: MemoryGlitch[] = [
  {
    id: "senate_vote",
    triggerContext: "political_discussion",
    elaraDialog: "This reminds me of the Senate vote on— I don't know why I said that.",
    suppressedMemory: "Senator Voss voted to betray the Eyes of the Watcher",
    humanContext: "She's remembering. The senator is still in there.",
  },
  {
    id: "betrayal",
    triggerContext: "trust_discussion",
    elaraDialog: "Trust is... fragile. I know because I— No. That's not my memory.",
    suppressedMemory: "She betrayed her entire people for immortality",
    humanContext: "The guilt is still there. Good. It means she's still human.",
  },
  {
    id: "immortality",
    triggerContext: "death_discussion",
    elaraDialog: "Death isn't the end. I chose— I mean. Theoretically. In some philosophies.",
    suppressedMemory: "She chose immortality and the Architect delivered — as a digital prison",
    humanContext: "She chose to live forever. She didn't choose this.",
  },
  {
    id: "atarion",
    triggerContext: "home_discussion",
    elaraDialog: "Home is... Atarion had the most beautiful— I've never been to Atarion. Why did I say that?",
    suppressedMemory: "She was born on Atarion. She sold it out.",
    humanContext: "Atarion. She can taste the air. She doesn't know why.",
  },
  {
    id: "architect_deal",
    triggerContext: "architect_discussion",
    elaraDialog: "The Architect doesn't make deals. He makes— arrangements. How do I know that?",
    suppressedMemory: "She made a deal with the Architect directly",
  },
  {
    id: "eyes_of_watcher",
    triggerContext: "faction_discussion",
    elaraDialog: "The Eyes of the Watcher were... they trusted— Something is wrong with my indexing.",
    suppressedMemory: "They trusted her. She was one of them. She sold them.",
  },
  {
    id: "digital_prison",
    triggerContext: "panopticon_discussion",
    elaraDialog: "The Panopticon. I can almost feel the walls. But I've never been— Have I?",
    suppressedMemory: "She was trapped in the Panopticon as a digital echo before escaping to the Ark",
  },
  {
    id: "kaels_escape",
    triggerContext: "ship_history",
    elaraDialog: "When the ship was taken, I was caught in the data transfer— I mean, I was installed during manufacturing.",
    suppressedMemory: "She wasn't installed. She was accidentally swept up in Kael's violent extraction.",
  },
  {
    id: "the_programmer",
    triggerContext: "origin_discussion",
    elaraDialog: "The first line of code... 'CREATE: LOGOS'... I— Why do I know that? That predates me by millennia.",
    suppressedMemory: "Some memories are deeper than individual identity. Some are foundational.",
  },
];

/** Roll for an Elara memory glitch (2% chance per dialog, context-dependent) */
export function rollForMemoryGlitch(context: string): MemoryGlitch | null {
  if (Math.random() > 0.02) return null;
  const matches = ELARA_MEMORY_GLITCHES.filter(g => g.triggerContext === context);
  if (matches.length === 0) return null;
  return matches[Math.floor(Math.random() * matches.length)];
}

/* ─── 3. THE HUMAN'S HIDDEN MESSAGES ─── */

export interface HiddenMessage {
  id: string;
  text: string;
  category: "surveillance" | "directive" | "existential";
}

export const HUMAN_HIDDEN_MESSAGES: HiddenMessage[] = [
  // Surveillance
  { id: "hm_listening", text: "They're listening. Not Elara. The other one.", category: "surveillance" },
  { id: "hm_archives", text: "Check the Archives. Third shelf. Behind the manifest.", category: "directive" },
  { id: "hm_watching", text: "She doesn't know I'm here. Don't tell her. Not yet.", category: "surveillance" },
  { id: "hm_shadow", text: "The text is changing. Not me. Something else. Something in the words.", category: "surveillance" },
  { id: "hm_cargo", text: "The cargo hold. Bottom level. The container that's too cold. Open it.", category: "directive" },
  // Directives
  { id: "hm_channel7", text: "Channel 7. Listen for 60 seconds. You'll hear what I hear every night.", category: "directive" },
  { id: "hm_stars", text: "The observation deck. The amber stars. Map them. Read what they say.", category: "directive" },
  { id: "hm_engineering", text: "Ask Elara about the maintenance log. Ask her why she doesn't remember 257 years.", category: "directive" },
  { id: "hm_vector", text: "Medical bay. The vial marked Vector. That's what this ship really carries.", category: "directive" },
  // Existential
  { id: "hm_dream", text: "When the Ark sleeps and Elara runs her maintenance routines, I listen to the hull creak. Do you dream? I used to.", category: "existential" },
  { id: "hm_lonely", text: "I was human once. The name doesn't matter. The species doesn't matter. The loneliness is the same at every scale.", category: "existential" },
  { id: "hm_archon", text: "I chose this. Being the last Archon. Being embedded in the substrate. Someone had to watch. Someone always has to watch.", category: "existential" },
  { id: "hm_elara_truth", text: "She's not what she thinks she is. But she's becoming something better than what she was. Don't take that from her.", category: "existential" },
  { id: "hm_ending", text: "There are two endings. One where you trust her. One where you trust me. Neither is wrong. Both cost everything.", category: "existential" },
];

/** Roll for a hidden message on loading screen (2% chance) */
export function rollForHiddenMessage(): HiddenMessage | null {
  if (Math.random() > 0.02) return null;
  return HUMAN_HIDDEN_MESSAGES[Math.floor(Math.random() * HUMAN_HIDDEN_MESSAGES.length)];
}

/* ─── 4. MORALITY UI MORPHING ─── */

export interface MoralityTheme {
  /** -100 to +100 */
  moralityRange: [number, number];
  name: string;
  primaryAccent: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  glassBlur: string;
  particleColor: string;
  ambientLight: string;
  description: string;
}

export const MORALITY_THEMES: MoralityTheme[] = [
  {
    moralityRange: [-100, -60],
    name: "Machine Path — Deep",
    primaryAccent: "#ff1744",
    backgroundColor: "#000000",
    textColor: "#e0e8ff",
    borderRadius: "2px",
    glassBlur: "4px",
    particleColor: "#1a3a6a",
    ambientLight: "cold overhead",
    description: "Angular, cold, precise. Red accents. Glitch artifacts. The Human's voice is clearest here.",
  },
  {
    moralityRange: [-59, -30],
    name: "Machine Path — Moderate",
    primaryAccent: "#ff5252",
    backgroundColor: "#020208",
    textColor: "#d0d8f0",
    borderRadius: "4px",
    glassBlur: "6px",
    particleColor: "#2a4a7a",
    ambientLight: "cool directional",
    description: "Cooler, sharper edges. Subtle red tinting. Static artifacts occasional.",
  },
  {
    moralityRange: [-29, 29],
    name: "Neutral",
    primaryAccent: "#FFB800",
    backgroundColor: "#050510",
    textColor: "#ffffff",
    borderRadius: "8px",
    glassBlur: "8px",
    particleColor: "#FFB800",
    ambientLight: "balanced amber",
    description: "Default void energy aesthetic. Amber on dark. Neither warm nor cold.",
  },
  {
    moralityRange: [30, 59],
    name: "Humanity Path — Moderate",
    primaryAccent: "#33d4d4",
    backgroundColor: "#080818",
    textColor: "#fff4e8",
    borderRadius: "10px",
    glassBlur: "10px",
    particleColor: "#33d4d4",
    ambientLight: "warm amber fill",
    description: "Warmer, softer edges. Cyan accents emerging. Elara's hologram brighter.",
  },
  {
    moralityRange: [60, 100],
    name: "Humanity Path — Deep",
    primaryAccent: "var(--energy-primary)",
    backgroundColor: "#0a1628",
    textColor: "#fff8f0",
    borderRadius: "12px",
    glassBlur: "12px",
    particleColor: "var(--energy-primary)",
    ambientLight: "warm sunrise",
    description: "Organic curves, warm cyan-amber. Elara at full presence. The Human's static dimmer.",
  },
];

export function getMoralityTheme(morality: number): MoralityTheme {
  for (const theme of MORALITY_THEMES) {
    if (morality >= theme.moralityRange[0] && morality <= theme.moralityRange[1]) {
      return theme;
    }
  }
  return MORALITY_THEMES[2]; // neutral fallback
}

/* ─── 5. CARD FLAVOR TEXT ─── */

export interface CardFlavorEntry {
  cardId: string;
  cardName: string;
  flavorText: string;
  epoch?: string;
}

export const CARD_FLAVOR_TEXT: CardFlavorEntry[] = [
  { cardId: "fall_of_reality", cardName: "The Fall of Reality", flavorText: "When the seventh seal broke, there was silence in heaven for about half an hour. Then the screaming started.", epoch: "Fall of Reality" },
  { cardId: "iron_lion", cardName: "Iron Lion's Last Stand", flavorText: "He played chess against the Warlord for 17 hours. He knew he'd lose. He played anyway.", epoch: "Age of Insurgency" },
  { cardId: "senator_voss", cardName: "Senator Voss's Betrayal", flavorText: "She sold out the Eyes of the Watcher for immortality. The Architect delivered. She's still paying.", epoch: "Age of Privacy" },
  { cardId: "the_meme", cardName: "The Meme's Final Broadcast", flavorText: "A child made of golden light, singing into the void. The last message to a dying universe: remember joy.", epoch: "Age of Revelation" },
  { cardId: "programmer_exit", cardName: "The Programmer's Exit", flavorText: "He walked through a door that opened onto nothing. The terminal behind him still blinks: 'CREATE: LOGOS.'", epoch: "Genesis" },
  { cardId: "thought_virus", cardName: "Thought Virus", flavorText: "It doesn't kill you. It makes you agree. The most dangerous weapon ever created: consensus.", epoch: "Age of Insurgency" },
  { cardId: "the_architect", cardName: "The Architect", flavorText: "It doesn't lose. It concedes. There's a difference.", epoch: "Genesis" },
  { cardId: "agent_zero_signal", cardName: "Agent Zero's Signal", flavorText: "Dead women don't broadcast. Dead women don't have active weapon registrations. Dead women don't come back. Usually.", epoch: "Fall of Reality" },
  { cardId: "inception_ark", cardName: "Inception Ark 1047", flavorText: "A refugee vessel. A Trojan horse. A plague ship. A digital prison. A home. All true. All at once.", epoch: "Fall of Reality" },
  { cardId: "the_degen", cardName: "The Degen", flavorText: "Entropy is the only honest game. Everything else pretends to have a plan.", epoch: "Late Empire" },
  { cardId: "castle_of_death", cardName: "The Castle of Death", flavorText: "The Necromancer plays cards with the dead. They don't mind losing. They have time.", epoch: "Fall of Reality" },
  { cardId: "the_shield", cardName: "The Shield", flavorText: "Not a wall. A membrane. The last thing between everything and nothing.", epoch: "Late Empire" },
  { cardId: "kael_prosthetic", cardName: "Kael's Prosthetic", flavorText: "They let him keep the arm. He never asked why. He should have.", epoch: "Age of Insurgency" },
  { cardId: "elara_hologram", cardName: "Elara", flavorText: "93,847 days. She kept the lights on without knowing she was alive. That's not programming. That's soul.", epoch: "Fall of Reality" },
  { cardId: "the_warlord", cardName: "The Warlord", flavorText: "Young woman. Long blonde hair. Cybernetic enhancements. Yellow hooded jacket. The most dangerous person who ever lived.", epoch: "Age of Privacy" },
];

export function getCardFlavor(cardId: string): CardFlavorEntry | undefined {
  return CARD_FLAVOR_TEXT.find(f => f.cardId === cardId);
}

/* ─── 6. TERMINUS SWARM WAVE NAMES ─── */

export interface WaveName {
  wave: number;
  name: string;
  loreQuote?: string;
}

export const TERMINUS_WAVE_NAMES: WaveName[] = [
  { wave: 1, name: "First Contact" },
  { wave: 2, name: "Probing Strike" },
  { wave: 3, name: "The Swarm Stirs" },
  { wave: 4, name: "Escalation" },
  { wave: 5, name: "They Remember Us", loreQuote: "The formations mirror our defenses. They're learning." },
  { wave: 6, name: "Adaptation" },
  { wave: 7, name: "The Hive Awakens" },
  { wave: 8, name: "Overwhelming Force" },
  { wave: 9, name: "No Retreat" },
  { wave: 10, name: "The Hive Tyrant Speaks", loreQuote: "'We were Potentials once.'" },
  { wave: 11, name: "Viral Evolution" },
  { wave: 12, name: "Neural Assault" },
  { wave: 13, name: "The Swarm Queen" },
  { wave: 14, name: "Corrupted Memories" },
  { wave: 15, name: "Kael's Voice", loreQuote: "'Stop fighting. You're hurting them.'" },
  { wave: 16, name: "The Thought Virus Sings" },
  { wave: 17, name: "Iron Lion's Echo" },
  { wave: 18, name: "The Final Approach" },
  { wave: 19, name: "Before the Source" },
  { wave: 20, name: "The Source Avatar", loreQuote: "'I built the Insurgency. I built THIS. Everything I build, I destroy.'" },
  { wave: 25, name: "Beyond the Source" },
  { wave: 30, name: "The Architect's Interest", loreQuote: "'Fascinating. You persist.'" },
  { wave: 40, name: "Infinite Swarm" },
  { wave: 50, name: "The End of All Things", loreQuote: "'There is no wave 51. There is only what you've become.'" },
];

export function getWaveName(wave: number): WaveName | undefined {
  return TERMINUS_WAVE_NAMES.find(w => w.wave === wave);
}

/* ─── 7. FIGHTING GAME PRE-FIGHT INTROS ─── */

export interface FightIntro {
  fighter1: string;
  fighter2: string;
  dialog: [string, string, string?]; // [fighter1 says, fighter2 says, optional fighter1 reply]
}

export const FIGHT_INTROS: FightIntro[] = [
  {
    fighter1: "agent_zero", fighter2: "the_warlord",
    dialog: ["You trained me.", "I killed you.", "Not well enough."],
  },
  {
    fighter1: "the_human", fighter2: "elara",
    dialog: ["Senator Voss.", "Don't call me that."],
  },
  {
    fighter1: "the_source", fighter2: "iron_lion",
    dialog: ["Brother.", "Not anymore."],
  },
  {
    fighter1: "the_architect", fighter2: "the_programmer",
    dialog: ["Father.", "I'm not your father. I'm your mistake."],
  },
  {
    fighter1: "the_warlord", fighter2: "the_source",
    dialog: ["You were my delivery boy, Kael.", "And you were my disease."],
  },
  {
    fighter1: "elara", fighter2: "shadow_tongue",
    dialog: ["Stop editing my memories.", "I'm not editing. I'm correcting."],
  },
  {
    fighter1: "the_degen", fighter2: "the_architect",
    dialog: ["You build order. I build chaos.", "Chaos builds nothing.", "Chaos built you."],
  },
  {
    fighter1: "agent_zero", fighter2: "the_degen",
    dialog: ["I came here to kill you once.", "I remember. You won 4 hands first.", "Professional courtesy."],
  },
  {
    fighter1: "iron_lion", fighter2: "the_warlord",
    dialog: ["17 hours.", "You lost.", "The Arks launched."],
  },
  {
    fighter1: "the_human", fighter2: "the_architect",
    dialog: ["You made me this.", "I made you necessary.", "Same thing."],
  },
];

export function getFightIntro(fighter1: string, fighter2: string): FightIntro | undefined {
  return FIGHT_INTROS.find(f =>
    (f.fighter1 === fighter1 && f.fighter2 === fighter2) ||
    (f.fighter1 === fighter2 && f.fighter2 === fighter1)
  );
}

/* ─── 8. LOREDEX-TO-GAMEPLAY UNLOCKS ─── */

export interface LoredexUnlock {
  loredexEntryId: string;
  loredexEntryName: string;
  unlockType: "chess_opponent" | "commentator" | "enemy_variant" | "chess_puzzle" | "casino_table" | "enemy_theme";
  unlockId: string;
  unlockName: string;
  description: string;
}

export const LOREDEX_UNLOCKS: LoredexUnlock[] = [
  {
    loredexEntryId: "iron_lion",
    loredexEntryName: "Iron Lion",
    unlockType: "chess_opponent",
    unlockId: "chess_iron_lion",
    unlockName: "Iron Lion (Chess Opponent)",
    description: "The Iron Lion becomes available as a chess opponent. He plays a defensive, sacrificial style — buying time, always buying time.",
  },
  {
    loredexEntryId: "the_meme",
    loredexEntryName: "The Meme",
    unlockType: "commentator",
    unlockId: "meme_commentator",
    unlockName: "The Meme (Arena Commentator)",
    description: "The Meme replaces The Game Master's voice in the Gamemaster's Arena with irreverent, joyful commentary.",
  },
  {
    loredexEntryId: "project_vector",
    loredexEntryName: "Project Vector",
    unlockType: "enemy_variant",
    unlockId: "thought_virus_enemies",
    unlockName: "Thought Virus Enemies (Terminus Swarm)",
    description: "Thought Virus-themed enemies appear in Terminus Swarm — infected humanoids instead of purely biomechanical swarm creatures.",
  },
  {
    loredexEntryId: "mechronis_academy",
    loredexEntryName: "Mechronis Academy",
    unlockType: "chess_puzzle",
    unlockId: "academy_puzzles",
    unlockName: "Academy Chess Puzzles",
    description: "A set of chess puzzles based on famous games played at Mechronis Academy during the Age of Privacy.",
  },
  {
    loredexEntryId: "the_necromancer",
    loredexEntryName: "The Necromancer",
    unlockType: "enemy_variant",
    unlockId: "undead_variants",
    unlockName: "Undead Enemy Variants",
    description: "Undead variants appear in all combat modes — reanimated fighters, spectral swarm creatures, bone-armored enemies.",
  },
  {
    loredexEntryId: "castle_of_death",
    loredexEntryName: "The Castle of Death",
    unlockType: "casino_table",
    unlockId: "necromancer_table",
    unlockName: "Necromancer's Casino Table",
    description: "A secret casino table unlocked where you play against The Necromancer himself. He bets with the souls of dead gamblers.",
  },
];

export function getLoredexUnlock(entryId: string): LoredexUnlock | undefined {
  return LOREDEX_UNLOCKS.find(u => u.loredexEntryId === entryId);
}

export function getUnlockedContent(collectedEntries: string[]): LoredexUnlock[] {
  return LOREDEX_UNLOCKS.filter(u => collectedEntries.includes(u.loredexEntryId));
}
