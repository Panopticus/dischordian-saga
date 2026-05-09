# ARG Participant — Audit

## Persona briefing

I've watched the Incumbent flip coins on 4chan, followed breadcrumbs across abandoned geocities URLs during *Year Zero*, decoded blinking-eye steg images in *I Love Bees*, and got lost in labyrinths of public DNS records hunting *Cicada 3301*. I know the difference between a live experience (a scheduled drop that hits your phone at 02:47 UTC with a coordinate pair) and a narrative flourish (a locked door in a game that never opens because opening it would break the story). The Dischordian Saga sits exactly at that boundary — and the codebase reveals why: it chose the furnishing, not the affordance.

## Files audited

**Mystery Engine & Seed System:**
- `apps/shared/mysteryTypes.ts` (5 seed sources at lines 66–71; zero external gates)
- `apps/shared/roomMysteries/index.ts` (27-room registry; 100% compile-time closed)
- `apps/shared/roomMysteries/antiquarianLibrary.ts` (sealed letters at lines 136–583; narrative texture only)
- `apps/shared/roomMysteries/cipherDen.ts` (rosetta-pad translation at lines 45–150; hardcoded answers)
- `apps/shared/roomMysteries/orderTribunal.ts` (tribunal bench with sealed contract at lines 62–126)

**Variant & Gate Resolution:**
- `apps/shared/moralityTrustActVariants.ts` (variant resolver surfaces: room/transmission/npc_line/journal/wheel_followup; lines 49–49; no calendar-trigger support)

**Event & Cron Infrastructure:**
- `apps/shared/seasonalEvents.ts` (7 event definitions, "fall_of_reality" anniversary at lines 250–384; static durationDays only)
- `apps/server/services/mysteryClosureCron.ts` (epoch vote closure at lines 113–167; deterministic: expiresAt <= now, no external signal)
- `apps/server/_core/index.ts` (5-min season-tick interval; wall-clock bound only, no outside webhooks)

**Transmissions & Broadcasts:**
- `apps/shared/transmissions.ts` (unlock triggers: awakening_step / chapter_complete / level / trust / morality / flag / room_visited / loredex_discovered / always; lines 28–38; none are external-calendar gated)

**Room Mysteries (sealed object inventory):**
- `apps/shared/roomMysteries/antiquarianLibrary.ts`:
  - Degen's letter to the saga (line 569: `"degen.e5.degens_letter_to_the_saga"`)
  - Seer's DO-NOT-PLAY tape (line 230: `"seer.e1.do_not_play_band"`)
  - Seer's undelivered letter to Vex (line 465: `"seer.e4.seers_letter_to_vex"`)
  - Seer's consultation note (line 239: `"seer.e1.vox_consultation_note"`)

## Findings

**1. Zero External Trigger Surfaces — P0 ARG Blocker**
- **Where:** `apps/shared/mysteryTypes.ts:66–71` + `apps/server/services/mysteryClosureCron.ts:113–167`
- **What's wrong:** The five mystery seed sources (epoch_vote_closure, anniversary, living_universe_pattern, npc_arc, manual) all compile deterministically at boot. Vote closure is wall-clock only (`expiresAt <= now`); no variant entry, transmission trigger, or room hotspot has a calendar gate. This is a closed system.
- **Why it matters to this persona:** In Year Zero and Cicada, the live experience requires **external levers**: a Twitter post that's not on the game server, a specific time of day that doesn't live in a cron config, a coordinate pair that arrived over email. You cannot fake those from inside the app. Dischordian's cron fires when the wall-clock permits; nothing outside the codebase can trigger a drop.
- **Recommended fix:** Add a TransmissionTrigger variant `{ kind: "external_webhook"; webhookId: string; }` (`apps/shared/transmissions.ts:28–38`). Build `apps/server/routers/externalSignals.ts` with a POST `/signal/:webhookId` endpoint that fires a mystery seed (`seedFromExternalSignal`) and broadcasts the mystery + transmission to all active players. Gate the variant resolver on the signal's arrival timestamp, not on a pre-compiled seed.

