# Inception Ark — Final Production
## The Living-Ark Art Bible (Nano Banana 2 / Veo 3.1)

> **STATUS — IN PROGRESS 2026-05-09.** Authoring resumed on
> everything *except* §6 (Trade Empire Phase 2–7 expansion), which
> remains paused while a parallel agent finishes the Phase D.5
> consumers, season-tick activation, mission-loop, and Convergence
> Climax. §6 is a stub pointing at the parallel work; it will be
> filled in once the runtime exists for it. Companion inventory
> document `INCEPTION_ARK_FINAL_PRODUCTION_NOTES.md` captures the
> full upstream analysis (33 rooms, 16 NPCs, 8 state axes, 200+ UI
> surfaces) and the Trade Empire gap-analysis hand-off. Do not
> delete the notes file.

> **Scope:** every visitable room on Ark 1047, every NPC state inside it,
> every game-feature launcher that needs a surface, every state-axis
> delta (act, faction, season, trust, morality, system unlock, lore
> discovery, real-world season), the 2-year strategic governance plan,
> the Trade Empire Phase-2-through-7 expansion, the universal-events
> reflection matrix, and the discovery cutscene shortlist.
>
> **Authoring contract.** Every prompt below is engineered for
> deterministic recreation across iterations: the **Master Style Lock
> (§1.1)**, the **per-room Layout Sentence**, and the **per-NPC Visual
> Canon Line** are reproduced **verbatim** in every variant. Only the
> **State Layer** at the end of the prompt changes. Nano Banana 2 is
> seed-stable across consistent leading tokens — keep the leading
> tokens identical and you keep the room.
>
> **This document supersedes** `roomStateArtPrompts.ts` (covered: 2
> rooms × 4 states), `roomTierArtPrompts.ts` (covered: 2 rooms ×
> 4 tiers), and `roomMediaPrompts.ts` (covered: shadow-vault). It does
> not replace them — it extends them across all 33 rooms × all 8
> state axes, and provides the runtime resolver mapping at the end
> (§11.3). The old files remain canonical for the rooms they cover;
> this document fills the rest.
>
> **Sibling docs (do not duplicate):**
> `NANO_BANANA_VEO_FULL_PROMPT_BOOK.md` (cinematics, character
> turnarounds, VFX tokens), `CONSISTENCY_GATE.md` (sign-off
> checklist), `VOICE_OVER_BIBLE.md` (voice ids — never re-cast here),
> `ART_DEPARTMENT_PRODUCTION.md` (production cadence + queue).

---

## Table of Contents

0. [How this document works](#0-how-this-document-works)
1. [Master Style Lock — the recreation anchor](#1-master-style-lock)
2. [Per-room production bibles — 33 rooms](#2-per-room-production-bibles)
3. [NPC state atlas — 16 named characters](#3-npc-state-atlas)
4. [Game-feature surface map + HUD/UI upgrade calls](#4-game-feature-surface-map)
5. [Two-year strategic plan + governance hub](#5-two-year-strategic-plan)
6. [Trade Empire expansion — phases 2 through 7](#6-trade-empire-expansion)
7. [Universal events × room delta matrix](#7-universal-events-matrix)
8. [Discovery cutscene shortlist — per room](#8-discovery-cutscene-shortlist)
9. [Layered mysteries plan — five-tier reveal](#9-layered-mysteries-plan)
10. [Real-world seasonal art overlay](#10-real-world-seasonal-art-overlay)
11. [Production pipeline + verification + runtime resolver](#11-production-pipeline)

---

## 0. How this document works

### 0.1 The recreation contract

Nano Banana 2 holds composition stable when **leading tokens are
byte-identical**. Every prompt in this document is built from four
ordered fragments. The fragments **must** be concatenated in this
order, with a single space between them, and **never reordered**:

```
[ MASTER STYLE LOCK §1.1 ]    (≈ 95 words, identical for every Ark interior)
[ ROOM LAYOUT SENTENCE   ]    (≈ 60–120 words, identical across all states of one room)
[ NPC PRESENCE LINE      ]    (≈ 0–60 words, present only when NPC is in scene)
[ STATE LAYER            ]    (≈ 30–80 words, the ONLY fragment that changes per variant)
```

Every state delta listed below is **only the State Layer**. The
runtime composer (§11.3) prepends the first three fragments. If a
delta is run free-form without the prefix it will not match the
canonical render.

### 0.2 The eight state axes

Every room can be rendered in any combination of the eight state
axes. Not every axis applies to every room (Cryo Bay does not change
with Trade Empire faction rep; Trade Hub does not change with
Quarantine spread). The per-room §2 entries declare which axes are
**load-bearing** and provide the State Layer for each.

| # | Axis | Source | Resolution | Visual register |
|--:|---|---|---|---|
| 1 | **Act progression** | `act_N_complete` flags | 8 acts (Prelude + 1–7) | architectural tier upgrade, signage rust → new-stamp, light temperature shift |
| 2 | **Investigation tier** | `roomMysteries/<room>` hotspot combinations | 1–4 tiers per room | evidence cluster, marker-tape, exhibit cart, dust-pattern reveal |
| 3 | **Faction reputation** | sub-house rep deltas (`tradeEmpire/houses.ts`) | 9 top-level × 31 sub-houses | wall-banner, livery accent, courier presence, courtroom-camera |
| 4 | **Seasonal phase** | season clock (`tradeEmpire/season.ts`) | 4 phases | screen-overlay, hull-lockdown banding, courier swarm |
| 5 | **Companion trust** | bond meters (per NPC, 3–5 tiers) | 3–5 bands | small personal-effects added, light-warmth shift, posture of any present figure |
| 6 | **Morality / dominance** | `vortex_endgame_*`, dischordia cycle energy | light / balanced / dark | rim-light shift, accent palette substitution (warm-gold ↔ phosphor-lavender ↔ Authority-red) |
| 7 | **System unlock** | mech-tutor flags, prestige cycle, battle-pass tier | 13+ mech tutors, ∞ prestige | a launcher panel becomes visible, tooled-bench gains tools, terminal gains tabs |
| 8 | **Lore discovery** | Loredex entries, transmission watches, room-mystery clues | per-entry | environmental tells (etched sigil, pinned letter, photograph), no UI |
| 9 | **Thought Virus infection** | `contaminatedRooms[]` adjacency-graph propagation | 5 stages per-room (clean / exposed / spreading / corrupted / quarantined) | voidblack at vents → mycelium creep → walls breathe → biohazard tape → sealed-X (see §9 NOTES) |
| 10 | **Governance modifier** | `worldModifiers` table + `npc_public_flags` | 4 brackets globally (none / single-modifier / stacked-modifiers / quorum-failure) | UI-edge particles (gold for buff, indigo for debuff), NPC dialog-flag readouts |
| 11 | **Epoch witness** | `epochWitnessService` global state | 5 epochs (privacy / prophecy / insurgency / revelation / fall) + ShadowTongue power 0–100 + `grandEditActive` | indigo marginalia overlay on text surfaces; epoch-sigil glyphs on archive walls |
| 12 | **Cycle phase** | `dischordiaCycle` light/dark balance | 3 phases globally (dawn / dimming / long-night) | ambient light temperature ±300K (see §3.4); accent palette drift |
| 13 | **Battle-pass theme** | `battlePassSeasons` + theme cosmetic bundle | one per active 60d season (shadow-convergence, chrono-harvest, etc.) | per-season particle layer + accent overlay (≤5% of frame) |
| 14 | **Tournament window** | `circuitPvpMatches` + `fightLeaderboard` | 4 windows globally (off-season / qualifier / finals / champion-anointed) | bracket panels, champion-NPC presence in tournament rooms |
| 15 | **Investigation tier (4-state art)** | per-room mystery flags | 4 tiers per room (initial / investigating / partial-resolved / case-closed) | yellow tape → cyan tape + exhibit cart → tape removed + closure object (see §3.8) |
| 16 | **Prestige cycle** | `prestigeProgress` | per-player (cycle 0/1/2/3+) | per-room rim trim line: gold/platinum/diamond/obsidian-prism (see §3.2.2) |
| 17 | **Arc episode** | `playerMysteryChoices` + arc-episode flags | per-NPC, per-room (episodes 1–5 of 6 arcs) | clue-binding marks on hotspots (see §5 Mystery Atlas — to be authored) |

(Axes 9–17 added in scope-expansion. Axis 2 *Investigation tier*
remains as the canonical per-room investigation gradient; axis 15
specifically tracks the **4-state art tier** for the 24 rooms still
needing tier prompts per §3.8.)

A real-world seasonal overlay (§10 — IRL-season) sits on top of all
of these and is wallpaper-thin: a cosmetic delta of ≤5% of the
frame.

**Axis priority resolver** (when multiple axes change between
adjacent renders, only one State Layer delta is rendered per
recreation — this is the order):

```
act > investigation > arc-episode > infection > governance >
epoch > faction > battle-pass-theme > season > cycle-phase >
tournament > prestige-cycle > trust > morality > unlock >
discovery > IRL-season
```

### 0.3 The five layer architecture

Every Ark interior render is composed of five depth layers. The
prompts call them by name. The post-comp pipeline (when used)
respects this stack. When prompts compete for the same layer, the
later instruction wins.

| Layer | Depth | Holds | Mutability |
|--:|---|---|---|
| **L0 Substrate** | back-most | hull architecture, vaulted ribs, copper conduit | locked across all states of a room |
| **L1 Architecture** | back | bulkhead doors, signage placards, pillars | unlocks across acts (door states), otherwise locked |
| **L2 Furniture** | mid | benches, terminals, racks, beds | rearranges with system unlocks + investigation states |
| **L3 State overlay** | mid-fore | evidence, courtroom-camera, banners, dust, fluids, sparks | the **State Layer** in §0.1; this is where the delta goes |
| **L4 Witness glyph** | front | the faintest 2–3% pulse of phosphor-cyan or phosphor-lavender, the "narrator-is-watching" tell | season + dischordia-cycle + mobile-narrator tied |

The Witness Glyph (L4) is a single small bloom — never larger than
3% of frame — placed at a canonical screen anchor per room. It
indicates which narrator-slot is currently dominant: cyan = Elara,
crimson = The Human, magenta-violet = Lyra Vox / Meme. The
runtime narrator-slot mover (`mobileNarratorSlot.tsx`) decides the
glyph color from the room's affinity; the prompt only declares the
**anchor position**.

### 0.4 The state-delta protocol

Change exactly one axis between two renders. Lock all others. This
is non-negotiable — every multi-axis variant comes from compositing
two single-axis deltas in post, not from a multi-axis prompt.

The runtime variant-picker (§11.3) walks the axes in priority order
(act > investigation > faction > season > trust > morality > unlock
> discovery > IRL-season) and selects the highest-priority axis that
has shifted since the last render, then composites the previous
render's lower-priority axes onto the new render's higher-priority
substrate.

### 0.5 Frame chain & rendering targets

- **Stills (room vistas, NPC portraits, evidence inserts):** Nano
  Banana 2, **3840 × 2160** for 16:9 vistas, **2048 × 2048** for
  square inserts, **1024 × 1536** for character portraits. 24 fps
  parity is irrelevant for stills — quoted only when the still is a
  start- or end-frame for a Veo 3.1 chain (then 24 fps).
- **Discovery cutscenes:** Veo 3.1, 12 s default, 24 fps, **3840 × 2160**.
  Frame-chain rule from `NANO_BANANA_VEO_FULL_PROMPT_BOOK.md` §0
  applies verbatim.
- **HUD-state overlays:** Nano Banana 2, **2560 × 1440**, transparent
  PNG with the L3+L4 fragments only (the substrate is composited
  client-side).

### 0.6 Negative-prompt discipline (apply globally)

Every prompt ships with the same negative prompt. Do not vary it
between variants of the same room — that is the most common cause
of seed drift.

```
no on-image text, no rendered words, no readable signage, no UI overlays,
no HUD elements, no watermarks, no lens flares except anamorphic streak,
no modern logos, no figures unless explicitly named, no contemporary
clothing, no photographic faces unless a named NPC line is present,
no dutch angle, no fish-eye, no chromatic aberration except where
vfx_palimpsest_chromatic is cited, no symmetrical centered composition
unless the room layout calls for it, no neon-rainbow palette, no two
hot accent colors at once
```

---

## 1. Master Style Lock

### 1.1 The Master Style Lock — verbatim

Reproduce this paragraph verbatim as the first 95 words of every Ark
interior prompt, as the room-aware extension of the original
`ROOM_STATE_STYLE_ANCHOR` from `apps/shared/roomStateArtPrompts.ts`.
**Do not paraphrase. Do not remove tokens. Do not add tokens.**

> *Wide-shot architectural render of an Inception Ark interior, 16:9,
> 3840×2160, cinematic first-person vantage at standing eye-height,
> 28mm equivalent lens with zero tilt, clean horizontal horizon, no
> dutch angle, no lens distortion. Palette: cold institutional steel,
> patinated brass fittings, deep oxblood accent lighting, warm-gold
> service lamps, phosphor-lavender and phosphor-green glyph glows
> where sorcerous circuitry runs. Aesthetic: cyberpunk meets steampunk
> sorcery — hand-forged brass married to arcane sigil etching and
> fiber-optic ley lines threaded through riveted hull panels.
> Materials: polished and scuffed brass, oil-blued steel bulkheads,
> frost residue on cryogenic surfaces, smoked glass panels, oxblood
> leather accents on control panels, hand-stitched decals on
> signage. Soft rim-light from ceiling service strips, a single
> stronger warm-gold key from one architectural direction, visible
> dust in the beam, faint film-grain sepia undertone. No visible
> figures, no rendered text, no UI overlays, no watermarks, no HUD
> elements — pure environment.*

### 1.2 Per-deck color theory (the substrate cue)

Each deck reads at thumbnail scale by its substrate color cue. The
cue is the **single warm-gold key direction** from the Master Style
Lock — it doesn't replace the palette, it slants it.

| Deck | Rooms | Warm-gold key direction | Substrate cue |
|--:|---|---|---|
| 1 | Cryo Bay, Medical Bay | from above (vaulted ceiling lamps) | frost-rimed steel, condensation halo |
| 2 | Bridge, Archives | from forward (captain's pedestal / shelving spine) | brass-on-steel, oxblood leather |
| 3 | Comms Array, Observation Deck | from one wall (transmitter banks / viewport) | smoked glass, phosphor-violet hum |
| 4 | Engineering, Forge Workshop | from below (forge mouth / kiln) | scorched brass, ember glow |
| 5 | Armory, Cargo Hold | from a side row (weapon rack / container ladder) | oil-blued steel, padded crate |
| 6 | Captain's Quarters, Antiquarian Library, Trophy Room | from a single desk lamp | book-leather oxblood, parchment cream |
| 7 | Guild Sanctum, Social Hub, Station Dock | from an overhead chandelier or banner-key | hand-stitched banner, mess-table brass |
| 8 | Engineering Core, Oracle Sanctum, Shadow Vault, War Room, Cipher Den | from a single sigil ring | a single dominant phosphor color (per room, §2) |
| 9 | Order Tribunal, Chaos Forge | from a tribunal lectern / forge maw | ceremonial chrome, ritual flame |
| 10 | Elemental Nexus, Quantum Lab, Synthesis Chamber | from species-resonant nodes | element-specific (see §2) |
| Pocket | Antiquarian Library (D7 pocket), Memorial Corridor, Pet Garden | from a single window | dust-mote bloom |
| Prelude | Corridor, Galley, Briefing Room, Mess Hall | from emergency floor strips | cold-cyan stripes |

### 1.3 Locked accent vocabulary

These words must appear in a prompt **only** for their canonical
faction or system. Using them anywhere else breaks the seed.

| Token | Owner | Use only when |
|---|---|---|
| `cyan tessellation` / `iris-cyan` | Elara, Dreamer | Elara is present, or a Dreamer-aligned glyph is canon-active |
| `crimson iris` | The Human | The Human is signal-present, or a Human-narrator tell is required |
| `brass steam` | Engineer / Prince | Forge Workshop, Engineering Core post-rite |
| `amber runes` | Architect / Authority | Order Tribunal, Architect dossiers, Locke staging |
| `voidblack static` | Source / Kael / Thought Virus | Engineering quarantine, Cryo Bay post-Source-reveal |
| `palimpsest chromatic` | Meme / Shadow Tongue | any reflective surface broadcast, comms anomaly |
| `dreamer substrate` | Dreamer | sub-basement Dreams Workshop, Dreamer-vision overlay |
| `thought-virus purple` | Thought Virus | corruption spread overlay |
| `authority red lattice` | New Babylon Authority | Locke's Trade Hub takeover, faction-rep delta |
| `panopticon eye` | Architect Empire / Substrate | Memory-recovery beats, Bridge captain's chair tilt |
| `witnessing pulse` | Yin/Yang dual narrator | end-of-act, dual-confession unlock |
| `meme static` | Meme broadcast | any screen surface during Meme presence |
| `seer white feathers` | The Seer | Oracle Sanctum at Seer transmissions |
| `oracle starwhisper` | The Oracle (real) | dream-substrate room transitions only |
| `terminus orange swarm` | Terminus / Insurgency | Armory tower-defense active, Insurgency rep delta |
| `shadowtongue wraith smear` | Shadow Tongue | retroactive lore-edit reveal |
| `blood weave red lattice` | Hierarchy of the Damned | DMC platform, Severance rite |
| `coda chorus` | The Coda (Vex inner-circle) | Coda inner-circle reveal only |

### 1.4 The eight-state vocabulary table (state-layer fragments)

The State Layer (§0.1) is the only mutable fragment. To keep the
seed stable, the State Layer must always begin with one of these
**state opener tokens**, followed by the room-specific delta. The
opener tells Nano Banana 2 which axis is moving so it doesn't try
to combine multiple deltas into one tableau.

| Axis | Opener | Closer |
|---|---|---|
| Act progression | `STATE — act-tier <N>:` | `Mood: <one phrase>.` |
| Investigation | `STATE — investigation-tier <N>:` | `Mood: <one phrase>.` |
| Faction rep | `STATE — faction-rep <house>=<bracket>:` | `Mood: <one phrase>.` |
| Seasonal phase | `STATE — season-phase <prologue\|running\|closing\|interregnum>:` | `Mood: <one phrase>.` |
| Companion trust | `STATE — trust <npc>=<bracket>:` | `Mood: <one phrase>.` |
| Morality | `STATE — morality <light\|balanced\|dark>:` | `Mood: <one phrase>.` |
| System unlock | `STATE — unlock <feature-id>=<true>:` | `Mood: <one phrase>.` |
| Lore discovery | `STATE — discovered <loredex-id>:` | `Mood: <one phrase>.` |
| IRL season | `STATE — irl-season <spring\|summer\|autumn\|winter>:` | `Mood: <one phrase>.` |

### 1.5 Universal-event visual register (cross-axis overlay)

Universal events (the `event_*` family in
`narrativeFlagRegistry.ts`) are not a state axis — they are a
**transient overlay** that sits on top of whichever axis is current.
They expire after their narrative window and revert. Each one has a
**visual register** that any room renders when the flag is hot.

| Event | Visual register (apply to L3, never L0–L2) |
|---|---|
| `event_two_witnesses_remember` | a brief warm-gold pulse on every room's witness-glyph anchor; doubles cyan + crimson alongside |
| `event_two_witnesses_meet` | a single cyan + crimson rim-light pair on every figure in scene (or on the warmest object if no figure) |
| `event_silence_of_two_witnesses` | the witness-glyph is darkened to 1% — present but suppressed |
| `event_meme_broadcast_active` | every reflective surface gains 1–2 frames of `meme static`; CRT scanlines on screens |
| `event_universal_quarantine` | a thin amber band painted across the floor at every bulkhead, regardless of room |
| `event_faction_succession_announced` | the affected faction's banner unfurls 50% in any room that has a wall hook |
| `event_oracle_dream_pull` | the witness-glyph anchor blooms with `oracle starwhisper` for one render only |
| `event_architect_audit` | a single `panopticon eye` glyph etches into the brightest brass surface |
| `event_lions_apocalypse_protocol` | every screen in scene flickers a single amber-outlined lion silhouette |
| `event_dreamer_vision_<N>` | iris-cyan filaments drift across the upper third of frame |
| `event_dischordia_cycle_inversion` | the warm-gold key direction reverses left↔right (mirror-flip the lighting only) |

### 1.6 The Witness Glyph anchor table (per-room)

Each room has a fixed pixel-anchor (declared as a fraction of the
frame from top-left) where the L4 Witness Glyph appears. This is
locked because it gives the runtime narrator-slot a stable place
to bloom. Any prompt that omits this token leaves the glyph absent
(used for "narrator silenced" beats, e.g. `event_silence_of_two_witnesses`).

| Deck | Room | Anchor | Rationale |
|--:|---|---|---|
| 1 | Cryo Bay | (0.18, 0.42) | left of the player's open pod, at chest height |
| 1 | Medical Bay | (0.72, 0.50) | right of the bio-bed, beside the helix station |
| 2 | Bridge | (0.50, 0.30) | above the captain's pedestal |
| 2 | Archives | (0.40, 0.55) | the spine of the central shelving |
| 3 | Comms Array | (0.25, 0.50) | the eldest receiver dial |
| 3 | Observation Deck | (0.50, 0.25) | the upper viewport curvature |
| 4 | Engineering | (0.30, 0.65) | the master anvil corner |
| 4 | Forge Workshop | (0.55, 0.55) | the kiln mouth aura |
| 5 | Armory | (0.60, 0.40) | the rack where Agent Zero's case sits |
| 5 | Cargo Hold | (0.50, 0.75) | a single sealed crate centered |
| 6 | Captain's Quarters | (0.35, 0.45) | the desk lamp pool |
| 6 | Antiquarian Library | (0.62, 0.50) | the long reading table candle |
| 6 | Trophy Room | (0.50, 0.45) | the eternal flame pedestal |
| 7 | Guild Sanctum | (0.50, 0.60) | the allegiance pad center |
| 7 | Social Hub | (0.45, 0.55) | the mess-table centerpiece |
| 7 | Station Dock | (0.65, 0.50) | Coda's trading-floor desk lamp |
| 8 | Engineering Core | (0.50, 0.50) | the reactor schematic core |
| 8 | Oracle Sanctum | (0.50, 0.40) | the recording cabinet aperture |
| 8 | Shadow Vault | (0.40, 0.55) | the cell-glass center, never the warden terminal |
| 8 | War Room | (0.50, 0.45) | the holo-table center |
| 8 | Cipher Den | (0.30, 0.55) | the eldest cipher terminal |
| 9 | Order Tribunal | (0.50, 0.35) | the lectern apex |
| 9 | Chaos Forge | (0.50, 0.55) | the entropy vat center |
| 10 | Elemental Nexus | (0.50, 0.50) | the central node ring |
| 10 | Quantum Lab | (0.45, 0.50) | the observation cage's left aperture |
| 10 | Synthesis Chamber | (0.55, 0.50) | the recipe board's lit cell |
| Pocket | Memorial Corridor | (0.50, 0.50) | the central memorial plate |
| Pocket | Pet Garden | (0.55, 0.55) | the breeding-pair pedestal |
| Trade | Trade Hub | (0.45, 0.45) | Locke's warmap console |
| Prelude | Corridor | (0.50, 0.55) | the emergency strip junction |
| Prelude | Galley | (0.55, 0.55) | the hearth coal |
| Prelude | Briefing Room | (0.50, 0.60) | the empty chair |
| Prelude | Mess Hall | (0.40, 0.55) | the prince's archive shelf |

### 1.7 The thumbnail-test rule

Every room render must read at 240 × 135 px. Run the rendered still
through a 240-wide downscale and confirm: (a) the deck is
recognizable from substrate cue alone (§1.2); (b) the dominant
state-layer object reads in silhouette; (c) the witness-glyph
anchor is present or canonically absent. If any of these fail,
re-render with a stronger State Layer instruction, never with a
different style or different lens.

---

## 2. Per-room production bibles

> Each room entry is structured as:
>
> 1. **Header** — id, deck, internal id, adjacency, gating flag.
> 2. **Plot-point hotspots** — the LucasArts interactables, with
>    foreground / midground / background mystery layer assignment.
> 3. **NPCs** — who appears, under what flag, in which staging.
> 4. **Game-feature launchers** — every UI surface that needs to
>    be reachable from this room and the diegetic object that
>    represents it.
> 5. **Layout Sentence** — the 60–120 word architectural lock,
>    reproduced verbatim in every state of the room.
> 6. **NPC Presence Lines** — when a named NPC is in scene, this
>    fragment slots between Layout and State.
> 7. **State Layer deltas** — the actual prompt fragments for each
>    load-bearing state axis. The runtime composer prepends Master
>    Style Lock (§1.1) + Layout Sentence + (optional) NPC Presence
>    Line before each delta.
> 8. **Discovery cutscene** — yes / no + 1-line beat (full Veo 3.1
>    treatment in §8).
> 9. **HUD/UI upgrade notes** — what HUD surfaces this room hosts.
>
> Where a room is already covered in the existing TS prompt files
> (`roomStateArtPrompts.ts`, `roomTierArtPrompts.ts`,
> `roomMediaPrompts.ts`), the existing prompts are the canon and
> the entries here only **extend** the axis coverage — never
> rewrite. References to the existing files are explicit.

### 2.1 Cryo Bay

- **id:** `cryo-bay` / internal `cryo_bay`
- **Deck:** 1
- **Adjacency:** Medical Bay (right bulkhead), Bridge (rear lift)
- **Gating:** none — first room post-awakening
- **Existing canon:** `apps/shared/roomStateArtPrompts.ts` covers 4
  investigation states (initial / investigating / victim-identified
  / case-open-later). This entry **extends** to act-progression,
  faction-rep, season-phase, trust, morality, system-unlock, lore-
  discovery, and IRL-season axes. Do not re-author the four
  investigation states — they are canon.

#### 2.1.1 Plot-point hotspots (LucasArts beats)

| Hotspot | Verb set | Mystery layer | Drives |
|---|---|---|---|
| Player's open pod (foreground) | look, touch, examine | foreground | tutorial; awakening recall |
| Dark-status pod (mid-row, second-from-end, left) | look, examine, force-open | foreground (Acts 1–2), midground (3+) | Cryo murder mystery; victim identity; Engineer-Prince clue (background, post-Act 5) |
| Cracked control panel | examine, repair, listen | foreground | Engineering tutor unlock |
| Torn ID tag (floor) | take, combine | foreground | victim identification combine |
| Tarnished silver locket | take, open | foreground | lore-flag `locket_opened` |
| Data-slate (pod base) | take, read | foreground | victim ID combine partner |
| Bioluminescent blood trail | examine, follow | foreground | leads under plate-metal seam (Med Bay drain link) |
| Bulkhead seal indicator (far end) | examine | foreground | door-state telemetry |
| Crew clone-bay terminal (left wall) | use | midground | Crew Roster launcher |
| Resurrection pod cradle (right wall) | use | midground | Hellbox affordance toast trigger (when fallen-crew condition true) |
| Bloodline registry plinth (rear-left) | use | midground | Pet Garden / Breeding launcher (when `mech_breeding_intro_seen`) |
| Sigil etching above bulkhead (background) | look | background | Architect-audit identity-chain background; only legible at Loredex `ark_1047_origins` discovered |
| Reflection in pod glass (the player's own face) | look | background | Companion 64-tuple identity-chain mirror; only meaningful post-DMC |

#### 2.1.2 NPCs

No NPC ever stands in Cryo Bay. The narrator slot resolves to
**Elara (default)** with affinity weight pulling cyan witness-glyph
to the (0.18, 0.42) anchor. During Prelude beat 1 (`narrator_beat_1_interference`)
the slot is forced to Elara regardless of bond.

#### 2.1.3 Game-feature launchers

| Feature | Diegetic object | Visibility gate |
|---|---|---|
| Crew Roster | left-wall clone-bay terminal | always |
| Hellbox Resurrection | right-wall resurrection cradle | `fallen_crew_count > 0` AND `act_2_complete` |
| Pet / Specimen Breeding | rear-left bloodline registry plinth | `mech_breeding_intro_seen` |
| Character Creation (first-run only) | the player's open pod | `awakening_complete=false` |
| Awakening replay | small lectern at bulkhead, faces door | `awakening_complete=true` |
| Loredex `cryo_bay_room` clue panel | brass-clipped slate at bulkhead | `cryo_mystery_first_clue_found` |

#### 2.1.4 Layout Sentence (verbatim)

> *The Cryo Bay seen from the operative's waking-pod vantage —
> three parallel rows of upright cryogenic pods receding into the
> frame, the viewer's own open pod occupying the lower-right
> foreground (pod rim and frost-rimed interior visible, no figure
> inside). The left wall carries a bank of diagnostic
> cryo-terminals with warm-gold indicator lights; the right wall a
> brass-framed corridor junction. Ceiling is a vaulted hull-rib
> architecture in oil-blued steel with exposed copper conduit.
> Floor is textured plate metal with frost pooled at pod bases. At
> the far end of the chamber: a reinforced bulkhead door marked
> with a single warm-gold sigil — the route to the Medical Bay.*

#### 2.1.5 State Layer deltas (extending the four canonical investigation states)

**Investigation axis** — see `roomStateArtPrompts.ts` lines 90–177
for the canon four. Do not author further investigation tiers
here.

**Act-progression axis** (one delta per act past Prelude; baseline
is Act 1):

- `STATE — act-tier 2:` *the bulkhead-door sigil has been
  re-stamped from warm-gold to a slightly cooler brass-amber,
  carrying a fresh edge-rim of phosphor-lavender that wasn't
  there before; one of the unused diagnostic terminals on the
  left wall has had its dust-cover lifted and a new brass plate
  bolted across its face; the foreground pod's frost has receded
  by about a finger's width, revealing a slim service slot at the
  pod-rim that wasn't visible before. Mood: the room has been
  audited and updated.*
- `STATE — act-tier 3:` *one full row of pods (the rear row) has
  been blacked out with riveted blast plate, indicating a
  reassignment-of-bay; the bulkhead door has gained a second
  smaller hatch beneath the main cycle, edge-lit phosphor-green
  (Synthesis Chamber routing); a single diagnostic terminal on
  the left wall now displays a stylised double-helix etched into
  its smoked glass cover. Mood: the room has begun to specialise.*
- `STATE — act-tier 4:` *the foreground pod's interior carries a
  small brass token magnetised to its rim — round, plain, no
  legible mark — and the surrounding frost has organised into a
  faint radial pattern as if something inside the pod has been
  emitting a slow heartbeat; the conspiracy stub-line of
  bioluminescent blood under the plate-metal seam has been
  resealed with brass-and-rivet at one point, indicating prior
  investigation. Mood: the dead are not done speaking.*
- `STATE — act-tier 5:` *the dark-status pod's exterior is now
  patched with the same brass-and-rivet seal as the floor seam
  was in tier 4 — clearly the same hand has worked here; a
  second bulkhead door has been retrofitted into the rear wall
  between the rear-row blast plates, narrower than the main, no
  sigil but a single oxblood handprint on the latch. Mood: the
  Engineer has been here without permission.*
- `STATE — act-tier 6:` *the room's lighting has cooled by 15%
  toward steel-blue; the warm-gold service lamps now alternate
  with a single dimmer-than-default cyan strip along the floor;
  the player's own open pod has had its rim-decal etched with a
  fresh sigil that exactly matches the bulkhead door's. Mood: the
  room recognises you now.*
- `STATE — act-tier 7:` *all pods except the player's are
  open — frost gone, interiors empty and clean; the bulkhead
  door at the far end stands unlocked and ajar at 30°; the
  diagnostic terminals have been muted to a single soft pulse;
  one pod in the rear row contains a small brass token, the same
  shape and size as the act-tier-4 token. Mood: the room is
  preparing to be left.*

**Faction-rep axis** (load-bearing only for top-3 factions a
player has taken sides with; render as overlays on the current
investigation state):

- `STATE — faction-rep new_babylon_authority=high:` *a New
  Babylon Authority pendant — six-sided red lattice on cream —
  has been pinned to the bulkhead's amber sigil, hanging from a
  thin brass chain; the warm-gold key direction picks up a
  subtle red lattice cast as it crosses the pendant. Mood: the
  Authority has audited this room.*
- `STATE — faction-rep insurgency_zero_doctrine=high:` *a small
  hot-orange tag has been wound around the foreground pod's
  rim-pin, hand-knotted; one of the left-wall diagnostic
  terminals shows a single hot-orange dot in its bezel — the
  terminus orange swarm token, attenuated to one pixel. Mood:
  the Insurgency knows you woke up.*
- `STATE — faction-rep antiquarian_shelf_mates=high:` *a single
  pressed-leaf bookmark — green, fragile — has been slipped
  between the bulkhead door's brass frame and the wall plate; a
  brass-edged card sits face-down on the foreground pod's rim,
  no legible text, just a citation index visible as glyph-shapes.
  Mood: the Antiquarian filed this room.*
- `STATE — faction-rep hierarchy_severance=high:` *a thin
  blood-weave red lattice runs along the lower 6% of the room's
  vertical edges — corner trim only — like a contract has been
  notarised against the architecture; the foreground pod's
  control panel has gained a single severance-glyph etched
  faintly in its corner. Mood: the Hierarchy has noted you.*
- `STATE — faction-rep thaloria_council=high:` *a small green
  cloth, hand-stitched with mourning glyphs, has been folded and
  placed on the brass-edged service rail beside the foreground
  pod; the warm-gold key picks up a slightly verdant tint. Mood:
  Thaloria mourns that you woke alone.*

**Season-phase axis:**

- `STATE — season-phase prologue:` *the bulkhead's amber sigil
  glows at full strength but the edges shimmer faintly with the
  panopticon eye glyph — a single audit-mark fading in and out
  across 4 frames; no other change. Mood: the season is being
  declared.*
- `STATE — season-phase running:` (default; no delta; this is
  baseline)
- `STATE — season-phase closing:` *every diagnostic terminal on
  the left wall flashes once — not in sequence, all at once — to
  cyan; one beat later, returns to warm-gold. Render as the
  cyan-flash frame. Mood: the season is closing — last call.*
- `STATE — season-phase interregnum:` *the warm-gold service
  lamps are at 30% brightness; the frost on the pod bases has
  expanded by a finger's width; the bulkhead's amber sigil is
  dark. Mood: the room is between seasons, holding breath.*

**Trust axis** (Elara only — Cryo Bay's narrator-default):

- `STATE — trust elara=fragmented:` (baseline; no delta)
- `STATE — trust elara=lucid:` *a small hand-folded note in
  precise script (no legible text) has been pinned to the
  foreground pod's rim with a brass clip; the witness-glyph
  anchor at (0.18, 0.42) carries a soft cyan tessellation drift
  bloom. Mood: she has started leaving things for you.*
- `STATE — trust elara=luminous:` *the cyan tessellation bloom
  at the witness-glyph anchor extends into a thin filament
  reaching toward the foreground pod's rim, terminating in a
  near-invisible cyan glyph that exactly matches one in the
  bulkhead door's amber stamp. Mood: she is reading the room
  alongside you now.*

**Morality axis:**

- `STATE — morality light:` *warm-gold key direction picks up a
  +5% saturation; the bulkhead sigil's amber tilts toward gold.
  Mood: kept.*
- `STATE — morality balanced:` (baseline; no delta)
- `STATE — morality dark:` *warm-gold key direction is replaced
  by phosphor-lavender as the dominant key; the bulkhead sigil
  reads cooler, almost violet. Mood: counted.*

**System-unlock axis:**

- `STATE — unlock crew_system_unlocked=true:` *the left-wall
  clone-bay terminal has its smoked-glass cover retracted and
  reveals a brass-and-glass interior with a single rotating
  vial-rack visible. Mood: the cradle is open.*
- `STATE — unlock mech_breeding_intro_seen=true:` *the rear-left
  plinth has gained a dust-cover lifted; a single brass
  bloodline-registry sigil is visible on its top face, faint
  phosphor-green. Mood: the registry is yours.*
- `STATE — unlock first_crew_member_born=true:` *one pod in the
  middle row (centre, third from end) has its frost-rime fully
  cleared and a small warm-gold heartbeat pulse visible through
  the pod glass — once every 4 seconds, no more. Mood: the
  cradle is full.*

**Lore-discovery axis:**

- `STATE — discovered ark_1047_origins:` *the sigil etching above
  the bulkhead has resolved from undifferentiated warm-gold into
  a recognisable double-glyph: two interlocking rings inside a
  third — Architect / Ne-Yon / Empire layered. The legibility is
  earned. Mood: the ship is older than you thought.*
- `STATEdiscovered cryo_victim_was_engineer:` *a faint sepia
  flash-tint passes the entire room for one frame as if a
  flashback has just settled; the dark-status pod's interior
  silhouette resolves to a familiar shape — a man in coat with
  goggles. Mood: he died here.*
- `STATE — discovered companion_64tuple_unlocked:` *the
  reflection-in-pod-glass becomes the companion's reflection,
  not the player's, for one frame; the rim-pin gains a second
  brass token beside the act-tier-4 one. Mood: you are not
  alone here.*

**IRL-season axis** (apply as wallpaper-thin overlay, ≤5% of
frame):

- `STATE — irl-season spring:` *a single thin frost-melt drip
  forms at the foreground pod's rim, suspended; one of the
  warm-gold lamps carries a faint warm-pink edge tint.*
- `STATE — irl-season summer:` *the frost on pod bases is
  thinner than baseline by 30%; the warm-gold key direction
  reads slightly hotter, almost amber.*
- `STATE — irl-season autumn:` *a small dust of pale amber
  particulate drifts at the floor seam, slow; one of the
  warm-gold lamps carries a faint orange-leaf undertone.*
- `STATE — irl-season winter:` *the frost on pod bases has
  expanded by a finger's width; the bulkhead sigil's amber is
  veiled with a thin cool blue.*

#### 2.1.6 Discovery cutscene

**Yes — `awakening_pod_cycle_open`.** 12 s. Veo 3.1. Player POV
from inside the foreground pod as the lid retracts; frost-rime
fractures across the glass; first sound is the cracking ice;
crimson iris VFX bloom for one frame at the witness-glyph anchor
(The Human is watching first), resolving to cyan tessellation as
the pod cycle completes. End frame is the canonical
`cryo-bay:initial` still — frame-chain into the gameplay state.

#### 2.1.7 HUD/UI upgrade notes

- `BridgeConsole` daily-brief popup launches from this room when
  `awakening_complete` flips. Hellbox affordance toast
  (`HellboxAffordanceToast.tsx`) only fires if Med Bay has been
  visited in the same session AND fallen-crew count > 0;
  otherwise the cradle stays cold-pulsed without prompting.

#### 2.1.8 Back-fill grid (axes 9–17 + storyteller hooks + HUD overlap)

1. **TV infection (axis 9, 5 brackets):** clean = no marker;
   exposed = voidblack wisps at the far-wall floor-vent + one
   mycelium thread along the pod-row underside seam; spreading
   = mycelium fans across the cracked-panel frame, cold-violet
   shimmer at Pod Zero glass; corrupted = voidblack pooling at
   coolant-line junctions, Pod Zero interior haze turns black,
   biohazard-amber tape on Med Bay bulkhead; quarantined =
   yellow band sealing both bulkheads, sealed-X across entry,
   red wash, vent-grates plugged with mycelium.
2. **Demon-summoning:** —
3. **CADES:** —
4. **Story items (§3.5):** torn ID tag (foreground floor),
   data-slate (pod base), silver locket (mid-pod), unlabeled
   vial (rear shelf, post-Act 2), frosted-glass cord (Pod Zero
   exterior). Bay 7 reserved canvas-drape.
5. **Mystery-arc bindings:** Wraith Calder E1 (Pod Zero
   `pod_0_breathing` tier); Jericho Jones E3 (bio-bed grip-
   anomaly footage relayed from Med Bay).
6. **Investigation tier (axis 15):** see §2.1.5 — the four
   canonical states ARE the 4-tier register.
7. **Governance modifier reactions (axis 10):**
   `quarantine_protocol_active` → amber edge-glow on bulkhead
   doors; `cryo_thaw_priority` → accelerated defrost cadence.
8. **Epoch / ShadowTongue (axis 11):** medical chart's Ψ-
   watermark intensifies as ShadowTongue power rises (≥40
   plainly visible on first glance); on `grandEditActive`, all
   charts show indigo overstrike.
9. **Cycle-phase lighting (axis 12):** dawn 5800 K warm-amber
   drift; balanced 5500 K canonical; dimming 5300 K; long-night
   5200 K cool-violet on cryo glass.
10. **Faction livery (axis 3):** none load-bearing — Cryo Bay
    is pre-faction.
11. **Tournament window (axis 14):** —
12. **Storyteller hooks:** Silent Archives chronometer cycles
    timestamps; Last Message scratched behind a sealed pod
    ("don't go to the Bridge…"); Void Echo particles in Pod
    Zero fluid trace contamination origin; Empty Armor Slot
    (specialized cryo-suit hanging, never used, 1 of 5).
    Expansion-reserved zone: Bay 7 canvas-draped pod (future
    reveal). Living-world: every 24 IRL hours the cryo unit
    cycles a 30-s defrost (frost melts then re-freezes); every
    7th day, one pod stutters mid-cycle.
13. **HUD overlap:** `MoralityMeter.tsx` (low-fi in-room
    callout when examining Pod Zero late);
    `CinematicDialogOverlay.tsx` (Elara first-wake dialogue);
    `RoomTransition.tsx` (parallax entry — §3.4.1 galaxy-meter
    overlay first wires here); `MobileNarratorSlot.tsx`
    (Elara's first-wake narration).

---

### 2.2 Medical Bay

- **id:** `medical-bay` / internal `medical_bay`
- **Deck:** 1
- **Adjacency:** Cryo Bay (left bulkhead), Synthesis Chamber (right
  sealed door, gates D10)
- **Gating:** `cryo_mystery_victim_identified`
- **Existing canon:** `apps/shared/roomStateArtPrompts.ts` covers 4
  device states (initial / device-awakened / donated / refused).
  Do not re-author those four — they are canon. This entry
  extends.

#### 2.2.1 Plot-point hotspots

| Hotspot | Verb | Layer | Drives |
|---|---|---|---|
| Bio-bed dais (centre) | use, examine | foreground | Combat Simulator launcher; Hellbox modal |
| Maintenance access panel (behind bio-bed) | examine, open, close | foreground | DNA neural-bridge device beat |
| Vox-neural-bridge needle-arm | use, refuse | foreground | DNA donate / refuse |
| Receipt plate (post-donation) | take, read | foreground | earned-loadout reward delivery |
| DNA helix station (right wall) | look, scan | midground | Synthesis Chamber bulkhead unlock; Loredex `species_dna` |
| Pharmaceutical fabricator bank (left wall) | use | midground | crafting-medicine subgame; Status Recovery |
| Quarantine tape across right doorway | examine | midground | event_universal_quarantine indicator |
| Crunched-glass footprints (floor) | examine, follow | midground | Engineer-Prince ghost evidence (background) |
| Sealed cabinet of vials (right wall) | examine, force | midground | Hellbox affordance trigger |
| Holographic readout above bio-bed | look | foreground | Status surface + research-minigame entry |
| The Source's voiceline (no visible source) | listen | background | the_source NPC presence |
| Vex's diagnostic samples (when Vex present) | examine | foreground | Coda inner-circle progression |
| Severance-rite blood-weave on cabinet trim | look | background | only legible post-Vex `engineer_zero_hint` |

#### 2.2.2 NPCs

- **the_source** (always; voice-only, no visible figure) —
  speaker is the bio-bed itself or, in dark-morality, the helix
  station.
- **Vex Solène** if `act_2_complete` — at the diagnostic bench,
  sorting samples. Presence Line below.

##### Presence Line — Vex Solène, Medical Bay

> *Vex Solène is at the diagnostic bench, sorting samples — a
> woman in a clean black surgical jacket over a charcoal
> high-collar undershirt, dark hair drawn back, gloved hands
> moving sample vials in a precise three-and-pause cadence. Her
> face is angled slightly away from the room's main key light.
> No identifying jewellery. Posture: alert but not on guard.*

For Vex's reveal-stage variants, see §3.5 (full register matrix).

#### 2.2.3 Game-feature launchers

| Feature | Diegetic object | Gate |
|---|---|---|
| Combat Simulator (PvE card sparring) | bio-bed dais (raised mode) | always |
| Hellbox Resurrection (modal) | sealed cabinet of vials | `fallen_crew_count > 0` |
| Research Minigame | holographic readout above bio-bed | `mech_research_intro_seen` |
| Status Recovery | pharmaceutical fabricator bank | always |
| DNA Donation Reward | needle-arm + receipt plate | `medical-bay:device-awakened` state |
| Synthesis Chamber bulkhead | right wall sealed door | `neyon_chain` |
| Loredex `the_source` entry | bio-bed (when Source speaks) | first Source contact |

#### 2.2.4 Layout Sentence (verbatim — from `roomStateArtPrompts.ts:185`)

> *The Medical Bay seen from the doorway — a wide surgical
> chamber with a central examination bio-bed on a raised brass
> dais, diagnostic scanners arrayed in a half-ring around it,
> and banks of pharmaceutical fabricators along the left wall.
> The right wall carries a floor-to-ceiling DNA analysis station
> (a slow-rotating holographic double helix in phosphor-green),
> beside a medicine cabinet of labelled vials. The back wall is
> dominated by the bio-bed and its floating holographic readout
> over the headrest. Behind the bio-bed, recessed into the wall
> between cable conduits, a maintenance access panel is inset —
> its position is always visible, but whether it is closed,
> ajar, or open shifts per state. Glass underfoot near the
> bio-bed — crunched boot-sized footprints trail past it.
> Ceiling is vaulted hull-rib with copper conduit; walls are
> oil-blued steel with warm-gold service lamps and brass-rimmed
> signage placards. A reinforced bulkhead door on the left leads
> back to the Cryo Bay; a second sealed door on the right (amber
> seal-status) leads deeper into the Ark.*

#### 2.2.5 State Layer deltas (extending the four canonical device states)

**Act axis:**

- `STATE — act-tier 2:` *Vex's diagnostic bench has gained a
  small brass-edged card-tray at its left edge; one of the
  pharmaceutical fabricators has its smoked-glass face etched
  with a fresh medical-octant glyph; the second sealed door's
  amber status indicator now carries an inner cyan ring
  indicating Synthesis Chamber routing is live. Mood: the room
  is mid-renovation.*
- `STATE — act-tier 3:` *the right wall's DNA helix station has
  been wired into a second auxiliary terminal pulled in from the
  Synthesis Chamber; a brass-and-glass biocontainment hood (the
  size of a small fish tank) sits on the bio-bed dais beside the
  needle arm. Mood: the species work has begun.*
- `STATE — act-tier 4:` *the left wall's pharmaceutical
  fabricators show one unit pulled out of its bay, sitting on a
  service trolley — a brass nameplate on its side, the bay
  itself unfinished and showing exposed copper conduit; faint
  blood-weave red lattice runs along the lower 6% of the room's
  vertical edges. Mood: the Hierarchy has been allowed in.*
- `STATE — act-tier 5:` *the maintenance access panel behind the
  bio-bed has been replaced with a heavier panel — same brass
  trim, but now twice as thick and bolted with sigil-headed
  rivets; a faint brass-steam wisp drifts from the right edge of
  the panel for two frames in eight. Mood: the Engineer has been
  installing.*
- `STATE — act-tier 6:` *the bio-bed dais's central column has
  gained an etched ring at its base, the same ring as the cryo
  bay's foreground pod (act-tier 6); the holographic readout
  above the bed has cooled by 10% toward steel-blue. Mood: this
  bed has remembered every body that has used it.*
- `STATE — act-tier 7:` *the bio-bed is open and empty, the
  needle arm retracted, the maintenance panel sealed flush, the
  sealed cabinet emptied of vials; the second sealed door on the
  right stands unlocked. Mood: the work is done.*

**Faction-rep axis:**

- `STATE — faction-rep hierarchy_acquisitions=high:` *Drael'Mon's
  Acquisitions ledger-mark — a single Hierarchy black diamond on
  oxblood — has been etched into the maintenance panel's brass
  trim; the holographic readout above the bio-bed flickers a red
  lattice frame once per cycle. Mood: he wants you on the books.*
- `STATE — faction-rep coda_inner_circle=marked:` *the
  diagnostic bench has gained a thin black silk ribbon, knotted,
  hanging from its left edge — Coda chorus marker; the
  biocontainment hood (if act-tier 3+) carries a second tied
  ribbon at its handle. Mood: Vex has named you.*
- `STATE — faction-rep new_babylon_civic_engineers=high:` *the
  pharmaceutical fabricators on the left have all received a
  small Civic Engineers maintenance sticker — cream-on-cream
  diamond pattern — affixed at chest height; the holographic
  readout shows a clean grid frame. Mood: maintenance is done
  on schedule.*
- `STATE — faction-rep dreamer_shield=any:` *the helix station's
  rotation slows by 50% for one beat at every cycle — Dreamer
  shield interference; iris-cyan filaments drift at the upper
  third of frame. Mood: the Dreamer is watching.*

**Season-phase axis:**

- `STATE — season-phase closing:` *the holographic readout shows
  a single closing-phase glyph — interlocked declaration sigils
  — for the duration of the render. Mood: the season is being
  pronounced.*
- `STATE — season-phase interregnum:` *the bio-bed is dim, the
  needle-arm retracted, the helix station static in mid-rotation;
  every fabricator's status lamp is at 30%. Mood: between.*

**Trust axis (Vex):**

- `STATE — trust vex_solene=stranger:` (baseline; Vex is at the
  bench but no personal effects visible)
- `STATE — trust vex_solene=watcher:` *a small black-and-cream
  card has appeared on the diagnostic bench beside Vex's left
  hand — face-down, no legible text, edge unmarked. Mood: she
  is leaving you something to find.*
- `STATE — trust vex_solene=confidant:` *Vex's gloves are
  unbuttoned at the wrist, one cuff folded back; the card on
  the bench is now face-up but the legibility is intentionally
  unrendered (per anchor); a brass token (twin to Cryo Bay's
  rim-pin) sits beside the card. Mood: she has shown a wrist.*
- `STATE — trust vex_solene=inner-circle:` *Vex's high-collar is
  unfastened by one button; the diagnostic bench has a third
  card laid out — a triptych — and a thin black silk ribbon
  ties them. The witness-glyph anchor at (0.72, 0.50) carries
  twin cyan + crimson rim-lights overlaid (Coda chorus —
  internal name "Eyes of Reality"). Mood: she has named you in
  a room where naming costs.*

**Reveal-stage axis (Vex specific — overlays trust):**

- `STATE — vex-reveal eyes_of_reality:` *Vex's posture is more
  rigid; her left hand carries a faint static-layer overlay (1%
  voidblack static, mostly invisible); the cards on the bench
  are arranged in a martial four-corner, not the maestro
  three-and-pause. Mood: pre-transference; the room remembers a
  younger her.*
- `STATE — vex-reveal vex_public:` (baseline)
- `STATE — vex-reveal engineer_zero_hint:` *Vex's right hand
  pauses mid-arrangement as if catching itself in a familiar
  gesture; brass-steam VFX wisp for one frame at the bench's
  right edge — too faint to read consciously; the bio-bed dais's
  etched ring (act-tier 6+) is fractionally brighter. Mood: she
  is recognising a pattern.*
- `STATE — vex-reveal engineer_zero_confirmed:` *Vex is no longer
  masked; if her face was angled away in baseline, here it is
  fully turned toward camera, eyes warm and steady; brass-steam
  VFX is honest now (3% of frame at the bench right edge);
  Coda-chorus ribbons at every act-tier-marked object. Mood: she
  carries the Engineer and you both know it.*

**Morality axis:**

- `STATE — morality dark:` *the helix station's rotation
  reverses; phosphor-green is replaced by phosphor-lavender for
  the rotation; the Source-voice-source canonically shifts from
  the bio-bed to the helix station. Mood: the room is listening
  to a different prophet.*

**System-unlock axis:**

- `STATE — unlock hellbox=available:` *the sealed cabinet of
  vials has its glass face cracked open by 15°, light spilling
  warm-gold through the gap onto the floor; one vial is visibly
  empty, a second is full of cold-blue fluid, the rest unread.
  Mood: the trade is offered.*
- `STATE — unlock research_minigame=true:` *the holographic
  readout above the bio-bed has gained a second sub-readout
  (smaller, lower-left of the main) showing a slow rotating
  pattern-puzzle. Mood: the lab is yours to use.*
- `STATE — unlock synthesis_chamber=accessible:` *the right wall
  sealed door's amber status flips to warm-gold and the seal
  retracts by 20% revealing a sliver of phosphor-green light
  beyond — Ne-Yon synthesis is online. Mood: a new species can
  be made.*

**Lore-discovery axis:**

- `STATE — discovered the_source_is_kael:` *the bio-bed's
  voice-source canonically shifts position by 20° toward the
  left wall — the room itself acknowledges that the Source is
  not where you thought; voidblack static VFX at 1% across the
  bio-bed's surface. Mood: you have caught him out.*
- `STATE — discovered cryo_victim_was_engineer:` *the maintenance
  access panel ajar by 30° regardless of investigation tier; the
  brass-steam VFX wisp present even in baseline. Mood: he has
  been here all along.*
- `STATE — discovered ark_1047_is_research_vessel:` *the helix
  station's holographic helix gains a third strand — DNA + RNA
  + something other — phosphor-violet. Mood: the ship's purpose
  was always biology.*

**IRL-season axis:** (same wallpaper-thin treatment as §2.1)

#### 2.2.6 Discovery cutscene

**Yes — `med_bay_first_quarantine`.** 8 s. Veo 3.1. The right
wall's DNA helix station rotates two beats faster, then locks; a
quarantine band of warm amber light paints across the floor at
both bulkheads simultaneously; bio-bed readout flips to a single
red glyph. End frame is the canonical state with quarantine tape
hung at the right doorway. Triggered first time
`event_universal_quarantine` fires.

#### 2.2.7 HUD/UI upgrade notes

- `HellboxAffordanceToast.tsx` triggers on entry if eligibility
  conditions met. Toast anchors to the sealed cabinet, not to
  the bio-bed.
- `MolGarathAudienceOfferToast.tsx` only fires here if
  `hierarchy_acquisitions` faction-rep is high enough — not
  earlier rooms.

#### 2.2.8 Back-fill grid (axes 9–17 + storyteller hooks + HUD overlap)

1. **TV infection (axis 9, 5 brackets):** clean = no marker;
   exposed = wisps from the autoclave vent + thread along the
   bio-bed's chassis seam; spreading = mycelium on the medicine
   cabinet's underside, bowl-pulse cold-violet; corrupted =
   coolant pooling in the helix's basin, voidblack streaks
   along the resonance pedestal, biohazard-amber edge tape on
   restricted-section door; quarantined = yellow band sealing
   both bulkheads, sealed-X tape across helix entry, vent-
   grates plugged.
2. **Demon-summoning surface:** Hellbox 1 surface (existing,
   §3.12.1) — 1.6 m violet mirror set into the bay wall, brass-
   framed; Resonance Chamber pedestal beside the helix accepts
   violet stones for purification (see §3.9.1).
3. **CADES presence:** **violet-helmet chair console** in the
   restricted-section sub-room (per §3.1 cutscene `cs_breaking
   _point` post-trigger). 7-mission progression; helmet's
   interior surface accumulates one image-fragment per mission
   complete.
4. **Story items (§3.5):** DNA neural-bridge receipt plate
   (autoclave shelf, post-`medbay_device_awakened`); Dr. Lyra
   Vox medical chart with Ψ-watermark (chart cabinet); soul-
   stone purification pedestal accepts violet → gold; Hellbox 1
   accepts pre-purified gold for Dreamer offering.
5. **Mystery-arc bindings:** Jericho Jones E3 (bio-bed grip-
   anomaly footage on the autoclave display); Wraith Calder E2
   (Substrate-N residue on the helix base); the Seer arc
   surfaces no clue here.
6. **Investigation tier (axis 15):** see §2.2.5 — the four
   canonical states (initial / device-awakened / donated /
   refused) ARE the 4-tier register.
7. **Governance modifier reactions:**
   `quarantine_protocol_active` → restricted-section door is
   sealed even to faction-cleared players; `dreamer_blessing
   _active` → Resonance Chamber pedestal radiates one extra
   tier of warm-gold light.
8. **Epoch / ShadowTongue (axis 11):** Vex's chart Ψ-watermark
   intensifies as ShadowTongue power rises (≥40 plainly
   visible); on `grandEditActive`, the bio-bed's vital-sign
   readout shows indigo overstrike that obscures patient name.
9. **Cycle-phase lighting:** dawn 5800 K warm-amber on helix
   pool; balanced 5500 K canonical; dimming 5300 K; long-night
   5200 K cool-violet on autoclave glass.
10. **Faction livery:** Hierarchy-allied = restricted-section
    door bears the Hierarchy ouroboros sigil; Insurgency-allied
    = the Hellbox mirror's brass frame is over-stamped with a
    small insurgent caltrop in the lower-right corner;
    Antiquarian-allied = a small bound codex sits on the helix
    pedestal.
11. **Tournament window:** —
12. **Storyteller hooks:** Vox Neural Bridge journal expansion
    across tiers (each tier reveals more of the bridge's
    purpose); Cure Notes for Patient X (fragmentary lab notes
    on resistance to TV); Healer's Final Log (segmented audio
    in autoclave); Unlabeled Vial growing colder/darker each
    month (slow-tick living-world). Expansion-reserved zone:
    Sealed Medical Vault behind the bio-bed (reinforced door,
    smooth wall texture today). Living-world: bio-bed vital-
    signs cycle once per minute showing the player's stats;
    every 4th cycle, old patient stats flash (heart rate 0,
    flatline) before returning.
13. **HUD overlap:** `MoralityMeter.tsx` (tier-up may trigger
    here if soul-stone purification commits a Light delta);
    `CinematicDialogOverlay.tsx` (Vox dialogue);
    `SoulStonesPanel.tsx` (full inventory readable when
    examining the Resonance pedestal); `PaperDollRenderer.tsx`
    (Living Mirror equivalent — Med Bay's helix shows player's
    paper-doll mid-purification — see §3.11.1).

---

### 2.3 Command Bridge

- **id:** `bridge`
- **Deck:** 2
- **Adjacency:** Cryo Bay (rear lift), Archives (right doorway),
  Comms Array (forward viewport pass-through), War Room (left
  side passage at D8 unlock), Order Tribunal (D9 unlock)
- **Gating:** `bridge_systems_restored`
- **Existing canon:** `apps/shared/roomTierArtPrompts.ts` covers 4
  tier states (T0 captain's chair → T1 conspiracy pins → T2
  multi-screen → T3 fleet-comm war table). Do not re-author the
  four tiers.

#### 2.3.1 Plot-point hotspots

| Hotspot | Verb | Layer | Drives |
|---|---|---|---|
| Captain's pedestal (centre, raised) | use, sit | foreground | Elara dialog hub; Daily Brief popup |
| Conspiracy board (rear wall) | examine, pin, link | foreground | Conspiracy Boards launcher; Hamlet board |
| Star chart console (forward, under viewport) | use | foreground | Star Chart launcher; Trade Empire war map |
| Architect's Gambit chess table (right side) | use, sit | midground | Chess hub; Princes Game |
| Diplomatic comms terminal (left side) | use | midground | Diplomacy launcher |
| Quest mission board (rear-right) | use | foreground | Quest Board launcher |
| Battle-pass tracker (overhead banner) | look | midground | Battle Pass launcher |
| Prestige reset chamber door (rear-left) | examine | background | Prestige Cycle Reset (gated) |
| Captain's chair tilt | look | background | identity-chain Elara: tilts when she remembers Senator Voss |
| Forward viewport (at the front) | look | midground | Star Chart launcher; Observation Deck pass-through |
| Bridge console daily brief screen | look | foreground | Bridge Console home |
| War Room hatch (left side, hidden) | examine, open | background | War Room access at `soldier_chain` |

#### 2.3.2 NPCs

- **Elara** — always; standing at or near the captain's pedestal;
  Presence Line below.
- **Adjudicator Locke** — only if `trade_empire_unlocked`; comms
  feed on the warmap console (no body present, just feed).

##### Presence Line — Elara, Bridge

> *Elara stands at the captain's pedestal — a young woman, black
> wavy hair, blue eyes, wearing a grey-teal tessellated geometric
> high-collar top with cyan rim-light edge that drifts slowly
> across her skin in a faint cyan tessellation pattern. Her hands
> rest on the pedestal's brass top-plate; her posture is upright
> but watchful. She is fully solid — no transparency — but her
> shadow is fractionally cooler than the room's warm-gold key.*

##### Presence Line — Locke, Bridge (comms feed only)

> *Locke's comms feed hums on the warmap console as a single
> brass-edged smoked-glass panel — no figure visible, only an
> amber-and-cream Authority lattice glyph slow-pulsing in the
> centre, audio-only.*

#### 2.3.3 Game-feature launchers

| Feature | Diegetic object | Gate |
|---|---|---|
| Character Sheet | captain's pedestal | always |
| Quest Board | rear-right mission board | always |
| Battle Pass | overhead banner tracker | always |
| Prestige Cycle Reset | rear-left chamber door | `narrative_spine_complete` |
| Leaderboard | captain's pedestal sub-tab | always |
| Governance Hub | captain's pedestal voting console | always |
| Diplomacy | left-side comms terminal | always |
| Chess (Architect's Gambit + Princes Game) | right-side chess table | always |
| Star Chart | forward star-chart console | always |
| Conspiracy Boards | rear-wall pin-board | always |
| Hamlet Conspiracy Board | rear-wall second-tier pin board | `act_3_starting` |
| Recap Overlay | auto-trigger on entry | days_away ≥ 3 |
| Bridge Console (home) | the room itself | always |

#### 2.3.4 Layout Sentence (verbatim)

> *The Command Bridge seen from rear-aft as the player approaches
> from the lift — a long arrowhead chamber that narrows toward a
> floor-to-ceiling forward viewport, the captain's brass pedestal
> raised on a single oxblood-leather step at frame centre. The
> rear wall on the right carries a tall conspiracy board: cork,
> brass-rimmed, criss-crossed with thread between pinned cards.
> The left wall carries a comms terminal bank with smoked-glass
> screens. A chess table — brass and oil-blued steel grid, board
> piece-set arranged for an Architect's Gambit opening — sits
> against the right wall before the chair. A holographic
> star-chart console is set into the floor before the viewport.
> Ceiling is vaulted hull-rib with a single bronze chandelier
> over the pedestal. Floor is dark-stained metal plate inlaid
> with a brass compass rose around the pedestal step.*

#### 2.3.5 State Layer deltas

**Tier axis** — see `roomTierArtPrompts.ts` for the four canon
tiers. Don't re-author.

**Act axis (extending tier):**

- `STATE — act-tier 2:` *the conspiracy board has gained five
  new cards arranged in a cluster top-right; the Architect's
  Gambit on the chess table has advanced two moves (note: the
  white knight has moved to f3, the black pawn to e5 — keep
  this exact configuration as a pose-lock); a small brass-and-
  cream Authority pendant sits on the comms terminal bank.
  Mood: the politics have begun.*
- `STATE — act-tier 3:` *the conspiracy board's threads have
  been organised into three colour-bands (cyan, crimson, oxblood);
  one full pinned card has been removed leaving four pinholes
  visible — Elara has redacted something. Mood: she is curating
  the truth.*
- `STATE — act-tier 4:` *the captain's pedestal has gained a
  small brass plaque on its top-plate, no legible text; the
  forward viewport now shows the war-map sector control overlay
  faintly etched into the smoked glass. Mood: the war has
  reached the room.*
- `STATE — act-tier 5:` *the chess table's piece arrangement
  has been swept clear and replaced with a single black king
  laid on its side at the centre; the conspiracy board has a
  cyan thread that runs out of the room — through the door
  toward the Archives. Mood: a check has been called.*
- `STATE — act-tier 6:` *the captain's chair tilts at a
  perceptible 3° (panopticon eye glyph activation — Elara's
  Senator-Voss memory recovering); the chandelier has dimmed by
  20%; the brass compass rose around the pedestal step is
  warmer in saturation. Mood: she is remembering.*
- `STATE — act-tier 7:` *the chair is straight again but the
  pedestal is empty; the chess board has been folded; the
  conspiracy board carries one remaining card at its centre,
  brass-edged, no legible text — a single thread runs from it
  to the floor and disappears under the pedestal. Mood: the
  bridge has been left in order.*

**Faction-rep axis:**

- `STATE — faction-rep new_babylon_authority=high:` *Locke's
  comms-feed panel on the left bank is double-sized; the floor's
  brass compass rose is overlaid with an Authority red lattice
  ring; the chess table carries a small Authority cream-and-red
  pawn on the side rail. Mood: the Authority sits at the
  pedestal beside her.*
- `STATE — faction-rep insurgency=high:` *a single hot-orange
  card pinned high on the conspiracy board, just below the
  ceiling joist, almost out of frame; one terminus-orange swarm
  particle drifts past the forward viewport for one frame.
  Mood: the Insurgency reaches up to her.*
- `STATE — faction-rep antiquarian=high:` *the chess table's
  piece-set is replaced with an Antiquarian set — bone, crystal,
  cream pieces; one small green pressed-leaf bookmark sits on
  the captain's pedestal. Mood: she has been brought into the
  archive's good graces.*
- `STATE — faction-rep artificial_empire_substrate_rebels=high:`
  *the forward viewport carries a faint thought-virus purple
  bleed at its lower edge — substrate rebellion glyph — and one
  smoked-glass terminal on the left bank shows a single rebel
  sigil etched into its corner. Mood: she has rebels on the
  comms.*

**Season-phase axis:**

- `STATE — season-phase prologue:` *every smoked-glass terminal
  on the left bank shows the same single declaration glyph; the
  conspiracy board has one new card pinned at dead-centre
  (declaration card). Mood: the season is being declared.*
- `STATE — season-phase running:` (baseline)
- `STATE — season-phase closing:` *the chess table's piece
  arrangement freezes mid-move (track which side has tempo from
  active declaration); the pedestal lamp pulses once per 8
  seconds. Mood: last call.*
- `STATE — season-phase interregnum:` *the chandelier is at 30%;
  the smoked-glass terminals are dim; the chess piece-set is
  being collected by no visible hand into a brass tray on the
  table edge. Mood: the night between.*

**Trust axis (Elara):**

- See Presence Line for default. Trust deltas only modify Elara's
  expression and the witness-glyph bloom, not the room.
- `STATE — trust elara=lucid:` *Elara's right hand carries a
  small folded card; the witness-glyph anchor at (0.50, 0.30)
  carries a second-order cyan filament reaching down to the
  pedestal's brass plaque. Mood: she has prepared a brief.*
- `STATE — trust elara=luminous:` *Elara is half-turned toward
  camera, a faint cyan tessellation visible across the bridge
  of her nose and along her collarbone — her honest signature;
  the captain's chair has a single hand-mark on the armrest. Mood:
  she has been seen.*

**Morality axis:**

- `STATE — morality light:` *Elara stands one step closer to
  the pedestal centre; warm-gold key reads warmer.*
- `STATE — morality dark:` *Elara stands one step back from
  centre; phosphor-lavender takes the key direction; her
  cyan-tessellation drift slows by 30%. Mood: she is harder to
  see.*

**System-unlock axis:**

- `STATE — unlock chess_mastered=true:` *the chess table now
  shows an Architect's Gambit endgame position (specific:
  white K+R vs black K, mate-in-3); a small brass title token
  sits on the table edge. Mood: she has stopped teaching you.*
- `STATE — unlock trade_empire_unlocked=true:` *Locke's
  comms-feed panel is present (see Presence Line); a small
  brass-and-cream coin sits on the pedestal as Locke's keepsake
  marker. Mood: the trade has begun.*
- `STATE — unlock guild_formed=true:` *the conspiracy board has
  gained a guild banner draped along its top edge; one of the
  smoked-glass terminals on the left bank shows a guild crest.
  Mood: the company is yours.*
- `STATE — unlock chess_climb_master=true:` *the chess table is
  empty of pieces but has a single brass title-plate set into
  it; the right-wall art shows an Architect silhouette in
  shadow. Mood: you have climbed the rating.*

**Lore-discovery axis:**

- `STATE — discovered elara_is_senator_voss:` *the captain's
  chair is tilted at the canonical 3° (see act-tier 6); a
  single panopticon-eye glyph etches into the brass plaque on
  the pedestal — visible only at thumbnail scale. Mood: you
  have read her file.*
- `STATE — discovered the_human_is_archon:` *the smoked-glass
  on the left-bank comms terminal shows a single crimson iris
  glyph for one frame in eight. Mood: you have read his file.*

**IRL-season axis:** wallpaper-thin (one decorative element on
the chandelier).

#### 2.3.6 Discovery cutscene

**Yes — `bridge_first_chair`.** 12 s. Veo 3.1. Camera dollies
forward from the rear-aft entrance; Elara turns 30° from the
viewport to face the player as they enter; the conspiracy board
behind her gains its first three pinned cards in time-lapse; the
chess table opens itself to the Architect's Gambit position. End
frame is the canonical T0 still from `roomTierArtPrompts.ts`.

#### 2.3.7 HUD/UI upgrade notes

- The Bridge **is** the home page (`/`, `BridgeConsole.tsx`). All
  toasts that auto-fire on first authenticated entry anchor to
  this room: `RecapOverlay`, `DailyRewardPopup`,
  `FeatureUnlockToast` for newly-unlocked systems.
- `RememberThisToast` always fires from Elara's position; anchor
  the toast slightly above-right of (0.50, 0.30) at thumbnail.

#### 2.3.8 Back-fill grid (axes 9–17 + storyteller hooks + HUD overlap)

1. **TV infection (axis 9, 5 brackets):** clean = no marker;
   exposed = wisps from the Bridge's overhead air-handler vents
   + thread along the captain's chair pedestal seam; spreading
   = mycelium fans across the conspiracy-board frame, cold-
   violet shimmer on War Map's holo-edge; corrupted = voidblack
   pooling at the chair's foot, Conspiracy Board's central
   node bleeds black; quarantined = yellow band sealing the
   forward viewport, sealed-X across the lift, red wash on
   navigation console.
2. **Demon-summoning surface:** —
3. **CADES presence:** post-M7 only — Bridge of Kael ambient
   state change. Captain's chair empty and warm; Agent Zero's
   station vacant cleaned; **Dischordia card on her console**
   showing Engineer's silhouette; Elara's portrait flickers;
   Human silent (signal absent from Comms feed).
4. **Story items (§3.5):** captain's master key (chair under-
   armrest, post-`bridge_systems_restored`); Galaxy Meter
   gauge (overhead, see §3.4.1); Year Ring (overhead, see
   §3.2.1); Hellbox 3 chalk-mark on tactical display (post
   first-connection-and-tome; see §3.12.3).
5. **Mystery-arc bindings:** Wraith Calder E1 (Conspiracy
   Board's bounty file as pinned card); the Seer arc surfaces
   no clue here directly but the Conspiracy Board references
   VAR-1109A/B in the marginalia drift.
6. **Investigation tier (axis 15):** initial = canonical
   Bridge; investigating = yellow tape on captain's chair, on
   War Map, on conspiracy board; partial-resolved = cyan tape
   + brass evidence-cart by the rear-aft lift; case-closed =
   tape removed, **closure object = a single brass plate
   etched with the player's act-7 chosen alignment, set into
   the captain's chair's headrest**.
7. **Governance modifier reactions:** any active vote shows
   the **folded-ballot glyph** (§3.6 `governance_vote_open`)
   in the upper-right of the conspiracy board; vote-closed
   shows sealed-ballot glyph; world-modifier active glows the
   board's edge in the modifier's accent colour.
8. **Epoch / ShadowTongue (axis 11):** ShadowTongue power ≥40
   → **Conspiracy Board flickers 43↔44 connections** (the
   indigo 44th line is the SHadow Tongue's edit); on
   `grandEditActive`, the entire board washes indigo and the
   War Map's holo-edge bleeds indigo onto the deck.
9. **Cycle-phase lighting:** dawn 5800 K warm-amber on Bridge
   pedestal; balanced 5500 K canonical; dimming 5300 K; long-
   night 5200 K cool-violet on viewport.
10. **Faction livery:** champion-tier banner of the player's
    most-allied faction unfurls on the Bridge's port wall;
    second-tier alliances fly half-furled; enemied factions
    are absent (their banner positions are empty hooks).
11. **Tournament window:** champion-tier tournament banner
    flies on Bridge's starboard wall during finals window;
    `tournament_round_close` notification shown via §3.6
    bracket-glyph.
12. **Storyteller hooks:** Ghost Commander's Shift Log (final
    entry blank reason — captain reassigned all crew to non-
    command compartments before cryo); Consensus Breaking
    Point (Conspiracy Board flickers 43↔44 connections daily);
    War Table Phantom Move (1 chess move per IRL day on the
    War Map's hidden chess overlay); Navigation to Nowhere
    ("Sanctuary" warp vector with all-zero coordinates;
    console locks if hovered). Expansion-reserved zones:
    Captain's Private Ready Room (sealed door right of chair,
    requires master key + trust-`elara`-≥80); War Room Sealed
    Observation Deck (background balcony). Living-world: every
    72 IRL hours a new connection line appears on the
    Conspiracy Board.
13. **HUD overlap:** Galaxy Meter gauge (§3.4.1) lives here as
    persistent HUD chip; Year Ring (§3.2.1) ceiling
    installation; `BridgeConsole.tsx` (the home-page surface);
    `RecapOverlay`, `DailyRewardPopup`, `FeatureUnlockToast`
    (anchor to Bridge); §3.6 Governance + Tournament
    notifications anchor to Bridge.

---

### 2.4 Archives

- **id:** `archives`
- **Deck:** 2
- **Adjacency:** Bridge (left doorway), Quantum Lab (rear at D10
  unlock), Antiquarian's Library (hidden door from Captain's
  Quarters → pocket dimension; the entrance from Archives is the
  long-reading-table bookshelf with one volume pulled half-out)
- **Gating:** `bridge_systems_restored`

#### 2.4.1 Plot-point hotspots

| Hotspot | Verb | Layer | Drives |
|---|---|---|---|
| Loredex graph console (centre table) | use | foreground | Loredex launcher (graph + cluster + investigation) |
| Card vault wall (left, ceiling-high) | examine | foreground | Card Browser; Card Gallery; Imprint Gallery |
| Lore quiz alcove (right) | use | midground | Lore Quiz; Codex; Civilopedia |
| Card-trade station (rear-left) | use | midground | Card Trading; Demon Pack Opening; Memory Energy |
| Replay vault (sealed glass cabinet, rear) | use | midground | Replay System launcher |
| Saga Timeline scroll (long west wall) | look, follow | midground | Saga Timeline launcher |
| Architect Dossier locked drawer | examine, open | background | gated by Architect cryptic page visit |
| Dreamer Dossier hidden alcove | examine | background | gated by Vision 3 |
| Antiquarian's bibliographic ladder | climb | midground | leads to high-shelf hotspots in Antiquarian Library pocket |
| Long reading-table candle | look | foreground | witness-glyph anchor; Antiquarian narrator pull |
| Burnt Seer's card on the table | examine, take | foreground | Engineer hook (forces The Human narrator on first visit) |
| Star-Chart timeline-orrery (rear-right) | use | midground | Star Chart cross-link |
| Bestiary slab (against rear wall) | use | midground | Bestiary launcher |
| Specimen Collection cabinet | examine | midground | Specimen Collection launcher |
| The Antiquarian's reading chair | look | foreground | Antiquarian Presence anchor |

#### 2.4.2 NPCs

- **The Antiquarian (Daniel Cross)** — visible if `act_2_complete`;
  always at the long reading table, his book open before him.

##### Presence Line — The Antiquarian, Archives

> *The Antiquarian sits at the long reading table — a man in his
> early sixties, slim, stooped from forty years in stacks, weathered
> dark coat over a cream high-collar shirt, half-glasses pushed up
> into thinning hair. A bound book is open in front of him; he
> reads with a brass-edged finger-rule. His gaze does not lift
> when the player enters but his head tilts a fraction in the
> direction of the door — present, accounted for, not
> interrupted. Default expression neutral.*

#### 2.4.3 Game-feature launchers

(Most launchers go through this room — see §4 for the full table.
Key Archives-only mappings: Loredex / Codex / Civilopedia / Card
Browser / Card Gallery / Imprint Gallery / Memory Energy / Card
Trading / Card Achievements / Demon Pack Opening / Spectator Mode
/ Replay vault / Saga Timeline / Bestiary / Specimen Collection /
Engineers Bench (lore section) / Architect Dossier / Dreamer
Dossier / Dreamer Fragments / Order of the Dreamer entry /
Investigation Board / Lore Journal / User Tomes / Conspiracy
Boards (read-only mirror) / Loredex Cluster.)

#### 2.4.4 Layout Sentence (verbatim)

> *The Archives seen from the doorway off the Bridge — a
> double-height vaulted hall with a long mahogany-and-brass
> reading table running its centre length, ten oxblood-leather
> reading chairs on each long side, brass desk lamps at every
> third place. The left wall is a card vault, ceiling-high,
> oil-blued steel grid behind smoked glass with thousands of
> brass-rimmed card-slots receding into the depth. The right wall
> is shelving — bound books, tomes, and slim cylindrical
> data-vials all interleaved, with a brass climbing-ladder on a
> rail. The west wall (left as you enter) carries the Saga
> Timeline as a single horizontal scroll-mural in oxblood and
> warm-gold. The rear wall has a tall Loredex graph console
> rotating slowly inside a brass-rimmed sphere. Ceiling carries
> exposed copper conduit ribbed by rib-vault arches. Floor is
> dark-stained wood with a brass compass-rose inset directly
> beneath the rear sphere. The room smells (the prompt cannot
> show this; the lighting must imply) of old paper, brass polish,
> and graphite.*

#### 2.4.5 State Layer deltas

**Act axis:**

- `STATE — act-tier 2:` *the long reading-table candle is lit; a
  bound book sits open with a brass-edged finger-rule across the
  page (Antiquarian arrival marker); the card vault has gained
  one full brass-rimmed slot lit from within, warm-gold. Mood:
  the room has been opened to you.*
- `STATE — act-tier 3:` *the Loredex graph console at the rear
  has gained a second slow-rotating ring; one tome on the
  right-wall shelf is laid spine-out instead of spine-in (an
  unfinished read); the climbing-ladder is at the high shelf,
  not the floor. Mood: someone has been working here.*
- `STATE — act-tier 4:` *a small brass cabinet — the Architect
  Dossier — is now visible, pulled out from under the Saga
  Timeline scroll on the west wall; one drawer is partially
  open. Mood: the file has been requested.*
- `STATE — act-tier 5:` *the Saga Timeline scroll-mural now
  shows a fresh ink-line at its right edge — the future; one of
  the data-vials on the right-wall shelf glows phosphor-violet,
  pulsing slow. Mood: the timeline is being written live.*
- `STATE — act-tier 6:` *the Antiquarian's reading chair carries
  his folded coat — he has stepped out, briefly, but the chair
  is held; the candle is lower than tier 2 but still lit. Mood:
  he is letting you read alone.*
- `STATE — act-tier 7:` *the long reading-table is empty — no
  book, no candle, no rule; the rear-wall Loredex sphere has a
  single book sealed inside it like a relic; the compass-rose
  beneath it is darker, polished. Mood: the work is filed.*

**Faction-rep axis:**

- `STATE — faction-rep antiquarian_shelf_mates=high:` *the
  reading table has gained a pressed-leaf bookmark across its
  near edge; a small bronze citation-mark is etched into the
  brass-edged finger rule. Mood: he has cited you.*
- `STATE — faction-rep antiquarian_casino_floor=high:` *a single
  Pazaak card sits at the table's far end, face-down; the
  candle's wick is shorter than baseline, almost a stub. Mood:
  he has noted your gambling.*
- `STATE — faction-rep new_babylon_authority=high:` *one of the
  card-vault slots in the upper-left corner of the wall has been
  cordoned with red lattice tape — Authority audit. Mood: they
  are reading what you read.*
- `STATE — faction-rep dreamer_shield=any:` *the Dreamer Dossier
  alcove (rear, above the Loredex sphere) becomes visible as a
  faint warm-gold seam; iris-cyan filaments drift across the
  upper third of the room. Mood: the Dreamer is filing alongside
  the Antiquarian.*

**Season-phase axis:**

- `STATE — season-phase closing:` *the candle is lit at full
  height; one specific card-vault slot blinks once, near the
  centre of the wall. Mood: a citation has been recorded.*

**Trust axis (Antiquarian):**

- `STATE — trust antiquarian=catalogued:` *the bound book on
  the table is open to a fresh page; a brass-edged card slipped
  into the back is visible. Mood: he is including you.*
- `STATE — trust antiquarian=cross-referenced:` *the climbing
  ladder is at chest-height on the right-wall shelf, paused at
  a tome with a brass corner-mark; a single warm-gold thread
  runs from this tome to the long table. Mood: he is
  citing-across.*
- `STATE — trust antiquarian=shelf-mate:` *the chair next to
  the Antiquarian's at the long table has been pulled out; a
  small brass-rimmed card is laid at that chair's place — your
  citation-mark. Mood: he has shelved you with him.*
- `STATE — trust antiquarian=citation:` *the rear Loredex
  sphere now contains, sealed inside, a single book whose spine
  carries the player's chosen sigil; iris-cyan filaments thread
  through the sphere at the upper edge — Daniel Cross's
  out-of-time observation reaching down. Mood: he has filed
  you.*

**Reveal-stage axis (Antiquarian-specific):**

- `STATE — antiquarian-reveal daniel_cross_disclosed:` *every
  brass-edged card-rim in frame carries a faint cream-and-cyan
  doubling — the West Virginia signature; the Saga Timeline
  scroll's earliest end (left-most) shows a single thumbnail of
  a younger man in a programmer's chair (no legibility per
  anchor). Mood: he has admitted who he was.*

**Morality axis:**

- `STATE — morality dark:` *the candle's flame is steel-blue,
  not warm-gold; the long reading-table casts twin shadows
  (panopticon-eye doubling). Mood: the file is being written
  against you.*

**System-unlock axis:**

- `STATE — unlock loredex_graph_explored=true:` *the rear-wall
  Loredex sphere has gained inner rotating glyphs; one
  card-vault slot on the left wall is pulsing warm-gold (new
  entry). Mood: you have walked the index.*
- `STATE — unlock dreamer_fragments_unlocked=true:` *the Dreamer
  Dossier alcove is unmistakable — a brass-rimmed door at the
  rear, half-open, iris-cyan light spilling out. Mood: the
  parallel file is open.*
- `STATE — unlock conspiracy_solved=<id>:` *one specific card
  on the rear-wall conspiracy reflection mirror has been
  removed and laid face-up on the long table at the
  Antiquarian's elbow. Mood: the case is closed.*

**Lore-discovery axis:**

- `STATE — discovered antiquarian_is_daniel_cross:` (see reveal
  delta above)
- `STATE — discovered shadow_tongue_edits_loredex:` *one of the
  card-vault slots, mid-wall, has its smoked glass missing; the
  card itself shows shadowtongue wraith smear at 30% — a
  retroactive edit caught mid-frame. Mood: someone has been
  editing you.*

**IRL-season axis:** wallpaper-thin (the candle's flame colour
shifts subtly).

#### 2.4.6 Discovery cutscene

**Yes — `archives_burnt_card_pickup`.** 8 s. Veo 3.1. Camera
pushes forward to the long table; the burnt Seer's card lifts
itself half a centimetre from the table surface (no visible hand)
and the brass-rimmed candle flame steps from warm-gold to crimson
iris for one beat; The Human's voice signal threads across the
room (audio, not visual). End frame is the canonical Archives
baseline with the burnt card now on Antiquarian's elbow.

#### 2.4.7 HUD/UI upgrade notes

- This room hosts ~28 of the 200+ launchers — make every
  card-vault slot, shelf-tome, and timeline-section addressable
  as a discrete launcher target so the player isn't menu-diving.
  The visual **does not need legible text** because the
  identifier text comes from the runtime tooltip, not the prompt.

#### 2.4.8 Back-fill grid (axes 9–17 + storyteller hooks + HUD overlap)

1. **TV infection (axis 9):** clean = no marker; exposed =
   wisps from card-vault under-shelves, mycelium thread on the
   long-reading-table seam; spreading = mycelium fans across
   timeline-frame's brass border, cold-violet shimmer on locked
   vault drawer; corrupted = voidblack pooling at vault-base
   junctions, indigo wash on Hierophant marginalia stack;
   quarantined = yellow band sealing both bulkheads, sealed-X
   tape across the long-reading-table.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** burnt seer's card (Antiquarian's
   elbow, post-`burnt_card_recovered`); Hierophant's marginalia
   stack (locked vault drawer, post-Wraith-arc-E2); Coda's
   purpose shelf (rear-left bookcase, post-Degen-arc-E3);
   Velkraal's correspondence folio (locked vault, post-Game-
   Master-arc-E2); insurgency-witness-roster (long-reading-
   table, post-Vex-arc-E2).
5. **Mystery-arc bindings:** Wraith Calder E1, E2, E5
   (bounty-file pinned at card-catalog; Substrate-N residue at
   locked-vault); Jericho Jones E1 (callsign history card at
   card-catalog); the Seer arc E2, E3, E4 (Hierophant
   marginalia stack); Vex Solène E2, E3, E4 (insurgency-
   witness-roster, calibration-tapes archive); the Degen arc
   E3, E4, E5 (Coda Purpose Brief on shelf); Game Master arc
   E2, E4 (Velkraal correspondence folio).
6. **Investigation tier (axis 15):** initial = canonical
   Archives; investigating = yellow tape on each examined
   shelf-tome; partial-resolved = cyan tape + brass evidence
   cart by the timeline-frame; case-closed = tape removed,
   **closure object = a single bound brass codex on the
   reading table titled "The Antiquarian's Final Witness"**.
7. **Governance modifier reactions:** `tome_entry_inscribed`
   modifier → an animated quill briefly writes a new line on
   one of the timeline-frame's pages (single 4-s loop on
   inscription); world-modifier `lore_unlock_active` → all
   shelf-tomes' brass-edges glow warm-amber.
8. **Epoch / ShadowTongue (axis 11):** ShadowTongue power ≥40
   → **indigo marginalia overlay on every visible book spine**;
   on `grandEditActive`, the Antiquarian's chronicle on the
   long-reading-table is overstamped indigo and the central
   passage is unreadable.
9. **Cycle-phase lighting:** dawn 5800 K warm-amber on
   reading-table; balanced 5500 K canonical; dimming 5300 K;
   long-night 5200 K cool-violet on shelf glass.
10. **Faction livery:** Antiquarian-allied (championed) = a
    second silver candelabrum lit on the table; Insurgency-
    allied = a small folded paper-bird on the Antiquarian's
    elbow; Hierarchy-allied = a sealed Hierarchy folio on the
    chronicle table; Hierarchy-enemied = the chronicle is
    closed and pushed to the table's far edge.
11. **Tournament window:** —
12. **Storyteller hooks:** Forbidden Section sealed wing
    behind frosted glass (decrypt access at trust-`antiquarian
    `≥80); Margin Notes Evolution (Shadow Tongue annotations
    multiply over weekly ticks, becoming more legible);
    Blank Pages (Codex entry "The Warlord's Ascension"
    redacted with black bars until trust-100); Librarian's
    Personal Collection (small shelf, not in database; player
    requires permission or theft to read). Expansion-reserved
    zones: The Sealed Vault (biometric lock); The Lost Wing
    (collapsed corridor, archaeology quest). Living-world: the
    Antiquarian visibly works the room — moves between
    shelves, annotates entries; over weeks the Codex
    visibly expands with new entries.
13. **HUD overlap:** §9 unified Loredex Viewer (currently
    fragmented across `LoreGalleryPage.tsx`, `CodexPage.tsx`,
    `LoreJournalPage.tsx`, `ClueJournal.tsx` — Archives is
    the diegetic anchor for the missing unified component);
    `CinematicDialogOverlay.tsx` (Antiquarian dialogue);
    `MobileNarratorSlot.tsx` (Antiquarian voice surfaces here
    from trust-40+).

---

### 2.5 Comms Array

- **id:** `comms-array` / internal `comms_array`
- **Deck:** 3
- **Adjacency:** Bridge (forward viewport pass-through), Observation
  Deck (rear hatch), Cipher Den (D8 unlock at left wall)
- **Gating:** `bridge_systems_restored`

#### 2.5.1 Plot-point hotspots

| Hotspot | Verb | Layer | Drives |
|---|---|---|---|
| Eldest receiver dial (left bank, brass-and-bone) | listen, tune | foreground | Transmissions Inbox launcher |
| Meme broadcast screen (right bank) | look | foreground | Late Night with the Meme; meme static VFX surface |
| Saga Watch holocaster (centre dais) | use | foreground | Saga Watch; CoNexus Portal |
| Signal decryption console (rear) | use | midground | Signal Decryption launcher |
| NPC inbox cabinet (left rear) | use | midground | NPC Inbox |
| Palimpsest episode rack (right rear) | examine | midground | Palimpsest Episodes |
| The Human's voice-signal locus (one wall conduit) | listen | background | The Human narrator anchor |
| Scroll's archivist desk (forward right) | examine | midground | companion Scroll station |
| Cipher Den hatch (left wall, sealed) | examine | background | gates `spy_chain` |

#### 2.5.2 NPCs

- **The Human** — always; voice-signal only, no body. Signal
  threads from left-wall conduit; visualised as faint crimson iris
  pulse at the eldest receiver dial.
- **Scroll** (companion archivist) — at forward-right desk;
  presence is a single hooded silhouette in 50% silhouette,
  no facial detail, oxblood robe.

##### Presence Line — The Human, Comms Array (signal)

> *The Human is signal-present at the eldest receiver dial — no
> body, only a faint crimson iris bloom on the bone-and-brass
> dial face, slow-pulsing once every 4 s. The bloom is small (≤2%
> frame) and is the only departure from baseline lighting.*

#### 2.5.3 Layout Sentence

> *The Comms Array seen from the doorway off the Bridge — a long
> chamber the width of a freight bay, three banks of receiver
> hardware running its length: left bank is bone-and-brass
> mechanical dials and oscilloscopes (oldest tech); right bank is
> smoked-glass broadcast screens stacked four high (newest tech);
> centre is a holocaster dais on a single brass step. The rear
> wall is a signal decryption console with a phosphor-violet
> waveform display permanently ghosted across its smoked glass.
> The forward wall opens onto the Bridge through a brass-rimmed
> archway (no door — direct continuity). Ceiling is a vaulted
> hull-rib lined with copper-conduit cable trays, every cable
> tray active and humming with phosphor-violet sheaths. Floor is
> dark plate metal with the holocaster dais's brass step inlaid
> as a sunburst. A small archivist's desk sits forward-right
> against the wall, oxblood-leather-topped, oil-blued steel
> frame. The eldest receiver dial on the left bank is the
> witness-glyph anchor — a single bone-and-brass face slow-pulsing.*

#### 2.5.4 State Layer deltas

**Act:**

- `STATE — act-tier 2:` *the Saga Watch holocaster has its first
  episode reel mounted (a brass-and-glass cylinder); right-bank
  smoked-glass screen 1 carries a Late Night title card etched
  faintly. Mood: broadcast has begun.*
- `STATE — act-tier 4:` *one bone-and-brass dial on the left
  bank has been replaced with a chrome-and-cyan replacement
  dial; cyan tessellation drifts at the bridge edge — Elara has
  been working in here. Mood: she has updated the receivers.*
- `STATE — act-tier 5:` *the rear signal-decryption console
  shows three concurrent waveforms, all pulsing in
  phosphor-violet; one cipher hatch glyph (left wall) has cyan
  edge — gating Cipher Den is honest. Mood: traffic.*
- `STATE — act-tier 7:` *the holocaster dais carries a single
  burnt-out reel; left bank's eldest dial is silent, no pulse;
  right-bank screens dark. Mood: the channels have closed.*

**Trust (The Human):**

- `STATE — trust the_human=balanced:` *crimson iris bloom at
  the eldest dial is doubled — a soft inner ring inside the
  outer pulse. Mood: he is reaching back.*
- `STATE — trust the_human=warm:` *the crimson iris extends
  along the left-bank railings as a thin filament running to
  the holocaster dais; one of the right-bank smoked screens
  carries a single crimson outline of a coat-shoulder for one
  frame. Mood: he is letting himself be heard.*

**Reveal-stage (The Human progressive):**

- `STATE — human-reveal signal_static:` (baseline; only the
  bloom)
- `STATE — human-reveal signal_ghost:` *one right-bank screen
  shows a silhouette in static, no features — coat shoulder,
  collar, no face.*
- `STATE — human-reveal signal_fragment:` *a second right-bank
  screen shows the silhouette with one feature partially
  resolved (e.g., the line of a jaw); CRT scanlines.*
- `STATE — human-reveal signal_convergence:` *three right-bank
  screens carry the silhouette, near-clear, eyes obscured by a
  cyan-tessellation interference (Elara intercept) overlay.*
- `STATE — human-reveal full:` *the centre holocaster dais
  carries a small standing hologram — a man, mid-50s, dark
  trench-coat, hat brim shadowing eyes, hands in coat pockets,
  no longer obscured. The Human has taken a step into the
  room. Mood: at last.*

**Faction-rep:**

- `STATE — faction-rep insurgency=high:` *the holocaster dais
  carries a single hot-orange reel cylinder; one of the
  right-bank screens carries a terminus orange swarm overlay at
  10% opacity. Mood: their broadcasts are louder.*

**Season-phase:**

- `STATE — season-phase closing:` *every right-bank screen
  shows the same closing-glyph for one frame; left-bank dials
  all spike together.*
- `STATE — season-phase interregnum:` *all banks are silent,
  no pulse, no waveform. Holocaster dais is dim.*

**System-unlock:**

- `STATE — unlock cipher_den_accessible=true:` *the left-wall
  cipher hatch's edge is cyan-rimmed and unlocked; one of the
  bone-and-brass dials shows a single decrypted glyph in its
  centre window.*
- `STATE — unlock signal_decryption_intro_seen=true:` *the rear
  console's waveform locks into a clear pattern instead of
  ghosting.*

**Universal events:**

- `STATE — event event_meme_broadcast_active:` *every right-bank
  screen carries 1–2 frames of meme static; one of the
  bone-and-brass dials cracks a hairline along its bone face for
  one frame (the Meme is impersonating). Mood: someone is
  pretending.*

#### 2.5.5 Discovery cutscene

**Yes — `comms_first_signal`.** 8 s. The eldest dial's
bone-and-brass face cracks an audible squelch; the rear console
resolves a single phosphor-violet waveform into a recognisable
voice envelope; right-bank screen 1 lights for the first time
with static; The Human's first audio line lands. End frame:
canonical baseline with crimson iris bloom present.

#### 2.5.6 HUD/UI upgrade notes

- The mobile-narrator slot's "force The Human" rule
  (`narrator_beat_2_signal`) anchors here. When forced, the
  witness glyph at (0.25, 0.50) doubles in opacity for the
  duration of the beat.

#### 2.5.7 Back-fill grid (axes 9–17 + storyteller hooks + HUD overlap)

1. **TV infection (axis 9):** clean = no marker; exposed =
   wisps from antenna-relay grilles, mycelium thread on the
   broadcast-screen frame; spreading = mycelium fans across
   the frequency-wall display, cold-violet shimmer on relay
   nodes; corrupted = voidblack pooling at the relay junction-
   boxes, indigo wash on the queue-of-lost-signals display;
   quarantined = yellow band sealing the rear hatch, sealed-X
   tape across the antenna trunk-line.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** transmission-broadcast cylinders
   (rear shelf, post-`comms_first_episode_watched`); broken-
   transmitter fragment (left console under-shelf); silence-
   beacon module (small box on the central console, only
   visible if `comms_silence_beacon_observed`).
5. **Mystery-arc bindings:** Wraith Calder E1 (bounty file
   transmitted from external sender — the sender's metadata
   is inscribed on the broadcast cylinder); Wraith Calder E2
   (Substrate-N residue cargo manifest received via comms);
   no other arc surfaces direct clues here.
6. **Investigation tier (axis 15):** initial = canonical
   Comms; investigating = yellow tape on broadcast screen +
   queue-of-lost-signals display; partial-resolved = cyan
   tape + brass evidence cart at relay node; case-closed =
   tape removed, **closure object = a small brass plate set
   beneath the broadcast screen, etched with the player's
   chosen single-broadcast-cycle archive name**.
7. **Governance modifier reactions:** `comms_blackout_active`
   modifier → all displays go monochrome amber, queue-of-lost
   -signals shows "BLACKOUT" overlay; `community_milestone
   _broadcast` → broadcast screen plays the milestone trailer
   on a loop with §3.6 community chime audio cue.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → lost-
   signals queue gains 3 indigo-edged entries that overwrite
   real signals; on `grandEditActive`, all transmissions
   queue items are replaced with indigo-marginalia stubs.
9. **Cycle-phase lighting:** dawn 5800 K warm-amber on
   antenna-trunk; balanced 5500 K canonical; dimming 5300 K;
   long-night 5200 K cool-violet on relay panels.
10. **Faction livery:** Insurgency-allied = the comms-relay
    has a small caltrop-stamp on its base; Hierarchy-allied
    = the broadcast screen carries the ouroboros sigil in
    its lower-right corner; faction-enemied broadcasts are
    pre-empted with static.
11. **Tournament window:** finals = bracket diagram appears
    on the broadcast screen at top of every hour for 30 s.
12. **Storyteller hooks:** Queue of Lost Signals (centuries-
    spanning, partial unlock per signal); Frequency Wall
    (52.7 MHz pure unmodulated sine = the Human's substrate
    — see §3.1.2); Interrupted Conversation (half-recorded
    voices arguing "the protocol… when to wake them" —
    cuts mid-sentence); Silence Beacon (24h pulse, distress
    signal from before wake — see "the old emergency distress
    pulse" line). Expansion-reserved zones: Secure Vault Comm
    Relay (behind reinforced glass); Deep-Signal Archive
    (cartridge slot under main console). Living-world: every
    hour, soft radio chatter plays in the background; every
    7 hours, one phrase is clear ("This is [call sign]
    reporting in. No word from base.") with rotating call
    signs.
13. **HUD overlap:** §9 unified Transmission Video Player
    (currently fragmented across `TransmissionDisplay.tsx`,
    `CoNexusMediaPlayer.tsx` — Comms Array is the diegetic
    anchor for the missing unified component); `MoralityMeter
    .tsx` (low-fi callout when first-Human-contact triggers);
    §3.1.2 cutscene `cs_first_human_contact` plays in this
    room.

---

### 2.6 Observation Deck

- **id:** `observation-deck`
- **Deck:** 3
- **Adjacency:** Comms Array (forward hatch), Engineering (rear
  lift), Elemental Nexus (D10 unlock at left), Oracle Sanctum (D8
  unlock at right)
- **Gating:** `power_grid_restored` + item `observation-keycard`

#### 2.6.1 Plot-point hotspots

| Hotspot | Verb | Layer | Drives |
|---|---|---|---|
| Curved viewport (full forward, ceiling-to-floor) | look | foreground | Star Chart cross-link; Planet Gallery |
| Music-player console (centre) | use | foreground | Music Library; Discography; Album / Song / Watch |
| Constellation map (right wall) | examine | midground | Constellations + Saga Timeline; Lore Journal |
| Memorial corner (left wall, three brass plates) | look, place-token | foreground | Memorial Corridor entry (gates beyond) |
| Stargazing reading-bench (forward, low) | sit | midground | Witnessing Hub; Witnessing Pulse |
| The Eidolon's roost (high alcove) | look, feed | foreground | Your Eidolon NPC |
| Architect cryptic-page panel (rear-left, plain brass plate) | examine | background | `/architect` route entry |
| Dreamer Fragment alcove (rear-right) | examine | background | `/dreamer` route entry |
| Discography vault (left rear) | examine | midground | full music + watch + album catalogue |
| World Tapestry table (centre rear) | use | midground | World Tapestry launcher |

#### 2.6.2 NPCs

- **Your Eidolon** — always present at the high alcove. Posture
  shifts with bond tier (Untuned: distant; Tuning: half-turned;
  Resonant: facing player; Inseparable: descended to perch on
  reading-bench). No verbal expression — glyph-and-sound only.
- **The Human** — signal threads here too (≤2% bloom at the
  forward viewport edge).

##### Presence Line — Your Eidolon, Observation Deck

> *Your Eidolon is at the high alcove — a creature the size of a
> small heron, plumage rendered as soft phosphor-cyan filaments
> and oil-blued steel quills, eyes a steady warm-gold. Form is
> deliberately abstract (no specific real-world species
> reference). Posture: <bond-tier> (see deltas).*

#### 2.6.3 Layout Sentence

> *The Observation Deck seen from the rear lift — a wide
> half-circle chamber with a curved floor-to-ceiling viewport
> running its forward arc, real space visible beyond (a void
> studded with stars and the faint crescent of a distant
> planetoid; no specific named system). The centre carries a
> brass-and-oxblood music console set into a low stargazing
> reading-bench. The right wall is a constellation map etched
> into smoked glass with phosphor-violet pin-stars; the left
> wall holds three brass memorial plates set above a low
> oxblood-leather seat. The rear wall has a discography vault on
> the left (smoked-glass cabinet of brass cylinders, each a
> recorded album) and a World Tapestry table on the right (a
> waist-high brass-rimmed slate showing a slow-rotating
> sphere-overview of the saga world). Ceiling is open vault —
> exposed copper conduit and a high alcove on the rear wall
> where the Eidolon roosts. Floor is dark plate-metal with a
> brass compass-rose at the bench's foot.*

#### 2.6.4 State Layer deltas

**Act:**

- `STATE — act-tier 2:` *one brass cylinder on the discography
  vault is pulled forward, its case open; the constellation map
  has gained a single new pin-star upper-right. Mood: a song
  has been played.*
- `STATE — act-tier 4:` *the memorial corner's three brass
  plates have a fourth small plate added on the bench beside
  them — Memorial Corridor unlock. Mood: a name has been added.*
- `STATE — act-tier 5:` *the World Tapestry table's
  slow-rotating sphere has a single phosphor-violet thread
  running across it (Light/Dark imbalance shift). Mood: the
  world is leaning.*
- `STATE — act-tier 7:` *the curved viewport is darker — fewer
  stars, more void; the music console carries a single
  brass-edged blank cylinder at its slot, ready to be loaded.
  Mood: the playlist has finished.*

**Trust (Eidolon):**

- `STATE — trust eidolon=untuned:` *Eidolon at high alcove,
  facing away, plumage muted. (baseline)*
- `STATE — trust eidolon=tuning:` *Eidolon turned 90° toward
  player; plumage filaments brighter at the wing-edge.*
- `STATE — trust eidolon=resonant:` *Eidolon facing player; a
  single small glyph hovers between its claws (visible to
  player, not legible). Plumage at full saturation.*
- `STATE — trust eidolon=inseparable:` *Eidolon perched on the
  stargazing reading-bench; a thin warm-gold filament runs from
  its wing-tip to the music console's brass edge — bond
  visible. Mood: it has come down.*

**Faction-rep:**

- `STATE — faction-rep dreamer_shield=any:` *the Dreamer
  Fragment alcove (rear-right) is unmistakable — brass-rimmed
  hatch, faint iris-cyan glow.*
- `STATE — faction-rep antiquarian_cross_references=high:` *one
  brass cylinder in the discography vault carries an Antiquarian
  pressed-leaf bookmark protruding.*

**Season-phase:**

- `STATE — season-phase interregnum:` *the constellation map's
  pin-stars dim by 50%; the curved viewport carries a faint
  panopticon-eye glyph at upper-centre for the duration.*

**System-unlock:**

- `STATE — unlock memorial_corridor=true:` *the left-wall
  memorial corner's leftmost brass plate is recessed, revealing
  a corridor entrance behind it; warm-gold light spills out.*
- `STATE — unlock witnessing_hub=true:` *the stargazing
  reading-bench has a brass-rimmed witnessing pulse pad inset
  in its top — small (≤4%), warm-gold + cyan layered.*
- `STATE — unlock alignment_meter_seen=true:` *the World
  Tapestry table's sphere has a thin meter-band etched
  horizontally across it.*

**Lore-discovery:**

- `STATE — discovered architect_cryptic:` *the rear-left
  Architect-cryptic panel becomes a brass-rimmed door, ajar by
  10°, amber light beyond.*
- `STATE — discovered dreamer_vision_3:` *the rear-right
  Dreamer Fragment alcove is fully open; iris-cyan filaments
  drift across the upper third of the room.*

**Universal events:**

- `STATE — event event_oracle_dream_pull:` *the constellation
  map blooms with oracle starwhisper for one frame across all
  pin-stars simultaneously.*
- `STATE — event event_dreamer_vision_<N>:` *iris-cyan
  filaments saturate the upper third of frame; the curved
  viewport's stars realign into a recognisable face-pattern
  (no specific identity render — just suggestive).*

**IRL-season:**

- `STATE — irl-season winter:` *the curved viewport carries
  faint ice-crystal etching at its lower edge.*

#### 2.6.5 Discovery cutscene

**Yes — `obs_first_stargaze`.** 12 s. Camera enters from rear
lift; pulls forward to the bench; the Eidolon descends from
high alcove to the bench's far end (Tuning posture); the music
console plays one canonical Saga track for 6 s; the curved
viewport's stars realign once into a faint cyan tessellation.
End frame: canonical baseline with Eidolon at Tuning posture.

#### 2.6.6 HUD/UI upgrade notes

- This room hosts the most ambient-music + cinematic launchers
  on the Ark. Reserve the witness-glyph anchor at (0.50, 0.25)
  for cyan-only blooms — The Human's signal here is at the
  viewport edge (1% frame) and should not compete with Elara's
  upper-centre cyan.

#### 2.6.7 Back-fill grid (axes 9–17 + storyteller hooks + HUD overlap)

1. **TV infection (axis 9):** clean = no marker; exposed =
   wisps from telescope-yoke vents, mycelium thread on the
   star-chart console seam; spreading = mycelium fans across
   the prayer-wall etch-marks, cold-violet shimmer on the
   dark-spot tracking display; corrupted = voidblack pooling
   at the viewport seal, indigo wash on celestial-cycle
   panels; quarantined = yellow band sealing the rear hatch,
   sealed-X across the viewport.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** astronomer's log (left console
   under-shelf, post-`obs_first_dark_spot`); tracking report
   (data pad on observation console); telescope-anomaly
   recording chip (right console, shows cross-dimensional
   bleeding when activated).
5. **Mystery-arc bindings:** Wraith Calder E5 (Prophet's true
   identity glimpse — the dark spot on the viewport is named
   in the astronomer's log as "the Hierophant's seat"); the
   Seer arc surfaces no clue here.
6. **Investigation tier (axis 15):** initial = canonical
   Observation Deck; investigating = yellow tape on telescope
   yoke + dark-spot display; partial-resolved = cyan tape +
   brass evidence cart at viewport; case-closed = tape
   removed, **closure object = a small brass plate set into
   the viewport's lower frame, etched with the player's
   chosen end-game alignment phrase**.
7. **Governance modifier reactions:** `dark_spot_classified`
   modifier → the dark-spot display shows redacted black
   bars over its data; `community_milestone` → telescope
   yoke aligns toward the milestone's named celestial body
   (1-time animation).
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → prayer-
   wall scratches re-arrange themselves nightly into new
   sentences (visible on revisit); on `grandEditActive`, the
   astronomer's log is overstamped indigo, final entries
   replaced with marginalia stubs.
9. **Cycle-phase lighting:** dawn 5800 K warm-amber on
   viewport rim; balanced 5500 K canonical; dimming 5300 K;
   long-night 5200 K cool-violet on starfield reflection.
10. **Faction livery:** Antiquarian-allied (championed) =
    a small bound chronicle pinned to the prayer wall;
    Hierarchy-allied = the dark-spot display carries the
    ouroboros sigil; Insurgency-allied = the telescope yoke
    has a small caltrop-stamp on its base.
11. **Tournament window:** —
12. **Storyteller hooks:** Tracking Report (dark spot moving
    0.001%/day → collision in ~247 years — Act 6+ trajectory
    questline); Astronomer's Log (escalating entries: "the
    stars are wrong" → "[ENCRYPTED]" final); Telescope
    Anomaly (occasional flicker shows a corridor, a face,
    static — cross-dimensional bleed); Prayer Wall (scratches
    forming "Please send help" / "I am afraid" repeated
    dozens of times — previous-crew etchings). Expansion-
    reserved zones: Sealed Observatory Chamber (above the
    deck, locked); The Dark Spot Dock (theoretical docking
    bay visible in distance). Living-world: starfield shifts
    subtly over months — constellations rotate, planets
    appear/disappear from view.
13. **HUD overlap:** Eidolon Sanctum / Bond Chamber
    counterpart (§3.9-adjacent — the Eidolon-bond progression
    is visible here when player examines the viewport);
    `MoralityMeter.tsx` (deep-stare at the dark spot can
    trigger a tier-up cinematic fragment); §3.1.5 cutscene
    `cs_thought_virus_manifests` may play here if Observation
    Deck is the first room to cross `clean → exposed`.

---

### 2.7 Engineering Bay

- **id:** `engineering`
- **Deck:** 4
- **Adjacency:** Observation Deck (rear lift), Armory (right
  doorway), Cargo Hold (left descent), Forge Workshop (rear-right
  hatch), Engineering Core (D8 hidden, rear-floor hatch), Chaos
  Forge (D9 unlock at far rear)
- **Gating:** `power_grid_restored`

#### 2.7.1 Plot-point hotspots

| Hotspot | Verb | Layer | Drives |
|---|---|---|---|
| Master forge anvil (rear) | use | foreground | Forge launcher |
| Fabrication bench (centre) | use | foreground | Crafting; Card Fusion |
| Research lab terminal (left) | use | foreground | Research Lab; Tech Tree |
| Hacking puzzle station (right) | use | midground | Hacking Puzzle |
| Engineer's bench logs cabinet (left rear) | examine | midground | Engineers Bench (lore) |
| Schematic map drafting table (centre rear) | use | midground | Ship Schematic Map |
| Pressure monitoring panel (above bench) | look | midground | telemetry overlay |
| Shadow Tongue's handprint on a steel beam (background) | look | background | identity-chain — only legible at `engineer_chain` advanced |
| Quarantine spread overlay (when active) | look | midground | event_universal_quarantine indicator |
| Forge Workshop hatch (rear-right) | open | foreground | Forge Workshop room |
| Chaos Forge sealed door (far rear) | examine | background | `chaos_chain` gate |
| Engineering Core floor-hatch (rear-floor) | examine | background | `engineer_chain` gate |

#### 2.7.2 NPCs

- **Shadow Tongue** — primary NPC; never visible in the room as a
  body. Render: a single shadowtongue wraith smear at one corner
  (varies by act). At trust threshold, the smear concretises into
  a single dark hand on a steel beam (still no full figure).
- **Agent Zero** — visible if `act_3_starting`; standing at the
  fabrication bench, half-turned, tactical posture. (See §3 for
  full Agent-Zero / Vex transformation.)

##### Presence Line — Shadow Tongue, Engineering (smear form)

> *Shadow Tongue is present as a long-exposure smear of shadow
> at one corner of the room — render it at the rear-left vertical
> beam, hip-height, ~3% of frame, no face, no detail, just a
> wraith-smear of motion-blurred black across the brass rivet
> line. The smear is darker than any other shadow in the
> render.*

#### 2.7.3 Layout Sentence

> *The Engineering Bay seen from the rear lift descent — a large
> industrial chamber the height of a two-storey hold, master
> forge anvil dominating the rear wall (cooling slowly; embers
> visible inside), fabrication benches running left-and-right
> along the centre line, research lab terminal banks against the
> left wall (smoked glass, phosphor-violet tools tray), hacking
> puzzle station against the right wall. The ceiling is a high
> exposed-rib vault with copper conduit and welded brass
> ductwork; sparks (3% frame, drifting) descend from one
> rear-right ceiling welder. The floor is dark plate-metal,
> oil-stained, with a faint compass-rose under the central
> fabrication bench. Tool racks run beside every bench,
> brass-and-oil-blued-steel. The rear wall, beyond the anvil,
> carries a heavy bulkhead (Forge Workshop access on the right;
> sealed Chaos Forge door at far rear). A floor hatch is set
> into the rear-floor (Engineering Core, locked).*

#### 2.7.4 State Layer deltas

**Tier axis** — see `roomTierArtPrompts.ts` (sparse → tool racks
→ fabricator v2 → master forge with holo-blueprints). Don't
re-author.

**Act axis (extending tier):**

- `STATE — act-tier 3:` *the fabrication bench has a
  half-finished card-blank on it; the research lab terminal on
  the left wall has a phosphor-violet sample-vial held at its
  top.*
- `STATE — act-tier 4:` *the rear-floor hatch (Engineering
  Core) has its seal cracked; warm-gold light spills out the
  edge; brass-steam wisps from the seam.*
- `STATE — act-tier 5:` *Shadow Tongue's smear has concretised
  into a dark hand-print on the rear-left beam (no full body —
  just the print, ~2% frame).*
- `STATE — act-tier 7:` *the master forge is cold, the anvil
  empty, the fabrication bench cleared; one card-blank remains
  on the anvil's brass top, finished.*

**Faction-rep:**

- `STATE — faction-rep insurgency_zero_doctrine=high:` *one tool
  rack carries a hot-orange-tagged tool — Insurgency stamp;
  terminus orange swarm at 5% drift across the floor.*
- `STATE — faction-rep hierarchy_acquisitions=high:` *one
  smoked-glass research terminal carries a Hierarchy black
  diamond etched into its corner.*
- `STATE — faction-rep new_babylon_civic_engineers=high:` *all
  tool racks have a small Civic Engineers cream-on-cream
  diamond sticker at chest height.*

**Trust (Shadow Tongue):**

(Shadow Tongue trust ladder is canonical-absence — at higher
trust the smear is **smaller**, not larger; at full trust the
smear is gone and only a single hand-print remains.)

- `STATE — trust shadow_tongue=high:` *Shadow Tongue smear is
  reduced to ~1% frame; a single dark hand-print on the
  rear-left beam is honest.*

**System-unlock:**

- `STATE — unlock crafting_unlocked=true:` *the fabrication
  bench shows a full active toolkit, all tools out and laid;
  the research terminal banks are illuminated.*
- `STATE — unlock chaos_chain_active=true:` *the far-rear Chaos
  Forge sealed door has cyan crack-lines forming along its
  seal — about to open.*
- `STATE — unlock engineer_chain_active=true:` *the rear-floor
  Engineering Core hatch has its handle pulled up; a thin
  warm-gold seam runs around it.*

**Universal events:**

- `STATE — event event_universal_quarantine:` *a thin amber
  band painted across the floor at the right (Armory) doorway;
  brass-steam intensified at 5% across the rear; voidblack
  static at 2% across the master forge surface.*

**Lore-discovery:**

- `STATE — discovered shadow_tongue_face_to_face_complete:` *the
  smear is gone; the rear-left beam carries a single small
  brass plate over where the smear used to be — sealed.*

#### 2.7.5 Discovery cutscene

**Yes — `engineering_first_forge`.** 12 s. Master forge anvil
ignites — embers cascade upward, brass-steam wisps; fabrication
bench's tools rise from their slots and float into ready
positions; Shadow Tongue's wraith smear briefly extends across
the rear wall before collapsing back to its corner. End frame:
T2 canonical engineering still.

#### 2.7.6 HUD/UI upgrade notes

- The Engineering room is the diegetic home of the **system
  unlock** axis — every mech-tutor toast triggered here should
  anchor to the relevant tool/bench, not float in the corner.

#### 2.7.7 Back-fill grid (axes 9–17 + storyteller hooks + HUD overlap)

1. **TV infection (axis 9):** clean = no marker; exposed =
   wisps from reactor-housing seams, mycelium thread on the
   crafting-bench underside; spreading = mycelium fans across
   the schematic-pad's brass border, cold-violet shimmer on
   reactor coolant lines; corrupted = voidblack pooling at
   reactor base (capacity readout drops fast — see §3.1.4),
   indigo wash on instruction-manual page 47; quarantined =
   yellow band sealing reactor-access corridor, sealed-X across
   crafting bench.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** all 7 combine items live here
   (decoder + key, schematic-rubbing + corrupted-fragment,
   drained-cell + energy-shard, basic-medkit + neural-stim,
   antenna + amplifier, virus-sample + antibody, antiquarian-
   shard + void-crystal); editor's substitution-weapon schema
   (schema-rack); Mol'Vereth's visiting card (schematic-pad
   binding, Degen-arc-E1).
5. **Mystery-arc bindings:** Vex Solène E1, E2, E3, E4, E5
   (reactor signature + workshop letter + apprentice letter +
   tool migration + scheduled session); the Seer arc E4
   (acoustic signature on reactor); Jericho Jones E1 (Iron
   Lion imprint protocol on instruction manual page 1);
   Degen E1, E2 (Mol'Vereth's card; quarterly routing on
   blueprints); Game Master E3 (Brel's practice edit-drafts
   in blueprints).
6. **Investigation tier (axis 15):** initial = canonical
   Engineering; investigating = yellow tape on each combine
   slot; partial-resolved = cyan tape + brass evidence cart
   beside reactor; case-closed = tape removed, **closure
   object = a single restored schematic mounted under glass
   on the bench (the indigo edit cleared)**.
7. **Governance modifier reactions:**
   `crafting_speed_boost` modifier → bench tools have a soft
   warm-amber glow; `reactor_priority` → reactor's
   stabiliser ring shows a steady gold pulse rather than
   amber; `quarantine_protocol_active` → reactor-access
   corridor sealed.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → indigo
   overlay on coolant schematic redirects 3 connection points
   (the active edit); on `grandEditActive`, instruction-
   manual page 47 (Lyra's dedication) is overstamped indigo
   and the workshop diary is unreadable.
9. **Cycle-phase lighting:** dawn 5800 K warm-amber on
   reactor housing; balanced 5500 K canonical; dimming
   5300 K; long-night 5200 K cool-violet on bench glass.
10. **Faction livery:** Insurgency-allied = small caltrop-
    stamp on the reactor's brass plate; Hierarchy-allied =
    sealed Hierarchy seal on the crafting-bench; Antiquarian-
    allied = a small bound codex on the bench corner;
    Hierarchy-enemied = the reactor's stabiliser ring is
    dimmed.
11. **Tournament window:** —
12. **Storyteller hooks:** Incomplete Engine Schematic (final
    8% deleted by the Engineer to prevent Warlord upgrade);
    Counting Tally on wall (Human's day-count incrementing
    daily — see Comms Frequency Wall); Engineer's Tool Set
    (one tool missing — locked in Captain's Quarters);
    Recurring Substrate Integrity Alert (Human's heartbeat
    proof). Expansion-reserved zones: Engineer's Private Lab
    (sealed door behind workbench, requires master key);
    Reactor Access Shaft (vertical shaft, too radioactive
    today). Living-world: 10-min crafting sound-loop
    (whirr/ping/hiss) cycling endlessly; on `bridge_systems
    _restored` the loop's pitch shifts.
13. **HUD overlap:** §9 unified Resource Counter (currently
    fragmented — Engineering is the diegetic anchor for
    crafting resources); `PaperDollRenderer.tsx` (forged
    item visible on player paper-doll on equip);
    `CinematicDialogOverlay.tsx` (Vex dialogue at apprentice
    handover scenes); §3.1.4 cutscene `cs_breaking_point`
    plays in this room.

---

### 2.8 Forge Workshop

- **id:** `forge-workshop`
- **Deck:** 4
- **Adjacency:** Engineering (sole entrance, rear-right hatch)
- **Gating:** `engineer_chain`

#### 2.8.1 Plot-point hotspots

| Hotspot | Verb | Layer | Drives |
|---|---|---|---|
| Kiln (centre, glowing) | use | foreground | Advanced Crafting (kiln track) |
| Anvil (right) | use | foreground | Smithing minigame |
| Schema rack (left wall) | examine | midground | schema collection |
| Master crafting bench (rear) | use | foreground | Recipe synthesis |
| Quench tank (foreground) | use | midground | item finishing |
| Apprentice's locker (left rear) | examine | background | Apprentice Trial entry |

#### 2.8.2 NPCs

None. Narrator slot pulls Elara (warm-soft) on first entry, then
suppresses (the Forge is contemplative). Witness-glyph anchor
(0.55, 0.55) blooms warm-gold (not cyan/crimson) — the Forge's
signature.

#### 2.8.3 Layout Sentence

> *The Forge Workshop seen from the rear-right hatch entrance off
> Engineering — a small intimate chamber the size of a private
> chapel, kiln glowing warm-orange at frame centre, anvil on
> the right (master-grade brass-and-steel block, sigil-etched
> top), schema rack on the left wall (oil-blued steel pigeonhole
> grid, each pigeonhole holding a rolled brass tube), master
> crafting bench against the rear wall (long brass-topped, three
> separate work-zones: forging, fitting, finishing), quench tank
> in the foreground (brass-rimmed, oil-blued steel, a thin layer
> of phosphor-violet liquid suspended over water). Apprentice's
> locker on the left rear (oil-blued, brass-pinned). Ceiling is
> low-vaulted with a single chimney-flue rising into hull conduit.
> Floor is brass plate over slate. The room's warm-gold key
> direction comes from the kiln mouth — the sole light source.*

#### 2.8.4 State Layer deltas

**Act:**

- `STATE — act-tier 3:` *the kiln is at full burn, embers
  rolling slowly upward; anvil top has a half-finished item
  (no specific shape).*
- `STATE — act-tier 5:` *the schema rack has six pigeonholes
  pulled out, brass tubes laid out on the bench; quench tank's
  phosphor-violet has thinned by 50%.*
- `STATE — act-tier 7:` *kiln cold, anvil clean, schema rack
  full but unreadable; one finished item — a small brass
  token, unrendered specifics — sits on the bench. Mood: the
  trade is mastered.*

**System-unlock:**

- `STATE — unlock crafting_mastered=true:` *all three master
  crafting bench zones are active (foundry / fitting / finishing
  flames, three small fires). Mood: full mastery.*
- `STATE — unlock apprentice_trial_eligible=true:` *the
  apprentice's locker is open, contents visible: a small
  brass-and-leather apprentice card.*

**Faction-rep:**

- `STATE — faction-rep insurgency=high:` *anvil top carries a
  hot-orange tag tied to a half-finished item.*
- `STATE — faction-rep new_babylon_civic_engineers=high:` *
  schema rack has a Civic Engineers diamond stamp on its top
  rail.*

**Trust (any companion who shares the Forge):** N/A — no
companion residency.

#### 2.8.5 Discovery cutscene

**Yes — `forge_first_smelt`.** 8 s. Kiln ignition; brass-steam
wisps; one specific brass tube rolls itself out of the schema
rack (no visible hand) and unrolls flat on the bench. End frame:
canonical Act-3 forge still.

#### 2.8.6 Back-fill grid (axes 9–17 + storyteller hooks + HUD overlap)

1. **TV infection (axis 9):** clean = no marker; exposed =
   wisps from kiln vents, mycelium thread on anvil base seam;
   spreading = mycelium fans across schema-rack, cold-violet
   shimmer on kiln interior; corrupted = voidblack pooling
   under anvil, kiln burns black instead of orange; quarantined
   = yellow band sealing the corridor entry, sealed-X on bench.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** editor's substitution-weapon
   schema (rack, never-built; Lyra's daily refusal); bay-leaf
   firing residue (kiln); Lyra's anvil signature (engraved
   into anvil base, only readable post-`vex_workshop_diary
   _read`).
5. **Mystery-arc bindings:** Vex Solène cross-reference (the
   anvil bears Lyra's engraved signature — Lyra's century-
   long calibration); the Seer arc surfaces no clue here.
6. **Investigation tier (axis 15):** initial = canonical
   Forge; investigating = yellow tape on schema rack + kiln;
   partial-resolved = cyan tape + brass evidence cart at
   anvil; case-closed = tape removed, **closure object =
   the editor's substitution-weapon schema rolled and
   sealed with Lyra's wax stamp on the rack's top shelf
   (still unbuilt, now formally archived)**.
7. **Governance modifier reactions:**
   `crafting_speed_boost` → kiln burns hotter (orange-white
   instead of orange-amber); `quarantine_protocol_active` →
   kiln cold, anvil dust-covered.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → schema
   rack's bound tubes carry indigo marginalia at their seals;
   on `grandEditActive`, the editor's schema unrolls itself
   on the bench overnight (visible on next entry).
9. **Cycle-phase lighting:** dawn 5800 K warm-amber on kiln
   exterior; balanced 5500 K canonical; dimming 5300 K;
   long-night 5200 K cool-violet on anvil polish.
10. **Faction livery:** Insurgency-allied = small caltrop-
    stamp on the kiln; Hierarchy-allied = the anvil bears
    a small Hierarchy ouroboros etched in its base;
    Antiquarian-allied = the schema rack has a small bound
    chronicle pinned to its top.
11. **Tournament window:** —
12. **Storyteller hooks:** Editor's Substitution-Weapon
    Schema (Lyra refused to build it; kept visible as daily
    refusal); Bay-leaf firing tradition (Lyra's ritual,
    metallurgically nonsense but ritually significant); Last
    Firing Interrupted (kiln ash undisturbed since Lyra's
    death — visible only on close inspection). Expansion-
    reserved zones: Apprentice's Workbench (currently empty,
    awaiting Vex's apprentice arrival in Act 5+);
    Restoration Niche (alcove in the back wall, draped in
    canvas, future expansion). Living-world: kiln interior
    shows a faint heat shimmer even when cold (residual
    brass cooling); every 7 IRL days, one bay-leaf appears
    in the kiln's ash bed (Lyra's ritual continuing).
13. **HUD overlap:** `PackOpening.tsx` (forged-item ceremony
    plays here on craft completion); §9 unified Resource
    Counter (crafting materials); `CinematicDialogOverlay
    .tsx` (Lyra's posthumous voice-line on first kiln
    ignition).

---

### 2.9 Armory

- **id:** `armory`
- **Deck:** 5
- **Adjacency:** Engineering (left doorway), Cargo Hold (right
  descent), Trophy Room (rear pocket), Shadow Vault (D8 hidden,
  rear-left hatch), Cipher Den (D8, rear-right hatch — alternate
  entry to Cipher Den from comms)
- **Gating:** `combat_systems_online`

#### 2.9.1 Plot-point hotspots

| Hotspot | Verb | Layer | Drives |
|---|---|---|---|
| Weapons rack (centre, ceiling-tall) | examine, take | foreground | Inventory cross-link |
| Combat simulator dais (rear) | use | foreground | PvP Arena; Boss Battle; Co-op Encounters |
| Terminus Swarm tower-defense table (right) | use | foreground | Terminus Swarm; Tower Defense |
| Friendly challenges board (left) | use | midground | Friendly Challenges |
| Trophy wall (rear pocket entrance) | look | midground | Trophy Room launcher |
| Boss Mastery plinths (rear corners) | examine | midground | Boss Mastery progression |
| Agent Zero's case (locked, glass-fronted, centre-left) | examine | foreground | Agent Zero / Vex identity-chain |
| Jericho's sidearm field-strip station (forward-right) | examine | foreground | Jericho NPC presence |
| Shadow Vault hatch (rear-left, sealed) | examine | background | `assassin_chain` gate |
| Cipher Den hatch (rear-right, sealed) | examine | background | `spy_chain` alternate access |

#### 2.9.2 NPCs

- **Agent Zero** (pre-Act-3) — voice-only via the locked
  glass-fronted case. The case carries a static-layer
  voidblack overlay (1%).
- **Jericho Jones** — visible if `trade_empire_unlocked`; at
  forward-right field-strip station.

##### Presence Line — Jericho Jones, Armory

> *Jericho is field-stripping a sidearm at the armoury bench —
> a man in his mid-30s carrying himself older, athletic build,
> short-cropped dark hair, dark-tan skin, weathered Insurgency
> field-jacket (oil-blued steel buckles), kneeling slightly at
> the bench with the sidearm components laid in a precise line.
> Posture: trained, settled, not on guard. A small brass
> pre-Fall Iron Lion token hangs from a leather cord at his
> neck.*

#### 2.9.3 Layout Sentence

> *The Armory seen from the doorway off Engineering — a tall
> rectangular hall, weapons rack dominating the centre line
> (ceiling-tall oil-blued steel grid with brass-rimmed slots,
> half full, half empty), combat simulator dais raised on a
> single brass step at the rear (a circular pit with phosphor-
> violet emitters around its rim), Terminus Swarm tower-defense
> table on the right (low brass-topped square table with
> miniature defensive structure pieces frozen mid-deployment),
> friendly challenges board on the left (cork-and-brass with
> pinned challenge cards). The rear wall opens into the Trophy
> Room pocket through an arched corridor; flanking the arch
> are two brass plinths for boss-mastery trophies. Agent Zero's
> case sits centre-left in the room — a ceiling-to-waist
> glass-fronted weapons cabinet carrying one sealed sidearm and
> nothing else, the case itself locked with a brass-and-bone
> key-mechanism. Forward-right: a small armorer's bench with an
> oil-blued steel surface, used for field-stripping. Ceiling is
> exposed-rib with welded brass conduit; floor is dark plate
> with brass scuff guards. The witness-glyph anchor is at Agent
> Zero's case, ~5% frame.*

#### 2.9.4 State Layer deltas

**Tier axis** — see `livingArk.ts` ROOMS for tier descriptors
(weapons cache → battle-scarred walls → combat holo → warrior's
sanctum).

**Act:**

- `STATE — act-tier 3:` *Agent Zero's case has a faint
  voidblack-static halo around its glass; one slot in the
  centre weapons rack carries a non-standard sidearm (not
  Insurgency-issue) — Vex's pre-transference loadout.*
- `STATE — act-tier 5:` *Vex's transformation cinematic
  artefact: Agent Zero's case is empty, the sidearm gone; one
  brass plate inside the case carries a small etched
  inscription (no legible text). Mood: she has been removed.*

**Faction-rep:**

- `STATE — faction-rep insurgency_zero_doctrine=high:` *the
  friendly challenges board has a hot-orange thread running
  across its top edge; one weapons-rack slot has been
  re-fitted with a sigil-etched zero-doctrine pin.*
- `STATE — faction-rep new_babylon_authority=high:` *the
  combat simulator dais carries a thin Authority red lattice
  ring at its rim.*

**Trust (Jericho):**

- `STATE — trust jericho=acquaintance:` *one component on the
  field-strip station is half-disassembled toward the player's
  approach.*
- `STATE — trust jericho=crew:` *Jericho's pre-Fall Iron Lion
  token is unfastened from his neck and laid on the bench.*
- `STATE — trust jericho=confidant:` *a second mug — coffee —
  sits at the bench's edge, indicating a shared session.*
- `STATE — trust jericho=sworn:` *Jericho is half-turned toward
  the door, looking up; the Heart of Time's docking-clamp
  status panel (above the bench) shows two berths active, both
  occupied. Mood: he is waiting for you.*

**Reveal-stage (Jericho):**

- `STATE — jericho-reveal thaloria_known:` *a small green-
  cloth-wrapped object sits at the bench's edge — Akai Shi's
  mercy-killed token. Mood: he carries her.*
- `STATE — jericho-reveal heart_offered:` *the Heart of Time
  docking panel shows the second berth's status: warm-gold
  (offered, not yet taken).*
- `STATE — jericho-reveal aboard:` *the docking panel's second
  berth is at full warm-gold; Jericho's token is back on his
  neck. Mood: chosen.*

**System-unlock:**

- `STATE — unlock terminus_swarm_eligible=true:` *the
  tower-defense table is active, miniatures arranged for wave
  1 deployment, terminus orange swarm at 8% across the table.*
- `STATE — unlock pvp_unlocked=true:` *combat simulator dais
  is illuminated, phosphor-violet emitters at full burn.*
- `STATE — unlock shadow_vault_accessible=true:` *the
  rear-left Shadow Vault hatch has cyan-rimmed unlock; a
  single dark hand-print near the latch (Shadow Tongue cross-
  reference).*

**Lore-discovery:**

- `STATE — discovered agent_zero_is_dead:` *Agent Zero's case
  carries a thin black silk ribbon tied across its lock —
  mourning marker. Mood: you have understood.*
- `STATE — discovered vex_is_engineer_zero:` *Agent Zero's
  case is open; the sidearm is gone; a single brass token
  (twin to Cryo Bay rim-pin) sits in its place.*

#### 2.9.5 Discovery cutscene

**Yes — `armory_first_signal`.** 8 s. Agent Zero's case glass
flickers with voidblack static; her sidearm shifts a fraction
in its mount; the combat simulator dais's phosphor emitters
pulse once in sequence around the rim. End frame: canonical
Armory baseline with case static at 1%.

#### 2.9.6 HUD/UI upgrade notes

- This room is the **most launcher-dense** combat room — keep
  the centre weapons rack visually navigable: fewer rack
  slots, larger brass-rimmed slot frames, so each combat mode
  reads as a discrete object.

#### 2.9.7 Back-fill grid (axes 9–17 + storyteller hooks + HUD overlap)

1. **TV infection (axis 9):** clean = no marker; exposed =
   wisps from weapon-rack underside, mycelium thread on the
   restricted-vault frame; spreading = mycelium fans across
   the trophy-stamp wall, cold-violet shimmer on combat-
   simulator rig; corrupted = voidblack on weapon polish,
   indigo wash on the locked weapon-blueprint cabinet;
   quarantined = yellow band sealing the corridor, sealed-X
   on rack.
2. **Demon-summoning surface:** —
3. **CADES:** — (CADES violet helmet is in Med Bay restricted
   section, not here)
4. **Story items (§3.5):** Iron Lion oath token (rack center,
   post-`jericho_oath_taken`); 25 earned-loadout items (one
   per class × species combo; rack rotation per equipped
   loadout); Akai Shi mercy token (low shelf, post-Jericho-
   arc-E2).
5. **Mystery-arc bindings:** Jericho Jones E1, E2, E4, E5
   (Iron Lion creed shelf; Akai Shi mercy token; Iron Lion
   imprint protocol on weapon polish ritual; pre-Fall Lionism
   code etched into rack base).
6. **Investigation tier (axis 15):** initial = canonical
   Armory; investigating = yellow tape on each weapon slot;
   partial-resolved = cyan tape + brass evidence cart at
   restricted vault; case-closed = tape removed, **closure
   object = a single Iron Lion oath token mounted under
   glass at the rack's centre, signed and sealed**.
7. **Governance modifier reactions:** `weapon_drop_rate_up`
   modifier → all weapon-rack slots glow gold-pulse;
   `armory_restricted` → restricted vault shows red-edge
   indicator.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → Iron
   Lion oath plaque on rack center carries indigo marginalia
   (suppressed truth re: Akai Shi); on `grandEditActive`,
   the locked weapon-blueprint cabinet shows indigo silhouettes
   that overwrite the actual blueprints.
9. **Cycle-phase lighting:** dawn 5800 K warm-amber on
   weapon polish; balanced 5500 K canonical; dimming 5300 K;
   long-night 5200 K cool-violet on rack steel.
10. **Faction livery:** Iron Lions allied = Iron Lion banner
    flies above the rack; Insurgency-allied = small caltrop-
    stamp on rack base; Hierarchy-allied = sealed Hierarchy
    seal on the restricted vault.
11. **Tournament window:** finals = champion-tier weapon
    silhouettes light up in the restricted vault for the
    duration of the finals window.
12. **Storyteller hooks:** Weapon Racks Rotate (visible
    monthly — new weapons appear; tie to seasonal card
    drops); Name Inscription (player can edit deck name on
    plaque; some players name decks after fallen crew);
    Locked Weapon Blueprints (5 silhouettes, one unlock per
    season); Agent Zero's Signal Ghost (occasional
    encrypted message on the comm console — Agent Zero's
    final orders before death). Expansion-reserved zones:
    Restricted Weapons Vault (10 silhouettes, all CLEARANCE
    LV4+); Engineer's Workbench (side table with half-
    assembled gear, currently non-interactive). Living-world:
    every 7 IRL days, the visible weapons get a brief
    "maintenance" animation (lights flicker, tools move).
13. **HUD overlap:** §9 unified Loadout Switcher (currently
    MISSING — Armory is the diegetic anchor for the missing
    component); §9 unified Resource Counter (crafting
    materials); `PaperDollRenderer.tsx` (player paper-doll
    visible in armor-stand mirror beside the rack);
    `MoralityMeter.tsx` (low-fi callout on Akai Shi mercy
    token first examination).

---

### 2.10 Cargo Hold

- **id:** `cargo-hold` / internal `cargo_bay`
- **Deck:** 5
- **Adjacency:** Armory (left ascent), Captain's Quarters (rear
  hatch), Station Dock (right hatch — exterior connection)
- **Gating:** `cargo_bay_pressurized`

#### 2.10.1 Plot-point hotspots

| Hotspot | Verb | Layer | Drives |
|---|---|---|---|
| Inventory crate stack (centre, towering) | examine | foreground | Inventory launcher |
| Collection display cases (left and right walls) | examine | foreground | Collection / Card Browser; Cosmetic Catalog |
| Draft tournament staging (rear) | use | midground | Draft Tournament |
| Curator's interface terminal (forward) | use | midground | Cosmetic Shop; Suit Gallery |
| Store stall (rear-right) | use | midground | Store launcher |
| Bounty board satellite | use | midground | Bounty Board cross-link |
| Cargo manifest slate (forward-left) | examine | midground | item logs |
| Cosmetic preview mannequin (centre-rear) | use | foreground | Suit Gallery preview |

#### 2.10.2 NPCs

None resident. Witness-glyph anchor (0.50, 0.75) at the central
sealed crate.

#### 2.10.3 Layout Sentence

> *The Cargo Hold seen from the Armory descent — a wide cuboid
> chamber with a vaulted hold ceiling, central inventory crate
> stack (oil-blued steel containers stacked five high in a
> brass-rimmed grid), collection display cases running along
> both long walls (smoked-glass-fronted, brass-rimmed,
> ceiling-tall, each case showing a single artefact or item in
> a warm-gold spot-lit pool). Draft tournament staging at the
> rear (a circular brass-floored dais, overhead spotlight, eight
> reading-stand pillars around the rim). Curator's interface
> terminal at the forward bay (oil-blued steel desk with a
> half-rotating holographic globe atop it). Store stall in the
> rear-right corner (brass-and-canvas merchant booth, oxblood
> awning). Cosmetic preview mannequin centre-rear (a brass-and-
> oil-blued mannequin on a slow rotation pad). Floor is dark
> plate-metal with a brass compass-rose under the central
> stack. Ceiling is open exposed-rib with cargo lift cables
> visible. The witness-glyph anchor is the centre-most sealed
> crate at the foot of the stack.*

#### 2.10.4 State Layer deltas

**Act:**

- `STATE — act-tier 2:` *one collection case (left wall, third
  from forward) is illuminated; a single artefact inside is
  warm-gold-spotlit.*
- `STATE — act-tier 4:` *the draft staging is set up for the
  current week's draft format — eight reading-stand pillars
  carry brass-rimmed card-blanks; the dais's overhead spotlight
  is on.*
- `STATE — act-tier 5:` *a single Authority-stamped manifest
  card sits on the curator's terminal — taxes assessed.*
- `STATE — act-tier 7:` *the inventory crate stack has been
  half-cleared; the curator's terminal is dark; one cosmetic
  mannequin carries the player's equipped suit, posed.*

**Faction-rep:**

- `STATE — faction-rep new_babylon_authority=high:` *manifest
  card present (see act 5); Authority red lattice along
  bottom-edge floor trim.*
- `STATE — faction-rep antiquarian_casino_floor=high:` *one
  display case carries a Pazaak deck on display, brass-edged
  card-back upward.*

**Season-phase:**

- `STATE — season-phase running:` *the draft staging shows
  active brass-rimmed pillars (current draft active).*
- `STATE — season-phase interregnum:` *all collection display
  cases are dim; warm-gold spots off; mannequin's rotation
  pad still.*

**System-unlock:**

- `STATE — unlock cosmetic_shop_seen=true:` *the rear-right
  store stall is active, brass scales on display, oxblood
  awning at full extension.*
- `STATE — unlock draft_tournament_unlocked=true:` *the rear
  staging dais is illuminated; eight pillars active.*
- `STATE — unlock collection_50pct=true:` *every collection
  display case has at least one warm-gold-spotlit artefact —
  no empty cases.*

**Universal events:**

- `STATE — event event_lions_apocalypse_protocol:` *every
  collection case flickers a single amber-outlined lion
  silhouette for one frame.*

#### 2.10.5 Discovery cutscene

**Yes — `cargo_first_pressurization`.** 8 s. Bulkhead seal
unscrews; pressure equalisation hiss visible as warm-amber haze
sweeping the floor; collection display cases ignite their
warm-gold spots in sequence (left wall, then right wall, then
rear staging). End frame: canonical Cargo Hold baseline.

#### 2.10.6 Back-fill grid (axes 9–17 + storyteller hooks + HUD overlap)

1. **TV infection (axis 9):** clean = no marker; exposed =
   wisps from cargo-crate seams, mycelium thread on staging
   pallet underside; spreading = mycelium fans across the
   labeled-crate's brass plate, cold-violet shimmer on
   pressurized container; corrupted = voidblack pooling at
   crate base, the pressurized container trembles harder,
   indigo wash on inventory manifest; quarantined = yellow
   band sealing the bulkhead, sealed-X across pressurized
   container.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** the labeled crate ("PROPERTY OF
   [ILLEGIBLE]"); the pressurized container ("VOLATILE — DO
   NOT DISTURB" — TV culture sample); the lost manifest log
   (data pad wedged behind a crate); the Engineer's cache
   (sealed crate with Engineer's seal, requires three-part
   key obtained Acts 1-3).
5. **Mystery-arc bindings:** Wraith Calder E2 (Substrate-N
   residue cargo manifest); the Seer arc surfaces no clue
   here.
6. **Investigation tier (axis 15):** initial = canonical
   Cargo Hold; investigating = yellow tape on pressurized
   container + labeled crate; partial-resolved = cyan tape +
   brass evidence cart at cargo-bay center; case-closed =
   tape removed, **closure object = a single brass plate set
   into the bulkhead etched with the cargo manifest's
   completed inventory count**.
7. **Governance modifier reactions:** `trade_discount_10`
   modifier → all visible crates show a small green tag;
   `cargo_priority_logistics` → staging pallet has an
   accelerated loading animation.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 →
   inventory manifest data pad shows 3 indigo-marginalia
   entries that overwrite real cargo records; on
   `grandEditActive`, the labeled crate's "[ILLEGIBLE]"
   becomes legible for one frame on close inspection (an
   indigo overlay reveals "DR. LYRA VOX — PERSONAL").
9. **Cycle-phase lighting:** dawn 5800 K warm-amber on crate
   stack; balanced 5500 K canonical; dimming 5300 K; long-
   night 5200 K cool-violet on bulkhead steel.
10. **Faction livery:** Insurgency-allied = small caltrop-
    stamp on Engineer's Cache crate; Hierarchy-allied =
    sealed Hierarchy seal on the labeled crate; Antiquarian-
    allied = a small bound chronicle on the central pallet.
11. **Tournament window:** —
12. **Storyteller hooks:** Labeled Crate ("[ILLEGIBLE]" →
    eventually unlocks; contents = TV origin sample OR
    Insurgency arms cache); Inventory Mismatch (manifest vs
    actual count = clue to internal sabotage); Pressurized
    Container (humming, "VOLATILE", contains TV culture);
    Lost Manifest Log (cargo transfers from other Inception
    Arks — names Ark 1001, Ark 500, Ark 9999, Ark 1047
    receiving "[CORRUPTED]" from Panopticon Station).
    Expansion-reserved zones: Sealed Cargo Lock (lowest
    level, three-part key); the Engineer's Cache (sealed
    crate). Living-world: every 12 IRL hours, the visual
    layout of crates shifts slightly (gravity fluctuation);
    crates move ~6 cm.
13. **HUD overlap:** §9 unified Resource Counter (cargo
    inventory readout); `MoralityMeter.tsx` (low-fi callout
    if player opens the pressurized container —
    morality-shift event); §3.5 Story Item Registry surfaces
    here for cargo manifest cross-reference.

---

### 2.11 Captain's Quarters

- **id:** `captains-quarters` / internal `captains_quarters`
- **Deck:** 6
- **Adjacency:** Cargo Hold (forward bulkhead), Antiquarian's
  Library (hidden door — pocket dimension), Guild Sanctum (right
  hatch), Social Hub (left hatch)
- **Gating:** item `captains-master-key`

#### 2.11.1 Plot-point hotspots

| Hotspot | Verb | Layer | Drives |
|---|---|---|---|
| Personal log terminal (desk) | use | foreground | Lore Journal; Conspiracy Boards; Hamlet board |
| Companion gathering hub (centre, low table) | use | foreground | Companion Hub launcher |
| Morality mirror display (rear wall) | look | foreground | Morality Census; Witnessing Hub mirror |
| Legacy wall (left wall, ten brass photo plates) | look | midground | Memorial Plaza launcher; per-plate slot enumeration in §2.11.8 |
| Personal décor (multiple) | examine | midground | Personal Quarters customization |
| Favorites shelf (right wall) | examine | midground | Favorites launcher |
| Rest recovery alcove (rear-left, hammock-bed) | use | midground | Status recovery |
| Antiquarian Library hidden door (right rear, bookshelf with one volume pulled half-out) | examine | foreground | gates Antiquarian Library |
| DMC Clone Companion's bunk (forward-right, when present) | look | foreground | Companion 64-tuple staging |
| Forgiveness choice panel (rear-right, brass triptych) | use | midground | ForgivenessChoicePanel modal |
| Act 1 closing choice panel (rear-centre, brass plaque) | use | midground | Act1ClosingChoicePanel |
| Dreamer Vision pad (centre dais) | use | midground | DreamerVisionPlayer modal |

#### 2.11.2 NPCs

- **DMC Clone Companion** — present from `act_3_starting`; at
  forward-right bunk; appearance is the 64-tuple variant (see §3
  for full matrix). Faction-coloured soft glow at the bunk edge.
- **Companions** gather here at various trust thresholds (Elara,
  The Human, Antiquarian, Vex, Jericho — depending on flags).
  Render any present companion at the centre-low gathering table.

##### Presence Line — DMC Clone Companion (faction-neutral baseline)

> *The DMC Clone Companion sits at the forward-right bunk — a
> figure scaled to player-size, faction-coloured soft glow at
> the edges (default phosphor-cyan), faceless silhouette
> (silhouette only — no facial features rendered until
> faction-axis selection). Posture: <trust-tier> (see deltas).*

#### 2.11.3 Layout Sentence

> *The Captain's Quarters seen from the forward bulkhead off
> Cargo — a private cabin the size of a comfortable study with
> a low-vaulted ceiling, personal log terminal at a brass-and-
> oxblood desk against the rear wall, companion gathering hub
> centred (a low brass-topped table with three oxblood-leather
> chairs around it), morality mirror display on the rear wall
> above the desk (a tall smoked-glass mirror in a brass frame,
> faintly cyan-pulsing). The left wall carries the Legacy wall
> — ten brass-rimmed photo plates set into the bulkhead, each
> ~hand-sized, each with a soft warm-gold backlight. The right
> wall has a favorites shelf (brass-rimmed, holding small
> personal effects). The rear-left corner has a rest-recovery
> alcove (a brass-frame hammock-bed with oxblood blankets). The
> right-rear bookshelf has one volume pulled half-out (the
> Antiquarian Library hidden door). The forward-right has a
> small bunk for the DMC Clone Companion. A central low dais
> holds a Dreamer Vision pad (brass-rimmed, faintly iris-cyan).
> A brass plaque (Act 1 closing choice) on the rear-centre wall
> beside the desk; a brass triptych (Forgiveness choice) on the
> rear-right. Floor is dark wood with a single oxblood rug
> centred under the gathering hub. Lighting is a single desk
> lamp (warm-gold) and the rear morality-mirror's faint cyan.*

#### 2.11.4 State Layer deltas

**Act axis:** progression-of-furniture as listed above.

- `STATE — act-tier 1:` *Legacy wall has 1 plate lit; rest is
  dark backings. Mood: a beginning.*
- `STATE — act-tier 3:` *Legacy wall has 3 plates lit;
  Companion bunk visible; Dreamer pad in centre dais.*
- `STATE — act-tier 4:` *Forgiveness triptych at rear-right is
  unfolded; a single brass-edged card on its centre panel.*
- `STATE — act-tier 5:` *Antiquarian Library hidden bookshelf
  is fully open; warm-gold light spills from the pocket
  dimension beyond.*
- `STATE — act-tier 7:` *Legacy wall has 10 plates lit; the
  morality mirror is at full bloom; the desk is empty of
  paper. Mood: the captaincy has been completed.*

**Trust (DMC Companion):**

- `STATE — trust dmc_companion=wary:` *Companion silhouette at
  bunk's far end, half-turned away.*
- `STATE — trust dmc_companion=witnessed:` *Companion at bunk's
  near end, faceless silhouette beginning to gain a single
  feature — a defined jaw.*
- `STATE — trust dmc_companion=present:` *Companion at the
  gathering table, sitting in the third chair.*
- `STATE — trust dmc_companion=inheriting:` *Companion stands
  at the desk beside the player's log terminal; faceless
  silhouette has resolved by 50% — features visible but not
  fully detailed.*

**Faction-rep (DMC Companion 64-tuple — applies the chosen
faction's accent on Companion's silhouette):**

(See §3.6 for the full 64-tuple matrix. Each delta shifts the
soft-glow accent colour and the bunk's small personal effects.)

**Morality:**

- `STATE — morality light:` *desk lamp at warm-gold full; the
  morality mirror's cyan reads warmer.*
- `STATE — morality dark:` *desk lamp dimmed; mirror's cyan
  shifts to phosphor-lavender.*

**System-unlock:**

- `STATE — unlock companion_hub_active=true:` *all three
  oxblood chairs at the centre table are pulled out, warm
  light at the gathering table.*
- `STATE — unlock forgiveness_choice_made=true:` *the
  triptych's centre panel is sealed; one panel is dim.*
- `STATE — unlock dreamer_vision_<N>=seen:` *the centre dais
  pad has gained an inscription (no legible text) on its
  brass rim.*

**Lore-discovery:**

- `STATE — discovered captain_was_kael:` *the desk's personal
  log terminal carries a single thumb-print burn on its top
  edge — Source-aligned voidblack static at 1%.*

#### 2.11.5 Discovery cutscene

**Yes — `quarters_first_log`.** 8 s. Desk lamp ignites; personal
log terminal screen lights with a single warm-gold pulse;
companion gathering hub's three chairs unfold from stowed
positions; rear morality mirror gains its first cyan pulse. End
frame: act-tier-1 canonical baseline.

#### 2.11.6 HUD/UI upgrade notes

- `ForgivenessChoicePanel` and `Act1ClosingChoicePanel` anchor
  to their diegetic objects in this room. The DreamerVisionPlayer
  triggers when player rests at the rest-recovery alcove on
  vision-eligible nights — the alcove's hammock acquires a
  faint iris-cyan filament for the duration.

#### 2.11.7 Back-fill grid (axes 9–17 + storyteller hooks + HUD overlap)

1. **TV infection (axis 9):** clean = no marker; exposed =
   wisps from cabin air-handler vents, mycelium thread on the
   captain's-chair pedestal seam; spreading = mycelium fans
   across the legacy-wall plates, cold-violet shimmer on the
   private-log console; corrupted = voidblack pooling at the
   alcove's foot, indigo wash on the master-key cradle;
   quarantined = yellow band sealing the bulkhead, sealed-X
   tape across the alcove.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** captain's master key (under chair
   armrest); 10 Legacy Wall plates (one per major narrative
   choice; see §2.11 for slot system); Vex's workshop diary
   (Lyra's shelf, post-Vex-arc-E3); Mr. Whiskers cat photo
   (cat-photo hotspot, pre-existing); the Degen's Corner
   audit-prep note (3-column).
5. **Mystery-arc bindings:** Vex Solène E3, E4, E5 (workshop
   diary, apprentice personal note, calibration session
   confirmation); the Degen E2, E5 (audit-prep note in
   Degen's Corner; empty chair at Ne-Yon visible from the
   alcove window); Wraith Calder cross-reference (Mr.
   Whiskers cat photo dating identifies a week before the
   academy fall).
6. **Investigation tier (axis 15):** initial = canonical
   Captain's Quarters; investigating = yellow tape on each
   examined Legacy Wall plate; partial-resolved = cyan tape +
   brass evidence cart at chair pedestal; case-closed = tape
   removed, **closure object = a single bound chronicle on
   the desk titled "The Captain's Final Witness," Lyra's
   handwriting**.
7. **Governance modifier reactions:** `personal_log_priority`
   modifier → private-log console glows warm-amber; vote-
   open shows §3.6 folded-ballot glyph above the desk;
   vote-closed shows sealed-ballot glyph.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 →
   captain's private logs show indigo overstrike that
   obscures specific captain decisions; on `grandEditActive`,
   the master-key cradle is replaced with a small obsidian
   ring (Lyra's name overstamped on the chair-back).
9. **Cycle-phase lighting:** dawn 5800 K warm-amber on
   alcove; balanced 5500 K canonical; dimming 5300 K; long-
   night 5200 K cool-violet on chair leather.
10. **Faction livery:** Antiquarian-allied = a small bound
    chronicle on the desk; Insurgency-allied = a folded
    paper-bird on the chair's headrest; Hierarchy-enemied =
    one Legacy Wall plate is over-stamped "REJECTED".
11. **Tournament window:** —
12. **Storyteller hooks:** Ghost Commander's Reassignment Log
    (the captain's last duty roster — reassigned ALL crew
    away from command deck, reason blank); Master Key Reveal
    Flow (3-tier: spotted → recovered → first use);
    10-plate Legacy Wall slot system (per major narrative
    choice). Expansion-reserved zones: Captain's Private
    Ready Room (sealed door right of chair, requires master
    key + trust-`elara`-≥80); Memorial Niche (small alcove
    in the back wall, reserved for fallen-crew memorial in
    Act 5+). Living-world: every IRL day at the player's
    "morning" boot, the alcove hammock is unmade if it was
    used the previous session, made if it wasn't —
    persistent diegetic state.
13. **HUD overlap:** §3.11 Living Mirror (Personal Quarters
    counterpart — Captain's Quarters has its own paper-doll
    mirror in the alcove); `MoralityMeter.tsx` (tier-up
    cinematic on master-key first use); §3.6 Governance
    notification anchor; `CinematicDialogOverlay.tsx`
    (Forgiveness scene + Act1 closing).

#### 2.11.8 Legacy Wall — 10 brass plate slot enumeration

The Legacy Wall is mounted on the Captain's Quarters left
wall in two rows of five plates (top row = early-act
choices, bottom row = late-act choices). Each plate is
~25 cm × 30 cm brass on a black-marble back, etched with
the plate's title and a small relief image of the moment
captured. Plates are filled in order; unfilled plates are
visible as polished brass blanks. The Wall is a diegetic
record of the player's most defining choices — author
content drives the etching, but the slot system is fixed.

| # | row | slot title | trigger condition | etched image (relief) |
|---|---|---|---|---|
| 1 | top-1 | **First Wake** | `awakening_complete` | Pod Zero with the player's silhouette emerging |
| 2 | top-2 | **First Mercy** | `cryo_mystery_victim_identified` AND player chose to record victim's name in chronicle | A locket open on a brass surface |
| 3 | top-3 | **First Bond** | trust(any companion) ≥ 40 first-time | Two hands meeting at low table |
| 4 | top-4 | **First Faction** | first faction championed (`faction:championed:<id>`) | The chosen faction's sigil over a banner |
| 5 | top-5 | **Act 1 Closing Choice** | `act_1_complete` AND player's chosen branch flag | A doorway with two paths visible (light/dark per branch) |
| 6 | bot-1 | **Act 3 Path Choice** | `act3_path_light` OR `act3_path_dark` | A scrying pool's surface (warm-amber for light, cool-violet for dark) |
| 7 | bot-2 | **First Resurrection** | first `crewMember.productionPath = "resurrected"` | A pod's interior with a single returned silhouette |
| 8 | bot-3 | **Soul Stone Path** | first violet → gold OR first violet → red conversion | A stone in mid-conversion (half-violet/half-gold OR half-violet/half-red) |
| 9 | bot-4 | **Hellbox Threshold** | first time entering any Hellbox-2-or-3 destination | The Hellbox event horizon at full opacity |
| 10 | bot-5 | **Act 7 Epilogue Slate** | `act_7_complete` AND chosen epilogue index | A single brass plate with the epilogue index etched (engraving sealed by Lyra Vox's wax stamp) |

**Slot fill behaviour:** when a trigger condition first
fires, the corresponding plate's relief image is engraved
in real-time over a 4-s animation (faint chisel SFX, no
music — per §3.1 universal direction). The plate then
holds its etched state permanently. **Plate 10 is the
final closure object for the Captain's Quarters
investigation tier (axis 15 case-closed) — see §2.11.7
row 6.**

**Plate runtime contract:** each slot maps to a single
narrative-flag tuple. The renderer reads
`narrativeFlags[<flag>]` and conditionally draws the
etched relief or the brass blank. No new schema needed;
flags exist today.

---

### 2.12 Trophy Room

- **id:** `trophy-room` / internal `trophy_room`
- **Deck:** 6 pocket
- **Adjacency:** Armory (rear pocket entrance, the only access)
- **Gating:** narrative progression (specific flag TBD —
  achievement count threshold)

#### 2.12.1 Plot-point hotspots

| Hotspot | Verb | Layer | Drives |
|---|---|---|---|
| Achievement pedestals (multiple, ringing the room) | examine | foreground | Achievements Gallery |
| Title plaques (high frieze) | look | midground | Title System |
| Eternal flame pedestal (centre) | look | foreground | witness-glyph anchor; Hall of Legends |
| Battle Pass tracker mural (left wall) | look | midground | Battle Pass cross-reference |
| Card achievements wall (right wall) | examine | midground | Card Achievements; Legendary Modal trigger |
| Marketplace achievements ledger (rear-left) | examine | midground | Marketplace Achievements |
| Memorial Plaza arch (rear-right) | examine | foreground | Memorial Plaza launcher |

#### 2.12.2 NPCs

None. Witness-glyph anchor (0.50, 0.45) at the eternal flame.

#### 2.12.3 Layout Sentence

> *The Trophy Room seen from the Armory pocket entrance — a
> circular chamber the size of a small chapel, ten brass
> achievement pedestals ringing the perimeter, each pedestal
> a brass-rimmed glass dome on an oil-blued steel column, each
> dome holding (or designed to hold) a single artefact in a
> warm-gold spot-lit pool. The eternal flame pedestal centres
> the room — a brass tripod cradle with a small phosphor-violet
> flame burning continuously at its top. The frieze above the
> pedestals carries a continuous brass-rimmed band of title
> plaques. The left wall is a ceiling-tall Battle Pass mural;
> the right wall a card achievements grid; the rear-left holds
> a marketplace achievements ledger (a tall brass-bound
> book stand); the rear-right is the Memorial Plaza arch.
> Ceiling is dome-vaulted with a single oculus open to the void
> (stars visible). Floor is dark plate-metal with a single
> brass compass-rose under the eternal flame.*

#### 2.12.4 State Layer deltas

**Act axis:**

- `STATE — act-tier 2:` *one achievement pedestal (forward-
  right) lit; rest dark.*
- `STATE — act-tier 5:` *six pedestals lit; battle pass mural
  shows current season's thread.*
- `STATE — act-tier 7:` *all ten pedestals lit; eternal flame
  at full bloom; Memorial Plaza arch open. Mood: the captain's
  legend is closed.*

**Faction-rep:** (no load-bearing — this room is faction-neutral
by design; achievements are personal.)

**System-unlock:**

- `STATE — unlock battle_pass_tier_50=true:` *Battle Pass mural
  carries a single platinum-rim achievement marker visible at
  its top.*
- `STATE — unlock prestige_cycle_complete=true:` *eternal flame
  has gained an inner cyan ring at its base — prestige carry-
  over marker.*

**Universal events:**

- `STATE — event event_lions_apocalypse_protocol:` *every
  pedestal flickers a single amber-outlined lion silhouette
  across its dome glass for one frame.*

#### 2.12.5 Discovery cutscene

**Yes — `trophy_first_pedestal_lit`.** 8 s. Player walks past
forward-right pedestal; the dome ignites with a warm-gold pulse;
the eternal flame steps from a low burn to its full continuous
height; the title-plaque frieze gains its first inscribed plate
(no legible text). End frame: act-tier-2 canonical state.

#### 2.12.6 Back-fill grid (axes 9–17 + storyteller hooks + HUD overlap)

(Trophy Room is upgraded to a multi-zone room per §4.2 Trophy
Room Scaling Spec — to be authored. The 13-row back-fill below
applies to the multi-zone room model, not the legacy 10-pedestal
model.)

1. **TV infection (axis 9):** clean = no marker; exposed =
   wisps from dome-vents, mycelium thread on Imprint-Gallery
   frame; spreading = mycelium fans across the Title Wall
   etchings, cold-violet shimmer on the Essence Ledger
   lectern; corrupted = voidblack pooling at the Prestige-
   Tier dais foot, indigo wash on the Boss Cosmetics rack;
   quarantined = yellow band sealing the entry, sealed-X
   across the eternal flame.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** every cosmetic, title, achievement
   badge, imprint frame (90), Loredex essence (150+), boss-
   cosmetic loadout the player has earned. Per-zone
   placement (Title Wall, Prestige Tier, Legacy Tier,
   Achievement Badges Rack, Imprint Gallery, Essence Ledger,
   Boss Cosmetics Rack — see §4.2).
5. **Mystery-arc bindings:** the **Inscription Challenge**
   blank plaque is the post-Act-7 reveal slot; reveals the
   player's chosen alignment phrase; otherwise no per-arc
   binding.
6. **Investigation tier (axis 15):** initial = canonical
   Trophy Room; investigating = yellow tape on each unfilled
   pedestal; partial-resolved = cyan tape + brass evidence
   cart; case-closed = tape removed, **closure object = the
   Inscription Challenge plaque etched with player's
   chosen end-game alignment phrase**.
7. **Governance modifier reactions:** `prestige_unlock_active`
   modifier → Prestige Tier dais ignites; `community_milestone`
   → an additional plaque is etched on the Title Wall
   honouring the milestone (one-time animation).
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → one
   Imprint Gallery frame is overstamped indigo (the imprint
   becomes unreadable for that visit); on `grandEditActive`,
   the Essence Ledger's open page rewrites itself with
   indigo marginalia.
9. **Cycle-phase lighting:** dawn 5800 K warm-amber on dome;
   balanced 5500 K canonical; dimming 5300 K; long-night
   5200 K cool-violet on flame.
10. **Faction livery:** any championed faction adds a faction
    banner to the Legacy Tier; enemied factions remove the
    relevant boss-mastery plaque (replace with empty hook).
11. **Tournament window:** finals = champion-tier display
    appears on the Boss Cosmetics Rack; champion-anointed
    state lights all 7 zones simultaneously for 24h.
12. **Storyteller hooks:** Ghost Trophy (achievement =
    unknown — secret-ending unlock); Unreachable Trophy
    (Act 4 prestige); Fallen Heroes Wall (player crew
    obituaries); Inscription Challenge (player's legacy
    plaque). Expansion-reserved zones: Prestige Pedestal
    (canvas-draped, Act 3+ unlock); Founder's Vault (sealed,
    pre-launch lore drop). Living-world: every visited
    achievement's plaque slowly glows brighter over IRL
    months (logarithmic from earn-date); old achievements
    become radiant; new ones start dim.
13. **HUD overlap:** §9 unified Trophy Gallery (currently
    basic grid in `TrophyRoom.tsx` — needs 3D model display,
    rarity visualization, sorting); §9 Achievement Gallery
    diegetic anchor; `PaperDollRenderer.tsx` (player
    paper-doll appears at room center on entry, wearing
    every earned cosmetic).

---

### 2.13 Antiquarian's Library (Pocket dimension)

- **id:** `antiquarian-library`
- **Deck:** 7 pocket dimension
- **Adjacency:** Captain's Quarters (hidden bookshelf entrance);
  Archives (long-reading-table bookshelf is the alternate access
  at trust-tier 3+)
- **Gating:** `items_collected ≥ 5` AND `act_2_complete`

#### 2.13.1 Plot-point hotspots

| Hotspot | Verb | Layer | Drives |
|---|---|---|---|
| Card catalogue (centre, brass-and-oxblood) | use | foreground | Tomes; CoNexus games hub |
| Antiquarian's bust (left alcove) | look, polish | foreground | identity-chain Antiquarian → Daniel Cross |
| Locked vault (rear, brass-rimmed door) | examine, open | foreground | gates story-state content |
| Long reading table (centre) | sit, examine | foreground | Tome-read mode |
| Hierophant's marginalia stack (right shelf) | examine | midground | Wraith Calder cross-reference |
| Coda's purpose shelf (left shelf, second tier) | examine | midground | Vex / Coda lore |
| Velkraal's correspondence folio (high shelf) | examine | midground | Hierarchy lore |
| Insurgency witness roster (rear-left lectern) | examine | midground | Insurgency cross-reference |
| Recipe Archive (forward-right) | use | midground | Recipe Archive |
| The Antiquarian's reading chair (centre) | look | foreground | Antiquarian presence anchor |

#### 2.13.2 NPCs

- **The Antiquarian (Daniel Cross)** — always; at the long
  reading table, reading. (Same Presence Line as Archives §2.4.2 —
  identical text; this is canonical.)

#### 2.13.3 Layout Sentence

> *The Antiquarian's Library seen from the hidden bookshelf
> entrance — a pocket-dimension chamber the size of a private
> library, walls lined floor-to-ceiling with bound books and
> brass-rimmed scroll-tubes, a long reading table running the
> centre length (mahogany, brass-edged, eight oxblood-leather
> chairs around it, the Antiquarian's chair at the head of the
> table closest to the rear vault). Card catalogue cabinet on
> the centre-right wall (brass-and-oxblood, twenty drawers
> deep). Antiquarian's bust on a left alcove (brass-cast, life-
> sized, on a low oil-blued steel pedestal). Locked vault at
> the rear (a brass-rimmed door inset into the back wall, no
> handle, only a single sigil at its centre). Hierophant's
> marginalia stack on the right shelf (a leaning tower of
> annotated tomes, green-cloth bookmarks). Coda's purpose
> shelf, second tier on the left (one full shelf of black-bound
> ledgers). Velkraal's correspondence folio on the high shelf
> (oversized cream folio, brass-clipped). Insurgency witness
> roster on a rear-left lectern (a single open ledger). Recipe
> archive on the forward-right (brass-rimmed file cabinet).
> Ceiling is open-rib with copper-conduit cables wrapped in
> warm-gold tape; floor is dark wood with a single brass
> compass-rose under the reading table. Lighting is a single
> tall reading-table candle (warm-gold) with secondary brass
> desk lamps at three corners. The witness-glyph anchor is the
> candle.*

#### 2.13.4 State Layer deltas

**Trust (Antiquarian):** (see §2.4 / §3.4 — same ladder)

**Reveal-stage (Antiquarian):**

- `STATE — antiquarian-reveal daniel_cross_disclosed:` *the
  bust on the left alcove has lost its brass cast finish and
  shows underlying smoked-glass beneath — a portrait visible
  through the cast (no specific likeness rendered). The
  reading-table candle flame is doubled — twin flames, cream
  and cyan side by side. Mood: the man behind the curator.*

**Lore-discovery:**

- `STATE — discovered tome_<id>:` *one specific shelf-position
  carries a tome pulled half-out, brass-edged finger-rule
  marking its place.*
- `STATE — discovered recipe_archive_forgotten:` *the
  forward-right recipe archive has its centre drawer open;
  a single brass-rimmed card visible inside.*
- `STATE — discovered hierophant_arc_complete:` *the
  marginalia stack has its top tome opened, green-cloth
  bookmark visible across its open page.*

**System-unlock:**

- `STATE — unlock locked_vault=true:` *the rear vault door is
  ajar by 5°; warm-gold light visible inside; a single brass
  artefact silhouette inside the gap (specific item from
  unlocked content).*
- `STATE — unlock conexus_hub_active=true:` *the card
  catalogue cabinet has three drawers open; a single
  brass-rimmed game card on the table beside the candle.*

**Universal events:**

- `STATE — event event_oracle_dream_pull:` *the candle's
  flame turns to oracle starwhisper for the duration.*
- `STATE — event event_two_witnesses_meet:` *the bust's
  smoked-glass interior gains a faint cream-and-cyan double
  silhouette for one frame.*

#### 2.13.5 Discovery cutscene

**Yes — `library_first_entry`.** 12 s. Bookshelf in Captain's
Quarters slides open; player descends into pocket; library
candle ignites; the Antiquarian looks up from his book for the
first time and offers a single nod (no dialogue in the cutscene
— dialog is gameplay-state). End frame: canonical Library
baseline at trust=Catalogued.

#### 2.13.6 Back-fill grid (axes 9–17 + storyteller hooks + HUD overlap)

(The Antiquarian's Library is a **pocket dimension**, not a
canonical Ark room — physics & propagation differ. TV cannot
reach the pocket; mycelium does not propagate here. Cycle-phase
lighting still applies via Antiquarian's candle.)

1. **TV infection (axis 9):** N/A — pocket dimension immune
   to TV propagation. The Library is a Refuge state for the
   player when the rest of the Ark is contaminated.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** 7 CoNexus tomes (shelves, post
   per-tome unlock); Hierophant's marginalia stack (locked
   vault drawer); Coda's purpose shelf (rear-left bookcase);
   Velkraal's correspondence folio (locked vault); insurgency-
   witness-roster (long-reading-table); the Antiquarian's
   chronicle (long-reading-table center).
5. **Mystery-arc bindings:** Wraith Calder E1 (catalog cards
   at card-catalog); the Seer arc E1, E2, E3, E4, E5 (DO-
   NOT-PLAY band in locked vault; Hierophant marginalia
   stack); Vex Solène E2, E3, E4 (insurgency-witness-roster;
   apprentice-training-files metadata); the Degen E3, E4,
   E5 (Coda's purpose shelf); Game Master E2, E4 (Velkraal
   folio); Jericho Jones E1, E3, E4, E5 (Antiquarian-bust
   surfaces all 4 episodes when addressed).
6. **Investigation tier (axis 15):** initial = canonical
   Library; investigating = yellow tape on each examined
   shelf-tome; partial-resolved = cyan tape + brass evidence
   cart at the chronicle table; case-closed = tape removed,
   **closure object = a single bound brass codex on the
   reading table titled "The Antiquarian's Final Witness"**.
7. **Governance modifier reactions:** `tome_entry_inscribed`
   modifier → an animated quill briefly writes a new line on
   the chronicle (single 4-s loop); `lore_unlock_active` →
   all shelf-tomes' brass-edges glow warm-amber.
8. **Epoch / ShadowTongue:** ShadowTongue power affects the
   pocket inversely — higher power means MORE legible
   marginalia (the Antiquarian preserves what the Tongue
   tries to overwrite). On `grandEditActive`, all marginalia
   resolves to plain text for one in-pocket visit
   (revelation moment).
9. **Cycle-phase lighting:** dawn 5800 K warm-amber on
   reading table candle; balanced 5500 K canonical; dimming
   5300 K; long-night 5200 K cool-violet on shelf glass.
10. **Faction livery:** see §2.4 Archives — same livery
    pattern (Antiquarian-allied, Insurgency-allied,
    Hierarchy-allied/enemied).
11. **Tournament window:** —
12. **Storyteller hooks:** Forbidden Section sealed wing
    (decrypt access at trust-`antiquarian`-≥80); Margin
    Notes Evolution (annotations multiply over weekly ticks
    — paradoxically clearer the more ShadowTongue power);
    Blank Pages ("The Warlord's Ascension" redacted until
    trust-100); Librarian's Personal Collection (small
    shelf, not in database). Expansion-reserved zones: The
    Sealed Vault (biometric lock); The Lost Wing (collapsed
    corridor). Living-world: the Antiquarian visibly works
    the room — moves between shelves, annotates entries,
    updates the Codex. At high trust the Antiquarian
    invites the player to sit and read together.
13. **HUD overlap:** §9 unified Loredex Viewer (the Library
    is the pocket-dimension diegetic anchor — Archives is
    the Ark-side anchor); `CinematicDialogOverlay.tsx`
    (Antiquarian dialogue); `MobileNarratorSlot.tsx`
    (Antiquarian voice surfaces from trust-40+).

---

### 2.14 Guild Sanctum

- **id:** `guild-sanctum`
- **Deck:** 7
- **Adjacency:** Bridge (left passage), Captain's Quarters (forward),
  Social Hub (right hatch), Station Dock (rear-right hatch)
- **Gating:** `room_visited` (from Bridge) AND `guild_formed`

#### 2.14.1 Plot-point hotspots

| Hotspot | Verb | Layer | Drives |
|---|---|---|---|
| Allegiance pad (centre, raised) | use | foreground | Guild allegiance change |
| Member roster wall (left) | examine | foreground | Guild Page |
| War declaration map (right) | use | foreground | Faction Wars; Guild Wars |
| Decoration grid (multiple, centre rear) | examine, place | midground | Guild Hall expansion launcher |
| Treasury vault (rear-left) | examine | midground | Guild treasury |
| Memorials slab (rear-right) | examine | midground | Guild memorials |
| Tech display kiosk (forward-left) | use | midground | Guild perks |
| Trophy display (forward-right) | look | midground | Guild trophies |
| Contract desk (rear-centre) | use | foreground | Guild Contracts |
| Cutscene portal (rear arch) | look | midground | Guild Cutscene Player anchor |

#### 2.14.2 NPCs

- **Guild Master** (variable identity per guild) — at the
  contract desk; render as a hooded brass-trim figure, no facial
  detail.

#### 2.14.3 Layout Sentence

> *The Guild Sanctum seen from the Bridge passage — a wide
> formal chamber with a single raised allegiance pad at frame
> centre (a brass-rimmed octagonal step on dark slate). The
> left wall is the member roster wall (brass-rimmed slate,
> ceiling-tall, name positions illuminated warm-gold by member
> count). The right wall is a war declaration map (a smoked-
> glass sector grid, phosphor-violet active-conflict markers).
> The rear is divided into three: rear-left treasury vault
> (brass-rimmed door, sigil-locked), rear-centre contract desk
> (oxblood-leather-topped, brass-frame, with a hooded guild
> master figure standing beside it), rear-right memorials slab
> (oil-blued steel block with brass-rimmed name plates). The
> forward-left is a tech-display kiosk (brass-and-glass
> rotating column with miniature guild-perk artefacts inside);
> the forward-right is a trophy display (brass plinth row).
> The decoration grid sits behind the allegiance pad as a
> sparse diorama (brass tile floor with placed and unplaced
> furniture pieces visible). Ceiling is high-vault, brass
> chandelier overhead. Floor is dark plate with a brass
> guild-sigil inset under the allegiance pad. The witness-
> glyph anchor is the allegiance pad's centre.*

#### 2.14.4 State Layer deltas

**System-unlock:**

- `STATE — unlock guild_tier_2:` *member roster wall has 50%
  warm-gold name-positions lit; chandelier brightens; one
  trophy plinth carries a small brass token.*
- `STATE — unlock guild_tier_5:` *all positions lit; treasury
  vault door has its sigil-lock cyan-rimmed (open); decoration
  grid is fully populated.*

**Faction-rep:**

- `STATE — faction-rep <player_guild_aligned_house>=high:` *the
  allegiance pad's brass guild-sigil is overlaid with a
  faction-aligned accent (Authority red lattice / Insurgency
  hot-orange / Antiquarian green pressed-leaf / Hierarchy
  black diamond).*

**Universal events:**

- `STATE — event event_faction_succession_announced:` *war
  declaration map has the affected sector flashing; the
  appropriate faction's banner unfurls 50% from the chandelier.*

**Season-phase:**

- `STATE — season-phase closing:` *contract desk carries a
  single brass-edged signing-card (last-call signing).*
- `STATE — season-phase interregnum:` *all warm-gold
  illumination at 30%; chandelier dim.*

#### 2.14.5 Discovery cutscene

**Yes — `guild_first_allegiance`.** 12 s. Player steps onto
allegiance pad; the brass guild-sigil under the pad ignites
warm-gold; the member roster wall lights its first three name-
positions in sequence; the war declaration map shows one new
sector marker. End frame: post-allegiance baseline.

#### 2.14.6 HUD/UI upgrade notes

- `GuildCutscenePlayer.tsx` triggers from the rear arch portal —
  treat it as a separate room transition.

#### 2.14.7 Back-fill grid (axes 9–17 + storyteller hooks + HUD overlap)

1. **TV infection (axis 9):** clean = no marker; exposed =
   wisps from rear-arch vents, mycelium thread on roster wall;
   spreading = mycelium fans across the war-declaration map,
   cold-violet shimmer on allegiance pad; corrupted =
   voidblack pooling at allegiance pad foot, indigo wash on
   guild banner; quarantined = yellow band sealing the rear
   arch, sealed-X across the allegiance pad.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** 30+ Guild Hall décor across 12
   rooms × 5 tiers (banners, trophies, furniture, lighting,
   tech, memorial, luxury — see NOTES §11.1); guild treasury
   contents (vault, tier-3+); founder's plaque (memorial
   wall, post-`guild_founded`).
5. **Mystery-arc bindings:** none specific (Guild Sanctum is
   meta-progression, not narrative-arc).
6. **Investigation tier (axis 15):** initial = canonical
   Guild Sanctum; investigating = yellow tape on roster
   wall + war map; partial-resolved = cyan tape + brass
   evidence cart; case-closed = tape removed, **closure
   object = a single bound Guild War Chronicle on the
   war-declaration map**.
7. **Governance modifier reactions:** `guild_treasury_buff`
   modifier → vault glows gold; `faction_succession_active`
   → roster wall flips one name to a successor's silhouette
   (one-time animation); `community_milestone` →
   commemorative plaque appears on memorial wall.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → guild
   member roster shows 3 indigo-overstamp entries (members
   "edited" out of history); on `grandEditActive`, the war-
   declaration map's victory markers all show indigo "REDACTED".
9. **Cycle-phase lighting:** dawn 5800 K warm-amber on
   allegiance pad; balanced 5500 K canonical; dimming
   5300 K; long-night 5200 K cool-violet on banner.
10. **Faction livery:** **always load-bearing** — Guild
    Sanctum's banner color matches the player's guild's
    allied faction. Per faction: amber (Insurgency), cerulean
    (New Babylon), red (Hierarchy), grey (Architect Remnants),
    violet (Dreamers Children).
11. **Tournament window:** finals = guild war bracket appears
    on the war map; champion-anointed = guild banner gilded.
12. **Storyteller hooks:** Founder's Plaque (player's name
    etched on guild founding); War Memorial (fallen-guild-
    member plaques accumulate over time); Allegiance Pad
    History (visible record of every prior guild allegiance);
    Diplomatic Archive (treaty folio in vault). Expansion-
    reserved zones: Diplomatic Chamber (rear-arch portal,
    Tier 4 unlock); Guild Vault upper level (sealed,
    treasury overflow). Living-world: every IRL hour, the
    member roster updates — online members glow warm,
    offline members are dim brass.
13. **HUD overlap:** §9 unified Friends List, Chat, Party
    Invite (all currently MISSING — Guild Sanctum is the
    diegetic anchor for these missing components);
    `LeaderboardPage.tsx` (guild-war leaderboard surfaces
    here); §3.6 Tournament notification anchor.

---

### 2.15 Social Hub

- **id:** `social-hub`
- **Deck:** 7
- **Adjacency:** Bridge (left), Guild Sanctum (left hatch),
  Captain's Quarters (rear hatch)
- **Gating:** `room_visited` (from Bridge)

#### 2.15.1 Plot-point hotspots

| Hotspot | Verb | Layer | Drives |
|---|---|---|---|
| Mess table (centre, long) | sit, examine | foreground | Social Page; Roleplay |
| Friend list bulletin (left wall) | examine | foreground | Friends; Dossiers |
| Crew morale board (right wall) | examine | midground | Social events |
| Casual gaming nook (rear-left) | use | midground | Friendly Challenges |
| Roleplay character declaration plinth (rear-right) | use | midground | Roleplay declarations |
| Daily Brief screen (forward) | look | midground | Daily Brief popup mirror |
| Mess service counter (forward-right) | use | midground | flavor only |
| Music broadcast speaker (high alcove) | listen | background | radio mode anchor |

#### 2.15.2 NPCs

Various crew gather here. Render the room with one or more
hooded crew silhouettes at the mess table (canonical positions:
forward-left chair, centre-right chair, rear-far chair). At
trust-tier specific to a companion, render that companion at a
specific named chair (Elara: forward-left; The Human: rear-far;
Antiquarian: centre-right; Vex: rear-near; Jericho: forward-
right).

#### 2.15.3 Layout Sentence

> *The Social Hub seen from the Bridge passage — a warm common
> room the size of a small public-house, mess table running the
> centre length (long brass-edged oxblood-topped, six chairs
> per side, brass settings at intervals — bowls, cups,
> implements), friend list bulletin on the left wall (cork-
> and-brass with pinned cards), crew morale board on the right
> wall (smoked glass with a single warm-gold mood-meter and a
> pinned roster), casual gaming nook in the rear-left corner
> (a small game table with one oxblood-leather chair beside
> it), roleplay character declaration plinth in the rear-right
> (a brass-rimmed lectern). Daily Brief screen on the forward
> wall (a smoked-glass terminal). Mess service counter forward-
> right (brass-rimmed, oxblood awning). High alcove rear-centre
> holds a music broadcast speaker (oil-blued steel cone). Floor
> is dark wood with three small oxblood rugs. Ceiling is low-
> vaulted with a brass chandelier over the mess table. The
> witness-glyph anchor is the mess table's centre brass setting
> (the captain's plate).*

#### 2.15.4 State Layer deltas

**Trust (per companion):**

- `STATE — trust elara=lucid:` *forward-left chair pulled out;
  a small cyan-tessellated saucer at that setting.*
- `STATE — trust the_human=warm:` *rear-far chair pulled out;
  a faint crimson iris glow at that setting.*
- (etc., per companion presence rule)

**Faction-rep:**

- `STATE — faction-rep <house>=high:` *one of the friend list
  bulletin cards carries that house's accent.*

**Season-phase:**

- `STATE — season-phase closing:` *daily brief screen on
  forward wall shows closing-glyph for one frame; mess
  service counter has a single brass-edged closing-card.*

**Universal events:**

- `STATE — event event_two_witnesses_meet:` *forward-left and
  rear-far chairs both pulled out simultaneously; cyan and
  crimson saucers at both settings.*

#### 2.15.5 Discovery cutscene

**Yes — `social_first_meal`.** 8 s. Mess table chairs unfold
themselves; brass settings appear in sequence; the chandelier
ignites; one crew silhouette enters from rear and takes a chair.
End frame: canonical baseline with one crew at a chair.

#### 2.15.6 Back-fill grid (axes 9–17 + storyteller hooks + HUD overlap)

1. **TV infection (axis 9):** clean = no marker; exposed =
   wisps from chandelier vents, mycelium thread on the long
   mess-table seam; spreading = mycelium fans across the wall
   chalkboard, cold-violet shimmer on the food dispenser;
   corrupted = voidblack pooling at the chair feet, chandelier
   dims to amber-only; quarantined = yellow band sealing the
   entry, sealed-X across the table.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** crew-mood chalkboard (rear wall;
   per-day procedural entries); jukebox media library link
   (Rec Room counterpart); fallen-crew memorial plaques
   (left wall, accumulating over save).
5. **Mystery-arc bindings:** Akai Shi mercy token reference
   surfaces here on `jericho_mercy_recalled` (a single empty
   chair at the table's far end is set with a brass plate
   etched with Akai Shi's name).
6. **Investigation tier (axis 15):** initial = canonical
   Social Hub; investigating = yellow tape on chalkboard +
   memorial wall; partial-resolved = cyan tape + brass
   evidence cart at the table-head; case-closed = tape
   removed, **closure object = a single brass plate set
   into the table head etched with the player's
   "First Meal Together" date**.
7. **Governance modifier reactions:** `community_milestone`
   → chalkboard's central entry shifts to the milestone
   text for 24h; `crew_morale_buff` → chandelier glows
   warm-amber, dispenser produces an extra serving.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → chalk-
   board entries shift to indigo handwriting; on
   `grandEditActive`, the memorial wall's plaques all show
   indigo overstamp ("FORGOTTEN" replaces names).
9. **Cycle-phase lighting:** dawn 5800 K warm-amber on
   chandelier; balanced 5500 K canonical; dimming 5300 K;
   long-night 5200 K cool-violet on table polish.
10. **Faction livery:** Insurgency-allied = small caltrop-
    stamp on the table's far end; Hierarchy-allied =
    sealed Hierarchy seal on the dispenser; Antiquarian-
    allied = a small bound chronicle on the chair-arm at
    the table's head.
11. **Tournament window:** —
12. **Storyteller hooks:** Memorial Wall (crew members leave
    mementos for fallen comrades; player can add plaques
    for dead apprentices); Unfinished Game (chess set
    mid-game on a low table — neither player present —
    advances 1 move per IRL day; the players are revealed
    to be Antiquarian and Programmer playing across
    centuries via the Ark's logs); Storytelling Chalkboard
    (crew daily affirmations / jokes / cryptic warnings —
    1 entry per day; one says "Don't trust the signal");
    Rotating Crew Conversations (procedural per archetype).
    Expansion-reserved zones: Crew Quarters Corridor (locked
    door); Meditation Chamber (roped off alcove with
    cushions). Living-world: crew members visible in the
    lounge change every 6 IRL hours; if player befriends a
    specific crew member, they appear more frequently.
13. **HUD overlap:** §9 unified Chat (currently MISSING —
    Social Hub is the diegetic anchor); §9 Party Invite
    (currently MISSING — Mess table is the diegetic
    surface); `MoralityMeter.tsx` (low-fi callout when
    Akai Shi mercy token first surfaces here);
    `MobileNarratorSlot.tsx` (companion ambient lines).

---

### 2.16 Station Dock

- **id:** `station-dock`
- **Deck:** 6/7 boundary (exterior connection)
- **Adjacency:** Engineering (left ascent), War Room (D8 hidden
  hatch), Trade Hub (forward — exterior shuttle bay)
- **Gating:** `room_visited` (from Engineering)

#### 2.16.1 Plot-point hotspots

| Hotspot | Verb | Layer | Drives |
|---|---|---|---|
| Coda's Trading-Floor Desk (forward-right) | use | foreground | Trade Empire entry; Coda contracts |
| Faction banner array (rear, four flags) | examine | midground | Diplomacy cross-link; Faction Wars |
| Commerce interface terminal (centre) | use | foreground | Trade Court; Bounty Board |
| Shuttle bay door (forward) | examine | foreground | Trade Hub access |
| War Room hatch (left wall) | examine | background | `soldier_chain` gate |
| Marketplace achievements ledger | examine | midground | Marketplace Achievements |
| Customs assessor's pulpit (right wall) | examine | midground | Authority audit indicator |

#### 2.16.2 NPCs

- **Coda admin** — at the trading-floor desk; render as a
  hooded clerk with a brass-trim mask, no facial detail.

#### 2.16.3 Layout Sentence

> *The Station Dock seen from the Engineering ascent — an open
> bay the size of a hangar, forward shuttle bay door dominating
> the front (sealed brass-and-glass, faintly humming with
> phosphor-violet edge), faction banner array on the rear wall
> (four banners hanging from a brass cross-beam: Authority,
> Insurgency, Antiquarian, Hierarchy — order from left to
> right), commerce interface terminal centred (a tall brass-
> and-oxblood pulpit with a smoked-glass display), Coda's
> trading-floor desk forward-right (oil-blued steel, brass
> trim, a hooded figure standing behind it), customs assessor's
> pulpit on the right wall (a smaller brass-and-glass kiosk).
> The left wall holds the War Room sealed hatch (sigil-locked).
> Marketplace achievements ledger sits in a low brass-rimmed
> stand near the centre. Ceiling is high industrial vault with
> exposed copper conduit and welded crossbeams; floor is dark
> plate-metal with a brass cross-rose under the centre pulpit.
> Lighting is a single warm-gold spot from above the shuttle
> bay, secondary brass desk lamps at the trading-floor desk
> and customs pulpit. The witness-glyph anchor is the trading-
> floor desk's lamp.*

#### 2.16.4 State Layer deltas

**Faction-rep:**

- `STATE — faction-rep new_babylon_authority=high:` *Authority
  banner brightened, the others dimmed; customs assessor's
  pulpit illuminated; Authority red lattice ring around the
  shuttle bay door's seam.*
- `STATE — faction-rep insurgency=high:` *Insurgency banner
  brightened, Authority banner half-furled; one of the four
  banners has been cut at its lower edge (insurgent gesture);
  terminus orange swarm at 5% across the floor near the
  shuttle bay.*
- `STATE — faction-rep antiquarian_shelf_mates=high:`
  *Antiquarian banner brightened; a pressed-leaf bookmark
  pinned to its lower edge.*
- `STATE — faction-rep hierarchy_severance=high:` *Hierarchy
  banner brightened; a thin blood-weave red lattice runs
  along the cross-beam.*

**Season-phase:**

- `STATE — season-phase prologue:` *all four banners at 50%
  furled; commerce interface terminal shows a declaration
  glyph.*
- `STATE — season-phase closing:` *all four banners at full
  extension; commerce interface shows last-call glyph.*
- `STATE — season-phase interregnum:` *all banners furled to
  the cross-beam; commerce interface dark.*

**System-unlock:**

- `STATE — unlock trade_empire_unlocked=true:` *shuttle bay
  door is open by 30°; warm-gold light spills from the Trade
  Hub beyond.*
- `STATE — unlock war_room_accessible=true:` *left-wall hatch
  has a cyan crack-line at its sigil-lock seam.*

**Universal events:**

- `STATE — event event_faction_succession_announced:` *the
  affected banner is the only one fully unfurled; others
  half-furled in deference; commerce interface flashes a
  succession glyph.*

#### 2.16.5 Discovery cutscene

**Yes — `dock_first_seal`.** 8 s. Shuttle bay door shifts;
banners unfurl in sequence (Authority → Insurgency → Antiquarian
→ Hierarchy); Coda admin steps from the trading-floor desk to
the centre pulpit and back. End frame: canonical baseline.

#### 2.16.6 Back-fill grid (axes 9–17 + storyteller hooks + HUD overlap)

1. **TV infection (axis 9):** clean = no marker; exposed =
   wisps from shuttle-bay door seams, mycelium thread on
   trading-floor desk underside; spreading = mycelium fans
   across the four-faction banner pylons, cold-violet shimmer
   on commerce interface; corrupted = voidblack pooling at
   centre pulpit base, indigo wash on succession glyph;
   quarantined = yellow band sealing the shuttle-bay door,
   sealed-X tape across the trading-floor desk.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** Trade Empire diegetic surfaces
   (per §3.3 — Trade Command Center, Cover Identity Board,
   Cargo Manifest Console, Broker's Office surfaces all live
   adjacent to or in this room); 4-faction banners
   (Authority, Insurgency, Antiquarian, Hierarchy); shuttle-
   bay schedule plaque (rear wall).
5. **Mystery-arc bindings:** Wraith Calder E2 (cargo manifest
   for Substrate-N residue); the Degen E1 (Mol'Vereth's
   visiting card may surface in the Broker's Office adjacent
   to here).
6. **Investigation tier (axis 15):** initial = canonical
   Station Dock; investigating = yellow tape on each banner
   pylon + commerce interface; partial-resolved = cyan tape
   + brass evidence cart at centre pulpit; case-closed =
   tape removed, **closure object = a single brass plate
   set into the centre pulpit etched with the player's
   chosen post-faction-succession alignment**.
7. **Governance modifier reactions:**
   `event_faction_succession_announced` → affected banner
   fully unfurled, others half-furled, commerce interface
   flashes succession glyph (per §2.16.4); `trade_discount
   _10` → all visible commerce interfaces show a green tag.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → faction
   succession glyph carries indigo overstamp; on
   `grandEditActive`, the trading-floor desk's ledger entries
   show indigo edits over recorded transactions.
9. **Cycle-phase lighting:** dawn 5800 K warm-amber on
   shuttle-bay door; balanced 5500 K canonical; dimming
   5300 K; long-night 5200 K cool-violet on banner steel.
10. **Faction livery:** **always load-bearing** — Station
    Dock is the diegetic home of the 4-faction banner
    display (Authority, Insurgency, Antiquarian, Hierarchy);
    each banner's furl-state reflects the player's standing
    band per faction.
11. **Tournament window:** finals = champion-tier banner
    flies at the centre pulpit; champion-anointed = full
    4-banner gilded display.
12. **Storyteller hooks:** Banner Furl Sequence (visible
    record of every faction's standing transition); Coda
    Admin Routine (admin walks pulpit ↔ desk on a 6h cycle);
    Shuttle Schedule Plaque (lists ports of call — most are
    blank, one shows "Sanctuary" with all-zero coordinates
    matching Bridge Navigation to Nowhere); Trading Floor
    Ledger (visible record of player's recent transactions).
    Expansion-reserved zones: Trade Hub stub (parallel-
    agent territory — see §3.3); Diplomatic Pavilion
    (sealed door behind centre pulpit). Living-world: every
    24 IRL hours one shuttle-bay door cycle plays (visible
    docking + departure) — usually no shuttle visible, but
    every 7 IRL days a shuttle silhouette is briefly
    visible through the bay window.
13. **HUD overlap:** §3.3 Trade Empire diegetic surfaces;
    §3.6 Faction Succession notification anchor; §9
    unified Resource Counter (faction standing); `Cinematic
    DialogOverlay.tsx` (Coda admin dialogue);
    `LeaderboardPage.tsx` (faction-war leaderboard
    surfaces here).

---

### 2.17 Engineering Core (D8 hidden — soldier sanctum)

- **id:** `engineering-core` / internal `engineering_core`
- **Deck:** 8 (hidden)
- **Adjacency:** Engineering Bay (rear-elevator descent)
- **Gating:** soldier-class only AND `act_3_complete`
- **Status:** new (no canon today — this entry is the canon)

**Layout sentence:**
*A reactor-adjacent hexagonal chamber three decks below
Engineering Bay; matte-grey alloy walls panelled with brass
service-plates; a central ferrokinetic forge plinth dominates
the floor at waist height; six secondary stations ring the
plinth — each station is keyed to a soldier-class signature
weapon; the chamber's overhead is an iron-and-steam circulation
ring that hisses at irregular intervals; emergency rim-lights
trace the floor and ceiling junctions in muted-amber.*

**Hotspots:** ferrokinetic forge plinth (centre — central craft
surface); soldier-class ledger (left wall); six weapon-station
plates (per signature weapon); reactor-vibration dial (rear);
soldier-creed plaque (above forge).

**NPCs:** none resident; Wraith Calder voice may surface at
trust ≥80 (Iron Lion arc cross-reference).

#### 2.17.1 Back-fill grid (axes 9–17 + storyteller hooks + HUD overlap)

1. **TV infection:** clean = none; exposed = wisps from
   reactor-vibration dial seam, mycelium thread on plinth
   underside; spreading = mycelium fans across station plates;
   corrupted = voidblack pooling at plinth foot, indigo wash
   on ledger; quarantined = sealed-X tape across the forge.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** soldier-class weapon signatures
   forged at the plinth; Iron Lion oath token may be
   re-consecrated here on `jericho_trust_max`.
5. **Mystery-arc bindings:** Jericho Jones E2 (Battle of
   Thaloria training records on soldier-class ledger);
   Wraith Calder E1 (Iron Lion callsign history surfaced via
   plinth interaction).
6. **Investigation tier:** four canonical tiers — closure
   object = a single restored soldier-creed plaque in brass.
7. **Governance modifier reactions:** `combat_damage_buff` →
   plinth surface gains an extra orange-amber pulse;
   `quarantine_protocol_active` → plinth dimmed.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → ledger
   carries indigo marginalia; on `grandEditActive`, soldier-
   creed plaque is overstamped with an unknown sigil.
9. **Cycle-phase lighting:** dawn 5800K warm-amber on plinth;
   long-night 5200K cool-violet on iron-and-steam ring.
10. **Faction livery:** Iron Lions allied = Iron Lion banner
    over the plinth; Hierarchy-allied = Hierarchy ouroboros
    on plinth base.
11. **Tournament window:** finals = champion-tier soldier
    silhouette displayed on the central plinth.
12. **Storyteller hooks:** the Lost Sixth Station (sealed,
    one of six is permanently closed — what was the 6th
    soldier signature?); Lyra Vox's Calibration Record (on
    plinth base, etched microscopically); Reactor Pulse
    Counter (incrementing day-count from before launch).
    Expansion-reserved zone: Sealed Inner Forge (behind the
    rear elevator). Living-world: every IRL hour, the iron-
    and-steam circulation ring releases a single brass-steam
    puff.
13. **HUD overlap:** §9 unified Loadout Switcher (soldier-
    class loadout surfaces here); `PaperDollRenderer.tsx`
    (paper-doll mid-craft visible during forge interaction).

#### 2.17.2 Discovery cutscene + HUD anchor

`engineering_core_first_descent` (~10 s): Engineering Bay
rear-elevator activates for the first time; player descends
through three decks; emergency rim-lights ignite in sequence;
plinth ignites with a brass-orange pulse on arrival. HUD
anchor: signature-weapon launcher fires on plinth touch.

---

### 2.18 Oracle Sanctum (D8 — oracle scrying pool)

- **id:** `oracle-sanctum` / internal `oracle_sanctum`
- **Deck:** 8
- **Adjacency:** Antiquarian's Library (rear-pocket portal)
- **Gating:** oracle-class only AND `loredex_50_unlocked`
- **Status:** new

**Layout sentence:**
*A circular meditation chamber 9 m across, lit only by a
central scrying pool of still violet water set into the floor;
twelve standing-stones ring the pool, each carved with a
prophecy sigil and weathered to a different degree; the
chamber's domed ceiling is open to a starfield that doesn't
match the Ark's exterior coordinates; cool-violet ambient with
warm-gold rim-light from a single brazier at the chamber's
edge.*

**Hotspots:** scrying pool (central); twelve prophecy stones;
brazier; vision lectern (left wall); offering bowl beside pool.

**NPCs:** none resident; the Seer's posthumous voice may
surface here at oracle-trust ≥60.

#### 2.18.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from
   brazier, mycelium thread on pool rim; spreading = mycelium
   on stone bases; corrupted = voidblack overlay on pool's
   surface, water turns murky; quarantined = sealed-X across
   pool.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** Seer's DO-NOT-PLAY band
   may be brought here for ritual; offering bowl accepts
   violet soul stones (alternate purification path).
5. **Mystery-arc bindings:** the Seer arc E1, E2, E5 (DO-
   NOT-PLAY band; VAR-1109A/B prophecy pair carved on stones
   #7 and #8; Canon Paradox surfaces in the pool's
   reflection at trust-100).
6. **Investigation tier:** four canonical tiers — closure
   object = a single bronze plate set into the pool's rim
   etched with the player's chosen prophecy.
7. **Governance modifier reactions:** `oracle_blessing
   _active` → pool surface ripples once per minute; vote-
   open shows §3.6 folded-ballot glyph reflected on pool.
8. **Epoch / ShadowTongue:** ShadowTongue power affects pool
   inversely (paradoxically clearer with higher power); on
   `grandEditActive`, all stone sigils are legible plain-
   text for one visit.
9. **Cycle-phase lighting:** dawn 5800K warm-amber on
   brazier; long-night 5200K cool-violet on pool surface.
10. **Faction livery:** Antiquarian-allied = a small bound
    chronicle on the lectern; Hierarchy-allied = a sealed
    Hierarchy seal on the brazier.
11. **Tournament window:** —
12. **Storyteller hooks:** the Twelve Prophecy Stones (each
    carries a different prophecy; one is blank — reserved
    for the player's own); Pool of Reflection (player's
    reflection appears slightly delayed — see §3.1.3 Elara
    memory recovery cross-reference); Brazier Smoke Signs
    (smoke patterns shift hourly forming readable glyphs at
    trust ≥80). Expansion-reserved zone: the 13th Stone
    (sealed alcove behind the lectern). Living-world: every
    IRL hour the brazier flame changes colour briefly.
13. **HUD overlap:** §3.4.1 Galaxy Meter cross-reference
    (pool reflects the meter's current state); `Mobile
    NarratorSlot.tsx` (the Seer's voice surfaces);
    `MoralityMeter.tsx` (offering a stone may trigger
    morality shift).

#### 2.18.2 Discovery cutscene + HUD anchor

`oracle_first_scrying` (~10 s): pool ignites violet on first
approach; twelve stones briefly illuminate in sequence; brazier
flares once; player's reflection appears delayed by 1 s. HUD
anchor: prophecy-stone selection drives §9 Loredex Viewer
filter.

---

### 2.19 Shadow Vault (D8 — assassin sanctum)

- **id:** `shadow-vault` / internal `shadow_vault`
- **Deck:** 8 (hidden)
- **Adjacency:** Cipher Den (right-bulkhead concealed door)
- **Gating:** assassin-class only AND `kael_lore_discovered`
- **Status:** extends existing `roomMediaPrompts.ts` shadow
  vault entry

**Layout sentence:**
*A black-stone vault 6 m square with no visible doorway from
inside; obsidian-flake walls absorb light; a single low altar
of polished black marble sits at the chamber's centre, holding
a slender black blade laid across two pegs; six small alcoves
around the perimeter each hold a single named token (one per
known assassination); the floor is dust over basalt; a single
cold-cyan pinpoint above the altar provides the only light.*

**Hotspots:** central altar with assassin's blade; six tribute
alcoves; floor-dust footprint chart (rear); offering peg
(left).

**NPCs:** none — the Vault is lonely.

#### 2.19.1 Back-fill grid

1. **TV infection:** clean = none; exposed = mycelium from
   altar base seam; spreading = mycelium on alcove floors;
   corrupted = voidblack on blade itself; quarantined = full
   seal.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** assassin's blade (altar); 6
   tribute tokens (one per known assassination — Akai Shi
   token is one of these).
5. **Mystery-arc bindings:** Jericho Jones E1 (Akai Shi
   tribute token); the Seer arc E1 (sealed letter delivered
   to altar at trust-100).
6. **Investigation tier:** four canonical tiers — closure
   object = the assassin's blade replaced by a brass plate
   etched with the player's chosen restraint vow.
7. **Governance modifier reactions:** `quarantine_protocol
   _active` → blade dimmed.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → one
   tribute token's name is overstamped indigo (the
   assassination is "edited" out); on `grandEditActive`,
   the altar shows seven alcoves instead of six.
9. **Cycle-phase lighting:** dawn 5800K warm-amber edge;
   long-night 5200K cool-violet — but pinpoint above altar
   is always cold-cyan regardless.
10. **Faction livery:** Insurgency-allied = small caltrop-
    stamp on altar; otherwise faction-neutral.
11. **Tournament window:** —
12. **Storyteller hooks:** Footprint Chart (dust pattern
    shows footprints from previous visitors — only the
    player's footprints appear today); Empty Alcove (one
    tribute alcove is bare, reserved for a future named
    assassination); Blade History (engravings on blade
    handle name the previous bearers — the chain ends with
    Lyra Vox). Expansion-reserved zone: the 7th Alcove
    (concealed behind the altar). Living-world: every IRL
    week the dust pattern subtly redistributes.
13. **HUD overlap:** §9 unified Loadout Switcher (assassin
    loadout); `MoralityMeter.tsx` (tier-up if blade is
    laid down rather than taken).

#### 2.19.2 Discovery cutscene + HUD anchor

`shadow_vault_first_entry` (~8 s): wall-panel in Cipher Den
opens silently; player descends; pinpoint over altar ignites;
blade's edge catches one frame of light. HUD anchor: assassin-
class signature attack launcher fires on blade-touch.

---

### 2.20 War Room (D8 — strategist sanctum, faction-standing display)

- **id:** `war-room` / internal `war_room`
- **Deck:** 8
- **Adjacency:** Bridge (right-rear lift), Armory (left
  doorway)
- **Gating:** any tactics ≥3 OR `bridge_war_table_online`
- **Status:** new (the Bridge War Table is a smaller
  preview surface; this is the dedicated room)

**Layout sentence:**
*A long oval war-table 4 m × 2 m dominates a hexagonal chamber
on Deck 8; the table's surface is a holographic galaxy-map
that updates in real-time with faction control colours; five
faction standing pylons rise from the table's perimeter — one
per faction, each pylon a brass column with a banner draped to
a height proportional to the player's standing band; six chairs
are pulled around the table at unequal positions reflecting
which factions are present in the current scenario; the rear
wall holds a tactical-history scroll-wall of past campaigns.*

**Hotspots:** war-table holo-map (centre); 5 faction standing
pylons; tactical-history scroll-wall (rear); 6 chairs (each is
a faction-rep slot); diplomatic-folio rack (left).

**NPCs:** faction-rep silhouettes appear seated based on
current diplomatic state.

#### 2.20.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from war-
   table seams; spreading = mycelium on pylons; corrupted =
   voidblack on chairs; quarantined = sealed-X across war-
   table.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** 5 faction standing badges (top
   of each pylon); 6 diplomatic folios (rack, one per
   active treaty); tactical-history chronicle (scroll-wall).
5. **Mystery-arc bindings:** Wraith Calder E5 (Prophet
   identity surfaces in tactical-history scroll-wall at
   trust-100).
6. **Investigation tier:** four canonical tiers — closure
   object = a single restored galaxy-map under glass with
   the player's chosen end-game faction allegiance lit.
7. **Governance modifier reactions:** `faction_succession_
   announced` → affected pylon banner re-furls in animation;
   `world_modifier` overlays show on the table edge.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → tact-
   history scroll shows indigo overstrikes; on `grandEdit
   Active`, the war-table holo flickers 6 factions instead
   of 5 momentarily.
9. **Cycle-phase lighting:** dawn 5800K on table; long-
   night 5200K on chairs.
10. **Faction livery:** **always load-bearing** — every
    pylon's banner reflects the player's standing per
    faction; champion-tier pylons gilt-edged.
11. **Tournament window:** finals = champion-tier table
    overlay shows current bracket leader.
12. **Storyteller hooks:** the Empty Chair (one chair is
    always pulled out but never seated — reserved for
    "the unspoken party"); Faction Pulse (each pylon
    glows one beat per faction-action somewhere in the
    galaxy — slow ambient); Tactical Chess Move (the war-
    table's central hex shifts one piece per IRL day,
    matching Bridge phantom move). Expansion-reserved
    zone: the 6th Faction Pylon (currently unraised,
    awaiting a future faction's emergence). Living-world:
    every IRL hour, one pylon's banner subtly re-furls
    matching the most-recent faction-standing change.
13. **HUD overlap:** §9 unified Resource Counter (faction
    standing surfaces here); §3.6 Faction Succession
    notification anchor; `LeaderboardPage.tsx` (faction-war
    leaderboard); `CinematicDialogOverlay.tsx` (diplomatic
    scenes).

#### 2.20.2 Discovery cutscene + HUD anchor

`war_room_first_council` (~12 s): Bridge lift opens; player
enters; war-table ignites with current faction-control map; 5
pylons rise from table edge; faction silhouettes seat
themselves in unequal positions. HUD anchor: faction-standing
launcher fires from pylon-touch.

---

### 2.21 Cipher Den (D8 — spy sanctum + Shadow Tongue Uncorruption Bench)

- **id:** `cipher-den` / internal `cipher_den`
- **Deck:** 8
- **Adjacency:** Comms Array (left-wall concealed door),
  Shadow Vault (right-bulkhead concealed door)
- **Gating:** spy-class OR `loredex_uncorruption_unlocked`
- **Status:** new (also hosts the Shadow Tongue Uncorruption
  Bench from §3.10.5 / NOTES §12.8 — Epoch Witness)

**Layout sentence:**
*A low-ceilinged signal-decryption chamber lit only by green
spectrogram displays mounted on three of four walls; a
horseshoe-shaped decryption desk wraps around the room's
centre; behind the desk, a single backlit bench — the **Shadow
Tongue Uncorruption Bench** — holds a series of corrupted
loredex entries laid out as parchment sheets, each with an
indigo stamp visible across its text; spy-cover identity
plates hang from the rear wall.*

**Hotspots:** horseshoe decryption desk (centre); 3 wall-
mounted spectrogram displays; Shadow Tongue Uncorruption
Bench (rear); spy-cover identity plates (rear wall, 3 active
slots); decryption stamp-wheel (right).

**NPCs:** Adjudicator Locke (signal-only, surfaces on
`shadow_tongue_uncorruption_attempted`).

#### 2.21.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from
   spectrogram displays, mycelium on bench; spreading =
   mycelium on identity plates; corrupted = voidblack on
   bench parchments; quarantined = sealed-X across bench.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** corrupted loredex entries on
   bench (active edits surfaceable here); 3 active spy-
   cover identities (per Trade Empire diegetic surface
   §3.3.2); decryption stamp-wheel (player tool).
5. **Mystery-arc bindings:** Wraith Calder E1, E2 (bounty
   file decryption, Substrate-N residue analysis); the
   Seer arc E1, E3 (DO-NOT-PLAY tape spectrogram analysis;
   DEC-7710 catalog card decryption).
6. **Investigation tier:** four canonical tiers — closure
   object = a single brass plate set into the bench etched
   with "Last Edit Cleared, [date]".
7. **Governance modifier reactions:** `shadow_tongue_
   uncorruption_active` → bench glows warm-amber; vote-open
   shows §3.6 ballot glyph on a spectrogram display.
8. **Epoch / ShadowTongue:** **PRIMARY DIEGETIC SURFACE FOR
   SHADOW TONGUE.** ShadowTongue power displayed on the
   centre-rear wall as a vertical bar 0–100; active edits
   on bench display the indigo stamp; clearing an edit
   plays a 3 s "uncorruption" animation (stamp fades, text
   resolves to plain). On `grandEditActive`, the entire
   bench's contents are overstamped and the bench glows
   indigo.
9. **Cycle-phase lighting:** dawn 5800K on desk; long-night
   5200K on bench.
10. **Faction livery:** Insurgency-allied = caltrop-stamp on
    desk; Hierarchy-allied = sealed Hierarchy seal on bench;
    Antiquarian-allied = small bound chronicle on bench.
11. **Tournament window:** —
12. **Storyteller hooks:** Identity Plate History (each
    plate carries the lineage of its cover identity);
    Spectrogram Constellation (the 3 wall displays
    occasionally align to form a recognisable star pattern
    — clue to the Frequency Wall §2.5); Cipher Wheel
    Origin (engravings on stamp-wheel name its previous
    bearers, ending with Lyra Vox). Expansion-reserved
    zone: the 4th Wall (currently dark — reserved for a
    future spectrogram display). Living-world: every IRL
    hour, one spectrogram display flickers through 3 random
    spectra before settling.
13. **HUD overlap:** §9 unified Loredex Viewer (corruption-
    aware variant displayed on bench); §3.3.2 Cover
    Identity Board cross-reference; `MobileNarratorSlot.
    tsx` (Locke voice surfaces).

#### 2.21.2 Discovery cutscene + HUD anchor

`cipher_den_first_uncorruption` (~10 s): wall-panel in Comms
Array slides aside silently; player descends; spectrogram
displays ignite green; bench parchments unroll showing the
first corrupted loredex entry. HUD anchor: Shadow Tongue
Uncorruption launcher fires on bench-stamp.

---

### 2.22 Hierarchy Throne Sanctum (D9 — Hellbox 2 → Castle of Death)

- **id:** `hierarchy-throne` / internal `hierarchy_throne`
- **Deck:** 9 (Hierarchy alignment)
- **Adjacency:** Chaos Forge (left-wall arch, D9 sister-room)
- **Gating:** `faction:championed:hierarchy` AND ≥1 violet
  soul stone
- **Status:** new — **hosts Hellbox 2 → Castle of Death** per
  §3.12.2

**Layout sentence:**
*A black-marble throne room with a single chair carved from
fused obsidian and brass at the chamber's far end on a
three-step dais; the chair's left armrest gives way to reveal
a recess containing the Hellbox 2 obsidian-flake ring (~2 m
diameter, etched into the floor at the throne's foot); ring
centre shows a violet event horizon at half-opacity when latent;
the chamber's walls are pierced by 7 brass alcoves each
holding a Hierarchy ouroboros sigil at different scales;
ambient lighting cool-violet with one warm-amber rim from a
single brazier behind the throne.*

**Hotspots:** the throne (sit hotspot); the obsidian-flake
ring (Hellbox 2 launcher per §3.12.2); 7 ouroboros alcoves;
brazier behind throne; left-armrest recess (master-key slot).

**NPCs:** Hierarchy Archon silhouette appears seated on throne
when player approaches at trust-Hierarchy max.

#### 2.22.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from ring
   etching, mycelium on dais step; spreading = mycelium on
   ouroboros alcoves; corrupted = voidblack on throne; quar-
   antined = sealed-X across ring.
2. **Demon-summoning surface:** **PRIMARY** — Hellbox 2
   obsidian-flake ring (per §3.12.2). Three states: latent
   / manifest / active. Active = Castle of Death pocket
   accessible.
3. **CADES:** —
4. **Story items (§3.5):** Hellbox 2 ring; 7 ouroboros sigils
   (one per Hierarchy bond tier); brazier (offering bowl
   accepts violet soul stones); Hierarchy Archon ledger
   (under throne).
5. **Mystery-arc bindings:** Wraith Calder E3 (Hierophant
   ceremony — surfaced when sitting on throne at trust-100);
   no other arc surfaces directly here.
6. **Investigation tier:** four canonical tiers — closure
   object = a single brass plate set into the throne's
   headrest etched with the player's chosen Hierarchy
   covenant.
7. **Governance modifier reactions:** `hierarchy_blessing_
   active` → all 7 ouroboros sigils gilt-edged; vote-open
   shows §3.6 ballot glyph on throne backrest.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → ring
   etching shows indigo over-marks; on `grandEditActive`,
   throne is overstamped with a sigil that is NOT the
   ouroboros (a clue: which Archon currently rules).
9. **Cycle-phase lighting:** dawn 5800K on brazier; long-
   night 5200K cool-violet on throne (the throne stays cold
   regardless of cycle).
10. **Faction livery:** **always load-bearing** — Hierarchy-
    championed = full 7 ouroboros lit gold; Hierarchy-
    enemied = throne overturned (sealed-X tape and the room
    is functionally inaccessible).
11. **Tournament window:** —
12. **Storyteller hooks:** the Empty Throne (the chair is
    always empty regardless of NPC silhouette — symbolic);
    7 Ouroboros Tiers (each represents a Hierarchy bond
    tier; collecting all 7 unlocks a unique cosmetic);
    Hellbox 2 Latency (latent state shows the ring's etch
    glowing faintly even untouched — a slow living pulse).
    Expansion-reserved zone: the Anti-Throne (sealed
    chamber behind the brazier — for the player who chooses
    to renounce the Hierarchy). Living-world: every IRL
    hour, one of the 7 ouroboros alcoves pulses brighter
    momentarily.
13. **HUD overlap:** §3.9 Soul Stones inventory surfaces
    on ring approach; §3.12.2 Hellbox cutscene
    `cs_hellbox_2_open` plays here; §9 unified Resource
    Counter (Hierarchy faction standing); `MoralityMeter
    .tsx` (sitting on throne triggers tier evaluation).

#### 2.22.2 Discovery cutscene + HUD anchor

See §3.12.2 — discovery scene + `cs_hellbox_2_open` cutscene
covered in Hellbox Atlas.

---

### 2.23 Chaos Forge (D9 — Hierarchy alignment)

- **id:** `chaos-forge` / internal `chaos_forge`
- **Deck:** 9 (Hierarchy alignment)
- **Adjacency:** Hierarchy Throne Sanctum (right-wall arch,
  sister-room)
- **Gating:** `faction:championed:hierarchy` OR `faction:
  allied:hierarchy`
- **Status:** new

**Layout sentence:**
*A wide forge chamber with three open-flame pits arranged in
a triangle; each pit burns a different colour (left amber-
gold, right cold-cyan, rear blood-red); a central anvil of
black iron sits at the triangle's centroid; tools hang from
the ceiling on chains rather than racks; the chamber's air
is hazed with brass-steam; soul stones accepted at the rear
red pit corrupt in real-time; soul stones at the cyan pit
do not corrupt or purify (held in stasis).*

**Hotspots:** 3 flame pits (amber / cyan / red); central
anvil; ceiling tool-chains; offering shelf (left wall, before
each pit); Mol'Garath audience-key slot (right wall).

**NPCs:** Mol'Garath silhouette may appear at the rear red
pit on `hierarchy_acquisitions_max`.

#### 2.23.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from
   flame pits' chimneys, mycelium on anvil base; spreading
   = mycelium on tool-chains; corrupted = voidblack on
   anvil; quarantined = sealed-X across central anvil.
2. **Demon-summoning surface:** secondary — the rear red
   pit corrupts violet soul stones to red (alternate path
   to the Castle-of-Death summoning circle in §3.9.2).
3. **CADES:** —
4. **Story items (§3.5):** 3 flame-pit forging variants
   (per pit colour); soul stone corruption residue (red
   pit byproduct); Mol'Garath audience key (drops on
   `mol_garath_audience_unlocked`).
5. **Mystery-arc bindings:** Wraith Calder E2 (Substrate-N
   residue can be identified at the cyan pit's stasis flame).
6. **Investigation tier:** four canonical tiers — closure
   object = a single black-iron plate set into the central
   anvil etched with the player's chosen Hierarchy
   forging-covenant.
7. **Governance modifier reactions:** `crafting_speed_boost`
   → all three pits burn brighter; `hierarchy_blessing_active`
   → red pit gains a stable steady flame.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → tools
   on chains carry indigo etch-marks; on `grandEditActive`,
   the cyan pit flickers to indigo (revealing a hidden 4th
   pit option).
9. **Cycle-phase lighting:** dawn 5800K (already warm-amber
   matched); long-night 5200K cool-violet on cyan pit.
10. **Faction livery:** Hierarchy-championed = all three pits
    lit; Hierarchy-allied = only amber + cyan; Hierarchy-
    enemied = pits cold and dust-covered.
11. **Tournament window:** —
12. **Storyteller hooks:** the 4th Pit (visible only on
    `grandEditActive` — a hidden indigo flame — implication
    Shadow Tongue runs a fourth alchemy here); Mol'Garath
    Audience Key (drops once; opens a vision-only
    encounter); Tool Chain Cycle (one tool per IRL hour
    descends from the ceiling, used itself, then ascends —
    no visible hand). Expansion-reserved zone: Sealed
    Bellows (rear-left wall — air supply for the 4th pit).
    Living-world: every IRL hour, the air shimmer pattern
    above the pits shifts.
13. **HUD overlap:** §3.9 Soul Stones inventory (red pit
    corruption interaction); §9 unified Resource Counter
    (crafting materials); `PaperDollRenderer.tsx` (player
    paper-doll mid-craft visible).

#### 2.23.2 Discovery cutscene + HUD anchor

`chaos_forge_first_pit` (~10 s): three pits ignite in
sequence (amber → cyan → red); brass-steam haze rises;
anvil glows from underneath. HUD anchor: corruption launcher
fires from red pit interaction.

---

### 2.24 Elemental Nexus (D10 — Demagi alignment)

- **id:** `elemental-nexus` / internal `elemental_nexus`
- **Deck:** 10 (Demagi alignment)
- **Adjacency:** Quantum Lab + Synthesis Chamber (D10 sister-
  rooms via central rotunda)
- **Gating:** Demagi species OR `species_attunement_demagi
  _completed`
- **Status:** new

**Layout sentence:**
*A circular chamber 12 m across with eight standing pillars
at compass positions, each pillar associated with one of the
8 elements (fire / water / earth / air / time / space /
probability / void); each pillar holds a small elemental
manifestation suspended at chest height; the chamber's floor
is inlaid with a sigil-circle that connects all 8 pillars
via brass channels; ambient lighting cycles through the 8
elements over a 24-hour cycle, one element dominant at any
given hour.*

**Hotspots:** 8 elemental pillars; central sigil-circle;
attunement bowl (centre — drops on `demagi_attunement_unlocked`);
elemental ledger (left wall, records player's attunement
history).

**NPCs:** none resident; species-aligned voice surfaces.

#### 2.24.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from
   pillar bases; spreading = mycelium on sigil-circle;
   corrupted = void-pillar's manifestation grows; quaran-
   tined = sealed-X across sigil-circle.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** 8 elemental tokens (one per
   pillar, collected via attunement); attunement ledger
   (left wall).
5. **Mystery-arc bindings:** none specific.
6. **Investigation tier:** four canonical tiers — closure
   object = a single brass plate at sigil-circle centre
   etched with the player's chosen primary element.
7. **Governance modifier reactions:** `species_blessing_
   active (demagi)` → all 8 pillars lit simultaneously;
   `season_phase_shift` → seasonal element pulses for 24h.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → void
   pillar's manifestation grows; on `grandEditActive`, a
   hidden 9th pillar appears momentarily.
9. **Cycle-phase lighting:** elemental cycle is
   independent of cycle-phase (8-hour element rotation
   takes precedence); cycle-phase only modulates rim-
   lights.
10. **Faction livery:** —
11. **Tournament window:** —
12. **Storyteller hooks:** the Hidden 9th Element (visible
    only on `grandEditActive` — implication: the 9th
    element is named in the Antiquarian's chronicle as the
    Programmer's invention); Pillar Pulse Sync (each
    pillar's manifestation pulses to a different rhythm,
    syncing only at midnight UTC); Attunement Echo (every
    attunement event echoes faintly through the chamber
    for 24h after). Expansion-reserved zone: the 9th
    Pillar foundation (a recess in the floor between
    pillars 8 and 1). Living-world: every hour, the
    dominant element shifts and the chamber's ambient
    palette changes accordingly.
13. **HUD overlap:** `MoralityMeter.tsx` (attunement
    affects alignment); §9 unified Resource Counter
    (elemental attunement points).

#### 2.24.2 Discovery cutscene + HUD anchor

`elemental_nexus_first_attunement` (~10 s): 8 pillars
ignite in sequence; sigil-circle illuminates from centre
outward; player's first chosen element pulses brighter.
HUD anchor: attunement launcher fires from pillar-touch.

---

### 2.25 Quantum Lab / Probability Chamber (D10 — Quarchon alignment)

- **id:** `quantum-lab` / internal `quantum_lab`
- **Deck:** 10 (Quarchon alignment)
- **Adjacency:** Elemental Nexus (rotunda)
- **Gating:** Quarchon species OR `species_attunement_quarchon
  _completed`
- **Status:** new

**Layout sentence:**
*A long laboratory 8 m × 5 m lined with quantum-state
displays showing branching probability trees; a central
superposition chamber holds a single probabilistic object
(visible as a flickering silhouette switching between two
states); the chamber's air carries faint visible probability
clouds (light scatter resembling fog but with discrete
patterns); a probability-collapse lever at the chamber's foot
locks the displayed state; the rear wall holds a record of
every collapse the player has made.*

**Hotspots:** central superposition chamber; probability-
collapse lever; quantum-state displays (3 wall-mounted);
collapse-record wall; observer's chair (right wall).

**NPCs:** none resident; the Programmer's voice may surface.

#### 2.25.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from
   chamber seal; spreading = mycelium on lever; corrupted
   = probability cloud turns voidblack; quarantined =
   sealed-X across chamber.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** probability collapse records
   (rear wall, accumulating); the superposition chamber
   itself (unique single-state object).
5. **Mystery-arc bindings:** none specific.
6. **Investigation tier:** four canonical tiers — closure
   object = a single brass plate set beside the lever
   etched with the player's chosen "final collapse" choice.
7. **Governance modifier reactions:** `quantum_state_
   stabilized` → probability cloud thins; `community_
   milestone` → one extra branch appears on quantum-state
   displays.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → quantum
   displays show indigo overstamps on collapsed states; on
   `grandEditActive`, the superposition chamber's flicker
   slows — implying the Tongue can pin states.
9. **Cycle-phase lighting:** dawn 5800K rim; long-night
   5200K cool-violet on cloud.
10. **Faction livery:** —
11. **Tournament window:** —
12. **Storyteller hooks:** Branching Observation (the
    quantum-state displays show a decision tree of all
    possible futures — all eventually converge to the same
    place; implication = fate is predetermined); the
    Architect's Observation (text in collapse-record wall
    reads "the Architect is observing and manipulating
    probabilities"); Schrödinger Anomaly (the superposition
    chamber occasionally shows BOTH states at once — a
    flicker glitch). Expansion-reserved zone: a Sealed
    Observation Booth (above the lab, locked — for "the
    other observer"). Living-world: every IRL hour, one
    branch on the displays gets pruned; new branches
    appear daily.
13. **HUD overlap:** `MoralityMeter.tsx` (collapse-lever
    pulls trigger morality choices); §9 unified Resource
    Counter (quantum tokens).

#### 2.25.2 Discovery cutscene + HUD anchor

`quantum_lab_first_collapse` (~10 s): chamber ignites with
flickering silhouette; probability cloud forms; player
approaches lever for first time. HUD anchor: collapse
launcher fires on lever-pull.

---

### 2.26 Synthesis Chamber (D10 — Neyon alignment)

- **id:** `synthesis-chamber` / internal `synthesis_chamber`
- **Deck:** 10 (Neyon alignment)
- **Adjacency:** Elemental Nexus + Quantum Lab (rotunda)
- **Gating:** Neyon species OR `species_attunement_neyon
  _completed`
- **Status:** new

**Layout sentence:**
*A circular chamber dominated by a central synthesis vat
(2 m diameter, holding a swirling chrome liquid); 4 input
chutes feed the vat from compass positions, each chute
bearing a different material (organic / synthetic / energy /
information); a synthesis altar stands behind the vat with
6 control runes; the chamber's walls show holographic recipes
of all known hybrid syntheses; ambient chrome reflections
make every surface gleam.*

**Hotspots:** central synthesis vat; 4 input chutes; synthesis
altar with 6 control runes; recipe walls (holographic);
output cradle (vat-side, accepts synthesised hybrids).

**NPCs:** none resident; Neyon-attuned voice surfaces.

#### 2.26.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from
   chute joints; spreading = mycelium on altar; corrupted =
   chrome liquid turns voidblack; quarantined = sealed-X
   across vat.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** synthesised hybrid cards (output
   cradle); 4 input materials (chutes, accepts player
   inventory); failed synthesis residue (vat lining).
5. **Mystery-arc bindings:** none specific.
6. **Investigation tier:** four canonical tiers — closure
   object = a single chrome plate set into the altar
   etched with the player's chosen synthesis archetype.
7. **Governance modifier reactions:** `synthesis_yield_
   buff` → vat liquid shimmers gold; `quarantine_protocol_
   active` → vat sealed.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 →
   recipe walls' holograms show indigo overstrike; on
   `grandEditActive`, the vat synthesises a single unknown
   "indigo hybrid" overnight.
9. **Cycle-phase lighting:** dawn 5800K on chrome; long-
   night 5200K cool-violet on vat liquid.
10. **Faction livery:** —
11. **Tournament window:** —
12. **Storyteller hooks:** the Failed Synthesis Wall (one
    wall holds plaques for every failed synthesis — ghosts
    of failed cards); the Hidden Recipe (one recipe slot
    on the wall is permanently blank — implication: the
    "true" synthesis is unknowable); Chrome Reflection
    Anomaly (the player's reflection in the vat surface
    occasionally shows a different person). Expansion-
    reserved zone: a Sealed Output Cradle (alternate
    output, locked, for legendary syntheses). Living-world:
    every IRL hour, the chrome liquid swirl pattern shifts.
13. **HUD overlap:** `PackOpening.tsx` (synthesis ceremony
    plays on hybrid output); §9 unified Resource Counter
    (synthesis materials); §9 Card Collection (synthesised
    hybrids surface in collection on output).

#### 2.26.2 Discovery cutscene + HUD anchor

`synthesis_first_hybrid` (~10 s): 4 chutes ignite in sequence;
vat liquid swirls gold; first hybrid emerges from output
cradle. HUD anchor: synthesis launcher fires from altar-rune.

---

### 2.27 Memorial Corridor / Plaza (pocket — fallen-crew plaques)

- **id:** `memorial-corridor` / internal `memorial_corridor`
- **Deck:** pocket (rear of Crew Quarters)
- **Adjacency:** Crew Quarters (one-way egress; return via
  Bridge lift)
- **Gating:** any crew death recorded
- **Status:** new

**Layout sentence:**
*A long narrow corridor ~25 m × 3 m with a vaulted ceiling;
left wall holds a brass rack of fallen-crew plaques (one per
deceased crew member, accumulating over save); right wall is
a continuous frieze of etched names from previous Inception
Arks (centuries-old, untouchable, somber); centre floor is
inlaid with a procession-stone path; far end opens into the
Memorial Plaza proper — a small circular plaza with a single
brass bowl that holds a continuous low flame.*

**Hotspots:** brass plaque rack (left, accumulates); name-
frieze (right, immutable); central procession path; Plaza
brass bowl + flame; Anniversary Plaque rack (per §3.2.3,
mounted at corridor entry).

**NPCs:** crew silhouettes may walk the corridor at certain
death-anniversaries; Elara may surface here on first crew-
death event.

#### 2.27.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from
   plaque-rack underside; spreading = mycelium on procession
   path; corrupted = voidblack on Plaza bowl rim, flame
   colour shifts; quarantined = sealed-X across plaza.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** N fallen-crew plaques (per
   `crewMembers.deathRecord`); 12 Anniversary Plaques (per
   §3.2.3); the Plaza brass bowl (continuous flame); the
   immutable name-frieze on right wall.
5. **Mystery-arc bindings:** Wraith Calder cross-reference
   (the right-wall frieze names every Inception Ark crew
   from previous epochs); Jericho Jones E5 (Akai Shi mercy
   token can be placed on a plaque here as final tribute).
6. **Investigation tier:** four canonical tiers — closure
   object = a single bound brass codex on the Plaza bowl
   rim titled "The Living Witnesses, [date]".
7. **Governance modifier reactions:** `community_milestone_
   broadcast` → flame steps brighter for 1h.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → some
   right-wall frieze names show indigo overstrikes (their
   memory is being edited); on `grandEditActive`, the Plaza
   flame turns indigo for one visit.
9. **Cycle-phase lighting:** dawn 5800K warm-amber on
   plaza; long-night 5200K cool-violet on plaque-rack.
10. **Faction livery:** champion-tier faction's heraldry
    appears subtly engraved on plaza bowl rim.
11. **Tournament window:** —
12. **Storyteller hooks:** the Living Witnesses (the player
    is implicitly named in the Plaza chronicle — they are
    the witness for everyone who died); Plaque Inscription
    Slot (player can choose epitaph for each crew death);
    Procession Path Pulse (every IRL day at the player's
    "evening" the path's brass inlays pulse warm-amber once).
    Expansion-reserved zones: Crypt Below (sealed trapdoor
    in plaza centre — for "the unspeakable losses"); the
    Right Wall continuation (frieze extends underground,
    locked). Living-world: every IRL day, one plaque on the
    rack acquires a small dust-shadow if not visited; visited
    plaques stay polished.
13. **HUD overlap:** §3.2.3 Anniversary Plaque rack lives
    here; `MobileNarratorSlot.tsx` (Elara surfaces on first-
    crew-death event); §3.5 Story Item Registry (plaques
    cross-referenced).

#### 2.27.2 Discovery cutscene + HUD anchor

`memorial_first_visit` (~12 s): corridor lights ignite in
sequence as player walks; first plaque slides into rack with
a brass click; Plaza flame steps from a low burn to its full
height. HUD anchor: epitaph-edit launcher fires from plaque
interaction.

---

### 2.28 Pet Garden (pocket — breeding/dynasty room)

- **id:** `pet-garden` / internal `pet_garden`
- **Deck:** pocket (rear of Hydroponics)
- **Adjacency:** Hydroponics (rear bulkhead), Pet Arena
  (right doorway), Pet Medical Annex (left doorway)
- **Gating:** any pet adopted
- **Status:** new — full breeding/dynasty surface per §3.10

**Layout sentence:**
*A high-ceilinged greenhouse 12 m × 8 m with sun-skylight
above; the room is divided into 4 zones: a central feeding-
play area with low brass railings, a Breeding Wing along the
left wall (6 incubation pods per §3.10.1), a Genealogy Tree
mounted on the back wall (per §3.10.2), and 3 Evolution
Chambers in the right alcove (per §3.10.3); the Bloodline
Plinth (per §3.10.4) sits at the centre of the play area on
an obsidian dais; ambient palette is warm-amber daylight with
green plant-leaf accents.*

**Hotspots:** 6 incubation pods (per §3.10.1); Genealogy Tree
(rear wall); 3 Evolution Chambers (right alcove); Bloodline
Plinth (centre); feeding-trough (front-centre); play-area
(centre); skylight (overhead, accepts gold soul stones for
pet blessing).

**NPCs:** none resident; Lyra Vox's posthumous voice surfaces
on Bloodline Witness Report milestones (per NOTES §12.5).

#### 2.28.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from pod
   bases; spreading = mycelium on Genealogy Tree; corrupted
   = voidblack on play-area, plants wither; quarantined =
   sealed-X across pet entry.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** all pets currently in roster
   (visible at appropriate zone — feeding/play if active,
   incubation pod if breeding); Genealogy plates (one per
   bred pet); 5 Bloodline Witness Reports (Bloodline
   Plinth, accumulating).
5. **Mystery-arc bindings:** none specific; Lyra Vox cross-
   reference at Bloodline Plinth (she narrates each
   milestone).
6. **Investigation tier:** four canonical tiers — closure
   object = a single bound brass codex on the Bloodline
   Plinth titled "The Living Genealogy, [date]".
7. **Governance modifier reactions:** `pet_breeding_speed_
   buff` → all pods' bases pulse faster; `seasonal_pet_drop`
   → one extra incubation pod is highlighted with a
   seasonal accent.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → one
   Genealogy Tree plate's pet-glyph is overstamped indigo;
   on `grandEditActive`, the Bloodline Plinth shows a
   "missing" generation in indigo silhouette.
9. **Cycle-phase lighting:** dawn 5800K warm-amber from
   skylight; long-night 5200K cool-violet (skylight dims).
10. **Faction livery:** —
11. **Tournament window:** Pet Arena tournament finals shows
    a banner above the Pet Garden's right doorway.
12. **Storyteller hooks:** the Original Pair (one pod is
    sealed with Lyra Vox's wax — contains the founder pets
    of the player's dynasty); the Hidden Mutation (every
    100th breed has a chance for a unique mutation visible
    only on the Genealogy Tree as a different brass alloy);
    Skylight Star-Pet Blessing (placing a gold soul stone
    on the skylight grants one random pet a permanent boon
    — animation: stone falls into the skylight, pet glows).
    Expansion-reserved zone: Sealed Aviary (rear corner —
    for flying pet species not yet implemented). Living-
    world: every IRL hour, pets in the play-area shuffle
    positions; sleeping pets occasionally twitch.
13. **HUD overlap:** §9 Pet Roster surfaces here in
    diegetic form; `MobileNarratorSlot.tsx` (Lyra Vox
    surfaces on Bloodline milestones); §3.10 Pet Breeding
    section.

#### 2.28.2 Discovery cutscene + HUD anchor

`pet_garden_first_entry` (~10 s): Hydroponics rear bulkhead
opens; warm sunlight fills room; first pet (player's chosen
starter) walks to the centre; Bloodline Plinth ignites with
the founder etching. HUD anchor: pet-management launcher
fires from feeding-trough touch.

---

### 2.29 Pet Arena + Spectator Gallery (pocket)

- **id:** `pet-arena` / internal `pet_arena`
- **Deck:** pocket (right of Pet Garden)
- **Adjacency:** Pet Garden (left doorway)
- **Gating:** any pet at evolution stage 2+
- **Status:** new

**Layout sentence:**
*A circular arena 10 m diameter with sand-and-stone floor at
ground level, surrounded by 3 tiers of brass-rail spectator
seating (~30 seats); a central elevated dais holds a
match-scheduling pillar; the arena's ceiling is open to a
faux-skylight that simulates day/night cycles independent of
the rest of the Ark; a Retirement Shrine alcove sits at the
arena's rear (per §3.10 — small obsidian plinth with brass
plates for retired/deceased pets).*

**Hotspots:** central match-scheduling pillar; arena floor
(viewing only); 3 tiers spectator seating; Retirement Shrine
(rear alcove); replay viewing console (left wall).

**NPCs:** spectator silhouettes appear during active matches.

#### 2.29.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from
   spectator-seat bases; spreading = mycelium on arena
   floor; corrupted = voidblack pooling at floor centre;
   quarantined = sealed-X across arena.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** Retirement Shrine plates (one per
   retired/deceased pet); arena trophy-case (left wall, per-
   tournament wins).
5. **Mystery-arc bindings:** none specific.
6. **Investigation tier:** four canonical tiers — closure
   object = a single brass plate set into the dais etched
   with the player's chosen "First Champion" pet name.
7. **Governance modifier reactions:** `pet_arena_purse_buff`
   → match-scheduling pillar shows gold-pulse accent;
   `tournament_window_finals` → spectator seats fill with
   silhouettes for the duration.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → one
   Retirement Shrine plate is overstamped indigo (a pet
   "edited" out of memory); on `grandEditActive`, the arena
   floor shows an indigo silhouette of a pet not in roster.
9. **Cycle-phase lighting:** faux-skylight cycle independent;
   cycle-phase only modulates spectator-seat rim-lights.
10. **Faction livery:** champion-tier faction's heraldry
    appears on dais during finals.
11. **Tournament window:** **always load-bearing** — finals
    fills spectator seats; champion-anointed = gilded dais.
12. **Storyteller hooks:** the Empty Front Row (3 seats at
    the arena's centre-front are always reserved — for
    "the original Trainers"); Faux-Skylight Anomaly (the
    skylight occasionally shows a sky from a different
    world — clue to dimensional bleeding); Retirement
    Plates Engraving (each plate is engraved with the pet's
    final fight stats and cause-of-retirement). Expansion-
    reserved zone: VIP Box (above the dais — for
    legendary-tier players). Living-world: every IRL day at
    "noon" the faux-skylight cycles a full day in 60
    seconds.
13. **HUD overlap:** `LeaderboardPage.tsx` (pet-arena
    leaderboard); §9 unified Replay Scrubber diegetic
    anchor (Pet Arena replay console — currently the
    Replay Scrubber is MISSING per §3); `Spectator
    Page.tsx` surfaces here.

#### 2.29.2 Discovery cutscene + HUD anchor

`pet_arena_first_match` (~12 s): arena floor ignites; faux-
skylight matches IRL time-of-day; player's pet walks to
arena centre; first opponent silhouette enters from rear.
HUD anchor: match launcher fires from scheduling pillar.

---

### 2.30 Pet Medical Annex (pocket)

- **id:** `pet-medical-annex` / internal `pet_medical_annex`
- **Deck:** pocket (left of Pet Garden)
- **Adjacency:** Pet Garden (right doorway), Medical Bay
  (rear-corridor link)
- **Gating:** any pet injured
- **Status:** new

**Layout sentence:**
*A small annex 5 m × 4 m with 4 transparent recovery tanks
arranged in a row; each tank holds an injured pet suspended
in healing fluid; a single attendant brass-armoured gurney
stands ready at the room's centre; the rear wall holds a
veterinary-instrument rack; cool-cyan ambient light from
overhead medical fixtures.*

**Hotspots:** 4 recovery tanks; central gurney; veterinary
instrument rack (rear); pet-vital monitor (left wall, shows
recovery times).

**NPCs:** none resident; Vex Solène's posthumous voice
surfaces on first pet-recovery event (medical engineering
cross-reference).

#### 2.30.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from tank
   coolant lines; spreading = mycelium on gurney; corrupted
   = healing fluid turns voidblack; quarantined = sealed-X.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** injured pet rosters in tanks;
   instruments (rear); pet-vital readouts.
5. **Mystery-arc bindings:** Vex Solène (cross-reference —
   Vex's medical engineering shows in the tank design).
6. **Investigation tier:** four canonical tiers — closure
   object = a single brass plate set into the gurney
   etched with "Last Recovery, [date], [pet name]".
7. **Governance modifier reactions:** `pet_recovery_speed_
   buff` → tank coolant lines glow gold.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → vital
   monitor shows indigo overstamps on patient names; on
   `grandEditActive`, one tank shows an indigo silhouette
   (a pet "edited" mid-recovery).
9. **Cycle-phase lighting:** dawn 5800K warm-amber edge;
   long-night 5200K cool-violet on tank glass.
10. **Faction livery:** —
11. **Tournament window:** —
12. **Storyteller hooks:** the 5th Tank (sealed in the rear
    wall — for "the pet that cannot be healed"); Vex's
    Engineering Signature (etched microscopically into each
    tank's brass plate); Recovery Time Display Anomaly (one
    tank's display occasionally shows a recovery time of
    "∞" before correcting). Expansion-reserved zone: Sealed
    Necropsy Lab (behind the rear wall, locked). Living-
    world: every IRL hour, the tanks' coolant lines pulse
    once.
13. **HUD overlap:** §9 Pet Roster (injured-pet section
    surfaces here); `MobileNarratorSlot.tsx` (Vex voice on
    first recovery).

#### 2.30.2 Discovery cutscene + HUD anchor

`pet_medical_first_recovery` (~8 s): tank coolant lines
ignite cyan; gurney brass-armour locks into place; first
injured pet appears in tank-1. HUD anchor: pet-recovery
launcher fires from gurney touch.

---

### 2.31 Trade Hub (stub — parallel-agent placeholder)

- **id:** `trade-hub` / internal `trade_hub`
- **Deck:** ?  (deck assignment pending TE agent)
- **Adjacency:** Station Dock (canonical entry)
- **Gating:** TE agent owned
- **Status:** **stub** — full Trade Hub authoring deferred to
  parallel TE agent; this entry locks the interface boundary
  + diegetic surfaces (per §3.3) so the room is hookable when
  TE agent ships their work

**Layout sentence:**
*Reserved for parallel-agent authoring. The Trade Hub's
diegetic surfaces are pre-spec'd in §3.3 (Trade Command Center,
Cover Identity Board, Cargo Manifest Console, Broker's Office).
The Hub itself is the **container** for these surfaces; the
container's Layout Sentence is reserved for the TE agent's
choice of focal centre (likely the central Trade Command
Center per §3.3.1).*

**Hotspots:** see §3.3 — 4 surfaces enumerated.

**NPCs:** Adjudicator Locke (resident at trade-court desk);
Coda admin (cross-references Station Dock §2.16).

#### 2.31.1 Back-fill grid (stub)

1. **TV infection (axis 9):** see §3.3 — diegetic surfaces
   inherit per-room infection brackets; full per-bracket
   spec deferred.
2. **Demon-summoning:** —
3. **CADES:** —
4. **Story items (§3.5):** Trade Hub manifests, broker
   contracts, cover identities — see §3.3.
5. **Mystery-arc bindings:** Wraith Calder E2 (cargo
   manifest cross-reference); Degen E1 (Mol'Vereth's
   visiting card surfaces in Broker's Office).
6. **Investigation tier (axis 15):** four canonical tiers —
   spec deferred.
7. **Governance modifier reactions:** `trade_discount_10`
   modifier renders across all 4 §3.3 surfaces.
8. **Epoch / ShadowTongue:** ShadowTongue power affects the
   Trade Hub's manifests (see §3.3.3 Cargo Manifest
   Console — indigo overstrike at ≥40).
9. **Cycle-phase lighting:** standard ±300K drift per §3.4.
10. **Faction livery:** **always load-bearing** —
    cross-references Station Dock §2.16 4-faction banner
    display; Trade Hub additionally shows broker faction
    affiliations on each broker's portrait.
11. **Tournament window:** —
12. **Storyteller hooks:** deferred to TE agent; suggest
    reserving "the Empty Broker Desk" for a future broker
    NPC and "the Sealed Vault" for endgame trade contents.
13. **HUD overlap:** §3.3 surfaces (4); `LockeConfidential
    LedgerPanel.tsx` (Locke's diegetic surface here).

#### 2.31.2 Discovery cutscene + HUD anchor

Discovery cutscene deferred to TE agent. HUD anchor: Trade
Empire launcher fires from Trade Command Center centre table.

---

### 2.32 Trade Command Center / Broker's Office (sub-room of Trade Hub)

- **id:** `trade-command-center` / internal
  `trade_command_center`
- **Deck:** sub-room of Trade Hub
- **Adjacency:** Trade Hub (canonical entry)
- **Gating:** TE agent owned
- **Status:** **stub** — diegetic art surfaces fully spec'd
  in §3.3.1–§3.3.4

**Layout sentence:** see §3.3.1 (Trade Command Center) —
verbatim apply.

**Hotspots:** see §3.3.1, §3.3.2, §3.3.3, §3.3.4.

**NPCs:** Locke (Broker's Office); 6 broker silhouettes at
Trade Command Center stations.

#### 2.32.1 Back-fill grid

Inherits from §2.31 Trade Hub. The 4 §3.3 surfaces (Trade
Command Center, Cover Identity Board, Cargo Manifest
Console, Broker's Office) are the per-zone specifications;
this room is the container.

#### 2.32.2 Discovery cutscene + HUD anchor

See §2.31. Per-surface launchers fire from each §3.3
surface's identified hotspot (sector-map table, cover
portraits, cargo plates, broker desk).

---

### 2.33 Defense Command Center (TD — tactical grid)

- **id:** `defense-command-center` / internal
  `defense_command_center`
- **Deck:** 4 (operations spine)
- **Adjacency:** War Room (right-rear lift), Tower Assembly
  Bay (left doorway)
- **Gating:** any tower placed on any base
- **Status:** new — primary diegetic surface for Tower Defense
  (per NOTES §12.8 — TD has 0 Ark surface today)

**Layout sentence:**
*A circular operations chamber 9 m diameter dominated by a
holo-tactical grid table at its centre showing the player's
active station/world bases as miniaturised 3D maps; tower
silhouettes are visible at placement positions on each map;
3 wall-mounted raid-alert panels ring the chamber (one per
active raid window); a wave-progress live ticker scrolls
across the rear wall; a replay gallery shelf on the left
holds brass-cased recordings of past raids (one per raid).*

**Hotspots:** central holo-tactical table; 3 raid-alert
panels; wave-progress ticker (rear); replay gallery shelf
(left); daily-streak indicator (right wall).

**NPCs:** none resident; tactical voice surfaces during
active raid.

#### 2.33.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from
   table seams; spreading = mycelium on alert panels;
   corrupted = tactical grid flickers voidblack; quarantined
   = sealed-X across table.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** raid replay cylinders (left
   shelf, accumulating); daily-streak count plate (right
   wall, current streak engraved).
5. **Mystery-arc bindings:** none specific.
6. **Investigation tier:** four canonical tiers — closure
   object = a single brass plate set into the table edge
   etched with the player's longest-defended siege.
7. **Governance modifier reactions:** `defense_priority_
   buff` → tactical table grid pulses gold; `quarantine_
   protocol_active` → table sealed.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → one
   raid-alert panel shows indigo overstamp on attacker
   identity (the attacker is "edited"); on `grandEditActive`,
   the wave-progress ticker shows indigo phantom-waves.
9. **Cycle-phase lighting:** dawn 5800K warm-amber on
   table; long-night 5200K cool-violet on alert panels.
10. **Faction livery:** —
11. **Tournament window:** **load-bearing** — finals shows
    bracket overlay on tactical table.
12. **Storyteller hooks:** the Empty Replay Slot (every 16th
    slot is reserved blank — implication: a raid that
    happened but was edited from history); Tactical Table
    Anomaly (occasionally shows a base the player doesn't
    own — clue to a future expansion); Daily-Streak
    Engraving (the count plate engraves itself silently
    every 24h, even with no observer). Expansion-reserved
    zone: VIP Gallery (above the operations chamber, locked
    — for tournament spectators). Living-world: every IRL
    hour, the tactical table cycles through all owned bases
    in slow rotation.
13. **HUD overlap:** §9 unified Replay Scrubber diegetic
    anchor (currently MISSING per §3); `LeaderboardPage.
    tsx` (TD leaderboard); §9 Resource Counter (raid
    trophies).

#### 2.33.2 Discovery cutscene + HUD anchor

`defense_first_command` (~10 s): tactical table ignites with
player's first base map; 3 alert panels light in sequence;
wave-progress ticker scrolls "READY". HUD anchor: tower-
placement launcher fires from table-touch.

---

### 2.34 Trophy Armory (TD — league-scaled trophy display)

- **id:** `trophy-armory` / internal `trophy_armory`
- **Deck:** 4 (operations spine, sub-room of Defense
  Command Center)
- **Adjacency:** Defense Command Center (left doorway)
- **Gating:** any TD trophy earned
- **Status:** new

**Layout sentence:**
*A long display gallery 12 m × 4 m with 16 trophy-tier
displays mounted along the right wall (one per league —
bronze_1 through legend); each tier display is a brass-
framed alcove holding the player's earned trophy at that
tier (silhouette if not yet earned); the left wall holds
3 large mounted trophy displays for major TD achievements;
the rear wall holds the all-time TD leaderboard plaque.*

**Hotspots:** 16 league-tier alcoves; 3 major-achievement
displays (left); leaderboard plaque (rear); current-tier
indicator (centre, glowing in player's current league
colour).

**NPCs:** none resident.

#### 2.34.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from
   alcove seams; spreading = mycelium on trophy bases;
   corrupted = voidblack on plaque; quarantined = sealed-X.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** 16 league-tier trophies (one per
   league); 3 major TD achievement trophies; leaderboard
   plaque entries.
5. **Mystery-arc bindings:** none specific.
6. **Investigation tier:** four canonical tiers — closure
   object = a single legend-tier trophy at the gallery's
   far end (one-of-one; only displayed at league = legend).
7. **Governance modifier reactions:** `pvp_season_active`
   → all visible trophies gain a season-themed accent.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → one
   leaderboard plaque entry is overstamped indigo; on
   `grandEditActive`, the all-time leaderboard shows a
   17th tier above legend (indigo phantom).
9. **Cycle-phase lighting:** dawn 5800K on legend tier;
   long-night 5200K cool-violet on bronze tier.
10. **Faction livery:** —
11. **Tournament window:** **load-bearing** — finals lights
    the player's current-tier indicator brighter; champion-
    anointed lights all 16 tiers simultaneously.
12. **Storyteller hooks:** the 17th Tier (visible only on
    `grandEditActive` — implication: a hidden TD tier
    above legend exists in some saved-game seeds); Tier
    Plaque Engravings (each plaque carries the date player
    first achieved that tier); Phantom Trophy (one alcove
    sometimes shows a trophy the player hasn't earned —
    glitch or prophecy?). Expansion-reserved zone: the
    Founder's Trophy (sealed display at gallery entrance —
    for the player who founded the TD meta). Living-world:
    every IRL hour, the player's current-tier indicator
    pulses once.
13. **HUD overlap:** `LeaderboardPage.tsx`; `FightLeader
    boardPage.tsx`; §9 unified Trophy Gallery cross-
    reference.

#### 2.34.2 Discovery cutscene + HUD anchor

`trophy_armory_first_tier` (~8 s): player's first earned
tier alcove ignites; tier indicator at gallery centre
illuminates in tier colour; leaderboard plaque adds player
name with brass-engrave animation. HUD anchor: tier-
detail launcher fires from alcove touch.

---

### 2.35 Tower Assembly Bay (TD — tower-craft progression)

- **id:** `tower-assembly-bay` / internal `tower_assembly_bay`
- **Deck:** 4 (operations spine, sub-room of Defense
  Command Center)
- **Adjacency:** Defense Command Center (right doorway)
- **Gating:** any tower at upgrade level 2+
- **Status:** new

**Layout sentence:**
*A workshop 10 m × 6 m organised into 5 craft zones (one per
tower category — laser/missile/barrier/healing/artillery);
each zone has a brass-frame work-rig holding a tower in
progress at its current upgrade level (1–10 visual tiers);
5 ceiling-mounted assembly arms hover above the rigs;
class-locked zones (engineer, oracle, spy variants) are
identifiable by their unique brass-stamps; ambient palette
warm-amber industrial.*

**Hotspots:** 5 craft zones; 5 work-rigs (one per zone);
class-locked zone access (engineer/oracle/spy zones gated);
upgrade-progress wall (rear, shows level 1→10 tiers per
tower type).

**NPCs:** none resident.

#### 2.35.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from
   work-rig joints; spreading = mycelium on assembly arms;
   corrupted = voidblack on towers in progress; quarantined
   = sealed-X across bay.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** 20+ tower-type variants (per
   NOTES §12.8 — laser_turret, missile_launcher,
   barrier_wall, healing_pylon, artillery_cannon, tesla_coil,
   oracle_spire, shadow_trap, etc.); per-tower upgrade
   progression visible.
5. **Mystery-arc bindings:** none specific.
6. **Investigation tier:** four canonical tiers — closure
   object = a single brass plate set into the rear wall
   etched with the player's chosen "signature defence."
7. **Governance modifier reactions:** `crafting_speed_buff`
   → all 5 work-rigs glow gold; `quarantine_protocol
   _active` → bay sealed.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → one
   tower in progress shows indigo overstamp; on
   `grandEditActive`, a hidden 6th craft zone appears
   (the Architect's tower).
9. **Cycle-phase lighting:** dawn 5800K warm-amber; long-
   night 5200K cool-violet on work-rig.
10. **Faction livery:** champion-tier faction's heraldry
    on rear-wall progression display.
11. **Tournament window:** —
12. **Storyteller hooks:** the 6th Craft Zone (visible only
    on `grandEditActive` — implication: an Architect-class
    tower exists outside known TD meta); Lyra Vox's Spec
    Plates (etched into each work-rig — Lyra designed the
    original tower system); Assembly Arm Cycle (one arm
    activates every IRL hour, performing a brief solo
    assembly even with no player tower in progress).
    Expansion-reserved zone: the Sealed Tower (rear corner,
    canvas-draped — for legendary tower variants).
    Living-world: every IRL hour, one work-rig advances
    its visible build state slightly.
13. **HUD overlap:** §9 Resource Counter (tower materials);
    `PaperDollRenderer.tsx` (player paper-doll mid-assembly
    visible).

#### 2.35.2 Discovery cutscene + HUD anchor

`tower_assembly_first_upgrade` (~8 s): 5 work-rigs ignite
in sequence; assembly arms hover above the player's first
tower type; first upgrade animation plays. HUD anchor:
tower-upgrade launcher fires from work-rig touch.

---

### 2.36 Chess Hall (chess multiplayer + tournaments)

- **id:** `chess-hall` / internal `chess_hall`
- **Deck:** 5 (recreational spine)
- **Adjacency:** Social Hub (right-corridor link), Grand
  Master's Sanctum (rear arch, gated), Puzzle Study Chamber
  (left doorway)
- **Gating:** any chess game played
- **Status:** new — primary diegetic surface for Chess
  (per NOTES §12.8 — Chess has 0 Ark surface today)

**Layout sentence:**
*A grand hall 14 m × 10 m with 6 active tournament boards
mounted on brass plinths arranged in two rows of three; each
board displays a current match in 3D-rendered miniature with
piece movement live; 9 character-style backdrop alcoves ring
the hall (one per chess play-style — Architect/Enigma/Oracle/
Collector/Warlord/etc.); each backdrop holds a portrait of
the play-style's NPC and an ELO-bonus plaque; ambient palette
warm-amber wood with brass-rail accents.*

**Hotspots:** 6 tournament boards; 9 character-style
backdrops; current-match scrubber (centre rear); historical
games archive shelf (left wall); chess-clock display (front).

**NPCs:** silhouettes appear at active boards during matches.

#### 2.36.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from
   board plinth bases; spreading = mycelium on backdrop
   frames; corrupted = voidblack on board piece silhouettes;
   quarantined = sealed-X across hall.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** 6 active tournament boards;
   9 character-style portraits (one per play-style);
   historical games archive (left shelf, accumulating).
5. **Mystery-arc bindings:** none specific (chess is meta-
   progression).
6. **Investigation tier:** four canonical tiers — closure
   object = a single brass plate set into the centre rear
   etched with the player's most-played opening name.
7. **Governance modifier reactions:** `chess_tournament_
   active` → all 6 boards glow gold; `community_milestone`
   → an extra tournament board appears for 24h.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → one
   character-style portrait is overstamped indigo (the
   play-style is "edited" out); on `grandEditActive`, a
   10th character-style backdrop appears (the Antiquarian's
   forbidden style).
9. **Cycle-phase lighting:** dawn 5800K warm-amber on
   boards; long-night 5200K cool-violet on backdrops.
10. **Faction livery:** champion-tier faction's heraldry on
    centre rear.
11. **Tournament window:** **always load-bearing** —
    finals lights all 6 boards simultaneously; champion-
    anointed lights the centre rear plaque.
12. **Storyteller hooks:** the 10th Character Style
    (visible only on `grandEditActive` — the Antiquarian's
    forbidden play-style); Phantom Match (one tournament
    board occasionally shows a match with no players
    listed — implication: ghost players); Chess Clock
    Drift (the front clock occasionally drifts ahead by 1 s,
    then catches up — clue to a deeper time mechanic).
    Expansion-reserved zone: the Founder's Board (rear-
    centre, canvas-draped — for the original chess
    pioneer). Living-world: every IRL hour, one
    tournament board cycles to a new active match.
13. **HUD overlap:** `ChessBoard.tsx` + related (full chess
    UI surfaces here); `LeaderboardPage.tsx` (chess
    rankings); §3.6 Tournament notification anchor.

#### 2.36.2 Discovery cutscene + HUD anchor

`chess_hall_first_match` (~10 s): 6 tournament boards
ignite in sequence; 9 character backdrops illuminate; first
board shows the player's match. HUD anchor: chess-match
launcher fires from board touch.

---

### 2.37 Grand Master's Sanctum (top-10 ladder)

- **id:** `grand-master-sanctum` / internal
  `grand_master_sanctum`
- **Deck:** 5 (recreational spine, sub-room of Chess Hall)
- **Adjacency:** Chess Hall (rear arch)
- **Gating:** chess ELO ≥ top-10 server-wide
- **Status:** new

**Layout sentence:**
*A small private chamber 6 m × 6 m with a single ornate
chess board at its centre on a marble pedestal; 10 brass
plaques mounted around the chamber walls (one per top-10
ladder position) carry engraved player names; the ceiling is
domed with an oculus showing the night sky from the player's
home server-region; ambient lighting warm-amber from a single
overhead fixture.*

**Hotspots:** central chess board (challenge launcher); 10
plaques (one per ladder position); ceiling oculus
(decorative); challenge-history shelf (rear).

**NPCs:** none resident.

#### 2.37.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from
   pedestal base; spreading = mycelium on plaques;
   corrupted = voidblack on board pieces; quarantined =
   sealed-X across pedestal.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** 10 ladder plaques; central
   chess board (one-of-a-kind); challenge history.
5. **Mystery-arc bindings:** none.
6. **Investigation tier:** four canonical tiers — closure
   object = the player's name engraved on plaque #1
   (only displayed at ladder = #1).
7. **Governance modifier reactions:** `pvp_season_active`
   → all 10 plaques glow gold.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → one
   plaque's name is overstamped indigo; on `grandEdit
   Active`, an 11th plaque appears (the Architect's name).
9. **Cycle-phase lighting:** dawn 5800K on board; long-
   night 5200K on plaques.
10. **Faction livery:** —
11. **Tournament window:** **always load-bearing** —
    finals lights all 10 plaques simultaneously.
12. **Storyteller hooks:** the 11th Plaque (visible only on
    `grandEditActive` — the Architect ranks #11);
    Oculus Star Pattern (the night sky shows the player's
    home server-region — implication: chess ladders are
    region-locked); Engraving Wear (lower-ranked plaques
    are slightly more weathered — older players?). Expansion-
    reserved zone: the Throne (a single chair behind the
    pedestal, currently empty — for the eternal champion).
    Living-world: every IRL hour, the central board cycles
    through one famous historical match (visual only).
13. **HUD overlap:** `LeaderboardPage.tsx`; `ChessBoard.tsx`
    challenge launcher.

#### 2.37.2 Discovery cutscene + HUD anchor

`grand_master_first_entry` (~10 s): rear arch opens silently
on first top-10 ladder achievement; 10 plaques ignite in
sequence; central board's pieces arrange themselves to
"opening position." HUD anchor: champion-challenge
launcher fires from board touch.

---

### 2.38 Puzzle Study Chamber (daily puzzle)

- **id:** `puzzle-study-chamber` / internal
  `puzzle_study_chamber`
- **Deck:** 5 (recreational spine, sub-room of Chess Hall)
- **Adjacency:** Chess Hall (left doorway)
- **Gating:** any chess game played
- **Status:** new

**Layout sentence:**
*A meditative study room 5 m × 5 m with a single low chess
board on a brass-rimmed table at the room's centre; the
board displays the day's puzzle in static composition; 7
brass tutorial-gate plaques mounted on the walls (per chess
tutorial gates 0–6 from NOTES §12.8); a daily puzzle archive
shelf holds 365 brass-cased puzzle records; ambient cool-
amber light with one warm-gold spot on the central board.*

**Hotspots:** central puzzle board; 7 tutorial-gate plaques;
puzzle archive shelf (365 records); puzzle-solved indicator
(rear wall).

**NPCs:** none resident.

#### 2.38.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from
   table base; spreading = mycelium on plaques; corrupted
   = voidblack on puzzle pieces; quarantined = sealed-X
   across board.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** central puzzle board (rotates
   daily); 7 tutorial-gate plaques; 365 archive records.
5. **Mystery-arc bindings:** none.
6. **Investigation tier:** four canonical tiers — closure
   object = a single brass plate set into the table edge
   etched with "First Solved on [date]".
7. **Governance modifier reactions:** `daily_streak_milestone`
   → puzzle-solved indicator pulses gold for 24h.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → one
   archive record shows indigo overstamp on solution; on
   `grandEditActive`, the central puzzle board shifts to a
   variant solution overnight.
9. **Cycle-phase lighting:** dawn 5800K on board; long-
   night 5200K on plaques.
10. **Faction livery:** —
11. **Tournament window:** —
12. **Storyteller hooks:** the Phantom Move (the central
    board occasionally shows a piece in mid-motion — a
    move from yesterday's puzzle still in transit); the
    Unsolvable Puzzle (one archive record per year is
    marked "no recorded solution"); Tutorial Gate
    Progression (each plaque carries the date the player
    cleared that gate). Expansion-reserved zone: the
    Master's Puzzle (sealed plinth at the rear — daily-
    grandmaster puzzle, locked until tutorial gate 6
    cleared). Living-world: every IRL day at midnight UTC,
    the central board's pieces rearrange to the new daily
    puzzle (visible if the player is present at the moment).
13. **HUD overlap:** `ChessBoard.tsx` puzzle mode;
    `chessPuzzle.ts` integration.

#### 2.38.2 Discovery cutscene + HUD anchor

`puzzle_study_first_solve` (~8 s): central board pieces
animate the player's first solution; puzzle-solved
indicator illuminates; tutorial-gate-0 plaque ignites if
not yet cleared. HUD anchor: puzzle launcher fires from
board touch.

---

### 2.39 Casino Gaming Floor (chess-in-July event)

- **id:** `casino-floor` / internal `casino_floor`
- **Deck:** 5 (recreational spine)
- **Adjacency:** Chess Hall (front-archway, event-gated),
  Social Hub (rear corridor)
- **Gating:** `event_christmas_in_july_active`
- **Status:** new — event-only diegetic surface

**Layout sentence:**
*A wide casino floor 18 m × 12 m with rotating themed décor
per active seasonal event; 8 game tables arranged in a 2×4
grid (chess wagers, dice, card games, etc.); a central
stage with a live broadcast screen showing tournament
brackets; a betting-counter along the right wall with brass
chits stacked in receiving slots; a leaderboard wall along
the left holds tournament standings; ambient palette warm-
gold with neon accents per seasonal theme.*

**Hotspots:** 8 game tables (one per game type); central
stage with broadcast screen; betting counter; leaderboard
wall (left); event-token exchange kiosk (rear).

**NPCs:** dealer silhouettes at active tables;
casino-host NPC at central stage (event-gated).

#### 2.39.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from
   table felts; spreading = mycelium on chits; corrupted
   = voidblack on broadcast screen; quarantined = sealed-X
   across casino entrance (event auto-cancels).
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** brass chits (event currency);
   8 game-table outcomes; tournament leaderboard entries.
5. **Mystery-arc bindings:** none specific (event-only).
6. **Investigation tier:** four canonical tiers — closure
   object = a single brass plate set into the central stage
   etched with the player's biggest event-tournament win.
7. **Governance modifier reactions:** `event_chess_in_july
   _active` → ALL surfaces lit (room only exists/visible
   during this window); `tournament_window_finals` → central
   stage lights all 8 tables.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → one
   broadcast screen entry shows indigo overstamp; on
   `grandEditActive`, a 9th game table appears (the
   Architect's wager).
9. **Cycle-phase lighting:** ignored — casino has its own
   neon palette overriding cycle drift.
10. **Faction livery:** champion-tier faction's heraldry
    on the central stage.
11. **Tournament window:** **always load-bearing** —
    finals lights all 8 tables; champion-anointed = central
    stage gilt-edged.
12. **Storyteller hooks:** the Empty Wager (one game table
    is reserved for a "house wager" with stakes that change
    every day); Casino Host Dialogue Tree (NPC's lines
    rotate hourly with rumour content); Bracket Anomaly
    (the leaderboard occasionally shows a player who hasn't
    entered — implication: phantom contestants).
    Expansion-reserved zones: the High Stakes Room (sealed
    door at rear, requires legendary-tier achievement); the
    Founder's Booth (above the central stage, locked). The
    Casino Floor itself is a seasonal event surface and
    only exists during Christmas-in-July windows.
    Living-world: when active, every IRL hour the
    leaderboard adds 1–3 new entries.
13. **HUD overlap:** §9 unified Resource Counter (event
    tokens); `ChessBoard.tsx` (chess wagers integrate);
    `LeaderboardPage.tsx` (tournament leaderboard).

#### 2.39.2 Discovery cutscene + HUD anchor

`casino_first_open` (~10 s): event activates;
casino-floor doors swing open; 8 tables ignite; central
stage broadcast screen plays event opening fanfare (as
SFX-only per §3.1 universal direction). HUD anchor:
event-token launcher fires from exchange kiosk touch.

---

### 2.40 Governance Chamber / Council Conclave

- **id:** `governance-chamber` / internal `governance_chamber`
- **Deck:** 6 (civic spine)
- **Adjacency:** Bridge (lift descent), Daily Resource
  Allocation Board (left doorway), Faction Succession
  Monument (right doorway)
- **Gating:** `narrative_flag_governance_unlocked` (typically
  Act 2+)
- **Status:** new — primary diegetic surface for Governance
  (per NOTES §12.8 — Governance has 0 dedicated Ark surface)

**Layout sentence:**
*A large semicircular chamber 12 m radius with a domed
ceiling; a brass-projection floor displays the active vote's
question and options as scrolling text that wraps the
chamber perimeter at eye-level; the centre of the floor is
a sigil-circle containing a 3D holographic representation of
the live vote tally; a raised lectern at the chamber's straight-
edge holds the Antiquarian's chronicle (open to the current
vote's narrative context); a monument wall along the curved
edge etches every past vote's outcome (accumulating over the
save's lifetime); ambient palette neutral-white with warm-
amber accents.*

**Hotspots:** central tally sigil-circle; perimeter
scrolling-text band (active vote question/options); rear
lectern with Antiquarian chronicle; monument wall (left
curve, past vote outcomes); player vote-cast pillar (right
of lectern).

**NPCs:** Antiquarian silhouette at the lectern (always
visible during open vote); Adjudicator Locke at trade-related
votes.

#### 2.40.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from
   sigil-circle edges; spreading = mycelium on lectern;
   corrupted = scrolling text turns voidblack; quarantined
   = sealed-X across chamber.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** Antiquarian chronicle (lectern,
   accumulating); monument wall plates (1 per past vote);
   vote-cast pillar (player tool).
5. **Mystery-arc bindings:** the Degen E2, E3, E4, E5 (the
   audit-related votes surface here — Coda Purpose Brief,
   audit-prep note, letter to the saga); Game Master E2, E4
   (Velkraal's correspondence folio votes surface here).
6. **Investigation tier:** four canonical tiers — closure
   object = a single bound brass codex on the lectern
   titled "The Chronicle of Witness, [date]".
7. **Governance modifier reactions:** **always load-bearing**
   — chamber's primary purpose is governance; every vote
   open/closed/outcome shows in real-time.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → one
   monument plate is overstamped indigo (a vote outcome
   "edited"); on `grandEditActive`, the central tally
   sigil-circle shows alternate outcomes flickering
   simultaneously.
9. **Cycle-phase lighting:** dawn 5800K warm-amber on
   sigil-circle; long-night 5200K cool-violet on monument
   wall.
10. **Faction livery:** champion-tier faction's heraldry
    on the lectern; 5-faction banners flank the chamber
    entrance.
11. **Tournament window:** —
12. **Storyteller hooks:** the Empty Plate (one slot on the
    monument wall is always blank — reserved for "the vote
    that should never have happened"); Antiquarian's
    Personal Note (lectern's lower drawer holds the
    Antiquarian's marginalia on each vote — readable at
    trust ≥80); Vote Pillar Echo (player's voice when
    casting a vote echoes faintly through the chamber for
    24h after). Expansion-reserved zone: the High Court
    (sealed door behind the lectern — for the
    Adjudicator's tribunal, post-Act-5). Living-world:
    every IRL hour, the perimeter scrolling text cycles
    once around the chamber.
13. **HUD overlap:** `GovernanceHubPage.tsx` (full
    governance UI surfaces here); §3.6 Governance
    notification anchor; `MobileNarratorSlot.tsx`
    (Antiquarian voice surfaces).

#### 2.40.2 Discovery cutscene + HUD anchor

`governance_first_vote` (~12 s): Bridge lift descends;
chamber's sigil-circle ignites with first vote tally;
perimeter text scrolls into view; Antiquarian appears at
lectern. HUD anchor: vote-cast launcher fires from pillar
touch.

---

### 2.41 Daily Resource Allocation Board

- **id:** `daily-resource-board` / internal
  `daily_resource_board`
- **Deck:** 6 (civic spine, sub-room of Governance Chamber)
- **Adjacency:** Governance Chamber (left doorway)
- **Gating:** governance unlocked
- **Status:** new — daily-vote diegetic surface (per NOTES
  §12.8)

**Layout sentence:**
*A small chamber 5 m × 4 m with a wall-spanning brass display
showing the day's resource-allocation question (e.g.,
"Shields vs Scanners") and two large vote options as etched
brass plates at eye-level; a 24h countdown brass dial above
the question shows time remaining; a real-time vote
distribution bar (50/50 default) fills the lower portion of
the display; floor inlay shows two paths (one to each option)
where players walk to cast.*

**Hotspots:** wall display (question + 2 options); 24h
countdown dial; vote distribution bar; 2 floor-path vote
endpoints.

**NPCs:** none resident; ambient crew silhouettes vote.

#### 2.41.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from
   display seams; spreading = mycelium on countdown dial;
   corrupted = display flickers voidblack; quarantined =
   sealed-X across both vote paths.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** daily-vote outcomes (visible on
   day's display); player's vote history (small plaque,
   right wall, accumulating).
5. **Mystery-arc bindings:** none specific.
6. **Investigation tier:** four canonical tiers — closure
   object = a single brass plate set into the wall
   etched with the player's longest daily-vote streak.
7. **Governance modifier reactions:** **always load-bearing**.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → one
   vote option's text is overstamped indigo; on
   `grandEditActive`, a third unmarked option appears.
9. **Cycle-phase lighting:** dawn 5800K on display; long-
   night 5200K on countdown dial.
10. **Faction livery:** —
11. **Tournament window:** —
12. **Storyteller hooks:** the Hidden Third Option
    (visible only on `grandEditActive` — implication:
    Shadow Tongue can introduce unsanctioned alternatives);
    Vote Distribution Anomaly (the bar occasionally shows a
    distribution that doesn't match the actual votes —
    glitch or manipulation?); Floor Path Wear (the more-
    voted path is slightly more worn over time). Expansion-
    reserved zone: the Sealed Vote (rear of the chamber —
    for "the daily vote that has no answer"). Living-world:
    every IRL hour, the vote distribution updates visibly;
    at IRL midnight UTC, the question rotates to the new
    day's resource pair (visible if player is present).
13. **HUD overlap:** `GovernanceHubPage.tsx` (daily vote
    quick-cast); §3.6 Governance daily-vote notification.

#### 2.41.2 Discovery cutscene + HUD anchor

`daily_resource_first_cast` (~6 s): wall display ignites
with first day's question; countdown dial begins ticking;
floor paths illuminate. HUD anchor: vote-cast launcher
fires from floor-path endpoints.

---

### 2.42 Faction Succession Monument

- **id:** `faction-succession-monument` / internal
  `faction_succession_monument`
- **Deck:** 6 (civic spine, sub-room of Governance Chamber)
- **Adjacency:** Governance Chamber (right doorway)
- **Gating:** governance unlocked
- **Status:** new — annual-vote diegetic surface

**Layout sentence:**
*A small monument chamber 6 m × 5 m with 5 faction-leader
heraldry pylons (one per faction) arranged in a fan; each
pylon's banner shows the current year's faction-leader sigil
or "PENDING" if mid-vote; a central monument plinth holds an
etched chronicle of every past faction succession; ambient
palette cool-amber with each pylon's accent matching its
faction colour (Insurgency amber, New Babylon cerulean,
Hierarchy red, Architect Remnants grey, Dreamers Children
violet).*

**Hotspots:** 5 faction-leader pylons; central monument
plinth (chronicle); succession-history scroll (rear wall).

**NPCs:** ambient faction-rep silhouettes appear during
active vote.

#### 2.42.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from
   pylon bases; spreading = mycelium on plinth; corrupted
   = voidblack on banners; quarantined = sealed-X.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** 5 faction-leader heraldry banners
   (current year); monument plinth chronicle (accumulating);
   succession-history scroll.
5. **Mystery-arc bindings:** Wraith Calder cross-reference
   (Hierophant ceremony succession may surface here at
   trust-100).
6. **Investigation tier:** four canonical tiers — closure
   object = a single brass plate at the chamber centre
   etched with the player's chosen faction's current leader.
7. **Governance modifier reactions:** **always load-bearing**
   — annual succession votes resolve here.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → one
   faction's leader sigil is overstamped indigo (the
   succession is "edited"); on `grandEditActive`, a 6th
   faction pylon appears momentarily.
9. **Cycle-phase lighting:** dawn 5800K on pylons; long-
   night 5200K on plinth.
10. **Faction livery:** **always load-bearing** — every
    faction's banner reflects its succession state.
11. **Tournament window:** —
12. **Storyteller hooks:** the 6th Faction Pylon (visible
    only on `grandEditActive` — clue to a future faction
    emergence); Succession Chronicle Engravings (each entry
    carries a year and a single-line summary of the
    ascendant leader's first action); Pending State Glow
    (during active succession vote, the affected pylon's
    banner glows brighter). Expansion-reserved zone: the
    Anti-Throne (sealed alcove behind the central plinth —
    for "the faction that refuses succession"). Living-
    world: every IRL hour, one of the 5 pylons subtly
    re-furls its banner matching the most-recent
    faction-standing change.
13. **HUD overlap:** §9 Resource Counter (faction
    standing); `GovernanceHubPage.tsx` (annual vote UI);
    §3.6 Faction Succession notification anchor.

#### 2.42.2 Discovery cutscene + HUD anchor

`faction_succession_first_view` (~10 s): 5 pylons ignite in
sequence (in faction-rotation order); central plinth's
chronicle illuminates with current year's entry. HUD anchor:
annual-vote launcher fires from pylon touch.

---

### 2.43 Oracle's Sanctum (Annual — annual oracle-question vote)

- **id:** `oracle-annual-sanctum` / internal
  `oracle_annual_sanctum`
- **Deck:** 6 (civic spine)
- **Adjacency:** Oracle Sanctum §2.18 (rear-pocket portal,
  one-time annual transition)
- **Gating:** `event_annual_oracle_question_active`
- **Status:** new — annual-event diegetic surface, exists
  only during the annual oracle-question vote window

**Layout sentence:**
*An ethereal chamber 8 m diameter with no visible walls —
the perimeter is mist; a single floating oracle-stone hovers
at chamber centre at chest height, etched with the year's
oracle question in living script; 4 voting petals float at
compass positions, one per option; the floor is unmarked
black void with a faint star-pattern; ambient palette cool-
violet with one warm-gold pinpoint at the oracle-stone.*

**Hotspots:** central oracle-stone (question display); 4
floating voting petals (one per option); the void floor
(decorative, accepts gold soul stones for Dreamer
offering).

**NPCs:** the Seer's posthumous voice surfaces here during
the annual window (if Seer arc completed).

#### 2.43.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from
   void-floor; spreading = mycelium on petals; corrupted =
   oracle-stone turns voidblack; quarantined = sealed-X
   across chamber (room collapses).
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** oracle-stone (annual question);
   4 voting petals; gold soul stones (offering).
5. **Mystery-arc bindings:** the Seer arc (cross-reference
   — annual question is curated by Seer's posthumous archive).
6. **Investigation tier:** four canonical tiers — closure
   object = a single bronze plate hovering above the void
   etched with the player's chosen annual answer.
7. **Governance modifier reactions:** **always load-bearing**
   — annual oracle-question vote resolves here.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → one
   voting petal's text is overstamped indigo (the option is
   "edited"); on `grandEditActive`, a 5th petal appears
   (the unsanctioned oracle answer).
9. **Cycle-phase lighting:** standard ±300K drift, but the
   warm-gold pinpoint on oracle-stone is constant.
10. **Faction livery:** —
11. **Tournament window:** —
12. **Storyteller hooks:** the 5th Petal (visible only on
    `grandEditActive`); Star-Pattern Floor (the void floor's
    star pattern matches the constellation of the player's
    chosen affinity); Question Echo (the year's question
    can be heard whispered by the Seer's voice if player
    stands still for 30 s). Expansion-reserved zone: the
    Sealed Question (rear of chamber, behind oracle-stone
    — the unanswered prophecy). Living-world: when active,
    the oracle-stone's living script shifts subtly every
    hour as new translations of the question reveal.
13. **HUD overlap:** `GovernanceHubPage.tsx` (annual oracle-
    question UI); §3.6 Governance notification.

#### 2.43.2 Discovery cutscene + HUD anchor

`oracle_annual_first_open` (~12 s): pocket portal opens from
Oracle Sanctum §2.18 (one-time annual transition); player
descends; oracle-stone illuminates with year's question; 4
voting petals materialise in compass positions. HUD anchor:
oracle-vote launcher fires from petal touch.

---

### 2.44 Epoch Witness Conclave / Archive

- **id:** `epoch-witness-conclave` / internal
  `epoch_witness_conclave`
- **Deck:** 7 (epoch spine)
- **Adjacency:** Antiquarian's Library (rear pocket portal),
  Nexus Point Sanctum (left doorway), Prophecy Wall (right
  doorway)
- **Gating:** `narrative_flag_epoch_witness_unlocked` (typ. Act 3+)
- **Status:** new — primary diegetic surface for Epoch
  Witness (per NOTES §12.8 — 0 Ark surface today)

**Layout sentence:**
*A long archive chamber 16 m × 6 m with a 5-epoch timeline
embedded in the floor as a brass inlay (Privacy → Prophecy →
Insurgency → Revelation → Fall of Reality); the active epoch
glows brighter than the others; a vertical ShadowTongue power
meter (0–100) is mounted on the rear wall as an indigo-glass
column that fills with indigo liquid as power rises; 7
archetype-gate plaques line the left wall (one per WATCHER /
INVENTOR / ADVOCATE / SEER / PROGRAMMER / POLITICIAN / WITNESS
gate); the player's voting history is etched into the right
wall as a chronicle of choices.*

**Hotspots:** 5-epoch timeline floor inlay; ShadowTongue power
meter (rear wall); 7 archetype-gate plaques (left wall); voting
history chronicle (right wall); vote-cast pulpit (centre).

**NPCs:** Antiquarian silhouette may surface at the chronicle
side; the Watcher entity may surface at the rear (`grandEdit
Active` only).

#### 2.44.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from
   timeline edges; spreading = mycelium on archetype plaques;
   corrupted = ShadowTongue meter overflows; quarantined =
   sealed-X across timeline.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** 5-epoch timeline; ShadowTongue
   meter; 7 archetype gates; voting history chronicle (one
   entry per past epoch vote).
5. **Mystery-arc bindings:** the Seer arc (cross-reference —
   Seer's prophecies are chronicled here); Wraith Calder
   E5 (Prophet identity surfaces in the chronicle at trust-
   100).
6. **Investigation tier:** four canonical tiers — closure
   object = a single bound brass codex on the chronicle
   wall titled "The Witness's Final Edit, [date]".
7. **Governance modifier reactions:** **always load-bearing**
   — epoch votes resolve here.
8. **Epoch / ShadowTongue:** **PRIMARY DIEGETIC SURFACE FOR
   EPOCH WITNESS.** ShadowTongue meter is the chamber's
   centrepiece; rises and falls with global power. On
   `grandEditActive`, the entire chamber is overstamped
   indigo and the Watcher silhouette is visible at the rear.
9. **Cycle-phase lighting:** dawn 5800K warm-amber on
   timeline; long-night 5200K cool-violet on meter.
10. **Faction livery:** champion-tier faction's heraldry
    on chronicle.
11. **Tournament window:** —
12. **Storyteller hooks:** the 6th Epoch (visible only on
    `grandEditActive` — the unnamed epoch beyond Fall of
    Reality); Archetype Gate Activation (each plaque carries
    the date the player first met that gate's requirement);
    ShadowTongue Power Pulse (the meter fluctuates ±2 over
    24h cycles independent of vote cadence — implication:
    the Tongue has a circadian rhythm). Expansion-reserved
    zone: the Sealed Epoch (rear-corner alcove — for the
    epoch the player has not yet witnessed). Living-world:
    every IRL hour, the active-epoch glyph on the timeline
    pulses brighter once.
13. **HUD overlap:** `GovernanceHubPage.tsx` (epoch vote UI);
    §3.6 Epoch notification anchor; `MobileNarratorSlot.
    tsx` (Antiquarian voice).

#### 2.44.2 Discovery cutscene + HUD anchor

`epoch_witness_first_entry` (~12 s): Antiquarian's Library
rear-portal opens; player descends; 5-epoch timeline ignites
in sequence; ShadowTongue meter shows current power; 7
archetype plaques light if requirements met. HUD anchor:
epoch-vote launcher fires from central pulpit.

---

### 2.45 Nexus Point Sanctum

- **id:** `nexus-point-sanctum` / internal
  `nexus_point_sanctum`
- **Deck:** 7 (epoch spine, sub-room of Epoch Witness Conclave)
- **Adjacency:** Epoch Witness Conclave (left doorway)
- **Gating:** any epoch active
- **Status:** new — epoch-locus aesthetic surface

**Layout sentence:**
*An ethereal chamber 7 m diameter with the per-epoch
aesthetic transformation — the chamber's walls, floor, and
ceiling are made of the active epoch's signature material
(Privacy = pre-Fall pearl-marble; Prophecy = scribed obsidian;
Insurgency = scarred bronze; Revelation = clear quartz; Fall
of Reality = void-touched basalt); a single nexus-point
sigil hovers at chamber centre as a holographic 3D glyph;
ambient palette per active epoch (cool-violet for late
epochs, warm-amber for early).*

**Hotspots:** central nexus-point sigil; chamber walls (per-
epoch material); epoch-transition trigger plinth (rear,
fires `cs_epoch_close` cutscenes when an epoch closer vote
resolves).

**NPCs:** none resident.

#### 2.45.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from
   sigil; spreading = mycelium on walls; corrupted = sigil
   turns voidblack; quarantined = sealed-X.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** central nexus-point sigil
   (unique per-epoch); per-epoch material aesthetic.
5. **Mystery-arc bindings:** none specific.
6. **Investigation tier:** four canonical tiers — closure
   object = a single brass plate set into the floor at
   chamber centre etched with the player's chosen final
   epoch.
7. **Governance modifier reactions:** epoch closer-vote
   trigger fires `cs_epoch_close` cutscene from the rear
   plinth (single 8-s cutscene, SFX-only per §3.1
   universal direction).
8. **Epoch / ShadowTongue:** **PRIMARY EPOCH AESTHETIC
   SURFACE.** Material transition between epochs is the
   chamber's purpose. On `grandEditActive`, the chamber's
   material flickers between current epoch and an unknown
   6th aesthetic.
9. **Cycle-phase lighting:** standard ±300K but per-epoch
   palette overrides.
10. **Faction livery:** —
11. **Tournament window:** —
12. **Storyteller hooks:** the 6th Material (visible only
    on `grandEditActive` — the unknown post-Fall aesthetic);
    Epoch-Transition Echo (when an epoch closes, the
    chamber's previous material remains as a faint ghost-
    image for 24h after); Sigil Slow-Spin (the central
    sigil rotates 1° per IRL hour, completing one rotation
    per 360h ≈ 15d). Expansion-reserved zone: the Anti-
    Sigil (sealed glyph behind the rear plinth — for "the
    nexus that should never have been"). Living-world: the
    chamber's ambient material slowly weathers over the
    course of an epoch; weathering resets at epoch close.
13. **HUD overlap:** `GovernanceHubPage.tsx` (epoch close
    cutscene); §3.6 Epoch notification.

#### 2.45.2 Discovery cutscene + HUD anchor

`nexus_first_visit` (~10 s): Epoch Witness Conclave
left-doorway opens; chamber materialises with current
epoch's aesthetic; central sigil hovers into place. HUD
anchor: epoch-close cutscene launcher fires from rear
plinth on closer-vote resolution.

---

### 2.46 Prophecy Wall

- **id:** `prophecy-wall` / internal `prophecy_wall`
- **Deck:** 7 (epoch spine, sub-room of Epoch Witness Conclave)
- **Adjacency:** Epoch Witness Conclave (right doorway)
- **Gating:** any epoch vote completed
- **Status:** new — Antiquarian inscription surface

**Layout sentence:**
*A long inscription chamber 14 m × 4 m with a single
continuous wall (left side) etched with the Antiquarian's
inscriptions for every past epoch vote; inscriptions are in
brass-on-obsidian, accumulating in chronological order from
left to right; the right wall is a mirror — same width,
reflective brass — showing the inscriptions in reverse, but
each reflection carries one extra word that's not on the
inscription itself (an Antiquarian-marginalia easter egg);
the chamber's far end has a small reading bench with a
single brass quill.*

**Hotspots:** continuous inscription wall (left); reflective
brass wall (right); reading bench with quill (far end);
fresh-inscription block (left wall, near entrance — appears
when a new vote outcome is freshly inscribed).

**NPCs:** Antiquarian silhouette appears at the bench
during active vote-outcome inscription.

#### 2.46.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from
   bench; spreading = mycelium on inscription wall;
   corrupted = mirror reflections turn voidblack;
   quarantined = sealed-X across both walls.
2. **Demon-summoning surface:** —
3. **CADES:** —
4. **Story items (§3.5):** inscription wall (1 per past
   vote); mirror-marginalia (Antiquarian extras); reading
   bench quill (player tool — can read aloud).
5. **Mystery-arc bindings:** none specific.
6. **Investigation tier:** four canonical tiers — closure
   object = a single brass plate set into the bench etched
   with the player's most-quoted Antiquarian line.
7. **Governance modifier reactions:** new vote outcome →
   fresh-inscription block animates etching for 6 s on
   first entry.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → one
   inscription is overstamped indigo (the Antiquarian's
   line is "edited"); on `grandEditActive`, the mirror
   shows inscriptions in plain text instead of mirror-
   reflected (revelation moment).
9. **Cycle-phase lighting:** dawn 5800K warm-amber on
   inscription wall; long-night 5200K cool-violet on
   mirror.
10. **Faction livery:** —
11. **Tournament window:** —
12. **Storyteller hooks:** the Mirror Marginalia (every
    reflection carries one extra word — implication: the
    Antiquarian writes a hidden second draft); the Quill
    Drift (the brass quill on the bench is occasionally
    in a slightly different position than where the player
    last left it); the First Inscription (the leftmost
    entry on the wall is dated centuries before the
    player woke). Expansion-reserved zone: the Future
    Wall (the entire right wall beyond the mirror is
    blank — reserved for inscriptions yet to come).
    Living-world: every IRL hour, the brass quill on the
    bench shifts position by ~1 cm (no visible hand).
13. **HUD overlap:** `MobileNarratorSlot.tsx` (Antiquarian
    voice surfaces); §9 Loredex Viewer (cross-reference to
    inscription content).

#### 2.46.2 Discovery cutscene + HUD anchor

`prophecy_first_inscription` (~10 s): Conclave right-doorway
opens; left wall ignites with all past inscriptions in
sequence (left-to-right); mirror brightens to show
reflections. HUD anchor: read-aloud launcher fires from
quill touch.

---

### 2.47 CADES Console / Mission Briefing Pod (Med Bay annex)

- **id:** `cades-console` / internal `cades_console`
- **Deck:** 1 (Med Bay annex; sub-room of §2.2 Medical Bay)
- **Adjacency:** Medical Bay restricted section (single doorway)
- **Gating:** `cades_unlocked` AND `medbay_restricted_section_unlocked`
- **Status:** new — CADES diegetic surface (per NOTES §9.3
  + §3.1.4 cutscene reference)

**Layout sentence:**
*A small clinical pod 4 m × 4 m with a violet-helmet console
chair at its centre (per §3.9.1 Resonance Pedestal cross-
reference); 7 mission-progress plaques mounted on the rear
wall (one per CADES mission M1–M7), each plaque carries the
mission's image-fragment from the helmet's interior surface;
an Iron Lion helmet hologram hovers above the chair when not
in use; an async PvP lobby panel on the left wall shows
opponent-match queue; ambient palette cool-violet with the
helmet hologram as the only warm-amber light source.*

**Hotspots:** violet-helmet console chair (mission launcher);
7 mission-progress plaques (rear wall); Iron Lion helmet
hologram (ceiling); async PvP lobby panel (left wall);
post-credit shrine alcove (right wall, post-M7 only).

**NPCs:** Iron Lion silhouette in hologram form (always
visible above chair pre-M7); Agent Zero silhouette appears
in the post-credit shrine alcove post-M7.

#### 2.47.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from
   chair seams; spreading = mycelium on plaques; corrupted
   = helmet hologram flickers voidblack; quarantined =
   sealed-X across chair.
2. **Demon-summoning surface:** —
3. **CADES presence:** **PRIMARY DIEGETIC SURFACE.** All 7
   missions launch from the chair; helmet captures one
   image-fragment per mission (visible on the corresponding
   rear-wall plaque after completion).
4. **Story items (§3.5):** violet helmet (chair-mounted);
   7 image-fragment plaques; Iron Lion helmet hologram;
   Dischordia card (post-M7 — appears on the post-credit
   shrine).
5. **Mystery-arc bindings:** Jericho Jones cross-reference
   (Iron Lion helmet hologram); the Seer arc cross-
   reference (helmet captures may carry Seer prophecy
   echoes at trust-100).
6. **Investigation tier:** four canonical tiers — closure
   object = the post-credit shrine itself, with Dischordia
   card and Engineer's silhouette (post-M7).
7. **Governance modifier reactions:** `cades_priority_buff`
   → all 7 plaques glow gold; `quarantine_protocol_active`
   → chair sealed.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → one
   captured image-fragment is overstamped indigo (the
   mission outcome is "edited"); on `grandEditActive`, an
   8th plaque appears (the unsanctioned mission).
9. **Cycle-phase lighting:** standard ±300K but the
   helmet hologram is constant.
10. **Faction livery:** Iron Lions allied = the helmet
    hologram is gilt-edged; Hierarchy-allied = a small
    Hierarchy seal on the chair base.
11. **Tournament window:** —
12. **Storyteller hooks:** the 8th Mission (visible only on
    `grandEditActive` — implication: a CADES mission was
    erased from history); Helmet Hologram Dialogue (the
    Iron Lion silhouette occasionally mouths words during
    pre-mission idle — readable on close inspection at
    trust-Jericho-≥80); Post-Credit Engineer Silhouette
    (post-M7, the silhouette has a single posture detail
    that changes per IRL day — narrative writers can
    expand). Expansion-reserved zone: the Sealed M0
    Mission (a tiny plaque to the left of the M1 plaque,
    canvas-draped — for "the mission before the missions").
    Living-world: every IRL hour, the helmet hologram
    rotates 30° clockwise.
13. **HUD overlap:** §9 unified Replay Scrubber diegetic
    anchor (CADES mission replays); `LeaderboardPage.tsx`
    (CADES async PvP); §3.1.4 cutscene `cs_breaking_point`
    references this room.

#### 2.47.2 Discovery cutscene + HUD anchor

`cades_first_chair` (~12 s): restricted-section door
opens; chair ignites with violet helmet visible; Iron Lion
helmet hologram materialises above; 7 plaques light dimly
(all unfilled). HUD anchor: mission-launch fires from
chair-helmet touch.

---

### 2.48 Eidolon Sanctum / Bond Chamber (Soul Stones home)

- **id:** `eidolon-sanctum` / internal `eidolon_sanctum`
- **Deck:** pocket (rear of Pet Garden)
- **Adjacency:** Pet Garden (rear-corridor link)
- **Gating:** any Eidolon bonded
- **Status:** new — Eidolon Bond diegetic surface (per NOTES
  §12.8 — `soulStonesRouter` exists, no Ark surface)

**Layout sentence:**
*A small private sanctum 6 m × 5 m with a single bond-altar
at its centre; the altar holds the player's bonded Eidolon
visible as a translucent companion silhouette (rendering
their current stage — fragment, companion, ascended, or
spectral); 4 stage-progression alcoves around the altar
(one per stage) display the Eidolon's appearance at each
stage; bond-XP indicator above the altar shows current
progress; ambient palette cool-amber with one warm-gold spot
on the altar.*

**Hotspots:** central bond-altar; 4 stage-progression
alcoves; bond-XP indicator (overhead); Eidolon-feed bowl
(left, accepts soul stones for bond growth).

**NPCs:** the bonded Eidolon itself (silhouette at altar).

#### 2.48.1 Back-fill grid

1. **TV infection:** clean = none; exposed = wisps from
   altar base; spreading = mycelium on alcoves; corrupted
   = Eidolon silhouette turns voidblack; quarantined =
   sealed-X.
2. **Demon-summoning surface:** Eidolon Bond ≠ demon
   summoning (Eidolons are bonded companions, not summoned
   demons). Soul stones may be offered here (alternate to
   the Resonance Pedestal §3.9.1 / Corruption Circle
   §3.9.2) — Eidolon-offering DOES NOT purify or corrupt,
   instead grows bond-XP.
3. **CADES:** —
4. **Story items (§3.5):** bonded Eidolon (silhouette);
   4 stage-progression renderings; soul stones (offerings);
   bond-XP indicator.
5. **Mystery-arc bindings:** none specific (Eidolons are
   meta-progression).
6. **Investigation tier:** four canonical tiers — closure
   object = a single brass plate set into the altar
   etched with the Eidolon's chosen name + stage.
7. **Governance modifier reactions:** `eidolon_bond_speed_
   buff` → bond-XP indicator pulses faster; `quarantine_
   protocol_active` → altar sealed.
8. **Epoch / ShadowTongue:** ShadowTongue power ≥40 → one
   stage-progression alcove is overstamped indigo (the
   stage is "edited" out of memory); on `grandEditActive`,
   a 5th alcove appears (the unknown post-spectral stage).
9. **Cycle-phase lighting:** dawn 5800K on altar; long-
   night 5200K cool-violet on alcoves.
10. **Faction livery:** —
11. **Tournament window:** —
12. **Storyteller hooks:** the 5th Stage (visible only on
    `grandEditActive` — what comes after spectral?); the
    Empty Alcove (one alcove is reserved blank for "the
    Eidolon that refuses to bond"); Bond-Altar Pulse (the
    altar pulses warm-gold once per IRL day at the
    Eidolon's "true name day"). Expansion-reserved zone:
    the Multi-Eidolon Sanctum (sealed door behind the
    altar — for the player who bonds multiple Eidolons).
    Living-world: every IRL hour, the bonded Eidolon's
    silhouette shifts slightly (subtle posture changes).
13. **HUD overlap:** `SoulStonesPanel.tsx` (Eidolon-bond
    inventory); §3.9 Soul Stones cross-reference.

#### 2.48.2 Discovery cutscene + HUD anchor

`eidolon_first_bond` (~10 s): Pet Garden rear-corridor
opens; chamber materialises; central altar ignites with
Eidolon silhouette; 4 stage-progression alcoves light in
sequence. HUD anchor: bond launcher fires from altar-touch.

---

### 2.49 Prelude rooms (Corridor / Galley / Briefing Room / Mess Hall)

- **id:** `prelude-corridor` / `prelude-galley` /
  `prelude-briefing` / `prelude-mess`
- **Deck:** prelude (existing only during pre-launch
  Awakening sequence)
- **Adjacency:** linear sequence — Corridor → Galley →
  Briefing Room → Mess Hall → terminal at Cryo Bay (Act 0)
- **Gating:** prelude flow (cleared on `awakening_complete`)
- **Status:** new — these rooms only exist in the prelude
  flow before the player awakens; once cleared, they are
  inaccessible (re-visitable only in flashback/replay)

**Layout sentence (universal):**
*Four short rooms in linear sequence, each 4 m × 4 m,
representing pre-launch crew memory snapshots; each carries
ONE focal object indicating its purpose (Corridor =
embarkation manifest poster; Galley = a single set table
for the inaugural meal; Briefing Room = a slide projector
mid-presentation; Mess Hall = an active conversation
captured in mid-gesture among crew silhouettes); ambient
palette warm-amber daylight (pre-launch), grading cooler
each room as the player progresses (foreshadowing the cold
of cryo).*

**Hotspots (per room):**
- Corridor: embarkation manifest (lists all crew, including
  the player's chosen character as one of N) + Anniversary
  Plaque rack early-state (pristine, all 12 plaques blank)
- Galley: inaugural meal set-table (8 chairs, 8 settings,
  one chair pulled out — the player's)
- Briefing Room: slide projector (cycles 5 mission-brief
  slides on entry — narrative beats)
- Mess Hall: 4 crew silhouettes mid-gesture (Lyra Vox,
  Captain, Engineer, Antiquarian — the player has just
  joined)

**NPCs:** crew silhouettes in Briefing Room + Mess Hall
(Lyra Vox visible in Mess Hall as the most-detailed silhouette).

#### 2.49.1 Back-fill grid (prelude rooms — minimal axis applicability)

1. **TV infection:** N/A — pre-launch, before contamination.
2. **Demon-summoning surface:** N/A.
3. **CADES:** N/A.
4. **Story items (§3.5):** embarkation manifest (Corridor);
   inaugural meal table (Galley); 5 briefing slides
   (Briefing Room); 4 crew silhouettes (Mess Hall —
   includes the canonical pre-cryo Lyra Vox).
5. **Mystery-arc bindings:** all 6 NPC arcs cross-reference
   pre-launch (the silhouettes in Mess Hall are the future
   NPCs — Vex Solène, the Engineer, the Antiquarian, Lyra
   Vox; clue: their poses foreshadow their later arcs).
6. **Investigation tier:** N/A — prelude is pre-investigation.
7. **Governance modifier reactions:** N/A.
8. **Epoch / ShadowTongue:** N/A — pre-Tongue.
9. **Cycle-phase lighting:** dawn warm-amber, grading cooler
   each subsequent room (Corridor warmest, Mess Hall
   coolest).
10. **Faction livery:** N/A — pre-faction.
11. **Tournament window:** N/A.
12. **Storyteller hooks:** the Manifest Names (every name on
    the Corridor manifest is a future loredex entry — clue
    to which crew survive cryo and which don't); the
    Player's Chair (Galley's pulled-out chair — no other
    chair is pulled; implication: the player's awareness
    began here); the 5 Briefing Slides (each is a single-
    line mission brief — narrative writers can expand any
    of the 5); the Mid-Gesture Conversation (Mess Hall's
    crew silhouettes are frozen mid-conversation; reading
    their lip-shapes at trust-Antiquarian-100 reveals what
    they were saying). Expansion-reserved zone: the Sealed
    5th Room (canvas-draped, behind Mess Hall — "the room
    the player was not allowed in"). Living-world: prelude
    is fixed; no slow ticks (the past doesn't change).
13. **HUD overlap:** `OpeningCinematic.tsx` (prelude is the
    boot sequence's diegetic surface); `MobileNarratorSlot
    .tsx` (Elara doesn't surface here — she awakens in
    Cryo Bay; the player is alone with the silhouettes).

#### 2.49.2 Discovery cutscene + HUD anchor

`prelude_first_walk` (~30 s — the entire prelude is the
discovery cutscene; SFX-only per §3.1 universal direction):
4 rooms walk through in sequence; manifest reads;
inaugural meal frozen; briefing slides cycle; mess hall
silhouettes mid-gesture; door at far end of Mess Hall opens
into Cryo Bay; player enters their pod. HUD anchor: prelude
exits to Cryo Bay (§2.1) with no further launchers.

---

## 3. Unbuilt-system production specs

The Phase-1.5 audit (NOTES §12.7) flagged 5 partial and 3
scaffolded systems plus the 5 named cutscenes. This chapter
specifies the **art-direction and diegetic surfaces** for each
so renders are ready when the runtime catches up. Where a
runtime contract is needed, it is named (schema column,
trigger, expected payload). No code is written here.

§3.5 is reserved for the **Story Item Registry** (authored from
NOTES §11). All other §3.x sections are authored below.

---

### 3.1 Cinematic cutscenes (5 named)

`docs/design/ANIMATED_CUTSCENES.md` names five cutscenes that
are not yet implemented as components. The five are authored
below using the **start/end frame stitch technique**: each shot
has a deterministic `start frame` and `end frame`; the **end
frame of shot N is the start frame of shot N+1**, so a Veo-3.1
or equivalent motion-interp pass can fill the in-between
without seams.

**Universal direction.**
- **No music.** Music ruins SFX-driven tension and leaves no
  room for the player's own emotional cadence.
- **At most one short VO sentence per cutscene** — placement is
  named per scene. Often zero.
- **SFX-driven.** Diegetic sounds only (mechanical, organic,
  environmental). No swells, no synth pads, no foley exaggera-
  tion. Less is more.
- **Aspect:** 16:9 master; safe-area for 4:3 mobile crop.
- **Master Style Lock applies** (§1.1): same hull palette,
  same lens treatment, same negative-prompt discipline as the
  rooms the cutscene takes place in.
- **Frame-stitch contract.** Each shot's end frame is described
  in enough specificity that the next shot's start frame is the
  identical composition. Camera moves between shots are
  generated as in-betweens by the motion-interp pass; the doc
  describes the two endpoints, not the interpolation.

#### 3.1.1 Cutscene — `cs_awakening`

**Trigger:** First boot of new save / Prelude beat A.
**Length:** ~45 s. **Shots:** 6. **VO:** 1 line (Elara, end of
shot 6). **SFX track:** glass-crack hairline → pod release hiss
→ footfall on metal grate (single step) → distant deck hum
holding the room.

| # | start frame | end frame | duration | note |
|---|---|---|---|---|
| 1 | Frost-occluded interior of cryo pod; vague human silhouette behind glass; cold-blue ambient. | Same composition; one hairline fracture appears at the upper-left edge of the glass plate. | 7 s | Hold-then-crack. SFX: single glass-crack tick. |
| 2 | (same as shot-1 end) Hairline fracture at upper-left of pod glass. | Wide pull from outside the pod: full Cryo Bay row visible; player's pod centre-frame, lit faintly; Pod Zero in mid-ground, cold-dark. | 8 s | Camera dolly out + half-rotate. SFX: pod release hiss begins. |
| 3 | (same as shot-2 end) Wide of Cryo Bay row, player's pod lit, Pod Zero dark. | Close on a single hand pressing the inside of the pod glass; fingerpads white where pressure flattens. | 6 s | Push-in. SFX: hiss continues, faint creak. |
| 4 | (same as shot-3 end) Hand on glass from inside. | Same hand outside the pod, fingertips emerging into the bay's drifting cryo haze. | 7 s | Pod door breaking seal; door is implied off-frame. SFX: latch release, exhale of cryo gas. |
| 5 | (same as shot-4 end) Hand emerging into haze. | Figure standing in Cryo Bay, back to camera, head turned three-quarters toward Pod Zero. | 8 s | Reveal of player silhouette. SFX: single footfall on grate, then silence. |
| 6 | (same as shot-5 end) Figure looking at Pod Zero. | Pod Zero dominates the frame; dark, silent; player's silhouette small in the lower-left corner. | 9 s | Slow push toward Pod Zero. **VO (Elara, soft):** "You're the only one who woke." |

#### 3.1.2 Cutscene — `cs_first_human_contact`

**Trigger:** First time player examines the Comms Array's
flickering blue panel after the Frequency Wall hotspot is
discovered (`comms_frequency_52_7_observed`).
**Length:** ~30 s. **Shots:** 4. **VO:** 1 line (the Human, mid
shot 3). **SFX track:** static crackle → single carrier-wave
tone (52.7 MHz pure sine, ~A2) → breath held → tone drops out.

| # | start frame | end frame | duration | note |
|---|---|---|---|---|
| 1 | Comms Array wide; consoles dead, monitors black; one wall panel showing dim blue idle glow. | Same composition; the dim panel flickers once, brighter — held a beat. | 7 s | SFX: low static. |
| 2 | (= end shot-1) Wall panel flickering brighter. | Spectrogram on the panel; all bands are noise except one — 52.7 MHz showing as a perfect unmodulated sine wave, no information, pure carrier. | 8 s | Push to panel. SFX: static fades, single tone enters. |
| 3 | (= end shot-2) Pure sine on panel. | Tight on player's face, three-quarter profile, eyes wide, listening. | 8 s | Cut from panel to face. **VO (Human, soft, single sentence, mid-shot):** "I am here." |
| 4 | (= end shot-3) Player's face listening. | Reverse over player's shoulder: empty Comms Array behind them, nobody there; the panel still glowing blue. | 7 s | The reverse confirms isolation. SFX: tone holds, then drops out into silence on cut. |

#### 3.1.3 Cutscene — `cs_elara_memory_recovery`

**Trigger:** Elara reaches trust ≥80 AND
`bridge_war_table_online` AND
`captains_quarters_master_key_used`.
**Length:** ~40 s. **Shots:** 5. **VO:** 1 line (Elara, end of
shot 5). **SFX track:** hologram warble (subtle) → ambient lab
hum (younger memory) → hologram warble re-enters → single
metallic drop (like a tear striking a brass plate) → silence.

| # | start frame | end frame | duration | note |
|---|---|---|---|---|
| 1 | Bridge mid-frame: Elara's holographic portrait stable, three-quarter view, present-day. | Same portrait; volumetric edges glitch into pixel fragments at her temple and shoulder. | 7 s | SFX: warble. |
| 2 | (= end shot-1) Pixel fragments around Elara's portrait. | Fragments resolve into a younger Elara — same face, no scarring, soft expression — smiling at someone offscreen left. | 8 s | The portrait becomes a memory, not a render. |
| 3 | (= end shot-2) Younger Elara smiling offscreen-left. | Pull back to reveal pre-launch laboratory environment: clean white surfaces, equipment, daylight from offscreen window — still smiling at offscreen-left. | 9 s | Memory-space established. SFX: lab hum enters under warble. |
| 4 | (= end shot-3) Pre-launch lab around younger Elara. | Lab dissolves to neutral white; current-day Elara (scarred, present, holographic again) stands in centre-frame, on the Bridge. | 8 s | Memory closes. SFX: warble re-enters, lab hum drops out. |
| 5 | (= end shot-4) Present-day Elara on Bridge. | Close on her hand resting on the captain's chair, palm flat — recognition without flourish. | 8 s | **VO (Elara, quiet):** "I remember now." End on the metallic-drop SFX. |

#### 3.1.4 Cutscene — `cs_breaking_point`

**Trigger:** Reactor capacity drops below 35% AND ShadowTongue
power crosses 60. Played once per save; flagged
`cs_breaking_point_seen`.
**Length:** ~35 s. **Shots:** 4. **VO:** none.
**SFX track:** reactor groan (deep) → alarm pulse (red, slow
2 Hz) → metal shudder → single piece falling, distant clatter
→ single high glass tone (the new connection appearing on the
Conspiracy Board).

| # | start frame | end frame | duration | note |
|---|---|---|---|---|
| 1 | Engineering reactor wide, stable, capacity readout green. | Same wide; readout drops to "34%" in red; alarm light pulses red on the upper-left rail. | 8 s | SFX: groan deepens, alarm pulse begins. |
| 2 | (= end shot-1) Reactor stable but alarm pulsing. | Cut to Bridge ceiling: a structural piece (a single deck-frame brace) falls from the upper rail, mid-air, arrested in frame. | 8 s | SFX: shudder, then clatter starts. |
| 3 | (= end shot-2) Bridge frame piece falling, mid-air. | Cut to Bridge Conspiracy Board: central Architect node flickers, re-renders with **44 connection lines** instead of 43; the new line glows the brightest. | 9 s | SFX: high glass tone enters as the new line resolves. |
| 4 | (= end shot-3) Conspiracy Board with 44 connections. | ShadowTongue indigo wash overlays the entire Conspiracy Board; the 44th line is visible only as a deeper indigo crease. | 10 s | SFX: high tone holds, then dies. |

#### 3.1.5 Cutscene — `cs_thought_virus_manifests`

**Trigger:** First room's `infection-level` crosses from `clean`
to `exposed`. Plays in that room. Flagged
`cs_tv_manifests_seen`.
**Length:** ~30 s. **Shots:** 4. **VO:** 1 line (Elara, end of
shot 4). **SFX track:** organic squelch (single, wet) →
breath-rhythm pulse (slow, low, room-scale) → tape-stretch
click → sealing-bolt thunk.

| # | start frame | end frame | duration | note |
|---|---|---|---|---|
| 1 | Clean room corner, neutral palette, vent grate at floor seam. | Same composition; a single black mycelium tendril (~6 cm) emerges from the vent grate. | 7 s | SFX: organic squelch on tendril emerge. |
| 2 | (= end shot-1) Single tendril at vent. | Same view; tendril multiplies into a fan of threads across one wall ≤30%; subtle wall peristalsis (the wall "breathes" once, slow). | 8 s | SFX: breath-rhythm pulse begins. |
| 3 | (= end shot-2) Threads on wall, room breathing. | Same room sealed: biohazard-amber tape across the doorway in two Xs; viewed through the door's slit-window from outside. | 7 s | SFX: tape-stretch click on each X. |
| 4 | (= end shot-3) Slit-window view of sealed room. | Pull back from the door: player figure standing in the corridor outside the quarantined room, small, looking. | 8 s | SFX: sealing-bolt thunk. **VO (Elara, soft):** "It found us." |

#### 3.1.6 Cutscene runtime contract

When implemented, each cutscene is a discriminated `CutsceneId`
under `apps/shared/cutscenes/` consumed by the existing
`CutsceneOverlay.tsx` (which currently only renders generic
content from `CompanionHubPage`). Trigger conditions:

| cutsceneId | trigger flag (write) | gate |
|---|---|---|
| `cs_awakening` | `cs_awakening_seen` | first boot of save |
| `cs_first_human_contact` | `cs_first_human_contact_seen` | `comms_frequency_52_7_observed` set |
| `cs_elara_memory_recovery` | `cs_elara_memory_recovery_seen` | trust(elara) ≥ 80 + `bridge_war_table_online` + `captains_quarters_master_key_used` |
| `cs_breaking_point` | `cs_breaking_point_seen` | reactor < 35% AND ShadowTongue power ≥ 60 |
| `cs_thought_virus_manifests` | `cs_tv_manifests_seen` | first room infection transition `clean → exposed` |

Each cutscene also writes a corresponding `loredex_unlock` for
the entity it implies (e.g., `cs_thought_virus_manifests` →
`entity_thought_virus`).

---

### 3.2 Yearly Events / Anniversary Cycles — diegetic surface

**What's missing (runtime):** global `worldEvents` table for
cross-player tracking; IRL-year-tick broadcaster that activates
the 12-event year-one calendar
(`docs/design/YEAR_ONE_EVENTS_CALENDAR_V2.md`); per-room
prestige-cycle visual variant.

**What this section locks (art):** how the diegetic surface
should look so the moment the broadcaster fires, the visuals
already exist. Three surfaces: a **Year Ring**, a
**Prestige-Cycle Trim**, an **Anniversary Plaque rack**.

#### 3.2.1 Year Ring — Bridge ceiling installation

**Diegetic location:** Bridge (§2.3), suspended from the
ceiling above the captain's chair, visible from any standing
position.

**Object:** a brass-and-glass ring 2.4 m diameter, 12 segments
(one per year-one calendar event), each segment showing a
tiny diorama relief (e.g., Architect's Awakening = a folded
hand cradling a pinpoint of light; First Light = a sunrise on
brass plate; Cyber-Solstice = a dark cube with one lit corner).

**Layout sentence (verbatim):**
*A 2.4-metre brass-and-glass ring suspends from the Bridge
ceiling forward of the captain's chair, divided into twelve
relief segments around its circumference; one segment is lit
from within with cool-amber light, the other eleven are dim;
the lit segment's relief catches the ceiling-floods so its
diorama reads in three-quarter relief.*

**State Layer deltas:**
- `STATE — yearly active <eventId>:` *segment for `<eventId>`
  is internally lit cool-amber; one frame above it is etched
  with the event's calendar date.*
- `STATE — yearly idle:` *no segment is lit; ring is brass-
  silhouette only, lit only by ambient ceiling-floods.*
- `STATE — anniversary:` *all twelve segments are lit
  simultaneously, brighter; ring rotates one full turn over
  the 24-hour anniversary window (ambient slow rotation).*

**Hotspot:** examine the ring → reveals the year-event roster
in a brass-engraved hover-tooltip; player can read about
upcoming events. No interaction with the segments themselves.

**Runtime contract (when wired):** `worldEvents` table with
columns `(eventId, kind: "year_one_calendar" | "anniversary",
startedAt, endsAt, payload)`. Server tick at IRL midnight UTC
checks calendar dates and writes one row when an event begins,
updates `endsAt` when it closes. Client subscribes via tRPC
`worldEvents.getActive`. Bridge ring component reads the
returned event and switches the lit segment.

#### 3.2.2 Prestige-Cycle Trim — per-room rim accent

**Diegetic surface:** Every interior room gains a thin (≤2 cm)
recessed trim line at floor-and-ceiling junctions. Trim colour
is per-player and reflects prestige cycle:

| prestige cycle | trim colour | material reading |
|---|---|---|
| 0 | none — recess unfilled | bare alloy |
| 1 | gold | thin brass inlay, polished |
| 2 | platinum | brushed white-grey alloy |
| 3 | diamond | colourless reflective edge with rainbow refraction in highlights |
| 4+ | obsidian-prism | matte black with one moving point of refracted light along its length |

**Layout sentence fragment (universal across rooms):**
*The floor-and-ceiling junction trim catches a thin
[gold/platinum/diamond/obsidian-prism] line that follows the
room perimeter at hand height for the floor and shoulder
height for the ceiling; the trim's reflectance is the only
indicator of the player's prestige state.*

**State Layer deltas:** see table above; one delta per cycle.

**Runtime contract:** read `prestigeProgress.prestigeLevel` for
the current player; pass to the room renderer as a CSS
custom-property `--prestige-trim`. No new schema needed; the
table exists.

#### 3.2.3 Anniversary Plaque rack — Memorial Corridor

**Diegetic location:** Memorial Corridor (§2.27), a brass rack
mounted to the corridor's port wall.

**Object:** 12 anniversary plaques (one per game-year completed
since launch), each engraved with the year number and a
single-line community-vote inscription chosen at year-tick.

**Layout sentence:**
*A vertical brass rack ~2 m tall holds twelve numbered
anniversary plaques, oldest at top; each plaque carries a
single etched line of text below its year-number; unfilled
plaques are blank brass blanks awaiting their year.*

**State Layer deltas:**
- `STATE — anniversary count <N>:` *N plaques are filled (with
  inscriptions); 12-N plaques remain blank brass.*
- `STATE — anniversary active:` *the most-recent plaque is lit
  from a small overhead lamp; lamp is dim on every other day.*

**Hotspot:** read each plaque → reveals the year's
inscription + community vote outcome that year.

**Runtime contract:** `worldEvents.getAnniversaryHistory()`
returns ordered list of `{year, inscription, voteOutcome}`.
Inscription is generated at year-tick from the year's most-
recent governance-vote outcome (`generateAnniversaryInscription
(voteOutcome)`).

---

### 3.3 Trade Empire mission-loop — diegetic surfaces (art only)

The Trade Empire mission loop is **runtime-owned by the parallel
TE agent**. This section locks only the **diegetic art
surfaces** that will need to exist when their runtime ships, so
the art is plug-and-play. Four surfaces: **Trade Command
Center**, **Cover Identity Board**, **Cargo Manifest Console**,
**Broker's Office**. Each is a canonical pocket of the Trade
Hub (§2.31).

#### 3.3.1 Trade Command Center

**Layout sentence:**
*A circular sector-map projection table dominates the centre
of the Trade Command Center; six broker-portrait stations ring
the table at navigator-shoulder height; an overhead reputation
ticker scrolls per-sector standings as a continuous brass-on-
black ribbon; mission queue tablets stand to the right of the
table at console height.*

**Hotspots:**
- Sector-map table → reveals active sectors with control state
  (5 tiers: locked / first_arrival / explored / contested /
  controlled).
- Mission queue tablets (3–5) → display active missions with
  progress bars.
- Reputation ribbon → continuous scroll of per-sector standings.

**State Layer deltas:**
- `STATE — sector control <sectorId> <tier>:` *the named sector
  on the map glows in the tier's signature colour (locked =
  cold-grey, first_arrival = pale-cyan, explored = warm-amber,
  contested = red-pulse, controlled = steady-gold).*
- `STATE — mission active <missionId>:` *one queue tablet
  shows the named mission with a progress bar partially
  filled.*
- `STATE — reputation delta <sectorId> <delta>:` *the ribbon
  highlights the affected sector's row in green (+) or red (−)
  for one full ticker pass.*

#### 3.3.2 Cover Identity Board

**Layout sentence:**
*A wall-mounted board ~2 m wide displays up to three active
cover identities as portrait cards; each card carries a name,
faction sigil, and an expiration timer in a small brass dial;
expired covers are crossed out with a single red diagonal slash;
slots without active covers are blank.*

**State Layer deltas:**
- `STATE — cover active <coverId>:` *the named portrait is
  visible with its dial counting down.*
- `STATE — cover exposed <coverId>:` *the named portrait is
  crossed with a red slash; its name is over-stamped
  "BLOWN".*
- `STATE — cover slot empty:` *blank brass plate.*

#### 3.3.3 Cargo Manifest Console

**Layout sentence:**
*A standing console ~1.4 m tall presents a paginated cargo
manifest as etched brass plates that flip to next page on
tap; each plate lists 5 line-items (name / quantity / origin
sector / age / market-volatility); the console's right edge
shows a vertical bar of available storage capacity.*

**State Layer deltas:**
- `STATE — cargo capacity <pct>:` *the right-edge bar fills
  to <pct>%; over 90% the bar pulses amber.*
- `STATE — cargo volatile:` *one or more plates show a
  red-edge highlight on volatile items.*

#### 3.3.4 Broker's Office

**Layout sentence:**
*A small private office partition off the Trade Command Center
contains a single broker-NPC at a desk, a relationship-tier
plaque on the wall (5 tiers), and a contracts folio open on
the desk; two empty chairs sit before the desk for player
seating.*

**State Layer deltas:**
- `STATE — broker tier <tier>:` *the wall plaque shows the
  named tier; tier 1 is plain wood, tier 5 is engraved brass.*
- `STATE — contract pending:` *the folio is open to a contract
  page with a quill in the margin.*

**Runtime contract (deferred to TE agent):** these surfaces
will read the existing 6 trade tables (`tradeActiveMissions`,
`tradeCompletedMissions`, `tradeSectorReputation`,
`tradeActiveCovers`, `tradeClassSectorUnlocks`,
`tradeEmpireUserAggregates`) once the missing router procedures
land.

---

### 3.4 Global Light/Dark Alignment Meter

**What's missing (runtime):** `globalAlignment` schema table;
aggregate-writer function (cron, e.g., 1/hour, summing
`characterSheets.lightDarkAlignment` across all players); tRPC
`alignment.getGlobal()` reader; client meter component.

**What this section locks (art):** the meter as **two visible
HUD surfaces** AND **per-room ambient-lighting drift**.

#### 3.4.1 HUD surface — Bridge Galaxy Meter

A persistent HUD chip on the Bridge (§2.3) above the captain's
chair. Reads "GALAXY: <NN>% LIGHT" and displays as a horizontal
gauge from cool-violet (0%) through neutral white (50%) to
warm-gold (100%).

**Layout sentence (HUD):**
*A 16-cm horizontal gauge floats above the captain's chair as
a holo-brass panel; the gauge fills from left (cool-violet) to
right (warm-gold); the current galaxy alignment is shown as a
needle on the gauge with the percentage in small brass numerals
beside it.*

**State Layer deltas (5 brackets):**
- `STATE — galaxy long-night (≤20%):` *gauge needle far left,
  cool-violet wash; small caption "the long night holds".*
- `STATE — galaxy dimming (21–45%):` *gauge needle left of
  centre, palette shifts cooler.*
- `STATE — galaxy balanced (46–55%):` *gauge needle centred,
  neutral white.*
- `STATE — galaxy warming (56–80%):` *gauge needle right of
  centre, palette shifts warmer.*
- `STATE — galaxy dawn (≥81%):` *gauge needle far right,
  warm-gold wash; small caption "the dawn approaches".*

#### 3.4.2 Per-room ambient drift

Every room's ambient-light temperature shifts ±300K based on
galaxy alignment. The shift is a single multiplier on the
room's base palette (does NOT change geometry, materials, or
hotspots — just light temperature). The drift is the **visible
proof** that votes shape the world.

**Layout sentence fragment (universal):**
*The room's ambient lighting carries the galaxy temperature
overlay: cooler by 300K when the galaxy is in long-night,
warmer by 300K when the galaxy is in dawn; mid-states
interpolate linearly.*

**Runtime contract:** `alignment.getGlobal()` returns
`{percentLight: number}`. Renderer reads this and applies a
single CSS custom-property `--galaxy-temperature-k` to the
room shell (default 5500 K; long-night 5200 K; dawn 5800 K).

---

### 3.5 Story Item Registry

The master cross-index of every story-impacting discoverable
in the production document. ~260 enumerated items (per
NOTES §11) catalogued under a single schema so every
storyteller can find where any item lives, what flag it
sets, what hotspot reveals it, and what prompt fragment
places it diegetically.

#### 3.5.1 Schema

Every entry below carries:

- **canonical name** — the in-fiction name
- **runtime flag / state** — the narrative-flag tuple or
  database state that gates visibility
- **manifest room** — which §2.x room hosts the item
- **hotspot verb set** — what the player does to interact
- **prompt fragment** — the layout-sentence-ready phrase
  that places the item in renders
- **status** — `shipped` / `partial` / `unbuilt — design-only`

Entries are grouped by category (§3.5.2 through §3.5.13).
For ~260 items the full per-row table would be ~260 rows
across multiple sub-tables; below, the most narratively
load-bearing items are itemised in full, and bulk
inventories (Personal Quarters décor 120+, Guild Hall décor
30+, etc.) reference their authoring source files for the
per-row data.

#### 3.5.2 Antiquarian Tomes & Library Discoverables

The Antiquarian's Library (§2.13 pocket dimension + §2.4
Archives Ark-side anchor) is the densest discoverable
surface in the doc. Tomes are the primary literature
unlocks; marginalia stacks, folios, and chronicles are
the per-NPC-arc lore-vehicles; the Forbidden Section is the
gated reveal-tier. **All Library discoverables are
**TV-immune** (per §2.13 row 1 — pocket dimension does not
propagate Thought Virus).** ShadowTongue affects the pocket
inversely: higher power → marginalia becomes MORE legible
(the Antiquarian preserves what the Tongue tries to
overwrite).

##### 3.5.2.1 CoNexus Tomes (7 shipped, designed for ~48)

Source: `apps/shared/coNexusTomes.ts`. Tomes are
parallel-reality flash-fiction (200–400 words each) that
unlock as the player advances. Each tome is visible on the
Antiquarian Library shelves as a bound brass-on-leather
volume. Locked tomes show as silhouettes; unlocked tomes
catch overhead candle-light.

| # | tome name | unlock condition | manifest hotspot | status |
|---|---|---|---|---|
| 1 | **The Garden Under Sand** | `loredex-tome-room` Act 4 (Programmer's cycle, mint cuttings) | shelf-tomes mid-row | shipped |
| 2 | **A Ledger for the Unborn** | flag `locke_eye_history_disclosed` Act 5 (Locke's midwife cycle) | shelf-tomes far-row | shipped |
| 3 | **The Breath We Did Not Take** | `loredex-tome-room` Act 5 (Elara as senator) | shelf-tomes mid-row | shipped |
| 4 | **Calculus of the Long Table** | flag `engineer_zero_hint` Act 5 (Vex Solène without prince) | shelf-tomes near-row | shipped |
| 5 | **The Secondary Engineer** | flag `iron_lion_card_earned` Act 4 (Selene the schoolteacher) | shelf-tomes near-row | shipped |
| 6 | **What Kael Kept** | flag `kael_lore_discovered` Act 3 (Kael refuses the Source) | shelf-tomes near-row | shipped |
| 7 | **The Room with the Open Window** | flag `act7_s1_balance` Act 7 (operative chooses Balance) | shelf-tomes far-row | shipped |
| 8–48 | **41 designed tomes** | various — see `coNexusTomes.ts` design comments | shelves stay drape-locked until unlock fires | unbuilt — design-only (1–7 ship; 8–48 reserved as silhouettes) |

**Storyteller slot:** authoring a new tome requires 200–400
words of body text + an unlock condition. The renderer
auto-surfaces unlocked tomes; the silhouette-of-an-unread-
tome is a permanent expansion-reserved zone on the shelf.

##### 3.5.2.2 Marginalia stacks, folios, and chronicles (per-NPC arc)

| canonical name | room location | NPC arc anchor | unlock | hotspot verb | status |
|---|---|---|---|---|---|
| **Hierophant's marginalia stack** | locked vault drawer, Antiquarian Library | Wraith Calder E2 | `wraith_arc_e2_unlocked` | examine, read | shipped (text); unbuilt as visible art |
| **Coda's purpose shelf** | rear-left bookcase, Antiquarian Library | The Degen E3 | `degen_arc_e3_unlocked` | examine, take-Brief | shipped (text); unbuilt as visible art |
| **Velkraal's correspondence folio** | locked vault, Antiquarian Library | Game Master E2 | `gm_arc_e2_unlocked` | examine, read | shipped (text); unbuilt as visible art |
| **Insurgency witness roster** | long-reading-table, Antiquarian Library | Vex Solène E2 | `vex_arc_e2_unlocked` | examine, count names | shipped (text); unbuilt as visible art |
| **Antiquarian's chronicle** | long-reading-table centre, Antiquarian Library | always present | always | read, write-with-quill (post-permission) | shipped (the Antiquarian writes it in real time) |
| **Antiquarian's bust** | rear plinth, Antiquarian Library | Jericho Jones E1, E3, E4, E5 (4-clue surface) | always | look, talk, use | shipped |
| **Locked vault drawer** | upper-rear shelf, Antiquarian Library | Wraith E2, E5 + Seer E1 | memory-ritual unlock | use (recite from memory) | shipped (mechanism); per-arc contents partially shipped |
| **Card catalog** | left wall, Antiquarian Library | Wraith E1 + Jericho E1 | always | look, talk, use | shipped |
| **DO-NOT-PLAY band tape** | locked vault, Antiquarian Library | Seer E1 | `seer_arc_e1_unlocked` | examine (band only — never play) | shipped (text); unbuilt as visible art |
| **Hierophant's scrubbed-names register** | locked vault counter-record | Wraith E2 | `wraith_arc_e2_unlocked` | talk-with-Antiquarian-bust | shipped (text); unbuilt as visible art |

##### 3.5.2.3 Library structural discoverables

| name | location | reveal condition | status |
|---|---|---|---|
| **Forbidden Section** sealed wing | rear right of Antiquarian Library | trust-`antiquarian` ≥ 80 | shipped (door); unbuilt as visible art |
| **The Sealed Vault** biometric-locked | far rear of Antiquarian Library | endgame artefact | unbuilt — design-only |
| **The Lost Wing** collapsed corridor | left rear of Antiquarian Library | archaeology/restoration quest | unbuilt — design-only |
| **Librarian's Personal Collection** small shelf | beside Antiquarian's reading chair | trust-`antiquarian` ≥ 80 OR theft | unbuilt — design-only (text exists, art needed) |
| **"The Warlord's Ascension"** redacted entry | shelf-tomes, redacted with black bars | trust-`antiquarian` = 100 | unbuilt — design-only (shipping with redaction; full text reserved) |
| **Margin Notes Evolution** Shadow Tongue annotations | every visible book spine | ShadowTongue power ≥ 40 | shipped (mechanism); per-spine annotations partially shipped |

##### 3.5.2.4 Antiquarian's bust dialogue surfaces

The Antiquarian's bust at trust-100 surfaces 4 distinct
clue-tiers, each cross-referenced to the Mystery Atlas
(§5, to be authored). Surface-by-tier:

- **Bust look (tier 1)** — surfaces depiction lore (transition
  from listener to writer)
- **Bust talk (tier 2)** — manifests one journal entry per
  visit; cycles through Jericho-arc episodes
- **Bust use (tier 3)** — surfaces Lionism canon (Akai Shi
  aftermath, pre-Fall code, imprint protocol, pre-rite
  contract)
- **Bust gift (tier 4)** — placing a violet soul stone on the
  bust's plinth at trust-100 reveals the Antiquarian's
  marginalia in plain text for one visit (revelation moment)

##### 3.5.2.5 Discoverable rotation slots (storyteller-author surface)

The Antiquarian's Library's chief storyteller-slot is the
**Rotating Margin Note** — a single book spine each week
gains a new annotation. The annotation text is JSON-
authored in `shadowTongueDictionary.ts`; new entries can
be added without code changes. Storytellers can author
unlimited new annotations as living-world content.

#### 3.5.3 Cryo Bay & Med Bay & Engineering canonical artefacts

| name | manifest room + hotspot | flag | status |
|---|---|---|---|
| **Torn ID tag** | Cryo Bay — frosted-glass cord pickup | `cryo_torn_id_collected` | shipped |
| **Data-slate fragment** | Cryo Bay — pod base | `cryo_data_slate_collected` | shipped |
| **Silver locket** | Cryo Bay — personal effect (mid-pod) | `locket_opened` | shipped |
| **Unlabeled vial** | Cryo Bay → Med Bay rear shelf, post-Act-2 | `unlabeled_vial_recovered` | shipped |
| **Frosted-glass cord** | Cryo Bay — Pod Zero exterior | `frosted_glass_observed` | shipped |
| **Pod Zero** | Cryo Bay — central foreground | `pod_0_breathing` (4-tier) | shipped |
| **Burnt seer's card** | Engineer hookpoint → Antiquarian elbow post-recovery | `burnt_card_recovered` | shipped |
| **DNA neural-bridge receipt plate** | Med Bay autoclave shelf, post-`medbay_device_awakened` | `dna_receipt_plate_drawn` | shipped (plate); unbuilt as visible art |
| **Iron Lion oath token** | Armory rack centre, post-`jericho_oath_taken` | `iron_lion_oath_taken` | shipped |
| **Captain's master key** | Captain's Quarters chair under-armrest | `captains_master_key_obtained` | shipped |
| **Akai Shi mercy token** | Armory low shelf, post-Jericho-arc-E2 | `akai_shi_mercy_recalled` | shipped |
| **Engineering combine kit (7 recipes)** | Engineering crafting bench | per-recipe flag | shipped (see §3.5.6) |

#### 3.5.4 Soul Stones tri-state inventory

Soul stones (per §3.9 Soul Stones — purification/corruption
economy) carry tri-state: Violet (neutral/held), Red
(corrupted, fed to Hierarchy), Gold (purified, offered to
Dreamer). Drop sources and weekly cap per NOTES §9.2.

| state | source | manifest visible at | runtime flag | status |
|---|---|---|---|---|
| **Violet** | Arena +1, Terminus 1/5 waves, Story 2/chapter, NPC trust 20s, Personal Quarters favourites shelf | Personal Quarters favourites shelf, Med Bay pedestal pre-purify, Castle of Death altar pre-corrupt | `soulStones[i].colour = "violet"` | unbuilt — design-only |
| **Red (corrupted)** | post-conversion at Castle of Death altar OR Chaos Forge red pit; Betrayals 1 red pre-corrupted | Castle of Death summoning circle nodes (§3.9.2); Personal Quarters favourites shelf right-position | `soulStones[i].colour = "red"` | unbuilt — design-only |
| **Gold (purified)** | post-conversion at Med Bay Resonance pedestal (24h timer); Secrets 1/secret pre-purified | Med Bay Resonance pedestal bowl (§3.9.1); Personal Quarters favourites shelf centre-position | `soulStones[i].colour = "gold"` | unbuilt — design-only |
| **Mid-purification** | Resonance pedestal during 24h timer | Med Bay Resonance pedestal — visible as half-violet/half-gold internal glow | `soulStones[i].purifyingFromMs` set | unbuilt — design-only |
| **Mid-corruption** | Castle of Death altar during conversion | Castle of Death altar — visible as half-violet/half-red | `soulStones[i].corruptingFromMs` set | unbuilt — design-only |

Weekly cap: 15 from combat sources (uncapped from
narrative).

#### 3.5.5 Earned loadout items (25)

Source: `apps/shared/earnedLoadouts.ts`. 5 classes ×
3 species = 15 base items × variants per acquired tier =
25 distinct earned loadout items. Manifest at:

- **Med Bay autoclave shelf** — one DNA receipt plate per
  earned loadout
- **Armory rack centre** — equipped-loadout silhouette
  rotation per equipped-loadout change
- **Personal Quarters armory zone** — equipped weapons in
  rack and on display cases
- **Forge Workshop bench** — work-in-progress on craft
  events

Per-item rows: see `earnedLoadouts.ts` (15-row table —
each row carries class, species, item slot, item style,
acquisition condition, prompt fragment).

#### 3.5.6 Engineering combine items (7 recipes × ingredients)

Per NOTES §12.3. Each combine recipe requires 2 ingredient
items at the Engineering crafting bench.

| # | output | ingredient A | ingredient B | room of ingredient pickup |
|---|---|---|---|---|
| 1 | Master Decoder | Decoder | Key | Cryo Bay (decoder), Captain's Quarters (key) |
| 2 | Restored Schematic | Schematic-Rubbing | Corrupted-Fragment | Engineering schematic-pad, Archives |
| 3 | Charged-Cell | Drained-Cell | Energy-Shard | Med Bay autoclave, Cargo Hold |
| 4 | Enhanced-Medkit | Basic-Medkit | Neural-Stim | Med Bay (medkit), Engineering (stim) |
| 5 | Signal-Booster | Antenna | Amplifier | Comms Array (antenna), Engineering (amplifier) |
| 6 | Viral-Antidote | Virus-Sample | Antibody | Med Bay (sample), Med Bay (antibody) |
| 7 | Temporal-Lens | Antiquarian-Shard | Void-Crystal | Antiquarian Library, Cargo Hold |

Each output is a hotspot story-item with its own runtime
flag (`engineering_<output>_built`).

#### 3.5.7 Pet species and rarities (~30 species × 4 rarities)

Source: `petSpeciesTraits.ts`. 8 main species + variants:
Flicker Imp, Spore Fungus, Void Crawler, Data Serpent,
Gilt Beetle, Holo Fox, Temporal Kitten, Glyph Moth — each
has 3+ evolution stages × 4 rarity tiers (common 0–40,
uncommon 40–65, rare 65–90, epic 90+). Manifest at:

- **Pet Garden** — feeding/play area (active pets);
  Breeding Wing pods (incubating); Genealogy Tree (lineage)
- **Pet Arena** — arena floor (matches), spectator gallery
  (audience), Retirement Shrine (deceased)
- **Pet Medical Annex** — recovery tanks (injured)

Per-pet runtime data: `playerPets` table (userId, petId,
species, name, evolutionStage, bond, currentHp, etc.).

Specific narratively-load-bearing pets:
- **Founder pets** — sealed pod with Lyra Vox's wax in
  Breeding Wing; revealed at trust-`antiquarian` ≥ 60
- **The Hidden Mutation** — every 100th breed has a chance
  for a unique mutation visible only on the Genealogy Tree
  as a different brass alloy (storyteller hook)
- **Bay 7 / Sealed Aviary** — reserved expansion zone for
  flying pet species (per §2.28 storyteller hooks)

#### 3.5.8 Personal Quarters décor (120+ items)

Source: `apps/shared/personalQuarters.ts`. 120+ items
across 12 categories × 6 zones. Per-item authoring lives
in the source file. Manifest grid is the Personal Quarters
6-zone layout (Main Hall, Private Quarters, Study, Armory,
Zen Garden, Treasure Vault). High-impact items:

- **War Table** (Armory zone, soldier-class gated)
- **Forge Station** (Armory zone, engineer-class gated)
- **Trophy Case** (Armory zone)
- **Scrying Pool** (Zen Garden, oracle-class gated)
- **Shadow Altar** (Treasure Vault, assassin-class gated)
- **Boss Kill Trophies** (Armory zone — Sentinel head,
  Wyrm fang chandelier, Void Leviathan eye, etc.)
- **5 Mythic Items**: Panopticon's Eye, Infinity Mirror,
  Void Portal, Dreamer's Chosen Throne, [reserved 5th]
- **Living Mirror** (Main Hall — see §3.11.1)
- **Soul Stones favourites shelf** (per §3.9.3)

#### 3.5.9 Guild Hall décor (30+ items)

Source: `apps/shared/guildHall.ts`. 30+ items × 12 guild
rooms × 5 tiers. Manifest at Guild Sanctum (§2.14) and 11
sub-rooms. Per-item authoring lives in the source file.
High-impact items:

- **4 Banners** (Standard, Empire, Insurgency, Victory)
- **4 Trophies** (First War, Sentinel Prime, Chrono Wyrm,
  Void Leviathan)
- **5 Furniture** (Command Table, War Board, Guild Throne,
  etc.)
- **Founder's Plaque** (Memorial wall, post-`guild_founded`)
- **Guild Vault display** (Tier 3+)

#### 3.5.10 Cosmetics (25)

Source: `apps/shared/cosmeticCatalog.ts`. 25 cosmetics
across 3 tiers. Per-item authoring in source. Cross-
references §3.11 Living Character Sheet for in-room
rendering.

| tier | items | manifest |
|---|---|---|
| **Tier 1 Earnable** (Dream-only) | Card Back: Cobalt/Crimson; Avatar: Dreamer; Avatar Frame: Iron; Profile Banner: Dischordia; Title: Apprentice; Emotes: Thumbs Up + Well Played | character sheet, Personal Quarters mirror |
| **Tier 2 Hybrid** (Dream OR Void Crystals) | Card Border: Amber Pulse / Void Pulse; Board Theme: Obsidian / Nebula; Avatar Frame: Gold Filigree; Title: Archon's Apprentice | as above + visible in social hub on player |
| **Tier 3 Premium** (Void Crystals only) | Aura: Void Signature / Archon Flame; Card Animation: Signature Pull; Voice Pack: Lyra Vox / Kael; Music Pack: Orchestral Combat; Title: Founder; Aura: Author's Edition S2 | as above + audio cosmetics surface in dialogue |

#### 3.5.11 Transmission media (11+ Epoch 1 episodes)

Source: `apps/shared/transmissions.ts` + `broadcastLibrary.ts`.

- **11+ shipped Epoch-1 transmissions** (Late Night with
  the Meme + others), each carrying:
  - title, memeIntro / memeOutro VO, synopsis
  - unlockTrigger (awakening_step / chapter_complete /
    level / trust / flag / room_visited / scheduled_broadcast
    / always)
  - relatedLoredexEntries (bidirectional Loredex unlock)
  - Cloudinary video URL (~3–4 min episodes)
- **30 broadcast voice interrupts** (Programmer / Antiquarian
  / Enigma) firing on song play, album completion, room
  visit, etc. Pure data — storytellers add new interrupts
  as JSON without code changes.

Manifest at:
- **Comms Array** (broadcast cylinders rear shelf,
  post-`comms_first_episode_watched`)
- **Rec Room / Media Hub** (pop-up auto-queue)
- **Loredex linked entries** (bidirectional discovery)

Storyteller slot: each transmission is a single JSON
entry. New episodes plug into the registry without code
recompile.

#### 3.5.12 Mystery-arc clue items (30 episodes × clues)

The 6 NPC mystery arcs × 5 episodes each surface specific
clue items per episode. Cross-reference to §5 Mystery Atlas
(to be authored). Per-arc, per-episode clue items are
catalogued in NOTES §12.1 — not duplicated here. Each clue
item has a runtime flag and a manifest hotspot.

Highlights:
- **Wraith Calder arc** — Bounty file (Comms Array),
  Substrate-N residue (Engineering Core / Cargo manifest),
  Hierophant ceremony (Antiquarian locked vault),
  Continuous witnessing (Cipher Den), Prophet identity
  (Antiquarian bust at trust-100)
- **Jericho Jones arc** — Callsign history (card catalog),
  Battle of Thaloria log (Antiquarian), Iron Lion imprint
  protocol (instruction manual page 1, Engineering),
  Grip-anomaly footage (Med Bay bio-bed), Akai Shi mercy
  token (Armory)
- **The Seer arc** — DO-NOT-PLAY band (locked vault),
  Hierophant marginalia VAR-1109A/B (marginalia stack),
  DEC-7710 catalog card (Antiquarian), Acoustic signature
  (Engineering reactor), Canon Paradox (Antiquarian
  chronicle)
- **Vex Solène arc** — Equipment signature (reactor),
  Workshop letter (Engineering), Apprentice draft letter
  (egg-eng-formula), Tool migration map (instruction
  manual appendix), Calibration session card (schematic-
  pad)
- **The Degen arc** — Brokerage line #4711 (schematic-pad),
  Quarterly routing pattern (blueprints), Coda Purpose
  Brief (Coda's purpose shelf), Treasurer's emergency note
  (Coda's purpose shelf), Letter to the saga (Captain's
  Quarters Degen's Corner)
- **Game Master arc** — Velkraal succession letter
  (correspondence folio), Practice edit-drafts
  (blueprints), Draft closing-edit (folio), Final session
  protocol (Engineering)

#### 3.5.13 Bloodline Witness Reports (5 milestones)

Source: `apps/shared/lyraVoxBloodlineWitness.ts`. Per Lyra
Vox milestone. Manifest at Bloodline Plinth (§3.10.4 / Pet
Garden centre).

| # | milestone | bonus | unbuilt UI | status |
|---|---|---|---|---|
| 1 | Dynasty Reached (Gen 3) | gestation-speed +300 bp | Bloodline Plinth + Voice Line | shipped (data); unbuilt as visible art |
| 2 | High-Fitness Birth (≥80) | mutation-favor +300 bp | as above | shipped (data); unbuilt UI |
| 3 | Founder Passed | integrity-floor +600 bp | as above | shipped (data); unbuilt UI |
| 4 | Drift Exceeded (≥60) | integrity-floor +800 bp | as above | shipped (data); unbuilt UI |
| 5 | Centenary (10 generations) | all bonuses +500/+400/+200 bp | as above | shipped (data); unbuilt UI |

Each milestone fires a Lyra Vox VO line at the Bloodline
Plinth.

#### 3.5.14 CADES helmet image-fragments (7)

Per §2.47 + NOTES §9.3. Each CADES mission M1–M7 captures
ONE image-fragment of the mission's emotional climax on
the violet helmet's interior surface. Seven fragments
visible after M7. Pre-M1, the helmet's interior is
unmarked.

Fragment subjects (storyteller-author per mission):
- M1 fragment — first kill / first mercy moment
- M2 fragment — first betrayal observed / committed
- M3 fragment — Iron Lion creed validated
- M4 fragment — Akai Shi recall
- M5 fragment — Agent Zero reveal
- M6 fragment — Warlord encounter
- M7 fragment — final witness moment

Each fragment has a runtime flag
(`cades_helmet_fragment_<N>_captured`) and a brass plaque
on the Med Bay annex rear wall (§2.47).

#### 3.5.15 Faction tokens & badges

Per NOTES §11. 5 factions × 5 standing bands = 25
alignments + threshold flags
(`faction:championed:<id>` / `faction:enemied:<id>`)
persist in `npc_public_flags`.

| token | manifest | trigger |
|---|---|---|
| **Champion-tier banner** | Bridge port wall + Station Dock + War Room pylon + Hierarchy Throne + Guild Sanctum | `faction:championed:<id>` |
| **Enemy-tier overlay** | banner removed (empty hook) at Bridge / Station Dock / War Room | `faction:enemied:<id>` |
| **Cross-opposition echo** | second-tier alliances fly half-furled | derived from championship |
| **Iron Lion service token** | Armory rack centre, post-`jericho_oath_taken` | shipped |
| **Insurgency caltrop-stamp** | small caltrop visible on rooms when Insurgency-allied | per-room render flag |
| **Hierarchy ouroboros sigil** | small ouroboros visible on rooms when Hierarchy-allied | per-room render flag |

#### 3.5.16 Storyteller-discoverable scatter (per-room small items)

Small ambient discoverables that don't drive runtime flags
but make the world feel inhabited. Each is authored in
its room's §2.x.7/§2.x.8 Storyteller Hooks row. Master
list of discoverable categories:

- **Scratched messages** — etched on walls behind sealed
  pods, on Observation Deck prayer wall, on Forge anvil,
  on Engineering reactor casing. Storyteller-authored;
  rotation slots admit unlimited new entries.
- **Inscribed plaques** — Memorial Corridor plaques (one
  per fallen crew); 10-plate Captain's Quarters Legacy Wall
  (per §2.11.8); Anniversary Plaques (12, per §3.2.3);
  Trophy Room Title Wall plates (100 capacity, per §4.2);
  Inscription Challenge plaque (Trophy Room).
- **Graffiti / tags** — Crew Quarters Corridor (rotating
  per IRL season); War Room engraved fighter names;
  Mess Hall storytelling chalkboard (1 entry per IRL day).
- **Marginalia** — Antiquarian Library spine annotations
  (rotation slot, ShadowTongue-driven); Coda's purpose
  shelf annotations; Velkraal's correspondence folio
  marginalia.
- **Audio-only interrupts** — Comms Array hourly chatter
  (1 phrase clear per 7h); Programmer / Antiquarian /
  Enigma broadcast interrupts (30 shipped).
- **Reserved canvas-drape zones** (per-room) — Bay 7 (Cryo
  Bay), Sealed Vault (Med Bay, Antiquarian Library, etc.),
  Sealed Inner Forge (Engineering Core), 7th Alcove
  (Shadow Vault), 6th Faction Pylon (War Room), 8th
  Mission plaque (CADES Console), 5th Stage alcove
  (Eidolon Sanctum), 13th Stone (Oracle Sanctum), 9th
  Pillar (Elemental Nexus), Hidden 4th Pit (Chaos Forge),
  6th Material (Nexus Point Sanctum), 11th Plaque (Grand
  Master's Sanctum), 17th TD Tier (Trophy Armory), 10th
  Chess Style (Chess Hall), 6th Faction (Faction
  Succession Monument), 5th Petal (Oracle Annual),
  6th Epoch (Epoch Witness Conclave), VIP Box / Founder's
  Trophy / Founder's Booth / Founder's Board (multiple).
  Each visible-but-uninteractable until expansion content
  lands.

These scatter items do NOT have runtime flags. They are
art-only diegetic content. New scatter items can be added
in any §2.x room's storyteller-hooks row without affecting
the recreation contract.

#### 3.5.17 Items with no current diegetic home (gap registry)

Per NOTES §11.2. Items with design but no shipped art.
Status all `unbuilt — design-only`.

**HIGH PRIORITY (narrative impact):**
1. Demon companion manifestations (10 demon × room visibility)
2. Divine companion manifestations (6 divine × room visibility)
3. Soul Stone Purification Chamber pedestal (Med Bay) — spec'd in §3.9.1, not yet rendered
4. Castle of Death summoning circle (Hellbox 2 pocket) — spec'd in §3.9.2
5. Bloodline Plinth (Pet Garden) — spec'd in §3.10.4
6. Pet Evolution Chambers (3) — spec'd in §3.10.3

**MEDIUM PRIORITY (flavor / immersion):**
7. DNA Receipt Plates (Med Bay shelf — table-row exists in §3.5.3 but not yet rendered)
8. Captain's Quarters Legacy Wall 10 plates — spec'd in §2.11.8 but visible art unbuilt for plates 6–10
9. Hierophant's marginalia stack visible art (text exists, art unbuilt — §3.5.2.2)
10. Coda's purpose shelf visible art (text exists, art unbuilt)
11. Velkraal's correspondence folio visible art
12. Pazaak deck — referenced in lore, no diegetic home
13. Memorial Plaza fallen-crew plaques — spec'd in §2.27 but the per-plaque art per crew is reserved
14. Iron Lion service tokens — physical token art for non-oath-bearing tokens

**LOWER PRIORITY (systems):**
15. Crafting schema display (Forge schema-rack) — text per recipe exists, per-schema art reserved
16. Broadcast cylinders (Comms Array) — physical media art for the 11 transmissions
17. Faction standing badges (championed/enemied physical) — current visualisation is banner-only; small physical badges unbuilt
18. Casino event tokens (Christmas in July) — event-only currency physical art reserved

#### 3.5.18 Runtime contract

Most story items read from the existing
`narrativeFlags` map on `GameContext.tsx`. Soul Stones
require a new `soulStones` table (per §3.9 contract).
Antiquarian tomes already ship via `coNexusTomes.ts`. Pet
species via `playerPets` and `petSpeciesTraits.ts`.
Earned loadouts via `earnedLoadouts.ts`. Personal Quarters
décor via `personalQuarters.ts`. Guild Hall via
`guildHall.ts`. Cosmetics via `cosmeticCatalog.ts`.
Transmission via `transmissions.ts` + `broadcastLibrary.ts`.
Bloodline Witness via `lyraVoxBloodlineWitness.ts` (data
exists; UI surface needed). CADES helmet fragments via
`cadesHelmetAssignments.ts` (referenced in §2.47).

For unbuilt items, the runtime contract defers to the
named contract in their respective §3 sub-section (§3.9
Soul Stones, §3.10 Pet Breeding, §3.11 Living Character
Sheet, etc.).

---


### 3.6 Notification surfaces — 14 missing producer types

**What's missing (runtime):** 14 of 58 notification types
declared in `apps/db/schema.ts:1777` have no producer. These
types must each gain a producer that writes a notification to
the player's inbox.

**What this section locks (art):** the **Notification Bell** +
**toast surface** must visually distinguish each type so when
the producer fires, the toast already has its identity. Per-
type design specifies icon glyph, accent colour, audio cue,
and inbox grouping.

| notification type | icon glyph | accent colour | audio cue | inbox group |
|---|---|---|---|---|
| `pvp_challenge` | crossed swords | crimson | dual short blade-clang | duels |
| `epoch_quest` | epoch sigil (ouroboros) | indigo | low gong | epoch |
| `syndicate_quest` | syndicate trident | dark-amber | three short clicks | syndicate |
| `battle_pass_reward` | tier ribbon | gold | short fanfare (1 s) | progression |
| `boss_mastery` | crowned skull | platinum | high tone hold | mastery |
| `governance_vote_open` | folded ballot | royal-blue | bell-ping | governance |
| `governance_vote_closed` | sealed ballot | royal-blue | bell-ping (lower pitch) | governance |
| `epoch_witness_unlocked` | nexus-point glyph | violet-prism | shimmer | epoch |
| `community_milestone` | linked-hands sigil | warm-rose | community chime | community |
| `tournament_bracket_open` | bracket diagram | tournament-gold | trumpet 1 s | tournament |
| `tournament_round_close` | trophy silhouette | tournament-gold | trumpet 0.5 s | tournament |
| `daily_streak_milestone` | flame | streak-orange | flint-spark click | progression |
| `npc_trust_milestone` | linked-portraits | trust-warm-amber | gentle two-note rise | relationships |
| `seasonal_drop_available` | wrapped parcel | seasonal-theme | ribbon-untie | seasonal |

**Toast layout sentence:**
*A 32-cm wide toast slides in from the right edge with the
type's glyph at the leading edge in the type's accent colour;
the toast body is a single brass-on-black line of caption text;
the trailing edge shows a small "open" chevron; the toast
auto-dismisses after 6 s unless hovered.*

**Inbox group layout:** Notifications group by `inbox group` in
the bell-popover. Groups collapse if they have more than 3
unread items; the group header shows the count.

**Runtime contract:** producer for each type must call
`notifications.emit({type, payload, recipientUserId})`. Client
reads via tRPC `notifications.getInbox()`.

---

### 3.7 Mobile Narrator surfaces (5 missing pages)

`MobileNarratorSlot.tsx` exists (303 lines); only
`ArkExplorerPage.tsx` imports it. The slot must adopt to five
more pages — these all inherit the same component but render
distinct in-page positioning. Per-page positioning + companion-
appropriateness is locked here.

| page | slot position | default companion | contextual VO triggers |
|---|---|---|---|
| `CompanionHubPage` | bottom-third, centred, fades at scroll | the companion currently viewed | bond-tier change; ask-topic exhausted |
| `AwakeningPage` | full-width, top, persistent | Elara | first wake (`cs_awakening` precedes); first hand on console |
| `MemorialCorridorPage` | bottom-third, left, dim | Elara | each fallen-crew plaque first read |
| `PetGardenPage` | bottom-right corner, small | Elara | first pet hatch; bond-milestone reached; pet death |
| `CharacterCreationPage` | left rail, persistent | The Human (substrate signal) | each archetype hover; final commit |

**Layout sentence (universal slot):**
*The MobileNarratorSlot is a 280px-wide rectangle with the
companion portrait at left (60px tall) and a single line of
typewriter caption at right; the slot fades in over 600ms,
holds for the duration of the line, and fades out over 300ms;
two slots never overlap — newer line replaces older with a
short crossfade.*

**Runtime contract:** Each page imports `MobileNarratorSlot`
and passes the per-trigger payload (`companionId, lineId`).
Trigger detection is per-page — the page knows when its
narratable beats fire and calls `slot.show({companionId,
lineId})`.

---

### 3.8 Shadow Tongue Multi-Stage Art Tiers — 24 rooms × 4 states

Today only Cryo Bay and Medical Bay have 4-state tier art
(`apps/shared/roomStateArtPrompts.ts`). 24 other rooms have
mystery flags but no art swap. This section locks the **4
tiers** and the **per-tier visual register** so each of the 24
rooms can be rendered in all four.

#### Universal 4-tier visual register

| tier | name | universal register |
|---|---|---|
| 0 | initial | room as authored in §2; no investigation marks |
| 1 | investigating | one yellow-tape "X" on each examined hotspot; subtle dust-disturbance around hotspots; one out-of-place item visible |
| 2 | partial-resolved | hotspot tapes turn cyan; an evidence cart appears at the room edge; an Investigator NPC silhouette is faintly visible (off-frame, implied) |
| 3 | case-closed | tapes are removed; evidence cart is gone; the room is "tidied"; one new memorial / closure object sits where the case-defining hotspot was (a brass plate, a cover sheet, a closed folder) |

**Per-room tier-3 closure object** must be specified per room
(authored in each room's §2.x.5 State Layer block when the
room is back-filled with the 13-row grid per the master plan).

The 24 rooms requiring tier art (excluding Cryo Bay + Med Bay
which already have it):

Bridge, Archives, Comms Array, Observation Deck, Engineering
Bay, Forge Workshop, Armory, Cargo Hold, Captain's Quarters,
Trophy Room, Antiquarian's Library, Guild Sanctum, Social Hub,
Station Dock, Engineering Core, Oracle Sanctum, Shadow Vault,
War Room, Cipher Den, Hierarchy Throne Sanctum, Chaos Forge,
Elemental Nexus, Quantum Lab, Synthesis Chamber.

**Runtime contract:** `roomStateArtPrompts.ts` extends from 2
rooms to 26; each entry specifies the four tier prompt
fragments. The renderer (`apps/client/src/game/roomStateAssets.ts`)
already reads from this map — no code change needed.

---

### 3.9 Soul Stones — purification / corruption economy

**What's missing (runtime):** zero DB tables, zero router, zero
card operation. Pure design doc
(`docs/design/SOUL_STONES_SYSTEM.md`). The `eidolonBonds` table
+ `soulStonesRouter` ship Eidolon-bond progression but **not**
the tri-state stone economy.

**What this section locks (art):** the **Resonance Pedestal**
(Med Bay), the **Corruption Circle** (Castle of Death), and the
**Favourites Shelf** (Personal Quarters).

#### 3.9.1 Resonance Pedestal — Med Bay Resonance Chamber

**Diegetic location:** Med Bay (§2.2), placed beside the helix
station inside the Resonance Chamber sub-room.

**Layout sentence:**
*A short white-marble pedestal ~80 cm tall stands in the
Resonance Chamber's pool of Dreamer-light; its top surface is
a shallow bowl that holds one to seven soul stones at a time;
violet stones glow neutrally, gold stones glow with active
warm light from within, red stones are absent here (cannot be
purified).*

**State Layer deltas:**
- `STATE — pedestal empty:` *bowl is dry, white-marble.*
- `STATE — pedestal violet count <N>:` *N violet stones in
  bowl, glowing neutral.*
- `STATE — pedestal gold count <N>:` *N gold stones in bowl,
  glowing warm; the bowl's marble glows from below.*
- `STATE — pedestal purifying:` *one stone in transit between
  violet and gold — visible mid-process as a stone with
  half-violet/half-gold internal glow; held for 24 IRL hours.*

**Hotspot:** inspect → reveals stone counts and purification
progress. Place violet stone → starts a 24-hour purification
timer. Take gold stone → adds to inventory.

#### 3.9.2 Corruption Circle — Castle of Death (Hellbox 2 pocket)

**Diegetic location:** Castle of Death pocket, reached via
Hellbox 2 in Hierarchy Throne Sanctum (§2.22).

**Layout sentence:**
*A summoning circle inscribed in red ochre and obsidian-flake
fills the Castle's central floor; the circle has seven nodes
around its perimeter and one central altar; red stones placed
on the nodes glow internally; gold stones cannot be placed
here (cannot be corrupted); the central altar accepts violet
stones and converts them to red.*

**State Layer deltas:**
- `STATE — circle empty:` *circle is etched but no stones
  placed.*
- `STATE — circle red count <N>:` *N nodes hold red stones,
  glowing.*
- `STATE — circle corrupting:` *one violet stone on the
  central altar mid-conversion — visible as half-violet/half-
  red internal glow.*
- `STATE — circle complete:` *all 7 nodes hold red stones;
  central altar holds the bound demon-pet's brass token;
  Hellbox 2 returns the player to Hierarchy Throne with the
  demon-pet now in inventory.*

#### 3.9.3 Favourites Shelf — Personal Quarters

**Diegetic location:** Personal Quarters favourites shelf
(existing décor slot).

**Layout sentence:**
*A 60-cm shelf at standing height holds up to seven soul stones
in arranged display; each stone sits in a recessed brass
fitting; violet stones are arranged left, gold centre, red
right; empty fittings are visible as brass impressions in the
shelf.*

**State Layer deltas:** one per stone-position-and-colour combo
(7 positions × 3 colours + empty = 22 states; renderer
permutes from a single shelf prompt by reading the player's
held-stones array).

**Runtime contract:** `soulStones` table needed: `(userId,
stoneId, colour: 'violet'|'red'|'gold', acquiredAt,
purifyingFromMs?, corruptingFromMs?)`. tRPC
`soulStones.getInventory()` returns the array. Server tick
checks active purify/corrupt timers and flips colour at expiry.
The three diegetic surfaces all read from this table.

---

### 3.10 Pet / Specimen Breeding — multi-generational diegetic surface

**What's missing (runtime):** the MVP queue ships
(`petBreedingPairs:7387` table + `petBreeding.ts` router); the
**multi-generational lineage** + **evolution chambers** per the
design doc are not wired.

**What this section locks (art):** **Breeding Wing**, **Genealogy
Tree**, **Evolution Chambers (3)**, **Bloodline Plinth**. All
located in Pet Garden (§2.28).

#### 3.10.1 Breeding Wing

**Layout sentence:**
*A wing of Pet Garden shaped as a long greenhouse alcove holds
six brass-and-glass incubation pods in two rows of three; each
pod is a half-metre transparent dome with a pet egg or hatchling
inside; pod bases are inset into the floor; pod-status is shown
by base-glow colour.*

**State Layer deltas (per pod):**
- `STATE — pod queued:` *pod is empty, dome dim, base cool-
  blue.*
- `STATE — pod incubating:` *pod holds an egg, dome warm-
  amber, base pulsing.*
- `STATE — pod ready:` *pod holds a hatchling, dome gold,
  base radiant.*
- `STATE — pod claimed:` *pod is empty, base dim again.*

**Hotspot:** examine pod → shows the breeding pair, expected
offspring traits, and timer.

#### 3.10.2 Genealogy Tree

**Layout sentence:**
*A vertical brass tree mounted on the Breeding Wing's back
wall; nodes are circular brass plates engraved with each pet's
glyph; lines connect parent-pairs to offspring; the player's
founder pets sit at the trunk, generations branch upward.*

**State Layer deltas:**
- `STATE — generations <N>:` *the tree shows N levels of
  generation; lower generations are dimmer brass, recent
  generations brighter.*
- `STATE — bloodline witness <milestoneId>:` *the milestone-
  triggering offspring's plate is rimmed with cool-violet (Lyra
  Vox's witness mark — see NOTES §12.5).*

#### 3.10.3 Evolution Chambers (3 — egg → growth → evolved)

**Layout sentence:**
*Three brass-and-glass chambers stand in a row at the Pet
Garden's far end, each ~1.4 m tall; chamber 1 is shaped for an
egg, chamber 2 for a juvenile, chamber 3 for an evolution
ritual; each chamber base has a touch-glyph that initiates its
phase.*

**State Layer deltas:** per chamber: `idle / occupied /
processing / complete` (4 each, 12 total).

#### 3.10.4 Bloodline Plinth

**Diegetic location:** Pet Garden centre.

**Layout sentence:**
*A waist-high obsidian plinth at the Pet Garden's centre bears
a polished brass plate engraved with the player's most-recent
Bloodline Witness Report from Lyra Vox; the plate is etched
fresh on each milestone (5 milestones per save, see NOTES
§12.5); previous reports are filed in the plinth's brass
drawer below.*

**State Layer deltas:**
- `STATE — plinth milestone <milestoneId>:` *plate engraves
  the named milestone's text.*
- `STATE — plinth filed count <N>:` *the drawer shows N filed
  reports as visible folded brass plates.*

**Runtime contract:** existing `petBreedingPairs` table extends
with `parentageGenealogy` JSON column for the tree;
`bloodlineWitnessReports` table needs a writer (the
`lyraVoxBloodlineWitness.ts` module is reference data only).

---

### 3.11 Living Character Sheet

**What's missing (runtime):** zero runtime references. Pure art
brief (`docs/production/LIVING_CHARACTER_SHEET_ART_BRIEF.md`).

**What this section locks (art):** the **Personal Quarters
Living Mirror** and the **Character Sheet HUD** as the two
diegetic surfaces that render the player character with all
equipped cosmetics, equipment, and morality state in real-time.

#### 3.11.1 Living Mirror — Personal Quarters

**Layout sentence:**
*A standing full-length mirror ~2 m tall in the Personal
Quarters main room; the reflection renders the player's
character as a Three.js paper-doll with all currently-equipped
cosmetic layers (aura, voice-pack chip on collar, music-pack
note on shoulder, title plate on belt, equipped weapons in
holster); the mirror's frame is brass with a slight ambient
glow that reflects morality alignment (cool-violet for machine,
warm-gold for human).*

**State Layer deltas:**
- `STATE — alignment machine:` *frame glow cool-violet; one
  fragment of the reflection is mechanical (e.g., a single
  servo joint visible at the wrist).*
- `STATE — alignment balanced:` *frame glow neutral white.*
- `STATE — alignment human:` *frame glow warm-gold; reflection
  is fully organic.*
- `STATE — equipping:` *one cosmetic layer is mid-fade — the
  new layer is at 50% opacity overlapping the old.*

#### 3.11.2 Character Sheet HUD

A persistent character sheet page accessible from any room.
Same paper-doll renderer as the Living Mirror; rotates 360°
on player drag; cosmetics can be equipped/unequipped from this
view and the change reflects in the mirror in real-time.

**Layout sentence:**
*A character sheet page renders the same paper-doll as the
Personal Quarters mirror in a 16:9 viewport at left;
right-rail tabs show equipment / cosmetics / loadouts / soul
stones; equip-actions trigger a 600ms fade between the old and
new cosmetic layer.*

**Runtime contract:** existing `PaperDollRenderer.tsx` extends
to read all equipped layers in real-time (today it reads only
on mount). Add a subscription to
`equippedCosmetics.subscribe()` so changes propagate without a
page refresh.

---

### 3.12 Hellbox Atlas

**Cosmology lock.** Hellboxes are diegetic portals into "parts
of the Matrix of the Dreams." They are *not* doors, *not*
elevators, *not* teleporters in the hard-tech sense — they are
**named breaches** between the Ark's physical interior and a
specific named pocket in the dream-substrate. Each Hellbox has
exactly three required artefacts in the production doc: a
**discovery scene**, a **room-state appearance**, and an
**opening cutscene**. Three Hellboxes are documented today.
Future Hellboxes (1–N) follow the same three-artefact
contract.

#### 3.12.1 Hellbox 1 — Medical Bay → (Hellbox launcher modal)

**Status:** existing in §2.2 Medical Bay; documented inline.
This entry hardens the spec to match Hellboxes 2 and 3.

**Discovery scene:** the player examines the Med Bay's
restricted-section panel for the first time after
`medbay_device_awakened`. The panel slides aside; behind it,
the original Hellbox surface (per §2.2) is revealed.

**Room-state appearance:** the Hellbox surface is a 1.6 m
violet mirror set into the bay wall, framed with brass; when
inactive, it reflects the bay; when active, it shows the
Matrix-pocket destination at half-opacity.

**Opening cutscene:** `cs_hellbox_1_open` (~6 s). Player
approaches; mirror's brass frame flares once; the violet
surface ripples once, then resolves to a rendered "view-into"
of the Matrix-pocket; the player walks through. End frame:
the player on the other side, looking back at the now-still
mirror.

#### 3.12.2 Hellbox 2 — Hierarchy Throne Sanctum → Castle of Death

**Status:** unbuilt; spec'd here. Located in §2.22 (to be
authored).

**Discovery scene:** plays once when player enters Hierarchy
Throne Sanctum after `faction:championed:hierarchy` AND
holds ≥1 violet soul stone. The throne's left armrest gives
way to reveal a recess; from the recess, a second Hellbox
surface manifests in the floor at the foot of the throne — a
ring of black obsidian flake, ~2 m diameter, with a violet
event horizon at its centre.

**Room-state appearance:**
- `STATE — hellbox_2 latent:` *the throne's left armrest is
  intact; floor at the throne's foot is unmarked.*
- `STATE — hellbox_2 manifest:` *armrest gives way; obsidian-
  flake ring is etched into the floor; centre of the ring
  shows a violet event horizon at half-opacity.*
- `STATE — hellbox_2 active:` *event horizon at full opacity;
  the Matrix-pocket "view-into" of Castle of Death visible
  through the ring.*

**Opening cutscene:** `cs_hellbox_2_open` (~10 s). Player kneels
at the throne's foot, places a violet soul stone on the
obsidian ring; the ring's centre opens; the player descends
through the event horizon. End frame: the player standing in
Castle of Death's central chamber, the obsidian ring visible
above them as a ceiling oculus. Per universal cutscene
direction (§3.1): no music, ≤1 short VO sentence (none here),
SFX-driven (obsidian-grind, single ring-flare tone, footstep
on basalt).

**Return path:** the obsidian-ring oculus above the player in
the Castle of Death pocket is a re-entry hotspot; examining
it returns the player to the Hierarchy Throne Sanctum
(reverse cutscene `cs_hellbox_2_close`, ~5 s).

#### 3.12.3 Hellbox 3 — Celebration School → Artist Prince Conspiracy Board

**Status:** unbuilt; spec'd here. The pocket destination is
the Celebration School's conspiracy-board chamber, where the
8-clue + 5-connection LucasArts-style board is staged (see
NOTES §12.4 Mystery Atlas).

**Discovery scene:** plays once when the player completes the
Bridge Conspiracy Board's first connection AND has read at
least one Antiquarian-Library lore-tome. The Bridge's tactical
display flickers; on its surface, a small chalk-mark appears
in the centre — a child's drawing of a school courtyard. The
chalk mark is a hotspot. Examining it for the third time
opens Hellbox 3 in front of the player on the Bridge floor.

**Room-state appearance (Bridge):**
- `STATE — hellbox_3 chalk-mark:` *the tactical display
  carries a small chalk-mark of a school courtyard at its
  centre; otherwise the Bridge is canonical.*
- `STATE — hellbox_3 manifest:` *a chalk-mark on the Bridge
  floor at the player's feet, ~1 m diameter, drawn in white
  and gold; it shimmers faintly.*
- `STATE — hellbox_3 active:` *the chalk-mark's centre opens
  to a rendered "view-into" of a sunlit school courtyard;
  the chalk lines around the opening shimmer brighter.*

**Opening cutscene:** `cs_hellbox_3_open` (~12 s). The player
steps into the chalk circle; the Bridge fades to white; the
player is in a daylit Celebration School courtyard, the
conspiracy board on a brass easel ahead of them. End frame:
the conspiracy board mid-frame, 8 clue cards arrayed but only
the first card lit. SFX: chalk-on-slate, distant child's
laugh (single, brief, cut short), playground swing creak,
single bird call.

**Return path:** examining the easel's underside reveals a
small brass rotary; turning it returns the player to the
Bridge with the chalk-mark dimmed (reverse cutscene
`cs_hellbox_3_close`, ~6 s).

#### 3.12.4 Future Hellboxes — naming + contract

When new Hellboxes are added (post-launch expansions, new
factions, new dream-pockets), each one MUST gain:

1. A canonical numbered name (`Hellbox <N>`) and a Matrix-pocket
   destination name.
2. A discovery scene with explicit unlock conditions.
3. A room-state appearance with the **three-state pattern**:
   latent / manifest / active.
4. An opening cutscene `cs_hellbox_<N>_open` and a closing
   cutscene `cs_hellbox_<N>_close`, both following §3.1
   universal direction.
5. An entry in this Atlas (§3.12.4+).

Hellbox count is enforced as part of the verification grep
(see plan): doc must reference exactly the Hellboxes
documented in this Atlas and no orphans.

---

*End of §3. §3.5 (Story Item Registry) authored separately
from NOTES §11.*

---

## 4. Cross-room scaling specs

Scaling specs that span multiple rooms or that drive the
visual model of a room whose canonical size has been
upgraded since shipping. The Trophy Room (§2.12) currently
ships as a 10-pedestal preview; §4.2 below replaces that
model with a multi-zone room that scales to 300+ items
without losing the recreation contract.

### 4.2 Trophy Room Scaling Spec

Replaces the legacy 10-pedestal Trophy Room model (§2.12.4
Layout Sentence) with a **7-zone multi-room layout** that
scales to all currently-shipped achievement, imprint,
essence, and cosmetic counts (~300 items) plus reserved
slots for ongoing seasonal additions. Six existing trophy
themes (`apps/shared/trophyDisplays.ts` — Heroic, Stoic,
Lyric, Ancient, Surreal, Crystalline) become a **room-skin
axis** on the visual-mood overlay rather than six pedestal
themes.

#### 4.2.1 Floor plan (7 zones)

A roughly oval room ~24 m × 14 m, divided into 7 named
zones arranged as a procession from entry (Title Wall) to
focal (Inscription Challenge plaque). Each zone has a fixed
position relative to room centre so the recreation contract
holds — zones do not move, only their contents change.

| zone | position | length | purpose |
|---|---|---|---|
| **Title Wall** | entry-arc, left wall | 8 m | scrolling frieze of every earned title |
| **Prestige Tier** | top dais, centre | 4 m radius | prestige-class items + prestige-cycle trim signature (per §3.2.2) |
| **Legacy Tier** | mid-room, right alcove | 5 m × 3 m | boss-kill mounts + hero artefacts |
| **Achievement Badges Rack** | mid-room, left alcove | 5 m × 3 m | modular tier banding (bronze/silver/gold/platinum/diamond) for ~50+ achievements |
| **Imprint Gallery** | back wall, full width | 12 m × 2 m | 90 character-imprint frames (one per shipped imprint; reserves slots for future) |
| **Essence Ledger** | reading lectern, right of Imprint Gallery | 2 m × 1 m | bound brass codex of 150+ Loredex essence entries; player-favourite drives open page |
| **Boss Cosmetics Rack** | rear-far alcove, behind Imprint Gallery | 4 m × 3 m | mannequins displaying boss-mastery cosmetic loadouts (scales with boss roster) |

The room's procession path (procession-stones inlaid in the
floor) connects: entry → Title Wall (left) → Prestige Tier
(centre dais) → Legacy Tier (right alcove) → Achievement
Badges Rack (left alcove) → Imprint Gallery (back wall) →
Essence Ledger (right of gallery) → Boss Cosmetics Rack
(rear-far) → return arc to entry.

#### 4.2.2 Layout sentence (verbatim, replaces §2.12.4)

*An oval ~24 m × 14 m hall with vaulted ceiling; entry
arch opens onto a procession-stone path that connects 7
named zones in a clockwise procession; the Title Wall
spans the entry-arc left wall as a scrolling brass frieze
of engraved titles; a 4 m circular dais holds the
Prestige Tier at the room's centre; the Legacy Tier
occupies the right mid-alcove with boss-kill mounts and
hero artefacts; the Achievement Badges Rack mirrors it on
the left mid-alcove with bronze/silver/gold/platinum/
diamond tier banding; the back wall is the Imprint
Gallery — 12 m of brass-framed character-imprint frames;
a single brass-rimmed reading lectern holds the Essence
Ledger codex to its right; the rear-far alcove holds the
Boss Cosmetics Rack mannequin bay; ambient palette per
the active room-skin theme (Heroic / Stoic / Lyric /
Ancient / Surreal / Crystalline — see §4.2.4).*

#### 4.2.3 Per-zone scaling rules

Each zone's content count scales independently. The
recreation contract requires that adding new items WITHIN
a zone does not change zone composition (only the items
themselves change), and that adding new items NEVER
changes zone position. Per-zone capacity model:

| zone | shipped count | capacity | overflow behaviour |
|---|---|---|---|
| Title Wall | ~30 titles | 100 | scroll-frieze becomes 2-row scroll above 100 |
| Prestige Tier | up to 5 prestige items | 5 | hard cap; new prestige items REPLACE oldest |
| Legacy Tier | per-boss mount + 1 artefact | unbounded | wall extends upward; hero artefacts on shelves |
| Achievement Badges Rack | ~50 achievements | 200 (40 per tier × 5 tiers) | overflow shows as small stacked badges in tier bin |
| Imprint Gallery | 90 frames | 90 (fixed) | hard cap; canon imprint count |
| Essence Ledger | 150+ essences | 500 (codex page count) | unbounded; player favourites drive visible page |
| Boss Cosmetics Rack | per-boss × tier-bonus | unbounded | mannequin row extends rearward |

#### 4.2.4 Room-skin axis (6 themes)

Six existing trophy themes (`apps/shared/trophyDisplays.ts`)
become a visual-mood axis. The player selects one theme as
their Trophy Room skin via a settings toggle (anchored to
`PaperDollRenderer.tsx` cosmetic equip surface in §3.11.2).
Per theme:

| theme | plinth material | ambient palette | accent | mood |
|---|---|---|---|---|
| **Heroic** | bronze | warm-amber | brass-rim | triumphal, classical |
| **Stoic** | grey marble | neutral white | iron-rim | restrained, formal |
| **Lyric** | rose-marble | rose-gold | brass-rim | poetic, elegiac |
| **Ancient** | weathered limestone | dust-amber | iron-rim | archaeological, ruin |
| **Surreal** | iridescent obsidian | shifting violet | indigo-rim | dream-state, uncanny |
| **Crystalline** | crystal-quartz | cool-cyan | silver-rim | austere, transcendent |

**State Layer delta (axis 6 visual-mood overlay):**
`STATE — trophy-skin <theme>:` *plinth material, ambient
palette, and accent shift to the named theme; all 7 zones
inherit the skin uniformly.*

#### 4.2.5 Per-zone State Layer deltas

In addition to the room-skin axis, each zone responds
individually to its content state:

- `STATE — title-wall earned <N>:` *N title plates engraved;
  100-N plates as polished brass blanks.*
- `STATE — prestige-tier cycle <N>:` *N prestige items on
  dais; dais trim matches §3.2.2 prestige-cycle colour
  (gold/platinum/diamond/obsidian-prism).*
- `STATE — legacy-tier mounted <N>:` *N boss-kill mounts +
  hero artefacts; oldest at top, newest at floor level.*
- `STATE — achievement-badge tier <T> count <N>:` *T = tier
  band (1=bronze, 5=diamond); N = badge count in that bin;
  tier banding visible regardless of fill.*
- `STATE — imprint-gallery filled <N>:` *N imprint frames
  carry portraits; 90-N frames are brass blanks with
  silhouette etchings.*
- `STATE — essence-ledger page <P>:` *codex open to page P
  (player's favourite or most-recent essence).*
- `STATE — boss-cosmetics-rack mannequins <N>:` *N
  mannequins display equipped loadouts; mannequins extend
  rearward into the alcove as N grows.*

#### 4.2.6 Hotspots

| Hotspot | Verb | Layer | Drives |
|---|---|---|---|
| Title Wall scrolling frieze | look | foreground | Title selector launcher |
| Prestige Tier dais | look, walk-onto | foreground | Prestige class display |
| Legacy Tier wall | look, examine each | midground | Boss-mastery launcher |
| Achievement Badges Rack | look, examine bin | midground | Achievement Gallery launcher |
| Imprint Gallery frames | look, examine each | foreground | Imprint detail launcher |
| Essence Ledger codex | use, turn-page | foreground | Loredex Viewer launcher (§9 unified) |
| Boss Cosmetics Rack mannequins | look, equip-from | midground | Cosmetic equip launcher |
| **Inscription Challenge plaque** (centre dais, behind Prestige Tier) | look, etch | foreground | Endgame closure object — etches player's chosen end-game alignment phrase |

#### 4.2.7 Discovery cutscene + HUD anchor

`trophy_first_zone_lit` (~12 s, replaces existing
`trophy_first_pedestal_lit`): on first entry post-multi-
zone-upgrade, the procession path ignites in clockwise
sequence; each zone briefly illuminates as the path
crosses it; final illumination on the Inscription
Challenge plaque (centre dais). HUD anchor: per-zone
launcher fires from each zone's primary hotspot (see
§4.2.6).

#### 4.2.8 Runtime contract

The 7 zones map to existing data registries:
- Title Wall → `playerTitles` (existing)
- Prestige Tier → `prestigeProgress` + `prestigeRewards`
- Legacy Tier → `bossMastery` (existing)
- Achievement Badges Rack → `loreAchievements` +
  `achievementCatalog` (existing)
- Imprint Gallery → `imprintsRoster` (90 imprints per
  Phase-1.5 audit)
- Essence Ledger → `loredexEssences` (150+ entries)
- Boss Cosmetics Rack → `bossMasteryCosmetics` (per-boss
  loadout)

The renderer reads from each registry independently; no
new schema needed beyond what each registry already exposes.
Room-skin axis (6 themes) reads from
`trophyDisplays.activeTheme` user setting.

---

*End of §4. §4.1 reserved for future cross-room specs.*

---

## 5. Mystery Atlas

The 6 canonical NPC mystery arcs × 5 episodes each = 30
episodes drive the densest narrative content in the
production doc. Each arc's clues are distributed across
3–5 rooms with multi-tier hotspot escalation. This chapter
catalogues per-arc, per-episode the hotspot location +
runtime flag + prompt fragment, plus the standalone Cryo
Bay 7-hotspot tier-tree, the Engineering 7 combine-rule
workbench, the Artist Prince Conspiracy Board, and
Bloodline Witness Reports. Distilled from NOTES §12.1
through §12.6.

### 5.1 The 6 NPC mystery arcs (30 episodes)

Each arc resolves a single character thesis. Episodes are
unlockable in sequence (E1 must be solved before E2
becomes hotspot-available). The final episode (E5) for
each arc is gate-restricted by trust-`<NPC>` ≥ 80 plus
ShadowTongue-power ≥ 60 (so high-power state reveals the
arc's full canon). Per-arc, per-episode references the
clue's manifest room + hotspot verb + prompt fragment.

#### 5.1.1 Wraith Calder arc — Crystalline-City fall + Hierophant resurrection

| ep | clue | room + hotspot | runtime flag | prompt fragment |
|---|---|---|---|---|
| E1 | Bounty file | Comms Array — broadcast cylinder | `wraith_arc_e1_bounty_collected` | *the bounty file's redacted layer is visible only when the broadcast screen pulses blue* |
| E1 | Witness journal (Antiquarian ep1-15) | Antiquarian Library — long-reading-table | `wraith_arc_e1_journal_read` | *a single bound brass volume open to the chronicle's middle pages, pages weighted with brass scribe-stones* |
| E2 | Substrate-N residue | Engineering Core — central forge plinth | `wraith_arc_e2_residue_analysed` | *a small brass-rimmed sample dish on the forge plinth holds a single drop of black-shifting residue* |
| E2 | Antiquarian marginalia | Antiquarian Library — Hierophant marginalia stack | `wraith_arc_e2_marginalia_read` | *the marginalia stack's topmost annotation is in fresh indigo ink, dated three days ago* |
| E2 | New Babylon customs manifest #4471 | Antiquarian Library — locked vault | `wraith_arc_e2_manifest_recovered` | *a single folded folio lies in the vault's brass tray, sealed with a New Babylon customs stamp in cracked wax* |
| E3 | Hierophant ceremony | Hierarchy Throne Sanctum — throne (sit) | `wraith_arc_e3_ceremony_witnessed` | *one of the seven ouroboros alcoves is dim — the alcove that should hold the Hierophant's sigil is empty* |
| E3 | Resurrection protocols | Antiquarian Library — locked vault | `wraith_arc_e3_protocols_recovered` | *a thin brass-bound sheaf in the vault's rear, three pages of script in a hand that is not the Antiquarian's* |
| E4 | Continuous witnessing | Cipher Den — uncorruption bench | `wraith_arc_e4_witnessing_traced` | *the bench's rear parchment shows the same indigo stamp as the Antiquarian's marginalia, dated centuries earlier* |
| E5 | Prophet's true identity | Antiquarian Library — Antiquarian's bust (use, gift violet stone, trust=100) | `wraith_arc_e5_prophet_revealed` | *the bust's brass eyes catch the candle-light at a different angle, revealing a scratch beneath one orbit* |

#### 5.1.2 Jericho Jones arc — Iron Lion + Akai Shi killing + Thaloria

| ep | clue | room + hotspot | runtime flag | prompt fragment |
|---|---|---|---|---|
| E1 | Callsign history card | Antiquarian Library — card catalog | `jericho_arc_e1_callsign_traced` | *a single card in the catalog drawer carries the Iron Lion sigil over a four-name lineage chain* |
| E1 | Iron Lion imprint protocol | Engineering Bay — instruction manual page 1 | `jericho_arc_e1_imprint_read` | *the manual's first page bears Lyra Vox's hand-pencilled note: "Step 1: Don't let it get stolen"* |
| E2 | Battle of Thaloria archon log | Antiquarian Library — card catalog (use) | `jericho_arc_e2_thaloria_read` | *a thicker brass-bound dossier card, the lower edge faintly marked by Antiquarian's index finger* |
| E2 | Akai Shi mercy token | Armory — low shelf | `akai_shi_mercy_recalled` | *a small obsidian-and-brass token rests on the low shelf, faintly warm to the touch — Akai Shi's last gift* |
| E3 | Pre-Fall Lionism code | Engineering Bay — instruction manual (use, tier 3) | `jericho_arc_e3_lionism_read` | *the manual's middle pages reveal pre-Fall handwriting in the same alloy-brass ink as the modern annotations* |
| E3 | Grip anomaly footage | Medical Bay — bio-bed (autoplay tier 2) | `jericho_arc_e3_grip_witnessed` | *the bio-bed's display loops a 2-s clip of an involuntary imprint-protocol grip-switch on a hand we cannot see* |
| E4 | Iron Lion oath token | Armory — rack centre, post-`jericho_oath_taken` | `iron_lion_oath_taken` | *a brass token forged in the shape of a lion's open mouth, sat in the rack's centre slot under glass* |
| E4 | Legacy / succession ledger | Antiquarian Library — Antiquarian's bust (talk, tier 2) | `jericho_arc_e4_legacy_read` | *the bust manifests one journal entry on the chronicle's open page; the entry's signature is Jericho's* |
| E5 | Contract inheritance scroll | Antiquarian Library — locked vault, post-trust-100 | `jericho_arc_e5_inheritance_revealed` | *a sealed scroll in the vault's lowest drawer, the seal still warm — broken only just now by the Antiquarian himself* |

#### 5.1.3 The Seer arc — DO-NOT-PLAY tape + VAR-1109A/B prophecy pair

| ep | clue | room + hotspot | runtime flag | prompt fragment |
|---|---|---|---|---|
| E1 | DO-NOT-PLAY band tape | Antiquarian Library — locked vault | `seer_arc_e1_band_observed` | *a single black-banded reel in the vault's brass cradle; the band is older than the tape itself, replaced by every reader* |
| E1 | Seer's sealed letter to Vex | Antiquarian Library — locked vault | `seer_arc_e1_letter_recovered` | *an unopened envelope addressed in Vex Solène's handwriting — to herself* |
| E2 | Hierophant marginalia VAR-1109A/B | Antiquarian Library — Hierophant marginalia stack | `seer_arc_e2_prophecy_pair_read` | *two adjacent annotations form a load-bearing pair, the lines of one citing the other in brass ink* |
| E3 | DEC-7710 catalog card | Antiquarian Library — card catalog | `seer_arc_e3_session_traced` | *a single card with a pre-printed date 70+ years ago and a Seer-pencil notation: "last consultation"* |
| E3 | Wraith's pre-rite journal flag | Antiquarian Library — Antiquarian's bust (look, tier 1) | `seer_arc_e3_pre_rite_read` | *the bust's plinth carries a small brass plaque: "Pre-rite witness, Wraith Calder, dated for [DEC-7710]"* |
| E4 | Acoustic signature on reactor | Engineering Bay — reactor-core | `seer_arc_e4_acoustic_traced` | *the reactor's standing-pulse hum carries a faint sub-harmonic that matches the recordings' carrier-wave drift* |
| E4 | Equipment signature fingerprint | Engineering Bay — reactor-core (talk, tier 2) | `seer_arc_e4_equipment_traced` | *the engineer's calibration plate bears Vex Solène's micro-stamp — every reactor-tuning across 40 years* |
| E5 | Canon Register paradox | Antiquarian Library — Antiquarian's chronicle | `seer_arc_e5_paradox_resolved` | *a single page in the chronicle is two pages — one written, one blank — placed in superposition by intent* |
| E5 | Seer's letter to Vex (delivered) | Antiquarian Library — long-reading-table | `seer_arc_e5_letter_delivered` | *the previously-sealed letter sits open on the reading table, the seal broken only now* |

#### 5.1.4 Vex Solène arc — 40-year career + apprentice handover + calibration session

| ep | clue | room + hotspot | runtime flag | prompt fragment |
|---|---|---|---|---|
| E1 | Equipment signature on reactor | Engineering Bay — reactor-core | `vex_arc_e1_signature_traced` | *the reactor's standing pulse carries Vex Solène's calibration micro-stamp visible only at trust ≥40* |
| E2 | Workshop-letter (undelivered) | Engineering Bay — reactor-core (use) | `vex_arc_e2_workshop_letter_read` | *a brass-bound letter rolled into the reactor's coolant-line, never sent — addressed "to the workshop"* |
| E2 | Insurgency-witness-roster (40 years) | Antiquarian Library — long-reading-table | `vex_arc_e2_witness_counted` | *a brass-cased ledger holds 19 names across 40 years of insurgency-witness invitations* |
| E3 | Apprentice's unsent letter | Engineering Bay — egg-eng-formula | `vex_arc_e3_apprentice_letter_read` | *behind the formula etching, a folded paper draft — the apprentice has waited two years for permission to send* |
| E3 | Ψ-null formula (door to nowhere) | Engineering Bay — egg-eng-formula | `vex_arc_e3_formula_decoded` | *a Ψ-null formula etched into the reactor housing in a hand that is half Vex's and half a stranger's* |
| E4 | Tool migration map | Engineering Bay — instruction manual appendix | `vex_arc_e4_migration_traced` | *a hand-drawn 6-month tool-migration map, every transfer dated, every transfer signed by both Vex and the apprentice* |
| E4 | Workshop diary (40 years) | Captain's Quarters — vex-workshop-diary | `vex_arc_e4_diary_read` | *a brass-bound diary on Lyra Vox's shelf, opened to today's entry — the apprentice's name is in the margin* |
| E5 | Scheduled session card | Engineering Bay — schematic-pad | `vex_arc_e5_session_scheduled` | *a brass card on the schematic pad announces a calibration session at 06:00 tomorrow, both signatures present* |
| E5 | Original rig decommissioned | Engineering Bay — instruction manual (use, tier 3) | `vex_arc_e5_rig_decommissioned` | *the manual's last page bears a single line: "Original rig decommissioned. Successor approved. With witness."* |

#### 5.1.5 The Degen arc — Coda trusteeship + Mol'Vereth audit

| ep | clue | room + hotspot | runtime flag | prompt fragment |
|---|---|---|---|---|
| E1 | Brokerage line #4711 | Engineering Bay — schematic-pad (look) | `degen_arc_e1_brokerage_traced` | *the schematic pad's centre carries one over-bright line in warm-gold (line #4711) — the Degen's first record* |
| E1 | Mol'Vereth's visiting card | Engineering Bay — schematic-pad binding | `degen_arc_e1_card_recovered` | *pressed into the schematic-pad's binding, a small brass calling card — Mol'Vereth's seal* |
| E2 | Quarterly routing pattern | Engineering Bay — blueprints (use) | `degen_arc_e2_pattern_traced` | *a foolscap scribble behind the unsigned blueprint, sketching a quarterly routing rhythm — by Hierarchy convention, discoverable on purpose* |
| E2 | Degen's Battle of Thaloria witness page | Antiquarian Library — long-reading-table | `degen_arc_e2_thaloria_witnessed` | *a witness page among the chronicle's middle pages: the Degen's testimony at Thaloria* |
| E3 | Coda Purpose Brief (6 pages) | Antiquarian Library — Coda's purpose shelf | `degen_arc_e3_brief_read` | *a six-page brass-bound brief on the rear-left bookcase: "four tests for trustee replacement"* |
| E3 | Audit-scope letter | Antiquarian Library — Coda's purpose shelf | `degen_arc_e3_scope_read` | *a single-page letter folded into the Brief, sealed only by procedural intent — testing failure-modes, not outcomes* |
| E4 | Treasurer's emergency note | Antiquarian Library — Coda's purpose shelf (use) | `degen_arc_e4_warning_read` | *a 3-day-prior warning, courtesy unusual under bylaws — slipped between Brief pages* |
| E4 | Audit-prep rehearsal note | Captain's Quarters — Degen's Corner | `degen_arc_e4_rehearsal_observed` | *a 3-column note on the Captain's small desk: brokerage-side / trustee-side / Coda-side* |
| E5 | Letter to the saga (sealed) | Antiquarian Library — Coda's purpose shelf (talk) | `degen_arc_e5_letter_sealed` | *a small sealed letter under the Brief — addressed to "whoever is left at the table when the audit closes"* |
| E5 | Empty chair at Ne-Yon | Captain's Quarters — Degen's Corner (use) | `degen_arc_e5_chair_empty` | *the Captain's small dining-station shows one chair pulled out and unfilled — reserved for the audit's outcome* |

#### 5.1.6 Game Master arc — Velkraal succession + Brel pre-read protocol

| ep | clue | room + hotspot | runtime flag | prompt fragment |
|---|---|---|---|---|
| E2 | Velkraal's posthumous letter | Antiquarian Library — Velkraal's correspondence folio | `gm_arc_e2_letter_read` | *a single brass-bound letter at the folio's top — names Brel'Sorrash as successor, requests quiet ratification* |
| E3 | Brel's practice edit-drafts | Engineering Bay — blueprints (talk) | `gm_arc_e3_drafts_observed` | *a stack of practice drafts behind the blueprint rack — every draft signed "read it, do not edit it"* |
| E4 | Velkraal's hand-written closing-edit | Antiquarian Library — Velkraal's correspondence folio (use) | `gm_arc_e4_closing_read` | *the folio's last page carries a single-line postscript: "read it, do not edit it" — the protocol-shift in writing* |
| E4 | Brel's pre-read initials | Antiquarian Library — Velkraal's correspondence folio (talk) | `gm_arc_e4_initials_observed` | *the closing-edit's margin shows Brel's pre-read initials — the protocol installed before the final session* |
| E5 | Final session protocol document | Engineering Bay — schematic-pad (talk) | `gm_arc_e5_protocol_observed` | *the schematic pad's brass tray holds a single new document — Brel's first observation under the new protocol* |

### 5.2 Cryo Bay 7-hotspot tier-tree

Per NOTES §12.2. Cryo Bay's investigation is the densest
single-room mystery in the doc. Each hotspot has multi-
tier escalation; later tiers gate later flags.

| hotspot | tiers | flags by tier |
|---|---|---|
| **Pod Zero (dead pod)** | 4 (pod-breathing → Shadow Tongue named → detective confirms → Hitchhiker beat) | tier 1: `pod_0_breathing`; tier 2: `shadow_tongue_named`; tier 3: detective confirms; tier 4: Elara notices stalling |
| **Cracked Panel** | 3 (practiced cut → tape unwatchable → Editor-resistant) | tier 1: cut practiced; tier 2: surveillance unwatchable; tier 3: editor-resistant |
| **Medical Chart** | 2 (redacted → Ψ-watermark identifies Lyra Vox) | tier 1: chart redacted; tier 2: `vox_named_in_cryo` |
| **Personal Effect (silver locket)** | 1 | `locket_opened` (body text scratched deliberately) |
| **Data-Slate (under pod)** | 1 | `cryo_data_slate_collected` |
| **Frosted Glass cord** | 1 | `cryo_torn_id_collected` (ID tag deliberately stolen) |
| **Combine: torn-id + data-slate** | 1 (terminal) | `cryo_mystery_victim_identified` AND Med Bay bulkhead unlock |

### 5.3 Engineering 7 combine-rule workbench

Per NOTES §12.3. Each combine recipe surfaces at the
Engineering crafting bench. See §3.5.6 for the full
ingredient → output → pickup-room table. The 7 outputs each
hold a runtime flag (`engineering_<output>_built`).

### 5.4 Artist Prince Conspiracy Board (LucasArts-style)

Per NOTES §12.4. Located in Celebration School, accessed
via Hellbox 3 (per §3.12.3). The board is a dedicated
LucasArts-style 8-clue + 5-connection layout with one
final Mol'Garath connection that fires the Act-6 trap.

#### 5.4.1 The 8 clue cards

| # | clue | acquisition condition |
|---|---|---|
| 1 | **Ghost on ramparts** | Bernardo + Malkia witness scene |
| 2 | **Uncle blocks messenger** | tampering with Lady Malkia |
| 3 | **Banner glitches** | propaganda layer visible (Shadow Tongue evidence) |
| 4 | **Ghost names Warlord** | direct testimony from departed |
| 5 | **Warlord reveals himself** | nanobot swarm visible (confession of authorship) |
| 6 | **Patron is Architect proxy** | cross-school seam (Mechronis → Celebration) |
| 7 | **First Celebration destroyed** | reconstruction is second; Mascoteers preserved |
| 8 | **Prince is Engineer** | two boys at 13 fixing clock; same words in Engineer Recording 3 |

#### 5.4.2 The 5 board connections (string-pinning)

| connection | links | meaning |
|---|---|---|
| Ghost ↔ Ghost-speaks | 1 → 4 | both sightings are the same ghost |
| Uncle-blocks ↔ Warlord-revealed | 2 → 5 | same actor |
| Banner ↔ Warlord | 3 → 5 | propaganda layer is Warlord's medium |
| First-destroyed ↔ Prince-is-Engineer | 7 → 8 | Engineer survived, grew up, built the bench |
| Patron ↔ First-destroyed | 6 → 7 | Architect watched first Celebration die |

#### 5.4.3 Mol'Garath's final connection (Act 6 trap)

A 6th connection is gated by audience-with-Mol'Garath
unlock. When all 8 clues + 5 connections are pinned, the
audience is offered. The 6th connection fires
`mol_garath_audience_completed` and triggers the Act-6
trap cinematic.

#### 5.4.4 Board completion math

50% clues (4/8) + 50% connections (3/5) → audience
unlocks. Below threshold, Mol'Garath silhouette is
visible at the easel base but does not engage; above
threshold, the silhouette steps forward.

### 5.5 Bloodline Witness Reports (Lyra Vox, 5 milestones)

Per §3.5.13. Detailed in NOTES §12.5. Each milestone
fires a Lyra Vox VO line at the Bloodline Plinth (Pet
Garden centre, per §3.10.4) and writes a witness-report
plate into the Plinth's lower brass drawer (filed reports
visible as folded brass plates).

### 5.6 LOREDEX entry catalogue (86 character entries)

Per NOTES §12.6. Source:
`apps/client/src/data/loredex-data.json`. 86 character
entries indexed `entity_1` through `entity_101`.
Notable narratively-load-bearing entries:

| entity_id | canonical name | act first introduced | manifest |
|---|---|---|---|
| 1 | The Programmer | Prelude | Loredex + transmission credits |
| 2 | The Architect | Act 2 | Loredex (gated) |
| 3 | CoNexus | Act 1 | Loredex (always available) |
| 4 | The Watcher | Act 3 | Loredex (gated) |
| 7 | Shadow Tongue | Act 2 | Loredex (gated by power level) |
| 47 | Dr. Lyra Vox | Prelude / Act 1 | Loredex + Bloodline Plinth + Mess Hall silhouette |
| 73 | Wraith Calder | Act 1 | Loredex + Wraith arc |
| 75 | Jericho Jones | Act 2 | Loredex + Jericho arc + Iron Lion oath |
| 91 | Mol'Garath | Act 3 | Loredex (gated) + Hellbox 3 trap |

The remaining 77 character entries plus 109 concept
entries are catalogued in the source JSON; the production
doc references them by entity_id for cross-reference.

### 5.7 Mystery Engine infrastructure (no current art)

Per NOTES §12.1 closing. Items where lore design exists
but per-room visualisation does not yet:

- **Acts 1–2 Conspiracy Boards** — framework exists; Acts
  3–7 ship with `secret_act_<N>_revealed` flags but Acts
  1–2 are dark
- **Arc-episode VO assets** — all clues / deductions /
  choices are authored; voice manifest keys exist; VO
  audio not produced
- **CADES helmet narrative surface** — image-fragments
  spec'd in §3.5.14 / §2.47 but per-mission dialogue
  lines are storyteller-author surface, unbuilt
- **Class-sanctum mysteries** — minimal (mostly cosmetic
  flags); spec'd inline per §2.17–§2.21

These are tracked in §3.5.17 (no-diegetic-home gap
registry).

### 5.8 Vote-spawned mysteries (1-episode interludes)

Per NOTES §12.1 final block. When a community-vote loses,
the losing option's "what if" thread surfaces as a
1-episode interlude. Template `TEMPLATE_VOTE_RESOLUTION_
SHORT`:

- 1 episode, 2 clues, 1 deduction, 2 choices
- Locations: Antiquarian Library (tally record) + Comms
  Array (path taken)
- Choices: Accept outcome (compliant weight) vs Contest
  closing (skeptical weight)
- Loredex unlock: `event_vote_<voteId>_closed`

### 5.9 Mystery Atlas runtime contract

Mystery state lives in `narrativeFlags` (per-arc, per-
episode flag tuples) plus `mysteryService.ts` for arc
progression. Per-room mystery modules in
`apps/shared/roomMysteries/<roomId>.ts`. Combine rules in
each room module's `combines` array. The Conspiracy Board
state lives on `playerMysteryChoices` (per-board pinned-
clues, pinned-connections, audience-unlocked).

LOREDEX entries surface bidirectionally: solving an arc
clue unlocks the related entity_id; reading an entity's
Loredex entry surfaces the related arc clue's room
hotspot.

---

## 6. Event-State Matrix

Distillation of NOTES §12.7. **22+ event systems** drive
room state across the Ark. **14 fully shipped, 5 partial,
3 scaffolded**. This chapter catalogues each event system
with its current shipped/partial/scaffolded status,
per-room reaction surface, and runtime data source. Where
a system is partial or scaffolded, the diegetic art is
spec'd in §3.

### 6.1 Shipped event systems (14)

| # | system | sources | brackets / outcomes | per-room reaction |
|---|---|---|---|---|
| 1 | **Seasonal Events** | `seasonalEvents.ts`, `seasonalReplay.ts`, `christmasInJuly` | 10+ × 14d windows + casino expansion + class mastery bonuses | every room: ±300K palette drift; Casino Floor §2.39 only during chess-in-July; Trade Hub §2.31 shop rotation |
| 2 | **Faction Standing** | `factions.ts`, `factionStandingService.ts`, 6-consequence `voteConsequences.ts` | 5 factions × 5 bands + threshold flags + cross-opposition echo | banners furl per band (Bridge §2.3, Station Dock §2.16, Hierarchy Throne §2.22, War Room §2.20, Guild Sanctum §2.14, Faction Succession Monument §2.42) |
| 3 | **Act Progression** | `act_N_complete` flags, `act*OpponentDialog.ts`, `act*PathDividend.ts` | 8 acts (Prelude + 1–7) | architectural tier upgrade (signage, lighting, hull plating); see §0.2 axis 1 |
| 4 | **Governance Hub Votes** | `governance.ts`, `governanceConsequenceMap.ts`, `architectConsole.ts`, `voteConsequenceApplier.ts` | 40+ votes × 3–5 options × 6 consequence types (set_flag / energy_delta / tome_entry / world_modifier / unlock / faction_delta) | Governance Chamber §2.40 (active vote); Daily Resource Board §2.41 (24h); Faction Succession Monument §2.42 (annual); Oracle Sanctum Annual §2.43 |
| 5 | **Epoch Witness** | `epochWitnessService.ts`, `epochWitnessVotes.ts`, `shadowTongueEdits.ts`, `shadowTongueDictionary.ts` | 5 epochs × 7 archetype gates × ShadowTongue power 0–100 + grandEditActive | Epoch Witness Conclave §2.44 (timeline + power meter); Nexus Point Sanctum §2.45 (per-epoch material); Prophecy Wall §2.46 (Antiquarian inscriptions); Cipher Den §2.21 (Uncorruption Bench) |
| 6 | **PvP / Arena / Leaderboard** | `tier5Pvp.ts`, `circuitPvpMatches`, `fightLeaderboard`, `IncursionLeaderboardEntry` | tournament cycles + rivalries + incursion weekly | Tournament Arena (existing) + Bridge §2.3 chip + Pet Arena §2.29 + Trophy Armory §2.34 + Trophy Room §2.12 |
| 7 | **Live Events / Architect Console** | `architectConsole.ts` (2244 lines) + `featureFlags` + `adminEvents` + `adminAuditLog` | admin-triggerable events; 46 feature unlocks | Bridge §2.3 banner + Governance Chamber §2.40 + War Room §2.20 |
| 8 | **Battle Pass** | `battlePassConfig.ts`, `battlePass.ts` router | 50 tiers × 60d seasons + theme bundle | every room: per-season particle layer overlay (≤5% frame); Personal Quarters cosmetic visibility; Trophy Room §2.12 + §4.2 zones |
| 9 | **Mission Outcomes** | `questline*.ts`, `personalQuestSubtasks.ts`, `collectorsWorkMissions.ts` | 30+ questlines × completion flags | NPC encounters across all rooms; quest log HUD; Mission Briefing pod §2.47 (CADES) |
| 10 | **Shadow Tongue Mysteries** | `roomMysteries/<id>.ts` (34 modules: 26 universal + 6 species) | per-room hotspot click sequences + corruption % per room | every room with a mystery module; investigation-tier axis 15 |
| 11 | **Prestige Cycles** | `prestige.ts`, `witnessingIntegrations.ts` carryover rules | per-player cycle 0/1/2/3+ | every room: rim trim per §3.2.2 (gold/platinum/diamond/obsidian-prism); Captain's Quarters Legacy Wall §2.11.8 |
| 12 | **Community Investigation** | `communityInvestigation.ts`, `communityDiscoveryMilestones` | global progress meters + milestone unlocks | Bridge §2.3 progress bar; Antiquarian Library §2.13 (new entries on milestone); Memorial Corridor §2.27 (community plaques) |
| 13 | **Notification Producers** (44/58 shipped) | `apps/db/schema.ts:1777` declared types; producers vary | 14 missing types (per §3.6) | Notification Bell + toast surface; per-room toast anchors |
| 14 | **Mobile Narrator** (partial adoption) | `MobileNarratorSlot.tsx` (303 lines) | per-page slot — 1 page imports today | Ark Explorer (only); 5 missing pages per §3.7 |

### 6.2 Partial event systems (5)

Per NOTES §12.7. Diegetic surfaces are pre-spec'd in §3
where applicable; runtime contract named per system.

1. **Yearly Events / Anniversary Cycles** — design exists
   for 12-event year-one calendar
   (`docs/design/YEAR_ONE_EVENTS_CALENDAR_V2.md`); no global
   `worldEvents` table or IRL-year-tick broadcaster.
   Diegetic surface: §3.2 (Year Ring Bridge ceiling +
   Prestige-Cycle Trim per-room + Anniversary Plaque rack
   Memorial Corridor).
2. **Trade Empire Mission Loop** — Phase D.5 schema landed
   (`tradeCompletedMissions`, `tradeDemands`,
   `tradeRouteSaturation`, `tradeResearchRaces`); no router
   procedures, no tick loop, no outcome broadcaster.
   **Largest design–runtime gap in the codebase.** Diegetic
   surface: §3.3 (4 surfaces — Trade Command Center, Cover
   Identity Board, Cargo Manifest Console, Broker's Office)
   + Trade Hub §2.31 + sub-room §2.32. **Owned by parallel
   TE agent.**
3. **Global Light/Dark Alignment Meter** — per-player
   alignment exists (`characterSheets.lightDarkAlignment`);
   server-wide aggregate doesn't. Diegetic surface: §3.4
   (Bridge Galaxy Meter HUD + per-room ±300K ambient
   temperature drift).
4. **Notification Producers (14 missing)** — declared in
   `apps/db/schema.ts:1777`; types unemitted include
   `pvp_challenge`, `epoch_quest`, `syndicate_quest`,
   `battle_pass_reward`, `boss_mastery`, plus 9 more.
   Diegetic surface: §3.6 (visual identity table + toast
   layout + inbox group).
5. **Mobile Narrator Adoption (5 pages)** — only
   `ArkExplorerPage` imports the slot. Missing imports:
   `CompanionHubPage`, `AwakeningPage`, `MemorialCorridorPage`,
   `PetGardenPage`, `CharacterCreationPage`. Diegetic
   surface: §3.7 (per-page positioning + companion + VO
   triggers).

(Borderline-partial: Shadow Tongue Multi-Stage Art Tiers —
only Cryo Bay + Med Bay have 4-state tier art today; 24
rooms have flags but no art swap. Diegetic surface: §3.8.)

### 6.3 Scaffolded event systems (3)

Per NOTES §12.7. Pure design; zero runtime; full diegetic
spec ready for runtime catch-up.

1. **Soul Stones System** — design in
   `docs/design/SOUL_STONES_SYSTEM.md`. Zero DB tables,
   zero router, zero card operation. Diegetic surface: §3.9
   (Resonance Pedestal Med Bay + Corruption Circle Castle
   of Death + Favourites Shelf Personal Quarters). Note:
   `eidolonBonds` table + `soulStonesRouter` ship the
   Eidolon-bond progression, NOT the tri-state stone economy.
2. **Pet / Specimen Breeding (full system)** — design in
   `BREEDING_SYSTEM_ART_PROMPTS.md` +
   `ART_DEPARTMENT_PRODUCTION.md §2.16`. The MVP queue
   ships (`petBreedingPairs:7387` + `petBreeding.ts`). The
   multi-generational lineage + evolution chambers per the
   design doc are not wired. Diegetic surface: §3.10
   (Breeding Wing + Genealogy Tree + Evolution Chambers (3)
   + Bloodline Plinth) + Pet Garden §2.28.
3. **Living Character Sheet** — design in
   `docs/production/LIVING_CHARACTER_SHEET_ART_BRIEF.md`.
   Zero runtime references. Diegetic surface: §3.11 (Living
   Mirror Personal Quarters + Character Sheet HUD).

(Borderline-scaffolded: 5 Named Cutscene Components — generic
`CutsceneOverlay.tsx` exists; the 5 named cutscenes
(Awakening, First Human Contact, Elara's Memory Recovery,
The Breaking Point, Thought Virus Manifests) are spec'd in
§3.1 but not implemented as named components.)

### 6.4 Top-10 "world-feels-alive" hooks (ranked)

The top-leverage gaps for "every decision shapes the
galaxy." Ranked by visibility × frequency × current-gap ×
player-impact:

1. **Global Light/Dark Alignment Meter** — Bridge HUD chip
   + per-room ±300K ambient drift (§3.4)
2. **Trade Empire Mission Loop** — 4 diegetic surfaces in
   §3.3, awaiting parallel-agent runtime
3. **Prestige Cycle visual variants per room** — rim trim
   per §3.2.2, ready to render
4. **Battle Pass theme per-room overlay** — particle layer
   per active season, ready to render
5. **Investigation tier art variants** — 24 rooms × 4
   tiers per §3.8, ready to render
6. **Faction-driven NPC presence + room livery** — per-
   room banner furls, sigil overlays, courier presence
7. **Seasonal cosmetic overlays on all rooms** — per-
   season decoration packs, awaiting authoring
8. **Governance vote consequence visible immediately** —
   already wired but per-room visualisation can deepen
9. **Companion trust cosmetics in rooms** — per-companion
   personal-effect placement at trust thresholds
10. **Vortex proximity sector-state rendering** — Cycle
    Phase axis 12 long-night visualisation

### 6.5 Per-room reaction matrix (axis × room cross-table)

Rather than a 33-room × 17-axis matrix (= 561 cells), the
production doc commits to the rule: **every room's §2.x.7/
§2.x.8 13-row back-fill grid IS the per-room reaction
matrix.** Each row in the back-fill is one axis; each
room enumerates its visible response to that axis. The
chapter §6.5 here is a navigation pointer — not a
duplicate.

For the canonical reaction per axis, find the relevant
row in the relevant room's back-fill grid:

| axis | grid row | rooms with load-bearing response |
|---|---|---|
| Axis 9 (TV infection) | row 1 | every Ark room (33+); Library §2.13 N/A (pocket immune) |
| Axis 10 (Governance modifier) | row 7 | every room (modifier flags drive subtle accents) |
| Axis 11 (Epoch / ShadowTongue) | row 8 | every room with text/inscriptions; Library §2.13 paradoxical-clearer |
| Axis 12 (Cycle phase) | row 9 | every room (±300K drift) |
| Axis 13 (Battle-pass theme) | (universal overlay) | every room (≤5% frame) |
| Axis 14 (Tournament window) | row 11 | tournament rooms (Arena, Trophy Armory, Chess Hall, Casino, Bridge, Station Dock) |
| Axis 15 (Investigation tier) | row 6 | every room with mystery module (34 modules) |
| Axis 16 (Prestige cycle) | (universal trim) | every room (rim trim per §3.2.2) |
| Axis 17 (Arc episode) | row 5 | rooms hosting arc clues (per §5.1) |

### 6.6 Event-State Matrix runtime contract

Most event systems already ship with database backing and
router procedures. The 5 partial + 3 scaffolded systems
have their runtime contracts named in §3.x.

Cross-system event flow (canonical):
1. Player action OR scheduled tick fires
2. Server router writes to `npc_public_flags` and/or
   relevant table
3. Consequence applier (e.g.,
   `voteConsequenceApplier.ts`) cascades to other systems
4. Client subscribes; per-room renderer re-renders with
   updated State Layer

The recreation contract (§1.7) holds: a single State Layer
delta per axis per render. When multiple axes change
between frames, the priority resolver (§0.2) selects ONE
axis to render visibly per render — others queue for
subsequent renders.

---

## 7. Subsystem State-Machine Diegesis

Distillation of NOTES §12.8. **9 user-named subsystems +
Soul Stones / Eidolon Bond bonus** — full state machines
mapped to diegetic art surfaces. Each subsystem's state
machine maps to specific room hotspots and visual
deltas. Where a subsystem has zero current Ark surface,
the §3.x sub-section spec'd the surface and §2.x rooms
landed it.

### 7.1 Cloning / Resurrection

State machine: `idle → open_resurrection_quest →
completed_path_a → path_a_resolved` (+ implicit
`path_b` for off-ship return). Per-NPC `cloneDegradation`
(1 = echo-cost, 2 = true permadeath). Per-NPC death
record + production-path on revive
(`productionPath: "resurrected"`).

| state | room manifest | art delta |
|---|---|---|
| idle | Cryo Bay normal | no extra marker |
| open_resurrection_quest | Cryo Bay + Med Bay annex | the resurrectable NPC's pod glows pre-warm |
| completed_path_a | Cryo Bay specific pod | pod prepares; pre-emergence haze |
| path_a_resolved | NPC visible in roster | resurrected NPC carries `cloneDegradation` echo glow (samsara echo) — subtle violet rim-light visible only at trust ≥40 |
| path_b (implicit) | external — off-ship | NPC absent; assumed lost |

5 resurrectable NPCs × 5 pod states = 25 pod states + a
shared room degradation ambient. Diegetic gaps remaining:
Cryo Bay Console (full pod-states + clone-degradation
meter); Resurrection Protocol Interface
(Med Bay annex sub-room); Echo Cost (samsara glow
on character sprites).

### 7.2 Pet Breeding (MVP)

State machine: `queued → incubating → ready → claimed`
(or `cancelled`). 7 elements (air/earth/fire/water/time/
space/probability) × 4 rarity tiers (common 0–40,
uncommon 40–65, rare 65–90, epic 90+). Source:
`apps/server/routers/petBreeding.ts` + `petBreeding.ts`,
DB table `petBreedingPairs:7387`.

Diegetic art at Pet Garden Breeding Wing (§3.10.1):
6 incubation pods, status by base-glow colour
(queued = cool-blue, incubating = warm-amber, ready =
radiant-gold, claimed = dim).

### 7.3 Pet Garden / Pet Arena

Lifecycle: `egg → hatched → growth → evolution_ready →
evolved → battle_ready → injured → retired/deceased`.
7 species × 4–7 evolution stages × 5 bond tiers × 3
activity states ≈ 1,000+ visual combinations. Source:
`petBattles.ts`, `petArenaOpponents.ts`, `petSkillTrees.ts`,
`petSpeciesTraits.ts`. DB: `playerPets`,
`petBattleHistory`.

Diegetic art at Pet Garden §2.28 (egg → growth zones),
Pet Arena §2.29 (battle floor + spectator), Pet Medical
Annex §2.30 (recovery tanks), Retirement Shrine
(rear of Pet Arena §2.29).

### 7.4 CADES (FPS, 7 missions + post-credit)

State machine: `locked → unlocked → m1_in_progress →
m1_complete → ... → m7_complete →
bridge_of_kael_post_credit`. Async PvP via
`cadesPvpMatches` (matchId, player1Id, player2Id,
scenarioSeed, scenarioMode, scores, status).

Diegetic art at CADES Console / Mission Briefing Pod §2.47
(Med Bay annex). Helmet captures one image-fragment per
mission completed; 7 fragments visible after M7 on the
helmet's interior surface, also etched to the rear-wall
plaques. Bridge §2.3 ambient state change post-M7.

### 7.5 Tower Defense

State machine: tower placement (`available → placed_lv1 →
upgraded_lv2 … 10 → destroyed`); raids (`proposed →
accepted → active → completed/abandoned`); daily streaks
(reward tiers at 1/2/3/5/7/14/30 days); siege lifecycle
(player initiates, waves spawn, towers placed, outcome
awarded). Source: `towerDefense.ts` + router. DB:
`towerPlacements`, `raidLogs`, `raidTrophies`,
`dailyStreaks`, `defenseWaves`, `tdLiveSieges`.

20+ tower types: laser_turret, missile_launcher,
barrier_wall, healing_pylon, artillery_cannon,
tesla_coil, oracle_spire, shadow_trap, etc. 16 leagues
(bronze_1 → legend).

Diegetic art at Defense Command Center §2.33 (tactical
grid + raid alerts + wave ticker + replay gallery),
Trophy Armory §2.34 (16 league tiers), Tower Assembly Bay
§2.35 (5 craft zones).

### 7.6 Chess

State machine: `pending_start → in_progress →
white_won/black_won/drawn/resigned`. 7 tutorial gates
(0–6). ELO ranking + character-style bonus
(Architect +200, Enigma +100, Oracle, Collector, Warlord
+ 5 more = 9+ play-styles). 365 daily puzzles.

Source: `chess.ts`, `chessClimb.ts`, `chessPuzzle.ts`,
`chessSideGate.ts`. DB: `chessGames`, `chessRankings`,
`chessTournaments`, `chessTournamentParticipants`,
`chessPuzzleProgress`, `chessTutorialProgress`.

Diegetic art at Chess Hall §2.36 (6 tournament boards + 9
character backdrops), Grand Master's Sanctum §2.37
(top-10 ladder room), Puzzle Study Chamber §2.38 (365
daily puzzles + 7 tutorial gates), Casino Gaming Floor
§2.39 (chess-in-July event).

### 7.7 Trade Empire (light-touch — owned by parallel agent)

State machine: missions (`available → dispatched →
in_progress → completed → claimed_reward`); sectors
(`locked → first_arrival → explored → contested →
controlled`); active covers (`active → exposed/expired`);
contracts (`proposed → signed → active → fulfilled`).
6 normalised tables: `tradeActiveMissions`,
`tradeCompletedMissions`, `tradeSectorReputation`,
`tradeActiveCovers`, `tradeClassSectorUnlocks`,
`tradeEmpireUserAggregates`.

Diegetic art at Trade Hub §2.31 + Trade Command Center
§2.32 with 4 sub-surfaces per §3.3 (Command Center, Cover
Identity Board, Cargo Manifest Console, Broker's Office).

### 7.8 Governance Hub Votes

State machine: `open → in_progress → closed →
outcome_announced → consequence_applied`. Vote types: 4
annual headlines (State of the Ark, Faction Succession,
Apocalypse Protocol, Oracle's Question) + monthly/
seasonal + 365 daily resource (binary A/B). 6 consequence
types: `set_flag`, `energy_delta`, `tome_entry`,
`world_modifier`, `unlock`, `faction_delta`.

Source: `governance.ts`, `governanceConsequenceMap.ts`,
`architectConsole.ts`, `voteConsequenceApplier.ts`. DB:
`dailyGovernanceVotes`. AI simulated voters mirror real
distribution.

Diegetic art at Governance Chamber §2.40 (active vote
projection + Antiquarian narrator + monument wall),
Daily Resource Allocation Board §2.41, Faction Succession
Monument §2.42, Oracle's Sanctum (Annual) §2.43.

### 7.9 Epoch Witness

State machine: `locked_behind_narrative_gate → unlocked →
available → vote_cast → result_tallied →
consequence_applied`. Shadow Tongue edits (active →
cleared → removed). Cumulative `shadowTonguePower` (0–100)
+ `grandEditActive` global state. 5 epochs (Privacy,
Prophecy, Insurgency, Revelation, Fall of Reality).
7 archetype gates.

Source: `epochWitness.ts` (router), `epochWitnessService.ts`
(service), `epochWitnessVotes.ts`, `shadowTongueEdits.ts`,
`shadowTongueDictionary.ts`,
`apps/shared/dlc/chapters/epoch_witness/index.ts`.

Diegetic art at Epoch Witness Conclave §2.44 (timeline +
power meter + archetype gates + voting history), Nexus
Point Sanctum §2.45 (per-epoch material aesthetic),
Prophecy Wall §2.46 (Antiquarian inscriptions + mirror
marginalia), Cipher Den §2.21 (Shadow Tongue Uncorruption
Bench).

### 7.10 Soul Stones / Eidolon Bond (10th subsystem — bonus)

Eidolon stages: `fragment → companion → ascended →
spectral`. Router: `soulStonesRouter`. DB: `eidolonBonds`
(bond level, XP, stage, rarity).

Note: this wires the **Eidolon-bond progression** —
NOT the Soul Stones purification/corruption economy
(§3.9). Two distinct systems: Eidolon-bond (shipped) and
Soul Stones tri-state (scaffolded).

Diegetic art at Eidolon Sanctum / Bond Chamber §2.48
(central altar + 4 stage-progression alcoves + bond-XP
indicator).

### 7.11 Subsystem coverage matrix

| subsystem | shipped runtime | shipped Ark surface | per-§2.x location |
|---|---|---|---|
| Cloning / Resurrection | yes | partial (Cryo + Med Bay annex) | §2.1 + §2.2 + §3.5.13 receipt plates |
| Pet Breeding (MVP) | yes | yes | §2.28 + §3.10 |
| Pet Garden / Pet Arena | yes | yes | §2.28, §2.29, §2.30 |
| CADES | yes | new (§2.47) | §2.47 + §3.1.4 cutscene |
| Tower Defense | yes | new (§2.33–§2.35) | §2.33, §2.34, §2.35 |
| Chess | yes | new (§2.36–§2.39) | §2.36, §2.37, §2.38, §2.39 |
| Trade Empire | partial | stub (§2.31, §2.32) | §2.31, §2.32 + §3.3 |
| Governance Hub Votes | yes | new (§2.40–§2.43) | §2.40, §2.41, §2.42, §2.43 |
| Epoch Witness | yes | new (§2.44–§2.46 + Cipher Den) | §2.44, §2.45, §2.46, §2.21 |
| Soul Stones / Eidolon Bond | partial (Eidolon yes, stones no) | new (§2.48) | §2.48 + §3.9 |

### 7.12 Subsystem runtime contract

Each subsystem's data lives in its named tables (per
§7.x.x). Subsystem state delta drives the per-room visual
delta via the per-room renderer reading the subsystem
state on render.

The recreation contract (§1.7) holds for subsystem-driven
rooms in the same way as for axis-driven rooms: a single
State Layer delta per axis per render. Subsystem state
maps to one or more axes (Cloning → axis 5 trust + axis 16
prestige cycle for echo glow; Soul Stones → axis 11
ShadowTongue + axis 6 morality alignment).

---

## 8. Storyteller Slot System

Distillation of NOTES §13.3 + §13.4. The production doc
commits to **8 storyteller-slot categories** — surfaces
where narrative authors can plug in new content WITHOUT
writing code. Plus a per-room narrative-seed catalogue
where Claude has imagined concrete seeds for storytellers
to expand or replace. This chapter documents the slot
contract + per-room seeds.

### 8.1 Storyteller-slot contract

A storyteller-slot is a JSON-driven content surface that:

- ships with a slot-shape contract (the schema for a new
  entry)
- accepts unlimited new entries via JSON file edit
- requires zero code recompile to surface new content
- exposes one or more diegetic surfaces for the new
  content to render

Each slot category below specifies (a) source file, (b)
slot schema, (c) diegetic surfaces, (d) example.

### 8.2 The 8 slot categories

#### 8.2.1 Transmission scripts

- **Source:** `apps/shared/transmissions.ts`
- **Slot schema:** title, memeIntro, memeOutro, synopsis,
  unlockTrigger (awakening_step/chapter_complete/level/
  trust/flag/room_visited/scheduled_broadcast/always),
  relatedLoredexEntries, videoUrl, category (music-video
  or narrative).
- **Surfaces:** Comms Array §2.5 broadcast cylinders,
  Rec Room media player, Loredex bidirectional unlock
- **Example:** the 11+ Epoch-1 episodes (Late Night with
  the Meme + others).

#### 8.2.2 Loredex marginalia / annotations

- **Source:** `apps/shared/shadowTongueDictionary.ts` +
  `loredexGraph.ts`
- **Slot schema:** entity_id, annotation text, indigo-
  marginalia visibility threshold (ShadowTongue power
  ≥ N), marginalia author (Antiquarian / Shadow Tongue /
  player).
- **Surfaces:** Antiquarian Library §2.13 spine
  annotations (rotation slot, ShadowTongue-driven);
  Cipher Den §2.21 Uncorruption Bench parchments;
  Loredex viewer.
- **Example:** the Margin Notes Evolution rotation
  (paradoxically clearer with higher power per §2.13).

#### 8.2.3 Room-inscription / plaque text

- **Source:** per-room mystery module
  `apps/shared/roomMysteries/<roomId>.ts` (hotspot JSON)
- **Slot schema:** hotspot id, name, description,
  elaraDialog (first-look response), per-tier text
  variants (1–4 tiers).
- **Surfaces:** every hotspot's examine text; plaques on
  walls (Memorial Corridor §2.27, Captain's Quarters
  Legacy Wall §2.11.8, Trophy Room Title Wall §4.2,
  Anniversary Plaques §3.2.3).
- **Example:** Cryo Bay's "Dead Pod" 4-tier hotspot text.

#### 8.2.4 NPC dialogue trees

- **Source:** `apps/shared/factionNPCs.ts` + per-NPC
  dialogue files
- **Slot schema:** NPC id, trust threshold (0/20/40/60/80/
  100+), dialogue scene id, scene text, per-archetype
  variants, narrative-flag callbacks.
- **Surfaces:** every NPC's appearance in any room;
  dialogue overlay; mobile narrator slot.
- **Example:** the 7 canonical NPCs (Elara, The Human,
  Agent Zero signal, Adjudicator Locke, The Source, The
  Antiquarian, Zyr'Koth) each with 5+ trust-gated
  dialogue scenes.

#### 8.2.5 Transmission ↔ Loredex unlocks

- **Source:** `transmissions.ts:relatedLoredexEntries`
- **Slot schema:** transmission id × array of entity_ids
- **Surfaces:** Loredex bidirectional discovery (watching
  transmission unlocks linked Loredex entries; reading a
  Loredex entry surfaces the related transmission).
- **Example:** an episode about the Engineer's last
  mission tags `[Engineer, Iron Lion, The Programmer]`
  — viewers auto-unlock those entries.

#### 8.2.6 Clue Journal entries

- **Source:** per-room mystery module's clues array
- **Slot schema:** clue id, source room, trigger
  (look/take/use/combine), text, optional Loredex unlock,
  optional narrative-flag set.
- **Surfaces:** Clue Journal HUD; in-room hotspot
  examine text; Cryo Bay 7-hotspot tier-tree (§5.2).
- **Example:** Cryo Bay's data-slate fragment +
  Engineering's 7 combine recipes.

#### 8.2.7 Loading-screen tips / quotes / epigraphs

- **Source:** (no central registry today — designed)
- **Slot schema (proposed):** tip id, theme tag (combat/
  lore/humor/prophecy/act-N), text (1–3 sentences),
  visibility condition (always / act ≥ N / faction-allied
  ≥ N).
- **Surfaces:** Loading overlay text + per-act epigraph
  (§3.1.1 boot sequence + per-act splash).
- **Example:** "The dawn approaches. The long night holds."
  (act 7 epigraph — see §3.4.1 Galaxy Meter).

#### 8.2.8 Achievement flavor text

- **Source:** `apps/shared/loreAchievements.ts` +
  `achievementCatalog.ts`
- **Slot schema:** achievement id, name, flavor text,
  unlock condition (flag tuple), reward (XP / cards /
  title), category (combat / lore / exploration /
  collection / titles).
- **Surfaces:** Achievement Gallery (§9 unified Trophy
  Gallery diegetic anchor), Achievement Unlock toast
  (per §3.6 visual identity table).
- **Example:** "Deciphered Ancient Prophecy — The past
  whispers. You have learned to listen."

### 8.3 Per-room narrative-seed catalogue

For each of the 33+ Ark rooms, this catalogue surfaces
2–4 narrative hooks + 1–2 expansion-reserved zones + 1
living-world detail. **All seeds are storyteller-author
surfaces** — narrative writers can expand, replace, or
discard freely. Claude-imagined seeds are flagged ⓒ.

The full catalogue lives in each room's §2.x.7/§2.x.8
"Storyteller hooks" row (axis grid row 12 — see §2.x).
Selected highlights from across the doc:

#### 8.3.1 Cryo Bay (§2.1)

- Silent Archives chronometer cycling timestamps ⓒ
- Last Message scratched behind sealed pod ⓒ
- Void Echo particles in Pod Zero fluid ⓒ
- Empty Armor Slot (specialised cryo-suit, never used,
  1 of 5) ⓒ
- **Living-world:** every 24 IRL hours the cryo unit cycles
  a 30-s defrost; every 7th day, one pod stutters

#### 8.3.2 Medical Bay (§2.2)

- Vox Neural Bridge journal expansion across tiers ⓒ
- Cure Notes for Patient X ⓒ
- Healer's Final Log (segmented audio in autoclave) ⓒ
- Unlabeled Vial growing colder/darker each month ⓒ
- **Living-world:** bio-bed vital-signs cycle once per
  minute; every 4th cycle, old patient stats flash
  (heart rate 0, flatline)

#### 8.3.3 Bridge / Command (§2.3)

- Ghost Commander's Shift Log (final entry blank reason)
- Consensus Breaking Point (Conspiracy Board flickers
  43↔44 connections daily)
- War Table Phantom Move (1 chess move per IRL day)
- Navigation to Nowhere ("Sanctuary" warp vector with
  all-zero coordinates) ⓒ
- **Living-world:** every 72 IRL hours a new connection
  line appears on the Conspiracy Board

#### 8.3.4 Antiquarian Library (§2.13)

- Forbidden Section sealed wing (decrypt at trust ≥ 80)
- Margin Notes Evolution (annotations multiply over
  weekly ticks — paradoxically clearer at higher
  ShadowTongue power)
- Blank Pages ("The Warlord's Ascension" redacted until
  trust = 100)
- Librarian's Personal Collection (small shelf) ⓒ
- **Living-world:** the Antiquarian visibly works the
  room; over weeks the Codex visibly expands with new
  entries

#### 8.3.5 Engineering Bay (§2.7)

- Incomplete Engine Schematic (final 8% deleted) ⓒ
- Counting Tally on wall (Human's day-count
  incrementing daily) ⓒ
- Engineer's Tool Set (one tool missing, locked in
  Captain's Quarters) ⓒ
- Recurring substrate-integrity heartbeat alert ⓒ
- **Living-world:** 10-min crafting sound-loop
  (whirr/ping/hiss) cycling endlessly

#### 8.3.6 Comms Array (§2.5)

- Queue of Lost Signals (centuries-spanning, partial
  unlock per signal) ⓒ
- Frequency Wall (52.7 MHz pure unmodulated sine =
  Human's substrate)
- Interrupted Conversation (half-recorded "the protocol
  … when to wake them") ⓒ
- Silence Beacon (24h pulse, distress signal from
  before wake) ⓒ
- **Living-world:** every hour soft radio chatter; every
  7 hours one phrase clear

#### 8.3.7 Trophy Room (§2.12 / §4.2)

- Ghost Trophy (achievement = unknown, secret-ending
  unlock) ⓒ
- Unreachable Trophy (Act 4 prestige) ⓒ
- Fallen Heroes Wall (player crew obituaries) ⓒ
- Inscription Challenge (player's legacy plaque) ⓒ
- **Living-world:** every visited achievement's plaque
  slowly glows brighter over IRL months (logarithmic)

#### 8.3.8 Captain's Quarters (§2.11)

- Ghost Commander's Reassignment Log (captain reassigned
  ALL crew to non-command compartments before cryo) ⓒ
- Master Key Reveal Flow (3-tier: spotted → recovered →
  first use)
- 10-plate Legacy Wall slot system (§2.11.8 enumeration)
- **Living-world:** every IRL day at the player's
  "morning" boot, the alcove hammock is unmade if used
  the previous session, made if it wasn't

#### 8.3.9 Mess Hall / Social Hub (§2.15)

- Memorial Wall (crew members leave mementos for fallen
  comrades) ⓒ
- Unfinished Game (chess set mid-game on a low table —
  advances 1 move per IRL day; players are the
  Antiquarian and the Programmer playing across
  centuries) ⓒ
- Storytelling Chalkboard (1 entry per IRL day; one
  reads "Don't trust the signal") ⓒ
- Rotating Crew Conversations (procedural per archetype) ⓒ
- **Living-world:** crew members visible in the lounge
  change every 6 IRL hours; befriended crew appear more
  frequently

#### 8.3.10 (and so on)

Remaining rooms — Observation Deck, Forge, Armory, Cargo
Hold, Guild Sanctum, Station Dock, Engineering Core,
Oracle Sanctum, Shadow Vault, War Room, Cipher Den,
Hierarchy Throne, Chaos Forge, Elemental Nexus, Quantum
Lab, Synthesis Chamber, Memorial Corridor, Pet Garden,
Pet Arena, Pet Medical Annex, Trade Hub + Command Center,
Defense Command Center, Trophy Armory, Tower Assembly Bay,
Chess Hall, Grand Master's Sanctum, Puzzle Study Chamber,
Casino Gaming Floor, Governance Chamber, Daily Resource
Board, Faction Succession Monument, Oracle Annual,
Epoch Witness Conclave, Nexus Point Sanctum, Prophecy
Wall, CADES Console, Eidolon Sanctum, Prelude rooms —
each carry their seed catalogue in the §2.x.7/§2.x.8
back-fill grid row 12.

### 8.4 Storyteller-author workflow

To author new content for an existing slot:
1. Identify the slot category (one of §8.2.1–§8.2.8).
2. Open the source file (per-category, named in §8.2).
3. Add a JSON entry conforming to the slot schema.
4. Verify it surfaces in the diegetic location named in
   §8.2 by running locally.
5. Commit + ship.

To author a new slot category (rare):
1. Define the slot schema as a new TypeScript file.
2. Add a renderer that surfaces the slot's entries in
   one or more rooms.
3. Document the new slot in §8.2.X (this chapter).
4. Existing storyteller-slots remain unaffected.

### 8.5 Storyteller-slot runtime contract

All 8 slot categories already have shipped runtime
infrastructure (per the source files named in §8.2). No
new schema needed.

Slot 8.2.7 (loading-screen tips/epigraphs) requires a new
`tips` JSON file + a renderer in `LoadingStates.tsx` /
`OpeningCinematic.tsx`. Spec'd here; runtime build
deferred.

---

## 9. HUD / UX / UI Production Manifest

Distillation of NOTES §13.1. **60+ surfaces across 12
categories.** Aggregate coverage stats: Void-Energy
adoption ~45%; framer-motion animation ~50%; audio
coverage ~15%; accessibility readiness ~25%; mobile
haptic unification 0%. This chapter catalogues every HUD/
UX/UI surface with its file path, current state, void-
energy adoption status, visual states, AAA-polish gap,
and diegetic equivalent in the Ark rooms.

### 9.1 Persistent chrome (7 surfaces)

| surface | file | adopted | states | diegetic equiv |
|---|---|---|---|---|
| **Top Navigation Bar / AppShell** | `AppShell.tsx` (482 lines) | yes | idle / hover / expanded / mobile | Bridge nav terminal §2.3 |
| **Morality Meter / Bar** | `MoralityMeter.tsx` (240+ lines) | yes | 9 tier states (Machine Ascendant → Balanced → Humanity Ascendant) | character's internal compass |
| **Notification Bell / Toast Stack** | `NotificationBell.tsx` + sonner toasts (`BonusToast.tsx`, `AchievementUnlockToast.tsx`) | partial | unread / hover / dismissed / 4 priority tiers | Elara comms whisper §2.3 |
| **Global Loading Overlay** | `LoadingStates.tsx`, `PageLoader.tsx`, `RoomTransition.tsx` | partial | spinner / progress-bar / cinematic-fade / route-gate | Ark airlock transition |
| **Network Status / Reconnecting Banner** | `ReconnectingOverlay.tsx` | minimal | reconnecting / offline / reconnected | Comms Array flash §2.5 |
| **Achievement Unlock Toast** | `AchievementUnlockToast.tsx`, `AchievementToast.tsx` | NO | entry-scale / hover / exit | Trophy Wall §2.12 |
| **Global Modal / Dialog Stack** | `dialog.tsx` (shadcn) + scattered modals | mixed | closed / entering / idle / exiting / backdrop-dismiss | quantum decision gates |
| **Voice-Line / VO Indicator** | `VoiceWhisper.tsx` (floating notification), `VoCaption.tsx` (subtitle) | NO | appearing / reading / disappearing / muted | Elara comms radio chatter |

### 9.2 Player identity (4 surfaces)

| surface | file | adopted | diegetic equiv |
|---|---|---|---|
| **Character Portrait / Avatar Frame** | `AnimatedPortrait.tsx`, `PaperDollRenderer.tsx`, `SpriteCharacter.tsx` | mixed | Personal Quarters mirror §3.11.1 |
| **Level / XP Progress Bar** | `Progress.tsx` (shadcn) + scattered | mixed | Bridge authority readout §2.3 |
| **Resource Counters** (Dream / Void Crystals / Soul Stones / faction standing) | scattered — no unified component | **fragmented (no Void-Energy adoption)** | Personal Quarters resource shelf |
| **Cosmetic Display Chip** | `CharacterAuraOverlay.tsx`, `ShaderOverlay.tsx` (GLSL) | yes | Personal Quarters mirror §3.11.1 |

### 9.3 Combat / card-duel (10 surfaces)

| surface | file | adopted | states | diegetic equiv |
|---|---|---|---|---|
| **Hand Fan / Card Hand Display** | `DuelystGameUI.tsx` (2043 lines, embedded) | NO | idle / hover / selected / dragging / played / lock | physical card deck draw |
| **Field / Board** | `BoardRenderer.tsx` (Pixi.js) | NO | idle / hover / selected / attacked / death / targeted | tactical arena war-room |
| **Resource Pool / Mana Bar** | embedded in `DuelystGameUI.tsx` | NO | idle / gaining / spending / overflow / depleted | mana-tank in war-room floor |
| **Health / Shield Meters** | embedded + `WarlordCountdownIndicator.tsx` | NO | idle / damage / heal / shielded / shield-break / low / death | environment damage indicators |
| **Targeting Reticle / Selection Indicator** | embedded in `BoardRenderer.tsx` | NO | idle / hover-valid / hover-invalid / locked | Arktech crosshairs |
| **Trigger Stack / Spell Queue Visualizer** | text-only embedded | NO | idle / queuing / resolving / proc | hanging crystalline spell-boards |
| **Replay Scrubber / Timeline Scrub** | **MISSING ENTIRELY** | n/a | n/a | memory-crystal viewer |
| **Match Summary / End-of-Battle Screen** | `MatchSummary.tsx` (290 lines, adopted) | yes | idle / win / loss / loading / expanded / mobile | Personal Quarters memorabilia §2.11 |
| **Deck Builder UI** | `DeckBuilder.tsx` | NO | idle / adding / hover / save / invalid / mobile | deck-crafting table in library |
| **Pack Opening Ceremony** | `PackOpening.tsx` | NO | sealed / opening / reveal / rare / epic / legendary | unwrapping station holo-projection |

### 9.4 Narrative (5 surfaces)

| surface | file | adopted | diegetic equiv |
|---|---|---|---|
| **Dialogue Box / NPC Conversation** | `CinematicDialogOverlay.tsx`, `ElaraDialogBox.tsx` | yes | NPC speech bubbles in-world |
| **Choice Menu / Branching Dialogue** | `ChoicePanel.tsx`, `Act1ClosingChoicePanel.tsx` | mixed | holographic choice-pillar (light/dark sides) |
| **Loredex Viewer** | scattered (`LoreGalleryPage.tsx`, individual modals — **MISSING UNIFIED COMPONENT**) | partial | Antiquarian Library §2.13 + Archives §2.4 |
| **Transmission Video Player** | `TransmissionDisplay.tsx`, `CoNexusMediaPlayer.tsx` (no unified component) | NO | Comms Array §2.5 broadcast cylinders |
| **Codex / Journal Pages** | `AwakeningJournalEntry.tsx`, `CodexPage.tsx`, `ClueJournal.tsx`, `LoreJournalPage.tsx` (4 implementations) | partial | Library reading bench §2.13 |
| **Achievement Gallery** | `AchievementsGalleryPage.tsx` | partial | Trophy Room §2.12 + §4.2 zones |
| **Title Screen / Chapter Splash** | `TitlePage.tsx`, `TitleBootSequence.tsx`, `OpeningCinematic.tsx` | partial | Prelude §2.49 |

### 9.5 Navigation / room (5 surfaces)

| surface | file | adopted | diegetic equiv |
|---|---|---|---|
| **Ark Map / Deck Navigator** | `ShipSchematicMap.tsx`, `ArkFastTravelModal.tsx`, `ArkOrientation.tsx` | partial | Bridge holographic ship map §2.3 |
| **Room Entry Transition / Door Open** | `RoomTransition.tsx`, `ArrivalCinematicRenderer.tsx` | partial | airlock door cycle |
| **In-Room Hotspot Indicators / Point & Click Anchors** | `PointAndClickScene.tsx` + scattered hotspot impls | partial | interactive surfaces in-world |
| **Mystery Clue Tracker / Investigation UI** | `CADESClueBoard.tsx`, `ClueJournal.tsx`, `CADESFeed.tsx` | partial | corkboard in investigation chamber |
| **Mission Tracker / Quest Log** | `QuestTracker.tsx`, `PetQuestTracker.tsx`, `QuestBoardPage.tsx` | mixed | quest terminals holo-board |

### 9.6 Inventory / collection (6 surfaces)

| surface | file | adopted | diegetic equiv |
|---|---|---|---|
| **Card Collection / Card Gallery** | `CardBrowserPage.tsx`, `CardGalleryPage.tsx`, `CollectionView.tsx` | partial | Library digital card catalog §2.13 |
| **Cosmetics Catalog / Equipment Shop** | `CosmeticShopPage.tsx`, `StorePage.tsx` | partial | Personal Quarters wardrobe |
| **Pet Roster / Companion Management** | `PetRoster.tsx`, `PetGardenPage.tsx` | partial | Pet Garden §2.28 |
| **Loadout Switcher** | **MISSING ENTIRELY** | n/a | Armory §2.9 holo-interface |
| **Soul Stone Wallet / Resource Inventory** | `SoulStonesPanel.tsx` (adopted) + scattered | partial | Personal Quarters favourites shelf §3.9.3 |
| **Trophy Gallery** | `TrophyRoom.tsx` | partial | Trophy Room §2.12 + §4.2 |

### 9.7 Multiplayer / social (7 surfaces)

| surface | file | adopted | diegetic equiv |
|---|---|---|---|
| **Friends List / Social Roster** | **MISSING ENTIRELY** | n/a | Personal Quarters comms panel + Guild Sanctum §2.14 |
| **Guild Hub / Crew Management** | `GuildPage.tsx`, `CrewRosterView.tsx` | partial | Guild Sanctum §2.14 |
| **Chat / Messaging UI** | **MISSING ENTIRELY** | n/a | comms channel overlay |
| **Party Invite / Group Formation** | **MISSING ENTIRELY** | n/a | squad briefing in war-room |
| **Live Event Banner / Limited-Time Announcement** | `FactionWarEventBanner.tsx`, `SeasonalEventsPage.tsx` | partial | Bridge banner + PA system |
| **Leaderboard / Arena Bracket** | `LeaderboardPage.tsx`, `FightLeaderboardPage.tsx` | partial | tournament-hall holo-wall |
| **Spectator Mode / Match Observation** | `SpectatorPage.tsx` | NO | Pet Arena spectator §2.29 |
| **PvP Matchmaking Lobby** | **MISSING ENTIRELY** | n/a | arena entry waiting area |

### 9.8 Meta / admin (11 surfaces)

| surface | file | adopted | diegetic equiv |
|---|---|---|---|
| **Settings / Preferences** | `SettingsPage.tsx`, `SettingsSearchModal.tsx` | partial | system-config holo-panel |
| **Audio Settings** | embedded | partial | audio mixer panel |
| **Video Settings** | embedded | partial | display-settings panel |
| **Accessibility Settings** | embedded (UNDERBUILT) | NO | ADA-compliance panel |
| **Control / Keybinding Settings** | **MISSING REBINDER** | n/a | input-config terminal |
| **Language / Localization** | embedded | NO | localization selector |
| **Account / Billing** | `PlayerProfilePage.tsx` (minimal) | NO | account-management terminal |
| **Authoring / Admin Console** | `ArchitectConsolePage.tsx`, `ArchitectDossierPage.tsx` | partial | architect-mode interface |
| **Live-Event / GM Overlay** | **MISSING ENTIRELY** | n/a | GM operator dashboard |
| **Battle-Pass / Season-Pass Progress UI** | `BattlePassPage.tsx` | partial | season-tracker holo-display |
| **Governance Hub Voting UI** | `GovernanceHubPage.tsx` | partial | Governance Chamber §2.40 |

### 9.9 Mini-games (4 surfaces)

| surface | file | adopted | diegetic equiv |
|---|---|---|---|
| **Chess Board / Match UI** | `ChessBoard.tsx`, `ChessPieces.tsx`, `ChessSessionBanner.tsx`, `ChessPostGameReview.tsx` | partial | Chess Hall §2.36 + Grand Master Sanctum §2.37 |
| **Chess Timer / Clock** | embedded in ChessBoard | NO | match-clock arena wall |
| **Pet Arena Spectator** | embedded | NO | Pet Arena gallery §2.29 |
| **Trade Empire HUD** (light touch — owned by parallel agent) | `LockeConfidentialLedgerPanel.tsx` adopted | partial | Trade Hub §2.31 + sub-rooms §2.32 + §3.3 |

### 9.10 Mobile-specific (2 surfaces)

| surface | file | adopted | diegetic equiv |
|---|---|---|---|
| **Touch Controls / Gesture Overlays** | `GestureTutorial.tsx` | NO | on-screen gesture hint overlay |
| **Haptic Feedback Hooks** | scattered (no unified system) | **NO UNIFIED SYSTEM** | tactile response sim |

### 9.11 Audio (4 surfaces)

| surface | file | adopted | diegetic equiv |
|---|---|---|---|
| **Music Swap Surface / Room-Specific Track Selector** | (auto, no UI) | NO | music console Personal Quarters |
| **Ambient Audio Loop Indicators** | (no indicator) | NO | environment-sound mixer |
| **VO Subtitle Overlay** | `VoCaption.tsx` (covered §9.1) | NO | closed-caption holo-overlay |
| **Audio Cue Accessibility (Deaf-Mode)** | **MISSING ENTIRELY** — critical accessibility gap | n/a | deaf-mode visual indicators |

### 9.12 Accessibility (5 surfaces)

| surface | file | adopted | diegetic equiv |
|---|---|---|---|
| **Colorblind Mode** | embedded (toggle only, no preview) | NO | neural-implant colour shift |
| **Reduced-Motion Mode** | embedded (toggle exists, NOT wired to framer-motion) | NO | motion-sensitivity adjustment |
| **Subtitle / Caption Layer** | `VoCaption.tsx` (covered §9.1, §9.11) | NO | closed-caption overlay |
| **Screen-Reader Hooks / ARIA** | `a11y.tsx` (`ScreenReaderOnly` utility) | partial | neural-implant text-to-speech |
| **Keyboard Navigation Indicators** | (default browser focus-outline only) | NO | alternate-input mode |
| **Font-Size Scaler** | **MISSING IN-APP** | n/a | text-magnification control |

### 9.13 Components missing entirely (11)

Per NOTES §13.1. Each requires a new component plus
diegetic surface in §2.x:

1. **Friends List** — Guild Sanctum §2.14 anchor
2. **Chat / Messaging** — Social Hub §2.15 anchor
3. **Party Invite** — Social Hub Mess Hall §2.15 + War
   Room §2.20 anchor
4. **PvP Matchmaking Lobby** — Pet Arena §2.29 +
   tournament arena entry anchor
5. **Replay Scrubber** — Defense Command Center §2.33 +
   Pet Arena §2.29 + CADES Console §2.47 anchor
6. **Loadout Switcher** — Armory §2.9 anchor
7. **Unified Resource Counter** — Engineering §2.7 +
   Personal Quarters §3.11.1 anchor
8. **Unified Loredex Viewer** — Antiquarian Library
   §2.13 anchor
9. **Unified Transmission Video Player** — Comms Array
   §2.5 anchor
10. **Live-Event GM Overlay** — Architect Console + Bridge
    §2.3 anchor
11. **Audio-Cue Deaf-Mode visual indicators** — universal
    overlay (critical accessibility gap)

### 9.14 HUD/UX runtime contract

Each surface lives in its named file (per §9.x tables).
Adoption status reflects the Tier-3A Void Energy
migration. Components missing entirely (§9.13) need new
files; spec'd in §3 sub-sections where named.

The recreation contract for the rooms (§1.7) is
unaffected by HUD changes — HUD overlays sit ABOVE the
room render and do not change the State Layer.

---

## 10. AAA Polish Brief

Distillation of NOTES §13.1 top-15 ranked polish targets.
This chapter authors the AAA-polish recipe per surface:
signature-feel target, audio-design hook, particle/VFX
recipe, haptic pattern, accessibility wiring. **Treats
"juice" as a first-class art-pass deliverable, not a post-
ship retrofit.**

### 10.1 Polish ranking methodology

Rank = visibility (how often the player sees it) ×
frequency (how often it fires per session) × current-gap
(distance from "best-in-class") × player-impact (does
this surface change how the player feels). Top-15 listed
in priority order. Each entry below carries:

- **signature-feel target** — the AAA mood reference
- **animation curve** — the framer-motion / cubic-bezier
  recipe
- **audio recipe** — SFX hooks (no music — per §3.1
  universal direction, which extends to HUD work)
- **VFX particle recipe** — particle behaviour (count,
  curve, decay, colour)
- **haptic pattern** — mobile vibration pattern
- **accessibility wiring** — reduced-motion fallback,
  ARIA hooks, deaf-mode visual indicator

### 10.2 Top-15 polish targets

#### #1 Morality Meter tier-up celebration

- **Surface:** `MoralityMeter.tsx`
- **Visibility × frequency:** every 2–3 hours,
  alignment-defining
- **Signature-feel:** "meridian crossed" — the player
  has shifted alignment
- **Animation curve:** scale-burst (1.0 → 1.18 → 1.0) ×
  glow-burst (0 → 100% rim-light → 30% steady) over
  900 ms cubic-bezier(0.34, 1.56, 0.64, 1)
- **Audio recipe:** single low-pitched bell tone at
  threshold cross + soft sub-harmonic hum 600 ms after
- **VFX particle recipe:** 24 micro-particles per side
  (machine-spark = sharp blue-white sparks for Machine
  Ascendant; organic-bloom = soft warm-amber petals for
  Humanity Ascendant); 600 ms decay; gravity-falling
- **Haptic:** single 80 ms pulse at threshold cross
- **Accessibility:** reduced-motion = scale stays 1.0 +
  glow holds 1 frame; ARIA live-region announces
  "Tier crossed: <new tier>"; deaf-mode = visual
  particle burst is sufficient indicator; no audio cue
  required

#### #2 Hand Fan card juice + audio

- **Surface:** `DuelystGameUI.tsx` hand-rendering
- **Signature-feel:** physical-deck draw — every card
  feels like it has weight
- **Animation curve:** fan-out entrance cubic-bezier(0.0,
  0.0, 0.2, 1) over 320 ms; per-card stagger 28 ms;
  hover-lift y -20 px + scale 1.05 over 180 ms; drag-
  ghost rotation -3° + opacity 0.6
- **Audio recipe:** card-draw whoosh (low-frequency
  paper rustle, 80 ms); card-hover soft tick (high-
  frequency click, 25 ms); card-select thock (mid-
  frequency wood-on-wood, 60 ms); card-played fly-off
  whoosh + impact tap
- **VFX particle recipe:** 6-particle dust trail on
  draw (warm-amber); 12-particle glow burst on play
  (faction-colour-tinted)
- **Haptic:** light tick on card-hover (12 ms); medium
  pulse on card-lift (40 ms); strong tick on card-played
  (60 ms)
- **Accessibility:** reduced-motion = instant card
  positions, no fan-out animation; ARIA = card name +
  cost + rarity announced; deaf-mode = card-action
  visual outline pulse for 200 ms

#### #3 Match Summary win/loss fanfare

- **Surface:** `MatchSummary.tsx`
- **Signature-feel:** triumphal celebration / mournful
  diminution
- **Animation curve:** stat-card entrance cascade
  120 ms stagger; win-state scale-up + gold rim-light
  ignite over 800 ms; loss-state stat-cards shrink to
  0.85 + grey-tint
- **Audio recipe:** **win** = brass-fanfare 4-note
  rising sequence (1 s); **loss** = single low cello
  drone (1.5 s); both followed by post-fanfare silence
  before stat-narration
- **VFX particle recipe:** **win** = 60 confetti
  particles in faction colour with gravity, 2-s decay;
  **loss** = 12 ash particles drifting upward, 2-s decay
- **Haptic:** **win** = 4 pulses in fanfare rhythm;
  **loss** = single long hum pulse
- **Accessibility:** reduced-motion = no entrance
  cascade, instant cards; ARIA = match result + key
  stats; deaf-mode = visual fanfare animation enough

#### #4 Loading / Route Transition contextual messaging + parallax

- **Surface:** `LoadingStates.tsx`, `PageLoader.tsx`,
  `RoomTransition.tsx`
- **Signature-feel:** anticipation, not waiting
- **Animation curve:** parallax camera-pan over Ark
  room entry 600 ms; loading messaging fades in 200 ms,
  cycles per actual load stage ("Boarding Ark…",
  "Calibrating ambient…", "Resolving room state…")
- **Audio recipe:** soft sub-bass hum during load;
  single high chime at completion (200 Hz mass tone,
  120 ms attack, 400 ms decay); no music
- **VFX particle recipe:** none during load; 8-particle
  warm-amber sparkle at completion
- **Haptic:** single light pulse at completion
- **Accessibility:** reduced-motion = no parallax,
  static fade only; ARIA = loading status announced;
  deaf-mode = completion sparkle is sufficient

#### #5 Combat-board audio design pass

- **Surface:** `BoardRenderer.tsx` (Pixi.js)
- **Signature-feel:** tactical weight — every action
  has consequence
- **Animation curve:** existing animations preserved
- **Audio recipe (per action):**
  - tile-hover: soft click 18 ms
  - attack: slash-attack pitch up + impact thunk
  - death: low descending tone 400 ms + crack
  - knockback: woof + body-impact 150 ms
  - heal: rising sparkle 300 ms
  - shield: glass-tink 80 ms
  - end-of-turn: brass-bell single tone
- **VFX particle recipe (per action):**
  - tile-hover: subtle 4-particle highlight
  - attack: 12-particle weapon-trail in unit colour
  - death: 18-particle shatter, scatter pattern
  - environmental weather: rain = board-soak glow
- **Haptic:** light pulse on tile-hover (mobile);
  medium thump on attack; strong pulse on death
- **Accessibility:** reduced-motion = no particles;
  ARIA = each action announced; deaf-mode = visual
  highlights replace audio cues

#### #6 Toast / Notification design + audio per type

- **Surface:** sonner + `BonusToast.tsx`,
  `AchievementUnlockToast.tsx`
- See §3.6 (notification surfaces — visual identity table
  per type) for the per-type icon / accent colour /
  audio cue / inbox group spec. Each toast inherits the
  `discovery = sparkle, quest = fanfare, friend = chime`
  audio cue mapping.
- **Universal design:** entrance slide-in from right
  (300 ms ease-out); auto-dismiss 6 s (8 s on hover);
  exit fade-out 200 ms
- **Haptic:** type-specific (per §3.6)
- **Accessibility:** reduced-motion = instant
  positioning, no slide; ARIA = toast type + content
  announced; deaf-mode = visual icon glyph + accent
  colour replaces audio

#### #7 Achievement Unlock toast confetti + category color + sound

- **Surface:** `AchievementUnlockToast.tsx`
- **Signature-feel:** "you accomplished something
  meaningful"
- **Animation curve:** badge rotation 360° over 800 ms
  ease-out + scale-burst; sparkle burst 12 particles
  600 ms decay
- **Audio recipe (per category):**
  - lore = chime ascending C-E-G arpeggio
  - combat = brass-fanfare 3-note rising
  - exploration = soft sparkle ascending
  - collection = 4-note descending celesta
  - titles = single brass bell hold 1.5 s
- **VFX particle recipe:** 24 confetti in category
  colour (lore=blue, combat=red, exploration=green,
  collection=violet, titles=gold); 1.2-s decay;
  gravity-falling
- **Haptic:** 4 pulses in fanfare rhythm
- **Accessibility:** reduced-motion = static badge with
  glow; ARIA = achievement name + category + flavor
  text; deaf-mode = visual confetti is sufficient

#### #8 Dialogue-box speaker audio stinger + portrait entrance

- **Surface:** `CinematicDialogOverlay.tsx`,
  `ElaraDialogBox.tsx`
- **Signature-feel:** cinematic — every speaker has
  weight
- **Animation curve:** portrait slide-in from off-
  screen 400 ms; text typewriter 30 ms per character;
  speaker-change crossfade 250 ms
- **Audio recipe (per NPC):**
  - Elara = amber chime 120 Hz tone, 80 ms
  - The Human = sub-bass pulse 60 Hz, 200 ms
  - Locke = wooden bell mid-frequency, 100 ms
  - Antiquarian = paper-rustle texture, 150 ms
  - Wraith Calder = metallic scrape low pitch, 120 ms
  - The Source = ethereal glass-tink high pitch, 80 ms
  - Zyr'Koth = dual-tone harmonic, 180 ms
- **VFX particle recipe:** speaker-portrait halo in
  speaker colour
- **Haptic:** none on dialogue (ambient mood)
- **Accessibility:** reduced-motion = no portrait
  slide; ARIA = speaker name + dialogue text
  announced; deaf-mode = speaker name colour-coded in
  caption per §3.5.2.5

#### #9 Resource Counter unified design system

- **Surface:** scattered (no unified component) —
  build new from §9.13 list
- **Signature-feel:** every currency has weight; gain
  feels rewarding, spend feels considered
- **Animation curve:** number tick-up over 600 ms
  ease-out cubic-bezier(0.0, 0.0, 0.2, 1); floating-
  text "+10 [resource]" rises 30 px and fades over
  900 ms
- **Audio recipe (per resource):**
  - Dream Tokens = soft chime + sparkle 100 ms
  - Void Crystals = crystalline tink 60 ms
  - Soul Stones violet = neutral pulse 80 ms
  - Soul Stones gold = warm bell 120 ms
  - Soul Stones red = low scrape 100 ms
  - Faction standing = trumpet brass 80 ms
- **VFX particle recipe:** 8-particle sparkle at gain
  in resource colour; 4-particle drift on spend
- **Haptic:** light pulse on gain; double-pulse on
  spend
- **Accessibility:** reduced-motion = instant number
  update; ARIA = "+10 [resource]" announced; deaf-mode
  = visual sparkle/drift sufficient

#### #10 Health / Shield smooth animation + damage-number scale

- **Surface:** embedded in `DuelystGameUI.tsx` +
  `WarlordCountdownIndicator.tsx`
- **Signature-feel:** fragile — every hit feels real
- **Animation curve:** health-bar shrink 400 ms
  cubic-bezier(0.0, 0.0, 0.2, 1) with 60 ms overshoot-
  return; damage-number scale-out 0 → 1.4 → 1.0 over
  600 ms; floating-text rises 40 px and fades 1.2 s
- **Audio recipe:** damage-taken pitch-down based on
  damage size (high pitch for chip, low for crit);
  healing sparkle ascending; shield-crack glass-snap;
  death-knell low descending bell 1.5 s; low-health
  warning hum-pulse 400 ms loop
- **VFX particle recipe:** 16-particle blood-burst in
  faction-aligned colour; healing sparkle 24-particle
  warm-amber rise
- **Haptic:** medium pulse on damage; light pulse on
  heal; strong pulse on death; sustained low buzz on
  low-health
- **Accessibility:** reduced-motion = instant health
  update; ARIA = damage taken + remaining health
  announced; deaf-mode = visual health-bar pulse
  pattern replaces audio

#### #11 Replay Scrubber component (build new)

- **Surface:** **MISSING** — needs new component;
  diegetic anchor: Defense Command Center §2.33 +
  Pet Arena §2.29 + CADES Console §2.47
- **Signature-feel:** explorable — replay should be
  navigable like a film editor
- **Animation curve:** scrubber drag 1:1 input;
  thumbnail-preview hover-pop scale 1.0 → 1.08 over
  120 ms
- **Audio recipe:** scrub-scratch (low-frequency
  texture); play-pause click; speed-control click
- **VFX particle recipe:** none (functional UI)
- **Haptic:** notch-feedback on key-frame snap
- **Accessibility:** reduced-motion = none affects
  scrubber; ARIA = current time / total time; keyboard
  shortcuts (arrow keys for frame-by-frame)

#### #12 Chess Clock tension audio

- **Surface:** embedded in `ChessBoard.tsx`
- **Signature-feel:** mounting pressure
- **Animation curve:** clock digit-tick 200 ms per
  tick; warning red flash at 30 s (every 1 s pulse)
- **Audio recipe:** clock-tick click-click rhythm
  per side (alternating left/right clicks); time-warning
  beep-beep rising pitch from 30 s; flag-fall soft
  thunk at 0
- **VFX particle recipe:** none (functional)
- **Haptic:** soft tick per second on player's side;
  sharp pulse at 30 s warning
- **Accessibility:** reduced-motion = no flash; ARIA =
  remaining time announced at 60 s, 30 s, 10 s; deaf-
  mode = visual warning sufficient

#### #13 Ark Map room-icon animations + entry parallax

- **Surface:** `ShipSchematicMap.tsx`,
  `ArkFastTravelModal.tsx`
- **Signature-feel:** spatial — the Ark feels real
- **Animation curve:** room-icon hover scale 1.0 → 1.08
  + glow ignite over 200 ms; fast-travel door-cycle
  600 ms; current-location indicator pulse 1.2 s loop;
  parallax entry pan 800 ms
- **Audio recipe:** hover-tick subtle; fast-travel
  whoosh + arrival chime; secret-room subtle bell at
  reveal
- **VFX particle recipe:** 6-particle pulse on
  current-location; 12-particle wake on fast-travel
- **Haptic:** light tick on room-hover; medium pulse
  on fast-travel
- **Accessibility:** reduced-motion = instant
  transitions; ARIA = room name + adjacency announced;
  deaf-mode = visual indicators sufficient

#### #14 Choice Menu consequence preview + branch color coding

- **Surface:** `ChoicePanel.tsx`,
  `Act1ClosingChoicePanel.tsx`
- **Signature-feel:** weight — each choice carries
  consequence
- **Animation curve:** choice-button highlight + scale
  1.0 → 1.04 on hover; selected-button shrink + others
  fade-out 400 ms
- **Audio recipe:** hover soft tick; selection
  fork-sound (two-note descending = light path / two-
  note ascending = dark path / single tone = neutral);
  consequence preview shimmer
- **VFX particle recipe:** branch-colour glow on
  hover (light = warm-amber, dark = cool-violet,
  neutral = grey)
- **Haptic:** medium pulse on selection
- **Accessibility:** reduced-motion = no scale; ARIA =
  choice text + consequence preview announced; deaf-
  mode = visual colour-code sufficient

#### #15 Loading flourish + completion chime

- **Surface:** `LoadingStates.tsx` /
  `OpeningCinematic.tsx`
- (Largely covered in #4; this entry isolates the
  completion-flourish moment specifically.)
- **Signature-feel:** arrival
- **Animation curve:** completion sparkle burst 600 ms
- **Audio recipe:** single high chime at completion
- **VFX particle recipe:** 12-particle warm-amber
  sparkle at completion
- **Haptic:** light pulse
- **Accessibility:** reduced-motion = no sparkle;
  ARIA = "load complete"; deaf-mode = visual sparkle
  sufficient

### 10.3 Universal polish principles (applied across all 15)

- **No music** in HUD-level polish (per §3.1 universal
  direction extending to HUD). Music is a separate
  system; SFX-driven polish only.
- **≤1 short VO sentence** per polish moment (typically
  zero; reserve VO for narrative moments).
- **Reduced-motion fallback** for every animation. Test
  with `prefers-reduced-motion: reduce` media query.
- **ARIA live-region announcements** for every state
  change.
- **Deaf-mode visual indicators** for every audio cue
  (per §3.7 — one of the 14 missing surfaces).
- **Haptic patterns** are mobile-first and follow a
  unified vibration vocabulary (light tick = 12 ms,
  medium pulse = 40 ms, strong pulse = 80 ms, sustained
  buzz = 200 ms loop).

### 10.4 Polish runtime contract

Each polish target lives in the named surface file. Audio
hooks fire via the existing `AudioContext` (per Tier-3A
adoption); VFX particles fire via `framer-motion` particle
emitter; haptic patterns via `navigator.vibrate()` (mobile
only, falls back to no-op desktop).

The 11 missing components (§9.13) need new files; their
polish recipes are spec'd here so the build-new-component
work lands AAA-ready.

---




