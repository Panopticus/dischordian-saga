# Inception Ark — Final Production: Working Notes

> Companion to `INCEPTION_ARK_FINAL_PRODUCTION.md`. Authoring is
> paused (2026-05-09) at the user's request to finish the Trade
> Empire first. This file captures the upstream analysis that was
> performed before the pause so context-compaction doesn't lose it.
>
> **Sources.** Four parallel exploration agents were run against
> the repo on 2026-05-09. Their outputs are condensed here. Where
> a section says "see file X", X is the canonical source — do not
> duplicate from this notes file.

---

## 0. Resume order (when Trade Empire is done)

1. Re-read this file end-to-end.
2. Re-read `INCEPTION_ARK_FINAL_PRODUCTION.md` §0–§1 (already drafted).
3. Author §2 (per-room production bibles) — proceed deck by deck:
   D1 → D2 → D3 → D4 → D5 → D6 → D7 → D8 → D9 → D10 → Pocket
   rooms → Trade Hub → Prelude rooms.
4. Author §3 (NPC state atlas) — proceed in this order: Elara,
   The Human, The Antiquarian, Vex, Locke, the Companion (DMC
   prize), Wraith→Hierophant, the Meme, Nilmorg, the Game Master,
   the Degen, Jericho, Drael'Mon, the Seer, the Oracle, Your
   Eidolon.
5. Author §4 (feature surface map) by walking the §3.B feature list
   below room-by-room.
6. Author §5–§11 in declared order.
7. After each part, run `pnpm ship:check` — the registry should not
   regress.

The methodology lock (§0–§1 of the main doc) is final. **Do not
re-author it** — extend §2 onward instead.

---

## 1. Room inventory (33 rooms)

### 1.1 Canonical sources

- `apps/client/src/contexts/GameContext.tsx` — `ROOM_DEFINITIONS`
  (full unlock conditions, hotspots, deck, adjacency)
- `apps/client/src/game/livingArk.ts` — `ROOMS` (visual tier
  descriptors, cross-room alerts, daily-brief event pulls)
- `apps/shared/arkEventHandler.ts` — `RoomId` union (canonical
  spelling)
- `apps/shared/mobileNarrator.ts` — narrator presence rules and
  per-room affinity weights
- `apps/shared/companionRoomRegistry.ts` — NPC room assignments
- `apps/shared/roomMysteries/index.ts` — investigation hotspots,
  verbs, response banding (28 rooms)
- `apps/shared/roomStateArtPrompts.ts` — existing P0 art (cryo +
  med bay, 4 states each)
- `apps/shared/roomMediaPrompts.ts` — shadow vault state prompts +
  video overlay instructions
- `apps/shared/roomTierArtPrompts.ts` — tier-progression prompts
  for bridge + engineering

### 1.2 Room list (33 rooms across 10 decks + pocket + prelude)

**Deck 1 (post-Prelude core)**
1. **Cryo Bay** (`cryo-bay`, internal `cryo_bay`) — crew
   cloning/bloodlines/cryo-mystery; default narrator Elara;
   adjacencies Medical Bay, Bridge.
2. **Medical Bay** (`medical-bay`, internal `medical_bay`) — DNA
   neural-bridge device, quarantine, Source contact; primary NPC
   `the_source`; companion Vex Solène if `act_2_complete`.
   Adjacency Cryo Bay.

**Deck 2 (central hub)**
3. **Command Bridge** (`bridge`) — daily brief, conspiracy board,
   chess (Architect's Gambit), Elara hub; companions Elara
   (always) and Adjudicator Locke if `trade_empire_unlocked`.
4. **Archives** (`archives`) — Loredex, lore quiz, Dischordia card
   game, tomes; companion The Antiquarian if `act_2_complete`;
   first-visit triggers The Human as narrator if burnt Seer's card
   present.

**Deck 3**
5. **Comms Array** (`comms-array`, `comms_array`) — transmissions,
   Saga Watch, Late Night with the Meme, signal interception;
   primary NPC The Human; companion Scroll.
6. **Observation Deck** (`observation-deck`) — stargazing, music
   player, discography; The Human signal threads here; gates on
   `power_grid_restored`.

**Deck 4**
7. **Engineering Bay** (`engineering`) — crafting, research lab,
   card fusion, Engineer questline; primary NPC Shadow Tongue;
   Agent Zero if `act_3_starting`.
8. **Forge Workshop** (`forge-workshop`) — gated by
   `engineer_chain`; advanced crafting and schema collection.

**Deck 5**
9. **Armory** (`armory`) — Terminus Swarm tower defense, PvP arena,
   weapons cache; primary NPC Agent Zero (signal); companion
   Jericho Jones if `trade_empire_unlocked`.
10. **Cargo Hold** (`cargo-hold`, internal `cargo_bay`) —
    collection, inventory, draft tournament. Gated on
    `cargo_bay_pressurized`.

**Deck 6**
11. **Captain's Quarters** (`captains-quarters`,
    `captains_quarters`) — companion hub, morality census, personal
    log. Gated on item `captains-master-key`.
