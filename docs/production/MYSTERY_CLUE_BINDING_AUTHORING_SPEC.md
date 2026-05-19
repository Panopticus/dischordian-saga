# Mystery Clue-Binding Authoring Spec

**Status:** authoring brief — unblocks the `mystery.progression-critical clue binding` ship-gate ratchet (currently 233 declared / 129 implemented / **104 unbound**).

**Why this is a spec, not a code change.** A clue is "bound" only when a room-mystery hotspot verb-response carries a `mysteryBinding` that credits it. Each binding is lore-matched prose woven into a thematically-correct hotspot (see the quality bar in `apps/shared/roomMysteries/archives.ts`). Bulk-attaching the 104 ids to a throwaway hotspot would tighten the gate number while leaving the arcs dead-ended — the exact gate-gaming `CLAUDE.md` forbids. This document gives a writer everything except the prose: the mechanism, the placement, and the per-clue narrative intent. The ratchet must only move by clues that are *actually, playably* bound.

---

## 1. Mechanism

The Mystery Engine advances an arc episode→episode when the player commits a deduction matching an authored edge whose `unlocksEpisode` is set. The DeductionPanel only lets the player pair clues they have **found**, and a clue is found when a room hotspot verb-response carrying a `mysteryBinding` credits it via `mysteryService.recordEvidence`.

Therefore **every progression-critical clue listed in §3 must be bound to some room hotspot**, or the arc strands the player on episode 1.

### Binding shape (copy-paste, from `archives.ts`)

Inside a room module's `responses: { "<hotspotId>": { <verb>: { ... } } }`, add `mysteryBinding` to the verb response the player would naturally use to discover that clue:

```ts
look: {
  narration: { /* WRITER: lore-accurate discovery prose for this clue */ },
  voId: "elara.<room>.<hotspot>.look",
  // Mystery Engine binding — surfaces this clue when the arc is the
  // active case. Lore match must be precise (see archives.ts comment).
  mysteryBinding: {
    mysteryId: "<arc id, e.g. charter.missing_signatory>",
    episodeId: "<episode id, e.g. charter.missing_signatory.e1>",
    cluesFound: ["<clue id, e.g. charter.e1.silt_fragment>"],
  },
},
```

- Files: `apps/shared/roomMysteries/<room>.ts`. Template: `_template.ts`.
- Multiple clues may bind on one hotspot's `cluesFound` array, but prefer **one clue per discovery beat** so the player earns them through play, not a single click.
- A clue should be discoverable in the episode it belongs to (the `eN` in its id) — don't gate an e1 clue behind e4 content.

### Acceptance criteria

- `pnpm ship:check` → `Mystery progression-critical clue binding` row: `implemented` rises by exactly the number of clues genuinely bound; gap and ratchet ceiling drop accordingly. **Never** run `--update-ratchet` to absorb a regression.
- `pnpm tsx scripts/_audit-mystery-binding-integrity.mjs` passes for each touched arc.
- Manual: load the arc, confirm each episode's clue pair is collectible and the deduction advances. An arc is "done" only when episodes 1→5 are walkable.

---

## 2. Recommended room map

Rooms are recommendations from the existing `roomMysteries/` set, matched to arc theme; a writer may override with a better lore fit. Where a perfect room doesn't exist (e.g. Memorial Plaza), the closest records/witness room is suggested and flagged.

