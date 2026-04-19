# Dischordian Saga — Acts 2-7 Narrative Interlock Plan

## Context

The 7-act narrative spine is already authored with full dialog in
`apps/client/src/data/narrativeActs.ts`, and the horizontal witnessing
system (Year One Calendar, bond milestones, Kael Fragments, Engineer
Recordings, Chronicle entries) exists in `apps/shared/witnessing*.ts`
— but the two tracks only partially interlock. Witnessing stops at
Act 5, leaving Acts 6-7 as orphaned dialog. Several mechanically
authored systems (crafting, chess depth, Game Masters, Trade Empire,
Collector's Arena, racing, casino, Cades FPS, army recruitment,
prestige, Palimpsest) sit adjacent to the story without explicit
narrative anchors. The companion/ask/opponent-dialog lattice is
scaffolded for Act 1 only (see `ACTS_2_7_COMPLETENESS_AUDIT.md`).

This plan is a **narrative interlock design**, not a code
implementation plan. It preserves the existing authored dialog and
specifies, for each of Acts 2-7:
- Story beats in order, with trigger and effect
- Which systems surface in the act and how they are framed narratively
- Which horizontal layers (calendar, milestones, Chronicle, Kael
  Fragments, Engineer Recordings, Palimpsest) contribute
- Which recurring characters advance
- Which `cc_actN_*` reactive slots and `ask_*` topics the act needs
- The flag contract (reads / writes) the neighboring acts depend on

It also extends witnessing to Acts 6-7 (Year Two Months 13-16 with
four new milestones and six new Chronicle entries), interlocks the
Palimpsest game show (Appendix C) as a first-class track across
Acts 3-5, and maps every orphan system to a named story beat.

**Intended outcome:** a single reference document from which
subsequent implementation work (data-shell authoring, UI wiring,
VO scripting, witnessing extensions) can proceed without further
narrative design decisions.

---

## Authoritative reference files

- `docs/production/ALL_ACTS_ROADMAP.md` — combined timeline
- `docs/narrative-audit/ACTS_2_7_COMPLETENESS_AUDIT.md` — gaps
- `docs/design/NARRATIVE_ARCHITECTURE.md` — identity chains, canon
- `docs/design/YEAR_ONE_EVENTS_CALENDAR_V2.md` — calendar structure
- `apps/client/src/data/narrativeActs.ts` — Act 2-7 dialog (preserved)
- `apps/shared/witnessingYearOne.ts` — calendar + Chronicle
- `apps/shared/witnessingEvents.ts` — milestone events
- `apps/shared/witnessingIntegrations.ts` — prestige carryover
- `apps/shared/act2Interlude.ts` — §6.2-§6.4 data shell
- `apps/shared/act3EyesBiography.ts` — §7 biography + infiltration
- `apps/shared/actsFourFiveShells.ts` — §9-§11 Arena + racing + FPS
- `apps/shared/appendixBKaelQuestline.ts` — Kael fragments F1-F6
- `apps/shared/appendixC/*` — Palimpsest episodes
- Companion/ask/opponent templates:
  `apps/shared/companionComments.ts`, `companionAskTopics.ts`,
  `preludeSystemTutors.ts`, `act1OpponentDialog.ts`

---

## Act 2 — "The Engineer's Bench" / "The Whisper"

**Premise & emotional arc.** The Ark exhales. Act 1's Authority trial
is over; now the player inherits a dead man's workshop. The Human
begins *whispering mid-match* — his first un-authored-by-Elara
interjections — and the player learns that making something is how
this ship mourns. Bond rises from ~45 to ~65; the ship teaches craft,
then takes both narrators' voices away as if to say: you know enough
now to listen to your own hands.

**Core beats.**
1. **Bench Power-On** (`ENGINEERS_BENCH_FRAMING.firstPowerOn`).
   Trigger: enter Engineering with `act_1_complete`. Effect: unlocks
   Memory Energy currency.
2. **First Substrate Ping** (`narrativeActs.ts:498`). Trigger:
   mid-first-crafted-match. Fires `cc_act2_first_whisper`. Effect:
   Human's in-match commentary active.
3. **Light/Dark Craft Fork** (`firstLightCraft` / `firstDarkCraft`).
   Reads `lightDarkAlignment`; writes `act2_first_craft_alignment`.
4. **Zephyr-9's Classroom** (`ZEPHYR_9_CLASSROOM` depths 1→3→5→8).
   Chess_depth unlocks gated by narrative beats, not stat grind.
   Depth 8 = "Engineer's Opening."
5. **First Game Master Loss** (`GAME_MASTER_FIRST_LOSS_LINE`). Seeds
   the Act 3-4 culling-boss payoff (`cullingActs: [3, 4]`).
6. **Silence of Two Witnesses** (bond 60). Both narrators dark,
   Light/Dark energy freezes. Writes `event_silence_of_two_witnesses`.
7. **Bench Goes Silent** — `act_2_complete` Chronicle entry.

**Systems surfaced (narratively bound).**
- **Crafting Bench** — "Patch needs the Engineer's unfinished keycard
  re-forged." Memory Energy drain (`outOfMemoryEnergy`) is the pinch
  that *points the player at Trade Empire* (Act 3 hook).
- **Chess depth** — Zephyr-9 teaches "reading moves before you make
  them"; each tier is the reward for a narrative beat.
- **Game Masters (Left/Right)** — seeded here, paid off in Acts 3-4.

