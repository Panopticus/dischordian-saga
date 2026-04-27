# The Dischordian Saga

**A transmedia sci-fi universe: music, RPG, and fighting game — one story told across all three.**

Built on the music of [Malkia Ukweli & the Panopticon](https://discord.gg/vGYfAEWaA). Each song is a transmission from a fractured starfaring civilization. Each fight is a choice. Each companion remembers.

---

## What this is

- **Loredex OS** — a web app that is simultaneously the interface to the game AND a narrative object inside it (an Ark's ship computer you've just woken up on)
- **~228K lines** of TypeScript/React across 600+ files
- **12 playable fighters**, **107 canonical tracks**, **43 companion specimens**, **12 chapters**, **20+ ship rooms**, **30+ NPCs** — **11 priority-roster characters with full BioWare-depth bibles shipped (Stage 0 complete)**, dialogue-authoring scope of ~7,800 lines underway in Stage 2; broader 30+ roster targeted in Stage 4
- **Disco Elysium-style inner voices**, **Persona-style social links**, **TFT-style trait synergies** for party composition
- Rich progression systems — unlock rare species, cards, and content through gameplay and promotional codes

## Stack

- **Client**: React 19, TypeScript, Tailwind v4, framer-motion, wouter, Vite
- **Server**: Express + tRPC, Drizzle ORM, MySQL
- **State**: Zustand + React Context
- **Engines**: Canvas 2D/3D fight engines, Pixi.js card-game board, Stockfish WASM chess
- **Audio**: Web Audio API + ElevenLabs voice generation
- **Themeing**: Void Energy design system (physics-based materials — `glass | flat | retro`)

## Running locally

```bash
pnpm install
pnpm dev
```

Then visit http://localhost:5173.

## Project structure

```
client/src/
  pages/          # 84 routed pages
  components/     # 159 UI components
  game/           # 114 game-system modules
  engine/         # Void Energy theme system
server/
  routers/        # 52 tRPC routers
shared/           # Cross-layer types + game logic (49 files)
docs/
  built/          # Describes shipping code (LORE_BIBLE)
  design/         # Aspirational / roadmap
  production/     # Asset generation specs (VO + Visual bibles)
```

## Community

- **Discord**: https://discord.gg/vGYfAEWaA
- **Artist**: Malkia Ukweli & the Panopticon

## DGRS Labs

- **Website**: https://dgrslabs.ink
- **Discord (community)**: https://dgrslabs.ink/join
- **X / Twitter**: [@dgrs_labs](https://twitter.com/dgrs_labs)
- **Instagram**: [@dgrs_labs](https://instagram.com/dgrs_labs)
- **YouTube**: [@conexus_stories](https://youtube.com/@conexus_stories)
- **TikTok**: [@conexus_stories](https://tiktok.com/@conexus_stories)
- **LinkedIn**: [linkedin.com/company/dgrslabs](https://linkedin.com/company/dgrslabs)

## Status

**Pre-release.** Closed development. Not yet publicly promoted.

## License

All rights reserved. Malkia Ukweli & the Panopticon © 2026.