| Arc | Primary room | Secondary | Rationale |
|---|---|---|---|
| `charter.missing_signatory` | `antiquarianLibrary` | `archives` | charters, silt-preserved fragments, archivist, preservation orders |
| `charter.second_signatory` | `antiquarianLibrary` | `orderTribunal` | mirror charters, council, house tax records |
| `severance.bound_champion` | `orderTribunal` | `guildSanctum` | bonds, season archives, broker, apprentice oath |
| `severance.infernal_clause` | `orderTribunal` | `quantumLab` | infernal contracts, handwriting; quantum-dating test |
| `mechronis.missing_professor` | `antiquarianLibrary` | `archives` | lectern, faculty robe, marginalia, faculty vote |
| `mechronis.chained_lesson` | `commsArray` | `antiquarianLibrary` | wave telemetry; curriculum / apprentice history |
| `memorial.forgotten_names` | `antiquarianLibrary` ⚠ | `observationDeck` | imprint records / keeper account (no Memorial-Plaza room — flag) |
| `memorial.seven_watchers` | `antiquarianLibrary` ⚠ | `orderTribunal` | signatures, council communiqué (same Plaza caveat) |
| `wolf.anara_hunt` | `commsArray` | `warRoom` | transmission intercept; crucible / hunt records |
| `akai_shi.red_death` | `medicalBay` | `shadowVault` | virus telemetry, energy signature, necromancer dossier |
| `resurrectionist.cycle_walker` | `quantumLab` | `shadowVault` | matrix energy ledger, wyrmhole signature, cycle authorship |
| `storm.architect_of_flux` | `elementalNexus` | `engineeringCore` | weather/flux telemetry, energy-balance audit |
| `advocate.blood_weave` | `shadowVault` | `orderTribunal` | founding charter, weave spec, sealed sacrum record |

⚠ Memorial arcs: no room canonically *is* the Memorial Plaza. Either (a) author the bindings into `antiquarianLibrary` records hotspots (the names/imprints exist as archived records there), or (b) raise a new `memorialPlaza.ts` room module with the production team. Recommendation: (a) to unblock without new scaffolding; revisit (b) if the Plaza becomes a playable room.

---

## 3. Per-arc binding worksheet

Each row: **clue id** → the deduction edge it feeds → **placement** (recommended room · hotspot/verb to author) · **narrative intent** (what the discovery must establish for the deduction to make sense — the writer supplies canon-accurate prose; ids/episode titles are the factual scaffold, do not invent lore beyond the LORE_BIBLE).

Episode pairs: each episode `eN` has exactly one progression-critical edge `[clueA + clueB] ⇒ unlocks e(N+1)`. Bind **both** clues in that episode's natural play space.

### charter.missing_signatory — "The First Charter — Missing Signatory" (room: antiquarianLibrary)

| Clue | Feeds (episode ⇒) | Placement · intent |
|---|---|---|
| `charter.e1.silt_fragment` | e1 ⇒ e2 (The Fragment in the Silt) | library · *look* a silt-encrusted document fragment; establish a physical charter fragment recovered from silt |
| `charter.e1.silt_layer` | e1 ⇒ e2 | library · *use* dating tool on the silt layer; establish the layer's age bounds the charter |
| `charter.e2.wax_chemistry` | e2 ⇒ e3 (Six Hands, Seven Marks) | library · *use* on seven wax seals; establish six hands but seven marks |
| `charter.e2.signatory_advocate` | e2 ⇒ e3 | library · *talk*/interrogate; establish one mark belongs to an Advocate signatory |
| `charter.e3.archivist_signature` | e3 ⇒ e4 (The Long-Lived Archivist) | library · *look* archivist's register; establish the archivist's own signature recurs across centuries |
| `charter.e3.preservation_orders` | e3 ⇒ e4 | library · *look* preservation-order ledger; establish who ordered the charter hidden/preserved |
| `charter.e4.witness_oath` | e4 ⇒ e5 (The Drawer That Locked Itself) | library · *interrogate*; establish the unbroken witness oath |
| `charter.e4.archivist_letter_back` | e4 ⇒ e5 | library · *use* on a sealed drawer; establish the archivist's letter (reverse side) naming the missing signatory |

### charter.second_signatory — "The Charter Schism — The Second Signatory" (room: antiquarianLibrary)

