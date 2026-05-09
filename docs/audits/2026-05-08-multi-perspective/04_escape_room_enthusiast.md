# Escape Room Designer — Audit

## Persona briefing

I am a veteran escape room designer with 40+ builds at The Escape Game, specializing in multi-room narrative chains and environmental state progression. I evaluate experiences against four criteria: (1) **sequencing** — does puzzle A's solution unlock puzzle B?; (2) **spatial transformation** — do rooms physically change after each step?; (3) **inventory grammar** — are item combinations meaningful and multi-use?; and (4) **the wall of strings** — can players see all threads simultaneously to spot cross-room conspiracies? I approach games like The Crystal Maze or *Escape from the Room* that force players to hold 20 pieces of string in their head and spot the pattern themselves. Dischordian Saga is a narrative-first point-and-click adventure built on the Inception Ark — it trades real-time pressure for deep story archaeology. This audit asks: does the game *feel* sequenced even when it isn't time-gated?

## Files audited

**Puzzle system & core logic:**
- `apps/client/src/components/PuzzleSystem.tsx` (all 8 puzzle types + answers, lines 40–127)
- `apps/client/src/game/adventureFeatures.ts` (6 inventory combinations, 7 room state changes, 3 puzzle chains, lines 16–298)

**Room mystery catalog & sample modules:**
- `apps/shared/roomMysteries/index.ts` (registry: 26 rooms + 6 species-exclusive, lines 67–102)
- `apps/shared/roomMysteries/bridge.ts` (sample 1: 7 hotspots, 4-tier lore tree, 1,800+ lines of narration)
- `apps/shared/roomMysteries/archives.ts` (sample 2: 6 hotspots, combine-rule uncorruption, Shadow Tongue threads)
- `apps/shared/roomMysteries/medicalBay.ts` (sample 3: 6 hotspots, mystery-binding to Jericho arc)

**Game state & UI:**
- `apps/client/src/contexts/GameContext.tsx` (state machine, RoomState, visitCount tracking, narrativeFlags)
- `apps/client/src/pages/ArkExplorerPage.tsx` (room renderer, verb-coin interface, hotspot dispatch, lines 1–100)
- `apps/client/src/components/ClueJournal.tsx` (flat clue list post-PR #510, no investigation board, lines 1–120)
- `apps/client/src/pages/LoredexGraphPage.tsx` (1-hop graph viewer, 233 entities, binary discovery state)

**Lore reference:**
- `docs/built/LORE_BIBLE.md` (15,013 lines; sample: Darren Fessler entry references cross-room rescue paradox, no sequencing layers)

**Inventory scan:**
- 34 room mystery modules (total 9,129 lines); skimmed naming patterns: all follow `{roomName}Mystery` template; no explicit inter-room dependency declarations.

## Findings

### 1. Puzzle Types Are Isolated; No Sequencing Lock
- **Severity:** P0
- **Where:** `PuzzleSystem.tsx:39–127` (ROOM_PUZZLES registry)
- **What's wrong:** Eight puzzle types (riddle, keycard, sequence, cipher, power_relay) are solved independently. The Bridge power_relay puzzle (lines 418–540) requires the ARK-1047 binary designation, but that designation is revealed as a *discovery* in the Cryo Bay (`adventureFeatures.ts:57`), not a *gated* puzzle. There is no orchestration layer that prevents the player from skipping to Bridge before Cryo Bay is explored. Solved puzzles unlock rooms, but the room-unlock graph is flat — Bridge unlocks when visited (`GameContext.tsx`), not when the prerequisite mystery is solved.
- **Why it matters to this persona:** In The Escape Game's *Incarceration* (a 4-room chain), Room 1's final lock is literally keyed by Room 2's solution artifact (a 3-digit code from a timer puzzle). The player cannot proceed until they've executed Room 2's logic in the correct sequence. Dischordian Saga has *opportunity* for this (Bridge needs the designation, but it's soft-gated). The lock is currently social/narrative, not mechanical.
- **Recommended fix:** Create a `PuzzlePrerequisite` interface in `PuzzleSystem.tsx:16–36`. Add `prerequisites: { clueId: string; roomId: string }[]` to the Puzzle interface. In `RoomMysteryRegistry`, export a function `getPuzzleUnlockState(roomId, flags, cluesFound)` that returns `{ canAttempt: bool; blockingClueId?: string }`. In `ArkExplorerPage.tsx:685–691`, gate the puzzle-modal render on unlock state; show a tooltip naming the blocking clue.

