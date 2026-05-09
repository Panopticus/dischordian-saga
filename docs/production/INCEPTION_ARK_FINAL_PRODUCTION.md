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
| Legacy wall (left wall, ten brass photo plates) | look | midground | Memorial Plaza launcher |
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

---