**Horizontal layer contributions.**
- Calendar Month 6 — "The Engineer's Bench" (authored).
- Milestone: `silence_of_two_witnesses` (bond 60).
- Chronicle: `act_2_complete` → "The Bench Goes Silent" (authored).
- Engineer Recordings 2 ("The Prince's Truth") and 3 ("Ghosts in
  the System") unlock on Archives + Observation Deck visits.
- Kael Fragment F2 "The Recorded Voice" eligible (30 min idle Comms
  with Human active — natural fit after substrate ping).

**Character arcs active.** Engineer (posthumous recordings 2-3 expose
Celebration truth + invisible network); Elara (recoils at first Dark
craft; the Silence is her withdrawing); The Human (first in-match
voice); Zephyr-9 (promoted from tutor to teacher).

**Reactive / Ask slots to author.**
- `cc_act2_first_whisper` — Human first interjects mid-match.
- `cc_act2_silence_onset` — first time both narrators mute post-60.
- `cc_act2_gm_first_loss` — after first Game Master defeat.
- `ask_substrate_whisper` (unlockedFromAct 2) — dual-narrator answers.
- `ask_engineers_bench` (unlockedFromAct 2) — both narrators answer;
  Elara lies; Human doesn't; both omit.

**Flags read:** `lightDarkAlignment`, `act1_authority_outcome`,
`act_1_complete`.
**Flags written:** `act_2_started`, `chess_depth`,
`act2_first_craft_alignment`, `bench_powered_on`,
`event_silence_of_two_witnesses`,
`engineer_recording_{2,3}_discovered`, `act_2_complete`.

---

## Act 3 — "The Eyes in the Dark" / "The Offer"

**Premise & emotional arc.** Silence breaks. The Human *offers* the
player Kael's pre-Fall navigation logs — a forbidden gift. What the
player does with it commits them to one of three faction paths, and
the *shape* of those paths is traced by a parallel biography: **the
Eyes**, the Watcher's protégé, whose seven life stages
(`EYES_BIOGRAPHY`) surface as the player crosses the Trade Empire
hubs she haunted. Bond moves into the 65-75 range; the player learns
that betrayal and love wear the same clothes.

**Core beats.**
1. **The Offer accepted / deflected / concealed**
   (`narrativeActs.ts:506-619`). Writes `act3_disclosure_posture`,
   carrying `act1_path_*` forward.
2. **Thaloria Echo** — bond-independent milestone on first Thaloria
   cinematic trigger. Writes `event_thaloria_echo`; Chronicle authored.
3. **Helmet in the Grass** (Month 7) — Eyes biography stages 1-3
   (recruitment → first mission → senate arrival) surface in Trade
   Empire hubs as Loredex drops.
4. **The Balcony** (`elara_seduction`) — Elara's slot goes quiet on
   this frame. Stealth emotional peak of the act.
5. **Infiltration Choice** (Month 9). Player commits to Insurgency /
   Empire / Hierarchy (`INFILTRATION_PATHS`). Writes one of three
   `act3_*_committed` flags.
6. **Eyes Voice Layer** (late Act 3; `eyes_voice_layer`). The Eyes
   begins speaking *in the background* of trade missions — she is
   the fourth narrator all along.
7. **Path-specific ending** — Insurgency → `the_engineer_speaks`
   (Engineer's voice returns via Signal Beacon, separate from the
   Warlord's body); Empire → `the_archon_recruited`; Hierarchy →
   `hierarchy_infiltration_complete` + Dreamer's Shield cracks on
   the galactic map.

**Systems surfaced (narratively bound).**
- **Trade Empire** — reframed as following a dead woman's route.
  Every Eyes stage is anchored to a hub via `surfacesIn`.
- **Loredex** — Eyes biography entries are Loredex-first.
- **Diplomacy Table** — Locke at the head; Watcher mystery starts
  leaking here.
- **Ripple Engine** — Thaloria Echo emits via existing engine.

**Horizontal layer contributions.**
- Calendar Months 7, 8, 9 (authored).
- Milestones: `thaloria_echo`, one of `the_engineer_speaks` /
  `the_archon_recruited` / `hierarchy_shield_cracks`.
- Engineer Recordings 4 ("The Line That Was Crossed") and 5
  ("Instructions for Theft") unlock on Comms + Bridge visits.
- Kael Fragments F2, F3 likely resolve here (F3 requires 6 Trade
  Empire runs into `panopticon_ruins`).
- **Palimpsest Month 10 overlaps Act 3→4 boundary.** See Palimpsest
  Interlock section below.

**Character arcs active.** Eyes (entire biography surfaces); Elara
(Senate Arrival destabilizes her — she remembers the Balcony without
knowing why); The Human (compromises himself by handing over logs);
Kael (named "The Recruiter" for first time via F2 audio); Locke
(ally/block); Watcher (first mentioned via Eyes' death line).

**Reactive / Ask slots to author.**
- `cc_act3_offer_path_transparent` / `_pragmatic` / `_secret` — one
  per branch (closes audit gap).
- `cc_act3_balcony` — fires when Elara's portrait mutes on
  `act3_eyes_elara_encounter_seen`.
- `cc_act3_infiltration_commit_{insurgency,empire,hierarchy}`.
- `ask_elara_kael_logs_followup` (multi-answer, per log revealed).
- `ask_human_the_offer` (unlockedFromAct 3).
- `ask_elara_balcony` (unlockedFromAct 3, gated on
  `act3_eyes_elara_encounter_seen`).

**Flags read:** `act1_path_A/secret/partial_share`, `chess_depth`,
`act_2_complete`.
**Flags written:** `act_3_starting`, `act3_disclosure_posture`,
`act3_*_committed`, `act3_eyes_*_seen` (×7), `event_thaloria_echo`,
one of three endings, `te_eyes_voice_shipped`,
`engineer_recording_{4,5}_discovered`, `act_3_complete`.

---

## Act 4 — "The Prisoner" / "The Revelation"

**Premise & emotional arc.** Collector's Arena is *relabelled in
place* — same fights, each now canonically a memory extraction from
Kael. The Human's truth arrives in the shape dictated by
`act1_path_*` (Willing Disclosure / Discovery / Betrayal). Bond 80
hits; the Two Witnesses physically meet in the Memorial Corridor and
wait for the player's judgment. Emotional floor of the game.

**Core beats.**
1. **The Cell** (`act4_prisoner_cell_complete`) — first extraction
   via Jailer defeat in `ch2`. Memory: Kael's sister whose name he
   can't remember.
2. **The Revelation** (`narrativeActs.ts:637-884`) — three dialog
   trees keyed on Act 1 path. Writes `act4_revelation_posture`.
3. **The Extraction** (`act4_prisoner_extraction_complete`) — Meme
   wears Kael's face; Human-fighter defeat in `ch8`.
   Stealth-foreshadows Palimpsest Ep13 Host-is-Meme.
4. **Two Witnesses Meet** (bond 80) — Memorial Corridor cutscene.
   Player's judgment (forgive / refuse / stand aside) writes
   `act4_memorial_judgment` — a third axis over the dialog choice.
5. **Warlord Rematch** (`act4_prisoner_warlord_complete`) — Kael's
   list of 73 names begins to surface as Loredex fragments.
6. **White Oracle Meets** (`act4_prisoner_oracle_complete`) — "Lay
   Down the Fight" Chronicle entry (authored). Oracle is the face
   the Meme tries to steal in Palimpsest Ep13.

**Systems surfaced (narratively bound).**
- **Collector's Arena** — reframed as memory extraction. Every
  fighter ID in `ACT_4_PRISONER_CHAPTERS` maps to a canonical chapter
  flag. Zero new art; narrative framing only.
- **War Room / Army recruitment** — unlocks at `act_4_started`;
  first two recruits available; full roster in Act 5.
- **Trust branches** — `reconciled` / `fragile` / `broken` writes
  `act4_trust_state`.

**Horizontal layer contributions.**
- Calendar Month 11 — "The Prisoner's Memory" (authored).
- Milestone: `two_witnesses_meet` (bond 80).
- Chronicle: `act4_prisoner_oracle_complete` → "Lay Down the Fight"
  (authored).
- Kael Fragments F4 ("The Tunnels") — Human-active Substrate Dungeon
  run; F5 ("The Apprentice Who Ran") — Apprentice Betrayal trigger.
- Engineer Recording 6 ("A Boy from Celebration") — unlocks in
  Medical; Engineer-saved-Agent-Zero beat sets up Act 5's Bridge of
  Kael reveal.

**Character arcs active.** Kael (from villain → prisoner → *man*);
The Human (identity fully exposed; one of three paths); Warlord
(revealed as Engineer's stolen body); White Oracle (first clean
appearance before Palimpsest Ep13 retroactively corrupts him); Eyes
(dead but still speaking in Trade Empire voice-layer residue).

**Reactive / Ask slots to author.**
- `cc_act4_path_a_revelation` / `_b_` / `_c_` (closes audit gap).
- `cc_act4_memorial_judgment_{forgive,refuse,stand_aside}`.
- `cc_act4_warlord_rematch` — when 73-names fragment first surfaces.
- `ask_human_identity_progress` (unlockedFromAct 4).
- `ask_other_paths` (unlockedFromAct 4) — retrospective "what was
  path B like" answers.
- `ask_elara_memorial` (gated on bond ≥ 80) — answer differs per
  judgment.

**Flags read:** `act1_path_*`, `act3_*_committed`, `chess_depth`,
`lightDarkAlignment`.
**Flags written:** `act_4_started`, `act4_revelation_posture`,
`act_4_prisoner_cell_complete`, `act4_prisoner_extraction_complete`,
`act4_prisoner_warlord_complete`, `act4_prisoner_oracle_complete`,
`act4_trust_state`, `act4_memorial_judgment`,
`event_two_witnesses_meet`, `engineer_recording_6_discovered`.

---

## Act 4.5 — "Dead Man's Circuit"

**Premise & emotional arc.** The game asks: *what are you willing to
bet that you are?* Circuit and Casino are two faces of the same
question. Pressure-release + identity-audit interlude between the
Revelation's grief and the Map's call to action. No new narrators,
no bond movement — only *identity movement*. Trophy Room Witnessing
Wall starts displaying the DMC identity chain (Student → Seeker →
Detective → The Last).

**Core beats.**
1. **Starting Grid confession**
   (`DEAD_MANS_CIRCUIT_TRACKS[0].openingLine`) — reads
   `act_4_5_started`.
2. **First Lap Loss** — writes `dmc_identity_scar` (Antiquarian
   references it later).
3. **Degen's Pact seat** — Dreamer is pit boss; Antiquarian deals.
   Each large bet wagers a chronology year.
4. **Identity Chain Completion** — Trophy Room Witnessing Wall
   populates the Student→Seeker→Detective→The Last card set.
5. **Circuit Complete** — `act_4_5_circuit_complete`; Act 5 hand-off.

**Systems surfaced (narratively bound).**
- **Racing (DMC)** — "what you call yourself on the final lap is
  what you will be called in Act 7."
- **Casino (Degen's Pact)** — *entropy as pedagogy*.

**Horizontal layer contributions.** No new Year One calendar month
(Act 4.5 is compressed between Months 11 and 12). One new
bond-independent event: **"The Identity Wager"** — fires on first
identity loss; unlocks an Elara post-session line.

**Character arcs active.** Dreamer (first on-screen as pit boss);
Antiquarian (first direct player interaction as dealer); The Last
Archon identity seed (Human's true chain label).

**Reactive / Ask slots to author.**
- `cc_act4_5_first_loss` — identity scar registered.
- `cc_act4_5_casino_all_in` — Dreamer acknowledges.
- `ask_antiquarian_why_he_deals` (unlockedFromAct 4).

**Flags read:** `act4_memorial_judgment`, `act4_trust_state`.
**Flags written:** `act_4_5_started`, `act_4_5_circuit_complete`,
`act_4_5_casino_complete`, `dmc_identity_scar`,
`dmc_identity_chain_unlocked`.

---

## Act 5 — "The Reckoning" / "The Map"

**Premise & emotional arc.** Kael's five-sector map lights up. The
player stops reacting and starts commanding. Iron Lion's 17,000-year-
old last broadcast plays. Army recruitment becomes the main loop.
Cades FPS runs seven missions and kills Iron Lion in M7. Post-credits:
the Bridge of Kael sits empty; Agent Zero's console holds a single
card with the Engineer's silhouette. The player is now the chronicler.
Bond holds at 75-85.

**Core beats.**
1. **Map Unfolds** — Elara's "I have been waiting seventeen thousand
   years to see these coordinates light up" line (audit-gap reactive
   `cc_act5_map_first_open`).
2. **Lion's Last Broadcast** — milestone triggers on Act 5 open;
   Chronicle authored.
3. **Cades M1-M4** — scout, onslaught, turning-the-tide, harvesting.
4. **Cades M5** — `mandatoryBeat: "forced_partial_loss"`. First
   canonical loss the player cannot prevent.
5. **Cades M6** — **Agent Zero Recruitment.** The "Agent Zero" heard
   via Armory signals was never real; this one is. Reads Engineer
   Recording 6 context.
6. **Cades M7** — **Iron Lion's Last Stand on Veridian VI.**
   `mandatoryBeat: "mandatory_death"`. Engineer Recording 7 ("Prayers
   in Metal") unlocks on completion.
7. **Vortex Core Cleared** — community milestone; Chronicle authored.
8. **Bridge of Kael post-credits** — Engineer's silhouette card warms
   the save for the rest of the cycle. Sets up Vex Solène recruitment.
9. **Bulb Dims / Sector Wakes** — community-state milestones fire
   through the act.

**Systems surfaced (narratively bound).**
- **Cades FPS** — canonical Iron Lion deathbed arc.
- **Army Recruitment** — framed as "the Eyes' final transmission"
  (`EYES_FINAL_TRANSMISSION_LINES`). Each recruit unlocks one line
  of her 9-name list.
- **Living Universe milestones** — Bulb Dims and Sector Wakes become
  the community's collective witness.
- **Prestige readiness** — `witnessingIntegrations.ts` carryover
  rules become legible.

**Horizontal layer contributions.**
- Calendar Month 12 — "The Reckoning" (authored).
- Milestones: `lions_last_broadcast`, `bulb_dims`, `sector_wakes`.
- Chronicle: `vortex_core_cleared` → "The Line Held" (authored).
- Kael Fragment F6 ("The Recruiter's Pamphlet") — requires Light
  meter at `act_1_cycle_b_complete_light`; unlocks here for Light-path
  players.
- Engineer Recording 7 — triggers on `cades_m7_complete`.
- Bridge of Kael post-credits (`bridge_of_kael_post_credit_seen`).

**Character arcs active.** Iron Lion (17,000-year-late voice, then
final death); Agent Zero / Vex Solène (resurrected as real; replaces
the dead-signal mystery); Engineer (last recording); Kael (fully
redeemed, absent); The Human (narrator, planning); Elara (remembers
Atarion cleanly for the first time).

**Reactive / Ask slots to author.**
- `cc_act5_map_first_open` — Elara's 17,000-year line as reactive.
- `cc_act5_lion_last_broadcast`.
- `cc_act5_cades_m5_loss` — Human's only comment.
- `cc_act5_cades_m7_death`.
- `cc_act5_bridge_of_kael`.
- `ask_star_map` (unlockedFromAct 5).
- `ask_vex_solene` (unlockedFromAct 5, gated on `cades_m6_complete`).
- `ask_army_roster` (unlockedFromAct 5) — surfaces Eyes transmission
  line count.

**Flags read:** everything prior; specifically `act3_*_committed`,
`act4_trust_state`, `act4_memorial_judgment`.
**Flags written:** `act_5_started`, `cades_m{1..7}_complete`,
`event_lions_last_broadcast`, `kael_questline_complete` (on F6),
`returned_to_bridge_post_kael`, `bridge_of_kael_post_credit_seen`,
`army_recruit_count` (integer).

---

## Act 6 — "The Confession"

**Premise & emotional arc.** Both narrators break. Elara confesses:
she was Senator Elara Voss on Atarion, sold humanity to the Architect
for immortality. The Human confesses: he has been *performing*
villainy to keep the Watcher looking at him and not at the player.
The Watcher concept surfaces publicly for the first time. Bond 85-95.
Gameplay loop: army mission board + confession dialogues. This is
the "two people finally tell you the truth and then ask what you
will do about it" act.

**Core beats.**
1. **Trigger** — `army_recruit_count >= 5`.
2. **Elara's Confession Sequence** — wheel_choice: empathy /
   challenge / refusal / reluctant ally → writes `act6_elara_response`.
3. **Watcher Named** — first canonical utterance of "the Watcher"
   outside Eyes' death line. Writes `watcher_revealed`.
4. **Human's Confession Sequence** — parallel wheel_choice → writes
   `act6_human_response`.
5. **Both Narrators Trust 80 Hand-Off** — existing
   `both_narrators_trust_80` trigger fires one authored line.
6. **Alliance or Refusal** — writes `act6_alliance_choice`. Sets
   Act 7's tone.

**Systems surfaced.** No new systems; army mission board is ambient
loop. Prestige-era narrator lines unlock.

**Horizontal layer contributions (NEW — Year Two).**
- **Month 13 — "The Second Silence"** (new). Brief: *"The Ark has
  survived a year. The calendar resets for no one. Elara asks to be
  read her own file. She has never asked this before."* Opens
  `year_two_month_13_opened`. Emphasizes: `act_6_confession`,
  `watcher`, `army_roster`.
- **Month 14 — "The Confession Season"** (new). Brief: *"Everyone
  who has a confession to make makes it this month. Locke visits the
  Ark. He does not bring the Syndicate's greetings. He brings his
  own."* Emphasizes: `act_6_confession`, `locke_visit`,
  `syndicate_arc`.
- **New milestone: `two_witnesses_confess`** (bond 90). Light +10;
  Dark pause. NPC reactions: Elara — "I said the sentence. The
  sentence was true. I do not know who I am now. I am going to find
  out."; Human — "She said hers first. That was the deal. My turn."
- **New milestone: `the_watcher_named`** — bond-independent; fires
  on `watcher_revealed`. Chronicle entry in Antiquarian voice.
- **New Chronicle entry** for `act_6_complete`: "What the Narrators
  Would Not Say."
- **Palimpsest residue:** Ep13's "count the pulses in his halo"
  warning is explicitly referenced by the Human here — players who
  played Palimpsest know what the Watcher *isn't*.

**Character arcs active.** Elara (identity revealed; asks to read
her own file next cycle); The Human (identity revealed; drops the
villain act); Watcher (named, still invisible); Antiquarian (first
direct fourth-wall acknowledgement that he has been writing this
down); Locke (one-scene Year Two appearance, optional).

**Reactive / Ask slots to author.**
- `cc_act6_elara_confession_aftermath`.
- `cc_act6_human_confession_aftermath`.
- `cc_act6_watcher_named`.
- `cc_act6_alliance_choice_{empathy,challenge,refusal,reluctant}`.
- `ask_human_who` — upgrade with
  `alternateAnswers: [{ unlockedFromAct: 6, answer: <post-confession> }]`
  (audit item #3, concrete example).
- `ask_elara_senator` (unlockedFromAct 6).
- `ask_human_watcher` (unlockedFromAct 6).
- `ask_antiquarian_everything` (unlockedFromAct 6) — chronicler
  finally speaks in reply.

**Flags read:** `army_recruit_count`, `act4_trust_state`,
`act_5_complete`, `palimpsest_ep13_envelope_seen` (optional).
**Flags written:** `act_6_started`, `act6_elara_response`,
`act6_human_response`, `act6_alliance_choice`, `watcher_revealed`,
`event_two_witnesses_confess`, `event_the_watcher_named`,
`act_6_complete`, `year_two_month_13_opened`, `year_two_month_14_opened`.

---

## Act 7 — "The Convergence"

**Premise & emotional arc.** Two wars, one voice. The visible war
(order vs. chaos) is the one everyone has been fighting. The
invisible war (against the Watcher) is the one the Human was carrying
alone. For the first and only time, Elara and The Human's voices
*align*. Four canon-safe stances. This is where prestige carryover
becomes canon.

**Core beats.**
1. **Trigger** — `army_recruit_count >= 15`.
2. **Army Status Display** — reads every Act 3 infiltration flag +
   Act 5 recruitment roster + Eyes transmission line count.
3. **Two Wars Revealed** — the Human's "playing the villain" line
   (`narrativeActs.ts:1130`) pays off. Writes `two_wars_revealed`.
4. **Voice Alignment** — first and only time narrators speak in sync.
   Sets `bond_synced`. Audio/VO must play both voices simultaneously.
5. **Four Stances** — FOR HUMANITY / SEE THE PATTERN / THE BRIDGE /
   TAKE COMMAND. Writes `convergence_choice`. All four canon-safe.
6. **"I've been waiting a very long time to say that to someone."**
   — final authored line.
7. **Prestige Handoff** — `applyPrestigeCarryover()` executes per
   `PRESTIGE_CARRYOVER_RULES`.

**Systems surfaced (narratively bound).**
- **Final Stance Choice** — 4-way `ChoicePillar` (pattern from Act 1
  §5.8.1 → Act 7 final stance).
- **Army Composition** — affects dialog tone, not outcome
  (documented invariant).
- **Prestige Rollover** — the one time the game *names* what it keeps
  and forgets: Loredex 100 / Bond 50 / Dominance 0 / Cards 25 /
  Milestones 100 / Moments 10.

**Horizontal layer contributions (NEW — Year Two).**
- **Month 15 — "The Two Wars"** (new). Brief: *"Two wars have names
  now. The Antiquarian stops writing footnotes and starts writing a
  title page."* Opens `year_two_month_15_opened`.
- **Month 16 — "The Convergence"** (new). Brief: *"They said the same
  sentence at the same time today. It was the sentence from the
  song. I have been waiting to hear it since the Academy closed."*
  Opens `year_two_month_16_opened`.
- **New milestone: `voices_align`** — bond sync; Light +50, Dark 0.
  Written to Chronicle as the shortest entry of Year Two ("Today,
  once. Not twice.").
- **New Chronicle entry** for `convergence_choice` — four variants,
  one per stance.
- **New "Prestige Threshold" milestone** — `prestige_cycle_1_complete`;
  Chronicle entry: "The Lion in Black." (Antiquarian hands the pen
  to his successor and walks out of frame.)

**Character arcs active.** Elara + The Human (voice alignment);
Watcher (still unseen, explicitly left for Year Two); Antiquarian
(last on-page appearance as chronicler — his red goggles dim for the
first time); Vex Solène / Agent Zero (optional post-credits cameo
reading the list of names); every infiltration-path consequence
surfaces in army status.

**Reactive / Ask slots to author.**
- `cc_act7_two_wars_reveal`.
- `cc_act7_voice_align` — the one line the game has been withholding.
- `cc_act7_stance_{for_humanity,see_pattern,bridge,take_command}`.
- `cc_act7_prestige_threshold`.
- `ask_convergence_options` (unlockedFromAct 7).
- `ask_what_prestige_keeps` (unlockedFromAct 7) — game's only
  diegetic explanation of the carryover table.
- **Per-opponent dialog table** (audit remediation #1): create
  `apps/shared/act7ConvergenceOpponentDialog.ts` mirroring
  `act1OpponentDialog.ts`.

**Flags read:** all prior; specifically `act3_*_committed`,
`act4_trust_state`, `act6_alliance_choice`, `watcher_revealed`,
`army_recruit_count`, Eyes transmission line count.
**Flags written:** `act_7_started`, `two_wars_revealed`,
`bond_synced`, `event_voices_align`, `convergence_choice`,
`act_7_complete`, `prestige_cycle_1_complete`,
`year_two_month_{15,16}_opened`.

---

## The Six Interlocking Threads

Each thread has a lead act and a closing act; the middle acts carry
it forward through specific beats.

| # | Thread | Act 2 | Act 3 | Act 4 | Act 4.5 | Act 5 | Act 6 | Act 7 |
|---|---|---|---|---|---|---|---|---|
| a | **Dual-narrator bond** | Bond 60 Silence | Balcony silence on Elara | Bond 80 Meet | Identity wager | Lion's broadcast stabilizes both | Bond 90 confessions | Voice alignment |
| b | **Kael's corruption → redemption** | F2 recorded voice | F3 theft route; Offer accepted | F4 tunnels; Prisoner chapters 1-4 | — | F6 pamphlet; questline complete; Bridge of Kael | Kael absent (redemption real) | Kael named in convergence roll |
| c | **Engineer's sacrifice → Vex awakening** | Recordings 2-3 | Recordings 4-5; Insurgency ending = Engineer Speaks | Recording 6 (sacrifice reveal) | — | Recording 7; Bridge of Kael card; Vex Solène recruited | Vex present in Elara's file read | Vex cameo post-credits |
| d | **Eyes' enslavement → return** | — | Full biography 1-7; voice layer; final transmission seeded | Eyes voice residue in Trade Empire | — | Each army recruit = one Eyes transmission line | Locke's visit references Eyes' Atarion network | Eyes' list completes if 9 agents recruited |
| e | **Infiltration-path political arc** | — | Commit flag | Faction consequences in Revelation framing | — | Faction shapes army roster | Locke's confession shaped by commit | Army status display shaped by commit |
| f | **The Watcher revelation** | — | First line (Eyes' death) | Hinted (Memorial's judge) | — | Palimpsest Ep13 warning lands (Month 10) | Watcher named | Watcher left for Year Two — convergence does not resolve it |

Each thread moves in at least four of the seven act columns
(verification assertion #14 below).

---

## Act 6-7 Witnessing Extension — Year Two

Acts 6-7 are currently orphaned from horizontal layers. Extend the
witnessing system symmetrically.

**Year Two Calendar (new months 13-16)** — author in
`apps/shared/witnessingYearOne.ts` as a second registry
(`YEAR_TWO_CALENDAR_RIPPLES`) or sibling file `witnessingYearTwo.ts`:

| Mo | Title | Story phase | Emphasizes | Opens flag |
|---|---|---|---|---|
| 13 | The Second Silence | Act 6 opens | act_6_confession, watcher, army_roster | year_two_month_13_opened |
| 14 | The Confession Season | Act 6 middle | act_6_confession, locke_visit, syndicate_arc | year_two_month_14_opened |
| 15 | The Two Wars | Act 7 opens | act_7_two_wars, watcher, prestige_preview | year_two_month_15_opened |
| 16 | The Convergence | Act 7 climax | convergence, prestige_rollover, lion_in_black | year_two_month_16_opened |

**New bond-sync milestones** (extend `WITNESSING_MILESTONES`):
- `two_witnesses_confess` — bond 90; Act 6 mid.
- `the_watcher_named` — bond-independent; Act 6 late.
- `voices_align` — bond sync; Act 7 climax.
- `prestige_threshold` — bond-independent; Act 7 post-credits.

**New Chronicle entries** (extend `BEAT_CHRONICLE_ENTRIES`):
- `act_6_elara_confession_complete` → "What the Senator Remembered."
- `act_6_human_confession_complete` → "The Villain Who Was Working
  For Us."
- `act_6_complete` → "What the Narrators Would Not Say."
- `act_7_two_wars_revealed` → "The Title Page."
- `act_7_complete` (×4 variants, one per stance) → "For Humanity" /
  "See The Pattern" / "The Bridge" / "Take Command."
- `prestige_cycle_1_complete` → "The Lion in Black."

**Prestige-era anchors.** Year Two does not reset; Antiquarian's
Chronicle continues into next cycle with `loredex 100%`,
`milestones 100%` carrying, `bond 50%` rebuilt, `dominance 0%` reset.
The `convergence_choice` value seeds the opening narrator tone of
the next cycle (one line per stance in next-cycle Prelude).

---

## Palimpsest Interlock (Acts 3-5)

Palimpsest runs as a **parallel track on Month 10**, overlapping
Act 3→4. First-class content stream, not a mini-game.

**Ep 1-6 (Month 10, first half) — during Act 3 late beats:**
- Ep 1-4: Darren established as nervous bureaucrat; his mother's
  Celebration connection surfaces (Ep 4 letter). *Reinforces Act 3
  Eyes biography: Celebration is the common origin.*
- Ep 5-6: Darren refuses to vote; Professor Glinn Vyre appears as
  guest judge. *Reinforces Act 2's Game Masters: the real one is
  dead, the Academy is still teaching adversarial structures.*

**Ep 7-11 (Month 10, second half) — during Act 3→4 boundary:**
- Ep 7: Darren refuses Alaric's order.
- Ep 8: "I am writing a new pamphlet" — mirror reference to Kael.
  *Reinforces Kael Fragment F6 (The Recruiter's Pamphlet).*
- Ep 9-10: Thaloria Debate. *Reinforces the Thaloria Echo milestone
  from Act 3.*
- Ep 11: Darren edited into villain, player shares a meal.

**Ep 12 (end of Month 10, aligned with Act 4 opening):**
- **Clause 14 Substitution.** Darren dies in the player's place.
  +200 Signal one-shot. **THE ASSISTANT card** enters the collection.
- First time a non-narrator NPC pays the full price for the player;
  *primes* the Act 4 Memorial Corridor. The player now understands
  the emotional register of a death-for-you before the Human reveals
  he has been dying-for-you across all of Act 4.
- Writes `darren_substitution_fired`, `dischordia_the_assistant_owned`,
  `darrens_mother_file_unlocked`.

**Ep 13 (Act 4 mid — the Host reveal):**
- **Host face-scroll.** Meme cycles through Game Master → White
  Oracle → Jailer → Prisoner → Oracle → Kael → Elara → Human →
  player → Meme's true face.
- **Three-beat monologue.** Writes `palimpsest_host_is_meme`. The
  third beat — "count the pulses in his halo" — is the only place
  in the entire game that points at the White Oracle as a future
  vector for the Meme. This anchors Act 4's White Oracle chapter
  (`act4_prisoner_oracle_complete`) as a *trustworthy* moment
  precisely because the Meme telegraphed it would later pretend to
  be him.

**Reinforcement of the Warlord / Thought-Virus theme.** The Meme is
the fifth Archon (shapeshifting). The Warlord is the woman-shaped
vessel of Thought Virus. Together they are the two faces of the
Virus's cultural + biological attack. Host-is-Meme reveal compounds
Act 4 Warlord Rematch (`act4_prisoner_warlord_complete`): the Virus
has been wearing both crowns. The player has defeated one face
(Warlord, Act 4) and witnessed the other (Meme, Palimpsest Ep13).
Act 7's convergence stance choices implicitly ask: do you treat the
Virus as an enemy, a pattern, or a tool?

---

## System-to-Narrative Binding Table

Every orphan system gets a named story beat that justifies its
existence.

| System | Narrative beat that frames it | Act | Canonical justification |
|---|---|---|---|
| Crafting Bench | Patch wants the Engineer's unfinished keycard re-forged | 2 | `ENGINEERS_BENCH_FRAMING.firstPowerOn` |
| Chess depth | Zephyr-9 teaches "reading moves before you make them"; depth 8 = Engineer's Opening | 2 | `ZEPHYR_9_CLASSROOM` |
| Game Masters | Left/Right lenses of a dead man's split goggles; Act 3-4 culling bosses | 2 seed; 3-4 payoff | `cullingActs: [3, 4]` |
| Trade Empire | Following the Eyes' route, buying what she died for | 3 | `EYES_BIOGRAPHY.surfacesIn` |
| Diplomacy Table | Locke's confession; Year Two Month 14 seeds Syndicate arc | 3 then 6 | `TRADE_EMPIRE_IMPROVEMENTS.diplomacy` |
| Palimpsest Game Show | Darren's substitution primes Act 4 death-for-you; Ep13 host reveal primes White Oracle trust | 3-5 parallel | `DARREN_ARC_BEATS`, `HOST_FACE_SCROLL` |
| Collector's Arena (story) | Each fight is a memory extracted from Kael the prisoner | 4 | `ACT_4_PRISONER_CHAPTERS` |
| Dead Man's Circuit | Betting identity on every lap; Trophy Room writes the chain | 4.5 | `DEAD_MANS_CIRCUIT_TRACKS[0]` |
| Degen's Pact casino | Dreamer as pit boss; entropy as pedagogy | 4.5 | `DEAD_MANS_CIRCUIT_TRACKS[1]` |
| Cades FPS | Iron Lion's last broadcast made material; Veridian VI last stand | 5 | `CADES_FPS_MISSIONS` |
| Army Recruitment | Each recruit unlocks one line of the Eyes' final transmission (9 names) | 5-7 | `EYES_FINAL_TRANSMISSION_LINES` |
| Prestige Rollover | Antiquarian's carryover rules become diegetic at convergence | 7 | `PRESTIGE_CARRYOVER_RULES` |
| Antiquarian's Journal | Every milestone raises a Chronicle entry; Year Two extends | throughout | `BEAT_CHRONICLE_ENTRIES`, `MILESTONE_CHRONICLE_ENTRIES` |

---

## The Natural Progression Spine

Why each act follows emotionally, thematically, and mechanically
from the previous.

**Act 1 → Act 2.** Act 1 ends with the Authority trial and the
Light/Dark alignment choice. The player has *declared* something and
now must *make* something with it. Crafting is the physical form of
the declaration; the Silence of Two Witnesses is the reward for a
player who has committed.

**Act 2 → Act 3.** The bench ran out of Memory Energy
(`outOfMemoryEnergy` pinch). The only source is outside the Ark —
Trade Empire. The Human's offer of Kael's logs is the specific key
that opens that door. The Game Masters' culling (Acts 3-4) is seeded
as the obstacle Act 2's chess depth is meant to survive.

**Act 3 → Act 4.** The player has committed to a faction and learned
the Eyes' whole biography. They now know someone died for a cause
they just joined. Act 4's Prisoner chapters pay off: the *other*
person who died for a cause — Kael — gets the same seven-stage
treatment via memory extraction, and the player begins to understand
the Human was paying that price for them all along.

**Act 4 → Act 4.5.** After the Memorial Corridor judgment, the
player's identity is destabilized. The Circuit and the Casino are
where identity is *wagered in public* — not as metaphor, as
mechanism. Controlled space to lose yourself and come back different
before the Map demands you command.

**Act 4.5 → Act 5.** The player has lost and re-chosen their
identity. Now they can hold Iron Lion's 17,000-year-old voice and
not flinch. Army recruitment is the *opposite* of the Circuit:
instead of betting a self, you collect other selves. Engineer's
final recording is the emotional engine; M7's mandatory death is the
last lesson in costs.

**Act 5 → Act 6.** The army is 5+ strong. The Bridge of Kael has
been read. The player is no longer the recipient of truth; they are
the audience the narrators owe truth to. Confession is the only beat
left.

**Act 6 → Act 7.** Both narrators have confessed. The player knows
about the Watcher. Army is 15+. The only thing left is the alignment
of voices — and the stance the player takes into the next cycle.

---

## Critical Dependency Graph

```
act_1_complete + lightDarkAlignment
  └── bench_powered_on (Act 2)
        └── chess_depth >= 3 (Act 2)
              └── event_silence_of_two_witnesses (bond 60)
                    └── act_2_complete
                          └── act3_disclosure_posture (Act 3)
                                └── act3_{insurgency,empire,hierarchy}_committed
                                      └── act_3_complete
                                            └── act_4_started
                                                  ├── act4_prisoner_{cell,extraction,warlord,oracle}_complete (all four)
                                                  ├── event_two_witnesses_meet (bond 80)
                                                  └── act4_memorial_judgment (any value)
                                                        └── act_4_5_circuit_complete
                                                              └── act_5_started
                                                                    ├── cades_m{1..7}_complete (all seven)
                                                                    ├── kael_questline_complete (F1-F6)
                                                                    └── bridge_of_kael_post_credit_seen
                                                                          └── army_recruit_count >= 5
                                                                                └── act_6_started
                                                                                      ├── event_two_witnesses_confess (bond 90)
                                                                                      └── watcher_revealed
                                                                                            └── army_recruit_count >= 15
                                                                                                  └── act_7_started
                                                                                                        ├── event_voices_align (bond sync)
                                                                                                        ├── convergence_choice
                                                                                                        └── prestige_cycle_1_complete
```

**Palimpsest parallel branch** (non-blocking, re-entrant into main):
- `palimpsest_ep12_clause_14_substitution_fired` → adds
  `dischordia_the_assistant_owned` before Act 4.
- `palimpsest_ep13_envelope_seen` → enriches Act 4 White Oracle trust
  *and* Act 6 Watcher reveal without being required for either.

**Cannot be skipped:** Act 1 alignment choice; Act 2 Silence
milestone; Act 3 infiltration commit; Act 4 Memorial Meet; all seven
Cades missions; F6 Kael fragment; Act 6 both confessions; Act 7
convergence stance.

**Can be skipped:** Palimpsest (entire track); F2 specifically (idle
gated); DMC Casino (Circuit alone satisfies Act 4.5); individual
Engineer Recordings 1-6 (only 7 is mandatory via `cades_m7_complete`).

---

## Verification — Assertions This Plan Must Satisfy

1. Every Act 2-7 system in the System-to-Narrative Binding Table has
   at least one named story beat from `narrativeActs.ts` or a shell
   file that frames it.
2. Every Kael Fragment F1-F6 has either a bond threshold or a
   calendar-month anchor documented in its act section.
3. Every Engineer Recording 1-7 has an act boundary anchor and a
   Chronicle entry in `BEAT_CHRONICLE_ENTRIES`.
4. Every Year One calendar month (1-12) has a story-phase mapping
   in `ALL_ACTS_ROADMAP.md`.
5. Acts 6-7 receive four new calendar months (13-16), four new
   milestones (`two_witnesses_confess`, `the_watcher_named`,
   `voices_align`, `prestige_threshold`), and six new Chronicle
   entries — closing the Year Two orphan gap.
6. Palimpsest Ep12 writes `dischordia_the_assistant_owned` and Ep13
   writes `palimpsest_host_is_meme` before Act 4's White Oracle
   chapter fires.
7. Each act specifies at least one new `cc_actN_*` reactive trigger
   (closes audit gap #2).
8. Each act specifies at least one new `ask_*` topic or an
   `alternateAnswers` upgrade (closes audit gap #3).
9. The `ask_human_who` topic gets an Act 6+ alternateAnswer.
10. Act 7 has a per-opponent dialog table file mirroring
    `act1OpponentDialog.ts` (audit remediation #1).
11. Every infiltration commit flag (`act3_*_committed`) is readable
    by Act 4 framing *and* Act 6 confession tone *and* Act 7 army
    status display.
12. Bond milestones 40 (Act 1 late), 60 (Act 2), 80 (Act 4), 90
    (Act 6), sync (Act 7) each have: a named milestone id, a
    Chronicle entry, and an NPC-reaction line for both narrators.
13. Prestige carryover is diegetic at Act 7 (`ask_what_prestige_keeps`)
    and canonical per `PRESTIGE_CARRYOVER_RULES`.
14. The Six Interlocking Threads table shows movement in at least
    four of the seven act columns for each thread.
15. No orphan system remains in `ALL_ACTS_ROADMAP.md` Cross-act
    system matrix without a beat in this plan.

**How to verify end-to-end:**
- Run existing tests: `pnpm test --filter shared` — ensures
  `witnessing*.ts` registries stay valid after extensions.
- After authoring Year Two months, add parallel tests under
  `apps/shared/__tests__/witnessingYearTwo.test.ts` mirroring
  Year One shape.
- After authoring `act7ConvergenceOpponentDialog.ts`, add
  `act7ConvergenceOpponentDialog.test.ts` using the 12-field schema
  pattern from `act1OpponentDialog.test.ts`.
- Manual playthrough gate: start a new save, confirm each of the 15
  assertions above fires its expected flag/Chronicle entry at the
  expected trigger.

---

## Critical Files to Modify (when implementation begins)

- `apps/shared/witnessingYearOne.ts` (or new `witnessingYearTwo.ts`)
  — add Months 13-16 ripples.
- `apps/shared/witnessingEvents.ts` — add `two_witnesses_confess`,
  `the_watcher_named`, `voices_align`, `prestige_threshold`.
- `apps/shared/companionComments.ts` — add ~20 `cc_actN_*` entries
  named per act section above.
- `apps/shared/companionAskTopics.ts` — add new topics and the
  `alternateAnswers` field for act-gated variants.
- `apps/shared/act7ConvergenceOpponentDialog.ts` — new file mirroring
  `act1OpponentDialog.ts`.
- `apps/client/src/data/narrativeActs.ts` — **not modified** (dialog
  preserved); referenced only for trigger anchors.
- `docs/production/ALL_ACTS_ROADMAP.md` — update Cross-act system
  matrix to reflect binding (remove "❌ Wired?" marks as systems are
  bound).