### 2. Room State Changes Are Authored But Never Visually Applied
- **Severity:** P0
- **Where:** `adventureFeatures.ts:181–193` (ROOM_STATE_CHANGES array + getRoomStateChanges function)
- **What's wrong:** Seven room-state transformations are *declared* (Medical Bay quarantine lighting, Archives text rewriting, Bridge bloodstain appearance, Observation Deck terminus signal, etc.) but are not wired to the room renderer. The function `getRoomStateChanges(roomId, flags)` returns the changes, but `ArkExplorerPage.tsx` never calls it. The Bridge Conspiracy Board's blank pin (`bridge.ts:42–130`) carries 4 tiers of narration describing Elara's progressive understanding — a beautiful *narrative* progression — but the visual of the board does not change. After solving a puzzle or completing a chain, the room looks identical.
- **Why it matters to this persona:** In *Return of the Rib* (Escape Game LA), the finale room's walls were physically repainted by staff between runs to reflect player choices in Act 1. The player's *last* visit felt archaeologically heavy because the space had changed. Here, the space is static. The Ark feels like a museum of the crime, not the crime scene itself.
- **Recommended fix:** Create `apps/client/src/game/roomVisualState.ts` exporting `applyRoomStateOverlay(roomId, flags): RoomVisualState`. Integrate into `ParallaxRoom` or `ArkExplorerPage:ParallaxRoom` (line 73). For Bridge, wire the conspiracy board's SVG layer to re-render its pins based on tier. For Medical Bay, conditionally apply a `<div className="quarantine-overlay" />` with red pulsing borders (CSS in place, just needs conditional render).

### 3. Inventory Combinations Are 1-to-1; No Multi-Use Chains
- **Severity:** P1
- **Where:** `adventureFeatures.ts:32–69` (INVENTORY_COMBINATIONS: 6 items, each consumed once)
- **What's wrong:** Each combination is used exactly once in the sequence. Decoder ring + cipher key → master decoder (used at Cipher Den, presumably). Drained power cell + energy shard → charged power cell (used at Medical Bay safe, per the hotspot definition on line 128). But there's no scenario where mastering the decoder *unlocks* a second puzzle that requires the power cell. The puzzle chains (lines 250–286) have dependencies (e.g., "Terminus Signal" step 3 combines items, then step 4 uses the result), but the inventory grammar is shallow — combine, use, done. There's no "use item A on hotspot B to create reagent, then combine reagent with item C to unlock hotspot D" triple-chain.
- **Why it matters to this persona:** Monkey Island's puzzle logic is canonical: "use inventory slot 1 + slot 2 to make item 3, then use item 3 on puzzle 4 to reveal item 5, then use item 5 + puzzle 6's output to trigger the finale." Dischordian Saga's combinations are single-step instruments. They're *elegant*, but they're not *deep*.
- **Recommended fix:** Define `InventoryChain` interface: `{ steps: { input: { itemA, itemB }; output: string; unlocksHotspot: string }[] }`. Redesign Terminus Signal chain: antenna fragment + amplifier circuit → signal booster (step 3); use signal booster on receiver → hear Terminus singer (step 4); harvest new item "terminus_cipher" from receiver; combine terminus_cipher + antiquarian shard (found elsewhere) → temporal_lens (step 5). Each step gates the next. Update `combineInventory()` in `_template.ts` to log multi-step clues.

