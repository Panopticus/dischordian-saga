# Audit/15 — Multi-Perspective Gap Tracker

Aggregated findings from the 8 persona audits in this directory. Sortable by severity, persona-of-origin, and surface area. Future sprints pick gaps off this list one at a time; the tracker shrinks as fixes ship.

## At a glance

- **Total findings:** 75 across 8 personas
- **By severity:**
  - **P0** (blocker / experience-broken): 9
  - **P1** (should-fix-this-quarter): 26
  - **P2** (nice-to-have): 32
  - **P3** (maybe-someday): 8
- **Cross-persona overlap clusters identified:** 6 (gaps surfaced by 2+ personas — see below)
- **Doc-only sprint:** zero source files touched; ship-check stays at 32 PASS / 1 RATCHET / 0 FAIL.

## How to read this table

- **#** — finding number within its persona doc
- **Severity** — P0/P1/P2/P3 (P0 = blocker, P3 = nice-someday)
- **Persona(s)** — who surfaced it; "+" denotes cross-perspective cluster
- **Surface** — which subsystem it touches
- **File:Line** — primary code citation
- **Finding** — one-line summary
- **Fix** — concrete recommended action
- **Effort** — S (≤1 day), M (≤1 week), L (≤1 sprint), XL (multi-sprint)

## Ratchet table

### P0 — Blockers (9 findings)

