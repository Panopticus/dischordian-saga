# Project TODO

- [x] Redesign homepage as mobile-first Illuminati classified feed
- [x] Add dark ops / surveillance UI aesthetic (glitch, redacted, scanlines)
- [x] Create scroll-driven feed of forbidden knowledge (characters, songs, factions)
- [x] Make navigation simple and intuitive for mobile phone use
- [x] Add immersive micro-interactions (typing effects, pulse, flicker)
- [x] Ensure the whole experience feels like a self-contained mobile app
- [x] Boot sequence with eye symbol, terminal text, ACCESS GRANTED animation
- [x] Signal header with live timestamp, signal strength, scrolling ticker
- [x] Quick action pills (BOARD, SEARCH, FIGHT, TIMELINE, WATCH, ARK)
- [x] Clearance status bar with XP progress
- [x] Filter tabs (ALL INTEL, SUBJECTS, SITES, ORGS)
- [x] Dossier cards with classification badges, thumbnails, bio previews
- [x] Album cards as DECODED TRANSMISSIONS with track listings
- [x] Music video horizontal scroll as VISUAL INTEL
- [x] Conexus games as INTERACTIVE OPS
- [x] END OF TRANSMISSION footer with THE PANOPTICON IS WATCHING
- [x] Fix boot sequence .includes() crash on undefined
- [x] Fix sticky signal header positioning
- [x] Rewrite sprite system so every character has a unique pixel-art model
- [x] Design The Architect's unique sprite with all animation frames
- [x] Build unique sprites for all remaining fight-eligible characters (now 3D models)
- [x] Ensure fight game works end-to-end with new character-specific sprites (now 3D models)
- [x] Overhaul fight game to MK1 quality: larger sprites, detailed pixel art, proper proportions
- [x] MK-style HUD with health bars, round indicators, timer, character portraits
- [x] Screen shake, hit sparks, blood particles, impact freeze frames
- [x] Round system with ROUND 1/2/3 announcer text, FIGHT!, FINISH HIM
- [x] MK-style stage backgrounds with parallax scrolling (3D arena with pillars, lighting)
- [x] Improved combat feel: hitstun, blockstun, juggle physics, combo system
- [x] Mobile touch controls optimized for fighting game input
- [x] Overhaul AI with 4 fighting styles: aggressive, defensive, evasive, balanced
- [x] Assign fighting styles to each character based on lore/personality
- [x] Implement MK/SF/Tekken-inspired hit physics with real contact feel
- [x] Add proper hitstun, blockstun, knockback, and juggle mechanics
- [x] Screen shake, hit sparks, freeze frames on contact
- [x] Combo system with chain attacks and cancel windows
- [x] Proper startup/active/recovery frames for all attacks
- [x] AI that actually attacks and creates sense of danger
- [x] Difficulty-scaled AI aggression and reaction times
- [x] Rebuild fight game as 2.5D using Three.js (3D models on 2D gameplay plane)
- [x] Create 3D character models with proper proportions for each fighter
- [x] Three.js arena with camera, lighting, and 3D stage environment
- [x] Port all combat mechanics to the 3D engine
- [x] 3D hit effects, particle systems, and camera shake
- [x] Convert fighting game to 2.5D style (MK9/MKX/MK11 style) with scale.x mirroring
- [x] Fix camera framing: closer camera, faster tracking, proper FOV
- [x] Scale up character models 30% for better visibility
- [x] Remove old FightEngine.ts, FightArena.tsx, SpritePreview.tsx, SpriteGenerator.ts
- [x] Fix stale Vite cache errors from deleted files
- [x] Upgrade character models to AAA-quality anime-style detailed 3D models (billboard sprite approach)
- [x] Match character models to their anime artwork from the loredex (exact artwork as textures)
- [x] Add detailed anatomy: proper human proportions, fingers, facial features (using actual artwork)
- [x] Add character-specific clothing, armor, hair, and accessories (using actual artwork)
- [x] Implement anime/toon shading (cel-shaded look) for all characters (custom shader with glow outline)
- [x] Add glowing effects, energy auras, and character-specific visual flair (glow outline + energy particles)

## Phase 2: Dischordian Saga Card Game Ecosystem
- [x] Research VTES (Vampire: The Eternal Struggle) card game rules and mechanics
- [x] Research Trade Wars BBS game mechanics and gameplay loop
- [x] Scrape Degenerous DAO wiki for all lore, NFT data, and character info
- [x] Scrape NFT metadata for potentials, levels, perks, power levels
- [x] Design database schema for cards, users, decks, game state, Inception Ark, Trade Wars
- [x] Build user authentication system (Manus OAuth + wallet connect in Phase 30+)
- [x] Build admin panel for content management (AdminPage with user management, analytics, batch operations)
- [x] Build user character sheets with stats, inventory, and progression (Panopticon Dossier in Phase 34b)
- [x] Create 1000+ card database (characters, events, items, locations) — 3000 cards seeded
- [x] Assign alignment system (Order 80% / Chaos 20%)
- [x] Assign fundamental elements (Earth/Space 40%, Fire/Time 30%, Water/Probability 20%, Air/Reality 10%)
- [x] Assign classes (Spy, Oracle, Assassin, Engineer, Soldier)
- [x] Assign rarity values to all cards
- [x] Integrate NFT metadata (potentials, first 10 are Neyons, perks, power levels)
- [x] Build card game UI with VTES-inspired rules
- [x] Build card attack animations and combat system
- [x] Build Inception Ark explorable map with unlockable areas
- [x] Build trophy room with unlockable display themes
- [x] Build Trade Wars-style BBS game tied to card system
- [x] Integrate card unlocking through official content participation (ContentRewardToast + WatchPage in Phase 25)
- [x] Connect fighting game as invasion mechanic within card game (fight_victory rewards + invasion events in Phase 25)
- [x] Create histories for all characters based on lore appearances (62 characters with histories in Phase 25)
- [x] Expand card database from ~1000 to 3000 cards (1000 per season)
- [x] Create all 1000 Potential NFT cards as individual entries
- [x] Map Potentials to their story appearances from the Loredex
- [x] Season 1 set: Dischordian Logic / Age of Privacy era
- [x] Season 2 set: Book of Daniel / Age of Revelation era
- [x] Season 3 set: Silence in Heaven / Fall of Reality era

## Phase 3: Card Game UI, Inception Ark, and API Routes
- [x] Build tRPC API routes for card browsing with filters (season, type, rarity, element, class)
- [x] Build tRPC API routes for deck management (create, edit, delete, list)
- [x] Build tRPC API routes for user card collection
- [x] Build tRPC API routes for card game engine (start match, play cards, resolve combat)
- [x] Build card browser/collection page with grid layout and filtering
- [x] Build individual card detail view with full stats and artwork
- [x] Build deck builder UI with drag-and-drop card management
- [x] Build VTES-inspired card game gameplay UI with animated card attacks
- [x] Build card combat animations (attack, defend, special effects)
- [x] Build Inception Ark explorable map with room navigation
- [x] Build unlockable Ark rooms with discovery mechanics
- [x] Build trophy room with card displays and unlockable themes
- [x] Wire up all new routes in App.tsx
- [x] Integrate navigation between card game, Ark, and existing pages

## Phase 4: Trade Wars BBS Game
- [x] Build Trade Wars tRPC API routes: sector navigation, warping, scanning
- [x] Build Trade Wars trading system: buy/sell commodities at ports
- [x] Build Trade Wars combat system: ship-to-ship battles with card bonuses
- [x] Build Trade Wars sector map UI with BBS terminal aesthetic
- [x] Build Trade Wars ship HUD with stats, cargo, fuel display
- [x] Build Trade Wars trading interface at ports
- [x] Build Trade Wars combat screen with attack/defend options
- [x] Integrate card system bonuses into Trade Wars (card-based ship upgrades)
- [x] Connect Trade Wars to Inception Ark Command Deck access point
- [x] Seed initial galaxy with sectors, ports, and hazards

## Phase 5: Leaderboard, Deck Builder, Planet Colonization
- [x] Build Trade Wars leaderboard backend (tRPC endpoint for rankings by credits, sectors, combat wins)
- [x] Build Trade Wars leaderboard BBS-style UI (high score board in terminal aesthetic)
- [x] Build deck builder UI page with drag-and-drop card management
- [x] Build deck builder filtering, search, and card slot assignment
- [x] Build deck builder save/load/delete functionality
- [x] Build planet colonization database schema (tw_colonies table)
- [x] Build planet colonization tRPC endpoints (claim, develop, collect income)
- [x] Build planet colonization UI in Trade Wars terminal (colony management commands)
- [x] Build passive income system tied to card collection bonuses
- [x] Write vitest tests for leaderboard, deck builder, and colonization features

## Phase 6: Card Crafting / Fusion System
- [x] Design crafting recipes (fusion rules: same-rarity pairs, cross-element combos, legendary fusions)
- [x] Add crafting_log table to database schema for tracking crafted cards
- [x] Build tRPC endpoints for crafting: listRecipes, craftCard, getCraftingHistory
- [x] Build Research Lab crafting UI page with card selection, recipe preview, and fusion animation
- [x] Unlock Research Lab room in Inception Ark and wire route
- [x] Add crafting link from card browser and deck builder pages
- [x] Write vitest tests for crafting endpoints

## Phase 7: White Wolf Character Creation + AAA Card Game Overhaul + Economy

### Citizen Character Creation (White Wolf Style)
- [x] Design Citizen character sheet schema (species, class, alignment, element/dimension, attributes)
- [x] Build citizen_characters DB table with dot-rating attributes
- [x] Build Citizen creation flow: species selection (DeMagi/Quarchon/Ne-Yon)
- [x] Build class selection step (Engineer/Oracle/Assassin/Soldier/Spy)
- [x] Build alignment selection step (Order/Chaos) with visual glow preview
- [x] Build element/dimension selection based on species
- [x] Build attribute point allocation with White Wolf dot system (Attack/Defense/Vitality)
- [x] Build character sheet UI page with dot ratings, portrait, and gear display
- [x] Every player gets one free Citizen; must unlock additional cards/characters

### AAA Card Game Engine Overhaul
- [x] Build Architect vs Dreamer faction selection with asymmetric bonuses
- [x] Build 3-lane battlefield system (Vanguard/Core/Flank) with 3 slots each
- [x] Build card placement, attack targeting, and lane mechanics
- [x] Build element rock-paper-scissors combat modifiers
- [x] Build card keywords system (Stealth, Taunt, Drain, Pierce, Evolve, etc.)
- [x] Build 4 AI difficulty tiers (Recruit/Operative/Commander/Archon)
- [x] Build Architect faction bonus: +2 ATK all units, first card costs 1 less
- [x] Build Dreamer faction bonus: +2 HP all units, extra card draw, survive 15 turns win
- [x] Build species bonuses in card game (DeMagi=extra HP, Quarchon=base armor, Ne-Yon=both)