### 4. ClueJournal Is Flat; No Cross-Room Investigation Surface
- **Severity:** P0
- **Where:** `ClueJournal.tsx:1–120` (getAllAuthoredClues returns deduplicated array; no relationships)
- **What's wrong:** The Clue Journal displays a flat list of discoveries with no threading. The Bridge hotspot "tactical-display" (`bridge.ts:42–130`) has a three-tier narrative about the blank pin and the violet thread to ELARA-SYS. That's a single hotspot's deep lore. But there's no UI surface that says: "Blank pin (Bridge) → violet thread (Bridge) → ELARA-SYS tag (Bridge) *AND* Elara's self-locked folders (Archives:data-banks, lines 74–78) *AND* the Shadow Tongue edit history (Archives, lines 95–100) *ALL POINT TO THE SAME CONSPIRACY.* Clicking any one threads you to the others." The ClueJournal is a searchable database, not a conspiracy board.
- **Why it matters to this persona:** The Crystal Maze's "TEAM TROPHY ROOM" wall showed all completed puzzles in real-time. Contestants could *see* the shape of their progress. Dischordian Saga's Loredex graph (`LoredexGraphPage.tsx:1–100`) is a 1-hop neighborhood viewer — click entity A, see its 1-hop neighbours. But it's not a "wall of strings" pinning suspects to crimes. There's no evidence-corkboard UI that says: "These 4 clues all reference the Shadow Tongue. These 3 clue the Kael conspiracy. Click to see the thread."
- **Recommended fix:** Create `apps/client/src/components/InvestigationBoard.tsx`. Data model: `ThreadLink = { clues: ClueId[]; title: string; description: string; roomIds: string[] }`. Populate from `bridge.ts` + `archives.ts` + `cryoBayMystery` tiers. Render as a canvas-based string-diagram (SVG or Three.js) with clues as nodes, threads as edges. In ClueJournal, add an "Investigations" tab (currently missing per PR #510 notes). Display threads as collapsible groups. Allow pinning/unpinning. Effort estimate: 160 hours (design + SVG layout engine + state sync).

### 5. Puzzle Chains Exist But Are Not Visually Tracked
- **Severity:** P1
- **Where:** `adventureFeatures.ts:250–298` (PUZZLE_CHAINS: 3 chains, 5 steps each; getActivePuzzleChains returns currentStep)
- **What's wrong:** The Dr. Vox Mystery, Terminus Signal, and Pod Zero chains are mechanically authored — flags trigger, steps unlock rewards. But there's no UI that shows the player "You are 3/5 steps through the Dr. Vox chain" or "Vox chain step 4 waiting: Read Dr. Vox's log in Archives." The `getActivePuzzleChains` function exists (line 288) but is never called from the ClueJournal render. No breadcrumb, no progress bar, no "next step hint." The chains are *playable* but not *visible*.
- **Why it matters to this persona:** The Escape Game uses "progress counters" in multi-room chains: "Code piece 1/3 collected" shown on a HUD. Players need to know they're making progress toward *something*, even if they don't know what yet. Dischordian Saga's chains are invisible scaffolding.
- **Recommended fix:** Export `getActivePuzzleChains` from `adventureFeatures.ts`. In `ClueJournal.tsx:18`, call it with `state.narrativeFlags`. Add a "Active Chains" section above the flat clue list. For each chain, render: `Chain Name | Step X/Y | Next Step: {description} | Location: {roomId}`. Add a tooltip showing which clues feed into the current step.

### 6. Room Hotspots Have No Explicit Cross-Room Dependencies
- **Severity:** P1
- **Where:** `roomMysteries/_template.ts` (RoomMysteryModule type) and all 26 modules
- **What's wrong:** Each room's hotspots are self-contained. Bridge's Conspiracy Board narration references "the blank pin" and "three threads" — internal to Bridge. But nowhere in `bridge.ts` does it declare: "This hotspot's tier-3 unlock depends on the player having discovered `clue-archives-self-locked` from Archives." The tier system (`roomTier.ts`, mentioned in `bridge.ts:10–17`) gates progression on flags, but flags are global booleans, not explicit cross-room clue dependencies. If a player skips Archives entirely, they can still unlock Bridge tier 3 — the flag will just be false, and the narration will be the fallback.
- **Why it matters to this persona:** In a well-designed escape chain, Room 2's *hint system* depends on Room 1's discovery. "You haven't visited the Cryo Bay yet, so I can't explain why the designation matters" — that's a design choice. Dischordian Saga doesn't make that choice. Every room is autonomous.
- **Recommended fix:** Add `dependsOnClues?: { clueId: string; otherRoomId: string }[]` to the Clue interface in `_template.ts`. In `bridge.ts:69–130`, annotate tier-2 and tier-3 narration: `dependsOnClues: [{ clueId: 'clue-archives-self-locked', otherRoomId: 'archives' }]`. In `resolveVerbResponse()`, check if dependencies are satisfied; if not, emit a "You need more context" narration variant.

### 7. Discover State Is Binary; No Progression Gates
- **Severity:** P2
- **Where:** `GameContext.tsx` (discoveredIds: Set<string>, narrative state)
- **What's wrong:** Clues and entities are discovered (in set) or undiscovered (not in set). There's no "partially understood" state. A player finds the decoder ring at Cryo Bay (discovery logged) but hasn't visited Cipher Den yet (where it's used). The game doesn't gate the ring's tooltip — it just shows the full name immediately. In The Escape Game's *Fort Boyard*, discovering an artifact shows a silhouette first, then the name after touch, then the full description after examination. Dischordian Saga jumps to the full description on first discovery.
- **Why it matters to this persona:** The *teasing* of information creates narrative tension. If a player finds an object labeled only "???" and must visit another room to learn what it is, they're more motivated to make the cross-room journey.
- **Recommended fix:** Change discoveredIds from `Set<string>` to `Map<string, DiscoveryTier>` where `DiscoveryTier = 'silhouette' | 'name' | 'details'`. Advance tiers on: first look (silhouette), examine (name), second visit to same room (details). In hotspot rendering (`VerbCoin`, line 94), show progressively-revealed text.

