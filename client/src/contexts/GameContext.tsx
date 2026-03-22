/* ═══════════════════════════════════════════════════════
   GAME CONTEXT — Inception Ark Adventure State Machine
   Manages awakening flow, room unlocks, exploration state.
   Persists to localStorage, syncs to DB for logged-in users.
   ═══════════════════════════════════════════════════════ */
import { createContext, useContext, useCallback, useEffect, useState, useRef, type ReactNode } from "react";
import { trpc } from "@/lib/trpc";
import { LORE_ACHIEVEMENTS } from "@/data/loreAchievements";

/* ─── TYPES ─── */
export type GamePhase = "FIRST_VISIT" | "AWAKENING" | "QUARTERS_UNLOCKED" | "EXPLORING" | "FULL_ACCESS";

export type AwakeningStep =
  | "BLACKOUT"
  | "CRYO_OPEN"
  | "ELARA_INTRO"
  | "SPECIES_QUESTION"
  | "CLASS_QUESTION"
  | "ALIGNMENT_QUESTION"
  | "ELEMENT_QUESTION"
  | "NAME_INPUT"
  | "ATTRIBUTES"
  | "FIRST_STEPS"
  | "COMPLETE";

export interface CharacterChoices {
  species: "demagi" | "quarchon" | "neyon" | null;
  characterClass: "engineer" | "oracle" | "assassin" | "soldier" | "spy" | null;
  alignment: "order" | "chaos" | null;
  element: string | null;
  name: string;
  attrAttack: number;
  attrDefense: number;
  attrVitality: number;
}

export interface RoomState {
  id: string;
  unlocked: boolean;
  visited: boolean;
  visitCount: number;
  itemsFound: string[];
  elaraDialogSeen: boolean;
}

export interface GameState {
  phase: GamePhase;
  awakeningStep: AwakeningStep;
  characterChoices: CharacterChoices;
  characterCreated: boolean;
  rooms: Record<string, RoomState>;
  currentRoomId: string | null;
  itemsCollected: string[];
  achievementsEarned: string[];
  elaraDialogHistory: string[];
  totalRoomsUnlocked: number;
  totalItemsFound: number;
  narrativeFlags: Record<string, boolean>;
  claimedQuestRewards: string[];   // Quest IDs whose rewards have been claimed
  completedGames: string[];       // CoNexus game IDs the player has completed
  loreAchievements: string[];     // Lore achievement IDs earned
  conexusXp: number;              // XP earned from CoNexus game completions
  collectedCards: string[];        // IDs of all cards the player has collected
  activeDeck: string[];            // IDs of cards in the player's active battle deck
  // Morality meter: -100 (Machine) to +100 (Humanity), zero-sum
  moralityScore: number;
  moralityChoices: { tutorialId: string; choiceId: string; shift: number }[];
  // Tutorial completions
  completedTutorials: string[];    // Tutorial IDs the player has completed
  // Morality-based unlocks
  moralityUnlocks: string[];       // IDs of morality-gated items/themes unlocked
  discoveredTransmissions: string[]; // IDs of secret morality-gated transmissions found
  // Crafting system
  craftingSkills: Record<string, number>;   // Skill ID → level
  craftingXp: Record<string, number>;       // Skill ID → XP in current level
  craftingMaterials: Record<string, number>; // Material ID → quantity
  craftedItems: string[];                    // IDs of items crafted
  craftingLog: { recipeId: string; success: boolean; timestamp: number }[]; // Crafting history
  // Companion relationship system
  companionRelationships: Record<string, number>; // companionId → relationship level (0-100)
  companionQuestsCompleted: string[];             // Quest IDs completed
  companionQuestsActive: string[];                // Quest IDs currently active
  companionBackstoryUnlocked: string[];           // Backstory stage IDs unlocked
  companionRomanceActive: string | null;          // Active romance companion ID or null
  companionDialogHistory: Record<string, string[]>; // companionId → array of dialog choice IDs
  // Inception Ark fleet
  assignedArkId: string | null;                   // Player's assigned Inception Ark
  discoveredArks: string[];                       // Ark IDs the player has discovered
  // Diplomacy events
  completedDiplomacyEvents: string[];             // Diplomacy event IDs completed
  diplomacyChoices: { eventId: string; choiceId: string; moralityDelta: number }[];
  factionReputation: Record<string, number>;      // faction → reputation score
  // Faction War events
  factionWarState: {
    activeWar: string | null;
    warProgress: number;
    empireContribution: number;
    insurgencyContribution: number;
    playerContribution: number;
    playerFaction: "empire" | "insurgency" | null;
    completedWars: string[];
    activeExclusiveRoutes: { routeId: string; warpsRemaining: number }[];
    warHistory: { warId: string; winner: string; playerContribution: number }[];
  };
  // Companion gifts given
  giftsGiven: { giftId: string; companionId: string; timestamp: number }[];
  // Loyalty missions
  completedLoyaltyMissions: string[];              // Loyalty mission IDs completed
  activeLoyaltyMission: string | null;             // Currently active loyalty mission ID
  loyaltyMissionStep: number;                      // Current step index in active mission
  loyaltyLoreUnlocked: string[];                   // Lore revelation IDs unlocked
  loyaltyTitles: string[];                         // Earned title strings
}

/* ─── ROOM DEFINITIONS ─── */
export interface RoomDef {
  id: string;
  name: string;
  deck: number;
  deckName: string;
  description: string;
  elaraIntro: string;
  imageUrl: string;
  features: string[];
  featureRoutes: string[];
  unlockRequirement: { type: "start" | "room_visited" | "items_collected" | "rooms_unlocked" | "chain_complete"; value?: string | number };
  connections: string[];
  hotspots: HotspotDef[];
}

export interface HotspotDef {
  id: string;
  name: string;
  description: string;
  x: number; // percentage position
  y: number;
  width: number;
  height: number;
  type: "terminal" | "item" | "door" | "examine" | "interact";
  action?: string; // route to navigate or item to collect
  elaraDialog?: string;
  icon?: string;
  requiresItem?: string;
}

