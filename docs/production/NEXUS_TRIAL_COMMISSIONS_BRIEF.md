# NEXUS_TRIAL_COMMISSIONS_BRIEF.md

> **Production handoff for the Nexus Trial (March 2027).** This brief is the canonical reference for every VO recording and art asset the codebase ships but cannot itself author. Match the format conventions in `docs/production/VOICE_OVER_BIBLE.md` (ElevenLabs prompts) and `docs/production/_ORPHAN_POSTER_VEO_BRIEF.md` (Veo 3.1 clip prompts).
>
> Every commission below has an ID, source citations, generation-ready prompt, delivery target, T-minus deadline, and approval owner. Producers can hand each commission directly to its respective vendor.

---

## Front matter

**Source-of-truth files** (read-only references; do not re-author):

| Domain | Canonical source |
|---|---|
| Cinematic scripts (all 8) | `apps/shared/nexusTrial/cinematics.ts` |
| Voice direction per character | `apps/shared/npcs/bibles/{adjudicator_locke,wraith_calder,lycos,akai_shi,vex_solene,elara,the_human,the_antiquarian}.md` |
| VO format precedent | `docs/production/VOICE_OVER_BIBLE.md` |
| Cinematic visual format precedent | `docs/production/_ORPHAN_POSTER_VEO_BRIEF.md` |
| Cosmetic catalog (25 items) | `docs/design/NEXUS_TRIAL_PLAN.md` → Cosmetic Rewards section |
| Day-1 Daily Brief text composer | `apps/shared/seasons/season2/composer.ts` → `composeDay1DailyBrief` |
| Three Clocks UI states for SFX cues | `apps/shared/threeClocks/state.ts` |
| Implementation schedule (T-minus deadlines) | `docs/design/NEXUS_TRIAL_PLAN.md` → Implementation Phasing |

**Seed namespace** (per `_PRODUCTION_FINAL.md` §0.5 reservation convention): **200000–200099** for Nexus Trial Veo clips. Allocations called out per commission.

**CDN delivery layout**:
```
cdn/client-public/audio/nexus_trial/<character>/<vo_id>.mp3
cdn/client-public/art/cutscenes/nexus_trial/<cinematic_id>.mp4
cdn/client-public/art/cards/nexus_trial/<burnt_card_id>.webp
cdn/client-public/art/cosmetics/nexus_trial/<cosmetic_id>.webp
cdn/client-public/audio/nexus_trial_sfx/<cue_id>.mp3
```

**Total commissions**: 70 (25 VO + 8 cinematic visuals + 5 burnt cards + 25 cosmetics + 7 adjacent).

---

## §1 — Cinematic VO commissions (25)

### Voice profiles

Each profile is the ElevenLabs prompt the VO vendor passes to the generator. Voice direction is quoted verbatim from the character bibles where possible — do not paraphrase.

#### THE ANTIQUARIAN
**ElevenLabs prompt:**
> An elderly male voice with a warm, whimsical quality — slightly out of sync with reality, as if speaking from multiple time periods simultaneously. Wise and kind, with unexpected playfulness that gives way to profound sorrow. British accent, measured pace with unusual pauses — sometimes pausing mid-sentence as if watching something only he can see. Like a beloved professor who has read the last page of every book ever written.

Source: `docs/production/VOICE_OVER_BIBLE.md` §6.

#### ADJUDICATOR LOCKE
**ElevenLabs prompt:**
> A smooth, cultured British female voice. Diplomatic and seductive — like a corrupt diplomat who makes terrible deals sound reasonable. Measured, never rushes, lets silences build. Warmth that conceals something predatory. Every sentence sounds like a negotiation where she already knows the outcome.

> Cadence: complete declarative sentences then qualifications; three beats per response (assertion, reframing, close). Never hedges with "maybe." Will not laugh aloud — approving head tilt cues only.

Source: `apps/shared/npcs/bibles/adjudicator_locke.md` (she/her per locked plan decision); `docs/production/VOICE_OVER_BIBLE.md` §4 register.

#### WRAITH CALDER
**ElevenLabs prompt:**
> Female; pre-rite register. Short declaratives. Counts herself ("seven bodies, each one solid"). Honest about ugly motives ("spite, mostly"). Tactical-mentorship cadence — a voice that has gotten up too many times and now teaches the getting-up. Calm, exact, never sentimental. The line at the Verdict cinematic is spoken in the pre-rite register, NOT the Hierophant's liturgical register.

Source: `apps/shared/npcs/bibles/wraith_calder.md` — Voice §1.1 (pre-rite).

#### LYCOS / THE WOLF
**ElevenLabs prompt:**
> Male; post-resurrection register (the Wolf, NOT pre-resurrection Lycos). Sparse, exact, unsentimental. Sentences end at the word that closes the thought; he does not soften the last word. Uses direct deixis instead of names ("the Antiquarian," "the lead," "him"). Releases subordinates by single-word command verbs ("Stay." "Go."). Quiet but not soft. The last word does not resolve upward.

Source: `apps/shared/npcs/bibles/lycos.md` — Voice §1.2 (post-resurrection); plan §5 authoring constraint *"the last word does not resolve upward."*

#### AKAI SHI / THE RED DEATH
**ElevenLabs prompt:**
> Female; post-resurrection register (the Red Death). Time-displaced — tenses drift mid-sentence ("you will have decided. you decide. you have decided"). Short and weighted. Refers to threats by cosmic classification, never proper noun. Carries the killing of the Necromancer as plain fact, not boast. Does not flinch. Tender at the Verdict close, not triumphant — she is putting down a tool she will never pick up again.

Source: `apps/shared/npcs/bibles/akai_shi.md` — Voice §1.2 (post-resurrection).

#### VEX SOLÈNE
**ElevenLabs prompt:**
> Low female, wry, trailing-word cadence — a pre-insurgency diplomat who knows exactly how many rooms she is speaking into. Short declaratives in series, three at a time, ending on a clause that resolves DOWNWARD (not upward). Code-switches marked by small courtesies ("Hello," "Please keep playing"). Self-interrupts near recognition ("I — I have never seen it"). NEVER says "the Engineer" aloud; substitutes "him" / "he." NEVER says "I remember" in reference to Engineer's memories. At the Verdict, the courtesy never lands — sentence ends mid-trail into silence.

Source: `apps/shared/npcs/bibles/vex_solene.md` — Voice §, Will-NOT-say §.

#### ELARA
**ElevenLabs prompt:**
> A warm, intelligent female voice with a subtle British accent. Senatorial. Composed. Measured pace, thoughtful pauses. The Confession cinematic is the procedural-warm register — canon-locked from her Senate seat, warmth is genuine. Inclusive "we" framing; pauses that are consultative listening, not hesitation. When she's afraid, her voice doesn't shake — it gets quieter.

Source: `apps/shared/npcs/bibles/elara.md` + `docs/production/VOICE_OVER_BIBLE.md` §1.