| Clue | Feeds | Placement · intent |
|---|---|---|
| `charter2.e1.mirror_charter` | e1 ⇒ e2 (Knock at the Council Door) | library · *look* a second, mirrored charter |
| `charter2.e1.two_charters_same_paper` | e1 ⇒ e2 | library · *use* fibre analysis; same paper stock as the first charter |
| `charter2.e2.descendant_account` | e2 ⇒ e3 (The House That Paid Taxes) | library/socialHub · *talk* a descendant; oral account of the house |
| `charter2.e2.charter_clause` | e2 ⇒ e3 | library · *look* the tax-binding clause |
| `charter2.e3.council_request` | e3 ⇒ e4 (Four Houses, One Hand) | orderTribunal · *use* council request record |
| `charter2.e3.heron_diary` | e3 ⇒ e4 | library · *look* Heron's diary (vol. A) |
| `charter2.e4.silence_as_vote` | e4 ⇒ e5 (Seventh Watcher) | orderTribunal · *interrogate*; establish silence counted as a vote |
| `charter2.e4.heron_diary_b` | e4 ⇒ e5 | library · *look* Heron's diary (vol. B) — names the second signatory |

### severance.bound_champion — "Severance — The Bound Champion" (room: orderTribunal)

| Clue | Feeds | Placement · intent |
|---|---|---|
| `severance.e1.unwritten_protocol` | e1 ⇒ e2 (The Bond on the Table) | tribunal · *look* the bond contract; an unwritten protocol clause |
| `severance.e1.vex_opening` | e1 ⇒ e2 | tribunal · *talk* Vex; an opening admission |
| `severance.e2.bond_logs` | e2 ⇒ e3 (Forty Seasons, One Knot) | tribunal/guildSanctum · *use* the bond logs |
| `severance.e2.season_archives` | e2 ⇒ e3 | guildSanctum · *look* forty seasons of archives |
| `severance.e3.broker_age` | e3 ⇒ e4 (Broker in the Back Room) | guildSanctum · *interrogate* the broker; the broker's true age |
| `severance.e3.year_one_lap` | e3 ⇒ e4 | tribunal · *use* lap records; a year-one anomaly |
| `severance.e4.vex_confession` | e4 ⇒ e5 (The Apprentice Slot) | tribunal · *interrogate* Vex; the confession |
| `severance.e4.apprentice_oath` | e4 ⇒ e5 | guildSanctum · *look* the apprentice oath naming the bound champion |

### severance.infernal_clause — "Severance — The Hierarchy Audit" (room: orderTribunal · quantumLab)

