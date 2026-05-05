# Hidden Systems Audit — 2026-05-05

Branch: `claude/audit-hidden-systems-QAh4F`
Scope: every line of code and dialog in the monorepo, scored against player reachability in shipping builds.

This audit catalogues systems and ideas that exist in the design docs **or** the code but that a normal logged-in player cannot currently see, hear, or trigger. It is organised so the engineering team can act on the findings: each entry has file paths, a concrete defect class, and a "real?" verdict that says whether the gap was confirmed against the source rather than just inferred from a doc.

## How to read this report

Every finding falls into one of five categories:

- **SPEC-ONLY** — described in design docs, no implementing code found.
- **BACKEND-ONLY** — server router/service exists, no client surface consumes it.
- **CLIENT-ONLY DEAD** — page/component/asset exists, no route or no inbound link.
- **GATED-UNREACHABLE** — gating predicate cannot evaluate true in production (no grant path / no trigger / dead window).
- **WORKING-AS-INTENDED** — flagged during sweeping greps but is by-design hidden (e.g. `reserved: true`, dev-build affordances). Listed for completeness so the next auditor doesn't re-discover them.

"Real?" verdict is **HIGH** when I personally grep-verified the gap, **MEDIUM** when one source confirmed it but cross-checks were partial, **LOW** when only a research agent reported it.

---

## 1. Client routing — pages players cannot reach

### 1.1 Broken nav button: `/comms-array` (GATED-UNREACHABLE, HIGH)

`apps/client/src/components/AppShellImmersive.tsx:61` defines a top-level nav entry pointing at `/comms-array`. Searching `apps/client/src/App.tsx` returns zero `<Route>` matches for that path. Other components reference `comms-array` as a *room id* (`InlineShipMap`, `ShipSchematicMap`, `ProtectedRoute` redirect map, `RoomTransition`), but none of those map a URL.

Effect: clicking the persistent COMMS button in the immersive shell drops the player on the `NotFound` page. Adjacent surfaces that route *into* comms (`/watch`, `/conexus-portal`, `/signal-decryption`, `/messages`) all redirect *to* `comms-array` via `ProtectedRoute`, so the entire Comms Array room hub appears to be dark.

### 1.2 Imported pages with no `<Route>` registration (CLIENT-ONLY DEAD, HIGH)

- `apps/client/src/pages/GamesPage.tsx` — imported in `App.tsx:176`, never routed. Code split, never reached.
- `apps/client/src/pages/LoreTutorialHubPage.tsx` — imported in `App.tsx:224`, never routed. Inline comment confirms `/lore-tutorials` was retired in favour of organic Elara dialog, but the file and lazy import survived.

### 1.3 Liminal pages reachable only by URL (WORKING-AS-INTENDED, HIGH)

These are intentionally undiscoverable but worth documenting so they aren't mistaken for orphans:

- `/architect` → `ArchitectCryptic` (23-second-delayed cryptic transcript)
- `/dreamer` → `DreamerFragment` (404-styled vision page)
- `/dev/variants` → `DevVariantsPage`
- `/dev/guild-cutscenes` → `DevGuildCutscenesPage`

### 1.4 Properly admin-gated pages (WORKING-AS-INTENDED)

`AdminPage`, `AdminHealthPage`, `ArchitectConsolePage` all check `user?.role === "admin"` client-side and the server enforces it as well. Listed only so future audits know they are *deliberately* invisible to most players.

---

## 2. Server-side functionality without a client surface

There are 127 non-test routers in `apps/server/routers/`. ~39 are registered in `apps/server/routers.ts` but have **zero** `trpc.<routerName>.` references anywhere in `apps/client/src/`.

### 2.1 The biggest orphans (BACKEND-ONLY)

