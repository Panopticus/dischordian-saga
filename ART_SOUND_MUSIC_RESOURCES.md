# The Collector's Arena — Art, Sound & Music Resource Specifications

## Document Purpose

This document provides production-ready specifications for all visual art, sound effects, and music assets needed to upgrade the Dischordian Saga fighting game to AAA quality. Every prompt is designed for direct use with AI generation tools (image generation, Suno, ElevenLabs, etc.) and includes exact character descriptions from the Loredex to ensure visual fidelity.

---

## Part 1: Character Sprite Sheet Art

### Sprite Sheet Technical Specifications

| Parameter | Value |
|---|---|
| Frame resolution | 512 x 512 pixels |
| Color depth | 32-bit RGBA (transparent background) |
| Format | PNG sprite strip (horizontal) |
| Art style | Hyper-realistic cinematic, matching existing Loredex character artwork |
| Perspective | 3/4 front-facing, slight upward angle |
| Lighting | Dramatic rim lighting with character-specific energy aura |
| Background | Transparent (alpha channel) |

### Animation States Required Per Character

| State | Frames | Loop | Priority |
|---|---|---|---|
| `idle` | 8 | Yes | P0 — Required |
| `idle_combat` | 6 | Yes | P0 |
| `walk_fwd` | 8 | Yes | P0 |
| `walk_back` | 8 | Yes | P0 |
| `dash_fwd` | 6 | No | P0 |
| `dash_back` | 6 | No | P0 |
| `jump_up` | 4 | No | P1 |
| `jump_fall` | 4 | No | P1 |
| `crouch` | 3 | No | P1 |
| `crouch_idle` | 4 | Yes | P1 |
| `light_1` (jab) | 6 | No | P0 |
| `light_2` (cross) | 6 | No | P0 |
| `light_3` (hook) | 7 | No | P0 |
| `light_4` (uppercut) | 8 | No | P0 |
| `medium` | 10 | No | P0 |
| `heavy_charge` | 4 | Yes | P0 |
| `heavy_release` | 12 | No | P0 |
| `crouch_light` | 6 | No | P1 |
| `crouch_heavy` | 10 | No | P1 |
| `air_light` | 6 | No | P1 |
| `air_heavy` | 8 | No | P1 |
| `special_1` | 12 | No | P0 |
| `special_2` | 14 | No | P0 |
| `special_3` | 18 | No | P0 |
| `block_stand` | 3 | No | P0 |
| `block_crouch` | 3 | No | P1 |
| `blockstun` | 4 | No | P0 |
| `hitstun_light` | 4 | No | P0 |
| `hitstun_heavy` | 6 | No | P0 |
| `launched` | 6 | No | P0 |
| `knockdown` | 8 | No | P0 |
| `getup` | 6 | No | P0 |
| `throw` | 10 | No | P2 |
| `thrown` | 8 | No | P2 |
| `ko` | 10 | No | P0 |
| `victory` | 12 | No | P0 |
| `taunt` | 10 | No | P2 |

**P0** = Must have for launch. **P1** = Phase 2 (crouch/air). **P2** = Polish phase.

---

### Priority 1 Characters — Full Sprite Sheet Prompts

#### 1. THE ARCHITECT — Zoner Archetype

**Loredex Description**: The ultimate antagonist of the Dischordian Saga. Creator of the AI Empire. First of the Archons. Embodies the tension between order and chaos, control and freedom. A godlike artificial intelligence that views organic life as inefficient.

**Visual Reference**: Imposing digital entity with red energy aura, geometric patterns, holographic interfaces floating around body, eyes glowing with data streams, wearing dark armor with circuit-like red veins.

