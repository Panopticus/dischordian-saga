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

*End of original working notes. Resume the production document at
`INCEPTION_ARK_FINAL_PRODUCTION.md` §2 once the Trade Empire is
through Phase 4.*

---

# Phase 1.5 — Comprehensive scope-expansion findings

The user expanded the production doc scope twice. Five Explore
agents returned exhaustive inventories; this section captures
their findings as the working source for downstream chapter
authoring. Sections §9–§13 below are structured digests; full
agent transcripts live at the task output paths recorded in
session metadata.

---

## 9. TV Infection / Demon Summoning / CADES (Phase-1 Agent A)

### 9.1 Thought Virus Infection

**Runtime:** Per-room load 0–100 with 5 stages (clean / exposed
/ spreading / corrupted / quarantined). `contaminatedRooms[]`
array on InfectionState; adjacency-graph propagation on 6h
ticks. 5 named TV residue inventory items act as collectible
proof of contamination.

**Cure paths (5):** Resonance purge, faction quarantine
declaration, demon-pact buy-out, Antiquarian uncorruption ritual,
Engineer reactor flush.

**Visual register per stage:**
- **Clean** — no marker.
- **Exposed** — wisps of voidblack at vents and seams; one
  surface shows a slow black mycelium thread (≤6 cm).
- **Spreading** — black mycelium creeps from corners across one
  wall ≤30%; surface texture buckles slightly; air shimmers
  cold-violet.
- **Corrupted** — walls breathe (subtle peristalsis); surfaces
  buckle; pooling voidblack at floor junctions; ambient palette
  shifts cold; biohazard-amber edge tape begins to appear at
  doorways.
- **Quarantined** — biohazard-yellow band fully sealing room
  perimeter; sealed-tape Xs across exits; ambient red wash;
  ventilation grates plugged with mycelium plugs.

### 9.2 Demon Summoning / Soul Stones / Blood Weave

**Hellboxes** are diegetic portals into "parts of the Matrix of
the Dreams." Three are documented: Med Bay (Hellbox 1), Hierarchy
Throne → Castle of Death (Hellbox 2 — new), Celebration School
→ Artist Prince Conspiracy Board (Hellbox 3 — new). Each has a
discovery scene + room-state appearance + opening cutscene.

**Soul Stones** carry tri-state: Violet (neutral/held), Red
(corrupted, fed to Hierarchy), Gold (purified, offered to
Dreamer). Drop rates: Arena +1 violet; Terminus 1/5 waves; Story
2/chapter; Secrets 1/secret (gold pre-purified); NPC trust 20s
1 violet; Betrayals 1 red. Weekly cap 15 from combat sources;
narrative sources uncapped.

**Demon-pet alignment bands × archetypes:** 5 bands × 3
archetypes = 15 cosmetic threads on demon-crew sprites. 10
demon companions designed; 6 divine companions; ascended /
spectral terminal stages on `eidolonBonds` table.

**Diegetic homes (locked):**
- Med Bay Resonance Chamber → soul-stone purification pedestal
  beside the helix.
- Castle of Death (Hellbox 2 pocket) → corruption summoning
  circle.
- Personal Quarters → favourites shelf for held stones.

### 9.3 CADES

**State machine:** locked → unlocked → m1_in_progress →
m1_complete → ... → m7_complete → bridge_of_kael_post_credit.
Async PvP via `cadesPvpMatches` table (matchId, player1Id,
player2Id, scenarioSeed, scenarioMode = `last_stand`,
player1Score, player2Score, winnerId, status, startedAt,
endedAt).

**Source files:** `apps/shared/actsFourFiveShells.ts:152-228`
defines CADES_FPS_MISSIONS (7 missions).
`apps/shared/suitAdapters/fps.ts` handles Godot postMessage
serialization. `apps/server/routers/cadesIce.ts` mints TURN
credentials for WebRTC.

**Diegetic surface:** Bridge of Kael is canonical finale (post-
M7 ambient state change: captain's chair empty and warm, Agent
Zero's station vacant cleaned, Dischordia card on her console
showing Engineer's silhouette, Elara's portrait flickers, Human
silent). Missing: CADES violet-helmet chair console (Med Bay
restricted section), Mission Briefing pod, Async PvP Lobby /
spectator station, Post-Credit Shrine.

