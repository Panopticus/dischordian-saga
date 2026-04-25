# Stub Dialog Audit — 2026-04

_Repo-wide scan for placeholder/stub dialog content. Run on branch
`claude/audit-stub-dialog-ycQAR` against the working tree as of
2026-04-25. Companion to `ACTS_2_7_COMPLETENESS_AUDIT.md` and
`WRITING_AUDIT_V2_INGAME.md`._

## Executive summary

| Surface | Status |
|---|---|
| UI dialogs / modals (`apps/client/src/`) | ✅ clean |
| Per-act opponent dialog tables (Acts 1–7) | ✅ clean |
| `narrativeActs.ts` line text | ✅ clean (per `ACTS_2_7_COMPLETENESS_AUDIT.md`) |
| `dialogTrees/elaraAct1.ts`, `humanAct1.ts` | ✅ clean |
| Loredex bios + history | ✅ clean (after this pass) |
| Companion comments / ask topics | ✅ clean |
| Voice manifests + `pendingVoLines.json` | ✅ empty queue |
| `tradeEmpireVoLines.ts` voice IDs | ⚠️ 5 `TODO_*_VOICE` — gated by `--skip-todo`, casting-blocked |
| `inventorMythics.ts` beat statuses | ⚠️ 18 `status: "placeholder"` — descriptions complete; Act-team refinement pending |
| `act2Interlude.ts:248` rematch line | ⚠️ deferred to Act 3/4 dialog pass |
| Act 7 finale close-line tone pass | ⚠️ intentionally deferred until cinematic locks |

**One real text stub fixed in this pass:**
`apps/client/src/data/loredex-data.json:563` — `entity_10` (The Warlord)
`history` field had been left at the original placeholder
`"Details about its nature and capabilities are classified. Information
regarding its fate remains redacted."` while the matching `bio` was
upgraded per `WRITING_AUDIT_V2_INGAME.md` FIX G.1. Now authored.

**One CI guard added:** `apps/shared/contentIntegrity.test.ts` now
asserts that no narrative dataset contains
`/\b(TODO|FIXME|XXX|placeholder)\b/i` substrings in its user-facing
text fields. Allow-list is empty.

## Clean surfaces (no action)

### UI dialogs and modals

30+ React dialog/modal components under `apps/client/src/components/` and
`apps/client/src/pages/`. Each one has a real body and live handlers:
`ElaraDialog.tsx`, `RoomTutorialDialog.tsx`, `RespecDialog.tsx`,
`DnaDeviceOfferDialog.tsx`, `ArkFastTravelModal.tsx`,
`EngineerRecordingDiscoveryModal.tsx`, `CrewDangerEventModal.tsx`,
`CloneFromTemplateModal.tsx`, `TalentSelectionModal.tsx`,
`HolidayDialogTicker.tsx`, plus 20 more.

The 10 native `alert()` / `confirm()` / `window.confirm()` calls in
client code are intentional confirmation/error UX, not placeholders:

- `apps/client/src/components/InfectionPanel.tsx:243`
- `apps/client/src/components/PhotoMode.tsx:88`
- `apps/client/src/pages/AdminPage.tsx:1183`
- `apps/client/src/pages/DeckBuilderPage.tsx:268`
- `apps/client/src/pages/ArchitectConsolePage.tsx:669`
- `apps/client/src/pages/GuildPage.tsx:495`, `:639`
- `apps/client/src/pages/OracleDeckPage.tsx:101`

The only `console.log` stub inside a dialog body is at
`apps/client/src/pages/ComponentShowcase.tsx:197`, which is a
dev-only showcase route.

### Per-act opponent dialog and dialog trees

- `apps/shared/act1OpponentDialog.ts` (21 opponents)
- `apps/shared/act3OpponentDialog.ts` (3 opponents)
- `apps/shared/act4OpponentDialog.ts` (3 path-gated battles)
- `apps/shared/act6OpponentDialog.ts` (2 confession mirrors)
- `apps/shared/act7OpponentDialog.ts` (4 finale matches)
- `apps/shared/dialogTrees/elaraAct1.ts`,
  `apps/shared/dialogTrees/humanAct1.ts`

All 12-field schemas populated, no TODO/FIXME/placeholder markers in
text, no empty user-facing strings.

### Voice manifests and pending VO

`apps/shared/pendingVoLines.json` is empty:

```json
{ "antiquarian": [], "elara": [] }
```