**2. Sealed Letters Are Narrative, Not Mechanical — P1 Immersion Debt**
- **Where:** `apps/shared/roomMysteries/antiquarianLibrary.ts:136–243` (locked vault), `488–582` (Coda shelf), `589–665` (Velkraal folio)
- **What's wrong:** The "sealed" objects (Seer's DO-NOT-PLAY tape, Degen's letter, Seer's undelivered letter to Vex) are all surfaced unconditionally by mystery bindings (lines 227–230, 464–468, 562–565). They are never locked behind a player action. The word "sealed" and the hesitant narration ("we are not yet ready to read this") are texture. The player cannot prevent the opening.
- **Why it matters to this persona:** In a real ARG, a sealed object is a mechanical surface: a puzzle that requires an external key (a keycode posted on Twitter, a passphrase from a podcast episode). The player can hold the object forever without the key. Here, Elara's narration performs the hesitation the game engine doesn't enforce. It's a *literary* seal, not a *gameplay* seal.
- **Recommended fix:** Create an `UnlockGate` schema (`apps/shared/unsealing.ts`) with gate kinds: `"external_signal"`, `"time_window"`, `"player_choice"`, `"npc_relationship_threshold"`. Modify `clueEntry.foundIn` to accept an optional `gateId`. When a mystery binding tries to surface a clue from a sealed object, check the gate before credit. Surface a variant that describes the seal's condition (open / locked / warming-up) to the player.

**3. Mysteries Compile at Boot, Never Regenerate — P2 Design Fragility**
- **Where:** `apps/server/services/mysteryRegistryBootstrap.ts` (referenced in mysteryService.ts) + `apps/shared/mysteryTemplates.ts`
- **What's wrong:** All five mystery seed types flow through `mysteryTemplates.ts::compileMysterySeed`, which is deterministic. Once a mystery definition is compiled and registered, it is static. No runtime re-roll, no player-influenced variant path. The cron closes votes on a fixed wall-clock; the definition that emerges is always the same for a given vote outcome.
- **Why it matters to this persona:** In Cicada, puzzle solutions shifted if you had insider knowledge (a Discord server hint, a podcast mention). The live experience responded to **player coordination**. Dischordian's mysteries are pre-authored trees with no real branches. The variant system (`moralityTrustActVariants.ts`) overlays *narration*, not *outcome*.
- **Recommended fix:** Extend `MysteryDefinition` to carry optional `playerInfluenceGates: { gateId: string; branch: MysteryDefinition }[]`. When a mystery closes, let the variant resolver choose between branches based on the player's morality + trust state at close time. This makes the mystery outcome *discoverable* rather than *predetermined*.

**4. Transmissions Never Arrive "Live" — All Unlock Triggers Are Replay-Safe — P2 Presence Illusion**
- **Where:** `apps/shared/transmissions.ts:28–38`; `apps/client/src/components/TransmissionDeck.tsx` (referenced, not read)
- **What's wrong:** All TransmissionTrigger kinds (awakening_step, chapter_complete, level, trust, morality, flag, room_visited, loredex_discovered, always) resolve at the time the player checks the inbox. No transmission has a "broadcast at 14:00 UTC on X date" trigger. The client's TransmissionDeck is a replay surface; nothing about it is time-sensitive or coordinated.
- **Why it matters to this persona:** A real ARG transmission lands when *the ARG says it lands* — 02:47 UTC, or "when you've decoded the cipher," or "when someone posts the next breadcrumb." You can't watch the whole season in a weekend. Dischordian offers the full transcript whenever you load the Transmission page. It's a **museum, not a broadcast**.
- **Recommended fix:** Add TransmissionTrigger `{ kind: "scheduled_broadcast"; broadcasterTime: Date; timezone: "UTC"; }`. At broadcast time, run a server-side emission pass (`apps/server/services/transmissionBroadcaster.ts`) that sends real-time notifications to eligible players via WebSocket (`apps/server/transmissionWs.ts`). Log the broadcast as a saga-wide event in a broadcasts table, making it historically queryable. The transmission becomes a *moment* rather than a *resource*.

**5. "Fall of Reality" Anniversary Is Duration-Gated, Not Date-Gated — P1 Missed Cadence**
- **Where:** `apps/shared/seasonalEvents.ts:251–384` (fall_of_reality event; durationDays: 21 at line 258)
- **What's wrong:** The anniversary event is defined with `durationDays=21`, not with an anchor date. The event activates when a server-side clock rolls it live (presumably via `getActiveEvents` at line 494), but the codebase contains no reference to an `absoluteStartDate` or `anniversaryDate` field. The event window is floating.
- **Why it matters to this persona:** An anniversary event without a fixed calendar date is not an anniversary — it's a timer. A real ARG marks *the day* with themed content: Twitter takeovers, coordinated ARG media drops, a 48-hour window. You can miss it. Dischordian's Fall of Reality can start on any Tuesday and last 21 days. It's unfixed; it has no **cultural resonance date** that binds the player community.
- **Recommended fix:** Add `anniversaryDate: { month: number; day: number; year?: number; }` to `SeasonalEventDef`. In `getActiveEvents`, check if currentTime falls within `(anniversaryDate, anniversaryDate + durationDays)`. For the Fall of Reality, set to `{ month: 5, day: 8 }` (assuming a saga-canon date). Broadcast a global "X-year anniversary" notification 48 hours before the window opens. Log the event as a Ledger entry that persists across seasons.