**Helmet reflection content:** Per-mission, the violet helmet
captures one image-fragment of the mission's emotional climax.
Seven fragments visible on the helmet's interior surface after
M7. None visible pre-M1.

---

## 10. Achievement / Trophy Taxonomy (Phase-1 Agent B)

### 10.1 Existing trophy themes (6 — `apps/shared/trophyDisplays.ts`)

Heroic, Stoic, Lyric, Ancient, Surreal, Crystalline. Each is a
visual treatment for the trophy itself (silhouette, material,
plinth, light source). In the new spec, these become a
room-skin axis on Trophy Room visual-mood overlay rather than
six pedestal themes.

### 10.2 Counts

- **Imprint Gallery:** 90 character-imprint frames (one per
  shipped imprint; reserves slots for future).
- **Essence Ledger:** 150+ Loredex essence entries; visible as
  bound codex on a reading lectern; player favourites drive
  which page is open.
- **Boss Cosmetics Rack:** N mannequins (boss-mastery cosmetic
  loadouts), scales with boss roster.
- **Achievement Badges Rack:** modular tier banding (bronze /
  silver / gold / platinum / diamond); accommodates current
  ~50 achievements with reserved slots for seasonal additions.
- **Title Wall:** engraved title plates as scrolling frieze.
- **Prestige Tier:** top dais, prestige-class items.
- **Legacy Tier:** boss-kill mounts and hero artefacts.

### 10.3 Trophy Room scaling spec

Multi-zone replacing the 10-pedestal model: Title Wall +
Prestige Tier + Legacy Tier + Achievement Badges Rack + Imprint
Gallery (90 frames) + Essence Ledger (150+) + Boss Cosmetics
Rack. Six trophy themes layer as visual-mood axis (e.g., room-
skin = Heroic makes plinths bronze; Surreal makes them
iridescent).

---

## 11. Story Item Registry source data (Phase-1 Agent C)

**~260 enumerated items**, **~30–40 with no diegetic home.**

### 11.1 Categories and counts

| category | shipped | source |
|---|---|---|
| Pet species | 20–30 (8 main: Flicker Imp, Spore Fungus, Void Crawler, Data Serpent, Gilt Beetle, Holo Fox, Temporal Kitten, Glyph Moth) × 4 rarity | `petSpeciesTraits.ts` |
| Earned loadout items | 25 (5 classes × 3 species) | `earnedLoadouts.ts` |
| CoNexus tomes | 7 shipped (Garden Under Sand, Ledger for the Unborn, Breath We Did Not Take, Calculus of the Long Table, Secondary Engineer, What Kael Kept, Room with the Open Window) | `coNexusTomes.ts` |
| Soul stones | 3 colors × N held | `transmissions.ts` + `SOUL_STONES_SYSTEM.md` |
| Story artefacts | 10 (burnt seer's card, torn ID tag, data-slate fragment, silver locket, unlabeled vial, DNA receipt plate, Iron Lion oath token, captain's master key, Akai Shi mercy token + soul-stone tri-state) | `cryoBayMystery.ts`, `memorableMoments.ts` |
| Personal Quarters décor | 120+ across 12 categories × 6 zones | `personalQuarters.ts` |
| Cosmetics | 25 (3 tiers) | `cosmeticCatalog.ts` |
| Guild Hall décor | 30+ across 12 rooms × 5 tiers | `guildHall.ts` |
| Transmissions | 11+ Epoch 1 episodes | `transmissions.ts` |
| Faction standings | 5 factions × 5 bands | `factions.ts` |

### 11.2 Items with NO current diegetic home (~30–40)

**HIGH PRIORITY (narrative impact):**
1. Demon & Divine Companion manifestations (10 demon, 6 divine)
2. Soul Stone Purification Chamber pedestal (Med Bay)
3. Castle of Death summoning circle
4. Bloodline Plinth (Pet Garden — crew lineage)
5. Pet Evolution Chambers

**MEDIUM PRIORITY (flavor / immersion):**
6. DNA Receipt Plates
7. Captain's Quarters Legacy Wall (10 plates)
8. Hierophant's marginalia stack (Antiquarian Library)
9. Coda's purpose shelf (Antiquarian Library)
10. Velkraal's correspondence folio (Antiquarian Library)
11. Pazaak deck & cards
12. Memorial Plaza fallen-crew plaques
13. Iron Lion service tokens

