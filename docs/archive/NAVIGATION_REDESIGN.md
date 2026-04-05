# Navigation Redesign: Narrative Unlock Chain

## Design Philosophy
Every room unlock must feel like a story beat — Elara restoring systems, finding keycards, 
completing missions, or powering up ship subsystems. No arbitrary counters.

## New Unlock Types
We add a new unlock type: `"narrative_event"` which checks for specific narrative flags.

## Room Unlock Chain (Narrative-Driven)

### Deck 1: Habitation
- **Cryo Bay** → `type: "start"` (unchanged — you wake up here)
- **Medical Bay** → `type: "room_visited", value: "cryo-bay"` (unchanged — adjacent room, door is open)

### Deck 2: Command  
- **Bridge** → `type: "room_visited", value: "cryo-bay"` (unchanged — Elara guides you here)
- **Archives** → `type: "room_visited", value: "bridge"` (unchanged — accessible from bridge)

### Deck 3: Operations (CHANGED from counter-based)
- **Comms Array** → `type: "narrative_event", value: "bridge_systems_restored"`
  - Story: After visiting the Bridge, Elara says "I've managed to reroute power to the Communications Array. The signal boosters are online."
  - Trigger: Set when player completes Act 1 (THE SIGNAL) or interacts with the nav-console on the Bridge

- **Observation Deck** → `type: "items_collected", value: "observation-keycard"`
  - Story: Player finds the Observation Keycard in Medical Bay (already exists as a hotspot item!)
  - This is ALREADY narratively motivated — the keycard is in Medical Bay

### Deck 4: Technical (CHANGED from counter-based)
- **Engineering Bay** → `type: "narrative_event", value: "power_grid_restored"`
  - Story: After visiting Comms Array, Elara detects a power fluctuation. "The reactor diagnostics are coming through now. I can open the blast doors to Engineering."
  - Trigger: Set when player visits comms-array AND has completed the nav-console interaction on Bridge

- **Forge Workshop** → `type: "room_visited", value: "engineering"` 
  - Story: Connected directly to Engineering, blast door opens when you enter Engineering

- **Armory** → `type: "narrative_event", value: "combat_systems_online"`
  - Story: After visiting Engineering, Elara brings combat systems online. "The holographic combat arena is powered up. The Armory's security locks have disengaged."
  - Trigger: Set when player visits engineering AND interacts with reactor-core hotspot

### Deck 5: Logistics (CHANGED from counter-based)
- **Cargo Hold** → `type: "narrative_event", value: "cargo_bay_pressurized"`
  - Story: After visiting Armory, Elara pressurizes the cargo bay. "I've re-pressurized the Cargo Hold. The trading post the first wave set up is still intact."
  - Trigger: Set when player visits armory

### Deck 6: Restricted
- **Captain's Quarters** → `type: "items_collected", value: "captains-master-key"` 
  - Story: Player finds Captain's Master Key on the Bridge (already exists!)
  - Changed from generic "3 items" to specific key item

### Special Rooms (unchanged - already narrative)
- station-dock → room_visited: engineering
- guild-sanctum → room_visited: bridge  
- social-hub → room_visited: bridge
- war-room → room_visited: bridge
- Hidden class/species/alignment rooms → chain_complete (unchanged)

## Implementation Changes

### 1. Update RoomDef.unlockRequirement type
Add `"narrative_event"` and `"specific_item"` to the union type.

### 2. Update canUnlockRoom logic
- `narrative_event`: Check `state.narrativeFlags[value]`
- `specific_item`: Check `state.itemsCollected.includes(value)`

### 3. Auto-set narrative flags
- `bridge_systems_restored`: Set when Act 1 completes OR when nav-console is interacted with
- `power_grid_restored`: Set when comms-array is visited + bridge nav-console done
- `combat_systems_online`: Set when engineering reactor-core is examined
- `cargo_bay_pressurized`: Set when armory is first visited

### 4. Ship Schematic Map
- Replace InceptionArkPage with a proper ship schematic
- Cross-section view of the Ark showing all decks
- Fog-of-war: undiscovered rooms are dark/blurred
- Discovered rooms glow and are clickable for instant fast travel
- Current room highlighted
- Room connections shown as corridors/passages