**6. Variant Resolver Has No Calendar Support — P1 Time-Gated Content Stranded**
- **Where:** `apps/shared/moralityTrustActVariants.ts:42–67` (MoralityTrustActVariant interface; no timeWindowStart/timeWindowEnd fields)
- **What's wrong:** The variant interface supports morality, trust, act, and required flags — but not time windows. A variant cannot say "show this text only between X date and Y date." All variants are either "always true" or "never true" from a temporal standpoint.
- **Why it matters to this persona:** In Year Zero, certain Easter eggs were only visible during a 72-hour window. In Cicada, hints rotated on a schedule. Dischordian has no way to gate a variant on "this room's overlay narration only shows during the Degen's audit" or "this transmission only surfaces if the player is present when the fall anniversary passes." The game cannot *schedule* a reveal.
- **Recommended fix:** Add optional `timeWindow?: { startsAt: Date; endsAt: Date; }` to `MoralityTrustActVariant`. In `resolveVariant` (`moralityTrustActVariants.ts` ~line 96+), add a time-band specificity check (`score += 1` if timeWindow is bound). This allows writers to author "audit-week variants" and "anniversary narration" without hard-coding dates in the narrative prose.

**7. No Player-Coordination Surface for ARG Campaigns — P2 Community Infrastructure Missing**
- **Where:** No `apps/shared/communityChannels.ts` or `apps/server/routers/investigation.ts` exists (grep returned nothing)
- **What's wrong:** The codebase contains no "Investigation Board," "Shared Evidence Thread," "Theory Whiteboard," or any surface where players can coordinate discoveries. The mystery evidence system (`PlayerEvidenceRecord` in `mysteryTypes.ts:271–285`) is per-player, per-clue, isolated. There is no registry of which clues the global community has found.
- **Why it matters to this persona:** Year Zero's livestream viewers collaborated in a shared Google Doc. Cicada's solvers posted solutions on 4chan and Reddit. Bees players had a LiveJournal community. The ARG *is the coordination*. Dischordian Saga has no channel for "has anyone found X yet?" or "player 2843 found this clue; has it appeared elsewhere?" without leaving the app.
- **Recommended fix:** Create `apps/shared/investigationBoard.ts` with `CommunityClueDiscovery` (`clueId`, `firstFoundBy: userId`, `foundCount`, `firstFoundAt`, `discoveryStatus: "rare" | "common" | "global"`), and `apps/server/routers/communityInvestigation.ts` with GET `/investigation/clue-status/:clueId`. Emit WebSocket events when a clue reaches "global discovery" milestone (found by 10+ players). Surface a "Global Discoveries" section in the Clue Journal UI showing which arcs' evidence the community has unlocked.

**8. Hardcoded Puzzle Answers Are Immutable — P1 Replayability Tax**
- **Where:** `apps/client/src/components/PuzzleSystem.tsx` (referenced in brief, not read; answers live in puzzle definitions scattered across `apps/shared/puzzles/`)
- **What's wrong:** Any puzzle whose answer is authored as a literal string in the codebase (e.g., rosetta-pad's cipher key, the editor's 400 substitution patterns) cannot change between seasons or playthroughs. The cipherDen's dictionary-of-edits (`cipherDen.ts:254–355`) lists the editor's vocabulary; once a player has read it, the "puzzle" of learning the editor's methods is solved forever. A second playthrough offers zero discovery.
- **Why it matters to this persona:** In Cicada, solvers had to share techniques *live* because the puzzle reset if you closed the page or came back next week. The solution space was not a static tree; it was a moving target. Dischordian's solutions are canonical prose: "The dictionary holds his vocabulary. Not what he edited — how he edits. Reading it for any length of time gives me a working knowledge of his method..." (`cipherDen.ts:262`). The puzzle *is telling you the answer while you're reading it*.
- **Recommended fix:** Split puzzle content into `authoredNarration` (unchanging flavor text) and `solveState` (per-player, per-season). For the dictionary-of-edits, generate the 400 substitution patterns via a Seeded PRNG (seed = seasonId + editorId). Each season, the editor's vocabulary shifts slightly. First-time players still see the narrative; veteran players see new patterns. The puzzle becomes a *skill check* rather than a *story cutscene*.