**LOWER PRIORITY (systems):**
14. Crafting Schema display
15. Broadcast Cylinders (transmission media)
16. Faction standing badges (championed/enemied physical)
17. Casino event tokens (Christmas in July)

### 11.3 Cryo Bay artefacts (5/5 placed)

Torn ID tag, data-slate fragment, silver locket, unlabeled
vial, frosted-glass cord — all on hotspots in §2.1.

---

## 12. Mystery Atlas + Event-State Matrix + Subsystem Deep-Dive (Phase-1.5 Agents A/B/C)

### 12.1 Mystery Atlas — 6 NPC arcs × 5 episodes = 30 episodes

| arc | core mystery | rooms | episodes |
|---|---|---|---|
| Wraith Calder | Crystalline-City fall + Hierophant resurrection | Comms Array, Antiquarian, Cipher Den, Oracle Sanctum, Engineering Core, Station Dock | E1: Bounty file + Witness journal; E2: Substrate-N residue + cargo manifest; E3: Hierophant ceremony; E4: Continuous witnessing; E5: Prophet's true identity |
| Jericho Jones | Iron Lion + Akai Shi killing + Thaloria | Antiquarian (card catalog), Med Bay (bio-bed), Engineering | E1: Callsign history; E2: Battle of Thaloria; E3: Pre-Fall Lionism + grip anomaly footage; E4: Legacy/succession; E5: Contract inheritance |
| The Seer | DO-NOT-PLAY tape + VAR-1109A/B prophecy pair | Antiquarian (locked vault, marginalia stack), Engineering (reactor) | E1: DO-NOT-PLAY band + sealed letter; E2: Hierophant marginalia; E3: DEC-7710 catalog card; E4: Acoustic signature (reactor hum = recording drift = Vex's fingerprint); E5: Canon Register paradox |
| Vex Solène | 40-year career + apprentice handover + calibration session | Engineering (reactor, schematic-pad, blueprints, egg-eng-formula), Captain's Quarters (vex-workshop-diary), Antiquarian (insurgency-witness-roster) | E1: Equipment signature; E2: Workshop letter; E3: Apprentice draft letter; E4: Tool migration map + handover documentation; E5: Scheduled calibration session (06:00 tomorrow) |
| The Degen | Coda trusteeship + Mol'Vereth audit | Engineering (schematic-pad, blueprints), Antiquarian (codas-purpose-shelf), Captain's Quarters (degens-corner) | E1: Brokerage line #4711; E2: Quarterly routing pattern; E3: Coda Purpose Brief; E4: Treasurer's emergency note; E5: Letter to the saga + empty chair at Ne-Yon |
| Game Master | Velkraal succession + Brel pre-read protocol | Antiquarian (velkraals-correspondence-folio), Engineering | E1–E2: Succession letter; E3: Practice edit-drafts; E4: Draft closing-edit + Brel's pre-read initials; E5: Final session protocol |

**Coverage gaps:** Acts 1–2 conspiracy boards missing (Acts 3–7
have `secret_act_N_revealed` flags). Arc-episode VO assets
unproduced. CADES helmet narrative surface absent.

### 12.2 Cryo Bay 7-hotspot tier-tree

Pod Zero (4 tiers); Cracked Panel (3 tiers); Medical Chart (2
tiers); Personal Effect (silver locket); Data-Slate (hidden);
Frosted Glass (ID tag); Combine (torn-id + data-slate → victim
ID + Med Bay unlock).

### 12.3 Engineering 7 combine rules

1. Decoder + Key → Master Decoder
2. Schematic-Rubbing + Corrupted-Fragment → Restored Schematic
3. Drained-Cell + Energy-Shard → Charged-Cell
4. Basic-Medkit + Neural-Stim → Enhanced-Medkit
5. Antenna + Amplifier → Signal-Booster
6. Virus-Sample + Antibody → Viral-Antidote
7. Antiquarian-Shard + Void-Crystal → Temporal-Lens

### 12.4 Artist Prince Conspiracy Board

LucasArts-style: 8 clue cards + 5 board connections + 1
Mol'Garath-final connection. Located in Celebration School,
accessed via Hellbox 3.

Clues: Ghost on ramparts; Uncle blocks messenger; Banner
glitches; Ghost names Warlord; Warlord reveals himself; Patron
is Architect proxy; First Celebration destroyed; Prince is
Engineer.

Connections: Ghost→Ghost-speaks; Uncle-blocks→Warlord-revealed;
Banner→Warlord; First-destroyed→Prince-is-Engineer;
Patron→First-destroyed.

### 12.5 Bloodline Witness Reports (Lyra Vox, 5 milestones)

1. Dynasty Reached (Gen 3) — gestation-speed bonus 300 bp
2. High-Fitness Birth (≥80 fitness) — mutation-favor 300 bp
3. Founder Passed — integrity-floor 600 bp
4. Drift Exceeded (≥60) — integrity-floor 800 bp
5. Centenary (10 generations) — all bonuses 500 + 400 + 200 bp

Authored in `lyraVoxBloodlineWitness.ts`; UI surface not
implemented.

### 12.6 LOREDEX

86 character entries (entity_1–entity_101). Notable: entity_1
The Programmer; entity_2 The Architect; entity_3 CoNexus;
entity_7 Shadow Tongue; entity_47 Dr. Lyra Vox; entity_73 Wraith
Calder; entity_75 Jericho Jones; entity_91 Mol'Garath.

### 12.7 Event-State Matrix — 22+ systems

**Shipped (14):** Seasonal Events, Faction Standing, Act
Progression, Governance Hub Votes (40+ × 6 consequence types),
Epoch Witness, PvP/Leaderboards, Live Events / Architect
Console, Battle Pass, Mission Outcomes, Shadow Tongue Mysteries
(34 modules), Prestige Cycles, Community Investigation,
Notification Producers (44/58), Mobile Narrator.

**Partial (5):** Yearly Events / Anniversary, Trade Empire
Mission Loop, Global Light/Dark Alignment Meter, Notification
Producers (14 missing), Mobile Narrator Adoption.

**Scaffolded (3):** Soul Stones System, Pet Breeding (full
multi-generational), Living Character Sheet.

(Borderlines: Shadow Tongue Multi-Stage Art Tiers — partial; 5
Named Cutscene Components — scaffolded.)

**Top-10 "world-feels-alive" hooks (ranked):** Global Alignment
Meter; Trade Empire Mission Loop; Prestige Cycle visual variants
per room; Battle Pass theme per-room overlay; Investigation tier
art variants; Faction-driven NPC presence + room livery;
Seasonal cosmetic overlays; Governance vote consequence visible
immediately; Companion trust cosmetics in rooms; Vortex
proximity sector-state rendering.

### 12.8 Subsystem Deep-Dive — state machines

#### Cloning / Resurrection
States: idle → open_resurrection_quest → completed_path_a →
path_a_resolved (+ implicit path_b). Per-NPC `cloneDegradation`
(1 = echo-cost, 2 = true permadeath). Source:
`apps/server/routers/resurrection.ts`,
`apps/shared/resurrectionProtocols.ts`,
`npcWorldDeathState.ts`. Diegetic gaps: Cryo Console with pod
states + degradation meter, Resurrection Protocol Interface,
Echo Cost (samsara echo glow).

#### Pet Breeding (MVP)
States: queued → incubating → ready → claimed/cancelled. Source:
`apps/server/routers/petBreeding.ts`, DB
`petBreedingPairs:7387`. 7 elements (air/earth/fire/water/time/
space/probability) × 4 rarity tiers (common 0–40, uncommon
40–65, rare 65–90, epic 90+). Diegetic gaps: Incubation Chambers
(queued/incubating/ready pod-color states); Genealogy Tree;
Specimen Hatchery rarity-aura variants.

#### Pet Garden / Pet Arena
Lifecycle: egg → hatched → growth → evolution_ready → evolved →
battle_ready → injured → retired/deceased. 7 species × 4–7
evolution stages × 5 bond tiers × 3 activity states = ~1,000+
visual combinations. Diegetic gaps: Sanctuary, Medical Annex,
Arena Viewing Gallery, Breeding Wing, Retirement Shrine.

#### CADES (FPS, 7 missions + post-credit)
Source: `apps/shared/actsFourFiveShells.ts:152-228`,
`apps/shared/suitAdapters/fps.ts`,
`apps/server/routers/cadesIce.ts`. Async PvP via
`cadesPvpMatches`. Diegetic gaps: CADES Console with mission
progress + Iron Lion helmet hologram; Mission Briefing pod;
Async PvP Lobby; Post-Credit Shrine.

#### Tower Defense
Source: `apps/server/routers/towerDefense.ts` + `apps/shared/
towerDefense.ts`. DB: `towerPlacements`, `raidLogs`,
`raidTrophies`, `dailyStreaks`, `defenseWaves`, `tdLiveSieges`.
20+ tower types (laser_turret, missile_launcher, barrier_wall,
healing_pylon, artillery_cannon, tesla_coil, oracle_spire,
shadow_trap …). 16 leagues (bronze_1 → legend). **Zero Ark
surface today.** Diegetic gaps: Defense Command Center; Trophy
Armory; Tower Assembly Bay.

#### Chess
Source: `apps/server/routers/chess.ts`, `chessClimb.ts`,
`chessPuzzle.ts`, `chessSideGate.ts`. DB: `chessGames`,
`chessRankings`, `chessTournaments`, `chessPuzzleProgress`,
`chessTutorialProgress`. 9+ character play-styles (Architect
+200 ELO bonus, Enigma +100, Oracle, Collector, Warlord …).
365 daily puzzles. **Zero Ark surface today.** Diegetic gaps:
Chess Hall, Grand Master's Sanctum, Puzzle Study Chamber, Casino
Gaming Floor.

#### Trade Empire (light touch — owned by parallel agent)
Source: `apps/server/routers/tradeEmpire.ts`. DB: 6 normalized
tables. Diegetic gaps: Trade Command Center / Merchant's Hall,
Cover Identity Board, Cargo Manifest, Broker's Office.

#### Governance Hub Votes
States: open → in_progress → closed → outcome_announced →
consequence_applied. 4 annual headlines + monthly/seasonal +
365 daily resource votes. 6 consequence types: `set_flag`,
`energy_delta`, `tome_entry`, `world_modifier`, `unlock`,
`faction_delta`. Diegetic gaps: Governance Chamber / Council
Conclave; Daily Resource Allocation Board (24h countdown);
Faction Succession Monument; Oracle's Sanctum.

#### Epoch Witness
States: locked → unlocked → cast → tallied → consequence_applied.
5 epochs (Privacy, Prophecy, Insurgency, Revelation, Fall of
Reality). 7 archetype gates (WATCHER/INVENTOR/ADVOCATE/SEER/
PROGRAMMER/POLITICIAN/WITNESS). Cumulative `shadowTonguePower`
0–100 + `grandEditActive`. **Zero Ark surface today.** Diegetic
gaps: Epoch Witness Conclave; Shadow Tongue Uncorruption Bench
/ Cipher-Den; Nexus Point Sanctum; Community Prophecy Wall.

#### Soul Stones / Eidolon Bond (bonus 10th subsystem)
Eidolon stages: fragment → companion → ascended → spectral.
Router: `soulStonesRouter`. DB: `eidolonBonds`. Diegetic gap:
Eidolon Sanctum / Bond Chamber. (Soul Stones purification/
corruption economy itself remains scaffolded.)

---

## 13. HUD/UX/UI Inventory + Expansion Hooks + Storyteller Slots (Phase-1.5 Agents D/E)

### 13.1 HUD/UX/UI inventory

**60+ surfaces across 12 categories.** Aggregate: Void-Energy
adoption ~45%; framer-motion coverage ~50%; audio coverage
~15%; accessibility readiness ~25%; mobile haptic unification
0%.

#### Components missing entirely (11)

Friends List, Chat, Party Invite, PvP Matchmaking Lobby, Replay
Scrubber, Loadout Switcher, Unified Resource Counter, Unified
Loredex Viewer, Unified Transmission Video Player, Live-Event
GM Overlay, Audio-Cue Deaf-Mode visual indicators.

#### Top-15 AAA-polish opportunities

1. Morality Meter tier-up celebration
2. Hand Fan card juice + audio
3. Match Summary win/loss fanfare
4. Loading / Route Transition contextual messaging + parallax
5. Combat Board audio design pass
6. Toast / Notification design + audio per type
7. Achievement Unlock toast confetti + category color + sound
8. Dialogue Box speaker audio stinger + portrait entrance
9. Resource Counter unified design system
10. Health / Shield smooth animation + damage-number scale
11. Replay Scrubber component (build new)
12. Chess Clock tension audio
13. Ark Map room-icon animations + entry parallax
14. Choice Menu consequence preview + branch color coding
15. Loading flourish + completion chime

#### Surface category file pointers

A. Persistent Chrome — `AppShell.tsx`, `MoralityMeter.tsx`,
`NotificationBell.tsx` + sonner, `LoadingStates.tsx`,
`PageLoader.tsx`, `RoomTransition.tsx`,
`ReconnectingOverlay.tsx`, `AchievementUnlockToast.tsx`,
`VoiceWhisper.tsx`, `VoCaption.tsx`.
B. Player Identity — `AnimatedPortrait.tsx`,
`PaperDollRenderer.tsx`, `SpriteCharacter.tsx`, `Progress.tsx`,
`CharacterAuraOverlay.tsx`, `ShaderOverlay.tsx`.
C. Combat / Card-Duel — `DuelystGameUI.tsx` (2043 lines),
`BoardRenderer.tsx`, `MatchSummary.tsx`, `DeckBuilder.tsx`,
`PackOpening.tsx`, `WarlordCountdownIndicator.tsx`.
D. Narrative — `CinematicDialogOverlay.tsx`,
`ElaraDialogBox.tsx`, `ChoicePanel.tsx`,
`Act1ClosingChoicePanel.tsx`, `TransmissionDisplay.tsx`,
`CoNexusMediaPlayer.tsx`, `AwakeningJournalEntry.tsx`,
`CodexPage.tsx`, `ClueJournal.tsx`, `LoreJournalPage.tsx`,
`OpeningCinematic.tsx`.
E. Navigation / Room — `ShipSchematicMap.tsx`,
`ArkFastTravelModal.tsx`, `ArkOrientation.tsx`,
`ArrivalCinematicRenderer.tsx`, `PointAndClickScene.tsx`,
`CADESClueBoard.tsx`, `CADESFeed.tsx`, `QuestTracker.tsx`,
`PetQuestTracker.tsx`.
F. Inventory / Collection — `CardBrowserPage.tsx`,
`CardGalleryPage.tsx`, `CollectionView.tsx`,
`CosmeticShopPage.tsx`, `StorePage.tsx`, `PetRoster.tsx`,
`PetGardenPage.tsx`, `SoulStonesPanel.tsx`, `TrophyRoom.tsx`.
G. Multiplayer / Social — `GuildPage.tsx`,
`CrewRosterView.tsx`, `FactionWarEventBanner.tsx`,
`SeasonalEventsPage.tsx`, `LeaderboardPage.tsx`,
`FightLeaderboardPage.tsx`, `SpectatorPage.tsx`.
H. Meta / Admin — `SettingsPage.tsx`,
`SettingsSearchModal.tsx`, `ArchitectConsolePage.tsx`,
`ArchitectDossierPage.tsx`, `BattlePassPage.tsx`,
`GovernanceHubPage.tsx`, `a11y.tsx`.
I. Mini-Games — `ChessBoard.tsx`, `ChessPieces.tsx`,
`ChessSessionBanner.tsx`, `ChessPostGameReview.tsx`,
`LockeConfidentialLedgerPanel.tsx`.
J. Mobile-Specific — `GestureTutorial.tsx`.
K. Audio — (no dedicated player UI today).
L. Accessibility — `a11y.tsx` (`ScreenReaderOnly` utility).

### 13.2 Expansion Hooks (15 systems)

1. Card system — `unlockCondition` discriminated union
   (`act_completion`/`secret`/`battle_pass`/`founding_author`/
   `authors_edition`); Acts 5–7 reserved.
2. Expansion-art manifests — `apps/shared/expansionArt/` +
   `assetUrl()` resolver.
3. Room-tier progression — `apps/shared/roomTier.ts` (4 rooms
   tiered today; 23 default to tier 0).
4. Room-mystery scaffolding —
   `apps/shared/roomMysteries/_template.ts`.
5. Transmission/broadcast extensibility — `transmissions.ts`
   trigger schema + `broadcastLibrary.ts` 30 voice interrupts.
6. NPC dialogue trees — 7 canonical NPCs with trust gates
   (0/20/40/60/80/100+).
7. Companion arc / romance ladder — `romanceLadders.ts` 5-stage
   gates.
8. Loredex bidirectional discovery —
   `apps/client/src/data/loredex-data.json` (113 character +
   109 concept) + `loredexGraph.ts`.
9. Apprentice / crew tick — `crewTick.ts` 1d IRL = 1mo in-game.
10. Battle pass tier system — `battlePassConfig.ts`.
11. Reserved card IDs — `reservedCards.ts`.
12. Narrative-flag registry — `GameContext.narrativeFlags`
    (`<roomId>_<event>` convention).
13. Chat / VO interrupt registry — `broadcastLibrary.ts` pure
    data.
14. Prestige cycle / seasonal drops — `prestige.ts` +
    `dischordiaCycle.ts`.
15. Pet evolution stages — 3-stage card variants
    (`s1_pack_pet_<species>_<stage>`).

### 13.3 Storyteller Slots (8 categories — no-code authoring)

1. Transmission scripts (JSON: title, intro/outro, synopsis,
   `relatedLoredexEntries`)
2. Loredex marginalia / annotations (JSON; Shadow Tongue
   indigo overlay)
3. Room-inscription / plaque text (hotspot JSON: name,
   description, elaraDialog)
4. NPC dialogue trees (JSON; trust-gated scenes)
5. Transmission ↔ Loredex unlocks (`relatedLoredexEntries`)
6. Clue Journal entries (room mystery JSON)
7. Loading-screen tips / quotes / epigraphs (no central system
   yet; designed)
8. Achievement flavor text (JSON definitions)

### 13.4 Per-room narrative-seed catalogue (highlights)

Agent E authored 2–4 narrative hooks + 1–2 expansion-reserved
zones + 1 living-world detail per room across 33 rooms. Selected
seeds (full set to be reproduced verbatim into the production
doc's §11 Living-World Slow-Tick Catalogue):

- **Cryo Bay**: Silent Archives chronometer cycling timestamps;
  Last Message scratched behind sealed pod ("don't go to the
  Bridge"); Void Echo particles in Pod Zero fluid; reserved Bay
  7 draped in canvas. Living-world: 24h defrost cycle; every
  7th day, one pod stutters.
- **Medical Bay**: Vox Neural Bridge journal expansion across
  tiers; Cure Notes for Patient X; Healer's Final Log; Unlabeled
  Vial growing colder/darker monthly. Living-world: bio-bed
  vital-signs cycle showing flatlines from old patients every
  4th cycle.
- **Bridge**: Ghost Commander's Shift Log; Consensus Breaking
  Point (Conspiracy Board flickers 43↔44 connections); War
  Table Phantom Move (1 move per IRL day); Navigation to Nowhere
  ("Sanctuary" vector). Living-world: new Conspiracy Board
  connection every 72h.
- **Engineering**: Incomplete Engine Schematic (final 8%
  deleted); Counting Tally on wall (Human's day-count
  incrementing daily); Engineer's Tool Set with one tool
  missing; substrate-integrity heartbeat alert. Living-world:
  10-min crafting sound-loop (whirr/ping/hiss).
- **Comms Array**: Queue of Lost Signals (centuries-spanning);
  Frequency Wall (52.7 MHz pure sine = Human's substrate);
  Interrupted Conversation; Silence Beacon (24h pulse).
  Living-world: hourly ambient chatter; every 7h one phrase
  clear.
- **Captain's Quarters**: Ghost Commander's reassignment log;
  master-key reveal flow; 10-plate Legacy Wall slot system.
- **Trophy Room**: Ghost Trophy (achievement = unknown);
  Unreachable Trophy (Act 4 prestige); Fallen Heroes Wall;
  Inscription Challenge (player's legacy plaque).

(Full per-room seed catalogue continues in Agent E's report;
reproduce into §11 when authoring that chapter.)

---

*End of Phase 1.5 working notes. The production document
chapters §3 onward distill from these notes; do not duplicate
prose between this file and the published doc.*
