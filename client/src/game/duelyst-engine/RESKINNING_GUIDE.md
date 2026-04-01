# Duelyst Engine — Reskinning Guide for The Dischordian Saga

This directory contains the **complete Open Duelyst source code** (v1.97.13), ready for reskinning into The Dischordian Saga universe. The game runs as a standalone Cocos2d-HTML5 application served at `/duelyst-classic/`.

---

## Architecture Overview

```
duelyst-engine/
├── sdk/                    ← CORE GAME LOGIC (1,375 files, CoffeeScript)
│   ├── gameSession.coffee  ← Main game loop, turn management
│   ├── cards/              ← All card definitions (factory pattern)
│   │   ├── factory/core/   ← Card factories per faction (f1-f6)
│   │   └── factionsLookup.coffee ← Faction ID → name mapping
│   ├── entities/           ← Units, generals, tiles
│   ├── modifiers/          ← 718 card ability modifiers
│   ├── spells/             ← 257 spell implementations
│   ├── actions/            ← Game actions (attack, move, draw, etc.)
│   ├── challenges/         ← Single-player puzzle challenges
│   ├── codex/              ← In-game lore/codex entries
│   ├── achievements/       ← Achievement definitions
│   └── quests/             ← Daily quest definitions
│
├── view/                   ← RENDERING LAYER (223 files, CoffeeScript)
│   ├── layers/             ← Cocos2d scene layers (game, menu, etc.)
│   ├── nodes/              ← Visual nodes (cards, units, board, FX)
│   └── fx/                 ← Particle effects, visual FX
│
├── ui/                     ← USER INTERFACE (409 files)
│   ├── views/              ← Backbone/Marionette views
│   ├── views2/             ← Updated view components
│   └── templates/          ← Handlebars HTML templates
│
├── ai/                     ← AI OPPONENT (114 files, CoffeeScript)
│   ├── scoring/            ← Board evaluation & scoring
│   ├── card_intent/        ← Per-card AI behavior
│   └── phases/             ← AI decision phases
│
├── shaders/                ← GLSL SHADERS (98 files)
│   ├── BloomFragment.glsl  ← Bloom post-processing
│   ├── DissolveFragment.glsl ← Card dissolve effect
│   ├── EnergyFragment.glsl ← Energy/mana effects
│   └── ...                 ← 72 total shader programs
│
├── localization/           ← TEXT CONTENT (70 files)
│   └── locales/en/
│       ├── cards.json      ← All 1,636 card names & descriptions
│       ├── codex.json      ← Lore text
│       └── ...             ← UI strings, tutorials, etc.
│
├── vendor/                 ← THIRD-PARTY LIBRARIES
│   ├── cocos2d-html5/      ← Cocos2d-HTML5 v3.3 engine
│   └── ccConfig.js         ← Cocos2d configuration
│
├── config/                 ← Game configuration files
├── data/                   ← Static game data
├── common/                 ← Shared utilities
└── packages/               ← Local packages (chroma-js)
```

---

## Key Reskinning Targets

### 1. Factions (sdk/cards/factionsLookup.coffee)
The original 6 factions + Neutral:
- **Faction 1**: Lyonar Kingdoms → **Reskin to**: The Panopticon
- **Faction 2**: Songhai Empire → **Reskin to**: The Insurgency
- **Faction 3**: Vetruvian Imperium → **Reskin to**: The Syndicate
- **Faction 4**: Abyssian Host → **Reskin to**: The Necropolis
- **Faction 5**: Magmar Aspects → **Reskin to**: The Potentials
- **Faction 6**: Vanar Kindred → **Reskin to**: The Architects
- **Neutral**: → **Reskin to**: Unaligned / Mercenaries

### 2. Card Names & Descriptions (localization/locales/en/cards.json)
All 1,636 card names and flavor text are in this single JSON file. This is the fastest way to reskin the entire card set.

### 3. Unit Sprites (resources/units/)
696 sprite sheets (PNG + plist pairs). Each unit has:
- `*_idle.png/plist` — Standing animation
- `*_breathing.png/plist` — Idle breathing
- `*_run.png/plist` — Movement animation
- `*_attack.png/plist` — Attack animation
- `*_hit.png/plist` — Taking damage
- `*_death.png/plist` — Death animation
- `*_cast.png/plist` — Spell casting

### 4. General Portraits (resources/generals/)
124 general portrait images used in deck selection and in-game UI.

### 5. Battle Maps (resources/maps/)
54 battle map backgrounds. Replace with Dischordian Saga themed maps.

### 6. Music & SFX (resources/music/ and resources/sfx/)
22 music tracks and 671 sound effects.

### 7. UI Templates (ui/templates/)
Handlebars templates for all UI screens — login, collection, deck builder, shop, etc.

### 8. Codex/Lore (sdk/codex/ and localization/locales/en/codex.json)
In-game lore entries. Replace with Dischordian Saga lore from the Loredex.

### 9. Shaders (shaders/)
72 GLSL shaders for visual effects. These can be modified for faction-specific color schemes.

---

## Pre-Built Game Files

The running game uses pre-built bundles from Open Duelyst release v1.97.13:
- `server/duelyst-classic-assets/duelyst.js` — Compiled game bundle (10.2 MB)
- `server/duelyst-classic-assets/vendor.js` — Vendor libraries (2.1 MB)
- `server/duelyst-classic-assets/duelyst.css` — Styles (802 KB)

Resources are served from:
- `/home/ubuntu/webdev-static-assets/duelyst-classic/resources/` — All game assets (621 MB)

---

## Reskinning Workflow

### Phase 1: Text & Names (Quick Wins)
1. Edit `localization/locales/en/cards.json` — Rename all cards
2. Edit `sdk/cards/factionsLookup.coffee` — Rename factions
3. Edit `localization/locales/en/codex.json` — Replace lore text
4. Edit UI templates for branding changes

### Phase 2: Visual Assets
1. Replace unit sprite sheets in `resources/units/`
2. Replace general portraits in `resources/generals/`
3. Replace battle maps in `resources/maps/`
4. Update card art references

### Phase 3: Gameplay Modifications
1. Modify card abilities in `sdk/cards/factory/core/`
2. Adjust AI behavior in `ai/card_intent/`
3. Add new modifiers in `sdk/modifiers/`
4. Create new challenges in `sdk/challenges/`

### Phase 4: Rebuild
After modifying the CoffeeScript source, rebuild using:
```bash
cd duelyst-engine
npm install
npx gulp build
```
This produces new `duelyst.js` and `vendor.js` bundles.

---

## Important Notes

- The game uses **CoffeeScript** (not TypeScript/JavaScript) for game logic
- The rendering engine is **Cocos2d-HTML5 v3.3** (not Canvas2D or WebGL directly)
- The UI layer uses **Backbone.js + Marionette + Handlebars** (not React)
- Sprite sheets use the **plist + PNG** format (Cocos2d standard)
- The AI system is fully self-contained and can run without a server
- The game currently requires a server for multiplayer; single-player works with local AI
