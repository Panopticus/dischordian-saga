# Playtester (Cold-Open) — Audit

## Top 5 findings

### F1: Auto-tutorial only mounted on 2 of ~30 surfaces
- where: `useAutoTutorial` is imported only from `apps/client/src/pages/CardBrowserPage.tsx` and `apps/client/src/pages/FightPage.tsx`. None of `BridgeConsole.tsx` (`/`, the cold-open landing), `Act1CardLadderPage`, `Act1C4TrialPage`, `DeckBuilderPage`, `DuelystPage`, `WitnessingHubPage`, `HierarchyPage`, `TradeEmpirePage`, `LoredexGraphPage`, etc. mount it — even though `LORE_TUTORIALS` defines `triggerRoute` for all of them (`/cards`, `/battle`, `/deck-builder`, `/hierarchy`, `/trade-empire`, `/quiz`, `/store`, `/research-lab`, `/pvp`, `/board`, `/timeline`, `/discography`, `/fight`, `/ark`, `/search`, `/trading`, `/games`, `/character-sheet`, `/clue-journal`, `/war-map`, `/prestige-quests`, `/boss-battle`, `/draft`, `/demon-packs`, `/card-challenge`, `/card-achievements`, `/`).
- severity: critical
- category: first_time_hook
- "I am a new player. I land on the Bridge Console and see NPC signal tiers, Loredex discovery cards, a Light/Dark meter, RoomEvents, and Daily Briefs. I do not know what to do because nothing tells me where to start, and Elara never offers a tutorial here even though `tut-doom-scroll` is wired to `/`."
- fix: mount `<AutoTutorialPrompt>` + `useAutoTutorial(location)` once at the `GameGate` level (App.tsx already calls `useTutorialOrchestrator().checkTutorial({currentRoom})` per route — wire AutoTutorialPrompt into the same effect). Also add `tut-first-steps` (id exists, route `/ark/onboarding` — currently unreachable) as a forced first prompt after `AwakeningPage` finishes.

### F2: Authority §5.8 trial UI has zero player-facing explanation of what's happening
- where: `apps/client/src/components/match/TrialPhaseIndicator.tsx` + `apps/client/src/pages/Act1C4TrialPage.tsx`
- severity: high
- category: no_explanation
- "I am a new player. I see 'Phase 4 / 10  Evidence — cross-support', a black-marble bar, six glowing crystal coffins, a 'Verdict scroll' filling with ink, a Tribunal playing 'jury' and 'evidence' cards with weights 1/2/3, and a button labeled 'I will let the deck answer.' I do not know what to do because the page never tells me what crystal coffins are, what jury vs evidence cards do, what 'cross-examination' admits, or what the §-notation means. The matchup blurb is the canonical Wayne Warden quote, not instructions."
- fix: register a `tut-authority-trial` LoreTutorial keyed to `triggerRoute: "/act1-c4-trial"` that walks through the 10 phases, what evidence vs jury counters do, what ink lines mean, and what `trial_categories` admit at each phase. Add an info popover on `TrialPhaseIndicator` (currently just an aria-label) that shows the categories admitted in the current phase. Today TrialPhaseIndicator says "Phase 4 / 10 — Evidence — cross-support" — a new player has no way to know cross-support admits which categories.

### F3: No glossary anywhere in the client
- where: global. `grep -rE "Glossary|glossary"` across `apps/client/src` returns zero hits in component or page code (only the word "tooltip" exists for hover affordances, not term definitions). LoreTutorials introduce hundreds of jargon terms (Architect, Antiquarian, Insurgency, Dreamer, Thought Virus, Ne-Yon, Potentials, Loredex, Panopticon, Ocularum, Ark, Inception Ark, Synopticon, NØX, Dischordian, Authority, Tribunal, Witnessing, Light/Dark, Machine/Humanity, Crystal Coffins, Verdict Scroll, ink lines, Phase, prestige, sorting, archon, Identity Chains) with no clickable definitions.
- severity: high
- category: glossary_missing
- "I am a new player. I read 'Kanshi Sha was reborn as the Watcher — the Fourth Archon, the All-Seeing Eye…the Ocularum… the Inner Circle… the Architect's quantum infrastructure.' I do not know what to do because every proper noun is a term I've never seen and there is no way to tap one for a definition."
- fix: introduce a `<LoreTerm term="Ocularum">Ocularum</LoreTerm>` component that surfaces `loredex-data.json` summaries in a Radix-tooltip (or popover on mobile). `apps/client/src/contexts/LoredexContext.tsx` already loads entity data — wire it. Lazy-define on first reveal so Elara's first usage of any term auto-flags it as known.