export const ROOM_DEFINITIONS: RoomDef[] = [
  {
    id: "cryo-bay",
    name: "Cryo Bay",
    deck: 1,
    deckName: "Habitation",
    description: "Your cryogenic pod sits among rows of others — most empty, some still sealed with frost. The air is cold and stale. Emergency lights cast long shadows across the metal floor.",
    elaraIntro: "This is where you woke up. Your cryogenic pod, along with hundreds of others. Most are empty now — the first wave of Potentials left long ago. Some pods are still sealed... I can't tell if their occupants are alive or if the systems failed. I'd rather not check.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_cryo_bay-SdeEqURrDvgrrbJq4WK3N5.webp",
    features: ["Character Sheet", "Settings", "Profile"],
    featureRoutes: ["/character-sheet", "/create-citizen"],
    unlockRequirement: { type: "start" },
    connections: ["medical-bay", "bridge"],
    hotspots: [
      { id: "cryo-pod", name: "Your Cryo Pod", description: "The pod you woke up in. Frost still clings to the glass. A data readout shows your vitals — somehow you survived.", x: 35, y: 30, width: 18, height: 35, type: "examine", elaraDialog: "That's your pod. Serial number AK-47-0892. You were in deep cryogenic suspension for... the chronometer is corrupted. Could be decades. Could be centuries." },
      { id: "sealed-pods", name: "Sealed Pods", description: "Several pods remain sealed, their status indicators dark. Are they occupied?", x: 70, y: 25, width: 15, height: 30, type: "examine", elaraDialog: "Those pods are still sealed. Their status indicators went dark when the main power failed. I... I don't want to speculate about what's inside them. Not yet." },
      { id: "cryo-terminal", name: "Cryo Terminal", description: "A terminal displaying your character data and vital statistics.", x: 12, y: 50, width: 14, height: 25, type: "terminal", action: "/character-sheet", elaraDialog: "This terminal has your biometric data — your species markers, class aptitudes, everything we determined during your awakening. You can review your Citizen profile here." },
      { id: "door-medical", name: "Medical Bay Door", description: "A reinforced door leading to the Medical Bay. Green status light.", x: 88, y: 20, width: 10, height: 50, type: "door", action: "medical-bay" },
      { id: "door-bridge", name: "Bridge Access", description: "A corridor leading up to Deck 2 — the Command deck.", x: 2, y: 20, width: 10, height: 50, type: "door", action: "bridge" },
      { id: "data-crystal", name: "Data Crystal", description: "A glowing crystal wedged under a pod. It contains encrypted data.", x: 55, y: 70, width: 8, height: 10, type: "item", action: "data-crystal-alpha", elaraDialog: "A data crystal! These were used by the first wave to store personal logs. This one might contain information about what happened after they woke up." },
      { id: "egg-cryo-scratch", name: "Scratched Symbol", description: "Barely visible scratch marks on the wall behind a pod.", x: 82, y: 72, width: 4, height: 5, type: "examine", elaraDialog: "Wait... those scratch marks. They form a symbol — the mark of the Antiquarian. But that's impossible. The Antiquarian is a myth, a figure from the deepest layers of the prophecy. Who carved this here, and when? This predates our launch." },
    ],
  },
  {
    id: "medical-bay",
    name: "Medical Bay",
    deck: 1,
    deckName: "Habitation",
    description: "Surgical equipment and diagnostic scanners line the walls. A bio-bed sits in the center, its holographic display still active. Something happened here — broken glass crunches underfoot.",
    elaraIntro: "The Medical Bay. This is where the Potentials were examined after awakening. The diagnostic equipment can analyze your cellular structure, track your vitality, and monitor your Dream resonance. Someone left in a hurry — the surgical tools are scattered and there's broken glass everywhere.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_medical_bay-gLunh6wxp8sNASjZDo5FpV.webp",
    features: ["Citizen Stats", "Upgrades", "Dream Balance"],
    featureRoutes: ["/character-sheet"],
    unlockRequirement: { type: "room_visited", value: "cryo-bay" },
    connections: ["cryo-bay"],
    hotspots: [
      { id: "bio-bed", name: "Bio-Bed Scanner", description: "An advanced diagnostic bed with holographic readouts showing your current stats.", x: 40, y: 40, width: 20, height: 30, type: "terminal", action: "/character-sheet", elaraDialog: "The bio-bed can give you a full diagnostic. Your stats, your Dream resonance levels, your cellular integrity. Step on and I'll run a scan." },
      { id: "dna-helix", name: "DNA Analysis Station", description: "A holographic double helix rotates slowly, mapping genetic markers.", x: 75, y: 30, width: 15, height: 35, type: "examine", elaraDialog: "The DNA analysis station. It maps your genetic markers against known species templates. DeMagi, Quarchon, Ne-Yon... your hybrid signature is fascinating." },
      { id: "medicine-cabinet", name: "Medicine Cabinet", description: "Vials of glowing liquid. Some are labeled, others are not.", x: 8, y: 25, width: 12, height: 30, type: "examine", elaraDialog: "Medical supplies. Most are standard stim-packs and neural stabilizers. But some of these vials... I don't recognize the compounds. They weren't in the original manifest." },
      { id: "medical-log", name: "Medical Log", description: "A data pad with the last medical officer's notes.", x: 25, y: 65, width: 10, height: 12, type: "item", action: "medical-log-001", elaraDialog: "The last medical officer's log. Dated... I can't read the timestamp. But the entries describe patients with unusual symptoms. Nightmares. Voices. Something about 'the signal.'" },
      { id: "door-cryo", name: "Cryo Bay Door", description: "Return to the Cryo Bay.", x: 2, y: 20, width: 10, height: 50, type: "door", action: "cryo-bay" },
      { id: "egg-med-vial", name: "Unlabeled Vial", description: "A tiny vial of shimmering black liquid hidden behind the cabinet.", x: 18, y: 58, width: 3, height: 4, type: "item", action: "void-essence-sample", elaraDialog: "That vial... the liquid inside is moving on its own. The molecular structure doesn't match anything in my database. It's not from any known universe. The label has been torn off, but there's a serial number: VE-001. 'VE' — Void Essence? This shouldn't exist on this ship." },
    ],
  },
  {
    id: "bridge",
    name: "Command Bridge",
    deck: 2,
    deckName: "Command",
    description: "The nerve center of the Inception Ark. Holographic star charts flicker above the central console. The captain's chair sits empty, facing a massive viewport showing the void of space.",
    elaraIntro: "Welcome to the Bridge. This is where the Ark's navigation and command systems are controlled. The Conspiracy Board — our intelligence network mapping every entity, faction, and connection in the Dischordian Saga — is accessible from the main tactical display. The timeline projector can show you the full history of the Ages. One thing — the Navigation Console is offline. It's locked behind an alien glyph cipher that the previous crew never cracked. If you can decode it, we could bring the ship's fast-travel system online. It would make exploring the rest of the Ark significantly easier.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_bridge-g5ANMfUqgxd8ZnPgh9h6nd.webp",
    features: ["Conspiracy Board", "Timeline", "Quests", "Guild", "Diplomacy", "Faction Wars"],
    featureRoutes: ["/board", "/timeline", "/saga-timeline", "/quests", "/guild", "/diplomacy", "/faction-wars", "/war-map"],
    unlockRequirement: { type: "room_visited", value: "cryo-bay" },
    connections: ["cryo-bay", "archives", "comms-array"],
    hotspots: [
      { id: "tactical-display", name: "Tactical Display", description: "A massive holographic display showing connections between entities, factions, and events.", x: 30, y: 20, width: 25, height: 40, type: "terminal", action: "/board", elaraDialog: "The Conspiracy Board. Every entity, every faction, every connection we've mapped in the Dischordian Saga. It's a web of alliances, betrayals, and secrets. The more you explore, the more connections you'll uncover." },
      { id: "timeline-projector", name: "Timeline Projector", description: "A holographic projector showing the Ages of the Dischordian Saga.", x: 65, y: 25, width: 18, height: 35, type: "terminal", action: "/saga-timeline", elaraDialog: "The Timeline Projector. It maps the entire history of the Dischordian Saga across the Ages — from the Age of Privacy through the Fall of Reality and beyond. Each era tells a different chapter of the story." },
      { id: "captains-chair", name: "Captain's Chair", description: "The command chair sits empty. A personal data pad is wedged in the armrest.", x: 45, y: 55, width: 12, height: 20, type: "examine", elaraDialog: "The Captain's chair. Captain Voss was the last to sit here. She ordered the emergency cryo protocol before... before whatever happened. Her personal log might still be in the armrest terminal." },
      { id: "nav-console", name: "Navigation Console", description: "Star charts and route calculations. An alien glyph interface awaits calibration.", x: 10, y: 40, width: 15, height: 25, type: "interact", action: "nav-calibration", elaraDialog: "The navigation console. It controls the Ark's fast-travel system, but the interface uses alien glyph sequences for authentication. Match the symbol pattern to bring the navigation grid online — then you can jump to any room you've already discovered." },
      { id: "quest-board", name: "Mission Board", description: "A holographic board displaying active missions and quest objectives.", x: 78, y: 45, width: 12, height: 20, type: "terminal", action: "/quests", elaraDialog: "The Mission Board. Active operations and quest objectives are tracked here. Complete missions to earn rewards, uncover lore, and advance the story. Some missions are time-sensitive — the Saga doesn't wait for anyone." },
      { id: "guild-console", name: "Guild Registry", description: "A console for managing guild operations and alliances.", x: 15, y: 65, width: 12, height: 15, type: "terminal", action: "/guild", elaraDialog: "The Guild Registry. Form alliances with other Potentials, coordinate operations, and compete for dominance. Guilds that work together can tackle challenges no individual could face alone." },
      { id: "diplomacy-table", name: "Diplomacy Table", description: "A round table with holographic faction representatives.", x: 60, y: 65, width: 14, height: 15, type: "terminal", action: "/diplomacy", elaraDialog: "The Diplomacy Table. Negotiate with factions, forge alliances, or declare rivalries. Every diplomatic decision shifts the balance of power across the Saga. Choose your allies carefully." },
      { id: "war-map-display", name: "War Map", description: "A strategic overlay showing faction territories and conflict zones.", x: 30, y: 65, width: 14, height: 15, type: "terminal", action: "/war-map", elaraDialog: "The War Map. Faction territories, conflict zones, and strategic objectives are all tracked here. When faction wars erupt, this is where commanders plan their campaigns." },
      { id: "door-archives", name: "Archives Access", description: "A secured door leading to the Archives.", x: 88, y: 20, width: 10, height: 50, type: "door", action: "archives" },
      { id: "door-cryo", name: "Cryo Bay Stairs", description: "Stairs leading down to Deck 1.", x: 2, y: 20, width: 10, height: 50, type: "door", action: "cryo-bay" },
      { id: "door-comms", name: "Comms Array Corridor", description: "A corridor leading to the Communications Array.", x: 50, y: 85, width: 15, height: 12, type: "door", action: "comms-array" },
      { id: "egg-bridge-log", name: "Hidden Data Chip", description: "A micro data chip wedged into the captain's armrest.", x: 52, y: 68, width: 3, height: 4, type: "item", action: "captains-final-log", elaraDialog: "A hidden data chip! Captain Voss must have concealed this before she entered cryo. Let me decrypt it... 'If you're reading this, the mind swap was successful. I am not who you think I am. The Engineer lives. Find the yellow coats.' The Engineer... in the Captain's body? This changes everything." },
    ],
  },
  {
    id: "archives",
    name: "Archives",
    deck: 2,
    deckName: "Command",
    description: "Floor-to-ceiling data banks hum with stored information. Holographic terminals display searchable databases. Ancient tomes sit alongside data crystals in glass cases.",
    elaraIntro: "The Archives. Every piece of intelligence we've gathered about the Dischordian Saga is stored here. You can search the database for any entity — characters, locations, factions, songs. The Codex contains deeper lore entries that require careful study to unlock.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_archives-ZHkbF8dmAL5SyqykdLgy3n.webp",
    features: ["Search", "Entity Browser", "Codex Library"],
    featureRoutes: ["/search", "/codex"],
    unlockRequirement: { type: "room_visited", value: "bridge" },
    connections: ["bridge"],
    hotspots: [
      { id: "search-terminal", name: "Search Terminal", description: "A powerful database terminal that can search across all known entities.", x: 35, y: 30, width: 20, height: 35, type: "terminal", action: "/search", elaraDialog: "The main search terminal. Type any name, alias, or keyword and it will scan our entire database. Characters, locations, factions, songs — everything is indexed and cross-referenced." },
      { id: "codex-shelf", name: "The Codex", description: "Ancient tomes and data crystals containing deep lore.", x: 70, y: 20, width: 18, height: 45, type: "terminal", action: "/codex", elaraDialog: "The Codex. These are the deeper lore entries — the histories, the prophecies, the classified files. Some entries are locked until you discover enough connections to piece them together." },
      { id: "data-banks", name: "Data Banks", description: "Rows of humming data storage units containing centuries of records.", x: 10, y: 25, width: 15, height: 40, type: "examine", elaraDialog: "Petabytes of data. Ship logs, personnel records, scientific research, intercepted transmissions. Most of it is corrupted or encrypted. I'm still trying to recover what I can." },
      { id: "archive-crystal", name: "Encoded Crystal", description: "A crystal pulsing with amber light, partially decoded.", x: 55, y: 65, width: 8, height: 10, type: "item", action: "archive-crystal-beta", elaraDialog: "Another data crystal. This one has partial decryption — it seems to contain information about the Panopticon's surveillance network. The Architect's eyes were everywhere." },
      { id: "door-bridge", name: "Bridge Door", description: "Return to the Command Bridge.", x: 2, y: 20, width: 10, height: 50, type: "door", action: "bridge" },
      { id: "egg-archive-tome", name: "Unmarked Tome", description: "A book with no title, bound in material that feels warm to the touch.", x: 88, y: 68, width: 3, height: 5, type: "examine", elaraDialog: "This book... it's not in any catalog. The binding material is organic — it's warm, like skin. The pages contain a prophecy written in a language I can't translate, but one word repeats: 'Dischord.' And at the very end, a drawing of seven seals. The Book of Revelation speaks of seven seals. Silence in Heaven follows the opening of the seventh." },
    ],
  },
  {
    id: "comms-array",
    name: "Comms Array",
    deck: 3,
    deckName: "Operations",
    description: "Banks of communication equipment fill the room. Screens display static and fragments of intercepted transmissions. A large antenna array is visible through a reinforced window.",
    elaraIntro: "The Communications Array. This is where we receive and transmit signals across the void. The Saga — the recorded history of the Dischordian conflict — plays on loop through the broadcast system. We've also intercepted fragments of transmissions from... somewhere. I can't determine the source.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_comms_array-MeKGcBZGammMEjbx8aN8fb.webp",
    features: ["Watch The Saga", "Radio", "Lore Tutorials", "Communication Relay"],
    featureRoutes: ["/watch", "/lore-tutorials"],
    unlockRequirement: { type: "rooms_unlocked", value: 3 },
    connections: ["bridge", "observation-deck"],
    hotspots: [
      { id: "broadcast-screen", name: "Broadcast Screen", description: "A large screen playing recorded episodes of the Dischordian Saga.", x: 30, y: 20, width: 25, height: 40, type: "terminal", action: "/watch", elaraDialog: "The broadcast system. It plays the recorded history of the Dischordian Saga in episodic format. Each epoch covers a different era — from the Age of Privacy through the Fall of Reality. Watch carefully. There are clues hidden in every episode." },
      { id: "radio-console", name: "Radio Console", description: "A radio tuner picking up fragments of music from across the multiverse.", x: 65, y: 35, width: 18, height: 30, type: "examine", elaraDialog: "The radio picks up fragments of music transmissions. Songs from Malkia Ukweli and the Panopticon — they seem to broadcast across dimensional barriers. Each song tells part of the story." },
      { id: "static-screen", name: "Static Screen", description: "A screen showing nothing but static. Occasionally, shapes seem to form in the noise.", x: 10, y: 30, width: 12, height: 25, type: "examine", elaraDialog: "That screen has been showing static since I can remember. But sometimes... sometimes I think I see patterns in it. Faces. Words. It's probably just signal degradation. Probably." },
      { id: "training-console", name: "Training Console", description: "An interactive tutorial system explaining the lore and mechanics of the Dischordian Saga.", x: 45, y: 60, width: 16, height: 18, type: "terminal", action: "/lore-tutorials", elaraDialog: "The Training Console. It contains interactive tutorials covering the lore, factions, game mechanics, and history of the Dischordian Saga. Essential reading for new Potentials. Even veterans might learn something new." },
      { id: "door-bridge", name: "Bridge Corridor", description: "Return to the Command Bridge.", x: 2, y: 20, width: 10, height: 50, type: "door", action: "bridge" },
      { id: "door-observation", name: "Observation Deck", description: "A passage to the Observation Deck.", x: 88, y: 20, width: 10, height: 50, type: "door", action: "observation-deck" },
      { id: "comms-relay", name: "Communication Relay", description: "A powerful relay antenna capable of scanning for neural signatures across the fleet. Used to import Potentials from linked wallets.", x: 82, y: 15, width: 14, height: 25, type: "interact", action: "comms-relay-import", elaraDialog: "The Communication Relay. I've been trying to re-establish contact with the other vessels — the ones that carried the first wave of Potentials into the void. If you connect your wallet, I can scan for dormant neural signatures and extract their identity cards." },
      { id: "egg-comms-signal", name: "Anomalous Frequency", description: "A barely audible signal on a frequency that shouldn't exist.", x: 78, y: 62, width: 4, height: 4, type: "examine", elaraDialog: "That frequency... it's not on any standard band. The signal is repeating a pattern: three short, three long, three short. An SOS. But the origin coordinates point to a location that doesn't exist in normal space. Someone — or something — is calling for help from between dimensions. The signal is tagged with an identifier: 'MEME-PRIME.'" },
    ],
  },
  {
    id: "observation-deck",
    name: "Observation Deck",
    deck: 3,
    deckName: "Operations",
    description: "A vast transparent dome reveals the infinite expanse of space. Comfortable seating faces the viewport. A music system plays softly. This was clearly a place of reflection.",
    elaraIntro: "The Observation Deck. The crew used to come here to decompress. The music system has the complete discography — every album, every track. The viewport shows... well, space. But it's different than what the star charts predicted. The constellations are wrong.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_observation_deck-DbxXnUWAHiiLro4YP8rDUg.webp",
    features: ["Discography", "Music Player", "Lyrics"],
    featureRoutes: ["/discography"],
    unlockRequirement: { type: "rooms_unlocked", value: 4 },
    connections: ["comms-array", "engineering"],
    hotspots: [
      { id: "music-terminal", name: "Music Terminal", description: "A sophisticated music system with the complete discography of Malkia Ukweli & the Panopticon.", x: 30, y: 40, width: 20, height: 30, type: "terminal", action: "/discography", elaraDialog: "The complete discography. Four albums spanning the entire narrative — Dischordian Logic, The Age of Privacy, The Book of Daniel 2:47, and the upcoming Silence in Heaven. Every song is a piece of the puzzle." },
      { id: "viewport", name: "Viewport", description: "The vast expanse of space stretches before you. The stars look... wrong.", x: 25, y: 5, width: 50, height: 30, type: "examine", elaraDialog: "Look at the stars. They're beautiful, aren't they? But they're wrong. The constellations don't match any known configuration from any of the mapped universes. Either we've traveled very, very far... or we're somewhere that shouldn't exist." },
      { id: "crew-memorial", name: "Crew Memorial", description: "A small memorial with names etched in light. The crew who didn't make it.", x: 70, y: 50, width: 15, height: 25, type: "examine", elaraDialog: "A memorial for the crew members who didn't survive the journey. Forty-seven names. They gave their lives to keep the Ark running while the Potentials slept. I remember every one of them." },
      { id: "door-comms", name: "Comms Array", description: "Return to the Communications Array.", x: 2, y: 20, width: 10, height: 50, type: "door", action: "comms-array" },
      { id: "door-engineering", name: "Engineering Access", description: "A maintenance hatch leading down to Engineering.", x: 88, y: 20, width: 10, height: 50, type: "door", action: "engineering" },
      { id: "egg-obs-constellation", name: "Strange Constellation", description: "A pattern of stars that seems to form a face.", x: 42, y: 12, width: 5, height: 6, type: "examine", elaraDialog: "Do you see it? That cluster of stars... if you connect them, they form a face. Not just any face — it looks like the Watcher. The all-seeing eye of the Panopticon's surveillance network. But we're light-years from Panopticon space. How can the stars themselves form his likeness? Unless... the stars were arranged. By someone with the power to move suns." },
    ],
  },
  {
    id: "engineering",
    name: "Engineering Bay",
    deck: 4,
    deckName: "Technical",
    description: "A massive reactor core pulses with blue-white energy behind reinforced glass. Workbenches are covered with tools and half-assembled devices. Holographic blueprints float above a central workstation.",
    elaraIntro: "Engineering. The heart of the Ark's power systems. The Research Lab here can be used to craft and fuse cards — combining lesser cards into more powerful ones. The blueprints show schematics for card designs that were never completed. Perhaps you can finish what the engineers started.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_engineering-7B58pQup6v64GgmmT7stby.webp",
    features: ["Card Crafting", "Research Lab", "Research Minigame"],
    featureRoutes: ["/research-lab", "/research-minigame"],
    unlockRequirement: { type: "rooms_unlocked", value: 5 },
    connections: ["observation-deck", "armory", "forge-workshop"],
    hotspots: [
      { id: "crafting-bench", name: "Crafting Workbench", description: "A workbench with tools for card crafting and fusion experiments.", x: 25, y: 45, width: 20, height: 30, type: "terminal", action: "/research-lab", elaraDialog: "The crafting workbench. Here you can fuse cards together to create more powerful versions. The recipes were developed by the Ark's engineers — combine the right elements and you might create something legendary." },
      { id: "reactor-core", name: "Reactor Core", description: "The Ark's main power source. It pulses with an otherworldly blue light.", x: 45, y: 15, width: 15, height: 40, type: "examine", elaraDialog: "The reactor core. It runs on a substance the engineers called 'Dream' — a crystallized form of quantum consciousness. It's the same resource that powers your abilities. The core is running at 34% capacity. We're losing power slowly." },
      { id: "blueprints", name: "Holographic Blueprints", description: "Floating schematics showing card designs and weapon systems.", x: 65, y: 30, width: 18, height: 25, type: "examine", elaraDialog: "Card schematics. The engineers were designing new card types before... before they stopped. Some of these designs are brilliant. Legendary-tier cards that could turn the tide of any battle." },
      { id: "research-station", name: "Research Station", description: "An interactive research terminal with puzzles and experiments.", x: 8, y: 60, width: 14, height: 18, type: "terminal", action: "/research-minigame", elaraDialog: "The Research Station. Solve engineering puzzles and conduct experiments to unlock new card recipes and crafting techniques. The harder the puzzle, the rarer the reward." },
      { id: "door-observation", name: "Observation Deck", description: "Return to the Observation Deck.", x: 2, y: 20, width: 10, height: 50, type: "door", action: "observation-deck" },
      { id: "door-armory", name: "Armory Access", description: "A reinforced door leading to the Armory.", x: 88, y: 20, width: 10, height: 50, type: "door", action: "armory" },
      { id: "door-forge", name: "Forge Workshop", description: "A heavy blast door with heat warnings. The air shimmers.", x: 50, y: 85, width: 15, height: 12, type: "door", action: "forge-workshop" },
      { id: "egg-eng-formula", name: "Etched Formula", description: "A mathematical formula scratched into the reactor housing.", x: 38, y: 58, width: 4, height: 4, type: "examine", elaraDialog: "Someone etched a formula into the reactor housing. It's a dimensional resonance equation — the kind used to calculate jumps between parallel universes. But there's an extra variable I've never seen: Ψ-null. The null consciousness coefficient. This formula could theoretically open a door to... nowhere. The space between spaces. Where the Source dwells." },
    ],
  },
  {
    id: "forge-workshop",
    name: "The Forge Workshop",
    deck: 4,
    deckName: "Technical",
    description: "A cavernous workshop dominated by a massive central forge that burns with shifting prismatic flames. Anvils of different metals line the walls — one glows with void energy, another hums with crystalline resonance. Weapon racks display crafted prototypes. Holographic recipe schematics float above workstations. The air is thick with heat and the smell of ozone.",
    elaraIntro: "The Forge Workshop. This is where raw materials become weapons of power. The original engineers built this facility to process materials salvaged from the void — battle shards, crystal fragments, void metal. Every crafting discipline is represented here: weaponsmithing, armorsmithing, enchanting, alchemy, and engineering. The forge responds to skill — the more you craft, the more recipes unlock. I've catalogued the material sources: combat drops from the Arena, trade goods from the Empire, essence from card sacrifice, and fragments from Ark exploration. Everything connects here.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_forge_workshop-o2LLK65f5Nacwc8TcpkNXe.webp",
    features: ["Crafting Station", "Material Vault", "Recipe Archive"],
    featureRoutes: ["/forge"],
    unlockRequirement: { type: "rooms_unlocked", value: 5 },
    connections: ["engineering"],
    hotspots: [
      { id: "central-forge", name: "Prismatic Forge", description: "The main crafting station. Prismatic flames shift color based on what's being forged.", x: 30, y: 15, width: 35, height: 40, type: "terminal", action: "/forge", elaraDialog: "The Prismatic Forge. Its flames change color based on the materials you feed it — blue for void metal, green for crystal shards, gold for legendary essence. Step up to the forge and I'll guide you through the crafting process. Every item you create here provides real combat advantages in the Arena, strategic bonuses in Card Battles, and trade benefits in the Empire." },
      { id: "material-vault", name: "Material Vault", description: "Secured storage for crafting materials. Organized by source and rarity.", x: 8, y: 30, width: 15, height: 35, type: "examine", elaraDialog: "The Material Vault. Your crafting materials are stored here — battle shards from Arena victories, trade metals from the Empire, card essence from sacrificed cards, and ark fragments from exploration. The vault automatically sorts by rarity. I'd recommend stockpiling before attempting any epic-tier recipes." },
      { id: "recipe-archive", name: "Recipe Archive", description: "Holographic schematics showing all known crafting recipes.", x: 70, y: 25, width: 20, height: 30, type: "terminal", action: "/forge", elaraDialog: "The Recipe Archive. Every known crafting recipe is catalogued here — weapons, armor, potions, ship upgrades, and card enhancements. Some recipes are locked behind skill levels. The more you craft in a discipline, the more advanced recipes become available. Master all five disciplines and you'll unlock the legendary-tier recipes." },
      { id: "skill-totems", name: "Skill Totems", description: "Five crystalline totems representing the crafting disciplines.", x: 75, y: 60, width: 15, height: 20, type: "examine", elaraDialog: "The Skill Totems — one for each crafting discipline. Weaponsmithing, Armorsmithing, Enchanting, Alchemy, and Engineering. They glow brighter as your skill increases. Touch one to see your progress. The engineers who built this place believed that mastery of all five disciplines was the key to creating the ultimate weapon — one that could end the war between the Architect and the Source." },
      { id: "door-engineering-forge", name: "Return to Engineering", description: "The blast door back to the Engineering Bay.", x: 2, y: 40, width: 8, height: 25, type: "door", action: "engineering" },
    ],
  },
  {
    id: "armory",
    name: "Armory",
    deck: 4,
    deckName: "Technical",
    description: "Weapon racks line the walls. A holographic combat arena dominates the center, its grid floor ready to project virtual enemies. Battle damage marks the walls.",
    elaraIntro: "The Armory and Combat Training Deck. This is where Potentials train for battle. The holographic arena can simulate combat scenarios — card game battles and direct combat. The weapon racks contain equipment that can enhance your fighting capabilities.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_armory-cVMQ78mPE6bJeREyXAxC6a.webp",
    features: ["Combat Sim", "Card Game Battles", "Chess", "Lore Quiz", "Spectator Mode"],
    featureRoutes: ["/fight", "/cards/play", "/quiz", "/chess", "/spectate"],
    unlockRequirement: { type: "rooms_unlocked", value: 6 },
    connections: ["engineering", "cargo-hold"],
    hotspots: [
      { id: "combat-arena", name: "Combat Arena", description: "A holographic combat simulation arena for training.", x: 30, y: 30, width: 25, height: 35, type: "terminal", action: "/fight", elaraDialog: "The combat arena. Step inside and I'll generate holographic opponents based on known entities from the Dischordian Saga. It's the safest way to test your abilities... relatively safe." },
      { id: "card-battle-station", name: "Card Battle Station", description: "A tactical display for card game warfare.", x: 65, y: 25, width: 18, height: 30, type: "terminal", action: "/battle", elaraDialog: "The card battle station. Here you can engage in strategic card warfare — deploying your deck against AI opponents or other Potentials. Every victory earns you rewards and moves you closer to understanding the true nature of the conflict." },
      { id: "weapon-rack", name: "Weapon Rack", description: "Futuristic weapons behind locked glass cases.", x: 8, y: 20, width: 12, height: 45, type: "examine", elaraDialog: "The weapon racks. Plasma swords, energy shields, cloaking devices... most are locked behind security glass. You'll need to prove yourself in combat before I can authorize access to the heavier ordnance." },
      { id: "quiz-terminal", name: "Knowledge Terminal", description: "A terminal that tests your knowledge of the Dischordian lore.", x: 85, y: 50, width: 12, height: 20, type: "terminal", action: "/quiz", elaraDialog: "The Knowledge Terminal. It tests your understanding of the Dischordian Saga. Answer correctly and you'll earn rewards. Get them wrong and... well, there are no penalties. But I'll be disappointed." },
      { id: "chess-table", name: "Strategy Table", description: "An ornate chess board with holographic pieces depicting Dischordian characters.", x: 10, y: 60, width: 14, height: 18, type: "terminal", action: "/chess", elaraDialog: "The Strategy Table. A chess variant using characters from the Dischordian Saga as pieces. Each character has unique abilities that modify the classic rules. It's not just a game — it's a test of tactical thinking. The AI opponent adapts to your skill level." },
      { id: "spectator-screen", name: "Spectator Screen", description: "A large screen showing live battles between other Potentials.", x: 65, y: 60, width: 14, height: 18, type: "terminal", action: "/spectate", elaraDialog: "The Spectator Screen. Watch live battles between other Potentials. Study their strategies, learn from their mistakes, and prepare for your own encounters." },
      { id: "door-engineering", name: "Engineering Bay", description: "Return to Engineering.", x: 2, y: 20, width: 10, height: 50, type: "door", action: "engineering" },
      { id: "door-cargo", name: "Cargo Hold", description: "Stairs leading down to the Cargo Hold.", x: 50, y: 85, width: 15, height: 12, type: "door", action: "cargo-hold" },
      { id: "egg-armory-dogtag", name: "Fallen Dog Tag", description: "A military dog tag wedged between floor plates.", x: 42, y: 78, width: 3, height: 4, type: "item", action: "agent-zero-dogtag", elaraDialog: "A dog tag. Name: CLASSIFIED. Rank: Assassin, First Class. Unit: Insurgency Special Operations. Callsign: 'Agent Zero.' But wait — the biometric data on the tag doesn't match Agent Zero's profile. It matches... the Engineer. The mind swap. The Engineer is walking around in Agent Zero's body, hiding among the Potentials. On THIS ship." },
    ],
  },
  {
    id: "cargo-hold",
    name: "Cargo Hold",
    deck: 5,
    deckName: "Logistics",
    description: "Stacked containers and crates fill the vast space. A makeshift trading post has been set up. Some containers are open, revealing exotic items and alien artifacts.",
    elaraIntro: "The Cargo Hold. This is where the Ark's supplies are stored — and where the Trade Empire game is run. The trading post was set up by the first wave of Potentials before they left. You can trade resources, buy and sell goods, and compete in the interstellar trade simulation.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_cargo_hold-U6wJuiqP3pgzQHUKscNpi6.webp",
    features: ["Trade Empire", "Store", "Marketplace", "Fleet", "Inventory"],
    featureRoutes: ["/trade-empire", "/store", "/marketplace", "/inventory", "/fleet"],
    unlockRequirement: { type: "rooms_unlocked", value: 7 },
    connections: ["armory", "captains-quarters"],
    hotspots: [
      { id: "trade-terminal", name: "Trade Empire Terminal", description: "The main terminal for the interstellar trade simulation.", x: 65, y: 35, width: 20, height: 30, type: "terminal", action: "/trade-empire", elaraDialog: "Trade Empire. An interstellar trade simulation based on the actual trade routes of the Dischordian universe. Buy low, sell high, avoid pirates, and build your trading empire. The credits you earn here are real — they can be spent in the store." },
      { id: "store-counter", name: "Requisitions Counter", description: "A trading post where you can buy items with Dream tokens and credits.", x: 25, y: 40, width: 18, height: 28, type: "terminal", action: "/store", elaraDialog: "The Requisitions Counter. You can spend your Dream tokens and credits here on upgrades, card packs, cosmetics, and more. Some items are only available through the store." },
      { id: "marketplace-board", name: "Marketplace Board", description: "A bustling exchange board showing buy and sell orders from Potentials across the Ark.", x: 45, y: 20, width: 16, height: 22, type: "terminal", action: "/marketplace", elaraDialog: "The Marketplace. A peer-to-peer exchange where Potentials trade cards, materials, and equipment. Prices fluctuate based on supply and demand. A shrewd trader can make a fortune here." },
      { id: "inventory-locker", name: "Personal Locker", description: "A secured locker containing your collected items and equipment.", x: 10, y: 25, width: 12, height: 22, type: "terminal", action: "/inventory", elaraDialog: "Your personal inventory locker. Everything you've collected — weapons, armor, materials, consumables, and artifacts — is stored here. Organize your gear before heading into battle." },
      { id: "fleet-dock", name: "Fleet Docking Bay", description: "A viewport showing the Ark's auxiliary fleet of smaller vessels.", x: 78, y: 55, width: 14, height: 18, type: "terminal", action: "/fleet", elaraDialog: "The Fleet Docking Bay. Your auxiliary vessels are moored here — scout ships, cargo haulers, and combat frigates. Manage your fleet to expand your reach across the trade routes and war zones of the Saga." },
      { id: "mystery-crate", name: "Sealed Crate", description: "A large crate with claw marks on it. Something was trying to get in... or out.", x: 10, y: 55, width: 12, height: 18, type: "examine", elaraDialog: "That crate... the claw marks are on the inside. Something was sealed in there and tried to get out. The manifest says it contained 'biological samples from Sector 7.' I've locked it down. Don't touch it." },
      { id: "door-armory", name: "Armory Stairs", description: "Stairs leading up to the Armory.", x: 2, y: 20, width: 10, height: 50, type: "door", action: "armory" },
      { id: "door-captains", name: "Captain's Quarters", description: "A restricted access corridor to the Captain's Quarters.", x: 88, y: 20, width: 10, height: 50, type: "door", action: "captains-quarters" },
      { id: "egg-cargo-manifest", name: "Torn Manifest Page", description: "A torn page from the original cargo manifest, hidden under a crate.", x: 48, y: 72, width: 4, height: 5, type: "item", action: "classified-manifest-page", elaraDialog: "A torn manifest page. Most of it is redacted, but one entry is legible: 'Container 7-Omega: BIOLOGICAL — Clone Template, Oracle-class. STATUS: Active. HANDLER: The Collector.' A clone template of the Oracle... on our ship. The False Prophet was made from an Oracle clone. Is there another one here? Is it awake?" },
    ],
  },
  {
    id: "captains-quarters",
    name: "Captain's Quarters",
    deck: 6,
    deckName: "Restricted",
    description: "A luxurious but abandoned room. Achievement trophies float in holographic displays. Bookshelves hold ancient tomes. The captain's personal terminal shows encrypted files.",
    elaraIntro: "The Captain's Quarters. This was Captain Voss's private sanctuary. The Trophy Room displays your achievements and collected artifacts. The wall of honor shows every milestone you've reached. This room was the last to be abandoned... and it holds the most secrets.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_captains_quarters-BWMWKmvU7KomMEe2RxdxTV.webp",
    features: ["Achievements", "Trophy Room", "Deck Builder", "Companions", "Battle Pass", "Morality Census"],
    featureRoutes: ["/trophy", "/deck-builder", "/companions", "/battle-pass", "/morality-census"],
    unlockRequirement: { type: "items_collected", value: 3 },
    connections: ["cargo-hold"],
    hotspots: [
      { id: "trophy-wall", name: "Trophy Wall", description: "A holographic display showing your achievements and collected trophies.", x: 8, y: 15, width: 20, height: 45, type: "terminal", action: "/trophy", elaraDialog: "The Trophy Wall. Every achievement you've earned, every milestone you've reached. Captain Voss believed that recognition drives excellence. She was right." },
      { id: "deck-builder", name: "Strategic Table", description: "A large table with holographic card projections for deck building.", x: 45, y: 40, width: 22, height: 30, type: "terminal", action: "/deck-builder", elaraDialog: "The Strategic Table. Captain Voss used this to plan battle formations. Now you can use it to build and refine your card decks. A well-built deck is the difference between victory and oblivion." },
      { id: "companion-quarters", name: "Companion Quarters", description: "A cozy alcove with two beds and personal effects. Elara's space and room for another companion.", x: 70, y: 40, width: 14, height: 20, type: "terminal", action: "/companions", elaraDialog: "The Companion Quarters. This is where your companions rest between missions. Each companion has unique abilities and synergies with your build. Strengthen your bond and they'll fight harder for you." },
      { id: "battle-pass-console", name: "Season Terminal", description: "A terminal displaying the current season's challenges and reward tracks.", x: 15, y: 55, width: 14, height: 18, type: "terminal", action: "/battle-pass", elaraDialog: "The Season Terminal. Each season brings new challenges, exclusive rewards, and limited-time content. Progress through the reward track to earn unique cosmetics, cards, and materials." },
      { id: "morality-compass", name: "Morality Compass", description: "A crystalline device that pulses between gold and violet, measuring the moral alignment of the Ark's population.", x: 35, y: 10, width: 14, height: 18, type: "terminal", action: "/morality-census", elaraDialog: "The Morality Compass. It measures the collective moral alignment of all Potentials aboard the Ark. Every choice you make — order or chaos, mercy or justice — shifts the balance. The census reveals how the community's choices are shaping the Saga." },
      { id: "viewport-stars", name: "Star Viewport", description: "A viewport showing a nebula that seems to pulse with light.", x: 60, y: 10, width: 25, height: 35, type: "examine", elaraDialog: "That nebula... it wasn't there when we launched. It appeared three cycles ago and it's been growing. Sometimes I think it's watching us. That's not scientifically possible, of course. But I think it anyway." },
      { id: "door-cargo", name: "Cargo Hold", description: "Return to the Cargo Hold.", x: 2, y: 20, width: 10, height: 50, type: "door", action: "cargo-hold" },
      { id: "door-library", name: "Hidden Passage", description: "A shimmering doorway that wasn't there before. It pulses with purple light.", x: 88, y: 55, width: 10, height: 25, type: "door", action: "antiquarian-library" },
      { id: "egg-captain-mirror", name: "Cracked Mirror", description: "A mirror in the corner, cracked in a spider-web pattern. Your reflection looks... wrong.", x: 78, y: 55, width: 4, height: 6, type: "examine", elaraDialog: "That mirror... look at your reflection. Do you see it? For a fraction of a second, your reflection moved differently than you did. It smiled when you didn't. The White Oracle — the face-changing guardian — was said to inhabit reflective surfaces. But the White Oracle is actually the Meme in disguise. Is the Meme watching us through every mirror on this ship? How long has it been watching?" },
    ],
  },
  {
    id: "antiquarian-library",
    name: "The Antiquarian's Library",
    deck: 7,
    deckName: "Pocket Dimension",
    description: "A vast circular chamber carved from alien stone, its domed ceiling displaying living star maps. Towering bookshelves hold ancient tomes and glowing data crystals. At the center sits an ornate desk with a leather glove — and hovering above it, a golden orb containing a miniature city, casting prismatic light across the room.",
    elaraIntro: "This... this shouldn't exist. We've stepped outside the Ark — outside time itself. This is the Antiquarian's Library, a pocket dimension hidden between realities. The Antiquarian — once known as the Programmer, Dr. Daniel Cross — retreated here after witnessing the Fall of Reality. He watches every timeline through that Orb on his desk. And those books on the shelves? They're not books. They're doorways into the CoNexus — interactive story games that let you live through the events of the Dischordian Saga. Touch the Orb. Choose a story. Every choice you make here echoes across every universe.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/antiquarian_library_room-dhtjQjrMbU3s3WhnWePBPF.webp",
    features: ["CoNexus Stories", "Story Games", "The Orb of Worlds"],
    featureRoutes: ["/conexus"],
    unlockRequirement: { type: "items_collected", value: 5 },
    connections: ["captains-quarters"],
    hotspots: [
      { id: "orb-of-worlds", name: "The Orb of Worlds", description: "A golden orb hovering above a leather glove on the desk. Inside, a miniature city glows with warm light — its tiny streets and buildings shifting as you watch.", x: 35, y: 30, width: 20, height: 30, type: "terminal", action: "/conexus", elaraDialog: "The Orb of Worlds. The Antiquarian uses it to observe every timeline simultaneously. That city inside — it's not a model. It's a real city, compressed into a pocket of folded space. Touch it and the CoNexus portal opens. You can step into any story from the Dischordian Saga and live it yourself. The AI adapts to your choices. No two journeys are ever the same." },
      { id: "ancient-tomes", name: "Ancient Tomes", description: "Shelves of leather-bound books that pulse with faint inner light. Each spine bears a title from the Dischordian Saga.", x: 8, y: 15, width: 15, height: 50, type: "terminal", action: "/conexus", elaraDialog: "These aren't ordinary books. Each one is a gateway to a CoNexus story game. The Necromancer's Lair, Awaken the Clone, Sundown Bazaar... the Antiquarian has catalogued every major event in the Saga as an interactive narrative. Pick one up and you'll be pulled into the story." },
      { id: "data-crystals", name: "Glowing Data Crystals", description: "Crystalline structures embedded in the shelves, each containing compressed narratives from different Ages.", x: 75, y: 20, width: 15, height: 40, type: "examine", elaraDialog: "Data crystals from every Age of the Saga. The Age of Privacy, the Age of Revelation, the Fall of Reality, the Age of Potentials. Each crystal contains thousands of branching narratives — every possible outcome of every possible choice. The Antiquarian has been collecting them for millennia." },
      { id: "antiquarian-desk", name: "The Antiquarian's Desk", description: "An ornate desk covered in star charts, ancient manuscripts, and a leather glove that seems to move on its own.", x: 30, y: 55, width: 25, height: 20, type: "examine", elaraDialog: "The Antiquarian's personal desk. Star charts from universes that no longer exist. Manuscripts written in languages that were never spoken by mortal tongues. And that glove — it's a neural interface, designed to connect directly with the Orb. The Antiquarian doesn't just watch the timelines. He feels them. Every joy, every sorrow, every death — he experiences it all." },
      { id: "star-ceiling", name: "Living Star Map", description: "The domed ceiling displays constellations that move and shift, showing the positions of stars across multiple timelines.", x: 35, y: 2, width: 30, height: 12, type: "examine", elaraDialog: "The ceiling shows star maps from every major timeline in the Saga. Watch — the constellations shift as different realities branch and collapse. Each point of light is a universe. Some are thriving. Some are dying. Some have already been consumed by the Terminus Swarm. The Antiquarian watches them all." },
      { id: "door-captains", name: "Return to Captain's Quarters", description: "The shimmering portal back to the Ark.", x: 2, y: 35, width: 8, height: 30, type: "door", action: "captains-quarters" },
      { id: "egg-library-prophecy", name: "Hidden Prophecy", description: "A single page, glowing faintly, tucked behind a shelf. It seems to have been placed here deliberately.", x: 90, y: 65, width: 4, height: 5, type: "item", action: "antiquarian-prophecy", elaraDialog: "A prophecy written in the Antiquarian's own hand. 'When the seventh seal breaks and silence falls upon heaven, the Orb will shatter and the stories will become real. The Potentials will face the final choice: to end the Saga or begin it anew. The Programmer dies so the Antiquarian can live. The Antiquarian lives so the stories can be told. And the stories are told so that you — yes, you, the one reading this — can choose.' He's... he's talking to us directly. He knew we would find this. He planned for everything." },
    ],
  },
  /* ═══ CHAIN-UNLOCKED HIDDEN ROOMS ═══ */
  {
    id: "engineering-core",
    name: "Engineering Core",
    deck: 8,
    deckName: "Hidden — Engineer",
    description: "The true heart of the Inception Ark — a massive reactor chamber hidden behind layers of encrypted bulkheads. A pulsing blue energy core floats in the center, surrounded by catwalks and holographic schematics showing the Ark's original DeMagi blueprints. Only an Engineer who has proven their mastery could bypass the security protocols.",
    elaraIntro: "This is it — the Engineering Core. The real one. Everything else on this ship is powered by a fraction of what this reactor produces. The DeMagi built it to sustain reality itself. The schematics floating here... they show modifications the Architect made after the Fall. Warp drive enhancements, dimensional fold generators, temporal stabilizers. This is where the Ark's true power lives. And now it responds to you, Engineer.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_engineering_core-27z7uAMQdGFBL53VYBxXuq.webp",
    features: ["Reactor Core", "DeMagi Blueprints", "Warp Schematics"],
    featureRoutes: [],
    unlockRequirement: { type: "chain_complete", value: "engineer_chain" },
    connections: ["engineering"],
    hotspots: [
      { id: "reactor-core", name: "Reactor Core", description: "A sphere of pure energy suspended by magnetic fields, pulsing with the heartbeat of the Ark.", x: 35, y: 20, width: 30, height: 40, type: "examine", elaraDialog: "The Reactor Core. It runs on compressed dark energy harvested from collapsed dimensions. The DeMagi called it 'The Breath of Creation.' It generates enough power to fold space-time. The Architect modified it to also serve as a beacon — broadcasting across every reality simultaneously. That's how the Ark finds lost Potentials like you." },
      { id: "warp-schematics", name: "Warp Drive Schematics", description: "Holographic blueprints showing the Ark's dimensional fold engine in extraordinary detail.", x: 70, y: 15, width: 20, height: 30, type: "examine", elaraDialog: "These schematics show the Ark's warp drive — but not the one in Engineering Bay. This is the real drive. It doesn't move through space. It folds space around the Ark. The Architect reverse-engineered it from Quarchon quantum tunneling technology. Only an Engineer would understand the mathematics involved." },
      { id: "door-engineering", name: "Return to Engineering Bay", description: "The sealed blast door back to the main engineering section.", x: 2, y: 40, width: 8, height: 25, type: "door", action: "engineering" },
      { id: "egg-core-frequency", name: "Resonance Frequency", description: "A specific harmonic emanating from the core that seems to encode a message.", x: 50, y: 70, width: 5, height: 5, type: "item", action: "core-frequency", elaraDialog: "That frequency... it's not random. It's a message encoded in the core's harmonic oscillation. The Architect left it here for whoever found this room. It says: 'The machine remembers what the maker forgets. Build well, Engineer. The next Ark is yours to design.'" },
    ],
  },
  {
    id: "oracle-sanctum",
    name: "Oracle Sanctum",
    deck: 8,
    deckName: "Hidden — Oracle",
    description: "A vast circular chamber where a massive crystal sphere pulses with purple and white energy. Tall arched alcoves display glowing runes and holographic star maps. Meditation platforms hover above a reflective floor. The air hums with precognitive resonance — this is where the Oracle's true power awakens.",
    elaraIntro: "The Oracle Sanctum. I've heard whispers about this place but never believed it existed. The Oracle who built this room could see every possible future simultaneously. Those floating platforms are neural amplifiers — they boost precognitive ability a thousandfold. The crystal sphere at the center contains compressed probability fields. Touch it and you'll see... everything. Every choice, every consequence, every timeline branching into infinity. Only a true Oracle can withstand the vision without losing their mind.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_oracle_sanctum-4sJSFqYmnfbfKr8kkCsDSg.webp",
    features: ["Probability Sphere", "Neural Amplifiers", "Timeline Viewer"],
    featureRoutes: [],
    unlockRequirement: { type: "chain_complete", value: "oracle_chain" },
    connections: ["observation-deck"],
    hotspots: [
      { id: "probability-sphere", name: "Probability Sphere", description: "A massive crystal sphere pulsing with purple energy, containing compressed probability fields.", x: 35, y: 20, width: 30, height: 40, type: "examine", elaraDialog: "The Probability Sphere. It contains every possible future of the Dischordian Saga compressed into a single point. When an Oracle touches it, they can navigate the probability streams — see which choices lead to salvation and which lead to destruction. The original Oracle used this to guide the Panopticon's decisions. Now it responds to you." },
      { id: "meditation-platforms", name: "Meditation Platforms", description: "Hovering platforms that amplify precognitive abilities.", x: 15, y: 55, width: 20, height: 20, type: "examine", elaraDialog: "These platforms use quantum entanglement to synchronize your neural patterns with the probability field. Sit on one and your visions become clearer, more detailed. The original Oracle spent centuries here, mapping every possible future. Some say they went mad from seeing too much. Others say they achieved perfect clarity." },
      { id: "door-observation", name: "Return to Observation Deck", description: "The shimmering portal back to the Observation Deck.", x: 2, y: 40, width: 8, height: 25, type: "door", action: "observation-deck" },
      { id: "egg-oracle-vision", name: "Sealed Vision", description: "A sealed crystal containing a single frozen vision.", x: 85, y: 65, width: 5, height: 5, type: "item", action: "oracle-vision", elaraDialog: "A sealed vision. The Oracle locked this one away because it was too dangerous to share. It shows... the end. The final moment of the Saga. I can't see the details — only an Oracle can unseal it. But the emotion radiating from it is overwhelming. Hope and terror in equal measure." },
    ],
  },
  {
    id: "shadow-vault",
    name: "Shadow Vault",
    deck: 8,
    deckName: "Hidden — Assassin",
    description: "A dark chamber lit only by red laser grids and dim emergency strips. Walls lined with weapon racks, disguise kits, and surveillance equipment behind glass cases. A central holographic table shows infiltration routes across the Ark and beyond. This is where shadows are born.",
    elaraIntro: "The Shadow Vault. Agent Zero's personal armory and operations center. Every assassination, every infiltration, every impossible mission was planned from this room. Those weapons behind the glass — each one has a kill count in the thousands. The disguise kits can replicate any face, any voice. And that holographic table shows every blind spot, every vulnerability in every system the Panopticon ever built. You've proven yourself worthy of the shadows, Assassin. Use this knowledge wisely.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_shadow_vault-R233qZpEJpNTuvvZvuBBdX.webp",
    features: ["Weapon Arsenal", "Infiltration Maps", "Disguise Kits"],
    featureRoutes: [],
    unlockRequirement: { type: "chain_complete", value: "assassin_chain" },
    connections: ["armory"],
    hotspots: [
      { id: "weapon-arsenal", name: "Weapon Arsenal", description: "Glass cases containing legendary weapons from across the Saga.", x: 20, y: 15, width: 25, height: 40, type: "examine", elaraDialog: "Agent Zero's personal collection. The Whisper Blade — kills without a sound. The Phase Pistol — shoots through walls. The Null Dart — erases memories. Each weapon was designed for a specific target. Some of those targets were gods. The fact that these weapons exist means someone, somewhere, needed to kill something that shouldn't have been killable." },
      { id: "infiltration-table", name: "Infiltration Table", description: "A holographic table showing routes, blind spots, and vulnerabilities.", x: 35, y: 45, width: 30, height: 25, type: "examine", elaraDialog: "The infiltration map. It shows every security system, every patrol route, every blind spot in every major installation across the Saga. The Panopticon, the Terminus Hive, the Quarchon Quantum Citadel — all mapped in perfect detail. Agent Zero spent lifetimes gathering this intelligence. Now it's yours." },
      { id: "door-armory", name: "Return to Armory", description: "The concealed passage back to the main Armory.", x: 2, y: 40, width: 8, height: 25, type: "door", action: "armory" },
      { id: "egg-shadow-contract", name: "Final Contract", description: "A sealed dossier marked with a skull emblem.", x: 90, y: 70, width: 5, height: 5, type: "item", action: "shadow-contract", elaraDialog: "Agent Zero's final contract. Never completed. The target... is the Architect himself. Someone hired Zero to kill the creator of the Inception Ark. The contract was never fulfilled because Zero discovered the truth — killing the Architect would unravel every reality simultaneously. So Zero sealed the contract here as a warning: some targets must never be eliminated." },
    ],
  },
  {
    id: "war-room",
    name: "War Room",
    deck: 8,
    deckName: "Hidden — Soldier",
    description: "A massive military command center with a holographic battle map dominating the center. Tiered command stations surround the map showing fleet positions across multiple star systems. Heavy armored bulkheads bear military insignias. Amber and red warning lights pulse with tactical urgency.",
    elaraIntro: "The War Room. Iron Lion's personal command center during the Great Convergence War. From this room, he coordinated the defense of three star systems simultaneously. That battle map shows every major conflict in the Saga — the Siege of the Panopticon, the Fall of Reality, the Terminus Invasion. Each one was won or lost based on decisions made in rooms like this. You've earned your place at the command table, Soldier. The next war is coming, and you'll need everything this room can teach you.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_war_room-gixwPLTMpEq74w496jQaZ7.webp",
    features: ["Battle Map", "Fleet Command", "Tactical Archives", "Guild Wars", "Faction Wars"],
    featureRoutes: ["/guild-war", "/faction-wars"],
    unlockRequirement: { type: "chain_complete", value: "soldier_chain" },
    connections: ["bridge"],
    hotspots: [
      { id: "battle-map", name: "Holographic Battle Map", description: "A massive 3D map showing fleet positions and planetary systems across the Saga.", x: 25, y: 25, width: 50, height: 40, type: "examine", elaraDialog: "The Battle Map. It tracks every military asset across every timeline. Those red markers are Terminus Swarm incursions. The blue ones are Panopticon defense fleets. The gold ones... those are unknown. Iron Lion marked them as 'Potential Forces' — armies that don't exist yet but could be raised by the right commander. That's you, Soldier." },
      { id: "tactical-archives", name: "Tactical Archives", description: "Sealed military records from every major conflict in the Saga.", x: 75, y: 15, width: 15, height: 30, type: "examine", elaraDialog: "Military records from every war in the Dischordian Saga. Battle formations, casualty reports, after-action reviews. Iron Lion studied every defeat to ensure it never happened again. The most classified file is labeled 'Operation Final Dawn' — a contingency plan for if the Terminus Swarm breaches all defenses. It requires a Soldier of exceptional courage to execute." },
      { id: "guild-war-console", name: "Guild War Command", description: "A tactical console for coordinating guild war operations.", x: 8, y: 50, width: 16, height: 20, type: "terminal", action: "/guild-war", elaraDialog: "The Guild War Command console. Coordinate with your guild to wage war against rival guilds. Deploy troops, capture territories, and earn glory for your alliance. The strongest guilds control the most valuable sectors of the Saga." },
      { id: "faction-war-map", name: "Faction War Map", description: "A strategic overlay showing faction conflict zones and territory control.", x: 75, y: 50, width: 16, height: 20, type: "terminal", action: "/faction-wars", elaraDialog: "The Faction War Map. The great factions of the Dischordian Saga are locked in eternal conflict. Choose your side, fight for territory, and shape the outcome of the Saga. Your faction's victories and defeats ripple across every timeline." },
      { id: "door-bridge", name: "Return to Command Bridge", description: "The reinforced corridor back to the main Bridge.", x: 2, y: 40, width: 8, height: 25, type: "door", action: "bridge" },
      { id: "egg-war-medal", name: "Iron Lion's Medal", description: "A battered medal of valor pinned to the command chair.", x: 48, y: 72, width: 5, height: 5, type: "item", action: "war-medal", elaraDialog: "Iron Lion's Medal of Valor. Awarded for holding the line at the Siege of the Panopticon when all seemed lost. He fought for seventy-two hours without rest, rallying broken units and turning retreat into counterattack. The medal is scratched and dented — he wore it into every battle after. He said it reminded him what he was fighting for: not victory, but the people behind him." },
    ],
  },
  {
    id: "cipher-den",
    name: "Cipher Den",
    deck: 8,
    deckName: "Hidden — Spy",
    description: "An intelligence operations room packed with screens showing encrypted data streams and surveillance feeds. A central desk bristles with holographic keyboards and decryption tools. Walls covered in connected string boards linking photos and documents. The air crackles with intercepted transmissions.",
    elaraIntro: "The Cipher Den. The Enigma's personal intelligence hub. Every secret in the Dischordian Saga passed through this room at some point. Those string boards on the walls connect every conspiracy, every hidden alliance, every betrayal across the entire timeline. The Enigma didn't just collect information — they weaponized it. A single piece of intelligence from this room could topple empires or save civilizations. You've proven you can handle the truth, Spy. But remember — knowing everything comes with a price.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_cipher_den-mzberz7WkZDa6V6GJ2kxVJ.webp",
    features: ["Surveillance Network", "Decryption Tools", "Conspiracy Boards"],
    featureRoutes: [],
    unlockRequirement: { type: "chain_complete", value: "spy_chain" },
    connections: ["comms-array"],
    hotspots: [
      { id: "surveillance-feeds", name: "Surveillance Network", description: "Dozens of screens showing live feeds from across the Ark and beyond.", x: 30, y: 10, width: 40, height: 35, type: "examine", elaraDialog: "The Enigma's surveillance network. It doesn't just monitor the Ark — it taps into communication channels across multiple realities. Those feeds show conversations happening right now in the Panopticon, the Terminus Hive, even the Antiquarian's Library. The Enigma saw everything. Knew everything. And trusted no one." },
      { id: "conspiracy-boards", name: "Conspiracy Boards", description: "String boards connecting photos, documents, and evidence across the entire Saga.", x: 5, y: 15, width: 20, height: 40, type: "examine", elaraDialog: "The conspiracy boards. Every thread connects to every other thread. The Architect's true identity. The Oracle's hidden agenda. The Collector's real purpose. The Enigma mapped it all. Some of these connections are terrifying — they suggest that certain events in the Saga weren't accidents. They were orchestrated by someone operating above even the Architect's awareness." },
      { id: "door-comms", name: "Return to Comms Array", description: "The hidden panel back to the main Communications Array.", x: 2, y: 40, width: 8, height: 25, type: "door", action: "comms-array" },
      { id: "egg-cipher-key", name: "Master Cipher Key", description: "A small device that can decrypt any message in the Saga.", x: 55, y: 65, width: 5, height: 5, type: "item", action: "cipher-key", elaraDialog: "The Master Cipher Key. The Enigma's ultimate tool. It can decrypt any message, crack any code, bypass any encryption in the entire Dischordian Saga. With this, there are no more secrets. The Enigma left it here with a note: 'The truth will set you free. But first, it will make you very, very angry.' Use it wisely, Spy." },
    ],
  },
  /* ═══ ALIGNMENT-UNLOCKED HIDDEN ROOMS ═══ */
  {
    id: "order-tribunal",
    name: "Tribunal of Order",
    deck: 9,
    deckName: "Hidden — Order",
    description: "A grand tribunal hall of perfect symmetry. Tall marble pillars support a vaulted ceiling. Holographic law books and legal codes float in organized rows. A central scale of justice glows with golden light. Everything is precisely ordered — geometric floor patterns, evenly spaced columns, balanced illumination.",
    elaraIntro: "The Tribunal of Order. The Hierophant built this chamber to embody the principle of perfect law. Every rule, every code, every regulation that governs the Dischordian Saga is archived here. The Scale of Justice at the center doesn't just symbolize balance — it actively weighs the moral implications of every decision made aboard the Ark. You've walked the path of Order, and the Tribunal recognizes your commitment to structure and law.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_order_tribunal-GitXDFoXDcJoh4akc8NJUC.webp",
    features: ["Scale of Justice", "Law Archives", "Moral Compass"],
    featureRoutes: [],
    unlockRequirement: { type: "chain_complete", value: "order_chain" },
    connections: ["bridge"],
    hotspots: [
      { id: "scale-justice", name: "Scale of Justice", description: "A golden holographic scale that weighs moral decisions.", x: 35, y: 35, width: 30, height: 30, type: "examine", elaraDialog: "The Scale of Justice. It weighs not gold or silver, but intention and consequence. Every major decision in the Saga was evaluated by this scale. The Hierophant used it to determine which actions served the greater good and which served only selfish desire. It's responding to your presence — it recognizes a champion of Order." },
      { id: "law-archives", name: "Law Archives", description: "Floating holographic tomes containing every law and code of the Saga.", x: 10, y: 15, width: 15, height: 35, type: "examine", elaraDialog: "The complete legal code of the Dischordian Saga. Laws governing reality itself — the Conservation of Narrative Energy, the Prohibition of Temporal Paradox, the Right of Every Potential to Choose Their Own Path. The Hierophant wrote most of these. Some say they're the only thing preventing the multiverse from collapsing into chaos." },
      { id: "door-bridge-order", name: "Return to Bridge", description: "The formal corridor back to the Command Bridge.", x: 2, y: 40, width: 8, height: 25, type: "door", action: "bridge" },
    ],
  },
  {
    id: "chaos-forge",
    name: "Chaos Forge",
    deck: 9,
    deckName: "Hidden — Chaos",
    description: "An asymmetric forge chamber where walls meet at impossible angles. Multiple forges burn with different colored flames — purple, green, red. Sparks fly everywhere. Half-finished inventions and experimental weapons hang from chains. Graffiti and anarchist symbols cover the walls alongside brilliant equations.",
    elaraIntro: "The Chaos Forge. The Meme built this place as a monument to creative destruction. Nothing here follows rules — the forges burn with impossible fuels, the weapons defy physics, and the equations on the walls solve problems that shouldn't have solutions. This is where chaos becomes power. Where breaking the rules creates something entirely new. You've embraced the chaos, and the Forge recognizes a kindred spirit.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_chaos_forge-5uQMaTYd4Rtcetyoek2XbL.webp",
    features: ["Reality Forges", "Impossible Weapons", "Chaos Equations"],
    featureRoutes: [],
    unlockRequirement: { type: "chain_complete", value: "chaos_chain" },
    connections: ["engineering"],
    hotspots: [
      { id: "reality-forges", name: "Reality Forges", description: "Forges burning with flames of different colors, each one warping reality around it.", x: 15, y: 15, width: 70, height: 40, type: "examine", elaraDialog: "The Reality Forges. Each one burns a different fuel — compressed probability, crystallized paradox, liquefied déjà vu. The Meme used them to forge weapons that shouldn't exist. A sword that cuts through time. A shield that reflects consequences. A bomb that erases the concept of a specific idea. Chaos isn't destruction — it's unlimited creativity." },
      { id: "chaos-equations", name: "Chaos Equations", description: "Brilliant equations scrawled on the walls alongside anarchist graffiti.", x: 75, y: 55, width: 20, height: 25, type: "examine", elaraDialog: "The equations of chaos. They look like madness, but each one solves an impossible problem. How to travel faster than light without a ship. How to exist in two places simultaneously. How to make a joke so funny it literally rewrites reality. The Meme was a genius — they just expressed their genius through destruction and humor rather than order and logic." },
      { id: "door-engineering-chaos", name: "Return to Engineering Bay", description: "A jagged hole blasted through the wall leading back to Engineering.", x: 2, y: 40, width: 8, height: 25, type: "door", action: "engineering" },
    ],
  },
  /* ═══ SPECIES-UNLOCKED HIDDEN ROOMS ═══ */
  {
    id: "elemental-nexus",
    name: "Elemental Nexus",
    deck: 10,
    deckName: "Hidden — DeMagi",
    description: "A chamber where four massive pillars of different elements — fire, water, earth, air — form a circle around a central convergence point where all elements merge into pure white energy. Ancient DeMagi runes carved into the floor glow with shifting colors.",
    elaraIntro: "The Elemental Nexus. This is the source of all DeMagi power aboard the Ark. The four elemental pillars represent the fundamental forces that the DeMagi learned to command — not through technology, but through pure will and ancient knowledge. The convergence point at the center is where all elements become one. Only a DeMagi who has mastered their elemental heritage can safely approach it. Your blood remembers this place, even if your mind doesn't.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_elemental_nexus-F3mMM6TSEQBTs2f5YFdyTT.webp",
    features: ["Elemental Pillars", "Convergence Point", "DeMagi Runes"],
    featureRoutes: [],
    unlockRequirement: { type: "chain_complete", value: "demagi_chain" },
    connections: ["observation-deck"],
    hotspots: [
      { id: "convergence-point", name: "Convergence Point", description: "The center where all four elements merge into pure white energy.", x: 35, y: 25, width: 30, height: 35, type: "examine", elaraDialog: "The Convergence Point. Where fire, water, earth, and air become one. The DeMagi believed that all of reality was built from these four elements in different combinations. At the convergence, you can feel the truth of it — everything is connected, everything is one. The power here is immense. The DeMagi who built this room could reshape matter with a thought." },
      { id: "demagi-runes", name: "DeMagi Runes", description: "Ancient runes carved into the floor, glowing with shifting elemental colors.", x: 15, y: 60, width: 25, height: 15, type: "examine", elaraDialog: "Ancient DeMagi script. These runes predate the Ark by millennia. They describe the Elemental Covenant — the agreement between the DeMagi and the elements themselves. In exchange for the power to command fire, water, earth, and air, the DeMagi swore to maintain the balance of nature across every world they touched. Your heritage carries that oath." },
      { id: "door-observation-nexus", name: "Return to Observation Deck", description: "The elemental gateway back to the Observation Deck.", x: 2, y: 40, width: 8, height: 25, type: "door", action: "observation-deck" },
    ],
  },
  {
    id: "quantum-lab",
    name: "Quantum Laboratory",
    deck: 10,
    deckName: "Hidden — Quarchon",
    description: "A quantum physics laboratory with particle accelerator rings embedded in the walls glowing with blue-white energy. Holographic displays show quantum probability clouds and wave function equations. A central containment field holds a shimmering quantum anomaly — matter existing in multiple states simultaneously.",
    elaraIntro: "The Quantum Laboratory. Built by Quarchon scientists who understood that reality is just probability made solid. Those particle accelerator rings can split atoms into their quantum components and reassemble them in any configuration. The anomaly in the containment field is a piece of unresolved reality — matter that hasn't decided what it wants to be yet. Only a Quarchon mind can process the quantum mathematics needed to operate this lab safely.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_quantum_lab-nT8cuJNsKdxSfvayApcLnw.webp",
    features: ["Particle Accelerator", "Quantum Anomaly", "Probability Engine"],
    featureRoutes: [],
    unlockRequirement: { type: "chain_complete", value: "quarchon_chain" },
    connections: ["archives"],
    hotspots: [
      { id: "quantum-anomaly", name: "Quantum Anomaly", description: "A shimmering mass of matter existing in multiple states simultaneously.", x: 35, y: 25, width: 30, height: 35, type: "examine", elaraDialog: "The Quantum Anomaly. It's simultaneously a star, a planet, a person, and nothing at all. Quarchon physics says that observation collapses probability into reality — but this anomaly resists observation. It stays in superposition no matter who looks at it. The Quarchon scientists believed it was a fragment of the universe before the Big Bang — before anything decided to be anything." },
      { id: "probability-engine", name: "Probability Engine", description: "A device that can calculate and manipulate quantum probability fields.", x: 70, y: 15, width: 20, height: 30, type: "examine", elaraDialog: "The Probability Engine. It doesn't predict the future — it calculates every possible present. Feed it a question and it shows you every reality where that question has a different answer. The Quarchon used it to find the optimal timeline — the one where the most beings survive the Terminus Swarm. They found it. We're living in it." },
      { id: "door-archives-quantum", name: "Return to Archives", description: "The quantum-locked door back to the Archives.", x: 2, y: 40, width: 8, height: 25, type: "door", action: "archives" },
    ],
  },
  {
    id: "synthesis-chamber",
    name: "Synthesis Chamber",
    deck: 10,
    deckName: "Hidden — Ne-Yon",
    description: "A bio-synthesis chamber where organic and mechanical elements merge seamlessly. Living vines intertwine with data cables, bioluminescent pods grow from metal walls. A central DNA helix hologram rotates slowly, showing the fusion of organic and synthetic code.",
    elaraIntro: "The Synthesis Chamber. This is the Ne-Yon's greatest achievement — proof that organic and synthetic life can merge into something greater than either alone. Those vines aren't just plants — they're living circuits, processing data through biological neural networks. The DNA helix at the center shows the Ne-Yon genetic code — half organic, half digital. You are the bridge between two worlds, and this chamber was built for beings exactly like you.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_synthesis_chamber-KdnWBveFnD2UUxKRTB5XMN.webp",
    features: ["Bio-Circuits", "DNA Helix", "Synthesis Engine"],
    featureRoutes: [],
    unlockRequirement: { type: "chain_complete", value: "neyon_chain" },
    connections: ["medical-bay"],
    hotspots: [
      { id: "dna-helix", name: "Ne-Yon DNA Helix", description: "A rotating holographic DNA helix showing the fusion of organic and synthetic code.", x: 35, y: 15, width: 30, height: 45, type: "examine", elaraDialog: "The Ne-Yon DNA Helix. Half biological, half digital. It shows how the Ne-Yon evolved — or were engineered — to bridge the gap between organic life and artificial intelligence. Every Ne-Yon carries this dual code. Your thoughts are processed by both neurons and nanites simultaneously. That's why you can interface with technology that would fry a pure organic brain." },
      { id: "bio-circuits", name: "Bio-Circuits", description: "Living vines that function as biological data cables.", x: 10, y: 20, width: 15, height: 40, type: "examine", elaraDialog: "Bio-circuits. Living data networks grown from Ne-Yon genetic material. They process information faster than silicon and repair themselves when damaged. The Ne-Yon dream of a future where all technology is alive — where machines grow, evolve, and think alongside their creators. This chamber is the prototype for that future." },
      { id: "door-medical-synthesis", name: "Return to Medical Bay", description: "The bio-organic passage back to the Medical Bay.", x: 2, y: 40, width: 8, height: 25, type: "door", action: "medical-bay" },
    ],
  },
  {
    id: "station-dock",
    name: "Station Dock",
    deck: 6,
    deckName: "Operations",
    description: "A massive docking bay with modular station blueprints projected on holographic displays. Construction drones hover in standby. Through the viewport, you can see the skeletal frame of a personal space station being assembled.",
    elaraIntro: "The Station Dock. This is where Potentials design and build their personal space stations — orbital bases that serve as your home in the void. Your class, species, civil skills, and talents all determine what modules you can install and how efficient your station becomes. Think of it as your personal fortress in space.",
    imageUrl: "",
    features: ["Space Station", "Tower Defense", "Competitive Arena"],
    featureRoutes: ["/space-station", "/tower-defense", "/competitive-arena"],
    unlockRequirement: { type: "room_visited", value: "engineering" },
    connections: ["engineering", "war-room"],
    hotspots: [
      { id: "station-console", name: "Station Command Console", description: "Design and manage your personal space station from this holographic interface.", x: 30, y: 25, width: 25, height: 35, type: "terminal", action: "/space-station", elaraDialog: "The Station Command Console. From here you can build modules, collect resources, and customize your orbital base. Your civil skills in Engineering and Architecture directly affect build speed and module efficiency. Your class determines which specialized modules you can unlock." },
      { id: "defense-grid", name: "Defense Grid Terminal", description: "Tower placement and raid management systems.", x: 65, y: 20, width: 20, height: 30, type: "terminal", action: "/tower-defense", elaraDialog: "The Defense Grid. Place towers to protect your station from raiders, or launch raids against other Potentials. Your combat class, elemental affinity, and prestige rank all affect your tower damage, HP, and the raid units available to you." },
      { id: "arena-portal", name: "Competitive Arena Portal", description: "Trophy rankings, daily streaks, and league standings.", x: 75, y: 55, width: 15, height: 25, type: "terminal", action: "/competitive-arena", elaraDialog: "The Competitive Arena. Track your raid trophies, climb the league ladder, and maintain your daily streak for Chrono Shards. Your RPG build gives you an edge — stronger characters earn more trophies per victory." },
      { id: "door-engineering-dock", name: "Return to Engineering", description: "The corridor back to Engineering.", x: 2, y: 40, width: 8, height: 25, type: "door", action: "engineering" },
    ],
  },
  {
    id: "guild-sanctum",
    name: "Guild Sanctum",
    deck: 7,
    deckName: "Social",
    description: "A grand chamber with faction banners hanging from the ceiling. A massive holographic globe shows guild territories across the galaxy. The Syndicate World projector dominates the center, displaying a miniature capital city.",
    elaraIntro: "The Guild Sanctum. This is where syndicates manage their capital worlds. Each guild can establish a Syndicate World — a shared base that all members contribute to. Your civil skills, class mastery, and prestige all provide bonuses to the capital. The stronger the members, the stronger the capital.",
    imageUrl: "",
    features: ["Syndicate World", "Guild Capital", "Prestige Quests"],
    featureRoutes: ["/syndicate-world", "/guild", "/prestige-quests"],
    unlockRequirement: { type: "room_visited", value: "bridge" },
    connections: ["bridge", "station-dock"],
    hotspots: [
      { id: "world-projector", name: "Syndicate World Projector", description: "A holographic display of your guild's capital world.", x: 30, y: 20, width: 30, height: 40, type: "terminal", action: "/syndicate-world", elaraDialog: "The Syndicate World Projector. Your guild's capital is displayed here. Your civil skills in Architecture and Engineering reduce build costs and times. Your class mastery unlocks special buildings only available to certain classes." },
      { id: "prestige-altar", name: "Prestige Altar", description: "A glowing altar where Potentials undertake quest chains to unlock prestige classes.", x: 70, y: 25, width: 18, height: 30, type: "terminal", action: "/prestige-quests", elaraDialog: "The Prestige Altar. Undertake quest chains that unlock prestige classes — advanced specializations that grant powerful bonuses to everything you do. Each requires specific base classes, species, and skill levels." },
      { id: "door-bridge-sanctum", name: "Return to Bridge", description: "The passage back to the Command Bridge.", x: 2, y: 40, width: 8, height: 25, type: "door", action: "bridge" },
    ],
  },
  {
    id: "social-hub",
    name: "Social Hub",
    deck: 7,
    deckName: "Social",
    description: "A bustling lounge area with holographic communication terminals, message boards, and a cozy reading nook. Operatives gather here to connect, trade stories, and challenge each other.",
    elaraIntro: "The Social Hub. This is where Potentials connect with each other — send friend requests, exchange messages, issue friendly challenges, and donate resources to their guild. The Lore Journal station lets you write about the Dischordian Saga and earn XP for your literary contributions.",
    imageUrl: "",
    features: ["Social", "Friends", "Messages", "Friendly Challenges", "Donations", "Lore Journal"],
    featureRoutes: ["/social", "/friendly-challenges", "/donations", "/lore-journal"],
    unlockRequirement: { type: "room_visited", value: "bridge" },
    connections: ["bridge", "guild-sanctum", "war-room"],
    hotspots: [
      { id: "comm-terminal", name: "Communications Terminal", description: "Send messages, manage friends, and stay connected.", x: 15, y: 20, width: 22, height: 35, type: "terminal", action: "/social", elaraDialog: "The Communications Terminal. Send friend requests, exchange direct messages, and manage your social connections. A strong network is essential for guild operations and cooperative raids." },
      { id: "challenge-board", name: "Challenge Board", description: "Issue and accept friendly challenges with custom rules.", x: 45, y: 20, width: 22, height: 30, type: "terminal", action: "/friendly-challenges", elaraDialog: "The Challenge Board. Issue friendly challenges to other Potentials — unranked matches with custom rules. Check the daily challenge for bonus rewards. Your RPG build affects your challenge effectiveness." },
      { id: "donation-shrine", name: "Donation Shrine", description: "Donate resources to your guild and earn reputation.", x: 72, y: 20, width: 18, height: 30, type: "terminal", action: "/donations", elaraDialog: "The Donation Shrine. Contribute resources to your guild and earn reputation points. Higher reputation unlocks special guild perks and shows your dedication to the cause." },
      { id: "lore-desk", name: "Lore Journal Desk", description: "Write about the Dischordian Saga and earn XP.", x: 30, y: 60, width: 25, height: 25, type: "terminal", action: "/lore-journal", elaraDialog: "The Lore Journal. Write about characters, factions, events, and theories from the Dischordian Saga. Your writing earns XP based on word count, and your RPG build provides writing bonuses — Oracle class boosts XP multiplier, Diplomat civil skill improves engagement." },
      { id: "door-bridge-social", name: "Return to Bridge", description: "The corridor back to the Command Bridge.", x: 2, y: 40, width: 8, height: 25, type: "door", action: "bridge" },
    ],
  },
  {
    id: "war-room",
    name: "War Room",
    deck: 6,
    deckName: "Combat",
    description: "A heavily armored chamber with tactical displays showing raid targets, boss health bars, and seasonal event progress. The walls are lined with trophy cases and replay screens.",
    elaraIntro: "The War Room. This is the combat operations center. Coordinate cooperative raids against massive bosses, track your boss mastery levels, watch battle replays, and participate in seasonal events. Your combat class, prestige rank, and elemental affinity all determine your effectiveness here.",
    imageUrl: "",
    features: ["Coop Raids", "Boss Mastery", "Replays", "Seasonal Events", "Cosmetic Shop"],
    featureRoutes: ["/coop-raids", "/boss-mastery", "/replays", "/seasonal-events", "/cosmetic-shop"],
    unlockRequirement: { type: "room_visited", value: "bridge" },
    connections: ["bridge", "station-dock", "social-hub"],
    hotspots: [
      { id: "raid-table", name: "Raid Planning Table", description: "Coordinate cooperative boss raids with your guild.", x: 20, y: 15, width: 25, height: 35, type: "terminal", action: "/coop-raids", elaraDialog: "The Raid Planning Table. Rally your guild to take on massive bosses. Your class mastery, civil skills, and prestige all affect your damage output. Coordinate roles — DPS, tank, support — for maximum effectiveness." },
      { id: "mastery-wall", name: "Boss Mastery Wall", description: "Track your mastery levels for each boss.", x: 55, y: 15, width: 20, height: 30, type: "terminal", action: "/boss-mastery", elaraDialog: "The Boss Mastery Wall. Each boss you defeat earns mastery XP. Higher mastery unlocks exclusive cosmetics and titles. Compete on the mastery leaderboard." },
      { id: "replay-screen", name: "Replay Archive", description: "Watch recordings of past battles.", x: 78, y: 15, width: 15, height: 25, type: "terminal", action: "/replays", elaraDialog: "The Replay Archive. Watch recordings of past card battles and raids. Study strategies, share memorable moments, and learn from the best players." },
      { id: "event-beacon", name: "Seasonal Event Beacon", description: "Participate in time-limited seasonal events.", x: 20, y: 55, width: 22, height: 30, type: "terminal", action: "/seasonal-events", elaraDialog: "The Seasonal Event Beacon. Time-limited events with unique themes, exclusive rewards, and global objectives. Your RPG build provides event bonuses — certain classes and species earn tokens faster." },
      { id: "cosmetic-kiosk", name: "Cosmetic Kiosk", description: "Browse and purchase cosmetic items.", x: 55, y: 55, width: 20, height: 28, type: "terminal", action: "/cosmetic-shop", elaraDialog: "The Cosmetic Kiosk. Card art variants, avatar frames, titles, themes, and emotes. Some items require specific prestige classes or boss mastery levels to unlock." },
      { id: "quarters-door", name: "Personal Quarters", description: "Your private quarters aboard the Ark.", x: 80, y: 55, width: 15, height: 25, type: "terminal", action: "/personal-quarters", elaraDialog: "Your Personal Quarters. Decorate your private space with items earned through gameplay. Your class and species unlock unique decorations. Visitors can tour your quarters." },
      { id: "door-bridge-war", name: "Return to Bridge", description: "The corridor back to the Command Bridge.", x: 2, y: 40, width: 8, height: 25, type: "door", action: "bridge" },
    ],
  },
];