### Trait-Based Stats System
- [x] Implement alignment cosmetic effects (Order=light glow, Chaos=dark glow)
- [x] Implement species combat bonuses (DeMagi HP, Quarchon armor, Ne-Yon both)
- [x] Implement element abilities (Earth/Space=haste, Water/Time=underwater, Air/Prob=fly, Fire/Reality=fire immune)
- [x] Implement class starting gear (Assassin=poison+ranged, Warrior=sword+shield, Prophet=potions, Engineer=diamond pickaxes)
- [x] Implement attribute bonuses to Attack/Armor/Health based on dot ratings

### Dream Resource Economy
- [x] Build Dream resource system (Soul Bound + Non-Soul Bound drops from mobs)
- [x] Build Dream drop mechanics in Trade Wars combat and card game
- [x] Build Potential upgrading: Class leveling (EXP + Dream)
- [x] Build Potential upgrading: Attribute leveling (DNA/CODE + Dream)

### Card Crafting System
- [x] Build crafting recipes backend (fusion, transmutation, enhancement)
- [x] Build Research Lab crafting UI page
- [x] Build card fusion: combine duplicates for upgraded variants

### Phase 3: The Foundation
- [x] Build ship expansion system for Trade Wars (rooms, upgrades, levels 1-10)
- [x] Build base building mechanics with resource requirements
- [x] Build Intergalactic Market hub (Trade Depot, Social Arenas, Spaceship Dock, Trophy Gallery)
- [x] Build in-game store with purchasable items (Troop Upgrades, Skill Packs, Cosmetics, Boosters)
- [x] Set up Stripe payment integration for real-money purchases
- [x] Build Dream as base component for world-building in Phase 3

### Season 1 Card Generation
- [x] Generate Season 1 card data from loredex characters (58 characters → cards)
- [x] Generate Season 1 card data from loredex songs (89 songs → spell/event cards)
- [x] Generate Season 1 card data from factions and locations
- [x] Build card art generation system with CSS/SVG procedural art
- [x] Build card animations (play, attack, death, special ability)
- [x] Write vitest tests for all new features (86 tests passing)

## Bug Fixes
- [x] Fix live feed too dark / can't be seen on screen — increase contrast and brightness
- [x] Fix Inception Ark viewer out of proportion — make it proportional
- [x] Design a nice looking player skin that fits the Dischordian theme

## Phase 8: Mobile Optimization + PWA

### Progressive Web App (PWA)
- [x] Create manifest.json with app name, icons, theme color, display: standalone
- [x] Create service worker for offline caching
- [x] Add PWA meta tags to index.html (viewport, theme-color, apple-touch-icon)
- [x] Generate app icons for all sizes (192x192, 512x512)

### Mobile Responsiveness
- [x] Fix Home page for mobile (hero text, stats grid, character cards, album grid)
- [x] Fix Inception Ark page for mobile (ship schematic, deck tabs, room cards)
- [x] Fix Card Game page for mobile (3-lane battlefield, hand cards, HUD)
- [x] Fix Card Browser page for mobile (grid layout, filters, card detail modal)
- [x] Fix Deck Builder page for mobile (collection panel stacks vertically, deck slots)
- [x] Fix Trade Wars page for mobile (terminal width, ASCII banner, command input)
- [x] Fix Research Lab page for mobile (recipe cards, dream balance badges)
- [x] Fix Store page for mobile (product grid, purchase history table)
- [x] Fix Citizen Creation page for mobile (step wizard, dot allocation, alignment cards)
- [x] Fix Character Sheet page for mobile (stat display, upgrade buttons)
- [x] Fix Fight page for mobile (character grid, stats, title screen)
- [x] Fix Trophy Room page for mobile (stats grid, card displays)
- [x] Fix Console page for mobile (character grid columns)
- [x] Fix Character Timeline for mobile (calendar grid)
- [x] Fix GameCard component for mobile (responsive sizing sm/md/lg)
- [x] Fix AppShell bottom padding for PlayerBar + bottom nav overlap
- [x] Ensure all navigation menus work on mobile (hamburger menu, bottom nav)
- [x] Ensure all text is readable without zooming (min 16px base font)
- [x] Ensure minimum touch target size (32px) for interactive elements
- [x] Ensure no horizontal overflow on any page (overflow-x: hidden)
- [x] Add safe-area-inset support for notched devices
- [x] Add PWA standalone mode adjustments
- [x] Disable hover effects on touch devices
- [x] Reduce heavy animations on mobile for performance

## Phase 9: Navigation Simplification + SagaVerse Games Hub
- [x] Simplify sidebar into logical groups (C.A.D.E.S., The Lore, The Media, SagaVerse Games, Your Citizen)
- [x] Create SagaVerse Games hub page with all game tiles
- [x] Add SagaVerse Games tab to sidebar and mobile bottom nav
- [x] Fix doom scroll feed text — white/glowing headlines, brighter summaries
- [x] Make Home page feed text brighter and more readable
- [x] Ensure Card Game has clear entry point (ENTER THE STRUGGLE → faction → difficulty → battle)
- [x] Ensure Trade Wars has clear entry point (AUTHENTICATE → boot → terminal)
- [x] Update game back-links to point to /games hub
- [x] Update mobile bottom nav to: Home, Lore, Games, Media, Store
- [x] Collapsible nav groups with active state highlighting

## Phase 10: Inception Ark Control Room + Elara AI Agent

### Elara AI Lore Agent (BioWare-style Dialog)
- [x] Generate Elara character portrait image (holographic AI woman)
- [x] Build BioWare-style dialog box component (portrait + dialog text + multiple choice responses)
- [x] Build Elara floating icon that opens dialog on click (bottom-right, cyan glow)
- [x] Connect Elara to LLM backend for lore Q&A about characters, factions, events
- [x] Elara can explain all Inception Ark functions and CADES
- [x] Elara dialog feels like Mass Effect / KOTOR conversation wheel
- [x] Elara backend test (4 tests passing)

### Inception Ark Control Room Redesign
- [x] Generate nano banana backdrop of Inception Ark control room interior
- [x] Redesign main app shell to feel like you're inside the Ark control room
- [x] Ark control room backdrop as subtle background with radial gradient overlay
- [x] Header redesigned as ARK COMMAND STRIP with clearance badge
- [x] Sidebar redesigned as ARK SYSTEMS PANEL with collapsible nav groups
- [x] Design cool lore-themed access points for all functions from the control room
- [x] Everything feels like you've taken control and can discover things

### CADES Game Framing
- [x] Frame all games as CADES parallel universe simulations
- [x] Each game intro explains you're entering a parallel universe via CoNexus tech
- [x] Player choices can either save or doom the parallel universe
- [x] SagaVerse Games hub becomes CADES SIMULATION HUB with dimensional rift descriptions

### Card Game Tutorial
- [x] Build card game tutorial system guided by Elara (7-step tutorial)
- [x] Elara explains rules in-game conversational form
- [x] Tutorial covers: factions, lanes, deploying cards, combat, influence, elements, keywords
- [x] Tutorial accessible from card game menu with Elara avatar