12. **Trophy Room** (`trophy-room`) — achievements, titles, battle
    pass; not on initial grid.

**Deck 7**
13. **Antiquarian's Library** (`antiquarian-library`) — pocket
    dimension; Antiquarian always present at trust 0+; tome reading
    + CoNexus hub. Gated on `items_collected≥5`. Hotspots: card
    catalogue, locked vault, Antiquarian's bust, Hierophant's
    marginalia stack, Coda's purpose shelf, Velkraal's
    correspondence folio, insurgency witness roster.
14. **Guild Sanctum** (`guild-sanctum`) — guild ops, decorations,
    war declarations. Gated on `guild_formed`.
15. **Social Hub** (`social-hub`) — mess table, morale events,
    companion gathering.
16. **Station Dock** (`station-dock`) — Coda admin, faction trading.
    Companion: Coda's Trading-Floor Desk NPC.

**Deck 8 (class/faction sanctums, hidden)**
17. **Engineering Core** — gated `engineer_chain`; Shadow Tongue
    face-to-face cinematic.
18. **Oracle Sanctum** — gated `oracle_chain`; Seer's recordings.
19. **Shadow Vault** — gated `assassin_chain`; Shadow Tongue
    cell-sealed/released/resealed states (file
    `apps/shared/roomMediaPrompts.ts`).
20. **War Room** — gated `soldier_chain`; Adjudicator Locke war
    planning; holo-table BRIEFING/RECON/OBITUARY modes; casualty
    board.
21. **Cipher Den** — gated `spy_chain`; signal decryption.

**Deck 9 (alignment)**
22. **Tribunal of Order** — gated `order_chain`; Mol'Vereth.
23. **Chaos Forge** — gated `chaos_chain`; entropy vat.

**Deck 10 (species)**
24. **Elemental Nexus** — gated `demagi_chain`.
25. **Quantum Laboratory** — gated `quarchon_chain`.
26. **Synthesis Chamber** — gated `neyon_chain`.

**Pocket / specialized**
27. **Memorial Corridor** — bond-gated; Elara-affinity room; "she
    weeps here" narrator note.
28. **Pet Garden** — post-Prelude unlock; pet breeding/dynasty.
29. **Trade Hub** — referenced in livingArk.ts and companion
    registry; Locke operations.

**Prelude-only (suppressed post-Prelude)**
30. **Corridor** (`corridor`) — emergency floor strip pacing.
31. **Galley** (`galley`) — galley hearth, coffee mug.
32. **Briefing Room** (`briefing-room`) — Kael contingency memo,
    seven occupied chairs + one askew empty chair.
33. **Mess Hall** (`mess-hall`) — Prince's archive shelf, sepia
    flashbacks.

### 1.3 Adjacency graph (canonical)

```
Cryo Bay ↔ Medical Bay
   ↓
Bridge ↔ Archives
   ↓                      ↘ Order Tribunal (D9)
Comms Array ↔ Observation Deck
   ↓                      ↘ Oracle Sanctum (D8)
Engineering ↔ Armory      ↘ Elemental Nexus (D10)
   ↓ → Forge Workshop     ↘ Cipher Den (D8)
Cargo Hold ↔ Captain's Quarters
   ↓                      ↘ Antiquarian Library (D7 pocket)
Guild Sanctum ↔ Social Hub ↔ Station Dock
                              ↓
                          Trade Hub
Hidden D8: Engineering Core (← Engineering)
           Shadow Vault (← Armory)
           War Room (← Bridge / Station Dock)
D9 Chaos Forge ← Engineering
D10 Quantum Lab ← Archives
D10 Synthesis Chamber ← Medical Bay
```

---

## 2. NPC inventory (16 named)

Full report: see the af3cd9a8 sub-agent transcript on disk. Key
production-relevant condensation below.

### 2.1 NPC count + reveal-state count (for art-pass scoping)

