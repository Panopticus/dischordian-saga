# Animated Cutscenes — Design Document

## Overview

Five key story moments deserve animated cutscene sequences using **Three.js** (3D scene rendering), **PixiJS** (2D particle/overlay effects), and **Framer Motion** (UI transitions). Each cutscene sets narrative flags on completion, has a skip button, and provides a reduced-motion fallback (static image + text summary).

---

## Cutscene 1: Awakening

**Trigger:** First login after character creation (Cryo Bay)
**Duration:** ~45 seconds (3 shots, ~15s each)

> **Revised 2026-05-10** — producer drop replaced the original
> mechanical pod-opening sequence with a thematic three-beat
> cold-open: identity → mission → emotional consequence.
> Lore-confirmed ordering anchors on `LORE_BIBLE.md`'s verbatim
> "I've watched 93,847 sunrises" line and `NARRATIVE_ARCHITECTURE.md`'s
> Vox neural-nanobot identity chain.

### Shot 1 — `first_clone_born.mp4` (Origin)
The Vox neural-nanobot consciousness transfer that birthed Elara
as a clone of Senator Elara Voss. Establishes that she's a
created consciousness, not a born one — the fundamental violation
that defines her arc. Player meets her as a *made* thing before
they know her name.

### Shot 2 — `the_mandate.mp4` (Mission)
A formal Ark officer hands the player a mandate document:
*"By the Ark Council, you are recognised. Carry it."* Establishes
the political/institutional context — the player is aboard
Inception Ark 1047 with explicit mission authority.

### Shot 3 — `93847_sunrises.mp4` (Aftermath)
Elara whispers: *"That was sunrise ninety-three thousand, eight
hundred and forty-seven."* Reveals her ~256-year solitude. The
emotional payoff: after learning she's a clone and accepting the
mandate, you hear what those choices cost her.

### Audio
- Each shot carries its own producer-mixed audio bed (no engine
  hum overlay). Elara's theme enters during shot 3.

### Interactive
- Skip button (top-right) on each shot.
- Reduced-motion fallback: poster + summary + "Continue" button.

### Flags Set
- `cutscene_awakening_seen`, `prelude_beat_0_complete` (per
  `apps/shared/cutsceneRegistry.ts`)

---

## Cutscene 2: First Human Contact

**Trigger:** Human trust reaches 10 OR player visits Bridge for the third time
**Duration:** 20–30 seconds

### Visual
- Screen static interference — RGB split corruption shader (use `corruption.frag`).
- A silhouette forms in the static — noir lighting, harsh shadows.
- The Human's face partially resolves (matching trust-based progressive reveal system).
- Signal stabilizes for 2 seconds, then cuts to black.

### Camera
- Fixed frame (like a surveillance camera). Occasional glitch jumps.
- Slow zoom into the silhouette's eyes in final seconds.

### Audio
- Radio static → The Human's voice theme (gravelly, noir piano) → sharp signal cutoff.

### Interactive
- None — pure observation. The Human is reaching out, not the player.

### Flags Set
- `first_human_contact`, `human_signal_detected`

---

## Cutscene 3: Elara's Memory Recovery

**Trigger:** Elara trust ≥ 60 + Chapter 6 complete
**Duration:** 45–60 seconds

### Visual
- Fragment montage: Atarion's crystal spires in golden light → spires shatter → Senate chambers → Elara as Senator Voss (portrait crossfade) → the Panopticon → consciousness transfer → Ark 1047.
- Kaleidoscope effect during fragmentation (shader with rotating UV coordinates).
- Resolves to linear narrative as memories solidify.

### Camera
- Rapid cuts during fragmentation (0.5s per fragment).
- Slows to steady pan as Elara remembers (2-3s per scene).
- Ends on Elara's portrait, now with full emotional depth.

### Audio
- Elara's theme swells from broken/glitched fragments to full orchestral.
- Crystal chime sounds during spire memories. Heavy bass during Panopticon.

### Interactive
- Player can touch/click memory fragments to hear Elara's internal monologue for each.

### Flags Set
- `elara_memory_recovered`, `elara_identity_revealed`

---

## Cutscene 4: The Breaking Point

