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
- [ ] Build user authentication system (email + Gmail OAuth signup/login)
- [ ] Build admin panel for content management
- [ ] Build user character sheets with stats, inventory, and progression
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
- [ ] Integrate card unlocking through official content participation
- [ ] Connect fighting game as invasion mechanic within card game
- [ ] Create histories for all characters based on lore appearances
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
