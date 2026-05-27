# Scaffolding-Without-Adoption Audit — 2026-05-27

Branch: `claude/dischordia-tcg-narrative-BaiWI`
Scope: every subsystem registered in `apps/shared/_completeness/registry.ts` plus the seven specific subsystems flagged in the prior Phase A planning notes as "deferred — open adoption gaps."

This audit answers one question: **after the Phase A narrative-spine adoption work landed (PR #809), what "scaffolding without adoption" is left in the codebase?** The Phase A plan named eight categories as deferred to "Plan B." This doc is Plan B's deliverable.

The headline finding is the smallest possible answer the user might have hoped for and the largest possible answer they might have feared, with the catch that the smallest answer is right: **the codebase is in much better shape than the Phase A planning notes assumed.** Most assumed gaps have been closed by the ratchet mechanism. The remaining work falls into three concrete buckets — and one of those buckets is the audit gate's own stale exemption notes.

> **Status update — 2026-05-27 follow-on PR**
>
> The "real adoption gaps" section of this audit originally listed FOUR gaps. After follow-on investigation:
>
> - **Gap C.1 + C.2 (stale gate doc-comments)** — ✅ **FIXED** in the same session. `expansionArtRenderReachability.ts` exemption strings and leading paragraph now name the actual consumer files; `declaredDesignSystems.ts` Trade Empire Coda flipped `status: "tracked"` → `"shipped"` with refreshed note.
> - **Gap A + B (orphan unlock kinds)** — ❌ **MISDIAGNOSIS, RETRACTED.** The "zero card consumers" finding checked card-authoring level only. Both `bloodline_threshold` and `dlc_chapter_completion` are adopted at the **system** level: `bloodline_threshold` is referenced by the real DLC chapter `apps/shared/dlc/chapters/breeding/advocate_body_coordinates.ts:28` (as a chapter prerequisite, not a card unlock) AND by `apps/shared/dlc/dlcChapterCompletionGate.ts:62` (the prereq evaluator); `dlc_chapter_completion` has a shipped contract test at `apps/shared/dlc/chapters/dlc_advocate_01_sacrum_echo/dlc_advocate_01_sacrum_echo.test.ts:123` that exercises the full chapter-complete → flag-write → card-unlock chain. The CardUnlockCondition variants are NOT orphan scaffolding — they are tested, integrated, feature-ready. The absence of production cards using them is a **content authoring backlog** (waiting on Wave-6 / DLC card drops), not a scaffolding gap. Leaving the variants in place; reverted the attempted removal.
> - **Bonus fix discovered during reverification** — `dialog_choice` was missing from `TS_KIND_REGISTRY` in `apps/shared/_completeness/checks/zodSchemaUnionParity.ts` (a Phase A omission that would have allowed Zod-schema drift on the dialog_choice variant to escape the gate). Added.
>
> The "Two patterns observed" section now has a third instance: **agents AND auditors miss multi-level adoption.** The first pass of this audit grepped for card consumers and concluded "orphan." The verification pass found the DLC chapter prereq + the contract test. **System-level adoption ≠ content-level adoption.** This audit's framing of "scaffolding without adoption" needs the corollary: "adoption can mean test fixture, integration test, OR production card — they're not interchangeable." Verifying the closure of an audit finding requires looking for ALL three.

---

## Methodology

1. Ran `pnpm ship:check` against the fresh post-PR-#809 main (commit `6399ba9`). Captured the full PASS / RATCHET / FAIL table.
2. Dispatched four parallel Explore agents to investigate the seven specific subsystems Phase A's "Deferred to Plan B" list called out, plus broader server/infrastructure subsystems named by `CLAUDE.md` as ship-check-gated.
3. Cross-checked every agent finding against a direct grep / file read. **Several agent findings turned out to be wrong** — agents grepping with narrow scope or reading stale doc-comments. The doc reports the verified ground truth, not the agent reports.
4. Identified two real "scaffolding without adoption" patterns (card-side unlock kinds with zero authored consumers; the gate's own exemption notes referencing manifests that DO have consumers).
5. Catalogued every claim from the Phase A "Deferred to Plan B" list against the verified ground truth — most claims were stale.

---

## Headline: ship:check status

```
✓ ship:check OK — 137 PASS, 5 RATCHET, 0 FAIL
```

| Status | Count | Notes |
|--------|------:|-------|
| PASS | 137 | Declared count == implemented count. Hard parity met. |
| RATCHET | 5 | Gap > 0 but ≤ recorded ceiling. All 5 are producer-art rows. |
| FAIL | 0 | No subsystem regressed past its ceiling. |

Five RATCHET rows, all in the art-asset pipeline (`apps/shared/_completeness/ratchet-state.json:55-59`):

| Row | Decl | Impl | Gap | Ceiling | Closing path |
|---|---:|---:|---:|---:|---|
| `art.axis12_state_coverage` (faction-livery) | 516 | 40 | **476** | 476 | Producer-art passes |
| `hotspots.composite_sprite_coverage` | 530 | 119 | **411** | 411 | `ROOM_DEFINITIONS` hotspot authoring |
| `art.axis9_state_coverage` (TV-infection) | 255 | 63 | **192** | 192 | Producer-art passes |
| `art.axis11_state_coverage` (cycle-phase) | 150 | 30 | **120** | 120 | Producer-art passes |
| `art.room_asset_coverage` | 166 | 159 | **7** | 7 | **One PR closes this** |

None of the RATCHET rows is engineering work. Four are producer-art delivery (waiting on NEW_ART_* manifest drops); one (`art.room_asset_coverage`) is seven manifest registrations away from PASS and is the single highest-leverage closing slice in the codebase.

---

## Real adoption gaps

After cross-checking every agent finding against direct grep / file read, only **three** "scaffolding without adoption" patterns survive verification. None block player-visible behavior; all are quiet authoring opportunities.

### Gap A: `CardUnlockCondition.bloodline_threshold` has runtime, zero card consumers

- **Declared** — `apps/shared/tcg-core/types/Card.ts:311-314` (union variant), `apps/shared/tcg-core/cards/schema.ts` (Zod schema)
- **Runtime** — `apps/shared/tcg-core/rewards/expansionUnlockService.ts:112-115` (evaluator case present)
- **Consumer** — **zero**. `grep -rn 'kind: "bloodline_threshold"' apps/shared/tcg-core/cards/definitions/` returns no matches.
- **Closing slice** — Either (a) author at least one card with this unlock kind (the Wave-6 Advocate-bloodline plan mentioned in the type doc), or (b) remove the variant if Wave-6 cards aren't in roadmap.
- **Player impact** — None today. The bloodline-generations player-state field IS populated (server `userProgress`); the unlock kind is just a dead branch waiting for content.

### Gap B: `CardUnlockCondition.dlc_chapter_completion` has runtime, zero card consumers

- **Declared** — `apps/shared/tcg-core/types/Card.ts:306` (union variant), `apps/shared/tcg-core/cards/schema.ts`
- **Runtime** — `apps/shared/tcg-core/rewards/expansionUnlockService.ts:110-111` (evaluator case); flag-prefix writer parity for `dlc_chapter_<id>_complete` confirmed by `apps/shared/_completeness/checks/flagPrefixWriterParity.ts:36-61` (PASS)
- **Consumer** — **zero**. `grep -rn 'kind: "dlc_chapter_completion"' apps/shared/tcg-core/cards/definitions/` returns no matches.
- **Closing slice** — Author DLC-chapter-exclusive cards (the "shape" the unlock kind was built for). The infrastructure is wholly ready.
- **Player impact** — None today. DLC chapters complete normally; no exclusive cards reward chapter milestones because no cards are authored with the gate.

### Gap C: The ship:check gate itself has stale exemption / status notes

Two cases identified. Both are second-order — the GATE is correct; its hand-written notes lie.

**C.1 — `expansionArtRenderReachability.ts:104-114` exempts two manifests as "no consumer," but consumers exist.**

```ts
// apps/shared/_completeness/checks/expansionArtRenderReachability.ts:105-113
{
  module: "signatureCardManifest",
  reason: "declared but no client/shared consumer asks for slots",
},
{
  module: "newArtManifest",
  reason: "URL coverage passes but no client/shared consumer resolves any URL",
},
```

Verification (`grep "from \"@shared/expansionArt/...\""`):

- `signatureCardManifest` → consumed by `apps/client/src/components/apprentice/SignatureSlotSpec.tsx:19` (`signatureCardManifest`)
- `newArtManifest` → consumed by `apps/client/src/components/ChapterCardGallery.tsx:16-17` (`newArtChapterCardUrl`)

Both manifests have SHIPPED consumers. The exemption was correct when written; the consumers shipped after; the exemption note was never refreshed. The exemption can be deleted in a single edit.

**C.2 — `declaredDesignSystems.ts:373` marks Trade Empire Coda as `status: "tracked"` with note "schema placeholder only," but all 5 declared symbols are shipped in production.**

```ts
// apps/shared/_completeness/declaredDesignSystems.ts:373-407
{
  id: "trade_empire_coda",
  status: "tracked",
  note: "Coda Agency mission loop ... — schema placeholder only.",
  expectedRuntimeSymbols: [
    { needle: "codaFactionStanding", ... },
    { needle: "vexCodaTrust", ... },
    { needle: "generateCodaMission", ... },
    { needle: "completeCodaMission", ... },
    { needle: "CodaAgencyBoard", ... },
  ],
}
```

Verification:

| Symbol | Status | File |
|---|---|---|
| `codaFactionStanding` (schema table) | ✓ shipped | `apps/server/routers/tradeMissions.ts:48` imports from db/schema |
| `vexCodaTrust` (schema column) | ✓ shipped | `apps/server/routers/tradeMissions.ts:577` reads it |
| `generateCodaMission` (shared export) | ✓ shipped | `apps/shared/codaMissionGenerator.ts:180` |
| `completeCodaMission` (tRPC procedure) | ✓ shipped | `apps/server/routers/tradeMissions.ts:456` |
| `CodaAgencyBoard` (client component) | ✓ shipped | `apps/client/src/components/CodaAgencyBoard.tsx:35` |

All five symbols are shipped. The status metadata is stale. The note "schema placeholder only" is from before the runtime landed. Closing slice: flip `status: "tracked"` → `status: "shipped"`, update the note, optionally re-seed the ratchet ceiling from 5 back to 0.

---

## What the audit DEBUNKED

The Phase A plan's "Deferred to Plan B" list named these as open candidates. **Every one verified PASS at ship:check today.** Including them here as a calibration — the list was written under the assumption that "Plan B will reveal lots of work"; that assumption was wrong.

| Phase A plan claim | Verified status | Source |
|---|---|---|
| `narrative.global_alignment_meter` — 4 missing artifacts | ✓ **PASS** — all 4 artifacts present (schema column, aggregator, tRPC reader, client component mounted on PlayerProfilePage + BridgeConsole) | `apps/shared/_completeness/checks/globalAlignmentMeter.ts` + grep |
| `narrative.mobile_narrator_adoption` — 1/5 design-mandated pages | ✓ **PASS** — `MobileNarratorSlot` mounted on all 5 (ArkExplorer, CompanionHub, MemorialCorridor, PetGarden, CharacterCreation) | `apps/shared/_completeness/checks/mobileNarratorAdoption.ts:29-65` |
| `narrative.shadow_tongue_room_coverage` — empty modules | ✓ **PASS** — 32/32 (26 universal + 6 species-exclusive) | `apps/shared/roomMysteries/index.ts` |
| `npc.dialogue_coverage` — 5 priority NPCs missing trees | ✓ **PASS** — 12/12 NPCs at BioWare authoring depth (past/calling/mortality/us/witness × 12 NPCs) | `apps/shared/npcDialogues.ts:1460-1473` |
| `world.woven_two_ripple_rule` — handlers untagged | ✓ **PASS** — 25/25 WovenSystems with cross-system consumers tagged | `apps/shared/wovenSystems/registry.ts` + `apps/server/services/rippleEngine.ts` |
| `world.yearly_event_runtime` — schema non-existent | ✓ **PASS** — 16 yearly events; all 4 artifacts present (shared def, router, scheduler, schema table) | `apps/shared/_completeness/checks/yearlyEventRuntime.ts:35-57` |
| `mission.factory_consumer_coverage` — 4 callers local-generate | ✓ **PASS** — 4/4 consumers import `proceduralMissionFactory` (dailyQuests, tradeMissions, crew, collectorsWorkMissions) | `apps/shared/_completeness/checks/missionFactoryConsumerCoverage.ts:22-46` |
| Infrastructure (observability / rate limits / transactions / FK coverage / migration journal / mobile parity / lore drift) | ✓ **PASS across the board** — Sentry/OTel wired (`apps/server/_core/index.ts:425,498`), per-IP rate limit at 600/60s, 37/37 economic procedures wrapped in transactions, 376/376 `*Id` columns have FKs, Step-2 migration cutover complete (one baseline SQL file, journal authoritative) | CLAUDE.md domains all verified |

**The Phase A planning list was a snapshot of fears, not a snapshot of reality.** The ratchet mechanism + the parity tests have done their job since whenever those notes were last refreshed.

---

## Two patterns observed (the meta-finding)

Across the four agent reports + my own verification, the same shape of error recurred. Worth surfacing because it shapes how the user should consume agent reports about adoption:

### Pattern 1: Agents grep-with-narrow-scope and miss real consumers

The first agent claimed `bloodline_threshold` had "no runtime handler" because a grep at one path didn't return a hit. Direct verification found the handler at `expansionUnlockService.ts:112-115`. Both subsequent claims about "orphan manifests" (signatureCardManifest, newArtManifest) were false in the same way — consumers existed at paths the agent didn't search.

**Implication:** trust ship:check, not agent reports, as the canonical truth source. ship:check's parity checks are exhaustive within the registry's scope; agent grep is sampling.

### Pattern 2: Documentation lies more than code

The two real meta-gaps surfaced (Gap C above) are both in HAND-WRITTEN annotations on the gate:
- `expansionArtRenderReachability.ts:104-114` exemption reasons are stale doc-comments.
- `declaredDesignSystems.ts:373` status metadata is stale.

Code is the contract that runs. Doc-comments are a contract a human wrote, that nothing checks. When the runtime ships, the doc-comment does not auto-update. **"Scaffolding without adoption" turns out to be most common in the gate's own self-description.**

---

## Recommended next slices (ranked)

After the follow-on PR refreshed Gap C.1 + C.2 and retracted Gap A + B as misdiagnosis, what remains:

| Rank | Slice | Effort | Why |
|---:|---|---|---|
| ~~1~~ | ~~**Refresh stale gate notes** (Gap C.1 + C.2)~~ | ✅ **DONE** | Refreshed in the same session. The gate now honestly describes its own state. |
| 1 | **Close `art.room_asset_coverage`** — register the 7 known apprentice/pedagogy/commons sub-zone manifests | 1 PR | Drops the row from RATCHET to PASS. Zero engineering risk; manifest registrations only. **Highest-leverage closing slice in the codebase.** |
| 2 | **Optional: author cards using `bloodline_threshold` and `dlc_chapter_completion`** unlock kinds when Wave-6 / DLC card drops materialize | content authoring decision | NOT a scaffolding gap (system-level adoption is real); a content backlog item. Wait for the right card drop rather than authoring placeholder cards. |
| (note) | The 4 art-axis RATCHET rows (Axis 9 / 11 / 12 / hotspot 411) are producer-art work. Engineering side already accepts every variant gracefully (`compositeResolver` degrades on missing variants). Not closeable from the engineering side. | — | — |

---

## Conclusion (post-fix state, 2026-05-27)

The "scaffolding without adoption" framing the user named as a project flaw is REAL as a value to hold against the codebase — but the ratchet mechanism + parity tests have done their job. The current state is:

- 137 subsystems PASS hard parity (unchanged)
- 5 RATCHET rows, all producer-art content gaps locked at ceiling, none regressing
- 0 stale doc-comment exemptions in the gate's own files (the 2 originally identified were refreshed in the same session)
- `bloodline_threshold` and `dlc_chapter_completion` confirmed as feature-ready unlock kinds, system-level adopted (DLC chapter prereqs + integration tests), production-card-authoring deferred to content roadmap

The Game Master mid-Trial Intercession (shipped this session) is the canonical example of "what `shipped` means" — declared, runtime, consumer, parity test, RULES_VERSION unchanged. Every entry in `apps/shared/_completeness/registry.ts` is held to the same shape.

The smallest honest follow-on from this audit is **one optional PR** that registers the 7 sub-zone manifests to close `art.room_asset_coverage` from RATCHET to PASS — engineering-driven, ~1 hour.

The three Real Gaps from this audit (originally listed as A / B / C) resolved as:
- Gap A + B — retracted as misdiagnosis (system-level adoption was overlooked in the first pass)
- Gap C.1 + C.2 — fixed in the same session

**This audit shipped the first instance of itself catching a false positive.** The "Pattern 1: agents grep-with-narrow-scope" finding turned out to apply to the auditor (me) as much as the subordinate agents. The corrective shape — verify against multi-level adoption (test fixture / integration test / production consumer) before naming a gap — is now part of the methodology.

---

## Appendix: agent reports (compressed)

Four parallel Explore / general-purpose agents were dispatched. Their detailed findings totalled ~7K tokens; the verified findings are summarised inline above. Highlights of what the agents brought to the audit that wasn't in ship:check directly:

- **Narrative agent** — verified every Phase A planning claim against the file system, returning PASS for all six narrative subsystems.
- **World/mechanics agent** — surfaced the two card-side dead branches (Gap A + B) and (incorrectly) the two "orphan manifest" claims; the verification step caught the error in the manifest claims but credited the card-side claims as real.
- **Server/infra agent** — confirmed every CLAUDE.md infrastructure subsystem is at hard PASS, including the migration journal cutover (Step 2 complete; one baseline SQL file authoritative).
- **Ship-check baseline agent** — enumerated the 5 RATCHET rows + listed canonical "shipped well" examples (wolf_hunt.hero_target_coverage 250/250; tcg.trial_category_coverage 1314/1314; nemesis.archetype_pair_dialog_coverage 132/132; etc.) for celebration material.

Audit complete.