**Trigger:** Breaking Point conditions met (trust divergence + corruption threshold)
**Duration:** Player-controlled (30s intro + choice moment + 15s consequence)

### Visual
- **Split screen**: Elara on left (green/warm glow, Humanity theme), The Human on right (red/cold, Machine theme).
- Both speak simultaneously — their audio overlaps and competes.
- Center of screen: the player's morality meter, pulled in both directions.
- **On choice**: Chosen side GLOWS brilliant white. Rejected side SHATTERS like glass (Three.js fragment physics + PixiJS particle burst). Screen reforms showing only the chosen companion.

### Camera
- Symmetric split. Slow zoom to center as tension builds.
- On choice: hard cut to the chosen side, full frame.

### Audio
- Elara's theme and Human's theme play simultaneously, fighting for dominance.
- On choice: chosen theme surges, rejected theme distorts and cuts.
- 2 seconds of silence. Then the chosen companion speaks.

### Interactive
- **THE choice.** Three buttons appear at center: "Save Elara", "Save The Human", "Refuse Both".
- No timer — player takes as long as needed. The music loops.
- Haptic feedback on selection: `moralityShift` pattern + `storyReveal`.

### Flags Set
- `breaking_point_complete` + one of: `breaking_point_chose_elara`, `breaking_point_chose_human`, `breaking_point_refused`

---

## Cutscene 5: The Thought Virus Manifests

**Trigger:** Chapter 8 complete OR Thought Virus corruption > 75%
**Duration:** 30 seconds

### Visual
- Ship blueprint view (top-down wireframe of Ark 1047 deck layout).
- Red infection tendrils spread through corridors — starting from Medical Bay, flowing through ventilation paths to other rooms.
- Rooms turn red one by one. NPCs in infected rooms flicker/glitch.
- The corruption shader (`corruption.frag`) intensifies across the full screen.
- Ends with the ship blueprint almost entirely red. One room remains blue: the Bridge.

### Camera
- Fixed overhead. No movement — the stillness makes the spreading infection more unsettling.

### Audio
- Heartbeat. Whispered voices (reversed audio fragments). Static building.
- Each room infection: wet, organic sound (the virus is alive).
- Final moment: silence. Then a single ping from the Bridge.

### Interactive
- None. The player watches helplessly.

### Flags Set
- `thought_virus_manifested`, `ship_quarantine_active`

---

## Technical Implementation

### Scene Architecture
```
CutsceneManager
├── Three.js Scene (3D backgrounds, character models, camera)
├── PixiJS Overlay (2D particles, frost, static, shattering glass)
├── Framer Motion Layer (UI elements, text, buttons, transitions)
└── Audio Controller (BGM crossfade, SFX triggers, voice lines)
```

### Timeline Sequencing
Each cutscene is defined as a `CutsceneTimeline` — an array of timed actions:
```typescript
interface CutsceneAction {
  time: number;          // seconds from start
  type: "camera" | "audio" | "visual" | "text" | "interactive" | "flag";
  action: () => void;
  duration?: number;
}
```

### Integration with Game State
- Cutscenes check `progressData` flags before triggering (prevent replay).
- On completion, cutscenes set flags via the existing `progressData` mutation pattern.
- Skip button calls all remaining flag-setting actions immediately.

### Reduced Motion Fallback
- Static background image + text summary narration (KineticText typewriter).
- All narrative flags still set correctly.
- No 3D rendering, no particles, no camera movement.

### Asset Requirements per Cutscene
| Cutscene | 3D Models | Textures | Audio | Particles |
|----------|-----------|----------|-------|-----------|
| Awakening | Cryo pod, chamber | Frost, mist | Hum, hiss, Elara theme | Frost crystals, mist |
| Human Contact | None (2D only) | Static noise | Static, noir piano | RGB glitch |
| Memory Recovery | Crystal spires | Atarion sky, Senate | Elara theme (3 variants) | Crystal shards, light |
| Breaking Point | None (portraits) | Split screen BGs | Both themes | Glass shatter, glow |
| Thought Virus | Ship wireframe | Deck blueprints | Heartbeat, whispers | Infection tendrils |