| Clue | Feeds | Placement · intent |
|---|---|---|
| `infernal.e1.infernal_clause` | e1 ⇒ e2 (Zyr'Koth at the Door) | tribunal · *look* the infernal clause |
| `infernal.e1.epoch_one_contract` | e1 ⇒ e2 | tribunal · *use* archive; an Epoch-One contract |
| `infernal.e2.handwriting_consistency` | e2 ⇒ e3 (Forty Seasons of Contracts) | tribunal · *use* handwriting comparison across seasons |
| `infernal.e2.season_ledger_keepers` | e2 ⇒ e3 | guildSanctum · *look* ledger keepers per season |
| `infernal.e3.atalin_handwriting` | e3 ⇒ e4 (Quantum-Dating Test) | quantumLab · *use*; Atalin's handwriting sample |
| `infernal.e3.dating_results` | e3 ⇒ e4 | quantumLab · *look* the quantum-dating results |
| `infernal.e4.the_flaw` | e4 ⇒ e5 (Atalin's Single Room) | quantumLab · *interrogate*; the flaw in the clause |
| `infernal.e4.zyrkoth_response` | e4 ⇒ e5 | tribunal · *talk* Zyr'Koth; the response |

### mechronis.missing_professor — "Mechronis — The Missing Professor" (room: antiquarianLibrary)

| Clue | Feeds | Placement · intent |
|---|---|---|
| `mechronis.e1.empty_lectern` | e1 ⇒ e2 (Empty Lectern) | library · *look* the empty lectern |
| `mechronis.e1.folded_robe` | e1 ⇒ e2 | library · *look* the folded faculty robe |
| `mechronis.e2.tarn_marginalia` | e2 ⇒ e3 (Three Faculties, Three Terms) | library · *use* a text; Tarn's marginalia |
| `mechronis.e2.binder_partial` | e2 ⇒ e3 | library · *look* a partial binder |
| `mechronis.e3.recovered_audio` | e3 ⇒ e4 (The Erasure Was Voted) | library/commsArray · *use* recovered audio |
| `mechronis.e3.unanimous_silence` | e3 ⇒ e4 | library · *interrogate*; the unanimous faculty silence |
| `mechronis.e4.roen_full_account` | e4 ⇒ e5 (Tarn Left on Purpose) | library · *talk* Roen; full account |
| `mechronis.e4.tarn_recorded_message` | e4 ⇒ e5 | library · *use*; Tarn's recorded message |

### mechronis.chained_lesson — "Mechronis — The Chained Lesson" (room: commsArray · antiquarianLibrary)

| Clue | Feeds | Placement · intent |
|---|---|---|
| `chained.e1.wave_telemetry` | e1 ⇒ e2 (Wave Is Fourteen Minutes Out) | commsArray · *use* telemetry; incoming wave ETA |
| `chained.e1.apprentice_history` | e1 ⇒ e2 | library · *look* apprentice history |
| `chained.e2.curriculum_diff` | e2 ⇒ e3 (Fourteen Years of Failures) | library · *use*; curriculum diff across years |
| `chained.e2.feint_pattern` | e2 ⇒ e3 | commsArray · *look*; a feint pattern in the data |
| `chained.e3.auro_curriculum` | e3 ⇒ e4 (The Teacher Who Taught Anyway) | library · *look* Auro's curriculum |
| `chained.e3.twelve_apprentices` | e3 ⇒ e4 | library · *interrogate*; the twelve apprentices |
| `chained.e4.tarn_argument` | e4 ⇒ e5 (Module That Was Always There) | library · *talk*; Tarn's argument |
| `chained.e4.tarn_marginalia_third` | e4 ⇒ e5 | library · *use*; Tarn's third marginalia |

### memorial.forgotten_names — "Memorial — The Forgotten Names" (room: antiquarianLibrary ⚠)

| Clue | Feeds | Placement · intent |
|---|---|---|
| `memorial.e1.unwitnessed_id_list` | e1 ⇒ e2 (The Plaza Opens) | library · *look* the unwitnessed-ID list |
| `memorial.e1.antiquarian_request` | e1 ⇒ e2 | library · *talk*; the antiquarian's request |
| `memorial.e2.imprint_i17` | e2 ⇒ e3 (Listening to the Imprints) | observationDeck · *use*; imprint I-17 |
| `memorial.e2.keeper_account` | e2 ⇒ e3 | library · *talk*; the keeper's account |
| `memorial.e3.first_pass_results` | e3 ⇒ e4 (Cross-Referencing the Fourteen) | library · *use*; first-pass cross-reference |
| `memorial.e3.parental_imprint_search` | e3 ⇒ e4 | observationDeck · *use*; parental imprint search |
| `memorial.e4.first_imprint_record` | e4 ⇒ e5 (The Page That Was Torn) | library · *look*; the first imprint record |
| `memorial.e4.architect_letter` | e4 ⇒ e5 | library · *use*; the architect's letter |

### memorial.seven_watchers — "Memorial — The Seven Watchers" (room: antiquarianLibrary ⚠)

| Clue | Feeds | Placement · intent |
|---|---|---|
| `watchers.e1.silence_break_log` | e1 ⇒ e2 (The Silence Cracks) | library/commsArray · *use*; the silence-break log |
| `watchers.e1.upper_band_signature` | e1 ⇒ e2 | commsArray · *look*; an upper-band signature |
| `watchers.e2.idris_signature` | e2 ⇒ e3 (Idris and Verel) | library · *look*; Idris's signature |
| `watchers.e2.idris_archive_role` | e2 ⇒ e3 | library · *interrogate*; Idris's archive role |
| `watchers.e3.six_signatures_complete` | e3 ⇒ e4 (Ophran, Kallium, Mereth, Sothe) | library · *use*; six of seven signatures complete |
| `watchers.e3.council_communique` | e3 ⇒ e4 | orderTribunal · *look*; the council communiqué |
| `watchers.e4.line_in_apprentice_hand` | e4 ⇒ e5 (Silent Watcher's Empty Role) | library · *look*; a line in an apprentice's hand |
| `watchers.e4.per_m_confirms` | e4 ⇒ e5 | library · *talk*; Per M. confirms |

### wolf.anara_hunt — "Wolf — Anara Hunt" (room: commsArray · warRoom)

| Clue | Feeds | Placement · intent |
|---|---|---|
| `wolf.e1.empty_chair` | e1 ⇒ e2 (Empty Chair in the League) | warRoom · *look*; the empty League chair |
| `wolf.e1.transmission_intercept` | e1 ⇒ e2 | commsArray · *use*; the transmission intercept |
| `wolf.e2.three_more_chairs` | e2 ⇒ e3 (Predator's Pattern) | warRoom · *look*; three more empty chairs |
| `wolf.e2.host_residue` | e2 ⇒ e3 | medicalBay · *use*; host residue |
| `wolf.e3.judge_clarification` | e3 ⇒ e4 (The Two Names) | orderTribunal · *interrogate*; the judge's clarification |
| `wolf.e3.crucible_records` | e3 ⇒ e4 | warRoom · *use*; crucible records |
| `wolf.e4.crucible_inheritance` | e4 ⇒ e5 (The Way In) | warRoom · *look*; the crucible inheritance |
| `wolf.e4.antiquarian_blind_spot` | e4 ⇒ e5 | library · *interrogate*; the antiquarian's blind spot |

### akai_shi.red_death — "Akai Shi — The Red Death" (room: medicalBay · shadowVault)

| Clue | Feeds | Placement · intent |
|---|---|---|
| `akai.e1.akai_last_recorded` | e1 ⇒ e2 (Mercy on Thaloria) | medicalBay · *use*; Akai's last recorded appearance |
| `akai.e1.virus_telemetry` | e1 ⇒ e2 | medicalBay · *look*; virus telemetry |
| `akai.e2.altered_energy_signature` | e2 ⇒ e3 (Resurrectionist's Hand) | shadowVault · *use*; altered energy signature |
| `akai.e2.samsaras_child_seal` | e2 ⇒ e3 | shadowVault · *look*; Samsara's-child seal |
| `akai.e3.necromancer_dossier` | e3 ⇒ e4 (The Mandate) | shadowVault · *look*; the necromancer dossier |
| `akai.e3.necromancer_evasion_log` | e3 ⇒ e4 | commsArray · *use*; the evasion log |
| `akai.e4.necromancers_retreat_chambers` | e4 ⇒ e5 (Matrix of Dreams Hunt) | shadowVault · *look*; the retreat chambers |
| `akai.e4.cycle_fold_anomalies` | e4 ⇒ e5 | quantumLab · *use*; cycle-fold anomalies |

### resurrectionist.cycle_walker — "The Resurrectionist — The Cycle Walker" (room: quantumLab · shadowVault)

| Clue | Feeds | Placement · intent |
|---|---|---|
| `resur.e1.case_seal` | e1 ⇒ e2 (The Vanishing) | shadowVault · *look*; the case seal |
| `resur.e1.matrix_energy_ledger` | e1 ⇒ e2 | quantumLab · *use*; the matrix energy ledger |
| `resur.e2.authoring_signature` | e2 ⇒ e3 (Authorship of the Cycle) | quantumLab · *use*; the authoring signature |
| `resur.e2.second_fall_casualty_count` | e2 ⇒ e3 | warRoom · *look*; Second Fall casualty count |
| `resur.e3.necromancer_last_recorded_appearance` | e3 ⇒ e4 (Plague Dragon's Site) | shadowVault · *look*; last recorded appearance |
| `resur.e3.hosts_wyrmhole_signature` | e3 ⇒ e4 | quantumLab · *use*; the host's wyrmhole signature |
| `resur.e4.silences_claim_record` | e4 ⇒ e5 (Body and the Mask) | shadowVault · *interrogate*; the Silence's claim record |
| `resur.e4.pre_empire_twin_text` | e4 ⇒ e5 | library · *look*; the pre-Empire twin text |

### storm.architect_of_flux — "The Storm — The Architect of Flux" (room: elementalNexus · engineeringCore)

| Clue | Feeds | Placement · intent |
|---|---|---|
| `storm.e1.weather_telemetry` | e1 ⇒ e2 (The Flux Generator) | elementalNexus · *use*; weather telemetry |
| `storm.e1.flux_signature` | e1 ⇒ e2 | elementalNexus · *look*; the flux signature |
| `storm.e2.energy_balance_audit` | e2 ⇒ e3 (The Polarity) | engineeringCore · *use*; energy-balance audit |
| `storm.e2.judges_arbitration_register` | e2 ⇒ e3 | orderTribunal · *look*; the judge's arbitration register |
| `storm.e3.inventors_heist_window` | e3 ⇒ e4 (The Opportunists) | engineeringCore · *use*; the inventor's heist window |
| `storm.e3.advocates_blood_weave` | e3 ⇒ e4 | shadowVault · *look*; the Advocate's blood weave reference |
| `storm.e4.full_calms_register` | e4 ⇒ e5 (Ledger of Calms) | elementalNexus · *look*; the full calms register |
| `storm.e4.event_correlation_table` | e4 ⇒ e5 | engineeringCore · *use*; the event-correlation table |

### advocate.blood_weave — "The Advocate — The Blood Weave" (room: shadowVault · orderTribunal)

| Clue | Feeds | Placement · intent |
|---|---|---|
| `adv.e1.founding_charter` | e1 ⇒ e2 (Empire of Shadows) | shadowVault · *look*; the founding charter |
| `adv.e1.hierarchy_acquisition_attempts` | e1 ⇒ e2 | shadowVault · *use*; hierarchy acquisition attempts |
| `adv.e2.weave_specification_partial` | e2 ⇒ e3 (The Blood Weave) | shadowVault · *look*; partial weave specification |
| `adv.e2.riri_ahlia_siege_record` | e2 ⇒ e3 | warRoom · *use*; the Riri-Ahlia siege record |
| `adv.e3.sylvex_recruitment_pitch` | e3 ⇒ e4 (The Mirror) | socialHub · *talk*; Sylvex's recruitment pitch |
| `adv.e3.sealed_sacrum_record` | e3 ⇒ e4 | shadowVault · *look*; the sealed sacrum record |
| `adv.e4.humanity_trade_specification` | e4 ⇒ e5 (The Personal Cost) | shadowVault · *use*; the humanity-trade specification |
| `adv.e4.ninth_conexus_story` | e4 ⇒ e5 | socialHub · *talk*; the Ninth Conexus story |

---

## 4. Suggested execution order

Sequence by room clarity and reuse, so a writer builds momentum and one room's voice is established before the next:

1. **antiquarianLibrary cluster** — `charter.missing_signatory`, `charter.second_signatory`, `mechronis.missing_professor`, `mechronis.chained_lesson` (32 clues). Cleanest thematic fit; one room voice.
2. **orderTribunal cluster** — `severance.bound_champion`, `severance.infernal_clause` (16).
3. **shadowVault / quantumLab cluster** — `akai_shi.red_death`, `resurrectionist.cycle_walker`, `advocate.blood_weave` (24).
4. **specialised rooms** — `wolf.anara_hunt` (commsArray/warRoom), `storm.architect_of_flux` (elementalNexus/engineeringCore) (16).
5. **Memorial caveat arcs last** — `memorial.forgotten_names`, `memorial.seven_watchers` (16). Resolve the Plaza-room decision (§2 ⚠) before authoring.

Bind one full arc, run `pnpm ship:check` + the audit script + a manual e1→e5 walk, commit per arc. The ratchet tightens by 8 per completed arc — visibly, honestly, regression-proof.