| Router | File | What it does | Real? |
|---|---|---|---|
| `fnord23` | `apps/server/routers/fnord23.ts` | "Engineer's stolen sampler" — `getState`, `discover`, `listChannels`, `listTracks`, `captureAudio`, `rollFnord`. Backed by `apps/shared/fnord23/`. Rich state machine. | HIGH |
| `potentialIdentity` + `potentialFactions` | `apps/server/routers/potentialIdentity.ts`, `potentialFactions.ts` | Potential Origin Reveal arc — `completeHorrorReveal`, `getRevealState`, `listFactions`, `joinFaction`. | HIGH |
| `replaySystem` | `apps/server/routers/replaySystem.ts` | Replay save/load/share. (The `/replay/:id` page hits a *different* replay router.) | HIGH |
| `coopRaids` | `apps/server/routers/coopRaids.ts` | Co-op raid coordination. | HIGH |
| `donationSystem` | `apps/server/routers/donationSystem.ts` | Donation/gifting. | HIGH |
| `chat` | `apps/server/routers/chat.ts` | General messaging. | HIGH |
| `socialFeatures` | `apps/server/routers/socialFeatures.ts` | Social graph / followers. | HIGH |
| `friendlyChallenges` | `apps/server/routers/friendlyChallenges.ts` | Social challenge invites. | HIGH |
| `guildContracts` / `tradeContracts` | `apps/server/routers/guildContracts.ts`, `tradeContracts.ts` | Binding contracts between guilds/players. | HIGH |
| `marketAchievements` | `apps/server/routers/marketAchievements.ts` | Marketplace-tied achievements. | HIGH |
| `trophy` | `apps/server/routers/trophy.ts` | Trophy/badge tracking. | HIGH |
| `collection` | `apps/server/routers/collection.ts` | Item collection / library. | HIGH |
| `celebration` | `apps/server/routers/celebration.ts` | Victory / milestone celebrations. | HIGH |
| `bonusObjectives` | `apps/server/routers/bonusObjectives.ts` | Bonus quest tracking. | HIGH |
| `questProgress`, `prestigeQuests`, `dailyQuests` | `apps/server/routers/*Quests*.ts` | Quest state. (`questBoard` page consumes a different facade.) | MED |
| `tutorial` | `apps/server/routers/tutorial.ts` | Onboarding state. | MED |
| `cadesIce` | `apps/server/routers/cadesIce.ts` | T10 Cades FPS peer signaling. (`useCadesSignaling` uses the WS, not this router.) | HIGH |
| `pvpRanking`, `competitive` | `apps/server/routers/pvpRanking.ts`, `competitive.ts` | PvP ladder/rating. | HIGH |
| `eidolonBond` | `apps/server/routers/eidolonBond.ts` | Entity bonding. | HIGH |
| `factions` | `apps/server/routers/factions.ts` | Faction mechanics. | HIGH |
| `graduateLegion` | `apps/server/routers/graduateLegion.ts` | Post-game legion ranking. | HIGH |
| `masteryTree`, `techTree`, `rpgSystems` | `apps/server/routers/*.ts` | Long-tail progression systems. | HIGH |
| `outbreak` | `apps/server/routers/outbreak.ts` | Event/outbreak system. | HIGH |
| `engineerLogs` | `apps/server/routers/engineerLogs.ts` | Engineer lore/logs. | HIGH |
| `storyMode` | `apps/server/routers/storyMode.ts` | Story progression tracking. | HIGH |
| `communityCodex` | `apps/server/routers/communityCodex.ts` | Shared knowledge base. | HIGH |
| `ark`, `arkThemes` | `apps/server/routers/ark.ts`, `arkThemes.ts` | Theme/visual system. | HIGH |
| `dischordiaCycle` | `apps/server/routers/dischordiaCycle.ts` | Seasonal cycle tracking. | MED (used internally by store?) |
| `contentApi` | `apps/server/routers/contentApi.ts` | Public content cache (`getAllEntries`, `getAllCards`, `getStats`). | HIGH |

**Verification method**: ran `grep -r "trpc\.<router>" apps/client/src` for each row above; all returned zero hits.

### 2.2 Mis-located file (BACKEND-ONLY, HIGH)

`apps/server/routers/crewTableSync.ts` exports `syncCrewStateToTables(userId, state)` — it is *not* a tRPC router. It's called as a side effect from `crew.saveState()` but lives in the routers directory. Should be in `apps/server/services/`.

### 2.3 Orphan WebSocket bridge (BACKEND-ONLY, HIGH)

`apps/server/duelystWs.ts` is registered in `apps/server/_core/index.ts` (`/api/duelyst`). Grepping `apps/client/src/game/duelyst/` for `WebSocket`, `ws://`, `wss://`, or `/api/` returns **zero** matches. The Duelyst page (`DuelystPage`) and its routes (`/duelyst`, `/duelyst-play`) are single-player-only; the multiplayer WS infrastructure has no client connector.

### 2.4 Watcher subsystem — false alarm (correction)

