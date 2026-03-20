# Progressive Discovery System Design Notes

## Current Architecture
- GameContext manages: phases (FIRST_VISIT → AWAKENING → QUARTERS_UNLOCKED → EXPLORING → FULL_ACCESS)
- 11 rooms with unlock requirements (room_visited, rooms_unlocked, items_collected)
- CommandConsole has SYSTEMS array mapping rooms to feature routes
- useSystemUnlockStatus checks if room is unlocked to show/hide nav items
- Bottom nav shows 5 fixed tabs (Bridge, Saga, Lore, CADES, Store)
- GameGate in App.tsx shows AwakeningPage for FIRST_VISIT/AWAKENING, then full app

## Key Change: Start with Exploration Only
- On first load after awakening, ONLY the Ark Explorer should be accessible
- All other systems (Bridge, Archives, Comms, etc.) start LOCKED
- As player explores rooms in the Ark, they discover systems one by one
- Each room discovery triggers a cinematic unlock notification
- The bottom nav should dynamically show only unlocked systems

## Room → System Unlock Mapping
1. cryo-bay (start) → Ark Explorer always available
2. bridge → COMMAND BRIDGE (Home, Board, Timeline, etc.)
3. archives → ARCHIVES (Search, Codex)
4. comms-array → COMMS ARRAY (Watch, CoNexus)
5. observation-deck → OBSERVATION DECK (Discography, Favorites)
6. armory → ARMORY (Fight, Cards, PvP, etc.)
7. engineering → ENGINEERING BAY (Research Lab, Deck Builder, etc.)
8. cargo-hold → CARGO HOLD (Trade Empire, Store)
9. captains-quarters → CAPTAIN'S QUARTERS (Profile, Trophies, etc.)

## Implementation Plan
1. Modify GameGate to show ONLY Ark Explorer after awakening until bridge is discovered
2. Add a "discovery" event system that fires when a new system is unlocked
3. Create a DiscoveryUnlockOverlay component (cinematic reveal)
4. Modify bottom nav to only show unlocked systems dynamically
5. Routes should redirect to /ark if the system isn't unlocked yet
6. Add a "KOTOR-style" first exploration sequence after awakening