## Cross-perspective overlap

(filled in during AUDIT_15_TRACKER.md aggregation)

## The first ARG drop I'd schedule

**Trigger:** The Fall of Reality anniversary, anchored to the saga's in-game canonical date: **5.8** (May 8th, the exact day Dischordian Saga began its live playthrough in-universe, per `seasonalEvents.ts:254`). Schedule a 21-day event window: May 8 – May 28.

**The cross-media payload:**
- **48 hours before (May 6 @ 14:00 UTC):** The Antiquarian's Twitter account (not yet created; would be `@TheAntiquarian_Ark`) posts a single image — a hand-written journal page in Archive serif, dated "Millennia Before the Fall," with the line: "When the Archive remembers a world before the Fall, all timelines align. Are you ready to witness what was *not* recorded?" No hashtag. Link to the game's Transmission page.
- **May 8 @ 02:47 UTC (exact sync to the game's "Fall" event start):** A "TRANSMISSION INCOMING" notification hits every active player simultaneously. The Meme broadcasts "The Fall of Reality — Anniversary Witness" (Epoch 1.5, new episode), a 12-minute video reconstructing the original 47-second Panopticon blackout in real time. The video is watched *live*; players who check later see a 48-hour replay window, then it archives.
- **May 8 @ 06:00 UTC (4 hours later):** The Antiquarian's lock-vault hotspot in `antiquarianLibrary.ts` surfaces *only during this 72-hour window*: a new "reality-fragments" hotspot that unlocks the Seer's lost recording of the pre-Fall moment. The recording is 3 minutes of pure static with one recognizable voice: Lyra Vox, counting down from 47 seconds. Players coordinate in a new Discord thread to decode the countdown.

**How it lands inside the app:**
- The transmission unlock is gated by `{ kind: "scheduled_broadcast"; broadcasterTime: new Date("2025-05-08T02:47:00Z"); timezone: "UTC"; }` (`apps/shared/transmissions.ts`, new trigger kind).
- The hotspot surfaces via a new gate type: `{ kind: "time_window"; startsAt: 2025-05-08T00:00Z; endsAt: 2025-05-11T00:00Z; }` in `unsealing.ts`.
- The season's **fall_of_reality** event activates at the same moment, dropping a global objective: "Recover the Seer's final countdown." Players earn "Reality Shards" by participating in the live Transmission decode.

**What player-coordination surface emerges:**
- A new **Anniversary Investigation Board** (`apps/server/routers/communityInvestigation.ts`) goes live at event start, showing:
  - Global transcript of the Seer's countdown (crowdsourced, updated as players decode it live)
  - A "Theories" thread where players post what the 47 seconds *means* (why that number? why that moment?)
  - A milestone tracker: "When 1,000 players have watched the transmission, the next clue drops." (This creates urgency; the clue only appears if the community hits a threshold.)
- A **Ledger entry** is auto-created: "Fall of Reality Commemoration (Season 2027)" with the date, the player count, the top theories, and a thank-you from the in-game Antiquarian.

## 3 sealed objects I'd weaponize

### (a) The Seer's DO-NOT-PLAY Tape (Antiquarian Library, locked-vault hotspot)

**Current state:** `antiquarianLibrary.ts:211–243`, "use" verb at line 212. Surfaces unconditionally as `seer.e1.do_not_play_band` when the Seer mystery is active. The band has been replaced by every reader; the seal is discipline, not force.

**Real-world signal that would unseal it:** A cryptic audio file (the "tape recording") gets posted to a real SoundCloud account (fictional: `@SeerVault`) exactly 4 days after the Fall of Reality broadcast. The audio is 8 seconds of white noise overlaid with a voice whisper: "The tape plays when the reader chooses. But choose quickly. The archive is listening." No other context. Players who find the SoundCloud post and play the audio get a ONE-TIME unlock code (a 32-character hex string visible in the video description for 72 hours only). They enter the code in a new "Tape Authenticity" form in the Antiquarian Library UI.

**The file that owns the seal text today:** `apps/shared/roomMysteries/antiquarianLibrary.ts:211–243` (the locked-vault "use" narration describes Seer's sealed tape as object state).

**The registry/seed that would gate the unseal:** Create `apps/shared/tapeAuthenticity.ts` with an `UnlockCode` registry (`codeId`, `expiresAt`, `clueUnlocks: string[]`). Add a new MoralityTrustActVariant `"seer_tape_unlocked"` that triggers ONLY after the code is validated. The variant changes the tape's appearance from "sealed with DO-NOT-PLAY band" to "DO-NOT-PLAY band replaced by YOU, reader 47829. The tape is ready. Choose whether to play." At that point, a **new transmission** becomes available: "Seer's Final Recording (Epoch 1.x)" — unlocked only by players who validated the code.

### (b) Degen's Letter to the Saga (Antiquarian Library, Coda-purpose shelf)

**Current state:** `antiquarianLibrary.ts:560–582`, "talk" verb. Surfaces as `degen.e5.degens_letter_to_the_saga` when Degen mystery is active. Narration reads: "Sealed. Addressed to the saga's last reader. Filed by the Antiquarian. Don't open until the audit closes."

**Real-world signal that would unseal it:** A Twitch streamer (real name withheld; identity TBD post-launch) goes live with a stream titled "Reading the Degen's Letter — [DISCHORDIAN SAGA COMMUNITY READ]." They play the Degen's letter as an audiobook dramatization (3-5 minutes, voice actor TBD). The stream is announced 4 hours in advance via the game's Transmission alerts system. If the stream reaches 500 concurrent viewers, the letter "opens" for *all* players simultaneously, and a new "Ledger: Degen's Final Word" entry is created with the letter's text + streamer credit + timestamp.

**The file that owns the seal text today:** `apps/shared/roomMysteries/antiquarianLibrary.ts:560–582` (Coda-purpose shelf, "talk" narration at lines 560–562: "Sealed. Addressed to the saga's last reader.")

**The registry/seed that would gate the unseal:** Create `apps/shared/communitySeal.ts` with a `CommunityUnlockThreshold` (`targetViewers: 500`, `currentViewers: number`, `isUnlocked: boolean`, `unlockedAt: Date`, `unlockedBy: string`). Modify `epistolaryClues` (a new table) to carry an optional `communityThreshold?: { kind: "twitch_viewership"; target: number; }`. The variant resolver checks `communityThreshold` at runtime. When the threshold is hit, emit a WebSocket event to all players: "The saga hears the Degen's voice. The letter opens." A new modal surfaces the letter's text in-game, with streaming credits and a thank-you from the in-game Antiquarian.

### (c) Seer's Undelivered Letter to Vex Solène (cipher-den, vex-seer-pair-binder hotspot)

**Current state:** `cipherDen.ts:543–577`, "use" verb. Surfaces as `vex.e5.cross_arc_seer_letter_state` when Vex mystery is active. The state-card reads: "HELD, UNREAD." Narration at line 546: "Vex has chosen, on the saga's evidence, not to open the letter yet. The state will update if and when she does."

**Real-world signal that would unseal it:** A playlist of 7 songs (artist TBD; theme: "letters never sent, words never spoken") gets released on Spotify under the fictional artist "Engineer Zero" (Vex's public alias). Each song is titled with a fragment of the Seer's letter. When a player has listened to all 7 songs (tracked via Spotify OAuth integration), they receive an in-game achievement: "You've heard Vex's archive." A new context-sensitive variant surfaces in the cipher-den: if the player has the achievement, Vex's narration changes: "Vex is holding the letter. She has heard, through the Insurgency's archive, the music the Seer left for her. She is ready. The letter opens." The state-card updates to "HELD, OPENED" with a timestamp and link to the player's Spotify listen history.

**The file that owns the seal text today:** `apps/shared/roomMysteries/cipherDen.ts:543–577` (vex-seer-pair-binder hotspot, "use" narration; state-card at line 546).

**The registry/seed that would gate the unseal:** Create `apps/shared/spotifyIntegration.ts` with a `PlaylistCompletion` tracker (`playlistId`, `completedTracks: number`, `isComplete: boolean`). Add a new TransmissionTrigger kind `{ kind: "external_achievement"; provider: "spotify"; playlistId: string; }`. In `resolveVariant`, check for the Spotify achievement before rendering the "HELD, UNREAD" variant. This weaponizes *real-world music listening* as a gate, making the player's Spotify history *mechanically relevant* to the in-game mystery.

**Summary:** These three sealed objects transform from narrative flourish to live surfaces by anchoring unseal gates to **real-world signals** (SoundCloud audio post, Twitch viewership, Spotify playlist completion) that exist *outside the codebase* and require **community coordination** (the Discord discussion of what the Seer's voice means, the Twitch stream drawing 500 players, the playlist collective listens). Each unseal event becomes a **Ledger moment** — a recorded date and reason in the game's official record — binding the live experience to the saga's eternal archive.
