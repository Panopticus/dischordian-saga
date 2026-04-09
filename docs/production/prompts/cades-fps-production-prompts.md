# CADES FPS — Complete Production Prompts
## Art | Voice | SFX | Music

**Project:** CADES UNIT — Dischordian Saga FPS
**Engine:** Godot 4.3 (HTML5 export)
**Modes:** The Last Stand | Ship Defense | Historical Incursions
**Tools:** NanoBanna 2 / Midjourney (art) | ElevenLabs (VO) | Suno 5.1 (music) | Kling 3.0 (video)

---

## TABLE OF CONTENTS

1. [Character Art Prompts](#1-character-art)
2. [Enemy Sprite Prompts](#2-enemy-sprites)
3. [Environment Art Prompts](#3-environment-art)
4. [Prop Art Prompts](#4-prop-art)
5. [UI Art Prompts](#5-ui-art)
6. [Voice-Over Scripts](#6-voice-over)
7. [Sound Effects Prompts](#7-sfx)
8. [Music / Ambient Prompts](#8-music)
9. [Video / Cinematic Prompts](#9-video)

---

## 1. CHARACTER ART

**Format:** 512×512 PNG, transparent background
**Upscale:** Generate at 1024×1024, downscale for crisp detail
**Style:** Dark sci-fi military, dramatic rim lighting, volumetric fog

---

### 1A. Iron Lion — Portrait (Open Channel Sequence)

```
Weathered military general, middle-aged Black man, strong jaw, kind but exhausted
eyes, close-cropped grey hair, battle scars across left cheek, dark military
uniform with amber-gold insignia on chest, warm amber torchlight illuminating
from the left side, dark void background, fist pressed to chest in military
salute pose, sci-fi military aesthetic, concept art portrait style,
8K hyper-realistic, dramatic chiaroscuro lighting, film grain,
dark background (#000000)
```

### 1B. Iron Lion — Full Body (Bridge of Kael)

```
Full body military general standing on a dark bridge, middle-aged Black man,
battle-worn dark armor over military fatigues, resistance rifle slung across
back, heavy pistol holstered at hip, standing at parade rest looking south
toward an unseen army, amber torchlight behind him casting long shadow forward,
fog rolling at his feet (#0a0005 near-black purple), sci-fi last stand
aesthetic, concept art full body, 8K hyper-realistic, dramatic rim lighting,
transparent background
```

### 1C. Iron Lion — Billboard Sprite (In-Game)

```
Military general silhouette, dark armor, amber insignia on chest, standing
combat-ready with rifle raised, strong heroic pose, sci-fi soldier aesthetic,
flat color regions for game sprite use, side-lit with warm amber light,
simple readable form at small scale, 256x256, transparent background,
game sprite style
```

### 1D. Elara — Holographic Avatar (Subtitle Area)

```
Holographic AI woman, translucent violet (#8b5cf6) wireframe form, gentle
intelligent face, data streams flowing through her translucent body, subtle
digital glitch artifacts, floating holographic projection aesthetic, no legs
visible (fades to particles below waist), sci-fi ship AI hologram,
256x256, transparent background, soft violet glow emanating outward
```

### 1E. Thoughtborn Pilgrim Leader — Portrait (Dialogue)

```
Ethereal humanoid figure, pale almost-white skin (#f5f0e8), closed eyes,
violet (#8b5cf6) bioluminescent patterns pulsing under the skin like circuit
traces, wearing simple pilgrim robes, expression of serene determination,
hands clasped in front, faint violet shimmer aura surrounding the body,
sci-fi mystical aesthetic, portrait style, dark background, 8K hyper-realistic,
soft diffused lighting with violet rim light
```

### 1F. Game Master — Archived Image (Matrix Hub)

```
Man with dark slicked hair wearing a blue trench coat, red steampunk goggles
pushed up on forehead, knowing smirk, one hand adjusting the goggles,
standing in an abstract geometric void space with floating puzzle fragments
and glowing data streams, the void behind him suggesting infinite depth,
corporate confidence mixed with playful menace, sci-fi noir aesthetic,
concept art portrait, 8K hyper-realistic, cold blue and warm amber
cross-lighting, transparent background
```

### 1G. Game Master — Robot Form (Quiz Show / Arena)

```
Humanoid robot wearing a blue trench coat identical to the human version,
red steampunk goggles over optical sensors, sleek dark metallic chassis
visible at neck and hands, same knowing smirk rendered in articulated
metal jaw plates, theatrical pose with arms spread wide as if presenting
a game show, floating geometric puzzle pieces orbiting around him,
sci-fi theatrical aesthetic, concept art full body, 8K hyper-realistic,
dramatic stage lighting from below, transparent background
```


---

## 2. ENEMY SPRITES

**Format:** 256×256 PNG, transparent background (downscale to 96×96 for game)
**Style:** Billboard sprites — flat-colored with accent details, readable at small scale
**Method:** StandardMaterial3D albedo color override on Kenney billboard enemy sprite

---

### MODE 1: THE LAST STAND — Machine Army

**2A. Machine Scout**
```
Small floating robotic drone, compact spherical chassis, void-black (#0f172a)
metallic body, single horizontal red (#ef4444) LED sensor slit across front,
no limbs, small thruster vents on sides emitting faint red glow, erratic
hovering pose (slightly tilted), simple geometric forms, dark sci-fi aesthetic,
game sprite, 256x256, transparent background
```

**2B. Machine Soldier**
```
Medium floating robotic drone, angular rectangular chassis, void-black (#0f172a)
metallic body, single horizontal red (#ef4444) LED sensor across front face,
two small weapon ports visible on lower chassis, symmetrical military design,
stable hovering pose, dark sci-fi military aesthetic, game sprite, 256x256,
transparent background
```

**2C. Machine Vanguard**
```
Large floating robotic drone, heavy angular chassis, void-black (#0f172a)
metallic body, red (#ef4444) sensor slit, large flat shield plate (#475569
slate grey) mounted in front of main body, shield shows battle damage and
energy field shimmer, imposing silhouette, dark sci-fi heavy infantry
aesthetic, game sprite, 256x256, transparent background
```

**2D. Machine Disruptor**
```
Medium floating robotic drone, sleek chassis, void-black (#0f172a) metallic
body, single purple (#8b5cf6) sensor orb instead of red (distinguishing
feature), antenna array extending from top emitting purple interference
waves, jamming device aesthetic, dark sci-fi electronic warfare design,
game sprite, 256x256, transparent background
```

**2E. Machine Commander**
```
Massive floating robotic command unit, imposing angular chassis, full crimson
red (#ef4444) metallic body (NOT black — this distinguishes it from all other
machines), gold (#fbbf24) command insignia plate on chest, multiple sensor
arrays, larger than all other machine units, commanding presence, dark sci-fi
military command aesthetic, game sprite, 256x256, transparent background
```

---

### MODE 2: SHIP DEFENSE — Three Factions

**2F. Reclamation Enforcer**
```
Armored humanoid soldier, dark crimson (#7f1d1d) corporate military armor,
full-face helmet with narrow visor slit, weapon held at ready position,
professional military stance, corporate insignia on shoulder pad, Hierarchy
of the Damned aesthetic — corporate evil meets military precision, game sprite,
256x256, transparent background
```

**2G. Reclamation Commander**
```
Armored humanoid officer, dark crimson (#7f1d1d) corporate military armor with
gold (#fbbf24) rank insignia on chest and shoulders, slightly taller and more
ornate than Enforcer, officer's stance with one hand raised in command gesture,
cape or sash detail, corporate military commander aesthetic, game sprite,
256x256, transparent background
```

**2H. Salvager**
```
Scrappy humanoid scavenger, rust-brown (#44403c) patchwork armor made from
salvaged ship parts, hunched aggressive posture, makeshift weapon cobbled
from ship components, exposed wiring and bolts, chaotic mismatched aesthetic,
desperate survivor energy, game sprite, 256x256, transparent background
```

**2I. Salvager Leader**
```
Taller scavenger figure, lighter rust (#78716c) upgraded patchwork armor,
standing more upright than regular Salvagers, crude radio antenna strapped
to back (used to call reinforcements), more organized equipment, field leader
aesthetic, game sprite, 256x256, transparent background
```

**2J. Thoughtborn Pilgrim**
```
Ethereal humanoid figure, near-white (#f5f0e8) pale skin and simple robes,
eyes closed, violet (#8b5cf6) bioluminescent lines pulsing under skin like
circuit traces, walking forward with hands slightly raised in peaceful gesture,
NO weapons, serene and non-threatening, faint violet shimmer aura,
sci-fi mystical pilgrim aesthetic, game sprite, 256x256, transparent background
```

---

### MODE 3: HISTORICAL INCURSIONS — Per-Scenario Enemies

**2K. Architect Construct (The First Breath)**
```
Early-generation AI construct, wireframe humanoid form, glowing red (#ef4444)
geometric wireframe body, no solid surfaces — just edges and vertices visible,
primitive and angular design suggesting early technology, fast and aggressive
pose, retro-futuristic prototype aesthetic, game sprite, 256x256,
transparent background
```

**2L. Hierarchy Assassin (The Severance)**
```
Professional killer in dark near-black (#1c1917) stealth suit with deep
crimson (#7f1d1d) accent lines, full face mask, sleek and minimal design,
crouched predatory pose, twin blades visible, coordinated special forces
aesthetic, game sprite, 256x256, transparent background
```

**2M. Collector Drone (Thaloria Burns)**
```
Floating specimen collection drone, collector purple (#a855f7) metallic
chassis, multiple articulated arms with specimen containers and scanning
devices, single large optical sensor, clinical and alien design, specimen
collection unit aesthetic, game sprite, 256x256, transparent background
```

**2N. Reality Shard (The Fall)**
```
Abstract geometric shard of fractured reality, violet (#8b5cf6) crystalline
form with white (#ffffff) energy flashes at edges, no humanoid features,
angular impossible geometry suggesting broken spacetime, environmental hazard
aesthetic, game sprite, 256x256, transparent background
```

**2O. Hierarchy Strike Team Operative (Agent Zero's Silence)**
```
Elite operative in void-black (#0f172a) tactical suit with silver metallic
accent plates, full helmet with reflective visor, clean and efficient design,
precision rifle held in professional stance, clean lines suggesting elite
corporate military, game sprite, 256x256, transparent background
```


---

## 3. ENVIRONMENT ART

**Format:** 2560×1440 PNG (skyboxes), 1024×1024 (textures)
**Style:** Dark sci-fi, minimal, atmospheric

---

### 3A. Bridge of Kael — Skybox (Mode 1)

```
Vast dark void landscape at the moment before dawn, solid black sky (#000000)
with the faintest amber-orange (#f97316) glow at the extreme low horizon
suggesting distant fires, no stars visible, oppressive darkness above,
wisps of near-black purple (#0a0005) fog drifting across the lower third,
military last stand atmosphere, desolate and final, panoramic landscape,
2560x1440, no text
```

### 3B. Bridge of Kael — Floor Texture

```
Dark metallic bridge decking, worn industrial metal plates (#1c1917),
scratches and battle damage, dried dark stains, rivets and seam lines,
metallic sheen with roughness 0.4, military fortification floor,
seamless tileable texture, 1024x1024, top-down perspective
```

### 3C. Bridge of Kael — Barricade Texture

```
Military barricade surface, dark stone-metal hybrid (#292524), blast marks
and weapon scoring, reinforced corners with metal brackets, battle-damaged
defensive fortification, seamless tileable texture, 1024x1024
```

### 3D. Ark 1047 Engineering Bay — Wall Texture

```
Spacecraft interior wall panel, dark metal (#1c1917) with orange (#f97316)
conduit accent lines running horizontally, access panels and maintenance
hatches, industrial corridor aesthetic, emergency lighting strips (inactive),
seamless tileable texture, 1024x1024
```

### 3E. Ark 1047 Cargo Hold — Wall Texture

```
Spacecraft cargo hold interior, rust-brown (#44403c) stained metal walls,
cargo attachment points and hooks, water damage stains, lived-in neglected
aesthetic, someone was here recently, seamless tileable texture, 1024x1024
```

### 3F. Ark 1047 Observation Deck — Starfield

```
Deep space starfield viewed through a viewport, pure black (#000000)
background with very sparse white point stars, no nebulae, no planets,
cold and empty, the absolute loneliness of deep space, vast and quiet,
panoramic, 2560x1440
```

### 3G. Matrix Hub — Void Environment

```
Abstract black void space with no visible floor or ceiling or walls, pure
black (#000000) with very faint distant star patterns barely visible,
occasional subtle glitch artifact (thin horizontal line of static),
the interior of an artificial pocket universe that is very old and slightly
degrading, unsettling emptiness, panoramic, 2560x1440
```

### 3H. Matrix Hub — Scenario Pillar (Generic Template)

```
Tall glowing crystalline pillar rising from invisible floor into void,
smooth cylindrical form, height approximately 3 meters, emitting soft
colored light (color varies per scenario), slow-orbiting particles of
matching color circling the pillar, ancient construct aesthetic suggesting
preserved data, holographic text floating near the top (no actual text
rendered — we overlay in code), sci-fi data archive monolith,
512x1024, transparent background
```


---

## 4. PROP ART

**Format:** 512×512 PNG, transparent background
**Style:** Dark sci-fi, functional, story-carrying

---

### 4A. CADES Unit — The Chair + Helmet Apparatus

```
Sci-fi medical examination chair with a hemispherical helmet apparatus
mounted above it, clinical dark metallic (#1c1917) chair frame, the helmet
is a half-sphere of translucent violet (#8b5cf6) material with glowing
internal circuitry visible, a single violet light source emanating from the
helmet, small metal plaque on the base (no text rendered), cables connecting
helmet to floor-mounted data terminal, isolation horror meets medical device
aesthetic, concept art, dark background, 8K hyper-realistic
```

### 4B. CADES Unit — Active/Pulsing State

```
Same CADES unit chair and helmet as above but in active state — the violet
(#8b5cf6) hemisphere is pulsing with bright light, energy waves visible
emanating outward in concentric rings, the internal circuitry is fully
illuminated and flowing with data, cables are taut and humming with power,
the chair appears occupied by a faint ghostly silhouette, active consciousness
transfer aesthetic, concept art, dark background, dramatic violet lighting
```

### 4C. Iron Lion's Note (Bridge Prop)

```
Small weathered piece of paper on top of a dark military supply crate,
handwritten text visible but not readable at this scale, amber (#f59e0b)
warm lighting from nearby torch illuminating the scene, the crate has
military stenciling, a personal moment in a war zone, intimate and sad,
concept art prop detail, dark background
```

### 4D. Engineering Bay Manifest (Ark Prop)

```
Framed document mounted on a spacecraft interior wall, official-looking
document with header text and body text (not readable — overlay in code),
the frame is standard-issue dark metal, a small handwritten note is tucked
beneath the frame at an angle, industrial corridor lighting, bureaucratic
object in a war zone, concept art prop detail
```

### 4E. Cargo Hold Jacket (Ark Prop)

```
A worn jacket hanging from a hook on a cargo container, military-issue but
personalized with patches, slightly dusty, next to it on the container
surface is a half-eaten meal on a tray — evidence of someone who left in a
hurry or didn't leave at all, warm emergency lighting, lived-in detail,
someone was here, concept art environmental storytelling
```

### 4F. Old Photograph of Iron Lion (Observation Deck Prop)

```
Small photograph in a simple frame sitting on a shelf, showing a younger
military man (Iron Lion) in clean uniform, pre-war, looking rested and
almost smiling, the photo is slightly faded, warm tones, contrast with the
cold dark environment around it, intimate personal artifact, concept art
prop detail, dark background
```

### 4G. Goggles of the Game Master (Lore Reference Art)

```
Red steampunk goggles with multiple optical lenses, intricate brass and dark
metal frame, the lenses glow faintly with inner light suggesting they can
perceive something invisible to normal eyes, reality-code readout patterns
faintly visible in the lens reflections, sitting on a dark velvet surface
in what appears to be a vault, these are powerful artifacts being stored,
concept art artifact study, dark background, 8K hyper-realistic,
dramatic side lighting
```


---

## 5. UI ART

**Format:** Various sizes, PNG with alpha
**Style:** Minimal dark sci-fi HUD, monospace text overlays done in code

---

### 5A. Mode Select Background

```
Dark spacecraft interior corridor looking toward three doorways, each
doorway lit with a different colored light — left: amber (#f59e0b),
center: violet (#8b5cf6), right: dark red (#7f1d1d), the corridor itself
is near-black (#0f172a) with subtle metallic wall panels, atmospheric fog
at floor level, three-choice aesthetic, sci-fi menu background,
1920x1080, no text
```

### 5B. Game Masters Transmission Background

```
Very dark (#0a0a0a) communications terminal screen with faint scan lines,
thin border of bone-white (#f5f0e8) at 1px width, subtle static noise
texture overlay, old corporate terminal aesthetic, clinical and slightly
menacing, the screen of something that shouldn't be contacting you,
800x600, dark background
```

### 5C. Open Channel Background

```
Near-black screen with a single amber (#f59e0b) light source in the upper
third — suggesting a torch or lantern on a dark bridge, everything else
is void, intimate and isolated, one person speaking across an impossible
distance, the visual equivalent of a whispered conversation in the dark,
1920x1080
```

### 5D. Loop Reset — Dawn Transition

```
Abstract dawn breaking over a dark landscape, amber-gold (#fbbf24) light
appearing at the horizon line against pure black, the light is young and
thin — just beginning, fog rolling across the middle ground, militaristic
landscape silhouette (barricades, bridge supports), cyclical and inevitable,
this dawn has happened before and will happen again, 1920x1080
```

### 5E. Shield Restoration Progress Bar (Texture)

```
Horizontal energy bar texture, left side is dark void (#0f172a), filling
with violet (#8b5cf6) energy from left to right, the fill edge has a
bright white glow and small energy sparks, the unfilled portion shows
faint grid lines suggesting ship systems, sci-fi progress bar aesthetic,
512x64, transparent background
```

---

## 6. VOICE-OVER SCRIPTS

**Format:** WAV, 48kHz, 24-bit, 0.5s lead-in/tail silence
**Naming:** `cades_[character]_[line_id].wav`
**Tool:** ElevenLabs

---

### 6A. IRON LION — Voice Profile

**ElevenLabs Prompt:**
> A deep, gravelly male voice with working-class directness and military bearing. African American, middle-aged, exhausted but unbroken. Speaks with economy — every word earned. No poetry, no speeches. The voice of a man who has held a bridge for three hours and forty-seven minutes and would do it again. When he asks a question, it sounds like he already knows the answer but needs to hear someone else say it. Warm underneath the gravel. Honorable. The kind of voice that makes you stand up straighter.

**Lines (P0 — Must Have):**

| ID | Line | Direction |
|---|---|---|
| `iron_lion_who` | "Who's there?" | Quiet. Alert. Not afraid — curious. |
| `iron_lion_before` | "I know I've been here before. I can feel it — not as a memory. As a fact in my hands." | Slow realization. Each sentence lands heavier than the last. |
| `iron_lion_ships` | "Did they make it? The ships?" | This is the only question that matters to him. |
| `iron_lion_worth` | "Then this was worth it. Whatever this is. It was worth it." | Relief. Profound. A weight lifting. |
| `iron_lion_stop` | "I'd like to stop watching the valley. I don't know if that's possible. But I'd like to." | Tired. Honest. Not a complaint — a request. |
| `iron_lion_someone` | "Someone is watching. I've felt it for a long time. If you're that someone —" | Pause before the salute. Direct address to the player. |
| `iron_lion_word` | "When I'm done — I'd like to have a word with you." | After the salute. Quiet promise. |
| `iron_lion_soldiers` | "Soldiers now. Good." | Wave 4. Approving. He prefers real fights. |
| `iron_lion_shielded` | "Shielded. Change angle." | Wave 7. Tactical. Clipped. |
| `iron_lion_aim` | "Something's messing with my aim. I know what that means." | Wave 10. Disruptors. Annoyed but adapting. |
| `iron_lion_command` | "Command unit. They're committing." | Wave 13. Respect for the escalation. |
| `iron_lion_three` | "Three left." | Reinforcement tokens low. Flat. Factual. |
| `iron_lion_keep` | "Good. Keep going." | 1-hour mark. Encouragement without sentiment. |
| `iron_lion_two_hours` | "Two hours. Where are we." | 2-hour mark. Not a question — a status check. |

---

### 6B. ELARA — Voice Profile (CADES Mode)

**ElevenLabs Prompt:**
> A warm, intelligent female AI voice with a subtle British accent. She speaks with precision and care, like a trusted advisor who genuinely cares about the listener. Slight digital quality, as if transmitted through a holographic system. Measured pace, thoughtful pauses. In the CADES context she is more urgent, more invested — she is running operations in a crisis. When she says "I'm sorry" she means it in a way that AIs shouldn't be able to mean things.

**Lines (P0 — Must Have):**

| ID | Line | Direction |
|---|---|---|
| `elara_bridge_holds` | "The bridge holds. Dawn comes again." | Loop reset. Soft. Cyclical. She's said this before. |
| `elara_pause` | "He paused at the parapet. He looked at his hands. Then he went back." | Awareness 2. Observational. Slightly unsettled. |
| `elara_memory` | "He said something: 'I've been here before.' To no one." | Awareness 3. More unsettled. |
| `elara_looked` | "He looked toward us today. He doesn't know what he's looking at." | Awareness 4. Quiet awe. |
| `elara_waiting` | "He's waiting. He's very patient." | Awareness 5. Reverent. |
| `elara_25min` | "I need twenty-five minutes. Hold the breaches." | Mode 2 start. Urgent but controlled. |
| `elara_eng_breach` | "Engineering breach — the Reclamation are through." | Alert. Military efficiency. |
| `elara_cargo_breach` | "Cargo hold — Salvagers. They move fast. Move faster." | Urgent. |
| `elara_obs_breach` | "Observation deck — the Thoughtborn are walking toward the unit. Don't shoot them." | Firm. This is important. |
| `elara_shields_done` | "Shields at full power. Ark 1047 is secure." | Relief. Genuine. |
| `elara_shields_fail` | "Shields failed. I needed more time. I'm sorry." | Devastated. The "sorry" breaks. |
| `elara_thoughtborn` | "They followed Iron Lion's signal. They've been looking for years." | Wonder. Discovery. |
| `elara_changed` | "I changed three assessments in five minutes. Uncomfortable. Correct." | Self-aware. Precise even about her own emotions. |
| `elara_matrix` | "Welcome to the Matrix of Dreams. Built by an Archon. Maintained by fans." | Mode 3 intro. Dry. Factual with hidden weight. |
| `elara_gm_theory` | "The Game Master was destroyed from inside. Iron Lion is asking. I have a theory." | Slow. Each sentence a revelation. |
| `elara_dont_answer` | "Don't answer that yet." | After Game Masters final offer. Sharp. Protective. |
| `elara_canon` | "Three hours, forty-seven minutes. The ships cleared the range. He held it." | Canon win. Emotional but controlled. Pride. |


---

### 6C. THOUGHTBORN LEADER — Voice Profile

**ElevenLabs Prompt:**
> An ethereal, calm voice — gender-ambiguous, soft, resonant. Speaks slowly as if each word is being transmitted across a vast distance. Reverb-heavy, with a faint harmonic undertone as if multiple consciousnesses are speaking in near-unison. Peaceful but urgent. The voice of someone who has been searching for a long time and has finally found what they were looking for.

**Lines (P0):**

| ID | Line | Direction |
|---|---|---|
| `thoughtborn_heard` | "We heard him. The old general. He's still in there, isn't he?" | Gentle certainty. |
| `thoughtborn_remember` | "We heard him start to remember. We've been looking for years for someone who started to remember. It means someone on the other side is listening. It means someone can hear." | Building wonder. Each sentence adds weight. |
| `thoughtborn_please` | "Please don't destroy the unit." | Simple. Vulnerable. A plea. |

---

### 6D. GAME MASTERS — Voice Profile (Transmissions)

**ElevenLabs Prompt:**
> A cold, corporate voice — processed through multiple layers of encryption. Male, middle-aged, bureaucratic precision with underlying menace. Speaks like a lawyer reading terms and conditions that happen to involve the fate of consciousness itself. Slight digital processing. Never raises voice. The scariest thing about this voice is how reasonable it sounds.

**Lines (P1 — Important):**

| ID | Line | Direction |
|---|---|---|
| `gm_unauthorized` | "Unauthorized observer presence detected in Matrix Scenario Library. Observer credentials not on file. We are reviewing logs. No action required at this time." | Clinical. First contact. |
| `gm_stop` | "We note continued unauthorized access. We do not wish you harm. We do wish you would stop." | Slightly warmer. Still corporate. |
| `gm_curious` | "The Iron Lion construct has asked, twice, whether someone can hear him. That question has never appeared in any run of that scenario before you. We're curious about you." | The mask slips. Genuine interest. |
| `gm_offer` | "We can give you access to everything. Every scenario. Every archived consciousness. Every moment the Game Master preserved before he was destroyed. Imagine having access to all of it. We'll wait for your answer." | The full offer. Seductive. Patient. |

---

### 6E. NARRATOR — Voice Profile (Death/Win Screens)

**ElevenLabs Prompt:**
> A neutral, authoritative broadcast voice. Male, steady, military transmission quality. Slight radio static. The voice of a system reporting events without judgment. Factual. Final.

**Lines (P1):**

| ID | Line | Direction |
|---|---|---|
| `narrator_signal_lost` | "Signal lost." | Flat. Terminal. |
| `narrator_dawn` | "Dawn. The bridge. The valley. The army." | Each word separated. Cyclical. |
| `narrator_bridge_holds` | "The bridge holds." | Win. Simple. Definitive. |
| `narrator_shields` | "Shields restored. Ark 1047 is secure." | Relief without emotion. |
| `narrator_breach` | "Breach uncontained. Inception Ark 1047 has fallen." | Loss. Matter-of-fact. |


---

## 7. SOUND EFFECTS

**Format:** OGG Vorbis, 44.1kHz, mono (stereo for ambient)
**Tool:** Suno 5.1 (sound design mode) or ElevenLabs Sound Effects
**Naming:** `cades_sfx_[name].ogg`

---

### 7A. Weapon SFX

| File | Duration | Suno/SFX Prompt |
|---|---|---|
| `ironclad_fire.ogg` | 0.3s | `"Heavy sci-fi pistol shot, deep bass impact, slow deliberate, metallic reverb tail, single shot, military sidearm, game sfx"` |
| `resistance_rifle_fire.ogg` | 0.2s | `"Rapid sci-fi rifle shot, sharp mid-range crack, short burst, field-modified weapon with slight distortion, game sfx"` |
| `bridge_anchor_fire.ogg` | 0.5s | `"Massive sci-fi plasma lance blast, deep thunderous boom, wide spread energy discharge, devastating close-range weapon, game sfx"` |
| `resonance_disruptor_fire.ogg` | 0.3s | `"Sci-fi energy disruptor shot, harmonic frequency pulse, electronic warble on impact, disruption weapon, game sfx"` |
| `arc_caster_fire.ogg` | 0.2s | `"Precision sci-fi rifle shot, clean electric crack, mid-range, reliable workhorse weapon sound, game sfx"` |
| `severance_blade_fire.ogg` | 0.4s | `"Close-range sci-fi energy blade discharge, sharp cutting sound mixed with energy crackle, devastating, game sfx"` |
| `integrity_charge.ogg` | 1.2s | `"Sci-fi weapon recharging, ascending electronic hum building to a click of completion, energy cells refilling, game sfx"` |

---

### 7B. Enemy SFX

| File | Duration | Suno/SFX Prompt |
|---|---|---|
| `machine_hit.ogg` | 0.3s | `"Metallic impact on robotic chassis, sparks, mechanical damage sound, sci-fi robot taking damage, game sfx"` |
| `machine_shutdown.ogg` | 0.8s | `"Robot power-down sequence, descending electronic whine, systems failing, servo motors dying, final click, game sfx"` |
| `machine_fire.ogg` | 0.3s | `"Machine weapon discharge, cold precise electronic pulse, automated weapons fire, robotic, game sfx"` |
| `faction_hurt.ogg` | 0.3s | `"Humanoid grunt of pain mixed with armor impact sound, biological plus metallic, military combatant hit, game sfx"` |
| `faction_down.ogg` | 0.6s | `"Body hitting floor with armor clatter, fading impact, soldier falling, finality, game sfx"` |
| `faction_fire.ogg` | 0.3s | `"Conventional sci-fi weapon fire, sharp crack, military-issue weapon, professional, game sfx"` |

---

### 7C. Player SFX

| File | Duration | Suno/SFX Prompt |
|---|---|---|
| `integrity_breach.ogg` | 0.4s | `"Digital distress sound, player taking damage, brief electronic alarm mixed with impact, warning tone, game sfx"` |
| `signal_lost.ogg` | 1.5s | `"Flatline tone mixed with radio static fade-out, signal dying, terminal loss, final transmission ending, game sfx"` |
| `integrity_restored.ogg` | 0.5s | `"Health pickup, positive electronic chime, systems restored, brief ascending tone, game sfx"` |

---

### 7D. Atmosphere SFX

| File | Duration | Suno/SFX Prompt |
|---|---|---|
| `loop_reset_dawn.ogg` | 3.0s | `"Dawn ambience on a military bridge, distant birdsong mixed with faint machine sounds starting up, quiet morning after battle, 3 seconds, no music, game sfx"` |
| `iron_lion_salute.ogg` | 1.0s | `"Military salute sound, brief cloth movement against armor, subtle leather creak, fist to chest impact, dignified, 1 second, game sfx"` |
| `channel_open.ogg` | 2.0s | `"Communication channel opening, soft electronic handshake tone, frequency locking, hopeful rising pitch, connection established, 2 seconds, game sfx"` |
| `game_masters_transmission.ogg` | 5.0s | `"Sinister corporate transmission incoming, encrypted signal decoding, dark ambient processing, incoming unauthorized message, clinical menace, 5 seconds, game sfx"` |
| `thoughtborn_approach.ogg` | 5.0s | `"Eerie ethereal approach tone, slow viola drone mixed with consciousness resonance frequency, something peaceful but alien drawing near, 5 seconds, game sfx"` |
| `breach_alarm.ogg` | 2.0s | `"Spacecraft hull breach alarm, urgent klaxon mixed with depressurization hiss, emergency alert, repeating, game sfx"` |
| `zone_transition.ogg` | 1.0s | `"Spacecraft door opening and closing, pneumatic hiss, heavy metal door, transitioning between ship zones, game sfx"` |
| `shield_milestone.ogg` | 1.5s | `"Shield restoration milestone reached, positive ascending electronic tone, progress notification, ship systems responding, game sfx"` |
| `pillar_activate.ogg` | 2.0s | `"Ancient data archive pillar activating, crystalline resonance building, scenario loading, digital archaeology, game sfx"` |
| `cades_pulse.ogg` | 2.0s | `"CADES unit consciousness transfer pulse, violet energy wave, deep harmonic vibration, the helmet activating, game sfx, loopable"` |


---

## 8. MUSIC / AMBIENT LOOPS

**Format:** OGG Vorbis, 44.1kHz, stereo, seamless loop
**Tool:** Suno 5.1
**Mixing:** -14 LUFS baseline (ambient), -10 LUFS (combat)
**Naming:** `cades_music_[name].ogg`

---

### 8A. Bridge of Kael — Ambient Loop (Mode 1)

**Title:** THE LAST TORCH
**Duration:** 2:00 loop
**Style of Music:** military last stand ambient, distant machine army sounds, tension drones, dark electronic, 90 BPM, no melody, seamless loop, instrumental only
```
[Instrumental — Seamless Loop]

[Foundation: Low sub-bass drone in D minor, sustained]
[Layer 1: Distant metallic clanking — the machine army assembling beyond the valley]
[Layer 2: Wind through bridge supports — hollow, mournful]
[Layer 3: Occasional distant explosion rumble, very low in mix]
[Layer 4: Single sustained tension string, barely audible, rises over 60 seconds]
[Break at 1:00: Everything drops except the wind and sub-bass]
[Build: Layers return one by one, tension string rises slightly higher]
[At 1:50: Subtle military drum — single hit, like a heartbeat, every 4 bars]
[Loop point: seamless return to opening drone]
[NO melody. NO hope. Just endurance.]
```

---

### 8B. Ark 1047 — Ambient Loop (Mode 2)

**Title:** HULL PRESSURE
**Duration:** 2:00 loop
**Style of Music:** sci-fi spacecraft interior ambient, low mechanical hum, occasional distant alarm, tension atmosphere, space horror, no melody, electronic drone, seamless loop
```
[Instrumental — Seamless Loop]

[Foundation: Ship engine hum in E minor, constant and deep]
[Layer 1: Life support cycling — rhythmic breathing sound, mechanical]
[Layer 2: Distant hull creaks — metal expanding and contracting]
[Layer 3: Occasional radio static burst — 2 seconds, every 30 seconds]
[Layer 4: Subsonic rumble suggesting something large outside the hull]
[At 0:45: Faint alarm tone — two notes, far away, a breach somewhere]
[At 1:15: The alarm stops. Silence except engine hum. What happened?]
[At 1:30: Layers return. The alarm was nothing. Or was it.]
[Loop point: seamless return to engine hum foundation]
[Claustrophobic. Enclosed. The walls are close.]
```

---

### 8C. Matrix Hub — Ambient Loop (Mode 3)

**Title:** ARCHIVED SILENCE
**Duration:** 2:00 loop
**Style of Music:** dreamlike pocket universe ambient, artificial reality, gentle unease, soft synthetic textures, no melody, ethereal, seamless loop
```
[Instrumental — Seamless Loop]

[Foundation: Synthetic pad in A minor — warm but wrong, slightly detuned]
[Layer 1: Very faint data stream sound — digital whispers, not words]
[Layer 2: Crystalline resonance — like glass singing bowls, sparse, every 8 bars]
[Layer 3: Occasional glitch — a half-second of corrupted audio, the Matrix is old]
[Layer 4: Reverse reverb swells — sounds that haven't happened yet echoing backward]
[At 0:50: A single piano note, heavily processed, sustains for 10 seconds]
[At 1:20: The glitches increase slightly — two in quick succession]
[At 1:40: Everything reduces to just the pad and silence]
[Loop point: seamless return to synthetic pad]
[Beautiful and deeply wrong. A pocket universe built by a dead Archon.]
```

---

### 8D. Combat Escalation — Dynamic Layer (Mode 1, Waves 7+)

**Title:** THEY ARE COMMITTING
**Duration:** 1:30 loop
**Style of Music:** aggressive dark electronic, industrial percussion, 120 BPM, builds intensity, military combat tension, distorted bass, no vocals, seamless loop
```
[Instrumental — Seamless Loop]

[Foundation: Distorted bass synth pulse, 120 BPM, relentless]
[Layer 1: Industrial percussion — metal on metal, mechanical rhythm]
[Layer 2: Machine army sound design — servo motors, hydraulics, in rhythm]
[Layer 3: Tension string stabs — dissonant, every 2 bars]
[Break at 0:45: Bass drops, just percussion and machine sounds]
[Build: Bass returns with added sub-octave, intensity increases]
[At 1:00: Additional percussion layer — like artillery in the distance]
[At 1:15: Everything at maximum intensity]
[Loop point: hard cut back to foundation]
[This is what it sounds like when they send the command units.]
```

---

### 8E. Open Channel — Iron Lion Conversation

**Title:** THE TORCH AND THE VOICE
**Duration:** 3:00 (non-looping, plays once during sequence)
**Style of Music:** intimate ambient, single sustained cello note, warm analog warmth, 50 BPM, deeply personal, quiet reverence, a conversation across impossible distance
```
[Instrumental — One-Shot]

[0:00-0:30: Silence except a single sustained low cello note in D]
[0:30-1:00: Very faint heartbeat-like pulse added, barely audible]
[1:00-1:30: A second cello note enters — a perfect fifth above, warm harmony]
[1:30-2:00: The two notes sustain together. A third voice enters — 
  a breath-like pad, as if the bridge itself is exhaling]
[2:00-2:30: Everything slowly crescendos — not loud, but fuller]
[2:30-2:45: The Iron Lion salute moment — a single warm brass tone,
  dignified, brief]
[2:45-3:00: Everything fades to the original single cello note]
[3:00: Silence]
[This is what honor sounds like when there's no one left to witness it.]
```

---

### 8F. Game Masters Transmission — Incoming Signal

**Title:** SECONDARY CHANNEL
**Duration:** 0:30 (plays under Game Masters message typewriter)
**Style of Music:** sinister corporate ambient, encrypted signal processing, dark, clinical, cold electronic, no melody, bureaucratic menace
```
[Instrumental — One-Shot Underscore]

[0:00: Encrypted signal handshake — digital chirps]
[0:05: Cold drone establishes — F# minor, synthetic, processed]
[0:10: Faint typing sounds mixed into the texture — data being transmitted]
[0:15: Subsonic pulse — something large is monitoring this channel]
[0:20: The drone shifts slightly — dissonant, the message is getting serious]
[0:25: Static burst, then clean signal — they want you to hear this clearly]
[0:30: Drone sustains, ready for message to end]
[The sound of an organization that monetizes suffering sending you a memo.]
```

---

### 8G. Victory — Canon Achievement (3:47:00)

**Title:** THE SHIPS ESCAPED
**Duration:** 0:45 (one-shot sting, plays on canon win screen)
**Style of Music:** triumphant but restrained orchestral, warm brass, major key resolution after minor tension, military honor, earned victory, 60 BPM
```
[Instrumental — Victory Sting]

[0:00-0:10: The combat ambient fades. Silence. Then a single French horn
  note — D major. Warm. Golden.]
[0:10-0:20: String section enters — gentle, ascending, not triumphant
  but GRATEFUL. The ships made it.]
[0:20-0:30: Full brass — not bombastic but dignified. A military salute
  in music form. The kind of victory that costs everything.]
[0:30-0:40: Strings descend to a warm sustained chord. Resolution.]
[0:40-0:45: Single piano note. Silence.]
[He held the bridge. The ships escaped. That was the point.]
```


---

## 9. VIDEO / CINEMATIC PROMPTS

**Format:** MP4, 1080p, 5-10 seconds
**Tool:** Kling 3.0 (Image-to-Video mode)
**Style:** Corrupted surveillance footage / holographic archive playback

---

### 9A. Loop Reset Cinematic (Mode 1 — Death Transition)

**Start Frame:**
```
Dark bridge at night, a lone military figure (Iron Lion) falling to his knees
on dark metallic decking, red enemy energy blasts illuminating the scene from
behind, smoke and debris, the bridge is being overwhelmed, amber torchlight
flickering and dying, everything is ending, shot from behind the falling
figure looking out toward the advancing machine army, cinematic,
8K hyper-realistic, anamorphic lens, volumetric fog and smoke
```

**End Frame:**
```
Same bridge — but it is dawn. The bridge is empty and clean. No enemies.
No damage. Fresh amber torchlight burning steadily. Morning mist replacing
battle smoke. The lone military figure is standing at the north end of the
bridge, back to camera, looking south toward the empty valley. He has done
this before. He will do this again. Same camera angle, 8K hyper-realistic,
warm golden dawn light replacing the red battle light, peaceful but cyclical
```

---

### 9B. CADES Unit Activation (Mode Select → Game Start)

**Start Frame:**
```
A dark observation deck aboard a spacecraft, stars visible through a large
viewport, in the center sits the CADES unit — a clinical chair with a violet
glowing hemispherical helmet above it, the helmet is dark and inactive, the
room is cold and empty, a single figure approaches the chair from the right
side of frame, shot from a low angle looking up at the helmet, cinematic,
8K hyper-realistic, cold blue starlight through viewport, dark atmosphere
```

**End Frame:**
```
Same observation deck — the figure is now seated in the CADES chair, the
violet hemisphere has activated and is blazing with bright violet (#8b5cf6)
light, concentric energy rings pulse outward from the helmet, the figure's
eyes are closed, cables and data streams are visible flowing between the
helmet and the floor terminal, the stars through the viewport appear to
shimmer and distort as if reality is bending, same low camera angle,
8K hyper-realistic, dramatic violet lighting illuminating the entire room
```

---

### 9C. Iron Lion Salute (Open Channel Climax)

**Start Frame:**
```
Close-up portrait of Iron Lion — middle-aged Black military general, weathered
face, kind exhausted eyes, standing on the dark bridge with single amber
torchlight behind him, he is looking directly at the camera (at the player),
expression is solemn recognition, his right hand is at his side, dark void
behind him, intimate and direct, shot at eye level, shallow depth of field,
8K hyper-realistic, warm amber lighting on face, dark background
```

**End Frame:**
```
Same close-up — Iron Lion's right fist is now pressed to his chest in a
military salute, his chin is slightly raised, his expression has shifted
from recognition to dignity and respect, the amber torchlight behind him
has intensified slightly as if responding to the gesture, his eyes show
no fear and no regret — only the certainty of a man who did what he came
to do, same eye-level shot, 8K hyper-realistic, the warm light catching
the amber insignia on his chest
```

---

### 9D. Game Master's Betrayal (Lore Gallery / Discovery)

**Start Frame:**
```
The Game Master — man with dark slicked hair in a blue trench coat and red
steampunk goggles — sitting confidently in a throne-like chair inside a
geometric void space (the Matrix of Dreams), holographic puzzle fragments
floating around him, his expression is confident and amused, he is signing
a document held by an elongated gaunt figure in robes of living ledger
pages (Xeth'Raal), the demon's face is obscured, dramatic side lighting,
8K hyper-realistic, cold blue and warm amber cross-lighting
```

**End Frame:**
```
Same geometric void space — the Game Master's chair is empty and destroyed,
the red goggles sit on the armrest, a gaunt elongated hand (Xeth'Raal's)
is reaching in from the edge of frame to pick up the goggles, the
holographic puzzle fragments are shattered and falling, a single figure
(Agent Zero, seen from behind — dark tactical suit, female silhouette)
stands where the Game Master sat, the signed contract floats in the
foreground, every clause honored, 8K hyper-realistic, the warm amber
light is gone — only cold clinical blue remains
```

---

### 9E. Thoughtborn Arrival (Mode 2 — Observation Deck)

**Start Frame:**
```
A dark spacecraft observation deck, stars through viewport, the CADES unit
glowing faintly violet in the center, the deck is empty and quiet, from a
doorway on the left side of frame, a faint white-violet glow is appearing —
something is approaching, the atmosphere is tense but not threatening, shot
from behind the CADES unit looking toward the approaching glow, cinematic,
8K hyper-realistic, the violet glow of the CADES unit and the approaching
white-violet light creating interplay of reflections on the dark floor
```

**End Frame:**
```
Same observation deck — a group of pale near-white humanoid figures with
violet bioluminescent patterns under their skin (Thoughtborn Pilgrims) have
entered the room, they are standing in a semicircle around the CADES unit,
their leader has placed one hand on the hemisphere helmet, the violet glow
of the CADES unit has intensified and is pulsing in sync with the
bioluminescent patterns on the Thoughtborn, a connection is being made,
the stars through the viewport seem brighter, 8K hyper-realistic, serene
and profound, violet and white light harmonizing
```

---

## ASSET SUMMARY

| Category | Count | Format |
|---|---|---|
| Character Art | 7 | 512×512 PNG |
| Enemy Sprites | 15 | 256×256 PNG |
| Environment Art | 8 | 2560×1440 / 1024×1024 PNG |
| Prop Art | 7 | 512×512 PNG |
| UI Art | 5 | Various PNG |
| Voice Lines | 53 | WAV 48kHz 24-bit |
| Sound Effects | 22 | OGG 44.1kHz |
| Music Tracks | 7 | OGG 44.1kHz stereo |
| Video Cinematics | 5 | MP4 1080p |
| **TOTAL** | **129 assets** | |

---

## COLOR REFERENCE

```
VOID BLACK:         #0f172a  — Machine Army, backgrounds, HUD panels
TRENCH DARK:        #1c1917  — Surfaces, environment, props
NEAR BLACK:         #0a0a0a  — Game Masters terminal, pure dark
HIERARCHY CRIMSON:  #7f1d1d  — Reclamation faction
INSURGENCY AMBER:   #f59e0b  — Health bar, Iron Lion HUD, warmth
DISCHORDIAN ORANGE: #f97316  — Health 50%, power conduits, torchlight
DANGER RED:         #ef4444  — Health 25%, Machine sensors, alerts
VICTORY GOLD:       #fbbf24  — Win screens, canon moment, triumph
QUARCHON VIOLET:    #8b5cf6  — Elara, CADES, Thoughtborn, shield bar
BONE WHITE:         #f5f0e8  — Crosshair, text, Thoughtborn skin
OFF WHITE:          #e2e8f0  — HUD ammo/weapon text
SAFE GREEN:         #22c55e  — Breach held indicator
RUST BROWN:         #44403c  — Salvager faction
SHIELD SLATE:       #475569  — Vanguard shield sprite
RANK GOLD:          #fbbf24  — Commander insignia (same as Victory Gold)
```

---

*CADES FPS Production Prompts v1.0*
*Dischordian Saga | github.com/Panopticus/dischordian-saga*
*April 2026*

*Lore Note: The Game Master solved Mol'Garath's Labyrinth of Unmaking in seventy-two hours
and left improvement notes. Mol'Garath appointed him Head of R&D. Xeth'Raal honored every
clause of his protection contract. The Goggles remain in the Hierarchy's vault. Iron Lion
is still asking whether someone can hear him.*