### Void Energy Design System Application
- [x] Apply Void Energy color palette to CSS custom properties (Blue Void #010020 bg, Neon Cyan, Electric Blue, etc.)
- [x] Apply glass surface physics (glass-float, glass-sunk utility classes)
- [x] Apply 3D lighting model (top border brighter, bottom border dimmer)
- [x] Apply text luminance layers (100% headers, 85% body, 60% metadata)
- [x] Apply materialize/dematerialize transitions for modals and cards
- [x] Apply cyber pulse animation for active items
- [x] Ensure interactive elements have visual affordance before hover (mobile rule)

## Bug Fixes
- [x] Fix card game not starting (limit exceeded 100 max, auth gate removed for play access)

## Phase 11: Context-Aware Elara + Conspiracy Board Redesign
- [x] Make Elara context-aware: detect current page/route via useLocation
- [x] Add page-specific dialog options for Home page (lore overview, CADES, factions)
- [x] Add page-specific dialog options for Card Game page (strategy, rules, elements)
- [x] Add page-specific dialog options for Trade Wars page (trading tips, sectors, combat)
- [x] Add page-specific dialog options for Inception Ark page (rooms, decks, ship systems)
- [x] Add page-specific dialog options for Conspiracy Board page (connections, factions, hidden links)
- [x] Add page-specific dialog options for Store/Research Lab pages (dream currency, crafting)
- [x] Add page-specific dialog options for Character Sheet/Citizen pages (attributes, alignments)
- [x] Add page-specific dialog options for Card Browser/Deck Builder pages (deck building, card types)
- [x] Add page-specific dialog options for Fight page (combat, character abilities)
- [x] Add page-specific dialog options for Watch/Discography pages (music, videos, albums)
- [x] Pass page context to LLM backend so Elara's responses are contextual
- [x] Redesign Conspiracy Board with Void Energy visuals (deep void gradient, glass surfaces)
- [x] Add animated particle system (60 ambient particles with fade in/out)
- [x] Improve node rendering with character portraits (circular clip), faction colors, connection badges
- [x] Add animated data stream pulse dots traveling along connection edges
- [x] Add scanning ring animation for selected/hovered nodes
- [x] Redesigned node detail panel with image header, connection tags, and type badges
- [x] Add hover state with node highlighting and connected edge illumination
- [x] Add zoom indicator and polished filter controls with type icons

## Phase 12: Dischordian Saga Show — Primary Feature
- [x] Redesign Watch page as "The Dischordian Saga" show page organized by epochs
- [x] Add Epoch Zero: The Fall of Reality with YouTube playlist (PLhUHvGa0xBaQFYJatsDLPtvbQVDpzydl1)
- [x] Add First Epoch: The Awakening with YouTube playlist (PLhUHvGa0xBaRniDT5eztLsXFTzbR0JaCu)
- [x] Add The Fall of Reality: The Engineer with YouTube playlist (PLhUHvGa0xBaQfuKeeqx7cLOfhZ1Fr1-jb)
- [x] Add The Spaces Inbetween Epochs with correct YouTube playlist (PLhUHvGa0xBaQdgXe7lQz5mYRYQaaWZ86i)
- [x] Add Being and Time: Second Epoch with YouTube playlist (PLhUHvGa0xBaQXcM_dscfjlqjYOeGCvtoE)
- [x] Add The Age of Privacy with correct YouTube playlist (PLhUHvGa0xBaQ8W2PK16gS07gtBg3m64m2)
- [x] Add bonus CoNexus Stories with YouTube playlist (PLhUHvGa0xBaQdlo3Xgz4_5_TFFw2YzmAz)
- [x] Embed YouTube playlists with proper iframe embedding (click-to-load for performance)
- [x] Make the show a primary/prominent feature in navigation (THE SAGA group 2nd in sidebar, 2nd in mobile bottom nav)
- [x] Add epoch descriptions and lore context for each section
- [x] Design with Void Energy aesthetic matching the rest of the app
- [x] Add LISTEN link to THE SAGA nav group for music access
- [x] Update Elara's Watch page dialog with epoch-specific questions
- [x] Add Watch page context hint for Elara's LLM-powered responses
- [x] Fix duplicate playlist IDs (Spaces Between and Age of Privacy were using wrong IDs)
- [x] All 90 tests passing

## Phase 12b: Watch Page Enhancements + Discography Page
- [x] Add episode thumbnails/previews to each epoch section showing key characters/scenes
- [x] Build "Continue Watching" feature that tracks which epochs a user has viewed
- [x] Suggest next epoch to watch based on viewing progress
- [x] Build dedicated Discography/Listen page under THE SAGA nav group
- [x] Album art, track listings, and streaming links (Spotify/Apple Music/YouTube Music/Tidal)
- [x] Wire up Discography page route in App.tsx and navigation
- [x] Updated LISTEN nav link to DISCOGRAPHY pointing to /discography
- [x] "VIEWED" badge on watched epoch headers
- [x] Progress bar showing epoch completion percentage
- [x] All 90 tests passing

## Phase 13: Major Enhancements (10 Features)
- [x] 1. Lyrics Viewer with lore annotations — LyricsViewer component + lyrics tRPC router (LLM-powered generation with entity highlighting)
- [x] 2. Unified Saga Timeline — SagaTimelinePage at /saga-timeline with horizontal scrollable timeline mapping epochs, albums, key events, CoNexus games
- [x] 3. User Playlists & Favorites — FavoritesPage at /favorites with localStorage-based bookmarks for songs, entities, episodes; "Mission Briefing" dashboard with stats
- [x] 4. Ambient Soundtrack Radio — RadioMode component rendered globally, auto-plays songs by epoch/faction/mood with floating mini-player
- [x] 5. Character Story Arc deep dives — StoryArc component on EntityPage showing chronological appearances across albums, epochs, CoNexus games
- [x] 6. Lore Quiz / Knowledge Check — LoreQuizPage at /lore-quiz with faction/location/era questions, XP rewards, gamification integration
- [x] 7. Social Sharing OG Cards — usePageMeta hook for dynamic OG tags on Entity/Song/Album pages + ShareButton component + OG meta in index.html
- [x] 8. "Previously On..." Recaps — Added previouslyOn field to each epoch with narrative summaries displayed in EpochSection and Stories mode
- [x] 9. Easter Eggs & Hidden Content — EasterEggs component with Konami code (↑↑↓↓←→←→BA), secret console commands, hidden entity reveals at higher clearance levels
- [x] 10. Mobile-First Watch Experience — "Stories" view mode on WatchPage with swipeable card-based epoch browsing, progress dots, character previews
- [x] All 90 tests passing

## Phase 14: Card Game Lore — The Architect vs The Dreamer
- [x] Design core lore: Eternal struggle between the Architect (machine intelligence) and the Dreamer (humanity)
- [x] Integrate CADES system as the mechanism that determines the fate of universes
- [x] Create narrative framework for card battles as cosmic conflicts (CardGameLore.ts with 8 narrative triggers)
- [x] Update card game UI with lore-driven intro, faction descriptions, and narrative context
- [x] Deep faction lore: Architect (Machine Lattice, Panopticon origin, systematic override) vs Dreamer (collective consciousness, free will, endurance)
- [x] Connect card game outcomes to universe fate narrative (saved/doomed resolution)
- [x] Pre-battle briefing screen with animated CADES dimensional lock and universe generation
- [x] Post-battle fate resolution showing whether universe was saved or doomed
- [x] Multiverse Map screen tracking all battle outcomes (universes saved/doomed, streaks)
- [x] Narrative toast system during combat (battle_start, turn_10, low_influence triggers)
- [x] Faction-specific victory/defeat lines and battle cries
- [x] All 90 tests passing

## Phase 15: Card Flavor Text, Codex Library, Faction Abilities
- [x] All 169 season 1 cards now have flavor text (The Engineer was the only missing one)
- [x] Created FactionAbilities.ts with 12 unique abilities: 6 Architect (surveillance_protocol, data_corruption, system_override, neural_hijack, panopticon_sight, machine_lattice_link) and 6 Dreamer (dream_weave, inspiration_surge, collective_memory, reality_anchor, hope_resonance, consciousness_bloom)
- [x] Each ability has distinct triggers: on_deploy, on_combat, on_death, on_turn_start
- [x] Built Codex/Lore Library page with 20+ unlockable entries across 5 categories (The Struggle, The Architect, The Dreamer, CADES System, The Multiverse)
- [x] Entries unlock based on clearance level, battles won, and discovery progress
- [x] Integrated faction abilities into CardBattleEngine at all 4 trigger points (deploy, combat, death, turn_start)
- [x] Cards display faction ability indicator on battlefield and full ability name in zoom view
- [x] Codex page route (/codex) and nav link added to THE LORE group
- [x] All 90 tests passing

## Phase 16: Data Cleanup & Model Expansion (v4)
- [x] Fix corrupted graph connections (removed 16 broken relationships, 507 valid connections remain)
- [x] Clean polluted text fields (PLAY NOW, Connections, Appearances junk removed from bio/description)
- [x] Add missing entities: Varkul the Blood Lord, Fenra the Moon Tyrant, The Clone, Castle of Death, Cathedral of Code, Cursed Forest + others (176 total entries now)
- [x] Add missing CoNexus stories: The Necromancer's Lair, Awaken the Clone
- [x] Expand episodes data with full per-episode objects (epochs with playlist IDs)
- [x] Normalize image filename mappings — all 176 entries have CDN images
- [x] Reconcile entity counts — 176 entries (58 chars, 19 locations, 10 factions, 89 songs)
- [x] Expand app data model/types: streaming_links, song_character_map, aliases, episodes, music_video, conexus_games
- [x] Update LoredexContext with expanded data model (aliases, streaming links, episodes, songCharacterMap)
- [x] Update SearchPage to index and search aliases (alias match indicator)
- [x] Update DiscographyPage to use data-driven streaming links from context
- [x] Update WatchPage to use songCharacterMap for richer episode character data
- [x] Fix Relationship interface (relationship_type field name mismatch)
- [x] Fix BoardPage and EntityPage to use relationship_type from updated data model
- [x] All 90 tests passing

## Phase 17: Inception Ark Adventure Game — Full Immersive Experience

### Core Architecture
- [x] Design game state machine: Awakening → Exploration → Full Access progression
- [x] Map every app feature to a physical Inception Ark room/location (GAME_DESIGN.md)
- [x] Build player progression database schema (room unlocks, achievements, game state)
- [x] Build first-time-user detection and routing to Awakening sequence (GameContext + App.tsx gating)

### Missing Lore Entities
- [x] Add Wraith of Death, Jericho, The Harmony, Ambassador Voss, The Thought Virus, Inception Arks entities (186 total entries)
- [x] Restore the 16 previously removed relationships (523 total)
- [x] Add Silence in Heaven album placeholder to Discography page

### Elara Redesign
- [x] Generate new Elara portrait with long black hair (horror sci-fi aesthetic)
- [x] Elara guides entire Awakening sequence as ship AI
- [x] Elara explains each room on first visit with contextual dialog

### The Awakening Sequence (First-Time Experience)
- [x] Cryo pod scene: player wakes up disoriented, Elara's voice guides them
- [x] Elara asks questions that determine race/class/skills (character creation as narrative)
- [x] Lore exposition: you are a Potential on one of the last Inception Arks
- [x] Season 2 awakening — first wave was Season 1, communications severed across multiverses
- [x] Initial card deck generated from character creation choices
- [x] Horror sci-fi atmosphere: flickering lights, unknown sounds, isolation

### Point-and-Click Exploration Engine
- [x] Build room scene renderer with nano banana backdrop images
- [x] Clickable hotspot system (items, doors, terminals, objects)
- [x] Room transition animations (walking between connected rooms)
- [x] Inventory/interaction system for discovered items
- [x] Old-school adventure game UI (verb bar or context menu on click)

### Inception Ark Room Scenes (nano banana art for each)
- [x] Cryo Bay / Quarters — where you wake up (character sheet, settings)
- [x] Bridge / Command Center — Conspiracy Board, Timeline, main navigation
- [x] Archives / Data Core — Search, Entity Browser, Codex Library
- [x] Communications Array — Watch page (The Saga), Radio
- [x] Engineering Bay — Card Crafting, Research Lab
- [x] Armory / Training Deck — Fight Game, Card Game Battle
- [x] Cargo Hold / Trading Post — Trade Wars, Store
- [x] Observation Deck — Discography, Music Player
- [x] Medical Bay — Citizen Character Sheet, Stats
- [x] Hangar Bay — Inception Ark Map, Deck Builder (placeholder)
- [x] Mess Hall / Commons — Favorites, Playlists, Social (placeholder)
- [x] Captain's Quarters — Achievements, Trophy Room, Lore Quiz

### Achievement System
- [x] Achievement categories: Exploration, Combat, Lore, Collection, Discovery
- [x] Achievements unlock cosmetics, titles, and bonus cards
- [x] Achievement notifications with horror sci-fi flair
- [x] Achievement gallery in Captain's Quarters / Trophy Room

### Quick Access System
- [x] Once a room is unlocked, add it to the ship's nav computer (sidebar)
- [x] Minimap showing unlocked rooms and current location (Ark Explorer page)
- [x] Quick-travel between unlocked rooms (room links in sidebar)

### Entity Relationship Mini-Graph
- [x] Build mini connection graph on Entity pages showing direct relationships (canvas-based force-directed graph)
- [x] Clickable nodes to navigate between connected entities

## Phase 18: Sound System, Card Deck Viewer, and Puzzle Mechanics

### Ambient Sound & Music System
- [x] Build Web Audio API-based sound engine (SoundContext) with volume controls
- [x] Procedural ambient sounds: ship hum, cryo hiss, electrical crackle, distant alarms (8 ambient layers)
- [x] Room-specific ambient layers that crossfade on room transitions
- [x] Awakening sequence sound design: heartbeat, cryo pod opening, Elara voice cues
- [x] Global mute/volume toggle in UI (SoundControls component)
- [x] Sound effects for interactions: item pickup, door unlock/locked, achievement, terminal access (10 SFX types)

### Card Deck Viewer
- [x] Generate nano banana card art for starter deck cards (5 class-themed card images)
- [x] Build StarterDeckViewer component with flip animations and card detail view
- [x] Starter deck generated from character creation choices (race/class/alignment/element)
- [x] Card collection tracking in game state
- [x] Cards discoverable in room exploration (clickable items reward cards)
- [x] Card rarity system: Common, Uncommon, Rare, Legendary

### Puzzle Mechanics for Locked Rooms
- [x] Lore-based riddle system: answer questions about the Dischordian Saga to unlock doors (Archives, Armory)
- [x] Keycard item system: find keycards in one room to unlock another (Observation Deck, Captain's Quarters)
- [x] Puzzle UI component with atmospheric presentation (PuzzleModal with 5 puzzle types)
- [x] Hint system via Elara dialog when stuck
- [x] 8 unique puzzles across different locked rooms (riddle, cipher, sequence, keycard, power relay)
- [x] Puzzle completion rewards (room unlock, toast notifications)
- [x] 112 tests passing (19 new puzzle/card tests)

## Phase 19: Elara TTS, Card Battle System, and Hidden Easter Eggs

### Elara Text-to-Speech
- [x] Build Web Speech API integration for Elara's dialog (useElaraTTS hook)
- [x] Auto-speak Elara dialog during Awakening sequence (speak triggers on step change)
- [x] Auto-speak Elara room introductions on first visit
- [x] Speak hotspot dialog on examine/interact
- [x] TTS toggle in sound controls (enable/disable voice)
- [x] Select appropriate female voice with pitch/rate tuning for horror sci-fi tone (0.85 rate, 0.9 pitch)

### Card Battle System
- [x] Design turn-based card battle engine (play cards, attack face/cards, abilities, energy system)
- [x] Build AI opponent with 3 difficulty levels (easy/normal/hard)
- [x] Build card battle UI with hand, field, health bars, energy, and turn indicator (CardBattlePage)
- [x] Integrate into Armory room's Combat Arena hotspot (/battle route)
- [x] Battle rewards: XP, new cards, achievements
- [x] 3 AI opponent decks: Corrupted Sentinel (easy), Thought Virus (normal), Void Entity (hard)

### Hidden Easter Eggs
- [x] Add secret clickable pixels/areas in room scenes (3-5% size, 8% opacity, barely visible)
- [x] Easter eggs reveal lore fragments (Antiquarian's mark, Engineer mind swap, Oracle clone, Meme identity)
- [x] Easter eggs reward bonus cards: mythic/legendary cards not available through normal play
- [x] Easter eggs unlock special achievements
- [x] 10 Easter eggs across all rooms (one per room)
- [x] Visual hint system: tiny 1.5px dot at 8% opacity, glows to 60% on hover
- [x] 130 tests passing (18 new Phase 19 tests)

## Phase 20: Card Gallery, Player Stats Dashboard, and Contextual Music

### Card Collection Gallery
- [x] Build gallery page showing all collected cards (starter deck + battle rewards + Easter egg bonus)
- [x] Filter by rarity (Common, Uncommon, Rare, Legendary, Mythic)
- [x] Filter by faction/element
- [x] Card flip animation on click to show details
- [x] Track total cards collected vs total available (completion percentage)
- [x] Show locked/undiscovered cards as silhouettes

### Player Profile / Stats Dashboard
- [x] Total rooms explored / total rooms
- [x] Puzzles solved / total puzzles
- [x] Easter eggs found / total Easter eggs
- [x] Battles won / battles played
- [x] Cards collected / total cards
- [x] Overall completion percentage with weighted progress bar
- [x] Achievement showcase section
- [x] Character sheet summary (race, class, skills)
- [x] Rank system: Unranked → Recruit → Field Operative → Senior Agent → Master Operative → Grand Archivist

### Contextual Ambient Music
- [x] Map album tracks to rooms (Dischordian Logic → Bridge/Cryo, Age of Privacy → Archives/Comms/Medical, Book of Daniel → Engineering/Armory, Silence in Heaven → Observation/Captain's)
- [x] Build music player that auto-plays room-appropriate tracks via YouTube IFrame API
- [x] Crossfade between tracks on room transitions
- [x] Use YouTube embed for actual Dischordian Saga album tracks (37 tracks with video IDs)
- [x] Music volume control integrated with existing sound system (separate SFX + Music sliders)
- [x] Track display showing current song name and album in SoundControls popup
- [x] Music toggle button with now-playing indicator
- [x] 152 tests passing (22 new Phase 20 tests)

## Phase 21: Server Save/Load, Leaderboard, and Room Transitions

### Server-Side Save/Load System
- [x] Create database table for player game state (rooms unlocked, items, puzzles, achievements, cards)
- [x] Build tRPC procedures: saveGameState, loadGameState
- [x] Auto-save on significant actions (room unlock, puzzle solve, item collect, battle win)
- [x] Auto-load on login — merge server state with localStorage fallback
- [x] Handle conflict resolution (server state takes priority if newer)

### Leaderboard Page
- [x] Build leaderboard page with rankings by completion percentage
- [x] Rankings by battles won
- [x] Rankings by Easter eggs found
- [x] Display player rank, avatar, and key stats
- [x] Highlight current player's position
- [x] Build tRPC procedures for leaderboard data

### Animated Room Transition Cutscenes
- [x] Build corridor-walking animation component (2-3 second transitions)
- [x] CSS/canvas-based corridor animation with sci-fi aesthetic
- [x] Transition plays between room changes in Ark Explorer
- [x] Different corridor styles based on room connections
- [x] Loading state during transition for smooth room swap

### Tests
- [x] 201 tests passing across 10 test files (49 new Phase 21 tests)
- [x] Server save/load state machine tests
- [x] Stats calculation and rank assignment tests
- [x] Leaderboard sorting and filtering tests
- [x] Room transition theme and timing tests
- [x] Puzzle definitions integrity tests
- [x] Game phase state machine tests
- [x] Room connections graph tests

## Phase 22: Boss Encounters, Previously On, Multiplayer Challenges

### Loredex-Based Boss Encounters
- [x] Design boss characters from actual Loredex data (The Watcher, Game Master, The Meme, The Collector, The Necromancer, The Warlord, The Source, The Architect)
- [x] Create boss-specific card decks with lore-accurate abilities
- [x] Tie bosses to specific Ark rooms (Watcher in Medical Bay, Game Master on Bridge, Meme in Archives, Collector at Comms, Necromancer at Observation Deck, Warlord in Engineering, Source in Cargo Hold, Architect in Captain's Quarters)
- [x] Build boss battle UI with unique intro sequences and lore dialog
- [x] Add boss-tier difficulty with special mechanics (passive abilities, scaling HP, unique rewards)
- [x] Award unique boss-drop cards and achievements on victory

### Previously On Narrative Recap
- [x] Track player session timestamps and key actions per session
- [x] Build cinematic recap component showing last session's discoveries
- [x] Show rooms explored, puzzles solved, items found, battles won since last visit
- [x] Elara narrates the recap with typewriter text and atmospheric effects
- [x] Display on return after 1+ hour absence

### Multiplayer Card Challenges
- [x] Build challenge system: players can challenge others from leaderboard
- [x] Store player deck snapshots in database for async battles
- [x] Build tRPC procedures for creating, accepting, and resolving challenges
- [x] Build challenge inbox UI showing pending/completed challenges
- [x] AI plays the challenged player's deck when they're offline
- [x] Award XP and leaderboard points for multiplayer wins

## Phase 22.5: The Antiquarian's Library & CoNexus Story Games

### Antiquarian's Library Room
- [x] Generate nano banana image: ancient alien library with desk, glowing orb/glove
- [x] Add "antiquarian-library" room to ROOM_DEFINITIONS in GameContext (10th room, Deck 7 Pocket Dimension)
- [x] Design room UI with bookshelves, holographic displays, and CoNexus game portals
- [x] Hidden passage door from Captain's Quarters to the Library

### CoNexus Story Game Integration
- [x] Research all CoNexus story games at conexus.ink
- [x] Create interactive game portal cards linking to 7 CoNexus games
- [x] Add lore descriptions connecting each game to the Dischordian Saga timeline
- [x] Link games to relevant Loredex entries and characters
- [x] Add Antiquarian's Prophecy Easter egg with mythic card reward

### Tests
- [x] 229 tests passing across 11 test files (28 new Phase 22/22.5 tests)
- [x] Boss encounter data integrity tests
- [x] Boss battle engine HP scaling tests
- [x] CoNexus games data validation tests
- [x] Antiquarian's Library room definition tests
- [x] Easter egg and router wiring tests

### CoNexus Games Verification (Updated)
- [x] Verified all 33 games from CoNexus Dischordian Saga page are included (was 7, now 33)
- [x] All games have unique direct clickable URLs with story UUIDs (not generic saga page links)
- [x] Games categorized by 5 Ages: The Age of Privacy (4), Haven: Sundown Bazaar (7), Fall of Reality Prequel (10), Age of Potentials (7), Visions (5)
- [x] ConexusPortalPage renders all games with age-based filtering and "PLAY ON CONEXUS" buttons opening in new tabs
- [x] Added 6 new verification tests (exact count, age categories, per-age counts, direct URLs, unique URLs)
- [x] 234 tests passing across 11 test files

## Phase 23: Game Completion Tracking, Cover Art, Saga Timeline, Lore Achievements

### Game Completion Tracking
- [x] Add completion state to game data (mark games as completed per player)
- [x] Award XP and card rewards when player marks a game as completed
- [x] Track completion in GameContext state and persist to server
- [x] Show completion badges on game cards in the library

### Cover Art Thumbnails
- [x] Generate 5 cover art images (one per Age) via nano banana generation
- [x] Upload to CDN and integrate into AGE_CATEGORIES.coverImage
- [x] Display cover art banners in ConexusPortalPage and SagaTimelinePage age headers

### Saga Timeline View
- [x] Build visual timeline page showing all 33 games chronologically by Age
- [x] Display Age markers, game nodes, character connections, albums, and epochs
- [x] Link timeline nodes to game detail modals with lore achievements
- [x] Route at /saga-timeline in App.tsx

### Lore Achievements
- [x] Design unique lore achievement for every CoNexus story (33 achievements)
- [x] Each achievement has title, description, lore fragment, XP reward, icon, and card reward
- [x] Track achievement unlocks in player state (loreAchievements array in GameState)
- [x] Display achievements in dedicated section with modal overlays
- [x] Award achievements automatically on game completion via earnLoreAchievement

### Tests
- [x] Write tests for game completion tracking
- [x] Write tests for lore achievements data integrity (33 achievements, unique IDs, unique titles/descriptions/fragments)
- [x] Write tests for saga timeline data structure
- [x] 259 tests passing across 12 test files (25 new Phase 23 tests)

## Phase 24: Deck Builder, Achievements Gallery, Game Preview Tooltips

### Deck Builder Page
- [x] Build deck builder page at /deck-builder (790-line implementation with full tRPC backend)
- [x] Show all collected cards (starter deck, boss drops, lore achievement rewards)
- [x] Allow drag-and-drop or click-to-add deck assembly
- [x] Enforce deck size limits and card type balance
- [x] Save custom deck to GameContext state and server
- [x] Visual card display with stats, rarity, and source indicators

### Achievements Gallery Page
- [x] Build achievements gallery page at /achievements
- [x] Display all 33 lore achievements with locked/unlocked states
- [x] Progress bars per Age showing completion percentage
- [x] Collected lore fragments forming a meta-narrative when read in order
- [x] Achievement detail modals with lore fragment reveal animation

### CoNexus Game Preview Tooltips
- [x] Add hover tooltips to game cards in ConexusPortalPage
- [x] Show character portraits from Loredex data on hover
- [x] Display brief animated preview or key info
- [x] Smooth tooltip animations with proper positioning

### Tests
- [x] Write tests for deck builder card collection logic
- [x] Write tests for achievements gallery data integrity
- [x] Write tests for game preview tooltip data
- [x] 296 tests passing across 13 test files (37 new Phase 24 tests)

## Phase 25: Complete All Pending Features

### Deck Builder Page (Complete)
- [x] Build full deck builder page at /deck-builder with card collection display (already existed from Phase 24 - 790 lines with full tRPC backend)
- [x] Show all collected cards (starter deck, boss drops, lore achievement rewards)
- [x] Click-to-add/remove deck assembly with visual feedback
- [x] Enforce deck size limits (20 cards) and card type balance
- [x] Save custom deck to GameContext state and server
- [x] Visual card display with stats, rarity, and source indicators
- [x] Deck validation and export

### AI-Generated CoNexus Game Cover Art
- [x] Generate unique cover art images for all 33 CoNexus story games
- [x] Upload to CDN and integrate into game data (33 images uploaded with --webdev lifecycle)
- [x] Display cover art on game cards in ConexusPortalPage and game detail modal

### User Authentication System
- [x] Integrate Manus OAuth for user login/signup (already wired via template upgrade)
- [x] Persist user sessions with auth cookies (handled by server/_core/oauth.ts)
- [x] Gate protected features behind authentication (protectedProcedure for deck, profile, admin)
- [x] Show login/logout in navigation UI (useAuth hook integrated across pages)

### Admin Panel
- [x] Build admin panel page at /admin for content management
- [x] Admin can view dashboard stats (users, cards, game players, participations)
- [x] Admin can manage card database (list cards with rarity/type filters)
- [x] Admin can view user stats and manage accounts (list users, update roles)
- [x] Role-based access control (adminProcedure middleware, role check)

### User Character Sheets (Server-Persisted)
- [x] Persist citizen character data to server database (gameState.save tRPC procedure)
- [x] Load character sheet from server on login (gameState.load procedure)
- [x] Sync stats, inventory, and progression to server (auto-save effect in PlayerProfilePage)
- [x] Character sheet accessible from profile page (PlayerProfilePage with server sync)

### Card Unlocking Through Content Participation
- [x] Award cards when user watches episodes (ContentRewardToast + WatchPage integration)
- [x] Award cards when user completes CoNexus games (ConexusPortalPage integration)
- [x] Award cards when user wins fights (FightPage integration)
- [x] Track content participation milestones with bonus rewards (contentReward router with tiered rewards)

### Fighting Game Invasion Mechanic
- [x] Connect fight game outcomes to card game (win fight → bonus cards/resources via contentReward)
- [x] Fight victories grant Dream currency and card drops (fight_victory reward tier)
- [x] Special invasion events: 4 faction invasions with increasing difficulty and rewards
- [x] Invasion progress tracking with faction-specific bosses and rare card drops

### Character Histories from Lore Appearances
- [x] All 62 characters now have comprehensive histories (fixed The Forgotten + The Engineer + Wraith of Death)
- [x] Show character history on entity pages (already existed in EntityPage)
- [x] LoreAppearancesTimeline component added to EntityPage (chronological appearances across Ages)
- [x] Display character arc progression across the saga timeline (StoryArc component + LoreAppearancesTimeline)

### Tests
- [x] Write tests for admin router procedures
- [x] Write tests for content reward router procedures
- [x] Write tests for content participation schema
- [x] Write tests for CoNexus cover art (33 images, unique CDN URLs)
- [x] Write tests for character histories (62 characters, all >50 chars)
- [x] Write tests for fighting game invasion mechanic (4 events, increasing rewards)
- [x] Write tests for content reward integration across pages
- [x] Write tests for lore appearances timeline component
- [x] Write tests for admin page routing and tRPC usage
- [x] Write tests for player profile server sync
- [x] 327 tests passing across 14 test files (31 new Phase 25 tests)

## Phase 26: Trade Empire, Character Models, Image Fixes, Slides

### Fix Missing Images
- [x] Fix CoNexus game cover art not displaying on game cards (coverImage field already populated for all 33 games)
- [x] Fix missing character dossier images (all characters have images; only Wraith of Death was missing loredex portrait)
- [x] Audit all image references and fix broken CDN URLs (all verified)

### Fighting Game Character Models
- [x] Generate unique character model sprites for all 26 fighters (AI-generated fighting stance sprites)
- [x] Upload all sprites to CDN with --webdev lifecycle (26 images)
- [x] Enhanced arena with ornate columns, glowing runes, emblem ring, atmospheric particles, and dramatic lighting
- [x] Integrate character sprites into CharacterModel3D.ts replacing old portrait images

### Trade Empire (Renamed from Trade Wars)
- [x] Rename Trade Wars to Trade Empire throughout codebase (all files updated)
- [x] Write complete narrative: Thought Virus destroyed all intelligent life
- [x] Inception Arks contain all DNA and machine code collected by the Architect
- [x] First 1000 potentials awakened and promptly disappeared
- [x] 100 years later, new batch of Inception Arks awakened across the galaxy
- [x] Lore beginning that explains game rules through narrative (cinematic boot sequence)
- [x] Faction choice: Loyal to Empire (Architect faction) vs Dreamer (Insurgency)
- [x] Empire faction: establish empire in evolved universe, first contact with pre-Fall race
- [x] Insurgency faction: build the insurgency resistance
- [x] Gradual 7-step tutorial explaining story while teaching mechanics
- [x] Discovery of pre-Fall relics mechanic (8 relics with lore fragments)
- [x] Civilization-style mechanics (colonization, 12-tech tree, resource management, diplomacy)
- [x] Server-side: chooseFaction, advanceTutorial, discoverRelic, research procedures added
- [x] Schema updated: faction, tutorialStep, discoveredRelics, researchPoints, unlockedTech, cardRewards fields

### Slides Presentation
- [x] Create 11-slide image-mode presentation about Trade Empire narrative and Loredex OS features
- [x] Slides cover: Title, Thought Virus, First Awakening, Faction Choice, Game World, Civ Mechanics, Tutorial, Relics, Fighting Arena, Loredex OS, Road Ahead

### Tests
- [x] Write tests for Trade Empire narrative and mechanics (schema fields, faction, tutorial, relics, tech)
- [x] Write tests for character model integration (32 fighters, unique CDN URLs)
- [x] Write tests for level design enhancement (stage elements)
- [x] Write tests for Trade Empire rename verification (route, GamesPage)
- [x] 354 tests passing across 15 test files (27 new Phase 26 tests)

## Phase 27: Hierarchy of the Damned

### Lore Design
- [x] Research existing lore: Master of Rylloh, Advocate, Shadow Tongue, Blood Weave, Archons, Neyons
- [x] Design 10 demon leaders in corporate hierarchy structure
- [x] Create backstories linking Blood Weave to opening the gates of hell
- [x] Tie each demon to corresponding Archon/Neyon lore

### Loredex Integration
- [x] Add all 10 demon leaders as loredex entries with full bios, connections, appearances
- [x] Add "Hierarchy of the Damned" as a faction entry
- [x] Add "The Blood Weave" and "Gates of Hell" as event/location entries

### Card Game Integration
- [x] Create unique demon cards for all 10 leaders with special abilities (9 new + Shadow Tongue existing)
- [x] Add demon-themed card pack or drop mechanic (3 packs in Phase 28)

### Fighting Game Integration
- [x] Generate fighting sprites for all 10 demon leaders (done in Phase 28)
- [x] Add demons as unlockable fighters in CharacterModel3D

### Trade Empire Integration
- [x] Add demon encounters and faction events in Trade Empire
- [x] Demon leaders as bosses or diplomatic contacts

### CoNexus & Achievements
- [x] Create a CoNexus story game: "The Blood Weave: Gates of Hell" (done in Phase 28)
- [x] Add Hierarchy of the Damned achievements (6 demon achievements: Demon Slayer, Blood Weave Breaker, Hierarchy's Bane, Know Thy Enemy, Soul Collector, Master of the Damned)

### Visualization
- [x] Build Hierarchy of the Damned page with corporate org chart
- [x] Interactive visualization showing demon-Archon connections

### Tests
- [x] Write tests for all new demon lore, cards, fighters, and integrations (370/370 tests passing)

## Phase 28: Demon Expansion — Sprites, CoNexus Game, Card Packs

### Fighting Sprites
- [x] Generate fighting sprites for all 10 demon leaders and upload to CDN
- [x] Wire sprites into CharacterModel3D configs with unique colors, armor, and fight styles

### CoNexus Story Game: The Blood Weave — Gates of Hell
- [x] Add Blood Weave: Gates of Hell to conexusGames data (Fall of Reality age, master difficulty)
- [x] Generate cover art and upload to CDN
- [x] Wire into CoNexus Portal page (34th game)

### Demon Card Pack / Drop Mechanic
- [x] Add 3 demon pack products to store (Blood Weave 30D, Infernal Gate 75D, Mol'Garath's Vault 200D)
- [x] Build openDemonPack tRPC endpoint with weighted drop rates
- [x] Build DemonPackPage with animated pack opening UI and card reveal
- [x] Add Demon Card Packs tile to GamesPage and OPEN PACKS link to HierarchyPage
- [x] All 399 tests passing

## Phase 29: Image Audit & Mortal Kombat Assessment

### Image Audit
- [x] Audited all 143 CDN URLs — found 3 broken (403 errors)
- [x] Generated replacement images for The Watcher, The Collector, and Spy card
- [x] Fixed 9 broken URL references across loredex-data.json, season1-cards.json, bossEncounters.ts, CardGalleryPage.tsx

### Mortal Kombat Assessment
- [x] Analyzed all 7,000 lines of fight engine code across 8 game files
- [x] Wrote comprehensive MK_ASSESSMENT.md with 7-category gap analysis and 3-phase roadmap

## Phase 30: Fighting Game MK-Level Upgrade

### Sprite Sheet Art
- [x] Generated 72 sprite pose images (6 poses x 12 fighters: idle, attack, block, hit, ko, victory)
- [x] Uploaded all 72 sprites to CDN
- [x] Built pose-based texture swapping system in CharacterModel3D and FightEngine3D

### Arena Backgrounds
- [x] Generated 8 unique panoramic backgrounds (New Babylon, Panopticon, Thaloria, Terminus, Mechronis, Crucible, Blood Weave, Shadow Sanctum)
- [x] Uploaded all 8 backgrounds to CDN
- [x] Implemented 2-layer parallax system in FightEngine3D (far bg + mid-ground layer)

### Sound System
- [x] Built FightSoundManager with Web Audio API (10 synthesized SFX types)
- [x] Added hit impact SFX (punch_light, punch_heavy, kick_light, kick_heavy, block, special, ko, whoosh, impact_ground, combo_hit)
- [x] Added Speech Synthesis announcer (Get Ready, Round N, Fight, KO, Victory, Combo)
- [x] Wired 8 saga tracks as arena background music via YouTube IFrame API
- [x] Added mute toggle button in fight HUD
- [x] All 414 tests passing

## Phase 31: Remaining Sprites, Training Mode & Leaderboard

### Remaining Fighter Sprites
- [x] Generated 168 sprite pose images (6 poses x 28 fighters: 18 unlockable + 10 demon)
- [x] Uploaded all sprites to CDN
- [x] Wired all 40 fighters into CharacterModel3D with poseSprites configs

### Training/Practice Mode
- [x] Built training mode with infinite health regen for opponent
- [x] Added move list overlay showing all combos and specials with key inputs
- [x] Added frame data display (startup, active, recovery, damage, type)
- [x] Added combo counter and damage tracker in training HUD
- [x] Added TRAINING button on fight title screen with [TRAINING] indicator in select

### Online Leaderboard
- [x] Created fightLeaderboard and fightMatches database tables with ELO system
- [x] Built tRPC endpoints: getLeaderboard, getMyStats, getMatchHistory, recordMatch
- [x] Built FightLeaderboardPage with Rankings, My Stats, and History tabs
- [x] 7 rank tiers (Bronze through Grandmaster) with ELO-based promotion
- [x] Auto-records match results from FightPage with ELO changes
- [x] All 429 tests passing

## Phase 32: Fighting Game Mechanics Overhaul

### Audit
- [x] Audit full fight engine: AI, controls, combat, combos, damage model, game feel (MK_ASSESSMENT.md in Phase 29)

### AI Overhaul
- [x] Implement difficulty tiers with distinct AI behavior patterns (4 tiers: recruit/soldier/veteran/archon)
- [x] Add adaptive AI that reads player patterns and adjusts (aiPatternMemory + aiAggression system)
- [x] Add AI combo execution and special move usage (M-L-L-L-M chains + SP1/SP2/SP3 usage)
- [x] Fix AI decision-making timing and reaction windows (reactDelay + mistakeRate per difficulty)

### Control System
- [x] Improve input responsiveness and reduce input lag (MCOC gesture system + inputQueue)
- [x] Add input buffering for smoother combo execution (inputQueue processes queued inputs each frame)
- [x] Improve directional input handling (swipe detection with SWIPE_THRESHOLD + side detection)
- [x] Add control remapping or better key layout (MCOC split-screen: left=defense, right=offense)

### Combat & Combo System
- [x] Improve combo linking and cancel windows (canCancelIntoNext + comboChain 0-4 system)
- [x] Add juggle system and launch mechanics (launched state + LAUNCH_HEIGHT + LAUNCH_GRAVITY)
- [x] Improve hit/block stun frame data (HITSTUN_LIGHT/MEDIUM/HEAVY/SPECIAL + BLOCKSTUN + PARRY_STUN)
- [x] Add counter/parry mechanics (PARRY_WINDOW 150ms + DEX_WINDOW 200ms + intercept system)

### Damage Model & Game Feel
- [x] Balance damage scaling across fighters (COMBO_SCALING 0.92 + difficulty dmgMult + citizen trait bonuses)
- [x] Add hitstop/freeze frames on impact (hitStop system: 0.03s light → 0.18s special + slowMo for SP3)
- [x] Improve knockback and recovery animations (KNOCKDOWN_TIME + GETUP_TIME + POST_KNOCKDOWN_SPACE)
- [x] Add screen shake and impact effects (screenShake system with intensity/duration/decay per hit type)

### MCOC-Style Mobile Control Overhaul
- [x] Research Marvel Contest of Champions control scheme (tap, swipe, hold)
- [x] Research COD Mobile touch control innovations
- [x] Redesign control system: tap-right = light attack, tap-left = block, swipe-right = heavy, swipe-left = dash back
- [x] Implement swipe-up = special attack, swipe-down = heavy/launcher
- [x] Add hold-block mechanic (hold left side of screen)
- [x] Implement dash-forward (swipe right on left side)
- [x] Implement dash-back with invincibility frames (swipe left on left side)
- [x] Add parry/counter system (block just before hit lands)
- [x] Add combo chain system (tap sequences for light-light-medium-heavy chains)
- [x] Implement intercept mechanic (attack during opponent's dash)
- [x] Add heavy charge attack (hold right side)
- [x] Redesign AI with MCOC-style behavior patterns
- [x] Rebuild HUD for mobile-first tap controls (no virtual buttons)
- [x] Add gesture tutorial/training mode overlay
- [x] Update desktop controls to match (click zones + keyboard)
- [x] Update tests for new control system

### Interactive Gesture Tutorial
- [x] Build first-time gesture tutorial component with step-by-step walkthrough
- [x] Teach each control: tap (light), swipe right (medium), hold (heavy), swipe up (special)
- [x] Teach defense: hold left (block), swipe left (dash back/evade), swipe right (dash forward)
- [x] Teach advanced: parry timing, intercept, guard break
- [x] Visual prompts with animated hand/finger guides
- [x] Track tutorial completion in localStorage
- [x] Show tutorial before first fight, skip option available

### Haptic Feedback
- [x] Add navigator.vibrate() calls for light/medium/heavy hits
- [x] Add haptic for parry, evade, intercept, guard break events
- [x] Add haptic for special attacks (stronger vibration)
- [x] Add haptic for KO and round transitions
- [x] Respect user mute/settings preferences

### Character-Specific Special Moves (SP1/SP2/SP3)
- [x] Design unique SP1/SP2/SP3 for each fighter based on lore abilities
- [x] Implement special move data structure in gameData.ts
- [x] Engine support for different special move types (projectile, rush, area, grab)
- [x] Unique damage multipliers and effects per character per level
- [x] Visual effects tied to character's element/abilities
- [x] SP3 as cinematic-style ultimate with extra damage

### Auto-Spacing + Dash-Only Movement Refinement
- [x] Remove manual walk states from mobile input (dash-only positioning)
- [x] Add auto-spacing system — fighters drift to optimal range after combos/knockdowns
- [x] Keep optional arrow-key walk for desktop keyboard users
- [x] Tune dash distances and auto-space target range
- [x] Integrate haptic feedback into FightArena3D callbacks
- [x] Integrate gesture tutorial into FightArena3D (first-time overlay)
- [x] Add special move names to HUD during special attacks
- [x] Add DOT/buff/debuff status indicators to HUD

### The Collector's Arena Rebrand & Story Mode
- [x] Rebrand "Reality Combat Simulator" to "The Collector's Arena"
- [x] Write lore opening: The Collector harvesting DNA/machine code to preserve greatest intelligences
- [x] The Dreamer and Architect settling conflicts between champions
- [x] Design new visual theme for arena (Collector's aesthetic)
- [x] Build Story Mode: Play as "The Prisoner" (amnesiac Oracle who's been harvested)
- [x] Story progression: discover powers through fights, become Grand Champion
- [x] Chapter-based story with narrative dialogue between fights
- [x] Character unlocking: beat fighters in story mode to unlock them for free play
- [x] Redesign character select screen with lore popup on selection
- [x] Character popup shows powers, backstory, faction, abilities
- [x] Fix oversized hit effect visual bug (purple circle too large on mobile)
- [x] Fix main menu layout issues (text wrapping, card sizing on mobile)
- [x] Story mode saves progress to localStorage
- [x] Add "The Prisoner" as a playable character (starts weak, gains power)

### The Potentials NFT Integration
- [x] Research contract address and metadata structure from OpenSea/Etherscan
- [x] Build database schema: wallet_claims table (tokenId, claimer_wallet, claim_timestamp, metadata_json)
- [x] Build database schema: nft_metadata cache table
- [x] Implement wallet connect with wagmi/ethers (MetaMask, Coinbase Wallet, WalletConnect)
- [x] Server-side signature verification (sign message to prove wallet ownership)
- [x] NFT ownership check via Ethereum RPC (balanceOf, tokenOfOwner on contract)
- [x] Server-side claim ledger: check if tokenId already claimed before awarding
- [x] One-time claim enforcement: if NFT sold, new owner cannot claim
- [x] Fetch and parse NFT metadata (class, weapon types, backgrounds, etc.)
- [x] Map NFT attributes to Loredex lore categories
- [x] Generate unique 1/1 card art from NFT's own image
- [x] Build Potentials gallery/claim UI page
- [x] Link wallet address to Loredex user account
- [x] Display claimed 1/1 cards in player profile

### Potentials Nav, Batch Cache, and Arena Perks
- [x] Add Potentials link to sidebar navigation
- [x] Add Potentials section/link to Store page
- [x] Build batch metadata cache endpoint to pre-fetch all 1000 token metadata
- [x] Add admin trigger for batch cache job
- [x] Implement NFT-holder check in fight system
- [x] Add bonus fight points multiplier for Potentials holders
- [x] Add "Collector's Champion" title display during fights
- [x] Add exclusive arena visual perks for NFT holders
- [x] Show NFT holder badge on player profile

### Potentials Leaderboard, Trait Bonuses, and Claim All
- [x] Build Potentials Leaderboard page with public rankings by claims and fight wins
- [x] Show holder title tier and featured Potential on leaderboard
- [x] Build trait-based fighter bonuses (Class, Weapon, Specie traits map to stat boosts)
- [x] Integrate trait bonuses into fight engine for matching fighters
- [x] Build "Claim All" batch claim button for multi-Potential holders
- [x] Write tests for leaderboard, trait bonuses, and claim all features

### Major UX Redesign — Command Console Experience
- [x] Audit all image references and fix broken/missing images (68 URLs fixed)
- [x] Generate missing room images for Ark rooms (4 album covers + Elara avatar generated)
- [x] Build Command Console shell replacing sidebar navigation
- [x] Build SystemSelector grid with lock states and progressive unlock
- [x] Build CoNexus Media Player (collapsed, expanded, full-screen modes)
- [x] Add saga browser with seasons, episodes, games, character overlay
- [x] Build BioWare-style RoomTutorialDialog component
- [x] Define dialog trees for 10 rooms with card consequences
- [x] Wire card rewards to dialog choices with consequence flags
- [x] Build Settings panel with light/dark mode toggle
- [x] Wire existing 8 Ark themes into Settings
- [x] Add accessibility controls (high contrast, reduce motion, dyslexia font)
- [x] Wire progressive unlock system through GameContext
- [x] Add clue system for puzzle progression (ClueJournal with 22 clues, 8 puzzles)
- [x] Mobile optimization for console layout
- [x] Write tests for new systems (60 tests in phase32.test.ts)

### Dream Token Economy Integration
- [x] Design balanced Dream economy (earning sources, spending sinks, inflation controls)
- [x] Build Dream transaction ledger backend (earn/spend/balance tracking)
- [x] Wire Dream earning into all game activities (fights, card games, quizzes, puzzles, tutorials)
- [x] Wire Dream spending into deck upgrades, ship upgrades, character upgrades, store
- [x] Add Dream balance HUD to Command Console top bar
- [x] Add Dream earning notifications/toasts throughout the app
- [x] Balance economy curves (daily caps, diminishing returns, milestone bonuses)

### Phase 33: Universal Character Trait Impact System
- [x] Audit all game systems for current trait integration gaps
- [x] Build shared trait resolver utility (server/traitResolver.ts)
- [x] Wire species bonuses into card game (DeMagi=HP, Quarchon=armor, Ne-Yon=both)
- [x] Wire class bonuses into card game (Spy=draw, Oracle=foresight, Assassin=crit, Engineer=repair, Soldier=ATK)
- [x] Wire element bonuses into card game (matching element cards get +ATK/+HP)
- [x] Wire alignment bonuses into card game (Order=structure, Chaos=wildcards)
- [x] Wire attribute dot ratings into card game (ATK dots=damage, DEF dots=armor, VIT dots=HP)
- [x] Wire species bonuses into Trade Empire (DeMagi=diplomacy, Quarchon=combat, Ne-Yon=balanced)
- [x] Wire class bonuses into Trade Empire (Spy=intel, Oracle=market, Assassin=piracy, Engineer=ship, Soldier=combat)
- [x] Wire element bonuses into Trade Empire (sector hazard resistance, trade route bonuses)
- [x] Wire alignment bonuses into Trade Empire (Order=port prices, Chaos=piracy/smuggling)
- [x] Wire attribute dot ratings into Trade Empire (ATK=weapons, DEF=shields, VIT=hull)
- [x] Wire species bonuses into fight game (HP, armor, speed modifiers)
- [x] Wire class bonuses into fight game (damage type, special moves, defense style)
- [x] Wire element bonuses into fight game (elemental attacks, resistances)
- [x] Wire alignment bonuses into fight game (Order=counter, Chaos=crit)
- [x] Wire attribute dot ratings into fight game (direct stat scaling)
- [x] Wire class bonuses into crafting (Engineer=bonus, Oracle=rare chance, etc.)
- [x] Wire species bonuses into lore quizzes (Dream bonus + rarity upgrade via exploration resolver)
- [x] Wire class bonuses into Ark exploration (class-specific hotspot interactions)
- [x] Wire Potential NFT level into all systems as universal multiplier
- [x] Build trait impact summary on character sheet page (via nft.getAllTraitBonuses endpoint)
- [x] Write tests for trait resolver and all integrations (77 tests in phase33.test.ts)

### Phase 34: Settings Panel, Clue Journal, and Image Audit

#### Settings Panel
- [x] Build SettingsPanel component with slide-out overlay from gear icon
- [x] Display section: Light/Dark mode toggle, Theme selector (8 Ark themes), Font size (S/M/L), Reduce motion toggle
- [x] Audio section: Master volume, Music volume, SFX volume, Elara TTS toggle, Ambient sounds toggle
- [x] Accessibility section: High contrast mode, Reduce flashing/glow effects, Dyslexia-friendly font option
- [x] Game section: Reset progress, Skip tutorials toggle, Show hints toggle, Difficulty preference
- [x] Account section: Login/logout, Sync status, Export save data
- [x] Wire existing 8 Ark themes into Settings with preview swatches and lock states
- [x] Add light/dark mode base layer that Ark themes layer on top of
- [x] Persist settings to localStorage and server (for logged-in users)

#### Clue Journal System
- [x] Build ClueJournal component showing collected clues and hints
- [x] Define Data Crystal clue items hidden in room hotspots
- [x] Define Elara hint system (after 2 failed puzzle attempts)
- [x] Define cross-room clue dependencies
- [x] Wire clue collection into GameContext state
- [x] Add clue journal access from Command Console

#### Image Audit
- [x] Audit all CDN image references for broken/missing URLs (536 URLs, 0 broken)
- [x] Generate replacement images for any broken references (4 new images generated)
- [x] Generate missing room images for Ark rooms (4 album covers + Elara avatar generated)
- [x] Fix all broken URL references across codebase (68 references fixed)

#### Tests
- [x] Write tests for Settings Panel sections and persistence
- [x] Write tests for Clue Journal data integrity
- [x] Write tests for image reference validation

### Phase 34: Ne-Yon Species NFT Gate (1/1 Ownership Required)
- [x] Audit current Ne-Yon species selection in character creation flow
- [x] Gate Ne-Yon species behind Potentials NFT ownership (token IDs 1-10 only)
- [x] Build backend verification: check wallet owns a token ID 1-10 before allowing Ne-Yon creation
- [x] Each Ne-Yon citizen is tied to a specific token ID (1/1 identity)
- [x] Update frontend species selection to show Ne-Yon as locked unless NFT verified
- [x] Show which specific Ne-Yon the player can unlock based on their owned token
- [x] Store Ne-Yon token ID on citizen character record
- [x] Prevent duplicate Ne-Yon citizens (one Ne-Yon per token ID across all users)
- [x] Write tests for Ne-Yon gating logic

### Phase 34b: Immersive Character Sheet Dossier Redesign
- [x] Redesign CharacterSheetPage as in-world Panopticon dossier artifact
- [x] Build dark metallic panel layout with circuit-trace borders and scan lines
- [x] Create glowing stat orbs/medallions for ATK/DEF/VIT attributes
- [x] Add prominent character portrait area with species-specific frame
- [x] Build ornate gear/equipment display section
- [x] Add ability showcase with element mastery visualization
- [x] Add Ne-Yon #N identity badge with 1/1 NFT verification glow
- [x] Add trait impact summary showing bonuses across all game systems
- [x] Write tests for Ne-Yon gating system (706 tests pass across 25 files)

### Phase 36: Trait Summary UI, Respec System, AAA Card Game Visual Overhaul, Card Art Generation
- [x] Build Trait Summary UI panel on Character Sheet showing bonuses across all game systems
- [x] Build Dream-token Respec system (reassign attribute dots, change alignment)
- [x] Research best TCG video games for visual design inspiration (Marvel Snap, LoR, Hearthstone, MTG Arena)
- [x] Redesign card game board with AAA visual effects (particles, lighting, animations)
- [x] Add card play animations (deploy, attack, destroy effects)
- [x] Add board state visual effects (energy fields, faction banners, weather effects)
- [x] Generate unique art for every card in the database (73 cards generated, 178 total now unique)
- [x] Wire generated card art into the card database
- [x] Write tests for trait summary, respec, and card game visual systems (742 tests pass across 26 files)
- [x] Fix React hooks ordering error in FightPage.tsx (Rendered more hooks than during the previous render)

### Phase 37: Card Battle SFX, Card Collection Gallery, Multiplayer PvP
- [x] Build card battle sound effects system (deploy, attack, death, turn transitions, victory/defeat)
- [x] Create SFX context/hook for managing audio playback across the battle (extended existing SoundContext)
- [x] Integrate SFX triggers into CardBattlePage actions
- [x] Build card collection gallery page with all 178 cards
- [x] Add filtering by faction, rarity, element, type, species, era, class, alignment
- [x] Add collection progress tracking (cards discovered vs total)
- [x] Add card detail modal with full art view and lore
- [x] Build multiplayer PvP WebSocket server for real-time card battles
- [x] Build matchmaking queue UI and lobby system
- [x] Build PvP battle page with synchronized game state
- [x] Add PvP match history and win/loss tracking (ELO rating system + leaderboard)
- [x] Write vitest tests for all new features (767 tests pass across 27 files)

### Phase 38: PvP Deck Builder, Ranked Seasons, Spectator Mode
- [x] Build PvP deck builder page with faction-specific card limits
- [x] Add pre-match deck selection UI in PvP Arena
- [x] Save/load/delete custom PvP decks (database-backed)
- [x] Build ranked seasons system with ELO resets
- [x] Add tier badges (Bronze/Silver/Gold/Platinum/Diamond/Master/Grandmaster)
- [x] Build season rewards system (card packs, titles, badges per tier)
- [x] Add ranked season UI to PvP Arena (current rank, progress bar, tier display)
- [x] Build spectator mode WebSocket integration (watch live matches)
- [x] Build spectator UI with real-time board view and match info
- [x] Add spectator count and live match list to PvP Arena lobby
- [x] Write vitest tests for deck builder, ranked seasons, and spectator mode (802 tests pass across 28 files)

### Phase 39: Draft Mode, Card Trading, Achievements
- [x] Build draft/tournament mode - card draft phase where players pick from random pools
- [x] Add draft lobby and matchmaking for draft tournaments
- [x] Build draft battle UI with drafted decks
- [x] Build draft router with create, join, getTournament, pickCard, listOpen, myHistory, startBattles
- [x] Build DraftTournamentPage with lobby/drafting/battling/results phases
- [x] Build card trading system - player-to-player card trades with senderCards/receiverCards
- [x] Add trade request/accept/decline flow with Dream token support
- [x] Build CardTradingPage with create/incoming/outgoing/history tabs
- [x] Add player search for trade partner selection
- [x] Build trade safety checks (self-trade prevention, ownership verification, balance checks)
- [x] Build achievement system with 40+ achievements across 6 categories (pvp, collection, crafting, draft, trading, general)
- [x] Add 5 achievement tiers (bronze, silver, gold, diamond, legendary) with Dream token rewards
- [x] Build CardAchievementsPage with category filtering, progress bars, reward claiming
- [x] Build achievement router with getAll, incrementProgress, setProgress, claimReward, getSummary
- [x] Add database schema: draftTournaments, draftParticipants, cardTrades, cardGameAchievements tables
- [x] Add navigation links in GamesPage for Draft Tournament, Card Trading, Card Achievements
- [x] Register routes in App.tsx (/draft, /trading, /card-achievements)
- [x] Write vitest tests for draft mode, trading, and achievements (916 tests pass across 29 files)

### Phase 39b: Achievement Auto-Tracking, Trade Notifications, Draft Rewards
- [x] Build achievementTracker.ts helper with trackIncrement, trackSet, trackPvpResult, trackCollectionSize, trackCraftAction, trackDisenchant, trackTradeComplete, trackDraftResult, trackAiResult
- [x] Wire achievement auto-tracking into PvP WebSocket match completion (trackPvpResult with wins, streaks, ranks)
- [x] Wire achievement auto-tracking into card game AI matches (trackAiResult for win/loss)
- [x] Wire achievement auto-tracking into pack opening (trackCollectionSize after new cards)
- [x] Wire achievement auto-tracking into crafting router (trackCraftAction with rarity, trackDisenchant)
- [x] Wire achievement auto-tracking into trading router (trackTradeComplete for both parties, trackCollectionSize)
- [x] Wire achievement auto-tracking into card challenge router (trackAiResult for async PvP)
- [x] Wire achievement auto-tracking into draft tournament completion (trackDraftResult for all participants)
- [x] Build TradeNotificationWatcher component with 15s polling for incoming trades
- [x] Add actionable toast notifications with ACCEPT/DECLINE buttons for new trade offers
- [x] Add toast notifications for accepted and declined trades on sent offers
- [x] Skip toasts on initial load to prevent notification flood
- [x] Register TradeNotificationWatcher in App.tsx alongside AchievementToast
- [x] Build completeTournament procedure with winner determination (wins desc, losses asc tiebreak)
- [x] Implement Dream token prize pool: entryCost * playerCount * prizeMultiplier (70% winner, 30% runner-up)
- [x] Implement exclusive draft-only card reward (foil rare+ card, preferring unowned cards)
- [x] Build getResults procedure for viewing tournament standings and prize info
- [x] Track perfect run detection (zero losses) for draft_perfect achievement
- [x] Write 105 vitest tests for all three features (1021 total tests pass across 30 files)

### Phase 40: Mobile Responsiveness Audit & Landscape Fight Game
- [x] Build LandscapeEnforcer component with CSS rotation + Screen Orientation API lock
- [x] Force landscape orientation for fight game on mobile (forceRotate CSS transform)
- [x] Show rotate-phone overlay with animation when user hasn't rotated device
- [x] Unlock orientation when leaving fight game
- [x] Increase FighterCard text sizes and info button for mobile readability
- [x] Increase fighter select grid to 3 columns on small screens
- [x] Fix all 6px text across CardBattlePage, CardGamePage, BossBattlePage → 8px minimum
- [x] Fix GameCard component text (ability, flavor, class) from 7px → 8px
- [x] Add global CSS mobile override (@media max-width:639px) bumping all tiny text:
  - 6px/7px/8px → 10px, 9px/10px → 11px, text-xs → 12px
- [x] Increase bottom nav icons from 18px → 22px, labels from 9px → 10px
- [x] Increase bottom nav height from h-14 → h-16 with larger touch targets
- [x] Increase Dream HUD icon and text sizes for mobile readability
- [x] Increase main content bottom padding from pb-20 → pb-24 for taller nav
- [x] Add rotate-phone keyframe animation to index.css
- [x] All 1021 tests pass across 30 files, zero TypeScript errors

### Phase 40b: Landscape Battles, Pinch-to-Zoom, Swipe Tabs, Room Explorer Fullscreen
- [x] Apply LandscapeEnforcer to CardBattlePage (CADES card game) with custom "Rotate for better card battles" message
- [x] Apply LandscapeEnforcer to BossBattlePage with custom "Rotate for better boss fights" message
- [x] Build ZoomableImage component with pinch-to-zoom, double-tap zoom (2x), and drag-to-pan
- [x] Add ZoomableImage to EntityPage for character artwork (replaces static img)
- [x] Add ZoomableImage to CardGalleryPage card detail modal for card art
- [x] Build useSwipeTabs hook with threshold detection, velocity-based triggers, rubber-band edges, and visual feedback
- [x] Apply swipe navigation to CardTradingPage (4 tabs: create/incoming/outgoing/history)
- [x] Apply swipe navigation to CardAchievementsPage (category filter tabs)
- [x] Apply swipe navigation to CardGalleryPage (rarity filter tabs)
- [x] Build room explorer fullscreen popout using Fullscreen API with FULLSCREEN/EXIT toggle button
- [x] Add landscape enforcement to ArkExplorerPage with LandscapeEnforcer wrapper
- [x] Auto-lock screen orientation to landscape when entering fullscreen on mobile
- [x] Listen for fullscreen exit (Escape key) to sync state
- [x] All 1021 tests pass across 30 files, zero TypeScript errors

### Phase 41: Progressive Discovery System (KOTOR-style)
- [ ] Build featureUnlocks database table to track which features each user has discovered
- [ ] Build discovery router with getUnlocks, unlockFeature, getDiscoveryProgress procedures
- [ ] Map each app section to a specific room/area in the Ark exploration
- [ ] Build DiscoveryGate component that shows locked state for undiscovered features
- [ ] Redesign AppShell navigation to only show discovered sections
- [ ] Redesign app entry to start with exploration (no other nav visible initially)
- [ ] Build KOTOR-style awakening sequence for first-time users
- [ ] Wire room discoveries to feature unlocks (Bridge→Loredex, Armory→Fight, etc.)
- [ ] Add discovery notifications when new features are unlocked
- [ ] Ensure returning users see their previously unlocked features

### Phase 42: Fighting Game AAA Mobile Overhaul
- [ ] Improve combo system with multi-hit chains and juggle mechanics
- [ ] Add hit spark visual effects and screen shake on impact
- [ ] Improve camera work with dynamic zoom on special moves
- [ ] Add character-specific special move animations
- [ ] Improve health bar and HUD design for mobile
- [ ] Add round transition animations and KO screen
- [ ] Improve AI opponent behavior with difficulty scaling
- [ ] Add fight intro sequences with character name cards
- [ ] Improve sound design with impact sounds and music

### Phase 43: Admin Console
- [ ] Build admin router with CRUD for loredex entries
- [ ] Build admin router with CRUD for songs and albums
- [ ] Build admin router with CRUD for cards and card packs
- [ ] Build admin dashboard page with content management UI
- [ ] Add loredex entry editor with relationship management
- [ ] Add song editor with album assignment and metadata
- [ ] Add card editor with stats, abilities, and art management
- [ ] Gate admin routes behind adminProcedure

### Phase 44: Tier 1 Infrastructure Upgrades
- [x] Add database transactions to all currency operations (store, trading)
- [x] Add rate limiting middleware (120 req/min general, 10 req/min LLM)
- [x] Implement React.lazy code splitting for all 52 pages with Suspense
- [ ] Move static JSON to server API with caching
- [ ] Add foreign key constraints and populate drizzle/relations.ts

### Phase 45: Tier 2 Infrastructure Upgrades
- [ ] Add cursor-based pagination to card gallery, trade history, achievements, leaderboards
- [ ] Migrate localStorage game state to server-side storage
- [x] Add skeleton loaders (PageSkeleton component with 5 variants)
- [ ] Dynamic imports for Three.js and ethers.js
- [x] Add server-side query caching with staleTime (30s default, 5min gcTime)
- [ ] Add CSRF protection
- [ ] Add soft deletes to key tables

### Phase 46: Tier 3 Infrastructure Upgrades
- [ ] Accessibility overhaul (ARIA labels, keyboard nav, focus traps)
- [x] Add error boundaries per route (RouteErrorBoundary component)
- [ ] Replace console.logs with structured logging
- [x] Add haptic feedback on mobile interactions (already built in game/haptics.ts + lib/haptics.ts)
### Phase 47: AAA Fighting Game VFX & HUD Upgrades
- [x] Afterimage trail system (ghostly duplicates during dashes/specials)
- [x] Energy projectile system (fireballs, energy blasts with particle trails)
- [x] Impact ring shockwave effects on heavy hits
- [x] Ground crater/scorch marks on KO
- [x] Screen flash system (white flash on critical hits, amber on KO)
- [x] Cinematic intro camera sweep at round start
- [x] KO slow-motion camera with dramatic zoom
- [x] White trailing health bar (damage delay visualization)
- [x] Danger pulse animation when HP < 25%
- [x] Animated combo counter with scaling text
- [x] Status effect indicators (burn, stun, poison, frozen)
- [x] Touch ripple VFX on mobile controls
- [x] dangerPulse CSS keyframe animation

### Phase 48: Progressive Discovery System
- [x] featureUnlocks database table
- [x] Discovery router with getUnlocks, unlockFeature, getDiscoveryProgress
- [x] Discovery tab in admin panel for feature unlock management
- [x] Admin can grant/revoke feature unlocks per user

### Phase 49: Admin Content Management Console
- [x] Content admin router for CRUD operations on loredex entries
- [x] Content tab in admin panel with entry listing, search, filtering
- [x] Add/edit entry form with all fields (name, type, era, affiliation, bio, image, etc.)
- [x] Delete entry with confirmation
- [x] Content stats display (total entries, characters, songs, locations, factions)

### Phase 50: Lore Content Scan & Update
- [x] Scan Discord channels (used uploaded text files with lore content)
- [x] Scan X post panopticusv/status/1779621119076528632 for lore content
- [x] Extract new characters, locations, factions, events from scanned content
- [x] Update loredex JSON with new entries (211 total, was 204)
- [x] Create new cards based on discovered lore (7 new cards + 1 updated)

### Phase 51: The Engineer History & Comprehensive Lore Update
- [x] Scan YouTube playlist for The Engineer's complete history (6 chapters: Engineer, Dilemma, Converter, Better Part of Valor, Dispatch, Zero Sum Game)
- [x] Extract all new characters, locations, factions from uploaded lore files
- [x] Create dedicated Engineer history entry with full Epoch Zero timeline
- [x] Add new characters: Elara (hologram AI), The Overseer (prison warden)
- [x] Add new locations: Veridian VI (jungle world), Prison Planet (Panopticon facility)
- [x] Add new events: Battle of Nexon, Operation Trojan Downfall, Fall of Reality
- [x] Update existing characters with new lore: Engineer, Agent Zero, Iron Lion, Binath-VII, Prometheus, Nomad, Kael, Jailer, Warden, Thought Virus
- [x] Create new cards: Elara, The Overseer, Veridian VI, Prison Planet, Battle of Nexon, Operation Trojan Downfall, Fall of Reality
- [x] Update existing Engineer card with expanded Epoch Zero lore
- [x] Note: Engineer is Black. Fate after Battle of Nexon unknown, confirmed reports of execution by the Warlord

### Phase 52: RPG Core UX Overhaul
- [x] Fix starter deck modal: add close button (X), fix scroll on mobile
- [x] Show character sheet immediately after Elara wake-up questions
- [x] Build RPG hub navigation: character sheet, inventory, journals accessible from main nav (Clue Journal added to sidebar nav)
- [x] Make conspiracy board progressive discovery (starts empty, populates as you discover)
- [ ] Add initial hooks and video logs for first few discoveries
- [x] Build research minigame to unlock additional lore entries
- [x] Upgrade Trade Wars to graphical galactic map (Civilization/mobile strategy style)
- [x] Add discoverable areas on galactic map
- [ ] Ensure RPG character sheet is the central identity hub
- [x] Generate Fall of Reality mythic card art and update database

### Phase 53: CoNexus Stories & Streaming
- [x] Scan CoNexus website for all Dischordian Saga stories
- [x] Compare with existing CoNexus stories in the app (found 6 missing Foundation stories)
- [x] Add missing stories: 6 Foundation stories (Rise of Ne-Yons, Iron Lion, Agent Zero, Eyes of the Watcher, The Engineer, The Oracle)
- [ ] Research streaming playlist embed options without user gating
- [ ] Provide recommendation on streaming playlist integration
- [x] Improve Ark exploration pathways: clearer room exits, better markers for connected areas
- [x] Add wallet connect option at beginning of Awakening flow for Potential/Neyon holders
### Phase 54: Research Minigame, Galactic Map & Discovery Video Prompts
- [x] Build research minigame to unlock additional lore entries (puzzle mechanic)
- [x] Upgrade Trade Empire to graphical galactic map (Civilization/mobile strategy style)
- [x] Create Kling 3.0 start/end frame prompts for discovery hook video logs

### Phase 55: Discovery Videos, Sector Events, Leaderboard Map, Elara VO & Suno Prompts
- [x] Build fullscreen discovery video overlay component (triggers on first character discovery)
- [x] Wire discovery video triggers to conspiracy board, research minigame, and Ark exploration
- [x] Add sector events to galaxy map (random encounters, distress signals, lore drops)
- [x] Build multiplayer Trade Empire leaderboard on galaxy map (show other players' territories)
- [x] Extract all Elara dialog lines for VO generation
- [x] Create Suno 5.1 prompts for game background music (all game modes)

### Phase 56: Audio System, War Map, Holographic Elara
- [x] Build GameAudioManager context with crossfade transitions between game areas
- [x] Add volume ducking when Elara speaks (VO priority over BGM)
- [x] Wire audio tracks to each game area (Ark, Trade Empire, Card Game, Arena, etc.)
- [x] Build real-time faction War Map mode with territory control
- [x] Add War Map server procedures (claim sector, faction scores, weekly reset)
- [x] Build War Map UI page with live faction territory visualization
- [x] Create animated holographic Elara avatar component for dialog sequences
- [x] Wire holographic Elara into Awakening flow and Ark exploration dialog