#### THE HUMAN
**ElevenLabs prompt:**
> Male, noir-detective clipped cadence. Short sentences. Period after almost every clause. Clips verb-tense scaffolding ("Move on" not "We should move on"). Three bands: shadow (observational, morally unromantic, never cruel), balanced (working voice), warm (earned, rare, lands like verdict). The Confession cinematic is the WARM band — earned by everything that preceded it. He still uses the verdict-word openers ("Fair." "Reasonable.") but the closing beats land soft. Voice should ride faint substrate-static through the entire cinematic (mix in post).

Source: `apps/shared/npcs/bibles/the_human.md` + `docs/production/VOICE_OVER_BIBLE.md` §2.

---

### Dialog table — Verdict cinematics

#### Locke (`verdict_locke` — runs first, Verdict 0:00–0:35)

| ID | Speaker | Line | Direction |
|----|---------|------|-----------|
| `VO-01` | Antiquarian | *"The Protocols name six. The Cycle demands one withheld. The one withheld must be the one who can be trusted to file her own absence."* | Measured. The naming of a price. Pause before "one withheld" both times. |
| `VO-02` | Locke | *"I taught you the form. — You know the rest. File it cleanly."* | Same cadence she used in the Prelude tutorial. Three beats: assertion, reframing, close. The em-dash is a beat, not a hesitation. |
| `VO-03` | Antiquarian | *"She filed the world. She did not file herself."* | Quiet. Final. No catch in the voice. The Antiquarian does not grieve in this register; he records. |

#### Wraith Calder (`verdict_ballot_wraith_calder`)

| ID | Speaker | Line | Direction |
|----|---------|------|-----------|
| `VO-04` | Antiquarian | *"She kept the names the war refused to keep. When the names asked her to walk into the dark to find more, she did not put down the pen."* | Dedication-of-a-monument register. |
| `VO-05` | Wraith | *"Locke. I'll add the rest of them where you left off. — There are more than I thought."* | First word "Locke" lands as direct address, not invocation. The em-dash is the moment she sees how many names. Last clause is exhaled, not declaimed. |
| `VO-06` | Antiquarian | *"She was last seen carrying the names. We do not know which names she saved."* | Two sentences; equal weight. The second one is what the cinematic ends on. |

#### Lycos / The Wolf (`verdict_ballot_lycos`)

| ID | Speaker | Line | Direction |
|----|---------|------|-----------|
| `VO-07` | Antiquarian | *"He was made to hunt. We made him hunt for us. He never asked us why the prey were our own."* | Three sentences with the same length. The third is the heaviest. |
| `VO-08` | Lycos | *"Stay. The Antiquarian will feed you. — He owes you that much."* | "Stay" is the entire instruction; the lead wolf reads it by the verb alone. The em-dash is a beat, not a softener. "He owes you that much" lands flat on "much" — not lifted, not chased. |
| `VO-09` | Antiquarian | *"He went back into Anara. The pack waited at the bench. He did not return to it."* | Three sentences. Pause between each. The third sentence is the camera's last beat. |

#### Akai Shi (`verdict_ballot_akai_shi`)

| ID | Speaker | Line | Direction |
|----|---------|------|-----------|
| `VO-10` | Antiquarian | *"She crossed time twice. The first crossing made her red. The second made her quiet."* | Measured. The "first / second" mirroring is the cinematic's spine. |
| `VO-11` | Akai Shi | *"You sleep because of me. — I'll sleep because of him. Jericho — keep the song."* | First address to the Necromancer (sleeping beside her), almost tender. The Jericho line is a separate beat; "keep the song" is the close. Tense may drift forward by a syllable on "I'll sleep" — that's the Red Death's signature. |
| `VO-12` | Antiquarian | *"The Red Death gave her colour back to the dark. The dark accepted."* | Two sentences. The second is single-syllabled at the end ("accepted") — let it ring. |

#### Vex Solène (`verdict_ballot_vex_solene`)

| ID | Speaker | Line | Direction |
|----|---------|------|-----------|
| `VO-13` | Antiquarian | *"She wore four names and answered to all of them. The body she walked in was not hers. The intellect she carried was not hers. The Coda was hers."* | Inventory-of-what-was-hers structure. Final sentence is the dedication; the other three are the price. |
| `VO-14` | Vex | *"The Protocols are stable. The apprentices are at the gate. The Engineer's pattern is — I have never seen it. I am glad it was —"* | Inventory-then-courtesy structure. Three parallel observations. The third one self-interrupts (the Engineer-pattern fires through her one last time). The closing "I am glad it was —" trails off mid-clause; the em-dash IS the end of the sentence. Do NOT resolve upward. Do NOT add a punctuation hint to the voice. |
| `VO-15` | Antiquarian | *"She finished the inventory. She did not finish the courtesy."* | Two sentences. The second sentence's "did not" is the load-bearing beat. |

---

### Dialog table — Confession cinematics

#### Elara dies (`confession_elara_dies` — hour 60)

