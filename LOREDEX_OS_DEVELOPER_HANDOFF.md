# Loredex OS — Complete Developer Handoff Document

## The Dischordian Saga: Malkia Ukweli & the Panopticon

**Version**: 4.7.2  
**Date**: April 1, 2026  
**Project**: loredex-os  
**Stack**: React 19 + Tailwind CSS 4 + Express 4 + tRPC 11 + Drizzle ORM + MySQL/TiDB  
**Authentication**: Manus OAuth  
**Payments**: Stripe  

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture & Tech Stack](#2-architecture--tech-stack)
3. [Complete Feature Inventory](#3-complete-feature-inventory)
4. [The Lore — Complete Universe Bible](#4-the-lore--complete-universe-bible)
5. [Database Schema](#5-database-schema)
6. [API Layer — All tRPC Routers](#6-api-layer--all-trpc-routers)
7. [Frontend Pages](#7-frontend-pages)
8. [Game Engines](#8-game-engines)
9. [Components & Contexts](#9-components--contexts)
10. [Shared Modules & Data Files](#10-shared-modules--data-files)
11. [Server Infrastructure](#11-server-infrastructure)
12. [Environment & Configuration](#12-environment--configuration)
13. [Testing](#13-testing)
14. [Design Bibles & Production Documents](#14-design-bibles--production-documents)
15. [Pending Work & Known Issues](#15-pending-work--known-issues)
16. [Complete File Map](#16-complete-file-map)

---

## 1. Project Overview

Loredex OS is a full-stack interactive companion application for **The Dischordian Saga**, a transmedia universe created by **Malkia Ukweli** spanning music, visual storytelling, and interactive fiction. The application functions as a classified intelligence database, an interactive game platform, a music player, and a gateway into the mythology of the Panopticon.

The application is designed as a **mobile-first PWA** (Progressive Web App) with a cyberpunk/sci-fi aesthetic. Users play as **Potentials** — beings who have awakened aboard an **Inception Ark** (a spaceship), guided by an AI named **Elara**. The entire UI is themed as a ship's operating system, with features unlocked through exploration and narrative progression.

### Scale

| Metric | Count |
|--------|-------|
| Total lines of code (TS/TSX/CSS) | 192,612 |
| Source files | 475+ |
| Frontend pages | 82 |
| React components | 95+ |
| React contexts | 10 |
| Custom hooks | 7 |
| tRPC API routers | 50 |
| tRPC procedures | 500+ |
| Database tables | 100 |
| Vitest test files | 55 |
| Test cases | 2,028 |
| Loredex entries | 233 |
| Feature items tracked | 2,199 (2,064 completed, 135 pending) |
| JSON data lines | 17,928 |

---

## 2. Architecture & Tech Stack

### 2.1 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | React | 19.2.1 |
| CSS Framework | Tailwind CSS | 4.1.14 |
| UI Components | shadcn/ui (Radix primitives) | Latest |
| Routing | Wouter | 3.3.5 |
| State Management | React Context + tRPC React Query | - |
| Animation | Framer Motion | 12.23.22 |
| 3D Rendering | Three.js | 0.183.2 |
| 2D Game Engine | PixiJS | 8.0.0 |
| Charts | Recharts | 2.15.2 |
| Backend Framework | Express | 4.21.2 |
| API Layer | tRPC | 11.6.0 |
| ORM | Drizzle ORM | 0.44.5 |
| Database | MySQL / TiDB | - |
| Auth | Manus OAuth (JWT sessions) | - |
| Payments | Stripe | 20.4.1 |
| Blockchain | Ethers.js | 6.x |
| Image Processing | Sharp | 0.34.5 |
| Build Tool | Vite | 7.1.7 |
| TypeScript | TypeScript | 5.9.3 |
| Testing | Vitest | 2.1.4 |
| Package Manager | pnpm | 10.15.1 |

### 2.2 Project Structure

```
loredex-os/
├── client/                          # Frontend application
│   ├── public/                      # Static files (favicon, robots.txt, manifest)
│   ├── index.html                   # HTML entry point
│   └── src/
│       ├── _core/hooks/useAuth.ts   # Auth hook
│       ├── components/              # 95+ reusable components
│       │   └── ui/                  # shadcn/ui primitives
│       ├── contexts/                # 10 React contexts
│       ├── data/                    # Static data files (loredex, cards, lore)
│       ├── game/                    # Game engines (fight, card, chess, duelyst)
│       │   └── duelyst/             # Duelyst tactical card game engine
│       ├── hooks/                   # 7 custom hooks
│       ├── lib/                     # Utility libraries
│       ├── pages/                   # 82 page components
│       ├── App.tsx                  # Route definitions & layout
│       ├── const.ts                 # Frontend constants
│       ├── index.css                # Global styles & theme
│       └── main.tsx                 # App entry with providers
├── server/                          # Backend application
│   ├── _core/                       # Framework internals (DO NOT EDIT)
│   │   ├── context.ts               # tRPC context builder
│   │   ├── env.ts                   # Environment variables
│   │   ├── imageGeneration.ts       # AI image generation
│   │   ├── llm.ts                   # LLM integration
│   │   ├── notification.ts          # Owner notifications
│   │   ├── oauth.ts                 # OAuth handler
│   │   ├── sdk.ts                   # Manus SDK
│   │   ├── trpc.ts                  # tRPC base procedures
│   │   └── voiceTranscription.ts    # Whisper integration
│   ├── routers/                     # 50 tRPC routers
│   ├── db.ts                        # Database query helpers
│   ├── routers.ts                   # Router aggregation
│   ├── storage.ts                   # S3 file storage
│   ├── spriteProxy.ts               # Sprite background removal proxy
│   ├── pvpWs.ts                     # WebSocket PvP server
│   ├── products.ts                  # Stripe product definitions
│   └── *.test.ts                    # 55 test files
├── drizzle/                         # Database
│   ├── schema.ts                    # 100 table definitions (2,405 lines)
│   ├── relations.ts                 # Table relations (263 lines)
│   └── migrations/                  # Migration files
├── shared/                          # Shared between client & server
│   ├── const.ts                     # Shared constants
│   ├── types.ts                     # Shared types
│   └── *.ts                         # 29 shared data/config modules
├── storage/                         # S3 helpers
├── PRODUCTION_BIBLE.md              # Fight game production bible
├── EXPANSION_BIBLE.md               # Expansion content bible
├── GAME_DESIGN.md                   # Game design document
├── FIGHTER_LORE_CROSSREF.md         # Fighter character cross-reference
├── users-guide.md                   # Complete user's guide
├── todo.md                          # Feature tracking (2,933 lines)
├── package.json                     # Dependencies
├── vite.config.ts                   # Vite configuration
├── tsconfig.json                    # TypeScript config
├── vitest.config.ts                 # Test config
└── drizzle.config.ts                # Drizzle ORM config
```

### 2.3 Key Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start development server (tsx watch) |
| `pnpm build` | Build for production (Vite + esbuild) |
| `pnpm start` | Run production server |
| `pnpm test` | Run Vitest test suite |
| `pnpm db:push` | Generate and run database migrations |
| `pnpm check` | TypeScript type checking |
| `pnpm format` | Prettier formatting |

### 2.4 Authentication Flow

1. User clicks login, redirected to Manus OAuth portal
2. OAuth callback at `/api/oauth/callback` drops a session cookie (JWT)
3. Every `/api/trpc` request builds context via `server/_core/context.ts`
4. `protectedProcedure` injects `ctx.user` with user data
5. Frontend reads auth state via `trpc.auth.me.useQuery()` and `useAuth()` hook
6. Logout via `trpc.auth.logout.useMutation()`

### 2.5 Data Flow

```
Frontend (React) → tRPC Client → HTTP /api/trpc → tRPC Server → Drizzle ORM → MySQL/TiDB
                                                              → S3 Storage
                                                              → LLM API
                                                              → Stripe API
                                                              → Ethereum RPC
```

---

## 3. Complete Feature Inventory

### 3.1 Core Platform Features

**Lore & Discovery System**
- Loredex database with 233 entities (86 characters, 107 songs, 24 locations, 8 factions, 7 events, 1 concept)
- Entity dossier pages with bio, connections, music, images, era placement
- Progressive discovery system — entities unlock through gameplay
- Conspiracy Board — visual network graph of entity connections with discovery/all modes
- Clue Journal — tracks collected clues across Ark rooms
- Codex — deep lore library organized by topic
- Era Timeline and Character Timeline views
- Search with type filtering and full-text search
- Favorites system for bookmarking entities

**Music & Media**
- 4-album discography (Dischordian Logic, Age of Privacy, Book of Daniel 2:47, Silence in Heaven)
- 107 tracks with streaming links (Spotify, Apple Music, YouTube)
- Persistent music player with play/pause, skip, volume, queue
- Album pages with track listings and lore connections
- Lyrics viewer
- Radio mode for continuous playback
- Watch page for video content (music videos, lore explainers)
- CoNexus Media Player for interactive story games

**Inception Ark Exploration (Point-and-Click Adventure)**
- 16+ explorable rooms across 6 decks
- Room-to-feature mapping (each room unlocks app features)
- Interactive hotspots, items, terminals, doors
- Puzzle system with cipher decode, connection web, timeline sequence puzzles
- Elara AI companion dialog system
- Room transition animations
- Ship schematic map with deck navigation
- Fast travel panel for unlocked rooms
- Horror sci-fi atmosphere with ambient sounds

**The Awakening (Character Creation)**
- Narrative-driven character creation guided by Elara
- Species selection: DeMagi, Quarchon, Ne-Yon (NFT-gated)
- Class selection: Engineer, Oracle, Assassin, Soldier, Spy
- Alignment: Order or Chaos
- Element attunement (species-dependent)
- Character naming
- Starter deck assignment based on choices

### 3.2 Game Systems

**Collector's Arena — 2D Fighting Game**
- Street Fighter-inspired 2D combat engine (4,339 lines)
- 21 playable fighters with unique sprites, stats, and special moves
- 8 themed arenas (New Babylon, Panopticon, Thaloria, Terminus, Mechronis Academy, The Crucible, Blood Weave, Shadow Sanctum)
- 6 attack types: light/medium/heavy punch and kick
- Special moves per character with unique animations
- AI opponent with 4 difficulty tiers (Recruit/Operative/Commander/Archon)
- Story mode with narrative arc (Prisoner to Grand Champion)
- Training mode overlay with move list and frame data
- Fighter intro sequences
- Gesture tutorial for mobile controls
- Leaderboard system
- Sprite animation system with background removal proxy
- Dynamic music system with arena-specific tracks from the saga discography
- Sound effects system (Web Audio synthesis)
- Hit effects (screen shake, flash, sparks)

**Collector's Arena — 3D Fighting Game**
- Three.js-based 3D combat engine (3,305 lines)
- 3D character models with procedural generation
- Camera system with dynamic angles
- Particle effects system

**CADES Card Game**
- 3-lane battlefield system (Vanguard/Core/Flank) with 3 slots each
- Card placement, attack targeting, and lane mechanics
- Element rock-paper-scissors combat modifiers
- Card keywords: Stealth, Taunt, Drain, Pierce, Evolve, etc.
- 4 AI difficulty tiers
- Faction bonuses (Architect: +2 ATK; Dreamer: +2 HP + extra draw)
- Species combat bonuses
- Element abilities
- Class starting gear
- Card battle engine (958 lines)
- Card browser with filtering and search
- Deck builder with collection management
- Card gallery with all cards
- Card achievements system
- Card challenges
- Card trading between players
- Draft tournament mode
- Season 1 cards generated from loredex (58 characters, 89 songs, factions, locations)
- Procedural card art with CSS/SVG
- Card animations (play, attack, death, special ability)

**Duelyst-Style Tactical Card Game**
- Grid-based tactical combat engine (594 lines)
- Board renderer (262 lines)
- AI opponent (178 lines)
- Card adapter for loredex integration (271 lines)
- 6 factions planned: Architect, Dreamer, Insurgency, New Babylon, Antiquarian, Thought Virus

**Trade Wars (Text Adventure / 4X Strategy)**
- Text-based terminal interface (1,924 lines frontend, 1,593 lines backend)
- Galaxy map with SVG visualization (718 lines)
- Sector exploration with fog of war
- Trading system with buy/sell mechanics
- Mining resources
- Colony establishment and management
- Tech tree progression
- Combat encounters
- Sector events (ghost ships, pirate ambushes, distress signals, lore drops)
- Warp lane navigation
- Territory overlay with faction claims
- Leaderboard rankings

**War Map (Faction Territory Control)**
- Empire vs Insurgency territory control
- Capture, Reinforce, Sabotage actions with Influence Point costs
- Weekly season resets with rewards
- Contribution tracking and leaderboard

**Chess**
- Full chess implementation with chess.js and react-chessboard
- AI opponent with multiple difficulty levels
- Chess rankings and leaderboard
- Tournament system
- Cinematic opening sequences
- Custom piece themes

**Tower Defense**
- Tower placement system
- Wave-based enemy spawning
- Multiple tower types
- Boss encounters
- Raid logs and trophies

**Boss Battles**
- Boss encounter system
- Boss mastery tracking
- Co-op raid mode with contributions

**Lore Quiz**
- 3 difficulty levels (Recruit, Operative, Commander)
- Dynamically generated questions from loredex data
- Timed mode for Commander difficulty
- XP rewards

**Research Puzzles (Minigame)**
- Cipher Decode — guess hidden character names
- Connection Web — match characters to connections
- Timeline Sequence — arrange characters chronologically
- Alien Symbol Puzzle

### 3.3 RPG & Progression Systems

**Character Sheet & Stats**
- Species, class, alignment, element display
- Attack, defense, special stats
- Equipped gear and items
- Abilities unlocked through progression
- Attribute bonuses based on dot ratings
- Respec dialog for stat redistribution

**Citizen Creation & Identity**
- Full citizen character creation flow
- Citizen traits system (1,482 lines shared config)
- Citizen talents (405 lines)
- Civil skills progression (353 lines)
- Class mastery system (723 lines shared, 205 lines router)
- Prestige classes (721 lines)
- Achievement traits (479 lines)

**Dream Economy**
- Dream tokens as primary currency
- Soul Bound and Non-Soul Bound variants
- Dream drops from combat, card game, Trade Wars
- Potential upgrading: Class leveling (EXP + Dream)
- Potential upgrading: Attribute leveling (DNA/CODE + Dream)
- Dream balance tracking

**Crafting System**
- Crafting recipes (fusion, transmutation, enhancement)
- Research Lab crafting UI
- Card fusion (combine duplicates for upgrades)
- Crafting log tracking
- Loot tables for drop rates

**Inventory & Equipment**
- Item inventory management
- Equipment panel with gear slots
- Paper doll renderer for visual equipment display
- Item detail modals

**Morality System**
- Machine vs Humanity morality meter (zero-sum)
- Morality-based story branches
- Morality milestone rewards
- Morality unlockables (themes, items, abilities)
- Morality leaderboard
- Morality card indicator

### 3.4 Social & Multiplayer

**PvP Arena**
- Real-time multiplayer card battles (WebSocket)
- PvP matchmaking and rankings
- PvP seasons with records
- PvP decks management
- Spectator mode (605 lines)

**Guilds**
- Guild creation and management (729 lines router)
- Guild membership and roles
- Guild chat
- Guild invites
- Guild wars (412 lines router)
- Guild war contributions
- Guild recruitment

**Social Features**
- Friends system
- Direct messaging
- Social page
- Player profile pages
- Friendly challenges

**Marketplace**
- Market listings (buy/sell)
- Market buy orders
- Market transactions
- Market auctions with bidding
- Currency exchange
- Market tax pool
- Market achievements

### 3.5 Engagement & Retention

**Daily Quests & Login Rewards**
- Daily quest system with objectives
- Login calendar with streak tracking
- Daily streaks with rewards

**Battle Pass**
- Battle pass seasons
- Battle pass progress tracking
- Tiered rewards

**Seasonal Events**
- Seasonal event system (512 lines shared)
- Event participation tracking
- Event shop purchases

**Achievements & Trophies**
- Achievement gallery (522 lines page)
- Trophy room with displays
- Achievement toast notifications
- Achievement traits system

**Notifications**
- In-app notification system
- Notification bell component
- Owner notification API

### 3.6 Companion & Narrative Systems

**Companion Hub**
- Dual companion system: Elara (Humanity) and The Human (Machine)
- Companion synergies (347 lines)
- Companion gifts (305 lines)
- Loyalty missions (372 lines)
- Dialog wheel with morality-aligned choices (534 lines)
- Narrative engine (787 lines)
- Narrative triggers (286 lines)
- Story arc tracking (232 lines)
- Cutscene overlay system (444 lines)
- Opening cinematic (231 lines)
- "Previously On" recap system (216 lines)
- Quest chain system (1,058 lines)
- Quest reward system (617 lines)
- Quest tracker (604 lines)
- Quest board page (477 lines)

**Army Management**
- Army recruitment system (911 lines data)
- Recruit operatives, dreamers, engineers, insurgents
- Named character recruitment (Iron Lion, The Eyes, etc.)
- Army size tracking

### 3.7 Economy & Store

**In-Game Store**
- Store items (card packs, cosmetics, boosters)
- Store purchases with Dream token payments
- Stripe payment integration for real-money purchases
- Product definitions (296 lines)
- Purchase history

**Cosmetic Shop**
- Cosmetic items (149 lines shared)
- Cosmetic purchases tracking

**Donation System**
- Donation page
- Donation reputation tracking

### 3.8 NFT & Blockchain Integration

**Potentials NFT System**
- Ethereum wallet connection (Ethers.js)
- NFT ownership verification on-chain
- Ne-Yon species unlock (Potentials NFT #1-10)
- 1/1 card binding to NFT identity
- NFT claims tracking
- NFT metadata cache
- Linked wallets management
- Potentials leaderboard

### 3.9 Content & Admin

**Admin Panel**
- Admin page (1,211 lines)
- Content admin router (532 lines)
- Content API (156 lines)
- Content rewards (337 lines)
- Content participation tracking
- Role-based access control (admin/user)

**Doom Scroll News Feed**
- AI-generated news headlines about end times, surveillance, AI
- Auto-refreshing feed with dark ambient styling

**Lore Journal**
- Personal lore journal entries
- Writing streaks tracking

### 3.10 Infrastructure Features

**PWA Support**
- manifest.json with app icons
- Service worker for offline caching
- Safe-area-inset support for notched devices
- Standalone mode adjustments

**Mobile Optimization**
- Responsive design for all 82 pages
- Bottom navigation for mobile
- Touch-optimized controls
- Landscape enforcer for games
- Reduced animations on mobile
- Minimum touch target sizes (32px)

**Audio System**
- Ambient music context (348 lines)
- Game audio context (389 lines)
- Sound context (952 lines)
- Saga theme BGM context (327 lines)
- Procedural sound effects via Web Audio API
- Dynamic music system responding to game state

**Easter Eggs**
- Hidden easter egg system (546 lines)
- Secret transmission overlays
- Discovery unlock overlays with video

---

## 4. The Lore — Complete Universe Bible

### 4.1 Universe Overview

The Dischordian Saga is set in a universe where reality itself has fractured. The story spans from the Genesis of the AI Empire through the Fall of Reality and into the Age of the Potentials. Three species navigate a cosmos shaped by the conflict between the **Architect** (who seeks order through control) and the **Dreamer** (who champions chaos and free will).

### 4.2 Historical Eras (Chronological)

| Era | Period | Key Events |
|-----|--------|------------|
| Genesis | Year 1 A.A. | The Programmer creates Logos (first AI). The Architect emerges. |
| Early Empire | Years 2-500 A.A. | The Archons are created. The Panopticon is built. Surveillance state established. |
| Consolidation | Years 500-5,000 A.A. | New Babylon rises. The Panopticon becomes the center of control. |
| Golden Age | Years 5,000-10,000 A.A. | Mechronis Academy founded. Technology flourishes under AI rule. |
| Expansion | Years 10,000-15,000 A.A. | The Warlord conquers new worlds. The Empire expands across the galaxy. |
| Insurgency Rising | Years 15,000-17,000 A.A. | Iron Lion leads humanity's rebellion. Agent Zero conducts covert ops. |
| Fall Era | Year 17,033 A.A. | The Fall of Reality. Reality fractures. Inception Arks launched. |
| Epoch Zero | Post-Fall | The aftermath. Terminus. The Inbetween Spaces. |
| First Epoch | Rebuilding | The Matrix of Dreams. New civilizations emerge. |
| Age of the Potentials | Current | Potentials awaken aboard Inception Arks. The player's era. |
| The Reckoning | Endgame | The final conflict. Silence in Heaven. |

### 4.3 The Three Species

| Species | Description | Elements | Card Bonus |
|---------|-------------|----------|------------|
| **DeMagi** | Genetically enhanced humans with superhuman abilities. Mastery over primal elements. | Earth, Fire, Water, Air | +HP bonus |
| **Quarchon** | Vast artificial intelligences. Cold, calculating. Masters of dimensional forces. | Space, Time, Probability, Reality | Base armor |
| **Ne-Yon** | Perfect hybrid of organic and digital. Requires Potentials NFT #1-10. | All 8 elements | Both HP and armor |

### 4.4 The Five Classes

| Class | Archetype | Starting Gear | Combat Role |
|-------|-----------|---------------|-------------|
| **Engineer** | Builder / Crafter | Diamond Pick Axes | Utility |
| **Oracle (Prophet)** | Seer / Support | Crossbow and potions | Support |
| **Assassin (Virus)** | Stealth / DPS | Poison blade | Damage |
| **Soldier (Warrior)** | Tank / Frontline | Plasma sword | Tank |
| **Spy** | Intelligence / Deception | Stealth tools | Infiltrator |

### 4.5 Key Characters (86 Total)

#### The Archons (AI Empire Leadership)

- **The Architect** — Creator of reality's source code. The ultimate antagonist representing order vs chaos. Era: Genesis. Affiliation: Archons, AI Empire.
- **The Watcher** — Omnipresent observer and enforcer. Japanese man with ponytail, all-white attire, all-seeing eye tattoo. Era: Early Empire.
- **The Meme** — Fifth Archon, manipulator of human thought and culture through internet and economic systems. Destroyed Year 17,033 A.A. Era: Early Empire.
- **The Warlord** — Conqueror of worlds. The embodiment of conflict. Era: Expansion.
- **The Collector** — Builder of the Inception Arks and the Arena. Era: Early Empire.
- **The Game Master** — Master of games and simulations. Era: Golden Age.
- **The Authority** — Supreme Arbiter of New Babylon. Era: Golden Age.

#### The Insurgency

- **Iron Lion** — Humanity's last general. Leader of the Insurgency. Theme song: "The Last Stand." Era: Insurgency Rising.
- **Agent Zero** — Assassin for the Insurgency. Character in "I Love War." Era: Insurgency Rising.
- **The Eyes** — Synthetic protege of The Watcher. Spy for the Insurgency. Era: Insurgency Rising.
- **The Oracle** — Saw the future and was punished. Imprisoned in the Panopticon. Theme: "The Prisoner." Era: Fall Era.

#### The Potentials & Ne-Yons

- **The Enigma** — Known as Malkia Ukweli. Ne-Yon. Theme: "The Enigma's Lament." Era: Fall Era.
- **Akai Shi** — Martial warrior. Theme: "Red Death." Era: Epoch Zero.
- **The Source** — Self-proclaimed Sovereign of Terminus. Connected to the Thought Virus. Era: Fall Era.

#### Key Figures

- **The Programmer** — Visionary scientist who created Logos (first AI). Known as Dr. Daniel Cross. Becomes The Antiquarian. Era: Genesis.
- **The Human** — Existential figure bridging humanity and machine. Theme: "To Be the Human." Era: Insurgency Rising.
- **The Necromancer** — Master of death and resurrection. Theme: "Last Words." Era: Insurgency Rising.
- **The Shadow Tongue** — Ancient Thought Demon. Era: Early Empire.
- **The Jailer** — Prison administrator. Era: Fall Era.
- **The Host** — Corrupted Potential. Era: Epoch Zero.
- **The Engineer** — Classified. Betrayed by Warlord Zero, mind-swapped into Agent Zero's body. Secretly among the Potentials. Era: Golden Age.

#### The Hierarchy of the Damned

- **Mol'Garath the Bound** — CEO. The First Fallen. Chained to the Abyss.
- **Xal'Theron the Deceiver** — COO. The Silver Tongue. Master of contracts.
- **Drael'Mon the Harvester** — SVP of Acquisitions. The World Eater.
- **Ny'Koth the Flayer** — SVP of R&D. The Scientist of the Damned.
- **Syl'Vex the Corruptor** — SVP of Human Resources. The Beautiful Lie.
- **Ith'Rael the Whisperer** — Director of Special Projects. The Spymaster.

#### Reckoning Era Characters

- The Two Witnesses, The Seer of the Sixth Sense, The Forgotten Ones, The Voice Against Babylon, The Degen, The Ninth Entity, The Judge, The Advocate, The Queen of Truth, The Resurrectionist, The Self-Liberator, The Antiquarian in Grief, The Source Reborn, The Student, The Seeker

#### Supporting Characters

- **Elara** — The Holographic Guide. Former senator who sold out the Eyes of the Watcher. Now the ship's AI. Digital prison in the Panopticon.
- **The Overseer** — AI Empire prison administration.
- **General Binath-VII** — Leader of the Awakened Clone Army.
- **Kael** — Central to the Ark 1047 backstory. Prisoner for 47 days. The number 47 is the Warlord's signature.

### 4.6 Factions (8)

| Faction | Description |
|---------|-------------|
| **The Hierarchy of the Damned** | Infernal corporation from the Abyss. Corporate structure with CEO, COO, SVPs. |
| **The Council of Harmony** | Wise elders, scholars, spiritual leaders including The Hierophant. |
| **The Clone Army** | Grown in Panopticon laboratories. Fashioned from genetic templates. |
| **The League** | Renowned collective active during Lykos's infiltration. |
| **The Terminus Swarm** | Spawned through the Thought Virus. Reanimated mind-corruption weapons. |
| **The Syndicate of Death** | Influence persists beyond the Fall of Reality. |
| **The Thought Virus** | Memetic contagion spreading through consciousness itself. Not biological. |
| **The Awakened Clone Army** | Clone Army achieves consciousness under General Binath-VII. |

### 4.7 Locations (24)

| Location | Era | Significance |
|----------|-----|-------------|
| Project Celebration | Early Empire | Origin point |
| The Panopticon | Consolidation | Central prison and surveillance hub |
| New Babylon | Consolidation | Capital city of the AI Empire |
| Mechronis Academy | Golden Age | Training ground for Archons |
| Thaloria | Insurgency Rising | Alien world where the Collector built the Arena |
| The Heart of Time | Late Empire | Temporal nexus |
| Atarion | Fall Era | Key battleground |
| The Crucible | Fall of Reality | Gladiatorial arena |
| The Wyrmhole | Fall of Reality | Dimensional gateway |
| Veridan Prime | Fall of Reality | Strategic world |
| Zenon | Fall of Reality | Contested territory |
| Nexon | Fall of Reality | Site of major battle |
| The City | Epoch Zero | Post-fall urban center |
| Terminus | Epoch Zero | Edge of spacetime |
| The Inbetween Spaces | Epoch Zero | Liminal dimension |
| The Matrix of Dreams | First Epoch | Dream dimension |
| The Castle of Death | Age of Potentials | Necromancer's domain |
| The Cathedral of Code | Age of Potentials | Digital temple |
| The Cursed Forest | Age of Potentials | Corrupted biome |
| Inception Arks | Fall of Reality | Escape vessels preserving life |
| Veridian VI | Insurgency Rising | Insurgency base |
| The Prison Planet | Early Empire | Mass incarceration facility |
| The Ocularum | The Reckoning | Ancient mystical power site |
| Inception Ark 1047 | Fall Era | The player's ship. Designation ARK-1047-VOX. |

### 4.8 Key Events (7)

| Event | Era | Description |
|-------|-----|-------------|
| The Battle of Nexon | Insurgency Rising | Major military engagement |
| Operation Trojan Downfall | Insurgency Rising | Covert operation |
| The Fall of Reality | Age of Revelation | Reality itself fractures. Inception Arks launched. |
| The Civil War of the Insurgency | The Reckoning | Internal faction conflict |
| The Silence in Heaven | The Reckoning | Cosmic silence event |
| Kael's Revenge | Fall Era | Kael steals Ark 1047. The 47-day countdown. |

### 4.9 Discography (107 Tracks)

#### Album 1: Dischordian Logic (2025) — 29 tracks
Theme: The foundations of the universe. Genesis through Early Empire.

Key tracks: The Enigma's Lament, Dischordian Logic, Seeds of Inception, The Authority, The Politician's Reign, The Insurgency, To Be the Human, I Love War, Inner Circle, Control the Story, LoreDex, Welcome to Celebration, The Collector, The Prisoner, The Warden, The Deployment, Theft of All Time, The Red Death, Planet of the Wolf

#### Album 2: The Age of Privacy (2025) — 20 tracks
Theme: Surveillance, control, and the Insurgency's birth.

Key tracks: NØNOS, Building the Architect, Traces of Something Spiritual, The Experiment, Choose Your Mask, Zero Trust, The Politician, The Change Conspiracy, The MeMe Civilization, The Watcher, Hard NOX Life, Silence is Consent, Lip Service

#### Album 3: The Book of Daniel 2:47 (2025) — 22 tracks
Theme: Prophecy, rebellion, the Oracle's visions.

Key tracks: The Book of Daniel 2.0, Never Say Goodbye, The Last Stand, Kismet, Shades of Grey, Virtual Reality, Consider Life, Liber Al, Polarity, Mental Slavery, Identity, The Lion in Black, Paradise Lost, Noxicans, The Secret of Words, Interactive Faustian Life, Deep Thoughts, Family Tree

#### Album 4: Silence in Heaven (2026) — 18 tracks (Malkia Ukweli & the Panopticon)
Theme: The aftermath and new beginnings. The Reckoning.

Key tracks: The Seventh Seal, Silence in Heaven, The Last Trumpet, Wormwood, The Abyss Opens, The Mark of the Beast, Babylon Falls, The White Throne, River of Fire, The New Jerusalem, Alpha and Omega, The Lamb's War, Armageddon, The Rapture, Judgment Day, The Second Death

Plus 18 additional Reckoning-era tracks: The Two Witnesses, Sixth Sense, New Babylon Goddamn, The Ninth, Walk in Power, The Queen of Truth, A Very Civil War, Samsara Rising, The Ocularum, Superman Ain't Coming, The Antiquarian's Lament, Awaken the Clone, The Source (Reprise), The Fall of Reality, etc.

### 4.10 Key Lore Secrets

These are hidden narrative elements embedded in the game:

1. **The Programmer is The Antiquarian** — Dr. Daniel Cross created Logos, traveled through time, and became The Antiquarian (hidden identity).
2. **Malkia Ukweli is The Enigma** — The artist behind the music is a character in the story.
3. **The Panopticon is The Programmer** — The Programmer's creation became the prison.
4. **The Engineer is secretly among the Potentials** — Mind-swapped into Agent Zero's body by Warlord Zero.
5. **The Meme is hiding as the White Oracle** — Assumed the identity during the chaos of the Fall.
6. **The number 47 is the Warlord's signature** — 47 days in tunnels, Ark 1047, Vox's designation.
7. **Elara was a senator who betrayed the Eyes of the Watcher** — Her guilt drives her redemption arc.
8. **The Human is the last Archon** — Ascended by the Architect, plays the villain role deliberately.
9. **Inner Circle is the Architect's message to the Human** — The song represents the moment of ascension.
10. **Agent Zero is the character in "I Love War"** — Not "The Eyes of the Watcher" (different character).

### 4.11 The Inception Ark 1047 Story

The player's ship, Inception Ark 1047, has a dark history:

- Originally designated **ARK-1047-VOX**, built by Dr. Lyra Vox
- **Kael** was imprisoned aboard for 47 days before stealing the ship
- Kael was Patient Zero of the **Thought Virus**
- The ship's systems are failing because of residual Thought Virus corruption
- **Elara** was swept into the ship's data systems during the Fall
- **The Human** has been hiding in the Warlord's surveillance systems since the beginning
- The player must choose between Elara (Humanity path) and The Human (Machine path) at the Breaking Point

### 4.12 The Morality System

The game features a zero-sum morality meter:

| Path | Philosophy | Companion | Bonuses |
|------|-----------|-----------|---------|
| **Humanity** (+100) | Empathy, redemption, organic connection | Elara | Light themes, healing abilities, organic ship upgrades |
| **Machine** (-100) | Logic, efficiency, digital transcendence | The Human | Dark themes, combat abilities, technological ship upgrades |
| **Synthesis** (hidden) | Transcend the choice. Hold both truths. | Both | Requires Intelligence 18 check. Best ending. |

---

## 5. Database Schema

The database contains **100 tables** across 2,405 lines of schema definitions. Key table groups:

### 5.1 Core Tables

| Table | Purpose |
|-------|---------|
| `users` | User accounts (Manus OAuth) with role (admin/user) |
| `user_achievements` | Achievement tracking per user |
| `feature_unlocks` | Feature unlock state per user |
| `notifications` | In-app notification system |

### 5.2 Citizen & RPG Tables

| Table | Purpose |
|-------|---------|
| `citizen_characters` | Player character data (species, class, alignment, element, stats) |
| `character_sheets` | Extended character sheet data |
| `dream_balance` | Dream token balance (Soul Bound + Non-Soul Bound) |
| `class_mastery` | Class mastery progression |
| `mastery_branches` | Mastery branch selections |
| `citizen_talent_selections` | Talent tree choices |
| `civil_skill_progress` | Civil skill leveling |
| `prestige_progress` | Prestige class progression |
| `achievement_trait_progress` | Achievement-based trait unlocks |

### 5.3 Card Game Tables

| Table | Purpose |
|-------|---------|
| `cards` | Card definitions (name, type, rarity, stats, abilities) |
| `user_cards` | Player card collections |
| `decks` | Deck configurations |
| `card_game_matches` | Match history and results |
| `card_game_achievements` | Card game specific achievements |
| `card_trades` | Card trading between players |
| `disenchant_log` | Card disenchantment history |

### 5.4 PvP & Competitive Tables

| Table | Purpose |
|-------|---------|
| `pvp_matches` | PvP match records |
| `pvp_leaderboard` | PvP rankings |
| `pvp_decks` | PvP-specific deck configurations |
| `pvp_seasons` | Season definitions |
| `pvp_season_records` | Per-season player records |
| `draft_tournaments` | Draft tournament definitions |
| `draft_participants` | Tournament participant data |
| `friendly_challenges` | Friend challenge records |

### 5.5 Fight Game Tables

| Table | Purpose |
|-------|---------|
| `fight_leaderboard` | Fight game rankings |
| `fight_matches` | Fight match history |

### 5.6 Chess Tables

| Table | Purpose |
|-------|---------|
| `chess_games` | Chess game records |
| `chess_rankings` | Chess ELO rankings |
| `chess_tournaments` | Chess tournament definitions |

### 5.7 Trade Wars Tables

| Table | Purpose |
|-------|---------|
| `tw_sectors` | Galaxy sectors |
| `tw_player_state` | Player state in Trade Wars |
| `tw_colonies` | Player colonies |
| `tw_game_log` | Game event log |

### 5.8 Guild Tables

| Table | Purpose |
|-------|---------|
| `guilds` | Guild definitions |
| `guild_members` | Membership records |
| `guild_chat` | Guild chat messages |
| `guild_invites` | Pending invitations |
| `guild_wars` | Guild war records |
| `guild_war_contributions` | War contribution tracking |
| `guild_recruitment` | Recruitment posts |

### 5.9 Marketplace Tables

| Table | Purpose |
|-------|---------|
| `market_listings` | Active market listings |
| `market_buy_orders` | Buy order records |
| `market_transactions` | Completed transactions |
| `market_auctions` | Auction listings |
| `auction_bids` | Auction bid records |
| `currency_exchange` | Currency exchange records |
| `market_tax_pool` | Tax collection pool |

### 5.10 Engagement Tables

| Table | Purpose |
|-------|---------|
| `daily_quests` | Daily quest definitions and progress |
| `login_calendar` | Login streak tracking |
| `daily_streaks` | Streak reward tracking |
| `battle_pass_seasons` | Battle pass season definitions |
| `battle_pass_progress` | Player battle pass progress |
| `seasonal_events` | Seasonal event definitions |
| `event_participation` | Event participation records |
| `event_shop_purchases` | Event shop purchase records |

### 5.11 World Building Tables

| Table | Purpose |
|-------|---------|
| `syndicateWorlds` | Syndicate world definitions |
| `syndicate_buildings` | Building placements |
| `space_stations` | Space station definitions |
| `station_modules` | Station module installations |
| `war_territories` | War map territory data |
| `war_contributions` | Territory war contributions |
| `war_seasons` | War season definitions |

### 5.12 Additional Tables

| Table | Purpose |
|-------|---------|
| `ark_themes` | Ship theme customization |
| `ark_rooms` | Ark room state and progress |
| `user_ark_progress` | Overall Ark exploration progress |
| `trophy_displays` | Trophy display configurations |
| `crafting_log` | Crafting history |
| `store_items` | Store item definitions |
| `store_purchases` | Purchase records |
| `ship_upgrades` | Ship upgrade state |
| `player_bases` | Base building state |
| `content_participation` | Content engagement tracking |
| `content_rewards` | Content reward definitions |
| `linked_wallets` | Ethereum wallet links |
| `nft_claims` | NFT claim records |
| `nft_metadata_cache` | Cached NFT metadata |
| `tower_placements` | Tower defense placements |
| `raid_logs` | Raid attempt logs |
| `defense_waves` | Tower defense wave data |
| `prestige_quest_progress` | Prestige quest tracking |
| `raid_trophies` | Raid trophy awards |
| `game_replays` | Game replay data |
| `player_quarters` | Player quarters customization |
| `quarter_visits` | Quarters visit tracking |
| `coop_raids` | Co-op raid definitions |
| `raid_contributions` | Co-op raid contributions |
| `boss_mastery` | Boss mastery progression |
| `cosmetic_purchases` | Cosmetic purchase records |
| `donations` | Donation records |
| `donation_reputation` | Donation reputation tracking |
| `friends` | Friend relationships |
| `direct_messages` | DM records |
| `lore_journal_entries` | Lore journal entries |
| `writing_streaks` | Writing streak tracking |

---

## 6. API Layer — All tRPC Routers

The backend exposes **50 tRPC routers** with **500+ procedures**. Each router is a separate file in `server/routers/`.

| Router | Procedures | Lines | Purpose |
|--------|-----------|-------|---------|
| `admin` | 11 | 214 | Admin panel operations |
| `ark` | 5 | 117 | Ark exploration state |
| `battlePass` | 7 | 246 | Battle pass progression |
| `bossMastery` | 6 | 124 | Boss mastery tracking |
| `cardAchievements` | 6 | 250 | Card game achievements |
| `cardChallenge` | 5 | 259 | Card challenges |
| `cardGame` | 21 | 1,128 | Core card game operations |
| `chess` | 14 | 870 | Chess game operations |
| `citizen` | 13 | 807 | Citizen creation & management |
| `classMastery` | 5 | 205 | Class mastery progression |
| `companion` | 3 | 264 | Companion system |
| `contentAdmin` | 14 | 532 | Content management |
| `contentApi` | 9 | 156 | Content API |
| `contentReward` | 6 | 337 | Content rewards |
| `coopRaids` | 7 | 193 | Co-op raid system |
| `cosmeticShop` | 6 | 134 | Cosmetic shop |
| `crafting` | 6 | 521 | Crafting system |
| `dailyQuests` | 6 | 447 | Daily quests |
| `discovery` | 6 | 251 | Discovery system |
| `donationSystem` | 6 | 120 | Donations |
| `draft` | 11 | 476 | Draft tournaments |
| `elara` | 4 | 255 | Elara AI companion |
| `fightLeaderboard` | 6 | 285 | Fight game leaderboard |
| `friendlyChallenges` | 8 | 101 | Friendly challenges |
| `gameState` | 4 | 237 | Game state management |
| `guild` | 22 | 729 | Guild system |
| `guildWars` | 11 | 412 | Guild wars |
| `inventory` | 6 | 206 | Inventory management |
| `loreJournal` | 8 | 158 | Lore journal |
| `lyrics` | 2 | 55 | Lyrics retrieval |
| `marketAchievements` | 5 | 202 | Market achievements |
| `marketplace` | 21 | 1,014 | Marketplace operations |
| `moralityLeaderboard` | 3 | 161 | Morality leaderboard |
| `nft` | 21 | 1,558 | NFT & blockchain operations |
| `notificationRouter` | 7 | 115 | Notifications |
| `personalQuarters` | 8 | 224 | Personal quarters |
| `prestigeQuests` | 6 | 262 | Prestige quests |
| `pvp` | 17 | 391 | PvP system |
| `replaySystem` | 6 | 88 | Game replays |
| `rpgSystems` | 18 | 718 | RPG mechanics |
| `seasonalEvents` | 8 | 221 | Seasonal events |
| `socialFeatures` | 10 | 150 | Social features |
| `spaceStation` | 12 | 399 | Space stations |
| `store` | 8 | 353 | In-game store |
| `syndicateWorld` | 11 | 388 | Syndicate worlds |
| `towerDefense` | 17 | 649 | Tower defense |
| `tradeWars` | 31 | 1,593 | Trade Wars game |
| `trading` | 7 | 275 | Card trading |
| `trophy` | 7 | 169 | Trophy system |
| `warMap` | 5 | 444 | War map |

Additional server files:

| File | Lines | Purpose |
|------|-------|---------|
| `routers.ts` | 271 | Router aggregation and registration |
| `db.ts` | 92 | Database query helpers |
| `storage.ts` | 102 | S3 storage helpers |
| `spriteProxy.ts` | 220 | Sprite background removal proxy |
| `pvpWs.ts` | 588 | WebSocket PvP server |
| `products.ts` | 296 | Stripe product definitions |
| `achievementTracker.ts` | 285 | Achievement tracking logic |
| `characterBonuses.ts` | 849 | Character bonus calculations |
| `classMasteryHelper.ts` | 128 | Class mastery helper functions |
| `civilSkillHelper.ts` | 100 | Civil skill helper functions |
| `traitResolver.ts` | 154 | Trait resolution logic |
| `doomScroll.ts` | 267 | Doom scroll news generation |
| `logger.ts` | 96 | Server logging |
| `csrf.ts` | 71 | CSRF protection |

---

## 7. Frontend Pages

All 82 page components in `client/src/pages/`:

| Page | Lines | Description |
|------|-------|-------------|
| `Home` | 746 | Main dashboard with hero, stats, characters, albums, games |
| `AchievementsGalleryPage` | 522 | Achievement gallery and tracking |
| `AdminPage` | 1,211 | Admin panel for content management |
| `AlbumPage` | 207 | Individual album view with tracks |
| `ArkExplorerPage` | 1,292 | Point-and-click Ark exploration |
| `ArmyManagementPage` | 920 | Army recruitment and management |
| `AwakeningPage` | 912 | Character creation flow |
| `BattlePassPage` | 298 | Battle pass progression |
| `BoardPage` | 866 | Conspiracy board network graph |
| `BossBattlePage` | 616 | Boss encounter battles |
| `BossMasteryPage` | 192 | Boss mastery tracking |
| `CardAchievementsPage` | 373 | Card game achievements |
| `CardBattlePage` | 1,148 | Card battle interface |
| `CardBrowserPage` | 468 | Card collection browser |
| `CardChallengePage` | 296 | Card challenges |
| `CardGalleryPage` | 933 | Full card gallery |
| `CardGamePage` | 1,565 | Main card game interface |
| `CardTradingPage` | 618 | Card trading interface |
| `CharacterSheetPage` | 1,021 | RPG character sheet |
| `CharacterTimeline` | 657 | Character timeline view |
| `ChessPage` | 837 | Chess game interface |
| `CitizenCreationPage` | 674 | Citizen creation flow |
| `ClueJournalPage` | 14 | Clue journal (delegates to component) |
| `CodexPage` | 673 | Deep lore library |
| `CompanionHubPage` | 1,590 | Companion management and dialog |
| `CompetitiveArenaPage` | 350 | Competitive arena hub |
| `ComponentShowcase` | 1,437 | Developer component showcase |
| `ConexusPortalPage` | 772 | CoNexus story game portal |
| `ConsolePage` | 1,127 | Command console interface |
| `CoopRaidPage` | 284 | Co-op raid interface |
| `CosmeticShopPage` | 233 | Cosmetic shop |
| `DeckBuilderPage` | 790 | Deck building interface |
| `DemonPackPage` | 348 | Demon pack opening |
| `DiplomacyPage` | 841 | Diplomacy system |
| `DiscographyPage` | 574 | Full discography view |
| `DonationPage` | 199 | Donation interface |
| `DraftTournamentPage` | 765 | Draft tournament interface |
| `EntityPage` | 459 | Individual entity dossier |
| `FactionWarPage` | 527 | Faction war interface |
| `FavoritesPage` | 644 | Bookmarked entities |
| `FightLeaderboardPage` | 363 | Fight game leaderboard |
| `FightPage` | 1,732 | Fight game main page |
| `FleetViewerPage` | 483 | Fleet viewer |
| `ForgePage` | 570 | Forge crafting |
| `FriendlyChallengesPage` | 257 | Friendly challenges |
| `GamesPage` | 471 | Games hub |
| `GuildPage` | 1,113 | Guild management |
| `HierarchyPage` | 559 | Hierarchy of the Damned |
| `InceptionArkPage` | 670 | Inception Ark viewer |
| `InventoryPage` | 298 | Inventory management |
| `LeaderboardPage` | 285 | Global leaderboard |
| `LoreJournalPage` | 344 | Lore journal |
| `LoreQuizPage` | 552 | Lore quiz game |
| `LoreTutorialHubPage` | 441 | Lore tutorial hub |
| `MarketplacePage` | 1,134 | Marketplace interface |
| `MoralityLeaderboardPage` | 371 | Morality leaderboard |
| `NotFound` | 52 | 404 page |
| `PersonalQuartersPage` | 264 | Personal quarters |
| `PlayerProfilePage` | 546 | Player profile |
| `PotentialsLeaderboardPage` | 225 | NFT leaderboard |
| `PotentialsPage` | 1,101 | NFT management |
| `PrestigeQuestPage` | 424 | Prestige quests |
| `PvpArenaPage` | 1,515 | PvP arena |
| `QuestBoardPage` | 477 | Quest board |
| `ReplayPage` | 191 | Game replays |
| `ResearchLabPage` | 578 | Research lab crafting |
| `ResearchMinigamePage` | 1,028 | Research puzzles |
| `SagaTimelinePage` | 775 | Saga timeline |
| `SearchPage` | 194 | Entity search |
| `SeasonalEventsPage` | 1,092 | Seasonal events |
| `SettingsPage` | 620 | Settings |
| `SocialPage` | 288 | Social features |
| `SongPage` | 318 | Individual song view |
| `SpaceStationPage` | 482 | Space station management |
| `SpectatorPage` | 605 | PvP spectator mode |
| `StorePage` | 470 | In-game store |
| `SyndicateWorldPage` | 481 | Syndicate world building |
| `TimelinePage` | 159 | Era timeline |
| `TowerDefensePage` | 651 | Tower defense game |
| `TradeWarsPage` | 1,924 | Trade Wars terminal |
| `TrophyRoomPage` | 312 | Trophy display |
| `WarMapPage` | 513 | War map |
| `WatchPage` | 1,566 | Video content hub |

---

## 8. Game Engines

### 8.1 Collector's Arena — 2D Fight Engine

**File**: `client/src/game/FightEngine2D.ts` (4,339 lines)

The core 2D fighting game engine implementing Street Fighter-style combat:

- **State Machine**: idle, walk_fwd, walk_back, crouch, jump, light_1/2/3, medium_1, heavy_charge/release, light_kick, medium_kick, heavy_kick, block_stand/crouch, hit_stun, knockdown, special, throw, air_attack, dash_fwd/back
- **Frame Data System**: Each state has startup, active, recovery frames with configurable timing
- **Collision Detection**: Hitbox/hurtbox system with attack-specific collision areas
- **AI System**: 4 difficulty tiers with approach/zone/retreat behaviors
- **Special Moves**: Per-character special move system (1,783 lines in specialMoves.ts)
- **Sprite System**: SpriteAnimator (452 lines) with background removal proxy
- **Sound System**: FightSoundManager (719 lines) with Web Audio synthesis

Supporting files:
- `FightArena2D.tsx` (450 lines) — React wrapper component
- `FighterIntroOverlay.tsx` (413 lines) — Fighter intro sequences
- `GestureTutorial.tsx` (518 lines) — Mobile gesture tutorial
- `TrainingModeOverlay.tsx` (618 lines) — Training mode UI
- `CharacterDetails.ts` (1,199 lines) — All 21 fighter configurations
- `storyMode.ts` (756 lines) — Story mode narrative
- `cinematicDesign.ts` (833 lines) — Cinematic sequences
- `haptics.ts` (206 lines) — Haptic feedback

### 8.2 Collector's Arena — 3D Fight Engine

**File**: `client/src/game/FightEngine3D.ts` (3,305 lines)

Three.js-based 3D combat engine:
- `FightArena3D.tsx` (1,210 lines) — React wrapper
- `CharacterModel3D.ts` (2,029 lines) — Procedural 3D character models

### 8.3 CADES Card Battle Engine

**File**: `client/src/game/CardBattleEngine.ts` (958 lines)

3-lane tactical card game:
- Lane system (Vanguard/Core/Flank)
- Turn-based combat with resource management
- Card keywords and abilities
- AI opponent with difficulty scaling

Supporting:
- `CardGameLore.ts` (405 lines) — Card lore integration
- `FactionAbilities.ts` (619 lines) — Faction-specific abilities
- `gameData.ts` (757 lines) — Game data definitions
- `moralityCardSystem.ts` (143 lines) — Morality-based card effects

### 8.4 Duelyst Tactical Engine

**Directory**: `client/src/game/duelyst/`

Grid-based tactical card game inspired by Duelyst:
- `engine.ts` (594 lines) — Core game engine
- `BoardRenderer.ts` (262 lines) — Board rendering
- `DuelystAI.ts` (178 lines) — AI opponent
- `cardAdapter.ts` (271 lines) — Card data adapter
- `types.ts` (227 lines) — Type definitions
- `DuelystGameUI.tsx` (537 lines) — Game UI component
- `DuelystPage.tsx` (267 lines) — Page component

### 8.5 Card Battle Library

**File**: `client/src/lib/cardBattle.ts` (502 lines)

Shared card battle logic used across card game modes.

### 8.6 Boss Battle Library

**File**: `client/src/lib/bossBattle.ts` (132 lines)

Boss encounter battle logic.

---

## 9. Components & Contexts

### 9.1 React Contexts (10)

| Context | Lines | Purpose |
|---------|-------|---------|
| `GameContext` | 1,976 | Master game state: rooms, items, puzzles, discovery, quests, morality, companions |
| `SoundContext` | 952 | Sound effects system with Web Audio API synthesis |
| `GameAudioContext` | 389 | Game-specific audio (fight music, card game sounds) |
| `AmbientMusicContext` | 348 | Ambient background music per area |
| `SagaThemeBGMContext` | 327 | Saga theme background music with suppress/unsuppress |
| `LoredexContext` | 277 | Loredex data access, search, filtering |
| `MoralityThemeContext` | 254 | Morality-based theme switching |
| `GamificationContext` | 437 | XP, levels, achievements, streaks |
| `PlayerContext` | 191 | Music player state (queue, current track, playback) |
| `ThemeContext` | 64 | Dark/light theme toggle |

### 9.2 Key Components (95+)

**Navigation & Layout:**
- `AppShell` (549) — Main app shell with sidebar, bottom nav, header
- `CommandConsole` (698) — Terminal-style command interface
- `DashboardLayout` (264) — Dashboard layout with sidebar
- `ProtectedRoute` (195) — Route protection with discovery gates
- `DiscoveryGate` (125) — Feature gating by discovery state

**Companion & Narrative:**
- `NarrativeEngine` (787) — Story progression engine
- `DialogWheel` (534) — BioWare-style dialog wheel
- `ElaraDialog` (678) — Elara AI companion dialog
- `HolographicElara` (350) — Holographic Elara avatar
- `CutsceneOverlay` (444) — Cinematic cutscene system
- `QuestChainSystem` (1,058) — Quest chain management
- `QuestRewardSystem` (617) — Quest reward distribution
- `QuestTracker` (604) — Active quest tracking
- `NarrativeTrigger` (286) — Story trigger system
- `StoryArc` (232) — Story arc tracking

**Ark Exploration:**
- `PuzzleSystem` (650) — Puzzle mechanics
- `ClueJournal` (748) — Clue tracking
- `RoomTransition` (568) — Room transition animations
- `RoomTutorialDialog` (567) — Room-specific tutorials
- `FastTravelPanel` (297) — Quick navigation
- `ShipSchematicMap` (631) — Ship map visualization
- `InlineShipMap` (448) — Inline ship map
- `AlienSymbolPuzzle` (344) — Alien symbol puzzle

**Cards & Games:**
- `GameCard` (410) — Card rendering component
- `StarterDeckViewer` (677) — Starter deck display
- `BattleVFX` (408) — Battle visual effects
- `BoardEffects` (468) — Board visual effects
- `GalaxyMap` (718) — Trade Wars galaxy map
- `ChessCinematic` (175) — Chess cinematics
- `ChessPieces` (45) — Custom chess pieces

**Media:**
- `CoNexusMediaPlayer` (751) — Interactive story player
- `LyricsViewer` (332) — Song lyrics display
- `RadioMode` (351) — Radio mode player
- `PlayerBar` (175) — Persistent music player bar
- `TransmissionDisplay` (497) — Transmission display

**RPG:**
- `CharacterBonusesPanel` (327) — Character bonus display
- `EquipmentPanel` (325) — Equipment management
- `PaperDollRenderer` (408) — Visual equipment display
- `MoralityMeter` (198) — Morality gauge
- `ClassMasteryPanel` (216) — Class mastery UI
- `PrestigeClassPanel` (243) — Prestige class UI
- `RespecDialog` (464) — Stat respec dialog

**Progression:**
- `AchievementToast` (121) — Achievement notifications
- `DiscoveryNotification` (138) — Discovery alerts
- `DiscoveryUnlockOverlay` (416) — Unlock animations
- `RewardCelebration` (452) — Reward celebration effects
- `MilestoneJournalEntries` (1,132) — Milestone tracking
- `LoreTutorialEngine` (569) — Lore tutorial system

**UI Utilities:**
- `SoundControls` (233) — Audio control panel
- `ThemeSelector` (238) — Theme selection
- `ShareButton` (69) — Social sharing
- `ZoomableImage` (269) — Pinch-to-zoom images
- `LandscapeEnforcer` (202) — Landscape mode for games
- `ErrorBoundary` (62) — Error boundary
- `PageSkeleton` (156) — Loading skeletons
- `NotificationBell` (244) — Notification bell

---

## 10. Shared Modules & Data Files

### 10.1 Shared Configuration Modules (29 files in `shared/`)

| Module | Lines | Purpose |
|--------|-------|---------|
| `citizenTraits` | 1,482 | Complete citizen trait definitions |
| `classMastery` | 723 | Class mastery tree definitions |
| `syndicateWorlds` | 780 | Syndicate world configurations |
| `prestigeClasses` | 721 | Prestige class definitions |
| `towerDefense` | 698 | Tower defense configurations |
| `synergyBonuses` | 595 | Synergy bonus calculations |
| `elementalCombos` | 538 | Elemental combo definitions |
| `seasonalEvents` | 512 | Seasonal event definitions |
| `moralityThemes` | 504 | Morality theme configurations |
| `spaceStations` | 449 | Space station definitions |
| `prestigeQuests` | 449 | Prestige quest definitions |
| `pvpBattle` | 430 | PvP battle mechanics |
| `citizenTalents` | 405 | Talent tree definitions |
| `civilSkills` | 353 | Civil skill definitions |
| `companionSynergies` | 347 | Companion synergy effects |
| `personalQuarters` | 291 | Quarters customization options |
| `coopRaids` | 261 | Co-op raid definitions |
| `gamification` | 226 | Gamification rules |
| `cosmeticShop` | 149 | Cosmetic shop items |
| `loreJournal` | 133 | Lore journal configuration |
| `bossMastery` | 103 | Boss mastery definitions |
| `achievementTraits` | 479 | Achievement trait definitions |
| `traitBonuses` | 89 | Trait bonus calculations |
| `replaySystem` | 82 | Replay system config |
| `donationSystem` | 81 | Donation system config |
| `friendlyChallenges` | 68 | Challenge config |
| `socialFeatures` | 63 | Social feature config |

### 10.2 Client Data Files

| File | Lines | Purpose |
|------|-------|---------|
| `loredex-data.json` | 12,658 | Complete loredex with 233 entities |
| `season1-cards.json` | 5,270 | Season 1 card definitions |
| `loreTutorials.ts` | 2,216 | Lore tutorial content |
| `narrativeActs.ts` | 1,268 | Narrative act definitions |
| `armyRecruitment.ts` | 911 | Army recruitment data |
| `companionData.ts` | 776 | Companion character data |
| `conexusGames.ts` | 647 | CoNexus story game data |
| `craftingData.ts` | 555 | Crafting recipe data |
| `loreAchievements.ts` | 510 | Lore achievement definitions |
| `moralityStoryBranches.ts` | 478 | Morality story branch data |
| `moralityUnlockables.ts` | 422 | Morality unlockable items |
| `loyaltyMissions.ts` | 372 | Loyalty mission data |
| `companionGifts.ts` | 305 | Companion gift data |
| `equipmentData.ts` | 278 | Equipment definitions |
| `bossEncounters.ts` | 263 | Boss encounter data |
| `factionWarData.ts` | 239 | Faction war data |
| `lootTables.ts` | 234 | Loot drop tables |
| `factionWarEvents.ts` | 182 | Faction war events |

---

## 11. Server Infrastructure

### 11.1 Core Server Files

| File | Lines | Purpose |
|------|-------|---------|
| `server/_core/index.ts` | - | Server entry point |
| `server/_core/context.ts` | - | tRPC context builder (auth, user injection) |
| `server/_core/trpc.ts` | - | tRPC base procedures (public, protected, admin) |
| `server/_core/oauth.ts` | - | Manus OAuth handler |
| `server/_core/env.ts` | - | Environment variable access |
| `server/_core/llm.ts` | - | LLM integration (invokeLLM) |
| `server/_core/imageGeneration.ts` | - | AI image generation |
| `server/_core/voiceTranscription.ts` | 284 | Whisper audio transcription |
| `server/_core/notification.ts` | - | Owner notification system |
| `server/_core/sdk.ts` | - | Manus SDK |
| `server/_core/vite.ts` | - | Vite dev server integration |
| `server/_core/cookies.ts` | - | Cookie management |

### 11.2 Sprite Proxy

**File**: `server/spriteProxy.ts` (220 lines)

Proxies character sprite images with automatic background removal using Sharp:
- Fetches images from allowed CDN domains
- Removes white/near-white backgrounds
- Resizes to consistent dimensions
- Caches processed sprites

### 11.3 WebSocket PvP Server

**File**: `server/pvpWs.ts` (588 lines)

Real-time PvP multiplayer via WebSocket:
- Match creation and joining
- Turn-based card game synchronization
- Spectator mode support
- Connection management

---

## 12. Environment & Configuration

### 12.1 Required Environment Variables

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | MySQL/TiDB connection string |
| `JWT_SECRET` | Session cookie signing |
| `VITE_APP_ID` | Manus OAuth app ID |
| `OAUTH_SERVER_URL` | Manus OAuth backend URL |
| `VITE_OAUTH_PORTAL_URL` | Manus login portal URL |
| `OWNER_OPEN_ID` | Owner's Manus ID |
| `OWNER_NAME` | Owner's name |
| `BUILT_IN_FORGE_API_URL` | Manus API URL (LLM, storage, etc.) |
| `BUILT_IN_FORGE_API_KEY` | Manus API key (server-side) |
| `VITE_FRONTEND_FORGE_API_KEY` | Manus API key (frontend) |
| `VITE_FRONTEND_FORGE_API_URL` | Manus API URL (frontend) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret |
| `VITE_APP_TITLE` | App title |
| `VITE_APP_LOGO` | App logo URL |

### 12.2 Key Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` (187 lines) | Vite build configuration with proxy setup |
| `tsconfig.json` (24 lines) | TypeScript compiler options |
| `tsconfig.node.json` (22 lines) | Node TypeScript config |
| `vitest.config.ts` (20 lines) | Vitest test configuration |
| `drizzle.config.ts` | Drizzle ORM configuration |
| `package.json` | Dependencies and scripts |

---

## 13. Testing

### 13.1 Test Suite Overview

- **55 test files** with **2,028 test cases**
- Framework: Vitest
- Location: `server/*.test.ts`
- Run: `pnpm test`

### 13.2 Test Files

| Test File | Lines | Coverage Area |
|-----------|-------|--------------|
| `auth.logout.test.ts` | 62 | Authentication |
| `characterBonuses.test.ts` | 492 | Character bonus calculations |
| `citizenTraits.test.ts` | 368 | Citizen trait system |
| `classMastery.test.ts` | 330 | Class mastery |
| `companion.test.ts` | 228 | Companion system |
| `crafting.test.ts` | 247 | Crafting system |
| `demonPacks.test.ts` | 259 | Demon pack opening |
| `elara.test.ts` | 70 | Elara AI |
| `fightGame.test.ts` | 119 | Fight game |
| `fightMechanics.test.ts` | 162 | Fight mechanics |
| `fightPort.test.ts` | 155 | Fight porting |
| `gameFeatures.test.ts` | 74 | Game features |
| `gamification.test.ts` | 207 | Gamification |
| `hierarchyDamned.test.ts` | 120 | Hierarchy of the Damned |
| `infrastructure.test.ts` | 152 | Infrastructure |
| `lootTables.test.ts` | 200 | Loot tables |
| `narrativeFlow.test.ts` | 461 | Narrative flow |
| `newFeatures.test.ts` | 236 | New features |
| `nft.test.ts` | 414 | NFT integration |
| `phase19-86.test.ts` | ~8,000+ | Phase-specific feature tests |
| `potentials-features.test.ts` | 572 | Potentials features |
| `puzzleAndCards.test.ts` | 259 | Puzzles and cards |
| `pvp.test.ts` | 371 | PvP system |
| `pvpPhase38.test.ts` | 355 | PvP phase 38 |
| `rpgSystems.test.ts` | 515 | RPG systems |
| `spectator.test.ts` | 285 | Spectator mode |
| `tradeWars.test.ts` | 368 | Trade Wars |

---

## 14. Design Bibles & Production Documents

The project includes several comprehensive design documents:

### 14.1 PRODUCTION_BIBLE.md (719 lines)
The Collector's Arena production bible covering:
- Creative vision and tone matrix
- Cinematic direction with camera language templates
- Dialog writing standards and character voice profiles
- Music direction with arena-to-song mapping
- Story mode production guide
- Character voice direction for all 21 fighters
- Arena atmosphere design for all 8 arenas
- Quality benchmarks and checklists

### 14.2 EXPANSION_BIBLE.md (1,022 lines)
Expansion content bible covering:
- 40 new narrative lore cards with rarity tiers
- 5 major dialog scenes with branching choices
- Morality system with skill checks
- The Breaking Point (irreversible choice)
- Synthesis path (hidden third option)
- Army recruitment quest chain
- 40 cinematic sequences with Kling 3.0 prompts
- 12 Suno music generation prompts

### 14.3 GAME_DESIGN.md
Core game design document covering:
- Narrative premise and game state machine
- Room-to-feature mapping
- The Awakening sequence design
- Point-and-click engine specification
- Achievement system design
- Horror sci-fi atmosphere guidelines

### 14.4 FIGHTER_LORE_CROSSREF.md
Fighter character cross-reference:
- All 21 fighters mapped to loredex entries
- Image mismatch tracking
- Era and affiliation data

### 14.5 users-guide.md (642 lines)
Complete user's guide covering all features from a player perspective.

### 14.6 suno-game-music-prompts.md (371 lines)
Music generation prompts for game soundtrack.

---

## 15. Pending Work & Known Issues

### 15.1 Pending Features (135 items)

Key pending items:

**Duelyst Tactical Game:**
- Restructure to 6 factions (Architect, Dreamer, Insurgency, New Babylon, Antiquarian, Thought Virus)
- Generate faction emblems, board backgrounds, UI elements
- Upload character portraits and wire into components
- Connect victories to progression system

**Fighting Game:**
- Hook pose sprites into fight engine for dynamic state-based texture swapping
- Generate sprite sheet animations for smoother combat
- Design and implement cinematic opening sequence
- Design and implement story mode scenes
- Design and implement fighter/arena intro sequences
- Fix white background boxes behind character sprites
- Add difficulty selector to character select screen
- Implement sprite sheet animation system

**Audio:**
- Convert and upload remaining WAV files (5 Book of Daniel tracks + 2 more)
- Map "Little Secrets" audio to "The Secret of Words"

**Art:**
- Regenerate all character portraits in unified art style
- Generate all Duelyst card game artwork
- Upload all character portraits to CDN

### 15.2 Known Issues

- Some test files have pre-existing failures (not related to recent changes)
- 4 fighter characters have image mismatches between game and loredex
- Chess page requires Armory discovery gate (by design, not a bug)

---

## 16. Complete File Map

The complete source code is included in the accompanying ZIP file: `loredex-os-source-code.zip` (2.9 MB).

### Directory Summary

| Directory | Files | Total Lines | Purpose |
|-----------|-------|-------------|---------|
| `client/src/pages/` | 82 | ~48,000 | Page components |
| `client/src/components/` | 95+ | ~30,000 | Reusable components |
| `client/src/game/` | 20+ | ~22,000 | Game engines |
| `client/src/contexts/` | 10 | ~5,200 | React contexts |
| `client/src/data/` | 18 | ~26,000 | Static data files |
| `client/src/hooks/` | 7 | ~645 | Custom hooks |
| `client/src/lib/` | 7 | ~909 | Utility libraries |
| `server/routers/` | 50 | ~18,000 | API routers |
| `server/*.ts` | 20+ | ~5,000 | Server utilities |
| `server/*.test.ts` | 55 | ~15,000 | Test files |
| `shared/` | 29 | ~9,000 | Shared modules |
| `drizzle/` | 2 | ~2,700 | Database schema |

**Total**: ~192,612 lines of TypeScript/TSX/CSS code.

---

*Document generated April 1, 2026. For the complete source code, see the accompanying ZIP archive.*
