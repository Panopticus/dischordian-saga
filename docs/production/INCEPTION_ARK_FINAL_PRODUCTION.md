# Inception Ark — Final Production
## The Living-Ark Art Bible (Nano Banana 2 / Veo 3.1)

> **STATUS — PAUSED 2026-05-09.** Authoring stopped after Part 1
> (Master Style Lock) at the user's request: Trade Empire needs to
> finish first. Parts 2–11 are scaffolded in the table of contents
> below and are intentionally empty. Companion inventory document
> `INCEPTION_ARK_FINAL_PRODUCTION_NOTES.md` captures the full
> upstream analysis (33 rooms, 16 NPCs, 8 state axes, 200+ UI
> surfaces) that this document will draw on once it resumes.
> Resume order is in §11.1 of the notes file. Do not delete the
> notes file — it is the only place the four-agent room/NPC/feature/
> state inventories are recorded.

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

A ninth **real-world seasonal** overlay (§10) sits on top of all of
these and is wallpaper-thin: a cosmetic delta of ≤5% of the frame.

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

