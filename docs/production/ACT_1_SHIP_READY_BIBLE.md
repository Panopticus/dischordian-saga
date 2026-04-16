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

## Section 1 — Act 1 Master Index

Act 1 is a **biography told in card battles**. The player is inhabiting
the Engineer's memories, each cycle representing a phase of his life,
each battle representing a specific person who shaped him. The 12
battles are strictly linear — unlike every Act that follows, Act 1
does not open up. The player moves through in fixed order because
biography has an order.

The three cycles and their finale slideshows are the load-bearing
structure:

- **Cycle A — Kindergarten of Gods** (Project Celebration school).
  3 battles, ends with the *Welcome to Celebration* slideshow. Runs
  in parallel with the 28-day Celebration Trial (§19) — daily
  Mascoteer decisions during those 28 days feed buffs/debuffs into
  the Cycle A card battles.
- **Cycle B — The Academy** (Mechronis). 5 battles, ends with the
  *To Be the Human* slideshow. Classmates-the-player-knows-by-name.
  Each opponent is a canonical future figure in their academy years.
- **Cycle C — Nexon, Zenon, Last Words** (War). 4 battles, ends with
  the *Last Words* master slideshow (15 frames, ~3m 30s, the first
  community-visible +500 Light Energy spike in the whole game). The
  Engineer's war, betrayal, transference into the swarm, execution.

Cycle C's third battle (C3 — Warlord Nano-Swarm inside Agent Zero) is
the canonical **mandatory forced-loss** of Act 1: the Engineer's deck
bleeds into Agent Zero's side of the board every turn, and on the
final turn the Engineer is empty while Agent Zero's board is full.
She is now Vex Solène. This is not a betrayal, it is a sacrifice. The
surviving *"Friend I Saved"* Mythic Light card is the Engineer's last
gift and will be played against Vex in Act 3 F3 when the player meets
her face-to-face for the first time.

### 1.1 Master Index table