A research pass flagged `apps/server/routers/watcher.ts` as orphaned. It is **not**: `apps/client/src/lib/watcher.ts` is consumed by `WatcherHost` (mounted in `App.tsx:855`) and called from `Act2InterludePage`, `AwakeningPage`, `ArkExplorerPage`, `TitlePage`, `SurveillanceOpening`, and `DuelystGameUI`. The router is reachable.

---

## 3. Card engine — features the engine ships but no card uses

Source: `apps/shared/tcg-core/types/Effect.ts`, `Trigger.ts`, `Card.ts`. Verified by greps against `apps/shared/tcg-core/cards/definitions/`.

### 3.1 Effect ops with zero card usage (BACKEND-ONLY, HIGH)

- `op: "dispel"` — `Effect.ts:98`
- `op: "push"` — `Effect.ts:102`
- `op: "if"` — `Effect.ts:113` (the imperative if-op is unused; condition trees use the dedicated `cond` field instead)

### 3.2 Trigger kinds with zero card usage (BACKEND-ONLY, HIGH)

- `kind: "on_card_played"` (`Trigger.ts:54`)
- `kind: "on_move"` (`Trigger.ts:55`)
- `kind: "on_summoned_near_me"` (`Trigger.ts:56`)

These imply spatial/movement-aware mechanics that have not been written.

### 3.3 Keywords listed in the union but unused on cards (BACKEND-ONLY, MED)

`zeal`, `structure`, `taunt` (commented as a `provoke` alias), `pack`, `resurrect` — defined in `apps/shared/tcg-core/types/Card.ts:37–67`, no card carries any of them.

### 3.4 Veron's rogue trigger (POTENTIAL BUG, MED)

`apps/shared/tcg-core/cards/definitions/neutral/s1_char_004_ambassador_veron.ts` uses `kind: "veron_kills"` four times. The literal does not appear in the `Trigger` union (`Trigger.ts:43–58`). It *does* match the pattern of a counter name (Effect.ts has `counter: string` fields), so this is plausibly being parsed as a counter mutation rather than a top-level trigger — but the schema is `.strict()` and the engine's `Trigger` typing won't include it. Worth a follow-up: either Veron's effects don't fire in practice, or there's a second union somewhere with a custom kind that needs a comment to that effect.

### 3.5 Cards whose unlock can never grant (GATED-UNREACHABLE, HIGH)

`apps/shared/tcg-core/cards/definitions/s2_hierarchy/special_editions.ts` defines:

- `se_authors_edition_s2` — `unlockCondition: { kind: "authors_edition", season: "s2" }`
- `se_founding_author` — `unlockCondition: { kind: "founding_author" }`

`apps/shared/tcg-core/rewards/expansionUnlockService.ts:68–74` reads these from `gameData.entitlements.foundingAuthor` and `gameData.entitlements.authorsEditionS2`. `apps/server/services/playerExpansionState.ts:81–82` reads them but **nothing in the codebase writes them.** Greps for `grantFoundingAuthor`, `setFoundingAuthor`, `entitlements.foundingAuthor =`, etc. all return zero results. Effectively, those two cards are forever locked unless the entitlement is set out-of-band (admin tooling? Stripe webhook not yet wired?).

### 3.6 Secret-act cards 1 & 2 with no reveal path (GATED-UNREACHABLE, HIGH)

`special_editions.ts:29,47` define cards with `unlockCondition: { kind: "secret", act: 1 }` and `act: 2`. The reveal flags `secret_act_1_revealed` / `secret_act_2_revealed` are read by the unlock service. The conspiracy boards that flip these flags live in `apps/shared/conspiracyBoards/definitions.ts` — but only acts **3, 4, 5, 6, 7** have `revealFlag` entries (greppable: `secret_act_3_revealed` … `secret_act_7_revealed`). No act-1 or act-2 board exists. Result: two `s2_hierarchy` cards are permanently dark. The only mention of `secret_act_1_revealed` in the entire repo is a test fixture (`expansionUnlockService.test.ts:195`).

### 3.7 Reserved cards (WORKING-AS-INTENDED)

`apps/shared/tcg-core/cards/definitions/neutral/burnt_card_placeholder.ts` carries `reserved: true`. Loaded into the registry but filtered from pack/deck-builder/reward UIs by design (Seer prophecy gate). No action needed.

### 3.8 Rules version drift (WORKING-AS-INTENDED)