### 8. Room Visit Tracking Exists But Is Unused by Narrative
- **Severity:** P2
- **Where:** `GameContext.tsx:65–77` (RoomState interface, visitCount: number)
- **What's wrong:** Every room tracks how many times the player has visited (`visitCount`). But no room's mystery module (`bridge.ts`, `archives.ts`, `medicalBay.ts`, etc.) branches on visit count. The narrative is the same on visit 1 and visit 10. A well-designed room — especially one with a murder mystery (Kael's theft, Vox's death) — should have "second visit" narration that assumes the player knows the stakes now. "Welcome back. You know what Kael did this time." Instead, every visit plays the same tape.
- **Why it matters to this persona:** *Return of the Rib* had "veteran player" narration — if you returned to the finale after solving it once, the NPCs acknowledged your expertise. That deepens the replay value. Dischordian Saga's rooms are stateless from a narrative perspective.
- **Recommended fix:** Add `visitCount` to the context passed into `resolveVerbResponse()` in `_template.ts`. In each hotspot's narration object, add optional `tiers: { requiredVisitCount: number; narration: ElaraNarration }[]`. In `bridge.ts`, add: `{ requiredVisitCount: 2, narration: { lucid: "You've been here before. The blank pin is still blank. But your eyes are getting sharper..." } }`.

## Cross-perspective overlap

(filled in during AUDIT_15_TRACKER.md aggregation)

## The 3 sequenced chains I'd build

### Chain 1: The Vox Culpability Arc
*Current code:* `PUZZLE_CHAINS[0]` (Dr. Vox Mystery, lines 251–262)

**Steps:**
1. **Cryo Bay** → find decoder ring in locker (hotspot, line 117 of `adventureFeatures.ts`)
2. **Medical Bay** → examine emergency safe (hotspot, line 125); use charged power cell to unlock hidden compartment with Vox's personal log
3. **Archives** → examine data-banks (hotspot, lines 65–100 of `archives.ts`); discover Elara's self-locked folders and the access logs showing two simultaneous users (one of them in the Shadow Tongue's unreadable color)
4. **Bridge** → look at the Conspiracy Board's blank pin (tier 1, lines 42–56); advance to tier 2 when the violet thread linking the suspect to Elara is visible (lines 69–100); advance to tier 3 when the player realizes the pin is inscribed but unreadable
5. **Medical Bay** → talk to The Source (NPC); learn that Dr. Vox ordered the cryo-pod emergency cut *herself* — she killed the previous occupant to hide evidence

**Which rooms:** Cryo Bay → Medical Bay → Archives → Bridge → back to Medical Bay (5 room traversals, forcing revisits)