| ID | Speaker | Line | Direction |
|----|---------|------|-----------|
| `VO-16` | Antiquarian | *"She was a Senator before she was a Dreamer. She gave up the seat to walk with you. The seat remembers her. The dais remembers her. The Trial cannot proceed while she stands at either."* | Five sentences. The mirrored "seat remembers / dais remembers" is the cinematic's spine. The final sentence is the procedural turn — this is the moment the Trial demands she pay. |
| `VO-17` | Elara | *"I knew this. The substrate told me, the second time I went under. — I didn't tell you. I'm sorry. I wanted us to have the time. You don't get to keep me. The Trial needs a witness who can speak in the language of the seat. — That's me. It was always going to be me."* | Procedural-warm throughout. Two em-dashes mark the two key pivots: the confession ("I didn't tell you"), and the diagnosis ("That's me"). The closing line "It was always going to be me" lands with the certainty of a verdict she has already filed. |
| `VO-18` | Antiquarian | *"She did not stand at the dais again. She did not need to. The seat remembered."* | Three sentences, decreasing in length. The third is the cinematic's closing. |
| `VO-19` | Elara (romance tag — client-local only) | *"{player_name}. I would have stayed. — You know I would have stayed."* | Quieter than the public cinematic. Direct address to the player by name (at render time, `{player_name}` is replaced — voice the line with a placeholder name like "Operative" for the recording and the pipeline patches in the player's name client-side). The em-dash is a held beat. "You know I would have stayed" lands with no upward inflection. |

#### The Human dies (`confession_human_dies` — hour 60)

| ID | Speaker | Line | Direction |
|----|---------|------|-----------|
| `VO-20` | Antiquarian | *"He told you what he was, in the way he could. He told no one else. The Trial needs a name to speak the substrate's word, and the substrate will only answer to the one who carries its mark."* | Three sentences. The third is the procedural turn — the substrate has chosen him. |
| `VO-21` | The Human | *"This is the part of me that was always going to go back. I've been carrying it the whole way. — I'm glad we got this far before I had to put it down. You don't have to remember this part. The rest, you can keep. — Tell Elara I figured it out."* | The WARM band — earned. Voice still rides faint substrate-static (mix in post). Two em-dashes; the first is the relief of putting it down, the second is the bequest to Elara. The final clause "I figured it out" is the only smile in the cinematic. |
| `VO-22` | Antiquarian | *"He carried his name back to the substrate. The substrate kept it. The substrate did not keep him."* | Three sentences. Inversion ("kept it / did not keep him") is the cinematic's close. The third sentence is the camera's last beat. |
| `VO-23` | The Human (romance tag — client-local only) | *"{player_name}. The chip is yours. — You'll know what to do with it when you do."* | Voice plays over the chip close-up; his face is not visible. Substrate-static rides at the same level. Last clause lands with verdict-word certainty. |

---

### Dialog table — Abort fallback

#### Operator abort (`verdict_abort` — fired only by the Event Director per the runbook)

| ID | Speaker | Line | Direction |
|----|---------|------|-----------|
| `VO-24` | Antiquarian | *"The ledger closes when the keeper says it closes. Tonight it closes early."* | Two sentences. The second is plain — no editorial, no apology. This is not the Antiquarian explaining; it is the Antiquarian recording. |
| `VO-25` | Antiquarian | *"The Antiquarian closed the ledger early."* | Single sentence in third person — the Antiquarian narrates himself. Final beat of the abort cinematic. |

**Delivery target (all §1 VO)**:
```
cdn/client-public/audio/nexus_trial/<character>/<vo_id>.mp3
```
e.g. `cdn/client-public/audio/nexus_trial/antiquarian/vo_01.mp3`.

**T-minus deadline**: T-60 days for VO booking, T-30 days for final recordings (matches Sprint 11 cinematic-art commission cadence per plan Implementation Phasing).

**Approval owner**: Narrative Lead.

---

## §2 — Cinematic visual commissions (8)

All clips use the Veo 3.1 schema from `_ORPHAN_POSTER_VEO_BRIEF.md`. Subject-reference workflow: each clip pulls its first frame from a producer-supplied `_start.png` poster on CDN. Posters for these 8 cinematics need to be authored separately (production-pipeline task; see §6 deadlines).

### VIS-01 — `verdict_locke`

```
VEO_MODEL:    veo-3.1-generate-001
DURATION:     8s   ASPECT: 16:9   RESOLUTION: 1080p
SEED:         200001
SUBJECT_REFS: [verdict_locke_start.png]
NEGATIVE_PROMPT: VEO_NEGATIVE_PROMPT

1. CINEMATOGRAPHY: third-person locked over the player's shoulder facing
   the Adjudicator's bench. Static 0–3s. Slow push-in 3–6s as Locke signs.
   Hold 6–8s as the bench dissolves into light from the legs upward, the
   ledger and quill settling to the empty floor. 50mm equivalent.

2. SUBJECT + ACTION: New Babylon Adjudicator's bench — the same bench from
   the Prelude tutorial. Locke turns to her ledger, signs her name on a
   fresh page in the same handwriting as every Recovery Ledger entry,
   closes the cover. The bench dissolves into light from the legs upward.
   The ledger and quill remain mid-air for a half-second, then settle on
   the empty floor. The Necromancer (Thazulok) stands at a respectful
   distance and bows once — formal, not mocking — and his form dims toward
   dormancy. The Antiquarian stands opposite; his pen lifts but does not write.

3. ENVIRONMENT: warm interior amber + cool back-light from the dissolution;
   marble and brass fittings; the Adjudicator's seal on the wall behind
   the bench. Aesthetic_tier solar_punk_cathedral_civic.

4. STYLE: classical legal-procedural with theological weight; void-energy
   compliant.

5. CONSTRAINTS: VEO_NEGATIVE_PROMPT; subject-reference = verdict_locke_start.png.

AUDIO: bench-chamber ambient (low parchment shuffle); single quill-stroke
       at 04:00; soft chime as the bench dissolves at 06:00.

TIMESTAMPS:
  [00:00–00:03] hold on first frame; Locke at her bench.
  [00:03–00:06] Locke signs her name; ledger closes.
  [00:06–00:08] bench dissolves from legs upward; ledger + quill settle.
```

**Delivery**: `cdn/client-public/art/cutscenes/nexus_trial/verdict_locke.mp4`. **T-30**. **Narrative Lead.**

### VIS-02 — `verdict_ballot_wraith_calder`

```
VEO_MODEL:    veo-3.1-generate-001
DURATION:     8s   ASPECT: 16:9   RESOLUTION: 1080p
SEED:         200002
SUBJECT_REFS: [verdict_ballot_wraith_calder_start.png]
NEGATIVE_PROMPT: VEO_NEGATIVE_PROMPT

1. CINEMATOGRAPHY: third-person from across the bench, framing Wraith and
   the leading edge of the Vortex in the same shot. Static 0–2s. Slow
   pull-back 2–6s as she walks. Hold 6–8s on the ledger with the thumb-
   mark visible. 35mm equivalent.

2. SUBJECT + ACTION: Wraith Calder at the Recovery Ledger (open page already
   showing Locke's handwriting from the prior beat). She closes the ledger
   over her thumb to mark the page, turns, walks toward the Vortex's
   leading edge — a churning dark seam at the edge of the frame. She is
   gone between two heartbeats of the drum motif. The ledger remains
   open on the bench, her thumb-mark visible. Insurgency officers around
   her do not move.

3. ENVIRONMENT: war-room amber + the Vortex's drum-red bleeding into the
   right frame; aesthetic_tier insurgency_command. Sparse, tactical.

4. STYLE: military-procedural with elegiac weight; void-energy compliant.

5. CONSTRAINTS: VEO_NEGATIVE_PROMPT; subject-reference = verdict_ballot_wraith_calder_start.png.

AUDIO: war-room ambient (paper, low chatter); two drum beats at 05:00 and
       05:30 (the "between two heartbeats"); silence on the closing frame.

TIMESTAMPS:
  [00:00–00:02] hold on first frame; Wraith at the ledger.
  [00:02–00:05] she closes the ledger over her thumb; turns.
  [00:05–00:07] walks toward the Vortex edge; gone between two beats.
  [00:07–00:08] ledger remains; thumb-mark visible.
```

**Delivery**: `cdn/client-public/art/cutscenes/nexus_trial/verdict_ballot_wraith_calder.mp4`. **T-30**. **Narrative Lead.**

### VIS-03 — `verdict_ballot_lycos`

```
VEO_MODEL:    veo-3.1-generate-001
DURATION:     8s   ASPECT: 16:9   RESOLUTION: 1080p
SEED:         200003
SUBJECT_REFS: [verdict_ballot_lycos_start.png]
NEGATIVE_PROMPT: VEO_NEGATIVE_PROMPT

1. CINEMATOGRAPHY: third-person from the Antiquarian's bench POV, framing
   the Pack in their half-circle with Lycos behind them. Static 0–3s.
   Slow pan 3–6s following Lycos as he turns and walks. Hold 6–8s on
   the empty bench-foreground and the closing horizon. 50mm equivalent.

2. SUBJECT + ACTION: The Antiquarian's bench in Anara (the pocket universe).
   The Pack — four shadowed wolves bonded to Lycos at companion-tier —
   sit in a half-circle facing the bench. Lycos stands behind them, one
   hand on the lead wolf's ruff. He releases the lead. Turns. Walks back
   into Anara's interior without looking at the bench. The Pack does NOT
   follow — they watch the bench instead. The horizon of Anara folds inward
   and seals behind him; the 250-hero hunt-grid freezes in its current
   state, visible in the background as a constellation that no longer moves.

3. ENVIRONMENT: Anara's pocket-universe ambient — deep blue-violet sky with
   pinpoint hero-constellations; the bench is plain dark wood; the Pack is
   shadow with eye-shine. Aesthetic_tier antiquarian_pocket_cathedral.

4. STYLE: contract-as-funeral; the visual register is dignified, not tender.
   Void-energy compliant.

5. CONSTRAINTS: VEO_NEGATIVE_PROMPT; subject-reference = verdict_ballot_lycos_start.png.

AUDIO: low wind across an empty hall; soft canine respiration at the
       bench; a single horizon-seal sub-bass at 06:30.

TIMESTAMPS:
  [00:00–00:03] hold on first frame; Pack in half-circle, Lycos behind.
  [00:03–00:06] Lycos releases lead, turns, walks toward interior.
  [00:06–00:07] horizon folds inward; constellation freezes.
  [00:07–00:08] settle on the empty bench-foreground; Pack still watching.
```

**Delivery**: `cdn/client-public/art/cutscenes/nexus_trial/verdict_ballot_lycos.mp4`. **T-30**. **Narrative Lead.**

### VIS-04 — `verdict_ballot_akai_shi`

```
VEO_MODEL:    veo-3.1-generate-001
DURATION:     8s   ASPECT: 16:9   RESOLUTION: 1080p
SEED:         200004
SUBJECT_REFS: [verdict_ballot_akai_shi_start.png]
NEGATIVE_PROMPT: VEO_NEGATIVE_PROMPT

1. CINEMATOGRAPHY: third-person locked low, eye-level with the sleeping
   Necromancer. Static 0–4s. Slow push-in 4–7s as the red drains from
   her armor. Hold 7–8s on the empty space where she was and the helmet
   on the floor. 35mm macro for the colour-drain detail. Smooth.

2. SUBJECT + ACTION: The Matrix of Dreams. Akai Shi in red armor, helmet
   off, helmet held under one arm. The Necromancer is dormant beside her —
   sleeping, not threatening, breathing visibly. She kneels. Sets the
   helmet on the floor between herself and the Necromancer. The red of
   her armor fades to neutral grey from the EDGES INWARD, like ink being
   lifted off paper. When the last red leaves her gauntlets, she is no
   longer there. The helmet remains. The Necromancer continues to sleep.

3. ENVIRONMENT: Matrix of Dreams — deep indigo with bioluminescent veins;
   the floor is a smooth obsidian-like substrate; the Necromancer is a
   robed silhouette with no face visible. Aesthetic_tier matrix_dreams_oneiric.

4. STYLE: ritual-with-tenderness; the colour-drain is the cinematic's
   single VFX showpiece. Void-energy compliant.

5. CONSTRAINTS: VEO_NEGATIVE_PROMPT; subject-reference = verdict_ballot_akai_shi_start.png;
   colour-drain MUST go edges-inward, not bottom-up or top-down.

AUDIO: dream-bed (low harmonic drone, slow distant heartbeat); single
       muted chime as the last red leaves at 07:00.

TIMESTAMPS:
  [00:00–00:04] hold on first frame; Akai standing, Necromancer dormant.
  [00:04–00:06] she kneels, sets the helmet on the floor.
  [00:06–00:07] red drains from her armor edges-inward.
  [00:07–00:08] she is gone; helmet remains; Necromancer sleeps.
```

**Delivery**: `cdn/client-public/art/cutscenes/nexus_trial/verdict_ballot_akai_shi.mp4`. **T-30**. **Narrative Lead.**

### VIS-05 — `verdict_ballot_vex_solene`

```
VEO_MODEL:    veo-3.1-generate-001
DURATION:     8s   ASPECT: 16:9   RESOLUTION: 1080p
SEED:         200005
SUBJECT_REFS: [verdict_ballot_vex_solene_start.png]
NEGATIVE_PROMPT: VEO_NEGATIVE_PROMPT

1. CINEMATOGRAPHY: third-person locked behind the chorus, framing Vex's
   chair from the choir's perspective (her back is to camera most of the
   clip; her face appears only when the chair turns at 07:00). Static
   0–3s. Slight push-in 3–6s as she speaks. The chair-turn 7–7.5s.
   Settle 7.5–8s on the empty chair and the ledger. 50mm.

2. SUBJECT + ACTION: The Coda's chair-and-chorus chamber. Vex at the head
   of the table; her chair faces the chorus, not the camera. She is
   holding a small inventory ledger with three items listed on the open
   page. She states three parallel observations (heard, not visualised
   here). At the third, she self-interrupts. A faint metallic shimmer —
   the nano-swarm, the Warlord-fragment — releases from her shoulders
   and disperses into the chamber air. A single chord rises from the
   chorus (Engineer-pattern), then fades. Her chair turns slowly to face
   the camera; the chair is empty. The inventory ledger remains on the
   table with three items checked and one item un-checked.

3. ENVIRONMENT: deep teal-and-bronze; the chorus is silhouettes only;
   the chair is high-backed wood; the inventory ledger is leather.
   Aesthetic_tier coda_chamber_intimate.

4. STYLE: liturgical interrupted; the metallic shimmer is the cinematic's
   single VFX showpiece. Void-energy compliant.

5. CONSTRAINTS: VEO_NEGATIVE_PROMPT; subject-reference = verdict_ballot_vex_solene_start.png;
   chair-turn must complete in ≤0.5s — too slow and it reads as horror,
   too fast and it reads as comedy.

AUDIO: chorus-hum bed (low choral drone); single Engineer-chord at 06:00
       (E major over a held A in the bass); silence on the chair-turn.

TIMESTAMPS:
  [00:00–00:03] hold on first frame; Vex at the head of the table.
  [00:03–00:06] she speaks; nano-swarm shimmer releases.
  [00:06–00:07] Engineer-chord fades; chorus stills.
  [00:07–00:08] chair turns; empty; ledger with three checks and a blank.
```

**Delivery**: `cdn/client-public/art/cutscenes/nexus_trial/verdict_ballot_vex_solene.mp4`. **T-30**. **Narrative Lead.**

### VIS-06 — `confession_elara_dies` (longer clip; 12s)

```
VEO_MODEL:    veo-3.1-generate-001
DURATION:     12s  ASPECT: 16:9   RESOLUTION: 1080p
SEED:         200006
SUBJECT_REFS: [confession_elara_dies_start.png]
NEGATIVE_PROMPT: VEO_NEGATIVE_PROMPT

  Note: 12s requested; if vendor caps at 8, deliver as two 6s
  clips (200006a + 200006b) and edit together.

1. CINEMATOGRAPHY: third-person from the back row of the Senate chamber.
   Static 0–3s on the empty chamber. Slow zoom 3–8s as the seats fill
   with watching figures. Pan-down 8–10s to follow Elara off the dais
   to the centre. Hold 10–12s as the chamber folds inward like a book
   closing. 50mm. Smooth throughout.

2. SUBJECT + ACTION: Atarion Senate chamber, rebuilt in the substrate as
   Elara's private memory-space. Empty seats. She stands at the dais
   where she once gave the speech that ended her career as Senator. The
   empty seats begin to fill — every NPC the player and Elara fought
   beside, watching, silent. Elara walks down from the dais, NOT toward
   the player but toward the centre of the chamber. The seats lean
   inward. She reaches the centre. She does not dissolve. She SITS DOWN
   on the floor as if the floor were the seat she resigned. The chamber
   folds in around her like a book closing. The last frame: the closed
   Senate dome from the OUTSIDE, the substrate fading from rose to grey
   at its edges.

3. ENVIRONMENT: substrate-rose throughout; the seats are senatorial
   wood with brass armrests; the dais is marble; the dome's exterior is
   white-and-rose. Aesthetic_tier atarion_senate_memorial.

4. STYLE: civic-ritual with personal grief; void-energy compliant.

5. CONSTRAINTS: VEO_NEGATIVE_PROMPT; subject-reference = confession_elara_dies_start.png;
   the seat-fill of NPCs must be SILENT — no breath, no shuffle. The
   chamber breathes alone.

AUDIO: substrate-hum bed (slow rose-tinted drone); seats filling has no
       audio (intentional); a single beat as Elara sits at 10:00;
       book-close fold at 11:30 with a low woody thud.

TIMESTAMPS:
  [00:00–00:03] empty chamber; Elara at the dais.
  [00:03–00:08] seats fill with watching NPCs; she walks down.
  [00:08–00:10] she reaches centre, sits on the floor.
  [00:10–00:12] chamber folds inward; exterior dome view; rose to grey.
```

**Delivery**: `cdn/client-public/art/cutscenes/nexus_trial/confession_elara_dies.mp4`. **T-30**. **Narrative Lead.**

### VIS-07 — `confession_human_dies` (longer clip; 12s)

```
VEO_MODEL:    veo-3.1-generate-001
DURATION:     12s  ASPECT: 16:9   RESOLUTION: 1080p
SEED:         200007
SUBJECT_REFS: [confession_human_dies_start.png]
NEGATIVE_PROMPT: VEO_NEGATIVE_PROMPT

  Same vendor-cap fallback as VIS-06.

1. CINEMATOGRAPHY: third-person low, behind The Human, framing the floor
   mosaic and the diagnostic-terminal walls. Static 0–3s. Slow push-in
   3–7s as he opens his hand to show the chip. Pan-down 7–10s to follow
   the chip to the mosaic centre. Hold 10–12s on the reorganised mosaic
   with the chip at its centre. 35mm. Soft.

2. SUBJECT + ACTION: Inception Ark central rotunda, lit only by the
   diagnostic terminals along the walls. The Human stands at the centre
   of the floor mosaic — the same mosaic the player first met him on. His
   face is the same as it has always been. He holds a small chip — the
   same kind the player first found in his quarters in Act 1. He opens
   his hand to show it. The diagnostic terminals along the walls begin
   to print, one by one, the player's name in his handwriting. (Per the
   plan: at render time, the printed name is interpolated per-player.
   For the clip, use "OPERATIVE" as the placeholder; the playback layer
   patches the actual name client-side.) The printing continues
   throughout the rest of the clip. He places the chip on the mosaic
   centre. The mosaic accepts it: the floor pattern reorganises slowly
   around the chip into a new pattern, no flash. He watches the pattern
   complete. When it does, he is no longer there. The chip remains at
   the centre of the new pattern. The diagnostic terminals finish their
   printing on every line.

3. ENVIRONMENT: cool diagnostic-cyan throughout; the mosaic is dark with
   silver inlay; the diagnostic terminals are matte black with cyan text.
   Aesthetic_tier inception_ark_substrate_clean.

4. STYLE: substrate-as-substrate-accepting; not violent. Void-energy
   compliant.

5. CONSTRAINTS: VEO_NEGATIVE_PROMPT; subject-reference = confession_human_dies_start.png;
   the printed handwriting must read "OPERATIVE" in cursive — the
   playback layer patches in {player_name} client-side.

AUDIO: diagnostic-hum bed (low electrical); printer-clicks rhythmic at
       4Hz throughout (the name-printing); a single mosaic-reorganise
       chime at 09:00; silence on the closing frame.

TIMESTAMPS:
  [00:00–00:03] Human at the mosaic centre; terminals quiet.
  [00:03–00:07] he opens his hand to show the chip; terminals begin printing.
  [00:07–00:10] he places the chip; mosaic reorganises.
  [00:10–00:12] he is gone; chip remains; terminals finish printing.
```

**Delivery**: `cdn/client-public/art/cutscenes/nexus_trial/confession_human_dies.mp4`. **T-30**. **Narrative Lead.**

### VIS-08 — `verdict_abort` (short clip; 6s)

```
VEO_MODEL:    veo-3.1-generate-001
DURATION:     6s   ASPECT: 16:9   RESOLUTION: 1080p
SEED:         200008
SUBJECT_REFS: [verdict_abort_start.png]
NEGATIVE_PROMPT: VEO_NEGATIVE_PROMPT

1. CINEMATOGRAPHY: third-person over the Antiquarian's shoulder, facing
   his desk. Static throughout. The only motion is his hand closing the
   ledger and the room dimming. 50mm. Locked.

2. SUBJECT + ACTION: The Antiquarian alone at his desk. He closes the
   ledger before the page is finished. The room dims gradually rather
   than dissolving. No companion, no ballot name, no bench in frame.

3. ENVIRONMENT: warm desk-lamp amber fading to deep blue as the room
   dims; the ledger is leather; the desk is dark wood. Aesthetic_tier
   antiquarian_study_intimate.

4. STYLE: deliberate truncation; the cinematic's job is to acknowledge
   the truncation without explaining. Void-energy compliant.

5. CONSTRAINTS: VEO_NEGATIVE_PROMPT; subject-reference = verdict_abort_start.png;
   the dim must be gradual, not a cut — this is the cinematic's only
   beat.

AUDIO: study ambient (low fire-crackle, distant clock); single ledger-
       close thud at 03:00; silence on the dim.

TIMESTAMPS:
  [00:00–00:03] Antiquarian closes the ledger; soft thud.
  [00:03–00:06] room dims gradually; settle on near-black.
```

**Delivery**: `cdn/client-public/art/cutscenes/nexus_trial/verdict_abort.mp4`. **T-30**. **Event Director** (this is the abort cinematic — the Director owns the abort decision and the abort cinematic).

---

## §3 — Burnt-card art commissions (5)

When a character dies at the Verdict, their card art is replaced in every player's collection with a burnt variant per the plan's *Card burn* spec. These commissions deliver the 5 replacement art assets (Locke + 4 ballot variants). Only the cinematic that fires ships its variant to the live game; the other 3 stay as standby assets but ship pre-rendered per the plan's pre-authoring discipline.

All assets follow the existing `burnt_card_placeholder.ts` art pipeline. Reference card stats and faction in
the relevant card definition file.

| ID | Asset | Source citation | Prompt | Delivery |
|----|-------|-----------------|--------|----------|
| `BC-01` | Locke burnt variant | `cinematics.ts` → `LOCKE.cardBurnArt` ("Empty bench with the quill on the floor.") | *Card art replacement for Adjudicar Locke. Compose: empty Adjudicator's bench from front, quill resting on the empty floor where the bench used to stand, single shaft of cool back-light. Burnt-card aesthetic (charred edges, deckle-cut burn on the upper right). Flavor text overlay: "She filed the world. She did not file herself." webp output, 512×768, transparent background outside the card frame.* | `cdn/client-public/art/cards/nexus_trial/locke_burnt.webp` |
| `BC-02` | Wraith Calder burnt variant | `cinematics.ts` → `WRAITH_CALDER.cardBurnArt` | *Card art replacement for Wraith Calder. Compose: open Recovery Ledger from above, single visible thumb-mark in the upper-right margin of the page, names written in faded ink on the page. Burnt-card aesthetic, deckle-cut burn. Flavor text overlay: "She was last seen carrying the names. We do not know which names she saved."* | `cdn/client-public/art/cards/nexus_trial/wraith_calder_burnt.webp` |
| `BC-03` | Lycos burnt variant | `cinematics.ts` → `LYCOS.cardBurnArt` | *Card art replacement for Lycos / The Wolf. Compose: empty wooden bench from front, four shadowed wolves arrayed in a half-circle facing the bench, deep blue-violet Anara sky behind them with frozen hero-constellations. Burnt-card aesthetic, deckle-cut burn. Flavor text overlay: "He went back into Anara. The pack waited at the bench. He did not return to it."* | `cdn/client-public/art/cards/nexus_trial/lycos_burnt.webp` |
| `BC-04` | Akai Shi burnt variant | `cinematics.ts` → `AKAI_SHI.cardBurnArt` | *Card art replacement for Akai Shi / Red Death. Compose: single grey-faded helmet on a dark substrate floor, two robed silhouettes sleeping on either side of the helmet (one is the Necromancer, one is the absence where Akai was). Burnt-card aesthetic, deckle-cut burn. Flavor text overlay: "The Red Death gave her colour back to the dark. The dark accepted."* | `cdn/client-public/art/cards/nexus_trial/akai_shi_burnt.webp` |
| `BC-05` | Vex Solène burnt variant | `cinematics.ts` → `VEX_SOLENE.cardBurnArt` | *Card art replacement for Vex Solène. Compose: empty high-backed wooden chair from the chair's-back angle (chair facing camera), open leather inventory ledger on a teal-and-bronze table, three checkmarks in the ledger and a blank fourth line. Burnt-card aesthetic, deckle-cut burn. Flavor text overlay: "She finished the inventory. She did not finish the courtesy."* | `cdn/client-public/art/cards/nexus_trial/vex_solene_burnt.webp` |

**T-minus deadline**: T-14 days (so all 5 are on CDN by the time the Trial fires and the activated variant can swap immediately at Verdict close).

**Approval owner**: Narrative Lead.

---

## §4 — Cosmetic art commissions (25)

Per `docs/design/NEXUS_TRIAL_PLAN.md` Cosmetic Rewards section. The plan's catalog is the canonical source; this brief gives each item its commission prompt.

### Universal commemoratives (4)

| ID | Asset | Surface | Prompt | Delivery |
|----|-------|---------|--------|----------|
| `COS-01` | The Antiquarian's Quill | Avatar item | *Small quill-pen icon, ink-black silhouette on transparent background, single trailing ink-drop on the lower right. 128×128 webp. Subtle gold filigree at the nib. Hover-text: "Profile decoration. Held by players who were present during any Trial phase."* | `cdn/client-public/art/cosmetics/nexus_trial/cos_01_antiquarians_quill.webp` |
| `COS-02` | Locke's Pendant | Avatar item / chest decoration | *Small pendant icon — a folded ledger-page in profile, suspended from a thin chain. Brass tone on transparent background. Engraved at the bottom: "She filed the world." (text in micro-engraving style; legible only on hover). 128×128 webp.* | `cdn/client-public/art/cosmetics/nexus_trial/cos_02_lockes_pendant.webp` |
| `COS-03` | Witness of MMXXVII | Player title | *Title string asset (no visual). String: "Witness of MMXXVII". Localized variants needed for all shipped locales.* | (string asset; no CDN art) |
| `COS-04` | Ledger Profile Theme | Profile page styling | *Profile-page theme: parchment-and-ink Adjudicator's-bench background; toggleable. Provide 3 deliverables: (a) full-bleed background 1920×1080 webp, (b) component overlays (cards, panels) as a Tailwind-token override file, (c) Adjudicator's-bench seal as 256×256 webp accent.* | `cdn/client-public/art/cosmetics/nexus_trial/cos_04_ledger_theme/` (folder) |

### Phase-presence pins (6)

Each pin auto-grants if the player submitted any testimony during that phase. Pin assets ship as a six-icon strip on the player's profile.

| ID | Asset | Granted for | Visual | Delivery |
|----|-------|-------------|--------|----------|
| `COS-05` | Charge Pin | Testimony hours 0–12 | *Pin icon: verdict-arrow pointing right, brass-and-cream. 64×64 webp.* | `cos_05_charge_pin.webp` |
| `COS-06` | Opening Pin | Testimony hours 12–24 | *Pin icon: pen-nib silhouette, brass-and-ink. 64×64 webp.* | `cos_06_opening_pin.webp` |
| `COS-07` | Evidence Pin | Testimony hours 24–36 | *Pin icon: balanced scales, brass. 64×64 webp.* | `cos_07_evidence_pin.webp` |
| `COS-08` | Cross-examination Pin | Testimony hours 36–48 | *Pin icon: broken chain, brass-and-iron. 64×64 webp.* | `cos_08_cross_examination_pin.webp` |
| `COS-09` | Confession Pin | Testimony hours 48–60 | *Pin icon: open hand, brass-and-cream. 64×64 webp.* | `cos_09_confession_pin.webp` |
| `COS-10` | Verdict Pin | Testimony hours 60–72 | *Pin icon: sealed ledger with a wax seal, brass-and-crimson. 64×64 webp.* | `cos_10_verdict_pin.webp` |

All six paths → `cdn/client-public/art/cosmetics/nexus_trial/`.

### Preparation Mission medals (5)

Auto-granted on mission pass. Displayed as a row on the profile beneath the phase pins.

| ID | Medal | Visual | Delivery |
|----|-------|--------|----------|
| `COS-11` | The Recovered Hand (Salvage) | *Medal icon: five burnt cards bound by a red ribbon, brass medallion frame, 128×128 webp.* | `cos_11_recovered_hand.webp` |
| `COS-12` | The Filed Page (Reverse Trial) | *Medal icon: Locke's quill resting on a sealed page (wax seal visible), brass medallion frame, 128×128 webp.* | `cos_12_filed_page.webp` |
| `COS-13` | The Substrate Bloom (Tribunal: Elara) | *Medal icon: a rose-and-grey fractal flower, brass medallion frame, 128×128 webp.* | `cos_13_substrate_bloom.webp` |
| `COS-14` | The Open Chip (The Question) | *Medal icon: The Human's chip in mid-handoff (held by a hand entering from the bottom-left), brass medallion frame, 128×128 webp.* | `cos_14_open_chip.webp` |
| `COS-15` | The Council Seal (Bidding War) | *Medal icon: 24 sub-house sigils arranged as a wheel, brass medallion frame at the centre, 128×128 webp.* | `cos_15_council_seal.webp` |

All paths → `cdn/client-public/art/cosmetics/nexus_trial/`.

### Ballot-winner mementos (4)

Whichever ballot name the community chooses, ALL players receive the corresponding memento — not gated on having voted for that name. The memento honors the dying name, not the voter's loyalty.

| ID | Memento | Visual | Surface | Delivery |
|----|---------|--------|---------|----------|
| `COS-16` | The Thumb-Marked Ledger (Wraith) | *Profile decoration: an open ledger with the recovered names visible on the inside cover; a single visible thumb-mark on the upper-right margin. 256×384 webp.* | Profile decoration | `cos_16_thumb_marked_ledger.webp` |
| `COS-17` | The Pack's Half-Circle (Wolf) | *Profile decoration: the empty bench from front, four shadowed wolves arrayed in a half-circle facing the bench, deep blue-violet Anara sky. 256×384 webp.* | Profile decoration | `cos_17_packs_half_circle.webp` |
| `COS-18` | The Grey Helmet (Akai) | *Avatar item: small helmet icon, faded from red to grey; hover-text displays "The Red Death gave her colour back to the dark. The dark accepted." 128×128 webp.* | Avatar item | `cos_18_grey_helmet.webp` |
| `COS-19` | The Unfinished Inventory (Vex) | *Profile decoration: a ledger page with three checks and a blank fourth line; teal-and-bronze table edge visible. 256×384 webp.* | Profile decoration | `cos_19_unfinished_inventory.webp` |

### Companion-sacrifice private cosmetics (2)

Romance-gated and **player-local visibility only** — appear on the player's own profile view but do not display to other players. The romance was theirs; the memento is theirs.

| ID | Cosmetic | Romance branch | Visual | Delivery |
|----|----------|----------------|--------|----------|
| `COS-20` | The Senate Seat | Elara romanced + sacrificed | *Profile decoration: single seat in the Atarion Senate chamber, dimly lit, empty. Player-local only. 256×384 webp.* | `cos_20_senate_seat.webp` |
| `COS-21` | The Chip | Human romanced + sacrificed | *Avatar item: small chip from the Confession cinematic, glows faintly. Player-local only. 128×128 webp.* | `cos_21_the_chip.webp` |

### Politician-fork banners (3)

Reflect the community's collective engagement outcome. Every player who participated sees their banner update on Day 1 of Season 2.

| ID | Banner | Fork outcome | Visual | Delivery |
|----|--------|--------------|--------|----------|
| `COS-22` | The Sealed Seat | `seat_sealed` (high engagement + Light) | *Profile banner: a marble seat with a quiet wax seal across it. Hover: "You closed the door before she returned." 1024×256 webp.* | `cos_22_sealed_seat.webp` |
| `COS-23` | The Yellow Thread | `constrained_return` (high engagement + Dark) | *Profile banner: a yellow thread running through the player's other cosmetics (composited; the thread is the layer that overlays). 1024×256 webp + companion overlay layer.* | `cos_23_yellow_thread.webp` |
| `COS-24` | The Open Seat | `full_return` (low engagement) | *Profile banner: an empty seat with a yellow sash draped over it. Hover: "You let her sit." 1024×256 webp. Make this the most VISUALLY striking of the three — players who didn't participate end up wearing the absence visibly to others.* | `cos_24_open_seat.webp` |

### Profile-theme cross-listed (1)

`COS-25` is reserved for the Ledger Profile Theme **token-bundle and Tailwind override** (the visual asset itself ships at COS-04). This commission produces the actual configuration file producers + Tailwind v4 will load.

| ID | Asset | Description | Delivery |
|----|-------|-------------|----------|
| `COS-25` | Ledger Theme — token bundle | *CSS file with `--ledger-bg`, `--ledger-ink`, `--ledger-paper`, `--ledger-accent`, `--ledger-seal` custom properties matching the parchment-and-ink aesthetic of COS-04. Tailwind v4 `@theme inline` block.* | `cdn/client-public/art/cosmetics/nexus_trial/cos_25_ledger_theme.css` |

**T-minus deadline (all §4)**: T-14 days.

**Approval owner**: Cosmetic Lead.

---

## §5 — Adjacent surfaces (7)

Per user expansion-of-scope decision. SFX cues + ambient beds + the Day-1 broadcast VO.

### Three Clocks UI audio cues (4)

| ID | Cue | Trigger | Audio prompt | Delivery |
|----|-----|---------|--------------|----------|
| `ADJ-01` | Vortex drum motif | Vortex phase transitions to `vortex_advance` | *Deep low-end drum hit followed by a 4-second drone (sustained low D). Mood: doomsday clock arrives. Loops cleanly at end so the next 4-second cycle starts on-beat. mp3, mono, -12 LUFS.* | `cdn/client-public/audio/nexus_trial_sfx/vortex_drum.mp3` |
| `ADJ-02` | Necromancer manifesting flicker | Necromancer phase enters `manifesting` | *Brief violet-flicker SFX: 0.5s string-noise descending half-step, ends on a slow heartbeat. Mood: He stirs. mp3, mono, -14 LUFS.* | `cdn/client-public/audio/nexus_trial_sfx/necromancer_manifesting.mp3` |
| `ADJ-03` | Politician contested-pip slide | Politician seat transitions `sealed → contested` | *Subtle 1.5s SFX: brass-tone slide upward through a fifth, no resolution. Mood: A door has opened. mp3, mono, -14 LUFS.* | `cdn/client-public/audio/nexus_trial_sfx/politician_contested.mp3` |
| `ADJ-04` | Three-clocks Fracture chord | All three clocks at critical state simultaneously (the Fracture trigger) | *4-second sustained orchestral chord — three voices (low brass, mid strings, high pad) entering in succession over 1s each, holding for 1s together. Mood: convergence. Used as the composite cinematic's sting. mp3, stereo, -10 LUFS.* | `cdn/client-public/audio/nexus_trial_sfx/three_clocks_fracture.mp3` |

### Confession-phase environment audio (2)

Loop-able ambient beds for the two Confession cinematic environments. Layer under the VO; mix at -28 LUFS so the dialog sits above.

| ID | Bed | Environment | Audio prompt | Delivery |
|----|-----|-------------|--------------|----------|
| `ADJ-05` | Senate-chamber substrate hum | `confession_elara_dies` cinematic | *60-second loopable ambient bed: slow rose-tinted drone (warm low strings + sub bass at 50Hz), occasional distant wooden-creak (the chamber settling), no melodic content. Mood: a memorial chamber breathing. mp3, stereo, -28 LUFS.* | `cdn/client-public/audio/nexus_trial_sfx/elara_substrate_hum.mp3` |
| `ADJ-06` | Inception Ark rotunda diagnostic-print rhythm | `confession_human_dies` cinematic | *60-second loopable ambient bed: low electrical hum + diagnostic terminal printer-click rhythm at 4Hz throughout (the name-printing audio that the cinematic shows visually). No melodic content. Mood: substrate accepting. mp3, stereo, -28 LUFS.* | `cdn/client-public/audio/nexus_trial_sfx/human_diagnostic_print.mp3` |

### Day-1 Daily Brief Antiquarian broadcast VO (1)

The composer `composeDay1DailyBrief` (`apps/shared/seasons/season2/composer.ts`) produces 24 variant-shaped texts. The VO commission delivers a **structured recording** the playback layer can compose at render time from per-variant clips.

| ID | Asset | Source | Prompt | Delivery |
|----|-------|--------|--------|----------|
| `ADJ-07` | Day-1 Daily Brief Antiquarian broadcast | `composer.ts` → `composeDay1DailyBrief` | *VO recordings for the Antiquarian's year-closing entry. 24 variants are NOT individually recorded; instead, record the SHARED OPENING (8 lines), then the SACRIFICED-COMPANION CLAUSES (2 variants — elara / human), the BALLOT-WINNER CLAUSES (4 variants), the POLITICIAN-FORK CLAUSES (3 variants), the SURVIVOR CLAUSE (2 variants), and the SHARED CLOSING (3 lines). At render time the playback layer concatenates the matching clips. Total recording: 22 clips. Use the Antiquarian voice profile from §1.* | `cdn/client-public/audio/nexus_trial/antiquarian/day1_brief/<clip_id>.mp3` |

The 22 clips per `ADJ-07`:
- `day1_open_01` through `day1_open_08` — shared opening (8 lines: header, narrative framing, transition into "What changed since you closed your eyes:", and the Locke retirement line)
- `day1_comp_elara`, `day1_comp_human` — sacrificed-companion clauses (2)
- `day1_ball_wraith_calder`, `day1_ball_lycos`, `day1_ball_akai_shi`, `day1_ball_vex_solene` — ballot-winner clauses (4)
- `day1_pol_sealed`, `day1_pol_constrained`, `day1_pol_full` — Politician fork clauses (3)
- `day1_surv_human`, `day1_surv_elara` — survivor clauses (2; whichever companion is alive in "What remains:")
- `day1_close_01`, `day1_close_02`, `day1_close_03` — shared closing (Necromancer dormancy duration + rules-version note + final beat)

### Future-Trial recording note (1)

| ID | Asset | Note |
|----|-------|------|
| `ADJ-08` | Sub-bass identity stinger | Reserve a single sub-bass identity stinger for any future Trial. *2-second sub-bass note at 30Hz, deep but warm, used as the "Trial open" / "Trial close" identity tag. mp3, stereo, -14 LUFS.* Delivery: `cdn/client-public/audio/nexus_trial_sfx/trial_identity_stinger.mp3` |

**T-minus deadline (all §5)**: T-14 days (matches cosmetic delivery).

**Approval owner**: Event Director (these surfaces fire during the live event itself).

---

## §6 — Delivery schedule and approval workflow

### Per-domain T-minus deadlines (mapped from `docs/design/NEXUS_TRIAL_PLAN.md` Implementation Phasing)

| Domain | T-minus | Source phasing reference |
|---|---|---|
| §1 VO booking | T-60 | Sprint 11 — VO bookings need 60-day lead time |
| §1 VO final recordings | T-30 | Sprint 11–12 |
| §2 Cinematic visual final renders | T-30 | Sprint 11–12 (alongside VO) |
| §3 Burnt-card art variants | T-14 | Day-1 patch ships them; staged earlier so all 5 are CDN-ready |
| §4 Cosmetic art (all 25) | T-14 | Day-1 + Day-7 patches need them on CDN |
| §5 Adjacent (SFX + Day-1 Brief VO) | T-14 | Live-event surfaces |
| All last-look approvals | T-7 | Pre-Trial readiness gates |

### Approval workflow

| Domain | Approval owner | Approval surface |
|---|---|---|
| §1 VO commissions | Narrative Lead | A/V playback at T-7; each clip approved against its voice-direction quote |
| §2 Cinematic visuals | Narrative Lead | Storyboard sign-off at T-30 + final clip approval at T-7 |
| §3 Burnt-card art | Narrative Lead | Per-asset approval at T-14 |
| §4 Cosmetic art | Cosmetic Lead | Catalog spot-check at T-14 (sample 5 of 25) + full sign-off at T-7 |
| §5 Adjacent surfaces | Event Director | Live-event mix-down at T-7 (full audio playback in the operator dashboard) |
| §6 Operator-abort cinematic VO/visual (VIS-08 + VO-24, VO-25) | Event Director | The Director owns the abort decision and its cinematic; sign-off at T-14 |

### Last-look gate

Per `docs/design/NEXUS_TRIAL_SHIP_READINESS.md` pre-Trial readiness gate #8: *Cinematic A/V review signed off by Narrative Lead.* This brief's §1 + §2 commissions land that gate.

---

## Delivery checklist

For each commission:

1. Confirm the source citation (file + line range) before generating the prompt — never paraphrase voice direction or cinematic action.
2. Render against the appropriate generator (ElevenLabs for VO; Veo 3.1 for cinematic visuals; vendor's choice for cards / cosmetics).
3. Upload to the CDN path specified in the commission row.
4. Mark approval status in the approval surface owned by the listed owner.
5. Commit the delivery manifest entry — no code change required on delivery, only manifest updates per the existing pattern in `apps/shared/expansionArt/`.

**Final coverage check**: run
```
grep -cE "^### (VO|VIS|BC|COS|ADJ)-|^\| \`(VO|VIS|BC|COS|ADJ)-[0-9]+\`" \
  docs/production/NEXUS_TRIAL_COMMISSIONS_BRIEF.md
```
A returned count of ≥70 confirms the brief has not been corrupted between authoring and delivery. The breakdown: 8 VIS commissions live under their own headings (full Veo schema blocks); the remaining ~63 (VO + BC + COS + ADJ) live in table-row form (denser; each row carries its own prompt). Both forms are commission entries.