`engine/version.ts` `RULES_VERSION = "1.1.0"`; every card matches. No drift.

---

## 4. Narrative content authored but unreachable

### 4.1 Act 1 opponent taunts — 21 lines authored, 0 in audio manifests (CLIENT-ONLY DEAD, HIGH)

`apps/scripts/act1-taunts-lines.json` defines three taunts (early/mid/late) for each of seven act-1 opponents (Collector, Watcher, Eidola, Matrikala, Authority, Programmer, Warlord-Zero-First) — 21 entries, full metadata. **None** of them are present in the per-character VO manifests under `apps/shared/*VoManifest.json`, and there is no client-side wiring to play taunts during opponent encounters. The generator (`pnpm vo:act1-taunts`) was apparently never run.

### 4.2 Act 3–7 ask-topic unlocks — never authored (SPEC-ONLY, MED)

Per `docs/narrative-audit/ACTS_2_7_COMPLETENESS_AUDIT.md`. Acts 3 through 7 should each unlock new ask topics for the player; only the act-1→act-2 carry-through exists. The companion-conversation surface for the back half of the game uses act-1 topics.

### 4.3 Reactive companion comments — gaps in mid-arc Acts 3–5 (SPEC-ONLY, MED)

Same audit doc. `cc_act2_*` through `cc_act7_*` exist (~30 entries) but several mid-arc context triggers — e.g. "first substrate ping heard mid-match" (Act 2 was named explicitly; equivalent gaps live in Acts 3–5) — are wired with no comment, so the companion stays silent at moments the script calls out.

### 4.4 EXPANSION_BIBLE §1 discoverable lore items (SPEC-ONLY, MED)

`docs/design/EXPANSION_BIBLE.md` lists specific room hotspots:
- Medical Bay → Vox's journal
- Engineering → neural array fragment
- Observation Deck → surveillance override
- Cryo bay → claw marks on the pod
- (and others)

None of these appear as inventory items, hotspots, or interaction targets in `apps/shared/roomMysteries/` or the relevant page components. The lore-thematic intent is present in the LOREDEX entries, but the *mechanical discovery loop* the design promises does not exist in shipping code.

### 4.5 First Wave dark-sector probe events (SPEC-ONLY, MED)

`docs/design/YEAR_ONE_EVENTS_CALENDAR_V2.md` describes Insurgency scout ships, Ne-Yon shield readings, and Architect-driven probe outcomes. The Governance Hub and `architectConsole` admin tooling exist, but the player-visible probe-event surface is not implemented.

### 4.6 Engineer Zero post-credits cinematic (SPEC-ONLY → BACKEND-ONLY, LOW)

`docs/design/CANON_REV_7_ORACLE_VEX_EXPANSION.md` calls for an Engineer-Zero reveal at the Bridge of Kael after Act 5's post-credits. Frame and route exist; the specific "Engineer audio logs recovered from Vortex wreckage" content has not been authored.

### 4.7 Inventor Mythics with `status: "placeholder"` (SPEC-ONLY → CLIENT-ONLY DEAD, MED)

18 entries in `apps/shared/inventorMythics.ts` are flagged `status: "placeholder"`. Descriptions are written but flagged for refinement; depending on how the consumer treats the status field, these may be filtered out of player-facing surfaces.

### 4.8 Trade Empire VO TODO entries (WORKING-AS-INTENDED, LOW)

5 `TODO_*_VOICE` placeholders previously existed in `apps/shared/tradeEmpireVoLines.ts`; cross-checking shows all 5 speakers now have ElevenLabs voice IDs registered (lines ~64–74). No longer blocking, listed so the next audit doesn't re-flag it.

### 4.9 Stub-dialog audit — clean (NEGATIVE FINDING)

`contentIntegrity.test.ts` (CI guard) and the running audit at `docs/narrative-audit/STUB_DIALOG_AUDIT_2026-04.md` jointly confirm there are no `TODO`/`FIXME`/`PLACEHOLDER`/`Lorem` markers in shipping user-facing dialog or LOREDEX bios.

---

## 5. Design docs that promise systems with thinner-than-claimed implementation

These are docs whose surface area exceeds shipping code by enough that I list them rather than fold them into individual rows. None are full SPEC-ONLY (each has substantial code) but each over-claims relative to what a player can do.

