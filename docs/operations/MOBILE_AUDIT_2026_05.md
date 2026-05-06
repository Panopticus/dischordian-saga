# Mobile / touch / small-screen audit — 2026-05

Plan §D6. The codebase ships with a mobile-aware bottom nav and viewport
tagging, but most surfaces have not been audited for touch fitness or
small-screen usability since their initial scaffold landed. This document
is a per-page status sweep: which routes are mobile-ready, which degrade
gracefully, and which should be gated behind an explicit "best on
desktop" interstitial until they're reworked.

The matrix below is the *engineering* read; designer review is a
separate pass. "Status" is a triage tag, not a grade.

## Triage matrix

| Route | Surface | Status | Notes |
|---|---|---|---|
| `/` | Bridge Console | OK | Designed mobile-first; bottom-nav tested. |
| `/awakening` | Character creation | OK | Single-column flow; touch targets >= 44px. |
| `/cades` | Simulation Hub | OK | Tile grid scrolls cleanly. |
| `/codex` | Codex / Lore | OK | Long-text reading view; readable at 360px wide. |
| `/codex-search` | Codex search | OK | Sonner toasts position above bottom-nav. |
| `/conspiracy` | Conspiracy Board | DEGRADE | Connection map relies on hover/drag; pinch-zoom works but tap-to-expand entry needs verification. |
| `/companion` | Companion ask wheel | OK | Wheel arc fits 360px viewport. |
| `/clue-journal` | Clue Journal | OK | Long-form list. |
| `/era-timeline` | Era Timeline | OK | Horizontal scroll on touch. |
| `/saga-timeline` | Saga Timeline | DEGRADE | Multi-track timeline; horizontal+vertical scroll combination needs touch-momentum review. |
| `/character-timeline` | Character timeline | DEGRADE | See above. |
| `/album/:id` | Album page | OK | Single-track player; touch controls verified. |
| `/discography` | Discography | OK | List view. |
| `/watch` | Video / show | OK | Native video element. |
| `/card/battle` | Card battle | DESKTOP-ONLY | Pixi.js 9-wide × 5-tall board doesn't fit < 768px without unreadable shrink. Show a "best on desktop" interstitial; do not auto-shrink. |
| `/card/gallery` | Card gallery | OK | Grid gracefully wraps to 2-up at 360px. |
| `/card/browser` | Card browser | OK | Filter + grid. |
| `/card/trading` | Trading | OK | List + modal flow. |
| `/card/deck-builder` | Deck builder | DEGRADE | Drag-and-drop not implemented in touch — uses tap-to-add fallback, but the active-deck pane is cramped at < 480px. |
| `/card/challenge` | Card challenge | DESKTOP-ONLY | Wraps `/card/battle`; same Pixi constraint. |
| `/chess` / `/chess/*` | Chess + variants | DESKTOP-ONLY | Stockfish board is 8×8; touch tap-to-move works but the side panel doesn't fit < 768px. Interstitial recommended. |
| `/duelyst` | Duelyst (legacy) | DESKTOP-ONLY | Largest Pixi surface; explicit desktop framing. |
| `/fight` | Combat sim | DESKTOP-ONLY | Canvas2D fighting-game engine, gamepad/keyboard-first. Not playable on touch in any meaningful sense. |
| `/cades-fps` | CADES FPS minigame | DESKTOP-ONLY | Same — Three.js first-person, mouse-locked. |
| `/ark` | Ark explorer | OK | Click-and-explore; works at 360px. |
| `/medbay` | Medical Bay | OK | Static room. |
| `/space-station` | Space station builder | DEGRADE | Module-placement grid; touch drag is functional but module sidebar overlays content at < 480px. |
| `/trade-empire` | Trade Empire | DEGRADE | Sector map + cargo manager; works on touch but several panels stack awkwardly at < 600px. |
| `/war-map` | War Map | DEGRADE | SVG territory map; pan/zoom OK on touch, but contribution panel needs vertical-stack treatment at < 480px. |
| `/army-management` | Army units | OK | Single-column. |
| `/companion/quarters` | Personal quarters | OK | Static panel. |
| `/operative-dossier` | Dossier | OK | Profile card. |
| `/leaderboard` | Leaderboards | OK | Sortable list. |
| `/settings` | Settings | OK | Single-column scroll. |
| `/character-sheet` | Character sheet | OK | Stat blocks scroll vertically. |
| `/store` / `/requisitions` | Store | OK | Card grid. |
| `/casino` (Degen's) | Slot casino | OK | Single-machine UI. |
| `/tower-defense` | Tower defense | DEGRADE | Grid-based; touch-to-place works but tower selection sidebar doesn't fit comfortably at < 480px. |
| `/outbreak` | Outbreak (act 1 onboarding) | OK | Linear narrative flow. |
| `/admin*` | Admin surfaces | DESKTOP-ONLY | Internal tooling; explicitly desktop. |

## Action items (engineering)

- [ ] **Add `<DesktopOnlyInterstitial>` component** (single shared scaffold) and gate the seven `DESKTOP-ONLY` routes above with it. The interstitial should detect viewport width < 768px AND no pointer:fine media query, and offer a "continue anyway" link for power users on tablets with keyboards.
- [ ] **Fix `/card/deck-builder` touch deck pane** — switch the active-deck list to a bottom-sheet pattern at < 480px instead of the side rail.
- [ ] **Fix `/space-station` module sidebar** — make it a bottom drawer at < 480px.
- [ ] **Fix `/trade-empire` panel stacking** — explicit responsive breakpoints rather than relying on flex-wrap.
- [ ] **Fix `/war-map` contribution panel** — vertical-stack mode at < 480px.
- [ ] **Verify `/conspiracy` and the saga / character timelines on real touch devices** — currently pass desktop emulation but unverified on phones.
- [ ] **Audit Sonner toast positioning** — confirm no surface lands toasts under the bottom-nav (60px reserved).

## What this PR does

This is a documentation deliverable, not a code one. It is the
engineering audit that designers / QA need to plan the touch sweep.
Per-page fixes are tracked as the action items above and should be
their own targeted PRs (most are < 100 LoC each).

## Out of scope

- Native mobile builds (Capacitor / wrap). The codebase is web-first;
  native packaging is a separate roadmap question.
- Tablet-specific layouts. The Web App Manifest is set for desktop +
  phone form factors; tablet (768–1024px) gets the desktop layout
  today. That's deliberate.
- Performance audit. Frame-rate / TTI on low-end Android is a separate
  pass that should follow the layout fixes.
