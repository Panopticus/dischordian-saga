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

## Section 2 — Character Roster

### 2.0 Framing principle — "cosmic beings in child bodies"

Act 1 is a **simulation**. The player is inhabiting the Engineer's
memories of his own biography — not lived reality, but a reconstruction
of it running inside the Matrix of Dreams. The simulation has its own
visual rules, and the most important one is this: **when an Archon-tier
entity appears in the simulation, it is rendered as the cosmic being
*wearing* a child's body**.

The canonical justification: the Engineer's memories of his childhood
classmates were imprinted before he understood what any of them
*were*. He met them as other kids — on a swingset, in a classroom,
at a graduation ceremony. The simulation preserves that. It shows the
player what the Engineer *saw*, not what was underneath. Decades later
when the Engineer figured out that Conni-the-classmate was actually the
Archon of the Meme, his memory did not retroactively re-render her as a
cosmic entity. It kept the Minnie Mouse ears. The Minnie Mouse ears
are literally what he remembered.

This framing rule governs **every** Archon-tier character in Act 1:

- **Cycle A (Kindergarten of Gods):** all three opponents are Archons
  in child form because the simulation is literally set in a
  kindergarten (the Project Celebration school). Minnie, Corey, and
  Kanshi Sha are cosmic entities (the Meme, the Collector, the
  Watcher) wearing the bodies of seven-year-olds.
- **Cycle C1 (Battle of Nexon — Vernon Vortex "First Form"):** the
  same rule applies, but with a twist. Cycle C is the War Cycle,
  set on battlefields and trial floors — yet Vernon appears as a
  round-faced, cheerful child in an orange sun T-shirt. This is
  *intentional dissonance*. The cosmic Vortex is the being that
  wipes the board every four turns; Vernon is the child body that
  cosmic being is wearing in the Engineer's memory. The player is
  supposed to feel the disconnect — *this cheerful kid is doing
  the thing that is killing me* — and the disconnect is the beat.
  The "First Form" label on C1 refers to the first time the cosmic
  Vortex appears in the Engineer's life, which happens to be in a
  child body.
- **Cycle C2–C4 (Wanda Wyrlord, Nano-Swarm, Wayne Warden):** these
  are canonically NOT child-form Archons. The Warlord's fragmented
  form in C2 is adolescent-to-young-adult (Wanda is described as a
  cyborg *girl*, not child — see §2.11). The Nano-Swarm inside
  Agent Zero in C3 is not a character in child form at all, it is
  a swarm rendered as card-game mechanics. Wayne Warden in C4 is
  an adult tribunal figure, old enough to sit the bench.
- **Cycle B (Mechronis Academy):** the Cycle B opponents are NOT
  Archons in the first place. They are canonical *humans* (or
  human-descent entities) at their academy ages. Young Iron Lion,
  Young Kael, Young Agent Zero, Young Eyes, and the Seeker are
  all rendered as literal teenagers in blue school uniforms per
  the Mechronis Academy visual canon established by §2.9.

**The canon hygiene rule that falls out of this framing:** when
writing VO or subtitles for an Archon-in-child-body character, the
voice is the *cosmic being's voice*, not a child's voice. Minnie
does not sound like a seven-year-old. She sounds like the Meme —
ancient, viral, amused at the player's attention. The dissonance
between her visual and her voice is the emotional weight of the
encounter. Actor direction for each Archon's VO lines is carried
in the per-battle §X.5 sub-sections.

### 2.1 The Prince / The Engineer — the player's biographical subject

The player does not *see* The Prince directly during Act 1's card
battles — the player *is* The Prince, viewing the memories from
inside his head. But his visual still matters for:

- **Cycle A–C finale slideshows** (§6, §12, §17), where Prince
  appears as a cast member in the graduation photos, the Mechronis
  class portraits, the Nexon battlefield, the New Babylon trial,
  and finally the execution chamber in *Last Words*
- **Cycle B5 "The Seeker" battle** (§11), where the Prince sits on
  one side of the card table and the young Human sits on the other,
  and the camera is over the Prince's shoulder — so the back of his
  head is visible to the player for the duration of the match
- **Cycle C3 forced-loss** (§15), where the Prince's portrait fades
  as the Engineer's deck empties, and the simulation's framing of
  his identity dissolves into Vex Solène's
- **Act 1 Finale cutscene** (§18), where the player sees the Prince
  one final time — as a silhouette walking into the white frame of
  the executed/programmer reunion at the close of *Last Words*

**Canonical visual (user-provided, 2026-04-15):**

> The Prince is a young African American man with short black hair
> who wears a red steampunk trench coat.

**Production expansion for this doc:**

- **Age presentation:** Act 1 shows the Prince at three life phases
  — Cycle A (childhood, ~7 years old), Cycle B (adolescence, 15–18
  years old, Mechronis Academy uniform), Cycle C (young adult,
  early 20s to late 20s, in his canonical red steampunk trench
  coat). The canonical visual above describes the young-adult
  Cycle C form.
- **Red steampunk trench coat canonical details:** deep oxblood /
  burgundy red wool or heavy canvas, double-breasted, falling to
  mid-thigh, gold-brass filigree details along the lapels and
  cuffs (the filigree is not ornamental — it is functional neural
  lattice circuitry the Prince embedded into the coat, a foreshadow
  of the Dischordia Deck system he would build later). Visible
  brass gears or small cogwheels on the shoulder epaulettes. The
  coat is worn open, shirt underneath is a simple cream linen
  (matching the Prelude Bible §2.2 canonical wardrobe) with sleeves
  rolled to the elbow.
- **Skin tone:** medium-brown African American, warm undertones
  matching the Act 1 global style anchor's palette (§0.3). Avoid
  cool/blue undertones — the Prince is canonically a warm-palette
  character.
- **Hair:** short, black, cut close to the scalp, natural texture.
  Never straightened, never braided long — the Prince keeps his
  hair utilitarian because he spends most of his time bent over a
  workbench.
- **Eyes:** warm brown, slightly tired, intelligent. When he looks
  at something he loves (a piece of tech, a childhood memento, his
  partner) the eyes light up slightly — that light is the only
  part of his face the execution cutscene will ever take from him.
- **Facial hair:** clean-shaven in Cycle A and B, trim beard in
  Cycle C. The beard grows over the course of the war. By the
  tribunal in C4 it is slightly unkempt — he has been in custody
  for some time.
- **Child form (Cycle A):** same skin tone, same intelligent eyes,
  same warm brown hair but longer (bowl cut), wearing a simple
  beige schoolyard tunic (Project Celebration school uniform —
  NOT the later Mechronis blue uniform). Carries a small cloth
  satchel everywhere. Never without a pencil behind one ear.
- **Adolescent form (Cycle B):** the Mechronis Academy blue school
  uniform (see §2.9 for the uniform canonical spec — blue blazer,
  blue trousers, white shirt, light blue tie), worn slightly
  loosely. Already has the habit of rolling his sleeves. The
  filigree on the trench coat in Cycle C is an evolution of
  doodles he made in Mechronis schoolbook margins.

**Per-cycle wardrobe reference (for slideshow and battle production):**

| Cycle | Age | Canonical outfit | Prop |
|---|---|---|---|
| A (Kindergarten) | ~7 | Beige Project Celebration tunic, cloth satchel | pencil behind ear |
| B (Mechronis) | 15–18 | Mechronis blue blazer + trousers + white shirt + light blue tie, sleeves rolled | notebook under arm |
| C (War) | early–late 20s | Red steampunk trench coat + cream linen shirt (sleeves rolled) + dark trousers | brass-inlay data slate, small tool roll in coat pocket |

**Voice profile:** existing `the_prince` profile from
`docs/production/VOICE_OVER_BIBLE.md` Section 9 (added by Prelude
Bible §2) — no new voice profile needed for Act 1. The voice
direction shifts slightly per cycle: Cycle A uses a child-form
version (bright, un-self-aware), Cycle B uses adolescent cadence
(slightly formal, beginning to develop the aristocratic precision),
Cycle C uses the canonical adult voice from the Prelude profile.
All three are the *same actor*, same take session, different
direction passes — per the Prelude Bible §10.5's voice-continuity
instruction.

**Cross-references:**

- Prelude Bible §2 (The Prince voice profile — existing canon)
- `apps/shared/engineerRecordings.ts` (the Prince's canonical
  holographic recordings from the Prelude Beat C / E / J archives)
- `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5.6 (the full Log 5 text
  that plays in the Prelude Beat J climax and is paralleled in
  Act 1's *Last Words* slideshow)
- §0.4 rule 1 (the Prince naming discipline — canon inherited
  from the Prelude Bible)

### 2.2 Minnie the Meme — Cycle A1 opponent (Day 10)

The first boss of Act 1 and the player's first-ever scripted
Dischordia match. The player has just stepped off the tutorial
("Elara's briefing-paper knowledge" layer of Cycle A onboarding)
and sits across the card table from a seven-year-old girl in
Minnie Mouse ears who — the Engineer will not learn this for
another twenty years — is the Archon of the Meme in a child body.

**Canonical visual (user-provided, 2026-04-15):**

> Minnie the Meme has short brown hair, wears a playful mouse-ear
> headband, and is always mid-gesture, expressive and energetic.

**Production expansion for this doc:**

- **Mouse-ear headband:** canonical from §0.4 rule 6 — a black
  plastic Disney-souvenir-style headband with two round felt-covered
  ears, worn earnestly as crown jewelry. Not ironic. The felt is
  slightly nubby from being worn daily for years. The plastic
  headband has faint scuffs on the top curve. The ears are never
  off in any frame — render them even when Minnie is viewed in
  silhouette or partial profile.
- **Hair:** short brown (user canon). Bowl-cut or slightly messy
  shoulder-length — pushed under the headband so the ears sit
  cleanly on top. The hair sticks out slightly around the headband
  in tufts. Warm chestnut-brown under schoolroom lighting.
- **Face:** seven-year-old Asian-descent child, round cheeks, a
  gap between the front teeth that she shows every time she
  smiles (and she smiles often). Wide brown eyes with dark lashes.
  The eyes are the tell: they are canonically **too alert** for a
  child's eyes. When the player is paying attention they notice
  the eyes are tracking them like a camera, not like a kid.
- **Expression default:** mid-gesture, expressive, energetic (user
  canon). Minnie is never still in any frame. Render her in
  motion — hands up, mouth open mid-word, one foot slightly lifted
  as if she is about to run or spin. Even her static portraits
  should feel like the artist caught her mid-leap. The energy is
  the threat: the player will be tired and Minnie will not.
- **Outfit:** the Project Celebration school tunic in pale cream
  (the same tunic the young Prince wears in Cycle A — see §2.1),
  but Minnie's is covered in fabric-marker drawings she has done
  herself. Smiley faces, hearts, a crude picture of the other
  classmates as stick figures with labels, a recurring motif of
  three eyes arranged in a triangle (foreshadow — she is friends
  with Kanshi Sha the Watcher in the simulation). Scuffed sneakers,
  mismatched socks. Small cloth satchel worn cross-body.
- **Body language:** she gestures with her entire body. When she
  speaks she uses both hands, palms out, fingers splayed. When the
  player plays a card she leans forward over the table eagerly.
  When she plays a card she slams it down with theatrical conviction.
  Every motion is *performance*.

**Voice direction (Meme Archon in a child body):**

Per §2.0's canon hygiene rule, Minnie's voice is NOT a child's
voice. It is the Meme — ancient, viral, amused at the player's
attention. The delivery should sound like a 35-year-old content
creator in her prime delivered through a child's vocal tract,
which is exactly what it is. The voice never drops into child
babble or high-pitched squeals. It stays smooth, confident,
slightly-too-articulate-for-a-seven-year-old, with a performative
cadence that feels like she is always about to post. The Prelude's
Human voice profile gave us the template for "ancient presence in
a containing form"; Minnie is the inversion — a recent-cosmic
presence (the Meme is canonically a young Archon, not old) in a
containing body she enjoys more than she needs.

Per `docs/production/VOICE_OVER_BIBLE.md` no existing Meme voice
profile currently exists. A new voice profile **`the_meme_child`**
should be added — voice direction and ElevenLabs parameters are
enumerated in §3 (the Cycle A1 battle section) below.

**Canonical pre-match line** (from `apps/shared/act1Opponents.ts`
`little_meme.preMatchLine`, to be renamed to `minnie_meme` in the
code cleanup PR noted in §0.4 rule 6):

> *"Let me see. Let me see. Let me see. I am going to see it whether
> you show me or not."*

Delivered in three different intonations over the three "Let me
see"s — first as playful wheedling, second as mock-exasperated,
third as a flat observational statement that is not a request.
The player should register that the third delivery is the real
Minnie under the other two.

**Deck theme:** "Rent Free" forced-unison mechanics. Her cards
force the player's cards to play the same action she plays on her
own turn. She does not take the player's turn — she *shares* it.
The player fights by desynchronizing. This is the Meme's combat
signature: viral pattern entrainment.

**Card unlock on win:** *The Countermelody* (Common Neutral) — a
card that, when played, forces an opponent's unison-forced card
out of sync for one turn. The player's first tool against viral
mechanics.

**Post-match canonical beats** (from `act1Opponents.ts`):

- **Win:** Minnie's viral chant stalls for a single second. In that
  second the Engineer finishes his card. The stall is visible — a
  half-frame of Minnie frozen mid-clap, every classmate frozen
  with her, the Prince's pencil tapping his card on the "one"
  beat that broke the pattern.
- **Loss:** Minnie laughs and laughs. The Engineer is fine. He is
  always fine, except the one time. The loss line is a
  foreshadow to Cycle C — the "one time" the Engineer is not fine
  is the tribunal. The player won't catch this until they get to
  C4 and the callback lands.

**Cross-references:**

- §0.4 rule 6 (Minnie canonical naming + mouse-ear detail)
- §2.0 (simulation framing — Archons in child bodies)
- §3 (Cycle A1 battle section — full battle spec)
- §6 (Welcome to Celebration slideshow — Minnie appears in the
  graduation photo final frame)
- `apps/shared/act1Opponents.ts` `little_meme` data shell (to be
  renamed `minnie_meme` in a follow-up code PR)
- `apps/shared/celebrationTrial.ts` Day 10 event (the Mascoteer
  trial beat that feeds into the A1 card battle)

### 2.3 Corey the Collector — Cycle A2 opponent (Day 20)

The second Cycle A boss and the player's first exposure to a
**masked** Archon. Corey never shows his face. In Cycle A the mask
reads as kid-stuff, an elaborate costume piece a seven-year-old
insisted on for picture day. Later in the biography — specifically
in Cycle B when the player fights Young Eyes, and in the Act 2
Thaloria cinematic when Curator Halverez appears — the player will
recognize the same mask on different bodies and realize that the
Collector Archon has been wearing it across the entire timeline.
Corey is the **first time** the player sees the Xenomorph mask in
the Engineer's memories, which makes him the canonical origin of
the mask motif.

**Canonical visual (user-provided, 2026-04-15):**

> Corey the Collector wears a shiny blue Xenomorph-style mask that
> hides his face completely, with a cloak full of pouches.

**Production expansion for this doc:**

- **The Xenomorph mask:** a full-face shell rendered in **shiny
  cobalt-blue** — glossy plastic / polished composite, reflective
  enough to catch the schoolroom's warm amber light as cool blue
  highlights along the dome. The mask is H.R. Giger Xenomorph shape
  (elongated skull, no visible eye holes, mandibular contour along
  the jaw) shrunk down to child proportions and softened slightly
  so it reads as *costume* to an adult viewer but *real* to another
  child. The mask is seamless — no visible straps, no hinge, no
  way it came on. **No facial features are ever visible underneath**,
  even when Corey tilts his head or bends over a card. Render the
  mask's interior as impenetrable black, never a hint of skin. The
  mask's motif recurs exactly on Curator Halverez in the Act 2
  Thaloria cinematic per `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §3
  — production must preserve the shape and material for continuity.
- **The cloak full of pouches:** a floor-length child's cloak,
  deep midnight-purple velveteen (off-the-rack kid Halloween-costume
  material, not quality fabric). The cloak is **covered** in small
  cloth pouches stitched directly into the outer layer — forty to
  fifty pouches of varying sizes, some tiny (thumb-sized), some
  hand-sized, arranged asymmetrically over the cloak's surface. Each
  pouch is drawstring-tied with faded ribbon in a different color.
  When Corey moves, the pouches clink and rustle faintly (render
  motion blur on the smallest pouches during Seedance 2.0 shots).
  **Every pouch contains something** — a marble, a paper scrap, a
  tooth, a dried leaf, a folded note, a single coin, a pressed
  flower, a lock of hair. The player never sees inside any pouch
  in Cycle A. In the Cycle A finale slideshow (§6) one pouch is
  visible mid-fall, the contents catching the light — canonical
  pouch-contents list is in §6's frame-by-frame spec.
- **Body / stature:** small for seven years old. The cloak is
  slightly too big for him, the hem dragging on the floor behind
  him when he walks. The Xenomorph mask looks massive on the
  narrow shoulders. Posture is hunched forward protectively over
  his cards — the child-body language of someone who is guarding
  his collection.
- **Hands:** the only skin visible on Corey. Rendered as the same
  medium-brown as the Prince's (Corey is canonically African
  American in child form, matching the adult Curator Halverez's
  skin tone for continuity). Hands are always slightly dirty —
  ink-stained fingers, a scab on one knuckle, nails bitten down.
  When he plays a card his hand emerges from under the cloak, sets
  the card with surgical precision, and retreats back under. The
  hand is the player's only window into his mood.
- **Outfit underneath the cloak:** the same cream Project Celebration
  school tunic as the other children, **but soaking wet** — as if
  Corey was caught in a rainstorm on the way to class and never
  dried off. The wetness is a canon detail, not a mistake: the
  Collector Archon's child-form carries water on him because water
  is how his pouches' contents stay preserved. Do not render the
  wetness as dramatic dripping — it's just a persistent damp to
  the fabric, slightly darker than the other children's tunics.
- **No voice yet:** Corey **does not speak aloud** in the Cycle A
  card battle. His pre-match line is text-only, rendered on the
  matchup card in his handwriting (see below). The mask never moves.
  The cloak never opens. The only sound Corey makes is the faint
  pouch-clink when he shifts. This is canonically one of the two
  **wordless opponents** in Act 1 (the other is C3's Nano-Swarm
  in Agent Zero). Voice direction note: the Collector Archon's
  full voice debuts in Act 2's Thaloria cinematic; Cycle A's
  silent framing is the anti-reveal, the first time the player
  senses an entity that refuses to be heard.

**Canonical matchup-card line** (from `apps/shared/act1Opponents.ts`
`little_collector.preMatchLine`, to be renamed to `corey_collector`
in the code cleanup PR noted in §0.4 rule 6):

> *"I will take your tears and your laughter both. They are both
> currency where I am going."*