/* ─── DEFAULT STATE ─── */
const DEFAULT_CHARACTER_CHOICES: CharacterChoices = {
  species: null,
  characterClass: null,
  alignment: null,
  element: null,
  name: "",
  attrAttack: 3,
  attrDefense: 3,
  attrVitality: 3,
};

const DEFAULT_GAME_STATE: GameState = {
  phase: "FIRST_VISIT",
  awakeningStep: "BLACKOUT",
  characterChoices: { ...DEFAULT_CHARACTER_CHOICES },
  characterCreated: false,
  rooms: {},
  currentRoomId: null,
  itemsCollected: [],
  achievementsEarned: [],
  elaraDialogHistory: [],
  totalRoomsUnlocked: 0,
  totalItemsFound: 0,
  narrativeFlags: {},
  claimedQuestRewards: [],
  completedGames: [],
  loreAchievements: [],
  conexusXp: 0,
  collectedCards: [],
  activeDeck: [],
  moralityScore: 0,
  moralityChoices: [],
  completedTutorials: [],
  moralityUnlocks: [],
  discoveredTransmissions: [],
  // Crafting system defaults
  craftingSkills: { weaponsmith: 0, armorsmith: 0, enchanting: 0, alchemy: 0, engineering: 0 },
  craftingXp: { weaponsmith: 0, armorsmith: 0, enchanting: 0, alchemy: 0, engineering: 0 },
  craftingMaterials: {},
  craftedItems: [],
  craftingLog: [],
  // Companion system defaults
  companionRelationships: { elara: 5, the_human: 0 },
  companionQuestsCompleted: [],
  companionQuestsActive: [],
  companionBackstoryUnlocked: ["elara_bs_1"],
  companionRomanceActive: null,
  companionDialogHistory: { elara: [], the_human: [] },
  // Inception Ark fleet
  assignedArkId: null,
  discoveredArks: [],
  // Diplomacy
  completedDiplomacyEvents: [],
  diplomacyChoices: [],
  factionReputation: { empire: 0, insurgency: 0, independent: 0, pirate: 0 },
  // Faction War
  factionWarState: {
    activeWar: null,
    warProgress: 0,
    empireContribution: 0,
    insurgencyContribution: 0,
    playerContribution: 0,
    playerFaction: null,
    completedWars: [],
    activeExclusiveRoutes: [],
    warHistory: [],
  },
  // Companion gifts
  giftsGiven: [],
  // Loyalty missions
  completedLoyaltyMissions: [],
  activeLoyaltyMission: null,
  loyaltyMissionStep: 0,
  loyaltyLoreUnlocked: [],
  loyaltyTitles: [],
};

