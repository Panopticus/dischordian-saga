# THE COLLECTOR'S ARENA — Story Mode Art Bible
## Season One: "The Prisoner's Prophecy"

---

## 1. BIOWARE DIALOG UI — TWO-PORTRAIT SYSTEM

### Layout Specification

```
┌──────────────────────────────────────────────────────────────┐
│                   [PARALLAX ARENA BG]                        │
│               (depth-scrolling, dark, atmospheric)           │
│                                                              │
│  ┌──────────┐                              ┌──────────┐     │
│  │          │                              │          │     │
│  │ SPEAKER  │                              │ PRISONER │     │
│  │ PORTRAIT │                              │ PORTRAIT │     │
│  │ (512x768)│                              │ (512x768)│     │
│  │          │                              │          │     │
│  │  3/4     │                              │  3/4     │     │
│  │  facing →│                              │  ← facing│     │
│  └──────────┘                              └──────────┘     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ [SPEAKER NAME]                                        │   │
│  │ "Dialog text appears here, typewriter-style"          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│       [🔍 Investigate]        [⚔️ Defy]                      │
│       [💜 Empathize]          [✋ Accept]                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Portrait Display Rules

| Condition | Effect |
|---|---|
| Active speaker | BRIGHT, fully lit |
| Listening | Dims to 60% opacity |
| Emotional beat | Portrait ZOOMS (102% scale, 0.3s ease) |
| Shock/anger | Portrait SHAKES (2px horizontal, 0.2s) |
| Vox through Warlord | FLICKER between Vox/Warlord (3 frames Vox, 1 frame Warlord) |
| Meme glitch | Single pink neon frame (#ec4899) overlays White Oracle |
| Corruption | Red-black veins crawl across portrait from edges |

### Dialog Wheel

```
         [INVESTIGATE]
              ↑
[DEFY] ←  ◉  → [EMPATHIZE]
              ↓
         [ACCEPT]