Rendered as **Corey's own handwritten text** on the in-game matchup
card — cursive script in faded blue ink, slightly crooked, the
hand of a precocious seven-year-old practicing adult penmanship.
Render the text fully legibly on the matchup splash still (this is
one of the few places in Act 1 where rendered text is canonical and
required; the other is Cycle C4's tribunal evidence cards). No
audio — the line is read by the player from the card, not spoken
by Corey.

**Deck theme:** "Choose Your Mask" memory-card sacrifice. Corey's
mechanic forces the player to discard a card from their hand each
turn — but the player chooses **which** card, and the discarded
card becomes a "mask" that Corey plays on his own side of the
board, wearing it as one of his cards. The player's discards
become the opponent's deck. The cost-benefit pivot is: which cards
do you want to *give* him? The tutorial lesson is "your sacrifices
shape his power," which is the entire Collector Archon's gameplay
signature across every future encounter.

**Card unlock on win:** *The Jar That Wouldn't Close* (Rare Light) —
a card that, when played, lets the player permanently remove a
card from their opponent's discard pile. The first card in the
player's collection that interacts with "things the opponent has
already let go of." Canonical reflection of the win-state beat:
the jar cracks, Corey picks up the pieces.

**Post-match canonical beats** (from `act1Opponents.ts`):

- **Win:** The jar cracks. Corey picks up the pieces and promises
  not to forget. The "jar" is visible on the card table as a
  prop — a small glass jar sitting beside his deck, rendered
  throughout the battle. On win, it splits along a visible hairline
  crack. Corey silently gathers the glass shards into one of his
  cloak pouches (a new, previously-empty pouch). The promise is
  text-only on the post-match splash: *"I will not forget."* in
  the same blue-ink handwriting as the pre-match line.
- **Loss:** Corey's jar grows by one. Canonically this means a
  new pouch has appeared on the cloak — one that wasn't there
  at the start of the match. The new pouch contains the player's
  "specific attention" (per the code comment: "his favorite
  flavor"). The loss splash shows a close-up of the new pouch
  being cinched shut by Corey's small dirty hand. No text.

**Cross-references:**

- §2.0 (simulation framing — Archons in child bodies)
- §4 (Cycle A2 battle section — full battle spec)
- §6 (Welcome to Celebration slideshow — Corey appears in the
  graduation photo, mask still on, cloak pouches visible)
- Prelude Bible cross-reference: the Collector is one of the
  Antiquarian's "three Insurgency figures harvested for their
  patterns" (per `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §3) —
  Cycle A2 is the player's first encounter with the harvester
- `apps/shared/act1Opponents.ts` `little_collector` data shell
  (to be renamed `corey_collector` in the follow-up code PR)
- `apps/shared/celebrationTrial.ts` Day 20 event
- Act 2 Thaloria cinematic canon: Curator Halverez wears the
  adult-form version of this same Xenomorph mask (per
  `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §3 and DSFGL line 2438) —
  the mask is the single continuity signifier across the two
  appearances and must be rendered identically

### 2.4 Kanshi Sha the Watcher — Cycle A3 opponent (Day 28, graduation)

The third Cycle A boss and the last card battle before the *Welcome
to Celebration* slideshow fires. Day 28 of the Celebration Trial —
graduation day. Kanshi Sha is the child-form of the Watcher Archon,
canonically present at every Cycle A event the player has seen, and
at sixteen previous simulation runs the player has not. He has
watched this schoolyard die and re-form sixteen times. This is the
seventeenth. When the player sits down across from him they are
not just fighting another kid — they are fighting the only entity
in the Engineer's memories who has been watching the Engineer
since before the Engineer had memories to record.

**Canonical visual (user-provided, 2026-04-15):**

> Kanshi Sha the Watcher is a slender Japanese boy in all-white
> streetwear with glowing lines, his "all-seeing eye" graffiti tag
> sometimes visible behind him like a magical aura.

**Production expansion for this doc:**

- **Physique and presentation:** seven-year-old Japanese boy, tall
  for his age and unusually slender — long thin limbs, narrow
  shoulders, a delicate neck. Rendered with photographic specificity:
  straight black hair cut in a clean Japanese schoolboy style
  (mushroom cut with a straight fringe just above the eyebrows).
  Warm pale skin, dark almond-shaped eyes, a small mole under his
  left eye. The face should read as *gentle* — not stern, not
  creepy, not "evil child." Kanshi Sha looks like a kid who would
  help you tie your shoes. The horror is not in his face.
- **All-white streetwear:** this is the canonical override of the
  code's "half-finished white mask" detail (from `act1Opponents.ts`
  `little_watcher.backstory`) — **Kanshi Sha does NOT wear a mask**.
  The mask motif belongs to Corey (§2.3). Kanshi Sha's canonical
  visual signature is the streetwear, not the mask. Specifically:
  - Oversized white hoodie (child-sized large, hanging off his
    frame), drawstring hood worn down
  - White cargo joggers, also loose-fitting
  - Clean white sneakers with white laces
  - White crew socks visible above the sneakers
  - No visible logos, no brand marks, no accessories — every
    garment is *pure white*, almost institutional. Think "blank
    canvas meets Tokyo Harajuku streetwear meets Project Celebration
    uniform override"
- **Glowing lines:** faint electric-white lines trace along seams
  and folds of the streetwear — hood edges, hoodie cuffs, jogger
  side-stripes, sneaker soles. The lines pulse at sub-1 Hz (slower
  than a heartbeat, matching the breath-pulse rhythm from the
  Prelude Bible §18.1 for visual continuity). When Kanshi Sha is
  watching something specific (the player's hand, a card they just
  played) the lines on his hoodie cuffs pulse slightly brighter.
  The lines are canonically **the Watcher Archon's surveillance
  nervous system externalized** — a physical visualization of what
  the cosmic Watcher is tracking at any given moment. Rendered as
  faint glow-edge shader overlays with a soft bloom, color `#e0f2fe`
  (a very pale cool cyan, slightly bluer than the Prelude's warmer
  cyan — a visual distinction that marks Watcher-light apart from
  emergency-strip-light).
- **The "all-seeing eye" graffiti tag aura:** an environmental VFX
  rather than a costume element. When Kanshi Sha is intensely
  focused on the player (pre-match stare, mid-match card
  evaluation, post-match loss reveal), a large spray-painted
  **eye-shaped graffiti tag** blooms on the wall or background
  behind him — rendered as if someone has just finished spraying
  it in the last half-second. The tag is stylized: a single
  enormous eye with an elongated almond shape, a small triangular
  pupil, radiating straight lines around it like a sun ray motif.
  The tag color is matte black with white glow-edge (consistent
  with the streetwear lines). The tag is NOT always visible —
  per user canon "sometimes visible... like a magical aura." Render
  it in the pre-match matchup splash, in one mid-match beat when
  Kanshi Sha first uses an Ocularum card, and in the post-match
  splash. See §5 Cycle A3 battle spec for the exact timing.
- **Posture and body language:** **preternaturally still** — the
  opposite of Minnie's (§2.2) mid-motion energy. Kanshi Sha sits
  with his hands folded in his lap, head slightly tilted as if
  listening to something very far away. He does not fidget. He
  does not adjust his hoodie. He does not look away from the
  player's eyes between card plays. When he plays a card he moves
  his hand from his lap to the table in a single economical
  gesture, sets the card precisely, and returns his hand to his
  lap. The stillness is the signal. When it *breaks* — which it
  does, once, at the end of the battle — the player should notice
  immediately.
- **Voice direction (Watcher Archon in a child body):** per §2.0's
  canon hygiene rule, Kanshi Sha's voice is not a child's voice.
  It is the Watcher — calm, observational, older than any human
  child could be. Slightly Japanese-inflected English (matching
  the character's ethnicity and the Mechronis setting's
  cosmopolitan mix). Cadence is even and almost meditative. He
  never raises his voice. He never drops into excitement. Every
  sentence lands with the weight of being witnessed, which is the
  Watcher's entire thing — by speaking to you he is *recording*
  you, and you feel it.

  No existing Watcher voice profile currently exists in
  `docs/production/VOICE_OVER_BIBLE.md`. A new voice profile
  **`the_watcher_child`** should be added. ElevenLabs parameters
  target: `stability: 0.80` (high — the Watcher is consistent
  across all samples), `similarity_boost: 0.85`, `style: 0.15`
  (very low stylization — he is almost documentary), with a
  subtle recording-artifact layer of 0.1 applied to the whole
  voice to reinforce the "he is recording you" sensation.

**Canonical pre-match line** (from `apps/shared/act1Opponents.ts`
`little_watcher.preMatchLine`, to be renamed to `kanshi_sha_watcher`
in the code cleanup PR):

> *"I have been watching. I will watch this too. I have watched
> sixteen versions of you already."*

Delivered with the Watcher's even cadence, no emphasis on any
particular word. The "sixteen versions" line is canonically
literal — the Engineer's simulation has been run sixteen times
before this playthrough, and the Watcher has been present in all
of them as an observer. This is the **first canonical hint in the
player-visible game that the simulation is not the player's first
run**. The player won't have context for this yet; it is a seed
for the Act 5+ simulation-awareness reveal and must land matter-
of-factly. Do not punch the line. Let the player wonder.

**Deck theme:** "Ocularum" full-board reveal — every card in the
player's hand is visible to Kanshi Sha from the start of the match,
and every card the player draws is revealed to him as it's drawn.
Zero hidden information. The player cannot bluff. The gameplay
pivot is that the player must play cards whose **on-play effects**
matter more than their bluff value — because the Watcher knows
what's coming but cannot change the outcomes the player chooses.
This is the Watcher Archon's signature mechanic and recurs on
every future Watcher-adjacent opponent (Young Eyes in Cycle B4 is
a derivative, the Act 3 "I Am the Eyes That Watch" slideshow
reuses the mechanic as a narrative device, and the full
Ocularum combat system is explored in later acts).

**Card unlock on win:** *The First Card* (Epic Light — blank, 3
random effects on play). A canonically blank card with no printed
value or effect text — when played, three random effects resolve.
This is the **first blank Dischordia card the player ever owns**,
and it is a deliberate foreshadow of the Act 1 Finale's *"YOUR
NAME" — Unwritten* player-authored card (§18). Both are blank
because blank cards are the ones the player will make their own.
The Engineer canonically crafted this card from the residue of the
Watcher's defeat — he took an unwritten sliver of the simulation's
observation substrate and printed it onto a Common card blank.
Render the card art as a plain schoolyard paper card with the
eye-graffiti motif faintly visible in the background.

**Post-match canonical beats** (adapted from `act1Opponents.ts` —
the original code text used mask imagery; this doc adapts them to
fit the user-canon streetwear-and-aura visuals without changing
the emotional beat):

- **Win:** The glowing lines on Kanshi Sha's streetwear **dim for
  a full second**. The graffiti eye-tag behind him fades from the
  wall until the wall is just a wall again. For one frame his
  face is just a child's face — small, tired, about to cry. He is
  seven years old. He is alone. He has watched sixteen friends
  graduate without him. Then the lines flicker back on. The eye-
  tag returns. The moment is gone. The player has seen something
  Kanshi Sha will not let anyone else see, and they will not see
  it again until Act 5.
- **Loss:** The eye-graffiti tag behind him **blooms to full
  intensity** — the largest it gets in the entire match. The
  glowing lines on his streetwear pulse a single bright pulse
  and hold at peak. He does not move. He does not speak. He is
  still watching. You do not see his face clearly because the
  tag's glow is washing it out — nobody who has lost to Kanshi
  Sha has ever seen his face clearly, because the Watcher never
  gives you that vulnerability unless you earn it with a win.
  The player moves on to the *Welcome to Celebration* slideshow
  carrying the memory of being observed by an entity they could
  not quite see.

**Graduation-day mechanic:** per `act1Opponents.ts.little_watcher.postBattleSlideshow = "welcome-to-celebration"`,
the A3 battle resolves directly into the *Welcome to Celebration*
slideshow (§6). There is no intermediate beat — the card table
dissolves, the graduation-photo setup assembles around it, and
the slideshow fires. Production should chain the battle's
post-match splash directly into the slideshow's first frame
with a single cross-fade.

**Cross-references:**

- §2.0 (simulation framing — Archons in child bodies, "sixteen
  versions" is the canonical hint at simulation recurrence)
- §5 (Cycle A3 battle section — full battle spec including the
  eye-tag environmental VFX timing)
- §6 (*Welcome to Celebration* slideshow — fires directly on A3
  resolution, Kanshi Sha appears in the graduation-photo final
  frame standing precisely-still in the back row)
- §18 (Act 1 Finale — *"YOUR NAME" — Unwritten* card; *The First
  Card* from Kanshi Sha's defeat is its canonical prototype)
- `apps/shared/act1Opponents.ts` `little_watcher` data shell (to
  be renamed `kanshi_sha_watcher` in the follow-up code PR);
  backstory field needs the mask reference removed to match the
  user-canon streetwear-and-aura visuals
- `apps/shared/celebrationTrial.ts` Day 28 graduation event
- Cycle B4 Young Eyes (§2.7 — child created by the Watcher per
  DSFGL, canonically a derivative of Kanshi Sha's surveillance
  nervous system)
- Act 3 opening slideshow *"I Am the Eyes That Watch"* per
  `docs/production/SHIP_READY_ASSET_BIBLE.md` §3.7 —
  canonically the adult-form evolution of the Watcher Archon's
  child-form mechanics established here

### 2.5 Young Iron Lion — Cycle B1 opponent (Mechronis Year 1)

The first Cycle B boss and the player's first Mechronis Academy
match. The player has advanced from the Project Celebration
kindergarten into the academy's lower form, and the Engineer is
now fifteen years old. The opponent is a seventeen-year-old upper-
form student who will canonically be **expelled from Mechronis
in Year 650 A.A.** for fighting. The Engineer knows who Iron Lion
is going to become long before the expulsion happens; this battle
is the player experiencing the Engineer's *before* memory of the
man the Insurgency will one day call a founding general.

**Canonical visual:** INFERRED per user direction (§0.4 / user
guidance "Infer" for Cycle B opponents), anchored to the Mechronis
Academy blue uniform canon established by §2.9 (The Seeker).

**Production-inferred visual spec:**

- **Age:** seventeen. Lanky-muscular teenage build, taller than
  most of his classmates. Broad shoulders that haven't quite
  filled out, a compact fighter's stance from above the waist,
  still-slightly-awkward limbs below. Ectomorph-mesomorph mix
  (think "high-school wrestler two years into training").
- **Skin:** medium-dark warm brown, West African descent. A
  small pale scar across his left cheekbone — canonically from a
  fight earlier in the year that already should have gotten him
  expelled but didn't.
- **Hair:** short natural curls on top, faded at the sides and
  back — an early version of the haircut he'll wear as an adult
  in later acts. Neat when he woke up, slightly mussed by the
  time the player sits across from him.
- **Eyes:** alert amber-brown, heavy-lidded in a way that reads as
  "sizing you up" rather than "tired." Quick to track motion. When
  the player plays a card his eyes flick to the card, not to the
  player's face — a fighter's read.
- **Mechronis blue uniform, worn rebelliously:**
  - Blue blazer (the same royal-blue wool that is the Mechronis
    canonical uniform — see §2.9 for the full uniform spec) worn
    open, two buttons undone
  - Light blue tie canonically present but **loosened** to mid-
    chest, never straightened
  - White oxford shirt, sleeves rolled to the forearms (mirroring
    the Prince's own sleeve-rolling habit — a foreshadow of the
    fact that Iron Lion and the Prince became friendly at
    Mechronis despite the two-year age gap)
  - Blue wool trousers, creased but not pressed fresh that morning
  - Black leather school shoes scuffed at the toes
- **The lion detail (canonical iconography planting):** on his
  blazer lapel, a small **brass lion pin** — heirloom-quality, a
  couched lion in profile with one raised paw. Render it visible
  but not emphasized. This is the canonical origin of the "Iron
  Lion" identity: he is already wearing the symbol at seventeen,
  before anyone has called him by that name. The pin must be
  present in every rendering of Young Iron Lion in Act 1 (battle
  splash, slideshow cameos, matchup card). Its adult-form evolution
  is the armored lion sigil the full-grown Iron Lion wears across
  his chest in the Act 3 Trade Empire faction content.
- **Hands:** visible scrapes on the knuckles of both hands.
  Canonical — he's been fighting. A small healing split on the
  third knuckle of his right hand, two or three days old. When
  he plays a card the scraped knuckles are visible in the
  close-up shot.
- **Posture:** when standing, feet planted shoulder-width, chin
  up, shoulders squared. When sitting (he is sitting for the
  card battle), he leans slightly forward over the table, forearms
  resting on the edge. He does not relax into the chair. He is
  never *settled*, even at rest.
- **Voice direction:** seventeen-year-old West African teenager,
  natural voice in the adolescent-baritone range (his voice has
  finished cracking but is still settling). Slight Nigerian-
  accented English, softened by academy elocution training but
  not erased. Cadence is measured and a half-beat slower than
  his peers — he thinks before he speaks, which is unusual for a
  teenager who fights as much as he does, and that thinking is
  the first hint that Iron Lion is going to become a canonical
  Insurgency **strategist**, not just a brawler.

  No existing Young Iron Lion voice profile exists. A new voice
  profile **`young_iron_lion`** should be added to
  `docs/production/VOICE_OVER_BIBLE.md`. ElevenLabs parameter
  target: `stability: 0.65`, `similarity_boost: 0.80`,
  `style: 0.25` (modest stylization — the accent carries the
  character, not theatrical flourish).

**Canonical pre-match line** (INFERRED — no text exists in
`act1Opponents.ts` for the Cycle B opponents that matches the
DSFGL naming; production should use this line as the primary
audio take, and the code shell should be updated to match):

> *"You're fifteen. I'm seventeen. Two years from now I'll be
> expelled and you'll be in Curator Halverez's office defending
> me in writing. Let's play anyway. It'll be a good memory."*

Delivered with a slight wry smile — not cocky, not performative.
Young Iron Lion is canonically **aware the Engineer is going to
be the one to intercede for him in the future.** He is
foreshadowing the friendship that is already forming. The line
lands as a promise, not a threat.

(Canon note: the "Curator Halverez's office" reference seeds
§2.3's Xenomorph-mask continuity by naming the Collector Archon's
adult form in a line the player won't yet understand the weight
of. The callback resolves in Act 2's Thaloria cinematic.)

**Deck theme:** "Last Stand" defense-stacking. Iron Lion's deck
is built around stacking defensive buffs on his general until
the general becomes nearly unkillable, then wearing the player
down through attrition. The tutorial lesson is "some opponents
win by *not losing*" — Iron Lion never has to kill the player's
general, he just has to survive long enough for the player to
run out of cards. The player must learn to play aggressively
into a wall, which is a combat pattern they will see again in
Cycle C1 (the Vortex survival puzzle, §2.10) for a different
reason.

**Card unlock on win:** *The Iron Stance* (Rare Light) — a card
that, when played, grants the player's general a stacking
defensive buff each time they successfully draw a card. The
player's first "tank" tool. Canonically the Engineer designed
this card as a tribute to Iron Lion after the expulsion — a way
of remembering the lesson even after the friend had left.

**Post-match canonical beats** (INFERRED, production-writable):

- **Win:** Young Iron Lion's defensive wall finally cracks on
  the penultimate turn. The general goes down. Iron Lion looks
  at the empty board, then at the Prince, and laughs — genuinely,
  not bitterly. He says *"You thought your way past it. I knew
  you would."* He offers the Prince a handshake across the card
  table. The Prince takes it. The scrape on Iron Lion's third
  right knuckle is visible in close-up as the hands clasp. The
  lion pin on the blazer is in frame. The slideshow engine
  does not fire; the player continues to B2.
- **Loss:** Young Iron Lion's defensive wall holds. The player's
  cards run out. Iron Lion sits forward, looks at the empty
  hand across from him, and says *"It's fine. I'll teach you
  what I know. Next time will be different — I'll even go easy
  on you for the first two turns."* He means it. The loss is
  allowed and the game continues to B2 as if the player had
  won — Cycle B's battles canonically have **no fail state**
  for the Engineer's memory. Iron Lion and the Prince became
  friends either way.

**Cross-references:**

- §2.0 (simulation framing — Cycle B opponents are NOT Archons,
  they are canonical humans at their academy ages)
- §2.9 (The Seeker — the canonical Mechronis blue uniform
  anchor that §2.5's inferred outfit derives from)
- §7 (Cycle B1 battle section — full battle spec including the
  handshake animation, the brass lion pin macro shot, and the
  scraped-knuckle close-up)
- §12 (*To Be the Human* slideshow — Young Iron Lion canonically
  appears in the Mechronis class photo "already expelled" per
  DSFGL line 2458, rendered as a silhouette standing apart from
  the class)
- DSFGL line 2444 Cycle B table row (the canonical source for
  "Young Iron Lion (17, expelled Year 650 A.A.)")
- `apps/shared/act1Opponents.ts` Cycle B1 shell (current code
  name is placeholder `the_detective_student` per the code read
  at 21ac27e7; to be renamed `young_iron_lion` in the follow-up
  code PR — noted as canon drift in §23.1)
- Act 3 Trade Empire faction content: the adult Iron Lion wears
  the same brass lion motif enlarged as the faction sigil across
  his chest (flagged for art continuity in §23)

### 2.6 Young Recruiter / Kael — Cycle B2 opponent (Mechronis Year 2)

The second Cycle B boss and canonically the most narratively
loaded battle in the entire academy sequence. The opponent is
**Kael** — the future Insurgency recruiter, the man who compiled
the 213-contact ledger the player opened in the Prelude's Beat F,
the man the Prince addressed the Cycle C "to Kael" farewell to
in Log 5 Movement 4, and the man the Human has been unable to
name in the Prelude's Galley sandwich line and Empty Chair breath
beat. This is the first time the player sees Kael alive in the
Engineer's memory. He is sixteen years old, one year younger than
Iron Lion, and he has just followed Iron Lion to Mechronis
Academy — "joins Iron Lion a year later" per DSFGL line 2445.

**The B2 battle has a canonical structural double-reveal:** during
the match, a fragment of Kael's voice from the Prelude's Beat I
Tower Defense recordings plays in the background — the second
reverse-chronology Kael fragment from the questline. Per DSFGL
line 2378: *"This is the moment the player realizes the voice in
the Tower Defense recordings IS the Recruiter they are facing on
the card board."* The player has heard Kael before (in Beat I's
Tower Defense waves); now they are sitting across from the young
version of that voice. The recognition is the beat.

**Canonical visual:** INFERRED per user direction, anchored to
the Mechronis blue uniform and informed by the Prince's
biographical memories of Kael as documented in `CANON_REV_7_
ORACLE_VEX_EXPANSION.md` §5.4 (Audio Log 3 "The List I Am On")
and the Prelude Bible §10.5 (the toy soldier flashback).

**Production-inferred visual spec:**

- **Age:** sixteen. Lean athletic build, slightly shorter than
  Iron Lion but more graceful in posture. He moves like someone
  who is used to being watched and has learned to let people
  watch.
- **Skin:** light olive-brown, Middle Eastern descent (canonical
  inference from the Prelude's "childhood palace" references —
  Kael grew up in a palace culture per the Engineer's Log 5
  Movement 4 farewell context). Smooth, no scars — Kael does not
  fight. He talks.
- **Hair:** thick, dark brown, slightly wavy, swept back from the
  forehead in a way that looks effortless and is probably not.
  Falls to his collar. He pushes it out of his eyes with a
  habitual two-finger gesture that the player will see three
  times during the match.
- **Eyes:** warm hazel, bright with intelligence and a steady
  directness that reads as "I see exactly who you are and I'm
  going to like you anyway." When he looks at the Prince across
  the card table the camera should catch a specific quality:
  Kael is **interested**. Not predatory, not calculating —
  genuinely interested in the other person. This is the
  Recruiter's gift. People follow him because he looks at them
  like they matter.
- **Mechronis blue uniform, worn with personality:**
  - Same royal-blue blazer as Iron Lion (§2.5), but buttoned
    properly, pressed, lint-rolled — Kael takes care of his
    appearance
  - Light blue tie worn at full length with a neat knot
  - White oxford shirt, **sleeves NOT rolled** (contrast with
    Iron Lion and the Prince — Kael is formal where they are
    informal)
  - Blue trousers pressed with a sharp crease
  - Clean black shoes
  - One personal touch: a small **woven friendship bracelet** on
    his left wrist, visible when his sleeve rides up during card
    plays. Three colors: red (the Prince's coat color), amber
    (Iron Lion's lion-pin brass), and dark green (Agent Zero's
    future Insurgency affiliation). Kael made this bracelet for
    himself. The player will not understand the color choices
    until they meet all three as adults in later acts. Canon
    seed, not a reveal — render the bracelet clearly but do
    not label the colors
- **Smile:** Kael smiles **often**. His smile is the single most
  recognizable thing about him — warm, slightly lopsided, showing
  teeth on the left side more than the right. When the player
  sees the adult Kael's photo in later-act dossiers, the smile
  is the continuity signifier (the same way Iron Lion's brass
  pin is his). Render the smile in the pre-match splash, the
  post-match splash, and at least two mid-match card-play
  moments.
- **The toy soldier:** Kael carries a small cast-metal toy soldier
  in his blazer breast pocket — the same toy soldier from the
  Prelude Bible §10.5 (the one the Prince kept on every desk and
  the holographic flashback showed the Prince holding). In Cycle
  B2 the toy soldier is still Kael's — he has not yet given it
  to the Prince. Render it as a 5cm glint of metal peeking from
  the breast pocket, barely visible unless the player is looking
  for it. Canon continuity: the player who noticed the toy
  soldier in Beat E's Mess Hall flashback will recognize it here.

**Canonical pre-match line** (INFERRED):

> *"I already know your name. I've been reading your class
> reports since you were twelve. You build things that shouldn't
> work and then they work. I want to ask you something after we
> play — it's not about the game."*

Delivered with Kael's warm directness, the smile present in the
voice. The "I want to ask you something" is the seed for the 213
recruitment — Kael is already scouting. The player who remembers
the Prelude's Beat F "213 entries" line will feel the hair on
their neck stand up: they are watching the Engineer get recruited,
in real time, by the man who will build an entire resistance
network from conversations like this one.

**Deck theme:** "The Insurgency" swarm buffs. Kael's deck uses
low-cost units that individually are weak but collectively buff
each other exponentially — the more units on the board, the
stronger each one gets. The deck is the Insurgency in miniature:
no single powerful card, just many small ones that believe in
each other. The tutorial lesson is "some opponents win by being
many" — the counter is precision removal of key buff-carriers
before the swarm reaches critical mass.

**Card unlock on win:** *The Recruiter's Gift* (Epic Neutral) —
a card that, when played, copies the last card the opponent
played and adds it to the player's hand. Kael's canonical gift:
he gives the player the tools the opponent was using against
them. The card name is a direct echo of his role.

**Post-match canonical beats** (INFERRED):

- **Win:** Kael's swarm thins as the Prince picks off the buff
  carriers. The last unit standing is a single 1/1 that looks
  across the empty board and shrugs. Kael laughs — same warm
  lopsided smile — and says *"You found the one I forgot to
  protect. That's exactly the answer I was looking for."* He
  reaches into his breast pocket, pulls out the toy soldier,
  and sets it on the table between them. *"Second-favorite. But
  you should have it."* The Prince takes the soldier. The
  camera holds on the soldier in the Prince's hand — the same
  12cm metal figure from Prelude Beat E's flashback, but 30
  years younger and unpainted.
- **Loss:** Kael's swarm overwhelms. The board is covered. The
  Prince looks at the army of small cards facing him and Kael
  says *"They're not mine. They're each other's. That's the
  trick."* He smiles, pushes the toy soldier across the table
  anyway — win or lose, the soldier changes hands. *"You'll
  understand when you're older. I'm not being patronizing — I
  mean it literally. You will understand when you are older."*
  This line is a canon seed for Log 5 Movement 4's "the first
  card Kael ever played against me" callback. Either outcome
  delivers the soldier to the Prince.

**Cross-references:**

- §2.0 (simulation framing — Cycle B opponents are canonical
  humans at their academy ages, not Archons)
- §2.9 (The Seeker — Mechronis blue uniform anchor)
- §8 (Cycle B2 battle section — full battle spec including the
  Kael Tower Defense audio fragment timing and the toy-soldier
  transfer animation)
- §12 (*To Be the Human* slideshow — Kael canonically "already
  gone" per DSFGL line 2458, rendered as an empty chair in the
  Mechronis class photo — mirroring the Prelude Beat F.5 empty
  chair motif)
- Prelude Bible §9.5 (Galley sandwich line — the Human's first
  unnamed reference to the Prince; Cycle B2 is where the Prince
  and Kael become *friends*, which is the relationship the Human
  is mourning in the Galley)
- Prelude Bible §10.5 (Beat E toy soldier flashback — the soldier
  in Cycle B2 is the same object, 30 years younger)
- Prelude Bible §11.1 (Beat F Kael Contingency Memo — the 213
  recruitment begins here at Mechronis, this is the origin)
- `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5.4 (Audio Log 3 "The
  List I Am On" — Kael's recruiting network of 213 contacts,
  canonically the same number from Beat F, now contextualized
  as something that started with conversations like B2's pre-
  match line)
- `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5.6 Movement 4 (Log 5
  "To Kael" — the farewell the player will hear at the end of
  Act 1, now enriched by having *met* Kael at sixteen)
- DSFGL line 2378 (the Tower Defense recognition beat — the
  player realizes the recorded voice IS the recruiter they are
  facing on the card board)

### 2.7 Young Agent Zero — Cycle B3 opponent (Mechronis Year 3)

The third Cycle B boss and the player's introduction to the woman
who will become **Vex Solène** — but neither the player nor the
Engineer knows that yet. At Mechronis she is just Agent Zero: a
seventeen-year-old who arrived a year after Kael, sits alone in
every class, speaks when spoken to and never first, and has the
highest marks in the academy's covert-operations track. She is
canonically a trained assassin already — her kill count at
seventeen is non-zero but unknown even to herself, because the
kills were part of training exercises she was told were
simulations. They were not.

The canonical weight of B3 is that this is the **only time in the
entire game** the player sees Agent Zero before her transference
into the Warlord's nanobot swarm in Cycle C3. After C3 she is
Vex Solène. Before C3 she is this: a quiet girl in a blue uniform
who is very, very good at not being noticed. The production must
render her as **forgettable on first viewing** — the player's
memory of B3 should be "oh, the quiet one" until Cycle C3's
portrait-resolve reveals that the quiet one was carrying the
Engineer's intellect inside her the entire time.

**Canonical visual:** INFERRED per user direction, anchored to
the Mechronis blue uniform. Agent Zero's visual signature is
**absence of signature** — she is the one character in the roster
who deliberately looks like no one in particular.

**Production-inferred visual spec:**

- **Age:** seventeen. Medium height, slender but not frail — a
  build that disappears in a crowd. Neither the tallest nor the
  shortest in the class. Nothing about her body type draws the
  eye.
- **Skin:** medium-light brown, ethnically ambiguous by design
  (the Warlord's nanobot swarm will eventually reconfigure her
  appearance in C3; the *before* face is the one she was born
  with, and she has spent her life making sure no one remembers
  it). Smooth, unblemished, unremarkable.
- **Hair:** straight, dark brown, falling to mid-back. Parted
  slightly off-center so the left side falls forward over her
  left eye in a curtain. The curtain is not a style choice — it
  is a **surveillance countermeasure**. She keeps the left eye
  hidden so that anyone trying to identify her from profile
  view has only half a face to work with. Render the hair
  curtain consistently in every frame — her left eye is never
  fully visible in any pre-C3 rendering.
- **Eyes:** the right eye (the visible one) is dark brown, calm,
  watchful in a way that is easy to mistake for shyness. It does
  not track the player's movements like Iron Lion's or Kanshi
  Sha's. It rests. It waits. When the player plays a card, Agent
  Zero's visible eye does not flick to the card — it stays on
  the player's face. She is reading the person, not the play.
- **Mechronis blue uniform, worn too perfectly:**
  - Blue blazer buttoned to the top, every button in place
  - Light blue tie at regulation length, knot dead-center
  - White oxford shirt pressed immaculate, sleeves at full
    length (she never rolls her sleeves)
  - Blue trousers with hospital-grade creases
  - Clean black shoes, polished
  - **No personal touches.** No pin, no bracelet, no scuff, no
    stain, no modification. The uniform is worn as if it were
    issued ten minutes ago. This is the visual tell the player
    should notice but probably won't: everyone else at Mechronis
    has made the uniform *theirs* (Iron Lion's rebellion, Kael's
    bracelet, the Prince's rolled sleeves). Agent Zero has made
    hers *nobody's*. She is invisible inside perfection.
- **Posture:** sitting with spine straight, hands flat on the
  table, palms down. She does not lean forward or back. She does
  not shift. She breathes at a rate that is difficult to detect
  on camera. When she plays a card she lifts one hand, sets the
  card, and returns the hand to exactly where it was. The
  economy of motion is not Kanshi Sha's meditative stillness —
  it is **operational discipline**. She is not being still because
  she is calm. She is being still because she was trained.
- **Voice direction:** quiet, level, no affect. Not cold — merely
  *absent*. Agent Zero's voice at seventeen sounds like a person
  reading stage directions for someone else's play. The emotional
  register is a fraction of a degree above monotone: just enough
  warmth to pass as human, not enough to leave an impression.
  Japanese-American accent (matching the Mechronis cosmopolitan
  student body), mid-alto range. When she says something that
  matters — which she does exactly once in the pre-match line —
  the warmth ticks up by a single degree. That single degree is
  the entire performance.

  No existing Agent Zero voice profile exists for the *young*
  version. A new voice profile **`young_agent_zero`** should be
  added. ElevenLabs target: `stability: 0.85` (very high — she
  is the most consistent speaker in the roster), `similarity_
  boost: 0.80`, `style: 0.10` (lowest stylization of any Act 1
  character — she is not performing, she is reporting).

**Canonical pre-match line** (INFERRED):

> *"I don't have a strategy. I have a sequence. If you interrupt
> the sequence I will adjust. If you do not interrupt the
> sequence you will lose in nine turns. I am telling you this
> because it would be unfair not to."*

Delivered flat, informational, the way a pilot reads a pre-flight
checklist. The single warm degree lands on the word "unfair" —
she means it. She does not want to be unfair. This is the only
evidence the player has in B3 that Agent Zero has a conscience,
and it is the seed for C3's sacrifice: she will accept the
Engineer's transference because the alternative — the Warlord
winning — is the unfair thing, and she cannot tolerate unfair.

**Deck theme:** "Zero Trust" stealth / one-shots. Agent Zero's
cards are invisible until they attack — the player sees empty
slots on her side of the board but does not know what is in
them until she activates a card for a one-shot strike. Each
strike kills one player unit outright. The tutorial lesson is
"some opponents win by being unseen" — the counter is deploying
units with **reveal-on-proximity** effects (which the player
unlocked from Kanshi Sha's Ocularum cards in A3) to expose
her hidden slots before she strikes. This is the first time in
Act 1 that the player must *combine* tools from different
battles, and it is intentional.

**Card unlock on win:** *The Weapon I Didn't Build* (Legendary
Dark) — a card that, when played, destroys one random enemy
unit without revealing which slot it was in. The Engineer named
this card after Agent Zero because the weapon she became (Vex
Solène, the swarm) was not something he built — it was something
she *allowed* him to put inside her. The card is Dark-aligned
because the Engineer was never fully at peace with what the
transference required.

**Post-match canonical beats** (INFERRED):

- **Win:** Agent Zero's sequence breaks at turn six (three turns
  earlier than her projected nine). She looks at the board,
  looks at the Prince, and says nothing. A full two seconds of
  silence. Then: *"You interrupted at six. I had not modeled
  that."* She stands. She does not offer a handshake. She walks
  to the classroom door, pauses, and says over her shoulder
  without turning: *"I will remember this. That is a
  compliment."* She leaves. The Prince watches her go. The camera
  holds on the empty chair for a beat — a deliberate echo of
  the Prelude's empty-chair motif.
- **Loss:** Agent Zero's sequence completes at turn nine, exactly
  as announced. The board is empty. She says *"Nine. As
  projected."* She stands, walks to the door, pauses. Over her
  shoulder: *"You tried to interrupt at turn four. That was the
  right instinct. The timing was off by two cards. Next time."*
  She leaves. The Prince watches her go. Cycle B canonically has
  no fail state — the biography continues.

**Cross-references:**

- §0.4 rule 3 (Vex Solène name discipline — Agent Zero pre-C3,
  Vex Solène from C3 onward, never mix)
- §2.0 (simulation framing — Cycle B opponents are canonical
  humans, not Archons)
- §2.9 (Mechronis blue uniform anchor)
- §9 (Cycle B3 battle section — full battle spec including the
  reveal-on-proximity mechanic synergy with A3's Ocularum tools)
- §15 (Cycle C3 — the Warlord Nano-Swarm battle where Agent
  Zero becomes Vex Solène, paying off the portrait rendered here)
- `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §1.2 (Vex Solène
  identity chain — Agent Zero / Engineer Zero / Eyes of Reality
  cover identities and reveal cadence)

### 2.8 Young Eyes — Cycle B4 opponent (Mechronis Year 4)

The fourth Cycle B boss and the player's second encounter with a
Watcher-derived entity — except Young Eyes is not the Watcher. She
is something the Watcher *made*. Per DSFGL line 2447, Young Eyes
is an "infiltrator, created by The Watcher," which means Kanshi
Sha's surveillance nervous system (§2.4) has a canonical offspring:
a human-seeming student implanted at Mechronis as a living sensor
array. Eyes does not know she is an artifact. She believes she is a
normal student who happens to be very good at noticing things. The
horror — which the player will not discover until Act 3's *"I Am
the Eyes That Watch"* slideshow — is that everything Young Eyes
sees is recorded and transmitted to the Watcher in real-time. Her
memories are not her own.

**Canonical visual:** INFERRED per user direction. Young Eyes must
visually echo Kanshi Sha (§2.4) without being a copy — she is the
Watcher's creation, not the Watcher's clone. The visual link is
in the **eyes**, not the outfit.

**Production-inferred visual spec:**

- **Age:** sixteen. Small-framed, birdlike build — narrow wrists,
  delicate hands, a slight tilt of the head that reads as
  curiosity. Shorter than most of her classmates.
- **Skin:** light East Asian complexion, Japanese descent (matching
  Kanshi Sha's ethnicity — she was created from his template).
  Smooth, pale, slightly translucent at the temples where the
  veins are faintly visible under classroom lighting.
- **Hair:** straight black, cut in a precise chin-length bob with
  blunt bangs across the forehead. Immaculate — never a strand
  out of place. The precision is a derivative of the Watcher's
  stillness (§2.4) expressed through grooming rather than posture.
- **Eyes — the canonical tell:** both eyes fully visible (contrast
  with Agent Zero's curtain). Dark brown irises, almost black.
  Normal-seeming at first glance. **But:** when Young Eyes focuses
  on something specific — a card, the Prince's hand, a detail on
  the board — her pupils dilate very slightly wider than a human
  pupil should. Not enough to look alien. Just enough that the
  player who is paying attention thinks *"that's a little too
  wide."* This micro-dilation is the Watcher's recording lens
  activating through the human host. Render it as a 15% pupil-
  diameter increase in close-up shots only. Do not make it
  dramatic. The subtlety is the horror.
- **Mechronis blue uniform, worn correctly but not perfectly:**
  - Same royal-blue blazer as the rest of the class
  - Tie at regulation length, knotted properly
  - White oxford shirt, sleeves at full length
  - Blue trousers with normal creases (not Agent Zero's
    hospital-grade — Eyes is normal-messy, not operationally
    clean)
  - Black shoes with one slightly scuffed toe
  - **One personal touch:** a small **sketch notebook** tucked
    into the blazer's inner pocket, visible as a rectangular
    bulge. Eyes draws in this notebook constantly between classes
    — portraits of her classmates, objects on desks, the view
    from the academy window. She believes drawing is her hobby.
    It is actually the Watcher's data-collection protocol
    expressed as a creative impulse. Render the notebook's edge
    visible in the blazer's inner pocket in every shot.
- **Body language:** attentive, slightly over-engaged. Eyes leans
  in when the opponent plays a card — not Iron Lion's fighter-lean,
  but a student-lean, as if she is taking a mental photograph. She
  smiles easily and often (contrast with Kanshi Sha's cosmic
  stillness and Agent Zero's operational flatness). The smile is
  *genuine* — Eyes is not performing. She actually enjoys watching
  the card game. That enjoyment is what makes the later reveal
  painful: she was having a good time and she was also a camera.
- **Voice direction:** bright, engaged, teenage-girl register.
  Unlike every other Cycle B opponent, Young Eyes's voice IS a
  teenager's voice — she is not an Archon in a child body (that's
  Kanshi Sha), she is a **human creation of an Archon** and does
  not carry the cosmic presence in her vocal tract. She sounds
  like a sharp, observant sixteen-year-old who reads a lot and
  talks about what she notices. Slightly fast cadence, slightly
  too many observations per sentence. Japanese-accented English
  with native-speaker fluency (she was raised at Mechronis).

  New voice profile **`young_eyes`**. ElevenLabs target:
  `stability: 0.55` (lower than average — she is animated and
  her voice varies with interest), `similarity_boost: 0.75`,
  `style: 0.35` (moderate stylization — the enthusiasm is the
  character).

**Canonical pre-match line** (INFERRED):

> *"I drew you this morning. Before breakfast. I draw everyone
> before I play them — it helps me see the patterns. You hold
> your cards high. Most people hold them low. That means you're
> not hiding, which means you're either very confident or you
> haven't learned to be afraid yet. I like both options."*

Delivered with bright enthusiasm. The line is canonically a
**complete read of the Prince's card-holding posture** from a
single morning observation — the first demonstration of the
card-peek mechanic that will define her deck. She told the
player her strategy and they didn't notice.

**Deck theme:** "I Am the Eyes That Watch" card-peek. A derivative
of Kanshi Sha's Ocularum full-board-reveal (§2.4) but more
targeted: Eyes does not see the player's entire hand, she sees
**the top 3 cards of the player's draw pile** at all times. She
knows what the player will draw next, which lets her play counters
preemptively. The tutorial lesson is "some opponents win by
knowing your future" — the counter is voluntary deck-shuffle
effects (new to Act 1) that randomize the draw order and break
her foresight.

**Card unlock on win:** *The Memorized Page* (Epic Dark) — a
card that, when played, lets the player look at the top 3 cards
of their OWN draw pile and rearrange them. Dark-aligned because
the Engineer took the Eyes' surveillance and turned it inward —
he used the Watcher's own tool to see himself coming. The card
name references the sketch notebook: a page she memorized of
his face, now a tool he uses to see his own future.

**Post-match canonical beats** (INFERRED):

- **Win:** Eyes's foresight breaks when the Prince plays a
  shuffle effect that randomizes his draw pile mid-match. Her
  next three predictions all miss. She blinks — the first time
  in the match her eyes have closed — and laughs. *"Oh! You
  moved! I had you perfectly still in my notebook and then you
  moved."* She pulls the sketch notebook from her pocket, opens
  it to a portrait of the Prince, and tears out the page.
  *"Here. It's more yours than mine anyway."* She hands the
  page to the Prince. The drawing is remarkably good — the
  Prince's face rendered in pencil with photographic accuracy,
  his eyes looking slightly past the viewer. The player sees
  the drawing in a close-up frame. It is the first portrait of
  the Engineer the player has seen rendered by someone other
  than the Engineer himself.
- **Loss:** Eyes's foresight holds. She draws the Prince's next
  three moves perfectly and has answers queued for all of them.
  The match ends with the Prince's hand empty and Eyes's board
  untouched. She smiles kindly. *"You held your cards high the
  whole time. I liked that. Most people drop them when they
  know they're going to lose."* She does not offer the sketch.
  The notebook stays in her pocket. The Prince will wonder what
  she drew and never see it — a canonical loose thread that
  resolves in Act 3 when the Eyes' adult form's surveillance
  archive is opened and the Prince's portrait is one of
  thousands.

**Cross-references:**

- §2.4 (Kanshi Sha the Watcher — Young Eyes is canonically a
  creation of the Watcher Archon, derivative of the surveillance
  nervous system §2.4 established)
- §2.0 (simulation framing — Young Eyes is NOT an Archon; she
  is a human-seeming creation of an Archon, which is a distinct
  category)
- §10 (Cycle B4 battle section — full battle spec including the
  pupil-dilation close-up and the sketch-page transfer)
- Act 3 *"I Am the Eyes That Watch"* opening slideshow
  (`SHIP_READY_ASSET_BIBLE.md` §3.7) — canonically the adult-form
  reveal that everything Young Eyes saw was transmitted to the
  Watcher. The slideshow title IS her canonical adult name
- `apps/shared/act1Opponents.ts` Cycle B4 shell (to be updated)

### 2.9 The Seeker / Young Human — Cycle B5 opponent (emotional pivot)

The fifth and final Cycle B boss, and the single most emotionally
complex battle in all of Act 1. The player — inhabiting the
Engineer's memories — sits across the card table from a boy with
red hair and blue eyes who is the younger version of **The Human**:
the Yin/Yang narrator who has been whispering on the player's
shoulder since the Prelude's Beat C.5 breath beat. The player
knows this voice. They have heard it mourn the Engineer in the
Galley sandwich line. They have heard it address Kael's empty
chair in the Briefing Room. Now they are looking at the boy that
voice used to be, decades before the mourning started.

**The emotional pivot:** per DSFGL line 2448, B5 is the first
place in the game where **losing is not failure**. Both win and
loss unlock a different Legendary card. The win card (*The
Classmate's Compass*, Legendary Light) and the loss card (*"The
only reason I stayed"*, Legendary Dark) are both canonical and
both permanent — the player carries exactly one of them through
the rest of the game. This is the first **meaningful binary
outcome** since the Prelude's Light/Dark choice in Beat J, and
it is delivered through a card battle rather than a UI selector.
The player does not choose Light or Dark here — they choose
whether to beat the young Human or let him win, and each outcome
writes a different card into the deck.

**The Human narrates in real time:** per DSFGL line 2448, "The
Human narrating from the shoulder slot in real time" — meaning
the adult Human's voice (the player's existing narrator) is
commenting on the battle AS it happens, recognizing his own
younger self across the table, and reacting to the player's card
choices with real-time VO barks. This is the only Act 1 battle
where the shoulder narrator is active during gameplay.

**Canonical visual (user-provided, 2026-04-15):**

> The Seeker is a young boy with straight red hair, bright blue
> eyes, and a pressed blue school uniform.

**Production expansion for this doc:**

- **Age:** fifteen (same age as the Engineer in Cycle B). Small
  for his age, a half-head shorter than the Prince at the card
  table. Slight build, bookish posture — shoulders slightly
  rounded from reading, chin tilted up to compensate.
- **Hair:** straight, vivid copper-red, medium length falling to
  his ears, parted on the left. The red is natural and
  eye-catching — in a room full of dark-haired Mechronis students,
  the Seeker stands out. This is canonically the visual signifier
  the player will use to recognize the adult Human in later acts:
  the red hair persists. Render it consistently with warm copper
  highlights under the academy's classroom lighting.
- **Eyes:** bright blue, startlingly saturated — the most
  color-vivid eyes in the Act 1 roster. Wide-set, slightly
  too large for his face (an adolescent proportion that the
  adult Human will grow into). The blue reads as *present* —
  when the Seeker looks at the Prince across the card table, the
  player should feel seen in a different way than any other
  opponent has managed. Not the Watcher's cosmic observation,
  not Eyes's data-collection, not Agent Zero's operational read.
  Just: *I see you. You are my friend. I have always known that.*
- **The pressed blue school uniform — the canonical Mechronis
  Academy uniform reference:**
  This entry establishes the definitive Mechronis Academy
  uniform that §2.5 (Iron Lion), §2.6 (Kael), §2.7 (Agent Zero),
  and §2.8 (Young Eyes) all derive from:
  - **Royal-blue wool blazer** with the Mechronis Academy crest
    on the breast pocket (render the crest as a small embroidered
    shield shape — a book open beneath a star, in gold thread on
    the blue wool; do NOT render legible text on the crest)
  - **Light blue tie** (silk or satin finish, lighter than the
    blazer by two shades)
  - **White oxford shirt** with collar points visible above the
    blazer
  - **Blue wool trousers** with a single pleat
  - **Black leather shoes**, lace-up oxford style
  - **The Seeker's uniform is pressed** — creases sharp,
    buttons polished, tie knotted at regulation height. Not
    Agent Zero's operational perfection — the Seeker's neatness
    is earnest. He dressed carefully because today matters to
    him. He is playing against the person he will spend the next
    seventeen thousand years mourning, and on some level he
    already knows it.
- **Personal touch:** a small leather-bound notebook in his
  trouser pocket (NOT the same as Eyes's sketch notebook — the
  Seeker's notebook is a **journal**, filled with handwritten
  observations in tiny script that are canonically the earliest
  drafts of what will become the Human's substrate commentary in
  the Prelude). The notebook is never opened during the battle.
  Its rectangular bulge is visible in one profile-shot frame.
- **Expression:** serious but not stern. A young face carrying
  a weight it doesn't understand yet. When the Seeker smiles —
  which he does once, at the post-match beat — the smile is
  small, private, and aimed at the Prince specifically. It is
  not Kael's warm lopsided grin or Minnie's gap-toothed beam.
  It is the smile of someone who has figured out a thing about
  the person across from them and is keeping it as a gift.

**Voice direction (dual-layer for B5):**

Two voices are active during B5:

1. **The Seeker's voice (young Human):** a fifteen-year-old boy,
   mid-register, slightly reedy (his voice has not yet settled).
   British-inflected English with a gentle bookishness — he
   speaks in complete sentences, uses words slightly above his
   age, and pauses before replying as if considering whether
   his answer is worth the other person's time. This is the
   **origin cadence** of the adult Human's substrate voice from
   the Prelude — the same pauses, the same weight-per-word, just
   younger and less worn.

   New voice profile **`the_seeker`**. ElevenLabs target:
   `stability: 0.60`, `similarity_boost: 0.85` (must feel like
   the same person as `the_human` profile, just decades younger),
   `style: 0.30`.

2. **The Human's shoulder narration (adult):** the existing
   `the_human` voice profile from `VOICE_OVER_BIBLE.md` Section 2,
   delivering real-time barks during the match. The adult Human
   is watching his own younger self play cards against the
   Engineer and he cannot keep quiet. His barks are not gameplay
   tips — they are **emotional reactions**: *"He was better at
   this than me. I remember losing."* or *"That card. He played
   that card against me and I've been thinking about it for
   seventeen thousand years."* The barks are triggered by specific
   card plays, enumerated in §11 (the Cycle B5 battle section).

**Canonical pre-match line** (INFERRED for the Seeker; the adult
Human does NOT speak the pre-match — only the Seeker):

> *"I've read everything you've written in class this year. I
> have a theory about you. I think you build things because you
> want to understand them, and you want to understand them because
> you're afraid they'll break if you don't. I don't think that's
> weakness. I think that's the most honest kind of strength. Shall
> we play?"*

Delivered with the Seeker's careful cadence — each sentence
considered before it arrives. The line is a **complete
psychological read of the Engineer at fifteen**, delivered by
the one person who will eventually know him better than anyone
alive. The player should feel the weight of it: this kid knows.
He already knows.

**Deck theme:** "Deep Thoughts" long-game. The Seeker's deck
plays slowly — cards that do nothing on the turn they are
played but gain power each turn they remain on the board
(accumulating "insight counters"). After four or five turns
of quiet buildup, a single Seeker card can outscale anything
the player has. The tutorial lesson is "some opponents win by
thinking longer than you" — the counter is early-game
aggression that destroys Seeker cards before their insight
counters accumulate. But the counter has a cost: aggressive
play means the player is rushing the biography's most tender
scene, and the Human's shoulder barks get sadder if the player
plays too fast. The mechanic is the emotion.

**Card unlock — DUAL OUTCOME (first in Act 1):**

- **Win:** *The Classmate's Compass* (Legendary Light) — a card
  that, when played, lets the player see the **emotional state**
  of every unit on the opponent's board (a metadata overlay
  showing which units are "afraid," "angry," "loyal," etc.).
  Named by the Engineer after the Seeker's ability to read
  people. Light-aligned because understanding is compassion.
- **Loss:** *"The only reason I stayed"* (Legendary Dark) — a
  card that, when played, makes the player's general immune to
  damage for one turn but prevents them from attacking. Named
  after the Seeker's answer to a question the Prince asked years
  later: "Why did you stay at Mechronis?" The answer: "You."
  Dark-aligned because the Engineer felt guilt about being
  someone else's reason for enduring a place that hurt them.

**Post-match canonical beats** (INFERRED):

- **Win:** the Seeker's insight cards are destroyed before they
  reach critical mass. The board clears. The Seeker looks at
  the empty space where his long-game was building and says
  quietly: *"You were too fast. I had something beautiful
  planned for turn twelve."* He smiles — the small private
  smile. *"I'll show you what it was going to be someday."* The
  adult Human's shoulder voice, almost inaudible: *"He did. He
  showed me. It took him forty years but he showed me. It was
  worth the wait."*
- **Loss:** the Seeker's insight cards reach critical mass. A
  single card with twelve insight counters sweeps the Prince's
  board in one action. The Seeker looks at the Prince and says
  quietly: *"I wasn't trying to beat you. I was trying to show
  you what patience looks like."* The adult Human's shoulder
  voice, cracking for the first time since the Prelude's
  Empty Chair line: *"He was. He was showing me. And I spent
  seventeen thousand years trying to learn the lesson."*

**Cross-references:**

- §2.0 (simulation framing — the Seeker is canonical human,
  not an Archon, not a Watcher derivative)
- §11 (Cycle B5 battle section — full battle spec including the
  adult Human's shoulder barks triggered by specific card plays,
  the dual-outcome card unlock, and the Small Private Smile
  close-up)
- §12 (*To Be the Human* slideshow — the Seeker/young Human is
  canonically "at the center, looking at the Engineer" per DSFGL
  line 2458)
- Prelude Bible §7.5 (`human_beat_c5_first_breath` — the Human's
  first whisper in the Prelude is the voice the player now sees
  the origin of at B5)
- Prelude Bible §9.5 (Galley sandwich line — the Human's mourning
  of the Prince is now contextualized by having seen the friendship
  form)
- Prelude Bible §12.5 (Empty Chair line — the Human addressing
  Kael's chair is enriched by the Seeker's post-match beat where
  the adult Human's voice almost cracks)
- `docs/production/VOICE_OVER_BIBLE.md` Section 2 (The Human
  voice profile — the adult shoulder-narration barks in B5 use
  this existing profile)

### 2.10 Vernon Vortex — Cycle C1 opponent (Battle of Nexon, "First Form")

The first Cycle C boss and canonically the player's first
encounter with a **cosmic-scale Archon** in the Engineer's memory.
Per DSFGL line 2467, C1 is the Battle of Nexon — a survival
puzzle, not a win condition. The player cannot win this match.
They can only last long enough for the Engineer's memory to
render the survivability lesson.

Vernon is the personified avatar of **the Vortex** — canonically
the cosmic force that wiped the Nexon battlefield, that the
Insurgency spent a decade trying to fight before they realized
it was not a weapon but a weather system. Per user canon
(§0.4-adjacent, 2026-04-15): *"Vernon is the personified avatar.
It's a simulation so it's the cosmic being in the body of a
child."* The Vortex is rendering itself in the Engineer's
biographical memory as a preteen boy with peach fuzz and a sun
T-shirt because that is the **least alarming possible shape** the
cosmic entity could take, and the simulation preserves the
Engineer's memory of what Vernon *felt* like: friendly, warm,
completely undefeatable.

The "First Form" label in DSFGL line 2467 is canonical: this is
the *first time* the cosmic Vortex appears in the Engineer's
life. It happens to appear as a preteen because that was the
Engineer's last pure-hearted age when the Vortex first touched
his awareness, and the simulation renders what the memory
recorded. Later Vortex appearances (canonically in Acts 3+) will
use different avatars, but the "First Form" is always Vernon.

**Canonical visual (user-provided, 2026-04-15):**

> Vernon Vortex is round-faced and cheerful, with short brown
> hair, a small beard/goatee, and an orange T-shirt with a large
> sun symbol.

**Production expansion for this doc:**

- **Age presentation:** approximately **twelve years old** —
  preteen, just hitting the earliest signs of puberty. The
  "small beard/goatee" from user canon is interpreted as **wispy
  peach-fuzz chin hair** that a twelve-year-old is proud of and
  convinced looks adult. It does not look adult. It looks like
  what it is: a kid with some chin scruff for the first time in
  his life. Render it as fine, light-brown hairs on the chin and
  faintly along the jawline. **Not a drawn beard.** The
  dissonance between "cosmic Vortex being" and "kid with first-
  chin-hair" is the beat.
- **Build:** slightly chubby, round-cheeked, healthy preteen
  physique. Short for his age in a way that reads as "still
  growing." Warm sun-kissed complexion — medium brown skin,
  possibly Latinx or mixed-heritage (canonically ambiguous;
  Vernon is the Vortex, his ethnicity is whatever the Engineer's
  memory fills in, and the Engineer's Nexon cohort was diverse).
- **Face:** round, open, cheerful. Wide easy grin showing front
  teeth (one slightly chipped — he fell off something once,
  laughed about it). Bright dark-brown eyes with a **too-intense
  inner glow** that does not read as child-like. The eyes are
  the tell: Vernon's face looks twelve, but his eyes are older
  than the universe. Render the eye-glow as subtle — a 5%
  brightness boost with warm-amber internal refraction, visible
  in close-up shots only. Do not overdo it. The player should
  think *"he's looking at me funny"* not *"that is a monster."*
- **Hair:** short brown, slightly messy in the way preteen boys'
  hair is messy at the end of a long day. Naturally straight
  with a slight cowlick at the crown he has stopped trying to
  fix.
- **The peach-fuzz goatee:** canonical detail. Must be rendered.
  It is wispy, sparse, embarrassingly proud. Vernon has decided
  this is his *thing*. The other Insurgency children teased him
  for it. He took the teasing as confirmation he looked mature.
  Light brown hairs on the chin, patchy along the jaw. Do NOT
  render as a stylized goatee — render as authentic early-puberty
  fuzz. The authenticity is the beat.
- **The orange T-shirt with sun symbol:** canonical and central
  to his visual signature. Specifically:
  - **Warm tangerine-orange** cotton T-shirt (`#f97316` reference
    color), slightly too big — the kind of shirt a kid picks
    because it's his favorite and he wears it even after he
    outgrows a size
  - **Large yellow sun symbol** centered on the chest, rendered
    as a simple childlike sun: round yellow center with eight
    straight ray lines radiating outward. Screen-printed, slightly
    faded from washing. The sun is the **Vortex's canonical
    sigil in its First Form appearance** — it will recur in
    later-act Vortex content, always as the same childlike sun.
    In Cycle C1's final board-wipe, the sun symbol canonically
    **glows** for half a second before the wipe fires.
  - Shirt is worn over blue jeans (regular kid denim, slightly
    dusty at the knees — he's been outside) and white sneakers
    with orange laces (he matched the laces on purpose).
- **Body language:** bouncy, energetic, can't sit still. Vernon
  is the **opposite** of Agent Zero's operational stillness and
  Kanshi Sha's meditative stillness — he fidgets, taps his feet,
  hums under his breath, drums his fingers on the card table.
  The constant motion is canonically the cosmic Vortex expressing
  its nature: the Vortex is the thing that moves, that cycles,
  that never stops. Vernon's preteen body is struggling to
  contain it. Every four turns, the body loses the struggle, and
  the Vortex **wipes the board**.

**Voice direction (Vortex Archon in a preteen body):**

Per §2.0's canon hygiene rule, Vernon's voice is NOT a twelve-
year-old's voice. The Vortex speaks through him, and the Vortex's
voice is canonically **ancient, warm, and oceanic** — wide, slow
breaths between phrases, a resonance that feels like speaking
through a much larger space than a twelve-year-old's vocal tract.
The warmth is genuine: Vernon / the Vortex does not hate the
player. The Vortex is simply the Vortex. It wipes boards because
that is what it does, the same way a tide comes in because it is
a tide. There is no malice. There is also no mercy. The voice
should convey both: fondness toward the player, and the
inevitability of the wipe.

Cadence is unhurried. Vernon does not interrupt himself. He does
not speak quickly even in excitement. When the Vortex is about
to wipe the board, the voice gets *slightly quieter* rather than
louder — the way an ocean pulls back before a wave.

New voice profile **`the_vortex_first_form`**. ElevenLabs target:
`stability: 0.75`, `similarity_boost: 0.85`, `style: 0.40`
(moderate-high stylization — the warm-oceanic resonance needs
performance). Apply a subtle **sub-bass harmonic layer** at -24dB
to every take, reinforcing the "speaking through a larger space"
effect. The harmonic layer is not a reverb — it is an additive
frequency that makes Vernon sound like he has more chest than
his twelve-year-old ribcage could contain.

**Canonical pre-match line** (INFERRED):

> *"Hi! I'm Vernon. You can't win this one, but that's okay — I
> need you to last. Every turn you're still here, the people you
> came with get a little further away from the battlefield. This
> is how you save them. By losing slowly. Are you ready? I'll
> count us in."*

Delivered with the Vortex's warm oceanic cadence through the
preteen's voice. Vernon **counts the player in** — "three, two,
one, go" — before the first turn begins. The count is audible on
the battle audio mix. This is the only Act 1 battle with a
spoken pre-match countdown, and it is the canonical signature of
any future Vortex encounter (Acts 3+) — whenever the Vortex
speaks, it counts you in.

**Deck theme:** board wipes every 4 turns (survival puzzle, not
a win condition). Per DSFGL line 2467, this battle **cannot be
won** by defeating Vernon's general. The Engineer lost at Nexon;
the biography cannot be rewritten. What the player *can* do is
**last four turns**, then **last another four turns**, then
**last a third four turns** — each four-turn cycle is a complete
wipe of the board, and the player's score is the number of cycles
they survived before their own deck ran empty. Each surviving
cycle counts as a "save" — every turn the player is still on the
board, canonical Insurgency refugees are getting further from the
Nexon battlefield. The tutorial lesson is "not-winning is a valid
outcome" — the first time in the Engineer's biography that the
player is explicitly told they cannot win, and that the not-
winning is *the point*.

**Card unlock (awarded regardless of survival count):** *The
Standstill* (Epic Light) — a card that, when played, lets the
player delay a loss by one turn, once per match. Named after the
canonical beat in Vernon's post-match dialog where he says "you
stood still while the world moved around you, and that was
enough." Light-aligned because refusing to lose is a form of
faith, and Vernon / the Vortex canonically respects faith even
when it is aimed against him.

**Post-match canonical beats** (INFERRED — there is no "win"
state for C1, only survival-count outcomes):

- **High survival (3+ complete wipe cycles):** Vernon claps —
  genuine, delighted, child-clap. *"Three! That's the best I've
  seen in a while. The last one to last three was the Prince's
  friend with the lion pin. You remind me of him."* The callback
  to Iron Lion (§2.5) lands here — Vernon / the Vortex
  canonically respects Iron Lion, which is the first player-
  facing evidence that Iron Lion survived Nexon. Vernon then:
  *"Okay. Go. They're waiting for you."* The battlefield
  dissolves into the cross-fade to C2.
- **Low survival (0-2 complete wipe cycles):** Vernon's smile
  stays warm but dims slightly. *"That's okay. You're going to
  get better at this. You have a lot of battles left to lose."*
  He pats the air between them — a reassuring gesture across a
  card table he will not come around. *"Go. They're still
  waiting. You bought them enough."* The battlefield dissolves
  into the cross-fade to C2.

**Cross-references:**

- §0.4 rule 3 (no CoNexus machine-god hints — the Vortex is a
  separate cosmic entity, not CoNexus)
- §2.0 (simulation framing — Vernon is the single-case of a
  cosmic Archon rendered in child form during Cycle C, per user
  canon. The intentional dissonance is the beat)
- §13 (Cycle C1 battle section — full battle spec including the
  four-turn wipe cycle timing, the sun-symbol pre-wipe glow, and
  the preteen-body + cosmic-voice audio mix)
- §2.5 (Young Iron Lion — Vernon's high-survival callback
  canonically confirms Iron Lion survived Nexon, which affects
  later-act Insurgency content)
- DSFGL line 2467 (canonical "Battle of Nexon" / "First Form"
  survival-puzzle framing)
- Act 3+ Vortex content (flagged for continuity — the orange sun
  sigil must recur in any future Vortex appearance, and the
  countdown "three, two, one, go" is Vernon's canonical speech
  signature)

### 2.11 Wanda Wyrlord — Cycle C2 opponent (fragmented encounter)

The second Cycle C boss. Per DSFGL line 2468, C2 is the
Warlord's fragmented encounter — the player meets the Warlord
**before** she reconstitutes into the full adult form the
Engineer will face later. In the biographical simulation, Wanda
is a seventeen-year-old cyborg girl with partial-plate
augmentations showing through her skin. The player is meant to
read her as **wounded** — a soldier who has been through
something. That reading is canonically correct in the surface
narrative. It is also canonically incomplete. (See canon hygiene
note below.)

**CRITICAL canon hygiene rule (§0.4 rule 4):** The Warlord is
canonically a weaponized nanobot swarm per
`CANON_REV_7_ORACLE_VEX_EXPANSION.md` §1.6. **That reveal is
Act 2+ scope.** This section must render Wanda as a cyborg
(human with cybernetic augmentation) and **NOT** as a swarm
wearing a human form. The visible metal on her face reads as
prosthetic plating, not swarm integration. The "fragmented" label
reads as cybernetic damage, not swarm fragmentation. The voice
glitches read as cybernetic comms interference, not swarm voices
bleeding through. All of these will be retroactively recontextualized
as swarm evidence in Act 2+ when the reveal lands, but in Act 1
the player must read Wanda as a *person*. Production must resist
any visual cue that pre-reveals the swarm — no silver-liquid
motion, no dispersal particles, no cloud-form transitions. Plate
and circuitry only.

**Canonical visual (user-provided, 2026-04-15):**

> Wanda Wyrlord is a striking blonde cyborg girl with light-
> enhanced eyes, some visible metal on her face, and a yellow
> hooded jacket.

**Production expansion for this doc:**

- **Age:** seventeen. Taller than most of the Mechronis cohort
  at the same age (she did not attend Mechronis — she grew up
  in Kael's household before the war, per
  `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §1.6, and the Engineer
  knew her as a childhood tutoring companion before she left
  for military service). Athletic build — broader shoulders
  than Agent Zero's, narrower than Iron Lion's, muscled in a
  way that reads as "trained" rather than "grown into." Her
  posture is military — shoulders back, spine straight, chin
  level.
- **Skin:** fair, lightly sun-weathered, with a small constellation
  of freckles across the nose and cheekbones (canonical — these
  are the freckles the Engineer remembers from his childhood
  tutoring sessions with her, preserved by the simulation as
  continuity evidence). Where the plating is visible, the skin
  around the plate edges shows faint scar tissue — the plates
  were installed, they did not grow. Clean surgical integration.
- **Hair:** striking platinum-to-gold blonde, cropped short at
  the sides and back, medium length on top, swept back from the
  forehead. Naturally thick, slightly wavy. When she moves her
  head the hair catches the battlefield's warm gold lighting
  and reads as almost-metallic itself — a visual rhyme with the
  plates that the player should register subconsciously.
- **Eyes — "light-enhanced":** the canonical tell. Both eyes are
  cybernetic optics, rendered as:
  - Base iris color: glacial blue-gray (`#9cb4c1` reference),
    matching the Warlord's canonical adult form per existing
    game lore
  - A thin **electric-blue inner ring** (`#3b82f6`) circles each
    iris, glowing faintly from within — this is the cybernetic
    optic's active-tracking indicator
  - The pupil is **not black** — it is a matte dark-charcoal
    with a tiny pinpoint light dead center. The light moves
    independently of the pupil during targeting motion (like a
    sniper scope's reticle). Render the pinpoint shift in
    close-up shots when Wanda's attention locks onto a card.
  - The glow from both eyes casts faint cool-blue light on her
    upper cheekbones in low-light conditions — visible in the
    battlefield scenes with warm-gold dominant lighting as a
    subtle cross-color rim
- **Visible metal on her face:** canonical but **limited**. Do
  not over-augment. The plating is:
  - **Left temple and cheekbone:** a flush-mounted metal plate
    approximately 4cm × 3cm, running from the temple down along
    the cheekbone toward the ear. Brushed titanium finish with
    faint cool-gold undertones, no visible seams except where
    it meets skin. A single small diagnostic port at the rear
    edge near the ear
  - **Right jawline:** a smaller matching plate, 3cm × 2cm,
    along the angle of the jaw
  - **No plating elsewhere on the face** — the nose, mouth,
    forehead, chin, and right cheek are all unmodified human skin
  - The plating should read as **necessary medical augmentation**,
    not aesthetic choice. Wanda was injured. The plates are what
    keep her face symmetrical and functional
- **The yellow hooded jacket:** canonical. Specifically:
  - Warm mustard-yellow (`#eab308` reference), not neon — a
    military-spec yellow that was originally standard-issue for
    Insurgency medic corps before Wanda defected. The jacket
    predates her defection by a few years, but she kept it
  - Heavy canvas construction, zipper up the front (currently
    unzipped), hood currently thrown back
  - Two chest pockets (empty), two hip pockets (one holding a
    small data slate, visible as a bulge)
  - A small faded **Insurgency field-medic patch** sewn onto
    the left shoulder — canonical. Wanda has not removed it.
    The player who is paying attention should notice that the
    Warlord is wearing Insurgency colors, and wonder what that
    means. (Canon seed: Wanda's defection is not clean. She
    misses the Insurgency. The patch is grief she refuses to
    admit.)
- **Underneath the jacket:** a simple black military undershirt,
  snug fit. No other visible modifications — the plating stops
  at the face. The player does not know if there is more
  augmentation underneath. Production should render the undershirt
  covering everything below the collarbone and leave the
  augmentation question open.
- **Hands:** human. Unmodified. Nails bitten (same canonical
  fidget as the Prince's sleeve-rolling — they were tutored
  together as children; shared habits persist). Callused
  palms from weapons training. One small cross-shaped scar on
  the back of the right hand, between the thumb and forefinger
  — canonical mark from a specific childhood Dischordia match
  with Kael and the Engineer, when Kael was teaching her to
  shuffle cards and she cut herself on the deck's edge. The
  Engineer remembers this. Production must render the scar
  visible in any close-up of her hands.
- **Body language:** alert, coiled, ready to fight. But not
  aggressive — she is **waiting**. Wanda sits forward at the
  card table, forearms braced on the edge, head level, eyes
  tracking. When she plays a card, she slams it down — not with
  theater (Minnie's performative slams, §2.2) but with
  **commitment**. The slam is canonical: she means every card
  she plays.

**Voice direction:** seventeen-year-old young woman, alto-range,
military-firm cadence. English with no particular regional
accent — her voice is the canonical "soldier from a palace who
chose the army" accent the Warlord uses in her adult form. Not
warm (contrast Kael's warmth), not absent (contrast Agent Zero's
flatness) — **commanding**, in the way that trained officers are
commanding even when they are not giving orders.

**The voice-glitch hygiene note:** the Warlord is canonically a
nanobot swarm (per §0.4 rule 4) but that reveal is Act 2+. In
Cycle C2, occasional subtle voice glitches are permitted as
**cybernetic comms interference** — a brief digital artifact
(100ms) on one or two words per line, attributable to her
optic-audio implants. These are foreshadows of the swarm voices
that will bleed through in Act 2+, but they must be **ambiguous**
in Act 1. No dramatic multi-voice overlap. No swarm-chorus
effect. Just: occasional short glitches on specific words,
easily dismissed as tech failure.

New voice profile **`wanda_wyrlord`**. ElevenLabs target:
`stability: 0.70`, `similarity_boost: 0.80`, `style: 0.30`, with
a layered post-processing pass for the cybernetic glitches
(specified per-line in §14 Cycle C2 battle section).

**Canonical pre-match line** (INFERRED):

> *"I remember you. You were the one who let me win that Tuesday
> because Kael told you to. I've been angry about that for a long
> time. I don't need you to let me win. I never did. Let's find
> out if you're still someone I'd let sit at my table."*

Delivered with the commanding cadence — no anger in the voice,
anger in the *content*. The callback to "that Tuesday" is the
canonical childhood tutoring memory: the Engineer, at age nine,
deliberately lost a card match to let young Wanda win because
Kael (who was directing the lesson) told him she needed the
confidence. Wanda caught it. She has carried it for eight years.
The word *"Kael"* gets one of the 100ms cybernetic-glitch artifacts
— the first canonical hint that saying his name costs her something
the implants are not quite processing.

**Deck theme:** "I Love War" attack-rush + instant-kills. Wanda's
deck is aggression — every card she plays attacks immediately,
and several cards have instant-kill effects that bypass defensive
buffs. The tutorial lesson is "some opponents win by not letting
you build" — the counter is disruption effects that delay her
card plays, forcing her to hold her aggression for turns she
cannot afford to lose. Card-count is Wanda's weakness; she
plays four or five cards and then her hand is empty. The player
must survive the opening volley.

**Card unlock on win:** *The Converter* (Legendary Dark) — a
card that, when played, takes one of the opponent's units and
flips it to the player's side permanently. Named after Wanda's
canonical ability: she is a *converter*, someone who turns
things into other things (Insurgency medic into Warlord
lieutenant, friend into enemy, child into soldier). Dark-aligned
because conversion is almost always a loss.

**Post-match canonical beats** (INFERRED):

- **Win:** Wanda's aggressive opening burns out by turn five.
  Her hand is empty. The Prince's board holds. She looks at the
  empty space in front of her — for the first time in the match,
  her posture loosens slightly. The commanding alto drops a half-
  register. *"You got better. I thought you'd coast on what you
  learned from him. You didn't."* The *"him"* is Kael again —
  another glitch on the word, longer this time (200ms). She
  stands. She does not offer a handshake. At the door she pauses
  and, without turning: *"Tell your apprentice to keep their
  hand visible. The Watcher sees cards that are on the table."*
  This is the first in-game warning about §2.8 Young Eyes's
  surveillance mechanic — Wanda is canonically *trying to help*.
  The player will not understand this was a gift until after
  they meet Eyes in Act 1 replay or in Act 3's surveillance
  reveals.
- **Loss:** Wanda's aggression overwhelms. The Prince's board
  empties before he can stabilize. She plays her final
  instant-kill and the Prince's general drops. Her commanding
  posture does not relax; she is not satisfied. *"That was too
  easy. I came here for a fight."* She stands, and at the door,
  without turning: *"The next one will be harder. I promise."*
  The *"I promise"* glitches at the end — a 300ms cybernetic
  stutter that sounds almost like two voices saying the same
  words a half-syllable apart. The player hears it. Cannot
  name what they heard.

**Cross-references:**

- §0.4 rule 4 (CRITICAL canon hygiene — swarm reveal is Act 2+,
  Act 1 must render Wanda as cyborg only; all voice-glitch
  effects attributable to implants)
- §2.0 (simulation framing — Wanda is an adolescent Archon,
  NOT a child-form Archon, canonically distinct from the Cycle
  A pattern)
- §14 (Cycle C2 battle section — full battle spec including the
  per-line glitch timing, the childhood-tutoring-flashback beat,
  and the Insurgency patch close-up)
- §2.5 (Young Iron Lion — the Insurgency connection through
  the yellow jacket's medic patch, planting a later cross-act
  beat about Wanda's defection)
- §2.6 (Young Kael — Wanda's childhood tutoring with Kael and
  the Engineer, the "Tuesday" memory, and the glitch on Kael's
  name)
- §15 (Cycle C3 — Wanda's swarm reveal canonically lands AFTER
  C3's forced loss, in Act 2+ content; Act 1's C2 is the last
  time the player sees her as "cyborg girl" before the swarm
  reframing)
- `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §1.6 (Warlord retcon —
  weaponized nanobot swarm, childhood-palace persistence
  experiment, Engineer unknowingly tutored her, Eden destruction
  retaliation context)
- `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §6 (Eden — the garden
  world Wanda destroyed; production must NOT have Wanda mention
  Eden in Cycle C2, that beat belongs to Act 2+)

---

### 2.12 Warlord's Nano-Swarm (inside Agent Zero) — Cycle C3 opponent (MANDATORY FORCED LOSS)

The third Cycle C boss and the canonical inflection point of Act 1.
Per §1.1 master index, C3 is the **only mandatory forced loss in
the entire act**: the Engineer's deck shrinks by one card per
turn, every lost card is conscripted onto Agent Zero's side as a
reinforcement against the swarm, and on the final turn the
Engineer is empty while Agent Zero's board is full. The match is
not a duel. It is the Engineer's transference, rendered as a
card-game tempo collapse. He is not trying to win. He is trying
to fit through the door before it closes.

This section is **structurally different from §2.2 through §2.11**.
The "opponent" is not a person sitting across a card table. It
is a weaponized nanobot swarm (per `CANON_REV_7_ORACLE_VEX_
EXPANSION.md` §1.6) that has been deployed inside the body of
Agent Zero (the seventeen-year-old the player met in §2.7) by
the Warlord as a persistence vector. The swarm is **the Warlord
herself** — she has no other body, has never had one, and is
preparing to overwrite Agent Zero's mind with her own at the
moment of physical collapse. Agent Zero's body is the host. The
Engineer is opposite both of them at the table on Zenon, with
the Resurrection Protocols device armed beside his playing hand.

There are therefore **two visual surfaces** the production must
render simultaneously: the swarm (the actual opponent, rendered
as card-game mechanics and an environmental phenomenon), and
Agent Zero's body (the host, rendered as a now-eighteen-year-old
in field deployment loadout, expression flat, eyes unfocused,
playing cards she does not appear to be choosing). The player
should read the scene as "I am playing against the swarm, but
the cards are coming out of her hands." Both readings are correct.

**CRITICAL canon hygiene rules (§0.4 rules 3 + 4):**

1. **The reveal lands HERE.** Cycle C2 (§2.11 Wanda Wyrlord) is
   the last section that must hide the swarm. Cycle C3 is where
   the swarm becomes literal on screen. Production may — and
   should — render distributed nano-fabric, silver-liquid motion,
   dispersal particles, and cloud-form transitions in this
   section. The visual vocabulary banned from C2 is **unlocked**
   in C3. The player needs to see what the Warlord is.
2. **Agent Zero is "Agent Zero" until the final turn.** Use the
   identifier "Agent Zero" for every visual, subtitle, voice
   tag, and matchup-card reference up to and including the
   penultimate turn. The portrait resolve to **"Vex Solène"**
   happens at the exact instant the Engineer's transference
   completes (final turn, after the Engineer's last card is
   conscripted). From that frame forward she is Vex Solène for
   the rest of the game. Never mix the two names in the same
   frame; the resolve is a single hard cut, not a fade.
3. **The Warlord has no human name.** Per `CANON_REV_7_ORACLE_
   VEX_EXPANSION.md` §1.6 rule 1 + rule 4: she is "the Warlord."
   Do NOT use "Malkia" — that name belongs exclusively to
   Malkia Ukweli (the Enigma, §5.6.9 of the canon expansion)
   and any cross-reference is a canon bug. Subtitles for the
   swarm's voice (where it speaks at all — see Voice Direction
   below) attribute to **`the_warlord`**, never to a first name.
4. **The Engineer does not say "Vex Solène" in C3.** He does
   not know that name. He learns, in the instant of transference,
   that "the remnant of the original Agent Zero's mind was
   still alive within the swarm" (per §1.3 item 5 of the canon
   expansion). The name "Vex" surfaces from the host's own
   memory after the Engineer dies, when she wakes up alone.
   The player sees the portrait resolve to "Vex Solène" because
   the *simulation* is labeling its records, not because anyone
   in the scene says the name aloud.

**Canonical visual — the swarm itself** (INFERRED, anchored to
`CANON_REV_7_ORACLE_VEX_EXPANSION.md` §1.6's "weaponized nanobot
swarm" + "distributed nano-fabric of militarized matter"):

The swarm is the **environmental opponent**. It has no portrait
in the matchup-card sense; its on-screen presence is rendered as
a coherent volume of nano-particles that the player perceives
above and around Agent Zero's body. Production must walk a
deliberate line: the swarm has to read as **agentic** (it is
playing cards, it has intent) but must not read as **organic**
(it is not a being, it is a weapon). The visual grammar is
*mercury that decided to fight*.

- **Volume and density:** at the start of the match, the swarm
  is visible as a fine silver-grey haze hovering approximately
  20cm above and behind Agent Zero's shoulders — readable as
  "her aura" by a player who has not yet understood what they
  are looking at. As the match progresses and the Engineer's
  cards are conscripted across to her side, the swarm
  **densifies**: by turn three it is a coherent silver-liquid
  cloud with a mass-and-density readable from the player's
  side of the table. By the final turn the swarm is a single
  unified body of nano-fabric, roughly the volume of a large
  predator, coiled around Agent Zero's torso and shoulders
  like armor that breathes.
- **Color anchor:** brushed-mercury silver-grey (`#a8aab2`
  reference) with cool-blue specular highlights (`#3b82f6` —
  intentional visual rhyme with Wanda Wyrlord's optic-rings
  in §2.11, planting the swarm-and-cyborg connection the
  player won't consciously make until Act 2+). The specular
  highlights flicker — not randomly, but on a 4Hz pulse that
  matches Agent Zero's heart rate. The swarm is keeping time
  with the host.
- **Motion grammar:** the swarm moves in three modes the
  production must distinguish clearly:
  - **Standby** (turns 1–2): slow lateral drift, a 0.5Hz
    breathing motion, no internal currents. Reads as
    "waiting."
  - **Active** (turns 3–6): internal currents become visible;
    nano-fabric streamers detach and reattach; faint dispersal
    particles drift downward toward Agent Zero's collarbones
    and integrate into her skin. Reads as "feeding."
  - **Strike** (final turn only): the swarm **collapses
    inward** into Agent Zero's body in a single sub-second
    motion, vanishing from external view. The host's silhouette
    hardens. The portrait label resolves. Reads as
    "completed."
- **Light interaction:** the swarm absorbs the warm gold of
  Act 1's global style anchor and re-emits it as cool-blue.
  This is the **only** Act 1 asset that may invert the
  palette directionality. Production should treat it as a
  signature visual — when the player sees warm light entering
  silver and leaving blue, they are looking at the swarm.
- **Audio component (referenced for VFX, full spec in §21):**
  the swarm has a constant low-amplitude granular hiss
  (think: dry sand poured slowly onto metal), pitched around
  2.5kHz, that the player hears under every other sound in
  the scene. The hiss intensifies on the same 4Hz pulse as
  the specular highlights. When the swarm strikes (final
  turn collapse) the hiss cuts to absolute silence for 1.2
  seconds before the post-match audio resumes.
- **What the swarm is NOT:**
  - Not a face. The swarm never forms a face, eyes, mouth,
    or any humanoid feature, even briefly. Production must
    resist the urge to anthropomorphize.
  - Not a creature. No limbs, no wings, no tail, no
    suggestion of biology. The motion grammar is **fluid +
    militarized**, never **animal**.
  - Not glittery. No sparkles, no fairy-dust connotation. The
    nano-fabric is military matériel; it should read as
    expensive, dangerous, and clinical.
  - Not the same visual vocabulary as the Vortex (C1) or the
    Watcher's Ocularum (A3). Each Act 1 cosmic phenomenon has
    its own visual signature; the swarm is silver-mercury
    *because* the Vortex is rust-spiral and the Ocularum is
    bone-white. Read together, the three are a triptych of
    canon-distinct Architect tools.

**Canonical visual — the host body** (Agent Zero, eighteen, one
year past her §2.7 Mechronis appearance):

The same person from §2.7 — same height, same build, same
ethnically-ambiguous features, same dark brown hair — but a year
of field deployment has passed and the production must show it.
Agent Zero in C3 is no longer the quiet Mechronis student; she
is an operational asset who has been carrying a swarm in her
bloodstream for several months. Continuity with §2.7 is **load-
bearing** — the player must recognize her on sight. The changes
production introduces in C3 must read as "this is the same person
later," not "this is a different character."

- **Age:** eighteen, by approximately ten months. The child-fat
  is gone from her cheeks; the jawline is slightly more
  defined. She is not gaunt, but she is operating at a body
  weight a few kilos under what Mechronis would have measured.
- **Skin:** the same medium-light brown as §2.7, but with a
  faint **silver undertone visible in the capillaries on the
  insides of her wrists, the soft skin under her jaw, and the
  thin skin at her temples**. Production must render the
  undertone subtly — the player should register "she looks
  tired" first, then on second look, "wait, why does the
  shadow under her skin read silver?" The undertone is the
  swarm in her circulatory system. It is canonical. It is the
  player's first visual confirmation, before the swarm itself
  becomes visible above her shoulders, that something is
  inside her.
- **Hair:** still straight, dark brown, mid-back length, but
  now pulled back into a tight functional braid against the
  base of the skull. The left-side curtain that hid her left
  eye in §2.7 is gone. Both eyes are visible. The
  surveillance-countermeasure habit has been overridden by
  field-uniform regulations. (Subtext the player will not yet
  catch: the swarm does not need her to hide her face. The
  swarm is the camouflage now.)
- **Eyes:** both visible. The right eye is the same calm dark
  brown the player remembers from §2.7. The **left eye** —
  the one that was hidden — is the same dark brown for the
  first six turns of the match, then in the final two turns
  begins to show **a single fixed silver pinpoint at the
  pupil's center**, brightening slightly each turn until on
  the final turn the entire iris is rimmed with the same
  silver-mercury color the swarm reads as. The pinpoint is
  the swarm's local instance of itself inside her optic
  nerve. The progression is subtle but inevitable; production
  should treat it as a **per-turn animation cue** that
  anchors the visual to the mechanical countdown.
- **Field deployment loadout** (replaces the §2.7 Mechronis
  blue uniform — important: not a uniform variant, a complete
  replacement):
  - **Charcoal-grey tactical jacket**, fitted, hip-length,
    high collar buttoned to the throat. Subtle insignia on
    the right shoulder — a small black-on-charcoal sigil that
    Act 1 viewers cannot identify. (Canon: it is the
    **Warlord's deployment mark**, the same sigil that will
    surface on Vex Solène's Coda dossier in Act 3 §7. The
    player will recognize it retroactively.)
  - **Black tactical trousers**, no creases (the perfect
    Mechronis creasework is gone — operational dress does
    not invest in pleats).
  - **Magnetic-sole black combat boots**, worn in.
  - **No personal touches.** The §2.7 visual tell of *invisible
    inside perfection* has evolved: she is no longer trying
    to disappear into a uniform. She is wearing field gear as
    if it does not belong to her, because functionally it does
    not — it belongs to the swarm.
  - A small **memorial cord** worn around the right wrist:
    plain black braided fiber, three knots. Canon: this is
    the only personal item Agent Zero has carried since
    leaving Mechronis, and it is for a person whose name she
    has never spoken aloud (the original Eyes of the Watcher,
    her dead handler from §1.3 item 2 of the canon expansion).
    Production must render the cord visible in any close-up
    of her hands. It survives the transference and Vex Solène
    will still be wearing it in Act 3.
- **Posture:** still operational, still economical, but the
  §2.7 *flat hands palms-down* discipline has loosened
  fractionally — her left hand rests slightly lower on the
  table, the palm half-turned, as if she is listening for
  something through the wood. (She is. The swarm has
  acoustic sensitivity. She is using her hand as an
  antenna.) When she plays a card, the hand motion is the
  same one-up-one-down economy from §2.7, but the timing is
  off by a fraction — she lifts her hand a half-beat *after*
  the card has already left her fingers. The player should
  feel, without being told, that **she is not the one
  choosing the cards**. The swarm picks; her hand follows.

**Canonical visual — the table and the device:**

The Engineer is opposite Agent Zero on the Vortex (the
Collector's flagship — see `CANON_REV_7_ORACLE_VEX_EXPANSION.md`
§5 Log 5 for the canonical Engineer location at this moment).
The setting is a pressurized equipment bay off the main cargo
deck — small, metal-walled, lit by a single overhead work-lamp
that casts hard down-shadow. He has approximately four minutes of
breathable air left in the compartment. The card table between
them is improvised: a hexagonal equipment crate the Engineer
has cleared and aligned to play on. There is no chair on his
side; he plays standing. The card table is canonical, the
pressurized bay is canonical, the four-minute air budget is
canonical. Production must not change them.

- **The Resurrection Protocols device** sits on the Engineer's
  right, beside his playing hand. It is a matte-black palm-
  sized cube with a single recessed activation stud and a
  preflight-status LED that blinks at exactly 0.5 Hz (per
  `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5 — already armed,
  already cycling preflight). The blink rate is **half** the
  swarm's specular pulse, which means every other swarm-pulse
  syncs with a device blink. Production must hold this
  rhythm exactly; players who notice the sync will read it as
  "the device is calibrated to the threat," which is canon.
- **The Engineer's loadout:** his deck on the table in front
  of him, a thin steel water flask to the left of the deck,
  the hexagonal crate's edge worn from use. He wears the
  same coat established in §2.1 with the cuffs rolled back
  to the forearm (the rolled-cuff fidget §2.1 establishes as
  his canonical tell). He is not visibly armed. The
  Resurrection Protocols are his only weapon and they are not
  a weapon, they are an exit.
- **The compartment beyond the table:** the back wall holds
  six **explosive charges**, evenly spaced, each with a small
  red countdown LED reading down from approximately seven
  minutes. Per §5 of the canon expansion, the Engineer has
  rigged the cargo bay to detonate; the seven-minute timer is
  the primary objective (destroy the data archive), and the
  Protocols are the contingency. Production must include the
  charges in the wide shot. The player should see them and
  understand that this room is going to become a crater
  regardless of who wins the card game.

**Voice direction:** the C3 scene has **two voice surfaces**, and
the production must keep them sonically distinct so the player
can always tell who is speaking.

1. **Agent Zero's voice — host channel** (`young_agent_zero`
   profile from §2.7). Same voice the player learned at
   Mechronis: quiet, level, no affect, the single warm degree
   reserved for the words that matter. In C3 her speaking-time
   is short — she has roughly four lines across the entire
   match, each one delivered as if she is fighting to get the
   words out before the swarm overrides her vocal cords. Hold
   the §2.7 ElevenLabs settings exactly (stability 0.85,
   similarity_boost 0.80, style 0.10). **Do not** apply post-
   processing effects to her voice. She is still her, and the
   purity of the channel is the player's evidence.
2. **The Warlord's voice — swarm channel** (new profile
   **`the_warlord`**). The swarm speaks rarely in C3 — twice,
   maybe three times — and never in long sentences. The voice
   is **not female, not male, not human, not machine**. It is
   the granular hiss from §2.12 Audio component pushed up into
   the speech band: a chorus of approximately 200 individual
   nano-particle resonances harmonizing into recognizable
   syllables. Production should think of it as *what a
   thunderstorm would sound like if a thunderstorm decided to
   articulate*. Voice direction:
   - English language; canonical neutral accent (the swarm has
     no native tongue — it parses the host's language model)
   - Pitch range: extremely wide (the chorus spans soprano
     through bass simultaneously); pitch *center* sits in
     contralto territory
   - Cadence: deliberate, half-time, never rushed; the swarm
     has no biological respiratory limit and treats each
     syllable as an independent decision
   - Emotional register: **flat amusement**. The Warlord is
     not angry, not afraid, not satisfied. She is *interested*
     in what is about to happen. The performance note for the
     voice actor is: "you are a scientist watching a long-
     planned experiment finally run."
   - ElevenLabs target: `stability: 0.40` (low — the chorus
     should fluctuate), `similarity_boost: 0.50`, `style: 0.80`
     (high stylization — the chorus effect lives here), with a
     **mandatory** post-processing pass that layers 8–12
     pitch-shifted copies of every utterance at intervals
     between -7 and +12 semitones, mixed at -18dB relative to
     the carrier voice. Final mix should be intelligible but
     unmistakably non-singular.

The two channels must **never speak simultaneously** in C3 —
overlap is reserved for Act 2+ content where the swarm fully
takes the host. In C3 the channels alternate: when Agent Zero
speaks, the swarm hiss drops to silence under her. When the
swarm speaks, Agent Zero's mouth moves a half-beat behind the
syllables (intentional desync — production must hold the
half-beat lag exactly; it is the player's clue that the swarm
is *speaking through* her, not *as* her).

**Canonical pre-match line — Agent Zero (host channel)** (INFERRED):

> *"You shouldn't be here. The Vortex was supposed to be empty
> when I arrived. I told them it would be empty. I am — I am
> sorry that it isn't."*

The first sentence is delivered flat, operational. The second
sentence is the warm degree from §2.7 doing real work — she is
apologizing, and she means it, and she is the only person in
the scene who knows yet what kind of apology this is going to
turn out to be. The hesitation on "I am — I am sorry" is
canonical: that is the swarm trying to suppress the apology
and not quite succeeding in time. Production must hold the
hesitation as a 400ms pause with a faint granular hiss audible
in the gap.

**Canonical pre-match line — the Warlord (swarm channel)**
(INFERRED):

> *"Engineer. Sit. We have been looking forward to this for a
> long time."*

Eight words. The chorus pitches the word *"Engineer"* widest
(full soprano-to-bass spread), settles tighter on the imperative
*"Sit,"* opens again on *"long time."* The "we" is canonical —
the swarm is plural by nature, and the pronoun is the player's
first explicit confirmation that they are not playing against
a single mind. The line is delivered without anger, without
threat — it is an old colleague greeting an old colleague at a
scheduled meeting. The horror is the **scheduling**. She has
been planning this since the palace.

**Deck theme:** **"Tempo-decay + self-sacrifice"** — the unique
mechanic of the entire act. The Engineer's deck shrinks by
**one card per turn** regardless of play; every shrunk card is
**conscripted** to Agent Zero's side as a reinforcement (the
card flips, the swarm-silver glow rims its border, it lands on
her board face-up and it remembers the Engineer played it
moments before). On the final turn the Engineer's hand is
empty and Agent Zero's board holds his entire former deck. The
mechanic is **not a duel** — it is a tempo race against a
clock the player cannot reset. The tutorial lesson is "some
losses are the point" — every Engineer card the player
deliberately *plays* (rather than holding to be conscripted)
is a card that lands as the Engineer chose, not as the swarm
chose. The match has no win condition. It has **dignity
condition**: how many of his own cards does the Engineer get to
play before the door closes? Production must surface the count
in the post-match summary screen as **"Cards played as
yourself: N / 12."** That number — N out of twelve — is the
only score the C3 match generates. It feeds forward into Act 3
F3 (the first time the player meets Vex Solène face-to-face),
where her opening line varies based on the N-value the player
posted in C3 (full breakdown deferred to §15 Cycle C3 battle
section).

**Card unlock — guaranteed** (NOT win-gated, because there is
no win): ***The Friend I Saved*** (Mythic Light — renamed from
*The Friend I Trusted* per `CANON_REV_7_ORACLE_VEX_EXPANSION.md`
canon Rev 4). The card unlocks at the moment of the Engineer's
transference (final turn). This is the **only** Mythic Light
card the player earns in Act 1, and the only card in the entire
game whose flavor text is set by the player's C3 N-value
("Cards played as yourself") rather than by static text. The
canonical card body:

- **Name:** The Friend I Saved
- **Rarity:** Mythic Light
- **Type:** Memory unit
- **Cost:** 0 (free play — it is a gift)
- **Effect:** Once per match, when an enemy unit would deal
  lethal damage to one of your units, that damage is canceled
  and the attacking enemy unit is moved to your side
  permanently. (Mechanically: the Engineer's last act of
  bandwidth-sacrifice, replayable as a tactical option.)
- **Flavor text (procedural, varies by N-value):**
  - N = 0: *"You let her play every card. She remembers all
    of them."*
  - N = 1–3: *"He played a few of his own. She wears them
    like a coat."*
  - N = 4–7: *"He chose what to keep, and what to give. She
    inherited the difference."*
  - N = 8–11: *"He held the line as long as he could. She is
    the line now."*
  - N = 12: *"He played every card himself. There was no time
    to be saved. He saved her anyway."*
- **Card art (referenced; full prompt in §22.3):** the
  Engineer's right hand, palm-up, with a single silver-mercury
  droplet resting on it. Background: out-of-focus warm-gold
  light from the work-lamp, with the soft bokeh of the
  Resurrection Protocols' status LED in the upper right.
  No people visible; the hand is the entire image.

The card is meant to be **reserved**, not spammed. Players
who deploy *The Friend I Saved* in trivial matches are
canonically welcome to do so — the card does not block on
narrative significance — but the design intent is that they
will save it for a moment when the loss matters. The first
time the player uses it against Vex Solène in Act 3 F3, the
card's flavor text triggers a one-time custom dialog beat
where Vex *recognizes the card* (per Act 3 §7.4 — out of scope
for this section, flagged for cross-pull).

**Post-match canonical beats** — note: C3's match resolution is
**inverted** relative to §2.2–§2.11. The "loss" is the canonical
outcome and is the only path the engine offers. The "win" is
**structurally blocked** — the engine never lets the Engineer's
deck refill, never lets the conscription mechanic invert, never
exposes a victory state. Production must spec both branches
because the engine's UI surfaces a placeholder for symmetry, but
only the loss is reachable.

- **Loss (canonical, the only outcome):** the Engineer's last
  card leaves his hand. The board on his side is empty. Agent
  Zero's side holds his entire conscripted former deck plus
  her own. The swarm above her shoulders collapses inward in
  the sub-second motion specified in **Strike** mode. The
  granular hiss cuts to absolute silence for 1.2 seconds. The
  Engineer reaches his right hand to the Resurrection
  Protocols cube without looking at it — his eyes are on Agent
  Zero's face — and presses the activation stud.

  *(Camera holds on his hand on the device, his thumb on the
  stud, for one full beat before the press.)*

  The Engineer (Prince voice profile, §2.1, **without** the
  habitual warmth — flat, decided, the voice of a man who has
  finished his arithmetic):

  > *"I'm sorry I'm late. I came as fast as I could."*

  The line is canonically delivered to **Agent Zero**, not to
  the swarm. Production must compose the shot so that his eyes
  are locked on her left eye specifically — the eye with the
  silver-mercury rim, the eye through which the swarm is
  watching. He is not apologizing for being late to the
  Vortex. He is apologizing for being late to her — for not
  having understood, in the years between Mechronis and Zenon,
  that his classmate had been carrying a weapon inside her the
  whole time. The apology is real. It does not save her, but
  it is the only one anyone will ever offer her for that
  specific loss.

  Agent Zero's last line (host channel, the warm degree at
  full strength, fighting the suppression):

  > *"It's — okay. I'll — meet you on the other — side."*

  The hesitation pattern is canonical: three 300ms gaps where
  the swarm pushes against the words and she pushes back. The
  granular hiss is audible in each gap. She does not finish
  the sentence cleanly; the swarm overrides on the word "side"
  and the final consonant is replaced by a single brief chord
  of swarm-voice. That chord is the **first time** in the
  entire game that the two channels overlap. It is also the
  **last time** the host channel is heard until Act 3.

  The Engineer presses the stud. The Resurrection Protocols
  device emits a single soft chime (no flash, no beam — the
  transference is bandwidth, not light). The Engineer's body
  exhales once and goes still. Agent Zero's body inhales sharp
  and the swarm above her shoulders **dissipates** — not
  collapses, *dissipates* — into a fine silver-grey haze that
  drifts downward and integrates into her bloodstream over
  the following three seconds. Her left eye's silver rim
  fades. Both eyes refocus. She looks at the Engineer's body
  across the table.

  *(Camera pushes in slow on her face. The portrait label at
  the top-right of the match UI resolves: AGENT ZERO →* ***VEX
  SOLÈNE****. Hard cut, single frame, no fade.)*

  She does not speak. She does not cry. She picks up the
  Engineer's deck from the table — the original deck, her
  conscripted board returns to it — and slides it into her
  jacket. She picks up the Resurrection Protocols cube. She
  picks up the steel water flask. She walks to the cargo bay
  door, pauses, and looks back at the explosive charges on
  the back wall. Their countdown LEDs read approximately 1:50.
  She walks out. The door seals behind her.

  *(Camera holds on the empty room for the remaining 1:50.
  When the charges detonate, the player does not see it — the
  cut to black happens at 0:01.)*

  The Cycle C3 finale slideshow does **not** fire here. C3
  ends on black. The next thing the player sees is the
  matchup card for §2.13 Wayne Warden (Cycle C4 — the New
  Babylon trial). The transition is intentionally abrupt: the
  player should feel that *time skipped* between the bay
  detonation and the trial, because canonically it did. Vex's
  escape from the Vortex, her arrival at New Babylon, and the
  Engineer's arrest are all off-screen events the trial will
  reference but never depict. *Last Words* lands later, after
  C4, as the master Cycle C slideshow.

- **Win (structurally blocked, never reachable):** the engine
  must enforce that the Engineer cannot win the C3 match. The
  conscription mechanic shrinks the deck by exactly one card
  per turn regardless of player action; the swarm's board
  fills regardless of player action; no card the player has
  earned in Cycles A or B can disrupt the conscription rule.
  Production must verify this in QA: any combination of cards
  the player attempts must converge on the canonical loss by
  turn 12. The engine displays the standard "Concede" button
  during the match, but **selecting Concede during C3 fires
  the canonical loss beat exactly as if the player had played
  through to turn 12** (no early-quit penalty, no missed card
  unlock — *The Friend I Saved* still drops, the post-match
  beat still plays). The intent is to respect players who
  recognize the forced-loss design and want to honor it
  without grinding through 12 turns of pre-determined tempo
  collapse. Either path resolves to the same canonical
  outcome.

  If a future engine bug allows the Engineer to actually win
  the C3 match, that is a **canon bug** of the highest
  severity. Production should treat the structural block as
  load-bearing: every other Act 1 system reads C3 as having
  resolved with the Engineer's death. A "win" state has no
  defined narrative consequence and would corrupt every
  downstream beat from C4 onward. QA must flag any path that
  exposes a victory condition.

**Cross-references:**

- §0.4 rule 3 (Vex Solène / Agent Zero name discipline — the
  hard-cut portrait resolve at C3's final turn is the
  canonical handoff between the two names)
- §0.4 rule 4 (Warlord-as-swarm canon — C2 hides the swarm,
  C3 reveals it; this section is the unlock point for the
  swarm visual vocabulary)
- §1.1 (Master Index entry for C3 — MANDATORY FORCED LOSS,
  tempo-decay + self-sacrifice deck theme, *The Friend I
  Saved* unlock)
- §2.0 (simulation framing — the swarm is "rendered as card-
  game mechanics" rather than as a character in child form;
  §2.12 is the explicit instantiation of that rule)
- §2.1 (The Prince — the Engineer's voice profile, his
  rolled-cuff fidget, his canonical loadout including the
  steel water flask)
- §2.7 (Young Agent Zero at Mechronis — the §2.12 host body
  continuity anchor; her hair-curtain habit, her flat hands,
  her single warm degree, her ElevenLabs profile)
- §2.11 (Wanda Wyrlord — the cool-blue specular highlight in
  the swarm visualization is an intentional rhyme with
  Wanda's optic-rings; do not let production strip it)
- §15 (Cycle C3 battle section — full per-turn breakdown of
  the tempo-decay countdown, the per-turn animation cues for
  Agent Zero's left-eye progression, the audio mix for the
  granular hiss / specular pulse / device blink synchronization)
- §17 (Cycle C finale slideshow *Last Words* — fires after
  §2.13 Wayne Warden's C4 match, not after C3; production
  must NOT cut to *Last Words* at the end of C3)
- §22.3 (Asset Delivery Checklist — *The Friend I Saved*
  card art prompt, the swarm environmental phenomenon prompts,
  Agent Zero's field-deployment loadout reference sheet)
- §23.1 (Canon drift — `apps/shared/act1Opponents.ts` slot 11
  is currently `the_programmer`; per the §1.1 master index
  the C3 opponent is `warlord_nano_swarm` with host
  `agent_zero`. The data shell needs a follow-up code PR to
  rename and add the host-reference field.)
- `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §1.2 (Vex Solène
  identity chain — the four-stage reveal cadence; C3 is
  where Reveal 0 lands implicitly through the portrait
  resolve, even though Vex herself doesn't surface as a
  speaking character until Act 3)
- `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §1.3 item 5 (the
  canonical transference description — the Engineer's mind
  into the swarm, the discovery of Agent Zero's surviving
  remnant, the bandwidth sacrifice; §2.12's Loss beat is the
  in-game rendering of this canonical event)
- `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §1.6 (the Warlord
  retcon — weaponized nanobot swarm, no organic body, no
  human name, the Architect's persistence experiment
  framing; §2.12 is the visual/audio realization of the
  retcon)
- `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5 (the Vortex bay,
  the Resurrection Protocols cube, the four-minute air
  budget, the seven-minute charge timer, the Engineer's
  recorded final monologue; production must hold all five
  details exactly as canon specifies them)

---

### 2.13 Wayne Warden — Cycle C4 opponent (Authority's Tribunal — Trial format)

The fourth and final Cycle C boss, the closing battle of Act 1,
and the only Act 1 match that runs in the **Trial format**
rather than as a standard Dischordia duel. Per §1.1 master
index, C4 is the Engineer's New Babylon trial: the Tribunal
plays jury cards and evidence cards from a stacked institutional
deck, the Engineer defends with his own Dischordia deck (now
including everything he has accumulated across Cycles A through
C3, *including the just-unlocked* *The Friend I Saved* from
§2.12), and the match resolves by the Tribunal accumulating
enough verdict pressure to pass sentence — or the Engineer
accumulating enough rebuttal force to delay it. Wayne Warden is
the presiding judge, the named voice of the Authority for this
match, and the only Act 1 antagonist who is **categorically
older than the Engineer**: a man in his sixties, deep into a
career he has decided is the same as a moral system.

The structural weight of C4 is that the player has just
finished §2.12 (the transference, the death) and is now playing
the Engineer **in the brief window between his arrest at New
Babylon and his execution**. The Engineer in C4 is canonically
*already dead* in the §2.12 sense — his consciousness has been
transferred — but the simulation is rewinding to the part of his
biography the player has not yet seen: the trial, the verdict,
the recording of *Last Words*. C4 is therefore a **biographical
flashback embedded within the larger biographical flashback**
that is Act 1. The player is inhabiting the Engineer
inhabiting his own trial. Production must not signal this
nesting visually; the C4 trial reads as a continuous scene, and
the framing only resolves in the *Last Words* slideshow that
follows.

**Elara is a card in the Tribunal's deck.** This is the load-
bearing canon detail of C4 and the player's first encounter with
Elara as a *historical figure inside the Engineer's biography*,
predating her later role as the Prelude AI narrator. She is not
present as a person at the trial — she is an evidence card the
Tribunal plays. The card depicts a much-younger Elara in
Authority robes (she was an Authority public servant on Atarion
before the events of the Prelude; this is canon per the bond-40
"Two Witnesses Remember" milestone), and her testimony — recorded,
not delivered live — is one of the Tribunal's strongest
evidentiary plays. The player who has been reading carefully
will recognize the name. The player who has been playing
carelessly may not catch it until Act 4's revelation. Either is
a valid reading. The C4 design intent is that the *card itself*
is the only place this beat lands in Act 1; it is not narrated,
not pointed to, not dwelt on. Production must render the card
with Elara's name printed clearly in the lower banner so the
player can see it.

**CRITICAL canon hygiene rules (§0.4 + Act 1 specific):**

1. **Wayne Warden is NOT the Authority itself.** He is a *member*
   of the Authority — specifically the presiding judge of the
   New Babylon Tribunal that tried the Engineer. The Authority
   as an institution is a faceless multi-body entity (six
   crystal coffins in the gallery above the Tribunal floor,
   per the §2.13 environment spec below). Wayne Warden is the
   one face the institution puts forward to deliver verdicts.
   Subtitles attribute Tribunal-speech to **`wayne_warden`**
   for his individual voice, and to **`the_authority`** for
   the collective ritual lines that the six crystal coffins
   speak in unison (production: see Voice Direction below for
   the chorus spec). Never collapse the two attributions.
2. **The Engineer does NOT confess in C4.** Win or loss, the
   Engineer's final speech is the *Last Words* recording (the
   slideshow content is spec'd in §17, not here). Within the
   C4 trial itself, the Engineer is permitted to enter a plea
   of **"I will let the deck answer"** — the ritual phrasing
   the Tribunal accepts when a defendant invokes the right to
   defend by Dischordia. He does not plead guilty, he does
   not plead innocent, he does not testify. He plays cards.
   The cards are his testimony.
3. **Elara's evidence card is read in her voice but is NOT
   her live presence.** The recording is canonically captured
   on Atarion years before the trial, before she met the
   Engineer in person. Production must use Elara's existing
   voice profile (from the Prelude bible §2.2) but with
   **age regression**: her recorded voice is approximately
   seven years younger than her Prelude voice, less weathered,
   more institutional. ElevenLabs target for the regressed
   profile: same `elara` profile, `style: 0.50` (up from her
   Prelude default), with a **public-record artifact pass**
   layered in post (low-bitrate compression, faint room tone,
   the auditory signature of a deposition booth).
4. **Wayne Warden survives Act 1.** He does not die in this
   match, in the *Last Words* slideshow, or anywhere in Act 1.
   He remains a sitting Authority judge through the entire
   game and surfaces canonically again in Act 6 §6.2 (the
   Confession arc) and Act 7 §7.5 (the Convergence trial). C4
   is his *first* on-screen appearance, not his last.
   Production must render him at an age that lets him plausibly
   age into the Act 6 / Act 7 frames without recasting.

**Canonical visual — Wayne Warden** (INFERRED, anchored to §2
user canon "Wayne Warden" + §2.0 "adult tribunal figure, old
enough to sit the bench"):

Wayne Warden is the only Act 1 antagonist the production must
render as **categorically older than the player's avatar**. The
visual brief is *a man who has spent forty years deciding that
the institution is correct, and has stopped noticing the cost*.
He is not cruel. He is not corrupt in the cinematic sense. He
is something more difficult to play against: a competent
technician of judgment who genuinely believes the verdict the
Authority has assigned him to deliver. Production must resist
the easy read of "evil judge." Wayne Warden is more dangerous
than that — he is a *good* judge, by the only definition his
institution recognizes.

- **Age:** sixty-three. Hair gone iron-grey at the temples,
  kept short, neatly groomed. Forehead high, lined; the lines
  are concentration lines, not anger lines. He has not laughed
  often in the last decade and the absence shows in the
  resting position of his mouth.
- **Build:** medium height, slightly stooped at the shoulders
  from forty years on the bench. He has the body of a person
  whose work is done seated. Not soft — the daily Authority
  ceremonial requires standing, walking the floor, handling
  ritual implements — but not athletic. Production should
  render him as believably *tired* without being frail.
- **Skin:** pale, slightly papery, with the particular waxy
  sheen of a person who has worked indoors under
  Authority-spec lighting (warm yellow, low-CRI, designed to
  flatter robes and flatten skin) for most of his adult life.
  Faint liver-spots on the backs of the hands. A small
  shaving nick on the left jaw, two days old, healing. Wayne
  cuts himself shaving slightly more often than he used to.
  Production may render this consistently across his Act 1 /
  Act 6 / Act 7 appearances as a longitudinal continuity
  detail — the nick varies but is always somewhere on his face.
- **Eyes:** pale grey-blue (`#9aa6b1` reference). The single
  most important visual property of Wayne Warden's face: his
  eyes **track the cards, not the defendant**. In every
  composition production must verify that his gaze is locked
  on the Engineer's deck or on the playing surface — never on
  the Engineer's face. He looks at the Engineer exactly twice
  in the entire C4 match: once when reading the charges (the
  pre-match line), once when delivering the verdict (the
  post-match beat). Both glances are brief and clinical.
  Outside those two beats, the Engineer is processed by
  Wayne's peripheral vision as evidence among other evidence.
  This is the cruelty the player should *feel* without being
  told: Wayne is not refusing to look at the Engineer because
  he hates him. He is refusing to look at the Engineer because
  the Engineer is a case file, not a man.
- **Authority robes (canonical, fully prescribed by Authority
  protocol):**
  - **Outer robe:** deep burgundy (`#6b1d2c` reference),
    floor-length, heavy wool with a faint vertical weave. Not
    velvet — the Authority's robes are deliberately
    *non-decorative*, signaling that judgment is administrative
    work rather than theater. The collar is high, structured,
    standing approximately 4cm from the neck.
  - **Beneath:** a black undertunic, plain, full-length
    sleeves, no embellishment.
  - **The Authority sigil:** a single small silver pin worn
    on the left breast of the outer robe — a stylized scale
    motif, approximately 2cm tall. The pin is the *only*
    metallic element in his entire wardrobe. Production must
    render it with a faint specular highlight in every shot;
    the player's eye should land on the pin first when Wayne
    is on screen.
  - **Sleeves:** long, falling to the wrist. Wayne keeps his
    hands inside the sleeves except when handling Tribunal
    implements (the gavel, the verdict scroll, the evidence
    cards). The hands appearing from the sleeves is a visual
    cue production should hold deliberately — the hands are
    out only when the Authority is *acting*.
  - **Headgear:** a flat black biretta-style cap, four-cornered,
    worn squarely. He removes it once during the trial — at
    the verdict — and sets it on the bench in front of him.
    The removed cap is the player's visual cue that the
    verdict has been decided.
- **Hands:** long-fingered, well-kept, with a single thin
  silver band on the left ring finger. Canon: he is widowed.
  His wife was a fellow Authority public servant who died on
  Atarion in the same incident that ended Elara's career
  there (foreshadow — the connection is not explained in Act
  1; it surfaces in Act 6 §6.2 where Wayne's grief is the
  hinge of the Confession arc). Production must render the
  ring visible in any close-up of his hands during card
  handling. The Engineer does not know the ring's significance.
  The player will not know either, until later.
- **Posture and motion:** seated centrally on a raised bench
  approximately 1.2m above the trial floor. His posture is
  upright but not rigid; he leans forward slightly when
  reading a card from the evidence stack, leans back when
  the Engineer plays a defense. The motion is **judicial
  cadence** — he is not in a hurry, he is not bored, he is
  *processing*. When he plays a card from the Tribunal deck
  he slides it across the bench surface (he does not place
  it down; he *tables* it, with the formal Authority verb).
  When he speaks, his hands fold in front of him on the
  bench, sleeves obscuring the wrists.

**Canonical environment — the New Babylon Tribunal chamber:**

The setting is canonical and load-bearing for the *Last Words*
slideshow that follows. Production must compose the trial
chamber so the wide shot reads as **a courtroom designed by
people who think judgment is liturgy**. The chamber is roughly
24m × 18m, ceiling 12m high, with a single tall vertical-
proportioned space rather than a horizontally-spread one. The
player perspective in C4 is from the Engineer's seat — a single
plain wooden chair on the trial floor, no table, no podium, no
support. The Engineer's deck is held in his hands.

- **The bench (rear of chamber):** raised 1.2m off the trial
  floor, polished dark walnut, approximately 6m wide. Wayne
  Warden sits at center; the bench is otherwise empty during
  the C4 trial (other Tribunal members participate as the six
  crystal coffins overhead, not as floor seating). A single
  brass scale of justice sits on the right end of the bench,
  ceremonial, unused during the match. To Wayne's left: the
  evidence stack (the Tribunal's deck), face-down. To Wayne's
  right: the verdict scroll, unsealed, blank. The verdict
  scroll is the chamber's only timer the player can see — a
  single ink line is added to it at the bottom of every turn
  the Tribunal is winning, and the scroll fills from blank to
  full text over the course of the match. When the scroll
  fills, the verdict is passed.
- **The six crystal coffins** (canonical per §2 user canon and
  the existing data shell): mounted on the rear wall above
  Wayne's bench, in a horizontal row, each approximately 2.4m
  tall × 1m wide × 0.8m deep, equally spaced. Each coffin
  contains the visible body of an Authority elder in stasis
  (sixties-to-eighties, robed identically to Wayne, eyes
  closed, hands folded). The coffins are **lit from within**
  by faint warm-amber light that pulses softly in unison at
  approximately 0.3 Hz (the institutional heartbeat). The
  coffins are not decorative — they are the rest of the
  Tribunal. Wayne's individual rulings are advisory; the
  collective ritual lines (see Voice Direction below) are
  spoken in unison by the six elders without any of them
  visibly opening their eyes. The amber pulse intensifies
  when the chorus speaks. Production must render the chorus
  events with a corresponding visible light surge from the
  coffins, never with mouth movement.
- **The trial floor:** polished black stone, faintly veined
  with grey, no carpet. The Engineer's wooden chair sits at
  the geometric center of the floor, facing the bench. A
  single shaft of warm-yellow Authority-spec spotlighting
  illuminates the chair from above; the rest of the floor
  recedes into shadow. The lighting is forensic, not
  theatrical — production should resist any urge to make the
  shaft beautiful. It is a clinical down-light at 4500K with
  no diffusion.
- **The gallery:** the chamber walls between the bench and
  the entrance are lined with empty observer seating —
  approximately 200 seats, all unoccupied for the C4 trial.
  Canonical: the Authority deemed the Engineer's case too
  sensitive for public witnessing and closed the gallery.
  Production must render the empty seats clearly visible in
  any wide shot. The emptiness is the point. There is nobody
  to bear witness to what happens here except the player and
  the Tribunal itself.
- **The chamber doors:** a single set of tall iron-bound
  doors at the back of the gallery, closed and bolted from
  outside. Two New Babylon Authority guards in burgundy
  uniforms stand at parade rest in front of the doors,
  visible only in the widest establishing shot. They do not
  speak, do not move, and are not characters. They are the
  chamber's reminder that the Engineer is not free to leave.

**Canonical mechanics — the Trial format:**

C4 is the **only Act 1 match** that does not use the standard
Dischordia duel ruleset. The Trial format is documented in
detail in §15 (Cycle C4 battle section) but the player-facing
mechanics production must visualize are summarized here:

- **The Engineer's deck** is his standard Dischordia deck as
  accumulated through Cycles A–C3, including all card unlocks
  he has earned. *The Friend I Saved* (§2.12 unlock) is in
  the deck and may be played in C4 as a defense. The Engineer
  draws and plays cards by the standard rules.
- **The Tribunal's deck** is an entirely separate ruleset
  comprising two card types:
  1. **Jury cards** (~30 in the deck): each represents a
     single member of the implied jury (the Authority does
     not use a public jury, but its Tribunal protocol
     requires symbolic representation). When Wayne plays a
     jury card, it adds **one ink line** to the verdict
     scroll regardless of the Engineer's defense. Jury cards
     cannot be canceled, only *delayed* by specific Engineer
     responses. The Engineer's job is to play cards that
     **delay** rather than cards that *destroy* — Trial
     format does not award destruction points; it awards
     time.
  2. **Evidence cards** (~12 in the deck): each represents a
     piece of recorded testimony or material proof. Evidence
     cards add **two to four ink lines** depending on weight
     and require a specific Engineer response to delay (the
     player must counter with an Engineer card whose flavor
     contradicts the evidence — e.g., evidence card *"The
     Engineer abandoned his post at Nexon"* is countered by
     the Engineer card *"The Standstill"* (§2.10 C1 unlock,
     thematically about holding the line)). The matchup is
     thematic, not statistical; production must hand-author
     the counter-table, deferred to §15.
- **Elara's evidence card** is one of the twelve evidence
  cards. It carries a **three-line weight** (mid-range, not
  the heaviest). Its canonical title on the card face is
  *"Public Servant Testimony — Atarion, redacted."* Its art
  shows a much-younger Elara in Authority robes seated at a
  deposition booth (full prompt in §22.3). Its flavor text
  reads: *"The defendant was already known to my office
  before his arrest. I cannot say more without authorization
  I do not have. — Public Servant E. (recorded under oath)."*
  Production note: the **single initial "E."** is the only
  Act 1 reference to her name. Players who have just
  finished the Prelude and recognize the initial may put it
  together. Players who have not, will not. Both readings are
  intended.
- **The verdict scroll** fills from top to bottom. Ten ink
  lines fills the scroll. When it fills, the Tribunal passes
  sentence (canonical loss). If the Engineer survives all
  thirty jury cards plus all twelve evidence cards without
  the scroll filling — possible only with optimal
  delay-counter play — the Tribunal **runs out of cards** and
  is forced to recess (canonical win). Either path resolves
  Act 1; the difference is the framing of the *Last Words*
  slideshow that follows.

**Voice direction:** the C4 scene has **three voice surfaces**,
and the production must keep them sonically distinct.

1. **Wayne Warden's voice — individual judicial channel** (new
   profile **`wayne_warden`**). Sixty-three-year-old male
   baritone, English with a slight upper-class New Babylon
   inflection (precise diction, lightly clipped consonants,
   the canonical Authority-academy speech pattern). The voice
   is neither warm nor cold — it is **administered**.
   Production note for the actor: think of a senior surgeon
   reading a postoperative report aloud to colleagues. The
   facts are facts; the patient may live or die; the report
   is the report. ElevenLabs target: `stability: 0.80`
   (high — Wayne is consistent), `similarity_boost: 0.85`,
   `style: 0.30` (low — he is not performing, he is
   adjudicating). Wayne speaks his individual rulings,
   reads evidence cards aloud as he tables them, and
   delivers the verdict if the scroll fills. He never raises
   his voice. He never shouts. The post-match canonical loss
   beat is delivered at exactly the same volume as his
   opening line — production must hold the dynamic range
   tight.
2. **The Authority chorus — collective ritual channel** (new
   profile composite **`the_authority`**, six-voice unison).
   The six crystal coffins speak in unison for ritual lines
   only — the opening invocation, the swearing-in (which the
   Engineer declines), the verdict pronouncement (loss path),
   and the recess declaration (win path). The chorus is six
   distinct voices (4 male + 2 female, ages sixty-eight to
   eighty-four, all Authority-academy diction) layered in
   exact synchrony. ElevenLabs spec: each of the six voice
   profiles recorded individually, mixed in post with **zero
   timing offset** (the chorus is *unanimous*, not
   harmonized — production must resist any temptation to
   stagger entries or pitch-shift for "chorus effect"). The
   six voices speak as if they were one voice with six
   throats. Each utterance is short — never more than ten
   words. Between utterances, the coffins are silent and the
   amber pulse returns to its baseline 0.3 Hz.
3. **Elara's evidence-card voice — recorded deposition
   channel** (existing `elara` profile, age-regressed per
   the canon hygiene rule above). Roughly seven years younger
   than Prelude Elara, less weathered, more institutional.
   The recording is heard by the player only when the
   evidence card is tabled and the Engineer responds with a
   "play" rather than a "delay" — the recording then plays
   in full as the card resolves. Production must apply the
   public-record artifact pass (low-bitrate compression,
   faint room tone, the deposition-booth signature). The
   recording is short (roughly 12 seconds of audio) and
   delivered with deliberate institutional restraint — Elara
   reading from prepared remarks, knowing her testimony is
   under oath, knowing the redactions she has accepted. The
   warmth that defines her Prelude voice is **almost
   entirely absent** here. Production note: this is the
   Elara who will, years later, become the AI narrator the
   player meets in the Prelude. She does not yet know what is
   coming.

The three channels never speak simultaneously. Wayne and the
chorus alternate cleanly (Wayne speaks, then the chorus
responds, or vice versa). Elara's recording plays only when
her evidence card is tabled and is fully heard before any
further channel speaks. The Engineer in C4 has no spoken voice
during the trial itself — his only "speech" is his ritual
plea (see Pre-Match Line below) and his card plays. Production
must hold his silence deliberately; in a chamber this loud
with judgment, the Engineer's quiet is the player's
inheritance.

**Canonical pre-match line — Wayne Warden** (INFERRED from the
data shell preMatchLine *"What do you say to the charges?"*,
extended for production):

> *"The defendant will rise. The chamber is in session under
> the seal of the Authority, the New Babylon Tribunal, and
> the six elders in attendance. The charges have been entered
> into the record and read in absentia. What do you say to
> the charges?"*

Delivered in the administered baritone, eyes on the evidence
stack, hands folded. The line is the standard Authority
arraignment script — Wayne has read it approximately four
hundred times in his career. There is no theater in the
delivery. Production must resist any urge to make the moment
weighted; the *weight* is what the Engineer brings to it,
not what Wayne does. Wayne is reading the script.

**Canonical pre-match line — the Engineer's plea** (INFERRED,
delivered in the Prince voice profile §2.1):

> *"I will let the deck answer."*

Six words, level, no inflection. The ritual phrasing the
Tribunal accepts when a defendant invokes the right to defend
by Dischordia. The Engineer does not stand. He does not look
up. He places his deck on his knee and waits. The chorus
then speaks (next line below), and the match begins.

**Canonical opening — the Authority chorus** (INFERRED):

> *"So entered. The deck will answer. The Tribunal calls."*

Spoken in unison by all six elders without their eyes
opening. The amber pulse from the coffins surges visibly on
each syllable. The chorus is the player's first encounter
with the unison-voice technique that will recur in Acts 6 and
7; production must establish it cleanly here.

**Deck theme:** **"Trial format — delay over destroy."** The
mechanic is summarized in the Tribunal mechanics block above
and detailed in §15. The tutorial lesson C4 is teaching the
player is "**some battles are not won, they are *survived
long enough to record what happened*.**" The Engineer's
optimal play is not aggressive; it is patient, thematic
counter-play, holding cards back for the right evidence
moments. *The Friend I Saved* (§2.12 unlock) is canonically
**not the right card to play in C4** — a player who burns it
on a jury card has misread the moment. The match has its own
unique unlocks waiting; the Mythic Light from §2.12 is for
later use against Vex Solène, not for use against the
Tribunal.

**Card unlock — guaranteed** (NOT win-gated; both paths
unlock the same card): ***The Last Word*** (Mythic Light —
the second and final Mythic Light card of Act 1, alongside
*The Friend I Saved* from §2.12). The card unlocks at the
moment the C4 match resolves (verdict passed, or Tribunal
recessed). The card body:

- **Name:** The Last Word
- **Rarity:** Mythic Light
- **Type:** Memory unit / Cinematic trigger
- **Cost:** 0 (free play)
- **Effect:** Once per game — **and only once** — when the
  player plays *The Last Word*, the **Last Words slideshow
  fires** (15 frames, ~3m 30s, the master Cycle C finale,
  +500 Light Energy galaxy-wide community spike per §1.1).
  The card is consumed after one play and cannot be drawn
  again.
- **Mechanical effect during the play that triggers the
  slideshow:** the current match (whatever it is) is
  **paused** for the slideshow's duration. After the
  slideshow resolves, the match resumes with the player
  granted +5 to all subsequent card plays for the remainder
  of that match. (Mechanically: the Engineer's recorded last
  words inspire the Engineer's heir at the table, whoever
  that may be in the moment of play.)
- **Flavor text (procedural, varies by C4 outcome):**
  - **Win path** (Tribunal recessed, Engineer earned the
    delay): *"He recorded it because they let him. He
    recorded it for everyone."*
  - **Loss path** (verdict passed, Engineer recorded under
    duress): *"He recorded it because they made him. He
    recorded it for the one person they did not know was
    listening."*
- **Card art (referenced; full prompt in §22.3):** a single
  microphone on a polished black stone surface, captured in
  warm-yellow Authority spotlighting, with the verdict
  scroll visible in soft focus behind it. The microphone
  shows a faint condensation halo around the diaphragm — the
  Engineer is breathing into it. No people visible.

The card is the most narratively-loaded card in the entire
game — its first play *is* the *Last Words* cinematic. Players
who hold it for the right moment are rewarded with a
contextual integration the player who plays it on day one
will not get; the slideshow's introductory frame includes a
small textual epigraph naming the match the player was in
when they triggered it. Players who never play *The Last Word*
will see the *Last Words* slideshow at the start of Act 5
regardless (per Year One Calendar Month 6 — fallback trigger),
but the +5 mechanical reward and the personalized epigraph
land only on player-triggered plays.

**Post-match canonical beats** — note: C4 is the **only** Cycle
C match where **both** outcomes are canonically reachable. The
Tribunal can pass sentence (loss) or run out of evidence
(win). Both paths lead into the *Last Words* slideshow finale,
but the framing is meaningfully different. Production must
fully spec both branches.

- **Win (Tribunal recessed, Engineer earned the delay):** the
  evidence stack runs out. Wayne reaches for the next card,
  finds none, and pauses — the only moment in the entire
  match his hands are visible above the bench *without* a
  card in them. The amber pulse from the coffins falters,
  drops out of unison for a single beat, returns. Wayne does
  not consult the chorus. He removes his biretta cap, sets
  it on the bench in front of him, and looks at the Engineer
  for the second canonical glance of the match.

  Wayne Warden (administered baritone, the warmth ticked up
  exactly one fraction — the only emotional movement he will
  show in the entire trial):

  > *"The Tribunal has not been outmatched in this chamber in
  > nineteen years. The deck has answered. The Authority will
  > consult and reconvene. You will be returned to holding."*

  The Authority chorus (in unison, amber pulse surging):

  > *"Recess. The deck remembers. The Tribunal withdraws."*

  The two New Babylon guards approach the Engineer's chair.
  The Engineer stands. Production must compose the shot so
  the player sees the Engineer's face for the first time in
  several minutes — he is not triumphant, he is *exhausted*.
  The Engineer is escorted toward the chamber doors. As he
  passes the bench, Wayne speaks once more, quietly, only to
  him (the chorus does not speak; this line is Wayne's
  private):

  > *"You have until morning to decide what you want recorded.
  > A microphone will be brought to your cell. Use it well."*

  The Engineer nods once, does not respond, and is led out.
  Cut to black.

  *(The next thing the player sees is the matchup card for
  the Cycle C finale slideshow* ***Last Words****, fired
  immediately. The win-path framing is canonical: the
  Engineer recorded* Last Words *in his cell overnight, in
  privacy, because the Tribunal granted him the delay. His
  recording is composed, deliberate, addressed to the entire
  galaxy. The slideshow's win-path opening frame includes
  the textual epigraph* "Recorded under recess, Tribunal
  Cell 7, the night before sentence." *Per §17 the slideshow
  itself does not branch on win/loss — only the opening
  epigraph does.)*

- **Loss (verdict passed, Engineer's recording is taken under
  duress):** the verdict scroll fills. Wayne reaches for the
  scroll, lifts it, and reads — eyes on the parchment, not
  on the Engineer:

  > *"The defendant is found guilty under all entered
  > charges. Sentence: termination, by Authority protocol,
  > to be carried out at first light. The deck has answered.
  > The Tribunal records its decision."*

  The Authority chorus (in unison, amber pulse surging
  brighter than at any previous moment):

  > *"Sentence. The deck has spoken. The Tribunal closes."*

  Wayne removes his biretta cap, sets it on the bench, and
  looks at the Engineer for the second canonical glance of
  the match — the same glance as in the win path,
  *identical in composition*, but the line that follows is
  different. The warmth tick is absent. He is reading from
  procedure:

  > *"You will be granted a final recording before
  > execution. Authority protocol. The microphone will be
  > present in the chamber. You may speak for as long as
  > the recording medium allows. Begin when ready."*

  The two New Babylon guards approach the Engineer's chair
  but do not lift him. A third figure — a Records Officer
  in plain charcoal robes, no insignia — enters from a side
  door carrying a small recording device on a tripod. The
  device is set in front of the Engineer's chair. The
  Records Officer steps back into shadow. The Engineer is
  alone in the spotlight with the microphone. Cut to black.

  *(The next thing the player sees is the matchup card for
  the Cycle C finale slideshow* ***Last Words****, fired
  immediately. The loss-path framing is canonical: the
  Engineer recorded* Last Words *in the Tribunal chamber, in
  full view of Wayne and the six elders, with the gallery
  empty and the microphone only inches from his face. His
  recording is more raw, more direct, addressed to one
  specific listener. The slideshow's loss-path opening frame
  includes the textual epigraph* "Recorded under sentence,
  Tribunal Chamber, in the hour before execution." *Per §17
  the slideshow content is identical between branches — the
  only canonical difference is the opening epigraph and the
  ambient room tone of the recording (cell-private vs.
  chamber-public).)*

**The "one specific listener" reading on the loss path** is
canonically Vex Solène, whether the Engineer knew it or not.
The recording survives in the Vortex wreckage that Vex
recovers in Act 5 (per `CANON_REV_7_ORACLE_VEX_EXPANSION.md`
§5 Log 5, the Engineer's recovered final monologue). Production
should hold this reading in mind for the loss-path slideshow's
direction notes (deferred to §17), but must not surface it in
C4 itself — the player has not yet been given the framing
that lets them read it that way.

**Cross-references:**

- §0.4 (general canon hygiene; this section adds the four C4-
  specific rules above)
- §1.1 (Master Index entry for C4 — Trial format, Wayne
  Warden, Elara as evidence card, *The Last Word* unlock)
- §2.0 (simulation framing — Wayne Warden is the canonical
  *non-Archon adult tribunal figure*; the only Act 1
  antagonist meaningfully older than the Engineer)
- §2.1 (The Prince — the Engineer's voice profile and
  silence discipline; he speaks only the six-word ritual
  plea in C4)
- §2.10 (Vernon Vortex — *The Standstill* card unlock from
  C1, canonical counter to evidence card *"The Engineer
  abandoned his post at Nexon"*; production must hand-author
  the full counter-table per §15)
- §2.12 (Warlord's Nano-Swarm — *The Friend I Saved* unlock,
  in the Engineer's deck for C4 but **not the right card to
  play here**; design intent is to reserve it for Act 3 F3
  against Vex Solène)
- §6 / §12 / §17 (Cycle finale slideshow specs — *Welcome to
  Celebration*, *To Be the Human*, and *Last Words* respectively;
  C4 resolves into §17 *Last Words* via *The Last Word* card
  trigger or via the Year One Month 6 fallback)
- §16 (Cycle C4 battle section — full Trial-format ruleset,
  jury card list, twelve evidence cards with their thematic
  counters, the verdict-scroll mechanic, the per-turn ink
  accumulation rules; this section is the player-facing
  visualization, §16 is the engineering spec)
- §18 (Act 1 Finale — the post-*Last Words* "YOUR NAME"
  Unwritten card pedestal interaction; C4 + *Last Words*
  resolves into §18, closing Act 1)
- §22.3 (Asset Delivery Checklist — *The Last Word* card art
  prompt, Elara's evidence card art prompt with age-
  regressed deposition booth reference, Wayne Warden
  character portrait + bench composition reference, the six
  crystal coffins array reference, the New Babylon Tribunal
  chamber wide-shot reference)
- §23.1 (Canon drift — `apps/shared/act1Opponents.ts` slot 12
  is currently `the_authority` with a generic Tribunal
  framing; per the §1.1 master index the C4 opponent is
  `wayne_warden` with the institutional Authority chorus as
  a backing voice channel rather than the named opponent.
  The data shell needs a follow-up code PR to rename slot
  12, add the chorus-reference field, and add the trial-
  format flag distinguishing C4 from the standard duel
  ruleset.)
- Prelude Bible §2.2 (Elara voice profile — the canonical
  source for the `elara` ElevenLabs spec that the C4
  deposition recording age-regresses)
- Prelude Bible §0.4 rule "the Bond-40 milestone" (the
  canonical reference for Elara's Atarion public-servant
  background; the C4 evidence card is the Act 1 surfacing of
  that backstory, ahead of the Bond-40 reveal which lands
  in Act 2+)
- `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5 Log 5 (the
  Engineer's recovered final monologue from the Vortex
  wreckage — the canonical text of the *Last Words*
  recording; loss-path framing implies the Tribunal-chamber
  recording survived to be recovered, win-path framing
  implies the cell-private recording was duplicated and
  distributed before execution)

---

## Section 3 — Cycle A1 Battle Section (Minnie the Meme)

The engineering spec for A1. Section 2.2 authored the character;
this section specifies the match — per-turn shape, deck list
summary, animation cues, VO CSV rows, VFX, art / cutscene
deliveries, and the Celebration-Trial buff/debuff inputs.

### 3.1 Narrative purpose

A1 is the **tutorial battle of Act 1**. The player has just
exited the Prelude with a known card-game vocabulary from the
Prelude tutorial; A1's job is to introduce three new concepts
without breaking flow:

1. **Archon-tier opponents** (the "cosmic being wearing a child"
   framing, per §2.0)
2. **Celebration Trial modifiers** (buffs/debuffs fed into the
   match from the parallel 28-day Mascoteer loop, §19)
3. **Per-opponent deck identity** (Minnie's `thought_virus`
   leaning is the first time the player sees a deck *about*
   something rather than balanced)

Minnie is canonically winnable on a blind first attempt — the
tutorial framing is strict. Her deck is aggressive but
shallow; a player who defends reasonably should survive. The
design target is **85% first-attempt win rate** in playtest;
balance tuning sits in `apps/shared/act1Opponents.ts` cycle-A
block and is out of scope for this doc.

### 3.2 Per-turn flow (nominal 9-turn match)

- **Turn 1 (Minnie opens):** *"Rent Free"* — a single
  low-cost unit that forces both players to *replay* one of
  their last turn's cards. In turn 1 there is nothing to
  replay, so the effect is cosmetic; production uses the turn
  1 play as the **tutorial moment** for the forced-unison
  mechanic (see §3.4 Cutscene). Minnie giggles.
- **Turn 2 (Engineer opens actively):** first player deploys
  from their starting hand. Minnie responds with *"Viral
  Chant,"* a unit that duplicates itself each turn the
  opponent does not kill it.
- **Turns 3–5:** Minnie's viral chant units stack; Engineer
  must commit board-clear effects or lose tempo. Canonical
  win condition: Engineer clears all Viral Chant copies on
  turn 5.
- **Turns 6–8:** Minnie deploys *"Rent Free"* a second time,
  forcing Engineer to replay the cards they just used for
  board-clear. Tutorial lesson: hold one response in reserve.
- **Turn 9 (canonical resolution):** Minnie's hand is empty.
  Engineer plays any remaining unit for lethal.

Loss paths are also canonical (losses do not block progress in
Act 1; the biography continues) and are spec'd in §3.5 as a
single catch-all VO beat.

### 3.3 Art sub-spec

**Opponent portrait (matchup card):** seven-year-old Minnie in
three-quarter profile, Minnie Mouse ears, earnest expression,
holding up one card face-down in her right hand. Warm-gold
Celebration schoolyard lighting behind her, faint bokeh of
a Mascoteer parade float in the background. Full prompt in
§22.3.2.

**Battlefield:** Celebration Trial schoolyard — outdoor card
table, two low benches, warm-gold afternoon light, Celebration
parade banners hanging limp in the background, approximately
2:00 PM lighting. No other children visible (the tutorial
framing keeps the composition clean). Full prompt in §22.1.1.

**Pre-battle matchup splash still:** Minnie portrait composited
left, schoolyard battlefield right, title card *"Cycle A1 —
Minnie the Meme"* in the Act 1 global style anchor font.

### 3.4 Cutscene sub-spec

**Pre-match cutscene (0:00–0:35):** 8-second establishing shot
of the Celebration schoolyard at Day 10 of the Trial, then a
12-second beat of Minnie setting up her side of the card
table while the Engineer approaches. Minnie looks up, says her
pre-match line (§2.2), and sits. The Engineer sits opposite.
Fade into match.

**Turn-1 tutorial overlay (triggered in-match, first play
only):** a 3-second pop-up explaining Minnie's *Rent Free*
mechanic, using the forced-unison visual vocabulary. Dismissed
by any input.

**Post-match cutscene — win (0:00–0:25):** Minnie's viral chant
stalls, her hand is empty, she looks at the Engineer and says
her post-match win beat from §2.2 (the "let me see" chant
stall). Fade to Celebration Trial day-10-complete banner.

**Post-match cutscene — loss (0:00–0:20):** Minnie laughs,
plays one more card the Engineer cannot respond to, and the
match ends on her laugh. Fade to the "try again" screen with
the Celebration Trial modifier unchanged.

### 3.5 VO sub-spec (ElevenLabs CSV rows)

Voice profile: **`minnie_meme`** (new; see §2.2 for the
ancient-viral-amused direction and ElevenLabs settings). Six
lines total for A1, canonical IDs `vo_a1_minnie_*`:

| ID | Line | Direction |
|---|---|---|
| `vo_a1_minnie_prematch` | §2.2 pre-match line | earnest, performative slam on the final word |
| `vo_a1_minnie_turn1` | *"Rent free. Rent free forever."* | sing-song, two-beat repeat |
| `vo_a1_minnie_turn5` | *"You cleared them! That was rude."* | delighted, not wounded |
| `vo_a1_minnie_turn9_win` | §2.2 post-match win beat (full) | the chant stalls; deliver the stall |
| `vo_a1_minnie_turn9_loss` | §2.2 post-match loss beat (full) | the laugh; hold it long |
| `vo_a1_minnie_ambient` | *"Let me see."* (×3, randomized playback during match idle) | 4-second interval loop |

All six rows will be exported in the batch CSV per
`apps/client/src/lib/voCsv.ts` (PR #100's generator).

### 3.6 VFX sub-spec

Three A1-specific VFX cues; full library spec in §21.

- **Minnie's earnest-giggle particle:** small warm-gold confetti
  burst on every card Minnie plays (6–10 particles, 0.3s
  duration, dissipates upward). Authorized for reuse in §19
  Celebration Trial day illustrations.
- **Viral Chant duplication effect:** soft pink "heart-meme"
  bloom behind each new Viral Chant copy (1.2s, 20% opacity,
  additive blend).
- **Rent Free forced-unison highlight:** brief 0.8s cool-cyan
  underline on both replaying cards when the effect triggers.
  Tutorial-frame only; the highlight is suppressed on Turn 6
  (when the mechanic is familiar).

### 3.7 Celebration Trial modifier inputs (§19 handoff)

A1 is the first of three Celebration-Trial-gated matches. The
player's Mascoteer bond state at Day 10 of the Trial feeds
the following modifiers into the A1 deck:

| Mascoteer bond at Day 10 | Modifier |
|---|---|
| Minnie bond ≥ 3 | Minnie opens with *"Viral Chant"* instead of *"Rent Free"* (easier, lower tutorial-weight) |
| Minnie bond ≤ −2 | Minnie opens with *"Rent Free"* + a 2-cost unit tag (harder) |
| Any non-Minnie bond ≥ 5 | Engineer starts with +1 card in hand |
| Apprentice alive at Day 10 | Engineer's hand includes the Memory Card (procedural; see §20) |

The actual Mascoteer roster and bond mechanics live in
`apps/shared/mascoteers.ts` and are not duplicated here. §19
carries the 28-day decision tree that surfaces the bond values.

---

## Section 4 — Cycle A2 Battle Section (Corey the Collector)

The engineering spec for A2. Section 2.3 authored the character;
this section specifies the match — per-turn shape, deck list
summary, the "Choose Your Mask" memory-card sacrifice mechanic,
Celebration-Trial modifier inputs.

### 4.1 Narrative purpose

A2 is the first **emotional-cost** match in Act 1. Where A1
taught board-control, A2 teaches **what the player is willing
to give up to win**. Corey's deck runs the *Choose Your Mask*
mechanic — each turn Corey plays, the Engineer must sacrifice
a card from their own hand *face-down* into Corey's jar. The
sacrificed cards are not destroyed; Corey collects them. The
Engineer can refuse the sacrifice, but doing so costs board
tempo. The tutorial lesson: **some opponents win by making you
choose, not by outplaying you**.

### 4.2 Per-turn flow (nominal 10-turn match)

- **Turn 1 (Engineer opens):** standard deployment.
- **Turns 2–4 (Corey escalates collection):** Corey plays three
  low-cost units in sequence, each tagged with *Choose Your
  Mask*. Each trigger forces a sacrifice choice from the
  Engineer's hand. Production must render each sacrifice as a
  distinct card-into-jar animation (see §4.6 VFX).
- **Turns 5–7 (Engineer pushes):** Engineer deploys from the
  remainder of their hand. The jar is now visibly heavier on
  Corey's side.
- **Turns 8–9 (Corey opens the jar):** Corey plays *"Your
  Memories, Now Mine"* — a unit that takes the top card from
  his jar and deploys it on his side as his own unit. The
  cards the Engineer sacrificed now attack the Engineer.
- **Turn 10 (canonical resolution):** if the Engineer has held
  back a high-value card from sacrifice, lethal is
  achievable. If the Engineer sacrificed wastefully, the
  match goes to Corey.

### 4.3 Art sub-spec

**Opponent portrait:** seven-year-old Corey in three-quarter
profile, holding an amber glass jar in both hands. The jar
contains what look like small translucent coins with faint
internal imagery. Corey's expression is *grateful* — he is
thanking the Engineer for playing. Full prompt in §22.3.3.

**Battlefield:** same Celebration schoolyard as A1 (shared
battlefield), but afternoon light has shifted to 4:30 PM
(warmer, lower angle, longer shadows). The parade banners in
the background show different colors than A1 — Day 20 is a
different Celebration Trial phase. Full prompt in §22.1.1.

### 4.4 Cutscene sub-spec

**Pre-match cutscene (0:00–0:30):** 10-second beat of Corey
setting up his jar on the corner of the card table, 10-second
beat of him arranging his deck, 10-second beat of him looking
up and delivering the §2.3 pre-match line. The jar catches
the light deliberately in frame.

**Turn-2 tutorial overlay:** 4-second pop-up explaining
*Choose Your Mask* — the player selects a card from their
hand to sacrifice. Tutorial-suppressed after first trigger.

**Post-match cutscene — win (0:00–0:30):** Corey's jar cracks.
He picks up the pieces carefully. §2.3 post-match win beat.
The jar pieces glow faintly gold before going dark.

**Post-match cutscene — loss (0:00–0:20):** Corey's jar grows
by exactly one coin — a new translucent coin with a faint
image of the Engineer's own face on its face. §2.3 post-match
loss beat. The jar is heavier, and Corey is pleased.

### 4.5 VO sub-spec (ElevenLabs CSV rows)

Voice profile: **`corey_collector`** (new; see §2.3). Seven
lines, canonical IDs `vo_a2_corey_*`:

| ID | Line | Direction |
|---|---|---|
| `vo_a2_corey_prematch` | §2.3 pre-match line | gentle, patient, the currency line |
| `vo_a2_corey_turn2_first` | *"Give me one. Just one. Any one you like."* | encouraging, soft |
| `vo_a2_corey_turn5_jar` | *"The jar is heavy now. Thank you."* | grateful, not smug |
| `vo_a2_corey_turn8_return` | *"Oh — here comes one back. Do you remember it?"* | almost sad |
| `vo_a2_corey_turn10_win` | §2.3 post-match win beat | quiet, a promise kept |
| `vo_a2_corey_turn10_loss` | §2.3 post-match loss beat | soft, contented |
| `vo_a2_corey_ambient` | *"Thank you for playing."* (×4, idle loop) | unvaried tone |

### 4.6 VFX sub-spec

- **Jar-sacrifice animation:** 1.2s card-into-jar motion on
  every *Choose Your Mask* trigger — the sacrificed card
  lifts from the Engineer's hand, shrinks to coin-size,
  drops into the jar. The coin's face briefly shows the
  original card's art before settling face-up at the jar's
  floor.
- **Jar-fill lighting:** the jar's interior light intensifies
  with each coin added. By turn 7, the jar casts a warm amber
  glow onto Corey's hands. Production must hold the light
  consistent across the match.
- **"Your Memories, Now Mine" deployment effect:** when Corey
  returns a sacrificed card as his own unit, the card emerges
  from the jar with a brief 0.6s amber halo and the
  deployment position is rimmed in warm gold for the
  remainder of the match. This is the player's visual signal
  that the returned unit is specifically *theirs*.

### 4.7 Celebration Trial modifier inputs (§19 handoff)

| Mascoteer bond at Day 20 | Modifier |
|---|---|
| Corey bond ≥ 3 | Corey offers the Engineer a "first taste" — Engineer may pre-select one card as permanently jar-immune for the match |
| Corey bond ≤ −2 | Corey triggers *Choose Your Mask* twice on turn 1 (harder opening) |
| Apprentice still alive at Day 20 | Engineer's Memory Card (§20) is jar-immune by default |
| Minnie bond ≥ 5 from A1 | Engineer starts with +1 card (carry-forward from A1 mod) |

---

## Section 5 — Cycle A3 Battle Section (Kanshi Sha the Watcher)

The engineering spec for A3 — the Cycle A finale boss, the
first match that is **actively hard** on a first attempt, and
the trigger for the *Welcome to Celebration* master slideshow
(§6). Section 2.4 authored the character; this section
specifies the match, the Ocularum mechanic, and the
slideshow-trigger handoff.

### 5.1 Narrative purpose

A3 is **graduation day** — the Engineer's Celebration Trial
ends with a card match against the child-form Archon of the
Watcher. The tutorial lessons compound: A1 taught board-
control, A2 taught emotional-cost, A3 teaches **information
warfare**. Kanshi Sha plays with zero hidden cards on her
side — her entire hand is face-up from turn 1 — and her deck
forces the Engineer's hand face-up in stages. By turn 5 both
players are playing open. The lesson: some opponents *want*
you to see the board, because they have already calculated
every line and yours is shorter than theirs.

A3 is the **first canonical difficulty spike**; the design
target is 40% first-attempt win rate. A3 is winnable on a
first attempt but not easily, and the Act 1 pacing depends on
the player experiencing one real loss in Cycle A to set up the
Cycle B emotional shift.

### 5.2 Per-turn flow (nominal 12-turn match)

- **Turn 1 (Kanshi Sha opens face-up):** she deploys three
  face-up units simultaneously — the *Ocularum Trio* —
  declaring the opening. Her entire hand (8 cards) is
  visible to the Engineer from this point forward.
- **Turn 2 (Engineer forced face-up):** the Ocularum Trio's
  passive effect reveals the Engineer's hand one card at a
  time — one card per turn, starting turn 2. By turn 5 the
  Engineer is fully face-up.
- **Turns 3–7 (pressure phase):** Kanshi Sha plays optimal
  lines against the revealed cards. Engineer must adapt
  to being readable.
- **Turns 8–10 (reveal-on-proximity counter window):** the
  Engineer's A3-specific unlock window — deploying certain
  A1/A2-unlocked units in proximity to the Ocularum Trio
  *blinds* them for one turn, restoring hidden-card play.
  This is the canonical win line.
- **Turns 11–12:** lethal window if the blind window was
  used correctly.

### 5.3 Art sub-spec

**Opponent portrait:** seven-year-old Kanshi Sha in three-
quarter profile, wearing the half-finished white Ocularum
mask (canonical per the existing data shell). Left half of
mask covers forehead and left eye; right half of face is
the child's own, visible. Expression: calm, attentive, the
cosmic Watcher's signature non-blink. Full prompt in
§22.3.4.

**Battlefield:** Celebration schoolyard graduation pavilion —
outdoor raised platform with Celebration graduation banners,
low-angle evening light (approximately 6:30 PM, Day 28 of
the Trial), parents and Mascoteers visible in soft focus at
the edges (this is the one Cycle A battlefield with
witnesses, because graduation is a public event).

### 5.4 Cutscene sub-spec

**Pre-match cutscene (0:00–0:45):** establishing the
graduation pavilion, the Celebration crowd, the two card
tables set up on the platform. Kanshi Sha takes her seat
first. The Engineer approaches. Kanshi Sha delivers her
§2.4 pre-match line. The mask catches the warm-gold
evening light and the half of her face it covers reads as a
single white surface.

**Turn-1 tutorial overlay:** 5-second pop-up explaining the
face-up-hand mechanic. The tutorial is sticky — it remains
visible for the first three turns in a corner of the UI.

**Post-match cutscene — win (0:00–0:40):** Kanshi Sha
lowers her mask. Under the mask is a child's face about to
cry (§2.4 canonical post-match win). She does not cry; she
holds the expression for three full seconds, then her
composure returns. She stands, bows formally, hands the
Engineer a small folded paper. The paper is blank on both
sides (it is *The First Card* — see §5.5).

**Post-match cutscene — loss (0:00–0:30):** Kanshi Sha
raises her mask (§2.4 canonical post-match loss). The mask
becomes fully opaque; the player does not see under it. She
stands, bows, and walks from the pavilion without a word.
Graduation proceeds without the Engineer on the stage.

### 5.5 Card unlock integration — *The First Card*

A3's canonical unlock is *The First Card* — an Epic Light
card with **3 random effects on play**, canonically the
*first blank card* the Engineer's deck ever contains. On
win, the folded-paper handoff animation in the post-match
cutscene is the in-fiction source of the card. On loss, the
card still unlocks (canonical per the §1.1 master index) but
the handoff cutscene is suppressed — the card simply appears
in the player's deck between matches, with a note that
Kanshi Sha "left something behind." The design intent:
*The First Card* is a **gift**, not a reward for winning;
Kanshi Sha gives it either way. The player may not
consciously notice the difference until replay.

### 5.6 VO sub-spec (ElevenLabs CSV rows)

Voice profile: **`kanshi_sha_watcher`** (new; see §2.4 —
calm, slightly-too-old child voice). Eight lines, canonical
IDs `vo_a3_kanshi_*`:

| ID | Line | Direction |
|---|---|---|
| `vo_a3_kanshi_prematch` | §2.4 pre-match line ("I have been watching…") | calm, factual, the "sixteen versions" count unemphasized |
| `vo_a3_kanshi_turn1` | *"All three open. We can see each other now."* | informational |
| `vo_a3_kanshi_turn5` | *"Your hand is open. Mine has always been."* | the canonical philosophy line |
| `vo_a3_kanshi_turn8_blinded` | *"That was — unexpected. Good."* | the single warm beat |
| `vo_a3_kanshi_turn12_win` | §2.4 post-match win beat | she does not cry; hold the line steady |
| `vo_a3_kanshi_turn12_loss` | §2.4 post-match loss beat | the mask raises; voice is muffled under it |
| `vo_a3_kanshi_ambient` | *"I am still watching."* (×3, idle loop) | unvaried tone |
| `vo_a3_kanshi_slideshow_bridge` | *"You have graduated. The next place is bigger."* | post-match, leading into §6 *WTC* |

### 5.7 VFX sub-spec

- **Ocularum Trio deployment:** three bone-white mask
  fragments materialize above Kanshi Sha's battlefield
  slots on turn 1, each with a single slow blink (1.0s
  open, 0.5s closed) before locking open. The masks remain
  open for the entire match unless blinded (§5.7 below).
- **Face-up reveal effect:** a soft white glow traces the
  edges of each Engineer card as it is revealed. One card
  per turn, starting turn 2, in the order the Engineer
  drew them.
- **Blind-window effect:** the canonical A3 counter — when
  a reveal-on-proximity A1/A2 unit is deployed adjacent to
  an Ocularum mask, the mask closes for one turn and a soft
  warm-gold overlay lifts over the Engineer's hand,
  restoring hidden play. The effect's 0.8s close-and-
  overlay animation is the A3 signature VFX.
- **Mask-lower / mask-raise (post-match):** the win/loss
  mask animation is rendered in-cutscene rather than in-
  match, but uses the same mask rig as the Ocularum Trio
  for continuity.

### 5.8 Slideshow trigger handoff to §6

A3's canonical `postBattleSlideshow` flag is
`"welcome-to-celebration"` per `apps/shared/act1Opponents.ts`.
Production must ensure the slideshow fires **immediately** on
post-match cutscene completion — win and loss both trigger
the slideshow; it is the Cycle A finale regardless of match
outcome. The match state that feeds the slideshow's
optional-frame selection (see §6.3) is:

| State | Slideshow branch |
|---|---|
| A3 win + apprentice alive | frames 1–8 all present; frame 4 emphasizes Mascoteer bonds |
| A3 win + apprentice dead | frames 1–8 all present; frame 4 substituted with the Memory Card beat |
| A3 loss + apprentice alive | frames 1–8 with frame 3 substituted with "the graduation the Engineer missed" |
| A3 loss + apprentice dead | frames 1–8 with both frame 3 and frame 4 substituted |

The four-way branching logic is spec'd in §6.3 and implemented
in `apps/shared/songSlideshow.ts`.

### 5.9 Celebration Trial modifier inputs (§19 handoff)

| Mascoteer bond at Day 28 | Modifier |
|---|---|
| Cumulative Mascoteer bond ≥ 15 (across all 6) | Engineer starts with 1 Ocularum-blind charge pre-allocated |
| Minnie bond ≥ 5 + Corey bond ≥ 5 | Engineer hand-draw is +1 card for the first 3 turns |
| Cumulative bond ≤ 0 | Kanshi Sha's Ocularum Trio reveals 2 cards per turn instead of 1 (harder) |
| Apprentice alive at Day 28 | Memory Card (§20) is reveal-immune — the Ocularum Trio cannot see it |

---

## Section 6 — *Welcome to Celebration* (Cycle A finale slideshow)

The first of Act 1's three master slideshows. 8 frames,
approximately 2 minutes 15 seconds total runtime, fires
immediately after §5 Cycle A3 completion regardless of match
outcome. The slideshow is the **first long-form cinematic**
Act 1 delivers and sets the tonal grammar for §12 *To Be the
Human* and §17 *Last Words* that follow.

### 6.1 Narrative purpose

*Welcome to Celebration* is structured as the Engineer's own
retrospective memory of his Celebration school years — 28 days
compressed into a sequence of images that the adult Engineer
(narrating in-fiction from his Ark 7 exile) edited together
before his death. The slideshow is not a documentary; it is
a curated artifact. The player understands by the end that
they are watching what the Engineer *chose to remember*, with
the emotional weight the Engineer assigned rather than the
weight the events might have objectively carried. Minnie,
Corey, and Kanshi Sha each appear — not as adversaries, but
as classmates the Engineer is forgiving in retrospect.

Narrator: the Engineer (Prince voice profile, §2.1), in the
mature tonal register. Sparse narration — approximately 12
sentences total across the 8 frames — with long stretches of
ambient room tone and distant Celebration music. The
slideshow is an **image-first** delivery; narration supports
rather than drives.

### 6.2 Frame-by-frame spec

| # | Frame | Duration | Narration | Audio bed |
|---|---|---|---|---|
| 1 | Celebration school gate at sunrise, Day 1 of the Trial. Empty path leading in. Warm gold, long shadows. | 18s | *"They called it Celebration. They called everything that."* | distant parade drums, 0.5× tempo |
| 2 | The Engineer as a child (age seven, see §2.1.2), walking through the gate alone. Back to camera. The Celebration banners overhead. | 22s | *"I was supposed to be ready for this. I was not."* | parade drums rise, one child laughs off-camera |
| 3 | Close-up of a card table at the schoolyard — Minnie Mouse ears on one chair, nobody seated yet. | 15s | (silence; room tone) | schoolyard ambient, light wind |
| 4 | The Mascoteer bond montage — six portraits of the Mascoteers in soft-focus sequence, each held 2s. (Frame substituted on apprentice-dead branch, see §5.8.) | 14s | *"You learn who is on your side before you learn what sides there are."* | Mascoteer parade march, uptempo |
| 5 | Graduation pavilion at Day 28, empty, evening light, the two card tables set up for A3. | 18s | *"They graduate you whether or not you pass."* | distant crowd murmur |
| 6 | Kanshi Sha's white mask, close-up, mid-air (disconnected from her face, stylized memory composition). | 12s | *"Some of us took off the mask. Some of us did not."* | single sustained tone, warm gold ringing |
| 7 | The Engineer (age seven) walking out of the pavilion, back to camera again, a folded paper in his hand (The First Card). | 18s | *"They gave me my first card the day I graduated. It was blank. I kept it."* | parade drums return, full tempo |
| 8 | Distant shot of Celebration at night — the whole school lit warm-gold, parade banners drifting in the evening breeze, the Engineer's silhouette walking toward the exit. | 18s | *"I did not know I was leaving. Nobody told me."* (pause) *"Welcome to Celebration."* | parade drums fade to silence |

**Total runtime:** 135 seconds (2:15).

### 6.3 Branch logic (from §5.8 handoff)

Four canonical branches based on A3 outcome × apprentice state:

- **A3 win + apprentice alive:** all 8 frames as spec'd above.
  Frame 4 uses the six-Mascoteer-portrait composition; frame
  7 includes an apprentice cameo in soft focus beside the
  Engineer.
- **A3 win + apprentice dead:** frame 4 substituted with a
  single close-up of the **Memory Card** — the procedurally-
  named Epic Light card that spawns from apprentice
  permadeath (§20). Narration on frame 4 becomes *"You learn
  who is on your side before you learn what sides there are.
  Sometimes you learn after."*
- **A3 loss + apprentice alive:** frame 3 substituted with
  *"the graduation the Engineer missed"* — a 15-second beat
  of the pavilion seen from below, the Engineer's wooden
  chair visibly empty on stage. Narration on frame 3 (now
  present where it was silent): *"They called my name. I did
  not come up."* Frames 4–8 otherwise unchanged.
- **A3 loss + apprentice dead:** both frame 3 and frame 4
  substitutions applied. Frame 7's apprentice cameo is
  suppressed; the Engineer walks out alone.

All four branches share frames 1, 2, 5, 6, 8 verbatim. The
engineering implementation in `apps/shared/songSlideshow.ts`
should reference this branch table as the canonical source of
truth.

### 6.4 Art sub-spec

8 frame stills at 1920×1080 / 16:9 / 4K, warm-gold
Celebration palette. Plus:
- 1 Memory Card variant still for frame 4 (apprentice-dead
  branch)
- 1 empty-pavilion variant still for frame 3 (A3-loss branch)

Full prompts in §22.2.1. The slideshow assets share the Act
1 Global Style Anchor (§0.3) with one adjustment: the
Celebration parade palette permits a slightly warmer
saturation bump (+10% on the warm-gold channel) specific to
this slideshow's retrospective framing.

### 6.5 VO sub-spec (ElevenLabs CSV rows)

Voice profile: `the_prince` (§2.1, mature register). Twelve
sentences total; all narration IDs `vo_wtc_narration_*`:

| ID | Line | Frame | Direction |
|---|---|---|---|
| `vo_wtc_narration_1` | *"They called it Celebration. They called everything that."* | 1 | reflective, light irony |
| `vo_wtc_narration_2` | *"I was supposed to be ready for this. I was not."* | 2 | matter-of-fact, no self-pity |
| `vo_wtc_narration_3` | *"They called my name. I did not come up."* | 3 (loss branch only) | flat, no defense |
| `vo_wtc_narration_4a` | *"You learn who is on your side before you learn what sides there are."* | 4 (apprentice-alive) | gentle |
| `vo_wtc_narration_4b` | *"You learn who is on your side before you learn what sides there are. Sometimes you learn after."* | 4 (apprentice-dead) | same, extended, slightly slower on "Sometimes you learn after" |
| `vo_wtc_narration_5` | *"They graduate you whether or not you pass."* | 5 | wry |
| `vo_wtc_narration_6` | *"Some of us took off the mask. Some of us did not."* | 6 | observational |
| `vo_wtc_narration_7` | *"They gave me my first card the day I graduated. It was blank. I kept it."* | 7 | fond |
| `vo_wtc_narration_8a` | *"I did not know I was leaving. Nobody told me."* | 8 (first half) | quiet |
| `vo_wtc_narration_8b` | *"Welcome to Celebration."* | 8 (final line) | the canonical sign-off; deliver flat, no ceremony |

### 6.6 Audio bed sub-spec

The slideshow's audio bed is a custom 2:15 composition by
Cades (see `CADES_SFX_PROMPTS.md` track-request queue, PR #93
docs consolidation). The composition layers:
- Celebration parade drums (slow-tempo opening, full-tempo
  crescendo at frame 7, fade to silence on frame 8)
- Schoolyard ambient (birds, distant children, light wind) —
  used only on frame 3's silence
- A single sustained warm-gold tone (2-second ring on frame
  6, overlay across the mask close-up)
- Parade brass (sparing — frame 4 and frame 7 only)

The composition is keyed to frame durations; production must
not re-time the slideshow without re-sequencing the audio.

### 6.7 VFX sub-spec

The slideshow is image-first and uses minimal VFX — the
compositions are meant to read as still photographs. Two
exceptions:

- **Frame 4 Mascoteer portraits:** each portrait held 2s,
  with a 0.3s cross-dissolve to the next. Total frame
  runtime 14s (6 portraits × 2s = 12s + 2s outro).
- **Frame 6 mask float:** the mask is rendered with a
  faint 0.5Hz rotational drift (±3°) to break the
  still-photograph register. Hold the drift subtle; the
  mask should read as *almost* still.

### 6.8 Witnessing-layer integration

On slideshow completion, the runtime fires:
- `act_1_cycle_a_complete` flag (per §1.1 master index and
  `witnessingYearOne.ts` Chronicle entry "The Kindergarten
  Lets Out")
- `welcome_to_celebration_seen` flag (triggers the Cycle A
  Chronicle entry in the Witnessing Hub)
- Bond milestone check at threshold 40 ("Two Witnesses
  Remember") — if bond has crossed 40 between Prelude end
  and this point, the milestone fires on slideshow
  completion rather than at the threshold-crossing moment,
  per the deferred-milestone rule in `witnessingRuntime.ts`

---

## Section 7 — Cycle B1 Battle Section (Young Iron Lion)

The engineering spec for B1 — the opening match of Cycle B,
the Engineer's first year at Mechronis Academy, and the
player's first Mechronis battlefield. Section 2.5 authored
Iron Lion; this section specifies the match, the *Last Stand*
defense-stacking mechanic, and the Mechronis academic-year
pacing.

### 7.1 Narrative purpose

B1 is the **shift from Archons to humans**. The player has just
finished Cycle A's three Archon battles and the *Welcome to
Celebration* slideshow; B1 drops them into a different tonal
register entirely — a classroom match against a human classmate
who will, years later, be one of the Engineer's closest
friends and the Insurgency's first great militant. Iron Lion at
seventeen (one year past his §2.5 expulsion date) is not yet
that person. He is an angry, defensive teenager who has
survived three institutional failures and has decided that
surviving is the point. His deck is built entirely around
**not losing** rather than around winning — the tutorial lesson
for B1 is "some opponents win by outlasting you."

### 7.2 Per-turn flow (nominal 14-turn match)

- **Turn 1 (Iron Lion opens defensively):** deploys *Iron
  Stance* — a 0-attack, 8-defense unit that taunts. The
  Engineer must either commit damage to it or play around it.
- **Turns 2–5 (defense stacking):** Iron Lion adds a new
  defensive unit each turn, each with a *shields nearby units*
  effect. By turn 5 his board is four stacked defenders with
  cumulative +6 defense.
- **Turns 6–10 (the Engineer's pressure window):** Engineer
  must deal sustained damage across multiple turns; Iron Lion
  does not counter-attack aggressively but chips away with
  2-attack units mixed in.
- **Turns 11–14 (the canonical close):** if the Engineer has
  broken through by turn 13, lethal is achievable; if Iron
  Lion's board holds, the match stalemates and Iron Lion wins
  on turn 14 via a *last-stand* unit that deals 5 damage to
  the player's general regardless of board state.

### 7.3 Art sub-spec

**Opponent portrait:** seventeen-year-old Iron Lion in three-
quarter profile, Mechronis blue uniform worn with top button
undone, left sleeve rolled to the elbow (the §2.5 rebellion
tell). Jaw set. Eyes forward. Full prompt in §22.3.5.

**Battlefield:** Mechronis Academy first-year classroom — warm-
gold institutional lighting, rows of empty blue desks behind
the card table, a single blackboard visible in the background
with first-year mathematics still chalked on it. Afternoon
light through tall windows. Full prompt in §22.1.2 (shared
across all Cycle B battles).

### 7.4 Cutscene sub-spec

**Pre-match cutscene (0:00–0:25):** establishing the Mechronis
first-year classroom, the two desks shoved together to form a
card table. Iron Lion already seated, waiting. The Engineer
enters and sits. Iron Lion delivers §2.5 pre-match line.

**Post-match cutscene — win (0:00–0:30):** Iron Lion nods once
(the §2.5 canonical beat). He stands. The Engineer does not.
Iron Lion walks out of the classroom. Hold on the empty doorway.

**Post-match cutscene — loss (0:00–0:20):** Iron Lion holds the
line. The Engineer's board collapses. Iron Lion does not
celebrate; he just stands and leaves (§2.5 canonical loss).

### 7.5 VO sub-spec

Voice profile: **`young_iron_lion`** (new — see §2.5 for
direction: mid-register, guarded, the single warm degree on
the word *"gate"* in the pre-match line). Six lines, IDs
`vo_b1_iron_lion_*`:

| ID | Line | Direction |
|---|---|---|
| `vo_b1_iron_lion_prematch` | §2.5 pre-match line | guarded; warm degree on "gate" |
| `vo_b1_iron_lion_turn1` | *"Don't break this. You can't."* | flat, observational |
| `vo_b1_iron_lion_turn5_stacked` | *"Four up. Come at me."* | challenging, not taunting |
| `vo_b1_iron_lion_turn14_win` | §2.5 post-match win beat (the nod, wordless) | — |
| `vo_b1_iron_lion_turn14_loss` | §2.5 post-match loss beat | understated |
| `vo_b1_iron_lion_ambient` | *"I'm here."* (×3, idle) | steady |

### 7.6 VFX sub-spec

- **Iron Stance deployment:** a thin steel shimmer overlays
  each defensive unit as it deploys. 0.4s shimmer, faint
  metallic sound.
- **Shields-nearby effect:** a faint cool-blue hex outline
  appears around adjacent units when a new defender is
  added to the stack. The hex fades after 1s but the
  defensive buff persists.
- **Last-stand trigger (turn 14 only):** if the match
  reaches turn 14 without Engineer breakthrough, Iron
  Lion's general pulses once in steel-shimmer and the
  5-damage *last-stand* fires. Hold the animation brief
  (0.6s); the mechanic is the story, not the effect.

### 7.7 Cross-game beat hooks

B1 is the canonical surface for **Cades FPS** cross-game
beat `iron_lion_greeting` (per `crossGameNarrativeThreads.ts`).
The emit fires when Iron Lion delivers his §2.5 pre-match line
for the first time. The Loredex-side listener writes
`xgame_iron_lion_greeted` onto the player's flag set; Cades
FPS reads this flag and surfaces a canonical Iron Lion
greeting NPC in its Act 1 content if the flag is set.

---

## Section 8 — Cycle B2 Battle Section (Young Recruiter / Kael)

The engineering spec for B2 — Mechronis Year 2, the year Kael
joined Iron Lion's nascent Insurgency cell inside the academy.
Section 2.6 authored the character; this section specifies the
*Insurgency* swarm-buff mechanic and the canonical "tutoring
table" flashback cue.

### 8.1 Narrative purpose

B2 is the **first charismatic opponent** in Act 1. Iron Lion in
B1 was guarded; Kael in B2 is the opposite — warm, engaging,
makes the Engineer laugh twice during the match. The tutorial
lesson: some opponents win by making you *like* them. Kael's
deck is a **swarm** — many small cheap units — but each unit
carries an Insurgency buff that compounds when several are on
the board simultaneously. The player who overvalues individual
trades loses.

### 8.2 Per-turn flow (nominal 11-turn match)

- **Turn 1:** Kael deploys three 1-cost *Recruits* in a single
  play (the *Insurgency Call* action). None of them are a
  threat individually.
- **Turns 2–6:** Kael adds 2–3 Recruits per turn. Each new
  Recruit buffs all existing Recruits by +1/+0. By turn 6 the
  swarm is 14 units at cumulative +6/+0.
- **Turns 7–9:** the swarm attacks en masse. Engineer must have
  built board-clear infrastructure by turn 6 or the swarm
  overruns.
- **Turns 10–11:** canonical close. Kael's hand is empty by
  turn 10; turn 11 is the lethal window either direction.

### 8.3 Art sub-spec

**Opponent portrait:** seventeen-year-old Kael — warm expression,
genuine smile, Mechronis blue uniform with a small braided
bracelet visible on the left wrist (canonical Kael tell per
§2.6). Full prompt in §22.3.6.

**Battlefield:** same Mechronis classroom as B1, different
chalkboard content (second-year civics visible). Shared
composition with §7.3; re-use the battlefield asset.

### 8.4 Cutscene sub-spec

**Pre-match cutscene (0:00–0:25):** Kael greets the Engineer
warmly — a small wordless beat where they exchange a nod that
reads as *old habit*. The tutoring-table flashback cue is
seeded here: a 2-second dissolve to a younger Kael, younger
Engineer, and a blurred third figure (Wanda, unnamed) at a
palace card table years earlier. The flashback is held just
long enough to register and dissolves back to B2.

### 8.5 VO sub-spec

Voice profile: **`young_kael`** (new — see §2.6: warm, engaging,
slightly older-sounding than his age; no warmth ever directed
at the cards, only at the player). Seven lines:

| ID | Line | Direction |
|---|---|---|
| `vo_b2_kael_prematch` | §2.6 pre-match line | warm, inviting |
| `vo_b2_kael_turn1_swarm` | *"They're all friends. Say hi."* | playful, sincere |
| `vo_b2_kael_turn6_buff` | *"Now they're all friends with each other. That's how it works."* | the canonical philosophy line |
| `vo_b2_kael_turn9_attack` | *"Go on. Go."* | quiet, to the Recruits |
| `vo_b2_kael_turn11_win` | §2.6 post-match win beat | gentle |
| `vo_b2_kael_turn11_loss` | §2.6 post-match loss beat | proud, not defeated |
| `vo_b2_kael_ambient` | *"Keep going. You're doing fine."* (×3) | encouraging |

### 8.6 VFX sub-spec

- **Insurgency Call deployment:** three Recruit units appear
  in soft-warm-gold bloom (the Insurgency yellow, matching
  Wanda's jacket in §2.11 — intentional cross-reference).
- **Swarm buff aura:** each new Recruit emits a thin
  connective line to all existing Recruits, forming a visible
  web. The web thickens as the swarm grows. By turn 6 it is
  a dense yellow net across Kael's board.
- **Tutoring-flashback cue (pre-match):** 2-second warm-sepia
  dissolve with a faint child's laugh in the audio. Hold the
  flashback subtle; the player should register it as "a
  memory Kael has" without being told whose.

### 8.7 Cross-game beat hooks

B2 fires `kael_descendant_greeting` emit on the pre-match
handshake (per `crossGameNarrativeThreads.ts`). Cades FPS
reads `xgame_kael_descendant_greeted` and surfaces a Kael-
descendant NPC in its mid-game content.

---

## Section 9 — Cycle B3 Battle Section (Young Agent Zero)

The engineering spec for B3 — Mechronis Year 3, the only pre-C3
appearance of the woman who will become Vex Solène. Section 2.7
authored the character; this section specifies the **Zero Trust
stealth / one-shot** mechanic and the §2.7 → §2.12 visual
continuity handoff.

### 9.1 Narrative purpose

B3 is the **first combinatorial match** — the first time the
player must *combine* tools from earlier matches to counter
the opponent. Agent Zero's hidden-slot deck is unreadable
unless the player deploys reveal-on-proximity A3-unlocked
units (carried forward from Kanshi Sha's Ocularum Trio). The
tutorial lesson: "some opponents win by being unseen, and
your earlier battles gave you what you need to see them."

### 9.2 Per-turn flow (nominal 9-turn match, per §2.7 canonical)

- **Turn 1:** Agent Zero deploys three face-down units in
  hidden slots. The slots appear as empty space on her side
  of the board.
- **Turns 2–4 (hidden build):** Agent Zero adds one hidden
  unit per turn. She does not attack.
- **Turn 5 (the projected midpoint):** one hidden unit
  activates for a one-shot strike, killing one Engineer unit
  outright without revealing the slot it came from.
- **Turns 6–8:** one-shot strikes continue, one per turn.
  Engineer's board empties unless reveal-on-proximity units
  have been deployed to blind the hidden slots.
- **Turn 9 (canonical resolution per §2.7 pre-match line):**
  "you will lose in nine turns" if no interrupt. Engineer's
  optimal interrupt window is turn 6; interrupting at turn 6
  breaks the sequence per the canonical win beat.

### 9.3 Art sub-spec

**Opponent portrait:** seventeen-year-old Agent Zero per §2.7
— Mechronis blue uniform worn too perfectly, hair curtain over
left eye, calm visible right eye. Full prompt in §22.3.7.

**Battlefield:** Mechronis classroom, third-year, different
chalkboard content (covert operations diagrams — keep them
unreadable in frame). Shared composition with §7.3 / §8.3.

### 9.4 Cutscene sub-spec

**Pre-match cutscene (0:00–0:25):** Agent Zero already seated
when the Engineer enters. She does not look up. The Engineer
sits. Long silent beat (5 seconds of room tone). She speaks
the §2.7 pre-match line without raising her eyes from her
deck. Match begins.

**Post-match cutscene — win (0:00–0:40):** §2.7 canonical win
beat — the "You interrupted at six" line, the handshake she
does not offer, the "I will remember this. That is a
compliment." exit, the camera hold on the empty chair.

**Post-match cutscene — loss (0:00–0:30):** §2.7 canonical
loss beat — the "Nine. As projected." line, the analytical
feedback on turn 4.

### 9.5 VO sub-spec

Voice profile: **`young_agent_zero`** (new, full spec in §2.7).
Eight lines, IDs `vo_b3_agent_zero_*`:

| ID | Line | Direction |
|---|---|---|
| `vo_b3_agent_zero_prematch` | §2.7 pre-match line | flat; single warm degree on "unfair" |
| `vo_b3_agent_zero_turn5_strike` | *"One."* | informational |
| `vo_b3_agent_zero_turn6_strike` | *"Two."* | unchanged tone |
| `vo_b3_agent_zero_turn7_blinded` | *"— sequence interrupted."* (if interrupt at T6) | neutral; not frustrated |
| `vo_b3_agent_zero_turn9_win` | §2.7 post-match win dialog (full) | — |
| `vo_b3_agent_zero_turn9_loss` | §2.7 post-match loss dialog (full) | — |
| `vo_b3_agent_zero_compliment` | *"I will remember this. That is a compliment."* (win-only) | single warm degree on "compliment" |
| `vo_b3_agent_zero_ambient` | silence (4 × 8-second idle intervals with faint pen-on-paper SFX) | — |

### 9.6 VFX sub-spec

- **Hidden slot visualization:** each face-down unit is
  rendered as a faintly darker rectangle on Agent Zero's
  side of the board. Not a card back — *negative space*.
  Production note: the slot should read as "something
  missing" rather than "something hidden."
- **One-shot strike effect:** when a hidden unit activates,
  a thin silver-grey vector line traces from the hidden
  slot to the target unit (0.3s), the target unit
  vanishes, the vector line fades. No particles; the
  effect is clinical.
- **Reveal-on-proximity blind (counter):** when an A3-
  unlocked unit is deployed adjacent to a hidden slot, the
  slot *inverts* — the negative-space rectangle flips to a
  visible card face for one turn. During the revealed turn,
  Agent Zero cannot activate that slot.

### 9.7 §2.7 → §2.12 visual continuity

Production must verify that the Agent Zero portrait and
character rig used for B3 is **rigidly reusable** for §2.12's
C3 host-body rendering. The continuity rules from §2.12:
- Same height / build / ethnic ambiguity
- Same hair color and length (the C3 rig adds the tight
  field braid but the underlying hair rig is B3's)
- Same right eye visible; B3 left eye hidden by curtain, C3
  left eye visible and progressively silver-rimmed
- Mechronis blue uniform (B3) vs. charcoal-grey tactical
  jacket (C3) — these are different garments, but the
  underlying body rig is shared

The asset delivery bundle for B3 must include a
*continuity-reference sheet* (§22.3.7.1) that C3's asset
producer can use to verify visual match.

---