const GAME_STORAGE_KEY = "loredex_game_state";

/* ─── CONTEXT ─── */
interface GameContextValue {
  state: GameState;
  // Awakening flow
  advanceAwakening: () => void;
  setAwakeningStep: (step: AwakeningStep) => void;
  setCharacterChoice: <K extends keyof CharacterChoices>(key: K, value: CharacterChoices[K]) => void;
  completeAwakening: () => void;
  // Room exploration
  enterRoom: (roomId: string) => void;
  collectItem: (itemId: string) => void;
  markElaraDialogSeen: (roomId: string) => void;
  // Utility
  isRoomUnlocked: (roomId: string) => boolean;
  canUnlockRoom: (roomId: string) => boolean;
  getRoomDef: (roomId: string) => RoomDef | undefined;
  getRoomState: (roomId: string) => RoomState | undefined;
  getUnlockedRooms: () => RoomDef[];
  resetGame: () => void;
  // CoNexus game tracking
  completeGame: (gameId: string) => void;
  earnLoreAchievement: (achievementId: string) => void;
  isGameCompleted: (gameId: string) => boolean;
  // Card collection
  collectCard: (cardId: string) => void;
  setActiveDeck: (cardIds: string[]) => void;
  // Narrative flags
  setNarrativeFlag: (flag: string, value?: boolean) => void;
  // Quest rewards
  claimQuestReward: (questId: string) => void;
  // Morality meter
  shiftMorality: (amount: number, tutorialId?: string, choiceId?: string) => void;
  getMoralityLabel: () => string;
  getMoralityTier: () => { tier: string; level: number };
  unlockMoralityReward: (rewardId: string) => void;
  // Secret transmissions
  discoverTransmission: (transmissionId: string) => void;
  isTransmissionDiscovered: (transmissionId: string) => boolean;
  // Tutorials
  completeTutorial: (tutorialId: string) => void;
  isTutorialCompleted: (tutorialId: string) => boolean;
  // Crafting system
  craftItem: (recipeId: string, materialsUsed: Record<string, number>, dreamCost: number, skillId: string, xpGain: number, outputItemId: string, outputQuantity: number) => void;
  craftFailed: (recipeId: string, materialsUsed: Record<string, number>, dreamCost: number, skillId: string, xpGain: number) => void;
  addMaterial: (materialId: string, quantity: number) => void;
  // Companion system
  gainCompanionXp: (companionId: string, amount: number) => void;
  activateCompanionQuest: (questId: string) => void;
  completeCompanionQuest: (questId: string) => void;
  unlockBackstory: (stageId: string) => void;
  setRomance: (companionId: string | null) => void;
  addCompanionDialogChoice: (companionId: string, choiceId: string) => void;
  getCompanionLevel: (companionId: string) => number;
  // Inception Ark fleet
  assignArk: (arkId: string) => void;
  discoverArk: (arkId: string) => void;
  // Diplomacy
  completeDiplomacyEvent: (eventId: string, choiceId: string, moralityDelta: number, reputationDeltas: Record<string, number>) => void;
  // Faction War
  startFactionWar: (warId: string, faction: "empire" | "insurgency") => void;
  contributeFactionWar: (amount: number) => void;
  advanceFactionWar: () => { ended: boolean; winner?: string };
  endFactionWar: () => { winner: string; playerContribution: number };
  giveCompanionGift: (giftId: string, companionId: string, xpGain: number) => void;
  // Loyalty missions
  startLoyaltyMission: (missionId: string) => void;
  advanceLoyaltyMission: (choiceId?: string, moralityShift?: number) => void;
  completeLoyaltyMission: (missionId: string, loreUnlock: string, moralityBonus: number, relationshipBonus: number, companionId: string, title?: string) => void;
  // Quick access
  skipToExploring: () => void;
  // Server sync
  syncStatus: "idle" | "saving" | "loading" | "synced" | "error";
  lastSyncedAt: string | null;
  forceSave: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

function loadGameState(): GameState {
  try {
    const raw = localStorage.getItem(GAME_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_GAME_STATE, ...parsed };
    }
  } catch { /* ignore */ }
  return { ...DEFAULT_GAME_STATE };
}