| Battle | Cycle | Day / Phase | Opponent | Canon source | Deck theme | Card unlock | Priority |
|---|---|---|---|---|---|---|---|
| **A1** | Kindergarten of Gods | Celebration Trial Day 10 | **Minnie the Meme** (Archon of the Meme, child form) | §0.4 rule 6 | "Rent Free" forced-unison mechanics | *The Countermelody* (Common Neutral) | **P0** |
| **A2** | Kindergarten of Gods | Celebration Trial Day 20 | **Corey the Collector** (Archon of the Collector, child form) | §2 user canon + DSFGL | "Choose Your Mask" memory-card sacrifice | *The Jar That Wouldn't Close* (Rare Light) | **P0** |
| **A3** | Kindergarten of Gods | Celebration Trial Day 28 (graduation) | **Kanshi Sha the Watcher** (Archon of the Watcher, child form) | §2 user canon | "Ocularum" full-board reveal, zero hidden cards | *The First Card* (Epic Light — blank, 3 random effects on play) | **P0** |
| — | Cycle A finale | after A3 | *Welcome to Celebration* slideshow (8 frames) | §6 of this doc | — | — | **P0** |
| **B1** | Mechronis Academy | Year 1 of 4 | Young Iron Lion (17, expelled Year 650 A.A.) | DSFGL | "Last Stand" defense-stacking | *The Iron Stance* (Rare Light) | **P0** |
| **B2** | Mechronis Academy | Year 2 of 4 | Young Recruiter / Kael (joins Iron Lion a year later) | DSFGL | "The Insurgency" swarm buffs | *The Recruiter's Gift* (Epic Neutral) | **P0** |
| **B3** | Mechronis Academy | Year 3 of 4 | Young Agent Zero (future assassin) | DSFGL | "Zero Trust" stealth / one-shots | *The Weapon I Didn't Build* (Legendary Dark) | **P0** |
| **B4** | Mechronis Academy | Year 4 of 4 | Young Eyes (infiltrator, created by the Watcher) | DSFGL | "I Am the Eyes That Watch" card-peek | *The Memorized Page* (Epic Dark) | **P0** |
| **B5** | Mechronis Academy | Final year (emotional pivot) | **The Seeker** (young Human, the player's own narrator) | §2 user canon | "Deep Thoughts" long-game | *The Classmate's Compass* (Legendary Light, win) **OR** *"The only reason I stayed"* (Legendary Dark, loss) | **P0** |
| — | Cycle B finale | after B5 | *To Be the Human* slideshow (10 frames) | §12 of this doc | — | — | **P0** |
| **C1** | Nexon / Zenon / Last Words | Battle of Nexon | **Vernon Vortex — First Form** | §2 user canon | Board wipes every 4 turns (survival puzzle, not a win condition) | *The Standstill* (Epic Light — once per match, delay a loss 1 turn) | **P0** |
| **C2** | Nexon / Zenon / Last Words | fragmented encounter | **Wanda Wyrlord** (fragmented) | §2 user canon | "I Love War" attack-rush + instant-kills | *The Converter* (Legendary Dark) | **P0** |
| **C3** | Nexon / Zenon / Last Words | Engineer's transference attempt | **Warlord's Nano-Swarm (inside Agent Zero)** — MANDATORY FORCED LOSS | DSFGL + user Wanda canon | Tempo-decay + self-sacrifice — Engineer's deck shrinks 1 card/turn, lost cards go to Agent Zero's side as reinforcements against the swarm | *The Friend I Saved* (Mythic Light — renamed from *The Friend I Trusted* per rev 4 canon) | **P0** |
| **C4** | Nexon / Zenon / Last Words | New Babylon trial | **Wayne Warden** (Authority's Tribunal — Trial format) | §2 user canon | Jury cards, evidence cards, Engineer defends with his own Deck. **Elara is a card in the Tribunal's deck** | *The Last Word* (Mythic Light — triggers the Last Words slideshow on play) | **P0** |
| — | Cycle C finale | after C4 | ***Last Words*** master slideshow (15 frames, ~3m 30s, +500 Light Energy galaxy-wide) | §17 of this doc (references existing `SHIP_READY_ASSET_BIBLE.md` §3.7 frame-by-frame spec) | — | — | **P0** |
| — | Act 1 Finale | after *Last Words* | Return to the Ark Archives, player places first blank *"YOUR NAME — Unwritten"* Dischordia card on the pedestal | §18 of this doc | — | — | **P0** |
| — | **Parallel:** Celebration Trial | 28-day Mascoteer decision loop (Days 1–28) | 6 Mascoteers (Minnie + 2 optional bonus forms) + daily events | §19 of this doc | Daily decisions feed buffs/debuffs into Cycle A battles | — | **P0** |
| — | **Parallel:** Apprentice Permadeath | Days 1–28 of Celebration Trial | Apprentice assigned in Prelude Beat D | §20 of this doc | Lives or dies through Cycle A; death yields a Memory Card for the player's deck | *Memory Card* (procedurally-named Epic Light) | **P0** |

### 1.2 Totals

The Master Index table rolls up into the following delivery totals.
These numbers are the denominators the Asset Delivery Checklist (§22)
will report against.

| Category | Count | Breakdown |
|---|---:|---|
| **Card battles** | 12 | 3 Cycle A + 5 Cycle B + 4 Cycle C |
| **Master slideshows** | 3 | Welcome to Celebration (8 frames), To Be the Human (10 frames), Last Words (15 frames) |
| **New opponent portraits** | 12 | one per battle — see §2 Character Roster for visual descriptions |
| **New battlefield backgrounds** | 8 | some shared across battles of the same cycle; itemized in §22.1 |
| **Pre-battle matchup splash stills** | 12 | one per battle, composited from opponent portrait + battlefield |
| **Cutscene videos** | ~15 | per-battle intros (12) + 3 slideshow cinematics. Act 1 Finale is a single additional cutscene — see §18 |
| **New VO recordings** | TBD | enumerated per-battle in §X.5 sub-sections — estimated 40–60 lines across the 12 battles + slideshow narration |
| **New VFX assets** | TBD | enumerated per-battle in §X.6 and consolidated in §21 VFX Library |
| **UI art for Celebration Trial daily loop** | TBD | day card layouts + 28 daily event illustrations — enumerated in §19 |
| **Apprentice system UI art** | TBD | trait display, permadeath event, Memory Card reveal — enumerated in §20 |

Act 1's total new asset count will be substantially higher than the
Prelude's ~107 deliveries because of the 12 opponent portraits + 8
battlefields + 3 multi-frame slideshows. Full number will be computed
in §22.6 Summary after the per-battle sub-sections finalize their
own asset enumerations. Current estimate: **~200–300 new asset files**.

### 1.3 Scope note on the Celebration Trial and Apprentice loops

The 28-day Celebration Trial runs in parallel with Cycle A. The player
does **not** experience 28 literal days of gameplay — Cycle A compresses
the 28 days into a narrative loop of Mascoteer decision beats + three
card battles + apprentice status updates. The card battle at Day 10,
Day 20, and Day 28 are the structural anchors; the in-between days are
Mascoteer events (daily choices) and apprentice training beats
(trait-shifting events).

This doc treats the Celebration Trial and Apprentice loops as **two
separate sub-systems** within Cycle A, each with its own dedicated
section (§19 and §20 respectively). They are not battles, they are
**parallel systems feeding the battles**. Production should treat
their art assets as a distinct delivery queue from the 12-battle queue.

---
