# The Collector's Arena — Fighting Game Engine Upgrade Design

## Castagne Research Verdict

**Castagne Engine** is a Godot-native fighting game toolkit written in GDScript with Rust extensions. It provides a custom scripting language (CASP), frame-based combat, hitbox/hurtbox collision, rollback netcode, and a visual editor. However, it **cannot be integrated into our web application** because:

- It requires the Godot runtime (native desktop only)
- Its Rust GDExtensions do not compile to WebAssembly
- Full GDExtension WASM support remains an open Godot proposal (#9177)
- No REST/WebSocket bridge exists to communicate with a React frontend

**Our current FightEngine3D already implements most Castagne-equivalent mechanics.** The strategy is to **upgrade the existing engine** with Castagne-inspired improvements rather than replacing it.

---

## Current Engine Inventory

| Component | Lines | Description |
|---|---|---|
| `FightEngine3D.ts` | 3,305 | Core frame-based combat engine (Three.js) |
| `FightArena3D.tsx` | 1,210 | React wrapper, MCOC-style mobile touch controls |
| `FightSoundManager.ts` | 719 | Web Audio API synthesized SFX + YouTube music |
| `CharacterModel3D.ts` | ~1,100 | Billboard sprite system with shader effects |
| `specialMoves.ts` | ~600 | Character-specific SP1/SP2/SP3 definitions |
| `storyMode.ts` | ~500 | 13-chapter story mode with dialogue |
| `gameData.ts` | ~800 | 41 fighters, 8 arenas, frame profiles |

### What Already Works (Castagne-Equivalent)

| Mechanic | Status | Details |
|---|---|---|
| 60fps frame-based timing | Done | Accumulator-based, not delta-time |
| Frame data (startup/active/recovery) | Done | Per-move FrameData structs |
| Input buffering | Done | 6-frame buffer window |
| Hitstop freeze frames | Done | 7-16 frames proportional to strength |
| Hitstun/blockstun | Done | With frame advantage calculations |
| Gatling chain combos | Done | L1→L2→L3→L4→M→H→Special |
| Juggle system | Done | Gravity, hit decay, juggle point budget |
| Pushback | Done | On hit and block with deceleration |
| Parry system | Done | 9-frame window, 72-frame stun reward |
| Guard break | Done | After 5 consecutive blocks |
| Special meter (3 levels) | Done | 0-300, comeback mechanic |
| Combo scaling | Done | 88% per hit, 30% floor |
| AI with 4 difficulty levels | Done | Pattern memory, reaction delay, whiff punish |
| 41 characters | Done | Unique configs, colors, 6 pose sprites each |
| Character-specific specials | Done | Projectile, rush, area, grab, counter, buff, drain |
| Story mode | Done | 13 chapters with pre/post dialogue |
| Mobile touch controls | Done | MCOC-style split screen gestures |
| Cinematic camera | Done | Intro sweep, KO zoom, special zoom |
| Finish Him mechanic | Done | At 15% HP, 3.5s slow-mo stun |
| 8 fighter archetypes | Done | Rushdown, powerhouse, grappler, zoner, etc. |

---

## Upgrade Plan — Castagne-Inspired Enhancements

### Phase 1: Sprite Sheet Animation System (HIGHEST PRIORITY)

**Current state**: Each character has 6 static pose images (idle, attack, block, hit, ko, victory). The engine swaps textures and applies scale/rotation transforms to simulate animation.

**Upgrade**: Replace single-pose images with multi-frame sprite sheets for fluid animation.

#### New Sprite Sheet Specification

Each character needs a **sprite sheet** with the following animation states:

| State | Frames | Loop | Description |
|---|---|---|---|
| `idle` | 8 | Yes | Breathing, subtle movement |
| `idle_combat` | 6 | Yes | Combat stance, more tense |
| `walk_fwd` | 8 | Yes | Walking forward |
| `walk_back` | 8 | Yes | Walking backward |
| `dash_fwd` | 6 | No | Forward dash burst |
| `dash_back` | 6 | No | Backward dash |
| `jump_up` | 4 | No | Ascending |
| `jump_peak` | 2 | No | At peak |
| `jump_fall` | 4 | No | Descending |
| `crouch` | 3 | No | Transition to crouch |
| `crouch_idle` | 4 | Yes | Crouching stance |
| `light_1` | 6 | No | Jab (2 startup, 2 active, 2 recovery) |
| `light_2` | 6 | No | Cross (2 startup, 2 active, 2 recovery) |
| `light_3` | 7 | No | Hook (2 startup, 3 active, 2 recovery) |
| `light_4` | 8 | No | Uppercut (3 startup, 2 active, 3 recovery) |
| `medium` | 10 | No | Lunging strike |
| `heavy_charge` | 4 | Yes | Charging pose (looping glow) |
| `heavy_release` | 12 | No | Heavy attack release |
| `crouch_light` | 6 | No | Low jab |
| `crouch_heavy` | 10 | No | Sweep/launcher |
| `air_light` | 6 | No | Air jab |
| `air_heavy` | 8 | No | Diving attack |
| `special_1` | 12 | No | Level 1 special |
| `special_2` | 14 | No | Level 2 special |
| `special_3` | 18 | No | Level 3 ultimate |
| `block_stand` | 3 | No | Standing block |
| `block_crouch` | 3 | No | Crouching block |
| `blockstun` | 4 | No | Recoil from blocked hit |
| `hitstun_light` | 4 | No | Light hit reaction |
| `hitstun_heavy` | 6 | No | Heavy hit reaction |
| `launched` | 6 | No | Launched into air |
| `knockdown` | 8 | No | Falling to ground |
| `getup` | 6 | No | Getting up |
| `throw` | 10 | No | Grab/throw |
| `thrown` | 8 | No | Being thrown |
| `ko` | 10 | No | Defeat animation |
| `victory` | 12 | No | Win pose |
| `taunt` | 10 | No | Character-specific taunt |

**Total: ~37 animation states, ~280 frames per character**

#### Sprite Sheet Format

- **Resolution**: 512x512 per frame (scaled to billboard size in-engine)
- **Sheet layout**: Horizontal strip per animation state
- **File format**: PNG with transparency
- **Naming convention**: `{character_id}_sheet_{state}.png`
- **Alternative**: Single atlas with JSON metadata (TexturePacker format)

#### Engine Changes Required

```typescript
// New SpriteAnimation interface
interface SpriteAnimation {
  frames: THREE.Texture[];  // Pre-sliced frame textures
  frameCount: number;
  frameDuration: number;    // In game frames (e.g., 2 = hold each sprite for 2 game frames)
  loop: boolean;
  onComplete?: () => void;  // Callback when non-looping animation ends
}

// New AnimationController per fighter
interface AnimationController {
  animations: Record<string, SpriteAnimation>;
  currentAnim: string;
  currentFrame: number;
  frameTimer: number;
  play(animName: string, force?: boolean): void;
  update(): void;  // Called each game frame
  getCurrentTexture(): THREE.Texture;
}
```

### Phase 2: Hitbox/Hurtbox Collision System

**Current state**: Distance-based collision (`range` field in FrameData). Simple but imprecise.

**Upgrade**: Per-frame hitbox/hurtbox rectangles for precise collision.

#### Collision Box Specification

```typescript
interface CollisionBox {
  x: number;      // Offset from character center (positive = forward)
  y: number;      // Offset from ground
  width: number;  // Box width
  height: number; // Box height
}

interface FrameCollisionData {
  hurtboxes: CollisionBox[];  // Vulnerable areas (always active)
  hitboxes: CollisionBox[];   // Attack areas (only during active frames)
}

// Per-character, per-animation-state, per-frame
type CollisionMap = Record<string, Record<string, FrameCollisionData[]>>;
```

#### Default Hurtbox Profiles by Archetype

| Archetype | Standing Hurtbox | Crouching Hurtbox |
|---|---|---|
| Rushdown | Narrow, tall (0.6w x 1.8h) | Wide, short (0.8w x 1.0h) |
| Powerhouse | Wide, tall (0.9w x 2.0h) | Wide, medium (1.0w x 1.2h) |
| Grappler | Very wide (1.0w x 2.0h) | Very wide, short (1.1w x 1.1h) |
| Zoner | Narrow (0.5w x 1.7h) | Narrow, short (0.6w x 0.9h) |
| Glass Cannon | Very narrow (0.4w x 1.6h) | Very narrow (0.5w x 0.8h) |

### Phase 3: Expanded Movement System

#### New Movement Options

| Move | Input | Frames | Description |
|---|---|---|---|
| Crouch | Down | 3 transition | Lowers hurtbox, enables low attacks |
| Crouch block | Down + Block | Instant | Blocks low attacks |
| Air light | Tap in air | 6 total | Quick aerial jab |
| Air heavy | Hold in air | 8 total | Diving attack, ground bounce |
| Wake-up attack | Tap during getup | 10 total | Invincible reversal (costs meter) |
| Wake-up block | Block during getup | Instant | Block on first actionable frame |
| Tech roll | Swipe during knockdown | 12 total | Roll to recover faster |
| Air recovery | Tap during launched | 8 total | Recover in air (limited uses) |

#### New Frame Data Additions

```typescript
// Crouch attacks
const CROUCH_LIGHT: FrameData = {
  startup: 6, active: 3, recovery: 10,
  hitstun: 14, blockstun: 8,
  damage: 3, pushbackHit: 0.2, pushbackBlock: 0.4,
  range: 0.9, meterGain: 3, cancelWindow: 5,
  jugglePoints: 1, launchHeight: 0,
  hitLevel: "low",  // NEW: must be crouch-blocked
};

const CROUCH_HEAVY: FrameData = {
  startup: 10, active: 5, recovery: 20,
  hitstun: 24, blockstun: 16,
  damage: 10, pushbackHit: 0.6, pushbackBlock: 1.0,
  range: 1.4, meterGain: 8, cancelWindow: 4,
  jugglePoints: 2, launchHeight: 4,  // Launcher!
  hitLevel: "low",
};

// Air attacks
const AIR_LIGHT: FrameData = {
  startup: 5, active: 4, recovery: 8,
  hitstun: 16, blockstun: 12,
  damage: 5, pushbackHit: 0.3, pushbackBlock: 0.5,
  range: 1.0, meterGain: 4, cancelWindow: 3,
  jugglePoints: 1, launchHeight: 0,
  hitLevel: "overhead",  // Must be stand-blocked
};

const AIR_HEAVY: FrameData = {
  startup: 8, active: 6, recovery: 14,
  hitstun: 22, blockstun: 18,
  damage: 12, pushbackHit: 1.0, pushbackBlock: 1.5,
  range: 1.3, meterGain: 8, cancelWindow: 0,
  jugglePoints: 2, launchHeight: 0,
  hitLevel: "overhead",
  groundBounce: true,  // NEW: bounces grounded opponent
};
```

### Phase 4: Character Sheet Integration

**Current gap**: Character sheet stats (strength, agility, intelligence, etc.) do not affect fight performance.

**Upgrade**: Character sheet attributes modify fighter parameters.

| Attribute | Fight Effect | Scaling |
|---|---|---|
| Strength | Damage multiplier | +2% per point above 5 |
| Agility | Walk/dash speed, recovery frames | -1 frame recovery per 3 agility above 5 |
| Intelligence | Special meter gain, combo scaling floor | +5% meter gain per point above 5 |
| Perception | Parry window, intercept window | +1 frame per 2 perception above 5 |
| Willpower | HP bonus, blockstun reduction | +3% HP per point above 5 |
| Charisma | Story mode dialogue options, crowd meter | Affects crowd reaction intensity |

#### Species Bonuses

| Species | Passive | Description |
|---|---|---|
| Human | Adaptability | +10% XP gain, balanced stats |
| Demagi | Rage Mode | Below 30% HP: +15% damage, +20% speed |
| Quarchon | Dimensional Shift | Backdash has 2 extra i-frames |
| Neyon | Energy Absorption | Blocking specials grants 50% more meter |
| Synthetic | System Override | Parry stun lasts 20% longer |

#### Class Combat Styles

| Class | Passive | Description |
|---|---|---|
| Soldier | Iron Guard | -10% chip damage, +2 guard break threshold |
| Spy | Shadow Step | Dash cooldown -5 frames, dash is 2 frames faster |
| Oracle | Foresight | Parry window +3 frames |
| Assassin | Critical Strike | 15% chance for 1.5x damage on first hit of combo |
| Engineer | Overclock | Special moves cost 10% less meter |

### Phase 5: Training Mode

| Feature | Description |
|---|---|
| Frame data display | Show startup/active/recovery in real-time |
| Hitbox viewer | Toggle hitbox/hurtbox visualization |
| Combo counter | Persistent combo display with damage, scaling, frame advantage |
| Input display | Show input history on screen |
| Dummy settings | Stand, crouch, jump, block all, block random, CPU |
| Record/playback | Record dummy actions and play them back |
| Reset position | Instant reset to neutral |
| Infinite meter | Toggle unlimited special meter |
| Infinite HP | Toggle invincibility |

### Phase 6: Polish and Presentation

#### Round Transitions

| Phase | Duration | Visual |
|---|---|---|
| Round announce | 90 frames | "ROUND 1" with dramatic zoom |
| Fight call | 30 frames | "FIGHT!" with screen flash |
| Round end | 120 frames | Winner pose, slow-mo on final hit |
| Match end | 180 frames | Full cinematic with character-specific victory |

#### Stage Interactions

- **Destructible elements**: Crates, pillars that break on heavy hits
- **Wall bounce**: Characters bounce off stage edges on heavy knockback
- **Stage hazards**: Optional environmental damage zones per arena

---

## Art Resource Specifications

### Character Sprite Sheets

For each of the **41 characters**, the following art assets are needed:

#### Image Generation Prompts (per character)

Each character needs **37 animation states** rendered as sprite sheets. For AI image generation, each prompt should follow this template:

> **Hyper-realistic cinematic character sprite sheet** of [CHARACTER NAME] from The Dischordian Saga. [EXACT CHARACTER DESCRIPTION FROM LOREDEX]. The character is shown in a [STATE DESCRIPTION] pose against a transparent background. Dynamic fighting game sprite style with dramatic lighting, energy effects matching their [PRIMARY COLOR] aura. Full body visible, feet to head, 512x512 resolution. The art style should match the existing Loredex character artwork exactly.

#### Priority Characters for Sprite Sheet Generation (Starter Roster)

| Priority | Character | Archetype | Primary Color |
|---|---|---|---|
| 1 | The Architect | Zoner | #ef4444 (Red) |
| 2 | The Collector | Tricky | #a855f7 (Purple) |
| 3 | The Enigma | Balanced | #06b6d4 (Cyan) |
| 4 | The Warlord | Powerhouse | #dc2626 (Crimson) |
| 5 | The Necromancer | Zoner | #22c55e (Green) |
| 6 | Iron Lion | Rushdown | #f59e0b (Gold) |
| 7 | The Oracle | Balanced | #8b5cf6 (Violet) |
| 8 | Agent Zero | Glass Cannon | #64748b (Steel) |
| 9 | The Meme | Tricky | #ec4899 (Pink) |
| 10 | The Source | Tank | #3b82f6 (Blue) |
| 11 | Akai Shi | Rushdown | #ef4444 (Red) |
| 12 | The Human/Prisoner | Balanced | #a78bfa (Lavender) |

### Arena Background Art

Each arena needs:
- **Background image**: 2560x1440 panoramic (parallax layers optional)
- **Floor texture**: 1024x256 tileable
- **Ambient particles**: Specification for particle effects (dust, embers, energy)

#### Arena Art Prompts

| Arena | Prompt Description |
|---|---|
| New Babylon | Dystopian megacity skyline, neon-lit towers, surveillance drones, rain-slicked streets, oppressive red sky |
| Panopticon | Infinite prison corridors, holographic cells, cold blue lighting, The Architect's eye symbol |
| Thaloria | Alien jungle planet, bioluminescent flora, twin moons, misty atmosphere, ancient ruins |
| Terminus | Edge of spacetime, fractured reality, floating debris, cosmic void, temporal distortions |
| Mechronis | Mechanical planet surface, gears and pistons, molten metal rivers, industrial smoke |
| The Crucible | Gladiatorial arena, roaring crowd silhouettes, spotlights, blood-stained floor, war banners |
| Blood Weave | Organic nightmare dimension, pulsing veins, eye-like structures, crimson fog |
| Shadow Sanctum | Ancient temple in darkness, floating candles, mystical runes, purple energy streams |

---

## Sound Design Specifications

### Sound Effect Categories

The current `FightSoundManager` uses Web Audio API synthesis. The upgrade adds **layered sound design**:

#### Impact Sounds (per attack strength)

| Category | Layers | Description |
|---|---|---|
| Light hit | 3 variants | Quick snap + flesh impact + cloth rustle |
| Medium hit | 3 variants | Thud + bone impact + whoosh |
| Heavy hit | 3 variants | Boom + crack + reverb tail |
| Special hit | Per-character | Unique energy/elemental sound |
| Block | 2 variants | Metal clang + energy shield hum |
| Parry | 1 | Sharp ring + time-stop effect |
| Whiff | Per-attack type | Whoosh at different pitches |

#### Character Voice Lines

Each character needs:

| Category | Count | Description |
|---|---|---|
| Attack grunts | 4 | Short vocalizations for light/medium/heavy/special |
| Hit reactions | 3 | Pain sounds (light/heavy/KO) |
| Special call-outs | 3 | SP1/SP2/SP3 move name shouts |
| Victory line | 2 | Character-specific win quotes |
| Defeat sound | 1 | KO vocalization |
| Taunt | 1 | Character-specific taunt line |
| Intro line | 1 | Pre-fight quote |

#### Announcer Voice Lines

| Line | Context |
|---|---|
| "Round 1/2/3" | Round start |
| "FIGHT!" | Round begin |
| "K.O.!" | Knockout |
| "FINISH HIM/HER!" | Finish trigger |
| "PERFECT!" | No-damage win |
| "DOUBLE K.O.!" | Simultaneous KO |
| "[Character] WINS!" | Match end |
| "FIRST BLOOD!" | First hit of match |
| "COMBO BREAKER!" | Guard break |
| "PARRY!" | Successful parry |

---

## Suno Music Prompt Resources

### Fight Theme Prompts (per Arena)

Each arena needs a **unique fight theme** generated via Suno. The prompts should produce high-energy combat music that matches the arena's atmosphere.

#### Suno Prompt Template

```
[Genre], [Tempo], [Mood], [Instruments], [Specific Direction]
```

#### Arena Music Prompts

**New Babylon — "Digital Tyranny"**
```
Aggressive cyberpunk industrial metal, 160 BPM, oppressive and relentless, distorted synth bass, 
glitchy electronic drums, metallic guitar riffs, surveillance alarm samples, building intensity 
with breakdowns. Dark sci-fi fighting game boss theme. No vocals. 2:30 duration, seamless loop.
```

**Panopticon — "The Watcher's Gaze"**
```
Dark ambient electronic with industrial percussion, 140 BPM, paranoid and claustrophobic, 
deep sub-bass pulses, mechanical clicking rhythms, distant sirens, cold synthesizer pads, 
prison door slam samples. Tense fighting game stage theme. No vocals. 2:30 duration, seamless loop.
```

**Thaloria — "Primal Awakening"**
```
Epic orchestral mixed with tribal drums and alien synths, 150 BPM, majestic yet dangerous, 
war drums, ethereal choir pads, alien flute melodies, thunderous percussion, 
bioluminescent shimmer effects. Exotic alien world fighting game theme. No vocals. 2:30 duration, seamless loop.
```

**Terminus — "Edge of Existence"**
```
Experimental glitch-hop meets orchestral chaos, 155 BPM, reality-breaking and intense, 
time-stretched orchestral hits, reversed cymbals, granular synthesis textures, 
massive sub drops, fractured piano, cosmic void ambience. 
Interdimensional fighting game theme. No vocals. 2:30 duration, seamless loop.
```

**Mechronis — "Forge of War"**
```
Heavy industrial techno with mechanical rhythms, 145 BPM, grinding and powerful, 
anvil strikes as percussion, hydraulic press samples, distorted bass sequences, 
factory ambience, steam hiss effects, relentless mechanical groove. 
Machine world fighting game theme. No vocals. 2:30 duration, seamless loop.
```

**The Crucible — "Blood and Glory"**
```
Epic orchestral action with heavy metal elements, 165 BPM, triumphant and brutal, 
brass fanfares, double bass drums, crowd roar samples, gladiatorial horns, 
electric guitar power chords, cinematic percussion hits. 
Arena combat fighting game theme. No vocals. 2:30 duration, seamless loop.
```

**Blood Weave — "Nightmare Pulse"**
```
Dark horror electronic with organic textures, 135 BPM, disturbing and hypnotic, 
heartbeat bass, wet organic squelch samples, dissonant strings, 
whispered vocal textures, pulsing veins rhythm, body horror ambience. 
Horror dimension fighting game theme. No vocals. 2:30 duration, seamless loop.
```

**Shadow Sanctum — "Ancient Rites"**
```
Mystical dark ambient meets trip-hop percussion, 130 BPM, mysterious and powerful, 
Tibetan singing bowls, deep tabla rhythms, ethereal reverb pads, 
ancient chanting samples, crystal resonance, magical energy swells. 
Dark temple fighting game theme. No vocals. 2:30 duration, seamless loop.
```

### Character Theme Prompts (for Story Mode / Special Intros)

**The Architect — "God Complex"**
```
Menacing orchestral electronic, 150 BPM, god-like and calculating, 
pipe organ meets synthesizer, data stream glitch effects, 
choir singing in minor key, building to overwhelming crescendo, 
AI overlord villain theme. No vocals. 1:30 duration.
```

**The Collector — "Forbidden Archive"**
```
Dark jazz meets electronic horror, 120 BPM, seductive and dangerous, 
smoky saxophone over glitch beats, music box melody distorted, 
whispered secrets in reverse, collection of stolen sounds, 
mysterious villain theme. No vocals. 1:30 duration.
```

**Iron Lion — "Last Stand"**
```
Heroic orchestral rock, 170 BPM, defiant and inspiring, 
soaring brass melody, driving rock drums, electric guitar heroics, 
military snare rolls, humanity's champion theme, 
epic final battle energy. No vocals. 1:30 duration.
```

**The Oracle — "Fractured Visions"**
```
Ethereal ambient meets progressive electronic, 140 BPM, prophetic and haunting, 
crystal harp arpeggios, time-stretched vocals, 
future-sight sound design (reversed audio), cosmic strings, 
mysterious seer theme. No vocals. 1:30 duration.
```

**Agent Zero — "Ghost Protocol"**
```
Tense spy thriller electronic, 145 BPM, stealthy and lethal, 
minimal bass pulses, suppressed gunshot percussion, 
noir piano motif, surveillance static, 
covert assassin theme. No vocals. 1:30 duration.
```

### Victory/Defeat Jingles

**Victory Jingle Prompt**
```
Triumphant brass fanfare with electronic flourish, 4 seconds, 
ascending chord progression, cymbal crash finale, 
fighting game victory stinger. No vocals.
```

**Defeat Jingle Prompt**
```
Somber descending strings with electronic glitch, 3 seconds, 
minor key resolution, fading reverb tail, 
fighting game defeat stinger. No vocals.
```

**Perfect Victory Prompt**
```
Explosive orchestral hit with choir and electronic bass drop, 5 seconds, 
overwhelming power, golden achievement energy, 
fighting game perfect round stinger. No vocals.
```

---

## Implementation Priority Order

| Priority | Task | Effort | Impact |
|---|---|---|---|
| 1 | Sprite sheet animation system | High | Transforms visual quality |
| 2 | Crouch/low attacks + air attacks | Medium | Doubles gameplay depth |
| 3 | Hitbox/hurtbox collision | Medium | Precision combat feel |
| 4 | Character sheet stat integration | Medium | RPG progression impact |
| 5 | Training mode | Medium | Player skill development |
| 6 | New arena music (Suno) | Low | Atmosphere upgrade |
| 7 | Character voice lines | Low | Personality and immersion |
| 8 | Round transition cinematics | Low | Presentation polish |
| 9 | Stage interactions | Low | Environmental depth |
| 10 | Announcer voice pack | Low | Hype factor |