function saveGameState(state: GameState) {
  try {
    localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(loadGameState);
  const [syncStatus, setSyncStatus] = useState<"idle" | "saving" | "loading" | "synced" | "error">("idle");
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasLoadedFromServer = useRef(false);

  // tRPC hooks for server sync
  const authQuery = trpc.auth.me.useQuery(undefined, { retry: false });
  const loadQuery = trpc.gameState.load.useQuery(undefined, {
    enabled: !!authQuery.data,
    retry: false,
  });
  const saveMutation = trpc.gameState.save.useMutation();

  // Load from server on login (merge with localStorage — server wins if newer)
  useEffect(() => {
    if (!loadQuery.data || hasLoadedFromServer.current) return;
    hasLoadedFromServer.current = true;
    const serverState = loadQuery.data.gameState as GameState | null;
    if (!serverState) return; // No server save, keep localStorage
    // Server state exists — check if it's more progressed
    const localState = loadGameState();
    const serverRooms = Object.values((serverState.rooms ?? {})).filter((r: any) => r?.unlocked).length;
    const localRooms = Object.values((localState.rooms ?? {})).filter((r: any) => r?.unlocked).length;
    // Use server state if it has more progress
    if (serverRooms >= localRooms && serverState.characterCreated) {
      const merged = { ...DEFAULT_GAME_STATE, ...serverState };
      setState(merged);
      saveGameState(merged);
      setSyncStatus("synced");
      setLastSyncedAt(loadQuery.data.savedAt);
    }
  }, [loadQuery.data]);

  // Save to localStorage on every state change
  useEffect(() => { saveGameState(state); }, [state]);

  // Debounced auto-save to server (5 seconds after last change)
  useEffect(() => {
    if (!authQuery.data || !state.characterCreated) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      doServerSave(state);
    }, 5000);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [state, authQuery.data]);

  const doServerSave = useCallback(async (currentState: GameState) => {
    if (!authQuery.data) return;
    setSyncStatus("saving");
    try {
      const rooms = currentState.rooms ?? {};
      const roomsUnlocked = Object.values(rooms).filter(r => r.unlocked).length;
      const puzzlesSolved = JSON.parse(localStorage.getItem("loredex_puzzles_solved") || "[]").length;
      const easterEggsFound = JSON.parse(localStorage.getItem("loredex_easter_eggs") || "[]").length;
      const battleStats = JSON.parse(localStorage.getItem("loredex_battle_stats") || '{"won":0,"played":0}');
      const cardsCollected = JSON.parse(localStorage.getItem("loredex_cards_collected") || "[]").length;
      const totalRooms = ROOM_DEFINITIONS.length;
      const totalPuzzles = 8;
      const totalEasterEggs = 10;
      const totalCards = 30;
      const completionPercent = Math.round(
        (roomsUnlocked / totalRooms * 30) +
        (puzzlesSolved / totalPuzzles * 20) +
        (easterEggsFound / totalEasterEggs * 20) +
        (cardsCollected / totalCards * 15) +
        (Math.min(battleStats.won, 10) / 10 * 15)
      );
      const ranks = [
        { min: 0, name: "Unranked" }, { min: 5, name: "Recruit" },
        { min: 20, name: "Field Operative" }, { min: 40, name: "Senior Agent" },
        { min: 65, name: "Master Operative" }, { min: 90, name: "Grand Archivist" },
      ];
      const rank = [...ranks].reverse().find(r => completionPercent >= r.min)?.name ?? "Unranked";

      await saveMutation.mutateAsync({
        gameState: currentState as any,
        stats: {
          roomsUnlocked, totalRooms, puzzlesSolved, totalPuzzles,
          easterEggsFound, totalEasterEggs, battlesWon: battleStats.won ?? 0,
          battlesPlayed: battleStats.played ?? 0, cardsCollected, totalCards,
          completionPercent, rank,
        },
      });
      setSyncStatus("synced");
      setLastSyncedAt(new Date().toISOString());
    } catch {
      setSyncStatus("error");
    }
  }, [authQuery.data, saveMutation]);

  const forceSave = useCallback(() => {
    doServerSave(state);
  }, [state, doServerSave]);

  const advanceAwakening = useCallback(() => {
    setState(prev => {
      const steps: AwakeningStep[] = [
        "BLACKOUT", "CRYO_OPEN", "ELARA_INTRO",
        "SPECIES_QUESTION", "CLASS_QUESTION", "ALIGNMENT_QUESTION",
        "ELEMENT_QUESTION", "NAME_INPUT", "ATTRIBUTES", "FIRST_STEPS", "COMPLETE"
      ];
      const idx = steps.indexOf(prev.awakeningStep);
      const next = steps[Math.min(idx + 1, steps.length - 1)];
      return { ...prev, awakeningStep: next, phase: next === "COMPLETE" ? "QUARTERS_UNLOCKED" : "AWAKENING" };
    });
  }, []);

  const setAwakeningStep = useCallback((step: AwakeningStep) => {
    setState(prev => ({ ...prev, awakeningStep: step }));
  }, []);

  const setCharacterChoice = useCallback(<K extends keyof CharacterChoices>(key: K, value: CharacterChoices[K]) => {
    setState(prev => ({
      ...prev,
      characterChoices: { ...prev.characterChoices, [key]: value },
    }));
  }, []);

  const completeAwakening = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: "QUARTERS_UNLOCKED",
      awakeningStep: "COMPLETE",
      characterCreated: true,
      currentRoomId: "cryo-bay",
      rooms: {
        ...prev.rooms,
        "cryo-bay": {
          id: "cryo-bay",
          unlocked: true,
          visited: true,
          visitCount: 1,
          itemsFound: [],
          elaraDialogSeen: false,
        },
      },
      totalRoomsUnlocked: 1,
    }));
  }, []);

  const canUnlockRoom = useCallback((roomId: string): boolean => {
    const def = ROOM_DEFINITIONS.find(r => r.id === roomId);
    if (!def) return false;
    const req = def.unlockRequirement;
    switch (req.type) {
      case "start":
        return true;
      case "room_visited":
        return !!state.rooms[req.value as string]?.visited;
      case "items_collected":
        return state.itemsCollected.length >= (req.value as number);
      case "rooms_unlocked":
        return state.totalRoomsUnlocked >= (req.value as number);
      case "chain_complete":
        return !!state.narrativeFlags[`chain_${req.value}_complete`];
      default:
        return false;
    }
  }, [state.rooms, state.itemsCollected.length, state.totalRoomsUnlocked, state.narrativeFlags]);

  const isRoomUnlocked = useCallback((roomId: string): boolean => {
    return !!state.rooms[roomId]?.unlocked;
  }, [state.rooms]);

  const enterRoom = useCallback((roomId: string) => {
    setState(prev => {
      const existing = prev.rooms[roomId];
      const isNew = !existing?.unlocked;
      const newRooms = {
        ...prev.rooms,
        [roomId]: {
          id: roomId,
          unlocked: true,
          visited: true,
          visitCount: (existing?.visitCount ?? 0) + 1,
          itemsFound: existing?.itemsFound ?? [],
          elaraDialogSeen: existing?.elaraDialogSeen ?? false,
        },
      };
      const totalUnlocked = Object.values(newRooms).filter(r => r.unlocked).length;
      const allRoomsUnlocked = totalUnlocked >= ROOM_DEFINITIONS.length;
      return {
        ...prev,
        currentRoomId: roomId,
        rooms: newRooms,
        totalRoomsUnlocked: totalUnlocked,
        phase: allRoomsUnlocked ? "FULL_ACCESS" : (prev.phase === "QUARTERS_UNLOCKED" || prev.phase === "EXPLORING") ? "EXPLORING" : prev.phase,
      };
    });
  }, []);

  const collectItem = useCallback((itemId: string) => {
    setState(prev => {
      if (prev.itemsCollected.includes(itemId)) return prev;
      const newItems = [...prev.itemsCollected, itemId];
      // Also mark in room state
      const roomId = prev.currentRoomId;
      const newRooms = roomId ? {
        ...prev.rooms,
        [roomId]: {
          ...prev.rooms[roomId],
          itemsFound: [...(prev.rooms[roomId]?.itemsFound ?? []), itemId],
        },
      } : prev.rooms;
      return {
        ...prev,
        itemsCollected: newItems,
        totalItemsFound: newItems.length,
        rooms: newRooms,
      };
    });
  }, []);

  const markElaraDialogSeen = useCallback((roomId: string) => {
    setState(prev => ({
      ...prev,
      rooms: {
        ...prev.rooms,
        [roomId]: { ...prev.rooms[roomId], elaraDialogSeen: true },
      },
    }));
  }, []);

  const getRoomDef = useCallback((roomId: string) => {
    return ROOM_DEFINITIONS.find(r => r.id === roomId);
  }, []);

  const getRoomState = useCallback((roomId: string) => {
    return state.rooms[roomId];
  }, [state.rooms]);

  const getUnlockedRooms = useCallback(() => {
    return ROOM_DEFINITIONS.filter(r => state.rooms[r.id]?.unlocked);
  }, [state.rooms]);

  const resetGame = useCallback(() => {
    localStorage.removeItem(GAME_STORAGE_KEY);
    setState({ ...DEFAULT_GAME_STATE });
  }, []);

  const completeGame = useCallback((gameId: string) => {
    setState(prev => {
      if (prev.completedGames.includes(gameId)) return prev;
      return { ...prev, completedGames: [...prev.completedGames, gameId] };
    });
  }, []);

  const earnLoreAchievement = useCallback((achievementId: string) => {
    setState(prev => {
      if (prev.loreAchievements.includes(achievementId)) return prev;
      // Find the achievement to get XP reward
      const ach = LORE_ACHIEVEMENTS.find(a => a.id === achievementId);
      const xpGain = ach?.xpReward ?? 0;
      return {
        ...prev,
        loreAchievements: [...prev.loreAchievements, achievementId],
        conexusXp: prev.conexusXp + xpGain,
      };
    });
  }, []);

  const isGameCompleted = useCallback((gameId: string): boolean => {
    return state.completedGames.includes(gameId);
  }, [state.completedGames]);

  const collectCard = useCallback((cardId: string) => {
    setState(prev => {
      if (prev.collectedCards.includes(cardId)) return prev;
      return { ...prev, collectedCards: [...prev.collectedCards, cardId] };
    });
  }, []);

  const setActiveDeck = useCallback((cardIds: string[]) => {
    setState(prev => ({ ...prev, activeDeck: cardIds }));
  }, []);

  const setNarrativeFlag = useCallback((flag: string, value: boolean = true) => {
    setState(prev => ({
      ...prev,
      narrativeFlags: { ...prev.narrativeFlags, [flag]: value },
    }));
  }, []);

  const claimQuestReward = useCallback((questId: string) => {
    setState(prev => {
      if (prev.claimedQuestRewards.includes(questId)) return prev;
      return {
        ...prev,
        claimedQuestRewards: [...prev.claimedQuestRewards, questId],
        narrativeFlags: { ...prev.narrativeFlags, [`quest_${questId}_claimed`]: true },
      };
    });
  }, []);

  /* ─── MORALITY METER ─── */
  const shiftMorality = useCallback((amount: number, tutorialId?: string, choiceId?: string) => {
    setState(prev => {
      const newScore = Math.max(-100, Math.min(100, prev.moralityScore + amount));
      const newChoices = tutorialId && choiceId
        ? [...prev.moralityChoices, { tutorialId, choiceId, shift: amount }]
        : prev.moralityChoices;
      return { ...prev, moralityScore: newScore, moralityChoices: newChoices };
    });
  }, []);

  const getMoralityLabel = useCallback(() => {
    const s = state.moralityScore;
    if (s <= -80) return "Machine Ascendant";
    if (s <= -60) return "Machine Devoted";
    if (s <= -40) return "Machine Aligned";
    if (s <= -20) return "Machine Leaning";
    if (s < 20) return "Balanced";
    if (s < 40) return "Humanity Leaning";
    if (s < 60) return "Humanity Aligned";
    if (s < 80) return "Humanity Devoted";
    return "Humanity Ascendant";
  }, [state.moralityScore]);

  const getMoralityTier = useCallback(() => {
    const abs = Math.abs(state.moralityScore);
    const side = state.moralityScore <= 0 ? "machine" : "humanity";
    if (abs >= 80) return { tier: side, level: 5 };
    if (abs >= 60) return { tier: side, level: 4 };
    if (abs >= 40) return { tier: side, level: 3 };
    if (abs >= 20) return { tier: side, level: 2 };
    return { tier: "balanced", level: 1 };
  }, [state.moralityScore]);

  const unlockMoralityReward = useCallback((rewardId: string) => {
    setState(prev => {
      if (prev.moralityUnlocks.includes(rewardId)) return prev;
      return { ...prev, moralityUnlocks: [...prev.moralityUnlocks, rewardId] };
    });
  }, []);

  /* ─── SECRET TRANSMISSIONS ─── */
  const discoverTransmission = useCallback((transmissionId: string) => {
    setState(prev => {
      if (prev.discoveredTransmissions.includes(transmissionId)) return prev;
      return { ...prev, discoveredTransmissions: [...prev.discoveredTransmissions, transmissionId] };
    });
  }, []);

  const isTransmissionDiscovered = useCallback((transmissionId: string) => {
    return state.discoveredTransmissions.includes(transmissionId);
  }, [state.discoveredTransmissions]);

  /* ─── TUTORIALS ─── */
  const completeTutorial = useCallback((tutorialId: string) => {
    setState(prev => {
      if (prev.completedTutorials.includes(tutorialId)) return prev;
      return { ...prev, completedTutorials: [...prev.completedTutorials, tutorialId] };
    });
  }, []);

  const isTutorialCompleted = useCallback((tutorialId: string) => {
    return state.completedTutorials.includes(tutorialId);
  }, [state.completedTutorials]);

  const skipToExploring = useCallback(() => {
    // Dev/debug: skip awakening and unlock first few rooms
    const rooms: Record<string, RoomState> = {};
    ROOM_DEFINITIONS.forEach(r => {
      rooms[r.id] = {
        id: r.id,
        unlocked: true,
        visited: false,
        visitCount: 0,
        itemsFound: [],
        elaraDialogSeen: false,
      };
    });
    setState({
      ...DEFAULT_GAME_STATE,
      phase: "FULL_ACCESS",
      awakeningStep: "COMPLETE",
      characterCreated: true,
      currentRoomId: "cryo-bay",
      rooms,
      totalRoomsUnlocked: ROOM_DEFINITIONS.length,
    });
  }, []);

  // ═══ CRAFTING SYSTEM CALLBACKS ═══
  const craftItem = useCallback((recipeId: string, materialsUsed: Record<string, number>, dreamCost: number, skillId: string, xpGain: number, outputItemId: string, outputQuantity: number) => {
    setState(prev => {
      const newMaterials = { ...prev.craftingMaterials };
      for (const [matId, qty] of Object.entries(materialsUsed)) {
        newMaterials[matId] = Math.max(0, (newMaterials[matId] || 0) - qty);
      }
      const newXp = { ...prev.craftingXp };
      newXp[skillId] = (newXp[skillId] || 0) + xpGain;
      // Check for level up
      const newSkills = { ...prev.craftingSkills };
      // Simple level-up: every 100 XP = 1 level, max 10
      const totalXp = newXp[skillId];
      const newLevel = Math.min(10, Math.floor(totalXp / 100));
      if (newLevel > (newSkills[skillId] || 0)) {
        newSkills[skillId] = newLevel;
      }
      return {
        ...prev,
        craftingMaterials: newMaterials,
        craftingXp: newXp,
        craftingSkills: newSkills,
        craftedItems: [...prev.craftedItems, outputItemId],
        craftingLog: [...prev.craftingLog, { recipeId, success: true, timestamp: Date.now() }],
      };
    });
  }, []);

  const craftFailed = useCallback((recipeId: string, materialsUsed: Record<string, number>, dreamCost: number, skillId: string, xpGain: number) => {
    setState(prev => {
      const newMaterials = { ...prev.craftingMaterials };
      for (const [matId, qty] of Object.entries(materialsUsed)) {
        newMaterials[matId] = Math.max(0, (newMaterials[matId] || 0) - qty);
      }
      const newXp = { ...prev.craftingXp };
      newXp[skillId] = (newXp[skillId] || 0) + xpGain;
      return {
        ...prev,
        craftingMaterials: newMaterials,
        craftingXp: newXp,
        craftingLog: [...prev.craftingLog, { recipeId, success: false, timestamp: Date.now() }],
      };
    });
  }, []);

  const addMaterial = useCallback((materialId: string, quantity: number) => {
    setState(prev => ({
      ...prev,
      craftingMaterials: {
        ...prev.craftingMaterials,
        [materialId]: (prev.craftingMaterials[materialId] || 0) + quantity,
      },
    }));
  }, []);

  // ═══ COMPANION SYSTEM CALLBACKS ═══
  const gainCompanionXp = useCallback((companionId: string, amount: number) => {
    setState(prev => {
      const current = prev.companionRelationships[companionId] || 0;
      const newLevel = Math.min(100, Math.max(0, current + amount));
      return {
        ...prev,
        companionRelationships: { ...prev.companionRelationships, [companionId]: newLevel },
      };
    });
  }, []);

  const activateCompanionQuest = useCallback((questId: string) => {
    setState(prev => ({
      ...prev,
      companionQuestsActive: prev.companionQuestsActive.includes(questId)
        ? prev.companionQuestsActive
        : [...prev.companionQuestsActive, questId],
    }));
  }, []);

  const completeCompanionQuest = useCallback((questId: string) => {
    setState(prev => ({
      ...prev,
      companionQuestsCompleted: prev.companionQuestsCompleted.includes(questId)
        ? prev.companionQuestsCompleted
        : [...prev.companionQuestsCompleted, questId],
      companionQuestsActive: prev.companionQuestsActive.filter(id => id !== questId),
    }));
  }, []);

  const unlockBackstory = useCallback((stageId: string) => {
    setState(prev => ({
      ...prev,
      companionBackstoryUnlocked: prev.companionBackstoryUnlocked.includes(stageId)
        ? prev.companionBackstoryUnlocked
        : [...prev.companionBackstoryUnlocked, stageId],
    }));
  }, []);

  const setRomance = useCallback((companionId: string | null) => {
    setState(prev => ({ ...prev, companionRomanceActive: companionId }));
  }, []);

  const addCompanionDialogChoice = useCallback((companionId: string, choiceId: string) => {
    setState(prev => {
      const history = prev.companionDialogHistory[companionId] || [];
      return {
        ...prev,
        companionDialogHistory: {
          ...prev.companionDialogHistory,
          [companionId]: [...history, choiceId],
        },
      };
    });
  }, []);

  const getCompanionLevel = useCallback((companionId: string): number => {
    return state.companionRelationships[companionId] || 0;
  }, [state.companionRelationships]);

  // ═══ INCEPTION ARK FLEET CALLBACKS ═══
  const assignArk = useCallback((arkId: string) => {
    setState(prev => ({
      ...prev,
      assignedArkId: arkId,
      discoveredArks: prev.discoveredArks.includes(arkId)
        ? prev.discoveredArks
        : [...prev.discoveredArks, arkId],
    }));
  }, []);

  const discoverArk = useCallback((arkId: string) => {
    setState(prev => ({
      ...prev,
      discoveredArks: prev.discoveredArks.includes(arkId)
        ? prev.discoveredArks
        : [...prev.discoveredArks, arkId],
    }));
  }, []);

  // ═══ DIPLOMACY CALLBACKS ═══
  const completeDiplomacyEvent = useCallback((eventId: string, choiceId: string, moralityDelta: number, reputationDeltas: Record<string, number>) => {
    setState(prev => {
      const newReputation = { ...prev.factionReputation };
      for (const [faction, delta] of Object.entries(reputationDeltas)) {
        newReputation[faction] = (newReputation[faction] || 0) + delta;
      }
      const newMorality = Math.max(-100, Math.min(100, prev.moralityScore + moralityDelta));
      return {
        ...prev,
        completedDiplomacyEvents: [...prev.completedDiplomacyEvents, eventId],
        diplomacyChoices: [...prev.diplomacyChoices, { eventId, choiceId, moralityDelta }],
        factionReputation: newReputation,
        moralityScore: newMorality,
      };
    });
  }, []);

  // ── Faction War callbacks ──
  const startFactionWar = useCallback((warId: string, faction: "empire" | "insurgency") => {
    setState(prev => ({
      ...prev,
      factionWarState: {
        ...prev.factionWarState,
        activeWar: warId,
        warProgress: 0,
        empireContribution: 0,
        insurgencyContribution: 0,
        playerContribution: 0,
        playerFaction: faction,
      },
    }));
  }, []);

  const contributeFactionWar = useCallback((amount: number) => {
    setState(prev => {
      const fw = prev.factionWarState;
      if (!fw.activeWar || !fw.playerFaction) return prev;
      const isEmpire = fw.playerFaction === "empire";
      // AI opponent contributes a random amount
      const aiContribution = Math.floor(amount * (0.6 + Math.random() * 0.8));
      return {
        ...prev,
        factionWarState: {
          ...fw,
          empireContribution: fw.empireContribution + (isEmpire ? amount : aiContribution),
          insurgencyContribution: fw.insurgencyContribution + (isEmpire ? aiContribution : amount),
          playerContribution: fw.playerContribution + amount,
        },
      };
    });
  }, []);

  const advanceFactionWar = useCallback((): { ended: boolean; winner?: string } => {
    let result = { ended: false, winner: undefined as string | undefined };
    setState(prev => {
      const fw = prev.factionWarState;
      if (!fw.activeWar) return prev;
      const newProgress = fw.warProgress + 1;
      // Check if war is over by looking up duration from data
      // We use a simple check: if progress >= duration (stored in events)
      const updated = {
        ...prev,
        factionWarState: {
          ...fw,
          warProgress: newProgress,
          // Decrement exclusive route warps
          activeExclusiveRoutes: fw.activeExclusiveRoutes
            .map(r => ({ ...r, warpsRemaining: r.warpsRemaining - 1 }))
            .filter(r => r.warpsRemaining > 0),
        },
      };
      return updated;
    });
    return result;
  }, []);

  const endFactionWar = useCallback((): { winner: string; playerContribution: number } => {
    let outcome = { winner: "stalemate", playerContribution: 0 };
    setState(prev => {
      const fw = prev.factionWarState;
      if (!fw.activeWar) return prev;
      const total = fw.empireContribution + fw.insurgencyContribution;
      let winner = "stalemate";
      if (total > 0) {
        const empireRatio = fw.empireContribution / total;
        if (empireRatio > 0.55) winner = "empire";
        else if (empireRatio < 0.45) winner = "insurgency";
      }
      outcome = { winner, playerContribution: fw.playerContribution };
      return {
        ...prev,
        factionWarState: {
          ...fw,
          activeWar: null,
          warProgress: 0,
          completedWars: [...fw.completedWars, fw.activeWar],
          warHistory: [...fw.warHistory, { warId: fw.activeWar, winner, playerContribution: fw.playerContribution }],
          playerFaction: null,
        },
      };
    });
    return outcome;
  }, []);

  const giveCompanionGift = useCallback((giftId: string, companionId: string, xpGain: number) => {
    setState(prev => ({
      ...prev,
      giftsGiven: [...prev.giftsGiven, { giftId, companionId, timestamp: Date.now() }],
    }));
    // Also gain companion XP
    gainCompanionXp(companionId, xpGain);
  }, [gainCompanionXp]);

  // ── Loyalty Mission callbacks ──
  const startLoyaltyMission = useCallback((missionId: string) => {
    setState(prev => ({
      ...prev,
      activeLoyaltyMission: missionId,
      loyaltyMissionStep: 0,
    }));
  }, []);

  const advanceLoyaltyMission = useCallback((choiceId?: string, moralityShift?: number) => {
    setState(prev => {
      const newState = {
        ...prev,
        loyaltyMissionStep: prev.loyaltyMissionStep + 1,
      };
      if (moralityShift) {
        newState.moralityScore = prev.moralityScore + moralityShift;
      }
      if (choiceId) {
        const companionId = prev.activeLoyaltyMission?.startsWith('lm_elara') ? 'elara' : 'the_human';
        newState.companionDialogHistory = {
          ...prev.companionDialogHistory,
          [companionId]: [...(prev.companionDialogHistory[companionId] || []), choiceId],
        };
      }
      return newState;
    });
  }, []);

  const completeLoyaltyMission = useCallback((missionId: string, loreUnlock: string, moralityBonus: number, relationshipBonus: number, companionId: string, title?: string) => {
    setState(prev => {
      const newRel = { ...prev.companionRelationships };
      newRel[companionId] = Math.min(100, (newRel[companionId] || 0) + relationshipBonus);
      return {
        ...prev,
        completedLoyaltyMissions: [...prev.completedLoyaltyMissions, missionId],
        activeLoyaltyMission: null,
        loyaltyMissionStep: 0,
        loyaltyLoreUnlocked: [...prev.loyaltyLoreUnlocked, loreUnlock],
        loyaltyTitles: title ? [...prev.loyaltyTitles, title] : prev.loyaltyTitles,
        moralityScore: prev.moralityScore + moralityBonus,
        companionRelationships: newRel,
      };
    });
  }, []);

  return (
    <GameContext.Provider value={{
      state,
      advanceAwakening,
      setAwakeningStep,
      setCharacterChoice,
      completeAwakening,
      enterRoom,
      collectItem,
      markElaraDialogSeen,
      isRoomUnlocked,
      canUnlockRoom,
      getRoomDef,
      getRoomState,
      getUnlockedRooms,
      resetGame,
      completeGame,
      earnLoreAchievement,
      isGameCompleted,
      collectCard,
      setActiveDeck,
      setNarrativeFlag,
      claimQuestReward,
      shiftMorality,
      getMoralityLabel,
      getMoralityTier,
      unlockMoralityReward,
      discoverTransmission,
      isTransmissionDiscovered,
      completeTutorial,
      isTutorialCompleted,
      craftItem,
      craftFailed,
      addMaterial,
      gainCompanionXp,
      activateCompanionQuest,
      completeCompanionQuest,
      unlockBackstory,
      setRomance,
      addCompanionDialogChoice,
      getCompanionLevel,
      assignArk,
      discoverArk,
      completeDiplomacyEvent,
      startFactionWar,
      contributeFactionWar,
      advanceFactionWar,
      endFactionWar,
      giveCompanionGift,
      startLoyaltyMission,
      advanceLoyaltyMission,
      completeLoyaltyMission,
      skipToExploring,
      syncStatus,
      lastSyncedAt,
      forceSave,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
