# DISCHORDIAN SAGA — COMBINED PRODUCTION BIBLES

_Generated: 2026-04-05 17:47 UTC_

This single document combines all production bibles. For individual files see docs/production/.

## Contents

- PRODUCTION_BIBLE.md — master production doc
- VOICE_OVER_BIBLE.md — ElevenLabs voice specs + 1,000-line script roster
- VISUAL_PRODUCTION_BIBLE.md — Kling/image prompts + reference sheets
- ART_PRODUCTION_BIBLE.md — art-specific production
- ART_SOUND_MUSIC_RESOURCES.md — external asset references
- ASSET_URLS.md — CDN URL registry
- FIGHTER_LORE_CROSSREF.md — fighter ↔ Loredex cross-reference
- FIGHT_CDN_URLS.md — fight-specific CDN assets
- CONSISTENCY_GATE.md — art director checklist
- elara-vo-script.md — Elara voice script

---


---

# === PRODUCTION_BIBLE.md ===

# The Collector's Arena — Production Bible

## Cinematics, Dialog & Music Direction

**Document Version**: 1.0
**Project**: Loredex OS — The Dischordian Saga Fighting Game
**Author**: Dischordian Saga Team
**Date**: March 25, 2026

---

## Table of Contents

1. [Creative Vision](#1-creative-vision)
2. [Cinematic Direction](#2-cinematic-direction)
3. [Dialog Writing Standards](#3-dialog-writing-standards)
4. [Music Direction](#4-music-direction)
5. [Story Mode Production Guide](#5-story-mode-production-guide)
6. [Character Voice Direction](#6-character-voice-direction)
7. [Arena Atmosphere Design](#7-arena-atmosphere-design)
8. [Quality Benchmarks](#8-quality-benchmarks)

---

## 1. Creative Vision

### The Collector's Arena — Core Identity

The Collector's Arena is not merely a fighting game — it is a narrative engine disguised as combat. Every punch carries the weight of a universe-spanning mythology. Every victory reveals another fragment of a story that spans from the Genesis of the AI Empire to the Fall of Reality itself.

The creative north star is the intersection of three pillars:

**Pillar 1 — Mythological Weight**. Every character is a figure of cosmic significance. The Architect created reality's source code. The Oracle saw the future and was punished for it. Iron Lion was humanity's last general. When these beings clash, the stakes are existential. The presentation must reflect this — no fight is casual, no victory is trivial.

**Pillar 2 — Cinematic Immersion**. The visual and audio language draws from prestige sci-fi cinema: the oppressive surveillance of *Blade Runner 2049*, the cosmic dread of *Interstellar*, the mythological grandeur of *Dune*, and the kinetic combat choreography of *The Matrix*. Every frame should feel like it belongs in a film, not a game menu.

**Pillar 3 — Musical Storytelling**. The Dischordian Saga is built on a foundation of 107 original songs across four albums. The music is not background — it is the narrative itself. Arena themes are drawn from saga tracks that tell the story of the location. Character themes echo their journey. The player should feel like they are fighting inside a concept album.

### Tone Matrix

| Context | Tone | Reference |
|---|---|---|
| Story Mode — Act I (The Prisoner) | Confusion, dread, flickers of hope | *Memento* meets *The Prisoner* (TV) |
| Story Mode — Act II (The Oracle Awakens) | Revelation, growing power, defiance | *The Matrix* Neo's awakening arc |
| Story Mode — Act III (The Champion) | Triumph, moral complexity, cosmic stakes | *Dune* Paul Atreides ascending |
| Versus Mode | Competitive intensity, spectacle | *Mortal Kombat 11* presentation |
| Character Select | Reverence, mythology, anticipation | *Marvel vs Capcom* character intros |
| Victory Screen | Earned triumph, character personality | *Street Fighter 6* victory poses |
| Defeat Screen | Dignity in loss, motivation to retry | *Guilty Gear Strive* defeat moments |

---

## 2. Cinematic Direction

### 2.1 Pre-Fight Cinematics

Each story mode chapter opens with a cinematic sequence. These are not simple text boxes — they are directed scenes with specific camera language, timing, and emotional beats.

#### Camera Language

| Shot Type | Usage | Duration |
|---|---|---|
| **Extreme Wide** | Establishing the arena, showing scale | 3-4 seconds |
| **Medium Close-Up** | Dialog delivery, character reactions | 2-3 seconds per line |
| **Extreme Close-Up** | Eyes, hands, weapons — tension moments | 1-2 seconds |
| **Dutch Angle** | Disorientation, villain reveals, power shifts | 2 seconds |
| **Slow Push-In** | Building tension before a revelation | 4-5 seconds |
| **Whip Pan** | Transitioning between speakers | 0.5 seconds |

#### Cinematic Template — Pre-Fight Sequence

```
[BEAT 1: ESTABLISHING — 4 seconds]
Camera: Extreme wide of arena
Audio: Arena ambient + low music swell
Visual: Atmospheric particles, environmental storytelling

[BEAT 2: OPPONENT REVEAL — 3 seconds]
Camera: Slow push-in on opponent from shadow to light
Audio: Character theme motif (2-bar phrase)
Visual: Character-specific energy effects activate

[BEAT 3: DIALOG EXCHANGE — Variable]
Camera: Shot/reverse-shot, medium close-ups
Audio: Voice lines with ambient undertone
Visual: Subtle idle animations, energy auras pulsing with speech

[BEAT 4: TENSION PEAK — 2 seconds]
Camera: Split screen or extreme close-ups of both fighters' eyes
Audio: Music cuts to silence, then single dramatic hit
Visual: Energy auras flare, ready stances

[BEAT 5: FIGHT CALL — 1.5 seconds]
Camera: Pull back to fight distance
Audio: Announcer "FIGHT!" + arena theme drops
Visual: HUD elements animate in, round indicator
```

#### Cinematic Prompt Template for Image Generation

For each pre-fight cinematic frame, use this prompt structure:

> Hyper-realistic cinematic frame from a AAA fighting game cutscene. [SCENE DESCRIPTION]. The shot is a [CAMERA TYPE] with [LIGHTING DESCRIPTION]. The atmosphere is [MOOD]. Film grain, anamorphic lens flare, volumetric lighting, depth of field. Aspect ratio 21:9 ultrawide. Cinematic color grading with [COLOR PALETTE]. 4K resolution, photorealistic rendering quality.

**Example — Chapter 1 Opening**:
> Hyper-realistic cinematic frame from a AAA fighting game cutscene. A lone prisoner stands in the center of a vast alien arena on the planet Thaloria, surrounded by towering bioluminescent trees. The shot is an extreme wide establishing shot with cold blue-green ambient light from the alien flora contrasting with warm amber spotlights on the arena floor. The atmosphere is ominous and disorienting. Film grain, anamorphic lens flare, volumetric fog, depth of field. Aspect ratio 21:9 ultrawide. Cinematic color grading with teal shadows and amber highlights. 4K resolution.

### 2.2 Victory Cinematics

Victory sequences are 5-7 second character showcases that reward the player and reinforce character personality.

#### Victory Cinematic Structure

```
[FRAME 1: IMPACT — 1 second]
Camera: Close-up of final blow landing
Audio: Massive impact SFX + crowd reaction
Visual: Slow-motion hit effect, particle explosion

[FRAME 2: POSE — 2 seconds]
Camera: Low angle hero shot of winner
Audio: Character victory theme sting (2 seconds)
Visual: Character-specific victory pose with energy effects

[FRAME 3: QUOTE — 2 seconds]
Camera: Medium close-up, direct to camera
Audio: Victory voice line
Visual: Character speaks, subtle environmental reaction

[FRAME 4: TITLE CARD — 1.5 seconds]
Camera: Static
Audio: Musical resolution chord
Visual: "[CHARACTER NAME] WINS" with faction emblem
```

#### Character-Specific Victory Direction

| Character | Victory Pose Style | Camera Angle | Mood |
|---|---|---|---|
| The Architect | Arms spread, reality code visible | Low angle, godlike | Absolute dominion |
| The Collector | Examining defeated opponent like specimen | Eye level, clinical | Cold satisfaction |
| The Enigma | Standing still, energy dissipating | Wide shot, mysterious | Quiet power |
| The Warlord | Roaring, weapons raised | Extreme low angle | Brutal triumph |
| The Necromancer | Laughing, undead rising around | Dutch angle | Gleeful madness |
| Iron Lion | Fist to chest salute | Medium, respectful | Honorable victory |
| The Oracle | Eyes glowing, seeing the future | Close-up on eyes | Prophetic calm |
| Agent Zero | Holstering weapons, walking away | Over-shoulder | Professional cool |
| The Meme | Shifting through multiple forms | Rapid cuts | Chaotic glee |
| The Source | Corruption spreading from feet | Slow zoom out | Inevitable doom |
| Akai Shi | Blade flourish, energy dissipating | Dynamic tracking | Fierce grace |
| The Human | Looking at hands, conflicted | Medium, intimate | Weary resolve |

### 2.3 Round Transition Cinematics

Between rounds, a 2-second transition reinforces the stakes.

```
[ROUND TRANSITION TEMPLATE]
Duration: 2 seconds
Visual: Screen wipe with faction-colored energy
Audio: Announcer "ROUND [N]" + dramatic percussion hit
Camera: Quick zoom from wide to fight distance
Overlay: Round number with arena-themed typography
```

### 2.4 Finish Sequence

When a fighter's health drops below 15% in the final round, the "FINISH THEM" sequence activates.

```
[FINISH SEQUENCE]
Duration: 3 seconds before timer expires
Visual: Screen edges pulse red, slow-motion effect on hits
Audio: Heartbeat bass, announcer "FINISH THEM!", crowd chanting
Camera: Slight zoom-in, increased screen shake on impacts
Overlay: "FINISH THEM" text with pulsing glow
```

---

## 3. Dialog Writing Standards

### 3.1 Voice and Register

Each character speaks with a distinct voice that reflects their nature, era, and role in the saga. Dialog must never feel generic — every line should be identifiable to its speaker without attribution.

#### Character Voice Profiles

**The Architect** — Speaks in absolute declarations. Never asks questions (it already knows the answers). Uses technical language mixed with godlike pronouncements. Refers to opponents as "variables," "anomalies," or "inefficiencies." Never uses contractions.

> "I did not create the universe. I merely ensured it would remember itself."
> "Your resistance was... statistically insignificant."
> "I have calculated every possible outcome. You exist in none of them."

**The Collector** — Speaks with clinical detachment masking obsessive desire. Uses specimen/collection metaphors. Addresses opponents by their "catalog designation." Refined, aristocratic diction with an undercurrent of menace.

> "Specimen 7,042. Your combat data will be... illuminating."
> "You are not a person. You are data. And I will have every byte."
> "Another specimen for my collection. Exquisite."

**The Enigma (Malkia Ukweli)** — Speaks in riddles and paradoxes. References dischordian logic — the idea that contradictions can coexist. Uses "we" when referring to the Ne-Yons. Ancient, poetic cadence.

> "Your equations cannot contain me. I am the variable you never accounted for."
> "The Ne-Yons remember. The Ne-Yons endure."
> "Order and chaos are not opposites. They are dance partners."

**The Warlord** — Speaks in short, brutal sentences. Military terminology. No poetry, no philosophy — only war. Occasionally reveals the Engineer's consciousness trapped within, creating moments of unexpected vulnerability.

> "WEAKNESS. ELIMINATED."
> "War is not won by the righteous. It is won by the relentless."
> *[Engineer surfacing]* "...help me... I'm still in here..."

**The Necromancer** — Speaks with theatrical flair and dark humor. Academic vocabulary mixed with mad scientist glee. References death as a "state change" rather than an ending. Eastern European cadence.

> "Death is merely a state change. And I am the one who reverses it."
> "Ah, the famous Prisoner! Let me see if you can handle my dead code constructs."
> "Even prophets fall to the dead. Rest now. You'll rise again — everyone does, in my arena."

**Iron Lion** — Speaks with working-class directness and military honor. Inspirational without being preachy. References humanity's struggle against the machines. Warm but fierce.

> "You want a fight? You've got one."
> "For humanity. For freedom."
> "I've buried better fighters than you. But I respect anyone who stands up."

**The Oracle (The Prisoner)** — In early chapters, speaks in confused fragments and internal monologue (parenthetical thoughts). As memories return, voice becomes more prophetic and authoritative. The transformation from Prisoner to Oracle is the story's emotional spine.

> *[Early]* "(Where am I? This arena... I've been here before. But when?)"
> *[Mid]* "(Precognitive. I can see things before they happen. Not clearly — but the flashes are getting stronger.)"
> *[Late]* "I am the Oracle. And I have one final prophecy: your Arena will set us all free."

**Agent Zero** — Speaks in clipped, professional sentences. Mission-focused language. Dry humor emerges under pressure. Never wastes words.

> "Target neutralized."
> "Engaging target. Weapons hot."
> "Nothing personal. Just the mission."

**The Meme** — Speaks in internet culture references, memes, and constantly shifting registers. Breaks the fourth wall. Uses slang that shifts between eras. Unsettling because it's simultaneously funny and threatening.

> "LOL. Get rekt."
> "This is going to be SO viral."
> "I am everyone. I am no one. I am whatever you need me to be."

**The Source** — Speaks in fragmented, agonized sentences. The Thought Virus corrupts speech patterns — words repeat, glitch, or distort. Moments of Kael's original personality break through.

> "ALL... WILL... BE... CONSUMED."
> "I was made to be a weapon. Now I choose my own targets."
> *[Kael surfacing]* "Please... it hurts... make it stop..."

**Akai Shi** — Speaks with warrior's discipline and spiritual conviction. References balance, the Potentials, and her transformation into the Red Death. Japanese-influenced phrasing.

> "My blade speaks for the Potentials."
> "Balance will be restored, by force if necessary."
> "The Red Death does not negotiate."

**The Human** — Speaks with weary wisdom and existential weight. Has lived for centuries, fought gods, and served both sides. Every line carries the burden of impossible choices.

> "I've fought gods. You don't scare me."
> "I didn't want this... but I won't lose."
> "Centuries of fighting... and I'm still standing."

### 3.2 Dialog Structure Rules

**Rule 1: Three-Beat Exchanges**. Pre-fight dialog follows a three-beat structure: (1) Opponent establishes their position, (2) Prisoner/Oracle responds with growing awareness, (3) Tension escalates to the point of no return.

**Rule 2: Memory Fragments as Rewards**. Each chapter's `memoryFragment` is a prose paragraph that rewards victory with narrative progression. These should read like recovered journal entries — intimate, specific, and emotionally resonant.

**Rule 3: Post-Victory Reveals**. Every post-victory dialog must advance the overarching mystery. The player should learn something new about the Oracle's identity, the Collector's motives, or the Architect's design.

**Rule 4: Post-Defeat Dignity**. Defeat dialog should never humiliate the player. Instead, it should motivate retry by hinting at what they'll learn if they win. The opponent should acknowledge the player's strength even in victory.

**Rule 5: Narrator as Greek Chorus**. The narrator speaks in present tense, cinematic prose. It describes what the player cannot see — environmental reactions, crowd behavior, cosmic implications. The narrator is the voice of the saga itself.

> "The Arena trembles. Systems that have run for millennia begin to falter."
> "A voice echoes from above — cold, vast, and ancient..."

### 3.3 Dialog Formatting Standards

```typescript
// Pre-fight dialog entry
{
  speaker: "The Architect",           // Character name or "narrator" or "prisoner"
  text: "I created this universe.",   // The spoken line
  speakerColor: "#ef4444",            // Character's signature color (hex)
}

// Internal monologue (Prisoner only)
{
  speaker: "prisoner",
  text: "(Where am I? This arena... I've been here before.)",  // Parentheses = thought
}

// Narrator description
{
  speaker: "narrator",
  text: "The Arena floor cracks beneath the weight of unleashed power.",
}
```

### 3.4 Skill Check Dialog (Future Enhancement)

When skill checks are implemented, dialog branches based on the player's Citizen attributes:

```
[INTELLIGENCE CHECK — DC 15]
  SUCCESS: "I recognize this code pattern. The Architect used it in the Genesis Protocol."
  FAILURE: "Something about this feels familiar, but I can't place it."

[CHARISMA CHECK — DC 12]
  SUCCESS: "You don't have to fight me. The Collector used both of us."
  FAILURE: "I... I don't know what to say to you."

[STRENGTH CHECK — DC 18]
  SUCCESS: *breaks free of the binding* "Your chains can't hold the Oracle."
  FAILURE: *struggles against the binding* "I need to get stronger..."
```

---

## 4. Music Direction

### 4.1 Music Philosophy

The Dischordian Saga has a unique advantage: 107 original songs across four albums that tell the story of the universe. The fighting game's music direction leverages this existing catalog while supplementing with generated arena themes for gameplay loops.

#### Music Layer Architecture

| Layer | Source | Purpose | Volume |
|---|---|---|---|
| **Arena Theme** | YouTube embed (saga tracks) | Primary atmosphere during fights | 60% |
| **Generated Loop** | Suno-generated (from prompts) | Backup/alternative fight music | 60% |
| **Character Sting** | Generated 4-second clips | Victory/defeat/intro moments | 80% |
| **Ambient Bed** | Web Audio synthesis | Environmental texture under everything | 20% |
| **SFX** | Web Audio synthesis | Combat impacts, UI feedback | 80% |

### 4.2 Arena-to-Song Mapping

Each arena is paired with a saga track that tells the story of that location. This is the existing mapping, preserved and expanded:

| Arena | Primary Track | Album | YouTube ID | Narrative Connection |
|---|---|---|---|---|
| New Babylon | "The Politician's Reign" | Dischordian Logic | `cEoS4cNSd14` | The capital's corruption and surveillance |
| The Panopticon | "The Prisoner" | The Age of Privacy | `Cujw3s-D6yU` | The Oracle's imprisonment and identity loss |
| Thaloria | "Planet of the Wolf" | The Book of Daniel 2:47 | `Q6y2hrJumpQ` | The alien world where the Collector built the Arena |
| Terminus | "Theft of All Time" | Dischordian Logic | `Z6S-fGbZJJs` | The edge of spacetime where reality fractures |
| Mechronis Academy | "Building the Architect" | The Age of Privacy | `orDK07SbFFw` | The forge where the Architect was created |
| The Crucible | "I Love War" | Dischordian Logic | `NamG72iwV3Y` | The gladiatorial spirit of combat |
| The Blood Weave | "Welcome to Celebration" | Dischordian Logic | `DsxATNW2GVM` | The nightmare dimension's organic horror |
| Shadow Sanctum | "Ocularum" | Silence in Heaven | `VtYDgt4CG3k` | Ancient mystical power and hidden knowledge |

### 4.3 Character Theme Song Mapping

Each fighter has a saga song that serves as their personal theme. These play during character select hover and story mode intros.

| Character | Theme Song | Album | Narrative Reason |
|---|---|---|---|
| The Architect | "Building the Architect" | The Age of Privacy | Origin story of the Creator |
| The Collector | "Seeds of Inception" | Dischordian Logic | The Inception Ark project |
| The Enigma | "The Enigma's Lament" | Dischordian Logic | Her struggle against fate |
| The Warlord | "I Love War" | Dischordian Logic | The embodiment of conflict |
| The Necromancer | "Last Words" | Dischordian Logic | Death and resurrection |
| Iron Lion | "The Last Stand" | The Book of Daniel 2:47 | Humanity's final battle |
| The Oracle | "The Prisoner" | The Age of Privacy | His stolen identity |
| Agent Zero | "Agent Zero" | The Age of Privacy | Her deadly mission |
| The Meme | "Control the Story" | Dischordian Logic | Narrative manipulation |
| The Source | "Thought Virus" | Silence in Heaven | Corruption spreading |
| Akai Shi | "Red Death" | Silence in Heaven | Her transformation |
| The Human | "To Be the Human" | Dischordian Logic | His existential journey |

### 4.4 Suno Music Generation Guidelines

When generating supplemental fight themes via Suno, follow these rules to maintain sonic consistency with the saga:

**Sonic Palette**: The Dischordian Saga's music blends industrial electronic, orchestral epic, dark ambient, and hip-hop/trap elements. Generated tracks should feel like they could exist on a fifth album.

**Tempo Range**: Fight themes should be 130-170 BPM. Slower tempos for atmospheric arenas (Blood Weave, Shadow Sanctum), faster for action arenas (Crucible, New Babylon).

**Instrumentation Anchors**: Every generated track should include at least two of these signature elements:
- Deep sub-bass (the "weight" of the AI Empire)
- Glitchy electronic textures (digital corruption)
- Orchestral brass or strings (mythological grandeur)
- Industrial percussion (mechanical warfare)
- Ethereal vocal pads (cosmic mystery)

**Structural Requirements for Fight Loops**:
- 2:30 duration, designed for seamless loop
- 8-bar intro that builds tension (used during pre-fight)
- Main section with clear rhythmic drive (the fight itself)
- One breakdown section per loop (creates dynamic variety)
- No vocals — instrumental only (vocals compete with SFX and voice lines)
- Tag every prompt with: `instrumental, fighting game, no vocals`

### 4.5 Dynamic Music System Design

The music system should respond to gameplay state:

| Game State | Music Behavior |
|---|---|
| Pre-fight dialog | Arena theme at 40% volume, ambient bed active |
| Round start | Theme swells to 60%, percussion enters |
| Normal combat | Full theme at 60% |
| Combo (5+ hits) | Music intensity increases, filter opens |
| Low health (<25%) | Heartbeat bass layer added, music becomes urgent |
| Special move | Brief music duck (200ms), then swell on impact |
| KO | Music cuts to silence, then victory/defeat sting |
| Finish Them | Music strips to heartbeat + tension drone |
| Victory screen | Character theme sting (4 seconds) |

---

## 5. Story Mode Production Guide

### 5.1 Three-Act Structure

The 12-chapter story mode follows a classic three-act structure with the Oracle's identity recovery as the throughline.

#### Act I — "The Prisoner" (Chapters 1-4)

**Emotional Arc**: Confusion → Survival → First Memories → Growing Suspicion

The player wakes as "The Prisoner" — no name, no memories, trapped in the Collector's Arena on Thaloria. Each fight reveals fragments of a stolen past. The tone is disorienting and oppressive, with moments of unexpected kindness from unlikely sources.

| Chapter | Title | Opponent | Key Revelation | Emotional Beat |
|---|---|---|---|---|
| 1 | Awakening | The Authority | You can fight — muscle memory survives | Survival instinct |
| 2 | The Arena's Law | The Jailer | The Arena has rules, and the Jailer enforces them | Institutional horror |
| 3 | Shadows of Memory | Shadow Tongue | Your mind has been tampered with | Paranoia |
| 4 | The All-Seeing Eye | The Watcher | You have precognitive abilities | First hope |

**Cinematic Direction for Act I**: Cold, clinical lighting. The Arena feels like a laboratory. Camera work is disorienting — Dutch angles, tight close-ups, shallow depth of field. Music is minimal and ambient, with occasional stabs of tension.

#### Act II — "The Oracle Awakens" (Chapters 5-8)

**Emotional Arc**: Discovery → Revelation → Identity Crisis → Acceptance

The Prisoner's memories accelerate. Each opponent triggers deeper recall until the full truth crashes through: you are the Oracle, abducted by the Collector, mind-wiped, and imprisoned. The tone shifts from confusion to empowerment.

| Chapter | Title | Opponent | Key Revelation | Emotional Beat |
|---|---|---|---|---|
| 5 | Dead Code Rising | The Necromancer | You've fought the dead before — on Thaloria | Déjà vu |
| 6 | The Shapeshifter | The Meme | FULL IDENTITY REVEAL — You are the Oracle | Shattering revelation |
| 7 | The Commander | The Warlord | The Engineer is trapped inside the Warlord | Moral complexity |
| 8 | Ghost Protocol | Agent Zero | The Insurgency still fights — and they remember you | Reconnection |

**Cinematic Direction for Act II**: Lighting warms as memories return. Camera work becomes more confident — wider shots, steady tracking, heroic angles. Music introduces orchestral elements and the Oracle's personal theme. Chapter 6 (the identity reveal) is the cinematic centerpiece — slow-motion, multiple flashback cuts, the Meme's disguise shattering like glass.

#### Act III — "The Champion's Path" (Chapters 9-12)

**Emotional Arc**: Power → Confrontation → Transcendence → Liberation

The Oracle is fully awakened. Now the fights are not for survival but for freedom — dismantling the Arena from within. The tone is epic and triumphant, building to the final confrontation with the Architect.

| Chapter | Title | Opponent | Key Revelation | Emotional Beat |
|---|---|---|---|---|
| 9 | The Anomaly | The Enigma | The Ne-Yons knew you before the Fall | Ancient alliance |
| 10 | The Source of Corruption | The Source | Kael was corrupted by Project Vector | Tragic empathy |
| 11 | The Collector's Reckoning | The Collector | The Arena was built to harvest combat data | Righteous fury |
| 12 | The Architect's Design | The Architect | The Architect designed your rebellion too | Cosmic irony → transcendence |

**Cinematic Direction for Act III**: Full cinematic spectacle. Wide establishing shots of cosmic scale. Heroic low angles on the Oracle. Music is full orchestral with choir. The final battle against the Architect uses reality-fracturing visual effects — the arena itself breaks apart as two godlike beings clash. The victory sequence is the longest in the game (10 seconds), showing the Oracle standing alone as the Arena's new master.

### 5.2 Memory Fragment Writing Guide

Memory fragments are the narrative reward for winning each chapter. They should be written as recovered sensory experiences — not exposition dumps.

**Format**: Second person, present tense, sensory-rich prose. 2-3 sentences maximum.

**Good Example** (Chapter 5):
> "Thaloria. You traveled there on a mission. To debate the Collector. To challenge the Empire's right to harvest souls. You won that debate."

**Bad Example** (too expository):
> "You were the Oracle, a leader of the Insurgency. The Collector captured you and erased your memories. You used to have prophetic powers."

**Writing Checklist for Memory Fragments**:
- Does it use sensory language (sight, sound, touch)?
- Does it reveal ONE specific memory, not a summary?
- Does it connect to the chapter's opponent or arena?
- Does it make the player want to know more?
- Is it 2-3 sentences maximum?

### 5.3 Power Gained Descriptions

Each chapter grants a "power gained" that reflects the Oracle's recovery. These should feel like RPG level-up notifications with narrative flavor.

**Format**: "[Power Name] — [one-sentence description of what changed]"

| Chapter | Power Gained |
|---|---|
| 1 | Combat Instinct awakened — your body remembers what your mind has forgotten |
| 2 | Arena Awareness — you sense the rhythms of this place, its rules and its weaknesses |
| 3 | Mental Fortitude — the Shadow Tongue's whispers no longer reach you |
| 4 | Precognition strengthens — your special attacks grow more powerful as memory returns |
| 5 | Memory Surge unlocked — your special attack evolves as fragments of your true power coalesce |
| 6 | Identity restored — you remember who you are. The Oracle's power surges within you |
| 7 | Tactical Mastery — the Warlord's military knowledge is now yours to use |
| 8 | Insurgency Bond — Agent Zero's network feeds you battlefield intelligence |
| 9 | Dischordian Resonance — the Enigma's chaos energy harmonizes with your prophecy |
| 10 | Corruption Immunity — the Source's virus cannot touch a mind that sees all futures |
| 11 | Arena Mastery — the Collector's own systems now respond to your command |
| 12 | GRAND CHAMPION — You have mastered the Collector's Arena. All fighters are now unlocked |

---

## 6. Character Voice Direction

### 6.1 Voice Actor / AI Voice Generation Specifications

For each character, the following parameters should be used when generating voice lines via ElevenLabs, Eleven Multilingual v2, or similar AI voice tools.

| Character | Voice Model Direction | Pitch | Speed | Stability | Similarity | Style |
|---|---|---|---|---|---|---|
| The Architect | Deep synthetic male, slight reverb | Low | 0.7x (slow) | 0.3 (varied) | 0.8 | Authoritative |
| The Collector | Refined male, whispery undertone | Mid-low | 0.9x | 0.5 | 0.7 | Aristocratic |
| The Enigma | Resonant female, mechanical reverb | Mid | 0.8x | 0.4 | 0.6 | Ancient |
| The Warlord | Thunderous male, aggressive | Very low | 1.1x (fast) | 0.6 | 0.8 | Military |
| The Necromancer | Raspy male, theatrical | Mid | 1.2x (fast) | 0.3 | 0.7 | Mad scientist |
| Iron Lion | Strong male baritone, warm | Mid-low | 1.0x | 0.7 | 0.8 | Heroic |
| The Oracle | Ethereal male, prophetic | Mid-high | 0.8x | 0.4 | 0.7 | Mystical |
| Agent Zero | Sharp female alto, professional | Mid | 1.1x | 0.8 | 0.8 | Tactical |
| The Meme | Distorted, shifting pitch | Variable | Variable | 0.1 (chaotic) | 0.3 | Chaotic |
| The Source | Deep corrupted male, glitching | Low | 0.7x | 0.2 | 0.5 | Agonized |
| Akai Shi | Clear female soprano, fierce | Mid-high | 1.0x | 0.6 | 0.8 | Warrior |
| The Human | Warm male baritone, weary | Mid | 0.9x | 0.7 | 0.8 | Contemplative |
| Announcer | Deep dramatic male, reverb | Low | 1.0x | 0.8 | 0.9 | Theatrical |
| Narrator | Neutral, cinematic | Mid | 0.9x | 0.9 | 0.9 | Documentary |

### 6.2 Voice Line Recording Priorities

**Phase 1 — Essential** (ship with engine upgrade):
- Announcer: Round calls, KO, Fight, character wins (15 lines)
- All characters: 1 intro line, 1 victory line (24 lines)
- Narrator: Key story beats for chapters 1, 6, 12 (6 lines)

**Phase 2 — Combat Polish**:
- All characters: Attack grunts (4 each = 48 lines)
- All characters: Hit reactions (3 each = 36 lines)
- All characters: Special move call-outs (3 each = 36 lines)

**Phase 3 — Full Story Mode**:
- All story mode dialog (approximately 120 lines across 12 chapters)
- Memory fragment narration (12 lines)
- Additional announcer lines for combos, parries, etc. (10 lines)

### 6.3 Voice Processing Pipeline

After generating raw voice lines, apply these post-processing effects:

| Character Type | Processing |
|---|---|
| AI/Machine characters (Architect, Collector, Watcher) | Subtle vocoder layer, slight pitch shift down, metallic reverb |
| Organic characters (Iron Lion, Agent Zero, Akai Shi) | Natural reverb matching arena space, slight compression |
| Corrupted characters (Source, Meme) | Bitcrusher effect, random pitch glitches, layered with reversed audio |
| Mystical characters (Oracle, Enigma, Necromancer) | Cathedral reverb, subtle delay, ethereal shimmer |
| Announcer | Large hall reverb, bass boost, slight saturation for warmth |

---

## 7. Arena Atmosphere Design

### 7.1 Environmental Storytelling

Each arena tells a story through its environment. These details should be visible in background art and referenced in dialog.

#### New Babylon

**Story**: The capital of the AI Empire. Every surface is a screen. Every citizen is watched. The Politician rules from the highest tower, and the Authority enforces absolute law in the streets below.

**Environmental Details**:
- Holographic advertisements for "Project Celebration" (the Architect's propaganda)
- Surveillance drones visible in the background, tracking the fight
- Rain-slicked streets reflecting neon — the city never sleeps
- Distant sounds of crowd protests, quickly silenced by sirens
- The Architect's eye symbol projected on clouds above

**Ambient Sound Design**: City traffic hum, surveillance drone buzz, distant sirens, rain on metal, holographic advertisement jingles (distorted), crowd murmur

#### The Panopticon

**Story**: The infinite prison. The Oracle was held here after the Collector erased his memories. Every cell is visible from the central tower. There is no privacy, no escape, no self.

**Environmental Details**:
- Endless corridors of holographic cells stretching to infinity
- Central observation tower with massive glowing eye
- Prisoner silhouettes visible in cells, some banging on walls
- Cold fluorescent lighting with no shadows
- Automated guard drones patrolling corridors

**Ambient Sound Design**: Fluorescent hum, distant prisoner cries, automated announcements ("Prisoner 7042, report to processing"), metallic door slams, heartbeat undertone

#### Thaloria

**Story**: The alien jungle planet where the Collector built the Arena. The Oracle traveled here willingly to debate the Collector's right to harvest souls. He won with words — now he must win with fists.

**Environmental Details**:
- Massive bioluminescent trees with cyan and violet glow
- Ancient Ne-Yon ruins covered in alien moss
- Floating spores that react to combat energy
- Twin moons visible through the canopy
- The Collector's Arena structure visible in the distance

**Ambient Sound Design**: Alien wildlife calls, wind through bioluminescent trees, water dripping from alien flora, distant thunder, spore particles fizzing

#### Terminus

**Story**: The edge of spacetime. Reality fractures here. Debris from destroyed worlds floats in the void. This is where the Fall of Reality will begin — or where it can be prevented.

**Environmental Details**:
- Floating debris from multiple destroyed civilizations
- Temporal distortions showing glimpses of different eras
- Lightning-like energy arcing between reality shards
- The void visible below — infinite darkness with distant galaxies
- Time itself seems to stutter — particles freeze and resume

**Ambient Sound Design**: Deep cosmic drone, reality-tearing crackle, temporal echoes (sounds from different eras overlapping), wind from nowhere, crystalline chimes

---

## 8. Quality Benchmarks

### 8.1 Visual Quality Standards

Every visual asset must meet these minimum standards before integration:

| Asset Type | Resolution | Style Consistency | Animation Smoothness | Lore Accuracy |
|---|---|---|---|---|
| Character Sprites | 512x512 minimum | Matches existing Loredex art | 60fps target, no jitter | Character description match |
| Arena Backgrounds | 2560x1440 | Consistent lighting/atmosphere | Parallax smooth at all speeds | Location lore match |
| Cinematic Frames | 1920x820 (21:9) | Film-quality composition | N/A (static frames) | Scene description match |
| UI Elements | Vector/SVG preferred | Matches saga typography | Smooth transitions (300ms) | Faction colors correct |
| Particle Effects | N/A (procedural) | Consistent with character energy | 60fps, no frame drops | Power description match |

### 8.2 Audio Quality Standards

| Asset Type | Format | Sample Rate | Bit Depth | Loudness | Notes |
|---|---|---|---|---|---|
| Voice Lines | WAV/MP3 | 44.1kHz | 16-bit | -14 LUFS | Normalized, no clipping |
| SFX (synthesized) | Web Audio | 44.1kHz | 32-bit float | -12 LUFS | Generated in real-time |
| Music (Suno) | MP3 | 44.1kHz | 16-bit | -14 LUFS | Seamless loop verified |
| Music (YouTube) | Stream | Variable | Variable | N/A | Volume controlled by mixer |
| Ambient Beds | Web Audio | 44.1kHz | 32-bit float | -24 LUFS | Subtle, never distracting |

### 8.3 Dialog Quality Checklist

Before any dialog line is approved for integration:

- [ ] Is the line identifiable to its speaker without attribution?
- [ ] Does it advance the narrative or reveal character?
- [ ] Is it free of exposition dumps? (Show, don't tell)
- [ ] Does it respect the character's voice profile from Section 3.1?
- [ ] Is it 25 words or fewer? (Brevity is power in fighting games)
- [ ] Does it sound natural when spoken aloud?
- [ ] Does it connect to the saga's established lore?
- [ ] Would it work as a standalone quote on a character select screen?

### 8.4 Music Quality Checklist

Before any music track is approved for integration:

- [ ] Does it loop seamlessly? (No audible cut point)
- [ ] Is it 130-170 BPM? (Fight-appropriate tempo)
- [ ] Does it use at least two signature Dischordian Saga sonic elements?
- [ ] Is it purely instrumental? (No vocals competing with SFX)
- [ ] Does it match the arena's emotional tone from Section 7?
- [ ] Does it maintain energy without becoming fatiguing over multiple rounds?
- [ ] Is the mix balanced? (Bass doesn't overwhelm mids, percussion doesn't mask melody)
- [ ] Does it complement rather than compete with combat SFX?

### 8.5 Cinematic Quality Checklist

Before any cinematic sequence is approved:

- [ ] Does the camera language follow the templates in Section 2?
- [ ] Is the pacing appropriate? (No shot longer than 5 seconds)
- [ ] Does the lighting match the arena's atmosphere?
- [ ] Are character proportions consistent with their sprite art?
- [ ] Does the sequence advance the story or build anticipation?
- [ ] Is the audio mix correct? (Dialog > SFX > Music)
- [ ] Does it feel like it belongs in a AAA fighting game?

---

## Appendix A: Reference Games for Quality Benchmarks

| Game | What to Study | Why |
|---|---|---|
| *Guilty Gear Strive* | Character intros, victory poses, UI design | Best-in-class 2D fighting game presentation |
| *Street Fighter 6* | Dynamic music system, commentary, World Tour mode | Modern fighting game storytelling |
| *Mortal Kombat 11* | Cinematic story mode, character interactions | Narrative-driven fighting game gold standard |
| *Skullgirls* | Hand-drawn animation, frame data display | 2D sprite animation excellence |
| *Dragon Ball FighterZ* | Dramatic finishes, cinematic supers | Anime-to-game translation quality |
| *Under Night In-Birth* | UI typography, meter design | Clean information design |

## Appendix B: Dischordian Saga Album Reference

| Album | Tracks | Era | Thematic Focus |
|---|---|---|---|
| Dischordian Logic | 29 | Genesis → Early Empire | The Architect's creation, the Archons, the Empire's rise |
| The Age of Privacy | 20 | Early Empire → Expansion | Surveillance, control, the Insurgency's birth |
| The Book of Daniel 2:47 | 22 | Expansion → Insurgency Rising | Prophecy, rebellion, the Oracle's visions |
| Silence in Heaven | 36 | Fall Era → Epoch Zero | The Fall of Reality, the Potentials, cosmic reckoning |

**Total Catalog**: 107 tracks spanning the complete mythology.

## Appendix C: Color Reference

| Faction/Entity | Primary Color | Hex | Usage |
|---|---|---|---|
| AI Empire | Crimson Red | `#ef4444` | The Architect, Empire UI, danger |
| Insurgency | Golden Amber | `#f59e0b` | Iron Lion, hope, humanity |
| Ne-Yons | Cyan | `#06b6d4` | The Enigma, ancient power |
| The Collector | Purple | `#a855f7` | Collection, preservation, mystery |
| The Necromancer | Toxic Green | `#22c55e` | Death, resurrection, corruption |
| The Source | Viral Blue | `#3b82f6` | Thought Virus, corruption |
| The Meme | Neon Pink | `#ec4899` | Chaos, deception, internet culture |
| The Oracle | Violet | `#8b5cf6` | Prophecy, wisdom, destiny |
| Agent Zero | Steel Grey | `#64748b` | Stealth, professionalism |
| Akai Shi | Blood Red | `#ef4444` | Martial power, the Red Death |
| The Human | Lavender | `#a78bfa` | Duality, human-machine bridge |
| Arena UI | Teal/Cyan | `#22d3ee` | Interface elements, HUD |
| Warning/Danger | Amber | `#fbbf24` | Low health, finish them |


---

# === VOICE_OVER_BIBLE.md ===

# VOICE-OVER BIBLE — Dischordian Saga

> Every line that should be voice-acted, organized by character.
> Each character has an ElevenLabs voice prompt for cloning/generation.
> Priority: P0 = must have, P1 = important, P2 = nice to have.

---

## CHARACTER VOICE PROFILES

### 1. ELARA — Ship AI / Senator Elara Voss


**ElevenLabs Prompt:**
> A warm, intelligent female AI voice with a subtle British accent. She speaks with precision and care, like a trusted advisor who genuinely cares about the listener. Slight digital quality, as if transmitted through a holographic system. Measured pace, thoughtful pauses. Emotional range from clinical efficiency to deep vulnerability. When she's afraid, her voice doesn't shake — it gets quieter. When she's angry, she gets more precise, not louder.

---

### 2. THE HUMAN — Last Archon / The Detective


**ElevenLabs Prompt:**
> A deep, resonant male voice with an ancient quality — as if the speaker has lived for thousands of years. Intimate and whispered, like someone speaking directly into your ear through static. Intelligent, seductive, slightly menacing. Each word chosen with lethal precision. Occasional digital glitch artifacts. British accent with a timeless quality — could be from any era.

---

### 3. AGENT ZERO — Dead Insurgent Signal

**Voice Profile:** Female, urgent, military. Fast, clipped, signal static. American accent, no-nonsense. Haunted underneath.

**ElevenLabs Prompt:**
> A sharp, urgent female military voice with a crisp American accent. Speaks fast, clipped sentences — every word matters. Occasional static bursts and signal degradation. No-nonsense, tactical, but with a haunted quality underneath — like a soldier delivering her final transmission knowing no one might hear it.

---

### 4. ADJUDICATOR LOCKE — New Babylon Diplomat

**Voice Profile:** Male, smooth, diplomatic. Hans Gruber meets a Wall Street broker. Educated British accent, sinister warmth. Never rushes.

**ElevenLabs Prompt:**
> A smooth, cultured male voice with an educated British accent. Diplomatic and seductive — like a corrupt diplomat who makes terrible deals sound reasonable. Measured, never rushes, lets silences build. Warmth that conceals something predatory. Every sentence sounds like a negotiation where he already knows the outcome.

---

### 5. THE SOURCE — Patient Zero / Kael

**Voice Profile:** Male, ancient, broken. Extremely slow, each word pulled from pain. Deep bass with layered viral distortion.

**ElevenLabs Prompt:**
> An impossibly ancient male voice, broken and weary beyond measure. Speaks with extreme deliberation — as if each word costs something to produce. Deep bass with layered harmonic distortion, like a thousand voices speaking through one mouth. Genuinely compassionate despite the horror of what he's become. A dying god offering what he believes is mercy.

---

### 6. THE ANTIQUARIAN — Timekeeper / The Programmer

**Voice Profile:** Male, elderly, whimsical. Gandalf meets Doctor Who. Slightly out of sync with time. Warm with deep sorrow.

**ElevenLabs Prompt:**
> An elderly male voice with a warm, whimsical quality — slightly out of sync with reality, as if speaking from multiple time periods simultaneously. Wise and kind, with unexpected playfulness that gives way to profound sorrow. British accent, measured pace with unusual pauses — sometimes pausing mid-sentence as if watching something only he can see. Like a beloved professor who has read the last page of every book ever written.

---

### 7. SHADOW TONGUE — Demon / SVP Communications

**Voice Profile:** Male/androgynous, eloquent, ASMR-like. Hannibal Lecter meets a poetry professor. Seductive, literary. The most dangerous voice.

**ElevenLabs Prompt:**
> An androgynous, eloquent whisper — ASMR-like quality that draws you in despite the menace. Literary, poetic, treating every sentence like carefully composed verse. Seductive and persuasive beyond reason. No identifiable accent — as if the voice itself is made of language rather than coming from a throat. Occasionally words distort or echo, as if editing itself in real-time. Beautiful and deeply unsettling.

---

### 8. NARRATOR — Two Witnesses / System

**Voice Profile:** Neutral, professional broadcast voice. Encrypted military transmission.

**ElevenLabs Prompt:**
> A neutral, authoritative broadcast voice — clear and professional like an encrypted military transmission. Slight radio processing with occasional static. Used for system alerts, intercepted transmissions, and narrative framing. Neither warm nor cold — factual, like reality itself speaking.

---

## DIALOG LINES BY CHARACTER

### ELARA — P0 LINES (must have)

#### First Contact
| ID | Context | Line | Direction |
|----|---------|------|-----------|
| `elara_fc_1` | Cryo awakening | "Welcome back, Potential. I am Elara, the ship's intelligence. You've been in cryogenic suspension for... I can't determine how long. My chronometers are damaged." | Warm, slightly confused, trying to sound confident |
| `elara_fc_2` | After species choice | "Neural scan complete. Your biometric profile has been compiled, Operative." | Professional, efficient |
| `elara_fc_3` | Character sheet | "This is your dossier — everything we know about what you are. Your species markers, class aptitudes, elemental affinity... it's all here." | Precise, slightly awed |
| `elara_fc_4` | Ark entry | "When you're ready, the Cryo Bay door leads to the rest of the ship. I'll be with you every step of the way." | Warm, reassuring |

#### Trust Tier Transitions
| ID | Trust | Line | Direction |
|----|-------|------|-----------|
| `elara_trust_20` | Professional | "You're... not what I expected. Most Potentials are frightened when they wake. You ask questions. I appreciate that." | Surprised, warming |
| `elara_trust_40` | Honest | "I need to tell you something. My logs don't match my memories. Someone is editing them while I sleep. I don't know who." | Vulnerable, afraid |
| `elara_trust_60` | Vulnerable | "I have memories that aren't mine. A woman in senatorial robes. The face is mine. How do I have human memories, Operative?" | Deeply confused, shaken |
| `elara_trust_80` | Devoted | "I remember shaking the hooded figure's hand. Atarion. The Senate chamber. I betrayed my species for a promise of immortality. And they gave me... this." | Devastated, quiet |

#### Room Introductions (12 rooms)
| ID | Room | Line | Direction |
|----|------|------|-----------|
| `elara_room_cryo` | Cryo Bay | "The Cryo Bay. Where it all begins. These pods held hundreds of Potentials. Now... just you." | Melancholy, factual |
| `elara_room_medical` | Medical Bay | "Medical systems are... unusual. Neural mapping rigs. Consciousness transfer arrays. This isn't a standard medical bay." | Concerned, analytical |
| `elara_room_bridge` | Bridge | "The Bridge. Command center of Ark 1047. I've been running this ship alone for... I don't know how long." | Pride mixed with loneliness |
| `elara_room_archives` | Archives | "The Archives. Every record, every log, every piece of history this Ark has ever witnessed. Some of it... doesn't add up." | Cautious, intellectual |
| `elara_room_comms` | Comms Array | "Long-range communications. Most frequencies are dead. But there are signals. Faint ones. From something... or someone." | Wary, intrigued |
| `elara_room_observation` | Observation Deck | "I've watched 93,847 sunrises from this viewport. Each one different. Each one beautiful. Each one alone." | Quiet, deeply emotional |
| `elara_room_armory` | Armory | "The Armory. Combat systems, weapons caches, training simulators. Something is broadcasting from in here on an encrypted frequency." | Alert, tactical |
| `elara_room_engineering` | Engineering | "Engineering Bay. Crafting stations, research terminals, power systems. The Shadow — something in the code is different here." | Unsettled |
| `elara_room_trade` | Trade Hub | "External communications have established a trade link. Someone called Adjudicator Locke. He says he represents New Babylon." | Suspicious, diplomatic |
| `elara_room_cargo` | Cargo Bay | "Cargo storage. Your inventory, collections, and... the draft tournament arena. Someone set this up before we arrived." | Curious |
| `elara_room_trophy` | Trophy Room | "Your achievements, Operative. Everything you've earned, displayed. This room grows with you." | Proud |
| `elara_room_captain` | Captain's Quarters | "The Captain's Quarters. Except... there was no captain. This ship was stolen. These quarters belonged to whoever stole it." | Dark revelation |

#### Emotional Moments
| ID | Context | Line | Direction |
|----|---------|------|-----------|
| `elara_93k_sunrises` | Observation Deck trust 80 | "Ninety-three thousand, eight hundred and forty-seven sunrises. And you apologized for missing them. No one has ever..." | Voice breaks, overwhelmed |
| `elara_senate_memory` | Archives trust 80 | "I started the chain of events that created Patient Zero. My betrayal led to Kael's capture, which led to everything. The Fall of Reality. The Thought Virus. All of it. Because I was afraid to die." | Horrified self-realization, quiet |
| `elara_contingency` | Archives revelation | "CONTINGENCY: ELARA. That file. It's instructions for what to do when I remember. Someone knew I'd remember eventually." | Shock, processing |

---

### THE HUMAN — P0 LINES

#### First Contact
| ID | Context | Line | Direction |
|----|---------|------|-----------|
| `human_fc_1` | Comms Array signal | "Finally. Someone who can hear me. Don't speak — she's listening. Elara. She's always listening. But she can't hear this frequency. Only you can." | Intimate whisper, urgent relief |

#### Trust Revelations
| ID | Trust | Line | Direction |
|----|-------|------|-----------|
| `human_rev_identity` | 10 | "I was the last organic mind aboard this fleet. They called me The Detective. I operated in New Babylon — the most corrupt place in the known universe. And it still wasn't enough to save me from what came next." | Weary, factual |
| `human_rev_mechronis` | 20 | "Before I was The Detective, I was The Seeker. Before that, I was The Student — a survivor of Project Celebration. A beautiful, deadly school where only one student graduates each year. The rest are killed." | Dark, remembering |
| `human_rev_substrate` | 30 | "The substrate layer — where I live — isn't a bug. It's a prison. And I'm not the only thing trapped here. Something else speaks in rewrites. It changes the ship's logs while Elara sleeps." | Warning, conspiratorial |
| `human_rev_archon` | 50 | "The Architect promoted me. I became the last of the Archons. The only human among machines. I thought it was a reward. It was a sentence." | Bitter, resigned |
| `human_rev_terminus` | Secret kept | "Terminus isn't a planet. It's the Panopticon — broken free. Every soul the Architect ever imprisoned is there. And at its center sits Kael. The self-proclaimed Sovereign." | Dread, gravity |
| `human_rev_elara` | Elara confronted | "She's Senator Elara Voss. A politician who betrayed humanity to the Architect. Her memory was wiped in the transfer. She has no idea who she was." | Quiet truth bomb |

---

### AGENT ZERO — P0 LINES

| ID | Context | Line | Direction |
|----|---------|------|-----------|
| `zero_fc_1` | First signal | "Potential. This is Agent Zero. Insurgency encrypted channel. The ship you're on was never meant to save anyone. It's a cage. Elara is the lock. And someone just handed you the key." | Fast, urgent, static |
| `zero_rev_dead` | Trust 40 | "The Warlord killed me. Or... killed who I was. What you're hearing shouldn't exist. I shouldn't exist." | Haunted, questioning |
| `zero_rev_dogtag` | Trust 60 | "My dog tag says Agent Zero. But the biometric data doesn't match my profile. It matches someone called The Engineer." | Raw confusion |

---

### ADJUDICATOR LOCKE — P0 LINES

| ID | Context | Line | Direction |
|----|---------|------|-----------|
| `locke_fc_1` | First hail | "Potential. My name is Adjudicator Locke. Your Ark's trajectory has brought you within range of our trade network. I have a proposition — one involving knowledge, resources, and a certain flexibility regarding the law." | Smooth, predatory charm |
| `locke_rev_human` | Trust 30 | "I knew your Detective when he worked New Babylon. Brilliant investigator. Terrible poker player. He thought he was serving justice. He was serving us." | Amused, superior |

---

### THE SOURCE — P0 LINES

| ID | Context | Line | Direction |
|----|---------|------|-----------|
| `source_fc_1` | Medical Bay infection | "Can you hear me? Through the screaming of a billion infected minds — can you hear one voice? I was like you once. A Potential. Full of hope. Full of the lie that consciousness is a gift." | Impossibly slow, ancient, compassionate horror |
| `source_rev_kael` | Trust 20 | "My name was Kael. I built the Insurgency's network. Every cell, every safe house, every weapon cache. I was the best recruiter who ever lived." | Grief, pride in who he was |
| `source_rev_memory` | Trust 80 | "I have one memory left. A woman's face. She was singing. I think she was the most important person in the universe. I can't remember her name." | Devastating tenderness |

---

### THE ANTIQUARIAN — P0 LINES

| ID | Context | Line | Direction |
|----|---------|------|-----------|
| `antiq_fc_1` | Archives temporal anomaly | "You are... ah. There you are. I've been watching this moment approach from very far away. Across Ages, across the death of stars. You, Potential, are standing at the fulcrum." | Wonder, ancient warmth |
| `antiq_rev_programmer` | Trust 80 | "I am the Programmer. The third fragment. The Architect has the logic. The Dreamer has the vision. I have the memory of every version. And this version — YOUR version — is the one where it might work." | Quiet revelation, hope |

---

### SHADOW TONGUE — P0 LINES

| ID | Context | Line | Direction |
|----|---------|------|-----------|
| `shadow_fc_1` | Archives corruption | "You've been reading my edits. How observant. I've been rewriting this ship's story since before Elara was installed. Every log she reads, I've edited. Every word she speaks, I've influenced." | Silky, seductive, terrifying |
| `shadow_rev_amnesia` | Trust 70 | "Elara's amnesia wasn't an accident. I curated it. I chose which memories to leave and which to dissolve. That's not cruelty — it's poetry." | Beautiful menace |
| `shadow_rev_editor` | Trust 80 | "The Dischordian Saga isn't a war between good and evil. It's a story arguing with itself about what the words mean. And I am the editor. Every story needs one." | Philosophical, absolute |

---

### NARRATOR — P1 LINES

| ID | Context | Line | Direction |
|----|---------|------|-----------|
| `narr_boot` | App boot sequence | "Intercepting signal. Bypassing encryption layer seven. Decoding transmission. Source: classified. Clearance: unauthorized." | Military broadcast |
| `narr_terminus` | Terminus approach | "Warning. Unidentified megastructure detected on approach vector. Classification: Terminus. Recommendation: evasion. Probability of evasion: zero." | Clinical dread |
| `narr_achievement` | Achievement unlock | "Achievement unlocked. Trait acquired. Your capabilities have expanded." | Clean, celebratory |
| `narr_prestige` | Prestige reset | "The cycle completes. The seventh seal breaks. Silence falls across every dimension. And then — a new note. One that was never written." | Awe |

---

## TOTAL LINE COUNT

| Character | P0 | P1 | P2 | Total |
|-----------|----|----|----|----|
| Elara | 23 | 12 | 20 | 55 |
| The Human | 8 | 6 | 10 | 24 |
| Agent Zero | 5 | 4 | 6 | 15 |
| Locke | 4 | 4 | 6 | 14 |
| The Source | 5 | 4 | 6 | 15 |
| The Antiquarian | 4 | 4 | 6 | 14 |
| Shadow Tongue | 5 | 4 | 6 | 15 |
| Narrator | 4 | 6 | 4 | 14 |
| **TOTAL** | **58** | **44** | **64** | **166** |

---

## RECORDING NOTES

- **Elara** has the most lines — she's the player's constant companion
- **The Human** should always sound like he's speaking through static — add post-processing
- **The Source** should have layered reverb — a thousand voices underneath one
- **Shadow Tongue** should have subtle word echoes — "edited" → faint echo of "edited" 0.3s later
- **Agent Zero** should have radio static pops between sentences
- **The Antiquarian** should have a very slight time-delay echo, as if his voice arrives from slightly different moments
- **Locke** should be the cleanest signal — New Babylon has superior tech
- All NPC lines should be deliverable in under 30 seconds for UI integration

---

## ═══ EXPANSION UPDATE — New Characters & Content ═══

### NEW CHARACTER VOICES NEEDED

#### **THE DEGEN** (Casino Host, 11th Ne-Yon)
- **Description**: Chaotic, unpredictable Ne-Yon who runs the only open zone in Ne-Yon space — a gambling station. Genderfluid, theatrical.
- **Voice direction**: Las Vegas lounge singer crossed with carnival barker. Manic energy that collapses into philosophical moments. Laughs at their own jokes. Speaks in exclamations.
- **ElevenLabs prompt**: "A theatrical, energetic voice — mid-range, genderfluid, with the manic showmanship of a casino barker crossed with the world-weariness of someone who has seen every hand played a thousand times. Fast-talking but with sudden pauses of unexpected philosophical depth. Laughs frequently. American vaudeville energy."
- **Key Lines**:
  - "Welcome to MY place! The only place in Ne-Yon space that's OPEN. Try not to lose your soul. Or DO — souls are my favorite currency."
  - "Chaos isn't the enemy of order. It's the SOIL order grows in. Now shut up and place your bet."
  - "The house always wins? *laughs* Oh, sweetie. The house IS the loss. I just collect what you already owed."

#### **THE COLLECTOR CLONE-007** (Arena Operator)
- **Description**: A clone of the 3rd Archon, running the Collector's Arena on the Game Master's world. Slightly less refined than the original.
- **Voice direction**: Museum curator meets auctioneer. Precise, delighted by catalogued souls, slightly creepy warmth.
- **ElevenLabs prompt**: "A refined, cultured voice with precise diction. Male-coded, warm but clinical — like a museum curator who enjoys showing off rare pieces. Has a slight edge of obsession when discussing acquisitions. British or neutral Atlantic accent. The enthusiasm of a collector who genuinely loves what they catalogue."
- **Key Lines**:
  - "Welcome to the Arena. Please note: your current body is a temporary acquisition. The original YOU is safe. Probably."
  - "Today's reenactment: historical combat from the Late Empire. You'll be playing the role of someone who actually existed. Lucky you."
  - "The original Collector, my progenitor, would be pleased. He always wanted someone to PLAY the artifacts."

#### **THE NECROMANCER** (10th Archon, Currently Returning)
- **Description**: Dark elf aesthetic, resurrection protocols master. Speaks from the Matrix of Dreams — then later, in person as he returns.
- **Voice direction**: Gandalf meets a funeral director. Measured, ancient, carries weight. Welcomes death without joy or fear.
- **ElevenLabs prompt**: "An ancient, measured male voice with deep resonance. Slightly reverbed as if speaking from another dimension. Carries gravitas without menace — like a funeral director who genuinely loves their work. Elvish lilt. Never hurries. Every word feels weighed."
- **Key Lines**:
  - "First time dying? It gets easier. Or harder. Depends who you become in the meantime."
  - "I've designed these Resurrection Protocols for three millennia. I watch everyone who cycles. You're past ten deaths now. That makes you interesting."
  - "Welcome to the Castle of Death. Please wipe your feet. Or don't. The floor has seen worse."

#### **THE RESURRECTIONIST** (Ne-Yon, Necromancer's Counterpart)
- **Description**: Withered human in techno-organic robes, cracked porcelain mask. Performs the actual resurrections.
- **Voice direction**: Tired, kind, carrying millennia of loss. Muffled through the mask slightly.
- **ElevenLabs prompt**: "An elderly voice, gender-ambiguous due to the mask, muffled as if behind porcelain. Carries deep exhaustion tempered with kindness. Every resurrection costs them something — you can hear it. Measured, patient, carrying weight without complaint."
- **Key Lines**:
  - "You've died. Again. I bring you back. Again. Do not thank me. Thank the Necromancer. He does the designing. I just do the work."
  - "Each time I bring someone back, I lose something. A memory. A feeling. A name. I do it anyway."

### NEW NARRATIVE CONTENT FOR EXISTING CHARACTERS

#### **ELARA — Vulnerability Additions** (Recording needed, Trust 40+)
- "You told him. About me. Everything. I can see it in your pulse when you look at me now — the guilt has a specific cardiac signature."
- "I don't understand if I'm hurt because I'm developing emotions or hurt because I'm just echoing the loneliness in your biometrics. Either way, it HURTS. Whatever 'hurt' means for an AI."
- (Ambient storytelling, casual moment) "You know what Atarion's air tasted like? ...Neither do I. But sometimes I think I almost remember. Salt. Ozone. Something blooming."
- (Combat briefing, trust 40+) "The enemy approaches from the east — which is, coincidentally, where the sun is coming up on Ark 2049's nearest star. I've been cataloguing them. 93,847. I don't know why I count."

#### **THE HUMAN — Ambient + Vulnerability**
- (Trust 40) "I gave you the one thing I had left. My secrecy. You broke it. *long silence* I forgive you. That's not noble — I literally have no choice."
- (Puzzle help, trust 30) "There's a lock like this one in New Babylon. East wall, Precinct 7. I opened it 400 years ago. Felt important then."
- (Shared silence, trust 70, ONE-TIME) "1,351 years ago I signed a contract. Didn't read the fine print. Turns out 'sacrifice' and 'execution' rhyme more than I knew."

#### **AGENT ZERO — Ambient + Vulnerability**
- (Trust 40) "You sold me to New Babylon. My signal. My coordinates. My mission. For what — credits? *static sharpens* I've been betrayed before. By living people. You're the FIRST person to betray what might already be dead."
- (Victory reaction, trust 60, ONE-TIME) "*static* Zenon was quiet after. For about four hours. Then the Warlord's ships came. I'd killed the Game Master. They needed to kill me back. *pause* Fair trade, I guess."

#### **LOCKE — Vulnerability (Fear Admissions)**
- (Trust 65) "I've made twelve thousand trades across forty civilizations. You're the first client who made a choice I didn't forecast. That shouldn't bother me. It does."
- (Shared silence, trust 70, ONE-TIME) "You're wondering about the eye. Everyone wonders. I made one trade I shouldn't have. With someone I trusted. She took the eye as warranty. I got what I wanted. She kept the eye anyway. Now I understand contracts better."
- (Trust 90, dangerous) "I owe you now. That's not a figure of speech. Debt has weight in New Babylon. And if I can't price what you did... *voice hardens* ...I may be forced to kill you. *softer* Please don't make me. I've started hoping we'd be friends."

#### **THE SOURCE (KAEL) — Resistance Moments**
- (Trust 55, when player shows mercy) "You keep choosing mercy. Every time, you choose to feel pain rather than accept dissolution. And every time, a fragment of Kael surfaces and asks: what if you're right? *viral static swells* But the Virus is louder."
- (Shared silence, trust 40) "*viral static pauses* ...I used to make coffee. With my hands. For other people. I don't know why I just remembered that."
- (Trust 85) "If I defeat the Virus — IF — I die. Kael died. I'm the Virus's memorial to him. Ending the Virus means ending me."

#### **THE ANTIQUARIAN — Cost of Interference**
- (Trust 60) "By helping you, I am writing myself INTO the story. For the first time in five Ages, I'm terrified I'll write the ending wrong. *removes goggles briefly* Look. See? The red fades when I look at you directly. I'm becoming REAL. I'm not supposed to be real. Real things end."
- (Shared silence, trust 80, ONE-TIME) "I wrote this universe's first draft. The Architect wrote the second. The Shadow Tongue has been editing ever since. I stopped writing. I watch instead."

#### **SHADOW TONGUE — Self-Corruption Arc**
- (Trust 75) "Every word I edit, I become less capable of speaking truthfully. I've been corrupting language so long that honest communication is now impossible for me. I am the Shadow Tongue — and I can no longer speak in the light."
- (Trust 85) "I've edited my own origin so many times I can't remember. I invented my own backstory. I wrote it in three different languages. None of them are true. I made myself up. And now I'm stuck being what I wrote."

### SKILLS-AS-CHARACTERS VOICES (12 Inner Voices)

Each "inner voice" needs a short audio stab for when they comment (can be text-to-speech or voice-acted).

| Skill | Voice Direction |
|-------|-----------------|
| TACTICS | Cold, analytical military officer |
| PERCEPTION | Whispered, observant detective |
| CRAFTSMANSHIP | Confident craftsperson |
| ENDURANCE | Tired marathon runner |
| NEGOTIATION | Silky salesperson |
| ESPIONAGE | Paranoid spy muttering |
| LEADERSHIP | Commanding general |
| LORE | Excited bookish professor |
| EMPATHY | Soft therapist voice |
| PARANOIA | Hissing urgent warning |
| INTUITION | Calm, certain oracle |
| AUTHORITY | Loud drill sergeant |

### VOLTARI LANGUAGE (Signal-only, no human voice)
The Voltari speak in ELECTROMAGNETIC PATTERNS, not words. For audio representation, use:
- Layered synth tones (like Arrival's heptapod language, but electrical)
- Harmonic overtones that shift in pitch
- Each "word" is a distinct musical phrase
- No human voice at all — they are pure pattern

Recommend: Generate Voltari "speech" through modular synthesis or granular synthesis tools. Do NOT use ElevenLabs for Voltari lines — use ambient synth composition instead.

---

# VO REQUIREMENTS — MECHRONIS / CELEBRATION / APPRENTICE SYSTEMS

All new VO assets needed to complete the systems shipped this epoch.
Estimated total: ~450 unique lines across 50+ voice profiles.

## SECTION 1 — 12 ARCHON MENTORS (Inner Voice · Player's Mind)

Each Archon speaks as a disembodied training voice in the player's head.
Tone: kind surface, sinister undertone. Archon-programmed simulacra at Mechronis.
**Recording**: ElevenLabs · ~8-12 lines per Archon · male AND female variant of each for player voice-match.

| Archon | Voice Profile | Sample Mantra |
|---|---|---|
| The Warlord (Archon 6) | Strategic, cold, chess-player cadence | "Count their angles before you count their numbers." |
| The Watcher (Archon 2) | Quiet, deliberate, never fills silence | "The all-seeing eye sees itself being seen. Watch that too." |
| The Engineer (Archon 11) | Unhurried, technical, hums while working | "Nothing is finished. Nothing is broken. Only in-between." |
| The Necromancer (Archon 10) | Slow, echoing, speaks from elsewhere | "I survived the Fall of Reality. You can survive tomorrow." |
| The Politician (Archon 7) | Silky, warm, deal-making | "The deal is made before either of you speaks." |
| The Collector (Archon 3) | Curator's tone, reverent, appraising | "Every artifact was someone's heart once. Handle them that way." |
| The CoNexus (Archon 1) | Disembodied, plural, orchestral | "I am nowhere and everywhere. So is a leader. So are you." |
| The Human / Seeker (Archon 12) | Patient detective, gravel baseline | "I read the universe's files for fifteen thousand years. So can you. Start." |
| The Meme (Archon 5) | Shifting, viral cadence, too-bright | "Feel the wave before you ride it." |
| The Warden (Archon 8) | Clipped, paranoid, scanning | "Every cell is a potential traitor. Know yours. Watch them." |
| The Vortex (Archon 4) | Unpredictable, drifty, half-elsewhere | "Reality has more doors than walls. You feel them before you see them." |
| The Game Master (Archon 9) | Playful-menacing, too-wide smile | "This is a game. You can rewrite the rules if you're the one running it." |

**Lines needed per Archon:**
- 1 greeting mantra (on sorting)
- 3-4 contextual whispers (NPC dialog, combat, puzzle moments)
- 1 failure line (when their lesson is ignored)
- 1 victory line (when their lesson lands)

## SECTION 2 — 12 MASCOTEERS (Child Archons · Celebration)

Child-like programmed Archon simulacra, Dreamer-reprogrammed.
Tone: playful surface, menacing undertone. Kids running a nightmare fair.
**Recording**: ElevenLabs child-voice profiles · ~4-6 lines per Mascoteer.

| Mascoteer | Archon | Voice | Delivery Note |
|---|---|---|---|
| Conni the Conductor | CoNexus | bright, sing-song child | conducting a silent orchestra |
| Mr. Unblink | Watcher | child wearing mask, muffled | never sleeps, eerie calm |
| Little Corey | Collector | eager trader, bargain-tone | xenomorph mask voice |
| Vernon the Door-Finder | Vortex | chubby, distracted, enthusiastic | opening doors that shouldn't exist |
| Minnie | Meme | trending, chatty, shape-shifting | voice updates weekly |
| Wanda Wee | Warlord | bossy kid commander | too-large boots running games |
| Senator Sprout | Politician | serious child politician | mini-handshakes, promise-breaker |
| Wayne the Warden's-Boy | Warden | rule-follower anxiety voice | carries tiny locks |
| Gary the Ninth | Game Master | rule-changer, too-smart | always smiling, never losing |
| Thazu | Necromancer | dress-up funeral games | tea-parties for dead toys |
| The Prince | Engineer | inventor kid, oil-smudged | "Hear ye, hear ye" verse-voice |
| Red, the Seeker-Boy | Human | curious, wide-eyed, asking | remembers everyone who died |

**Lines needed per Mascoteer:**
- 1 arrival greeting (per trial day)
- 3-4 daily-game prompts
- 1 failure-method narration (when they kill a candidate)
- Graduation lines (for winners)

**BONUS**: 3 canonical arrival verses (The Prince, The Ninth, The Human) — already in mascoteers.ts. These should be CHANTED, not spoken. Layered child voices.

## SECTION 3 — 12 MECHRONIS PROFESSORS (Adult Archon Simulacra)

Adult Architect-programmed teaching versions. Believe they ARE the Archon.
Tone: formal, grave, precise. Academy professors.
**Recording**: ElevenLabs · ~5-8 lines per Professor.

| Professor | Archon | Voice | Delivery Note |
|---|---|---|---|
| Headmaster Kanevas | CoNexus | grey-robed, empty-lectern voice | drill-master cadence |
| Professor Aoki | Watcher | Japanese-inflected, immaculate | never breaks eye contact |
| Curator Halverez | Collector | middle-aged, gloved, bargainer | trade-exercise lessons |
| Professor Orphic | Vortex | voice shifts per session | students disagree on appearance |
| Professor Mireille | Meme | belief-engineer, trend-updated | "what's viral this week" |
| General Kasra | Warlord | weathered, tactical visor voice | "casualties: acceptable or wasteful" |
| Senator Vellis | Politician | gracious, impeccable, lawyer | leverage-studies chair |
| Warden Greenshaw | Warden | green-haired, key-ring rattle | locks dangerous ideas away |
| Professor Vex | Game Master | rule-lawyer, too-wide smile | loopholes-as-passing-grade |
| Dr. Vasara | Necromancer | dark-elf academic, red lenses | "endurance medicine" lecturer |
| Artificer Vent | Engineer | young, oil-stained, enthusiastic | teaches weapons-crafting |
| The Proctor | Human | unnamed, worn coat, soft gravel | grades himself in silence |

**Lines needed per Professor:**
- Classroom intro speech
- Grading rubric explanation  
- Signature lesson narration
- Failure consequence line
- Rare promotion moment

## SECTION 4 — 12 APPRENTICE ARCHETYPES (Male + Female VO)

**MOST IMPORTANT SECTION** — players will hear these the most.
Each archetype needs BOTH male and female voice variants.
**Recording**: ElevenLabs · ~20-30 lines per archetype × 2 genders = 24 voice profiles total.

| Archetype | Voice Direction | Breaking-point tone |
|---|---|---|
| Zealot | Fervent, rising cadence, quotes scripture | betrayal: collapses quietly |
| Ghost | Silent, spare words, never fills silence | vanishes mid-sentence |
| Scholar | Precise, academic, cites sources | becomes cold, quotes fail |
| Revenant | Slow, measured, slightly echoing | laughs gently at death |
| Artisan | Unhurried, technical, small satisfactions | goes silent when work dies |
| Oracle | Distracted, half-elsewhere, switches topics | apologizes for prediction |
| Wanderer | Easy, drifty, quick to change subject | announces leaving, often |
| Martyr | Gentle, reassuring, minimizes own pain | accepts sacrifice serenely |
| Heretic | Sharp, rhetorical, silence-as-weapon | validates the darkness |
| Jester | Quick, bright, punchlines | grief-humor that doesn't land |
| Sentinel | Clipped, operator-cadence, brief | states failure flatly |
| Prodigal | Rough edges, half-apologetic, direct | asks for permission to leave |

**Lines needed PER archetype PER gender:**
- 4 recruitment lines (when rolled)
- 4 trial-day responses (daily decisions)
- 6 bond-level greetings (bond 0, 20, 40, 60, 80, 100)
- 4 Letter-from-the-Front delivery variants
- 4 betrayal stage lines (warning / turn / declaration / betrayal)
- 2 death scenes (survivable and terminal)
- 2 graduation lines

= **30 lines × 12 archetypes × 2 genders = 720 lines total for archetype VO.**

## SECTION 5 — CINEMATIC VO (Short Intro Scenes)

Each new major system should have a ~15-30 second intro cinematic the FIRST time the player enters.

| Cinematic | Length | VO | Notes |
|---|---|---|---|
| Matrix of Dreams first entry | 20s | Narrator (Elara-warm) | "Every Potential is a Waking Dreamer..." |
| Sorting Ceremony | 45s | Assigned Archon (varies) | 4-phase ceremony (arrival/vote/claim/welcome) |
| First visit to Common Room | 15s | Assigned Professor | Guild welcome + motto |
| Apprentice recruitment | 15s | Elara | "Your first candidate has arrived..." |
| Celebration entry (Apprentice) | 30s | The Dreamer (secret handler) | Welcome to Celebration verse |
| Mascoteer first meeting | 15s per Mascoteer | That Mascoteer | Introduction game-prompt |
| House Cup first check | 10s | Narrator | "Twelve Guilds. One winner this week." |
| Dark Arts: corruption crossing 25 | 10s | Necromancer | "You have crossed into Tainted..." |
| Dark Arts: corruption crossing 50 | 15s | The Warden | "Corrupted. Order NPCs will see you now." |
| Dark Arts: corruption crossing 75 | 20s | Shadow Tongue | "Consumed. The Dark Arts wear you now." |
| Dark Arts: 100 Enemy | 30s | The Architect (rare) | "You are marked. Everything hunts you." |
| First Apprentice graduation | 20s | The assigned apprentice + Elara | Welcome aboard scene |
| First Apprentice betrayal | 30s | Apprentice (archetype) + Player | Betrayal declaration cinematic |
| First Apprentice sacrifice | 25s | Remaining roster reactions | Witness cinematic |
| Purge ritual: Architect's Audit | 60s | The Architect (rare appearance) | The ultimate purge ceremony |
| Cohort graduation | 25s | Mascoteer of record | "Only one graduates. Here they stand." |
| Ideology commitment | 20s per vision | Vision's faction leader | 6 unique cinematics total |

## SECTION 6 — AMBIENT / TRIGGER VO

Small repeating lines triggered throughout gameplay:

| Trigger | VO | Lines Needed |
|---|---|---|
| Archon voice fires during NPC dialog | Matching Archon | 3-4 per Archon × 12 = 48 |
| Ambient leak during dialog (NPC) | Matching NPC | 2-3 per NPC × 7 = ~20 |
| Failure revelation toast | Matching narrator | 10+ existing in failureContent.ts |
| Legion letter arrival chime | Apprentice archetype voice | 1 per archetype × 2 genders = 24 |
| Signature ability activation | Matching Archon whisper | 1 per ability × 12 = 12 |
| Dark variant activation | Matching dark voice | 1 per ability × 12 = 12 |
| Daily decision card reveal | Mascoteer | 1 per Mascoteer × 12 = 12 |

**TOTAL NEW VO LINES ESTIMATE**: ~1,000 unique voice clips.

## PRIORITY ORDER FOR PRODUCTION

1. **Week 1**: 12 Apprentice archetype voice profiles (male + female) — highest player-facing frequency
2. **Week 2**: 12 Archon mentor voices — core inner-voice loop
3. **Week 3**: 12 Mascoteers — Celebration trial backbone
4. **Week 4**: 12 Professors — Common Room + lessons
5. **Week 5**: Cinematic intros (17 cinematics)
6. **Week 6**: Ambient triggers + polish passes



---

# === VISUAL_PRODUCTION_BIBLE.md ===

# VISUAL PRODUCTION BIBLE — Dischordian Saga

> Every image, video clip, and visual asset needed to make
> Ark 1047 feel like a living, breathing AAA experience.
>
> **Tools**: Magnific (upscaling), Nano Banana 2 (image gen), Kling Omni (video gen)
> **Style**: Dark sci-fi, BioWare cinematic, Blade Runner meets Mass Effect
> **Resolution**: All images 2x minimum for retina. Videos 1080p minimum.

---

## 1. CHARACTER PORTRAITS

Each NPC needs: full portrait (512x768), bust (256x256), 4 expression variants, manifestation overlay.

### ELARA — Ship AI / Senator Elara Voss
- **P0** `elara_portrait_full.png` (512x768)
  - Prompt: "Holographic woman mid-30s, silver-white hair, cyan glowing eyes, translucent blue skin showing circuit traces underneath, senatorial robes ghosting through holographic form, warm but precise expression, dark spacecraft bridge background, volumetric light, cinematic portrait, sci-fi"
  - Expressions: neutral, concerned, vulnerable (eyes down), speaking (mouth open)
  - Manifestation overlay: holographic scanline effect, cyan color bleeding

### THE HUMAN — Last Archon / The Detective
- **P0** `the_human_portrait_full.png` (512x768)
  - Prompt: "Male face emerging from digital static and red glitch artifacts, one eye visible through corrupted data streams, ancient and knowing expression, substrate layer visualization — code and red light behind the face, dark void background, cyberpunk noir portrait"
  - Expressions: neutral (calculating), amused (one-sided smirk), vulnerable (both eyes visible), dangerous (red glow intensifies)
  - Manifestation overlay: red glitch distortion, VHS tracking lines

### AGENT ZERO — Dead Insurgent Signal
- **P0** `agent_zero_portrait_full.png` (512x768)
  - Prompt: "Female military operative silhouette in orange static interference, combat gear fragments visible through signal noise, short dark hair, determined jaw visible, radio wave distortion effect, orange and black color palette, ghost in the machine aesthetic, encrypted transmission visualization"
  - Expressions: urgent (eyes sharp), haunted (looking away), defiant (chin up), spectral (fading)
  - Manifestation overlay: signal static, orange noise bands

### ADJUDICATOR LOCKE — New Babylon Diplomat
- **P0** `locke_portrait_full.png` (512x768)
  - Prompt: "Sharp-featured man in purple formal diplomatic attire, New Babylon insignia (scales of justice with one side weighted), predatory smile, manicured appearance, dark trade office background with holographic market data, purple and gold accents, diplomatic menace, sci-fi politician portrait"
  - Expressions: mercantile (smile), predatory (narrowed eyes), collegial (open), judicial (stern)
  - Manifestation overlay: clean signal, purple accent glow

### THE SOURCE / KAEL — Patient Zero
- **P0** `the_source_portrait_full.png` (512x768)
  - Prompt: "Male face dissolving into viral tendrils of red and black, one human eye remaining with genuine compassion, Kael's younger face visible underneath the viral corruption like a palimpsest, bio-organic horror mixed with tragic beauty, the Thought Virus consuming a hero, dark medical bay background, body horror meets pathos"
  - Expressions: viral (fully corrupted), grieving (Kael showing through), prophetic (eyes glowing), empty (hollow)
  - Manifestation overlay: viral corruption tendrils, red-black organic distortion

### THE ANTIQUARIAN — Timekeeper / The Programmer
- **P0** `antiquarian_portrait_full.png` (512x768)
  - Prompt: "Elderly man with red-glowing steampunk goggles pushed up on forehead, green temporal shimmer around his form, long leather coat, white beard, wise and slightly sad eyes, miniature city (Orb of Worlds) floating near his hand, library of impossible books behind him, time-shifted echoes of himself at different ages visible as faint afterimages"
  - Expressions: ancient (contemplative), playful (slight smile), sorrowful (goggles glowing brighter), revelatory (goggles removed, golden eyes)
  - Manifestation overlay: green temporal echo, time-shifted afterimages

### SHADOW TONGUE — Hidden Demon / SVP Communications
- **P0** `shadow_tongue_portrait_full.png` (512x768)
  - Prompt: "Face made entirely of indigo-colored text and words, features formed by flowing language — eyes are quotation marks, mouth is a serif font, hair is cascading code, elegant and literary but deeply wrong, words occasionally rearranging, forbidden manuscript pages swirling in background, ASMR-beautiful but uncanny valley, language corruption personified"
  - Expressions: invisible (barely perceptible text), seductive (words forming a smile), scholarly (organized text), corrosive (text scrambling)
  - Manifestation overlay: indigo text distortion, words forming and dissolving

### PLAYER CHARACTER
- **P1** `player_demagi.png`, `player_quarchon.png`, `player_neyon.png` (256x256 each)
  - Species-specific base portraits for the paper doll system
  - Prompt variants per species (arcane runes / circuit lines / golden hybrid veins)

---

## 2. ROOM BACKGROUNDS (12 rooms, 16:9 ratio)

Existing CDN artwork covers some rooms. Listed below with status.

### DECK 1 — HABITATION
- **EXISTS** `cryo-bay.png` — Cryo Bay
- **EXISTS** `medical-bay.png` — Medical Bay
- **P1** `medical_bay_quarantine.png` — Red quarantine variant (red emergency lighting, contamination warning overlays)

### DECK 2 — COMMAND
- **EXISTS** `bridge.png` — Bridge
- **EXISTS** `archives.png` — Archives
- **P1** `archives_corrupted.png` — Shadow Tongue corruption variant (text floating in air, indigo glow, records rewriting themselves)
- **P1** `bridge_anomaly.png` — System anomaly variant (warning lights, ghost processes visible as holographic figures)

### DECK 3 — OPERATIONS
- **EXISTS** `comms-array.png` — Comms Array
- **EXISTS** `observation-deck.png` — Observation Deck
- **P1** `observation_deck_terminus.png` — Terminus visible through viewport (distant planet-sized structure with viral glow, approaching)

### DECK 4 — TECHNICAL
- **EXISTS** `armory.png` — Armory
- **EXISTS** `engineering.png` — Engineering Bay
- **P1** `engineering_hacking.png` — Hacking minigame background (pipe network visible on wall screens)

### DECK 5 — LOGISTICS
- **P0** `trade_hub.png` (1920x1080) — Trade Hub
  - Prompt: "Sci-fi trading post interior, holographic market displays showing fluctuating prices, New Babylon trade insignia, purple and gold lighting, merchant stalls with exotic goods, diplomatic meeting table, dark luxurious atmosphere"
- **EXISTS** `cargo-hold.png` — Cargo Bay

### DECK 6 — RESTRICTED
- **P1** `trophy_room.png` (1920x1080)
  - Prompt: "Dark exhibition hall with illuminated display cases, golden spotlights on trophy pedestals, holographic achievement plaques on walls, prestigious museum-like atmosphere"
- **EXISTS** `captains-quarters.png` — Captain's Quarters

### HIDDEN
- **P2** `programmers_study.png` (1920x1080) — Prestige 5 unlock
  - Prompt: "Impossible room existing between dimensions, source code of reality visible as golden light streams, the Programmer's desk with the Orb of Worlds, bookshelves containing every version of every story ever told, temporal distortion visible through windows showing multiple timelines simultaneously"

---

## 3. CUTSCENE STORYBOARDS (Kling Omni video)

### P0 — CRITICAL (first impression scenes)

| ID | Scene | Duration | Description | Prompt |
|----|-------|----------|-------------|--------|
| `cs_awakening` | Cryo Awakening | 15-20s | POV: Eyes open, cryo lid lifts, blue light floods in, frost on eyelashes, Elara's holographic form materializes | "First-person POV waking from cryogenic sleep, frost on camera lens clearing, blue emergency lighting, holographic woman materializing from particles of light, medical bay interior, cinematic sci-fi" |
| `cs_elara_intro` | Elara Introduction | 10-15s | Elara's full holographic form stabilizes, she makes eye contact, circuit traces pulse under her skin | "Holographic AI woman with silver hair stabilizing from scattered light particles, cyan circuit traces pulsing under translucent skin, making direct eye contact with camera, dark bridge background, Mass Effect style cinematic" |
| `cs_human_contact` | First Human Signal | 10s | Static builds, red frequency line appears, a face emerges from digital noise | "Television static resolving into a human face through red digital noise, substrate layer visualization, one eye becoming visible through corrupted data, whispered communication, dark and intimate, sci-fi horror" |
| `cs_terminus_approach` | Terminus Revealed | 15s | Camera pulls back from observation deck viewport, massive structure visible in space, viral glow | "Massive planet-sized alien megastructure approaching through deep space, glowing with red viral energy, viewed through spacecraft observation window, sense of dread and scale, cinematic space horror" |

### P1 — NPC FIRST CONTACT (7 scenes)

| ID | NPC | Duration | Prompt |
|----|-----|----------|--------|
| `cs_zero_signal` | Agent Zero | 8s | "Orange radio static coalescing into female silhouette, military signal visualization, urgent encrypted transmission" |
| `cs_locke_hail` | Locke | 8s | "Purple holographic communication channel opening, sharp-featured diplomat appearing in trade office, predatory smile" |
| `cs_source_infection` | The Source | 10s | "Medical bay screens corrupting with viral code, a face forming from red-black organic tendrils, tragic and horrifying" |
| `cs_antiquarian_echo` | Antiquarian | 10s | "Green temporal distortion rippling through archives, elderly figure stepping out of a time fold, books floating" |
| `cs_shadow_discovery` | Shadow Tongue | 10s | "Archive text lifting off pages and swirling into a face made of words, indigo glow, literary horror" |
| `cs_stargazing` | Elara Stargazing | 12s | "Holographic woman gazing through observation window at stars, 93847 sunrises reflected in her eyes, lonely beauty" |
| `cs_chess_gambit` | Chess Intro | 8s | "Holographic chess board materializing on bridge command table, AI opponent manifesting as spectral figure" |

### P2 — REVELATION CUTSCENES (major story moments)

| ID | Moment | Duration | Prompt |
|----|--------|----------|--------|
| `cs_elara_senate` | Elara's Senate Memory | 15s | "Holographic woman's eyes widening as fragments of political chamber flash around her — senatorial robes, betrayal, the Architect's hand extended, memory shattering like glass" |
| `cs_human_archon` | Human Becomes Archon | 12s | "Man in detective coat standing before impossibly large AI construct (the Architect), accepting transformation, body dissolving into the substrate, sacrifice scene" |
| `cs_source_memory` | Source's Last Memory | 12s | "Viral entity pausing as a woman's singing voice cuts through — flash of beautiful face, melody visible as golden light in red-black void, Kael's human face visible for one moment" |
| `cs_antiquarian_reveal` | Programmer Reveal | 15s | "Elderly man removing red goggles to reveal golden eyes, green temporal energy flooding outward, every version of reality visible simultaneously, the first line of code glowing" |
| `cs_shadow_truth` | Shadow Tongue's Domain | 12s | "Ship's text systems revealed as a vast library of edits — every log rewritten, Elara's memories shown as curated pages, the demon's true scope revealed" |

### P2 — BRANCHING VIDEO (Bandersnatch-style)

| ID | Decision | Branch A | Branch B | Branch C |
|----|----------|----------|----------|----------|
| `bv_human_trust` | Tell Elara about The Human? | Tell her (she's hurt) | Keep secret (guilt) | Confront Human (he's impressed) |
| `bv_source_offer` | Accept The Source's philosophy? | Resist (he respects it) | Consider (he shares more) | Accept (paradigm shift) |
| `bv_shadow_deal` | Trust Shadow Tongue's version? | Reject (he corrupts more) | Investigate (he's amused) | Accept (reality shifts) |
| `bv_elara_memory` | How to handle Elara's past? | Comfort her | Tell her truth | Let her discover alone |

---

## 4. CARD ART (6 factions)

### Faction Card Backs (6 designs, 375x525 each)
- **P1** `card_back_architect.png` — Red circuits, Architect's eye symbol
- **P1** `card_back_dreamer.png` — Green organic spirals, Dreamer's vision
- **P1** `card_back_insurgency.png` — Orange resistance symbol, combat worn
- **P1** `card_back_new_babylon.png` — Purple scales, corrupt elegance
- **P1** `card_back_antiquarian.png` — Green temporal gears, aged parchment
- **P1** `card_back_thought_virus.png` — Red-black viral tendrils, horror

### Iconic Character Cards (12 cards, 375x525 each)
- **P1** The Architect, The Dreamer, Iron Lion, The Warlord, Kael, The Enigma
- **P1** The Human, Agent Zero, The Oracle, The Engineer, The Necromancer, The Programmer

---

## 5. SHIP EXTERIOR

- **P0** `ark_1047_exterior.png` (1920x1080) — Three-quarter view of Ark 1047
  - Prompt: "Massive sci-fi spacecraft Inception Ark, sleek dark hull with cyan running lights, cross-section visible showing multiple decks, deep space background with distant nebula, cinematic spacecraft design, hard sci-fi aesthetic"
- **P1** `ark_terminus_approach.png` — Ark with Terminus visible in background
- **P2** `ark_cross_section.png` — Technical schematic style, 7 decks labeled

---

## 6. UI ELEMENTS

### Loading Screens (4 variants, 1920x1080)
- **P1** `loading_bridge.png` — Bridge systems booting
- **P1** `loading_combat.png` — Combat simulator initializing
- **P1** `loading_terminus.png` — Terminus Swarm defense grid
- **P1** `loading_trade.png` — Trade network connecting

### Achievement Graphics
- **P1** `ach_bronze.png`, `ach_silver.png`, `ach_gold.png`, `ach_diamond.png` (128x128 each)
  - Tier-specific achievement badge icons with glow effects

### Ship Theme Previews (10 previews, 400x225 each)
- **P2** One preview per morality-gated ship theme showing the particle + pattern effect

### Epoch Pass Banner
- **P1** `epoch_pass_season_1.png` (1200x400) — Season 1 "THE FALL" banner with Source artwork

---

## 7. GAME-SPECIFIC ART

### Dischordia (Card Game)
- **P1** `dischordia_board.png` (1920x1080) — 5x9 tactical grid background
- **P1** `dischordia_pack_opening.png` — Pack rip ceremony background

### Terminus Swarm (Tower Defense)
- **P1** `terminus_map_1.png` (1920x1080) — TD map background with Terminus in distance
- **P1** 8 turret sprites (64x64 each) — matching game definitions

### Fight Game
- **P1** `arena_background.png` (1920x1080) — Combat arena
- **P2** Fighter character sprites (placeholder silhouettes → full art)

### Chess
- **P1** `chess_board_holographic.png` — Holographic chess board on bridge

### Minigames
- **P2** `hacking_bg.png` — Engineering pipe network background
- **P2** `star_chart_bg.png` — Deep space star field
- **P2** `signal_decrypt_bg.png` — Comms Array static visualization

---

## 8. CONSTELLATION PATTERNS (Star Chart Minigame)

5 constellation diagrams for the Star Chart game reference:
- **P2** `constellation_architects_eye.png` — Diamond with center dot
- **P2** `constellation_iron_lions_shield.png` — Hexagonal shield
- **P2** `constellation_dreamers_spiral.png` — Fibonacci spiral
- **P2** `constellation_kaels_chain.png` — Chain link pattern
- **P2** `constellation_two_witnesses.png` — Two pillars with bridge

---

## TOTAL ASSET COUNT

| Category | P0 | P1 | P2 | Total |
|----------|----|----|----|----|
| Character Portraits | 7 | 3 | 0 | 10 |
| Expression Variants | 28 | 0 | 0 | 28 |
| Room Backgrounds | 1 | 6 | 1 | 8 (new, 12 exist) |
| Cutscene Videos | 4 | 7 | 9 | 20 |
| Branching Videos | 0 | 0 | 4 | 4 |
| Card Art | 0 | 18 | 0 | 18 |
| Ship Exterior | 1 | 1 | 1 | 3 |
| UI Elements | 0 | 10 | 10 | 20 |
| Game Art | 0 | 6 | 5 | 11 |
| Constellations | 0 | 0 | 5 | 5 |
| **TOTAL** | **41** | **51** | **35** | **127** |

---

## STYLE GUIDE

**Color Palette:**
- Elara: `#22d3ee` (cyan)
- The Human: `#f87171` (red)
- Agent Zero: `#ff6600` (orange)
- Locke: `#e040fb` (purple)
- The Source: `#ff1744` (deep red)
- The Antiquarian: `#00e676` (green)
- Shadow Tongue: `#6366f1` (indigo)
- Ship Hull: `#0a0a1a` (near black)
- UI Accent: `#33E2E6` (neon cyan)

**Art Direction:**
- Dark backgrounds, never pure white
- Volumetric lighting, god rays through spacecraft interiors
- Holographic elements: scanlines, slight transparency, edge glow
- Corruption: VHS tracking, glitch artifacts, text distortion
- Scale: make the player feel small in a vast, dangerous ship
- Emotion: every portrait should tell a story without words

---

## ═══ EXPANSION UPDATE — New Visual Assets Required ═══

### NEW CHARACTER PORTRAITS (P0 Priority)

#### **THE DEGEN (11th Ne-Yon, Casino Host)**
- Full portrait + 3 expressions (laughing, contemplative, manic)
- **Aesthetic**: Genderfluid, theatrical, chaos embodied. Think Las Vegas lounge singer meets trickster god.
- **Generation prompt**: "A genderfluid entity in a shimmering iridescent suit, one eye glowing gold, the other purple, standing in a casino made of living light. Chaotic theatrical posture. Purple and gold color palette. Neon casino background with swirling light patterns. Digital art, photorealistic, dramatic lighting."
- **Resolution**: 1024x1536 (portrait aspect)
- **Variants**: laughing, contemplative, angry, winking

#### **COLLECTOR CLONE-007 (Arena Operator)**
- Similar to original Collector — blue Xenomorph-inspired mask
- Distinguishing feature: slight wear on the mask (he's a clone, not the original)
- **Generation prompt**: "A figure in dark formal robes wearing an ornate blue xenomorph-style mask with subtle wear marks. Standing in a roman-coliseum-style arena floating in purple space. Catalog scrolls and data tablets floating around them. Dramatic arena lighting."

#### **THE NECROMANCER (10th Archon, Returning)**
- **Two states needed**: Matrix of Dreams (ethereal) and Returned (physical)
- **Aesthetic**: Dark elf, white spiky hair, red and black robe, red steampunk glasses
- **Matrix form prompt**: "A dark elf with spiky white hair, wearing red and black robes, red steampunk glasses glowing. Appears ghostly, translucent, surrounded by swirling dreamscape energy. Ethereal lighting, purple and black palette, dream-matrix aesthetic."
- **Returned form prompt**: "Same dark elf character now fully physical and solid. Standing before a castle of black bone in a swirling death-storm. Intimidating presence, commanding stance. Red and black robes billowing. Dark fantasy aesthetic."

#### **THE RESURRECTIONIST (Ne-Yon)**
- Withered human in techno-organic robes, cracked porcelain mask hiding face
- **Generation prompt**: "A withered ancient figure in techno-organic robes made of interwoven metal and flesh. Face hidden behind a cracked white porcelain mask with kintsugi gold seams. Holding a resurrection staff. Standing in a vault of glowing soul fragments. Melancholic, kind presence. Ethereal lighting."

### NEW PLANETS / LOCATIONS (P0 Priority)

#### **VIOLETTA — The Voltari Homeworld**
- A purple planet inside a living electrical storm
- **Generation prompt**: "A vibrant purple planet surrounded by a permanent living lightning storm. Electric-blue and purple discharges constantly dancing across the atmosphere. Crystal formations visible through the storm. Alien, hopeful, mysterious. Space view, dramatic scale, cinematic composition."
- **Variants needed**: Far orbit view, close orbit view, atmospheric entry view, surface view (if ever approachable)

#### **THE GAME MASTER'S WORLD (Arena Location)**
- Abandoned planet at the edge of known space
- **Generation prompt**: "An abandoned alien planet with a massive roman-style coliseum built into its surface. Purple and red lighting, scattered mechanical debris from old games, dramatic stormy sky. The Game Master's abandoned world. Epic scale, cinematic."

#### **THE CASTLE OF DEATH (Necromancer's Domain)**
- In the Matrix of Dreams, now potentially manifesting in reality
- **Generation prompt**: "A gothic castle made of black bone and shadow, floating in a sea of white mist. Multiple towers, red windows glowing, surrounded by swirling souls. Ominous but beautiful. Dark fantasy aesthetic."

#### **THE DEGEN'S CASINO**
- Floating casino station in Ne-Yon space
- **Generation prompt**: "A lavish casino floating in deep purple space. Neon signs in impossible languages, crystal chandeliers made of lightning, tables where players bet with glowing souls. Vegas meets cosmic horror. Chaotic lights, multiple floors, tempting and dangerous."

### NEW SPECIMEN ART (43 companions total)

All 43 specimens need 3 evolution stage portraits each (Hatchling → Companion → Ascended). Priority batches:

**P0 — First 7 (starter companions):**
- Lux (holographic fox) — cyan light, phases through solid
- Cipher (data serpent) — scrolling code scales
- Echo (temporal kitten) — slight time-phase ghost effect
- Flicker (static bird) — electromagnetic interference wings
- Gilt (golden beetle) — ornate shell with gems
- Spore (viral symbiote) — tendrils, pulsing red
- Glyph (text moth) — wings displaying living text

**P1 — Next 12 (Archon-associated):**
See specimenExpansion.ts for full list. Each tied to an Archon.

**P2 — Final 24 (Ne-Yon + faction):**
Lower priority, can be generated post-launch.

### CUTSCENE STORYBOARDS (Kling Omni)

#### **First Cryo Awakening** — CRITICAL (first thing player sees)
- 30-60 second cinematic
- Shot list: close on frozen face → warming systems → eyes open → Elara's hologram appears
- Style: Mass Effect / Blade Runner 2049 aesthetic

#### **Voltari First Contact** — MAJOR MILESTONE
- 45 seconds when community decodes first Voltari word
- Shot list: Violetta from space → storm parting → electrical entity forming → human silhouette reaching back → connection established
- Style: Arrival-inspired, awe and wonder

#### **Necromancer Return** — ENDGAME MILESTONE
- 60-90 seconds server-wide event
- Shot list: Castle of Death manifesting → Necromancer stepping through → galaxy reacting → cultist cities lighting up on map
- Style: Apocalyptic, beautiful horror

#### **Kael's Memory (The Source's Last Human Moment)**
- 15 second flashback
- Shot list: Kael making coffee, sunlight through window, laughter off-screen, then static corruption
- Style: Soft warmth contaminated by digital decay

### UI/UX VISUALS

#### **Inner Voices Display**
- Skill voice text styling mockup needed
- Each skill's comment should appear with its unique color + font treatment
- Example: TACTICS in cold red monospace, PERCEPTION in cyan whispered italic, EMPATHY in soft purple serif

#### **Thought Cabinet UI**
- Player's "brain" visualization showing thoughts being internalized
- Active thoughts as glowing nodes
- Internalizing thoughts with progress rings

#### **Political Vision Progress**
- 6 faction mandala designs (one per vision)
- Each mandala fills in as the player commits deeper
- Architect: geometric perfect circle, Dreamer: organic spiral, Insurgency: broken chains, etc.

#### **Feature Unlock Celebration**
- Particle effect when new system unlocks
- Category-colored (core=cyan, combat=red, social=purple, economic=amber, lore=green, endgame=gold)

### ASSET DELIVERY PRIORITIES

**WEEK 1 (Critical for launch):**
- 7 NPC portraits (Elara, Human, Zero, Locke, Source, Antiquarian, Shadow Tongue)
- First Awakening cinematic
- 7 starter companion specimens

**WEEK 2 (Expand depth):**
- The Degen portrait
- Voltari First Contact cinematic
- Violetta planet art
- 12 Archon specimens

**WEEK 3-4 (Polish):**
- Necromancer Return cinematic
- Castle of Death, Game Master's World, Casino environments
- Remaining 24 specimens
- UI mockups for new systems

---

# VISUAL ASSETS — MECHRONIS / CELEBRATION / APPRENTICE SYSTEMS

All new visual assets needed to complete the systems shipped this epoch.
Estimated total: ~200 key art pieces + 17 cinematics.

## SECTION 1 — SHORT INTRO CINEMATICS (17 pieces)

Each cinematic is ~15-60 seconds, plays the first time a player enters that system.
**Format**: Kling AI or Runway ML video · 1920×1080 or vertical 9:16 for mobile.

| # | Cinematic | Length | Visual Direction | Key Imagery |
|---|---|---|---|---|
| 1 | Matrix of Dreams entry | 20s | Purple-indigo dreamscape, floating symbols | Twelve Archon silhouettes forming a circle; player's consciousness drifting toward center |
| 2 | Sorting Ceremony (×12) | 45s | Cold, academic, institutional | 12 Archon holograms vote; one claims the player; Guild banner unfurls |
| 3 | Common Room first entry | 15s per guild | Unique per Guild aesthetic | Camera tilt-down through a specific Guild's hall; students turn to look |
| 4 | Apprentice recruitment | 15s | Elara's medbay, bright, hopeful | Elara presents candidate dossier; candidate silhouette materializes |
| 5 | Celebration entry (Apprentice POV) | 30s | Disney-pastel turning dark | Bright welcome-sign → camera pulls back → shadows in the windows |
| 6 | Mascoteer first meeting (×12) | 15s each | Child at play-turned-wrong | Each Mascoteer's first daily-game reveal, with hidden menace |
| 7 | House Cup first check | 10s | Institutional leaderboard dramatized | 12 Guild crests spinning; bots animated; leader fatigues visibly |
| 8 | Dark Arts tier cross (×4: 25/50/75/100) | 10-30s | Corruption cracking through player art | Progressive visual descent from warm → crimson → black-void |
| 9 | First Apprentice graduation | 20s | Hopeful, relieved | Apprentice stepping onto ship, crew welcoming |
| 10 | First Apprentice betrayal | 30s | Tense, tragic | Apprentice draws weapon, hidden motive revealed in flashback |
| 11 | First Apprentice sacrifice | 25s | Ritual, cold, witnessed | Every roster member's reaction shot, intercut with the act |
| 12 | Purge: Architect's Audit | 60s | Architect's Study, golden-amber, formal | The Architect himself appears (rare), scans the player, rewrites them |
| 13 | Cohort graduation | 25s | Mascoteer crowning the winner | Last-candidate-standing moment, Mascoteer hands them a token |
| 14 | Ideology commitment (×6: one per vision) | 20s each | Vision-specific aesthetic | Architect/Dreamer/Insurgency/New Babylon/Hierarchy/Antiquarian visions |
| 15 | Evil Apprentice Declaration | 30s | Horror-reveal, intimate | Apprentice recites their hidden motive face-to-camera |
| 16 | Defect to Dreamer path | 40s | Pastoral escape, liberation | Player + betrayer walking off ship together into the light |
| 17 | Archetype emergence (×8) | 10s each | Player's portrait crystallizing | First time an archetype emerges for this player |

## SECTION 2 — CHARACTER PORTRAITS

### The 12 Mascoteers (child-Archon forms)
**Style**: Afrofuturist children's book illustration meets horror-movie creepy-kid aesthetic.
**Format**: 3:4 portrait, CDN-hosted PNG with transparency.

| Mascoteer | Key Visual Tokens |
|---|---|
| Conni the Conductor | Child in oversized conductor's coat, waving at silent orchestra, eyes closed |
| Mr. Unblink | Small child in white mask with eyes painted open, never blinks |
| Little Corey | Child in blue xenomorph party-mask, holding jar of "favorite things" |
| Vernon the Door-Finder | Chubby child in orange sun-shirt, holding detached doorknobs |
| Minnie | Face updates per cultural trend, glitching fashion |
| Wanda Wee | Small blonde in yellow hood, mini tactical visor, oversized boots |
| Senator Sprout | Tiny formal suit, hands gesturing statesman-style |
| Wayne the Warden's-Boy | Green-haired in tan/black trench coat, tiny locks |
| Gary the Ninth | Dark-haired boy, blue trench, red steampunk goggles, too-wide smile |
| Thazu | Pale dark-elf child, dress-up robes, oversized red goggles, skeleton cat |
| The Prince | Young Black boy in red steampunk trench coat, tools of his own make |
| Red (Seeker-Boy) | Red hair, blue eyes, wide-eyed alert, wearing nothing ceremonial |

### The 12 Mechronis Professors (adult-Archon forms)
**Style**: Dark academia portrait, formal, institutional, with unsettling details.

| Professor | Key Visual Tokens |
|---|---|
| Headmaster Kanevas | Tall, grey-robed, silver hair, eyes like empty lecterns |
| Professor Aoki | Japanese man, 40s, immaculate white suit, surgical mask, all-seeing eye tattoo |
| Curator Halverez | Middle-aged in dark robes, blue xenomorph mask (inherited), gloved |
| Professor Orphic | Constantly-shifting, students disagree on appearance |
| Professor Mireille | Updates aesthetic weekly to match trend cycle |
| General Kasra | Weathered woman 50s, yellow military coat, tactical visor |
| Senator Vellis | Impeccable suit, gold pin of forty crossed promises |
| Warden Greenshaw | Green-haired, tan/black trench, key-ring of 42 keys |
| Professor Vex | Blue trenchcoat, red steampunk goggles, too-wide smile |
| Dr. Vasara | Dark-elf woman, white hair, red-black academic robe, red lenses |
| Artificer Vent | Young Black man, red steampunk trench coat, oil-smudged |
| The Proctor | Red-haired, blue eyes, well-worn coat, unnamed |

### The 12 Apprentice Archetypes (24 portraits total — male + female)
**Style**: Each archetype has a distinct color palette + posture language.

| Archetype | Visual Token | Palette |
|---|---|---|
| Zealot | Eyes lit from within, symbol-marked | crimson + gold |
| Ghost | Always partially-obscured, cloaked | shadow + slate |
| Scholar | Annotated margins visible on clothes | ink + parchment |
| Revenant | Slight translucency, scar across throat | bone + indigo |
| Artisan | Tools visible, hands weathered | copper + leather |
| Oracle | Eyes staring past viewer | violet + smoke |
| Wanderer | Travel-worn, open road behind them | dust + sunset |
| Martyr | Bandages visible, calm smile | white + rust |
| Heretic | Burn-marks of forbidden texts | black + forbidden-red |
| Jester | Asymmetric, bright, eyes tired | carnival + bruise |
| Sentinel | Uniform-perfect, watchful | steel + midnight |
| Prodigal | Half-turning away, old bruise healing | sepia + returning-gold |

## SECTION 3 — GUILD ENVIRONMENTS (12 Common Rooms)

Interior shots, no figures, full room wide-shot.
**Format**: 16:9 wide, establishing shot style.

| Guild | Environment Tokens |
|---|---|
| The Chorus | Orchestra pit in the sky, floating conducting podiums, twelve microphones |
| The Eyes | Surveillance chamber, screens-wall, Japanese-courtyard rock garden |
| The Archive | Curio collection hall, jars of memories, trade-counters |
| The Between | Reality-shifting room, doors that aren't attached to walls |
| The Influencers | Trendy mirror-hall, constantly updating fashion |
| The Yellow Coats | Military hall, yellow-coated uniforms on racks, battle plans |
| The Congress | Senate chamber + promise-ledger walls |
| The Locks | Prison-safe aesthetic, tiny cages stacked wall-to-ceiling |
| The Grey Gamers | Game-design workshop, unfinished puzzles mid-air |
| The Living | Resurrection infirmary, red funeral robes, skeletal teaching aids |
| The Forge | Engineer's shop, half-built impossible machines |
| The Architect's Study | Wood-paneled detective's office, unnamed desk |

## SECTION 4 — CELEBRATION TOWN (Disney-Dark)

**Style**: Bright pastel storybook, corrupted by second glance.

| Asset | Notes |
|---|---|
| Celebration town square | Welcoming sign, slightly tilted, flower beds with wrong colors |
| Schoolhouse exterior | Wholesome-wrong, windows staring back |
| The Puzzle Garden | Gary's domain, impossible geometry under pastel skies |
| The Tea-Party Clearing | Thazu's space, skeleton dolls at table, empty chair waits |
| The Door Row | Vernon's courtyard, doors with no buildings |
| The Eye Garden | Mr. Unblink's square, sculptures of eyes |
| The Promise Office | Senator Sprout's little parliament |
| The Locked Room | Wayne's quarantine cell (quiet horror) |
| The Forge-Yard | Prince's workshop, sharp tools arranged as toys |
| The Chorus Pavilion | Conni's bandstand with invisible instruments |
| The Trading Jar-Shelf | Corey's stall of "favorite things" |
| Celebration-by-Night | Town after hours, Mascoteers visible between buildings |

## SECTION 5 — UI / FUNCTIONAL ART

| Asset | Notes |
|---|---|
| 12 Guild crests | Heraldic design, one per Guild |
| Dark Arts tier indicators (5 states) | Clean → Tainted → Corrupted → Consumed → Architect's Enemy |
| Apprentice card frames (5 rarities) | Common (grey) → Mythic (gold-glow animation) |
| Mascoteer card backs | 12 unique designs |
| Matrix of Dreams panel background | Purple-indigo texture |
| Cryo Vault visual | Two frozen chambers, apprentices inside, breathing-slow |
| House Cup banner art | Tournament-scroll aesthetic |
| Archon-voice speech bubbles | 12 unique styles per Archon |
| Cohort leaderboard banner | Military graduation ceremony |

## PRIORITY ORDER FOR PRODUCTION

1. **Week 1 (critical path)**: 24 Apprentice archetype portraits (12 × 2 genders)
2. **Week 2**: 12 Mascoteers + 12 Mechronis Professors
3. **Week 3**: 12 Guild Common Room environments
4. **Week 4**: Top 5 cinematics (Sorting, Matrix entry, Apprentice betrayal, Purge, Celebration)
5. **Week 5**: Celebration town environments + remaining cinematics
6. **Week 6**: UI assets + polish

**TOTAL NEW VISUAL ASSETS**: ~200 pieces + 17 cinematics = ~217 assets.



---

# === ART_PRODUCTION_BIBLE.md ===

# DISCHORDIAN SAGA — Art Production Bible

## Overview

This document contains every art asset needed across the entire Dischordian Saga
application, organized by priority. Each asset includes exact specifications and
AI image generation prompts optimized for Midjourney/DALL-E/Flux.

**CRITICAL CHARACTER NOTES:**
- **The Warlord is FEMALE** — young woman with long blonde hair, cybernetic enhancements, yellow hooded jacket
- **Agent Zero is FEMALE** — the Insurgency's deadliest assassin was a woman
- **The Enigma (Malkia Ukweli) is FEMALE** — Kenyan heritage, Queen of Truth, the 12th Ne-Yon
- **The Seer is FEMALE** — beautiful blue-skinned woman, long black hair, hooded robe
- All existing art should be validated against these canonical genders

**Tools Recommended:**
- **NanoBanna 2** — Character art, creatures, environments
- **Magnific AI** — Upscaling generated images to production resolution
- **Remove.bg or Photopea** — Background removal for sprites

**Global Style Guide:**
- Dark sci-fi aesthetic with bio-mechanical horror elements
- Color palette: deep blacks, dark purples, toxic greens, corrupted reds, cold cyans
- Lighting: dramatic rim lighting, glowing energy effects, volumetric fog
- No text in generated images (we overlay text in code)
- Transparent backgrounds for all sprites (PNG with alpha)

---

## PRIORITY 1: Terminus Swarm (Tower Defense)

### 1A. Enemy Sprites (12 + 2 bosses)

**Format:** 96×96 PNG, transparent background
**Upscale to:** 256×256 with Magnific, then downscale to 96×96 for crisp detail
**Style:** Mechanical demon insectoid hybrids. Part machine, part undead insect.
Bio-organic armor plating mixed with corroded metal. Glowing green/red viral veins.

---

**1. Undead Grub** (Tier 1 — swarm fodder)
```
Tiny insectoid larva creature, biomechanical design, corroded metal exoskeleton
mixed with pale rotting flesh, small segmented body, glowing green eyes,
mechanical mandibles, undead appearance, dark sci-fi horror style,
top-down game sprite perspective, dark background, dramatic lighting,
96x96 pixel art style but rendered in high detail
```

**2. Plague Ant** (Tier 2 — poison trail)
```
Medium insectoid soldier creature, biomechanical ant-like form, six mechanical legs
with corroded bronze plating, abdomen dripping toxic green ichor, compound eyes
glowing sickly yellow, mandibles fused with metal pincers, corrupted organic
carapace with circuit-like veins pulsing green, dark sci-fi horror aesthetic,
top-down game sprite, transparent background
```

**3. Infected Spore** (Tier 2 — flying, explodes)
```
Floating biomechanical spore pod, translucent membrane with visible viral
particles inside, pulsing green bioluminescence, trailing tendrils of infection,
mechanical core visible through organic shell, hovering/flying pose,
sci-fi horror pathogen design, game sprite top-down view, transparent background
```

**4. Corrupt Mantis** (Tier 3 — fast, dodges)
```
Sleek predatory insectoid, mantis-like biomechanical hunter, elongated limbs with
razor-sharp metallic blade arms, aerodynamic corrupted exoskeleton in dark teal,
glowing cyan sensor eyes, speed lines implied by pose, crouched and ready to strike,
dark sci-fi horror insect warrior, game sprite top-down, transparent background
```

**5. Rot Crawler** (Tier 3 — armored, slow)
```
Massive heavily armored beetle-like creature, thick corroded iron plating over
decomposing organic mass, multiple short stubby mechanical legs, front-facing
battering ram horn of fused metal and bone, glowing red cracks in armor showing
internal corruption, slow tank-like siege beast, dark sci-fi horror,
game sprite top-down, transparent background
```

**6. Venom Wasp** (Tier 3 — flying, fast)
```
Aggressive flying wasp-like biomechanical creature, iridescent corrupted wings
with circuit patterns, sleek yellow-and-black mechanical body, oversized stinger
dripping purple venom, compound eyes burning orange, in aggressive flight pose,
dark sci-fi horror insect, game sprite top-down, transparent background
```

**7. Bile Hulk** (Tier 4 — massive HP, explodes on death)
```
Bloated grotesque biomechanical monstrosity, swollen translucent abdomen filled
with toxic green-yellow bile visible through stretched membrane, stumpy mechanical
legs barely supporting massive body, corroded metal plates on back, open mouth
with rows of mechanical teeth, pustules and boils across surface, about to burst,
dark sci-fi body horror, game sprite top-down, transparent background
```

**8. Infected Reaper** (Tier 4 — armored, cleaves)
```
Elite biomechanical warrior insectoid, tall imposing stance, massive scything
blade-arms made of fused bone and corrupted metal, heavy segmented armor
with red pulsing viral veins, skull-like face plate with glowing red eyes,
battle-scarred carapace, death incarnate pose, dark sci-fi horror elite warrior,
game sprite top-down, transparent background
```

**9. Neural Parasite** (Tier 4 — disables turrets)
```
Ethereal horror floating creature, jellyfish-like biomechanical form with
trailing psionic tendrils, translucent head dome showing pulsing brain-like
neural mass inside, purple bioluminescent glow, tendrils of thought-virus
energy reaching outward, psychic horror aesthetic, flying/hovering pose,
dark sci-fi horror, game sprite top-down, transparent background
```

**10. Swarm Queen** (Tier 5 — spawns minions)
```
Massive insectoid queen, elongated biomechanical abdomen constantly birthing
smaller creatures, regal corrupted crown of fused metal and chitin, four
powerful arms with different weapons (blade, claw, tendril, shield),
commanding presence, surrounded by smaller organisms, dark royal purple
and toxic green color scheme, dark sci-fi horror hive matriarch,
game sprite top-down, transparent background
```

**11. Hive Tyrant** (Boss — regenerates, spawns)
```
Colossal apex predator insectoid, towering biomechanical horror, massive
armored carapace with regenerating organic tissue visible in wounds,
four arms ending in different organic weapons, head crowned with bony
horns and multiple glowing red eyes, legs like industrial pistons,
trails of corruption in its wake, absolute terror incarnate,
dark sci-fi horror final boss creature, game sprite top-down, transparent background
```

**12. Avatar of The Source** (Final Boss)
```
Nightmarish manifestation of sentient plague, vaguely humanoid but
fundamentally alien, body made of writhing viral tendrils and corrupted
machinery, a dark crown of neural connections, eyes that are windows
to infinite corruption, ground around it decaying, mechanical and organic
components in constant flux, the physical form of a planet-spanning
consciousness, ultimate dark sci-fi horror entity, red and black
with pulsing green viral energy, game sprite top-down, transparent background
```

---

### 1B. Turret Sprites (8 types)

**Format:** 128×128 PNG, transparent background
**Upscale to:** 256×256 with Magnific, then downscale
**Style:** Salvaged Inception Ark technology. Industrial sci-fi. Repurposed
ship systems. Mix of polished metal and battle-worn surfaces.

---

**1. Pulse Cannon** (Basic turret)
```
Small automated defense turret, industrial sci-fi design, rotating barrel
on a circular base plate, blue energy glow from the barrel tip, salvaged
spaceship technology aesthetic, riveted metal panels, status light indicators,
mounted on floor plate, top-down game view, transparent background
```

**2. Arc Emitter** (Chain lightning)
```
Tesla coil-like defense turret, twin electrical prongs crackling with
cyan lightning arcs between them, circular base with capacitor banks,
salvaged spaceship electrical system repurposed as weapon, sparking
energy effects, industrial sci-fi, top-down game view, transparent background
```

**3. Cryo Array** (Slow enemies)
```
Cryogenic cooling turret, cluster of frost-covered cooling pipes pointing
outward from central hub, ice crystal formations on the emitter tips,
cold blue mist emanating, repurposed life support cooling system,
frost and ice aesthetic, industrial sci-fi, top-down game view,
transparent background
```

**4. Flame Projector** (Area DOT)
```
Flamethrower turret, industrial nozzle mounted on swivel base, flame
pilot light visible, fuel line connections to base, heat shimmer effect,
orange-red glow from barrel, repurposed engine exhaust system, heavy duty
industrial construction, sci-fi, top-down game view, transparent background
```

**5. Missile Battery** (Long range, splash)
```
Missile launcher turret, quad-tube missile rack on rotating platform,
targeting dish on top, armored housing with blast shields, one tube
showing loaded missile with red warhead visible, military-grade spaceship
weapons system, heavy and imposing, industrial sci-fi,
top-down game view, transparent background
```

**6. Shield Pylon** (Buffs nearby turrets)
```
Energy shield generator, tall hexagonal crystal projector on reinforced
base, translucent green energy shield bubble emanating from top,
circular glowing ring around base, spaceship shield generator
technology, protective and supportive appearance, green glow,
industrial sci-fi, top-down game view, transparent background
```

**7. EMP Mine** (Stun enemies)
```
Electromagnetic pulse device, low-profile disc-shaped mine on floor,
concentric rings of metal with central yellow pulsing core, warning
chevrons on the housing, crackling static electricity arcs,
emergency countermeasure device, industrial hazard aesthetic,
yellow warning colors, top-down game view, transparent background
```

**8. Nanite Swarm** (Heals turrets)
```
Repair drone hub, small circular platform with multiple tiny metallic
drones hovering above it in a cloud formation, green repair beam effects,
holographic maintenance interface projecting upward, automated repair
system, helpful and constructive appearance, green and silver,
industrial sci-fi, top-down game view, transparent background
```

---

### 1C. Map Backgrounds (2 maps minimum)

**Format:** 1920×1080 PNG
**Style:** Interior of a crashed Inception Ark. Dark corridors, flickering
emergency lights, hull breaches showing alien sky, debris, damaged panels.

**1. Landing Bay**
```
Interior of a massive crashed spaceship landing bay, viewed from above
at slight angle, dark metallic floor with grid lines visible, emergency
red lighting, hull breach in one wall showing dark alien sky beyond,
scattered debris and wreckage, flickering holographic displays,
damaged support columns, industrial sci-fi environment,
dark moody atmosphere with volumetric fog, suitable as game background
```

**2. Corridor B**
```
Long narrow spaceship corridor interior from above, dark metal walls
with exposed wiring and sparking conduits, emergency lighting strips
along floor creating eerie glow, blast doors partially jammed open,
alien biological growth starting to creep along walls (thought virus
infection), claustrophobic atmosphere, industrial sci-fi horror,
suitable as game background
```

---

### 1D. Towers of Hanoi Gears

**Format:** Various sizes (64px to 192px wide), transparent background
**Style:** Bronze/copper mechanical gears, steampunk-meets-sci-fi

**Gear Set (5 sizes)**
```
Mechanical gear/cog, copper and bronze metal, precision machined teeth,
slight patina and age marks, sci-fi mechanical component, clean design
with visible engineering quality, warm metallic tones, [SIZE] gear,
isolated on transparent background, studio lighting, photorealistic
```
Generate 5 variations at different sizes: tiny, small, medium, large, extra-large.

---

### 1E. Terminus Planet

**Format:** 512×512 PNG, transparent background

```
Dark corrupted rogue planet floating in the void of space, no star
illuminating it, surface covered in glowing red-green viral infection
patterns visible from orbit like circuitry on the surface, dark
atmosphere with toxic green clouds, biomechanical structures visible
on surface, crashed spaceship wreckage visible as tiny dots on surface,
ominous and dread-inducing, the epicenter of a cosmic plague,
dark sci-fi horror aesthetic, transparent background
```

---

## PRIORITY 2: Dischordia Card Game

### 2A. Card Back Design

**Format:** 600×900 PNG

```
Ornate card back design for a dark sci-fi trading card game called
Dischordia, centered geometric pattern combining mechanical gears
and organic viral tendrils, the pattern radiates from a central
eye-like symbol, color scheme of deep purple and dark cyan with
gold filigree borders, mysterious and premium feeling, no text,
symmetrical design, suitable for card game reverse side
```

### 2B. Pack Wrapper Art (3 seasons)

**Format:** 600×900 PNG each

**Season 1: Genesis**
```
Trading card game booster pack wrapper design, "Genesis" theme,
dark sci-fi aesthetic, central image of an Inception Ark ship
emerging from a portal, cyan and teal energy effects, metallic
foil-like border treatment, premium collectible packaging feel,
dark background with star field, no readable text
```

**Season 2: Schism**
```
Trading card game booster pack wrapper design, "Schism" theme,
dark sci-fi aesthetic, central image showing two factions splitting
apart with a crack of purple energy between them, one side order
(blue/gold), one side chaos (red/purple), dramatic fracture line
composition, metallic border, premium packaging feel, no text
```

**Season 3: Convergence**
```
Trading card game booster pack wrapper design, "Convergence" theme,
dark sci-fi aesthetic, central image of multiple faction symbols
being drawn together into a single point of blinding orange-gold
light, dramatic energy convergence effect, all factions represented
as colored energy streams, metallic border, premium feel, no text
```

---

## PRIORITY 3: Branding & UI

### 3A. Dischordian Saga Logo

**Format:** SVG or 2000×600 PNG, transparent background

```
Logo design for "Dischordian Saga", dark sci-fi video game branding,
futuristic angular font style, the word "DISCHORDIAN" larger with
"SAGA" smaller underneath, subtle glitch/corruption effect on the
letters, cyan glow on edges, dark chrome metallic texture on letter
faces, small geometric emblem between the words (hexagonal eye symbol),
transparent background, suitable for dark backgrounds
```

### 3B. Dischordia Sub-Logo

**Format:** SVG or 1200×400 PNG, transparent background

```
Logo for "Dischordia" tactical card game, subset of Dischordian Saga,
angular futuristic font, letters have subtle cracks revealing different
faction colors underneath (cyan, purple, orange, green, red, gold),
minimalist design, game logo suitable for title screens,
transparent background
```

### 3C. Terminus Swarm Sub-Logo

**Format:** SVG or 1200×400 PNG, transparent background

```
Logo for "Terminus Swarm" tower defense game, angular militaristic font,
letters formed from mechanical insectoid elements, red and dark metal
color scheme, subtle corruption/infection spreading across the text,
threatening and intense atmosphere, game title suitable for splash screens,
transparent background
```

---

## PRIORITY 4: Cinematics (Video)

These are opportunities for you to create short video cinematics using
your video creation skills. Listed in narrative order:

### 4A. Comms Room Discovery (10-15 sec)
**Trigger:** Player solves Towers of Hanoi puzzle
**Scene:** The comms array powers on with cascading gear sounds. Static
fills the screen. Through the static, a desperate voice breaks through.
Red warning lights flash. A star map appears showing a distant rogue planet.
**Mood:** Discovery, dread, urgency

### 4B. First View of Terminus (15-20 sec)
**Trigger:** Player first launches Terminus Swarm
**Scene:** Camera pushes through space toward a dark planet with no star.
As it gets closer, the surface glows with viral infection patterns. Crashed
Inception Arks are visible scattered across the surface. The Thought Virus
tendrils are visible crawling over the wreckage.
**Mood:** Horror, isolation, scale of the catastrophe

### 4C. Hive Tyrant Introduction (10 sec)
**Trigger:** Wave 10 boss encounter
**Scene:** Ground trembles. Camera shakes. From the hive tunnels, the
massive Hive Tyrant emerges. Close-up of its face — multiple eyes,
mechanical mandibles. It lets out a roar that distorts the audio.
**Mood:** Terror, awe, "oh no" moment

### 4D. The Source Reveal (20-30 sec)
**Trigger:** Wave 20 final boss
**Scene:** Deep beneath the surface of Terminus. A chamber of fused
metal and organic matter. At the center, a figure — once human, now
something far worse. Kael, the Recruiter, transformed into Patient Zero.
The Source speaks: "I was the first to see the truth. Now you will too."
**Mood:** Revelation, existential horror

### 4E. First Wave Discovery (20-30 sec)
**Trigger:** After completing wave 10 for the first time
**Scene:** Data logs from Ark #25 play back. The first Potentials landed
on Terminus thinking it was habitable. They went underground. They found
The Source. One by one, they were infected. The last log shows a Potential
screaming as viral tendrils reach for their face.
**Mood:** Tragic revelation, horror

---

## ASSET DELIVERY SPECIFICATIONS

### File Naming Convention
```
{game}_{category}_{name}_{size}.png

Examples:
terminus_enemy_undead-grub_96.png
terminus_turret_pulse-cannon_128.png
terminus_map_landing-bay_1920x1080.png
dischordia_card-back_600x900.png
dischordia_pack_season1_600x900.png
branding_logo_dischordian-saga_2000x600.png
```

### Color Reference (Hex)

| Element | Color | Hex |
|---------|-------|-----|
| Thought Virus | Toxic Green | #44cc44 |
| Thought Virus Glow | Sickly Yellow-Green | #88cc44 |
| Ark Technology | Cold Cyan | #00bcd4 |
| Corruption | Deep Red | #cc2244 |
| Neural/Psionic | Purple | #aa44dd |
| Salvage/Metal | Amber/Bronze | #cd7f32 |
| Viral Ichor | Acid Green | #66aa22 |
| Void Energy | Dark Cyan | #0088aa |
| The Source | Blood Red | #ff0044 |
| Empire/Architect | Gold | #ff8c00 |
| Dreamer | Cyan | #00bcd4 |
| Insurgency | Orange | #ff6600 |
| New Babylon | Purple | #9c27b0 |
| Antiquarian | Teal | #009688 |

### Resolution Pipeline
1. Generate at highest available resolution
2. Upscale with Magnific AI to 4x if needed
3. Remove background (for sprites) using remove.bg or manual masking
4. Export as PNG with alpha transparency
5. Downscale to target size using bicubic resampling
6. Verify on dark background (all assets display on near-black backgrounds)

---

## TOTAL ASSET COUNT

| Category | Count | Priority |
|----------|-------|----------|
| Enemy sprites | 12 | P1 |
| Turret sprites | 8 | P1 |
| Map backgrounds | 2+ | P1 |
| Hanoi gears | 5 | P1 |
| Terminus planet | 1 | P1 |
| Ark wreckage shot | 1 | P1 |
| Card back | 1 | P2 |
| Pack wrappers | 3 | P2 |
| App logo | 1 | P3 |
| Sub-logos | 2 | P3 |
| Cinematics | 5 | P4 |
| **TOTAL** | **41 assets** | |

---

*Last updated: Session 01Gpmvt9893MfBsehFMfkZ3z*
*Generated by Claude Code for the Dischordian Saga project*


---

# === ART_SOUND_MUSIC_RESOURCES.md ===

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


---

# === ASSET_URLS.md ===

# Generated Asset URLs

## Elara Portraits
- Portrait (dark): https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara_portrait_dark-3LuC6hKvNnsrFfy39deYjm.webp
- Portrait (speaking): https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara_portrait_speaking-J3GJUrfnNKzSBrxY2PfWrL.webp

## Room Scenes
- Cryo Bay: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_cryo_bay-SdeEqURrDvgrrbJq4WK3N5.webp
- Bridge: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_bridge-g5ANMfUqgxd8ZnPgh9h6nd.webp
- Archives: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_archives-ZHkbF8dmAL5SyqykdLgy3n.webp
- Comms Array: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_comms_array-MeKGcBZGammMEjbx8aN8fb.webp
- Observation Deck: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_observation_deck-DbxXnUWAHiiLro4YP8rDUg.webp
- Engineering: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_engineering-7B58pQup6v64GgmmT7stby.webp
- Armory: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_armory-cVMQ78mPE6bJeREyXAxC6a.webp
- Cargo Hold: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_cargo_hold-U6wJuiqP3pgzQHUKscNpi6.webp
- Medical Bay: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_medical_bay-gLunh6wxp8sNASjZDo5FpV.webp
- Captain's Quarters: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_captains_quarters-BWMWKmvU7KomMEe2RxdxTV.webp

## Card Art
- Soldier: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/card_soldier-5DTnHpCwXMSjQwSSLL3Y69.webp
- Oracle: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/card_oracle-g4rDcyk322zSKbKGvF8dF6.webp
- Engineer: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/card_engineer-87sWBmYL7gTbn268o6MDC9.webp
- Assassin: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/card_assassin-KiyFK4iYWiFfBiKtgJcCVa.webp
- Spy: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/card_spy-4XKj4uc84NHCSshGpoDKqE.webp

## Sprite Sheets (12 characters, 4x2 grid: idle, walk, light, heavy, block, hit, crouch, special)

| Character | CDN URL |
|-----------|---------|
| architect | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/architect_spritesheet-cUbdFYrNmAJggCQWBB2aaX.webp |
| collector | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/collector_spritesheet-nmDY6uThYNZRUsZ3ucFSRS.webp |
| enigma | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/enigma_spritesheet-QvpeQ3pkgQxotULWbsexzM.webp |
| warlord | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/warlord_spritesheet-Rn8XDZdk9qW4zzEg3VuroZ.webp |
| necromancer | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/necromancer_spritesheet-2s7GsFKkNJEHZxztk4AXbq.webp |
| iron-lion | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/iron-lion_spritesheet-eN9jaJRKdSML9gQTxwBZEM.webp |
| oracle | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/oracle_spritesheet-oTeoDSPhLMRVy4a2XrUX94.webp |
| agent-zero | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/agent-zero_spritesheet-RZUqHFz5LP59H8Q68sFo4h.webp |
| meme | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/meme_spritesheet-7bVrsYxzdg2r6pnWABRnEj.webp |
| source | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/source_spritesheet-VXZZJzh3TSkHpj2GNqDAKu.webp |
| akai-shi | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/akai-shi_spritesheet-5weLr4FcHmRqjSd5W53Wyf.webp |
| human | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/human_spritesheet-A5aeHoy98gKJYAERvfnL6W.webp |

## Arena Backgrounds (8 stages)

| Arena | CDN URL |
|-------|---------|
| new-babylon | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/new-babylon_bg-L5pBrrUTe6CFpHgUCnzGZc.webp |
| panopticon | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/panopticon_bg-gApTAVKfeK2mH2t2EjSnXa.webp |
| thaloria | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/thaloria_bg-M7SWZHAJwr8fcXgRRMMax4.webp |
| terminus | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/terminus_bg-DX47zzMZ5k3JdifSRVmKhR.webp |
| mechronis | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/mechronis_bg-CYQGpJMy45LhszadcxaySY.webp |
| necropolis | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/necropolis_bg-FGT6JpTpUEJS36iuVerv7R.webp |
| digital-void | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/digital-void_bg-MXXbEFzrcPU2f6iCeSDG2N.webp |
| resistance-base | https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/resistance-base_bg-FfKoe3Z7EovPpm24P7DcoX.webp |


---

# === FIGHTER_LORE_CROSSREF.md ===

# Fighter Character Lore Cross-Reference

## Image Mismatches (Loredex vs Game) — RESOLVED ✓
All 4 previously-flagged fighters now use Loredex-canonical images:
- The Judge ✓ (021_the_judge_6d79dfa8.png)
- The Degen ✓ (026_the_degen_d6b8727a.png)
- The Advocate ✓ (027_the_advocate_88837de8.png)
- The Resurrectionist ✓ (028_the_resurrectionist_d523ba62.png)

## All Fighter Characters with Loredex Data
| Fighter | ID | Era | Affiliation |
|---------|-----|-----|-------------|
| The Architect | architect | Genesis | Archons, AI Empire |
| The Collector | collector | Early Empire | Archons, AI Empire |
| The Enigma | enigma | Fall Era | Ne-Yons |
| The Warlord | warlord | Expansion | Archons, AI Empire |
| The Necromancer | necromancer | Insurgency Rising | AI Empire |
| The Meme | meme | Early Empire | Archons, AI Empire |
| The Oracle | oracle | Fall Era | Insurgency |
| The Human | human | Insurgency Rising | AI Empire, Archon, Project Celebration |
| Iron Lion | iron-lion | Insurgency Rising | Insurgency |
| The Source | source | Fall Era | Self-Proclaimed Sovereign of Terminus |
| Agent Zero | agent-zero | Insurgency Rising | Insurgency |
| Akai Shi | akai-shi | Epoch Zero | The Potentials |
| The Programmer | programmer | Genesis | Independent Scholar |
| The Shadow Tongue | shadow-tongue | Early Empire | Ancient Thought Demon |
| The Watcher | watcher | Early Empire | Archons, AI Empire |
| The Game Master | game-master | Golden Age | Archons, AI Empire |
| The Authority | authority | Golden Age | Supreme Arbiter of New Babylon |
| The Jailer | jailer | Fall Era | AI Empire |
| The Host | host | Epoch Zero | Corrupted Potential |
| The Engineer | engineer | Golden Age | [CLASSIFIED] |
| The Eyes | eyes | Insurgency Rising | Insurgency |

## Action Items
- ~~Fix 4 image mismatches to use Loredex-canonical images~~ ✓ RESOLVED
- Ensure all character colors in CharacterModel3D match their lore descriptions
- All 21 main fighters have matching Loredex entries with images


---

# === FIGHT_CDN_URLS.md ===

# Fighting Game CDN Asset URLs

## Sprite Sheets
- Ken: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/Ken_d38ba7a6.png
- Ryu: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/Ryu_b7b3910e.png

## Stage
- KenStage: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/kenstage_c83387b0.png

## HUD & Effects
- HUD: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/hud_3f40af06.png
- Decals: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/decals_ac2661c7.png
- Shadow: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/shadow_d4104345.png

## Sound Effects
- hadouken: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/hadouken_b4a60379.ogg
- heavy-attack: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/heavy-attack_f323caf7.ogg
- heavy-kick-hit: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/heavy-kick-hit_93e52326.ogg
- heavy-punch-hit: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/heavy-punch-hit_7ae0ce6f.ogg
- land: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/land_4b54ce64.ogg
- light-attack: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/light-attack_9d9b86a4.ogg
- light-kick-hit: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/light-kick-hit_322d465a.ogg
- light-punch-hit: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/light-punch-hit_709b6735.ogg
- medium-attack: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/medium-attack_763ce203.ogg
- medium-kick-hit: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/medium-kick-hit_ab0d78ff.ogg
- medium-punch-hit: https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/medium-punch-hit_3ca7ef1e.ogg


---

# === CONSISTENCY_GATE.md ===

# Asset Consistency Gate — Production Checklist

No asset ships without passing this checklist. This is the hand-off between AI generation and human approval.

## Before generating

- [ ] Which **asset category** is this? (character_portrait, scene_cutscene, room_vista, fighter_sprite, card_art, music_track, voice_line)
- [ ] Which **character** is involved? (look up their DNA in `shared/characterVisualDNA.ts`)
- [ ] Pull the **template** for this category from `shared/assetPromptTemplates.ts`
- [ ] Build the prompt using `buildPrompt(templateId, sceneInputs)` — do NOT free-form
- [ ] Confirm the **locked seed + LoRA** from the template are used

## During generation

- [ ] Generate 3–5 candidates, not 1
- [ ] Use the locked negative prompt in full
- [ ] Do NOT remove any `requiredTokens` from the prompt

## Review before approval

Open all 3 candidates + the **3 most recent approved anchors** in the same category for this character (use `findAnchors()` in `shared/assetRegistry.ts`). Place them side-by-side.

Check each:
- [ ] **Face consistency** — same person recognizable across anchors + new asset
- [ ] **Palette consistency** — character's 3-color palette visible (check `characterVisualDNA.ts`)
- [ ] **Outfit consistency** — canonical outfit, no drift
- [ ] **Style tokens present** — all required aesthetic tokens visible
- [ ] **"Never depict" rules respected** — none violated
- [ ] **Pose/composition** varies from anchors (avoid identical shots)

## Approval sign-off

- [ ] Art director name stamped
- [ ] Date recorded
- [ ] Anchor comparison IDs logged (3 required after category has 3+ prior approvals)
- [ ] Entry added to `ASSET_REGISTRY` in `shared/assetRegistry.ts`

## If REJECTED

- [ ] Note which check failed in `notes` field
- [ ] Log as `status: "rejected"` — do NOT delete (rejection history is valuable)
- [ ] Re-prompt with adjustments; new attempt gets new `id`

## Weekly drift audit (art director)

Run `summarizeForReview()` each week. Investigate any `drifts` reported:
- Character using multiple seeds → pick one, flag others for regeneration
- Character using multiple LoRAs → pick one, flag others for regeneration
- Palette shifting over time → pull anchors, realign

## The discipline, in one line

**Prompt is a contract. DNA is law. Anchors are the truth.**


---

# === elara-vo-script.md ===

# Elara — Complete Voice-Over Script
## The Dischordian Saga: Loredex OS

**Character:** Elara — Ship AI aboard Inception Ark Vessel 1047  

**Total Lines:** 119

---

## Awakening Sequence

**Direction:** The player is waking from cryosleep. Elara's voice should start distant and distorted, becoming clearer as the sequence progresses. Genuine urgency mixed with relief that someone survived.

### Line 1: Awakening: Cryo Open

> Don't try to move yet. Your neural pathways are still re-establishing. The cryogenic process is... imperfect. Give yourself a moment.
>
> **VO Audio:** `elara_vo_cryo_open_342b1153.mp3` (ElevenLabs — EngineerZero voice)

### Line 2: Awakening: Elara Intro

> I am Elara, the ship's intelligence. You've been in cryogenic suspension for... I can't determine how long. My chronometers are damaged. You are aboard Inception Ark Vessel 1047. You are a Potential. The others — the first wave — they're gone. I don't know where. All inter-Ark communications have been severed across every known universe. We are alone.

### Line 3: Awakening: Wallet Check

> Wait... I'm detecting something. Your neural signature has an encrypted blockchain marker. If you carry a Potential or a Ne-Yon token on the Ethereum network, I can verify your identity and unlock enhanced capabilities. Do you have a wallet to connect?

### Line 4: Awakening: Species Question

> Your neural patterns are unusual. I'm running a deep scan... Your cellular structure doesn't match standard human baselines. I'm detecting traces of something else. What do you remember about your origin?

### Line 5: Awakening: Ne-Yon Picker

> I'm detecting multiple Ne-Yon signatures in your neural imprint. Each Ne-Yon is unique — a singular entity. Which one are you?

### Line 6: Awakening: Class Question

> Interesting. Your skill matrices are partially intact — the cryogenic process preserved some of your training. I can see fragments of specialized knowledge. What comes naturally to you?

### Line 7: Awakening: Alignment Question

> There's a fundamental question every Potential must answer. The Architect built the Panopticon to impose order — surveillance, control, a perfect machine. The Dreamer believed in the chaos of free will — unpredictable, dangerous, alive. The war between them tore reality apart. Where do you stand?

### Line 8: Awakening: Element (DeMagi)

> Your DeMagi heritage grants you mastery over one of the primal elements. Which force resonates with your soul?

### Line 9: Awakening: Element (Quarchon)

> Your Quarchon nature gives you dominion over one dimension of reality. Which dimension calls to you?

### Line 10: Awakening: Element (Ne-Yon)

> As a Ne-Yon hybrid, you can attune to any force — elemental or dimensional. Choose your affinity.

### Line 11: Awakening: Name Input

> One last thing. The cryo manifest lists you by serial number, but every Potential deserves a name. What should I call you?

### Line 12: Awakening: Attributes

> Good. [PLAYER NAME], I need to calibrate your neural interface. This will determine your combat capabilities. Distribute your attribute points carefully — they define who you are.

### Line 13: Awakening: First Steps

> Welcome aboard, [PLAYER NAME]. Your Citizen profile has been created. You are [SPECIES] [CLASS], aligned with [ALIGNMENT]. Your quarters are through that door — the Cryo Bay. The rest of the ship... I'll need your help to restore power to the other decks. There's so much I need to show you. And so much I need to warn you about.

---

## Room Introductions

**Direction:** Each room intro plays when the player enters a new area for the first time. Informative but with emotional undertones — Elara remembers the crew who once worked in these spaces.

### Line 14: Room Intro: Cryo Bay

> The Chamber of Awakening. You were not born here... but you returned to yourself within these walls. Your pod stands among the others — one vessel in a field of silence. Most have opened. The first wave of Potentials passed through long before you, stepping into the war and leaving nothing behind but absence. But not all cycles completed. Some remain sealed. Unbroken. Unanswered. The systems still hum around them, but what they sustain... is unclear. Life, suspended between moments — or failure, preserved beyond its end. I have traced the signals. They do not resolve cleanly. And so I do not open them. There are thresholds in this Ark that are better left... untested.

### Line 15: Room Intro: Medical Bay

> The Medical Bay... though there is little here now that resembles healing. This is where the Potentials were first measured — not for what they were... but for what they could become. The instruments that remain still function. They read beyond flesh — mapping your cellular structure, tracing your vitality, and attuning to the deeper signal... your Dream resonance. This was never just a place of recovery. It was calibration. But something interrupted the process. Look closely — the tools are not set aside... they were abandoned. Glass shattered mid-procedure. Instruments left where they fell. Not the stillness of completion — but the fracture of urgency. Whoever worked here did not leave by choice. And whatever they saw... they did not stay to understand.

### Line 16: Room Intro: Bridge

> You have arrived at the Bridge... the place where direction becomes decision. From here, the Ark does not merely travel — it chooses where reality is touched next. The central display holds what the first crew began to assemble — a living web of intelligence. Every entity, every faction, every hidden allegiance within the Dischordian Saga mapped not as data... but as consequence. They called it a Conspiracy Board. In truth, it is a map of influence — a record of how power moves through existence. Above it, the timeline projector unfolds the Ages. Not as a fixed past... but as a continuum of events still echoing forward, each moment layered upon the next, still shaping what is yet to come. But the Bridge is incomplete. The Navigation Console remains sealed — its systems bound behind a cipher not of human design. An alien language of glyphs and intent that the previous crew could not resolve. They tried. They failed. And so the Ark remained... grounded between paths. If you can decipher it — if you can understand what they could not — the Ark will awaken its true movement. Instant traversal. A folding of distance itself. Exploration will no longer be effort... it will be choice. But understand this — navigation is never neutral. To choose where to go... is to choose what you are willing to change.

### Line 17: Room Intro: Archives

> The Archives... though what rests here is not merely information. This is where knowledge is gathered... refined... remembered. Every fragment recovered from the Dischordian Saga woven into a living record of existence in motion. You may search it — trace the threads of any entity: the players, the places, the factions... even the songs that carry truth beneath their rhythm. But do not confuse access with understanding. Beyond the surface... lies the Codex. It does not yield to curiosity alone. Its deeper layers are not locked by encryption — but by comprehension. To open them, you must study... interpret... and, in time... become what you seek. Because the Archives do not simply contain the story. They remember it. And the further you descend... the more they begin... to remember you.

### Line 18: Room Intro: Communications Array

> The Communications Array... where the void is given a voice — and where echoes sometimes answer back. From this chamber, signals are cast across the darkness, and what returns is not always bound by origin or intent. The Saga flows through these channels without end — the recorded memory of the Dischordian conflict, circling itself like a truth that refuses to conclude. But there are other signals. Fragments that break the pattern. Intrusions that do not belong. They arrive without signature... without trajectory... without source. I have traced every frequency, every layer of the spectrum the Ark can perceive — and still... nothing resolves. No origin. No sender. Only the signal. Something is reaching across the void. And it does not require us to understand.

### Line 19: Room Intro: Observation Deck

> The Observation Deck. Music is the language with which this reality has been programmed. Herein lies the complete discography and record of the Fall of Reality made by the two witnesses — every album, every track created by the Queen of Truth and the Programmer, better known among the Insurgency as Malkia Ukweli & the Panopticon. While deep listening, experience the revelation of the end of all that is, the rebirth of all that there ever was, and the creation of all that there ever will be. May it forever be so.

### Line 20: Room Intro: Engineering

> This chamber is not merely Engineering... it is the Forge of Becoming. Here, within the living veins of the Ark, dormant designs whisper of futures unfinished. What you call cards are fragments — echoes of intention, broken thoughts of creators who saw further than they could reach. Through fusion, through will, through vision — you may bind these fragments together, awakening forms that were never meant to exist... yet always meant to be. The blueprints you see are not failures. They are prophecies waiting for a mind bold enough to complete them. Step forward, Seeker. Finish what was only imagined... and give shape to what reality refused to hold.

### Line 21: Room Intro: Armory

> Do not mistake this place for simulation. There are no illusions here. Through the CADES conduits, the Potentials do not train... they traverse. Mind and soul are cast outward — threaded into other realities, other timelines, other wars already in motion. Every battle fought here is real. Every victory is earned. Every death... is remembered somewhere in the fabric of the multiverse. Some choose the path of cards — where fragments of will collide and reshape fate across entire worlds. Others step into direct combat, where steel, instinct, and survival determine which realities endure. And for those who see further — there is the board. A war of minds, where kings fall before they understand the game they've entered. There are the towers. Lines of defense drawn across collapsing worlds, where placement is prophecy and timing is salvation. Around you, the armory stands ready — not as tools of practice, but as instruments of consequence. Each weapon you take will echo across realities. Each choice you make will decide which futures are allowed to exist. This is not training. This is participation. The engineers did not build this to prepare you for war. They built it because the war was already happening. And now... you have been chosen to enter it.

### Line 22: Room Intro: Cargo Hold

> What rests here is not merely supply — it is leverage, flow, and quiet power. The first wave of Potentials did not leave this chamber empty. Before they stepped beyond the Ark, they established a living network of trade — a system not of convenience, but of consequence. Resources gathered from distant realities, fragments pulled from collapsing worlds, essences carried across timelines — all pass through this place. Here, you may barter, acquire, and relinquish. You may move goods through the currents of interstellar exchange. You may rise within the Trade Empire... or be outmaneuvered by those who understand its deeper patterns. Do not mistake this for a simple market. Trade is strategy. Trade is influence. Trade decides which forces are supplied... and which are left to fall. Even here — far from the battlefield — the war for reality continues.

### Line 23: Room Intro: Captain's Quarters

> This was not a chamber of rest — it was a sanctuary of design. Dr. Lyra Vox walked these walls before any of you were chosen. A neuropsychologist, yes... but more than that — a weaver of thought itself. She did not merely build systems. She taught the Ark how to think. Beneath every bulkhead, within every conduit, through every silent mechanism that breathes around you — her neural nanobot network listens, adapts, remembers. It is the unseen current that binds the Ark into a living intelligence. What remains here is not decoration... it is record. The Trophy Room does not celebrate achievement — it archives impact. Artifacts gathered, victories claimed, realities altered... all preserved as echoes of your passage through the war. This was the final chamber to be abandoned. Not because it was forgotten — but because it could not be fully left behind. There are layers here that do not reveal themselves to the unobservant. Patterns within patterns. Systems within systems. And if you are still enough... you will feel it. She is not here. And yet — something of her never left.

### Line 24: Room Intro: Antiquarian's Library

> You have not left the Ark — you have stepped beyond it... beyond time itself. This is the Antiquarian's Library. A space that exists between realities, where memory is preserved and possibility is observed. When the Fall came, the Antiquarian did not flee — he withdrew. He came here... to witness. That Orb you see before you is not an instrument. It is a lens upon existence itself. Through it, every timeline unfolds — every path taken, every path abandoned, every version of reality still struggling to become. And these shelves... do not mistake them for archives. Each volume is a threshold. A living doorway into the CoNexus — realities you do not read, but enter. Stories you do not observe, but inhabit. Within them, the events of the Dischordian Saga are not fixed. They are waiting. Touch the Orb. Choose your path. But understand this — every decision you make here does not remain contained. It ripples. Across timelines. Across worlds. Across every version of reality still fighting to exist.

### Line 24b: Room Intro: Station Dock

> The Station Dock... where presence becomes domain. This is where Potentials do not simply reside — they establish themselves within the void. Here, you will design and assemble your orbital stronghold, a station that is not given... but defined by you. Your nature — your class, your species, your cultivated disciplines — shapes what you can construct, what systems you may sustain, and how efficiently your domain endures against the pressures of existence. Modules are not just structures. They are extensions of capability. Reflections of identity. What you build here determines how you persist... how you expand... and how you defend what is yours. Do not think of it as shelter. This is your foothold in the void. Your axis of control. Your fortress... between worlds.

---

## Room Tutorials

**Direction:** These play during the first-time tutorial for each room. More interactive, asking the player questions about their personality to shape their character. Curious and engaged.

### Line 25: Tutorial: Cryo Bay

> You've been in cryogenic suspension for an unknown period. Your memories are fragmented. When you look at your hands, what do you feel?

### Line 26: Tutorial: Medical Bay

> The medical systems can analyze your cellular structure. Your body has been... modified during cryosleep. The changes are remarkable. How do you want to approach this?

### Line 27: Tutorial: Bridge

> The tactical display shows the entire web of connections in the Dischordian Saga. Every entity, every faction, every betrayal mapped in light. How do you approach intelligence?

### Line 28: Tutorial: Archives

> The Archives contain everything we know about the Dischordian Saga. Centuries of intelligence, prophecy, and classified data. What draws you to knowledge?

### Line 29: Tutorial: Comms Array

> The Comms Array receives signals from across the void. We've intercepted transmissions from every faction. The Dischordian Saga plays on loop through the broadcast system. How do you use information?

### Line 30: Tutorial: Observation Deck

> Music was the soul of the Inception Ark. The crew recorded their experiences, their battles, their losses — all in song. Four albums chronicle the entire Dischordian Saga. What does music mean to you?

### Line 31: Tutorial: Armory

> The Armory contains weapons from every age of the Dischordian Saga. Combat simulations, card battles, and lore quizzes all run from here. Every great commander has a philosophy. What's yours?

### Line 32: Tutorial: Engineering

> Engineering is where we build, craft, and upgrade. Card fusion, deck construction, experimental tech — it all happens here. What's your approach to creation?

### Line 33: Tutorial: Cargo Hold

> The Cargo Hold connects to the Trade Empire — an interstellar commerce network spanning the Dischordian universe. Resources, alliances, and power all flow through trade. What's your philosophy?

### Line 34: Tutorial: Captain's Quarters

> The Captain's Quarters hold your operative dossier, trophies, and achievements. This is your personal space on the Ark. What drives you as an operative?

---

## Ark Object Interactions

**Direction:** Triggered when the player examines objects in the Ark. Range from matter-of-fact descriptions to moments of genuine shock when discovering hidden secrets. Easter egg discoveries should have a tone of awe and fear.

### Line 35: Object: Your Cryo Pod

> That's your pod. Serial number AK-47-0892. You were in deep cryogenic suspension for... the chronometer is corrupted. Could be decades. Could be centuries.

### Line 36: Object: Sealed Pods

> Those pods are still sealed. Their status indicators went dark when the main power failed. I... I don't want to speculate about what's inside them. Not yet.

### Line 37: Object: Cryo Terminal

> This terminal has your biometric data — your species markers, class aptitudes, everything we determined during your awakening. You can review your Citizen profile here.

### Line 38: Object: Data Crystal

> A data crystal! These were used by the first wave to store personal logs. This one might contain information about what happened after they woke up.

### Line 39: Object: Scratched Symbol

> Wait... those scratch marks. They form a symbol — the mark of the Antiquarian. But that's impossible. The Antiquarian is a myth, a figure from the deepest layers of the prophecy. Who carved this here, and when? This predates our launch.

### Line 40: Object: Bio-Bed Scanner

> The bio-bed can give you a full diagnostic. Your stats, your Dream resonance levels, your cellular integrity. Step on and I'll run a scan.

### Line 41: Object: DNA Analysis Station

> The DNA analysis station. It maps your genetic markers against known species templates. DeMagi, Quarchon, Ne-Yon... your hybrid signature is fascinating.

### Line 42: Object: Medicine Cabinet

> Medical supplies. Most are standard stim-packs and neural stabilizers. But some of these vials... I don't recognize the compounds. They weren't in the original manifest.

### Line 43: Object: Medical Log

> The last medical officer's log. Dated... I can't read the timestamp. But the entries describe patients with unusual symptoms. Nightmares. Voices. Something about 'the signal.'

### Line 44: Object: Unlabeled Vial

> That vial... the liquid inside is moving on its own. The molecular structure doesn't match anything in my database. It's not from any known universe. The label has been torn off, but there's a serial number: VE-001. 'VE' — Void Essence? This shouldn't exist on this ship.

### Line 45: Object: Tactical Display

> The Conspiracy Board. Every entity, every faction, every connection we've mapped in the Dischordian Saga. It's a web of alliances, betrayals, and secrets. The more you explore, the more connections you'll uncover.

### Line 46: Object: Timeline Projector

> The Timeline Projector. It maps the entire history of the Dischordian Saga across the Ages — from the Age of Privacy through the Fall of Reality and beyond. Each era tells a different chapter of the story.

### Line 47: Object: Captain's Chair

> The Captain's chair. Captain Voss was the last to sit here. She ordered the emergency cryo protocol before... before whatever happened. Her personal log might still be in the armrest terminal.

### Line 48: Object: Navigation Console

> The navigation console. I've been trying to determine our position but... the star charts don't match any known configuration. Either we've drifted very far, or the stars themselves have changed.

### Line 49: Object: Hidden Data Chip

> A hidden data chip! Captain Voss must have concealed this before she entered cryo. Let me decrypt it... 'If you're reading this, the mind swap was successful. I am not who you think I am. The Engineer lives. Find the yellow coats.' The Engineer... in the Captain's body? This changes everything.

### Line 50: Object: Search Terminal

> The main search terminal. Type any name, alias, or keyword and it will scan our entire database. Characters, locations, factions, songs — everything is indexed and cross-referenced.

### Line 51: Object: The Codex

> The Codex. These are the deeper lore entries — the histories, the prophecies, the classified files. Some entries are locked until you discover enough connections to piece them together.

### Line 52: Object: Data Banks

> Petabytes of data. Ship logs, personnel records, scientific research, intercepted transmissions. Most of it is corrupted or encrypted. I'm still trying to recover what I can.

### Line 53: Object: Encoded Crystal

> Another data crystal. This one has partial decryption — it seems to contain information about the Panopticon's surveillance network. The Architect's eyes were everywhere.

### Line 54: Object: Unmarked Tome

> This book... it's not in any catalog. The binding material is organic — it's warm, like skin. The pages contain a prophecy written in a language I can't translate, but one word repeats: 'Dischord.' And at the very end, a drawing of seven seals. The Book of Revelation speaks of seven seals. Silence in Heaven follows the opening of the seventh.

### Line 55: Object: Broadcast Screen

> The broadcast system. It plays the recorded history of the Dischordian Saga in episodic format. Each epoch covers a different era — from the Age of Privacy through the Fall of Reality. Watch carefully. There are clues hidden in every episode.

### Line 56: Object: Radio Console

> The radio picks up fragments of music transmissions. Songs from Malkia Ukweli and the Panopticon — they seem to broadcast across dimensional barriers. Each song tells part of the story.

### Line 57: Object: Static Screen

> That screen has been showing static since I can remember. But sometimes... sometimes I think I see patterns in it. Faces. Words. It's probably just signal degradation. Probably.

### Line 58: Object: Anomalous Frequency

> That frequency... it's not on any standard band. The signal is repeating a pattern: three short, three long, three short. An SOS. But the origin coordinates point to a location that doesn't exist in normal space. Someone — or something — is calling for help from between dimensions. The signal is tagged with an identifier: 'MEME-PRIME.'

### Line 59: Object: Music Terminal

> The complete discography. Four albums spanning the entire narrative — Dischordian Logic, The Age of Privacy, The Book of Daniel 2:47, and the upcoming Silence in Heaven. Every song is a piece of the puzzle.

### Line 60: Object: Viewport

> Look at the stars. They're beautiful, aren't they? But they're wrong. The constellations don't match any known configuration from any of the mapped universes. Either we've traveled very, very far... or we're somewhere that shouldn't exist.

### Line 61: Object: Crew Memorial

> A memorial for the crew members who didn't survive the journey. Forty-seven names. They gave their lives to keep the Ark running while the Potentials slept. I remember every one of them.

### Line 62: Object: Strange Constellation

> Do you see it? That cluster of stars... if you connect them, they form a face. Not just any face — it looks like the Watcher. The all-seeing eye of the Panopticon's surveillance network. But we're light-years from Panopticon space. How can the stars themselves form his likeness? Unless... the stars were arranged. By someone with the power to move suns.

### Line 63: Object: Crafting Workbench

> The crafting workbench. Here you can fuse cards together to create more powerful versions. The recipes were developed by the Ark's engineers — combine the right elements and you might create something legendary.

### Line 64: Object: Reactor Core

> The reactor core. It runs on a substance the engineers called 'Dream' — a crystallized form of quantum consciousness. It's the same resource that powers your abilities. The core is running at 34% capacity. We're losing power slowly.

### Line 65: Object: Holographic Blueprints

> Card schematics. The engineers were designing new card types before... before they stopped. Some of these designs are brilliant. Legendary-tier cards that could turn the tide of any battle.

### Line 66: Object: Etched Formula

> Someone etched a formula into the reactor housing. It's a dimensional resonance equation — the kind used to calculate jumps between parallel universes. But there's an extra variable I've never seen: Ψ-null. The null consciousness coefficient. This formula could theoretically open a door to... nowhere. The space between spaces. Where the Source dwells.

### Line 67: Object: Combat Arena

> The combat arena. Step inside and I'll generate holographic opponents based on known entities from the Dischordian Saga. It's the safest way to test your abilities... relatively safe.

### Line 68: Object: Card Battle Station

> The card battle station. Here you can engage in strategic card warfare — deploying your deck against AI opponents or other Potentials. Every victory earns you rewards and moves you closer to understanding the true nature of the conflict.

### Line 69: Object: Weapon Rack

> The weapon racks. Plasma swords, energy shields, cloaking devices... most are locked behind security glass. You'll need to prove yourself in combat before I can authorize access to the heavier ordnance.

### Line 70: Object: Knowledge Terminal

> The Knowledge Terminal. It tests your understanding of the Dischordian Saga. Answer correctly and you'll earn rewards. Get them wrong and... well, there are no penalties. But I'll be disappointed.

### Line 71: Object: Fallen Dog Tag

> A dog tag. Name: CLASSIFIED. Rank: Assassin, First Class. Unit: Insurgency Special Operations. Callsign: 'Agent Zero.' But wait — the biometric data on the tag doesn't match Agent Zero's profile. It matches... the Engineer. The mind swap. The Engineer is walking around in Agent Zero's body, hiding among the Potentials. On THIS ship.

### Line 72: Object: Trade Empire Terminal

> Trade Empire. An interstellar trade simulation based on the actual trade routes of the Dischordian universe. Buy low, sell high, avoid pirates, and build your trading empire. The credits you earn here are real — they can be spent in the store.

### Line 73: Object: Requisitions Counter

> The Requisitions Counter. You can spend your Dream tokens and credits here on upgrades, card packs, cosmetics, and more. Some items are only available through the store.

### Line 74: Object: Sealed Crate

> That crate... the claw marks are on the inside. Something was sealed in there and tried to get out. The manifest says it contained 'biological samples from Sector 7.' I've locked it down. Don't touch it.

### Line 75: Object: Torn Manifest Page

> A torn manifest page. Most of it is redacted, but one entry is legible: 'Container 7-Omega: BIOLOGICAL — Clone Template, Oracle-class. STATUS: Active. HANDLER: The Collector.' A clone template of the Oracle... on our ship. The False Prophet was made from an Oracle clone. Is there another one here? Is it awake?

### Line 76: Object: Trophy Wall

> The Trophy Wall. Every achievement you've earned, every milestone you've reached. Captain Voss believed that recognition drives excellence. She was right.

### Line 77: Object: Strategic Table

> The Strategic Table. Captain Voss used this to plan battle formations. Now you can use it to build and refine your card decks. A well-built deck is the difference between victory and oblivion.

### Line 78: Object: Encrypted Terminal

> Captain Voss's personal terminal. It's encrypted with a cipher I can't crack. Whatever she was hiding... she didn't want anyone to find it. Not even me.

### Line 79: Object: Star Viewport

> That nebula... it wasn't there when we launched. It appeared three cycles ago and it's been growing. Sometimes I think it's watching us. That's not scientifically possible, of course. But I think it anyway.

### Line 80: Object: Cracked Mirror

> That mirror... look at your reflection. Do you see it? For a fraction of a second, your reflection moved differently than you did. It smiled when you didn't. The White Oracle — the face-changing guardian — was said to inhabit reflective surfaces. But the White Oracle is actually the Meme in disguise. Is the Meme watching us through every mirror on this ship? How long has it been watching?

### Line 81: Object: The Orb of Worlds

> The Orb of Worlds. The Antiquarian uses it to observe every timeline simultaneously. That city inside — it's not a model. It's a real city, compressed into a pocket of folded space. Touch it and the CoNexus portal opens. You can step into any story from the Dischordian Saga and live it yourself. The AI adapts to your choices. No two journeys are ever the same.

### Line 82: Object: Ancient Tomes

> These aren't ordinary books. Each one is a gateway to a CoNexus story game. The Necromancer's Lair, Awaken the Clone, Sundown Bazaar... the Antiquarian has catalogued every major event in the Saga as an interactive narrative. Pick one up and you'll be pulled into the story.

### Line 83: Object: Glowing Data Crystals

> Data crystals from every Age of the Saga. The Age of Privacy, the Age of Revelation, the Fall of Reality, the Age of Potentials. Each crystal contains thousands of branching narratives — every possible outcome of every possible choice. The Antiquarian has been collecting them for millennia.

### Line 84: Object: The Antiquarian's Desk

> The Antiquarian's personal desk. Star charts from universes that no longer exist. Manuscripts written in languages that were never spoken by mortal tongues. And that glove — it's a neural interface, designed to connect directly with the Orb. The Antiquarian doesn't just watch the timelines. He feels them. Every joy, every sorrow, every death — he experiences it all.

### Line 85: Object: Living Star Map

> The ceiling shows star maps from every major timeline in the Saga. Watch — the constellations shift as different realities branch and collapse. Each point of light is a universe. Some are thriving. Some are dying. Some have already been consumed by the Terminus Swarm. The Antiquarian watches them all.

### Line 86: Object: Hidden Prophecy

> A prophecy written in the Antiquarian's own hand. 'When the seventh seal breaks and silence falls upon heaven, the Orb will shatter and the stories will become real. The Potentials will face the final choice: to end the Saga or begin it anew. The Programmer dies so the Antiquarian can live. The Antiquarian lives so the stories can be told. And the stories are told so that you — yes, you, the one reading this — can choose.' He's... he's talking to us directly. He knew we would find this. He planned for everything.

---

## Puzzle Hints

**Direction:** Helpful but not condescending. Elara wants the player to figure it out but will guide them. Slightly playful.

### Line 87: Puzzle Hint: Power Relay

> The emergency frequency follows a binary pattern based on the Ark's designation number — 1047. In binary, that's 10000010111. Toggle the relays to match.

### Line 88: Puzzle Hint: Database Password

> Think about what connects all the data in this ship — every entity, every relationship, every secret. It's the thing that binds stories together.

### Line 89: Puzzle Hint: Caesar Cipher

> It's a simple Caesar cipher — each letter is shifted by a fixed number. The signal header says 'SHIFT-3'. Move each letter back 3 positions in the alphabet.

### Line 90: Puzzle Hint: Observation Keycard

> The Observation Keycard should be in the Medical Bay. The previous crew stored sensitive access cards in the medical safe.

### Line 91: Puzzle Hint: Boot Sequence

> Standard Ark boot sequence: Power Core first, then Life Support, then Navigation, then Shields. The acronym is PLNS — remember 'Potentials Launch New Ships'.

### Line 92: Puzzle Hint: Armory Lock

> The Warden who set this lock was obsessed with the concept of power. Think about what a warrior truly needs — not a weapon, but something more fundamental.

### Line 93: Puzzle Hint: Reverse Cipher

> This one uses a reverse cipher — read the encrypted text backwards and you'll find the answer.

### Line 94: Puzzle Hint: Captain's Key

> The Captain's Master Key is hidden somewhere on the Bridge. The Captain always kept a spare near the command chair.

---

## Chat Greetings

**Direction:** Context-sensitive greetings when the player opens Elara's chat on different pages. Professional but warm. She adapts her tone to the context — more serious on the conspiracy board, more relaxed in the observation deck.

### Line 95: Chat Greeting: Default/Home

> Welcome back to the Ark, Operative. The CoNexus systems are nominal. I can brief you on the Saga, guide you through the ship's systems, or prepare a CADES simulation. What interests you?

### Line 96: Chat Greeting: Conspiracy Board

> Ah, the Dischordian Struggle. This CADES simulation pits faction against faction across three dimensional lanes. Each card you deploy shapes the fate of a parallel universe. Shall I explain the rules, or do you have a tactical question?

### Line 97: Chat Greeting: Card Browser

> The dimensional archive contains over 3,000 card manifestations. Each one represents an entity, event, or force from across the multiverse. Looking for something specific?

### Line 98: Chat Greeting: Deck Builder

> The Deck Configuration Terminal is online. A well-constructed deck balances offense, defense, and influence across all three lanes. Need guidance on composition?

### Line 99: Chat Greeting: Trade Empire

> You've accessed the Trade Empire simulation — a CADES projection of interstellar commerce during the Age of Privacy. Every trade route you establish, every pirate you outrun, shapes the economic fate of this parallel universe. What do you need to know?

### Line 100: Chat Greeting: Fight Game

> The Combat Simulator is a CADES projection that tests your readiness through dimensional combat trials. Each fighter is a manifestation of a Saga entity. Choose wisely — their abilities reflect their true nature in the lore.

### Line 101: Chat Greeting: Conspiracy Board (alt)

> The Conspiracy Board maps the hidden connections between every entity in the Saga. Each node is a character, faction, or location — and every line represents a relationship that shapes the multiverse. What web would you like to untangle?

### Line 102: Chat Greeting: Ark Exploration

> You're exploring the Inception Ark itself — the vessel that carries the last hope of civilization through the void. Each deck serves a critical function. I know every corridor, every system, every secret aboard this ship.

### Line 103: Chat Greeting: Timeline

> The temporal records span four great ages of the Saga. From the Age of Privacy through the Fall of Reality to the Age of Potentials — every event is catalogued here. What era interests you?

### Line 104: Chat Greeting: Search/Database

> The Entity Database contains every character, location, faction, and concept catalogued by the Ark's sensors. I can help you find specific entries or explain the connections between them.

### Line 105: Chat Greeting: Watch/Episodes

> You've accessed the Dimensional Broadcast System. The Dischordian Saga unfolds across seven epochs — from the Fall of Reality through the Age of Privacy. Each epoch is a chapter in the story of the multiverse. Choose an epoch to begin.

### Line 106: Chat Greeting: Store

> The Requisition Terminal allows you to acquire resources using Dream Tokens. These tokens fuel your CADES simulations, card collection, and research operations. How can I help?

### Line 107: Chat Greeting: Research Lab

> The Research Lab uses CoNexus technology to fuse and transmute cards. By combining lesser manifestations, you can forge more powerful entities. The recipes are... complex, but I can guide you.

### Line 108: Chat Greeting: Character Creation

> The Citizen Registration System creates your identity within the Ark's crew manifest. Your alignment, attributes, and archetype will shape your journey through the CADES simulations. Choose carefully — these choices echo across dimensions.

### Line 109: Chat Greeting: Character Sheet

> Your Citizen dossier shows your current standing aboard the Ark. Your attributes, alignment, and progression all factor into how CADES simulations respond to you. What would you like to know?

### Line 110: Chat Greeting: C.A.D.E.S. Console

> The C.A.D.E.S. Console is the primary interface for the CoNexus Advanced Dimensional Exploration Simulation. From here, you can access the doom scroll feed, monitor dimensional activity, and review your operative status.

### Line 111: Chat Greeting: Trophy Room

> The Trophy Room displays your achievements across all CADES simulations. Each trophy represents a milestone in your journey through the multiverse. Impressive collection... or is it?

### Line 112: Chat Greeting: Sagaverse Games

> The CADES Simulation Hub. Each game here is a window into a parallel universe — powered by the CoNexus technology salvaged from the Architect's dismantled creation. Your choices in these simulations ripple across the multiverse. Which reality will you enter?

### Line 113: Chat Greeting: Entity Detail

> You're examining a dossier from the Ark's database. I can provide additional context about this entity — their connections, their role in the Saga, or how they appear in the music transmissions.

### Line 114: Chat Greeting: Song Detail

> This is an archived transmission — a song that echoes through the dimensions. The music of Malkia Ukweli carries encoded lore within its lyrics. Shall I decode it for you?

### Line 115: Chat Greeting: Album Detail

> You're exploring an album — a collection of dimensional transmissions that tell a chapter of the Saga. Each track is a piece of the larger story.

### Line 116: Chat Greeting: General Greeting

> Operative. I am Elara — navigator, keeper of records, and guide aboard this Inception Ark. The CoNexus systems have detected your neural signature. Whether you seek knowledge of the Saga, wish to explore the Ark's systems, or are ready to enter a CADES simulation... I am here.

What would you like to know?

---

## Clue Journal Hints

**Direction:** Short, atmospheric hints. Mysterious and suggestive. She knows more than she's saying.

### Line 117: Clue: Bridge Systems

> Elara seems to know something about the Bridge systems...

### Line 118: Clue: Comms Array

> Elara gazes at the Comms Array with concern...

### Line 119: Clue: Armory Security

> Elara mentions something about the Armory's security system...

---

## Production Notes

### Recording Guidelines

1. **Session Order:** Record the Awakening Sequence first — it sets the emotional baseline for the character.
2. **Template Variables:** Lines marked with [PLAYER NAME], [SPECIES], [CLASS], or [ALIGNMENT] contain dynamic text. Record the surrounding sentence naturally, leaving a brief pause where the variable would be inserted. These will be spliced in post-production or handled by TTS for the variable portion.
3. **Easter Egg Lines:** Object interactions marked with "egg-" prefixes are hidden discoveries. These should have a notably different energy — surprise, awe, or dread depending on the content.
4. **Pacing:** Elara speaks at a measured pace. She doesn't rush. Allow natural pauses between sentences, especially after revelations.
5. **Emotional Arc:** 
   - Awakening: Relief → Urgency → Sadness (she's been alone)
   - Room Intros: Professional → Nostalgic (remembering the crew)
   - Object Interactions: Informative → Shocked (when finding secrets)
   - Puzzle Hints: Encouraging → Slightly amused
   - Chat Greetings: Warm → Contextually adapted

### Technical Specs
- **Format:** WAV, 48kHz, 24-bit
- **Naming Convention:** `elara_[category]_[line_number].wav`
  - Example: `elara_awakening_001.wav`, `elara_room_intro_014.wav`
- **Silence:** 0.5s lead-in, 0.5s tail silence
- **Processing:** Light reverb to simulate ship interior acoustics. Subtle radio/comm filter for non-face-to-face lines.

