/* ═══════════════════════════════════════════════════════
   GAME CONTEXT — Inception Ark Adventure State Machine
   Manages awakening flow, room unlocks, exploration state.
   Persists to localStorage, syncs to DB for logged-in users.
   ═══════════════════════════════════════════════════════ */
import { createContext, useContext, useCallback, useEffect, useState, useRef, type ReactNode } from "react";
import { trpc } from "@/lib/trpc";

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
  unlockRequirement: { type: "start" | "room_visited" | "items_collected" | "rooms_unlocked"; value?: string | number };
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
    elaraIntro: "Welcome to the Bridge. This is where the Ark's navigation and command systems are controlled. The Conspiracy Board — our intelligence network mapping every entity, faction, and connection in the Dischordian Saga — is accessible from the main tactical display. The timeline projector can show you the full history of the Ages.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_bridge-g5ANMfUqgxd8ZnPgh9h6nd.webp",
    features: ["Conspiracy Board", "Timeline", "Main Navigation"],
    featureRoutes: ["/board", "/timeline", "/saga-timeline"],
    unlockRequirement: { type: "room_visited", value: "cryo-bay" },
    connections: ["cryo-bay", "archives", "comms-array"],
    hotspots: [
      { id: "tactical-display", name: "Tactical Display", description: "A massive holographic display showing connections between entities, factions, and events.", x: 30, y: 20, width: 25, height: 40, type: "terminal", action: "/board", elaraDialog: "The Conspiracy Board. Every entity, every faction, every connection we've mapped in the Dischordian Saga. It's a web of alliances, betrayals, and secrets. The more you explore, the more connections you'll uncover." },
      { id: "timeline-projector", name: "Timeline Projector", description: "A holographic projector showing the Ages of the Dischordian Saga.", x: 65, y: 25, width: 18, height: 35, type: "terminal", action: "/saga-timeline", elaraDialog: "The Timeline Projector. It maps the entire history of the Dischordian Saga across the Ages — from the Age of Privacy through the Fall of Reality and beyond. Each era tells a different chapter of the story." },
      { id: "captains-chair", name: "Captain's Chair", description: "The command chair sits empty. A personal data pad is wedged in the armrest.", x: 45, y: 55, width: 12, height: 20, type: "examine", elaraDialog: "The Captain's chair. Captain Voss was the last to sit here. She ordered the emergency cryo protocol before... before whatever happened. Her personal log might still be in the armrest terminal." },
      { id: "nav-console", name: "Navigation Console", description: "Star charts and route calculations. The Ark's current position is unknown.", x: 10, y: 40, width: 15, height: 25, type: "examine", elaraDialog: "The navigation console. I've been trying to determine our position but... the star charts don't match any known configuration. Either we've drifted very far, or the stars themselves have changed." },
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
    features: ["Watch The Saga", "Radio", "Transmissions"],
    featureRoutes: ["/watch"],
    unlockRequirement: { type: "rooms_unlocked", value: 3 },
    connections: ["bridge", "observation-deck"],
    hotspots: [
      { id: "broadcast-screen", name: "Broadcast Screen", description: "A large screen playing recorded episodes of the Dischordian Saga.", x: 30, y: 20, width: 25, height: 40, type: "terminal", action: "/watch", elaraDialog: "The broadcast system. It plays the recorded history of the Dischordian Saga in episodic format. Each epoch covers a different era — from the Age of Privacy through the Fall of Reality. Watch carefully. There are clues hidden in every episode." },
      { id: "radio-console", name: "Radio Console", description: "A radio tuner picking up fragments of music from across the multiverse.", x: 65, y: 35, width: 18, height: 30, type: "examine", elaraDialog: "The radio picks up fragments of music transmissions. Songs from Malkia Ukweli and the Panopticon — they seem to broadcast across dimensional barriers. Each song tells part of the story." },
      { id: "static-screen", name: "Static Screen", description: "A screen showing nothing but static. Occasionally, shapes seem to form in the noise.", x: 10, y: 30, width: 12, height: 25, type: "examine", elaraDialog: "That screen has been showing static since I can remember. But sometimes... sometimes I think I see patterns in it. Faces. Words. It's probably just signal degradation. Probably." },
      { id: "door-bridge", name: "Bridge Corridor", description: "Return to the Command Bridge.", x: 2, y: 20, width: 10, height: 50, type: "door", action: "bridge" },
      { id: "door-observation", name: "Observation Deck", description: "A passage to the Observation Deck.", x: 88, y: 20, width: 10, height: 50, type: "door", action: "observation-deck" },
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
    features: ["Card Crafting", "Research Lab", "Fusion"],
    featureRoutes: ["/research-lab"],
    unlockRequirement: { type: "rooms_unlocked", value: 5 },
    connections: ["observation-deck", "armory"],
    hotspots: [
      { id: "crafting-bench", name: "Crafting Workbench", description: "A workbench with tools for card crafting and fusion experiments.", x: 25, y: 45, width: 20, height: 30, type: "terminal", action: "/research-lab", elaraDialog: "The crafting workbench. Here you can fuse cards together to create more powerful versions. The recipes were developed by the Ark's engineers — combine the right elements and you might create something legendary." },
      { id: "reactor-core", name: "Reactor Core", description: "The Ark's main power source. It pulses with an otherworldly blue light.", x: 45, y: 15, width: 15, height: 40, type: "examine", elaraDialog: "The reactor core. It runs on a substance the engineers called 'Dream' — a crystallized form of quantum consciousness. It's the same resource that powers your abilities. The core is running at 34% capacity. We're losing power slowly." },
      { id: "blueprints", name: "Holographic Blueprints", description: "Floating schematics showing card designs and weapon systems.", x: 65, y: 30, width: 18, height: 25, type: "examine", elaraDialog: "Card schematics. The engineers were designing new card types before... before they stopped. Some of these designs are brilliant. Legendary-tier cards that could turn the tide of any battle." },
      { id: "door-observation", name: "Observation Deck", description: "Return to the Observation Deck.", x: 2, y: 20, width: 10, height: 50, type: "door", action: "observation-deck" },
      { id: "door-armory", name: "Armory Access", description: "A reinforced door leading to the Armory.", x: 88, y: 20, width: 10, height: 50, type: "door", action: "armory" },
      { id: "egg-eng-formula", name: "Etched Formula", description: "A mathematical formula scratched into the reactor housing.", x: 38, y: 58, width: 4, height: 4, type: "examine", elaraDialog: "Someone etched a formula into the reactor housing. It's a dimensional resonance equation — the kind used to calculate jumps between parallel universes. But there's an extra variable I've never seen: Ψ-null. The null consciousness coefficient. This formula could theoretically open a door to... nowhere. The space between spaces. Where the Source dwells." },
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
    features: ["Combat Sim", "Card Game Battles", "Lore Quiz"],
    featureRoutes: ["/fight", "/cards/play", "/quiz"],
    unlockRequirement: { type: "rooms_unlocked", value: 6 },
    connections: ["engineering", "cargo-hold"],
    hotspots: [
      { id: "combat-arena", name: "Combat Arena", description: "A holographic combat simulation arena for training.", x: 30, y: 30, width: 25, height: 35, type: "terminal", action: "/fight", elaraDialog: "The combat arena. Step inside and I'll generate holographic opponents based on known entities from the Dischordian Saga. It's the safest way to test your abilities... relatively safe." },
      { id: "card-battle-station", name: "Card Battle Station", description: "A tactical display for card game warfare.", x: 65, y: 25, width: 18, height: 30, type: "terminal", action: "/battle", elaraDialog: "The card battle station. Here you can engage in strategic card warfare — deploying your deck against AI opponents or other Potentials. Every victory earns you rewards and moves you closer to understanding the true nature of the conflict." },
      { id: "weapon-rack", name: "Weapon Rack", description: "Futuristic weapons behind locked glass cases.", x: 8, y: 20, width: 12, height: 45, type: "examine", elaraDialog: "The weapon racks. Plasma swords, energy shields, cloaking devices... most are locked behind security glass. You'll need to prove yourself in combat before I can authorize access to the heavier ordnance." },
      { id: "quiz-terminal", name: "Knowledge Terminal", description: "A terminal that tests your knowledge of the Dischordian lore.", x: 85, y: 50, width: 12, height: 20, type: "terminal", action: "/quiz", elaraDialog: "The Knowledge Terminal. It tests your understanding of the Dischordian Saga. Answer correctly and you'll earn rewards. Get them wrong and... well, there are no penalties. But I'll be disappointed." },
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
    elaraIntro: "The Cargo Hold. This is where the Ark's supplies are stored — and where the Trade Wars game is run. The trading post was set up by the first wave of Potentials before they left. You can trade resources, buy and sell goods, and compete in the interstellar trade simulation.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_cargo_hold-U6wJuiqP3pgzQHUKscNpi6.webp",
    features: ["Trade Wars", "Store", "Market"],
    featureRoutes: ["/trade-wars", "/store"],
    unlockRequirement: { type: "rooms_unlocked", value: 7 },
    connections: ["armory", "captains-quarters"],
    hotspots: [
      { id: "trade-terminal", name: "Trade Wars Terminal", description: "The main terminal for the interstellar trade simulation.", x: 65, y: 35, width: 20, height: 30, type: "terminal", action: "/trade-wars", elaraDialog: "Trade Wars. An interstellar trade simulation based on the actual trade routes of the Dischordian universe. Buy low, sell high, avoid pirates, and build your trading empire. The credits you earn here are real — they can be spent in the store." },
      { id: "store-counter", name: "Requisitions Counter", description: "A trading post where you can buy items with Dream tokens and credits.", x: 25, y: 40, width: 18, height: 28, type: "terminal", action: "/store", elaraDialog: "The Requisitions Counter. You can spend your Dream tokens and credits here on upgrades, card packs, cosmetics, and more. Some items are only available through the store." },
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
    features: ["Achievements", "Trophy Room", "Deck Builder"],
    featureRoutes: ["/trophy", "/deck-builder"],
    unlockRequirement: { type: "items_collected", value: 3 },
    connections: ["cargo-hold"],
    hotspots: [
      { id: "trophy-wall", name: "Trophy Wall", description: "A holographic display showing your achievements and collected trophies.", x: 8, y: 15, width: 20, height: 45, type: "terminal", action: "/trophy", elaraDialog: "The Trophy Wall. Every achievement you've earned, every milestone you've reached. Captain Voss believed that recognition drives excellence. She was right." },
      { id: "deck-builder", name: "Strategic Table", description: "A large table with holographic card projections for deck building.", x: 45, y: 40, width: 22, height: 30, type: "terminal", action: "/deck-builder", elaraDialog: "The Strategic Table. Captain Voss used this to plan battle formations. Now you can use it to build and refine your card decks. A well-built deck is the difference between victory and oblivion." },
      { id: "encrypted-terminal", name: "Encrypted Terminal", description: "The captain's personal terminal. 'ACCESS DENIED' flashes on screen.", x: 15, y: 55, width: 14, height: 20, type: "examine", elaraDialog: "Captain Voss's personal terminal. It's encrypted with a cipher I can't crack. Whatever she was hiding... she didn't want anyone to find it. Not even me." },
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
      default:
        return false;
    }
  }, [state.rooms, state.itemsCollected.length, state.totalRoomsUnlocked]);

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
