# ACT 1 SHIP-READY ASSET BIBLE — Dischordian Saga

## "The Deck Reforged" — The Engineer's Story

This document is the production spec for every new asset required to
ship **Act 1** of the Dischordian Saga. It is the direct successor to
`docs/production/PRELUDE_SHIP_READY_BIBLE.md` — that doc covered the
15-beat Prelude; this one covers the 12-battle card-game biography
that follows it.

Act 1 is canonically called **"The Deck Reforged"** and it is *the
Engineer's story*. Every chapter of the card game is a chapter of his
life. Every boss is someone he loved, feared, or trained beside. His
execution — the Cycle C finale — is the player's first full musical
slideshow and the first community-visible Light Energy spike in the
whole galaxy. Act 1 is the most linear act in the entire game
deliberately so, because it is a biography. Every other act opens
up non-linearly.

**Primary game mode unlocked by Act 1:** Dischordia TCG.

**Canonical authority:** `docs/design/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md`
Act 1 section (lines 2332–2501 of Rev 6.2). Where this production doc
and the DSFGL disagree, the DSFGL is canonical unless this doc contains
an explicit "CORRECTED" annotation. See §23 Cross-References for the
full cross-reference index, including the canon drift between the DSFGL
design and the `apps/shared/act1Opponents.ts` code data shell (which
uses different placeholder names — this doc uses the DSFGL names).

---

## Section 0 — How to Use This Doc

### 0.1 Scope

Act 1 runs from the moment the player exits the Prelude (Beat J choice
resolved + `act1_start` flag set by the Prelude runner) to the moment
the player places their first blank Dischordia card on the Ark's
central pedestal (`act1_complete` flag). Everything in between is
Act 1 scope:

- **12 scripted card battles**, structured as three cycles (A/B/C)
- **3 master slideshow cinematics**, one per cycle finale
- **The Celebration Trial** — a 28-day Mascoteer decision loop that
  runs in parallel with Cycle A and writes buff/debuff state into the
  Cycle A card battles
- **The Apprentice system** — the apprentice assigned in Prelude Beat D
  lives or dies through Cycle A's 28 days; death yields a Memory Card
  for the player's deck
- **The Act 1 finale interaction** — the "YOUR NAME" Unwritten card
  reveal, the first of five player-authored cards the player will earn
  across Acts 1–5

**Out of scope:** Act 2+ content (the Engineer's Bench crafting loop,
Zephyr-9's Classroom chess, the Collector's Arena, the Thaloria
cinematic), the full Witnessing Hub Loredex expansion, any Living
Universe events triggered by Act 1 completion (those live in their
own pipeline per `apps/shared/livingUniverseEvents.ts`).

### 0.2 Reader paths

This doc is structured so three different audiences can work from it
without reading end-to-end:

- **Writers / narrative producers** read §1 (Master Index) + §2 (Voice
  Profiles) + per-battle narrative purpose sub-sections (§X.1)
- **Art / image-generation producers** read §1 + per-battle art
  sub-sections (§X.3 — opponent portrait + battlefield prompts) + §6 /
  §12 / §17 (slideshow frame prompts) + §22 (Asset Delivery Checklist)
- **Cutscene / video producers** read §1 + per-battle cutscene
  sub-sections (§X.4) + the three slideshow sections + §22
- **Audio / VO producers** read §1 + §2 + per-battle VO sub-sections
  (§X.5 with ElevenLabs CSV rows) + §22
- **VFX producers** read §21 (Act 1 VFX Library) end-to-end + the
  per-battle §X.6 sub-sections for contextual use

If you are the **engineering** reader, you already have `act1Opponents.ts`,
`celebrationTrial.ts`, `mascoteers.ts`, `apprentices.ts`, and
`mechronisProfessors.ts` in `apps/shared/`. This doc references those
as the canonical source for IDs, deck themes, and data shells. Any
discrepancy between this doc's opponent names and those files is
documented in §23.1 as canon drift — the DSFGL names win for production,
the code data shells should be updated separately.

### 0.3 Global style anchor

All Act 1 art shares a single consistent style anchor that production
must apply to every asset unless an override is explicitly specified
in a sub-section. **Copy this anchor verbatim into every Nano Banana 2
prompt's style field.**

> **Act 1 Global Style Anchor:** Hyper-realistic cinematic composition
> with a strong biographical quality — every frame should feel like
> it's been pulled from a recovered personal archive. Palette is
> warmer and more nostalgic than the Prelude's cold cyan emergency
> lighting: dominant warm gold `#fbbf24`, institutional steel grey,
> deep wood panelling, faint film-grain sepia undertone on flashback
> content. Subjects are rendered with the specificity of photographic
> portraiture even when fantastical — nothing decorative, nothing
> generic. The visual grammar is "a person remembers their life." Film
> grain. Anamorphic lens flares where warm light meets composition
> edges. 1920×1080 / 16:9 / 4K. No rendered text unless explicitly
> flagged in a sub-section. No people rendered in base room stills —
> figures are rendered as separate cutscene layers.

Act 1 is **warmer** than the Prelude. The Prelude was a corpse-ship;
Act 1 is memories of the living. Production should treat the palette
shift as intentional and resist pulling the Prelude's cold cyan into
Act 1 assets.