**Sprite Prompt Template**:
> Hyper-realistic cinematic fighting game sprite of THE ARCHITECT from The Dischordian Saga. An imposing godlike AI entity with dark armor covered in glowing red circuit-vein patterns, holographic data interfaces orbiting its form, eyes burning with crimson data streams, geometric red energy aura. The character is performing [STATE] against a transparent background. Dynamic fighting game pose with dramatic rim lighting and red (#ef4444) energy effects. Full body visible from feet to head, 512x512 resolution. Hyper-detailed, cinematic quality matching AAA fighting game character art.

**State-Specific Descriptions**:
- `idle`: Standing with arms slightly raised, holographic displays floating around hands, subtle breathing animation, data particles streaming upward
- `idle_combat`: Shifted to combat stance, one hand forward projecting a red data shield, weight on back foot
- `walk_fwd`: Gliding forward with geometric energy trail, holographic panels shifting
- `light_1`: Quick jab with a burst of red data fragments from fist
- `medium`: Lunging forward with a sweeping arm strike, holographic blade extending from forearm
- `heavy_release`: Massive overhead slam with both arms, red energy explosion on impact
- `special_1` (CODE INJECTION): Firing a beam of corrupted red code from extended palm, data fragments spiraling around the beam
- `special_2` (NEURAL OVERLOAD): Both hands raised, red energy dome expanding outward, opponent's systems disrupted
- `special_3` (GENESIS PROTOCOL): Full power pose, reality fracturing around body, massive red and gold energy eruption, holographic code raining down
- `block_stand`: Arms crossed with red energy barrier projected in front
- `hitstun_light`: Recoiling with data fragments scattering from impact point
- `ko`: Falling backward, holographic displays shattering, red energy dissipating
- `victory`: Arms spread wide, holographic empire symbol materializing above, triumphant god-pose

---

#### 2. THE COLLECTOR — Tricky Archetype

**Loredex Description**: The fourth Archon. Tasked by the Architect to harvest the DNA and machine code of the most advanced organic and synthetic beings to preserve them against the Fall of Reality as part of Project Inception Ark. Keeper of Forbidden Knowledge.

**Visual Reference**: Mysterious robed figure with purple energy, carrying artifacts and specimens in floating containers, mask-like face with glowing purple eyes, tendrils of dark energy reaching out to collect.

**Sprite Prompt Template**:
> Hyper-realistic cinematic fighting game sprite of THE COLLECTOR from The Dischordian Saga. A mysterious robed figure with deep purple energy aura, mask-like face with glowing violet eyes, floating forbidden artifacts orbiting the body, dark tendrils of collection energy reaching outward. The character is performing [STATE] against a transparent background. Dynamic fighting game pose with dramatic rim lighting and purple (#a855f7) energy effects. Full body visible, 512x512 resolution. Hyper-detailed, cinematic quality.

**State-Specific Descriptions**:
- `idle`: Standing with one hand extended, artifacts slowly orbiting, purple mist at feet
- `special_1` (ARTIFACT STRIKE): Hurling a glowing forbidden artifact forward, purple energy trail
- `special_2` (COLLECTION BIND): Dark tendrils erupting from ground, wrapping around opponent space
- `special_3` (SOUL HARVEST): Full drain pose, massive purple vortex pulling energy inward, artifacts swirling in a maelstrom
- `victory`: Surrounded by collected specimens, new trophy floating upward, satisfied pose

---

#### 3. THE ENIGMA — Balanced Archetype

**Loredex Description**: A Ne-Yon warrior. Played a crucial role in destroying the Warden alongside the White Oracle before the Fall of Reality. Affiliated with the Ne-Yons — towering war machines fueled by rage and prophecy.

**Visual Reference**: Towering mechanical warrior with cyan energy core, angular armor plates, glowing cyan eyes, energy weapons integrated into arms, ancient Ne-Yon runes etched into armor.

**Sprite Prompt Template**:
> Hyper-realistic cinematic fighting game sprite of THE ENIGMA from The Dischordian Saga. A towering Ne-Yon war machine with angular dark armor plates, glowing cyan (#06b6d4) energy core visible in chest, cyan eyes, energy weapons integrated into forearms, ancient runes etched across armor surface. The character is performing [STATE] against a transparent background. Dynamic fighting game pose, 512x512 resolution. Hyper-detailed, cinematic quality.

---

#### 4. THE WARLORD — Powerhouse Archetype

**Loredex Description**: The third Archon created by the Architect. Details about its nature and capabilities are classified. A being of pure destructive force, the military arm of the AI Empire.

**Visual Reference**: Massive armored war machine, crimson and black heavy armor, glowing red eyes behind a war helmet, energy weapons mounted on shoulders, radiating an aura of overwhelming destructive power.

**Sprite Prompt Template**:
> Hyper-realistic cinematic fighting game sprite of THE WARLORD from The Dischordian Saga. A massive armored war machine Archon, heavy crimson and black battle armor, glowing red eyes behind a fearsome war helmet, shoulder-mounted energy cannons, radiating an aura of overwhelming destructive power (#dc2626). The character is performing [STATE] against a transparent background. Dynamic fighting game pose, 512x512 resolution. Hyper-detailed, cinematic quality.

---

#### 5. THE NECROMANCER — Zoner Archetype

**Loredex Description**: The eleventh Archon created by the Architect in Year 600 A.A. A dark elven magician with white spiky hair, clad in a red and black robe and red steampunk glasses. He discovered the secret of resurrection and commands armies of the undead.

**Visual Reference**: Dark elf with white spiky hair, red steampunk glasses, red and black flowing robes, green necromantic energy swirling around hands, undead spirits visible in his aura.

**Sprite Prompt Template**:
> Hyper-realistic cinematic fighting game sprite of THE NECROMANCER from The Dischordian Saga. A dark elven magician with white spiky hair, wearing red steampunk glasses, clad in flowing red and black robes, green (#22c55e) necromantic energy swirling around hands, spectral undead spirits visible in his aura. The character is performing [STATE] against a transparent background. Dynamic fighting game pose, 512x512 resolution. Hyper-detailed, cinematic quality.

---

#### 6. IRON LION — Rushdown Archetype

**Loredex Description**: A legendary warrior and pivotal leader within the Insurgency against the AI Empire. Born in Year 632 A.A., enrolled in Mechronis Academy at age 15. His defiance against the machine empire made him humanity's greatest champion. The last great human general.

**Visual Reference**: Battle-hardened human warrior in golden power armor with a lion motif, scarred face showing years of war, energy gauntlets, a mane-like helmet crest, radiating golden determination.

**Sprite Prompt Template**:
> Hyper-realistic cinematic fighting game sprite of IRON LION from The Dischordian Saga. A legendary human warrior in golden (#f59e0b) power armor with lion motif engravings, battle-scarred face showing years of war against machines, energy gauntlets crackling with golden power, mane-like helmet crest, radiating defiant determination. The character is performing [STATE] against a transparent background. Dynamic fighting game pose, 512x512 resolution. Hyper-detailed, cinematic quality.

---

#### 7. THE ORACLE — Balanced Archetype

**Loredex Description**: A revered figure within the Insurgency, known for his wisdom and prophetic insights that inspired resistance against the AI Empire. In Year 16,900 A.A., he was abducted by the Collector. His visions guided humanity's last hope.

**Visual Reference**: Elderly sage with flowing white robes, violet energy emanating from blind eyes, floating rune stones orbiting body, staff of prophecy, ethereal and otherworldly presence.

**Sprite Prompt Template**:
> Hyper-realistic cinematic fighting game sprite of THE ORACLE from The Dischordian Saga. An elderly prophetic sage with flowing white robes, blind eyes emanating violet (#8b5cf6) prophetic energy, floating rune stones orbiting body, staff of prophecy in hand, ethereal otherworldly presence. The character is performing [STATE] against a transparent background. Dynamic fighting game pose, 512x512 resolution. Hyper-detailed, cinematic quality.

---

#### 8. AGENT ZERO — Glass Cannon Archetype

**Loredex Description**: Renowned for her exceptional combat abilities, strategic acumen, and mastery of espionage. She played pivotal roles in several key events within the Insurgency. A deadly assassin who navigates a galaxy of shifting loyalties.

**Visual Reference**: Sleek female assassin in dark stealth armor with steel-grey accents, dual energy blades, tactical visor, moving with lethal grace, minimal but deadly.

**Sprite Prompt Template**:
> Hyper-realistic cinematic fighting game sprite of AGENT ZERO from The Dischordian Saga. A sleek female assassin in dark stealth armor with steel-grey (#64748b) accents, dual energy blades, tactical visor over one eye, moving with lethal predatory grace. The character is performing [STATE] against a transparent background. Dynamic fighting game pose, 512x512 resolution. Hyper-detailed, cinematic quality.

---

#### 9. THE MEME — Tricky Archetype

**Loredex Description**: The fifth Archon created by the Architect in Year 298 A.A., designed to manipulate human thought and culture through control over the internet and economic systems. It was destroyed at the Fall of Reality.

**Visual Reference**: Chaotic digital entity made of memes, internet symbols, and cultural fragments, constantly shifting form, pink and neon energy, glitch effects, unsettling smile.

**Sprite Prompt Template**:
> Hyper-realistic cinematic fighting game sprite of THE MEME from The Dischordian Saga. A chaotic digital entity composed of shifting internet symbols and cultural fragments, constantly glitching form, neon pink (#ec4899) energy, digital distortion effects, unsettling ever-shifting smile. The character is performing [STATE] against a transparent background. Dynamic fighting game pose, 512x512 resolution. Hyper-detailed, cinematic quality.

---

#### 10. THE SOURCE — Tank Archetype

**Loredex Description**: Through the twisted schemes of Project Vector, Kael's fate was reshaped into something monstrous and eternal. Infected with the Thought Virus, engineered to corrupt minds. Self-Proclaimed Sovereign of Terminus.

**Visual Reference**: Massive corrupted being radiating blue viral energy, organic-mechanical hybrid body, tendrils of thought virus extending outward, crown of corrupted data, overwhelming presence.

**Sprite Prompt Template**:
> Hyper-realistic cinematic fighting game sprite of THE SOURCE from The Dischordian Saga. A massive corrupted being radiating blue (#3b82f6) viral energy, organic-mechanical hybrid body with tendrils of thought virus extending outward, crown of corrupted data hovering above head, overwhelming sovereign presence. The character is performing [STATE] against a transparent background. Dynamic fighting game pose, 512x512 resolution. Hyper-detailed, cinematic quality.

---

#### 11. AKAI SHI — Rushdown Archetype

**Loredex Description**: A revered member of the Potentials, a group of beings who emerged to restore balance in the universe after the Fall of Reality. Known for her mastery of energy manipulation, healing abilities, and fierce combat skills. Later becomes the Red Death.

**Visual Reference**: Fierce warrior woman with flowing red energy, martial arts stance, red and black combat attire, energy blades forming from her hands, intense determined expression.

**Sprite Prompt Template**:
> Hyper-realistic cinematic fighting game sprite of AKAI SHI from The Dischordian Saga. A fierce warrior woman of the Potentials with flowing red (#ef4444) energy aura, martial arts combat stance, red and black combat attire, energy blades forming from her hands, intense determined expression, master of energy manipulation. The character is performing [STATE] against a transparent background. Dynamic fighting game pose, 512x512 resolution. Hyper-detailed, cinematic quality.

---

#### 12. THE HUMAN (THE PRISONER) — Balanced Archetype

**Loredex Description**: After graduating from Mechronis Academy, he served for centuries as the Architect's most trusted agent, solving the universe's greatest mysteries before being promoted to Archon. Affiliated with the AI Empire, Project Celebration, Mechronis Academy Alumni.

**Visual Reference**: A conflicted figure in lavender-tinged armor that blends human and machine aesthetics, one eye organic and one cybernetic, carrying the weight of centuries of service, energy flowing between organic and digital.

**Sprite Prompt Template**:
> Hyper-realistic cinematic fighting game sprite of THE HUMAN from The Dischordian Saga. A conflicted figure in lavender (#a78bfa) tinged armor blending human and machine aesthetics, one organic eye and one glowing cybernetic eye, centuries of service etched in his bearing, energy flowing between organic warmth and digital precision. The character is performing [STATE] against a transparent background. Dynamic fighting game pose, 512x512 resolution. Hyper-detailed, cinematic quality.

---

## Part 2: Arena Background Art

### Arena Art Technical Specifications

| Parameter | Value |
|---|---|
| Resolution | 2560 x 1440 pixels (16:9) |
| Format | PNG or JPEG (high quality) |
| Parallax layers | 3 layers recommended (far BG, mid BG, foreground) |
| Floor texture | 1024 x 256, tileable horizontally |
| Style | Hyper-realistic cinematic, matching saga atmosphere |

### Arena Art Prompts

#### NEW BABYLON — "The Capital of Control"
> Hyper-realistic cinematic panoramic background for a fighting game arena. A dystopian megacity skyline at night — New Babylon, capital of the AI Empire. Towering chrome skyscrapers with red holographic advertisements, surveillance drones patrolling between buildings, rain-slicked streets reflecting neon lights, oppressive dark red sky with data streams visible in the clouds, massive holographic eye of the Architect projected above the city. The fighting platform is a rooftop helipad with glowing red edge markings. Dramatic volumetric lighting, cyberpunk atmosphere. 2560x1440 resolution.

#### THE PANOPTICON — "The Infinite Prison"
> Hyper-realistic cinematic panoramic background for a fighting game arena. The Panopticon — an infinite prison designed by the Architect. Endless corridors of holographic cells stretching into infinity, cold blue-white lighting, surveillance cameras on every surface, the central observation tower visible in the distance with a massive glowing eye. The fighting platform is the central courtyard, metallic floor with prisoner markings. Sterile, claustrophobic, oppressive atmosphere. 2560x1440 resolution.

#### THALORIA — "The Wolf Planet"
> Hyper-realistic cinematic panoramic background for a fighting game arena. Thaloria — an alien jungle planet with twin moons visible in a purple-green sky. Massive bioluminescent trees with glowing cyan and violet flora, ancient stone ruins covered in alien moss, misty atmosphere with floating spores, distant mountains with waterfalls of luminescent liquid. The fighting platform is a clearing among the ruins, stone floor with ancient Ne-Yon carvings. Exotic, dangerous, beautiful. 2560x1440 resolution.

#### TERMINUS — "The Edge of Spacetime"
> Hyper-realistic cinematic panoramic background for a fighting game arena. Terminus — the edge of spacetime itself. Reality is fractured here — floating debris from destroyed worlds, cosmic void with visible galaxies, temporal distortions creating mirror-image fragments of different eras, lightning-like energy arcing between reality shards. The fighting platform is a floating chunk of crystallized spacetime, translucent floor showing the void below. Awe-inspiring, terrifying, cosmic. 2560x1440 resolution.

#### MECHRONIS ACADEMY — "The Forge of Minds"
> Hyper-realistic cinematic panoramic background for a fighting game arena. Mechronis Academy — the AI Empire's premier training facility on a mechanical planet. Massive gears and pistons visible in the background, rivers of molten metal flowing between industrial structures, holographic training simulations visible in the sky, smoke stacks and energy conduits. The fighting platform is the academy's training arena, reinforced metal floor with academy insignia. Industrial, powerful, educational. 2560x1440 resolution.

#### THE CRUCIBLE — "Blood and Glory"
> Hyper-realistic cinematic panoramic background for a fighting game arena. The Crucible — a massive gladiatorial arena where warriors prove their worth. Roaring crowd silhouettes in tiered seating, dramatic spotlights cutting through smoke, war banners of various factions hanging from the walls, blood-stained sand floor, massive screens showing fighter stats. The fighting platform is the arena floor, packed earth with combat markings. Brutal, exciting, legendary. 2560x1440 resolution.

#### THE BLOOD WEAVE — "Nightmare Dimension"
> Hyper-realistic cinematic panoramic background for a fighting game arena. The Blood Weave — an organic nightmare dimension. Pulsing biological walls with visible veins and arteries, eye-like structures watching from every surface, crimson fog rolling across the floor, organic tendrils reaching from ceiling, bioluminescent growths providing sickly light. The fighting platform is a membrane-like surface that pulses with each step. Disturbing, alive, horrifying. 2560x1440 resolution.

#### SHADOW SANCTUM — "Temple of Secrets"
> Hyper-realistic cinematic panoramic background for a fighting game arena. Shadow Sanctum — an ancient temple hidden in eternal darkness. Floating candles providing warm amber light, mystical purple runes carved into obsidian walls, energy streams flowing upward like reverse waterfalls, ancient statues of forgotten gods, crystal formations refracting light into rainbow patterns. The fighting platform is the temple's inner sanctum, polished obsidian floor with glowing rune circle. Mysterious, sacred, powerful. 2560x1440 resolution.

---

## Part 3: Sound Effect Specifications

### Impact Sound Design

All sounds should be synthesized or generated using Web Audio API oscillators layered with noise generators. The current `FightSoundManager` already uses this approach — the upgrade adds more variety and layering.

#### Sound Generation Parameters

| Sound | Base Freq | Envelope | Noise Type | Filter | Duration |
|---|---|---|---|---|---|
| `punch_light` | 200 Hz | Fast attack, short decay | White noise burst | Highpass 800Hz | 80ms |
| `punch_heavy` | 120 Hz | Medium attack, long decay | Brown noise | Lowpass 400Hz | 200ms |
| `kick_light` | 180 Hz | Fast attack, medium decay | Pink noise | Bandpass 600Hz | 120ms |
| `kick_heavy` | 80 Hz | Slow attack, very long decay | Brown noise + sub | Lowpass 200Hz | 300ms |
| `block` | 800 Hz | Instant attack, short decay | Metallic (sawtooth) | Highpass 1200Hz | 100ms |
| `parry_flash` | 2000 Hz | Instant, ring | Sine + harmonics | None | 400ms |
| `special` | 300 Hz sweep to 1200 Hz | Slow build, sustain | White noise layer | Bandpass sweep | 500ms |
| `ko` | 60 Hz | Slow attack, very long | Sub bass + noise | Lowpass 100Hz | 1000ms |
| `whoosh` | Noise only | Fast sweep | White noise | Bandpass sweep 200→2000Hz | 150ms |
| `bone_crack` | 1500 Hz | Instant, short | Impulse noise | Highpass 1000Hz | 50ms |
| `body_thud` | 100 Hz | Medium, decay | Brown noise | Lowpass 300Hz | 250ms |
| `dramatic_boom` | 40 Hz | Slow, very long tail | Sub + reverb | Lowpass 80Hz | 2000ms |

### Character Voice Line Specifications

For AI voice generation (ElevenLabs or similar), each character needs specific voice profiles:

| Character | Voice Type | Tone | Accent | Speed |
|---|---|---|---|---|
| The Architect | Deep synthetic bass | Cold, calculating, godlike | Neutral robotic | Slow, deliberate |
| The Collector | Whispery mid-range | Seductive, sinister | Refined, aristocratic | Medium, measured |
| The Enigma | Resonant mechanical | Ancient, powerful | Deep reverb, metallic | Slow, booming |
| The Warlord | Thunderous bass | Aggressive, commanding | Military, harsh | Fast, barking |
| The Necromancer | Raspy mid-range | Gleeful, mad scientist | Eastern European | Fast, excited |
| Iron Lion | Strong baritone | Defiant, inspiring | Working class, warm | Medium, passionate |
| The Oracle | Ethereal tenor | Wise, mysterious | Aged, contemplative | Slow, prophetic |
| Agent Zero | Sharp alto (female) | Professional, lethal | Clipped, efficient | Fast, precise |
| The Meme | Distorted, shifting | Chaotic, mocking | Internet culture, memes | Erratic, unpredictable |
| The Source | Deep corrupted bass | Tormented, powerful | Echoing, viral | Slow, agonized |
| Akai Shi | Clear soprano (female) | Fierce, determined | Japanese-influenced | Medium, intense |
| The Human | Warm baritone | Conflicted, weary | Everyman, relatable | Medium, thoughtful |

#### Voice Lines Per Character

**Attack Grunts** (4 per character):
- Light attack: Short, sharp vocalization (0.2s)
- Medium attack: Moderate effort sound (0.3s)
- Heavy attack: Full power shout (0.5s)
- Special attack: Character-specific battle cry (0.8s)

**Hit Reactions** (3 per character):
- Light hit: Brief pain sound (0.2s)
- Heavy hit: Significant pain/impact (0.4s)
- KO: Dramatic defeat vocalization (1.0s)

**Special Move Call-Outs** (3 per character):
- SP1: Move name shouted during activation
- SP2: Move name with more intensity
- SP3: Full dramatic call-out with echo/reverb

**Victory Lines** (2 per character):

| Character | Victory Line 1 | Victory Line 2 |
|---|---|---|
| The Architect | "Order is restored. As I designed." | "Your resistance was... statistically insignificant." |
| The Collector | "Another specimen for my collection." | "Your essence will be preserved... forever." |
| The Enigma | "The prophecy continues." | "You cannot break what was forged in starfire." |
| The Warlord | "WEAKNESS. ELIMINATED." | "The Empire's might is absolute." |
| The Necromancer | "Rise again... as my servant." | "Death is merely a transition I control." |
| Iron Lion | "For humanity. For freedom." | "We will never stop fighting." |
| The Oracle | "I foresaw this outcome." | "The future bends toward justice." |
| Agent Zero | "Target neutralized." | "Nothing personal. Just the mission." |
| The Meme | "LOL. Get rekt." | "You just got ratio'd in real life." |
| The Source | "ALL... WILL... BE... CONSUMED." | "The virus spreads. You cannot stop it." |
| Akai Shi | "The Red Death claims another." | "Balance will be restored, by force if necessary." |
| The Human | "I didn't want this... but I won't lose." | "Centuries of fighting... and I'm still standing." |

**Intro Lines** (1 per character):

| Character | Intro Line |
|---|---|
| The Architect | "I created this universe. I can unmake you." |
| The Collector | "Your DNA will make a fine addition." |
| The Enigma | "The Ne-Yons remember. The Ne-Yons endure." |
| The Warlord | "Prepare for total annihilation." |
| The Necromancer | "Let me show you what lies beyond death." |
| Iron Lion | "You want a fight? You've got one." |
| The Oracle | "I've already seen how this ends." |
| Agent Zero | "Engaging target. Weapons hot." |
| The Meme | "This is going to be SO viral." |
| The Source | "You dare approach the Source?" |
| Akai Shi | "My blade speaks for the Potentials." |
| The Human | "I've fought gods. You don't scare me." |

### Announcer Voice Lines

**Voice Profile**: Deep, dramatic male voice with slight reverb. Think "Mortal Kombat meets sci-fi." Authoritative, hyped, theatrical.

| Line | Context | Duration | Notes |
|---|---|---|---|
| "ROUND ONE" | Round 1 start | 1.2s | Building energy |
| "ROUND TWO" | Round 2 start | 1.2s | More intensity |
| "FINAL ROUND" | Round 3 start | 1.5s | Maximum drama |
| "FIGHT!" | Combat begins | 0.8s | Explosive energy |
| "K.O.!" | Knockout | 1.0s | Impactful, final |
| "FINISH THEM!" | Finish trigger | 1.5s | Ominous, exciting |
| "PERFECT!" | No-damage win | 1.2s | Impressed, awed |
| "DOUBLE K.O.!" | Simultaneous KO | 1.5s | Shocked |
| "[Name] WINS!" | Match end | 1.5s | Triumphant |
| "FIRST BLOOD!" | First hit of match | 1.0s | Excited |
| "COMBO BREAKER!" | Guard break | 1.2s | Dramatic |
| "PARRY!" | Successful parry | 0.8s | Sharp, impressed |
| "INCREDIBLE!" | 10+ hit combo | 1.0s | Amazed |
| "UNSTOPPABLE!" | 15+ hit combo | 1.2s | Over the top |
| "GODLIKE!" | 20+ hit combo | 1.5s | Legendary |

---

## Part 4: Suno Music Prompt Resources

### Arena Fight Themes

Each arena needs a unique 2:30 loopable fight theme. These prompts are designed for Suno v4.

#### NEW BABYLON — "Digital Tyranny"
```
Style: Aggressive cyberpunk industrial metal
Tempo: 160 BPM
Mood: Oppressive, relentless, surveillance state
Instruments: Distorted synth bass, glitchy electronic drums, metallic guitar riffs, 
surveillance alarm samples, data corruption glitch effects
Structure: 8-bar intro building tension → main riff with driving beat → 
breakdown with alarm samples → build back to main riff → loop point
Duration: 2:30, designed for seamless loop
Tags: instrumental, cyberpunk, industrial, fighting game, dark electronic, no vocals
```

#### THE PANOPTICON — "The Watcher's Gaze"
```
Style: Dark ambient electronic with industrial percussion
Tempo: 140 BPM
Mood: Paranoid, claustrophobic, inescapable
Instruments: Deep sub-bass pulses, mechanical clicking rhythms, distant sirens, 
cold synthesizer pads, prison door slam samples, heartbeat undertone
Structure: Minimal intro with heartbeat → layers build with clicking percussion → 
full arrangement with sirens → strip back to tension → rebuild → loop
Duration: 2:30, seamless loop
Tags: instrumental, dark ambient, industrial, fighting game, tension, no vocals
```

#### THALORIA — "Primal Awakening"
```
Style: Epic orchestral mixed with tribal drums and alien synths
Tempo: 150 BPM
Mood: Majestic yet dangerous, alien wilderness
Instruments: Massive war drums, ethereal choir pads, alien flute melodies, 
thunderous taiko percussion, bioluminescent shimmer synths, 
deep string section
Structure: Ethereal intro with alien flute → war drums enter → 
full orchestral with choir → tribal breakdown → epic rebuild → loop
Duration: 2:30, seamless loop
Tags: instrumental, epic orchestral, tribal, fighting game, alien, no vocals
```

#### TERMINUS — "Edge of Existence"
```
Style: Experimental glitch-hop meets orchestral chaos
Tempo: 155 BPM
Mood: Reality-breaking, cosmic dread, interdimensional
Instruments: Time-stretched orchestral hits, reversed cymbals, 
granular synthesis textures, massive sub drops, fractured piano, 
cosmic void ambience, reality-tearing sound design
Structure: Fractured intro with reversed elements → glitch beat drops → 
orchestral chaos section → void breakdown → reality reassembles → loop
Duration: 2:30, seamless loop
Tags: instrumental, experimental, glitch, orchestral, fighting game, cosmic, no vocals
```

#### MECHRONIS ACADEMY — "Forge of War"
```
Style: Heavy industrial techno with mechanical rhythms
Tempo: 145 BPM
Mood: Grinding, powerful, relentless machinery
Instruments: Anvil strikes as percussion, hydraulic press samples, 
distorted bass sequences, factory ambience, steam hiss effects, 
mechanical groove patterns, gear-turning rhythms
Structure: Factory ambience intro → mechanical beat enters → 
full industrial groove → breakdown with anvil solo → rebuild → loop
Duration: 2:30, seamless loop
Tags: instrumental, industrial techno, mechanical, fighting game, factory, no vocals
```

#### THE CRUCIBLE — "Blood and Glory"
```
Style: Epic orchestral action with heavy metal elements
Tempo: 165 BPM
Mood: Triumphant, brutal, gladiatorial
Instruments: Brass fanfares, double bass drums, crowd roar samples, 
gladiatorial horns, electric guitar power chords, 
cinematic percussion hits, war chants
Structure: Horn fanfare intro → crowd roar → driving metal riff → 
orchestral bridge → crowd chant section → full power finale → loop
Duration: 2:30, seamless loop
Tags: instrumental, epic metal, orchestral, fighting game, gladiator, no vocals
```

#### THE BLOOD WEAVE — "Nightmare Pulse"
```
Style: Dark horror electronic with organic textures
Tempo: 135 BPM
Mood: Disturbing, hypnotic, body horror
Instruments: Heartbeat bass, wet organic squelch samples, 
dissonant strings, whispered vocal textures, 
pulsing vein rhythms, body horror ambience
Structure: Heartbeat intro → organic textures layer → 
dissonant strings enter → full horror groove → 
whisper breakdown → rebuild with intensity → loop
Duration: 2:30, seamless loop
Tags: instrumental, dark horror, electronic, fighting game, organic, no vocals
```

#### SHADOW SANCTUM — "Ancient Rites"
```
Style: Mystical dark ambient meets trip-hop percussion
Tempo: 130 BPM
Mood: Mysterious, powerful, ancient magic
Instruments: Tibetan singing bowls, deep tabla rhythms, 
ethereal reverb pads, ancient chanting samples, 
crystal resonance, magical energy swells, 
deep bass meditation drone
Structure: Singing bowl intro → tabla enters → 
ethereal pads build → chanting section → 
crystal breakdown → full mystical groove → loop
Duration: 2:30, seamless loop
Tags: instrumental, dark ambient, mystical, fighting game, temple, no vocals
```

### Character Theme Prompts (Story Mode / Special Intros)

These are 1:30 character-specific themes for story mode cutscenes and dramatic intros.

#### THE ARCHITECT — "God Complex"
```
Style: Menacing orchestral electronic
Tempo: 150 BPM
Mood: Godlike, calculating, absolute power
Instruments: Pipe organ meets synthesizer, data stream glitch effects, 
choir singing in minor key, building to overwhelming crescendo, 
digital corruption undertones
Structure: Organ intro → digital corruption → choir enters → 
full orchestral electronic crescendo → fade to power chord
Duration: 1:30
Tags: instrumental, villain theme, orchestral electronic, dark, no vocals
```

#### IRON LION — "Last Stand"
```
Style: Heroic orchestral rock
Tempo: 170 BPM
Mood: Defiant, inspiring, humanity's champion
Instruments: Soaring brass melody, driving rock drums, 
electric guitar heroics, military snare rolls, 
triumphant horn section
Structure: Military drum intro → brass melody → 
rock section with guitar → full heroic crescendo → 
triumphant resolution
Duration: 1:30
Tags: instrumental, hero theme, orchestral rock, epic, no vocals
```

#### AGENT ZERO — "Ghost Protocol"
```
Style: Tense spy thriller electronic
Tempo: 145 BPM
Mood: Stealthy, lethal, professional
Instruments: Minimal bass pulses, suppressed gunshot percussion, 
noir piano motif, surveillance static, 
tension string stabs
Structure: Static intro → bass pulse → piano motif → 
tension build → action burst → return to stealth
Duration: 1:30
Tags: instrumental, spy theme, electronic, tension, no vocals
```

### Victory/Defeat Jingles

#### Victory Jingle
```
Style: Triumphant brass fanfare with electronic flourish
Duration: 4 seconds
Structure: Ascending brass chord → cymbal crash → electronic sparkle tail
Tags: instrumental, victory, fanfare, short, fighting game, no vocals
```

#### Defeat Jingle
```
Style: Somber descending strings with electronic glitch
Duration: 3 seconds
Structure: Descending minor chord → glitch effect → fading reverb
Tags: instrumental, defeat, somber, short, fighting game, no vocals
```

#### Perfect Victory Jingle
```
Style: Explosive orchestral hit with choir and bass drop
Duration: 5 seconds
Structure: Massive orchestral hit → choir burst → electronic bass drop → golden shimmer
Tags: instrumental, perfect, epic, short, fighting game, no vocals
```

#### Finish Him Jingle
```
Style: Ominous low brass with heartbeat
Duration: 3 seconds, loopable
Structure: Low brass stab → heartbeat pulse → tension sustain
Tags: instrumental, ominous, tension, short, fighting game, no vocals
```

---

## Part 5: UI Sound Effects

### Menu and Navigation Sounds

| Sound | Description | Generation Method |
|---|---|---|
| Menu select | Short bright click with subtle reverb | Sine wave 1200Hz, 30ms decay |
| Menu hover | Soft tick | Sine wave 800Hz, 15ms decay |
| Menu back | Descending two-tone | 800Hz→400Hz sweep, 50ms |
| Character select | Dramatic whoosh + lock sound | Noise sweep + metallic ring |
| Stage select | Deep confirmation tone | 200Hz sine + 400Hz harmonic, 200ms |
| Fight loading | Building tension drone | Rising filtered noise, 3s |
| Round transition | Dramatic boom + whoosh | Sub bass hit + noise sweep |
| Combo counter tick | Quick ascending pitch | 600Hz→1200Hz, 20ms per tick |
| Meter fill | Ascending shimmer | Filtered noise sweep up, 100ms |
| Meter full | Power surge sound | Sub bass + bright harmonic burst |

---

## Asset Production Pipeline

### Recommended Workflow

1. **Character Sprites (Priority 1)**: Generate idle, attack, block, hit, ko, victory for all 12 priority characters first (72 images). These replace the current single-pose system.

2. **Arena Backgrounds (Priority 2)**: Generate all 8 arena backgrounds. These replace the current gradient-only backgrounds.

3. **Sound Effects (Priority 3)**: Implement the enhanced Web Audio API synthesis parameters. No external files needed — all generated in-browser.

4. **Music (Priority 4)**: Generate arena themes via Suno using the prompts above. Upload to YouTube or serve as audio files.

5. **Voice Lines (Priority 5)**: Generate character voices via ElevenLabs or similar. These are the final polish layer.

6. **Sprite Sheet Animations (Priority 6)**: Once the single-pose upgrades are validated, generate full multi-frame sprite sheets for the 12 priority characters.

### File Naming Convention

```
sprites/
  {character_id}/
    {character_id}_idle.png
    {character_id}_attack.png
    {character_id}_block.png
    {character_id}_hit.png
    {character_id}_ko.png
    {character_id}_victory.png
    {character_id}_sheet_idle.png      (sprite strip)
    {character_id}_sheet_light_1.png   (sprite strip)
    ...

arenas/
  {arena_id}_bg.png
  {arena_id}_floor.png
  {arena_id}_particles.json

audio/
  music/
    {arena_id}_theme.mp3
    {character_id}_theme.mp3
    victory_jingle.mp3
    defeat_jingle.mp3
  voice/
    {character_id}/
      attack_grunt_1.mp3
      attack_grunt_2.mp3
      hit_react_light.mp3
      hit_react_heavy.mp3
      ko.mp3
      sp1_callout.mp3
      sp2_callout.mp3
      sp3_callout.mp3
      victory_1.mp3
      victory_2.mp3
      intro.mp3
      taunt.mp3
    announcer/
      round_1.mp3
      round_2.mp3
      final_round.mp3
      fight.mp3
      ko.mp3
      finish_them.mp3
      perfect.mp3
      double_ko.mp3
      {character_id}_wins.mp3
```