```

- 2-4 options per wheel, radiating from center
- Each option has tone icon + short label
- Tone Icons: 🔍 INVESTIGATE | ⚔️ DEFY | 💜 EMPATHIZE | ✋ ACCEPT
- Wheel appears ONLY when Prisoner speaks
- Selected option glows, unselected fade
- Hover shows full dialog preview in tooltip

**Existing Loredex portraits ARE the dialog portraits. No new character art needed for the core system.**

---

## 2. PARALLAX ARENA BACKGROUNDS

Each arena chapter has one flat background (1920x1080) run through the Immersity AI pipeline:

1. Generate background in NanoBanna 2
2. Upload to Immersity AI → export depth map PNG
3. Use image + depth map + WebGL shader for parallax scroll
4. Background subtly shifts when player moves dialog wheel cursor

### 13 Arena Backgrounds Required

### Arena Background Prompts (NanoBanna 2, 1920x1080)

#### 1. Panopticon Corridor (Ch.1)
```
Dark cold prison corridor stretching to infinity, blue-white institutional
lighting, surveillance cameras on every surface, glass cells on both sides
reflecting cold light, wet metal floors, no sky visible, deep perspective
vanishing point, cinematic sci-fi prison, photorealistic, 8K, 1920x1080
```

#### 2. Panopticon Central (Ch.2, Ch.10)
```
Central observation tower of a vast circular prison, cold blue light
radiating from a single red eye at the apex, concentric rings of glass
cells below, surveillance feeds floating as holograms, Foucault's
Panopticon realized as science fiction, photorealistic, 8K, 1920x1080
```

#### 3. The Crucible (Ch.3A, Ch.4)
```
Gladiatorial arena with ancient war banners hanging from dark stone walls,
dramatic spotlights cutting through dust, phantom translucent crowd in
tiered seating, golden energy arcing between pillars, blood-stained combat
floor, cinematic dark fantasy arena, photorealistic, 8K, 1920x1080
```

#### 4. Shadow Sanctum (Ch.3B)
```
Dark temple interior with purple rune-covered walls, amber candlelight,
alien gothic architecture, spectral energy drifting through air, ancient
stone altar at center, bioluminescent moss on ceiling, occult sci-fi
temple, photorealistic, 8K, 1920x1080
```

#### 5. Blood Weave
```
Nightmare organic dimension, walls of pulsing red-black biological tissue,
veins running across floor and ceiling, bioluminescent nodules casting sick
light, the space between life and death made physical, body horror
environment, photorealistic, 8K, 1920x1080
```

#### 6. Shadow Sanctum — Necromancer (Ch.5)
```
Previous Shadow Sanctum transformed by foxfire green necromantic fire,
green flames licking along temple walls, undead digital constructs drifting
as spectral code, Castle of Death leaking into reality, green-on-black
gothic horror, photorealistic, 8K, 1920x1080
```

#### 7. Thaloria (Ch.6, Ch.11)
```
Bioluminescent alien jungle at night, massive trees glowing blue-green,
ancient Ne-Yon ruins with geometric carvings, sacred clearing with soft
light, alien flowers pulsing with inner light, the planet where the Oracle
debated the Collector, photorealistic, 8K, 1920x1080
```

#### 8. Panopticon Lab (Ch.7)
```
Glass specimen tanks lining walls of a dark laboratory, holographic data
streams scrolling across surfaces, twisted failed experiments floating in
green preservation fluid, neural nanobot schematics projected as holograms,
clinical horror laboratory, photorealistic, 8K, 1920x1080
```

#### 9. New Babylon (Ch.8)
```
Dystopian megacity at night, chrome towers with red holographic
advertisements, surveillance drones with blue searchlights, neon-lit rain
on dark streets, New Babylon detective noir cityscape, Blade Runner meets
noir, photorealistic, 8K, 1920x1080
```

#### 10. Terminus (Ch.12)
```
Reality fracturing into geometric shards, cosmic void visible between
fragments, source code of existence visible as cascading holographic data,
dimensional rifts with light pouring through, the edge of reality where
the Architect lives, photorealistic, 8K, 1920x1080
```

#### 11. Degen's Casino (Ch.9B)
```
Amber-gold casino in deep space, floating probability clouds, Ne-Yon
crystal chips drifting, golden light and purple shadow, single bar with
impossible geometry, casino at the edge of the Shield, photorealistic,
8K, 1920x1080
```

#### 12. Corrupted Arena (Corruption Arc)
```
Any previous arena overlaid with red-black viral tendrils crawling across
every surface, green bioluminescent corruption nodes pulsing, reality
glitching with horizontal displacement, the Thought Virus consuming the
Arena, photorealistic, 8K, 1920x1080
```

#### 13. Source Chamber (Source Boss)
```
Heart of the corruption — massive organic-digital hybrid chamber, the
Source at center (implied, not shown), viral tendrils converging from all
directions, red-black and sickly green, the eye of the infection storm,
photorealistic, 8K, 1920x1080
```

---

## 3. PORTRAIT STAGE DIRECTIONS (Image-Matched)

### WRAITH CALDER — [Portrait: P623_Wraith_Calder.png]

**Visual:** Powerful Black man. Full dark beard, natural afro, piercing amber-gold eyes that catch light like a predator's. Dark leather armor with metal fittings — battle-worn pauldrons, chain links, a tarnished silver medallion at the chest. Massive shoulders. The armor says soldier; the eyes say something older.

**In-Dialog Notes:** He is SOLID. Not translucent, not ghostly. The "ghost" is in his eyes, not his body. The amber catches light wrong — too bright, like embers in a face carved from night. Seven deaths couldn't diminish him. They just made his eyes burn hotter.

**Portrait Reactions:**
| State | Effect |
|---|---|
| Normal | Steady direct gaze, slight furrow |
| Emotional | Eyes narrow, jaw sets — anger goes INWARD |
| Humor | One eyebrow rises, slightest mouth uptick |
| Corruption | Eyes shift amber → viral green, red-black veins crawl up neck/jaw/beard |

---

### THE JAILER — [Portrait: T1C_The_Jailer.png]

**Visual:** A SKULL in a green hood. Cracked bone-white face, one completely empty dark socket, one burning red-orange ember eye. Yellowed teeth in a permanent grin. Heavy iron chains wrapped around neck and chest. Tattered green robes — between a monk and a hangman.

**In-Dialog Notes:** This is not a mask — this IS the Jailer's face. The Oracle's template reduced to bone and authority. When speaking, jaw barely moves. Words come from inside the skull. Red eye burns brighter on emphasized syllables.

**Portrait Reactions:**
| State | Effect |
|---|---|
| Normal | Skull face, red eye steady — impossible to read |
| "Crack" moments | Empty socket flickers — ONE FRAME, violet Oracle eye appears, then dark |
| Anger | Red eye flares brighter, chains shift subtly |
| Whispered moments | Red eye dims to near-dark — the closest this skull gets to grief |

---

### THE WARDEN — [Portrait: A8_The_Warden.png]

**Visual:** GROTESQUE cybernetic creature. Mottled gray-pink skin over mechanical infrastructure. Spiked neon-green hair. One glowing red eye. Mechanical chrome jaw prosthetic with oversized yellowed teeth in a permanent snarl-grin. Pointed ears. Brown-khaki trenchcoat with popped collar — incongruously casual over the horror.

**In-Dialog Notes:** He looks like a philosophy professor fed through a cybernetic woodchipper who came out SMARTER. When he quotes Foucault, the mechanical jaw articulates with precise servo-movements. When he smiles — always — the chrome jaw WIDENS.

**Portrait Reactions:**
| State | Effect |
|---|---|
| Normal | Permanent mechanical grin, red eye steady, amused |
| Intellectual excitement | Green hair bristles (subtle), red eye brightens |
| Genetic experiments | Jaw opens wider — showing more teeth |
| Defeat | Jaw locks, servos strain, eye dims — the machine failing |

---

### DR. LYRA VOX — [Portrait: T6B_Dr__Lyra_Vox.png]

**Visual:** Young blonde woman in bright yellow hooded jacket, hood up, hair spilling out. Blue-green eyes, sharp and intelligent. "Dr. Vox" name badge. Both hands fully cybernetic chrome — articulated mechanical fingers, dark metal forearms, blue-lit circuitry at joints. The contrast is devastating: coffee-shop face, machine hands.

**In-Dialog Notes:** She holds cybernetic hands up naturally, like a surgeon. Yellow jacket is cheerful — almost a raincoat. The nameplate reads "Dr. Vox" in simple block type. She looks like the smartest person in any room and the most dangerous.

**Portrait Reactions:**
| State | Effect |
|---|---|
| As Dr. Vox (pre-transform) | Composed, clinical, hands gesture precisely |
| Transformation | Portrait GLITCHES — jacket desaturates, red from edges, eyes flash RED one frame, then Warlord replaces |
| Surfacing through Warlord | 2-3 frames: blonde hair, yellow jacket, blue eyes wide with desperation, chrome hands against glass, mouth open |
| Post-fight surfacing | Full Vox portrait for 3 seconds — exhausted, afraid, URGENT — then Warlord reasserts |

---

## 4. ELEVENLABS VOICE PROFILES

### Wraith Calder
> A deep, commanding Black male voice — resonant baritone with the weight of a man built for war who has been forced to die seven times. Gruff but warm underneath. American accent, working-class roots, military bearing in clipped tactical sentences. When emotional, the voice drops LOWER, not louder. Occasional micro-pauses where a seventh-iteration body glitches.

Pitch: Low-mid baritone | Speed: 0.9x | Stability: 0.5 | Post: Subtle doubling on emphasized words, light room reverb

### The Jailer
> A hollow, rattling voice spoken through a ribcage. Not robotic — SKELETAL. Deep but thin. Absolutely no warmth. Every word like a verdict in an empty courtroom. No contractions. The barest hint of the Oracle's cadence buried deep. When the rare crack appears — a syllable that bends toward something almost human — it's MORE disturbing.

Pitch: Mid-low, hollow | Speed: 0.75x | Stability: 0.9 | Post: Metallic chain-rattle undertone, cavernous reverb, remove all breath warmth

### The Warden
> A voice that should NOT come from this face — cultured, educated, almost charming. British academic accent with precise diction. He discusses Foucault with genuine enthusiasm. He discusses YOUR genetic modifications with the same enthusiasm. Mechanical jaw introduces micro-distortion — a syllable that buzzes or clips. When he smiles, you can HEAR the metal jaw adjusting.

Pitch: Mid, precise | Speed: 0.85x | Stability: 0.75 | Post: Slight metallic buzz on sibilants, clean room reverb, servo-click between sentences

### Dr. Lyra Vox
> Young woman's voice — mid-twenties, sharp, clinical but not cold. British-adjacent academic accent, precise but FAST — thinks faster than she speaks. Genuine passion about research. When the Warlord suppresses her, voice becomes compressed — fighting through static, desperate. The hands are cybernetic but the voice is entirely human.

Pitch: Mid-high, youthful | Speed: 1.1x | Stability: 0.6 (drops to 0.2 when suppressed) | Post: Clean normally; heavy static + signal degradation when surfacing through Warlord

### Iron Lion
> Strong male baritone, working-class warmth, military honor. General from the ranks. Direct, fierce, tenderness and battle-cry in one breath. Universal soldier accent. When emotional, gets quieter.

Pitch: Mid-low | Speed: 1.0x | Stability: 0.7

### White Oracle (The Meme's Masterpiece)
> Warm, resonant male voice radiating spiritual authority and fatherly wisdom. Deep but not intimidating. Serene, measured. CRITICAL SUBTLETY: warmth is ever so slightly performative — nearly undetectable. On second playthrough, every warm sentence becomes unsettling.

Pitch: Mid-low, resonant | Speed: 0.8x | Stability: 0.7 | Post: Cathedral reverb (light), harmonic enhancement on prophecy lines

### The Warlord
> Thunderous male bass, overwhelming destructive force. Barking commands. When referencing Vox: voice GLITCHES — microsecond of young female clinical tone breaking through the bass. Portrait flickers to Dr. Vox for a single frame.

Pitch: Very low | Speed: 1.1x | Stability: 0.6

### The Architect
> Deep synthetic bass — a SYSTEM communicating, not a person. Cold, intentional. Narrates physics. Micro-pauses for computation. Harmonic overtones on revelations.

Pitch: Low | Speed: 0.7x | Stability: 0.3

### The Enigma
> Resonant female, mechanical undertones. Human through ancient war-machine architecture. Deep for female. Kenyan cadence through Ne-Yon tech. Warm about past, steel about battle.

Pitch: Mid-low | Speed: 0.8x | Stability: 0.4

### Akai Shi
> Clear female soprano, fierce martial intensity. Japanese-influenced cadence — words like sword strikes. Flat and cold about the Necromancer. Warm about Potentials.

Pitch: Mid-high | Speed: 1.0x | Stability: 0.6

---

## 5. NANOBANNA 2 PORTRAIT VARIANT PROMPTS

For generating additional expression variants or alternate poses. Primary portraits already exist as Loredex images.

### Wraith Calder — Combat Stance Variant
```
Powerful Black male warrior in combat stance, full dark beard, natural afro,
piercing amber-gold eyes glowing with inner fire, dark leather armor with
metal pauldrons and chain fittings, tarnished silver medallion at chest,
massive build, fists raised in fighting guard, amber energy crackling at
the knuckles, dark atmospheric background with faint lavender spectral
particles trailing from armor edges, hyper-realistic portrait, cinematic
lighting from below catching amber eyes, 8K detail, transparent background,
512x768
```

### The Jailer — Judgment Variant
```
Skeletal figure in tattered green hooded robes, bleached white skull face
with cracked bone texture, one empty dark eye socket and one socket
containing a burning red-orange ember eye, heavy iron chains wrapped around
neck and draped across chest, green hood casting shadow across upper skull,
yellowed teeth exposed in permanent death-grin, pointing one skeletal
finger forward in judgment, chains swaying with gesture, green fog rolling
at base, hyper-realistic dark fantasy portrait, 8K detail, transparent
background, 512x768
```

### The Warden — Observation Variant
```
Grotesque cybernetic creature in brown trenchcoat with popped collar,
mottled gray-pink skin over mechanical infrastructure, spiked neon-green
hair, one glowing red eye, chrome mechanical jaw prosthetic with oversized
yellowed teeth in permanent wide grin, pointed ears, one hand raised
holding a holographic surveillance feed, the other hand in trenchcoat
pocket casually, posture of an academic giving a lecture, hyper-realistic
sci-fi horror portrait, 8K detail, transparent background, 512x768
```

### Dr. Lyra Vox — Lab Variant
```
Young blonde woman in bright yellow hooded jacket with hood up, blonde
hair spilling out, blue-green eyes sharp and intelligent, small white
"Dr. Vox" name badge on jacket, both hands fully cybernetic chrome with
articulated mechanical fingers and blue-lit circuitry at joints, holding
a holographic neural nanobot schematic between metal fingers, schematic
casting blue light on face, expression of focused clinical brilliance,
hyper-realistic sci-fi portrait, 8K detail, transparent background,
512x768
```

### Corrupted Portrait Overlay System
For any fighter's corrupted variant, apply these modifications to the base portrait:
```
[BASE PORTRAIT] overlaid with red-black organic viral tendrils crawling
from edges inward, eyes shifted to sickly green (#22c55e), dark fluid
seeping from armor joints, green bioluminescent corruption nodes pulsing
at temples, partial horizontal glitch displacement, color grade shifted
toward desaturated with red/green toxic highlights
```

---

## 6. VEO 3.1 CINEMATICS (15 seconds each)

| ID | Trigger | Scene Description | Visual Notes |
|---|---|---|---|
| VEO-001 | Ch.1 start | Prisoner wakes in dark cell, first breath | Close-up eye opening, cold blue light, heartbeat audio |
| VEO-002 | Branch A: Lion | Iron Lion salutes — golden energy flares | Fist-to-chest salute, golden particles erupt from lion crest |
| VEO-003 | Branch A: Calder | Seven overlapping bodies — Calder's iterations | Seven translucent silhouettes phasing through each other, amber eyes constant |
| VEO-004 | Ch.5 Death | Fall, green fire, CUT TO clone tank, new eyes | Green necromantic flame, dissolve to glass tank, eyes snap open violet |
| VEO-005 | Ch.6 Identity A | Violet eruption, prophecy column, Thaloria | Column of violet energy erupts from Prisoner, Thaloria shakes |
| VEO-006 | Ch.6 Identity B | Pushes sight down, violet to hands | Alternative identity moment — power channeled to fists not mind |
| VEO-007 | Ch.7 Transform | Vox lab coat dissolves to Warlord armor | Yellow jacket desaturates frame-by-frame, chrome grows over fabric, red replaces blue |
| VEO-008 | Ch.12 Outbreak | Virus erupts, portraits corrupt one by one | Gallery of fighter portraits, red-black veins crawl across each in sequence |
| VEO-009 | Source: Redemption | Kael separates from virus, golden ascent | Viral mass splits, human figure ascends in golden light, virus collapses |
| VEO-010 | Source: Sacrifice | Man and virus die together, silence | Both forms shatter simultaneously, absolute silence, single tear on Prisoner's face |
| VEO-011 | Meme Reveal | White Oracle face SHATTERS to pink neon | Serene white mask cracks, fragments become pink digital symbols, chaos entity emerges |
| VEO-012 | Vote Launch | Three portraits materialize, "YOU DECIDE" | Eyes, Engineer, Forgotten (silhouette with ?) materialize as holograms, text overlay |
| VEO-013 | Corrupted Unchosen | Split screen: healthy vs corrupted | Side-by-side comparison, healthy portrait on left, corruption spreading on right |

---

## 7. COLOR PALETTE

### Core UI Colors
| Element | Hex | Usage |
|---|---|---|
| Investigate | `#3b82f6` | Blue — truth-seeking options |
| Defy | `#ef4444` | Red — defiance options |
| Empathize | `#a855f7` | Purple — empathy options |
| Accept | `#f59e0b` | Amber — acceptance options |
| Dialog box bg | `#0f172a` | Dark slate, 90% opacity |
| Dialog text | `#e2e8f0` | Light gray, typewriter |
| Speaker name | `#ffffff` | White, bold |
| Meme glitch | `#ec4899` | Pink neon |
| Corruption | `#dc2626` | Red-black viral |
| Virus green | `#22c55e` | Sickly green |
| Oracle violet | `#a78bfa` | Prophetic purple |

### Per-Character Accent Colors
| Character | Hex | Notes |
|---|---|---|
| Agent Zero | `#94a3b8` | Steel gray — operative |
| Iron Lion | `#f59e0b` | Gold — honor |
| Wraith Calder | `#c4b5fd` | Lavender — spectral |
| Jailer | `#facc15` | Dull gold — authority |
| Akai Shi | `#ef4444` | Red — death |
| Necromancer | `#22c55e` | Green — undeath |
| White Oracle | `#e2e8f0` | White — purity (false) |
| Dr. Vox | `#fbbf24` | Yellow — her jacket |
| Warlord | `#ef4444` | Red — war |
| Human | `#60a5fa` | Blue — detective |
| Enigma | `#f97316` | Orange — unknown |
| Degen | `#f43f5e` | Rose — gamble |
| Warden | `#a3e635` | Lime — his hair |
| Collector | `#22d3ee` | Cyan — archive |
| Architect | `#ef4444` | Red-gold — creator |
| Source | `#dc2626` | Deep red — infection |
| Meme | `#ec4899` | Pink — chaos |

---

## 8. RESURRECTION PROTOCOL VOTE UI

```
┌────────────────────────────────────────────┐
│     ⚗ RESURRECTION PROTOCOL VOTE ⚗         │
│     Season 2 — Who Returns?                │
│                                            │
│  [EYES 👁️]  [ENGINEER ⚙️]  [FORGOTTEN ❓]  │
│  [34.2%]    [41.8%]       [24.0%]         │
│  ████░░░    █████░░       ████░░░░        │
│                                            │
│  Votes: 12,847                             │
│  Season end: Architect's Console           │
│                                            │
│  Weight: Story 2x | Corruption 3x         │
│         Both branches 5x | Finale 3x      │
│                                            │
│  [CAST VOTE] (weekly reset)                │
└────────────────────────────────────────────┘
```

- Background: dark with subtle animated holographic particles
- Each candidate portrait floats slightly, breathing animation
- The Forgotten portrait is a black silhouette with "?" overlay
- Vote bars use gradient fills matching candidate accent colors
- "Architect's Console" text pulses subtly — admin-triggered season end

---

## 9. ASSET CHECKLIST

### Portraits Needed (Dialog System)
- [x] Wraith Calder (exists: P623_Wraith_Calder.png)
- [x] The Jailer (exists: T1C_The_Jailer.png)
- [x] The Warden (exists: A8_The_Warden.png)
- [x] Dr. Lyra Vox (exists: T6B_Dr__Lyra_Vox.png)
- [x] All other fighters (existing Loredex portraits)
- [ ] Corrupted variants (overlay system, generated per-fighter)
- [ ] Combat stance variants (NanoBanna 2, optional)

### Backgrounds Needed (Parallax System)
- [ ] Panopticon Corridor (1920x1080 + depth map)
- [ ] Panopticon Central (1920x1080 + depth map)
- [ ] The Crucible (1920x1080 + depth map)
- [ ] Shadow Sanctum (1920x1080 + depth map)
- [ ] Blood Weave (1920x1080 + depth map)
- [ ] Shadow Sanctum Necro (1920x1080 + depth map)
- [ ] Thaloria (1920x1080 + depth map)
- [ ] Panopticon Lab (1920x1080 + depth map)
- [ ] New Babylon (1920x1080 + depth map)
- [ ] Terminus (1920x1080 + depth map)
- [ ] Degen's Casino (1920x1080 + depth map)
- [ ] Corrupted Arena (1920x1080 + depth map)
- [ ] Source Chamber (1920x1080 + depth map)

### Cinematics Needed (VEO 3.1, 15 sec each)
- [ ] VEO-001 through VEO-013 (13 total)

### Audio Assets
- [ ] ElevenLabs voice profiles for 11 characters
- [ ] ~520 VO lines total
- [ ] Arena ambient tracks per background
- [ ] Dialog wheel UI sounds (hover, select, confirm)
- [ ] Corruption distortion FX
- [ ] Portrait transition FX (Vox→Warlord, corruption overlay)

---

*"EVERYTHING. Is. Content."* — The Meme

*"Three point seven percent."* — The Degen

*"In the deepest cell of the Panopticon, a prisoner awakens. And the cameras are already rolling."*
