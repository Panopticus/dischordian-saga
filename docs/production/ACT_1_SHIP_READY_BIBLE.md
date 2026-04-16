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

---