The 18 SiH song entries flagged by `WRITING_AUDIT_V2_INGAME.md` Issue
G.4–G.11 have all been authored since that doc was written —
`song_sih_1` through `song_sih_18` carry real bios (e.g. `song_sih_8`
"Worthy": _"Awe. The question of authority. ACT II: THE JUDGMENT. Rev
4-5 (throne room, scroll)."_). No allow-list needed.

### Loredex bios and history (post-fix)

Re-checked all 233+ entries. With the Warlord `history` rewrite landed,
zero entries match `/\b(TODO|FIXME|XXX|placeholder)\b/i` in `bio` or
`history`. The contentIntegrity test now enforces this in CI.

## Remaining stubs (and dispositions)

### Gated, work-in-progress (P1)

#### `apps/shared/tradeEmpireVoLines.ts:65–69` — five unassigned voice IDs

```ts
the_antiquarian: "TODO_ANTIQUARIAN_VOICE",
locke:           "TODO_LOCKE_VOICE",
orin_fell:       "TODO_ORIN_VOICE",
the_architect:   "TODO_ARCHITECT_VOICE",
mol_garath:      "TODO_MOLGARATH_VOICE",
```

Affects 15 VO lines. The generation pipeline already gates them via the
`--skip-todo` flag — lines render text-only until ElevenLabs voices are
cast. **Action:** track via the casting/voice-actor pipeline; not a
narrative-content stub.

#### `apps/shared/act2Interlude.ts:248–252` — `getCullingRematchLine()`

Returns an empty string with an inline comment explicitly deferring it
"until the Act 3/4 dialog pass lands." Callers handle the empty
fallback. **Action:** retire the placeholder when the Act 3/4 pass
authors the rematch dialog; the function signature is already correct.

### Data-structure flags (P2 — not text stubs)

#### `apps/shared/inventorMythics.ts` — 18 beats with `status: "placeholder"`

Each beat has a complete `description` field; `status: "placeholder"`
is a structural flag indicating the beat is awaiting Act-writer
refinement of its narrative hook, not that the prose is missing.
Lines: 71, 81, 91, 101, 111, 121, 131, 141, 151, 161, 171, 181, 191,
201, 211, 221, 231, 241. **Action:** none from this audit. The
`MythicBeatStatus` enum is the appropriate tracking surface.

### Intentional design (do not change)

- **`apps/shared/humanLines.ts:516,527,538`** — three silence lines
  (`text: ""` with populated `voId`).
- **`apps/shared/getElaraLine.ts:39,51`** — two VO-only lines (same
  pattern).

These are the canonical "voice-only, no on-screen text" pattern. The
new stub-marker test scans for marker substrings, not empty text, so
it ignores them. The existing empty-string assertions in Section 4
of `contentIntegrity.test.ts` already exempt non-loredex datasets
with their own field-by-field checks.

### Deferred by design

- **Act 7 Convergence Seat close-line editorial pass** —
  `SESSION_HANDOFF_ACTS_2_7.md:120–122` explicitly defers the tone
  pass on the finale's close lines until the cinematic locks. Lines
  are authored; tone-tightening is intentional later work.

## Reconciliation against `WRITING_AUDIT_V2_INGAME.md`

That doc tracked 67 specific revisions across Issues A–I. Status as of
this audit:

| Issue | Theme | Scope | Status |
|---|---|---|---|
| A | Architect cliché lines | voice-quality | tracked separately; not stub-scope |
| B | Source lacks Kael-interruption | voice-quality | tracked separately |
| C | Narrator over-exposition | voice-quality | tracked separately |
| D | Fight lines >25 words | content-length | enforced by `act{N}OpponentDialog.test.ts` |
| E | Character voice drift | voice-quality | tracked separately |
| F | Generic villain patterns | voice-quality | tracked separately |
| **G** | **Loredex stubs** | **stub-scope** | **G.1 fixed (this audit), G.2/G.3 already shipped, G.4–G.11 obsolete (SiH bios authored)** |
| H | Subject 0 → Prisoner 74 | naming consistency | global rename, not stub-scope |
| I | Chapter 12 foreshadowing | additive | not stub-scope |

Issue G is the only stub-scope category. With this audit's fix it is
fully closed.

## CI guard added

`apps/shared/contentIntegrity.test.ts` Section 5 ("Stub Marker
Checks") asserts that the following datasets contain no
`/\b(TODO|FIXME|XXX|placeholder)\b/i` substrings in their user-facing
text fields:

- Loredex (`bio`, `history`)
- Transmissions (`title`, `synopsis`, `memeIntro`, `memeOutro`)
- Quests (`name`, `description`)
- Apprentice archetypes (`personality`, `voiceDirection`,
  `breakingPoint`)
- Seasonal events (`name`, `description`, plus shop items)
- Story chapters (dialogue `text`)
- Guild hall tiers (`loreText`) and decorations (`description`)

A `STUB_MARKER_ALLOWLIST` set is exported at the top of Section 5 so
future deferred-by-design entries can be allow-listed by id.
**The list is empty as of this audit.**

The regex uses word boundaries to avoid false-positives (e.g.
"classified", "embodied", "approximately"). A sanity test inside the
section asserts it catches the four canonical markers and ignores
nearby false-positive substrings.

## Verification

- `pnpm test apps/shared/contentIntegrity.test.ts` — green.
- `rg -nE '\b(TODO|FIXME|XXX|placeholder)\b' apps/client/src/data/loredex-data.json`
  → no matches.
- The Warlord `history` field (`entity_10`) now reads as authored
  prose, ~700 characters, matching the structure of the Politician's
  history (`entity_11`) and consistent with the bio's existing motifs
  (6th Archon, cybernetic eye, Engineer-screams-inside-armor,
  post-Battle-of-Nexon ambiguity).

## What's next (out of scope for this audit)

1. Cast voices for the 5 trade-empire speakers; remove the
   `TODO_*_VOICE` sentinels.
2. Author the Act 3/4 culling-rematch line and retire
   `getCullingRematchLine`'s empty-string fallback.
3. When the Act-writers finish refining each `inventorMythics` beat,
   flip `status` to `"authored"`.
4. Run the Act 7 finale tone-pass once the cinematic locks.

None of these block the current build or violate the new CI guard.
