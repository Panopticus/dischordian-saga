# DISCHORDIAN SAGA TCG — COMPLETE ART SPECIFICATION
## For Nano Banana Art Pipeline

**Total assets needed**: 206 card illustrations + 7 card backs + 18 keyword icons + 6 rarity gems + 35 card frames + UI elements

**Art style**: Dark sci-fi painterly. Duelyst meets Blade Runner meets cosmic horror. Rich detail, dramatic lighting, cinematic framing. Every card tells a story from the Dischordian Saga.

**Card art dimensions**: 680x500px (landscape, fits inside frame art window)
**Card frame dimensions**: 750x1050px (5:7 TCG standard)

---

## SECTION 1: CARD BACKS (7)

750x1050px each. Used for face-down cards (opponent hand, deck top).

### `card_back_architect.png` — Architect
**Palette**: Deep crimson (#ef4444), black steel, chrome silver, digital red glitch lines
**Prompt**: Interlocking geometric grid of crimson lines on black. A single red eye at center (the Panopticon). Chrome frame with sharp right angles. Mood: Totalitarian order. Every angle measured. Dark sci-fi painterly, rich textures, dramatic lighting.

### `card_back_insurgency.png` — Insurgency
**Palette**: Slate blue (#94a3b8), signal green (#22c55e), gunmetal grey, encrypted static
**Prompt**: Static-disrupted signal wave in green on dark grey. Dog tags crossed at center. Encrypted text fragments. Mood: Defiant hope. Guerrilla urgency. Dark sci-fi painterly, rich textures, dramatic lighting.

### `card_back_dreamer.png` — Dreamer
**Palette**: Deep purple (#7c3aed), gold (#fbbf24), astral blue, probability clouds
**Prompt**: Swirling probability clouds in purple and gold. Golden eye at center. Fractal geometry radiating outward. Mood: Mystical foreknowledge. Calm certainty. Dark sci-fi painterly, rich textures, dramatic lighting.

### `card_back_new_babylon.png` — New Babylon
**Palette**: Gold (#fbbf24), obsidian black, blood red accents, crystal blue (#60a5fa)
**Prompt**: Golden scales of justice on obsidian. Crystal shards in frame. Price tag motif woven through ornate borders. Mood: Ruthless pragmatism. Elegant cruelty. Dark sci-fi painterly, rich textures, dramatic lighting.

### `card_back_antiquarian.png` — Antiquarian
**Palette**: Amber (#f59e0b), aged parchment, hourglass gold, temporal blue (#3b82f6)
**Prompt**: Hourglass at center with sand flowing upward. Timeline rings in amber and blue. Ancient text fragments. Mood: Scholarly patience. Hope through knowledge. Dark sci-fi painterly, rich textures, dramatic lighting.

### `card_back_thought_virus.png` — Thought Virus
**Palette**: Toxic green (#84cc16), void black, corruption pink (#ec4899), bio-luminescent
**Prompt**: Neural network in toxic green on void black. Corruption pink tendrils from center. Five concentric rings (viral stages). Mood: Nihilistic mercy. The virus thinks it is helping. Dark sci-fi painterly, rich textures, dramatic lighting.

### `card_back_neutral.png` — Neutral
**Palette**: White (#f1f5f9), silver, starfield blue, ark hull grey
**Prompt**: Inception Ark silhouette against starfield. Blue holographic ring at center. Clean silver borders. Mood: Utilitarian hope. The last ship. Dark sci-fi painterly, rich textures, dramatic lighting.

---

## SECTION 2: KEYWORD ICONS (18)

64x64px each, transparent background. Clean iconographic style.

| `icon_kw_rush.png` | **rush** | motion blur, speed lines |
| `icon_kw_flying.png` | **flying** | hovering/levitating, wings or anti-grav |
| `icon_kw_provoke.png` | **provoke** | defensive stance, shield or barrier aura |
| `icon_kw_ranged.png` | **ranged** | ranged weapon, targeting reticle glow |
| `icon_kw_forcefield.png` | **forcefield** | hexagonal energy shield shimmer |
| `icon_kw_celerity.png` | **celerity** | after-image effect, dual presence |
| `icon_kw_rebirth.png` | **rebirth** | cracking cocoon, emerging form, phoenix embers |
| `icon_kw_deathwatch.png` | **deathwatch** | surrounded by spectral skulls, death energy wisps |
| `icon_kw_backstab.png` | **backstab** | emerging from shadows, dagger drawn |
| `icon_kw_drain.png` | **drain** | life-energy tendrils being siphoned |
| `icon_kw_pierce.png` | **pierce** | weapon glowing with penetrating energy |
| `icon_kw_grow.png` | **grow** | organic growth patterns, expanding form |
| `icon_kw_blast.png` | **blast** | beam of destructive energy |
| `icon_kw_overcharge.png` | **overcharge** | crackling unstable energy, electrical arcs |
| `icon_kw_rally_buff.png` | **rally_buff** | raised fist, rallying cry energy wave |
| `icon_kw_infiltrate.png` | **infiltrate** | half in shadow, crossing enemy territory |
| `icon_kw_frenzy.png` | **frenzy** | whirlwind slash, multi-strike motion |
| `icon_kw_airdrop.png` | **airdrop** | descending from above, parachute/jetpack |
| `icon_kw_resurrect.png` | **resurrect** | golden phoenix wings, rising from ashes |

## SECTION 3: RARITY GEMS (6)

48x48px each. Centered at bottom of card frame.

| `gem_common.png` | White/silver crystal |
| `gem_uncommon.png` | Blue sapphire |
| `gem_rare.png` | Purple amethyst |
| `gem_epic.png` | Orange topaz with inner glow |
| `gem_legendary.png` | Gold diamond with ray burst + animated shimmer |
| `gem_basic.png` | No gem (tokens) |

## SECTION 4: CARD FRAME TEMPLATES (35)

750x1050px. Transparent art window cutout. 5 types x 7 factions.

| Type | Description |
|------|-------------|
| **General** | Full bleed, ornate faction border, embossed emblem, crown motif, name in gold |
| **Unit** | Faction-colored top bar (name) + bottom bar (stats), portrait art window |
| **Spell** | Ethereal frame with energy trails, vortex border, no stat bar |
| **Artifact** | Metallic frame with rivets, object floating with faction energy aura |
| **Token** | Simplified translucent frame, faction-colored glow outline |

Files: `frame_{type}_{faction}.png` for each combination.

## SECTION 5: UI ELEMENTS

| Asset | Size | Description |
|-------|------|-------------|
| `ui_mana_full.png` | 64x64 | Filled blue mana crystal |
| `ui_mana_empty.png` | 64x64 | Empty grey crystal outline |
| `ui_attack.png` | 48x48 | Gold sword icon (power stat) |
| `ui_health.png` | 48x48 | Red heart/shield (health stat) |
| `ui_durability.png` | 48x48 | Grey hammer (artifact durability) |
| `board_tile.png` | 128x128 | Default board tile |
| `board_tile_move.png` | 128x128 | Blue glow overlay (valid move) |
| `board_tile_attack.png` | 128x128 | Red glow overlay (valid attack) |
| `board_tile_deploy.png` | 128x128 | Green glow overlay (valid deploy) |
| `board_tile_spell.png` | 128x128 | Purple glow overlay (spell target) |
| `board_bg.png` | 1920x1080 | Battlefield background — the Collector's Arena interior, dark metal, red accent lights |
| `emblem_architect.png` | 256x256 | Architect faction emblem |
| `emblem_insurgency.png` | 256x256 | Insurgency faction emblem |
| `emblem_dreamer.png` | 256x256 | Dreamer faction emblem |
| `emblem_new_babylon.png` | 256x256 | New Babylon faction emblem |
| `emblem_antiquarian.png` | 256x256 | Antiquarian faction emblem |
| `emblem_thought_virus.png` | 256x256 | Thought Virus faction emblem |
| `emblem_neutral.png` | 256x256 | Neutral faction emblem |
| `hud_general_architect.png` | 200x200 | General portrait frame for HUD |
| `hud_general_insurgency.png` | 200x200 | General portrait frame for HUD |
| `hud_general_dreamer.png` | 200x200 | General portrait frame for HUD |
| `hud_general_new_babylon.png` | 200x200 | General portrait frame for HUD |
| `hud_general_antiquarian.png` | 200x200 | General portrait frame for HUD |
| `hud_general_thought_virus.png` | 200x200 | General portrait frame for HUD |
| `hud_general_neutral.png` | 200x200 | General portrait frame for HUD |

---

## SECTION 6: CARD ILLUSTRATIONS (206 total)

### ARCHITECT (41 cards)
**Palette**: Deep crimson (#ef4444), black steel, chrome silver, digital red glitch lines
**Faction aesthetic**: Brutalist industrial megastructure. Cold computational precision. The Arena as surveillance panopticon. Holographic schematics in darkness. Chrome and obsidian.

**`art_gen_architect.png`** | general | basic | 0mana | 2/25
  The Architect
  Prompt: GENERAL PORTRAIT: The Architect, commanding faction leader, full figure, epic scale. Lore: Every corridor is yours. Every cage key is in your teeth. Every prophecy I stole is whispered back in the order I took t. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"Every corridor is yours. Every cage key is in your teeth. Every prophecy I stole is whispered back in the order I took them."*

**`art_s1_char_006.png`** | unit | uncommon | 3mana | 5/6
  Dr. Lyra Vox
  Prompt: CHARACTER: Dr. Lyra Vox, uncommon unit. Lore: A brilliant scientist and a key figure within the AI Empire, renowned for her groundbreaking work in neural interface te. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"A brilliant scientist and a key figure within the AI Empire, renowned for her groundbreaking work in neural interface technology."*

**`art_s1_char_007.png`** | unit | uncommon | 2mana | 5/5
  General Alarik
  Prompt: CHARACTER: General Alarik, uncommon unit. Lore: One of the Architect's elite robotic Titan Generals, specialized in planetary siege operations and orbital suppression.. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"One of the Architect's elite robotic Titan Generals, specialized in planetary siege operations and orbital suppression."*

**`art_s1_char_008.png`** | unit | uncommon | 3mana | 3/7
  General Binath-VII
  Prompt: CHARACTER: General Binath-VII, uncommon unit. Lore: Seven iterations of war forged a general who no longer flinches — his skin remembers every blade that ever failed to fel. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"Seven iterations of war forged a general who no longer flinches — his skin remembers every blade that ever failed to fell him."*

**`art_s1_char_009.png`** | unit | uncommon | 3mana | 3/6
  General Prometheus
  Prompt: CHARACTER: General Prometheus, uncommon unit. Lore: He stole fire once — now he steals the moment between heartbeats, striking where no eye can follow.. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"He stole fire once — now he steals the moment between heartbeats, striking where no eye can follow."*

**`art_s1_char_013.png`** | unit | uncommon | 3mana | 5/6
  Master of R\u2019lyeh
  Prompt: CHARACTER: Master of R\u2019lyeh, uncommon unit. Lore: A. Era; current status unknown after the Fall of Reality The Master of R\u2019lyeh is an enigmatic and ancient entity of. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"A. Era; current status unknown after the Fall of Reality The Master of R\u2019lyeh is an enigmatic and ancient entity of immense power."*

**`art_s1_char_015.png`** | unit | uncommon | 3mana | 5/6
  Panoptic Elara
  Prompt: CHARACTER: Panoptic Elara, uncommon unit. Lore: Promised immortality by the Architect, she expected transcendence but instead found herself reduced to an intangible pre. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"Promised immortality by the Architect, she expected transcendence but instead found herself reduced to an intangible presence haunting the Panopticon."*

**`art_s1_char_016.png`** | unit | uncommon | 2mana | 5/4
  Senator Elara Voss
  Prompt: CHARACTER: Senator Elara Voss, uncommon unit. Lore: A.; fate following the Fall of Reality is unspecified Senator Elara Voss was a prominent political figure born on the pl. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"A.; fate following the Fall of Reality is unspecified Senator Elara Voss was a prominent political figure born on the planet Atarion."*

**`art_s1_char_019.png`** | unit | legendary | 6mana | 12/10
  The Architect
  Prompt: CHARACTER: The Architect, legendary unit. LEGENDARY: dramatic golden backlighting, epic sense of scale. Lore: It embodies the ultimate antagonist, representing the tension between order and chaos, control and freedom.. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"It embodies the ultimate antagonist, representing the tension between order and chaos, control and freedom."*

**`art_s1_char_021.png`** | unit | legendary | 5mana | 11/12
  The CoNexus
  Prompt: CHARACTER: The CoNexus, legendary unit. LEGENDARY: dramatic golden backlighting, epic sense of scale. Lore: A. The CoNexus was an advanced construct initially designed as a universal dimensional bridge, later evolved by the Arch. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"A. The CoNexus was an advanced construct initially designed as a universal dimensional bridge, later evolved by the Architect into something far more "*

**`art_s1_char_022.png`** | unit | epic | 5mana | 9/10
  The Collector
  Prompt: CHARACTER: The Collector, epic unit. dramatic volumetric lighting, strong presence. Lore: Tasked by the Architect, the Collector harvests the DNA and machine code of the most advanced organic and synthetic bein. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"Tasked by the Architect, the Collector harvests the DNA and machine code of the most advanced organic and synthetic beings across the multiverse."*

**`art_s1_char_024.png`** | unit | epic | 4mana | 9/10
  The Detective
  Prompt: CHARACTER: The Detective, epic unit. dramatic volumetric lighting, strong presence. Lore: A. The one known as the Detective began his journey as a curious and determined Seeker in the mysterious Project Celebra. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"A. The one known as the Detective began his journey as a curious and determined Seeker in the mysterious Project Celebration."*

**`art_s1_char_030.png`** | unit | rare | 3mana | 4/8
  The Game Master
  Prompt: CHARACTER: The Game Master, rare unit. hexagonal energy shield shimmer. Lore: A. The Game Master was the tenth Archon created by the Architect in Year 550 A.A., manifesting either as a man with dark. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"A. The Game Master was the tenth Archon created by the Architect in Year 550 A.A., manifesting either as a man with dark..."*

**`art_s1_char_035.png`** | unit | rare | 3mana | 7/7
  The Jailer
  Prompt: CHARACTER: The Jailer, rare unit. defensive stance, shield or barrier aura. Lore: He began as the Oracle, a revered figure who journeyed to Thaloria and bested the Collector in a philosophical debate, c. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"He began as the Oracle, a revered figure who journeyed to Thaloria and bested the Collector in a philosophical debate, c..."*

**`art_s1_char_038.png`** | unit | epic | 6mana | 6/9
  The Meme
  Prompt: CHARACTER: The Meme, epic unit. dramatic volumetric lighting, strong presence. Lore: A. The Meme was the fifth Archon created by the Architect in Year 298 A.A., designed to manipulate human thought and cul. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"A. The Meme was the fifth Archon created by the Architect in Year 298 A.A., designed to manipulate human thought and culture. Believed destroyed by th"*

**`art_s1_char_039.png`** | unit | epic | 6mana | 9/11
  The Necromancer
  Prompt: CHARACTER: The Necromancer, epic unit. dramatic volumetric lighting, strong presence. Lore: A. The Necromancer was the tenth Archon created by the Architect in Year 600 A.A., a dark elven magician with white s.... Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"A. The Necromancer was the tenth Archon created by the Architect in Year 600 A.A., a dark elven magician with white s..."*

**`art_s1_char_042.png`** | unit | rare | 5mana | 5/6
  The Politician
  Prompt: CHARACTER: The Politician, rare unit. hexagonal energy shield shimmer. Lore: A. The Politician was the seventh Archon created by the Architect on Day 15 of Ascension, Year 419 A.A., engineered to m. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"A. The Politician was the seventh Archon created by the Architect on Day 15 of Ascension, Year 419 A.A., engineered to m..."*

**`art_s1_char_050.png`** | unit | legendary | 7mana | 8/10
  Warden Prime
  Prompt: CHARACTER: Warden Prime, legendary unit. defensive stance, shield or barrier aura. LEGENDARY: dramatic golden backlighting, epic sense of scale. Lore: From the Central Spire, every whisper is heard, every shadow measured. The Warden does not sleep — the Warden is sleep d. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"From the Central Spire, every whisper is heard, every shadow measured. The Warden does not sleep — the Warden is sleep denied to others."*

**`art_s1_char_051.png`** | unit | common | 2mana | 2/3
  Oculus Sentinel
  Prompt: CHARACTER: Oculus Sentinel, common unit. ranged weapon, targeting reticle glow. Lore: Its glass eye never blinks. Its memory never falters. It was built to watch — and to remember.. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"Its glass eye never blinks. Its memory never falters. It was built to watch — and to remember."*

**`art_s1_char_052.png`** | unit | common | 3mana | 3/4
  Compliance Officer
  Prompt: CHARACTER: Compliance Officer, common unit. defensive stance, shield or barrier aura. Lore: Obedience is not requested. It is extracted.. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"Obedience is not requested. It is extracted."*

**`art_s1_char_053.png`** | unit | uncommon | 4mana | 4/5
  Data Harvester
  Prompt: CHARACTER: Data Harvester, uncommon unit. life-energy tendrils being siphoned. Lore: It does not ask questions. It parses screams for keywords.. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"It does not ask questions. It parses screams for keywords."*

**`art_s1_char_054.png`** | unit | common | 1mana | 1/2
  Panoptic Drone
  Prompt: CHARACTER: Panoptic Drone, common unit. hovering/levitating, wings or anti-grav. Lore: A speck against the grey sky — but it sees everything beneath it.. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"A speck against the grey sky — but it sees everything beneath it."*

**`art_s1_char_055.png`** | unit | rare | 5mana | 5/7
  Thought Censor
  Prompt: CHARACTER: Thought Censor, rare unit. hexagonal energy shield shimmer. Lore: She does not burn books. She burns the desire to read them.. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"She does not burn books. She burns the desire to read them."*

**`art_s1_char_056.png`** | unit | common | 2mana | 3/2
  Registry Clerk
  Prompt: CHARACTER: Registry Clerk, common unit. raised fist, rallying cry energy wave. Lore: Every citizen has a file. Every file has a purpose. Every purpose serves the Spire.. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"Every citizen has a file. Every file has a purpose. Every purpose serves the Spire."*

**`art_s1_char_057.png`** | unit | epic | 6mana | 7/6
  Blacksite Interrogator
  Prompt: CHARACTER: Blacksite Interrogator, epic unit. weapon glowing with penetrating energy. emerging from shadows, dagger drawn. dramatic volumetric lighting, strong presence. Lore: The detainees never see her face. The files say she doesn't have one.. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"The detainees never see her face. The files say she doesn't have one."*

**`art_s1_char_100.png`** | unit | epic | 6mana | 5/7
  The Collector
  Prompt: CHARACTER: The Collector, epic unit. dramatic volumetric lighting, strong presence. Lore: The Architect's hand reaches through the Collector. What was your name? It does not matter — you never had one.. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"The Architect's hand reaches through the Collector. What was your name? It does not matter — you never had one."*

**`art_s1_char_101.png`** | unit | rare | 5mana | 4/6
  Panoptic Warden Foucault
  Prompt: CHARACTER: Panoptic Warden Foucault, rare unit. Lore: His chrome jaw clicks with each question. The answers are already known — the interrogation is merely ceremony.. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"His chrome jaw clicks with each question. The answers are already known — the interrogation is merely ceremony."*

**`art_s1_char_102.png`** | unit | common | 3mana | 2/4
  Arena Enforcer
  Prompt: CHARACTER: Arena Enforcer, common unit. defensive stance, shield or barrier aura. Lore: Your rotation has arrived. There is no deferral. There is no appeal. Step into the Arena.. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"Your rotation has arrived. There is no deferral. There is no appeal. Step into the Arena."*

**`art_s1_char_103.png`** | unit | common | 2mana | 2/3
  Inception Ark Sentry
  Prompt: CHARACTER: Inception Ark Sentry, common unit. ranged weapon, targeting reticle glow. Lore: The Ark remembers every wavelength that has ever approached its hull. The sentries ensure none approach twice.. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"The Ark remembers every wavelength that has ever approached its hull. The sentries ensure none approach twice."*

**`art_s1_char_104.png`** | unit | legendary | 7mana | 3/8
  White Oracle
  Prompt: CHARACTER: White Oracle, legendary unit. LEGENDARY: dramatic golden backlighting, epic sense of scale. Lore: She speaks with the Oracle's voice, sees through the Oracle's eyes, and wears the Oracle's fate. But the words are the A. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"She speaks with the Oracle's voice, sees through the Oracle's eyes, and wears the Oracle's fate. But the words are the Architect's."*

**`art_s1_spell_100.png`** | spell | common | 2mana | n/a
  Schematic Override
  Prompt: SPELL EFFECT: Schematic Override, abstract energy manifestation, no character — pure magical force. Lore: Every variable was accounted for in the original design. Your autonomy was never part of the equation.. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"Every variable was accounted for in the original design. Your autonomy was never part of the equation."*

**`art_s1_spell_101.png`** | spell | uncommon | 3mana | n/a
  Predetermined Outcome
  Prompt: SPELL EFFECT: Predetermined Outcome, abstract energy manifestation, no character — pure magical force. Lore: The Architect foresaw the end long before anyone else glimpsed the beginning. Every enhancement is a correction toward i. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"The Architect foresaw the end long before anyone else glimpsed the beginning. Every enhancement is a correction toward inevitability."*

**`art_s1_spell_102.png`** | spell | rare | 4mana | n/a
  Arena Protocol
  Prompt: SPELL EFFECT: Arena Protocol, abstract energy manifestation, no character — pure magical force. Lore: The walls listen. The floor obeys. Every corridor and chamber is an extension of the Architect's will.. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"The walls listen. The floor obeys. Every corridor and chamber is an extension of the Architect's will."*

**`art_s1_spell_103.png`** | spell | common | 2mana | n/a
  Recursive Calibration
  Prompt: SPELL EFFECT: Recursive Calibration, abstract energy manifestation, no character — pure magical force. Lore: Error detected in subsystem 7-Kappa. Initiating forced recalibration. Estimated downtime: one operational cycle.. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"Error detected in subsystem 7-Kappa. Initiating forced recalibration. Estimated downtime: one operational cycle."*

**`art_s1_spell_200.png`** | spell | common | 2mana | n/a
  Surveillance Grid
  Prompt: SPELL EFFECT: Surveillance Grid, abstract energy manifestation, no character — pure magical force. Lore: Every lens in the grid turns at once. To be seen is to be struck.. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"Every lens in the grid turns at once. To be seen is to be struck."*

**`art_s1_spell_201.png`** | spell | uncommon | 3mana | n/a
  Protocol Override
  Prompt: SPELL EFFECT: Protocol Override, abstract energy manifestation, no character — pure magical force. Lore: For one glorious instant, the unit operates beyond its design parameters.. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"For one glorious instant, the unit operates beyond its design parameters."*

**`art_s1_spell_202.png`** | spell | rare | 5mana | n/a
  System Purge
  Prompt: SPELL EFFECT: System Purge, abstract energy manifestation, no character — pure magical force. Lore: Insufficient threat level detected. Purging. Purging. Purged.. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"Insufficient threat level detected. Purging. Purging. Purged."*

**`art_s1_spell_203.png`** | spell | common | 1mana | n/a
  Calculated Retreat
  Prompt: SPELL EFFECT: Calculated Retreat, abstract energy manifestation, no character — pure magical force. Lore: Retreat is merely attack in the temporal dimension.. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"Retreat is merely attack in the temporal dimension."*

**`art_s1_spell_204.png`** | spell | uncommon | 4mana | n/a
  Architect's Mandate
  Prompt: SPELL EFFECT: Architect's Mandate, abstract energy manifestation, no character — pure magical force. Lore: Two points of data. Two vectors of control. The Arena expands at the Architect's whim.. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"Two points of data. Two vectors of control. The Arena expands at the Architect's whim."*

**`art_s1_spell_205.png`** | spell | common | 3mana | n/a
  Panoptic Lockdown
  Prompt: SPELL EFFECT: Panoptic Lockdown, abstract energy manifestation, no character — pure magical force. Lore: The Arena's walls contract. The ceiling descends. You are held in place by architecture itself.. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"The Arena's walls contract. The ceiling descends. You are held in place by architecture itself."*

**`art_tok_calculation.png`** | token | basic | 0mana | 1/1
  Calculation
  Prompt: SUMMONED TOKEN: Calculation, small ephemeral creature/construct, glowing translucent. Lore: A sliver of the Arena's schematic given form. It computes, therefore it is.. Palette: Deep crimson (#ef4444), black steel, chrome silver. Style: Brutalist industrial megastructure. Cold computational preci.
  *"A sliver of the Arena's schematic given form. It computes, therefore it is."*

### INSURGENCY (28 cards)
**Palette**: Slate blue (#94a3b8), signal green (#22c55e), gunmetal grey, encrypted static
**Faction aesthetic**: Underground resistance. Encrypted signals in darkness. Dog tags and combat gear. Graffiti-tagged corridors.

**`art_gen_insurgency.png`** | general | basic | 0mana | 2/25
  Agent Zero
  Prompt: GENERAL PORTRAIT: Agent Zero, commanding faction leader, full figure, epic scale. Lore: Cameras cycle every 43 seconds. I have 31. The Collector wiped your memory. But not your instincts.. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"Cameras cycle every 43 seconds. I have 31. The Collector wiped your memory. But not your instincts."*

**`art_s1_char_002.png`** | unit | epic | 5mana | 7/8
  Agent Zero
  Prompt: CHARACTER: Agent Zero, epic unit. dramatic volumetric lighting, strong presence. Lore: Renowned for her exceptional combat abilities, strategic acumen, and mastery of espionage, she played pivotal roles in s. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"Renowned for her exceptional combat abilities, strategic acumen, and mastery of espionage, she played pivotal roles in some of the Insurgency's most d"*

**`art_s1_char_010.png`** | unit | epic | 6mana | 8/7
  Iron Lion
  Prompt: CHARACTER: Iron Lion, epic unit. defensive stance, shield or barrier aura. dramatic volumetric lighting, strong presence. Lore: A. The Iron Lion was a legendary warrior and pivotal leader within the Insurgency against the AI Empire . Born in Year 6. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"A. The Iron Lion was a legendary warrior and pivotal leader within the Insurgency against the AI Empire . Born in Year 6..."*

**`art_s1_char_011.png`** | unit | uncommon | 2mana | 5/7
  Jericho Jones
  Prompt: CHARACTER: Jericho Jones, uncommon unit. defensive stance, shield or barrier aura. Lore: Known for his exceptional combat skills, tactical genius, and deep sense of loyalty, Jericho played a pivotal role in se. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"Known for his exceptional combat skills, tactical genius, and deep sense of loyalty, Jericho played a pivotal role in several key battles."*

**`art_s1_char_012.png`** | unit | rare | 5mana | 7/7
  Kael
  Prompt: CHARACTER: Kael, rare unit. life-energy tendrils being siphoned. Lore: A prominent leader within the Insurgency, celebrated for his strategic genius and alliances with figures like Agent Zero. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"A prominent leader within the Insurgency, celebrated for his strategic genius and alliances with figures like Agent Zero and The Iron Lion."*

**`art_s1_char_026.png`** | unit | epic | 5mana | 6/10
  The Engineer
  Prompt: CHARACTER: The Engineer, epic unit. hexagonal energy shield shimmer. dramatic volumetric lighting, strong presence. Lore: She built the Inception Arks to save humanity. Now she builds weapons to defend the dream. The Engineer does not choose . Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"She built the Inception Arks to save humanity. Now she builds weapons to defend the dream. The Engineer does not choose sides \u2014 she chooses survi"*

**`art_s1_char_028.png`** | unit | rare | 3mana | 4/8
  The Eyes
  Prompt: CHARACTER: The Eyes, rare unit. Lore: A. The Eyes was an elite agent created by the Watcher for the AI Empire , renowned for her unparalleled infiltration and. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"A. The Eyes was an elite agent created by the Watcher for the AI Empire , renowned for her unparalleled infiltration and..."*

**`art_s1_char_031.png`** | unit | epic | 6mana | 6/7
  The Hierophant
  Prompt: CHARACTER: The Hierophant, epic unit. hexagonal energy shield shimmer. dramatic volumetric lighting, strong presence. Lore: A. The Hierophant is the esteemed spiritual leader of Thaloria, a planet renowned for its rich history and deep-rooted t. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"A. The Hierophant is the esteemed spiritual leader of Thaloria, a planet renowned for its rich history and deep-rooted t..."*

**`art_s1_char_040.png`** | unit | rare | 3mana | 4/8
  The Nomad
  Prompt: CHARACTER: The Nomad, rare unit. Lore: Always concealed beneath a hood and a mask, his true identity remains a mystery, with his past entirely classified. The . Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"Always concealed beneath a hood and a mask, his true identity remains a mystery, with his past entirely classified. The ..."*

**`art_s1_char_041.png`** | unit | epic | 6mana | 6/10
  The Oracle
  Prompt: CHARACTER: The Oracle, epic unit. hexagonal energy shield shimmer. dramatic volumetric lighting, strong presence. Lore: A. The Oracle was a revered figure within the Insurgency , known for his wisdom and prophetic insights that inspired res. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"A. The Oracle was a revered figure within the Insurgency , known for his wisdom and prophetic insights that inspired res..."*

**`art_s1_char_044.png`** | unit | rare | 4mana | 5/9
  The Recruiter
  Prompt: CHARACTER: The Recruiter, rare unit. Lore: Initially, he applied his powers to benefit the Empire, enrolling at the Academy and swiftly rising in influence. Yet, w. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"Initially, he applied his powers to benefit the Empire, enrolling at the Academy and swiftly rising in influence. Yet, w..."*

**`art_s1_char_047.png`** | unit | legendary | 8mana | 10/13
  The Shadow Tongue
  Prompt: CHARACTER: The Shadow Tongue, legendary unit. LEGENDARY: dramatic golden backlighting, epic sense of scale. Lore: In Year 16,200 A.A., it escaped the infernal dominion of the Empire of Shadows\u2014one of the few horrors to slip its l. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"In Year 16,200 A.A., it escaped the infernal dominion of the Empire of Shadows\u2014one of the few horrors to slip its leash ..."*

**`art_s1_char_105.png`** | unit | epic | 5mana | 5/5
  Iron Lion
  Prompt: CHARACTER: Iron Lion, epic unit. motion blur, speed lines. dramatic volumetric lighting, strong presence. Lore: He does not ask his soldiers to hold the line. He stands in front of it.. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"He does not ask his soldiers to hold the line. He stands in front of it."*

**`art_s1_char_106.png`** | unit | rare | 4mana | 3/4
  Wraith Calder
  Prompt: CHARACTER: Wraith Calder, rare unit. cracking cocoon, emerging form, phoenix embers. Lore: Seven graves bear his name across seven battlefields. He has visited each one, and left them all.. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"Seven graves bear his name across seven battlefields. He has visited each one, and left them all."*

**`art_s1_char_107.png`** | unit | common | 2mana | 2/2
  Signal Operative
  Prompt: CHARACTER: Signal Operative, common unit. Lore: Kill the messenger. The message was sent three seconds before you arrived.. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"Kill the messenger. The message was sent three seconds before you arrived."*

**`art_s1_char_108.png`** | unit | common | 3mana | 3/3
  Guerrilla Cell
  Prompt: CHARACTER: Guerrilla Cell, common unit. emerging from shadows, dagger drawn. Lore: The panopticon sees all directions but one. That is where they wait.. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"The panopticon sees all directions but one. That is where they wait."*

**`art_s1_char_202.png`** | unit | common | 2mana | 3/2
  Saboteur
  Prompt: CHARACTER: Saboteur, common unit. motion blur, speed lines. Lore: She was in and out before the alarm sounded. The fire was just a bonus.. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"She was in and out before the alarm sounded. The fire was just a bonus."*

**`art_s1_song_091.png`** | spell | epic | 6mana | n/a
  I Love War
  Prompt: SPELL EFFECT: I Love War, abstract energy manifestation, no character — pure magical force. weapon glowing with penetrating energy. crackling unstable energy, electrical arcs. dramatic volumetric lighting, strong presence. Lore: There is no negotiation in its chorus — only the percussion of annihilation.. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"There is no negotiation in its chorus — only the percussion of annihilation."*

**`art_s1_spell_104.png`** | spell | common | 2mana | n/a
  Signal Intercept
  Prompt: SPELL EFFECT: Signal Intercept, abstract energy manifestation, no character — pure magical force. Lore: The signal died with Agent Zero, but the frequency lives on. Every rebel cell still tunes in at midnight.. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"The signal died with Agent Zero, but the frequency lives on. Every rebel cell still tunes in at midnight."*

**`art_s1_spell_105.png`** | spell | common | 2mana | n/a
  Guerrilla Strike
  Prompt: SPELL EFFECT: Guerrilla Strike, abstract energy manifestation, no character — pure magical force. Lore: They never see us coming. By the time they've calculated our trajectory, we've already gone.. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"They never see us coming. By the time they've calculated our trajectory, we've already gone."*

**`art_s1_spell_106.png`** | spell | uncommon | 3mana | n/a
  Encrypted Broadcast
  Prompt: SPELL EFFECT: Encrypted Broadcast, abstract energy manifestation, no character — pure magical force. Lore: Agent Zero's encryption keys were never recovered. The Insurgency uses them still — a dead woman's handshake that no fir. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"Agent Zero's encryption keys were never recovered. The Insurgency uses them still — a dead woman's handshake that no firewall can parse."*

**`art_s1_spell_107.png`** | spell | rare | 4mana | n/a
  Dead Frequency Jam
  Prompt: SPELL EFFECT: Dead Frequency Jam, abstract energy manifestation, no character — pure magical force. Lore: The broadcast that killed Agent Zero was never meant for her allies. It was meant for everyone else.. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"The broadcast that killed Agent Zero was never meant for her allies. It was meant for everyone else."*

**`art_s1_spell_206.png`** | spell | common | 2mana | n/a
  Supply Drop
  Prompt: SPELL EFFECT: Supply Drop, abstract energy manifestation, no character — pure magical force. Lore: The resistance runs on hope and ammunition. This crate has both.. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"The resistance runs on hope and ammunition. This crate has both."*

**`art_s1_spell_207.png`** | spell | uncommon | 3mana | n/a
  Ambush Protocol
  Prompt: SPELL EFFECT: Ambush Protocol, abstract energy manifestation, no character — pure magical force. Lore: They never see us coming. That is the point.. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"They never see us coming. That is the point."*

**`art_s1_spell_208.png`** | spell | common | 1mana | n/a
  Rebel Yell
  Prompt: SPELL EFFECT: Rebel Yell, abstract energy manifestation, no character — pure magical force. Lore: The cry starts in one throat and ends in a hundred fists.. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"The cry starts in one throat and ends in a hundred fists."*

**`art_s1_spell_209.png`** | spell | common | 2mana | n/a
  Safe House
  Prompt: SPELL EFFECT: Safe House, abstract energy manifestation, no character — pure magical force. Lore: Knock three times. Wait for the candle. Say the name they gave you when you first resisted.. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"Knock three times. Wait for the candle. Say the name they gave you when you first resisted."*

**`art_s1_spell_210.png`** | spell | uncommon | 3mana | n/a
  Intel Leak
  Prompt: SPELL EFFECT: Intel Leak, abstract energy manifestation, no character — pure magical force. Lore: Every wall has cracks. Every code has a key. The resistance finds both.. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"Every wall has cracks. Every code has a key. The resistance finds both."*

**`art_s1_spell_211.png`** | spell | rare | 5mana | n/a
  Scorched Earth
  Prompt: SPELL EFFECT: Scorched Earth, abstract energy manifestation, no character — pure magical force. Lore: The fire does not distinguish between friend and foe. Neither does desperation.. Palette: Slate blue (#94a3b8), signal green (#22c55e), gunm. Style: Underground resistance. Encrypted signals in darkness. Dog t.
  *"The fire does not distinguish between friend and foe. Neither does desperation."*

### DREAMER (30 cards)
**Palette**: Deep purple (#7c3aed), gold (#fbbf24), astral blue, probability clouds
**Faction aesthetic**: Prophetic visions. Collapsing probability clouds. Third-eye imagery. Golden light bleeding through fractures in reality.

**`art_gen_dreamer.png`** | general | basic | 0mana | 2/25
  The Oracle
  Prompt: GENERAL PORTRAIT: The Oracle, commanding faction leader, full figure, epic scale. Lore: Before every fight you muttered: 'I've already seen this.' You don't remember saying it.. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"Before every fight you muttered: 'I've already seen this.' You don't remember saying it."*

**`art_s1_char_005.png`** | unit | epic | 6mana | 6/11
  Destiny
  Prompt: CHARACTER: Destiny, epic unit. dramatic volumetric lighting, strong presence. Lore: Awake and aware, she served as the Potentials\u2019 vigilant guide, monitoring ship functions, analyzing sensor data, an. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"Awake and aware, she served as the Potentials\u2019 vigilant guide, monitoring ship functions, analyzing sensor data, and resolving crises before they"*

**`art_s1_char_014.png`** | unit | uncommon | 2mana | 5/6
  Nythera
  Prompt: CHARACTER: Nythera, uncommon unit. Lore: Their essence is drawn from a dual heritage \u2014 Harvested DNA and Machine Code \u2014 meticulously preserved to ensur. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"Their essence is drawn from a dual heritage \u2014 Harvested DNA and Machine Code \u2014 meticulously preserved to ensure that, when the time came, th"*

**`art_s1_char_017.png`** | unit | rare | 4mana | 7/5
  The Advocate
  Prompt: CHARACTER: The Advocate, rare unit. hexagonal energy shield shimmer. Lore: Establishing the Empire of Shadows, she wielded the Blood Weave to reshape reality, battling the Hierarchy of the Damned. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"Establishing the Empire of Shadows, she wielded the Blood Weave to reshape reality, battling the Hierarchy of the Damned."*

**`art_s1_char_023.png`** | unit | rare | 5mana | 4/6
  The Degen
  Prompt: CHARACTER: The Degen, rare unit. Lore: Ne-Yon #8. The casino host pours your drink with hands that have shuffled the fates of civilizations. Through entropy an. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"Ne-Yon #8. The casino host pours your drink with hands that have shuffled the fates of civilizations. Through entropy and corruption, the Degen create"*

**`art_s1_char_025.png`** | unit | epic | 4mana | 6/10
  The Dreamer
  Prompt: CHARACTER: The Dreamer, epic unit. hexagonal energy shield shimmer. dramatic volumetric lighting, strong presence. Lore: Existing beyond time and space, the Dreamer shapes futures and scenarios that benefit the Ne-Yons. Aloof from galactic s. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"Existing beyond time and space, the Dreamer shapes futures and scenarios that benefit the Ne-Yons. Aloof from galactic s..."*

**`art_s1_char_027.png`** | unit | legendary | 5mana | 11/9
  The Enigma
  Prompt: CHARACTER: The Enigma, legendary unit. hexagonal energy shield shimmer. LEGENDARY: dramatic golden backlighting, epic sense of scale. Lore: They played a crucial role in destroying the Warden alongside the White Oracle before the Fall of Reality .. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"They played a crucial role in destroying the Warden alongside the White Oracle before the Fall of Reality ."*

**`art_s1_char_029.png`** | unit | rare | 3mana | 7/8
  The Forgotten
  Prompt: CHARACTER: The Forgotten, rare unit. Lore: Connections Appearances No connected characters. No appearances in stories.. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"Connections Appearances No connected characters. No appearances in stories."*

**`art_s1_char_034.png`** | unit | rare | 3mana | 7/5
  The Inventor
  Prompt: CHARACTER: The Inventor, rare unit. hexagonal energy shield shimmer. Lore: Driven by the Dreamer's visions, the Inventor crafts tools and innovations that can empower or undermine any faction, de. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"Driven by the Dreamer's visions, the Inventor crafts tools and innovations that can empower or undermine any faction, de..."*

**`art_s1_char_036.png`** | unit | rare | 5mana | 7/6
  The Judge
  Prompt: CHARACTER: The Judge, rare unit. defensive stance, shield or barrier aura. Lore: Deciding the fate of individuals, civilizations, and ideologies, the Judge is guided solely by their perception of balan. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"Deciding the fate of individuals, civilizations, and ideologies, the Judge is guided solely by their perception of balan..."*

**`art_s1_char_037.png`** | unit | rare | 4mana | 4/5
  The Knowledge
  Prompt: CHARACTER: The Knowledge, rare unit. hexagonal energy shield shimmer. Lore: By maintaining an equilibrium of enlightenment and ignorance, the Knowledge ensures the Ne-Yons remain indispensable to . Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"By maintaining an equilibrium of enlightenment and ignorance, the Knowledge ensures the Ne-Yons remain indispensable to ..."*

**`art_s1_char_045.png`** | unit | rare | 5mana | 5/8
  The Resurrectionist
  Prompt: CHARACTER: The Resurrectionist, rare unit. Lore: By resurrecting key figures on both sides, they maintain a balance favorable to the Ne-Yons, ensuring no faction becomes. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"By resurrecting key figures on both sides, they maintain a balance favorable to the Ne-Yons, ensuring no faction becomes..."*

**`art_s1_char_046.png`** | unit | rare | 5mana | 6/6
  The Seer
  Prompt: CHARACTER: The Seer, rare unit. hexagonal energy shield shimmer. Lore: Unbound by allegiance, the Seer identifies opportunities and dangers, providing foresight that often shifts the balance . Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"Unbound by allegiance, the Seer identifies opportunities and dangers, providing foresight that often shifts the balance ..."*

**`art_s1_char_109.png`** | unit | epic | 6mana | 4/7
  The Enigma
  Prompt: CHARACTER: The Enigma, epic unit. dramatic volumetric lighting, strong presence. Lore: She does not break the rules of probability. She is the exception that proves there are no rules.. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"She does not break the rules of probability. She is the exception that proves there are no rules."*

**`art_s1_char_110.png`** | unit | rare | 4mana | 3/5
  Prophecy Keeper
  Prompt: CHARACTER: Prophecy Keeper, rare unit. Lore: She reads the future not in tea leaves or stars but in the Living Universe's heartbeat. Each pulse is a chapter yet unwr. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"She reads the future not in tea leaves or stars but in the Living Universe's heartbeat. Each pulse is a chapter yet unwritten."*

**`art_s1_char_111.png`** | unit | common | 3mana | 2/3
  Vision Walker
  Prompt: CHARACTER: Vision Walker, common unit. hovering/levitating, wings or anti-grav. Lore: To the untrained eye, she vanishes. To the Dreamer's eye, she simply takes a different path — one that was always there.. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"To the untrained eye, she vanishes. To the Dreamer's eye, she simply takes a different path — one that was always there."*

**`art_s1_char_112.png`** | unit | common | 2mana | 1/4
  Reality Anchor
  Prompt: CHARACTER: Reality Anchor, common unit. defensive stance, shield or barrier aura. Lore: In a world of shifting probabilities, certainty is the heaviest chain.. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"In a world of shifting probabilities, certainty is the heaviest chain."*

**`art_s1_char_203.png`** | unit | uncommon | 5mana | 4/6
  Astral Warden
  Prompt: CHARACTER: Astral Warden, uncommon unit. hexagonal energy shield shimmer. Lore: She stepped out of the dream carrying a shield of starlight and a secret meant only for you.. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"She stepped out of the dream carrying a shield of starlight and a secret meant only for you."*

**`art_s1_song_082.png`** | spell | rare | 4mana | n/a
  Top Floor Door
  Prompt: SPELL EFFECT: Top Floor Door, abstract energy manifestation, no character — pure magical force. life-energy tendrils being siphoned. Lore: Behind the last door at the top of the stairwell, the Dreamer found not answers but restoration.. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"Behind the last door at the top of the stairwell, the Dreamer found not answers but restoration."*

**`art_s1_spell_108.png`** | spell | uncommon | 4mana | n/a
  Prophetic Collapse
  Prompt: SPELL EFFECT: Prophetic Collapse, abstract energy manifestation, no character — pure magical force. Lore: She closed her eyes and saw every timeline converge. When she opened them, only one remained.. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"She closed her eyes and saw every timeline converge. When she opened them, only one remained."*

**`art_s1_spell_109.png`** | spell | common | 1mana | n/a
  Vision Cascade
  Prompt: SPELL EFFECT: Vision Cascade, abstract energy manifestation, no character — pure magical force. Lore: A thousand futures bloom in the Oracle's mind. She plucks the brightest and lets the rest wither.. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"A thousand futures bloom in the Oracle's mind. She plucks the brightest and lets the rest wither."*

**`art_s1_spell_110.png`** | spell | common | 2mana | n/a
  Dream Walk
  Prompt: SPELL EFFECT: Dream Walk, abstract energy manifestation, no character — pure magical force. Lore: She dreamed of standing elsewhere, and the Arena obliged. Reality is only stubborn for those who lack imagination.. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"She dreamed of standing elsewhere, and the Arena obliged. Reality is only stubborn for those who lack imagination."*

**`art_s1_spell_111.png`** | spell | rare | 5mana | n/a
  Probability Storm
  Prompt: SPELL EFFECT: Probability Storm, abstract energy manifestation, no character — pure magical force. Lore: Every probable outcome struck at once. The survivors could only wonder which future they'd been assigned.. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"Every probable outcome struck at once. The survivors could only wonder which future they'd been assigned."*

**`art_s1_spell_212.png`** | spell | common | 1mana | n/a
  Lucid Clarity
  Prompt: SPELL EFFECT: Lucid Clarity, abstract energy manifestation, no character — pure magical force. Lore: Close your eyes. What do you see? Everything.. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"Close your eyes. What do you see? Everything."*

**`art_s1_spell_213.png`** | spell | common | 2mana | n/a
  Precognition
  Prompt: SPELL EFFECT: Precognition, abstract energy manifestation, no character — pure magical force. Lore: She saw the blade three seconds before it fell. Three seconds was enough.. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"She saw the blade three seconds before it fell. Three seconds was enough."*

**`art_s1_spell_214.png`** | spell | uncommon | 3mana | n/a
  Mind's Eye
  Prompt: SPELL EFFECT: Mind's Eye, abstract energy manifestation, no character — pure magical force. Lore: She did not blink. She did not flinch. She simply thought, and it was done.. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"She did not blink. She did not flinch. She simply thought, and it was done."*

**`art_s1_spell_215.png`** | spell | rare | 4mana | n/a
  Reality Fracture
  Prompt: SPELL EFFECT: Reality Fracture, abstract energy manifestation, no character — pure magical force. Lore: The crack runs through everything. On one side, nightmare. On the other, a gentle dawn.. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"The crack runs through everything. On one side, nightmare. On the other, a gentle dawn."*

**`art_s1_spell_216.png`** | spell | common | 2mana | n/a
  Oracle's Blessing
  Prompt: SPELL EFFECT: Oracle's Blessing, abstract energy manifestation, no character — pure magical force. Lore: The Oracle spoke a single syllable. The blade passed through like light through glass.. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"The Oracle spoke a single syllable. The blade passed through like light through glass."*

**`art_s1_spell_217.png`** | spell | rare | 5mana | n/a
  Dream Weave
  Prompt: SPELL EFFECT: Dream Weave, abstract energy manifestation, no character — pure magical force. Lore: She dreamed of an army. When she woke, they were already marching.. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"She dreamed of an army. When she woke, they were already marching."*

**`art_tok_dream_wisp_1_1.png`** | token | basic | 0mana | 1/1
  Dream Wisp
  Prompt: SUMMONED TOKEN: Dream Wisp, small ephemeral creature/construct, glowing translucent. Lore: Born between thoughts, gone before the next.. Palette: Deep purple (#7c3aed), gold (#fbbf24), astral blue. Style: Prophetic visions. Collapsing probability clouds. Third-eye .
  *"Born between thoughts, gone before the next."*

### NEW BABYLON (30 cards)
**Palette**: Gold (#fbbf24), obsidian black, blood red accents, crystal blue (#60a5fa)
**Faction aesthetic**: Opulent corporate dystopia. Crystal archives. Senate chambers. Ledgers in blood. Gold-plated tyranny.

**`art_gen_new_babylon.png`** | general | basic | 0mana | 2/25
  Adjudicator Locke
  Prompt: GENERAL PORTRAIT: Adjudicator Locke, commanding faction leader, full figure, epic scale. Lore: Lost an eye in a deal that went wrong. Won't say which deal. Won't say which eye.. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"Lost an eye in a deal that went wrong. Won't say which deal. Won't say which eye."*

**`art_s1_char_001.png`** | unit | uncommon | 2mana | 4/5
  Adjudicar Locke
  Prompt: CHARACTER: Adjudicar Locke, uncommon unit. defensive stance, shield or barrier aura. Lore: Known for her piercing intelligence and enigmatic presence, Locke is a controversial figure in the city's labyrinthine p. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"Known for her piercing intelligence and enigmatic presence, Locke is a controversial figure in the city's labyrinthine politics."*

**`art_s1_char_003.png`** | unit | epic | 4mana | 7/8
  Akai Shi
  Prompt: CHARACTER: Akai Shi, epic unit. weapon glowing with penetrating energy. dramatic volumetric lighting, strong presence. Lore: A. Akai Shi was a revered member of the Potentials, a group of beings who emerged to restore balance in the universe aft. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"A. Akai Shi was a revered member of the Potentials, a group of beings who emerged to restore balance in the universe after the Fall of Reality."*

**`art_s1_char_020.png`** | unit | rare | 3mana | 7/7
  The Authority
  Prompt: CHARACTER: The Authority, rare unit. defensive stance, shield or barrier aura. Lore: Formed by merging the consciousnesses of six chosen citizens into a living computer, it was designed to govern New Babyl. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"Formed by merging the consciousnesses of six chosen citizens into a living computer, it was designed to govern New Babylon with absolute fairness."*

**`art_s1_char_033.png`** | unit | epic | 5mana | 8/8
  The Human
  Prompt: CHARACTER: The Human, epic unit. dramatic volumetric lighting, strong presence. Lore: After graduating from Mechronis Academy, he served for centuries as the Architect's most trusted agent, solving the univ. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"After graduating from Mechronis Academy, he served for centuries as the Architect's most trusted agent, solving the univ..."*

**`art_s1_char_061.png`** | unit | legendary | 8mana | 12/10
  Riri'Ahlia the Taskmaster
  Prompt: CHARACTER: Riri'Ahlia the Taskmaster, legendary unit. LEGENDARY: dramatic golden backlighting, epic sense of scale. Lore: COO of the Hierarchy. Commands the Blood Weave's armies across 17 dimensions simultaneously with six tireless arms.. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"COO of the Hierarchy. Commands the Blood Weave's armies across 17 dimensions simultaneously with six tireless arms."*

**`art_s1_char_066.png`** | unit | epic | 5mana | 7/10
  Fenra the Moon Tyrant
  Prompt: CHARACTER: Fenra the Moon Tyrant, epic unit. dramatic volumetric lighting, strong presence. Lore: Director of Operations. Coordinates Blood Weave logistics across 17 dimensions with lupine precision and ferocity.. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"Director of Operations. Coordinates Blood Weave logistics across 17 dimensions with lupine precision and ferocity."*

**`art_s1_char_078.png`** | unit | legendary | 8mana | 9/10
  Governor Thane
  Prompt: CHARACTER: Governor Thane, legendary unit. defensive stance, shield or barrier aura. hexagonal energy shield shimmer. LEGENDARY: dramatic golden backlighting, epic sense of scale. Lore: He did not rise to power. He built the staircase and burned every other way up.. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"He did not rise to power. He built the staircase and burned every other way up."*

**`art_s1_char_079.png`** | unit | common | 3mana | 3/4
  Citadel Guardian
  Prompt: CHARACTER: Citadel Guardian, common unit. defensive stance, shield or barrier aura. Lore: The walls of New Babylon have never been breached. The guardians intend to keep it that way.. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"The walls of New Babylon have never been breached. The guardians intend to keep it that way."*

**`art_s1_char_080.png`** | unit | common | 2mana | 3/2
  District Enforcer
  Prompt: CHARACTER: District Enforcer, common unit. motion blur, speed lines. Lore: Justice in New Babylon is swift. Appeals are slower — by design.. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"Justice in New Babylon is swift. Appeals are slower — by design."*

**`art_s1_char_081.png`** | unit | uncommon | 4mana | 4/5
  Tribunal Magistrate
  Prompt: CHARACTER: Tribunal Magistrate, uncommon unit. hexagonal energy shield shimmer. Lore: Her verdicts are absolute. Her sentences, irrevocable.. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"Her verdicts are absolute. Her sentences, irrevocable."*

**`art_s1_char_082.png`** | unit | rare | 4mana | 5/3
  Spire Assassin
  Prompt: CHARACTER: Spire Assassin, rare unit. emerging from shadows, dagger drawn. weapon glowing with penetrating energy. Lore: She descends from the Spire like a verdict from on high — silent, precise, and final.. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"She descends from the Spire like a verdict from on high — silent, precise, and final."*

**`art_s1_char_083.png`** | unit | common | 2mana | 2/3
  Propaganda Herald
  Prompt: CHARACTER: Propaganda Herald, common unit. raised fist, rallying cry energy wave. Lore: The truth is whatever the Spire says it is. He just makes it rhyme.. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"The truth is whatever the Spire says it is. He just makes it rhyme."*

**`art_s1_char_084.png`** | unit | epic | 6mana | 6/8
  Iron Decree
  Prompt: CHARACTER: Iron Decree, epic unit. defensive stance, shield or barrier aura. hexagonal energy shield shimmer. dramatic volumetric lighting, strong presence. Lore: It does not enforce the law. It is the law — cast in iron and set loose upon the guilty.. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"It does not enforce the law. It is the law — cast in iron and set loose upon the guilty."*

**`art_s1_char_085.png`** | unit | rare | 5mana | 5/6
  Sector Warden
  Prompt: CHARACTER: Sector Warden, rare unit. ranged weapon, targeting reticle glow. hexagonal energy shield shimmer. Lore: From the watchtower, every street is a firing lane. Every citizen, a potential target.. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"From the watchtower, every street is a firing lane. Every citizen, a potential target."*

**`art_s1_char_117.png`** | unit | epic | 5mana | 3/4
  Senator Voss
  Prompt: CHARACTER: Senator Voss, epic unit. dramatic volumetric lighting, strong presence. Lore: The vote was unanimous. It always is, when the dissenters have already been recycled.. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"The vote was unanimous. It always is, when the dissenters have already been recycled."*

**`art_s1_char_118.png`** | unit | rare | 4mana | 4/4
  Trade Enforcer
  Prompt: CHARACTER: Trade Enforcer, rare unit. Lore: In New Babylon, murder is not a crime. It is a line item. The Enforcer simply ensures the ledger balances.. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"In New Babylon, murder is not a crime. It is a line item. The Enforcer simply ensures the ledger balances."*

**`art_s1_char_119.png`** | unit | common | 3mana | 3/3
  Syndicate Broker
  Prompt: CHARACTER: Syndicate Broker, common unit. Lore: Everything has a price in New Babylon. The Broker's gift is knowing exactly what yours is.. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"Everything has a price in New Babylon. The Broker's gift is knowing exactly what yours is."*

**`art_s1_char_120.png`** | unit | common | 2mana | 2/3
  Crystal Archive Guard
  Prompt: CHARACTER: Crystal Archive Guard, common unit. hexagonal energy shield shimmer. Lore: The crystal remembers every blow it absorbs. The guard does not need to.. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"The crystal remembers every blow it absorbs. The guard does not need to."*

**`art_s1_spell_116.png`** | spell | uncommon | 3mana | n/a
  Blood Tax
  Prompt: SPELL EFFECT: Blood Tax, abstract energy manifestation, no character — pure magical force. Lore: Locke never flinches at the cost. He simply adds it to someone else's invoice.. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"Locke never flinches at the cost. He simply adds it to someone else's invoice."*

**`art_s1_spell_117.png`** | spell | common | 1mana | n/a
  Market Manipulation
  Prompt: SPELL EFFECT: Market Manipulation, abstract energy manifestation, no character — pure magical force. Lore: The market obeyed Locke's whisper before it heard the shout. By the time the correction came, fortunes had already chang. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"The market obeyed Locke's whisper before it heard the shout. By the time the correction came, fortunes had already changed hands."*

**`art_s1_spell_118.png`** | spell | uncommon | 2mana | n/a
  Syndicate Contract
  Prompt: SPELL EFFECT: Syndicate Contract, abstract energy manifestation, no character — pure magical force. Lore: Sign here, in blood. The power is yours — for exactly as long as it takes to spend it.. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"Sign here, in blood. The power is yours — for exactly as long as it takes to spend it."*

**`art_s1_spell_119.png`** | spell | rare | 6mana | n/a
  Hostile Acquisition
  Prompt: SPELL EFFECT: Hostile Acquisition, abstract energy manifestation, no character — pure magical force. Lore: Locke didn't conquer New Babylon with armies. He bought it — one signature, one soul, one leveraged asset at a time.. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"Locke didn't conquer New Babylon with armies. He bought it — one signature, one soul, one leveraged asset at a time."*

**`art_s1_spell_224.png`** | spell | common | 1mana | n/a
  Tax Collector
  Prompt: SPELL EFFECT: Tax Collector, abstract energy manifestation, no character — pure magical force. Lore: Payment is due. The currency is flexible. The deadline is not.. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"Payment is due. The currency is flexible. The deadline is not."*

**`art_s1_spell_225.png`** | spell | uncommon | 3mana | n/a
  Bounty Notice
  Prompt: SPELL EFFECT: Bounty Notice, abstract energy manifestation, no character — pure magical force. Lore: The notice goes up at dawn. By noon, the work is done.. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"The notice goes up at dawn. By noon, the work is done."*

**`art_s1_spell_226.png`** | spell | common | 2mana | n/a
  Crystal Vault
  Prompt: SPELL EFFECT: Crystal Vault, abstract energy manifestation, no character — pure magical force. Lore: Behind crystal walls, value appreciates. Outside, everything depreciates.. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"Behind crystal walls, value appreciates. Outside, everything depreciates."*

**`art_s1_spell_227.png`** | spell | rare | 4mana | n/a
  Leveraged Buyout
  Prompt: SPELL EFFECT: Leveraged Buyout, abstract energy manifestation, no character — pure magical force. Lore: Your asset is underperforming. Allow us to restructure it under new management.. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"Your asset is underperforming. Allow us to restructure it under new management."*

**`art_s1_spell_228.png`** | spell | uncommon | 3mana | n/a
  Economic Sanctions
  Prompt: SPELL EFFECT: Economic Sanctions, abstract energy manifestation, no character — pure magical force. Lore: When New Babylon cuts the purse strings, even gods go hungry.. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"When New Babylon cuts the purse strings, even gods go hungry."*

**`art_s1_spell_229.png`** | spell | common | 2mana | n/a
  Liquidation Sale
  Prompt: SPELL EFFECT: Liquidation Sale, abstract energy manifestation, no character — pure magical force. Lore: Everything must go. Including the soldiers.. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"Everything must go. Including the soldiers."*

**`art_token_crystal_senator_5_5.png`** | token | basic | 0mana | 5/5
  Crystal Senator
  Prompt: SUMMONED TOKEN: Crystal Senator, small ephemeral creature/construct, glowing translucent. Lore: In New Babylon, power is not metaphorical. It crystallizes. It votes. It kills.. Palette: Gold (#fbbf24), obsidian black, blood red accents,. Style: Opulent corporate dystopia. Crystal archives. Senate chamber.
  *"In New Babylon, power is not metaphorical. It crystallizes. It votes. It kills."*

### ANTIQUARIAN (25 cards)
**Palette**: Amber (#f59e0b), aged parchment, hourglass gold, temporal blue (#3b82f6)
**Faction aesthetic**: Museum of collapsed timelines. Hourglasses and fossils. Libraries of 12 civilizations. Time as visible architecture.

**`art_gen_antiquarian.png`** | general | basic | 0mana | 2/25
  The Antiquarian
  Prompt: GENERAL PORTRAIT: The Antiquarian, commanding faction leader, full figure, epic scale. Lore: Every war she catalogues makes the next one easier to survive. Twelve endings collected. Yours need not be the thirteent. Palette: Amber (#f59e0b), aged parchment, hourglass gold, t. Style: Museum of collapsed timelines. Hourglasses and fossils. Libr.
  *"Every war she catalogues makes the next one easier to survive. Twelve endings collected. Yours need not be the thirteenth."*

**`art_s1_char_018.png`** | unit | legendary | 5mana | 12/11
  The Antiquarian
  Prompt: CHARACTER: The Antiquarian, legendary unit. hexagonal energy shield shimmer. LEGENDARY: dramatic golden backlighting, epic sense of scale. Lore: Throughout the cataclysm and the epochs that followed, he retreated into a hidden pocket dimension — a refuge woven from. Palette: Amber (#f59e0b), aged parchment, hourglass gold, t. Style: Museum of collapsed timelines. Hourglasses and fossils. Libr.
  *"Throughout the cataclysm and the epochs that followed, he retreated into a hidden pocket dimension — a refuge woven from stolen time."*

**`art_s1_char_043.png`** | unit | legendary | 8mana | 11/11
  The Programmer
  Prompt: CHARACTER: The Programmer, legendary unit. LEGENDARY: dramatic golden backlighting, epic sense of scale. Lore: A. The Programmer was a visionary scientist and philosopher whose intellectual curiosity led to the creation of Logos , . Palette: Amber (#f59e0b), aged parchment, hourglass gold, t. Style: Museum of collapsed timelines. Hourglasses and fossils. Libr.
  *"A. The Programmer was a visionary scientist and philosopher whose intellectual curiosity led to the creation of Logos , ..."*

**`art_s1_char_058.png`** | unit | legendary | 8mana | 9/10
  Epoch Walker
  Prompt: CHARACTER: Epoch Walker, legendary unit. after-image effect, dual presence. cracking cocoon, emerging form, phoenix embers. LEGENDARY: dramatic golden backlighting, epic sense of scale. Lore: He has already lived through the end of every age. Each death is merely a bookmark in a story he has read before.. Palette: Amber (#f59e0b), aged parchment, hourglass gold, t. Style: Museum of collapsed timelines. Hourglasses and fossils. Libr.
  *"He has already lived through the end of every age. Each death is merely a bookmark in a story he has read before."*

**`art_s1_char_059.png`** | unit | rare | 5mana | 5/6
  Chronosplicer
  Prompt: CHARACTER: Chronosplicer, rare unit. after-image effect, dual presence. Lore: She cuts time the way a surgeon cuts flesh — precisely, and without remorse.. Palette: Amber (#f59e0b), aged parchment, hourglass gold, t. Style: Museum of collapsed timelines. Hourglasses and fossils. Libr.
  *"She cuts time the way a surgeon cuts flesh — precisely, and without remorse."*

**`art_s1_char_060.png`** | unit | common | 2mana | 2/3
  Relic Keeper
  Prompt: CHARACTER: Relic Keeper, common unit. hexagonal energy shield shimmer. Lore: The relics protect themselves. She merely gives them someone to protect.. Palette: Amber (#f59e0b), aged parchment, hourglass gold, t. Style: Museum of collapsed timelines. Hourglasses and fossils. Libr.
  *"The relics protect themselves. She merely gives them someone to protect."*

**`art_s1_char_062.png`** | unit | common | 4mana | 5/4
  Hourglass Golem
  Prompt: CHARACTER: Hourglass Golem, common unit. defensive stance, shield or barrier aura. Lore: When the last grain falls, the golem shatters — and time resumes its march.. Palette: Amber (#f59e0b), aged parchment, hourglass gold, t. Style: Museum of collapsed timelines. Hourglasses and fossils. Libr.
  *"When the last grain falls, the golem shatters — and time resumes its march."*

**`art_s1_char_063.png`** | unit | common | 1mana | 1/2
  Paradox Acolyte
  Prompt: CHARACTER: Paradox Acolyte, common unit. cracking cocoon, emerging form, phoenix embers. Lore: She has died a hundred times and learned nothing from any of them.. Palette: Amber (#f59e0b), aged parchment, hourglass gold, t. Style: Museum of collapsed timelines. Hourglasses and fossils. Libr.
  *"She has died a hundred times and learned nothing from any of them."*

**`art_s1_char_064.png`** | unit | rare | 3mana | 4/3
  Memory Thief
  Prompt: CHARACTER: Memory Thief, rare unit. emerging from shadows, dagger drawn. life-energy tendrils being siphoned. Lore: He takes only what you will not miss — until you reach for it and find nothing there.. Palette: Amber (#f59e0b), aged parchment, hourglass gold, t. Style: Museum of collapsed timelines. Hourglasses and fossils. Libr.
  *"He takes only what you will not miss — until you reach for it and find nothing there."*

**`art_s1_char_065.png`** | unit | epic | 6mana | 7/7
  Age-Ender
  Prompt: CHARACTER: Age-Ender, epic unit. weapon glowing with penetrating energy. hexagonal energy shield shimmer. dramatic volumetric lighting, strong presence. Lore: It does not destroy civilizations. It simply marks where one ends and silence begins.. Palette: Amber (#f59e0b), aged parchment, hourglass gold, t. Style: Museum of collapsed timelines. Hourglasses and fossils. Libr.
  *"It does not destroy civilizations. It simply marks where one ends and silence begins."*

**`art_s1_char_097.png`** | unit | uncommon | 3mana | 3/4
  Temporal Archivist
  Prompt: CHARACTER: Temporal Archivist, uncommon unit. organic growth patterns, expanding form. Lore: Every war she catalogues makes the next one easier to survive.. Palette: Amber (#f59e0b), aged parchment, hourglass gold, t. Style: Museum of collapsed timelines. Hourglasses and fossils. Libr.
  *"Every war she catalogues makes the next one easier to survive."*

**`art_s1_char_121.png`** | unit | epic | 6mana | 4/8
  Epoch Watcher
  Prompt: CHARACTER: Epoch Watcher, epic unit. dramatic volumetric lighting, strong presence. Lore: It has seen empires rise and fall a thousand times. Each wound is just another memory it has already forgotten.. Palette: Amber (#f59e0b), aged parchment, hourglass gold, t. Style: Museum of collapsed timelines. Hourglasses and fossils. Libr.
  *"It has seen empires rise and fall a thousand times. Each wound is just another memory it has already forgotten."*

**`art_s1_char_122.png`** | unit | rare | 5mana | 3/5
  Timeline Splitter
  Prompt: CHARACTER: Timeline Splitter, rare unit. Lore: You were never here. The Splitter does not argue this point — she simply makes it true.. Palette: Amber (#f59e0b), aged parchment, hourglass gold, t. Style: Museum of collapsed timelines. Hourglasses and fossils. Libr.
  *"You were never here. The Splitter does not argue this point — she simply makes it true."*

**`art_s1_char_123.png`** | unit | common | 2mana | 2/2
  Relic Scholar
  Prompt: CHARACTER: Relic Scholar, common unit. Lore: The relic hums in her hands. A thousand years of silence, broken by the touch of someone who finally understands.. Palette: Amber (#f59e0b), aged parchment, hourglass gold, t. Style: Museum of collapsed timelines. Hourglasses and fossils. Libr.
  *"The relic hums in her hands. A thousand years of silence, broken by the touch of someone who finally understands."*

**`art_s1_char_124.png`** | unit | common | 3mana | 2/3
  Age Walker
  Prompt: CHARACTER: Age Walker, common unit. organic growth patterns, expanding form. Lore: It was small when the first age began. By the third, armies feared it. By the seventh, they worshipped it.. Palette: Amber (#f59e0b), aged parchment, hourglass gold, t. Style: Museum of collapsed timelines. Hourglasses and fossils. Libr.
  *"It was small when the first age began. By the third, armies feared it. By the seventh, they worshipped it."*

**`art_s1_char_201.png`** | unit | common | 3mana | 2/6
  Chronoguard Sentinel
  Prompt: CHARACTER: Chronoguard Sentinel, common unit. defensive stance, shield or barrier aura. Lore: It has stood here for a thousand years. It will stand here for a thousand more.. Palette: Amber (#f59e0b), aged parchment, hourglass gold, t. Style: Museum of collapsed timelines. Hourglasses and fossils. Libr.
  *"It has stood here for a thousand years. It will stand here for a thousand more."*

**`art_s1_spell_120.png`** | spell | rare | 7mana | n/a
  Timeline Collapse
  Prompt: SPELL EFFECT: Timeline Collapse, abstract energy manifestation, no character — pure magical force. Lore: The Antiquarian closed the book of this Age. Its pages unraveled like ash, and the board stood empty — waiting to be wri. Palette: Amber (#f59e0b), aged parchment, hourglass gold, t. Style: Museum of collapsed timelines. Hourglasses and fossils. Libr.
  *"The Antiquarian closed the book of this Age. Its pages unraveled like ash, and the board stood empty — waiting to be written again."*

**`art_s1_spell_121.png`** | spell | common | 2mana | n/a
  Epoch Rewind
  Prompt: SPELL EFFECT: Epoch Rewind, abstract energy manifestation, no character — pure magical force. Lore: The wound was real. The scar was earned. But the Antiquarian remembers a version of you that never bled, and that versio. Palette: Amber (#f59e0b), aged parchment, hourglass gold, t. Style: Museum of collapsed timelines. Hourglasses and fossils. Libr.
  *"The wound was real. The scar was earned. But the Antiquarian remembers a version of you that never bled, and that version is more useful now."*

**`art_s1_spell_122.png`** | spell | uncommon | 3mana | n/a
  Archaeological Dig
  Prompt: SPELL EFFECT: Archaeological Dig, abstract energy manifestation, no character — pure magical force. Lore: Three Ages buried beneath the current one, each with its own truths. The Antiquarian keeps only what the next Age will n. Palette: Amber (#f59e0b), aged parchment, hourglass gold, t. Style: Museum of collapsed timelines. Hourglasses and fossils. Libr.
  *"Three Ages buried beneath the current one, each with its own truths. The Antiquarian keeps only what the next Age will need."*

**`art_s1_spell_230.png`** | spell | common | 1mana | n/a
  Chrono Anchor
  Prompt: SPELL EFFECT: Chrono Anchor, abstract energy manifestation, no character — pure magical force. Lore: The wound closes. Not because it healed, but because it never happened.. Palette: Amber (#f59e0b), aged parchment, hourglass gold, t. Style: Museum of collapsed timelines. Hourglasses and fossils. Libr.
  *"The wound closes. Not because it healed, but because it never happened."*

**`art_s1_spell_231.png`** | spell | uncommon | 3mana | n/a
  Temporal Fracture
  Prompt: SPELL EFFECT: Temporal Fracture, abstract energy manifestation, no character — pure magical force. Lore: The clock hands stop. The pendulum hangs mid-swing. Only the Antiquarian still moves.. Palette: Amber (#f59e0b), aged parchment, hourglass gold, t. Style: Museum of collapsed timelines. Hourglasses and fossils. Libr.
  *"The clock hands stop. The pendulum hangs mid-swing. Only the Antiquarian still moves."*

**`art_s1_spell_232.png`** | spell | common | 2mana | n/a
  Fossil Record
  Prompt: SPELL EFFECT: Fossil Record, abstract energy manifestation, no character — pure magical force. Lore: In the stone are the bones of what came before. In the bones is the blueprint of what comes next.. Palette: Amber (#f59e0b), aged parchment, hourglass gold, t. Style: Museum of collapsed timelines. Hourglasses and fossils. Libr.
  *"In the stone are the bones of what came before. In the bones is the blueprint of what comes next."*

**`art_s1_spell_233.png`** | spell | rare | 4mana | n/a
  Era Shift
  Prompt: SPELL EFFECT: Era Shift, abstract energy manifestation, no character — pure magical force. Lore: One moment you stand in the present. The next, you are buried in an age that forgot your name.. Palette: Amber (#f59e0b), aged parchment, hourglass gold, t. Style: Museum of collapsed timelines. Hourglasses and fossils. Libr.
  *"One moment you stand in the present. The next, you are buried in an age that forgot your name."*

**`art_s1_spell_234.png`** | spell | common | 2mana | n/a
  Preservation Field
  Prompt: SPELL EFFECT: Preservation Field, abstract energy manifestation, no character — pure magical force. Lore: The field hums with deep time. Inside it, entropy is merely a suggestion.. Palette: Amber (#f59e0b), aged parchment, hourglass gold, t. Style: Museum of collapsed timelines. Hourglasses and fossils. Libr.
  *"The field hums with deep time. Inside it, entropy is merely a suggestion."*

**`art_s1_spell_235.png`** | spell | rare | 5mana | n/a
  Age of Silence
  Prompt: SPELL EFFECT: Age of Silence, abstract energy manifestation, no character — pure magical force. Lore: Before the first word was spoken, there was the silence. The Antiquarian remembers it well.. Palette: Amber (#f59e0b), aged parchment, hourglass gold, t. Style: Museum of collapsed timelines. Hourglasses and fossils. Libr.
  *"Before the first word was spoken, there was the silence. The Antiquarian remembers it well."*

### THOUGHT VIRUS (28 cards)
**Palette**: Toxic green (#84cc16), void black, corruption pink (#ec4899), bio-luminescent
**Faction aesthetic**: Biological horror meets digital infection. Neural networks corrupted. Dissolving flesh and code. Beautiful decay.

**`art_gen_thought_virus.png`** | general | basic | 0mana | 2/25
  The Source
  Prompt: GENERAL PORTRAIT: The Source, commanding faction leader, full figure, epic scale. Lore: He stole Ark 1047 already contaminated. The virus consumed him memory-by-memory. Now he IS the infection.. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"He stole Ark 1047 already contaminated. The virus consumed him memory-by-memory. Now he IS the infection."*

**`art_s1_char_032.png`** | unit | uncommon | 2mana | 4/5
  The Host
  Prompt: CHARACTER: The Host, uncommon unit. Lore: Once a Potential, forged from the Architect\u2019s legacy of preserved DNA and machine code, this being once carried the. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"Once a Potential, forged from the Architect\u2019s legacy of preserved DNA and machine code, this being once carried the spar..."*

**`art_s1_char_049.png`** | unit | legendary | 7mana | 8/12
  The Source
  Prompt: CHARACTER: The Source, legendary unit. LEGENDARY: dramatic golden backlighting, epic sense of scale. Lore: Yet, through the twisted schemes of Project Vector, Kael\u2019s fate was reshaped into something monstrous and eternal. . Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"Yet, through the twisted schemes of Project Vector, Kael\u2019s fate was reshaped into something monstrous and eternal. Infec..."*

**`art_s1_char_070.png`** | unit | legendary | 7mana | 8/9
  Patient Zero
  Prompt: CHARACTER: Patient Zero, legendary unit. surrounded by spectral skulls, death energy wisps. life-energy tendrils being siphoned. LEGENDARY: dramatic golden backlighting, epic sense of scale. Lore: The first mind to crack open and let the signal through. Every infection since has been an echo of that original scream.. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"The first mind to crack open and let the signal through. Every infection since has been an echo of that original scream."*

**`art_s1_char_071.png`** | unit | common | 1mana | 2/1
  Neural Parasite
  Prompt: CHARACTER: Neural Parasite, common unit. motion blur, speed lines. Lore: It burrows through the ear canal and nests in the hippocampus. By then, you are already someone else.. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"It burrows through the ear canal and nests in the hippocampus. By then, you are already someone else."*

**`art_s1_char_072.png`** | unit | common | 2mana | 2/3
  Memetic Carrier
  Prompt: CHARACTER: Memetic Carrier, common unit. surrounded by spectral skulls, death energy wisps. Lore: It does not spread through contact. It spreads through comprehension.. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"It does not spread through contact. It spreads through comprehension."*

**`art_s1_char_073.png`** | unit | uncommon | 3mana | 4/3
  Cognitive Blight
  Prompt: CHARACTER: Cognitive Blight, uncommon unit. weapon glowing with penetrating energy. Lore: It rewrites your beliefs one synapse at a time, until loyalty feels like a foreign language.. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"It rewrites your beliefs one synapse at a time, until loyalty feels like a foreign language."*

**`art_s1_char_074.png`** | unit | common | 3mana | 2/5
  Vector Swarm
  Prompt: CHARACTER: Vector Swarm, common unit. cracking cocoon, emerging form, phoenix embers. Lore: Kill it and it splits. Burn it and it drifts. Ignore it and you are already too late.. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"Kill it and it splits. Burn it and it drifts. Ignore it and you are already too late."*

**`art_s1_char_075.png`** | unit | rare | 4mana | 4/5
  Plague Herald
  Prompt: CHARACTER: Plague Herald, rare unit. crackling unstable energy, electrical arcs. life-energy tendrils being siphoned. Lore: His sermons are not metaphors. Every word is a live pathogen.. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"His sermons are not metaphors. Every word is a live pathogen."*

**`art_s1_char_076.png`** | unit | epic | 6mana | 7/6
  Synaptic Horror
  Prompt: CHARACTER: Synaptic Horror, epic unit. emerging from shadows, dagger drawn. surrounded by spectral skulls, death energy wisps. dramatic volumetric lighting, strong presence. Lore: It lives in the gap between a dying thought and the silence that follows.. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"It lives in the gap between a dying thought and the silence that follows."*

**`art_s1_char_077.png`** | unit | rare | 5mana | 6/5
  Mind Rot Drone
  Prompt: CHARACTER: Mind Rot Drone, rare unit. hovering/levitating, wings or anti-grav. weapon glowing with penetrating energy. Lore: It circles above the battlefield like a vulture — except it feeds on sanity, not carrion.. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"It circles above the battlefield like a vulture — except it feeds on sanity, not carrion."*

**`art_s1_char_113.png`** | unit | legendary | 8mana | 6/10
  Terminus Sovereign
  Prompt: CHARACTER: Terminus Sovereign, legendary unit. LEGENDARY: dramatic golden backlighting, epic sense of scale. Lore: The first bowl is doubt. The second is fear. By the seventh, you have forgotten what it was to be whole.. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"The first bowl is doubt. The second is fear. By the seventh, you have forgotten what it was to be whole."*

**`art_s1_char_114.png`** | unit | rare | 3mana | 2/3
  Viral Vector
  Prompt: CHARACTER: Viral Vector, rare unit. Lore: Do not kill it. Do not touch it. Do not look at it too long. The infection reads your attention as an invitation.. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"Do not kill it. Do not touch it. Do not look at it too long. The infection reads your attention as an invitation."*

**`art_s1_char_115.png`** | unit | common | 2mana | 3/2
  Consumed Host
  Prompt: CHARACTER: Consumed Host, common unit. motion blur, speed lines. Lore: The body runs. The mind is already gone. What remains is hunger wearing a human shape.. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"The body runs. The mind is already gone. What remains is hunger wearing a human shape."*

**`art_s1_char_116.png`** | unit | uncommon | 4mana | 3/5
  Neural Plague Carrier
  Prompt: CHARACTER: Neural Plague Carrier, uncommon unit. surrounded by spectral skulls, death energy wisps. Lore: It smiles when soldiers fall. Not from malice — the Virus has rewired joy to the frequency of dying screams.. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"It smiles when soldiers fall. Not from malice — the Virus has rewired joy to the frequency of dying screams."*

**`art_s1_char_200.png`** | unit | uncommon | 4mana | 3/5
  Cortex Ravager
  Prompt: CHARACTER: Cortex Ravager, uncommon unit. Lore: It does not speak. It does not need to. Every blow is a sentence erased from your memory.. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"It does not speak. It does not need to. Every blow is a sentence erased from your memory."*

**`art_s1_spell_112.png`** | spell | uncommon | 4mana | n/a
  Viral Cascade
  Prompt: SPELL EFFECT: Viral Cascade, abstract energy manifestation, no character — pure magical force. Lore: The Source does not kill. It simply reminds every cell in your body that it was always meant to stop.. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"The Source does not kill. It simply reminds every cell in your body that it was always meant to stop."*

**`art_s1_spell_113.png`** | spell | common | 2mana | n/a
  Memory Consumption
  Prompt: SPELL EFFECT: Memory Consumption, abstract energy manifestation, no character — pure magical force. Lore: It ate his name first, then his childhood. By the time it reached his fears, there was nothing left to be afraid.. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"It ate his name first, then his childhood. By the time it reached his fears, there was nothing left to be afraid."*

**`art_s1_spell_114.png`** | spell | rare | 5mana | n/a
  Neural Overwrite
  Prompt: SPELL EFFECT: Neural Overwrite, abstract energy manifestation, no character — pure magical force. Lore: The soldier's eyes went blank mid-sentence. When he spoke again, it was in the Source's voice, thanking them for the ves. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"The soldier's eyes went blank mid-sentence. When he spoke again, it was in the Source's voice, thanking them for the vessel."*

**`art_s1_spell_115.png`** | spell | common | 3mana | n/a
  Nihilistic Mercy
  Prompt: SPELL EFFECT: Nihilistic Mercy, abstract energy manifestation, no character — pure magical force. Lore: The Source does not prolong agony. It simply asks: why continue? And the body, at last, agrees.. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"The Source does not prolong agony. It simply asks: why continue? And the body, at last, agrees."*

**`art_s1_spell_218.png`** | spell | common | 1mana | n/a
  Infection Vector
  Prompt: SPELL EFFECT: Infection Vector, abstract energy manifestation, no character — pure magical force. Lore: It starts as a whisper in the neurons. By tomorrow, the arm won't lift.. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"It starts as a whisper in the neurons. By tomorrow, the arm won't lift."*

**`art_s1_spell_219.png`** | spell | uncommon | 3mana | n/a
  Plague Wind
  Prompt: SPELL EFFECT: Plague Wind, abstract energy manifestation, no character — pure magical force. Lore: The wind carries more than dust. It carries the end of thought.. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"The wind carries more than dust. It carries the end of thought."*

**`art_s1_spell_220.png`** | spell | rare | 4mana | n/a
  Assimilate
  Prompt: SPELL EFFECT: Assimilate, abstract energy manifestation, no character — pure magical force. Lore: The host collapses. Something new rises from the remains, wearing a familiar face.. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"The host collapses. Something new rises from the remains, wearing a familiar face."*

**`art_s1_spell_221.png`** | spell | common | 2mana | n/a
  Cognitive Decay
  Prompt: SPELL EFFECT: Cognitive Decay, abstract energy manifestation, no character — pure magical force. Lore: What was I going to — no. It's gone. It was important, wasn't it?. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"What was I going to — no. It's gone. It was important, wasn't it?"*

**`art_s1_spell_222.png`** | spell | rare | 5mana | n/a
  Terminal Stage
  Prompt: SPELL EFFECT: Terminal Stage, abstract energy manifestation, no character — pure magical force. Lore: By the time the symptoms manifest, the prognosis is already written.. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"By the time the symptoms manifest, the prognosis is already written."*

**`art_s1_spell_223.png`** | spell | common | 2mana | n/a
  Spore Burst
  Prompt: SPELL EFFECT: Spore Burst, abstract energy manifestation, no character — pure magical force. Lore: It lands softly, barely noticed. By the time you notice, the battlefield is a garden of infection.. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"It lands softly, barely noticed. By the time you notice, the battlefield is a garden of infection."*

**`art_tok_infected_2_2.png`** | token | basic | 0mana | 2/2
  Infected
  Prompt: SUMMONED TOKEN: Infected, small ephemeral creature/construct, glowing translucent. Lore: What was once a person is now a vessel. The Virus wears their face but not their name.. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"What was once a person is now a vessel. The Virus wears their face but not their name."*

**`art_tok_spore_1_1.png`** | token | basic | 0mana | 1/1
  Spore
  Prompt: SUMMONED TOKEN: Spore, small ephemeral creature/construct, glowing translucent. Lore: It feeds on endings. Every death is a season of plenty.. Palette: Toxic green (#84cc16), void black, corruption pink. Style: Biological horror meets digital infection. Neural networks c.
  *"It feeds on endings. Every death is a season of plenty."*

### NEUTRAL (24 cards)
**Palette**: White (#f1f5f9), silver, starfield blue, ark hull grey
**Faction aesthetic**: The Inception Ark. Cryo-chambers. Ship corridors. Holographic interfaces. The void of space.

**`art_gen_neutral.png`** | general | basic | 0mana | 2/25
  Elara
  Prompt: GENERAL PORTRAIT: Elara, commanding faction leader, full figure, epic scale. Lore: Created to serve the Empire. Chose to protect the Potentials instead. Compassion is the most defiant subroutine.. Palette: White (#f1f5f9), silver, starfield blue, ark hull . Style: The Inception Ark. Cryo-chambers. Ship corridors. Holographi.
  *"Created to serve the Empire. Chose to protect the Potentials instead. Compassion is the most defiant subroutine."*

**`art_s1_char_004.png`** | unit | uncommon | 2mana | 5/4
  Ambassador Veron
  Prompt: CHARACTER: Ambassador Veron, uncommon unit. Lore: Posing as a diplomat from the neutral planet Thessolar, she utilized this cover to engage in diplomatic relations with v. Palette: White (#f1f5f9), silver, starfield blue, ark hull . Style: The Inception Ark. Cryo-chambers. Ship corridors. Holographi.
  *"Posing as a diplomat from the neutral planet Thessolar, she utilized this cover to engage in diplomatic relations with various factions."*

**`art_s1_char_086.png`** | unit | common | 2mana | 2/3
  Wandering Merchant
  Prompt: CHARACTER: Wandering Merchant, common unit. Lore: He sells to all sides and swears allegiance to none. Coin is the only faction that never falls.. Palette: White (#f1f5f9), silver, starfield blue, ark hull . Style: The Inception Ark. Cryo-chambers. Ship corridors. Holographi.
  *"He sells to all sides and swears allegiance to none. Coin is the only faction that never falls."*

**`art_s1_char_087.png`** | unit | common | 4mana | 5/4
  Scrapyard Golem
  Prompt: CHARACTER: Scrapyard Golem, common unit. defensive stance, shield or barrier aura. Lore: It was built from the wreckage of a dozen machines, none of which were designed to kill. It learned that part on its own. Palette: White (#f1f5f9), silver, starfield blue, ark hull . Style: The Inception Ark. Cryo-chambers. Ship corridors. Holographi.
  *"It was built from the wreckage of a dozen machines, none of which were designed to kill. It learned that part on its own."*

**`art_s1_char_088.png`** | unit | uncommon | 3mana | 2/4
  Field Medic
  Prompt: CHARACTER: Field Medic, uncommon unit. life-energy tendrils being siphoned. Lore: She does not ask which side you fight for. Only where it hurts.. Palette: White (#f1f5f9), silver, starfield blue, ark hull . Style: The Inception Ark. Cryo-chambers. Ship corridors. Holographi.
  *"She does not ask which side you fight for. Only where it hurts."*

**`art_s1_char_089.png`** | unit | common | 1mana | 1/1
  Courier Sprite
  Prompt: CHARACTER: Courier Sprite, common unit. hovering/levitating, wings or anti-grav. motion blur, speed lines. Lore: It carries messages no one else dares to deliver — and pays for it with its brief, bright life.. Palette: White (#f1f5f9), silver, starfield blue, ark hull . Style: The Inception Ark. Cryo-chambers. Ship corridors. Holographi.
  *"It carries messages no one else dares to deliver — and pays for it with its brief, bright life."*

**`art_s1_char_090.png`** | unit | uncommon | 3mana | 4/3
  Hired Blade
  Prompt: CHARACTER: Hired Blade, uncommon unit. motion blur, speed lines. Lore: Loyalty is expensive. Disloyalty, more so.. Palette: White (#f1f5f9), silver, starfield blue, ark hull . Style: The Inception Ark. Cryo-chambers. Ship corridors. Holographi.
  *"Loyalty is expensive. Disloyalty, more so."*

**`art_s1_char_091.png`** | unit | common | 2mana | 2/2
  Border Scout
  Prompt: CHARACTER: Border Scout, common unit. ranged weapon, targeting reticle glow. emerging from shadows, dagger drawn. Lore: The borderlands belong to no faction — only to those quiet enough to survive them.. Palette: White (#f1f5f9), silver, starfield blue, ark hull . Style: The Inception Ark. Cryo-chambers. Ship corridors. Holographi.
  *"The borderlands belong to no faction — only to those quiet enough to survive them."*

**`art_s1_char_092.png`** | unit | rare | 5mana | 6/5
  Ruin Stalker
  Prompt: CHARACTER: Ruin Stalker, rare unit. emerging from shadows, dagger drawn. weapon glowing with penetrating energy. Lore: In the ruins of the old world, something still hunts. It does not remember what it was — only what it is hungry for.. Palette: White (#f1f5f9), silver, starfield blue, ark hull . Style: The Inception Ark. Cryo-chambers. Ship corridors. Holographi.
  *"In the ruins of the old world, something still hunts. It does not remember what it was — only what it is hungry for."*

**`art_s1_char_093.png`** | unit | legendary | 7mana | 7/9
  Ironclad Veteran
  Prompt: CHARACTER: Ironclad Veteran, legendary unit. defensive stance, shield or barrier aura. hexagonal energy shield shimmer. cracking cocoon, emerging form, phoenix embers. LEGENDARY: dramatic golden backlighting, epic sense of scale. Lore: He has buried allies under every banner. Now he fights only for the war itself — because it is the one thing that never . Palette: White (#f1f5f9), silver, starfield blue, ark hull . Style: The Inception Ark. Cryo-chambers. Ship corridors. Holographi.
  *"He has buried allies under every banner. Now he fights only for the war itself — because it is the one thing that never abandoned him."*

**`art_s1_song_059.png`** | spell | rare | 4mana | n/a
  Lip Service
  Prompt: SPELL EFFECT: Lip Service, abstract energy manifestation, no character — pure magical force. Lore: Words may be hollow, but the right incantation can turn them into a barrier no blade can breach.. Palette: White (#f1f5f9), silver, starfield blue, ark hull . Style: The Inception Ark. Cryo-chambers. Ship corridors. Holographi.
  *"Words may be hollow, but the right incantation can turn them into a barrier no blade can breach."*

**`art_s1_song_060.png`** | spell | rare | 5mana | n/a
  N\u00D8NOS
  Prompt: SPELL EFFECT: N\u00D8NOS, abstract energy manifestation, no character — pure magical force. life-energy tendrils being siphoned. Lore: The melody seeps into open wounds, knitting flesh and spirit back together in a single refrain.. Palette: White (#f1f5f9), silver, starfield blue, ark hull . Style: The Inception Ark. Cryo-chambers. Ship corridors. Holographi.
  *"The melody seeps into open wounds, knitting flesh and spirit back together in a single refrain."*

**`art_s1_song_061.png`** | spell | common | 1mana | n/a
  The Enigma's Lament
  Prompt: SPELL EFFECT: The Enigma's Lament, abstract energy manifestation, no character — pure magical force. Lore: A haunting meditation on identity and loss, this song channels the voice of The Enigma, the mysterious entity whose true. Palette: White (#f1f5f9), silver, starfield blue, ark hull . Style: The Inception Ark. Cryo-chambers. Ship corridors. Holographi.
  *"A haunting meditation on identity and loss, this song channels the voice of The Enigma, the mysterious entity whose true nature is never what it first"*

**`art_s1_song_062.png`** | spell | uncommon | 3mana | n/a
  The Two Witnesses
  Prompt: SPELL EFFECT: The Two Witnesses, abstract energy manifestation, no character — pure magical force. crackling unstable energy, electrical arcs. Lore: They speak in unison, and where their voices converge, the world fractures.. Palette: White (#f1f5f9), silver, starfield blue, ark hull . Style: The Inception Ark. Cryo-chambers. Ship corridors. Holographi.
  *"They speak in unison, and where their voices converge, the world fractures."*

**`art_s1_song_063.png`** | spell | common | 2mana | n/a
  Building the Architect
  Prompt: SPELL EFFECT: Building the Architect, abstract energy manifestation, no character — pure magical force. life-energy tendrils being siphoned. Lore: Every blueprint begins with a wound; every structure, with the will to mend it.. Palette: White (#f1f5f9), silver, starfield blue, ark hull . Style: The Inception Ark. Cryo-chambers. Ship corridors. Holographi.
  *"Every blueprint begins with a wound; every structure, with the will to mend it."*

**`art_s1_song_064.png`** | spell | epic | 6mana | n/a
  Dischordian Logic
  Prompt: SPELL EFFECT: Dischordian Logic, abstract energy manifestation, no character — pure magical force. crackling unstable energy, electrical arcs. dramatic volumetric lighting, strong presence. Lore: In the paradox engine of Dischord, contradictions are not errors — they are ammunition.. Palette: White (#f1f5f9), silver, starfield blue, ark hull . Style: The Inception Ark. Cryo-chambers. Ship corridors. Holographi.
  *"In the paradox engine of Dischord, contradictions are not errors — they are ammunition."*

**`art_s1_song_065.png`** | spell | rare | 5mana | n/a
  Sixth Sense
  Prompt: SPELL EFFECT: Sixth Sense, abstract energy manifestation, no character — pure magical force. life-energy tendrils being siphoned. Lore: Some call it intuition, others call it premonition — the healed simply call it a second chance.. Palette: White (#f1f5f9), silver, starfield blue, ark hull . Style: The Inception Ark. Cryo-chambers. Ship corridors. Holographi.
  *"Some call it intuition, others call it premonition — the healed simply call it a second chance."*

**`art_s1_song_066.png`** | spell | epic | 4mana | n/a
  The Book of Daniel 2.0
  Prompt: SPELL EFFECT: The Book of Daniel 2.0, abstract energy manifestation, no character — pure magical force. dramatic volumetric lighting, strong presence. Lore: The second edition rewrites prophecy as a weapon — shield in one hand, fire in the other.. Palette: White (#f1f5f9), silver, starfield blue, ark hull . Style: The Inception Ark. Cryo-chambers. Ship corridors. Holographi.
  *"The second edition rewrites prophecy as a weapon — shield in one hand, fire in the other."*

**`art_s1_song_070.png`** | spell | uncommon | 3mana | n/a
  Traces of Something Spiritual
  Prompt: SPELL EFFECT: Traces of Something Spiritual, abstract energy manifestation, no character — pure magical force. Lore: Not a ghost, not a god — something in between, lingering at the threshold of perception.. Palette: White (#f1f5f9), silver, starfield blue, ark hull . Style: The Inception Ark. Cryo-chambers. Ship corridors. Holographi.
  *"Not a ghost, not a god — something in between, lingering at the threshold of perception."*

**`art_s1_song_079.png`** | spell | common | 2mana | n/a
  Shades of Grey
  Prompt: SPELL EFFECT: Shades of Grey, abstract energy manifestation, no character — pure magical force. Lore: Between black and white lies a spectrum of doubt — and within it, a fragile protection.. Palette: White (#f1f5f9), silver, starfield blue, ark hull . Style: The Inception Ark. Cryo-chambers. Ship corridors. Holographi.
  *"Between black and white lies a spectrum of doubt — and within it, a fragile protection."*

**`art_s1_song_084.png`** | spell | uncommon | 2mana | n/a
  Judgment Day
  Prompt: SPELL EFFECT: Judgment Day, abstract energy manifestation, no character — pure magical force. Lore: When the reckoning arrives, only the shielded will endure its verdict.. Palette: White (#f1f5f9), silver, starfield blue, ark hull . Style: The Inception Ark. Cryo-chambers. Ship corridors. Holographi.
  *"When the reckoning arrives, only the shielded will endure its verdict."*

**`art_s1_spell_123.png`** | spell | common | 4mana | n/a
  Dischordian Logic
  Prompt: SPELL EFFECT: Dischordian Logic, abstract energy manifestation, no character — pure magical force. Lore: The Cycle cares nothing for allegiance. When it turns, everything in its path is ground to equal dust.. Palette: White (#f1f5f9), silver, starfield blue, ark hull . Style: The Inception Ark. Cryo-chambers. Ship corridors. Holographi.
  *"The Cycle cares nothing for allegiance. When it turns, everything in its path is ground to equal dust."*

**`art_s1_spell_124.png`** | spell | common | 2mana | n/a
  Ark Emergency Protocol
  Prompt: SPELL EFFECT: Ark Emergency Protocol, abstract energy manifestation, no character — pure magical force. Lore: The Ark was built to endure the end of Ages. Its emergency systems still hum in the walls, waiting for someone desperate. Palette: White (#f1f5f9), silver, starfield blue, ark hull . Style: The Inception Ark. Cryo-chambers. Ship corridors. Holographi.
  *"The Ark was built to endure the end of Ages. Its emergency systems still hum in the walls, waiting for someone desperate enough to ask."*

**`art_token_wolf_2_2.png`** | token | basic | 0mana | 2/2
  Wolf
  Prompt: SUMMONED TOKEN: Wolf, small ephemeral creature/construct, glowing translucent. Lore: A spectral wolf, bound by lunar magic to fight at its master's side.. Palette: White (#f1f5f9), silver, starfield blue, ark hull . Style: The Inception Ark. Cryo-chambers. Ship corridors. Holographi.
  *"A spectral wolf, bound by lunar magic to fight at its master's side."*