### 0.4 Canon hygiene rules (enforced across every Act 1 asset)

The same canon hygiene rules from the Prelude Bible §0.4 apply to
Act 1, plus five Act-1-specific additions. Violating any of these in
a VO, subtitle, or on-screen element is a canon bug that must be
caught before production ships:

1. **The Engineer is "The Prince."** Every VO line, every subtitle
   that references the young Engineer in Cycles A, B, or C uses the
   role label "Engineer" or the title "The Prince." He does not have
   a first name. See the Prelude Bible §2.1 for the full naming
   discipline — it applies identically here.
2. **Kanevas is a standard Mechronis headmaster.** Cycle B's academy
   setting cannot hint at the CoNexus machine-god reveal (Act 4+
   scope per `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §4.6). Kanevas is
   a strict, warm-but-formal headmaster. Nothing more.
3. **"Vex Solène" is the canonical name for Agent Zero** post the
   Cycle C3 transference. Use "Agent Zero" for all Cycle B and
   pre-C3 references. Use "Vex Solène" starting at Cycle C3's final
   turn when her portrait resolves for the first time. Never mix the
   two in the same frame.
4. **Eden is canonically "the garden world the Warlord destroyed as
   retaliation."** The Cycle B5 "The Seeker / Young Human" battle's
   flavor text may reference Eden as a shared memory between the
   Engineer and the young Human, but must not pre-reveal that the
   Warlord is a nanobot swarm (Act 2+ reveal per
   `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §1.6). The Human's
   recollection of Eden should be framed as "a place that no longer
   exists" without explaining why.
5. **The Programmer / Daniel Cross / The Antiquarian are the same
   person.** His voice appears in the Cycle C finale ("Last Words")
   slideshow for the first time in the game — this is the first time
   the player hears him. Canon hygiene: do NOT name him "Daniel Cross"
   in any Act 1 subtitle or VO. "The Programmer" is the Act 1 framing.
   "The Antiquarian" is reserved for post-Prelude player-facing
   framing but does not surface in Act 1 cutscene subtitles. The
   identity chain reveal lives in later Acts.
6. **Cycle A1's opponent is Minnie, the Archon of the Meme.** Per
   the 2026-04-15 production session, the canonical name for the
   Cycle A1 opponent is **Minnie**. She is the child-form of **The
   Meme** — canonically an Archon-tier entity. The `thought_virus`
   deck leaning in `apps/shared/act1Opponents.ts` is consistent with
   this: the thought_virus entity IS the Meme. Minnie is the Meme's
   child form, the Meme is an Archon, Minnie is the Archon of the
   Meme.
   - **Canonical visual:** Minnie wears **Minnie Mouse ears** —
     specifically the Disney-souvenir style ears (a black plastic
     headband with two round felt-covered ears, the kind a child
     gets at a theme park). The ears are the visual signifier of her
     Archon-of-the-Meme identity: a nostalgic corporate artifact
     worn as if it were crown jewelry. The ears are **not ironic on
     her part** — she wears them earnestly. The irony lives in the
     player's recognition, not in Minnie's self-awareness.
   - **Names to NOT use:** Do not use the DSFGL draft name "Conni the
     Conductor" in any Act 1 subtitle, VO line, or art prompt. Do
     not use the `act1Opponents.ts` placeholder name "Little Meme"
     either. Both are superseded by Minnie. Follow-up: update
     `act1Opponents.ts` in a separate code PR so the runtime
     matches production.
   - **Archon tier canonical mapping:** Minnie is the Archon of the
     Meme. She is NOT the CoNexus child form (the DSFGL Rev 6.2 draft
     conflated Conni / CoNexus / Meme; that conflation is retconned
     by the 2026-04-15 session). CoNexus remains a separate machine-
     god entity with its own Act 4+ reveal, and CoNexus has no child
     form in the Celebration schoolyard. Minnie is just the Meme.

### 0.5 What this doc does NOT duplicate

- The canonical card-game ruleset, card type system, and deck
  composition engine — those live in `apps/shared/tcg-core/` and
  `apps/client/src/game/duelyst-engine/`
- The `Act1Opponent` TypeScript interface and shell data — that lives
  in `apps/shared/act1Opponents.ts`
- The 28-day Celebration Trial decision tree and daily events — that
  lives in `apps/shared/celebrationTrial.ts` (1265 lines of structured
  data; this doc references specific day numbers but does not re-encode
  the tree)
- The Mascoteer roster and bond mechanics — `apps/shared/mascoteers.ts`
- The full Dischordia card registry — `apps/shared/tcg-core/cards/`
- The slideshow frame-playback engine — `apps/shared/songSlideshow.ts`
  and `apps/client/src/components/SongSlideshow.tsx` (the latter is
  flagged for rewrite per PR #36's NOTE(ci-green) #10)
- The existing Witnessing Song Slideshow anchor specs for Act 1's
  three slideshows — those are partially spec'd in
  `docs/production/SHIP_READY_ASSET_BIBLE.md` §3.7 and this doc
  extends / completes them rather than duplicating

Anything NOT in the list above is in scope for this doc. If you find
something that you're not sure whether it belongs in this doc or one
of the referenced files, default to adding it here and flag the
overlap in a comment.

---