| # | NPC | Primary room | Trust bands | Reveal stages | Persona registers | Approx state-render count |
|--:|---|---|--:|--:|--:|--:|
| 1 | Elara | Bridge / Comms Relay | 3 | (none) | 1 | 3 (band-keyed) |
| 2 | The Human | Observation Deck (signal) | 3 | 5 (Static→Ghost→Fragment→Convergence→Full) | 1 | 5 (reveal-keyed) |
| 3 | Your Eidolon | Observation Deck | 4 | 4 (band ≡ stage) | 1 (non-verbal) | 4 |
| 4 | Adjudicator Locke | Trade Nexus | 5 | (none) | 5 (Mercantile/Predatory/Collegial/Conspiratorial/Judicial) | 5 (register-keyed) |
| 5 | Vex Solène | Medical Bay / Coda Bridge | 4 | 4 (eyes-of-reality / vex-public / engineer-zero-hint / engineer-zero-confirmed) | 2 (Hitman / Maestro) | 8 (4×2) |
| 6 | The Degen | Degen's Casino | 5 | (none) | 5 (All-in / Pacifist / Citation / Aleatory / Ethics-defendant) | 5 |
| 7 | Nilmorg | DMC Platform | 4 (seasonal: Bone/Wire/Chrome/Dead-Man's) | (none) | 2 | 4 |
| 8 | The Game Master | Matrix of Dreams | 3 (presence: Faint/Loud/Overwhelming) | 3 (Archon → Cult → Dead-AI) | 3 | 3 |
| 9 | The Meme | any reflective surface | 4 (Unrecognized/Glimpsed/Named/Confronted) | 4 (Broadcast / Stolen / Real / Replacement) | 5 (Broadcast/Stolen/Quiet/Child/Real) | 5 |
| 10 | Wraith Calder → The Hierophant | Long-Mourning Chamber (post-rite) | 5 (Hostile/Wary/Witnessed/Present/Inheriting) | 2 (pre-arena / post-arena) | 2 (pre-rite-wraith / post-rite-hierophant) | 2 + transformation cinematic |
| 11 | The Oracle (real) | Thaloria-hidden (dream-substrate) | 3 (Wary / Witnessed-or-Present / Inheriting) | 3 (dream-substrate / memory-residue / cinematic-exception) | 3 | 3 (deliberately unstable) |
| 12 | DMC Clone Companion | Player's Quarters | 4 | 4 (band ≡ stage) | 64-tuple (faction × trust-pattern × alignment × identity) | base-set + 64 variant overlays |
| 13 | Jericho Jones | Armory / Heart-of-Time | 5 | 4 (pre-thaloria / thaloria-known / heart-offered / aboard) | 1 | 4 |
| 14 | The Antiquarian (Daniel Cross) | Antiquarian Library | 5 | 1 (Phase A canon: outside-time-observer) | 3 (Bibliographic / Reluctant-arbiter / Out-of-time) | 3 |
| 15 | Drael'Mon | The Trench | 5 | (none) | 3 (Predatory / Acquisitive / Blood-weave-enforcer) | 3 |
| 16 | The Seer | Thaloria-coordinates (transmission) | 3 | (none — every line is a pre-recording) | 3 (Cold / Warm / Confidant) | 3 |

**Total per-NPC art deliverables (rough):** ≈ 70 base + the 64
DMC Companion variants = ~134 NPC stills, plus 2 transformation
cinematics (Wraith→Hierophant, Agent Zero→Vex), plus 1 progressive-
reveal sequence (The Human signal → portrait), plus the Oracle's
deliberately-unstable dream-substrate visuals.

### 2.2 Voice manifests (locked — DO NOT re-cast in §3)

Each NPC has a fixed ElevenLabs voice id and a manifest file. The
art pass must match these — voice direction drives expression
choice.

```
elaraVoManifest.json           voice xMyNDrPFEtQN8iZtT7l2
humanVoManifest.json           voice oGbGJdgofRR8z0MxwI8L
lockeVoManifest.json           voice 8XiBWqS5ffaH5naIFHPI
vexVoManifest.json             voice F1waTCPWl7KpShIScYQs
nilmorgVoManifest.json
degenVoManifest.json
gamemasterVoManifest.json
memeVoManifest.json
seerVoManifest.json
antiquarianVoManifest.json
```

Drael'Mon, Wraith Calder, Jericho Jones, the Oracle, the Companion,
the Eidolon use shared/Hierarchy/Insurgency manifests or are TBD.

### 2.3 Portrait URLs (locked — already on CDN)

```
elara-base       https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528068/elara-base_i4kbzp.jpg
the-human-base   https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528038/the-human-base_tjxrdj.jpg (50+ trust only)
the-meme-base    https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528039/the-meme-base_sdggfn.jpg
locke-base       https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528071/locke-base_j7mxqz.jpg
antiquarian-base https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775525313/antiquarian-base_d0rlc7.jpg
vex-base         (placeholder — currently uses locke-base; needs unique art)
```

### 2.4 NPC-by-room presence matrix (for §2 staging)

| Room | Always | act_2_complete | act_3_starting | trade_empire_unlocked | other |
|---|---|---|---|---|---|
| Cryo Bay | — | — | — | — | (no NPC; narrator slot only) |
| Medical Bay | the_source | Vex Solène | — | — | |
| Bridge | Elara | — | — | Adjudicator Locke | |
| Archives | — | The Antiquarian | — | — | the_human-narrator if burnt Seer's card |
| Comms Array | the_human (signal) | — | — | — | Scroll (companion) default |
| Observation Deck | — | — | — | — | the_human signal threads |
| Engineering | shadow_tongue | — | Agent Zero | — | |
| Forge Workshop | — | — | — | — | |
| Armory | agent_zero | — | — | Jericho Jones | |
| Cargo Hold | — | — | — | — | |
| Captain's Quarters | — | — | — | — | companion gathering hub |
| Trophy Room | — | — | — | — | |
| Antiquarian Library | — | The Antiquarian | — | — | |
| Guild Sanctum | — | — | — | — | guild master |
| Social Hub | — | — | — | — | crew gathers |
| Station Dock | — | — | — | — | Coda admin |
| Engineering Core | — | — | — | — | Shadow Tongue (cinematic) |
| Oracle Sanctum | — | — | — | — | Oracle recording, post-rite |
| Shadow Vault | — | — | — | — | Shadow Tongue (face-to-face cinematic) |
| War Room | — | — | — | Adjudicator Locke | |
| Cipher Den | — | — | — | — | spy mentor |
| Order Tribunal | — | — | — | — | Mol'Vereth |
| Chaos Forge | — | — | — | — | chaos entity |
| Elemental Nexus | — | — | — | — | DeMagi entities |
| Quantum Lab | — | — | — | — | Quarchon scientist |
| Synthesis Chamber | — | — | — | — | Ne-Yon geneticist |
| Memorial Corridor | — | — | — | — | (Elara on bond-40+ trigger) |
| Pet Garden | — | — | — | — | (narrator-active) |
| Trade Hub | — | — | — | Adjudicator Locke | |

---

## 3. State axes inventory

### 3.1 Narrative flags

Canonical registry: `apps/shared/flags/narrativeFlagRegistry.ts` (162
lines, 43+ flags). Categories:

- **act_gate**: act_1..act_7 + act_4_5 (Dead Man's Circuit) +
  narrative_spine_complete; cycle_a/b/c sub-flags for Act 1.
- **act_branch**: act1_closing_choice_made, vortex_endgame_light_variant,
  vortex_endgame_dark_variant.
- **romance**: bond_80_mutual_peak, human_dark_confession_unlocked,
  elara_high_confession_unlocked.
- **prelude**: prelude_beat_c_role_chosen, prelude_beat_f_memo_read.
- **morality**: forgiveness_choice_made, lyra_vox_unlocked.
- **system_unlock**: trade_empire_unlocked, act4_army_unlocked,
  starter_pack_claimed, crafting_mastered, chess_mastered.
- **mech_tutor** (×13): crafting / dream_substrate / respec /
  prestige / morality / breeding / colony_commerce / demon_pacts +
  intro/tutor pairs each.
- **casino**: casino_first_jackpot_witnessed, casino_streak_5_hit,
  casino_centurion, casino_tale_collector,
  casino_degen_favor_25/50/75/100.

### 3.2 Universal events (no central enum found)

The "universal event" terminology is narrative-domain specific. The
codebase uses `event_*` flag prefixes for witnessing milestones.
Key event-flagged moments referenced:

- event_two_witnesses_remember
- event_two_witnesses_meet
- event_silence_of_two_witnesses
- event_meme_broadcast_active
- event_universal_quarantine
- event_faction_succession_announced
- event_oracle_dream_pull
- event_architect_audit
- event_lions_apocalypse_protocol
- event_dreamer_vision_<N>
- event_dischordia_cycle_inversion

(See `INCEPTION_ARK_FINAL_PRODUCTION.md` §1.5 for the visual
register of each — already authored.)

### 3.3 Seasons (Trade Empire phase clock)

Source: `apps/shared/tradeEmpire/season.ts` (185 lines).

- **4-phase cycle:** Prologue (24h) → Running (56d) → Closing (72h)
  → Interregnum (6h) → next Prologue.
- One DB row, server-canonical singleton, `seasonClockState` table.
- Season tick once per 24h (real-day aligned, "while you were
  gone" feed).
- Monotonic seasonNumber starting at 1.
- Declaration each season anti-correlates two sub-houses.
- **No real-world day/night cycle** in the codebase. The IRL
  seasonal overlay (§10 of the production doc) is additional.

### 3.4 Faction reputation (sub-houses)

Source: `apps/shared/tradeEmpire/houses.ts` (417 lines).

9 top-level factions × 31 sub-houses:

| Faction | Sub-houses | Intra-rivalry intensity |
|---|---|--:|
| Potentials | Restorationists ↔ Reformers | 0.5 |
| New Babylon | Authority's Ledger ↔ Civic Engineers | 0.7 |
| Hierarchy of the Damned | Severance ↔ Acquisitions + Syndicate of Death + R&D | 0.6 / 0.4 |
| Antiquarian | Shelf-mates ↔ Casino Floor + Cross-References Desk | 0.4 / 0.2 |
| Thaloria | Council of Wraith Hierophant ↔ Quietwork | 0.3 |
| Insurgency | Zero Doctrine ↔ Old Network | 0.8 |
| Artificial Empire | Architect's Court ↔ Substrate Rebels | 0.9 |
| Thought Virus | Sovereign's Circle ↔ Unaligned Swarm (unalignable) | 0.5 |
| Independent | Free Ports Coalition ↔ Unaligned Civilizations | 0.2 |
| Dreamer Shield | Behind the Shield (opaque, unalignable) | 0 |

**Cross-faction blood feuds:** Thaloria Council ⨯ New Babylon
Authority + Hierarchy Syndicate (intensity 0.3).

**Rep mechanic:** gain +N with house → rival loses -(N × intensity).

### 3.5 Companion trust (per NPC)

Per-NPC trust ladders summarized in §2.1 above. Total bands across
the cast:

```
Elara, The Human, GM, Oracle, Seer:    3-band
Eidolon, Vex, Companion (DMC), Nilmorg, Meme: 4-band
Locke, Degen, Wraith→Hierophant, Antiquarian, Drael'Mon, Jericho: 5-band
```

### 3.6 Morality / dominance

- `vortex_endgame_light_variant` / `vortex_endgame_dark_variant` —
  high-water-mark flags.
- `dischordiaCycleStore` — narrator dominance energy
  (Elara-vs-Human balance, runs continuous).
- `forgiveness_choice_made` + `lyra_vox_unlocked` — forgiveness
  sub-arc unlocking Lyra Vox third narrator.
- Maps to **light / balanced / dark** visual register at art-pass
  time (warm-gold / both / phosphor-lavender accent shift).

### 3.7 System unlocks

13 mech-tutor pairs (§3.1 above), plus:

- prestige cycle stats (6 components, see §3.10 below)
- battle-pass tier (cosmetics tracker)
- founding-author unlocks (`unlockCondition` types:
  act_completion / secret / battle_pass / founding_author /
  authors_edition).

### 3.8 Lore discovery

- 28-room mystery registry (`apps/shared/roomMysteries/index.ts`).
- 7 entry types in Loredex: Characters (135), Factions (16),
  Locations (26), Concepts (140), Events (44), Artifacts (16),
  Songs & Transmissions (118).
- `getAllAuthoredClues()` walks the registry, dedupes logged clues.

### 3.9 Identity chains (the seven competing prophets)

Source: `docs/design/NARRATIVE_ARCHITECTURE.md`. These drive the
foreground/mid/background mystery layers.

| Prophet | Chain (progressive reveal) | Real identity |
|---|---|---|
| Elara | Senator Voss → Panoptic (enslaved hologram) → Memory-wiped Ark operative | Potentials/Ne-Yons; betrayed humanity for Architect; swept into Ark 1047 |
| The Human | Student (Project Celebration) → Seeker → Detective → Last Archon | Organic Archon (1 of 10), imprisoned in substrate of every Ark |
| Kael / Source | Recruiter → Captured prisoner → Escaped thief → Thought Virus sovereign | Patient Zero; plague ships are 7 Bowls of Wrath |
| Oracle | Prophet → Prisoner → Jailer → White Oracle (destroyed Warden + Meme) | False Prophet; clone army from his genetic blueprint |
| Enigma / Malkia Ukweli | Kenyan activist → 12th Ne-Yon → Storyteller | Music as insurgency; one of Two Witnesses |
| Programmer / Dr. Daniel Cross | Creator of Logos AI → Disappeared → CCQ Murray Belteshazzar = **the Antiquarian** | Other half of Two Witnesses |
| Engineer / Prince | Kingdom heir → Galaxy's last inventor → [Secret: survives in Warlord's body] | Destruction of simulation |

### 3.10 Prestige cycle stats (carry-over)

6 components carried per cycle:
1. Loredex entries discovered
2. Bond-peak memories (3 canonical flags)
3. Narrator dominance energy
4. Dischordian cards collected
5. Witnessing milestones
6. Memorable moments (memorableMomentsStore)

---

## 4. Game-feature surface inventory (200+ routes)

Full inventory: a5367603 sub-agent transcript. Condensed mapping of
which Ark room hosts which feature launcher.

### 4.1 Launcher → Room map (canonical per design)

| Room | Features it should host |
|---|---|
| **Bridge** | Character Sheet, Quests, Battle Pass, Prestige Cycle Reset, Leaderboard, Governance Hub, Diplomacy, Strategic Forecasting, Search, Chess (Architect's Gambit), Star Chart, Recap Overlay landing, Bridge Console (home), Daily Brief popup |
| **Cryo Bay** | Character Creation, Crew Cloning, Apprentice Management, Companion Selection, Awakening replay, Pet Garden launcher (until D-pocket), Hellbox affordance toast trigger from Med Bay |
| **Medical Bay** | Combat Simulator (cards), Research Minigame, **Hellbox Resurrection** (must be visible), Status Recovery, Synthesis Chamber bulkhead (D10 entry) |
| **Personal Quarters** (Captain's Quarters) | Loredex Bookmarks, Conspiracy Boards, Hamlet Conspiracy Board, Favorites, Personal Décor, Companion Hub, Forgiveness Choice Panel, Act 1 Closing Choice Panel, DMC Clone Companion home, Dreamer Vision Player |
| **Archives** | Loredex Graph, Loredex Cluster, Loredex Investigation Board, Codex, Civilopedia, Lore Journal, User Tomes, Card Browser, Card Gallery, Imprint Gallery, Memory Energy, Card Achievements, Demon Pack Opening, Spectator Mode, Replay vault, Saga Timeline, Bestiary, Specimen Collection, Engineers Bench (lore section), Architect Dossier, Dreamer Dossier, Dreamer Fragments, Order of the Dreamer entry, Ark Explorer Legacy View, Card Trading entry |
| **Engineering** | Forge, Research Lab, Schematic Map, Hacking Puzzle, Pressure Monitoring, Engineer Logs, Memorial Corridor entry (post-unlock) |
| **Forge Workshop** | Advanced Crafting, Schema Collection, Anvil/Kiln/Schema Rack hotspots |
| **Observation Deck** | Music Library, Discography, Transmissions Inbox, Saga Timeline access, Watch (videos), Radio Mode, World Tapestry, Witnessing Hub, Planet Gallery, Alignment Meter, Architect cryptic page entry, Dreamer Fragment cryptic page entry |
| **Comms Array** | CoNexus Portal, Transmissions Inbox detail, Signal Decryption, NPC Inbox, Palimpsest Episodes, Saga Watch, Late Night with the Meme |
| **Armory** | PvP Arena, Boss Battle, Co-op Encounters, Pet Battles, Terminus Swarm, Tower Defense, Friendly Challenges, Competitive Tiers, Tier 5 PvP Hub, Boss Mastery, Coop Raids |
| **Cargo Hold** | Inventory, Collection, Draft Tournament, Cosmetic Catalog, Cosmetic Shop, Store, Suit Gallery |
| **Trophy Room** | Achievements Gallery, Marketplace Achievements, Titles, Card Achievements legendary modal, Memorial Plaza |
| **Antiquarian Library** | Tomes, CoNexus games, Card catalogue, Locked vault, Antiquarian's bust, Hierophant marginalia stack, Coda's purpose shelf, Velkraal correspondence, Insurgency witness roster, Recipe Archive |
| **Guild Sanctum** | Guild Page, Guild Hall, Guild Expansion, Guild Contracts, Faction Wars, Guild banners |
| **Social Hub** | Social Page, Roleplay, Friend list, Dossiers, Mess table interactions, Casual Gaming entry |
| **Station Dock** | Trade Hub doorway, Bounty Board, Marketplace Achievements, Faction trade, Coda's Trading-Floor Desk |
| **Engineering Core** | Engineer ultimate weapon/passive unlock UI, Reactor schematic |
| **Oracle Sanctum** | Seer's recordings, Prophecy mechanics, Oracle Deck divination |
| **Shadow Vault** | Assassin class unlock, Shadow Tongue containment/release UI, Manuscript pile |
| **War Room** | War Map, Tactical briefings, Casualty Board, Operation records, Faction Wars deployment |
| **Cipher Den** | Spy class unlock, Decryption minigames, Code-breaking |
| **Order Tribunal** | Order alignment unlock, Audit Ledger, Trade Court arbitration |
| **Chaos Forge** | Chaos alignment unlock, Entropy mechanics |
| **Elemental Nexus** | DeMagi species unlock, Spell synthesis |
| **Quantum Lab** | Quarchon species unlock, Probability Chamber |
| **Synthesis Chamber** | Ne-Yon species unlock, Genetic engineering, Recipe Board |
| **Trade Hub** (own room) | Trade Empire main UI, Trade Court, War Map external, Trade Contracts, Bounty Board satellite, Sector reputation |
| **Memorial Corridor** | Memorial Plaza, Fallen crew wall |
| **Pet Garden** | Pet Battles, Pet Breeding, Specimen Collection |
| **Heart of Time** (external vessel docked) | Degen's Casino, Pazaak Tournament, Casino Leaderboard, Christmas-in-July |
| **Dreams Workshop sub-basement** (Archives pocket) | Matrix: School Episodes, Darren Fessler's desk, Loredex corrections |
| **External venues** | Mol'Garath Audience, Mol'Garath Traps Feed, Dead Man's Circuit (kart racing), Hierarchy Throne |

### 4.2 HUD/UI surfaces requiring upgrade (37 floating layers)

(Already polished majority — listed for art-pass review.)

QuestTracker, QuestRewardSystem, AchievementToast,
LegendaryAchievementModal, AchievementUnlockToast,
CompanionCommentToast, RememberThisToast, FeatureUnlockToast,
HellboxAffordanceToast, MolGarathAudienceOfferToast,
RecruitAlignmentBadge, DiscoveryUnlockOverlay,
DiscoveryVideoOverlay, DiscoveryNotification, CommandConsole,
PlayerBar, CoNexusMediaPlayer, SoundControls, SortingCeremony,
RecapOverlay, RunTrackerOverlay, ImmersiveModeManager,
DischordiaCycleSync, WatcherHost, SlideshowPlayerRoot,
DreamerVisionPlayer, InstallPromptBanner, ForgivenessChoicePanel,
Act1ClosingChoicePanel, CutsceneRouter, RadioMode, EasterEggs,
UniverseAtmosphere, AutoTutorialPrompt, TitlePage, LoadingScreen,
AppShellImmersive, BridgeConsole.

### 4.3 Unbuilt or partial (the gaps the art pass will surface)

- Soul Stones System — design only, full stack missing.
- Pet/Specimen Breeding — schema partial, game loop missing.
- Living Character Sheet — art brief only, no component.
- **Trade Empire Phase D.5+** — schema-first; consumers missing
  (this is what the user wants finished before art-pass resumes).
- Global Light/Dark Alignment Meter — backend missing.
- Shadow Tongue Mystery Rooms — 9 of 26 done; 17 empty.
- Mobile Narrator integration — slot exists, only 1 page consumes.
- 5 named cutscene components — overlay exists, scenes missing.

---

## 5. Trade Empire — current state (the pivot target)

### 5.1 Files (canonical sources)

Directory: `apps/shared/tradeEmpire/` (18 files, ≈192 KB).

```
season.ts               4-phase clock (Prologue/Running/Closing/Interregnum)
houses.ts               9 factions × 31 sub-houses, rivalry intensity
contracts.ts            buyer/seller pairs, route-based, duration windows
routes.ts               galactic trade paths, sector access
brokers.ts              NPC intermediaries (Veska handoff)
agendas.ts              proactive NPC goals (advance per season tick)
declarations.ts         seasonal political stance, anti-correlate sub-houses
demands.ts              season-long taxes
edicts.ts               political mandates
convergenceClimax.ts    endgame battle (phase 4+, TBD)
colonyCommerce.ts       founding lanes, settlement contracts
galacticEvents.ts       solar flares, raids, booms
itemTags.ts             alignment markers
researchRaces.ts        parallel advancement
cargo.ts                item slots, rarity, stacking
```

Server-side:
- `apps/server/routers/tradeEmpire.ts` (≈ 7,700 lines — mission
  dispatch, route tracking, sector reputation)
- `apps/server/services/seasonClockService.ts`
- `apps/server/services/seasonTickService.ts` (agenda steps, rep
  settling, phase transitions)
- `apps/server/routers/tradeContracts.ts`
- `apps/server/routers/tradeCourt.ts`
- `apps/server/routers/tradeWars.ts`
- `apps/server/routers/warMap.ts`

Client:
- `apps/client/src/pages/TradeWarsPage.tsx` (= TradeEmpirePage)
- `apps/client/src/pages/TradeCourtPage.tsx`
- `apps/client/src/pages/WarMapPage.tsx`

### 5.2 What is shipped (Phase 1)

- Data model + invariants present
- DB schema present (incl. Phase D.5 tables: `tradeRouteSaturation`,
  `tradeResearchRaces`, `convergenceClimaxState`)
- Mission dispatch + route tracking + sector rep wired
- Season clock state + ticking present
- Houses + sub-houses + rivalry math present
- Trade Court arbitration UI polished
- War Map sector-control UI polished

### 5.3 What is NOT shipped (the gap to close)

Per `docs/INCOMPLETE_DESIGNS_AUDIT_2026-05-08.md` §2 + the
inventory agent's report:

- **Mission completion loop** — schema-first; consumers missing for
  Phase D.5 tables.
- **Agenda ticking + declaration resolution + tribute settlement**
  — designated for Phase 4 in season.ts; not running.
- **Convergence Climax state machine** — endgame phase exists in
  schema, no consumers.
- **Sector saturation** (price crash) — `tradeRouteSaturation`
  table no consumers.
- **NPC racer research races** — `tradeResearchRaces` no consumers.
- **Vex reveal cadence delivery** — blocked by mission-loop.
- **Coda Agency mission system** (per
  `docs/design/EXPANSION_BIBLE.md`) — design only.
- **Colony Commerce founding lanes** (Veska handoff from breeding)
  — referenced, not wired.

### 5.4 Open design canvas (already noted but not the target right now)

If the user later wants the Trade Empire **expansion** (Phase 2–7
new ports/places), that's the blocked work in
`INCEPTION_ARK_FINAL_PRODUCTION.md` §6 — see notes file §0 resume
order, item 6.

---

## 6. Governance — current state (already shipped, not a blocker)

Source: `apps/shared/governance.ts` (470 lines).

- 3 vote types: Monthly (4/month), Daily (binary, deterministic),
  Annual headlines (4/year).
- VoteResult + Antiquarian inscription template.
- AI voter simulation (mirrors real distribution).
- Antiquarian tome entries (week-keyed).
- Participation tracking (10+ counters).
- 4 annual headlines:
  1. State of the Ark (M1 W1) — budget allocation
  2. Faction Succession (M4 W2) — banner leader
  3. Apocalypse Protocol (M7 W3) — failsafe rehearsal
  4. The Oracle's Question (M10 W4) — knowledge path

This is shipped; the 2-year strategic plan in
`INCEPTION_ARK_FINAL_PRODUCTION.md` §5 builds on it (calendar
plotting + art reflection of vote outcomes), not new mechanics.

---

## 7. Hand-off facts for the Trade Empire work

When work resumes on Trade Empire, the relevant priorities are:

1. **Wire Phase D.5 consumers** — `tradeRouteSaturation`,
   `tradeResearchRaces`, `convergenceClimaxState` need readers and
   writers.
2. **Activate agenda ticking** in `seasonTickService.ts` — the
   skeleton is there; the tick handler needs to fire agenda steps,
   resolve declarations, apply rep deltas at interregnum.
3. **Mission completion loop** — `tradeActiveMissions` →
   `tradeCompletedMissions` transition needs the full state
   machine (start → in-progress → returning → arrived →
   payout/failure).
4. **Convergence Climax state machine** — at least the read path
   (the writer can be admin-triggered until Act 7 lands).
5. **Vex reveal cadence** — the engineer-zero-hint and
   engineer-zero-confirmed reveal stages (§2.1) are gated on
   mission-loop trips. Without them, Vex stays at vex_public.

The art-pass document will reflect Phase D.5 in §6 of the main doc,
but cannot do so until the runtime wiring is real (otherwise the
art renders state that the engine doesn't know how to enter).

---

## 8. Files this analysis touches (zero modifications were made)

This notes file and the §0–§1 of `INCEPTION_ARK_FINAL_PRODUCTION.md`
are the only writes from this session. Nothing else in the repo
was changed. Specifically:

- No code changes.
- No schema changes.
- No prompt-file changes.
- No CDN uploads.

The four sub-agents read but did not modify anything.

---

*End of working notes. Resume the production document at
`INCEPTION_ARK_FINAL_PRODUCTION.md` §2 once the Trade Empire is
through Phase 4.*