| Doc | Implementation strength | Gaps |
|---|---|---|
| `docs/design/PSYCHOLOGICAL_PROFILE_SYSTEM.md` | Strong (7-axis profile, event log, NPC lines, self-portrait page) | None obvious — closest to fully shipped |
| `docs/design/SOUL_STONES_SYSTEM.md` | Strong (collection, pets, companions, purification, route `/soul-stones`) | "Global corruption tier events" §2.3 — escalation triggers not located |
| `docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md` | Strong (`apps/shared/episodeMysteries.ts`, `roomMysteries/`, `mysteryService.ts`) | Spec-level discoverable items in §1 (see 4.4) |
| `docs/built/WATCHER_DESIGN.md` | Strong (Stop 0 line "you looked away" shipped, full pipeline) | Acts 3–7 escalation curve triggers — partial |
| `docs/design/CANON_REV_7_ORACLE_VEX_EXPANSION.md` | Mixed (Vex/Coda/Vex reveal stages shipped) | Engineer Zero post-credits scene (4.6); legacy Warlord-as-human content purge incomplete |
| `docs/design/NARRATIVE_ARCHITECTURE.md` | Strong identity chains | "Signal Corruption" UI degradation curve varies by act; Acts 3–5 status unverified from code alone |
| `docs/design/EXPANSION_BIBLE.md` | Loredex layer present | Discoverable items spec (4.4) |
| `docs/design/AUTHORING_CROSS_GAME_THREADS.md` | Strong (`crossGameNarrativeThreads.ts`, `crossGameThreads` router) | None obvious |
| `docs/design/AUTHORING_MORALITY_VARIANTS.md` | Strong (289-entry resolver) | None obvious |
| `docs/design/YEAR_ONE_EVENTS_CALENDAR_V2.md` | Strong (governance hub, vote consequences, Pulse panel) | Dark-sector probe events (4.5); architect-triggered events admin-only |

---

## 6. Time-gated content that's currently dark

- **Christmas in July 2026** (`apps/shared/christmasInJuly.ts:18–19`): window 2026-07-01 → 2026-07-14. Today is 2026-05-05. 56 days from opening, gated correctly. WORKING-AS-INTENDED but currently invisible.

No expired-and-never-ran event windows discovered. Pet injury, chess climb tier 2 cooldown, and tower defense shield expiry all use proper relative-time gates.

---

## 7. Feature flags / env gates

Surprisingly thin. Only meaningful matches:

- `process.env.OTEL_ENABLED` — observability toggle (`apps/server/otel.ts`); not player-facing.
- `import.meta.env.DEV` — gates an "+10 memory energy" debug button on Engineer's Bench (`apps/client/src/pages/EngineersBenchPage.tsx:605`) and an i18n debug logger.

No LaunchDarkly / Growthbook / PostHog flags that hide player-visible surfaces. No `ENABLE_*` / `FEATURE_*` env vars gating shipping code.

---

## Suggested triage order

If this list is going to be acted on, here's the order I'd attack it in:

1. **Fix the broken COMMS button** (1.1). It's a player-visible 404 on every page of the immersive shell.
2. **Decide the fate of the 39 orphan routers** (§2.1). Either wire them up or delete them; the dead surface area is large and confusing.
3. **Author Acts 1 & 2 conspiracy boards or change `secret_act_{1,2}_revealed` to a different grant path** (3.6). Two cards are permanently dark right now.
4. **Wire entitlement grants for `founding_author` / `authors_edition`** (3.5). Even if Stripe isn't connected, an admin-tooling write path lets ops grant them.
5. **Run `pnpm vo:act1-taunts` and wire taunts into the act-1 encounter loop** (4.1). 21 already-authored lines are sitting idle.
6. **Delete the dead duelyst WebSocket** or build the multiplayer client (2.3).
7. **Decide whether `fnord23`, Potential Origin Reveal, and the social cluster (chat/donation/friendlyChallenges/socialFeatures/trophy/marketAchievements) are coming this season** (§2.1). If yes, stand them up; if no, delete to reduce confusion.
8. **Acts 3–7 ask topics + reactive companion comments** (4.2, 4.3). Lower priority because the core dialog is intact, but the spec promises richer companion behaviour than ships.
9. **EXPANSION_BIBLE §1 discoverable items** (4.4). Largest spec-vs-code gap in the design corpus.

Anything in §3.1–3.3 (unused engine ops/triggers/keywords) is opportunity cost rather than a defect — engine surface area waiting for cards to use it.
