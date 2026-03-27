# Inception Ark Adventure — Game Design Document

## Core Concept
The entire Loredex OS experience is reframed as a point-and-click adventure game. You are a **Potential** — one of the last beings to awaken from cryogenic sleep aboard an Inception Ark. The ship's AI, **Elara**, guides you through your awakening and helps you explore the vessel. Every feature of the app maps to a physical location on the ship.

## Narrative Framework
- You are aboard Inception Ark **Vessel 1047** (or player-named)
- The first wave of Potentials (Season 1) awakened long ago — they are gone
- All inter-Ark communications have been severed across the multiverse
- Something is wrong with the ship — systems are failing, rooms are locked
- As you explore, you uncover the history of the Dischordian Saga
- Horror sci-fi tone: isolation, flickering lights, mysterious sounds, dread

## Game State Machine

```
FIRST_VISIT → AWAKENING → QUARTERS_UNLOCKED → EXPLORING → FULL_ACCESS
```

### States:
1. **FIRST_VISIT**: No game state exists. Route to Awakening.
2. **AWAKENING**: Cryo pod scene. Elara dialog. Character creation through narrative questions.
3. **QUARTERS_UNLOCKED**: Player has created character. Can explore Quarters room. Tutorial continues.
4. **EXPLORING**: Player is discovering rooms. Some locked, some unlocked. Core gameplay loop.
5. **FULL_ACCESS**: All rooms unlocked. Player can freely navigate. Quick-access sidebar active.

## Room-to-Feature Mapping

| Room | Deck | Features | Unlock Condition |
|------|------|----------|-----------------|
| Cryo Bay (Quarters) | Deck 1 - Habitation | Character Sheet, Settings, Profile | Start (Awakening) |
| Medical Bay | Deck 1 - Habitation | Citizen Stats, Upgrades, Dream Balance | After Awakening |
| Mess Hall | Deck 1 - Habitation | Favorites, Playlists, Social Features | Explore Quarters |
| Bridge | Deck 2 - Command | Conspiracy Board, Timeline, Main Nav | Restore power (achievement) |
| Archives | Deck 2 - Command | Search, Entity Browser, Codex Library | Access Bridge terminal |
| Comms Array | Deck 3 - Operations | Watch (The Saga), Radio, Transmissions | Repair comms relay |
| Observation Deck | Deck 3 - Operations | Discography, Music Player, Lyrics | Find observation key |
| Engineering Bay | Deck 4 - Technical | Card Crafting, Research Lab, Fusion | Fix engineering console |
| Armory | Deck 4 - Technical | Fight Game, Card Game Battles | Power up weapons grid |
| Cargo Hold | Deck 5 - Logistics | Trade Wars, Store, Market | Unlock cargo doors |
| Hangar Bay | Deck 5 - Logistics | Inception Ark Map, Deck Builder | Restore hangar systems |
| Captain's Quarters | Deck 6 - Restricted | Achievements, Trophy Room, Lore Quiz | Collect 5 key items |

## The Awakening Sequence (First-Time Experience)

### Scene 1: Cryo Pod
- Black screen. Heartbeat sound. Slow fade in.
- Frost on screen edges. Cryo pod glass cracking.
- Text appears letter by letter: "EMERGENCY REVIVAL PROTOCOL INITIATED"
- Elara's voice (text): "Don't try to move yet. Your neural pathways are still re-establishing. The cryogenic process is... imperfect. Give yourself a moment."

### Scene 2: Elara Introduction
- Elara appears as holographic projection (portrait with long black hair)
- "I am Elara, the ship's intelligence. You've been in cryogenic suspension for... I can't determine how long. My chronometers are damaged."
- "You are aboard Inception Ark Vessel 1047. You are a Potential."
- "The others... the first wave... they're gone. I don't know where."

### Scene 3: Character Creation (Narrative Questions)
Elara asks questions that map to character creation choices:

**Species (Race):**
- "Your neural patterns are unusual. I'm detecting [traces of ancient code / quantum fluctuations / hybrid signatures]. What do you remember about your origin?"
  - "I remember the machine lattice, the digital realm..." → DeMagi
  - "I remember the quantum storms, the probability fields..." → Quarchon  
  - "I remember both... fragments of everything..." → Ne-Yon

**Class:**
- "Your skill matrices are partially intact. What comes naturally to you?"
  - "I can see the code behind reality..." → Engineer
  - "I sense things before they happen..." → Oracle
  - "I move through shadows unseen..." → Assassin
  - "I was built for war..." → Soldier
  - "I observe. I learn. I adapt..." → Spy

**Alignment:**
- "There's a fundamental question every Potential must answer. The Architect built the Panopticon to impose order. The Dreamer believed in the chaos of free will. Where do you stand?"
  - "Order. Structure. Control." → Order
  - "Freedom. Chaos. Choice." → Chaos

**Element:**
- Based on species, present 2-3 element choices with lore flavor

### Scene 4: First Steps
- Character created. Initial card deck assigned.
- "Your quarters are through that door. The rest of the ship... I'll need your help to restore power to the other decks."
- Player enters Quarters room (first point-and-click scene)

## Point-and-Click Engine

### Room Scene Structure
Each room is a full-screen scene with:
- **Backdrop**: AI-generated nano banana art (dark sci-fi, detailed, atmospheric)
- **Hotspots**: Clickable areas highlighted on hover (subtle glow)
- **Items**: Collectible objects that trigger events or unlock things
- **Terminals**: Interactive screens that open the actual app feature
- **Doors**: Transitions to connected rooms
- **Elara**: Can be summoned for context about any room/item

### Interaction Model
- Click on hotspot → Context menu appears (Examine / Use / Talk to Elara about)
- "Examine" gives lore text and description
- "Use" activates the feature or picks up item
- "Talk to Elara" triggers Elara dialog about that specific thing

### Room Navigation
- Doors at edges of scene lead to connected rooms
- Transition: fade to black → loading → fade in new room
- Locked doors show: "DECK [X] — POWER OFFLINE" with red light
- Unlocked doors show green light and room name

## Achievement System

### Categories:
- **Explorer**: Discover rooms, find hidden items
- **Scholar**: Read codex entries, search entities, complete lore quiz
- **Warrior**: Win fights, card battles, trade wars combat
- **Collector**: Collect cards, craft items, build decks
- **Pioneer**: Complete story epochs, watch saga episodes
- **Architect/Dreamer**: Alignment-specific achievements

### Achievement Rewards:
- Titles (displayed on character sheet)
- Bonus cards for card game
- Cosmetic room decorations
- Dream token bonuses
- Hidden lore entries in Codex

## Quick Access (Post-Unlock)
Once a room is unlocked:
- Appears in the ship's NAV COMPUTER (replaces sidebar)
- Organized by Deck
- Shows room icon + name + feature summary
- Click to instantly travel to that room
- Minimap in corner shows ship layout with your position

## Horror Sci-Fi Atmosphere
- Ambient sounds: ship creaking, distant alarms, ventilation hum
- Flickering lights in damaged areas
- Mysterious log entries found in rooms (crew disappeared)
- Elara occasionally glitches (foreshadowing)
- Some rooms have signs of struggle or hasty evacuation
- The deeper you go, the more unsettling it becomes