### F4: LoreTutorialEngine has SKIP ALL but no "back" — irreversible morality-applying choices
- where: `apps/client/src/components/LoreTutorialEngine.tsx` lines 230–252 (handleChoice). `shiftMorality` is called immediately on click; the comment explicitly notes "shifts are now applied per-choice…and persist even if the player abandons the tutorial mid-way."
- severity: high
- category: back_button_missing
- "I am a new player. I clicked 'Reroute the power. Efficiency matters more than secrecy' because it sounded efficient. Now Elara says I 'fed the Machine' and a `MACHINE +10 / HUMANITY -10` badge slid in. I do not know what to do because there is no Back, no Undo, the morality already wrote to the server, and I have no idea this affects the Act 1 finale's Light/Dark gate at Authority §5.8 nine cycles from now."
- fix: add a "Previous step" affordance for `narration`/`dialog` steps; for `choice` steps, surface a one-line consequence preview ("This choice will shift Light/Dark — affects later Trial gates") before commit, and gate `shiftMorality` behind a confirm. The current intro phase's only exit is SKIP ALL, which abandons the tutorial entirely.

### F5: Bridge Console (`/`) shows discovery-only state with no empty-state coaching
- where: `apps/client/src/pages/BridgeConsole.tsx` lines 1–14 explicitly state "If you haven't found it, it doesn't appear here. The Bridge is your window into the Ark — not a menu."
- severity: medium
- category: dead_end_state
- "I am a new player who finished Awakening. I'm on the Bridge. There are no NPC signals, no Discoveries, no DailyBrief items because I haven't visited any rooms. I see Light/Dark meter, RecentMatches (empty), and a header. I do not know what to do because there is no 'Start here' arrow pointing to /ark, /cards, or /story, and no tutorial prompts mount here (see F1)."
- fix: add an empty-state CTA card ("Begin: explore the Inception Ark → /ark") that hides once `state.discoveredRooms.length > 0`. Mount `tut-first-steps` here behind `useAutoTutorial("/")` so Elara offers a guided tour the moment the Bridge renders empty.

## First-15-minutes synthesis
Cold-open path: TitlePage → AwakeningPage (character creation, well-narrated) → Bridge Console which is **deliberately empty** and offers no next-step affordance. The orchestrator at `App.tsx:629` does call `checkTutorial({currentRoom})` on route changes, but the only consumers of `AutoTutorialPrompt` are `/cards` and `/fight`, so the rich `LORE_TUTORIALS` library (30 entries, 2,352 LOC) is effectively dormant unless the player happens onto those two routes. Players who reach `/act1-c4-trial` or any Act-N ladder hit a screen of jargon (Authority, Tribunal, jury cards, evidence cards, ink lines, Cycle C4, §2.13) with **no** in-page tutorial entry, **no** glossary tooltip, and **morality-affecting irreversible choices** in any tutorial they do open.

## Convergence hints
- Overlaps with QA persona (#05) on tutorial coverage gaps.
- Overlaps with Accessibility (#07) on `TrialPhaseIndicator`'s aria-label-only explanation surface — sighted new players need the same info visually.
- For the Staff Engineer (#01): `useTutorialOrchestrator` is wired but `AutoTutorialPrompt` is not — this is a 5-line fix at the GameGate level that unlocks 28 already-authored tutorials.
- Mobile (#08) should weigh in on `LoreTutorialEngine` skip-button placement (`top: env(safe-area-inset-top)+1rem`) and whether mobile players can see/reach SKIP ALL during the morality-applying choice phase.
- Narrative writer should confirm that the bible's "no glossary by design — discovery is the game" stance overrides F3, or whether a contextual tooltip layer is in scope.