| # | Persona | Surface | File:Line | Finding | Fix | Effort |
|---|---------|---------|-----------|---------|-----|--------|
| C1 | Cinematic | (deferred) | - | (no P0 — director's audit identified mostly P1/P2 gaps) | - | - |
| Co1 | Conspiracy | room mystery | `apps/shared/roomMysteries/archives.ts:60-100` | Archives data-banks hotspot is mise-en-abyme; the "fourteen thousand edits" Editor lore is load-bearing but isolated to one room | Add hidden-discovery hook + `manuscriptVault.ts` module gated on cross-room clue logging | M |
| Co6 | Conspiracy | room mystery | `apps/shared/roomMysteries/bridge.ts:40-132` | Bridge multistate narration (lucid/fragmented/luminous) is a portable pedagogical pattern locked in one room | Extract to shared `tierResponses` feature in `_template.ts`; refactor bridge.ts; document in `AUTHORING_MULTISTATE_CLUES.md` | L |
| AR1 | ARG | mystery seeds | `apps/shared/mysteryTypes.ts:66-71` | Zero external trigger surfaces — every mystery seed compiles deterministically at boot | New `external_webhook` trigger kind + `apps/server/routers/externalSignals.ts` POST `/signal/:webhookId` | L |
| ER1 | EscapeRoom | puzzles | `apps/client/src/components/PuzzleSystem.tsx:39-127` | Puzzle types isolated; no sequencing lock — Bridge can be solved without Cryo Bay | Add `PuzzlePrerequisite` interface + `getPuzzleUnlockState()` exported from `RoomMysteryRegistry` | M |
| ER2 | EscapeRoom | room rendering | `apps/client/src/game/adventureFeatures.ts:181-193` | Room state changes are authored but never visually applied (Bridge looks identical post-puzzle) | Create `apps/client/src/game/roomVisualState.ts` exporting `applyRoomStateOverlay()`; integrate into `ParallaxRoom` | L |
| ER4 | EscapeRoom | clue UI | `apps/client/src/components/ClueJournal.tsx:1-120` | ClueJournal is flat; no cross-room investigation surface | Create `InvestigationBoard.tsx` with thread data model + SVG yarn-diagram | XL |
| GA5 | Gambling [HARM] | casino session | `apps/client/src/game/DegensCasinoPage.tsx` | No session timer or "are you still playing?" interrupts; can play 12h straight | New `useSessionTimer` hook + modal at 2h/4h/6h | S |
| GA1 | Gambling [VEGAS] | casino math | `degensCasino.ts:99-222` | (Inverse P0: house edges all transparent + under 20% — gold-standard finding to preserve) | None needed; post the table on a public wiki | S |
| TCG6 | TCG | trial format | `apps/shared/tcg-core/types/Card.ts:86-92` | `trial_categories` backfill incomplete — 200+ cards unplayable in §5.8 Authority | Backfill conservatively from cardType heuristic; gate Authority runtime on 100% coverage ratchet | M |
| Cos1 | Cosplay | character art | `apps/client/public/characters/_inventory.json:24-883` | Turnarounds for only 2 of 27 characters; 25 NPCs have no full-body geometric reference | Ship 360-degree turnarounds for all 18 NPC speakers; add to `_inventory.json` | XL |

### P1 — Should fix this quarter (26 findings)

| # | Persona | Surface | File:Line | Finding | Fix | Effort |
|---|---------|---------|-----------|---------|-----|--------|
| C1 | Cinematic | wheel followup | `moralityTrustActVariants.ts:674-696` | Wheel_followup variant gated but visually undershot (text only; no portrait reaction) | Extend variants with `portraitCinematicId`; trigger AnimatedPortrait crossfade in NarrativeEngine | M |
| C2 | Cinematic | Human reveal | `npcPortraits.ts:126-187` | Human reveal progression has no cinematic gate at trust threshold crossings | Add `trustThresholdCinematic` field; wire to companion-state update logic | M |
| C4 | Cinematic | Act 6 confessions | `Act6CardLadderPage.tsx:13, 58-100` | Confession-close stances have no cinematic punctuation (text-only choice) | 14 portrait reaction cinematics (7 stances × 2 chars); insert before flag-set | L |
| Co2 | Conspiracy | puzzles | `PuzzleSystem.tsx:64, :76, :104, :116` | Hardcoded riddle answers are meta-textual confessions but exploitable | Add `metariddle` clue type + `riddleCommentary.ts` post-game commentary surface | M |
| Co4 | Conspiracy | LOREDEX graph | `LoredexContext.tsx:46-53`, `loredexGraph.ts:121-200` | Graph relationship edges have no discovery-gating; nodes hide but edges appear instantly | Extend Relationship interface with `discoveryGate?: string`; filter edges in `focusNeighbourhood()` | M |
| AR2 | ARG | sealed objects | `antiquarianLibrary.ts:136-243, 488-582, 589-665` | Sealed letters are narrative flavor, not mechanical — never gated on player action | Create `apps/shared/unsealing.ts` UnlockGate schema; modify `clueEntry.foundIn` to support gateId | M |
| AR5 | ARG | seasonal events | `seasonalEvents.ts:251-384` | Fall of Reality anniversary is duration-gated, not date-gated — no cultural resonance date | Add `anniversaryDate: { month, day }` to SeasonalEventDef; fix-anchor to May 8 | S |
| AR6 | ARG | variant resolver | `moralityTrustActVariants.ts:42-67` | Variant resolver has no calendar/time-window support | Add optional `timeWindow?: { startsAt, endsAt }` to variant interface; update `resolveVariant` specificity | S |
| AR8 | ARG | puzzle replayability | `PuzzleSystem.tsx` (referenced) | Hardcoded puzzle answers immutable across seasons | Split content into `authoredNarration` (static) + `solveState` (per-player, per-season seed) | L |
| ER3 | EscapeRoom | inventory | `adventureFeatures.ts:32-69` | Inventory combinations are 1-to-1, no multi-use chains (Monkey Island depth missing) | Define `InventoryChain` interface; redesign Terminus chain as 5-step | M |
| ER5 | EscapeRoom | puzzle chains | `adventureFeatures.ts:250-298` | Puzzle chains exist but aren't visually tracked; `getActivePuzzleChains` never called from UI | Export from adventureFeatures.ts; render "Active Chains" section in ClueJournal | S |
| ER6 | EscapeRoom | room hotspots | `roomMysteries/_template.ts` | Hotspots have no explicit cross-room clue dependencies | Add `dependsOnClues?: { clueId, otherRoomId }[]` to Clue interface | M |
| GA2 | Gambling [VEGAS] | casino | `degensCasino.ts:206-212` | Void Cases 20% house edge (highest); cosmetic-rewards trap | Reduce edge to 10% OR gate behind separate daily limit | S |
| GA3 | Gambling [HARM] | casino pity | `CasinoGamePanels.tsx:652-670` | Only 2 of 15 games have pity timers | Add pity to Faction War (every 20), Dream Roulette (every 3), High/Low (every 12) + visible counters | M |
| GA4 | Gambling [HARM] | casino caps | `degensCasino.ts:348` | Daily wager cap (5000D) is theatrical for high rollers; no loss cap exists | Implement `dailyNetLoss` cap (1000D), warn at 50/100% | S |
| GA5b | Gambling [VEGAS] | music rights | `docs/legal/AI_PROVENANCE.md` (no music coverage) | Music origin/licensing for 118 songs undocumented — DMCA risk | Create `docs/music-licenses.md` with per-album license table | S |
| TCG2 | TCG | draft | `DraftTournamentPage.tsx:69-104` | Draft rarity escalation lacks removal scarcity controls | Add `removal_scarcity` tracking; cap legendary weight; AI penalty for greedy decks | M |
| TCG4 | TCG | AI lockout | `lockout.ts:80-127` | Warlord lockout heuristic too naive for late game (favors affordability over threat) | Override scoring at mana ≥6 to use raw threat + combo + AoE awareness | M |
| TCG8 | TCG | curve UX | `apps/shared/tcg-core/cards/index.ts` | Mana curve still cost-3-skewed even post-PR #512; deckbuilder doesn't resist | Add mana-curve heatmap + curve-skew warning + collection-panel "deck has X cost-3 cards" highlight | M |
| Cos2 | Cosplay | paperdoll | `compositePaperDoll.ts:79-88`, `suitArtPrompts.ts:148-156` | Paperdoll slots + faction-color palette invisible to public | Create `/characters/canon` page exporting slot taxonomy + ELEMENT_PALETTES + RARITY_LABELS | M |
| Cos3 | Cosplay | viseme calibration | `characterSprites.ts:42-79, 165-191` | Viseme-sheet composition logic buried in inline comments; mouth-box opacity unclear | Export `/characters/[id]/mouth-calibration.json` per NPC; document `?debug-mouthbox=1` flag | S |
| Cos4 | Cosplay | character metadata | `_inventory.json` | No height/build/age metadata; cosplayers can't scale | Add per-character `metadata.json { canonicalHeight, buildType, ageApproximation }` | S |
| Strm1 | Streamer | audio control | `SettingsPage.tsx:521-561`, `SoundContext.tsx:1015-1027` | No granular Music vs VO vs SFX volume sliders | Add `voVolume` to SoundContext; new "VO VOLUME" slider in Audio settings | S |
| Strm5 | Streamer | music rights | `docs/legal/AI_PROVENANCE.md` | Music licensing undocumented (mirrors GA5b) | Create `docs/music-licenses.md` per-album table (shared with Gambling persona) | S |

### P2 — Nice to have (32 findings)

| # | Persona | Surface | File:Line | Finding | Fix | Effort |
|---|---------|---------|-----------|---------|-----|--------|
| C3 | Cinematic | transmission overlay | `SlideshowPlayerRoot.tsx:156-216` | Transmission variant text overlays have no portrait anchor | Add `portraitNpcId` + `portraitExpression` to MoralityTrustActVariant; render bust in corner | S |
| C5 | Cinematic | Silence VO | `SlideshowPlayerRoot.tsx:44-64` | Silence-of-Two-Witnesses parenthetical not gated on morality | Extract to `useVariant("slideshow_vo_override", ...)` | S |
| C7 | Cinematic | guild cutscenes | `guildCutscenesManifest.ts:273-315` | 59 guild cutscenes have zero narrative gating | Add morality/trust/act/flag fields to GuildCutsceneDef + variant filter | M |
| C9 | Cinematic | corruption engine | `TransmissionDisplay.tsx:111-126` | The Human's transmission corruption ignores trust state | Add `corruptionLevelOverride` field; resolve from `bandForTrust(human)` | S |
| Co3 | Conspiracy | journal variants | `ClueJournal.tsx:458-461` | Journal variant collapses too early; no "how you read this then vs now" | Add `variants` field to Clue; render "HOW YOU READ THIS THEN/NOW" expanded panel | M |
| Co5 | Conspiracy | LOREDEX clusters | `loredexClusters.ts:10-35` | Five clusters tagged but graph viewer doesn't render them | Create `LoredexClusterView.tsx`; add cluster filter panel + ClueJournal "thematic threads" tab | M |
| Co8 | Conspiracy | puzzle chains | `ClueJournal.tsx:732-809` | Puzzle chains shown linearly, no dependency graph | Add `prerequisiteChains?: string[]` field; render "INVESTIGATION DIAGRAM" view | M |
| AR3 | ARG | mystery branches | `mysteryRegistryBootstrap.ts` | Mysteries compile at boot; never regenerate at runtime | Add `playerInfluenceGates` to MysteryDefinition; let resolver pick branch on close | L |
| AR4 | ARG | transmissions | `transmissions.ts:28-38` | No transmission has "scheduled_broadcast" trigger; nothing arrives live | Add scheduled_broadcast trigger + WebSocket emission pass | M |
| AR7 | ARG | community | (no `communityChannels.ts`) | No player-coordination surface for ARG campaigns | Create `investigationBoard.ts` + `communityInvestigation.ts` with global discovery tracking | L |
| ER7 | EscapeRoom | discovery state | `GameContext.tsx` | Discovery is binary; no silhouette → name → details progression | Change discoveredIds from Set to Map<string, DiscoveryTier> | M |
| ER8 | EscapeRoom | visit tracking | `GameContext.tsx:65-77` | Room visit count tracked but unused by narrative; no "second visit" lines | Pass visitCount into resolveVerbResponse; add `tiers: { requiredVisitCount }` to hotspot | M |
| GA6 | Gambling [HARM] | casino UI | `DegensCasinoPage.tsx:35-62` | Live jackpot banner refreshing every 10s = FOMO dark pattern | Reduce to 60s; remove scale animation; move to leaderboard only | S |
| GA7 | Gambling [VEGAS] | jackpot | `casino.ts:421-434`, `casinoGames.ts:349` | 2% jackpot pool contribution undisclosed in UI | Add tooltip on jackpot banner | S |
| GA8 | Gambling [HARM] | hidden trust | `degensCasino.ts:51-72` | Degen's Favor mechanic undisclosed | Add help modal explaining Favor (cosmetic-only, not odds-affecting) | S |
| GA11 | Gambling [HARM] | rate limits | `casino.ts:636, 677, ...` | Rate limits per-endpoint, not per-session — panic-betting possible | Add global session-level rate limiter middleware | M |
| GA12 | Gambling [HARM] | pack-opening | `apps/shared/tcg-core/economy/packs.ts:15` | Pack pity exists but no spend warning at high consecutive purchases | Add modal after 500D spent in 5 min on `DemonPackPage` | S |
| TCG1 | TCG | deckbuilder | `DeckBuilderPage.tsx:156-175` | Keyword tax recalibration UI-invisible | Add `avgKeywords` stat + balanceException-warning highlight | S |
| TCG3 | TCG | deckbuilder UX | `combat.ts:101-121` | Provoke + ranged interaction has no UX preview | Add keyword-tooltip modal in GameCard hover | M |
| TCG5 | TCG | stat-curve | `statCurve.ts:49-60` | Tolerance windows have no gradient justification | Compute Stat Efficiency ratio; emit "low efficiency" warnings; per-bucket tolerance | M |
| TCG7 | TCG | replay | `replay.ts:1-80` | Replay export has no UI surface | Add "Export Last Match Replay" button + `/replay/:replayId` page | M |
| Cos5 | Cosplay | Blood Weave | `bloodWeave.ts:124-133` | Blood Weave bands have lore but no color/visual canon | Extend BLOOD_WEAVE_REVEAL_POOL with colorHex + glowIntensity + threadDescription | S |
| Cos6 | Cosplay | expansion art | `hierarchyOfDamned.ts:56-181` | S2 cards not linked to wearable suit-piece catalog | Add `cardType` + `relatedSuitSetId?` metadata | S |
| Cos7 | Cosplay | Human reveal | `npcPortraits.ts:126-187` | Human reveal stages have no cosplay guidance | Add `cosplayGuidance` field per HUMAN_REVEAL_STAGE | S |
| Cos8 | Cosplay | faction colors | `npcPortraits.ts:13-25` | NPC `color` field semantically ambiguous | Rename to `factionColorHex` + add `factionName: string` field | S |
| Cos9 | Cosplay | expressions | `npcPortraits.ts:19-24` | Expressions limited to 4 placeholder names (emotional1/emotional2) | Convert to `Record<string, string>` with named emotions (concerned/defiant/haunted/etc.) | S |
| Strm2 | Streamer | privacy | `SettingsPage.tsx` | No pause-menu blur for IRL share | Add `blurPauseMenu` setting + CSS class | S |
| Strm3 | Streamer | overlay | `GameContext.tsx` | No run-tracker overlay for acts/decisions | Create `RunTrackerOverlay.tsx` with draggable position | M |
| Strm4 | Streamer | animation timing | `MemorialCorridorPage.tsx:138-150` | Animation durations not configurable; conflict with VO timing | Add `narrativeAnimSpeed` slider (0.5×-2.0×) + `useNarrativeSpeed()` hook | S |
| Strm6 | Streamer | cinematic chapters | `SongCinematicVideo.tsx:33-53` | Song cinematics lack chapter-card telegraph | Add `chapterTitle` + `chapterId` to SongCinematicVideoProps | S |
| Strm7 | Streamer | replay export | `replay.ts:37-74` | Card-battle replay export missing UI (mirrors TCG7) | Create `replayExport.ts` with FFmpeg WASM MP4 encoder | L |
| Strm8 | Streamer | SFX granularity | `SoundContext.tsx:357-1002` | SFX trigger sounds not configurable per-type | Add `sfxMuteList: SFXType[]` setting + multi-select UI | S |

### P3 — Maybe someday (8 findings)

| # | Persona | Surface | File:Line | Finding | Fix | Effort |
|---|---------|---------|-----------|---------|-----|--------|
| C6 | Cinematic | trust filters | `AnimatedPortrait.tsx:74-90` | Trust filter visual grammar undocumented; ignores morality | Add comment doc + extend filter with morality argument | S |
| C8 | Cinematic | lipsync | `characterSprites.ts:63-86` | No morality-state viseme swap | Add optional `visemeMachine` / `visemeHumanity` (future-proofing) | M |
| C10 | Cinematic | portrait glow | `AnimatedPortrait.tsx`, `NPCDialog.tsx:42-99` | Portrait glow ignores NPC manifestation type | Add `manifestation` prop; reuse MANIFESTATION_CONFIG | S |
| Co7 | Conspiracy | sealed objects | `roomMysteries/*.ts` (sealed letters) | Sealed letters condition players to accept walls (not a bug, but the absence is signal) | Don't change; add post-game "ACCESSIBLE UNREACHABLES" registry + RECONSTRUCTION tab | M |
| GA9 | Gambling [VEGAS] | RTP audit log | `casinoGames.ts:72-77` | Void Slots prior 18% player edge undisclosed in changelog | Add `versionHistory` field to CasinoGameDef | S |
| GA10 | Gambling [HARM] | trap achievement | `casino.ts:163-169` | "Breaking Even" achievement gamifies chase-your-losses | Rename + lower threshold to "Equilibrium Touched" within 50D over 500 bets | S |

## Cross-perspective clusters (gaps surfaced by 2+ personas)

These are the highest-leverage gaps because multiple lenses surfaced the same architectural debt. Picking these off first delivers compounding value.

### Cluster A — "The Investigation Board" (Conspiracy + Escape Room + ARG)
- **Findings:** Co3 + ER4 + AR7
- **Pattern:** ClueJournal is a flat list. Three personas independently asked for a pin-and-thread / wall-of-strings / community-discovery surface. The data already exists (room mysteries, LOREDEX graph, narrative flags); the visualization doesn't.
- **Why it matters more than its parts:** A single InvestigationBoard component closes three personas' top P0/P1 gaps. It's the highest-leverage build in the tracker.
- **Suggested combined fix:** Build `apps/client/src/components/InvestigationBoard.tsx` as canvas-based pin-and-thread UI with: (a) thread suggestions from variant-resolver-extended-to-clue-relationships (Conspiracy), (b) cross-room dependency rendering (Escape Room), (c) per-clue community discovery counters via new `apps/server/routers/communityInvestigation.ts` (ARG).
- **Effort:** XL. ~200 hours combined; phase deliverable across two sprints.

### Cluster B — "Music Licensing Manifest" (Gambling + Streamer)
- **Findings:** GA5b + Strm5
- **Pattern:** 118 songs across 5 albums have zero published licensing documentation. Vegas auditor + DMCA-conscious streamer both flag this.
- **Why it matters more than its parts:** It's a single one-pager doc. Both personas resolve the issue immediately. Lowest effort / highest dual-impact item in the tracker.
- **Suggested combined fix:** `docs/music-licenses.md` table with Song | Album | Source | License | Commercial OK | DMCA Safe per album. Linked from in-app About + README.
- **Effort:** S. Half-day if Suno/source provenance is already known.

### Cluster C — "Replay Export to MP4" (TCG + Streamer)
- **Findings:** TCG7 + Strm7
- **Pattern:** Replay infrastructure exists but has no UI surface. TCG player wants it for balance disputes; streamer wants it for highlight reels.
- **Why it matters more than its parts:** Same engine, same export pipeline serves both — competitive integrity AND content marketing. Two-for-one.
- **Suggested combined fix:** `apps/client/src/lib/replayExport.ts` with `exportReplayAsMP4()` using FFmpeg WASM. Surface in DeckBuilder ("Export Last Match Replay" button) AND post-battle dialog ("Download Replay as MP4" with quality selector).
- **Effort:** L. ~3 weeks for the FFmpeg WASM integration + canvas rendering.

### Cluster D — "Variant Resolver Extensions" (Cinematic + ARG + Conspiracy)
- **Findings:** C1 + C2 + AR6 + Co3
- **Pattern:** The `MoralityTrustActVariant` interface needs three new optional fields (cinematicId, timeWindow, clueRelationship) for three personas to ship their top fix.
- **Why it matters more than its parts:** A single schema migration unblocks three perspectives. The resolver's specificity scoring already handles the addition; just plumb the new fields.
- **Suggested combined fix:** Extend `apps/shared/moralityTrustActVariants.ts` interface with `portraitCinematicId?`, `timeWindow?: { startsAt, endsAt }`, and `relatedClues?: string[]`. Update `resolveVariant` specificity. Document in `AUTHORING_MORALITY_VARIANTS.md`.
- **Effort:** S for the schema; M for downstream consumers.

### Cluster E — "Character Canon Reference Site" (Cosplay + Cinematic)
- **Findings:** Cos1 + Cos2 + Cos3 + Cos4 + C7
- **Pattern:** Cosplayer wants a `/characters/canon` page; cinematic director wants a `VISUAL_LANGUAGE.md` doc; the underlying need is the same — a single, public, auto-generated reference that pulls from `npcPortraits.ts`, `characterSprites.ts`, `bloodWeave.ts`, `suitArtPrompts.ts`, and the variant registry.
- **Why it matters more than its parts:** AI-prompt generators (for new card art, new cinematics, new cosplay reference) all need the same source-of-truth. Build once, use everywhere.
- **Suggested combined fix:** New page `/characters/canon` with per-character build-guide (turnaround sheet, height band, paperdoll slot breakdown, Blood Weave gallery, faction colors, expression names, cinematic gating documentation). Generate from existing TS exports.
- **Effort:** L. Ship the data extraction first (S); then the UI (M); then the per-character art backfill (XL — 25 turnarounds).

### Cluster F — "Mana Curve + Stat Curve UX" (TCG only, but compound)
- **Findings:** TCG1 + TCG5 + TCG8
- **Pattern:** Three TCG-player findings all point at "the deckbuilder doesn't surface what the ratchet already knows." Mana curve heatmap + stat efficiency + keyword density would each individually be helpful; together they're a competitive deckbuilder.
- **Why it matters more than its parts:** Consolidates three M-effort fixes into one cohesive sidebar redesign that delivers Marvel-Snap-tier UX in one PR.
- **Suggested combined fix:** Redesign `DeckBuilderPage.tsx` right panel as the "tuning sidebar" described in the TCG audit. Heatmap + density + efficiency + warnings + ratchet hooks + balanceException tooltips.
- **Effort:** L. ~2 weeks for the sidebar; M for the ratchet wiring.

## Suggested next-sprint pickup

Highest-leverage gaps to tackle in audit/16+ (P0 + cross-cluster + low effort):

1. **Cluster B — Music Licensing Manifest** (S effort, dual-persona) — just write the doc.
2. **GA5 — Casino Session Timer** (S effort, P0 harm-reduction) — `useSessionTimer` hook + modal.
3. **TCG6 — Trial Categories Backfill** (M effort, P0 blocker for Authority shipping) — heuristic-based assignment + manual review.
4. **Cluster D — Variant Resolver Extensions** (S schema + M consumers) — unblocks Cinematic + ARG + Conspiracy in one schema migration.
5. **Cluster A — Investigation Board** (XL but compounding) — the single biggest player-experience win in the tracker.

## Out of scope (preserved for traceability)

- **Implementation of any tracker fix.** This sprint produced the audit; future PRs pick gaps and ship the fixes.
- **Re-audit of fixes that ship.** When a tracker row's fix lands in a future PR, that PR's commit message should reference the row id (e.g., "fixes audit/15.GA5"). The next tracker revision strikes the row.
- **Voice-over re-recording costs.** Several findings (C8 morality-state lipsync, Cos7 Human reveal cosplay guidance) imply VO/asset work whose cost is outside this audit's scope.
- **Music rights legal review.** The Streamer + Gambling personas flag licensing documentation as urgent, but the legal review of "is this song actually clearable for commercial use" is the user's commercial-rights call, not a doc recommendation.

## Tracker bookkeeping

- **Created:** 2026-05-08 (audit/15)
- **Source PRs informing this audit:** PR #510 (audit/09+10+14), PR #512 (audit/01+09+14 follow-ups), PR #509 (crew/hellbox), PR #513 (commons + obituaries), PR #514 (roleplay identity)
- **ship:check status at audit time:** 32 PASS / 1 RATCHET / 0 FAIL
- **Card pool at audit time:** 508
- **Total persona word count:** ~17,000 words across 8 docs