**Lock mechanism per step:**
- Step 1 → 2: hotspot discovery (no gate; chains should be *optional*)
- Step 2 → 3: inventory consumption (charged power cell spent; rewards flag `vox_step_3` + clue `clue-vox-death-consent`)
- Step 3 → 4: clue dependency (Archives self-locked clue must be in journal before Bridge tier 2 narration surfaces; optional, but strongly hinted)
- Step 4 → 5: narrative gate (player must have visited Bridge tier 3 before The Source's dialog unlocks; currently missing this check)

**Room visual changes:**
- Medical Bay: after `vox_step_3`, the emergency safe's broken biometric scanner glows green (unlock symbol)
- Archives: after `shadow_tongue_evidence` flag, text on the data-banks screens visibly rewrites itself in real-time (CSS animation)
- Bridge: after `elara_on_the_board` flag, the violet thread glows faintly under UV (overlay glow)

**File ownership:**
- *Currently:* `adventureFeatures.ts` owns steps 1–3; `bridge.ts` owns step 4; `medicalBay.ts` owns step 5
- *Should be:* Create `apps/shared/puzzleChainOrchestrator.ts` exporting `resolvePuzzleChainProgression(roomId, verb, flags, cluesFound)` → returns `{ nextFlag: string; unlocksNarration?: VerbResponse }`. Bridge and Medical Bay would reference this to conditionally surface their dialogue tiers.

### Chain 2: The Pod Zero Resurrection
*Current code:* `PUZZLE_CHAINS[2]` (Pod Zero, lines 276–284)

**Steps:**
1. **Cryo Bay** → examine control panel (hotspot, line 104 of `adventureFeatures.ts`); secondary display reveals Pod 0's impossible designation (247-year continuous operation)
2. **Bridge** → ask Elara about Pod 0 ("she doesn't know"); her refusal to engage is the clue that something is hidden even from her
3. **Comms Array** → ask The Human about Pod 0; he reveals Pod 0 is a stasis pod for someone Elara was programmed to protect, even at the cost of her own integrity
4. **Cryo Bay** → use the enhanced medkit on Pod 0; the pod releases its occupant — a pre-Fall consciousness, not one of the 247-year sleepers
5. **Medical Bay** → examine the autopsy console; recognize the released consciousness's neural signature as matching the access logs from the Archives (the second user in the unreadable color)

**Which rooms:** Cryo Bay → Bridge → Comms Array → Cryo Bay → Medical Bay (5 traversals; Cryo Bay revisited)

**Lock mechanism per step:**
- Step 1 → 2: flag gate (`pod0_step_1` must be set before Bridge NPC dialog responds to Pod 0 questions)
- Step 2 → 3: NPC dialog unlock (The Human only discusses Pod 0 *after* Elara has been asked and deflected; currently missing this precedent check)
- Step 3 → 4: inventory consumption (enhanced medkit consumed; requires both basic medkit + neural stim to have been combined earlier in the session)
- Step 4 → 5: cross-room clue gate (`pod0_step_4` flag + `archives_self_locked` clue must both be true before the autopsy console surfaces the neural-signature match)

**Room visual changes:**
- Cryo Bay: Pod 0's pod casing illuminates after step 1; after step 4, the pod is empty and the biometric scanner shows a release timestamp
- Medical Bay: after `pod_0_opened`, the autopsy console's holo-display cycles through a new patient profile (the pre-Fall consciousness)
- Bridge: (no direct change, but Elara's companion reactions shift from evasive to confessional after step 5)

**File ownership:**
- *Currently:* scattered across `cryoBayMystery`, `bridge.ts`, `commsArray.ts`, `medicalBay.ts`
- *Should be:* `puzzleChainOrchestrator.ts` orchestrates the prerequisite checks; each room's module surfaces conditional narration/hotspots based on query.

### Chain 3: The Terminus Conspiracy (Cross-Room Meta-Puzzle)
*Current code:* `PUZZLE_CHAINS[1]` (Terminus Signal, lines 263–274)

**Steps:**
1. **Engineering** → find antenna fragment (hotspot discovery)
2. **Armory** → find amplifier circuit (hotspot discovery); *during hotspot examine, narration hints that military-grade amplifiers are "for broadcasting commands over vast distances"* — a semantic trap (the player assumes it's for outbound, not inbound)
3. **Combine items** → signal booster created (inventory combination, line 54); Elara's comment: "This could amplify Agent Zero's signal. Or The Human's. Be careful whose voice you make louder." — *dual-use foreshadowing*
4. **Comms Array** → use signal booster on the long-range receiver (hotspot line 160); hear the singing from Terminus; flag `terminus_singer_found` set
5. **Observation Deck** → (new hotspot, unlocked by step 4) look at the viewport; the signal is now visible as a faint light; *secondary step:* use the temporal viewing lens (created earlier from antiquarian shard + void crystal) to see the *source* of the signal — and it's not Terminus. It's the Ark itself, broadcasting backwards through time.

**Which rooms:** Engineering → Armory → Cryo Bay (to combine, or anywhere with inventory UI) → Comms Array → Observation Deck (5 rooms, no revisits except optional)

**Lock mechanism per step:**
- Step 1 → 2: hotspot discovery (no gate)
- Step 2 → 3: inventory consumption (antenna + amplifier consumed; generates `signal_booster` *and* flags `terminus_step_3`)
- Step 3 → 4: hotspot use-item gate (can only use signal_booster on comms array receiver after the combination; currently, the hotspot definition line 160 doesn't check for the item)
- Step 4 → 5: room unlock + hotspot reveal (Observation Deck hotspot "viewport" only surfaces after `terminus_singer_found`)
- Step 5 (optional) → meta-resolution: temporal lens reveals the full conspiracy (the Ark is the source; Kael is piloting it; The Human is the original broadcaster)

**Room visual changes:**
- Engineering: after step 2, the equipment racks hum audibly (audio cue, no visual)
- Comms Array: after step 4, the receiver dish *visibly* swivels to point at a new sky coordinate; red pulsing light from the receiver
- Observation Deck: after step 4, the viewport shows a faint star; after step 5 (temporal lens), the star becomes an outline of the Ark itself

**File ownership:**
- *Currently:* scattered; no centralized precedent checking
- *Should be:* Create `apps/shared/terminalLore.ts` (new) exporting `resolveCrossRoomMetaPuzzle(roomId, cluesFound, itemsCollected)` → returns `{ narrationVariant: string; unlocksRoom?: string; unlocksHotspot?: string }`. Comms Array and Observation Deck modules would query this before surfacing their hotspots.

## The "wall of strings" UI I want

**Vision:**

Players arrive at the **Investigation Board** (new page: `/ark/investigation`) after collecting 3+ clues linking multiple rooms. The board renders a canvas-based conspiracy diagram: 26 node-types (Cryo Bay, Bridge, Archives, Comms Array, etc.), each pinned as a hexagon. Clues float as rectangular evidence cards; threads (colored yarn) connect clues to rooms and clues to clues. The player can click a clue (`clue-bridge-unfinished-threads`) and the board highlights all rooms and other clues in its conspiracy chain (violet threads: Elara connections; red threads: Kael conspiracy; blue threads: Pod Zero; green threads: Terminus signal). Uncollected clues appear as fogged silhouettes, creating a "find the missing evidence" meta-puzzle. The board surfaces dynamic hints: "You've found 7/11 clues in the Kael thread. Visit [room name] to find the next piece." The Loredex graph (current entity-relationship viewer) becomes a *narrative genealogy* — show how Kael → The Human → Elara → The Programmer form a chain of agency — rendering that as a layered hierarchy rather than a flat 1-hop circle.

**Data model:**
```ts
Thread = {
  id: string;
  title: string;           // "Kael Conspiracy", "Pod Zero Mystery"
  color: string;           // red, violet, blue, etc.
  clues: ClueId[];
  rooms: RoomId[];
  description: string;     // narrative summary
  isResolved: boolean;     // player can mark threads as "solved"
}
```

Queries:
- `getThreadsForClue(clueId)` → `Thread[]` (which conspiracies is this clue part of?)
- `getUnlockedThreads(discoveredIds)` → `Thread[]` (threads with ≥1 clue discovered)
- `getCompletionPercentage(threadId, discoveredIds)` → number (7/11 clues found)

**Rendering:** SVG + D3.js or Babylon.js for 3D string-physics (yarn falls and settles). Hover a clue, all connected threads glow. Click a thread, filter the board to show only that thread. "Print board" option exports as PDF for player note-taking.

**Integration:** Link from ClueJournal's new "Investigations" tab (PR #510 follow-up). Persist thread-pinning state to localStorage. Award an achievement for completing a thread *without* hints.

**Effort estimate:**
- Data model + API: 20 hours
- Thread extraction from `roomMysteries` (annotate each module with its thread IDs): 40 hours
- SVG layout engine (deterministic, not force-directed, for performance): 60 hours
- React component + state sync: 40 hours
- **Total: 160 hours** (1 senior engineer, 4 weeks). Quick MVP (2D, no physics): 80 hours.

**Final assessment:** Dischordian Saga has the *raw material* of a masterful narrative escape — three sequenced chains, 34 mystery modules, 578 lore relationships, 6 inventory combinations. The bones are there. But the *sequence* is narrative (clues reference clues) rather than *mechanical* (puzzles gate puzzles), and the *visualization* of that sequence is missing. A player can complete the game without ever understanding that the Dr. Vox chain and the Terminus Signal chain and the Pod Zero revelation are three threads of the same conspiracy. The game *shows* them to the player (through careful narration), but it doesn't let them *see* it (through a wall of strings they can rearrange). That's not a failure — it's a design choice — but it's a choice that favors *guided narrative* over *player discovery*. If the goal is to make players feel like detectives assembling a case, the investigation board is essential. If the goal is to make them feel like readers turning pages, it's optional. Either way, the audit suggests the architecture exists to support it.
