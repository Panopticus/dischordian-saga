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

---
